import{_ as e,n as t,t as a}from"./state-Ch1yw9_s.js";import{r,a as i,i as o,A as s,b as n}from"./lit-element-D6iXJla1.js";import{d,n as l}from"./master-action-confirmations-prWHnR4i.js";import{a as c,c as p,T as h,d as m}from"./localize-DC9lHZVH.js";import{a as g}from"./energy-prefs-DY5I1NyA.js";import{k as u,w as v,s as x,l as w,m as y,n as b,q as f,p as _}from"./page-header-styles-Uj8tWCJ4.js";import{f as $}from"./confirm-dialog-sj6nDODt.js";import"./dd-card-host-zbmwRU5c.js";const k=u();function z(e,t){if("energy"===t.basis){const a=[...new Set(t.sources.map(e=>e.name))];return c(e,"devices.power_based_on",{sensors:a.join(", ")})}return _(e,t)}let j=class extends o{constructor(){super(...arguments),this.navigableAreas=!1,this._forceRender=!1,this._handleForcedUpdate=()=>{this._forceRender=!0,this.requestUpdate()}}_t(e,t){return c(this.hass,e,t)}_tp(e,t,a){return p(this.hass,e,t,a)}connectedCallback(){super.connectedCallback(),window.addEventListener(h,this._handleForcedUpdate),this._energyUnsub=g(this._handleForcedUpdate)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(h,this._handleForcedUpdate),this._energyUnsub?.(),this._energyUnsub=void 0}shouldUpdate(e){const t=k(this.hass,this.config),a=m(this.hass),r=[...e.keys()].every(e=>"hass"===e);return!this._forceRender&&r&&t===this._summary&&a===this._renderedLanguage?(this.renderRoot?.querySelectorAll("dwains-dashboard-next-card-host").forEach(e=>{e.hass=this.hass}),!1):(this._forceRender=!1,this._summary=t,this._renderedLanguage=a,!0)}render(){const e=this._summary;if(!e||!this.hass)return s;if(!e.sensorCount)return n`
        <div class="empty">
          <ha-icon icon="mdi:flash-off-outline"></ha-icon>
          <h2>${this._t("devices.no_power_title")}</h2>
          <p>${this._t("devices.no_power_description")}</p>
        </div>
      `;const t=e.areas[0],a=v(e,this.hass?.states,8);return n`
      <div class="overview-grid">
        <section class="card overview-card">
          <div class="overview-head">
            <span class="icon-badge large" aria-hidden="true">
              <ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>
            </span>
            <div class="overview-copy">
              <h2>${this._t("devices.whole_house")}</h2>
              <p>${z(this.hass,e)}</p>
              ${x(e)?n`<p>${this._t("devices.power_measured_in_rooms",{value:w(e.roomTotalWatts)})}</p>`:s}
            </div>
            <strong class="overview-total">${e.formattedTotal}</strong>
          </div>
          ${this._renderGraph(a,this._t("devices.whole_house_history"))}
        </section>

        ${t?n`
          <section class="card overview-card">
            <div class="overview-head">
              <span class="icon-badge large" aria-hidden="true">
                <ha-icon icon=${t.icon}></ha-icon>
              </span>
              <div class="overview-copy">
                <h2>${this._t("devices.top_area")}</h2>
                <p>${t.name}</p>
              </div>
              <strong class="overview-total">${t.formattedTotal}</strong>
            </div>
            <div class="top-entities">
              ${t.entities.slice(0,3).map(e=>this._renderEntityMini(e,t.totalWatts))}
            </div>
          </section>
        `:s}
      </div>

      <div class="areas-grid">
        ${l(e.areas,e=>e.areaId,e=>this._renderAreaCard(e))}
      </div>
    `}_renderAreaCard(e){const t=this.navigableAreas&&!e.areaId.startsWith("__"),a=n`
      <span class="icon-badge" aria-hidden="true">
        <ha-icon icon=${e.icon}></ha-icon>
      </span>
      <span class="area-title-copy">
        <strong>${e.name}</strong>
        <small>${this._tp("devices.power_entity",e.entities.length)}</small>
      </span>
    `;return n`
      <section class="card area-card">
        <header class="area-head">
          ${t?n`<button class="area-title" type="button" @click=${()=>this._selectArea(e.areaId)}>${a}</button>`:n`<div class="area-title">${a}</div>`}
          <div class="area-total">
            <span>${e.formattedTotal}</span>
            <small>${this._t("devices.total_now")}</small>
          </div>
        </header>

        ${this._renderGraph(y(e.entities,6),this._t("devices.area_power_history",{area:e.name}))}

        <div class="entity-list">
          ${l(e.entities,e=>e.entityId,t=>this._renderEntityRow(t,e.totalWatts))}
        </div>
      </section>
    `}_untrackedLabel(e){return b(e)?this._t("devices.power_untracked_of",{value:w(e.measuredWatts)}):void 0}_renderEntityMini(e,t){const a=this._untrackedLabel(e);return n`
      <button
        class="entity-mini"
        type="button"
        title=${a?`${e.name}: ${a}`:e.name}
        aria-label=${a?`${e.name}, ${e.formatted}, ${a}`:`${e.name}, ${e.formatted}`}
        style=${`--power-width: ${f(e.watts,t)}%`}
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        <span>${e.name}</span>
        <strong>${e.formatted}</strong>
      </button>
    `}_renderEntityRow(e,t){return n`
      <button
        class="entity-row"
        type="button"
        style=${`--power-width: ${f(e.watts,t)}%`}
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        <span class="icon-badge small" aria-hidden="true">
          <ha-icon icon=${e.icon}></ha-icon>
        </span>
        <span class="entity-copy">
          <strong>${e.name}</strong>
          <small>${this._untrackedLabel(e)??e.areaName}</small>
          <span class="entity-bar" aria-hidden="true"><span></span></span>
        </span>
        <span class="entity-value">${e.formatted}</span>
      </button>
    `}_renderGraph(e,t){return e.length?n`
      <dwains-dashboard-next-card-host
        class="statistics-card"
        role="img"
        aria-label=${t}
        .hass=${this.hass}
        .config=${{type:"statistics-graph",entities:e,days_to_show:1,period:"5minute",stat_types:["mean"],chart_type:"line",hide_legend:!0,fit_y_data:!0,min_y_axis:0}}
      ></dwains-dashboard-next-card-host>
    `:s}_selectArea(e){$(this,"dd-power-area-selected",{areaId:e},{bubbles:!1,composed:!1})}_showMoreInfo(e){$(this,"hass-more-info",{entityId:e})}};j.styles=i`
    :host {
      --power-color: var(--domain-color, ${r(d("energy"))});
      display: block;
      container-type: inline-size;
    }

    h2,
    p {
      margin: 0;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }

    /* Without a top room the whole house card takes the full width. */
    .overview-grid > :only-child {
      grid-column: 1 / -1;
    }

    .card {
      min-width: 0;
      padding: 14px;
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      background: var(--card-background-color);
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
    }

    .icon-badge {
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      color: var(--power-color);
      background: color-mix(in srgb, var(--power-color) 12%, transparent);
    }

    .icon-badge ha-icon {
      --mdc-icon-size: 22px;
    }

    .icon-badge.large {
      width: 42px;
      height: 42px;
    }

    .icon-badge.large ha-icon {
      --mdc-icon-size: 24px;
    }

    .icon-badge.small {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }

    .icon-badge.small ha-icon {
      --mdc-icon-size: 20px;
    }

    .overview-head {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .overview-copy h2 {
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .overview-copy p,
    .area-title-copy small,
    .area-total small,
    .entity-copy small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
    }

    .overview-copy p {
      margin-top: 4px;
      overflow-wrap: anywhere;
    }

    .overview-total {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .statistics-card {
      display: block;
      min-height: 150px;
      margin-top: 12px;
      overflow: hidden;
      border-radius: 12px;
      background: color-mix(in srgb, var(--power-color) 4%, transparent);
      --ha-card-background: transparent;
      --ha-card-box-shadow: none;
      --ha-card-border-width: 0;
      --ha-card-border-radius: 12px;
    }

    .top-entities {
      margin-top: 12px;
      display: grid;
      gap: 7px;
    }

    .entity-mini {
      min-height: 32px;
      padding: 0 10px;
      border: 0;
      border-radius: 10px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      background:
        linear-gradient(90deg,
          color-mix(in srgb, var(--power-color) 16%, transparent) 0 var(--power-width),
          var(--secondary-background-color) var(--power-width) 100%);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      font-weight: 800;
      text-align: left;
      cursor: pointer;
    }

    .entity-mini span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .entity-mini strong {
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .areas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      gap: 12px;
    }

    .area-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .area-title {
      min-width: 0;
      padding: 0;
      border: 0;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
    }

    button.area-title {
      cursor: pointer;
    }

    .area-title-copy {
      min-width: 0;
    }

    .area-title-copy strong {
      display: block;
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 900;
      line-height: 1.12;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .area-title-copy small {
      display: block;
      margin-top: 3px;
    }

    .area-total {
      display: grid;
      justify-items: end;
      gap: 2px;
    }

    .area-total span {
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .entity-list {
      margin-top: 12px;
      display: grid;
      gap: 8px;
    }

    .entity-row {
      min-height: 58px;
      padding: 9px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition:
        border-color 0.16s ease,
        transform 0.16s ease,
        box-shadow 0.16s ease;
    }

    .entity-row:hover {
      border-color: color-mix(in srgb, var(--power-color) 26%, var(--divider-color));
      box-shadow: 0 12px 22px rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }

    .entity-copy {
      min-width: 0;
      display: grid;
      gap: 3px;
    }

    .entity-copy strong {
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 850;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .entity-bar {
      position: relative;
      height: 5px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--power-color) 10%, var(--secondary-background-color));
    }

    .entity-bar span {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--power-color), #f5c85b);
    }

    .entity-value {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .entity-mini:focus-visible,
    .entity-row:focus-visible,
    button.area-title:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .empty {
      min-height: 280px;
      padding: 32px;
      border: 1px dashed var(--divider-color);
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      text-align: center;
    }

    .empty ha-icon {
      --mdc-icon-size: 34px;
      color: var(--power-color);
    }

    .empty h2 {
      margin-top: 4px;
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 850;
    }

    .empty p {
      max-width: 430px;
      font-size: 13px;
      line-height: 1.45;
    }

    @container (max-width: 640px) {
      .overview-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .overview-head,
      .area-head {
        grid-template-columns: auto minmax(0, 1fr);
      }

      .overview-total,
      .area-total {
        grid-column: 1 / -1;
        justify-self: stretch;
        justify-items: start;
        margin-top: 4px;
      }

      .card {
        border-radius: 12px;
      }

      .entity-row {
        grid-template-columns: 36px minmax(0, 1fr);
      }

      .entity-value {
        grid-column: 2;
        justify-self: start;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .entity-row {
        transition: none;
      }

      .entity-row:hover {
        transform: none;
      }
    }
  `,e([t({attribute:!1})],j.prototype,"hass",void 0),e([t({attribute:!1})],j.prototype,"config",void 0),e([t({type:Boolean,attribute:"navigable-areas"})],j.prototype,"navigableAreas",void 0),j=e([a("dwains-dashboard-next-house-power-panel")],j);let U=class extends o{constructor(){super(...arguments),this._forceRender=!1,this._handleForcedUpdate=()=>{this._forceRender=!0,this.requestUpdate()}}connectedCallback(){super.connectedCallback(),window.addEventListener(h,this._handleForcedUpdate)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(h,this._handleForcedUpdate)}shouldUpdate(){const e=k(this.hass,this.config),t=m(this.hass);return!(!this._forceRender&&e===this._summary&&t===this._renderedLanguage)&&(this._forceRender=!1,this._summary=e,this._renderedLanguage=t,!0)}render(){const e=this._summary;return e&&this.hass?n`
      <div class="total" title=${z(this.hass,e)}>
        <span>${e.formattedTotal}</span>
        <small>${"energy"===e.basis?c(this.hass,"devices.whole_house"):_(this.hass,e)}</small>
      </div>
    `:s}};U.styles=i`
    :host {
      --power-color: var(--domain-color, ${r(d("energy"))});
      display: block;
    }

    .total {
      box-sizing: border-box;
      min-height: 52px;
      padding: 7px 14px;
      display: grid;
      align-content: center;
      justify-items: end;
      gap: 2px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--power-color) 13%, var(--card-background-color));
    }

    span {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 800;
      line-height: 1.05;
      font-variant-numeric: tabular-nums;
    }

    small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
    }

    @media (max-width: 768px) {
      .total {
        justify-items: start;
      }
    }
  `,e([t({attribute:!1})],U.prototype,"hass",void 0),e([t({attribute:!1})],U.prototype,"config",void 0),U=e([a("dwains-dashboard-next-house-power-total")],U);export{k as s};
