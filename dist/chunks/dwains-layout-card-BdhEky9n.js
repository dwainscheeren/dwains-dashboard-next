import{_ as e,n as t,r as a,t as o}from"./state-Bpx-nWN3.js";import{E as r,a as i,i as n,D as s,A as c,b as d,r as l}from"./lit-element-CR7MDbd3.js";import{e as p}from"./dd-entity-tiles-DtrIZD2Q.js";import{j as m,m as h,s as g,l as b,i as x,v as u,c as f,b as v,o as w,g as y,d as _,A as k,a as z,n as $,F as S,f as C,e as E}from"./entity-names-meQBK86K.js";import{e as A,i as M,t as D}from"./blueprints-YXvSQBN2.js";import{a as j,f as T,n as P,e as I,i as H}from"./dwains-bottom-nav-B-EDhuvw.js";import{g as q,d as R,b as N,a as L,r as F}from"./index-DgstH61k.js";import{i as O,g as W,a as V,c as U,b as G,n as B,d as Y,e as K,f as X,r as Q,h as J,H as Z,s as ee,m as te,j as ae,k as oe,l as re,p as ie,o as ne,q as se}from"./dwains-dashboard-strategy-editor-BIiUlG7z.js";import{ad as ce,ae as de,af as le,ag as pe,ah as me,ai as he,aj as ge,y as be}from"./screensaver-media-clrApohy.js";import{f as xe}from"./fire-event-DQiSssdY.js";import"./dd-card-host-C87xsXhx.js";const ue="important",fe=" !"+ue,ve=A(class extends M{constructor(e){if(super(e),e.type!==D.ATTRIBUTE||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,a)=>{const o=e[a];return null==o?t:t+`${a=a.includes("-")?a:a.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(e,[t]){const{style:a}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?a.removeProperty(e):a[e]=null);for(const e in t){const o=t[e];if(null!=o){this.ft.add(e);const t="string"==typeof o&&o.endsWith(fe);e.includes("-")||t?a.setProperty(e,t?o.slice(0,-11):o,t?ue:""):a[e]=o}}return r}});var we=Number.isNaN||function(e){return"number"==typeof e&&e!=e};function ye(e,t){return e===t||!(!we(e)||!we(t))}function _e(e,t){if(e.length!==t.length)return!1;for(var a=0;a<e.length;a++)if(!ye(e[a],t[a]))return!1;return!0}const ke=new Map,ze=(e,t,a,o)=>!!o?.areas_options?.[a]?.groups_options?.[t]?.hidden&&o.areas_options[a].groups_options[t].hidden.includes(e),$e=(e,t,a,o)=>{const r=((e,t,a,o)=>{const r=ke.get(e.area_id);if(!r)return;const i=t.areas?.[e.area_id];if(r.area!==e||r.areaEntities!==a||r.areaRegistry!==i||r.formatEntityState!==t.formatEntityState||r.registry!==q(t)||r.areasOptions!==o?.areas_options||r.temperatureState!==(i?.temperature_entity_id?t.states[i.temperature_entity_id]:void 0)||r.humidityState!==(i?.humidity_entity_id?t.states[i.humidity_entity_id]:void 0))return;if(r.checkedStates===t.states)return r.data;const n=r.entityStates;if(n.length===a.length){for(let e=0;e<a.length;e++)if(n[e]!==t.states[a[e].entity_id])return;return r.checkedStates=t.states,r.data}})(e,t,a,o);if(r)return r;let i,n,s,c;const d=t.areas[e.area_id],l=d?.temperature_entity_id,p=d?.humidity_entity_id;if(l){const e=t.states[l];e&&"unavailable"!==e.state&&"unknown"!==e.state&&(i=j(t,e))}if(p){const e=t.states[p];e&&"unavailable"!==e.state&&"unknown"!==e.state&&(n=j(t,e))}let m=0,h=!1;a.forEach(a=>{const r=t.states[a.entity_id];if(!r)return;const i=Se(a.entity_id);if(!ze(a.entity_id,i,e.area_id,o)&&a.entity_id.startsWith("sensor.")&&"W"===r.attributes.unit_of_measurement&&"unavailable"!==r.state&&"unknown"!==r.state){const e=parseFloat(r.state);isNaN(e)||(m+=e,h=!0)}}),h&&(s=m>=1e3?T((m/1e3).toFixed(1),"kW"):T(Math.round(m),"W"));let g=0,b=!1;a.forEach(a=>{const r=t.states[a.entity_id];if(!r)return;const i=Se(a.entity_id);if(!ze(a.entity_id,i,e.area_id,o)&&a.entity_id.startsWith("sensor.")&&"kWh"===r.attributes.unit_of_measurement&&"unavailable"!==r.state&&"unknown"!==r.state){const e=parseFloat(r.state);isNaN(e)||(g+=e,b=!0)}}),b&&(c=g>=1e3?T((g/1e3).toFixed(1),"MWh"):T(g.toFixed(1),"kWh"));const x=[],u={light:{total:0,on:0},switch:{total:0,on:0},fan:{total:0,on:0},cover:{total:0,on:0},climate:{total:0,on:0},media_player:{total:0,on:0},lock:{total:0,on:0},motion:{total:0,on:0}};a.forEach(a=>{const r=t.states[a.entity_id];if(!r)return;const i=Se(a.entity_id);if(!ze(a.entity_id,i,e.area_id,o)){if(i in u){const e=u[i];if(!e)return;e.total++;const t="off"!==r.state&&"unavailable"!==r.state&&"unknown"!==r.state&&"closed"!==r.state&&"locked"!==r.state;"climate"===i?r.attributes.hvac_action&&"idle"!==r.attributes.hvac_action&&"off"!==r.attributes.hvac_action?e.on++:r.attributes.hvac_action||"off"===r.state||e.on++:t&&e.on++}if(a.entity_id.startsWith("binary_sensor.")&&"motion"===r.attributes.device_class){const e=u.motion;e&&(e.total++,"on"===r.state&&e.on++)}if(a.entity_id.startsWith("binary_sensor.")&&"on"===r.state&&r.attributes.device_class){["door","window","moisture","smoke"].includes(r.attributes.device_class)&&x.push({entity_id:a.entity_id,deviceClass:r.attributes.device_class})}}});const f={area_id:e.area_id,name:e.name,icon:e.icon||void 0,picture:e.picture||void 0,temperature:i,humidity:n,wattage:s,totalEnergy:c,alerts:x,domains:u};return ke.set(e.area_id,{area:e,areaEntities:a,entityStates:a.map(e=>t.states[e.entity_id]),areaRegistry:d,temperatureState:l?t.states[l]:void 0,humidityState:p?t.states[p]:void 0,formatEntityState:t.formatEntityState,registry:q(t),areasOptions:o?.areas_options,checkedStates:t.states,data:f}),f},Se=e=>{const[t]=e.split(".");return t||"unknown"},Ce={min:7,max:35},Ee={min:45,max:95},Ae=new Set(["unavailable","unknown"]),Me=1e-9;function De(e){if(null==e||""===e||"boolean"==typeof e)return;const t="number"==typeof e?e:Number(e);return Number.isFinite(t)?t:void 0}function je(e){return/f$/i.test(String(e||"").trim())}function Te(e,t){const a=De(e?.target_temp_step);return void 0!==a&&a>0?a:je(t)?1:.5}function Pe(e){if(!Number.isFinite(e)||e<=0)return 1;for(let t=0;t<3;t++){const a=e*10**t;if(Math.abs(a-Math.round(a))<Me*10**t)return t}return 3}function Ie(e,t,a){return t<=a?Math.min(a,Math.max(t,e)):e}function He(e,t,a){const{step:o,min:r,max:i}=a;if(!(o>0))return Ie(e,r,i);const n=e/o,s=t>0?Math.floor(n+Me):Math.ceil(n-Me);return Ie(Number(((s+t)*o).toFixed(Pe(o))),r,i)}function qe(e,t,a){return He(e,t,a)!==e}function Re(e,t,a,o){if(!(o.step>0)||t<e)return{low:e,high:t};const r=a>0?o.max-t:e-o.min,i=Math.max(0,Math.min(o.step,r))*a;if(Math.abs(i)<Me)return{low:e,high:t};const n=Pe(o.step);return{low:Number((e+i).toFixed(n)),high:Number((t+i).toFixed(n))}}function Ne(e,t,a,o){const r=Re(e,t,a,o);return r.low!==e||r.high!==t}function Le(e,t){if(!e||Ae.has(String(e.state)))return;const a=e.attributes||{},o=je(t)?Ee:Ce;let r=De(a.min_temp)??o.min,i=De(a.max_temp)??o.max;r>i&&([r,i]=[i,r]);const n=De(a.temperature),s=De(a.target_temp_low),c=De(a.target_temp_high),d=void 0!==s&&void 0!==c;let l="none";return"off"!==e.state&&(!d||"heat_cool"!==e.state&&void 0!==n?void 0!==n&&(l="single"):l="range"),{mode:l,current:De(a.current_temperature),target:n,targetLow:s,targetHigh:c,min:r,max:i,step:Te(a,t),unit:t}}const Fe=new Map;function Oe(e,t,a){const o=`${a||""}|${t}`;let r=Fe.get(o);if(!r){try{r=new Intl.NumberFormat(a||void 0,{minimumFractionDigits:t,maximumFractionDigits:t})}catch{r=new Intl.NumberFormat(void 0,{minimumFractionDigits:t,maximumFractionDigits:t})}Fe.set(o,r)}return r.format(e)}const We={heat:"mdi:fire",cool:"mdi:snowflake",heat_cool:"mdi:sun-snowflake-variant",auto:"mdi:thermostat-auto",dry:"mdi:water-percent",fan_only:"mdi:fan",off:"mdi:power"};let Ve=class extends n{constructor(){super(...arguments),this.entityId="",this.roomName="",this.compactVertical=!1,this._modeMenuOpen=!1,this._openMoreInfo=()=>{this._modeMenuOpen?this._closeModeMenu():this.entityId&&xe(this,"hass-more-info",{entityId:this.entityId})},this._handleThermostatKeydown=e=>{e.target===e.currentTarget&&("Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openMoreInfo()))},this._closeModeMenu=()=>{this._modeMenuOpen=!1,this._modeMenuPortal&&(s(c,this._modeMenuPortal),this._modeMenuPortal.remove(),this._modeMenuPortal=void 0)}}_t(e,t){return R(this.hass,e,t)}disconnectedCallback(){super.disconnectedCallback(),this._flushCommit(),this._clearConfirmTimer(),this._closeModeMenu()}willUpdate(e){super.willUpdate(e),e.has("entityId")&&this._pendingEntityId&&this._pendingEntityId!==this.entityId&&this._flushCommit(),e.has("hass")&&this._clearPendingWhenConfirmed()}_unit(){return String(this.hass?.config?.unit_system?.temperature||"°C")}_stateObj(){return this.entityId?this.hass?.states?.[this.entityId]:void 0}_displayTarget(e){return void 0!==this._pendingTarget&&this._pendingEntityId===this.entityId?this._pendingTarget:e.target}_displayRange(e){return this._pendingRange&&this._pendingEntityId===this.entityId?this._pendingRange:void 0!==e.targetLow&&void 0!==e.targetHigh?{low:e.targetLow,high:e.targetHigh}:void 0}_formatValue(e,t,a){return`${Oe(e,t,N(this.hass))} ${a}`}_activityLabel(e){try{return e.attributes?.hvac_action?this.hass?.formatEntityAttributeValue?.(e,"hvac_action")||String(e.attributes.hvac_action):this.hass?.formatEntityState?.(e)||e.state}catch{return String(e.attributes?.hvac_action||e.state)}}_adjust(e){const t=Le(this._stateObj(),this._unit());if("single"!==t?.mode)return;const a=this._displayTarget(t);if(void 0===a)return;const o=He(a,e,t);o!==a&&(this._pendingTarget=o,this._pendingRange=void 0,this._pendingEntityId=this.entityId,this._clearConfirmTimer(),void 0!==this._commitTimer&&window.clearTimeout(this._commitTimer),this._commitTimer=window.setTimeout(()=>{this._commitTimer=void 0,this._commit()},800))}_adjustRange(e){const t=Le(this._stateObj(),this._unit());if("range"!==t?.mode)return;const a=this._displayRange(t);if(!a)return;const o=Re(a.low,a.high,e,t);o.low===a.low&&o.high===a.high||(this._pendingRange=o,this._pendingTarget=void 0,this._pendingEntityId=this.entityId,this._clearConfirmTimer(),void 0!==this._commitTimer&&window.clearTimeout(this._commitTimer),this._commitTimer=window.setTimeout(()=>{this._commitTimer=void 0,this._commit()},800))}_flushCommit(){void 0!==this._commitTimer&&(window.clearTimeout(this._commitTimer),this._commitTimer=void 0,this._commit())}async _commit(){const e=this._pendingEntityId,t=this._pendingTarget,a=this._pendingRange,o=this.hass;if(e&&o&&(void 0!==t||a)){try{a?await o.callService("climate","set_temperature",{entity_id:e,target_temp_low:a.low,target_temp_high:a.high}):await o.callService("climate","set_temperature",{entity_id:e,temperature:t})}catch(t){return console.warn(`Failed to set the temperature of ${e}:`,t),this._pendingEntityId===e&&void 0===this._commitTimer&&this._clearPending(),void xe(this,"hass-notification",{message:this._t("thermostat.update_failed",{name:this.roomName||e})})}this._pendingEntityId===e&&void 0===this._commitTimer&&(this._clearPendingWhenConfirmed(),this._pendingEntityId===e&&(this._clearConfirmTimer(),this._confirmTimer=window.setTimeout(()=>{this._confirmTimer=void 0,this._pendingEntityId===e&&this._clearPending()},8e3)))}}_clearPendingWhenConfirmed(){if(void 0!==this._commitTimer||!this._pendingEntityId)return;const e=this.hass?.states?.[this._pendingEntityId]?.attributes;if(e){if(this._pendingRange){const t=Number(e.target_temp_low),a=Number(e.target_temp_high);return void(Number.isFinite(t)&&Number.isFinite(a)&&Math.abs(t-this._pendingRange.low)<1e-6&&Math.abs(a-this._pendingRange.high)<1e-6&&this._clearPending())}if(void 0!==this._pendingTarget){const t=Number(e.temperature);Number.isFinite(t)&&Math.abs(t-this._pendingTarget)<1e-6&&this._clearPending()}}}_clearPending(){this._pendingTarget=void 0,this._pendingRange=void 0,this._pendingEntityId=void 0,this._clearConfirmTimer()}_clearConfirmTimer(){void 0!==this._confirmTimer&&(window.clearTimeout(this._confirmTimer),this._confirmTimer=void 0)}_handleStepClick(e,t){e.stopPropagation(),this._adjust(t)}_supportedModes(e){return Array.isArray(e.attributes?.hvac_modes)?e.attributes.hvac_modes.map(e=>String(e)):[]}_modeLabel(e,t){try{return this.hass?.formatEntityState?.({...e,state:t})||t}catch{return t.split("_").join(" ")}}_toggleModeMenu(e){if(e.stopPropagation(),this._modeMenuOpen)return void this._closeModeMenu();const t=e.currentTarget,a=this._stateObj();if(!t||!a)return;const o=this._supportedModes(a);if(!o.length)return;const r=String(a.state||"").toLowerCase(),i=document.createElement("div");i.className="dd-next-hvac-mode-portal",i.style.cssText=["position:fixed","z-index:10000","visibility:hidden","min-width:176px","max-width:calc(100vw - 16px)","box-sizing:border-box"].join(";"),s(d`
      <style>
        .dd-next-hvac-mode-menu {
          box-sizing: border-box;
          min-width: 176px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          border-radius: 12px;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color, #111);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
          font: inherit;
        }
        .dd-next-hvac-mode-item {
          min-height: 38px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: inherit;
          font: inherit;
          white-space: nowrap;
          text-align: left;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .dd-next-hvac-mode-item.active {
          background: color-mix(in srgb, var(--primary-color) 10%, transparent);
          color: var(--primary-color);
          font-weight: 600;
        }
        .dd-next-hvac-mode-item ha-icon {
          --mdc-icon-size: 20px;
        }
      </style>
      <div class="dd-next-hvac-mode-menu" role="menu" @click=${e=>e.stopPropagation()}>
        ${o.map(e=>d`
          <button
            class="dd-next-hvac-mode-item ${e===r?"active":""}"
            type="button"
            role="menuitemradio"
            aria-checked=${e===r?"true":"false"}
            @click=${t=>this._setHvacMode(t,e)}
          >
            <ha-icon icon=${We[e]||"mdi:thermostat"}></ha-icon>
            <span>${this._modeLabel(a,e)}</span>
          </button>
        `)}
      </div>
    `,i),document.body.appendChild(i);const n=t.getBoundingClientRect(),c=i.getBoundingClientRect(),l=Math.min(Math.max(8,n.left),Math.max(8,window.innerWidth-c.width-8)),p=n.bottom+8,m=p+c.height<=window.innerHeight-8?p:Math.max(8,n.top-c.height-8);i.style.left=`${l}px`,i.style.top=`${m}px`,i.style.visibility="visible",this._modeMenuPortal=i,this._modeMenuOpen=!0}async _setHvacMode(e,t){if(e.stopPropagation(),this._closeModeMenu(),this.hass&&this.entityId&&t!==this._stateObj()?.state)try{await this.hass.callService("climate","set_hvac_mode",{entity_id:this.entityId,hvac_mode:t})}catch(e){console.warn(`Failed to set HVAC mode of ${this.entityId}:`,e),xe(this,"hass-notification",{message:this._t("thermostat.update_failed",{name:this.roomName||this.entityId})})}}_handleRangeStepClick(e,t){e.stopPropagation(),this._adjustRange(t)}_icon(e){return d`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d=${e}></path></svg>`}render(){const e=this._stateObj(),t=Le(e,this._unit());if(!e||!t)return c;const a=this.roomName||e.attributes?.friendly_name||this.entityId,o=function(e){const t=String(e?.attributes?.hvac_action??"").toLowerCase(),a=String(e?.state??"").toLowerCase();switch(t||a){case"heating":case"preheating":case"defrosting":case"heat":return"heat";case"cooling":case"cool":return"cool";case"drying":case"dry":return"dry";case"fan":case"fan_only":return"fan";case"heat_cool":case"auto":return"auto";case"off":return"off";default:return"idle"}}(e),r=this._activityLabel(e),i=Pe(t.step),n=this._displayTarget(t),s=this._displayRange(t),l=this._t("thermostat.details",{name:a,state:r}),p=String(e.state||"").toLowerCase(),m=this._modeLabel(e,p),h=We[p]||"mdi:thermostat";return d`
      <div
        class="thermostat activity-${o} ${this.compactVertical?"compact-vertical":""}"
        role="button"
        tabindex="0"
        title=${l}
        aria-label=${l}
        @click=${this._openMoreInfo}
        @keydown=${this._handleThermostatKeydown}
      >
        <div class="mode-control">
          <button
            class="type-icon"
            type="button"
            title=${m}
            aria-label=${m}
            aria-haspopup="menu"
            aria-expanded=${this._modeMenuOpen?"true":"false"}
            @click=${this._toggleModeMenu}
          >
            <ha-icon icon=${h}></ha-icon>
          </button>

        </div>

        ${"single"===t.mode&&void 0!==n?d`
          <div class="target" role="group" aria-label=${this._t("thermostat.target_label",{name:a})}>
            <span class="copy target-copy">
              <span class="label">${this._t("thermostat.target")}</span>
              <span class="value" aria-live="polite">${this._formatValue(n,i,t.unit)}</span>
            </span>
            <button
              class="step"
              type="button"
              title=${this._t("thermostat.lower",{name:a})}
              aria-label=${this._t("thermostat.lower",{name:a})}
              ?disabled=${!qe(n,-1,t)}
              @click=${e=>this._handleStepClick(e,-1)}
            >
              ${this._icon(ce)}
            </button>
            <button
              class="step"
              type="button"
              title=${this._t("thermostat.raise",{name:a})}
              aria-label=${this._t("thermostat.raise",{name:a})}
              ?disabled=${!qe(n,1,t)}
              @click=${e=>this._handleStepClick(e,1)}
            >
              ${this._icon(de)}
            </button>
          </div>
        `:"range"===t.mode&&s?d`
          <div class="target" role="group" aria-label=${this._t("thermostat.target_label",{name:a})}>
            <span class="copy target-copy range-copy">
              <span class="label">${this._t("thermostat.target")}</span>
              <span class="value" aria-live="polite">
                ${Oe(s.low,i,N(this.hass))}
                –
                ${this._formatValue(s.high,i,t.unit)}
              </span>
            </span>
            <button
              class="step"
              type="button"
              title=${this._t("thermostat.lower",{name:a})}
              aria-label=${this._t("thermostat.lower",{name:a})}
              ?disabled=${!Ne(s.low,s.high,-1,t)}
              @click=${e=>this._handleRangeStepClick(e,-1)}
            >
              ${this._icon(ce)}
            </button>
            <button
              class="step"
              type="button"
              title=${this._t("thermostat.raise",{name:a})}
              aria-label=${this._t("thermostat.raise",{name:a})}
              ?disabled=${!Ne(s.low,s.high,1,t)}
              @click=${e=>this._handleRangeStepClick(e,1)}
            >
              ${this._icon(de)}
            </button>
          </div>
        `:d`
          <div class="target mode-only">
            <span class="copy target-copy">
              <span class="label">${this._t("thermostat.target")}</span>
              <span class="value">${m}</span>
            </span>
          </div>
        `}
      </div>
    `}};Ve.styles=i`:host{display:inline-block;min-width:0;-webkit-tap-highlight-color:transparent}.thermostat{--thermostat-color:var(--secondary-text-color,#6b7280);--tile-text:var(--ph-text,var(--primary-text-color));--tile-muted:var(--ph-muted,var(--secondary-text-color));box-sizing:border-box;min-height:52px;padding:6px;display:inline-flex;align-items:center;gap:5px;width:max-content;max-width:100%;min-width:0;border-radius:14px;background:var(--ph-control,color-mix(in srgb,var(--primary-text-color) 6%,transparent));color:var(--tile-text);backdrop-filter:blur(16px) saturate(1.3);-webkit-backdrop-filter:blur(16px) saturate(1.3);cursor:pointer;overflow:visible;transition:background-color 0.18s ease,transform 0.12s ease}.thermostat:hover{background:var(--ph-control-hover,color-mix(in srgb,var(--primary-text-color) 11%,transparent))}.thermostat.compact-vertical{width:100%;min-width:0;max-width:100%;min-height:140px;padding:8px 6px;display:grid;grid-template-rows:46px 74px;align-items:center;justify-items:center;gap:4px;text-align:center;border-radius:16px;background:color-mix(in srgb,var(--primary-text-color) 7%,var(--card-background-color));-webkit-backdrop-filter:none;backdrop-filter:none}.thermostat.compact-vertical:not(.activity-off){background:color-mix(in srgb,var(--thermostat-color) 15%,var(--card-background-color))}.thermostat.compact-vertical.activity-off{--thermostat-color:var(--secondary-text-color,#6b7280)}.compact-vertical .mode-control{align-self:center}.compact-vertical .type-icon{width:46px;height:46px;border-radius:12px}.compact-vertical .type-icon ha-icon{--mdc-icon-size:25px}.compact-vertical .target{width:100%;min-width:0;height:74px;margin:0;padding:0;display:grid;grid-template-columns:max-content max-content;grid-template-rows:34px 36px;align-items:center;justify-content:center;justify-items:center;gap:4px}.compact-vertical .target-copy{grid-column:1 / -1;min-width:0;width:100%;align-items:center;text-align:center}.compact-vertical .label,.compact-vertical .value{max-width:100%;text-align:center}.compact-vertical .label{font-size:12px;font-weight:650;line-height:1.05}.compact-vertical .value{font-size:13px;font-weight:700;line-height:1.1;overflow:hidden;text-overflow:ellipsis}.compact-vertical .step{width:36px;height:36px;margin:0}.compact-vertical .mode-only{grid-template-columns:1fr;grid-template-rows:auto}.thermostat:active{transform:scale(0.98)}.thermostat:focus-visible{outline:none}.thermostat.activity-heat{--thermostat-color:var(--state-climate-heat-color,#ff8100)}.thermostat.activity-cool{--thermostat-color:var(--state-climate-cool-color,#2b9af9)}.thermostat.activity-dry{--thermostat-color:var(--state-climate-dry-color,#efbd07)}.thermostat.activity-fan{--thermostat-color:var(--state-climate-fan_only-color,#00bcd4)}.thermostat.activity-auto{--thermostat-color:var(--state-climate-auto-color,#008000)}button{margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}svg{width:18px;height:18px;flex:0 0 auto;fill:currentColor}.mode-control{position:relative;flex:0 0 auto}.type-icon{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:11px;background:color-mix(in srgb,var(--thermostat-color) 16%,transparent);color:color-mix(in srgb,var(--thermostat-color) 82%,var(--tile-text))}.type-icon ha-icon{--mdc-icon-size:22px}.mode-menu{position:fixed;z-index:1000;top:0;left:0;min-width:176px;padding:6px;display:flex;flex-direction:column;gap:2px;border-radius:12px;background:var(--card-background-color,#fff);color:var(--primary-text-color);box-shadow:0 10px 30px rgba(0,0,0,0.22)}.mode-item{min-height:38px;padding:0 10px;display:flex;align-items:center;gap:10px;border-radius:9px;white-space:nowrap;text-align:left}.mode-item:hover,.mode-item.active{background:color-mix(in srgb,var(--primary-color) 10%,transparent)}.mode-item.active{color:var(--primary-color);font-weight:600}.mode-item ha-icon{--mdc-icon-size:20px}.thermostat.activity-heat .type-icon,.thermostat.activity-cool .type-icon,.thermostat.activity-dry .type-icon,.thermostat.activity-fan .type-icon,.thermostat.activity-auto .type-icon,.thermostat.activity-idle .type-icon{background:var(--thermostat-color);color:#ffffff;box-shadow:0 6px 14px color-mix(in srgb,var(--thermostat-color) 26%,transparent)}.target-range{min-height:40px;padding:0 8px;display:inline-flex;align-items:center;border-radius:11px;transition:background-color 0.18s ease}.segment-icon{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:11px;background:color-mix(in srgb,var(--thermostat-color) 16%,transparent);color:color-mix(in srgb,var(--thermostat-color) 78%,var(--tile-text))}.segment-icon svg{width:20px;height:20px}.copy{min-width:0;display:flex;flex-direction:column;gap:1px;line-height:1.1}.label{color:var(--tile-muted);font-size:12px;font-weight:500;white-space:nowrap}.value{font-size:14px;font-weight:650;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.target{display:inline-flex;align-items:center;gap:4px;flex:0 0 auto;padding:0 2px 0 4px;border-radius:11px}.target-copy{min-width:58px;align-items:flex-start;text-align:left}.range-copy{min-width:94px}.mode-only{padding-right:8px}.step{width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:10px;background:color-mix(in srgb,var(--tile-text) 8%,transparent);color:var(--tile-text);transition:background-color 0.18s ease,transform 0.12s ease,opacity 0.18s ease}.step:hover:not(:disabled){background:color-mix(in srgb,var(--tile-text) 13%,transparent)}.step:active:not(:disabled){transform:scale(0.94)}.step:disabled{opacity:0.4;cursor:default}@media (pointer:coarse){.step{width:36px;height:36px}}@media (prefers-reduced-motion:reduce){.thermostat,.target-range,.step{transition:none}}`,e([t({attribute:!1})],Ve.prototype,"hass",void 0),e([t({attribute:!1})],Ve.prototype,"entityId",void 0),e([t({attribute:!1})],Ve.prototype,"roomName",void 0),e([t({attribute:!1})],Ve.prototype,"compactVertical",void 0),e([a()],Ve.prototype,"_pendingTarget",void 0),e([a()],Ve.prototype,"_pendingRange",void 0),e([a()],Ve.prototype,"_modeMenuOpen",void 0),Ve=e([o("dwains-dashboard-next-area-thermostat")],Ve);const Ue=new Set(["video","movie","tvshow","episode","channel"]);let Ge=class extends n{constructor(){super(...arguments),this.players=[],this.floating=!1}_t(e,t){return R(this.hass,e,t)}disconnectedCallback(){super.disconnectedCallback(),this._clearOptimisticTimer()}willUpdate(e){if(super.willUpdate(e),e.has("hass")&&this._optimistic){const e=this.hass?.states?.[this._optimistic.entityId]?.state,t=this._optimistic.state;(("playing"===t?O(e):e===t)||this._optimistic.expiresAt<=Date.now())&&this._clearOptimistic()}}_currentPlayer(){const e=this.players||[];return e.find(e=>e.entityId===this._pinnedEntityId)||e[0]}_shownState(e){const t=this._optimistic;return t&&t.entityId===e.entity_id&&t.expiresAt>Date.now()?t.state:e.state}_playerName(e){return e.attributes?.friendly_name||q(this.hass)[e.entity_id]?.name||e.entity_id}_openMoreInfo(e){xe(this,"hass-more-info",{entityId:e})}_cycle(){const e=this.players||[];if(e.length<2)return;const t=this._currentPlayer(),a=e.findIndex(e=>e.entityId===t?.entityId);this._pinnedEntityId=e[(a+1)%e.length].entityId}async _togglePlayback(e,t){const a=e.entity_id,o=O(this._shownState(e))?"paused":"playing";this._pinnedEntityId=a,this._optimistic={entityId:a,state:o,expiresAt:Date.now()+5e3},this._scheduleOptimisticExpiry();try{await this.hass.callService("media_player","media_play_pause",{entity_id:a})}catch(e){console.warn(`Failed to play or pause ${a}:`,e),this._optimistic?.entityId===a&&this._clearOptimistic(),this._showFailure(t)}}async _nextTrack(e,t){const a=e.entity_id;this._pinnedEntityId=a;try{await this.hass.callService("media_player","media_next_track",{entity_id:a})}catch(e){console.warn(`Failed to skip to the next track on ${a}:`,e),this._showFailure(t)}}_showFailure(e){xe(this,"hass-notification",{message:this._t("now_playing.update_failed",{name:e})})}_scheduleOptimisticExpiry(){this._clearOptimisticTimer(),this._optimisticTimer=window.setTimeout(()=>{this._optimisticTimer=void 0,this._optimistic=void 0},5050)}_clearOptimistic(){this._optimistic=void 0,this._clearOptimisticTimer()}_clearOptimisticTimer(){void 0!==this._optimisticTimer&&(window.clearTimeout(this._optimisticTimer),this._optimisticTimer=void 0)}_icon(e){return d`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d=${e}></path></svg>`}render(){const e=this._currentPlayer(),t=e?this.hass?.states?.[e.entityId]:void 0;if(!e||!t)return c;const a=this._playerName(t),{title:o,artist:r}=W(t,a),i=[r,e.roomName||(o!==a?a:"")].filter(Boolean).join(" · "),n=e.roomName||a,s=this._shownState(t),l=O(s),p=V(t,this.hass?.hassUrl?.bind(this.hass)),m=p&&p!==this._brokenArtwork,h=String(t.attributes?.media_content_type||""),g=(this.players?.length||0)-1;return d`
      <div class="bar ${l?"is-playing":"is-paused"}" role="region" aria-label=${this._t("now_playing.title")}>
        <button
          class="info"
          type="button"
          title=${this._t("now_playing.details",{name:n})}
          aria-label=${`${o}${i?`, ${i}`:""}. ${this._t("now_playing.details",{name:n})}`}
          @click=${()=>this._openMoreInfo(t.entity_id)}
        >
          <span class="art">
            ${m?d`
              <img
                src=${p}
                alt=""
                decoding="async"
                referrerpolicy="no-referrer"
                @error=${()=>{this._brokenArtwork=p}}
              />
            `:this._icon(Ue.has(h)?le:pe)}
          </span>
          <span class="text">
            <span class="title">${o}</span>
            ${i?d`<span class="subtitle">${i}</span>`:c}
          </span>
        </button>
        <div class="controls">
          ${g>0?d`
            <button
              class="more"
              type="button"
              title=${this._t("now_playing.more_players",{count:g})}
              aria-label=${this._t("now_playing.more_players",{count:g})}
              @click=${this._cycle}
            >+${g}</button>
          `:c}
          ${U(t,s)?d`
            <button
              class="control primary"
              type="button"
              title=${this._t(l?"now_playing.pause":"now_playing.play",{name:n})}
              aria-label=${this._t(l?"now_playing.pause":"now_playing.play",{name:n})}
              @click=${()=>this._togglePlayback(t,n)}
            >
              ${this._icon(l?me:he)}
            </button>
          `:c}
          ${G(t)?d`
            <button
              class="control"
              type="button"
              title=${this._t("now_playing.next",{name:n})}
              aria-label=${this._t("now_playing.next",{name:n})}
              @click=${()=>this._nextTrack(t,n)}
            >
              ${this._icon(ge)}
            </button>
          `:c}
        </div>
      </div>
    `}};Ge.styles=i`:host{display:block;min-width:0;-webkit-tap-highlight-color:transparent}.bar{box-sizing:border-box;min-height:60px;padding:6px 8px 6px 6px;display:flex;align-items:center;gap:8px;border-radius:14px;background:var(--card-background-color,#fff);color:var(--primary-text-color);border:1px solid color-mix(in srgb,var(--divider-color,rgba(0,0,0,0.12)) 70%,transparent);box-shadow:0 10px 26px rgba(15,23,42,0.07)}:host([floating]) .bar{border-radius:18px;background:color-mix(in srgb,var(--card-background-color,#fff) 90%,transparent);box-shadow:0 18px 40px rgba(15,23,42,0.18),inset 0 1px 0 color-mix(in srgb,#ffffff 40%,transparent);backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%)}button{margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}svg{width:22px;height:22px;fill:currentColor}.info{min-width:0;min-height:46px;flex:1 1 auto;display:flex;align-items:center;gap:10px;padding-right:4px;border-radius:10px;text-align:left}.art{width:46px;height:46px;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;overflow:hidden;border-radius:10px;background:color-mix(in srgb,var(--primary-color) 14%,var(--card-background-color,#fff));color:var(--primary-color)}.art img{width:100%;height:100%;object-fit:cover;display:block}.is-paused .art{opacity:0.72}.text{min-width:0;display:flex;flex-direction:column;gap:2px}.title,.subtitle{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.title{font-size:14px;font-weight:700;line-height:1.2}.subtitle{color:var(--secondary-text-color);font-size:12px;font-weight:500;line-height:1.2}.controls{flex:0 0 auto;display:flex;align-items:center;gap:4px}.control{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;transition:background-color 0.18s ease,transform 0.12s ease}.control:hover{background:color-mix(in srgb,var(--primary-text-color) 8%,transparent)}.control.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}.control.primary:hover{background:color-mix(in srgb,var(--primary-color) 88%,#000)}.control:active{transform:scale(0.94)}.more{min-width:40px;height:32px;padding:0 10px;border-radius:999px;background:color-mix(in srgb,var(--primary-text-color) 8%,transparent);color:var(--primary-text-color);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}@media (pointer:coarse){.more{height:40px}}@media (prefers-reduced-motion:reduce){.control{transition:none}}`,e([t({attribute:!1})],Ge.prototype,"hass",void 0),e([t({attribute:!1})],Ge.prototype,"players",void 0),e([t({type:Boolean,reflect:!0})],Ge.prototype,"floating",void 0),e([a()],Ge.prototype,"_pinnedEntityId",void 0),e([a()],Ge.prototype,"_optimistic",void 0),e([a()],Ge.prototype,"_brokenArtwork",void 0),Ge=e([o("dwains-dashboard-next-now-playing")],Ge);const Be=i`
    .dd-page-header,
    .dd-room-compact {
      --ph-surface: var(--ha-card-background, var(--card-background-color, #ffffff));
      --ph-text: var(--primary-text-color, #1c1f24);
      --ph-muted: color-mix(in srgb, var(--ph-text) 66%, transparent);
      --ph-control: color-mix(in srgb, var(--ph-text) 6%, transparent);
      --ph-control-hover: color-mix(in srgb, var(--ph-text) 11%, transparent);
      --ph-accent: var(--domain-color, var(--primary-color, #03a9f4));
      --ph-warning: var(--warning-color, #ff9800);
      --ph-pad-x: 20px;
      --ph-pad-y: 18px;
    }

    .dd-page-header {
      position: relative;
      isolation: isolate;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: 0 0 20px;
      padding: var(--ph-pad-y) var(--ph-pad-x);
      border: 1px solid color-mix(in srgb, var(--divider-color, rgba(0, 0, 0, 0.12)) 75%, transparent);
      border-radius: 18px;
      background: var(--ph-surface);
      color: var(--ph-text);
      box-shadow:
        0 1px 2px rgba(15, 23, 42, 0.04),
        0 12px 32px rgba(15, 23, 42, 0.06);
    }

    :host([data-theme-dark]) .dd-page-header {
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.28),
        0 12px 32px rgba(0, 0, 0, 0.24);
    }

    /* Top row */
    .dd-page-header-top {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .dd-page-header-identity {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .dd-page-header-icon {
      width: 48px;
      height: 48px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: color-mix(in srgb, var(--ph-accent) 14%, var(--ph-surface));
      color: var(--ph-accent);
    }

    .dd-page-header-icon ha-icon {
      --mdc-icon-size: 26px;
    }

    .dd-page-header-copy {
      min-width: 0;
    }

    .dd-page-header-title {
      margin: 0;
      color: inherit;
      font-size: clamp(22px, 1.1vw + 14px, 30px);
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.012em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* The readings carry their own icon, so they need no separator and wrap
       cleanly on narrow screens. */
    .dd-page-header-subtitle {
      margin-top: 4px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px 14px;
      color: var(--ph-muted);
      font-size: 14px;
      font-weight: 500;
      line-height: 1.35;
    }

    .dd-visually-hidden {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }

    .dd-page-header-reading {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      color: var(--ph-text);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      line-height: 1;
    }

    .dd-page-header-reading ha-icon {
      --mdc-icon-size: 17px;
      width: 17px;
      height: 17px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 17px;
      color: var(--reading-color);
      vertical-align: middle;
    }

    .dd-page-header-reading.temperature {
      --reading-color: ${l(m("climate"))};
    }

    .dd-page-header-reading.humidity {
      --reading-color: ${l(m("fan"))};
    }

    .dd-page-header-reading.wattage {
      --reading-color: ${l(m("energy"))};
    }

    /* Round buttons: back, camera, hidden entities, edit */
    .dd-page-header-actions {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .dd-page-header-button {
      position: relative;
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      padding: 0;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: var(--ph-control);
      color: var(--ph-text);
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.12s ease;
    }

    .dd-page-header-button:hover {
      background: var(--ph-control-hover);
    }

    .dd-page-header-button:active {
      transform: scale(0.94);
    }

    .dd-page-header-button ha-icon,
    .dd-page-header-button .dd-static-icon {
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
    }

    .dd-page-header-button.is-active,
    .dd-page-header-button.is-active:hover {
      background: var(--primary-color);
      color: var(--text-primary-color, #ffffff);
    }

    .dd-page-header-button.is-warning {
      background: color-mix(in srgb, var(--ph-warning) 16%, transparent);
      color: color-mix(in srgb, var(--ph-warning) 78%, var(--ph-text));
    }

    .dd-page-header-button.is-warning:hover {
      background: color-mix(in srgb, var(--ph-warning) 24%, transparent);
    }

    .dd-page-header-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      box-sizing: border-box;
      min-width: 19px;
      height: 19px;
      padding: 0 5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--ph-warning);
      color: #241600;
      font-size: 11px;
      font-weight: 750;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      box-shadow: 0 0 0 2px var(--ph-surface);
    }

    .dd-page-header-button:focus-visible,
    .dd-room-tile:focus-visible,
    .dd-room-tile-action:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    /* Room tiles and thermostat */
    .dd-page-header-strip {
      position: relative;
      z-index: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px 16px;
      min-width: 0;
    }

    /* The tiles take the free space, so the thermostat ends up on the right,
       or at the start of its own line when it wraps. */
    .dd-room-tiles {
      flex: 1 1 auto;
      min-width: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
    }

    .dd-page-header-strip > dwains-dashboard-next-area-thermostat {
      flex: 0 1 auto;
      min-width: 0;
      max-width: 100%;
    }

    .dd-room-tile {
      --tile-color: var(--primary-color);
      --tile-on: #ffffff;
      box-sizing: border-box;
      /* Share available desktop row width across each quick-control tile. */
      flex: 1 1 0;
      width: auto;
      min-width: 0;
      min-height: 52px;
      padding: 6px 12px 6px 6px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      border: 0;
      border-radius: 14px;
      background: var(--ph-control);
      color: var(--ph-text);
      font: inherit;
      text-align: left;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
      transition:
        background-color 0.2s ease,
        color 0.2s ease,
        transform 0.12s ease;
    }

    button.dd-room-tile:hover {
      background: var(--ph-control-hover);
    }

    button.dd-room-tile:active {
      transform: scale(0.97);
    }

    .dd-room-tile.light {
      --tile-color: ${l(m("light"))};
      --tile-on: #2b1c00;
    }

    .dd-room-tile.switch {
      --tile-color: ${l(m("switch"))};
    }

    .dd-room-tile.cover {
      --tile-color: ${l(m("cover"))};
    }

    .dd-room-tile.fan {
      --tile-color: ${l(m("fan"))};
    }

    .dd-room-tile.climate {
      --tile-color: ${l(m("climate"))};
    }

    .dd-room-tile-icon {
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 11px;
      background: color-mix(in srgb, var(--tile-color) 14%, transparent);
      color: var(--tile-color);
      transition:
        background-color 0.2s ease,
        color 0.2s ease;
    }

    .dd-room-tile-icon ha-icon {
      --mdc-icon-size: 22px;
    }

    .dd-room-tile-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .dd-room-tile-label {
      font-size: 14px;
      font-weight: 650;
      line-height: 1.2;
      white-space: nowrap;
    }

    .dd-room-tile-state {
      color: var(--ph-muted);
      font-size: 12.5px;
      font-weight: 500;
      line-height: 1.2;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .dd-room-tile-state-slot {
      display: grid;
      width: max-content;
      max-width: none;
    }

    .dd-room-tile-state-slot > * {
      grid-area: 1 / 1;
      white-space: nowrap;
    }

    .dd-room-tile-state-reserve {
      visibility: hidden;
      pointer-events: none;
    }

    .dd-room-tile-switch {
      position: relative;
      width: 34px;
      height: 20px;
      flex: 0 0 auto;
      margin-left: 6px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--ph-text) 20%, transparent);
      transition: background-color 0.2s ease;
    }

    .dd-room-tile-switch::after {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .dd-room-tile.is-on {
      background: color-mix(in srgb, var(--tile-color) 15%, var(--ph-surface));
    }

    button.dd-room-tile.is-on:hover {
      background: color-mix(in srgb, var(--tile-color) 21%, var(--ph-surface));
    }

    .dd-room-tile.is-on .dd-room-tile-icon {
      background: var(--tile-color);
      color: var(--tile-on);
    }

    .dd-room-tile.is-on .dd-room-tile-switch {
      background: var(--tile-color);
    }

    .dd-room-tile.is-on .dd-room-tile-switch::after {
      transform: translateX(14px);
    }

    .dd-room-tile.has-actions {
      padding-right: 6px;
      cursor: default;
    }

    .dd-room-tile-actions {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-left: 6px;
    }

    .dd-room-tile-action {
      width: 36px;
      height: 36px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 10px;
      background: var(--ph-control);
      color: inherit;
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      transition:
        background-color 0.18s ease,
        transform 0.12s ease;
    }

    .dd-room-tile-action:hover {
      background: var(--ph-control-hover);
    }

    .dd-room-tile-action:active {
      transform: scale(0.9);
    }

    .dd-room-tile-action ha-icon {
      --mdc-icon-size: 20px;
    }

    .dd-room-tile-chevron {
      --mdc-icon-size: 20px;
      margin-left: 2px;
      color: var(--ph-muted);
    }

    /* Room picture: the photo fills the card, the controls float on it. */
    .dd-page-header.has-picture {
      --ph-text: #ffffff;
      --ph-control: rgba(255, 255, 255, 0.16);
      --ph-control-hover: rgba(255, 255, 255, 0.26);
      --ph-muted: rgba(255, 255, 255, 0.8);
      border-color: transparent;
      background: #1b2422;
    }

    .dd-page-header.has-picture.text-dark {
      --ph-text: #10141a;
      --ph-control: rgba(255, 255, 255, 0.58);
      --ph-control-hover: rgba(255, 255, 255, 0.74);
      --ph-muted: rgba(16, 20, 26, 0.74);
      background: #e9eef0;
    }

    .dd-page-header-media {
      position: absolute;
      inset: 0;
      z-index: 0;
      border-radius: inherit;
      background-position: center;
      background-size: cover;
    }

    .dd-page-header-media::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background:
        linear-gradient(0deg, rgba(8, 12, 18, 0.62) 0%, rgba(8, 12, 18, 0) 70%),
        linear-gradient(100deg, rgba(8, 12, 18, 0.66) 0%, rgba(8, 12, 18, 0.34) 60%, rgba(8, 12, 18, 0.2) 100%);
    }

    .dd-page-header.text-dark .dd-page-header-media::after {
      background:
        linear-gradient(0deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0) 70%),
        linear-gradient(100deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.46) 60%, rgba(255, 255, 255, 0.24) 100%);
    }

    .dd-page-header.has-picture .dd-page-header-top {
      flex-wrap: wrap;
      row-gap: 36px;
    }

    .dd-page-header.has-picture .dd-page-header-actions {
      order: 1;
      margin-left: auto;
    }

    .dd-page-header.has-picture .dd-page-header-identity {
      order: 2;
      flex-basis: 100%;
    }

    .dd-page-header.has-picture .dd-page-header-title {
      text-shadow: 0 1px 14px rgba(0, 0, 0, 0.28);
    }

    .dd-page-header.has-picture.text-dark .dd-page-header-title {
      text-shadow: none;
    }

    .dd-page-header.has-picture .dd-page-header-icon {
      background: var(--ph-control);
      color: var(--ph-text);
    }

    .dd-page-header.has-picture .dd-page-header-button,
    .dd-page-header.has-picture .dd-room-tile {
      -webkit-backdrop-filter: blur(16px) saturate(1.3);
      backdrop-filter: blur(16px) saturate(1.3);
    }

    .dd-page-header.has-picture .dd-page-header-badge {
      box-shadow: none;
    }

    .dd-page-header.has-picture .dd-page-header-reading ha-icon {
      color: inherit;
    }

    .dd-page-header.has-picture .dd-room-tile.is-on {
      --ph-text: #10141a;
      --ph-muted: rgba(16, 20, 26, 0.7);
      --ph-control: rgba(16, 20, 26, 0.07);
      --ph-control-hover: rgba(16, 20, 26, 0.12);
      background: rgba(255, 255, 255, 0.94);
    }

    .dd-page-header.has-picture .dd-room-tile:not(.is-on) .dd-room-tile-icon {
      background: var(--ph-control);
      color: var(--ph-text);
    }

    .dd-page-header.has-picture .dd-room-tile-switch {
      background: color-mix(in srgb, var(--ph-text) 30%, transparent);
    }

    .dd-page-header.has-picture .dd-room-tile.is-on .dd-room-tile-switch {
      background: var(--tile-color);
    }

    /* Compact room bar: slides in at the top of the screen once the large
       header has scrolled away on phones. It takes no space in the page, so
       the content never jumps. */
    .dd-room-compact {
      display: none;
    }


    /*
     * Room header v2
     *
     * This is the canonical room-header layout. Keep it here instead of
     * patching the layout card so desktop and mobile share one component
     * contract and only change layout at the breakpoint.
     */
    .room-header {
      z-index: 20;
      padding: 16px;
      gap: 0;
    }

    .room-header .dd-page-header-with-media {
      min-width: 0;
      min-height: 0;
      display: grid;
      grid-template-columns: 176px minmax(0, 1fr);
      align-items: stretch;
      gap: 18px;
    }

    .room-header .dd-page-header-media-tile {
      width: 176px;
      min-height: 0;
      height: auto;
      align-self: stretch;
      overflow: hidden;
      border-radius: 16px;
      background: color-mix(in srgb, var(--ph-accent) 10%, var(--ph-surface));
    }

    .room-header .dd-page-header-room-picture,
    .room-header .dd-page-header-room-icon {
      width: 100%;
      height: 100%;
      min-height: 0;
      border-radius: inherit;
    }

    .room-header .dd-page-header-room-picture {
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .room-header .dd-page-header-room-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ph-accent);
      background: color-mix(in srgb, var(--ph-accent) 12%, var(--ph-surface));
    }

    .room-header .dd-page-header-room-icon ha-icon {
      --mdc-icon-size: 42px;
    }

    .room-header .dd-page-header-main {
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 14px;
      padding-top: 0;
      box-sizing: border-box;
    }

    .room-header .dd-page-header-top {
      flex-wrap: nowrap;
      align-items: flex-start;
      gap: 12px;
    }

    .room-header .dd-page-header-identity {
      min-width: 0;
      align-items: flex-start;
    }

    .room-header .dd-page-header-copy {
      min-width: 0;
      width: 100%;
    }

    .room-header .dd-page-header-title-row {
      min-width: 0;
      min-height: 30px;
      display: flex;
      align-items: center;
      gap: 6px;
      line-height: 1;
    }

    .room-header .dd-page-header-title-row .dd-page-header-home {
      width: 30px;
      height: 30px;
      flex: 0 0 30px;
      display: inline-grid;
      place-items: center;
      background: color-mix(in srgb, #03a9f4 14%, var(--ph-surface));
      color: #03a9f4;
    }

    .room-header .dd-page-header-title-row .dd-page-header-home:hover {
      background: color-mix(in srgb, #03a9f4 22%, var(--ph-surface));
      color: #03a9f4;
    }

    .room-header .dd-page-header-title-chevron {
      --mdc-icon-size: 17px;
      width: 17px;
      height: 17px;
      flex: 0 0 17px;
      align-self: center;
      color: var(--ph-muted);
    }

    .room-header .dd-page-header-title {
      min-width: 0;
      flex: 1 1 auto;
      margin: 0;
      align-self: center;
      font-size: clamp(22px, 1.2vw + 14px, 30px);
      line-height: 1.08;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .room-header .dd-page-header-subtitle {
      margin-top: 6px;
      gap: 4px 10px;
      align-items: center;
    }

    .room-header .dd-page-header-device-label,
    .room-header .dd-page-header-subtitle-separator {
      display: inline-flex;
      align-items: center;
      line-height: 1;
    }

    .room-header .dd-page-header-subtitle-separator {
      margin-inline: 1px;
      color: color-mix(in srgb, var(--ph-muted) 72%, transparent);
      font-weight: 700;
    }

    .room-header .dd-page-header-actions {
      margin-left: auto;
      align-self: flex-start;
    }

    .room-header .dd-room-quick-wrap {
      min-width: 0;
    }

    .room-header .dd-page-header-strip {
      position: relative;
      z-index: 2;
      min-width: 0;
      min-height: 52px;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
    }

    .dd-room-quick-dots {
      display: none;
    }

    .room-header .dd-page-header-strip > dwains-dashboard-next-area-thermostat {
      position: relative;
      z-index: 3;
    }

    /* Rooms without quick controls reserve the exact same control-row height.
       This keeps the media tile identical when switching between rooms. */
    .room-header .dd-page-header-strip.is-placeholder {
      visibility: hidden;
      pointer-events: none;
    }

    .room-header .dd-room-tiles {
      flex: 0 1 auto;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .dd-page-header,
      .dd-room-compact {
        --ph-pad-x: 16px;
      }

      .dd-page-header {
        margin: 0 -10px 14px;
        padding: calc(10px + env(safe-area-inset-top, 0px)) var(--ph-pad-x) 14px;
        gap: 14px;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
      }

      :host([data-theme-dark]) .dd-page-header {
        box-shadow: none;
      }

      .dd-page-header-top {
        flex-wrap: wrap;
        row-gap: 14px;
      }

      .dd-page-header-actions {
        order: 1;
        margin-left: auto;
      }

      .dd-page-header-identity {
        order: 2;
        flex-basis: 100%;
      }

      .dd-page-header-actions.is-content {
        order: 3;
        flex-basis: 100%;
        flex-wrap: wrap;
        justify-content: flex-start;
        margin-left: 0;
      }

      .dd-page-header-icon {
        display: none;
      }

      .dd-page-header-title {
        font-size: 28px;
        line-height: 1.1;
        white-space: normal;
        overflow-wrap: anywhere;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .dd-page-header-strip {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      .dd-room-tiles {
        flex: 0 0 auto;
        flex-wrap: nowrap;
        margin: 0 calc(var(--ph-pad-x) * -1);
        padding: 2px var(--ph-pad-x);
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-padding-inline: var(--ph-pad-x);
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .dd-room-tiles::-webkit-scrollbar {
        display: none;
      }

      .dd-room-tile {
        flex: 0 0 auto;
        scroll-snap-align: start;
      }

      .dd-page-header-strip > dwains-dashboard-next-area-thermostat {
        width: 100%;
      }

      .dd-page-header.has-picture {
        padding-bottom: 16px;
        border-radius: 0 0 24px 24px;
      }

      .dd-page-header.has-picture .dd-page-header-top {
        row-gap: 72px;
      }

      .dd-room-compact {
        display: block;
        position: sticky;
        top: 0;
        z-index: 90;
        height: 0;
        color: var(--ph-text);
      }

      .dd-room-compact-panel {
        position: absolute;
        top: 0;
        left: -10px;
        right: -10px;
        box-sizing: border-box;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 12px 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-bottom: 1px solid color-mix(in srgb, var(--divider-color, rgba(0, 0, 0, 0.12)) 70%, transparent);
        background: color-mix(in srgb, var(--ph-surface) 86%, transparent);
        -webkit-backdrop-filter: blur(20px) saturate(1.5);
        backdrop-filter: blur(20px) saturate(1.5);
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        opacity: 0;
        transform: translateY(-12px);
        visibility: hidden;
        pointer-events: none;
        transition:
          opacity 0.18s ease,
          transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
          visibility 0s linear 0.26s;
      }

      .dd-room-compact.is-visible .dd-room-compact-panel {
        opacity: 1;
        transform: none;
        visibility: visible;
        pointer-events: auto;
        transition:
          opacity 0.18s ease,
          transform 0.26s cubic-bezier(0.2, 0.8, 0.2, 1),
          visibility 0s;
      }

      .dd-room-compact-bar {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 40px;
      }

      .dd-room-compact-title {
        flex: 1 1 auto;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .dd-room-compact-title strong {
        overflow: hidden;
        font-size: 17px;
        font-weight: 700;
        line-height: 1.2;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dd-room-compact-title span {
        overflow: hidden;
        color: var(--ph-muted);
        font-size: 12px;
        font-weight: 500;
        line-height: 1.25;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }

      .dd-room-compact .dd-page-header-button {
        width: 38px;
        height: 38px;
      }

      .dd-room-compact .dd-room-tiles {
        margin: 0 -12px;
        padding: 0 12px 2px;
        scroll-padding-inline: 12px;
      }

      .dd-room-compact .dd-room-tile {
        min-height: 44px;
        padding: 4px 10px 4px 4px;
        gap: 8px;
      }

      .dd-room-compact .dd-room-tile-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
      }

      .dd-room-compact .dd-room-tile-action {
        width: 32px;
        height: 32px;
      }
    }


    @media (max-width: 768px) {
      /*
       * Room header v2 on phones:
       * - keep the desktop Home/title/action hierarchy
       * - use the room image as a very subtle full-card backdrop
       * - keep all header metrics on one line
       * - wrap quick controls instead of clipping or horizontally scrolling them
       */
      .room-header {
        margin: 0 0 14px;
        padding: 12px;
        gap: 0;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--divider-color, rgba(0, 0, 0, 0.12)) 75%, transparent);
        border-radius: 18px;
        background: var(--ph-surface);
        box-shadow:
          0 1px 2px rgba(15, 23, 42, 0.04),
          0 10px 26px rgba(15, 23, 42, 0.07);
      }

      :host([data-theme-dark]) .room-header {
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.24),
          0 10px 26px rgba(0, 0, 0, 0.20);
      }

      .room-header .dd-page-header-with-media {
        position: relative;
        display: block;
        min-height: 0;
      }

      .room-header .dd-page-header-media-tile {
        position: absolute;
        inset: -12px;
        z-index: 0;
        width: auto;
        min-height: 0;
        height: auto;
        border-radius: 0;
        opacity: 0.22;
        filter: saturate(0.72) contrast(0.92);
        pointer-events: none;
      }

      .room-header .dd-page-header-room-picture,
      .room-header .dd-page-header-room-icon {
        width: 100%;
        height: 100%;
        min-height: 0;
        border-radius: 0;
      }

      .room-header .dd-page-header-room-icon {
        opacity: 0.55;
      }

      .room-header .dd-page-header-room-icon ha-icon {
        --mdc-icon-size: 54px;
      }

      .room-header .dd-page-header-main {
        position: relative;
        z-index: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-top: 0;
      }

      .room-header .dd-page-header-top {
        position: relative;
        min-width: 0;
        padding-bottom: 27px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: start;
        gap: 8px;
      }

      .room-header .dd-page-header-identity {
        min-width: 0;
        display: block;
        order: initial;
        flex-basis: auto;
      }

      .room-header .dd-page-header-title-row {
        min-height: 42px;
        gap: 6px;
        align-items: center;
      }

      /* Match the desktop room Home affordance instead of introducing a
         separate mobile icon treatment. */
      .room-header .dd-page-header-title-row .dd-page-header-home {
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
      }

      .room-header .dd-page-header-title-row .dd-page-header-home ha-icon {
        --mdc-icon-size: 21px;
      }

      .room-header .dd-page-header-title-chevron {
        display: inline-flex;
        --mdc-icon-size: 17px;
        width: 17px;
        height: 17px;
        flex: 0 0 17px;
      }

      .room-header .dd-page-header-title {
        min-width: 0;
        font-size: 20px;
        line-height: 1.15;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }

      .room-header .dd-page-header-subtitle {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        margin-top: 0;
        flex-wrap: nowrap;
        gap: 8px;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        font-size: 12px;
        line-height: 1.25;
      }

      .room-header .dd-page-header-subtitle::-webkit-scrollbar {
        display: none;
      }

      .room-header .dd-page-header-device-label,
      .room-header .dd-page-header-reading {
        flex: 0 0 auto;
        white-space: nowrap;
      }

      .room-header .dd-page-header-actions {
        order: initial;
        margin-left: 0;
        align-self: start;
        gap: 5px;
      }

      /* Keep the current touch target size; only fix the icon centering. */
      .room-header .dd-page-header-actions .dd-page-header-button {
        width: 42px;
        height: 42px;
        line-height: 0;
      }

      .room-header .dd-page-header-actions .dd-page-header-button ha-icon,
      .room-header .dd-page-header-actions .dd-page-header-button .dd-static-icon {
        --mdc-icon-size: 21px;
        width: 21px;
        height: 21px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 21px;
      }

      .room-header .dd-page-header-badge {
        top: -3px;
        right: -3px;
        min-width: 18px;
        height: 18px;
        padding-inline: 4px;
        font-size: 10px;
      }

      .room-header .dd-room-quick-wrap {
        margin: 0 -12px;
        min-width: 0;
      }

      .room-header .dd-page-header-strip {
        --dd-room-quick-gap: 8px;
        margin: 0;
        min-height: 0;
        padding: 2px 12px 4px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: stretch;
        gap: var(--dd-room-quick-gap);
        overflow-x: auto;
        overflow-y: hidden;
        overscroll-behavior-x: contain;
        scroll-padding-inline: 12px;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
      }

      .room-header .dd-page-header-strip::-webkit-scrollbar {
        display: none;
      }

      .room-header .dd-page-header-strip.is-placeholder {
        display: none;
      }

      /* Mobile quick controls are uniform vertical cards in one horizontal rail. */
      .room-header .dd-room-tiles {
        display: contents;
      }

      .room-header .dd-room-tile {
        flex: 0 0 calc((100% - (2 * var(--dd-room-quick-gap))) / 3);
        width: calc((100% - (2 * var(--dd-room-quick-gap))) / 3);
        min-width: calc((100% - (2 * var(--dd-room-quick-gap))) / 3);
        min-height: 140px;
        padding: 8px 6px;
        display: grid;
        grid-template-rows: 46px 34px 36px;
        align-items: center;
        justify-items: center;
        gap: 4px;
        border-radius: 16px;
        text-align: center;
        scroll-snap-align: start;
        background: color-mix(in srgb, var(--primary-text-color) 7%, var(--ph-surface));
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }

      .room-header .dd-room-tile.is-on,
      .room-header.dd-page-header.has-picture .dd-room-tile.is-on {
        background: color-mix(in srgb, var(--tile-color) 15%, var(--ph-surface));
      }

      .room-header.dd-page-header.has-picture .dd-room-tile:not(.is-on) {
        --ph-text: var(--primary-text-color);
        --ph-muted: var(--secondary-text-color);
        --ph-control: color-mix(in srgb, var(--primary-text-color) 7%, var(--ph-surface));
        --ph-control-hover: color-mix(in srgb, var(--primary-text-color) 11%, var(--ph-surface));
        background: color-mix(in srgb, var(--primary-text-color) 7%, var(--ph-surface));
      }

      .room-header .dd-room-tile-icon {
        width: 46px;
        height: 46px;
        border-radius: 12px;
      }

      .room-header .dd-room-tile-icon ha-icon {
        --mdc-icon-size: 25px;
      }

      .room-header .dd-room-tile-copy {
        width: 100%;
        min-width: 0;
        min-height: 0;
        height: 34px;
        align-items: center;
        justify-content: center;
        gap: 1px;
        text-align: center;
      }

      .room-header .dd-room-tile-label,
      .room-header .dd-room-tile-state {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
      }

      .room-header .dd-room-tile-label {
        font-size: 13px;
        font-weight: 700;
      }

      .room-header .dd-room-tile-state {
        font-size: 12px;
      }

      .room-header .dd-room-tile-switch {
        margin: 0;
        align-self: center;
      }

      .room-header .dd-room-tile.has-actions {
        padding-right: 8px;
      }

      .room-header .dd-room-tile-actions {
        margin: 0;
        align-self: center;
        gap: 4px;
      }

      .room-header .dd-room-tile-action {
        width: 36px;
        height: 36px;
      }

      .room-header .dd-room-tile-chevron {
        display: none;
      }

      .room-header .dd-page-header-strip > dwains-dashboard-next-area-thermostat {
        flex: 0 0 calc((100% - (2 * var(--dd-room-quick-gap))) / 3);
        width: calc((100% - (2 * var(--dd-room-quick-gap))) / 3);
        min-width: calc((100% - (2 * var(--dd-room-quick-gap))) / 3);
        max-width: calc((100% - (2 * var(--dd-room-quick-gap))) / 3);
        scroll-snap-align: start;
      }

      .room-header .dd-room-quick-dots {
        min-height: 14px;
        padding: 4px 12px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .room-header .dd-room-quick-dot {
        width: 6px;
        height: 6px;
        padding: 0;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--ph-text) 24%, transparent);
        cursor: pointer;
        transition: width 0.18s ease, background-color 0.18s ease;
      }

      .room-header .dd-room-quick-dot.active {
        width: 16px;
        background: color-mix(in srgb, var(--ph-text) 68%, transparent);
      }
    }


    /* Touch screens: the cover buttons inside a tile get a 40px target. */
    @media (pointer: coarse) {
      .dd-room-tile-action,
      .dd-room-compact .dd-room-tile-action {
        width: 40px;
        height: 40px;
      }

      .dd-page-header-button,
      .dd-room-compact .dd-page-header-button {
        width: 42px;
        height: 42px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .dd-page-header-button,
      .dd-room-tile,
      .dd-room-tile-icon,
      .dd-room-tile-switch,
      .dd-room-tile-switch::after,
      .dd-room-tile-action,
      .dd-room-compact-panel,
      .dd-room-compact.is-visible .dd-room-compact-panel {
        transition: none;
      }
    }
`;i`
    :host {
      display: block;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      /*background: var(--primary-background-color);*/
      color: var(--primary-text-color);
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }

    button,
    .area-button,
    .home-status-card,
    .status-card-compact,
    .mobile-area-card,
    .house-person-mini,
    .person-card,
    .favorite-card-wrapper,
    .favorite-quick-action,
    .mobile-domain-master,
    .mobile-layout-toggle,
    .mobile-entity-card,
    .mobile-entity-action,
    .mobile-cover-action,
    .mobile-entity-toggle,
    .dd-add-card,
    .dd-custom-card-wrap.editing {
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    /* Visible keyboard focus for cards and chips that act as buttons. */
    .status-card-compact:focus-visible,
    .home-status-card:focus-visible,
    .weather-compact:focus-visible,
    .welcome-weather:focus-visible,
    .welcome-alarm:focus-visible,
    .area-light-toggle:focus-visible,
    .mobile-area-card:focus-visible,
    .mobile-entity-card:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .dd-static-icon {
      width: 20px;
      height: 20px;
      display: block;
      flex: 0 0 auto;
      fill: currentColor;
      pointer-events: none;
    }

    .mobile-area-card,
    .home-camera-card,
    .home-summary-card,
    .home-status-card,
    .favorite-card-wrapper {
      contain: layout style paint;
    }

    .mobile-home-section,
    .home-camera-section,
    .home-status-section,
    .home-todos-section,
    .home-custom-cards-section,
    .home-favorites-section,
    .home-summaries-section,
    .mobile-domain-group {
      content-visibility: auto;
      contain-intrinsic-size: 1px 360px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-card {
      content-visibility: auto;
      contain-intrinsic-size: 164px 150px;
    }

    :host {
      display: block;
      height: calc(100dvh - var(--header-height, 56px));
      min-height: 0;
      overflow: hidden;
    }

    /* Layout Container */
    .layout-container {
      --area-sidebar-width: 250px;
      display: flex;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      position: relative;
      overflow: hidden;
    }

    .layout-container.sidebar-resizing,
    .layout-container.sidebar-resizing * {
      cursor: col-resize !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }

    .layout-container.sidebar-collapsed .sidebar {
      width: 0;
      flex-basis: 0;
      border-right: 0;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-16px);
    }

    .layout-container.sidebar-collapsed .main-content {
      min-width: 0;
    }

    /* Sidebar Styles */
    .sidebar {
      width: var(--area-sidebar-width);
      flex: 0 0 var(--area-sidebar-width);
      background: var(--card-background-color);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, width 0.16s ease, flex-basis 0.16s ease;
      z-index: 1;
      min-height: 0;
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
      -webkit-overflow-scrolling: touch;
    }

    .layout-container.sidebar-resizing .sidebar {
      transition: none;
    }

    .sidebar-resize-handle {
      flex: 0 0 10px;
      width: 10px;
      align-self: stretch;
      margin-left: -5px;
      margin-right: -5px;
      position: relative;
      z-index: 4;
      border: 0;
      padding: 0;
      background: transparent;
      cursor: col-resize;
      touch-action: none;
    }

    .sidebar-resize-handle::before {
      content: '';
      position: absolute;
      top: 14px;
      bottom: 14px;
      left: 4px;
      width: 2px;
      border-radius: 999px;
      background: transparent;
      transition: background 0.16s ease, box-shadow 0.16s ease;
    }

    .sidebar-resize-handle:hover::before,
    .sidebar-resize-handle:focus-visible::before,
    .layout-container.sidebar-resizing .sidebar-resize-handle::before {
      background: var(--primary-color);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .sidebar-resize-handle:focus-visible {
      outline: none;
    }

    .sidebar-collapse-toggle {
      position: absolute;
      top: 50%;
      left: calc(var(--area-sidebar-width) - 17px);
      z-index: 6;
      width: 34px;
      height: 54px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 96%, transparent);
      color: var(--primary-text-color);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.56);
      cursor: pointer;
      transform: translateY(-50%);
      transition:
        top 0.16s ease,
        left 0.16s ease,
        transform 0.16s ease,
        background-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .sidebar-collapse-toggle:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.62);
    }

    .sidebar-collapse-toggle:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .sidebar-collapse-toggle ha-icon {
      --mdc-icon-size: 18px;
    }

    .sidebar-collapse-toggle.is-collapsed {
      left: 0;
      top: 50%;
      width: 34px;
      min-width: 34px;
      height: 54px;
      padding: 0;
      border-left: 0;
      border-radius: 0 999px 999px 0;
      background: color-mix(in srgb, var(--card-background-color) 98%, transparent);
      transform: translateY(-50%);
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.56);
    }

    .sidebar-collapse-label {
      display: none;
      font-size: 13px;
      font-weight: 850;
      line-height: 1;
    }

    .sidebar-collapse-toggle.is-collapsed .sidebar-collapse-label {
      display: inline;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Global Header */
    .global-header {
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 16px;
      position: sticky;
      top: 0;
      z-index: 1;
      transition: all 0.3s ease;
    }

    .global-header.compact {
      padding: 8px 16px;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* Time and Weather Section (right side) */
    .header-time-weather {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      min-width: 120px;
    }

    .header-time-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      line-height: 0.8;
    }

    .header-time {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
      line-height: 1.2;
    }

    .header-date {
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 500;
    }

    /* Weather Display */
    .weather-compact {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 4px 12px;
      border: 0;
      background: var(--secondary-background-color);
      color: inherit;
      font: inherit;
      text-align: left;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .weather-compact:hover {
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateY(-1px);
    }

    .weather-icon-compact ha-icon {
      --mdc-icon-size: 24px;
    }

    .weather-temp-compact {
      font-size: 14px;
      font-weight: 500;
    }

    /* Status Cards Section */
    .header-status-section {
      flex: 1;
      overflow: hidden;
    }

    .header-status-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .header-status-scroll::-webkit-scrollbar {
      display: none;
    }

    /* Status Card Compact */
    .status-card-compact {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 60px;
      position: relative;
    }

    .status-card-compact:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .status-card-icon-compact {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }

    .status-card-icon-compact ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .status-card-badge-compact {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    .status-card-title-compact {
      font-size: 11px;
      margin-top: 4px;
      opacity: 0.8;
    }

    /* Domain-specific status card colors */
    .status-card-compact.light .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, ${l(m("light"))}) 15%, transparent);
    }

    .status-card-compact.light ha-icon {
      color: var(--status-color, ${l(m("light"))});
    }

    .status-card-compact.switch .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, ${l(m("switch"))}) 15%, transparent);
    }

    .status-card-compact.switch ha-icon {
      color: var(--status-color, ${l(m("switch"))});
    }

    .status-card-compact.binary_sensor .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, ${l(m("sensor"))}) 15%, transparent);
    }

    .status-card-compact.binary_sensor ha-icon {
      color: var(--status-color, ${l(m("sensor"))});
    }

    .status-card-compact.person .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, ${l(m("sensor"))}) 15%, transparent);
    }

    .status-card-compact.person ha-icon {
      color: var(--status-color, ${l(m("sensor"))});
    }

    .status-card-compact.wattage .status-card-icon-compact {
      background: color-mix(in srgb, var(--status-color, ${l(m("energy"))}) 15%, transparent);
    }

    .status-card-compact.wattage ha-icon {
      color: var(--status-color, ${l(m("energy"))});
    }

    /* Header Expand Button */
    .header-expand-button {
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 5;
    }

    .header-expand-button:hover {
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .header-expand-button[data-extra-count]::after {
      content: attr(data-extra-count);
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    /* Area List */
    .area-list {
      padding: 8px;
    }

    /* Floor Sections */
    .floor-section {
      margin-bottom: 16px;
    }

    .floor-header {
      padding: 8px 16px;
      margin-bottom: 8px;
    }

    .floor-header h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .floor-areas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(178px, 1fr));
      gap: 8px;
    }

    .area-button {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 0;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--secondary-background-color);
      border: none;
      width: 100%;
      height: 125px;
      text-align: left;
      color: var(--primary-text-color);
      position: relative;
      min-width: 0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .area-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .area-button.selected {
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    /* Home button specific styling */
    .area-button.home-button {
      height: 60px;
    }

    /* Background image styles */
    .area-button.has-picture {
      position: relative;
      background: var(--secondary-background-color);
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-button.has-picture.text-dark {
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .area-button.has-picture:hover .area-background {
      opacity: 0.8;
    }

    /* Sidebar items are a container with a full-size select button. Other
       controls in the item (light toggle, notification shortcut) are siblings
       of that button and are never nested inside it. */
    .area-button-action {
      position: absolute;
      inset: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: inherit;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    .area-button-action:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -3px;
    }

    @supports selector(:has(*)) {
      .area-button-action:focus-visible {
        outline: none;
      }

      .area-button:has(> .area-button-action:focus-visible) {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      .area-button.selected:has(> .area-button-action:focus-visible) {
        outline-color: var(--primary-text-color);
      }
    }

    /* Clicks on the item content fall through to the select button. */
    .area-button > :not(.area-button-action),
    .area-button::before,
    .area-button::after {
      pointer-events: none;
    }

    .area-button .area-light-toggle,
    .area-button .home-notification-shortcut {
      pointer-events: auto;
    }

    /* Area items used to be native buttons; keep the typography they had. */
    .area-button:not(.home-button) {
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      line-height: normal;
    }

    .area-light-toggle {
      position: relative;
      margin: 0;
      font-family: inherit;
      line-height: inherit;
    }

    @media (pointer: coarse) {
      /* At least a 44px hit area around the small light badge on touch. */
      .area-light-toggle::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100%;
        min-width: 44px;
        height: 44px;
        transform: translate(-50%, -50%);
      }
    }

    /* Area content structure */
    .area-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      height: 100%;
      justify-content: space-between;
    }

    .area-top-section {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
    }

    .area-bottom-section {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 4px;
    }

    /* Enhanced text styling for picture backgrounds */
    .area-button.has-picture .area-name,
    .area-button.has-picture .area-sensors {
      text-shadow: var(--area-picture-text-shadow);
      color: var(--area-picture-text-color);
    }

    /* Area main icon in sidebar - override home view styling */
    .sidebar .area-main-icon {
      position: absolute;
      left: -25px;
      bottom: -25px;
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-color) 60%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-main-icon {
      background: rgba(255,255,255,0.2);
    }

    .sidebar .area-main-icon ha-icon {
      --mdc-icon-size: 40px;
      color: var(--primary-color);
    }

    /* Info badges container */
    .area-info-badges {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      align-items: center;
    }

    /* Legacy area-icon styles (still used for simple buttons) */
    .area-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-icon {
      background: rgba(255,255,255,0.2);
    }

    /* Legacy area-info styles (still used for simple buttons) */
    .area-info {
      flex: 1;
    }

    .area-menu-chevron {
      display: none;
    }

    .home-notification-shortcut {
      box-sizing: border-box;
      position: relative;
      z-index: 2;
      min-width: 42px;
      height: 28px;
      margin-left: auto;
      padding: 0 7px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      flex-shrink: 0;
      cursor: pointer;
      color: #dc2626;
      background: color-mix(in srgb, #ef4444 12%, var(--card-background-color));
      box-shadow:
        inset 0 0 0 1px rgba(220, 38, 38, 0.08),
        0 6px 14px rgba(220, 38, 38, 0.1);
    }

    .home-notification-shortcut ha-icon {
      --mdc-icon-size: 15px;
    }

    .home-notification-count {
      min-width: 17px;
      height: 17px;
      padding: 0 5px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #e13f3f;
      color: #ffffff;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
    }

    .area-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 2px;
    }

    .area-sensors {
      font-size: 13px;
      opacity: 0.8;
      font-weight: 500;
    }

    /* Legacy area-alerts styles (still used for simple buttons without badges) */
    .area-alerts {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--error-color);
      color: var(--text-primary-color);
      font-size: 11px;
      font-weight: bold;
      flex-shrink: 0;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      overflow-anchor: none;
      overscroll-behavior: auto;
      -webkit-overflow-scrolling: touch;
      padding: 16px;
      /* Set while the bottom navigation is shown on wide screens (wall tablet mode). */
      padding-bottom: var(--dd-next-bottom-nav-space, 16px);
    }

    .content-area.settings-content-area {
      padding: 0;
      background:
        linear-gradient(180deg,
          color-mix(in srgb, var(--primary-color) 4%, transparent) 0,
          transparent 220px),
        var(--primary-background-color);
    }

    .settings-page-view {
      /* Distance of the save bar from the bottom of the screen. */
      --dd-settings-bar-bottom: var(--dd-next-bottom-nav-space, 16px);
      width: min(1180px, calc(100% - 32px));
      min-height: 100%;
      margin: 0 auto;
      padding: 18px 0 calc(24px + var(--dd-next-bottom-nav-space, 0px));
      box-sizing: border-box;
    }

    .settings-page-header {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: 16px;
      margin: 0 0 16px;
      padding: 16px 18px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 18px;
      background:
        linear-gradient(135deg,
          color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color)) 0%,
          color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color)) 100%);
      box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
    }

    .settings-page-back,
    .settings-primary {
      appearance: none;
      border: 0;
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .settings-page-back {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      color: var(--primary-text-color);
    }

    .settings-page-back ha-icon {
      --mdc-icon-size: 22px;
    }

    .settings-page-title {
      min-width: 0;
    }

    .settings-page-title h1 {
      margin: 0;
      font-size: clamp(22px, 2vw, 30px);
      line-height: 1.08;
      font-weight: 850;
      color: var(--primary-text-color);
      letter-spacing: 0;
    }

    .settings-page-title p {
      margin: 5px 0 0;
      color: var(--secondary-text-color);
      font-size: 14px;
      line-height: 1.35;
    }

    .settings-primary {
      min-height: 40px;
      padding: 0 22px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
    }

    .settings-primary {
      background: var(--primary-color);
      color: var(--text-primary-color);
      box-shadow: 0 10px 24px color-mix(in srgb, var(--primary-color) 24%, transparent);
    }

    .settings-primary:disabled {
      opacity: 0.45;
      cursor: default;
      box-shadow: none;
    }

    .settings-page-editor {
      overflow: hidden;
      border-radius: 18px;
      background: var(--card-background-color);
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      box-shadow: 0 16px 46px rgba(15, 23, 42, 0.08);
    }

    .settings-page-editor dwains-dashboard-next-strategy-editor {
      display: block;
    }

    .settings-save-bar {
      position: sticky;
      bottom: var(--dd-settings-bar-bottom);
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 14px 0 0;
      padding: 8px 8px 8px 16px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 62%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      box-shadow: 0 16px 34px rgba(15, 23, 42, 0.13);
      backdrop-filter: blur(18px) saturate(170%);
      -webkit-backdrop-filter: blur(18px) saturate(170%);
    }

    .settings-save-status {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.3;
    }

    .settings-save-text {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .settings-save-dot {
      flex: 0 0 auto;
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--success-color, #43a047);
    }

    .settings-save-bar.is-dirty .settings-save-status {
      color: var(--primary-text-color);
    }

    .settings-save-bar.is-dirty .settings-save-dot {
      background: var(--warning-color, #ff9800);
    }

    .settings-save-bar.is-saving .settings-save-dot {
      background: var(--primary-color);
      animation: dd-settings-saving 1s ease-in-out infinite;
    }

    .settings-save-bar.is-error {
      border-radius: 18px;
      border-color: color-mix(in srgb, var(--error-color) 40%, transparent);
    }

    .settings-save-bar.is-error .settings-save-status {
      color: var(--error-color);
    }

    .settings-save-bar.is-error .settings-save-dot {
      background: var(--error-color);
    }

    .settings-save-bar .settings-primary {
      flex: 0 0 auto;
    }

    @keyframes dd-settings-saving {
      50% { opacity: 0.3; }
    }

    @media (prefers-reduced-motion: reduce) {
      .settings-save-bar.is-saving .settings-save-dot {
        animation: none;
      }
    }

    /* Ruimte voor de mobiele onderbalk */
    @media (max-width: 768px) {
      .content-area {
        padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px));
      }
    }

    /* Wall tablet mode: press and hold these to open the wall tablet menu. */
    [data-dd-wall-tablet-hold] {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Home View */
    .home-view {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0px; /*24px;*/
    }

    /* Home Welcome */
    .home-welcome {
      text-align: left;
      margin-bottom: 28px;
      padding: 0;
      background: color-mix(in srgb, var(--card-background-color) 97%, var(--primary-background-color));
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
    }

    .welcome-content {
      margin: 0 auto;
      padding: 18px 22px;
    }

    .welcome-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 18px;
      margin-bottom: 0;
    }

    .welcome-user {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .welcome-avatar {
      border: 0;
      padding: 0;
      display: inline-flex;
      width: 52px;
      height: 52px;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      appearance: none;
      -webkit-appearance: none;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      border-radius: 999px;
      cursor: pointer;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.1),
        0 0 0 3px rgba(255, 255, 255, 0.72);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .welcome-avatar:hover {
      transform: translateY(-1px);
    }

    .welcome-avatar:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .welcome-avatar ha-icon {
      --mdc-icon-size: 26px;
    }

    .welcome-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .welcome-avatar-initials {
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: 0;
    }

    .welcome-copy {
      min-width: 0;
    }

    .welcome-text {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .welcome-greeting {
      font-size: 22px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }

    .welcome-name {
      font-size: 28px;
      font-weight: 750;
      color: var(--primary-text-color);
    }

    .welcome-title {
      display: none;
    }

    .welcome-return {
      display: block;
      margin-top: 5px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 650;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .welcome-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .welcome-action {
      position: relative;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .welcome-action:hover {
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .welcome-action ha-icon {
      --mdc-icon-size: 22px;
    }

    .welcome-action:active {
      transform: scale(0.96);
    }

    .welcome-action-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      min-width: 17px;
      height: 17px;
      padding: 0 5px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--error-color);
      color: #fff;
      font-size: 10px;
      font-weight: 850;
      line-height: 1;
      box-shadow: 0 0 0 2px var(--card-background-color);
    }

    .welcome-time-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      min-width: 112px;
      line-height: 1.1;
    }

    .welcome-time {
      font-size: 34px;
      font-weight: 800;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
    }

    .welcome-date {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 650;
    }

    .welcome-subheader {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      margin-top: 14px;
    }

    .welcome-alarm {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 8px 16px;
      border: 0;
      border-radius: 20px;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-alarm.alarm-armed {
      background: var(--error-color);
      color: var(--text-primary-color);
    }

    .welcome-alarm.alarm-disarmed {
      background: var(--success-color);
      color: var(--text-primary-color);
    }

    .welcome-alarm.alarm-triggered {
      background: var(--error-color);
      color: var(--text-primary-color);
      animation: pulse 2s infinite;
    }

    .welcome-alarm:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-alarm ha-icon {
      --mdc-icon-size: 18px;
    }

    .alarm-text {
      font-size: 14px;
      font-weight: 600;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.7; }
      100% { opacity: 1; }
    }

    .welcome-weather {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 8px 16px;
      border: 0;
      background: var(--primary-color);
      color: var(--text-primary-color);
      font: inherit;
      text-align: left;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-weather:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-weather ha-icon {
      --mdc-icon-size: 20px;
    }

    .weather-temp {
      font-size: 16px;
      font-weight: 600;
    }

    .weather-label {
      font-size: 12px;
      font-weight: 750;
      line-height: 1;
      opacity: 0.82;
      text-transform: uppercase;
      letter-spacing: 0;
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .home-welcome {
        text-align: left;
        margin: -10px -10px 16px;
        padding: calc(18px + env(safe-area-inset-top, 0px)) 20px 16px;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color)) 0%,
            color-mix(in srgb, var(--card-background-color) 92%, var(--primary-background-color)) 100%);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
      }

      .welcome-content {
        padding: 0;
      }

      .welcome-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 0;
      }

      .welcome-user {
        gap: 10px;
        flex: 1 1 auto;
      }

      .welcome-avatar {
        display: inline-flex;
        width: 38px;
        height: 38px;
        border-radius: 999px;
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.1),
          0 0 0 3px rgba(255, 255, 255, 0.72);
      }

      .welcome-avatar ha-icon {
        --mdc-icon-size: 21px;
      }

      .welcome-avatar-initials {
        font-size: 14px;
      }

      .welcome-text {
        display: block;
      }

      .welcome-greeting,
      .welcome-name {
        display: none;
      }

      .welcome-title {
        display: block;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .welcome-return {
        display: block;
        margin-top: 3px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.1;
      }

      .welcome-time-section {
        display: none;
      }

      .welcome-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
      }

      .welcome-action {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--card-background-color) 86%, var(--primary-background-color));
        box-shadow:
          0 8px 20px color-mix(in srgb, var(--primary-text-color) 10%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }

      .welcome-action ha-icon {
        --mdc-icon-size: 21px;
      }

      .welcome-subheader {
        justify-content: flex-start;
        gap: 8px;
        margin-top: 16px;
        overflow-x: auto;
        padding-bottom: 2px;
        scrollbar-width: none;
      }

      .welcome-subheader::-webkit-scrollbar {
        display: none;
      }

      .welcome-alarm,
      .welcome-weather {
        min-width: auto;
        height: 42px;
        padding: 0 14px;
        justify-content: center;
        border-radius: 999px;
        flex: 0 0 auto;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .alarm-text,
      .weather-temp {
        font-size: 15px;
      }

      .weather-label {
        font-size: 11px;
      }
    }

    @media (max-width: 480px) {
      .home-welcome {
        padding: calc(16px + env(safe-area-inset-top, 0px)) 18px 14px;
        margin-bottom: 14px;
      }

      .welcome-header {
        gap: 10px;
      }

      .welcome-avatar {
        width: 36px;
        height: 36px;
      }

      .welcome-title {
        font-size: 14px;
      }

      .welcome-return {
        font-size: 11px;
      }

      .welcome-action {
        width: 40px;
        height: 40px;
      }

      .welcome-alarm,
      .welcome-weather {
        height: 40px;
        padding: 0 13px;
        font-size: 14px;
      }

      .alarm-text,
      .weather-temp {
        font-size: 14px;
      }

      .weather-label {
        font-size: 11px;
      }
    }

    /* Home Status Cards */
    .home-status-section {
      margin-bottom: 48px;
    }

    .home-status-heading {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 14px;
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 850;
      line-height: 1.1;
    }

    .home-status-heading ha-icon {
      --mdc-icon-size: 20px;
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .home-camera-section {
      --home-section-color: #ef4444;
      margin-bottom: 36px;
    }

    .home-camera-section .home-status-heading ha-icon {
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #ef4444 8%, transparent);
    }

    .home-summaries-section {
      --home-section-color: #f59e0b;
      margin-bottom: 36px;
    }

    .home-summaries-section .home-status-heading ha-icon {
      color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 13%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
    }

    .home-todos-section {
      --home-section-color: #7c3aed;
      margin-bottom: 36px;
    }

    .home-todos-section .home-status-heading ha-icon {
      color: #7c3aed;
      background: color-mix(in srgb, #7c3aed 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #7c3aed 8%, transparent);
    }

    .home-todos-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      align-items: start;
      gap: 12px;
    }

    .home-todo-card,
    .home-todo-card dwains-dashboard-next-card-host {
      display: block;
      min-width: 0;
    }

    .home-custom-cards-section {
      --home-section-color: #0ea5a8;
      margin-bottom: 36px;
    }

    .home-custom-cards-section .home-status-heading ha-icon {
      color: #0ea5a8;
      background: color-mix(in srgb, #0ea5a8 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #0ea5a8 20%, transparent);
    }

    .home-custom-cards-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      align-items: start;
      gap: 12px;
    }

    .home-custom-card,
    .home-custom-card dwains-dashboard-next-card-host {
      display: block;
      min-width: 0;
    }

    /* Scenes & scripts: compact chips that run a scene or script on tap. */
    .home-scenes-section {
      --home-section-color: #db2777;
      position: relative;
      margin-bottom: 36px;
    }

    .home-scenes-section .home-status-heading ha-icon {
      color: var(--home-section-color);
      background: color-mix(in srgb, var(--home-section-color) 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--home-section-color) 8%, transparent);
    }

    .home-scenes-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .home-scene-chip {
      --scene-color: var(--home-section-color, var(--primary-color));
      appearance: none;
      box-sizing: border-box;
      min-width: 0;
      max-width: 280px;
      min-height: 56px;
      padding: 8px 16px 8px 8px;
      display: inline-flex;
      align-items: center;
      gap: 11px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      border-radius: 12px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 8px 20px color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      -webkit-tap-highlight-color: transparent;
      transition:
        transform 0.16s ease,
        border-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .home-scene-chip:hover:not(:disabled) {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--scene-color) 35%, transparent);
      box-shadow: 0 12px 26px color-mix(in srgb, var(--scene-color) 13%, transparent);
    }

    .home-scene-chip:active:not(:disabled) {
      transform: scale(0.97);
    }

    .home-scene-chip:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--scene-color) 70%, #ffffff);
      outline-offset: 2px;
    }

    .home-scene-chip:disabled {
      cursor: not-allowed;
      opacity: 0.55;
      box-shadow: none;
    }

    .home-scene-chip:disabled .home-scene-icon {
      color: var(--secondary-text-color);
      background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
    }

    .home-scene-chip.is-pending {
      cursor: progress;
    }

    .home-scene-icon {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 9px;
      color: var(--scene-color);
      background: color-mix(in srgb, var(--scene-color) 14%, transparent);
      transition:
        color 0.2s ease,
        background-color 0.2s ease;
    }

    .home-scene-icon ha-icon {
      --mdc-icon-size: 21px;
    }

    .home-scene-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .home-scene-name {
      font-size: 14px;
      font-weight: 850;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-scene-meta {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
    }

    .home-scene-meta-text {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Waiting for Home Assistant: the icon breathes. */
    .home-scene-chip.is-pending .home-scene-icon {
      animation: dd-scene-pending 0.9s ease-in-out infinite;
    }

    /* Done: a short green check. */
    .home-scene-chip.is-success {
      border-color: color-mix(in srgb, var(--success-color, #43a047) 45%, transparent);
    }

    .home-scene-chip.is-success .home-scene-icon {
      color: #ffffff;
      background: var(--success-color, #43a047);
      animation: dd-scene-done 0.3s ease-out;
    }

    .home-scene-chip.is-success .home-scene-meta {
      color: var(--success-color, #43a047);
    }

    /* A script that is still running. */
    .home-scene-chip.is-running .home-scene-icon {
      color: #ffffff;
      background: var(--scene-color);
    }

    .home-scene-chip.is-running .home-scene-meta {
      color: var(--scene-color);
    }

    .home-scene-running-dot {
      width: 7px;
      height: 7px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: currentColor;
      animation: dd-scene-running 1.2s ease-in-out infinite;
    }

    @keyframes dd-scene-pending {
      50% { transform: scale(0.88); opacity: 0.6; }
    }

    @keyframes dd-scene-done {
      from { transform: scale(0.8); }
      to { transform: scale(1); }
    }

    @keyframes dd-scene-running {
      50% { opacity: 0.25; }
    }

    @media (prefers-reduced-motion: reduce) {
      .home-scene-chip.is-pending .home-scene-icon,
      .home-scene-chip.is-success .home-scene-icon,
      .home-scene-running-dot {
        animation: none;
      }

      .home-scene-chip.is-pending .home-scene-icon {
        opacity: 0.6;
      }

      .home-scene-chip:hover:not(:disabled),
      .home-scene-chip:active:not(:disabled) {
        transform: none;
      }
    }

    :host([data-theme-dark]) .home-scene-chip {
      background:
        linear-gradient(180deg,
          color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
          color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 12px 26px rgba(0, 0, 0, 0.24),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    :host([data-theme-dark]) .home-scene-chip:not(.is-running, .is-success, :disabled) .home-scene-icon {
      background: color-mix(in srgb, var(--scene-color) 20%, transparent);
    }

    .dd-visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }

    .home-summary-list {
      width: min(100%, 980px);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .home-summary-card {
      appearance: none;
      width: 100%;
      min-height: 68px;
      padding: 12px 14px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 13px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      border-radius: 10px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 8px 20px color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      transition:
        transform 0.16s ease,
        border-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .home-summary-card:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--summary-color) 35%, transparent);
      box-shadow: 0 12px 26px color-mix(in srgb, var(--summary-color) 13%, transparent);
    }

    .home-summary-card:active {
      transform: scale(0.992);
    }

    .home-summary-card:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--summary-color) 70%, #ffffff);
      outline-offset: 2px;
    }

    .home-summary-icon {
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      color: var(--summary-color);
      background: color-mix(in srgb, var(--summary-color) 14%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-icon ha-icon {
      --mdc-icon-size: 21px;
    }

    .home-summary-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .home-summary-title {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 850;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-subtitle {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-chevron {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 48%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-chevron ha-icon {
      --mdc-icon-size: 20px;
    }

    .home-camera-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
    }

    .home-camera-card {
      position: relative;
      min-height: 168px;
      overflow: hidden;
      border: 0;
      border-radius: 12px;
      display: flex;
      align-items: stretch;
      padding: 0;
      background: color-mix(in srgb, var(--primary-text-color) 12%, var(--card-background-color));
      color: #ffffff;
      cursor: pointer;
      text-align: left;
      box-shadow:
        0 16px 32px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .home-camera-card:hover {
      transform: translateY(-2px);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.16);
    }

    .home-camera-card:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .home-camera-image,
    .home-camera-placeholder {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .home-camera-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 20% 20%, rgba(var(--rgb-primary-color, 3, 169, 244), 0.28), transparent 34%),
        linear-gradient(135deg, #192133, #0f172a);
    }

    .home-camera-placeholder ha-icon {
      --mdc-icon-size: 44px;
      color: rgba(255, 255, 255, 0.58);
    }

    .home-camera-card::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 52%;
      background:
        linear-gradient(180deg,
          rgba(7, 11, 18, 0) 0%,
          rgba(7, 11, 18, 0.34) 42%,
          rgba(7, 11, 18, 0.84) 100%);
      pointer-events: none;
    }

    .home-camera-content {
      position: relative;
      z-index: 1;
      width: 100%;
      min-height: 168px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .home-camera-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .home-camera-area-icon,
    .home-camera-count {
      min-width: 36px;
      height: 36px;
      border-radius: 11px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      backdrop-filter: blur(12px);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.12);
    }

    .home-camera-area-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .home-camera-count {
      min-width: 44px;
      padding: 0 10px;
      gap: 5px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 850;
    }

    .home-camera-count ha-icon {
      --mdc-icon-size: 14px;
    }

    .home-camera-copy {
      min-width: 0;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.62);
    }

    .home-camera-name {
      font-size: 18px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-camera-meta {
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.76);
      font-size: 12px;
      font-weight: 720;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-home-section,
    .mobile-section-heading {
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-home-section.mobile-home-areas {
      display: block;
      margin: 0 0 36px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 0;
      margin-bottom: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-action {
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-rail {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 16px;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-card {
      appearance: none;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 156px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: space-between;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 14px 30px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      transition:
        transform 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease;
    }

    .layout-container.sidebar-collapsed .mobile-area-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--primary-color) 22%, transparent);
      box-shadow: 0 18px 38px color-mix(in srgb, var(--primary-text-color) 11%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture {
      min-height: 176px;
      color: var(--mobile-area-picture-text-color, #ffffff);
      border-color: rgba(255, 255, 255, 0.16);
      background: #182044;
      --mobile-area-picture-text-color: #ffffff;
      --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --mobile-area-picture-overlay:
        linear-gradient(180deg, rgba(12, 18, 32, 0.02) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.84) 100%),
        linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
    }

    .layout-container.sidebar-collapsed .mobile-area-picture {
      position: absolute;
      inset: 0;
      z-index: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background: var(--mobile-area-picture-overlay);
      pointer-events: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-top,
    .layout-container.sidebar-collapsed .mobile-area-copy {
      position: relative;
      z-index: 2;
    }

    .layout-container.sidebar-collapsed .mobile-area-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .layout-container.sidebar-collapsed .mobile-area-icon {
      width: 44px;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 8px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 13%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-icon ha-icon {
      --mdc-icon-size: 23px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-icon {
      color: var(--mobile-area-picture-text-color, #ffffff);
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(12px);
    }

    .layout-container.sidebar-collapsed .mobile-area-badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 5px;
      min-width: 0;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge {
      min-width: 25px;
      height: 25px;
      padding: 0 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border-radius: 999px;
      color: var(--area-badge-color, var(--primary-color));
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 12%, transparent);
      font-size: 11px;
      font-weight: 850;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-badge {
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
    }

    .layout-container.sidebar-collapsed .mobile-area-name {
      font-size: 16px;
      font-weight: 850;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-meta {
      margin-top: 5px;
      color: color-mix(in srgb, var(--primary-text-color) 56%, transparent);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-name,
    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta {
      color: var(--mobile-area-picture-text-color, #ffffff);
      text-shadow: var(--mobile-area-picture-text-shadow);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta {
      color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
    }

    /* Person Cards Section */
    .person-cards-section {
      margin-bottom: 32px;
    }

    .person-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin: 0 auto;
    }

    .person-card {
      --person-color: #8a94a6;
      --person-bg: color-mix(in srgb, var(--person-color) 8%, var(--card-background-color));
      position: relative;
      min-height: 98px;
      padding: 16px 18px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      overflow: hidden;
      border: 1px solid rgba(15, 23, 42, 0.07);
      border-radius: 18px;
      background:
        radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--person-color) 15%, transparent), transparent 42%),
        var(--person-bg);
      cursor: pointer;
      box-shadow:
        0 16px 34px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px rgba(255, 255, 255, 0.34);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        border-color 0.18s ease;
    }

    .person-card::after {
      content: "";
      position: absolute;
      left: 18px;
      right: 18px;
      bottom: 0;
      height: 3px;
      border-radius: 999px 999px 0 0;
      background: var(--person-color);
      opacity: 0.34;
    }

    .person-card.home {
      --person-color: #2f9b62;
      --person-bg: color-mix(in srgb, #2f9b62 10%, var(--card-background-color));
    }

    .person-card.away {
      --person-color: ${l(m("alarm_control_panel"))};
      --person-bg: color-mix(in srgb, ${l(m("alarm_control_panel"))} 9%, var(--card-background-color));
    }

    .person-card.unknown {
      --person-color: ${l(m("sensor"))};
      --person-bg: color-mix(in srgb, ${l(m("sensor"))} 8%, var(--card-background-color));
    }

    .person-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--person-color) 24%, transparent);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-card:active {
      transform: scale(0.988);
    }

    .person-card:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--person-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .person-avatar-wrapper {
      position: relative;
      z-index: 1;
      flex-shrink: 0;
    }

    .person-avatar {
      width: 64px;
      height: 64px;
      border-radius: 22px;
      overflow: hidden;
      background: color-mix(in srgb, var(--person-color) 14%, var(--secondary-background-color));
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid color-mix(in srgb, var(--person-color) 26%, rgba(255, 255, 255, 0.84));
      box-shadow: 0 12px 24px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .person-avatar ha-icon {
      --mdc-icon-size: 34px;
      color: var(--person-color);
    }

    .person-home-indicator {
      position: absolute;
      bottom: -5px;
      right: -5px;
      width: 26px;
      height: 26px;
      background: var(--person-color);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid var(--card-background-color);
      box-shadow: 0 8px 18px color-mix(in srgb, var(--person-color) 26%, transparent);
    }

    .person-home-indicator ha-icon {
      --mdc-icon-size: 14px;
      color: var(--text-primary-color);
    }

    .person-info {
      position: relative;
      z-index: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .person-name {
      font-size: 18px;
      font-weight: 850;
      color: var(--primary-text-color);
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status {
      display: inline-flex;
      width: max-content;
      max-width: 100%;
      align-items: center;
      gap: 6px;
      min-height: 27px;
      padding: 0 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--person-color) 12%, transparent);
      color: var(--person-color);
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status ha-icon {
      --mdc-icon-size: 15px;
    }

    .person-details {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 7px;
      align-items: flex-end;
      justify-content: flex-end;
      flex-shrink: 0;
      margin-left: auto;
      max-width: 170px;
    }

    .person-battery,
    .person-distance {
      display: flex;
      align-items: center;
      gap: 5px;
      min-height: 28px;
      font-size: 12px;
      font-weight: 800;
      color: color-mix(in srgb, var(--primary-text-color) 72%, transparent);
      background: rgba(255, 255, 255, 0.62);
      padding: 0 9px;
      border-radius: 999px;
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
    }

    .person-battery ha-icon,
    .person-distance ha-icon {
      --mdc-icon-size: 14px;
    }

    .person-battery ha-icon {
      color: var(--success-color);
    }

    .person-battery ha-icon[icon*="alert"] {
      color: var(--error-color);
    }

    .person-distance ha-icon {
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .person-cards-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 12px;
      }

      .person-card {
        padding: 16px;
      }

      .person-avatar {
        width: 64px;
        height: 64px;
      }

      .person-avatar ha-icon {
        --mdc-icon-size: 36px;
      }

      .person-name {
        font-size: 16px;
      }

      .person-status {
        font-size: 13px;
      }

      .person-details {
        gap: 8px;
      }

      .person-battery,
      .person-distance {
        font-size: 12px;
        padding: 3px 6px;
      }
    }

    .home-status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 20px;
      margin: 0 auto;
    }

    .home-status-card {
      background: var(--card-background-color);
      border-radius: 20px;
      padding: 24px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid var(--divider-color);
      position: relative;
      overflow: hidden;
    }

    .home-status-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .home-status-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-color);
    }

    .home-status-card:hover::before {
      opacity: 1;
    }

    .home-status-card .status-card-icon {
      position: relative;
      margin-bottom: 16px;
    }

    .home-status-card .status-card-icon ha-icon {
      --mdc-icon-size: 36px;
      color: var(--primary-color);
      transition: transform 0.3s ease;
    }

    .home-status-card:hover .status-card-icon ha-icon {
      transform: scale(1.1);
    }

    .home-status-card .status-card-badge {
      position: absolute;
      top: -10px;
      right: -10px;
      background: var(--accent-color);
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .home-status-card .status-card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-top: 8px;
    }



    /* Area Info Badges */
    .area-info-badges {
      position: absolute;
      top: 5px;
      right: 0px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-width: calc(59% - 24px);
      justify-content: flex-end;
      align-items: flex-start;
      z-index: 2;
    }

    .info-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      font-size: 12px;
      flex-shrink: 0;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .info-badge ha-icon {
      --mdc-icon-size: 14px;
    }

    .info-badge.light {
      background: color-mix(in srgb, var(--badge-color, ${l(m("light"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("light"))});
    }

    .info-badge.switch {
      background: color-mix(in srgb, var(--badge-color, ${l(m("switch"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("switch"))});
    }

    .info-badge.climate {
      background: color-mix(in srgb, var(--badge-color, ${l(m("climate"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("climate"))});
    }

    .info-badge.media_player {
      background: color-mix(in srgb, var(--badge-color, ${l(m("media_player"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("media_player"))});
    }

    .info-badge.cover {
      background: color-mix(in srgb, var(--badge-color, ${l(m("camera"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("camera"))});
    }

    .info-badge.fan {
      background: color-mix(in srgb, var(--badge-color, #2b8fcb) 10%, var(--card-background-color));
      color: var(--badge-color, #2b8fcb);
    }

    .info-badge.motion {
      background: color-mix(in srgb, var(--badge-color, ${l(m("alarm_control_panel"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("alarm_control_panel"))});
    }

    .info-badge.alerts {
      background: color-mix(in srgb, var(--error-color) 10%, var(--card-background-color));
      color: var(--error-color);
    }

    /* Sidebar info badges (smaller) */
    .sidebar .info-badge {
      padding: 2px 6px;
      font-size: 11px;
      border-radius: 12px;
    }

    .sidebar .info-badge ha-icon {
      --mdc-icon-size: 12px;
    }

    .sidebar .badge-count {
      min-width: 14px;
      text-align: center;
    }

    /* Clickable badges */
    .info-badge.clickable {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .info-badge.clickable:hover {
      transform: scale(1.05);
      filter: brightness(1.1);
    }

    /* Color fallbacks for themes without custom colors */
    :host {
      --purple-color: #9c27b0;
      --blue-color: #2196f3;
    }

    /* Area View */
    .area-view {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Entities Section */
    .entities-section {
      display: grid;
      gap: 16px;
    }

    .domain-group {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 16px;
    }

    .domain-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .domain-header ha-icon {
      --mdc-icon-size: 20px;
      opacity: 0.8;
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

    .entity-card-wrapper {
      min-height: 60px;
      position: relative;
    }

    .cover-entity-card,
    .light-entity-card,
    .motion-entity-card {
      min-height: 72px;
    }

    .sensor-entity-card {
      min-height: 150px;
    }

    .cover-entity-card dwains-dashboard-next-card-host,
    .light-entity-card dwains-dashboard-next-card-host,
    .sensor-entity-card dwains-dashboard-next-card-host,
    .motion-entity-card dwains-dashboard-next-card-host {
      display: block;
    }

    .mobile-area-overview,
    .mobile-entities-section {
      display: none;
    }

    .area-view .mobile-entities-section {
      display: grid;
      position: relative;
      z-index: 2;
    }

    .mobile-entities-section {
      gap: 22px;
    }

    .mobile-domain-group {
      min-width: 0;
      position: relative;
    }

    .mobile-domain-group.group-editing {
      border-radius: 8px;
      transition: opacity 0.16s ease, outline-color 0.16s ease, background-color 0.16s ease;
    }

    .mobile-domain-group.group-dragging {
      opacity: 0.46;
    }

    .mobile-domain-group.group-drag-over {
      outline: 2px solid var(--primary-color);
      outline-offset: 7px;
      background: color-mix(in srgb, var(--primary-color) 5%, transparent);
    }

    .mobile-domain-group:not(.menu-open) {
      contain: layout style paint;
    }

    .mobile-domain-group.menu-open {
      z-index: 1200;
    }

    .mobile-domain-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 0 2px;
      margin-bottom: 10px;
    }

    .mobile-domain-title {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .mobile-domain-header-actions {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      flex: 0 0 auto;
    }

    .mobile-domain-order-button,
    .mobile-domain-drag-handle {
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 78%, transparent);
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    .mobile-domain-drag-handle {
      cursor: grab;
      touch-action: none;
    }

    .mobile-domain-drag-handle:active {
      cursor: grabbing;
    }

    .mobile-domain-order-button:disabled {
      opacity: 0.28;
      cursor: default;
    }

    .mobile-domain-order-button ha-icon,
    .mobile-domain-drag-handle ha-icon {
      --mdc-icon-size: 18px;
    }

    .mobile-layout-toggle {
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 72%, #ffffff);
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-layout-toggle.active {
      background: #182044;
      color: #ffffff;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.14);
    }

    .mobile-layout-toggle:active {
      transform: scale(0.94);
    }

    .mobile-layout-toggle ha-icon {
      --mdc-icon-size: 17px;
    }

    .mobile-layout-toggle.static {
      cursor: default;
      pointer-events: none;
    }

    /* Home section headings: the section icon, then the tools at the end. */
    .mobile-section-icon {
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 999px;
      color: var(--home-section-color, var(--primary-color));
      background: color-mix(in srgb, var(--home-section-color, var(--primary-color)) 12%, transparent);
    }

    .mobile-section-icon ha-icon {
      --mdc-icon-size: 17px;
    }

    .mobile-section-tools {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex: 0 0 auto;
    }

    .mobile-section-toggle {
      appearance: none;
      width: 28px;
      height: 28px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-section-toggle:hover {
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      color: var(--primary-text-color);
    }

    .mobile-section-toggle:active {
      transform: scale(0.94);
    }

    .mobile-section-toggle:focus-visible,
    .mobile-section-action:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .mobile-section-toggle ha-icon {
      --mdc-icon-size: 18px;
    }

    .mobile-domain-title-copy {
      min-width: 0;
      display: inline-flex;
      align-items: baseline;
      gap: 7px;
    }

    .mobile-domain-title-label {
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 900;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-domain-count {
      color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
      font-size: 12px;
      font-weight: 850;
      line-height: 1.1;
      white-space: nowrap;
    }

    .mobile-domain-master {
      --mobile-domain-accent: var(--primary-color);
      min-width: 58px;
      height: 30px;
      padding: 0 5px 0 7px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        border-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
      z-index: 1202;
    }

    .mobile-domain-master.domain-light {
      --mobile-domain-accent: #e89a17;
    }

    .mobile-domain-master.domain-switch,
    .mobile-domain-master.domain-input_boolean {
      --mobile-domain-accent: #3275d6;
    }

    .mobile-domain-master.domain-cover {
      --mobile-domain-accent: #0d98aa;
    }

    .mobile-domain-master.domain-fan {
      --mobile-domain-accent: #2d9d79;
    }

    .mobile-domain-master.domain-lock {
      --mobile-domain-accent: #7657c8;
    }

    .mobile-domain-master.active {
      border-color: color-mix(in srgb, var(--mobile-domain-accent) 42%, transparent);
      background: color-mix(in srgb, var(--mobile-domain-accent) 11%, var(--card-background-color));
      color: var(--mobile-domain-accent);
    }

    .mobile-domain-master:active {
      transform: scale(0.94);
    }

    .mobile-domain-master ha-icon {
      --mdc-icon-size: 16px;
    }

    .mobile-domain-master-track {
      position: relative;
      width: 26px;
      height: 16px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      transition: background-color 0.18s ease;
    }

    .mobile-domain-master-track::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.24);
      transition: transform 0.18s ease;
    }

    .mobile-domain-master.active .mobile-domain-master-track {
      background: var(--mobile-domain-accent);
    }

    .mobile-domain-master.active .mobile-domain-master-track::after {
      transform: translateX(10px);
    }

    .mobile-domain-master-actions {
      --mobile-domain-accent: var(--primary-color);
      height: 30px;
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      z-index: 1202;
    }

    .mobile-domain-master-actions.domain-cover {
      --mobile-domain-accent: #0d98aa;
    }

    .mobile-domain-master-actions.domain-lock {
      --mobile-domain-accent: #7657c8;
    }

    .mobile-domain-master-action {
      width: 34px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-domain-master-action + .mobile-domain-master-action {
      border-left: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    }

    .mobile-domain-master-action:hover,
    .mobile-domain-master-action.active {
      background: color-mix(in srgb, var(--mobile-domain-accent) 12%, var(--card-background-color));
      color: var(--mobile-domain-accent);
    }

    .mobile-domain-master-action:active {
      transform: scale(0.88);
    }

    .mobile-domain-master-action ha-icon {
      --mdc-icon-size: 17px;
    }

    .mobile-entity-rail {
      display: flex;
      gap: 10px;
      margin: 0 -10px;
      padding: 0 10px 2px;
      overflow-x: auto;
      scroll-padding: 10px;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .mobile-entity-rail::-webkit-scrollbar {
      display: none;
    }

    .mobile-entities-section.layout-grid {
      gap: 26px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: 0;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
      align-items: stretch;
    }

    .mobile-entities-section.layout-grid .mobile-entity-card {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      flex: none;
      scroll-snap-align: none;
    }

    @media (max-width: 380px) {
      .mobile-entities-section.layout-grid .mobile-entity-rail {
        grid-template-columns: 1fr;
      }
    }

    .mobile-entity-card {
      --entity-color: var(--primary-color);
      position: relative;
      box-sizing: border-box;
      contain: layout style;
      flex: 0 0 164px;
      min-width: 0;
      min-height: 128px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 10px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      scroll-snap-align: start;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .mobile-entity-replacement-card {
      box-sizing: border-box;
      flex: 0 0 260px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-replacement-card dwains-dashboard-next-card-host {
      display: block;
      width: 100%;
    }

    .mobile-todo-list-card {
      box-sizing: border-box;
      flex: 0 0 min(100%, 520px);
      width: min(100%, 520px);
      min-width: min(100%, 320px);
      scroll-snap-align: start;
    }

    .mobile-todo-list-card dwains-dashboard-next-card-host {
      display: block;
      width: 100%;
    }

    .mobile-entities-section.layout-grid .mobile-entity-replacement-card {
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-todo-list-card {
      grid-column: 1 / -1;
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entity-card:active {
      transform: scale(0.985);
      }

      .mobile-entity-card.is-active {
        box-shadow:
          0 14px 30px rgba(15, 23, 42, 0.08),
          inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 18%, transparent);
      }

      .mobile-entity-card.is-unavailable {
        opacity: 0.62;
      }

    .mobile-entity-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .mobile-entity-icon {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 11px;
      color: var(--entity-color);
      background: color-mix(in srgb, var(--entity-color) 13%, transparent);
    }

      .mobile-entity-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .mobile-entity-action {
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border: 0;
        cursor: pointer;
        transition:
          background-color 0.18s ease,
          color 0.18s ease,
          transform 0.18s ease,
          opacity 0.18s ease;
      }

      .mobile-entity-action:active {
        transform: scale(0.94);
      }

      .mobile-entity-action:disabled {
        opacity: 0.36;
        cursor: not-allowed;
      }

      .mobile-entity-toggle {
        width: 38px;
        height: 22px;
        justify-content: flex-start;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.07),
          0 4px 10px rgba(15, 23, 42, 0.08);
      }

    .mobile-entity-toggle::before {
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition: transform 0.18s ease;
      }

      .mobile-entity-card.is-active .mobile-entity-toggle {
        background: var(--entity-color);
      }

    .mobile-entity-card.is-active .mobile-entity-toggle::before {
      transform: translateX(16px);
    }

      .mobile-entity-more,
      .mobile-scene-action,
      .mobile-lock-action {
        width: 30px;
        height: 30px;
        border-radius: 999px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }

      .mobile-lock-action.is-unlocked {
        color: #ffffff;
        background: var(--entity-color);
        box-shadow: 0 8px 16px color-mix(in srgb, var(--entity-color) 24%, transparent);
      }

      .mobile-entity-more ha-icon,
      .mobile-scene-action ha-icon,
      .mobile-lock-action ha-icon {
        --mdc-icon-size: 17px;
      }

      .mobile-cover-actions {
        min-height: 32px;
        padding: 3px;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        flex: 0 0 auto;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 74%, #ffffff);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.055),
          0 6px 14px rgba(15, 23, 42, 0.08);
      }

      .mobile-cover-action {
        width: 26px;
        height: 26px;
        border-radius: 999px;
        color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        background: transparent;
      }

      .mobile-cover-action.active {
        color: #ffffff;
        background: var(--entity-color);
        box-shadow: 0 6px 12px color-mix(in srgb, var(--entity-color) 22%, transparent);
      }

      .mobile-cover-action ha-icon {
        --mdc-icon-size: 16px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-actions {
        min-height: 30px;
        padding: 3px;
        gap: 2px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-action {
        width: 24px;
        height: 24px;
      }

      .mobile-entities-section.layout-grid .mobile-cover-action ha-icon {
        --mdc-icon-size: 15px;
      }

      @media (max-width: 430px) {
        .mobile-entities-section.layout-grid .mobile-entity-card {
          min-height: 138px;
          padding: 12px;
        }

        .mobile-entities-section.layout-grid .mobile-entity-top {
          gap: 6px;
        }

        .mobile-entities-section.layout-grid .mobile-entity-icon {
          width: 34px;
          height: 34px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-actions {
          min-height: 28px;
          padding: 2px;
          gap: 1px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-action {
          width: 23px;
          height: 23px;
        }

        .mobile-entities-section.layout-grid .mobile-cover-action ha-icon {
          --mdc-icon-size: 14px;
        }
      }

    .mobile-entity-meta {
      color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
      font-size: 11px;
      font-weight: 750;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

      .mobile-entity-name {
        margin-top: 3px;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 900;
      line-height: 1.08;
      overflow: hidden;
      display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .mobile-entity-status {
        margin-top: 5px;
        color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
        font-size: 11px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-entity-content {
        min-width: 0;
      }

      .mobile-entity-card.has-inline-select {
        min-height: 170px;
        justify-content: flex-start;
        gap: 10px;
      }

      .mobile-entity-card.has-inline-select .mobile-entity-content {
        margin-top: auto;
      }

      .mobile-entity-card.has-inline-select .mobile-entity-status {
        display: none;
      }

      .mobile-entity-select {
        position: relative;
        display: block;
        width: 100%;
      }

      .mobile-entity-select select {
        width: 100%;
        height: 34px;
        padding: 0 34px 0 12px;
        border: 0;
        border-radius: 999px;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--entity-color) 10%, var(--secondary-background-color));
        font: inherit;
        font-size: 12px;
        font-weight: 850;
        line-height: 34px;
        cursor: pointer;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 16%, transparent),
          0 8px 18px rgba(15, 23, 42, 0.06);
      }

      .mobile-entity-select select:focus {
        box-shadow:
          inset 0 0 0 2px color-mix(in srgb, var(--entity-color) 72%, transparent),
          0 10px 22px color-mix(in srgb, var(--entity-color) 14%, transparent);
      }

      .mobile-entity-select select:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .mobile-entity-select ha-icon {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        color: color-mix(in srgb, var(--entity-color) 72%, var(--primary-text-color));
        pointer-events: none;
        --mdc-icon-size: 18px;
      }

    /* Sidebar: blueprint-pagina's + toevoegknop */
    .sidebar-divider {
      height: 1px;
      background: var(--divider-color);
      margin: 8px 12px;
    }
    .dd-add-page {
      width: 100%;
      box-sizing: border-box;
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 14px;
      transition: background-color .2s ease, color .2s ease, border-color .2s ease;
    }
    .dd-add-page:hover {
      color: var(--primary-color);
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .08);
    }
    .dd-add-page ha-icon { --mdc-icon-size: 20px; }

    /* Blueprint-paginakaart */
    .dd-page-card { margin-top: 8px; }
    .dd-page-card dwains-dashboard-next-card-host { display: block; }

    /* Area custom card slots */
    .dd-custom-section {
      margin: 12px 0;
      min-width: 0;
    }

    .dd-custom-section.after-domain {
      margin: 12px 0 2px;
    }

    .dd-custom-section.editing {
      padding: 10px;
      border: 1px dashed color-mix(in srgb, var(--primary-color) 28%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 4%, transparent);
    }

    .dd-custom-section.drag-over {
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 22%, transparent);
    }

    .dd-custom-slot-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      color: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.2;
    }

    .dd-custom-slot-title {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .dd-custom-slot-title ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-color);
    }

    .dd-custom-slot-title span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dd-custom-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 8px;
      container-type: inline-size;
    }

    .dd-custom-grid > .dd-custom-card-wrap,
    .dd-custom-grid > .dd-add-card {
      --dd-card-default-column: span 4;
      grid-column: var(--dd-card-grid-column, var(--dd-card-default-column));
      min-height: var(--dd-card-grid-min-height, 0);
    }

    .dd-custom-card-wrap {
      position: relative;
      min-width: 0;
      border-radius: 12px;
    }

    .dd-custom-card-wrap.editing {
      outline: 1px solid color-mix(in srgb, var(--divider-color) 78%, transparent);
      outline-offset: 2px;
      cursor: grab;
    }

    .dd-generated-card-wrap {
      display: contents;
    }

    .dd-generated-card-wrap.editing {
      position: relative;
      display: block;
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
      cursor: grab;
      outline: 1px dashed color-mix(in srgb, var(--primary-color) 38%, var(--divider-color));
      outline-offset: 2px;
      border-radius: 12px;
      transition: opacity 0.16s ease, outline-color 0.16s ease, transform 0.16s ease;
    }

    .dd-generated-card-wrap.editing > .mobile-entity-card,
    .dd-generated-card-wrap.editing > .mobile-entity-replacement-card,
    .dd-generated-card-wrap.editing > .mobile-todo-list-card {
      width: 100%;
      min-width: 0;
      pointer-events: none;
    }

    .dd-generated-card-wrap.editing.is-hidden > :not(.dd-generated-card-toolbar) {
      opacity: 0.38;
      filter: saturate(0.45);
    }

    .dd-generated-card-wrap.editing.dragging {
      opacity: 0.42;
      cursor: grabbing;
    }

    .dd-generated-card-wrap.editing.drag-over {
      outline-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 14%, transparent);
      transform: translateY(-2px);
    }

    .dd-generated-card-toolbar {
      position: absolute;
      top: 7px;
      right: 7px;
      z-index: 6;
      display: flex;
      gap: 4px;
      padding: 3px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 94%, transparent);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .dd-generated-card-toolbar button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }

    .dd-generated-card-toolbar button:first-child {
      color: var(--primary-color);
      cursor: grab;
    }

    .dd-generated-card-toolbar button:hover,
    .dd-generated-card-toolbar button:focus-visible {
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      outline: none;
    }

    .dd-generated-card-toolbar ha-icon {
      --mdc-icon-size: 17px;
    }

    .mobile-entities-section.layout-grid .dd-generated-card-wrap.editing {
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .dd-custom-card-wrap.dragging {
      opacity: 0.48;
      cursor: grabbing;
    }

    .dd-custom-card-wrap.drag-over {
      outline-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .dd-card-toolbar {
      position: absolute; top: 6px; right: 6px; z-index: 4;
      display: none; gap: 4px;
    }
    .dd-custom-card-wrap.editing .dd-card-toolbar { display: flex; }
    .dd-card-toolbar button {
      display: inline-flex; align-items: center; justify-content: center;
      width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer;
      background: var(--card-background-color);
      box-shadow: 0 1px 4px rgba(0,0,0,.2);
      color: var(--primary-text-color);
    }
    .dd-card-toolbar button.del:hover { color: var(--error-color, #f44336); }
    .dd-card-toolbar ha-icon { --mdc-icon-size: 18px; }

    .dd-card-toolbar button.drag {
      cursor: grab;
      color: var(--primary-color);
    }

    .dd-card-toolbar button.drag:active {
      cursor: grabbing;
    }

    .dd-add-card-inline,
    .dd-add-card {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 72px; width: 100%;
      border: 2px dashed var(--divider-color); border-radius: 12px;
      background: transparent; cursor: pointer;
      color: var(--secondary-text-color); font-weight: 600; font-size: .9rem;
      transition: border-color .2s ease, color .2s ease, background-color .2s ease;
    }
    .dd-add-card:hover {
      border-color: var(--primary-color); color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .06);
    }

    .dd-add-card-inline {
      min-height: 32px;
      width: auto;
      padding: 0 12px;
      border-radius: 999px;
      border-width: 1px;
      font-size: 12px;
      white-space: nowrap;
    }

    .dd-add-card-inline ha-icon {
      --mdc-icon-size: 16px;
    }

    .dd-add-card ha-icon { --mdc-icon-size: 22px; }

    .dd-domain-add-card {
      min-height: 72px;
      border-width: 1px;
      background: color-mix(in srgb, var(--secondary-background-color) 54%, transparent);
      opacity: 0.82;
    }

    .dd-domain-add-card:hover,
    .dd-domain-add-card.drag-over {
      opacity: 1;
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .entities-grid .dd-custom-card-wrap,
    .entities-grid .dd-domain-add-card {
      min-width: 0;
    }

    .entities-grid > .dd-custom-card-wrap.dd-grid-full,
    .mobile-entities-section.layout-grid .mobile-entity-rail > .dd-custom-card-wrap.dd-grid-full {
      grid-column: 1 / -1;
      width: 100%;
    }

    .mobile-entity-rail .dd-custom-card-wrap,
    .mobile-entity-rail .dd-domain-add-card {
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-rail > .dd-custom-card-wrap.dd-grid-full {
      flex-basis: calc(100% - 20px);
    }

    .mobile-entity-rail .dd-domain-add-card {
      min-height: 128px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-custom-card-wrap,
    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card {
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card {
      min-height: 138px;
    }

    @container (max-width: 899px) {
      .dd-custom-grid > .dd-custom-card-wrap,
      .dd-custom-grid > .dd-add-card {
        --dd-card-default-column: span 6;
      }
    }

    @container (max-width: 559px) {
      .dd-custom-grid > .dd-custom-card-wrap,
      .dd-custom-grid > .dd-add-card {
        --dd-card-default-column: span 12;
      }
    }

    .entity-card-wrapper.loading {
      background: var(--secondary-background-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Loading skeleton */
    .skeleton {
      background: linear-gradient(90deg,
        var(--secondary-background-color) 25%,
        var(--primary-background-color) 50%,
        var(--secondary-background-color) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        right: 0;
        top: 0;
        width: 280px;
        flex-basis: auto;
        height: 100%;
        transform: translateX(100%);
        z-index: 121;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
      }

      .sidebar-resize-handle {
        display: none;
      }

      .sidebar-collapse-toggle {
        display: none;
      }

      .floor-areas {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .area-button {
        margin-bottom: 8px;
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .mobile-nav-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 120;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .mobile-nav-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .global-header {
        padding: 12px;
      }

      .header-time {
        font-size: 20px;
      }



      .entities-grid {
        grid-template-columns: 1fr;
      }

      .global-header.mobile .header-expand-button[data-extra-count]::after {
        right: -8px;
      }

      .mobile-home-section,
      .home-camera-section,
      .home-status-section,
      .home-todos-section,
      .home-custom-cards-section,
      .home-favorites-section,
      .home-summaries-section,
      .mobile-domain-group,
      .mobile-entities-section.layout-grid .mobile-entity-card {
        content-visibility: visible;
        contain-intrinsic-size: auto;
      }
    }

    /* Empty states: an area without entities, a removed area, no areas at all. */
    .dd-empty-state {
      max-width: 420px;
      margin: 32px auto;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      text-align: center;
      color: var(--secondary-text-color);
    }

    .area-view-missing {
      padding-top: 48px;
    }

    .dd-empty-state-icon {
      width: 56px;
      height: 56px;
      margin-bottom: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .dd-empty-state-icon ha-icon {
      --mdc-icon-size: 28px;
    }

    .dd-empty-state-title {
      color: var(--primary-text-color);
      font-size: 17px;
      font-weight: 800;
      line-height: 1.25;
    }

    .dd-empty-state-text {
      font-size: 14px;
      line-height: 1.45;
    }

    .dd-empty-state-actions {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }

    .dd-empty-state-button {
      appearance: none;
      min-height: 36px;
      padding: 0 14px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      color: var(--primary-color);
      font: inherit;
      font-size: 13px;
      font-weight: 750;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        transform 0.18s ease;
    }

    .dd-empty-state-button:hover {
      background: color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .dd-empty-state-button:active {
      transform: scale(0.97);
    }

    .dd-empty-state-button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .dd-empty-state-button.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #ffffff);
    }

    .dd-empty-state-button ha-icon {
      --mdc-icon-size: 18px;
    }

    .home-no-areas {
      margin: 0 0 36px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--card-background-color);
    }

    .home-no-areas-icon {
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 13px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .home-no-areas-copy {
      min-width: 0;
      flex: 1 1 auto;
    }

    .home-no-areas-title {
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 800;
      line-height: 1.2;
    }

    .home-no-areas-text {
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.35;
    }

    .home-no-areas .dd-empty-state-button {
      flex: 0 0 auto;
      padding: 0 10px 0 14px;
    }

    @media (max-width: 768px) {
      .home-no-areas {
        margin: 0 8px 18px;
        flex-wrap: wrap;
      }

      .home-no-areas-copy {
        flex: 1 1 180px;
      }

      .home-no-areas .dd-empty-state-button {
        margin-left: 56px;
      }
    }

    /* Favorites Section */
    .favorites-section {
      margin-bottom: 24px;
    }

    .favorites-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 18px;
      font-weight: 500;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
    }

    .favorite-card-wrapper {
      --favorite-color: var(--primary-color);
      appearance: none;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 116px;
      padding: 14px 14px 13px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 9px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-card-wrapper:hover {
      transform: translateY(-2px);
      box-shadow:
        0 16px 30px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 20%, transparent);
    }

    .favorite-card-wrapper:active {
      transform: scale(0.985);
    }

    .favorite-card-wrapper:focus-visible,
    .favorite-quick-action:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--favorite-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .favorite-card-wrapper.is-off,
    .favorite-card-wrapper.is-idle {
      --favorite-color: color-mix(in srgb, var(--secondary-text-color) 56%, var(--primary-color));
    }

    .favorite-card-wrapper.favorite-light {
      --favorite-color: ${l(m("light"))};
    }

    .favorite-card-wrapper.favorite-switch {
      --favorite-color: ${l(m("switch"))};
    }

    .favorite-card-wrapper.favorite-cover {
      --favorite-color: ${l(m("camera"))};
    }

    .favorite-card-wrapper.favorite-binary_sensor,
    .favorite-card-wrapper.favorite-motion {
      --favorite-color: ${l(m("sensor"))};
    }

    .favorite-card-wrapper.favorite-climate,
    .favorite-card-wrapper.favorite-weather {
      --favorite-color: ${l(m("climate"))};
    }

    .favorite-card-wrapper.favorite-media_player {
      --favorite-color: ${l(m("media_player"))};
    }

    .favorite-card-wrapper.favorite-person {
      --favorite-color: ${l(m("sensor"))};
    }

    .favorite-card-wrapper.favorite-sun {
      --favorite-color: #2d7eea;
    }

    .favorite-top,
    .favorite-body {
      position: relative;
      z-index: 1;
    }

    .favorite-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .favorite-icon {
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 10px;
      color: var(--favorite-color);
      background: color-mix(in srgb, var(--favorite-color) 13%, transparent);
    }

    .favorite-icon ha-icon {
      --mdc-icon-size: 19px;
    }

    .favorite-quick-action {
      --toggle-track: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
      width: 38px;
      height: 22px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      color: transparent;
      background: var(--toggle-track);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.07),
        0 4px 10px rgba(15, 23, 42, 0.08);
      font: inherit;
      cursor: pointer;
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-quick-action::before {
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-card-wrapper.is-active .favorite-quick-action {
      background: var(--favorite-color);
    }

    .favorite-card-wrapper.is-active .favorite-quick-action::before {
      transform: translateX(16px);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action {
      width: 30px;
      height: 30px;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
      background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action::before {
      display: none;
    }

    .favorite-card-wrapper.info-only .favorite-quick-action ha-icon {
      display: block;
      --mdc-icon-size: 17px;
    }

    .favorite-quick-action ha-icon {
      display: none;
    }

    .favorite-quick-action:active {
      transform: scale(0.94);
    }

    .favorite-name {
      color: inherit;
      margin-top: 2px;
      font-size: 14px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .favorite-state {
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      font-size: 11px;
      font-weight: 750;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .favorite-area {
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
      font-size: 11px;
      font-weight: 750;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([data-theme-dark]) {
      .favorite-card-wrapper {
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 90%, #ffffff 4%),
            color-mix(in srgb, var(--card-background-color) 98%, #000000 3%));
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.28),
          inset 0 1px 0 rgba(255, 255, 255, 0.045),
          inset 0 0 0 1px rgba(255, 255, 255, 0.045);
      }

      .favorite-card-wrapper:hover {
        box-shadow:
          0 18px 34px rgba(0, 0, 0, 0.36),
          inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 30%, transparent);
      }

      .favorite-quick-action {
        --toggle-track: rgba(255, 255, 255, 0.14);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.08),
          0 5px 12px rgba(0, 0, 0, 0.28);
      }

      .favorite-card-wrapper.info-only .favorite-quick-action {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(248, 250, 252, 0.82);
      }
    }


    /* Header Expanded Content Styling */
    .global-header.expanded {
      border-bottom: 2px solid var(--primary-color);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .header-expanded-content {
      background: var(--card-background-color);
      padding: 16px;
      border-top: 1px solid var(--divider-color);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-expanded-content .header-favorites {
      max-width: 100%;
    }

    /* Favorites Section Styling */
    .favorites-section {
      width: 100%;
    }

    .favorites-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .favorites-header ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .favorites-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      width: 100%;
    }

    .favorite-tile-wrapper {
      width: 100%;
      min-height: 60px;
    }

    .favorite-tile {
      width: 100% !important;
      height: auto !important;
    }

    .no-favorites {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      border: 1px dashed var(--divider-color);
    }

    .no-favorites ha-icon {
      --mdc-icon-size: 32px;
      margin-bottom: 8px;
      opacity: 0.6;
    }

    .no-favorites p {
      margin: 0;
      font-size: 14px;
    }

    /* Header Expand Button Enhanced Styling */
    .header-expand-button {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--primary-color);
      background: var(--card-background-color);
      color: var(--primary-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-expand-button:hover {
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .header-expand-button ha-icon {
      --mdc-icon-size: 20px;
      transition: transform 0.3s ease;
    }

    .global-header.expanded .header-expand-button {
      bottom: -20px;
    }

    /* Mobile specific adjustments for expanded header */
    @media (max-width: 768px) {
      .header-expanded-content {
        padding: 12px;
      }

      .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }

      .header-expand-button {
        width: 36px;
        height: 36px;
        bottom: -18px;
      }

      .header-expand-button ha-icon {
        --mdc-icon-size: 18px;
      }
    }

    /* Home and header status cards */
    .home-status-card,
    .status-card-compact {
      --status-color: var(--primary-color);
      --status-bg: color-mix(in srgb, var(--status-color) 16%, transparent);
    }

    .home-status-card.cover,
    .status-card-compact.cover {
      --status-color: ${l(m("camera"))};
    }

    .home-status-card.binary_sensor,
    .home-status-card.motion,
    .status-card-compact.binary_sensor,
    .status-card-compact.motion {
      --status-color: ${l(m("sensor"))};
    }

    .home-status-card.light,
    .status-card-compact.light {
      --status-color: ${l(m("light"))};
    }

    .home-status-card.switch,
    .status-card-compact.switch {
      --status-color: ${l(m("switch"))};
    }

    .home-status-card.climate,
    .home-status-card.house-climate-card,
    .status-card-compact.climate {
      --status-color: ${l(m("climate"))};
    }

    .home-status-card.person,
    .status-card-compact.person {
      --status-color: ${l(m("sensor"))};
    }

    .home-status-card.media_player,
    .status-card-compact.media_player {
      --status-color: ${l(m("media_player"))};
    }

    .home-status-card.fan,
    .status-card-compact.fan {
      --status-color: #2b8fcb;
    }

    .home-status-card.wattage,
    .home-status-card.house-power-card,
    .home-status-card.energy,
    .status-card-compact.wattage,
    .status-card-compact.energy {
      --status-color: ${l(m("energy"))};
    }

    .home-status-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 170px));
      justify-content: start;
      gap: 12px;
    }

    .home-status-card {
      min-height: 134px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: var(--card-background-color);
      text-align: left;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .home-status-card::before {
      top: auto;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--status-color);
      opacity: 0.55;
    }

    .home-status-card:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--status-color) 40%, transparent);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
    }

    .home-status-card:hover::before {
      opacity: 0.85;
    }

    .home-status-card .status-card-icon {
      width: 48px;
      height: 48px;
      margin: 0 0 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .home-status-card .status-card-icon ha-icon {
      --mdc-icon-size: 25px;
      color: var(--status-color);
      transform: none;
    }

    .home-status-card:hover .status-card-icon ha-icon {
      transform: none;
    }

    .home-status-card .status-card-badge {
      top: -8px;
      right: -8px;
      width: auto;
      min-width: 24px;
      height: 24px;
      padding: 0 7px;
      border-radius: 999px;
      background: var(--status-color);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 5px 12px color-mix(in srgb, var(--status-color) 28%, transparent);
    }

    .home-status-card .status-card-title {
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
    }

    .home-status-card.has-value .status-card-title {
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 800;
    }

    .home-status-card .status-card-value {
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: 0;
      white-space: nowrap;
    }

    .home-status-card.house-persons-card {
      --status-color: #182044;
      grid-column: span 2;
      min-width: 240px;
      gap: 12px;
    }

    .home-status-card.house-power-card {
      --status-color: ${l(m("energy"))};
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .home-status-card.house-climate-card {
      --status-color: ${l(m("climate"))};
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .house-persons-head {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .home-status-card.house-persons-card .house-persons-icon,
    .home-status-card.house-climate-card .house-climate-icon,
    .home-status-card.house-power-card .house-power-icon {
      width: 42px;
      height: 42px;
      margin: 0;
      flex: 0 0 auto;
      border-radius: 13px;
    }

    .house-persons-copy,
    .house-climate-copy,
    .house-power-copy {
      min-width: 0;
      text-align: left;
    }

    .house-persons-title,
    .house-climate-title,
    .house-power-title {
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-persons-subtitle,
    .house-persons-empty,
    .house-climate-subtitle,
    .house-power-subtitle,
    .house-power-empty {
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
    }

    .house-climate-head {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .house-climate-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .house-climate-metric {
      min-width: 0;
      min-height: 48px;
      padding: 8px 9px;
      border: 0;
      border-radius: 12px;
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr);
      align-items: center;
      column-gap: 8px;
      background: color-mix(in srgb, var(--metric-color) 12%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 14%, transparent);
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .house-climate-metric:active {
      transform: scale(0.97);
    }

    .house-climate-metric-icon {
      width: 26px;
      height: 26px;
      border-radius: 9px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--metric-color) 18%, transparent);
      color: var(--metric-color);
    }

    .house-climate-metric-icon ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-climate-metric-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-climate-metric-value,
    .house-climate-metric-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-climate-metric-value {
      font-size: 14px;
      font-weight: 900;
      color: var(--primary-text-color);
    }

    .house-climate-metric-label {
      font-size: 11px;
      font-weight: 750;
      color: var(--secondary-text-color);
    }

    .house-power-head {
      width: 100%;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .house-power-total {
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
    }

    .house-power-list {
      width: 100%;
      display: grid;
      gap: 7px;
    }

    .house-power-room {
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 8px;
      row-gap: 4px;
    }

    .house-power-room-icon {
      width: 26px;
      height: 26px;
      grid-row: span 2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      background: color-mix(in srgb, var(--status-color) 12%, transparent);
      color: var(--status-color);
    }

    .house-power-room-icon ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-power-room-name,
    .house-power-room-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-power-room-name {
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
    }

    .house-power-room-value {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
    }

    .house-power-bar {
      position: relative;
      height: 5px;
      grid-column: 2 / -1;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 10%, var(--secondary-background-color));
    }

    .house-power-bar-fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: linear-gradient(90deg, ${l(m("energy"))}, #f4c34d);
    }

    .house-persons-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 7px;
    }

    .house-person-mini {
      appearance: none;
      min-width: 0;
      min-height: 42px;
      padding: 6px;
      display: flex;
      align-items: center;
      gap: 7px;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-background-color) 78%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        transform 0.18s ease;
    }

    .house-person-mini:active {
      transform: scale(0.97);
    }

    .house-person-mini.is-home {
      background: color-mix(in srgb, #2f9b62 13%, var(--card-background-color));
    }

    .house-person-mini.is-away {
      background: color-mix(in srgb, ${l(m("alarm_control_panel"))} 10%, var(--card-background-color));
    }

    .house-person-avatar {
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 12%, transparent);
      color: var(--status-color);
    }

    .house-person-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .house-person-avatar ha-icon {
      --mdc-icon-size: 16px;
    }

    .house-person-mini-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-person-mini-name,
    .house-person-mini-state {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .house-person-mini-name {
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-person-mini-state {
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 700;
      line-height: 1.1;
    }

    /* No tracker: neutral, clearly not "home", "away" or "in a zone". */
    .house-person-mini.is-unknown .house-person-avatar {
      opacity: 0.6;
      filter: grayscale(1);
    }

    .house-person-mini.is-unknown .house-person-mini-state {
      color: var(--disabled-text-color, var(--secondary-text-color));
      font-style: italic;
    }

    .house-persons-more {
      appearance: none;
      min-width: 0;
      min-height: 42px;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--status-color) 10%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
      font-weight: 850;
      cursor: pointer;
      transition: transform 0.18s ease;
    }

    .house-persons-more:active {
      transform: scale(0.97);
    }

    .house-persons-more:focus-visible,
    .house-person-mini:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    /* Dark theme colors for the house cards, at every screen width. */
    :host([data-theme-dark]) {
      .home-status-card.house-persons-card {
        --status-color: #8ea8ff;
      }

      .home-status-card.house-power-card {
        --status-color: #f2b447;
      }

      .home-status-card.house-climate-card {
        --status-color: #64c8e8;
      }

      .house-person-mini {
        background: color-mix(in srgb, var(--card-background-color) 78%, #ffffff 5%);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
      }

      .house-person-mini.is-home {
        background: color-mix(in srgb, #2f9b62 20%, var(--card-background-color));
      }

      .house-person-mini.is-away {
        background: color-mix(in srgb, ${l(m("alarm_control_panel"))} 16%, var(--card-background-color));
      }

      .house-persons-more {
        background: color-mix(in srgb, var(--status-color) 16%, var(--card-background-color));
      }
    }

    .header-status-scroll {
      gap: 10px;
      padding: 2px 2px 4px;
    }

    .status-card-compact {
      flex: 0 0 auto;
      min-width: 92px;
      max-width: 150px;
      min-height: 70px;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 7px 12px 9px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: var(--card-background-color);
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
    }

    .status-card-compact:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--status-color) 36%, transparent);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
    }

    .status-card-compact .status-card-icon-compact {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .status-card-compact .status-card-icon-compact ha-icon {
      --mdc-icon-size: 20px;
      color: var(--status-color);
    }

    .status-card-compact .status-card-badge-compact {
      top: -7px;
      right: -8px;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--status-color);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 4px 10px color-mix(in srgb, var(--status-color) 26%, transparent);
    }

    .status-card-compact .status-card-title-compact {
      width: 100%;
      margin-top: 5px;
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
      opacity: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .status-card-compact.has-value .status-card-title-compact {
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
      display: block;
    }

    .status-card-subtitle-compact {
      width: 100%;
      margin-top: 1px;
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 750;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .home-status-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        margin: 0;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-section {
        margin: 0 -10px 18px;
      }

      .home-camera-section .home-status-heading {
        display: none;
      }

      .home-summaries-section {
        margin: 0 -10px 18px;
      }

      .home-summaries-section .home-status-heading {
        display: none;
      }

      .home-todos-section {
        margin: 0 -10px 18px;
      }

      .home-todos-section .home-status-heading {
        display: none;
      }

      .home-todos-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
        padding: 2px 18px 16px;
      }

      .home-custom-cards-section {
        min-width: 0;
        margin: 0 -10px 18px;
      }

      .home-custom-cards-section .home-status-heading {
        display: none;
      }

      .home-custom-cards-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
        padding: 2px 18px 16px;
      }

      .home-scenes-section {
        min-width: 0;
        margin: 0 -10px 18px;
      }

      .home-scenes-list {
        flex-wrap: nowrap;
        gap: 8px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-scenes-list::-webkit-scrollbar {
        display: none;
      }

      .home-scenes-section.layout-grid .home-scenes-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-scene-chip {
        flex: 0 0 auto;
        max-width: 220px;
        border-radius: 14px;
        scroll-snap-align: start;
      }

      .home-scenes-section.layout-grid .home-scene-chip {
        width: 100%;
        max-width: none;
        scroll-snap-align: none;
      }

      .home-summary-list {
        width: auto;
        display: flex;
        flex-direction: column;
        padding: 2px 18px 16px;
        gap: 8px;
      }

      .home-summary-card {
        min-height: 64px;
        padding: 11px 12px;
        border-radius: 14px;
      }

      .home-summary-icon {
        width: 36px;
        height: 36px;
      }

      .home-camera-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-grid::-webkit-scrollbar {
        display: none;
      }

      .home-camera-section.layout-grid .home-camera-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-camera-card {
        flex: 0 0 226px;
        min-height: 146px;
        border-radius: 18px;
        scroll-snap-align: start;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.11);
      }

      .home-camera-section.layout-grid .home-camera-card {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      .home-camera-content {
        min-height: 146px;
        padding: 13px;
      }

      .home-camera-name {
        font-size: 16px;
      }

      .home-status-grid::-webkit-scrollbar {
        display: none;
      }

      .home-status-card {
        flex: 0 0 126px;
        min-height: 114px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .home-status-card.house-persons-card {
        flex: 0 0 230px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-power-card {
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-climate-card {
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card .status-card-title {
        font-size: 15px;
      }

      .status-card-compact {
        min-width: 88px;
      }

      .home-view {
        max-width: none;
      }

      .person-cards-section {
        display: none;
      }

      .home-status-heading {
        display: none;
      }

      .mobile-home-section {
        display: block;
        margin: 0 -10px 18px;
      }

      .mobile-section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 0 18px;
        margin-bottom: 10px;
      }

      .mobile-section-title {
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .mobile-section-title-label {
        color: var(--primary-text-color);
        font-size: 16px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-section-action {
        appearance: none;
        min-width: 66px;
        height: 28px;
        padding: 0 10px 0 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        color: var(--primary-color);
        font-size: 12px;
        font-weight: 850;
        font: inherit;
        cursor: pointer;
        transition:
          background-color 0.18s ease,
          transform 0.18s ease;
      }

      .mobile-section-action ha-icon {
        --mdc-icon-size: 15px;
      }

      .mobile-section-action:active {
        transform: scale(0.96);
        background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      }

      .mobile-area-rail {
        display: flex;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .mobile-area-rail::-webkit-scrollbar {
        display: none;
      }

      .mobile-home-section.layout-grid .mobile-area-rail {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .mobile-area-card {
        appearance: none;
        position: relative;
        box-sizing: border-box;
        flex: 0 0 152px;
        min-width: 0;
        min-height: 130px;
        padding: 13px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-between;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        border-radius: 18px;
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        color: var(--primary-text-color);
        font: inherit;
        box-shadow: 0 12px 28px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        text-align: left;
        scroll-snap-align: start;
        cursor: pointer;
        transition:
          transform 0.18s ease,
          border-color 0.18s ease,
          box-shadow 0.18s ease;
      }

      .mobile-home-section.layout-grid .mobile-area-card {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .mobile-home-section.layout-grid .mobile-area-rail {
          grid-template-columns: 1fr;
        }
      }

      .mobile-area-card:active {
        transform: scale(0.98);
      }

      .mobile-area-card.has-picture {
        min-height: 146px;
        color: var(--mobile-area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.16);
        background: #182044;
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-card.has-picture.text-dark {
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-picture {
        position: absolute;
        inset: 0;
        z-index: 0;
        background-size: cover;
        background-position: center;
        transform: scale(1.02);
      }

      .mobile-area-card.has-picture::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        background: var(--mobile-area-picture-overlay);
      }

      .mobile-area-top,
      .mobile-area-copy {
        position: relative;
        z-index: 2;
      }

      .mobile-area-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
      }

      .mobile-area-icon {
        width: 42px;
        height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border-radius: 13px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 13%, transparent);
      }

      .mobile-area-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .mobile-area-card.has-picture .mobile-area-icon {
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(12px);
      }

      .mobile-area-badges {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 5px;
        min-width: 0;
      }

      .mobile-area-badge {
        min-width: 24px;
        height: 24px;
        padding: 0 7px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border-radius: 999px;
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 12%, transparent);
        font-size: 11px;
        font-weight: 850;
      }

      .mobile-area-card.has-picture .mobile-area-badge {
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .mobile-area-badge ha-icon {
        --mdc-icon-size: 14px;
      }

      .mobile-area-badge.light {
        --area-badge-color: ${l(m("light"))};
      }

      .mobile-area-badge.cover {
        --area-badge-color: ${l(m("camera"))};
      }

      .mobile-area-badge.motion {
        --area-badge-color: ${l(m("alarm_control_panel"))};
      }

      .mobile-area-name {
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-meta {
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-card.has-picture .mobile-area-meta {
        color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .mobile-area-card.has-picture .mobile-area-name,
      .mobile-area-card.has-picture .mobile-area-meta {
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-icon {
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-name,
      .mobile-area-card.has-picture.text-dark .mobile-area-meta {
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .home-status-section {
        margin: 0 -10px 18px;
      }

      .home-status-section .mobile-section-heading {
        margin-bottom: 10px;
      }

      .home-status-section.layout-grid .home-status-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-status-section.layout-grid .home-status-card {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        flex: none;
        scroll-snap-align: none;
      }

      .home-status-section.layout-grid .house-persons-card,
      .home-status-section.layout-grid .house-climate-card,
      .home-status-section.layout-grid .house-power-card {
        grid-column: 1 / -1;
      }

      @media (max-width: 380px) {
        .home-status-section.layout-grid .home-status-grid {
          grid-template-columns: 1fr;
        }
      }

      .home-status-card::before {
        left: 14px;
        right: 14px;
      }

      .home-status-card .status-card-icon {
        width: 42px;
        height: 42px;
        border-radius: 13px;
        margin-bottom: 16px;
      }

      .home-status-card .status-card-icon ha-icon {
        --mdc-icon-size: 22px;
      }

      .home-status-card .status-card-badge {
        min-width: 23px;
        height: 23px;
        top: -8px;
        right: -9px;
      }

      :host([data-theme-dark]) {
        .home-welcome {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 7%) 0%,
              color-mix(in srgb, var(--card-background-color) 92%, var(--primary-background-color)) 100%);
          box-shadow:
            0 14px 36px rgba(0, 0, 0, 0.34),
            inset 0 -1px 0 rgba(255, 255, 255, 0.04);
        }

        .welcome-avatar {
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.34),
            0 0 0 3px rgba(255, 255, 255, 0.08);
        }

        .welcome-action {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 84%, #ffffff 8%),
              color-mix(in srgb, var(--card-background-color) 94%, #000000 6%));
          box-shadow:
            0 10px 24px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .mobile-area-card {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .mobile-area-card:not(.has-picture) .mobile-area-icon {
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
        }

        .mobile-area-badge {
          background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 20%, transparent);
        }

        .house-climate-metric {
          background: color-mix(in srgb, var(--metric-color) 18%, var(--card-background-color));
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
        }

        .house-power-room-icon {
          background: color-mix(in srgb, var(--status-color) 20%, transparent);
        }

        .house-power-bar {
          background: color-mix(in srgb, var(--status-color) 13%, var(--card-background-color));
        }

        .home-summary-card {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 12px 26px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .home-summary-icon {
          background: color-mix(in srgb, var(--summary-color) 20%, transparent);
        }
      }

      .home-favorites-section {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        margin: 0 -10px 44px;
        padding: 0;
        overflow-x: clip;
      }

      .home-favorites-section .favorites-header {
        display: none;
      }

      .home-favorites-section .mobile-section-heading {
        margin-bottom: 10px;
      }

      .home-favorites-section .favorites-grid {
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        padding: 2px 18px 0;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-favorites-section .favorites-grid::-webkit-scrollbar {
        display: none;
      }

      .home-favorites-section.layout-grid .favorites-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-favorites-section .favorite-card-wrapper {
        flex: 0 0 186px;
        width: auto;
        min-width: 0;
        box-sizing: border-box;
        min-height: 116px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
      }

      .home-favorites-section.layout-grid .favorite-card-wrapper {
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .home-favorites-section.layout-grid .favorites-grid {
          grid-template-columns: 1fr;
        }
      }
    }

    @media (max-width: 768px) {
      :host {
        height: auto;
        max-height: none;
        min-height: 100%;
        overflow: visible;
      }

      .layout-container {
        display: block;
        height: auto;
        max-height: none;
        min-height: 100dvh;
        overflow: visible;
      }

      .main-content {
        display: block;
        min-height: 100dvh;
        overflow: visible;
      }

      .content-area {
        padding: 0;
        height: auto;
        max-height: none;
        min-height: 100dvh;
        overflow: visible;
        overscroll-behavior: auto;
        -webkit-overflow-scrolling: auto;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 5%, var(--primary-background-color)) 0%,
            var(--primary-background-color) 150px);
      }

      .content-area.home-content-area {
        padding-bottom: 0;
      }

      .content-area.area-content-area {
        padding: 0 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .content-area.settings-content-area {
        padding: 0;
      }

      .home-view {
        padding: 10px 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-view {
        /* Same clearance as the other sheets above the bottom navigation. */
        --dd-settings-bar-bottom: calc(82px + env(safe-area-inset-bottom, 0px));
        width: 100%;
        margin: 0;
        padding: 8px 10px calc(152px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-header {
        gap: 12px;
        margin: 0 0 12px;
        padding: 12px 14px;
        border-radius: 18px;
        border-top: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.07);
      }

      .settings-page-back {
        width: 42px;
        height: 42px;
      }

      .settings-page-title h1 {
        font-size: 21px;
      }

      .settings-page-title p {
        margin-top: 3px;
        font-size: 13px;
      }

      .settings-page-editor {
        border-radius: 18px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      }

      .settings-save-bar {
        position: fixed;
        left: 10px;
        right: 10px;
        bottom: var(--dd-settings-bar-bottom);
        z-index: 110;
        margin: 0;
        padding: 6px 6px 6px 14px;
      }

      .global-header.mobile {
        margin: -10px -10px 0;
        padding: 12px 14px 22px;
        border-bottom: 0;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--primary-color) 5%, var(--card-background-color)) 100%);
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .header-content {
        display: block;
      }

      .global-header.mobile .header-status-section {
        width: 100%;
      }

      .global-header.mobile .header-status-scroll {
        gap: 10px;
        padding: 2px 2px 4px;
        scroll-padding: 14px;
      }

      .global-header.mobile .status-card-compact {
        min-width: 112px;
        min-height: 82px;
        padding: 10px 12px 11px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .status-card-compact .status-card-icon-compact {
        width: 40px;
        height: 40px;
        border-radius: 8px;
      }

      .global-header.mobile .status-card-compact .status-card-title-compact {
        margin-top: 7px;
        color: color-mix(in srgb, var(--primary-text-color) 76%, transparent);
        font-size: 12px;
        line-height: 1.15;
      }

      .global-header.mobile .header-expand-button {
        bottom: -18px;
        width: 36px;
        height: 36px;
        border-width: 2px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 8px 20px rgba(3, 169, 244, 0.18);
      }

      .area-view .entities-section,
      .area-view .dd-custom-section {
        position: relative;
        z-index: 2;
      }

      .area-view .entities-section {
        display: none;
      }

      .mobile-area-overview {
        display: block;
        position: relative;
        z-index: 2;
        margin: 12px 0 20px;
      }

      .mobile-entities-section {
        display: grid;
        position: relative;
        z-index: 2;
      }

      .layout-container > .sidebar,
      .sidebar {
        position: fixed !important;
        left: 18px !important;
        right: 18px !important;
        top: auto !important;
        bottom: calc(82px + env(safe-area-inset-bottom, 0px)) !important;
        width: auto !important;
        height: auto !important;
        max-height: min(62vh, 520px);
        padding: 10px;
        overflow-y: auto;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 22px 48px rgba(0, 0, 0, 0.24);
        backdrop-filter: blur(20px);
        transform: translate3d(0, calc(100% + 140px), 0) !important;
        transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
        z-index: 121;
      }

      .layout-container > .sidebar.open,
      .sidebar.open {
        transform: translate3d(0, 0, 0) !important;
      }

      .sidebar::before {
        content: "";
        width: 42px;
        height: 4px;
        margin: 0 auto 10px;
        display: block;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.14);
      }

      .sidebar .area-list {
        padding: 0;
      }

      .sidebar .floor-section {
        margin-bottom: 12px;
      }

      .sidebar .floor-header {
        padding: 6px 12px 9px;
      }

      .sidebar .floor-header h3 {
        font-size: 13px;
        font-weight: 850;
        letter-spacing: 0;
        text-transform: none;
      }

      .sidebar .area-button {
        min-height: 64px;
        height: auto;
        margin-bottom: 8px;
        padding: 11px 12px 11px 56px;
        border-radius: 9px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 97%, #ffffff),
            color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color)));
        box-shadow:
          0 10px 22px rgba(15, 23, 42, 0.07),
          inset 0 1px 0 rgba(255, 255, 255, 0.42);
      }

      .sidebar .area-button.home-button {
        height: 48px;
        min-height: 48px;
        padding: 10px 14px 10px 54px;
        border-radius: 8px;
      }

      .sidebar .area-button.home-button .area-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        width: 34px;
        height: 34px;
        transform: translateY(-50%);
        border-radius: 999px;
      }

      .sidebar .area-button.selected,
      .sidebar .area-button.home-button.selected {
        border-color: color-mix(in srgb, var(--primary-color) 42%, transparent);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 88%, #ffffff 10%),
            var(--primary-color));
        color: var(--text-primary-color);
        box-shadow:
          0 14px 28px color-mix(in srgb, var(--primary-color) 24%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .sidebar .area-content {
        min-height: 42px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto auto;
        align-items: center;
        gap: 3px 10px;
      }

      .sidebar .area-top-section {
        min-width: 0;
        margin-top: 0;
        grid-column: 1;
        grid-row: 1 / span 2;
      }

      .sidebar .area-bottom-section {
        display: contents;
        min-height: 0;
      }

      .sidebar .area-main-icon {
        position: absolute;
        left: -44px;
        top: 50%;
        bottom: auto;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        transform: translateY(-50%);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        box-shadow: none;
      }

      .sidebar .area-main-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .sidebar .area-button.has-picture {
        min-height: 70px;
        color: var(--area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.18);
        background: #182044;
      }

      .sidebar .area-button.has-picture.selected {
        border-color: color-mix(in srgb, var(--primary-color) 44%, rgba(255, 255, 255, 0.18));
        box-shadow:
          0 14px 30px rgba(15, 23, 42, 0.18),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 34%, transparent);
      }

      .sidebar .area-button.has-picture::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        background: var(--area-picture-overlay);
        pointer-events: none;
      }

      .sidebar .area-button.has-picture .area-background {
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-content,
      .sidebar .area-button.has-picture .area-info-badges,
      .sidebar .area-button.has-picture .area-main-icon {
        z-index: 1;
      }

      .sidebar .area-info-badges {
        position: relative;
        top: auto;
        right: auto;
        grid-column: 2;
        grid-row: 1 / span 2;
        max-width: 130px;
        justify-content: flex-end;
        align-self: center;
        gap: 5px;
      }

      .sidebar .area-name {
        max-width: 100%;
        margin: 0;
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .area-sensors {
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.1;
      }

      .sidebar .area-button.has-picture .area-sensors {
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .info-badge {
        min-width: 24px;
        height: 22px;
        padding: 0 7px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
      }

      .sidebar .info-badge ha-icon {
        --mdc-icon-size: 13px;
      }

      .sidebar .badge-count {
        font-size: 11px;
        font-weight: 850;
      }

      .sidebar .area-button.has-picture .info-badge {
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .sidebar .area-button.selected .area-main-icon,
      .sidebar .area-button.selected .area-icon {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
        color: var(--primary-color);
      }

      .sidebar .area-list {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-section {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
        margin-bottom: 10px;
      }

      .sidebar .floor-areas {
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-header {
        margin: 0;
        padding: 4px 6px 2px;
      }

      .sidebar .floor-header h3 {
        color: var(--secondary-text-color);
        font-size: 14px;
        font-weight: 760;
        line-height: 1.2;
      }

      .sidebar .area-button,
      .sidebar .area-button.home-button {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr) auto 22px;
        align-items: center;
        gap: 12px;
        min-height: 68px;
        height: auto;
        margin: 0;
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

      .sidebar .area-button.selected,
      .sidebar .area-button.home-button.selected {
        border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.34);
        background: rgba(255, 255, 255, 0.98);
        color: var(--primary-text-color);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.1),
          inset 3px 0 0 var(--primary-color);
      }

      .sidebar .area-button.home-button .area-icon,
      .sidebar .area-icon,
      .sidebar .area-main-icon {
        position: relative;
        left: auto;
        top: auto;
        bottom: auto;
        grid-column: 1;
        grid-row: 1;
        width: 46px;
        height: 46px;
        border-radius: 8px;
        transform: none;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
        color: var(--primary-color);
        box-shadow: none;
      }

      .sidebar .area-button.home-button .area-icon {
        position: relative;
        left: auto;
        top: auto;
      }

      .sidebar .area-main-icon ha-icon,
      .sidebar .area-icon ha-icon {
        --mdc-icon-size: 24px;
        color: currentColor;
      }

      .sidebar .area-content {
        display: contents;
        width: auto;
        height: auto;
        min-height: 0;
      }

      .sidebar .area-info,
      .sidebar .area-top-section {
        grid-column: 2;
        grid-row: 1;
        min-width: 0;
        margin: 0;
      }

      .sidebar .area-bottom-section {
        display: contents;
      }

      .sidebar .area-name {
        margin: 0;
        color: inherit;
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
      }

      .sidebar .area-sensors {
        margin-top: 4px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 500;
        line-height: 1.1;
      }

      .sidebar .area-info-badges {
        position: relative;
        top: auto;
        right: auto;
        grid-column: 3;
        grid-row: 1;
        max-width: 104px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 4px;
        z-index: 1;
      }

      .sidebar .area-menu-chevron {
        display: block;
        grid-column: 4;
        grid-row: 1;
        z-index: 1;
        --mdc-icon-size: 22px;
        color: rgba(15, 23, 42, 0.52);
        transition: transform 0.18s ease, color 0.18s ease;
      }

      .sidebar .home-notification-shortcut {
        grid-column: 3;
        grid-row: 1;
        justify-self: end;
        width: auto;
        min-width: 44px;
        height: 30px;
        margin-left: 0;
      }

      .sidebar .area-button.selected .area-menu-chevron {
        color: var(--primary-color);
        transform: translateX(2px);
      }

      .sidebar .area-button.has-picture {
        min-height: 68px;
        border-color: rgba(15, 23, 42, 0.12);
        background: rgba(18, 24, 38, 0.9);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.selected {
        border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.48);
        background: rgba(18, 24, 38, 0.92);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.16),
          inset 3px 0 0 var(--primary-color);
      }

      .sidebar .area-button.has-picture .area-background {
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-top-section,
      .sidebar .area-button.has-picture .area-name,
      .sidebar .area-button.has-picture .area-sensors,
      .sidebar .area-button.has-picture .area-menu-chevron,
      .sidebar .area-button.has-picture .area-info-badges,
      .sidebar .area-button.has-picture .area-main-icon,
      .sidebar .area-button.has-picture .area-icon {
        position: relative;
        z-index: 2;
      }

      .sidebar .area-button.has-picture::after {
        background: var(--area-picture-overlay);
      }

      .sidebar .area-button.has-picture .area-name {
        width: fit-content;
        max-width: 100%;
        padding: 4px 8px;
        margin-left: -2px;
        border-radius: 8px;
        color: #ffffff;
        background: linear-gradient(90deg, rgba(8, 13, 24, 0.66), rgba(8, 13, 24, 0.28));
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(2px);
      }

      .sidebar .area-button.has-picture .area-main-icon,
      .sidebar .area-button.has-picture .area-icon {
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
        backdrop-filter: blur(10px);
      }

      .sidebar .area-button.has-picture .area-sensors,
      .sidebar .area-button.has-picture .area-menu-chevron {
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .area-button.has-picture.selected .area-menu-chevron {
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .area-main-icon,
      .sidebar .area-button.has-picture.text-dark .area-icon {
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .info-badge {
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
      }

      .mobile-nav-overlay {
        z-index: 120 !important;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(2px);
      }

      :host([data-theme-dark]) {
        .layout-container > .sidebar,
        .sidebar {
          border-color: rgba(255, 255, 255, 0.1);
          background:
            linear-gradient(180deg, rgba(37, 40, 48, 0.96), rgba(18, 20, 25, 0.94)),
            color-mix(in srgb, var(--card-background-color) 92%, #000000);
          box-shadow:
            0 24px 58px rgba(0, 0, 0, 0.58),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          color: var(--primary-text-color);
        }

        .sidebar::before {
          background: rgba(255, 255, 255, 0.18);
        }

        .sidebar .floor-header h3 {
          color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        }

        .sidebar .area-button {
          border: 1px solid rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 86%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          color: var(--primary-text-color);
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.24);
        }

        .sidebar .area-button.selected,
        .sidebar .area-button.home-button.selected {
          border-color: color-mix(in srgb, var(--primary-color) 42%, transparent);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 12%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 5%));
          color: var(--primary-text-color);
          box-shadow:
            0 14px 30px rgba(0, 0, 0, 0.36),
            inset 3px 0 0 var(--primary-color),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .sidebar .area-button.has-picture {
          border-color: rgba(255, 255, 255, 0.08);
          background: #17202b;
        }

        .sidebar .area-button.has-picture .area-background {
          opacity: 0.58;
        }

        .sidebar .area-button.has-picture:hover .area-background {
          opacity: 0.66;
        }

        .sidebar .area-main-icon,
        .sidebar .area-icon {
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
          color: var(--primary-color);
        }

        .sidebar .area-button.selected .area-main-icon,
        .sidebar .area-button.selected .area-icon {
          background: color-mix(in srgb, var(--primary-color) 24%, transparent);
          color: var(--primary-color);
        }

        .sidebar .area-menu-chevron,
        .sidebar .area-button.selected .area-menu-chevron {
          color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
        }

        .sidebar .area-button.selected .area-menu-chevron {
          color: var(--primary-color);
        }

        .sidebar .area-sensors,
        .sidebar .area-bottom-section {
          color: color-mix(in srgb, var(--primary-text-color) 68%, transparent);
        }

        .sidebar .info-badge {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .home-notification-shortcut {
          color: #ff9a9a;
          background: rgba(239, 68, 68, 0.16);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 8px 18px rgba(0, 0, 0, 0.18);
        }

        .mobile-nav-overlay {
          background: rgba(0, 0, 0, 0.58);
          backdrop-filter: blur(4px);
        }
      }

      .home-view,
      .home-content-area {
        max-width: 100% !important;
        overflow-x: hidden !important;
      }

      .home-view .home-favorites-section {
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 -10px 44px !important;
        padding: 0 !important;
        overflow-x: hidden !important;
      }

      .home-view .home-favorites-section .favorites-grid {
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
      }

      .home-view .home-favorites-section .favorite-card-wrapper {
        max-width: 100% !important;
        min-width: 0 !important;
      }
    }

    /* Touch screens: small controls get a target of at least 40x40px. Mouse
       and trackpad users (fine pointers) keep the compact desktop sizes. */
    @media (pointer: coarse) {
      /* Controls that can simply grow. */
      .dd-card-toolbar button,
      .dd-generated-card-toolbar button,
      .mobile-domain-order-button,
      .mobile-domain-drag-handle,
      .mobile-layout-toggle,
      .mobile-domain-master-action,
      .mobile-cover-action,
      .notifications-icon-button,
      .notification-dismiss,
      .header-expand-button {
        min-width: 40px;
        min-height: 40px;
      }

      .mobile-domain-master,
      .mobile-domain-master-actions {
        min-height: 40px;
      }

      /* Three 40px cover buttons do not fit next to the entity icon, so the
         cover buttons may wrap below it. */
      .mobile-entity-top {
        flex-wrap: wrap;
      }

      .mobile-cover-actions {
        margin-left: auto;
      }

      /* Switch-like and pill controls keep their look and get a larger,
         invisible hit area instead. */
      .mobile-entity-toggle,
      .mobile-entity-more,
      .mobile-scene-action,
      .mobile-lock-action,
      .favorite-quick-action,
      .mobile-section-action,
      .mobile-section-toggle,
      .home-notification-shortcut {
        position: relative;
      }

      .mobile-entity-toggle::after,
      .mobile-entity-more::after,
      .mobile-scene-action::after,
      .mobile-lock-action::after,
      .favorite-quick-action::after,
      .mobile-section-action::after,
      .mobile-section-toggle::after,
      .home-notification-shortcut::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: max(100%, 44px);
        height: max(100%, 44px);
        transform: translate(-50%, -50%);
      }
    }

    /* Reduced motion: no looping or decorative animation (alarm pulse,
       loading shimmer) and near-instant transitions. */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0s !important;
        scroll-behavior: auto !important;
      }

      .welcome-alarm.alarm-triggered {
        animation: none;
      }
    }
`;const Ye=i`.area-view .mobile-entity-replacement-card{--dd-replacement-min-height:62px;--dd-replacement-padding:8px 10px;--dd-replacement-radius:8px}@media (min-width:769px){.area-view .mobile-entity-replacement-card{--dd-replacement-min-height:72px;--dd-replacement-padding:12px;--dd-replacement-radius:10px}}.area-view .mobile-entities-section{display:flex;flex-direction:column;gap:8px;margin:0}.area-view .mobile-domain-group{min-width:0;margin:0;padding:0;overflow:hidden;border:1px solid color-mix(in srgb,var(--primary-text-color) 7%,transparent);border-radius:8px;background:var(--card-background-color);box-shadow:0 3px 10px rgba(15,23,42,0.04);contain:layout style}.area-view .mobile-domain-header{width:100%;min-height:38px;margin:0;padding:7px 9px;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:10px;border-radius:7px 7px 0 0}.area-view .mobile-domain-group.is-collapsed .mobile-domain-header{margin-bottom:0;border-radius:7px}.area-view .mobile-domain-title{appearance:none;min-width:0;padding:0;border:0;display:inline-flex;align-items:center;gap:7px;background:transparent;color:inherit;font:inherit;cursor:pointer}.area-view .mobile-domain-title-copy{min-width:0;display:inline-flex;align-items:baseline;gap:5px}.area-view .mobile-domain-title-label{font-size:15px;font-weight:850}.area-view .mobile-domain-count{color:var(--secondary-text-color);font-size:10px;font-weight:650}.area-view .mobile-domain-header-actions{display:inline-flex;align-items:center;justify-content:flex-end;gap:6px;margin-right:2px}.area-view .mobile-domain-master{min-width:76px;height:28px}.area-view .mobile-domain-collapse-button{display:none !important}.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-items:stretch;gap:8px;margin:0;padding:0 9px 9px;overflow:visible;scroll-padding:0;scroll-snap-type:none}.area-view .mobile-entity-card,.area-view .mobile-entities-section.layout-grid .mobile-entity-card{width:100% !important;min-width:0 !important;min-height:62px !important;height:auto !important;margin:0 !important;padding:8px 10px !important;box-sizing:border-box;display:flex !important;flex-direction:column;justify-content:center;overflow:hidden;border:1px solid color-mix(in srgb,var(--primary-text-color) 6%,transparent);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);box-shadow:0 3px 9px rgba(15,23,42,0.035);cursor:pointer;scroll-snap-align:none}.area-view .mobile-entity-card:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--primary-color) 14%,transparent);box-shadow:0 6px 14px rgba(15,23,42,0.055)}.area-view .mobile-entity-main{width:100%;min-width:0;display:grid;grid-template-columns:36px minmax(0,1fr) auto;align-items:center;gap:9px}.area-view .mobile-entity-main.editing-inline{grid-template-columns:24px 36px minmax(0,1fr) 34px;gap:7px}.area-view .mobile-entity-icon{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px}.area-view .mobile-entity-icon ha-icon{--mdc-icon-size:20px}.area-view .mobile-entity-content{min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px}.area-view .mobile-entity-name{overflow:hidden;font-size:12px;font-weight:850;line-height:1.15;text-overflow:ellipsis;white-space:nowrap}.area-view .mobile-entity-state{overflow:hidden;color:var(--secondary-text-color);font-size:10px;font-weight:650;line-height:1.1;text-overflow:ellipsis;white-space:nowrap}.area-view .mobile-entity-state.active{color:var(--entity-color)}.area-view .mobile-entity-right{min-width:0;display:inline-flex;align-items:center;justify-content:flex-end;gap:5px}.area-view .mobile-entity-status-pill{display:none !important}.area-view .mobile-entity-brightness{width:calc(100% - 45px);margin:6px 0 0 45px}.area-view .mobile-entity-brightness input[type="range"]{appearance:none;width:100%;height:4px;margin:0;border-radius:999px;outline:none;background:linear-gradient( 90deg,var(--entity-color) 0%,var(--entity-color) var(--brightness),color-mix(in srgb,var(--primary-text-color) 13%,transparent) var(--brightness),color-mix(in srgb,var(--primary-text-color) 13%,transparent) 100% )}.area-view .mobile-entity-brightness input[type="range"]::-webkit-slider-thumb{appearance:none;width:14px;height:14px;border:2px solid var(--entity-color);border-radius:50%;background:var(--card-background-color)}.area-view .mobile-entity-brightness input[type="range"]::-moz-range-thumb{width:12px;height:12px;border:2px solid var(--entity-color);border-radius:50%;background:var(--card-background-color)}.area-view .mobile-entity-more{display:none !important}@media (max-width:1180px) and (min-width:769px){.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{grid-template-columns:repeat(3,minmax(0,1fr))}}@media (max-width:768px){.area-view .mobile-domain-group{padding:0;border-radius:9px}.area-view .mobile-domain-header{min-height:36px;margin:0;padding:6px 7px}.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{grid-template-columns:1fr;gap:6px;padding:0 7px 7px}.area-view .mobile-entity-card,.area-view .mobile-entities-section.layout-grid .mobile-entity-card{min-height:58px !important;padding:7px 9px !important}.area-view .mobile-entity-main{grid-template-columns:34px minmax(0,1fr) auto;gap:8px}.area-view .mobile-entity-main.editing-inline{grid-template-columns:24px 34px minmax(0,1fr) 34px;gap:7px}.area-view .mobile-entity-icon{width:34px;height:34px}.area-view .mobile-entity-brightness{width:calc(100% - 42px);margin-left:42px}}.area-view>.room-favorites-block{width:100%;box-sizing:border-box}.area-view .mobile-domain-header.expandable-header{position:relative;width:100%;box-sizing:border-box;cursor:pointer;transition:background-color 0.15s ease,box-shadow 0.15s ease}.area-view .mobile-domain-header.expandable-header:hover{background:color-mix(in srgb,var(--primary-color) 6%,var(--card-background-color))}.area-view .mobile-domain-header.expandable-header:active{background:color-mix(in srgb,var(--primary-color) 9%,var(--card-background-color))}.area-view .mobile-domain-header.expandable-header:focus-visible{outline:2px solid color-mix(in srgb,var(--primary-color) 55%,transparent);outline-offset:2px}.area-view .mobile-domain-title{pointer-events:none}.area-view .mobile-domain-header-actions{position:relative;z-index:2}consistent leading chevron. */ .area-view .mobile-domain-header.expandable-header{min-height:38px}.area-view .mobile-domain-title{min-height:24px;align-items:center;gap:6px;line-height:1}.area-view .mobile-domain-title-copy{align-items:center;line-height:1}.area-view .mobile-domain-title-label,.area-view .mobile-domain-count{line-height:1}.area-view .dd-generated-card-wrap.editing{width:100%;min-width:0;min-height:62px;height:auto;flex:none;border-radius:8px}.area-view .dd-generated-card-wrap.editing>.mobile-entity-card{min-height:62px !important;height:100% !important}.area-view .mobile-entity-rail .dd-domain-add-card-final,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card-final{min-height:62px !important;height:62px;opacity:0.72;border-radius:8px}.area-view .dd-generated-card-toolbar{display:none !important}@media (max-width:768px){.area-view .mobile-domain-header.expandable-header{width:100%;padding:6px 7px}.area-view .dd-generated-card-wrap.editing,.area-view .dd-generated-card-wrap.editing>.mobile-entity-card,.area-view .mobile-entity-rail .dd-domain-add-card-final{min-height:58px !important}.area-view .mobile-entity-rail .dd-domain-add-card-final{height:58px}}which also swallowed pointer events for the new handle. */ .area-view .mobile-domain-group.group-editing .mobile-domain-title{pointer-events:auto}.area-view .mobile-domain-group.group-editing .mobile-domain-title-copy,.area-view .mobile-domain-group.group-editing .room-domain-icon{pointer-events:none}.area-view .mobile-domain-leading-drag-handle{pointer-events:auto;user-select:none;-webkit-user-select:none;-webkit-user-drag:element}.area-view .mobile-domain-header.room-favorites-header.expandable-header{min-height:32px;padding:3px 9px;border-radius:7px}.area-view .room-favorites-title{min-height:20px}.area-view .room-favorites-title .room-domain-icon{width:19px;height:19px}.area-view .room-favorites-title .room-domain-icon ha-icon{--mdc-icon-size:16px}@media (min-width:769px){.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{grid-template-columns:repeat(4,minmax(0,1fr)) !important;gap:8px !important}.area-view .mobile-entity-card,.area-view .mobile-entities-section.layout-grid .mobile-entity-card{min-height:62px !important;padding:8px 10px !important;justify-content:center !important;overflow:hidden !important}.area-view .mobile-entity-card.has-light-controls,.area-view .mobile-entity-card.has-cover-position{min-height:104px !important;justify-content:flex-start !important}.area-view .mobile-entity-main{grid-template-columns:36px minmax(0,1fr) auto !important;gap:9px !important;align-items:center !important}.area-view .mobile-entity-content{min-width:0 !important;height:36px !important;display:flex !important;flex-direction:column !important;justify-content:center !important;gap:3px !important;overflow:hidden !important}.area-view .mobile-entity-name{min-width:0 !important;width:100% !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;font-size:12px !important;line-height:1.08 !important;letter-spacing:-0.1px !important}.area-view .mobile-entity-state{margin:0 !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;font-size:10.5px !important;font-weight:800 !important;line-height:1 !important}.area-view .mobile-entity-right{min-width:max-content !important;max-width:86px !important;margin-left:4px !important;align-self:center !important}.area-view .mobile-cover-actions{min-height:30px !important;padding:2px !important;gap:2px !important}.area-view .mobile-cover-action{width:25px !important;height:25px !important}}@media (min-width:769px){.area-view .mobile-entity-card.has-light-controls,.area-view .mobile-entity-card.has-cover-position{min-height:94px !important;padding-bottom:6px !important}}@media (min-width:769px){.area-view .mobile-entity-card,.area-view .mobile-entities-section.layout-grid .mobile-entity-card{min-height:60px !important;padding:10px !important;box-sizing:border-box !important}.area-view .mobile-entity-main{min-height:38px !important;align-items:center !important}.area-view .mobile-entity-icon{width:38px !important;height:38px !important}.area-view .mobile-entity-content{height:38px !important}.area-view .mobile-entity-card.has-light-controls,.area-view .mobile-entity-card.has-cover-position{min-height:0 !important;height:auto !important;padding:8px 10px !important;justify-content:flex-start !important}.area-view .mobile-entity-card.has-light-controls .mobile-entity-main,.area-view .mobile-entity-card.has-cover-position .mobile-entity-main{min-height:38px !important}}@media (min-width:769px){.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{align-items:start !important}.area-view .mobile-entity-card,.area-view .mobile-entities-section.layout-grid .mobile-entity-card{align-self:start !important}}@media (min-width:769px){.area-view .mobile-light-control-slider,.area-view .mobile-cover-position input[type="range"]{height:5px !important}.area-view .mobile-light-control-slider::-webkit-slider-runnable-track,.area-view .mobile-cover-position input[type="range"]::-webkit-slider-runnable-track{height:5px !important;min-height:5px !important;max-height:5px !important;border-radius:999px !important}.area-view .mobile-light-control-slider::-moz-range-track,.area-view .mobile-cover-position input[type="range"]::-moz-range-track{height:5px !important;min-height:5px !important;max-height:5px !important;border-radius:999px !important}.area-view .mobile-light-control-slider::-moz-range-progress{height:5px !important;min-height:5px !important;max-height:5px !important;border-radius:999px !important}.area-view .mobile-light-control-slider::-webkit-slider-thumb,.area-view .mobile-cover-position input[type="range"]::-webkit-slider-thumb{width:15px !important;height:15px !important}.area-view .mobile-light-control-slider::-moz-range-thumb,.area-view .mobile-cover-position input[type="range"]::-moz-range-thumb{width:13px !important;height:13px !important}.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{align-items:start !important;grid-auto-rows:max-content !important}.area-view .mobile-entity-rail>.mobile-entity-card,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail>.mobile-entity-card{align-self:start !important;height:fit-content !important}.area-view .mobile-entity-card.has-light-controls,.area-view .mobile-entity-card.has-cover-position{height:auto !important}}@media (min-width:769px){.area-view .room-favorites-block:not(.is-collapsed) .room-favorites-header{margin-bottom:0 !important}}@media (min-width:769px){.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{grid-template-columns:repeat(4,minmax(0,1fr)) !important;gap:10px !important}.area-view .mobile-entity-card,.area-view .mobile-entities-section.layout-grid .mobile-entity-card{min-height:62px !important;height:auto !important;padding:8px 10px !important;border-radius:10px !important;box-sizing:border-box !important;justify-content:center !important}.area-view .mobile-entity-main{min-height:36px !important;grid-template-columns:36px minmax(0,1fr) auto !important;gap:11px !important}.area-view .mobile-entity-main.editing-inline{grid-template-columns:29px 46px minmax(0,1fr) 42px !important;gap:8px !important}.area-view .mobile-entity-icon{width:36px !important;height:36px !important;border-radius:8px !important}.area-view .mobile-entity-icon ha-icon{--mdc-icon-size:24px !important}.area-view .mobile-entity-content{height:36px !important;gap:2px !important}.area-view .mobile-entity-name{font-size:12px !important;line-height:1.1 !important;white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important}.area-view .mobile-entity-state{font-size:12.7px !important;line-height:1.1 !important}.area-view .mobile-entity-right{gap:5px !important;max-width:104px !important}.area-view .mobile-entity-toggle{width:46px !important;height:27px !important}.area-view .mobile-entity-toggle::before{width:21px !important;height:21px !important;margin-left:3px !important}.area-view .mobile-entity-card.is-active .mobile-entity-toggle::before{transform:translateX(19px) !important}.area-view .mobile-entity-card.has-light-controls,.area-view .mobile-entity-card.has-cover-position{min-height:112px !important;padding:9px 12px !important}.area-view .mobile-entity-card.has-light-controls .mobile-entity-main,.area-view .mobile-entity-card.has-cover-position .mobile-entity-main{min-height:46px !important}.area-view .mobile-light-control-row{margin-top:9px !important;min-height:32px !important}.area-view .mobile-light-control-slider,.area-view .mobile-cover-position input[type="range"]{height:6px !important}.area-view .mobile-light-control-slider::-webkit-slider-runnable-track,.area-view .mobile-cover-position input[type="range"]::-webkit-slider-runnable-track,.area-view .mobile-light-control-slider::-moz-range-track,.area-view .mobile-cover-position input[type="range"]::-moz-range-track,.area-view .mobile-light-control-slider::-moz-range-progress{height:6px !important}.area-view .mobile-light-control-slider::-webkit-slider-thumb,.area-view .mobile-cover-position input[type="range"]::-webkit-slider-thumb{width:18px !important;height:18px !important}.area-view .mobile-light-control-slider::-moz-range-thumb,.area-view .mobile-cover-position input[type="range"]::-moz-range-thumb{width:16px !important;height:16px !important}.area-view .mobile-light-mode-buttons{gap:5px !important}.area-view .mobile-light-mode-button{width:34px !important;height:34px !important;border-radius:9px !important}.area-view .mobile-light-mode-button ha-icon{--mdc-icon-size:20px !important}.area-view .mobile-cover-actions{min-height:36px !important;padding:3px !important;gap:3px !important}.area-view .mobile-cover-action{width:31px !important;height:31px !important}.area-view .mobile-cover-action ha-icon{--mdc-icon-size:20px !important}.area-view .mobile-entities-section,.area-view .mobile-domain-group{width:100% !important;align-self:stretch !important;box-sizing:border-box !important}}@media (min-width:769px){.area-view{width:100% !important;max-width:1400px !important;margin-left:auto !important;margin-right:auto !important;box-sizing:border-box !important}.area-view>.mobile-entities-section,.area-view>.mobile-entities-section>.mobile-domain-group,.area-view>.mobile-entities-section>.mobile-domain-group>.mobile-entity-rail{width:100% !important;max-width:none !important;box-sizing:border-box !important}}@media (min-width:769px){.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{grid-template-columns:repeat(5,minmax(0,1fr)) !important}}@media (min-width:769px){.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{grid-template-columns:repeat(5,minmax(0,1fr)) !important}}@media (min-width:769px){.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{grid-template-columns:repeat(5,minmax(0,1fr)) !important}}@media (min-width:769px){.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{grid-template-columns:repeat(4,minmax(0,1fr)) !important}}@media (min-width:769px){.area-view .mobile-entity-card.has-inline-select{display:grid !important;grid-template-columns:minmax(0,1fr) !important;grid-template-rows:46px 42px !important;align-content:center !important;gap:7px !important;min-height:123px !important;height:auto !important;padding:9px 12px !important;overflow:hidden !important}.area-view .mobile-entity-card.has-inline-select .mobile-entity-main{grid-column:1 !important;grid-row:1 !important;width:100% !important;min-width:0 !important;height:46px !important;min-height:46px !important;display:grid !important;grid-template-columns:46px minmax(0,1fr) !important;grid-template-areas:"icon content" !important;align-items:center !important;gap:11px !important;direction:ltr !important}.area-view .mobile-entity-card.has-inline-select .mobile-entity-icon{grid-area:icon !important;position:static !important;inset:auto !important;width:46px !important;min-width:46px !important;height:46px !important;min-height:46px !important;margin:0 !important;padding:0 !important;display:inline-flex !important;align-items:center !important;justify-content:center !important;justify-self:start !important;align-self:center !important;transform:none !important}.area-view .mobile-entity-card.has-inline-select .mobile-entity-icon>.mobile-entity-leading-select-icon{position:static !important;inset:auto !important;display:block !important;width:24px !important;height:24px !important;min-width:24px !important;min-height:24px !important;margin:0 !important;padding:0 !important;transform:none !important;--mdc-icon-size:24px !important;pointer-events:none !important}.area-view .mobile-entity-card.has-inline-select .mobile-entity-content{grid-area:content !important;min-width:0 !important;height:46px !important;margin:0 !important;align-self:center !important;justify-content:center !important}.area-view .mobile-entity-card.has-inline-select .mobile-entity-right{display:none !important}.area-view .mobile-entity-card.has-inline-select .mobile-entity-select{grid-column:1 !important;grid-row:2 !important;position:relative !important;width:100% !important;height:42px !important;min-height:42px !important;margin:0 !important}.area-view .mobile-entity-card.has-inline-select .mobile-entity-select select{width:100% !important;height:42px !important;box-sizing:border-box !important;padding:0 42px 0 15px !important;font-size:14.4px !important;line-height:42px !important}.area-view .mobile-entity-card.has-inline-select .mobile-select-chevron{position:absolute !important;top:50% !important;right:12px !important;left:auto !important;bottom:auto !important;margin:0 !important;transform:translateY(-50%) !important;--mdc-icon-size:20px !important;pointer-events:none !important}}@media (max-width:768px){.mobile-home-section:not(.layout-grid),.home-status-section:not(.layout-grid),.home-camera-section:not(.layout-grid){overflow:visible !important}.mobile-home-section:not(.layout-grid) .mobile-area-rail,.home-status-section:not(.layout-grid) .home-status-grid,.home-camera-section:not(.layout-grid) .home-camera-grid{padding-top:3px !important;padding-bottom:28px !important}.home-todos-grid,.home-custom-cards-grid,.home-todo-card,.home-custom-card,.home-todo-card dwains-dashboard-next-card-host,.home-custom-card dwains-dashboard-next-card-host{width:100% !important;max-width:100% !important;min-width:0 !important;box-sizing:border-box !important}.home-todos-grid,.home-custom-cards-grid{grid-template-columns:minmax(0,1fr) !important;overflow:visible !important}.mobile-area-icon{width:var(--mobile-area-icon-size,56px) !important;height:var(--mobile-area-icon-height,var(--mobile-area-icon-size,56px)) !important;aspect-ratio:1;flex:0 0 var(--mobile-area-icon-size,56px) !important;border-radius:15px !important}.mobile-area-icon ha-icon{--mdc-icon-size:var(--mobile-area-icon-glyph-size,30px) !important}.mobile-area-card.has-picture .mobile-area-picture{opacity:0.22 !important;filter:saturate(0.72) contrast(0.92) !important}.mobile-area-card.has-picture{background:var(--card-background-color) !important;color:var(--primary-text-color) !important;--mobile-area-picture-text-color:var(--primary-text-color) !important;--mobile-area-picture-muted-text-color:var(--secondary-text-color) !important;--mobile-area-picture-text-shadow:none !important;--mobile-area-picture-overlay:linear-gradient( color-mix(in srgb,var(--card-background-color) 14%,transparent),color-mix(in srgb,var(--card-background-color) 14%,transparent) ) !important}.mobile-area-card.has-picture .mobile-area-icon{color:var(--primary-color) !important;background:color-mix(in srgb,var(--primary-color) 13%,var(--card-background-color)) !important;backdrop-filter:none !important}.home-favorites-section{box-sizing:border-box !important;width:auto !important;max-width:none !important;margin:0 -10px 30px !important;padding:0 !important;overflow:visible !important}.home-favorites-section .favorites-grid{box-sizing:border-box !important;width:100% !important;gap:8px !important;padding:3px 18px 32px !important}.home-favorites-section.layout-rail .favorites-grid{display:flex !important;flex-direction:row !important;align-items:stretch !important;overflow-x:auto !important;overflow-y:visible !important;scroll-padding-inline:18px !important;scroll-snap-type:x proximity !important;scrollbar-width:none !important}.home-favorites-section.layout-rail .favorites-grid::-webkit-scrollbar{display:none !important}.home-favorites-section.layout-grid .favorites-grid{display:grid !important;grid-template-columns:minmax(0,1fr) !important;overflow:visible !important;scroll-snap-type:none !important}.home-favorites-section .favorite-card-wrapper{position:relative !important;isolation:isolate !important;display:grid !important;grid-template-columns:minmax(0,1fr) auto !important;grid-template-rows:1fr !important;align-items:center !important;column-gap:10px !important;height:64px !important;min-height:64px !important;padding:8px 11px !important;overflow:hidden !important;border-radius:14px !important}.home-favorites-section.layout-grid .favorite-card-wrapper{width:100% !important;max-width:100% !important;min-width:0 !important;flex:none !important;scroll-snap-align:none !important}.home-favorites-section.layout-rail .favorite-card-wrapper{width:max-content !important;max-width:calc(100vw - 36px) !important;min-width:0 !important;flex:0 0 auto !important;scroll-snap-align:start !important}.home-favorites-section .favorite-icon{position:absolute !important;left:7px !important;top:50% !important;z-index:0 !important;width:58px !important;height:58px !important;margin:0 !important;border-radius:0 !important;transform:translateY(-50%) !important;background:transparent !important;color:var(--favorite-color) !important;opacity:0.10 !important;pointer-events:none !important}.home-favorites-section .favorite-icon ha-icon{--mdc-icon-size:54px !important}.home-favorites-section .favorite-body{grid-column:1 !important;grid-row:1 !important;position:relative !important;z-index:1 !important;min-width:0 !important;align-self:center !important;padding:0 0 0 7px !important;display:flex !important;flex-direction:column !important;justify-content:center !important}.home-favorites-section .favorite-end{grid-column:2 !important;grid-row:1 !important;position:relative !important;z-index:1 !important;align-self:center !important;justify-self:end !important;margin:0 !important;padding:0 !important}.home-favorites-section .favorite-name{margin:0 !important;display:block !important;max-width:100% !important;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;-webkit-line-clamp:unset !important;font-size:14px !important;line-height:1.15 !important}.home-favorites-section .favorite-meta{margin-top:3px !important;line-height:1.15 !important}.home-favorites-section.layout-rail .favorite-body,.home-favorites-section.layout-rail .favorite-name{width:max-content !important;max-width:min(64vw,430px) !important}}.sidebar .room-area-button{position:relative !important;isolation:isolate !important;overflow:hidden !important}.sidebar .room-area-button .area-list-picture{position:absolute !important;inset:0 !important;z-index:0 !important;background-position:center !important;background-size:cover !important;background-repeat:no-repeat !important;opacity:0.13 !important;filter:saturate(0.72) contrast(0.94) !important;transform:scale(1.015) !important;pointer-events:none !important}.sidebar .room-area-button.has-picture,.sidebar .room-area-button.has-picture.selected{color:var(--primary-text-color) !important;background:color-mix(in srgb,var(--card-background-color) 96%,var(--primary-background-color)) !important;--area-picture-text-color:var(--primary-text-color) !important;--area-picture-muted-text-color:var(--secondary-text-color) !important;--area-picture-text-shadow:none !important}.sidebar .room-area-button.has-picture::after{display:none !important}.sidebar .room-area-button .area-media,.sidebar .room-area-button .area-content{position:relative !important;z-index:1 !important}.sidebar .room-area-button .area-media{background:color-mix(in srgb,var(--primary-color) 9%,var(--card-background-color)) !important}.sidebar .room-area-button .area-media-icon{width:100% !important;height:100% !important;display:flex !important;align-items:center !important;justify-content:center !important;color:var(--primary-color) !important;background:color-mix(in srgb,var(--primary-color) 11%,var(--card-background-color)) !important;backdrop-filter:none !important}.sidebar .room-area-button.has-picture .area-name,.sidebar .room-area-button.has-picture .area-sensors{color:inherit !important;background:transparent !important;text-shadow:none !important;backdrop-filter:none !important}@media (min-width:769px){.sidebar .room-area-button .area-sensors{min-height:12px !important}.sidebar .room-area-button .area-sensors.is-empty{visibility:hidden !important}.home-status-section{overflow:visible !important}.home-status-primary-grid{overflow:visible !important;padding-bottom:18px !important}.home-todos-grid{width:calc(50% - 5px) !important;max-width:calc(50% - 5px) !important;grid-template-columns:minmax(0,1fr) !important}.home-todo-card,.home-todo-card dwains-dashboard-next-card-host{width:100% !important;max-width:100% !important}}@media (max-width:768px){.sidebar .room-area-button .area-list-picture{opacity:0.16 !important}.sidebar .room-area-button .area-sensors.is-empty{display:none !important}.home-favorites-section.layout-grid .favorites-grid{display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:8px !important}.home-favorites-section.layout-grid .favorite-card-wrapper{width:100% !important;max-width:100% !important;min-width:0 !important}.home-favorites-section .favorite-icon{opacity:0.14 !important}.home-favorites-section .favorite-card-wrapper,.home-favorites-section .favorite-card-wrapper:hover,.home-favorites-section .favorite-card-wrapper:focus,.home-favorites-section .favorite-card-wrapper:focus-visible{outline:none !important}.home-favorites-section .favorite-card-wrapper:hover:not(:active),.home-favorites-section .favorite-card-wrapper:focus:not(:active),.home-favorites-section .favorite-card-wrapper:focus-visible:not(:active){transform:none !important;box-shadow:0 12px 26px rgba(15,23,42,0.06),inset 0 0 0 1px rgba(15,23,42,0.035) !important}.home-favorites-section .favorite-card-wrapper:active{transform:scale(0.985) !important}.home-todos-grid{width:100% !important;max-width:100% !important}}@media (max-width:768px){.home-view .home-favorites-section{width:calc(100% + 20px) !important;max-width:none !important;margin-left:-10px !important;margin-right:-10px !important;overflow-x:visible !important}.home-favorites-section.layout-grid .favorites-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:10px !important;padding:3px 18px 32px !important}.home-favorites-section .favorite-icon{left:auto !important;right:10px !important;top:auto !important;bottom:7px !important;width:34px !important;height:34px !important;transform:none !important;opacity:0.14 !important}.home-favorites-section .favorite-icon ha-icon{--mdc-icon-size:30px !important}.home-view,.home-content-area{overflow-x:clip !important;overflow-y:visible !important}.home-todo-card{border-radius:16px !important;overflow:hidden !important}.home-todo-card dwains-dashboard-next-card-host[framed]{--dd-replacement-radius:16px;--dd-replacement-border:1px solid color-mix(in srgb,var(--primary-text-color) 8%,transparent);--dd-replacement-padding:0px}}@media (min-width:769px){.home-todo-card{border-radius:12px !important;overflow:hidden !important}.home-todo-card dwains-dashboard-next-card-host[framed]{--dd-replacement-radius:12px;--dd-replacement-border:1px solid color-mix(in srgb,var(--primary-text-color) 8%,transparent);--dd-replacement-padding:0px}.room-header.has-room-background{position:relative !important;isolation:isolate !important;overflow:hidden !important;background:var(--card-background-color) !important}.room-header .dd-page-header-room-background{position:absolute !important;inset:0 !important;z-index:0 !important;background-position:center !important;background-size:cover !important;background-repeat:no-repeat !important;opacity:0.13 !important;filter:saturate(0.72) contrast(0.94) !important;transform:scale(1.01) !important;pointer-events:none !important}.room-header .dd-page-header-with-media{position:relative !important;z-index:1 !important}.room-header.has-room-background .dd-page-header-media-tile{background:color-mix(in srgb,var(--primary-color) 9%,var(--card-background-color)) !important}.room-header.has-room-background .dd-page-header-room-icon{color:var(--primary-color) !important;background:color-mix(in srgb,var(--primary-color) 11%,var(--card-background-color)) !important}.room-header .dd-page-header-strip[data-control-count="4"],.room-header .dd-page-header-strip[data-control-count="5"],.room-header .dd-page-header-strip[data-control-count="6"],.room-header .dd-page-header-strip[data-control-count="7"],.room-header .dd-page-header-strip[data-control-count="8"]{display:grid !important;grid-template-columns:repeat(var(--dd-room-quick-columns),max-content) !important;justify-content:start !important;align-items:center !important;gap:8px !important}.room-header .dd-page-header-strip[data-control-count="4"]>*,.room-header .dd-page-header-strip[data-control-count="5"]>*,.room-header .dd-page-header-strip[data-control-count="6"]>*,.room-header .dd-page-header-strip[data-control-count="7"]>*,.room-header .dd-page-header-strip[data-control-count="8"]>*{min-width:0 !important}.sidebar .area-button.home-button{background:color-mix(in srgb,var(--card-background-color) 96%,var(--primary-background-color)) !important;border-color:color-mix(in srgb,var(--primary-text-color) 7%,transparent) !important}.sidebar .area-button.home-button .area-name{font-size:14px !important;font-weight:850 !important}.sidebar .area-button.home-button .area-icon{width:46px !important;height:46px !important;border-radius:10px !important;background:color-mix(in srgb,var(--primary-color) 11%,var(--card-background-color)) !important;color:var(--primary-color) !important}.sidebar .area-button.home-button .area-icon ha-icon{--mdc-icon-size:34px !important}}@media (max-width:768px){.home-favorites-section .favorite-card-wrapper{display:grid !important;grid-template-columns:22px minmax(0,1fr) auto !important;grid-template-rows:1fr !important;align-items:center !important;column-gap:8px !important}.home-favorites-section .favorite-icon{position:static !important;grid-column:1 !important;grid-row:1 !important;width:22px !important;height:22px !important;margin:0 !important;transform:none !important;opacity:1 !important;color:var(--favorite-color) !important;background:transparent !important;align-self:center !important;justify-self:start !important;pointer-events:none !important}.home-favorites-section .favorite-icon ha-icon{--mdc-icon-size:18px !important;color:var(--favorite-color) !important}.home-favorites-section .favorite-body{grid-column:2 !important;grid-row:1 !important;padding-left:0 !important}.home-favorites-section .favorite-end{grid-column:3 !important;grid-row:1 !important}}@media (min-width:769px){.room-header .dd-page-header-strip[data-control-count="4"] .dd-room-tiles,.room-header .dd-page-header-strip[data-control-count="5"] .dd-room-tiles,.room-header .dd-page-header-strip[data-control-count="6"] .dd-room-tiles,.room-header .dd-page-header-strip[data-control-count="7"] .dd-room-tiles,.room-header .dd-page-header-strip[data-control-count="8"] .dd-room-tiles{display:contents !important}.room-header .dd-page-header-strip[data-control-count="4"],.room-header .dd-page-header-strip[data-control-count="5"],.room-header .dd-page-header-strip[data-control-count="6"],.room-header .dd-page-header-strip[data-control-count="7"],.room-header .dd-page-header-strip[data-control-count="8"]{display:grid !important;grid-template-columns:repeat(var(--dd-room-quick-columns),max-content) !important;grid-auto-flow:row !important;justify-content:start !important;align-items:center !important;gap:8px !important}.sidebar .area-button.home-button .area-info .area-name{font-size:15px !important;font-weight:850 !important;line-height:1.1 !important}}.room-header .dd-page-header-title-row .dd-page-header-home,.dd-room-compact .dd-page-header-home{color:var(--primary-color) !important;background:color-mix(in srgb,var(--primary-color) 11%,var(--card-background-color)) !important}.room-header .dd-page-header-title-row .dd-page-header-home:hover,.dd-room-compact .dd-page-header-home:hover{color:var(--primary-color) !important;background:color-mix(in srgb,var(--primary-color) 17%,var(--card-background-color)) !important}@media (min-width:769px){.home-camera-grid{display:grid !important;grid-template-columns:repeat(3,minmax(0,1fr)) !important;gap:10px !important;width:100% !important;max-width:none !important}.home-camera-card{width:100% !important;min-width:0 !important}}.area-view .mobile-domain-leading-drag-handle,.area-view .dd-generated-card-leading-drag-handle{width:22px;height:40px;margin:0;padding:0;border:0;border-radius:4px;display:grid;place-items:center;flex:0 0 22px;color:var(--secondary-text-color);background:transparent;cursor:grab}.area-view .mobile-domain-leading-drag-handle:hover,.area-view .dd-generated-card-leading-drag-handle:hover{background:var(--primary-background-color);color:var(--primary-color)}.area-view .mobile-domain-leading-drag-handle ha-icon,.area-view .dd-generated-card-leading-drag-handle ha-icon{--mdc-icon-size:20px}`,Ke=()=>import("./dwains-domain-entities-dialog-fcKUmd2v.js"),Xe=(e,t)=>{xe(e,"show-dialog",{dialogTag:"dwains-dashboard-next-domain-entities-dialog",dialogImport:Ke,dialogParams:t})},Qe=new Map;let Je,Ze=!1;const et=e=>{if(Ze)return;Ze=!0;const t=()=>{Je=window.setInterval(()=>{Qe.size>0?Qe.forEach(t=>{t&&"hass"in t&&(t.hass=e.hass)}):Je&&(clearInterval(Je),Je=void 0)},100)};e.addEventListener("show-dialog",async a=>{const o=a;o.stopPropagation(),o.stopImmediatePropagation();const{dialogTag:r,dialogImport:i,dialogParams:n}=o.detail;if(Qe.has(r))return void console.warn(`Dialog ${r} is already open`);await i();const s=document.querySelector(r);s&&s.remove();const c=document.createElement(r);c.hass=e.hass,Qe.set(r,c),document.body.appendChild(c),requestAnimationFrame(()=>{c.showDialog(n)});c.addEventListener("dialog-closed",()=>{Qe.delete(r),document.body.contains(c)&&c.remove(),0===Qe.size&&Je&&(clearInterval(Je),Je=void 0)},{once:!0}),1!==Qe.size||Je||t()},{capture:!0})};class tt extends HTMLElement{constructor(){super(...arguments),this._child=null}static get observedAttributes(){return["entity","name"]}set hass(e){this._hass=e,this._child&&(this._child.hass=e)}get hass(){return this._hass}attributeChangedCallback(e,t,a){"entity"===e&&(this._entityId=a??void 0),"name"===e&&(this._name=a??void 0),this._ensureChild()}connectedCallback(){this.style.display="block",this._ensureChild()}disconnectedCallback(){this._child=null,this.innerHTML=""}async _ensureChild(){if(this.isConnected&&this._entityId)if(this._child&&this.contains(this._child)&&this._child.getAttribute("data-entity")===this._entityId)this._hass&&(this._child.hass=this._hass);else{if(!customElements.get("hui-tile-card"))try{await customElements.whenDefined("hui-tile-card")}catch{return}this._child&&this.contains(this._child)||(this._child=document.createElement("hui-tile-card"),this._child.classList.add("favorite-tile"),this._child.setAttribute("data-entity",this._entityId),this.innerHTML="",this.appendChild(this._child));try{if("setConfig"in this._child){const e={entity:this._entityId};this._name&&(e.name=this._name),this._child.setConfig(e)}this._hass&&this.contains(this._child)&&(this._child.hass=this._hass)}catch(e){console.warn("dwains-dashboard-next-tile-host: failed to configure tile",e)}}}}customElements.get("dwains-dashboard-next-tile-host")||customElements.define("dwains-dashboard-next-tile-host",tt);const at="dwainsDashboardNextSettingsOpen",ot="dd-next-area-sidebar-width",rt="dd-next-area-sidebar-collapsed",it=240,nt="__ungrouped__";let st=class extends n{constructor(){super(...arguments),this._t=(e,t)=>R(this.hass,e,t),this._tp=(e,t)=>L(this.hass,e,t),this._selectedArea=null,this._selectedView=null,this._isMobile=!1,this._headerExpanded=!1,this._headerCompact=!1,this._headerStatusCanScrollLeft=!1,this._headerStatusCanScrollRight=!1,this._favoritesRenderVersion=0,this._currentTime="",this._currentDate="",this._mobileNavOpen=!1,this._editMode=!1,this._notificationsOpen=!1,this._persistentNotifications=[],this._notificationsLoading=!1,this._notificationsError="",this._areaHeaderStuck=!1,this._areaHeaderRevealed=!1,this._areaQuickPage=0,this._mobileEntityLayout="rail",this._mobileHomeAreasLayout="rail",this._mobileHomeDevicesLayout="rail",this._mobileHomeFavoritesLayout="rail",this._mobileHomeCamerasLayout="rail",this._areaSidebarWidth=250,this._areaSidebarCollapsed=!1,this._isResizingSidebar=!1,this._repairsIssueCount=0,this._discoveredDeviceCount=0,this._suggestedFavoriteEntities=[],this._customCardDrag=null,this._customCardDragOver=null,this._generatedCardDrag=null,this._generatedCardDragOver=null,this._generatedGroupDrag=null,this._generatedGroupDragOver=null,this._optimisticEntityStates={},this._renderAllMobileHomeAreas=!1,this._renderAllMobileAreaEntities=!1,this._collapsedAreaGroups={},this._settingsDirty=!1,this._deviceSettingsDirty=!1,this._settingsSavePending=!1,this._settingsSaveError="",this._settingsPageKey="overview",this._settingsPageTitle="",this._settingsPageParentTitle="",this._settingsPageDescription="",this._confirmationDialog=null,this._housePowerDialogOpen=!1,this._areaEntitiesCache=new Map,this._areaDataCache=new Map,this._domainCountsCache=new Map,this._CACHE_DURATION=5e3,this._persistentNotificationsLoaded=!1,this._homeSummariesLoaded=!1,this._favoriteSuggestionsLoaded=!1,this._favoriteSuggestionsLoading=!1,this._pendingAreaScrollTop=0,this._lastAreaScrollTop=0,this._areaScrollUpDistance=0,this._pictureContrastCache=new Map,this._areaSidebarScrollTop=0,this._settingsEditorInitialized=!1,this._settingsRestorePageKey="overview",this._handleHeaderStatusScroll=()=>{this._scheduleHeaderStatusScrollState()},this._handleHeaderStatusWheel=e=>{const t=e.currentTarget;!t||t.scrollWidth<=t.clientWidth||Math.abs(e.deltaY)>Math.abs(e.deltaX)&&(e.preventDefault(),t.scrollLeft+=e.deltaY)},this._handleResize=()=>{if(this._checkMobile(),!this._isMobile){const e=this._clampAreaSidebarWidth(this._areaSidebarWidth);e!==this._areaSidebarWidth&&(this._areaSidebarWidth=e)}this._updateAreaHeaderScrollState()},this._handleSidebarScroll=e=>{if(this._isMobile)return;const t=e.currentTarget;t&&(this._areaSidebarScrollTop=t.scrollTop)},this._handleContentScroll=e=>{if(!this._isMobile||"area"!==this._selectedView)return this._areaHeaderStuck&&(this._areaHeaderStuck=!1),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1));const t=e.currentTarget,a=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||t?.scrollTop||0;this._pendingAreaScrollTop=a,this._areaHeaderScrollRaf||(this._areaHeaderScrollRaf=requestAnimationFrame(()=>{this._areaHeaderScrollRaf=void 0,this._setAreaHeaderStuckForScroll(this._pendingAreaScrollTop,!0)}))},this._handleWindowScroll=()=>{this._isMobile&&"area"===this._selectedView&&(this._pendingAreaScrollTop=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,this._areaHeaderScrollRaf||(this._areaHeaderScrollRaf=requestAnimationFrame(()=>{this._areaHeaderScrollRaf=void 0,this._setAreaHeaderStuckForScroll(this._pendingAreaScrollTop,!0)})))},this._handleShowMoreInfo=e=>{xe(this,"hass-more-info",{entityId:e.detail.entityId})},this._startSidebarResize=e=>{this._isMobile||0!==e.button||(e.preventDefault(),this._sidebarResizePointerId=e.pointerId,this._isResizingSidebar=!0,e.currentTarget?.setPointerCapture?.(e.pointerId),window.addEventListener("pointermove",this._handleSidebarResizeMove),window.addEventListener("pointerup",this._handleSidebarResizeEnd),window.addEventListener("pointercancel",this._handleSidebarResizeEnd))},this._handleSidebarResizeMove=e=>{if(!this._isResizingSidebar||this._isMobile)return;if(void 0!==this._sidebarResizePointerId&&e.pointerId!==this._sidebarResizePointerId)return;const t=this.renderRoot?.querySelector(".layout-container"),a=t?.getBoundingClientRect().left??0,o=e.clientX-a;o<=96?this._areaSidebarCollapsed=!0:(this._areaSidebarCollapsed&&(this._areaSidebarCollapsed=!1),this._areaSidebarWidth=this._clampAreaSidebarWidth(o))},this._handleSidebarResizeEnd=e=>{this._isResizingSidebar&&(e&&void 0!==this._sidebarResizePointerId&&e.pointerId!==this._sidebarResizePointerId||(this._isResizingSidebar=!1,this._sidebarResizePointerId=void 0,this._saveAreaSidebarWidthPreference(this._areaSidebarWidth),this._saveAreaSidebarCollapsedPreference(this._areaSidebarCollapsed),window.removeEventListener("pointermove",this._handleSidebarResizeMove),window.removeEventListener("pointerup",this._handleSidebarResizeEnd),window.removeEventListener("pointercancel",this._handleSidebarResizeEnd)))},this._toggleAreaSidebarCollapsed=e=>{e?.stopPropagation(),this._isMobile||(this._areaSidebarCollapsed=!this._areaSidebarCollapsed,this._saveAreaSidebarCollapsedPreference(this._areaSidebarCollapsed),this._areaSidebarCollapsed||(this._areaSidebarWidth=this._clampAreaSidebarWidth(this._areaSidebarWidth||250),this._saveAreaSidebarWidthPreference(this._areaSidebarWidth)))},this._handleSidebarResizeKeydown=e=>{if(this._isMobile)return;let t=this._areaSidebarWidth;if("ArrowLeft"===e.key)t-=e.shiftKey?40:20;else if("ArrowRight"===e.key)t+=e.shiftKey?40:20;else if("Home"===e.key)t=it;else{if("End"!==e.key)return;t=660}e.preventDefault(),this._areaSidebarWidth=this._clampAreaSidebarWidth(t),this._saveAreaSidebarWidthPreference(this._areaSidebarWidth)},this._toggleMobileEntityLayout=e=>{e?.stopPropagation(),this._mobileEntityLayout="rail"===this._mobileEntityLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-entity-layout",this._mobileEntityLayout)}catch{}},this._toggleMobileHomeAreasLayout=e=>{e?.stopPropagation(),this._mobileHomeAreasLayout="rail"===this._mobileHomeAreasLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-areas-layout",this._mobileHomeAreasLayout)}catch{}},this._toggleMobileHomeDevicesLayout=e=>{e?.stopPropagation(),this._mobileHomeDevicesLayout="rail"===this._mobileHomeDevicesLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-devices-layout",this._mobileHomeDevicesLayout)}catch{}},this._toggleMobileHomeFavoritesLayout=e=>{e?.stopPropagation(),this._mobileHomeFavoritesLayout="rail"===this._mobileHomeFavoritesLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-favorites-layout",this._mobileHomeFavoritesLayout)}catch{}},this._toggleMobileHomeCamerasLayout=e=>{e?.stopPropagation(),this._mobileHomeCamerasLayout="rail"===this._mobileHomeCamerasLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-cameras-layout",this._mobileHomeCamerasLayout)}catch{}},this._debouncedUpdate=()=>{this._updateDebounceTimer&&clearTimeout(this._updateDebounceTimer),this._updateDebounceTimer=window.setTimeout(()=>{this.requestUpdate()},100)},this._nowPlayingPlayers=function(e,t){void 0===t&&(t=_e);var a=null;function o(){for(var o=[],r=0;r<arguments.length;r++)o[r]=arguments[r];if(a&&a.lastThis===this&&t(o,a.lastArgs))return a.lastResult;var i=e.apply(this,o);return a={lastResult:i,lastArgs:o,lastThis:this},i}return o.clear=function(){a=null},o}((e,t,a,o,r)=>ie(be(t,"media_player"),{now:Date.now(),isVisible:t=>se(e,a,t)}).map(t=>({entityId:t,roomName:ne(e,a,t)}))),this._handleHousePowerKeydown=e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._openHousePowerDialog())},this._openHousePowerDialog=()=>{this._housePowerDialogOpen=!0},this._closeHousePowerDialog=()=>{this._housePowerDialogOpen=!1},this._openEnergyFromPowerDialog=()=>{this._closeHousePowerDialog(),this._openDeviceDomain("energy")},this._handleAreaQuickScroll=e=>{if(!this._isMobile)return;const t=e.currentTarget,a=Number(t.dataset.pageCount||1);if(a<=1)return void(0!==this._areaQuickPage&&(this._areaQuickPage=0));const o=Math.max(1,t.scrollWidth-t.clientWidth),r=Math.max(0,Math.min(a-1,Math.round(t.scrollLeft/o*(a-1))));r!==this._areaQuickPage&&(this._areaQuickPage=r)},this._toggleEditMode=()=>{if(!this._canManageDashboard())return this._editMode=!1,void this._rememberAreaEditMode(null);this._editMode=!this._editMode,this._rememberAreaEditMode(this._editMode&&"area"===this._selectedView?this._selectedArea:null)},this._clearCustomCardDragState=()=>{this._customCardDrag=null,this._customCardDragOver=null},this._clearGeneratedGroupDragState=()=>{this._generatedGroupDrag=null,this._generatedGroupDragOver=null},this._clearGeneratedCardDragState=()=>{this._generatedCardDrag=null,this._generatedCardDragOver=null},this._handleHomeNavigationKeydown=e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._selectView("home"))},this._handleAreaNavToggle=()=>{this._isMobile&&this._toggleMobileNav()},this._handleMobileNavSheet=e=>{"areas"!==e.detail?.kind&&(this._mobileNavOpen=!1)},this._handleOpenSettingsEvent=()=>{this._openDashboardSettings()},this._handleOpenHomeEvent=()=>{this._selectView("home")},this._handleSettingsConfigChanged=e=>{e.stopPropagation();const t=e.detail;this._pendingSettingsConfig=t?.config,this._settingsDirty=Boolean(this._pendingSettingsConfig)||this._deviceSettingsDirty,this._settingsSaveError=""},this._handleDeviceSettingsChanged=e=>{e.stopPropagation();const t=e.detail;this._deviceSettingsDirty=Boolean(t?.dirty),this._settingsDirty=Boolean(this._pendingSettingsConfig)||this._deviceSettingsDirty,this._settingsSaveError=""},this._handleSettingsPageChanged=e=>{e.stopPropagation();const t=e.detail||{};this._settingsPageKey=t.page||"overview",this._settingsRestorePageKey=this._settingsPageKey,this._settingsRestoreAreaId=t.areaId||void 0,this._settingsPageTitle=t.title||"",this._settingsPageParentTitle=t.parentTitle||"",this._settingsPageDescription=t.description||"",this._setSettingsHistoryState(!0)},this._settingsBackToOverview=()=>{const e=this.renderRoot?.querySelector("dwains-dashboard-next-strategy-editor");e?._backToSettingsOverview?.()},this._settingsSecondaryAction=()=>{this._closeSettingsPage()},this._closeSettingsPage=async()=>{await this._confirmDiscardSettings()&&(this._clearSettingsEditState(),await this._selectView("home"))},this._openDashboardSettings=()=>{this._canManageDashboard()&&(this._setSettingsHistoryState(!0),this._resetAreaHeaderScrollState(!0),this._selectedArea=null,this._selectedView="settings",this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._pendingSettingsConfig=void 0,this._settingsDirty=!1,this._settingsSaveError="",this._settingsEditorInitialized=!1,this._settingsPageKey="overview",this._settingsRestorePageKey="overview",this._settingsRestoreAreaId=void 0,this._settingsPageTitle="",this._settingsPageParentTitle="",this._settingsPageDescription="",this._setSettingsHistoryState(!0),this._closeMobileNav(),this._syncBottomNavAreaContext(),this.updateComplete.then(()=>this._scrollContentAreaToTop()))},this._openProfileSettings=()=>{P("/profile/general")},this._openNotificationsFromHomeShortcut=e=>{e.preventDefault(),e.stopPropagation(),this._closeMobileNav(),this._openNotifications()},this._openNotifications=()=>{this._showNotificationsUi()&&(this._notificationsOpen=!0,this._persistentNotificationsLoaded=!0,this._loadPersistentNotifications(!0),this._ensurePersistentNotificationsSubscription())},this._closeNotifications=()=>{this._notificationsOpen=!1},this._dismissPersistentNotification=async e=>{const t=this._persistentNotifications;this._persistentNotifications=t.filter(t=>t.notification_id!==e);try{await this.hass.callService("persistent_notification","dismiss",{notification_id:e}),this._notificationsError=""}catch(e){console.error("Failed to dismiss persistent notification:",e),this._persistentNotifications=t,this._notificationsError=this._t("error.notification_dismiss")}},this._dismissAllPersistentNotifications=async()=>{const e=this._persistentNotifications;this._persistentNotifications=[];try{await this.hass.callService("persistent_notification","dismiss_all"),this._notificationsError=""}catch(t){console.error("Failed to dismiss all persistent notifications:",t),this._persistentNotifications=e,this._notificationsError=this._t("error.notifications_dismiss_all")}},this._handleConfirmationKeydown=e=>{"Escape"===e.key&&(e.preventDefault(),this._resolveConfirmation(!1))}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(this.config=e,!this._selectedView){const t=window.history.state?.[at],a=Boolean(t&&"object"==typeof t&&"number"==typeof t.updatedAt&&Date.now()-t.updatedAt<=15e3),o=this._getUrlArea();a?(this._selectedArea=null,this._selectedView="settings",this._settingsRestorePageKey="string"==typeof t.page?t.page:"overview",this._settingsRestoreAreaId="string"==typeof t.areaId?t.areaId:void 0):(t&&this._setSettingsHistoryState(!1),o&&e.areas?.some(e=>e.area_id===o)?(this._selectedArea=o,this._selectedView="area"):this._selectedView="home")}this._restoreAreaEditMode()}_getUrlArea(){try{return new URL(window.location.href).searchParams.get("dd_area")}catch{return null}}_updateUrlArea(e){try{const t=new URL(window.location.href);e?t.searchParams.set("dd_area",e):t.searchParams.delete("dd_area"),window.history.replaceState(window.history.state,"",t.toString())}catch{}}_setSettingsHistoryState(e){try{const t={...window.history.state&&"object"==typeof window.history.state?window.history.state:{}};e?t[at]={page:this._settingsPageKey||"overview",areaId:this._settingsRestoreAreaId,updatedAt:Date.now()}:delete t[at],window.history.replaceState(t,"",window.location.href)}catch{}}_syncBottomNavAreaContext(){const e=this.config?.areas?.find(e=>e.area_id===this._selectedArea),t="settings"===this._selectedView;window.dispatchEvent(new CustomEvent("dwains-dashboard-next-area-context-changed",{detail:{areaId:"area"===this._selectedView?this._selectedArea:null,icon:t?"mdi:pencil":e?h(e):"mdi:home",name:t?this._t("sidebar.dashboard_settings"):e?.name||this._t("sidebar.home"),view:this._selectedView||"home"}}))}_canManageDashboard(){return!F(this.hass,this.config?.settings)}_areaEditModeStorageKey(){return`dd-next-area-edit-mode:${this._getDashboardUrlPath()||"default"}`}_rememberAreaEditMode(e){try{const t=this._areaEditModeStorageKey();if(!e)return void window.sessionStorage.removeItem(t);window.sessionStorage.setItem(t,JSON.stringify({areaId:e,updatedAt:Date.now()}))}catch{}}_restoreAreaEditMode(){if(!this._canManageDashboard())return this._editMode=!1,void this._rememberAreaEditMode(null);try{const e=window.sessionStorage.getItem(this._areaEditModeStorageKey());if(!e)return;const t=JSON.parse(e),a="number"==typeof t.updatedAt&&Date.now()-t.updatedAt<=3e4;if(!t.areaId||!a)return void this._rememberAreaEditMode(null);"area"===this._selectedView&&this._selectedArea===t.areaId&&(this._editMode=!0)}catch{this._rememberAreaEditMode(null)}}_showNotificationsUi(){return!1!==this.config?.settings?.show_notifications}_showSuggestedFavoritesUi(){return!1!==this.config?.settings?.show_suggested_favorites}_hasUsagePredictionComponent(){return Boolean(this.hass?.config?.components?.includes("usage_prediction"))}_isFavoriteEntityVisible(e){const t=this.hass?.states?.[e],a=this.hass?.entities?.[e];return Boolean(t&&"unavailable"!==t.state&&"unknown"!==t.state&&!a?.hidden_by&&!a?.hidden)}_getManualFavoriteEntities(){const e=new Set;return(this.config?.favorites||[]).filter(t=>!e.has(t)&&(e.add(t),this._isFavoriteEntityVisible(t)))}_getEffectiveFavoriteEntities(){const e=this._getManualFavoriteEntities();if(!this._showSuggestedFavoritesUi())return e;const t=Math.max(8,e.length);if(e.length>=t)return e.slice(0,t);const a=new Set(e),o=this._suggestedFavoriteEntities.filter(e=>!a.has(e)&&(!!this._isFavoriteEntityVisible(e)&&(a.add(e),!0)));return[...e,...o].slice(0,t)}_ensureFavoriteSuggestionsFeature(){if(this.hass&&this._showSuggestedFavoritesUi()&&!this._favoriteSuggestionsLoaded&&!this._favoriteSuggestionsLoading)return this._hasUsagePredictionComponent()?void(this._getManualFavoriteEntities().length>=8||this._loadFavoriteSuggestions()):(this._favoriteSuggestionsLoaded=!0,void(this._suggestedFavoriteEntities=[]))}async _loadFavoriteSuggestions(){if(this.hass&&!this._favoriteSuggestionsLoading){this._favoriteSuggestionsLoading=!0;try{const e=await this.hass.callWS({type:"usage_prediction/common_control"});this._suggestedFavoriteEntities=Array.isArray(e?.entities)?e.entities.filter(e=>"string"==typeof e):[]}catch(e){console.debug("Dwains Dashboard: favorite suggestions are not available.",e),this._suggestedFavoriteEntities=[]}finally{this._favoriteSuggestionsLoading=!1,this._favoriteSuggestionsLoaded=!0}}}_ensurePersistentNotificationsFeature(){this._showNotificationsUi()&&this.hass&&!this._persistentNotificationsLoaded&&(this._persistentNotificationsLoaded=!0,this._loadPersistentNotifications(!1),this._ensurePersistentNotificationsSubscription())}static getStubConfig(){return{type:"custom:dwains-dashboard-next-layout-card",areas:[],devices:[],entities:[],floors:[],settings:{},favorites:[]}}connectedCallback(){super.connectedCallback(),this._syncThemeAttribute(),this._loadMobileEntityLayoutPreference(),this._loadAreaSidebarWidthPreference(),this._loadAreaSidebarCollapsedPreference(),this._checkMobile(),this._setupEventListeners(),window.addEventListener("dwains-dashboard-next-toggle-area-nav",this._handleAreaNavToggle),window.addEventListener("dwains-dashboard-next-mobile-nav-sheet",this._handleMobileNavSheet),window.addEventListener("dwains-dashboard-next-open-settings",this._handleOpenSettingsEvent),window.addEventListener("dwains-dashboard-next-open-home",this._handleOpenHomeEvent),this._startTimeUpdate(),this._initializeObservers(),et(this),requestAnimationFrame(()=>this._restorePendingRoomDragScroll()),window.setTimeout(()=>this._restorePendingRoomDragScroll(),120),window.setTimeout(()=>this._restorePendingRoomDragScroll(),420)}willUpdate(e){if(super.willUpdate(e),e.has("config")&&this.hass&&(this._clearEntityCardsCache(),I(this.hass,this.config?.settings),!this._canManageDashboard()&&this._editMode&&(this._editMode=!1,this._rememberAreaEditMode(null))),e.has("hass")&&this.hass){this._syncThemeAttribute(),I(this.hass,this.config?.settings),this._syncBottomNavAreaContext(),this._reconcileOptimisticEntityStates(),!this._canManageDashboard()&&this._editMode&&(this._editMode=!1,this._rememberAreaEditMode(null));const t=e.get("hass");t&&this._shouldUpdateEntities(t,this.hass)&&this._invalidateChangedAreaCaches(t,this.hass)}}_scheduleHeaderStatusScrollState(){void 0!==this._headerStatusScrollRaf&&cancelAnimationFrame(this._headerStatusScrollRaf),this._headerStatusScrollRaf=requestAnimationFrame(()=>{this._headerStatusScrollRaf=void 0,this._updateHeaderStatusScrollState()})}_updateHeaderStatusScrollState(){const e=this.shadowRoot?.querySelector(".header-status-scroll");if(!e)return void((this._headerStatusCanScrollLeft||this._headerStatusCanScrollRight)&&(this._headerStatusCanScrollLeft=!1,this._headerStatusCanScrollRight=!1));const t=Math.max(0,e.scrollWidth-e.clientWidth),a=e.scrollLeft>1,o=e.scrollLeft<t-1;this._headerStatusCanScrollLeft!==a&&(this._headerStatusCanScrollLeft=a),this._headerStatusCanScrollRight!==o&&(this._headerStatusCanScrollRight=o)}_scrollHeaderStatus(e){const t=this.shadowRoot?.querySelector(".header-status-scroll");if(!t)return;const a=t.querySelector(".status-card-compact");if(!a)return;const o=getComputedStyle(t),r=Number.parseFloat(o.columnGap||o.gap||"0")||0,i=a.getBoundingClientRect().width+r,n=Math.max(i,.72*t.clientWidth);t.scrollBy({left:e*n,behavior:"smooth"})}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("dwains-dashboard-next-toggle-area-nav",this._handleAreaNavToggle),window.removeEventListener("dwains-dashboard-next-mobile-nav-sheet",this._handleMobileNavSheet),window.removeEventListener("dwains-dashboard-next-open-settings",this._handleOpenSettingsEvent),window.removeEventListener("dwains-dashboard-next-open-home",this._handleOpenHomeEvent),window.removeEventListener("pointermove",this._handleSidebarResizeMove),window.removeEventListener("pointerup",this._handleSidebarResizeEnd),window.removeEventListener("pointercancel",this._handleSidebarResizeEnd),this._persistentNotificationsUnsub?.(),this._persistentNotificationsUnsub=void 0,this._cleanupEventListeners(),this._cleanupObservers(),this._timeInterval&&clearInterval(this._timeInterval),this._homeSummariesRefreshInterval&&(clearInterval(this._homeSummariesRefreshInterval),this._homeSummariesRefreshInterval=void 0),this._areaHeaderScrollRaf&&(cancelAnimationFrame(this._areaHeaderScrollRaf),this._areaHeaderScrollRaf=void 0),void 0!==this._headerStatusScrollRaf&&(cancelAnimationFrame(this._headerStatusScrollRaf),this._headerStatusScrollRaf=void 0),void 0!==this._areaSidebarRestoreRaf&&(cancelAnimationFrame(this._areaSidebarRestoreRaf),this._areaSidebarRestoreRaf=void 0),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0),this._progressiveRenderCancel&&(this._progressiveRenderCancel(),this._progressiveRenderCancel=void 0),this._confirmationResolve?.(!1),this._confirmationResolve=void 0,this._confirmationDialog=null}_setupEventListeners(){window.addEventListener("resize",this._handleResize),window.addEventListener("scroll",this._handleWindowScroll,{passive:!0}),this.addEventListener("show-more-info",this._handleShowMoreInfo)}_cleanupEventListeners(){window.removeEventListener("resize",this._handleResize),window.removeEventListener("scroll",this._handleWindowScroll),this.removeEventListener("show-more-info",this._handleShowMoreInfo)}_isDesktopAreaSidebarCollapsed(){return this._areaSidebarCollapsed&&!this._isMobile}_restoreAreaSidebarScroll(){this._isMobile||this._isDesktopAreaSidebarCollapsed()||(void 0!==this._areaSidebarRestoreRaf&&cancelAnimationFrame(this._areaSidebarRestoreRaf),this._areaSidebarRestoreRaf=requestAnimationFrame(()=>{this._areaSidebarRestoreRaf=void 0;const e=this.shadowRoot?.querySelector(".sidebar");if(!e)return;const t=Math.max(0,e.scrollHeight-e.clientHeight),a=Math.min(this._areaSidebarScrollTop,t);Math.abs(e.scrollTop-a)>1&&(e.scrollTop=a)}))}_restorePendingRoomDragScroll(){if("area"!==this._selectedView||!this._selectedArea)return!1;let e=null;try{const t=window.sessionStorage.getItem("dd-next-room-dnd-scroll");t&&(e=JSON.parse(t))}catch{return!1}if(!e||e.expiresAt<Date.now()||e.areaId!==this._selectedArea||e.pathname!==window.location.pathname){try{window.sessionStorage.removeItem("dd-next-room-dnd-scroll")}catch{}return!1}const t=()=>{const t=this.shadowRoot?.querySelector(".content-area");t&&Math.abs(t.scrollTop-e.contentScrollTop)>1&&(t.scrollTop=e.contentScrollTop),(Math.abs(window.scrollX-e.windowScrollX)>1||Math.abs(window.scrollY-e.windowScrollY)>1)&&window.scrollTo(e.windowScrollX,e.windowScrollY)};return requestAnimationFrame(t),window.setTimeout(t,90),window.setTimeout(t,240),window.setTimeout(t,600),window.setTimeout(t,1200),window.setTimeout(()=>{t();try{window.sessionStorage.removeItem("dd-next-room-dnd-scroll")}catch{}},1800),!0}_scrollContentAreaToTop(){const e=this.shadowRoot?.querySelector(".content-area"),t=new Set;e&&t.add(e);(e=>{let a=e;for(;a;){if(a instanceof HTMLElement&&t.add(a),a.parentNode){a=a.parentNode;continue}const e=a.getRootNode();a=e instanceof ShadowRoot?e.host:null}})(e||this);for(const e of t)e.scrollTop=0,e.scrollLeft=0;const a=document.scrollingElement;a&&(a.scrollTop=0,a.scrollLeft=0),document.documentElement.scrollTop=0,document.documentElement.scrollLeft=0,document.body.scrollTop=0,document.body.scrollLeft=0,window.scrollTo(0,0)}_resetAreaHeaderScrollState(e=!1){this._areaHeaderScrollRaf&&(cancelAnimationFrame(this._areaHeaderScrollRaf),this._areaHeaderScrollRaf=void 0),e&&this._scrollContentAreaToTop(),this._pendingAreaScrollTop=0,this._areaHeaderStuck&&(this._areaHeaderStuck=!1),this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1),this._lastAreaScrollTop=0,this._areaScrollUpDistance=0}_resetAreaHeaderAfterNavigation(){this._restorePendingRoomDragScroll()||(this._resetAreaHeaderScrollState(!0),requestAnimationFrame(()=>{this._restorePendingRoomDragScroll()||this._resetAreaHeaderScrollState(!0)}),requestAnimationFrame(()=>requestAnimationFrame(()=>{this._restorePendingRoomDragScroll()||this._resetAreaHeaderScrollState(!0)})),window.setTimeout(()=>{this._restorePendingRoomDragScroll()||this._resetAreaHeaderScrollState(!0)},80),window.setTimeout(()=>{this._restorePendingRoomDragScroll()||this._resetAreaHeaderScrollState(!0)},220))}_resetProgressiveMobileRender(){this._renderAllMobileHomeAreas=!this._isMobile,this._renderAllMobileAreaEntities=!this._isMobile,this._progressiveRenderCancel&&(this._progressiveRenderCancel(),this._progressiveRenderCancel=void 0)}_scheduleProgressiveMobileRender(){if(!this._isMobile)return this._renderAllMobileHomeAreas=!0,void(this._renderAllMobileAreaEntities=!0);if(this._renderAllMobileHomeAreas&&this._renderAllMobileAreaEntities)return;if(this._progressiveRenderCancel)return;const e=()=>{this._progressiveRenderCancel=void 0,this._renderAllMobileHomeAreas=!0,this._renderAllMobileAreaEntities=!0},t=window.requestIdleCallback,a=window.cancelIdleCallback;if(t&&a){const o=t(e,{timeout:450});this._progressiveRenderCancel=()=>a(o)}else{const t=window.setTimeout(e,90);this._progressiveRenderCancel=()=>window.clearTimeout(t)}}_updateAreaHeaderScrollState(){const e=this.shadowRoot?.querySelector(".content-area");if(!this._isMobile||"area"!==this._selectedView||!e)return this._areaHeaderStuck&&(this._areaHeaderStuck=!1),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1));const t=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||e.scrollTop||0;this._setAreaHeaderStuckForScroll(t,!1)}_setAreaHeaderStuckForScroll(e,t){if(!this._isMobile||"area"!==this._selectedView)return this._areaHeaderStuck&&(this._areaHeaderStuck=!1),this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1),this._lastAreaScrollTop=0,void(this._areaScrollUpDistance=0);if(!t){this._lastAreaScrollTop=e,this._areaScrollUpDistance=0;const t=e>76;return this._areaHeaderStuck!==t&&(this._areaHeaderStuck=t),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1))}const a=e-this._lastAreaScrollTop;if(this._lastAreaScrollTop=e,e<=2)return this._areaScrollUpDistance=0,this._areaHeaderStuck&&(this._areaHeaderStuck=!1),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1));a<-1?this._areaScrollUpDistance+=Math.abs(a):a>1&&(this._areaScrollUpDistance=0);let o=this._areaHeaderStuck,r=this._areaHeaderRevealed;a>1&&e>76&&(o=!0,r=!1),this._areaHeaderStuck&&this._areaScrollUpDistance>=18&&e>88&&(r=!0),e<=38&&(o=!1,r=!1),this._areaHeaderStuck!==o&&(this._areaHeaderStuck=o),this._areaHeaderRevealed!==r&&(this._areaHeaderRevealed=r)}_checkMobile(){const e=this._isMobile;this._isMobile=window.innerWidth<=768,e!==this._isMobile&&(this._mobileNavOpen=!1)}_startTimeUpdate(){this._updateTime(),this._timeInterval=window.setInterval(()=>this._updateTime(),6e4)}_updateTime(){const e=new Date;this._currentTime=e.toLocaleTimeString(this.hass?.language||"en",{hour:"2-digit",minute:"2-digit",hour12:!1}),this._currentDate=e.toLocaleDateString(this.hass?.language||"en",{weekday:"short",day:"numeric",month:"short"})}_loadMobileEntityLayoutPreference(){try{const e=window.localStorage.getItem("dd-next-mobile-entity-layout"),t=window.localStorage.getItem("dd-next-mobile-home-areas-layout"),a=window.localStorage.getItem("dd-next-mobile-home-devices-layout"),o=window.localStorage.getItem("dd-next-mobile-home-favorites-layout"),r=window.localStorage.getItem("dd-next-mobile-home-cameras-layout");"rail"!==e&&"grid"!==e||(this._mobileEntityLayout=e),"rail"!==t&&"grid"!==t||(this._mobileHomeAreasLayout=t),"rail"!==a&&"grid"!==a||(this._mobileHomeDevicesLayout=a),"rail"!==o&&"grid"!==o||(this._mobileHomeFavoritesLayout=o),"rail"!==r&&"grid"!==r||(this._mobileHomeCamerasLayout=r)}catch{}}_loadAreaSidebarWidthPreference(){try{const e=window.localStorage.getItem(ot);if(!e)return;const t=Number(e);Number.isFinite(t)&&(this._areaSidebarWidth=this._clampAreaSidebarWidth(t))}catch{}}_saveAreaSidebarWidthPreference(e){try{window.localStorage.setItem(ot,String(Math.round(e)))}catch{}}_loadAreaSidebarCollapsedPreference(){try{this._areaSidebarCollapsed="true"===window.localStorage.getItem(rt)}catch{}}_saveAreaSidebarCollapsedPreference(e){try{window.localStorage.setItem(rt,e?"true":"false")}catch{}}_clampAreaSidebarWidth(e){const t=Math.max(it,Math.min(660,Math.floor(.46*window.innerWidth)));return Math.round(Math.max(it,Math.min(t,e)))}_initializeObservers(){this._resizeObserver=new ResizeObserver(()=>{this._debouncedUpdate()}),this.shadowRoot&&this._resizeObserver.observe(this.shadowRoot.host)}_cleanupObservers(){this._resizeObserver&&this._resizeObserver.disconnect()}_hasAreaClimateDisplayMetadataChanges(e,t){const a=new Set([...Object.keys(e.areas||{}),...Object.keys(t.areas||{})]);for(const o of a){const a=e.areas?.[o],r=t.areas?.[o],i=a?.temperature_entity_id,n=r?.temperature_entity_id,s=a?.humidity_entity_id,c=r?.humidity_entity_id;if(i!==n||s!==c)return!0;const d=new Set([i,n,s,c].filter(Boolean));for(const a of d){const o=e.entities?.[a],r=t.entities?.[a];if(o?.display_precision!==r?.display_precision)return!0}}return!1}shouldUpdate(e){if(!this.config||!this.hass)return!1;if(e.has("config")||e.has("_selectedView")||e.has("_selectedArea")||e.has("_headerExpanded")||e.has("_currentTime"))return!0;if(e.has("hass")){const t=e.get("hass");if(!t)return!0;if(this._hasUpdateEntityChanges(t,this.hass))return!0;if(this._hasAreaClimateDisplayMetadataChanges(t,this.hass))return!0;return this._getRelevantEntities().some(e=>t.states[e]!==this.hass.states[e])}return!0}updated(e){if(super.updated(e),this._scheduleHeaderStatusScrollState(),e.has("hass")&&this.hass){const t=e.get("hass");t&&this._updateEntityCards(t,this.hass),this._headerExpanded&&this._renderFavoriteTileCards(),this._ensurePersistentNotificationsFeature(),this._homeSummariesLoaded||(this._homeSummariesLoaded=!0,this._loadHomeAssistantSummaries(),this._homeSummariesRefreshInterval=window.setInterval(()=>{this._loadHomeAssistantSummaries()},3e5)),this._ensureFavoriteSuggestionsFeature()}e.has("config")&&(this._showNotificationsUi()?this._ensurePersistentNotificationsFeature():(this._notificationsOpen=!1,this._persistentNotificationsLoaded=!1,this._persistentNotifications=[]),this._showSuggestedFavoritesUi()?this._ensureFavoriteSuggestionsFeature():(this._favoriteSuggestionsLoaded=!1,this._favoriteSuggestionsLoading=!1,this._suggestedFavoriteEntities=[])),(e.has("_selectedView")||e.has("_selectedArea")||e.has("config"))&&(this._syncBottomNavAreaContext(),this._restoreAreaSidebarScroll()),e.has("_isMobile")&&this._restoreAreaSidebarScroll(),e.has("_headerExpanded")&&this._headerExpanded&&this.hass&&setTimeout(()=>{this._renderFavoriteTileCards()},0),e.has("_selectedView")||e.has("_selectedArea")?(this._resetProgressiveMobileRender(),"area"===this._selectedView?this._restorePendingRoomDragScroll()||this._resetAreaHeaderAfterNavigation():this._resetAreaHeaderScrollState(!1)):e.has("config")&&"area"===this._selectedView&&this._restorePendingRoomDragScroll(),(e.has("_selectedView")||e.has("_selectedArea")||e.has("_isMobile")||this._isMobile&&(!this._renderAllMobileHomeAreas||!this._renderAllMobileAreaEntities))&&this._scheduleProgressiveMobileRender(),"settings"===this._selectedView&&this._syncSettingsEditor()}_syncThemeAttribute(){this.toggleAttribute("data-theme-dark",H(this.hass,this))}_getRelevantEntities(){if(!this.config)return[];if("settings"===this._selectedView)return[];if("area"===this._selectedView&&this._selectedArea){return this._getAreaEntities(this._selectedArea).map(e=>e.entity_id)}return this.config.entities?.map(e=>e.entity_id)||[]}render(){if(!this.hass||!this.config)return d`<div class="loading">${this._t("common.loading")}</div>`;const e=this._isMobile&&!this._mobileNavOpen&&this._getNowPlayingPlayers().length>0,t={"layout-container":!0,"has-floating-now-playing":e,"sidebar-resizing":this._isResizingSidebar,"sidebar-collapsed":this._isDesktopAreaSidebarCollapsed()};return d`
      <div
        class=${p(t)}
        style=${`--area-sidebar-width: ${this._areaSidebarWidth}px;`}
      >
        ${this._renderSidebar()}
        ${this._isMobile?c:this._renderSidebarResizeHandle()}
        <div class="main-content">
          ${"area"!==this._selectedView||this._isMobile?c:this._renderGlobalHeader()}
          <div
            class="content-area ${"home"===this._selectedView?"home-content-area":""} ${"area"===this._selectedView?"area-content-area":""} ${"settings"===this._selectedView?"settings-content-area":""}"
            @scroll=${this._handleContentScroll}
          >
            ${"home"===this._selectedView?this._renderHomeView():"area"===this._selectedView&&this._selectedArea?this._renderAreaView():"settings"===this._selectedView?this._renderSettingsView():c}
          </div>
        </div>
      </div>
      ${e?this._renderNowPlayingBar(!0):c}
      ${this._renderToast()}
      ${this._renderConfirmationDialog()}
      ${this._renderHousePowerDialog()}
      ${this._renderNotificationsPanel()}
    `}_renderSidebarResizeHandle(){const e=this._isDesktopAreaSidebarCollapsed();return d`
      <button
        class="sidebar-collapse-toggle ${e?"is-collapsed":""}"
        type="button"
        title=${e?this._t("sidebar.show"):this._t("sidebar.collapse")}
        aria-label=${e?this._t("sidebar.show"):this._t("sidebar.collapse")}
        @click=${this._toggleAreaSidebarCollapsed}
      >
        <ha-icon icon=${e?"mdi:chevron-right":"mdi:chevron-left"}></ha-icon>
      </button>
      ${e?c:d`
      <button
        class="sidebar-resize-handle"
        type="button"
        role="separator"
        aria-label=${this._t("sidebar.resize")}
        aria-orientation="vertical"
        aria-valuemin=${it}
        aria-valuemax=${660}
        aria-valuenow=${this._areaSidebarWidth}
        title=${this._t("sidebar.resize_drag")}
        @pointerdown=${this._startSidebarResize}
        @keydown=${this._handleSidebarResizeKeydown}
      ></button>
      `}
    `}_homeNowPlayingEnabled(){const e=this.config?.settings;return(e?.home_sections_order||[]).includes("now_playing")||(e?.home_sections_hidden||[]).includes("now_playing")?!(e?.home_sections_hidden||[]).includes("now_playing"):"off"!==B(e?.now_playing_bar)}_areaNowPlayingEnabled(){const e=this.config?.settings;return void 0!==e?.show_area_now_playing?e.show_area_now_playing:"all"===B(e?.now_playing_bar)}_nowPlayingShown(){return"home"===this._selectedView?this._homeNowPlayingEnabled():"area"===this._selectedView&&this._areaNowPlayingEnabled()}_getNowPlayingPlayers(){return this.hass&&this._nowPlayingShown()?this._nowPlayingPlayers(this.hass,this.hass.states,this.config,q(this.hass),this._currentTime):[]}_renderNowPlayingBar(e){const t=this._getNowPlayingPlayers();return t.length?d`
      <dwains-dashboard-next-now-playing class=${e?"floating":"inline"} .hass=${this.hass} .players=${t} .floating=${e}></dwains-dashboard-next-now-playing>
    `:c}_renderNotificationsPanel(){if(!this._showNotificationsUi())return c;const e=this._persistentNotifications.length,t=e>0;return d`
      <dd-next-popup-shell
        .open=${this._notificationsOpen}
        .titleText=${this._t("home.notifications")}
        .titleCount=${e}
        icon="mdi:bell-outline"
        .accent=${m("notification")}
        .closeLabel=${this._t("common.close")}
        @dd-close=${this._closeNotifications}
      >
        <div slot="actions" class="notifications-actions">
          ${t?d`
            <button
              class="notifications-icon-button destructive"
              type="button"
              title=${this._t("common.dismiss_all")}
              aria-label=${this._t("common.dismiss_all")}
              @click=${this._dismissAllPersistentNotifications}
            >
              <ha-icon icon="mdi:delete-sweep-outline"></ha-icon>
            </button>
          `:c}
        </div>

        <div class="notifications-list">
          ${this._notificationsLoading&&!t?d`
                <div class="notifications-loading">
                  <ha-icon icon="mdi:loading"></ha-icon>
                  <span>${this._t("home.notifications_loading")}</span>
                </div>
              `:this._notificationsError?d`
                  <div class="notifications-error">
                    <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                    <span>${this._notificationsError}</span>
                  </div>
                `:t?this._persistentNotifications.map(e=>this._renderPersistentNotification(e)):d`
                    <div class="notifications-empty">
                      <ha-icon icon="mdi:bell-check-outline"></ha-icon>
                      <span>${this._t("home.notifications_empty")}</span>
                    </div>
                  `}
        </div>
      </dd-next-popup-shell>
    `}_renderPersistentNotification(e){return d`
      <article class="notification-row">
        <div class="notification-icon">
          <ha-icon icon="mdi:bell-badge-outline"></ha-icon>
        </div>
        <div class="notification-copy">
          <div class="notification-title">${e.title||this._t("home.notification")}</div>
          <div class="notification-message">${e.message}</div>
          ${e.created_at?d`
            <div class="notification-date">${this._formatNotificationDate(e.created_at)}</div>
          `:c}
        </div>
        <button
          class="notification-dismiss"
          type="button"
          title=${this._t("common.dismiss")}
          aria-label=${this._t("common.dismiss")}
          @click=${()=>this._dismissPersistentNotification(e.notification_id)}
        >
          <ha-icon icon="mdi:trash-can-outline"></ha-icon>
        </button>
      </article>
    `}_renderSidebar(){const e={sidebar:!0,open:this._isMobile&&this._mobileNavOpen},t=this._showNotificationsUi()&&this._persistentNotifications.length>0,a=d`
      <nav class=${p(e)} @scroll=${this._handleSidebarScroll}>
        <div class="area-list">
          <div
            class="area-button home-button ${"home"===this._selectedView?"selected":""} ${t?"has-notifications":""}"
            role="button"
            tabindex="0"
            @click=${()=>this._selectView("home")}
            @keydown=${this._handleHomeNavigationKeydown}
          >
            <div class="area-icon">
              <ha-icon icon="mdi:home"></ha-icon>
            </div>
            <div class="area-info">
              <div class="area-name">${this._t("sidebar.home")}</div>
            </div>
            ${this._renderHomeNotificationShortcut()}
            <ha-icon class="area-menu-chevron" icon="mdi:chevron-right"></ha-icon>
          </div>

          ${this._renderAreaButtons()}
        </div>
      </nav>
    `;return this._isMobile?d`
      <dd-next-popup-shell
        .open=${this._mobileNavOpen}
        .navigationMenu=${!0}
        .titleText=${this._t("home.areas")}
        icon="mdi:view-grid-outline"
        .closeLabel=${this._t("common.close")}
        @dd-close=${this._closeMobileNav}
      >${a}</dd-next-popup-shell>
    `:a}_renderHomeNotificationShortcut(){if(!this._showNotificationsUi())return c;const e=this._persistentNotifications.length;if(!e)return c;const t=`${e} persistent ${1===e?"notification":"notifications"}`,a=e>99?"99+":String(e);return d`
      <button
        class="home-notification-shortcut"
        type="button"
        title=${t}
        aria-label=${t}
        @click=${this._openNotificationsFromHomeShortcut}
      >
        <ha-icon icon="mdi:bell-outline"></ha-icon>
        <span class="home-notification-count">${a}</span>
      </button>
    `}_groupAreasByFloor(e){const t={};return e.forEach(e=>{let a="no_floor";if(e.floor_id&&this.config?.floors){const t=this.config.floors.find(t=>t.floor_id===e.floor_id);t?.name&&(a=t.name)}t[a]||(t[a]=[]),t[a].push(e)}),t}_getVisibleSortedAreas(){return this.config?.areas?g(this.config.areas,this.config.areas_display,N(this.hass)):[]}_renderAreaButtons(){if(!this.config?.areas)return c;const e=this._getVisibleSortedAreas(),t=this._groupAreasByFloor(e),a=[...this.config.floors||[]],o=this.config.floors_display?.order||[];if(o.length){const e=new Map(o.map((e,t)=>[e,t]));a.sort((t,a)=>(e.get(t.floor_id)??Number.MAX_SAFE_INTEGER)-(e.get(a.floor_id)??Number.MAX_SAFE_INTEGER))}const r=new Map(a.map((e,t)=>[e.name,t])),i=new Intl.Collator(N(this.hass),{numeric:!0,sensitivity:"base"}),n=Object.entries(t).sort(([e],[t])=>{if("no_floor"===e)return 1;if("no_floor"===t)return-1;const a=r.get(e),o=r.get(t);return void 0!==a||void 0!==o?(a??Number.MAX_SAFE_INTEGER)-(o??Number.MAX_SAFE_INTEGER):i.compare(e,t)});return n.map(([e,t])=>{const a="no_floor"===e?this.hass.localize("ui.components.area-picker.no_floor")||this._t("home.unassigned_spaces"):e;return d`
        <div class="floor-section">
          <div class="floor-header">
            <h3>${a}</h3>
          </div>
          <div class="floor-areas">
            ${b(t,e=>e.area_id,e=>this._renderAreaButton(e))}
          </div>
        </div>
      `})}_sidebarAreaBadgeLimit(e=Number.MAX_SAFE_INTEGER){const t=Math.max(0,this._areaSidebarWidth-16),a=Math.max(0,t-14-74-9);if(e<=Math.max(1,Math.floor((a+4)/48)))return Math.min(8,e);const o=Math.max(1,Math.floor(Math.max(0,a-15-4)/48));return Math.min(8,o)}_renderAreaButton(e){const t=this._getCachedAreaData(e),a=this._selectedArea===e.area_id,o=Boolean(e.picture),r=this._getAreaStatusBadges(t),i=this._isMobile&&r.length>4,n=this._isMobile?i?3:Math.min(4,r.length):this._sidebarAreaBadgeLimit(r.length),s=this._isMobile?i:r.length>n,l=r.slice(0,n),p=[t.temperature,t.humidity,t.wattage].filter(Boolean).join(" • ");return d`
      <button
        class="area-button room-area-button ${a?"selected":""} ${o?"has-picture":"has-icon"}"
        @click=${()=>this._selectArea(e.area_id)}
      >
        ${o?d`
          <div
            class="area-list-picture"
            aria-hidden="true"
            style=${`background-image: url('${e.picture}');`}
          ></div>
        `:c}

        <div class="area-media" aria-hidden="true">
          ${o?d`<div class="area-media-picture" style=${`background-image: url('${e.picture}');`}></div>`:d`
                <div class="area-media-icon">
                  <ha-icon icon=${h(e)}></ha-icon>
                </div>
              `}
        </div>

        <div class="area-content">
          <div class="area-top-section">
            <div class="area-name">${e.name}</div>
            <div class="area-sensors ${p?"":"is-empty"}">
              ${p||" "}
            </div>
          </div>
          <div class="area-info-badges">
            ${l.map(t=>"light"===t.domain?d`
                    <span
                      class="info-badge ${t.className} clickable"
                      style=${`--badge-color: ${t.color}; --area-badge-color: ${t.color};`}
                      @click=${t=>this._handleLightToggle(t,e.area_id)}
                    >
                      <ha-icon icon=${t.icon}></ha-icon>
                      <span class="badge-count">${t.count}</span>
                    </span>
                  `:d`
                    <span
                      class="info-badge ${t.className}"
                      style=${`--badge-color: ${t.color}; --area-badge-color: ${t.color};`}
                    >
                      <ha-icon icon=${t.icon}></ha-icon>
                      <span class="badge-count">${t.count}</span>
                    </span>
                  `)}
            ${s?d`
              <span
                class="info-badge info-badge-overflow"
                title="Weitere aktive Status"
                aria-label="Weitere aktive Status"
              >…</span>
            `:c}
          </div>
        </div>
      </button>
    `}_renderGlobalHeader(){const e={"global-header":!0,compact:this._headerCompact,expanded:this._headerExpanded&&"area"!==this._selectedView,"room-context":"area"===this._selectedView,mobile:this._isMobile},t=this._getEffectiveFavoriteEntities().length;return d`
      <header class=${p(e)}>
        <div class="header-content">
          ${this._renderHeaderStatusCards()}

          ${this._isMobile?c:d`
            <div class="header-time-weather">
              ${this._renderWeatherDisplay()}
              ${!1!==this.config?.settings?.show_time?d`
                <div class="header-time-section">
                  <div class="header-time">${this._currentTime}</div>
                  <div class="header-date">${this._currentDate}</div>
                </div>
              `:c}
            </div>
          `}
        </div>

        ${"area"!==this._selectedView||this._isMobile||!1===this.config?.settings?.show_area_favorites?c:this._renderRoomFavoritesBlock()}

        ${"area"===this._selectedView&&!this._isMobile&&this._areaNowPlayingEnabled()?d`
          <div class="room-global-now-playing">
            ${this._renderNowPlayingBar(!1)}
          </div>
        `:c}

        ${t&&"area"!==this._selectedView?d`
          <button
            class="area-favorites-toggle"
            type="button"
            aria-expanded=${this._headerExpanded?"true":"false"}
            @click=${this._toggleHeader}
          >
            <span class="area-favorites-toggle-main">
              <ha-icon icon="mdi:star"></ha-icon>
              <span>${this._t("favorites.title")}</span>
              <span class="area-favorites-count">(${t})</span>
            </span>
            <ha-icon icon=${this._headerExpanded?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
          </button>
        `:c}

        ${"area"!==this._selectedView?d`
          <div class="header-expanded-content" style=${this._headerExpanded?"":"display:none"}>
            <div class="header-favorites">
              ${this._renderFavoritesSection()}
            </div>
          </div>
        `:c}
      </header>
    `}_renderWeatherDisplay(){if(!this._weatherDisplayEnabled())return c;const e=this._getWeatherEntity();if(!e)return c;const t=this._formatWeatherTemperature(e);return t?d`
      <div
        class="weather-compact"
        title=${this._weatherTitle(e)}
        aria-label=${this._weatherTitle(e)}
        @click=${()=>this._showMoreInfo(e.entity_id)}
      >
        <div class="weather-icon-compact">
          <ha-icon icon=${e.attributes.icon||"mdi:weather-cloudy"}></ha-icon>
        </div>
        <div class="weather-temp-compact">
          ${t}
        </div>
      </div>
    `:c}_renderHeaderStatusCards(){const e=this._getStatusDomains(),t=["header-status-section",this._headerStatusCanScrollLeft?"can-scroll-left":"",this._headerStatusCanScrollRight?"can-scroll-right":""].filter(Boolean).join(" ");return d`
      <div class=${t}>
        ${this._headerStatusCanScrollLeft?d`
          <button
            class="header-status-scroll-button header-status-scroll-button-left"
            type="button"
            title="Vorherige Status"
            aria-label="Vorherige Status"
            @click=${()=>this._scrollHeaderStatus(-1)}
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
        `:c}

        <div
          class="header-status-scroll"
          @scroll=${this._handleHeaderStatusScroll}
          @wheel=${this._handleHeaderStatusWheel}
        >
          ${b(e,e=>`${e.domain}-${e.deviceClass||e.name}`,e=>d`
              <div
                class="status-card-compact ${e.domain} ${e.value?"has-value":""} header-card"
                style=${this._domainStatusStyle(e.domain,e.deviceClass)}
                @click=${()=>this._handleStatusCardClick(e)}
                data-domain=${e.domain}
                title=${this._statusCardTitle(e)}
                aria-label=${this._statusCardTitle(e)}
              >
                <div class="status-card-icon-compact">
                  <ha-icon icon=${e.icon}></ha-icon>
                  ${e.count>0?d`
                    <div class="status-card-badge-compact">${e.count}</div>
                  `:c}
                </div>
                <div class="status-card-title-compact">${e.value||this._statusCardTitle(e)}</div>
                ${e.value?d`<div class="status-card-subtitle-compact">${"wattage"===e.domain?this._t("entity.power_usage"):e.name}</div>`:c}
              </div>
            `)}
        </div>

        ${this._headerStatusCanScrollRight?d`
          <button
            class="header-status-scroll-button header-status-scroll-button-right"
            type="button"
            title="Weitere Status"
            aria-label="Weitere Status"
            @click=${()=>this._scrollHeaderStatus(1)}
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        `:c}
      </div>
    `}_domainStatusStyle(e,t){return`--status-color: ${this._statusColor(e,t)};`}_isAlarmTriggered(){const e=this._getAlarmEntity();return!!e&&"triggered"===String(e.state||"").toLowerCase()}_binarySensorBadgeColor(e){return["motion","window","door","opening","garage_door"].includes(String(e||""))&&this._isAlarmTriggered()?m("alarm_control_panel"):m("binary_sensor",e)}_statusColor(e,t){return"binary_sensor"===e?this._binarySensorBadgeColor(t):m(e,t)}_isUrgentStatus(e,t){return this._statusColor(e,t)===m("alarm_control_panel")}_getAreaStatusBadges(e){const t=[],a=(a,o=a)=>{const r=e.domains[a]?.on||0;r&&t.push({key:a,className:o,domain:a,icon:f(a),count:r,color:m(a)})};a("light"),a("switch"),a("cover"),a("climate"),a("media_player"),a("fan"),a("lock");const o=e.domains.motion?.on||0;o&&t.push({key:"binary_sensor:motion",className:"motion",domain:"binary_sensor",deviceClass:"motion",icon:x("binary_sensor","motion"),count:o,color:this._binarySensorBadgeColor("motion")});const r=new Map;e.alerts.forEach(e=>{const t=e.deviceClass||"problem";r.set(t,(r.get(t)||0)+1)});const i=["window","door","moisture","smoke"];return[...r.entries()].sort(([e],[t])=>{const a=i.indexOf(e),o=i.indexOf(t);return(-1===a?Number.MAX_SAFE_INTEGER:a)-(-1===o?Number.MAX_SAFE_INTEGER:o)||e.localeCompare(t)}).forEach(([e,a])=>{t.push({key:`binary_sensor:${e}`,className:`binary-${e}`,domain:"binary_sensor",deviceClass:e,icon:u(e),count:a,color:this._binarySensorBadgeColor(e)})}),t.map((e,t)=>({badge:e,index:t})).sort((e,t)=>{const a=this._isUrgentStatus(e.badge.domain,e.badge.deviceClass);return a!==this._isUrgentStatus(t.badge.domain,t.badge.deviceClass)?a?-1:1:e.index-t.index}).map(({badge:e})=>e)}_statusCardTitle(e){if("cover"===e.domain&&"window"===e.statusKind){const t=this._statusPair("status.window_open");return 1===e.count?t.singular:t.plural}if("cover"===e.domain&&"door"===e.statusKind){const t=this._statusPair("status.door_open");return 1===e.count?t.singular:t.plural}if("cover"===e.domain&&"gate"===e.statusKind){return String(this.hass?.language||this.hass?.locale?.language||"").toLowerCase().startsWith("de")?1===e.count?"Tor offen":"Tore offen":1===e.count?"Gate open":"Gates open"}if("cover"===e.domain&&"shading"===e.statusKind){return String(this.hass?.language||this.hass?.locale?.language||"").toLowerCase().startsWith("de")?"Beschattung geschlossen":"Shading closed"}if("cover"===e.domain)return e.name;const t=this._statusCardActiveLabel(e);return t?1===e.count?t.singular:t.plural:e.name}_statusLabel(e,t,a=!0){const o=a?this._tp(e,t):this._t(e,{count:t}),r=String(t);return o.startsWith(r)?o.slice(r.length).trim():o}_statusPair(e,t=!0){return{singular:this._statusLabel(e,1,t),plural:this._statusLabel(e,2,t)}}_statusCardActiveLabel(e){if("person"!==e.domain){if("light"===e.domain)return this._statusPair("status.light_on");if("switch"===e.domain)return this._statusPair("status.switch_on");if("cover"===e.domain)return this._statusPair("status.cover_open");if("fan"===e.domain)return this._statusPair("status.fan_on");if("lock"===e.domain)return this._statusPair("status.lock_unlocked");if("climate"===e.domain)return this._statusPair("status.climate_active");if("media_player"===e.domain)return this._statusPair("status.media_playing");if("vacuum"===e.domain)return this._statusPair("status.vacuum_cleaning");if("alarm_control_panel"===e.domain)return this._statusPair("status.alarm_armed");if("binary_sensor"===e.domain)switch(e.deviceClass){case"door":return this._statusPair("status.door_open");case"window":return this._statusPair("status.window_open");case"opening":return this._statusPair("status.opening_open");case"motion":return this._statusPair("status.motion_detected",!1);case"smoke":return this._statusPair("status.smoke_detected",!1);case"gas":return this._statusPair("status.gas_detected",!1);case"moisture":return this._statusPair("status.moisture_detected",!1);case"occupancy":return this._statusPair("status.occupancy_detected",!1);case"presence":return this._statusPair("status.presence_detected",!1);case"tamper":return this._statusPair("status.tamper_detected",!1);case"vibration":return this._statusPair("status.vibration_detected",!1);case"safety":return this._statusPair("status.safety_active",!1);default:return}}}_entityAreaName(e){const t=this.config?.entities?.find(t=>t.entity_id===e),a=t?.device_id?this.config?.devices?.find(e=>e.device_id===t.device_id):null,o=t?.area_id||a?.area_id||this.hass?.entities?.[e]?.area_id;return this.config?.areas?.find(e=>e.area_id===o)?.name}_renderHomeView(){const e=this._getVisibleHomeSections();return d`
      <div class="home-view">
        ${this._renderHomeWelcome()}
        ${e.map(e=>this._renderHomeSection(e))}
      </div>
    `}_getHomeSectionsOrder(){return Y(this.config?.settings?.home_sections_order)}_getVisibleHomeSections(){const e=new Set(K(this.config?.settings?.home_sections_hidden)),t=this._isDesktopAreaSidebarCollapsed();return this._getHomeSectionsOrder().filter(a=>!e.has(a)||t&&"areas"===a)}_homeInformationCardVisible(e){return!new Set(X(this.config?.settings?.home_information_cards_hidden)).has(e)}_renderHomeSection(e){switch(e){case"now_playing":return this._isMobile?c:this._renderNowPlayingBar(!1);case"summaries":return this._renderHomeSummaries();case"cameras":return this._renderHomeCameras();case"areas":return this._renderMobileHomeAreas();case"devices":return this._renderHomeStatusCards();case"todos":return this._renderHomeTodos();case"custom_cards":return this._renderHomeCustomCards();case"favorites":return this._renderFavorites();case"scenes":return this._renderHomeScenes();default:return c}}_getHomeSceneItems(){return Q(J(this.config?.settings?.home_scenes),this.hass?.states||{},q(this.hass),!1!==this.config?.settings?.hide_unavailable_entities)}_homeSceneName(e){return this.hass?.states[e]?.attributes?.friendly_name||q(this.hass)[e]?.name||e}_scriptLastRunText(e){const t=Date.parse(e?.attributes?.last_triggered||"");return Number.isFinite(t)?this._formatRelativeTime(t):this._t("scenes.not_run")}_renderHomeScenes(){const e=this._getHomeSceneItems();if(!e.length)return c;const t=this._t("home_section.scenes.label");return d`
      <section class="home-summaries-section home-scenes-section">
        <div class="home-status-heading">
          <ha-icon icon=${Z.scenes.icon}></ha-icon>
          <span>${t}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <span class="mobile-section-icon"><ha-icon icon=${Z.scenes.icon}></ha-icon></span>
            <span class="mobile-section-title-label">${t}</span>
          </div>
        </div>
        <div class="home-summary-list">
          ${e.map(e=>{const t=this.hass.states[e.entityId];if(!t)return c;const a=this._homeSceneName(e.entityId),o=e.unavailable?this._t("common.unavailable"):"scene"===e.domain?this._sceneLastActivatedText(t):this._scriptLastRunText(t);return d`
              <button
                class="home-summary-card ${e.domain}"
                type="button"
                ?disabled=${e.unavailable}
                @click=${()=>this._runHomeScene(e)}
              >
                <span class="home-summary-icon"><ha-icon icon=${f(e.domain)}></ha-icon></span>
                <span class="home-summary-copy">
                  <span class="home-summary-title">${a}</span>
                  <span class="home-summary-subtitle">${o}</span>
                </span>
                <span class="home-summary-chevron"><ha-icon icon="mdi:play"></ha-icon></span>
              </button>
            `})}
        </div>
      </section>
    `}async _runHomeScene(e){if(e.unavailable)return;const t=this._homeSceneName(e.entityId);try{await this.hass.callService(e.domain,"turn_on",{entity_id:e.entityId}),this._showToast(this._t("scene"===e.domain?"scenes.activated_named":"scenes.started_named",{name:t}))}catch(a){console.warn(`Failed to run ${e.entityId}:`,a),this._showToast(this._t("scene"===e.domain?"scenes.scene_failed":"scenes.script_failed",{name:t}))}}_renderHomeSummaries(){const e=this._getHomeSummaryCards();return e.length?d`
      <section class="home-summaries-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:clipboard-list-outline"></ha-icon>
          <span>${this._t("home.summaries")}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <span class="mobile-section-icon summaries"><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>
            <span class="mobile-section-title-label">${this._t("home.summaries")}</span>
          </div>
        </div>
        <div class="home-summary-list">
          ${b(e,e=>e.key,e=>d`
              <button
                class="home-summary-card ${e.key}"
                type="button"
                style=${`--summary-color: ${e.color};`}
                @click=${()=>this._openHomeAssistantPage(e.path)}
              >
                <span class="home-summary-icon">
                  <ha-icon icon=${e.icon}></ha-icon>
                </span>
                <span class="home-summary-copy">
                  <span class="home-summary-title">${e.label}</span>
                  <span class="home-summary-subtitle">${e.subtitle}</span>
                </span>
                <span class="home-summary-chevron">
                  <ha-icon icon="mdi:chevron-right"></ha-icon>
                </span>
              </button>
            `)}
        </div>
      </section>
    `:c}_renderHomeTodos(){const e=this._getHomeTodoEntities();if(!e.length)return c;const t=this._t("home_section.todos.label");return d`
      <section class="home-todos-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>${t}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <span class="mobile-section-icon todos"><ha-icon icon="mdi:format-list-checks"></ha-icon></span>
            <span class="mobile-section-title-label">${t}</span>
          </div>
        </div>
        <div class="home-todos-grid">
          ${b(e,e=>e,e=>d`
              <div class="home-todo-card" data-entity=${e}>
                <dwains-dashboard-next-card-host
                  eager
                  framed
                  .hass=${this.hass}
                  .config=${{type:"todo-list",entity:e,title:this.hass.states[e]?.attributes?.friendly_name||this.hass.entities?.[e]?.name||e}}
                ></dwains-dashboard-next-card-host>
              </div>
            `)}
        </div>
      </section>
    `}_getHomeCustomCards(){const e=this.config?.home_custom_cards;return Array.isArray(e)?e.filter(e=>Boolean(e?.id)&&Boolean(e?.card)&&"object"==typeof e.card&&"string"==typeof e.card.type):[]}_renderHomeCustomCards(){const e=this._getHomeCustomCards();if(!e.length)return c;const t=this._t("home_section.custom_cards.label");return d`
      <section class="home-custom-cards-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:cards-outline"></ha-icon>
          <span>${t}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <span class="mobile-section-icon custom-cards"><ha-icon icon="mdi:cards-outline"></ha-icon></span>
            <span class="mobile-section-title-label">${t}</span>
          </div>
        </div>
        <div class="home-custom-cards-grid">
          ${b(e,e=>e.id,e=>d`
              <div class="home-custom-card ${this._customCardNeedsWideLayout(e.card)?"is-wide":""}">
                <dwains-dashboard-next-card-host
                  eager
                  .hass=${this.hass}
                  .config=${e.card}
                ></dwains-dashboard-next-card-host>
              </div>
            `)}
        </div>
      </section>
    `}_getHomeTodoEntities(){return Object.keys(this.hass?.states||{}).filter(e=>e.startsWith("todo.")).filter(e=>{const t=this.hass.states[e],a=this.hass.entities?.[e];return!!t&&(!["unavailable","unknown"].includes(String(t.state).toLowerCase())&&!a?.hidden_by&&!a?.disabled_by&&"diagnostic"!==a?.entity_category&&"config"!==a?.entity_category)}).sort((e,t)=>{const a=this.hass.states[e]?.attributes?.friendly_name||this.hass.entities?.[e]?.name||e,o=this.hass.states[t]?.attributes?.friendly_name||this.hass.entities?.[t]?.name||t;return String(a).localeCompare(String(o),this.hass.language)})}_getHomeSummaryCards(){const e=[],t=this._getUpdateEntityCount();return this._repairsIssueCount>0&&e.push({key:"repairs",label:this._t("home.repairs"),subtitle:this._tp("summary.issue",this._repairsIssueCount),icon:"mdi:wrench",color:"#f59e0b",count:this._repairsIssueCount,path:"/config/repairs"}),t>0&&e.push({key:"updates",label:this._t("home.updates"),subtitle:this._tp("summary.update_available",t),icon:"mdi:package-up",color:"#0ea5e9",count:t,path:"/config/updates"}),this._discoveredDeviceCount>0&&e.push({key:"discovered",label:this._t("home.devices_discovered"),subtitle:this._tp("summary.device_to_add",this._discoveredDeviceCount),icon:"mdi:devices",color:"#1494aa",count:this._discoveredDeviceCount,path:"/config/integrations"}),e}_openHomeAssistantPage(e){this._closeMobileNav(),P(e)}_renderHomeWelcome(){const e=this.hass?.user?.name||"User",t=this._getGreeting(),a=this._weatherDisplayEnabled()?this._getWeatherEntity():void 0,o=this._formatWeatherTemperature(a),r=this._getWelcomeUserPicture(e),i=this._renderHomeAlarm();return d`
      <div class="home-welcome">
        <div class="welcome-content">
          <div class="welcome-header">
            <div class="welcome-user">
              <button
                class="welcome-avatar"
                type="button"
                title=${this._t("navigation.profile_settings")}
                aria-label=${this._t("navigation.profile_settings")}
                @click=${this._openProfileSettings}
              >
                ${r?d`<img src=${r} alt=${e} />`:d`<ha-icon icon="mdi:account"></ha-icon>`}
              </button>
              <div class="welcome-copy">
                <div class="welcome-text">
                  <span class="welcome-greeting">${t},</span>
                  <span class="welcome-name">${e}</span>
                  <span class="welcome-title">${t}, ${e}</span>
                </div>
              </div>
            </div>
            <div class="welcome-header-meta">
              ${!this._isMobile&&a&&o?d`
                <div
                  class="welcome-weather"
                  title=${this._weatherTitle(a)}
                  aria-label=${this._weatherTitle(a)}
                  @click=${()=>this._showMoreInfo(a.entity_id)}
                >
                  <ha-icon icon=${a.attributes.icon||"mdi:weather-cloudy"}></ha-icon>
                  <span class="weather-temp">${o}</span>
                </div>
              `:c}
              <div class="welcome-time-section">
                <div class="welcome-time">${this._currentTime}</div>
                <div class="welcome-date">${this._currentDate}</div>
              </div>
              <div class="welcome-actions">
                ${this._showNotificationsUi()?d`
                  <button
                    class="welcome-action welcome-notification-action"
                    type="button"
                    title=${this._t("home.notifications")}
                    @click=${this._openNotifications}
                  >
                    <ha-icon icon="mdi:bell-outline"></ha-icon>
                    ${this._persistentNotifications.length?d`<span class="welcome-action-badge">${this._persistentNotifications.length}</span>`:c}
                  </button>
                `:c}
                ${this._canManageDashboard()?d`
                  <button
                    class="welcome-action welcome-settings-action"
                    type="button"
                    title=${this._t("sidebar.dashboard_settings")}
                    @click=${this._openDashboardSettings}
                  >
                    <ha-icon icon="mdi:pencil"></ha-icon>
                  </button>
                `:c}
              </div>
            </div>
          </div>
          ${i!==c||this._isMobile&&o?d`
            <div class="welcome-subheader">
              ${i}
              ${this._isMobile&&a&&o?d`
                <div
                  class="welcome-weather"
                  title=${this._weatherTitle(a)}
                  aria-label=${this._weatherTitle(a)}
                  @click=${()=>this._showMoreInfo(a.entity_id)}
                >
                  <ha-icon icon=${a.attributes.icon||"mdi:weather-cloudy"}></ha-icon>
                  <span class="weather-temp">${o}</span>
                </div>
              `:c}
            </div>
          `:c}
        </div>
      </div>
    `}_renderHomeStatusCards(){const e=this._getStatusDomains(),t=this._homeInformationCardVisible("device_groups")?e.filter(e=>"person"!==e.domain&&"wattage"!==e.domain&&"camera"!==e.domain):[],a="grid"===this._mobileHomeDevicesLayout,o=e=>d`
      <div
        class="home-status-card compact-status ${e.domain} ${e.value?"has-value":""}"
        style=${this._domainStatusStyle(e.domain,e.deviceClass)}
        @click=${()=>this._handleStatusCardClick(e)}
        data-domain=${e.domain}
        title=${this._statusCardTitle(e)}
        aria-label=${this._statusCardTitle(e)}
      >
        <div class="status-card-icon">
          <ha-icon icon=${e.icon}></ha-icon>
          ${e.count>0?d`
            <div class="status-card-badge">${e.count}</div>
          `:c}
        </div>
        ${e.value?d`<div class="status-card-value">${e.value}</div>`:c}
        <div class="status-card-title">${this._statusCardTitle(e)}</div>
      </div>
    `,r=[this._homeInformationCardVisible("people")?this._renderHousePersonsStatusCard():c,this._homeInformationCardVisible("climate")?this._renderHouseClimateStatusCard("indoor"):c,this._homeInformationCardVisible("outdoor_climate")?this._renderHouseClimateStatusCard("outdoor"):c,this._homeInformationCardVisible("power")?this._renderHousePowerStatusCard():c].filter(e=>e!==c);if(!r.length&&!t.length)return c;const i=d`
      <div class="home-status-heading">
        <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
        <span>${this._t("home.house_information")}</span>
      </div>
      <div class="mobile-section-heading">
        <div class="mobile-section-title">
          <button
            class="mobile-layout-toggle ${a?"active":""}"
            type="button"
            title=${a?this._t("home.swipe_house_information"):this._t("home.show_all_house_information")}
            aria-label=${a?this._t("home.switch_house_information_swipe"):this._t("home.show_all_house_information")}
            @click=${this._toggleMobileHomeDevicesLayout}
          >
            <ha-icon icon=${a?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
          </button>
          <span class="mobile-section-title-label">${this._t("home.house_information")}</span>
        </div>
      </div>
    `;return this._isMobile?d`
        <div class="home-status-section layout-${this._mobileHomeDevicesLayout}">
          ${i}
          <div class="home-status-grid">
            ${r}
            ${t.map(o)}
          </div>
        </div>
      `:d`
      <div class="home-status-section layout-${this._mobileHomeDevicesLayout}">
        ${i}

        <div class="home-status-primary-grid">
          ${r}
          ${t.map(o)}
        </div>
      </div>
    `}_renderHomeCameras(){const e=this._getHomeAreaCameras();if(!e.length)return c;const t="grid"===this._mobileHomeCamerasLayout;return d`
      <section class="home-camera-section layout-${this._mobileHomeCamerasLayout}">
        <div class="home-status-heading">
          <ha-icon icon="mdi:cctv"></ha-icon>
          <span>${this._t("home.cameras")}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle ${t?"active":""}"
              type="button"
              title=${t?this._t("home.swipe_cameras"):this._t("home.show_all_cameras")}
              aria-label=${t?this._t("home.switch_cameras_swipe"):this._t("home.show_all_cameras")}
              @click=${this._toggleMobileHomeCamerasLayout}
            >
              <ha-icon icon=${t?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
            </button>
            <span class="mobile-section-title-label">${this._t("home.cameras")}</span>
          </div>
        </div>
        <div class="home-camera-grid">
          ${b(e,e=>`${e.areaId}-${e.entityId}`,e=>this._renderHomeCameraCard(e))}
        </div>
      </section>
    `}_renderHomeCameraCard(e){return d`
      <button
        class="home-camera-card"
        type="button"
        title=${e.name}
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        ${e.imageUrl?d`<div class="home-camera-image" style=${`background-image: url('${e.imageUrl}');`}></div>`:d`
              <div class="home-camera-placeholder">
                <ha-icon icon="mdi:cctv"></ha-icon>
              </div>
            `}
        <div class="home-camera-content">
          <div class="home-camera-top">
            <div class="home-camera-area-icon">
              <ha-icon icon=${e.areaIcon}></ha-icon>
            </div>
          </div>
          <div class="home-camera-copy">
            <div class="home-camera-name">${e.name}</div>
            <div class="home-camera-meta">${e.areaName} · ${e.state}</div>
          </div>
        </div>
      </button>
    `}_getHomeAreaCameras(){const e=[],t=new Set(this.config?.settings?.home_cameras_hidden||[]),a=this.config?.settings?.home_camera_order||[],o=new Map(a.map((e,t)=>[e,t]));return this._getVisibleSortedAreas().forEach(a=>{this._getFilteredAreaEntities(a.area_id).filter(e=>e.entity_id.startsWith("camera.")).filter(e=>!t.has(e.entity_id)).filter(e=>{const t=this.hass?.states?.[e.entity_id]?.state;return Boolean(t&&"unavailable"!==t&&"unknown"!==t)}).forEach(t=>{const o=this.hass.states[t.entity_id],r=o?.attributes?.friendly_name||t.entity_id,i=o?this.hass.formatEntityState(o):this._t("common.unknown"),n=this._getCameraImageUrl(t.entity_id),s={areaId:a.area_id,areaName:a.name,areaIcon:h(a),entityId:t.entity_id,name:r,state:i};n&&(s.imageUrl=n),e.push(s)})}),e.sort((e,t)=>{const a=o.get(e.entityId),r=o.get(t.entityId);return void 0!==a||void 0!==r?(a??Number.MAX_SAFE_INTEGER)-(r??Number.MAX_SAFE_INTEGER):0})}_getCameraImageUrl(e){const t=this.hass?.states?.[e];if(!t)return;const a=t.attributes?.entity_picture,o=t.attributes?.access_token,r="string"==typeof a&&a?a:o?`/api/camera_proxy/${e}?token=${encodeURIComponent(o)}`:"";if(!r)return;const i=r.includes("?")?"&":"?";return`${r}${i}dd_cache=${encodeURIComponent(t.last_updated||t.last_changed||"")}`}_renderHousePowerStatusCard(){const e=this._getHousePowerUsage();if(!e.sensorCount)return c;const t=e.sensorCount?this._tp("devices.live_power_sensor",e.sensorCount):this._t("home.no_live_power_sensors");return d`
      <div
        class="home-status-card house-power-card wattage ${e.sensorCount?"has-power":"is-empty"}"
        style=${this._domainStatusStyle("wattage")}
        @click=${this._openHousePowerDialog}
        @keydown=${this._handleHousePowerKeydown}
        data-domain="wattage"
        role="button"
        tabindex="0"
        aria-label=${`${this._t("home.house_power_usage")}: ${e.formattedTotal}`}
      >
        <div class="house-power-head">
          <div class="status-card-icon house-power-icon">
            <ha-icon icon="mdi:flash"></ha-icon>
          </div>
          <div class="house-power-copy">
            <div class="house-power-title">${this._t("home.house_power_usage")}</div>
            <div class="house-power-subtitle">${t}</div>
          </div>
          <div class="house-power-total">${e.formattedTotal}</div>
        </div>
        ${e.rooms.length?d`
          <div class="house-power-list" aria-label=${this._t("home.house_power_usage")}>
            ${b(e.rooms,e=>e.areaId,e=>this._renderHousePowerRoom(e))}
          </div>
        `:d`
          <div class="house-power-empty">${this._t("home.no_room_power_usage")}</div>
        `}
      </div>
    `}_houseClimateTitle(e){return"outdoor"===e?this._t("home.outdoor_climate"):this._t("home.indoor_climate")}_renderHouseClimateStatusCard(e){const t=this._getHouseClimateSummary(e);if(!t.metrics.length)return c;const a=this._houseClimateTitle(e);return d`
      <div
        class="home-status-card house-climate-card sensor ${e} metrics-${Math.min(t.metrics.length,4)}"
        style=${this._domainStatusStyle("room_climate")}
        @click=${()=>this._showHouseClimateEntities(void 0,e)}
        @keydown=${t=>this._handleHouseClimateKeydown(t,e)}
        data-domain="sensor"
        role="button"
        tabindex="0"
        aria-label=${a}
      >
        <div class="house-climate-head">
          <div class="status-card-icon house-climate-icon">
            <ha-icon icon=${"outdoor"===e?"mdi:sun-thermometer-outline":"mdi:home-thermometer-outline"}></ha-icon>
          </div>
          <div class="house-climate-copy">
            <div class="house-climate-title">${a}</div>
            <div class="house-climate-subtitle">
              ${this._tp("common.sensor",t.sensorCount)}
            </div>
          </div>
        </div>
        <div class="house-climate-grid">
          ${t.metrics.map(t=>d`
            <button
              class="house-climate-metric ${t.kind}"
              style=${`--metric-color: ${t.color};`}
              type="button"
              @click=${a=>{a.stopPropagation(),this._showHouseClimateEntities(t.kind,e)}}
            >
              <span class="house-climate-metric-icon">
                <ha-icon icon=${t.icon}></ha-icon>
              </span>
              <span class="house-climate-metric-copy">
                <span class="house-climate-metric-value">${t.value}</span>
                <span class="house-climate-metric-label">${t.label}</span>
              </span>
            </button>
          `)}
        </div>
      </div>
    `}_renderHousePowerRoom(e){return d`
      <div class="house-power-room">
        <span class="house-power-room-icon">
          <ha-icon icon=${e.icon}></ha-icon>
        </span>
        <span class="house-power-room-name">${e.name}</span>
        <span class="house-power-room-value">${e.formatted}</span>
        <span
          class="house-power-bar"
          aria-hidden="true"
          style=${`--power-width: ${e.percentage}%`}
        >
          <span class="house-power-bar-fill"></span>
        </span>
      </div>
    `}_renderHousePowerDialog(){if(!this._housePowerDialogOpen)return c;const e=v(this.hass,this.config),t=e.areas[0],a=this._housePowerStatisticsEntities(e.areas.flatMap(e=>e.entities),8);return d`
      <dd-next-popup-shell
        open
        wide
        .titleText=${this._t("home.house_power_usage")}
        icon="mdi:flash"
        .accent=${m("wattage")}
        .closeLabel=${this._t("common.close")}
        @dd-close=${this._closeHousePowerDialog}
      >
        <button
          slot="header-extra"
          class="house-power-dialog-energy-link"
          type="button"
          @click=${this._openEnergyFromPowerDialog}
        >
          <span>${this._houseInfoEnergyViewLabel()}</span>
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>

        <div class="house-power-dialog-content">
          <div class="house-power-dialog-overview">
            <section class="house-power-dialog-overview-card">
              <div class="house-power-dialog-overview-head">
                <span class="house-power-dialog-overview-icon"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon></span>
                <div>
                  <strong>${this._t("devices.whole_house")}</strong>
                  <small>${this._tp("devices.live_power_sensor",e.sensorCount)}</small>
                </div>
                <b>${e.formattedTotal||"0 W"}</b>
              </div>
              ${this._renderHousePowerStatisticsGraph(a,this._t("devices.whole_house_history"))}
            </section>

            ${t?d`
              <section class="house-power-dialog-overview-card">
                <div class="house-power-dialog-overview-head">
                  <span class="house-power-dialog-overview-icon"><ha-icon icon=${t.icon}></ha-icon></span>
                  <div>
                    <strong>${this._t("devices.top_area")}</strong>
                    <small>${t.name}</small>
                  </div>
                  <b>${t.formattedTotal}</b>
                </div>
                <div class="house-power-dialog-top-entities">
                  ${t.entities.slice(0,3).map(e=>d`
                    <button type="button" @click=${()=>this._showMoreInfo(e.entityId)}>
                      <span>${e.name}</span>
                      <strong>${e.formatted}</strong>
                    </button>
                  `)}
                </div>
              </section>
            `:c}
          </div>

          ${e.areas.length?d`
            <div class="house-power-dialog-areas">
              ${e.areas.map(e=>d`
                <section class="house-power-dialog-area">
                  <div class="house-power-dialog-area-head">
                    <span class="house-power-dialog-area-icon"><ha-icon icon=${e.icon}></ha-icon></span>
                    <span class="house-power-dialog-area-name">${e.name}</span>
                    <strong>${e.formattedTotal}</strong>
                  </div>
                  ${this._renderHousePowerStatisticsGraph(this._housePowerStatisticsEntities(e.entities,6),`${e.name} power history`)}
                  <div class="house-power-dialog-entities">
                    ${e.entities.map(t=>{const a=e.totalWatts>0?Math.max(4,Math.min(100,Math.round(t.watts/e.totalWatts*100))):0;return d`
                        <button
                          class="house-power-dialog-entity detailed"
                          type="button"
                          style=${`--entity-power-width: ${a}%`}
                          @click=${()=>this._showMoreInfo(t.entityId)}
                        >
                          <span class="house-power-dialog-entity-icon"><ha-icon icon=${t.icon}></ha-icon></span>
                          <span class="house-power-dialog-entity-copy">
                            <strong>${t.name}</strong>
                            <small>${e.name}</small>
                            <span class="house-power-dialog-entity-bar"><span></span></span>
                          </span>
                          <b>${t.formatted}</b>
                        </button>
                      `})}
                  </div>
                </section>
              `)}
            </div>
          `:d`
            <div class="house-power-dialog-empty">${this._t("home.no_room_power_usage")}</div>
          `}
        </div>
      </dd-next-popup-shell>
    `}_handleHouseClimateKeydown(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._showHouseClimateEntities(void 0,t))}_showHouseClimateEntities(e,t="indoor"){const a=this._getHouseClimateSummary(t),o=(e?a.metrics.filter(t=>t.kind===e):a.metrics).flatMap(e=>e.entityIds);if(!o.length)return void this._openDeviceDomain("sensor");const r=e?"temperature"===e?this._t("home.temperature"):this._t("home.humidity"):this._houseClimateTitle(t);Xe(this,{domain:"sensor",config:this.config,entityIds:o,customTitle:r,homeInformation:!0,homeInformationPresentation:"devices",deviceClass:e,deviceViewKey:"sensor",viewAllLabel:this._houseInfoDeviceViewLabel(),onViewAll:()=>this._openDeviceDomain("sensor")})}_renderHousePersonsStatusCard(){const e=this._getVisiblePersonEntities(),t=e.length?this._t("person.home").replace(/^./,e=>e.toLocaleUpperCase(this.hass?.language||"de")):this._t("home.no_people");return d`
      <div
        class="home-status-card house-persons-card person persons-${Math.min(e.length,4)}"
        style=${this._domainStatusStyle("person")}
        @click=${()=>this._showPersonEntities()}
        data-domain="person"
      >
        <div class="house-persons-head">
          <div class="status-card-icon house-persons-icon">
            <ha-icon icon="mdi:account-group"></ha-icon>
          </div>
          <div class="house-persons-copy">
            <div class="house-persons-title">${this._t("home.people")}</div>
            <div class="house-persons-subtitle">${t}</div>
          </div>
        </div>
        ${e.length?d`
          <div class="house-persons-grid">
            ${b(e.slice(0,4),e=>e.entity_id,e=>this._renderHousePersonMini(e))}
          </div>
        `:d`
          <div class="house-persons-empty">${this._t("home.no_visible_people")}</div>
        `}
      </div>
    `}_renderHousePersonMini(e){const t=e.attributes?.friendly_name||e.entity_id.split(".")[1],a=e.attributes?.entity_picture,o=this._formatPersonState(e),r="home"===e.state?"is-home":"not_home"===e.state?"is-away":"is-zone";return d`
      <button
        class="house-person-mini ${r}"
        type="button"
        aria-label=${`${t}: ${o}`}
        @click=${t=>this._handleHousePersonClick(t,e.entity_id)}
      >
        <span class="house-person-avatar">
          ${a?d`
            <img src=${a} alt=${t}>
          `:d`
            <ha-icon icon="mdi:account"></ha-icon>
          `}
        </span>
        <span class="house-person-mini-copy">
          <span class="house-person-mini-name">${t}</span>
          <span class="house-person-mini-state">${o}</span>
        </span>
      </button>
    `}_handleHousePersonClick(e,t){e.stopPropagation(),this._showMoreInfo(t)}_getVisiblePersonEntities(){if(!this.hass||!this.config)return[];const e=new Set(this.config.settings?.hidden_persons||[]);return Object.values(this.hass.states).filter(t=>t.entity_id.startsWith("person.")&&!e.has(t.entity_id)&&!this.hass.entities?.[t.entity_id]?.hidden_by)}_formatPersonState(e){return"home"===e.state?this._t("person.home"):"not_home"===e.state?this._t("person.away"):e.state&&"unknown"!==e.state?"unavailable"===e.state?this._t("common.unavailable"):String(e.state).replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase()):this._t("common.unknown")}_weatherDisplayEnabled(){return!1!==this.config?.settings?.show_weather&&!1!==this.config?.global_options?.show_weather}_formatWeatherTemperature(e){if(!e)return"";const t=e.attributes||{},a=t.temperature??t.current_temperature??t.apparent_temperature??t.native_temperature;if(null==a||""===a)return"";const o=t.temperature_unit||t.native_temperature_unit||this.hass?.config?.unit_system?.temperature||"";return T(a,o)}_weatherTitle(e){const t=this._formatWeatherTemperature(e),a=this._formatWeatherCondition(e?.state),o=this._t("home.outside").toLocaleLowerCase(N(this.hass));return t&&a?`${t} ${o}, ${a}`:t?`${t} ${o}`:a||this._t("home.outside_weather")}_formatWeatherCondition(e){return e&&"unknown"!==e&&"unavailable"!==e?e.replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase()):""}_getHousePowerUsage(){const e=v(this.hass,this.config),t=e.areas.slice(0,4).map(e=>({areaId:e.areaId,name:e.name,icon:e.icon,watts:e.totalWatts,formatted:e.formattedTotal,percentage:e.percentage}));return{totalWatts:e.totalWatts,formattedTotal:e.formattedTotal,sensorCount:e.sensorCount,rooms:t}}_getHouseClimateSummary(e="indoor"){const t={temperature:[],humidity:[]},a=new Set(this.config?.settings?.home_climate_excluded_areas||[]),o=new Set(this.config?.settings?.home_outdoor_climate_areas||[]);("outdoor"===e?(this.config?.areas||[]).filter(e=>o.has(e.area_id)):this._getVisibleSortedAreas().filter(e=>!a.has(e.area_id)&&!o.has(e.area_id))).forEach(e=>{const a=this.hass?.areas?.[e.area_id];["temperature","humidity"].forEach(e=>{const o="temperature"===e?a?.temperature_entity_id:a?.humidity_entity_id;if(!o)return;const r=this.hass?.states?.[o];if(!r||"unavailable"===r.state||"unknown"===r.state)return;const i=Number.parseFloat(r.state);Number.isFinite(i)&&t[e].push({value:i,unit:String(r.attributes?.unit_of_measurement||("temperature"===e?this.hass?.config?.unit_system?.temperature||"°C":"%")),entityIds:[o]})})});const r=[],i=this._houseClimateMetric("temperature",t.temperature,e),n=this._houseClimateMetric("humidity",t.humidity,e);return i&&r.push(i),n&&r.push(n),{sensorCount:t.temperature.length+t.humidity.length,metrics:r}}_houseClimateMetric(e,t,a="indoor"){if(!t.length)return;const o=t.reduce((e,t)=>e+t.value,0)/t.length,r=t[0]?.unit||("temperature"===e?"°C":"%"),i=T("temperature"===e?o.toFixed(1):Math.round(o),r),n="indoor"===a||t.length>1;return{kind:e,label:"temperature"===e?this._t(n?"home.average_temperature":"home.temperature"):this._t(n?"home.average_humidity":"home.humidity"),value:i,count:t.length,icon:x("sensor","temperature"===e?"temperature":"humidity"),color:m("sensor",e),entityIds:[...new Set(t.flatMap(e=>e.entityIds))]}}_renderMobileHomeAreas(){const e=this._getVisibleSortedAreas();if(!e.length)return c;const t=this._isDesktopAreaSidebarCollapsed(),a=t?"grid":this._mobileHomeAreasLayout,o="grid"===a,r=this._isMobile&&!this._renderAllMobileHomeAreas&&e.length>12?e.slice(0,12):e;return d`
      <section class="mobile-home-section mobile-home-areas layout-${a}">
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            ${t?d`
              <span class="mobile-section-icon" aria-hidden="true">
                <ha-icon icon="mdi:view-grid-outline"></ha-icon>
              </span>
            `:d`
              <button
                class="mobile-layout-toggle ${o?"active":""}"
                type="button"
                title=${o?this._t("home.swipe_areas"):this._t("home.show_all_areas")}
                aria-label=${o?this._t("home.switch_areas_swipe"):this._t("home.show_all_areas")}
                @click=${this._toggleMobileHomeAreasLayout}
              >
                <ha-icon icon=${o?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
              </button>
            `}
            <span class="mobile-section-title-label">${this._t("home.areas")}</span>
          </div>
        </div>
        <div class="mobile-area-rail">
          ${b(r,e=>e.area_id,e=>this._renderMobileHomeAreaCard(e,o))}
        </div>
      </section>
    `}_renderMobileHomeAreaCard(e,t=!0){const a=this._getFilteredAreaEntities(e.area_id),o=this._getCachedAreaData(e),r=this._getAreaDeviceCount(e.area_id,a),i=Boolean(e.picture),n=[o.temperature,o.humidity,o.wattage].filter(Boolean).join(" • ")||(1===r?"1 device":`${r} devices`),s=this._getAreaStatusBadges(o),l=this._isMobile&&!t,p=i?this._getPictureContrastClass(e.picture):"";return d`
      <button
        class="mobile-area-card ${i?"has-picture":""} ${p}"
        type="button"
        @click=${()=>this._selectArea(e.area_id)}
      >
        ${i?d`
          <div class="mobile-area-picture" style=${`background-image: url('${e.picture}');`}></div>
        `:c}
        <div class="mobile-area-top" style=${`--mobile-area-icon-size: ${l?"100%":"56px"}; --mobile-area-icon-height: ${l?"auto":"56px"}; --mobile-area-icon-glyph-size: ${l?"24px":"30px"}; --mobile-area-top-display: ${l?"grid":"flex"}; --mobile-area-top-justify: ${l?"flex-start":"space-between"}; --mobile-area-top-gap: ${l?"4px":"8px"}; --mobile-area-badge-width: ${l?"36px":"max-content"}; --mobile-area-badge-padding: ${l?"0 4px":"0 6px"};`}>
          <div class="mobile-area-icon">
            <ha-icon icon=${h(e)}></ha-icon>
          </div>
          <div class="mobile-area-badges">
            ${s.slice(0,4).map(e=>d`
              <span
                class="mobile-area-badge ${e.className}"
                style=${`--area-badge-color: ${e.color};`}
              >
                <ha-icon icon=${e.icon}></ha-icon>
                <span>${e.count}</span>
              </span>
            `)}
          </div>
        </div>
        <div class="mobile-area-copy">
          <div class="mobile-area-name">${e.name}</div>
          <div class="mobile-area-meta">${n}</div>
        </div>
      </button>
    `}_getGreeting(){const e=(new Date).getHours();return e<12?this._t("home.good_morning"):e<18?this._t("home.good_afternoon"):this._t("home.good_evening")}_renderHomeAlarm(){const e=this._getAlarmEntity();if(!e)return c;const t=e?.state||"",a=["armed_away","armed_home","armed_night","armed_vacation"].includes(t),o="disarmed"===t,r="triggered"===t;return d`
      <div class="welcome-alarm ${r?"alarm-triggered":a?"alarm-armed":o?"alarm-disarmed":"alarm-unknown"}" @click=${()=>this._showMoreInfo(e?.entity_id||"")}>
        <ha-icon icon=${r?"mdi:shield-alert":a?"mdi:shield-check":o?"mdi:shield-off":"mdi:shield-alert"}></ha-icon>
        <span class="alarm-text">${(()=>r?this._t("domain.alarm_control_panel"):a?this._t("home.alarm_armed"):o?this._t("home.alarm_disarmed"):this._t("domain.alarm_control_panel"))()}</span>
          </div>
    `}_renderFavorites(){const e=this._getEffectiveFavoriteEntities();if(0===e.length)return c;const t="grid"===this._mobileHomeFavoritesLayout;return d`
      <div class="favorites-section home-favorites-section layout-${this._mobileHomeFavoritesLayout}">
        <div class="favorites-header">
          <ha-icon icon="mdi:star"></ha-icon>
          <span>${this._t("favorites.title")}</span>
        </div>
        <div class="mobile-section-heading">
          <div class="mobile-section-title">
            <button
              class="mobile-layout-toggle ${t?"active":""}"
              type="button"
              title=${t?this._t("favorites.swipe"):this._t("favorites.show_all")}
              aria-label=${t?this._t("favorites.switch_swipe"):this._t("favorites.show_all")}
              @click=${this._toggleMobileHomeFavoritesLayout}
            >
              <ha-icon icon=${t?"mdi:view-agenda-outline":"mdi:view-grid-outline"}></ha-icon>
            </button>
            <span class="mobile-section-title-label">${this._t("favorites.title")}</span>
          </div>
        </div>
        <div class="favorites-grid">
          ${b(e,e=>e,e=>this._renderFavoriteCard(e))}
        </div>
      </div>
    `}_renderFavoriteCard(e){const t=this.hass.states[e],a=this.hass.entities?.[e];if(!t||a?.hidden_by)return c;const o=this._getEffectiveEntityState(t),r=e.split(".")[0]||"unknown",i=o.attributes?.device_class,n=o.attributes?.friendly_name||a?.name||e,s=this._favoriteDisplayState(o,r),l=this._entityAreaName(e),p=!0===this.config?.settings?.hide_area_name_in_entity_names&&l?w(n,l):n,h=a?.icon||o.attributes?.icon||x(r,i)||f(r),g=this._favoriteActiveState(o,r),b=this._favoriteSupportsQuickToggle(r),u="cover"===r?"opening":"sensor"!==r||"temperature"!==i&&"humidity"!==i?"sensor"===r&&"power"===i?"wattage":r:i,v="opening"===u?m("binary_sensor","opening"):m(u,i),y=["favorite-card-wrapper",`favorite-${r}`,i?`favorite-${i}`:"",g,b?"can-toggle":"info-only"].filter(Boolean).join(" ");return d`
      <article
        class=${y}
        style=${`--favorite-color: ${v};`}
        data-entity=${e}
        role="button"
        tabindex="0"
        @click=${()=>this._showMoreInfo(e)}
        @keydown=${t=>this._handleFavoriteKeydown(t,e)}
      >
        <div class="favorite-icon">
          <ha-icon icon=${h}></ha-icon>
        </div>
        <div class="favorite-body">
          <div
            class="favorite-name"
            title=${p}
          >${p}</div>
          <div class="favorite-meta">
            ${l?d`<span class="favorite-area">${l}</span>`:c}
          </div>
        </div>
        <div class="favorite-end">
          ${"cover"===r?this._renderFavoriteCoverActions(o):b?d`
              <button
                class="favorite-quick-action"
                type="button"
                title=${this._favoriteQuickTitle(o,r)}
                @click=${e=>this._handleFavoriteQuickAction(e,o,r)}
              >
                <ha-icon icon=${this._favoriteQuickIcon(o,r)}></ha-icon>
              </button>
            `:s?d`
              <div class="favorite-status-pill" title=${s}>${s}</div>
            `:c}
        </div>
      </article>
    `}_favoriteDisplayState(e,t){return"light"===t&&"on"===String(e?.state||"").toLowerCase()&&"number"==typeof e?.attributes?.brightness?`${Math.round(Number(e.attributes.brightness)/255*100)} %`:"cover"===t&&"number"==typeof e?.attributes?.current_position?`${Math.round(Number(e.attributes.current_position))} %`:this._formatFavoriteState(e)}_renderFavoriteCoverActions(e){const t=String(e?.state||"").toLowerCase(),a=["unavailable","unknown"].includes(t),o=this._coverSupportsFeature(e,1),r=this._coverSupportsFeature(e,2);return d`
      <div class="favorite-cover-actions" @click=${e=>e.stopPropagation()}>
        ${o?d`
          <button
            class="favorite-cover-action ${"opening"===t?"active":""}"
            type="button"
            title=${this._t("action.open")}
            aria-label=${this._t("action.open")}
            ?disabled=${a}
            @click=${t=>this._handleMobileCoverAction(t,e,"open")}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
        `:c}
        ${r?d`
          <button
            class="favorite-cover-action ${"closing"===t?"active":""}"
            type="button"
            title=${this._t("action.close")}
            aria-label=${this._t("action.close")}
            ?disabled=${a}
            @click=${t=>this._handleMobileCoverAction(t,e,"close")}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
        `:c}
      </div>
    `}_handleFavoriteKeydown(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._showMoreInfo(t))}_formatFavoriteState(e){const t=this._getEffectiveEntityState(e);return j(this.hass,t)}_getEffectiveEntityState(e){const t=e?.entity_id;if(!t)return e;const a=this._optimisticEntityStates[t];if(!a||a.expiresAt<=Date.now())return e;return String(e?.state||"").toLowerCase()===a.state.toLowerCase()?e:{...e,state:a.state}}_setOptimisticEntityState(e,t){this._setOptimisticEntityStates([e],t)}_setOptimisticEntityStates(e,t){const a=[...new Set(e.filter(Boolean))];if(!a.length)return;const o=Date.now()+5e3,r={...this._optimisticEntityStates};a.forEach(e=>{r[e]={state:t,expiresAt:o}}),this._optimisticEntityStates=r,this._scheduleOptimisticCleanup()}_clearOptimisticEntityStates(e){const t=[...new Set(e.filter(Boolean))];if(!t.length)return;const a={...this._optimisticEntityStates};let o=!1;t.forEach(e=>{a[e]&&(delete a[e],o=!0)}),o&&(this._optimisticEntityStates=a)}_reconcileOptimisticEntityStates(){const e=Object.entries(this._optimisticEntityStates);if(!e.length)return;const t=Date.now(),a={...this._optimisticEntityStates};let o=!1;e.forEach(([e,r])=>{const i=this.hass?.states?.[e]?.state;(!i||r.expiresAt<=t||String(i).toLowerCase()===r.state.toLowerCase())&&(delete a[e],o=!0)}),o&&(this._optimisticEntityStates=a)}_scheduleOptimisticCleanup(){if(void 0!==this._optimisticCleanupTimer)return;const e=Object.values(this._optimisticEntityStates).map(e=>e.expiresAt);if(!e.length)return;const t=Math.min(...e);if(!Number.isFinite(t))return;const a=Math.max(80,t-Date.now()+50);this._optimisticCleanupTimer=window.setTimeout(()=>{this._optimisticCleanupTimer=void 0,this._reconcileOptimisticEntityStates(),Object.keys(this._optimisticEntityStates).length&&this._scheduleOptimisticCleanup()},a)}_favoriteActiveState(e,t){const a=String(e?.state||"").toLowerCase();if(["unavailable","unknown"].includes(a))return"is-idle";if("cover"===t)return["open","opening"].includes(a)?"is-active":"is-off";if("lock"===t)return"unlocked"===a?"is-active":"is-off";if("climate"===t){const t=e?.attributes?.hvac_action;return t&&"idle"!==t&&"off"!==t?"is-active":"is-idle"}return["off","closed","locked","not_home","idle"].includes(a)?"is-off":"is-active"}_favoriteSupportsQuickToggle(e){return["light","switch","fan","input_boolean","cover","lock"].includes(e)}_favoriteQuickIcon(e,t){const a=String(e?.state||"").toLowerCase();return"cover"===t?["open","opening"].includes(a)?"mdi:arrow-down":"mdi:arrow-up":"lock"===t?"unlocked"===a?"mdi:lock-open-variant-outline":"mdi:lock-outline":["light","switch","fan","input_boolean"].includes(t)?"mdi:power":"mdi:chevron-right"}_favoriteQuickTitle(e,t){const a=String(e?.state||"").toLowerCase();return"cover"===t?this._t(["open","opening"].includes(a)?"action.close":"action.open"):"lock"===t?this._t("unlocked"===a?"action.lock":"action.unlock"):["light","switch","fan","input_boolean"].includes(t)?this._t("off"===a?"action.turn_on":"action.turn_off"):this._t("action.more_info")}async _handleFavoriteQuickAction(e,t,a){e.stopPropagation();const o=t?.entity_id;if(!o)return;const r=[o];try{if(["light","switch","fan","input_boolean"].includes(a)){const e=!this._isEntityActiveForUi(t,a);return this._setOptimisticEntityState(o,e?"on":"off"),void await this.hass.callService(a,e?"turn_on":"turn_off",{entity_id:o})}if("cover"===a){const e=["open","opening"].includes(String(t.state).toLowerCase());return this._setOptimisticEntityState(o,e?"closed":"open"),void await this.hass.callService("cover",e?"close_cover":"open_cover",{entity_id:o})}if("lock"===a){const e="unlocked"===String(t.state).toLowerCase();return this._setOptimisticEntityState(o,e?"locked":"unlocked"),void await this.hass.callService("lock",e?"lock":"unlock",{entity_id:o})}}catch(e){return this._clearOptimisticEntityStates(r),console.warn(`Failed to run favorite quick action for ${o}:`,e),void this._showToast(this._t("entity.update_failed"))}this._showMoreInfo(o)}_areaTileState(e,t,a){return"open"===a?1===t?this._t(e?"common.open":"common.closed"):e?this._t("area_header.open_count",{active:e,total:t}):this._t("common.closed"):1===t?this._t(e?"common.on":"common.off"):e?this._t("area_header.on_count",{active:e,total:t}):this._t("common.off")}_areaQuickControlCount(e,t){let a=0;e.some(e=>e.entity_id.startsWith("light."))&&a++,e.some(e=>e.entity_id.startsWith("switch."))&&a++;return a+=new Set(e.filter(e=>e.entity_id.startsWith("cover.")).map(e=>y(e.entity_id,this.hass)).filter(e=>"cover_shading"===e||"cover_openings"===e||"cover_gates"===e)).size,e.some(e=>e.entity_id.startsWith("fan."))&&a++,e.some(e=>e.entity_id.startsWith("climate."))&&a++,t&&a++,a}_scrollAreaQuickToPage(e){const t=this.renderRoot.querySelector(".room-header .dd-page-header-strip");if(!t)return;const a=Number(t.dataset.pageCount||1),o=Math.max(0,Math.min(a-1,e)),r=Math.max(0,t.scrollWidth-t.clientWidth),i=a<=1?0:r*o/(a-1);t.scrollTo({left:i,behavior:"smooth"})}_renderAreaQuickTiles(e,t){const a=t.filter(e=>e.entity_id.startsWith("light.")),o=t.filter(e=>e.entity_id.startsWith("switch.")),r=t.filter(e=>e.entity_id.startsWith("cover.")),i={cover_shading:r.filter(e=>"cover_shading"===y(e.entity_id,this.hass)),cover_openings:r.filter(e=>"cover_openings"===y(e.entity_id,this.hass)),cover_gates:r.filter(e=>"cover_gates"===y(e.entity_id,this.hass))},n=t.filter(e=>e.entity_id.startsWith("fan.")),s=t.filter(e=>e.entity_id.startsWith("climate."));if(!(a.length||o.length||r.length||n.length||s.length))return c;const l=(e,t,a,o,r,i)=>{const n=a>0,s=this._t(`domain.${e}`),c=this._areaTileState(a,t,"on"),l=this._areaTileState(t,t,"on"),p=this._areaTileState(0,t,"on"),m=this._t(n?r[1]:r[0],{active:a,total:t});return d`
        <button
          class="dd-room-tile ${e} ${n?"is-on":""}"
          type="button"
          aria-pressed=${n?"true":"false"}
          title=${m}
          aria-label=${`${s}: ${c}. ${m}`}
          @click=${i}
        >
          <span class="dd-room-tile-icon">
            <ha-icon icon=${n?o[1]:o[0]}></ha-icon>
          </span>
          <span class="dd-room-tile-copy">
            <span class="dd-room-tile-label">${s}</span>
            <span class="dd-room-tile-state-slot">
            <span class="dd-room-tile-state">${c}</span>
            <span class="dd-room-tile-state dd-room-tile-state-reserve" aria-hidden="true">${l}</span>
            <span class="dd-room-tile-state dd-room-tile-state-reserve" aria-hidden="true">${p}</span>
          </span>
          </span>
          <span class="dd-room-tile-switch" aria-hidden="true"></span>
        </button>
      `},p=(t,a)=>{if(!a.length)return c;const o=this._countActiveEntities(a,"cover"),r=this._mobileGroupName(t),i="cover_shading"===t?0===o:o>0,n="cover_shading"===t&&0===o?"mdi:blinds-horizontal-closed":this._mobileGroupIcon(t);return d`
        <div class="dd-room-tile cover has-actions ${i?"is-on":""}">
          <span class="dd-room-tile-icon">
            <ha-icon icon=${n}></ha-icon>
          </span>
          <span class="dd-room-tile-copy">
            <span class="dd-room-tile-label">${r}</span>
            <span class="dd-room-tile-state-slot">
              <span class="dd-room-tile-state">${this._areaTileState(o,a.length,"open")}</span>
              <span class="dd-room-tile-state dd-room-tile-state-reserve" aria-hidden="true">${this._areaTileState(a.length,a.length,"open")}</span>
              <span class="dd-room-tile-state dd-room-tile-state-reserve" aria-hidden="true">${this._areaTileState(0,a.length,"open")}</span>
            </span>
          </span>
          <span class="dd-room-tile-actions">
            <button
              class="dd-room-tile-action"
              type="button"
              title=${this._t("action.open_all")}
              aria-label=${`${r}: ${this._t("action.open_all")}`}
              @click=${()=>{this._setAreaCoverState(e,!0,t)}}
            >
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </button>
            <button
              class="dd-room-tile-action"
              type="button"
              title=${this._t("action.close_all")}
              aria-label=${`${r}: ${this._t("action.close_all")}`}
              @click=${()=>{this._setAreaCoverState(e,!1,t)}}
            >
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </button>
          </span>
        </div>
      `},m=this._countActiveEntities(s,"climate"),h=1===s.length?this.hass.states[s[0].entity_id]:void 0,g=h?.attributes?.current_temperature,b=this.hass.config?.unit_system?.temperature||"°",x=null!=g?T(g,b):this._tp("common.entity",s.length);return d`
      <div class="dd-room-tiles">
        ${a.length?l("light",a.length,this._countActiveEntities(a,"light"),["mdi:lightbulb-outline","mdi:lightbulb"],["action.lights_on_summary","action.lights_off_summary"],()=>this._toggleAreaLights(e)):c}
        ${o.length?l("switch",o.length,this._countActiveEntities(o,"switch"),["mdi:power-plug-off-outline","mdi:power-plug"],["action.switches_on_summary","action.switches_off_summary"],()=>this._toggleAreaSwitches(e)):c}
        ${p("cover_shading",i.cover_shading)}
        ${p("cover_openings",i.cover_openings)}
        ${p("cover_gates",i.cover_gates)}
        ${n.length?l("fan",n.length,this._countActiveEntities(n,"fan"),["mdi:fan-off","mdi:fan"],["action.fans_on_summary","action.fans_off_summary"],()=>this._toggleAreaFans(e)):c}
        ${s.length?d`
          <button
            class="dd-room-tile climate ${m>0?"is-on":""}"
            type="button"
            title=${this._t("action.open_climate_controls")}
            aria-label=${`${this._t("domain.climate")}: ${x}. ${this._t("action.open_climate_controls")}`}
            @click=${()=>this._openAreaClimateControls(e,s)}
          >
            <span class="dd-room-tile-icon">
              <ha-icon icon=${f("climate")}></ha-icon>
            </span>
            <span class="dd-room-tile-copy">
              <span class="dd-room-tile-label">${this._t("domain.climate")}</span>
              <span class="dd-room-tile-state">${x}</span>
            </span>
            <ha-icon class="dd-room-tile-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
          </button>
        `:c}
      </div>
    `}_renderAreaCompactBar(e,t,a,o,r,i){const n=this._areaHeaderStuck,s=[t.temperature,t.humidity].filter(Boolean).join(" · ");return d`
      <div class="dd-room-compact ${n?"is-visible":""}" ?inert=${!n} aria-hidden=${n?"false":"true"}>
        <div class="dd-room-compact-panel">
          <div class="dd-room-compact-bar">
            ${o}
            <div class="dd-room-compact-title">
              <strong>${e.name}</strong>
              <span>${s||a}</span>
            </div>
            <div class="dd-page-header-actions">${r}</div>
          </div>
          ${n&&this._areaHeaderRevealed?i:c}
        </div>
      </div>
    `}_renderAreaHeaderReadings(e){return[e.temperature?d`
        <span class="dd-page-header-reading temperature" title=${this._t("home.temperature")}>
          <ha-icon icon="mdi:thermometer" aria-hidden="true"></ha-icon>
          <span class="dd-visually-hidden">${this._t("home.temperature")}</span>
          ${e.temperature}
        </span>
      `:c,e.humidity?d`
        <span class="dd-page-header-reading humidity" title=${this._t("home.humidity")}>
          <ha-icon icon="mdi:water-percent" aria-hidden="true"></ha-icon>
          <span class="dd-visually-hidden">${this._t("home.humidity")}</span>
          ${e.humidity}
        </span>
      `:c,e.wattage?d`
        <span class="dd-page-header-reading wattage" title=${this._t("entity.power_usage")}>
          <ha-icon icon="mdi:flash" aria-hidden="true"></ha-icon>
          <span class="dd-visually-hidden">${this._t("entity.power_usage")}</span>
          ${e.wattage}
        </span>
      `:c]}_renderAreaMobileCameraAction(e){const t=e.find(e=>{if(!e.entity_id.startsWith("camera."))return!1;const t=this.hass?.states?.[e.entity_id]?.state;return Boolean(t&&"unavailable"!==t&&"unknown"!==t)});return t?d`
      <button
        class="dd-page-header-button"
        type="button"
        title=${this._t("action.open_camera")}
        aria-label=${this._t("action.open_camera")}
        @click=${()=>this._showMoreInfo(t.entity_id)}
      >
        <ha-icon icon="mdi:video-outline"></ha-icon>
      </button>
    `:c}_openAreaClimateControls(e,t){0!==t.length&&(1!==t.length?Xe(this,{domain:"climate",areaId:e,config:this.config,customTitle:_(this.hass,"climate"),customEntities:t.map(e=>e.entity_id)}):this._showMoreInfo(t[0].entity_id))}async _toggleAreaSwitches(e){const t=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("switch."));if(0===t.length)return;const a=this._areAllEntitiesOff(t,"switch");if(!await this._confirmMasterActionIfNeeded("switch",a,t.length,e))return;const o=a?"turn_on":"turn_off",r=t.map(e=>e.entity_id);this._setOptimisticEntityStates(r,a?"on":"off");try{await this.hass.callService("switch",o,{entity_id:r}),this._showToast(this._t(a?"action.all_switches_on":"action.all_switches_off"))}catch(t){this._clearOptimisticEntityStates(r),console.warn(`Failed to toggle switches in area ${e}:`,t),this._showToast(this._t("entity.switches_failed"))}}async _toggleAreaFans(e){const t=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("fan."));if(0===t.length)return;const a=this._areAllEntitiesOff(t,"fan");if(!await this._confirmMasterActionIfNeeded("fan",a,t.length,e))return;const o=a?"turn_on":"turn_off",r=t.map(e=>e.entity_id);this._setOptimisticEntityStates(r,a?"on":"off");try{await this.hass.callService("fan",o,{entity_id:r}),this._showToast(this._t(a?"action.all_fans_on":"action.all_fans_off"))}catch(t){this._clearOptimisticEntityStates(r),console.warn(`Failed to toggle fans in area ${e}:`,t),this._showToast(this._t("entity.fans_failed"))}}async _setAreaCoverState(e,t,a){const o=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("cover.")&&(!a||y(e.entity_id,this.hass)===a));if(0===o.length)return;if(!await this._confirmMasterActionIfNeeded("cover",t,o.length,e))return;const r=t?"open_cover":"close_cover",i=o.map(e=>e.entity_id);this._setOptimisticEntityStates(i,t?"open":"closed");try{await this.hass.callService("cover",r,{entity_id:i}),this._showToast(this._t(t?"action.open_all":"action.close_all"))}catch(a){this._clearOptimisticEntityStates(i),console.warn(`Failed to ${t?"open":"close"} covers in area ${e}:`,a),this._showToast(this._t("entity.covers_failed"))}}_renderAreaView(){if(!this._selectedArea)return c;const e=this.config?.areas?.find(e=>e.area_id===this._selectedArea);if(!e)return c;const t=this._getFilteredAreaEntities(this._selectedArea),a=this._editMode?this._getEditableAreaEntities(this._selectedArea):t,o=this._getCachedAreaData(e),r=Boolean(e.picture),i=this._getAreaDeviceCount(e.area_id,t),n=this._areaThermostatEntityId(t),s=n?t.filter(e=>e.entity_id!==n):t,l=this._tp("common.device",i),p=this._renderAreaQuickTiles(e.area_id,s),m=p!==c||Boolean(n),g=this._areaQuickControlCount(s,n),b=Math.max(1,Math.ceil(g/3)),x=Math.min(this._areaQuickPage,b-1),u=d`
      <button
        class="dd-page-header-button dd-page-header-home"
        type="button"
        title=${this._t("sidebar.home")}
        aria-label=${this._t("navigation.back_home")}
        @click=${()=>this._selectView("home")}
      >
        <ha-icon icon="mdi:home"></ha-icon>
      </button>
    `,f=this._getEditableAreaEntities(e.area_id),v=d`
      ${this._renderAreaMobileCameraAction(f)}
      ${this._renderUnavailableEntitiesIcon(e.area_id)}
      ${this._canManageDashboard()?d`
        <button
          class="dd-page-header-button ${this._editMode?"is-active":""}"
          type="button"
          aria-pressed=${this._editMode?"true":"false"}
          title=${this._editMode?this._t("layout.done_editing"):this._t("layout.edit_custom_cards")}
          aria-label=${this._editMode?this._t("layout.done_editing"):this._t("layout.edit_custom_cards")}
          @click=${this._toggleEditMode}
        >
          <ha-icon icon=${this._editMode?"mdi:check":"mdi:view-dashboard-edit-outline"}></ha-icon>
        </button>
      `:c}
    `;return d`
      <div class="area-view">
        ${this._isMobile?this._renderAreaCompactBar(e,o,l,u,v,p):c}

        <header class="dd-page-header room-header ${r?"has-room-background":""}">
          ${r&&!this._isMobile?d`
            <div
              class="dd-page-header-room-background"
              aria-hidden="true"
              style=${`background-image: url('${e.picture}');`}
            ></div>
          `:c}
          <div class="dd-page-header-with-media">
            <div class="dd-page-header-media-tile" aria-hidden="true">
              ${r?d`<div class="dd-page-header-room-picture" style=${`background-image: url('${e.picture}');`}></div>`:d`
                    <div class="dd-page-header-room-icon">
                      <ha-icon icon=${h(e)}></ha-icon>
                    </div>
                  `}
            </div>

            <div class="dd-page-header-main">
              <div class="dd-page-header-top">
                <div class="dd-page-header-identity">
                  <div class="dd-page-header-copy">
                    <div class="dd-page-header-title-row">
                      ${u}
                      <ha-icon class="dd-page-header-title-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
                      <h1 class="dd-page-header-title">${e.name}</h1>
                    </div>
                    <div class="dd-page-header-subtitle">
                      <span class="dd-page-header-device-label">${l}</span>
                      ${this._renderAreaHeaderReadings(o)}
                    </div>
                  </div>
                </div>
                <div class="dd-page-header-actions">${v}</div>
              </div>

              <div class="dd-room-quick-wrap">
                <div
                  class="dd-page-header-strip ${m?"":"is-placeholder"}"
                  aria-hidden=${m?"false":"true"}
                  data-page-count=${b}
                  data-control-count=${g}
                  style=${!this._isMobile&&g>3?`--dd-room-quick-columns: ${Math.ceil(g/2)};`:""}
                  @scroll=${this._handleAreaQuickScroll}
                >
                  ${m?d`
                    ${p}
                    ${n?d`
                      <dwains-dashboard-next-area-thermostat
                        .hass=${this.hass}
                        .entityId=${n}
                        .roomName=${e.name}
                        .compactVertical=${this._isMobile}
                      ></dwains-dashboard-next-area-thermostat>
                    `:c}
                  `:c}
                </div>
                ${this._isMobile&&m&&b>1?d`
                  <div class="dd-room-quick-dots" aria-label="Schnellsteuerung Seiten">
                    ${Array.from({length:b},(e,t)=>d`
                      <button
                        class="dd-room-quick-dot ${t===x?"active":""}"
                        type="button"
                        aria-label=${`Seite ${t+1} von ${b}`}
                        aria-current=${t===x?"true":"false"}
                        @click=${()=>this._scrollAreaQuickToPage(t)}
                      ></button>
                    `)}
                  </div>
                `:c}
              </div>
            </div>
          </div>
        </header>

        ${this._renderCustomCardSlot(e.area_id,"top",this._t("layout.custom_cards_top"))}
        ${this._renderMobileEntitiesSection(e,a)}
        ${this._renderCustomCardSlot(e.area_id,"bottom",this._t("layout.custom_cards_bottom"))}
      </div>
    `}_renderRoomFavoritesBlock(){const e=this._getEffectiveFavoriteEntities().length;if(!e)return c;const t=()=>this._toggleHeader();return d`
      <section class="room-favorites-block ${this._headerExpanded?"":"is-collapsed"}">
        <div
          class="mobile-domain-header room-favorites-header expandable-header"
          role="button"
          tabindex="0"
          aria-expanded=${this._headerExpanded?"true":"false"}
          @click=${t}
          @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),t())}}
        >
          <div class="mobile-domain-title room-favorites-title">
            <ha-icon
              class="mobile-domain-leading-chevron"
              icon=${this._headerExpanded?"mdi:chevron-up":"mdi:chevron-down"}
              aria-hidden="true"
            ></ha-icon>
            <span class="room-domain-icon room-favorites-icon" aria-hidden="true">
              <ha-icon icon="mdi:star"></ha-icon>
            </span>
            <span class="mobile-domain-title-copy">
              <span class="mobile-domain-title-label">${this._t("favorites.title")}</span>
              <span class="mobile-domain-count">(${e})</span>
            </span>
          </div>

        </div>

        <div class="room-favorites-content" style=${this._headerExpanded?"":"display:none"}>
          ${this._renderFavoritesSection()}
        </div>
      </section>
    `}_renderCustomCardSlot(e,t,a,o=!1){const r=this._canManageDashboard();!r&&this._editMode&&(this._editMode=!1);const i=this._getAreaCustomCards(e).filter(e=>e.placement===t);if(0===i.length&&!this._editMode)return c;const n=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===t&&this._customCardDragOver.index===i.length,s={"dd-custom-section":!0,"after-domain":o,editing:this._editMode&&r,"drag-over":Boolean(n)};return d`
      <div
        class=${p(s)}
        @dragover=${a=>this._handleCustomSlotDragOver(a,e,t,i.length)}
        @drop=${a=>this._handleCustomCardDrop(a,e,t,i.length)}
      >
        ${this._editMode&&r||i.length?d`
              <div class="dd-custom-slot-head">
                <div class="dd-custom-slot-title">
                  <ha-icon icon="mdi:cards-outline"></ha-icon>
                  <span>${this._editMode&&r?a:this._t("layout.custom_cards")}</span>
                </div>
                ${this._editMode&&r?d`
                  <button class="dd-add-card-inline" @click=${()=>this._addCard(e,t,i.length)}>
                    <ha-icon icon="mdi:plus"></ha-icon>
                    <span>${this._t("layout.add_card")}</span>
                  </button>
                `:c}
              </div>
            `:c}
        <div class="dd-custom-grid">
          ${b(i,e=>e.id,(t,a)=>this._renderCustomCard(e,t,a))}
        </div>
      </div>
    `}_renderCustomCard(e,t,a){const o=this._customCardDrag?.areaId===e&&this._customCardDrag.cardId===t.id,r=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===t.placement&&this._customCardDragOver.index===a,i={"dd-custom-card-wrap":!0,"dd-grid-full":"full"===t.card?.grid_options?.columns,"dd-grid-wide":this._customCardNeedsWideLayout(t.card),editing:this._editMode,dragging:o,"drag-over":r};return d`
      <div
        class=${p(i)}
        style=${ve(this._customCardGridStyle(t.card))}
        .draggable=${this._editMode}
        @dragstart=${a=>this._handleCustomCardDragStart(a,e,t.id)}
        @dragover=${o=>this._handleCustomSlotDragOver(o,e,t.placement,a)}
        @drop=${o=>this._handleCustomCardDrop(o,e,t.placement,a)}
        @dragend=${this._clearCustomCardDragState}
      >
        <div class="dd-card-toolbar">
          <button class="drag" title=${this._t("layout.drag_card")} aria-label=${this._t("layout.drag_card")}>
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <button title=${this._t("common.edit")} @click=${()=>this._editCard(e,t.id)}>
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
          <button class="del" title=${this._t("common.delete")} @click=${()=>this._deleteCard(e,t.id)}>
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
        <dwains-dashboard-next-card-host .hass=${this.hass} .config=${t.card}></dwains-dashboard-next-card-host>
      </div>
    `}_customCardNeedsWideLayout(e){const t=String(e?.type||"").replace(/^custom:/,"");return["todo-list","calendar","map","history-graph","statistics-graph","logbook"].includes(t)}_customCardGridStyle(e){const t=e?.grid_options;if(!t||"object"!=typeof t)return{};const a={};if("full"===t.columns)a["--dd-card-grid-column"]="1 / -1";else if("number"==typeof t.columns&&Number.isFinite(t.columns)){const e=Math.max(1,Math.min(12,Math.round(t.columns)));a["--dd-card-grid-column"]=`span ${e}`}if("number"==typeof t.rows&&Number.isFinite(t.rows)){const e=Math.max(1,Math.min(12,Math.round(t.rows)));a["--dd-card-grid-min-height"]=56*e+8*(e-1)+"px"}return a}_getDomainSlotCustomCards(e,t,a,o){const r=this._customCardPlacementInDomain(t,a),i=this._customCardPlacementAfter(t),n="cover_openings"===t?"cover":void 0;return this._getAreaCustomCards(e).filter(e=>{if(e.placement===r)return!0;const s=this._domainCustomCardPlacementIndex(e.placement,t);if(a===o&&void 0!==s&&s>o)return!0;if(n){const t=this._customCardPlacementInDomain(n,a);if(e.placement===t)return!0;const r=this._domainCustomCardPlacementIndex(e.placement,n);if(a===o&&void 0!==r&&r>o)return!0;if(a===o&&e.placement===this._customCardPlacementAfter(n))return!0}return a===o&&e.placement===i})}_domainCustomCardPlacementIndex(e,t){const a=`domain:${t}:`;if(!e.startsWith(a))return;const o=Number(e.slice(a.length));return Number.isFinite(o)&&o>=0?o:void 0}_placementIndexForCard(e,t){const a=t.get(e.placement)||0;return t.set(e.placement,a+1),a}_renderDomainCustomCardSlot(e,t,a,o){const r=this._canManageDashboard();!r&&this._editMode&&(this._editMode=!1);const i=this._customCardPlacementInDomain(t,a),n=this._getDomainSlotCustomCards(e,t,a,o),s=n.filter(e=>e.placement===i).length,l=new Map,p=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===i&&this._customCardDragOver.index===s;return 0!==n.length||this._editMode?d`
      ${n.map(t=>this._renderCustomCard(e,t,this._placementIndexForCard(t,l)))}
      ${this._editMode&&r&&a===o?d`
        <button
          class="dd-add-card dd-domain-add-card dd-domain-add-card-final ${p?"drag-over":""}"
          @click=${()=>this._addCard(e,i,s)}
          @dragover=${t=>this._handleCustomSlotDragOver(t,e,i,s)}
          @drop=${t=>this._handleCustomCardDrop(t,e,i,s)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("layout.add_card")}</span>
        </button>
      `:c}
    `:c}_renderUngroupedCustomCardSlot(e,t,a){const o=this._canManageDashboard();!o&&this._editMode&&(this._editMode=!1);const r=`ungrouped:${Math.max(0,t)}`,i=this._getAreaCustomCards(e).filter(e=>e.placement===r),n=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===r&&this._customCardDragOver.index===i.length;return i.length||this._editMode?d`
      ${i.map((t,a)=>this._renderCustomCard(e,t,a))}
      ${this._editMode&&o&&t===a?d`
        <button
          class="dd-add-card dd-domain-add-card dd-domain-add-card-final ${n?"drag-over":""}"
          @click=${()=>this._addCard(e,r,i.length)}
          @dragover=${t=>this._handleCustomSlotDragOver(t,e,r,i.length)}
          @drop=${t=>this._handleCustomCardDrop(t,e,r,i.length)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("layout.add_card")}</span>
        </button>
      `:c}
    `:c}_fireNativeDialog(e,t){this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:e,dialogImport:()=>Promise.resolve(),dialogParams:t}}))}_customCardPlacementAfter(e){return`after:${e}`}_customCardPlacementInDomain(e,t){return`domain:${e}:${Math.max(0,t)}`}_customCardId(){return`area-card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}_getAreaCustomCards(e){const t=this.config?.areas_options?.[e]||{};return Array.isArray(t.custom_cards)?t.custom_cards.map((e,t)=>({id:String(e?.id||`generated-${t}`),placement:String(e?.placement||"bottom"),card:e?.card})).filter(e=>e.card&&"object"==typeof e.card):[]}_getPersistableAreaCustomCards(e){return this._getAreaCustomCards(e).map(e=>({id:e.id,placement:e.placement||"bottom",card:e.card}))}_normalizeAreaCustomCardsForSave(e){return e.map(e=>({id:e.id.startsWith("generated-")?this._customCardId():e.id,placement:e.placement||"bottom",card:e.card}))}_insertIndexForPlacement(e,t,a){let o=0,r=-1;for(let i=0;i<e.length;i+=1){const n=e[i];if(n&&n.placement===t){if(o>=a)return i;o+=1,r=i}}return r>=0?r+1:e.length}_insertAreaCustomCard(e,t,a,o){const r=this._getPersistableAreaCustomCards(e),i=this._insertIndexForPlacement(r,a,o);r.splice(i,0,{id:this._customCardId(),placement:a,card:t}),this._saveAreaCustomCards(e,r)}_replaceAreaCustomCard(e,t,a){const o=this._getPersistableAreaCustomCards(e),r=o.findIndex(e=>e.id===t);if(r<0)return;const i=o[r];i&&(o[r]={...i,card:a},this._saveAreaCustomCards(e,o))}_addCard(e,t="bottom",a=Number.POSITIVE_INFINITY){if(this._canManageDashboard())if(customElements.get("hui-dialog-create-card")){const o={views:[{title:this.config?.areas?.find(t=>t.area_id===e)?.name||"Dwains",type:"sections",sections:[{type:"grid",cards:[]}]}]};this._fireNativeDialog("hui-dialog-create-card",{lovelaceConfig:o,path:[0,0],saveConfig:o=>{const r=o?.views?.[0]?.sections?.[0]?.cards||[],i=r[r.length-1];i&&this._insertAreaCustomCard(e,i,t,a)}})}else this._addCardYaml(e,t,a)}_editCard(e,t){if(!this._canManageDashboard())return;const a=this._getAreaCustomCards(e).find(e=>e.id===t)?.card;if(a)if(customElements.get("hui-dialog-edit-card")){const o={type:"grid",cards:[a]},r={views:[{title:"Dwains",type:"sections",sections:[o]}]};this._fireNativeDialog("hui-dialog-edit-card",{lovelaceConfig:r,cardConfig:a,sectionConfig:o,saveCardConfig:a=>{a?.type&&this._replaceAreaCustomCard(e,t,a)}})}else this._editCardYaml(e,t)}_addCardYaml(e,t="bottom",a=Number.POSITIVE_INFINITY){this._canManageDashboard()&&ee(this,{areaName:this.config?.areas?.find(t=>t.area_id===e)?.name,onSave:o=>{this._insertAreaCustomCard(e,o,t,a)}})}_editCardYaml(e,t){if(!this._canManageDashboard())return;const a=this._getAreaCustomCards(e).find(e=>e.id===t)?.card;a&&ee(this,{card:a,areaName:this.config?.areas?.find(t=>t.area_id===e)?.name,onSave:a=>{this._replaceAreaCustomCard(e,t,a)}})}_deleteCard(e,t){if(!this._canManageDashboard())return;if(!confirm(this._t("layout.delete_card_confirm")))return;const a=this._getPersistableAreaCustomCards(e).filter(e=>e.id!==t);this._saveAreaCustomCards(e,a)}_handleCustomCardDragStart(e,t,a){this._editMode&&this._canManageDashboard()?(this._clearGeneratedCardDragState(),this._customCardDrag={areaId:t,cardId:a},this._customCardDragOver=null,e.dataTransfer?.setData("text/plain",a),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")):e.preventDefault()}_handleCustomSlotDragOver(e,t,a,o){this._editMode&&this._customCardDrag&&this._customCardDrag.areaId===t&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._customCardDragOver={areaId:t,placement:a,index:o})}_handleCustomCardDrop(e,t,a,o){this._customCardDrag&&this._customCardDrag.areaId===t&&(e.preventDefault(),e.stopPropagation(),this._moveAreaCustomCard(t,this._customCardDrag.cardId,a,o),this._clearCustomCardDragState())}_moveAreaCustomCard(e,t,a,o){const r=this._getPersistableAreaCustomCards(e),i=r.findIndex(e=>e.id===t);if(i<0)return;const n=r[i];if(!n)return;const s=n.placement||"bottom",c=r.slice(0,i).filter(e=>e.placement===s).length,[d]=r.splice(i,1);if(!d)return;let l=o;s===a&&c<o&&(l=Math.max(0,o-1)),d.placement=a;const p=this._insertIndexForPlacement(r,a,l);r.splice(p,0,d),this._saveAreaCustomCards(e,r)}_getDashboardUrlPath(){const e=window.location.pathname.split("/")[1];if(e&&"lovelace"!==e)return e}async _saveAreaCustomCards(e,t){const a=this._normalizeAreaCustomCardsForSave(t);await this._saveAreaOptionsPatch(e,{custom_cards:a})}async _saveAreaOptionsPatch(e,t){if(!this._canManageDashboard())return;const a=this._editMode&&"area"===this._selectedView&&this._selectedArea===e;a&&this._rememberAreaEditMode(e);const o=this.config.areas_options||{};this.config={...this.config,areas_options:{...o,[e]:{...o[e]||{},...t}}},a&&(this._editMode=!0),this.requestUpdate();try{const a=this._getDashboardUrlPath(),o=a?{url_path:a}:{},r=await this.hass.callWS({type:"lovelace/config",...o});if(r&&r.strategy){const a=r.strategy,i=a.areas_options||{},n={...r,strategy:{...a,areas_options:{...i,[e]:{...i[e]||{},...t}}}};await this.hass.callWS({type:"lovelace/config/save",...o,config:n}),console.log("✅ Area options saved for",e)}else console.warn("⚠️ No dashboard strategy found; area options were not saved",r)}catch(e){console.error("❌ Saving area options failed:",e),alert(this._t("layout.save_card_failed",{error:String(e)}))}}_renderMobileEntitiesSection(e,t){const a=this._sortAreaEntities(e.area_id,t);if("ungrouped"===this.config?.areas_options?.[e.area_id]?.entity_layout)return this._renderUngroupedAreaEntities(e,a);const o=this._sortAreaEntityGroups(e.area_id,this._mobileEntityGroups(e.area_id,a));if(!o.length)return c;const r=this._isMobile&&!this._editMode&&!this._renderAllMobileAreaEntities&&o.length>4?o.slice(0,4):o;return d`
      <section class="mobile-entities-section layout-${this._mobileEntityLayout}">
        ${r.map(t=>{const a=this._mobileControllableEntities(t.entities).length>0,r=`${e.area_id}:${t.key}`,i=!this._editMode&&Boolean(this._collapsedAreaGroups[r]),n=t.entities[0]?.entity_id.split(".")[0]||t.key,s=t.entities[0]?this.hass.states[t.entities[0].entity_id]?.attributes?.device_class:void 0,l="cover_openings"===t.key?m("binary_sensor","opening"):"cover_shading"===t.key||"cover_gates"===t.key?m("cover"):"motion"===t.key?m("binary_sensor","motion"):"safety"===t.key?m("binary_sensor","smoke"):m(n,s),h=this._isMobile&&!this._editMode&&!this._renderAllMobileAreaEntities&&t.entities.length>12?t.entities.slice(0,12):t.entities,g=h.map(e=>e.entity_id);return d`
            <div
              class=${p({"mobile-domain-group":!0,"group-editing":this._editMode&&this._canManageDashboard(),"group-dragging":this._generatedGroupDrag?.areaId===e.area_id&&this._generatedGroupDrag.groupKey===t.key,"group-drag-over":this._generatedGroupDragOver?.areaId===e.area_id&&this._generatedGroupDragOver.groupKey===t.key,"is-collapsed":i})}
              @dragover=${a=>this._handleGeneratedGroupDragOver(a,e.area_id,t.key)}
              @drop=${a=>this._handleGeneratedGroupDrop(a,e.area_id,t.key,o.map(e=>e.key))}
            >
              <div
                class="mobile-domain-header expandable-header"
                role="button"
                tabindex="0"
                aria-expanded=${i?"false":"true"}
                @click=${()=>{this._editMode||(this._collapsedAreaGroups={...this._collapsedAreaGroups,[r]:!i})}}
                @keydown=${e=>{this._editMode||"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._collapsedAreaGroups={...this._collapsedAreaGroups,[r]:!i})}}
              >
                <div
                  class="mobile-domain-title"
                  style=${`--domain-color: ${l};`}
                >
                  ${this._editMode&&this._canManageDashboard()?d`
                    <button
                      class="mobile-domain-leading-drag-handle"
                      type="button"
                      draggable="true"
                      title=${this._t("layout.drag_group")}
                      aria-label=${this._t("layout.drag_group")}
                      @click=${e=>e.stopPropagation()}
                      @dragstart=${a=>this._handleGeneratedGroupDragStart(a,e.area_id,t.key)}
                      @dragend=${this._clearGeneratedGroupDragState}
                    >
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </button>
                  `:d`
                    <ha-icon
                      class="mobile-domain-leading-chevron"
                      icon=${i?"mdi:chevron-down":"mdi:chevron-up"}
                      aria-hidden="true"
                    ></ha-icon>
                  `}
                  <span class="room-domain-icon" aria-hidden="true">
                    <ha-icon icon=${"todo"===t.key?"mdi:clipboard-list-outline":this._mobileGroupIcon(t.key)}></ha-icon>
                  </span>
                  <span class="mobile-domain-title-copy">
                    <span class="mobile-domain-title-label">${t.name}</span>
                    ${t.entities.length>0?d`
                      <span class="mobile-domain-count">(${t.entities.length})</span>
                    `:c}
                  </span>
                </div>

                <div
                  class="mobile-domain-header-actions"
                  @click=${e=>e.stopPropagation()}
                  @keydown=${e=>e.stopPropagation()}
                >
                  ${a?this._renderMobileDomainMaster(t):c}
                </div>
	              </div>
	              <div class="mobile-entity-rail" style=${i?"display:none":""}>
	                ${this._renderDomainCustomCardSlot(e.area_id,t.key,0,h.length)}
	                ${b(h,e=>e.entity_id,(a,o)=>d`
                      ${this._renderEditableGeneratedCard(e,a,t.key,o,g)}
                      ${this._renderDomainCustomCardSlot(e.area_id,t.key,o+1,h.length)}
                    `)}
	              </div>
	            </div>
	          `})}
      </section>
    `}_renderUngroupedAreaEntities(e,t){const a=this._getAreaCustomCards(e.area_id).some(e=>e.placement.startsWith("ungrouped:")||e.placement.startsWith("domain:")||e.placement.startsWith("after:"));if(!t.length&&!a&&!this._editMode)return c;const o="grid"===this._mobileEntityLayout,r=new Map;t.forEach(e=>{const t=this._mobileEntityTypeKey(e.entity_id)||"other";r.set(t,(r.get(t)||0)+1)});const i=new Map;return d`
      <section class="mobile-entities-section area-ungrouped-entities layout-${this._mobileEntityLayout}">
        <div class="mobile-domain-group area-ungrouped-group">
          <div class="mobile-domain-header">
            <div class="mobile-domain-title">
              <button
                class="mobile-layout-toggle ${o?"active":""}"
                type="button"
                title=${o?this._t("layout.swipe_cards"):this._t("layout.show_all_cards")}
                aria-label=${o?this._t("layout.switch_swipe_cards"):this._t("layout.show_all_cards")}
                @click=${this._toggleMobileEntityLayout}
              >
                <ha-icon icon=${o?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
              </button>
              <span class="mobile-domain-title-copy">
                <span class="mobile-domain-title-label">${this._t("layout.entities")}</span>
                <span class="mobile-domain-count">(${this._tp("common.entity",t.length)})</span>
              </span>
            </div>
          </div>
          <div class="mobile-entity-rail">
            ${this._renderUngroupedCustomCardSlot(e.area_id,0,t.length)}
            ${t.map((a,o)=>{const n=this._mobileEntityTypeKey(a.entity_id)||"other",s=i.get(n)||0,l=r.get(n)||0;return i.set(n,s+1),d`
                ${0===s?this._renderDomainCustomCardSlot(e.area_id,n,0,l):c}
                ${this._renderEditableGeneratedCard(e,a,nt,o,t.map(e=>e.entity_id))}
                ${this._renderDomainCustomCardSlot(e.area_id,n,s+1,l)}
                ${this._renderUngroupedCustomCardSlot(e.area_id,o+1,t.length)}
              `})}
          </div>
        </div>
      </section>
    `}_renderMobileDomainMaster(e){const t=this._mobileControllableEntities(e.entities);if(!t.length)return c;const a=t[0].entity_id.split(".")[0]||e.key,o=t.filter(e=>{const t=this._getEffectiveEntityState(this.hass.states[e.entity_id]);return this._isEntityActiveForUi(t,a)}).length,r=o>0;if("cover"===a)return this._renderMobileDomainActions(a,t,[{turnOn:!0,label:this._t("action.open_all"),icon:"mdi:arrow-up",active:r},{turnOn:!1,label:this._t("action.close_all"),icon:"mdi:arrow-down",active:!r}]);if("lock"===a)return this._renderMobileDomainActions(a,t,[{turnOn:!1,label:this._t("action.lock_all"),icon:"mdi:lock-outline",active:!r},{turnOn:!0,label:this._t("action.unlock_all"),icon:"mdi:lock-open-variant-outline",active:r}]);const i=this._mobileDomainMasterLabel(a,r,o,t.length),n=this._mobileDomainMasterIcon(a,r);return d`
      <button
        class="mobile-domain-master domain-${a} ${r?"active":""}"
        type="button"
        title=${i}
        aria-label=${i}
        aria-pressed=${r?"true":"false"}
        @click=${e=>{e.stopPropagation(),this._requestMobileGroupState(t,!r,a)}}
      >
        <ha-icon icon=${n}></ha-icon>
        <span class="mobile-domain-master-count">${o}/${t.length}</span>
        <span class="mobile-domain-master-track" aria-hidden="true"></span>
      </button>
    `}_renderMobileDomainActions(e,t,a){return d`
      <div class="mobile-domain-master-actions domain-${e}" role="group">
        ${a.map(a=>d`
          <button
            class="mobile-domain-master-action ${a.active?"active":""}"
            type="button"
            title=${a.label}
            aria-label=${a.label}
            @click=${o=>{o.stopPropagation(),this._requestMobileGroupState(t,a.turnOn,e)}}
          >
            <ha-icon icon=${a.icon}></ha-icon>
          </button>
        `)}
      </div>
    `}_mobileDomainMasterLabel(e,t,a,o){return"light"===e?this._t(t?"action.lights_off_summary":"action.lights_on_summary",{active:a,total:o}):"cover"===e?this._t(t?"action.covers_close_summary":"action.covers_open_summary",{active:a,total:o}):"fan"===e?this._t(t?"action.fans_off_summary":"action.fans_on_summary",{active:a,total:o}):"lock"===e?this._t(t?"action.lock":"action.unlock"):this._t(t?"action.switches_off_summary":"action.switches_on_summary",{active:a,total:o})}_mobileDomainMasterIcon(e,t){return"light"===e?t?"mdi:lightbulb":"mdi:lightbulb-outline":"switch"===e?t?"mdi:power-plug":"mdi:power-plug-off-outline":"fan"===e?t?"mdi:fan":"mdi:fan-off":"cover"===e?t?"mdi:window-shutter-open":"mdi:window-shutter":"lock"===e?t?"mdi:lock-open-variant-outline":"mdi:lock-outline":t?"mdi:toggle-switch":"mdi:toggle-switch-off-outline"}_customCardDomainGroupKeys(e){const t=[];return this._getAreaCustomCards(e).forEach(e=>{let a;if(e.placement.startsWith("domain:")){const t=/^domain:(.+):\d+$/.exec(e.placement);a=t?.[1]}else e.placement.startsWith("after:")&&(a=e.placement.slice(6));"cover"===a&&(a="cover_openings"),a&&!t.includes(a)&&t.push(a)}),t}_mobileEntityGroups(e,t){const a=t.reduce((e,t)=>{const a=this._mobileEntityTypeKey(t.entity_id);return a?(e[a]||(e[a]=[]),e[a].push(t),e):e},{});return this._customCardDomainGroupKeys(e).forEach(e=>{a[e]||(a[e]=[])}),Object.entries(a).sort(([e],[t])=>{const a=k.indexOf(e),o=k.indexOf(t);return-1!==a||-1!==o?(-1===a?Number.MAX_SAFE_INTEGER:a)-(-1===o?Number.MAX_SAFE_INTEGER:o):this._mobileGroupName(e).localeCompare(this._mobileGroupName(t))}).map(([e,t])=>({key:e,name:this._mobileGroupName(e),icon:this._mobileGroupIcon(e),entities:t}))}_sortAreaEntityGroups(e,t){const a=this.config?.areas_options?.[e]?.group_order||[];if(!a.length)return t;const o=e=>{const t=a.indexOf(e);if(t>=0)return t;if("cover_gates"===e&&a.includes("cover_shading"))return a.indexOf("cover_shading");if(("cover_openings"===e||"cover_shading"===e||"cover_gates"===e)&&a.includes("cover"))return a.indexOf("cover");if(k.includes(e)){const t=a.indexOf(z(e));if(t>=0)return t}};return t.map((e,t)=>({group:e,fallbackIndex:t})).sort((e,t)=>{const a=o(e.group.key),r=o(t.group.key);return void 0!==a&&void 0!==r?a!==r?a-r:e.fallbackIndex-t.fallbackIndex:void 0!==a?-1:void 0!==r?1:e.fallbackIndex-t.fallbackIndex}).map(({group:e})=>e)}_sortAreaEntities(e,t){const a=this.config?.areas_options?.[e],o="ungrouped"===a?.entity_layout,r=new Map((a?.entity_order||[]).map((e,t)=>[e,t]));return[...t].sort((e,t)=>{if(o){const a=r.get(e.entity_id),o=r.get(t.entity_id);if(void 0!==a&&void 0!==o)return a-o;if(void 0!==a)return-1;if(void 0!==o)return 1}else{const o=this._mobileEntityTypeKey(e.entity_id);if(o===this._mobileEntityTypeKey(t.entity_id)&&o){const r=a?.groups_options?.[o],i="cover_gates"===o?a?.groups_options?.cover_shading:void 0,n="cover_openings"===o||"cover_shading"===o||"cover_gates"===o?a?.groups_options?.cover:void 0,s=k.includes(o)?a?.groups_options?.[z(o)]:void 0,c=r?.order||i?.order||n?.order||s?.order||[],d=c.indexOf(e.entity_id),l=c.indexOf(t.entity_id);if(-1!==d&&-1!==l)return d-l;if(-1!==d)return-1;if(-1!==l)return 1}}const i=this.hass.states[e.entity_id]?.attributes?.friendly_name||e.entity_id,n=this.hass.states[t.entity_id]?.attributes?.friendly_name||t.entity_id,s=e.device_id||this.hass.entities?.[e.entity_id]?.device_id||"",c=t.device_id||this.hass.entities?.[t.entity_id]?.device_id||"";if(s!==c){const e=(e,t)=>e?this.config?.devices?.find(t=>t.device_id===e)?.name||e:t,t=e(s,i).localeCompare(e(c,n),N(this.hass));if(0!==t)return t}return i.localeCompare(n,N(this.hass))})}_renderEditableGeneratedCard(e,t,a,o,r){if(!this._editMode||!this._canManageDashboard())return this._renderMobileEntityCard(e,t);const i=this._isAreaEntityHidden(e.area_id,t.entity_id),n=this._generatedCardDrag?.areaId===e.area_id&&this._generatedCardDrag.entityId===t.entity_id,s=this._generatedCardDragOver?.areaId===e.area_id&&this._generatedCardDragOver.entityId===t.entity_id&&this._generatedCardDragOver.groupKey===a;return d`
      <div
        class=${p({"dd-generated-card-wrap":!0,editing:!0,"is-hidden":i,dragging:n,"drag-over":s})}
        draggable="true"
        @dragstart=${o=>this._handleGeneratedCardDragStart(o,e.area_id,t.entity_id,a)}
        @dragover=${o=>this._handleGeneratedCardDragOver(o,e.area_id,t.entity_id,a)}
        @drop=${t=>this._handleGeneratedCardDrop(t,e.area_id,a,o,r)}
        @dragend=${this._clearGeneratedCardDragState}
        @click=${e=>e.stopPropagation()}
      >
        ${this._renderMobileEntityCard(e,t,{areaId:e.area_id,hidden:i})}
      </div>
    `}_handleGeneratedGroupDragStart(e,t,a){this._editMode&&this._canManageDashboard()?(e.stopPropagation(),e.currentTarget?.blur(),this._clearCustomCardDragState(),this._clearGeneratedCardDragState(),this._generatedGroupDrag={areaId:t,groupKey:a},this._generatedGroupDragOver=null,e.dataTransfer?.setData("text/plain",a),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")):e.preventDefault()}_handleGeneratedGroupDragOver(e,t,a){const o=this._generatedGroupDrag;this._editMode&&o&&o.areaId===t&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._generatedGroupDragOver={areaId:t,groupKey:a})}_handleGeneratedGroupDrop(e,t,a,o){const r=this._generatedGroupDrag;if(!r||r.areaId!==t)return;e.preventDefault(),e.stopPropagation();const i=o.indexOf(r.groupKey),n=o.indexOf(a);if(i<0||n<0||i===n)return void this._clearGeneratedGroupDragState();const s=[...o],[c]=s.splice(i,1);c&&s.splice(n,0,c);const d=this.shadowRoot?.querySelector(".content-area"),l=d?.scrollTop??0,p=window.scrollX,m=window.scrollY,h=this.shadowRoot?.activeElement;h?.blur();const g=()=>{d&&Math.abs(d.scrollTop-l)>1&&(d.scrollTop=l),(Math.abs(window.scrollY-m)>1||Math.abs(window.scrollX-p)>1)&&window.scrollTo(p,m)},b=()=>{this.updateComplete.then(()=>{requestAnimationFrame(()=>{g(),requestAnimationFrame(g)})})};try{window.sessionStorage.setItem("dd-next-room-dnd-scroll",JSON.stringify({areaId:t,pathname:window.location.pathname,contentScrollTop:l,windowScrollX:p,windowScrollY:m,expiresAt:Date.now()+1e4}))}catch{}const x=this._saveAreaOptionsPatch(t,{group_order:s});this._clearGeneratedGroupDragState(),b(),x.finally(()=>{b(),window.setTimeout(g,80),window.setTimeout(g,220)})}_handleGeneratedCardDragStart(e,t,a,o){this._editMode&&this._canManageDashboard()?(this._clearCustomCardDragState(),this._generatedCardDrag={areaId:t,entityId:a,groupKey:o},this._generatedCardDragOver=null,e.dataTransfer?.setData("text/plain",a),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")):e.preventDefault()}_handleGeneratedCardDragOver(e,t,a,o){const r=this._generatedCardDrag;this._editMode&&r&&r.areaId===t&&r.groupKey===o&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._generatedCardDragOver={areaId:t,entityId:a,groupKey:o})}_handleGeneratedCardDrop(e,t,a,o,r){const i=this._generatedCardDrag;if(!i||i.areaId!==t||i.groupKey!==a)return;e.preventDefault(),e.stopPropagation();const n=r.indexOf(i.entityId);if(n<0)return void this._clearGeneratedCardDragState();const s=[...r],[c]=s.splice(n,1);if(!c)return void this._clearGeneratedCardDragState();if(s.splice(Math.max(0,Math.min(o,s.length)),0,c),a===nt)return this._saveAreaOptionsPatch(t,{entity_order:s}),void this._clearGeneratedCardDragState();const d=new Set(s.map(e=>this._areaStrategyGroupKey(e)||a)),l=1!==d.size,p=l?a:Array.from(d)[0]||a,m=this.config?.areas_options?.[t],h=m?.groups_options||{},g=h[p]||("cover_gates"===p?h.cover_shading:void 0)||("cover_openings"===p||"cover_shading"===p||"cover_gates"===p?h.cover:void 0)||{},b=this._getEditableAreaEntities(t).filter(e=>l?this._mobileEntityTypeKey(e.entity_id)===a:(this._areaStrategyGroupKey(e.entity_id)||a)===p).map(e=>e.entity_id),x=g.order||[],u=[...x.filter((e,t)=>b.includes(e)&&x.indexOf(e)===t),...b.filter(e=>!x.includes(e))],f=new Set(s);let v=0;const w=u.map(e=>f.has(e)&&s[v++]||e);this._saveAreaOptionsPatch(t,{groups_options:{...h,[p]:{...g,order:w}}}),this._clearGeneratedCardDragState()}_isAreaEntityHidden(e,t){const a=this.config?.areas_options?.[e]?.groups_options||{};return Object.values(a).some(e=>e.hidden?.includes(t))}_toggleGeneratedCardVisibility(e,t,a){if(e.preventDefault(),e.stopPropagation(),!this._canManageDashboard())return;const o=this.config?.areas_options?.[t],r=o?.groups_options||{},i=this._isAreaEntityHidden(t,a),n=Object.fromEntries(Object.entries(r).map(([e,t])=>[e,{...t,hidden:(t.hidden||[]).filter(e=>e!==a)}]));if(!i){const e=this._areaStrategyGroupKey(a)||this._mobileEntityTypeKey(a)||"others",t=n[e]||{};n[e]={...t,hidden:[...t.hidden||[],a]}}this._saveAreaOptionsPatch(t,{groups_options:n})}_areaStrategyGroupKey(e){return y(e,this.hass)||this._mobileEntityTypeKey(e)}_mobileEntityTypeKey(e){const t=y(e,this.hass);if(t)return t;return e.split(".")[0]||void 0}_mobileGroupName(e){const t=String(this.hass?.language||this.hass?.locale?.language||"").toLowerCase().startsWith("de");return"cover_openings"===e?t?"Fenster & Türen":"Windows & doors":"cover_shading"===e?t?"Beschattung":"Shading":"cover_gates"===e?t?"Tore":"Gates":"motion"===e?t?"Bewegung & Präsenz":"Motion & presence":"safety"===e?t?"Sicherheit & Warnmelder":"Safety & alarms":_(this.hass,e)}_mobileGroupIcon(e){return"motion"===e?"mdi:motion-sensor":"safety"===e?"mdi:shield-alert-outline":"cover_openings"===e?"mdi:door-open":"cover_shading"===e?"mdi:blinds-horizontal":"cover_gates"===e?"mdi:gate":f(e)}_areaReplacementCardConfig(e){const t=$({hass:this.hass,config:this.config,entity:e,surface:"area_cards"});return t&&!1!==t.enabled?S({hass:this.hass,config:this.config,entity:e,surface:"area_cards"}):null}_renderAreaReplacementCard(e,t){return d`
      <div class="mobile-entity-replacement-card" data-entity=${e}>
        <dwains-dashboard-next-card-host
          framed
          .hass=${this.hass}
          .config=${t}
        ></dwains-dashboard-next-card-host>
      </div>
    `}_renderMobileEntityCard(e,t,a){const o=this.hass.states[t.entity_id];if(!o)return c;const r=this._getEffectiveEntityState(o),i=t.entity_id.split(".")[0]||"unknown";if("todo"===i)return this._renderTodoListCard(t);const n=r.attributes?.device_class,s=this._areaReplacementCardConfig(t.entity_id);if(s)return this._renderAreaReplacementCard(t.entity_id,s);const l=["select","input_select"].includes(i)?f(i):this.hass.entities?.[t.entity_id]?.icon||r.attributes?.icon||x(i,n)||f(i),p=r.attributes?.friendly_name||this.hass.entities?.[t.entity_id]?.name||t.entity_id,m=!0===this.config?.settings?.hide_area_name_in_entity_names?w(p,e.name):p,h=this._isEntityActiveForUi(r,i),g=this._mobileEntityActionKind(i),b=["unavailable","unknown"].includes(String(r.state).toLowerCase()),u="scene"===i||"event"===i,v=this._mobileEntityHasInlineSelect(i,r),y=this._mobileEntityStatusText(r,i),_=[`mobile-entity-${i}`,n?`device-${n}`:"",`action-${g}`,v?"has-inline-select":""].filter(Boolean).join(" "),k=this._mobileEntityColor(i,n),z="toggle"===g?"toggle":"cover"===g?"cover":"lock"===g?"lock":"scene"===g?"scene":"none";return d`
      <dd-next-compact-entity-tile
        class="mobile-entity-tile-host ${_}"
        variant="compact"
        .name=${m}
        .status=${y}
        .icon=${l}
        .accent=${k}
        .active=${h}
        .unavailable=${b&&!u}
        .editing=${Boolean(a)}
        .selectOptions=${v?this._mobileEntitySelectOptions(r):void 0}
        .selectedOption=${String(r.state)}
        @dd-select=${e=>this._handleMobileSelectChange(e,r,i)}
        @dd-open=${()=>this._showMoreInfo(t.entity_id)}
      >
        ${a?d`
          <button
            slot="leading"
            class="dd-generated-card-leading-drag-handle"
            type="button"
            title=${this._t("layout.drag_card")}
            aria-label=${this._t("layout.drag_card")}
            @click=${e=>e.stopPropagation()}
          >
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
        `:c}

        ${a?d`
          <button
            slot="actions"
            class="dd-generated-card-visibility"
            type="button"
            title=${this._t(a.hidden?"common.show":"common.hide")}
            aria-label=${this._t(a.hidden?"common.show":"common.hide")}
            aria-pressed=${a.hidden?"true":"false"}
            @click=${e=>this._toggleGeneratedCardVisibility(e,a.areaId,t.entity_id)}
          >
            <ha-icon icon=${a.hidden?"mdi:eye":"mdi:eye-off-outline"}></ha-icon>
          </button>
        `:"none"!==z?d`
          <dd-next-entity-actions
            slot="actions"
            .mode=${z}
            .accent=${k}
            .active=${h}
            .unavailable=${b}
            .state=${String(r.state||"")}
            .canOpen=${this._coverSupportsFeature(r,1)}
            .canClose=${this._coverSupportsFeature(r,2)}
            .canStop=${this._coverSupportsFeature(r,8)}
            .turnOnLabel=${this._t("action.turn_on")}
            .turnOffLabel=${this._t("action.turn_off")}
            .openLabel=${this._t("action.open")}
            .stopLabel=${this._t("action.stop")}
            .closeLabel=${this._t("action.close")}
            .lockLabel=${this._t("action.lock")}
            .unlockLabel=${this._t("action.unlock")}
            .activateLabel=${this._t("action.activate")}
            @dd-action=${e=>{"toggle"===g?this._handleMobileEntityToggle(e,r,i):"cover"===g?this._handleMobileCoverAction(e,r,e.detail.action):"lock"===g?this._handleMobileLockAction(e,r):"scene"===g&&this._handleMobileSceneAction(e,r)}}
          ></dd-next-entity-actions>
        `:c}

      </dd-next-compact-entity-tile>
    `}_renderTodoListCard(e){return d`
      <div class="mobile-todo-list-card" data-entity=${e.entity_id}>
        <dwains-dashboard-next-card-host
          eager
          .hass=${this.hass}
          .config=${{type:"todo-list",entity:e.entity_id}}
        ></dwains-dashboard-next-card-host>
      </div>
    `}_mobileEntityHasInlineSelect(e,t){return["select","input_select"].includes(e)&&Array.isArray(t?.attributes?.options)}_mobileEntitySelectOptions(e){const t=String(e?.state||""),a=Array.isArray(e?.attributes?.options)?e.attributes.options.map(e=>String(e)):[];return!t||["unknown","unavailable"].includes(t.toLowerCase())||a.includes(t)?a:[t,...a]}async _handleMobileEntityToggle(e,t,a){e.stopPropagation();const o=t?.entity_id;if(o){try{if(["light","switch","fan","input_boolean"].includes(a)){const e=!this._isEntityActiveForUi(t,a);return this._setOptimisticEntityState(o,e?"on":"off"),void await this.hass.callService(a,e?"turn_on":"turn_off",{entity_id:o})}}catch(e){return this._clearOptimisticEntityStates([o]),console.warn(`Failed to toggle mobile entity ${o}:`,e),void this._showToast(this._t("entity.update_failed"))}this._showMoreInfo(o)}}async _handleMobileSelectChange(e,t,a){e.stopPropagation();const o=t?.entity_id,r=e.detail.option;if(o&&void 0!==r){this._setOptimisticEntityState(o,r);try{await this.hass.callService("input_select"===a?"input_select":"select","select_option",{entity_id:o,option:r})}catch(e){this._clearOptimisticEntityStates([o]),console.warn(`Failed to select option for ${o}:`,e),this._showToast(this._t("entity.selector_failed"))}}}async _handleMobileCoverAction(e,t,a){e.stopPropagation();const o=t?.entity_id;if(!o)return;const r="open"===a?"open_cover":"close"===a?"close_cover":"stop_cover",i="open"===a?"open":"close"===a?"closed":void 0;i&&this._setOptimisticEntityState(o,i);try{await this.hass.callService("cover",r,{entity_id:o})}catch(e){this._clearOptimisticEntityStates([o]),console.warn(`Failed to ${a} cover ${o}:`,e),this._showToast(this._t("entity.cover_failed"))}}async _handleMobileLockAction(e,t){e.stopPropagation();const a=t?.entity_id;if(a)try{const e=this._isEntityActiveForUi(t,"lock");this._setOptimisticEntityState(a,e?"locked":"unlocked"),await this.hass.callService("lock",e?"lock":"unlock",{entity_id:a})}catch(e){this._clearOptimisticEntityStates([a]),console.warn(`Failed to toggle lock ${a}:`,e),this._showToast(this._t("entity.lock_failed"))}}async _handleMobileSceneAction(e,t){e.stopPropagation();const a=t?.entity_id;if(a)try{await this.hass.callService("scene","turn_on",{entity_id:a}),this._showToast(this._t("action.scene_activated"))}catch(e){console.warn(`Failed to activate scene ${a}:`,e),this._showMoreInfo(a)}}_mobileControllableEntities(e){return e.filter(e=>{const t=e.entity_id.split(".")[0]||"";return Boolean(this.hass.states[e.entity_id])&&this._mobileEntitySupportsToggle(t)})}_masterActionLabel(e,t){return"cover"===e?this._t(t?"action.open_all":"action.close_all"):"lock"===e?this._t(t?"action.unlock_all":"action.lock_all"):this._t(t?"action.turn_on_all":"action.turn_off_all")}_masterActionIsDestructive(e,t){return"lock"===e?t:!t}_areaDisplayName(e){return this.config?.areas?.find(t=>t.area_id===e)?.name||e}async _confirmMasterActionIfNeeded(e,t,a,o){const r=ae(e);if(!r||!te(this.config?.settings,r))return!0;const i=this._masterActionLabel(r,t);return this._showConfirmation(i,this._t("action.confirm_master_action",{count:a,area:this._areaDisplayName(o)}),{confirmLabel:i,destructive:this._masterActionIsDestructive(r,t)})}async _requestMobileGroupState(e,t,a){await this._confirmMasterActionIfNeeded(a,t,e.length,this._selectedArea||"")&&await this._setMobileGroupState(e,t,a)}async _setMobileGroupState(e,t,a){const o=this._mobileControllableEntities(e).reduce((e,t)=>{const a=t.entity_id.split(".")[0]||"";return e[a]||(e[a]=[]),e[a].push(t.entity_id),e},{}),r=[];try{await Promise.all(Object.entries(o).map(([e,a])=>a.length?["light","switch","fan","input_boolean"].includes(e)?(r.push(...a),this._setOptimisticEntityStates(a,t?"on":"off"),this.hass.callService(e,t?"turn_on":"turn_off",{entity_id:a})):"cover"===e?(r.push(...a),this._setOptimisticEntityStates(a,t?"open":"closed"),this.hass.callService("cover",t?"open_cover":"close_cover",{entity_id:a})):"lock"===e?(r.push(...a),this._setOptimisticEntityStates(a,t?"unlocked":"locked"),this.hass.callService("lock",t?"unlock":"lock",{entity_id:a})):Promise.resolve():Promise.resolve()));const e=Object.values(o).reduce((e,t)=>e+t.length,0),i=ae(a);e&&i&&this._showToast(this._masterActionToast(i,t))}catch(e){this._clearOptimisticEntityStates(r),console.warn("Failed to run mobile group action:",e),this._showToast(this._t("entity.group_failed"))}}_mobileEntitySupportsToggle(e){return["light","switch","fan","input_boolean","cover","lock"].includes(e)}_masterActionToast(e,t){return"light"===e?this._t(t?"action.all_lights_on":"action.all_lights_off"):"switch"===e?this._t(t?"action.all_switches_on":"action.all_switches_off"):"fan"===e?this._t(t?"action.all_fans_on":"action.all_fans_off"):this._masterActionLabel(e,t)}_mobileEntityActionKind(e){return["light","switch","fan","input_boolean"].includes(e)?"toggle":"cover"===e?"cover":"lock"===e?"lock":"scene"===e?"scene":"more"}_coverSupportsFeature(e,t){const a=Number(e?.attributes?.supported_features);return!Number.isFinite(a)||a<=0?1===t||2===t:0!==(a&t)}_mobileEntityStatusText(e,t){if(!e)return"";const a=this._formatFavoriteState(e);if("scene"===t)return this._sceneLastActivatedText(e);if("event"===t)return this._eventLastTriggeredText(e);if("light"===t){const t=String(e.state||"").toLowerCase();if("on"===t||"off"===t){const a="on"===t?"An":"Aus",o=e.attributes?.brightness;return"number"==typeof o&&Number.isFinite(o)?`${a} · ${T(Math.round(o/255*100),"%")}`:a}}if("cover"===t&&"number"==typeof e.attributes?.current_position)return`${a} · ${T(e.attributes.current_position,"%")}`;if("climate"===t){const t=e.attributes?.current_temperature,a=e.attributes?.temperature,o=this.hass?.config?.unit_system?.temperature||"°C";if(void 0!==t&&void 0!==a)return`${T(t,o)} · ${this._t("entity.climate_set",{value:T(a,o)})}`;if(void 0!==t)return T(t,o)}return"media_player"===t&&e.attributes?.media_title?`${a} · ${e.attributes.media_title}`:a}_sceneLastActivatedText(e){const t=String(e?.state||"").toLowerCase(),a=t&&!["unknown","unavailable"].includes(t)?e.state:e?.last_changed||e?.last_updated,o=Date.parse(a);return Number.isFinite(o)?this._formatRelativeTime(o):this._t("entity.not_activated")}_eventLastTriggeredText(e){const t=String(e?.state||"").toLowerCase();if("unavailable"===t)return this._t("common.unavailable");const a=Date.parse(e?.last_changed||e?.last_updated||"");return Number.isFinite(a)?t&&"unknown"!==t?`${this._formatFavoriteState(e)} · ${this._formatRelativeTime(a)}`:this._formatRelativeTime(a):this._t("entity.no_events")}_formatRelativeTime(e){const t=Math.round((e-Date.now())/1e3),a=Math.abs(t),[o,r]=[["year",31536e3],["month",2592e3],["week",604800],["day",86400],["hour",3600],["minute",60],["second",1]].find(([,e])=>a>=e)||["second",1],i=Math.round(t/r);try{const e=this.hass?.locale?.language||navigator.language||void 0;return new Intl.RelativeTimeFormat(e,{numeric:"auto"}).format(i,o)}catch{if(a<60)return"just now";const e=Math.abs(i);return`${e} ${o}${1===e?"":"s"} ${i<0?"ago":"from now"}`}}_isEntityActiveForUi(e,t){if(!e||["unavailable","unknown"].includes(String(e.state)))return!1;const a=String(e.state).toLowerCase();if("cover"===t)return["open","opening"].includes(a);if("lock"===t)return"unlocked"===a;if("climate"===t){const t=e.attributes?.hvac_action;return t&&"idle"!==t&&"off"!==t}return"media_player"===t?["playing","buffering"].includes(a):"vacuum"===t?["cleaning","returning"].includes(a):"alarm_control_panel"===t?a.startsWith("armed")||["arming","pending","triggered"].includes(a):"camera"!==t&&!["off","closed","locked","not_home","idle"].includes(a)}_mobileEntityColor(e,t){return"cover"===e?m("cover",t):"sensor"!==e||"temperature"!==t&&"humidity"!==t?"sensor"===e&&"power"===t?m("wattage"):m(e,t):m(t,t)}_housePowerStatisticsEntities(e,t){return e.filter(e=>["measurement","total","total_increasing"].includes(e.stateClass||"")).sort((e,t)=>t.watts-e.watts).slice(0,t).map(e=>({entity:e.entityId,name:e.name}))}_renderHousePowerStatisticsGraph(e,t){return e.length?d`
      <dwains-dashboard-next-card-host
        class="house-power-statistics-card"
        aria-label=${t}
        .hass=${this.hass}
        .config=${{type:"statistics-graph",entities:e,days_to_show:1,period:"5minute",stat_types:["mean"],chart_type:"line",hide_legend:!0,fit_y_data:!0,min_y_axis:0}}
      ></dwains-dashboard-next-card-host>
    `:c}_renderToast(){return c}_renderConfirmationDialog(){const e=this._confirmationDialog;return e?d`
      <div
        class="confirmation-dialog show"
        role="presentation"
        @click=${()=>this._resolveConfirmation(!1)}
      >
        <div
          class="confirmation-content"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="dd-confirmation-title"
          aria-describedby="dd-confirmation-message"
          tabindex="0"
          @click=${e=>e.stopPropagation()}
          @keydown=${this._handleConfirmationKeydown}
        >
          <div id="dd-confirmation-title" class="confirmation-title">${e.title}</div>
          <div id="dd-confirmation-message" class="confirmation-message">${e.message}</div>
          <div class="confirmation-actions">
            <button
              class="confirmation-button cancel"
              type="button"
              @click=${()=>this._resolveConfirmation(!1)}
            >
              ${this._t("common.cancel")}
            </button>
            <button
              class=${"confirmation-button confirm "+(e.destructive?"destructive":"")}
              type="button"
              @click=${()=>this._resolveConfirmation(!0)}
            >
              ${e.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    `:c}_getWeatherEntity(){if(this.config?.settings?.weather_entity_id){const e=this.hass.states[this.config.settings.weather_entity_id];if(e&&!this.hass.entities?.[e.entity_id]?.hidden_by)return e}return Object.values(this.hass.states).find(e=>e.entity_id.startsWith("weather.")&&!this.hass.entities?.[e.entity_id]?.hidden_by)}_getAlarmEntity(){if(!1===this.config?.settings?.show_alarm)return;const e=this.config?.settings?.alarm_entity_id;if(!e)return;const t=this.hass.states[e];return t&&!this.hass.entities?.[t.entity_id]?.hidden_by?t:void 0}_getStatusDomains(){const e="status_domains",t=this._domainCountsCache.get(e);if(t&&t.length>0&&t[0].timestamp&&Date.now()-t[0].timestamp<this._CACHE_DURATION)return t;const a=oe(this.hass,this.config),o=re(this.hass,this.config);o&&a.unshift({domain:"wattage",count:0,name:"Power usage",value:o,icon:"mdi:flash"}),a.sort((e,t)=>{const a=this._isUrgentStatus(e.domain,e.deviceClass);return a===this._isUrgentStatus(t.domain,t.deviceClass)?0:a?-1:1});const r=Date.now();return a.forEach(e=>e.timestamp=r),a.length>0&&this._domainCountsCache.set(e,a),a}_getAreaDeviceCount(e,t=[]){const a=new Set;return this.config?.devices?.forEach(t=>{t.area_id===e&&a.add(t.device_id)}),t.forEach(e=>{e.device_id&&a.add(e.device_id)}),a.size}_isEntityRegistryExcluded(e){const t=this.hass.entities?.[e];return Boolean(t?.hidden_by||t?.disabled_by||"config"===t?.entity_category||"diagnostic"===t?.entity_category)}_getAreaEntities(e){const t=this._areaEntitiesCache.get(e);if(t&&Date.now()-t.timestamp<this._CACHE_DURATION)return t.entities;const a=[],o=new Set;if(this.config?.entities){const t=new Set;this.config.devices&&this.config.devices.forEach(a=>{a.area_id===e&&t.add(a.device_id)}),this.config.entities.forEach(r=>{if(r.area_id===e||r.device_id&&t.has(r.device_id)){if(!this.hass.states[r.entity_id]||this._isEntityRegistryExcluded(r.entity_id))return;a.push(r),o.add(r.entity_id)}})}return Object.values(this.hass.states).forEach(t=>{if(!o.has(t.entity_id)&&t.attributes?.area_id===e){if(this._isEntityRegistryExcluded(t.entity_id))return;a.push({entity_id:t.entity_id,area_id:e,hidden:!1})}}),this._areaEntitiesCache.set(e,{entities:a,timestamp:Date.now()}),a}_getFilteredAreaEntities(e){let t=this._getAreaEntities(e);if(t=t.filter(e=>Boolean(this.hass.states[e.entity_id])&&!this._isEntityRegistryExcluded(e.entity_id)),this.config?.areas_options){const a=this.config.areas_options[e];if(a?.groups_options){const e=new Set;for(const t of Object.values(a.groups_options))t.hidden&&t.hidden.forEach(t=>e.add(t));t=t.filter(t=>!e.has(t.entity_id))}}return!1!==this.config?.settings?.hide_unavailable_entities&&(t=t.filter(e=>{const t=this.hass.states[e.entity_id];return t&&"unavailable"!==t.state&&"unknown"!==t.state})),t=C(this.hass,this.config,t),t}_getEditableAreaEntities(e){let t=this._getAreaEntities(e).filter(e=>Boolean(this.hass.states[e.entity_id])&&!this._isEntityRegistryExcluded(e.entity_id));return!1!==this.config?.settings?.hide_unavailable_entities&&(t=t.filter(e=>{const t=this.hass.states[e.entity_id];return t&&"unavailable"!==t.state&&"unknown"!==t.state})),C(this.hass,this.config,t)}_getUnavailableAreaEntities(e){let t=this._getAreaEntities(e);const a=[],o=[];t=t.filter(e=>!this._isEntityRegistryExcluded(e.entity_id));const r=this.config?.areas_options?.[e];if(r?.groups_options){const e=new Set;for(const t of Object.values(r.groups_options))t.hidden?.forEach(t=>e.add(t));t=t.filter(t=>!e.has(t.entity_id))}return t=C(this.hass,this.config,t),t.forEach(e=>{const t=this.hass.states[e.entity_id];t&&("unavailable"===t.state?a.push(e.entity_id):"unknown"===t.state&&o.push(e.entity_id))}),{unavailable:a,unknown:o}}_renderUnavailableEntitiesIcon(e){if(!1===this.config?.settings?.hide_unavailable_entities)return c;const t=this._getUnavailableAreaEntities(e),a=t.unavailable.length+t.unknown.length;if(0===a)return c;const o=this._t("settings.hidden_unavailable_count",{count:a});return d`
      <button
        class="dd-page-header-button is-warning"
        type="button"
        title=${o}
        aria-label=${o}
        @click=${()=>this._showUnavailableEntitiesModal(e)}
      >
        <ha-icon icon="mdi:eye-off-outline"></ha-icon>
        <span class="dd-page-header-badge" aria-hidden="true">${a}</span>
      </button>
    `}_formatAssignedAreaClimate(e,t){const a=this.hass?.areas?.[e],o="temperature"===t?a?.temperature_entity_id:a?.humidity_entity_id;if(!o)return;const r=this.hass?.states?.[o];return r&&"unavailable"!==r.state&&"unknown"!==r.state?j(this.hass,r):void 0}_withFreshAreaClimateFormatting(e,t){return{...t,temperature:this._formatAssignedAreaClimate(e,"temperature"),humidity:this._formatAssignedAreaClimate(e,"humidity")}}_getCachedAreaData(e){const t=this._areaDataCache.get(e.area_id);if(t&&Date.now()-t.timestamp<this._CACHE_DURATION)return this._withFreshAreaClimateFormatting(e.area_id,t.data);const a=this._getFilteredAreaEntities(e.area_id),o=$e(e,this.hass,a,this.config);return this._areaDataCache.set(e.area_id,{data:o,timestamp:Date.now()}),this._withFreshAreaClimateFormatting(e.area_id,o)}_getPictureContrastClass(e){if(!e)return"";const t=this._pictureContrastCache.get(e);return t?"dark"===t?"text-dark":"text-light":(this._pictureContrastCache.set(e,"pending"),this._analyzePictureContrast(e),"text-light")}async _analyzePictureContrast(e){try{const t=await this._calculatePictureTextTone(e);this._pictureContrastCache.set(e,t)}catch{this._pictureContrastCache.set(e,"light")}this.requestUpdate()}_calculatePictureTextTone(e){return new Promise((t,a)=>{const o=new Image;o.decoding="async",o.onload=()=>{try{const e=28,r=document.createElement("canvas");r.width=e,r.height=e;const i=r.getContext("2d",{willReadFrequently:!0});if(!i)return void a(new Error("Canvas context unavailable"));i.drawImage(o,0,0,e,e);const n=i.getImageData(0,0,e,e).data,s=[{x0:.1,x1:.7,y0:.2,y1:.75},{x0:.08,x1:.72,y0:.56,y1:.96},{x0:.18,x1:.82,y0:.18,y1:.82}].map(t=>{const a=Math.floor(t.x0*e),o=Math.ceil(t.x1*e),r=Math.floor(t.y0*e),i=Math.ceil(t.y1*e);let s=0,c=0;for(let t=r;t<i;t++)for(let r=a;r<o;r++){const a=4*(t*e+r),o=(n[a+3]??255)/255;s+=.2126*((n[a]??255)*o+255*(1-o))+.7152*((n[a+1]??255)*o+255*(1-o))+.0722*((n[a+2]??255)*o+255*(1-o)),c++}return c?s/c:0}),c=Math.min(...s);t(c>170?"dark":"light")}catch(e){a(e)}},o.onerror=()=>a(new Error("Image could not be loaded")),o.src=e})}_countActiveEntities(e,t){return e.filter(e=>{const a=this._getEffectiveEntityState(this.hass.states[e.entity_id]);return this._isEntityActiveForUi(a,t)}).length}_areAllEntitiesOff(e,t){return 0===this._countActiveEntities(e,t)}async _confirmDiscardSettings(){return"settings"!==this._selectedView||!this._settingsDirty||this._showConfirmation(this._t("settings.discard_title"),this._t("settings.discard_confirm"),{confirmLabel:this._t("settings.discard_action"),destructive:!0})}_clearSettingsEditState(){const e=this.renderRoot?.querySelector("dwains-dashboard-next-strategy-editor");e?._discardDeviceSettings?.(),this._pendingSettingsConfig=void 0,this._deviceSettingsDirty=!1,this._settingsDirty=!1,this._settingsSaveError="",this._settingsSavePending=!1,this._settingsEditorInitialized=!1,this._settingsPageKey="overview",this._settingsRestorePageKey="overview",this._settingsRestoreAreaId=void 0,this._settingsPageTitle="",this._settingsPageParentTitle="",this._settingsPageDescription=""}async _selectView(e){("settings"===e||await this._confirmDiscardSettings())&&(this._setSettingsHistoryState("settings"===e),this._resetAreaHeaderScrollState("area"===e),this._selectedView=e,"home"===e?(this._selectedArea=null,this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._clearSettingsEditState()):"settings"===e&&(this._selectedArea=null,this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._pendingSettingsConfig=void 0,this._deviceSettingsDirty=!1,this._settingsDirty=!1,this._settingsSaveError="",this._settingsEditorInitialized=!1,this._settingsPageKey="overview",this._settingsPageTitle="",this._settingsPageParentTitle="",this._settingsPageDescription=""),this._syncBottomNavAreaContext(),this._closeMobileNav())}async _selectArea(e){await this._confirmDiscardSettings()&&(this._setSettingsHistoryState(!1),this._resetAreaHeaderScrollState(!0),this._areaQuickPage=0,this._selectedArea=e,this._selectedView="area",this._editMode=!1,this._rememberAreaEditMode(null),this._clearSettingsEditState(),this._closeMobileNav(),this._updateUrlArea(e),this._syncBottomNavAreaContext())}_toggleHeader(){this._headerExpanded=!this._headerExpanded}_toggleMobileNav(){const e=!this._mobileNavOpen;e&&window.dispatchEvent(new CustomEvent("dwains-dashboard-next-mobile-nav-sheet",{detail:{kind:"areas"}})),this._mobileNavOpen=e}_openDeviceDomain(e){this._navigateToDeviceDomain(e);const t=e.startsWith("binary_sensor.")?e.slice(14):void 0,a={domain:e,icon:"person"===e?"mdi:account-group":t?x("binary_sensor",t):f(e),label:t?E(this.hass,t):_(this.hass,e)},o=()=>{new URL(window.location.href).searchParams.get("dd_device")===e&&(window.dispatchEvent(new CustomEvent("dwains-dashboard-next-select-device-domain",{detail:a})),window.dispatchEvent(new CustomEvent("dwains-dashboard-next-device-context-changed",{detail:a})))};o(),[120,360].forEach(e=>window.setTimeout(o,e))}_navigateToDeviceDomain(e){const t=window.location.pathname.split("/")[1]||"lovelace",a=new URLSearchParams;e&&a.set("dd_device",e);const o=a.toString();P(`/${t}/devices${o?`?${o}`:""}`)}_renderFavoritesSection(){const e=this._getEffectiveFavoriteEntities();return 0===e.length?c:d`
      <div class="favorites-section">
        <div class="favorites-header">
          <ha-icon icon="mdi:star"></ha-icon>
          <h3>${this._t("favorites.title")}</h3>
        </div>
        <div class="favorites-grid">
          ${b(e,e=>e,e=>this._renderFavoriteCard(e))}
        </div>
      </div>
    `}async _renderFavoriteTileCards(){if(!this.shadowRoot||!this.hass)return;if(!this._headerExpanded)return;const e=++this._favoritesRenderVersion,t=this.shadowRoot?.querySelectorAll("dwains-dashboard-next-tile-host.favorite-tile-wrapper");t&&t.forEach(t=>{if(!t||!t.isConnected)return;t.getAttribute("entity")&&e===this._favoritesRenderVersion&&this._headerExpanded&&(t.hass=this.hass)})}async _loadHomeAssistantSummaries(){if(!this.hass)return;const[e,t]=await Promise.all([this._fetchRepairsIssueCount(),this._fetchDiscoveredDeviceCount()]);this._repairsIssueCount!==e&&(this._repairsIssueCount=e),this._discoveredDeviceCount!==t&&(this._discoveredDeviceCount=t)}async _fetchRepairsIssueCount(){try{const e=await this.hass.callWS({type:"repairs/list_issues"});return this._extractCollection(e?.issues??e).filter(e=>!this._isSummaryItemDismissed(e)).length}catch(e){return 0}}async _fetchDiscoveredDeviceCount(){const e=["config_entries/flow/progress","config_entries/discovery_info","config_entries/discovery_info/list","config_entries/get_discovery_info"];for(const t of e)try{const e=await this.hass.callWS({type:t}),a=this._countDiscoveryItems(e);if(a>0)return a}catch(e){}return 0}_getUpdateEntityCount(){return Object.values(this.hass?.states||{}).filter(e=>e.entity_id?.startsWith("update.")&&"on"===e.state).length}_hasUpdateEntityChanges(e,t){const a=new Set([...Object.keys(e.states||{}).filter(e=>e.startsWith("update.")),...Object.keys(t.states||{}).filter(e=>e.startsWith("update."))]);for(const o of a){const a=e.states[o],r=t.states[o];if(a?.state!==r?.state)return!0}return!1}_extractCollection(e){return e?Array.isArray(e)?e:"object"==typeof e?Object.values(e):[]:[]}_isSummaryItemDismissed(e){return Boolean(e?.dismissed||e?.ignored||e?.is_ignored||"ignored"===e?.status||"dismissed"===e?.status)}_countDiscoveryItems(e){if(!e)return 0;if(Array.isArray(e))return e.filter(e=>!this._isSummaryItemDismissed(e)).length;if("object"!=typeof e)return 0;if(this._looksLikeDiscoveryItem(e))return this._isSummaryItemDismissed(e)?0:1;const t=e.discovered??e.discovery??e.flows??e.entries??e.items;return t?this._countDiscoveryItems(t):Object.values(e).reduce((e,t)=>e+this._countDiscoveryItems(t),0)}_looksLikeDiscoveryItem(e){return!(!e||"object"!=typeof e||Array.isArray(e))&&Boolean(e.flow_id||e.handler||e.source||e.context||e.integration||e.domain)}_closeMobileNav(){this._mobileNavOpen=!1}_showMoreInfo(e){xe(this,"hass-more-info",{entityId:e})}_syncSettingsEditor(){const e=this.renderRoot?.querySelector("dwains-dashboard-next-strategy-editor");if(e&&this.hass&&this.config&&(e.hass=this.hass,!this._settingsEditorInitialized)){this._settingsEditorInitialized=!0;const t=this._settingsRestorePageKey||this._settingsPageKey||"overview",a=this._settingsRestoreAreaId;e.setConfig(this.config).then(()=>{e._restoreSettingsNavigation?.(t,a)})}}async _saveSettingsPage(){if((this._pendingSettingsConfig||this._deviceSettingsDirty)&&!this._settingsSavePending&&this.hass&&this._canManageDashboard()){this._settingsSavePending=!0,this._settingsSaveError="",this._setSettingsHistoryState(!0);try{if(this._pendingSettingsConfig){const e=this._getDashboardUrlPath(),t=e?{url_path:e}:{},a=await this.hass.callWS({type:"lovelace/config",...t}),o={...a?.strategy||{},...this._pendingSettingsConfig},r={...a,strategy:o};await this.hass.callWS({type:"lovelace/config/save",...t,config:r}),this.config={...this.config,...this._pendingSettingsConfig}}const e=this.renderRoot?.querySelector("dwains-dashboard-next-strategy-editor");e?._commitDeviceSettings?.(),this._pendingSettingsConfig=void 0,this._deviceSettingsDirty=!1,this._settingsDirty=!1,this._settingsSaveError="",this._settingsEditorInitialized=!1,this.requestUpdate()}catch(e){console.error("Failed to save Dwains Dashboard settings:",e),this._settingsSaveError=this._t("error.settings_save",{error:String(e)})}finally{this._settingsSavePending=!1}}}_renderSettingsView(){const e=this._settingsDirty&&!this._settingsSavePending,t="overview"!==this._settingsPageKey,a=this._settingsPageTitle||this._t("sidebar.dashboard_settings"),o=this._settingsPageDescription||this._t("settings.subtitle"),r=this._settingsDirty?this._t("common.cancel"):this._t("common.close");return d`
      <section class="settings-page-view">
        <header class="settings-page-header">
          <button
            class="settings-page-back"
            type="button"
            title=${t?this._t("common.back"):this._t("common.close")}
            aria-label=${t?this._t("common.back"):this._t("common.close")}
            @click=${t?this._settingsBackToOverview:this._closeSettingsPage}
          >
            <ha-icon icon=${t?"mdi:arrow-left":"mdi:close"}></ha-icon>
          </button>
          <div class="settings-page-title">
            <h1>
              ${this._settingsPageParentTitle?d`<span class="settings-breadcrumb-parent">${this._settingsPageParentTitle}</span>
                    <ha-icon class="settings-breadcrumb-separator" icon="mdi:chevron-right"></ha-icon>
                    <span>${a}</span>`:a}
            </h1>
            <p>${o}</p>
          </div>
          <div class="settings-page-actions">
            <button type="button" class="settings-secondary" @click=${this._settingsSecondaryAction}>
              ${r}
            </button>
            <button
              type="button"
              class="settings-primary"
              ?disabled=${!e}
              @click=${this._saveSettingsPage}
            >
              ${this._settingsSavePending?this._t("common.saving"):this._t("common.save")}
            </button>
          </div>
        </header>
        ${this._settingsSaveError?d`<div class="settings-save-error">${this._settingsSaveError}</div>`:c}
        <div
          class="settings-page-editor"
          @config-changed=${this._handleSettingsConfigChanged}
          @dwains-dashboard-next-device-settings-changed=${this._handleDeviceSettingsChanged}
          @dd-settings-page-changed=${this._handleSettingsPageChanged}
        >
          <dwains-dashboard-next-strategy-editor .inlineBackNavigation=${!1}></dwains-dashboard-next-strategy-editor>
        </div>
        <div class="settings-page-bottom-actions">
          <button type="button" class="settings-secondary" @click=${this._settingsSecondaryAction}>
            ${r}
          </button>
          <button
            type="button"
            class="settings-primary"
            ?disabled=${!e}
            @click=${this._saveSettingsPage}
          >
            ${this._settingsSavePending?this._t("common.saving"):this._t("common.save")}
          </button>
        </div>
      </section>
    `}_getWelcomeUserPicture(e){const t=e.trim().toLowerCase(),a=Object.values(this.hass?.states||{}).filter(e=>e.entity_id?.startsWith("person.")),o=a.find(e=>String(e.attributes?.friendly_name||"").trim().toLowerCase()===t),r=a.find(e=>e.attributes?.entity_picture);return(o||r)?.attributes?.entity_picture}async _loadPersistentNotifications(e=!0){if(this.hass&&this._showNotificationsUi()){this._notificationsLoading=!0,e&&(this._notificationsError="");try{const e=await this.hass.callWS({type:"persistent_notification/get"});this._persistentNotifications=this._sortPersistentNotifications(this._normalizePersistentNotifications(e)),this._notificationsError=""}catch(t){(e||this._notificationsOpen)&&(console.error("Failed to load persistent notifications:",t),this._notificationsError=this._t("error.notifications_load"))}finally{this._notificationsLoading=!1}}}async _ensurePersistentNotificationsSubscription(){if(!this._showNotificationsUi()||this._persistentNotificationsUnsub||!this.hass)return;const e=this.hass.connection;if(e?.subscribeMessage)try{const t=await e.subscribeMessage(e=>this._handlePersistentNotificationEvent(e),{type:"persistent_notification/subscribe"});"function"==typeof t&&(this._persistentNotificationsUnsub=()=>{t()})}catch(e){console.warn("Persistent notification subscription unavailable:",e)}}_handlePersistentNotificationEvent(e){if(!this._showNotificationsUi())return;const t=e?.type,a=this._normalizePersistentNotifications(e?.notifications);if("current"===t)return this._persistentNotifications=this._sortPersistentNotifications(a),void(this._notificationsError="");if("removed"===t){const e=new Set(a.map(e=>e.notification_id));return void(this._persistentNotifications=this._persistentNotifications.filter(t=>!e.has(t.notification_id)))}if("added"===t||"updated"===t){const e=new Map(this._persistentNotifications.map(e=>[e.notification_id,e]));a.forEach(t=>e.set(t.notification_id,t)),this._persistentNotifications=this._sortPersistentNotifications([...e.values()])}}_normalizePersistentNotifications(e){return(Array.isArray(e)?e:Object.values(e||{})).map(e=>({notification_id:String(e?.notification_id||""),title:e?.title||null,message:String(e?.message||""),created_at:e?.created_at?String(e.created_at):void 0})).filter(e=>e.notification_id)}_sortPersistentNotifications(e){return[...e].sort((e,t)=>(t.created_at?Date.parse(t.created_at):0)-(e.created_at?Date.parse(e.created_at):0))}_formatNotificationDate(e){const t=Date.parse(e);return Number.isFinite(t)?new Date(t).toLocaleString(this.hass?.language||void 0,{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):e}_handleStatusCardClick(e){"person"===e.domain?this._showPersonEntities():"wattage"===e.domain?this._showWattageEntities():this._showHouseStatusEntities(e)}_houseInfoDeviceViewLabel(){return String(this.hass?.language||"").toLowerCase().startsWith("de")?"Geräteansicht öffnen":"Open device view"}_houseInfoEnergyViewLabel(){return String(this.hass?.language||"").toLowerCase().startsWith("de")?"Energiesensoren anzeigen":"View energy sensors"}_showHouseStatusEntities(e){const t=e.entities||[];t.length?Xe(this,{domain:e.domain,config:this.config,deviceClass:e.deviceClass,entityIds:t,customTitle:e.name,homeInformation:!0,homeInformationPresentation:"devices",deviceViewKey:this._statusDeviceDomainKey(e),viewAllLabel:this._houseInfoDeviceViewLabel(),onViewAll:()=>this._openDeviceDomain(this._statusDeviceDomainKey(e))}):this._openDeviceDomain(this._statusDeviceDomainKey(e))}_statusDeviceDomainKey(e){if("cover"===e.domain){if("shading"===e.statusKind)return"cover_shading";if("gate"===e.statusKind)return"cover_gates";if("window"===e.statusKind||"door"===e.statusKind)return"cover_openings"}return e.deviceClass?`${e.domain}.${e.deviceClass}`:e.domain}_showPersonEntities(){Xe(this,{domain:"person",config:this.config,entityIds:this._getVisiblePersonEntities().map(e=>e.entity_id),customTitle:this._t("home.people"),homeInformation:!0,homeInformationPresentation:"devices",deviceViewKey:"person",viewAllLabel:this._houseInfoDeviceViewLabel(),onViewAll:()=>this._openDeviceDomain("person")})}_showWattageEntities(){Xe(this,{domain:"sensor",config:this.config,filterByUnitOfMeasurement:"W"})}_handleLightToggle(e,t){e.stopPropagation(),this._toggleAreaLights(t)}_shouldUpdateEntities(e,t){const a=["light","switch","climate","media_player","camera","cover","lock","binary_sensor","person","sensor","fan"];return Object.keys(t.states).some(o=>{const r=o.split(".")[0];if(!r||!a.includes(r))return!1;const i=e.states[o],n=t.states[o];return i?.state!==n?.state||i?.attributes!==n?.attributes})}_updateEntityCards(e,t){this.shadowRoot&&this.shadowRoot.querySelectorAll("dwains-dashboard-next-card-host, dwains-dashboard-next-tile-host, hui-card, hui-tile-card, hui-entity-card, hui-thermostat-card, hui-picture-entity-card, hui-media-control-card").forEach(e=>{e.hass!==t&&(e.hass=t)})}_clearEntityCardsCache(){this._areaDataCache.clear(),this._domainCountsCache.clear(),ke.clear()}_invalidateChangedAreaCaches(e,t){const a=new Set;let o=!1;for(const r of this.config?.entities||[]){const i=r.entity_id,n=e.states[i],s=t.states[i];n!==s&&(n?.state===s?.state&&n?.attributes===s?.attributes||(o=!0,r.area_id&&a.add(r.area_id)))}o&&this._domainCountsCache.clear(),a.forEach(e=>{this._areaDataCache.delete(e),(e=>{ke.delete(e)})(e)})}_showUnavailableEntitiesModal(e){const t=this._getUnavailableAreaEntities(e),a=[...t.unavailable,...t.unknown];Xe(this,{domain:"unavailable",areaId:e,config:this.config,customTitle:this._t("settings.hidden_unavailable_title"),customEntities:a,customDescription:this._t("settings.hidden_unavailable_description"),viewAllLabel:this._houseInfoDeviceViewLabel(),onViewAll:()=>this._navigateToDeviceDomain("__maintenance__")})}_areaThermostatEntityId(e){if(!1!==this.config?.settings?.show_area_thermostat)return function(e,t){let a;for(const t of e)if(t.startsWith("climate.")){if(a)return;a=t}if(!a)return;const o=t[a];return o&&!Ae.has(String(o.state))?a:void 0}(e.map(e=>e.entity_id),this.hass.states)}async _toggleAreaLights(e){const t=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("light."));if(0===t.length)return;const a=this._areAllEntitiesOff(t,"light");if(!await this._confirmMasterActionIfNeeded("light",a,t.length,e))return;const o=a?"turn_on":"turn_off",r=t.map(e=>e.entity_id);this._setOptimisticEntityStates(r,a?"on":"off");try{await this.hass.callService("light",o,{entity_id:r}),this._showToast(this._t(a?"action.all_lights_on":"action.all_lights_off"))}catch(t){this._clearOptimisticEntityStates(r),console.warn(`Failed to toggle lights in area ${e}:`,t),this._showToast(this._t("entity.lights_failed"))}}_resolveConfirmation(e){const t=this._confirmationResolve;this._confirmationResolve=void 0,this._confirmationDialog=null,t?.(e)}_showConfirmation(e,t,a={}){return this._confirmationResolve&&this._resolveConfirmation(!1),new Promise(o=>{this._confirmationResolve=o,this._confirmationDialog={title:e,message:t,confirmLabel:a.confirmLabel||e,destructive:!0===a.destructive},this.updateComplete.then(()=>{this.shadowRoot?.querySelector(".confirmation-content")?.focus()})})}_showToast(e){console.log("Toast:",e)}};st.styles=[i`
    dwains-dashboard-next-now-playing.inline{
      display: block;
      margin: 0 0 18px;
    }
    .room-header dwains-dashboard-next-area-thermostat{
      flex: 0 0 auto;
      min-width: 0;
      max-width: 100%;
    }
    @media (max-width: 768px) {
      dwains-dashboard-next-now-playing.floating{
        position: fixed;
        left: max(12px, env(safe-area-inset-left, 0px));
        right: max(12px, env(safe-area-inset-right, 0px));
        bottom: calc(76px + env(safe-area-inset-bottom, 0px));
        z-index: 140;
        max-width: 560px;
        margin: 0 auto;
      }
      .layout-container.has-floating-now-playing .home-view,
.layout-container.has-floating-now-playing .content-area.area-content-area{
        padding-bottom: calc(190px + env(safe-area-inset-bottom, 0px));
      }
      .room-header dwains-dashboard-next-area-thermostat{
        width: 100%;
        min-width: 0;
        flex-basis: 100%;
      }
    }
    :host{
      display: block;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      /*background: var(--primary-background-color);*/
      color: var(--primary-text-color);
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }

    button,
.area-button,
.home-status-card,
.status-card-compact,
.mobile-area-card,
.house-person-mini,
.person-card,
.favorite-card-wrapper,
.favorite-quick-action,
.mobile-domain-master,
.mobile-layout-toggle,
.mobile-entity-card,
.mobile-entity-action,
.mobile-cover-action,
.mobile-entity-toggle,
.area-badge,
.area-quick-control,
.dd-edit-toggle,
.unavailable-entities-icon,
.dd-add-card,
.dd-custom-card-wrap.editing{
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .dd-static-icon{
      width: 20px;
      height: 20px;
      display: block;
      flex: 0 0 auto;
      fill: currentColor;
      pointer-events: none;
    }

    .mobile-area-card,
.home-camera-card,
.home-summary-card,
.home-status-card,
.favorite-card-wrapper{
      contain: layout style paint;
    }

    .home-camera-section,
.home-status-section,
.home-todos-section,
.home-custom-cards-section,
.home-summaries-section,
.mobile-domain-group{
      content-visibility: auto;
      contain-intrinsic-size: 1px 360px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-tile-host{
      content-visibility: auto;
      contain-intrinsic-size: 164px 150px;
    }

    :host{
      display: block;
      height: calc(100dvh - var(--header-height, 56px));
      min-height: 0;
      overflow: hidden;
    }

    /* Layout Container */
    .layout-container{
      --area-sidebar-width: 250px;
      display: flex;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      position: relative;
      overflow: hidden;
    }

    .layout-container.sidebar-resizing,
.layout-container.sidebar-resizing *{
      cursor: col-resize !important;
      user-select: none !important;
      -webkit-user-select: none !important;
    }

    .layout-container.sidebar-collapsed .sidebar{
      width: 0;
      flex-basis: 0;
      border-right: 0;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-16px);
    }

    .layout-container.sidebar-collapsed .main-content{
      min-width: 0;
    }

    /* Sidebar Styles */
    .sidebar{
      width: var(--area-sidebar-width);
      flex: 0 0 var(--area-sidebar-width);
      background: var(--card-background-color);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, width 0.16s ease, flex-basis 0.16s ease;
      z-index: 1;
      min-height: 0;
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      scrollbar-gutter: stable;
      -webkit-overflow-scrolling: touch;
    }

    .layout-container.sidebar-resizing .sidebar{
      transition: none;
    }

    .sidebar-resize-handle{
      flex: 0 0 10px;
      width: 10px;
      align-self: stretch;
      margin-left: -5px;
      margin-right: -5px;
      position: relative;
      z-index: 4;
      border: 0;
      padding: 0;
      background: transparent;
      cursor: col-resize;
      touch-action: none;
    }

    .sidebar-resize-handle::before{
      content: '';
      position: absolute;
      top: 14px;
      bottom: 14px;
      left: 4px;
      width: 2px;
      border-radius: 999px;
      background: transparent;
      transition: background 0.16s ease, box-shadow 0.16s ease;
    }

    .sidebar-resize-handle:hover::before,
.sidebar-resize-handle:focus-visible::before,
.layout-container.sidebar-resizing .sidebar-resize-handle::before{
      background: var(--primary-color);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .sidebar-resize-handle:focus-visible{
      outline: none;
    }

    .sidebar-collapse-toggle{
      position: absolute;
      top: 50%;
      left: calc(var(--area-sidebar-width) - 17px);
      z-index: 6;
      width: 34px;
      height: 54px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in srgb, var(--divider-color) 80%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 96%, transparent);
      color: var(--primary-text-color);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.56);
      cursor: pointer;
      transform: translateY(-50%);
      transition:
        top 0.16s ease,
        left 0.16s ease,
        transform 0.16s ease,
        background-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .sidebar-collapse-toggle:hover{
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.62);
    }

    .sidebar-collapse-toggle:focus-visible{
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .sidebar-collapse-toggle ha-icon{
      --mdc-icon-size: 18px;
    }

    .sidebar-collapse-toggle.is-collapsed{
      left: 0;
      top: 50%;
      width: 34px;
      min-width: 34px;
      height: 54px;
      padding: 0;
      border-left: 0;
      border-radius: 0 999px 999px 0;
      background: color-mix(in srgb, var(--card-background-color) 98%, transparent);
      transform: translateY(-50%);
      box-shadow:
        0 12px 28px rgba(15, 23, 42, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.56);
    }

    .sidebar-collapse-label{
      display: none;
      font-size: 13px;
      font-weight: 850;
      line-height: 1;
    }

    .sidebar-collapse-toggle.is-collapsed .sidebar-collapse-label{
      display: inline;
    }

    /* Main Content */
    .main-content{
      flex: 1;
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Global Header */
    .global-header{
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 16px;
      position: sticky;
      top: 0;
      z-index: 1;
      transition: all 0.3s ease;
    }

    .global-header.compact{
      padding: 8px 16px;
    }

    .header-content{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* Time and Weather Section (right side) */
    .header-time-weather{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      min-width: 120px;
    }

    .header-time-section{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      line-height: 0.8;
    }

    .header-time{
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
      line-height: 1.2;
    }

    .header-date{
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 500;
    }

    /* Weather Display */
    .weather-compact{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      background: var(--secondary-background-color);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .weather-compact:hover{
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateY(-1px);
    }

    .weather-icon-compact ha-icon{
      --mdc-icon-size: 24px;
    }

    .weather-temp-compact{
      font-size: 14px;
      font-weight: 500;
    }

    /* Status Cards Section */
    .header-status-section{
      flex: 1;
      overflow: hidden;
    }

    .header-status-scroll{
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .header-status-scroll::-webkit-scrollbar{
      display: none;
    }

    /* Status Card Compact */
    .status-card-compact{
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 60px;
      position: relative;
    }

    .status-card-compact:hover{
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .status-card-icon-compact{
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }

    .status-card-icon-compact ha-icon{
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .status-card-badge-compact{
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    .status-card-title-compact{
      font-size: 11px;
      margin-top: 4px;
      opacity: 0.8;
    }

    /* Domain-specific status card colors */
    .status-card-compact.light .status-card-icon-compact{
      background: color-mix(in srgb, var(--status-color, ${l(m("light"))}) 15%, transparent);
    }

    .status-card-compact.light ha-icon{
      color: var(--status-color, ${l(m("light"))});
    }

    .status-card-compact.switch .status-card-icon-compact{
      background: color-mix(in srgb, var(--status-color, ${l(m("switch"))}) 15%, transparent);
    }

    .status-card-compact.switch ha-icon{
      color: var(--status-color, ${l(m("switch"))});
    }

    .status-card-compact.binary_sensor .status-card-icon-compact{
      background: color-mix(in srgb, var(--status-color, ${l(m("sensor"))}) 15%, transparent);
    }

    .status-card-compact.binary_sensor ha-icon{
      color: var(--status-color, ${l(m("sensor"))});
    }

    .status-card-compact.person .status-card-icon-compact{
      background: color-mix(in srgb, var(--status-color, ${l(m("sensor"))}) 15%, transparent);
    }

    .status-card-compact.person ha-icon{
      color: var(--status-color, ${l(m("sensor"))});
    }

    .status-card-compact.wattage .status-card-icon-compact{
      background: color-mix(in srgb, var(--status-color, ${l(m("energy"))}) 15%, transparent);
    }

    .status-card-compact.wattage ha-icon{
      color: var(--status-color, ${l(m("energy"))});
    }

    /* Header Expand Button */
    .header-expand-button{
      position: absolute;
      bottom: -28px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 5;
    }

    .header-expand-button:hover{
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .header-expand-button[data-extra-count]::after{
      content: attr(data-extra-count);
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: bold;
      min-width: 18px;
      text-align: center;
    }

    /* Area List */
    .area-list{
      padding: 8px;
    }

    /* Floor Sections */
    .floor-section{
      margin-bottom: 16px;
    }

    .floor-header{
      padding: 8px 16px;
      margin-bottom: 8px;
    }

    .floor-header h3{
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .floor-areas{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(178px, 1fr));
      gap: 8px;
    }

    .area-button{
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      margin-bottom: 0;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--secondary-background-color);
      border: none;
      width: 100%;
      height: 125px;
      text-align: left;
      color: var(--primary-text-color);
      position: relative;
      min-width: 0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .area-button:hover{
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .area-button.selected{
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    /* Home button specific styling */
    .area-button.home-button{
      height: 60px;
    }

    /* Background image styles */
    .area-button.has-picture{
      position: relative;
      background: var(--secondary-background-color);
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-button.has-picture.text-dark{
      --area-picture-text-color: #ffffff;
      --area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --area-picture-overlay:
        linear-gradient(90deg, rgba(11, 17, 28, 0.76) 0%, rgba(11, 17, 28, 0.38) 54%, rgba(11, 17, 28, 0.08) 100%),
        linear-gradient(180deg, rgba(11, 17, 28, 0.04), rgba(11, 17, 28, 0.34));
    }

    .area-background{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .area-button.has-picture:hover .area-background{
      opacity: 0.8;
    }

    /* Area content structure */
    .area-content{
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      height: 100%;
      justify-content: space-between;
    }

    .area-top-section{
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
    }

    .area-bottom-section{
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      gap: 8px;
      margin-bottom: 4px;
    }

    /* Enhanced text styling for picture backgrounds */
    .area-button.has-picture .area-name,
.area-button.has-picture .area-sensors{
      text-shadow: var(--area-picture-text-shadow);
      color: var(--area-picture-text-color);
    }

    /* Area main icon in sidebar - override home view styling */
    .sidebar .area-main-icon{
      position: absolute;
      left: -25px;
      bottom: -25px;
      width: 65px;
      height: 65px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-color) 60%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-main-icon{
      background: rgba(255,255,255,0.2);
    }

    .sidebar .area-main-icon ha-icon{
      --mdc-icon-size: 40px;
      color: var(--primary-color);
    }

    /* Info badges container */
    .area-info-badges{
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      align-items: center;
    }

    /* Legacy area-icon styles (still used for simple buttons) */
    .area-icon{
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--secondary-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .area-button.selected .area-icon{
      background: rgba(255,255,255,0.2);
    }

    /* Legacy area-info styles (still used for simple buttons) */
    .area-info{
      flex: 1;
    }

    .area-menu-chevron{
      display: none;
    }

    .home-notification-shortcut{
      box-sizing: border-box;
      position: relative;
      z-index: 2;
      min-width: 42px;
      height: 28px;
      margin-left: auto;
      padding: 0 7px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      flex-shrink: 0;
      cursor: pointer;
      color: #dc2626;
      background: color-mix(in srgb, #ef4444 12%, var(--card-background-color));
      box-shadow:
        inset 0 0 0 1px rgba(220, 38, 38, 0.08),
        0 6px 14px rgba(220, 38, 38, 0.1);
    }

    .home-notification-shortcut ha-icon{
      --mdc-icon-size: 15px;
    }

    .home-notification-count{
      min-width: 0;
      height: auto;
      padding: 0;
      border-radius: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: inherit;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
    }

    .area-name{
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 2px;
    }

    .area-sensors{
      font-size: 13px;
      opacity: 0.8;
      font-weight: 500;
    }

    /* Legacy area-alerts styles (still used for simple buttons without badges) */
    .area-alerts{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--error-color);
      color: var(--text-primary-color);
      font-size: 11px;
      font-weight: bold;
      flex-shrink: 0;
    }

    /* Content Area */
    .content-area{
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      overflow-anchor: none;
      overscroll-behavior: auto;
      -webkit-overflow-scrolling: touch;
      padding: 16px;
    }

    .content-area.settings-content-area{
      padding: 0;
      background:
        linear-gradient(180deg,
          color-mix(in srgb, var(--primary-color) 4%, transparent) 0,
          transparent 220px),
        var(--primary-background-color);
    }

    .settings-page-view{
      width: min(1180px, calc(100% - 32px));
      min-height: 100%;
      margin: 0 auto;
      padding: 18px 0 104px;
      box-sizing: border-box;
    }

    .settings-page-header{
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      margin: 0 0 16px;
      padding: 16px 18px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 18px;
      background:
        linear-gradient(135deg,
          color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color)) 0%,
          color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color)) 100%);
      box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
    }

    .settings-page-back,
.settings-secondary,
.settings-primary{
      appearance: none;
      border: 0;
      font: inherit;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .settings-page-back{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      color: var(--primary-text-color);
    }

    .settings-page-back ha-icon{
      --mdc-icon-size: 22px;
    }

    .settings-page-title{
      min-width: 0;
    }

    .settings-page-title h1{
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      font-size: clamp(22px, 2vw, 30px);
      line-height: 1.08;
      font-weight: 850;
      color: var(--primary-text-color);
      letter-spacing: 0;
    }
    .settings-breadcrumb-parent{
      color: var(--secondary-text-color);
      font-weight: 700;
    }
    .settings-breadcrumb-separator{
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }

    .settings-page-title p{
      margin: 5px 0 0;
      color: var(--secondary-text-color);
      font-size: 14px;
      line-height: 1.35;
    }

    .settings-page-actions,
.settings-page-bottom-actions{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    }

    .settings-secondary,
.settings-primary{
      min-height: 40px;
      padding: 0 18px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
    }

    .settings-secondary{
      background: transparent;
      color: var(--primary-color);
    }

    .settings-primary{
      background: var(--primary-color);
      color: var(--text-primary-color);
      box-shadow: 0 10px 24px color-mix(in srgb, var(--primary-color) 24%, transparent);
    }

    .settings-primary:disabled{
      opacity: 0.45;
      cursor: default;
      box-shadow: none;
    }

    .settings-save-error{
      margin: 0 0 14px;
      padding: 12px 14px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--error-color) 12%, var(--card-background-color));
      color: var(--error-color);
      font-weight: 750;
      font-size: 13px;
    }

    .settings-page-editor{
      overflow: hidden;
      border-radius: 18px;
      background: var(--card-background-color);
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      box-shadow: 0 16px 46px rgba(15, 23, 42, 0.08);
    }

    .settings-page-editor dwains-dashboard-next-strategy-editor{
      display: block;
    }

    .settings-page-bottom-actions{
      display: none;
    }

    /* Ruimte voor de mobiele onderbalk */
    @media (max-width: 768px) {
      .content-area{
        padding-bottom: calc(104px + env(safe-area-inset-bottom, 0px));
      }
    }

    /* Home View */
    .home-view{
      max-width: 1600px;
      margin: 0 auto;
      padding: 0px; /*24px;*/
    }

    /* Home Welcome */
    .home-welcome{
      text-align: left;
      margin-bottom: 28px;
      padding: 0;
      background: color-mix(in srgb, var(--card-background-color) 97%, var(--primary-background-color));
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 8px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
    }

    .welcome-content{
      margin: 0 auto;
      padding: 18px 22px;
    }

    .welcome-header{
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 18px;
      margin-bottom: 0;
    }

    .welcome-header-meta{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 14px;
      min-width: 0;
    }

    .welcome-user{
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .welcome-avatar{
      border: 0;
      padding: 0;
      display: inline-flex;
      width: 52px;
      height: 52px;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      appearance: none;
      -webkit-appearance: none;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      border-radius: 999px;
      cursor: pointer;
      box-shadow:
        0 10px 22px rgba(15, 23, 42, 0.1),
        0 0 0 3px rgba(255, 255, 255, 0.72);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .welcome-avatar:hover{
      transform: translateY(-1px);
    }

    .welcome-avatar:focus-visible{
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .welcome-avatar ha-icon{
      --mdc-icon-size: 26px;
    }

    .welcome-avatar img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .welcome-copy{
      min-width: 0;
    }

    .welcome-text{
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .welcome-greeting{
      font-size: 22px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }

    .welcome-name{
      font-size: 28px;
      font-weight: 750;
      color: var(--primary-text-color);
    }

    .welcome-title{
      display: none;
    }

    .welcome-return{
      display: block;
      margin-top: 5px;
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 650;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .welcome-actions{
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .welcome-action{
      position: relative;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 999px;
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
      -webkit-tap-highlight-color: transparent;
    }

    .welcome-action:hover{
      background: color-mix(in srgb, var(--primary-color) 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .welcome-notification-action{
      width: 44px;
      padding: 0 4px;
      border: 0;
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      height: 44px;
      border-radius: 999px;
      color: var(--secondary-text-color);
      background: transparent;
      box-shadow: none;
    }

    .welcome-notification-action:hover{
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 7%, transparent);
      box-shadow: none;
    }

    .welcome-notification-action .welcome-action-badge{
      top: -1px;
      right: -3px;
    }

    .welcome-settings-action{
      margin-left: 2px;
    }

    .welcome-action ha-icon{
      --mdc-icon-size: 22px;
    }

    .welcome-action:active{
      transform: scale(0.96);
    }

    .welcome-action-badge{
      position: absolute;
      top: -2px;
      right: -2px;
      min-width: 17px;
      height: 17px;
      padding: 0 5px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--error-color);
      color: #fff;
      font-size: 10px;
      font-weight: 850;
      line-height: 1;
      box-shadow: 0 0 0 2px var(--card-background-color);
    }

    .welcome-time-section{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0px;
      min-width: 112px;
      line-height: 1.1;
    }

    .welcome-time{
      font-size: 34px;
      font-weight: 800;
      color: var(--primary-text-color);
      font-family: 'Roboto Mono', monospace;
    }

    .welcome-date{
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      color: var(--secondary-text-color);
      font-weight: 650;
    }

    .welcome-subheader{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      margin-top: 14px;
    }

    .welcome-alarm{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-alarm.alarm-armed{
      background: ${l(m("lock"))};
      color: #ffffff;
    }

    .welcome-alarm.alarm-unknown{
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .welcome-alarm.alarm-disarmed{
      background: var(--success-color);
      color: var(--text-primary-color);
    }

    .welcome-alarm.alarm-triggered{
      background: var(--error-color);
      color: var(--text-primary-color);
      animation: pulse 2s infinite;
    }

    .welcome-alarm:hover{
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-alarm ha-icon{
      --mdc-icon-size: 18px;
    }

    .alarm-text{
      font-size: 14px;
      font-weight: 600;
    }

    @keyframes pulse {
      0%{ opacity: 1; }
      50%{ opacity: 0.7; }
      100%{ opacity: 1; }
    }

    .welcome-weather{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color));
      color: var(--primary-color);
      border-radius: 20px;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent);
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .welcome-weather .weather-temp{
      color: var(--primary-text-color);
    }

    .welcome-weather:hover{
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .welcome-weather ha-icon{
      --mdc-icon-size: 20px;
    }

    .weather-temp{
      font-size: 16px;
      font-weight: 600;
    }

    .weather-label{
      font-size: 12px;
      font-weight: 750;
      line-height: 1;
      opacity: 0.82;
      text-transform: uppercase;
      letter-spacing: 0;
    }

    /* Mobile Responsive Design */
    @media (max-width: 768px) {
      .home-welcome{
        text-align: left;
        margin: -10px -10px 16px;
        padding: calc(18px + env(safe-area-inset-top, 0px)) 20px 16px;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 96%, var(--primary-color)) 0%,
            color-mix(in srgb, var(--card-background-color) 92%, var(--primary-background-color)) 100%);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
      }

      .welcome-content{
        padding: 0;
      }

      .welcome-header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 0;
      }

      .welcome-user{
        gap: 10px;
        flex: 1 1 auto;
      }

      .welcome-avatar{
        display: inline-flex;
        width: 38px;
        height: 38px;
        border-radius: 999px;
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.1),
          0 0 0 3px rgba(255, 255, 255, 0.72);
      }

      .welcome-avatar ha-icon{
        --mdc-icon-size: 21px;
      }

      .welcome-text{
        display: block;
      }

      .welcome-greeting,
.welcome-name{
        display: none;
      }

      .welcome-title{
        display: block;
        color: var(--primary-text-color);
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .welcome-return{
        display: block;
        margin-top: 3px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 600;
        line-height: 1.1;
      }

      .welcome-time-section{
        display: none;
      }

      .welcome-actions{
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 0 0 auto;
      }

      .welcome-action:not(.welcome-notification-action){
        width: 42px;
        height: 42px;
        border-radius: 999px;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--card-background-color) 86%, var(--primary-background-color));
        box-shadow:
          0 8px 20px color-mix(in srgb, var(--primary-text-color) 10%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }

      .welcome-action ha-icon{
        --mdc-icon-size: 21px;
      }

      .welcome-subheader{
        justify-content: flex-start;
        gap: 8px;
        margin-top: 16px;
        overflow: visible;
        flex-wrap: wrap;
        padding: 12px 12px 24px;
        margin-inline: -12px;
        margin-bottom: -22px;
        scrollbar-width: none;
      }

      .welcome-subheader::-webkit-scrollbar{
        display: none;
      }

      .welcome-alarm,
.welcome-weather{
        min-width: auto;
        height: 42px;
        padding: 0 14px;
        justify-content: center;
        border-radius: 999px;
        flex: 0 0 auto;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .alarm-text,
.weather-temp{
        font-size: 15px;
      }

      .weather-label{
        font-size: 11px;
      }
    }

    @media (max-width: 480px) {
      .home-welcome{
        padding: calc(16px + env(safe-area-inset-top, 0px)) 18px 14px;
        margin-bottom: 14px;
      }

      .welcome-header{
        gap: 10px;
      }

      .welcome-avatar{
        width: 36px;
        height: 36px;
      }

      .welcome-title{
        font-size: 14px;
      }

      .welcome-return{
        font-size: 11px;
      }

      .welcome-action{
        width: 40px;
        height: 40px;
      }

      .welcome-alarm,
.welcome-weather{
        height: 40px;
        padding: 0 13px;
        font-size: 14px;
      }

      .alarm-text,
.weather-temp{
        font-size: 14px;
      }

      .weather-label{
        font-size: 10px;
      }
    }

    /* Home Status Cards */
    .home-status-section{
      margin-bottom: 48px;
    }

    .home-status-heading{
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 14px;
      color: var(--primary-text-color);
      font-size: 20px;
      font-weight: 850;
      line-height: 1.1;
    }

    .home-status-heading ha-icon{
      --mdc-icon-size: 20px;
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .home-camera-section{
      margin-bottom: 36px;
    }

    .home-camera-section .home-status-heading ha-icon{
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #ef4444 8%, transparent);
    }

    .home-camera-section .mobile-layout-toggle{
      color: #ef4444;
      background: color-mix(in srgb, #ef4444 12%, var(--card-background-color));
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, #ef4444 8%, transparent);
    }

    .home-summaries-section{
      margin-bottom: 36px;
    }

    .home-summaries-section .home-status-heading ha-icon{
      color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 13%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
    }

    .home-summaries-section .mobile-layout-toggle.active{
      color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 13%, var(--card-background-color));
      box-shadow:
        0 8px 18px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
    }

    .home-todos-section{
      margin-bottom: 36px;
    }

    .home-todos-section .home-status-heading ha-icon{
      color: #7c3aed;
      background: color-mix(in srgb, #7c3aed 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #7c3aed 8%, transparent);
    }

    .home-todos-grid{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      align-items: start;
      gap: 12px;
    }

    .home-todo-card,
.home-todo-card dwains-dashboard-next-card-host{
      display: block;
      min-width: 0;
    }

    .home-custom-cards-section{
      margin-bottom: 36px;
    }

    .home-custom-cards-section .home-status-heading ha-icon{
      color: #0ea5a8;
      background: color-mix(in srgb, #0ea5a8 12%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, #0ea5a8 20%, transparent);
    }

    .home-custom-cards-grid{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
      align-items: start;
      gap: 12px;
    }

    .home-custom-card,
.home-custom-card dwains-dashboard-next-card-host{
      display: block;
      min-width: 0;
    }

    .home-summary-list{
      width: min(100%, 980px);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .home-summary-card{
      appearance: none;
      width: 100%;
      min-height: 68px;
      padding: 12px 14px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 13px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
      border-radius: 10px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 8px 20px color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      transition:
        transform 0.16s ease,
        border-color 0.16s ease,
        box-shadow 0.16s ease;
    }

    .home-summary-card:hover{
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--summary-color) 35%, transparent);
      box-shadow: 0 12px 26px color-mix(in srgb, var(--summary-color) 13%, transparent);
    }

    .home-summary-card:active{
      transform: scale(0.992);
    }

    .home-summary-card:focus-visible{
      outline: 2px solid color-mix(in srgb, var(--summary-color) 70%, #ffffff);
      outline-offset: 2px;
    }

    .home-summary-icon{
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      color: var(--summary-color);
      background: color-mix(in srgb, var(--summary-color) 14%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-icon ha-icon{
      --mdc-icon-size: 21px;
    }

    .home-summary-copy{
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .home-summary-title{
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 850;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-subtitle{
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-summary-chevron{
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 48%, transparent);
      flex: 0 0 auto;
    }

    .home-summary-chevron ha-icon{
      --mdc-icon-size: 20px;
    }

    .home-camera-grid{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
    }

    .home-camera-card{
      position: relative;
      min-height: 168px;
      overflow: hidden;
      border: 0;
      border-radius: 12px;
      display: flex;
      align-items: stretch;
      padding: 0;
      background: color-mix(in srgb, var(--primary-text-color) 12%, var(--card-background-color));
      color: #ffffff;
      cursor: pointer;
      text-align: left;
      box-shadow:
        0 16px 32px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .home-camera-card:hover{
      transform: translateY(-2px);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.16);
    }

    .home-camera-card:focus-visible{
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .home-camera-image,
.home-camera-placeholder{
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .home-camera-placeholder{
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at 20% 20%, rgba(var(--rgb-primary-color, 3, 169, 244), 0.28), transparent 34%),
        linear-gradient(135deg, #192133, #0f172a);
    }

    .home-camera-placeholder ha-icon{
      --mdc-icon-size: 44px;
      color: rgba(255, 255, 255, 0.58);
    }

    .home-camera-card::after{
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 52%;
      background:
        linear-gradient(180deg,
          rgba(7, 11, 18, 0) 0%,
          rgba(7, 11, 18, 0.34) 42%,
          rgba(7, 11, 18, 0.84) 100%);
      pointer-events: none;
    }

    .home-camera-content{
      position: relative;
      z-index: 1;
      width: 100%;
      min-height: 168px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .home-camera-top{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

    .home-camera-area-icon,
.home-camera-count{
      min-width: 36px;
      height: 36px;
      border-radius: 11px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      backdrop-filter: blur(12px);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.12);
    }

    .home-camera-area-icon ha-icon{
      --mdc-icon-size: 20px;
    }

    .home-camera-count{
      min-width: 44px;
      padding: 0 10px;
      gap: 5px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 850;
    }

    .home-camera-count ha-icon{
      --mdc-icon-size: 14px;
    }

    .home-camera-copy{
      min-width: 0;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.62);
    }

    .home-camera-name{
      font-size: 18px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .home-camera-meta{
      margin-top: 5px;
      color: rgba(255, 255, 255, 0.76);
      font-size: 12px;
      font-weight: 720;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-home-section,
.mobile-section-heading{
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-home-section.mobile-home-areas{
      display: block;
      margin: 0 0 36px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-heading{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 0;
      margin-bottom: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-action{
      display: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-rail{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 16px;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-card{
      appearance: none;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 156px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: space-between;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: 0 14px 30px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      transition:
        transform 0.18s ease,
        border-color 0.18s ease,
        box-shadow 0.18s ease;
    }

    .layout-container.sidebar-collapsed .mobile-area-card:hover{
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--primary-color) 22%, transparent);
      box-shadow: 0 18px 38px color-mix(in srgb, var(--primary-text-color) 11%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture{
      min-height: 176px;
      color: var(--mobile-area-picture-text-color, #ffffff);
      border-color: rgba(255, 255, 255, 0.16);
      background: #182044;
      --mobile-area-picture-text-color: #ffffff;
      --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
      --mobile-area-picture-overlay:
        linear-gradient(180deg, rgba(12, 18, 32, 0.02) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.84) 100%),
        linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
    }

    .layout-container.sidebar-collapsed .mobile-area-picture{
      position: absolute;
      inset: 0;
      z-index: 0;
      background-size: cover;
      background-position: center;
      transform: scale(1.02);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture::after{
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background: var(--mobile-area-picture-overlay);
      pointer-events: none;
    }

    .layout-container.sidebar-collapsed .mobile-area-top,
.layout-container.sidebar-collapsed .mobile-area-copy{
      position: relative;
      z-index: 2;
    }

    .layout-container.sidebar-collapsed .mobile-area-top{
      display: var(--mobile-area-top-display, flex);
      grid-template-columns: minmax(0, 1fr) max-content;
      align-items: flex-start;
      justify-content: var(--mobile-area-top-justify, space-between);
      gap: var(--mobile-area-top-gap, 8px);
    }

    .layout-container.sidebar-collapsed .mobile-area-icon{
      width: 44px;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 8px;
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 13%, transparent);
    }

    .layout-container.sidebar-collapsed .mobile-area-icon ha-icon{
      --mdc-icon-size: 23px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-icon{
      color: var(--mobile-area-picture-text-color, #ffffff);
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(12px);
    }

    .layout-container.sidebar-collapsed .mobile-area-badges{
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 5px;
      min-width: 0;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge{
      min-width: 25px;
      height: 25px;
      padding: 0 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border-radius: 999px;
      color: var(--area-badge-color, var(--primary-color));
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 12%, transparent);
      font-size: 11px;
      font-weight: 850;
    }

    .layout-container.sidebar-collapsed .mobile-area-badge ha-icon{
      --mdc-icon-size: 14px;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-badge{
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
    }

    .layout-container.sidebar-collapsed .mobile-area-name{
      font-size: 16px;
      font-weight: 850;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-meta{
      margin-top: 5px;
      color: color-mix(in srgb, var(--primary-text-color) 56%, transparent);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-name,
.layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta{
      color: var(--mobile-area-picture-text-color, #ffffff);
      text-shadow: var(--mobile-area-picture-text-shadow);
    }

    .layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta{
      color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
    }

    /* Person Cards Section */
    .person-cards-section{
      margin-bottom: 32px;
    }

    .person-cards-grid{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin: 0 auto;
    }

    .person-card{
      --person-color: #8a94a6;
      --person-bg: color-mix(in srgb, var(--person-color) 8%, var(--card-background-color));
      position: relative;
      min-height: 98px;
      padding: 16px 18px;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      overflow: hidden;
      border: 1px solid rgba(15, 23, 42, 0.07);
      border-radius: 18px;
      background:
        radial-gradient(circle at 90% 10%, color-mix(in srgb, var(--person-color) 15%, transparent), transparent 42%),
        var(--person-bg);
      cursor: pointer;
      box-shadow:
        0 16px 34px rgba(15, 23, 42, 0.08),
        inset 0 0 0 1px rgba(255, 255, 255, 0.34);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        border-color 0.18s ease;
    }

    .person-card::after{
      content: "";
      position: absolute;
      left: 18px;
      right: 18px;
      bottom: 0;
      height: 3px;
      border-radius: 999px 999px 0 0;
      background: var(--person-color);
      opacity: 0.34;
    }

    .person-card.home{
      --person-color: #2f9b62;
      --person-bg: color-mix(in srgb, #2f9b62 10%, var(--card-background-color));
    }

    .person-card.away{
      --person-color: ${l(m("alarm_control_panel"))};
      --person-bg: color-mix(in srgb, ${l(m("alarm_control_panel"))} 9%, var(--card-background-color));
    }

    .person-card.unknown{
      --person-color: ${l(m("sensor"))};
      --person-bg: color-mix(in srgb, ${l(m("sensor"))} 8%, var(--card-background-color));
    }

    .person-card:hover{
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--person-color) 24%, transparent);
      box-shadow:
        0 20px 42px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-card:active{
      transform: scale(0.988);
    }

    .person-card:focus-visible{
      outline: 2px solid color-mix(in srgb, var(--person-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .person-avatar-wrapper{
      position: relative;
      z-index: 1;
      flex-shrink: 0;
    }

    .person-avatar{
      width: 64px;
      height: 64px;
      border-radius: 22px;
      overflow: hidden;
      background: color-mix(in srgb, var(--person-color) 14%, var(--secondary-background-color));
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid color-mix(in srgb, var(--person-color) 26%, rgba(255, 255, 255, 0.84));
      box-shadow: 0 12px 24px color-mix(in srgb, var(--person-color) 16%, transparent);
    }

    .person-avatar img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .person-avatar ha-icon{
      --mdc-icon-size: 34px;
      color: var(--person-color);
    }

    .person-home-indicator{
      position: absolute;
      bottom: -5px;
      right: -5px;
      width: 26px;
      height: 26px;
      background: var(--person-color);
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid var(--card-background-color);
      box-shadow: 0 8px 18px color-mix(in srgb, var(--person-color) 26%, transparent);
    }

    .person-home-indicator ha-icon{
      --mdc-icon-size: 14px;
      color: var(--text-primary-color);
    }

    .person-info{
      position: relative;
      z-index: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .person-name{
      font-size: 18px;
      font-weight: 850;
      color: var(--primary-text-color);
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status{
      display: inline-flex;
      width: max-content;
      max-width: 100%;
      align-items: center;
      gap: 6px;
      min-height: 27px;
      padding: 0 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--person-color) 12%, transparent);
      color: var(--person-color);
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-status ha-icon{
      --mdc-icon-size: 15px;
    }

    .person-details{
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 7px;
      align-items: flex-end;
      justify-content: flex-end;
      flex-shrink: 0;
      margin-left: auto;
      max-width: 170px;
    }

    .person-battery,
.person-distance{
      display: flex;
      align-items: center;
      gap: 5px;
      min-height: 28px;
      font-size: 12px;
      font-weight: 800;
      color: color-mix(in srgb, var(--primary-text-color) 72%, transparent);
      background: rgba(255, 255, 255, 0.62);
      padding: 0 9px;
      border-radius: 999px;
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
    }

    .person-battery ha-icon,
.person-distance ha-icon{
      --mdc-icon-size: 14px;
    }

    .person-battery ha-icon{
      color: var(--success-color);
    }

    .person-battery ha-icon[icon*="alert"]{
      color: var(--error-color);
    }

    .person-distance ha-icon{
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .person-cards-grid{
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 12px;
      }

      .person-card{
        padding: 16px;
      }

      .person-avatar{
        width: 64px;
        height: 64px;
      }

      .person-avatar ha-icon{
        --mdc-icon-size: 36px;
      }

      .person-name{
        font-size: 16px;
      }

      .person-status{
        font-size: 13px;
      }

      .person-details{
        gap: 8px;
      }

      .person-battery,
.person-distance{
        font-size: 12px;
        padding: 3px 6px;
      }
    }

    .home-status-grid{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 20px;
      margin: 0 auto;
    }

    .home-status-card{
      background: var(--card-background-color);
      border-radius: 20px;
      padding: 24px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid var(--divider-color);
      position: relative;
      overflow: hidden;
    }

    .home-status-card::before{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .home-status-card:hover{
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      border-color: var(--primary-color);
    }

    .home-status-card:hover::before{
      opacity: 1;
    }

    .home-status-card .status-card-icon{
      position: relative;
      margin-bottom: 16px;
    }

    .home-status-card .status-card-icon ha-icon{
      --mdc-icon-size: 36px;
      color: var(--primary-color);
      transition: transform 0.3s ease;
    }

    .home-status-card:hover .status-card-icon ha-icon{
      transform: scale(1.1);
    }

    .home-status-card .status-card-badge{
      position: absolute;
      top: -10px;
      right: -10px;
      background: var(--accent-color);
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .home-status-card .status-card-title{
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin-top: 8px;
    }



    /* Area Info Badges */
    .area-info-badges{
      position: absolute;
      top: 5px;
      right: 0px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      max-width: calc(59% - 24px);
      justify-content: flex-end;
      align-items: flex-start;
      z-index: 2;
    }

    .info-badge{
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 10%, var(--card-background-color));
      color: var(--badge-color, var(--primary-text-color));
      border-radius: 12px;
      font-size: 12px;
      flex-shrink: 0;
      backdrop-filter: blur(8px);
      border: 1px solid color-mix(in srgb, var(--badge-color, var(--divider-color)) 18%, transparent);
    }

    .info-badge ha-icon{
      --mdc-icon-size: 14px;
    }

    .info-badge.light{
      background: color-mix(in srgb, var(--badge-color, ${l(m("light"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("light"))});
    }

    .info-badge.switch{
      background: color-mix(in srgb, var(--badge-color, ${l(m("switch"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("switch"))});
    }

    .info-badge.climate{
      background: color-mix(in srgb, var(--badge-color, ${l(m("climate"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("climate"))});
    }

    .info-badge.media_player{
      background: color-mix(in srgb, var(--badge-color, ${l(m("media_player"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("media_player"))});
    }

    .info-badge.cover{
      background: color-mix(in srgb, var(--badge-color, ${l(m("cover"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("cover"))});
    }

    .info-badge.fan{
      background: color-mix(in srgb, var(--badge-color, ${l(m("fan"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("fan"))});
    }

    .info-badge.motion{
      background: color-mix(in srgb, var(--badge-color, ${l(m("sensor"))}) 10%, var(--card-background-color));
      color: var(--badge-color, ${l(m("sensor"))});
    }

    /* Sidebar info badges (smaller) */
    .sidebar .info-badge{
      padding: 2px 6px;
      font-size: 11px;
      border-radius: 12px;
    }

    .sidebar .info-badge ha-icon{
      --mdc-icon-size: 12px;
    }

    .sidebar .badge-count{
      min-width: 14px;
      text-align: center;
    }

    /* Clickable badges */
    .info-badge.clickable{
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .info-badge.clickable:hover{
      transform: scale(1.05);
      filter: brightness(1.1);
    }

    /* Color fallbacks for themes without custom colors */
    :host{
      --purple-color: #9c27b0;
      --blue-color: #2196f3;
    }

    /* Area View */
    .area-view{
      max-width: 1400px;
      margin: 0 auto;
    }

    .area-header{
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .area-title{
      font-size: 28px;
      font-weight: 400;
      margin: 0 0 16px 0;
      flex: 1;
    }

    .unavailable-entities-icon{
      background: var(--warning-color);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      margin-bottom: 16px;
    }

    .unavailable-entities-icon:hover{
      background: var(--error-color);
      transform: scale(1.1);
    }

    .unavailable-entities-icon ha-icon{
      --mdc-icon-size: 18px;
      color: white;
    }

    .unavailable-count{
      position: absolute;
      top: -6px;
      right: -6px;
      background: var(--error-color);
      color: white;
      border-radius: 10px;
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 600;
      min-width: 16px;
      text-align: center;
      line-height: 1.2;
    }

    /* Area Badges */
    .area-badges{
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .area-badge{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 24px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .area-badge:hover{
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .area-badge ha-icon{
      --mdc-icon-size: 20px;
    }

    .area-badge.light-toggle{
      background: color-mix(in srgb, var(--warning-color) 10%, var(--card-background-color));
      border-color: var(--warning-color);
    }

    .area-badge.light-toggle ha-icon{
      color: var(--warning-color);
    }

    .area-badge.switch-toggle{
      background: color-mix(in srgb, var(--info-color) 10%, var(--card-background-color));
      border-color: var(--info-color);
    }

    .area-badge.switch-toggle ha-icon{
      color: var(--info-color);
    }

    .area-badge.wattage{
      background: color-mix(in srgb, var(--warning-color) 10%, var(--card-background-color));
      border-color: var(--warning-color);
    }

    .area-badge.wattage ha-icon{
      color: var(--warning-color);
    }

    .area-badge.energy{
      background: color-mix(in srgb, var(--info-color) 10%, var(--card-background-color));
      border-color: var(--info-color);
    }

    .area-badge.energy ha-icon{
      color: var(--info-color);
    }

    /* Entities Section */
    .entities-section{
      display: grid;
      gap: 16px;
    }

    .domain-group{
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 16px;
    }

    .domain-header{
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 16px;
      font-weight: 500;
    }

    .domain-header ha-icon{
      --mdc-icon-size: 20px;
      opacity: 0.8;
    }

    .entities-grid{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 8px;
    }

    .entities-grid.cover-entities-grid{
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 12px;
    }

    .entities-grid.light-entities-grid{
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }

    .entities-grid.sensor-entities-grid{
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
    }

    .entities-grid.motion-entities-grid{
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
    }

    .entity-card-wrapper{
      min-height: 60px;
      position: relative;
    }

    .cover-entity-card,
.light-entity-card,
.motion-entity-card{
      min-height: 72px;
    }

    .sensor-entity-card{
      min-height: 150px;
    }

    .cover-entity-card dwains-dashboard-next-card-host,
.light-entity-card dwains-dashboard-next-card-host,
.sensor-entity-card dwains-dashboard-next-card-host,
.motion-entity-card dwains-dashboard-next-card-host{
      display: block;
    }

    .mobile-area-overview,
.mobile-entities-section{
      display: none;
    }

    .area-view .mobile-entities-section{
      display: grid;
      position: relative;
      z-index: 2;
    }

    .area-header-metrics{
      display: none;
    }

    .mobile-area-metrics{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 14px;
    }

    .mobile-area-metric,
.area-header-metric{
      min-height: 64px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
      border-radius: 10px;
      background: color-mix(in srgb, var(--metric-color) 10%, var(--card-background-color));
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 12%, transparent);
    }

    .mobile-area-metric.temperature,
.area-header-metric.temperature{
      --metric-color: ${l(m("climate"))};
    }

    .mobile-area-metric.humidity,
.area-header-metric.humidity{
      --metric-color: ${l(m("humidity"))};
    }

    .mobile-area-metric.power,
.area-header-metric.power{
      --metric-color: ${l(m("energy"))};
    }

    .mobile-area-metric.energy,
.area-header-metric.energy{
      --metric-color: ${l(m("energy"))};
    }

    .metric-ring{
      width: 44px;
      height: 44px;
      position: relative;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background:
        conic-gradient(var(--metric-color) 0deg var(--metric-angle), rgba(15, 23, 42, 0.08) var(--metric-angle) 270deg, transparent 270deg 360deg);
    }

    .metric-ring::after{
      content: "";
      position: absolute;
      inset: 5px;
      border-radius: inherit;
      background: color-mix(in srgb, var(--card-background-color) 92%, #ffffff);
    }

    .metric-ring.metric-icon{
      background: color-mix(in srgb, var(--metric-color) 15%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
    }

    .metric-ring.metric-icon::after{
      display: none;
    }

    .metric-ring.metric-icon ha-icon{
      --mdc-icon-size: 22px;
      color: var(--metric-color);
    }

    .metric-value{
      position: relative;
      z-index: 1;
      color: color-mix(in srgb, var(--primary-text-color) 74%, transparent);
      font-size: 12px;
      font-weight: 850;
      line-height: 1;
    }

    .metric-copy{
      min-width: 0;
    }

    .metric-label{
      color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
      font-size: 13px;
      font-weight: 850;
      line-height: 1.1;
    }

    .metric-range{
      margin-top: 4px;
      color: color-mix(in srgb, var(--primary-text-color) 38%, transparent);
      font-size: 10px;
      font-weight: 800;
      line-height: 1;
    }

    .metric-reading{
      margin-top: 3px;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      line-height: 1;
      white-space: nowrap;
    }

    .mobile-entities-section{
      gap: 22px;
    }

    .mobile-domain-group{
      min-width: 0;
      position: relative;
    }

    .mobile-domain-group.group-editing{
      border-radius: 8px;
      transition: opacity 0.16s ease, outline-color 0.16s ease, background-color 0.16s ease;
    }

    .mobile-domain-group.group-dragging{
      opacity: 0.46;
    }

    .mobile-domain-group.group-drag-over{
      outline: 2px solid var(--primary-color);
      outline-offset: 7px;
      background: color-mix(in srgb, var(--primary-color) 5%, transparent);
    }

    .mobile-domain-group:not(.menu-open){
      contain: layout style paint;
    }

    .mobile-domain-group.menu-open{
      z-index: 1200;
    }

    .mobile-domain-header{
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 0 2px;
      margin-bottom: 10px;
    }

    .mobile-domain-title{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .mobile-domain-header-actions{
      display: inline-flex;
      align-items: center;
      gap: 2px;
      flex: 0 0 auto;
    }

    .mobile-domain-order-button,
.mobile-domain-drag-handle{
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 78%, transparent);
      color: var(--secondary-text-color);
      cursor: pointer;
    }

    .mobile-domain-drag-handle{
      cursor: grab;
      touch-action: none;
    }

    .mobile-domain-drag-handle:active{
      cursor: grabbing;
    }

    .mobile-domain-order-button:disabled{
      opacity: 0.28;
      cursor: default;
    }

    .mobile-domain-order-button ha-icon,
.mobile-domain-drag-handle ha-icon{
      --mdc-icon-size: 18px;
    }

    .mobile-layout-toggle{
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--secondary-background-color) 72%, #ffffff);
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-layout-toggle.active{
      background: #182044;
      color: #ffffff;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.14);
    }

    .mobile-layout-toggle:active{
      transform: scale(0.94);
    }

    .mobile-layout-toggle ha-icon{
      --mdc-icon-size: 17px;
    }

    .mobile-layout-toggle.static{
      cursor: default;
      pointer-events: none;
    }

    .mobile-section-icon{
      width: 30px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
      background: transparent;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }

    .mobile-section-icon ha-icon{
      --mdc-icon-size: 20px;
    }

    .home-summaries-section .mobile-section-icon.summaries{
      color: #f59e0b;
    }

    .home-todos-section .mobile-section-icon.todos{
      color: #7c3aed;
    }

    .home-custom-cards-section .mobile-section-icon.custom-cards{
      color: #0ea5a8;
    }

    .mobile-domain-title-copy{
      min-width: 0;
      display: inline-flex;
      align-items: baseline;
      gap: 7px;
    }

    .mobile-domain-title-label{
      color: var(--primary-text-color);
      font-size: 18px;
      font-weight: 900;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mobile-domain-count{
      color: color-mix(in srgb, var(--primary-text-color) 42%, transparent);
      font-size: 12px;
      font-weight: 850;
      line-height: 1.1;
      white-space: nowrap;
    }

    .mobile-domain-master{
      --mobile-domain-accent: var(--primary-color);
      min-width: 58px;
      height: 30px;
      padding: 0 5px 0 7px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        border-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
      z-index: 1202;
    }

    .mobile-domain-master.domain-light{
      --mobile-domain-accent: #e89a17;
    }

    .mobile-domain-master.domain-switch,
.mobile-domain-master.domain-input_boolean{
      --mobile-domain-accent: #3275d6;
    }

    .mobile-domain-master.domain-cover{
      --mobile-domain-accent: #0d98aa;
    }

    .mobile-domain-master.domain-fan{
      --mobile-domain-accent: #2d9d79;
    }

    .mobile-domain-master.domain-lock{
      --mobile-domain-accent: #7657c8;
    }

    .mobile-domain-master.active{
      border-color: color-mix(in srgb, var(--mobile-domain-accent) 42%, transparent);
      background: color-mix(in srgb, var(--mobile-domain-accent) 11%, var(--card-background-color));
      color: var(--mobile-domain-accent);
    }

    .mobile-domain-master:active{
      transform: scale(0.94);
    }

    .mobile-domain-master ha-icon{
      --mdc-icon-size: 16px;
    }

    .mobile-domain-master-track{
      position: relative;
      width: 26px;
      height: 16px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-text-color) 18%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      transition: background-color 0.18s ease;
    }

    .mobile-domain-master-track::after{
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.24);
      transition: transform 0.18s ease;
    }

    .mobile-domain-master.active .mobile-domain-master-track{
      background: var(--mobile-domain-accent);
    }

    .mobile-domain-master.active .mobile-domain-master-track::after{
      transform: translateX(10px);
    }

    .mobile-domain-master-actions{
      --mobile-domain-accent: var(--primary-color);
      height: 30px;
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      z-index: 1202;
    }

    .mobile-domain-master-actions.domain-cover{
      --mobile-domain-accent: #0d98aa;
    }

    .mobile-domain-master-actions.domain-lock{
      --mobile-domain-accent: #7657c8;
    }

    .mobile-domain-master-action{
      width: 34px;
      height: 30px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .mobile-domain-master-action + .mobile-domain-master-action{
      border-left: 1px solid color-mix(in srgb, var(--divider-color) 72%, transparent);
    }

    .mobile-domain-master-action:hover,
.mobile-domain-master-action.active{
      background: color-mix(in srgb, var(--mobile-domain-accent) 12%, var(--card-background-color));
      color: var(--mobile-domain-accent);
    }

    .mobile-domain-master-action:active{
      transform: scale(0.88);
    }

    .mobile-domain-master-action ha-icon{
      --mdc-icon-size: 17px;
    }

    .mobile-entity-rail{
      display: flex;
      gap: 10px;
      margin: 0 -10px;
      padding: 0 10px 2px;
      overflow-x: auto;
      scroll-padding: 10px;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .mobile-entity-rail::-webkit-scrollbar{
      display: none;
    }

    .mobile-entities-section.layout-grid{
      gap: 26px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      margin: 0;
      padding: 0;
      overflow: visible;
      scroll-snap-type: none;
      align-items: stretch;
    }

    .mobile-entities-section.layout-grid .mobile-entity-tile-host{
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      flex: none;
      scroll-snap-align: none;
    }

    @media (max-width: 380px) {
      .mobile-entities-section.layout-grid .mobile-entity-rail{
        grid-template-columns: 1fr;
      }
    }

    .mobile-entity-tile-host{
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entities-section.layout-grid .mobile-entity-tile-host{
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entity-replacement-card{
      box-sizing: border-box;
      flex: 0 0 260px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-replacement-card dwains-dashboard-next-card-host{
      display: block;
      width: 100%;
    }

    .mobile-todo-list-card{
      box-sizing: border-box;
      flex: 0 0 min(100%, 520px);
      width: min(100%, 520px);
      min-width: min(100%, 320px);
      scroll-snap-align: start;
    }

    .mobile-todo-list-card dwains-dashboard-next-card-host{
      display: block;
      width: 100%;
    }

    .mobile-entities-section.layout-grid .mobile-entity-replacement-card{
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-todo-list-card{
      grid-column: 1 / -1;
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entity-top{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
    }

      @media (max-width: 430px) {
        .mobile-entities-section.layout-grid .mobile-entity-tile-host{
          min-height: 0;
          padding: 0;
        }

        .mobile-entities-section.layout-grid .mobile-entity-top{
          gap: 6px;
        }
      }

      .mobile-entity-status{
        margin-top: 5px;
        color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
        font-size: 11px;
        font-weight: 750;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-entity-select{
        position: relative;
        display: block;
        width: 100%;
      }

      .mobile-entity-select select{
        width: 100%;
        height: 34px;
        padding: 0 34px 0 12px;
        border: 0;
        border-radius: 999px;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--entity-color) 10%, var(--secondary-background-color));
        font: inherit;
        font-size: 12px;
        font-weight: 850;
        line-height: 34px;
        cursor: pointer;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 16%, transparent),
          0 8px 18px rgba(15, 23, 42, 0.06);
      }

      .mobile-entity-select select:focus{
        box-shadow:
          inset 0 0 0 2px color-mix(in srgb, var(--entity-color) 72%, transparent),
          0 10px 22px color-mix(in srgb, var(--entity-color) 14%, transparent);
      }

      .mobile-entity-select select:disabled{
        opacity: 0.55;
        cursor: not-allowed;
      }

      .mobile-entity-select ha-icon{
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        color: color-mix(in srgb, var(--entity-color) 72%, var(--primary-text-color));
        pointer-events: none;
        --mdc-icon-size: 18px;
      }

    /* Bewerk-toggle in de area-header */
    .area-header{ display: flex; align-items: center; gap: 8px; }
    .dd-edit-toggle{
      margin-left: auto;
      display: inline-flex; align-items: center; justify-content: center;
      width: 38px; height: 38px; border-radius: 50%;
      border: none; cursor: pointer;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      transition: background-color .2s ease, color .2s ease;
    }
    .dd-edit-toggle:hover{ background: rgba(var(--rgb-primary-color, 3,169,244), .14); }
    .dd-edit-toggle.active{ background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .dd-edit-toggle.danger:hover{ background: rgba(var(--rgb-error-color, 244,67,54), .16); color: var(--error-color, #f44336); }
    .dd-edit-toggle ha-icon{ --mdc-icon-size: 20px; }

    /* Sidebar: blueprint-pagina's + toevoegknop */
    .sidebar-divider{
      height: 1px;
      background: var(--divider-color);
      margin: 8px 12px;
    }
    .dd-add-page{
      width: 100%;
      box-sizing: border-box;
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border: 1px dashed var(--divider-color);
      border-radius: 10px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 14px;
      transition: background-color .2s ease, color .2s ease, border-color .2s ease;
    }
    .dd-add-page:hover{
      color: var(--primary-color);
      border-color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .08);
    }
    .dd-add-page ha-icon{ --mdc-icon-size: 20px; }

    /* Blueprint-paginakaart */
    .dd-page-card{ margin-top: 8px; }
    .dd-page-card dwains-dashboard-next-card-host{ display: block; }

    /* Area custom card slots */
    .dd-custom-section{
      margin: 12px 0;
      min-width: 0;
    }

    .dd-custom-section.after-domain{
      margin: 12px 0 2px;
    }

    .dd-custom-section.editing{
      padding: 10px;
      border: 1px dashed color-mix(in srgb, var(--primary-color) 28%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 4%, transparent);
    }

    .dd-custom-section.drag-over{
      border-color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 22%, transparent);
    }

    .dd-custom-slot-head{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
      color: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.2;
    }

    .dd-custom-slot-title{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .dd-custom-slot-title ha-icon{
      --mdc-icon-size: 16px;
      color: var(--primary-color);
    }

    .dd-custom-slot-title span{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dd-custom-grid{
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 8px;
      container-type: inline-size;
    }

    .dd-custom-grid > .dd-custom-card-wrap,
.dd-custom-grid > .dd-add-card{
      --dd-card-default-column: span 4;
      grid-column: var(--dd-card-grid-column, var(--dd-card-default-column));
      min-height: var(--dd-card-grid-min-height, 0);
    }

    .dd-custom-card-wrap{
      position: relative;
      min-width: 0;
      border-radius: 12px;
    }

    .dd-custom-card-wrap.editing{
      outline: 1px solid color-mix(in srgb, var(--divider-color) 78%, transparent);
      outline-offset: 2px;
      cursor: grab;
    }

    .dd-generated-card-wrap{
      display: contents;
    }

    .dd-generated-card-wrap.editing{
      position: relative;
      display: block;
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
      cursor: grab;
      outline: 1px dashed color-mix(in srgb, var(--primary-color) 38%, var(--divider-color));
      outline-offset: 2px;
      border-radius: 12px;
      transition: opacity 0.16s ease, outline-color 0.16s ease, transform 0.16s ease;
    }

    .dd-generated-card-wrap.editing > .mobile-entity-card,
.dd-generated-card-wrap.editing > .mobile-entity-replacement-card,
.dd-generated-card-wrap.editing > .mobile-todo-list-card{
      width: 100%;
      min-width: 0;
      pointer-events: none;
    }

    .dd-generated-card-wrap.editing.is-hidden > :not(.dd-generated-card-toolbar){
      opacity: 0.38;
      filter: saturate(0.45);
    }

    .dd-generated-card-wrap.editing.dragging{
      opacity: 0.42;
      cursor: grabbing;
    }

    .dd-generated-card-wrap.editing.drag-over{
      outline-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 14%, transparent);
      transform: translateY(-2px);
    }

    .dd-generated-card-toolbar{
      position: absolute;
      top: 7px;
      right: 7px;
      z-index: 6;
      display: flex;
      gap: 4px;
      padding: 3px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 94%, transparent);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .dd-generated-card-toolbar button{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }

    .dd-generated-card-toolbar button:first-child{
      color: var(--primary-color);
      cursor: grab;
    }

    .dd-generated-card-toolbar button:hover,
.dd-generated-card-toolbar button:focus-visible{
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      outline: none;
    }

    .dd-generated-card-toolbar ha-icon{
      --mdc-icon-size: 17px;
    }

    .mobile-entities-section.layout-grid .dd-generated-card-wrap.editing{
      width: 100%;
      min-width: 0;
      flex: none;
      scroll-snap-align: none;
    }

    .dd-custom-card-wrap.dragging{
      opacity: 0.48;
      cursor: grabbing;
    }

    .dd-custom-card-wrap.drag-over{
      outline-color: var(--primary-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 12%, transparent);
    }

    .dd-card-toolbar{
      position: absolute; top: 6px; right: 6px; z-index: 4;
      display: none; gap: 4px;
    }
    .dd-custom-card-wrap.editing .dd-card-toolbar{ display: flex; }
    .dd-card-toolbar button{
      display: inline-flex; align-items: center; justify-content: center;
      width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer;
      background: var(--card-background-color);
      box-shadow: 0 1px 4px rgba(0,0,0,.2);
      color: var(--primary-text-color);
    }
    .dd-card-toolbar button.del:hover{ color: var(--error-color, #f44336); }
    .dd-card-toolbar ha-icon{ --mdc-icon-size: 18px; }

    .dd-card-toolbar button.drag{
      cursor: grab;
      color: var(--primary-color);
    }

    .dd-card-toolbar button.drag:active{
      cursor: grabbing;
    }

    .dd-add-card-inline,
.dd-add-card{
      display: flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 72px; width: 100%;
      border: 2px dashed var(--divider-color); border-radius: 12px;
      background: transparent; cursor: pointer;
      color: var(--secondary-text-color); font-weight: 600; font-size: .9rem;
      transition: border-color .2s ease, color .2s ease, background-color .2s ease;
    }
    .dd-add-card:hover{
      border-color: var(--primary-color); color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3,169,244), .06);
    }

    .dd-add-card-inline{
      min-height: 32px;
      width: auto;
      padding: 0 12px;
      border-radius: 999px;
      border-width: 1px;
      font-size: 12px;
      white-space: nowrap;
    }

    .dd-add-card-inline ha-icon{
      --mdc-icon-size: 16px;
    }

    .dd-add-card ha-icon{ --mdc-icon-size: 22px; }

    .dd-domain-add-card{
      min-height: 72px;
      border-width: 1px;
      background: color-mix(in srgb, var(--secondary-background-color) 54%, transparent);
      opacity: 0.82;
    }

    .dd-domain-add-card:hover,
.dd-domain-add-card.drag-over{
      opacity: 1;
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 18%, transparent);
    }

    .entities-grid .dd-custom-card-wrap,
.entities-grid .dd-domain-add-card{
      min-width: 0;
    }

    .entities-grid > .dd-custom-card-wrap.dd-grid-full,
.mobile-entities-section.layout-grid .mobile-entity-rail > .dd-custom-card-wrap.dd-grid-full{
      grid-column: 1 / -1;
      width: 100%;
    }

    .mobile-entity-rail .dd-custom-card-wrap,
.mobile-entity-rail .dd-domain-add-card{
      box-sizing: border-box;
      flex: 0 0 164px;
      min-width: 0;
      scroll-snap-align: start;
    }

    .mobile-entity-rail > .dd-custom-card-wrap.dd-grid-full{
      flex-basis: calc(100% - 20px);
    }

    .mobile-entity-rail .dd-domain-add-card{
      min-height: 128px;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-custom-card-wrap,
.mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card{
      width: 100%;
      flex: none;
      scroll-snap-align: none;
    }

    .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card{
      min-height: 138px;
    }

    @container (max-width: 899px) {
      .dd-custom-grid > .dd-custom-card-wrap,
.dd-custom-grid > .dd-add-card{
        --dd-card-default-column: span 6;
      }
    }

    @container (max-width: 559px) {
      .dd-custom-grid > .dd-custom-card-wrap,
.dd-custom-grid > .dd-add-card{
        --dd-card-default-column: span 12;
      }
    }

    .entity-card-wrapper.loading{
      background: var(--secondary-background-color);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Loading skeleton */
    .skeleton{
      background: linear-gradient(90deg,
        var(--secondary-background-color) 25%,
        var(--primary-background-color) 50%,
        var(--secondary-background-color) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
    }

    @keyframes loading {
      0%{ background-position: 200% 0; }
      100%{ background-position: -200% 0; }
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .sidebar{
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

      .sidebar-resize-handle{
        display: none;
      }

      .sidebar-collapse-toggle{
        display: none;
      }

      .floor-areas{
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .area-button{
        margin-bottom: 8px;
      }



      .mobile-nav-overlay{
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 120;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .mobile-nav-overlay.open{
        opacity: 1;
        pointer-events: auto;
      }

      .global-header{
        padding: 12px;
      }

      .header-time{
        font-size: 20px;
      }



      .entities-grid{
        grid-template-columns: 1fr;
      }

      .global-header.mobile .header-expand-button[data-extra-count]::after{
        right: -8px;
      }

      .mobile-home-section,
.home-camera-section,
.home-status-section,
.home-todos-section,
.home-custom-cards-section,
.home-favorites-section,
.home-summaries-section,
.mobile-domain-group,
.mobile-entities-section.layout-grid .mobile-entity-tile-host{
        content-visibility: visible;
        contain-intrinsic-size: auto;
      }
    }

    /* Favorites Section */
    .favorites-section{
      margin-bottom: 24px;
    }

    .favorites-header{
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 18px;
      font-weight: 500;
    }

    .favorites-grid{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
    }

    .favorite-card-wrapper{
      --favorite-color: var(--primary-color);
      appearance: none;
      position: relative;
      box-sizing: border-box;
      min-width: 0;
      min-height: 116px;
      padding: 14px 14px 13px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      border: 0;
      border-radius: 9px;
      background: color-mix(in srgb, var(--card-background-color) 98%, #ffffff);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow:
        0 12px 26px rgba(15, 23, 42, 0.06),
        inset 0 0 0 1px rgba(15, 23, 42, 0.035);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-card-wrapper:hover{
      transform: translateY(-2px);
      box-shadow:
        0 16px 30px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 20%, transparent);
    }

    .favorite-card-wrapper:active{
      transform: scale(0.985);
    }

    .favorite-card-wrapper:focus-visible,
.favorite-quick-action:focus-visible{
      outline: 2px solid color-mix(in srgb, var(--favorite-color) 72%, #ffffff);
      outline-offset: 3px;
    }

    .favorite-card-wrapper.is-off,
.favorite-card-wrapper.is-idle{
      --favorite-color: color-mix(in srgb, var(--secondary-text-color) 56%, var(--primary-color));
    }

    .favorite-card-wrapper.favorite-light{
      --favorite-color: ${l(m("light"))};
    }

    .favorite-card-wrapper.favorite-switch{
      --favorite-color: ${l(m("switch"))};
    }

    .favorite-card-wrapper.favorite-cover{
      --favorite-color: ${l(m("cover"))};
    }

    .favorite-card-wrapper.favorite-binary_sensor,
.favorite-card-wrapper.favorite-motion{
      --favorite-color: ${l(m("sensor"))};
    }

    .favorite-card-wrapper.favorite-climate,
.favorite-card-wrapper.favorite-weather{
      --favorite-color: ${l(m("climate"))};
    }

    .favorite-card-wrapper.favorite-media_player{
      --favorite-color: ${l(m("media_player"))};
    }

    .favorite-card-wrapper.favorite-person{
      --favorite-color: #3f9b6d;
    }

    .favorite-card-wrapper.favorite-sun{
      --favorite-color: #2d7eea;
    }

    .favorite-top,
.favorite-body{
      position: relative;
      z-index: 1;
    }

    .favorite-top{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .favorite-icon{
      width: 31px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 10px;
      color: var(--favorite-color);
      background: color-mix(in srgb, var(--favorite-color) 13%, transparent);
    }

    .favorite-icon ha-icon{
      --mdc-icon-size: 19px;
    }

    .favorite-quick-action{
      --toggle-track: color-mix(in srgb, var(--secondary-background-color) 80%, #ffffff);
      width: 38px;
      height: 22px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      color: transparent;
      background: var(--toggle-track);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.07),
        0 4px 10px rgba(15, 23, 42, 0.08);
      font: inherit;
      cursor: pointer;
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-quick-action::before{
      content: "";
      width: 18px;
      height: 18px;
      margin-left: 2px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.2);
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .favorite-card-wrapper.is-active .favorite-quick-action{
      background: var(--favorite-color);
    }

    .favorite-card-wrapper.is-active .favorite-quick-action::before{
      transform: translateX(16px);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action{
      width: 30px;
      height: 30px;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
      background: color-mix(in srgb, var(--secondary-background-color) 70%, #ffffff);
      box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .favorite-card-wrapper.info-only .favorite-quick-action::before{
      display: none;
    }

    .favorite-card-wrapper.info-only .favorite-quick-action ha-icon{
      display: block;
      --mdc-icon-size: 17px;
    }

    .favorite-quick-action ha-icon{
      display: none;
    }

    .favorite-quick-action:active{
      transform: scale(0.94);
    }

    .favorite-name{
      color: inherit;
      margin-top: 2px;
      font-size: 14px;
      font-weight: 850;
      line-height: 1.08;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .favorite-state{
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .favorite-area{
      margin-top: 0;
      color: color-mix(in srgb, var(--primary-text-color) 46%, transparent);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([data-theme-dark]){
      .favorite-card-wrapper {
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 90%, #ffffff 4%),
            color-mix(in srgb, var(--card-background-color) 98%, #000000 3%));
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.28),
          inset 0 1px 0 rgba(255, 255, 255, 0.045),
          inset 0 0 0 1px rgba(255, 255, 255, 0.045);
      }

      .favorite-card-wrapper:hover {
        box-shadow:
          0 18px 34px rgba(0, 0, 0, 0.36),
          inset 0 0 0 1px color-mix(in srgb, var(--favorite-color) 30%, transparent);
      }

      .favorite-quick-action {
        --toggle-track: rgba(255, 255, 255, 0.14);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.08),
          0 5px 12px rgba(0, 0, 0, 0.28);
      }

      .favorite-card-wrapper.info-only .favorite-quick-action {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(248, 250, 252, 0.82);
      }
    }


    /* Toast Notification */
    .toast{
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-color);
      color: var(--text-primary-color);
      padding: 12px 24px;
      border-radius: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .toast.show{
      opacity: 1;
    }

    /* Confirmation Dialog */
    .confirmation-dialog{
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: rgba(0, 0, 0, 0.48);
      backdrop-filter: blur(2px);
      z-index: 1100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.18s ease;
    }

    .confirmation-dialog.show{
      opacity: 1;
      pointer-events: auto;
    }

    .confirmation-content{
      box-sizing: border-box;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 20px;
      width: min(420px, calc(100vw - 32px));
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
      outline: none;
      transform: scale(0.96);
      transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .confirmation-dialog.show .confirmation-content{
      transform: scale(1);
    }

    .confirmation-title{
      font-size: 18px;
      font-weight: 700;
      line-height: 1.25;
      margin-bottom: 8px;
    }

    .confirmation-message{
      margin-bottom: 20px;
      color: var(--secondary-text-color);
      font-size: 14px;
      line-height: 1.5;
    }

    .confirmation-actions{
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .notifications-title{
      min-width: 0;
    }

    .notifications-actions{
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 0 0 auto;
    }

    .notifications-icon-button,
.notification-dismiss{
      border: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      -webkit-tap-highlight-color: transparent;
    }

    .notifications-icon-button{
      width: 34px;
      height: 34px;
    }

    .notifications-icon-button ha-icon{
      --mdc-icon-size: 18px;
    }

    .notifications-list{
      padding: 10px;
    }

    .notification-row{
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr) auto;
      gap: 10px;
      align-items: start;
      padding: 11px 10px;
      margin-bottom: 8px;
      border: 1px solid rgba(15, 23, 42, 0.06);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.78);
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
    }

    .notification-row:last-child{
      margin-bottom: 0;
    }

    .notification-icon{
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.11);
      color: var(--primary-color);
    }

    .notification-icon ha-icon{
      --mdc-icon-size: 21px;
    }

    .notification-title{
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 800;
      line-height: 1.2;
      overflow-wrap: anywhere;
    }

    .notification-message{
      margin-top: 4px;
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.35;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .notification-date{
      margin-top: 7px;
      color: color-mix(in srgb, var(--secondary-text-color) 74%, transparent);
      font-size: 11px;
      font-weight: 650;
    }

    .notification-dismiss{
      width: 32px;
      height: 32px;
      color: var(--secondary-text-color);
      background: rgba(0, 0, 0, 0.05);
    }

    .notification-dismiss ha-icon{
      --mdc-icon-size: 17px;
    }

    .notifications-empty,
.notifications-error,
.notifications-loading{
      min-height: 130px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 24px 18px;
      color: var(--secondary-text-color);
      text-align: center;
      font-size: 13px;
      font-weight: 600;
    }

    .notifications-empty ha-icon,
.notifications-error ha-icon,
.notifications-loading ha-icon{
      --mdc-icon-size: 28px;
      color: var(--primary-color);
    }

    @media (max-width: 1024px) {
    }

    .confirmation-button{
      min-height: 40px;
      padding: 9px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 650;
      transition: transform 0.16s ease, box-shadow 0.16s ease;
    }

    .confirmation-button.cancel{
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .confirmation-button.confirm{
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .confirmation-button.confirm.destructive{
      background: var(--error-color, #db4437);
      color: #fff;
    }

    .confirmation-button:hover{
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* Area Badges Styling */
    .area-badges{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 0px; /* 16px;*/
    }

    .area-badge{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: default;
      background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 10%, var(--card-background-color));
      color: var(--area-badge-color, var(--primary-text-color));
      border: 1px solid color-mix(in srgb, var(--area-badge-color, var(--divider-color)) 20%, transparent);
    }

    .area-badge ha-icon{
      --mdc-icon-size: 18px;
    }

    /* Domain-specific badge colors */
    .area-badge.light{
      background: color-mix(in srgb, var(--area-badge-color, ${l(m("light"))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${l(m("light"))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${l(m("light"))}) 20%, transparent);
    }

    .area-badge.switch{
      background: color-mix(in srgb, var(--area-badge-color, ${l(m("switch"))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${l(m("switch"))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${l(m("switch"))}) 20%, transparent);
    }

    .area-badge.climate{
      background: color-mix(in srgb, var(--area-badge-color, ${l(m("climate"))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${l(m("climate"))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${l(m("climate"))}) 20%, transparent);
    }

    .area-badge.motion.active{
      background: color-mix(in srgb, var(--area-badge-color, ${l(m("sensor"))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${l(m("sensor"))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${l(m("sensor"))}) 20%, transparent);
    }

    .area-badge.cover{
      background: color-mix(in srgb, var(--area-badge-color, ${l(m("cover"))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${l(m("cover"))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${l(m("cover"))}) 20%, transparent);
    }

    .area-badge.media_player{
      background: color-mix(in srgb, var(--area-badge-color, ${l(m("media_player"))}) 10%, var(--card-background-color));
      color: var(--area-badge-color, ${l(m("media_player"))});
      border-color: color-mix(in srgb, var(--area-badge-color, ${l(m("media_player"))}) 20%, transparent);
    }

    .area-badge.temperature{
      background: color-mix(in srgb, var(--cyan-color) 10%, var(--card-background-color));
      color: var(--cyan-color);
      border-color: color-mix(in srgb, var(--cyan-color) 20%, transparent);
    }

    .area-badge.humidity{
      background: color-mix(in srgb, var(--blue-color) 10%, var(--card-background-color));
      color: var(--blue-color);
      border-color: color-mix(in srgb, var(--blue-color) 20%, transparent);
    }

    .area-badge.wattage{
      background: color-mix(in srgb, var(--yellow-color) 10%, var(--card-background-color));
      color: var(--yellow-color);
      border-color: color-mix(in srgb, var(--yellow-color) 20%, transparent);
    }

    .area-badge.energy{
      background: color-mix(in srgb, var(--indigo-color) 10%, var(--card-background-color));
      color: var(--indigo-color);
      border-color: color-mix(in srgb, var(--indigo-color) 20%, transparent);
    }

    /* Toggle button badges */
    .area-badge.light-toggle,
.area-badge.switch-toggle{
      cursor: pointer;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border-color: var(--primary-color);
    }

    .area-badge.light-toggle:hover,
.area-badge.switch-toggle:hover{
      background: color-mix(in srgb, var(--primary-color) 90%, black);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .area-badges{
        padding: 12px;
        gap: 6px;
      }

      .area-badge{
        padding: 6px 10px;
        font-size: 13px;
      }

      .area-badge ha-icon{
        --mdc-icon-size: 16px;
      }
    }

    /* Header Expanded Content Styling */
    .global-header.expanded{
      border-bottom: 2px solid var(--primary-color);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .header-expanded-content{
      background: var(--card-background-color);
      padding: 16px;
      border-top: 1px solid var(--divider-color);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from{
        opacity: 0;
        transform: translateY(-10px);
      }
      to{
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header-expanded-content .header-favorites{
      max-width: 100%;
    }

    /* Favorites Section Styling */
    .favorites-section{
      width: 100%;
    }

    .favorites-header{
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color);
    }

    .favorites-header ha-icon{
      --mdc-icon-size: 20px;
      color: var(--primary-color);
    }

    .favorites-header h3{
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .favorites-grid{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      width: 100%;
    }

    .favorite-tile-wrapper{
      width: 100%;
      min-height: 60px;
    }

    .favorite-tile{
      width: 100% !important;
      height: auto !important;
    }

    .no-favorites{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      border: 1px dashed var(--divider-color);
    }

    .no-favorites ha-icon{
      --mdc-icon-size: 32px;
      margin-bottom: 8px;
      opacity: 0.6;
    }

    .no-favorites p{
      margin: 0;
      font-size: 14px;
    }

    /* Header Expand Button Enhanced Styling */
    .header-expand-button{
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--primary-color);
      background: var(--card-background-color);
      color: var(--primary-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .header-expand-button:hover{
      background: var(--primary-color);
      color: var(--text-primary-color);
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .header-expand-button ha-icon{
      --mdc-icon-size: 20px;
      transition: transform 0.3s ease;
    }

    .global-header.expanded .header-expand-button{
      bottom: -20px;
    }

    /* Mobile specific adjustments for expanded header */
    @media (max-width: 768px) {
      .header-expanded-content{
        padding: 12px;
      }

      .favorites-grid{
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 8px;
      }

      .header-expand-button{
        width: 36px;
        height: 36px;
        bottom: -18px;
      }

      .header-expand-button ha-icon{
        --mdc-icon-size: 18px;
      }
    }

    /* Home and header status cards */
    .home-status-card,
.status-card-compact{
      --status-color: var(--primary-color);
      --status-bg: color-mix(in srgb, var(--status-color) 16%, transparent);
    }

    .home-status-card.cover,
.status-card-compact.cover{
      --status-color: ${l(m("cover"))};
    }

    .home-status-card.binary_sensor,
.home-status-card.motion,
.status-card-compact.binary_sensor,
.status-card-compact.motion{
      --status-color: ${l(m("sensor"))};
    }

    .home-status-card.light,
.status-card-compact.light{
      --status-color: ${l(m("light"))};
    }

    .home-status-card.switch,
.status-card-compact.switch{
      --status-color: ${l(m("switch"))};
    }

    .home-status-card.climate,
.status-card-compact.climate{
      --status-color: ${l(m("climate"))};
    }

    .home-status-card.person,
.status-card-compact.person{
      --status-color: #3f9b6d;
    }

    .home-status-card.media_player,
.status-card-compact.media_player{
      --status-color: ${l(m("media_player"))};
    }

    .home-status-card.fan,
.status-card-compact.fan{
      --status-color: ${l(m("fan"))};
    }

    .home-status-card.wattage,
.home-status-card.house-power-card,
.home-status-card.energy,
.status-card-compact.wattage,
.status-card-compact.energy{
      --status-color: ${l(m("energy"))};
    }

    .home-status-grid{
      grid-template-columns: repeat(auto-fill, minmax(150px, 170px));
      justify-content: start;
      gap: 12px;
    }

    .home-status-card{
      min-height: 134px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: var(--card-background-color);
      text-align: left;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .home-status-card::before{
      top: auto;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--status-color);
      opacity: 0.55;
    }

    .home-status-card:hover{
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--status-color) 40%, transparent);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
    }

    .home-status-card:hover::before{
      opacity: 0.85;
    }

    .home-status-card .status-card-icon{
      width: 48px;
      height: 48px;
      margin: 0 0 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .home-status-card .status-card-icon ha-icon{
      --mdc-icon-size: 25px;
      color: var(--status-color);
      transform: none;
    }

    .home-status-card:hover .status-card-icon ha-icon{
      transform: none;
    }

    .home-status-card .status-card-badge{
      top: -8px;
      right: -8px;
      width: auto;
      min-width: 24px;
      height: 24px;
      padding: 0 7px;
      border-radius: 999px;
      background: var(--status-color);
      color: #fff;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 5px 12px color-mix(in srgb, var(--status-color) 28%, transparent);
    }

    .home-status-card .status-card-title{
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 16px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
    }

    .home-status-card.has-value .status-card-title{
      margin-top: 2px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 800;
    }

    .home-status-card .status-card-value{
      margin: auto 0 0;
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: 0;
      white-space: nowrap;
    }

    .home-status-card.house-persons-card{
      --status-color: #182044;
      grid-column: span 2;
      min-width: 240px;
      gap: 12px;
    }

    .home-status-card.house-power-card{
      --status-color: ${l(m("energy"))};
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .home-status-card.house-climate-card{
      --status-color: ${l(m("room_climate"))};
      grid-column: span 2;
      min-width: 270px;
      gap: 12px;
    }

    .house-persons-head{
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .home-status-card.house-persons-card .house-persons-icon,
.home-status-card.house-climate-card .house-climate-icon,
.home-status-card.house-power-card .house-power-icon{
      width: 42px;
      height: 42px;
      margin: 0;
      flex: 0 0 auto;
      border-radius: 13px;
    }

    .house-persons-copy,
.house-climate-copy,
.house-power-copy{
      min-width: 0;
      text-align: left;
    }

    .house-persons-title,
.house-climate-title,
.house-power-title{
      color: var(--primary-text-color);
      font-size: 15px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-persons-subtitle,
.house-persons-empty,
.house-climate-subtitle,
.house-power-subtitle,
.house-power-empty{
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.25;
    }

    .house-climate-head{
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .house-climate-grid{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .house-climate-metric{
      min-width: 0;
      min-height: 48px;
      padding: 8px 9px;
      border: 0;
      border-radius: 12px;
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr);
      align-items: center;
      column-gap: 8px;
      background: color-mix(in srgb, var(--metric-color) 12%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 14%, transparent);
      transition:
        transform 0.18s ease,
        background-color 0.18s ease;
    }

    .house-climate-metric:active{
      transform: scale(0.97);
    }

    .house-climate-metric-icon{
      width: 26px;
      height: 26px;
      border-radius: 9px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--metric-color) 18%, transparent);
      color: var(--metric-color);
    }

    .house-climate-metric-icon ha-icon{
      --mdc-icon-size: 16px;
    }

    .house-climate-metric-copy{
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-climate-metric-value,
.house-climate-metric-label{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-climate-metric-value{
      font-size: 14px;
      font-weight: 900;
      color: var(--primary-text-color);
    }

    .house-climate-metric-label{
      font-size: 10px;
      font-weight: 750;
      color: var(--secondary-text-color);
    }

    .house-power-head{
      width: 100%;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
    }

    .house-power-total{
      color: var(--primary-text-color);
      font-size: 22px;
      font-weight: 950;
      line-height: 1;
      white-space: nowrap;
    }

    .house-power-list{
      width: 100%;
      display: grid;
      gap: 7px;
    }

    .house-power-room{
      display: grid;
      grid-template-columns: 26px minmax(0, 1fr) auto;
      align-items: center;
      column-gap: 8px;
      row-gap: 4px;
    }

    .house-power-room-icon{
      width: 26px;
      height: 26px;
      grid-row: span 2;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      background: color-mix(in srgb, var(--status-color) 12%, transparent);
      color: var(--status-color);
    }

    .house-power-room-icon ha-icon{
      --mdc-icon-size: 16px;
    }

    .house-power-room-name,
.house-power-room-value{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.1;
    }

    .house-power-room-name{
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
    }

    .house-power-room-value{
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
    }

    .house-power-bar{
      position: relative;
      height: 5px;
      grid-column: 2 / -1;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 10%, var(--secondary-background-color));
    }

    .house-power-bar-fill{
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: ${l(m("energy"))};
    }

    .house-persons-grid{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 7px;
    }

    .house-person-mini{
      appearance: none;
      min-width: 0;
      min-height: 42px;
      padding: 6px;
      display: flex;
      align-items: center;
      gap: 7px;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-background-color) 78%, var(--card-background-color));
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        transform 0.18s ease;
    }

    .house-person-mini:active{
      transform: scale(0.97);
    }

    .house-person-mini.is-home{
      background: color-mix(in srgb, #2f9b62 13%, var(--card-background-color));
    }

    .house-person-mini.is-away{
      background: color-mix(in srgb, ${l(m("alarm_control_panel"))} 10%, var(--card-background-color));
    }

    .house-person-avatar{
      width: 26px;
      height: 26px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--status-color) 12%, transparent);
      color: var(--status-color);
    }

    .house-person-avatar img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .house-person-avatar ha-icon{
      --mdc-icon-size: 16px;
    }

    .house-person-mini-copy{
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .house-person-mini-name,
.house-person-mini-state{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .house-person-mini-name{
      color: var(--primary-text-color);
      font-size: 11px;
      font-weight: 850;
      line-height: 1.1;
    }

    .house-person-mini-state{
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 700;
      line-height: 1.1;
    }

    .header-status-scroll{
      gap: 8px;
      padding: 2px 2px 4px 12px;
    }

    .status-card-compact{
      flex: 0 0 auto;
      min-width: 92px;
      max-width: 150px;
      min-height: 70px;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 7px 12px 9px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: var(--card-background-color);
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
    }

    .status-card-compact:hover{
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--status-color) 36%, transparent);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
    }

    .status-card-compact .status-card-icon-compact{
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--status-bg);
    }

    .status-card-compact .status-card-icon-compact ha-icon{
      --mdc-icon-size: 20px;
      color: var(--status-color);
    }

    .status-card-compact .status-card-badge-compact{
      top: -7px;
      right: -8px;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: var(--status-color);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 4px 10px color-mix(in srgb, var(--status-color) 26%, transparent);
    }

    .status-card-compact .status-card-title-compact{
      width: 100%;
      margin-top: 5px;
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 800;
      line-height: 1.15;
      text-align: left;
      opacity: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .status-card-compact.has-value .status-card-title-compact{
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 900;
      white-space: nowrap;
      display: block;
    }

    .status-card-subtitle-compact{
      width: 100%;
      margin-top: 1px;
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 750;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .home-status-grid{
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        margin: 0;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-section{
        margin: 0 -10px 18px;
      }

      .home-camera-section .home-status-heading{
        display: none;
      }

      .home-summaries-section{
        margin: 0 -10px 18px;
      }

      .home-summaries-section .home-status-heading{
        display: none;
      }

      .home-todos-section{
        margin: 0 -10px 18px;
      }

      .home-todos-section .home-status-heading{
        display: none;
      }

      .home-todos-grid{
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
        padding: 2px 18px 16px;
      }

      .home-custom-cards-section{
        min-width: 0;
        margin: 0 -10px 18px;
      }

      .home-custom-cards-section .home-status-heading{
        display: none;
      }

      .home-custom-cards-grid{
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
        padding: 2px 18px 16px;
      }

      .home-summary-list{
        width: auto;
        display: flex;
        flex-direction: column;
        padding: 2px 18px 16px;
        gap: 8px;
      }

      .home-summary-card{
        min-height: 64px;
        padding: 11px 12px;
        border-radius: 14px;
      }

      .home-summary-icon{
        width: 36px;
        height: 36px;
      }

      .home-camera-grid{
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-camera-grid::-webkit-scrollbar{
        display: none;
      }

      .home-camera-section.layout-grid .home-camera-grid{
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-camera-card{
        flex: 0 0 226px;
        min-height: 146px;
        border-radius: 18px;
        scroll-snap-align: start;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.11);
      }

      .home-camera-section.layout-grid .home-camera-card{
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      .home-camera-content{
        min-height: 146px;
        padding: 13px;
      }

      .home-camera-name{
        font-size: 16px;
      }

      .home-status-grid::-webkit-scrollbar{
        display: none;
      }

      .home-status-card{
        flex: 0 0 126px;
        min-height: 114px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .home-status-card.house-persons-card{
        flex: 0 0 230px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-power-card{
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card.house-climate-card{
        flex: 0 0 250px;
        min-height: 132px;
        padding: 14px;
      }

      .home-status-card .status-card-title{
        font-size: 15px;
      }

      .status-card-compact{
        min-width: 88px;
      }

      .home-view{
        max-width: none;
      }

      .person-cards-section{
        display: none;
      }

      .home-status-heading{
        display: none;
      }

      .mobile-home-section{
        display: block;
        margin: 0 -10px 18px;
      }

      .mobile-section-heading{
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 0 18px;
        margin-bottom: 10px;
      }

      .mobile-section-title{
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .mobile-section-title-label{
        color: var(--primary-text-color);
        font-size: 16px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-section-action{
        appearance: none;
        min-width: 66px;
        height: 28px;
        padding: 0 10px 0 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        color: var(--primary-color);
        font-size: 12px;
        font-weight: 850;
        font: inherit;
        cursor: pointer;
        transition:
          background-color 0.18s ease,
          transform 0.18s ease;
      }

      .mobile-section-action ha-icon{
        --mdc-icon-size: 15px;
      }

      .mobile-section-action:active{
        transform: scale(0.96);
        background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      }

      .mobile-area-rail{
        display: flex;
        gap: 10px;
        margin-block: 0 -16px;
        padding: 3px 18px 32px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .mobile-area-rail::-webkit-scrollbar{
        display: none;
      }

      .mobile-home-section.layout-grid .mobile-area-rail{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 3px 18px 32px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .mobile-area-card{
        appearance: none;
        position: relative;
        box-sizing: border-box;
        flex: 0 0 152px;
        min-width: 0;
        min-height: 130px;
        padding: 13px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-between;
        overflow: hidden;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        border-radius: 18px;
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        color: var(--primary-text-color);
        font: inherit;
        box-shadow: 0 12px 28px color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        text-align: left;
        scroll-snap-align: start;
        cursor: pointer;
        transition:
          transform 0.18s ease,
          border-color 0.18s ease,
          box-shadow 0.18s ease;
      }

      .mobile-home-section.layout-grid .mobile-area-card{
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .mobile-home-section.layout-grid .mobile-area-rail{
          grid-template-columns: 1fr;
        }
      }

      .mobile-area-card:active{
        transform: scale(0.98);
      }

      .mobile-area-card.has-picture{
        min-height: 146px;
        color: var(--mobile-area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.16);
        background: #182044;
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-card.has-picture.text-dark{
        --mobile-area-picture-text-color: #ffffff;
        --mobile-area-picture-muted-text-color: rgba(255, 255, 255, 0.76);
        --mobile-area-picture-text-shadow: 0 2px 10px rgba(0, 0, 0, 0.62);
        --mobile-area-picture-overlay:
          linear-gradient(180deg, rgba(12, 18, 32, 0.03) 0%, rgba(12, 18, 32, 0.18) 42%, rgba(12, 18, 32, 0.82) 100%),
          linear-gradient(90deg, rgba(12, 18, 32, 0.18), rgba(12, 18, 32, 0.04));
      }

      .mobile-area-picture{
        position: absolute;
        inset: 0;
        z-index: 0;
        background-size: cover;
        background-position: center;
        transform: scale(1.02);
      }

      .mobile-area-card.has-picture::after{
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        background: var(--mobile-area-picture-overlay);
      }

      .mobile-area-top,
.mobile-area-copy{
        position: relative;
        z-index: 2;
      }

      .mobile-area-top{
        display: var(--mobile-area-top-display, flex);
        grid-template-columns: minmax(0, 1fr) max-content;
        align-items: flex-start;
        justify-content: var(--mobile-area-top-justify, space-between);
        gap: var(--mobile-area-top-gap, 8px);
      }

      .mobile-area-icon{
        width: 42px;
        height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border-radius: 13px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 13%, transparent);
      }

      .mobile-area-icon ha-icon{
        --mdc-icon-size: 22px;
      }

      .mobile-area-card.has-picture .mobile-area-icon{
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(12px);
      }

      .mobile-area-badges{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 5px;
        min-width: 0;
      }

      .mobile-area-badge{
        min-width: 24px;
        height: 24px;
        padding: 0 7px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border-radius: 999px;
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 12%, transparent);
        font-size: 11px;
        font-weight: 850;
      }

      .mobile-area-card.has-picture .mobile-area-badge{
        color: var(--area-badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .mobile-area-badge ha-icon{
        --mdc-icon-size: 14px;
      }

      .mobile-area-badge.light{
        --area-badge-color: ${l(m("light"))};
      }

      .mobile-area-badge.cover{
        --area-badge-color: ${l(m("cover"))};
      }

      .mobile-area-badge.motion{
        --area-badge-color: ${l(m("sensor"))};
      }

      .mobile-area-name{
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-meta{
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 54%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mobile-area-card.has-picture .mobile-area-meta{
        color: var(--mobile-area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .mobile-area-card.has-picture .mobile-area-name,
.mobile-area-card.has-picture .mobile-area-meta{
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-icon{
        color: var(--mobile-area-picture-text-color, #ffffff);
        background: rgba(255, 255, 255, 0.18);
      }

      .mobile-area-card.has-picture.text-dark .mobile-area-name,
.mobile-area-card.has-picture.text-dark .mobile-area-meta{
        text-shadow: var(--mobile-area-picture-text-shadow);
      }

      .home-status-section{
        margin: 0 -10px 18px;
      }

      .home-status-section .mobile-section-heading{
        margin-bottom: 10px;
      }

      .home-status-section.layout-grid .home-status-grid{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 2px 18px 16px;
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-status-section.layout-grid .home-status-card{
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        flex: none;
        scroll-snap-align: none;
      }

      .home-status-section.layout-grid .house-persons-card,
.home-status-section.layout-grid .house-climate-card,
.home-status-section.layout-grid .house-power-card{
        grid-column: 1 / -1;
      }

      @media (max-width: 380px) {
        .home-status-section.layout-grid .home-status-grid{
          grid-template-columns: 1fr;
        }
      }

      .home-status-card::before{
        left: 14px;
        right: 14px;
      }

      .home-status-card .status-card-icon{
        width: 42px;
        height: 42px;
        border-radius: 13px;
        margin-bottom: 16px;
      }

      .home-status-card .status-card-icon ha-icon{
        --mdc-icon-size: 22px;
      }

      .home-status-card .status-card-badge{
        min-width: 23px;
        height: 23px;
        top: -8px;
        right: -9px;
      }

      :host([data-theme-dark]){
        .home-welcome {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 7%) 0%,
              color-mix(in srgb, var(--card-background-color) 92%, var(--primary-background-color)) 100%);
          box-shadow:
            0 14px 36px rgba(0, 0, 0, 0.34),
            inset 0 -1px 0 rgba(255, 255, 255, 0.04);
        }

        .welcome-avatar {
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.34),
            0 0 0 3px rgba(255, 255, 255, 0.08);
        }

        .welcome-action:not(.welcome-notification-action) {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 84%, #ffffff 8%),
              color-mix(in srgb, var(--card-background-color) 94%, #000000 6%));
          box-shadow:
            0 10px 24px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .mobile-area-card {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .mobile-area-card:not(.has-picture) .mobile-area-icon {
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
        }

        .mobile-area-badge {
          background: color-mix(in srgb, var(--area-badge-color, var(--primary-color)) 20%, transparent);
        }

        .home-status-card.house-persons-card {
          --status-color: #8ea8ff;
        }

        .home-status-card.house-power-card {
          --status-color: ${l(m("energy"))};
        }

        .home-status-card.house-climate-card {
          --status-color: ${l(m("room_climate"))};
        }

        .house-person-mini {
          background: color-mix(in srgb, var(--card-background-color) 78%, #ffffff 5%);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .house-climate-metric {
          background: color-mix(in srgb, var(--metric-color) 18%, var(--card-background-color));
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
        }

        .house-power-room-icon {
          background: color-mix(in srgb, var(--status-color) 20%, transparent);
        }

        .house-power-bar {
          background: color-mix(in srgb, var(--status-color) 13%, var(--card-background-color));
        }

        .house-person-mini.is-home {
          background: color-mix(in srgb, #2f9b62 20%, var(--card-background-color));
        }

        .house-person-mini.is-away {
          background: color-mix(in srgb, ${l(m("alarm_control_panel"))} 16%, var(--card-background-color));
        }

        .home-summary-card {
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 88%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow:
            0 12px 26px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .home-summary-icon {
          background: color-mix(in srgb, var(--summary-color) 20%, transparent);
        }
      }

      .home-favorites-section{
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        margin: 0 -10px 44px;
        padding: 0;
        overflow: visible;
      }

      .home-favorites-section .favorites-header{
        display: none;
      }

      .home-favorites-section .mobile-section-heading{
        margin-bottom: 10px;
      }

      .home-favorites-section .favorites-grid{
        display: flex;
        grid-template-columns: none;
        gap: 10px;
        margin-block: 0 -32px;
        padding: 3px 18px 32px;
        overflow-x: auto;
        scroll-padding: 18px;
        scroll-snap-type: x proximity;
        scrollbar-width: none;
      }

      .home-favorites-section .favorites-grid::-webkit-scrollbar{
        display: none;
      }

      .home-favorites-section.layout-grid .favorites-grid{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        overflow: visible;
        scroll-snap-type: none;
      }

      .home-favorites-section .favorite-card-wrapper{
        flex: 0 0 186px;
        width: auto;
        min-width: 0;
        box-sizing: border-box;
        min-height: 116px;
        padding: 14px;
        border-radius: 16px;
        scroll-snap-align: start;
      }

      .home-favorites-section.layout-grid .favorite-card-wrapper{
        width: 100%;
        flex: none;
        scroll-snap-align: none;
      }

      @media (max-width: 380px) {
        .home-favorites-section.layout-grid .favorites-grid{
          grid-template-columns: 1fr;
        }
      }
    }

    /* Area status/action pills */
    .area-badges{
      gap: 8px;
      align-items: center;
      margin-bottom: 18px;
    }

    .area-badge{
      min-height: 38px;
      padding: 9px 15px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 800;
      line-height: 1;
      box-shadow: none;
    }

    .area-badge ha-icon{
      --mdc-icon-size: 17px;
    }

    .area-badge.cover{
      background: color-mix(in srgb, var(--area-badge-color, ${l(m("cover"))}) 12%, var(--card-background-color));
      border-color: color-mix(in srgb, var(--area-badge-color, ${l(m("cover"))}) 22%, transparent);
      color: var(--area-badge-color, ${l(m("cover"))});
    }

    .area-badge.cover ha-icon{
      color: var(--area-badge-color, ${l(m("cover"))});
    }

    .area-badge.light-toggle,
.area-badge.switch-toggle{
      min-width: 132px;
      justify-content: center;
      cursor: pointer;
      background: #089987;
      border-color: #089987;
      color: #ffffff;
      box-shadow: 0 8px 20px rgba(8, 153, 135, 0.18);
    }

    .area-badge.light-toggle ha-icon{
      color: #ffc400;
    }

    .area-badge.switch-toggle ha-icon{
      color: #1f86d9;
    }

    .area-badge.light-toggle:hover,
.area-badge.switch-toggle:hover{
      background: #078b7b;
      border-color: #078b7b;
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(8, 153, 135, 0.24);
    }

    .area-badge.light-toggle:active,
.area-badge.switch-toggle:active{
      transform: translateY(0);
      box-shadow: 0 5px 14px rgba(8, 153, 135, 0.18);
    }

    /* Room header */
    .area-header{
      position: relative;
      isolation: isolate;
      z-index: 0;
      min-height: 138px;
      margin-bottom: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      overflow: hidden;
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, var(--primary-color) 12%, rgba(0, 0, 0, 0.06));
      background:
        linear-gradient(135deg,
          var(--card-background-color) 0%,
          color-mix(in srgb, var(--primary-color) 5%, var(--card-background-color)) 100%);
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.07);
    }

    .area-header::before{
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(0, 0, 0, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
      background-size: 56px 56px;
      opacity: 0.38;
    }

    .area-header-background{
      position: absolute;
      inset: 0;
      z-index: 0;
      background-size: cover;
      background-position: center;
      filter: saturate(1.05) contrast(1.02);
    }

    .area-header.has-picture{
      border-color: rgba(255, 255, 255, 0.16);
      background: #172321;
      color: var(--area-header-picture-text-color, #ffffff);
      --area-header-picture-text-color: #ffffff;
      --area-header-picture-muted-text-color: rgba(255, 255, 255, 0.76);
      --area-header-picture-control-bg: rgba(255, 255, 255, 0.18);
      --area-header-picture-control-border: rgba(255, 255, 255, 0.16);
      --area-header-picture-overlay:
        linear-gradient(135deg, rgba(13, 24, 23, 0.84), rgba(13, 24, 23, 0.46)),
        linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
    }

    .area-header.has-picture.text-dark{
      --area-header-picture-text-color: #0f172a;
      --area-header-picture-muted-text-color: rgba(15, 23, 42, 0.72);
      --area-header-picture-control-bg: rgba(255, 255, 255, 0.72);
      --area-header-picture-control-border: rgba(15, 23, 42, 0.08);
      --area-header-picture-overlay:
        linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.48)),
        linear-gradient(rgba(15, 23, 42, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
    }

    .area-header.has-picture::before{
      z-index: 1;
      background: var(--area-header-picture-overlay);
      background-size: auto, 56px 56px, 56px 56px;
      opacity: 1;
    }

    .area-header-content{
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 16px;
      min-width: 0;
    }

    .area-title-group{
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .area-mobile-toolbar{
      position: relative;
      z-index: 3;
      display: grid;
      grid-template-columns: auto minmax(0, max-content) auto;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .area-mobile-round{
      width: 42px;
      height: 42px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 88%, #ffffff);
      color: #182044;
      cursor: pointer;
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.12),
        inset 0 0 0 1px rgba(15, 23, 42, 0.06);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        background-color 0.18s ease,
        color 0.18s ease;
    }

    .area-mobile-round:hover{
      transform: translateY(-1px);
      box-shadow:
        0 14px 28px rgba(15, 23, 42, 0.16),
        inset 0 0 0 1px rgba(15, 23, 42, 0.08);
    }

    .area-mobile-round ha-icon,
.area-mobile-round .dd-static-icon{
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
    }

    .area-mobile-home{
      display: none;
      background:
        linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
        rgba(10, 12, 18, 0.86);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .layout-container.sidebar-collapsed .area-mobile-home{
      display: inline-flex;
    }

    .area-mobile-quick-controls{
      grid-column: 2;
      justify-self: start;
      max-width: 100%;
      min-height: 40px;
      padding: 4px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
      box-shadow:
        0 10px 24px rgba(15, 23, 42, 0.1),
        inset 0 0 0 1px rgba(15, 23, 42, 0.05);
    }

    .area-mobile-quick-controls.empty{
      visibility: hidden;
    }

    .area-quick-control{
      min-width: 60px;
      height: 34px;
      padding: 0 7px 0 9px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 6px;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
      cursor: pointer;
      transition:
        background-color 0.18s ease,
        color 0.18s ease,
        transform 0.18s ease;
    }

    .area-quick-control:active{
      transform: scale(0.96);
    }

    .area-quick-main{
      min-width: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .area-quick-control ha-icon{
      --mdc-icon-size: 17px;
      flex: 0 0 auto;
    }

    .area-quick-count{
      color: currentColor;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
      white-space: nowrap;
    }

    .area-quick-switch{
      position: relative;
      width: 26px;
      height: 16px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.12);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.05),
        inset 0 1px 3px rgba(15, 23, 42, 0.12);
      transition:
        background-color 0.18s ease,
        box-shadow 0.18s ease;
    }

    .area-quick-switch::after{
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 1px 4px rgba(15, 23, 42, 0.24);
      transition: transform 0.18s ease;
    }

    .area-quick-control.active{
      background: #182044;
      color: #ffffff;
    }

    .area-quick-control.light.active{
      color: #ffd047;
    }

    .area-quick-control.switch.active{
      color: #58a9ff;
    }

    .area-quick-control.cover.active{
      color: #b984ff;
    }

    .area-quick-control.fan.active{
      color: #55bda4;
    }

    .area-quick-control.climate.active{
      color: #51aadd;
    }

    .area-quick-control.active .area-quick-switch{
      background: currentColor;
    }

    .area-quick-control.active .area-quick-switch::after{
      transform: translateX(10px);
    }

    .area-quick-direction{
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.08);
      color: currentColor;
    }

    .area-quick-direction ha-icon{
      --mdc-icon-size: 16px;
    }

    .area-quick-control.has-actions{
      padding-right: 4px;
      cursor: default;
    }

    .area-quick-control.has-actions:active{
      transform: none;
    }

    .area-quick-actions{
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.08);
    }

    .area-quick-action{
      width: 25px;
      height: 24px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      background: transparent;
      color: currentColor;
      cursor: pointer;
      transition: background-color 0.18s ease, transform 0.18s ease;
    }

    .area-quick-action + .area-quick-action{
      border-left: 1px solid color-mix(in srgb, currentColor 18%, transparent);
    }

    .area-quick-action:hover{
      background: color-mix(in srgb, currentColor 10%, transparent);
    }

    .area-quick-action:active{
      transform: scale(0.86);
    }

    .area-quick-action ha-icon{
      --mdc-icon-size: 15px;
    }

    .area-mobile-actions{
      grid-column: 3;
      justify-self: end;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .area-mobile-edit{
      position: relative;
    }

    .area-mobile-edit.active{
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .area-mobile-actions .unavailable-entities-icon{
      width: 42px;
      height: 42px;
      margin: 0;
      border-radius: 999px;
    }

    .area-desktop-back{
      display: none;
      width: 42px;
      height: 42px;
      padding: 0;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
        rgba(10, 12, 18, 0.86);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      box-shadow:
        0 18px 40px rgba(0, 0, 0, 0.34),
        inset 0 1px 0 rgba(255, 255, 255, 0.075);
      transition:
        transform 0.18s ease,
        box-shadow 0.18s ease;
    }

    .area-desktop-back:hover{
      transform: translateY(-1px);
      box-shadow:
        0 14px 30px rgba(15, 23, 42, 0.24),
        inset 0 0 0 1px rgba(255, 255, 255, 0.14);
    }

    .area-desktop-back:focus-visible{
      outline: 2px solid var(--primary-color);
      outline-offset: 3px;
    }

    .area-desktop-back ha-icon,
.area-desktop-back .dd-static-icon{
      --mdc-icon-size: 22px;
      width: 22px;
      height: 22px;
    }

    .layout-container.sidebar-collapsed .area-desktop-back{
      display: none;
    }

    .area-title-copy{
      min-width: 0;
    }

    .area-subtitle{
      display: block;
      margin-top: 5px;
      color: color-mix(in srgb, var(--primary-text-color) 55%, transparent);
      font-size: 13px;
      font-weight: 800;
      line-height: 1.2;
      white-space: nowrap;
    }

    .area-header-icon{
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      background: color-mix(in srgb, var(--primary-color) 13%, var(--card-background-color));
      color: var(--primary-color);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 14%, transparent);
    }

    .area-header-icon ha-icon{
      --mdc-icon-size: 26px;
    }

    .area-header.has-picture .area-header-icon{
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
      box-shadow: inset 0 0 0 1px var(--area-header-picture-control-border);
    }

    .area-title{
      margin: 0;
      color: var(--primary-text-color);
      font-size: clamp(30px, 3.1vw, 44px);
      font-weight: 800;
      letter-spacing: 0;
      line-height: 1;
      overflow-wrap: anywhere;
    }

    .area-header.has-picture .area-subtitle{
      color: var(--area-header-picture-muted-text-color, rgba(255, 255, 255, 0.76));
    }

    .area-header.has-picture .area-title{
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header-actions{
      display: none;
      align-items: center;
      gap: 10px;
      flex: 0 0 auto;
    }

    .area-header .dd-edit-toggle{
      margin-left: 0;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.06);
      color: var(--primary-text-color);
    }

    .area-header .dd-edit-toggle:hover,
.area-header .dd-edit-toggle.active{
      background: var(--primary-color);
      color: var(--text-primary-color);
    }

    .area-header.has-picture .dd-edit-toggle{
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header .unavailable-entities-icon{
      margin-bottom: 0;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      background: rgba(255, 152, 0, 0.14);
      color: var(--warning-color);
    }

    .area-header .unavailable-entities-icon ha-icon{
      color: var(--warning-color);
    }

    .area-header.has-picture .unavailable-entities-icon{
      background: var(--area-header-picture-control-bg);
    }

    .area-header.has-picture .unavailable-entities-icon ha-icon{
      color: var(--area-header-picture-text-color, #ffffff);
    }

    .area-header.has-picture .area-mobile-round,
.area-header.has-picture .area-mobile-quick-controls,
.area-header.has-picture .area-mobile-actions .unavailable-entities-icon{
      background: var(--area-header-picture-control-bg);
      color: var(--area-header-picture-text-color, #ffffff);
      box-shadow:
        0 12px 28px rgba(0, 0, 0, 0.18),
        inset 0 0 0 1px var(--area-header-picture-control-border);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .area-header .area-badges{
      display: none;
    }

    .area-header.has-picture .area-badge:not(.light-toggle):not(.switch-toggle){
      background: var(--area-header-picture-control-bg);
      border-color: var(--area-header-picture-control-border);
      color: var(--area-header-picture-text-color, #ffffff);
    }

    @media (min-width: 769px) {
      .area-header{
        min-height: 166px;
        padding: 20px 22px 22px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-areas:
          "nav actions"
          "title metrics"
          "controls metrics";
        align-items: start;
        column-gap: 24px;
        row-gap: 8px;
        border-color: color-mix(in srgb, var(--divider-color) 70%, transparent);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--primary-color) 4%, var(--card-background-color)) 100%);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
      }

      .area-header::before{
        opacity: 0;
      }

      .area-header-content{
        grid-area: title;
        align-self: start;
        margin-top: 2px;
      }

      .area-mobile-toolbar{
        display: contents;
      }

      .area-mobile-home{
        grid-area: nav;
        display: inline-flex;
        align-self: start;
        justify-self: start;
        width: 44px;
        height: 44px;
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow:
          0 18px 40px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.075);
      }

      .area-mobile-quick-controls{
        grid-area: controls;
        min-height: 42px;
        width: min(520px, 100%);
        max-width: 100%;
        margin-top: 4px;
        margin-left: 0;
        align-self: start;
        justify-self: start;
      }

      .area-mobile-quick-controls.count-1{
        width: min(420px, 100%);
      }

      .area-mobile-quick-controls.count-1 .area-quick-control{
        flex: 1 1 auto;
        justify-content: space-between;
      }

      .area-mobile-quick-controls.empty{
        min-height: 0;
        margin: 0;
      }

      .area-mobile-actions{
        grid-area: actions;
        position: relative;
        top: auto;
        right: auto;
        z-index: 5;
        align-self: start;
        justify-self: end;
      }

      .area-header-metrics{
        grid-area: metrics;
        position: relative;
        z-index: 3;
        min-width: 0;
        max-width: min(34vw, 360px);
        margin: 2px 56px 0 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 8px;
      }

      .area-header-metric{
        min-width: 132px;
        min-height: 44px;
        padding: 8px 12px;
        gap: 8px;
        border-radius: 999px;
      }

      .area-header-metric .metric-ring{
        width: 30px;
        height: 30px;
      }

      .area-header-metric .metric-ring::after{
        inset: 4px;
      }

      .area-header-metric .metric-ring.metric-icon ha-icon{
        --mdc-icon-size: 17px;
      }

      .area-header-metric .metric-label{
        font-size: 10px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }

      .area-header-metric .metric-reading{
        margin-top: 2px;
        font-size: 13px;
      }

      .area-title-group{
        gap: 0;
      }

      .area-header-icon{
        display: none;
      }

      .area-title{
        font-size: clamp(24px, 2.4vw, 34px);
        line-height: 1.04;
      }

      .area-subtitle{
        margin-top: 3px;
      }

      .layout-container.sidebar-collapsed .area-mobile-home{
        position: relative;
        top: auto;
        left: auto;
      }

      .layout-container.sidebar-collapsed .area-header-content{
        padding-left: 0;
      }

      .layout-container.sidebar-collapsed .area-mobile-quick-controls{
        margin-left: 0;
      }
    }

    @media (max-width: 768px) {
      :host{
        height: auto;
        min-height: 100%;
        overflow: visible;
      }

      .layout-container{
        display: block;
        height: auto;
        max-height: none;
        min-height: 100dvh;
        overflow: visible;
      }

      .main-content{
        display: block;
        min-height: 100dvh;
        overflow: visible;
      }

      .content-area{
        padding: 0;
        height: auto;
        max-height: none;
        min-height: 100dvh;
        overflow: visible;
        overscroll-behavior: auto;
        -webkit-overflow-scrolling: auto;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 5%, var(--primary-background-color)) 0%,
            var(--primary-background-color) 150px);
      }

      .content-area.home-content-area{
        padding-bottom: 0;
      }

      .content-area.area-content-area{
        padding: 0 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .content-area.settings-content-area{
        padding: 0;
      }

      .home-view{
        padding: 10px 10px calc(128px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-view{
        width: 100%;
        margin: 0;
        padding: 8px 10px calc(152px + env(safe-area-inset-bottom, 0px));
      }

      .settings-page-actions{
        display: none;
      }

      .settings-page-editor{
        border-radius: 18px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      }

      .settings-page-bottom-actions{
        position: sticky;
        bottom: calc(88px + env(safe-area-inset-bottom, 0px));
        z-index: 5;
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: center;
        margin: 12px 0 0;
        padding: 8px;
        border: 1px solid color-mix(in srgb, var(--divider-color) 62%, transparent);
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        box-shadow: 0 16px 34px rgba(15, 23, 42, 0.13);
        backdrop-filter: blur(18px) saturate(170%);
        -webkit-backdrop-filter: blur(18px) saturate(170%);
      }

      .settings-page-bottom-actions .settings-secondary,
.settings-page-bottom-actions .settings-primary{
        width: 100%;
      }

      .global-header.mobile{
        margin: -10px -10px 0;
        padding: 12px 14px 22px;
        border-bottom: 0;
        border-radius: 0 0 8px 8px;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--primary-color) 5%, var(--card-background-color)) 100%);
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .header-content{
        display: block;
      }

      .global-header.mobile .header-status-section{
        width: 100%;
      }

      .global-header.mobile .header-status-scroll{
        gap: 10px;
        padding: 2px 2px 4px;
        scroll-padding: 14px;
      }

      .global-header.mobile .status-card-compact{
        min-width: 112px;
        min-height: 82px;
        padding: 10px 12px 11px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
      }

      .global-header.mobile .status-card-compact .status-card-icon-compact{
        width: 40px;
        height: 40px;
        border-radius: 8px;
      }

      .global-header.mobile .status-card-compact .status-card-title-compact{
        margin-top: 7px;
        color: color-mix(in srgb, var(--primary-text-color) 76%, transparent);
        font-size: 12px;
        line-height: 1.15;
      }

      .global-header.mobile .header-expand-button{
        bottom: -18px;
        width: 36px;
        height: 36px;
        border-width: 2px;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 8px 20px rgba(3, 169, 244, 0.18);
      }

      .area-header{
        position: relative;
        top: auto;
        z-index: 3;
        min-height: 146px;
        margin: 0 -10px 20px;
        padding: calc(14px + env(safe-area-inset-top, 0px)) 22px 24px;
        align-items: center;
        gap: 10px;
        overflow: visible;
        border-radius: 0 0 8px 8px;
        border: 0;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 98%, transparent) 0%,
            color-mix(in srgb, var(--card-background-color) 88%, transparent) 76%,
            color-mix(in srgb, var(--card-background-color) 58%, transparent) 100%);
        backdrop-filter: blur(22px);
        box-shadow: none;
        transition:
          min-height 0.2s ease,
          padding 0.2s ease,
          box-shadow 0.2s ease,
          background-color 0.2s ease;
      }

      .area-header.has-metrics{
        min-height: 248px;
      }

      .area-header.is-stuck{
        position: sticky;
        top: 0;
        z-index: 90;
        min-height: 122px;
        margin-top: 0;
        margin-bottom: 20px;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 18px 10px;
        gap: 7px;
        border-radius: 0;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
      }

      .area-header::before{
        opacity: 0;
      }

      .area-header::after{
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -34px;
        height: 58px;
        z-index: 1;
        pointer-events: none;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 66%, transparent) 0%,
            transparent 100%);
        filter: blur(10px);
        opacity: 0;
        transition: opacity 0.18s ease;
      }

      .area-header.is-stuck::after{
        opacity: 1;
      }

      .area-mobile-toolbar{
        position: relative;
        z-index: 3;
        width: 100%;
        display: grid;
        grid-template-columns: 44px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
      }

      .area-mobile-round{
        width: 38px;
        height: 38px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 94%, transparent);
        color: var(--primary-text-color);
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }

      .area-mobile-round ha-icon,
.area-mobile-round .dd-static-icon{
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }

      .area-header.is-stuck .area-mobile-round{
        width: 34px;
        height: 34px;
      }

      .area-header.is-stuck .area-mobile-round ha-icon{
        --mdc-icon-size: 18px;
      }

      .area-mobile-home{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 6;
        justify-self: start;
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow:
          0 18px 40px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.075);
      }

      .area-header.has-picture .area-mobile-home{
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.72), rgba(8, 10, 15, 0.76)),
          rgba(10, 12, 18, 0.72);
        color: #ffffff;
        backdrop-filter: blur(14px);
        box-shadow:
          0 14px 32px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }

      .area-mobile-quick-controls{
        grid-column: 2;
        justify-self: center;
        max-width: 100%;
        min-height: 40px;
        padding: 4px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        box-shadow:
          0 9px 22px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px rgba(15, 23, 42, 0.05);
      }

      .area-mobile-quick-controls.empty{
        visibility: hidden;
      }

      .area-header.is-stuck .area-mobile-quick-controls{
        min-height: 36px;
        padding: 3px;
      }

      .area-quick-control{
        min-width: 58px;
        height: 34px;
        padding: 0 6px 0 8px;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
        transition:
          background-color 0.18s ease,
          color 0.18s ease,
          transform 0.18s ease;
      }

      .area-quick-main{
        min-width: 0;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .area-quick-control ha-icon{
        --mdc-icon-size: 17px;
        flex: 0 0 auto;
      }

      .area-quick-count{
        color: currentColor;
        font-size: 11px;
        font-weight: 850;
        line-height: 1;
        white-space: nowrap;
      }

      .area-quick-switch{
        position: relative;
        width: 26px;
        height: 16px;
        flex: 0 0 auto;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.12);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.05),
          inset 0 1px 3px rgba(15, 23, 42, 0.12);
        transition:
          background-color 0.18s ease,
          box-shadow 0.18s ease;
      }

      .area-quick-switch::after{
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 1px 4px rgba(15, 23, 42, 0.24);
        transition: transform 0.18s ease;
      }

      .area-quick-control.active .area-quick-switch{
        background: currentColor;
      }

      .area-quick-control.active .area-quick-switch::after{
        transform: translateX(10px);
      }

      .area-quick-direction{
        width: 22px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.08);
        color: currentColor;
      }

      .area-quick-direction ha-icon{
        --mdc-icon-size: 16px;
      }

      .area-header.is-stuck .area-quick-control{
        min-width: 50px;
        height: 30px;
        padding: 0 5px 0 7px;
        gap: 4px;
      }

      .area-header.is-stuck .area-quick-control ha-icon{
        --mdc-icon-size: 15px;
      }

      .area-header.is-stuck .area-quick-count{
        font-size: 10px;
      }

      .area-header.is-stuck .area-quick-switch{
        width: 22px;
        height: 14px;
      }

      .area-header.is-stuck .area-quick-switch::after{
        top: 3px;
        left: 3px;
        width: 8px;
        height: 8px;
      }

      .area-header.is-stuck .area-quick-control.active .area-quick-switch::after{
        transform: translateX(8px);
      }

      .area-header.is-stuck .area-quick-direction{
        width: 20px;
        height: 20px;
      }

      .area-header.is-stuck .area-quick-direction ha-icon{
        --mdc-icon-size: 14px;
      }

      .area-quick-control:active{
        transform: scale(0.94);
      }

      .area-quick-control.active{
        background: #182044;
        color: #ffffff;
      }

      .area-quick-control.light.active{
        color: #ffd047;
      }

      .area-quick-control.switch.active{
        color: #58a9ff;
      }

      .area-quick-control.cover.active{
        color: #b984ff;
      }

      .area-quick-control.fan.active{
        color: #55bda4;
      }

      .area-quick-control.climate.active{
        color: #51aadd;
      }

      .area-mobile-edit{
        position: relative;
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }

      .area-mobile-actions{
        grid-column: 3;
        justify-self: end;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .area-mobile-actions .unavailable-entities-icon{
        width: 38px;
        height: 38px;
        margin: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 999px;
        background: #f44336;
        color: #ffffff;
        box-shadow:
          0 12px 26px rgba(244, 67, 54, 0.28),
          inset 0 0 0 1px rgba(255, 255, 255, 0.2);
      }

      .area-mobile-actions .unavailable-entities-icon ha-icon{
        color: #ffffff;
        --mdc-icon-size: 19px;
      }

      .area-mobile-actions .unavailable-count{
        top: -6px;
        right: -6px;
        background: #ff9800;
        box-shadow: 0 0 0 2px color-mix(in srgb, var(--card-background-color) 92%, transparent);
      }

      .area-mobile-edit.active{
        background: var(--primary-color);
      }

      .area-header-content{
        position: relative;
        z-index: 3;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .area-header.is-stuck .area-header-content{
        gap: 6px;
      }

      .area-header-icon{
        display: none;
      }

      .area-title-group{
        width: 100%;
        justify-content: center;
        gap: 0;
        min-width: 0;
        text-align: center;
      }

      .area-title{
        max-width: min(260px, calc(100vw - 122px));
        margin: 0 auto;
        font-size: 16px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .area-header.is-stuck .area-title{
        font-size: 14px;
      }

      .area-subtitle{
        display: block;
        margin-top: 2px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 13px;
        font-weight: 750;
        line-height: 1.1;
      }

      .area-header.is-stuck .area-subtitle{
        margin-top: 1px;
        font-size: 11px;
      }

      .area-header-metrics{
        position: relative;
        z-index: 3;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-top: 4px;
        transition:
          gap 0.2s ease,
          margin 0.2s ease;
      }

      .area-header-metric{
        min-height: 72px;
        padding: 12px;
        border-radius: 10px;
        background:
          linear-gradient(135deg,
            color-mix(in srgb, var(--metric-color) 13%, var(--card-background-color)) 0%,
            color-mix(in srgb, var(--metric-color) 6%, var(--card-background-color)) 100%);
        box-shadow:
          0 12px 24px rgba(15, 23, 42, 0.06),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
        transition:
          min-height 0.2s ease,
          padding 0.2s ease,
          border-radius 0.2s ease;
      }

      .area-header-metric .metric-ring{
        width: 46px;
        height: 46px;
        transition:
          width 0.2s ease,
          height 0.2s ease;
      }

      .area-header-metric .metric-ring::after{
        transition: inset 0.2s ease;
      }

      .area-header-metric .metric-value,
.area-header-metric .metric-label,
.area-header-metric .metric-range,
.area-header-metric .metric-reading{
        transition:
          font-size 0.2s ease,
          opacity 0.2s ease;
      }

      .area-header.is-stuck .area-header-metrics{
        gap: 8px;
        margin-top: 0;
      }

      .area-header.is-stuck .area-header-metric{
        min-height: 40px;
        padding: 6px 9px;
        gap: 8px;
        border-radius: 8px;
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.05),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
      }

      .area-header.is-stuck .area-header-metric .metric-ring{
        width: 30px;
        height: 30px;
      }

      .area-header.is-stuck .area-header-metric .metric-ring::after{
        inset: 4px;
      }

      .area-header.is-stuck .area-header-metric .metric-value{
        font-size: 9px;
      }

      .area-header.is-stuck .area-header-metric .metric-label{
        font-size: 11px;
      }

      .area-header.is-stuck .area-header-metric .metric-reading{
        font-size: 10px;
      }

      .area-header.is-stuck .area-header-metric .metric-range{
        opacity: 0;
        height: 0;
        margin-top: 0;
        overflow: hidden;
      }

      .area-header-actions{
        display: none;
      }

      .area-header .area-badges{
        position: relative;
        z-index: 3;
        width: 100%;
        display: none;
      }

      .area-header .area-badge{
        min-height: 34px;
        flex: 0 0 auto;
        padding: 0 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 850;
        box-shadow: none;
      }

      .area-header .area-badge.light-toggle,
.area-header .area-badge.switch-toggle{
        min-width: 128px;
        justify-content: center;
      }

      .area-header.has-picture{
        background:
          linear-gradient(180deg,
            rgba(23, 35, 33, 0.74) 0%,
            rgba(23, 35, 33, 0.58) 72%,
            rgba(23, 35, 33, 0.22) 100%);
      }

      .area-header.has-picture .area-subtitle{
        color: rgba(255, 255, 255, 0.72);
      }

      .area-content-area .area-header{
        min-height: 252px;
        margin: 0 -10px 18px;
        padding: calc(18px + env(safe-area-inset-top, 0px)) 18px 18px;
        justify-content: flex-start;
        overflow: hidden;
        border-radius: 0 0 22px 22px;
        color: #ffffff;
        background:
          radial-gradient(circle at 18% 8%, rgba(255, 255, 255, 0.22), transparent 24%),
          linear-gradient(145deg, #182044 0%, #26374d 48%, #586c82 100%);
        box-shadow:
          0 16px 34px rgba(15, 23, 42, 0.14),
          inset 0 -1px 0 rgba(255, 255, 255, 0.24);
      }

      .area-content-area .area-header.has-metrics{
        min-height: 312px;
      }

      .area-content-area .area-header.has-picture{
        background: #0f172a;
      }

      .area-content-area .area-header-background{
        inset: 0;
        background-position: center;
        background-size: cover;
        transform: scale(1.015);
        filter: saturate(1.08) contrast(1.02);
      }

      .area-content-area .area-header::before{
        opacity: 1;
        background:
          linear-gradient(180deg,
            rgba(4, 9, 16, 0.2) 0%,
            rgba(4, 9, 16, 0.02) 36%,
            rgba(4, 9, 16, 0.24) 70%,
            rgba(4, 9, 16, 0.64) 100%);
      }

      .area-content-area .area-header::after{
        bottom: -22px;
        height: 46px;
        opacity: 1;
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.72) 0%,
            color-mix(in srgb, var(--primary-background-color) 86%, transparent) 100%);
        filter: blur(14px);
      }

      .area-content-area .area-mobile-toolbar{
        position: static;
        display: block;
        width: 100%;
        height: 0;
      }

      .area-content-area .area-mobile-home{
        top: calc(18px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions{
        position: absolute;
        top: calc(18px + env(safe-area-inset-top, 0px));
        right: 18px;
        z-index: 6;
        grid-column: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      .area-content-area .area-mobile-round,
.area-content-area .area-mobile-actions .unavailable-entities-icon{
        width: 48px;
        height: 48px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.56);
        background: rgba(255, 255, 255, 0.9);
        color: #14181f;
        backdrop-filter: blur(18px);
        box-shadow:
          0 14px 30px rgba(8, 13, 24, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.62);
      }

      .area-content-area .area-mobile-round ha-icon,
.area-content-area .area-mobile-round .dd-static-icon,
.area-content-area .area-mobile-actions .unavailable-entities-icon ha-icon{
        --mdc-icon-size: 22px;
        width: 22px;
        height: 22px;
        color: currentColor;
      }

      .area-content-area .area-mobile-camera{
        display: inline-flex;
      }

      .area-content-area .area-mobile-edit{
        background: rgba(255, 255, 255, 0.92);
        color: #14181f;
      }

      .area-content-area .area-mobile-edit.active{
        background: var(--primary-color);
        color: var(--text-primary-color);
      }

      .area-content-area .area-mobile-actions .unavailable-entities-icon{
        background: rgba(244, 67, 54, 0.94);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.34);
      }

      .area-content-area .area-mobile-actions .unavailable-count{
        top: -5px;
        right: -5px;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.92);
      }

      .area-content-area .area-header-content{
        position: absolute;
        top: calc(25px + env(safe-area-inset-top, 0px));
        left: 84px;
        right: 84px;
        width: auto;
        z-index: 4;
        justify-content: center;
        pointer-events: none;
      }

      .area-content-area .area-title-group{
        width: 100%;
      }

      .area-content-area .area-title{
        max-width: 100%;
        color: #ffffff;
        font-size: 17px;
        font-weight: 850;
        line-height: 1.05;
        text-shadow: 0 1px 12px rgba(0, 0, 0, 0.42);
      }

      .area-content-area .area-subtitle{
        color: rgba(255, 255, 255, 0.82);
        text-shadow: 0 1px 10px rgba(0, 0, 0, 0.36);
      }

      .area-content-area .area-mobile-quick-controls{
        position: absolute;
        left: 18px;
        right: auto;
        bottom: 18px;
        z-index: 5;
        justify-self: auto;
        max-width: calc(100% - 36px);
        min-height: 42px;
        padding: 5px;
        overflow-x: auto;
        scrollbar-width: none;
        background: rgba(255, 255, 255, 0.9);
        box-shadow:
          0 16px 30px rgba(8, 13, 24, 0.18),
          inset 0 1px 0 rgba(255, 255, 255, 0.66);
      }

      .area-content-area .area-mobile-quick-controls::-webkit-scrollbar{
        display: none;
      }

      .area-content-area .area-mobile-quick-controls.empty{
        display: none;
      }

      .area-content-area .area-header-metrics{
        position: absolute;
        left: 18px;
        right: 18px;
        bottom: 72px;
        z-index: 4;
        width: auto;
        margin: 0;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls{
        bottom: 18px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics{
        bottom: 18px;
      }

      .area-content-area .area-header-metric{
        min-height: 58px;
        padding: 9px 10px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.86);
        backdrop-filter: blur(16px);
        box-shadow:
          0 14px 28px rgba(8, 13, 24, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.62),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 18%, transparent);
      }

      .area-content-area .area-header-metric .metric-ring{
        width: 38px;
        height: 38px;
      }

      .area-content-area .area-header-metric .metric-value,
.area-content-area .area-header-metric .metric-label,
.area-content-area .area-header-metric .metric-range,
.area-content-area .area-header-metric .metric-reading{
        color: #182044;
      }

      .area-content-area .area-header.is-stuck{
        min-height: 88px;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 16px 10px;
        border-radius: 0;
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 94%, transparent) 0%,
            color-mix(in srgb, var(--card-background-color) 86%, transparent) 100%);
        color: var(--primary-text-color);
        backdrop-filter: blur(22px);
      }

      .area-content-area .area-header.is-stuck .area-header-background{
        opacity: 0;
      }

      .area-content-area .area-header.is-stuck::before{
        background: transparent;
      }

      .area-content-area .area-header.is-stuck .area-mobile-home,
.area-content-area .area-header.is-stuck .area-mobile-actions{
        top: calc(8px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.is-stuck .area-mobile-round,
.area-content-area .area-header.is-stuck .area-mobile-actions .unavailable-entities-icon{
        width: 38px;
        height: 38px;
      }

      .area-content-area .area-header.is-stuck .area-mobile-actions{
        flex-direction: row;
        gap: 8px;
      }

      .area-content-area .area-header.is-stuck .area-header-content{
        top: calc(14px + env(safe-area-inset-top, 0px));
        left: 68px;
        right: 100px;
      }

      .area-content-area .area-header.is-stuck .area-title{
        color: var(--primary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck .area-subtitle{
        color: var(--secondary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck .area-header-metrics{
        display: none;
      }

      .area-content-area .area-header{
        min-height: 214px;
        background:
          radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.92), transparent 28%),
          linear-gradient(180deg, #f8fafc 0%, #eef4f8 100%);
        color: var(--primary-text-color);
      }

      .area-content-area .area-header.has-metrics{
        min-height: 214px;
      }

      .area-content-area .area-header.has-picture{
        color: #ffffff;
      }

      .area-content-area .area-header:not(.has-picture)::before{
        background:
          linear-gradient(180deg,
            rgba(255, 255, 255, 0.72) 0%,
            rgba(255, 255, 255, 0.18) 46%,
            rgba(226, 235, 242, 0.78) 100%);
      }

      .area-content-area .area-mobile-home{
        top: calc(16px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions{
        top: calc(16px + env(safe-area-inset-top, 0px));
        right: 18px;
      }

      .area-content-area .area-mobile-round,
.area-content-area .area-mobile-actions .unavailable-entities-icon{
        width: 44px;
        height: 44px;
        background: rgba(255, 255, 255, 0.92);
        box-shadow:
          0 12px 26px rgba(8, 13, 24, 0.16),
          inset 0 1px 0 rgba(255, 255, 255, 0.68);
      }

      .area-content-area .area-mobile-home{
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }

      .area-content-area .area-header-content{
        top: calc(88px + env(safe-area-inset-top, 0px));
        left: 22px;
        right: 24px;
        justify-content: flex-start;
        text-align: left;
      }

      .area-content-area .area-header.has-metrics .area-header-content{
        right: 112px;
      }

      .area-content-area .area-title-group{
        justify-content: flex-start;
        text-align: left;
      }

      .area-content-area .area-title{
        margin: 0;
        max-width: 100%;
        color: var(--primary-text-color);
        font-size: 29px;
        font-weight: 900;
        line-height: 0.98;
        text-align: left;
        text-shadow: none;
      }

      .area-content-area .area-header.has-picture .area-title{
        color: #ffffff;
        text-shadow: 0 1px 16px rgba(0, 0, 0, 0.42);
      }

      .area-content-area .area-subtitle{
        margin-top: 6px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 13px;
        font-weight: 800;
        text-align: left;
        text-shadow: none;
      }

      .area-content-area .area-header.has-picture .area-subtitle{
        color: rgba(255, 255, 255, 0.78);
        text-shadow: 0 1px 12px rgba(0, 0, 0, 0.36);
      }

      .area-content-area .area-header-metrics{
        top: calc(90px + env(safe-area-inset-top, 0px));
        right: 18px;
        bottom: auto;
        left: auto;
        width: auto;
        grid-template-columns: 1fr;
        gap: 6px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics{
        bottom: auto;
      }

      .area-content-area .area-header-metric{
        min-height: 32px;
        padding: 5px 9px 5px 6px;
        gap: 6px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(16px);
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.52),
          0 8px 18px rgba(15, 23, 42, 0.08);
      }

      .area-content-area .area-header.has-picture .area-header-metric{
        background: rgba(255, 255, 255, 0.66);
        box-shadow:
          0 10px 22px rgba(8, 13, 24, 0.16),
          inset 0 0 0 1px rgba(255, 255, 255, 0.22);
      }

      .area-content-area .area-header-metric .metric-ring{
        width: 22px;
        height: 22px;
        background: color-mix(in srgb, var(--metric-color) 14%, transparent);
        box-shadow: none;
      }

      .area-content-area .area-header-metric .metric-ring::after{
        display: none;
      }

      .area-content-area .area-header-metric .metric-ring ha-icon{
        --mdc-icon-size: 15px;
        color: var(--metric-color);
      }

      .area-content-area .area-header-metric .metric-value{
        font-size: 10px;
      }

      .area-content-area .area-header-metric .metric-label{
        display: none;
      }

      .area-content-area .area-header-metric .metric-reading{
        margin-top: 0;
        color: #101827;
        font-size: 12px;
        font-weight: 950;
        line-height: 1;
      }

      .area-content-area .area-header-metric .metric-range{
        display: none;
      }

      .area-content-area .area-mobile-quick-controls{
        top: calc(154px + env(safe-area-inset-top, 0px));
        left: 22px;
        right: 24px;
        bottom: auto;
        margin: 0;
        justify-content: flex-start;
        max-width: calc(100% - 48px);
        width: max-content;
        padding: 0;
        background: transparent;
        box-shadow: none;
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls{
        top: calc(154px + env(safe-area-inset-top, 0px));
        bottom: auto;
      }

      .area-content-area .area-header.has-metrics.has-quick-controls{
        min-height: 214px;
      }

      .area-content-area .area-header.is-stuck{
        min-height: 84px;
      }

      .area-content-area .area-header.is-stuck .area-header-content{
        top: calc(13px + env(safe-area-inset-top, 0px));
        left: 68px;
        right: 106px;
      }

      .area-content-area .area-header.is-stuck .area-title{
        font-size: 16px;
      }

      .area-content-area .area-header{
        box-sizing: border-box;
        min-height: calc(146px + env(safe-area-inset-top, 0px));
        margin: 0 -10px 18px;
        padding: calc(12px + env(safe-area-inset-top, 0px)) 16px 12px;
        border-radius: 0 0 18px 18px;
        background:
          radial-gradient(circle at 10% -8%, color-mix(in srgb, var(--primary-color) 14%, transparent) 0%, transparent 34%),
          radial-gradient(circle at 92% 4%, color-mix(in srgb, #35b7d7 10%, transparent) 0%, transparent 30%),
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color) 6%) 0%,
            color-mix(in srgb, var(--card-background-color) 90%, #dff4fb 10%) 62%,
            color-mix(in srgb, var(--primary-background-color) 82%, var(--card-background-color) 18%) 100%);
        box-shadow:
          0 14px 34px rgba(15, 23, 42, 0.1),
          inset 0 -1px 0 color-mix(in srgb, var(--primary-color) 13%, var(--divider-color));
      }

      .area-content-area .area-header.has-metrics,
.area-content-area .area-header.has-quick-controls,
.area-content-area .area-header.has-metrics.has-quick-controls{
        min-height: calc(154px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-picture{
        min-height: calc(178px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.has-picture.has-metrics,
.area-content-area .area-header.has-picture.has-quick-controls{
        min-height: calc(186px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header:not(.has-picture)::before{
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 42%, transparent) 0%,
            transparent 52%,
            color-mix(in srgb, var(--primary-color) 5%, transparent) 100%);
        opacity: 1;
      }

      .area-content-area .area-header::after{
        bottom: -20px;
        height: 40px;
        opacity: 0.88;
        filter: blur(12px);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color)) 0%,
            transparent 82%);
      }

      .area-content-area .area-mobile-home{
        top: calc(14px + env(safe-area-inset-top, 0px));
        left: 18px;
      }

      .area-content-area .area-mobile-actions{
        top: calc(14px + env(safe-area-inset-top, 0px));
        right: 18px;
        flex-direction: row;
        gap: 8px;
      }

      .area-content-area .area-mobile-round,
.area-content-area .area-mobile-actions .unavailable-entities-icon{
        width: 40px;
        height: 40px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        color: var(--primary-text-color);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.12),
          inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 62%, transparent);
      }

      .area-content-area .area-mobile-home{
        background:
          linear-gradient(180deg, rgba(34, 38, 48, 0.84), rgba(8, 10, 15, 0.9)),
          rgba(10, 12, 18, 0.86);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.1);
      }

      .area-content-area .area-mobile-round ha-icon,
.area-content-area .area-mobile-round .dd-static-icon,
.area-content-area .area-mobile-actions .unavailable-entities-icon ha-icon{
        --mdc-icon-size: 20px;
        width: 20px;
        height: 20px;
      }

      .area-content-area .area-header-content{
        top: calc(58px + env(safe-area-inset-top, 0px));
        left: 20px;
        right: 22px;
        justify-content: flex-start;
      }

      .area-content-area .area-header.has-metrics .area-header-content{
        right: 136px;
      }

      .area-content-area .area-title{
        max-width: 100%;
        font-size: 25px;
        font-weight: 900;
        line-height: 1.02;
        letter-spacing: 0;
      }

      .area-content-area .area-subtitle{
        margin-top: 3px;
        padding-bottom: 5px;
        font-size: 12px;
        font-weight: 800;
        line-height: 1.1;
      }

      .area-content-area .area-header-metrics{
        top: calc(63px + env(safe-area-inset-top, 0px));
        right: 18px;
        left: auto;
        bottom: auto;
        width: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .area-content-area .area-header.has-metrics:not(.has-quick-controls) .area-header-metrics{
        bottom: auto;
      }

      .area-content-area .area-header-metric{
        min-height: 29px;
        height: 29px;
        min-width: 96px;
        padding: 4px 9px 4px 5px;
        gap: 6px;
        border-radius: 999px;
        background:
          linear-gradient(135deg,
            color-mix(in srgb, var(--metric-color) 13%, var(--card-background-color)) 0%,
            color-mix(in srgb, var(--metric-color) 4%, var(--card-background-color)) 100%);
        box-shadow:
          0 8px 18px rgba(15, 23, 42, 0.08),
          inset 0 0 0 1px color-mix(in srgb, var(--metric-color) 16%, transparent);
      }

      .area-content-area .area-header.has-picture .area-header-metric{
        background: rgba(255, 255, 255, 0.76);
      }

      .area-content-area .area-header-metric .metric-ring{
        width: 21px;
        height: 21px;
      }

      .area-content-area .area-header-metric .metric-ring ha-icon{
        --mdc-icon-size: 14px;
      }

      .area-content-area .area-header-metric .metric-copy{
        min-width: 0;
        display: flex;
        align-items: center;
      }

      .area-content-area .area-header-metric .metric-reading{
        max-width: 62px;
        overflow: hidden;
        color: var(--primary-text-color);
        font-size: 12px;
        font-weight: 950;
        text-overflow: ellipsis;
      }

      .area-content-area .area-mobile-quick-controls,
.area-content-area .area-header.has-metrics .area-mobile-quick-controls{
        top: auto;
        bottom: 8px;
        left: 20px;
        right: 20px;
        width: auto;
        max-width: none;
        min-height: 36px;
        padding: 3px;
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        justify-content: stretch;
        overflow-x: auto;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 90%, transparent);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 58%, transparent);
      }

      .area-content-area .area-header:not(.has-metrics) .area-mobile-quick-controls{
        top: auto;
        bottom: 8px;
        right: 20px;
        width: auto;
        max-width: none;
      }

      .area-content-area .area-mobile-quick-controls.count-2{
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-mobile-quick-controls.count-3{
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .area-content-area .area-mobile-quick-controls.count-4,
.area-content-area .area-mobile-quick-controls.count-5{
        display: flex;
        justify-content: flex-start;
        overflow-x: auto;
      }

      .area-content-area .area-mobile-quick-controls.count-4 > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-5 > .area-quick-control{
        flex: 0 0 auto;
        width: auto;
        min-width: 88px;
      }

      .area-content-area .area-mobile-quick-controls.count-1{
        right: auto;
        width: min(148px, calc(50% - 20px));
        min-width: 122px;
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls.count-1{
        right: auto;
        width: min(148px, calc(100% - 176px));
      }

      .area-content-area .area-quick-control{
        min-width: 48px;
        width: 100%;
        height: 30px;
        padding: 0 6px 0 8px;
        justify-content: space-between;
      }

      .area-content-area .area-quick-control ha-icon{
        --mdc-icon-size: 16px;
      }

      .area-content-area .area-quick-count{
        font-size: 10px;
      }

      .area-content-area .area-quick-switch{
        width: 24px;
        height: 15px;
      }

      .area-content-area .area-quick-switch::after{
        top: 3px;
        left: 3px;
        width: 9px;
        height: 9px;
      }

      .area-content-area .area-quick-control.active .area-quick-switch::after{
        transform: translateX(9px);
      }

      .area-content-area .area-quick-direction{
        width: 20px;
        height: 20px;
      }

      .area-content-area .area-quick-direction ha-icon{
        --mdc-icon-size: 14px;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home{
        background: rgba(10, 16, 38, 0.86);
        color: #ffffff;
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.28),
          inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(18px) saturate(1.25);
        -webkit-backdrop-filter: blur(18px) saturate(1.25);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home ha-icon,
.area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-home .dd-static-icon{
        color: #ffffff;
        opacity: 1;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-actions .area-mobile-round{
        background: rgba(255, 255, 255, 0.86);
        color: #0f172a;
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.22),
          inset 0 0 0 1px rgba(255, 255, 255, 0.34);
        backdrop-filter: blur(18px) saturate(1.22);
        -webkit-backdrop-filter: blur(18px) saturate(1.22);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-mobile-quick-controls,
.area-content-area .area-header.has-picture:not(.is-stuck).has-metrics .area-mobile-quick-controls{
        background: rgba(255, 255, 255, 0.9);
        box-shadow:
          0 16px 32px rgba(0, 0, 0, 0.2),
          inset 0 0 0 1px rgba(255, 255, 255, 0.42);
        backdrop-filter: blur(18px) saturate(1.18);
        -webkit-backdrop-filter: blur(18px) saturate(1.18);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control{
        color: rgba(15, 23, 42, 0.66);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.active{
        background: color-mix(in srgb, var(--domain-color, #182044) 16%, rgba(15, 23, 42, 0.06));
        color: var(--domain-color, #182044);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.light{
        --domain-color: #d99a12;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.switch{
        --domain-color: #2f73d6;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.cover{
        --domain-color: #7c4fc7;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.fan{
        --domain-color: #15967f;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.climate{
        --domain-color: #2f9ed6;
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-switch{
        background: rgba(15, 23, 42, 0.16);
      }

      .area-content-area .area-header.has-picture:not(.is-stuck) .area-quick-control.active .area-quick-switch{
        background: var(--domain-color, #182044);
      }

      .area-content-area .area-header{
        position: relative;
        top: auto;
        z-index: 3;
      }

      .area-content-area .area-header.is-stuck,
.area-content-area .area-header.is-stuck.has-metrics,
.area-content-area .area-header.is-stuck.has-quick-controls,
.area-content-area .area-header.is-stuck.has-metrics.has-quick-controls,
.area-content-area .area-header.is-stuck.has-picture,
.area-content-area .area-header.is-stuck.has-picture.has-metrics,
.area-content-area .area-header.is-stuck.has-picture.has-quick-controls{
        position: sticky;
        top: 0;
        z-index: 90;
        min-height: calc(62px + env(safe-area-inset-top, 0px));
        margin-bottom: 4px;
        padding: calc(8px + env(safe-area-inset-top, 0px)) 14px 7px;
        border-radius: 0;
      }

      .area-content-area .area-header.is-stuck .area-mobile-home,
.area-content-area .area-header.is-stuck .area-mobile-actions{
        top: calc(9px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.is-stuck .area-mobile-round,
.area-content-area .area-header.is-stuck .area-mobile-actions .unavailable-entities-icon{
        width: 36px;
        height: 36px;
      }

      .area-content-area .area-header.is-stuck .area-header-content{
        top: calc(10px + env(safe-area-inset-top, 0px));
        left: 66px;
        right: 66px;
      }

      .area-content-area .area-header.is-stuck .area-title{
        font-size: 15px;
        line-height: 1.05;
      }

      .area-content-area .area-header.is-stuck .area-subtitle{
        display: block;
        margin-top: 2px;
        padding-bottom: 0;
        color: color-mix(in srgb, var(--secondary-text-color) 88%, var(--primary-text-color) 12%);
        font-size: 11px;
        font-weight: 800;
        line-height: 1.05;
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck::after,
.area-content-area .area-header.is-stuck .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.has-metrics .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.has-quick-controls .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck .area-header-metrics,
.area-content-area .area-header.is-stuck .area-badges{
        display: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed{
        overflow: visible;
      }

      .area-content-area .area-header.is-stuck.is-revealed::before{
        content: "";
        position: absolute;
        inset: 0 0 auto;
        height: calc(154px + env(safe-area-inset-top, 0px));
        display: block;
        border-radius: 0 0 18px 18px;
        background:
          radial-gradient(circle at 10% -8%, color-mix(in srgb, var(--primary-color) 14%, transparent) 0%, transparent 34%),
          radial-gradient(circle at 92% 4%, color-mix(in srgb, #35b7d7 10%, transparent) 0%, transparent 30%),
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color) 6%) 0%,
            color-mix(in srgb, var(--card-background-color) 90%, #dff4fb 10%) 62%,
            color-mix(in srgb, var(--primary-background-color) 82%, var(--card-background-color) 18%) 100%);
        box-shadow:
          0 14px 34px rgba(15, 23, 42, 0.12),
          inset 0 -1px 0 color-mix(in srgb, var(--primary-color) 13%, var(--divider-color));
        pointer-events: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-content{
        top: calc(58px + env(safe-area-inset-top, 0px));
        left: 20px;
        right: 22px;
        justify-content: flex-start;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-header-content{
        right: 136px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-title{
        font-size: 25px;
        line-height: 1.02;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-subtitle{
        display: block;
        margin-top: 3px;
        padding-bottom: 5px;
        color: color-mix(in srgb, var(--primary-text-color) 52%, transparent);
        font-size: 12px;
        font-weight: 800;
        line-height: 1.1;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-picture .area-title,
.area-content-area .area-header.is-stuck.is-revealed.has-picture .area-subtitle{
        color: var(--primary-text-color);
        text-shadow: none;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-metrics{
        top: calc(63px + env(safe-area-inset-top, 0px));
        right: 18px;
        left: auto;
        bottom: auto;
        width: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-quick-controls .area-mobile-quick-controls{
        top: calc(110px + env(safe-area-inset-top, 0px));
        bottom: auto;
        left: 20px;
        right: 20px;
        width: auto;
        max-width: none;
        min-height: 36px;
        padding: 3px;
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        justify-content: stretch;
        border-radius: 999px;
        background: color-mix(in srgb, var(--card-background-color) 90%, transparent);
        box-shadow:
          0 10px 24px rgba(15, 23, 42, 0.1),
          inset 0 0 0 1px color-mix(in srgb, var(--divider-color) 58%, transparent);
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-2{
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-3{
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.count-1{
        right: auto;
        width: min(148px, calc(50% - 20px));
        min-width: 122px;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls.count-1{
        right: auto;
        width: min(148px, calc(100% - 176px));
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls.empty{
        display: none;
      }

      /*
       * Mobile HA already lays the dashboard out below the iOS/top safe area.
       * Adding env(safe-area-inset-top) inside DD Next a second time creates the
       * large empty strip visible above the home greeting and room controls.
       */
      .home-welcome{
        padding-top: 16px;
      }

      .area-content-area .area-header:not(.is-stuck),
.area-content-area .area-header:not(.is-stuck).has-metrics,
.area-content-area .area-header:not(.is-stuck).has-quick-controls,
.area-content-area .area-header:not(.is-stuck).has-metrics.has-quick-controls{
        min-height: 174px;
      }

      .area-content-area .area-header:not(.is-stuck).has-picture,
.area-content-area .area-header:not(.is-stuck).has-picture.has-metrics,
.area-content-area .area-header:not(.is-stuck).has-picture.has-quick-controls{
        min-height: 194px;
      }

      .area-content-area .area-mobile-home,
.area-content-area .area-mobile-actions{
        top: 14px;
      }

      .area-content-area .area-header-content,
.area-content-area .area-header.has-metrics .area-header-content{
        top: 58px;
      }

      .area-content-area .area-header-metrics{
        top: 63px;
      }

      /*
       * Quick controls are compact controls,
not a full-width second toolbar.
       * Keeping them content-sized prevents the switch thumb from ending up
       * visually detached at the far right edge of the header.
       */
      .area-content-area .area-mobile-quick-controls,
.area-content-area .area-header.has-metrics .area-mobile-quick-controls,
.area-content-area .area-header.has-quick-controls .area-mobile-quick-controls{
        top: auto;
        right: auto;
        bottom: 10px;
        left: 20px;
        width: max-content;
        max-width: calc(100% - 40px);
        display: flex;
        grid-template-columns: none;
        justify-content: flex-start;
        overflow-x: auto;
      }

      .area-content-area .area-header.has-metrics .area-mobile-quick-controls{
        max-width: calc(100% - 154px);
      }

      .area-content-area .area-mobile-quick-controls > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-1 > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-2 > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-3 > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-4 > .area-quick-control,
.area-content-area .area-mobile-quick-controls.count-5 > .area-quick-control{
        width: auto;
        min-width: 88px;
        flex: 0 0 auto;
      }

      .area-content-area .area-header.is-stuck,
.area-content-area .area-header.is-stuck.has-metrics,
.area-content-area .area-header.is-stuck.has-quick-controls,
.area-content-area .area-header.is-stuck.has-metrics.has-quick-controls{
        min-height: 62px;
        padding-top: 8px;
      }

      .area-content-area .area-header.is-stuck .area-mobile-home,
.area-content-area .area-header.is-stuck .area-mobile-actions{
        top: 9px;
      }

      .area-content-area .area-header.is-stuck .area-header-content{
        top: 10px;
      }

      .area-content-area .area-header.is-stuck.is-revealed,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics,
.area-content-area .area-header.is-stuck.is-revealed.has-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics.has-quick-controls{
        min-height: 174px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-content,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-header-content{
        top: 58px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-header-metrics{
        top: 63px;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-quick-controls .area-mobile-quick-controls{
        top: auto;
        bottom: 10px;
        left: 20px;
        right: auto;
        width: max-content;
        max-width: calc(100% - 40px);
        display: flex;
      }

      .area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls{
        max-width: calc(100% - 154px);
      }

      /* Keep the expanded room header geometrically honest: earlier variants used a
         short physical header plus absolutely-positioned content,
which could overlap
         the subtitle and the first controls row on iPhone-sized viewports. */
      .area-content-area .area-header:not(.is-stuck),
.area-content-area .area-header:not(.is-stuck).has-metrics,
.area-content-area .area-header:not(.is-stuck).has-quick-controls,
.area-content-area .area-header:not(.is-stuck).has-metrics.has-quick-controls{
        min-height: calc(174px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header:not(.is-stuck).has-picture,
.area-content-area .area-header:not(.is-stuck).has-picture.has-metrics,
.area-content-area .area-header:not(.is-stuck).has-picture.has-quick-controls{
        min-height: calc(194px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header:not(.is-stuck) .area-mobile-quick-controls,
.area-content-area .area-header:not(.is-stuck).has-metrics .area-mobile-quick-controls,
.area-content-area .area-header:not(.is-stuck).has-quick-controls .area-mobile-quick-controls{
        top: auto;
        bottom: 10px;
      }

      .area-content-area .area-header.is-stuck.is-revealed,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics,
.area-content-area .area-header.is-stuck.is-revealed.has-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics.has-quick-controls{
        min-height: calc(174px + env(safe-area-inset-top, 0px));
      }

      .area-content-area .area-header.is-stuck.is-revealed::before{
        height: 100%;
      }

      .area-content-area .area-header.is-stuck.is-revealed .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-metrics .area-mobile-quick-controls,
.area-content-area .area-header.is-stuck.is-revealed.has-quick-controls .area-mobile-quick-controls{
        top: auto;
        bottom: 10px;
      }

      .area-view .entities-section,
.area-view .dd-custom-section{
        position: relative;
        z-index: 2;
      }

      .area-view .entities-section{
        display: none;
      }

      .mobile-area-overview{
        display: block;
        position: relative;
        z-index: 2;
        margin: 12px 0 20px;
      }

      .mobile-entities-section{
        display: grid;
        position: relative;
        z-index: 2;
      }







      .mobile-area-picker-head{
        min-height: 42px;
        margin: 0 2px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .mobile-area-picker-title{
        min-width: 0;
        color: var(--primary-text-color);
        font-size: 20px;
        font-weight: 850;
        line-height: 1.1;
      }

      .mobile-area-picker-close{
        width: 38px;
        height: 38px;
        padding: 0;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        background: color-mix(in srgb, var(--card-background-color) 92%, transparent);
        color: var(--primary-text-color);
      }

      .mobile-area-picker-close ha-icon{
        --mdc-icon-size: 21px;
      }

      .sidebar .area-list{
        padding: 0;
      }

      .sidebar .floor-section{
        margin-bottom: 12px;
      }

      .sidebar .floor-header{
        padding: 6px 12px 9px;
      }

      .sidebar .floor-header h3{
        font-size: 13px;
        font-weight: 850;
        letter-spacing: 0;
        text-transform: none;
      }

      .sidebar .area-button{
        min-height: 64px;
        height: auto;
        margin-bottom: 8px;
        padding: 11px 12px 11px 56px;
        border-radius: 9px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--card-background-color) 97%, #ffffff),
            color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color)));
        box-shadow:
          0 10px 22px rgba(15, 23, 42, 0.07),
          inset 0 1px 0 rgba(255, 255, 255, 0.42);
      }

      .sidebar .area-button.home-button{
        height: 48px;
        min-height: 48px;
        padding: 10px 14px 10px 54px;
        border-radius: 8px;
      }

      .sidebar .area-button.home-button .area-icon{
        position: absolute;
        left: 12px;
        top: 50%;
        width: 34px;
        height: 34px;
        transform: translateY(-50%);
        border-radius: 999px;
      }

      .sidebar .area-button.selected,
.sidebar .area-button.home-button.selected{
        border-color: color-mix(in srgb, var(--primary-color) 42%, transparent);
        background:
          linear-gradient(180deg,
            color-mix(in srgb, var(--primary-color) 88%, #ffffff 10%),
            var(--primary-color));
        color: var(--text-primary-color);
        box-shadow:
          0 14px 28px color-mix(in srgb, var(--primary-color) 24%, transparent),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .sidebar .area-content{
        min-height: 42px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-rows: auto auto;
        align-items: center;
        gap: 3px 10px;
      }

      .sidebar .area-top-section{
        min-width: 0;
        margin-top: 0;
        grid-column: 1;
        grid-row: 1 / span 2;
      }

      .sidebar .area-bottom-section{
        display: contents;
        min-height: 0;
      }

      .sidebar .area-main-icon{
        position: absolute;
        left: -44px;
        top: 50%;
        bottom: auto;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        transform: translateY(-50%);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        box-shadow: none;
      }

      .sidebar .area-main-icon ha-icon{
        --mdc-icon-size: 20px;
      }

      .sidebar .area-button.has-picture{
        min-height: 70px;
        color: var(--area-picture-text-color, #ffffff);
        border-color: rgba(255, 255, 255, 0.18);
        background: #182044;
      }

      .sidebar .area-button.has-picture.selected{
        border-color: color-mix(in srgb, var(--primary-color) 44%, rgba(255, 255, 255, 0.18));
        box-shadow:
          0 14px 30px rgba(15, 23, 42, 0.18),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 34%, transparent);
      }

      .sidebar .area-button.has-picture::after{
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        background: var(--area-picture-overlay);
        pointer-events: none;
      }

      .sidebar .area-button.has-picture .area-background{
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-content,
.sidebar .area-button.has-picture .area-info-badges,
.sidebar .area-button.has-picture .area-main-icon{
        z-index: 1;
      }

      .sidebar .area-info-badges{
        position: relative;
        top: auto;
        right: auto;
        grid-column: 2;
        grid-row: 1 / span 2;
        max-width: 130px;
        justify-content: flex-end;
        align-self: center;
        gap: 5px;
      }

      .sidebar .area-name{
        max-width: 100%;
        margin: 0;
        font-size: 15px;
        font-weight: 850;
        line-height: 1.1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .area-sensors{
        margin-top: 4px;
        color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.1;
      }

      .sidebar .area-button.has-picture .area-sensors{
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .info-badge{
        min-width: 24px;
        height: 22px;
        padding: 0 7px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
      }

      .sidebar .info-badge ha-icon{
        --mdc-icon-size: 13px;
      }

      .sidebar .badge-count{
        font-size: 11px;
        font-weight: 850;
      }

      .sidebar .area-button.has-picture .info-badge{
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
      }

      .sidebar .area-button.selected .area-main-icon,
.sidebar .area-button.selected .area-icon{
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
        color: var(--primary-color);
      }

      .sidebar .area-list{
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-section{
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
        margin-bottom: 10px;
      }

      .sidebar .floor-areas{
        display: grid;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 8px;
      }

      .sidebar .floor-header{
        margin: 0;
        padding: 4px 6px 2px;
      }

      .sidebar .floor-header h3{
        color: var(--secondary-text-color);
        font-size: 14px;
        font-weight: 760;
        line-height: 1.2;
      }

      .sidebar .area-button,
.sidebar .area-button.home-button{
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr) auto 22px;
        align-items: center;
        gap: 12px;
        min-height: 68px;
        height: auto;
        margin: 0;
        padding: 10px 12px;
        border-radius: 8px;
        border: 1px solid rgba(15, 23, 42, 0.06);
        background: rgba(255, 255, 255, 0.92);
        color: var(--primary-text-color);
        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
        transform: none;
      }

      .sidebar .area-button:hover{
        transform: translateY(-1px);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.09);
      }

      .sidebar .area-button.selected,
.sidebar .area-button.home-button.selected{
        border-color: color-mix(in srgb, var(--primary-color) 58%, transparent);
        background: color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 10%);
        color: var(--primary-text-color);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.1),
          inset 4px 0 0 var(--primary-color),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent);
      }

      .sidebar .area-button.home-button .area-icon,
.sidebar .area-icon,
.sidebar .area-main-icon{
        position: relative;
        left: auto;
        top: auto;
        bottom: auto;
        grid-column: 1;
        grid-row: 1;
        width: 46px;
        height: 46px;
        border-radius: 8px;
        transform: none;
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
        color: var(--primary-color);
        box-shadow: none;
      }

      .sidebar .area-button.home-button .area-icon{
        position: relative;
        left: auto;
        top: auto;
      }

      .sidebar .area-main-icon ha-icon,
.sidebar .area-icon ha-icon{
        --mdc-icon-size: 24px;
        color: currentColor;
      }

      .sidebar .area-content{
        display: contents;
        width: auto;
        height: auto;
        min-height: 0;
      }

      .sidebar .area-info,
.sidebar .area-top-section{
        grid-column: 2;
        grid-row: 1;
        min-width: 0;
        margin: 0;
      }

      .sidebar .area-bottom-section{
        display: contents;
      }

      .sidebar .area-name{
        margin: 0;
        color: inherit;
        font-size: 15px;
        font-weight: 750;
        line-height: 1.1;
      }

      .sidebar .area-sensors{
        margin-top: 4px;
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 500;
        line-height: 1.1;
      }

      .sidebar .area-info-badges{
        position: relative;
        top: auto;
        right: auto;
        grid-column: 3;
        grid-row: 1;
        max-width: 104px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 4px;
        z-index: 1;
      }

      .sidebar .area-menu-chevron{
        display: block;
        grid-column: 4;
        grid-row: 1;
        z-index: 1;
        --mdc-icon-size: 22px;
        color: rgba(15, 23, 42, 0.52);
        transition: transform 0.18s ease, color 0.18s ease;
      }

      .sidebar .home-notification-shortcut{
        grid-column: 3;
        grid-row: 1;
        justify-self: end;
        width: auto;
        min-width: 44px;
        height: 30px;
        margin-left: 0;
      }

      .sidebar .area-button.selected .area-menu-chevron{
        color: var(--primary-color);
        transform: translateX(2px);
      }

      .sidebar .area-button.has-picture{
        min-height: 68px;
        border-color: rgba(15, 23, 42, 0.12);
        background: rgba(18, 24, 38, 0.9);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.selected{
        border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.48);
        background: rgba(18, 24, 38, 0.92);
        box-shadow:
          0 14px 28px rgba(15, 23, 42, 0.16),
          inset 3px 0 0 var(--primary-color);
      }

      .sidebar .area-button.has-picture .area-background{
        opacity: 0.78;
        transform: scale(1.02);
      }

      .sidebar .area-button.has-picture .area-top-section,
.sidebar .area-button.has-picture .area-name,
.sidebar .area-button.has-picture .area-sensors,
.sidebar .area-button.has-picture .area-menu-chevron,
.sidebar .area-button.has-picture .area-info-badges,
.sidebar .area-button.has-picture .area-main-icon,
.sidebar .area-button.has-picture .area-icon{
        position: relative;
        z-index: 2;
      }

      .sidebar .area-button.has-picture::after{
        background: var(--area-picture-overlay);
      }

      .sidebar .area-button.has-picture .area-name{
        width: fit-content;
        max-width: 100%;
        padding: 4px 8px;
        margin-left: -2px;
        border-radius: 8px;
        color: #ffffff;
        background: linear-gradient(90deg, rgba(8, 13, 24, 0.66), rgba(8, 13, 24, 0.28));
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(2px);
      }

      .sidebar .area-button.has-picture .area-main-icon,
.sidebar .area-button.has-picture .area-icon{
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
        backdrop-filter: blur(10px);
      }

      .sidebar .area-button.has-picture .area-sensors,
.sidebar .area-button.has-picture .area-menu-chevron{
        color: var(--area-picture-muted-text-color, rgba(255, 255, 255, 0.72));
      }

      .sidebar .area-button.has-picture.selected .area-menu-chevron{
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .area-main-icon,
.sidebar .area-button.has-picture.text-dark .area-icon{
        background: rgba(255, 255, 255, 0.18);
        color: var(--area-picture-text-color, #ffffff);
      }

      .sidebar .area-button.has-picture.text-dark .info-badge{
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 18%, rgba(255, 255, 255, 0.88));
        color: var(--badge-color, var(--primary-color));
      }

      .mobile-nav-overlay{
        z-index: 140 !important;
        background: rgba(8, 13, 24, 0.18);
        backdrop-filter: blur(3px);
      }

      :host([data-theme-dark]){




        .sidebar .floor-header h3 {
          color: color-mix(in srgb, var(--primary-text-color) 58%, transparent);
        }

        .sidebar .area-button {
          border: 1px solid rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 86%, #ffffff 4%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 4%));
          color: var(--primary-text-color);
          box-shadow: 0 10px 22px rgba(0, 0, 0, 0.24);
        }

        .sidebar .area-button.selected,
        .sidebar .area-button.home-button.selected {
          border-color: color-mix(in srgb, var(--primary-color) 42%, transparent);
          background:
            linear-gradient(180deg,
              color-mix(in srgb, var(--card-background-color) 90%, var(--primary-color) 12%),
              color-mix(in srgb, var(--card-background-color) 96%, #000000 5%));
          color: var(--primary-text-color);
          box-shadow:
            0 14px 30px rgba(0, 0, 0, 0.36),
            inset 3px 0 0 var(--primary-color),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .sidebar .area-button.has-picture {
          border-color: rgba(255, 255, 255, 0.08);
          background: #17202b;
        }

        .sidebar .area-button.has-picture .area-background {
          opacity: 0.58;
        }

        .sidebar .area-button.has-picture:hover .area-background {
          opacity: 0.66;
        }

        .sidebar .area-main-icon,
        .sidebar .area-icon {
          background: color-mix(in srgb, var(--primary-color) 22%, transparent);
          color: var(--primary-color);
        }

        .sidebar .area-button.selected .area-main-icon,
        .sidebar .area-button.selected .area-icon {
          background: color-mix(in srgb, var(--primary-color) 24%, transparent);
          color: var(--primary-color);
        }

        .sidebar .area-menu-chevron,
        .sidebar .area-button.selected .area-menu-chevron {
          color: color-mix(in srgb, var(--primary-text-color) 62%, transparent);
        }

        .sidebar .area-button.selected .area-menu-chevron {
          color: var(--primary-color);
        }

        .sidebar .area-sensors,
        .sidebar .area-bottom-section {
          color: color-mix(in srgb, var(--primary-text-color) 68%, transparent);
        }

        .sidebar .info-badge {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .home-notification-shortcut {
          color: #ff9a9a;
          background: rgba(239, 68, 68, 0.16);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 8px 18px rgba(0, 0, 0, 0.18);
        }

        .mobile-nav-overlay {
          background: rgba(0, 0, 0, 0.58);
          backdrop-filter: blur(4px);
        }
      }

      .home-content-area{
        max-width: 100% !important;
        overflow-x: hidden !important;
      }

      .home-view .home-favorites-section{
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 -10px 44px !important;
        padding: 0 !important;
        overflow: visible !important;
      }

      .home-view .home-favorites-section .favorites-grid{
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
      }

      .home-view .home-favorites-section .favorite-card-wrapper{
        max-width: 100% !important;
        min-width: 0 !important;
      }
    }

    /* Settings shell correction */
    .settings-page-view{
      width: min(840px, calc(100% - 32px));
      padding-top: 18px;
    }

    @media (max-width: 768px) {
      .settings-page-view{
        width: 100%;
      }
    }

    /* Room navigation: fixed media slot for either a photo or the HA pictogram. */
    .area-media{
      position: relative;
      flex: 0 0 auto;
      overflow: hidden;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-color) 9%, var(--secondary-background-color));
    }

    .area-media-picture{
      position: absolute;
      inset: 0;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .area-media-icon{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-color) 82%, var(--primary-text-color));
      background:
        linear-gradient(145deg,
          color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color)),
          color-mix(in srgb, var(--primary-color) 6%, var(--secondary-background-color)));
    }

    .area-media-icon ha-icon{
      --mdc-icon-size: 34px;
    }

    @media (min-width: 769px) {
      .sidebar .room-area-button{
        display: grid;
        grid-template-columns: 74px minmax(0, 1fr);
        align-items: stretch;
        gap: 10px;
        min-height: 92px;
        height: 92px;
        padding: 8px;
        border-radius: 12px;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        color: var(--primary-text-color);
        box-shadow: 0 8px 18px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      }

      .sidebar .room-area-button.has-picture{
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        border-color: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      }

      .sidebar .room-area-button.has-picture::after{
        display: none;
      }

      .sidebar .room-area-button.selected,
.sidebar .room-area-button.has-picture.selected{
        color: var(--primary-text-color);
        border-color: color-mix(in srgb, var(--primary-color) 58%, transparent);
        background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
        box-shadow:
          0 10px 22px color-mix(in srgb, var(--primary-color) 12%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 14%, transparent);
      }

      .sidebar .room-area-button .area-media{
        width: 74px;
        height: 74px;
        align-self: center;
        grid-column: 1;
      }

      .sidebar .room-area-button .area-content{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        gap: 7px;
        min-width: 0;
        height: auto;
        grid-column: 2;
      }

      .sidebar .room-area-button .area-top-section{
        min-width: 0;
        margin: 0;
      }

      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        color: var(--primary-text-color);
        text-shadow: none;
        font-size: 14px;
        font-weight: 850;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        margin-top: 3px;
        color: var(--secondary-text-color);
        text-shadow: none;
        font-size: 11px;
        font-weight: 650;
      }

      .sidebar .room-area-button .area-info-badges{
        position: static;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        width: 100%;
        max-width: none;
        overflow: hidden;
      }

      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 27px;
        height: 21px;
        padding: 0 5px;
        flex: 0 0 auto;
        color: var(--badge-color, var(--primary-color));
        background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 11%, var(--card-background-color));
        border: 1px solid color-mix(in srgb, var(--badge-color, var(--primary-color)) 20%, transparent);
        box-shadow: none;
        backdrop-filter: none;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 12px;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 10px;
      }

      .sidebar .room-area-button .area-menu-chevron,
.sidebar .room-area-button .area-main-icon{
        display: none;
      }
    }

    @media (max-width: 768px) {
      .sidebar .room-area-button{
        display: grid;
        grid-template-columns: 64px minmax(0, 1fr);
        gap: 10px;
        min-height: 80px;
        padding: 8px;
      }

      .sidebar .room-area-button .area-media{
        width: 64px;
        height: 64px;
      }

      .sidebar .room-area-button .area-content{
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
        gap: 6px;
      }

      .sidebar .room-area-button .area-info-badges{
        position: static;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        gap: 4px;
        max-width: none;
        overflow: hidden;
      }

      .sidebar .room-area-button .info-badge{
        min-width: 26px;
        height: 21px;
        padding: 0 5px;
      }

      .sidebar .room-area-button .area-menu-chevron{
        display: none;
      }
    }


    /*
     * iOS/mobile room switcher: keep the room photo as a very soft card
     * background while preserving the small media preview at full contrast.
     * The legacy picture treatment darkened the complete card and its overlay
     * could visually escape the rounded corners.
     */
    @media (max-width: 768px) {
      .sidebar .room-area-button{
        overflow: hidden;
        isolation: isolate;
        border-radius: 12px;
      }

      .sidebar .room-area-button.has-picture{
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
        border-color: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }

      .sidebar .room-area-button.has-picture.selected{
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color));
        border-color: color-mix(in srgb, var(--primary-color) 46%, transparent);
      }

      .sidebar .room-area-button.has-picture .area-background{
        inset: 0;
        z-index: 0;
        opacity: 0.13;
        transform: none;
        border-radius: inherit;
        background-position: center;
        background-size: cover;
        pointer-events: none;
      }

      .sidebar .room-area-button.has-picture:hover .area-background{
        opacity: 0.16;
      }

      .sidebar .room-area-button.has-picture::after{
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
        border-radius: inherit;
        background: color-mix(in srgb, var(--card-background-color) 34%, transparent);
        pointer-events: none;
      }

      .sidebar .room-area-button.has-picture .area-media,
      .sidebar .room-area-button.has-picture .area-content,
      .sidebar .room-area-button.has-picture .area-info-badges{
        position: relative;
        z-index: 2;
      }

      .sidebar .room-area-button.has-picture .area-media{
        overflow: hidden;
        border-radius: 10px;
        background: var(--secondary-background-color);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      }

      .sidebar .room-area-button.has-picture .area-media-picture{
        opacity: 1;
        transform: none;
        filter: none;
      }

      .sidebar .room-area-button.has-picture .area-name{
        width: auto;
        max-width: 100%;
        margin: 0;
        padding: 0;
        color: var(--primary-text-color);
        background: transparent;
        text-shadow: none;
        backdrop-filter: none;
      }

      .sidebar .room-area-button.has-picture .area-sensors{
        color: var(--secondary-text-color);
        text-shadow: none;
      }

      .sidebar .room-area-button.has-picture .info-badge{
        backdrop-filter: none;
      }
    }

    /* Favorites are a dedicated layer between house information and room content. */
    .area-favorites-toggle{
      width: calc(100% - 32px);
      min-height: 40px;
      margin: 0 16px 10px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border: 1px solid color-mix(in srgb, var(--divider-color) 82%, transparent);
      border-radius: 10px;
      background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
      color: var(--primary-text-color);
      cursor: pointer;
    }

    .area-favorites-toggle-main{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      font-size: 14px;
      font-weight: 850;
    }

    .area-favorites-toggle-main > ha-icon{
      --mdc-icon-size: 18px;
      color: var(--primary-color);
    }

    .area-favorites-count{
      color: var(--secondary-text-color);
      font-weight: 700;
    }

    .global-header .header-expanded-content{
      padding-top: 0;
    }

    .global-header .header-favorites .favorites-header{
      display: none;
    }

    .mobile-domain-master{
      min-width: 76px;
    }

    .mobile-domain-master-count{
      min-width: 25px;
      color: currentColor;
      font-size: 11px;
      font-weight: 850;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
    }

    /* Window/door/opening state is expressed by its icon/status badge,
not a tinted whole card. */
    .mobile-entity-card.mobile-entity-binary_sensor.device-window.is-active,
.mobile-entity-card.mobile-entity-binary_sensor.device-door.is-active,
.mobile-entity-card.mobile-entity-binary_sensor.device-opening.is-active{
      background: color-mix(in srgb, var(--card-background-color) 96%, var(--primary-background-color));
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
    }


    /* Final desktop room redesign: compact sidebar cards + compact room header. */
    @media (min-width: 769px) {
      .sidebar .room-area-button{
        grid-template-columns: 58px minmax(0, 1fr);
        gap: 8px;
        min-height: 76px;
        height: 76px;
        padding: 8px;
        margin-bottom: 7px;
        border-radius: 11px;
        box-shadow: 0 5px 14px color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      }

      .sidebar .room-area-button .area-media{
        width: 58px;
        height: 58px;
        border-radius: 9px;
      }

      .sidebar .room-area-button .area-media-icon{
        color: color-mix(in srgb, var(--primary-color) 84%, var(--primary-text-color));
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 8%, transparent);
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: 27px;
      }

      .sidebar .room-area-button .area-content{
        gap: 4px;
        justify-content: center;
      }

      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        font-size: 13px;
        font-weight: 850;
        line-height: 1.15;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        margin-top: 2px;
        font-size: 10px;
        line-height: 1.15;
      }

      .sidebar .room-area-button .area-info-badges{
        gap: 3px;
        min-height: 19px;
      }

      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 24px;
        height: 19px;
        padding: 0 4px;
        border-radius: 999px;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 11px;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 9px;
      }

      .sidebar .room-area-button.selected,
.sidebar .room-area-button.has-picture.selected{
        border-color: color-mix(in srgb, var(--primary-color) 54%, transparent);
        background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
        box-shadow:
          0 7px 18px color-mix(in srgb, var(--primary-color) 10%, transparent),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent);
      }

      .area-header.area-header-desktop-compact{
        position: relative;
        min-height: 0;
        margin: 0 0 18px;
        padding: 14px 16px;
        display: grid;
        grid-template-columns: 68px minmax(190px, 1fr) auto auto;
        align-items: center;
        gap: 16px;
        overflow: visible;
        border-radius: 12px;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        background: color-mix(in srgb, var(--card-background-color) 98%, var(--primary-background-color));
        color: var(--primary-text-color);
        box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
      }

      .area-header.area-header-desktop-compact::before{
        display: none;
      }

      .area-desktop-room-media{
        position: relative;
        width: 68px;
        height: 68px;
        overflow: hidden;
        border-radius: 10px;
        background: color-mix(in srgb, var(--primary-color) 8%, var(--secondary-background-color));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 8%, transparent);
      }

      .area-desktop-room-picture{
        position: absolute;
        inset: 0;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }

      .area-desktop-room-icon{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: color-mix(in srgb, var(--primary-color) 86%, var(--primary-text-color));
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
      }

      .area-desktop-room-icon ha-icon{
        --mdc-icon-size: 31px;
      }

      .area-desktop-room-copy{
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
      }

      .area-header-desktop-compact .area-title{
        margin: 0;
        font-size: clamp(26px, 2.15vw, 36px);
        line-height: 1;
        color: var(--primary-text-color);
      }

      .area-desktop-room-meta{
        color: var(--secondary-text-color);
        font-size: 12px;
        font-weight: 750;
        line-height: 1.2;
        white-space: nowrap;
      }

      .area-header-desktop-compact .area-header-metrics{
        position: static;
        z-index: auto;
        min-width: 0;
        max-width: none;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: nowrap;
        gap: 8px;
      }

      .area-header-desktop-compact .area-header-metric{
        min-width: 132px;
        min-height: 44px;
        padding: 7px 11px;
        gap: 8px;
        border-radius: 999px;
      }

      .area-header-desktop-compact .area-header-metric .metric-ring{
        width: 30px;
        height: 30px;
      }

      .area-header-desktop-compact .area-header-metric .metric-label{
        font-size: 9px;
      }

      .area-header-desktop-compact .area-header-metric .metric-reading{
        font-size: 13px;
      }

      .area-header-desktop-compact .area-header-actions{
        position: static;
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        min-width: max-content;
      }

      .area-header-desktop-compact .area-header-actions .unavailable-entities-icon,
.area-header-desktop-compact .area-header-actions .area-mobile-camera,
.area-header-desktop-compact .area-header-actions .dd-edit-toggle{
        width: 42px;
        height: 42px;
        margin: 0;
        border-radius: 999px;
      }

      .area-header-desktop-compact .area-mobile-toolbar,
.area-header-desktop-compact .area-mobile-home,
.area-header-desktop-compact .area-mobile-quick-controls,
.area-header-desktop-compact .area-badges,
.area-header-desktop-compact .area-header-content{
        display: none;
      }
    }

    @media (min-width: 769px) and (max-width: 1120px) {
      .area-header.area-header-desktop-compact{
        grid-template-columns: 58px minmax(150px, 1fr) auto;
        gap: 12px;
      }

      .area-desktop-room-media{
        width: 58px;
        height: 58px;
      }

      .area-header-desktop-compact .area-header-metrics{
        grid-column: 2;
        justify-content: flex-start;
        margin-top: 4px;
      }

      .area-header-desktop-compact .area-header-actions{
        grid-column: 3;
        grid-row: 1 / span 2;
      }
    }


    /* Responsive room UI v3 — desktop reference is the base;
       mobile only changes flow,
scale and navigation. */

    .global-header{
      padding: 8px 16px 6px;
      border-bottom: 0;
      background: var(--primary-background-color);
    }

    .global-header .header-content{
      width: 100%;
      min-height: 54px;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-sizing: border-box;
    }

    .header-status-section{
      min-width: 0;
      flex: 1 1 auto;
    }

    .header-status-scroll{
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .header-status-scroll::-webkit-scrollbar{ display: none; }

    .status-card-compact{
      width: auto;
      min-width: 140px;
      max-width: 194px;
      height: 50px;
      min-height: 50px;
      padding: 7px 9px 7px 12px;
      flex: 0 0 auto;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 32px minmax(0, 1fr);
      grid-template-rows: 1fr 1fr;
      align-items: center;
      column-gap: 8px;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-radius: 8px;
      background: var(--card-background-color);
      box-shadow: 0 3px 10px rgba(15, 23, 42, 0.045);
    }

    .status-card-compact .status-card-icon-compact{
      grid-column: 1;
      grid-row: 1 / span 2;
      position: relative;
      width: 34px;
      height: 34px;
      margin: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: var(--status-color);
      background: color-mix(in srgb, var(--status-color) 12%, var(--card-background-color));
    }

    .status-card-compact .status-card-icon-compact ha-icon{ --mdc-icon-size: 19px; }

    .status-card-badge-compact{
      top: -7px;
      right: -11px;
      min-width: 18px;
      height: 20px;
      padding: 0 4px;
      box-sizing: border-box;
      font-size: 10px;
      line-height: 1;
    }

    .status-card-compact .status-card-title-compact{
      grid-column: 2;
      grid-row: 1;
      align-self: end;
      margin: 0;
      overflow: hidden;
      font-size: 12px;
      font-weight: 850;
      line-height: 1.08;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-card-compact:not(.has-value){
      grid-template-rows: 1fr;
    }

    .status-card-compact:not(.has-value) .status-card-title-compact{
      grid-row: 1;
      align-self: center;
      display: flex;
      align-items: center;
      min-height: 34px;
      margin: 0;
    }

    .status-card-compact .status-card-subtitle-compact{
      grid-column: 2;
      grid-row: 2;
      align-self: start;
      margin-top: 2px;
      overflow: hidden;
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 650;
      line-height: 1.08;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .header-time-weather{
      min-width: 116px;
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      gap: 4px;
    }

    .header-time{ font-size: 21px; line-height: 1; }
    .header-date{ font-size: 12px; line-height: 1.1; }
    .weather-compact{ padding: 3px 9px; }

    .area-content-area{
      padding: 8px 16px 16px;
    }

    .room-header-media{
      grid-area: media;
      position: relative;
      width: 220px;
      height: 176px;
      align-self: center;
      overflow: hidden;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
    }

    .room-header-picture{
      position: absolute;
      inset: 0;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .room-header-icon{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: color-mix(in srgb, var(--primary-color) 86%, var(--primary-text-color));
      background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
    }

    .room-header-icon ha-icon{ --mdc-icon-size: 52px; }

    .room-header-copy{
      grid-area: copy;
      min-width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
    }

    .room-header-breadcrumb{
      min-height: 18px;
      margin-bottom: 1px;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }

    .room-header-home-link{
      width: 20px;
      height: 20px;
      margin: 0;
      padding: 0;
      border: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      color: var(--secondary-text-color);
      background: transparent;
      cursor: pointer;
    }

    .room-header-home-link:hover{
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }

    .room-header-home-link ha-icon{ --mdc-icon-size: 14px; }
    .room-header-breadcrumb-chevron{ --mdc-icon-size: 12px; opacity: 0.7; }

    .room-header-device-count{
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 750;
    }

    .room-header-summary{
      margin-top: 6px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 7px;
      overflow: visible;
    }

    .room-header-summary::-webkit-scrollbar{
      display: none;
    }

    .room-summary-item{
      min-height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 800;
      line-height: 1;
      white-space: nowrap;
    }

    button.room-summary-item{
      min-width: 46px;
      padding: 5px 10px;
      border: 0;
      font: inherit;
      cursor: pointer;
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--room-summary-color) 12%, transparent),
        0 5px 12px rgba(15, 23, 42, 0.035);
      transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease;
    }

    button.room-summary-item:hover{
      transform: translateY(-1px);
      filter: brightness(1.03);
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--room-summary-color) 18%, transparent),
        0 8px 16px rgba(15, 23, 42, 0.06);
    }

    button.room-summary-item:active{
      transform: translateY(0) scale(0.97);
    }

    .room-summary-item ha-icon{ --mdc-icon-size: 17px; }
    .room-summary-item.temperature ha-icon{ color: ${l(m("temperature"))}; }
    .room-summary-item.humidity ha-icon{ color: ${l(m("humidity"))}; }
    .room-summary-item.power ha-icon{ color: ${l(m("energy"))}; }

    .room-summary-item.status{
      border-radius: 999px;
      color: var(--room-summary-color);
      background: color-mix(in srgb, var(--room-summary-color) 10%, var(--card-background-color));
    }

    .room-header-camera-preview{
      grid-area: camera;
      position: relative;
      width: 100%;
      height: 176px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      border: 0;
      border-radius: 12px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, var(--card-background-color));
      color: #fff;
      cursor: pointer;
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.06),
        0 7px 18px rgba(15, 23, 42, 0.07);
      transition: transform 0.16s ease, box-shadow 0.16s ease;
    }

    .room-header-camera-preview:hover{
      transform: translateY(-1px);
      box-shadow:
        inset 0 0 0 1px rgba(15, 23, 42, 0.08),
        0 10px 22px rgba(15, 23, 42, 0.1);
    }

    .room-header-camera-image,
.room-header-camera-stream{
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .room-header-camera-image{
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .room-header-camera-placeholder{
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
    }

    .room-header-camera-placeholder ha-icon{
      --mdc-icon-size: 38px;
    }

    .room-header-camera-live{
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
      min-height: 26px;
      padding: 0 9px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      color: #fff;
      background: rgba(15, 23, 42, 0.78);
      font-size: 12px;
      font-weight: 800;
      line-height: 1;
      backdrop-filter: blur(8px);
    }

    .room-header-camera-live-dot{
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #20c77a;
      box-shadow: 0 0 0 3px rgba(32, 199, 122, 0.14);
    }

    .room-header-actions{
      grid-area: actions;
      grid-column: auto;
      grid-row: auto;
      position: static !important;
      inset: auto !important;
      min-width: 42px;
      height: 100%;
      margin: 0 !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      align-self: stretch;
      gap: 10px;
      transform: none !important;
    }

    .room-header-actions .unavailable-entities-icon,
.room-header-actions .dd-edit-toggle{
      width: 38px;
      height: 38px;
      margin: 0;
      border-radius: 999px;
      flex: 0 0 auto;
    }

    .room-header-back{ display: none; }

    .room-favorites-block{
      width: 100%;
      margin: 0;
      overflow: visible;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent);
      border-radius: 8px;
      background: var(--card-background-color);
      box-shadow: 0 3px 10px rgba(15, 23, 42, 0.04);
    }

    .room-favorites-header{
      margin-bottom: 0 !important;
    }

    .room-favorites-block:not(.is-collapsed) .room-favorites-header{
      margin-bottom: 6px !important;
    }

    .room-favorites-icon{
      color: var(--primary-color);
    }

    .room-favorites-content{
      margin: 0;
    }

    .room-favorites-content .favorites-header{
      display: none;
    }

    .room-favorites-content .favorites-section{
      margin: 0;
    }

    .sidebar .room-area-button{
      min-height: 84px !important;
      height: 84px !important;
      padding: 6px !important;
      grid-template-columns: 72px minmax(0, 1fr) !important;
      align-items: center;
      gap: 8px !important;
      margin-bottom: 6px;
      border-radius: 10px;
    }

    .sidebar .room-area-button .area-media{
      width: 72px !important;
      height: 70px !important;
      align-self: center;
      border-radius: 8px;
    }

    .sidebar .room-area-button .area-media-icon ha-icon{ --mdc-icon-size: 30px; }

    .sidebar .room-area-button .area-content{
      min-width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px !important;
    }

    .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
      font-size: 13px;
      line-height: 1.1;
      font-weight: 850;
    }

    .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
      margin-top: 1px;
      font-size: 10px;
      line-height: 1.1;
    }

    .sidebar .room-area-button .area-info-badges{
      width: 100%;
      max-width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      gap: 3px;
      overflow: hidden;
    }

    .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
      min-width: 22px;
      height: 19px;
      padding: 0 4px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      border-radius: 999px;
      line-height: 1;
    }

    .sidebar .room-area-button .info-badge ha-icon{
      width: 11px;
      height: 11px;
      flex: 0 0 11px;
      display: block;
      --mdc-icon-size: 11px;
      line-height: 0;
    }

    .sidebar .room-area-button .badge-count{
      height: 11px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      line-height: 11px;
    }

    .room-domain-icon{
      width: 22px;
      height: 22px;
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 0;
      color: var(--domain-color);
      background: transparent;
    }

    .room-domain-icon ha-icon{ --mdc-icon-size: 18px; }

    .mobile-domain-title-chevron{
      margin-left: 1px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 16px;
    }

    .dd-generated-card-leading-drag-handle,
.dd-generated-card-visibility{
      width: 30px;
      height: 30px;
      padding: 0;
      border: 0;
      border-radius: 7px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      background: transparent;
      pointer-events: auto;
    }

    .dd-generated-card-leading-drag-handle{
      width: 22px;
      height: 40px;
      margin: 0;
      padding: 0;
      border-radius: 4px;
      cursor: grab;
      color: var(--secondary-text-color);
      background: transparent;
    }

    .dd-generated-card-leading-drag-handle:active{ cursor: grabbing; }

    .dd-generated-card-leading-drag-handle ha-icon{
      --mdc-icon-size: 20px;
    }

    .dd-generated-card-visibility ha-icon{
      --mdc-icon-size: 19px;
    }

    .dd-generated-card-visibility{
      color: var(--primary-text-color);
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
    }

    .dd-generated-card-leading-drag-handle:hover{
      background: var(--primary-background-color);
      color: var(--primary-color);
    }

    .dd-generated-card-visibility:hover{
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
    }

    @media (max-width: 1180px) and (min-width: 769px) {

      .room-header-media{
        width: 170px;
        height: 148px;
      }

      .room-header-camera-preview{
        height: 148px;
      }
    }

    @media (max-width: 768px) {
      .global-header{ padding: 8px 10px 6px; }

      .area-content-area{ padding: 8px 10px 88px; }

      .room-header-back{
        grid-area: back;
        width: 40px;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
        border-radius: 999px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .room-header-media{
        width: 64px;
        height: 64px;
        border-radius: 9px;
      }

      .room-header-icon ha-icon{ --mdc-icon-size: 30px; }
      .room-header-breadcrumb{ display: none; }
      .room-header-device-count{ font-size: 10px; }

      .room-header-summary{
        gap: 5px;
        flex-wrap: wrap;
      }

      .room-summary-item{ font-size: 10px; }

      .room-header-camera-preview{
        width: 100%;
        height: 148px;
        border-radius: 10px;
      }

      .room-header-actions{
        grid-area: actions;
        grid-column: auto;
        grid-row: auto;
        height: auto;
        align-self: start;
        flex-direction: column;
        gap: 6px;
        margin-left: 0 !important;
      }

      .room-header-actions .unavailable-entities-icon,
.room-header-actions .dd-edit-toggle{
        width: 34px;
        height: 34px;
      }

      .room-favorites-toggle{
        min-height: 36px;
      }
    }


    /* Room context: global house information and Favorites form one subtle visual zone. */
    .global-header.room-context{
      background: color-mix(in srgb, var(--secondary-background-color) 34%, var(--card-background-color));
      border-bottom-color: transparent;
      box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--divider-color) 42%, transparent);
    }

    .global-header.room-context .room-favorites-block{
      margin-top: 10px !important;
      margin-bottom: 0 !important;
      background: color-mix(in srgb, var(--card-background-color) 78%, transparent);
      box-shadow: none;
    }

    .global-header.room-context .room-favorites-block::after{
      display: none;
    }

    /* Desktop room header follow-up:
       - left identity block matches the full height of all three metric pills
       - metric pills are about 10% smaller and tightly stacked
       - status badges stay fully visible
       - actions stay aligned with the room title */
    @media (min-width: 769px) {

      .room-header-title-row{
        min-height: 38px;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 7px;
      }

      .room-header-title-row .room-header-home-link{
        flex: 0 0 30px;
        width: 30px;
        height: 30px;
      }

      .room-header-title-row .room-header-home-link ha-icon{
        --mdc-icon-size: 20px;
      }

      .room-header-title-row .room-header-home-chevron{
        flex: 0 0 auto;
      }

      .room-header-device-count{
        font-size: 13px;
        line-height: 1.15;
        margin: 0 !important;
      }

      .room-header-summary{
        min-height: 34px !important;
        margin-top: 2px !important;
        margin-bottom: 0 !important;
        padding: 2px 0 !important;
        align-items: center !important;
        gap: 7px !important;
        overflow: visible !important;
      }

      .room-header-summary.is-empty{
        min-height: 0 !important;
        padding: 0 !important;
      }

      .room-summary-item{
        min-height: 30px !important;
        font-size: 12px;
        line-height: 1 !important;
      }

      button.room-summary-item{
        min-width: 46px !important;
        padding: 6px 10px !important;
      }

      .room-summary-item ha-icon{
        --mdc-icon-size: 17px !important;
      }

      .room-header-actions{
        height: 150px !important;
        align-self: center !important;
        justify-content: flex-start !important;
        gap: 8px !important;
        padding: 0 !important;
      }

      .room-header-actions .dd-edit-toggle,
.room-header-actions .unavailable-entities-icon{
        width: 38px;
        height: 38px;
        margin: 0 !important;
      }
    }

    .room-header-title-row{
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .room-header-title-row .area-title{
      min-width: 0;
      margin: 0;
    }

    @media (max-width: 768px) {
      .room-header-title-row .room-header-home-link{
        display: none;
      }
    }

    /* Final polish for global meta, Favorites and expandable room sections. */
    @media (min-width: 769px) {
      .global-header{
        padding-right: 28px;
      }

      .header-time-weather{
        min-width: 204px;
        height: 50px;
        flex: 0 0 auto;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
      }

      .header-time-section{
        min-width: 82px;
        align-items: flex-end;
        justify-content: center;
        gap: 1px;
        line-height: 1;
      }

      .header-time{
        font-size: 18px;
        line-height: 1.05;
      }

      .header-date{
        font-size: 10px;
        line-height: 1.05;
      }

      .weather-compact{
        min-height: 30px;
        padding: 3px 9px;
        box-sizing: border-box;
      }
    }

    .room-favorites-block{
      position: relative;
      box-sizing: border-box;
      overflow: visible !important;
      margin-bottom: 11px !important;
    }

    .room-favorites-block::after{
      content: "";
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: -7px;
      width: auto;
      height: 1px;
      border-radius: 999px;
      background: var(--divider-color);
      opacity: 0.28;
      pointer-events: none;
    }

    .room-favorites-content .favorites-grid{
      gap: 6px;
    }

    .room-favorites-content .favorite-tile-wrapper{
      --row-size: 54px;
      --ha-card-border-radius: 8px;
      min-height: 54px;
      font-size: 0.94em;
    }

    .room-favorites-content .favorite-tile-wrapper > hui-tile-card{
      --row-size: 54px;
      --ha-card-border-radius: 8px;
      min-height: 54px;
    }

    .room-favorites-title{
      pointer-events: none;
    }

    .mobile-domain-center-chevron{
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 1;
      color: var(--secondary-text-color);
      --mdc-icon-size: 14px;
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 0.78;
    }

    .mobile-domain-title-chevron{
      display: none !important;
    }

    @media (max-width: 768px) {
      .room-favorites-content .favorite-tile-wrapper,
.room-favorites-content .favorite-tile-wrapper > hui-tile-card{
        --row-size: 50px;
        min-height: 50px;
      }
    }


    /* Keep expandable headers visually centered and use a single{
      min-height: 38px;
    }

    .mobile-domain-leading-chevron{
      flex: 0 0 auto;
      color: var(--secondary-text-color);
      --mdc-icon-size: 14px;
      opacity: 0.78;
      pointer-events: none;
    }

    .mobile-domain-leading-drag-handle{
      width: 22px;
      height: 40px;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: 4px;
      display: grid;
      place-items: center;
      flex: 0 0 22px;
      color: var(--secondary-text-color);
      background: transparent;
      cursor: grab;
      touch-action: none;
    }

    .mobile-domain-leading-drag-handle:hover{
      background: var(--primary-background-color);
      color: var(--primary-color);
    }

    .mobile-domain-leading-drag-handle:active{
      cursor: grabbing;
    }

    .mobile-domain-leading-drag-handle ha-icon{
      --mdc-icon-size: 20px;
    }

    .mobile-domain-center-chevron,
.mobile-domain-title-chevron{
      display: none !important;
    }

    /* Compact Favorites row with a quiet divider before the room header. */
    .room-favorites-block{
      margin-bottom: 12px !important;
    }

    .room-favorites-block::after{
      left: 12px;
      right: 12px;
      bottom: -7px;
      width: auto;
      height: 1px;
      transform: none;
      background: var(--divider-color);
      opacity: 0.42;
    }

    /* Compact sidebar: denser rooms,
slimmer badges,
vertically centered badge contents. */
    .sidebar .floor-section{
      margin: 0 0 10px;
    }

    .sidebar .floor-header{
      padding: 5px 8px 3px;
      margin-bottom: 2px;
    }

    .sidebar .floor-areas{
      gap: 4px;
    }

    .sidebar .area-button.home-button{
      margin-bottom: 10px !important;
    }

    @media (min-width: 769px) {
      .sidebar .room-area-button{
        margin-bottom: 0;
      }

      .sidebar .room-area-button .area-content{
        gap: 5px;
      }

      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        font-size: 14px;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        margin-top: 2px;
        font-size: 11px;
      }

      .sidebar .room-area-button .area-info-badges{
        gap: 3px;
        min-height: 20px;
      }

      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 22px;
        height: 19px;
        padding: 0 4px;
        display: inline-grid;
        grid-template-columns: 11px max-content;
        align-items: center;
        justify-content: center;
        column-gap: 2px;
        line-height: 1;
      }

      .sidebar .room-area-button .info-badge ha-icon,
.sidebar .room-area-button.has-picture .info-badge ha-icon{
        width: 11px;
        height: 11px;
        display: block;
        align-self: center;
        --mdc-icon-size: 11px;
        line-height: 0;
        transform: translateY(-0.5px);
      }

      .sidebar .room-area-button .badge-count,
.sidebar .room-area-button.has-picture .badge-count{
        height: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: center;
        font-size: 9px;
        line-height: 11px;
        transform: translateY(0.5px);
      }
    }

    /* Desktop meta uses the available horizontal space: time/date stacked, weather beside it. */
    @media (min-width: 769px) {
      .header-time-weather{
        min-width: 176px;
        height: 50px;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
      }

      .header-time-section{
        min-width: 76px;
        align-items: flex-end;
        justify-content: center;
        gap: 1px;
        padding: 0;
        background: transparent;
        border: 0;
        box-shadow: none;
      }

      .header-time{
        font-size: 18px;
        line-height: 1.05;
      }

      .header-date{
        font-size: 10px;
        line-height: 1.05;
      }

      .weather-compact{
        min-height: 30px;
        padding: 3px 9px;
      }

      .weather-icon-compact ha-icon{
        --mdc-icon-size: 18px;
      }

      .weather-temp-compact{
        font-size: 11px;
      }
    }

    /* Room follow-up: restore functional group drag handles. The title was intentionally
       non-interactive in normal mode{
      pointer-events: auto;
    }

    /* Expanded favorites content keeps the same inset as generated room content. */
    .room-favorites-content{
      padding: 6px 9px 9px;
    }

    /* Final mobile room-view pass: compact room header and desktop-like area picker cards. */
    @media (max-width: 768px) {
      /* Room header: top row for navigation/identity/actions{
        min-height: 0 !important;
        padding: 10px !important;
        grid-template-columns: 42px 60px minmax(0, 1fr) 76px !important;
        grid-template-rows: auto auto !important;
        grid-template-areas:
          "back media copy actions"
          "metrics metrics metrics metrics" !important;
        column-gap: 9px !important;
        row-gap: 10px !important;
        align-items: center !important;
      }

      /* Area picker sheet: compact chrome and enough clearance above the bottom navigation. */


      .mobile-area-picker-head{
        min-height: 34px !important;
        margin: 0 2px 8px !important;
      }

      .mobile-area-picker-title{
        font-size: 18px !important;
        line-height: 1.1 !important;
      }

      .mobile-area-picker-close{
        width: 34px !important;
        height: 34px !important;
      }



      .sidebar .area-list{
        gap: 4px !important;
      }

      .sidebar .floor-section{
        gap: 5px !important;
        margin-bottom: 8px !important;
      }

      .sidebar .floor-areas{
        gap: 4px !important;
      }

      .sidebar .floor-header{
        padding: 4px 6px 2px !important;
      }

      .sidebar .floor-header h3{
        font-size: 13px !important;
        font-weight: 760 !important;
      }

      /* Mobile room cards mirror the compact information hierarchy of the desktop sidebar. */
      .sidebar .room-area-button{
        min-height: 72px !important;
        height: auto !important;
        padding: 8px 10px !important;
        display: grid !important;
        grid-template-columns: 52px minmax(0, 1fr) !important;
        grid-template-rows: auto !important;
        align-items: center !important;
        column-gap: 10px !important;
        border-radius: 9px !important;
      }

      .sidebar .room-area-button .area-media{
        grid-column: 1 !important;
        grid-row: 1 !important;
        position: relative !important;
        width: 52px !important;
        height: 52px !important;
        min-width: 52px !important;
        align-self: center !important;
        overflow: hidden;
        border-radius: 8px !important;
      }

      .sidebar .room-area-button .area-media-icon,
.sidebar .room-area-button .area-media-picture{
        width: 100% !important;
        height: 100% !important;
      }

      .sidebar .room-area-button .area-media-icon{
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
        color: var(--primary-color) !important;
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: 26px !important;
      }

      .sidebar .room-area-button .area-content{
        grid-column: 2 !important;
        grid-row: 1 !important;
        min-width: 0 !important;
        min-height: 52px !important;
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        align-items: center !important;
        column-gap: 8px !important;
      }

      .sidebar .room-area-button .area-top-section{
        grid-column: 1 !important;
        width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        gap: 3px !important;
      }

      .sidebar .room-area-button .area-name{
        width: 100% !important;
        margin: 0 !important;
        overflow: hidden;
        font-size: 15px !important;
        font-weight: 800 !important;
        line-height: 1.1 !important;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .room-area-button .area-sensors{
        width: 100% !important;
        margin-top: 3px !important;
        overflow: hidden;
        font-size: 11px !important;
        font-weight: 650 !important;
        line-height: 1.1 !important;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sidebar .room-area-button .area-info-badges{
        grid-column: 2 !important;
        position: static !important;
        width: 74px !important;
        max-width: 74px !important;
        min-width: 74px !important;
        margin: 0 0 0 auto !important;
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        align-content: center !important;
        justify-content: flex-end !important;
        gap: 4px !important;
      }

      .sidebar .room-area-button .info-badge{
        min-width: 22px !important;
        height: 19px !important;
        padding: 0 5px !important;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 11px !important;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 9px !important;
      }

      .sidebar .room-area-button .info-badge-overflow{
        width: 14px !important;
        min-width: 14px !important;
        height: 19px !important;
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--secondary-text-color) !important;
        font-size: 15px !important;
        line-height: 19px !important;
      }

      .sidebar .room-area-button.selected{
        border-color: color-mix(in srgb, var(--primary-color) 52%, transparent) !important;
        background: color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color) 6%) !important;
        box-shadow:
          inset 3px 0 0 var(--primary-color),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent),
          0 6px 14px rgba(15, 23, 42, 0.07) !important;
      }

      /* Home row stays compact and visually subordinate to room cards. */
      .sidebar .area-button.home-button{
        min-height: 54px !important;
        height: 54px !important;
        padding: 7px 10px !important;
        display: grid !important;
        grid-template-columns: 40px minmax(0, 1fr) 20px !important;
        align-items: center !important;
        gap: 10px !important;
        margin: 0 0 7px !important;
      }

      .sidebar .area-button.home-button .area-icon{
        position: relative !important;
        left: auto !important;
        top: auto !important;
        width: 40px !important;
        height: 40px !important;
        transform: none !important;
        border-radius: 8px !important;
      }

      .sidebar .area-button.home-button .area-info{
        grid-column: 2 !important;
        min-width: 0 !important;
      }

      .sidebar .area-button.home-button .area-menu-chevron{
        grid-column: 3 !important;
        justify-self: end !important;
      }
    }

    /* 1.8.10x desktop density and hierarchy follow-up */
    @media (min-width: 769px) {
      .content-area{
        scrollbar-gutter: stable;
      }

      .welcome-notification-action{
        width: 48px;
        height: 48px;
        border-radius: 999px;
        background: transparent;
        box-shadow: none;
      }

      .welcome-notification-action ha-icon{
        --mdc-icon-size: 26px;
      }

      .welcome-settings-action{
        width: 44px;
        height: 44px;
        border-radius: 999px;
      }

      .home-status-grid{
        align-items: start;
      }

      .home-status-card{
        min-height: 104px;
        padding: 12px;
      }

      .home-status-card .status-card-icon{
        width: 42px;
        height: 42px;
        margin-bottom: 10px;
      }

      .home-status-card.house-persons-card,
.home-status-card.house-climate-card,
.home-status-card.house-power-card{
        min-height: 0;
        height: auto;
        align-self: start;
        padding: 12px;
        gap: 8px;
      }

      .house-persons-grid{
        margin-top: 2px;
      }

      .house-climate-grid{
        gap: 7px;
      }

      .house-climate-metric{
        min-height: 42px;
        padding: 6px 8px;
      }

      .house-power-list{
        margin-top: 2px;
      }

      .global-header.room-context .room-favorites-block{
        border-color: color-mix(in srgb, var(--primary-color) 12%, var(--divider-color));
        background: color-mix(in srgb, var(--primary-color) 3%, var(--card-background-color));
      }

      .global-header.room-context .room-favorites-header{
        min-height: 38px !important;
        padding: 7px 9px !important;
      }

      .global-header.room-context .room-favorites-title{
        min-height: 24px !important;
      }

      .global-header.room-context .room-favorites-title .mobile-domain-title-label{
        font-size: 15px !important;
        font-weight: 850 !important;
        line-height: 1 !important;
      }

      .global-header.room-context .room-favorites-title .mobile-domain-count{
        font-size: 10px !important;
        font-weight: 650 !important;
        line-height: 1 !important;
      }

      .global-header.room-context .room-favorites-title .room-domain-icon{
        width: 22px !important;
        height: 22px !important;
      }

      .global-header.room-context .room-favorites-title .room-domain-icon ha-icon{
        --mdc-icon-size: 18px !important;
      }

      .room-header-title-row{
        gap: 5px;
      }

      .room-header-home-link{
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 8%, transparent);
        color: var(--primary-color);
      }

      .room-header-home-link:hover{
        background: color-mix(in srgb, var(--primary-color) 14%, transparent);
      }

      .room-header-home-link ha-icon{
        --mdc-icon-size: 19px;
      }

      .room-header-home-chevron{
        flex: 0 0 auto;
        color: var(--secondary-text-color);
        --mdc-icon-size: 16px;
        opacity: 0.7;
      }
    }

    @media (max-width: 768px) {
      .room-header-home-chevron{
        display: none;
      }
    }

    /* Follow-up: keep requested density changes coherent instead of content-dependent. */
    @media (min-width: 769px) {
      /* House information uses two intentional heights:
         detailed summary cards are equal; simple active-status cards are compact and equal. */
      .home-status-grid{
        align-items: start;
      }

      .home-status-card{
        box-sizing: border-box;
        height: 94px;
        min-height: 94px;
        padding: 10px 12px;
        justify-content: flex-start;
        gap: 7px;
      }

      .home-status-card .status-card-icon{
        width: 38px;
        height: 38px;
        margin: 0;
      }

      .home-status-card .status-card-icon ha-icon{
        --mdc-icon-size: 21px;
      }

      .home-status-card .status-card-title{
        margin: 0;
        font-size: 14px;
        line-height: 1.1;
      }

      .home-status-card.has-value .status-card-value{
        margin: 0;
      }

      .home-status-card.house-persons-card,
.home-status-card.house-climate-card,
.home-status-card.house-power-card{
        height: 162px;
        min-height: 162px;
        padding: 12px;
        gap: 8px;
        overflow: hidden;
      }

      .house-person-mini{
        min-height: 36px;
        padding: 4px 6px;
      }

      .house-person-avatar{
        width: 24px;
        height: 24px;
      }

      .house-climate-metric{
        min-height: 44px;
      }

      .house-power-list{
        gap: 3px;
      }

      .house-power-room{
        grid-template-columns: 20px minmax(0, 1fr) auto;
        column-gap: 6px;
        row-gap: 2px;
      }

      .house-power-room-icon{
        width: 20px;
        height: 20px;
        border-radius: 7px;
      }

      .house-power-room-icon ha-icon{
        --mdc-icon-size: 13px;
      }

      .house-power-bar{
        height: 3px;
      }

      /* The Home affordance should read as navigation,
not as a second room tile. */
      .room-header-home-link{
        width: 24px;
        height: 24px;
        padding: 0;
        border-radius: 6px;
        background: transparent;
        box-shadow: none;
        color: var(--primary-color);
      }

      .room-header-home-link:hover{
        background: color-mix(in srgb, var(--primary-color) 8%, transparent);
      }

      .room-header-home-link ha-icon{
        --mdc-icon-size: 18px;
      }

      /* Favorites matches the generated type header in height,
typography and interaction. */
      .global-header.room-context .room-favorites-block{
        background: var(--card-background-color);
        border-color: color-mix(in srgb, var(--primary-text-color) 7%, transparent);
        box-shadow: 0 3px 10px rgba(15, 23, 42, 0.04);
      }

      .global-header.room-context .room-favorites-header{
        height: 38px !important;
        min-height: 38px !important;
        padding: 7px 9px !important;
        box-sizing: border-box;
        transition: background-color 0.16s ease, box-shadow 0.16s ease;
      }

      .global-header.room-context .room-favorites-header:hover{
        background: color-mix(in srgb, var(--primary-color) 5%, transparent);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent);
      }

      .global-header.room-context .room-favorites-title{
        min-height: 24px !important;
        align-items: center !important;
        line-height: 1 !important;
      }

      .global-header.room-context .room-favorites-title .mobile-domain-leading-chevron,
.global-header.room-context .room-favorites-title .room-domain-icon,
.global-header.room-context .room-favorites-title .mobile-domain-title-copy,
.global-header.room-context .room-favorites-title .mobile-domain-count{
        align-self: center;
      }

      .global-header.room-context .room-favorites-title .mobile-domain-title-copy{
        align-items: center !important;
        line-height: 1 !important;
      }

      /* Keep the title block at the same vertical position even when no active room badge exists. */
      .room-header-summary{
        min-height: 22px;
      }

      .room-header-summary.is-empty{
        visibility: hidden;
        pointer-events: none;
      }
    }

    /* Home information density: fixed outer heights, content-aware inner grids. */
    @media (min-width: 769px) {
      /* Normalize section rhythm across Home. */
      .home-status-section,
.home-favorites-section,
.home-summaries-section,
.home-camera-section,
.home-todos-section,
.home-custom-cards-section{
        margin-bottom: 36px;
      }

      /* Detailed Home information cards stay equal in outer height. */
      .home-status-card.house-persons-card,
.home-status-card.house-climate-card,
.home-status-card.house-power-card{
        height: 162px;
        min-height: 162px;
      }

      /* Simple active-status cards are exactly half the detailed-card height. */
      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card){
        height: 81px;
        min-height: 81px;
        padding: 9px 11px 7px;
        display: grid;
        grid-template-rows: 34px minmax(0, 1fr);
        align-items: start;
        gap: 0;
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card) .status-card-icon{
        width: 34px;
        height: 34px;
        margin: 0;
        align-self: start;
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card) .status-card-icon ha-icon{
        --mdc-icon-size: 19px;
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card) .status-card-title{
        width: 100%;
        min-height: 30px;
        margin: 0;
        display: flex;
        align-items: center;
        align-self: stretch;
        font-size: 13px;
        line-height: 1.05;
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card).has-value{
        grid-template-rows: 30px auto minmax(0, 1fr);
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card).has-value .status-card-value{
        margin: 0;
        font-size: 17px;
        line-height: 1;
      }

      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card).has-value .status-card-title{
        min-height: 18px;
        font-size: 10px;
      }

      /* Compact status count pills like the room badges: smaller and shifted outward. */
      .home-status-card .status-card-badge{
        top: -5px;
        right: -14px;
        min-width: 20px;
        height: 20px;
        padding: 0 5px;
        font-size: 10px;
        line-height: 20px;
        box-shadow: 0 3px 8px color-mix(in srgb, var(--status-color) 24%, transparent);
      }

      /* Person grid fills the available matrix according to the actual HA person count. */
      .house-persons-grid{
        flex: 1 1 auto;
        min-height: 0;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(2, minmax(0, 1fr));
        gap: 7px;
      }

      .house-persons-card.persons-1 .house-persons-grid{
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr);
      }

      .house-persons-card.persons-2 .house-persons-grid{
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: minmax(0, 1fr);
      }

      .house-persons-card.persons-3 .house-persons-grid{
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(2, minmax(0, 1fr));
      }

      .house-persons-card.persons-3 .house-person-mini:last-child{
        grid-column: 1 / -1;
      }

      .house-person-mini{
        min-height: 0;
        height: 100%;
        padding: 6px 8px;
      }

      .house-persons-card.persons-1 .house-person-mini{
        justify-content: center;
      }

      .house-persons-card.persons-1 .house-person-avatar{
        width: 34px;
        height: 34px;
      }

      .house-persons-card.persons-1 .house-person-mini-name{
        font-size: 13px;
      }

      .house-persons-card.persons-1 .house-person-mini-state{
        font-size: 11px;
      }

      /* Climate metrics consume the full remaining body height when only one or two metrics exist. */
      .house-climate-grid{
        flex: 1 1 auto;
        min-height: 0;
        align-items: stretch;
      }

      .house-climate-card.metrics-1 .house-climate-grid{
        grid-template-columns: minmax(0, 1fr);
      }

      .house-climate-card.metrics-2 .house-climate-grid{
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .house-climate-card.metrics-1 .house-climate-metric,
.house-climate-card.metrics-2 .house-climate-metric{
        min-height: 0;
        height: 100%;
        padding: 10px 12px;
        grid-template-columns: 34px minmax(0, 1fr);
        column-gap: 10px;
      }

      .house-climate-card.metrics-1 .house-climate-metric-icon,
.house-climate-card.metrics-2 .house-climate-metric-icon{
        width: 34px;
        height: 34px;
        border-radius: 10px;
      }

      .house-climate-card.metrics-1 .house-climate-metric-icon ha-icon,
.house-climate-card.metrics-2 .house-climate-metric-icon ha-icon{
        --mdc-icon-size: 19px;
      }

      .house-climate-card.metrics-1 .house-climate-metric-value,
.house-climate-card.metrics-2 .house-climate-metric-value{
        font-size: 18px;
      }

      .house-climate-card.metrics-1 .house-climate-metric-label,
.house-climate-card.metrics-2 .house-climate-metric-label{
        font-size: 11px;
      }

      /* Power keeps a stable card height; empty state sits in the visual center of the body. */
      .house-power-empty{
        flex: 1 1 auto;
        min-height: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 6px;
        text-align: center;
      }

      /* Home Favorites uses the same section-header language as the other Home sections. */
      .home-favorites-section .favorites-header{
        min-height: 30px;
        margin: 0 0 14px;
        padding: 0;
        border: 0;
        display: flex;
        align-items: center;
        gap: 9px;
        color: var(--primary-text-color);
        font-size: 20px;
        font-weight: 850;
        line-height: 1.1;
      }

      .home-favorites-section .favorites-header ha-icon{
        width: 30px;
        height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        --mdc-icon-size: 20px;
        color: #f59e0b;
        background: color-mix(in srgb, #f59e0b 13%, transparent);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, #f59e0b 9%, transparent);
      }

      .home-favorites-section .favorites-header span{
        display: inline-flex;
        align-items: center;
        min-height: 30px;
      }
    }

    /* Final visual consistency pass for Home and room header. */
    @media (min-width: 769px) {
      /* Home status count badges match the compact room/header badge proportions. */
      .home-status-card .status-card-badge{
        top: -6px;
        right: -11px;
        min-width: 18px;
        height: 20px;
        padding: 0 4px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        line-height: 1;
        box-shadow: 0 3px 8px color-mix(in srgb, var(--status-color) 22%, transparent);
      }

      /* Place simple status labels in the exact visual center between icon tile and accent line. */
      .home-status-card:not(.house-persons-card):not(.house-climate-card):not(.house-power-card):not(.has-value) .status-card-title{
        position: absolute;
        left: 11px;
        right: 11px;
        bottom: 9px;
        min-height: 18px;
        margin: 0;
        display: flex;
        align-items: center;
        font-size: 13px;
        line-height: 1;
      }

      /* Room meta: time/date equals status-card height; weather is slightly larger but still secondary. */
      .global-header.room-context .header-time-weather{
        height: 50px;
        gap: 12px;
      }

      .global-header.room-context .header-time-section{
        width: 94px;
        min-width: 94px;
        height: 50px;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
      }

      .global-header.room-context .header-time{
        font-size: 24px;
        line-height: 1;
      }

      .global-header.room-context .header-date{
        margin-top: 3px;
        font-size: 11px;
        line-height: 1;
      }

      .global-header.room-context .weather-compact{
        min-height: 38px;
        padding: 0 12px;
        gap: 7px;
        border-radius: 999px;
      }

      .global-header.room-context .weather-icon-compact ha-icon{
        --mdc-icon-size: 18px;
      }

      .global-header.room-context .weather-temp-compact{
        font-size: 13px;
      }

      /* Filled Home breadcrumb reads like navigation but remains distinct from the large room icon. */
      .room-header-home-link ha-icon{
        --mdc-icon-size: 19px;
      }

      /* Sidebar Home follows the room-card rhythm while remaining a special global destination. */
      .sidebar .area-button.home-button{
        min-height: 68px !important;
        height: 68px !important;
        padding: 8px 10px !important;
        grid-template-columns: 50px minmax(0, 1fr) auto 20px !important;
        gap: 9px !important;
        border-color: color-mix(in srgb, var(--primary-color) 18%, var(--divider-color)) !important;
        background: color-mix(in srgb, var(--primary-color) 4%, var(--card-background-color)) !important;
      }

      .sidebar .area-button.home-button .area-icon{
        width: 50px !important;
        height: 50px !important;
        border-radius: 9px !important;
        background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
      }

      .sidebar .area-button.home-button .area-icon ha-icon{
        --mdc-icon-size: 25px !important;
      }

      .sidebar .area-button.home-button .area-name{
        font-size: 14px;
        font-weight: 850;
      }

      .sidebar .area-button.home-button.selected{
        background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color)) !important;
        box-shadow:
          inset 3px 0 0 var(--primary-color),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 14%, transparent),
          0 6px 14px rgba(15, 23, 42, 0.06) !important;
      }

      /* Room metric pills: direct icons{
        width: 24px !important;
        height: 30px !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      /* Climate card uses exactly the same temperature/humidity colors as the room view. */
      .house-climate-metric.temperature{ --metric-color: ${l(m("climate"))} !important; }
      .house-climate-metric.humidity{ --metric-color: ${l(m("humidity"))} !important; }

      /* Climate metric icons are direct,
slightly larger icons without a second circle. */
      .house-climate-metric-icon{
        width: 28px !important;
        height: 34px !important;
        border-radius: 0 !important;
        background: transparent !important;
      }

      .house-climate-metric-icon ha-icon{
        --mdc-icon-size: 21px !important;
      }

      /* Desktop section headings are labels,
not buttons: color only,
no chip/background. */
      .home-status-heading ha-icon,
.home-camera-section .home-status-heading ha-icon,
.home-summaries-section .home-status-heading ha-icon,
.home-todos-section .home-status-heading ha-icon,
.home-custom-cards-section .home-status-heading ha-icon,
.home-favorites-section .favorites-header ha-icon{
        width: 24px !important;
        height: 24px !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      .home-status-heading ha-icon{ color: var(--primary-color); }
      .home-camera-section .home-status-heading ha-icon{ color: #ef4444; }
      .home-summaries-section .home-status-heading ha-icon{ color: #c56f12; }
      .home-todos-section .home-status-heading ha-icon{ color: #7c3aed; }
      .home-custom-cards-section .home-status-heading ha-icon{ color: #0ea5a8; }
      .home-favorites-section .favorites-header ha-icon{ color: #f59e0b; }
    }

    .house-power-dialog-handle{
      display: none;
    }
    .house-power-dialog-subtitle{ margin-top: 3px; color: var(--secondary-text-color); font-size: 12px; font-weight: 700; }

    .house-power-dialog-total{
      min-height: 72px;
      margin-bottom: 12px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 10px;
      background: color-mix(in srgb, ${l(m("energy"))} 8%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, ${l(m("energy"))} 14%, transparent);
    }

    .house-power-dialog-total span{ font-size: 28px; font-weight: 950; line-height: 1; }
    .house-power-dialog-total small{ margin-top: 4px; color: var(--secondary-text-color); font-size: 11px; font-weight: 750; }

    .house-power-dialog-areas{ display: grid; gap: 10px; }
    .house-power-dialog-area{
      padding: 11px 12px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-background-color) 72%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    }

    .house-power-dialog-area-head{
      display: grid;
      grid-template-columns: 30px minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
    }

    .house-power-dialog-area-icon{
      width: 30px;
      height: 30px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: ${l(m("energy"))};
      background: color-mix(in srgb, ${l(m("energy"))} 10%, transparent);
    }

    .house-power-dialog-area-icon ha-icon{ --mdc-icon-size: 17px; }
    .house-power-dialog-area-name{ min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 850; }

    .house-power-dialog-bar{
      position: relative;
      height: 5px;
      margin: 8px 0 6px 38px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, ${l(m("energy"))} 10%, var(--secondary-background-color));
    }

    .house-power-dialog-bar span{
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--power-width, 0%);
      min-width: 4px;
      border-radius: inherit;
      background: ${l(m("energy"))};
    }

    .house-power-dialog-entities{
      margin-left: 38px;
      display: grid;
      gap: 2px;
    }

    .house-power-dialog-entity{
      width: 100%;
      min-height: 30px;
      padding: 4px 6px;
      border: 0;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .house-power-dialog-entity:hover{
      background: color-mix(in srgb, ${l(m("energy"))} 7%, transparent);
    }

    .house-power-dialog-entity span{
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--secondary-text-color);
      font-size: 12px;
    }

    .house-power-dialog-entity strong{ font-size: 12px; white-space: nowrap; }
    .house-power-dialog-empty{
      min-height: 88px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      text-align: center;
    }

    @media (max-width: 768px) {

      .house-power-dialog-handle{
        display: none !important;
      }
    }

    /* Desktop Home alignment and section rhythm. */
    @media (min-width: 769px) {
      .home-view,
.home-welcome,
.home-status-section,
.home-favorites-section,
.home-summaries-section,
.home-camera-section,
.home-todos-section,
.home-custom-cards-section{
        width: 100%;
        max-width: none;
        box-sizing: border-box;
      }

      .home-status-heading,
.home-favorites-section .favorites-header{
        margin-bottom: 10px !important;
      }

      .home-status-section,
.home-favorites-section,
.home-summaries-section,
.home-camera-section,
.home-todos-section,
.home-custom-cards-section{
        margin-bottom: 28px !important;
      }

      .home-welcome{
        margin-bottom: 28px !important;
      }

      /* House information uses one six-column master grid:
       * large summary cards are exactly two columns wide; status cards one.
       * This keeps every status tile at half the width of a large card. */
      .home-status-primary-grid{
        width: 100%;
        max-width: none !important;
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        grid-auto-rows: 77px;
        gap: 8px 10px;
        align-items: stretch;
      }

      .favorites-grid,
.home-summary-list{
        width: 100%;
        max-width: none !important;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        align-items: stretch;
      }

      .home-status-primary-grid > .home-status-card:not(.compact-status){
        width: 100%;
        min-width: 0;
        grid-column: span 2 !important;
        grid-row: span 2;
      }

      .home-status-primary-grid > .home-status-card.compact-status{
        width: 100%;
        min-width: 0;
        min-height: 0;
        height: auto;
        grid-column: span 1 !important;
        grid-row: span 1;
      }

      /* Favorites/Summary cards use the same column width as a primary House Information card. */
      .home-favorites-section .favorite-card-wrapper,
.home-summary-list .home-summary-card{
        width: 100%;
        min-width: 0;
      }

      /* Room Favorites: hard vertical centering across chevron,
star,
text and count. */
      .global-header.room-context .room-favorites-header{
        display: flex !important;
        align-items: center !important;
      }

      .global-header.room-context .room-favorites-title{
        height: 24px !important;
        min-height: 24px !important;
        display: flex !important;
        align-items: center !important;
        gap: 7px !important;
      }

      .global-header.room-context .room-favorites-title > *,
.global-header.room-context .room-favorites-title .mobile-domain-title-copy,
.global-header.room-context .room-favorites-title .mobile-domain-title-label,
.global-header.room-context .room-favorites-title .mobile-domain-count{
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        align-self: center !important;
        line-height: 1 !important;
      }

      .global-header.room-context .room-favorites-title .mobile-domain-leading-chevron{
        transform: translateY(0) !important;
      }

      .global-header.room-context .room-favorites-title .room-domain-icon{
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        transform: translateY(0) !important;
      }

      /* Home sidebar item: no photo-like icon tile,
stronger global distinction,
readable selection. */
      .sidebar .area-button.home-button .area-icon{
        width: 32px !important;
        height: 32px !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      .sidebar .area-button.home-button .area-icon ha-icon{
        --mdc-icon-size: 25px !important;
        color: var(--primary-color) !important;
      }

      .sidebar .area-button.home-button{
        background: color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 24%, var(--divider-color)) !important;
      }

      .sidebar .area-button.home-button.selected{
        color: var(--primary-text-color) !important;
        background: color-mix(in srgb, var(--primary-color) 18%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 42%, var(--divider-color)) !important;
      }

      .sidebar .area-button.home-button.selected .area-name,
.sidebar .area-button.home-button.selected .area-menu-chevron{
        color: var(--primary-text-color) !important;
      }

      .sidebar .area-button.home-button.selected .area-icon ha-icon{
        color: var(--primary-color) !important;
      }

      /* Status counts match room badges: near-circle,
never pill-shaped for 1–2 digits. */
      .home-status-card .status-card-badge{
        min-width: 20px !important;
        width: 20px !important;
        height: 20px !important;
        padding: 0 !important;
        border-radius: 999px !important;
      }
    }

    /* Richer power dialog mirrors the Devices > Energy information density. */
    .house-power-dialog{
      width: min(900px, calc(100vw - 32px));
    }

    .house-power-dialog-overview{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 12px;
    }

    .house-power-dialog-overview-card{
      min-width: 0;
      padding: 13px;
      border-radius: 11px;
      background: var(--card-background-color);
      box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 7%, transparent),
        0 8px 22px rgba(15, 23, 42, 0.04);
    }

    .house-power-dialog-overview-head{
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr) auto;
      align-items: center;
      gap: 9px;
    }

    .house-power-dialog-overview-icon{
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      color: ${l(m("energy"))};
      background: color-mix(in srgb, ${l(m("energy"))} 10%, transparent);
    }

    .house-power-dialog-overview-icon ha-icon{ --mdc-icon-size: 21px; }
    .house-power-dialog-overview-head strong{ display: block; font-size: 14px; font-weight: 850; }
    .house-power-dialog-overview-head small{ display: block; margin-top: 3px; color: var(--secondary-text-color); font-size: 11px; font-weight: 700; }
    .house-power-dialog-overview-head b{ font-size: 20px; font-weight: 950; white-space: nowrap; }

    .house-power-statistics-card{
      display: block;
      min-height: 132px;
      margin-top: 10px;
      border-radius: 10px;
      overflow: hidden;
      background: color-mix(in srgb, ${l(m("energy"))} 4%, transparent);
      --ha-card-background: transparent;
      --ha-card-box-shadow: none;
      --ha-card-border-width: 0;
      --ha-card-border-radius: 10px;
    }

    .house-power-dialog-top-entities{
      margin-top: 10px;
      display: grid;
      gap: 5px;
    }

    .house-power-dialog-top-entities button{
      min-height: 30px;
      padding: 0 9px;
      border: 0;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      background: color-mix(in srgb, ${l(m("energy"))} 5%, transparent);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }

    .house-power-dialog-entity.detailed{
      display: grid;
      grid-template-columns: 32px minmax(0, 1fr) auto;
      align-items: center;
      gap: 8px;
      min-height: 42px;
      padding: 5px 6px;
    }

    .house-power-dialog-entity-icon{
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: ${l(m("energy"))};
      background: color-mix(in srgb, ${l(m("energy"))} 9%, transparent);
    }

    .house-power-dialog-entity-icon ha-icon{ --mdc-icon-size: 17px; }

    .house-power-dialog-entity-copy{
      min-width: 0;
      display: grid;
      gap: 2px;
    }

    .house-power-dialog-entity-copy > strong{
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }

    .house-power-dialog-entity-copy > small{
      color: var(--secondary-text-color);
      font-size: 10px;
    }

    .house-power-dialog-entity-bar{
      position: relative;
      height: 3px;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in srgb, ${l(m("energy"))} 10%, var(--secondary-background-color));
    }

    .house-power-dialog-entity-bar span{
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--entity-power-width, 0%);
      min-width: 3px;
      border-radius: inherit;
      background: ${l(m("energy"))};
    }

    .house-power-dialog-entity.detailed > b{
      font-size: 12px;
      white-space: nowrap;
    }

    @media (max-width: 1100px) and (min-width: 769px) {
      .home-status-primary-grid{
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .favorites-grid,
.home-summary-list{
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .home-status-primary-grid,
.home-status-secondary-grid{
        display: contents;
      }

      .home-status-stack{
        display: contents;
      }

      .house-power-dialog-overview{
        grid-template-columns: 1fr;
      }
    }

    /* Compact Home Favorites and clearer sidebar Home state. */
    @media (min-width: 769px) {
      .home-favorites-section .favorites-grid{
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
        gap: 10px !important;
      }

      .home-favorites-section .favorite-card-wrapper{
        min-height: 81px !important;
        height: 81px !important;
        padding: 9px 10px !important;
        display: grid !important;
        grid-template-columns: 38px minmax(0, 1fr) auto !important;
        grid-template-rows: 1fr !important;
        align-items: center !important;
        gap: 9px !important;
      }

      .home-favorites-section .favorite-icon{
        width: 38px !important;
        height: 38px !important;
        margin: 0 !important;
        align-self: center !important;
      }

      .home-favorites-section .favorite-icon ha-icon{
        --mdc-icon-size: 21px !important;
      }

      .home-favorites-section .favorite-body{
        min-width: 0;
        display: flex !important;
        flex-direction: column;
        justify-content: center;
        gap: 3px;
      }

      .home-favorites-section .favorite-name{
        margin: 0 !important;
        font-size: 13px !important;
        line-height: 1.05 !important;
        -webkit-line-clamp: 1 !important;
      }

      .home-favorites-section .favorite-area{
        margin: 0 !important;
        font-size: 9px !important;
        line-height: 1 !important;
      }

      .home-favorites-section .favorite-end{
        min-width: 48px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        gap: 4px;
      }

      .home-favorites-section .favorite-quick-action{
        width: 38px !important;
        height: 22px !important;
        flex: 0 0 auto;
      }

      .home-favorites-section .favorite-end-state,
.home-favorites-section .favorite-info-state{
        max-width: 76px;
        color: var(--secondary-text-color);
        font-size: 9px;
        font-weight: 750;
        line-height: 1.05;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .home-favorites-section .favorite-info-state{
        font-size: 12px;
        color: var(--primary-text-color);
      }

      .home-favorites-section .favorite-state{
        display: none !important;
      }

      /* Unselected Home must not resemble a selected room. */
      .sidebar .area-button.home-button{
        background: var(--card-background-color) !important;
        border-color: color-mix(in srgb, var(--primary-color) 16%, var(--divider-color)) !important;
        box-shadow:
          inset 3px 0 0 color-mix(in srgb, var(--primary-color) 60%, transparent),
          0 5px 12px rgba(15, 23, 42, 0.04) !important;
      }

      .sidebar .area-button.home-button.selected{
        background: color-mix(in srgb, var(--primary-color) 18%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 46%, var(--divider-color)) !important;
        box-shadow:
          inset 4px 0 0 var(--primary-color),
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 12%, transparent),
          0 8px 18px color-mix(in srgb, var(--primary-color) 10%, transparent) !important;
      }

      .sidebar .room-area-button.selected{
        background: color-mix(in srgb, var(--card-background-color) 94%, var(--primary-color) 6%) !important;
      }
    }

    @media (max-width: 1250px) and (min-width: 769px) {
      .home-favorites-section .favorites-grid{
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }
    }

    .house-power-dialog-actions{
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 0 0 auto;
    }

    .house-power-dialog-energy-link{
      min-height: 36px;
      padding: 0 11px;
      border: 0;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      color: ${l(m("energy"))};
      background: color-mix(in srgb, ${l(m("energy"))} 10%, var(--card-background-color));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, ${l(m("energy"))} 14%, transparent);
      font: inherit;
      font-size: 12px;
      font-weight: 850;
      cursor: pointer;
    }

    .house-power-dialog-energy-link:hover{
      background: color-mix(in srgb, ${l(m("energy"))} 15%, var(--card-background-color));
    }

    .house-power-dialog-energy-link ha-icon{
      --mdc-icon-size: 17px;
    }

    @media (max-width: 768px) {
      .house-power-dialog-energy-link span{
        display: none;
      }

      .house-power-dialog-energy-link{
        width: 36px;
        padding: 0;
      }
    }

    /* Final Home polish: compact Favorites, clear Home state, exact room-Favorites centering. */
    @media (min-width: 769px) {
      .home-favorites-section .favorite-card-wrapper{
        height: 84px !important;
        min-height: 84px !important;
        grid-template-columns: 34px minmax(0, 1fr) 46px !important;
        gap: 8px !important;
        padding: 9px 10px !important;
      }
      .home-favorites-section .favorite-icon{
        width: 34px !important;
        height: 34px !important;
      }
      .home-favorites-section .favorite-icon ha-icon{ --mdc-icon-size: 19px !important; }
      .home-favorites-section .favorite-body{
        gap: 2px !important;
        overflow: visible !important;
      }
      .home-favorites-section .favorite-name{
        display: -webkit-box !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: normal !important;
        overflow-wrap: anywhere;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
        font-size: 12px !important;
        line-height: 1.08 !important;
      }
      .home-favorites-section .favorite-area{
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
      }
      .home-favorites-section .favorite-end{
        width: 46px !important;
        min-width: 46px !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
      }
      .home-favorites-section .favorite-quick-action{ margin: 0 auto !important; }
      .home-favorites-section .favorite-end-state{
        width: 100% !important;
        max-width: none !important;
        text-align: center !important;
        font-size: 9px !important;
        line-height: 1 !important;
      }
      .home-favorites-section .favorite-info-state{
        width: 100% !important;
        max-width: none !important;
        text-align: center !important;
        color: var(--favorite-color) !important;
        font-size: 13px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
      }

      .sidebar .area-button.home-button{
        background: color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color)) !important;
        border: 1px solid color-mix(in srgb, var(--primary-color) 20%, var(--divider-color)) !important;
        box-shadow: 0 5px 12px rgba(15, 23, 42, 0.045) !important;
      }
      .sidebar .area-button.home-button.selected{
        background: color-mix(in srgb, var(--primary-color) 18%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 48%, var(--divider-color)) !important;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent),
          0 8px 18px color-mix(in srgb, var(--primary-color) 11%, transparent) !important;
      }
      .sidebar .room-area-button.selected{
        background: color-mix(in srgb, var(--primary-color) 7%, var(--card-background-color)) !important;
      }
    }

    .room-favorites-title,
.room-favorites-title .mobile-domain-leading-chevron,
.room-favorites-title .room-domain-icon,
.room-favorites-title .mobile-domain-title-copy,
.room-favorites-title .mobile-domain-title-label,
.room-favorites-title .mobile-domain-count{
      height: 24px !important;
      min-height: 24px !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      align-self: center !important;
      line-height: 24px !important;
      vertical-align: middle !important;
      transform: none !important;
    }
    .room-favorites-title{
      gap: 6px !important;
    }
    .room-favorites-title .mobile-domain-title-copy{
      gap: 5px !important;
    }
    .house-power-dialog-energy-link{
      min-height: 30px !important;
      padding: 0 10px !important;
      margin-left: 2px !important;
      font-size: 11px !important;
    }
    @media (max-width: 768px) {
      .house-power-dialog-energy-link span{ display: inline !important; }
      .house-power-dialog-energy-link{ width: auto !important; }
    }

    /* Final visual cleanup for Home favorites and room Favorites header. */
    @media (min-width: 769px) {
      .home-favorites-section .favorite-card-wrapper{
        min-height: 84px !important;
        height: 84px !important;
        padding: 9px 10px !important;
        grid-template-columns: 38px minmax(0, 1fr) 50px !important;
        align-items: center !important;
        gap: 9px !important;
      }

      .home-favorites-section .favorite-body{
        min-width: 0 !important;
        align-self: center !important;
        gap: 3px !important;
      }

      .home-favorites-section .favorite-name{
        max-width: 100% !important;
        margin: 0 !important;
        display: -webkit-box !important;
        -webkit-box-orient: vertical !important;
        -webkit-line-clamp: 2 !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: normal !important;
        overflow-wrap: anywhere !important;
        font-size: 13px !important;
        line-height: 1.08 !important;
      }

      .home-favorites-section .favorite-area{
        max-width: 100% !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
        font-size: 9px !important;
        line-height: 1.05 !important;
      }

      .home-favorites-section .favorite-end{
        width: 50px !important;
        min-width: 50px !important;
        height: 48px !important;
        display: grid !important;
        grid-template-rows: 26px 14px !important;
        align-content: center !important;
        justify-items: center !important;
        gap: 2px !important;
      }

      .home-favorites-section .favorite-quick-action{
        width: 40px !important;
        height: 24px !important;
        margin: 0 !important;
      }

      .home-favorites-section .favorite-end-state{
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        color: var(--secondary-text-color) !important;
        font-size: 9px !important;
        font-weight: 800 !important;
        line-height: 12px !important;
        text-align: center !important;
        overflow: visible !important;
        white-space: nowrap !important;
      }

      .home-favorites-section .favorite-info-state{
        width: 100% !important;
        max-width: none !important;
        height: 48px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: var(--favorite-color) !important;
        font-size: 13px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        text-align: center !important;
        overflow: visible !important;
        white-space: nowrap !important;
      }

      .sidebar .area-button.home-button{
        background: color-mix(in srgb, var(--secondary-background-color) 72%, var(--card-background-color)) !important;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, var(--divider-color)) !important;
        box-shadow: 0 5px 12px rgba(15, 23, 42, 0.05) !important;
      }

      .sidebar .area-button.home-button.selected{
        background: color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 38%, var(--divider-color)) !important;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 10%, transparent),
          0 8px 18px color-mix(in srgb, var(--primary-color) 10%, transparent) !important;
      }
    }

    .room-favorites-header{
      min-height: 38px !important;
      height: 38px !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      display: flex !important;
      align-items: center !important;
    }

    .room-favorites-title{
      min-height: 20px !important;
      height: 20px !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      margin: 0 !important;
      padding: 0 !important;
      line-height: 1 !important;
    }

    .room-favorites-title .mobile-domain-leading-chevron,
.room-favorites-title .room-domain-icon{
      width: 18px !important;
      height: 18px !important;
      min-height: 18px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 !important;
      padding: 0 !important;
      line-height: 0 !important;
      transform: none !important;
    }

    .room-favorites-title .mobile-domain-leading-chevron{
      --mdc-icon-size: 16px !important;
    }

    .room-favorites-title .room-favorites-icon ha-icon{
      --mdc-icon-size: 18px !important;
    }

    .room-favorites-title .mobile-domain-title-copy{
      min-height: 20px !important;
      height: 20px !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 5px !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .room-favorites-title .mobile-domain-title-label,
.room-favorites-title .mobile-domain-count{
      min-height: 20px !important;
      height: 20px !important;
      display: inline-flex !important;
      align-items: center !important;
      margin: 0 !important;
      padding: 0 !important;
      line-height: 20px !important;
      transform: translateY(0.5px) !important;
    }

    .room-favorites-title .mobile-domain-title-label{
      font-size: 15px !important;
    }

    .room-favorites-title .mobile-domain-count{
      font-size: 10px !important;
    }


    /* 2026-09 Home polish: readable favorites, clear Home state, exact Favorites header alignment. */
    @media (min-width: 769px) {
      .home-favorites-section .favorites-grid{
        grid-template-columns: repeat(auto-fit, minmax(245px, 1fr)) !important;
        gap: 10px !important;
      }

      .home-favorites-section .favorite-card-wrapper{
        min-height: 86px !important;
        height: auto !important;
        padding: 10px 12px !important;
        display: grid !important;
        grid-template-columns: 40px minmax(0, 1fr) auto !important;
        align-items: center !important;
        gap: 10px !important;
      }

      .home-favorites-section .favorite-icon{
        width: 40px !important;
        height: 40px !important;
        margin: 0 !important;
        align-self: center !important;
      }

      .home-favorites-section .favorite-body{
        min-width: 0 !important;
        overflow: visible !important;
        align-self: center !important;
        gap: 3px !important;
      }

      .home-favorites-section .favorite-name,
.home-favorites-section .favorite-area{
        max-width: 100% !important;
        display: block !important;
        overflow: visible !important;
        text-overflow: clip !important;
        white-space: normal !important;
        overflow-wrap: anywhere !important;
        -webkit-line-clamp: unset !important;
        -webkit-box-orient: initial !important;
      }

      .home-favorites-section .favorite-name{
        margin: 0 !important;
        font-size: 13px !important;
        line-height: 1.12 !important;
      }

      .home-favorites-section .favorite-area{
        margin: 0 !important;
        font-size: 10px !important;
        line-height: 1.12 !important;
      }

      .home-favorites-section .favorite-end{
        width: auto !important;
        min-width: 0 !important;
        height: auto !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 8px !important;
      }

      .home-favorites-section .favorite-end-state{
        width: auto !important;
        max-width: none !important;
        margin: 0 !important;
        color: var(--favorite-color) !important;
        font-size: 10px !important;
        font-weight: 850 !important;
        line-height: 1 !important;
        text-align: right !important;
        overflow: visible !important;
        white-space: nowrap !important;
      }

      .home-favorites-section .favorite-quick-action{
        width: 40px !important;
        height: 24px !important;
        margin: 0 !important;
        flex: 0 0 auto !important;
      }

      .home-favorites-section .favorite-info-state{
        width: auto !important;
        max-width: none !important;
        height: auto !important;
        display: block !important;
        color: var(--favorite-color) !important;
        font-size: 15px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        text-align: right !important;
        overflow: visible !important;
        white-space: nowrap !important;
      }

      .sidebar .area-button.home-button{
        background: color-mix(in srgb, var(--primary-color) 9%, var(--secondary-background-color)) !important;
        border: 1px solid color-mix(in srgb, var(--primary-color) 22%, var(--divider-color)) !important;
        box-shadow: 0 5px 12px rgba(15, 23, 42, 0.045) !important;
      }

      .sidebar .area-button.home-button.selected{
        background: color-mix(in srgb, var(--primary-color) 20%, var(--card-background-color)) !important;
        border-color: color-mix(in srgb, var(--primary-color) 46%, var(--divider-color)) !important;
        box-shadow:
          inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 12%, transparent),
          0 8px 18px color-mix(in srgb, var(--primary-color) 10%, transparent) !important;
      }
    }

    .room-favorites-header{
      min-height: 40px !important;
      height: 40px !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      display: flex !important;
      align-items: center !important;
    }

    .room-favorites-title,
.room-favorites-title .mobile-domain-title-copy{
      min-height: 0 !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      align-self: center !important;
      line-height: 1.15 !important;
      transform: none !important;
    }

    .room-favorites-title{
      gap: 6px !important;
    }

    .room-favorites-title .mobile-domain-title-copy{
      gap: 5px !important;
    }

    .room-favorites-title .mobile-domain-leading-chevron,
.room-favorites-title .room-domain-icon{
      width: 18px !important;
      height: 18px !important;
      min-height: 18px !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      align-self: center !important;
      line-height: 0 !important;
      transform: none !important;
    }

    .room-favorites-title .mobile-domain-title-label,
.room-favorites-title .mobile-domain-count{
      min-height: 0 !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      align-self: center !important;
      line-height: 1.15 !important;
      transform: none !important;
      vertical-align: middle !important;
    }


    /* 2026-09-30 final entity-card system: compact favorites + four-column room controls. */
    @media (min-width: 769px) {
      .home-favorites-section .favorites-grid,
.room-favorites-content .favorites-grid{
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
        gap: 8px !important;
      }

      .home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        width: 100% !important;
        height: 58px !important;
        min-height: 58px !important;
        padding: 7px 8px !important;
        box-sizing: border-box !important;
        display: grid !important;
        grid-template-columns: 36px minmax(0, 1fr) auto !important;
        grid-template-rows: 1fr !important;
        align-items: center !important;
        gap: 7px !important;
        overflow: hidden !important;
        border-radius: 8px !important;
      }

      .home-favorites-section .favorite-icon,
.room-favorites-content .favorite-icon{
        width: 36px !important;
        height: 36px !important;
        margin: 0 !important;
        align-self: center !important;
        border-radius: 8px !important;
      }

      .home-favorites-section .favorite-icon ha-icon,
.room-favorites-content .favorite-icon ha-icon{
        --mdc-icon-size: 19px !important;
      }

      .home-favorites-section .favorite-body,
.room-favorites-content .favorite-body{
        min-width: 0 !important;
        height: 36px !important;
        align-self: center !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        gap: 3px !important;
        overflow: hidden !important;
      }

      .home-favorites-section .favorite-name,
.room-favorites-content .favorite-name{
        min-width: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        display: block !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
        font-size: 10.5px !important;
        font-weight: 850 !important;
        line-height: 1.05 !important;
        letter-spacing: -0.12px !important;
      }

      .home-favorites-section .favorite-meta,
.room-favorites-content .favorite-meta{
        min-width: 0 !important;
        display: flex !important;
        align-items: center !important;
        gap: 3px !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        font-size: 9.5px !important;
        font-weight: 700 !important;
        line-height: 1 !important;
      }

      .home-favorites-section .favorite-area,
.room-favorites-content .favorite-area{
        min-width: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
        color: var(--secondary-text-color) !important;
        font-size: inherit !important;
        line-height: inherit !important;
      }

      .home-favorites-section .favorite-meta-separator,
.room-favorites-content .favorite-meta-separator{
        flex: 0 0 auto !important;
        color: color-mix(in srgb, var(--secondary-text-color) 72%, transparent) !important;
      }

      .home-favorites-section .favorite-inline-state,
.room-favorites-content .favorite-inline-state{
        flex: 0 0 auto !important;
        color: var(--favorite-color) !important;
        font-weight: 850 !important;
      }

      .home-favorites-section .favorite-card-wrapper.is-off .favorite-inline-state,
.home-favorites-section .favorite-card-wrapper.is-idle .favorite-inline-state,
.room-favorites-content .favorite-card-wrapper.is-off .favorite-inline-state,
.room-favorites-content .favorite-card-wrapper.is-idle .favorite-inline-state{
        color: var(--secondary-text-color) !important;
      }

      .home-favorites-section .favorite-end,
.room-favorites-content .favorite-end{
        width: auto !important;
        min-width: 0 !important;
        height: 36px !important;
        display: inline-flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 4px !important;
        align-self: center !important;
      }

      .home-favorites-section .favorite-quick-action,
.room-favorites-content .favorite-quick-action{
        width: 38px !important;
        height: 22px !important;
        margin: 0 !important;
      }

      .favorite-cover-actions{
        min-height: 30px;
        padding: 2px;
        display: inline-flex;
        align-items: center;
        gap: 2px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--secondary-background-color) 74%, #ffffff);
        box-shadow:
          inset 0 0 0 1px rgba(15, 23, 42, 0.055),
          0 4px 10px rgba(15, 23, 42, 0.06);
      }

      .favorite-cover-action{
        width: 25px;
        height: 25px;
        padding: 0;
        border: 0;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: color-mix(in srgb, var(--primary-text-color) 60%, transparent);
        background: transparent;
        cursor: pointer;
      }

      .favorite-cover-action ha-icon{ --mdc-icon-size: 15px; }

      .favorite-cover-action.active{
        color: #fff;
        background: var(--favorite-color);
      }

      .mobile-light-control-row{
        width: 100%;
        min-width: 0;
        margin-top: 8px;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        align-items: center;
        gap: 8px;
      }

      .mobile-light-mode-buttons{
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .mobile-light-mode-button{
        width: 28px;
        height: 28px;
        padding: 0;
        border: 0;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: color-mix(in srgb, var(--primary-text-color) 64%, transparent);
        background: color-mix(in srgb, var(--secondary-background-color) 74%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 5%, transparent);
        cursor: pointer;
      }

      .mobile-light-mode-button ha-icon{ --mdc-icon-size: 16px; }

      .mobile-light-mode-button.active{
        color: var(--entity-color);
        background: color-mix(in srgb, var(--entity-color) 15%, var(--card-background-color));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--entity-color) 24%, transparent);
      }

      .mobile-light-control-slider,
.mobile-cover-position input[type="range"]{
        appearance: none;
        width: 100%;
        height: 5px;
        margin: 0;
        border: 0;
        border-radius: 999px;
        outline: none;
        background: color-mix(in srgb, var(--primary-text-color) 13%, transparent);
        cursor: pointer;
      }

      .mobile-light-control-row.mode-brightness .mobile-light-control-slider{
        background: linear-gradient(90deg, ${l(m("light"))} 0%, #f0bd45 100%);
      }

      .mobile-light-control-row.mode-color_temp .mobile-light-control-slider{
        background: linear-gradient(90deg, #f4a340 0%, #ffe4aa 43%, #d9ecff 66%, #7eb9ff 100%);
      }

      .mobile-light-control-row.mode-color .mobile-light-control-slider{
        background: linear-gradient(
          90deg,
          #ff3b30 0%,
          #ff9500 16%,
          #ffcc00 30%,
          #34c759 45%,
          #00c7be 58%,
          #007aff 72%,
          #5856d6 84%,
          #af52de 92%,
          #ff2d55 100%
        );
      }

      .mobile-light-control-slider::-webkit-slider-thumb,
.mobile-cover-position input[type="range"]::-webkit-slider-thumb{
        appearance: none;
        width: 15px;
        height: 15px;
        border: 2px solid var(--entity-color);
        border-radius: 50%;
        background: var(--card-background-color);
        box-shadow: 0 2px 5px rgba(15, 23, 42, 0.12);
      }

      .mobile-light-control-slider::-moz-range-thumb,
.mobile-cover-position input[type="range"]::-moz-range-thumb{
        width: 13px;
        height: 13px;
        border: 2px solid var(--entity-color);
        border-radius: 50%;
        background: var(--card-background-color);
      }

      .mobile-cover-position{
        width: 100%;
        margin-top: 10px;
      }

      .mobile-cover-position input[type="range"]{
        background: linear-gradient(90deg, var(--entity-color) 0%, var(--entity-color) 100%) !important;
      }

      .mobile-entity-brightness{
        display: none !important;
      }
    }


    /* 2026-09-30 entity-card refinements */
    @media (min-width: 769px) {
      /* Favorites: identical component in Home and room header; use every pixel for text. */
      .home-favorites-section .favorite-card-wrapper,
.header-favorites .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        grid-template-columns: 32px minmax(0, 1fr) auto !important;
        gap: 5px !important;
        padding: 6px 7px !important;
      }

      .home-favorites-section .favorite-icon,
.header-favorites .favorite-icon,
.room-favorites-content .favorite-icon{
        width: 32px !important;
        height: 32px !important;
      }

      .home-favorites-section .favorite-body,
.header-favorites .favorite-body,
.room-favorites-content .favorite-body{
        height: 32px !important;
        gap: 2px !important;
      }

      .home-favorites-section .favorite-name,
.header-favorites .favorite-name,
.room-favorites-content .favorite-name{
        font-size: 10px !important;
        letter-spacing: -0.2px !important;
      }

      .home-favorites-section .favorite-name.is-long,
.header-favorites .favorite-name.is-long,
.room-favorites-content .favorite-name.is-long{
        font-size: 9px !important;
        letter-spacing: -0.28px !important;
      }

      .home-favorites-section .favorite-name.is-very-long,
.header-favorites .favorite-name.is-very-long,
.room-favorites-content .favorite-name.is-very-long{
        font-size: 8px !important;
        letter-spacing: -0.32px !important;
      }

      .home-favorites-section .favorite-meta,
.header-favorites .favorite-meta,
.room-favorites-content .favorite-meta{
        font-size: 8.7px !important;
        gap: 2px !important;
      }

      .home-favorites-section .favorite-quick-action,
.header-favorites .favorite-quick-action,
.room-favorites-content .favorite-quick-action{
        width: 36px !important;
        height: 21px !important;
      }

      .home-favorites-section .favorite-end,
.header-favorites .favorite-end,
.room-favorites-content .favorite-end{
        height: 32px !important;
        margin-left: 2px !important;
      }

      .header-favorites .favorites-grid,
.room-favorites-content .favorites-grid{
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
        gap: 8px !important;
      }

      .mobile-light-control-row{
        margin-top: 6px !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        gap: 7px !important;
      }

      .mobile-light-mode-buttons{
        order: 2;
        gap: 3px !important;
      }

      .mobile-light-control-slider{
        order: 1;
      }

      .mobile-light-mode-button{
        width: 27px !important;
        height: 27px !important;
      }

      /* Slightly stronger sliders/thumbs for lights and covers. */
      .mobile-light-control-slider,
.mobile-cover-position input[type="range"]{
        height: 6px !important;
      }

      .mobile-light-control-slider::-webkit-slider-thumb,
.mobile-cover-position input[type="range"]::-webkit-slider-thumb{
        width: 16px !important;
        height: 16px !important;
      }

      .mobile-light-control-slider::-moz-range-thumb,
.mobile-cover-position input[type="range"]::-moz-range-thumb{
        width: 14px !important;
        height: 14px !important;
      }

      .mobile-cover-position{
        margin-top: 7px !important;
      }

      /* A cover percentage describes the open position,
so fill from the left up to that value. */
      .mobile-cover-position input[type="range"]{
        background: linear-gradient(
          90deg,
          var(--entity-color) 0%,
          var(--entity-color) var(--cover-position),
          color-mix(in srgb, var(--primary-text-color) 13%, transparent) var(--cover-position),
          color-mix(in srgb, var(--primary-text-color) 13%, transparent) 100%
        ) !important;
      }
    }


    /* 2026-10-01 entity/favorites refinement: compact vertical rhythm and clean controls. */
    @media (min-width: 769px) {

      .mobile-light-control-row{
        margin-top: 8px !important;
        margin-bottom: 0 !important;
        min-height: 27px !important;
        align-items: center !important;
      }

      .mobile-light-control-slider,
.mobile-cover-position input[type="range"]{
        height: 8px !important;
      }

      .mobile-light-control-slider::-webkit-slider-runnable-track,
.mobile-cover-position input[type="range"]::-webkit-slider-runnable-track{
        height: 8px !important;
        border-radius: 999px !important;
      }

      .mobile-light-control-slider::-moz-range-track,
.mobile-cover-position input[type="range"]::-moz-range-track{
        height: 8px !important;
        border-radius: 999px !important;
      }

      .mobile-light-control-slider::-moz-range-progress{
        height: 8px !important;
        border-radius: 999px !important;
      }

      .mobile-cover-position{
        margin-top: 8px !important;
        margin-bottom: 0 !important;
        min-height: 8px !important;
      }

      .mobile-cover-position input[type="range"]{
        display: block !important;
      }

      /* Favorites: same compact rhythm on Home and in rooms. */
      .home-favorites-section .favorites-header{
        margin-bottom: 8px !important;
      }

      .home-favorites-section .favorites-grid{
        overflow: visible !important;
        padding: 2px 0 4px !important;
      }

      .home-favorites-section .favorites-section,
.home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorites-section,
.room-favorites-content .favorite-card-wrapper{
        overflow: visible !important;
      }

      .room-favorites-content{
        padding-top: 2px !important;
      }

      .home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        overflow: visible !important;
      }

      /* A value-only favorite uses exactly the same visual slot as the light toggle. */
      .home-favorites-section .favorite-status-pill,
.room-favorites-content .favorite-status-pill{
        width: 38px !important;
        height: 22px !important;
        box-sizing: border-box !important;
        flex: 0 0 38px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 999px !important;
        color: var(--favorite-color) !important;
        background: color-mix(in srgb, var(--favorite-color) 12%, var(--card-background-color)) !important;
        font-size: 10px !important;
        font-weight: 850 !important;
        line-height: 1 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }

      .home-favorites-section .favorite-end,
.room-favorites-content .favorite-end{
        min-width: 38px !important;
      }

      /* With a toggle,
the area line is the only secondary text; no duplicate state. */
      .home-favorites-section .favorite-meta,
.room-favorites-content .favorite-meta{
        gap: 0 !important;
      }

      /* Keep the same title-to-card distance as the other generated entity groups. */
      .room-favorites-content .favorites-grid{
        padding-top: 2px !important;
      }

      /* Preserve the shadow around the Home cards instead of clipping it at the card edge. */
      .home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        clip-path: none !important;
      }
    }


    /* 2026-10-01: restore the 1.9.0 slider geometry and final room/home rhythm. */
    @media (min-width: 769px) {
      .mobile-light-control-slider,
.mobile-cover-position input[type="range"]{
        height: 5px !important;
      }

      .mobile-light-control-slider::-webkit-slider-runnable-track,
.mobile-cover-position input[type="range"]::-webkit-slider-runnable-track{
        height: 5px !important;
        border-radius: 999px !important;
      }

      .mobile-light-control-slider::-moz-range-track,
.mobile-cover-position input[type="range"]::-moz-range-track{
        height: 5px !important;
        border-radius: 999px !important;
      }

      .mobile-light-control-slider::-moz-range-progress{
        height: 5px !important;
        border-radius: 999px !important;
      }

      .mobile-light-control-slider::-webkit-slider-thumb,
.mobile-cover-position input[type="range"]::-webkit-slider-thumb{
        width: 15px !important;
        height: 15px !important;
      }

      .mobile-light-control-slider::-moz-range-thumb,
.mobile-cover-position input[type="range"]::-moz-range-thumb{
        width: 13px !important;
        height: 13px !important;
      }

      /* Favorites sit close to their header,
with the same compact rhythm as entity groups. */
      .home-favorites-section{
        overflow: visible !important;
      }

      .home-favorites-section .favorites-header{
        margin-bottom: 6px !important;
      }

      .home-favorites-section .favorites-grid,
.room-favorites-content .favorites-grid{
        padding-top: 0 !important;
        overflow: visible !important;
      }

      .home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        overflow: visible !important;
      }

    }

    /* 2026-10-01: restore 1.9.0 controls + final favorites spacing/shadows. */
    @media (min-width: 769px) {
      /*
       * Keep the 1.9.6 implementation code available,
but do not render the
       * added light sliders/mode buttons or the cover-position slider.
       * This restores the visible control behavior of 1.9.0:
       * lights = normal toggle,
covers = open/stop/close buttons.
       */

      .room-favorites-block:not(.is-collapsed) .room-favorites-header{
        margin-bottom: 2px !important;
      }

      .room-favorites-content,
.room-favorites-content .favorites-grid{
        padding-top: 0 !important;
        margin-top: 0 !important;
      }

      /*
       * Home has a more specific overflow-x rule than the room view.
       * Override it so the shadow belongs to each individual favorite tile
       * and is not clipped at the bottom.
       */
      .home-view .home-favorites-section,
.home-view .home-favorites-section .favorites-grid,
.home-view .home-favorites-section .favorite-card-wrapper{
        overflow: visible !important;
      }

      .home-view .home-favorites-section .favorite-card-wrapper{
        clip-path: none !important;
      }
    }

    /* 2026-10-01: definitive room-grid/favorite spacing pass. */
    @media (min-width: 769px) {

      /*
       * Favorites: the room header has its own 6px content padding,
which
       * doubled the intended header-to-card distance. Remove only that
       * top padding; the other insets remain unchanged.
       */
      .room-favorites-content{
        padding-top: 0 !important;
      }

      .room-favorites-content .favorites-grid{
        padding-top: 0 !important;
      }

      .home-favorites-section .favorites-header{
        margin-bottom: 6px !important;
      }
    }

    /* 2026-10-01: match the 1.9.0 favorite spacing and shadow behavior. */
    @media (min-width: 769px) {

      /* Home favorites must not use paint containment,
otherwise their card shadows are clipped. */
      .home-favorites-section{
        content-visibility: visible !important;
        contain: layout style !important;
        overflow: visible !important;
      }

      .home-favorites-section .favorites-grid,
.home-favorites-section .favorite-card-wrapper{
        overflow: visible !important;
      }
    }

    /* 2026-10-01: Favorites spacing and Home card-shadow fix. */
    @media (min-width: 769px) {
      /* Cards directly follow the room Favorites header. */
      .room-favorites-block:not(.is-collapsed) .room-favorites-header{
        margin-bottom: 0 !important;
      }
      .room-favorites-content,
.room-favorites-content .favorites-grid{
        padding-top: 0 !important;
      }

      /* Home Favorites: keep individual card shadows visible,
as on room pages. */
      .home-favorites-section,
.home-favorites-section .favorites-grid,
.home-favorites-section .favorites-section{
        overflow: visible !important;
      }
      .home-favorites-section .favorite-card-wrapper{
        overflow: visible !important;
        clip-path: none !important;
      }
    }


    /* 2026-10-01: Home favorites should match the room-card shadow treatment. */
    @media (min-width: 769px) {
      .home-favorites-section .favorites-header{
        margin-bottom: 0 !important;
      }

      .home-favorites-section .favorites-grid{
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      /* Do not let Home-section paint/content containment clip card shadows. */
      .home-favorites-section{
        content-visibility: visible !important;
        contain: none !important;
        overflow: visible !important;
      }

      .home-favorites-section .favorites-grid{
        overflow: visible !important;
      }

      .home-favorites-section .favorite-card-wrapper{
        contain: layout style !important;
        overflow: visible !important;
      }
    }


    /* 2026-10-01: Home favorites should match the room-card shadow treatment. */
    @media (min-width: 769px) {
      .home-favorites-section .favorites-header{
        margin-bottom: 0 !important;
      }

      .home-favorites-section .favorites-grid{
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      .home-favorites-section{
        content-visibility: visible !important;
        contain: none !important;
        overflow: visible !important;
      }

      .home-favorites-section .favorites-grid{
        overflow: visible !important;
      }

      .home-favorites-section .favorite-card-wrapper{
        contain: layout style !important;
        overflow: visible !important;
      }
    }

    /* 2026-10-01: desktop room/entity scale — 20% larger, four columns. */
    @media (min-width: 769px) {

      /* Sidebar room tiles: target the actual room tile class; do not override generic area buttons. */
      .sidebar .room-area-button{
        display: grid !important;
        grid-template-columns: 89px minmax(0, 1fr) !important;
        align-items: stretch !important;
        gap: 12px !important;
        min-height: 110px !important;
        height: 110px !important;
        padding: 10px !important;
        box-sizing: border-box !important;
        border-radius: 12px !important;
      }

      .sidebar .room-area-button .area-media{
        width: 89px !important;
        height: 89px !important;
        align-self: center !important;
      }
      .sidebar .room-area-button .area-media-icon{
        width: 89px !important;
        height: 89px !important;
      }
      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: 41px !important;
      }

      .sidebar .room-area-button .area-content{
        min-width: 0 !important;
        height: 100% !important;
        justify-content: center !important;
        gap: 8px !important;
      }
      .sidebar .room-area-button .area-name{
        font-size: 16.8px !important;
        line-height: 1.1 !important;
      }
      .sidebar .room-area-button .area-sensors{
        margin-top: 4px !important;
        font-size: 13.2px !important;
        line-height: 1.1 !important;
      }
      .sidebar .room-area-button .area-info-badges{
        gap: 5px !important;
        max-width: 100% !important;
        min-width: 0 !important;
        overflow: hidden !important;
      }
      .sidebar .room-area-button .info-badge{
        min-width: 32px !important;
        height: 25px !important;
        padding: 0 8px !important;
        font-size: 13px !important;
        flex: 0 0 auto !important;
      }
      .sidebar .room-area-button .info-badge ha-icon{ --mdc-icon-size: 15px !important; }
      .sidebar .room-area-button .badge-count{ font-size: 13px !important; }
      .sidebar .room-area-button .info-badge-overflow{
        min-width: 20px !important;
        width: 20px !important;
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--secondary-text-color) !important;
        font-size: 16px !important;
        font-weight: 900 !important;
        letter-spacing: 1px !important;
      }

      /* Room header status badges: about 30% larger{
        min-height: 24px !important;
        gap: 5px !important;
        align-items: center !important;
      }

      /* Room-view time/weather: move the cluster slightly left and keep the Home weather treatment. */
      .global-header.room-context{ padding-right: 20px !important; }
      .global-header.room-context .header-time-weather{ gap: 6px !important; }
      .global-header.room-context .weather-compact{
        background: var(--secondary-background-color) !important;
        color: var(--primary-text-color) !important;
      }
      .global-header.room-context .weather-compact ha-icon{ color: var(--primary-text-color) !important; }
    }
    /* 2026-10-01: desktop room-view follow-up — final scoped overrides. */
    @media (min-width: 769px) {

      /* Sidebar: reserve one slot for the ellipsis whenever badges are hidden. */
      .sidebar .room-area-button .area-info-badges{
        min-width: 0 !important;
        max-width: 100% !important;
        overflow: visible !important;
        flex-wrap: nowrap !important;
      }
      .sidebar .room-area-button .info-badge-overflow{
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 18px !important;
        width: 18px !important;
        min-width: 18px !important;
        height: 19px !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--secondary-text-color) !important;
        font-size: 17px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
        letter-spacing: 1px !important;
      }

      /* Room header meta: move the whole time/weather cluster slightly left and tighten the gap. */
      .global-header.room-context{
        padding-right: 36px !important;
      }
      .global-header.room-context .header-time-weather{
        gap: 5px !important;
        transform: translateX(-2px) !important;
      }
      .global-header.room-context .weather-compact{
        background: var(--secondary-background-color) !important;
        color: var(--primary-text-color) !important;
        box-shadow: none !important;
      }
      .global-header.room-context .weather-compact .weather-icon-compact ha-icon{
        color: var(--primary-text-color) !important;
      }
    }
    /* 2026-10-01: header status carousel. */
    .header-status-section{
      position: relative;
      min-width: 0;
    }

    .header-status-section .header-status-scroll{
      min-width: 0;
      overflow-x: auto;
      overflow-y: hidden;
      padding-inline: 30px;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
      scroll-snap-type: x proximity;
      scroll-padding-inline: 30px;
    }

    .header-status-section .header-status-scroll > .status-card-compact{
      flex: 0 0 auto;
      scroll-snap-align: start;
    }

    .header-status-section .header-status-scroll::-webkit-scrollbar{
      display: none;
    }

    .header-status-scroll-button{
      position: absolute;
      top: 50%;
      z-index: 4;
      width: 24px;
      height: 24px;
      padding: 0;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      border-radius: 999px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      box-shadow: 0 2px 7px rgba(15, 23, 42, 0.12);
      cursor: pointer;
    }

    .header-status-scroll-button:hover{
      background: var(--secondary-background-color);
    }

    .header-status-scroll-button ha-icon{
      --mdc-icon-size: 17px;
    }

    .header-status-scroll-button-left{
      left: 2px;
    }

    .header-status-scroll-button-right{
      right: 2px;
    }



    /* 2026-10-01: final responsive room/sidebar follow-up. */
    @media (min-width: 769px) {

      /* Sidebar room tile and icon scale continuously with the tile width. */
      .sidebar .room-area-button{
        container-type: inline-size;
        grid-template-columns: clamp(64px, 30cqw, 110px) minmax(0, 1fr) !important;
        min-height: clamp(82px, 36cqw, 120px) !important;
        height: clamp(82px, 36cqw, 120px) !important;
        gap: clamp(8px, 3cqw, 12px) !important;
      }

      .sidebar .room-area-button .area-media,
.sidebar .room-area-button .area-media-icon{
        width: 100% !important;
        height: 100% !important;
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: clamp(28px, 11cqw, 42px) !important;
      }

      /* The badge row uses the full remaining width; the TS calculation decides
         how many badges plus the overflow marker are rendered. */
      .sidebar .room-area-button .area-info-badges{
        width: 100% !important;
        max-width: none !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        justify-content: flex-start !important;
        gap: 5px !important;
        overflow: hidden !important;
      }

      /* Keep room meta and favorites aligned with the right edge of the view. */
      .global-header.room-context .header-time-weather{
        margin-left: auto !important;
        justify-self: end !important;
      }

      .global-header.room-context .room-favorites-content .favorites-grid{
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }

    /* The room weather pill must not fall back to HA's neutral secondary background. */
    .global-header.room-context .weather-compact{
      background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
      color: var(--primary-color) !important;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) !important;
    }

    .global-header.room-context .weather-compact .weather-icon-compact ha-icon{
      color: var(--primary-color) !important;
    }

    .global-header.room-context .weather-compact .weather-temp-compact{
      color: var(--primary-text-color) !important;
    }

    /* Selection lists: icon is always the leading element{
      direction: ltr !important;
      display: grid !important;
      grid-template-columns: 46px minmax(0, 1fr) !important;
      grid-template-areas: "icon content" !important;
      align-items: center !important;
    }

    /* Weather should use the dashboard accent instead of the neutral gray pill. */
    .global-header .weather-compact{
      background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
      color: var(--primary-color) !important;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) !important;
    }

    .global-header .weather-compact .weather-icon-compact ha-icon{
      color: var(--primary-color) !important;
    }

    .global-header .weather-compact .weather-temp-compact{
      color: var(--primary-text-color) !important;
    }

    /* Sidebar room tiles: badge overflow follows the continuously calculated width. */
    @media (min-width: 769px) {
      .sidebar .room-area-button .area-info-badges{
        width: 100% !important;
        max-width: none !important;
        display: flex !important;
        grid-template-columns: none !important;
        flex-wrap: nowrap !important;
        justify-content: flex-start !important;
        gap: 5px !important;
        overflow: hidden !important;
      }
    }

    /* 2026-10-01: final responsive room-view overrides. */
    @media (min-width: 769px) {

      /* Sidebar room tiles scale with their actual width. */
      .sidebar .room-area-button{
        container-type: inline-size !important;
        grid-template-columns: clamp(64px, 30cqw, 110px) minmax(0, 1fr) !important;
        min-height: clamp(82px, 36cqw, 120px) !important;
        height: clamp(82px, 36cqw, 120px) !important;
        gap: clamp(8px, 3cqw, 12px) !important;
      }

      .sidebar .room-area-button .area-media,
.sidebar .room-area-button .area-media-icon{
        width: 100% !important;
        height: 100% !important;
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: clamp(28px, 11cqw, 42px) !important;
      }

      /* The TS calculation controls how many badges fit; CSS no longer caps the row. */
      .sidebar .room-area-button .area-info-badges{
        width: 100% !important;
        max-width: none !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        justify-content: flex-start !important;
        gap: 5px !important;
        overflow: hidden !important;
      }

      /* Keep weather/time and favorites aligned to the right edge. */
      .global-header.room-context .header-time-weather{
        margin-left: auto !important;
        justify-self: end !important;
      }

      .global-header.room-context .room-favorites-content .favorites-grid{
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }

    /* Weather must keep the accent treatment; later room-specific rules must not turn it gray. */
    .global-header.room-context .weather-compact{
      background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
      color: var(--primary-color) !important;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) !important;
    }

    .global-header.room-context .weather-compact .weather-icon-compact ha-icon{
      color: var(--primary-color) !important;
    }

    .global-header.room-context .weather-compact .weather-temp-compact{
      color: var(--primary-text-color) !important;
    }


    /* 2026-10-02: refine room tile proportions and unify weather styling. */
    @media (min-width: 769px) {
      /*
       * Room-header metric pills: keep the larger{
        gap: 8px !important;
      }

      /*
       * Sidebar room tiles: make the card less cramped,
but keep the media
       * slot fixed so resizing the sidebar never changes the room icon size.
       */
      .sidebar .room-area-button{
        container-type: normal !important;
        display: grid !important;
        grid-template-columns: 74px minmax(0, 1fr) !important;
        align-items: stretch !important;
        gap: 9px !important;
        min-height: 88px !important;
        height: 88px !important;
        padding: 7px !important;
      }

      .sidebar .room-area-button .area-media{
        grid-column: 1 !important;
        grid-row: 1 !important;
        width: 74px !important;
        height: 74px !important;
        min-width: 74px !important;
        min-height: 74px !important;
        max-width: 74px !important;
        max-height: 74px !important;
        align-self: center !important;
      }

      .sidebar .room-area-button .area-media-icon{
        width: 74px !important;
        height: 74px !important;
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: 31px !important;
      }

      /*
       * Three rows next to the fixed icon:
       * 1. room name
       * 2. temperature / humidity / power
       * 3. status badges
       *
       * Equal 4px gaps above and below the values row keep the stack balanced.
       */
      .sidebar .room-area-button .area-content{
        grid-column: 2 !important;
        grid-row: 1 !important;
        min-width: 0 !important;
        width: 100% !important;
        height: 74px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: stretch !important;
        gap: 4px !important;
        overflow: hidden !important;
      }

      .sidebar .room-area-button .area-top-section{
        min-width: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        display: contents !important;
      }

      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        min-width: 0 !important;
        max-width: 100% !important;
        margin: 0 !important;
        color: var(--primary-text-color) !important;
        text-shadow: none !important;
        font-size: 14px !important;
        font-weight: 850 !important;
        line-height: 1 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        min-width: 0 !important;
        max-width: 100% !important;
        margin: 0 !important;
        color: var(--secondary-text-color) !important;
        text-shadow: none !important;
        font-size: 11px !important;
        font-weight: 650 !important;
        line-height: 1 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      .sidebar .room-area-button .area-info-badges{
        position: static !important;
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 4px !important;
        overflow: hidden !important;
      }

      /*
       * Sidebar badges: slightly larger than the previous version,
with the
       * icon and count centered together.
       */
      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 24px !important;
        height: 18px !important;
        padding: 0 5px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 3px !important;
        font-size: 9.5px !important;
        line-height: 1 !important;
        flex: 0 0 auto !important;
        box-sizing: border-box !important;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 10px !important;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 9.5px !important;
        line-height: 1 !important;
      }

      .sidebar .room-area-button .info-badge-overflow{
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 15px !important;
        width: 15px !important;
        min-width: 15px !important;
        height: 18px !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        color: var(--secondary-text-color) !important;
        font-size: 14px !important;
        font-weight: 900 !important;
        line-height: 1 !important;
      }

      /*
       * Startseite and room-view weather use the same compact blue-accent pill.
       */
      .global-header .weather-compact,
.global-header.room-context .weather-compact{
        min-height: 38px !important;
        height: 38px !important;
        padding: 0 12px !important;
        gap: 7px !important;
        border-radius: 999px !important;
        box-sizing: border-box !important;
        background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
        color: var(--primary-color) !important;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) !important;
      }

      .global-header .weather-compact .weather-icon-compact ha-icon,
.global-header.room-context .weather-compact .weather-icon-compact ha-icon{
        --mdc-icon-size: 18px !important;
        color: var(--primary-color) !important;
      }

      .global-header .weather-compact .weather-temp-compact,
.global-header.room-context .weather-compact .weather-temp-compact{
        font-size: 13px !important;
        color: var(--primary-text-color) !important;
        line-height: 1 !important;
      }

      /*
       * Keep the corrected favorites icon column so favorite names cannot
       * overlap their icons.
       */
      .room-favorites-content .favorites-grid{
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
        gap: 8px !important;
        width: 100% !important;
      }

      .home-favorites-section .favorite-card-wrapper,
.room-favorites-content .favorite-card-wrapper{
        grid-template-columns: 41px minmax(0, 1fr) auto !important;
      }

      .home-favorites-section .favorite-icon,
.room-favorites-content .favorite-icon{
        width: 41px !important;
        height: 41px !important;
      }

      .home-favorites-section .favorite-icon ha-icon,
.room-favorites-content .favorite-icon ha-icon{
        --mdc-icon-size: 22px !important;
      }

      .home-favorites-section .favorite-body,
.room-favorites-content .favorite-body{
        height: 41px !important;
        min-width: 0 !important;
        overflow: hidden !important;
      }

      .home-favorites-section .favorite-name,
.room-favorites-content .favorite-name{
        min-width: 0 !important;
        max-width: 100% !important;
        font-size: 12.1px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      .home-favorites-section .favorite-meta,
.room-favorites-content .favorite-meta,
.home-favorites-section .favorite-area,
.room-favorites-content .favorite-area{
        min-width: 0 !important;
        max-width: 100% !important;
        font-size: 10.9px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
    }

    /*
     * 2026-10-01 mobile Home parity pass.
     * Match the desktop component rhythm while retaining mobile rail/grid switching.
     */
    @media (max-width: 768px) {
      .home-status-section .home-status-grid{
        display: flex !important;
        align-items: stretch !important;
        gap: 10px !important;
        margin: 0 !important;
        padding: 2px 18px 16px !important;
        overflow-x: auto !important;
        overflow-y: visible !important;
        scroll-padding: 18px !important;
        scroll-snap-type: x proximity !important;
        scrollbar-width: none !important;
      }

      .home-status-section .home-status-grid::-webkit-scrollbar{
        display: none !important;
      }

      .home-status-section.layout-grid .home-status-grid{
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        align-items: stretch !important;
        gap: 10px !important;
        overflow: visible !important;
        scroll-snap-type: none !important;
      }

      .home-status-section .home-status-card.compact-status{
        flex: 0 0 118px !important;
        width: 118px !important;
        min-width: 118px !important;
        min-height: 102px !important;
        padding: 12px !important;
        border-radius: 15px !important;
      }

      .home-status-section.layout-grid .home-status-card.compact-status{
        width: 100% !important;
        min-width: 0 !important;
        min-height: 100px !important;
        flex: none !important;
      }

      .home-status-section .home-status-card.house-persons-card,
.home-status-section .home-status-card.house-climate-card,
.home-status-section .home-status-card.house-power-card{
        flex: 0 0 238px !important;
        width: 238px !important;
        min-width: 238px !important;
        min-height: 124px !important;
        padding: 13px !important;
      }

      .home-status-section.layout-grid .home-status-card.house-persons-card,
.home-status-section.layout-grid .home-status-card.house-climate-card,
.home-status-section.layout-grid .home-status-card.house-power-card{
        grid-column: 1 / -1 !important;
        width: 100% !important;
        min-width: 0 !important;
        flex: none !important;
      }

      .home-status-section .home-status-card.compact-status .status-card-icon{
        width: 38px !important;
        height: 38px !important;
        margin-bottom: 10px !important;
        border-radius: 11px !important;
      }

      .home-status-section .home-status-card.compact-status .status-card-icon ha-icon{
        --mdc-icon-size: 20px !important;
      }

      .home-status-section .home-status-card.compact-status .status-card-title{
        font-size: 13px !important;
        line-height: 1.12 !important;
      }

      .mobile-area-card{
        flex-basis: 148px !important;
        min-height: 116px !important;
        height: 116px !important;
        padding: 12px !important;
        border-radius: 16px !important;
      }

      .mobile-area-card.has-picture{
        min-height: 116px !important;
        height: 116px !important;
      }

      .mobile-home-section.layout-grid .mobile-area-card{
        height: 118px !important;
        min-height: 118px !important;
      }

      .mobile-area-icon{
        width: 38px !important;
        height: 38px !important;
        border-radius: 12px !important;
      }

      .mobile-area-icon ha-icon{
        --mdc-icon-size: 21px !important;
      }

      .mobile-area-badges{
        display: grid !important;
        grid-template-columns: repeat(2, var(--mobile-area-badge-width, max-content)) !important;
        grid-auto-rows: 22px !important;
        justify-content: end !important;
        align-content: start !important;
        gap: 4px !important;
        max-width: 82px !important;
        overflow: visible !important;
      }

      .mobile-area-badge{
        box-sizing: border-box;
        width: var(--mobile-area-badge-width, auto) !important;
        min-width: 22px !important;
        height: 22px !important;
        padding: var(--mobile-area-badge-padding, 0 6px) !important;
        gap: 3px !important;
        font-size: 10px !important;
      }

      .mobile-area-badge ha-icon{
        --mdc-icon-size: 13px !important;
      }

      .mobile-area-name{
        font-size: 14px !important;
      }

      .mobile-area-meta{
        margin-top: 3px !important;
        font-size: 11px !important;
      }

      .home-favorites-section .favorite-card-wrapper{
        display: grid !important;
        grid-template-columns: 38px minmax(0, 1fr) auto !important;
        grid-template-rows: 1fr !important;
        align-items: start !important;
        gap: 9px !important;
        height: 104px !important;
        min-height: 104px !important;
        padding: 12px !important;
        overflow: visible !important;
      }

      .home-favorites-section .favorite-icon{
        grid-column: 1 !important;
        grid-row: 1 !important;
        width: 38px !important;
        height: 38px !important;
        align-self: start !important;
        margin: 0 !important;
      }

      .home-favorites-section .favorite-icon ha-icon{
        --mdc-icon-size: 21px !important;
      }

      .home-favorites-section .favorite-body{
        grid-column: 2 !important;
        grid-row: 1 !important;
        min-width: 0 !important;
        align-self: start !important;
        padding-top: 1px !important;
      }

      .home-favorites-section .favorite-end{
        grid-column: 3 !important;
        grid-row: 1 !important;
        align-self: start !important;
        justify-self: end !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .home-favorites-section .favorite-name{
        margin-top: 0 !important;
        font-size: 14px !important;
        line-height: 1.08 !important;
      }

      .home-favorites-section .favorite-area{
        margin-top: 5px !important;
        font-size: 10px !important;
      }

      .sidebar .room-area-button{
        display: grid !important;
        grid-template-columns: 54px minmax(0, 1fr) !important;
        align-items: center !important;
        gap: 12px !important;
        min-height: 78px !important;
        height: 78px !important;
        padding: 10px 12px !important;
        border-radius: 12px !important;
        overflow: visible !important;
      }

      .sidebar .room-area-button .area-media,
.sidebar .room-area-button .area-media-icon{
        position: relative !important;
        width: 54px !important;
        height: 54px !important;
        min-width: 54px !important;
        min-height: 54px !important;
        left: auto !important;
        top: auto !important;
        transform: none !important;
        align-self: center !important;
      }

      .sidebar .room-area-button .area-media-icon ha-icon{
        --mdc-icon-size: 26px !important;
      }

      .sidebar .room-area-button .area-content{
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) auto !important;
        grid-template-rows: 1fr !important;
        align-items: center !important;
        gap: 8px !important;
        min-width: 0 !important;
        height: 100% !important;
      }

      .sidebar .room-area-button .area-top-section{
        grid-column: 1 !important;
        grid-row: 1 !important;
        min-width: 0 !important;
        margin: 0 !important;
        align-self: center !important;
      }

      .sidebar .room-area-button .area-name{
        margin: 0 !important;
        font-size: 15px !important;
        line-height: 1.08 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      .sidebar .room-area-button .area-sensors{
        margin-top: 5px !important;
        font-size: 11.5px !important;
        line-height: 1.05 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }

      .sidebar .room-area-button .area-info-badges{
        position: relative !important;
        grid-column: 2 !important;
        grid-row: 1 !important;
        display: grid !important;
        grid-template-columns: repeat(2, max-content) !important;
        grid-auto-rows: 22px !important;
        justify-content: end !important;
        align-content: center !important;
        gap: 4px !important;
        width: auto !important;
        max-width: none !important;
        min-width: 0 !important;
        overflow: visible !important;
      }

      .sidebar .room-area-button .info-badge{
        min-width: 25px !important;
        height: 22px !important;
        padding: 0 7px !important;
        gap: 3px !important;
        font-size: 10.5px !important;
        box-sizing: border-box !important;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 13px !important;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 10.5px !important;
      }

      .sidebar .room-area-button .info-badge-overflow{
        min-width: 22px !important;
        width: 22px !important;
        height: 22px !important;
        font-size: 16px !important;
      }

      .sidebar .room-area-button .area-menu-chevron{
        display: none !important;
      }
    }


    @media (min-width: 769px) {
      /*
       * Final sizing pass:
       * - sidebar room content grows slightly while remaining inside the
       *   fixed media tile;
       * - room-view header and all of its contents grow by roughly 10%;
       * - the weather pill uses the same explicit treatment on Home and rooms.
       */
      .sidebar .room-area-button{
        grid-template-columns: 74px minmax(0, 1fr) !important;
        min-height: 88px !important;
        height: 88px !important;
        gap: 9px !important;
        padding: 7px !important;
      }

      .sidebar .room-area-button .area-media,
.sidebar .room-area-button .area-media-icon{
        width: 74px !important;
        height: 74px !important;
        min-width: 74px !important;
        min-height: 74px !important;
        max-width: 74px !important;
        max-height: 74px !important;
      }

      .sidebar .room-area-button .area-content{
        width: 100% !important;
        height: 74px !important;
        gap: 4px !important;
      }

      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        font-size: 15px !important;
        line-height: 1 !important;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        font-size: 11.5px !important;
        line-height: 1 !important;
      }

      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 27px !important;
        height: 20px !important;
        padding: 0 6px !important;
        gap: 3px !important;
        font-size: 10px !important;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 11px !important;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 10px !important;
      }

      /*
       * Room header: increase the current responsive geometry by about 10%.
       * Keep the same proportions between media,
copy{
        grid-template-columns: clamp(165px, 22cqw, 242px) minmax(0, 1fr) auto auto !important;
        min-height: clamp(106px, 12.1cqw, 128px) !important;
      }

      /*
       * Explicitly scope the weather treatment to the actual header/time
       * container as well. This prevents the Home weather pill from falling
       * back to the generic gray .weather-compact styling.
       */
      .global-header .header-time-weather .weather-compact{
        min-height: 38px !important;
        height: 38px !important;
        padding: 0 12px !important;
        gap: 7px !important;
        border-radius: 999px !important;
        box-sizing: border-box !important;
        background: color-mix(in srgb, var(--primary-color) 12%, var(--card-background-color)) !important;
        color: var(--primary-color) !important;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 16%, transparent) !important;
      }

      .global-header .header-time-weather .weather-compact .weather-icon-compact ha-icon{
        --mdc-icon-size: 18px !important;
        color: var(--primary-color) !important;
      }

      .global-header .header-time-weather .weather-compact .weather-temp-compact{
        font-size: 13px !important;
        line-height: 1 !important;
        color: var(--primary-text-color) !important;
      }
    }

    
    /* 2026-10-03: restore stable desktop room geometry and final responsive overrides. */
    @media (min-width: 769px) {

      /* Sidebar room content should nearly fill the height of the media tile. */
      .sidebar .room-area-button .area-name,
.sidebar .room-area-button.has-picture .area-name{
        font-size: 16px !important;
        line-height: 1.08 !important;
      }

      .sidebar .room-area-button .area-sensors,
.sidebar .room-area-button.has-picture .area-sensors{
        font-size: 13px !important;
        line-height: 1.12 !important;
        margin-top: 2px !important;
      }

      .sidebar .room-area-button .info-badge,
.sidebar .room-area-button.has-picture .info-badge{
        min-width: 29px !important;
        height: 22px !important;
        padding: 0 6px !important;
        gap: 3px !important;
        font-size: 11px !important;
      }

      .sidebar .room-area-button .info-badge ha-icon{
        --mdc-icon-size: 12px !important;
      }

      .sidebar .room-area-button .badge-count{
        font-size: 11px !important;
      }

    }


    /*
     * FINAL compact desktop room-header geometry.
     * One 132px band: image, camera and complete metric stack align exactly.
     */
    @media (min-width: 769px) {

      .dd-page-card,
.dd-page-card > *,
.dd-page-card dwains-dashboard-next-card-host{
        width: 100% !important;
        max-width: none !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
    }

    ${Ye}

    ${Be}

    /* Room header: exact v1.11.0 header styling with only the two requested structural deviations. */
    .dd-page-header-with-media{
      display: grid;
      grid-template-columns: 220px minmax(0, 1fr);
      gap: 18px;
      align-items: stretch;
      min-width: 0;
    }

    .dd-page-header-media-tile{
      position: relative;
      width: 220px;
      height: auto;
      min-height: 0;
      max-height: none;
      align-self: stretch;
      overflow: hidden;
      border-radius: 14px;
      background: color-mix(in srgb, var(--ph-accent) 10%, var(--ph-surface));
    }

    .dd-page-header-room-picture{
      position: absolute;
      inset: 0;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }

    .dd-page-header-room-icon{
      width: 100%;
      height: 100%;
      min-height: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--ph-accent) 14%, var(--ph-surface));
      color: var(--ph-accent);
    }

    .dd-page-header-room-icon ha-icon{
      --mdc-icon-size: 52px;
    }

    .dd-page-header-main{
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 14px;
      padding-top: 0;
      box-sizing: border-box;
    }

    .dd-page-header-title-row{
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .dd-page-header-title-row .dd-page-header-title{
      min-width: 0;
    }

    .dd-page-header-home{
      width: 36px;
      height: 36px;
    }

    .dd-page-header-home ha-icon{
      --mdc-icon-size: 21px;
    }


    /* 2026-10-06 room-view alignment follow-up.
       The room content scrolls with a reserved scrollbar gutter, while the global
       header does not. Reserve the same space on the header's right side so its
       status rail and Favorites end on the same visual edge as the room cards. */
    @media (min-width: 769px) {
      .global-header.room-context{
        padding-left: 16px !important;
        padding-right: 32px !important;
      }

      .global-header.room-context .header-content,
      .global-header.room-context .room-favorites-block{
        width: 100% !important;
        max-width: 1400px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        box-sizing: border-box !important;
      }

      .global-header.room-context .header-status-section{
        overflow: hidden !important;
      }

      .global-header.room-context .header-status-scroll{
        padding-inline: 0 !important;
        scroll-padding-inline: 0 !important;
      }

      .global-header.room-context .header-status-section.can-scroll-left .header-status-scroll{
        padding-left: 20px !important;
        scroll-padding-left: 20px !important;
      }

      .global-header.room-context .header-status-section.can-scroll-right .header-status-scroll{
        padding-right: 20px !important;
        scroll-padding-right: 20px !important;
      }

      .global-header.room-context .header-status-scroll-button-left{
        left: 2px !important;
      }

      .global-header.room-context .header-status-scroll-button-right{
        right: 2px !important;
      }

      .global-header.room-context .status-card-compact{
        width: max-content !important;
        min-width: 140px !important;
        max-width: none !important;
        grid-template-columns: 32px max-content !important;
      }

      .global-header.room-context .status-card-compact .status-card-title-compact{
        overflow: visible !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
      }

      .global-header.room-context .header-content{
        gap: 8px !important;
      }

      .global-header.room-context .header-time-weather{
        gap: 8px !important;
        transform: none !important;
      }

      .global-header.room-context .header-time-section{
        width: auto !important;
        min-width: 0 !important;
      }

      .global-header.room-context .room-favorites-block,
      .global-header.room-context .room-favorites-content,
      .global-header.room-context .room-favorites-content .favorites-section,
      .global-header.room-context .room-favorites-content .favorites-grid{
        width: 100% !important;
        max-width: none !important;
        box-sizing: border-box !important;
      }

      .global-header.room-context .room-global-now-playing{
        width: 100% !important;
        max-width: 1400px !important;
        margin: 10px auto 0 !important;
        box-sizing: border-box !important;
      }

      .global-header.room-context .room-global-now-playing > dwains-dashboard-next-now-playing{
        width: 100% !important;
        margin: 0 !important;
      }
    }

    /* 2026-10-05 room/home consistency pass. */
    .favorite-name {
      display: block !important;
      min-width: 0;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
      -webkit-line-clamp: unset !important;
      -webkit-box-orient: initial !important;
    }

    .dd-page-header-with-media {
      align-items: stretch;
    }

    .dd-page-header-main {
      justify-content: flex-start;
      align-self: stretch;
    }

    .dd-page-header-main .dd-page-header-top {
      align-items: flex-start;
    }

    .dd-page-header-title-row {
      display: flex;
      align-items: center;
      min-height: 26px;
      line-height: 1;
    }

    .dd-page-header-title-row .dd-page-header-title {
      margin: 0;
      align-self: center;
    }

    .dd-page-header-title-row .dd-page-header-home {
      width: 26px;
      height: 26px;
      min-width: 26px;
      padding: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--primary-color);
    }

    .dd-page-header-title-row .dd-page-header-home:hover {
      color: var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }

    .dd-page-header-title-row .dd-page-header-home ha-icon {
      --mdc-icon-size: 21px;
      width: 21px;
      height: 21px;
    }

    .dd-page-header-title-chevron {
      --mdc-icon-size: 16px;
      width: 16px;
      height: 16px;
      flex: 0 0 16px;
      color: var(--ph-muted);
      opacity: 0.72;
    }

    .dd-page-header-button > ha-icon,
    .dd-page-header-home > ha-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      margin: 0;
      transform: none;
    }

    .dd-page-header-actions .dd-page-header-button {
      display: inline-grid;
      place-items: center;
    }

    .home-status-secondary-grid.is-only-row {
      margin-top: 0;
      grid-template-columns: none;
      grid-auto-flow: column;
      grid-auto-columns: minmax(130px, 1fr);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .home-status-secondary-grid.is-only-row::-webkit-scrollbar {
      display: none;
    }

    .home-todos-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 420px));
      justify-content: start;
    }

    .home-custom-cards-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      justify-content: start;
    }

    .home-custom-card.is-wide {
      grid-column: span 2;
    }

    .dd-custom-grid > .dd-custom-card-wrap {
      --dd-card-default-column: span 3;
    }

    .dd-custom-grid > .dd-custom-card-wrap.dd-grid-wide {
      --dd-card-default-column: span 6;
    }

    .home-todo-card,
    .home-custom-card,
    .area-view .mobile-todo-list-card,
    .area-view .mobile-entity-replacement-card,
    .dd-custom-card-wrap {
      font-family: var(--ha-font-family-body, inherit);
      font-size: 13px;
      line-height: 1.3;
      --ha-card-header-font-size: 15px;
      --ha-font-size-l: 15px;
      --ha-font-size-m: 13px;
      --ha-font-size-s: 11px;
    }

    @media (min-width: 769px) {
      .area-view .mobile-todo-list-card {
        grid-column: span 2 !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        flex: none !important;
      }

      .room-favorites-content .favorites-grid {
        grid-template-columns: repeat(6, minmax(0, 1fr)) !important;
      }
    }

    @media (max-width: 768px) {
      .dd-room-compact .dd-page-header-home {
        width: 38px;
        height: 38px;
        min-width: 38px;
        border-radius: 999px;
        background: var(--ph-control);
        color: var(--ph-text);
      }

      .dd-room-compact .dd-page-header-home ha-icon {
        --mdc-icon-size: 21px;
        width: 21px;
        height: 21px;
      }

      .home-custom-cards-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .home-custom-card.is-wide {
        grid-column: auto;
      }

      .area-view .mobile-todo-list-card {
        grid-column: 1 / -1 !important;
      }
    }

    /* Sidebar room content: keep the established tile/media geometry
       and use a compact, vertically centered copy stack. */
    @media (min-width: 769px) {
      .sidebar .room-area-button .area-content {
        height: 100% !important;
        min-height: 0 !important;
        align-self: stretch !important;
        justify-content: center !important;
        gap: 0 !important;
      }

      .sidebar .room-area-button .area-top-section {
        margin: 0 !important;
        gap: 0 !important;
      }

      .sidebar .room-area-button .area-sensors {
        margin-top: 2px !important;
      }

      .sidebar .room-area-button .area-info-badges {
        margin-top: 6px !important;
        gap: 5px !important;
      }

      .sidebar .room-area-button .info-badge {
        min-width: 31px !important;
        height: 26px !important;
        padding: 0 7px !important;
        font-size: 12px !important;
      }

      .sidebar .room-area-button .info-badge ha-icon {
        --mdc-icon-size: 15px !important;
      }

      .sidebar .room-area-button .badge-count {
        font-size: 12px !important;
      }
    }

    /* Final mobile room sizing: make the entity list about 10% larger without
       changing the desktop room grid. */
    @media (max-width: 768px) {
      .area-view .mobile-domain-title-label,
      .mobile-domain-title-label {
        font-size: 20px;
      }

      .area-view .mobile-domain-count,
      .mobile-domain-count {
        font-size: 13px;
      }

      .mobile-domain-header {
        margin-bottom: 11px;
      }

      .mobile-domain-title {
        gap: 9px;
      }

      .mobile-layout-toggle {
        width: 33px;
        height: 33px;
      }

      .mobile-layout-toggle ha-icon {
        --mdc-icon-size: 19px;
      }

      .mobile-domain-master {
        min-width: 64px;
        height: 33px;
        padding: 0 6px 0 8px;
        gap: 7px;
      }

      .mobile-domain-master ha-icon {
        --mdc-icon-size: 18px;
      }

      .mobile-domain-master-track {
        width: 29px;
        height: 18px;
      }

      .mobile-domain-master-track::after {
        top: 3px;
        left: 3px;
        width: 12px;
        height: 12px;
      }

      .mobile-domain-master.active .mobile-domain-master-track::after {
        transform: translateX(11px);
      }

      .mobile-domain-master-actions {
        height: 33px;
      }

      .mobile-domain-master-action {
        width: 37px;
        height: 33px;
      }

      .mobile-domain-master-action ha-icon {
        --mdc-icon-size: 19px;
      }

      .mobile-entity-card {
        flex-basis: 180px;
        min-height: 141px;
        padding: 15px;
      }

      .mobile-entities-section.layout-grid .mobile-entity-tile-host {
        min-height: 0;
        padding: 0;
      }

      .mobile-entity-status {
        font-size: 12px;
      }

      .mobile-entity-select select {
        height: 37px;
        font-size: 13px;
        line-height: 37px;
      }

      .mobile-entity-select ha-icon {
        --mdc-icon-size: 20px;
      }

      .home-favorites-section.layout-grid {
        width: auto;
        max-width: none;
      }
    }

    /* Final mobile house-power popup shell: same visual system as Home Information dialogs. */
    @media (max-width: 768px) {

      .house-power-dialog-energy-link {
        grid-column: 2 !important;
        grid-row: 2 !important;
        justify-self: start !important;
        width: auto !important;
        min-height: 30px !important;
        margin: 0 !important;
        padding: 0 10px !important;
        font-size: 11px !important;
      }

      .house-power-dialog-energy-link span {
        display: inline !important;
      }

      .house-power-dialog-overview,
      .house-power-dialog-areas {
        margin-left: 12px !important;
        margin-right: 12px !important;
      }

      .house-power-dialog-overview {
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 10px !important;
        margin-bottom: 10px !important;
      }

      .house-power-dialog-overview-card,
      .house-power-dialog-area {
        padding: 11px !important;
        border-radius: 12px !important;
      }

      .house-power-statistics-card {
        min-height: 112px !important;
      }
    }

    @media (max-width: 768px) {
      /* Compact energy presentation: same visual density as the other Home Information popups. */
      .house-power-dialog-overview-card {
        padding: 10px !important;
        border-radius: 12px !important;
        background: var(--card-background-color) !important;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent) !important;
        box-shadow: 0 5px 14px rgba(15, 23, 42, 0.035) !important;
      }

      .house-power-dialog-overview-head {
        grid-template-columns: 36px minmax(0, 1fr) auto !important;
        gap: 9px !important;
      }

      .house-power-dialog-overview-icon {
        width: 36px !important;
        height: 36px !important;
        border-radius: 9px !important;
      }

      .house-power-dialog-overview-head strong {
        font-size: 13px !important;
      }

      .house-power-dialog-overview-head small {
        margin-top: 2px !important;
        font-size: 10px !important;
      }

      .house-power-dialog-overview-head b {
        font-size: 18px !important;
      }

      .house-power-statistics-card {
        min-height: 112px !important;
        height: auto !important;
        margin-top: 8px !important;
        overflow: visible !important;
      }

      .house-power-dialog-area {
        padding: 9px 10px !important;
        border-radius: 12px !important;
        background: var(--card-background-color) !important;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent) !important;
        box-shadow: 0 5px 14px rgba(15, 23, 42, 0.035) !important;
      }

      .house-power-dialog-area-head {
        grid-template-columns: 32px minmax(0, 1fr) auto !important;
        gap: 8px !important;
      }

      .house-power-dialog-area-icon {
        width: 32px !important;
        height: 32px !important;
      }

      .house-power-dialog-entities {
        margin-left: 0 !important;
        margin-top: 7px !important;
      }

      .house-power-dialog-entity.detailed {
        min-height: 44px !important;
        padding: 5px 7px !important;
      }
    }


    @media (max-width: 768px) {

      .house-power-dialog-energy-link {
        grid-column: 2 !important;
        grid-row: 2 !important;
        justify-self: start !important;
        width: auto !important;
        min-height: 30px !important;
        margin: 0 !important;
        padding: 0 10px !important;
        border-radius: 999px !important;
        font-size: 11px !important;
      }

      .house-power-dialog-content {
        padding: 12px 12px calc(16px + env(safe-area-inset-bottom, 0px)) !important;
        box-sizing: border-box !important;
        background: var(--primary-background-color) !important;
      }

      .house-power-dialog-overview,
      .house-power-dialog-areas {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    }

    .notifications-actions {
      gap: 7px !important;
    }

    .notifications-icon-button {
      width: 38px !important;
      height: 38px !important;
      background: transparent !important;
      color: var(--primary-text-color) !important;
      transition: background-color .16s ease, color .16s ease, transform .16s ease;
    }

    .notifications-icon-button:hover {
      background: color-mix(in srgb, var(--primary-text-color) 7%, transparent) !important;
    }

    .notifications-icon-button.destructive {
      color: var(--error-color, #db4437) !important;
    }

    .notifications-icon-button.refresh {
      color: var(--primary-color) !important;
    }

    .notifications-icon-button.close {
      color: var(--primary-text-color) !important;
    }

    .notifications-icon-button ha-icon {
      --mdc-icon-size: 20px !important;
    }

    .notifications-list {
      padding: 12px !important;
      background: var(--primary-background-color) !important;
    }

    .notification-row {
      padding: 11px !important;
      border-radius: 10px !important;
      background: var(--card-background-color) !important;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 7%, transparent) !important;
      box-shadow: 0 5px 14px rgba(15, 23, 42, 0.035) !important;
    }

    .notification-dismiss {
      width: 34px !important;
      height: 34px !important;
      color: var(--error-color, #db4437) !important;
      background: transparent !important;
    }

    .notification-dismiss:hover {
      background: color-mix(in srgb, var(--error-color, #db4437) 9%, transparent) !important;
    }

    .notification-dismiss ha-icon {
      --mdc-icon-size: 18px !important;
    }

    @media (max-width: 768px) {

      .notifications-list {
        padding: 12px 12px calc(16px + env(safe-area-inset-bottom, 0px)) !important;
      }

      .notifications-actions {
        gap: 3px !important;
      }

      .notifications-icon-button {
        width: 36px !important;
        height: 36px !important;
      }

      .notification-row {
        grid-template-columns: 38px minmax(0, 1fr) 34px !important;
        gap: 9px !important;
      }
    }





  `,Be,Ye],e([t({attribute:!1})],st.prototype,"hass",void 0),e([t({attribute:!1})],st.prototype,"config",void 0),e([a()],st.prototype,"_selectedArea",void 0),e([a()],st.prototype,"_selectedView",void 0),e([a()],st.prototype,"_isMobile",void 0),e([a()],st.prototype,"_headerExpanded",void 0),e([a()],st.prototype,"_headerCompact",void 0),e([a()],st.prototype,"_headerStatusCanScrollLeft",void 0),e([a()],st.prototype,"_headerStatusCanScrollRight",void 0),e([a()],st.prototype,"_currentTime",void 0),e([a()],st.prototype,"_currentDate",void 0),e([a()],st.prototype,"_mobileNavOpen",void 0),e([a()],st.prototype,"_editMode",void 0),e([a()],st.prototype,"_notificationsOpen",void 0),e([a()],st.prototype,"_persistentNotifications",void 0),e([a()],st.prototype,"_notificationsLoading",void 0),e([a()],st.prototype,"_notificationsError",void 0),e([a()],st.prototype,"_areaHeaderStuck",void 0),e([a()],st.prototype,"_areaHeaderRevealed",void 0),e([a()],st.prototype,"_areaQuickPage",void 0),e([a()],st.prototype,"_mobileEntityLayout",void 0),e([a()],st.prototype,"_mobileHomeAreasLayout",void 0),e([a()],st.prototype,"_mobileHomeDevicesLayout",void 0),e([a()],st.prototype,"_mobileHomeFavoritesLayout",void 0),e([a()],st.prototype,"_mobileHomeCamerasLayout",void 0),e([a()],st.prototype,"_areaSidebarWidth",void 0),e([a()],st.prototype,"_areaSidebarCollapsed",void 0),e([a()],st.prototype,"_isResizingSidebar",void 0),e([a()],st.prototype,"_repairsIssueCount",void 0),e([a()],st.prototype,"_discoveredDeviceCount",void 0),e([a()],st.prototype,"_suggestedFavoriteEntities",void 0),e([a()],st.prototype,"_customCardDrag",void 0),e([a()],st.prototype,"_customCardDragOver",void 0),e([a()],st.prototype,"_generatedCardDrag",void 0),e([a()],st.prototype,"_generatedCardDragOver",void 0),e([a()],st.prototype,"_generatedGroupDrag",void 0),e([a()],st.prototype,"_generatedGroupDragOver",void 0),e([a()],st.prototype,"_optimisticEntityStates",void 0),e([a()],st.prototype,"_renderAllMobileHomeAreas",void 0),e([a()],st.prototype,"_renderAllMobileAreaEntities",void 0),e([a()],st.prototype,"_collapsedAreaGroups",void 0),e([a()],st.prototype,"_settingsDirty",void 0),e([a()],st.prototype,"_deviceSettingsDirty",void 0),e([a()],st.prototype,"_settingsSavePending",void 0),e([a()],st.prototype,"_settingsSaveError",void 0),e([a()],st.prototype,"_settingsPageKey",void 0),e([a()],st.prototype,"_settingsPageTitle",void 0),e([a()],st.prototype,"_settingsPageParentTitle",void 0),e([a()],st.prototype,"_settingsPageDescription",void 0),e([a()],st.prototype,"_confirmationDialog",void 0),e([a()],st.prototype,"_housePowerDialogOpen",void 0),st=e([o("dwains-dashboard-next-layout-card")],st);export{st as DwainsLayoutCard};
