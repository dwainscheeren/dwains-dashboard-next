import { describe, expect, it, vi } from 'vitest';
import {
  SLIDESHOW_LIMITS,
  collectSlideshowImages,
  createSlidePlaylist,
  isFolderMediaItem,
  isImageMediaItem,
  photoFolders,
  photoImages,
  shuffled,
  type MediaItem,
} from '../src/utils/screensaver-media';

const ROOT = 'media-source://media_source/local/photos';

function image(name: string, folder = ROOT): MediaItem {
  return {
    title: name,
    media_content_id: `${folder}/${name}`,
    media_class: 'image',
    media_content_type: 'image/jpeg',
    can_expand: false,
  };
}

function folder(name: string, parent = ROOT): MediaItem {
  return {
    title: name,
    media_content_id: `${parent}/${name}`,
    media_class: 'directory',
    media_content_type: '',
    can_expand: true,
  };
}

/** A browse function over a fixed tree: folder id to children. */
function library(tree: Record<string, MediaItem[]>) {
  return vi.fn(async (id: string): Promise<MediaItem> => {
    const children = tree[id];
    if (!children) throw new Error('Path does not exist.');
    return { title: id.split('/').pop() || '', media_content_id: id, can_expand: true, children };
  });
}

/** A repeatable random source, so shuffles in tests are stable. */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

describe('media items', () => {
  it('recognizes images by class, type or file name', () => {
    expect(isImageMediaItem(image('a.jpg'))).toBe(true);
    expect(isImageMediaItem({ title: 'a', media_content_id: 'x', media_content_type: 'image/png' })).toBe(true);
    expect(isImageMediaItem({ title: 'holiday.WEBP', media_content_id: 'x', media_content_type: '' })).toBe(true);
    expect(isImageMediaItem({ title: 'clip.mp4', media_content_id: 'x', media_class: 'video', media_content_type: 'video/mp4' })).toBe(false);
    expect(isImageMediaItem({ title: 'notes.txt', media_content_id: 'x' })).toBe(false);
    expect(isImageMediaItem(folder('photos.jpg'))).toBe(false);
    expect(isImageMediaItem(undefined)).toBe(false);
  });

  it('recognizes folders with a media id', () => {
    expect(isFolderMediaItem(folder('trips'))).toBe(true);
    expect(isFolderMediaItem(image('a.jpg'))).toBe(false);
    expect(isFolderMediaItem({ title: 'odd', media_content_id: '/local', can_expand: true })).toBe(false);
  });

  it('lists folders without the sources that never hold photos', () => {
    const sources: MediaItem = {
      title: 'Media',
      media_content_id: 'media-source://',
      children: [
        { title: 'My media', media_content_id: 'media-source://media_source', can_expand: true },
        { title: 'Text-to-speech', media_content_id: 'media-source://tts', can_expand: true },
        { title: 'Radio Browser', media_content_id: 'media-source://radio_browser', can_expand: true },
        { title: 'Camera', media_content_id: 'media-source://camera', can_expand: true },
        { title: 'Image upload', media_content_id: 'media-source://image_upload', can_expand: true },
      ],
    };
    expect(photoFolders(sources).map((item) => item.title)).toEqual(['My media', 'Image upload']);
    expect(photoFolders(undefined)).toEqual([]);
  });

  it('lists the images of a folder', () => {
    const item: MediaItem = { title: 'photos', media_content_id: ROOT, children: [folder('trips'), image('a.jpg'), image('b.jpg')] };
    expect(photoImages(item).map((child) => child.title)).toEqual(['a.jpg', 'b.jpg']);
  });
});

