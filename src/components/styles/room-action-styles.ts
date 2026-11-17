import { css } from 'lit';

// The action of one room: an "active/total" switch for lights, switches and
// fans, open/close for covers and lock/unlock for locks. Shared by the Home
// information popups and the room groups on the Devices page. The host sets
// --room-accent to the colour of the device type.
export const roomActionStyles = css`
  .room-segment[aria-disabled="true"] {
    opacity: .45;
    cursor: default;
  }

  .room-toggle {
    min-height: 32px;
    padding: 4px 5px 4px 10px;
    flex: 0 0 auto;
    border: 0;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--secondary-text-color);
    background: color-mix(in srgb, var(--secondary-background-color) 80%, transparent);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
    font: inherit;
    font-size: 12px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    transition: color 0.18s ease;
  }

  .room-toggle-track {
    position: relative;
    width: 34px;
    height: 20px;
    flex: 0 0 auto;
    border-radius: 999px;
    background: color-mix(in srgb, var(--primary-text-color) 18%, transparent);
    transition: background-color 0.18s ease;
  }

  .room-toggle-track::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
    transition: transform 0.18s ease;
  }

  .room-toggle.is-on {
    color: var(--room-accent);
  }

  .room-toggle.is-on .room-toggle-track {
    background: var(--room-accent);
  }

  .room-toggle.is-on .room-toggle-track::after {
    transform: translateX(14px);
  }

  .room-segmented {
    padding: 3px;
    flex: 0 0 auto;
    display: inline-flex;
    gap: 3px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--secondary-background-color) 80%, transparent);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
  }

  .room-segment {
    width: 34px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
    background: transparent;
    cursor: pointer;
    transition:
      background-color 0.18s ease,
      color 0.18s ease;
  }

  .room-segment.is-current {
    color: #ffffff;
    background: var(--room-accent);
    box-shadow: 0 6px 12px color-mix(in srgb, var(--room-accent) 22%, transparent);
  }

  .room-segment ha-icon {
    --mdc-icon-size: 17px;
  }

  .room-toggle:focus-visible,
  .room-segment:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  @media (pointer: coarse) {
    .room-toggle {
      min-height: 40px;
    }

    .room-segment {
      width: 40px;
      height: 34px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .room-toggle,
    .room-toggle-track,
    .room-toggle-track::after,
    .room-segment {
      transition: none;
    }
  }
`;
