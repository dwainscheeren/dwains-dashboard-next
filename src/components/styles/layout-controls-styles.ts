import { css } from 'lit';

// Placement of the controls that the layout card hosts in its own pages: the
// thermostat in the room header and the Now playing bar. The controls style
// their inside themselves.
// These rules come after layoutCardStyles, so they win at equal specificity.
export const layoutControlsStyles = css`
    /* Thermostat in the room header */
    .area-header > dwains-dashboard-next-area-thermostat {
      position: relative;
      z-index: 3;
      min-width: 0;
    }

    @media (min-width: 769px) {
      /* Right column, below the temperature and humidity chips. */
      .area-header.has-thermostat {
        grid-template-areas:
          "nav actions"
          "title metrics"
          "controls thermostat";
      }

      .area-header > dwains-dashboard-next-area-thermostat {
        grid-area: thermostat;
        align-self: end;
        justify-self: end;
        max-width: 100%;
        margin: 4px 56px 0 0;
      }
    }

    @media (max-width: 768px) {
      /* Full width at the bottom of the header, below the quick controls. */
      .area-content-area .area-header > dwains-dashboard-next-area-thermostat {
        position: absolute;
        left: 20px;
        right: 20px;
        bottom: 8px;
        z-index: 5;
      }

      .area-content-area .area-header.is-stuck > dwains-dashboard-next-area-thermostat {
        display: none;
      }

      .area-content-area .area-header.has-thermostat.has-quick-controls .area-mobile-quick-controls {
        bottom: 60px;
      }

      /* Grow the header so the thermostat does not cover the title or the
         temperature and humidity chips. */
      .area-content-area .area-header.has-thermostat:not(.is-stuck) {
        min-height: calc(166px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-thermostat.has-picture:not(.is-stuck) {
        min-height: calc(190px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-thermostat.has-metrics:not(.is-stuck) {
        min-height: calc(204px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-thermostat.has-quick-controls:not(.is-stuck) {
        min-height: calc(206px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-thermostat.has-picture.has-quick-controls:not(.is-stuck) {
        min-height: calc(238px + env(safe-area-inset-top, 0px));
      }
    }

    @media (pointer: coarse) and (max-width: 768px) {
      /* Touch screens use taller controls (40px targets). */
      .area-content-area .area-header.has-thermostat.has-quick-controls .area-mobile-quick-controls {
        bottom: 64px;
      }

      .area-content-area .area-header.has-thermostat:not(.is-stuck) {
        min-height: calc(170px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-thermostat.has-picture:not(.is-stuck) {
        min-height: calc(194px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-thermostat.has-metrics:not(.is-stuck) {
        min-height: calc(208px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-thermostat.has-quick-controls:not(.is-stuck) {
        min-height: calc(220px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-thermostat.has-picture.has-quick-controls:not(.is-stuck) {
        min-height: calc(252px + env(safe-area-inset-top, 0px));
      }
    }

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