describe('collecting the photos of a folder', () => {
  it('reads the folder and its subfolders, the chosen folder first', async () => {
    const browse = library({
      [ROOT]: [folder('trips'), image('a.jpg'), image('b.jpg')],
      [`${ROOT}/trips`]: [image('c.jpg', `${ROOT}/trips`), folder('2024', `${ROOT}/trips`)],
      [`${ROOT}/trips/2024`]: [image('d.jpg', `${ROOT}/trips/2024`)],
    });

    await expect(collectSlideshowImages(browse, ROOT)).resolves.toEqual([
      `${ROOT}/a.jpg`,
      `${ROOT}/b.jpg`,
      `${ROOT}/trips/c.jpg`,
      `${ROOT}/trips/2024/d.jpg`,
    ]);
  });

  it('gives an empty list for a folder without photos', async () => {
    const browse = library({ [ROOT]: [{ title: 'clip.mp4', media_content_id: `${ROOT}/clip.mp4`, media_class: 'video', media_content_type: 'video/mp4' }] });
    await expect(collectSlideshowImages(browse, ROOT)).resolves.toEqual([]);
  });

  it('throws when the chosen folder itself cannot be read', async () => {
    await expect(collectSlideshowImages(library({}), ROOT)).rejects.toThrow('Path does not exist.');
  });

  it('skips a subfolder that cannot be read', async () => {
    const browse = library({ [ROOT]: [folder('gone'), image('a.jpg')] });
    await expect(collectSlideshowImages(browse, ROOT)).resolves.toEqual([`${ROOT}/a.jpg`]);
  });

  it('stops at the photo limit', async () => {
    const many = Array.from({ length: 30 }, (_, index) => image(`${index}.jpg`));
    const browse = library({ [ROOT]: [folder('more'), ...many], [`${ROOT}/more`]: [image('x.jpg', `${ROOT}/more`)] });

    const images = await collectSlideshowImages(browse, ROOT, { ...SLIDESHOW_LIMITS, maxImages: 10 });
    expect(images).toHaveLength(10);
    // The limit is reached in the first folder: the subfolder is never read.
    expect(browse).toHaveBeenCalledTimes(1);
  });

  it('stops at the folder limit and at the depth limit', async () => {
    const browse = library({
      [ROOT]: [folder('a'), folder('b'), folder('c')],
      [`${ROOT}/a`]: [image('1.jpg', `${ROOT}/a`), folder('deep', `${ROOT}/a`)],
      [`${ROOT}/b`]: [image('2.jpg', `${ROOT}/b`)],
      [`${ROOT}/c`]: [image('3.jpg', `${ROOT}/c`)],
      [`${ROOT}/a/deep`]: [image('4.jpg', `${ROOT}/a/deep`)],
    });

    await expect(collectSlideshowImages(browse, ROOT, { maxImages: 100, maxFolders: 3, maxDepth: 3 }))
      .resolves.toEqual([`${ROOT}/a/1.jpg`, `${ROOT}/b/2.jpg`]);

    browse.mockClear();
    await expect(collectSlideshowImages(browse, ROOT, { maxImages: 100, maxFolders: 40, maxDepth: 1 }))
      .resolves.toEqual([`${ROOT}/a/1.jpg`, `${ROOT}/b/2.jpg`, `${ROOT}/c/3.jpg`]);
    expect(browse).toHaveBeenCalledTimes(4);
  });

  it('reads a folder once, also when it is listed twice', async () => {
    const browse = library({
      [ROOT]: [folder('a'), folder('a')],
      [`${ROOT}/a`]: [image('1.jpg', `${ROOT}/a`), { ...folder('photos', 'media-source://media_source/local'), title: 'back to start' }],
    });
    await expect(collectSlideshowImages(browse, ROOT)).resolves.toEqual([`${ROOT}/a/1.jpg`]);
    expect(browse).toHaveBeenCalledTimes(2);
  });
});

describe('slideshow order', () => {
  it('shuffles without losing or changing photos', () => {
    const items = ['a', 'b', 'c', 'd', 'e', 'f'];
    const result = shuffled(items, seededRandom(7));
    expect([...result].sort()).toEqual(items);
    expect(result).not.toEqual(items);
    // The original list is left alone.
    expect(items).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });

  it('plays the photos in order and starts over', () => {
    const playlist = createSlidePlaylist(['a', 'b', 'c'], false);
    expect([1, 2, 3, 4, 5].map(() => playlist.next())).toEqual(['a', 'b', 'c', 'a', 'b']);
  });

  it('shows every photo once per round when shuffled', () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const playlist = createSlidePlaylist(items, true, seededRandom(3));
    for (let round = 0; round < 4; round++) {
      const shown = items.map(() => playlist.next());
      expect([...shown].sort()).toEqual(items);
    }
  });

  it('never repeats the last photo at the start of the next round', () => {
    const items = ['a', 'b', 'c'];
    for (let seed = 1; seed <= 40; seed++) {
      const playlist = createSlidePlaylist(items, true, seededRandom(seed));
      let previous: string | undefined;
      for (let step = 0; step < 30; step++) {
        const current = playlist.next();
        expect(current).not.toBe(previous);
        previous = current;
      }
    }
  });

  it('keeps showing a single photo and gives nothing for an empty folder', () => {
    const single = createSlidePlaylist(['only'], true);
    expect([single.next(), single.next(), single.next()]).toEqual(['only', 'only', 'only']);
    expect(createSlidePlaylist([], true).next()).toBeUndefined();
  });
});
