import { css } from 'lit';

// Placement of the controls that the layout card hosts in its own pages: the
// thermostat in the room header. The controls style their inside themselves.
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
`;
