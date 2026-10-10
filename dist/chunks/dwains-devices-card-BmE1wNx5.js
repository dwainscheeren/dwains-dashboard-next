import{_ as e,r as i,t}from"./state-Bpx-nWN3.js";import{i as n,b as a,A as r,r as o,a as s}from"./lit-element-CR7MDbd3.js";import{e as c,r as d}from"./dd-entity-tiles-BmsxiQzT.js";import{f as l,s as h,g as p,A as m,a as g,h as v,b as u,c as _,d as y,e as x,i as b,j as f,k as w,r as $,l as k,m as D,n as E,o as S,N as C,p as z,q as M}from"./entity-names-CbTdxyxP.js";import{d as A,a as N,b as I}from"./index-CFKASqbd.js";import{e as j,f as L,i as O,a as T}from"./dwains-bottom-nav-DCQEO47d.js";import{f as B}from"./fire-event-DQiSssdY.js";import"./dd-card-host-C87xsXhx.js";import"./blueprints-YXvSQBN2.js";import"./screensaver-media-clrApohy.js";const P="__new_devices__",G="__maintenance__",F="energy",R="__overview__",W="person",H="__people__";let U=class extends n{constructor(){super(...arguments),this._selectedDomain=null,this._isMobile=!1,this._mobileNavOpen=!1,this._pendingDomainSelection=null,this._resizeHandler=()=>this._checkMobile(),this._locationHandler=()=>this._handleLocationChanged(),this._t=(e,i)=>A(this._hass,e,i),this._tp=(e,i,t)=>N(this._hass,e,i,t),this._handleSelectDeviceDomain=e=>{const i=e.detail?.domain;i&&(this._pendingDomainSelection=i,this._applyPendingDomainSelection(),this.requestUpdate())},this._handleDevicesNavToggle=e=>{if(!this._isMobile)return;if(e?.detail?.open)return window.dispatchEvent(new CustomEvent("dwains-dashboard-next-mobile-nav-sheet",{detail:{kind:"devices"}})),void(this._mobileNavOpen=!0);const i=!this._mobileNavOpen;i&&window.dispatchEvent(new CustomEvent("dwains-dashboard-next-mobile-nav-sheet",{detail:{kind:"devices"}})),this._mobileNavOpen=i},this._handleMobileNavSheet=e=>{"devices"!==e.detail?.kind&&(this._mobileNavOpen=!1)},this._closeMobileNav=()=>{this._mobileNavOpen=!1}}set hass(e){this._hass=e,this._syncThemeAttribute(),j(e,this.config?.settings),this._syncBottomNavDeviceContext();const i=this.renderRoot?.querySelectorAll("dwains-dashboard-next-card-host");i&&i.forEach(i=>i.hass=e)}get hass(){return this._hass}setConfig(e){if(!e)throw new Error(A(this._hass,"devices.invalid_configuration"));this.config={areas:e.areas,devices:e.devices,entities:e.entities,floors:e.floors,areas_display:e.areas_display,areas_options:e.areas_options,settings:e.settings,blueprint_replacements:e.blueprint_replacements,device_admission:e.device_admission},this._hass&&j(this._hass,this.config.settings);const i=this._getUrlDomain();if(i&&(this._pendingDomainSelection=i),!this._selectedDomain){const e=this._buildData(),t=this._buildMaintenanceData(),n=this._maintenanceSummary(t).totalCount>0,a=this._showEnergyMenu();i===P?this._selectedDomain=P:i===G&&n?this._selectedDomain=G:i===F&&a?this._selectedDomain=F:i&&e.has(i)?this._selectedDomain=i:this._selectedDomain=R,this._syncBottomNavDeviceContext()}}getCardSize(){return 12}connectedCallback(){super.connectedCallback(),this._syncThemeAttribute(),this._checkMobile(),window.addEventListener("resize",this._resizeHandler),window.addEventListener("dwains-dashboard-next-toggle-devices-nav",this._handleDevicesNavToggle),window.addEventListener("dwains-dashboard-next-mobile-nav-sheet",this._handleMobileNavSheet),window.addEventListener("dwains-dashboard-next-select-device-domain",this._handleSelectDeviceDomain),window.addEventListener("location-changed",this._locationHandler),window.addEventListener("popstate",this._locationHandler),this._handleLocationChanged(),this._syncBottomNavDeviceContext()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this._resizeHandler),window.removeEventListener("dwains-dashboard-next-toggle-devices-nav",this._handleDevicesNavToggle),window.removeEventListener("dwains-dashboard-next-mobile-nav-sheet",this._handleMobileNavSheet),window.removeEventListener("dwains-dashboard-next-select-device-domain",this._handleSelectDeviceDomain),window.removeEventListener("location-changed",this._locationHandler),window.removeEventListener("popstate",this._locationHandler)}_checkMobile(){const e=this._isMobile;this._isMobile=window.innerWidth<=768,e!==this._isMobile&&(this._mobileNavOpen=!1)}_getUrlDomain(){try{return new URL(window.location.href).searchParams.get("dd_device")}catch{return null}}_updateUrlDomain(e){try{const i=new URL(window.location.href);e?i.searchParams.set("dd_device",e):i.searchParams.delete("dd_device"),window.history.replaceState(window.history.state,"",i.toString())}catch{}}_handleLocationChanged(){const e=this._getUrlDomain();e&&(this._pendingDomainSelection=e,this._applyPendingDomainSelection(),this.requestUpdate())}_getAreaEntities(e){const i=[],t=new Set;if(this.config?.entities){const n=new Set;this.config.devices&&this.config.devices.forEach(i=>{i.area_id===e&&n.add(i.device_id)}),this.config.entities.forEach(a=>{if(a.area_id===e||a.device_id&&n.has(a.device_id)){const e=this._hass.entities?.[a.entity_id];if(e?.hidden_by||"diagnostic"===e?.entity_category||"config"===e?.entity_category)return;i.push(a),t.add(a.entity_id)}})}return Object.values(this._hass.states).forEach(n=>{if(!t.has(n.entity_id)&&n.attributes?.area_id===e){const t=this._hass.entities?.[n.entity_id];if(t?.hidden_by||"diagnostic"===t?.entity_category||"config"===t?.entity_category)return;i.push({entity_id:n.entity_id,area_id:e,hidden:!1})}}),i}_getFilteredAreaEntities(e){let i=this._getAreaEntities(e);if(i=i.filter(e=>{const i=this._hass.entities?.[e.entity_id];return!(i?.hidden_by||"diagnostic"===i?.entity_category||"config"===i?.entity_category)}),this.config?.areas_options){const t=this.config.areas_options[e];if(t?.groups_options){const e=new Set;for(const i of Object.values(t.groups_options))i.hidden&&i.hidden.forEach(i=>e.add(i));i=i.filter(i=>!e.has(i.entity_id))}}!1!==this.config?.settings?.hide_unavailable_entities_on_devices&&(i=i.filter(e=>{const i=this._hass.states[e.entity_id];return i&&"unavailable"!==i.state&&"unknown"!==i.state})),i=l(this._hass,this.config,i);const t=new Set(this.config?.device_admission?.hidden_entities||[]);return t.size&&(i=i.filter(e=>!t.has(e.entity_id))),i}_getVisibleSortedAreas(){return this.config?.areas?h(this.config.areas,this.config.areas_display,I(this._hass)):[]}_buildData(){const e=new Map;if(!this._hass)return e;const i=this._getVisibleSortedAreas();for(const t of i){const i=this._getFilteredAreaEntities(t.area_id);for(const n of i){const i=this._typeKeyFor(n.entity_id);if(!i)continue;let a=e.get(i);a||(a=new Map,e.set(i,a));let r=a.get(t.area_id);r||(r={area:t,entities:[]},a.set(t.area_id,r)),r.entities.push(n)}}return this._addPersonData(e),e.forEach(e=>{e.forEach(e=>{e.entities=this._sortDeviceAreaEntities(e.area.area_id,e.entities)})}),this._hiddenDeviceTypes().forEach(i=>e.delete(i)),e}_deviceEntityGroupKey(e){return p(e,this._hass)||this._typeKeyFor(e)||e.split(".")[0]||"other"}_deviceGroupOrderIndex(e,i){const t=this.config?.areas_options?.[e]?.group_order||[],n=t.indexOf(i);if(n>=0)return n;if("cover_gates"===i&&t.includes("cover_shading"))return t.indexOf("cover_shading");if(["cover_openings","cover_shading","cover_gates"].includes(i)&&t.includes("cover"))return t.indexOf("cover");if(m.includes(i)){const e=t.indexOf(g(i));if(e>=0)return e}const a=m.indexOf(i);return a>=0?t.length+a:Number.MAX_SAFE_INTEGER}_deviceConfiguredEntityOrder(e,i){const t=this.config?.areas_options?.[e];if(!t)return[];if("ungrouped"===t.entity_layout)return t.entity_order||[];const n=t.groups_options||{},a=n[i]?.order;if(a?.length)return a;if("cover_gates"===i){const e=n.cover_shading?.order;if(e?.length)return e}if(["cover_openings","cover_shading","cover_gates"].includes(i)){const e=n.cover?.order;if(e?.length)return e}if(m.includes(i)){const e=n[g(i)]?.order;if(e?.length)return e}return[]}_sortDeviceAreaEntities(e,i){const t=new Intl.Collator(I(this._hass),{sensitivity:"base",numeric:!0});return[...i].sort((i,n)=>{const a=this._deviceEntityGroupKey(i.entity_id),r=this._deviceEntityGroupKey(n.entity_id);if(a!==r){const i=this._deviceGroupOrderIndex(e,a),t=this._deviceGroupOrderIndex(e,r);if(i!==t)return i-t}const o=this._deviceConfiguredEntityOrder(e,a);if(a===r&&o.length){const e=o.indexOf(i.entity_id),t=o.indexOf(n.entity_id);if(-1!==e&&-1!==t)return e-t;if(-1!==e)return-1;if(-1!==t)return 1}const s=this._hass.states[i.entity_id]?.attributes?.friendly_name||this._hass.entities?.[i.entity_id]?.name||i.entity_id,c=this._hass.states[n.entity_id]?.attributes?.friendly_name||this._hass.entities?.[n.entity_id]?.name||n.entity_id,d=i.device_id||this._hass.entities?.[i.entity_id]?.device_id||"",l=n.device_id||this._hass.entities?.[n.entity_id]?.device_id||"";if(d!==l){const e=(e,i)=>e?this.config?.devices?.find(i=>i.device_id===e)?.name||e:i,i=t.compare(e(d,String(s)),e(l,String(c)));if(0!==i)return i}return t.compare(String(s),String(c))})}_buildMaintenanceData(){const e=new Map;if(!this._hass||!this.config)return e;const i=v(this.config);return Object.values(this._hass.states).forEach(t=>{const n=t?.entity_id;if(!n)return;const a=this._hass.entities?.[n];if(a?.hidden_by)return;const r=this._deviceIdForEntity(n,a);if(r&&i.has(r))return;const o=this._maintenanceKind(n,t);if(!o)return;const s=this._maintenanceAreaForEntity(n,t,a);if(!s)return;let c=e.get(s.area_id);c||(c={area:s,items:[]},e.set(s.area_id,c)),c.items.push({entityId:n,deviceId:r,areaId:s.area_id,name:t.attributes?.friendly_name||a?.name||n,stateLabel:this._formatMaintenanceState(t,o),icon:this._maintenanceIcon(n,t,o),kind:o})}),e.forEach(e=>{const i=this._sortDeviceAreaEntities(e.area.area_id,e.items.map(i=>({entity_id:i.entityId,area_id:e.area.area_id,hidden:!1}))).map(e=>e.entity_id),t=new Map(i.map((e,i)=>[e,i]));e.items.sort((e,i)=>(t.get(e.entityId)??Number.MAX_SAFE_INTEGER)-(t.get(i.entityId)??Number.MAX_SAFE_INTEGER))}),e}_maintenanceSummary(e){let i=0;const t=new Set;let n=0;e.forEach(e=>{e.items.forEach(e=>{"battery"!==e.kind?e.deviceId?t.add(e.deviceId):n+=1:i+=1})});const a=t.size+n;return{lowBatteryCount:i,unavailableDeviceCount:a,totalCount:i+a}}_maintenanceSubtitle(e){const i=this._maintenanceSummary(e),t=[];return i.lowBatteryCount&&t.push(this._tp("devices.low_battery",i.lowBatteryCount)),i.unavailableDeviceCount&&t.push(this._tp("devices.unavailable_device",i.unavailableDeviceCount)),t.length?t.join(", "):this._t("devices.all_good")}_showEnergyMenu(){return!0}_energySummary(){return u(this._hass,this.config)}_maintenanceKind(e,i){return"unavailable"===i.state?"unavailable":this._isLowBatteryEntity(e,i)?"battery":void 0}_isLowBatteryEntity(e,i){const t=e.split(".")[0],n=i.attributes?.device_class;if("battery"!==n)return!1;if("binary_sensor"===t)return"on"===i.state;const a=Number(i.state);return Number.isFinite(a)&&a<=20}_deviceIdForEntity(e,i){return i?.device_id||this.config?.entities?.find(i=>i.entity_id===e)?.device_id}_maintenanceAreaForEntity(e,i,t){const n=this.config?.entities?.find(i=>i.entity_id===e),a=this._deviceIdForEntity(e,t),r=a?this.config?.devices?.find(e=>e.device_id===a):void 0,o=a?this._hass?.devices?.[a]:void 0,s=t?.area_id||n?.area_id||i.attributes?.area_id||r?.area_id||o?.area_id;if(!s||(this.config?.areas_display?.hidden||[]).includes(s))return;const c=s?this.config?.areas?.find(e=>e.area_id===s):void 0;return c||void 0}_maintenanceIcon(e,i,t){if("battery"===t)return"mdi:battery-alert";const n=e.split(".")[0]||"";return i.attributes?.icon||_(n)||"mdi:help-box"}_formatMaintenanceState(e,i){if("unavailable"===i)return"unknown"===e.state?this._t("common.unknown"):this._t("common.unavailable");const t=e.attributes?.unit_of_measurement||"%";return L(e.state,t)}_addPersonData(e){const i=this._getVisiblePersonEntities();if(!i.length)return;let t=e.get(W);t||(t=new Map,e.set(W,t));const n=new Set;t.forEach(e=>e.entities.forEach(e=>n.add(e.entity_id)));const a=t.get(H)??{area:{area_id:H,name:y(this._hass,W),icon:"mdi:account-group"},entities:[]};a.entities=[...a.entities,...i.filter(e=>!n.has(e.entity_id))],a.entities.length&&t.set(H,a)}_getVisiblePersonEntities(){if(!this._hass||!this.config)return[];const e=new Set(this.config.settings?.hidden_persons||[]);return Object.values(this._hass.states).filter(i=>!!i.entity_id?.startsWith(`${W}.`)&&(!e.has(i.entity_id)&&!this._hass.entities?.[i.entity_id]?.hidden_by)).sort((e,i)=>{const t=e.attributes?.friendly_name||e.entity_id,n=i.attributes?.friendly_name||i.entity_id;return String(t).localeCompare(String(n))}).map(e=>({entity_id:e.entity_id,area_id:H,hidden:!1}))}_typeKeyFor(e){const i=e.split(".")[0];if(i){if("cover"===i)return p(e,this._hass)||"cover_shading";if("binary_sensor"===i){const i=this._hass?.states?.[e]?.attributes?.device_class;return i?`binary_sensor.${i}`:"binary_sensor"}return i}}_hiddenDeviceTypes(){return new Set((this.config?.settings?.hidden_device_types||[]).filter(e=>"string"==typeof e&&e.length>0))}_typeName(e){return e===G?this._t("devices.maintenance"):e===F?this._t("devices.energy"):e===R?this._t("navigation.overview"):"cover_openings"===e?String(this._hass?.language||"").toLowerCase().startsWith("de")?"Fenster & Türen":"Windows & doors":"cover_shading"===e?String(this._hass?.language||"").toLowerCase().startsWith("de")?"Beschattung":"Shading":"cover_gates"===e?String(this._hass?.language||"").toLowerCase().startsWith("de")?"Tore":"Gates":e.startsWith("binary_sensor.")?x(this._hass,e.slice(14)):y(this._hass,e)}_typeIcon(e){return e===G?"mdi:wrench":e===F?"mdi:flash":e===R?"mdi:view-grid-outline":e===W?"mdi:account-group":"cover_openings"===e?"mdi:door-open":"cover_shading"===e?"mdi:blinds-horizontal":"cover_gates"===e?"mdi:gate":e.startsWith("binary_sensor.")?b("binary_sensor",e.slice(14)):_(e)}_typeColor(e){return e===G?"var(--warning-color, #ff9800)":e===F?f("energy"):e===R?"var(--primary-color)":"cover_openings"===e||"cover_shading"===e||"cover_gates"===e?f("cover"):e.startsWith("binary_sensor.")?f("binary_sensor",e.slice(14)):f(e)}_syncBottomNavDeviceContext(){const e=this._selectedDomain;window.dispatchEvent(new CustomEvent("dwains-dashboard-next-device-context-changed",{detail:{domain:e,icon:e===P?"mdi:new-box":e===G?"mdi:wrench":e===F?"mdi:flash":e!==R&&e&&e?this._typeIcon(e):"mdi:format-list-bulleted-type",label:e===P?this._t("devices.new"):e===G?this._t("devices.maintenance"):e===F?this._t("devices.energy"):e!==R&&e&&e?this._typeName(e):this._t("devices.title")}}))}updated(e){e.has("_hass")&&this._syncThemeAttribute(),e.has("_selectedDomain")&&this._syncBottomNavDeviceContext()}_syncThemeAttribute(){this.toggleAttribute("data-theme-dark",O(this._hass,this))}_sortedDomains(e){return[...e.keys()].sort((e,i)=>this._typeName(e).localeCompare(this._typeName(i)))}_domainCount(e){let i=0;return e.forEach(e=>i+=e.entities.length),i}_applyPendingDomainSelection(e,i,t,n){if(!this._hass||!this.config)return!1;const a=this._pendingDomainSelection||this._getUrlDomain();if(!a)return!1;const r=e??this._buildData(),o=i??(w(this.config)&&this._newDevices().length>0),s=t??this._maintenanceSummary(this._buildMaintenanceData()).totalCount>0,c=n??this._showEnergyMenu();if(a===R);else if(a===P){if(!o)return!1}else if(a===G){if(!s)return!1}else if(a===F){if(!c)return!1}else if(!r.has(a))return!1;return this._pendingDomainSelection=null,this._selectedDomain!==a&&(this._selectedDomain=a,this._syncBottomNavDeviceContext()),!0}_entityCardConfig(e){return e.startsWith("todo.")?{type:"todo-list",entity:e}:$({hass:this._hass,config:this.config,entity:e,surface:"devices_cards"})}_selectDomain(e){this._pendingDomainSelection=null,this._selectedDomain=e,this._updateUrlDomain(e===R?null:e),this._syncBottomNavDeviceContext(),this._closeMobileNav()}render(){if(!this._hass||!this.config)return a`<div class="loading">${this._t("common.loading")}</div>`;const e=this._buildData(),i=this._sortedDomains(e);this._ensureDeviceTracking();const t=this._newDevices(),n=v(this.config).size,r=w(this.config)&&(t.length>0||n>0),o=this._buildMaintenanceData(),s=this._maintenanceSummary(o).totalCount>0,c=this._showEnergyMenu();return this._applyPendingDomainSelection(e,r,s,c),0!==i.length||r||s||c?(this._selectedDomain===R||(this._selectedDomain===P?r||(this._selectedDomain=R):this._selectedDomain===G?s||(this._selectedDomain=R):this._selectedDomain===F?c||(this._selectedDomain=R):this._selectedDomain&&e.has(this._selectedDomain)||(this._selectedDomain=R)),a`
      <div class="layout-container">
        ${this._renderSidebar(e,i,t,r,o,s,c)}
        <div class="main-content">
          <div class="content-area">
            ${this._selectedDomain===P?this._renderNewDevicesView(t):this._selectedDomain===G?this._renderMaintenanceView(o):this._selectedDomain===F?this._renderEnergyView():this._selectedDomain===R?this._renderDevicesOverview(e,i,t,r,o,s,c):this._renderDeviceView(e)}
          </div>
        </div>
      </div>
    `):a`
        <div class="layout-container">
            <div class="main-content">
            <div class="content-area">
              <div class="device-view">
                <div class="empty">${this._t("devices.empty")}</div>
              </div>
            </div>
          </div>
        </div>
      `}_renderSidebar(e,i,t,n,o,s,d){const l={sidebar:!0,open:this._isMobile&&this._mobileNavOpen},h=this._energySummary(),p=a`
      <nav class=${c(l)}>
        ${this._isMobile?r:a`<div class="sidebar-title">${this._t("devices.title")}</div>`}
        <div class="area-list">
          <button
            class="area-button overview ${this._selectedDomain===R?"selected":""}"
            style=${`--domain-color: ${this._typeColor(R)};`}
            @click=${()=>this._selectDomain(R)}
          >
            <div class="area-icon">
              <ha-icon icon="mdi:view-grid-outline"></ha-icon>
            </div>
            <div class="area-info">
              <div class="area-name">${this._t("navigation.overview")}</div>
              <div class="device-menu-subtitle">${this._t("navigation.all_device_groups")}</div>
            </div>
            <span class="domain-count">${i.length}</span>
            <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
          </button>
          ${n?a`
                <button
                  class="area-button new-devices ${this._selectedDomain===P?"selected":""}"
                  @click=${()=>this._selectDomain(P)}
                >
                  <div class="area-icon">
                    <ha-icon icon="mdi:new-box"></ha-icon>
                  </div>
                  <div class="area-info">
                    <div class="area-name">${this._t("devices.new")}</div>
                    <div class="device-menu-subtitle">
                      ${this._tp("devices.new",t.length)}
                    </div>
                  </div>
                  <span class="domain-count">${t.length}</span>
                  <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `:r}
          ${s?a`
                <button
                  class="area-button maintenance ${this._selectedDomain===G?"selected":""}"
                  style=${`--domain-color: ${this._typeColor(G)};`}
                  @click=${()=>this._selectDomain(G)}
                >
                  <div class="area-icon">
                    <ha-icon icon="mdi:wrench"></ha-icon>
                  </div>
                  <div class="area-info">
                    <div class="area-name">${this._t("devices.maintenance")}</div>
                    <div class="device-menu-subtitle">${this._maintenanceSubtitle(o)}</div>
                  </div>
                  <span class="domain-count">${this._maintenanceSummary(o).totalCount}</span>
                  <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `:r}
          ${d?a`
                <button
                  class="area-button energy ${this._selectedDomain===F?"selected":""}"
                  style=${`--domain-color: ${this._typeColor(F)};`}
                  @click=${()=>this._selectDomain(F)}
                >
                  <div class="area-icon">
                    <ha-icon icon="mdi:flash"></ha-icon>
                  </div>
                  <div class="area-info">
                    <div class="area-name">${this._t("devices.energy")}</div>
                    <div class="device-menu-subtitle">
                      ${this._tp("devices.live_power_sensor",h.sensorCount)}
                    </div>
                  </div>
                  <span class="domain-count">${h.sensorCount}</span>
                  <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
                </button>
              `:r}
          ${e.has(W)?(()=>{const i=e.get(W),t=this._domainCount(i),n=this._selectedDomain===W;return a`
              <button
                class="area-button ${n?"selected":""}"
                style=${`--domain-color: ${this._typeColor(W)};`}
                @click=${()=>this._selectDomain(W)}
              >
                <div class="area-icon">
                  <ha-icon icon=${this._typeIcon(W)}></ha-icon>
                </div>
                <div class="area-info">
                  <div class="area-name">${this._typeName(W)}</div>
                  <div class="device-menu-subtitle">${this._tp("common.entity",t)}</div>
                </div>
                <span class="domain-count">${t}</span>
                <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
              </button>
            `})():r}
          ${i.filter(e=>e!==W).map(i=>{const t=e.get(i),n=this._domainCount(t),r=this._selectedDomain===i;return a`
              <button
                class="area-button ${r?"selected":""}"
                style=${`--domain-color: ${this._typeColor(i)};`}
                @click=${()=>this._selectDomain(i)}
              >
                <div class="area-icon">
                  <ha-icon icon=${this._typeIcon(i)}></ha-icon>
                </div>
                <div class="area-info">
                  <div class="area-name">${this._typeName(i)}</div>
                  <div class="device-menu-subtitle">${this._tp("common.entity",n)}</div>
                </div>
                <span class="domain-count">${n}</span>
                <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
              </button>
            `})}
        </div>
      </nav>
    `;return this._isMobile?a`
      <dd-next-popup-shell
        .open=${this._mobileNavOpen}
        .navigationMenu=${!0}
        .titleText=${this._t("devices.title")}
        icon="mdi:format-list-bulleted-type"
        .closeLabel=${this._t("common.close")}
        @dd-close=${this._closeMobileNav}
      >${p}</dd-next-popup-shell>
    `:p}_renderDevicesOverview(e,i,t,n,r,o,s){const c=this._energySummary(),d=[];if(n&&d.push({key:P,icon:"mdi:new-box",title:this._t("devices.new"),subtitle:this._tp("devices.new",t.length),count:t.length,color:"var(--primary-color)"}),o){const e=this._maintenanceSummary(r);d.push({key:G,icon:"mdi:wrench",title:this._t("devices.maintenance"),subtitle:this._maintenanceSubtitle(r),count:e.totalCount,color:this._typeColor(G)})}return s&&d.push({key:F,icon:"mdi:flash",title:this._t("devices.energy"),subtitle:this._tp("devices.live_power_sensor",c.sensorCount),count:c.sensorCount,color:this._typeColor(F)}),i.forEach(i=>{const t=e.get(i);if(!t)return;const n=this._domainCount(t);d.push({key:i,icon:this._typeIcon(i),title:this._typeName(i),subtitle:this._tp("common.entity",n),count:n,color:this._typeColor(i)})}),a`
      <div class="device-view devices-overview-view">
        ${this._renderDevicePageHeader({icon:"mdi:format-list-bulleted-type",title:this._t("devices.title"),subtitle:this._tp("devices.group",d.length),color:this._typeColor(R)})}

        <div class="devices-overview-grid">
          ${k(d,e=>e.key,e=>a`
              <button
                class="devices-overview-card"
                type="button"
                style=${`--domain-color: ${e.color};`}
                @click=${()=>this._selectDomain(e.key)}
              >
                <span class="overview-card-icon">
                  <ha-icon icon=${e.icon}></ha-icon>
                  <span class="overview-card-count">${e.count}</span>
                </span>
                <span class="overview-card-copy">
                  <strong>${e.title}</strong>
                  <small>${e.subtitle}</small>
                </span>
                <ha-icon class="overview-card-chevron" icon="mdi:chevron-right"></ha-icon>
              </button>
            `)}
        </div>
      </div>
    `}_renderDevicePageHeader(e){return a`
      <dd-next-page-header
        class=${e.className||""}
        .icon=${e.icon}
        .titleText=${e.title}
        .subtitle=${e.subtitle||""}
        .accent=${e.color}
        .back=${Boolean(e.back)}
        .backLabel=${this._t("navigation.overview")}
        @dd-back=${()=>this._selectDomain(R)}
      >
        ${e.actions?a`<span slot="actions">${e.actions}</span>`:r}
      </dd-next-page-header>
    `}_renderDeviceView(e){const i=this._selectedDomain;if(!i)return r;const t=e.get(i);if(!t)return r;const n=!this._isSpecialDeviceType(i),o=i===W?[...t.values()].map(e=>e.area):this._getVisibleSortedAreas().filter(e=>t.has(e.area_id)),s=[...t.values()].flatMap(e=>e.entities),c=i===W?[...new Map(s.map(e=>[e.entity_id,e])).values()]:[],d=o[0]||{area_id:H,name:"",icon:"mdi:account-group"};return a`
      <div class="device-view ${n?"room-style-device-view":"special-device-view"}">
        ${this._renderDevicePageHeader({icon:this._typeIcon(i),title:this._typeName(i),subtitle:this._tp("common.entity",this._domainCount(t)),color:this._typeColor(i),back:!0})}

        ${this._renderDeviceGlobalActions(i,s)}

        ${i===W?a`
              <div class="person-device-grid ${this._entitiesGridClass(i,!0)}">
                ${k(c,e=>e.entity_id,e=>this._renderRoomStyleEntityCard(e,d))}
              </div>
            `:a`
              <div class="device-room-groups">
                ${o.map(e=>{const r=t.get(e.area_id),o=r.entities.length<=2;return a`
                    <dd-next-room-group
                      class="device-room-group ${o?"half-room":"full-room"}"
                      .name=${e.name}
                      .icon=${D(e)}
                      .accent=${this._roomAccent(e)}
                      .compact=${o}
                    >
                      <span slot="actions">${this._renderDeviceRoomActions(i,r.entities)}</span>
                      <div class=${this._entitiesGridClass(i,n)}>
                        ${k(r.entities,e=>e.entity_id,i=>n?this._renderRoomStyleEntityCard(i,e):this._renderEntityCard(i,e))}
                      </div>
                    </dd-next-room-group>
                  `})}
              </div>
            `}
      </div>
    `}_renderEnergyView(){const e=this._energySummary(),i=e.areas[0],t=this._energyStatisticsEntities(e.areas.flatMap(e=>e.entities),8);return a`
      <div class="device-view energy-view">
        ${this._renderDevicePageHeader({icon:"mdi:flash",title:this._t("devices.energy"),subtitle:this._t("devices.live_power_usage"),color:this._typeColor(F),back:!0})}

        ${e.sensorCount?a`
              <div class="energy-overview-grid">
                <section class="energy-overview-card total">
                  <div class="energy-overview-head">
                    <span class="energy-overview-icon">
                      <ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>
                    </span>
                    <div>
                      <h2>${this._t("devices.whole_house")}</h2>
                      <p>${this._tp("devices.live_power_sensor",e.sensorCount)}</p>
                    </div>
                    <strong>${e.formattedTotal}</strong>
                  </div>
                  ${this._renderEnergyStatisticsGraph(t,this._t("devices.whole_house_history"))}
                </section>

                ${i?a`
                  <section class="energy-overview-card top-area">
                    <div class="energy-overview-head">
                      <span class="energy-overview-icon">
                        <ha-icon icon=${i.icon}></ha-icon>
                      </span>
                      <div>
                        <h2>${this._t("devices.top_area")}</h2>
                        <p>${i.name}</p>
                      </div>
                      <strong>${i.formattedTotal}</strong>
                    </div>
                    <div class="energy-top-entities">
                      ${i.entities.slice(0,3).map(e=>this._renderEnergyEntityMini(e,i.totalWatts))}
                    </div>
                  </section>
                `:r}
              </div>

              <div class="energy-areas-grid">
                ${k(e.areas,e=>e.areaId,e=>this._renderEnergyAreaCard(e))}
              </div>
            `:a`
              <div class="energy-empty">
                <ha-icon icon="mdi:flash-off-outline"></ha-icon>
                <h2>${this._t("devices.no_power_title")}</h2>
                <p>${this._t("devices.no_power_description")}</p>
              </div>
            `}
      </div>
    `}_roomAccent(e){const i=this._hass?.areas?.[e.area_id];return i?.icon_color||i?.color||"var(--primary-color)"}_renderEnergyAreaCard(e){const i=!e.areaId.startsWith("__");return a`
      <section class="energy-area-card">
        <header class="energy-area-head">
          <button
            class="energy-area-title"
            type="button"
            @click=${()=>i?this._navigateToArea(e.areaId):void 0}
            ?disabled=${!i}
          >
            <span class="energy-area-icon">
              <ha-icon icon=${e.icon}></ha-icon>
            </span>
            <span>
              <strong>${e.name}</strong>
              <small>${this._tp("devices.power_entity",e.entities.length)}</small>
            </span>
          </button>
          <div class="energy-area-total">
            <span>${e.formattedTotal}</span>
            <small>${this._t("devices.total_now")}</small>
          </div>
        </header>

        ${this._renderEnergyStatisticsGraph(this._energyStatisticsEntities(e.entities,6),`${e.name} power history`)}

        <div class="energy-entity-list">
          ${k(e.entities,e=>e.entityId,i=>this._renderEnergyEntityRow(i,e.totalWatts))}
        </div>
      </section>
    `}_renderEnergyEntityMini(e,i){const t=this._energyEntityPercentage(e,i);return a`
      <button
        class="energy-entity-mini"
        type="button"
        style=${`--power-width: ${t}%`}
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        <span>${e.name}</span>
        <strong>${e.formatted}</strong>
      </button>
    `}_renderEnergyEntityRow(e,i){const t=this._energyEntityPercentage(e,i);return a`
      <button
        class="energy-entity-row"
        type="button"
        style=${`--power-width: ${t}%`}
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        <span class="energy-entity-icon">
          <ha-icon icon=${e.icon}></ha-icon>
        </span>
        <span class="energy-entity-copy">
          <strong>${e.name}</strong>
          <small>${e.areaName}</small>
          <span class="energy-entity-bar" aria-hidden="true"><span></span></span>
        </span>
        <span class="energy-entity-value">${e.formatted}</span>
      </button>
    `}_energyEntityPercentage(e,i){return i<=0?0:Math.max(4,Math.min(100,Math.round(e.watts/i*100)))}_energyStatisticsEntities(e,i){const t=["#65A83F","#E5B83B","#239CB5","#D98928","#50A789","#8065C7","#AD7253","#367DD5"];return e.filter(e=>["measurement","total","total_increasing"].includes(e.stateClass||"")).sort((e,i)=>i.watts-e.watts).slice(0,i).map((e,i)=>({entity:e.entityId,name:e.name,color:t[i%t.length]}))}_renderEnergyStatisticsGraph(e,i){if(!e.length)return r;const t={type:"statistics-graph",entities:e,days_to_show:1,period:"5minute",stat_types:["mean"],chart_type:"line",hide_legend:!0,fit_y_data:!0,min_y_axis:0};return a`
      <dwains-dashboard-next-card-host
        class="energy-statistics-card"
        aria-label=${i}
        .hass=${this._hass}
        .config=${t}
      ></dwains-dashboard-next-card-host>
    `}_renderMaintenanceView(e){const i=this._orderedMaintenanceBuckets(e);return a`
      <div class="device-view maintenance-view">
        ${this._renderDevicePageHeader({icon:"mdi:wrench",title:this._t("devices.maintenance"),subtitle:this._maintenanceSubtitle(e),color:this._typeColor(G),back:!0})}

        ${i.length?i.map(e=>a`
              <div class="domain-group maintenance-area-group">
                <div class="domain-header">
                  <div class="domain-header-title">
                    <ha-icon icon="mdi:floor-plan"></ha-icon>
                    <span>${e.area.name}</span>
                  </div>
                </div>
                <div class="maintenance-grid">
                  ${k(e.items,e=>e.entityId,e=>this._renderMaintenanceCard(e))}
                </div>
              </div>
            `):a`
              <div class="maintenance-empty">
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                <span>${this._t("devices.maintenance_empty")}</span>
              </div>
            `}
      </div>
    `}_orderedMaintenanceBuckets(e){const i=new Map(this._getVisibleSortedAreas().map((e,i)=>[e.area_id,i]));return[...e.values()].sort((e,t)=>{const n=i.get(e.area.area_id)??Number.MAX_SAFE_INTEGER,a=i.get(t.area.area_id)??Number.MAX_SAFE_INTEGER;return n!==a?n-a:e.area.name.localeCompare(t.area.name)})}_renderMaintenanceCard(e){return a`
      <button
        class="maintenance-card ${e.kind}"
        type="button"
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        <div class="maintenance-card-icon">
          <ha-icon icon=${e.icon}></ha-icon>
          ${"unavailable"===e.kind?a`<span class="maintenance-alert-dot">!</span>`:r}
        </div>
        <div class="maintenance-card-copy">
          <div class="maintenance-card-title">${e.name}</div>
          <div class="maintenance-card-state">${e.stateLabel}</div>
        </div>
      </button>
    `}_showMoreInfo(e){B(this,"hass-more-info",{entityId:e})}_navigateToArea(e){if(!e||"__maintenance_no_area__"===e)return;const i=window.location.pathname.split("/")[1]||"lovelace",t=new URL(window.location.href);t.pathname=`/${i}/home`,t.searchParams.set("dd_area",e),t.searchParams.delete("dd_device"),window.history.pushState(null,"",t.toString());const n=new Event("location-changed",{bubbles:!0,composed:!0});n.detail={replace:!1},window.dispatchEvent(n)}_deviceGroupDomain(e){if(["cover_openings","cover_shading","cover_gates"].includes(e))return"cover";const i=e.split(".")[0]||e;return["light","switch","fan","input_boolean","cover","lock"].includes(i)?i:void 0}_renderDeviceGlobalActions(e,i){const t=this._deviceGroupDomain(e);return t&&i.length?a`
      <div class="device-global-actions">
        ${this._renderDeviceBulkButtons(t,i,!0)}
      </div>
    `:r}_renderDeviceRoomActions(e,i){const t=this._deviceGroupDomain(e);if(!t||!i.length)return r;const n=i.filter(e=>{const i=this._hass.states?.[e.entity_id];return i&&this._roomStyleEntityActive(i,t)}).length;if(["light","switch","fan","input_boolean"].includes(t))return a`
        <dd-next-room-actions
          mode="toggle"
          .accent=${f(t)}
          .activeCount=${n}
          .totalCount=${i.length}
          .toggleOnLabel=${this._t("action.turn_on_all")}
          .toggleOffLabel=${this._t("action.turn_off_all")}
          @dd-action=${e=>{this._runDeviceBulkAction(i,e.detail.action)}}
        ></dd-next-room-actions>
      `;if("cover"===t||"lock"===t){const e=n>0,r="cover"===t?[{action:"open_cover",label:this._t("action.open_all"),icon:"mdi:arrow-up",active:e},{action:"close_cover",label:this._t("action.close_all"),icon:"mdi:arrow-down",active:!e}]:[{action:"lock",label:this._t("action.lock_all"),icon:"mdi:lock-outline",active:!e},{action:"unlock",label:this._t("action.unlock_all"),icon:"mdi:lock-open-variant-outline",active:e}];return a`
        <dd-next-room-actions
          mode="segmented"
          .accent=${f(t)}
          .items=${r}
          @dd-action=${e=>{this._runDeviceBulkAction(i,e.detail.action)}}
        ></dd-next-room-actions>
      `}return r}_renderDeviceBulkButtons(e,i,t){const n=(n,o,s)=>a`
      <button
        class="device-bulk-action ${t?"with-label":"icon-only"}"
        type="button"
        title=${n}
        aria-label=${n}
        style=${`--domain-color: ${f(e)};`}
        @click=${e=>{e.stopPropagation(),this._runDeviceBulkAction(i,s)}}
      >
        <ha-icon icon=${o}></ha-icon>
        ${t?a`<span>${n}</span>`:r}
      </button>
    `;return["light","switch","fan","input_boolean"].includes(e)?a`
        ${n(this._t("action.turn_on_all"),"mdi:power","turn_on")}
        ${n(this._t("action.turn_off_all"),"mdi:power-off","turn_off")}
      `:"cover"===e?a`
        ${n(this._t("action.open_all"),"mdi:arrow-up","open_cover")}
        ${n(this._t("action.close_all"),"mdi:arrow-down","close_cover")}
      `:"lock"===e?a`
        ${n(this._t("action.unlock_all"),"mdi:lock-open-variant-outline","unlock")}
        ${n(this._t("action.lock_all"),"mdi:lock-outline","lock")}
      `:r}async _runDeviceBulkAction(e,i){const t=new Map;for(const i of e){if(!this._hass.states?.[i.entity_id])continue;const e=i.entity_id.split(".")[0]||"",n=t.get(e)||[];n.push(i.entity_id),t.set(e,n)}try{for(const[e,n]of t)["light","switch","fan","input_boolean"].includes(e)&&["turn_on","turn_off"].includes(i)?await this._hass.callService(e,i,{entity_id:n}):"cover"===e&&["open_cover","close_cover"].includes(i)?await this._hass.callService("cover",i,{entity_id:n}):"lock"===e&&["lock","unlock"].includes(i)&&await this._hass.callService("lock",i,{entity_id:n})}catch(e){console.warn(`Failed to run device bulk action ${i}`,e)}}_renderEntityCard(e,i){return this._hass.states[e.entity_id]?a`
      <dd-next-device-entity-card
        class="${this._entityWrapperClass(e.entity_id)}"
        .hass=${this._hass}
        .config=${this.config}
        .entityId=${e.entity_id}
        .areaName=${i.name}
        @dd-more-info=${e=>this._showMoreInfo(e.detail.entityId)}
      ></dd-next-device-entity-card>
    `:r}_isSpecialDeviceType(e){return["light","cover","cover_openings","cover_shading","cover_gates","climate","sensor"].includes(e)}_renderRoomStyleEntityCard(e,i){const t=this._hass.states[e.entity_id];if(!t)return r;const n=E({hass:this._hass,config:this.config,entity:e,surface:"devices_cards"});if(n&&!1!==n.enabled)return a`
        <div class="entity-card-wrapper room-style-replacement-card">
          <dwains-dashboard-next-card-host
            framed
            .hass=${this._hass}
            .config=${this._entityCardConfig(e.entity_id)}
          ></dwains-dashboard-next-card-host>
        </div>
      `;const o=e.entity_id.split(".")[0]||"unknown",s=t.attributes?.device_class,c=t.attributes?.friendly_name||this._hass.entities?.[e.entity_id]?.name||e.entity_id,l=!0===this.config?.settings?.hide_area_name_in_entity_names?S(c,i.name):c;if("person"===o)return a`
        <dd-next-device-entity-card
          .hass=${this._hass}
          .config=${this.config}
          .entityId=${e.entity_id}
          .areaName=${i.name}
          .displayName=${l}
          @dd-more-info=${e=>this._showMoreInfo(e.detail.entityId)}
        ></dd-next-device-entity-card>
      `;const h=this._hass.entities?.[e.entity_id]?.icon||t.attributes?.icon||b(o,s)||_(o),p=this._roomStyleEntityActive(t,o),m=["unavailable","unknown"].includes(String(t.state).toLowerCase())&&!["scene","event"].includes(o),g=["switch","fan","input_boolean"].includes(o);return d({name:l,status:T(this._hass,t),icon:h,accent:f(o,s),active:p,unavailable:m,toggle:g,onOpen:()=>this._showMoreInfo(e.entity_id),onToggle:()=>{this._toggleRoomStyleEntity(e.entity_id,o,p)},turnOnLabel:this._t("action.turn_on"),turnOffLabel:this._t("action.turn_off")})}_roomStyleEntityActive(e,i){const t=String(e?.state||"").toLowerCase();return"lock"===i?"unlocked"===t:"person"===i?"home"===t:"binary_sensor"===i?"on"===t:["on","open","opening","playing","active","home"].includes(t)}async _toggleRoomStyleEntity(e,i,t){const n="input_boolean"===i?"input_boolean":i;try{await this._hass.callService(n,t?"turn_off":"turn_on",{entity_id:e})}catch(i){console.warn(`Failed to toggle ${e} from Devices view`,i)}}_entitiesGridClass(e,i=!1){return["entities-grid",i?"room-style-entities-grid":"special-entities-grid","cover"===e||e.startsWith("cover_")?"cover-entities-grid":"","light"===e?"light-entities-grid":"","sensor"===e?"sensor-entities-grid":"","climate"===e?"climate-entities-grid":"","binary_sensor.motion"===e?"motion-entities-grid":"","todo"===e?"todo-entities-grid":""].filter(Boolean).join(" ")}_entityWrapperClass(e){const i=e.split(".")[0]||"",t=this._hass.states?.[e]?.attributes?.device_class;return["entity-card-wrapper",`${i}-entity-card`,"binary_sensor"===i&&["motion","occupancy","presence"].includes(String(t))?"motion-entity-card":""].filter(Boolean).join(" ")}_renderNewDevicesView(e){return a`
      <div class="device-view">
        ${this._renderDevicePageHeader({icon:"mdi:new-box",title:this._t("devices.new"),subtitle:this._t("devices.new_description",{hours:C}),color:this._typeColor(P),back:!0})}
        <section class="recent-devices new-devices-view">
          <div class="recent-grid">
            ${e.length?e.map(e=>this._renderRecentDevice(e)):a`
                  <div class="recent-empty">
                    ${this._t("devices.new_empty",{hours:C})}
                  </div>
                `}
          </div>
        </section>
      </div>
    `}_newDevices(e=999){return this._hass&&w(this.config)?z(this._hass,this.config,e):[]}_ensureDeviceTracking(){const e=M(this._hass,this.config);e&&(this.config={...this.config,device_admission:e},this._saveDeviceAdmission(e,!0))}_renderRecentDevice(e){return a`
      <div class="recent-device ${e.hidden?"is-hidden":""}">
        <div class="recent-device-main">
          <div class="recent-device-icon">
            <ha-icon icon=${e.hidden?"mdi:eye-off-outline":"mdi:devices"}></ha-icon>
          </div>
          <div class="recent-device-copy">
            <div class="recent-device-name">${e.device.name}</div>
            <div class="recent-device-meta">
              <span>${e.areaName}</span>
              <span>${this._tp("common.entity",e.entityCount)}</span>
              <span>${this._formatAddedAge(e.createdAtMs)}</span>
            </div>
            <div class="recent-domains">
              ${e.domains.slice(0,4).map(e=>a`
                <span>${y(this._hass,e)}</span>
              `)}
            </div>
          </div>
        </div>
      </div>
    `}_getDashboardUrlPath(){const e=window.location.pathname.split("/")[1];if(e&&"lovelace"!==e)return e}_formatAddedAge(e){const i=Math.max(0,Date.now()-e),t=Math.floor(i/36e5);if(t<1)return this._t("devices.added_just_now");const n=new Intl.RelativeTimeFormat(I(this._hass),{numeric:"always"});return t<24?n.format(-t,"hour"):n.format(-Math.floor(t/24),"day")}async _saveDeviceAdmission(e,i=!1){this.config={...this.config,device_admission:e},this.requestUpdate();try{const i=this._getDashboardUrlPath(),t=i?{url_path:i}:{},n=await this._hass.callWS({type:"lovelace/config",...t}),a=n?.strategy||{};await this._hass.callWS({type:"lovelace/config/save",...t,config:{...n,strategy:{...a,device_admission:e}}})}catch(e){console.error("❌ Device visibility save failed:",e),i||alert(this._t("devices.save_visibility_failed",{error:String(e)}))}}};U.styles=s`
    :host {
      display: block;
      -webkit-tap-highlight-color: transparent;
    }

    button,
    .area-button,
    .recent-device,
    .restore-button {
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .loading,
    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 16px;
      color: var(--secondary-text-color);
    }

    /* Layout Container */
    .layout-container {
      display: flex;
      height: 100vh;
      position: relative;
    }

    /* Sidebar */
    .sidebar {
      width: 250px;
      background: var(--card-background-color);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
      z-index: 1;
      overflow-y: auto;
    }

    .sidebar-title {
      padding: 16px 16px 4px;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .area-list {
      padding: 8px;
    }

    .area-button {
      --domain-color: var(--primary-color);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 8px;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--secondary-background-color);
      border: none;
      width: 100%;
      text-align: left;
      color: var(--primary-text-color);
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .area-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .area-button.selected {
      background: var(--domain-color);
      color: var(--text-primary-color);
    }

    .area-button.new-devices {
      --domain-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      border: 1px solid rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
    }

    .area-button.new-devices.selected {
      background: var(--domain-color);
      border-color: transparent;
      color: var(--text-primary-color);
    }

    .area-button.new-devices .area-icon {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .area-button.new-devices.selected .area-icon {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text-primary-color);
    }

    .area-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--secondary-background-color);
      color: var(--domain-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-icon {
      background: rgba(255, 255, 255, 0.2);
    }

    .area-info {
      flex: 1;
      min-width: 0;
    }

    .area-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 2px;
    }

    .device-menu-subtitle {
      display: none;
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .device-menu-chevron {
      display: none;
      flex-shrink: 0;
      color: var(--secondary-text-color);
      --mdc-icon-size: 22px;
    }

    .area-button.selected .device-menu-subtitle,
    .area-button.selected .device-menu-chevron {
      color: var(--text-primary-color);
      opacity: 0.88;
    }

    .domain-count {
      flex-shrink: 0;
      min-width: 24px;
      height: 24px;
      padding: 0 8px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--domain-color) 11%, var(--secondary-background-color));
      color: var(--domain-color);
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .area-button.selected .domain-count {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text-primary-color);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .content-area {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .device-view {
      max-width: 1600px;
      margin: 0 auto;
    }

    .overview-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 600;
    }

    .devices-overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 14px;
    }

    .devices-overview-card {
      --domain-color: var(--primary-color);
      min-height: 148px;
      padding: 16px;
      border: 1px solid color-mix(in srgb, var(--domain-color) 15%, var(--divider-color));
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 16px 34px rgba(15, 23, 42, 0.06);
      display: grid;
      grid-template-rows: auto 1fr auto;
      align-items: start;
      text-align: left;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .devices-overview-card::after {
      content: "";
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 999px 999px 0 0;
      background: color-mix(in srgb, var(--domain-color) 60%, transparent);
    }

    .devices-overview-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--domain-color) 32%, var(--divider-color));
      box-shadow: 0 20px 42px rgba(15, 23, 42, 0.1);
    }

    .overview-card-icon {
      width: 46px;
      height: 46px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--domain-color) 12%, transparent);
      color: var(--domain-color);
      position: relative;
    }

    .overview-card-icon ha-icon {
      --mdc-icon-size: 25px;
    }

    .overview-card-count {
      position: absolute;
      right: -10px;
      top: -9px;
      min-width: 22px;
      height: 22px;
      padding: 0 7px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--domain-color);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 8px 18px color-mix(in srgb, var(--domain-color) 32%, transparent);
    }

    .overview-card-copy {
      align-self: end;
      display: grid;
      gap: 3px;
      min-width: 0;
    }

    .overview-card-copy strong {
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 800;
      line-height: 1.05;
    }

    .overview-card-copy small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .overview-card-chevron {
      position: absolute;
      right: 14px;
      top: 14px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 22px;
    }

    .recent-devices {
      margin-bottom: 18px;
      padding: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
    }

    .new-devices-view {
      margin-bottom: 0;
    }

    .area-button.maintenance {
      --domain-color: var(--warning-color, #ff9800);
    }

    .recent-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }

    .recent-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 700;
    }

    .recent-title ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .recent-count {
      min-width: 22px;
      height: 22px;
      padding: 0 7px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color);
      font-size: 12px;
      font-weight: 700;
    }

    .recent-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 1.4;
    }

    .recent-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 8px;
    }

    .recent-empty {
      grid-column: 1 / -1;
      padding: 24px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
      color: var(--secondary-text-color);
      text-align: center;
      background: var(--primary-background-color);
      font-size: 13px;
    }

    .recent-device {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 10px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      background: var(--primary-background-color);
    }

    .recent-device.is-hidden {
      opacity: 0.72;
    }

    .recent-device-main {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      min-width: 0;
    }

    .recent-device-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: var(--secondary-background-color);
      color: var(--primary-color);
    }

    .recent-device-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .recent-device-copy {
      min-width: 0;
    }

    .recent-device-name {
      font-weight: 650;
      font-size: 14px;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .recent-device-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 12px;
    }

    .recent-domains {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 7px;
    }

    .recent-domains span {
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 11px;
    }

    .maintenance-view {
      width: 100%;
      max-width: none;
    }

    .maintenance-header {
      align-items: flex-start;
      margin-bottom: 22px;
    }

    .maintenance-header-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 500;
    }

    .maintenance-summary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .maintenance-summary span {
      min-height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: color-mix(in srgb, var(--domain-color) 10%, var(--card-background-color));
      color: var(--domain-color);
      font-size: 13px;
      font-weight: 800;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--domain-color) 14%, transparent);
    }

    .maintenance-summary ha-icon {
      --mdc-icon-size: 17px;
    }

    .maintenance-area-group {
      margin-bottom: 14px;
    }

    .maintenance-area-title {
      min-height: 34px;
      margin: 0 0 7px;
      padding: 0 4px;
      border: 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 760;
    }

    .maintenance-area-title:disabled {
      cursor: default;
    }

    .maintenance-area-title span:first-child {
      color: var(--primary-text-color);
    }

    .maintenance-area-title span:nth-child(2) {
      min-width: 21px;
      height: 21px;
      padding: 0 7px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 850;
    }

    .maintenance-area-title ha-icon {
      --mdc-icon-size: 18px;
    }

    .maintenance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .maintenance-card {
      min-height: 56px;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
      transition:
        border-color 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.18s ease;
    }

    .maintenance-card:hover {
      border-color: color-mix(in srgb, var(--domain-color) 26%, var(--divider-color));
      box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }

    .maintenance-card-icon {
      position: relative;
      width: 34px;
      height: 34px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }

    .maintenance-card.battery .maintenance-card-icon {
      background: rgba(var(--rgb-warning-color, 255, 152, 0), 0.12);
      color: var(--warning-color, #ff9800);
    }

    .maintenance-card.unavailable .maintenance-card-icon {
      background: color-mix(in srgb, var(--secondary-text-color) 10%, var(--secondary-background-color));
      color: color-mix(in srgb, var(--secondary-text-color) 86%, var(--primary-text-color));
    }

    .maintenance-card-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .maintenance-alert-dot {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 16px;
      height: 16px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--warning-color, #ff9800);
      color: #ffffff;
      font-size: 11px;
      font-weight: 900;
      box-shadow: 0 0 0 2px var(--card-background-color);
    }

    .maintenance-card-copy {
      min-width: 0;
    }

    .maintenance-card-title {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 750;
      line-height: 1.16;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .maintenance-card-state {
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 550;
      line-height: 1.2;
    }

    .maintenance-empty {
      min-height: 180px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--secondary-text-color);
      background: var(--card-background-color);
    }

    .maintenance-empty ha-icon {
      --mdc-icon-size: 22px;
      color: var(--success-color, #4caf50);
    }

    .area-button.energy {
      --domain-color: ${o(f("energy"))};
    }

    .energy-view {
      --domain-color: ${o(f("energy"))};
      width: 100%;
      max-width: none;
    }

    .energy-header {
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .energy-header-subtitle {
      margin-top: 3px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 600;
    }

    .energy-header-total {
      min-width: 150px;
      padding: 9px 12px;
      border-radius: 12px;
      display: grid;
      justify-items: end;
      background: color-mix(in srgb, var(--domain-color) 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--domain-color) 14%, transparent);
    }

    .energy-header-total span {
      color: var(--primary-text-color);
      font-size: 24px;
      font-weight: 950;
      line-height: 1;
    }

    .energy-header-total small,
    .energy-overview-head p,
    .energy-area-title small,
    .energy-area-total small,
    .energy-entity-copy small {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
    }

    .energy-overview-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(260px, 1fr));
      gap: 12px;
      margin-bottom: 14px;
    }

    .energy-overview-card,
    .energy-area-card {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
    }

    .energy-overview-card {
      padding: 14px;
      overflow: hidden;
    }

    .energy-overview-head {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .energy-overview-icon,
    .energy-area-icon,
    .energy-entity-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: color-mix(in srgb, var(--domain-color) 12%, transparent);
      color: var(--domain-color);
    }

    .energy-overview-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
    }

    .energy-overview-icon ha-icon {
      --mdc-icon-size: 24px;
    }

    .energy-overview-head h2 {
      margin: 0;
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .energy-overview-head p {
      margin: 4px 0 0;
    }

    .energy-overview-head strong {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      white-space: nowrap;
    }

    .energy-statistics-card {
      display: block;
      min-height: 150px;
      margin-top: 12px;
      border-radius: 12px;
      overflow: hidden;
      background: color-mix(in srgb, var(--domain-color) 4%, transparent);
      --ha-card-background: transparent;
      --ha-card-box-shadow: none;
      --ha-card-border-width: 0;
      --ha-card-border-radius: 12px;
    }

    .energy-top-entities {
      margin-top: 12px;
      display: grid;
      gap: 7px;
    }

    .energy-entity-mini {
      min-height: 30px;
      padding: 0 9px;
      border: 0;
      border-radius: 9px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      background:
        linear-gradient(90deg,
          color-mix(in srgb, var(--domain-color) 16%, transparent) 0 var(--power-width),
          var(--secondary-background-color) var(--power-width) 100%);
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
      font-size: 12px;
      font-weight: 800;
    }

    .energy-entity-mini span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .energy-entity-mini strong {
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .energy-areas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 12px;
    }

    .energy-area-card {
      padding: 14px;
      overflow: hidden;
    }

    .energy-area-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .energy-area-title {
      min-width: 0;
      padding: 0;
      border: 0;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
    }

    .energy-area-title:disabled {
      cursor: default;
    }

    .energy-area-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
    }

    .energy-area-icon ha-icon {
      --mdc-icon-size: 22px;
    }

    .energy-area-title strong {
      display: block;
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 900;
      line-height: 1.12;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .energy-area-title small {
      display: block;
      margin-top: 3px;
    }

    .energy-area-total {
      display: grid;
      justify-items: end;
      gap: 2px;
    }

    .energy-area-total span {
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
    }

    .energy-entity-list {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }

    .energy-entity-row {
      min-height: 58px;
      padding: 9px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      text-align: left;
      font: inherit;
      transition:
        border-color 0.16s ease,
        transform 0.16s ease,
        box-shadow 0.16s ease;
    }

    .energy-entity-row:hover {
      border-color: color-mix(in srgb, var(--domain-color) 26%, var(--divider-color));
      box-shadow: 0 12px 22px rgba(15, 23, 42, 0.08);
      transform: translateY(-1px);
    }

    .energy-entity-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }

    .energy-entity-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .energy-entity-copy {
      min-width: 0;
      display: grid;
      gap: 3px;
    }

    .energy-entity-copy strong {
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 850;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .energy-entity-bar {
      position: relative;
      height: 5px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--domain-color) 10%, var(--secondary-background-color));
    }

    .energy-entity-bar span {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--domain-color), #f5c85b);
    }

    .energy-entity-value {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
    }

    .energy-empty {
      min-height: 280px;
      padding: 32px;
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--card-background-color);
      color: var(--secondary-text-color);
      text-align: center;
    }

    .energy-empty ha-icon {
      --mdc-icon-size: 34px;
      color: var(--domain-color);
    }

    .energy-empty h2 {
      margin: 4px 0 0;
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 850;
    }

    .energy-empty p {
      max-width: 430px;
      margin: 0;
      font-size: 13px;
      line-height: 1.45;
    }

    /* Domain (per area) groups */
    .domain-group {
      background: var(--card-background-color);
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 14px;
      box-shadow: 0 5px 14px rgba(15, 23, 42, 0.035);
    }

    .domain-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .domain-header-title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .domain-header ha-icon {
      --mdc-icon-size: 20px;
      opacity: 0.8;
    }

    .device-global-actions {
      width: 100%;
      margin: -2px 0 12px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex-wrap: wrap;
    }

    .device-bulk-action {
      min-height: 36px;
      padding: 0 12px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      font: inherit;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.055),
        inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }

    .device-bulk-action ha-icon {
      --mdc-icon-size: 17px;
      color: var(--domain-color, var(--primary-color));
    }

    .device-bulk-action.icon-only {
      width: 32px;
      height: 30px;
      min-height: 30px;
      padding: 0;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 7%, transparent);
    }

    .person-device-grid {
      margin: 0;
      align-items: start;
    }

    .device-room-groups {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      align-items: start;
    }

    .device-room-groups .device-room-group {
      grid-column: 1 / -1;
      margin-bottom: 0;
      min-width: 0;
    }

    .device-room-groups .device-room-group.half-room {
      grid-column: span 1;
    }

    .device-room-groups .device-room-group.half-room .entities-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    .entities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .entities-grid.cover-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
    }

    .entities-grid.light-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }

    .entities-grid.sensor-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }

    .entities-grid.motion-entities-grid {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
    }

    .entities-grid.todo-entities-grid {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 760px));
      align-items: start;
    }

    .entity-card-wrapper {
      min-height: 60px;
      position: relative;
      min-width: 0;
    }

    .room-style-entities-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: stretch;
      gap: 8px;
    }

    .room-style-device-view .mobile-entity-avatar {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      border-radius: inherit;
    }

    /* The location map forms the lower card section and uses two thirds
       of that section's width, centred beneath the identity row. */
    .room-style-device-view .person-location-preview {
      width: 66.666%;
      height: 90px;
      margin-top: 10px;
      align-self: center;
      overflow: hidden;
      border-radius: 8px;
      pointer-events: none;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }

    .room-style-replacement-card {
      min-height: 62px;
    }

    .cover-entity-card {
      min-height: 72px;
    }

    .light-entity-card {
      min-height: 72px;
    }

    .sensor-entity-card {
      min-height: 150px;
    }

    .motion-entity-card {
      min-height: 72px;
    }

    .cover-entity-card dwains-dashboard-next-card-host,
    .light-entity-card dwains-dashboard-next-card-host,
    .sensor-entity-card dwains-dashboard-next-card-host,
    .motion-entity-card dwains-dashboard-next-card-host {
      display: block;
    }

    /* Mobile */
    /* Compact device headers and stable desktop grids */
    @media (max-width: 1180px) and (min-width: 769px) {
      .room-style-device-view .room-style-entities-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (min-width: 769px) {
      .content-area {
        scrollbar-gutter: stable;
      }

      .special-device-view .entities-grid,
      .special-device-view .entities-grid.cover-entities-grid,
      .special-device-view .entities-grid.light-entities-grid,
      .special-device-view .entities-grid.sensor-entities-grid,
      .maintenance-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .room-style-device-view .room-style-entities-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .entities-grid.todo-entities-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .recent-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }






    /* Single mobile contract for the Devices view. */
    @media (max-width: 768px) {
      .content-area {
              padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px));
            }
      
            .domain-header {
              align-items: center;
              flex-direction: row;
            }
      
            .domain-header-title {
              justify-content: flex-start;
              text-align: left;
            }

      .sidebar {
        position: static;
        width: 100%;
        flex-basis: auto;
        height: auto;
        max-height: none;
        overflow: visible;
        scrollbar-gutter: auto;
        border: 0;
        background: transparent;
        transition: none;
      }
      

      

      
            .mobile-nav-overlay {
              position: fixed;
              inset: 0;
              background: rgba(8, 13, 24, 0.18);
              backdrop-filter: blur(3px);
              z-index: 140;
              opacity: 0;
              pointer-events: none;
              transition: opacity 0.3s ease;
            }
      
            .mobile-nav-overlay.open {
              opacity: 1;
              pointer-events: auto;
            }
      
            .mobile-device-picker-head {
              min-height: 34px;
              margin: 0 2px 8px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 12px;
            }
      
            .mobile-device-picker-title {
              min-width: 0;
              color: var(--primary-text-color);
              font-size: 18px;
              font-weight: 850;
              line-height: 1.1;
            }
      
            .mobile-device-picker-close {
              width: 34px;
              height: 34px;
              padding: 0;
              border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
              border-radius: 999px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              flex: 0 0 auto;
              background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
              color: var(--primary-text-color);
              cursor: pointer;
            }
      
            .mobile-device-picker-close ha-icon {
              --mdc-icon-size: 21px;
            }
      
            .sidebar .area-list {
              display: grid;
              gap: 6px;
              padding: 0;
            }
      
            .sidebar .area-button {
              display: grid;
              grid-template-columns: 48px minmax(0, 1fr) auto;
              align-items: center;
              gap: 12px;
              min-height: 70px;
              height: auto;
              margin-bottom: 0;
              padding: 10px 12px;
              border-radius: 8px;
              border: 1px solid rgba(15, 23, 42, 0.06);
              background: rgba(255, 255, 255, 0.92);
              color: var(--primary-text-color);
              box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
              transform: none;
            }
      
            .sidebar .area-button:hover {
              transform: translateY(-1px);
              box-shadow: 0 12px 24px rgba(15, 23, 42, 0.09);
            }
      
            .sidebar .area-button.selected {
              background: rgba(255, 255, 255, 0.98);
              border-color: color-mix(in srgb, var(--domain-color) 34%, transparent);
              color: var(--primary-text-color);
              box-shadow:
                0 14px 28px rgba(15, 23, 42, 0.1),
                inset 3px 0 0 var(--domain-color);
              transform: none;
            }
      
            .sidebar .area-icon {
              width: 46px;
              height: 46px;
              border-radius: 8px;
              background: color-mix(in srgb, var(--domain-color) 10%, transparent);
              color: var(--domain-color);
            }
      
            .sidebar .area-icon ha-icon {
              --mdc-icon-size: 25px;
            }
      
            .sidebar .area-button.selected .area-icon {
              background: color-mix(in srgb, var(--domain-color) 14%, transparent);
              color: var(--domain-color);
            }
      
            .sidebar .area-name {
              margin: 0;
              font-size: 15px;
              font-weight: 800;
              line-height: 1.1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
      
            .sidebar .device-menu-subtitle,
            .sidebar .device-menu-chevron {
              display: block;
            }
      
            .sidebar .device-menu-subtitle {
              font-weight: 650;
            }
      
            .sidebar .area-button.selected .device-menu-subtitle,
            .sidebar .area-button.selected .device-menu-chevron {
              color: var(--secondary-text-color);
              opacity: 1;
            }
      
            .sidebar .device-menu-chevron {
              color: rgba(15, 23, 42, 0.52);
              transition: transform 0.18s ease, color 0.18s ease;
            }
      
            .sidebar .area-button.selected .device-menu-chevron {
              color: var(--domain-color);
              transform: translateX(2px);
            }
      
            .sidebar .domain-count {
              display: none;
            }
      
            :host([data-theme-dark]) {

      

      
              .sidebar-title {
                color: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
              }
      
              .sidebar .area-button {
                border-color: rgba(255, 255, 255, 0.06);
                background:
                  linear-gradient(180deg,
                    color-mix(in srgb, var(--card-background-color) 86%, #ffffff 4%),
                    color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
                color: var(--primary-text-color);
                box-shadow:
                  0 10px 22px rgba(0, 0, 0, 0.24),
                  inset 0 1px 0 rgba(255, 255, 255, 0.035);
              }
      
              .sidebar .area-button:hover {
                box-shadow:
                  0 12px 26px rgba(0, 0, 0, 0.32),
                  inset 0 1px 0 rgba(255, 255, 255, 0.05);
              }
      
              .sidebar .area-button.selected {
                border-color: color-mix(in srgb, var(--domain-color) 42%, transparent);
                background:
                  linear-gradient(180deg,
                    color-mix(in srgb, var(--card-background-color) 90%, var(--domain-color) 12%),
                    color-mix(in srgb, var(--card-background-color) 96%, #000000 5%));
                color: var(--primary-text-color);
                box-shadow:
                  0 14px 30px rgba(0, 0, 0, 0.36),
                  inset 3px 0 0 var(--domain-color),
                  inset 0 1px 0 rgba(255, 255, 255, 0.06);
              }
      
              .sidebar .area-button.new-devices {
                background: color-mix(in srgb, var(--primary-color) 16%, var(--card-background-color));
                border-color: color-mix(in srgb, var(--primary-color) 24%, transparent);
              }
      
              .sidebar .area-icon {
                background: color-mix(in srgb, var(--domain-color) 20%, transparent);
                color: var(--domain-color);
              }
      
              .sidebar .area-button.selected .area-icon,
              .sidebar .area-button.new-devices.selected .area-icon {
                background: color-mix(in srgb, var(--domain-color) 24%, transparent);
                color: var(--domain-color);
              }
      
              .sidebar .device-menu-subtitle,
              .sidebar .device-menu-chevron,
              .sidebar .area-button.selected .device-menu-subtitle,
              .sidebar .area-button.selected .device-menu-chevron {
                color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
              }
      
              .sidebar .area-button.selected .device-menu-chevron {
                color: var(--domain-color);
              }
      
              .mobile-nav-overlay {
                background: rgba(0, 0, 0, 0.58);
                backdrop-filter: blur(4px);
              }
            }
      
            .special-device-view .entities-grid,
            .special-device-view .entities-grid.cover-entities-grid,
            .special-device-view .entities-grid.light-entities-grid,
            .special-device-view .entities-grid.sensor-entities-grid {
              grid-template-columns: 1fr;
            }
      
            .room-style-device-view .room-style-entities-grid {
              grid-template-columns: 1fr;
              gap: 6px;
            }
      
            .room-style-device-view .domain-group,
            .maintenance-area-group {
              padding: 10px;
              margin-bottom: 10px;
            }
      
            .device-room-groups {
              grid-template-columns: 1fr;
              gap: 10px;
            }
      
            .device-room-groups .device-room-group,
            .device-room-groups .device-room-group.half-room {
              grid-column: 1;
            }
      
            .device-room-groups .device-room-group.half-room .entities-grid {
              grid-template-columns: 1fr !important;
            }
      
            .device-global-actions {
              margin-top: 0;
              justify-content: flex-end;
            }
      
            .device-bulk-action.with-label {
              min-height: 34px;
              padding: 0 10px;
              font-size: 11px;
            }
      
            .devices-overview-view {
              padding: 2px 0;
            }
      
            .devices-overview-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 12px;
            }
      
            .devices-overview-card {
              min-height: 128px;
              padding: 14px;
              border-radius: 8px;
            }
      
            .overview-card-icon {
              width: 42px;
              height: 42px;
            }
      
            .overview-card-copy strong {
              font-size: 16px;
              overflow-wrap: anywhere;
            }
      
            .overview-card-copy small {
              white-space: normal;
              line-height: 1.2;
            }
      
            .recent-header,
            .recent-device {
              align-items: stretch;
              grid-template-columns: 1fr;
            }
      
            .recent-header {
              flex-direction: column;
            }
      
            .maintenance-summary {
              width: auto;
            }
      
            .maintenance-grid {
              grid-template-columns: 1fr;
            }
      
            .maintenance-card {
              min-height: 62px;
            }
      
            .energy-header-total {
              justify-items: start;
            }
      
            .energy-overview-grid,
            .energy-areas-grid {
              grid-template-columns: 1fr;
            }
      
            .energy-overview-head,
            .energy-area-head {
              grid-template-columns: 40px minmax(0, 1fr);
            }
      
            .energy-overview-head strong,
            .energy-area-total {
              grid-column: 1 / -1;
              justify-self: stretch;
              justify-items: start;
              margin-top: 4px;
            }
      
            .energy-area-card,
            .energy-overview-card {
              border-radius: 10px;
            }
      
            .energy-entity-row {
              grid-template-columns: 36px minmax(0, 1fr);
            }
      
            .energy-entity-value {
              grid-column: 2;
              justify-self: start;
            }

      /* Match the Startseite top position and compact header height. */
            .content-area {
              padding-top: 10px !important;
            }
      
            /* Thermostat cards occupy half the phone width, while preserving the
               native card's internal width through the same 70% scaling. */
            .entities-grid.climate-entities-grid,
            .device-room-groups .device-room-group.half-room .entities-grid.climate-entities-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 8px !important;
            }
      
            .climate-entity-card {
              width: 100% !important;
              min-width: 0 !important;
              overflow: visible !important;
            }
    }
`,e([i()],U.prototype,"_selectedDomain",void 0),e([i()],U.prototype,"_isMobile",void 0),e([i()],U.prototype,"_mobileNavOpen",void 0),U=e([t("dwains-dashboard-next-devices-card")],U);export{U as DwainsDevicesCard};
