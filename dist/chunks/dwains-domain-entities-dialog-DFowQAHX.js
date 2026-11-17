import{_ as t,n as i,t as e,r as a}from"./state-Ch1yw9_s.js";import{q as o,Q as n}from"./screensaver-media-B4tVfnaw.js";import{r as s,a as r,i as c,A as l,b as d}from"./lit-element-D6iXJla1.js";import{q as h,N as p,l as m,u,i as g,n as _,X as f,d as y,f as v,m as b,k as x,s as w,H as $,I as k,F as E,t as C,C as S}from"./master-action-confirmations-C0zuZdOf.js";import{o as A,t as j,a as z}from"./dwains-layout-card-opuGGt52.js";import{m as I}from"./memoize-one.esm-BAtLgO95.js";import{a as T,c as D,b as O}from"./localize-B9ZNasFg.js";import{f as L,s as F}from"./confirm-dialog-CV_fQVZ7.js";import{f as N,a as M}from"./dwains-bottom-nav-Bud-04gL.js";import"./dd-card-host-zbmwRU5c.js";import{g as U}from"./security-DZVTMiKe.js";import{S as B,f as V,c as R,s as q,a as P,d as G}from"./dialog-sheet-styles-BCf7ZNLW.js";import{o as K,f as H,j as W,c as X,g as Y,r as Q,i as J,T as Z}from"./page-header-styles-DtEuFU--.js";import{r as tt}from"./room-action-styles-0QKfOU0q.js";import"./directive-BcM-F-Rh.js";import"./energy-prefs-DY5I1NyA.js";import"./now-playing-Cuk1avU4.js";import"./dashboard-config-store-C7OHDEFk.js";let it=class extends c{constructor(){super(...arguments),this.name="",this.stateLabel="",this.picture="",this.icon="mdi:account",this.presence="unknown"}render(){return d`
      <button
        class="tile is-${this.presence}"
        type="button"
        aria-label=${this.stateLabel?`${this.name}: ${this.stateLabel}`:this.name}
      >
        <span class="avatar ${this.picture?"has-picture":""}" aria-hidden="true">
          ${this.picture?d`<img src=${this.picture} alt="" loading="lazy" decoding="async">`:d`<ha-icon icon=${this.icon}></ha-icon>`}
        </span>
        <span class="copy">
          <span class="name">${this.name}</span>
          ${this.stateLabel?d`<span class="state">${this.stateLabel}</span>`:l}
        </span>
        <ha-icon class="chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
      </button>
    `}};it.styles=r`
    :host {
      --person-color: ${s(h("person"))};
      --person-home-color: #2f9b62;
      display: block;
      min-width: 0;
    }

    .tile {
      width: 100%;
      min-height: 62px;
      padding: 10px 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 0;
      border-radius: 14px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.05),
        inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      -webkit-tap-highlight-color: transparent;
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .tile:hover {
      box-shadow:
        0 14px 28px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 14%, transparent);
    }

    .tile:active {
      transform: scale(0.985);
    }

    .tile:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 999px;
      color: var(--person-color);
      background: color-mix(in srgb, var(--person-color) 13%, transparent);
    }

    .avatar ha-icon {
      --mdc-icon-size: 22px;
    }

    .avatar.has-picture {
      background: var(--secondary-background-color);
    }

    .avatar img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .copy {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .name,
    .state {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .name {
      font-size: 14px;
      font-weight: 850;
      line-height: 1.15;
    }

    .state {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 750;
      line-height: 1.15;
    }

    .is-home .state {
      color: var(--person-home-color);
    }

    .is-home .avatar {
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--person-home-color) 55%, transparent);
    }

    /* No tracker: neutral, clearly not home, away or in a zone. */
    .is-unknown .avatar {
      opacity: 0.6;
      filter: grayscale(1);
    }

    .is-unknown .state {
      color: var(--disabled-text-color, var(--secondary-text-color));
      font-style: italic;
    }

    .chevron {
      --mdc-icon-size: 18px;
      flex: 0 0 auto;
      color: color-mix(in srgb, var(--primary-text-color) 38%, transparent);
    }

    @media (prefers-reduced-motion: reduce) {
      .tile {
        transition: none;
      }

      .tile:active {
        transform: none;
      }
    }
  `,t([i({attribute:!1})],it.prototype,"name",void 0),t([i({attribute:!1})],it.prototype,"stateLabel",void 0),t([i({attribute:!1})],it.prototype,"picture",void 0),t([i({attribute:!1})],it.prototype,"icon",void 0),t([i({attribute:!1})],it.prototype,"presence",void 0),it=t([e("dwains-dashboard-next-person-tile")],it);const et=r`.room-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:start}.room-card{--room-accent:var(--primary-color);min-width:0;padding:14px;border-radius:16px;background:var(--card-background-color);box-shadow:0 14px 34px rgba(15,23,42,0.06),inset 0 0 0 1px rgba(15,23,42,0.04)}.room-card.is-full{grid-column:1 / -1}.room-head{min-height:40px;margin-bottom:12px;display:flex;align-items:center;gap:10px}.room-icon{width:36px;height:36px;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;border-radius:11px;color:var(--room-accent);background:color-mix(in srgb,var(--room-accent) 13%,transparent)}.room-icon ha-icon{--mdc-icon-size:20px}.room-name{flex:1;min-width:0;margin:0;overflow:hidden;color:var(--primary-text-color);font-size:16px;font-weight:850;line-height:1.15;text-overflow:ellipsis;white-space:nowrap}.room-count{color:var(--secondary-text-color);font-size:13px;font-weight:750;font-variant-numeric:tabular-nums}.room-entities{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}.room-card.is-full .room-entities{grid-template-columns:repeat(3,minmax(0,1fr))}.domain-entity-card:focus-visible,.domain-entity-action:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.domain-entity-card.is-row{min-height:64px;padding:10px 12px;flex-direction:row;align-items:center;justify-content:flex-start;gap:12px;border-radius:14px;background:var(--primary-background-color);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary-text-color) 7%,transparent)}.domain-entity-card.is-row.is-active{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--entity-color) 24%,transparent)}.domain-entity-card.is-row .domain-entity-copy{flex:1}.domain-entity-card.is-row .domain-entity-name{font-size:14px;line-height:1.15}.domain-entity-card.is-row .domain-entity-status{margin-top:3px}.person-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:10px}@media (pointer:coarse){.domain-entity-card.is-row .domain-cover-action{width:34px;height:34px}.domain-entity-toggle,.domain-entity-more,.domain-lock-action{position:relative}.domain-entity-toggle::after,.domain-entity-more::after,.domain-lock-action::after{content:"";position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%)}}@media (min-width:601px) and (max-width:1000px){.room-card.is-full .room-entities{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width:2000px){:host{--mdc-dialog-max-width:1280px}.room-card.is-full .room-entities{grid-template-columns:repeat(4,minmax(0,1fr))}}@media (max-width:600px){.room-grid{grid-template-columns:minmax(0,1fr);gap:12px}.room-card{padding:12px;border-radius:14px}.room-card.is-full{grid-column:auto}.room-card .room-entities,.room-card.is-full .room-entities,.person-grid{grid-template-columns:minmax(0,1fr)}}@media (prefers-reduced-motion:reduce){.domain-entity-card,.domain-entity-action,.domain-entity-toggle::before{transition:none}}`,at="__people__";let ot=class extends c{constructor(){super(...arguments),this._groupedEntities={},this._loading=!0,this._optimisticEntityStates={},this._entityCards=new Map,this._mobileSheetAnimated=!1,this._sheetDrag=new B(this,{getPanel:()=>V(this.renderRoot?.querySelector("ha-dialog")),onClose:()=>this.closeDialog()}),this._orderGroups=I((t,i,e)=>{const a=Object.entries(t).map(([t,i])=>({areaId:t,...i}));if(!i||a.length<2)return a;const o=p(i.areas||[],i.areas_display,e).map(t=>t.area_id);return K(a,o,e)}),this._handleViewAll=()=>{const t=this._params?.onViewAll;t?R(this.localName,()=>this.closeDialog(),t):this.closeDialog()}}_t(t,i){return T(this.hass,t,i)}_tp(t,i){return D(this.hass,t,i)}async showDialog(t){this._params=t,this._loading=!0,this._mobileSheetAnimated=!1,await this._loadEntities()}closeDialog(){this._params=void 0,this._groupedEntities={},this._optimisticEntityStates={},this._entityCards.clear(),this._mobileSheetAnimated=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=void 0),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0),L(this,"dialog-closed",{dialog:this.localName})}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._params&&!this._loading&&(this._reconcileOptimisticEntityStates(),this._updateEntityCards()),this._animateMobileSheetIn()}connectedCallback(){super.connectedCallback(),this._sheetDrag.attach()}disconnectedCallback(){super.disconnectedCallback(),this._sheetDrag.detach(),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0)}_animateMobileSheetIn(){!this._mobileSheetAnimated&&this._params&&q()&&requestAnimationFrame(()=>{P(V(this.renderRoot.querySelector("ha-dialog")))&&(this._mobileSheetAnimated=!0)})}async _loadEntities(){if(!this._params||!this.hass)return;const{domain:t,areaId:i,config:e,filterByUnitOfMeasurement:a,deviceClass:n,entityIds:s,entityAreas:r}=this._params,c={},l=m(e),d=u(e),h=U(this.hass),p="person"===t,y=s?.length?s.map(t=>this.hass.states[t]).filter(t=>Boolean(t)):[...o(this.hass.states,t)],v=[],b=new Set;y.forEach(o=>{const s=o.entity_id;if(b.has(s))return;if(b.add(s),s.split(".")[0]!==t)return;if(!g(h[s]))return;if(p)return void v.push({entity_id:s,hidden:!1});if("unavailable"===o.state)return;const c=d.get(s),l=r?.[s],m=l||_(this.hass,e,s,c);if(m&&(!i||m===i)&&(l||f(this.hass,e,s,m,c))){if(a){if(o.attributes?.unit_of_measurement!==a)return}else if("binary_sensor"===t&&n){const t=o.attributes?.device_class;if(t!==n)return}v.push({entity_id:s,area_id:m,hidden:!1})}}),p?v.length&&(c[at]={areaName:this._t("home.people"),entities:v}):v.forEach(t=>{const i=t.area_id,e=l.get(i);e&&(c[i]||(c[i]={areaName:e.name,entities:[]}),c[i].entities.push(t))}),this._groupedEntities=c,this._loading=!1,this._updateInterval||(this._updateInterval=window.setInterval(()=>{this._checkForEntityChanges()},1e3))}_checkForEntityChanges(){if(!this._params||!this.hass||this._loading)return;const{domain:t,filterByUnitOfMeasurement:i,deviceClass:e}=this._params;let a=!1;Object.entries(this._groupedEntities).forEach(([o,n])=>{n.entities.forEach(o=>{const n=this.hass.states[o.entity_id];if(!n)return void(a=!0);this._shouldEntityBeVisible(n,t,i,e)||(a=!0)})}),a&&this._loadEntities()}_shouldEntityBeVisible(t,i,e,a){return"person"===i||"unavailable"!==t.state&&(e?t.attributes?.unit_of_measurement===e:"binary_sensor"!==i||!a||t.attributes?.device_class===a)}_updateEntityCards(){this._entityCards.forEach((t,i)=>{t&&"hass"in t&&(t.hass=this.hass)})}render(){if(!this._params)return l;const{domain:t,filterByUnitOfMeasurement:i,deviceClass:e,customTitle:a}=this._params;let o=a||this._getLocalizedDomainTitle(t);if("W"===i)o=this._t("dialog.power_sensors");else if(e){o={motion:this._t("dialog.motion_sensors"),door:this._t("dialog.door_sensors"),window:this._t("dialog.window_sensors"),smoke:this._t("dialog.smoke_sensors"),gas:this._t("dialog.gas_sensors"),moisture:this._t("dialog.moisture_sensors"),occupancy:this._t("dialog.occupancy_sensors"),opening:this._t("dialog.opening_sensors"),presence:this._t("dialog.presence_sensors"),safety:this._t("dialog.safety_sensors"),tamper:this._t("dialog.tamper_sensors"),vibration:this._t("dialog.vibration_sensors")}[e]||this._getLocalizedDomainTitle(t)}const s=!0===this._params.homeInformation;return d`
      <ha-dialog
        open
        width="large"
        @closed=${this.closeDialog}
        @cancel=${()=>this.closeDialog()}
        .heading=${o}
        .type=${""}
        flexContent
        hideActions
      >
        <ha-dialog-header slot="header">
          <div class="sheet-handle" aria-hidden="true"></div>
          <ha-icon-button
            slot="navigationIcon"
            .label=${this._t("common.close")}
            .path=${n}
            @click=${()=>this.closeDialog()}
          ></ha-icon-button>
          ${s?d`
            <span slot="title" class="dialog-title" style=${`--dialog-accent: ${this._headerColor()};`}>
              <span class="dialog-title-icon" aria-hidden="true">
                <ha-icon icon=${this._headerIcon()}></ha-icon>
              </span>
              <span class="dialog-title-text">${o}</span>
            </span>
          `:d`<span slot="title">${o}</span>`}
          ${s&&this._params.onViewAll?d`
            <button
              slot="actionItems"
              class="dialog-header-link"
              type="button"
              aria-label=${this._params.viewAllLabel||this._t("navigation.open_devices")}
              @click=${this._handleViewAll}
            >
              <span class="label-long">${this._params.viewAllLabel||this._t("navigation.open_devices")}</span>
              <span class="label-short">${this._t("devices.title")}</span>
              <ha-icon icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
            </button>
          `:l}
        </ha-dialog-header>

        <div class="content ${s?"home-information":""}">
          ${this._loading?d`<div class="loading">${this._t("common.loading")}</div>`:this._renderContent()}
        </div>
      </ha-dialog>
    `}_headerIcon(){const t=this._params;if(!t)return"mdi:information-outline";const[i,e]=(t.deviceViewKey||"").split("."),a=i||t.domain,o=e||t.deviceClass;return"person"===a?"mdi:account-group":"sensor"!==a||o?o?y(a,o):v(a):"mdi:home-thermometer-outline"}_headerColor(){const t=this._params;if(!t)return h("");const[i,e]=(t.deviceViewKey||"").split(".");return this._entityColor(i||t.domain,e||t.deviceClass)}_renderContent(){if(this._params?.customEntities)return this._renderCustomEntities();const t=this._allDialogEntities();return 0===t.length?d`
        <div class="empty-state">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t("dialog.active_empty")}
          </div>
        </div>
      `:this._params?.homeInformation?this._renderHomeInformation(t):d`
      ${this._renderViewAllAction()}
      ${this._renderDomainActions(t)}
      ${b(this._orderedGroups(),t=>t.areaId,t=>this._renderAreaSection(t.areaId,t))}
    `}_orderedGroups(){return this._orderGroups(this._groupedEntities,this._params?.config,O(this.hass))}_renderHomeInformation(t){return"person"===this._params?.domain?d`
        <div class="person-grid">
          ${b(t,t=>t.entity_id,t=>this._renderPersonTile(t.entity_id))}
        </div>
      `:d`
      ${this._renderDomainActions(t)}
      <div class="room-grid">
        ${b(this._orderedGroups(),t=>t.areaId,t=>this._renderRoomCard(t))}
      </div>
    `}_renderPersonTile(t){const i=this.hass.states[t];if(!i)return l;const e=H(i.state),a=i.attributes?.friendly_name||U(this.hass)[t]?.name||t.split(".")[1]||t,o="unknown"===e?this._t("person.no_location"):"home"===e?this._t("person.home"):"away"===e?this._t("person.away"):N(this.hass,i);return d`
      <dwains-dashboard-next-person-tile
        .name=${a}
        .stateLabel=${o}
        .picture=${i.attributes?.entity_picture||""}
        .icon=${U(this.hass)[t]?.icon||i.attributes?.icon||v("person")}
        .presence=${e}
        @click=${()=>this._showMoreInfo(t)}
      ></dwains-dashboard-next-person-tile>
    `}_renderRoomCard(t){const i=this._params?.domain||"",e=m(this._params?.config).get(t.areaId),a=this._entityColor(i,this._params?.deviceClass),o=`room-${t.areaId}`,n="sensor"===i;return d`
      <section
        class="room-card ${W(t.entities.length)?"is-compact":"is-full"}"
        style=${`--room-accent: ${a};`}
        aria-labelledby=${o}
      >
        <header class="room-head">
          <span class="room-icon" aria-hidden="true">
            <ha-icon icon=${e?x(e):"mdi:home"}></ha-icon>
          </span>
          <h3 class="room-name" id=${o}>${t.areaName}</h3>
          ${this._renderRoomAction(t,i)}
        </header>
        <div class="room-entities">
          ${b(t.entities,t=>t.entity_id,t=>this._renderEntityCard(t,n?this._sensorMeta(t.entity_id):"","row"))}
        </div>
      </section>
    `}_sensorMeta(t){const i=this.hass.states[t]?.attributes?.device_class;return i?w(this.hass,i):""}_renderRoomAction(t,i){const e=t.entities.map(t=>t.entity_id).filter(t=>$(this.hass.states[t])),a=X(e,t=>{const e=this._getEffectiveEntityState(this.hass.states[t]);return this._isEntityActiveForUi(e,i)}),o=Y(i,a,e.length);if(!o)return d`<span class="room-count">${t.entities.length}</span>`;if("toggle"===o.mode){const i=this._t("turn_off"===o.action?"action.turn_off_all":"action.turn_on_all");return d`
        <button
          class="room-toggle ${o.checked?"is-on":""}"
          type="button"
          role="switch"
          aria-checked=${o.checked?"true":"false"}
          aria-label=${`${t.areaName}: ${this._t("area_header.on_count",{active:o.activeCount,total:o.totalCount})}`}
          title=${i}
          @click=${()=>this._runRoomAction(t,e,o.action,i)}
        >
          <span aria-hidden="true">${o.activeCount}/${o.totalCount}</span>
          <span class="room-toggle-track" aria-hidden="true"></span>
        </button>
      `}return d`
      <div class="room-segmented" role="group" aria-label=${t.areaName}>
        ${o.items.map(i=>{const a=this._t(i.labelKey);return d`
            <button
              class="room-segment ${i.current?"is-current":""}"
              type="button"
              title=${a}
              aria-label=${this._t("action.entity_action",{action:a,name:t.areaName})}
              @click=${()=>this._runRoomAction(t,e,i.action,a)}
            >
              <ha-icon icon=${i.icon} aria-hidden="true"></ha-icon>
            </button>
          `})}
      </div>
    `}async _runRoomAction(t,i,e,a){if(!i.length)return;const o=this._params?.domain||"",n=k(this._params?.config?.settings,o);if(Q(e,n)){if(!await F(this,{hass:this.hass,title:a,message:this._t("action.confirm_master_action",{count:i.length,area:t.areaName}),confirmLabel:a,destructive:J(e),container:this.renderRoot.querySelector("ha-dialog")||void 0}))return}await this._executeBulkAction(i,e)}_renderViewAllAction(){return this._params?.onViewAll?d`
      <div class="domain-actions">
        <button
          class="dialog-view-all"
          type="button"
          @click=${this._handleViewAll}
        >
          <span>${this._params.viewAllLabel||this._t("common.view_all")}</span>
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `:l}_renderCustomEntities(){const{customEntities:t,customDescription:i}=this._params;return t&&0!==t.length?d`
      ${i?d`
        <div class="custom-description">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <p>${i}</p>
        </div>
      `:l}

      <div class="entity-section">
        <div class="entities-grid">
          ${b(t,t=>t,t=>this._renderEntityCard({entity_id:t,hidden:!1}))}
        </div>
      </div>
    `:d`
        <div class="empty-state">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t("dialog.problem_empty")}
          </div>
        </div>
      `}_allDialogEntities(){return Object.values(this._groupedEntities).flatMap(t=>t.entities)}_renderDomainActions(t){const i=this._params?.domain||"",e=t.map(t=>t.entity_id).filter(t=>this.hass.states[t]);if(!e.length)return l;const a=this._entityColor(i),o=(t,i,o)=>d`
      <button
        class="domain-action-button"
        type="button"
        style=${`--domain-color: ${a};`}
        @click=${()=>this._runBulkDomainAction(e,o,t)}
      >
        <ha-icon icon=${i}></ha-icon>
        <span>${t}</span>
      </button>
    `;return["light","switch","fan","input_boolean"].includes(i)?d`
        <div class="domain-actions">
          ${o(this._t("action.turn_on_all"),"mdi:power","turn_on")}
          ${o(this._t("action.turn_off_all"),"mdi:power-off","turn_off")}
        </div>
      `:"cover"===i?d`
        <div class="domain-actions">
          ${o(this._t("action.open_all"),"mdi:arrow-up","open_cover")}
          ${o(this._t("action.close_all"),"mdi:arrow-down","close_cover")}
        </div>
      `:"lock"===i?d`
        <div class="domain-actions">
          ${o(this._t("action.unlock_all"),"mdi:lock-open-variant-outline","unlock")}
          ${o(this._t("action.lock_all"),"mdi:lock-outline","lock")}
        </div>
      `:l}_renderAreaSection(t,i){const e=t===at?"mdi:account-group":m(this._params?.config).get(t)?.icon||"";return d`
      <div class="area-section">
        <div class="area-header">
          ${e?d`
            <div class="area-icon">
              <ha-icon icon="${e}"></ha-icon>
            </div>
          `:l}
          <div class="area-name">${i.areaName}</div>
          <div class="entity-count">${i.entities.length}</div>
        </div>
        <div class="entities-grid">
          ${b(i.entities,t=>t.entity_id,t=>this._renderEntityCard(t,i.areaName))}
        </div>
      </div>
    `}_renderEntityCard(t,i,e="tile"){const a=this.hass.states[t.entity_id];if(!a)return l;const o=this._getEffectiveEntityState(a),n=t.entity_id.split(".")[0]||"unknown";if("todo"===n)return d`
        <div class="domain-todo-list-card" data-entity=${t.entity_id}>
          <dwains-dashboard-next-card-host
            eager
            .hass=${this.hass}
            .config=${{type:"todo-list",entity:t.entity_id}}
          ></dwains-dashboard-next-card-host>
        </div>
      `;const s=o.attributes?.device_class,r=U(this.hass)[t.entity_id]?.icon||o.attributes?.icon||y(n,s)||v(n),c=o.attributes?.friendly_name||U(this.hass)[t.entity_id]?.name||t.entity_id,h=this._entityAreaName(t),p=E(c,h,this._params?.config?.settings),m=this._isEntityActiveForUi(o,n),u=this._isUnavailable(o),g=!u&&C(this._params?.config?.settings,t.entity_id),_=this._tileTapOptions(t.entity_id,g),f=this._entityStatusText(o,n),b="row"===e?p:c,x=this._t("action.entity_action",{action:this._t("action.more_info"),name:b}),w=d`
      <button
        class="tile-surface"
        type="button"
        role=${A(g?"switch":void 0)}
        aria-checked=${A(g?String(m):void 0)}
        aria-label=${g?b:x}
        aria-description=${f}
        ${j(_)}
      ></button>
    `,$=g?d`
      <button
        class="domain-entity-action domain-entity-more"
        type="button"
        title=${x}
        aria-label=${x}
        @click=${()=>this._showMoreInfo(t.entity_id)}
      ><ha-icon icon="mdi:information-outline"></ha-icon></button>
    `:this._renderEntityActions(o,n,m),k=["domain-entity-card",`domain-entity-${n}`,"row"===e?"is-row":"",m?"is-active":"is-off",u?"is-unavailable":"",g?"tap-toggles":""].join(" ");return"row"===e?d`
        <article
          class=${k}
          style=${`--entity-color: ${this._entityColor(n,s)};`}
        >
          ${w}
          <div class="domain-entity-icon" aria-hidden="true">
            <ha-icon icon=${r}></ha-icon>
          </div>
          <div class="domain-entity-copy" aria-hidden="true">
            ${i?d`<div class="domain-entity-meta">${i}</div>`:l}
            <div class="domain-entity-name">${p}</div>
            <div class="domain-entity-status">${f}</div>
          </div>
          ${$}
        </article>
      `:d`
      <article
        class=${k}
        style=${`--entity-color: ${this._entityColor(n,s)};`}
      >
        ${w}
        <div class="domain-entity-top">
          <div class="domain-entity-icon" aria-hidden="true">
            <ha-icon icon=${r}></ha-icon>
          </div>
          ${$}
        </div>
        <div class="domain-entity-copy" aria-hidden="true">
          <div class="domain-entity-meta">${i||h||this._t("dialog.no_area")}</div>
          <div class="domain-entity-name">${p}</div>
          <div class="domain-entity-status">${f}</div>
        </div>
      </article>
    `}_renderEntityActions(t,i,e){const a=this._entityActionKind(i),o=this._isUnavailable(t),n=this._entityDisplayName(t),s=t=>this._t("action.entity_action",{action:t,name:n});if("toggle"===a)return d`
        <button
          class="domain-entity-action domain-entity-toggle"
          type="button"
          role="switch"
          aria-checked=${e?"true":"false"}
          title=${e?this._t("action.turn_off"):this._t("action.turn_on")}
          aria-label=${n}
          ?disabled=${o}
          @click=${e=>this._handleEntityToggle(e,t,i)}
        ></button>
      `;if("cover"===a)return this._renderCoverActions(t);if("lock"===a){const e=this._isEntityActiveForUi(t,i);return d`
        <button
          class="domain-entity-action domain-lock-action ${e?"is-unlocked":""}"
          type="button"
          title=${e?this._t("action.lock"):this._t("action.unlock")}
          aria-label=${s(e?this._t("action.lock"):this._t("action.unlock"))}
          ?disabled=${o}
          @click=${i=>this._handleLockAction(i,t)}
        >
          <ha-icon icon=${e?"mdi:lock-open-variant-outline":"mdi:lock-outline"}></ha-icon>
        </button>
      `}return d`
      <span class="domain-entity-action domain-entity-more" aria-hidden="true">
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </span>
    `}_renderCoverActions(t){const i=String(t?.state||"").toLowerCase(),e=this._isUnavailable(t),a=this._coverSupportsFeature(t,1),o=this._coverSupportsFeature(t,2),n=this._coverSupportsFeature(t,8),s=this._entityDisplayName(t),r=t=>this._t("action.entity_action",{action:t,name:s});return d`
      <div class="domain-cover-actions" @click=${t=>t.stopPropagation()}>
        ${a?d`
          <button
            class="domain-entity-action domain-cover-action ${"opening"===i?"active":""}"
            type="button"
            title=${this._t("action.open")}
            aria-label=${r(this._t("action.open"))}
            ?disabled=${e}
            @click=${i=>this._handleCoverAction(i,t,"open")}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
        `:l}
        ${n?d`
          <button
            class="domain-entity-action domain-cover-action ${"opening"===i||"closing"===i?"active":""}"
            type="button"
            title=${this._t("action.stop")}
            aria-label=${r(this._t("action.stop"))}
            ?disabled=${e}
            @click=${i=>this._handleCoverAction(i,t,"stop")}
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        `:l}
        ${o?d`
          <button
            class="domain-entity-action domain-cover-action ${"closing"===i?"active":""}"
            type="button"
            title=${this._t("action.close")}
            aria-label=${r(this._t("action.close"))}
            ?disabled=${e}
            @click=${i=>this._handleCoverAction(i,t,"close")}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
        `:l}
      </div>
    `}async _runBulkDomainAction(t,i,e){const a=t.length;await F(this,{hass:this.hass,title:this._t("action.confirm_bulk",{action:e,entities:this._tp("common.entity",a)}),confirmLabel:e,destructive:J(i),container:this.renderRoot.querySelector("ha-dialog")||void 0})&&await this._executeBulkAction(t,i)}async _executeBulkAction(t,i){if(!(t=t.filter(t=>$(this.hass.states[t]))).length)return;const e=this._params?.domain||"",a="turn_on"===i?"on":"turn_off"===i?"off":void 0;a&&this._setOptimisticEntityStates(t,a);try{if(Z.has(e))return void await this.hass.callService(e,i,{entity_id:t});if("cover"===e)return void await this.hass.callService("cover",i,{entity_id:t});"lock"===e&&await this.hass.callService("lock",i,{entity_id:t})}catch(o){a&&this._clearOptimisticEntityStates(t),console.warn(`Failed to run ${i} for ${e}:`,o),this._showToast(this._t("entity.group_failed"))}}_tileTapOptions(t,i){const e=()=>this._showMoreInfo(t);return i?{tap:()=>{this._tapToggleEntity(t)},hold:e}:{tap:e}}async _tapToggleEntity(t){const i=this.hass?.states[t];if(!i)return;const e=this._getEffectiveEntityState(i);this._isUnavailable(e)?this._showMoreInfo(t):await this._toggleEntity(e,t.split(".")[0]||"")}async _handleEntityToggle(t,i,e){t.stopPropagation(),await this._toggleEntity(i,e)}async _toggleEntity(t,i){const e=t?.entity_id;if(e){try{if(["light","switch","fan","input_boolean"].includes(i)){const a=!this._isEntityActiveForUi(t,i);return this._setOptimisticEntityStates([e],a?"on":"off"),void await this.hass.callService(i,a?"turn_on":"turn_off",{entity_id:e})}}catch(t){return this._clearOptimisticEntityStates([e]),console.warn(`Failed to toggle entity ${e}:`,t),void this._showToast(this._t("entity.update_failed"))}this._showMoreInfo(e)}}async _handleCoverAction(t,i,e){t.stopPropagation();const a=i?.entity_id;if(!a)return;const o="open"===e?"open_cover":"close"===e?"close_cover":"stop_cover",n="open"===e?"open":"close"===e?"closed":void 0;n&&this._setOptimisticEntityStates([a],n);try{await this.hass.callService("cover",o,{entity_id:a})}catch(t){this._clearOptimisticEntityStates([a]),console.warn(`Failed to ${e} cover ${a}:`,t),this._showToast(this._t("entity.cover_failed"))}}async _handleLockAction(t,i){t.stopPropagation();const e=i?.entity_id;if(e)try{const t=this._isEntityActiveForUi(i,"lock");this._setOptimisticEntityStates([e],t?"locked":"unlocked"),await this.hass.callService("lock",t?"lock":"unlock",{entity_id:e})}catch(t){this._clearOptimisticEntityStates([e]),console.warn(`Failed to toggle lock ${e}:`,t),this._showToast(this._t("entity.lock_failed"))}}_entityDisplayName(t){const i=String(t?.entity_id||"");return t?.attributes?.friendly_name||U(this.hass)[i]?.name||i}_showToast(t){L(this,"hass-notification",{message:t})}_showMoreInfo(t){const i=document.querySelector("home-assistant");L(i||window,"hass-more-info",{entityId:t})}_entityActionKind(t){return["light","switch","fan","input_boolean"].includes(t)?"toggle":"cover"===t?"cover":"lock"===t?"lock":"more"}_coverSupportsFeature(t,i){const e=Number(t?.attributes?.supported_features);return!Number.isFinite(e)||e<=0?1===i||2===i:0!==(e&i)}_entityStatusText(t,i){if(!t)return"";const e=this._getEffectiveEntityState(t),a=N(this.hass,e);if("light"===i&&"on"===e.state&&"number"==typeof e.attributes?.brightness)return this._t("entity.brightness",{value:Math.round(e.attributes.brightness/255*100)});if("cover"===i&&"number"==typeof e.attributes?.current_position)return`${a} · ${M(e.attributes.current_position,"%")}`;if("climate"===i){const t=e.attributes?.current_temperature,i=e.attributes?.temperature,a=this.hass?.config?.unit_system?.temperature||"°C";if(void 0!==t&&void 0!==i)return`${M(t,a)} · ${this._t("entity.climate_set",{value:M(i,a)})}`;if(void 0!==t)return M(t,a)}return"media_player"===i&&e.attributes?.media_title?`${a} · ${e.attributes.media_title}`:a}_getEffectiveEntityState(t){const i=t?.entity_id;if(!i)return t;const e=this._optimisticEntityStates[i];if(!e||e.expiresAt<=Date.now())return t;const a=String(t?.state||"").toLowerCase();return"unavailable"===a||"unknown"===a||a===e.state.toLowerCase()?t:{...t,state:e.state}}_setOptimisticEntityStates(t,i){const e=[...new Set(t.filter(Boolean))];if(!e.length)return;const a=Date.now()+5e3,o={...this._optimisticEntityStates};e.forEach(t=>{o[t]={state:i,expiresAt:a}}),this._optimisticEntityStates=o,this._scheduleOptimisticCleanup()}_clearOptimisticEntityStates(t){const i=[...new Set(t.filter(Boolean))];if(!i.length)return;const e={...this._optimisticEntityStates};let a=!1;i.forEach(t=>{e[t]&&(delete e[t],a=!0)}),a&&(this._optimisticEntityStates=e)}_reconcileOptimisticEntityStates(){const t=Object.entries(this._optimisticEntityStates);if(!t.length)return;const i=Date.now(),e={...this._optimisticEntityStates};let a=!1;t.forEach(([t,o])=>{const n=this.hass?.states?.[t]?.state;(!n||o.expiresAt<=i||String(n).toLowerCase()===o.state.toLowerCase())&&(delete e[t],a=!0)}),a&&(this._optimisticEntityStates=e)}_scheduleOptimisticCleanup(){if(void 0!==this._optimisticCleanupTimer)return;const t=Object.values(this._optimisticEntityStates).map(t=>t.expiresAt);if(!t.length)return;const i=Math.min(...t);if(!Number.isFinite(i))return;const e=Math.max(80,i-Date.now()+50);this._optimisticCleanupTimer=window.setTimeout(()=>{this._optimisticCleanupTimer=void 0,this._reconcileOptimisticEntityStates(),Object.keys(this._optimisticEntityStates).length&&this._scheduleOptimisticCleanup()},e)}_isUnavailable(t){return["unavailable","unknown"].includes(String(t?.state||"").toLowerCase())}_isEntityActiveForUi(t,i){if(!t||this._isUnavailable(t))return!1;const e=String(t.state).toLowerCase();if("cover"===i)return["open","opening"].includes(e);if("lock"===i)return"unlocked"===e;if("climate"===i){const i=t.attributes?.hvac_action;return i&&"idle"!==i&&"off"!==i}return"media_player"===i?["playing","buffering"].includes(e):"vacuum"===i?["cleaning","returning"].includes(e):"alarm_control_panel"===i?e.startsWith("armed")||["arming","pending","triggered"].includes(e):"camera"!==i&&!["off","closed","locked","not_home","idle"].includes(e)}_entityColor(t,i){return h(t,i)}_entityAreaName(t){const i=this._params?.config,e=t.area_id||_(this.hass,i,t.entity_id);return e?m(i).get(e)?.name:void 0}_getLocalizedDomainTitle(t){return S(this.hass,t)}};ot.styles=[G,z,r`.area-section{margin-bottom:18px;background:color-mix(in srgb,var(--card-background-color) 98%,#ffffff);border-radius:16px;overflow:hidden;box-shadow:0 14px 34px rgba(15,23,42,0.06),inset 0 0 0 1px rgba(15,23,42,0.04)}.area-header{display:flex;align-items:center;gap:12px;padding:14px 16px 0;background:transparent;border-bottom:0}.area-header:has(.area-icon){gap:12px}.area-header:not(:has(.area-icon)){gap:0}.area-icon{width:34px;height:34px;border-radius:999px;background:color-mix(in srgb,var(--primary-color) 12%,transparent);color:var(--primary-color);display:flex;align-items:center;justify-content:center}.area-icon ha-icon{--mdc-icon-size:19px}.area-name{font-size:18px;font-weight:850;flex:1}.entity-count{color:var(--secondary-text-color);font-size:13px;font-weight:750}.entities-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(164px,1fr));gap:12px;padding:16px}.domain-todo-list-card{grid-column:1 / -1;min-width:0}.domain-todo-list-card dwains-dashboard-next-card-host{display:block;width:100%}.domain-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 16px}.domain-action-button{min-height:40px;padding:0 14px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:var(--primary-text-color);background:var(--card-background-color);font:inherit;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 10px 22px rgba(15,23,42,0.07),inset 0 0 0 1px rgba(15,23,42,0.05);transition:transform 0.18s ease,box-shadow 0.18s ease}.domain-action-button:hover{transform:translateY(-1px);box-shadow:0 14px 26px rgba(15,23,42,0.1),inset 0 0 0 1px rgba(15,23,42,0.07)}.domain-action-button:active{transform:scale(0.97)}.domain-action-button ha-icon{--mdc-icon-size:18px;color:var(--domain-color,var(--primary-color))}.dialog-view-all{min-height:40px;padding:0 14px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent);font:inherit;font-size:13px;font-weight:850;cursor:pointer;transition:transform 0.18s ease,background 0.18s ease}.dialog-view-all:hover{background:color-mix(in srgb,var(--primary-color) 18%,transparent);transform:translateY(-1px)}.dialog-view-all:active{transform:scale(0.97)}.dialog-view-all ha-icon{--mdc-icon-size:18px}.domain-entity-card{--entity-color:var(--primary-color);position:relative;box-sizing:border-box;min-width:0;min-height:132px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;border:0;border-radius:12px;background:color-mix(in srgb,var(--card-background-color) 98%,#ffffff);color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer;box-shadow:0 12px 26px rgba(15,23,42,0.06),inset 0 0 0 1px rgba(15,23,42,0.035);transition:transform 0.18s ease,box-shadow 0.18s ease}.domain-entity-card.tap-toggles{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}.domain-entity-card:active{transform:scale(0.985)}.domain-entity-card.is-active{box-shadow:0 14px 30px rgba(15,23,42,0.08),inset 0 0 0 1px color-mix(in srgb,var(--entity-color) 18%,transparent)}.domain-entity-card.is-unavailable{opacity:0.62}.domain-entity-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.domain-entity-icon{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:11px;color:var(--entity-color);background:color-mix(in srgb,var(--entity-color) 13%,transparent)}.domain-entity-icon ha-icon{--mdc-icon-size:20px}.domain-entity-action{padding:0;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border:0;cursor:pointer;transition:background-color 0.18s ease,color 0.18s ease,transform 0.18s ease,opacity 0.18s ease}.domain-entity-action:active{transform:scale(0.94)}button.domain-entity-action,.domain-cover-actions{position:relative;z-index:3}.domain-entity-action:disabled{opacity:0.36;cursor:not-allowed}.domain-entity-toggle{width:38px;height:22px;justify-content:flex-start;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 80%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.07),0 4px 10px rgba(15,23,42,0.08)}.domain-entity-toggle::before{content:"";width:18px;height:18px;margin-left:2px;border-radius:999px;background:#ffffff;box-shadow:0 2px 7px rgba(15,23,42,0.2);transition:transform 0.18s ease}.domain-entity-card.is-active .domain-entity-toggle{background:var(--entity-color)}.domain-entity-card.is-active .domain-entity-toggle::before{transform:translateX(16px)}.domain-entity-more,.domain-lock-action{width:30px;height:30px;border-radius:999px;color:color-mix(in srgb,var(--primary-text-color) 52%,transparent);background:color-mix(in srgb,var(--secondary-background-color) 70%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.05)}.domain-lock-action.is-unlocked{color:#ffffff;background:var(--entity-color);box-shadow:0 8px 16px color-mix(in srgb,var(--entity-color) 24%,transparent)}.domain-entity-more ha-icon,.domain-lock-action ha-icon{--mdc-icon-size:17px}.domain-cover-actions{min-height:32px;padding:3px;display:inline-flex;align-items:center;gap:3px;flex:0 0 auto;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 74%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.055),0 6px 14px rgba(15,23,42,0.08)}.domain-cover-action{width:26px;height:26px;border-radius:999px;color:color-mix(in srgb,var(--primary-text-color) 58%,transparent);background:transparent}.domain-cover-action.active{color:#ffffff;background:var(--entity-color);box-shadow:0 6px 12px color-mix(in srgb,var(--entity-color) 22%,transparent)}.domain-cover-action ha-icon{--mdc-icon-size:16px}.domain-entity-copy{min-width:0}.domain-entity-meta{margin-bottom:3px;color:color-mix(in srgb,var(--secondary-text-color) 78%,transparent);font-size:11px;font-weight:800;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.domain-entity-name{color:var(--primary-text-color);font-size:15px;font-weight:850;line-height:1.05;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.domain-entity-status{margin-top:5px;color:color-mix(in srgb,var(--secondary-text-color) 84%,transparent);font-size:12px;font-weight:760;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.loading{display:flex;align-items:center;justify-content:center;height:200px;font-size:16px;opacity:0.6}.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;text-align:center}.empty-state ha-icon{--mdc-icon-size:64px;opacity:0.3;margin-bottom:16px}.empty-state-text{font-size:16px;opacity:0.6}.custom-description{display:flex;align-items:flex-start;gap:12px;background:var(--warning-color);color:white;padding:16px;border-radius:8px;margin-bottom:24px}.custom-description ha-icon{--mdc-icon-size:20px;margin-top:2px;flex-shrink:0}.custom-description p{margin:0;line-height:1.5;font-size:14px}@media (max-width:600px){.area-section{margin-bottom:16px;border-radius:14px}.entities-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:12px}.domain-entity-card{min-height:126px}}`,et,tt],t([i({attribute:!1})],ot.prototype,"hass",void 0),t([a()],ot.prototype,"_params",void 0),t([a()],ot.prototype,"_groupedEntities",void 0),t([a()],ot.prototype,"_loading",void 0),t([a()],ot.prototype,"_optimisticEntityStates",void 0),ot=t([e("dwains-dashboard-next-domain-entities-dialog")],ot);export{ot as DwainsDomainEntitiesDialog};
