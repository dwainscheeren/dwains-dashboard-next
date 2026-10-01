import { LitElement, PropertyValues, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { mdiMovieOpen, mdiMusic, mdiPause, mdiPlay, mdiSkipNext } from '@mdi/js';

import type { HassEntity, HomeAssistant } from '../types/home-assistant';
import { ddLocalize } from '../utils/localize';
import {
  canSkipToNextTrack,
  canTogglePlayback,
  getNowPlayingArtworkUrl,
  getNowPlayingLabels,
  isPlayingState,
} from '../utils/now-playing';
import { getEntityRegistry } from '../utils/entity-registry';
import { fireEvent } from './utils/fire-event';

export interface NowPlayingPlayer {
  entityId: string;
  roomName?: string;
}

// The optimistic play/pause icon is kept until Home Assistant reports the new
// state, or at most this long.
const OPTIMISTIC_TTL_MS = 5000;
const VIDEO_CONTENT_TYPES: ReadonlySet<string> = new Set(['video', 'movie', 'tvshow', 'episode', 'channel']);

interface OptimisticPlayback {
  entityId: string;
  state: 'playing' | 'paused';
  expiresAt: number;
}

/**
 * Compact "Now playing" bar: artwork, title, artist and room of a media
 * player, with play/pause and next track. The layout card picks the players
 * (most relevant first). With several players a "+N" button cycles through
 * them. The player the user switched to or controlled stays in the bar while
 * it is still in the list; otherwise the first player is shown.
 */
@customElement('dwains-dashboard-next-now-playing')
export class DwainsNowPlayingBar extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public players: NowPlayingPlayer[] = [];
  /** Floating above the mobile bottom navigation instead of inline. */
  @property({ type: Boolean, reflect: true }) public floating = false;

  @state() private _pinnedEntityId?: string;
  @state() private _optimistic?: OptimisticPlayback;
  @state() private _brokenArtwork?: string;
  private _optimisticTimer?: number;

  private _t(key: string, vars?: Record<string, string | number>): string {
    return ddLocalize(this.hass, key, vars);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearOptimisticTimer();
  }

  protected override willUpdate(changedProps: PropertyValues): void {
    super.willUpdate(changedProps);
    if (changedProps.has('hass') && this._optimistic) {
      const actual = this.hass?.states?.[this._optimistic.entityId]?.state;
      const expected = this._optimistic.state;
      const reached = expected === 'playing' ? isPlayingState(actual) : actual === expected;
      if (reached || this._optimistic.expiresAt <= Date.now()) this._clearOptimistic();
    }
  }

  private _currentPlayer(): NowPlayingPlayer | undefined {
    const players = this.players || [];
    return players.find((player) => player.entityId === this._pinnedEntityId) || players[0];
  }

  private _shownState(stateObj: HassEntity): string {
    const optimistic = this._optimistic;
    if (optimistic && optimistic.entityId === stateObj.entity_id && optimistic.expiresAt > Date.now()) {
      return optimistic.state;
    }
    return stateObj.state;
  }

  private _playerName(stateObj: HassEntity): string {
    return stateObj.attributes?.friendly_name ||
      getEntityRegistry(this.hass)[stateObj.entity_id]?.name ||
      stateObj.entity_id;
  }

  private _openMoreInfo(entityId: string): void {
    fireEvent(this, 'hass-more-info', { entityId });
  }

  private _cycle(): void {
    const players = this.players || [];
    if (players.length < 2) return;
    const current = this._currentPlayer();
    const index = players.findIndex((player) => player.entityId === current?.entityId);
    this._pinnedEntityId = players[(index + 1) % players.length]!.entityId;
  }

  private async _togglePlayback(stateObj: HassEntity, name: string): Promise<void> {
    const entityId = stateObj.entity_id;
    const next = isPlayingState(this._shownState(stateObj)) ? 'paused' : 'playing';
    this._pinnedEntityId = entityId;
    this._optimistic = { entityId, state: next, expiresAt: Date.now() + OPTIMISTIC_TTL_MS };
    this._scheduleOptimisticExpiry();
    try {
      await this.hass!.callService('media_player', 'media_play_pause', { entity_id: entityId });
    } catch (err) {
      console.warn(`Failed to play or pause ${entityId}:`, err);
      if (this._optimistic?.entityId === entityId) this._clearOptimistic();
      this._showFailure(name);
    }
  }

  private async _nextTrack(stateObj: HassEntity, name: string): Promise<void> {
    const entityId = stateObj.entity_id;
    this._pinnedEntityId = entityId;
    try {
      await this.hass!.callService('media_player', 'media_next_track', { entity_id: entityId });
    } catch (err) {
      console.warn(`Failed to skip to the next track on ${entityId}:`, err);
      this._showFailure(name);
    }
  }

  private _showFailure(name: string): void {
    fireEvent(this, 'hass-notification', { message: this._t('now_playing.update_failed', { name }) });
  }

  private _scheduleOptimisticExpiry(): void {
    this._clearOptimisticTimer();
    this._optimisticTimer = window.setTimeout(() => {
      this._optimisticTimer = undefined;
      this._optimistic = undefined;
    }, OPTIMISTIC_TTL_MS + 50);
  }

  private _clearOptimistic(): void {
    this._optimistic = undefined;
    this._clearOptimisticTimer();
  }

  private _clearOptimisticTimer(): void {
    if (this._optimisticTimer !== undefined) {
      window.clearTimeout(this._optimisticTimer);
      this._optimisticTimer = undefined;
    }
  }

  private _icon(path: string) {
    return html`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d=${path}></path></svg>`;
  }

  protected override render() {
    const player = this._currentPlayer();
    const stateObj = player ? this.hass?.states?.[player.entityId] : undefined;
    if (!player || !stateObj) return nothing;

    const playerName = this._playerName(stateObj);
    const { title, artist } = getNowPlayingLabels(stateObj, playerName);
    // Without a room, the player name tells where it plays.
    const place = player.roomName || (title !== playerName ? playerName : '');
    const subtitle = [artist, place].filter(Boolean).join(' · ');
    const label = player.roomName || playerName;
    const shownState = this._shownState(stateObj);
    const playing = isPlayingState(shownState);
    const artwork = getNowPlayingArtworkUrl(stateObj, (this.hass as any)?.hassUrl?.bind(this.hass));
    const showArtwork = artwork && artwork !== this._brokenArtwork;
    const contentType = String(stateObj.attributes?.media_content_type || '');
    const others = (this.players?.length || 0) - 1;

    return html`
      <div class="bar ${playing ? 'is-playing' : 'is-paused'}" role="region" aria-label=${this._t('now_playing.title')}>
        <button
          class="info"
          type="button"
          title=${this._t('now_playing.details', { name: label })}
          aria-label=${`${title}${subtitle ? `, ${subtitle}` : ''}. ${this._t('now_playing.details', { name: label })}`}
          @click=${() => this._openMoreInfo(stateObj.entity_id)}
        >
          <span class="art">
            ${showArtwork ? html`
              <img
                src=${artwork}
                alt=""
                decoding="async"
                referrerpolicy="no-referrer"
                @error=${() => { this._brokenArtwork = artwork; }}
              />
            ` : this._icon(VIDEO_CONTENT_TYPES.has(contentType) ? mdiMovieOpen : mdiMusic)}
          </span>
          <span class="text">
            <span class="title">${title}</span>
            ${subtitle ? html`<span class="subtitle">${subtitle}</span>` : nothing}
          </span>
        </button>
        <div class="controls">
          ${others > 0 ? html`
            <button
              class="more"
              type="button"
              title=${this._t('now_playing.more_players', { count: others })}
              aria-label=${this._t('now_playing.more_players', { count: others })}
              @click=${this._cycle}
            >+${others}</button>
          ` : nothing}
          ${canTogglePlayback(stateObj, shownState) ? html`
            <button
              class="control primary"
              type="button"
              title=${this._t(playing ? 'now_playing.pause' : 'now_playing.play', { name: label })}
              aria-label=${this._t(playing ? 'now_playing.pause' : 'now_playing.play', { name: label })}
              @click=${() => this._togglePlayback(stateObj, label)}
            >
              ${this._icon(playing ? mdiPause : mdiPlay)}
            </button>
          ` : nothing}
          ${canSkipToNextTrack(stateObj) ? html`
            <button
              class="control"
              type="button"
              title=${this._t('now_playing.next', { name: label })}
              aria-label=${this._t('now_playing.next', { name: label })}
              @click=${() => this._nextTrack(stateObj, label)}
            >
              ${this._icon(mdiSkipNext)}
            </button>
          ` : nothing}
        </div>
      </div>
    `;
  }

  static override styles = css`
    :host {
      display: block;
      min-width: 0;
      -webkit-tap-highlight-color: transparent;
    }

    .bar {
      box-sizing: border-box;
      min-height: 60px;
      padding: 6px 8px 6px 6px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 14px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border: 1px solid color-mix(in srgb, var(--divider-color, rgba(0, 0, 0, 0.12)) 70%, transparent);
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
    }

    :host([floating]) .bar {
      border-radius: 18px;
      background: color-mix(in srgb, var(--card-background-color, #fff) 90%, transparent);
      box-shadow:
        0 18px 40px rgba(15, 23, 42, 0.18),
        inset 0 1px 0 color-mix(in srgb, #ffffff 40%, transparent);
      backdrop-filter: blur(22px) saturate(160%);
      -webkit-backdrop-filter: blur(22px) saturate(160%);
    }

    button {
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }

    .info {
      min-width: 0;
      min-height: 46px;
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      gap: 10px;
      padding-right: 4px;
      border-radius: 10px;
      text-align: left;
    }

    .art {
      width: 46px;
      height: 46px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color, #fff));
      color: var(--primary-color);
    }

    .art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .is-paused .art {
      opacity: 0.72;
    }

    .text {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .title,
    .subtitle {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .title {
      font-size: 14px;
      font-weight: 700;
      line-height: 1.2;
    }

    .subtitle {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.2;
    }

    .controls {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .control {
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.18s ease, transform 0.12s ease;
    }

    .control:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }

    .control.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .control.primary:hover {
      background: color-mix(in srgb, var(--primary-color) 88%, #000);
    }

    .control:active {
      transform: scale(0.94);
    }

    .more {
      min-width: 40px;
      height: 32px;
      padding: 0 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      font-size: 12px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }

    @media (pointer: coarse) {
      .more {
        height: 40px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .control {
        transition: none;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'dwains-dashboard-next-now-playing': DwainsNowPlayingBar;
  }
}
