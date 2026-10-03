// Photos for the wall tablet screensaver come from the Home Assistant media
// sources ("My media", uploaded images, photo integrations). A folder is read
// with media_source/browse_media and a photo gets a signed, temporary address
// from media_source/resolve_media right before it is shown.

import type { HomeAssistant } from '../types/home-assistant';
import { isMediaSourceId } from './wall-tablet';

/** One item of a media_source/browse_media answer. */
export interface MediaItem {
  title: string;
  media_content_id: string;
  media_class?: string;
  media_content_type?: string;
  can_expand?: boolean;
  thumbnail?: string | null;
  children?: MediaItem[] | null;
}

export interface SlideshowLimits {
  /** Stop collecting after this many photos. */
  maxImages: number;
  /** Read at most this many folders, the chosen folder included. */
  maxFolders: number;
  /** How many levels of subfolders are read below the chosen folder. */
  maxDepth: number;
}

/** Keeps a huge photo library from flooding Home Assistant with requests. */
export const SLIDESHOW_LIMITS: Readonly<SlideshowLimits> = Object.freeze({
  maxImages: 500,
  maxFolders: 40,
  maxDepth: 3,
});

const IMAGE_EXTENSION = /\.(avif|bmp|gif|jpe?g|png|webp)$/i;

/** Media sources that never hold photos; left out of the folder picker. */
const SOURCES_WITHOUT_PHOTOS = new Set([
  'media-source://camera',
  'media-source://radio_browser',
  'media-source://tts',
]);

export function isImageMediaItem(item: MediaItem | null | undefined): boolean {
  if (!item || item.can_expand) return false;
  if (item.media_class === 'image') return true;
  if (typeof item.media_content_type === 'string' && item.media_content_type.startsWith('image/')) return true;
  // Some sources leave the type empty; the file name still tells.
  return !item.media_content_type && IMAGE_EXTENSION.test(item.title || '');
}

export function isFolderMediaItem(item: MediaItem | null | undefined): boolean {
  return Boolean(item && item.can_expand && isMediaSourceId(item.media_content_id));
}

/** The folders of a browsed item that are worth opening when looking for photos. */
export function photoFolders(item: MediaItem | null | undefined): MediaItem[] {
  return (item?.children || []).filter(
    (child) => isFolderMediaItem(child) && !SOURCES_WITHOUT_PHOTOS.has(child.media_content_id)
  );
}

export function photoImages(item: MediaItem | null | undefined): MediaItem[] {
  return (item?.children || []).filter(isImageMediaItem);
}

/**
 * The media ids of the photos in a folder and its subfolders, the chosen
 * folder first. A subfolder that fails to load is skipped; a failure of the
 * chosen folder itself is thrown, so the caller can tell it apart from an
 * empty folder.
 */
export async function collectSlideshowImages(
  browse: (mediaContentId: string) => Promise<MediaItem>,
  folderId: string,
  limits: SlideshowLimits = SLIDESHOW_LIMITS
): Promise<string[]> {
  const images: string[] = [];
  const seen = new Set<string>([folderId]);
  const queue: Array<{ id: string; depth: number }> = [{ id: folderId, depth: 0 }];
  let foldersRead = 0;

  while (queue.length && foldersRead < limits.maxFolders && images.length < limits.maxImages) {
    const { id, depth } = queue.shift()!;
    foldersRead += 1;

    let folder: MediaItem;
    try {
      folder = await browse(id);
    } catch (error) {
      if (id === folderId) throw error;
      continue;
    }

    for (const child of folder.children || []) {
      if (isImageMediaItem(child)) {
        if (images.length < limits.maxImages) images.push(child.media_content_id);
      } else if (depth < limits.maxDepth && isFolderMediaItem(child) && !seen.has(child.media_content_id)) {
        seen.add(child.media_content_id);
        queue.push({ id: child.media_content_id, depth: depth + 1 });
      }
    }
  }

  return images;
}

/** A shuffled copy (Fisher-Yates). */
export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other]!, result[index]!];
  }
  return result;
}

export interface SlidePlaylist {
  /** The next photo; starts a new round when every photo was shown. */
  next(): string | undefined;
}

/**
 * Every photo is shown once per round. A shuffled playlist gets a new order
 * each round and never repeats the last photo of the previous round first.
 */
export function createSlidePlaylist(
  items: readonly string[],
  shuffle: boolean,
  random: () => number = Math.random
): SlidePlaylist {
  let round: string[] = [];
  let position = 0;
  let last: string | undefined;

  const startRound = () => {
    round = shuffle ? shuffled(items, random) : [...items];
    if (shuffle && round.length > 1 && round[0] === last) {
      [round[0], round[1]] = [round[1]!, round[0]!];
    }
    position = 0;
  };

  return {
    next() {
      if (!items.length) return undefined;
      if (position >= round.length) startRound();
      last = round[position];
      position += 1;
      return last;
    },
  };
}

// ---- Home Assistant requests ------------------------------------------------

/** Read a media folder; without an id the list of media sources. */
export function browseMedia(hass: HomeAssistant, mediaContentId?: string): Promise<MediaItem> {
  return hass.callWS<MediaItem>({
    type: 'media_source/browse_media',
    ...(mediaContentId ? { media_content_id: mediaContentId } : {}),
  });
}

/** The address of an image: a media id is resolved, a link is used as it is. */
export async function resolveImageUrl(hass: HomeAssistant, image: string): Promise<string> {
  if (!isMediaSourceId(image)) return image;
  const resolved = await hass.callWS<{ url: string }>({
    type: 'media_source/resolve_media',
    media_content_id: image,
  });
  const hassUrl = (hass as { hassUrl?: (path?: string) => string }).hassUrl;
  return typeof hassUrl === 'function' ? hassUrl.call(hass, resolved.url) : resolved.url;
}
