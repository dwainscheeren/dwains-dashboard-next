import{_ as t,n as i,r as e,t as a}from"./state-DfsJqMnn.js";import{J as o}from"./wall-tablet-sVhHpZ_H.js";import{i as n,A as s,b as r,a as c}from"./lit-element-Bpv9xYb0.js";import{i as d,D as l,h,k as p,j as m,l as u,n as _}from"./icons-CDJcmrK5.js";import{d as g,b as f,g as y}from"./index-DVHykqNs.js";import{f as v}from"./fire-event-DQiSssdY.js";import{s as b}from"./confirm-dialog-CePb0ykT.js";import{f as x,a as w}from"./dwains-bottom-nav-CPWTXnuB.js";import"./dd-card-host-zbmwRU5c.js";import"./blueprints-Dh4Un1Bn.js";let k=class extends n{constructor(){super(...arguments),this._groupedEntities={},this._loading=!0,this._optimisticEntityStates={},this._entityCards=new Map,this._mobileSheetAnimated=!1,this._handleViewAll=()=>{const t=this._params?.onViewAll;this.closeDialog(),t?.()}}_t(t,i){return g(this.hass,t,i)}_tp(t,i){return f(this.hass,t,i)}async showDialog(t){this._params=t,this._loading=!0,this._mobileSheetAnimated=!1,await this._loadEntities()}closeDialog(){this._params=void 0,this._groupedEntities={},this._optimisticEntityStates={},this._entityCards.clear(),this._mobileSheetAnimated=!1,this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=void 0),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0),v(this,"dialog-closed",{dialog:this.localName})}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._params&&!this._loading&&(this._reconcileOptimisticEntityStates(),this._updateEntityCards()),this._animateMobileSheetIn()}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0)}_animateMobileSheetIn(){!this._mobileSheetAnimated&&this._params&&"undefined"!=typeof window&&window.matchMedia("(max-width: 600px)").matches&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&requestAnimationFrame(()=>{const t=this.renderRoot.querySelector("ha-dialog"),i=t?.shadowRoot,e=i?.querySelector("wa-dialog"),a=e?.shadowRoot,o=a?.querySelector('[part~="panel"]')||a?.querySelector("dialog")||i?.querySelector(".mdc-dialog__surface")||i?.querySelector('[part~="surface"]');o?.animate&&(this._mobileSheetAnimated=!0,o.animate([{transform:"translate3d(0, 100%, 0)",opacity:.98},{transform:"translate3d(0, 0, 0)",opacity:1}],{duration:280,easing:"cubic-bezier(0.22, 1, 0.36, 1)",fill:"both"}))})}async _loadEntities(){if(!this._params||!this.hass)return;const{domain:t,areaId:i,config:e,filterByUnitOfMeasurement:a,deviceClass:o,entityIds:n}=this._params,s={},r=n?.length?new Set(n):void 0,c=e.areas||[],h=new Map(c.map(t=>[t.area_id,t])),p=Object.values(this.hass.states),m=[];p.forEach(n=>{const s=n.entity_id;if(r&&!r.has(s))return;if(!d(y(this.hass)[s]))return;if(s.split(".")[0]!==t)return;if(!n||"unavailable"===n.state)return;const c=e.entities?.find(t=>t.entity_id===s),h=c&&c.device_id?e.devices?.find(t=>t.device_id===c.device_id):null,p=c?.area_id||h?.area_id||y(this.hass)[s]?.area_id;if(p&&(!i||p===i)&&l(this.hass,e,s,p,c)){if(a){if(n.attributes?.unit_of_measurement!==a)return}else if("binary_sensor"===t&&o){const t=n.attributes?.device_class;if(t!==o)return}m.push({entity_id:s,area_id:p,hidden:!1})}}),m.forEach(i=>{const e=this.hass.states[i.entity_id];if("person"===t){const t=e?.state||"unknown",a="home"===t?"home":"away",o="home"===t?"Home":"away"===t||"not_home"===t?"Away":`${t.charAt(0).toUpperCase()}${t.slice(1)}`;s[a]||(s[a]={areaName:o,entities:[]}),s[a].entities.push(i)}else{const t=i.area_id,e=h.get(t);if(!e)return;s[t]||(s[t]={areaName:e.name,entities:[]}),s[t].entities.push(i)}}),this._groupedEntities=s,this._loading=!1,this._updateInterval||(this._updateInterval=window.setInterval(()=>{this._checkForEntityChanges()},1e3))}_checkForEntityChanges(){if(!this._params||!this.hass||this._loading)return;const{domain:t,filterByUnitOfMeasurement:i,deviceClass:e}=this._params;let a=!1;Object.entries(this._groupedEntities).forEach(([o,n])=>{n.entities.forEach(o=>{const n=this.hass.states[o.entity_id];if(!n)return void(a=!0);this._shouldEntityBeVisible(n,t,i,e)||(a=!0)})}),a&&this._loadEntities()}_shouldEntityBeVisible(t,i,e,a){return"unavailable"!==t.state&&(e?t.attributes?.unit_of_measurement===e:"binary_sensor"!==i||!a||t.attributes?.device_class===a)}_updateEntityCards(){this._entityCards.forEach((t,i)=>{t&&"hass"in t&&(t.hass=this.hass)})}render(){if(!this._params)return s;const{domain:t,filterByUnitOfMeasurement:i,deviceClass:e,customTitle:a}=this._params;let n=a||this._getLocalizedDomainTitle(t);if("W"===i)n=this._t("dialog.power_sensors");else if(e){n={motion:this._t("dialog.motion_sensors"),door:this._t("dialog.door_sensors"),window:this._t("dialog.window_sensors"),smoke:this._t("dialog.smoke_sensors"),gas:this._t("dialog.gas_sensors"),moisture:this._t("dialog.moisture_sensors"),occupancy:this._t("dialog.occupancy_sensors"),opening:this._t("dialog.opening_sensors"),presence:this._t("dialog.presence_sensors"),safety:this._t("dialog.safety_sensors"),tamper:this._t("dialog.tamper_sensors"),vibration:this._t("dialog.vibration_sensors")}[e]||this._getLocalizedDomainTitle(t)}return r`
      <ha-dialog
        open
        @closed=${this.closeDialog}
        @cancel=${()=>this.closeDialog()}
        .heading=${n}
        .type=${""}
        flexContent
        hideActions
      >
        <ha-dialog-header slot="header">
          <div class="sheet-handle" aria-hidden="true"></div>
          <ha-icon-button
            slot="navigationIcon"
            .label=${this._t("common.close")}
            .path=${o}
            @click=${()=>this.closeDialog()}
          ></ha-icon-button>
          <span slot="title">${n}</span>
        </ha-dialog-header>

        <div class="content">
          ${this._loading?r`<div class="loading">${this._t("common.loading")}</div>`:this._renderContent()}
        </div>
      </ha-dialog>
    `}_renderContent(){if(this._params?.customEntities)return this._renderCustomEntities();const t=this._allDialogEntities();return 0===t.length?r`
        <div class="empty-state">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t("dialog.active_empty")}
          </div>
        </div>
      `:r`
      ${this._renderViewAllAction()}
      ${this._renderDomainActions(t)}
      ${h(Object.entries(this._groupedEntities),([t])=>t,([t,i])=>this._renderAreaSection(t,i))}
    `}_renderViewAllAction(){return this._params?.onViewAll?r`
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
    `:s}_renderCustomEntities(){const{customEntities:t,customDescription:i}=this._params;return t&&0!==t.length?r`
      ${i?r`
        <div class="custom-description">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <p>${i}</p>
        </div>
      `:s}

      <div class="entity-section">
        <div class="entities-grid">
          ${h(t,t=>t,t=>this._renderEntityCard({entity_id:t,hidden:!1}))}
        </div>
      </div>
    `:r`
        <div class="empty-state">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t("dialog.problem_empty")}
          </div>
        </div>
      `}_allDialogEntities(){return Object.values(this._groupedEntities).flatMap(t=>t.entities)}_renderDomainActions(t){const i=this._params?.domain||"",e=t.map(t=>t.entity_id).filter(t=>this.hass.states[t]);if(!e.length)return s;const a=this._entityColor(i),o=(t,i,o)=>r`
      <button
        class="domain-action-button"
        type="button"
        style=${`--domain-color: ${a};`}
        @click=${()=>this._runBulkDomainAction(e,o,t)}
      >
        <ha-icon icon=${i}></ha-icon>
        <span>${t}</span>
      </button>
    `;return["light","switch","fan","input_boolean"].includes(i)?r`
        <div class="domain-actions">
          ${o(this._t("action.turn_on_all"),"mdi:power","turn_on")}
          ${o(this._t("action.turn_off_all"),"mdi:power-off","turn_off")}
        </div>
      `:"cover"===i?r`
        <div class="domain-actions">
          ${o(this._t("action.open_all"),"mdi:arrow-up","open_cover")}
          ${o(this._t("action.close_all"),"mdi:arrow-down","close_cover")}
        </div>
      `:"lock"===i?r`
        <div class="domain-actions">
          ${o(this._t("action.unlock_all"),"mdi:lock-open-variant-outline","unlock")}
          ${o(this._t("action.lock_all"),"mdi:lock-outline","lock")}
        </div>
      `:s}_renderAreaSection(t,i){let e="";if(this._params?.config?.areas){const i=this._params.config.areas.find(i=>i.area_id===t);i?.icon&&(e=i.icon)}return"person"===this._params?.domain&&(e="home"===t?"mdi:home-account":"away"===t?"mdi:account-arrow-right":"mdi:account-question"),r`
      <div class="area-section">
        <div class="area-header">
          ${e?r`
            <div class="area-icon">
              <ha-icon icon="${e}"></ha-icon>
            </div>
          `:s}
          <div class="area-name">${i.areaName}</div>
          <div class="entity-count">${i.entities.length}</div>
        </div>
        <div class="entities-grid">
          ${h(i.entities,t=>t.entity_id,t=>this._renderEntityCard(t,i.areaName))}
        </div>
      </div>
    `}_renderEntityCard(t,i){const e=this.hass.states[t.entity_id];if(!e)return s;const a=this._getEffectiveEntityState(e),o=t.entity_id.split(".")[0]||"unknown";if("todo"===o)return r`
        <div class="domain-todo-list-card" data-entity=${t.entity_id}>
          <dwains-dashboard-next-card-host
            eager
            .hass=${this.hass}
            .config=${{type:"todo-list",entity:t.entity_id}}
          ></dwains-dashboard-next-card-host>
        </div>
      `;const n=a.attributes?.device_class,c=y(this.hass)[t.entity_id]?.icon||a.attributes?.icon||p(o,n)||m(o),d=a.attributes?.friendly_name||y(this.hass)[t.entity_id]?.name||t.entity_id,l=this._isEntityActiveForUi(a,o),h=["domain-entity-card",`domain-entity-${o}`,l?"is-active":"is-off",this._isUnavailable(a)?"is-unavailable":""].join(" ");return r`
      <article
        class=${h}
        style=${`--entity-color: ${this._entityColor(o,n)};`}
        role="button"
        tabindex="0"
        aria-label=${d}
        @click=${()=>this._showMoreInfo(t.entity_id)}
        @keydown=${i=>this._handleEntityKeydown(i,t.entity_id)}
      >
        <div class="domain-entity-top">
          <div class="domain-entity-icon">
            <ha-icon icon=${c}></ha-icon>
          </div>
          ${this._renderEntityActions(a,o,l)}
        </div>
        <div class="domain-entity-copy">
          <div class="domain-entity-meta">${i||this._entityAreaName(t)||this._t("dialog.no_area")}</div>
          <div class="domain-entity-name">${d}</div>
          <div class="domain-entity-status">${this._entityStatusText(a,o)}</div>
        </div>
      </article>
    `}_renderEntityActions(t,i,e){const a=t?.entity_id,o=this._entityActionKind(i),n=this._isUnavailable(t),s=this._entityDisplayName(t),c=t=>this._t("action.entity_action",{action:t,name:s});if("toggle"===o)return r`
        <button
          class="domain-entity-action domain-entity-toggle"
          type="button"
          role="switch"
          aria-checked=${e?"true":"false"}
          title=${e?this._t("action.turn_off"):this._t("action.turn_on")}
          aria-label=${s}
          ?disabled=${n}
          @click=${e=>this._handleEntityToggle(e,t,i)}
        ></button>
      `;if("cover"===o)return this._renderCoverActions(t);if("lock"===o){const e=this._isEntityActiveForUi(t,i);return r`
        <button
          class="domain-entity-action domain-lock-action ${e?"is-unlocked":""}"
          type="button"
          title=${e?this._t("action.lock"):this._t("action.unlock")}
          aria-label=${c(e?this._t("action.lock"):this._t("action.unlock"))}
          ?disabled=${n}
          @click=${i=>this._handleLockAction(i,t)}
        >
          <ha-icon icon=${e?"mdi:lock-open-variant-outline":"mdi:lock-outline"}></ha-icon>
        </button>
      `}return r`
      <button
        class="domain-entity-action domain-entity-more"
        type="button"
        title=${this._t("action.more_info")}
        aria-label=${c(this._t("action.more_info"))}
        @click=${t=>this._handleMoreInfo(t,a)}
      >
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>
    `}_renderCoverActions(t){const i=String(t?.state||"").toLowerCase(),e=this._isUnavailable(t),a=this._coverSupportsFeature(t,1),o=this._coverSupportsFeature(t,2),n=this._coverSupportsFeature(t,8),c=this._entityDisplayName(t),d=t=>this._t("action.entity_action",{action:t,name:c});return r`
      <div class="domain-cover-actions" @click=${t=>t.stopPropagation()}>
        ${a?r`
          <button
            class="domain-entity-action domain-cover-action ${"opening"===i?"active":""}"
            type="button"
            title=${this._t("action.open")}
            aria-label=${d(this._t("action.open"))}
            ?disabled=${e}
            @click=${i=>this._handleCoverAction(i,t,"open")}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
        `:s}
        ${n?r`
          <button
            class="domain-entity-action domain-cover-action ${"opening"===i||"closing"===i?"active":""}"
            type="button"
            title=${this._t("action.stop")}
            aria-label=${d(this._t("action.stop"))}
            ?disabled=${e}
            @click=${i=>this._handleCoverAction(i,t,"stop")}
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        `:s}
        ${o?r`
          <button
            class="domain-entity-action domain-cover-action ${"closing"===i?"active":""}"
            type="button"
            title=${this._t("action.close")}
            aria-label=${d(this._t("action.close"))}
            ?disabled=${e}
            @click=${i=>this._handleCoverAction(i,t,"close")}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
        `:s}
      </div>
    `}async _runBulkDomainAction(t,i,e){const a=this._params?.domain||"",o=t.length;if(!await b(this,{hass:this.hass,title:this._t("action.confirm_bulk",{action:e,entities:this._tp("common.entity",o)}),confirmLabel:e,destructive:"turn_off"===i||"close_cover"===i||"unlock"===i,container:this.renderRoot.querySelector("ha-dialog")||void 0}))return;const n="turn_on"===i?"on":"turn_off"===i?"off":"open_cover"===i?"open":"close_cover"===i?"closed":"unlock"===i?"unlocked":"lock"===i?"locked":void 0;n&&this._setOptimisticEntityStates(t,n);try{if(["light","switch","fan","input_boolean"].includes(a))return void await this.hass.callService(a,i,{entity_id:t});if("cover"===a)return void await this.hass.callService("cover",i,{entity_id:t});"lock"===a&&await this.hass.callService("lock",i,{entity_id:t})}catch(e){this._clearOptimisticEntityStates(t),console.warn(`Failed to run ${i} for ${a}:`,e),this._showToast(this._t("entity.group_failed"))}}_handleEntityKeydown(t,i){t.target===t.currentTarget&&("Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._showMoreInfo(i)))}async _handleEntityToggle(t,i,e){t.stopPropagation();const a=i?.entity_id;if(a){try{if(["light","switch","fan","input_boolean"].includes(e)){const t=!this._isEntityActiveForUi(i,e);return this._setOptimisticEntityStates([a],t?"on":"off"),void await this.hass.callService(e,t?"turn_on":"turn_off",{entity_id:a})}}catch(t){return this._clearOptimisticEntityStates([a]),console.warn(`Failed to toggle entity ${a}:`,t),void this._showToast(this._t("entity.update_failed"))}this._showMoreInfo(a)}}async _handleCoverAction(t,i,e){t.stopPropagation();const a=i?.entity_id;if(!a)return;const o="open"===e?"open_cover":"close"===e?"close_cover":"stop_cover",n="open"===e?"open":"close"===e?"closed":void 0;n&&this._setOptimisticEntityStates([a],n);try{await this.hass.callService("cover",o,{entity_id:a})}catch(t){this._clearOptimisticEntityStates([a]),console.warn(`Failed to ${e} cover ${a}:`,t),this._showToast(this._t("entity.cover_failed"))}}async _handleLockAction(t,i){t.stopPropagation();const e=i?.entity_id;if(e)try{const t=this._isEntityActiveForUi(i,"lock");this._setOptimisticEntityStates([e],t?"locked":"unlocked"),await this.hass.callService("lock",t?"lock":"unlock",{entity_id:e})}catch(t){this._clearOptimisticEntityStates([e]),console.warn(`Failed to toggle lock ${e}:`,t),this._showToast(this._t("entity.lock_failed"))}}_entityDisplayName(t){const i=String(t?.entity_id||"");return t?.attributes?.friendly_name||y(this.hass)[i]?.name||i}_showToast(t){v(this,"hass-notification",{message:t})}_handleMoreInfo(t,i){t.stopPropagation(),i&&this._showMoreInfo(i)}_showMoreInfo(t){const i=document.querySelector("home-assistant");v(i||window,"hass-more-info",{entityId:t})}_entityActionKind(t){return["light","switch","fan","input_boolean"].includes(t)?"toggle":"cover"===t?"cover":"lock"===t?"lock":"more"}_coverSupportsFeature(t,i){const e=Number(t?.attributes?.supported_features);return!Number.isFinite(e)||e<=0?1===i||2===i:0!==(e&i)}_entityStatusText(t,i){if(!t)return"";const e=this._getEffectiveEntityState(t),a=x(this.hass,e);if("light"===i&&"on"===e.state&&"number"==typeof e.attributes?.brightness)return this._t("entity.brightness",{value:Math.round(e.attributes.brightness/255*100)});if("cover"===i&&"number"==typeof e.attributes?.current_position)return`${a} · ${w(e.attributes.current_position,"%")}`;if("climate"===i){const t=e.attributes?.current_temperature,i=e.attributes?.temperature,a=this.hass?.config?.unit_system?.temperature||"°C";if(void 0!==t&&void 0!==i)return`${w(t,a)} · ${this._t("entity.climate_set",{value:w(i,a)})}`;if(void 0!==t)return w(t,a)}return"media_player"===i&&e.attributes?.media_title?`${a} · ${e.attributes.media_title}`:a}_getEffectiveEntityState(t){const i=t?.entity_id;if(!i)return t;const e=this._optimisticEntityStates[i];if(!e||e.expiresAt<=Date.now())return t;return String(t?.state||"").toLowerCase()===e.state.toLowerCase()?t:{...t,state:e.state}}_setOptimisticEntityStates(t,i){const e=[...new Set(t.filter(Boolean))];if(!e.length)return;const a=Date.now()+5e3,o={...this._optimisticEntityStates};e.forEach(t=>{o[t]={state:i,expiresAt:a}}),this._optimisticEntityStates=o,this._scheduleOptimisticCleanup()}_clearOptimisticEntityStates(t){const i=[...new Set(t.filter(Boolean))];if(!i.length)return;const e={...this._optimisticEntityStates};let a=!1;i.forEach(t=>{e[t]&&(delete e[t],a=!0)}),a&&(this._optimisticEntityStates=e)}_reconcileOptimisticEntityStates(){const t=Object.entries(this._optimisticEntityStates);if(!t.length)return;const i=Date.now(),e={...this._optimisticEntityStates};let a=!1;t.forEach(([t,o])=>{const n=this.hass?.states?.[t]?.state;(!n||o.expiresAt<=i||String(n).toLowerCase()===o.state.toLowerCase())&&(delete e[t],a=!0)}),a&&(this._optimisticEntityStates=e)}_scheduleOptimisticCleanup(){if(void 0!==this._optimisticCleanupTimer)return;const t=Object.values(this._optimisticEntityStates).map(t=>t.expiresAt);if(!t.length)return;const i=Math.min(...t);if(!Number.isFinite(i))return;const e=Math.max(80,i-Date.now()+50);this._optimisticCleanupTimer=window.setTimeout(()=>{this._optimisticCleanupTimer=void 0,this._reconcileOptimisticEntityStates(),Object.keys(this._optimisticEntityStates).length&&this._scheduleOptimisticCleanup()},e)}_isUnavailable(t){return["unavailable","unknown"].includes(String(t?.state||"").toLowerCase())}_isEntityActiveForUi(t,i){if(!t||this._isUnavailable(t))return!1;const e=String(t.state).toLowerCase();if("cover"===i)return["open","opening"].includes(e);if("lock"===i)return"unlocked"===e;if("climate"===i){const i=t.attributes?.hvac_action;return i&&"idle"!==i&&"off"!==i}return"media_player"===i?["playing","buffering"].includes(e):"vacuum"===i?["cleaning","returning"].includes(e):"alarm_control_panel"===i?e.startsWith("armed")||["arming","pending","triggered"].includes(e):"camera"!==i&&!["off","closed","locked","not_home","idle"].includes(e)}_entityColor(t,i){return u(t,i)}_entityAreaName(t){const i=this._params?.config,e=i?.entities?.find(i=>i.entity_id===t.entity_id),a=e?.device_id?i?.devices?.find(t=>t.device_id===e.device_id):void 0,o=t.area_id||e?.area_id||a?.area_id||y(this.hass)[t.entity_id]?.area_id;return i?.areas?.find(t=>t.area_id===o)?.name}_getLocalizedDomainTitle(t){return _(this.hass,t)}};k.styles=c`:host{--mdc-dialog-min-width:90vw;--mdc-dialog-max-width:1200px;--mdc-dialog-max-height:90vh;--mdc-dialog-z-index:10;--dialog-backdrop-opacity:0.4;-webkit-tap-highlight-color:transparent}ha-dialog{--mdc-dialog-heading-ink-color:var(--primary-text-color);--mdc-dialog-content-ink-color:var(--primary-text-color);--dialog-content-padding:0;--ha-dialog-scrim-backdrop-filter:brightness(72%) blur(2px);--mdc-dialog-scrim-color:rgba(0,0,0,0.28)}ha-dialog-header{--mdc-typography-headline6-font-size:20px;--mdc-typography-headline6-font-weight:500}.sheet-handle{display:none}.content{padding:16px 18px 22px !important;overflow:auto;max-height:calc(90vh - 120px);background:var(--primary-background-color)}.area-section{margin-bottom:18px;background:color-mix(in srgb,var(--card-background-color) 98%,#ffffff);border-radius:16px;overflow:hidden;box-shadow:0 14px 34px rgba(15,23,42,0.06),inset 0 0 0 1px rgba(15,23,42,0.04)}.area-header{display:flex;align-items:center;gap:12px;padding:14px 16px 0;background:transparent;border-bottom:0}.area-header:has(.area-icon){gap:12px}.area-header:not(:has(.area-icon)){gap:0}.area-icon{width:34px;height:34px;border-radius:999px;background:color-mix(in srgb,var(--primary-color) 12%,transparent);color:var(--primary-color);display:flex;align-items:center;justify-content:center}.area-icon ha-icon{--mdc-icon-size:19px}.area-name{font-size:18px;font-weight:850;flex:1}.entity-count{color:var(--secondary-text-color);font-size:13px;font-weight:750}.entities-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(164px,1fr));gap:12px;padding:16px}.domain-todo-list-card{grid-column:1 / -1;min-width:0}.domain-todo-list-card dwains-dashboard-next-card-host{display:block;width:100%}.domain-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 16px}.domain-action-button{min-height:40px;padding:0 14px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:var(--primary-text-color);background:var(--card-background-color);font:inherit;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 10px 22px rgba(15,23,42,0.07),inset 0 0 0 1px rgba(15,23,42,0.05);transition:transform 0.18s ease,box-shadow 0.18s ease}.domain-action-button:hover{transform:translateY(-1px);box-shadow:0 14px 26px rgba(15,23,42,0.1),inset 0 0 0 1px rgba(15,23,42,0.07)}.domain-action-button:active{transform:scale(0.97)}.domain-action-button ha-icon{--mdc-icon-size:18px;color:var(--domain-color,var(--primary-color))}.dialog-view-all{min-height:40px;padding:0 14px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent);font:inherit;font-size:13px;font-weight:850;cursor:pointer;transition:transform 0.18s ease,background 0.18s ease}.dialog-view-all:hover{background:color-mix(in srgb,var(--primary-color) 18%,transparent);transform:translateY(-1px)}.dialog-view-all:active{transform:scale(0.97)}.dialog-view-all ha-icon{--mdc-icon-size:18px}.domain-entity-card{--entity-color:var(--primary-color);position:relative;box-sizing:border-box;min-width:0;min-height:132px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;border:0;border-radius:12px;background:color-mix(in srgb,var(--card-background-color) 98%,#ffffff);color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer;box-shadow:0 12px 26px rgba(15,23,42,0.06),inset 0 0 0 1px rgba(15,23,42,0.035);transition:transform 0.18s ease,box-shadow 0.18s ease}.domain-entity-card:active{transform:scale(0.985)}.domain-entity-card.is-active{box-shadow:0 14px 30px rgba(15,23,42,0.08),inset 0 0 0 1px color-mix(in srgb,var(--entity-color) 18%,transparent)}.domain-entity-card.is-unavailable{opacity:0.62}.domain-entity-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.domain-entity-icon{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:11px;color:var(--entity-color);background:color-mix(in srgb,var(--entity-color) 13%,transparent)}.domain-entity-icon ha-icon{--mdc-icon-size:20px}.domain-entity-action{padding:0;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border:0;cursor:pointer;transition:background-color 0.18s ease,color 0.18s ease,transform 0.18s ease,opacity 0.18s ease}.domain-entity-action:active{transform:scale(0.94)}.domain-entity-action:disabled{opacity:0.36;cursor:not-allowed}.domain-entity-toggle{width:38px;height:22px;justify-content:flex-start;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 80%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.07),0 4px 10px rgba(15,23,42,0.08)}.domain-entity-toggle::before{content:"";width:18px;height:18px;margin-left:2px;border-radius:999px;background:#ffffff;box-shadow:0 2px 7px rgba(15,23,42,0.2);transition:transform 0.18s ease}.domain-entity-card.is-active .domain-entity-toggle{background:var(--entity-color)}.domain-entity-card.is-active .domain-entity-toggle::before{transform:translateX(16px)}.domain-entity-more,.domain-lock-action{width:30px;height:30px;border-radius:999px;color:color-mix(in srgb,var(--primary-text-color) 52%,transparent);background:color-mix(in srgb,var(--secondary-background-color) 70%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.05)}.domain-lock-action.is-unlocked{color:#ffffff;background:var(--entity-color);box-shadow:0 8px 16px color-mix(in srgb,var(--entity-color) 24%,transparent)}.domain-entity-more ha-icon,.domain-lock-action ha-icon{--mdc-icon-size:17px}.domain-cover-actions{min-height:32px;padding:3px;display:inline-flex;align-items:center;gap:3px;flex:0 0 auto;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 74%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.055),0 6px 14px rgba(15,23,42,0.08)}.domain-cover-action{width:26px;height:26px;border-radius:999px;color:color-mix(in srgb,var(--primary-text-color) 58%,transparent);background:transparent}.domain-cover-action.active{color:#ffffff;background:var(--entity-color);box-shadow:0 6px 12px color-mix(in srgb,var(--entity-color) 22%,transparent)}.domain-cover-action ha-icon{--mdc-icon-size:16px}.domain-entity-copy{min-width:0}.domain-entity-meta{margin-bottom:3px;color:color-mix(in srgb,var(--secondary-text-color) 78%,transparent);font-size:11px;font-weight:800;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.domain-entity-name{color:var(--primary-text-color);font-size:15px;font-weight:850;line-height:1.05;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.domain-entity-status{margin-top:5px;color:color-mix(in srgb,var(--secondary-text-color) 84%,transparent);font-size:12px;font-weight:760;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.loading{display:flex;align-items:center;justify-content:center;height:200px;font-size:16px;opacity:0.6}.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;text-align:center}.empty-state ha-icon{--mdc-icon-size:64px;opacity:0.3;margin-bottom:16px}.empty-state-text{font-size:16px;opacity:0.6}.custom-description{display:flex;align-items:flex-start;gap:12px;background:var(--warning-color);color:white;padding:16px;border-radius:8px;margin-bottom:24px}.custom-description ha-icon{--mdc-icon-size:20px;margin-top:2px;flex-shrink:0}.custom-description p{margin:0;line-height:1.5;font-size:14px}@media (max-width:600px){:host{--mdc-dialog-min-width:min(calc(100vw - 4px),480px);--mdc-dialog-max-width:min(calc(100vw - 4px),480px);--mdc-dialog-min-height:calc(100dvh - 54px);--mdc-dialog-max-height:calc(100dvh - 54px);--ha-dialog-min-height:calc(100dvh - 54px);--ha-dialog-max-height:calc(100dvh - 54px);--vertical-align-dialog:flex-end;--dialog-surface-margin-top:54px;--dialog-container-padding:0;--ha-dialog-scrim-backdrop-filter:brightness(66%) blur(2px);--mdc-dialog-scrim-color:rgba(0,0,0,0.34)}ha-dialog{margin:0 !important;border-radius:24px 24px 0 0 !important;--mdc-dialog-container-elevation:0 18px 50px rgba(15,23,42,0.28);--ha-dialog-border-radius:24px 24px 0 0;--ha-dialog-show-duration:1ms;--show-duration:1ms;--ha-dialog-hide-duration:160ms;--hide-duration:160ms}ha-dialog .mdc-dialog__surface{border-radius:24px 24px 0 0 !important;overflow:hidden}ha-dialog-header{position:relative;padding-top:22px}.sheet-handle{display:block;position:absolute;top:8px;left:50%;width:38px;height:4px;border-radius:999px;transform:translateX(-50%);background:color-mix(in srgb,var(--secondary-text-color) 24%,transparent)}.content{max-height:calc(100dvh - 148px);padding:12px 12px calc(84px + env(safe-area-inset-bottom,0px)) !important}.area-section{margin-bottom:16px;border-radius:14px}.entities-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:12px}.domain-entity-card{min-height:126px}}`,t([i({attribute:!1})],k.prototype,"hass",void 0),t([e()],k.prototype,"_params",void 0),t([e()],k.prototype,"_groupedEntities",void 0),t([e()],k.prototype,"_loading",void 0),t([e()],k.prototype,"_optimisticEntityStates",void 0),k=t([a("dwains-dashboard-next-domain-entities-dialog")],k);export{k as DwainsDomainEntitiesDialog};
