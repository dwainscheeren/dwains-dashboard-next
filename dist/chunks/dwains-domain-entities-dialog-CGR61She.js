import{_ as t,n as i,r as e,t as n}from"./state-Bpx-nWN3.js";import{i as o,A as a,b as r,a as s}from"./lit-element-CR7MDbd3.js";import{i as c,c as d,j as p,l as m,s as l,n as h,m as g,d as u}from"./entity-names-BK19pHVV.js";import{d as x,a as _,b as f}from"./index-BwfvOjdi.js";import{f as v}from"./fire-event-DQiSssdY.js";import{a as y,f as b}from"./dwains-bottom-nav-CQxxIpce.js";import"./dd-card-host-xGK1BIGL.js";import{r as w}from"./dd-entity-tiles-DK9mjar8.js";import"./blueprints-YXvSQBN2.js";import"./screensaver-media-clrApohy.js";let k=class extends o{constructor(){super(...arguments),this._groupedEntities={},this._loading=!0,this._optimisticEntityStates={},this._entityCards=new Map,this._handleViewAll=()=>{const t=this._params?.onViewAll;this.closeDialog(),t&&window.setTimeout(t,0)}}_t(t,i){return x(this.hass,t,i)}_tp(t,i){return _(this.hass,t,i)}async showDialog(t){this._params=t,this._loading=!0,await this._loadEntities()}closeDialog(){this._params=void 0,this._groupedEntities={},this._optimisticEntityStates={},this._entityCards.clear(),this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=void 0),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0),v(this,"dialog-closed",{dialog:this.localName})}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._params&&!this._loading&&(this._reconcileOptimisticEntityStates(),this._updateEntityCards())}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0)}async _loadEntities(){if(!this._params||!this.hass)return;const{domain:t,areaId:i,config:e,filterByUnitOfMeasurement:n,deviceClass:o,entityIds:a}=this._params,r={},s=a?.length?new Set(a):void 0,c=e.areas||[],d=new Map(c.map(t=>[t.area_id,t])),p=Object.values(this.hass.states),m=[];p.forEach(a=>{const r=a.entity_id;if(s&&!s.has(r))return;const c=this.hass.entities?.[r];if(c?.hidden_by)return;const p=r.split(".")[0];if(p!==t)return;if(!a||"unavailable"===a.state)return;const l=e.entities?.find(t=>t.entity_id===r),h=l&&l.device_id?e.devices?.find(t=>t.device_id===l.device_id):null,g=this.hass?.entities?.[r]?.area_id,u=this.hass?.entities?.[r]?.device_id,x=u?this.hass?.devices?.[u]?.area_id:void 0,_=u?e.devices?.find(t=>t.device_id===u)?.area_id:void 0,f=g||l?.area_id||h?.area_id||_||x||a.attributes?.area_id;if("person"!==t&&!f)return;if(i&&f!==i)return;if("person"!==t&&(!f||!d.has(f)||(e.areas_display?.hidden||[]).includes(f)))return;const v=p;if(!(f&&e.areas_options?.[f]?.groups_options?.[v]?.hidden||[]).includes(r)){if(n){if(a.attributes?.unit_of_measurement!==n)return}else if("binary_sensor"===t&&o){const t=a.attributes?.device_class;if(t!==o)return}m.push({entity_id:r,...f?{area_id:f}:{},hidden:!1})}}),m.forEach(i=>{if("person"===t){const t="people";r[t]||(r[t]={areaName:this._t("home.people"),entities:[]}),r[t].entities.push(i)}else{const t=i.area_id,e=d.get(t);if(!e)return;r[t]||(r[t]={areaName:e.name,entities:[]}),r[t].entities.push(i)}}),this._groupedEntities=r,this._loading=!1,this._updateInterval||(this._updateInterval=window.setInterval(()=>{this._checkForEntityChanges()},1e3))}_checkForEntityChanges(){if(!this._params||!this.hass||this._loading)return;const{domain:t,filterByUnitOfMeasurement:i,deviceClass:e}=this._params;let n=!1;Object.entries(this._groupedEntities).forEach(([o,a])=>{a.entities.forEach(o=>{const a=this.hass.states[o.entity_id];if(!a)return void(n=!0);this._shouldEntityBeVisible(a,t,i,e)||(n=!0)})}),n&&this._loadEntities()}_shouldEntityBeVisible(t,i,e,n){return"unavailable"!==t.state&&(e?t.attributes?.unit_of_measurement===e:"binary_sensor"!==i||!n||t.attributes?.device_class===n)}_updateEntityCards(){this._entityCards.forEach((t,i)=>{t&&"hass"in t&&(t.hass=this.hass)})}render(){if(!this._params)return a;const{domain:t,filterByUnitOfMeasurement:i,deviceClass:e,customTitle:n}=this._params;let o=n||this._getLocalizedDomainTitle(t);if("W"===i)o=this._t("dialog.power_sensors");else if(e&&!n){o={motion:this._t("dialog.motion_sensors"),door:this._t("dialog.door_sensors"),window:this._t("dialog.window_sensors"),smoke:this._t("dialog.smoke_sensors"),gas:this._t("dialog.gas_sensors"),moisture:this._t("dialog.moisture_sensors"),occupancy:this._t("dialog.occupancy_sensors"),opening:this._t("dialog.opening_sensors"),presence:this._t("dialog.presence_sensors"),safety:this._t("dialog.safety_sensors"),tamper:this._t("dialog.tamper_sensors"),vibration:this._t("dialog.vibration_sensors")}[e]||this._getLocalizedDomainTitle(t)}const s=this._params?.deviceViewKey,m="W"===i?"mdi:flash":"cover_openings"===s?"mdi:door-open":"cover_shading"===s?"mdi:blinds-horizontal":"cover_gates"===s?"mdi:gate":c(t,e)||d(t),l="W"===i?p("wattage"):s&&s.startsWith("cover_")?p("cover"):this._entityColor(t,e);return r`
      <dd-next-popup-shell
        open
        wide
        .titleText=${o}
        .icon=${m}
        .accent=${l}
        .closeLabel=${this._t("common.close")}
        @dd-close=${()=>this.closeDialog()}
      >
        ${this._params?.onViewAll?r`
          <button slot="header-extra" class="dialog-header-destination" type="button" @click=${this._handleViewAll}>
            <span>${this._params.viewAllLabel||"Open device view"}</span>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        `:a}

        <div class="content ${this._params?.areaId?"room-context":""} ${this._params?.customEntities?"custom-entities-context":""} ${this._params?.homeInformation?"home-information-context":""} ${"devices"===this._params?.homeInformationPresentation?"device-presentation-context":""} ${this._params?.domain?`domain-${this._params.domain}`:""}">
          ${this._loading?r`<div class="loading">${this._t("common.loading")}</div>`:this._renderContent()}
        </div>
      </dd-next-popup-shell>
    `}_renderContent(){if(this._params?.customEntities)return this._renderCustomEntities();const t=this._allDialogEntities();return 0===t.length?r`
        <div class="empty-state">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t("dialog.active_empty")}
          </div>
        </div>
      `:r`
      <div class="dialog-global-actions">${this._renderDomainActions(t)}</div>
      <div class="area-sections-grid">
        ${m(this._orderedGroupedEntries(),([t])=>t,([t,i])=>this._renderAreaSection(t,i))}
      </div>
    `}_orderedGroupedEntries(){const t=Object.entries(this._groupedEntities);if(!this._params?.homeInformation||"person"===this._params.domain)return t;const i=this._params.config,e=l(i?.areas||[],i?.areas_display,f(this.hass)),n=new Map(e.map((t,i)=>[t.area_id,i]));return[...t].sort(([t,i],[e,o])=>{const a=n.get(t)??Number.MAX_SAFE_INTEGER,r=n.get(e)??Number.MAX_SAFE_INTEGER;return a!==r?a-r:i.areaName.localeCompare(o.areaName)})}_renderCustomEntities(){const{customEntities:t,customDescription:i}=this._params;return t&&0!==t.length?r`
      ${i?r`
        <div class="custom-description">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <p>${i}</p>
        </div>
      `:a}

      <div class="entity-section">
        <div class="entities-grid">
          ${m(t,t=>t,t=>this._renderEntityCard({entity_id:t,hidden:!1}))}
        </div>
      </div>
    `:r`
        <div class="empty-state">
          <ha-icon icon="mdi:check-circle-outline"></ha-icon>
          <div class="empty-state-text">
            ${this._t("dialog.problem_empty")}
          </div>
        </div>
      `}_allDialogEntities(){return Object.values(this._groupedEntities).flatMap(t=>t.entities)}_renderDomainActions(t){const i=this._params?.domain||"",e=t.map(t=>t.entity_id).filter(t=>this.hass.states[t]);if(!e.length)return a;const n=this._entityColor(i),o=(t,i,o)=>r`
      <button
        class="domain-action-button"
        type="button"
        style=${`--domain-color: ${n};`}
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
      `:a}_renderAreaSection(t,i){let e="";if(this._params?.config?.areas){const i=this._params.config.areas.find(i=>i.area_id===t);i?.icon&&(e=i.icon)}const n=this._params?.domain||"",o="devices"===this._params?.homeInformationPresentation&&!0===this._params?.homeInformation,s="person"!==n,c=i.entities.filter(t=>{const i=this.hass.states[t.entity_id];return i&&this._isEntityActiveForUi(i,n)}).length,d=c===i.entities.length&&i.entities.length>0,p=i.entities.map(t=>t.entity_id),l=i.entities.length<=2;if(o&&s){const t="cover"===n?"cover":n,e=["light","switch","fan","input_boolean"].includes(t),o="cover"===t?[{action:"open_cover",label:this._t("action.open_all"),icon:"mdi:arrow-up",active:c>0},{action:"close_cover",label:this._t("action.close_all"),icon:"mdi:arrow-down",active:0===c}]:"lock"===t?[{action:"lock",label:this._t("action.lock_all"),icon:"mdi:lock-outline",active:0===c},{action:"unlock",label:this._t("action.unlock_all"),icon:"mdi:lock-open-variant-outline",active:c>0}]:[];return r`
        <dd-next-room-group
          class="shared-room-group ${l?"half-room":"full-room"}"
          .name=${i.areaName}
          icon="mdi:floor-plan"
          .accent=${this._entityColor(t)}
          .compact=${l}
        >
          ${e?r`
            <dd-next-room-actions
              slot="actions"
              mode="toggle"
              .accent=${this._entityColor(t)}
              .activeCount=${c}
              .totalCount=${i.entities.length}
              .toggleOnLabel=${this._t("action.turn_on_all")}
              .toggleOffLabel=${this._t("action.turn_off_all")}
              @dd-action=${t=>{const i=t.detail.action;this._runBulkDomainAction(p,i,"turn_off"===i?this._t("action.turn_off_all"):this._t("action.turn_on_all"),!1)}}
            ></dd-next-room-actions>
          `:o.length?r`
            <dd-next-room-actions
              slot="actions"
              mode="segmented"
              .accent=${this._entityColor(t)}
              .items=${o}
              @dd-action=${t=>{const i=t.detail.action,e=o.find(t=>t.action===i)?.label||i;this._runBulkDomainAction(p,i,e,!1)}}
            ></dd-next-room-actions>
          `:a}
          <div class="entities-grid">
            ${m(i.entities,t=>t.entity_id,t=>this._renderEntityCard(t))}
          </div>
        </dd-next-room-group>
      `}const h=["light","switch","fan","input_boolean"].includes(n);return r`
      <div class="area-section ${l?"half-room":"full-room"}">
        ${s?r`<div class="area-header">
          ${e?r`
            <div class="area-icon"><ha-icon icon="${e}"></ha-icon></div>
          `:a}
          <div class="area-name">${i.areaName}</div>
          ${h?r`
            <button class="area-master-toggle" type="button"
              style=${`--entity-color: ${this._entityColor(n)};`}
              title=${d?this._t("action.turn_off_all"):this._t("action.turn_on_all")}
              @click=${t=>{t.stopPropagation(),this._runBulkDomainAction(p,d?"turn_off":"turn_on",d?this._t("action.turn_off_all"):this._t("action.turn_on_all"),!1)}}>
              <span>${c}/${i.entities.length}</span>
              <span class="area-master-track ${d?"is-on":""}"></span>
            </button>
          `:!this._params?.homeInformation||"sensor"!==n&&"climate"!==n?r`<div class="entity-count">${i.entities.length}</div>`:a}
        </div>`:a}
        <div class="entities-grid">
          ${m(i.entities,t=>t.entity_id,t=>this._renderEntityCard(t))}
        </div>
      </div>
    `}_renderEntityCard(t){const i=this.hass.states[t.entity_id];if(!i)return a;const e=t.entity_id.split(".")[0]||"unknown";if("devices"===this._params?.homeInformationPresentation&&!["person","light","cover","climate","sensor"].includes(e)){const n=this._getEffectiveEntityState(i),o=n.attributes?.device_class,a=n.attributes?.friendly_name||this.hass.entities?.[t.entity_id]?.name||t.entity_id,r=this._entityAreaName(t),s=!0===this._params.config?.settings?.hide_area_name_in_entity_names?h(a,r):a,p=this._isEntityActiveForUi(n,e),m=this._isUnavailable(n),l=["switch","fan","input_boolean"].includes(e);return w({name:s,status:y(this.hass,n),icon:this.hass.entities?.[t.entity_id]?.icon||n.attributes?.icon||c(e,o)||d(e),accent:this._entityColor(e,o),active:p,unavailable:m,toggle:l,onOpen:()=>this._showMoreInfo(t.entity_id),onToggle:()=>{this._runBulkDomainAction([t.entity_id],p?"turn_off":"turn_on",this._t(p?"action.turn_off":"action.turn_on"),!1)},turnOnLabel:this._t("action.turn_on"),turnOffLabel:this._t("action.turn_off")})}if("devices"===this._params?.homeInformationPresentation){const n=g({hass:this.hass,config:this._params.config,entity:t,surface:"devices_cards"});if(["person","light","cover","climate","sensor","switch","binary_sensor","fan","input_boolean","lock"].includes(e)||n&&!1!==n.enabled){const n=i.attributes?.friendly_name||this.hass.entities?.[t.entity_id]?.name||t.entity_id;return r`
          <dd-next-device-entity-card
            class="entity-card-wrapper ${e}-entity-card"
            .hass=${this.hass}
            .config=${this._params.config}
            .entityId=${t.entity_id}
            .popup=${!0}
            .areaName=${this._entityAreaName(t)}
            .displayName=${n}
            @dd-more-info=${t=>this._showMoreInfo(t.detail.entityId)}
          ></dd-next-device-entity-card>
        `}}const n=this._getEffectiveEntityState(i);if("todo"===e)return r`
        <div class="domain-todo-list-card" data-entity=${t.entity_id}>
          <dwains-dashboard-next-card-host
            eager
            .hass=${this.hass}
            .config=${{type:"todo-list",entity:t.entity_id}}
          ></dwains-dashboard-next-card-host>
        </div>
      `;const o=n.attributes?.device_class,s=this.hass.entities?.[t.entity_id]?.icon||n.attributes?.icon||c(e,o)||d(e),p="person"===e?n.attributes?.entity_picture:void 0,m=n.attributes?.friendly_name||this.hass.entities?.[t.entity_id]?.name||t.entity_id,l=this._entityAreaName(t),u=h(m,l),x=this._isEntityActiveForUi(n,e),_=this._isUnavailable(n),f=this._entityColor(e,o);if("person"===e)return r`
        <dwains-dashboard-next-person-tile
          .hass=${this.hass}
          .entityId=${t.entity_id}
          .displayName=${u}
          role="button"
          tabindex="0"
          aria-label=${u}
          @click=${()=>this._showMoreInfo(t.entity_id)}
          @keydown=${i=>this._handleEntityKeydown(i,t.entity_id)}
        ></dwains-dashboard-next-person-tile>
      `;const v=this._entityActionKind(e),b="toggle"===v?"toggle":"cover"===v?"cover":"lock"===v?"lock":"none",k=this._params?.homeInformation?"card":"compact";return r`
      <dd-next-compact-entity-tile
        .variant=${k}
        .name=${u}
        .status=${this._entityStatusText(n,e)}
        .icon=${s}
        .picture=${p||""}
        .accent=${f}
        .active=${x}
        .unavailable=${_}
        @dd-open=${()=>this._showMoreInfo(t.entity_id)}
      >
        ${"none"!==b?r`
          <dd-next-entity-actions
            slot="actions"
            .mode=${b}
            .accent=${f}
            .active=${x}
            .unavailable=${_}
            .state=${String(n.state||"")}
            .canOpen=${this._coverSupportsFeature(n,1)}
            .canClose=${this._coverSupportsFeature(n,2)}
            .canStop=${this._coverSupportsFeature(n,8)}
            .turnOnLabel=${this._t("action.turn_on")}
            .turnOffLabel=${this._t("action.turn_off")}
            .openLabel=${this._t("action.open")}
            .stopLabel=${this._t("action.stop")}
            .closeLabel=${this._t("action.close")}
            .lockLabel=${this._t("action.lock")}
            .unlockLabel=${this._t("action.unlock")}
            @dd-action=${t=>{"toggle"===v?this._handleEntityToggle(t,n,e):"cover"===v?this._handleCoverAction(t,n,t.detail.action):"lock"===v&&this._handleLockAction(t,n)}}
          ></dd-next-entity-actions>
        `:a}
      </dd-next-compact-entity-tile>
    `}async _runBulkDomainAction(t,i,e,n=!0){const o=this._params?.domain||"",a=t.length;if(!(!n||window.confirm(this._t("action.confirm_bulk",{action:e,entities:this._tp("common.entity",a)}))))return;const r="turn_on"===i?"on":"turn_off"===i?"off":"open_cover"===i?"open":"close_cover"===i?"closed":"unlock"===i?"unlocked":"lock"===i?"locked":void 0;r&&this._setOptimisticEntityStates(t,r);try{if(["light","switch","fan","input_boolean"].includes(o))return void await this.hass.callService(o,i,{entity_id:t});if("cover"===o)return void await this.hass.callService("cover",i,{entity_id:t});"lock"===o&&await this.hass.callService("lock",i,{entity_id:t})}catch(e){this._clearOptimisticEntityStates(t),console.warn(`Failed to run ${i} for ${o}:`,e)}}_handleEntityKeydown(t,i){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._showMoreInfo(i))}async _handleEntityToggle(t,i,e){t.stopPropagation();const n=i?.entity_id;if(n){try{if(["light","switch","fan","input_boolean"].includes(e)){const t=!this._isEntityActiveForUi(i,e);return this._setOptimisticEntityStates([n],t?"on":"off"),void await this.hass.callService(e,t?"turn_on":"turn_off",{entity_id:n})}}catch(t){return this._clearOptimisticEntityStates([n]),void console.warn(`Failed to toggle entity ${n}:`,t)}this._showMoreInfo(n)}}async _handleCoverAction(t,i,e){t.stopPropagation();const n=i?.entity_id;if(!n)return;const o="open"===e?"open_cover":"close"===e?"close_cover":"stop_cover",a="open"===e?"open":"close"===e?"closed":void 0;a&&this._setOptimisticEntityStates([n],a);try{await this.hass.callService("cover",o,{entity_id:n})}catch(t){this._clearOptimisticEntityStates([n]),console.warn(`Failed to ${e} cover ${n}:`,t)}}async _handleLockAction(t,i){t.stopPropagation();const e=i?.entity_id;if(e)try{const t=this._isEntityActiveForUi(i,"lock");this._setOptimisticEntityStates([e],t?"locked":"unlocked"),await this.hass.callService("lock",t?"lock":"unlock",{entity_id:e})}catch(t){this._clearOptimisticEntityStates([e]),console.warn(`Failed to toggle lock ${e}:`,t)}}_showMoreInfo(t){const i=document.querySelector("home-assistant");v(i||window,"hass-more-info",{entityId:t})}_entityActionKind(t){return["light","switch","fan","input_boolean"].includes(t)?"toggle":"cover"===t?"cover":"lock"===t?"lock":"more"}_coverSupportsFeature(t,i){const e=Number(t?.attributes?.supported_features);return!Number.isFinite(e)||e<=0?1===i||2===i:0!==(e&i)}_entityStatusText(t,i){if(!t)return"";const e=this._getEffectiveEntityState(t),n=y(this.hass,e);if("light"===i&&"on"===e.state&&"number"==typeof e.attributes?.brightness)return this._t("entity.brightness",{value:Math.round(e.attributes.brightness/255*100)});if("cover"===i&&"number"==typeof e.attributes?.current_position)return`${n} · ${b(e.attributes.current_position,"%")}`;if("climate"===i){const t=e.attributes?.current_temperature,i=e.attributes?.temperature,n=this.hass?.config?.unit_system?.temperature||"°C";if(void 0!==t&&void 0!==i)return`${b(t,n)} · ${this._t("entity.climate_set",{value:b(i,n)})}`;if(void 0!==t)return b(t,n)}return"media_player"===i&&e.attributes?.media_title?`${n} · ${e.attributes.media_title}`:n}_getEffectiveEntityState(t){const i=t?.entity_id;if(!i)return t;const e=this._optimisticEntityStates[i];if(!e||e.expiresAt<=Date.now())return t;return String(t?.state||"").toLowerCase()===e.state.toLowerCase()?t:{...t,state:e.state}}_setOptimisticEntityStates(t,i){const e=[...new Set(t.filter(Boolean))];if(!e.length)return;const n=Date.now()+5e3,o={...this._optimisticEntityStates};e.forEach(t=>{o[t]={state:i,expiresAt:n}}),this._optimisticEntityStates=o,this._scheduleOptimisticCleanup()}_clearOptimisticEntityStates(t){const i=[...new Set(t.filter(Boolean))];if(!i.length)return;const e={...this._optimisticEntityStates};let n=!1;i.forEach(t=>{e[t]&&(delete e[t],n=!0)}),n&&(this._optimisticEntityStates=e)}_reconcileOptimisticEntityStates(){const t=Object.entries(this._optimisticEntityStates);if(!t.length)return;const i=Date.now(),e={...this._optimisticEntityStates};let n=!1;t.forEach(([t,o])=>{const a=this.hass?.states?.[t]?.state;(!a||o.expiresAt<=i||String(a).toLowerCase()===o.state.toLowerCase())&&(delete e[t],n=!0)}),n&&(this._optimisticEntityStates=e)}_scheduleOptimisticCleanup(){if(void 0!==this._optimisticCleanupTimer)return;const t=Object.values(this._optimisticEntityStates).map(t=>t.expiresAt);if(!t.length)return;const i=Math.min(...t);if(!Number.isFinite(i))return;const e=Math.max(80,i-Date.now()+50);this._optimisticCleanupTimer=window.setTimeout(()=>{this._optimisticCleanupTimer=void 0,this._reconcileOptimisticEntityStates(),Object.keys(this._optimisticEntityStates).length&&this._scheduleOptimisticCleanup()},e)}_isUnavailable(t){return["unavailable","unknown"].includes(String(t?.state||"").toLowerCase())}_isEntityActiveForUi(t,i){if(!t||this._isUnavailable(t))return!1;const e=String(t.state).toLowerCase();if("cover"===i)return["open","opening"].includes(e);if("lock"===i)return"unlocked"===e;if("climate"===i){const i=t.attributes?.hvac_action;return i&&"idle"!==i&&"off"!==i}return"media_player"===i?["playing","buffering"].includes(e):"vacuum"===i?["cleaning","returning"].includes(e):"alarm_control_panel"===i?e.startsWith("armed")||["arming","pending","triggered"].includes(e):"camera"!==i&&!["off","closed","locked","not_home","idle"].includes(e)}_entityColor(t,i){return p("sensor"!==t||"temperature"!==i&&"humidity"!==i?t:i,i)}_entityAreaName(t){const i=this._params?.config,e=i?.entities?.find(i=>i.entity_id===t.entity_id),n=e?.device_id?i?.devices?.find(t=>t.device_id===e.device_id):void 0,o=t.area_id||e?.area_id||n?.area_id||this.hass?.entities?.[t.entity_id]?.area_id;return i?.areas?.find(t=>t.area_id===o)?.name}_getLocalizedDomainTitle(t){return u(this.hass,t)}};k.styles=s`:host{--mdc-dialog-min-width:90vw;--mdc-dialog-max-width:1200px;--mdc-dialog-max-height:90vh;--mdc-dialog-z-index:10;--dialog-backdrop-opacity:0.4;-webkit-tap-highlight-color:transparent}.content{padding:16px 18px 22px !important;background:var(--primary-background-color)}.area-section{margin-bottom:18px;background:color-mix(in srgb,var(--card-background-color) 98%,#ffffff);border-radius:16px;overflow:hidden;box-shadow:0 14px 34px rgba(15,23,42,0.06),inset 0 0 0 1px rgba(15,23,42,0.04)}.area-header{display:flex;align-items:center;gap:12px;padding:14px 16px 0;background:transparent;border-bottom:0}.area-header:has(.area-icon){gap:12px}.area-header:not(:has(.area-icon)){gap:0}.area-icon{width:34px;height:34px;border-radius:999px;background:color-mix(in srgb,var(--primary-color) 12%,transparent);color:var(--primary-color);display:flex;align-items:center;justify-content:center}.area-icon ha-icon{--mdc-icon-size:19px}.area-name{font-size:18px;font-weight:850;flex:1}.entity-count{color:var(--secondary-text-color);font-size:13px;font-weight:750}.entities-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(164px,1fr));gap:12px;padding:16px}.domain-todo-list-card{grid-column:1 / -1;min-width:0}.domain-todo-list-card dwains-dashboard-next-card-host{display:block;width:100%}.domain-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 16px}.domain-action-button{min-height:40px;padding:0 14px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:var(--primary-text-color);background:var(--card-background-color);font:inherit;font-size:13px;font-weight:800;cursor:pointer;box-shadow:0 10px 22px rgba(15,23,42,0.07),inset 0 0 0 1px rgba(15,23,42,0.05);transition:transform 0.18s ease,box-shadow 0.18s ease}.domain-action-button:hover{transform:translateY(-1px);box-shadow:0 14px 26px rgba(15,23,42,0.1),inset 0 0 0 1px rgba(15,23,42,0.07)}.domain-action-button:active{transform:scale(0.97)}.domain-action-button ha-icon{--mdc-icon-size:18px;color:var(--domain-color,var(--primary-color))}.dialog-view-all{min-height:40px;padding:0 14px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent);font:inherit;font-size:13px;font-weight:850;cursor:pointer;transition:transform 0.18s ease,background 0.18s ease}.dialog-view-all:hover{background:color-mix(in srgb,var(--primary-color) 18%,transparent);transform:translateY(-1px)}.dialog-view-all:active{transform:scale(0.97)}.dialog-view-all ha-icon{--mdc-icon-size:18px}.domain-entity-toggle{width:38px;height:22px;justify-content:flex-start;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 80%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.07),0 4px 10px rgba(15,23,42,0.08)}.domain-entity-toggle::before{content:"";width:18px;height:18px;margin-left:2px;border-radius:999px;background:#ffffff;box-shadow:0 2px 7px rgba(15,23,42,0.2);transition:transform 0.18s ease}.domain-entity-more,.domain-lock-action{width:30px;height:30px;border-radius:999px;color:color-mix(in srgb,var(--primary-text-color) 52%,transparent);background:color-mix(in srgb,var(--secondary-background-color) 70%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.05)}.domain-lock-action.is-unlocked{color:#ffffff;background:var(--entity-color);box-shadow:0 8px 16px color-mix(in srgb,var(--entity-color) 24%,transparent)}.domain-entity-more ha-icon,.domain-lock-action ha-icon{--mdc-icon-size:17px}.domain-entity-meta{margin-bottom:3px;color:color-mix(in srgb,var(--secondary-text-color) 78%,transparent);font-size:11px;font-weight:800;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.loading{display:flex;align-items:center;justify-content:center;height:200px;font-size:16px;opacity:0.6}.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;text-align:center}.empty-state ha-icon{--mdc-icon-size:64px;opacity:0.3;margin-bottom:16px}.empty-state-text{font-size:16px;opacity:0.6}.custom-description{display:flex;align-items:flex-start;gap:12px;background:var(--warning-color);color:white;padding:16px;border-radius:8px;margin-bottom:24px}.custom-description ha-icon{--mdc-icon-size:20px;margin-top:2px;flex-shrink:0}.custom-description p{margin:0;line-height:1.5;font-size:14px}:host{--mdc-dialog-max-width:900px}.content{padding:14px 16px 18px !important;background:var(--primary-background-color)}.domain-actions{margin-bottom:12px}.dialog-view-all,.domain-action-button{min-height:36px;border-radius:999px;font-size:12px}.area-section{margin-bottom:12px;border-radius:11px;background:var(--card-background-color);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary-text-color) 7%,transparent),0 8px 22px rgba(15,23,42,0.04)}.area-header{min-height:48px;padding:10px 12px 0}.area-icon{width:30px;height:30px;border-radius:8px}.area-icon ha-icon{--mdc-icon-size:17px}.area-name{font-size:15px;font-weight:850}.entity-count{font-size:11px}.entities-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;padding:10px 12px 12px}@media (max-width:900px) and (min-width:601px){.entities-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}.dialog-header-destination{min-height:30px;padding:0 10px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:5px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,var(--card-background-color));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary-color) 14%,transparent);font:inherit;font-size:11px;font-weight:850;cursor:pointer}.dialog-header-destination:hover{background:color-mix(in srgb,var(--primary-color) 15%,var(--card-background-color))}.dialog-header-destination ha-icon{--mdc-icon-size:16px}.entities-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:10px !important}:host{--mdc-dialog-max-width:760px}.dialog-header-destination{flex:0 0 auto;min-height:30px !important;padding:0 10px !important;font-size:11px !important;white-space:nowrap !important}.content{padding:14px 16px 18px !important}.entities-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:10px !important}.domain-entity-name,.domain-entity-meta,.domain-entity-status{max-width:100% !important;overflow:visible !important;text-overflow:clip !important;white-space:normal !important;overflow-wrap:anywhere !important}.domain-entity-meta{font-size:10px !important}.entities-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important}.domain-entity-name,.domain-entity-meta,.domain-entity-status{overflow:visible !important;text-overflow:clip !important;white-space:normal !important;overflow-wrap:anywhere !important}.content.room-context{padding:14px 16px 28px !important;overflow:auto !important}.content.room-context .area-section{margin-bottom:8px !important;overflow:visible !important;border-radius:10px !important;background:var(--card-background-color) !important;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary-text-color) 7%,transparent) !important}.content.room-context .area-header{min-height:42px !important;padding:7px 10px 0 !important;gap:8px !important}.content.room-context .area-icon{width:30px !important;height:30px !important;border-radius:8px !important}.content.room-context .area-name{font-size:14px !important;font-weight:850 !important}.content.room-context .entities-grid{grid-template-columns:repeat(4,minmax(0,1fr)) !important;gap:8px !important;padding:8px 10px 12px !important;overflow:visible !important}.content.room-context.custom-entities-context .entities-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:10px !important}@media (max-width:1000px) and (min-width:601px){.content.room-context .entities-grid{grid-template-columns:repeat(3,minmax(0,1fr)) !important}}.area-master-toggle{display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;padding:4px 7px;border:1px solid var(--divider-color);border-radius:999px;background:var(--card-background-color);color:var(--secondary-text-color);font:inherit;font-size:12px;font-weight:750;cursor:pointer}.area-master-track{width:31px;height:18px;position:relative;display:inline-block;border-radius:999px;background:color-mix(in srgb,var(--primary-text-color) 20%,transparent)}.area-master-track::after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .18s}.area-master-track.is-on{background:var(--entity-color)}.area-master-track.is-on::after{transform:translateX(13px)}.dialog-global-actions .domain-actions{justify-content:center;flex-wrap:wrap;margin:0 0 14px}.area-section{border-radius:14px !important;padding:12px !important;background:var(--card-background-color) !important}.area-header{padding:0 0 10px !important;min-height:40px !important}.entities-grid{padding:0 !important;grid-template-columns:repeat(3,minmax(0,1fr)) !important;gap:10px !important}@media (min-width:601px) and (max-width:1000px){.entities-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important}}.area-group-actions{padding:8px 12px 0}.area-group-actions .domain-actions{margin:0;flex-wrap:wrap}.entities-grid,.content.room-context .entities-grid{grid-template-columns:repeat(3,minmax(0,1fr)) !important}@media (max-width:1000px) and (min-width:601px){.entities-grid,.content.room-context .entities-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important}}.content.home-information-context .entities-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:10px !important;padding:8px 10px 10px !important}.content.home-information-context .area-section{padding:0 !important;margin-bottom:10px !important;border-radius:12px !important}.content.home-information-context .area-sections-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-items:start}.content.home-information-context .area-sections-grid .area-section{grid-column:1 / -1;margin-bottom:0 !important;min-width:0}.content.home-information-context .area-sections-grid .area-section.half-room{grid-column:span 1}.content.home-information-context .area-sections-grid .area-section.half-room .entities-grid{grid-template-columns:1fr !important}.content.home-information-context .area-header{min-height:38px !important;padding:7px 10px 0 !important;gap:8px !important}.content.home-information-context .area-icon{width:28px !important;height:28px !important;border-radius:8px !important}.content.home-information-context .area-icon ha-icon{--mdc-icon-size:16px}.content.home-information-context .area-name{font-size:14px !important}.content.home-information-context .area-master-toggle{min-height:28px;padding:3px 6px;font-size:11px}.content.home-information-context.device-presentation-context .entities-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;align-items:start !important;gap:10px !important}.content.home-information-context.device-presentation-context.domain-cover .entities-grid{grid-template-columns:repeat(auto-fill,minmax(360px,1fr)) !important;gap:12px !important}.content.home-information-context.device-presentation-context.domain-climate .entities-grid{grid-template-columns:repeat(auto-fill,minmax(250px,1fr)) !important;gap:8px !important}@media (min-width:769px){.content.home-information-context.device-presentation-context .shared-room-group.half-room .entities-grid{grid-template-columns:minmax(0,1fr) !important}.content.home-information-context.device-presentation-context .shared-room-group.full-room .entities-grid{grid-template-columns:repeat(3,minmax(0,1fr)) !important}}.content.home-information-context.device-presentation-context.domain-person .area-sections-grid{display:block !important}.content.home-information-context.device-presentation-context.domain-person .area-section{margin:0 !important;padding:0 !important;background:transparent !important;border-radius:0 !important;box-shadow:none !important;overflow:visible !important}.content.home-information-context.device-presentation-context.domain-person .entities-grid,.content.home-information-context.device-presentation-context.domain-person .area-sections-grid .area-section.half-room .entities-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;align-items:start !important;gap:8px !important;padding:0 !important}.content.home-information-context.device-presentation-context.domain-person dwains-dashboard-next-person-tile{--dd-person-tile-location-height:248px;--dd-person-map-height:186px}.content.home-information-context.device-presentation-context .area-sections-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:start}.content.home-information-context.device-presentation-context .shared-room-group{min-width:0;grid-column:1 / -1}.content.home-information-context.device-presentation-context .shared-room-group.half-room{grid-column:span 1}.content.home-information-context.device-presentation-context .shared-room-group .entities-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:0 !important}.content.home-information-context.device-presentation-context.domain-cover .shared-room-group .entities-grid,.content.home-information-context.device-presentation-context.domain-sensor .shared-room-group .entities-grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}.content.home-information-context.device-presentation-context.domain-person .area-sections-grid{display:block}.content.home-information-context.device-presentation-context.domain-person .area-section{margin:0 !important;padding:0 !important;background:transparent !important;box-shadow:none !important}.content.home-information-context.device-presentation-context.domain-person .entities-grid{grid-template-columns:repeat(auto-fit,minmax(320px,1fr)) !important;gap:10px !important;padding:0 !important}@media (max-width:600px){.content{padding:12px !important}.dialog-header-destination{min-height:28px !important;padding:0 8px !important;max-width:100%;font-size:10px !important;white-space:nowrap}.entities-grid,.content.room-context .entities-grid,.content.room-context.custom-entities-context .entities-grid{grid-template-columns:minmax(0,1fr) !important;gap:10px}.dialog-global-actions .domain-actions{justify-content:center}.content.home-information-context:not(.device-presentation-context) .entities-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:8px !important}.content.home-information-context.device-presentation-context .area-sections-grid{grid-template-columns:1fr;gap:10px}.content.home-information-context.device-presentation-context .shared-room-group,.content.home-information-context.device-presentation-context .shared-room-group.half-room{grid-column:1}.content.home-information-context.device-presentation-context .shared-room-group .entities-grid,.content.home-information-context.device-presentation-context.domain-cover .shared-room-group .entities-grid,.content.home-information-context.device-presentation-context.domain-sensor .shared-room-group .entities-grid{grid-template-columns:1fr !important;padding:0 !important}.content.home-information-context.device-presentation-context.domain-climate .shared-room-group .entities-grid{grid-template-columns:minmax(0,1fr) !important;gap:8px !important}.content.home-information-context.device-presentation-context.domain-person .entities-grid{grid-template-columns:1fr !important;padding:0 !important}.content.home-information-context.device-presentation-context.domain-person .area-section,.content.home-information-context.device-presentation-context.domain-person .area-section.half-room,.content.home-information-context.device-presentation-context.domain-person dwains-dashboard-next-person-tile{width:100% !important;max-width:none !important;min-width:0}.content.home-information-context.device-presentation-context.domain-person dwains-dashboard-next-person-tile{--dd-person-tile-location-height:160px;--dd-person-map-height:98px}}`,t([i({attribute:!1})],k.prototype,"hass",void 0),t([e()],k.prototype,"_params",void 0),t([e()],k.prototype,"_groupedEntities",void 0),t([e()],k.prototype,"_loading",void 0),t([e()],k.prototype,"_optimisticEntityStates",void 0),k=t([n("dwains-dashboard-next-domain-entities-dialog")],k);export{k as DwainsDomainEntitiesDialog};
