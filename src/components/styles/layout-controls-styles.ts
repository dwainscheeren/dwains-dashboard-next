import { css } from 'lit';

// Placement of the controls that the layout card hosts in its own pages: the
// Now playing bar. The thermostat in the room header is placed by
// page-header-styles. The controls style their inside themselves.
// These rules come after layoutCardStyles, so they win at equal specificity.
export const layoutControlsStyles = css`
    /* Now playing bar: inline below the page header on desktop and tablet. */
    dwains-dashboard-next-now-playing.inline {
      margin: -12px 0 24px;
    }

    .area-view > dwains-dashboard-next-now-playing.inline {
      margin: 0 0 18px;
    }

    @media (max-width: 768px) {
      /* Mobile: floating just above the bottom navigation. */
      dwains-dashboard-next-now-playing.floating {
        position: fixed;
        left: max(12px, env(safe-area-inset-left, 0px));
        right: max(12px, env(safe-area-inset-right, 0px));
        bottom: calc(76px + env(safe-area-inset-bottom, 0px));
        z-index: 100;
        max-width: 560px;
        margin: 0 auto;
      }

      /* Room for the bar below the last card, so it never covers content. */
      .layout-container.has-floating-now-playing .home-view,
      .layout-container.has-floating-now-playing .content-area.area-content-area {
        padding-bottom: calc(200px + env(safe-area-inset-bottom, 0px));
      }
    }
`;
