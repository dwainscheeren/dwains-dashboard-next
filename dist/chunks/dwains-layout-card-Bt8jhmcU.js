import{_ as e,n as t,r as i,t as a}from"./state-DfsJqMnn.js";import{A as o,E as r,a as s,i as n,b as c}from"./lit-element-Bpv9xYb0.js";import{e as d,b as l,p as h}from"./page-header-styles-CZMWcDqq.js";import{g as p,a as m,i as u,b as g,e as b,c as _,d as f,f as x,h as v,j as y,k as w,l as k,r as $,m as S,n as C,o as E,p as A,s as M,q as z,t as D,u as T,v as I,w as H}from"./icons-CDJcmrK5.js";import{e as P,i as L,t as N}from"./blueprints-Dh4Un1Bn.js";import{f as F,a as O,n as R,e as j,m as U,b as W,s as G}from"./dwains-bottom-nav-CPWTXnuB.js";import{g as V,d as B,a as K,b as q,r as Y,T as X,c as Q,e as J}from"./index-DVHykqNs.js";import{g as Z,m as ee,a as te,b as ie,c as ae,d as oe,e as re,f as se,h as ne,i as ce,j as de,k as le,l as he,n as pe,o as me,p as ue,W as ge,q as be}from"./wall-tablet-sVhHpZ_H.js";import{u as _e}from"./dashboard-config-store-C7OHDEFk.js";import{i as fe,g as xe,a as ve,c as ye,b as we,d as ke,n as $e,e as Se,f as Ce,h as Ee,H as Ae,s as Me,m as ze,j as De,k as Te,p as Ie,l as He,r as Pe,o as Le,q as Ne,t as Fe}from"./show-card-editor-dialog-Fg_4KFTf.js";import{f as Oe}from"./fire-event-DQiSssdY.js";import"./dd-card-host-zbmwRU5c.js";import{c as Re,s as je}from"./confirm-dialog-CePb0ykT.js";const Ue=e=>e??o,We="important",Ge=" !"+We,Ve=P(class extends L{constructor(e){if(super(e),e.type!==N.ATTRIBUTE||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const a=e[i];return null==a?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${a};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const a=t[e];if(null!=a){this.ft.add(e);const t="string"==typeof a&&a.endsWith(Ge);e.includes("-")||t?i.setProperty(e,t?a.slice(0,-11):a,t?We:""):i[e]=a}}return r}});var Be=Number.isNaN||function(e){return"number"==typeof e&&e!=e};function Ke(e,t){return e===t||!(!Be(e)||!Be(t))}function qe(e,t){if(e.length!==t.length)return!1;for(var i=0;i<e.length;i++)if(!Ke(e[i],t[i]))return!1;return!0}function Ye(e,t){void 0===t&&(t=qe);var i=null;function a(){for(var a=[],o=0;o<arguments.length;o++)a[o]=arguments[o];if(i&&i.lastThis===this&&t(a,i.lastArgs))return i.lastResult;var r=e.apply(this,a);return i={lastResult:r,lastArgs:a,lastThis:this},r}return a.clear=function(){i=null},a}const Xe=new Map,Qe=(e,t,i,a)=>!!a?.areas_options?.[i]?.groups_options?.[t]?.hidden&&a.areas_options[i].groups_options[t].hidden.includes(e),Je=(e,t,i,a)=>{const o=((e,t,i,a)=>{const o=Xe.get(e.area_id);if(!o)return;const r=t.areas?.[e.area_id];if(o.area!==e||o.areaEntities!==i||o.areaRegistry!==r||o.formatEntityState!==t.formatEntityState||o.registry!==V(t)||o.areasOptions!==a?.areas_options||o.temperatureState!==(r?.temperature_entity_id?t.states[r.temperature_entity_id]:void 0)||o.humidityState!==(r?.humidity_entity_id?t.states[r.humidity_entity_id]:void 0))return;if(o.checkedStates===t.states)return o.data;const s=o.entityStates;if(s.length===i.length){for(let e=0;e<i.length;e++)if(s[e]!==t.states[i[e].entity_id])return;return o.checkedStates=t.states,o.data}})(e,t,i,a);if(o)return o;let r,s,n,c;const d=t.areas[e.area_id],l=d?.temperature_entity_id,h=d?.humidity_entity_id;if(l){const e=t.states[l];e&&"unavailable"!==e.state&&"unknown"!==e.state&&(r=F(t,e))}if(h){const e=t.states[h];e&&"unavailable"!==e.state&&"unknown"!==e.state&&(s=F(t,e))}let p=0,m=!1;i.forEach(i=>{const o=t.states[i.entity_id];if(!o)return;const r=Ze(i.entity_id);if(!Qe(i.entity_id,r,e.area_id,a)&&i.entity_id.startsWith("sensor.")&&"W"===o.attributes.unit_of_measurement&&"unavailable"!==o.state&&"unknown"!==o.state){const e=parseFloat(o.state);isNaN(e)||(p+=e,m=!0)}}),m&&(n=p>=1e3?O((p/1e3).toFixed(1),"kW"):O(Math.round(p),"W"));let u=0,g=!1;i.forEach(i=>{const o=t.states[i.entity_id];if(!o)return;const r=Ze(i.entity_id);if(!Qe(i.entity_id,r,e.area_id,a)&&i.entity_id.startsWith("sensor.")&&"kWh"===o.attributes.unit_of_measurement&&"unavailable"!==o.state&&"unknown"!==o.state){const e=parseFloat(o.state);isNaN(e)||(u+=e,g=!0)}}),g&&(c=u>=1e3?O((u/1e3).toFixed(1),"MWh"):O(u.toFixed(1),"kWh"));const b=[],_={light:{total:0,on:0},switch:{total:0,on:0},fan:{total:0,on:0},cover:{total:0,on:0},climate:{total:0,on:0},media_player:{total:0,on:0},lock:{total:0,on:0},motion:{total:0,on:0}};i.forEach(i=>{const o=t.states[i.entity_id];if(!o)return;const r=Ze(i.entity_id);if(!Qe(i.entity_id,r,e.area_id,a)){if(r in _){const e=_[r];if(!e)return;e.total++;const t="off"!==o.state&&"unavailable"!==o.state&&"unknown"!==o.state&&"closed"!==o.state&&"locked"!==o.state;"climate"===r?o.attributes.hvac_action&&"idle"!==o.attributes.hvac_action&&"off"!==o.attributes.hvac_action?e.on++:o.attributes.hvac_action||"off"===o.state||e.on++:t&&e.on++}if(i.entity_id.startsWith("binary_sensor.")&&"motion"===o.attributes.device_class){const e=_.motion;e&&(e.total++,"on"===o.state&&e.on++)}if(i.entity_id.startsWith("binary_sensor.")&&"on"===o.state&&o.attributes.device_class){["door","window","moisture","smoke"].includes(o.attributes.device_class)&&b.push({entity_id:i.entity_id,deviceClass:o.attributes.device_class})}}});const f={area_id:e.area_id,name:e.name,icon:e.icon||void 0,picture:e.picture||void 0,temperature:r,humidity:s,wattage:n,totalEnergy:c,alerts:b,domains:_};return Xe.set(e.area_id,{area:e,areaEntities:i,entityStates:i.map(e=>t.states[e.entity_id]),areaRegistry:d,temperatureState:l?t.states[l]:void 0,humidityState:h?t.states[h]:void 0,formatEntityState:t.formatEntityState,registry:V(t),areasOptions:a?.areas_options,checkedStates:t.states,data:f}),f},Ze=e=>{const[t]=e.split(".");return t||"unknown"},et=[];function tt(e,t){if(e.length!==t.length)return!1;for(let i=0;i<e.length;i++)if(e[i]!==t[i])return!1;return!0}class it{constructor(){this._resolved=new Map,this._filtered=new Map}clear(){this._index=void 0,this._attributeMembers=void 0,this._resolved.clear(),this._filtered.clear()}areaEntities(e,t,i){const a=this._getIndex(t,i),o=this._resolved.get(e);if(o&&o.states===t.states&&o.index===a)return o.entities;const r=[];for(const i of a.byArea.get(e)||et)t.states[i.entity_id]&&r.push(i);const s=this._getAttributeMembers(t,a).get(e);s&&r.push(...s);const n=o&&o.index===a&&tt(o.entities,r)?o.entities:r;return this._resolved.set(e,{states:t.states,index:a,entities:n}),n}filteredAreaEntities(e,t,i){const a=this.areaEntities(e,t,i),o=this._filtered.get(e);if(o&&o.source===a&&o.config===i&&o.registry===V(t)){if(o.states===t.states)return o.entities;if(a.every((e,i)=>t.states[e.entity_id]===o.sourceStates[i]))return o.states=t.states,o.entities}const r=p(i,e),s=m(i),n=!1!==i?.settings?.hide_unavailable_entities,c=[];for(const e of a){const i=e.entity_id,a=t.states[i];if(a&&u(V(t)[i])&&!(r.has(i)||n&&g(a))){if(s.size){const i=b(t,e);if(i&&s.has(i))continue}c.push(e)}}const d=o&&tt(o.entities,c)?o.entities:c;return this._filtered.set(e,{states:t.states,source:a,sourceStates:a.map(e=>t.states[e.entity_id]),config:i,registry:V(t),entities:d}),d}_getIndex(e,t){const i=t?.entities,a=t?.devices,o=V(e),r=this._index;if(r&&r.entities===i&&r.devices===a&&r.registry===o)return r;const s=new Map,n=new Map,c=(e,t)=>{let i=s.get(e),a=n.get(e);i&&a||(i=[],a=new Set,s.set(e,i),n.set(e,a)),i.push(t),a.add(t.entity_id)};for(const e of i||[]){const i=_(t,e);i&&(u(o?.[e.entity_id])&&c(i,e))}const d={entities:i,devices:a,registry:o,byArea:s,memberIds:n,attributeEntities:new Map};return this._index=d,this._attributeMembers=void 0,this._resolved.clear(),d}_getAttributeMembers(e,t){const i=this._attributeMembers;if(i&&i.states===e.states&&i.index===t)return i.byArea;const a=new Map;for(const i of Z(e.states).withAreaAttribute){const o=i.attributes.area_id,r=i.entity_id;if(t.memberIds.get(o)?.has(r))continue;if(!u(V(e)[r]))continue;const s=`${o}\0${r}`;let n=t.attributeEntities.get(s);n||(n={entity_id:r,area_id:o,hidden:!1},t.attributeEntities.set(s,n));let c=a.get(o);c||(c=[],a.set(o,c)),c.push(n)}return this._attributeMembers={states:e.states,index:t,byArea:a},a}}function at(e){try{const t=e();t&&"function"==typeof t.catch&&t.catch(()=>{})}catch{}}class ot{constructor(){this._generation=0}get active(){return Boolean(this._unsubscribe||this._pending)}start(e){if(this._pending)return this._pending;if(this._unsubscribe)return Promise.resolve();const t=++this._generation,i=Promise.resolve().then(e).then(e=>{this._pending===i&&(this._pending=void 0),"function"==typeof e&&(t===this._generation?this._unsubscribe=e:at(e))},e=>{throw this._pending===i&&(this._pending=void 0),e});return this._pending=i,i}stop(){this._generation++,this._pending=void 0;const e=this._unsubscribe;this._unsubscribe=void 0,e&&at(e)}}const rt=new WeakMap;function st(e,t,i){if(e===t)return!1;if(!e||!t)return!0;let a=0,o=0;for(const r in t){a++;const s=t[r],n=e[r];if(void 0!==n&&o++,n!==s&&i(r,n,s))return!0}if(rt.set(t,a),o===function(e){let t=rt.get(e);if(void 0===t){t=0;for(const i in e)t++;rt.set(e,t)}return t}(e))return!1;for(const a in e)if(void 0===t[a]&&i(a,e[a],void 0))return!0;return!1}function nt(e,t,i){return e.startsWith("update.")&&t?.state!==i?.state}const ct=new Set(["light","switch","fan","cover","lock","media_player","vacuum","alarm_control_panel"]),dt=new Set(["person","camera","weather","todo"]),lt=new Set(["door","gas","moisture","motion","occupancy","opening","presence","safety","smoke","tamper","vibration","window"]),ht=new Set(["w","kw","mw"]);function pt(e){return lt.has(e.attributes?.device_class)}function mt(e){const t=e.attributes;return!!t&&(ht.has(String(t.unit_of_measurement||"").trim().toLowerCase())||"power"===String(t.device_class||"").toLowerCase())}const ut=()=>import("./dwains-domain-entities-dialog-C18vugc5.js");let gt=!1;const bt=(e,t)=>{if(gt)return void console.warn("Domain entities dialog is already open");gt=!0;const i=t=>{"dwains-dashboard-next-domain-entities-dialog"===t.detail?.dialog&&(gt=!1,e.removeEventListener("dialog-closed",i))};e.addEventListener("dialog-closed",i),Oe(e,"show-dialog",{dialogTag:"dwains-dashboard-next-domain-entities-dialog",dialogImport:ut,dialogParams:t}),setTimeout(()=>{gt&&(gt=!1,e.removeEventListener("dialog-closed",i))},2e3)},_t=s`:host{display:block;height:100%;max-height:100%;min-height:0;color:var(--primary-text-color);overflow:hidden;-webkit-tap-highlight-color:transparent}button,.area-button,.home-status-card,.status-card-compact,.mobile-area-card,.house-person-mini,.person-card,.favorite-card-wrapper,.favorite-quick-action,.mobile-domain-master,.mobile-layout-toggle,.mobile-entity-card,.mobile-entity-action,.mobile-cover-action,.mobile-entity-toggle,.dd-add-card,.dd-custom-card-wrap.editing{user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}.status-card-compact:focus-visible,.home-status-card:focus-visible,.weather-compact:focus-visible,.welcome-weather:focus-visible,.welcome-alarm:focus-visible,.area-light-toggle:focus-visible,.mobile-area-card:focus-visible,.mobile-entity-card:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.dd-static-icon{width:20px;height:20px;display:block;flex:0 0 auto;fill:currentColor;pointer-events:none}.mobile-area-card,.home-camera-card,.home-summary-card,.home-status-card,.favorite-card-wrapper{contain:layout style paint}.mobile-home-section,.home-camera-section,.home-status-section,.home-todos-section,.home-custom-cards-section,.home-favorites-section,.home-summaries-section,.mobile-domain-group{content-visibility:auto;contain-intrinsic-size:1px 360px}.mobile-entities-section.layout-grid .mobile-entity-card{content-visibility:auto;contain-intrinsic-size:164px 150px}:host{display:block;height:calc(100dvh - var(--header-height,56px));min-height:0;overflow:hidden}.layout-container{--area-sidebar-width:250px;display:flex;height:100%;max-height:100%;min-height:0;position:relative;overflow:hidden}.layout-container.sidebar-resizing,.layout-container.sidebar-resizing *{cursor:col-resize !important;user-select:none !important;-webkit-user-select:none !important}.layout-container.sidebar-collapsed .sidebar{width:0;flex-basis:0;border-right:0;opacity:0;pointer-events:none;transform:translateX(-16px)}.layout-container.sidebar-collapsed .main-content{min-width:0}.sidebar{width:var(--area-sidebar-width);flex:0 0 var(--area-sidebar-width);background:var(--card-background-color);border-right:1px solid var(--divider-color);display:flex;flex-direction:column;transition:transform 0.3s ease,width 0.16s ease,flex-basis 0.16s ease;z-index:1;min-height:0;height:100%;max-height:100%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch}.layout-container.sidebar-resizing .sidebar{transition:none}.sidebar-resize-handle{flex:0 0 10px;width:10px;align-self:stretch;margin-left:-5px;margin-right:-5px;position:relative;z-index:4;border:0;padding:0;background:transparent;cursor:col-resize;touch-action:none}.sidebar-resize-handle::before{content:'';position:absolute;top:14px;bottom:14px;left:4px;width:2px;border-radius:999px;background:transparent;transition:background 0.16s ease,box-shadow 0.16s ease}.sidebar-resize-handle:hover::before,.sidebar-resize-handle:focus-visible::before,.layout-container.sidebar-resizing .sidebar-resize-handle::before{background:var(--primary-color);box-shadow:0 0 0 4px color-mix(in srgb,var(--primary-color) 12%,transparent)}.sidebar-resize-handle:focus-visible{outline:none}.sidebar-collapse-toggle{position:absolute;top:50%;left:calc(var(--area-sidebar-width) - 17px);z-index:6;width:34px;height:54px;padding:0;display:inline-flex;align-items:center;justify-content:center;border:1px solid color-mix(in srgb,var(--divider-color) 80%,transparent);border-radius:999px;background:color-mix(in srgb,var(--card-background-color) 96%,transparent);color:var(--primary-text-color);box-shadow:0 10px 24px rgba(15,23,42,0.12),inset 0 1px 0 rgba(255,255,255,0.56);cursor:pointer;transform:translateY(-50%);transition:top 0.16s ease,left 0.16s ease,transform 0.16s ease,background-color 0.16s ease,box-shadow 0.16s ease}.sidebar-collapse-toggle:hover{background:color-mix(in srgb,var(--primary-color) 10%,var(--card-background-color));box-shadow:0 12px 28px rgba(15,23,42,0.16),inset 0 1px 0 rgba(255,255,255,0.62)}.sidebar-collapse-toggle:focus-visible{outline:2px solid var(--primary-color);outline-offset:3px}.sidebar-collapse-toggle ha-icon{--mdc-icon-size:18px}.sidebar-collapse-toggle.is-collapsed{left:0;top:50%;width:34px;min-width:34px;height:54px;padding:0;border-left:0;border-radius:0 999px 999px 0;background:color-mix(in srgb,var(--card-background-color) 98%,transparent);transform:translateY(-50%);box-shadow:0 12px 28px rgba(15,23,42,0.14),inset 0 1px 0 rgba(255,255,255,0.56)}.sidebar-collapse-label{display:none;font-size:13px;font-weight:850;line-height:1}.sidebar-collapse-toggle.is-collapsed .sidebar-collapse-label{display:inline}.main-content{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;overflow:hidden}.global-header{background:var(--card-background-color);border-bottom:1px solid var(--divider-color);padding:16px;position:sticky;top:0;z-index:1;transition:all 0.3s ease}.global-header.compact{padding:8px 16px}.header-content{display:flex;align-items:center;justify-content:space-between;gap:16px}.header-time-weather{display:flex;flex-direction:column;align-items:flex-end;gap:8px;min-width:120px}.header-time-section{display:flex;flex-direction:column;align-items:flex-end;gap:0px;line-height:0.8}.header-time{font-size:24px;font-weight:700;color:var(--primary-text-color);font-family:'Roboto Mono',monospace;line-height:1.2}.header-date{font-size:14px;opacity:0.8;color:var(--secondary-text-color);font-weight:500}.weather-compact{display:flex;align-items:center;gap:8px;margin:0;padding:4px 12px;border:0;background:var(--secondary-background-color);color:inherit;font:inherit;text-align:left;border-radius:20px;cursor:pointer;transition:all 0.2s ease}.weather-compact:hover{background:var(--primary-color);color:var(--text-primary-color);transform:translateY(-1px)}.weather-icon-compact ha-icon{--mdc-icon-size:24px}.weather-temp-compact{font-size:14px;font-weight:500}.header-status-section{flex:1;overflow:hidden}.header-status-scroll{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}.header-status-scroll::-webkit-scrollbar{display:none}.status-card-compact{display:flex;flex-direction:column;align-items:center;padding:8px 12px;background:var(--secondary-background-color);border-radius:12px;cursor:pointer;transition:all 0.2s ease;min-width:60px;position:relative}.status-card-compact:hover{transform:translateY(-2px);box-shadow:0 2px 8px rgba(0,0,0,0.1)}.status-card-icon-compact{position:relative;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--primary-color) 10%,transparent)}.status-card-icon-compact ha-icon{--mdc-icon-size:20px;color:var(--primary-color)}.status-card-badge-compact{position:absolute;top:-4px;right:-4px;background:var(--primary-color);color:var(--text-primary-color);border-radius:10px;padding:2px 6px;font-size:11px;font-weight:bold;min-width:18px;text-align:center}.status-card-title-compact{font-size:11px;margin-top:4px;opacity:0.8}.status-card-compact.light .status-card-icon-compact{background:color-mix(in srgb,var(--status-color,#e1a129) 15%,transparent)}.status-card-compact.light ha-icon{color:var(--status-color,#e1a129)}.status-card-compact.switch .status-card-icon-compact{background:color-mix(in srgb,var(--status-color,#2f6fd6) 15%,transparent)}.status-card-compact.switch ha-icon{color:var(--status-color,#2f6fd6)}.status-card-compact.binary_sensor .status-card-icon-compact{background:color-mix(in srgb,var(--status-color,#df5b63) 15%,transparent)}.status-card-compact.binary_sensor ha-icon{color:var(--status-color,#df5b63)}.status-card-compact.person .status-card-icon-compact{background:color-mix(in srgb,var(--status-color,#6d7891) 15%,transparent)}.status-card-compact.person ha-icon{color:var(--status-color,#6d7891)}.status-card-compact.wattage .status-card-icon-compact{background:color-mix(in srgb,var(--status-color,#d88e20) 15%,transparent)}.status-card-compact.wattage ha-icon{color:var(--status-color,#d88e20)}.header-expand-button{position:absolute;bottom:-28px;left:50%;transform:translateX(-50%);width:40px;height:40px;border-radius:50%;background:var(--card-background-color);border:1px solid var(--divider-color);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s ease;box-shadow:0 2px 8px rgba(0,0,0,0.1);z-index:5}.header-expand-button:hover{transform:translateX(-50%) translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.15)}.header-expand-button[data-extra-count]::after{content:attr(data-extra-count);position:absolute;right:-8px;top:50%;transform:translateY(-50%);background:var(--primary-color);color:var(--text-primary-color);border-radius:10px;padding:2px 6px;font-size:11px;font-weight:bold;min-width:18px;text-align:center}.area-list{padding:8px}.floor-section{margin-bottom:16px}.floor-header{padding:8px 16px;margin-bottom:8px}.floor-header h3{margin:0;font-size:14px;font-weight:600;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:0.5px}.floor-areas{display:grid;grid-template-columns:repeat(auto-fit,minmax(178px,1fr));gap:8px}.area-button{box-sizing:border-box;display:flex;align-items:center;gap:12px;padding:16px;margin-bottom:0;border-radius:16px;cursor:pointer;transition:all 0.3s ease;background:var(--secondary-background-color);border:none;width:100%;height:125px;text-align:left;color:var(--primary-text-color);position:relative;min-width:0;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05)}.area-button:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.1)}.area-button.selected{background:var(--primary-color);color:var(--text-primary-color)}.area-button.home-button{height:60px}.area-button.has-picture{position:relative;background:var(--secondary-background-color);--area-picture-text-color:#ffffff;--area-picture-muted-text-color:rgba(255,255,255,0.76);--area-picture-text-shadow:0 2px 10px rgba(0,0,0,0.62);--area-picture-overlay:linear-gradient(90deg,rgba(11,17,28,0.76) 0%,rgba(11,17,28,0.38) 54%,rgba(11,17,28,0.08) 100%),linear-gradient(180deg,rgba(11,17,28,0.04),rgba(11,17,28,0.34))}.area-button.has-picture.text-dark{--area-picture-text-color:#ffffff;--area-picture-muted-text-color:rgba(255,255,255,0.76);--area-picture-text-shadow:0 2px 10px rgba(0,0,0,0.62);--area-picture-overlay:linear-gradient(90deg,rgba(11,17,28,0.76) 0%,rgba(11,17,28,0.38) 54%,rgba(11,17,28,0.08) 100%),linear-gradient(180deg,rgba(11,17,28,0.04),rgba(11,17,28,0.34))}.area-background{position:absolute;top:0;left:0;width:100%;height:100%;background-size:cover;background-position:center;background-repeat:no-repeat;opacity:0.7;transition:opacity 0.2s ease}.area-button.has-picture:hover .area-background{opacity:0.8}.area-button-action{position:absolute;inset:0;z-index:0;width:100%;height:100%;margin:0;padding:0;border:0;border-radius:inherit;background:transparent;color:inherit;cursor:pointer}.area-button-action:focus-visible{outline:2px solid var(--primary-color);outline-offset:-3px}@supports selector(:has(*)){.area-button-action:focus-visible{outline:none}.area-button:has(>.area-button-action:focus-visible){outline:2px solid var(--primary-color);outline-offset:2px}.area-button.selected:has(>.area-button-action:focus-visible){outline-color:var(--primary-text-color)}}.area-button>:not(.area-button-action),.area-button::before,.area-button::after{pointer-events:none}.area-button .area-light-toggle,.area-button .home-notification-shortcut{pointer-events:auto}.area-button:not(.home-button){font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;line-height:normal}.area-light-toggle{position:relative;margin:0;font-family:inherit;line-height:inherit}@media (pointer:coarse){.area-light-toggle::after{content:"";position:absolute;left:50%;top:50%;width:100%;min-width:44px;height:44px;transform:translate(-50%,-50%)}}.area-content{position:relative;z-index:1;display:flex;flex-direction:column;gap:8px;width:100%;height:100%;justify-content:space-between}.area-top-section{display:flex;flex-direction:column;gap:2px;margin-top:4px}.area-bottom-section{display:flex;align-items:flex-end;justify-content:flex-end;gap:8px;margin-bottom:4px}.area-button.has-picture .area-name,.area-button.has-picture .area-sensors{text-shadow:var(--area-picture-text-shadow);color:var(--area-picture-text-color)}.sidebar .area-main-icon{position:absolute;left:-25px;bottom:-25px;width:65px;height:65px;border-radius:50%;background:color-mix(in srgb,var(--primary-color) 60%,transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0}.area-button.selected .area-main-icon{background:rgba(255,255,255,0.2)}.sidebar .area-main-icon ha-icon{--mdc-icon-size:40px;color:var(--primary-color)}.area-info-badges{display:flex;gap:4px;flex-wrap:wrap;align-items:center}.area-icon{width:32px;height:32px;border-radius:50%;background:var(--secondary-background-color);display:flex;align-items:center;justify-content:center;flex-shrink:0}.area-button.selected .area-icon{background:rgba(255,255,255,0.2)}.area-info{flex:1}.area-menu-chevron{display:none}.home-notification-shortcut{box-sizing:border-box;position:relative;z-index:2;min-width:42px;height:28px;margin-left:auto;padding:0 7px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:4px;flex-shrink:0;cursor:pointer;color:#dc2626;background:color-mix(in srgb,#ef4444 12%,var(--card-background-color));box-shadow:inset 0 0 0 1px rgba(220,38,38,0.08),0 6px 14px rgba(220,38,38,0.1)}.home-notification-shortcut ha-icon{--mdc-icon-size:15px}.home-notification-count{min-width:17px;height:17px;padding:0 5px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:#e13f3f;color:#ffffff;font-size:11px;font-weight:850;line-height:1}.area-name{font-weight:600;font-size:16px;margin-bottom:2px}.area-sensors{font-size:13px;opacity:0.8;font-weight:500}.area-alerts{display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--error-color);color:var(--text-primary-color);font-size:11px;font-weight:bold;flex-shrink:0}.content-area{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overflow-anchor:none;overscroll-behavior:auto;-webkit-overflow-scrolling:touch;padding:16px;padding-bottom:var(--dd-next-bottom-nav-space,16px)}.content-area.settings-content-area{padding:0;background:linear-gradient(180deg,color-mix(in srgb,var(--primary-color) 4%,transparent) 0,transparent 220px),var(--primary-background-color)}.settings-page-view{--dd-settings-bar-bottom:var(--dd-next-bottom-nav-space,16px);width:min(1180px,calc(100% - 32px));min-height:100%;margin:0 auto;padding:18px 0 calc(24px + var(--dd-next-bottom-nav-space,0px));box-sizing:border-box}.settings-page-header{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:16px;margin:0 0 16px;padding:16px 18px;border:1px solid color-mix(in srgb,var(--divider-color) 72%,transparent);border-radius:18px;background:linear-gradient(135deg,color-mix(in srgb,var(--card-background-color) 96%,var(--primary-color)) 0%,color-mix(in srgb,var(--card-background-color) 94%,var(--primary-color)) 100%);box-shadow:0 14px 36px rgba(15,23,42,0.08)}.settings-page-back,.settings-primary{appearance:none;border:0;font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}.settings-page-back{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 74%,var(--card-background-color));color:var(--primary-text-color)}.settings-page-back ha-icon{--mdc-icon-size:22px}.settings-page-title{min-width:0}.settings-page-title h1{margin:0;font-size:clamp(22px,2vw,30px);line-height:1.08;font-weight:850;color:var(--primary-text-color);letter-spacing:0}.settings-page-title p{margin:5px 0 0;color:var(--secondary-text-color);font-size:14px;line-height:1.35}.settings-primary{min-height:40px;padding:0 22px;border-radius:999px;font-size:14px;font-weight:800}.settings-primary{background:var(--primary-color);color:var(--text-primary-color);box-shadow:0 10px 24px color-mix(in srgb,var(--primary-color) 24%,transparent)}.settings-primary:disabled{opacity:0.45;cursor:default;box-shadow:none}.settings-page-editor{overflow:hidden;border-radius:18px;background:var(--card-background-color);border:1px solid color-mix(in srgb,var(--divider-color) 72%,transparent);box-shadow:0 16px 46px rgba(15,23,42,0.08)}.settings-page-editor dwains-dashboard-next-strategy-editor{display:block}.settings-save-bar{position:sticky;bottom:var(--dd-settings-bar-bottom);z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;margin:14px 0 0;padding:8px 8px 8px 16px;border:1px solid color-mix(in srgb,var(--divider-color) 62%,transparent);border-radius:999px;background:color-mix(in srgb,var(--card-background-color) 92%,transparent);box-shadow:0 16px 34px rgba(15,23,42,0.13);backdrop-filter:blur(18px) saturate(170%);-webkit-backdrop-filter:blur(18px) saturate(170%)}.settings-save-status{min-width:0;display:flex;align-items:center;gap:8px;color:var(--secondary-text-color);font-size:13px;font-weight:700;line-height:1.3}.settings-save-text{min-width:0;overflow-wrap:anywhere}.settings-save-dot{flex:0 0 auto;width:8px;height:8px;border-radius:999px;background:var(--success-color,#43a047)}.settings-save-bar.is-dirty .settings-save-status{color:var(--primary-text-color)}.settings-save-bar.is-dirty .settings-save-dot{background:var(--warning-color,#ff9800)}.settings-save-bar.is-saving .settings-save-dot{background:var(--primary-color);animation:dd-settings-saving 1s ease-in-out infinite}.settings-save-bar.is-error{border-radius:18px;border-color:color-mix(in srgb,var(--error-color) 40%,transparent)}.settings-save-bar.is-error .settings-save-status{color:var(--error-color)}.settings-save-bar.is-error .settings-save-dot{background:var(--error-color)}.settings-save-bar .settings-primary{flex:0 0 auto}@keyframes dd-settings-saving{50%{opacity:0.3}}@media (prefers-reduced-motion:reduce){.settings-save-bar.is-saving .settings-save-dot{animation:none}}@media (max-width:768px){.content-area{padding-bottom:calc(104px + env(safe-area-inset-bottom,0px))}}[data-dd-wall-tablet-hold]{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}.home-view{max-width:1600px;margin:0 auto;padding:0px}.home-welcome{text-align:left;margin-bottom:28px;padding:0;background:color-mix(in srgb,var(--card-background-color) 97%,var(--primary-background-color));border:1px solid rgba(15,23,42,0.06);border-radius:8px;box-shadow:0 14px 34px rgba(15,23,42,0.08)}.welcome-content{margin:0 auto;padding:18px 22px}.welcome-header{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:18px;margin-bottom:0}.welcome-user{display:flex;align-items:center;gap:14px;min-width:0}.welcome-avatar{border:0;padding:0;display:inline-flex;width:52px;height:52px;overflow:hidden;align-items:center;justify-content:center;flex:0 0 auto;appearance:none;-webkit-appearance:none;background:var(--secondary-background-color);color:var(--secondary-text-color);border-radius:999px;cursor:pointer;box-shadow:0 10px 22px rgba(15,23,42,0.1),0 0 0 3px rgba(255,255,255,0.72);transition:transform 0.18s ease,box-shadow 0.18s ease}.welcome-avatar:hover{transform:translateY(-1px)}.welcome-avatar:focus-visible{outline:2px solid var(--primary-color);outline-offset:3px}.welcome-avatar ha-icon{--mdc-icon-size:26px}.welcome-avatar img{width:100%;height:100%;object-fit:cover}.welcome-avatar-initials{color:var(--primary-text-color);font-size:18px;font-weight:800;line-height:1;letter-spacing:0}.welcome-copy{min-width:0}.welcome-text{display:flex;align-items:baseline;gap:4px}.welcome-greeting{font-size:22px;font-weight:400;color:var(--secondary-text-color)}.welcome-name{font-size:28px;font-weight:750;color:var(--primary-text-color)}.welcome-title{display:none}.welcome-return{display:block;margin-top:5px;color:var(--secondary-text-color);font-size:13px;font-weight:650;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.welcome-actions{display:flex;align-items:center;gap:8px}.welcome-action{position:relative;border:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:999px;color:var(--primary-text-color);background:color-mix(in srgb,var(--secondary-background-color) 74%,var(--card-background-color));box-shadow:inset 0 0 0 1px rgba(15,23,42,0.05);transition:transform 0.18s ease,box-shadow 0.18s ease,background-color 0.18s ease;-webkit-tap-highlight-color:transparent}.welcome-action:hover{background:color-mix(in srgb,var(--primary-color) 10%,var(--card-background-color));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary-color) 18%,transparent)}.welcome-action ha-icon{--mdc-icon-size:22px}.welcome-action:active{transform:scale(0.96)}.welcome-action-badge{position:absolute;top:-2px;right:-2px;min-width:17px;height:17px;padding:0 5px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:var(--error-color);color:#fff;font-size:10px;font-weight:850;line-height:1;box-shadow:0 0 0 2px var(--card-background-color)}.welcome-time-section{display:flex;flex-direction:column;align-items:flex-end;gap:0px;min-width:112px;line-height:1.1}.welcome-time{font-size:34px;font-weight:800;color:var(--primary-text-color);font-family:'Roboto Mono',monospace}.welcome-date{margin-top:4px;font-size:14px;opacity:0.8;color:var(--secondary-text-color);font-weight:650}.welcome-subheader{display:flex;justify-content:flex-start;align-items:center;gap:10px;margin-top:14px}.welcome-alarm{display:flex;align-items:center;gap:8px;margin:0;padding:8px 16px;border:0;border-radius:20px;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:all 0.2s ease;font-weight:500}.welcome-alarm.alarm-armed{background:var(--error-color);color:var(--text-primary-color)}.welcome-alarm.alarm-disarmed{background:var(--success-color);color:var(--text-primary-color)}.welcome-alarm.alarm-triggered{background:var(--error-color);color:var(--text-primary-color);animation:pulse 2s infinite}.welcome-alarm:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.15)}.welcome-alarm ha-icon{--mdc-icon-size:18px}.alarm-text{font-size:14px;font-weight:600}@keyframes pulse{0%{opacity:1}50%{opacity:0.7}100%{opacity:1}}.welcome-weather{display:flex;align-items:center;gap:8px;margin:0;padding:8px 16px;border:0;background:var(--primary-color);color:var(--text-primary-color);font:inherit;text-align:left;border-radius:20px;cursor:pointer;transition:all 0.2s ease;font-weight:500}.welcome-weather:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.15)}.welcome-weather ha-icon{--mdc-icon-size:20px}.weather-temp{font-size:16px;font-weight:600}.weather-label{font-size:12px;font-weight:750;line-height:1;opacity:0.82;text-transform:uppercase;letter-spacing:0}@media (max-width:768px){.home-welcome{text-align:left;margin:-10px -10px 16px;padding:calc(18px + env(safe-area-inset-top,0px)) 20px 16px;border-radius:0 0 8px 8px;background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 96%,var(--primary-color)) 0%,color-mix(in srgb,var(--card-background-color) 92%,var(--primary-background-color)) 100%);box-shadow:0 12px 30px rgba(15,23,42,0.08)}.welcome-content{padding:0}.welcome-header{display:flex;flex-direction:row;justify-content:space-between;gap:14px;margin-bottom:0}.welcome-user{gap:10px;flex:1 1 auto}.welcome-avatar{display:inline-flex;width:38px;height:38px;border-radius:999px;box-shadow:0 8px 18px rgba(15,23,42,0.1),0 0 0 3px rgba(255,255,255,0.72)}.welcome-avatar ha-icon{--mdc-icon-size:21px}.welcome-avatar-initials{font-size:14px}.welcome-text{display:block}.welcome-greeting,.welcome-name{display:none}.welcome-title{display:block;color:var(--primary-text-color);font-size:15px;font-weight:750;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.welcome-return{display:block;margin-top:3px;color:var(--secondary-text-color);font-size:12px;font-weight:600;line-height:1.1}.welcome-time-section{display:none}.welcome-actions{display:flex;align-items:center;gap:8px;flex:0 0 auto}.welcome-action{width:42px;height:42px;border-radius:999px;color:var(--primary-text-color);background:color-mix(in srgb,var(--card-background-color) 86%,var(--primary-background-color));box-shadow:0 8px 20px color-mix(in srgb,var(--primary-text-color) 10%,transparent),inset 0 0 0 1px color-mix(in srgb,var(--primary-text-color) 8%,transparent)}.welcome-action ha-icon{--mdc-icon-size:21px}.welcome-subheader{justify-content:flex-start;gap:8px;margin-top:16px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}.welcome-subheader::-webkit-scrollbar{display:none}.welcome-alarm,.welcome-weather{min-width:auto;height:42px;padding:0 14px;justify-content:center;border-radius:999px;flex:0 0 auto;box-shadow:0 8px 18px rgba(15,23,42,0.08)}.alarm-text,.weather-temp{font-size:15px}.weather-label{font-size:11px}}@media (max-width:480px){.home-welcome{padding:calc(16px + env(safe-area-inset-top,0px)) 18px 14px;margin-bottom:14px}.welcome-header{gap:10px}.welcome-avatar{width:36px;height:36px}.welcome-title{font-size:14px}.welcome-return{font-size:11px}.welcome-action{width:40px;height:40px}.welcome-alarm,.welcome-weather{height:40px;padding:0 13px;font-size:14px}.alarm-text,.weather-temp{font-size:14px}.weather-label{font-size:11px}}.home-status-section{margin-bottom:48px}.home-status-heading{display:flex;align-items:center;gap:9px;margin:0 0 14px;color:var(--primary-text-color);font-size:20px;font-weight:850;line-height:1.1}.home-status-heading ha-icon{--mdc-icon-size:20px;width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent)}.home-camera-section{--home-section-color:#ef4444;margin-bottom:36px}.home-camera-section .home-status-heading ha-icon{color:#ef4444;background:color-mix(in srgb,#ef4444 12%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,#ef4444 8%,transparent)}.home-summaries-section{--home-section-color:#f59e0b;margin-bottom:36px}.home-summaries-section .home-status-heading ha-icon{color:#f59e0b;background:color-mix(in srgb,#f59e0b 13%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,#f59e0b 9%,transparent)}.home-todos-section{--home-section-color:#7c3aed;margin-bottom:36px}.home-todos-section .home-status-heading ha-icon{color:#7c3aed;background:color-mix(in srgb,#7c3aed 12%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,#7c3aed 8%,transparent)}.home-todos-grid{width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));align-items:start;gap:12px}.home-todo-card,.home-todo-card dwains-dashboard-next-card-host{display:block;min-width:0}.home-custom-cards-section{--home-section-color:#0ea5a8;margin-bottom:36px}.home-custom-cards-section .home-status-heading ha-icon{color:#0ea5a8;background:color-mix(in srgb,#0ea5a8 12%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,#0ea5a8 20%,transparent)}.home-custom-cards-grid{width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));align-items:start;gap:12px}.home-custom-card,.home-custom-card dwains-dashboard-next-card-host{display:block;min-width:0}.home-scenes-section{--home-section-color:#db2777;position:relative;margin-bottom:36px}.home-scenes-section .home-status-heading ha-icon{color:var(--home-section-color);background:color-mix(in srgb,var(--home-section-color) 12%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--home-section-color) 8%,transparent)}.home-scenes-list{display:flex;flex-wrap:wrap;gap:10px}.home-scene-chip{--scene-color:var(--home-section-color,var(--primary-color));appearance:none;box-sizing:border-box;min-width:0;max-width:280px;min-height:56px;padding:8px 16px 8px 8px;display:inline-flex;align-items:center;gap:11px;border:1px solid color-mix(in srgb,var(--primary-text-color) 9%,transparent);border-radius:12px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer;box-shadow:0 8px 20px color-mix(in srgb,var(--primary-text-color) 5%,transparent);-webkit-tap-highlight-color:transparent;transition:transform 0.16s ease,border-color 0.16s ease,box-shadow 0.16s ease}.home-scene-chip:hover:not(:disabled){transform:translateY(-1px);border-color:color-mix(in srgb,var(--scene-color) 35%,transparent);box-shadow:0 12px 26px color-mix(in srgb,var(--scene-color) 13%,transparent)}.home-scene-chip:active:not(:disabled){transform:scale(0.97)}.home-scene-chip:focus-visible{outline:2px solid color-mix(in srgb,var(--scene-color) 70%,#ffffff);outline-offset:2px}.home-scene-chip:disabled{cursor:not-allowed;opacity:0.55;box-shadow:none}.home-scene-chip:disabled .home-scene-icon{color:var(--secondary-text-color);background:color-mix(in srgb,var(--secondary-text-color) 12%,transparent)}.home-scene-chip.is-pending{cursor:progress}.home-scene-icon{width:38px;height:38px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:9px;color:var(--scene-color);background:color-mix(in srgb,var(--scene-color) 14%,transparent);transition:color 0.2s ease,background-color 0.2s ease}.home-scene-icon ha-icon{--mdc-icon-size:21px}.home-scene-copy{min-width:0;display:flex;flex-direction:column;gap:2px}.home-scene-name{font-size:14px;font-weight:850;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.home-scene-meta{min-width:0;display:flex;align-items:center;gap:6px;color:var(--secondary-text-color);font-size:12px;font-weight:700;line-height:1.25}.home-scene-meta-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.home-scene-chip.is-pending .home-scene-icon{animation:dd-scene-pending 0.9s ease-in-out infinite}.home-scene-chip.is-success{border-color:color-mix(in srgb,var(--success-color,#43a047) 45%,transparent)}.home-scene-chip.is-success .home-scene-icon{color:#ffffff;background:var(--success-color,#43a047);animation:dd-scene-done 0.3s ease-out}.home-scene-chip.is-success .home-scene-meta{color:var(--success-color,#43a047)}.home-scene-chip.is-running .home-scene-icon{color:#ffffff;background:var(--scene-color)}.home-scene-chip.is-running .home-scene-meta{color:var(--scene-color)}.home-scene-running-dot{width:7px;height:7px;flex:0 0 auto;border-radius:999px;background:currentColor;animation:dd-scene-running 1.2s ease-in-out infinite}@keyframes dd-scene-pending{50%{transform:scale(0.88);opacity:0.6}}@keyframes dd-scene-done{from{transform:scale(0.8)}to{transform:scale(1)}}@keyframes dd-scene-running{50%{opacity:0.25}}@media (prefers-reduced-motion:reduce){.home-scene-chip.is-pending .home-scene-icon,.home-scene-chip.is-success .home-scene-icon,.home-scene-running-dot{animation:none}.home-scene-chip.is-pending .home-scene-icon{opacity:0.6}.home-scene-chip:hover:not(:disabled),.home-scene-chip:active:not(:disabled){transform:none}}:host([data-theme-dark]) .home-scene-chip{background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 88%,#ffffff 4%),color-mix(in srgb,var(--card-background-color) 96%,#000000 4%));border-color:rgba(255,255,255,0.08);box-shadow:0 12px 26px rgba(0,0,0,0.24),inset 0 1px 0 rgba(255,255,255,0.04)}:host([data-theme-dark]) .home-scene-chip:not(.is-running,.is-success,:disabled) .home-scene-icon{background:color-mix(in srgb,var(--scene-color) 20%,transparent)}.dd-visually-hidden{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}.home-summary-list{width:min(100%,980px);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.home-summary-card{appearance:none;width:100%;min-height:68px;padding:12px 14px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:13px;border:1px solid color-mix(in srgb,var(--primary-text-color) 9%,transparent);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer;box-shadow:0 8px 20px color-mix(in srgb,var(--primary-text-color) 5%,transparent);transition:transform 0.16s ease,border-color 0.16s ease,box-shadow 0.16s ease}.home-summary-card:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--summary-color) 35%,transparent);box-shadow:0 12px 26px color-mix(in srgb,var(--summary-color) 13%,transparent)}.home-summary-card:active{transform:scale(0.992)}.home-summary-card:focus-visible{outline:2px solid color-mix(in srgb,var(--summary-color) 70%,#ffffff);outline-offset:2px}.home-summary-icon{width:38px;height:38px;display:inline-flex;align-items:center;justify-content:center;border-radius:9px;color:var(--summary-color);background:color-mix(in srgb,var(--summary-color) 14%,transparent);flex:0 0 auto}.home-summary-icon ha-icon{--mdc-icon-size:21px}.home-summary-copy{min-width:0;display:flex;flex-direction:column;gap:2px}.home-summary-title{color:var(--primary-text-color);font-size:14px;font-weight:850;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.home-summary-subtitle{color:var(--secondary-text-color);font-size:12px;font-weight:700;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.home-summary-chevron{width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;color:color-mix(in srgb,var(--primary-text-color) 48%,transparent);flex:0 0 auto}.home-summary-chevron ha-icon{--mdc-icon-size:20px}.home-camera-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}.home-camera-card{position:relative;min-height:168px;overflow:hidden;border:0;border-radius:12px;display:flex;align-items:stretch;padding:0;background:color-mix(in srgb,var(--primary-text-color) 12%,var(--card-background-color));color:#ffffff;cursor:pointer;text-align:left;box-shadow:0 16px 32px rgba(15,23,42,0.12),inset 0 0 0 1px rgba(255,255,255,0.1);transition:transform 0.18s ease,box-shadow 0.18s ease}.home-camera-card:hover{transform:translateY(-2px);box-shadow:0 20px 42px rgba(15,23,42,0.16),inset 0 0 0 1px rgba(255,255,255,0.16)}.home-camera-card:focus-visible{outline:2px solid var(--primary-color);outline-offset:3px}.home-camera-image,.home-camera-placeholder{position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.02)}.home-camera-placeholder{display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 20% 20%,rgba(var(--rgb-primary-color,3,169,244),0.28),transparent 34%),linear-gradient(135deg,#192133,#0f172a)}.home-camera-placeholder ha-icon{--mdc-icon-size:44px;color:rgba(255,255,255,0.58)}.home-camera-card::after{content:"";position:absolute;left:0;right:0;bottom:0;height:52%;background:linear-gradient(180deg,rgba(7,11,18,0) 0%,rgba(7,11,18,0.34) 42%,rgba(7,11,18,0.84) 100%);pointer-events:none}.home-camera-content{position:relative;z-index:1;width:100%;min-height:168px;padding:14px;display:flex;flex-direction:column;justify-content:space-between}.home-camera-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.home-camera-area-icon,.home-camera-count{min-width:36px;height:36px;border-radius:11px;display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.2);color:#ffffff;backdrop-filter:blur(12px);box-shadow:0 10px 24px rgba(15,23,42,0.16),inset 0 0 0 1px rgba(255,255,255,0.12)}.home-camera-area-icon ha-icon{--mdc-icon-size:20px}.home-camera-count{min-width:44px;padding:0 10px;gap:5px;border-radius:999px;font-size:12px;font-weight:850}.home-camera-count ha-icon{--mdc-icon-size:14px}.home-camera-copy{min-width:0;text-shadow:0 2px 12px rgba(0,0,0,0.62)}.home-camera-name{font-size:18px;font-weight:850;line-height:1.08;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.home-camera-meta{margin-top:5px;color:rgba(255,255,255,0.76);font-size:12px;font-weight:720;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mobile-home-section,.mobile-section-heading{display:none}.layout-container.sidebar-collapsed .mobile-home-section.mobile-home-areas{display:block;margin:0 0 36px}.layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:0;margin-bottom:14px}.layout-container.sidebar-collapsed .mobile-home-areas .mobile-section-action{display:none}.layout-container.sidebar-collapsed .mobile-area-rail{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px;padding:0;overflow:visible;scroll-snap-type:none}.layout-container.sidebar-collapsed .mobile-area-card{appearance:none;position:relative;box-sizing:border-box;min-width:0;min-height:156px;padding:16px;display:flex;flex-direction:column;align-items:stretch;justify-content:space-between;overflow:hidden;border:1px solid color-mix(in srgb,var(--primary-text-color) 8%,transparent);border-radius:8px;background:color-mix(in srgb,var(--card-background-color) 96%,var(--primary-background-color));color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer;box-shadow:0 14px 30px color-mix(in srgb,var(--primary-text-color) 8%,transparent);transition:transform 0.18s ease,border-color 0.18s ease,box-shadow 0.18s ease}.layout-container.sidebar-collapsed .mobile-area-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--primary-color) 22%,transparent);box-shadow:0 18px 38px color-mix(in srgb,var(--primary-text-color) 11%,transparent)}.layout-container.sidebar-collapsed .mobile-area-card.has-picture{min-height:176px;color:var(--mobile-area-picture-text-color,#ffffff);border-color:rgba(255,255,255,0.16);background:#182044;--mobile-area-picture-text-color:#ffffff;--mobile-area-picture-muted-text-color:rgba(255,255,255,0.76);--mobile-area-picture-text-shadow:0 2px 10px rgba(0,0,0,0.62);--mobile-area-picture-overlay:linear-gradient(180deg,rgba(12,18,32,0.02) 0%,rgba(12,18,32,0.18) 42%,rgba(12,18,32,0.84) 100%),linear-gradient(90deg,rgba(12,18,32,0.18),rgba(12,18,32,0.04))}.layout-container.sidebar-collapsed .mobile-area-picture{position:absolute;inset:0;z-index:0;background-size:cover;background-position:center;transform:scale(1.02)}.layout-container.sidebar-collapsed .mobile-area-card.has-picture::after{content:"";position:absolute;inset:0;z-index:1;background:var(--mobile-area-picture-overlay);pointer-events:none}.layout-container.sidebar-collapsed .mobile-area-top,.layout-container.sidebar-collapsed .mobile-area-copy{position:relative;z-index:2}.layout-container.sidebar-collapsed .mobile-area-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.layout-container.sidebar-collapsed .mobile-area-icon{width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:8px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 13%,transparent)}.layout-container.sidebar-collapsed .mobile-area-icon ha-icon{--mdc-icon-size:23px}.layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-icon{color:var(--mobile-area-picture-text-color,#ffffff);background:rgba(255,255,255,0.18);backdrop-filter:blur(12px)}.layout-container.sidebar-collapsed .mobile-area-badges{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px;min-width:0}.layout-container.sidebar-collapsed .mobile-area-badge{min-width:25px;height:25px;padding:0 8px;display:inline-flex;align-items:center;justify-content:center;gap:4px;border-radius:999px;color:var(--area-badge-color,var(--primary-color));background:color-mix(in srgb,var(--area-badge-color,var(--primary-color)) 12%,transparent);font-size:11px;font-weight:850}.layout-container.sidebar-collapsed .mobile-area-badge ha-icon{--mdc-icon-size:14px}.layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-badge{background:color-mix(in srgb,var(--area-badge-color,var(--primary-color)) 18%,rgba(255,255,255,0.88));backdrop-filter:blur(12px);box-shadow:0 4px 12px rgba(15,23,42,0.16)}.layout-container.sidebar-collapsed .mobile-area-name{font-size:16px;font-weight:850;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.layout-container.sidebar-collapsed .mobile-area-meta{margin-top:5px;color:color-mix(in srgb,var(--primary-text-color) 56%,transparent);font-size:12px;font-weight:700;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-name,.layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta{color:var(--mobile-area-picture-text-color,#ffffff);text-shadow:var(--mobile-area-picture-text-shadow)}.layout-container.sidebar-collapsed .mobile-area-card.has-picture .mobile-area-meta{color:var(--mobile-area-picture-muted-text-color,rgba(255,255,255,0.72))}.person-cards-section{margin-bottom:32px}.person-cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin:0 auto}.person-card{--person-color:#8a94a6;--person-bg:color-mix(in srgb,var(--person-color) 8%,var(--card-background-color));position:relative;min-height:98px;padding:16px 18px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:16px;overflow:hidden;border:1px solid rgba(15,23,42,0.07);border-radius:18px;background:radial-gradient(circle at 90% 10%,color-mix(in srgb,var(--person-color) 15%,transparent),transparent 42%),var(--person-bg);cursor:pointer;box-shadow:0 16px 34px rgba(15,23,42,0.08),inset 0 0 0 1px rgba(255,255,255,0.34);transition:transform 0.18s ease,box-shadow 0.18s ease,border-color 0.18s ease}.person-card::after{content:"";position:absolute;left:18px;right:18px;bottom:0;height:3px;border-radius:999px 999px 0 0;background:var(--person-color);opacity:0.34}.person-card.home{--person-color:#2f9b62;--person-bg:color-mix(in srgb,#2f9b62 10%,var(--card-background-color))}.person-card.away{--person-color:#d88e20;--person-bg:color-mix(in srgb,#d88e20 9%,var(--card-background-color))}.person-card.unknown{--person-color:#7c67c7;--person-bg:color-mix(in srgb,#7c67c7 8%,var(--card-background-color))}.person-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--person-color) 24%,transparent);box-shadow:0 20px 42px rgba(15,23,42,0.12),inset 0 0 0 1px color-mix(in srgb,var(--person-color) 16%,transparent)}.person-card:active{transform:scale(0.988)}.person-card:focus-visible{outline:2px solid color-mix(in srgb,var(--person-color) 72%,#ffffff);outline-offset:3px}.person-avatar-wrapper{position:relative;z-index:1;flex-shrink:0}.person-avatar{width:64px;height:64px;border-radius:22px;overflow:hidden;background:color-mix(in srgb,var(--person-color) 14%,var(--secondary-background-color));display:flex;align-items:center;justify-content:center;border:3px solid color-mix(in srgb,var(--person-color) 26%,rgba(255,255,255,0.84));box-shadow:0 12px 24px color-mix(in srgb,var(--person-color) 16%,transparent)}.person-avatar img{width:100%;height:100%;object-fit:cover}.person-avatar ha-icon{--mdc-icon-size:34px;color:var(--person-color)}.person-home-indicator{position:absolute;bottom:-5px;right:-5px;width:26px;height:26px;background:var(--person-color);border-radius:999px;display:flex;align-items:center;justify-content:center;border:3px solid var(--card-background-color);box-shadow:0 8px 18px color-mix(in srgb,var(--person-color) 26%,transparent)}.person-home-indicator ha-icon{--mdc-icon-size:14px;color:var(--text-primary-color)}.person-info{position:relative;z-index:1;text-align:left;display:flex;flex-direction:column;gap:6px;flex:1;min-width:0}.person-name{font-size:18px;font-weight:850;color:var(--primary-text-color);line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.person-status{display:inline-flex;width:max-content;max-width:100%;align-items:center;gap:6px;min-height:27px;padding:0 10px;border-radius:999px;background:color-mix(in srgb,var(--person-color) 12%,transparent);color:var(--person-color);font-size:14px;font-weight:800;line-height:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.person-status ha-icon{--mdc-icon-size:15px}.person-details{position:relative;z-index:1;display:flex;flex-direction:row;flex-wrap:wrap;gap:7px;align-items:flex-end;justify-content:flex-end;flex-shrink:0;margin-left:auto;max-width:170px}.person-battery,.person-distance{display:flex;align-items:center;gap:5px;min-height:28px;font-size:12px;font-weight:800;color:color-mix(in srgb,var(--primary-text-color) 72%,transparent);background:rgba(255,255,255,0.62);padding:0 9px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(15,23,42,0.04)}.person-battery ha-icon,.person-distance ha-icon{--mdc-icon-size:14px}.person-battery ha-icon{color:var(--success-color)}.person-battery ha-icon[icon*="alert"]{color:var(--error-color)}.person-distance ha-icon{color:var(--primary-color)}@media (max-width:768px){.person-cards-grid{grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px}.person-card{padding:16px}.person-avatar{width:64px;height:64px}.person-avatar ha-icon{--mdc-icon-size:36px}.person-name{font-size:16px}.person-status{font-size:13px}.person-details{gap:8px}.person-battery,.person-distance{font-size:12px;padding:3px 6px}}.home-status-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:20px;margin:0 auto}.home-status-card{background:var(--card-background-color);border-radius:20px;padding:24px 20px;text-align:center;cursor:pointer;transition:all 0.3s ease;border:1px solid var(--divider-color);position:relative;overflow:hidden}.home-status-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--primary-color),var(--accent-color));opacity:0;transition:opacity 0.3s ease}.home-status-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.15);border-color:var(--primary-color)}.home-status-card:hover::before{opacity:1}.home-status-card .status-card-icon{position:relative;margin-bottom:16px}.home-status-card .status-card-icon ha-icon{--mdc-icon-size:36px;color:var(--primary-color);transition:transform 0.3s ease}.home-status-card:hover .status-card-icon ha-icon{transform:scale(1.1)}.home-status-card .status-card-badge{position:absolute;top:-10px;right:-10px;background:var(--accent-color);color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.2)}.home-status-card .status-card-title{font-size:15px;font-weight:600;color:var(--primary-text-color);margin-top:8px}.area-info-badges{position:absolute;top:5px;right:0px;display:flex;flex-wrap:wrap;gap:6px;max-width:calc(59% - 24px);justify-content:flex-end;align-items:flex-start;z-index:2}.info-badge{display:flex;align-items:center;gap:4px;padding:4px 8px;background:var(--secondary-background-color);border-radius:12px;font-size:12px;flex-shrink:0;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.1)}.info-badge ha-icon{--mdc-icon-size:14px}.info-badge.light{background:color-mix(in srgb,var(--badge-color,#e1a129) 10%,var(--card-background-color));color:var(--badge-color,#e1a129)}.info-badge.switch{background:color-mix(in srgb,var(--badge-color,#2f6fd6) 10%,var(--card-background-color));color:var(--badge-color,#2f6fd6)}.info-badge.climate{background:color-mix(in srgb,var(--badge-color,#34a6d8) 10%,var(--card-background-color));color:var(--badge-color,#34a6d8)}.info-badge.media_player{background:color-mix(in srgb,var(--badge-color,#7c67c7) 10%,var(--card-background-color));color:var(--badge-color,#7c67c7)}.info-badge.cover{background:color-mix(in srgb,var(--badge-color,#1494aa) 10%,var(--card-background-color));color:var(--badge-color,#1494aa)}.info-badge.fan{background:color-mix(in srgb,var(--badge-color,#2b8fcb) 10%,var(--card-background-color));color:var(--badge-color,#2b8fcb)}.info-badge.motion{background:color-mix(in srgb,var(--badge-color,#df5b63) 10%,var(--card-background-color));color:var(--badge-color,#df5b63)}.info-badge.alerts{background:color-mix(in srgb,var(--error-color) 10%,var(--card-background-color));color:var(--error-color)}.sidebar .info-badge{padding:2px 6px;font-size:11px;border-radius:12px}.sidebar .info-badge ha-icon{--mdc-icon-size:12px}.sidebar .badge-count{min-width:14px;text-align:center}.info-badge.clickable{cursor:pointer;transition:all 0.2s ease}.info-badge.clickable:hover{transform:scale(1.05);filter:brightness(1.1)}:host{--purple-color:#9c27b0;--blue-color:#2196f3}.area-view{max-width:1400px;margin:0 auto}.entities-section{display:grid;gap:16px}.domain-group{background:var(--card-background-color);border-radius:12px;padding:16px}.domain-header{display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:16px;font-weight:500}.domain-header ha-icon{--mdc-icon-size:20px;opacity:0.8}.entities-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}.entities-grid.cover-entities-grid{grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:12px}.entities-grid.light-entities-grid{grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}.entities-grid.sensor-entities-grid{grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.entities-grid.motion-entities-grid{grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}.entity-card-wrapper{min-height:60px;position:relative}.cover-entity-card,.light-entity-card,.motion-entity-card{min-height:72px}.sensor-entity-card{min-height:150px}.cover-entity-card dwains-dashboard-next-card-host,.light-entity-card dwains-dashboard-next-card-host,.sensor-entity-card dwains-dashboard-next-card-host,.motion-entity-card dwains-dashboard-next-card-host{display:block}.mobile-area-overview,.mobile-entities-section{display:none}.area-view .mobile-entities-section{display:grid;position:relative;z-index:2}.mobile-entities-section{gap:22px}.mobile-domain-group{min-width:0;position:relative}.mobile-domain-group.group-editing{border-radius:8px;transition:opacity 0.16s ease,outline-color 0.16s ease,background-color 0.16s ease}.mobile-domain-group.group-dragging{opacity:0.46}.mobile-domain-group.group-drag-over{outline:2px solid var(--primary-color);outline-offset:7px;background:color-mix(in srgb,var(--primary-color) 5%,transparent)}.mobile-domain-group:not(.menu-open){contain:layout style paint}.mobile-domain-group.menu-open{z-index:1200}.mobile-domain-header{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 2px;margin-bottom:10px}.mobile-domain-title{display:inline-flex;align-items:center;gap:8px;min-width:0}.mobile-domain-header-actions{display:inline-flex;align-items:center;gap:2px;flex:0 0 auto}.mobile-domain-order-button,.mobile-domain-drag-handle{width:30px;height:30px;padding:0;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 78%,transparent);color:var(--secondary-text-color);cursor:pointer}.mobile-domain-drag-handle{cursor:grab;touch-action:none}.mobile-domain-drag-handle:active{cursor:grabbing}.mobile-domain-order-button:disabled{opacity:0.28;cursor:default}.mobile-domain-order-button ha-icon,.mobile-domain-drag-handle ha-icon{--mdc-icon-size:18px}.mobile-layout-toggle{width:30px;height:30px;padding:0;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border:0;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 72%,#ffffff);color:color-mix(in srgb,var(--primary-text-color) 58%,transparent);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.05);cursor:pointer;transition:background-color 0.18s ease,color 0.18s ease,transform 0.18s ease}.mobile-layout-toggle.active{background:#182044;color:#ffffff;box-shadow:0 8px 18px rgba(15,23,42,0.14)}.mobile-layout-toggle:active{transform:scale(0.94)}.mobile-layout-toggle ha-icon{--mdc-icon-size:17px}.mobile-layout-toggle.static{cursor:default;pointer-events:none}.mobile-section-icon{width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:999px;color:var(--home-section-color,var(--primary-color));background:color-mix(in srgb,var(--home-section-color,var(--primary-color)) 12%,transparent)}.mobile-section-icon ha-icon{--mdc-icon-size:17px}.mobile-section-tools{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto}.mobile-section-toggle{appearance:none;width:28px;height:28px;padding:0;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border:0;border-radius:999px;background:transparent;color:var(--secondary-text-color);cursor:pointer;transition:background-color 0.18s ease,color 0.18s ease,transform 0.18s ease}.mobile-section-toggle:hover{background:color-mix(in srgb,var(--primary-text-color) 7%,transparent);color:var(--primary-text-color)}.mobile-section-toggle:active{transform:scale(0.94)}.mobile-section-toggle:focus-visible,.mobile-section-action:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.mobile-section-toggle ha-icon{--mdc-icon-size:18px}.mobile-domain-title-copy{min-width:0;display:inline-flex;align-items:baseline;gap:7px}.mobile-domain-title-label{color:var(--primary-text-color);font-size:18px;font-weight:900;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mobile-domain-count{color:color-mix(in srgb,var(--primary-text-color) 42%,transparent);font-size:12px;font-weight:850;line-height:1.1;white-space:nowrap}.mobile-domain-master{--mobile-domain-accent:var(--primary-color);min-width:58px;height:30px;padding:0 5px 0 7px;display:inline-flex;align-items:center;justify-content:space-between;gap:6px;border:1px solid color-mix(in srgb,var(--divider-color) 72%,transparent);border-radius:999px;background:color-mix(in srgb,var(--card-background-color) 92%,transparent);color:color-mix(in srgb,var(--primary-text-color) 54%,transparent);cursor:pointer;transition:background-color 0.18s ease,border-color 0.18s ease,color 0.18s ease,transform 0.18s ease;z-index:1202}.mobile-domain-master.domain-light{--mobile-domain-accent:#e89a17}.mobile-domain-master.domain-switch,.mobile-domain-master.domain-input_boolean{--mobile-domain-accent:#3275d6}.mobile-domain-master.domain-cover{--mobile-domain-accent:#0d98aa}.mobile-domain-master.domain-fan{--mobile-domain-accent:#2d9d79}.mobile-domain-master.domain-lock{--mobile-domain-accent:#7657c8}.mobile-domain-master.active{border-color:color-mix(in srgb,var(--mobile-domain-accent) 42%,transparent);background:color-mix(in srgb,var(--mobile-domain-accent) 11%,var(--card-background-color));color:var(--mobile-domain-accent)}.mobile-domain-master:active{transform:scale(0.94)}.mobile-domain-master ha-icon{--mdc-icon-size:16px}.mobile-domain-master-track{position:relative;width:26px;height:16px;flex:0 0 auto;border-radius:999px;background:color-mix(in srgb,var(--primary-text-color) 18%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary-text-color) 6%,transparent);transition:background-color 0.18s ease}.mobile-domain-master-track::after{content:"";position:absolute;top:3px;left:3px;width:10px;height:10px;border-radius:50%;background:#ffffff;box-shadow:0 1px 4px rgba(15,23,42,0.24);transition:transform 0.18s ease}.mobile-domain-master.active .mobile-domain-master-track{background:var(--mobile-domain-accent)}.mobile-domain-master.active .mobile-domain-master-track::after{transform:translateX(10px)}.mobile-domain-master-actions{--mobile-domain-accent:var(--primary-color);height:30px;display:inline-flex;align-items:center;overflow:hidden;border:1px solid color-mix(in srgb,var(--divider-color) 72%,transparent);border-radius:999px;background:color-mix(in srgb,var(--card-background-color) 92%,transparent);color:color-mix(in srgb,var(--primary-text-color) 58%,transparent);z-index:1202}.mobile-domain-master-actions.domain-cover{--mobile-domain-accent:#0d98aa}.mobile-domain-master-actions.domain-lock{--mobile-domain-accent:#7657c8}.mobile-domain-master-action{width:34px;height:30px;padding:0;display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:inherit;cursor:pointer;transition:background-color 0.18s ease,color 0.18s ease,transform 0.18s ease}.mobile-domain-master-action + .mobile-domain-master-action{border-left:1px solid color-mix(in srgb,var(--divider-color) 72%,transparent)}.mobile-domain-master-action:hover,.mobile-domain-master-action.active{background:color-mix(in srgb,var(--mobile-domain-accent) 12%,var(--card-background-color));color:var(--mobile-domain-accent)}.mobile-domain-master-action:active{transform:scale(0.88)}.mobile-domain-master-action ha-icon{--mdc-icon-size:17px}.mobile-entity-rail{display:flex;gap:10px;margin:0 -10px;padding:0 10px 2px;overflow-x:auto;scroll-padding:10px;scroll-snap-type:x proximity;scrollbar-width:none}.mobile-entity-rail::-webkit-scrollbar{display:none}.mobile-entities-section.layout-grid{gap:26px}.mobile-entities-section.layout-grid .mobile-entity-rail{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin:0;padding:0;overflow:visible;scroll-snap-type:none;align-items:stretch}.mobile-entities-section.layout-grid .mobile-entity-card{width:100%;min-width:0;box-sizing:border-box;flex:none;scroll-snap-align:none}@media (max-width:380px){.mobile-entities-section.layout-grid .mobile-entity-rail{grid-template-columns:1fr}}.mobile-entity-card{--entity-color:var(--primary-color);position:relative;box-sizing:border-box;contain:layout style;flex:0 0 164px;min-width:0;min-height:128px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;border:0;border-radius:10px;background:color-mix(in srgb,var(--card-background-color) 98%,#ffffff);color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer;scroll-snap-align:start;box-shadow:0 12px 26px rgba(15,23,42,0.06),inset 0 0 0 1px rgba(15,23,42,0.035);transition:transform 0.18s ease,box-shadow 0.18s ease}.mobile-entity-replacement-card{box-sizing:border-box;flex:0 0 260px;min-width:0;scroll-snap-align:start}.mobile-entity-replacement-card dwains-dashboard-next-card-host{display:block;width:100%}.mobile-todo-list-card{box-sizing:border-box;flex:0 0 min(100%,520px);width:min(100%,520px);min-width:min(100%,320px);scroll-snap-align:start}.mobile-todo-list-card dwains-dashboard-next-card-host{display:block;width:100%}.mobile-entities-section.layout-grid .mobile-entity-replacement-card{width:100%;flex:none;scroll-snap-align:none}.mobile-entities-section.layout-grid .mobile-todo-list-card{grid-column:1 / -1;width:100%;min-width:0;flex:none;scroll-snap-align:none}.mobile-entity-card:active{transform:scale(0.985)}.mobile-entity-card.is-active{box-shadow:0 14px 30px rgba(15,23,42,0.08),inset 0 0 0 1px color-mix(in srgb,var(--entity-color) 18%,transparent)}.mobile-entity-card.is-unavailable{opacity:0.62}.mobile-entity-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.mobile-entity-icon{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:11px;color:var(--entity-color);background:color-mix(in srgb,var(--entity-color) 13%,transparent)}.mobile-entity-icon ha-icon{--mdc-icon-size:20px}.mobile-entity-action{padding:0;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border:0;cursor:pointer;transition:background-color 0.18s ease,color 0.18s ease,transform 0.18s ease,opacity 0.18s ease}.mobile-entity-action:active{transform:scale(0.94)}.mobile-entity-action:disabled{opacity:0.36;cursor:not-allowed}.mobile-entity-toggle{width:38px;height:22px;justify-content:flex-start;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 80%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.07),0 4px 10px rgba(15,23,42,0.08)}.mobile-entity-toggle::before{content:"";width:18px;height:18px;margin-left:2px;border-radius:999px;background:#ffffff;box-shadow:0 2px 7px rgba(15,23,42,0.2);transition:transform 0.18s ease}.mobile-entity-card.is-active .mobile-entity-toggle{background:var(--entity-color)}.mobile-entity-card.is-active .mobile-entity-toggle::before{transform:translateX(16px)}.mobile-entity-more,.mobile-scene-action,.mobile-lock-action{width:30px;height:30px;border-radius:999px;color:color-mix(in srgb,var(--primary-text-color) 52%,transparent);background:color-mix(in srgb,var(--secondary-background-color) 70%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.05)}.mobile-lock-action.is-unlocked{color:#ffffff;background:var(--entity-color);box-shadow:0 8px 16px color-mix(in srgb,var(--entity-color) 24%,transparent)}.mobile-entity-more ha-icon,.mobile-scene-action ha-icon,.mobile-lock-action ha-icon{--mdc-icon-size:17px}.mobile-cover-actions{min-height:32px;padding:3px;display:inline-flex;align-items:center;gap:3px;flex:0 0 auto;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 74%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.055),0 6px 14px rgba(15,23,42,0.08)}.mobile-cover-action{width:26px;height:26px;border-radius:999px;color:color-mix(in srgb,var(--primary-text-color) 58%,transparent);background:transparent}.mobile-cover-action.active{color:#ffffff;background:var(--entity-color);box-shadow:0 6px 12px color-mix(in srgb,var(--entity-color) 22%,transparent)}.mobile-cover-action ha-icon{--mdc-icon-size:16px}.mobile-entities-section.layout-grid .mobile-cover-actions{min-height:30px;padding:3px;gap:2px}.mobile-entities-section.layout-grid .mobile-cover-action{width:24px;height:24px}.mobile-entities-section.layout-grid .mobile-cover-action ha-icon{--mdc-icon-size:15px}@media (max-width:430px){.mobile-entities-section.layout-grid .mobile-entity-card{min-height:138px;padding:12px}.mobile-entities-section.layout-grid .mobile-entity-top{gap:6px}.mobile-entities-section.layout-grid .mobile-entity-icon{width:34px;height:34px}.mobile-entities-section.layout-grid .mobile-cover-actions{min-height:28px;padding:2px;gap:1px}.mobile-entities-section.layout-grid .mobile-cover-action{width:23px;height:23px}.mobile-entities-section.layout-grid .mobile-cover-action ha-icon{--mdc-icon-size:14px}}.mobile-entity-meta{color:color-mix(in srgb,var(--primary-text-color) 42%,transparent);font-size:11px;font-weight:750;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mobile-entity-name{margin-top:3px;color:var(--primary-text-color);font-size:15px;font-weight:900;line-height:1.08;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.mobile-entity-status{margin-top:5px;color:color-mix(in srgb,var(--primary-text-color) 46%,transparent);font-size:11px;font-weight:750;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mobile-entity-content{min-width:0}.mobile-entity-card.has-inline-select{min-height:170px;justify-content:flex-start;gap:10px}.mobile-entity-card.has-inline-select .mobile-entity-content{margin-top:auto}.mobile-entity-card.has-inline-select .mobile-entity-status{display:none}.mobile-entity-select{position:relative;display:block;width:100%}.mobile-entity-select select{width:100%;height:34px;padding:0 34px 0 12px;border:0;border-radius:999px;outline:none;appearance:none;-webkit-appearance:none;color:var(--primary-text-color);background:color-mix(in srgb,var(--entity-color) 10%,var(--secondary-background-color));font:inherit;font-size:12px;font-weight:850;line-height:34px;cursor:pointer;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--entity-color) 16%,transparent),0 8px 18px rgba(15,23,42,0.06)}.mobile-entity-select select:focus{box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--entity-color) 72%,transparent),0 10px 22px color-mix(in srgb,var(--entity-color) 14%,transparent)}.mobile-entity-select select:disabled{opacity:0.55;cursor:not-allowed}.mobile-entity-select ha-icon{position:absolute;top:50%;right:10px;transform:translateY(-50%);color:color-mix(in srgb,var(--entity-color) 72%,var(--primary-text-color));pointer-events:none;--mdc-icon-size:18px}@media (min-width:769px){.area-view .dd-generated-card-wrap.editing,.area-view .mobile-entities-section.layout-grid .dd-generated-card-wrap.editing{width:100%;min-width:0;flex:none;scroll-snap-align:none}.area-view .mobile-entities-section{gap:28px;margin-top:20px}.area-view .mobile-domain-group{min-width:0}.area-view .mobile-domain-header{padding:0;margin-bottom:12px}.area-view .mobile-layout-toggle{display:none}.area-view .mobile-domain-title{gap:0}.area-view .mobile-domain-title-label{font-size:20px}.area-view .mobile-domain-count{font-size:12px}.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{display:grid;grid-template-columns:repeat(auto-fill,minmax(178px,1fr));gap:14px;margin:0;padding:0;overflow:visible;scroll-padding:0;scroll-snap-type:none;align-items:stretch}.area-view .mobile-entity-card,.area-view .mobile-entities-section.layout-grid .mobile-entity-card{width:100%;min-width:0;min-height:152px;flex:none;padding:16px;border-radius:12px;scroll-snap-align:none}.area-view .mobile-entity-card:hover{transform:translateY(-1px);box-shadow:0 16px 32px rgba(15,23,42,0.08),inset 0 0 0 1px rgba(15,23,42,0.045)}.area-view .mobile-entity-card.has-inline-select{min-height:178px}.area-view .mobile-entity-icon,.area-view .mobile-entities-section.layout-grid .mobile-entity-icon{width:38px;height:38px;border-radius:11px}.area-view .mobile-entity-icon ha-icon{--mdc-icon-size:21px}.area-view .mobile-entity-name{font-size:15px}.area-view .mobile-entity-status{font-size:11px}.area-view .mobile-cover-actions,.area-view .mobile-entities-section.layout-grid .mobile-cover-actions{min-height:32px;padding:3px;gap:3px}.area-view .mobile-cover-action,.area-view .mobile-entities-section.layout-grid .mobile-cover-action{width:26px;height:26px}.area-view .mobile-cover-action ha-icon,.area-view .mobile-entities-section.layout-grid .mobile-cover-action ha-icon{--mdc-icon-size:16px}.area-view .mobile-entity-rail .dd-custom-card-wrap,.area-view .mobile-entity-rail .dd-domain-add-card,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail .dd-custom-card-wrap,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card{width:100%;min-width:0;flex:none;scroll-snap-align:none}.area-view .mobile-todo-list-card,.area-view .mobile-entities-section.layout-grid .mobile-todo-list-card{grid-column:1 / -1;width:100%;max-width:760px;min-width:0;flex:none;scroll-snap-align:none}}@media (min-width:1200px){.area-view .mobile-entity-rail,.area-view .mobile-entities-section.layout-grid .mobile-entity-rail{grid-template-columns:repeat(auto-fill,minmax(190px,1fr))}}.sidebar-divider{height:1px;background:var(--divider-color);margin:8px 12px}.dd-add-page{width:100%;box-sizing:border-box;margin-top:12px;display:inline-flex;align-items:center;gap:8px;padding:12px;border:1px dashed var(--divider-color);border-radius:10px;background:transparent;color:var(--secondary-text-color);cursor:pointer;font-size:14px;transition:background-color .2s ease,color .2s ease,border-color .2s ease}.dd-add-page:hover{color:var(--primary-color);border-color:var(--primary-color);background:rgba(var(--rgb-primary-color,3,169,244),.08)}.dd-add-page ha-icon{--mdc-icon-size:20px}.dd-page-card{margin-top:8px}.dd-page-card dwains-dashboard-next-card-host{display:block}.dd-custom-section{margin:12px 0;min-width:0}.dd-custom-section.after-domain{margin:12px 0 2px}.dd-custom-section.editing{padding:10px;border:1px dashed color-mix(in srgb,var(--primary-color) 28%,transparent);border-radius:12px;background:color-mix(in srgb,var(--primary-color) 4%,transparent)}.dd-custom-section.drag-over{border-color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary-color) 22%,transparent)}.dd-custom-slot-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px;color:color-mix(in srgb,var(--primary-text-color) 60%,transparent);font-size:12px;font-weight:800;line-height:1.2}.dd-custom-slot-title{display:inline-flex;align-items:center;gap:6px;min-width:0}.dd-custom-slot-title ha-icon{--mdc-icon-size:16px;color:var(--primary-color)}.dd-custom-slot-title span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dd-custom-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:8px;container-type:inline-size}.dd-custom-grid>.dd-custom-card-wrap,.dd-custom-grid>.dd-add-card{--dd-card-default-column:span 4;grid-column:var(--dd-card-grid-column,var(--dd-card-default-column));min-height:var(--dd-card-grid-min-height,0)}.dd-custom-card-wrap{position:relative;min-width:0;border-radius:12px}.dd-custom-card-wrap.editing{outline:1px solid color-mix(in srgb,var(--divider-color) 78%,transparent);outline-offset:2px;cursor:grab}.dd-generated-card-wrap{display:contents}.dd-generated-card-wrap.editing{position:relative;display:block;box-sizing:border-box;flex:0 0 164px;min-width:0;scroll-snap-align:start;cursor:grab;outline:1px dashed color-mix(in srgb,var(--primary-color) 38%,var(--divider-color));outline-offset:2px;border-radius:12px;transition:opacity 0.16s ease,outline-color 0.16s ease,transform 0.16s ease}.dd-generated-card-wrap.editing>.mobile-entity-card,.dd-generated-card-wrap.editing>.mobile-entity-replacement-card,.dd-generated-card-wrap.editing>.mobile-todo-list-card{width:100%;min-width:0;pointer-events:none}.dd-generated-card-wrap.editing.is-hidden>:not(.dd-generated-card-toolbar){opacity:0.38;filter:saturate(0.45)}.dd-generated-card-wrap.editing.dragging{opacity:0.42;cursor:grabbing}.dd-generated-card-wrap.editing.drag-over{outline-color:var(--primary-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--primary-color) 14%,transparent);transform:translateY(-2px)}.dd-generated-card-toolbar{position:absolute;top:7px;right:7px;z-index:6;display:flex;gap:4px;padding:3px;border-radius:999px;background:color-mix(in srgb,var(--card-background-color) 94%,transparent);box-shadow:0 2px 10px rgba(0,0,0,0.16);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}.dd-generated-card-toolbar button{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:transparent;color:var(--primary-text-color);cursor:pointer}.dd-generated-card-toolbar button:first-child{color:var(--primary-color);cursor:grab}.dd-generated-card-toolbar button:hover,.dd-generated-card-toolbar button:focus-visible{background:color-mix(in srgb,var(--primary-color) 12%,transparent);outline:none}.dd-generated-card-toolbar ha-icon{--mdc-icon-size:17px}.mobile-entities-section.layout-grid .dd-generated-card-wrap.editing{width:100%;min-width:0;flex:none;scroll-snap-align:none}.dd-custom-card-wrap.dragging{opacity:0.48;cursor:grabbing}.dd-custom-card-wrap.drag-over{outline-color:var(--primary-color);box-shadow:0 0 0 3px color-mix(in srgb,var(--primary-color) 12%,transparent)}.dd-card-toolbar{position:absolute;top:6px;right:6px;z-index:4;display:none;gap:4px}.dd-custom-card-wrap.editing .dd-card-toolbar{display:flex}.dd-card-toolbar button{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;border:none;cursor:pointer;background:var(--card-background-color);box-shadow:0 1px 4px rgba(0,0,0,.2);color:var(--primary-text-color)}.dd-card-toolbar button.del:hover{color:var(--error-color,#f44336)}.dd-card-toolbar ha-icon{--mdc-icon-size:18px}.dd-card-toolbar button.drag{cursor:grab;color:var(--primary-color)}.dd-card-toolbar button.drag:active{cursor:grabbing}.dd-add-card-inline,.dd-add-card{display:flex;align-items:center;justify-content:center;gap:8px;min-height:72px;width:100%;border:2px dashed var(--divider-color);border-radius:12px;background:transparent;cursor:pointer;color:var(--secondary-text-color);font-weight:600;font-size:.9rem;transition:border-color .2s ease,color .2s ease,background-color .2s ease}.dd-add-card:hover{border-color:var(--primary-color);color:var(--primary-color);background:rgba(var(--rgb-primary-color,3,169,244),.06)}.dd-add-card-inline{min-height:32px;width:auto;padding:0 12px;border-radius:999px;border-width:1px;font-size:12px;white-space:nowrap}.dd-add-card-inline ha-icon{--mdc-icon-size:16px}.dd-add-card ha-icon{--mdc-icon-size:22px}.dd-domain-add-card{min-height:72px;border-width:1px;background:color-mix(in srgb,var(--secondary-background-color) 54%,transparent);opacity:0.82}.dd-domain-add-card:hover,.dd-domain-add-card.drag-over{opacity:1;border-color:var(--primary-color);color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 8%,var(--card-background-color));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary-color) 18%,transparent)}.entities-grid .dd-custom-card-wrap,.entities-grid .dd-domain-add-card{min-width:0}.entities-grid>.dd-custom-card-wrap.dd-grid-full,.mobile-entities-section.layout-grid .mobile-entity-rail>.dd-custom-card-wrap.dd-grid-full{grid-column:1 / -1;width:100%}.mobile-entity-rail .dd-custom-card-wrap,.mobile-entity-rail .dd-domain-add-card{box-sizing:border-box;flex:0 0 164px;min-width:0;scroll-snap-align:start}.mobile-entity-rail>.dd-custom-card-wrap.dd-grid-full{flex-basis:calc(100% - 20px)}.mobile-entity-rail .dd-domain-add-card{min-height:128px}.mobile-entities-section.layout-grid .mobile-entity-rail .dd-custom-card-wrap,.mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card{width:100%;flex:none;scroll-snap-align:none}.mobile-entities-section.layout-grid .mobile-entity-rail .dd-domain-add-card{min-height:138px}@container (max-width:899px){.dd-custom-grid>.dd-custom-card-wrap,.dd-custom-grid>.dd-add-card{--dd-card-default-column:span 6}}@container (max-width:559px){.dd-custom-grid>.dd-custom-card-wrap,.dd-custom-grid>.dd-add-card{--dd-card-default-column:span 12}}.entity-card-wrapper.loading{background:var(--secondary-background-color);border-radius:8px;display:flex;align-items:center;justify-content:center}.skeleton{background:linear-gradient(90deg,var(--secondary-background-color) 25%,var(--primary-background-color) 50%,var(--secondary-background-color) 75%);background-size:200% 100%;animation:loading 1.5s infinite;border-radius:8px}@keyframes loading{0%{background-position:200% 0}100%{background-position:-200% 0}}@media (max-width:768px){.sidebar{position:fixed;right:0;top:0;width:280px;flex-basis:auto;height:100%;transform:translateX(100%);z-index:121;box-shadow:-4px 0 12px rgba(0,0,0,0.15)}.sidebar-resize-handle{display:none}.sidebar-collapse-toggle{display:none}.floor-areas{display:flex;flex-direction:column;gap:0}.area-button{margin-bottom:8px}.sidebar.open{transform:translateX(0)}.mobile-nav-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:120;opacity:0;pointer-events:none;transition:opacity 0.3s ease}.mobile-nav-overlay.open{opacity:1;pointer-events:auto}.global-header{padding:12px}.header-time{font-size:20px}.entities-grid{grid-template-columns:1fr}.global-header.mobile .header-expand-button[data-extra-count]::after{right:-8px}.mobile-home-section,.home-camera-section,.home-status-section,.home-todos-section,.home-custom-cards-section,.home-favorites-section,.home-summaries-section,.mobile-domain-group,.mobile-entities-section.layout-grid .mobile-entity-card{content-visibility:visible;contain-intrinsic-size:auto}}.dd-empty-state{max-width:420px;margin:32px auto;padding:24px 20px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;color:var(--secondary-text-color)}.area-view-missing{padding-top:48px}.dd-empty-state-icon{width:56px;height:56px;margin-bottom:4px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent)}.dd-empty-state-icon ha-icon{--mdc-icon-size:28px}.dd-empty-state-title{color:var(--primary-text-color);font-size:17px;font-weight:800;line-height:1.25}.dd-empty-state-text{font-size:14px;line-height:1.45}.dd-empty-state-actions{margin-top:10px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.dd-empty-state-button{appearance:none;min-height:36px;padding:0 14px;display:inline-flex;align-items:center;gap:6px;border:0;border-radius:999px;background:color-mix(in srgb,var(--primary-color) 12%,transparent);color:var(--primary-color);font:inherit;font-size:13px;font-weight:750;cursor:pointer;transition:background-color 0.18s ease,transform 0.18s ease}.dd-empty-state-button:hover{background:color-mix(in srgb,var(--primary-color) 18%,transparent)}.dd-empty-state-button:active{transform:scale(0.97)}.dd-empty-state-button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.dd-empty-state-button.primary{background:var(--primary-color);color:var(--text-primary-color,#ffffff)}.dd-empty-state-button ha-icon{--mdc-icon-size:18px}.home-no-areas{margin:0 0 36px;padding:16px;display:flex;align-items:center;gap:14px;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.home-no-areas-icon{width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:13px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent)}.home-no-areas-copy{min-width:0;flex:1 1 auto}.home-no-areas-title{color:var(--primary-text-color);font-size:15px;font-weight:800;line-height:1.2}.home-no-areas-text{margin-top:2px;color:var(--secondary-text-color);font-size:13px;line-height:1.35}.home-no-areas .dd-empty-state-button{flex:0 0 auto;padding:0 10px 0 14px}@media (max-width:768px){.home-no-areas{margin:0 8px 18px;flex-wrap:wrap}.home-no-areas-copy{flex:1 1 180px}.home-no-areas .dd-empty-state-button{margin-left:56px}}.favorites-section{margin-bottom:24px}.favorites-header{display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:18px;font-weight:500}.favorites-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}.favorite-card-wrapper{--favorite-color:var(--primary-color);appearance:none;position:relative;box-sizing:border-box;min-width:0;min-height:116px;padding:14px 14px 13px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;border:0;border-radius:9px;background:color-mix(in srgb,var(--card-background-color) 98%,#ffffff);color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer;box-shadow:0 12px 26px rgba(15,23,42,0.06),inset 0 0 0 1px rgba(15,23,42,0.035);transition:transform 0.18s ease,box-shadow 0.18s ease,background-color 0.18s ease}.favorite-card-wrapper:hover{transform:translateY(-2px);box-shadow:0 16px 30px rgba(15,23,42,0.1),inset 0 0 0 1px color-mix(in srgb,var(--favorite-color) 20%,transparent)}.favorite-card-wrapper:active{transform:scale(0.985)}.favorite-card-wrapper:focus-visible,.favorite-quick-action:focus-visible{outline:2px solid color-mix(in srgb,var(--favorite-color) 72%,#ffffff);outline-offset:3px}.favorite-card-wrapper.is-off,.favorite-card-wrapper.is-idle{--favorite-color:color-mix(in srgb,var(--secondary-text-color) 56%,var(--primary-color))}.favorite-card-wrapper.favorite-light{--favorite-color:#e1a129}.favorite-card-wrapper.favorite-switch{--favorite-color:#2f6fd6}.favorite-card-wrapper.favorite-cover{--favorite-color:#1494aa}.favorite-card-wrapper.favorite-binary_sensor,.favorite-card-wrapper.favorite-motion{--favorite-color:#df5b63}.favorite-card-wrapper.favorite-climate,.favorite-card-wrapper.favorite-weather{--favorite-color:#34a6d8}.favorite-card-wrapper.favorite-media_player{--favorite-color:#7c67c7}.favorite-card-wrapper.favorite-person{--favorite-color:#6d7891}.favorite-card-wrapper.favorite-sun{--favorite-color:#2d7eea}.favorite-top,.favorite-body{position:relative;z-index:1}.favorite-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.favorite-icon{width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:10px;color:var(--favorite-color);background:color-mix(in srgb,var(--favorite-color) 13%,transparent)}.favorite-icon ha-icon{--mdc-icon-size:19px}.favorite-quick-action{--toggle-track:color-mix(in srgb,var(--secondary-background-color) 80%,#ffffff);width:38px;height:22px;padding:0;display:inline-flex;align-items:center;justify-content:flex-start;flex:0 0 auto;border:0;border-radius:999px;color:transparent;background:var(--toggle-track);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.07),0 4px 10px rgba(15,23,42,0.08);font:inherit;cursor:pointer;transition:transform 0.18s ease,background-color 0.18s ease}.favorite-quick-action::before{content:"";width:18px;height:18px;margin-left:2px;border-radius:999px;background:#ffffff;box-shadow:0 2px 7px rgba(15,23,42,0.2);transition:transform 0.18s ease,background-color 0.18s ease}.favorite-card-wrapper.is-active .favorite-quick-action{background:var(--favorite-color)}.favorite-card-wrapper.is-active .favorite-quick-action::before{transform:translateX(16px)}.favorite-card-wrapper.info-only .favorite-quick-action{width:30px;height:30px;justify-content:center;color:color-mix(in srgb,var(--primary-text-color) 52%,transparent);background:color-mix(in srgb,var(--secondary-background-color) 70%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,0.05)}.favorite-card-wrapper.info-only .favorite-quick-action::before{display:none}.favorite-card-wrapper.info-only .favorite-quick-action ha-icon{display:block;--mdc-icon-size:17px}.favorite-quick-action ha-icon{display:none}.favorite-quick-action:active{transform:scale(0.94)}.favorite-name{color:inherit;margin-top:2px;font-size:14px;font-weight:850;line-height:1.08;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.favorite-state{margin-top:0;color:color-mix(in srgb,var(--primary-text-color) 58%,transparent);font-size:11px;font-weight:750;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.favorite-area{margin-top:0;color:color-mix(in srgb,var(--primary-text-color) 46%,transparent);font-size:11px;font-weight:750;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host([data-theme-dark]){.favorite-card-wrapper{background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 90%,#ffffff 4%),color-mix(in srgb,var(--card-background-color) 98%,#000000 3%));box-shadow:0 14px 30px rgba(0,0,0,0.28),inset 0 1px 0 rgba(255,255,255,0.045),inset 0 0 0 1px rgba(255,255,255,0.045)}.favorite-card-wrapper:hover{box-shadow:0 18px 34px rgba(0,0,0,0.36),inset 0 0 0 1px color-mix(in srgb,var(--favorite-color) 30%,transparent)}.favorite-quick-action{--toggle-track:rgba(255,255,255,0.14);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.08),0 5px 12px rgba(0,0,0,0.28)}.favorite-card-wrapper.info-only .favorite-quick-action{background:rgba(255,255,255,0.1);color:rgba(248,250,252,0.82)}}.notifications-overlay{position:fixed;inset:0;z-index:1040;opacity:0;pointer-events:none;background:rgba(0,0,0,0.42);backdrop-filter:blur(2px);transition:opacity 0.22s ease}.notifications-overlay.open{opacity:1;pointer-events:auto}.notifications-panel{position:fixed;left:50%;top:50%;z-index:1041;width:min(520px,calc(100vw - 48px));max-height:min(78vh,620px);display:flex;flex-direction:column;overflow:hidden;border-radius:8px;border:1px solid rgba(15,23,42,0.08);background:color-mix(in srgb,var(--card-background-color) 96%,transparent);box-shadow:0 24px 60px rgba(15,23,42,0.28);backdrop-filter:blur(22px);transform:translate3d(-50%,-46%,0) scale(0.96);opacity:0;pointer-events:none;transition:transform 0.28s cubic-bezier(0.2,0.8,0.2,1),opacity 0.2s ease}.notifications-panel.open{transform:translate3d(-50%,-50%,0) scale(1);opacity:1;pointer-events:auto}.notifications-panel::before{content:"";width:42px;height:4px;margin:10px auto 2px;flex:0 0 auto;border-radius:999px;background:rgba(0,0,0,0.14)}.notifications-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 14px 10px;border-bottom:1px solid rgba(15,23,42,0.08)}.notifications-title{min-width:0}.notifications-title-row{display:flex;align-items:center;gap:8px;color:var(--primary-text-color);font-size:16px;font-weight:850;line-height:1.15}.notifications-title-row ha-icon{color:var(--primary-color);--mdc-icon-size:20px}.notifications-subtitle{margin-top:3px;color:var(--secondary-text-color);font-size:12px;font-weight:600;line-height:1.2}.notifications-actions{display:flex;align-items:center;gap:6px;flex:0 0 auto}.notifications-icon-button,.notification-dismiss{border:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;color:var(--primary-text-color);background:var(--secondary-background-color);-webkit-tap-highlight-color:transparent}.notifications-icon-button{width:34px;height:34px}.notifications-icon-button ha-icon{--mdc-icon-size:18px}.notifications-list{overflow-y:auto;padding:10px}.notification-row{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:10px;align-items:start;padding:11px 10px;margin-bottom:8px;border:1px solid rgba(15,23,42,0.06);border-radius:8px;background:rgba(255,255,255,0.78);box-shadow:0 8px 20px rgba(15,23,42,0.06)}.notification-row:last-child{margin-bottom:0}.notification-icon{width:38px;height:38px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(var(--rgb-primary-color,3,169,244),0.11);color:var(--primary-color)}.notification-icon ha-icon{--mdc-icon-size:21px}.notification-title{color:var(--primary-text-color);font-size:14px;font-weight:800;line-height:1.2;overflow-wrap:anywhere}.notification-message{margin-top:4px;color:var(--secondary-text-color);font-size:13px;line-height:1.35;white-space:pre-wrap;overflow-wrap:anywhere}.notification-markdown{display:block;white-space:normal}.notification-date{margin-top:7px;color:color-mix(in srgb,var(--secondary-text-color) 74%,transparent);font-size:11px;font-weight:650}.notification-dismiss{width:32px;height:32px;color:var(--secondary-text-color);background:rgba(0,0,0,0.05)}.notification-dismiss ha-icon{--mdc-icon-size:17px}.notifications-empty,.notifications-error,.notifications-loading{min-height:130px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px 18px;color:var(--secondary-text-color);text-align:center;font-size:13px;font-weight:600}.notifications-empty ha-icon,.notifications-error ha-icon,.notifications-loading ha-icon{--mdc-icon-size:28px;color:var(--primary-color)}@media (max-width:1024px){.notifications-panel{top:auto;bottom:calc(18px + env(safe-area-inset-bottom,0px));width:min(460px,calc(100vw - 28px));max-height:min(70vh,620px);transform:translate3d(-50%,calc(100% + 48px),0)}.notifications-panel.open{transform:translate3d(-50%,0,0)}}.global-header.expanded{border-bottom:2px solid var(--primary-color);box-shadow:0 4px 12px rgba(0,0,0,0.1)}.header-expanded-content{background:var(--card-background-color);padding:16px;border-top:1px solid var(--divider-color);animation:slideDown 0.3s ease-out}@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}.header-expanded-content .header-favorites{max-width:100%}.favorites-section{width:100%}.favorites-header{display:flex;align-items:center;gap:8px;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--divider-color)}.favorites-header ha-icon{--mdc-icon-size:20px;color:var(--primary-color)}.favorites-header h3{margin:0;font-size:16px;font-weight:500;color:var(--primary-text-color)}.favorites-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;width:100%}.favorite-tile-wrapper{width:100%;min-height:60px}.favorite-tile{width:100% !important;height:auto !important}.no-favorites{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;color:var(--secondary-text-color);background:var(--secondary-background-color);border-radius:8px;border:1px dashed var(--divider-color)}.no-favorites ha-icon{--mdc-icon-size:32px;margin-bottom:8px;opacity:0.6}.no-favorites p{margin:0;font-size:14px}.header-expand-button{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);width:40px;height:40px;border-radius:50%;border:2px solid var(--primary-color);background:var(--card-background-color);color:var(--primary-color);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,0.1)}.header-expand-button:hover{background:var(--primary-color);color:var(--text-primary-color);transform:translateX(-50%) translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.2)}.header-expand-button ha-icon{--mdc-icon-size:20px;transition:transform 0.3s ease}.global-header.expanded .header-expand-button{bottom:-20px}@media (max-width:768px){.header-expanded-content{padding:12px}.favorites-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.header-expand-button{width:36px;height:36px;bottom:-18px}.header-expand-button ha-icon{--mdc-icon-size:18px}}.home-status-card,.status-card-compact{--status-color:var(--primary-color);--status-bg:color-mix(in srgb,var(--status-color) 16%,transparent)}.home-status-card.cover,.status-card-compact.cover{--status-color:#1494aa}.home-status-card.binary_sensor,.home-status-card.motion,.status-card-compact.binary_sensor,.status-card-compact.motion{--status-color:#df5b63}.home-status-card.light,.status-card-compact.light{--status-color:#e1a129}.home-status-card.switch,.status-card-compact.switch{--status-color:#2f6fd6}.home-status-card.climate,.home-status-card.house-climate-card,.status-card-compact.climate{--status-color:#34a6d8}.home-status-card.person,.status-card-compact.person{--status-color:#6d7891}.home-status-card.media_player,.status-card-compact.media_player{--status-color:#7c67c7}.home-status-card.fan,.status-card-compact.fan{--status-color:#2b8fcb}.home-status-card.wattage,.home-status-card.house-power-card,.home-status-card.energy,.status-card-compact.wattage,.status-card-compact.energy{--status-color:#d88e20}.home-status-grid{grid-template-columns:repeat(auto-fill,minmax(150px,170px));justify-content:start;gap:12px}.home-status-card{min-height:134px;display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;padding:16px;border-radius:8px;border:1px solid rgba(0,0,0,0.08);background:var(--card-background-color);text-align:left;box-shadow:0 8px 24px rgba(0,0,0,0.08)}.home-status-card::before{top:auto;left:16px;right:16px;bottom:0;height:3px;border-radius:3px 3px 0 0;background:var(--status-color);opacity:0.55}.home-status-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--status-color) 40%,transparent);box-shadow:0 14px 30px rgba(0,0,0,0.12)}.home-status-card:hover::before{opacity:0.85}.home-status-card .status-card-icon{width:48px;height:48px;margin:0 0 16px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:var(--status-bg)}.home-status-card .status-card-icon ha-icon{--mdc-icon-size:25px;color:var(--status-color);transform:none}.home-status-card:hover .status-card-icon ha-icon{transform:none}.home-status-card .status-card-badge{top:-8px;right:-8px;width:auto;min-width:24px;height:24px;padding:0 7px;border-radius:999px;background:var(--status-color);color:#fff;font-size:12px;font-weight:800;box-shadow:0 5px 12px color-mix(in srgb,var(--status-color) 28%,transparent)}.home-status-card .status-card-title{margin:auto 0 0;color:var(--primary-text-color);font-size:16px;font-weight:800;line-height:1.15;text-align:left}.home-status-card.has-value .status-card-title{margin-top:2px;color:var(--secondary-text-color);font-size:12px;font-weight:800}.home-status-card .status-card-value{margin:auto 0 0;color:var(--primary-text-color);font-size:22px;font-weight:900;line-height:1;letter-spacing:0;white-space:nowrap}.home-status-card.house-persons-card{--status-color:#182044;grid-column:span 2;min-width:240px;gap:12px}.home-status-card.house-power-card{--status-color:#d88e20;grid-column:span 2;min-width:270px;gap:12px}.home-status-card.house-climate-card{--status-color:#34a6d8;grid-column:span 2;min-width:270px;gap:12px}.house-persons-head{width:100%;display:flex;align-items:center;gap:10px}.home-status-card.house-persons-card .house-persons-icon,.home-status-card.house-climate-card .house-climate-icon,.home-status-card.house-power-card .house-power-icon{width:42px;height:42px;margin:0;flex:0 0 auto;border-radius:13px}.house-persons-copy,.house-climate-copy,.house-power-copy{min-width:0;text-align:left}.house-persons-title,.house-climate-title,.house-power-title{color:var(--primary-text-color);font-size:15px;font-weight:850;line-height:1.1}.house-persons-subtitle,.house-persons-empty,.house-climate-subtitle,.house-power-subtitle,.house-power-empty{color:var(--secondary-text-color);font-size:12px;font-weight:700;line-height:1.25}.house-climate-head{width:100%;display:flex;align-items:center;gap:10px}.house-climate-grid{width:100%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.house-climate-metric{min-width:0;min-height:48px;padding:8px 9px;border:0;border-radius:12px;display:grid;grid-template-columns:26px minmax(0,1fr);align-items:center;column-gap:8px;background:color-mix(in srgb,var(--metric-color) 12%,var(--card-background-color));color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--metric-color) 14%,transparent);transition:transform 0.18s ease,background-color 0.18s ease}.house-climate-metric:active{transform:scale(0.97)}.house-climate-metric-icon{width:26px;height:26px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--metric-color) 18%,transparent);color:var(--metric-color)}.house-climate-metric-icon ha-icon{--mdc-icon-size:16px}.house-climate-metric-copy{min-width:0;display:flex;flex-direction:column;gap:1px}.house-climate-metric-value,.house-climate-metric-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.1}.house-climate-metric-value{font-size:14px;font-weight:900;color:var(--primary-text-color)}.house-climate-metric-label{font-size:11px;font-weight:750;color:var(--secondary-text-color)}.house-power-head{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px}.house-power-total{color:var(--primary-text-color);font-size:22px;font-weight:950;line-height:1;white-space:nowrap}.house-power-list{width:100%;display:grid;gap:7px}.house-power-room{display:grid;grid-template-columns:26px minmax(0,1fr) auto;align-items:center;column-gap:8px;row-gap:4px}.house-power-room-icon{width:26px;height:26px;grid-row:span 2;display:inline-flex;align-items:center;justify-content:center;border-radius:9px;background:color-mix(in srgb,var(--status-color) 12%,transparent);color:var(--status-color)}.house-power-room-icon ha-icon{--mdc-icon-size:16px}.house-power-room-name,.house-power-room-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.1}.house-power-room-name{color:var(--primary-text-color);font-size:11px;font-weight:850}.house-power-room-value{color:var(--secondary-text-color);font-size:11px;font-weight:800}.house-power-bar{position:relative;height:5px;grid-column:2 / -1;overflow:hidden;border-radius:999px;background:color-mix(in srgb,var(--status-color) 10%,var(--secondary-background-color))}.house-power-bar-fill{position:absolute;inset:0 auto 0 0;width:var(--power-width,0%);min-width:4px;border-radius:inherit;background:linear-gradient(90deg,#d88e20,#f4c34d)}.house-persons-grid{width:100%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.house-person-mini{appearance:none;min-width:0;min-height:42px;padding:6px;display:flex;align-items:center;gap:7px;border:0;border-radius:12px;background:color-mix(in srgb,var(--primary-background-color) 78%,var(--card-background-color));color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer;transition:background-color 0.18s ease,transform 0.18s ease}.house-person-mini:active{transform:scale(0.97)}.house-person-mini.is-home{background:color-mix(in srgb,#2f9b62 13%,var(--card-background-color))}.house-person-mini.is-away{background:color-mix(in srgb,#df5b63 10%,var(--card-background-color))}.house-person-avatar{width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;overflow:hidden;border-radius:999px;background:color-mix(in srgb,var(--status-color) 12%,transparent);color:var(--status-color)}.house-person-avatar img{width:100%;height:100%;object-fit:cover}.house-person-avatar ha-icon{--mdc-icon-size:16px}.house-person-mini-copy{min-width:0;display:flex;flex-direction:column;gap:1px}.house-person-mini-name,.house-person-mini-state{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.house-person-mini-name{color:var(--primary-text-color);font-size:11px;font-weight:850;line-height:1.1}.house-person-mini-state{color:var(--secondary-text-color);font-size:11px;font-weight:700;line-height:1.1}.house-person-mini.is-unknown .house-person-avatar{opacity:0.6;filter:grayscale(1)}.house-person-mini.is-unknown .house-person-mini-state{color:var(--disabled-text-color,var(--secondary-text-color));font-style:italic}.house-persons-more{appearance:none;min-width:0;min-height:42px;padding:6px;display:flex;align-items:center;justify-content:center;border:0;border-radius:12px;background:color-mix(in srgb,var(--status-color) 10%,var(--card-background-color));color:var(--primary-text-color);font:inherit;font-size:13px;font-weight:850;cursor:pointer;transition:transform 0.18s ease}.house-persons-more:active{transform:scale(0.97)}.house-persons-more:focus-visible,.house-person-mini:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}:host([data-theme-dark]){.home-status-card.house-persons-card{--status-color:#8ea8ff}.home-status-card.house-power-card{--status-color:#f2b447}.home-status-card.house-climate-card{--status-color:#64c8e8}.house-person-mini{background:color-mix(in srgb,var(--card-background-color) 78%,#ffffff 5%);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.04)}.house-person-mini.is-home{background:color-mix(in srgb,#2f9b62 20%,var(--card-background-color))}.house-person-mini.is-away{background:color-mix(in srgb,#df5b63 16%,var(--card-background-color))}.house-persons-more{background:color-mix(in srgb,var(--status-color) 16%,var(--card-background-color))}}.header-status-scroll{gap:10px;padding:2px 2px 4px}.status-card-compact{flex:0 0 auto;min-width:92px;max-width:150px;min-height:70px;align-items:flex-start;justify-content:flex-start;padding:7px 12px 9px;border-radius:8px;border:1px solid rgba(0,0,0,0.08);background:var(--card-background-color);box-shadow:0 3px 12px rgba(0,0,0,0.05)}.status-card-compact:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--status-color) 36%,transparent);box-shadow:0 8px 18px rgba(0,0,0,0.1)}.status-card-compact .status-card-icon-compact{width:36px;height:36px;border-radius:8px;background:var(--status-bg)}.status-card-compact .status-card-icon-compact ha-icon{--mdc-icon-size:20px;color:var(--status-color)}.status-card-compact .status-card-badge-compact{top:-7px;right:-8px;min-width:22px;height:22px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:var(--status-color);color:#fff;font-size:11px;font-weight:800;box-shadow:0 4px 10px color-mix(in srgb,var(--status-color) 26%,transparent)}.status-card-compact .status-card-title-compact{width:100%;margin-top:5px;color:var(--secondary-text-color);font-size:11px;font-weight:800;line-height:1.15;text-align:left;opacity:1;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.status-card-compact.has-value .status-card-title-compact{color:var(--primary-text-color);font-size:13px;font-weight:900;white-space:nowrap;display:block}.status-card-subtitle-compact{width:100%;margin-top:1px;color:var(--secondary-text-color);font-size:11px;font-weight:750;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}@media (max-width:768px){.home-status-grid{display:flex;grid-template-columns:none;gap:10px;margin:0;padding:2px 18px 16px;overflow-x:auto;scroll-padding:18px;scroll-snap-type:x proximity;scrollbar-width:none}.home-camera-section{margin:0 -10px 18px}.home-camera-section .home-status-heading{display:none}.home-summaries-section{margin:0 -10px 18px}.home-summaries-section .home-status-heading{display:none}.home-todos-section{margin:0 -10px 18px}.home-todos-section .home-status-heading{display:none}.home-todos-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:10px;padding:2px 18px 16px}.home-custom-cards-section{min-width:0;margin:0 -10px 18px}.home-custom-cards-section .home-status-heading{display:none}.home-custom-cards-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:10px;padding:2px 18px 16px}.home-scenes-section{min-width:0;margin:0 -10px 18px}.home-scenes-list{flex-wrap:nowrap;gap:8px;padding:2px 18px 16px;overflow-x:auto;scroll-padding:18px;scroll-snap-type:x proximity;scrollbar-width:none}.home-scenes-list::-webkit-scrollbar{display:none}.home-scenes-section.layout-grid .home-scenes-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));overflow:visible;scroll-snap-type:none}.home-scene-chip{flex:0 0 auto;max-width:220px;border-radius:14px;scroll-snap-align:start}.home-scenes-section.layout-grid .home-scene-chip{width:100%;max-width:none;scroll-snap-align:none}.home-summary-list{width:auto;display:flex;flex-direction:column;padding:2px 18px 16px;gap:8px}.home-summary-card{min-height:64px;padding:11px 12px;border-radius:14px}.home-summary-icon{width:36px;height:36px}.home-camera-grid{display:flex;grid-template-columns:none;gap:10px;padding:2px 18px 16px;overflow-x:auto;scroll-padding:18px;scroll-snap-type:x proximity;scrollbar-width:none}.home-camera-grid::-webkit-scrollbar{display:none}.home-camera-section.layout-grid .home-camera-grid{display:grid;grid-template-columns:1fr;gap:10px;padding:2px 18px 16px;overflow:visible;scroll-snap-type:none}.home-camera-card{flex:0 0 226px;min-height:146px;border-radius:18px;scroll-snap-align:start;box-shadow:0 12px 28px rgba(15,23,42,0.11)}.home-camera-section.layout-grid .home-camera-card{width:100%;flex:none;scroll-snap-align:none}.home-camera-content{min-height:146px;padding:13px}.home-camera-name{font-size:16px}.home-status-grid::-webkit-scrollbar{display:none}.home-status-card{flex:0 0 126px;min-height:114px;padding:14px;border-radius:16px;scroll-snap-align:start;box-shadow:0 10px 26px rgba(15,23,42,0.08)}.home-status-card.house-persons-card{flex:0 0 230px;min-height:132px;padding:14px}.home-status-card.house-power-card{flex:0 0 250px;min-height:132px;padding:14px}.home-status-card.house-climate-card{flex:0 0 250px;min-height:132px;padding:14px}.home-status-card .status-card-title{font-size:15px}.status-card-compact{min-width:88px}.home-view{max-width:none}.person-cards-section{display:none}.home-status-heading{display:none}.mobile-home-section{display:block;margin:0 -10px 18px}.mobile-section-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 18px;margin-bottom:10px}.mobile-section-title{min-width:0;display:inline-flex;align-items:center;gap:8px}.mobile-section-title-label{color:var(--primary-text-color);font-size:16px;font-weight:850;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mobile-section-action{appearance:none;min-width:66px;height:28px;padding:0 10px 0 12px;display:inline-flex;align-items:center;justify-content:center;gap:3px;border:0;border-radius:999px;background:color-mix(in srgb,var(--primary-color) 12%,transparent);color:var(--primary-color);font-size:12px;font-weight:850;font:inherit;cursor:pointer;transition:background-color 0.18s ease,transform 0.18s ease}.mobile-section-action ha-icon{--mdc-icon-size:15px}.mobile-section-action:active{transform:scale(0.96);background:color-mix(in srgb,var(--primary-color) 18%,transparent)}.mobile-area-rail{display:flex;gap:10px;padding:2px 18px 16px;overflow-x:auto;scroll-padding:18px;scroll-snap-type:x proximity;scrollbar-width:none}.mobile-area-rail::-webkit-scrollbar{display:none}.mobile-home-section.layout-grid .mobile-area-rail{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:2px 18px 16px;overflow:visible;scroll-snap-type:none}.mobile-area-card{appearance:none;position:relative;box-sizing:border-box;flex:0 0 152px;min-width:0;min-height:130px;padding:13px;display:flex;flex-direction:column;align-items:stretch;justify-content:space-between;overflow:hidden;border:1px solid color-mix(in srgb,var(--primary-text-color) 8%,transparent);border-radius:18px;background:color-mix(in srgb,var(--card-background-color) 96%,var(--primary-background-color));color:var(--primary-text-color);font:inherit;box-shadow:0 12px 28px color-mix(in srgb,var(--primary-text-color) 8%,transparent);text-align:left;scroll-snap-align:start;cursor:pointer;transition:transform 0.18s ease,border-color 0.18s ease,box-shadow 0.18s ease}.mobile-home-section.layout-grid .mobile-area-card{width:100%;flex:none;scroll-snap-align:none}@media (max-width:380px){.mobile-home-section.layout-grid .mobile-area-rail{grid-template-columns:1fr}}.mobile-area-card:active{transform:scale(0.98)}.mobile-area-card.has-picture{min-height:146px;color:var(--mobile-area-picture-text-color,#ffffff);border-color:rgba(255,255,255,0.16);background:#182044;--mobile-area-picture-text-color:#ffffff;--mobile-area-picture-muted-text-color:rgba(255,255,255,0.76);--mobile-area-picture-text-shadow:0 2px 10px rgba(0,0,0,0.62);--mobile-area-picture-overlay:linear-gradient(180deg,rgba(12,18,32,0.03) 0%,rgba(12,18,32,0.18) 42%,rgba(12,18,32,0.82) 100%),linear-gradient(90deg,rgba(12,18,32,0.18),rgba(12,18,32,0.04))}.mobile-area-card.has-picture.text-dark{--mobile-area-picture-text-color:#ffffff;--mobile-area-picture-muted-text-color:rgba(255,255,255,0.76);--mobile-area-picture-text-shadow:0 2px 10px rgba(0,0,0,0.62);--mobile-area-picture-overlay:linear-gradient(180deg,rgba(12,18,32,0.03) 0%,rgba(12,18,32,0.18) 42%,rgba(12,18,32,0.82) 100%),linear-gradient(90deg,rgba(12,18,32,0.18),rgba(12,18,32,0.04))}.mobile-area-picture{position:absolute;inset:0;z-index:0;background-size:cover;background-position:center;transform:scale(1.02)}.mobile-area-card.has-picture::after{content:"";position:absolute;inset:0;z-index:1;background:var(--mobile-area-picture-overlay)}.mobile-area-top,.mobile-area-copy{position:relative;z-index:2}.mobile-area-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.mobile-area-icon{width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:13px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 13%,transparent)}.mobile-area-icon ha-icon{--mdc-icon-size:22px}.mobile-area-card.has-picture .mobile-area-icon{color:var(--mobile-area-picture-text-color,#ffffff);background:rgba(255,255,255,0.18);backdrop-filter:blur(12px)}.mobile-area-badges{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px;min-width:0}.mobile-area-badge{min-width:24px;height:24px;padding:0 7px;display:inline-flex;align-items:center;justify-content:center;gap:4px;border-radius:999px;color:var(--area-badge-color,var(--primary-color));background:color-mix(in srgb,var(--area-badge-color,var(--primary-color)) 12%,transparent);font-size:11px;font-weight:850}.mobile-area-card.has-picture .mobile-area-badge{color:var(--area-badge-color,var(--primary-color));background:color-mix(in srgb,var(--area-badge-color,var(--primary-color)) 18%,rgba(255,255,255,0.88));backdrop-filter:blur(12px);box-shadow:0 4px 12px rgba(15,23,42,0.16)}.mobile-area-badge ha-icon{--mdc-icon-size:14px}.mobile-area-badge.light{--area-badge-color:#e1a129}.mobile-area-badge.cover{--area-badge-color:#1494aa}.mobile-area-badge.motion{--area-badge-color:#df5b63}.mobile-area-name{font-size:15px;font-weight:850;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mobile-area-meta{margin-top:4px;color:color-mix(in srgb,var(--primary-text-color) 54%,transparent);font-size:12px;font-weight:700;line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mobile-area-card.has-picture .mobile-area-meta{color:var(--mobile-area-picture-muted-text-color,rgba(255,255,255,0.72))}.mobile-area-card.has-picture .mobile-area-name,.mobile-area-card.has-picture .mobile-area-meta{text-shadow:var(--mobile-area-picture-text-shadow)}.mobile-area-card.has-picture.text-dark .mobile-area-icon{color:var(--mobile-area-picture-text-color,#ffffff);background:rgba(255,255,255,0.18)}.mobile-area-card.has-picture.text-dark .mobile-area-name,.mobile-area-card.has-picture.text-dark .mobile-area-meta{text-shadow:var(--mobile-area-picture-text-shadow)}.home-status-section{margin:0 -10px 18px}.home-status-section .mobile-section-heading{margin-bottom:10px}.home-status-section.layout-grid .home-status-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:2px 18px 16px;overflow:visible;scroll-snap-type:none}.home-status-section.layout-grid .home-status-card{width:100%;min-width:0;box-sizing:border-box;flex:none;scroll-snap-align:none}.home-status-section.layout-grid .house-persons-card,.home-status-section.layout-grid .house-climate-card,.home-status-section.layout-grid .house-power-card{grid-column:1 / -1}@media (max-width:380px){.home-status-section.layout-grid .home-status-grid{grid-template-columns:1fr}}.home-status-card::before{left:14px;right:14px}.home-status-card .status-card-icon{width:42px;height:42px;border-radius:13px;margin-bottom:16px}.home-status-card .status-card-icon ha-icon{--mdc-icon-size:22px}.home-status-card .status-card-badge{min-width:23px;height:23px;top:-8px;right:-9px}:host([data-theme-dark]){.home-welcome{background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 90%,var(--primary-color) 7%) 0%,color-mix(in srgb,var(--card-background-color) 92%,var(--primary-background-color)) 100%);box-shadow:0 14px 36px rgba(0,0,0,0.34),inset 0 -1px 0 rgba(255,255,255,0.04)}.welcome-avatar{box-shadow:0 10px 22px rgba(0,0,0,0.34),0 0 0 3px rgba(255,255,255,0.08)}.welcome-action{background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 84%,#ffffff 8%),color-mix(in srgb,var(--card-background-color) 94%,#000000 6%));box-shadow:0 10px 24px rgba(0,0,0,0.28),inset 0 1px 0 rgba(255,255,255,0.08),inset 0 0 0 1px rgba(255,255,255,0.1)}.mobile-area-card{background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 88%,#ffffff 4%),color-mix(in srgb,var(--card-background-color) 96%,#000000 4%));border-color:rgba(255,255,255,0.08);box-shadow:0 12px 28px rgba(0,0,0,0.26),inset 0 1px 0 rgba(255,255,255,0.04)}.mobile-area-card:not(.has-picture) .mobile-area-icon{background:color-mix(in srgb,var(--primary-color) 22%,transparent)}.mobile-area-badge{background:color-mix(in srgb,var(--area-badge-color,var(--primary-color)) 20%,transparent)}.house-climate-metric{background:color-mix(in srgb,var(--metric-color) 18%,var(--card-background-color));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--metric-color) 18%,transparent)}.house-power-room-icon{background:color-mix(in srgb,var(--status-color) 20%,transparent)}.house-power-bar{background:color-mix(in srgb,var(--status-color) 13%,var(--card-background-color))}.home-summary-card{background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 88%,#ffffff 4%),color-mix(in srgb,var(--card-background-color) 96%,#000000 4%));border-color:rgba(255,255,255,0.08);box-shadow:0 12px 26px rgba(0,0,0,0.24),inset 0 1px 0 rgba(255,255,255,0.04)}.home-summary-icon{background:color-mix(in srgb,var(--summary-color) 20%,transparent)}}.home-favorites-section{box-sizing:border-box;width:100%;max-width:100%;margin:0 -10px 44px;padding:0;overflow-x:clip}.home-favorites-section .favorites-header{display:none}.home-favorites-section .mobile-section-heading{margin-bottom:10px}.home-favorites-section .favorites-grid{display:flex;grid-template-columns:none;gap:10px;padding:2px 18px 0;overflow-x:auto;scroll-padding:18px;scroll-snap-type:x proximity;scrollbar-width:none}.home-favorites-section .favorites-grid::-webkit-scrollbar{display:none}.home-favorites-section.layout-grid .favorites-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));overflow:visible;scroll-snap-type:none}.home-favorites-section .favorite-card-wrapper{flex:0 0 186px;width:auto;min-width:0;box-sizing:border-box;min-height:116px;padding:14px;border-radius:16px;scroll-snap-align:start}.home-favorites-section.layout-grid .favorite-card-wrapper{width:100%;flex:none;scroll-snap-align:none}@media (max-width:380px){.home-favorites-section.layout-grid .favorites-grid{grid-template-columns:1fr}}}@media (max-width:768px){:host{height:auto;max-height:none;min-height:100%;overflow:visible}.layout-container{display:block;height:auto;max-height:none;min-height:100dvh;overflow:visible}.main-content{display:block;min-height:100dvh;overflow:visible}.content-area{padding:0;height:auto;max-height:none;min-height:100dvh;overflow:visible;overscroll-behavior:auto;-webkit-overflow-scrolling:auto;background:linear-gradient(180deg,color-mix(in srgb,var(--primary-color) 5%,var(--primary-background-color)) 0%,var(--primary-background-color) 150px)}.content-area.home-content-area{padding-bottom:0}.content-area.area-content-area{padding:0 10px calc(128px + env(safe-area-inset-bottom,0px))}.content-area.settings-content-area{padding:0}.home-view{padding:10px 10px calc(128px + env(safe-area-inset-bottom,0px))}.settings-page-view{--dd-settings-bar-bottom:calc(82px + env(safe-area-inset-bottom,0px));width:100%;margin:0;padding:8px 10px calc(152px + env(safe-area-inset-bottom,0px))}.settings-page-header{gap:12px;margin:0 0 12px;padding:12px 14px;border-radius:18px;border-top:1px solid color-mix(in srgb,var(--divider-color) 72%,transparent);box-shadow:0 10px 28px rgba(15,23,42,0.07)}.settings-page-back{width:42px;height:42px}.settings-page-title h1{font-size:21px}.settings-page-title p{margin-top:3px;font-size:13px}.settings-page-editor{border-radius:18px;box-shadow:0 10px 30px rgba(15,23,42,0.06)}.settings-save-bar{position:fixed;left:10px;right:10px;bottom:var(--dd-settings-bar-bottom);z-index:110;margin:0;padding:6px 6px 6px 14px}.global-header.mobile{margin:-10px -10px 0;padding:12px 14px 22px;border-bottom:0;border-radius:0 0 8px 8px;background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 98%,transparent) 0%,color-mix(in srgb,var(--primary-color) 5%,var(--card-background-color)) 100%);box-shadow:0 10px 26px rgba(15,23,42,0.08)}.global-header.mobile .header-content{display:block}.global-header.mobile .header-status-section{width:100%}.global-header.mobile .header-status-scroll{gap:10px;padding:2px 2px 4px;scroll-padding:14px}.global-header.mobile .status-card-compact{min-width:112px;min-height:82px;padding:10px 12px 11px;border-radius:8px;border:1px solid rgba(15,23,42,0.08);background:rgba(255,255,255,0.92);box-shadow:0 8px 22px rgba(15,23,42,0.08)}.global-header.mobile .status-card-compact .status-card-icon-compact{width:40px;height:40px;border-radius:8px}.global-header.mobile .status-card-compact .status-card-title-compact{margin-top:7px;color:color-mix(in srgb,var(--primary-text-color) 76%,transparent);font-size:12px;line-height:1.15}.global-header.mobile .header-expand-button{bottom:-18px;width:36px;height:36px;border-width:2px;background:rgba(255,255,255,0.96);box-shadow:0 8px 20px rgba(3,169,244,0.18)}.area-view .entities-section,.area-view .dd-custom-section{position:relative;z-index:2}.area-view .entities-section{display:none}.mobile-area-overview{display:block;position:relative;z-index:2;margin:12px 0 20px}.mobile-entities-section{display:grid;position:relative;z-index:2}.layout-container>.sidebar,.sidebar{position:fixed !important;left:18px !important;right:18px !important;top:auto !important;bottom:calc(82px + env(safe-area-inset-bottom,0px)) !important;width:auto !important;height:auto !important;max-height:min(62vh,520px);padding:10px;overflow-y:auto;border-radius:8px;border:1px solid rgba(0,0,0,0.08);background:rgba(255,255,255,0.94);box-shadow:0 22px 48px rgba(0,0,0,0.24);backdrop-filter:blur(20px);transform:translate3d(0,calc(100% + 140px),0) !important;transition:transform 0.28s cubic-bezier(0.2,0.8,0.2,1);z-index:121}.layout-container>.sidebar.open,.sidebar.open{transform:translate3d(0,0,0) !important}.sidebar::before{content:"";width:42px;height:4px;margin:0 auto 10px;display:block;border-radius:999px;background:rgba(0,0,0,0.14)}.sidebar .area-list{padding:0}.sidebar .floor-section{margin-bottom:12px}.sidebar .floor-header{padding:6px 12px 9px}.sidebar .floor-header h3{font-size:13px;font-weight:850;letter-spacing:0;text-transform:none}.sidebar .area-button{min-height:64px;height:auto;margin-bottom:8px;padding:11px 12px 11px 56px;border-radius:9px;border:1px solid rgba(15,23,42,0.06);background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 97%,#ffffff),color-mix(in srgb,var(--card-background-color) 96%,var(--primary-background-color)));box-shadow:0 10px 22px rgba(15,23,42,0.07),inset 0 1px 0 rgba(255,255,255,0.42)}.sidebar .area-button.home-button{height:48px;min-height:48px;padding:10px 14px 10px 54px;border-radius:8px}.sidebar .area-button.home-button .area-icon{position:absolute;left:12px;top:50%;width:34px;height:34px;transform:translateY(-50%);border-radius:999px}.sidebar .area-button.selected,.sidebar .area-button.home-button.selected{border-color:color-mix(in srgb,var(--primary-color) 42%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--primary-color) 88%,#ffffff 10%),var(--primary-color));color:var(--text-primary-color);box-shadow:0 14px 28px color-mix(in srgb,var(--primary-color) 24%,transparent),inset 0 1px 0 rgba(255,255,255,0.2)}.sidebar .area-content{min-height:42px;display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-rows:auto auto;align-items:center;gap:3px 10px}.sidebar .area-top-section{min-width:0;margin-top:0;grid-column:1;grid-row:1 / span 2}.sidebar .area-bottom-section{display:contents;min-height:0}.sidebar .area-main-icon{position:absolute;left:-44px;top:50%;bottom:auto;width:34px;height:34px;border-radius:10px;transform:translateY(-50%);background:color-mix(in srgb,var(--primary-color) 12%,transparent);box-shadow:none}.sidebar .area-main-icon ha-icon{--mdc-icon-size:20px}.sidebar .area-button.has-picture{min-height:70px;color:var(--area-picture-text-color,#ffffff);border-color:rgba(255,255,255,0.18);background:#182044}.sidebar .area-button.has-picture.selected{border-color:color-mix(in srgb,var(--primary-color) 44%,rgba(255,255,255,0.18));box-shadow:0 14px 30px rgba(15,23,42,0.18),inset 0 0 0 1px color-mix(in srgb,var(--primary-color) 34%,transparent)}.sidebar .area-button.has-picture::after{content:"";position:absolute;inset:0;z-index:0;background:var(--area-picture-overlay);pointer-events:none}.sidebar .area-button.has-picture .area-background{opacity:0.78;transform:scale(1.02)}.sidebar .area-button.has-picture .area-content,.sidebar .area-button.has-picture .area-info-badges,.sidebar .area-button.has-picture .area-main-icon{z-index:1}.sidebar .area-info-badges{position:relative;top:auto;right:auto;grid-column:2;grid-row:1 / span 2;max-width:130px;justify-content:flex-end;align-self:center;gap:5px}.sidebar .area-name{max-width:100%;margin:0;font-size:15px;font-weight:850;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sidebar .area-sensors{margin-top:4px;color:color-mix(in srgb,var(--primary-text-color) 58%,transparent);font-size:12px;font-weight:700;line-height:1.1}.sidebar .area-button.has-picture .area-sensors{color:var(--area-picture-muted-text-color,rgba(255,255,255,0.72))}.sidebar .info-badge{min-width:24px;height:22px;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--primary-color) 9%,var(--card-background-color));box-shadow:inset 0 0 0 1px rgba(15,23,42,0.04)}.sidebar .info-badge ha-icon{--mdc-icon-size:13px}.sidebar .badge-count{font-size:11px;font-weight:850}.sidebar .area-button.has-picture .info-badge{background:color-mix(in srgb,var(--badge-color,var(--primary-color)) 18%,rgba(255,255,255,0.88));color:var(--badge-color,var(--primary-color));backdrop-filter:blur(10px);box-shadow:0 4px 12px rgba(15,23,42,0.16)}.sidebar .area-button.selected .area-main-icon,.sidebar .area-button.selected .area-icon{background:rgba(var(--rgb-primary-color,3,169,244),0.14);color:var(--primary-color)}.sidebar .area-list{display:grid;grid-template-columns:minmax(0,1fr) !important;gap:8px}.sidebar .floor-section{display:grid;grid-template-columns:minmax(0,1fr) !important;gap:8px;margin-bottom:10px}.sidebar .floor-areas{display:grid;grid-template-columns:minmax(0,1fr) !important;gap:8px}.sidebar .floor-header{margin:0;padding:4px 6px 2px}.sidebar .floor-header h3{color:var(--secondary-text-color);font-size:14px;font-weight:760;line-height:1.2}.sidebar .area-button,.sidebar .area-button.home-button{display:grid;grid-template-columns:48px minmax(0,1fr) auto 22px;align-items:center;gap:12px;min-height:68px;height:auto;margin:0;padding:10px 12px;border-radius:8px;border:1px solid rgba(15,23,42,0.06);background:rgba(255,255,255,0.92);color:var(--primary-text-color);box-shadow:0 10px 22px rgba(15,23,42,0.06);transform:none}.sidebar .area-button:hover{transform:translateY(-1px);box-shadow:0 12px 24px rgba(15,23,42,0.09)}.sidebar .area-button.selected,.sidebar .area-button.home-button.selected{border-color:rgba(var(--rgb-primary-color,3,169,244),0.34);background:rgba(255,255,255,0.98);color:var(--primary-text-color);box-shadow:0 14px 28px rgba(15,23,42,0.1),inset 3px 0 0 var(--primary-color)}.sidebar .area-button.home-button .area-icon,.sidebar .area-icon,.sidebar .area-main-icon{position:relative;left:auto;top:auto;bottom:auto;grid-column:1;grid-row:1;width:46px;height:46px;border-radius:8px;transform:none;background:rgba(var(--rgb-primary-color,3,169,244),0.1);color:var(--primary-color);box-shadow:none}.sidebar .area-button.home-button .area-icon{position:relative;left:auto;top:auto}.sidebar .area-main-icon ha-icon,.sidebar .area-icon ha-icon{--mdc-icon-size:24px;color:currentColor}.sidebar .area-content{display:contents;width:auto;height:auto;min-height:0}.sidebar .area-info,.sidebar .area-top-section{grid-column:2;grid-row:1;min-width:0;margin:0}.sidebar .area-bottom-section{display:contents}.sidebar .area-name{margin:0;color:inherit;font-size:15px;font-weight:750;line-height:1.1}.sidebar .area-sensors{margin-top:4px;color:var(--secondary-text-color);font-size:12px;font-weight:500;line-height:1.1}.sidebar .area-info-badges{position:relative;top:auto;right:auto;grid-column:3;grid-row:1;max-width:104px;display:flex;justify-content:flex-end;align-items:center;gap:4px;z-index:1}.sidebar .area-menu-chevron{display:block;grid-column:4;grid-row:1;z-index:1;--mdc-icon-size:22px;color:rgba(15,23,42,0.52);transition:transform 0.18s ease,color 0.18s ease}.sidebar .home-notification-shortcut{grid-column:3;grid-row:1;justify-self:end;width:auto;min-width:44px;height:30px;margin-left:0}.sidebar .area-button.selected .area-menu-chevron{color:var(--primary-color);transform:translateX(2px)}.sidebar .area-button.has-picture{min-height:68px;border-color:rgba(15,23,42,0.12);background:rgba(18,24,38,0.9);color:var(--area-picture-text-color,#ffffff)}.sidebar .area-button.has-picture.selected{border-color:rgba(var(--rgb-primary-color,3,169,244),0.48);background:rgba(18,24,38,0.92);box-shadow:0 14px 28px rgba(15,23,42,0.16),inset 3px 0 0 var(--primary-color)}.sidebar .area-button.has-picture .area-background{opacity:0.78;transform:scale(1.02)}.sidebar .area-button.has-picture .area-top-section,.sidebar .area-button.has-picture .area-name,.sidebar .area-button.has-picture .area-sensors,.sidebar .area-button.has-picture .area-menu-chevron,.sidebar .area-button.has-picture .area-info-badges,.sidebar .area-button.has-picture .area-main-icon,.sidebar .area-button.has-picture .area-icon{position:relative;z-index:2}.sidebar .area-button.has-picture::after{background:var(--area-picture-overlay)}.sidebar .area-button.has-picture .area-name{width:fit-content;max-width:100%;padding:4px 8px;margin-left:-2px;border-radius:8px;color:#ffffff;background:linear-gradient(90deg,rgba(8,13,24,0.66),rgba(8,13,24,0.28));text-shadow:0 2px 8px rgba(0,0,0,0.72);backdrop-filter:blur(2px)}.sidebar .area-button.has-picture .area-main-icon,.sidebar .area-button.has-picture .area-icon{background:rgba(255,255,255,0.18);color:var(--area-picture-text-color,#ffffff);backdrop-filter:blur(10px)}.sidebar .area-button.has-picture .area-sensors,.sidebar .area-button.has-picture .area-menu-chevron{color:var(--area-picture-muted-text-color,rgba(255,255,255,0.72))}.sidebar .area-button.has-picture.selected .area-menu-chevron{color:var(--area-picture-text-color,#ffffff)}.sidebar .area-button.has-picture.text-dark .area-main-icon,.sidebar .area-button.has-picture.text-dark .area-icon{background:rgba(255,255,255,0.18);color:var(--area-picture-text-color,#ffffff)}.sidebar .area-button.has-picture.text-dark .info-badge{background:color-mix(in srgb,var(--badge-color,var(--primary-color)) 18%,rgba(255,255,255,0.88));color:var(--badge-color,var(--primary-color))}.mobile-nav-overlay{z-index:120 !important;background:rgba(0,0,0,0.45);backdrop-filter:blur(2px)}:host([data-theme-dark]){.layout-container>.sidebar,.sidebar{border-color:rgba(255,255,255,0.1);background:linear-gradient(180deg,rgba(37,40,48,0.96),rgba(18,20,25,0.94)),color-mix(in srgb,var(--card-background-color) 92%,#000000);box-shadow:0 24px 58px rgba(0,0,0,0.58),inset 0 1px 0 rgba(255,255,255,0.06);color:var(--primary-text-color)}.sidebar::before{background:rgba(255,255,255,0.18)}.sidebar .floor-header h3{color:color-mix(in srgb,var(--primary-text-color) 58%,transparent)}.sidebar .area-button{border:1px solid rgba(255,255,255,0.06);background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 86%,#ffffff 4%),color-mix(in srgb,var(--card-background-color) 96%,#000000 4%));color:var(--primary-text-color);box-shadow:0 10px 22px rgba(0,0,0,0.24)}.sidebar .area-button.selected,.sidebar .area-button.home-button.selected{border-color:color-mix(in srgb,var(--primary-color) 42%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--card-background-color) 90%,var(--primary-color) 12%),color-mix(in srgb,var(--card-background-color) 96%,#000000 5%));color:var(--primary-text-color);box-shadow:0 14px 30px rgba(0,0,0,0.36),inset 3px 0 0 var(--primary-color),inset 0 1px 0 rgba(255,255,255,0.06)}.sidebar .area-button.has-picture{border-color:rgba(255,255,255,0.08);background:#17202b}.sidebar .area-button.has-picture .area-background{opacity:0.58}.sidebar .area-button.has-picture:hover .area-background{opacity:0.66}.sidebar .area-main-icon,.sidebar .area-icon{background:color-mix(in srgb,var(--primary-color) 22%,transparent);color:var(--primary-color)}.sidebar .area-button.selected .area-main-icon,.sidebar .area-button.selected .area-icon{background:color-mix(in srgb,var(--primary-color) 24%,transparent);color:var(--primary-color)}.sidebar .area-menu-chevron,.sidebar .area-button.selected .area-menu-chevron{color:color-mix(in srgb,var(--primary-text-color) 62%,transparent)}.sidebar .area-button.selected .area-menu-chevron{color:var(--primary-color)}.sidebar .area-sensors,.sidebar .area-bottom-section{color:color-mix(in srgb,var(--primary-text-color) 68%,transparent)}.sidebar .info-badge{background:rgba(255,255,255,0.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.04)}.home-notification-shortcut{color:#ff9a9a;background:rgba(239,68,68,0.16);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.05),0 8px 18px rgba(0,0,0,0.18)}.mobile-nav-overlay{background:rgba(0,0,0,0.58);backdrop-filter:blur(4px)}}.home-view,.home-content-area{max-width:100% !important;overflow-x:hidden !important}.home-view .home-favorites-section{box-sizing:border-box !important;width:100% !important;max-width:100% !important;margin:0 -10px 44px !important;padding:0 !important;overflow-x:hidden !important}.home-view .home-favorites-section .favorites-grid{box-sizing:border-box !important;width:100% !important;max-width:100% !important;min-width:0 !important}.home-view .home-favorites-section .favorite-card-wrapper{max-width:100% !important;min-width:0 !important}}@media (pointer:coarse){.dd-card-toolbar button,.dd-generated-card-toolbar button,.mobile-domain-order-button,.mobile-domain-drag-handle,.mobile-layout-toggle,.mobile-domain-master-action,.mobile-cover-action,.notifications-icon-button,.notification-dismiss,.header-expand-button{min-width:40px;min-height:40px}.mobile-domain-master,.mobile-domain-master-actions{min-height:40px}.mobile-entity-top{flex-wrap:wrap}.mobile-cover-actions{margin-left:auto}.mobile-entity-toggle,.mobile-entity-more,.mobile-scene-action,.mobile-lock-action,.favorite-quick-action,.mobile-section-action,.mobile-section-toggle,.home-notification-shortcut{position:relative}.mobile-entity-toggle::after,.mobile-entity-more::after,.mobile-scene-action::after,.mobile-lock-action::after,.favorite-quick-action::after,.mobile-section-action::after,.mobile-section-toggle::after,.home-notification-shortcut::after{content:"";position:absolute;left:50%;top:50%;width:max(100%,44px);height:max(100%,44px);transform:translate(-50%,-50%)}}@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;transition-delay:0s !important;scroll-behavior:auto !important}.welcome-alarm.alarm-triggered{animation:none}}`,ft=s`dwains-dashboard-next-now-playing.inline{margin:-12px 0 24px}.area-view>dwains-dashboard-next-now-playing.inline{margin:0 0 18px}@media (max-width:768px){dwains-dashboard-next-now-playing.floating{position:fixed;left:max(12px,env(safe-area-inset-left,0px));right:max(12px,env(safe-area-inset-right,0px));bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:100;max-width:560px;margin:0 auto}.layout-container.has-floating-now-playing .home-view,.layout-container.has-floating-now-playing .content-area.area-content-area{padding-bottom:calc(200px + env(safe-area-inset-bottom,0px))}}`;class xt extends HTMLElement{constructor(){super(...arguments),this._child=null}static get observedAttributes(){return["entity","name"]}set hass(e){this._hass=e,this._child&&(this._child.hass=e)}get hass(){return this._hass}attributeChangedCallback(e,t,i){"entity"===e&&(this._entityId=i??void 0),"name"===e&&(this._name=i??void 0),this._ensureChild()}connectedCallback(){this.style.display="block",this._ensureChild()}disconnectedCallback(){this._child=null,this.innerHTML=""}async _ensureChild(){if(this.isConnected&&this._entityId)if(this._child&&this.contains(this._child)&&this._child.getAttribute("data-entity")===this._entityId)this._hass&&(this._child.hass=this._hass);else{if(!customElements.get("hui-tile-card"))try{await customElements.whenDefined("hui-tile-card")}catch{return}this._child&&this.contains(this._child)||(this._child=document.createElement("hui-tile-card"),this._child.classList.add("favorite-tile"),this._child.setAttribute("data-entity",this._entityId),this.innerHTML="",this.appendChild(this._child));try{if("setConfig"in this._child){const e={entity:this._entityId};this._name&&(e.name=this._name),this._child.setConfig(e)}this._hass&&this.contains(this._child)&&(this._child.hass=this._hass)}catch(e){console.warn("dwains-dashboard-next-tile-host: failed to configure tile",e)}}}}customElements.get("dwains-dashboard-next-tile-host")||customElements.define("dwains-dashboard-next-tile-host",xt);const vt={min:7,max:35},yt={min:45,max:95},wt=new Set(["unavailable","unknown"]),kt=1e-9;function $t(e){if(null==e||""===e||"boolean"==typeof e)return;const t="number"==typeof e?e:Number(e);return Number.isFinite(t)?t:void 0}function St(e){return/f$/i.test(String(e||"").trim())}function Ct(e,t){const i=$t(e?.target_temp_step);return void 0!==i&&i>0?i:St(t)?1:.5}function Et(e){if(!Number.isFinite(e)||e<=0)return 1;for(let t=0;t<3;t++){const i=e*10**t;if(Math.abs(i-Math.round(i))<kt*10**t)return t}return 3}function At(e,t,i){return t<=i?Math.min(i,Math.max(t,e)):e}function Mt(e,t,i){const{step:a,min:o,max:r}=i;if(!(a>0))return At(e,o,r);const s=e/a,n=t>0?Math.floor(s+kt):Math.ceil(s-kt);return At(Number(((n+t)*a).toFixed(Et(a))),o,r)}function zt(e,t,i){return Mt(e,t,i)!==e}function Dt(e,t){if(!e||wt.has(String(e.state)))return;const i=e.attributes||{},a=St(t)?yt:vt;let o=$t(i.min_temp)??a.min,r=$t(i.max_temp)??a.max;o>r&&([o,r]=[r,o]);const s=$t(i.temperature),n=$t(i.target_temp_low),c=$t(i.target_temp_high),d=void 0!==n&&void 0!==c;let l="none";return"off"!==e.state&&(!d||"heat_cool"!==e.state&&void 0!==s?void 0!==s&&(l="single"):l="range"),{mode:l,current:$t(i.current_temperature),target:s,targetLow:n,targetHigh:c,min:o,max:r,step:Ct(i,t),unit:t}}const Tt=new Map;function It(e,t,i){const a=`${i||""}|${t}`;let o=Tt.get(a);if(!o){try{o=new Intl.NumberFormat(i||void 0,{minimumFractionDigits:t,maximumFractionDigits:t})}catch{o=new Intl.NumberFormat(void 0,{minimumFractionDigits:t,maximumFractionDigits:t})}Tt.set(a,o)}return o.format(e)}const Ht={heat:de,cool:ce,dry:ne,fan:se,auto:re,idle:oe,off:ae};let Pt=class extends n{constructor(){super(...arguments),this.entityId="",this.roomName="",this._openMoreInfo=()=>{this.entityId&&Oe(this,"hass-more-info",{entityId:this.entityId})}}_t(e,t){return B(this.hass,e,t)}disconnectedCallback(){super.disconnectedCallback(),this._flushCommit(),this._clearConfirmTimer()}willUpdate(e){super.willUpdate(e),e.has("entityId")&&this._pendingEntityId&&this._pendingEntityId!==this.entityId&&this._flushCommit(),e.has("hass")&&this._clearPendingWhenConfirmed()}_unit(){return String(this.hass?.config?.unit_system?.temperature||"°C")}_stateObj(){return this.entityId?this.hass?.states?.[this.entityId]:void 0}_displayTarget(e){return void 0!==this._pendingTarget&&this._pendingEntityId===this.entityId?this._pendingTarget:e.target}_formatValue(e,t,i){return`${It(e,t,K(this.hass))} ${i}`}_formatCurrent(e,t){if(void 0!==t.current){try{const t=this.hass?.formatEntityAttributeValue?.(e,"current_temperature");if(t)return t}catch{}return this._formatValue(t.current,Number.isInteger(t.current)?0:1,t.unit)}}_activityLabel(e){try{return e.attributes?.hvac_action?this.hass?.formatEntityAttributeValue?.(e,"hvac_action")||String(e.attributes.hvac_action):this.hass?.formatEntityState?.(e)||e.state}catch{return String(e.attributes?.hvac_action||e.state)}}_adjust(e){const t=Dt(this._stateObj(),this._unit());if("single"!==t?.mode)return;const i=this._displayTarget(t);if(void 0===i)return;const a=Mt(i,e,t);a!==i&&(this._pendingTarget=a,this._pendingEntityId=this.entityId,this._clearConfirmTimer(),void 0!==this._commitTimer&&window.clearTimeout(this._commitTimer),this._commitTimer=window.setTimeout(()=>{this._commitTimer=void 0,this._commit()},800))}_flushCommit(){void 0!==this._commitTimer&&(window.clearTimeout(this._commitTimer),this._commitTimer=void 0,this._commit())}async _commit(){const e=this._pendingEntityId,t=this._pendingTarget,i=this.hass;if(e&&void 0!==t&&i){try{await i.callService("climate","set_temperature",{entity_id:e,temperature:t})}catch(i){return console.warn(`Failed to set the temperature of ${e}:`,i),this._isLatestPending(e,t)&&this._clearPending(),void Oe(this,"hass-notification",{message:this._t("thermostat.update_failed",{name:this.roomName||e})})}this._isLatestPending(e,t)&&(this._clearPendingWhenConfirmed(),void 0!==this._pendingTarget&&(this._clearConfirmTimer(),this._confirmTimer=window.setTimeout(()=>{this._confirmTimer=void 0,this._isLatestPending(e,t)&&this._clearPending()},8e3)))}}_isLatestPending(e,t){return void 0===this._commitTimer&&this._pendingEntityId===e&&this._pendingTarget===t}_clearPendingWhenConfirmed(){if(void 0===this._pendingTarget||void 0!==this._commitTimer||!this._pendingEntityId)return;const e=Number(this.hass?.states?.[this._pendingEntityId]?.attributes?.temperature);Number.isFinite(e)&&Math.abs(e-this._pendingTarget)<1e-6&&this._clearPending()}_clearPending(){this._pendingTarget=void 0,this._pendingEntityId=void 0,this._clearConfirmTimer()}_clearConfirmTimer(){void 0!==this._confirmTimer&&(window.clearTimeout(this._confirmTimer),this._confirmTimer=void 0)}_icon(e){return c`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d=${e}></path></svg>`}render(){const e=this._stateObj(),t=Dt(e,this._unit());if(!e||!t)return o;const i=this.roomName||e.attributes?.friendly_name||this.entityId,a=function(e){const t=String(e?.attributes?.hvac_action??"").toLowerCase(),i=String(e?.state??"").toLowerCase();switch(t||i){case"heating":case"preheating":case"defrosting":case"heat":return"heat";case"cooling":case"cool":return"cool";case"drying":case"dry":return"dry";case"fan":case"fan_only":return"fan";case"heat_cool":case"auto":return"auto";case"off":return"off";default:return"idle"}}(e),r=this._activityLabel(e),s=this._formatCurrent(e,t),n=Et(t.step),d=this._displayTarget(t),l=this._t("thermostat.details",{name:i,state:r});return c`
      <div class="thermostat activity-${a}">
        ${s?c`
          <button
            class="segment current"
            type="button"
            title=${l}
            aria-label=${`${this._t("thermostat.current")}: ${s}. ${l}`}
            @click=${this._openMoreInfo}
          >
            <span class="segment-icon">${this._icon(ee)}</span>
            <span class="copy">
              <span class="label">${this._t("thermostat.current")}</span>
              <span class="value">${s}</span>
            </span>
          </button>
        `:o}

        ${"single"===t.mode&&void 0!==d?c`
          <div class="target" role="group" aria-label=${this._t("thermostat.target_label",{name:i})}>
            <button
              class="step"
              type="button"
              title=${this._t("thermostat.lower",{name:i})}
              aria-label=${this._t("thermostat.lower",{name:i})}
              ?disabled=${!zt(d,-1,t)}
              @click=${()=>this._adjust(-1)}
            >
              ${this._icon(te)}
            </button>
            <span class="copy target-copy">
              <span class="label">${this._t("thermostat.target")}</span>
              <span class="value" aria-live="polite">${this._formatValue(d,n,t.unit)}</span>
            </span>
            <button
              class="step"
              type="button"
              title=${this._t("thermostat.raise",{name:i})}
              aria-label=${this._t("thermostat.raise",{name:i})}
              ?disabled=${!zt(d,1,t)}
              @click=${()=>this._adjust(1)}
            >
              ${this._icon(ie)}
            </button>
          </div>
        `:"range"===t.mode&&void 0!==t.targetLow&&void 0!==t.targetHigh?c`
          <button
            class="segment target-range"
            type="button"
            title=${l}
            aria-label=${`${this._t("thermostat.target")}: ${this._formatValue(t.targetLow,n,t.unit)} - ${this._formatValue(t.targetHigh,n,t.unit)}. ${l}`}
            @click=${this._openMoreInfo}
          >
            <span class="copy">
              <span class="label">${this._t("thermostat.target")}</span>
              <span class="value">
                ${It(t.targetLow,n,K(this.hass))}
                -
                ${this._formatValue(t.targetHigh,n,t.unit)}
              </span>
            </span>
          </button>
        `:o}

        <button
          class="mode"
          type="button"
          title=${l}
          aria-label=${l}
          @click=${this._openMoreInfo}
        >
          ${this._icon(Ht[a])}
          <span class="mode-label">${r}</span>
        </button>
      </div>
    `}};Pt.styles=s`:host{display:block;min-width:0;-webkit-tap-highlight-color:transparent}.thermostat{--thermostat-color:var(--secondary-text-color,#6b7280);--tile-text:var(--ph-text,var(--primary-text-color));--tile-muted:var(--ph-muted,var(--secondary-text-color));box-sizing:border-box;min-height:52px;padding:6px;display:flex;align-items:center;gap:6px;min-width:0;border-radius:14px;background:var(--ph-control,color-mix(in srgb,var(--primary-text-color) 6%,transparent));color:var(--tile-text);backdrop-filter:blur(16px) saturate(1.3);-webkit-backdrop-filter:blur(16px) saturate(1.3)}.thermostat.activity-heat{--thermostat-color:var(--state-climate-heat-color,#ff8100)}.thermostat.activity-cool{--thermostat-color:var(--state-climate-cool-color,#2b9af9)}.thermostat.activity-dry{--thermostat-color:var(--state-climate-dry-color,#efbd07)}.thermostat.activity-fan{--thermostat-color:var(--state-climate-fan_only-color,#00bcd4)}.thermostat.activity-auto{--thermostat-color:var(--state-climate-auto-color,#008000)}button{margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}svg{width:18px;height:18px;flex:0 0 auto;fill:currentColor}.segment{min-width:0;min-height:40px;padding:0 10px 0 0;display:inline-flex;align-items:center;gap:10px;flex:0 1 auto;border-radius:11px;text-align:left;transition:background-color 0.18s ease}.target-range{padding-left:10px}.segment:hover{background:color-mix(in srgb,var(--tile-text) 7%,transparent)}.mode:hover{background:color-mix(in srgb,var(--thermostat-color) 22%,transparent)}.segment-icon{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:11px;background:color-mix(in srgb,var(--thermostat-color) 16%,transparent);color:color-mix(in srgb,var(--thermostat-color) 78%,var(--tile-text))}.segment-icon svg{width:20px;height:20px}.copy{min-width:0;display:flex;flex-direction:column;gap:1px;line-height:1.1}.label{color:var(--tile-muted);font-size:12px;font-weight:500;white-space:nowrap}.value{font-size:14px;font-weight:650;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.target{display:inline-flex;align-items:center;gap:2px;flex:0 0 auto;padding:0;border-radius:11px}.target-copy{min-width:56px;align-items:center;text-align:center}.step{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:10px;background:color-mix(in srgb,var(--tile-text) 8%,transparent);color:var(--tile-text);transition:background-color 0.18s ease,transform 0.12s ease,opacity 0.18s ease}.step:hover:not(:disabled){background:color-mix(in srgb,var(--tile-text) 13%,transparent)}.step:active:not(:disabled){transform:scale(0.94)}.step:disabled{opacity:0.4;cursor:default}.mode{min-width:36px;max-width:150px;min-height:40px;margin-left:auto;padding:0 12px 0 10px;display:inline-flex;align-items:center;gap:6px;flex:0 1 auto;border-radius:11px;background:color-mix(in srgb,var(--thermostat-color) 15%,transparent);color:color-mix(in srgb,var(--thermostat-color) 70%,var(--tile-text));font-size:13px;font-weight:650;transition:background-color 0.18s ease}.mode svg{width:16px;height:16px}.mode-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media (pointer:coarse){.segment,.mode{min-height:40px}.step{width:40px;height:40px}}@media (max-width:380px){.segment{padding:0 6px 0 8px}.segment-icon{display:none}}@media (prefers-reduced-motion:reduce){.segment,.mode,.step{transition:none}}`,e([t({attribute:!1})],Pt.prototype,"hass",void 0),e([t({attribute:!1})],Pt.prototype,"entityId",void 0),e([t({attribute:!1})],Pt.prototype,"roomName",void 0),e([i()],Pt.prototype,"_pendingTarget",void 0),Pt=e([a("dwains-dashboard-next-area-thermostat")],Pt);const Lt=new Set(["video","movie","tvshow","episode","channel"]);let Nt=class extends n{constructor(){super(...arguments),this.players=[],this.floating=!1}_t(e,t){return B(this.hass,e,t)}disconnectedCallback(){super.disconnectedCallback(),this._clearOptimisticTimer()}willUpdate(e){if(super.willUpdate(e),e.has("hass")&&this._optimistic){const e=this.hass?.states?.[this._optimistic.entityId]?.state,t=this._optimistic.state;(("playing"===t?fe(e):e===t)||this._optimistic.expiresAt<=Date.now())&&this._clearOptimistic()}}_currentPlayer(){const e=this.players||[];return e.find(e=>e.entityId===this._pinnedEntityId)||e[0]}_shownState(e){const t=this._optimistic;return t&&t.entityId===e.entity_id&&t.expiresAt>Date.now()?t.state:e.state}_playerName(e){return e.attributes?.friendly_name||V(this.hass)[e.entity_id]?.name||e.entity_id}_openMoreInfo(e){Oe(this,"hass-more-info",{entityId:e})}_cycle(){const e=this.players||[];if(e.length<2)return;const t=this._currentPlayer(),i=e.findIndex(e=>e.entityId===t?.entityId);this._pinnedEntityId=e[(i+1)%e.length].entityId}async _togglePlayback(e,t){const i=e.entity_id,a=fe(this._shownState(e))?"paused":"playing";this._pinnedEntityId=i,this._optimistic={entityId:i,state:a,expiresAt:Date.now()+5e3},this._scheduleOptimisticExpiry();try{await this.hass.callService("media_player","media_play_pause",{entity_id:i})}catch(e){console.warn(`Failed to play or pause ${i}:`,e),this._optimistic?.entityId===i&&this._clearOptimistic(),this._showFailure(t)}}async _nextTrack(e,t){const i=e.entity_id;this._pinnedEntityId=i;try{await this.hass.callService("media_player","media_next_track",{entity_id:i})}catch(e){console.warn(`Failed to skip to the next track on ${i}:`,e),this._showFailure(t)}}_showFailure(e){Oe(this,"hass-notification",{message:this._t("now_playing.update_failed",{name:e})})}_scheduleOptimisticExpiry(){this._clearOptimisticTimer(),this._optimisticTimer=window.setTimeout(()=>{this._optimisticTimer=void 0,this._optimistic=void 0},5050)}_clearOptimistic(){this._optimistic=void 0,this._clearOptimisticTimer()}_clearOptimisticTimer(){void 0!==this._optimisticTimer&&(window.clearTimeout(this._optimisticTimer),this._optimisticTimer=void 0)}_icon(e){return c`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d=${e}></path></svg>`}render(){const e=this._currentPlayer(),t=e?this.hass?.states?.[e.entityId]:void 0;if(!e||!t)return o;const i=this._playerName(t),{title:a,artist:r}=xe(t,i),s=[r,e.roomName||(a!==i?i:"")].filter(Boolean).join(" · "),n=e.roomName||i,d=this._shownState(t),l=fe(d),h=ve(t,this.hass?.hassUrl?.bind(this.hass)),p=h&&h!==this._brokenArtwork,m=String(t.attributes?.media_content_type||""),u=(this.players?.length||0)-1;return c`
      <div class="bar ${l?"is-playing":"is-paused"}" role="region" aria-label=${this._t("now_playing.title")}>
        <button
          class="info"
          type="button"
          title=${this._t("now_playing.details",{name:n})}
          aria-label=${`${a}${s?`, ${s}`:""}. ${this._t("now_playing.details",{name:n})}`}
          @click=${()=>this._openMoreInfo(t.entity_id)}
        >
          <span class="art">
            ${p?c`
              <img
                src=${h}
                alt=""
                decoding="async"
                referrerpolicy="no-referrer"
                @error=${()=>{this._brokenArtwork=h}}
              />
            `:this._icon(Lt.has(m)?le:he)}
          </span>
          <span class="text">
            <span class="title">${a}</span>
            ${s?c`<span class="subtitle">${s}</span>`:o}
          </span>
        </button>
        <div class="controls">
          ${u>0?c`
            <button
              class="more"
              type="button"
              title=${this._t("now_playing.more_players",{count:u})}
              aria-label=${this._t("now_playing.more_players",{count:u})}
              @click=${this._cycle}
            >+${u}</button>
          `:o}
          ${ye(t,d)?c`
            <button
              class="control primary"
              type="button"
              title=${this._t(l?"now_playing.pause":"now_playing.play",{name:n})}
              aria-label=${this._t(l?"now_playing.pause":"now_playing.play",{name:n})}
              @click=${()=>this._togglePlayback(t,n)}
            >
              ${this._icon(l?pe:me)}
            </button>
          `:o}
          ${we(t)?c`
            <button
              class="control"
              type="button"
              title=${this._t("now_playing.next",{name:n})}
              aria-label=${this._t("now_playing.next",{name:n})}
              @click=${()=>this._nextTrack(t,n)}
            >
              ${this._icon(ue)}
            </button>
          `:o}
        </div>
      </div>
    `}};Nt.styles=s`:host{display:block;min-width:0;-webkit-tap-highlight-color:transparent}.bar{box-sizing:border-box;min-height:60px;padding:6px 8px 6px 6px;display:flex;align-items:center;gap:8px;border-radius:14px;background:var(--card-background-color,#fff);color:var(--primary-text-color);border:1px solid color-mix(in srgb,var(--divider-color,rgba(0,0,0,0.12)) 70%,transparent);box-shadow:0 10px 26px rgba(15,23,42,0.07)}:host([floating]) .bar{border-radius:18px;background:color-mix(in srgb,var(--card-background-color,#fff) 90%,transparent);box-shadow:0 18px 40px rgba(15,23,42,0.18),inset 0 1px 0 color-mix(in srgb,#ffffff 40%,transparent);backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%)}button{margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}svg{width:22px;height:22px;fill:currentColor}.info{min-width:0;min-height:46px;flex:1 1 auto;display:flex;align-items:center;gap:10px;padding-right:4px;border-radius:10px;text-align:left}.art{width:46px;height:46px;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;overflow:hidden;border-radius:10px;background:color-mix(in srgb,var(--primary-color) 14%,var(--card-background-color,#fff));color:var(--primary-color)}.art img{width:100%;height:100%;object-fit:cover;display:block}.is-paused .art{opacity:0.72}.text{min-width:0;display:flex;flex-direction:column;gap:2px}.title,.subtitle{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.title{font-size:14px;font-weight:700;line-height:1.2}.subtitle{color:var(--secondary-text-color);font-size:12px;font-weight:500;line-height:1.2}.controls{flex:0 0 auto;display:flex;align-items:center;gap:4px}.control{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;transition:background-color 0.18s ease,transform 0.12s ease}.control:hover{background:color-mix(in srgb,var(--primary-text-color) 8%,transparent)}.control.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}.control.primary:hover{background:color-mix(in srgb,var(--primary-color) 88%,#000)}.control:active{transform:scale(0.94)}.more{min-width:40px;height:32px;padding:0 10px;border-radius:999px;background:color-mix(in srgb,var(--primary-text-color) 8%,transparent);color:var(--primary-text-color);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums}@media (pointer:coarse){.more{height:40px}}@media (prefers-reduced-motion:reduce){.control{transition:none}}`,e([t({attribute:!1})],Nt.prototype,"hass",void 0),e([t({attribute:!1})],Nt.prototype,"players",void 0),e([t({type:Boolean,reflect:!0})],Nt.prototype,"floating",void 0),e([i()],Nt.prototype,"_pinnedEntityId",void 0),e([i()],Nt.prototype,"_optimistic",void 0),e([i()],Nt.prototype,"_brokenArtwork",void 0),Nt=e([a("dwains-dashboard-next-now-playing")],Nt);const Ft=()=>import("./dwains-dashboard-strategy-editor-Ir7T8n7L.js"),Ot="dd-next-area-sidebar-width",Rt="dd-next-area-sidebar-collapsed",jt=240,Ut="__ungrouped__";let Wt=class extends n{constructor(){super(...arguments),this._waitingForHaMarkdown=!1,this._t=(e,t)=>B(this.hass,e,t),this._tp=(e,t,i)=>q(this.hass,e,t,i),this._selectedArea=null,this._selectedView=null,this._isMobile=!1,this._headerExpanded=!1,this._headerCompact=!1,this._favoritesRenderVersion=0,this._currentTime="",this._currentDate="",this._mobileNavOpen=!1,this._editMode=!1,this._notificationsOpen=!1,this._persistentNotifications=[],this._notificationsLoading=!1,this._notificationsError="",this._areaHeaderStuck=!1,this._areaHeaderRevealed=!1,this._mobileEntityLayout="rail",this._mobileHomeAreasLayout="rail",this._mobileHomeDevicesLayout="rail",this._mobileHomeFavoritesLayout="rail",this._mobileHomeCamerasLayout="rail",this._mobileHomeScenesLayout="rail",this._homeSceneFeedback={},this._homeSceneAnnouncement="",this._areaSidebarWidth=250,this._areaSidebarCollapsed=!1,this._isResizingSidebar=!1,this._repairsIssueCount=0,this._discoveredDeviceCount=0,this._suggestedFavoriteEntities=[],this._customCardDrag=null,this._customCardDragOver=null,this._generatedCardDrag=null,this._generatedCardDragOver=null,this._generatedGroupDrag=null,this._generatedGroupDragOver=null,this._optimisticEntityStates={},this._renderAllMobileHomeAreas=!1,this._renderAllMobileAreaEntities=!1,this._settingsDirty=!1,this._settingsSavePending=!1,this._settingsSubPage="overview",this._deviceSettingsJustSaved=!1,this._settingsSaveError="",this._areaResolver=new it,this._persistentNotificationsSubscription=new ot,this._persistentNotificationsLoaded=!1,this._homeSummariesLoaded=!1,this._favoriteSuggestionsLoaded=!1,this._favoriteSuggestionsLoading=!1,this._homeSceneFeedbackTimers=new Map,this._pendingAreaScrollTop=0,this._lastAreaScrollTop=0,this._areaScrollUpDistance=0,this._pictureContrastCache=new Map,this._areaSidebarScrollTop=0,this._settingsEditorInitialized=!1,this._handleTranslationsLoaded=()=>{this.requestUpdate()},this._handleResize=()=>{if(this._checkMobile(),!this._isMobile){const e=this._clampAreaSidebarWidth(this._areaSidebarWidth);e!==this._areaSidebarWidth&&(this._areaSidebarWidth=e)}this._updateAreaHeaderScrollState()},this._handleSidebarScroll=e=>{if(this._isMobile)return;const t=e.currentTarget;t&&(this._areaSidebarScrollTop=t.scrollTop)},this._handleContentScroll=e=>{if(!this._isMobile||"area"!==this._selectedView)return this._areaHeaderStuck&&(this._areaHeaderStuck=!1),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1));const t=e.currentTarget,i=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||t?.scrollTop||0;this._pendingAreaScrollTop=i,this._areaHeaderScrollRaf||(this._areaHeaderScrollRaf=requestAnimationFrame(()=>{this._areaHeaderScrollRaf=void 0,this._setAreaHeaderStuckForScroll(this._pendingAreaScrollTop,!0)}))},this._handleWindowScroll=()=>{this._isMobile&&"area"===this._selectedView&&(this._pendingAreaScrollTop=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,this._areaHeaderScrollRaf||(this._areaHeaderScrollRaf=requestAnimationFrame(()=>{this._areaHeaderScrollRaf=void 0,this._setAreaHeaderStuckForScroll(this._pendingAreaScrollTop,!0)})))},this._handleShowMoreInfo=e=>{Oe(this,"hass-more-info",{entityId:e.detail.entityId})},this._startSidebarResize=e=>{this._isMobile||0!==e.button||(e.preventDefault(),this._sidebarResizePointerId=e.pointerId,this._isResizingSidebar=!0,e.currentTarget?.setPointerCapture?.(e.pointerId),window.addEventListener("pointermove",this._handleSidebarResizeMove),window.addEventListener("pointerup",this._handleSidebarResizeEnd),window.addEventListener("pointercancel",this._handleSidebarResizeEnd))},this._handleSidebarResizeMove=e=>{if(!this._isResizingSidebar||this._isMobile)return;if(void 0!==this._sidebarResizePointerId&&e.pointerId!==this._sidebarResizePointerId)return;const t=this.renderRoot?.querySelector(".layout-container"),i=t?.getBoundingClientRect().left??0,a=e.clientX-i;a<=96?this._areaSidebarCollapsed=!0:(this._areaSidebarCollapsed&&(this._areaSidebarCollapsed=!1),this._areaSidebarWidth=this._clampAreaSidebarWidth(a))},this._handleSidebarResizeEnd=e=>{this._isResizingSidebar&&(e&&void 0!==this._sidebarResizePointerId&&e.pointerId!==this._sidebarResizePointerId||(this._isResizingSidebar=!1,this._sidebarResizePointerId=void 0,this._saveAreaSidebarWidthPreference(this._areaSidebarWidth),this._saveAreaSidebarCollapsedPreference(this._areaSidebarCollapsed),window.removeEventListener("pointermove",this._handleSidebarResizeMove),window.removeEventListener("pointerup",this._handleSidebarResizeEnd),window.removeEventListener("pointercancel",this._handleSidebarResizeEnd)))},this._toggleAreaSidebarCollapsed=e=>{e?.stopPropagation(),this._isMobile||(this._areaSidebarCollapsed=!this._areaSidebarCollapsed,this._saveAreaSidebarCollapsedPreference(this._areaSidebarCollapsed),this._areaSidebarCollapsed||(this._areaSidebarWidth=this._clampAreaSidebarWidth(this._areaSidebarWidth||250),this._saveAreaSidebarWidthPreference(this._areaSidebarWidth)))},this._handleSidebarResizeKeydown=e=>{if(this._isMobile)return;let t=this._areaSidebarWidth;if("ArrowLeft"===e.key)t-=e.shiftKey?40:20;else if("ArrowRight"===e.key)t+=e.shiftKey?40:20;else if("Home"===e.key)t=jt;else{if("End"!==e.key)return;t=660}e.preventDefault(),this._areaSidebarWidth=this._clampAreaSidebarWidth(t),this._saveAreaSidebarWidthPreference(this._areaSidebarWidth)},this._toggleMobileEntityLayout=e=>{e?.stopPropagation(),this._mobileEntityLayout="rail"===this._mobileEntityLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-entity-layout",this._mobileEntityLayout)}catch{}},this._toggleMobileHomeAreasLayout=e=>{e?.stopPropagation(),this._mobileHomeAreasLayout="rail"===this._mobileHomeAreasLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-areas-layout",this._mobileHomeAreasLayout)}catch{}},this._toggleMobileHomeDevicesLayout=e=>{e?.stopPropagation(),this._mobileHomeDevicesLayout="rail"===this._mobileHomeDevicesLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-devices-layout",this._mobileHomeDevicesLayout)}catch{}},this._toggleMobileHomeFavoritesLayout=e=>{e?.stopPropagation(),this._mobileHomeFavoritesLayout="rail"===this._mobileHomeFavoritesLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-favorites-layout",this._mobileHomeFavoritesLayout)}catch{}},this._toggleMobileHomeCamerasLayout=e=>{e?.stopPropagation(),this._mobileHomeCamerasLayout="rail"===this._mobileHomeCamerasLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-cameras-layout",this._mobileHomeCamerasLayout)}catch{}},this._toggleMobileHomeScenesLayout=e=>{e?.stopPropagation(),this._mobileHomeScenesLayout="rail"===this._mobileHomeScenesLayout?"grid":"rail";try{window.localStorage.setItem("dd-next-mobile-home-scenes-layout",this._mobileHomeScenesLayout)}catch{}},this._areaRelevantEntityIdSet=Ye((e,t,i)=>{const a=new Set(e.map(e=>e.entity_id));return t&&a.add(t),i&&a.add(i),a}),this._homeExplicitEntityIds=Ye((e,t,i)=>{const a=new Set([...e.favorites||[],...i,...Te(e.settings?.home_scenes)]);e.settings?.weather_entity_id&&a.add(e.settings.weather_entity_id),e.settings?.alarm_entity_id&&a.add(e.settings.alarm_entity_id);const o=e=>{"string"==typeof e&&e&&a.add(e)};return(e.areas||[]).forEach(e=>{o(e.temperature_entity_id),o(e.humidity_entity_id)}),Object.values(t||{}).forEach(e=>{o(e?.temperature_entity_id),o(e?.humidity_entity_id)}),a}),this._debouncedUpdate=()=>{this._updateDebounceTimer&&clearTimeout(this._updateDebounceTimer),this._updateDebounceTimer=window.setTimeout(()=>{this.requestUpdate()},100)},this._nowPlayingPlayers=Ye((e,t,i,a,o)=>Ie(be(t,"media_player"),{now:Date.now(),isVisible:t=>Fe(e,i,t)}).map(t=>({entityId:t,roomName:He(e,i,t)}))),this._visibleSortedAreas=Ye((e,t,i)=>H(e,t,i)),this._homeTodoEntities=Ye((e,t,i)=>{const a=Q(i);return be(e,"todo").map(e=>e.entity_id).filter(e=>e.startsWith("todo.")).filter(i=>{const a=e[i],o=t?.[i];return!!a&&(!["unavailable","unknown"].includes(String(a.state).toLowerCase())&&!o?.hidden_by&&!o?.disabled_by&&"diagnostic"!==o?.entity_category&&"config"!==o?.entity_category)}).sort((i,o)=>{const r=e[i]?.attributes?.friendly_name||t?.[i]?.name||i,s=e[o]?.attributes?.friendly_name||t?.[o]?.name||o;return a.compare(String(r),String(s))})}),this._handleHousePowerKeydown=e=>{this._handleActivationKeydown(e,()=>this._openDeviceDomain("energy"))},this._visiblePersonEntities=Ye((e,t,i)=>be(e,"person").filter(e=>e.entity_id.startsWith("person.")&&!i.has(e.entity_id)&&!t?.[e.entity_id]?.hidden_by)),this._homeSceneItems=Ye(Pe),this._toggleEditMode=()=>{if(!this._canManageDashboard())return this._editMode=!1,void this._rememberAreaEditMode(null);this._editMode=!this._editMode,this._rememberAreaEditMode(this._editMode&&"area"===this._selectedView?this._selectedArea:null)},this._clearCustomCardDragState=()=>{this._customCardDrag=null,this._customCardDragOver=null},this._clearGeneratedGroupDragState=()=>{this._generatedGroupDrag=null,this._generatedGroupDragOver=null},this._clearGeneratedCardDragState=()=>{this._generatedCardDrag=null,this._generatedCardDragOver=null},this._statusDomains=Ye((e,t)=>{const i=Le(e,t),a=this._housePowerUsage(e,t),o=a.sensorCount?a.formattedTotal:void 0;return o&&i.unshift({domain:"wattage",count:0,name:"Power usage",value:o,icon:"mdi:flash"}),i}),this._housePowerUsage=Ye((e,t)=>l(e,t)),this._areaDeviceIds=Ye(e=>{const t=new Map;return e?.forEach(e=>{if(!e.area_id)return;const i=t.get(e.area_id)||[];i.push(e.device_id),t.set(e.area_id,i)}),t}),this._handleAreaNavToggle=()=>{this._isMobile&&this._toggleMobileNav()},this._handleOpenSettingsEvent=()=>{this._openDashboardSettings()},this._handleOpenHomeEvent=()=>{this._selectView("home")},this._handleWallTabletReset=e=>{"settings"!==this._selectedView||!this._settingsDirty&&!this._settingsSavePending?(Re(this),this._notificationsOpen=!1,this._headerExpanded=!1,"home"!==this._selectedView||this._editMode?this._selectView("home"):this._closeMobileNav(),this.updateComplete.then(()=>{this.renderRoot?.querySelector(".content-area")?.scrollTo({top:0})})):e.preventDefault()},this._openMobileAreaSwitcher=()=>{this._isMobile&&this._canLeaveSettings(()=>this._openMobileAreaSwitcher())&&(this._selectedView="home",this._selectedArea=null,this._resetAreaHeaderScrollState(!1),this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._clearSettingsEditState(),this._mobileNavOpen=!0)},this._openMobileDeviceSwitcher=()=>{this._isMobile&&(this._navigateToDeviceDomain(null),[160,360,700].forEach(e=>{window.setTimeout(()=>{window.dispatchEvent(new CustomEvent("dwains-dashboard-next-toggle-devices-nav",{detail:{open:!0}}))},e)}))},this._updateEntityCount=Ye(e=>be(e,"update").filter(e=>e.entity_id.startsWith("update.")&&"on"===e.state).length),this._handleSettingsConfigChanged=e=>{e.stopPropagation();const t=e.detail;this._pendingSettingsConfig=t?.config,this._settingsDirty=Boolean(this._pendingSettingsConfig),this._settingsSaveError=""},this._closeSettingsPage=()=>{this._canLeaveSettings(this._closeSettingsPage)&&(this._clearSettingsEditState(),this._selectView("home"))},this._handleSettingsSubPageChanged=e=>{this._settingsSubPage=String(e.detail?.page||"overview")},this._handleDeviceSettingsSaved=()=>{this._deviceSettingsJustSaved=!0,window.clearTimeout(this._deviceSettingsSavedTimer),this._deviceSettingsSavedTimer=window.setTimeout(()=>{this._deviceSettingsJustSaved=!1},2e3)},this._welcomeUserPicture=Ye((e,t,i)=>{const a=be(e,"person").filter(e=>e.entity_id.startsWith("person.")),o=t?a.find(e=>e.attributes?.user_id===t):void 0;if(o)return o.attributes?.entity_picture||void 0;const r=i.trim().toLowerCase();if(!r)return;const s=a.find(e=>String(e.attributes?.friendly_name||"").trim().toLowerCase()===r);return s?.attributes?.entity_picture||void 0}),this._openDashboardSettings=()=>{this._canManageDashboard()&&(this._resetAreaHeaderScrollState(!0),this._selectedArea=null,this._selectedView="settings",this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._pendingSettingsConfig=void 0,this._settingsDirty=!1,this._settingsSaveError="",this._settingsEditorInitialized=!1,this._closeMobileNav(),this._syncBottomNavAreaContext(),this.updateComplete.then(()=>this._scrollContentAreaToTop()))},this._openProfileSettings=()=>{R("/profile/general")},this._openNotificationsFromHomeShortcut=e=>{e.preventDefault(),e.stopPropagation(),this._closeMobileNav(),this._openNotifications()},this._openNotifications=()=>{this._showNotificationsUi()&&(this._notificationsOpen=!0,this._persistentNotificationsLoaded=!0,this._loadPersistentNotifications(!0),this._ensurePersistentNotificationsSubscription())},this._closeNotifications=()=>{this._notificationsOpen=!1},this._dismissPersistentNotification=async e=>{const t=this._persistentNotifications;this._persistentNotifications=t.filter(t=>t.notification_id!==e);try{await this.hass.callService("persistent_notification","dismiss",{notification_id:e}),this._notificationsError=""}catch(e){console.error("Failed to dismiss persistent notification:",e),this._persistentNotifications=t,this._notificationsError=this._t("error.notification_dismiss")}},this._dismissAllPersistentNotifications=async()=>{const e=this._persistentNotifications;this._persistentNotifications=[];try{await this.hass.callService("persistent_notification","dismiss_all"),this._notificationsError=""}catch(t){console.error("Failed to dismiss all persistent notifications:",t),this._persistentNotifications=e,this._notificationsError=this._t("error.notifications_dismiss_all")}}}setConfig(e){if(!e)throw new Error("Invalid configuration");if(this.config=e,!this._selectedView){const t=this._getUrlArea();t&&e.areas?.some(e=>e.area_id===t)?(this._selectedArea=t,this._selectedView="area"):this._selectedView="home"}this._restoreAreaEditMode()}_getUrlArea(){try{return new URL(window.location.href).searchParams.get("dd_area")}catch{return null}}_updateUrlArea(e){try{const t=new URL(window.location.href);e?t.searchParams.set("dd_area",e):t.searchParams.delete("dd_area"),window.history.replaceState(window.history.state,"",t.toString())}catch{}}_syncBottomNavAreaContext(){const e=this.config?.areas?.find(e=>e.area_id===this._selectedArea),t="settings"===this._selectedView;window.dispatchEvent(new CustomEvent("dwains-dashboard-next-area-context-changed",{detail:{areaId:"area"===this._selectedView?this._selectedArea:null,icon:t?"mdi:cog-outline":e?f(e):"mdi:home",name:t?this._t("sidebar.dashboard_settings"):e?.name||this._t("sidebar.home"),view:this._selectedView||"home"}}))}_canManageDashboard(){return!Y(this.hass,this.config?.settings)}_areaEditModeStorageKey(){return`dd-next-area-edit-mode:${this._getDashboardUrlPath()||"default"}`}_rememberAreaEditMode(e){try{const t=this._areaEditModeStorageKey();if(!e)return void window.sessionStorage.removeItem(t);window.sessionStorage.setItem(t,JSON.stringify({areaId:e,updatedAt:Date.now()}))}catch{}}_restoreAreaEditMode(){if(!this._canManageDashboard())return this._editMode=!1,void this._rememberAreaEditMode(null);try{const e=window.sessionStorage.getItem(this._areaEditModeStorageKey());if(!e)return;const t=JSON.parse(e),i="number"==typeof t.updatedAt&&Date.now()-t.updatedAt<=3e4;if(!t.areaId||!i)return void this._rememberAreaEditMode(null);"area"===this._selectedView&&this._selectedArea===t.areaId&&(this._editMode=!0)}catch{this._rememberAreaEditMode(null)}}_showNotificationsUi(){return!1!==this.config?.settings?.show_notifications}_showSuggestedFavoritesUi(){return!1!==this.config?.settings?.show_suggested_favorites}_hasUsagePredictionComponent(){return Boolean(this.hass?.config?.components?.includes("usage_prediction"))}_isFavoriteEntityVisible(e){const t=this.hass?.states?.[e],i=V(this.hass)[e];return Boolean(t&&!g(t)&&!i?.hidden_by&&!i?.hidden)}_getManualFavoriteEntities(){const e=new Set;return(this.config?.favorites||[]).filter(t=>!e.has(t)&&(e.add(t),this._isFavoriteEntityVisible(t)))}_getEffectiveFavoriteEntities(){const e=this._getManualFavoriteEntities();if(!this._showSuggestedFavoritesUi())return e;const t=Math.max(8,e.length);if(e.length>=t)return e.slice(0,t);const i=new Set(e),a=this._suggestedFavoriteEntities.filter(e=>!i.has(e)&&(!!this._isFavoriteEntityVisible(e)&&(i.add(e),!0)));return[...e,...a].slice(0,t)}_ensureFavoriteSuggestionsFeature(){if(this.hass&&this._showSuggestedFavoritesUi()&&!this._favoriteSuggestionsLoaded&&!this._favoriteSuggestionsLoading)return this._hasUsagePredictionComponent()?void(this._getManualFavoriteEntities().length>=8||this._loadFavoriteSuggestions()):(this._favoriteSuggestionsLoaded=!0,void(this._suggestedFavoriteEntities=[]))}async _loadFavoriteSuggestions(){if(this.hass&&!this._favoriteSuggestionsLoading){this._favoriteSuggestionsLoading=!0;try{const e=await this.hass.callWS({type:"usage_prediction/common_control"});this._suggestedFavoriteEntities=Array.isArray(e?.entities)?e.entities.filter(e=>"string"==typeof e):[]}catch(e){console.debug("Dwains Dashboard: favorite suggestions are not available.",e),this._suggestedFavoriteEntities=[]}finally{this._favoriteSuggestionsLoading=!1,this._favoriteSuggestionsLoaded=!0}}}_ensurePersistentNotificationsFeature(){this._showNotificationsUi()&&this.hass&&!this._persistentNotificationsLoaded&&this.isConnected&&(this._persistentNotificationsLoaded=!0,this._loadPersistentNotifications(!1),this._ensurePersistentNotificationsSubscription())}static getStubConfig(){return{type:"custom:dwains-dashboard-next-layout-card",areas:[],devices:[],entities:[],floors:[],settings:{},favorites:[]}}connectedCallback(){super.connectedCallback(),window.addEventListener(X,this._handleTranslationsLoaded),this._syncThemeAttribute(!0),this._loadMobileEntityLayoutPreference(),this._loadAreaSidebarWidthPreference(),this._loadAreaSidebarCollapsedPreference(),this._checkMobile(),this._setupEventListeners(),window.addEventListener("dwains-dashboard-next-toggle-area-nav",this._handleAreaNavToggle),window.addEventListener("dwains-dashboard-next-open-settings",this._handleOpenSettingsEvent),window.addEventListener("dwains-dashboard-next-open-home",this._handleOpenHomeEvent),window.addEventListener(ge,this._handleWallTabletReset),this._startTimeUpdate(),this._initializeObservers(),this.hass&&this.config&&(this._ensurePersistentNotificationsFeature(),this._ensureHomeSummariesRefresh())}willUpdate(e){super.willUpdate(e),e.has("config")&&this.hass&&(this._clearEntityCardsCache(),j(this.hass,this.config?.settings),!this._canManageDashboard()&&this._editMode&&(this._editMode=!1,this._rememberAreaEditMode(null))),e.has("hass")&&this.hass&&(this._clockSettingsChanged(e.get("hass"),this.hass)&&this._updateTime(),this._syncThemeAttribute(),j(this.hass,this.config?.settings),this._syncBottomNavAreaContext(),this._reconcileOptimisticEntityStates(),!this._canManageDashboard()&&this._editMode&&(this._editMode=!1,this._rememberAreaEditMode(null)))}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this._deviceSettingsSavedTimer),window.removeEventListener(X,this._handleTranslationsLoaded),window.removeEventListener("dwains-dashboard-next-toggle-area-nav",this._handleAreaNavToggle),window.removeEventListener("dwains-dashboard-next-open-settings",this._handleOpenSettingsEvent),window.removeEventListener("dwains-dashboard-next-open-home",this._handleOpenHomeEvent),window.removeEventListener(ge,this._handleWallTabletReset),window.removeEventListener("pointermove",this._handleSidebarResizeMove),window.removeEventListener("pointerup",this._handleSidebarResizeEnd),window.removeEventListener("pointercancel",this._handleSidebarResizeEnd),this._persistentNotificationsSubscription.stop(),this._persistentNotificationsLoaded=!1,this._cleanupEventListeners(),this._cleanupObservers(),this._stopTimeUpdate(),this._stopHomeSummariesRefresh(),this._areaHeaderScrollRaf&&(cancelAnimationFrame(this._areaHeaderScrollRaf),this._areaHeaderScrollRaf=void 0),void 0!==this._areaSidebarRestoreRaf&&(cancelAnimationFrame(this._areaSidebarRestoreRaf),this._areaSidebarRestoreRaf=void 0),void 0!==this._optimisticCleanupTimer&&(window.clearTimeout(this._optimisticCleanupTimer),this._optimisticCleanupTimer=void 0),this._progressiveRenderCancel&&(this._progressiveRenderCancel(),this._progressiveRenderCancel=void 0),this._homeSceneFeedbackTimers.forEach(e=>window.clearTimeout(e)),this._homeSceneFeedbackTimers.clear(),this._homeSceneFeedback={},Re(this)}_setupEventListeners(){window.addEventListener("resize",this._handleResize),window.addEventListener("scroll",this._handleWindowScroll,{passive:!0}),this.addEventListener("show-more-info",this._handleShowMoreInfo)}_cleanupEventListeners(){window.removeEventListener("resize",this._handleResize),window.removeEventListener("scroll",this._handleWindowScroll),this.removeEventListener("show-more-info",this._handleShowMoreInfo)}_isDesktopAreaSidebarCollapsed(){return this._areaSidebarCollapsed&&!this._isMobile}_restoreAreaSidebarScroll(){this._isMobile||this._isDesktopAreaSidebarCollapsed()||(void 0!==this._areaSidebarRestoreRaf&&cancelAnimationFrame(this._areaSidebarRestoreRaf),this._areaSidebarRestoreRaf=requestAnimationFrame(()=>{this._areaSidebarRestoreRaf=void 0;const e=this.shadowRoot?.querySelector(".sidebar");if(!e)return;const t=Math.max(0,e.scrollHeight-e.clientHeight),i=Math.min(this._areaSidebarScrollTop,t);Math.abs(e.scrollTop-i)>1&&(e.scrollTop=i)}))}_scrollContentAreaToTop(){const e=this.shadowRoot?.querySelector(".content-area"),t=new Set;e&&t.add(e);(e=>{let i=e;for(;i;){if(i instanceof HTMLElement&&t.add(i),i.parentNode){i=i.parentNode;continue}const e=i.getRootNode();i=e instanceof ShadowRoot?e.host:null}})(e||this);for(const e of t)e.scrollTop=0,e.scrollLeft=0;const i=document.scrollingElement;i&&(i.scrollTop=0,i.scrollLeft=0),document.documentElement.scrollTop=0,document.documentElement.scrollLeft=0,document.body.scrollTop=0,document.body.scrollLeft=0,window.scrollTo(0,0)}_resetAreaHeaderScrollState(e=!1){this._areaHeaderScrollRaf&&(cancelAnimationFrame(this._areaHeaderScrollRaf),this._areaHeaderScrollRaf=void 0),e&&this._scrollContentAreaToTop(),this._pendingAreaScrollTop=0,this._areaHeaderStuck&&(this._areaHeaderStuck=!1),this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1),this._lastAreaScrollTop=0,this._areaScrollUpDistance=0}_resetAreaHeaderAfterNavigation(){this._resetAreaHeaderScrollState(!0),requestAnimationFrame(()=>this._resetAreaHeaderScrollState(!0)),requestAnimationFrame(()=>requestAnimationFrame(()=>this._resetAreaHeaderScrollState(!0))),window.setTimeout(()=>this._resetAreaHeaderScrollState(!0),80),window.setTimeout(()=>this._resetAreaHeaderScrollState(!0),220)}_resetProgressiveMobileRender(){this._renderAllMobileHomeAreas=!this._isMobile,this._renderAllMobileAreaEntities=!this._isMobile,this._progressiveRenderCancel&&(this._progressiveRenderCancel(),this._progressiveRenderCancel=void 0)}_scheduleProgressiveMobileRender(){if(!this._isMobile)return this._renderAllMobileHomeAreas=!0,void(this._renderAllMobileAreaEntities=!0);if(this._renderAllMobileHomeAreas&&this._renderAllMobileAreaEntities)return;if(this._progressiveRenderCancel)return;const e=()=>{this._progressiveRenderCancel=void 0,this._renderAllMobileHomeAreas=!0,this._renderAllMobileAreaEntities=!0},t=window.requestIdleCallback,i=window.cancelIdleCallback;if(t&&i){const a=t(e,{timeout:450});this._progressiveRenderCancel=()=>i(a)}else{const t=window.setTimeout(e,90);this._progressiveRenderCancel=()=>window.clearTimeout(t)}}_updateAreaHeaderScrollState(){const e=this.shadowRoot?.querySelector(".content-area");if(!this._isMobile||"area"!==this._selectedView||!e)return this._areaHeaderStuck&&(this._areaHeaderStuck=!1),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1));const t=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||e.scrollTop||0;this._setAreaHeaderStuckForScroll(t,!1)}_setAreaHeaderStuckForScroll(e,t){if(!this._isMobile||"area"!==this._selectedView)return this._areaHeaderStuck&&(this._areaHeaderStuck=!1),this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1),this._lastAreaScrollTop=0,void(this._areaScrollUpDistance=0);if(!t){this._lastAreaScrollTop=e,this._areaScrollUpDistance=0;const t=e>76;return this._areaHeaderStuck!==t&&(this._areaHeaderStuck=t),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1))}const i=e-this._lastAreaScrollTop;if(this._lastAreaScrollTop=e,e<=2)return this._areaScrollUpDistance=0,this._areaHeaderStuck&&(this._areaHeaderStuck=!1),void(this._areaHeaderRevealed&&(this._areaHeaderRevealed=!1));i<-1?this._areaScrollUpDistance+=Math.abs(i):i>1&&(this._areaScrollUpDistance=0);let a=this._areaHeaderStuck,o=this._areaHeaderRevealed;i>1&&e>76&&(a=!0,o=!1),this._areaHeaderStuck&&this._areaScrollUpDistance>=18&&e>88&&(o=!0),e<=38&&(a=!1,o=!1),this._areaHeaderStuck!==a&&(this._areaHeaderStuck=a),this._areaHeaderRevealed!==o&&(this._areaHeaderRevealed=o)}_checkMobile(){const e=this._isMobile;this._isMobile=window.innerWidth<=768,e!==this._isMobile&&(this._mobileNavOpen=!1)}_startTimeUpdate(){this._stopTimeUpdate(),this._updateTime(),this._scheduleNextTimeUpdate()}_scheduleNextTimeUpdate(){this._clockTimer=window.setTimeout(()=>{this._clockTimer=void 0,this._updateTime(),this._scheduleNextTimeUpdate()},U(Date.now())+50)}_stopTimeUpdate(){void 0!==this._clockTimer&&(window.clearTimeout(this._clockTimer),this._clockTimer=void 0)}_updateTime(){const e=W(new Date,{language:K(this.hass),time_format:this.hass?.locale?.time_format,time_zone:this.hass?.locale?.time_zone},this.hass?.config?.time_zone);this._currentTime=e.time,this._currentDate=e.date}_clockSettingsChanged(e,t){return!e||e.language!==t.language||e.locale!==t.locale||e.config?.time_zone!==t.config?.time_zone}_loadMobileEntityLayoutPreference(){try{const e=window.localStorage.getItem("dd-next-mobile-entity-layout"),t=window.localStorage.getItem("dd-next-mobile-home-areas-layout"),i=window.localStorage.getItem("dd-next-mobile-home-devices-layout"),a=window.localStorage.getItem("dd-next-mobile-home-favorites-layout"),o=window.localStorage.getItem("dd-next-mobile-home-cameras-layout"),r=window.localStorage.getItem("dd-next-mobile-home-scenes-layout");"rail"!==e&&"grid"!==e||(this._mobileEntityLayout=e),"rail"!==t&&"grid"!==t||(this._mobileHomeAreasLayout=t),"rail"!==i&&"grid"!==i||(this._mobileHomeDevicesLayout=i),"rail"!==a&&"grid"!==a||(this._mobileHomeFavoritesLayout=a),"rail"!==o&&"grid"!==o||(this._mobileHomeCamerasLayout=o),"rail"!==r&&"grid"!==r||(this._mobileHomeScenesLayout=r)}catch{}}_loadAreaSidebarWidthPreference(){try{const e=window.localStorage.getItem(Ot);if(!e)return;const t=Number(e);Number.isFinite(t)&&(this._areaSidebarWidth=this._clampAreaSidebarWidth(t))}catch{}}_saveAreaSidebarWidthPreference(e){try{window.localStorage.setItem(Ot,String(Math.round(e)))}catch{}}_loadAreaSidebarCollapsedPreference(){try{this._areaSidebarCollapsed="true"===window.localStorage.getItem(Rt)}catch{}}_saveAreaSidebarCollapsedPreference(e){try{window.localStorage.setItem(Rt,e?"true":"false")}catch{}}_clampAreaSidebarWidth(e){const t=Math.max(jt,Math.min(660,Math.floor(.46*window.innerWidth)));return Math.round(Math.max(jt,Math.min(t,e)))}_initializeObservers(){this._resizeObserver=new ResizeObserver(()=>{this._debouncedUpdate()}),this.shadowRoot&&this._resizeObserver.observe(this.shadowRoot.host)}_cleanupObservers(){this._resizeObserver&&this._resizeObserver.disconnect()}shouldUpdate(e){if(!this.config||!this.hass)return!1;if(e.has("config")||e.has("_selectedView")||e.has("_selectedArea")||e.has("_headerExpanded")||e.has("_currentTime"))return!0;if(e.has("hass")){const t=e.get("hass");return!t||(e.size>1||(!!this._isRelevantHassChange(t,this.hass)||(this._handleSkippedHassUpdate(),!1)))}return!0}_handleSkippedHassUpdate(){this._syncThemeAttribute(),j(this.hass,this.config?.settings),this._syncBottomNavAreaContext(),this._forwardHassToHostedCards(),Object.keys(this._optimisticEntityStates).length&&queueMicrotask(()=>this._reconcileOptimisticEntityStates())}_forwardHassToHostedCards(){const e=this.renderRoot;if(e){this._hostedCards??(this._hostedCards=Array.from(e.querySelectorAll("dwains-dashboard-next-card-host, dwains-dashboard-next-tile-host")));for(const e of this._hostedCards)e.hass!==this.hass&&(e.hass=this.hass)}}updated(e){if(super.updated(e),this._hostedCards=void 0,e.has("hass")&&this.hass){const t=e.get("hass");t&&this._updateEntityCards(t,this.hass),this._headerExpanded&&this._renderFavoriteTileCards(),this._ensurePersistentNotificationsFeature(),this._ensureHomeSummariesRefresh(),this._ensureFavoriteSuggestionsFeature()}e.has("config")&&(this._showNotificationsUi()?this._ensurePersistentNotificationsFeature():(this._notificationsOpen=!1,this._persistentNotificationsSubscription.stop(),this._persistentNotificationsLoaded=!1,this._persistentNotifications=[]),this._showSuggestedFavoritesUi()?this._ensureFavoriteSuggestionsFeature():(this._favoriteSuggestionsLoaded=!1,this._favoriteSuggestionsLoading=!1,this._suggestedFavoriteEntities=[])),(e.has("_selectedView")||e.has("_selectedArea")||e.has("config"))&&(this._syncBottomNavAreaContext(),this._restoreAreaSidebarScroll()),e.has("_isMobile")&&this._restoreAreaSidebarScroll(),e.has("_headerExpanded")&&this._headerExpanded&&this.hass&&setTimeout(()=>{this._renderFavoriteTileCards()},0),(e.has("_selectedView")||e.has("_selectedArea"))&&(this._resetProgressiveMobileRender(),"area"===this._selectedView?this._resetAreaHeaderAfterNavigation():this._resetAreaHeaderScrollState(!1)),(e.has("_selectedView")||e.has("_selectedArea")||e.has("_isMobile")||this._isMobile&&(!this._renderAllMobileHomeAreas||!this._renderAllMobileAreaEntities))&&this._scheduleProgressiveMobileRender(),"settings"===this._selectedView&&this._syncSettingsEditor()}_syncThemeAttribute(e=!1){G(this,this.hass,e)}_isRelevantHassChange(e,t){if(!this.config)return!1;if(function(e,t){const i=e,a=t;for(const e in a)if("states"!==e&&i[e]!==a[e])return!0;for(const e in i)if("states"!==e&&!(e in a))return!0;return!1}(e,t))return!0;if("settings"===this._selectedView)return st(e.states,t.states,nt);const i=this._nowPlayingShown();if("area"===this._selectedView&&this._selectedArea){const a=this._areaRelevantEntityIds(this._selectedArea);return st(e.states,t.states,(e,t,o)=>!t||!o||a.has(e)||nt(e,t,o)||i&&Ne(e,t,o))}if("home"===this._selectedView){const a=this._homeExplicitEntityIds(this.config,t.areas,this._suggestedFavoriteEntities);return st(e.states,t.states,(e,t,o)=>function(e,t,i,a){if(a.has(e))return!0;if(!t||!i)return!0;if(g(t)!==g(i))return!0;if(t.attributes?.area_id!==i.attributes?.area_id)return!0;const o=function(e){const t=e.indexOf(".");return-1===t?e:e.slice(0,t)}(e);return ct.has(o)?t.state!==i.state:!!dt.has(o)||("climate"===o?t.state!==i.state||t.attributes?.hvac_action!==i.attributes?.hvac_action:"update"===o?t.state!==i.state:"binary_sensor"===o?!(!pt(t)&&!pt(i)||t.state===i.state&&t.attributes?.device_class===i.attributes?.device_class):"sensor"===o&&(mt(t)||mt(i)))}(e,t,o,a)||i&&Ne(e,t,o))}return!0}_areaRelevantEntityIds(e){const t=x(this.config).get(e),i=this.hass?.areas?.[e];return this._areaRelevantEntityIdSet(this._getAreaEntities(e),i?.temperature_entity_id||t?.temperature_entity_id||"",i?.humidity_entity_id||t?.humidity_entity_id||"")}render(){if(!this.hass||!this.config)return c`<div class="loading">${this._t("common.loading")}</div>`;const e=this._isMobile&&this._getNowPlayingPlayers().length>0,t={"layout-container":!0,"sidebar-resizing":this._isResizingSidebar,"sidebar-collapsed":this._isDesktopAreaSidebarCollapsed(),"has-floating-now-playing":e};return c`
      <div
        class=${d(t)}
        style=${`--area-sidebar-width: ${this._areaSidebarWidth}px;`}
      >
        ${this._renderMobileOverlay()}
        ${this._renderSidebar()}
        ${this._isMobile?o:this._renderSidebarResizeHandle()}
        <div class="main-content">
          ${"area"!==this._selectedView||this._isMobile?o:this._renderGlobalHeader()}
          <div
            class="content-area ${"home"===this._selectedView?"home-content-area":""} ${"area"===this._selectedView?"area-content-area":""} ${"settings"===this._selectedView?"settings-content-area":""}"
            @scroll=${this._handleContentScroll}
          >
            ${"home"===this._selectedView?this._renderHomeView():"area"===this._selectedView&&this._selectedArea?this._renderAreaView():"settings"===this._selectedView?this._renderSettingsView():o}
          </div>
        </div>
      </div>
      ${e?this._renderNowPlayingBar(!0):o}
      ${this._renderNotificationsPanel()}
    `}_renderSidebarResizeHandle(){const e=this._isDesktopAreaSidebarCollapsed();return c`
      <button
        class="sidebar-collapse-toggle ${e?"is-collapsed":""}"
        type="button"
        title=${e?this._t("sidebar.show"):this._t("sidebar.collapse")}
        aria-label=${e?this._t("sidebar.show"):this._t("sidebar.collapse")}
        @click=${this._toggleAreaSidebarCollapsed}
      >
        <ha-icon icon=${e?"mdi:chevron-right":"mdi:chevron-left"}></ha-icon>
      </button>
      ${e?o:c`
      <button
        class="sidebar-resize-handle"
        type="button"
        role="separator"
        aria-label=${this._t("sidebar.resize")}
        aria-orientation="vertical"
        aria-valuemin=${jt}
        aria-valuemax=${660}
        aria-valuenow=${this._areaSidebarWidth}
        title=${this._t("sidebar.resize_drag")}
        @pointerdown=${this._startSidebarResize}
        @keydown=${this._handleSidebarResizeKeydown}
      ></button>
      `}
    `}_renderMobileOverlay(){return this._isMobile?c`
      <div
        class="mobile-nav-overlay ${this._mobileNavOpen?"open":""}"
        @click=${this._closeMobileNav}
      ></div>
    `:o}_nowPlayingShown(){return ke($e(this.config?.settings?.now_playing_bar),this._selectedView)}_getNowPlayingPlayers(){return this.hass&&this._nowPlayingShown()?this._nowPlayingPlayers(this.hass,this.hass.states,this.config,V(this.hass),this._currentTime):[]}_renderNowPlayingBar(e){const t=this._getNowPlayingPlayers();return t.length?c`
      <dwains-dashboard-next-now-playing
        class=${e?"floating":"inline"}
        .hass=${this.hass}
        .players=${t}
        .floating=${e}
      ></dwains-dashboard-next-now-playing>
    `:o}_renderNotificationsPanel(){if(!this._showNotificationsUi())return o;const e=this._persistentNotifications.length,t=e>0;return c`
      <div
        class="notifications-overlay ${this._notificationsOpen?"open":""}"
        @click=${this._closeNotifications}
      ></div>
      <section
        class="notifications-panel ${this._notificationsOpen?"open":""}"
        aria-hidden=${this._notificationsOpen?"false":"true"}
      >
        <div class="notifications-head">
          <div class="notifications-title">
            <div class="notifications-title-row">
              <ha-icon icon="mdi:bell-outline"></ha-icon>
              <span>${this._t("home.notifications")}</span>
            </div>
            <div class="notifications-subtitle">
              ${t?`${e} ${this._t(1===e?"home.notification":"home.notifications").toLocaleLowerCase()}`:this._t("home.notifications_description")}
            </div>
          </div>
          <div class="notifications-actions">
            ${t?c`
              <button
                class="notifications-icon-button"
                type="button"
                title=${this._t("common.dismiss_all")}
                @click=${this._dismissAllPersistentNotifications}
              >
                <ha-icon icon="mdi:delete-sweep-outline"></ha-icon>
              </button>
            `:o}
            <button
              class="notifications-icon-button"
              type="button"
              title=${this._t("common.refresh")}
              @click=${()=>this._loadPersistentNotifications(!0)}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
            <button
              class="notifications-icon-button"
              type="button"
              title=${this._t("common.close")}
              @click=${this._closeNotifications}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
        </div>

        <div class="notifications-list">
          ${this._notificationsLoading&&!t?c`
                <div class="notifications-loading">
                  <ha-icon icon="mdi:loading"></ha-icon>
                  <span>${this._t("home.notifications_loading")}</span>
                </div>
              `:this._notificationsError?c`
                  <div class="notifications-error">
                    <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
                    <span>${this._notificationsError}</span>
                  </div>
                `:t?this._persistentNotifications.map(e=>this._renderPersistentNotification(e)):c`
                    <div class="notifications-empty">
                      <ha-icon icon="mdi:bell-check-outline"></ha-icon>
                      <span>${this._t("home.notifications_empty")}</span>
                    </div>
                  `}
        </div>
      </section>
    `}_renderPersistentNotification(e){return c`
      <article class="notification-row">
        <div class="notification-icon">
          <ha-icon icon="mdi:bell-badge-outline"></ha-icon>
        </div>
        <div class="notification-copy">
          <div class="notification-title">${e.title||this._t("home.notification")}</div>
          <div class="notification-message">${this._renderNotificationMessage(e.message)}</div>
          ${e.created_at?c`
            <div class="notification-date">${this._formatNotificationDate(e.created_at)}</div>
          `:o}
        </div>
        <button
          class="notification-dismiss"
          type="button"
          title=${this._t("common.dismiss")}
          @click=${()=>this._dismissPersistentNotification(e.notification_id)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </article>
    `}_renderNotificationMessage(e){return customElements.get("ha-markdown")?c`<ha-markdown class="notification-markdown" breaks .content=${e}></ha-markdown>`:(this._waitingForHaMarkdown||(this._waitingForHaMarkdown=!0,customElements.whenDefined("ha-markdown").then(()=>this.requestUpdate())),e)}_renderSidebar(){const e={sidebar:!0,open:this._isMobile&&this._mobileNavOpen},t=this._showNotificationsUi()&&this._persistentNotifications.length>0;return c`
      <nav class=${d(e)} @scroll=${this._handleSidebarScroll}>
        <div class="area-list">
          <div
            class="area-button home-button ${"home"===this._selectedView?"selected":""} ${t?"has-notifications":""}"
          >
            <button
              class="area-button-action"
              type="button"
              aria-label=${this._t("sidebar.home")}
              aria-current=${"home"===this._selectedView?"page":o}
              @click=${()=>this._selectView("home")}
            ></button>
            <div class="area-icon" aria-hidden="true">
              <ha-icon icon="mdi:home"></ha-icon>
            </div>
            <div class="area-info" aria-hidden="true">
              <div class="area-name">${this._t("sidebar.home")}</div>
            </div>
            ${this._renderHomeNotificationShortcut()}
            <ha-icon class="area-menu-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
          </div>

          ${this._renderAreaButtons()}
        </div>
      </nav>
    `}_renderHomeNotificationShortcut(){if(!this._showNotificationsUi())return o;const e=this._persistentNotifications.length;if(!e)return o;const t=`${e} ${this._t(1===e?"home.notification":"home.notifications").toLocaleLowerCase()}`,i=e>99?"99+":String(e);return c`
      <button
        class="home-notification-shortcut"
        type="button"
        title=${t}
        aria-label=${t}
        @click=${this._openNotificationsFromHomeShortcut}
      >
        <ha-icon icon="mdi:bell-outline"></ha-icon>
        <span class="home-notification-count">${i}</span>
      </button>
    `}_groupAreasByFloor(e){const t={};return e.forEach(e=>{let i="no_floor";if(e.floor_id&&this.config?.floors){const t=this.config.floors.find(t=>t.floor_id===e.floor_id);t?.name&&(i=t.name)}t[i]||(t[i]=[]),t[i].push(e)}),t}_getVisibleSortedAreas(){return this.config?.areas?this._visibleSortedAreas(this.config.areas,this.config.areas_display,K(this.hass)):[]}_renderAreaButtons(){if(!this.config?.areas)return o;const e=this._getVisibleSortedAreas(),t=this._groupAreasByFloor(e),i=[...this.config.floors||[]],a=this.config.floors_display?.order||[];if(a.length){const e=new Map(a.map((e,t)=>[e,t]));i.sort((t,i)=>(e.get(t.floor_id)??Number.MAX_SAFE_INTEGER)-(e.get(i.floor_id)??Number.MAX_SAFE_INTEGER))}const r=new Map(i.map((e,t)=>[e.name,t])),s=Q(K(this.hass),{numeric:!0,sensitivity:"base"}),n=Object.entries(t).sort(([e],[t])=>{if("no_floor"===e)return 1;if("no_floor"===t)return-1;const i=r.get(e),a=r.get(t);return void 0!==i||void 0!==a?(i??Number.MAX_SAFE_INTEGER)-(a??Number.MAX_SAFE_INTEGER):s.compare(e,t)});return n.map(([e,t])=>{const i="no_floor"===e?this.hass.localize("ui.components.area-picker.no_floor")||this._t("home.unassigned_spaces"):e;return c`
        <div class="floor-section">
          <div class="floor-header">
            <h3>${i}</h3>
          </div>
          <div class="floor-areas">
            ${v(t,e=>e.area_id,e=>this._renderAreaButton(e))}
          </div>
        </div>
      `})}_renderAreaButton(e){const t=this._getCachedAreaData(e),i=this._selectedArea===e.area_id,a=!!e.picture,r=a?this._getPictureContrastClass(e.picture):"",s=[t.temperature,t.humidity,t.wattage].filter(Boolean),n=s.join(" • "),d=t.domains.light?.on||0,l=this._tp("sidebar.turn_off_area_lights",d,{area:e.name});return c`
          <div
            class="area-button ${i?"selected":""} ${a?"has-picture":""} ${r}"
          >
            <button
              class="area-button-action"
              type="button"
              aria-label=${[e.name,...s].join(", ")}
              aria-current=${"area"===this._selectedView&&i?"page":o}
              @click=${()=>this._selectArea(e.area_id)}
            ></button>
            ${a?c`
              <div class="area-background" style="background-image: url('${e.picture}');"></div>
            `:o}

            <div class="area-content">
              <!-- Top section: Name and sensors -->
              <div class="area-top-section" aria-hidden="true">
              <div class="area-name">${e.name}</div>
              ${n?c`
                <div class="area-sensors">${n}</div>
              `:o}
            </div>

              <!-- Bottom section: Icon and badges -->
              <div class="area-bottom-section">
                <!-- Left: Main area icon -->
                <div class="area-main-icon" aria-hidden="true">
                  <ha-icon icon=${f(e)}></ha-icon>
                </div>

                <!-- Right: Info badges -->
                <div class="area-info-badges">
                  ${d>0?c`
                    <button
                      class="info-badge light clickable area-light-toggle"
                      type="button"
                      style=${this._domainBadgeStyle("light")}
                      title=${l}
                      aria-label=${l}
                      @click=${t=>this._handleLightToggle(t,e.area_id)}
                    >
                      <ha-icon icon=${y("light")}></ha-icon>
                      <span class="badge-count">${d}</span>
                    </button>
                  `:o}

                  ${t.domains.switch&&t.domains.switch.on>0?c`
                    <span aria-hidden="true" class="info-badge switch" style=${this._domainBadgeStyle("switch")}>
                      <ha-icon icon=${y("switch")}></ha-icon>
                      <span class="badge-count">${t.domains.switch.on}</span>
                    </span>
                  `:o}

                  ${t.domains.climate&&t.domains.climate.on>0?c`
                    <span aria-hidden="true" class="info-badge climate" style=${this._domainBadgeStyle("climate")}>
                      <ha-icon icon=${y("climate")}></ha-icon>
                      <span class="badge-count">${t.domains.climate.on}</span>
                    </span>
                  `:o}

                  ${t.domains.media_player&&t.domains.media_player.on>0?c`
                    <span aria-hidden="true" class="info-badge media_player" style=${this._domainBadgeStyle("media_player")}>
                      <ha-icon icon=${y("media_player")}></ha-icon>
                      <span class="badge-count">${t.domains.media_player.on}</span>
                    </span>
                  `:o}

                  ${t.domains.cover&&t.domains.cover.on>0?c`
                    <span aria-hidden="true" class="info-badge cover" style=${this._domainBadgeStyle("cover")}>
                      <ha-icon icon=${y("cover")}></ha-icon>
                      <span class="badge-count">${t.domains.cover.on}</span>
                    </span>
                  `:o}

                  ${t.domains.fan&&t.domains.fan.on>0?c`
                    <span aria-hidden="true" class="info-badge fan" style=${this._domainBadgeStyle("fan")}>
                      <ha-icon icon=${y("fan")}></ha-icon>
                      <span class="badge-count">${t.domains.fan.on}</span>
                    </span>
                  `:o}

                  ${t.domains.motion&&t.domains.motion.on>0?c`
                    <span aria-hidden="true" class="info-badge motion" style=${this._domainBadgeStyle("binary_sensor","motion")}>
                      <ha-icon icon=${w("binary_sensor","motion")}></ha-icon>
                      <span class="badge-count">${t.domains.motion.on}</span>
                    </span>
                  `:o}

            ${t.alerts.length>0?c`
                    <span aria-hidden="true" class="info-badge alerts">
                      <ha-icon icon="mdi:alert-circle"></ha-icon>
                      <span class="badge-count">${t.alerts.length}</span>
                    </span>
            `:o}
                </div>
              </div>
            </div>
            <ha-icon class="area-menu-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
          </div>
        `}_renderGlobalHeader(){const e={"global-header":!0,compact:this._headerCompact,expanded:this._headerExpanded,mobile:this._isMobile};return c`
      <header class=${d(e)}>
        <div class="header-content">
          ${this._renderHeaderStatusCards()}

          ${this._isMobile?o:c`
            <div class="header-time-weather">
              ${!1!==this.config?.settings?.show_time?c`
                <div class="header-time-section" data-dd-wall-tablet-hold>
              <div class="header-time">${this._currentTime}</div>
              <div class="header-date">${this._currentDate}</div>
            </div>
          `:o}
          ${this._renderWeatherDisplay()}
            </div>
          `}
        </div>

        <!-- Expanded content section (always in DOM to avoid Lit marker invalidation) -->
        <div class="header-expanded-content" style=${this._headerExpanded?"":"display:none"}>
          <div class="header-favorites">
            ${this._renderFavoritesSection()}
          </div>
        </div>

        ${"home"!==this._selectedView?this._renderHeaderExpandButton():o}
      </header>
    `}_renderWeatherDisplay(){if(!this._weatherDisplayEnabled())return o;const e=this._getWeatherEntity();if(!e)return o;const t=this._formatWeatherTemperature(e);return t?c`
      <button
        class="weather-compact"
        type="button"
        title=${this._weatherTitle(e)}
        aria-label=${this._weatherTitle(e)}
        @click=${()=>this._showMoreInfo(e.entity_id)}
      >
        <span class="weather-icon-compact">
          <ha-icon icon=${e.attributes.icon||"mdi:weather-cloudy"}></ha-icon>
        </span>
        <span class="weather-temp-compact">
          ${t}
        </span>
      </button>
    `:o}_renderHeaderStatusCards(){const e=this._getStatusDomains();return c`
      <div class="header-status-section">
        <div class="header-status-scroll">
          ${v(e,e=>`${e.domain}-${e.deviceClass||e.name}`,e=>c`
              <div
                class="status-card-compact ${e.domain} ${e.value?"has-value":""} header-card"
                style=${this._domainStatusStyle(e.domain,e.deviceClass)}
                role="button"
                tabindex="0"
                @click=${()=>this._handleStatusCardClick(e)}
                @keydown=${t=>this._handleActivationKeydown(t,()=>this._handleStatusCardClick(e))}
                data-domain=${e.domain}
                title=${this._statusCardTitle(e)}
                aria-label=${this._statusCardAccessibleLabel(e)}
              >
                <div class="status-card-icon-compact">
                  <ha-icon icon=${e.icon}></ha-icon>
                  ${e.count>0?c`
                    <div class="status-card-badge-compact">${e.count}</div>
                  `:o}
                </div>
                <div class="status-card-title-compact">${e.value||this._statusCardTitle(e)}</div>
                ${e.value?c`<div class="status-card-subtitle-compact">${e.name}</div>`:o}
              </div>
            `)}
        </div>
      </div>
    `}_renderHeaderExpandButton(){const e=this._getHiddenStatusCount();return c`
      <button
        class="header-expand-button"
        type="button"
        aria-expanded=${this._headerExpanded?"true":"false"}
        aria-label=${this._t(this._headerExpanded?"favorites.hide_header":"favorites.show_header")}
        title=${this._t(this._headerExpanded?"favorites.hide_header":"favorites.show_header")}
        @click=${this._toggleHeader}
        data-extra-count=${Ue(e||void 0)}
      >
        <ha-icon icon=${this._headerExpanded?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>
    `}_domainStatusStyle(e,t){return`--status-color: ${k(e,t)};`}_domainBadgeStyle(e,t){const i=k(e,t);return`--badge-color: ${i}; --area-badge-color: ${i};`}_statusCardTitle(e){const t=this._statusCardActiveLabel(e);if(t){if(1===e.count&&1===e.entities?.length){const i=this._entityAreaName(e.entities[0]);return i?`${t.singular} · ${i}`:t.singular}return t.plural}if("person"!==e.domain&&1===e.count&&1===e.entities?.length){const t=this._entityAreaName(e.entities[0]);if(t)return`${e.name} · ${t}`}return e.name}_statusCardAccessibleLabel(e){const t=this._statusCardTitle(e);return e.value?`${t}: ${e.value}`:e.count>0?`${t}: ${e.count}`:t}_statusLabel(e,t,i=!0){const a=i?this._tp(e,t):this._t(e,{count:t}),o=String(t);if(!a.startsWith(o))return a;const r=a.slice(o.length).trim();return r.charAt(0).toLocaleUpperCase()+r.slice(1)}_statusPair(e,t=!0){return{singular:this._statusLabel(e,1,t),plural:this._statusLabel(e,2,t)}}_statusCardActiveLabel(e){if("person"!==e.domain){if("light"===e.domain)return this._statusPair("status.light_on");if("switch"===e.domain)return this._statusPair("status.switch_on");if("cover"===e.domain)return this._statusPair("status.cover_open");if("fan"===e.domain)return this._statusPair("status.fan_on");if("lock"===e.domain)return this._statusPair("status.lock_unlocked");if("climate"===e.domain)return this._statusPair("status.climate_active");if("media_player"===e.domain)return this._statusPair("status.media_playing");if("vacuum"===e.domain)return this._statusPair("status.vacuum_cleaning");if("alarm_control_panel"===e.domain)return this._statusPair("status.alarm_armed");if("binary_sensor"===e.domain)switch(e.deviceClass){case"door":return this._statusPair("status.door_open");case"window":return this._statusPair("status.window_open");case"opening":return this._statusPair("status.opening_open");case"motion":return this._statusPair("status.motion_detected",!1);case"smoke":return this._statusPair("status.smoke_detected",!1);case"gas":return this._statusPair("status.gas_detected",!1);case"moisture":return this._statusPair("status.moisture_detected",!1);case"occupancy":return this._statusPair("status.occupancy_detected",!1);case"presence":return this._statusPair("status.presence_detected",!1);case"tamper":return this._statusPair("status.tamper_detected",!1);case"vibration":return this._statusPair("status.vibration_detected",!1);case"safety":return this._statusPair("status.safety_active",!1);default:return}}}_entityAreaName(e){const t=$(this.hass,this.config,e);return t?x(this.config).get(t)?.name:void 0}_renderHomeView(){const e=this._getVisibleHomeSections();return c`
      <div class="home-view">
        ${this._renderHomeWelcome()}
        ${this._isMobile?o:this._renderNowPlayingBar(!1)}
        ${e.map(e=>this._renderHomeSection(e))}
      </div>
    `}_getHomeSectionsOrder(){return Se(this.config?.settings?.home_sections_order)}_getVisibleHomeSections(){const e=new Set(Ce(this.config?.settings?.home_sections_hidden)),t=this._isDesktopAreaSidebarCollapsed();return this._getHomeSectionsOrder().filter(i=>!e.has(i)||t&&"areas"===i)}_homeInformationCardVisible(e){return!new Set(Ee(this.config?.settings?.home_information_cards_hidden)).has(e)}_renderHomeSection(e){switch(e){case"summaries":return this._renderHomeSummaries();case"cameras":return this._renderHomeCameras();case"areas":return this._renderMobileHomeAreas();case"devices":return this._renderHomeStatusCards();case"todos":return this._renderHomeTodos();case"custom_cards":return this._renderHomeCustomCards();case"favorites":return this._renderFavorites();case"scenes":return this._renderHomeScenes();default:return o}}_renderMobileSectionHeading(e,t,i={}){const{toggle:a,onSeeAll:r}=i;return c`
      <div class="mobile-section-heading">
        <div class="mobile-section-title">
          <span class="mobile-section-icon" aria-hidden="true">
            <ha-icon icon=${Ae[e].icon}></ha-icon>
          </span>
          <span class="mobile-section-title-label">${t}</span>
        </div>
        ${a||r?c`
          <div class="mobile-section-tools">
            ${a?c`
              <button
                class="mobile-section-toggle"
                type="button"
                title=${a.title}
                aria-label=${a.label}
                @click=${a.onToggle}
              >
                <ha-icon icon=${a.gridMode?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
              </button>
            `:o}
            ${r?c`
              <button class="mobile-section-action" type="button" @click=${r}>
                <span>${this._t("common.see_all")}</span>
                <ha-icon icon="mdi:chevron-right"></ha-icon>
              </button>
            `:o}
          </div>
        `:o}
      </div>
    `}_renderHomeSummaries(){const e=this._getHomeSummaryCards();return e.length?c`
      <section class="home-summaries-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:clipboard-list-outline"></ha-icon>
          <span>${this._t("home.summaries")}</span>
        </div>
        ${this._renderMobileSectionHeading("summaries",this._t("home.summaries"))}
        <div class="home-summary-list">
          ${v(e,e=>e.key,e=>c`
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
    `:o}_renderHomeTodos(){const e=this._getHomeTodoEntities();if(!e.length)return o;const t=this._t("home_section.todos.label");return c`
      <section class="home-todos-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:format-list-checks"></ha-icon>
          <span>${t}</span>
        </div>
        ${this._renderMobileSectionHeading("todos",t)}
        <div class="home-todos-grid">
          ${v(e,e=>e,e=>c`
              <div class="home-todo-card" data-entity=${e}>
                <dwains-dashboard-next-card-host
                  eager
                  .hass=${this.hass}
                  .config=${{type:"todo-list",entity:e,title:this.hass.states[e]?.attributes?.friendly_name||V(this.hass)[e]?.name||e}}
                ></dwains-dashboard-next-card-host>
              </div>
            `)}
        </div>
      </section>
    `}_getHomeCustomCards(){const e=this.config?.home_custom_cards;return Array.isArray(e)?e.filter(e=>Boolean(e?.id)&&Boolean(e?.card)&&"object"==typeof e.card&&"string"==typeof e.card.type):[]}_renderHomeCustomCards(){const e=this._getHomeCustomCards();if(!e.length)return o;const t=this._t("home_section.custom_cards.label");return c`
      <section class="home-custom-cards-section">
        <div class="home-status-heading">
          <ha-icon icon="mdi:cards-outline"></ha-icon>
          <span>${t}</span>
        </div>
        ${this._renderMobileSectionHeading("custom_cards",t)}
        <div class="home-custom-cards-grid">
          ${v(e,e=>e.id,e=>c`
              <div class="home-custom-card">
                <dwains-dashboard-next-card-host
                  eager
                  .hass=${this.hass}
                  .config=${e.card}
                ></dwains-dashboard-next-card-host>
              </div>
            `)}
        </div>
      </section>
    `}_getHomeTodoEntities(){return this.hass?this._homeTodoEntities(this.hass.states,V(this.hass),this.hass.language):[]}_getHomeSummaryCards(){if(!this.hass?.user?.is_admin)return[];const e=[],t=this._getUpdateEntityCount();return this._repairsIssueCount>0&&e.push({key:"repairs",label:this._t("home.repairs"),subtitle:this._tp("summary.issue",this._repairsIssueCount),icon:"mdi:wrench",color:"#f59e0b",count:this._repairsIssueCount,path:"/config/repairs"}),t>0&&e.push({key:"updates",label:this._t("home.updates"),subtitle:this._tp("summary.update_available",t),icon:"mdi:package-up",color:"#0ea5e9",count:t,path:"/config/updates"}),this._discoveredDeviceCount>0&&e.push({key:"discovered",label:this._t("home.devices_discovered"),subtitle:this._tp("summary.device_to_add",this._discoveredDeviceCount),icon:"mdi:devices",color:"#1494aa",count:this._discoveredDeviceCount,path:"/config/integrations"}),e}_openHomeAssistantPage(e){this._closeMobileNav(),R(e)}_renderHomeWelcome(){const e=this.hass?.user?.name||"User",t=this._getGreeting(),i=this._weatherDisplayEnabled()?this._getWeatherEntity():void 0,a=this._formatWeatherTemperature(i),r=this._getWelcomeUserPicture(e),s=this._userInitials(this.hass?.user?.name||""),n=this._renderHomeAlarm();return c`
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
                ${r?c`<img src=${r} alt=${e} />`:s?c`<span class="welcome-avatar-initials" aria-hidden="true">${s}</span>`:c`<ha-icon icon="mdi:account"></ha-icon>`}
              </button>
              <div class="welcome-copy" data-dd-wall-tablet-hold>
                <div class="welcome-text">
                  <span class="welcome-greeting">${t},</span>
                  <span class="welcome-name">${e}</span>
                  <span class="welcome-title">${t}, ${e}</span>
                </div>
                <div class="welcome-return">${this._getHomeSnapshotText(i)}</div>
              </div>
            </div>
            <div class="welcome-actions">
              ${this._canManageDashboard()?c`
                <button
                  class="welcome-action"
                  type="button"
                  title=${this._t("sidebar.dashboard_settings")}
                  @click=${this._openDashboardSettings}
                >
                  <ha-icon icon="mdi:cog-outline"></ha-icon>
                </button>
              `:o}
              ${this._showNotificationsUi()?c`
                <button
                  class="welcome-action"
                  type="button"
                  title=${this._t("home.notifications")}
                  @click=${this._openNotifications}
                >
                  <ha-icon icon="mdi:bell-outline"></ha-icon>
                  ${this._persistentNotifications.length?c`<span class="welcome-action-badge">${this._persistentNotifications.length}</span>`:o}
                </button>
              `:o}
            </div>
            <div class="welcome-time-section" data-dd-wall-tablet-hold>
              <div class="welcome-time">${this._currentTime}</div>
              <div class="welcome-date">${this._currentDate}</div>
            </div>
          </div>
          ${n!==o||a?c`
            <div class="welcome-subheader">
              ${n}
              ${i&&a?c`
                <button
                  class="welcome-weather"
                  type="button"
                  title=${this._weatherTitle(i)}
                  aria-label=${this._weatherTitle(i)}
                  @click=${()=>this._showMoreInfo(i.entity_id)}
                >
                  <ha-icon icon=${i.attributes.icon||"mdi:weather-cloudy"}></ha-icon>
                  <span class="weather-temp">${a}</span>
                  <span class="weather-label">${this._t("home.outside")}</span>
                </button>
              `:o}
            </div>
          `:o}
        </div>
      </div>
    `}_renderHomeStatusCards(){const e=this._getStatusDomains(),t=this._homeInformationCardVisible("device_groups")?e.filter(e=>"person"!==e.domain&&"wattage"!==e.domain&&"camera"!==e.domain):[],i="grid"===this._mobileHomeDevicesLayout,a=[this._homeInformationCardVisible("people")?this._renderHousePersonsStatusCard():o,this._homeInformationCardVisible("climate")?this._renderHouseClimateStatusCard("indoor"):o,this._homeInformationCardVisible("outdoor_climate")?this._renderHouseClimateStatusCard("outdoor"):o,this._homeInformationCardVisible("power")?this._renderHousePowerStatusCard():o,...t.map(e=>c`
        <div
          class="home-status-card ${e.domain} ${e.value?"has-value":""}"
          style=${this._domainStatusStyle(e.domain,e.deviceClass)}
          role="button"
          tabindex="0"
          @click=${()=>this._handleStatusCardClick(e)}
          @keydown=${t=>this._handleActivationKeydown(t,()=>this._handleStatusCardClick(e))}
          data-domain=${e.domain}
          title=${this._statusCardTitle(e)}
          aria-label=${this._statusCardAccessibleLabel(e)}
        >
          <div class="status-card-icon">
            <ha-icon icon=${e.icon}></ha-icon>
            ${e.count>0?c`
              <div class="status-card-badge">${e.count}</div>
            `:o}
          </div>
          ${e.value?c`<div class="status-card-value">${e.value}</div>`:o}
          <div class="status-card-title">${this._statusCardTitle(e)}</div>
        </div>
      `)].filter(e=>e!==o);return a.length?c`
      <div class="home-status-section layout-${this._mobileHomeDevicesLayout}">
        <div class="home-status-heading">
          <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
          <span>${this._t("home.house_information")}</span>
        </div>
        ${this._renderMobileSectionHeading("devices",this._t("home.house_information"),{toggle:{gridMode:i,title:i?this._t("home.swipe_house_information"):this._t("home.show_all_house_information"),label:i?this._t("home.switch_house_information_swipe"):this._t("home.show_all_house_information"),onToggle:this._toggleMobileHomeDevicesLayout},onSeeAll:this._openMobileDeviceSwitcher})}
        <div class="home-status-grid">
          ${a}
        </div>
      </div>
    `:o}_renderHomeCameras(){const e=this._getHomeAreaCameras();if(!e.length)return o;const t="grid"===this._mobileHomeCamerasLayout;return c`
      <section class="home-camera-section layout-${this._mobileHomeCamerasLayout}">
        <div class="home-status-heading">
          <ha-icon icon="mdi:cctv"></ha-icon>
          <span>${this._t("home.cameras")}</span>
        </div>
        ${this._renderMobileSectionHeading("cameras",this._t("home.cameras"),{toggle:{gridMode:t,title:t?this._t("home.swipe_cameras"):this._t("home.show_all_cameras"),label:t?this._t("home.switch_cameras_swipe"):this._t("home.show_all_cameras"),onToggle:this._toggleMobileHomeCamerasLayout}})}
        <div class="home-camera-grid">
          ${v(e,e=>`${e.areaId}-${e.entityId}`,e=>this._renderHomeCameraCard(e))}
        </div>
      </section>
    `}_renderHomeCameraCard(e){return c`
      <button
        class="home-camera-card"
        type="button"
        title=${e.name}
        @click=${()=>this._showMoreInfo(e.entityId)}
      >
        ${e.imageUrl?c`<div class="home-camera-image" style=${`background-image: url('${e.imageUrl}');`}></div>`:c`
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
    `}_getHomeAreaCameras(){const e=[],t=new Set(this.config?.settings?.home_cameras_hidden||[]),i=this.config?.settings?.home_camera_order||[],a=new Map(i.map((e,t)=>[e,t]));return this._getVisibleSortedAreas().forEach(i=>{this._getFilteredAreaEntities(i.area_id).filter(e=>e.entity_id.startsWith("camera.")).filter(e=>!t.has(e.entity_id)).filter(e=>{const t=this.hass?.states?.[e.entity_id]?.state;return Boolean(t&&"unavailable"!==t&&"unknown"!==t)}).forEach(t=>{const a=this.hass.states[t.entity_id],o=a?.attributes?.friendly_name||t.entity_id,r=a?this.hass.formatEntityState(a):this._t("common.unknown"),s=this._getCameraImageUrl(t.entity_id),n={areaId:i.area_id,areaName:i.name,areaIcon:f(i),entityId:t.entity_id,name:o,state:r};s&&(n.imageUrl=s),e.push(n)})}),e.sort((e,t)=>{const i=a.get(e.entityId),o=a.get(t.entityId);return void 0!==i||void 0!==o?(i??Number.MAX_SAFE_INTEGER)-(o??Number.MAX_SAFE_INTEGER):0})}_getCameraImageUrl(e){const t=this.hass?.states?.[e];if(!t)return;const i=t.attributes?.entity_picture,a=t.attributes?.access_token,o="string"==typeof i&&i?i:a?`/api/camera_proxy/${e}?token=${encodeURIComponent(a)}`:"";if(!o)return;const r=o.includes("?")?"&":"?";return`${o}${r}dd_cache=${encodeURIComponent(t.last_updated||t.last_changed||"")}`}_renderHousePowerStatusCard(){const e=this._getHousePowerUsage();if(!e.sensorCount)return o;const t=e.sensorCount?this._tp("devices.live_power_sensor",e.sensorCount):this._t("home.no_live_power_sensors");return c`
      <div
        class="home-status-card house-power-card wattage ${e.sensorCount?"has-power":"is-empty"}"
        @click=${()=>this._openDeviceDomain("energy")}
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
        ${e.rooms.length?c`
          <div class="house-power-list" aria-label=${this._t("home.house_power_usage")}>
            ${v(e.rooms,e=>e.areaId,e=>this._renderHousePowerRoom(e))}
          </div>
        `:c`
          <div class="house-power-empty">${this._t("home.no_room_power_usage")}</div>
        `}
      </div>
    `}_houseClimateTitle(e){return"outdoor"===e?this._t("home.outdoor_climate"):this._t("home.indoor_climate")}_renderHouseClimateStatusCard(e){const t=this._getHouseClimateSummary(e);if(!t.metrics.length)return o;const i=this._houseClimateTitle(e);return c`
      <div
        class="home-status-card house-climate-card sensor ${e}"
        @click=${()=>this._showHouseClimateEntities(void 0,e)}
        @keydown=${t=>this._handleHouseClimateKeydown(t,e)}
        data-domain="sensor"
        role="button"
        tabindex="0"
        aria-label=${i}
      >
        <div class="house-climate-head">
          <div class="status-card-icon house-climate-icon">
            <ha-icon icon=${"outdoor"===e?"mdi:sun-thermometer-outline":"mdi:home-thermometer-outline"}></ha-icon>
          </div>
          <div class="house-climate-copy">
            <div class="house-climate-title">${i}</div>
            <div class="house-climate-subtitle">
              ${this._tp("common.sensor",t.sensorCount)}
            </div>
          </div>
        </div>
        <div class="house-climate-grid">
          ${t.metrics.map(t=>c`
            <button
              class="house-climate-metric ${t.kind}"
              style=${`--metric-color: ${t.color};`}
              type="button"
              @click=${i=>{i.stopPropagation(),this._showHouseClimateEntities(t.kind,e)}}
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
    `}_renderHousePowerRoom(e){return c`
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
    `}_handleHouseClimateKeydown(e,t){this._handleActivationKeydown(e,()=>this._showHouseClimateEntities(void 0,t))}_handleActivationKeydown(e,t){e.target===e.currentTarget&&("Enter"!==e.key&&" "!==e.key||(e.preventDefault(),t()))}_showHouseClimateEntities(e,t="indoor"){const i=this._getHouseClimateSummary(t),a=e?i.metrics.filter(t=>t.kind===e):i.metrics,o=a.flatMap(e=>e.entityIds);if(!o.length)return void this._openDeviceDomain("sensor");const r=e&&a[0]?.label||this._houseClimateTitle(t);bt(this,{domain:"sensor",config:this.config,entityIds:o,customTitle:r,viewAllLabel:this._t("home.view_sensors"),onViewAll:()=>this._openDeviceDomain("sensor")})}_renderHousePersonsStatusCard(){const e=this._getVisiblePersonEntities(),t=e.length?this._personPresenceSummary(e)||this._t("person.no_location"):this._t("home.no_people"),i=[...e.filter(e=>!this._isPersonLocationUnknown(e)),...e.filter(e=>this._isPersonLocationUnknown(e))],a=i.length>4?i.slice(0,3):i,r=i.length-a.length;return c`
      <div
        class="home-status-card house-persons-card person"
        role="button"
        tabindex="0"
        aria-label=${`${this._t("home.people")}: ${t}`}
        @click=${()=>this._openDeviceDomain("person")}
        @keydown=${e=>this._handleActivationKeydown(e,()=>this._openDeviceDomain("person"))}
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
        ${e.length?c`
          <div class="house-persons-grid">
            ${v(a,e=>e.entity_id,e=>this._renderHousePersonMini(e))}
            ${r>0?c`
              <button
                class="house-persons-more"
                type="button"
                title=${this._tp("home.more_people",r)}
                aria-label=${this._tp("home.more_people",r)}
                @click=${e=>{e.stopPropagation(),this._openDeviceDomain("person")}}
              >+${r}</button>
            `:o}
          </div>
        `:c`
          <div class="house-persons-empty">${this._t("home.no_visible_people")}</div>
        `}
      </div>
    `}_renderHousePersonMini(e){const t=e.attributes?.friendly_name||e.entity_id.split(".")[1],i=e.attributes?.entity_picture,a=this._formatPersonState(e),o=this._isPersonLocationUnknown(e)?"is-unknown":"home"===e.state?"is-home":"not_home"===e.state?"is-away":"is-zone";return c`
      <button
        class="house-person-mini ${o}"
        type="button"
        aria-label=${`${t}: ${a}`}
        @click=${t=>this._handleHousePersonClick(t,e.entity_id)}
      >
        <span class="house-person-avatar">
          ${i?c`
            <img src=${i} alt=${t}>
          `:c`
            <ha-icon icon="mdi:account"></ha-icon>
          `}
        </span>
        <span class="house-person-mini-copy">
          <span class="house-person-mini-name">${t}</span>
          <span class="house-person-mini-state">${a}</span>
        </span>
      </button>
    `}_handleHousePersonClick(e,t){e.stopPropagation(),this._showMoreInfo(t)}_getVisiblePersonEntities(){return this.hass&&this.config?this._visiblePersonEntities(this.hass.states,V(this.hass),S(this.config)):[]}_isPersonLocationUnknown(e){const t=String(e?.state??"").toLowerCase();return!t||"unknown"===t||"unavailable"===t}_personPresenceSummary(e){const t=e.filter(e=>!this._isPersonLocationUnknown(e));if(!t.length)return"";return`${t.filter(e=>"home"===e.state).length}/${t.length} ${this._t("person.home")}`}_formatPersonState(e){return this._isPersonLocationUnknown(e)?this._t("person.no_location"):"home"===e.state?this._t("person.home"):"not_home"===e.state?this._t("person.away"):String(e.state).replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase())}_getHomeSnapshotText(e){const t=[],i=this._getVisiblePersonEntities(),a=this._personPresenceSummary(i);if(a&&t.push(a),this._showNotificationsUi()&&this._persistentNotifications.length){const e=this._persistentNotifications.length,i=this._t(1===e?"home.notification":"home.notifications"),a=i?i.charAt(0).toLocaleLowerCase()+i.slice(1):i;t.push(`${e} ${a}`)}const o=this._getHomeSummaryCards().reduce((e,t)=>e+t.count,0);o&&t.push(this._tp("home.attention",o));const r=this._formatWeatherSnapshot(e);return r&&t.length<3&&t.push(r),t.slice(0,3).join(" · ")||this._t("home.everything_calm")}_formatWeatherSnapshot(e){const t=this._formatWeatherTemperature(e);return t?`${t} ${this._t("home.outside").toLocaleLowerCase(K(this.hass))}`:""}_weatherDisplayEnabled(){return!1!==this.config?.settings?.show_weather&&!1!==this.config?.global_options?.show_weather}_formatWeatherTemperature(e){if(!e)return"";const t=e.attributes||{},i=t.temperature??t.current_temperature??t.apparent_temperature??t.native_temperature;if(null==i||""===i)return"";const a=t.temperature_unit||t.native_temperature_unit||this.hass?.config?.unit_system?.temperature||"";return O(i,a)}_weatherTitle(e){const t=this._formatWeatherTemperature(e),i=this._formatWeatherCondition(e?.state),a=this._t("home.outside").toLocaleLowerCase(K(this.hass));return t&&i?`${t} ${a}, ${i}`:t?`${t} ${a}`:i||this._t("home.outside_weather")}_formatWeatherCondition(e){return e&&"unknown"!==e&&"unavailable"!==e?e.replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase()):""}_getHousePowerUsage(){const e=this._housePowerUsage(this.hass,this.config),t=e.areas.slice(0,4).map(e=>({areaId:e.areaId,name:e.name,icon:e.icon,watts:e.totalWatts,formatted:e.formattedTotal,percentage:e.percentage}));return{totalWatts:e.totalWatts,formattedTotal:e.formattedTotal,sensorCount:e.sensorCount,rooms:t}}_getHouseClimateSummary(e="indoor"){const t={temperature:[],humidity:[]},i=new Set(this.config?.settings?.home_climate_excluded_areas||[]),a=new Set(this.config?.settings?.home_outdoor_climate_areas||[]);("outdoor"===e?(this.config?.areas||[]).filter(e=>a.has(e.area_id)):this._getVisibleSortedAreas().filter(e=>!i.has(e.area_id)&&!a.has(e.area_id))).forEach(e=>{const i=this.hass?.areas?.[e.area_id];["temperature","humidity"].forEach(e=>{const a="temperature"===e?i?.temperature_entity_id:i?.humidity_entity_id;if(!a)return;const o=this.hass?.states?.[a];if(!o||"unavailable"===o.state||"unknown"===o.state)return;const r=Number.parseFloat(o.state);Number.isFinite(r)&&t[e].push({value:r,unit:String(o.attributes?.unit_of_measurement||("temperature"===e?this.hass?.config?.unit_system?.temperature||"°C":"%")),entityIds:[a]})})});const o=[],r=this._houseClimateMetric("temperature",t.temperature,e),s=this._houseClimateMetric("humidity",t.humidity,e);return r&&o.push(r),s&&o.push(s),{sensorCount:t.temperature.length+t.humidity.length,metrics:o}}_houseClimateMetric(e,t,i="indoor"){if(!t.length)return;const a="indoor"===i||t.length>1,o=t.reduce((e,t)=>e+t.value,0)/t.length,r=t[0]?.unit||("temperature"===e?"°C":"%"),s=O("temperature"===e?o.toFixed(1):Math.round(o),r);return{kind:e,label:"temperature"===e?this._t(a?"home.average_temperature":"home.temperature"):this._t(a?"home.average_humidity":"home.humidity"),value:s,count:t.length,icon:w("sensor","temperature"===e?"temperature":"humidity"),color:k("sensor","temperature"===e?"temperature":"humidity"),entityIds:[...new Set(t.flatMap(e=>e.entityIds))]}}_renderMobileHomeAreas(){const e=this._getVisibleSortedAreas();if(!e.length)return this.config?.areas?.length?o:this._renderNoAreasHint();const t=this._isDesktopAreaSidebarCollapsed(),i=t?"grid":this._mobileHomeAreasLayout,a="grid"===i,r=this._isMobile&&!this._renderAllMobileHomeAreas&&e.length>12?e.slice(0,12):e;return c`
      <section class="mobile-home-section mobile-home-areas layout-${i}">
        ${this._renderMobileSectionHeading("areas",this._t("home.areas"),t?{}:{toggle:{gridMode:a,title:a?this._t("home.swipe_areas"):this._t("home.show_all_areas"),label:a?this._t("home.switch_areas_swipe"):this._t("home.show_all_areas"),onToggle:this._toggleMobileHomeAreasLayout},onSeeAll:this._openMobileAreaSwitcher})}
        <div class="mobile-area-rail">
          ${v(r,e=>e.area_id,e=>this._renderMobileHomeAreaCard(e))}
        </div>
      </section>
    `}_renderNoAreasHint(){const e=Boolean(this.hass?.user?.is_admin);return c`
      <section class="home-no-areas">
        <div class="home-no-areas-icon" aria-hidden="true">
          <ha-icon icon="mdi:floor-plan"></ha-icon>
        </div>
        <div class="home-no-areas-copy">
          <div class="home-no-areas-title">${this._t("home.no_areas_title")}</div>
          <div class="home-no-areas-text">${this._t("home.no_areas_text")}</div>
        </div>
        ${e?c`
          <button class="dd-empty-state-button" type="button" @click=${()=>this._openHomeAssistantPage("/config/areas")}>
            <span>${this._t("home.set_up_areas")}</span>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        `:o}
      </section>
    `}_renderMobileHomeAreaCard(e){const t=this._getFilteredAreaEntities(e.area_id),i=this._getCachedAreaData(e),a=this._getAreaDeviceCount(e.area_id,t),r=Boolean(e.picture),s=[i.temperature,i.humidity,i.wattage].filter(Boolean).join(" • ")||this._tp("common.device",a),n=[],d=r?this._getPictureContrastClass(e.picture):"";return i.domains.cover?.on&&n.push({className:"cover",icon:y("cover"),count:i.domains.cover.on,color:k("cover")}),i.domains.light?.on&&n.push({className:"light",icon:y("light"),count:i.domains.light.on,color:k("light")}),i.domains.motion?.on&&n.push({className:"motion",icon:w("binary_sensor","motion"),count:i.domains.motion.on,color:k("binary_sensor","motion")}),c`
      <button
        class="mobile-area-card ${r?"has-picture":""} ${d}"
        type="button"
        @click=${()=>this._selectArea(e.area_id)}
      >
        ${r?c`
          <div class="mobile-area-picture" style=${`background-image: url('${e.picture}');`}></div>
        `:o}
        <div class="mobile-area-top">
          <div class="mobile-area-icon">
            <ha-icon icon=${f(e)}></ha-icon>
          </div>
          <div class="mobile-area-badges">
            ${n.slice(0,2).map(e=>c`
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
          <div class="mobile-area-meta">${s}</div>
        </div>
      </button>
    `}_getGreeting(){const e=(new Date).getHours();return e<12?this._t("home.good_morning"):e<18?this._t("home.good_afternoon"):this._t("home.good_evening")}_renderHomeAlarm(){const e=this._getAlarmEntity();if(!e)return o;const t=e?.state||"",i=["armed_away","armed_home","armed_night","armed_vacation"].includes(t),a="disarmed"===t;return c`
      <button
        class="welcome-alarm ${i?"alarm-armed":a?"alarm-disarmed":"alarm-triggered"}"
        type="button"
        @click=${()=>this._showMoreInfo(e?.entity_id||"")}
      >
        <ha-icon icon=${i?"mdi:shield-check":a?"mdi:shield-off":"mdi:shield-alert"}></ha-icon>
        <span class="alarm-text">${(()=>i?this._t("home.alarm_armed"):a?this._t("home.alarm_disarmed"):this._t("domain.alarm_control_panel"))()}</span>
      </button>
    `}_getHomeSceneItems(){return this.hass?this._homeSceneItems(this.config?.settings?.home_scenes,this.hass.states,V(this.hass),!1!==this.config?.settings?.hide_unavailable_entities):[]}_homeSceneName(e){const t=this.hass?.states?.[e];return t?.attributes?.friendly_name||V(this.hass)[e]?.name||e}_renderHomeScenes(){const e=this._getHomeSceneItems();if(!e.length)return o;const t="grid"===this._mobileHomeScenesLayout,i=this._t("home_section.scenes.label");return c`
      <section class="home-scenes-section layout-${this._mobileHomeScenesLayout}">
        <div class="home-status-heading">
          <ha-icon icon=${Ae.scenes.icon}></ha-icon>
          <span>${i}</span>
        </div>
        ${this._renderMobileSectionHeading("scenes",i,e.length>1?{toggle:{gridMode:t,title:t?this._t("scenes.swipe"):this._t("scenes.show_all"),label:t?this._t("scenes.switch_swipe"):this._t("scenes.show_all"),onToggle:this._toggleMobileHomeScenesLayout}}:{})}
        <div class="home-scenes-list">
          ${v(e,e=>e.entityId,e=>this._renderHomeSceneChip(e))}
        </div>
        <span class="dd-visually-hidden" role="status">${this._homeSceneAnnouncement}</span>
      </section>
    `}_renderHomeSceneChip(e){const{entityId:t,domain:i,unavailable:a}=e,r=this.hass.states[t];if(!r)return o;const s=V(this.hass)[t],n=this._homeSceneName(t),l=a?void 0:this._homeSceneFeedback[t],h=!a&&"script"===i&&"on"===r.state,p="success"===l?"mdi:check":s?.icon||r.attributes?.icon||y(i);let m;m=a?this._t("common.unavailable"):"success"===l?this._t("scene"===i?"scenes.activated":"scenes.started"):h?this._t("scenes.running"):"scene"===i?this._sceneLastActivatedText(r):this._scriptLastRunText(r);const u=this._t("scene"===i?"scenes.activate_named":"scenes.run_named",{name:n}),g=`dd-scene-meta-${t}`;return c`
      <button
        class=${d({"home-scene-chip":!0,[`home-scene-${i}`]:!0,"is-pending":"pending"===l,"is-success":"success"===l,"is-running":h&&!l})}
        type="button"
        data-entity=${t}
        title=${u}
        aria-label=${u}
        aria-describedby=${g}
        aria-busy=${"pending"===l?"true":"false"}
        ?disabled=${a}
        @click=${()=>this._runHomeScene(e)}
      >
        <span class="home-scene-icon" aria-hidden="true">
          <ha-icon icon=${p}></ha-icon>
        </span>
        <span class="home-scene-copy">
          <span class="home-scene-name">${n}</span>
          <span class="home-scene-meta" id=${g}>
            ${h&&!l?c`<span class="home-scene-running-dot" aria-hidden="true"></span>`:o}
            <span class="home-scene-meta-text">${m}</span>
          </span>
        </span>
      </button>
    `}_scriptLastRunText(e){const t=Date.parse(e?.attributes?.last_triggered||"");return Number.isFinite(t)?this._formatRelativeTime(t):this._t("scenes.not_run")}async _runHomeScene(e){const{entityId:t,domain:i,unavailable:a}=e;if(a||!this.hass||"pending"===this._homeSceneFeedback[t])return;const o=this._homeSceneName(t);this._setHomeSceneFeedback(t,"pending");try{if(await this.hass.callService(i,"turn_on",{entity_id:t}),!this.isConnected)return;this._setHomeSceneFeedback(t,"success"),this._homeSceneAnnouncement=this._t("scene"===i?"scenes.activated_named":"scenes.started_named",{name:o}),this._homeSceneFeedbackTimers.set(t,window.setTimeout(()=>{this._homeSceneFeedbackTimers.delete(t),this._setHomeSceneFeedback(t,void 0),this._homeSceneAnnouncement=""},1500))}catch(e){console.warn(`Failed to run ${t}:`,e),this._setHomeSceneFeedback(t,void 0),this._showToast(this._t("scene"===i?"scenes.scene_failed":"scenes.script_failed",{name:o}))}}_setHomeSceneFeedback(e,t){const i=this._homeSceneFeedbackTimers.get(e);if(void 0!==i&&(window.clearTimeout(i),this._homeSceneFeedbackTimers.delete(e)),this._homeSceneFeedback[e]===t)return;const a={...this._homeSceneFeedback};t?a[e]=t:delete a[e],this._homeSceneFeedback=a}_renderFavorites(){const e=this._getEffectiveFavoriteEntities();if(0===e.length)return o;const t="grid"===this._mobileHomeFavoritesLayout;return c`
      <div class="favorites-section home-favorites-section layout-${this._mobileHomeFavoritesLayout}">
        <div class="favorites-header">
          <ha-icon icon="mdi:star"></ha-icon>
          <span>${this._t("favorites.title")}</span>
        </div>
        ${this._renderMobileSectionHeading("favorites",this._t("favorites.title"),{toggle:{gridMode:t,title:t?this._t("favorites.swipe"):this._t("favorites.show_all"),label:t?this._t("favorites.switch_swipe"):this._t("favorites.show_all"),onToggle:this._toggleMobileHomeFavoritesLayout}})}
        <div class="favorites-grid">
          ${v(e,e=>e,e=>this._renderFavoriteCard(e))}
        </div>
      </div>
    `}_renderFavoriteCard(e){const t=this.hass.states[e],i=V(this.hass)[e];if(!t||i?.hidden_by)return o;const a=this._getEffectiveEntityState(t),r=e.split(".")[0]||"unknown",s=a.attributes?.device_class,n=a.attributes?.friendly_name||i?.name||e,d=this._formatFavoriteState(a),l=this._entityAreaName(e),h=i?.icon||a.attributes?.icon||w(r,s)||y(r),p=this._favoriteActiveState(a,r),m=this._favoriteSupportsQuickToggle(r),u=["favorite-card-wrapper",`favorite-${r}`,s?`favorite-${s}`:"",p,m?"can-toggle":"info-only"].filter(Boolean).join(" ");return c`
      <article
        class=${u}
        data-entity=${e}
        role="button"
        tabindex="0"
        @click=${()=>this._showMoreInfo(e)}
        @keydown=${t=>this._handleFavoriteKeydown(t,e)}
      >
        <div class="favorite-top">
          <div class="favorite-icon">
            <ha-icon icon=${h}></ha-icon>
          </div>
          <button
            class="favorite-quick-action"
            type="button"
            title=${this._favoriteQuickTitle(a,r)}
            role=${Ue(this._isOnOffDomain(r)?"switch":void 0)}
            aria-checked=${Ue(this._isOnOffDomain(r)?String(this._isEntityActiveForUi(a,r)):void 0)}
            aria-label=${this._isOnOffDomain(r)?n:this._t("action.entity_action",{action:this._favoriteQuickTitle(a,r),name:n})}
            @click=${e=>this._handleFavoriteQuickAction(e,a,r)}
          >
            <ha-icon icon=${this._favoriteQuickIcon(a,r)}></ha-icon>
          </button>
        </div>
        <div class="favorite-body">
          <div class="favorite-name">${n}</div>
          <div class="favorite-state">${d}</div>
          ${l?c`<div class="favorite-area">${l}</div>`:o}
        </div>
      </article>
    `}_handleFavoriteKeydown(e,t){this._handleActivationKeydown(e,()=>this._showMoreInfo(t))}_formatFavoriteState(e){const t=this._getEffectiveEntityState(e);return F(this.hass,t)}_getEffectiveEntityState(e){const t=e?.entity_id;if(!t)return e;const i=this._optimisticEntityStates[t];if(!i||i.expiresAt<=Date.now())return e;return String(e?.state||"").toLowerCase()===i.state.toLowerCase()?e:{...e,state:i.state}}_setOptimisticEntityState(e,t){this._setOptimisticEntityStates([e],t)}_setOptimisticEntityStates(e,t){const i=[...new Set(e.filter(Boolean))];if(!i.length)return;const a=Date.now()+5e3,o={...this._optimisticEntityStates};i.forEach(e=>{o[e]={state:t,expiresAt:a}}),this._optimisticEntityStates=o,this._scheduleOptimisticCleanup()}_clearOptimisticEntityStates(e){const t=[...new Set(e.filter(Boolean))];if(!t.length)return;const i={...this._optimisticEntityStates};let a=!1;t.forEach(e=>{i[e]&&(delete i[e],a=!0)}),a&&(this._optimisticEntityStates=i)}_reconcileOptimisticEntityStates(){const e=Object.entries(this._optimisticEntityStates);if(!e.length)return;const t=Date.now(),i={...this._optimisticEntityStates};let a=!1;e.forEach(([e,o])=>{const r=this.hass?.states?.[e]?.state;(!r||o.expiresAt<=t||String(r).toLowerCase()===o.state.toLowerCase())&&(delete i[e],a=!0)}),a&&(this._optimisticEntityStates=i)}_scheduleOptimisticCleanup(){if(void 0!==this._optimisticCleanupTimer)return;const e=Object.values(this._optimisticEntityStates).map(e=>e.expiresAt);if(!e.length)return;const t=Math.min(...e);if(!Number.isFinite(t))return;const i=Math.max(80,t-Date.now()+50);this._optimisticCleanupTimer=window.setTimeout(()=>{this._optimisticCleanupTimer=void 0,this._reconcileOptimisticEntityStates(),Object.keys(this._optimisticEntityStates).length&&this._scheduleOptimisticCleanup()},i)}_favoriteActiveState(e,t){const i=String(e?.state||"").toLowerCase();if(["unavailable","unknown"].includes(i))return"is-idle";if("cover"===t)return["open","opening"].includes(i)?"is-active":"is-off";if("lock"===t)return"unlocked"===i?"is-active":"is-off";if("climate"===t){const t=e?.attributes?.hvac_action;return t&&"idle"!==t&&"off"!==t?"is-active":"is-idle"}return["off","closed","locked","not_home","idle"].includes(i)?"is-off":"is-active"}_isOnOffDomain(e){return["light","switch","fan","input_boolean"].includes(e)}_entityDisplayName(e){const t=String(e?.entity_id||"");return e?.attributes?.friendly_name||V(this.hass)[t]?.name||t}_favoriteSupportsQuickToggle(e){return["light","switch","fan","input_boolean","cover","lock"].includes(e)}_renderStaticIcon(e){return c`
      <svg class="dd-static-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${e}></path>
      </svg>
    `}_favoriteQuickIcon(e,t){const i=String(e?.state||"").toLowerCase();return"cover"===t?["open","opening"].includes(i)?"mdi:arrow-down":"mdi:arrow-up":"lock"===t?"unlocked"===i?"mdi:lock-open-variant-outline":"mdi:lock-outline":["light","switch","fan","input_boolean"].includes(t)?"mdi:power":"mdi:chevron-right"}_favoriteQuickTitle(e,t){const i=String(e?.state||"").toLowerCase();return"cover"===t?this._t(["open","opening"].includes(i)?"action.close":"action.open"):"lock"===t?this._t("unlocked"===i?"action.lock":"action.unlock"):["light","switch","fan","input_boolean"].includes(t)?this._t("off"===i?"action.turn_on":"action.turn_off"):this._t("action.more_info")}async _handleFavoriteQuickAction(e,t,i){e.stopPropagation();const a=t?.entity_id;if(!a)return;const o=[a];try{if(["light","switch","fan","input_boolean"].includes(i)){const e=!this._isEntityActiveForUi(t,i);return this._setOptimisticEntityState(a,e?"on":"off"),void await this.hass.callService(i,e?"turn_on":"turn_off",{entity_id:a})}if("cover"===i){const e=["open","opening"].includes(String(t.state).toLowerCase());return this._setOptimisticEntityState(a,e?"closed":"open"),void await this.hass.callService("cover",e?"close_cover":"open_cover",{entity_id:a})}if("lock"===i){const e="unlocked"===String(t.state).toLowerCase();return this._setOptimisticEntityState(a,e?"locked":"unlocked"),void await this.hass.callService("lock",e?"lock":"unlock",{entity_id:a})}}catch(e){return this._clearOptimisticEntityStates(o),console.warn(`Failed to run favorite quick action for ${a}:`,e),void this._showToast(this._t("entity.update_failed"))}this._showMoreInfo(a)}_renderAreaView(){if(!this._selectedArea)return o;const e=this.config?.areas?.find(e=>e.area_id===this._selectedArea);if(!e)return this._renderAreaNotFound();const t=this._getFilteredAreaEntities(this._selectedArea),i=this._editMode?this._getEditableAreaEntities(this._selectedArea):t,a=this._getCachedAreaData(e),r=!!e.picture,s=r?this._getPictureContrastClass(e.picture):"",n=this._getAreaDeviceCount(e.area_id,t),d=this._areaThermostatEntityId(t),l=d?t.filter(e=>e.entity_id!==d):t,h=this._tp("common.device",n),p=this._renderAreaQuickTiles(e.area_id,l),m=p!==o||Boolean(d),u=c`
      <button
        class="dd-page-header-button dd-page-header-back"
        type="button"
        title=${this._t("navigation.back_home")}
        aria-label=${this._t("navigation.back_home")}
        @click=${()=>this._selectView("home")}
      >
        ${this._renderStaticIcon("M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z")}
      </button>
    `,g=c`
      ${this._renderAreaMobileCameraAction(t)}
      ${this._renderUnavailableEntitiesIcon(e.area_id)}
      ${this._canManageDashboard()?c`
        <button
          class="dd-page-header-button ${this._editMode?"is-active":""}"
          type="button"
          aria-pressed=${this._editMode?"true":"false"}
          title=${this._editMode?this._t("layout.done_editing"):this._t("layout.edit_custom_cards")}
          aria-label=${this._editMode?this._t("layout.done_editing"):this._t("layout.edit_custom_cards")}
          @click=${this._toggleEditMode}
        >
          <ha-icon icon=${this._editMode?"mdi:check":"mdi:pencil"}></ha-icon>
        </button>
      `:o}
    `,b=["dd-page-header","room-header",r?"has-picture":"",s].filter(Boolean).join(" ");return c`
      <div class="area-view">
        ${this._isMobile?this._renderAreaCompactBar(e,a,h,u,g,p):o}
        <header class=${b}>
          ${r?c`
            <div class="dd-page-header-media" style="background-image: url('${e.picture}');"></div>
          `:o}
          <div class="dd-page-header-top">
            ${u}
            <div class="dd-page-header-identity">
              <span class="dd-page-header-icon">
                <ha-icon icon=${f(e)}></ha-icon>
              </span>
              <div class="dd-page-header-copy">
                <h1 class="dd-page-header-title">${e.name}</h1>
                <div class="dd-page-header-subtitle">
                  <span>${h}</span>
                  ${this._renderAreaHeaderReadings(a)}
                </div>
              </div>
            </div>
            <div class="dd-page-header-actions">${g}</div>
          </div>
          ${m?c`
            <div class="dd-page-header-strip">
              ${p}
              ${d?c`
                <dwains-dashboard-next-area-thermostat
                  .hass=${this.hass}
                  .entityId=${d}
                  .roomName=${e.name}
                ></dwains-dashboard-next-area-thermostat>
              `:o}
            </div>
          `:o}
        </header>

        ${this._isMobile?o:this._renderNowPlayingBar(!1)}
        ${this._renderCustomCardSlot(e.area_id,"top",this._t("layout.custom_cards_top"))}
        ${this._renderMobileEntitiesSection(e,i)}
        ${this._renderCustomCardSlot(e.area_id,"bottom",this._t("layout.custom_cards_bottom"))}
        ${this._editMode||i.length||this._getAreaCustomCards(e.area_id).length?o:this._renderAreaEmptyState(e)}
      </div>
    `}_renderEmptyState(e,t,i,a=o){return c`
      <div class="dd-empty-state" role="status">
        <div class="dd-empty-state-icon" aria-hidden="true">
          <ha-icon icon=${e}></ha-icon>
        </div>
        <div class="dd-empty-state-title">${t}</div>
        <div class="dd-empty-state-text">${i}</div>
        ${a!==o?c`<div class="dd-empty-state-actions">${a}</div>`:o}
      </div>
    `}_hiddenUnavailableEntityCount(e){if(!1===this.config?.settings?.hide_unavailable_entities)return 0;const t=this._getUnavailableAreaEntities(e);return t.unavailable.length+t.unknown.length}_renderAreaEmptyState(e){const t=this._hiddenUnavailableEntityCount(e.area_id),i=Boolean(this.hass?.user?.is_admin),a=t||i?c`
      ${t?c`
        <button
          class="dd-empty-state-button"
          type="button"
          @click=${()=>this._showUnavailableEntitiesModal(e.area_id)}
        >
          <ha-icon icon="mdi:eye-outline"></ha-icon>
          <span>${this._t("settings.hidden_unavailable_count",{count:t})}</span>
        </button>
      `:o}
      ${i?c`
        <button
          class="dd-empty-state-button"
          type="button"
          @click=${()=>this._openHomeAssistantPage(`/config/areas/area/${encodeURIComponent(e.area_id)}`)}
        >
          <ha-icon icon="mdi:cog-outline"></ha-icon>
          <span>${this._t("layout.area_settings")}</span>
        </button>
      `:o}
    `:o;return this._renderEmptyState("mdi:devices",this._t("layout.area_empty_title"),this._t("layout.area_empty_text"),a)}_renderAreaNotFound(){const e=Boolean(this.hass?.user?.is_admin);return c`
      <div class="area-view area-view-missing">
        ${this._renderEmptyState("mdi:map-marker-question-outline",this._t("layout.area_not_found_title"),this._t("layout.area_not_found_text"),c`
            <button class="dd-empty-state-button primary" type="button" @click=${()=>this._selectView("home")}>
              <ha-icon icon="mdi:home-outline"></ha-icon>
              <span>${this._t("navigation.back_home")}</span>
            </button>
            ${e?c`
              <button class="dd-empty-state-button" type="button" @click=${()=>this._openHomeAssistantPage("/config/areas")}>
                <ha-icon icon="mdi:cog-outline"></ha-icon>
                <span>${this._t("layout.manage_areas")}</span>
              </button>
            `:o}
          `)}
      </div>
    `}_renderCustomCardSlot(e,t,i,a=!1){const r=this._canManageDashboard();!r&&this._editMode&&(this._editMode=!1);const s=this._getAreaCustomCards(e).filter(e=>e.placement===t);if(0===s.length&&!this._editMode)return o;const n=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===t&&this._customCardDragOver.index===s.length,l={"dd-custom-section":!0,"after-domain":a,editing:this._editMode&&r,"drag-over":Boolean(n)};return c`
      <div
        class=${d(l)}
        @dragover=${i=>this._handleCustomSlotDragOver(i,e,t,s.length)}
        @drop=${i=>this._handleCustomCardDrop(i,e,t,s.length)}
      >
        ${this._editMode&&r||s.length?c`
              <div class="dd-custom-slot-head">
                <div class="dd-custom-slot-title">
                  <ha-icon icon="mdi:cards-outline"></ha-icon>
                  <span>${this._editMode&&r?i:this._t("layout.custom_cards")}</span>
                </div>
                ${this._editMode&&r?c`
                  <button class="dd-add-card-inline" @click=${()=>this._addCard(e,t,s.length)}>
                    <ha-icon icon="mdi:plus"></ha-icon>
                    <span>${this._t("layout.add_card")}</span>
                  </button>
                `:o}
              </div>
            `:o}
        <div class="dd-custom-grid">
          ${v(s,e=>e.id,(t,i)=>this._renderCustomCard(e,t,i))}
          ${this._editMode&&r&&0===s.length?c`
                <button class="dd-add-card" @click=${()=>this._addCard(e,t,0)}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                  <span>${this._t("layout.add_card")}</span>
                </button>
              `:o}
        </div>
      </div>
    `}_renderCustomCard(e,t,i){const a=this._customCardDrag?.areaId===e&&this._customCardDrag.cardId===t.id,o=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===t.placement&&this._customCardDragOver.index===i,r={"dd-custom-card-wrap":!0,"dd-grid-full":"full"===t.card?.grid_options?.columns,editing:this._editMode,dragging:a,"drag-over":o};return c`
      <div
        class=${d(r)}
        style=${Ve(this._customCardGridStyle(t.card))}
        .draggable=${this._editMode}
        @dragstart=${i=>this._handleCustomCardDragStart(i,e,t.id)}
        @dragover=${a=>this._handleCustomSlotDragOver(a,e,t.placement,i)}
        @drop=${a=>this._handleCustomCardDrop(a,e,t.placement,i)}
        @dragend=${this._clearCustomCardDragState}
      >
        <div class="dd-card-toolbar">
          <button class="drag" type="button" title=${this._t("layout.drag_card")} aria-label=${this._t("layout.drag_card")}>
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <button
            type="button"
            title=${this._t("common.edit")}
            aria-label=${this._t("common.edit")}
            @click=${()=>this._editCard(e,t.id)}
          >
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
          <button
            class="del"
            type="button"
            title=${this._t("common.delete")}
            aria-label=${this._t("common.delete")}
            @click=${()=>this._deleteCard(e,t.id)}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
        <dwains-dashboard-next-card-host .hass=${this.hass} .config=${t.card}></dwains-dashboard-next-card-host>
      </div>
    `}_customCardGridStyle(e){const t=e?.grid_options;if(!t||"object"!=typeof t)return{};const i={};if("full"===t.columns)i["--dd-card-grid-column"]="1 / -1";else if("number"==typeof t.columns&&Number.isFinite(t.columns)){const e=Math.max(1,Math.min(12,Math.round(t.columns)));i["--dd-card-grid-column"]=`span ${e}`}if("number"==typeof t.rows&&Number.isFinite(t.rows)){const e=Math.max(1,Math.min(12,Math.round(t.rows)));i["--dd-card-grid-min-height"]=56*e+8*(e-1)+"px"}return i}_getDomainSlotCustomCards(e,t,i,a){const o=this._customCardPlacementInDomain(t,i),r=this._customCardPlacementAfter(t);return this._getAreaCustomCards(e).filter(e=>{if(e.placement===o)return!0;const s=this._domainCustomCardPlacementIndex(e.placement,t);return i===a&&void 0!==s&&s>a||i===a&&e.placement===r})}_domainCustomCardPlacementIndex(e,t){const i=`domain:${t}:`;if(!e.startsWith(i))return;const a=Number(e.slice(i.length));return Number.isFinite(a)&&a>=0?a:void 0}_placementIndexForCard(e,t){const i=t.get(e.placement)||0;return t.set(e.placement,i+1),i}_renderDomainCustomCardSlot(e,t,i,a){const r=this._canManageDashboard();!r&&this._editMode&&(this._editMode=!1);const s=this._customCardPlacementInDomain(t,i),n=this._getDomainSlotCustomCards(e,t,i,a),d=n.filter(e=>e.placement===s).length,l=new Map,h=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===s&&this._customCardDragOver.index===d;return 0!==n.length||this._editMode?c`
      ${n.map(t=>this._renderCustomCard(e,t,this._placementIndexForCard(t,l)))}
      ${this._editMode&&r?c`
        <button
          class="dd-add-card dd-domain-add-card ${h?"drag-over":""}"
          @click=${()=>this._addCard(e,s,d)}
          @dragover=${t=>this._handleCustomSlotDragOver(t,e,s,d)}
          @drop=${t=>this._handleCustomCardDrop(t,e,s,d)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("layout.add_card")}</span>
        </button>
      `:o}
    `:o}_renderUngroupedCustomCardSlot(e,t){const i=this._canManageDashboard();!i&&this._editMode&&(this._editMode=!1);const a=`ungrouped:${Math.max(0,t)}`,r=this._getAreaCustomCards(e).filter(e=>e.placement===a),s=this._customCardDragOver?.areaId===e&&this._customCardDragOver.placement===a&&this._customCardDragOver.index===r.length;return r.length||this._editMode?c`
      ${r.map((t,i)=>this._renderCustomCard(e,t,i))}
      ${this._editMode&&i?c`
        <button
          class="dd-add-card dd-domain-add-card ${s?"drag-over":""}"
          @click=${()=>this._addCard(e,a,r.length)}
          @dragover=${t=>this._handleCustomSlotDragOver(t,e,a,r.length)}
          @drop=${t=>this._handleCustomCardDrop(t,e,a,r.length)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          <span>${this._t("layout.add_card")}</span>
        </button>
      `:o}
    `:o}_fireNativeDialog(e,t){this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:e,dialogImport:()=>Promise.resolve(),dialogParams:t}}))}_customCardPlacementAfter(e){return`after:${e}`}_customCardPlacementInDomain(e,t){return`domain:${e}:${Math.max(0,t)}`}_customCardId(){return`area-card-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}_getAreaCustomCards(e){const t=this.config?.areas_options?.[e]||{};return Array.isArray(t.custom_cards)?t.custom_cards.map((e,t)=>({id:String(e?.id||`generated-${t}`),placement:String(e?.placement||"bottom"),card:e?.card})).filter(e=>e.card&&"object"==typeof e.card):[]}_getPersistableAreaCustomCards(e){return this._getAreaCustomCards(e).map(e=>({id:e.id,placement:e.placement||"bottom",card:e.card}))}_normalizeAreaCustomCardsForSave(e){return e.map(e=>({id:e.id.startsWith("generated-")?this._customCardId():e.id,placement:e.placement||"bottom",card:e.card}))}_insertIndexForPlacement(e,t,i){let a=0,o=-1;for(let r=0;r<e.length;r+=1){const s=e[r];if(s&&s.placement===t){if(a>=i)return r;a+=1,o=r}}return o>=0?o+1:e.length}_insertAreaCustomCard(e,t,i,a){const o=this._getPersistableAreaCustomCards(e),r=this._insertIndexForPlacement(o,i,a);o.splice(r,0,{id:this._customCardId(),placement:i,card:t}),this._saveAreaCustomCards(e,o)}_replaceAreaCustomCard(e,t,i){const a=this._getPersistableAreaCustomCards(e),o=a.findIndex(e=>e.id===t);if(o<0)return;const r=a[o];r&&(a[o]={...r,card:i},this._saveAreaCustomCards(e,a))}_addCard(e,t="bottom",i=Number.POSITIVE_INFINITY){if(this._canManageDashboard())if(customElements.get("hui-dialog-create-card")){const a={views:[{title:this.config?.areas?.find(t=>t.area_id===e)?.name||"Dwains",type:"sections",sections:[{type:"grid",cards:[]}]}]};this._fireNativeDialog("hui-dialog-create-card",{lovelaceConfig:a,path:[0,0],saveConfig:a=>{const o=a?.views?.[0]?.sections?.[0]?.cards||[],r=o[o.length-1];r&&this._insertAreaCustomCard(e,r,t,i)}})}else this._addCardYaml(e,t,i)}_editCard(e,t){if(!this._canManageDashboard())return;const i=this._getAreaCustomCards(e).find(e=>e.id===t)?.card;if(i)if(customElements.get("hui-dialog-edit-card")){const a={type:"grid",cards:[i]},o={views:[{title:"Dwains",type:"sections",sections:[a]}]};this._fireNativeDialog("hui-dialog-edit-card",{lovelaceConfig:o,cardConfig:i,sectionConfig:a,saveCardConfig:i=>{i?.type&&this._replaceAreaCustomCard(e,t,i)}})}else this._editCardYaml(e,t)}_addCardYaml(e,t="bottom",i=Number.POSITIVE_INFINITY){this._canManageDashboard()&&Me(this,{areaName:this.config?.areas?.find(t=>t.area_id===e)?.name,onSave:a=>{this._insertAreaCustomCard(e,a,t,i)}})}_editCardYaml(e,t){if(!this._canManageDashboard())return;const i=this._getAreaCustomCards(e).find(e=>e.id===t)?.card;i&&Me(this,{card:i,areaName:this.config?.areas?.find(t=>t.area_id===e)?.name,onSave:i=>{this._replaceAreaCustomCard(e,t,i)}})}async _deleteCard(e,t){if(!this._canManageDashboard())return;if(!await this._showConfirmation(this._t("layout.delete_card_confirm"),this._t("layout.delete_card_message"),{confirmLabel:this._t("common.delete"),destructive:!0}))return;const i=this._getPersistableAreaCustomCards(e).filter(e=>e.id!==t);this._saveAreaCustomCards(e,i)}_handleCustomCardDragStart(e,t,i){this._editMode&&this._canManageDashboard()?(this._clearGeneratedCardDragState(),this._customCardDrag={areaId:t,cardId:i},this._customCardDragOver=null,e.dataTransfer?.setData("text/plain",i),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")):e.preventDefault()}_handleCustomSlotDragOver(e,t,i,a){this._editMode&&this._customCardDrag&&this._customCardDrag.areaId===t&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._customCardDragOver={areaId:t,placement:i,index:a})}_handleCustomCardDrop(e,t,i,a){this._customCardDrag&&this._customCardDrag.areaId===t&&(e.preventDefault(),e.stopPropagation(),this._moveAreaCustomCard(t,this._customCardDrag.cardId,i,a),this._clearCustomCardDragState())}_moveAreaCustomCard(e,t,i,a){const o=this._getPersistableAreaCustomCards(e),r=o.findIndex(e=>e.id===t);if(r<0)return;const[s]=o.splice(r,1);if(!s)return;s.placement=i;const n=this._insertIndexForPlacement(o,i,a);o.splice(n,0,s),this._saveAreaCustomCards(e,o)}_getDashboardUrlPath(){const e=window.location.pathname.split("/")[1];if(e&&"lovelace"!==e)return e}async _saveAreaCustomCards(e,t){const i=this._normalizeAreaCustomCardsForSave(t);await this._saveAreaOptionsPatch(e,{custom_cards:i})}async _saveAreaOptionsPatch(e,t){if(!this._canManageDashboard())return;const i=this._editMode&&"area"===this._selectedView&&this._selectedArea===e;i&&this._rememberAreaEditMode(e);const a=this.config.areas_options||{};this.config={...this.config,areas_options:{...a,[e]:{...a[e]||{},...t}}},i&&(this._editMode=!0),this.requestUpdate();try{await _e(this.hass,this._getDashboardUrlPath(),(i,a)=>{if(!i)return console.warn("⚠️ No dashboard strategy found; area options were not saved",a),null;const o=i.areas_options||{};return{...i,areas_options:{...o,[e]:{...o[e]||{},...t}}}})}catch(e){console.error("❌ Saving area options failed:",e),this._showToast(this._t("layout.save_card_failed",{error:String(e)}))}}_areaTileState(e,t,i){return"open"===i?1===t?this._t(e?"common.open":"common.closed"):e?this._t("area_header.open_count",{active:e,total:t}):this._t("common.closed"):1===t?this._t(e?"common.on":"common.off"):e?this._t("area_header.on_count",{active:e,total:t}):this._t("common.off")}_renderAreaQuickTiles(e,t){const i=t.filter(e=>e.entity_id.startsWith("light.")),a=t.filter(e=>e.entity_id.startsWith("switch.")),r=t.filter(e=>e.entity_id.startsWith("cover.")),s=t.filter(e=>e.entity_id.startsWith("fan.")),n=t.filter(e=>e.entity_id.startsWith("climate."));if(!(i.length||a.length||r.length||s.length||n.length))return o;const d=(e,t,i,a,o,r)=>{const s=i>0,n=this._t(`domain.${e}`),d=this._areaTileState(i,t,"on"),l=this._t(s?o[1]:o[0],{active:i,total:t});return c`
        <button
          class="dd-room-tile ${e} ${s?"is-on":""}"
          type="button"
          aria-pressed=${s?"true":"false"}
          title=${l}
          aria-label=${`${n}: ${d}. ${l}`}
          @click=${r}
        >
          <span class="dd-room-tile-icon">
            <ha-icon icon=${s?a[1]:a[0]}></ha-icon>
          </span>
          <span class="dd-room-tile-copy">
            <span class="dd-room-tile-label">${n}</span>
            <span class="dd-room-tile-state">${d}</span>
          </span>
          <span class="dd-room-tile-switch" aria-hidden="true"></span>
        </button>
      `},l=this._countActiveEntities(r,"cover"),h=this._countActiveEntities(n,"climate"),p=1===n.length?this.hass.states[n[0].entity_id]:void 0,m=p?.attributes?.current_temperature,u=this.hass.config?.unit_system?.temperature||"°",g=null!=m?O(m,u):this._tp("common.entity",n.length);return c`
      <div class="dd-room-tiles">
        ${i.length?d("light",i.length,this._countActiveEntities(i,"light"),["mdi:lightbulb-outline","mdi:lightbulb"],["action.lights_on_summary","action.lights_off_summary"],()=>this._toggleAreaLights(e)):o}
        ${a.length?d("switch",a.length,this._countActiveEntities(a,"switch"),["mdi:power-plug-off-outline","mdi:power-plug"],["action.switches_on_summary","action.switches_off_summary"],()=>this._toggleAreaSwitches(e)):o}
        ${r.length?c`
          <div class="dd-room-tile cover has-actions ${l>0?"is-on":""}">
            <span class="dd-room-tile-icon">
              <ha-icon icon=${l>0?"mdi:window-shutter-open":"mdi:window-shutter"}></ha-icon>
            </span>
            <span class="dd-room-tile-copy">
              <span class="dd-room-tile-label">${this._t("domain.cover")}</span>
              <span class="dd-room-tile-state">${this._areaTileState(l,r.length,"open")}</span>
            </span>
            <span class="dd-room-tile-actions">
              <button
                class="dd-room-tile-action"
                type="button"
                title=${this._t("action.open_all")}
                aria-label=${this._t("action.open_all")}
                @click=${()=>{this._setAreaCoverState(e,!0)}}
              >
                <ha-icon icon="mdi:arrow-up"></ha-icon>
              </button>
              <button
                class="dd-room-tile-action"
                type="button"
                title=${this._t("action.close_all")}
                aria-label=${this._t("action.close_all")}
                @click=${()=>{this._setAreaCoverState(e,!1)}}
              >
                <ha-icon icon="mdi:arrow-down"></ha-icon>
              </button>
            </span>
          </div>
        `:o}
        ${s.length?d("fan",s.length,this._countActiveEntities(s,"fan"),["mdi:fan-off","mdi:fan"],["action.fans_on_summary","action.fans_off_summary"],()=>this._toggleAreaFans(e)):o}
        ${n.length?c`
          <button
            class="dd-room-tile climate ${h>0?"is-on":""}"
            type="button"
            title=${this._t("action.open_climate_controls")}
            aria-label=${`${this._t("domain.climate")}: ${g}. ${this._t("action.open_climate_controls")}`}
            @click=${()=>this._openAreaClimateControls(e,n)}
          >
            <span class="dd-room-tile-icon">
              <ha-icon icon=${y("climate")}></ha-icon>
            </span>
            <span class="dd-room-tile-copy">
              <span class="dd-room-tile-label">${this._t("domain.climate")}</span>
              <span class="dd-room-tile-state">${g}</span>
            </span>
            <ha-icon class="dd-room-tile-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
          </button>
        `:o}
      </div>
    `}_renderAreaCompactBar(e,t,i,a,r,s){const n=this._areaHeaderStuck,d=[t.temperature,t.humidity].filter(Boolean).join(" · ");return c`
      <div class="dd-room-compact ${n?"is-visible":""}" ?inert=${!n} aria-hidden=${n?"false":"true"}>
        <div class="dd-room-compact-panel">
          <div class="dd-room-compact-bar">
            ${a}
            <div class="dd-room-compact-title">
              <strong>${e.name}</strong>
              <span>${d||i}</span>
            </div>
            <div class="dd-page-header-actions">${r}</div>
          </div>
          ${n&&this._areaHeaderRevealed?s:o}
        </div>
      </div>
    `}_renderAreaMobileCameraAction(e){const t=e.find(e=>{if(!e.entity_id.startsWith("camera."))return!1;const t=this.hass?.states?.[e.entity_id]?.state;return Boolean(t&&"unavailable"!==t&&"unknown"!==t)});return t?c`
      <button
        class="dd-page-header-button"
        type="button"
        title=${this._t("action.open_camera")}
        aria-label=${this._t("action.open_camera")}
        @click=${()=>this._showMoreInfo(t.entity_id)}
      >
        <ha-icon icon="mdi:video-outline"></ha-icon>
      </button>
    `:o}_renderAreaHeaderReadings(e){return[e.temperature?c`
        <span class="dd-page-header-reading temperature" title=${this._t("home.temperature")}>
          <ha-icon icon="mdi:thermometer" aria-hidden="true"></ha-icon>
          <span class="dd-visually-hidden">${this._t("home.temperature")}</span>
          ${e.temperature}
        </span>
      `:o,e.humidity?c`
        <span class="dd-page-header-reading humidity" title=${this._t("home.humidity")}>
          <ha-icon icon="mdi:water-percent" aria-hidden="true"></ha-icon>
          <span class="dd-visually-hidden">${this._t("home.humidity")}</span>
          ${e.humidity}
        </span>
      `:o]}_renderMobileEntitiesSection(e,t){const i=this._sortAreaEntities(e.area_id,t);if("ungrouped"===this.config?.areas_options?.[e.area_id]?.entity_layout)return this._renderUngroupedAreaEntities(e,i);const a=this._sortAreaEntityGroups(e.area_id,this._mobileEntityGroups(e.area_id,i));if(!a.length)return o;const r=this._isMobile&&!this._editMode&&!this._renderAllMobileAreaEntities&&a.length>4?a.slice(0,4):a;return c`
      <section class="mobile-entities-section layout-${this._mobileEntityLayout}">
        ${r.map((t,i)=>{const r=this._mobileControllableEntities(t.entities).length>0,s="grid"===this._mobileEntityLayout,n=this._isMobile&&!this._editMode&&!this._renderAllMobileAreaEntities&&t.entities.length>12?t.entities.slice(0,12):t.entities,l=n.map(e=>e.entity_id);return c`
            <div
              class=${d({"mobile-domain-group":!0,"group-editing":this._editMode&&this._canManageDashboard(),"group-dragging":this._generatedGroupDrag?.areaId===e.area_id&&this._generatedGroupDrag.groupKey===t.key,"group-drag-over":this._generatedGroupDragOver?.areaId===e.area_id&&this._generatedGroupDragOver.groupKey===t.key})}
              @dragover=${i=>this._handleGeneratedGroupDragOver(i,e.area_id,t.key)}
              @drop=${i=>this._handleGeneratedGroupDrop(i,e.area_id,t.key,a.map(e=>e.key))}
            >
              <div class="mobile-domain-header">
                <div class="mobile-domain-title">
                  ${"todo"===t.key?c`<span class="mobile-layout-toggle static"><ha-icon icon="mdi:clipboard-list-outline"></ha-icon></span>`:c`
                        <button
                          class="mobile-layout-toggle ${s?"active":""}"
                          type="button"
                          title=${s?this._t("layout.swipe_cards"):this._t("layout.show_all_cards")}
                          aria-label=${s?this._t("layout.switch_swipe_cards"):this._t("layout.show_all_cards")}
                          @click=${this._toggleMobileEntityLayout}
                        >
                          <ha-icon icon=${s?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
                        </button>
                      `}
                  <span class="mobile-domain-title-copy">
                    <span class="mobile-domain-title-label">${t.name}</span>
                    ${t.entities.length>0?c`
                      <span class="mobile-domain-count">(${this._tp("common.item",t.entities.length)})</span>
                    `:o}
                  </span>
                </div>
                <div class="mobile-domain-header-actions">
                  ${this._editMode&&this._canManageDashboard()?c`
                    <button
                      class="mobile-domain-order-button"
                      type="button"
                      title=${this._t("settings.move_up")}
                      aria-label=${this._t("settings.move_up")}
                      ?disabled=${0===i}
                      @click=${t=>this._moveGeneratedGroup(t,e.area_id,a.map(e=>e.key),i,-1)}
                    >
                      <ha-icon icon="mdi:arrow-up"></ha-icon>
                    </button>
                    <button
                      class="mobile-domain-order-button"
                      type="button"
                      title=${this._t("settings.move_down")}
                      aria-label=${this._t("settings.move_down")}
                      ?disabled=${i===a.length-1}
                      @click=${t=>this._moveGeneratedGroup(t,e.area_id,a.map(e=>e.key),i,1)}
                    >
                      <ha-icon icon="mdi:arrow-down"></ha-icon>
                    </button>
                    <button
                      class="mobile-domain-drag-handle"
                      type="button"
                      draggable="true"
                      title=${this._t("layout.drag_group")}
                      aria-label=${this._t("layout.drag_group")}
                      @dragstart=${i=>this._handleGeneratedGroupDragStart(i,e.area_id,t.key)}
                      @dragend=${this._clearGeneratedGroupDragState}
                      @click=${e=>e.stopPropagation()}
                    >
                      <ha-icon icon="mdi:drag"></ha-icon>
                    </button>
                  `:o}
                  ${r?this._renderMobileDomainMaster(t):o}
                </div>
	              </div>
	              <div class="mobile-entity-rail">
	                ${this._renderDomainCustomCardSlot(e.area_id,t.key,0,n.length)}
	                ${v(n,e=>e.entity_id,(i,a)=>c`
                      ${this._renderEditableGeneratedCard(e,i,t.key,a,l)}
                      ${this._renderDomainCustomCardSlot(e.area_id,t.key,a+1,n.length)}
                    `)}
	              </div>
	            </div>
	          `})}
      </section>
    `}_renderUngroupedAreaEntities(e,t){const i=this._getAreaCustomCards(e.area_id).some(e=>e.placement.startsWith("ungrouped:")||e.placement.startsWith("domain:")||e.placement.startsWith("after:"));if(!t.length&&!i&&!this._editMode)return o;const a="grid"===this._mobileEntityLayout,r=new Map;t.forEach(e=>{const t=this._mobileEntityTypeKey(e.entity_id)||"other";r.set(t,(r.get(t)||0)+1)});const s=new Map;return c`
      <section class="mobile-entities-section area-ungrouped-entities layout-${this._mobileEntityLayout}">
        <div class="mobile-domain-group area-ungrouped-group">
          <div class="mobile-domain-header">
            <div class="mobile-domain-title">
              <button
                class="mobile-layout-toggle ${a?"active":""}"
                type="button"
                title=${a?this._t("layout.swipe_cards"):this._t("layout.show_all_cards")}
                aria-label=${a?this._t("layout.switch_swipe_cards"):this._t("layout.show_all_cards")}
                @click=${this._toggleMobileEntityLayout}
              >
                <ha-icon icon=${a?"mdi:view-carousel-outline":"mdi:view-grid-outline"}></ha-icon>
              </button>
              <span class="mobile-domain-title-copy">
                <span class="mobile-domain-title-label">${this._t("layout.entities")}</span>
                <span class="mobile-domain-count">(${this._tp("common.entity",t.length)})</span>
              </span>
            </div>
          </div>
          <div class="mobile-entity-rail">
            ${this._renderUngroupedCustomCardSlot(e.area_id,0)}
            ${t.map((i,a)=>{const n=this._mobileEntityTypeKey(i.entity_id)||"other",d=s.get(n)||0,l=r.get(n)||0;return s.set(n,d+1),c`
                ${0===d?this._renderDomainCustomCardSlot(e.area_id,n,0,l):o}
                ${this._renderEditableGeneratedCard(e,i,Ut,a,t.map(e=>e.entity_id))}
                ${this._renderDomainCustomCardSlot(e.area_id,n,d+1,l)}
                ${this._renderUngroupedCustomCardSlot(e.area_id,a+1)}
              `})}
          </div>
        </div>
      </section>
    `}_renderMobileDomainMaster(e){const t=this._mobileControllableEntities(e.entities);if(!t.length)return o;const i=t[0].entity_id.split(".")[0]||e.key,a=t.filter(e=>{const t=this._getEffectiveEntityState(this.hass.states[e.entity_id]);return this._isEntityActiveForUi(t,i)}).length,r=a>0;if("cover"===i)return this._renderMobileDomainActions(i,t,[{turnOn:!0,label:this._t("action.open_all"),icon:"mdi:arrow-up",active:r},{turnOn:!1,label:this._t("action.close_all"),icon:"mdi:arrow-down",active:!r}]);if("lock"===i)return this._renderMobileDomainActions(i,t,[{turnOn:!1,label:this._t("action.lock_all"),icon:"mdi:lock-outline",active:!r},{turnOn:!0,label:this._t("action.unlock_all"),icon:"mdi:lock-open-variant-outline",active:r}]);const s=this._mobileDomainMasterLabel(i,r,a,t.length),n=this._mobileDomainMasterIcon(i,r);return c`
      <button
        class="mobile-domain-master domain-${i} ${r?"active":""}"
        type="button"
        title=${s}
        aria-label=${s}
        aria-pressed=${r?"true":"false"}
        @click=${e=>{e.stopPropagation(),this._requestMobileGroupState(t,!r,i)}}
      >
        <ha-icon icon=${n}></ha-icon>
        <span class="mobile-domain-master-track" aria-hidden="true"></span>
      </button>
    `}_renderMobileDomainActions(e,t,i){return c`
      <div class="mobile-domain-master-actions domain-${e}" role="group">
        ${i.map(i=>c`
          <button
            class="mobile-domain-master-action ${i.active?"active":""}"
            type="button"
            title=${i.label}
            aria-label=${i.label}
            @click=${a=>{a.stopPropagation(),this._requestMobileGroupState(t,i.turnOn,e)}}
          >
            <ha-icon icon=${i.icon}></ha-icon>
          </button>
        `)}
      </div>
    `}_mobileDomainMasterLabel(e,t,i,a){return"light"===e?this._t(t?"action.lights_off_summary":"action.lights_on_summary",{active:i,total:a}):"cover"===e?this._t(t?"action.covers_close_summary":"action.covers_open_summary",{active:i,total:a}):"fan"===e?this._t(t?"action.fans_off_summary":"action.fans_on_summary",{active:i,total:a}):"lock"===e?this._t(t?"action.lock":"action.unlock"):this._t(t?"action.switches_off_summary":"action.switches_on_summary",{active:i,total:a})}_mobileDomainMasterIcon(e,t){return"light"===e?t?"mdi:lightbulb":"mdi:lightbulb-outline":"switch"===e?t?"mdi:power-plug":"mdi:power-plug-off-outline":"fan"===e?t?"mdi:fan":"mdi:fan-off":"cover"===e?t?"mdi:window-shutter-open":"mdi:window-shutter":"lock"===e?t?"mdi:lock-open-variant-outline":"mdi:lock-outline":t?"mdi:toggle-switch":"mdi:toggle-switch-off-outline"}_customCardDomainGroupKeys(e){const t=[];return this._getAreaCustomCards(e).forEach(e=>{let i;if(e.placement.startsWith("domain:")){const t=/^domain:(.+):\d+$/.exec(e.placement);i=t?.[1]}else e.placement.startsWith("after:")&&(i=e.placement.slice(6));i&&!t.includes(i)&&t.push(i)}),t}_mobileEntityGroups(e,t){const i=t.reduce((e,t)=>{const i=this._mobileEntityTypeKey(t.entity_id);return i?(e[i]||(e[i]=[]),e[i].push(t),e):e},{});this._customCardDomainGroupKeys(e).forEach(e=>{i[e]||(i[e]=[])});const a=["light","switch","cover","climate","todo","scene","event","motion","binary_sensor","sensor","media_player","fan","lock","camera","vacuum"];return Object.entries(i).sort(([e],[t])=>{const i=a.indexOf(e),o=a.indexOf(t);return-1!==i||-1!==o?(-1===i?999:i)-(-1===o?999:o):this._mobileGroupName(e).localeCompare(this._mobileGroupName(t))}).map(([e,t])=>({key:e,name:this._mobileGroupName(e),icon:this._mobileGroupIcon(e),entities:t}))}_sortAreaEntityGroups(e,t){const i=this.config?.areas_options?.[e]?.group_order||[];if(!i.length)return t;const a=new Map(i.map((e,t)=>[e,t])),o=[];i.forEach(e=>{const t=this._strategyGroupForMobileGroupKey(e);o.includes(t)||o.push(t)});const r=new Map(o.map((e,t)=>[e,t])),s=e=>a.get(e)??r.get(this._strategyGroupForMobileGroupKey(e));return t.map((e,t)=>({group:e,fallbackIndex:t})).sort((e,t)=>{const i=s(e.group.key),a=s(t.group.key);return void 0!==i&&void 0!==a?i-a:void 0!==i?-1:void 0!==a?1:e.fallbackIndex-t.fallbackIndex}).map(({group:e})=>e)}_strategyGroupForMobileGroupKey(e){return"light"===e||"lights"===e?"lights":["climate","humidifier","water_heater","fan"].includes(e)?"climate":"cover"===e||"covers"===e?"covers":"media_player"===e||"media_players"===e?"media_players":["alarm_control_panel","lock","camera","binary_sensor","security"].includes(e)?"security":"motion"===e?"motion":["script","scene","automation","todo","event","actions"].includes(e)?"actions":"others"}_sortAreaEntities(e,t){const i=this.config?.areas_options?.[e],a=Q(K(this.hass)),o="ungrouped"===i?.entity_layout,r=new Map((i?.entity_order||[]).map((e,t)=>[e,t]));return[...t].sort((e,t)=>{if(o){const i=r.get(e.entity_id),a=r.get(t.entity_id);if(void 0!==i&&void 0!==a)return i-a;if(void 0!==i)return-1;if(void 0!==a)return 1}else{const a=this._mobileEntityTypeKey(e.entity_id);if(a===this._mobileEntityTypeKey(t.entity_id)&&a){const o=i?.groups_options?.[a]?.order||[],r=o.indexOf(e.entity_id),s=o.indexOf(t.entity_id);if(-1!==r&&-1!==s)return r-s;if(-1!==r)return-1;if(-1!==s)return 1}const o=this._areaStrategyGroupKey(e.entity_id);if(o===this._areaStrategyGroupKey(t.entity_id)&&o){const a=i?.groups_options?.[o]?.order||[],r=a.indexOf(e.entity_id),s=a.indexOf(t.entity_id);if(-1!==r&&-1!==s)return r-s;if(-1!==r)return-1;if(-1!==s)return 1}}const s=this.hass.states[e.entity_id]?.attributes?.friendly_name||e.entity_id,n=this.hass.states[t.entity_id]?.attributes?.friendly_name||t.entity_id;return a.compare(s,n)})}_renderEditableGeneratedCard(e,t,i,a,o){if(!this._editMode||!this._canManageDashboard())return this._renderMobileEntityCard(e,t);const r=this._isAreaEntityHidden(e.area_id,t.entity_id),s=this._generatedCardDrag?.areaId===e.area_id&&this._generatedCardDrag.entityId===t.entity_id,n=this._generatedCardDragOver?.areaId===e.area_id&&this._generatedCardDragOver.entityId===t.entity_id&&this._generatedCardDragOver.groupKey===i;return c`
      <div
        class=${d({"dd-generated-card-wrap":!0,editing:!0,"is-hidden":r,dragging:s,"drag-over":n})}
        draggable="true"
        @dragstart=${a=>this._handleGeneratedCardDragStart(a,e.area_id,t.entity_id,i)}
        @dragover=${a=>this._handleGeneratedCardDragOver(a,e.area_id,t.entity_id,i)}
        @drop=${t=>this._handleGeneratedCardDrop(t,e.area_id,i,a,o)}
        @dragend=${this._clearGeneratedCardDragState}
        @click=${e=>e.stopPropagation()}
      >
        <div class="dd-generated-card-toolbar">
          <button type="button" title=${this._t("layout.drag_card")} aria-label=${this._t("layout.drag_card")}>
            <ha-icon icon="mdi:drag"></ha-icon>
          </button>
          <button
            type="button"
            title=${this._t(r?"common.show":"common.hide")}
            aria-label=${this._t(r?"common.show":"common.hide")}
            aria-pressed=${r?"true":"false"}
            @click=${i=>this._toggleGeneratedCardVisibility(i,e.area_id,t.entity_id)}
          >
            <ha-icon icon=${r?"mdi:eye":"mdi:eye-off-outline"}></ha-icon>
          </button>
        </div>
        ${this._renderMobileEntityCard(e,t)}
      </div>
    `}_handleGeneratedGroupDragStart(e,t,i){this._editMode&&this._canManageDashboard()?(e.stopPropagation(),this._clearCustomCardDragState(),this._clearGeneratedCardDragState(),this._generatedGroupDrag={areaId:t,groupKey:i},this._generatedGroupDragOver=null,e.dataTransfer?.setData("text/plain",i),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")):e.preventDefault()}_handleGeneratedGroupDragOver(e,t,i){const a=this._generatedGroupDrag;this._editMode&&a&&a.areaId===t&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._generatedGroupDragOver={areaId:t,groupKey:i})}_handleGeneratedGroupDrop(e,t,i,a){const o=this._generatedGroupDrag;if(!o||o.areaId!==t)return;e.preventDefault(),e.stopPropagation();const r=a.indexOf(o.groupKey),s=a.indexOf(i);if(r<0||s<0||r===s)return void this._clearGeneratedGroupDragState();const n=[...a],[c]=n.splice(r,1);c&&n.splice(s,0,c),this._saveAreaOptionsPatch(t,{group_order:n}),this._clearGeneratedGroupDragState()}_moveGeneratedGroup(e,t,i,a,o){e.preventDefault(),e.stopPropagation();const r=a+o;if(r<0||r>=i.length)return;const s=[...i],[n]=s.splice(a,1);n&&(s.splice(r,0,n),this._saveAreaOptionsPatch(t,{group_order:s}))}_handleGeneratedCardDragStart(e,t,i,a){this._editMode&&this._canManageDashboard()?(this._clearCustomCardDragState(),this._generatedCardDrag={areaId:t,entityId:i,groupKey:a},this._generatedCardDragOver=null,e.dataTransfer?.setData("text/plain",i),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")):e.preventDefault()}_handleGeneratedCardDragOver(e,t,i,a){const o=this._generatedCardDrag;this._editMode&&o&&o.areaId===t&&o.groupKey===a&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._generatedCardDragOver={areaId:t,entityId:i,groupKey:a})}_handleGeneratedCardDrop(e,t,i,a,o){const r=this._generatedCardDrag;if(!r||r.areaId!==t||r.groupKey!==i)return;e.preventDefault(),e.stopPropagation();const s=o.indexOf(r.entityId);if(s<0)return void this._clearGeneratedCardDragState();const n=[...o],[c]=n.splice(s,1);if(!c)return void this._clearGeneratedCardDragState();if(n.splice(Math.max(0,Math.min(a,n.length)),0,c),i===Ut)return this._saveAreaOptionsPatch(t,{entity_order:n}),void this._clearGeneratedCardDragState();const d=new Set(n.map(e=>this._areaStrategyGroupKey(e)||i)),l=1!==d.size,h=l?i:Array.from(d)[0]||i,p=this.config?.areas_options?.[t],m=p?.groups_options||{},u=m[h]||{},g=this._getEditableAreaEntities(t).filter(e=>l?this._mobileEntityTypeKey(e.entity_id)===i:(this._areaStrategyGroupKey(e.entity_id)||i)===h).map(e=>e.entity_id),b=u.order||[],_=[...b.filter((e,t)=>g.includes(e)&&b.indexOf(e)===t),...g.filter(e=>!b.includes(e))],f=new Set(n);let x=0;const v=_.map(e=>f.has(e)&&n[x++]||e);this._saveAreaOptionsPatch(t,{groups_options:{...m,[h]:{...u,order:v}}}),this._clearGeneratedCardDragState()}_isAreaEntityHidden(e,t){const i=this.config?.areas_options?.[e]?.groups_options||{};return Object.values(i).some(e=>e.hidden?.includes(t))}_toggleGeneratedCardVisibility(e,t,i){if(e.preventDefault(),e.stopPropagation(),!this._canManageDashboard())return;const a=this.config?.areas_options?.[t],o=a?.groups_options||{},r=this._isAreaEntityHidden(t,i),s=Object.fromEntries(Object.entries(o).map(([e,t])=>[e,{...t,hidden:(t.hidden||[]).filter(e=>e!==i)}]));if(!r){const e=this._areaStrategyGroupKey(i)||this._mobileEntityTypeKey(i)||"others",t=s[e]||{};s[e]={...t,hidden:[...t.hidden||[],i]}}this._saveAreaOptionsPatch(t,{groups_options:s})}_areaStrategyGroupKey(e){const t=e.split(".")[0]||"",i=String(this.hass.states[e]?.attributes?.device_class||"");return"light"===t?"lights":["climate","humidifier","water_heater","fan"].includes(t)?"climate":"cover"===t||"binary_sensor"===t&&["door","garage_door","window"].includes(i)?"covers":"media_player"===t?"media_players":["alarm_control_panel","lock","camera"].includes(t)?"security":"binary_sensor"===t&&["motion","occupancy","presence"].includes(i)?"motion":["script","scene","automation","todo"].includes(t)?"actions":["switch","button","input_boolean","vacuum","lawn_mower","valve","select","number","input_select","input_number","counter","timer","sensor"].includes(t)?"others":void 0}_mobileEntityTypeKey(e){const t=e.split(".")[0];if(t){if("binary_sensor"===t){const t=this.hass.states[e]?.attributes?.device_class;return"motion"===t?"motion":"binary_sensor"}return t}}_mobileGroupName(e){return C(this.hass,e)}_mobileGroupIcon(e){return"motion"===e?"mdi:motion-sensor":y(e)}_areaReplacementCardConfig(e){const t=E({hass:this.hass,config:this.config,entity:e,surface:"area_cards"});return t&&!1!==t.enabled?A({hass:this.hass,config:this.config,entity:e,surface:"area_cards"}):null}_renderAreaReplacementCard(e,t){return c`
      <div class="mobile-entity-replacement-card" data-entity=${e}>
        <dwains-dashboard-next-card-host
          .hass=${this.hass}
          .config=${t}
        ></dwains-dashboard-next-card-host>
      </div>
    `}_renderMobileEntityCard(e,t){const i=this.hass.states[t.entity_id];if(!i)return o;const a=this._getEffectiveEntityState(i),r=t.entity_id.split(".")[0]||"unknown";if("todo"===r)return this._renderTodoListCard(t);const s=a.attributes?.device_class,n=this._areaReplacementCardConfig(t.entity_id);if(n)return this._renderAreaReplacementCard(t.entity_id,n);const d=V(this.hass)[t.entity_id]?.icon||a.attributes?.icon||w(r,s)||y(r),l=a.attributes?.friendly_name||V(this.hass)[t.entity_id]?.name||t.entity_id,h=M(l,e.name),p=z(h,this._entityDeviceName(t.entity_id),e.name),m=this._isEntityActiveForUi(a,r),u=this._mobileEntityActionKind(r),b=this._mobileEntityHasInlineSelect(r,a),_=["mobile-entity-card",`mobile-entity-${r}`,`action-${u}`,m?"is-active":"is-off",b?"has-inline-select":"",g(a)?"is-unavailable":""].join(" ");return c`
      <article
        class=${_}
        style=${`--entity-color: ${this._mobileEntityColor(r,s)};`}
        role="button"
        tabindex="0"
        aria-label=${l}
        title=${l}
        @click=${()=>this._showMoreInfo(t.entity_id)}
        @keydown=${e=>this._handleMobileEntityKeydown(e,t.entity_id)}
      >
        <div class="mobile-entity-top">
          <div class="mobile-entity-icon">
            <ha-icon icon=${d}></ha-icon>
          </div>
          ${this._renderMobileEntityActions(a,r,m)}
        </div>
        <div class="mobile-entity-content">
          ${p?c`<div class="mobile-entity-meta">${p}</div>`:o}
          <div class="mobile-entity-name">${h}</div>
          <div class="mobile-entity-status">${this._mobileEntityStatusText(a,r)}</div>
        </div>
        ${b?this._renderMobileEntitySelect(a,r):o}
      </article>
    `}_entityDeviceName(e){const t=V(this.hass)[e]?.device_id,i=t?this.hass.devices?.[t]:void 0;return i&&(i.name_by_user||i.name)||void 0}_renderTodoListCard(e){return c`
      <div class="mobile-todo-list-card" data-entity=${e.entity_id}>
        <dwains-dashboard-next-card-host
          eager
          .hass=${this.hass}
          .config=${{type:"todo-list",entity:e.entity_id}}
        ></dwains-dashboard-next-card-host>
      </div>
    `}_handleMobileEntityKeydown(e,t){const i=e.target;i?.closest?.("button, select, input, textarea, a")||"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._showMoreInfo(t))}_mobileEntityHasInlineSelect(e,t){return["select","input_select"].includes(e)&&Array.isArray(t?.attributes?.options)}_renderMobileEntitySelect(e,t){const i=this._mobileEntitySelectOptions(e),a=String(e?.state||""),o=["unavailable","unknown"].includes(a.toLowerCase())||0===i.length;return c`
      <label
        class="mobile-entity-select"
        @click=${e=>e.stopPropagation()}
        @keydown=${e=>e.stopPropagation()}
      >
        <select
          aria-label=${this._t("common.select_option")}
          ?disabled=${o}
          @change=${i=>this._handleMobileSelectChange(i,e,t)}
        >
          ${i.map(e=>c`
            <option value=${e} ?selected=${e===a}>${e}</option>
          `)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </label>
    `}_mobileEntitySelectOptions(e){const t=String(e?.state||""),i=Array.isArray(e?.attributes?.options)?e.attributes.options.map(e=>String(e)):[];return!t||["unknown","unavailable"].includes(t.toLowerCase())||i.includes(t)?i:[t,...i]}_renderMobileEntityActions(e,t,i){const a=e?.entity_id,o=this._mobileEntityActionKind(t),r=["unavailable","unknown"].includes(String(e?.state||"").toLowerCase()),s=this._entityDisplayName(e),n=e=>this._t("action.entity_action",{action:e,name:s});if("toggle"===o)return c`
        <button
          class="mobile-entity-action mobile-entity-toggle"
          type="button"
          role="switch"
          aria-checked=${i?"true":"false"}
          title=${i?this._t("action.turn_off"):this._t("action.turn_on")}
          aria-label=${s}
          ?disabled=${r}
          @click=${i=>this._handleMobileEntityToggle(i,e,t)}
        ></button>
      `;if("cover"===o)return this._renderMobileCoverActions(e);if("lock"===o){const i=this._isEntityActiveForUi(e,t);return c`
        <button
          class="mobile-entity-action mobile-lock-action ${i?"is-unlocked":""}"
          type="button"
          title=${i?this._t("action.lock"):this._t("action.unlock")}
          aria-label=${n(i?this._t("action.lock"):this._t("action.unlock"))}
          ?disabled=${r}
          @click=${t=>this._handleMobileLockAction(t,e)}
        >
          <ha-icon icon=${i?"mdi:lock-open-variant-outline":"mdi:lock-outline"}></ha-icon>
        </button>
      `}return"scene"===o?c`
        <button
          class="mobile-entity-action mobile-scene-action"
          type="button"
          title=${this._t("action.activate")}
          aria-label=${n(this._t("action.activate"))}
          @click=${t=>this._handleMobileSceneAction(t,e)}
        >
          <ha-icon icon="mdi:play"></ha-icon>
        </button>
      `:c`
      <button
        class="mobile-entity-action mobile-entity-more"
        type="button"
        title=${this._t("action.more_info")}
        aria-label=${n(this._t("action.more_info"))}
        @click=${e=>this._handleMobileMoreInfo(e,a)}
      >
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>
    `}_renderMobileCoverActions(e){const t=String(e?.state||"").toLowerCase(),i=["unavailable","unknown"].includes(t),a=this._coverSupportsFeature(e,1),r=this._coverSupportsFeature(e,2),s=this._coverSupportsFeature(e,8),n=this._entityDisplayName(e),d=e=>this._t("action.entity_action",{action:e,name:n});return c`
      <div class="mobile-cover-actions" @click=${e=>e.stopPropagation()}>
        ${a?c`
          <button
            class="mobile-entity-action mobile-cover-action ${"opening"===t?"active":""}"
            type="button"
            title=${this._t("action.open")}
            aria-label=${d(this._t("action.open"))}
            ?disabled=${i}
            @click=${t=>this._handleMobileCoverAction(t,e,"open")}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </button>
        `:o}
        ${s?c`
          <button
            class="mobile-entity-action mobile-cover-action ${"opening"===t||"closing"===t?"active":""}"
            type="button"
            title=${this._t("action.stop")}
            aria-label=${d(this._t("action.stop"))}
            ?disabled=${i}
            @click=${t=>this._handleMobileCoverAction(t,e,"stop")}
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        `:o}
        ${r?c`
          <button
            class="mobile-entity-action mobile-cover-action ${"closing"===t?"active":""}"
            type="button"
            title=${this._t("action.close")}
            aria-label=${d(this._t("action.close"))}
            ?disabled=${i}
            @click=${t=>this._handleMobileCoverAction(t,e,"close")}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </button>
        `:o}
      </div>
    `}async _handleMobileEntityToggle(e,t,i){e.stopPropagation();const a=t?.entity_id;if(a){try{if(["light","switch","fan","input_boolean"].includes(i)){const e=!this._isEntityActiveForUi(t,i);return this._setOptimisticEntityState(a,e?"on":"off"),void await this.hass.callService(i,e?"turn_on":"turn_off",{entity_id:a})}}catch(e){return this._clearOptimisticEntityStates([a]),console.warn(`Failed to toggle mobile entity ${a}:`,e),void this._showToast(this._t("entity.update_failed"))}this._showMoreInfo(a)}}async _handleMobileSelectChange(e,t,i){e.stopPropagation();const a=e.currentTarget,o=t?.entity_id,r=a?.value;if(o&&void 0!==r){this._setOptimisticEntityState(o,r);try{await this.hass.callService("input_select"===i?"input_select":"select","select_option",{entity_id:o,option:r})}catch(e){this._clearOptimisticEntityStates([o]),console.warn(`Failed to select option for ${o}:`,e),this._showToast(this._t("entity.selector_failed"))}}}async _handleMobileCoverAction(e,t,i){e.stopPropagation();const a=t?.entity_id;if(!a)return;const o="open"===i?"open_cover":"close"===i?"close_cover":"stop_cover",r="open"===i?"open":"close"===i?"closed":void 0;r&&this._setOptimisticEntityState(a,r);try{await this.hass.callService("cover",o,{entity_id:a})}catch(e){this._clearOptimisticEntityStates([a]),console.warn(`Failed to ${i} cover ${a}:`,e),this._showToast(this._t("entity.cover_failed"))}}async _handleMobileLockAction(e,t){e.stopPropagation();const i=t?.entity_id;if(i)try{const e=this._isEntityActiveForUi(t,"lock");this._setOptimisticEntityState(i,e?"locked":"unlocked"),await this.hass.callService("lock",e?"lock":"unlock",{entity_id:i})}catch(e){this._clearOptimisticEntityStates([i]),console.warn(`Failed to toggle lock ${i}:`,e),this._showToast(this._t("entity.lock_failed"))}}async _handleMobileSceneAction(e,t){e.stopPropagation();const i=t?.entity_id;if(i)try{await this.hass.callService("scene","turn_on",{entity_id:i}),this._showToast(this._t("action.scene_activated"))}catch(e){console.warn(`Failed to activate scene ${i}:`,e),this._showMoreInfo(i)}}_handleMobileMoreInfo(e,t){e.stopPropagation(),t&&this._showMoreInfo(t)}_mobileControllableEntities(e){return e.filter(e=>{const t=e.entity_id.split(".")[0]||"";return Boolean(this.hass.states[e.entity_id])&&this._mobileEntitySupportsToggle(t)})}_masterActionLabel(e,t){return"cover"===e?this._t(t?"action.open_all":"action.close_all"):"lock"===e?this._t(t?"action.unlock_all":"action.lock_all"):this._t(t?"action.turn_on_all":"action.turn_off_all")}_masterActionIsDestructive(e,t){return"lock"===e?t:!t}_areaDisplayName(e){return this.config?.areas?.find(t=>t.area_id===e)?.name||e}async _confirmMasterActionIfNeeded(e,t,i,a){const o=De(e);if(!o||!ze(this.config?.settings,o))return!0;const r=this._masterActionLabel(o,t);return this._showConfirmation(r,this._t("action.confirm_master_action",{count:i,area:this._areaDisplayName(a)}),{confirmLabel:r,destructive:this._masterActionIsDestructive(o,t)})}async _requestMobileGroupState(e,t,i){await this._confirmMasterActionIfNeeded(i,t,e.length,this._selectedArea||"")&&await this._setMobileGroupState(e,t,i)}async _setMobileGroupState(e,t,i){const a=this._mobileControllableEntities(e).reduce((e,t)=>{const i=t.entity_id.split(".")[0]||"";return e[i]||(e[i]=[]),e[i].push(t.entity_id),e},{}),o=[];try{await Promise.all(Object.entries(a).map(([e,i])=>i.length?["light","switch","fan","input_boolean"].includes(e)?(o.push(...i),this._setOptimisticEntityStates(i,t?"on":"off"),this.hass.callService(e,t?"turn_on":"turn_off",{entity_id:i})):"cover"===e?(o.push(...i),this._setOptimisticEntityStates(i,t?"open":"closed"),this.hass.callService("cover",t?"open_cover":"close_cover",{entity_id:i})):"lock"===e?(o.push(...i),this._setOptimisticEntityStates(i,t?"unlocked":"locked"),this.hass.callService("lock",t?"unlock":"lock",{entity_id:i})):Promise.resolve():Promise.resolve()));const e=Object.values(a).reduce((e,t)=>e+t.length,0),r=De(i);e&&r&&this._showToast(this._masterActionToast(r,t))}catch(e){this._clearOptimisticEntityStates(o),console.warn("Failed to run mobile group action:",e),this._showToast(this._t("entity.group_failed"))}}_mobileEntitySupportsToggle(e){return["light","switch","fan","input_boolean","cover","lock"].includes(e)}_masterActionToast(e,t){return"light"===e?this._t(t?"action.all_lights_on":"action.all_lights_off"):"switch"===e?this._t(t?"action.all_switches_on":"action.all_switches_off"):"fan"===e?this._t(t?"action.all_fans_on":"action.all_fans_off"):this._masterActionLabel(e,t)}_mobileEntityActionKind(e){return["light","switch","fan","input_boolean"].includes(e)?"toggle":"cover"===e?"cover":"lock"===e?"lock":"scene"===e?"scene":"more"}_coverSupportsFeature(e,t){const i=Number(e?.attributes?.supported_features);return!Number.isFinite(i)||i<=0?1===t||2===t:0!==(i&t)}_mobileEntityStatusText(e,t){if(!e)return"";const i=this._formatFavoriteState(e);if("scene"===t)return this._sceneLastActivatedText(e);if("event"===t)return this._eventLastTriggeredText(e);if("light"===t&&"on"===e.state&&"number"==typeof e.attributes?.brightness)return this._t("entity.brightness",{value:Math.round(e.attributes.brightness/255*100)});if("cover"===t&&"number"==typeof e.attributes?.current_position)return`${i} · ${O(e.attributes.current_position,"%")}`;if("climate"===t){const t=e.attributes?.current_temperature,i=e.attributes?.temperature,a=this.hass?.config?.unit_system?.temperature||"°C";if(void 0!==t&&void 0!==i)return`${O(t,a)} · ${this._t("entity.climate_set",{value:O(i,a)})}`;if(void 0!==t)return O(t,a)}return"media_player"===t&&e.attributes?.media_title?`${i} · ${e.attributes.media_title}`:i}_sceneLastActivatedText(e){const t=String(e?.state||"").toLowerCase();if("unavailable"===t)return this._t("common.unavailable");const i=t&&"unknown"!==t?Date.parse(e.state):Number.NaN;return Number.isFinite(i)?this._formatRelativeTime(i):this._t("entity.not_activated")}_eventLastTriggeredText(e){const t=String(e?.state||"").toLowerCase();if("unavailable"===t)return this._t("common.unavailable");if(!t||"unknown"===t)return this._t("entity.no_events");const i=Date.parse(e?.last_changed||e?.last_updated||"");return Number.isFinite(i)?`${this._formatFavoriteState(e)} · ${this._formatRelativeTime(i)}`:this._t("entity.no_events")}_formatRelativeTime(e){const t=Math.round((e-Date.now())/1e3),i=Math.abs(t),[a,o]=[["year",31536e3],["month",2592e3],["week",604800],["day",86400],["hour",3600],["minute",60],["second",1]].find(([,e])=>i>=e)||["second",1],r=Math.round(t/o);try{const e=this.hass?.locale?.language||navigator.language||void 0;return J(e,{numeric:"auto"}).format(r,a)}catch{if(i<60)return"just now";const e=Math.abs(r);return`${e} ${a}${1===e?"":"s"} ${r<0?"ago":"from now"}`}}_isEntityActiveForUi(e,t){if(!e||["unavailable","unknown"].includes(String(e.state)))return!1;const i=String(e.state).toLowerCase();if("cover"===t)return["open","opening"].includes(i);if("lock"===t)return"unlocked"===i;if("climate"===t){const t=e.attributes?.hvac_action;return t&&"idle"!==t&&"off"!==t}return"media_player"===t?["playing","buffering"].includes(i):"vacuum"===t?["cleaning","returning"].includes(i):"alarm_control_panel"===t?i.startsWith("armed")||["arming","pending","triggered"].includes(i):"camera"!==t&&!["off","closed","locked","not_home","idle"].includes(i)}_mobileEntityColor(e,t){return k(e,t)}_getWeatherEntity(){if(this.config?.settings?.weather_entity_id){const e=this.hass.states[this.config.settings.weather_entity_id];if(e&&!V(this.hass)[e.entity_id]?.hidden_by)return e}return be(this.hass.states,"weather").find(e=>e.entity_id.startsWith("weather.")&&!V(this.hass)[e.entity_id]?.hidden_by)}_getAlarmEntity(){const e=this.config?.settings?.alarm_entity_id;if(!e)return;const t=this.hass.states[e];return t&&!V(this.hass)[t.entity_id]?.hidden_by?t:void 0}_getStatusDomains(){return this._statusDomains(this.hass,this.config)}_getHiddenStatusCount(){return""}_getAreaDeviceCount(e,t=[]){const i=new Set(this._areaDeviceIds(this.config?.devices).get(e));return t.forEach(e=>{e.device_id&&i.add(e.device_id)}),i.size}_getAreaEntities(e){return this._areaResolver.areaEntities(e,this.hass,this.config)}_getFilteredAreaEntities(e){return this._areaResolver.filteredAreaEntities(e,this.hass,this.config)}_getEditableAreaEntities(e){let t=this._getAreaEntities(e).filter(e=>{const t=V(this.hass)[e.entity_id];return Boolean(this.hass.states[e.entity_id])&&!(t?.hidden_by||t?.disabled_by||"diagnostic"===t?.entity_category||"config"===t?.entity_category)});return!1!==this.config?.settings?.hide_unavailable_entities&&(t=t.filter(e=>{const t=this.hass.states[e.entity_id];return t&&!g(t)})),D(this.hass,this.config,t)}_getUnavailableAreaEntities(e){let t=this._getAreaEntities(e);t=t.filter(e=>{const t=V(this.hass)[e.entity_id];return!(t?.hidden_by||"diagnostic"===t?.entity_category||"config"===t?.entity_category)});const i=this.config?.areas_options?.[e];if(i?.groups_options){const e=new Set;for(const t of Object.values(i.groups_options))t.hidden?.forEach(t=>e.add(t));t=t.filter(t=>!e.has(t.entity_id))}return t=D(this.hass,this.config,t),T(t.map(e=>e.entity_id),this.hass.states)}_renderUnavailableEntitiesIcon(e){if(!1===this.config?.settings?.hide_unavailable_entities)return o;const t=this._getUnavailableAreaEntities(e),i=t.unavailable.length+t.unknown.length;if(0===i)return o;const a=this._t("settings.hidden_unavailable_count",{count:i});return c`
      <button
        class="dd-page-header-button is-warning"
        type="button"
        title=${a}
        aria-label=${a}
        @click=${()=>this._showUnavailableEntitiesModal(e)}
      >
        <ha-icon icon="mdi:eye-off-outline"></ha-icon>
        <span class="dd-page-header-badge" aria-hidden="true">${i}</span>
      </button>
    `}_getCachedAreaData(e){return Je(e,this.hass,this._getFilteredAreaEntities(e.area_id),this.config)}_getPictureContrastClass(e){if(!e)return"";const t=this._pictureContrastCache.get(e);return t?"dark"===t?"text-dark":"text-light":(this._pictureContrastCache.set(e,"pending"),this._analyzePictureContrast(e),"text-light")}async _analyzePictureContrast(e){try{const t=await this._calculatePictureTextTone(e);this._pictureContrastCache.set(e,t)}catch{this._pictureContrastCache.set(e,"light")}this.requestUpdate()}_calculatePictureTextTone(e){return new Promise((t,i)=>{const a=new Image;a.decoding="async",a.onload=()=>{try{const e=28,o=document.createElement("canvas");o.width=e,o.height=e;const r=o.getContext("2d",{willReadFrequently:!0});if(!r)return void i(new Error("Canvas context unavailable"));r.drawImage(a,0,0,e,e);const s=r.getImageData(0,0,e,e).data,n=[{x0:.1,x1:.7,y0:.2,y1:.75},{x0:.08,x1:.72,y0:.56,y1:.96},{x0:.18,x1:.82,y0:.18,y1:.82}].map(t=>{const i=Math.floor(t.x0*e),a=Math.ceil(t.x1*e),o=Math.floor(t.y0*e),r=Math.ceil(t.y1*e);let n=0,c=0;for(let t=o;t<r;t++)for(let o=i;o<a;o++){const i=4*(t*e+o),a=(s[i+3]??255)/255;n+=.2126*((s[i]??255)*a+255*(1-a))+.7152*((s[i+1]??255)*a+255*(1-a))+.0722*((s[i+2]??255)*a+255*(1-a)),c++}return c?n/c:0}),c=Math.min(...n);t(c>170?"dark":"light")}catch(e){i(e)}},a.onerror=()=>i(new Error("Image could not be loaded")),a.src=e})}_countActiveEntities(e,t){return e.filter(e=>{const i=this._getEffectiveEntityState(this.hass.states[e.entity_id]);return this._isEntityActiveForUi(i,t)}).length}_areAllEntitiesOff(e,t){return 0===this._countActiveEntities(e,t)}_canLeaveSettings(e){return"settings"!==this._selectedView||!this._settingsDirty||(this._showConfirmation(this._t("settings.discard_confirm"),this._t("settings.discard_message"),{confirmLabel:this._t("settings.discard"),destructive:!0}).then(t=>{t&&(this._clearSettingsEditState(),e())}),!1)}_clearSettingsEditState(){this._pendingSettingsConfig=void 0,this._settingsDirty=!1,this._settingsSaveError="",this._settingsSavePending=!1,this._settingsEditorInitialized=!1}_selectView(e){("settings"===e||this._canLeaveSettings(()=>this._selectView(e)))&&(this._resetAreaHeaderScrollState("area"===e),this._selectedView=e,"home"===e?(this._selectedArea=null,this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._clearSettingsEditState()):"settings"===e&&(Ft().then(()=>this.requestUpdate()),this._selectedArea=null,this._editMode=!1,this._rememberAreaEditMode(null),this._updateUrlArea(null),this._pendingSettingsConfig=void 0,this._settingsDirty=!1,this._settingsSaveError="",this._settingsEditorInitialized=!1),this._syncBottomNavAreaContext(),this._closeMobileNav())}_selectArea(e){this._canLeaveSettings(()=>this._selectArea(e))&&(this._resetAreaHeaderScrollState(!0),this._selectedArea=e,this._selectedView="area",this._editMode=!1,this._rememberAreaEditMode(null),this._clearSettingsEditState(),this._closeMobileNav(),this._updateUrlArea(e),this._syncBottomNavAreaContext())}_toggleHeader(){this._headerExpanded=!this._headerExpanded}_toggleMobileNav(){this._mobileNavOpen=!this._mobileNavOpen}_openDeviceDomain(e){this._navigateToDeviceDomain(e);const t=e.startsWith("binary_sensor.")?e.slice(14):void 0,i={domain:e,icon:"person"===e?"mdi:account-group":t?w("binary_sensor",t):y(e),label:t?I(this.hass,t):C(this.hass,e)},a=()=>{new URL(window.location.href).searchParams.get("dd_device")===e&&(window.dispatchEvent(new CustomEvent("dwains-dashboard-next-select-device-domain",{detail:i})),window.dispatchEvent(new CustomEvent("dwains-dashboard-next-device-context-changed",{detail:i})))};a(),[120,360].forEach(e=>window.setTimeout(a,e))}_navigateToDeviceDomain(e){const t=window.location.pathname.split("/")[1]||"lovelace",i=new URL(window.location.href);i.pathname=`/${t}/devices`,i.search="",e&&i.searchParams.set("dd_device",e),window.history.pushState(null,"",`${i.pathname}${i.search}`);const a=new Event("location-changed",{bubbles:!0,composed:!0});a.detail={replace:!1},window.dispatchEvent(a)}_renderFavoritesSection(){const e=this._getEffectiveFavoriteEntities();return 0===e.length?o:c`
      <div class="favorites-section">
        <div class="favorites-header">
          <ha-icon icon="mdi:star"></ha-icon>
          <h3>${this._t("favorites.title")}</h3>
        </div>
        <div class="favorites-grid">
          ${v(e,e=>e,e=>this._renderFavoriteTile(e))}
        </div>
      </div>
    `}_renderFavoriteTile(e){const t=this.hass?.states[e];return t?c`
      <dwains-dashboard-next-tile-host class="favorite-tile-wrapper" .hass=${this.hass} entity="${e}"></dwains-dashboard-next-tile-host>
    `:o}async _renderFavoriteTileCards(){if(!this.shadowRoot||!this.hass)return;if(!this._headerExpanded)return;const e=++this._favoritesRenderVersion,t=this.shadowRoot?.querySelectorAll("dwains-dashboard-next-tile-host.favorite-tile-wrapper");t&&t.forEach(t=>{if(!t||!t.isConnected)return;t.getAttribute("entity")&&e===this._favoritesRenderVersion&&this._headerExpanded&&(t.hass=this.hass)})}_ensureHomeSummariesRefresh(){!this._homeSummariesLoaded&&this.hass&&this.isConnected&&(this._homeSummariesLoaded=!0,this._loadHomeAssistantSummaries(),this._homeSummariesRefreshInterval=window.setInterval(()=>{this._loadHomeAssistantSummaries()},3e5))}_stopHomeSummariesRefresh(){this._homeSummariesRefreshInterval&&(clearInterval(this._homeSummariesRefreshInterval),this._homeSummariesRefreshInterval=void 0),this._homeSummariesLoaded=!1}async _loadHomeAssistantSummaries(){if(!this.hass?.user?.is_admin)return;const[e,t]=await Promise.all([this._fetchRepairsIssueCount(),this._fetchDiscoveredDeviceCount()]);this._repairsIssueCount!==e&&(this._repairsIssueCount=e),this._discoveredDeviceCount!==t&&(this._discoveredDeviceCount=t)}async _fetchRepairsIssueCount(){try{const e=await this.hass.callWS({type:"repairs/list_issues"});return this._extractCollection(e?.issues??e).filter(e=>!this._isSummaryItemDismissed(e)).length}catch(e){return 0}}async _fetchDiscoveredDeviceCount(){const e=["config_entries/flow/progress","config_entries/discovery_info","config_entries/discovery_info/list","config_entries/get_discovery_info"];for(const t of e)try{const e=await this.hass.callWS({type:t}),i=this._countDiscoveryItems(e);if(i>0)return i}catch(e){}return 0}_getUpdateEntityCount(){return this.hass?.states?this._updateEntityCount(this.hass.states):0}_extractCollection(e){return e?Array.isArray(e)?e:"object"==typeof e?Object.values(e):[]:[]}_isSummaryItemDismissed(e){return Boolean(e?.dismissed||e?.ignored||e?.is_ignored||"ignored"===e?.status||"dismissed"===e?.status)}_countDiscoveryItems(e){if(!e)return 0;if(Array.isArray(e))return e.filter(e=>!this._isSummaryItemDismissed(e)).length;if("object"!=typeof e)return 0;if(this._looksLikeDiscoveryItem(e))return this._isSummaryItemDismissed(e)?0:1;const t=e.discovered??e.discovery??e.flows??e.entries??e.items;return t?this._countDiscoveryItems(t):Object.values(e).reduce((e,t)=>e+this._countDiscoveryItems(t),0)}_looksLikeDiscoveryItem(e){return!(!e||"object"!=typeof e||Array.isArray(e))&&Boolean(e.flow_id||e.handler||e.source||e.context||e.integration||e.domain)}_closeMobileNav(){this._mobileNavOpen=!1}_showMoreInfo(e){Oe(this,"hass-more-info",{entityId:e})}_syncSettingsEditor(){const e=this.renderRoot?.querySelector("dwains-dashboard-next-strategy-editor");e&&this.hass&&this.config&&("function"==typeof e.setConfig?(e.hass=this.hass,this._settingsEditorInitialized||(this._settingsEditorInitialized=!0,e.setConfig(this.config))):Ft().then(()=>this.requestUpdate()))}async _saveSettingsPage(){if(!this._pendingSettingsConfig||this._settingsSavePending||!this.hass)return;if(!this._canManageDashboard())return;this._settingsSavePending=!0,this._settingsSaveError="";const e=this._pendingSettingsConfig;try{await _e(this.hass,this._getDashboardUrlPath(),t=>({...t||{},...e})),this.config={...this.config,...e},this._settingsSaveError="",this._pendingSettingsConfig===e&&(this._pendingSettingsConfig=void 0,this._settingsDirty=!1,this._settingsEditorInitialized=!1),this.requestUpdate()}catch(e){console.error("Failed to save Dwains Dashboard settings:",e),this._settingsSaveError=this._t("error.settings_save",{error:String(e)})}finally{this._settingsSavePending=!1}}_renderSettingsView(){const e=this._settingsSavePending,t=this._settingsDirty&&!e,i=this._settingsSaveError?"error":e?"saving":this._settingsDirty?"dirty":"saved",a="wall_tablet"===this._settingsSubPage&&"saved"===i,r="error"===i?this._settingsSaveError:"saving"===i?this._t("common.saving"):"dirty"===i?this._t("settings.unsaved_changes"):a?this._t(this._deviceSettingsJustSaved?"kiosk.saved_now":"kiosk.autosave"):this._t("settings.all_saved");return c`
      <section class="settings-page-view">
        <header class="settings-page-header">
          <button
            class="settings-page-back"
            type="button"
            title=${this._t("common.close")}
            aria-label=${this._t("common.close")}
            @click=${this._closeSettingsPage}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <div class="settings-page-title">
            <h1>${this._t("sidebar.dashboard_settings")}</h1>
            <p>${this._t("wall_tablet"===this._settingsSubPage?"kiosk.autosave_subtitle":"settings.subtitle")}</p>
          </div>
        </header>
        <div
          class="settings-page-editor"
          @config-changed=${this._handleSettingsConfigChanged}
          @dwains-dashboard-next-settings-page-changed=${this._handleSettingsSubPageChanged}
          @dwains-dashboard-next-device-settings-saved=${this._handleDeviceSettingsSaved}
        >
          <dwains-dashboard-next-strategy-editor></dwains-dashboard-next-strategy-editor>
        </div>
        <div class="settings-save-bar is-${i}">
          <div
            class="settings-save-status"
            role=${"error"===i?"alert":"status"}
            aria-live="polite"
          >
            <span class="settings-save-dot" aria-hidden="true"></span>
            <span class="settings-save-text">${r}</span>
          </div>
          ${a?o:c`
            <button
              type="button"
              class="settings-primary"
              ?disabled=${!t}
              @click=${this._saveSettingsPage}
            >
              ${this._t("common.save")}
            </button>
          `}
        </div>
      </section>
    `}_getWelcomeUserPicture(e){if(this.hass?.states)return this._welcomeUserPicture(this.hass.states,this.hass.user?.id||"",e)}_userInitials(e){const t=e.trim().split(/\s+/).filter(Boolean);if(!t.length)return"";const i=e=>Array.from(e||"")[0]||"";return`${i(t[0])}${t.length>1?i(t[t.length-1]):""}`.toLocaleUpperCase(K(this.hass))}async _loadPersistentNotifications(e=!0){if(this.hass&&this._showNotificationsUi()){this._notificationsLoading=!0,e&&(this._notificationsError="");try{const e=await this.hass.callWS({type:"persistent_notification/get"});this._persistentNotifications=this._sortPersistentNotifications(this._normalizePersistentNotifications(e)),this._notificationsError=""}catch(t){(e||this._notificationsOpen)&&(console.error("Failed to load persistent notifications:",t),this._notificationsError=this._t("error.notifications_load"))}finally{this._notificationsLoading=!1}}}async _ensurePersistentNotificationsSubscription(){if(!this._showNotificationsUi()||this._persistentNotificationsSubscription.active||!this.hass)return;if(!this.isConnected)return;const e=this.hass.connection;if(e?.subscribeMessage)try{await this._persistentNotificationsSubscription.start(()=>e.subscribeMessage(e=>this._handlePersistentNotificationEvent(e),{type:"persistent_notification/subscribe"}))}catch(e){console.warn("Persistent notification subscription unavailable:",e)}}_handlePersistentNotificationEvent(e){if(!this._showNotificationsUi())return;const t=e?.type,i=this._normalizePersistentNotifications(e?.notifications);if("current"===t)return this._persistentNotifications=this._sortPersistentNotifications(i),void(this._notificationsError="");if("removed"===t){const e=new Set(i.map(e=>e.notification_id));return void(this._persistentNotifications=this._persistentNotifications.filter(t=>!e.has(t.notification_id)))}if("added"===t||"updated"===t){const e=new Map(this._persistentNotifications.map(e=>[e.notification_id,e]));i.forEach(t=>e.set(t.notification_id,t)),this._persistentNotifications=this._sortPersistentNotifications([...e.values()])}}_normalizePersistentNotifications(e){return(Array.isArray(e)?e:Object.values(e||{})).map(e=>({notification_id:String(e?.notification_id||""),title:e?.title||null,message:String(e?.message||""),created_at:e?.created_at?String(e.created_at):void 0})).filter(e=>e.notification_id)}_sortPersistentNotifications(e){return[...e].sort((e,t)=>(t.created_at?Date.parse(t.created_at):0)-(e.created_at?Date.parse(e.created_at):0))}_formatNotificationDate(e){const t=Date.parse(e);return Number.isFinite(t)?new Date(t).toLocaleString(this.hass?.language||void 0,{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):e}_handleStatusCardClick(e){"person"===e.domain?this._showPersonEntities():"wattage"===e.domain?this._showWattageEntities():this._showHouseStatusEntities(e)}_showHouseStatusEntities(e){const t=e.entities||[];t.length?bt(this,{domain:e.domain,config:this.config,deviceClass:e.deviceClass,entityIds:t,customTitle:e.name,viewAllLabel:this._t("common.view_all"),onViewAll:()=>this._openDeviceDomain(this._statusDeviceDomainKey(e))}):this._openDeviceDomain(this._statusDeviceDomainKey(e))}_statusDeviceDomainKey(e){return e.deviceClass?`${e.domain}.${e.deviceClass}`:e.domain}_showPersonEntities(){bt(this,{domain:"person",config:this.config})}_showWattageEntities(){bt(this,{domain:"sensor",config:this.config,filterByUnitOfMeasurement:"W"})}_handleLightToggle(e,t){e.stopPropagation(),this._toggleAreaLights(t)}_updateEntityCards(e,t){this.shadowRoot&&this.shadowRoot.querySelectorAll("dwains-dashboard-next-card-host, dwains-dashboard-next-tile-host, hui-card, hui-tile-card, hui-entity-card, hui-thermostat-card, hui-picture-entity-card, hui-media-control-card").forEach(e=>{e.hass!==t&&(e.hass=t)})}_clearEntityCardsCache(){this._areaResolver.clear(),Xe.clear()}_showUnavailableEntitiesModal(e){const t=this._getUnavailableAreaEntities(e),i=this.config?.areas?.find(t=>t.area_id===e),a=i?.name||e,o=[...t.unavailable,...t.unknown];bt(this,{domain:"unavailable",areaId:e,config:this.config,customTitle:`Hidden Unavailable Entities - ${a}`,customEntities:o,customDescription:"These entities are currently hidden because they have 'unavailable' or 'unknown' states. You can disable this filtering in the dashboard configuration."})}_areaThermostatEntityId(e){if(!1!==this.config?.settings?.show_area_thermostat)return function(e,t){let i;for(const t of e)if(t.startsWith("climate.")){if(i)return;i=t}if(!i)return;const a=t[i];return a&&!wt.has(String(a.state))?i:void 0}(e.map(e=>e.entity_id),this.hass.states)}_openAreaClimateControls(e,t){0!==t.length&&(1!==t.length?bt(this,{domain:"climate",areaId:e,config:this.config,customTitle:C(this.hass,"climate"),customEntities:t.map(e=>e.entity_id)}):this._showMoreInfo(t[0].entity_id))}async _toggleAreaLights(e){const t=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("light."));if(0===t.length)return;const i=this._areAllEntitiesOff(t,"light");if(!await this._confirmMasterActionIfNeeded("light",i,t.length,e))return;const a=i?"turn_on":"turn_off",o=t.map(e=>e.entity_id);this._setOptimisticEntityStates(o,i?"on":"off");try{await this.hass.callService("light",a,{entity_id:o}),this._showToast(this._t(i?"action.all_lights_on":"action.all_lights_off"))}catch(t){this._clearOptimisticEntityStates(o),console.warn(`Failed to toggle lights in area ${e}:`,t),this._showToast(this._t("entity.lights_failed"))}}async _toggleAreaSwitches(e){const t=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("switch."));if(0===t.length)return;const i=this._areAllEntitiesOff(t,"switch");if(!await this._confirmMasterActionIfNeeded("switch",i,t.length,e))return;const a=i?"turn_on":"turn_off",o=t.map(e=>e.entity_id);this._setOptimisticEntityStates(o,i?"on":"off");try{await this.hass.callService("switch",a,{entity_id:o}),this._showToast(this._t(i?"action.all_switches_on":"action.all_switches_off"))}catch(t){this._clearOptimisticEntityStates(o),console.warn(`Failed to toggle switches in area ${e}:`,t),this._showToast(this._t("entity.switches_failed"))}}async _toggleAreaFans(e){const t=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("fan."));if(0===t.length)return;const i=this._areAllEntitiesOff(t,"fan");if(!await this._confirmMasterActionIfNeeded("fan",i,t.length,e))return;const a=i?"turn_on":"turn_off",o=t.map(e=>e.entity_id);this._setOptimisticEntityStates(o,i?"on":"off");try{await this.hass.callService("fan",a,{entity_id:o}),this._showToast(this._t(i?"action.all_fans_on":"action.all_fans_off"))}catch(t){this._clearOptimisticEntityStates(o),console.warn(`Failed to toggle fans in area ${e}:`,t),this._showToast(this._t("entity.fans_failed"))}}async _setAreaCoverState(e,t){const i=this._getFilteredAreaEntities(e).filter(e=>e.entity_id.startsWith("cover."));if(0===i.length)return;if(!await this._confirmMasterActionIfNeeded("cover",t,i.length,e))return;const a=t?"open_cover":"close_cover",o=i.map(e=>e.entity_id);this._setOptimisticEntityStates(o,t?"open":"closed");try{await this.hass.callService("cover",a,{entity_id:o}),this._showToast(this._t(t?"action.open_all":"action.close_all"))}catch(i){this._clearOptimisticEntityStates(o),console.warn(`Failed to ${t?"open":"close"} covers in area ${e}:`,i),this._showToast(this._t("entity.covers_failed"))}}_showConfirmation(e,t,i={}){return je(this,{hass:this.hass,title:e,message:t,confirmLabel:i.confirmLabel,destructive:i.destructive})}_showToast(e){e&&Oe(this,"hass-notification",{message:e})}};Wt.styles=[_t,ft,h],e([t({attribute:!1})],Wt.prototype,"hass",void 0),e([t({attribute:!1})],Wt.prototype,"config",void 0),e([i()],Wt.prototype,"_selectedArea",void 0),e([i()],Wt.prototype,"_selectedView",void 0),e([i()],Wt.prototype,"_isMobile",void 0),e([i()],Wt.prototype,"_headerExpanded",void 0),e([i()],Wt.prototype,"_headerCompact",void 0),e([i()],Wt.prototype,"_currentTime",void 0),e([i()],Wt.prototype,"_currentDate",void 0),e([i()],Wt.prototype,"_mobileNavOpen",void 0),e([i()],Wt.prototype,"_editMode",void 0),e([i()],Wt.prototype,"_notificationsOpen",void 0),e([i()],Wt.prototype,"_persistentNotifications",void 0),e([i()],Wt.prototype,"_notificationsLoading",void 0),e([i()],Wt.prototype,"_notificationsError",void 0),e([i()],Wt.prototype,"_areaHeaderStuck",void 0),e([i()],Wt.prototype,"_areaHeaderRevealed",void 0),e([i()],Wt.prototype,"_mobileEntityLayout",void 0),e([i()],Wt.prototype,"_mobileHomeAreasLayout",void 0),e([i()],Wt.prototype,"_mobileHomeDevicesLayout",void 0),e([i()],Wt.prototype,"_mobileHomeFavoritesLayout",void 0),e([i()],Wt.prototype,"_mobileHomeCamerasLayout",void 0),e([i()],Wt.prototype,"_mobileHomeScenesLayout",void 0),e([i()],Wt.prototype,"_homeSceneFeedback",void 0),e([i()],Wt.prototype,"_homeSceneAnnouncement",void 0),e([i()],Wt.prototype,"_areaSidebarWidth",void 0),e([i()],Wt.prototype,"_areaSidebarCollapsed",void 0),e([i()],Wt.prototype,"_isResizingSidebar",void 0),e([i()],Wt.prototype,"_repairsIssueCount",void 0),e([i()],Wt.prototype,"_discoveredDeviceCount",void 0),e([i()],Wt.prototype,"_suggestedFavoriteEntities",void 0),e([i()],Wt.prototype,"_customCardDrag",void 0),e([i()],Wt.prototype,"_customCardDragOver",void 0),e([i()],Wt.prototype,"_generatedCardDrag",void 0),e([i()],Wt.prototype,"_generatedCardDragOver",void 0),e([i()],Wt.prototype,"_generatedGroupDrag",void 0),e([i()],Wt.prototype,"_generatedGroupDragOver",void 0),e([i()],Wt.prototype,"_optimisticEntityStates",void 0),e([i()],Wt.prototype,"_renderAllMobileHomeAreas",void 0),e([i()],Wt.prototype,"_renderAllMobileAreaEntities",void 0),e([i()],Wt.prototype,"_settingsDirty",void 0),e([i()],Wt.prototype,"_settingsSavePending",void 0),e([i()],Wt.prototype,"_settingsSubPage",void 0),e([i()],Wt.prototype,"_deviceSettingsJustSaved",void 0),e([i()],Wt.prototype,"_settingsSaveError",void 0),Wt=e([a("dwains-dashboard-next-layout-card")],Wt);export{Wt as DwainsLayoutCard};
