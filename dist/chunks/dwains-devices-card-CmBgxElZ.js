import{_ as e,r as i,t}from"./state-DfsJqMnn.js";import{i as a,b as r,A as n,a as o}from"./lit-element-Bpv9xYb0.js";import{b as s,e as d,f as c,p as l}from"./page-header-styles-CvgAFog5.js";import{x as p,i as h,b as g,t as m,w as v,y as u,z as b,j as y,n as x,v as _,k as f,l as w,p as k,h as $,N as D,A as E,B as C}from"./icons-h7lhTcGn.js";import{d as S,b as z,T as M,s as T,g as N,a as j,i as I}from"./index-BI_iDSCA.js";import{u as A}from"./dashboard-config-store-C7OHDEFk.js";import{e as L,a as O,s as P}from"./dwains-bottom-nav-BxqGZtuq.js";import{f as B}from"./fire-event-DQiSssdY.js";import"./dd-card-host-zbmwRU5c.js";import"./screensaver-media-h3Pumy9x.js";import"./blueprints-Dh4Un1Bn.js";const U="__new_devices__",F="__maintenance__",H="__maintenance_no_area__",V="energy",R="__overview__",W="person",G="__people__";let q=class extends a{constructor(){super(...arguments),this._selectedDomain=null,this._isMobile=!1,this._mobileNavOpen=!1,this._pendingDomainSelection=null,this._resizeHandler=()=>this._checkMobile(),this._locationHandler=()=>this._handleLocationChanged(),this._handleTranslationsLoaded=()=>{this.requestUpdate()},this._t=(e,i)=>S(this._hass,e,i),this._tp=(e,i,t)=>z(this._hass,e,i,t),this._handleOpenOverview=()=>{this._selectDomain(R)},this._handleSelectDeviceDomain=e=>{const i=e.detail?.domain;i&&(this._pendingDomainSelection=i,this._applyPendingDomainSelection(),this.requestUpdate())},this._toggleMobileNav=()=>{this._mobileNavOpen=!this._mobileNavOpen},this._handleDevicesNavToggle=e=>{this._isMobile&&(e?.detail?.open?this._mobileNavOpen=!0:this._toggleMobileNav())},this._closeMobileNav=()=>{this._mobileNavOpen=!1}}set hass(e){this._hass=e,this._syncThemeAttribute(),L(e,this.config?.settings),this._syncBottomNavDeviceContext();const i=this.renderRoot?.querySelectorAll("dwains-dashboard-next-card-host");i&&i.forEach(i=>i.hass=e)}get hass(){return this._hass}setConfig(e){if(!e)throw new Error(S(this._hass,"devices.invalid_configuration"));this.config={areas:e.areas,devices:e.devices,entities:e.entities,floors:e.floors,areas_display:e.areas_display,areas_options:e.areas_options,settings:e.settings,blueprint_replacements:e.blueprint_replacements,device_admission:e.device_admission},this._hass&&L(this._hass,this.config.settings);const i=this._getUrlDomain();if(i&&(this._pendingDomainSelection=i),!this._selectedDomain){const e=this._buildData(),t=this._showEnergyMenu();i===U?this._selectedDomain=U:i===F?this._selectedDomain=F:i===V&&t?this._selectedDomain=V:i&&e.has(i)?this._selectedDomain=i:this._selectedDomain=R,this._syncBottomNavDeviceContext()}}getCardSize(){return 12}connectedCallback(){super.connectedCallback(),this._syncThemeAttribute(!0),this._checkMobile(),window.addEventListener(M,this._handleTranslationsLoaded),window.addEventListener("resize",this._resizeHandler),window.addEventListener("dwains-dashboard-next-toggle-devices-nav",this._handleDevicesNavToggle),window.addEventListener("dwains-dashboard-next-select-device-domain",this._handleSelectDeviceDomain),window.addEventListener("dwains-dashboard-next-open-devices-overview",this._handleOpenOverview),window.addEventListener("location-changed",this._locationHandler),window.addEventListener("popstate",this._locationHandler),this._energyConfigUnsub=T(()=>this.requestUpdate()),this._handleLocationChanged(),this._syncBottomNavDeviceContext()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(M,this._handleTranslationsLoaded),window.removeEventListener("resize",this._resizeHandler),window.removeEventListener("dwains-dashboard-next-toggle-devices-nav",this._handleDevicesNavToggle),window.removeEventListener("dwains-dashboard-next-select-device-domain",this._handleSelectDeviceDomain),window.removeEventListener("dwains-dashboard-next-open-devices-overview",this._handleOpenOverview),window.removeEventListener("location-changed",this._locationHandler),window.removeEventListener("popstate",this._locationHandler),void 0!==this._deviceTrackingTimer&&(window.clearTimeout(this._deviceTrackingTimer),this._deviceTrackingTimer=void 0),this._energyConfigUnsub?.(),this._energyConfigUnsub=void 0}_checkMobile(){const e=this._isMobile;this._isMobile=window.innerWidth<=768,e!==this._isMobile&&(this._mobileNavOpen=!1)}_getUrlDomain(){try{return new URL(window.location.href).searchParams.get("dd_device")}catch{return null}}_updateUrlDomain(e){try{const i=new URL(window.location.href);e?i.searchParams.set("dd_device",e):i.searchParams.delete("dd_device"),window.history.replaceState(window.history.state,"",i.toString())}catch{}}_handleLocationChanged(){const e=this._getUrlDomain();e&&(this._pendingDomainSelection=e,this._applyPendingDomainSelection(),this.requestUpdate())}_getAreaEntities(e){const i=[],t=new Set,a=this.config;return a?.entities&&a.entities.forEach(r=>{if(p(a,r,e)){if(!h(N(this._hass)[r.entity_id]))return;i.push(r),t.add(r.entity_id)}}),Object.values(this._hass.states).forEach(a=>{if(!t.has(a.entity_id)&&a.attributes?.area_id===e){if(!h(N(this._hass)[a.entity_id]))return;i.push({entity_id:a.entity_id,area_id:e,hidden:!1})}}),i}_getFilteredAreaEntities(e){let i=this._getAreaEntities(e);if(i=i.filter(e=>h(N(this._hass)[e.entity_id])),this.config?.areas_options){const t=this.config.areas_options[e];if(t?.groups_options){const e=new Set;for(const i of Object.values(t.groups_options))i.hidden&&i.hidden.forEach(i=>e.add(i));i=i.filter(i=>!e.has(i.entity_id))}}return!1!==this.config?.settings?.hide_unavailable_entities_on_devices&&(i=i.filter(e=>{const i=this._hass.states[e.entity_id];return i&&!g(i)})),i=m(this._hass,this.config,i),i}_getVisibleSortedAreas(){return this.config?.areas?v(this.config.areas,this.config.areas_display,j(this._hass)):[]}_buildData(){const e=new Map;if(!this._hass)return e;const i=this._getVisibleSortedAreas();for(const t of i){const i=this._getFilteredAreaEntities(t.area_id);for(const a of i){const i=this._typeKeyFor(a.entity_id);if(!i)continue;let r=e.get(i);r||(r=new Map,e.set(i,r));let n=r.get(t.area_id);n||(n={area:t,entities:[]},r.set(t.area_id,n)),n.entities.push(a)}}return this._addPersonData(e),this._hiddenDeviceTypes().forEach(i=>e.delete(i)),e}_buildMaintenanceData(){const e=new Map;if(!this._hass||!this.config)return e;const i=u(this.config);return Object.values(this._hass.states).forEach(t=>{const a=t?.entity_id;if(!a)return;const r=N(this._hass)[a];if(r?.hidden_by||!0===r?.hidden||r?.disabled_by)return;const n=this._deviceIdForEntity(a,r);if(n&&i.has(n))return;const o=this._maintenanceKind(a,t);if(!o)return;const s=this._maintenanceAreaForEntity(a,t,r);if(!s)return;let d=e.get(s.area_id);d||(d={area:s,items:[]},e.set(s.area_id,d)),d.items.push({entityId:a,deviceId:n,areaId:s.area_id,name:t.attributes?.friendly_name||r?.name||a,stateLabel:this._formatMaintenanceState(t,o),icon:this._maintenanceIcon(a,t,o),kind:o})}),e.forEach(e=>{e.items.sort((e,i)=>e.kind!==i.kind?"unavailable"===e.kind?-1:1:e.name.localeCompare(i.name))}),e}_maintenanceSummary(e){let i=0;const t=new Set;let a=0;e.forEach(e=>{e.items.forEach(e=>{"battery"!==e.kind?e.deviceId?t.add(e.deviceId):a+=1:i+=1})});const r=t.size+a;return{lowBatteryCount:i,unavailableDeviceCount:r,totalCount:i+r}}_maintenanceSubtitle(e){const i=this._maintenanceSummary(e),t=[];return i.lowBatteryCount&&t.push(this._tp("devices.low_battery",i.lowBatteryCount)),i.unavailableDeviceCount&&t.push(this._tp("devices.unavailable_device",i.unavailableDeviceCount)),t.length?t.join(", "):this._t("devices.all_good")}_showEnergyMenu(e=this._energySummary()){return e.sensorCount>0}_showNewDevicesMenu(e=this._newDevices()){return!!b(this.config)&&(e.length>0||!0===this.config?.settings?.show_recent_devices_panel)}_energySummary(){return s(this._hass,this.config)}_energyBasisLabel(e){if("energy"===e.basis){const i=[...new Set(e.sources.map(e=>e.name))];return this._t("devices.power_based_on",{sensors:i.join(", ")})}return this._tp("devices.live_power_sensor",e.sensorCount)}_maintenanceKind(e,i){return"unavailable"===i.state?"unavailable":this._isLowBatteryEntity(e,i)?"battery":void 0}_isLowBatteryEntity(e,i){const t=e.split(".")[0],a=i.attributes?.device_class;if("battery"!==a)return!1;if("binary_sensor"===t)return"on"===i.state;const r=Number(i.state);return Number.isFinite(r)&&r<=20}_deviceIdForEntity(e,i){return i?.device_id||this.config?.entities?.find(i=>i.entity_id===e)?.device_id}_maintenanceAreaForEntity(e,i,t){const a=this.config?.entities?.find(i=>i.entity_id===e),r=this._deviceIdForEntity(e,t),n=r?this.config?.devices?.find(e=>e.device_id===r):void 0,o=r?this._hass?.devices?.[r]:void 0,s=t?.area_id||a?.area_id||i.attributes?.area_id||n?.area_id||o?.area_id;if(!s||(this.config?.areas_display?.hidden||[]).includes(s))return;const d=s?this.config?.areas?.find(e=>e.area_id===s):void 0;return d||void 0}_maintenanceIcon(e,i,t){if("battery"===t)return"mdi:battery-alert";const a=e.split(".")[0]||"";return i.attributes?.icon||y(a)||"mdi:help-box"}_formatMaintenanceState(e,i){if("unavailable"===i)return"unknown"===e.state?this._t("common.unknown"):this._t("common.unavailable");const t=e.attributes?.unit_of_measurement||"%";return O(e.state,t)}_addPersonData(e){const i=this._getVisiblePersonEntities();if(!i.length)return;let t=e.get(W);t||(t=new Map,e.set(W,t));const a=new Set;t.forEach(e=>e.entities.forEach(e=>a.add(e.entity_id)));const r=t.get(G)??{area:{area_id:G,name:x(this._hass,W),icon:"mdi:account-group"},entities:[]};r.entities=[...r.entities,...i.filter(e=>!a.has(e.entity_id))],r.entities.length&&t.set(G,r)}_getVisiblePersonEntities(){if(!this._hass||!this.config)return[];const e=new Set(this.config.settings?.hidden_persons||[]);return Object.values(this._hass.states).filter(i=>!!i.entity_id?.startsWith(`${W}.`)&&(!e.has(i.entity_id)&&h(N(this._hass)[i.entity_id]))).sort((e,i)=>{const t=e.attributes?.friendly_name||e.entity_id,a=i.attributes?.friendly_name||i.entity_id;return String(t).localeCompare(String(a))}).map(e=>({entity_id:e.entity_id,area_id:G,hidden:!1}))}_typeKeyFor(e){const i=e.split(".")[0];if(i){if("binary_sensor"===i){const i=this._hass?.states?.[e]?.attributes?.device_class;return i?`binary_sensor.${i}`:"binary_sensor"}return i}}_hiddenDeviceTypes(){return new Set((this.config?.settings?.hidden_device_types||[]).filter(e=>"string"==typeof e&&e.length>0))}_typeName(e){return e===F?this._t("devices.maintenance"):e===V?this._t("devices.energy"):e===R?this._t("navigation.overview"):e.startsWith("binary_sensor.")?_(this._hass,e.slice(14)):x(this._hass,e)}_typeIcon(e){return e===F?"mdi:wrench":e===V?"mdi:flash":e===R?"mdi:view-grid-outline":e===W?"mdi:account-group":e.startsWith("binary_sensor.")?f("binary_sensor",e.slice(14)):y(e)}_typeColor(e){return e===F?"var(--warning-color, #ff9800)":e===V?"#d88e20":e===R?"var(--primary-color)":e.startsWith("binary_sensor.")?w("binary_sensor",e.slice(14)):w(e)}_syncBottomNavDeviceContext(){const e=this._selectedDomain;window.dispatchEvent(new CustomEvent("dwains-dashboard-next-device-context-changed",{detail:{domain:e,icon:e===U?"mdi:new-box":e===F?"mdi:wrench":e===V?"mdi:flash":e!==R&&e&&e?this._typeIcon(e):"mdi:format-list-bulleted-type",label:e===U?this._t("devices.new"):e===F?this._t("devices.maintenance"):e===V?this._t("devices.energy"):e!==R&&e&&e?this._typeName(e):this._t("devices.title"),overview:e===R||!e}}))}updated(e){e.has("_hass")&&this._syncThemeAttribute(),e.has("_selectedDomain")&&this._syncBottomNavDeviceContext(),this._scheduleDeviceTracking()}_syncThemeAttribute(e=!1){P(this,this._hass,e)}_sortedDomains(e){return[...e.keys()].sort((e,i)=>this._typeName(e).localeCompare(this._typeName(i)))}_domainCount(e){let i=0;return e.forEach(e=>i+=e.entities.length),i}_applyPendingDomainSelection(e,i,t,a){if(!this._hass||!this.config)return!1;const r=this._pendingDomainSelection||this._getUrlDomain();if(!r)return!1;const n=e??this._buildData(),o=i??this._showNewDevicesMenu(),s=t??!0,d=a??this._showEnergyMenu();if(r===R);else if(r===U){if(!o)return!1}else if(r===F){if(!s)return!1}else if(r===V){if(!d)return!1}else if(!n.has(r))return!1;return this._pendingDomainSelection=null,this._selectedDomain!==r&&(this._selectedDomain=r,this._syncBottomNavDeviceContext()),!0}_entityCardConfig(e){return e.startsWith("todo.")?{type:"todo-list",entity:e}:k({hass:this._hass,config:this.config,entity:e,surface:"devices_cards"})}_selectDomain(e){const i=this._selectedDomain!==e;this._pendingDomainSelection=null,this._selectedDomain=e,this._updateUrlDomain(e===R?null:e),this._syncBottomNavDeviceContext(),this._closeMobileNav(),i&&this._scrollToTop()}_scrollToTop(){const e=this.shadowRoot?.querySelector(".content-area");e&&(e.scrollTop=0),this._isMobile&&window.scrollY>0&&window.scrollTo(0,0)}render(){if(!this._hass||!this.config)return r`<div class="loading">${this._t("common.loading")}</div>`;const e=this._buildData(),i=this._sortedDomains(e),t=this._newDevices(),a=this._showNewDevicesMenu(t),n=this._buildMaintenanceData(),o=this._energySummary(),s=this._showEnergyMenu(o);this._applyPendingDomainSelection(e,a,!0,s);const d=this._deviceGroupCards(e,i,t,a,n,o,s);return d.length?(this._selectedDomain===R||(this._selectedDomain===U?a||(this._selectedDomain=R):this._selectedDomain===F||(this._selectedDomain===V?s||(this._selectedDomain=R):this._selectedDomain&&e.has(this._selectedDomain)||(this._selectedDomain=R))),r`
      <div class="layout-container">
        ${this._renderMobileOverlay()}
        ${this._renderSidebar(d)}
        <div class="main-content">
          <div class="content-area">
            ${this._selectedDomain===U?this._renderNewDevicesView(t):this._selectedDomain===F?this._renderMaintenanceView(n):this._selectedDomain===V?this._renderEnergyView(o):this._selectedDomain===R?this._renderDevicesOverview(d):this._renderDeviceView(e)}
          </div>
        </div>
      </div>
    `):r`
        <div class="layout-container">
          ${this._renderMobileOverlay()}
          <div class="main-content">
            <div class="content-area">
              <div class="device-view">
                <div class="empty">${this._t("devices.empty")}</div>
              </div>
            </div>
          </div>
        </div>
      `}_renderMobileOverlay(){return this._isMobile?r`
      <div
        class="mobile-nav-overlay ${this._mobileNavOpen?"open":""}"
        @click=${this._closeMobileNav}
      ></div>
    `:n}_deviceGroupCards(e,i,t,a,r,n,o){const s=[];a&&s.push({key:U,icon:"mdi:new-box",title:this._t("devices.new"),subtitle:this._tp("devices.new",t.length),color:"var(--primary-color)",className:"new-devices",badge:String(t.length)});const d=this._maintenanceSummary(r);return s.push({key:F,icon:"mdi:wrench",title:this._t("devices.maintenance"),subtitle:this._maintenanceSubtitle(r),color:this._typeColor(F),className:"maintenance",badge:d.totalCount?String(d.totalCount):void 0,alertCount:d.totalCount||void 0}),o&&s.push({key:V,icon:"mdi:flash",title:this._t("devices.energy"),subtitle:n.formattedTotal,color:this._typeColor(V),className:"energy",badge:n.formattedTotal}),i.forEach(i=>{const t=e.get(i);if(!t)return;const a=this._domainCount(t);a&&s.push({key:i,icon:this._typeIcon(i),title:this._typeName(i),subtitle:this._tp("common.entity",a),color:this._typeColor(i),badge:String(a)})}),s}_renderSidebar(e){const i={sidebar:!0,open:this._isMobile&&this._mobileNavOpen};return r`
      <nav class=${d(i)}>
        <div class="sidebar-title">${this._t("devices.title")}</div>
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
              <div class="device-menu-subtitle">${this._tp("devices.group",e.length)}</div>
            </div>
            <span class="domain-count">${e.length}</span>
            <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
          </button>
          ${$(e,e=>e.key,e=>r`
              <button
                class="area-button ${e.className||""} ${this._selectedDomain===e.key?"selected":""}"
                style=${`--domain-color: ${e.color};`}
                @click=${()=>this._selectDomain(e.key)}
              >
                <div class="area-icon">
                  <ha-icon icon=${e.icon}></ha-icon>
                </div>
                <div class="area-info">
                  <div class="area-name">${e.title}</div>
                  <div class="device-menu-subtitle">${e.subtitle}</div>
                </div>
                ${e.badge?r`<span class="domain-count">${e.badge}</span>`:n}
                <ha-icon class="device-menu-chevron" icon="mdi:chevron-right"></ha-icon>
              </button>
            `)}
        </div>
      </nav>
    `}_renderDevicesOverview(e){return r`
      <div class="device-view devices-overview-view">
        ${this._renderDevicePageHeader({icon:"mdi:format-list-bulleted-type",title:this._t("devices.title"),subtitle:this._tp("devices.group",e.length),color:this._typeColor(R)})}

        <div class="devices-overview-grid">
          ${$(e,e=>e.key,e=>r`
              <button
                class="devices-overview-card"
                type="button"
                style=${`--domain-color: ${e.color};`}
                @click=${()=>this._selectDomain(e.key)}
              >
                <span class="overview-card-icon">
                  <ha-icon icon=${e.icon}></ha-icon>
                  ${e.alertCount?r`<span class="overview-card-count">${e.alertCount}</span>`:n}
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
    `}_renderDevicePageHeader(e){const i=["dd-page-header","device-page-header"];return e.className&&i.push(e.className),r`
      <header class=${i.join(" ")} style=${`--domain-color: ${e.color};`}>
        <div class="dd-page-header-top">
          ${e.back?r`
            <button
              class="dd-page-header-button dd-page-header-back"
              type="button"
              title=${this._t("navigation.back_devices")}
              aria-label=${this._t("navigation.back_devices")}
              @click=${()=>this._selectDomain(R)}
            >
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>
          `:n}
          <div class="dd-page-header-identity">
            <span class="dd-page-header-icon">
              <ha-icon icon=${e.icon}></ha-icon>
            </span>
            <div class="dd-page-header-copy">
              <h1 class="dd-page-header-title">${e.title}</h1>
              ${e.subtitle?r`
                <div class="dd-page-header-subtitle"><span>${e.subtitle}</span></div>
              `:n}
            </div>
          </div>
          ${e.actions?r`
            <div class="dd-page-header-actions ${e.wideActions?"is-content":""}">${e.actions}</div>
          `:n}
        </div>
      </header>
    `}_renderDeviceView(e){const i=this._selectedDomain;if(!i)return n;const t=e.get(i);if(!t)return n;const a=i===W?[...t.values()].map(e=>e.area):this._getVisibleSortedAreas().filter(e=>t.has(e.area_id));return r`
      <div class="device-view">
        ${this._renderDevicePageHeader({icon:this._typeIcon(i),title:this._typeName(i),subtitle:this._tp("common.entity",this._domainCount(t)),color:this._typeColor(i),back:!0})}

        ${a.map(e=>{const a=t.get(e.area_id);return r`
            <div class="domain-group">
              <div class="domain-header">
                <div class="domain-header-title">
                  <ha-icon icon="mdi:floor-plan"></ha-icon>
                  <span>${e.name}</span>
                </div>
              </div>
              <div class=${this._entitiesGridClass(i)}>
                ${$(a.entities,e=>e.entity_id,e=>this._renderEntityCard(e))}
              </div>
            </div>
          `})}
      </div>
    `}_renderEnergyView(e=this._energySummary()){const i=e.areas[0],t=this._energyBasisLabel(e),a="energy"===e.basis?this._energySourceStatisticsEntities(e):this._energyStatisticsEntities(e.areas.flatMap(e=>e.entities),8);return r`
      <div class="device-view energy-view">
        ${this._renderDevicePageHeader({icon:"mdi:flash",title:this._t("devices.energy"),subtitle:this._t("devices.live_power_usage"),color:this._typeColor(V),back:!0,wideActions:!0,actions:r`
            <div class="energy-header-total" title=${t}>
              <span>${e.formattedTotal}</span>
              <small>${"energy"===e.basis?this._t("devices.whole_house"):this._tp("devices.live_power_sensor",e.sensorCount)}</small>
            </div>
          `})}

        ${e.sensorCount?r`
              <div class="energy-overview-grid">
                <section class="energy-overview-card total">
                  <div class="energy-overview-head">
                    <span class="energy-overview-icon">
                      <ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon>
                    </span>
                    <div>
                      <h2>${this._t("devices.whole_house")}</h2>
                      <p>${t}</p>
                      ${"energy"===e.basis&&e.roomSensorCount?r`<p>${this._t("devices.power_measured_in_rooms",{value:c(e.roomTotalWatts)})}</p>`:n}
                    </div>
                    <strong>${e.formattedTotal}</strong>
                  </div>
                  ${this._renderEnergyStatisticsGraph(a,this._t("devices.whole_house_history"))}
                </section>

                ${i?r`
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
                `:n}
              </div>

              <div class="energy-areas-grid">
                ${$(e.areas,e=>e.areaId,e=>this._renderEnergyAreaCard(e))}
              </div>
            `:r`
              <div class="energy-empty">
                <ha-icon icon="mdi:flash-off-outline"></ha-icon>
                <h2>${this._t("devices.no_power_title")}</h2>
                <p>${this._t("devices.no_power_description")}</p>
              </div>
            `}
      </div>
    `}_renderEnergyAreaCard(e){const i=!e.areaId.startsWith("__");return r`
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
          ${$(e.entities,e=>e.entityId,i=>this._renderEnergyEntityRow(i,e.totalWatts))}
        </div>
      </section>
    `}_renderEnergyEntityMini(e,i){const t=this._energyEntityPercentage(e,i);return r`
      <button
        class="energy-entity-mini"
        type="button"
        style=${`--power-width: ${t}%`}
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        <span>${e.name}</span>
        <strong>${e.formatted}</strong>
      </button>
    `}_renderEnergyEntityRow(e,i){const t=this._energyEntityPercentage(e,i);return r`
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
    `}_energyEntityPercentage(e,i){return i<=0?0:Math.max(4,Math.min(100,Math.round(e.watts/i*100)))}_energyStatisticsEntities(e,i){return e.filter(e=>["measurement","total","total_increasing"].includes(e.stateClass||"")).sort((e,i)=>i.watts-e.watts).slice(0,i).map(e=>({entity:e.entityId,name:e.name}))}_energySourceStatisticsEntities(e){const i=new Set;return e.sources.filter(e=>{if(i.has(e.entityId))return!1;i.add(e.entityId);const t=String(this._hass?.states?.[e.entityId]?.attributes?.state_class||"");return["measurement","total","total_increasing"].includes(t)}).map(e=>({entity:e.entityId,name:e.name}))}_renderEnergyStatisticsGraph(e,i){if(!e.length)return n;const t={type:"statistics-graph",entities:e,days_to_show:1,period:"5minute",stat_types:["mean"],chart_type:"line",hide_legend:!0,fit_y_data:!0,min_y_axis:0};return r`
      <dwains-dashboard-next-card-host
        class="energy-statistics-card"
        aria-label=${i}
        .hass=${this._hass}
        .config=${t}
      ></dwains-dashboard-next-card-host>
    `}_renderMaintenanceView(e){const i=this._orderedMaintenanceBuckets(e);return r`
      <div class="device-view maintenance-view">
        ${this._renderDevicePageHeader({icon:"mdi:wrench",title:this._t("devices.maintenance"),subtitle:this._maintenanceSubtitle(e),color:this._typeColor(F),back:!0})}

        ${i.length?i.map(e=>r`
              <div class="maintenance-area-group">
                <button
                  class="maintenance-area-title"
                  type="button"
                  @click=${()=>this._navigateToArea(e.area.area_id)}
                  ?disabled=${e.area.area_id===H}
                >
                  <span>${e.area.name}</span>
                  <span>${e.items.length}</span>
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </button>
                <div class="maintenance-grid">
                  ${$(e.items,e=>e.entityId,e=>this._renderMaintenanceCard(e))}
                </div>
              </div>
            `):r`
              <div class="maintenance-empty">
                <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                <span>${this._t("devices.maintenance_empty")}</span>
              </div>
            `}
      </div>
    `}_orderedMaintenanceBuckets(e){const i=new Map(this._getVisibleSortedAreas().map((e,i)=>[e.area_id,i]));return[...e.values()].sort((e,t)=>{const a=i.get(e.area.area_id)??Number.MAX_SAFE_INTEGER,r=i.get(t.area.area_id)??Number.MAX_SAFE_INTEGER;return a!==r?a-r:e.area.name.localeCompare(t.area.name)})}_renderMaintenanceCard(e){return r`
      <button
        class="maintenance-card ${e.kind}"
        type="button"
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        <div class="maintenance-card-icon">
          <ha-icon icon=${e.icon}></ha-icon>
          ${"unavailable"===e.kind?r`<span class="maintenance-alert-dot">!</span>`:n}
        </div>
        <div class="maintenance-card-copy">
          <div class="maintenance-card-title">${e.name}</div>
          <div class="maintenance-card-state">${e.stateLabel}</div>
        </div>
      </button>
    `}_showMoreInfo(e){B(this,"hass-more-info",{entityId:e})}_navigateToArea(e){if(!e||e===H)return;const i=window.location.pathname.split("/")[1]||"lovelace",t=new URL(window.location.href);t.pathname=`/${i}/home`,t.searchParams.set("dd_area",e),t.searchParams.delete("dd_device"),window.history.pushState(null,"",t.toString());const a=new Event("location-changed",{bubbles:!0,composed:!0});a.detail={replace:!1},window.dispatchEvent(a)}_renderEntityCard(e){return this._hass.states[e.entity_id]?r`
      <div class="${this._entityWrapperClass(e.entity_id)}">
        <dwains-dashboard-next-card-host
          .hass=${this._hass}
          .config=${this._entityCardConfig(e.entity_id)}
        ></dwains-dashboard-next-card-host>
      </div>
    `:n}_entitiesGridClass(e){return["entities-grid","cover"===e?"cover-entities-grid":"","light"===e?"light-entities-grid":"","sensor"===e?"sensor-entities-grid":"","binary_sensor.motion"===e?"motion-entities-grid":"","todo"===e?"todo-entities-grid":""].filter(Boolean).join(" ")}_entityWrapperClass(e){const i=e.split(".")[0]||"",t=this._hass.states?.[e]?.attributes?.device_class;return["entity-card-wrapper",`${i}-entity-card`,"binary_sensor"===i&&["motion","occupancy","presence"].includes(String(t))?"motion-entity-card":""].filter(Boolean).join(" ")}_renderNewDevicesView(e){return r`
      <div class="device-view">
        ${this._renderDevicePageHeader({icon:"mdi:new-box",title:this._t("devices.new"),subtitle:this._t("devices.new_description",{hours:D}),color:this._typeColor(U),back:!0,actions:r`<span class="device-header-count">${e.length}</span>`})}
        <section class="recent-devices new-devices-view">
          <div class="recent-grid">
            ${e.length?e.map(e=>this._renderRecentDevice(e)):r`
                  <div class="recent-empty">
                    ${this._t("devices.new_empty",{hours:D})}
                  </div>
                `}
          </div>
        </section>
      </div>
    `}_newDevices(e=999){return this._hass&&b(this.config)?E(this._hass,this.config,e):[]}_canTrackDevices(){return Boolean(this._hass&&this.config&&!I(this._hass))}_scheduleDeviceTracking(){void 0===this._deviceTrackingTimer&&this._canTrackDevices()&&(this._deviceTrackingTimer=window.setTimeout(()=>{this._deviceTrackingTimer=void 0,this._ensureDeviceTracking()},500))}_ensureDeviceTracking(){if(!this._canTrackDevices())return;const e=C(this._hass,this.config);e&&(this.config={...this.config,device_admission:e},this.requestUpdate(),this._saveDeviceFirstSeen())}_renderRecentDevice(e){return r`
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
              ${e.domains.slice(0,4).map(e=>r`
                <span>${x(this._hass,e)}</span>
              `)}
            </div>
          </div>
        </div>
      </div>
    `}_getDashboardUrlPath(){const e=window.location.pathname.split("/")[1];if(e&&"lovelace"!==e)return e}_formatAddedAge(e){const i=Math.max(0,Date.now()-e),t=Math.floor(i/36e5);if(t<1)return this._t("devices.added_just_now");const a=new Intl.RelativeTimeFormat(j(this._hass),{numeric:"always"});return t<24?a.format(-t,"hour"):a.format(-Math.floor(t/24),"day")}async _saveDeviceFirstSeen(){const e=this._hass,i=this.config;if(i)try{await A(e,this._getDashboardUrlPath(),t=>{const a=t||{},r=C(e,{...i,device_admission:a.device_admission});return r?{...a,device_admission:r}:null})}catch(e){console.error("❌ Device visibility save failed:",e)}}};q.styles=[o`:host{display:block;height:calc(100dvh - var(--header-height,56px));min-height:0;overflow:hidden;-webkit-tap-highlight-color:transparent}button,.area-button,.recent-device,.restore-button{user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}.loading,.empty{display:flex;align-items:center;justify-content:center;padding:48px 16px;color:var(--secondary-text-color)}.layout-container{display:flex;height:100%;min-height:0;position:relative;overflow:hidden}.sidebar{width:250px;background:var(--card-background-color);border-right:1px solid var(--divider-color);display:flex;flex-direction:column;transition:transform 0.3s ease;z-index:1;overflow-y:auto}.sidebar-title{padding:16px 16px 4px;font-size:14px;font-weight:600;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px}.area-list{padding:8px}.area-button{--domain-color:var(--primary-color);display:flex;align-items:center;gap:12px;padding:16px;margin-bottom:8px;border-radius:16px;cursor:pointer;transition:all 0.3s ease;background:var(--secondary-background-color);border:none;width:100%;text-align:left;color:var(--primary-text-color);position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05)}.area-button:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.1)}.area-button.selected{background:var(--domain-color);color:var(--text-primary-color)}.area-button.new-devices{--domain-color:var(--primary-color);background:rgba(var(--rgb-primary-color,3,169,244),0.08);border:1px solid rgba(var(--rgb-primary-color,3,169,244),0.14)}.area-button.new-devices.selected{background:var(--domain-color);border-color:transparent;color:var(--text-primary-color)}.area-button.new-devices .area-icon{color:var(--primary-color);background:rgba(var(--rgb-primary-color,3,169,244),0.12)}.area-button.new-devices.selected .area-icon{background:rgba(255,255,255,0.2);color:var(--text-primary-color)}.area-icon{width:32px;height:32px;border-radius:50%;background:var(--secondary-background-color);color:var(--domain-color);display:flex;align-items:center;justify-content:center;flex-shrink:0}.area-button.selected .area-icon{background:rgba(255,255,255,0.2)}.area-info{flex:1;min-width:0}.area-name{font-weight:600;font-size:16px;margin-bottom:2px}.device-menu-subtitle{display:none;margin-top:3px;color:var(--secondary-text-color);font-size:12px;font-weight:500;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.device-menu-chevron{display:none;flex-shrink:0;color:var(--secondary-text-color);--mdc-icon-size:22px}.area-button.selected .device-menu-subtitle,.area-button.selected .device-menu-chevron{color:var(--text-primary-color);opacity:0.88}.domain-count{flex-shrink:0;min-width:24px;height:24px;padding:0 8px;border-radius:12px;background:color-mix(in srgb,var(--domain-color) 11%,var(--secondary-background-color));color:var(--domain-color);font-size:12px;font-weight:600;display:inline-flex;align-items:center;justify-content:center}.area-button.selected .domain-count{background:rgba(255,255,255,0.2);color:var(--text-primary-color)}.main-content{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden}.content-area{flex:1;min-height:0;overflow-y:auto;padding:16px;padding-bottom:var(--dd-next-bottom-nav-space,16px)}@media (max-width:768px){:host{height:auto;min-height:100%;overflow:visible}.layout-container{display:block;height:auto;min-height:100dvh;overflow:visible}.main-content{display:block;overflow:visible}.content-area{padding:0 10px calc(104px + env(safe-area-inset-bottom,0px));overflow:visible}.domain-header{align-items:flex-start;flex-direction:column}}.device-view{max-width:1400px;margin:0 auto}.device-header-count{min-width:40px;height:40px;padding:0 12px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:color-mix(in srgb,var(--domain-color) 14%,var(--card-background-color));color:color-mix(in srgb,var(--domain-color) 82%,var(--primary-text-color));font-size:15px;font-weight:750;font-variant-numeric:tabular-nums}.devices-overview-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}.devices-overview-card{--domain-color:var(--primary-color);min-height:148px;padding:16px;border:1px solid color-mix(in srgb,var(--domain-color) 15%,var(--divider-color));border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);box-shadow:0 16px 34px rgba(15,23,42,0.06);display:grid;grid-template-rows:auto 1fr auto;align-items:start;text-align:left;cursor:pointer;position:relative;overflow:hidden;transition:transform 0.18s ease,box-shadow 0.18s ease,border-color 0.18s ease;-webkit-tap-highlight-color:transparent}.devices-overview-card::after{content:"";position:absolute;left:16px;right:16px;bottom:0;height:3px;border-radius:999px 999px 0 0;background:color-mix(in srgb,var(--domain-color) 60%,transparent)}.devices-overview-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--domain-color) 32%,var(--divider-color));box-shadow:0 20px 42px rgba(15,23,42,0.1)}.overview-card-icon{width:46px;height:46px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--domain-color) 12%,transparent);color:var(--domain-color);position:relative}.overview-card-icon ha-icon{--mdc-icon-size:25px}.overview-card-count{position:absolute;right:-10px;top:-9px;min-width:22px;height:22px;padding:0 7px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:var(--domain-color);color:#fff;font-size:12px;font-weight:800;box-shadow:0 8px 18px color-mix(in srgb,var(--domain-color) 32%,transparent)}.overview-card-copy{align-self:end;display:grid;gap:3px;min-width:0}.overview-card-copy strong{color:var(--primary-text-color);font-size:18px;font-weight:800;line-height:1.05}.overview-card-copy small{color:var(--secondary-text-color);font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.overview-card-chevron{position:absolute;right:14px;top:14px;color:var(--secondary-text-color);--mdc-icon-size:22px}.recent-devices{margin-bottom:18px;padding:14px;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.new-devices-view{margin-bottom:0}.area-button.maintenance{--domain-color:var(--warning-color,#ff9800)}.recent-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.recent-title{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700}.recent-title ha-icon{--mdc-icon-size:20px;color:var(--primary-color)}.recent-count{min-width:22px;height:22px;padding:0 7px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:rgba(var(--rgb-primary-color,3,169,244),0.12);color:var(--primary-color);font-size:12px;font-weight:700}.recent-subtitle{margin-top:3px;color:var(--secondary-text-color);font-size:12px;line-height:1.4}.recent-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px}.recent-empty{grid-column:1 / -1;padding:24px;border:1px dashed var(--divider-color);border-radius:10px;color:var(--secondary-text-color);text-align:center;background:var(--primary-background-color);font-size:13px}.recent-device{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px;border:1px solid var(--divider-color);border-radius:10px;background:var(--primary-background-color)}.recent-device.is-hidden{opacity:0.72}.recent-device-main{display:flex;align-items:flex-start;gap:10px;min-width:0}.recent-device-icon{width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;background:var(--secondary-background-color);color:var(--primary-color)}.recent-device-icon ha-icon{--mdc-icon-size:19px}.recent-device-copy{min-width:0}.recent-device-name{font-weight:650;font-size:14px;color:var(--primary-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.recent-device-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:3px;color:var(--secondary-text-color);font-size:12px}.recent-domains{display:flex;flex-wrap:wrap;gap:4px;margin-top:7px}.recent-domains span{padding:2px 7px;border-radius:999px;background:var(--secondary-background-color);color:var(--secondary-text-color);font-size:11px}.maintenance-area-group{margin-bottom:18px}.maintenance-area-title{min-height:34px;margin:0 0 7px;padding:0 4px;border:0;display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--secondary-text-color);cursor:pointer;font:inherit;font-size:14px;font-weight:760}.maintenance-area-title:disabled{cursor:default}.maintenance-area-title span:first-child{color:var(--primary-text-color)}.maintenance-area-title span:nth-child(2){min-width:21px;height:21px;padding:0 7px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:var(--secondary-background-color);color:var(--secondary-text-color);font-size:11px;font-weight:850}.maintenance-area-title ha-icon{--mdc-icon-size:18px}.maintenance-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}.maintenance-card{min-height:56px;padding:10px 12px;border:1px solid var(--divider-color);border-radius:10px;display:grid;grid-template-columns:34px minmax(0,1fr);align-items:center;gap:10px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;text-align:left;font:inherit;box-shadow:0 8px 20px rgba(15,23,42,0.04);transition:border-color 0.18s ease,box-shadow 0.18s ease,transform 0.18s ease}.maintenance-card:hover{border-color:color-mix(in srgb,var(--domain-color) 26%,var(--divider-color));box-shadow:0 12px 26px rgba(15,23,42,0.08);transform:translateY(-1px)}.maintenance-card-icon{position:relative;width:34px;height:34px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;background:var(--secondary-background-color);color:var(--secondary-text-color)}.maintenance-card.battery .maintenance-card-icon{background:rgba(var(--rgb-warning-color,255,152,0),0.12);color:var(--warning-color,#ff9800)}.maintenance-card.unavailable .maintenance-card-icon{background:color-mix(in srgb,var(--secondary-text-color) 10%,var(--secondary-background-color));color:color-mix(in srgb,var(--secondary-text-color) 86%,var(--primary-text-color))}.maintenance-card-icon ha-icon{--mdc-icon-size:20px}.maintenance-alert-dot{position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:var(--warning-color,#ff9800);color:#ffffff;font-size:11px;font-weight:900;box-shadow:0 0 0 2px var(--card-background-color)}.maintenance-card-copy{min-width:0}.maintenance-card-title{color:var(--primary-text-color);font-size:14px;font-weight:750;line-height:1.16;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.maintenance-card-state{margin-top:2px;color:var(--secondary-text-color);font-size:12px;font-weight:550;line-height:1.2}.maintenance-empty{min-height:180px;border:1px dashed var(--divider-color);border-radius:12px;display:flex;align-items:center;justify-content:center;gap:8px;color:var(--secondary-text-color);background:var(--card-background-color)}.maintenance-empty ha-icon{--mdc-icon-size:22px;color:var(--success-color,#4caf50)}.area-button.energy{--domain-color:#d88e20}.energy-view{--domain-color:#d88e20}.energy-header-total{box-sizing:border-box;min-height:52px;padding:7px 14px;display:grid;align-content:center;justify-items:end;gap:2px;border-radius:14px;background:color-mix(in srgb,var(--domain-color) 13%,var(--card-background-color))}.energy-header-total span{color:var(--primary-text-color);font-size:22px;font-weight:800;line-height:1.05;font-variant-numeric:tabular-nums}.energy-header-total small,.energy-overview-head p,.energy-area-title small,.energy-area-total small,.energy-entity-copy small{color:var(--secondary-text-color);font-size:12px;font-weight:700;line-height:1.2}.energy-overview-grid{display:grid;grid-template-columns:repeat(2,minmax(260px,1fr));gap:12px;margin-bottom:14px}.energy-overview-card,.energy-area-card{border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);box-shadow:0 14px 30px rgba(15,23,42,0.05)}.energy-overview-card{padding:14px;overflow:hidden}.energy-overview-head{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:10px}.energy-overview-icon,.energy-area-icon,.energy-entity-icon{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;background:color-mix(in srgb,var(--domain-color) 12%,transparent);color:var(--domain-color)}.energy-overview-icon{width:42px;height:42px;border-radius:12px}.energy-overview-icon ha-icon{--mdc-icon-size:24px}.energy-overview-head h2{margin:0;color:var(--primary-text-color);font-size:15px;font-weight:850;line-height:1.1}.energy-overview-head p{margin:4px 0 0;overflow-wrap:anywhere}.energy-overview-head strong{color:var(--primary-text-color);font-size:22px;font-weight:950;white-space:nowrap}.energy-statistics-card{display:block;min-height:150px;margin-top:12px;border-radius:12px;overflow:hidden;background:color-mix(in srgb,var(--domain-color) 4%,transparent);--ha-card-background:transparent;--ha-card-box-shadow:none;--ha-card-border-width:0;--ha-card-border-radius:12px}.energy-top-entities{margin-top:12px;display:grid;gap:7px}.energy-entity-mini{min-height:30px;padding:0 9px;border:0;border-radius:9px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;background:linear-gradient(90deg,color-mix(in srgb,var(--domain-color) 16%,transparent) 0 var(--power-width),var(--secondary-background-color) var(--power-width) 100%);color:var(--primary-text-color);cursor:pointer;text-align:left;font:inherit;font-size:12px;font-weight:800}.energy-entity-mini span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.energy-entity-mini strong{font-size:12px;font-weight:900;white-space:nowrap}.energy-areas-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:12px}.energy-area-card{padding:14px;overflow:hidden}.energy-area-head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px}.energy-area-title{min-width:0;padding:0;border:0;display:inline-flex;align-items:center;gap:10px;background:transparent;color:var(--primary-text-color);cursor:pointer;text-align:left;font:inherit}.energy-area-title:disabled{cursor:default}.energy-area-icon{width:40px;height:40px;border-radius:12px}.energy-area-icon ha-icon{--mdc-icon-size:22px}.energy-area-title strong{display:block;overflow:hidden;color:var(--primary-text-color);font-size:16px;font-weight:900;line-height:1.12;text-overflow:ellipsis;white-space:nowrap}.energy-area-title small{display:block;margin-top:3px}.energy-area-total{display:grid;justify-items:end;gap:2px}.energy-area-total span{color:var(--primary-text-color);font-size:20px;font-weight:950;line-height:1;white-space:nowrap}.energy-entity-list{display:grid;gap:8px;margin-top:12px}.energy-entity-row{min-height:58px;padding:9px 10px;border:1px solid var(--divider-color);border-radius:10px;display:grid;grid-template-columns:36px minmax(0,1fr) auto;align-items:center;gap:10px;background:var(--primary-background-color);color:var(--primary-text-color);cursor:pointer;text-align:left;font:inherit;transition:border-color 0.16s ease,transform 0.16s ease,box-shadow 0.16s ease}.energy-entity-row:hover{border-color:color-mix(in srgb,var(--domain-color) 26%,var(--divider-color));box-shadow:0 12px 22px rgba(15,23,42,0.08);transform:translateY(-1px)}.energy-entity-icon{width:36px;height:36px;border-radius:10px}.energy-entity-icon ha-icon{--mdc-icon-size:20px}.energy-entity-copy{min-width:0;display:grid;gap:3px}.energy-entity-copy strong{overflow:hidden;color:var(--primary-text-color);font-size:13px;font-weight:850;line-height:1.1;text-overflow:ellipsis;white-space:nowrap}.energy-entity-bar{position:relative;height:5px;overflow:hidden;border-radius:999px;background:color-mix(in srgb,var(--domain-color) 10%,var(--secondary-background-color))}.energy-entity-bar span{position:absolute;inset:0 auto 0 0;width:var(--power-width,0%);min-width:4px;border-radius:inherit;background:linear-gradient(90deg,var(--domain-color),#f5c85b)}.energy-entity-value{color:var(--primary-text-color);font-size:13px;font-weight:900;white-space:nowrap}.energy-empty{min-height:280px;padding:32px;border:1px dashed var(--divider-color);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:var(--card-background-color);color:var(--secondary-text-color);text-align:center}.energy-empty ha-icon{--mdc-icon-size:34px;color:var(--domain-color)}.energy-empty h2{margin:4px 0 0;color:var(--primary-text-color);font-size:18px;font-weight:850}.energy-empty p{max-width:430px;margin:0;font-size:13px;line-height:1.45}.domain-group{background:var(--card-background-color);border-radius:12px;padding:16px;margin-bottom:16px}.domain-header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;font-size:16px;font-weight:500}.domain-header-title{display:inline-flex;align-items:center;gap:8px;min-width:0}.domain-header ha-icon{--mdc-icon-size:20px;opacity:0.8}.entities-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}.entities-grid.cover-entities-grid{grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:12px}.entities-grid.light-entities-grid{grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}.entities-grid.sensor-entities-grid{grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.entities-grid.motion-entities-grid{grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}.entities-grid.todo-entities-grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),760px));align-items:start}.entity-card-wrapper{min-height:60px;position:relative}.cover-entity-card{min-height:72px}.light-entity-card{min-height:72px}.sensor-entity-card{min-height:150px}.motion-entity-card{min-height:72px}.cover-entity-card dwains-dashboard-next-card-host,.light-entity-card dwains-dashboard-next-card-host,.sensor-entity-card dwains-dashboard-next-card-host,.motion-entity-card dwains-dashboard-next-card-host{display:block}@media (max-width:768px){.layout-container>.sidebar,.sidebar{position:fixed !important;left:18px !important;right:18px !important;top:auto !important;bottom:calc(82px + env(safe-area-inset-bottom,0px)) !important;width:auto !important;height:auto !important;max-height:min(62vh,520px);padding:10px;overflow-y:auto;border-radius:8px;border:1px solid rgba(0,0,0,0.08);background:rgba(255,255,255,0.94);box-shadow:0 22px 48px rgba(0,0,0,0.24);backdrop-filter:blur(20px);transform:translate3d(0,calc(100% + 140px),0) !important;transition:transform 0.28s cubic-bezier(0.2,0.8,0.2,1);z-index:121}.layout-container>.sidebar.open,.sidebar.open{transform:translate3d(0,0,0) !important}.sidebar::before{content:"";width:42px;height:4px;margin:0 auto 10px;display:block;border-radius:999px;background:rgba(0,0,0,0.14)}.mobile-nav-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);backdrop-filter:blur(2px);z-index:120;opacity:0;pointer-events:none;transition:opacity 0.3s ease}.mobile-nav-overlay.open{opacity:1;pointer-events:auto}.sidebar-title{padding:4px 8px 12px;font-size:16px;letter-spacing:0;text-transform:none}.sidebar .area-list{display:grid;gap:8px;padding:0}.sidebar .area-button{display:grid;grid-template-columns:48px minmax(0,1fr) auto;align-items:center;gap:12px;min-height:70px;height:auto;margin-bottom:0;padding:10px 12px;border-radius:8px;border:1px solid rgba(15,23,42,0.06);background:rgba(255,255,255,0.92);color:var(--primary-text-color);box-shadow:0 10px 22px rgba(15,23,42,0.06);transform:none}.sidebar .area-button:hover{transform:translateY(-1px);box-shadow:0 12px 24px rgba(15,23,42,0.09)}.sidebar .area-button.selected{background:rgba(255,255,255,0.98);border-color:color-mix(in srgb,var(--domain-color) 34%,transparent);color:var(--primary-text-color);box-shadow:0 14px 28px rgba(15,23,42,0.1),inset 3px 0 0 var(--domain-color);transform:none}.sidebar .area-icon{width:46px;height:46px;border-radius:8px;background:color-mix(in srgb,var(--domain-color) 10%,transparent);color:var(--domain-color)}.sidebar .area-icon ha-icon{--mdc-icon-size:25px}.sidebar .area-button.selected .area-icon{background:color-mix(in srgb,var(--domain-color) 14%,transparent);color:var(--domain-color)}.sidebar .area-name{margin:0;font-size:15px;font-weight:750;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sidebar .device-menu-subtitle,.sidebar .device-menu-chevron{display:block}.sidebar .area-button.selected .device-menu-subtitle,.sidebar .area-button.selected .device-menu-chevron{color:var(--secondary-text-color);opacity:1}.sidebar .device-menu-chevron{color:rgba(15,23,42,0.52);transition:transform 0.18s ease,color 0.18s ease}.sidebar .area-button.selected .device-menu-chevron{color:var(--domain-color);transform:translateX(2px)}.sidebar .domain-count{display:none}:host([data-theme-dark]){.layout-container>.sidebar,.sidebar{border-color:rgba(255,255,255,0.1);background:linear-gradient(180deg,rgba(37,40,48,0.96),rgba(18,20,25,0.94)),color-mix(in srgb,var(--card-background-color) 92%,#000000);box-shadow:0 24px 58px rgba(0,0,0,0.58),inset 0 1px 0 rgba(255,255,255,0.06);color:var(--primary-text-color)}.sidebar::before{background:rgba(255,255,255,0.18)}.sidebar-title{color:color-mix(in srgb,var(--primary-text-color) 60%,transparent)}.sidebar .area-button{border-color:rgba(255,255,255,0.06);background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 86%,#ffffff 4%),color-mix(in srgb,var(--card-background-color) 96%,#000000 4%));color:var(--primary-text-color);box-shadow:0 10px 22px rgba(0,0,0,0.24),inset 0 1px 0 rgba(255,255,255,0.035)}.sidebar .area-button:hover{box-shadow:0 12px 26px rgba(0,0,0,0.32),inset 0 1px 0 rgba(255,255,255,0.05)}.sidebar .area-button.selected{border-color:color-mix(in srgb,var(--domain-color) 42%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 90%,var(--domain-color) 12%),color-mix(in srgb,var(--card-background-color) 96%,#000000 5%));color:var(--primary-text-color);box-shadow:0 14px 30px rgba(0,0,0,0.36),inset 3px 0 0 var(--domain-color),inset 0 1px 0 rgba(255,255,255,0.06)}.sidebar .area-button.new-devices{background:color-mix(in srgb,var(--primary-color) 16%,var(--card-background-color));border-color:color-mix(in srgb,var(--primary-color) 24%,transparent)}.sidebar .area-icon{background:color-mix(in srgb,var(--domain-color) 20%,transparent);color:var(--domain-color)}.sidebar .area-button.selected .area-icon,.sidebar .area-button.new-devices.selected .area-icon{background:color-mix(in srgb,var(--domain-color) 24%,transparent);color:var(--domain-color)}.sidebar .device-menu-subtitle,.sidebar .device-menu-chevron,.sidebar .area-button.selected .device-menu-subtitle,.sidebar .area-button.selected .device-menu-chevron{color:color-mix(in srgb,var(--primary-text-color) 62%,transparent)}.sidebar .area-button.selected .device-menu-chevron{color:var(--domain-color)}.mobile-nav-overlay{background:rgba(0,0,0,0.58);backdrop-filter:blur(4px)}}.entities-grid{grid-template-columns:1fr}.entities-grid.cover-entities-grid{grid-template-columns:1fr}.entities-grid.light-entities-grid{grid-template-columns:1fr}.entities-grid.sensor-entities-grid,.entities-grid.motion-entities-grid{grid-template-columns:1fr}.devices-overview-view{padding:2px 0}.devices-overview-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.devices-overview-card{min-height:128px;padding:14px;border-radius:8px}.overview-card-icon{width:42px;height:42px}.overview-card-copy strong{font-size:16px;overflow-wrap:anywhere}.overview-card-copy small{white-space:normal;line-height:1.2}.recent-header,.recent-device{align-items:stretch;grid-template-columns:1fr}.recent-header{flex-direction:column}.maintenance-grid{grid-template-columns:1fr}.maintenance-card{min-height:62px}.energy-header-total{justify-items:start}.energy-overview-grid,.energy-areas-grid{grid-template-columns:1fr}.energy-overview-head,.energy-area-head{grid-template-columns:40px minmax(0,1fr)}.energy-overview-head strong,.energy-area-total{grid-column:1 / -1;justify-self:stretch;justify-items:start;margin-top:4px}.energy-area-card,.energy-overview-card{border-radius:10px}.energy-entity-row{grid-template-columns:36px minmax(0,1fr)}.energy-entity-value{grid-column:2;justify-self:start}}`,l],e([i()],q.prototype,"_selectedDomain",void 0),e([i()],q.prototype,"_isMobile",void 0),e([i()],q.prototype,"_mobileNavOpen",void 0),q=e([t("dwains-dashboard-next-devices-card")],q);export{q as DwainsDevicesCard};
