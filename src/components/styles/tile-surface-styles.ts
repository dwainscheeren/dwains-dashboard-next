import { css } from 'lit';

export const tileSurfaceStyles = css`
  .tile-surface {
    position: absolute;
    inset: 0;
    z-index: 2;
    border: 0;
    border-radius: inherit;
    background: transparent;
    cursor: pointer;
  }

  .tile-surface:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -3px;
  }
`;
