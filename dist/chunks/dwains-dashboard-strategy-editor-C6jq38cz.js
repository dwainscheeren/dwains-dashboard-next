import{_ as e,n as t,r as i,t as a}from"./state-Bpx-nWN3.js";import{a as o,q as s,Q as r,R as n,g as d,r as c,S as l,T as p,f as h,e as g,l as m,n as _,o as u,U as v,V as f,W as b,X as x,Y as y,u as w,Z as k,_ as $,$ as C,a0 as S,a1 as E,a2 as D,a3 as I,a4 as z,a5 as A,K as P,a6 as O,L as H,a7 as T,a8 as j,a9 as N,aa as L,ab as G,ac as F}from"./screensaver-media-clrApohy.js";import{a as M,i as B,A as R,b as W}from"./lit-element-CR7MDbd3.js";import{d as K,l as V,t as q,u as U,e as X,i as Y,b as Z,c as J,v as Q,w as ee,x as te,y as ie,z as ae,B as oe,A as se,C as re,s as ne,o as de,a as ce,D as le,j as pe,g as he,E as ge}from"./entity-names-C0T-VRRX.js";import{p as me,d as _e}from"./blueprints-YXvSQBN2.js";import{d as ue,g as ve,a as fe,D as be,b as xe}from"./index-CBhviRYP.js";import{f as ye}from"./fire-event-DQiSssdY.js";const we=["area_cards","devices_cards"],ke=[["alarm_control_panel",["alarm-control-panel","alarm card","alarm_control_panel","alarm"]],["media_player",["media-player","media player","mediaplayer"]],["binary_sensor",["binary_sensor","binary sensor","motion sensor","window sensor","door sensor","motion/window/door"]],["cover",["mushroom-cover","slider-button-cover","replace_slider_button_cover","cover card","cover"]],["climate",["mushroom-climate","climate card","climate"]],["switch",["slider-button-switch","replace_slider_button_switch","switch card","switch"]],["light",["mushroom-light","slider-button-light","replace_slider_button_light","light card","light"]],["fan",["mushroom-fan","slider-button-fan","replace_slider_button_fan","fan card","fan"]],["lock",["mushroom-lock","lock card","lock"]],["person",["mushroom-person","person card","person"]],["update",["mushroom-update","update card","update"]],["vacuum",["mushroom-vacuum","vacuum card","vacuum"]],["sensor",["sensor card","sensor"]]],$e=new Set(["replace_with_input_entity","replace_with_input_entity_id","replace_with_input_name","replace_with_input_domain","replace_with_input_device_class","replace_with_input_area"]);let Ce=class extends B{constructor(){super(...arguments),this._open=!1,this._replacements={},this._domain="",this._gallery=[],this._galleryLoading=!1,this._galleryError="",this._search="",this._inputs={},this._loadingBlueprint=!1,this._error="",this._applyAssignment=()=>{if(!this._selected||!this._parsed||!this._canApply())return;const e=this._domain;if(we.some(t=>Boolean(this._replacements[t]?.by_domain?.[e]))&&e!==this._params?.initialDomain)return void(this._error=`${K(this.hass,e)} – ${this._t("common.active")}`);const t={id:this._slug(`${this._selected.name}-${e}`),name:this._selected.name,source:this._selected.url,version:this._parsed.meta.version,blueprint:this._parsed.raw,inputs:this._stripSyntheticInputs(this._inputs),custom_cards:this._parsed.meta.custom_cards||this._selected.custom_cards||[],enabled:!0};let i=Se(this._replacements);for(const a of we)i=this._setDomainAssignment(i,a,e,t);this._commit(i),this.closeDialog()}}_t(e,t){return ue(this.hass,e,t)}showDialog(e){this._params=e,this._config=e.config,this._replacements=Se(e.config.blueprint_replacements||{});const t=this._domainOptions();this._domain=e.initialDomain&&t.some(t=>t.value===e.initialDomain)?e.initialDomain:"",this._selected=void 0,this._parsed=void 0,this._inputs={},this._error="",this._open=!0,this._loadGallery()}closeDialog(){this._open=!1,this._params=void 0,this.remove()}render(){return this._open&&this._config?W`
      <ha-dialog open @closed=${this.closeDialog} .heading=${this._t("replacement.assign")} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${o}
            .label=${this._t("common.close")}
            @click=${this.closeDialog}
          ></ha-icon-button>
          <div slot="title" class="dialog-title">
            <span>${this._t("replacement.assign")}</span>
            <small>${this._t("replacement.builder_description")}</small>
          </div>
        </ha-dialog-header>

        <div class="content">
          ${this._renderBuilder()}
        </div>
      </ha-dialog>
    `:R}_renderBuilder(){const e=this._editableInputKeys();return W`
      <section class="builder">
        ${this._error?W`<div class="error">${this._error}</div>`:R}
        <div class="builder-controls">
          <div class="control-block domain-control">
            <label>${this._t("replacement.domain")}</label>
            ${this._renderDomainControl()}
          </div>
          <div class="control-block search-control">
            <label>${this._t("replacement.search")}</label>
            <input
              class="search"
              type="search"
              placeholder=${this._t("replacement.search")}
              .value=${this._search}
              @input=${e=>this._search=e.target.value}
            />
          </div>
        </div>

        ${this._galleryLoading?W`<div class="loading toolbar-loading">${this._t("common.loading")}</div>`:R}
        ${this._galleryError?W`<div class="error">${this._galleryError}</div>`:R}

        <div class="gallery">
          ${V(this._filteredGallery(),e=>e.url,e=>W`
              <button
                class="blueprint-choice ${this._selected?.url===e.url?"selected":""}"
                @click=${()=>this._selectBlueprint(e)}
              >
                <span class="choice-name">${e.name}</span>
                ${e.description?W`<span class="choice-desc">${e.description}</span>`:R}
                <span class="choice-tags">
                  ${e.version?W`<span>v${e.version}</span>`:R}
                  ${(e.custom_cards||[]).slice(0,3).map(e=>W`<span>${e}</span>`)}
                </span>
              </button>
            `)}
        </div>

        ${this._selected&&e.length?W`
          <div class="input-grid">
            ${e.map(e=>this._renderInputField(e))}
          </div>
        `:R}

        <div class="builder-footer">
          <span class="hint">${this._t("replacement.views_description")}</span>
          <ha-button
            appearance="accent"
            ?disabled=${this._loadingBlueprint||!this._canApply()}
            @click=${this._applyAssignment}
          >
            <ha-icon icon="mdi:check"></ha-icon>
            ${this._t("common.save")}
          </ha-button>
        </div>
        ${this._loadingBlueprint?W`<div class="loading footer-loading">${this._t("replacement.loading_blueprint")}</div>`:R}
      </section>
    `}_renderDomainControl(){const e=this._domainOptions();return W`
      <select
        .value=${this._domain}
        @change=${e=>{this._domain=e.target.value,this._selected=void 0,this._parsed=void 0,this._inputs={},this._error="",this._search=""}}
      >
        ${e.map(e=>W`<option value=${e.value}>${e.label}</option>`)}
      </select>
    `}_renderInputField(e){const t=this._parsed?.meta.input?.[e];return W`
      <label class="input-field">
        <span>${t?.name||e}</span>
        ${t?.description?W`<small>${t.description}</small>`:R}
        <input
          type=${"number"===t?.type?"number":"text"}
          .value=${this._inputs[e]??""}
          @input=${t=>this._inputs={...this._inputs,[e]:t.target.value}}
        />
      </label>
    `}async _loadGallery(){if(!this._gallery.length&&!this._galleryLoading){this._galleryLoading=!0,this._galleryError="";try{const e=await fetch("https://raw.githubusercontent.com/dwainscheeren/dwains-dashboard-blueprints/main/blueprints.json",{redirect:"follow"});if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json(),i=Array.isArray(t)?t:t?.blueprints||[];this._gallery=i.filter(e=>e?.url&&e?.name&&"replace-card"===e?.type&&!function(e){const t=`${e?.name||""} ${e?.description||""} ${e?.url||""}`.toLowerCase();return t.includes("popup")}(e)).map(e=>({name:String(e.name),description:e.description?String(e.description):void 0,type:e.type?String(e.type):void 0,version:null!=e.version?String(e.version):void 0,url:String(e.url),custom_cards:Array.isArray(e.custom_cards)?e.custom_cards.map(String):void 0}))}catch(e){this._galleryError=String(e?.message||e)}finally{this._galleryLoading=!1;const e=this._domainOptions().filter(e=>e.value);this._domain&&!e.some(e=>e.value===this._domain)&&(this._domain="",this._selected=void 0,this._parsed=void 0,this._inputs={})}}}async _selectBlueprint(e){this._selected=e,this._parsed=void 0,this._inputs={},this._error="",this._loadingBlueprint=!0;try{const t=await fetch(e.url,{redirect:"follow"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const i=await t.text(),a=me(i);this._parsed=a,this._inputs=_e(a.meta);const o=De(e,a);!this._domain&&o?this._domain=o:o&&o!==this._domain&&(this._error=this._t("replacement.domain_mismatch",{domain:K(this.hass,this._domain)}),this._selected=void 0,this._parsed=void 0,this._inputs={})}catch(t){this._error=this._t("replacement.load_failed",{name:e.name,error:String(t?.message||t)})}finally{this._loadingBlueprint=!1}}_commit(e){this._replacements=e;const t={...this._config,blueprint_replacements:e};this._config=t,this._params?.onSave(t)}_setDomainAssignment(e,t,i,a){const o=e[t]||{};return e[t]={...o,by_domain:{...o.by_domain||{},[i]:a}},e}_domainOptions(){const e=new Set;for(const t of we)Object.keys(this._replacements[t]?.by_domain||{}).forEach(t=>e.add(t));const t=new Set;this._gallery.forEach(e=>{const i=De(e);i&&t.add(i)}),!t.size&&this._galleryLoading&&ke.forEach(([e])=>t.add(e));const i=this._params?.initialDomain;i&&t.add(i);const a=Array.from(t).filter(t=>!e.has(t)||t===i).map(e=>({value:e,label:K(this.hass,e)})).sort((e,t)=>e.label.localeCompare(t.label,this.hass?.language||void 0));return[{value:"",label:this._t("replacement.all_domains")},...a]}_canApply(){return!!this._parsed&&!!this._selected&&!!this._domain}_galleryForDomain(){const e=this._domain.toLowerCase();return this._gallery.filter(t=>!e||De(t)===e).sort((e,t)=>e.name.localeCompare(t.name))}_filteredGallery(){const e=this._search.trim().toLowerCase();return this._galleryForDomain().filter(t=>{if(!e)return!0;return`${t.name} ${t.description||""} ${(t.custom_cards||[]).join(" ")}`.toLowerCase().includes(e)})}_editableInputKeys(){return Object.keys(this._parsed?.meta.input||{}).filter(e=>!$e.has(e))}_stripSyntheticInputs(e){const t={};return Object.entries(e).forEach(([e,i])=>{$e.has(e)||""===i||(t[e]=i)}),t}_slug(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}};function Se(e){return{area_cards:Ee(e.area_cards),devices_cards:Ee(e.devices_cards)}}function Ee(e){return{by_domain:{...e?.by_domain||{}},by_device_class:{...e?.by_device_class||{}},by_entity:{...e?.by_entity||{}}}}function De(e,t){const i=[e.name,e.description,e.url,...e.custom_cards||[],t?.meta.name,t?.meta.description,...t?.meta.custom_cards||[],Ie(t?.card)].filter(Boolean).join(" ").toLowerCase();return ke.find(([,e])=>e.some(e=>i.includes(e)))?.[0]||""}function Ie(e){if(!e)return"";if("string"==typeof e?.type)return e.type;try{return JSON.stringify(e)}catch{return""}}Ce.styles=M`:host{--mdc-dialog-min-width:min(680px,92vw);--mdc-dialog-max-width:min(760px,96vw)}ha-dialog{--dialog-content-padding:0}.content{padding:0 18px 20px;color:var(--primary-text-color)}.dialog-title{display:grid;gap:2px;min-width:0}.dialog-title>span{font-size:20px;font-weight:650;line-height:1.2}.dialog-title>small,.choice-desc,.hint,.input-field small{color:var(--secondary-text-color);font-size:12px;font-weight:400;line-height:1.35}.dialog-title>small{white-space:normal}.builder{margin-top:14px}.builder-controls{display:grid;grid-template-columns:minmax(180px,240px) minmax(240px,1fr);gap:12px;align-items:end}.control-block{display:flex;flex-direction:column;gap:6px;min-width:0}label{font-size:12px;font-weight:600;color:var(--secondary-text-color)}select,.search,.input-field input{width:100%;box-sizing:border-box;border:1px solid var(--divider-color);border-radius:8px;padding:10px 11px;background:var(--card-background-color);color:var(--primary-text-color);font-size:14px}.toolbar-loading{margin:10px 0 0}.gallery{display:grid;grid-template-columns:1fr;gap:8px;max-height:280px;overflow:auto;padding-right:2px;margin-top:12px}.builder-controls + .gallery{margin-top:12px}.blueprint-choice{text-align:left;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);padding:10px;cursor:pointer;display:flex;flex-direction:column;gap:4px}.blueprint-choice:hover,.blueprint-choice.selected{border-color:var(--primary-color);box-shadow:0 0 0 1px var(--primary-color) inset}.choice-name{font-weight:600}.choice-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:4px}.choice-tags span{border-radius:999px;padding:2px 8px;background:var(--secondary-background-color);color:var(--secondary-text-color);font-size:12px;white-space:nowrap}.input-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.input-field{display:flex;flex-direction:column;gap:4px}.builder-footer{margin-top:14px;padding-top:12px;border-top:1px solid var(--divider-color);display:flex;align-items:center;justify-content:space-between;gap:16px}.builder-footer .hint{margin:0}.builder-footer ha-button{flex:0 0 auto}.builder-footer ha-icon{--mdc-icon-size:18px;margin-right:5px}.footer-loading{margin-top:8px}.error{padding:10px 12px;border-radius:8px;background:rgba(var(--rgb-error-color,244,67,54),0.12);color:var(--error-color);margin-bottom:10px}@media (max-width:760px){:host{--mdc-dialog-min-width:96vw}.builder-controls,.gallery,.input-grid{grid-template-columns:1fr}.builder-footer{align-items:stretch;flex-direction:column}}`,e([t({attribute:!1})],Ce.prototype,"hass",void 0),e([i()],Ce.prototype,"_open",void 0),e([i()],Ce.prototype,"_params",void 0),e([i()],Ce.prototype,"_config",void 0),e([i()],Ce.prototype,"_replacements",void 0),e([i()],Ce.prototype,"_domain",void 0),e([i()],Ce.prototype,"_gallery",void 0),e([i()],Ce.prototype,"_galleryLoading",void 0),e([i()],Ce.prototype,"_galleryError",void 0),e([i()],Ce.prototype,"_search",void 0),e([i()],Ce.prototype,"_selected",void 0),e([i()],Ce.prototype,"_parsed",void 0),e([i()],Ce.prototype,"_inputs",void 0),e([i()],Ce.prototype,"_loadingBlueprint",void 0),e([i()],Ce.prototype,"_error",void 0),Ce=e([a("dwains-dashboard-next-replacement-manager-dialog")],Ce);const ze=new Set(["button","input_button","scene","event"]);function Ae(e){return"unavailable"===e.state||"unknown"===e.state&&(t=function(e){const t=e.indexOf(".");return-1===t?e:e.slice(0,t)}(e.entity_id),!ze.has(t));var t}function Pe(e){const t=e.indexOf(".");return-1===t?e:e.slice(0,t)}const Oe=["closed","locked","off","false","not_home","idle"],He=["unavailable","unknown"],Te=["playing","buffering"],je=["cleaning","returning"],Ne=["arming","pending","triggered"],Le={light:{icon:J("light")},switch:{icon:J("switch")},fan:{icon:J("fan")},cover:{icon:J("cover")},lock:{icon:J("lock")},climate:{icon:J("climate")},media_player:{icon:J("media_player")},camera:{icon:J("camera")},person:{icon:J("person")},vacuum:{icon:J("vacuum")},alarm_control_panel:{icon:J("alarm_control_panel")}},Ge={window:{icon:Q("window")},door:{icon:Q("door")},motion:{icon:Y("binary_sensor","motion")},smoke:{icon:Q("smoke")},gas:{icon:Y("binary_sensor","gas")},moisture:{icon:Q("moisture")},occupancy:{icon:Y("binary_sensor","occupancy")},opening:{icon:Y("binary_sensor","opening")},presence:{icon:Y("binary_sensor","presence")},safety:{icon:Y("binary_sensor","safety")},tamper:{icon:"mdi:lock-alert"},vibration:{icon:Y("binary_sensor","vibration")}};function Fe(e,t){const i=function(e){const t=e?.attributes?.entity_id;if(!Array.isArray(t))return[];const i=Pe(e.entity_id);return t.filter(t=>"string"==typeof t&&t!==e.entity_id&&Pe(t)===i)}(e);return i.length>0&&i.some(t)}function Me(e,t){if(!e?.states)return[];const i=new Set((t?.areas||[]).map(e=>e.area_id).filter(Boolean)),a=Object.values(e.states).filter(a=>{if(!t?.entities||!t?.devices)return!1;const o=a.entity_id,s=e.entities?.[o];if(!q(s))return!1;if(!a||"unavailable"===a.state)return!1;const r=t.entities?.find(e=>e.entity_id===o);if(U(e,t,r||o))return!1;if("person"===o.split(".")[0]){return!(t.settings?.hidden_persons||[]).includes(o)}const n=r&&r.device_id?t.devices?.find(e=>e.device_id===r.device_id):null,d=r?.area_id||n?.area_id||e?.entities?.[o]?.area_id;if(!d||!i.has(d))return!1;if((t.areas_display?.hidden||[]).includes(d))return!1;const c=t.areas_options?.[d];if(c?.groups_options)for(const e of Object.values(c.groups_options))if(e.hidden?.includes(o))return!1;return!0}),o={};Object.keys(Le).forEach(e=>{o[e]={total:0,on:0,entities:[]}});const s={};Object.keys(Ge).forEach(e=>{s[e]={total:0,on:0,entities:[]}});const r={},n=new Set(["garage","garage_door","gate"]),d=(e,t)=>{e.on++,e.entities.push(t)};a.forEach(t=>{const i=t.entity_id,a=i?.split(".")[0];if(a&&!He.includes(t.state)){if("cover"===a){const a=String(t.attributes?.device_class||"").toLowerCase(),o=String(t.state||"").toLowerCase(),s=Number(t.attributes?.current_position),c=Number.isFinite(s);let l,p,h=!1,g="",m="";if("window"===a?(l="window",p="window",g=X(e,"window"),m=Y("cover","window"),h="open"===o||"opening"===o||c&&s>0):"door"===a?(l="door",p="door",g=X(e,"door"),m=Y("cover","door"),h="open"===o||"opening"===o||c&&s>0):n.has(a)?(l="gate",p=a,g=String(e?.language||e?.locale?.language||"").toLowerCase().startsWith("de")?"Tore":"Gates",m=a?Y("cover",a):"mdi:gate",h="open"===o||"opening"===o||c&&s>0):(l="shading",p=a||void 0,g=String(e?.language||e?.locale?.language||"").toLowerCase().startsWith("de")?"Beschattung":"Shading",m="mdi:blinds-horizontal",h="awning"===a?"open"===o||"opening"===o||c&&s>0:"closed"===o||"closing"===o||c&&s<100),l){const e=r[l]||{total:0,on:0,entities:[],deviceClass:p,statusKind:l,name:g,icon:m};e.total++,h&&d(e,i),r[l]=e}}if(a in o){const e=o[a];e&&e.total++;const s=String(t.state||"").toLowerCase(),r=!Oe.includes(s)&&!He.includes(s);"climate"===a?t.attributes?.hvac_action&&"idle"!==String(t.attributes.hvac_action).toLowerCase()&&"off"!==String(t.attributes.hvac_action).toLowerCase()?e&&d(e,i):t.attributes?.hvac_action||"off"===s||e&&d(e,i):"person"===a?"home"===s&&e&&d(e,i):"media_player"===a?Te.includes(s)&&e&&d(e,i):"cover"===a?"open"!==s&&"opening"!==s||e&&d(e,i):"lock"===a?"unlocked"===s&&e&&d(e,i):"vacuum"===a?je.includes(s)&&e&&d(e,i):"alarm_control_panel"===a?(s.startsWith("armed")||Ne.includes(s))&&e&&d(e,i):"camera"===a||r&&e&&d(e,i)}if("binary_sensor"===a&&t.attributes?.device_class){const e=t.attributes.device_class;if(e in s){const a=s[e];a&&(a.total++,"on"===t.state&&d(a,i))}}}});const c=[],l=o.person;if(l&&l.total>0){const t=Le.person;t&&(l.total<=2?c.push({domain:"person",count:l.on,name:0===l.on?ue(e,"person.nobody_home"):ue(e,"person.home"),icon:t.icon}):c.push({domain:"person",count:l.on,name:ue(e,"person.home"),icon:t.icon}))}return Object.entries(o).forEach(([t,i])=>{if("person"!==t&&"cover"!==t&&i.total>0&&i.on>0){const a=Le[t];a&&c.push({domain:t,count:i.on,name:K(e,t),icon:a.icon,entities:i.entities})}}),Object.values(r).forEach(e=>{e.total>0&&e.on>0&&c.push({domain:"cover",deviceClass:e.deviceClass,statusKind:e.statusKind,count:e.on,name:e.name,icon:e.icon,entities:e.entities})}),Object.entries(s).forEach(([t,i])=>{if(i.total>0&&i.on>0){const a=Ge[t];a&&c.push({domain:"binary_sensor",deviceClass:t,count:i.on,name:X(e,t),icon:a.icon,entities:i.entities})}}),c}function Be(e,t){const i=Z(e,t);return i.sensorCount?i.formattedTotal:void 0}const Re=1,We=32,Ke=16384,Ve=3e5,qe=new Set(["playing","buffering"]);function Ue(e){return"off"===e||"all"===e?e:"home"}function Xe(e){return qe.has(String(e||""))}function Ye(e,t){const i=Number(e?.attributes?.supported_features);return Number.isFinite(i)&&0!==(i&t)}function Ze(e,t=e?.state){return Ye(e,Xe(t)?Re:Ke)}function Je(e){return Ye(e,We)}function Qe(e){const t=Date.parse(e.last_changed);return Number.isFinite(t)?t:0}function et(e,t){const{now:i,graceMs:a=Ve,isVisible:o}=t,s=e.filter(e=>"string"==typeof e?.entity_id&&e.entity_id.startsWith("media_player.")&&function(e,t,i=Ve){if(Xe(e.state))return!0;if("paused"!==e.state)return!1;const a=Date.parse(e.last_changed);return Number.isFinite(a)&&t-a<=i}(e,i,a)&&(!o||o(e.entity_id))),r=new Set(s.map(e=>e.entity_id));return s.filter(e=>!Fe(e,e=>r.has(e))).sort((e,t)=>{const i=Number(Xe(t.state))-Number(Xe(e.state));if(i)return i;const a=Qe(t)-Qe(e);return a||e.entity_id.localeCompare(t.entity_id)}).map(e=>e.entity_id)}function tt(e,t,i){if(!q(ve(e)[i]))return!1;const a=ie(t).get(i);if(U(e,t||void 0,a||i))return!1;const o=ee(e,t,i,a);return!o||!te(t).has(o)||!ae(t).has(o)&&!oe(t,o).has(i)}function it(e,t,i){const a=ee(e,t,i);return a&&te(t).get(a)?.name||void 0}function at(e,t){const i=e.attributes||{},a=e=>"string"==typeof e?e.trim():"",o=a(i.media_title),s=a(i.app_name),r=o||s||a(i.friendly_name)||t,n=a(i.media_artist)||a(i.media_album_artist)||a(i.media_series_title)||(o&&s!==r?s:"");return{title:r,artist:n===r?"":n}}function ot(e,t){const i=e?.attributes?.entity_picture_local||e?.attributes?.entity_picture;if("string"==typeof i&&i){if(i.startsWith("/")&&!i.startsWith("//")&&"function"==typeof t)try{return t(i)}catch{return i}return i}}const st=["now_playing","cameras","areas","devices","todos","custom_cards","favorites","scenes","summaries"],rt={now_playing:{labelKey:"home_section.now_playing.label",icon:"mdi:music-circle-outline",descriptionKey:"home_section.now_playing.description"},summaries:{labelKey:"home_section.summaries.label",icon:"mdi:clipboard-list-outline",descriptionKey:"home_section.summaries.description"},cameras:{labelKey:"home_section.cameras.label",icon:"mdi:cctv",descriptionKey:"home_section.cameras.description"},areas:{labelKey:"home_section.areas.label",icon:"mdi:floor-plan",descriptionKey:"home_section.areas.description"},devices:{labelKey:"home_section.devices.label",icon:"mdi:view-dashboard-outline",descriptionKey:"home_section.devices.description"},todos:{labelKey:"home_section.todos.label",icon:"mdi:format-list-checks",descriptionKey:"home_section.todos.description"},custom_cards:{labelKey:"home_section.custom_cards.label",icon:"mdi:cards-outline",descriptionKey:"home_section.custom_cards.description"},favorites:{labelKey:"home_section.favorites.label",icon:"mdi:star",descriptionKey:"home_section.favorites.description"},scenes:{labelKey:"home_section.scenes.label",icon:"mdi:palette-outline",descriptionKey:"home_section.scenes.description"}},nt=["people","climate","outdoor_climate","power","device_groups"],dt={people:{labelKey:"home_card.people.label",icon:"mdi:account-group",descriptionKey:"home_card.people.description"},climate:{labelKey:"home_card.climate.label",icon:"mdi:home-thermometer-outline",descriptionKey:"home_card.climate.description"},outdoor_climate:{labelKey:"home_card.outdoor_climate.label",icon:"mdi:sun-thermometer-outline",descriptionKey:"home_card.outdoor_climate.description"},power:{labelKey:"home_card.power.label",icon:"mdi:flash",descriptionKey:"home_card.power.description"},device_groups:{labelKey:"home_card.device_groups.label",icon:"mdi:view-grid-outline",descriptionKey:"home_card.device_groups.description"}};function ct(e){const t=new Set(st),i=(e||[]).filter(e=>"string"==typeof e&&t.has(e)).filter((e,t,i)=>i.indexOf(e)===t),a=st.filter(e=>!i.includes(e)),o=[...i];return a.forEach(e=>{const t=st.indexOf(e),i=o.findIndex(e=>st.indexOf(e)>t);-1===i?o.push(e):o.splice(i,0,e)}),o}function lt(e){const t=new Set(st);return(e||[]).filter(e=>"string"==typeof e&&t.has(e)).filter((e,t,i)=>i.indexOf(e)===t)}function pt(e){const t=new Set(nt);return(e||[]).filter(e=>"string"==typeof e&&t.has(e)).filter((e,t,i)=>i.indexOf(e)===t)}function ht(e){if("string"!=typeof e)return;const t=e.indexOf(".");if(t<=0||t===e.length-1)return;const i=e.slice(0,t);return"scene"===i||"script"===i?i:void 0}function gt(e){if(!Array.isArray(e))return[];const t=new Set,i=[];for(const a of e)ht(a)&&!t.has(a)&&(t.add(a),i.push(a));return i}function mt(e,t,i){const a=gt(e),o=a.indexOf(t),s=o+i;return o<0||s<0||s>=a.length||([a[o],a[s]]=[a[s],a[o]]),a}function _t(e,t,i,a){const o=[];for(const s of gt(e)){const e=t[s];if(!e)continue;const r=i[s];if(r&&(r.hidden_by||!0===r.hidden||r.disabled_by))continue;const n=Ae(e);n&&a||o.push({entityId:s,domain:ht(s),unavailable:n})}return o}let ut=class extends B{constructor(){super(...arguments),this.mode="folder",this._trail=[{id:"",title:""}],this._loading=!1,this._failed=!1,this._request=0,this._back=()=>{this._trail.length<=1||(this._trail=this._trail.slice(0,-1),this._load())},this._close=()=>{this.dispatchEvent(new CustomEvent("dd-media-picker-closed",{bubbles:!0,composed:!0}))},this._useFolder=()=>{const{id:e}=this._current();e&&this._pick(e,this._pathName())}}connectedCallback(){super.connectedCallback(),this._load()}_t(e,t){return ue(this.hass,e,t)}_current(){return this._trail[this._trail.length-1]}async _load(){if(!this.hass)return;const e=++this._request,{id:t}=this._current();this._loading=!0,this._failed=!1;try{const i=await s(this.hass,t||void 0);if(e!==this._request)return;this._item=i}catch{if(e!==this._request)return;this._item=void 0,this._failed=!0}finally{e===this._request&&(this._loading=!1)}}_open(e){this._trail=[...this._trail,{id:e.media_content_id,title:e.title}],this._load()}_pathName(e){const t=this._trail.slice(1).map(e=>e.title);return e&&t.push(e),t.filter(Boolean).join(" / ")}_pick(e,t){this.dispatchEvent(new CustomEvent("dd-media-picked",{detail:{id:e,name:t},bubbles:!0,composed:!0}))}render(){const e=this._trail.length<=1,t=e?this._t("kiosk.media_title"):this._current().title,i=r(this._item),a=n(this._item),o=!(this._loading||this._failed||i.length||a.length);return W`
      <div class="picker" role="group" aria-label=${this._t("kiosk.media_title")}>
        <div class="picker-head">
          <button
            class="icon-button"
            type="button"
            title=${this._t("common.back")}
            aria-label=${this._t("common.back")}
            ?disabled=${e}
            @click=${this._back}
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <strong class="picker-title" aria-live="polite">${t}</strong>
          <button
            class="icon-button"
            type="button"
            title=${this._t("common.close")}
            aria-label=${this._t("common.close")}
            @click=${this._close}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>

        <div class="picker-list">
          ${this._loading?W`<div class="picker-note">${this._t("common.loading")}</div>`:R}
          ${this._failed?W`
            <div class="picker-note">
              <span>${this._t("kiosk.media_error")}</span>
              <button class="text-button" type="button" @click=${()=>{this._load()}}>${this._t("kiosk.media_retry")}</button>
            </div>
          `:R}
          ${o?W`<div class="picker-note">${this._t("kiosk.media_empty")}</div>`:R}
          ${this._loading?R:i.map(t=>W`
            <button class="picker-row" type="button" @click=${()=>this._open(t)}>
              <ha-icon class="row-icon" icon=${e?"mdi:folder-multiple-image":"mdi:folder"}></ha-icon>
              <span class="row-title">${t.title}</span>
              <ha-icon class="row-chevron" icon="mdi:chevron-right"></ha-icon>
            </button>
          `)}
          ${this._loading||"image"!==this.mode?R:a.map(e=>W`
            <button
              class="picker-row"
              type="button"
              @click=${()=>this._pick(e.media_content_id,this._pathName(e.title))}
            >
              ${e.thumbnail?W`<img class="row-thumb" src=${e.thumbnail} alt="" loading="lazy" />`:W`<ha-icon class="row-icon" icon="mdi:image-outline"></ha-icon>`}
              <span class="row-title">${e.title}</span>
            </button>
          `)}
        </div>

        ${"folder"===this.mode?W`
          <div class="picker-foot">
            <span class="picker-count">
              ${e||this._loading||this._failed?this._t("kiosk.media_open_folder"):fe(this.hass,"kiosk.media_images",a.length)}
            </span>
            <button
              class="primary-button"
              type="button"
              ?disabled=${e||this._loading||this._failed}
              @click=${this._useFolder}
            >${this._t("kiosk.media_use_folder")}</button>
          </div>
        `:R}
      </div>
    `}};ut.styles=M`:host{display:block}button{font:inherit;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.picker{display:flex;flex-direction:column;border:1px solid var(--divider-color);border-radius:14px;background:var(--card-background-color);overflow:hidden}.picker-head{display:flex;align-items:center;gap:6px;padding:8px;border-bottom:1px solid var(--divider-color)}.picker-title{flex:1 1 auto;min-width:0;overflow:hidden;color:var(--primary-text-color);font-size:14px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.icon-button{width:40px;height:40px;padding:0;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;background:transparent;color:var(--primary-text-color)}.icon-button:hover:not(:disabled){background:color-mix(in srgb,var(--primary-text-color) 8%,transparent)}.icon-button:disabled{opacity:0.35;cursor:default}.icon-button ha-icon{--mdc-icon-size:20px}.picker-list{display:flex;flex-direction:column;max-height:min(46vh,340px);padding:6px;overflow-y:auto;overscroll-behavior:contain}.picker-row{min-height:48px;padding:6px 10px;display:flex;align-items:center;gap:12px;border:0;border-radius:10px;background:transparent;color:var(--primary-text-color);text-align:left}.picker-row:hover{background:color-mix(in srgb,var(--primary-text-color) 6%,transparent)}.row-icon{--mdc-icon-size:22px;flex:0 0 auto;color:var(--primary-color)}.row-thumb{width:44px;height:32px;flex:0 0 auto;border-radius:6px;object-fit:cover;background:var(--secondary-background-color)}.row-title{flex:1 1 auto;min-width:0;overflow:hidden;font-size:14px;text-overflow:ellipsis;white-space:nowrap}.row-chevron{--mdc-icon-size:20px;flex:0 0 auto;color:var(--secondary-text-color)}.picker-note{padding:14px 10px;display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;color:var(--secondary-text-color);font-size:13px;line-height:1.4}.text-button{padding:0;border:0;background:none;color:var(--primary-color);font-size:13px;font-weight:600}.picker-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 12px;padding:10px 12px;border-top:1px solid var(--divider-color)}.picker-count{color:var(--secondary-text-color);font-size:13px}.primary-button{min-height:40px;padding:0 18px;border:0;border-radius:999px;background:var(--primary-color);color:var(--text-primary-color,#ffffff);font-size:14px;font-weight:600}.primary-button:disabled{opacity:0.45;cursor:default}`,e([t({attribute:!1})],ut.prototype,"hass",void 0),e([t()],ut.prototype,"mode",void 0),e([i()],ut.prototype,"_trail",void 0),e([i()],ut.prototype,"_item",void 0),e([i()],ut.prototype,"_loading",void 0),e([i()],ut.prototype,"_failed",void 0),ut=e([a("dwains-dashboard-next-media-picker")],ut);const vt=new Map;function ft(e){return vt.get(e)||c(e)}function bt(e){const t=vt.get(e);return t?(vt.delete(e),w(e,t)):c(e)}function xt(e){return vt.delete(e),c(e)}let yt=class extends B{constructor(){super(...arguments),this._segment=d(window.location.pathname),this._prefs=ft(this._segment),this._picker=null,this._linkInvalid=!1,this._handleChanged=()=>{vt.has(this._segment)||(this._prefs=c(this._segment),this._refreshPreview())},this._toggleEnabled=e=>{e.stopPropagation(),this._update({enabled:Boolean(e.target?.checked)})},this._handleLinkChange=e=>{e.stopPropagation();const t=e.target.value.trim(),i=l(t);this._linkInvalid=Boolean(t)&&(!i||p(i)),this._linkInvalid||this._update({screensaverImage:i,screensaverImageName:""})},this._stopInput=e=>{e.stopPropagation()},this._closePicker=()=>{this._picker=null},this._handlePicked=e=>{const{id:t,name:i}=e.detail;"image"===this._picker?(this._linkInvalid=!1,this._update({screensaverImage:t,screensaverImageName:i})):this._update({slideshowFolder:t,slideshowFolderName:i}),this._picker=null},this._clearImage=()=>{this._linkInvalid=!1,this._update({screensaverImage:"",screensaverImageName:""})},this._handleThumbError=()=>{const e=this._preview;"ready"===e?.state&&(this._preview="image"===this._prefs.screensaverMode?{source:e.source,state:"failed"}:{...e,url:void 0})},this._showPreview=()=>{window.dispatchEvent(new CustomEvent(h))}}set hass(e){const t=this._hass;this._hass=e,t&&t.language===e?.language&&t.locale?.language===e?.locale?.language||this.requestUpdate(),!t&&e&&this._refreshPreview()}get hass(){return this._hass}connectedCallback(){super.connectedCallback(),this._segment=d(window.location.pathname),this._prefs=ft(this._segment),window.addEventListener(g,this._handleChanged),this._refreshPreview()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(g,this._handleChanged)}_refreshPreview(){const e=this._hass,t=m(this._prefs);if("clock"===t.kind||!e)return void(this._preview=void 0);const i="image"===t.kind?t.image:t.folder;if(this._preview?.source===i)return;this._preview={source:i,state:"loading"};const a=e=>{this._preview?.source===i&&(this._preview={source:i,...e})};"image"!==t.kind?u(t=>s(e,t),t.folder).then(async t=>{const i=t[0],o=i?await _(e,i).catch(()=>{}):void 0;a({state:"ready",count:t.length,url:o})}).catch(()=>a({state:"failed"})):_(e,t.image).then(e=>a({state:"ready",url:e})).catch(()=>a({state:"failed"}))}_t(e,t){return ue(this._hass,e,t)}_update(e){const t=c(this._segment),i=Object.freeze({...this._prefs,...e}),a=JSON.stringify(i)!==JSON.stringify(t);this._prefs=i,a?vt.set(this._segment,i):vt.delete(this._segment),this._preview=void 0,this._refreshPreview(),this.dispatchEvent(new CustomEvent("dwains-dashboard-next-device-settings-changed",{bubbles:!0,composed:!0,detail:{dirty:a}}))}commitPendingChanges(){this._prefs=bt(this._segment),this._preview=void 0,this._refreshPreview(),this.dispatchEvent(new CustomEvent("dwains-dashboard-next-device-settings-changed",{bubbles:!0,composed:!0,detail:{dirty:!1}}))}discardPendingChanges(){this._prefs=xt(this._segment),this._linkInvalid=!1,this._picker=null,this._preview=void 0,this._refreshPreview(),this.dispatchEvent(new CustomEvent("dwains-dashboard-next-device-settings-changed",{bubbles:!0,composed:!0,detail:{dirty:!1}}))}_toggle(e){return t=>{t.stopPropagation(),this._update({[e]:Boolean(t.target?.checked)})}}_togglePicker(e){this._picker=this._picker===e?null:e}_slideChoices(){return v.map(e=>({value:e,label:e<60?this._t("kiosk.seconds",{count:e}):this._t("kiosk.minutes",{count:e/60})}))}_minuteChoices(){return f.map(e=>({value:e,label:0===e?this._t("kiosk.off"):this._t("kiosk.minutes",{count:e})}))}_exampleUrl(e){return`${window.location.origin}/${this._segment}/home?${b}=${e?1:0}`}render(){const e=this._prefs,t=e.enabled,i=!t||0===e.screensaverMinutes;return W`
      <div class="wall-tablet-settings">
        <div class="row">
          <span class="row-copy">
            <strong id="wall-tablet-enable">${this._t("kiosk.enable")}</strong>
            <small>${this._t("kiosk.enable_description")}</small>
          </span>
          <ha-switch
            aria-labelledby="wall-tablet-enable"
            .checked=${t}
            @change=${this._toggleEnabled}
          ></ha-switch>
        </div>

        ${this._renderChoices("return-home",this._t("kiosk.return_home"),this._t("kiosk.return_home_description"),this._minuteChoices(),e.returnHomeMinutes,e=>this._update({returnHomeMinutes:e}),!t)}

        ${this._renderChoices("screensaver",this._t("kiosk.screensaver"),this._t("kiosk.screensaver_description"),this._minuteChoices(),e.screensaverMinutes,e=>this._update({screensaverMinutes:e}),!t)}

        ${this._renderChoices("screensaver-mode",this._t("kiosk.screensaver_mode"),this._t("kiosk.screensaver_mode_description"),[{value:"clock",label:this._t("kiosk.mode_clock")},{value:"image",label:this._t("kiosk.mode_image")},{value:"slideshow",label:this._t("kiosk.mode_slideshow")}],e.screensaverMode,e=>{this._picker=null,this._update({screensaverMode:e})},i)}

        ${"image"===e.screensaverMode?this._renderImageRow(i):R}
        ${"slideshow"===e.screensaverMode?this._renderSlideshowRows(i):R}
        ${"clock"===e.screensaverMode?this._renderChoices("dim-level",this._t("kiosk.dim_level"),this._t("kiosk.dim_level_description"),x.map(e=>({value:e,label:`${e}%`})),e.dimLevel,e=>this._update({dimLevel:e}),i):this._renderPhotoRows(i)}

        <div class="row">
          <span class="row-copy">
            <strong>${this._t("kiosk.preview")}</strong>
            <small>${this._t("kiosk.preview_description")}</small>
          </span>
          <button class="action" type="button" @click=${this._showPreview}>
            <ha-icon icon="mdi:play-circle-outline"></ha-icon>
            <span>${this._t("kiosk.preview_action")}</span>
          </button>
        </div>

        <div class="note">
          <ha-icon icon="mdi:gesture-tap-hold"></ha-icon>
          <span class="note-copy">
            <strong>${this._t("kiosk.exit_title")}</strong>
            <span>${this._t("kiosk.exit_description")}</span>
          </span>
        </div>

        <div class="note">
          <ha-icon icon="mdi:link-variant"></ha-icon>
          <span class="note-copy">
            <strong>${this._t("kiosk.setup_title")}</strong>
            <span>${this._t("kiosk.setup_description",{param:`?${b}=1`,param_off:`?${b}=0`})}</span>
            <code>${this._exampleUrl(!0)}</code>
          </span>
        </div>
      </div>
    `}_renderImageRow(e){const t=this._prefs,i=p(t.screensaverImage);return W`
      <div class="row field-row ${e?"is-disabled":""}">
        <span class="row-copy">
          <strong id="wall-tablet-image">${this._t("kiosk.image")}</strong>
          <small>${this._t("kiosk.image_description")}</small>
        </span>
        <div class="field">
          <input
            class="text-input ${this._linkInvalid?"is-invalid":""}"
            type="text"
            inputmode="url"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            aria-labelledby="wall-tablet-image"
            aria-invalid=${this._linkInvalid?"true":"false"}
            placeholder="/local/photo.jpg"
            .value=${i?"":t.screensaverImage}
            ?disabled=${e}
            @input=${this._stopInput}
            @change=${this._handleLinkChange}
          />
          ${this._linkInvalid?W`<small class="field-error" role="alert">${this._t("kiosk.image_invalid")}</small>`:R}
          <div class="field-actions">
            <button
              class="action"
              type="button"
              aria-expanded=${"image"===this._picker?"true":"false"}
              ?disabled=${e}
              @click=${()=>this._togglePicker("image")}
            >
              <ha-icon icon="mdi:folder-image"></ha-icon>
              <span>${this._t("kiosk.choose_image")}</span>
            </button>
            ${t.screensaverImage?W`
              <button class="action quiet" type="button" ?disabled=${e} @click=${this._clearImage}>
                ${this._t("common.remove")}
              </button>
            `:R}
          </div>
          ${this._renderChosen(i?t.screensaverImageName||this._t("kiosk.mode_image"):t.screensaverImage,this._t("kiosk.image_none"),this._t("kiosk.image_failed"))}
        </div>
      </div>
      ${"image"!==this._picker||e?R:this._renderPicker("image")}
    `}_renderSlideshowRows(e){const t=this._prefs,i=this._preview,a="ready"===i?.state&&t.slideshowFolder?i.count??0:void 0;return W`
      <div class="row field-row ${e?"is-disabled":""}">
        <span class="row-copy">
          <strong>${this._t("kiosk.folder")}</strong>
          <small>${this._t("kiosk.folder_description")}</small>
        </span>
        <div class="field">
          <div class="field-actions">
            <button
              class="action"
              type="button"
              aria-expanded=${"folder"===this._picker?"true":"false"}
              ?disabled=${e}
              @click=${()=>this._togglePicker("folder")}
            >
              <ha-icon icon="mdi:folder-image"></ha-icon>
              <span>${this._t("kiosk.choose_folder")}</span>
            </button>
          </div>
          ${this._renderChosen(t.slideshowFolderName||t.slideshowFolder,this._t("kiosk.folder_none"),this._t("kiosk.folder_failed"),void 0===a?void 0:0===a?this._t("kiosk.folder_empty"):fe(this._hass,"kiosk.photos_found",a))}
        </div>
      </div>
      ${"folder"!==this._picker||e?R:this._renderPicker("folder")}

      ${this._renderChoices("slide-seconds",this._t("kiosk.slide_seconds"),this._t("kiosk.slide_seconds_description"),this._slideChoices(),t.slideSeconds,e=>this._update({slideSeconds:e}),e)}

      <div class="row ${e?"is-disabled":""}">
        <span class="row-copy">
          <strong id="wall-tablet-shuffle">${this._t("kiosk.shuffle")}</strong>
          <small>${this._t("kiosk.shuffle_description")}</small>
        </span>
        <ha-switch
          aria-labelledby="wall-tablet-shuffle"
          .checked=${t.slideshowShuffle}
          ?disabled=${e}
          @change=${this._toggle("slideshowShuffle")}
        ></ha-switch>
      </div>
    `}_renderPhotoRows(e){const t=this._prefs;return W`
      ${this._renderChoices("photo-fit",this._t("kiosk.photo_fit"),this._t("kiosk.photo_fit_description"),[{value:"cover",label:this._t("kiosk.fit_cover")},{value:"contain",label:this._t("kiosk.fit_contain")}],t.photoFit,e=>this._update({photoFit:e}),e)}

      <div class="row ${e?"is-disabled":""}">
        <span class="row-copy">
          <strong id="wall-tablet-photo-clock">${this._t("kiosk.photo_clock")}</strong>
          <small>${this._t("kiosk.photo_clock_description")}</small>
        </span>
        <ha-switch
          aria-labelledby="wall-tablet-photo-clock"
          .checked=${t.photoClock}
          ?disabled=${e}
          @change=${this._toggle("photoClock")}
        ></ha-switch>
      </div>

      ${this._renderChoices("photo-dim",this._t("kiosk.photo_dim"),this._t("kiosk.photo_dim_description"),y.map(e=>({value:e,label:`${e}%`})),t.photoDimLevel,e=>this._update({photoDimLevel:e}),e)}
    `}_renderChosen(e,t,i,a){if(!e)return W`<div class="chosen is-empty">${t}</div>`;const o=this._preview,s="failed"===o?.state;return W`
      <div class="chosen ${s?"is-failed":""}">
        ${"ready"===o?.state&&o.url?W`<img class="chosen-thumb" src=${o.url} alt="" @error=${this._handleThumbError} />`:W`<span class="chosen-thumb placeholder"><ha-icon icon=${s?"mdi:image-off-outline":"mdi:image-outline"}></ha-icon></span>`}
        <span class="chosen-copy">
          <span class="chosen-name">${e}</span>
          ${s?W`<small role="alert">${i}</small>`:a?W`<small>${a}</small>`:R}
        </span>
      </div>
    `}_renderPicker(e){return W`
      <dwains-dashboard-next-media-picker
        class="picker"
        .hass=${this._hass}
        .mode=${e}
        @dd-media-picked=${this._handlePicked}
        @dd-media-picker-closed=${this._closePicker}
      ></dwains-dashboard-next-media-picker>
    `}_renderChoices(e,t,i,a,o,s,r){const n=`wall-tablet-${e}`;return W`
      <div class="row choice-row ${r?"is-disabled":""}">
        <span class="row-copy">
          <strong id=${n}>${t}</strong>
          <small>${i}</small>
        </span>
        <div class="choices" role="radiogroup" aria-labelledby=${n} aria-disabled=${r?"true":R}>
          ${a.map(e=>{const t=e.value===o;return W`
              <button
                type="button"
                class="choice ${t?"selected":""}"
                role="radio"
                aria-checked=${t?"true":"false"}
                ?disabled=${r}
                @click=${()=>s(e.value)}
              >${e.label}</button>
            `})}
        </div>
      </div>
    `}};yt.styles=M`:host{display:block}.wall-tablet-settings{display:flex;flex-direction:column}.row{display:flex;align-items:center;justify-content:space-between;gap:12px 16px;padding:14px 0;border-bottom:1px solid var(--divider-color)}.choice-row{flex-wrap:wrap}.row-copy{display:flex;flex-direction:column;gap:3px;min-width:min(100%,240px);flex:1 1 240px}.row-copy strong{font-size:14px;font-weight:500;color:var(--primary-text-color)}.row-copy small{font-size:13px;line-height:1.4;color:var(--secondary-text-color)}ha-switch{flex:0 0 auto}.choices{display:flex;flex-wrap:wrap;gap:6px}.choice{min-width:52px;min-height:36px;padding:0 12px;border:1px solid var(--divider-color);border-radius:999px;background:transparent;color:var(--primary-text-color);font:inherit;font-size:13px;font-weight:500;cursor:pointer;touch-action:manipulation}.choice:hover:not(:disabled){border-color:color-mix(in srgb,var(--primary-color) 50%,var(--divider-color))}.choice:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.choice.selected{border-color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 14%,transparent);color:var(--primary-color)}.choice:disabled{cursor:default}.is-disabled .choices,.is-disabled .row-copy,.is-disabled .field{opacity:0.5}.field-row{flex-wrap:wrap;align-items:flex-start}.field{flex:1 1 280px;min-width:min(100%,240px);display:flex;flex-direction:column;gap:8px}.text-input{width:100%;box-sizing:border-box;min-height:44px;padding:10px 14px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit;font-size:14px;outline:none;transition:border-color 0.2s ease}.text-input::placeholder{color:var(--secondary-text-color);opacity:0.8}.text-input:focus{border-color:var(--primary-color)}.text-input.is-invalid{border-color:var(--error-color,#db4437)}.field-error{color:var(--error-color,#db4437);font-size:13px;line-height:1.4}.field-actions{display:flex;flex-wrap:wrap;gap:8px}.action{min-height:40px;padding:0 16px;display:inline-flex;align-items:center;gap:8px;flex:0 0 auto;border:1px solid var(--divider-color);border-radius:999px;background:transparent;color:var(--primary-text-color);font:inherit;font-size:13px;font-weight:500;cursor:pointer;touch-action:manipulation}.action ha-icon{--mdc-icon-size:18px;color:var(--primary-color)}.action:hover:not(:disabled){border-color:color-mix(in srgb,var(--primary-color) 50%,var(--divider-color))}.action:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.action:disabled{cursor:default}.action.quiet{border-color:transparent;color:var(--secondary-text-color)}.chosen{display:flex;align-items:center;gap:12px;min-width:0}.chosen.is-empty{color:var(--secondary-text-color);font-size:13px}.chosen-thumb{width:72px;height:46px;flex:0 0 auto;border-radius:8px;object-fit:cover;background:var(--secondary-background-color,rgba(0,0,0,0.06))}.chosen-thumb.placeholder{display:inline-flex;align-items:center;justify-content:center;color:var(--secondary-text-color)}.chosen-thumb.placeholder ha-icon{--mdc-icon-size:22px}.chosen-copy{display:flex;flex-direction:column;gap:2px;min-width:0}.chosen-name{overflow:hidden;color:var(--primary-text-color);font-size:14px;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.chosen-copy small{color:var(--secondary-text-color);font-size:13px;line-height:1.4}.chosen.is-failed small{color:var(--error-color,#db4437)}.picker{margin:12px 0 4px}.note{display:flex;align-items:flex-start;gap:12px;margin-top:12px;padding:12px 14px;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 7%,transparent);color:var(--primary-text-color)}.note + .note{margin-top:8px}.note ha-icon{--mdc-icon-size:20px;color:var(--primary-color);flex:0 0 auto;margin-top:1px}.note-copy{display:flex;flex-direction:column;gap:4px;min-width:0;font-size:13px;line-height:1.45;color:var(--secondary-text-color)}.note-copy strong{font-size:14px;font-weight:500;color:var(--primary-text-color)}code{display:block;margin-top:4px;padding:6px 8px;border-radius:8px;background:var(--secondary-background-color,rgba(0,0,0,0.05));color:var(--primary-text-color);font-family:var(--ha-font-family-code,ui-monospace,monospace);font-size:12px;overflow-wrap:anywhere;user-select:all;-webkit-user-select:all}`,e([i()],yt.prototype,"_prefs",void 0),e([i()],yt.prototype,"_picker",void 0),e([i()],yt.prototype,"_preview",void 0),e([i()],yt.prototype,"_linkInvalid",void 0),yt=e([a("dwains-dashboard-next-wall-tablet-settings")],yt);const wt=["light","switch","fan","cover","lock"],kt={light:!1,switch:!0,fan:!1,cover:!0,lock:!0};function $t(e){const t="input_boolean"===e?"switch":e;return wt.includes(t)?t:void 0}function Ct(e,t){const i=$t(t);return!!i&&(e?.master_action_confirmations?.[i]??kt[i])}const St=()=>import("./dwains-card-editor-dialog-D9yajcFM.js"),Et=(e,t)=>{ye(e,"show-dialog",{dialogTag:"dwains-dashboard-next-card-editor-dialog",dialogImport:St,dialogParams:t})},Dt="__ungrouped__",It={"mdi:card-account-details-star-outline":T,"mdi:chevron-right":H,"mdi:floor-plan":O,"mdi:format-list-bulleted-type":P,"mdi:gesture-tap-button":A,"mdi:heart":z,"mdi:heart-outline":I,"mdi:home-edit-outline":D,"mdi:package-variant-closed-check":E,"mdi:puzzle-edit-outline":S,"mdi:shield-account":C,"mdi:tune-variant":$,"mdi:view-dashboard-edit":k};let zt,At,Pt=class extends B{constructor(){super(...arguments),this.inlineBackNavigation=!0,this._scrollbarGutterTargets=new Map,this._t=(e,t)=>ue(this._hass,e,t),this._tp=(e,t)=>fe(this._hass,e,t),this._loading=!0,this._expandedDeviceTypes=new Set,this._collapsedAreaEntityGroups=new Set,this._areaGroupOrderDirty=!1,this._showEntityPicker=!1,this._entitySearchFilter="",this._showWeatherPicker=!1,this._weatherSearchFilter="",this._showAlarmPicker=!1,this._alarmSearchFilter="",this._showHomeScenePicker=!1,this._homeSceneSearch="",this._settingsPage="overview",this._homeSettingsDetail="overview",this._dashboardTitle="",this._dashboardIcon="",this._backToSettingsOverview=()=>{if(this._area)return this._area=void 0,this._areaGroupOrderDirty=!1,this._emitSettingsPageContext(),void this._resetSettingsScrollPosition();this._settingsPage="overview",this._expandedDeviceTypes=new Set,this._closeInlinePickers(),this._emitSettingsPageContext(),this._resetSettingsScrollPosition()},this._toggleAreaFavorites=e=>{if(!this._config)return;const t=e.target;this._fireConfigChanged({...this._config,settings:{...this._config.settings,show_area_favorites:Boolean(t.checked)}})},this._toggleAreaNowPlaying=e=>{if(!this._config)return;const t=e.target;this._fireConfigChanged({...this._config,settings:{...this._config.settings,show_area_now_playing:Boolean(t.checked)}})},this._toggleAreaThermostat=e=>{this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,show_area_thermostat:e.target.checked}})},this._resetHomeCameraSettings=()=>{this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_camera_order:[],home_cameras_hidden:[]}})},this._resetHomeSectionsOrder=()=>{if(!this._config)return;const e={...this._config,settings:{...this._config.settings,home_sections_order:ct(),home_sections_hidden:[]}};this._fireConfigChanged(e)},this._resetDeviceVisibility=()=>{this._config&&(this._expandedDeviceTypes=new Set,this._fireConfigChanged({...this._config,settings:{...this._config.settings,hidden_device_types:[]},device_admission:{...this._config.device_admission,hidden_entities:[],hidden_devices:[]}}))},this._resetAreaEntitySettings=()=>{if(!this._config||!this._area)return;const e=this._config.areas_options?.[this._area]||{},t=Boolean(e.group_order?.length),i={...e};delete i.entity_layout,delete i.group_order,delete i.entity_order,delete i.groups_options,Array.isArray(i.custom_cards)&&(i.custom_cards=i.custom_cards.map(e=>e.placement.startsWith("ungrouped:")?{...e,placement:"bottom"}:e)),this._collapsedAreaEntityGroups=new Set(se),this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:i}}),t&&(this._areaGroupOrderDirty=!0)},this._handleHomeSectionDragEnd=()=>{this._draggedHomeSection=void 0,this._dragOverHomeSectionIndex=void 0,this._homeSectionPreviewOrder=void 0},this._handleHomeSectionDragLeave=e=>{const t=e.currentTarget,i=e.relatedTarget;t?.contains(i)||(this._dragOverHomeSectionIndex=void 0)},this._handleHomeCameraDragEnd=()=>{this._draggedHomeCamera=void 0,this._dragOverHomeCameraIndex=void 0},this._handleHomeCameraDragLeave=e=>{const t=e.currentTarget,i=e.relatedTarget;t?.contains(i)||(this._dragOverHomeCameraIndex=void 0)},this._resetAreasConfiguration=()=>{this._config&&(this._areaPreviewOrder=void 0,this._fireConfigChanged({...this._config,areas_display:{...this._config.areas_display,hidden:[],order:[],sort_mode:void 0}}))},this._handleAreaCustomCardDragEnd=()=>{this._draggedAreaCustomCardId=void 0,this._dragOverAreaCustomCardTarget=void 0},this._applyAreaGroupOrderToAllAreas=()=>{if(!this._config||!this._area||!this._areaGroupOrderDirty)return;const e=this._config.areas_options?.[this._area]?.group_order,t=e?.length?[...e]:[...se],i={...this._config.areas_options};(this._config.areas||[]).forEach(e=>{i[e.area_id]={...i[e.area_id],group_order:[...t]}}),this._fireConfigChanged({...this._config,areas_options:i}),this._areaGroupOrderDirty=!1},this._handleEntitySectionDragEnd=()=>{this._draggedEntitySection=void 0,this._dragOverEntitySection=void 0,this._areaGroupPreviewOrder=void 0},this._clearWeatherEntity=()=>{if(!this._config)return;const e={...this._config.settings};delete e.weather_entity_id,this._fireConfigChanged({...this._config,settings:e}),this._showWeatherPicker=!1},this._clearAlarmEntity=()=>{if(!this._config)return;const e={...this._config.settings};delete e.alarm_entity_id,e.show_alarm=!1,this._fireConfigChanged({...this._config,settings:e}),this._showAlarmPicker=!1},this._toggleAlarmDisplay=e=>{const t=e.target,i=Boolean(t.checked),a={...this._config,settings:{...this._config.settings,show_alarm:i}};this._fireConfigChanged(a)}}set hass(e){const t=this._hass;this._hass=e,e&&!this._dashboardTitle&&(this._dashboardTitle=this._getDashboardPanelTitle()),e&&!t&&(this._fetchData(),this._fetchDashboardInfo())}get hass(){return this._hass}_getDashboardUrlPath(){const e=window.location.pathname.split("/")[1];if(e&&"lovelace"!==e)return e}_getDashboardPanelTitle(){const e=this._getDashboardUrlPath();if(!e)return"";const t=this._hass?.panels?.[e];return"string"==typeof t?.title?t.title:""}async _fetchDashboardInfo(){if(this._hass)try{const e=this._getDashboardUrlPath();if(!e)return;const t=(await this._hass.callWS({type:"lovelace/dashboards/list"})||[]).find(t=>t.url_path===e);t&&(this._dashboardId=t.id,this._dashboardTitle=t.title||"",this._dashboardIcon=t.icon||"")}catch(e){console.warn("Dashboard-info ophalen mislukt:",e)}}async _saveDashboardInfo(){if(this._hass&&this._dashboardId)try{await this._hass.callWS({type:"lovelace/dashboards/update",dashboard_id:this._dashboardId,title:this._dashboardTitle||"Dashboard",icon:this._dashboardIcon||void 0}),console.log("✅ Dashboard-naam/icoon opgeslagen")}catch(e){console.error("❌ Dashboard bijwerken mislukt:",e),alert(this._t("strategy.save_name_failed",{error:String(e)}))}}_onDashboardTitleChanged(e){this._dashboardTitle=e.target.value}_onDashboardTitleCommit(){this._saveDashboardInfo()}_onDashboardIconChanged(e){this._dashboardIcon=e.detail?.value??e.target?.value??"",this._saveDashboardInfo()}async setConfig(e){this._config={type:e?.type||"custom:dwains-dashboard-next",areas_display:e?.areas_display||{},floors_display:e?.floors_display||{},areas_options:e?.areas_options||{},blueprint_replacements:e?.blueprint_replacements||{},device_admission:e?.device_admission||{},favorites:e?.favorites||[],pages:e?.pages||[],settings:e?.settings||{},areas:[],devices:[],entities:[],floors:[]},this.hass?(this._loading=!this._registryData,this._fetchData()):this._loading=!0}connectedCallback(){super.connectedCallback(),this._stabilizeSettingsScrollbar(),queueMicrotask(()=>this._emitSettingsPageContext()),this.hass&&this._fetchData()}disconnectedCallback(){this._restoreSettingsScrollbar(),super.disconnectedCallback()}async _fetchData(){if(this.hass){if(this._registryData)return this._applyRegistryData(this._registryData.areas,this._registryData.devices,this._registryData.entities),void(this._loading=!1);if(zt)return this._registryData=zt,this._applyRegistryData(zt.areas,zt.devices,zt.entities),this._loading=!1,this.requestUpdate(),void(At||(At=this._loadRegistryData(!1).finally(()=>{At=void 0})));if(this._fetchDataPromise)return this._fetchDataPromise;this._loading=!0,this._fetchDataPromise=this._loadRegistryData(!0).then(()=>{});try{await this._fetchDataPromise}finally{this._fetchDataPromise=void 0}}}async _loadRegistryData(e){const t=this.hass;if(t){e&&(this._loading=!0);try{const[e,i,a]=await Promise.all([t.callWS({type:"config/area_registry/list"}),t.callWS({type:"config/device_registry/list"}),t.callWS({type:"config/entity_registry/list"})]),o={areas:e,devices:i,entities:a};return zt=o,this._registryData=o,this._applyRegistryData(e,i,a),this._loading=!1,this.requestUpdate(),o}catch(e){return console.error("Failed to fetch data:",e),this._loading=!1,void this.requestUpdate()}}}_applyRegistryData(e,t,i){this.hass&&(this._config={...this._config||{type:"custom:dwains-dashboard-next"},areas:e.map(e=>({area_id:e.area_id,name:e.name,picture:e.picture,icon:e.icon})),devices:t.map(e=>({device_id:e.id,name:e.name_by_user||e.name,area_id:e.area_id,created_at:e.created_at})),entities:i.map(e=>({entity_id:e.entity_id,area_id:e.area_id,device_id:e.device_id,created_at:e.created_at}))})}render(){return this._config?!this.hass||this._loading?this._renderLoadingShell():this._area?this._renderAreaEditor():this._renderAreasEditor():this._renderLoadingShell()}_renderLoadingShell(){return W`
      <div class="editor-container dd-flat-settings dd-settings-overview settings-loading-shell" aria-busy="true">
        <section class="settings-nav-section">
          <h3>${this._t("settings.loading")}</h3>
          <div class="settings-nav-list">
            ${[0,1,2,3].map(()=>W`
              <div class="settings-nav-item settings-nav-item-skeleton">
                <span class="settings-nav-icon skeleton-block"></span>
                <span class="settings-skeleton-copy">
                  <span></span>
                  <small></small>
                </span>
              </div>
            `)}
          </div>
        </section>
      </div>
    `}_renderAreasEditor(){return this.hass&&this._config?"overview"===this._settingsPage?this._renderSettingsOverview():this._renderSettingsDetailPage(this._settingsPage):R}_renderSettingsOverview(){const e=[{key:"general",title:this._t("settings.general")},{key:"content",title:this._t("settings.content_display")},{key:"behavior",title:this._t("settings.behavior_access")},{key:"support",title:this._t("settings.about_support")}],t=this._settingsOverviewItems();return W`
      <div class="editor-container dd-flat-settings dd-settings-overview">
        ${e.map(e=>{const i=t.filter(t=>t.group===e.key);return i.length?W`
            <section class="settings-nav-section">
              <h3>${e.title}</h3>
              <div class="settings-nav-list">
                ${i.map(e=>this._renderSettingsNavItem(e))}
              </div>
            </section>
          `:R})}
        <div class="dd-settings-version-footer">Dwains Dashboard Next · v${be}</div>
      </div>
    `}_settingsOverviewItems(){const e=Object.keys(this.hass?.areas||{}).length,t=this._getHomeSectionsOrder().filter(e=>!this._getHiddenHomeSections().has(e)).length,i=this._getDeviceTypeOptions().length,a=this._getHiddenDeviceTypes().size,o=Object.values(this.hass?.states||{}).filter(e=>e.entity_id?.startsWith("person.")).length,s=new Set(this._config?.settings?.hidden_persons||[]).size,r=Math.max(0,o-s),n=this._getHomeSectionsOrder().length,c=[!1!==this._config?.settings?.show_time,!1!==this._config?.settings?.show_notifications,!1!==this._config?.settings?.show_weather,Boolean(this._config?.settings?.alarm_entity_id)&&!1!==this._config?.settings?.show_alarm,r>0].filter(Boolean).length,l=this._replacementCount(),p=wt.filter(e=>Ct(this._config?.settings,e)).length,h=(this._config?.favorites||[]).length;return[{page:"dashboard",group:"general",icon:"mdi:view-dashboard-edit",color:"#3b82f6",title:this._t("settings.dashboard"),description:this._t("settings.dashboard_description"),summary:this._dashboardTitle||this._getDashboardPanelTitle()||void 0},{page:"home",group:"general",icon:"mdi:home-edit-outline",color:"#3b82f6",title:this._t("settings.home_page"),description:this._t("settings.home_page_description"),summary:this._t("settings.visible_count",{visible:t,total:n})},{page:"areas",group:"general",icon:"mdi:floor-plan",color:"#3b82f6",title:this._t("settings.areas"),description:this._t("settings.areas_description"),summary:this._tp("common.area",e)},{page:"devices",group:"general",icon:"mdi:format-list-bulleted-type",color:"#3b82f6",title:this._t("settings.devices_page"),description:this._t("settings.devices_page_description"),summary:this._t("settings.types_visible",{visible:i-a,total:i})},{page:"header",group:"content",icon:"mdi:information-outline",color:"#8b5cf6",title:this._t("settings.header_status"),description:this._t("settings.header_status_description"),summary:this._tp("common.active",c)},{page:"favorites",group:"content",icon:"mdi:star-outline",color:"#8b5cf6",title:this._t("favorites.title"),description:this._t("settings.favorites_global_description"),summary:this._tp("common.favorite",h)},{page:"replacements",group:"content",icon:"mdi:puzzle-edit-outline",color:"#8b5cf6",title:this._t("settings.blueprint_replacements"),description:this._t("settings.blueprint_replacements_description"),summary:this._tp("common.active",l)},{page:"controls",group:"behavior",icon:"mdi:gesture-tap-button",color:"#0f9f8f",title:this._t("settings.controls_confirmations"),description:this._t("settings.controls_confirmations_description"),summary:this._t("settings.controls_confirmations_summary",{count:p})},{page:"permissions",group:"behavior",icon:"mdi:shield-account",color:"#0f9f8f",title:this._t("settings.user_permissions"),description:this._t("settings.user_permissions_description"),summary:this._config?.settings?.restrict_non_admin_ha_sidebar||this._config?.settings?.restrict_non_admin_dashboard_settings?this._t("settings.restrictions_enabled"):this._t("settings.default_access")},{page:"wall_tablet",group:"behavior",icon:"mdi:tablet-dashboard",color:"#0f9f8f",title:this._t("kiosk.title"),description:this._t("kiosk.description"),summary:ft(d(window.location.pathname)).enabled?this._t("kiosk.summary_on"):this._t("kiosk.summary_off")},{page:"support",group:"support",icon:"mdi:heart",color:"var(--primary-color)",title:this._t("settings.support"),description:this._t("settings.support_description")}]}_renderSettingsNavItem(e){return W`
      <button
        class="settings-nav-item"
        type="button"
        style=${`--settings-item-color: ${e.color};`}
        @click=${()=>this._openSettingsPage(e.page)}
      >
        <div class="settings-nav-icon ${"support"===e.group?"support-gradient":""}">
          ${"support"===e.group?W`
                <svg class="settings-nav-gradient-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <defs>
                    <linearGradient id="dd-support-icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color: var(--primary-color)"></stop>
                      <stop offset="50%" style="stop-color: color-mix(in srgb, var(--primary-color) 45%, var(--accent-color, #e8a400))"></stop>
                      <stop offset="100%" style="stop-color: var(--accent-color, #e8a400)"></stop>
                    </linearGradient>
                  </defs>
                  <path d=${It[e.icon]||z} fill="url(#dd-support-icon-gradient)"></path>
                </svg>
              `:this._renderSettingsIcon(e.icon)}
        </div>
        <div class="settings-nav-copy">
          <div class="settings-nav-title">${e.title}</div>
          <div class="settings-nav-description">${e.description}</div>
        </div>
        ${e.summary?W`<span class="settings-nav-summary">${e.summary}</span>`:R}
        ${this._renderSettingsIcon("mdi:chevron-right","settings-nav-chevron")}
      </button>
    `}_renderSettingsIcon(e,t=""){const i=It[e];return i?W`
      <svg class=${t} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${i}></path>
      </svg>
    `:W`<ha-icon class=${t} icon=${e}></ha-icon>`}_openSettingsPage(e){this._settingsPage=e,"devices"===e&&(this._expandedDeviceTypes=new Set),this._closeInlinePickers(),this._emitSettingsPageContext(),this._resetSettingsScrollPosition()}_restoreSettingsNavigation(e,t){const i=["overview","dashboard","home","header","controls","devices","people","areas","favorites","replacements","permissions","wall_tablet","support"].includes(e)?e:"overview";this._settingsPage=i,this._area="areas"===i&&t&&this.hass?.areas?.[t]?t:void 0,this._areaGroupOrderDirty=!1,this._area&&(this._collapsedAreaEntityGroups=new Set(se)),this._closeInlinePickers(),this._emitSettingsPageContext()}_commitDeviceSettings(){bt(d(window.location.pathname))}_discardDeviceSettings(){xt(d(window.location.pathname))}_emitSettingsPageContext(){const e="overview"===this._settingsPage,t=this._area?this.hass?.areas?.[this._area]?.name:void 0,i=e?this._t("sidebar.dashboard_settings"):t||this._settingsPageTitle(this._settingsPage),a=e?this._t("settings.subtitle"):t?this._t("settings.area_detail_header_description"):this._settingsPageDescription(this._settingsPage);this.dispatchEvent(new CustomEvent("dd-settings-page-changed",{detail:{page:this._settingsPage,areaId:this._area,title:i,parentTitle:t?this._settingsPageTitle("areas"):void 0,description:a},bubbles:!0,composed:!0}))}_closeInlinePickers(){this._showEntityPicker=!1,this._showWeatherPicker=!1,this._showAlarmPicker=!1}_stabilizeSettingsScrollbar(){const e=new Set;let t=this;for(;t&&!e.has(t);){if(e.add(t),t instanceof HTMLElement&&!this._scrollbarGutterTargets.has(t)&&(this._scrollbarGutterTargets.set(t,t.style.scrollbarGutter),t.style.scrollbarGutter="stable"),t.parentNode){t=t.parentNode;continue}const i=t.getRootNode();t=i instanceof ShadowRoot?i.host:null}for(const e of[document.documentElement,document.body])e&&!this._scrollbarGutterTargets.has(e)&&(this._scrollbarGutterTargets.set(e,e.style.scrollbarGutter),e.style.scrollbarGutter="stable")}_restoreSettingsScrollbar(){for(const[e,t]of this._scrollbarGutterTargets)e.style.scrollbarGutter=t;this._scrollbarGutterTargets.clear()}_resetSettingsScrollPosition(){this.updateComplete.then(()=>{window.requestAnimationFrame(()=>{const e=new Set;let t=this;for(;t&&!e.has(t);){if(e.add(t),t instanceof HTMLElement&&(t.scrollTop=0),t.parentNode){t=t.parentNode;continue}const i=t.getRootNode();t=i instanceof ShadowRoot?i.host:null}document.scrollingElement?.scrollTo({top:0,behavior:"auto"}),window.scrollTo({top:0,behavior:"auto"})})})}_settingsPageDescription(e){switch(e){case"dashboard":return this._t("settings.dashboard_page_description");case"home":return this._t("settings.home_layout_description");case"header":return this._t("settings.header_page_description");case"controls":return this._t("settings.controls_page_description");case"devices":return this._t("settings.devices_description");case"people":return this._t("settings.people_page_description");case"areas":return this._t("settings.areas_page_description");case"favorites":return this._t("settings.favorites_global_description");case"replacements":return this._t("settings.replace_description");case"permissions":return this._t("settings.permissions_description");case"support":return this._t("settings.support_page_description");default:return""}}_renderSettingsDetailPage(e){return this._settingsOverviewItems().find(t=>t.page===e)?W`
      <div class="editor-container dd-flat-settings">
        ${this.inlineBackNavigation?W`<div class="dd-native-editor-subpage-back">
          <button type="button" class="dd-native-back-button"
            @click=${this._backToSettingsOverview}
            title=${this._t("common.back")}
            aria-label=${this._t("common.back")}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
        </div>`:R}
        <div class="settings-detail-content dd-flat-content">
          ${this._renderSettingsPageContent(e)}
        </div>
      </div>
    `:this._renderSettingsOverview()}_renderSettingsPageContent(e){switch(e){case"dashboard":return this._renderDashboardSettingsPanel();case"home":return this._renderHomeLayoutSettingsPanel();case"header":return this._renderHeaderStatusSettingsPanel();case"controls":return this._renderMasterActionConfirmationSettingsPanel();case"devices":return this._renderEntityDisplaySettingsPanel();case"people":return this._renderPersonsSettingsPanel();case"areas":return this._renderAreasSettingsPanel();case"favorites":return this._renderFavoritesSettingsPanel();case"replacements":return this._renderReplacementsSettingsPanel();case"permissions":return this._renderPermissionsSettingsPanel();case"support":return this._renderSupportSection();case"wall_tablet":return this._renderSettingsPanel("mdi:tablet-dashboard",this._t("kiosk.title"),this._t("kiosk.panel_description"),W`<dwains-dashboard-next-wall-tablet-settings .hass=${this.hass}></dwains-dashboard-next-wall-tablet-settings>`);default:return R}}_settingsPageTitle(e){switch(e){case"dashboard":return this._t("settings.dashboard");case"home":return this._t("settings.home_page");case"header":return this._t("settings.header_status");case"controls":return this._t("settings.controls_confirmations");case"devices":return this._t("settings.devices_page");case"people":return this._t("settings.people");case"areas":return this._t("settings.areas");case"favorites":return this._t("favorites.title");case"replacements":return this._t("settings.blueprint_replacements");case"permissions":return this._t("settings.user_permissions");case"support":return this._t("settings.support");case"wall_tablet":return this._t("kiosk.title");default:return""}}_renderSettingsPanel(e,t,i,a){const o=this._settingsPageTitle(this._settingsPage)===t;return W`
      <section class="dd-settings-section ${o?"page-root":""}">
        ${o?R:W`
          <div class="dd-settings-section-header">
            <span class="dd-settings-section-icon"><ha-icon icon=${e}></ha-icon></span>
            <span class="dd-settings-section-copy">
              <strong>${t}</strong>
              ${i?W`<small>${i}</small>`:R}
            </span>
          </div>
        `}
        <div class="dd-settings-section-content">${a}</div>
      </section>
    `}_renderToggleSetting(e,t,i,a,o){return W`
      <div class="dd-setting-row">
        <span class="dd-setting-row-icon"><ha-icon icon=${e}></ha-icon></span>
        <span class="dd-setting-row-copy">
          <strong>${t}</strong>
          ${i?W`<small>${i}</small>`:R}
        </span>
        <ha-switch .checked=${a} @change=${o}></ha-switch>
      </div>
    `}_renderLinkedToggleSetting(e,t,i,a,o){return W`
      <div class="dd-setting-row dd-setting-row-with-link">
        <span class="dd-setting-row-icon"><ha-icon icon=${e}></ha-icon></span>
        <span class="dd-setting-row-copy">
          <strong>${t}</strong>
          <small>
            ${i}
            <button
              class="dd-settings-inline-link"
              type="button"
              @click=${e=>{e.stopPropagation(),this._openSettingsPage("favorites")}}
            >${this._t("settings.manage_favorites")}</button>
          </small>
        </span>
        <ha-switch .checked=${a} @change=${o}></ha-switch>
      </div>
    `}_renderMasterActionConfirmationSettingsPanel(){return W`
      <div class="master-confirmation-section dd-simple-settings-stack">
        <div class="master-confirmation-list">
          ${wt.map(e=>{const t=Ct(this._config?.settings,e);return W`
              <label class="master-confirmation-row">
                <span class="master-confirmation-icon">
                  <ha-icon icon=${J(e)}></ha-icon>
                </span>
                <span class="master-confirmation-copy">
                  <strong>${K(this.hass,e)}</strong>
                </span>
                <span class="master-confirmation-control">
                  <span>${this._t(t?"settings.confirmation_required":"settings.runs_immediately")}</span>
                  <ha-switch
                    .checked=${t}
                    @change=${t=>this._toggleMasterActionConfirmation(e,t)}
                  ></ha-switch>
                </span>
              </label>
            `})}
        </div>
      </div>
    `}_renderSupportSection(){return W`
      <div class="sponsoring-section dd-support-flat">
        <div class="sponsor-label">${this._t("support.donation")}</div>
        <div class="sponsor-chips">
          <a class="sponsor-chip" href="https://github.com/sponsors/dwainscheeren" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:github"></ha-icon><span>${this._t("support.github")}</span>
          </a>
          <a class="sponsor-chip" href="https://www.paypal.me/dwainscheeren" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:cash"></ha-icon><span>PayPal</span>
          </a>
          <a class="sponsor-chip" href="https://www.buymeacoffee.com/FAkYvrx" target="_blank" rel="noopener noreferrer">
            <ha-icon icon="mdi:coffee"></ha-icon><span>${this._t("support.buy_coffee")}</span>
          </a>
        </div>

        <div class="sponsor-divider"></div>

        <div class="sponsor-label">${this._t("support.shop_prompt")}</div>
        <a class="sponsor-chip primary" href="https://smarthomeshop.io/en" target="_blank" rel="noopener noreferrer">
          <ha-icon icon="mdi:shopping"></ha-icon><span>${this._t("support.visit_shop")}</span>
        </a>
      </div>
    `}_renderDashboardSettingsPanel(){return this._dashboardId?this._renderSettingsPanel("mdi:view-dashboard",this._t("settings.dashboard"),this._t("strategy.dashboard_desc"),W`
        <div class="dashboard-settings">
          <div class="dd-field">
            <label>${this._t("strategy.name")}</label>
            <input
              class="dd-input"
              type="text"
              .value=${this._dashboardTitle}
              @input=${this._onDashboardTitleChanged}
              @change=${this._onDashboardTitleCommit}
            />
          </div>
          <ha-icon-picker
            .label=${this._t("strategy.sidebar_icon")}
            .value=${this._dashboardIcon}
            @value-changed=${this._onDashboardIconChanged}
          ></ha-icon-picker>
        </div>
      `):this._renderSettingsPanel("mdi:view-dashboard",this._t("settings.dashboard"),this._t("settings.default_dashboard_locked"),W`
          <div class="empty-settings-card">
            <strong>${this._t("settings.default_dashboard_locked")}</strong>
            <span>${this._t("settings.open_instance")}</span>
          </div>
        `)}_homeSectionDetail(e){return"devices"===e?"house_information":"cameras"===e?"cameras":"custom_cards"===e?"custom_cards":"scenes"===e?"scenes":void 0}_renderHomeLayoutSettingsPanel(){return this._homeSettingsDetail||(this._homeSettingsDetail="overview"),W`
      <section class="dd-home-layout-panel">
        ${this._renderHomeSectionOrder()}
      </section>
    `}_replacementEntries(){const e=this._config?.blueprint_replacements;if(!e)return[];const t=new Set;for(const i of["area_cards","devices_cards"])Object.keys(e[i]?.by_domain||{}).forEach(e=>t.add(e));return[...t].sort((e,t)=>K(this.hass,e).localeCompare(K(this.hass,t))).map(t=>({target:t,assignment:e.area_cards?.by_domain?.[t]||e.devices_cards?.by_domain?.[t]})).filter(e=>Boolean(e.assignment))}_setReplacementEnabled(e,t){if(!this._config)return;const i=structuredClone(this._config.blueprint_replacements||{});for(const a of["area_cards","devices_cards"]){const o=i[a]?.by_domain?.[e];o&&(o.enabled=t)}this._fireConfigChanged({...this._config,blueprint_replacements:i})}_removeReplacement(e){if(!this._config)return;const t=structuredClone(this._config.blueprint_replacements||{});for(const i of["area_cards","devices_cards"])t[i]?.by_domain&&delete t[i].by_domain[e];this._fireConfigChanged({...this._config,blueprint_replacements:t})}_renderReplacementsSettingsPanel(){const e=this._replacementEntries();return this._renderSettingsPanel("mdi:puzzle-edit-outline",this._t("settings.blueprint_replacements"),this._t("settings.replace_description"),W`
        <div class="replacement-section dd-replacement-settings">
          ${e.length?W`
            <div class="dd-replacement-list">
              ${e.map(({target:e,assignment:t})=>{const i=!1!==t.enabled;return W`
                  <div class="dd-replacement-row ${i?"":"disabled"}">
                    <span class="dd-replacement-domain-icon">
                      <ha-icon icon=${J(e)}></ha-icon>
                    </span>
                    <span class="dd-replacement-copy">
                      <strong>${K(this.hass,e)}</strong>
                      <small>${t.name}${t.version?` · v${t.version}`:""}</small>
                    </span>
                    <span class="dd-replacement-actions">
                      <label class="dd-replacement-enabled" title=${i?this._t("common.disable"):this._t("common.enable")}>
                        <ha-switch
                          .checked=${i}
                          @change=${()=>this._setReplacementEnabled(e,!i)}
                        ></ha-switch>
                      </label>
                      <button
                        class="dd-icon-text-button danger"
                        type="button"
                        title=${this._t("common.delete")}
                        aria-label=${this._t("common.delete")}
                        @click=${()=>this._removeReplacement(e)}
                      ><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                    </span>
                  </div>
                `})}
            </div>
          `:W`<div class="dd-replacement-empty">${this._t("replacement.empty")}</div>`}

          <div class="dd-replacement-footer">
            <ha-button appearance="accent" @click=${this._openReplacementManager}>
              <ha-icon icon="mdi:plus"></ha-icon>
              ${this._t("replacement.assign")}
            </ha-button>
          </div>
        </div>
      `)}_renderFavoritesSettingsPanel(){const e=!1!==this._config?.settings?.show_suggested_favorites;return this._renderSettingsPanel("mdi:star-outline",this._t("favorites.title"),this._t("settings.favorites_global_description"),W`
        <div class="favorites-section dd-favorites-inline">
          <div class="dd-favorites-options-card">
            ${this._renderToggleSetting("mdi:star-plus-outline",this._t("settings.show_suggested_favorites"),this._t("settings.suggested_favorites_description"),e,this._toggleSuggestedFavorites)}
          </div>

          <div class="entity-picker dd-favorites-picker dd-favorites-list-card">
            <div class="dd-inline-action-row dd-favorites-list-head">
              <strong>${this._t("settings.manual_favorites")} ${this._t("favorites.title")}</strong>
              <button class="home-custom-card-add dd-favorites-add" type="button" @click=${this._addFavoriteEntity}>
                <ha-icon icon="mdi:plus"></ha-icon>
                ${this._t("common.add")}
              </button>
            </div>
            ${this._renderSelectedEntities()}
            ${this._showEntityPicker?this._renderEntityPicker():R}
          </div>
        </div>
      `)}_renderHeaderStatusSettingsPanel(){const e=!1!==this._config?.settings?.show_weather,t=this._config?.settings?.weather_entity_id,i=t?this.hass?.states?.[t]:void 0,a=t?i?.attributes?.friendly_name||t:this._t("settings.no_weather_fallback"),o=this._config?.settings?.alarm_entity_id,s=Boolean(o)&&!1!==this._config?.settings?.show_alarm,r=o?this.hass?.states?.[o]:void 0,n=o?r?.attributes?.friendly_name||o:this._t("settings.no_alarm_short");return W`
      <div class="dd-header-status-settings">
        <div class="dd-header-status-list">
          ${this._renderToggleSetting("mdi:clock-outline",this._t("settings.time_date"),"",!1!==this._config?.settings?.show_time,this._toggleTimeDisplay)}
          ${this._renderToggleSetting("mdi:bell-outline",this._t("home.notifications"),"",!1!==this._config?.settings?.show_notifications,this._toggleNotificationsDisplay)}

          <div class="dd-header-feature">
            <div class="dd-header-feature-row">
              <span class="dd-setting-row-icon"><ha-icon icon="mdi:weather-cloudy"></ha-icon></span>
              <span class="dd-setting-row-copy">
                <strong>${this._t("domain.weather")}</strong>
                <small>${a}</small>
              </span>
              <span class="dd-header-feature-actions">
                <button class="dd-inline-text-button" type="button" @click=${this._addWeatherEntity}>
                  ${this._t("common.select")}
                </button>
                <ha-switch .checked=${e} @change=${this._toggleWeatherDisplay}></ha-switch>
              </span>
            </div>
            ${this._showWeatherPicker?this._renderWeatherPicker():R}
          </div>

          <div class="dd-header-feature">
            <div class="dd-header-feature-row">
              <span class="dd-setting-row-icon"><ha-icon icon="mdi:shield-home-outline"></ha-icon></span>
              <span class="dd-setting-row-copy">
                <strong>${this._t("domain.alarm_control_panel")}</strong>
                <small>${n}</small>
              </span>
              <span class="dd-header-feature-actions">
                <button class="dd-inline-text-button" type="button" @click=${this._addAlarmEntity}>
                  ${this._t("common.select")}
                </button>
                <ha-switch
                  .checked=${s}
                  .disabled=${!o}
                  @change=${this._toggleAlarmDisplay}
                ></ha-switch>
              </span>
            </div>
            ${this._showAlarmPicker?this._renderAlarmPicker():R}
          </div>
        </div>

        <div class="dd-status-people-card">
          <div class="dd-header-feature-row dd-status-people-heading">
            <span class="dd-setting-row-icon"><ha-icon icon="mdi:account-group-outline"></ha-icon></span>
            <span class="dd-setting-row-copy">
              <strong>${this._t("settings.people")}</strong>
              <small>${this._t("settings.people_page_description")}</small>
            </span>
          </div>
          <div class="dd-status-people-list">
            ${this._renderPersonsConfiguration()}
          </div>
        </div>
      </div>
    `}_renderEntityDisplaySettingsPanel(){return this._renderSettingsPanel("mdi:eye-off",this._t("settings.devices_page"),this._t("settings.devices_description"),W`
        <div class="entity-display-section">
          <div class="dd-settings-list dd-settings-list-spaced">
            ${this._renderToggleSetting("mdi:eye-off-outline",this._t("settings.hide_unavailable_devices"),this._t("settings.hide_unavailable_devices_description"),!1!==this._config?.settings?.hide_unavailable_entities_on_devices,this._toggleHideUnavailableEntities)}
            ${this._renderToggleSetting("mdi:history",this._t("settings.show_new_devices"),this._t("settings.show_new_devices_description"),!1!==this._config?.settings?.show_recent_devices_panel,this._toggleRecentDevicesPanel)}
          </div>
          ${this._renderDeviceVisibilitySettings()}
        </div>
      `)}_renderPermissionsSettingsPanel(){return this._renderSettingsPanel("mdi:shield-account",this._t("settings.user_permissions"),this._t("settings.permissions_description"),W`
        <div class="entity-display-section">
          <div class="dd-settings-list">
            ${this._renderToggleSetting("mdi:menu",this._t("settings.restrict_ha_menu_short"),this._t("settings.restrict_ha_menu_description"),!0===this._config?.settings?.restrict_non_admin_ha_sidebar,this._toggleRestrictNonAdminHaSidebar)}
            ${this._renderToggleSetting("mdi:pencil-off-outline",this._t("settings.restrict_editing_short"),this._t("settings.restrict_editing_description"),!0===this._config?.settings?.restrict_non_admin_dashboard_settings,this._toggleRestrictNonAdminDashboardSettings)}
          </div>
        </div>
      `)}_renderPersonsSettingsPanel(){return this._renderSettingsPanel("mdi:account-multiple",this._t("settings.people"),this._t("settings.people_page_description"),W`
        <div class="persons-section">
          ${this._renderPersonsConfiguration()}
        </div>
      `)}_renderAreasSettingsPanel(){const e=this._config?.settings?.show_area_now_playing??"all"===Ue(this._config?.settings?.now_playing_bar);return this._renderSettingsPanel("mdi:floor-plan",this._t("settings.areas"),this._t("settings.areas_page_description"),W`
        <div class="entity-display-section">
          <div class="dd-settings-list dd-settings-list-spaced">
            ${this._renderToggleSetting("mdi:form-textbox",this._t("settings.hide_area_name_in_entity_names"),this._t("settings.hide_area_name_in_entity_names_description"),!0===this._config?.settings?.hide_area_name_in_entity_names,this._toggleHideAreaNameInEntityNames)}
            ${this._renderToggleSetting("mdi:eye-off-outline",this._t("settings.hide_unavailable_areas"),this._t("settings.hide_unavailable_areas_description"),!1!==this._config?.settings?.hide_unavailable_entities,this._toggleHideUnavailableAreaEntities)}
            ${this._renderLinkedToggleSetting("mdi:star-outline",this._t("settings.show_area_favorites"),this._t("settings.show_area_favorites_description"),!1!==this._config?.settings?.show_area_favorites,this._toggleAreaFavorites)}
            ${this._renderToggleSetting("mdi:music-circle-outline",this._t("settings.show_area_now_playing"),this._t("settings.show_area_now_playing_description"),e,this._toggleAreaNowPlaying)}
            ${this._renderToggleSetting("mdi:thermostat",this._t("thermostat.setting_label"),this._t("thermostat.setting_description"),!1!==this._config?.settings?.show_area_thermostat,this._toggleAreaThermostat)}
          </div>
          ${this._renderAreasConfiguration()}
        </div>
      `)}_renderAreasConfiguration(){if(!this.hass||!this._config)return R;const e=Object.values(this.hass.areas||{}),t=new Set(this._config.areas_display?.hidden||[]),i=re(this._config.areas_display),a=ne(e,{...this._config.areas_display,hidden:[]},xe(this.hass)),o=new Map((this._areaPreviewOrder||[]).map((e,t)=>[e,t])),s="custom"===i&&this._areaPreviewOrder?[...a].sort((e,t)=>(o.get(e.area_id)??Number.MAX_SAFE_INTEGER)-(o.get(t.area_id)??Number.MAX_SAFE_INTEGER)):a;return W`
      <section class="area-order-settings" aria-labelledby="area-order-title">
        <div class="area-order-heading">
          <strong id="area-order-title">${this._t("settings.area_order_title")}</strong>
        </div>
        <div class="area-sort-segmented" role="radiogroup" aria-label=${this._t("settings.area_order_title")}>
          ${[{mode:"home_assistant",icon:"mdi:home-assistant"},{mode:"alphabetical",icon:"mdi:sort-alphabetical-ascending"},{mode:"custom",icon:"mdi:drag-vertical"}].map(({mode:e,icon:t})=>W`
            <button
              type="button"
              class="area-sort-segment ${i===e?"selected":""}"
              role="radio"
              aria-checked=${i===e?"true":"false"}
              @click=${()=>this._setAreaSortMode(e)}
            >
              <ha-icon .icon=${t}></ha-icon>
              <span>${this._t(`settings.area_order_${e}`)}</span>
            </button>
          `)}
        </div>

        ${"custom"===i?W`
          <p class="area-order-list-hint">${this._t("settings.area_order_drag_hint")}</p>
        `:R}

        <div class="sortable-container area-settings-sortable ${"custom"===i?"is-custom-order":""} ${this._draggedAreaId?"dragging":""}">
        ${V(s,e=>e.area_id,(e,a)=>{const o=t.has(e.area_id),s=this._draggedAreaId===e.area_id,r=this._dragOverIndex===a&&this._draggedAreaId&&this._draggedAreaId!==e.area_id;return W`
              <div
                class="sortable-item dd-area-sortable-row ${o?"hidden":""} ${s?"dragging":""} ${r?"drag-over":""}"
                data-area-id="${e.area_id}"
                data-index="${a}"
                .draggable=${"custom"===i}
                @dragstart=${t=>"custom"===i&&this._handleAreaDragStart(t,e.area_id)}
                @dragend=${this._handleAreaDragEnd}
                @dragover=${e=>"custom"===i&&this._handleAreaDragOver(e,a)}
                @dragleave=${this._handleAreaDragLeave}
                @drop=${e=>"custom"===i&&this._handleAreaDrop(e,a)}
              >
                <div class="area-item">
                  ${"custom"===i?W`
                    <div class="handle" aria-hidden="true">
                      <ha-svg-icon .path=${j}></ha-svg-icon>
                    </div>
                  `:R}
                  <ha-icon .icon=${e.icon||"mdi:floor-plan"} class="area-icon"></ha-icon>
                  <span class="area-name clickable" @click=${()=>this._editArea(e.area_id)}>
                    ${e.name}
                    <ha-icon icon="mdi:chevron-right" class="chevron"></ha-icon>
                  </span>
                  <div class="area-actions">
                    <button
                      class="dd-visibility-button ${o?"hidden":""}"
                      type="button"
                      title=${this._t(o?"common.show":"common.hide")}
                      aria-label=${this._t(o?"common.show":"common.hide")}
                      @click=${t=>{t.stopPropagation(),this._toggleAreaVisibility(e.area_id)}}
                    >
                      <ha-icon icon=${o?"mdi:eye":"mdi:eye-off"}></ha-icon>
                    </button>
                  </div>
                </div>
              </div>
            `})}
        </div>
        <button
          class="home-layout-reset area-list-reset"
          type="button"
          ?disabled=${0===t.size&&"alphabetical"===i}
          @click=${this._resetAreasConfiguration}
        >
          ${this._t("settings.reset_layout")}
        </button>
      </section>
    `}_areaEntityDisplayName(e){const t=this.hass?.states?.[e]?.attributes?.friendly_name||this.hass?.entities?.[e]?.name||e;if(!0!==this._config?.settings?.hide_area_name_in_entity_names||!this._area)return t;const i=this.hass?.areas?.[this._area]?.name||this._config?.areas?.find(e=>e.area_id===this._area)?.name;return de(t,i)}_getAreaEditorCustomCards(){if(!this._config||!this._area)return[];const e=this._config.areas_options?.[this._area]?.custom_cards;return Array.isArray(e)?e.filter(e=>e?.id&&e?.card&&"object"==typeof e.card):[]}_areaCustomCardTitle(e){const t=e.card,i="string"==typeof t?.entity?t.entity:"",a=i?this.hass?.states?.[i]?.attributes?.friendly_name:void 0,o=String(t?.type||"card").replace(/^custom:/,"").replace(/-/g," ");return String(t?.title||t?.name||a||o)}_areaCustomCardSubtitle(e){return String(e.card?.type||"card").replace(/^custom:/,"")}_areaCustomCardPlacementIndex(e,t){const i=e.findIndex(e=>e.id===t.id);return i<0?0:e.slice(0,i).filter(e=>e.placement===t.placement).length}_domainCustomCardPlacementIndex(e,t){const i=`domain:${t}:`;if(!e.startsWith(i))return;const a=Number(e.slice(i.length));return Number.isFinite(a)&&a>=0?a:void 0}_getAreaEditorDomainCardsForSlot(e,t,i,a){const o=`domain:${t}:${i}`;return e.filter(e=>{if(e.placement===o)return!0;const s=this._domainCustomCardPlacementIndex(e.placement,t);return i===a&&void 0!==s&&s>a||i===a&&e.placement===`after:${t}`})}_areaEditorFreeSlotForCard(e,t,i){const a=/^ungrouped:(\d+)$/.exec(e.placement);if(a)return Math.min(t.length,Number(a[1]));const o=/^domain:([^:]+):(\d+)$/.exec(e.placement),s=/^after:(.+)$/.exec(e.placement),r=o?.[1]||s?.[1];if(!r||!se.includes(r))return;const n=t.map((e,t)=>i.get(e)===r?t:-1).filter(e=>e>=0);if(!n.length)return t.length;if(s)return Math.min(t.length,n[n.length-1]+1);const d=Number(o?.[2]||0);return d<=0?n[0]:d>=n.length?Math.min(t.length,n[n.length-1]+1):n[d]}_getAreaEditorFreeCardsForSlot(e,t,i,a){return e.filter(e=>"top"!==e.placement&&"bottom"!==e.placement&&this._areaEditorFreeSlotForCard(e,i,a)===t)}_renderAreaCustomCardEditorRow(e){const t=this._getAreaEditorCustomCards(),i=this._areaCustomCardPlacementIndex(t,e),a=this._draggedAreaCustomCardId===e.id,o=this._dragOverAreaCustomCardTarget?.placement===e.placement&&this._dragOverAreaCustomCardTarget.index===i;return W`
      <div
        class="sortable-item custom-card-item ${a?"dragging":""} ${o?"drag-over":""}"
        draggable="true"
        @dragstart=${t=>this._handleAreaCustomCardDragStart(t,e.id)}
        @dragend=${this._handleAreaCustomCardDragEnd}
        @dragover=${t=>this._handleAreaCustomCardDragOver(t,e.placement,i)}
        @drop=${t=>this._handleAreaCustomCardDrop(t,e.placement,i)}
      >
        <div class="entity-item">
          <div class="handle"><ha-svg-icon .path=${j}></ha-svg-icon></div>
          <span class="custom-card-icon"><ha-icon icon="mdi:cards-outline"></ha-icon></span>
          <span class="entity-name">
            ${this._areaCustomCardTitle(e)}
            <small>${this._t("layout.custom_cards")} · ${this._areaCustomCardSubtitle(e)}</small>
          </span>
          <span class="custom-card-badge">${this._t("layout.drag_card")}</span>
        </div>
      </div>
    `}_renderAreaCustomCardPlacement(e,t,i){const a=e.filter(e=>e.placement===t);if(!a.length&&!this._draggedAreaCustomCardId)return R;const o=this._dragOverAreaCustomCardTarget?.placement===t&&this._dragOverAreaCustomCardTarget.index===a.length;return W`
      <section
        class="area-custom-card-placement ${o?"drag-over":""}"
        @dragover=${e=>this._handleAreaCustomCardDragOver(e,t,a.length)}
        @drop=${e=>this._handleAreaCustomCardDrop(e,t,a.length)}
      >
        <div class="area-custom-card-placement-title">
          <ha-icon icon=${"top"===t?"mdi:format-vertical-align-top":"mdi:format-vertical-align-bottom"}></ha-icon>
          <span>${i}</span>
        </div>
        <div class="sortable-container area-custom-card-list">
          ${a.map(e=>this._renderAreaCustomCardEditorRow(e))}
          ${a.length?R:W`<span class="area-custom-card-empty">${this._t("layout.drag_card")}</span>`}
        </div>
      </section>
    `}_renderAreaCustomCardDropZone(e){if(!this._draggedAreaCustomCardId)return R;const t=this._dragOverAreaCustomCardTarget?.placement===e;return W`
      <div
        class="area-custom-card-drop-zone ${t?"drag-over":""}"
        @dragover=${t=>this._handleAreaCustomCardDragOver(t,e,Number.POSITIVE_INFINITY)}
        @drop=${t=>this._handleAreaCustomCardDrop(t,e,Number.POSITIVE_INFINITY)}
      >
        <ha-icon icon="mdi:cards-outline"></ha-icon>
        <span>${this._t("layout.drag_card")}</span>
      </div>
    `}_renderAreaEditor(){if(!this.hass||!this._config||!this._area)return R;if(!this.hass.areas[this._area])return R;const e=[],t=new Set;if(this._config.entities){const i=new Set;this._config.devices&&this._config.devices.forEach(e=>{e.area_id===this._area&&i.add(e.device_id)}),this._config.entities.forEach(a=>{(a.area_id===this._area||a.device_id&&i.has(a.device_id))&&(e.push({entity_id:a.entity_id}),t.add(a.entity_id))})}this.hass?.states&&Object.values(this.hass.states).forEach(i=>{if(!t.has(i.entity_id)){const t=this.hass?.entities?.[i.entity_id];t?.area_id===this._area&&e.push({entity_id:i.entity_id})}});const i=this._getAreaGroupedEntitiesWithoutFiltering(e,this.hass),a=this._config.areas_options?.[this._area]||{},o="ungrouped"===a.entity_layout?"ungrouped":"grouped",s=new Map;se.forEach(e=>{(i[e]||[]).forEach(t=>s.set(t,e))});const r=se.flatMap(e=>i[e]||[]),n=a.entity_order||[],d=this._sortEntityIds(r,n),c=this._getAreaEditorCustomCards(),l=this._sortAreaStrategyGroups(se.filter(e=>(i[e]||[]).length>0||c.some(t=>t.placement===`after:${e}`||void 0!==this._domainCustomCardPlacementIndex(t.placement,e)))),p=this._draggedEntitySection&&this._areaGroupPreviewOrder?this._areaGroupPreviewOrder.filter(e=>l.includes(e)):l,h=!(void 0!==a.entity_layout||a.group_order?.length||a.entity_order?.length||Object.values(a.groups_options||{}).some(e=>Boolean(e?.hidden?.length||e?.order?.length))||c.some(e=>e.placement.startsWith("ungrouped:")));return W`
      <div class="editor-container area-detail-editor">
        <div class="area-help">
          <ha-svg-icon .path=${N} class="area-help-icon"></ha-svg-icon>
          <div class="area-help-text">
            <p>${this._t("settings.area_climate_power_help")}</p>
          </div>
        </div>

        ${c.length||this._draggedAreaCustomCardId?W`
          <section class="area-custom-cards-settings">
            <div class="area-entity-layout-copy">
              <strong>${this._t("layout.custom_cards")}</strong>
              <span>${this._t("settings.area_entity_order_hint")}</span>
            </div>
            ${this._renderAreaCustomCardPlacement(c,"top",this._t("layout.custom_cards_top"))}
          </section>
        `:R}


        <section class="area-entity-layout-settings">
          <div class="area-entity-layout-heading">
            <strong>${this._t("settings.area_entity_layout_title")}</strong>
          </div>
          <div class="area-order-modes">
            <button
              class="area-order-mode ${"grouped"===o?"selected":""}"
              type="button"
              @click=${()=>this._setAreaEntityLayout("grouped",d,s)}
            >
              <ha-icon icon="mdi:format-list-group"></ha-icon>
              <span>
                <strong>${this._t("settings.area_entity_layout_grouped")}</strong>
              </span>
            </button>
            <button
              class="area-order-mode ${"ungrouped"===o?"selected":""}"
              type="button"
              @click=${()=>this._setAreaEntityLayout("ungrouped")}
            >
              <ha-icon icon="mdi:sort-variant"></ha-icon>
              <span>
                <strong>${this._t("settings.area_entity_layout_ungrouped")}</strong>
              </span>
            </button>
          </div>
          <p class="area-entity-layout-hint">${this._t("settings.area_entity_order_hint")}</p>

        ${"ungrouped"===o?W`
          <section class="area-free-order-section">
            <div class="area-free-order-header">
              <ha-icon icon="mdi:sort-variant"></ha-icon>
              <strong>${this._t("settings.area_entity_order")}</strong>
            </div>
            <div class="sortable-container dragging-enabled ${this._draggedEntityGroup===Dt?"dragging":""}">
              ${this._getAreaEditorFreeCardsForSlot(c,0,d,s).map(e=>this._renderAreaCustomCardEditorRow(e))}
              ${V(d,e=>e,(e,t)=>{const i=this.hass.states[e],o=s.get(e)||"others",r=new Set(a.groups_options?.[o]?.hidden||[]).has(e),n=this._draggedEntityId===e&&this._draggedEntityGroup===Dt,l=this._dragOverEntityIndex===t&&this._draggedEntityGroup===Dt&&this._draggedEntityId&&this._draggedEntityId!==e;return W`
                    <div
                      class="sortable-item ${r?"hidden":""} ${n?"dragging":""} ${l?"drag-over":""}"
                      draggable="true"
                      @dragstart=${t=>this._handleEntityDragStart(t,e,Dt)}
                      @dragend=${this._handleEntityDragEnd}
                      @dragover=${e=>this._handleAreaEditorDragOver(e,Dt,t)}
                      @dragleave=${this._handleEntityDragLeave}
                      @drop=${e=>this._handleAreaEditorDrop(e,Dt,t)}
                    >
                      <div class="entity-item">
                        <div class="handle"><ha-svg-icon .path=${j}></ha-svg-icon></div>
                        <ha-state-icon .stateObj=${i} class="entity-icon"></ha-state-icon>
                        <span class="entity-name">
                          ${this._areaEntityDisplayName(e)}
                          <small>${this._getGroupTitle(o)}</small>
                        </span>
                        <button
                          class="dd-visibility-button ${r?"hidden":""}"
                          type="button"
                          title=${r?this._t("common.show"):this._t("common.hide")}
                          aria-label=${r?this._t("common.show"):this._t("common.hide")}
                          @click=${t=>{t.stopPropagation(),this._toggleEntityVisibility(e,o)}}
                        >
                          <ha-icon icon=${r?"mdi:eye":"mdi:eye-off"}></ha-icon>
                        </button>
                      </div>
                    </div>
                    ${this._getAreaEditorFreeCardsForSlot(c,t+1,d,s).map(e=>this._renderAreaCustomCardEditorRow(e))}
                  `})}
              ${this._renderAreaCustomCardDropZone(`ungrouped:${d.length}`)}
            </div>
          </section>
        `:p.map(e=>{const t=i[e]||[],a=this._config.areas_options?.[this._area]?.groups_options?.[e],o="cover_gates"===e?this._config.areas_options?.[this._area]?.groups_options?.cover_shading:void 0,s=this._config.areas_options?.[this._area]?.groups_options?.[ce(e)],r=a||o||s,n=new Set(r?.hidden||[]),d=r?.order||[],l=[...t].sort((e,t)=>{const i=d.indexOf(e),a=d.indexOf(t);if(-1!==i&&-1!==a)return i-a;if(-1!==i)return-1;if(-1!==a)return 1;const o=this.hass.states[e]?.attributes?.friendly_name||e,s=this.hass.states[t]?.attributes?.friendly_name||t;return o.localeCompare(s)}),h=t.filter(e=>n.has(e)).length,g=h<t.length,m=h>0&&h<t.length,_=!this._collapsedAreaEntityGroups.has(e);return W`
            <div
              class="area-entity-section ${_?"open":""} ${this._draggedEntitySection===e?"dragging":""} ${this._dragOverEntitySection===e?"drag-over":""}"
              @dragover=${t=>this._handleEntitySectionDragOver(t,e)}
              @drop=${t=>this._handleEntitySectionDrop(t,e,p)}
            >
              <div
                class="area-entity-section-card"
                @click=${()=>this._toggleAreaEntityGroup(e)}
              >
                <div
                  class="area-entity-section-header"
                  draggable="true"
                  @dragstart=${t=>this._handleEntitySectionDragStart(t,e,p)}
                  @dragend=${this._handleEntitySectionDragEnd}
                >
                  <div
                    class="area-entity-section-handle"
                    title=${this._t("layout.drag_group")}
                    aria-label=${this._t("layout.drag_group")}
                    @click=${e=>e.stopPropagation()}
                  >
                    <ha-svg-icon .path=${j}></ha-svg-icon>
                  </div>
                  <ha-icon
                    class="area-entity-section-icon"
                    icon=${le[e]}
                    style=${`--area-group-color: ${this._getAreaStrategyGroupColor(e)};`}
                  ></ha-icon>
                  <span class="area-entity-section-title">${this._getGroupTitle(e)}</span>
                  ${this._renderVisibilityButton(g,m,g?this._t("settings.hide_section"):this._t("settings.show_section"),()=>this._setAreaEntityGroupHidden(e,t,g))}
                  <button
                    class="dd-integrated-chevron area-entity-section-chevron"
                    type="button"
                    aria-expanded=${_?"true":"false"}
                    @click=${t=>{t.stopPropagation(),this._toggleAreaEntityGroup(e)}}
                  >
                    <ha-icon icon=${_?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                  </button>
                </div>
                ${_?W`
                  <div class="sortable-container ${this._draggedEntityGroup===e?"dragging":""}">
                ${this._getAreaEditorDomainCardsForSlot(c,e,0,l.length).map(e=>this._renderAreaCustomCardEditorRow(e))}
                ${V(l,e=>e,(t,i)=>{const a=this.hass.states[t],o=n.has(t),s=this._draggedEntityId===t&&this._draggedEntityGroup===e,r=this._dragOverEntityIndex===i&&this._draggedEntityGroup===e&&this._draggedEntityId&&this._draggedEntityId!==t;return W`
                      <div
                        class="sortable-item ${o?"hidden":""} ${s?"dragging":""} ${r?"drag-over":""}"
                        data-entity-id="${t}"
                        data-index="${i}"
                        draggable="true"
                        @dragstart=${i=>this._handleEntityDragStart(i,t,e)}
                        @dragend=${this._handleEntityDragEnd}
                        @dragover=${t=>this._handleAreaEditorDragOver(t,e,i)}
                        @dragleave=${this._handleEntityDragLeave}
                        @drop=${t=>this._handleAreaEditorDrop(t,e,i)}
                      >
                        <div class="entity-item">
                          <div class="handle">
                            <ha-svg-icon .path=${j}></ha-svg-icon>
                          </div>
                          <ha-state-icon
                            .stateObj=${a}
                            class="entity-icon"
                          ></ha-state-icon>
                          <span class="entity-name">
                            ${this._areaEntityDisplayName(t)}
                          </span>
                          <button
                            class="dd-visibility-button ${o?"hidden":""}"
                            type="button"
                            title=${o?this._t("common.show"):this._t("common.hide")}
                            aria-label=${o?this._t("common.show"):this._t("common.hide")}
                            @click=${i=>{i.stopPropagation(),this._toggleEntityVisibility(t,e)}}
                          >
                            <ha-icon icon=${o?"mdi:eye":"mdi:eye-off"}></ha-icon>
                          </button>
                        </div>
                      </div>
                      ${this._getAreaEditorDomainCardsForSlot(c,e,i+1,l.length).map(e=>this._renderAreaCustomCardEditorRow(e))}
                    `})}
                  ${this._renderAreaCustomCardDropZone(`domain:${e}:${l.length}`)}
                  </div>
                `:R}
              </div>
            </div>
          `})}
        ${c.length||this._draggedAreaCustomCardId?this._renderAreaCustomCardPlacement(c,"bottom",this._t("layout.custom_cards_bottom")):R}
        <div class="area-layout-actions">
          ${"grouped"===o?W`
            <button
              class="home-layout-reset area-apply-type-order"
              type="button"
              ?disabled=${!this._areaGroupOrderDirty}
              @click=${this._applyAreaGroupOrderToAllAreas}
            >
              ${this._t("settings.apply_type_order_all_rooms")}
            </button>
          `:R}
          <button
            class="home-layout-reset"
            type="button"
            ?disabled=${h}
            @click=${this._resetAreaEntitySettings}
          >
            ${this._t("settings.reset_layout")}
          </button>
        </div>
        </section>
      </div>
    `}_getHomeSectionsOrder(){return ct(this._config?.settings?.home_sections_order)}_getHiddenHomeSections(){const e=new Set(lt(this._config?.settings?.home_sections_hidden)),t=this._config?.settings;return(t?.home_sections_order||[]).includes("now_playing")||(t?.home_sections_hidden||[]).includes("now_playing")||"off"!==Ue(t?.now_playing_bar)||e.add("now_playing"),e}_getHiddenHomeInformationCards(){return new Set(pt(this._config?.settings?.home_information_cards_hidden))}_getHomeCameraSettings(){if(!this._config||!this.hass)return[];const e=ne(this._config.areas||[],this._config.areas_display,xe(this.hass)),t=new Map(e.map(e=>[e.area_id,e])),i=new Map(e.map((e,t)=>[e.area_id,t])),a=new Map((this._config.devices||[]).map(e=>[e.device_id,e.area_id||""])),o=new Map((this._config.entities||[]).map(e=>[e.entity_id,e])),s=[...new Set([...(this._config.entities||[]).map(e=>e.entity_id),...Object.keys(this.hass.states||{})].filter(e=>e.startsWith("camera.")))].flatMap(e=>{const i=this.hass.states[e],s=this.hass.entities?.[e],r=o.get(e);if(!i||s?.hidden_by||"diagnostic"===s?.entity_category||"config"===s?.entity_category)return[];const n=r?.device_id||s?.device_id||"",d=r?.area_id||s?.area_id||a.get(n)||"",c=t.get(d);return c?[{entityId:e,name:i.attributes?.friendly_name||s?.name||e,areaId:d,areaName:c.name,state:this.hass.formatEntityState(i)}]:[]});s.sort((e,t)=>(i.get(e.areaId)??Number.MAX_SAFE_INTEGER)-(i.get(t.areaId)??Number.MAX_SAFE_INTEGER)||e.name.localeCompare(t.name));const r=this._config.settings?.home_camera_order||[],n=new Map(r.map((e,t)=>[e,t]));return s.sort((e,t)=>{const i=n.get(e.entityId),a=n.get(t.entityId);return void 0!==i||void 0!==a?(i??Number.MAX_SAFE_INTEGER)-(a??Number.MAX_SAFE_INTEGER):0})}_setHomeCameraOrder(e){this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_camera_order:e}})}_toggleHomeCamera(e){if(!this._config)return;const t=new Set(this._config.settings?.home_cameras_hidden||[]);t.has(e)?t.delete(e):t.add(e),this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_cameras_hidden:[...t]}})}_setHomeSectionsOrder(e){if(!this._config)return;const t={...this._config,settings:{...this._config.settings,home_sections_order:ct(e)}};this._fireConfigChanged(t)}_toggleHomeSectionEnabled(e){if(!this._config)return;const t=new Set(this._getHiddenHomeSections());t.has(e)?t.delete(e):t.add(e);const i={...this._config,settings:{...this._config.settings,home_sections_order:this._getHomeSectionsOrder(),home_sections_hidden:lt([...t])}};this._fireConfigChanged(i)}_toggleHomeInformationCardEnabled(e){if(!this._config)return;const t=new Set(this._getHiddenHomeInformationCards());t.has(e)?t.delete(e):t.add(e);const i={...this._config,settings:{...this._config.settings,home_information_cards_hidden:pt([...t])}};this._fireConfigChanged(i)}_renderHomeSectionOrder(){const e=this._getHomeSectionsOrder(),t=this._draggedHomeSection&&this._homeSectionPreviewOrder?this._homeSectionPreviewOrder:e,i=this._getHiddenHomeSections(),a=this._homeSettingsDetail,o=ct(),s=0===i.size&&e.length===o.length&&e.every((e,t)=>e===o[t]),r=e=>"devices"===e?"house_information"===a||"climate"===a||"outdoor_climate"===a:this._homeSectionDetail(e)===a,n=e=>{const t=this._homeSectionDetail(e);t&&(this._homeSettingsDetail=r(e)?"overview":t,this._closeInlinePickers())},d=e=>r(e)?"cameras"===e?this._renderHomeCameraSettings():"custom_cards"===e?this._renderHomeCustomCardsSettings():"scenes"===e?this._renderHomeScenesSettings():"devices"===e?W`<div class="dd-home-house-information">${this._renderHomeInformationCardSettings()}</div>`:R:R;return W`
      <div class="home-layout-section dd-home-flat-layout">
        <div class="home-section-list ${this._draggedHomeSection?"dragging":""}">
          ${t.map((e,t)=>{const a=rt[e],o=!i.has(e),s=this._homeSectionDetail(e),c=r(e),l=this._draggedHomeSection===e,p=this._dragOverHomeSectionIndex===t&&Boolean(this._draggedHomeSection)&&this._draggedHomeSection!==e;return W`
              <div class="dd-home-section-block ${c?"open":""}">
                <div
                  class="home-section-item ${o?"":"disabled"} ${s?"has-detail":""} ${l?"dragging":""} ${p?"drag-over":""}"
                  draggable="true"
                  data-section=${e}
                  data-index=${t}
                  @click=${()=>s&&n(e)}
                  @dragstart=${t=>this._handleHomeSectionDragStart(t,e)}
                  @dragend=${this._handleHomeSectionDragEnd}
                  @dragover=${e=>this._handleHomeSectionDragOver(e,t)}
                  @dragleave=${this._handleHomeSectionDragLeave}
                  @drop=${e=>this._handleHomeSectionDrop(e,t)}
                >
                  <div class="home-section-handle" @click=${e=>e.stopPropagation()}>
                    <ha-svg-icon .path=${j}></ha-svg-icon>
                  </div>
                  <div class="home-section-icon"><ha-icon icon=${a.icon}></ha-icon></div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${this._t(a.labelKey)}</div>
                    <div class="home-section-description">
                      ${this._t(a.descriptionKey)}
                      ${"favorites"===e?W`
                        <button
                          class="dd-settings-inline-link"
                          type="button"
                          @click=${e=>{e.stopPropagation(),this._openSettingsPage("favorites")}}
                        >${this._t("settings.manage_favorites")}</button>
                      `:R}
                    </div>
                  </div>
                  <div class="home-section-actions" @click=${e=>e.stopPropagation()}>
                    <button
                      class="home-section-toggle ${o?"enabled":""}"
                      type="button"
                      title=${o?this._t("settings.hide_section"):this._t("settings.show_section")}
                      aria-label=${o?this._t("settings.hide_section"):this._t("settings.show_section")}
                      aria-pressed=${o?"true":"false"}
                      @click=${()=>this._toggleHomeSectionEnabled(e)}
                    >
                      <ha-icon icon=${o?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon>
                    </button>
                  </div>
                  ${s?W`
                    <button
                      class="dd-integrated-chevron"
                      type="button"
                      aria-expanded=${c?"true":"false"}
                      @click=${t=>{t.stopPropagation(),n(e)}}
                    >
                      <ha-icon icon=${c?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                    </button>
                  `:R}
                </div>
                ${c?W`<div class="dd-home-inline-detail">${d(e)}</div>`:R}
              </div>
            `})}
        </div>
        <button
          class="home-layout-reset"
          type="button"
          ?disabled=${s}
          @click=${this._resetHomeSectionsOrder}
        >
          ${this._t("settings.reset_layout")}
        </button>
      </div>
    `}_getHomeScenes(){return gt(this._config?.settings?.home_scenes)}_setHomeScenes(e){this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_scenes:e}})}_homeSceneName(e){return this.hass?.states[e]?.attributes?.friendly_name||ve(this.hass)[e]?.name||e}_homeSceneAreaName(e){if(!this.hass||!this._config)return;const t=ee(this.hass,this._config,e);return t&&((this._config.areas||[]).find(e=>e.area_id===t)?.name||this.hass.areas?.[t]?.name)||void 0}_homeSceneIcon(e){const t=ht(e)||"scene";return ve(this.hass)[e]?.icon||this.hass?.states[e]?.attributes?.icon||J(t)}_homeSceneTypeLabel(e){return this._t("script"===ht(e)?"scenes.type_script":"scenes.type_scene")}_renderHomeScenesSettings(){const e=this._getHomeScenes();return W`
      <div class="dd-inline-section">
        <div class="dd-inline-action-row dd-inline-action-only">
          <button class="home-custom-card-add" type="button" @click=${()=>{this._homeSceneSearch="",this._showHomeScenePicker=!0}}>
            <ha-icon icon="mdi:plus"></ha-icon>
            ${this._t("scenes.add")}
          </button>
        </div>
        ${e.length?W`
          <div class="dd-flat-sublist">
            ${e.map((t,i)=>{const a=this.hass?.states[t],o=Boolean(a&&Ae(a)),s=this._homeSceneName(t),r=a?[this._homeSceneTypeLabel(t),this._homeSceneAreaName(t),o?this._t("common.unavailable"):""].filter(Boolean).join(" · "):this._t("scenes.missing");return W`
                <div class="dd-flat-subitem-row ${!a||o?"disabled":""}">
                  <div class="home-section-icon"><ha-icon icon=${a?this._homeSceneIcon(t):"mdi:help-circle-outline"}></ha-icon></div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${s}</div>
                    <div class="home-section-description">${r}</div>
                  </div>
                  <div class="home-section-actions">
                    <ha-icon-button .label=${this._t("settings.move_up")} .path=${L} .disabled=${0===i}
                      @click=${()=>this._setHomeScenes(mt(e,t,-1))}></ha-icon-button>
                    <ha-icon-button .label=${this._t("settings.move_down")} .path=${G} .disabled=${i===e.length-1}
                      @click=${()=>this._setHomeScenes(mt(e,t,1))}></ha-icon-button>
                    <ha-icon-button .label=${this._t("common.delete")} .path=${F}
                      @click=${()=>this._setHomeScenes(function(e,t){return gt(e).filter(e=>e!==t)}(e,t))}></ha-icon-button>
                  </div>
                </div>
              `})}
          </div>
        `:W`<div class="dd-empty-state">${this._t("scenes.settings_empty")}</div>`}
        ${this._showHomeScenePicker?this._renderHomeScenePicker(e):R}
      </div>
    `}_renderHomeScenePicker(e){const t=ve(this.hass),i=function(e,t){return Object.keys(e).filter(e=>Boolean(ht(e))&&q(t[e]))}(this.hass?.states||{},t).map(e=>{const t={entityId:e,name:this._homeSceneName(e)},i=this._homeSceneAreaName(e);return i&&(t.areaName=i),t}),a=function(e,t,i,a){const o=new Set(t),s=i.trim().toLocaleLowerCase(a);return e.filter(e=>!o.has(e.entityId)).filter(e=>!s||[e.name,e.areaName||"",e.entityId].some(e=>e.toLocaleLowerCase(a).includes(s))).sort((e,t)=>e.name.localeCompare(t.name,a)||e.entityId.localeCompare(t.entityId))}(i,e,this._homeSceneSearch,xe(this.hass));return W`
      <div class="entity-picker-modal" @click=${e=>{e.target===e.currentTarget&&(this._showHomeScenePicker=!1)}}>
        <div class="entity-picker-content" role="dialog" aria-modal="true" aria-label=${this._t("scenes.picker_title")}>
          <div class="entity-picker-header">
            <h4>${this._t("scenes.picker_title")}</h4>
            <button class="close-button" type="button" title=${this._t("common.close")} @click=${()=>this._showHomeScenePicker=!1}>×</button>
          </div>
          <div class="entity-search">
            <input class="entity-search-input" type="search" placeholder=${this._t("scenes.search")} .value=${this._homeSceneSearch}
              @input=${e=>this._homeSceneSearch=e.target.value} />
          </div>
          <div class="entity-list">
            ${a.map(t=>W`
              <button type="button" class="entity-option" @click=${()=>{this._setHomeScenes(function(e,t){const i=gt(e);return!ht(t)||i.includes(t)?i:[...i,t]}(e,t.entityId)),this._showHomeScenePicker=!1}}>
                <ha-icon class="entity-icon" icon=${this._homeSceneIcon(t.entityId)}></ha-icon>
                <span class="entity-name">${t.name}</span>
                <span class="entity-id">${[this._homeSceneTypeLabel(t.entityId),t.areaName].filter(Boolean).join(" · ")}</span>
              </button>
            `)}
            ${a.length?R:W`<div class="entity-picker-hint empty">${this._t("scenes.no_results")}</div>`}
          </div>
        </div>
      </div>
    `}_getHomeCustomCards(){const e=this._config?.home_custom_cards;return Array.isArray(e)?e.filter(e=>Boolean(e?.id)&&Boolean(e?.card)&&"object"==typeof e.card&&"string"==typeof e.card.type):[]}_createHomeCustomCardId(){return`home-card-${Date.now()}-${Math.random().toString(36).slice(2,8)}`}_homeCustomCardTitle(e){const t=e.card,i="string"==typeof t.entity?t.entity:"";return t.title||t.name||this.hass?.states?.[i]?.attributes?.friendly_name||i||t.type.replace(/^custom:/,"")}_homeCustomCardSubtitle(e){return e.card.type.replace(/^custom:/,"")}_updateHomeCustomCards(e){this._config&&this._fireConfigChanged({...this._config,home_custom_cards:e})}_addHomeCustomCard(){Et(this,{areaName:this._t("home_section.custom_cards.label"),onSave:e=>{this._updateHomeCustomCards([...this._getHomeCustomCards(),{id:this._createHomeCustomCardId(),card:e}])}})}_editHomeCustomCard(e){const t=this._getHomeCustomCards(),i=t.find(t=>t.id===e);i&&Et(this,{card:i.card,areaName:this._t("home_section.custom_cards.label"),onSave:i=>{this._updateHomeCustomCards(t.map(t=>t.id===e?{...t,card:i}:t))}})}_deleteHomeCustomCard(e){confirm(this._t("layout.delete_card_confirm"))&&this._updateHomeCustomCards(this._getHomeCustomCards().filter(t=>t.id!==e))}_renderHomeCustomCardsSettings(){const e=this._getHomeCustomCards(),t=(e,t)=>{this._draggedHomeCustomCard=t,e.dataTransfer?.setData("text/plain",t),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")},i=(e,t)=>{e.preventDefault();const i=this._draggedHomeCustomCard||e.dataTransfer?.getData("text/plain");this._draggedHomeCustomCard=void 0;const a=this._getHomeCustomCards(),o=a.findIndex(e=>e.id===i);if(o<0||o===t)return;const s=[...a],[r]=s.splice(o,1);r&&(s.splice(t,0,r),this._updateHomeCustomCards(s))};return W`
      <div class="dd-inline-section">
        <div class="dd-inline-action-row dd-inline-action-only">
          <button class="home-custom-card-add" type="button" @click=${this._addHomeCustomCard}>
            <ha-icon icon="mdi:plus"></ha-icon>
            ${this._t("common.add")}
          </button>
        </div>
        ${e.length?W`
          <div class="dd-flat-sublist">
            ${e.map((e,a)=>W`
              <div
                class="dd-flat-subitem-row dd-draggable-subitem"
                draggable="true"
                @dragstart=${i=>t(i,e.id)}
                @dragend=${()=>{this._draggedHomeCustomCard=void 0}}
                @dragover=${e=>e.preventDefault()}
                @drop=${e=>i(e,a)}
              >
                <div class="home-section-handle"><ha-svg-icon .path=${j}></ha-svg-icon></div>
                <div class="home-section-icon"><ha-icon icon="mdi:cards-outline"></ha-icon></div>
                <div class="home-section-copy">
                  <div class="home-section-title">${this._homeCustomCardTitle(e)}</div>
                  <div class="home-section-description">${this._homeCustomCardSubtitle(e)}</div>
                </div>
                <div class="dd-inline-actions">
                  <button type="button" class="dd-icon-action" aria-label=${this._t("common.edit")} @click=${()=>this._editHomeCustomCard(e.id)}>
                    <ha-icon icon="mdi:pencil"></ha-icon>
                  </button>
                  <button type="button" class="dd-icon-action" aria-label=${this._t("common.delete")} @click=${()=>this._deleteHomeCustomCard(e.id)}>
                    <ha-icon icon="mdi:delete"></ha-icon>
                  </button>
                </div>
              </div>
            `)}
          </div>
        `:W`<div class="dd-empty-state">${this._t("settings.no_home_custom_cards")}</div>`}
      </div>
    `}_getExcludedHomeClimateAreas(){return new Set(this._config?.settings?.home_climate_excluded_areas||[])}_toggleHomeClimateArea(e,t){if(!this._config)return;const i=this._getExcludedHomeClimateAreas();t?i.delete(e):i.add(e),this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_climate_excluded_areas:[...i]}})}_getHomeOutdoorClimateAreas(){return new Set(this._config?.settings?.home_outdoor_climate_areas||[])}_toggleHomeOutdoorClimateArea(e,t){if(!this._config)return;const i=this._getHomeOutdoorClimateAreas();t?i.add(e):i.delete(e),this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_outdoor_climate_areas:[...i]}})}_renderHomeClimateAreaSettings(){if(!this._config||!this.hass)return R;const e=this._getExcludedHomeClimateAreas(),t=this._getHomeOutdoorClimateAreas(),i=new Set(this._config.areas_display?.hidden||[]),a=ne(Object.values(this.hass.areas||{}),{...this._config.areas_display,hidden:[]},xe(this.hass)).filter(e=>!i.has(e.area_id));return W`
      <div class="home-info-card-section home-climate-area-settings dd-climate-area-settings">
        <p class="dd-inline-description dd-climate-description">${this._t("settings.home_climate_areas_description")}</p>
        <div class="home-info-card-list">
          ${a.map(i=>{const a=t.has(i.area_id),o=!a&&!e.has(i.area_id);return W`
              <div class="home-info-card-item ${o?"enabled":"disabled"}">
                <div class="home-section-icon"><ha-icon icon=${i.icon||"mdi:floor-plan"}></ha-icon></div>
                <div class="home-section-copy">
                  <div class="home-section-title">${i.name}</div>
                  ${a?W`<div class="home-section-description">${this._t("settings.home_climate_area_outdoor")}</div>`:R}
                </div>
                <div class="dd-climate-actions">
                  <button
                    class="home-section-toggle ${o?"enabled":""}"
                    type="button"
                    ?disabled=${a}
                    title=${o?this._t("common.hide"):this._t("common.show")}
                    aria-label=${o?this._t("common.hide"):this._t("common.show")}
                    aria-pressed=${o?"true":"false"}
                    @click=${()=>!a&&this._toggleHomeClimateArea(i.area_id,!o)}
                  >
                    <ha-icon icon=${o?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon>
                  </button>
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_renderHomeOutdoorClimateAreaSettings(){if(!this._config||!this.hass)return R;const e=this._getHomeOutdoorClimateAreas(),t=ne(Object.values(this.hass.areas||{}),{...this._config.areas_display,hidden:[]},xe(this.hass));return W`
      <div class="home-info-card-section home-climate-area-settings dd-climate-area-settings">
        <p class="dd-inline-description dd-climate-description">${this._t("settings.home_outdoor_climate_areas_description")}</p>
        <div class="home-info-card-list">
          ${t.map(t=>{const i=e.has(t.area_id);return W`
              <div class="home-info-card-item ${i?"enabled":"disabled"}">
                <div class="home-section-icon"><ha-icon icon=${t.icon||"mdi:floor-plan"}></ha-icon></div>
                <div class="home-section-copy"><div class="home-section-title">${t.name}</div></div>
                <div class="dd-climate-actions">
                  <button
                    class="home-section-toggle ${i?"enabled":""}"
                    type="button"
                    title=${i?this._t("common.hide"):this._t("common.show")}
                    aria-label=${i?this._t("common.hide"):this._t("common.show")}
                    aria-pressed=${i?"true":"false"}
                    @click=${()=>this._toggleHomeOutdoorClimateArea(t.area_id,!i)}
                  >
                    <ha-icon icon=${i?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon>
                  </button>
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_renderHomeInformationCardSettings(){const e=this._getHiddenHomeInformationCards(),t=e=>{this._homeSettingsDetail=this._homeSettingsDetail===e?"house_information":e,this._closeInlinePickers()};return W`
      <div class="dd-inline-section">
        <div class="dd-flat-sublist">
          ${nt.map(i=>{const a=dt[i],o=!e.has(i),s=(e=>"climate"===e||"outdoor_climate"===e?e:void 0)(i),r=!!s&&this._homeSettingsDetail===s;return W`
              <div class="dd-flat-subitem ${r?"open":""}">
                <div class="dd-flat-subitem-row ${s?"has-detail":""}" @click=${()=>s&&t(s)}>
                  <div class="home-section-icon"><ha-icon icon=${a.icon}></ha-icon></div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${this._t(a.labelKey)}</div>
                  </div>
                  <div class="home-info-card-actions" @click=${e=>e.stopPropagation()}>
                    <button
                      class="home-section-toggle ${o?"enabled":""}"
                      type="button"
                      title=${o?this._t("settings.hide_section"):this._t("settings.show_section")}
                      aria-label=${o?this._t("settings.hide_section"):this._t("settings.show_section")}
                      aria-pressed=${o?"true":"false"}
                      @click=${()=>this._toggleHomeInformationCardEnabled(i)}
                    >
                      <ha-icon icon=${o?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon>
                    </button>
                  </div>
                  ${s?W`
                    <button
                      class="dd-integrated-chevron"
                      type="button"
                      aria-expanded=${r?"true":"false"}
                      @click=${e=>{e.stopPropagation(),t(s)}}
                    >
                      <ha-icon icon=${r?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                    </button>
                  `:R}
                </div>
                ${"climate"===s&&r?W`<div class="dd-flat-subdetail">${this._renderHomeClimateAreaSettings()}</div>`:R}
                ${"outdoor_climate"===s&&r?W`<div class="dd-flat-subdetail">${this._renderHomeOutdoorClimateAreaSettings()}</div>`:R}
              </div>
            `})}
        </div>
      </div>
    `}_renderHomeCameraSettings(){const e=this._getHomeCameraSettings(),t=new Set(this._config?.settings?.home_cameras_hidden||[]),i=0===(this._config?.settings?.home_camera_order||[]).length&&0===t.size;return W`
      <div class="dd-inline-section">
        ${e.length?W`
          <div class="dd-flat-sublist">
            ${e.map((e,i)=>{const a=!t.has(e.entityId),o=["unavailable","unknown"].includes(String(this.hass?.states[e.entityId]?.state||"").toLowerCase()),s=this._dragOverHomeCameraIndex===i&&Boolean(this._draggedHomeCamera)&&this._draggedHomeCamera!==e.entityId;return W`
                <div
                  class="dd-flat-subitem-row dd-draggable-subitem ${s?"drag-over":""}"
                  draggable="true"
                  @dragstart=${t=>this._handleHomeCameraDragStart(t,e.entityId)}
                  @dragend=${this._handleHomeCameraDragEnd}
                  @dragover=${e=>this._handleHomeCameraDragOver(e,i)}
                  @dragleave=${this._handleHomeCameraDragLeave}
                  @drop=${e=>this._handleHomeCameraDrop(e,i)}
                >
                  <div class="home-section-handle"><ha-svg-icon .path=${j}></ha-svg-icon></div>
                  <div class="home-section-icon"><ha-icon icon="mdi:cctv"></ha-icon></div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${e.name}</div>
                    <div class="home-section-description">${e.areaName} · ${o?this._t("common.unavailable"):e.state}</div>
                  </div>
                  <div class="home-info-card-actions">
                    <button
                      class="home-section-toggle ${a?"enabled":""}"
                      type="button"
                      title=${a?this._t("settings.hide_section"):this._t("settings.show_section")}
                      aria-label=${a?this._t("settings.hide_section"):this._t("settings.show_section")}
                      aria-pressed=${a?"true":"false"}
                      @click=${()=>this._toggleHomeCamera(e.entityId)}
                    >
                      <ha-icon icon=${a?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon>
                    </button>
                  </div>
                </div>
              `})}
          </div>
          <button
            class="home-layout-reset"
            type="button"
            ?disabled=${i}
            @click=${this._resetHomeCameraSettings}
          >
            ${this._t("settings.reset_camera_cards")}
          </button>
        `:W`<div class="dd-empty-state">${this._t("settings.home_camera_cards_empty")}</div>`}
      </div>
    `}_toggleExpandedDeviceType(e){const t=new Set(this._expandedDeviceTypes);t.has(e)?t.delete(e):t.add(e),this._expandedDeviceTypes=t}_visibilityIcon(e,t=!1){return e?t?"mdi:eye-minus-outline":"mdi:eye-outline":"mdi:eye-off-outline"}_renderVisibilityButton(e,t,i,a){return W`
      <button
        class="dd-visibility-button ${e?"visible":"hidden"} ${t?"partial":""}"
        type="button"
        title=${i}
        aria-label=${i}
        aria-pressed=${e?"true":"false"}
        @click=${e=>{e.stopPropagation(),a()}}
      >
        <ha-icon icon=${this._visibilityIcon(e,t)}></ha-icon>
      </button>
    `}_renderDeviceVisibilitySettings(){const e=this._getDeviceTypeOptions();if(!e.length)return R;const t=new Map(this._getDeviceVisibilityGroups().map(e=>[e.key,e])),i=this._getHiddenDeviceTypes(),a=this._getHiddenDeviceEntityIds(),o=0===i.size&&0===a.size&&0===this._getHiddenDeviceIds().size;return W`
      <section class="device-visibility-section">
        <div class="device-types-header">
          <div>
            <h4>${this._t("settings.devices_page_types")}</h4>
            <p>${this._t("settings.devices_page_types_description")}</p>
          </div>
        </div>

        <div class="device-admission-groups">
          ${e.map(e=>{const o=t.get(e.key),s=!i.has(e.key),r=[...new Set((o?.devices||[]).flatMap(e=>e.entityIds))],n=r.length||e.count,d=r.filter(e=>a.has(e)).length,c=s?Math.max(0,n-d):0,l=s&&d>0&&d<n,p=Boolean(o?.areas.length)&&this._expandedDeviceTypes.has(e.key);return W`
              <section
                class="device-type-panel ${p?"open":""} ${s?"":"disabled"}"
                style=${`--device-type-color: ${e.color};`}
              >
                <div
                  class="device-type-panel-row expandable"
                  @click=${()=>this._toggleExpandedDeviceType(e.key)}
                >
                  <span class="device-type-icon small"><ha-icon icon=${e.icon}></ha-icon></span>
                  <span class="device-type-heading">
                    <strong>${e.label}</strong>
                    <small>${this._t("settings.visible_count",{visible:c,total:n})}</small>
                  </span>
                  ${this._renderVisibilityButton(s,l,s?this._t("settings.hide_type"):this._t("settings.show_type"),()=>this._setDeviceTypeVisible(e.key,!s))}
                  <button
                    class="dd-integrated-chevron device-type-chevron"
                    type="button"
                    aria-expanded=${p?"true":"false"}
                    @click=${t=>{t.stopPropagation(),this._toggleExpandedDeviceType(e.key)}}
                  >
                    <ha-icon icon=${p?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
                  </button>
                </div>

                ${p&&o?W`
                  <div class="device-admission-panel">
                    ${o.areas.map(e=>{const t=[...new Set(e.devices.flatMap(e=>e.entityIds))],i=t.filter(e=>a.has(e)).length,s=i<t.length,r=i>0&&i<t.length;return W`
                        <section class="device-admission-area">
                          <div class="device-admission-area-header">
                            <span class="device-type-heading device-area-heading">
                              <strong>${e.areaName}</strong>
                              <small>${this._t("settings.visible_count",{visible:t.length-i,total:t.length})}</small>
                            </span>
                            ${this._renderVisibilityButton(s,r,s?this._t("settings.hide_area"):this._t("settings.show_area"),()=>this._setEntitiesHidden(t,s))}
                          </div>
                          <div class="device-admission-device-list">
                            ${e.devices.flatMap(e=>e.entityIds.map(t=>this._renderDeviceEntityVisibilityRow(t,e,o)))}
                          </div>
                        </section>
                      `})}
                  </div>
                `:R}
              </section>
            `})}
        </div>
        <button
          class="home-layout-reset area-list-reset"
          type="button"
          ?disabled=${o}
          @click=${this._resetDeviceVisibility}
        >
          ${this._t("settings.reset_layout")}
        </button>
      </section>
    `}_showEntityInfo(e){if(!e||!this.hass?.states?.[e])return;(document.querySelector("home-assistant")||this).dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_entityVisibilityName(e){const t=this.hass?.states?.[e];return t?.attributes?.friendly_name||this.hass?.entities?.[e]?.name||e}_renderDeviceEntityVisibilityRow(e,t,i){const a=!this._getHiddenDeviceEntityIds().has(e)&&!this._getHiddenDeviceIds().has(t.deviceId),o=Boolean(this.hass?.states?.[e]);return W`
      <div
        class="device-admission-device ${a?"visible":"hidden"} ${o?"interactive":""}"
        role=${o?"button":"group"}
        tabindex=${o?"0":"-1"}
        @click=${()=>o&&this._showEntityInfo(e)}
        @keydown=${t=>{!o||"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._showEntityInfo(e))}}
      >
        <div class="device-type-icon"><ha-icon icon=${i.icon}></ha-icon></div>
        <div class="device-admission-copy">
          <div class="device-type-name">${this._entityVisibilityName(e)}</div>
        </div>
        ${this._renderVisibilityButton(a,!1,a?this._t("common.hide"):this._t("common.show"),()=>this._setEntityHidden(e,a))}
      </div>
    `}_getDeviceVisibilityGroups(){if(!this.hass||!this._config)return[];const e=this._getAllDevicesById(),t=this._getHiddenDeviceIds(),i=new Intl.Collator(xe(this.hass),{numeric:!0,sensitivity:"base"}),a=ne(this._config.areas||[],{...this._config.areas_display,hidden:[]},xe(this.hass)),o=new Map(a.map((e,t)=>[e.area_id,t])),s=(e,t)=>(o.get(e.areaId)??Number.MAX_SAFE_INTEGER)-(o.get(t.areaId)??Number.MAX_SAFE_INTEGER)||i.compare(e.areaName,t.areaName),r=new Map;(this._config.entities||[]).forEach(e=>{r.set(e.entity_id,{entityId:e.entity_id,deviceId:e.device_id,areaId:e.area_id})}),Object.values(this.hass.entities||{}).forEach(e=>{r.set(e.entity_id,{entityId:e.entity_id,deviceId:e.device_id,areaId:e.area_id})});const n=new Map;return r.forEach(t=>{const i=t.deviceId;if(!i||!e.has(i))return;const a=e.get(i),o=this._deviceVisibilityArea(a,[t.entityId]);if(!o||!this._isDeviceManagedEntity(t.entityId,o.areaId))return;const s=this._deviceTypeKeyForEntityId(t.entityId);if(!s||"person"===s)return;let r=n.get(s);r||(r=new Map,n.set(s,r));let d=r.get(i);d||(d=new Set,r.set(i,d)),d.add(t.entityId)}),[...n.entries()].map(([a,o])=>{const r=[...o.entries()].map(([a,o])=>{const s=e.get(a),r=this._deviceVisibilityArea(s,[...o]);if(r)return{deviceId:a,name:s.name||a,areaId:r.areaId,areaName:r.areaName,entityCount:o.size,entityIds:[...o].sort((e,t)=>i.compare(e,t)),hidden:t.has(a)}}).filter(e=>Boolean(e)).sort((e,t)=>s(e,t)||i.compare(e.name,t.name)),n=new Map;r.forEach(e=>{let t=n.get(e.areaId);t||(t={areaId:e.areaId,areaName:e.areaName,devices:[]},n.set(e.areaId,t)),t.devices.push(e)});const d=[...n.values()].sort(s);return{key:a,label:this._deviceTypeName(a),icon:this._deviceTypeIcon(a),color:this._deviceTypeColor(a),devices:r,areas:d}}).filter(e=>e.devices.length>0).sort((e,t)=>i.compare(e.label,t.label))}_getAllDevicesById(){const e=new Map;return(this._config?.devices||[]).forEach(t=>{e.set(t.device_id,t)}),Object.values(this.hass?.devices||{}).forEach(t=>{t?.id&&!e.has(t.id)&&e.set(t.id,{device_id:t.id,name:t.name_by_user||t.name||t.id,area_id:t.area_id,created_at:t.created_at})}),e}_isDeviceManagedEntity(e,t){const i=this.hass?.entities?.[e],a=this.hass?.states?.[e];return!(!a||i?.hidden_by||i?.disabled_by||"diagnostic"===i?.entity_category||"config"===i?.entity_category)&&((!t||!this._isEntityHiddenInAreaOptions(t,e))&&!!e.includes("."))}_deviceVisibilityArea(e,t){const i=this.hass?.devices?.[e.device_id],a=new Set(this._config?.areas_display?.hidden||[]),o=e=>{if(!e||a.has(e))return;const t=this._config?.areas?.find(t=>t.area_id===e);return t?{areaId:t.area_id,areaName:t.name}:void 0},s=o(e.area_id||i?.area_id);if(s)return s;for(const e of t){const t=this._config?.entities?.find(t=>t.entity_id===e),i=o(t?.area_id||this.hass?.entities?.[e]?.area_id);if(i)return i}return!1===this._config?.settings?.hide_unavailable_entities_on_devices?{areaId:"__unassigned__",areaName:this._t("settings.unassigned_area")}:void 0}_getHiddenDeviceEntityIds(){return new Set((this._config?.device_admission?.hidden_entities||[]).filter(e=>"string"==typeof e&&e.length>0))}_setEntityHidden(e,t){this._setEntitiesHidden([e],t)}_setEntitiesHidden(e,t){if(!this._config)return;const i=this._getHiddenDeviceEntityIds();e.forEach(e=>{e&&(t?i.add(e):i.delete(e))}),this._fireConfigChanged({...this._config,device_admission:{...this._config.device_admission,hidden_entities:[...i].sort()}})}_getHiddenDeviceIds(){return new Set((this._config?.device_admission?.hidden_devices||[]).filter(e=>"string"==typeof e&&e.length>0))}_getDeviceTypeOptions(){return this._getDeviceVisibilityGroups().map(e=>({key:e.key,label:e.label,icon:e.icon,color:e.color,count:e.devices.reduce((e,t)=>e+t.entityCount,0)})).sort((e,t)=>e.label.localeCompare(t.label,xe(this.hass)))}_isEntityHiddenInAreaOptions(e,t){const i=this._config?.areas_options?.[e];return!!i?.groups_options&&Object.values(i.groups_options).some(e=>e.hidden?.includes(t))}_deviceTypeKeyForEntityId(e){const t=e.split(".")[0];if(t){if("binary_sensor"===t){const t=this.hass?.states?.[e]?.attributes?.device_class;return t?`binary_sensor.${t}`:"binary_sensor"}return t}}_deviceTypeName(e){return e.startsWith("binary_sensor.")?X(this.hass,e.slice(14)):K(this.hass,e)}_deviceTypeIcon(e){return"person"===e?"mdi:account-group":e.startsWith("binary_sensor.")?Y("binary_sensor",e.slice(14)):J(e)}_deviceTypeColor(e){return e.startsWith("binary_sensor.")?pe("binary_sensor",e.slice(14)):pe(e)}_getHiddenDeviceTypes(){return new Set((this._config?.settings?.hidden_device_types||[]).filter(e=>"string"==typeof e&&e.length>0))}_setDeviceTypeVisible(e,t){if(!this._config)return;const i=this._getHiddenDeviceTypes();t?i.delete(e):i.add(e);const a={...this._config,settings:{...this._config.settings,hidden_device_types:[...i].sort()}};this._fireConfigChanged(a)}_getGroupTitle(e){const t=xe(this.hass).toLowerCase().startsWith("de");return"cover_openings"===e?t?"Fenster & Türen":"Windows & doors":"cover_shading"===e?t?"Beschattung":"Shading":"cover_gates"===e?t?"Tore":"Gates":"motion"===e?t?"Bewegung & Präsenz":"Motion & presence":"safety"===e?t?"Sicherheit & Warnmelder":"Safety & alarms":K(this.hass,e)}_sortEntityIds(e,t){const i=new Map(t.map((e,t)=>[e,t]));return[...e].sort((e,t)=>{const a=i.get(e),o=i.get(t);if(void 0!==a&&void 0!==o)return a-o;if(void 0!==a)return-1;if(void 0!==o)return 1;const s=this.hass?.states[e]?.attributes?.friendly_name||e,r=this.hass?.states[t]?.attributes?.friendly_name||t;return s.localeCompare(r,xe(this.hass))})}_getAreaStrategyGroupColor(e){return"cover_openings"===e?pe("binary_sensor","opening"):"cover_shading"===e||"cover_gates"===e?pe("cover"):"motion"===e?pe("binary_sensor","motion"):"safety"===e?pe("binary_sensor","smoke"):pe(e)}_setAreaEntityLayout(e,t=[],i=new Map){if(!this._config||!this._area)return;"grouped"===e&&(this._collapsedAreaEntityGroups=new Set(se));const a=this._config.areas_options?.[this._area],o=(a?.custom_cards||[]).map(a=>{if("grouped"!==e||!a.placement.startsWith("ungrouped:"))return a;const o=Math.min(t.length,Math.max(0,Number(a.placement.slice(10))||0));if(o>=t.length)return{...a,placement:"bottom"};const s=t[o],r=s?i.get(s):void 0;if(!r)return{...a,placement:"bottom"};const n=t.slice(0,o).filter(e=>i.get(e)===r).length;return{...a,placement:`domain:${r}:${n}`}});this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...a,entity_layout:e,custom_cards:o}}})}_saveUngroupedEntityOrder(e){this._config&&this._area&&this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],entity_order:e}}})}_getAreaGroupedEntitiesWithoutFiltering(e,t){const i=Object.fromEntries(se.map(e=>[e,[]]));return e.forEach(e=>{const a=e.entity_id;if(!t.states[a])return;const o=t.entities?.[a];if(o?.hidden_by||"diagnostic"===o?.entity_category||"config"===o?.entity_category)return;const s=he(a,t);s&&i[s].push(a)}),i}_handleHomeSectionDragStart(e,t){if(this._draggedHomeSection=t,this._homeSectionPreviewOrder=[...this._getHomeSectionsOrder()],e.dataTransfer){e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t);const i=document.createElement("div");i.style.position="fixed",i.style.left="-10000px",i.style.top="-10000px",i.style.width="1px",i.style.height="1px",i.style.opacity="0",document.body.appendChild(i),e.dataTransfer.setDragImage(i,0,0),window.requestAnimationFrame(()=>i.remove())}}_handleHomeSectionDragOver(e,t){e.preventDefault();const i=this._draggedHomeSection;if(i){const e=[...this._homeSectionPreviewOrder||this._getHomeSectionsOrder()],a=e.indexOf(i);if(-1!==a&&a!==t){const[i]=e.splice(a,1);e.splice(t,0,i),this._homeSectionPreviewOrder=e}}this._dragOverHomeSectionIndex=t,e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_handleHomeSectionDrop(e,t){e.preventDefault();const i=this._draggedHomeSection;if(!i)return;const a=this._getHomeSectionsOrder(),o=this._homeSectionPreviewOrder;if(o&&o.length===a.length&&o.some((e,t)=>e!==a[t]))this._setHomeSectionsOrder(o);else{const e=a.indexOf(i);if(-1!==e&&e!==t){const i=[...a],[o]=i.splice(e,1);i.splice(t,0,o),this._setHomeSectionsOrder(i)}}this._handleHomeSectionDragEnd()}_handleHomeCameraDragStart(e,t){this._draggedHomeCamera=t,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleHomeCameraDragOver(e,t){e.preventDefault(),this._dragOverHomeCameraIndex=t,e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_handleHomeCameraDrop(e,t){e.preventDefault();const i=this._draggedHomeCamera;if(!i)return;const a=this._getHomeCameraSettings().map(e=>e.entityId),o=a.indexOf(i);if(-1===o||o===t)return void this._handleHomeCameraDragEnd();const[s]=a.splice(o,1);a.splice(t,0,s),this._setHomeCameraOrder(a),this._handleHomeCameraDragEnd()}_setAreaSortMode(e){if(!this._config||!this.hass)return;const t=this._config.areas_display?.order||[],i=Object.values(this.hass.areas||{}).map(e=>e.area_id),a="custom"===e&&0===t.length?i:t;this._fireConfigChanged({...this._config,areas_display:{...this._config.areas_display,sort_mode:e,order:a}})}_handleAreaDragStart(e,t){if(this._draggedAreaId=t,this._areaPreviewOrder=ne(Object.values(this.hass?.areas||{}),{...this._config?.areas_display,hidden:[]},xe(this.hass)).map(e=>e.area_id),e.dataTransfer){e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t);const i=document.createElement("div");i.style.position="fixed",i.style.left="-10000px",i.style.top="-10000px",i.style.width="1px",i.style.height="1px",i.style.opacity="0",document.body.appendChild(i),e.dataTransfer.setDragImage(i,0,0),window.requestAnimationFrame(()=>i.remove())}}_handleAreaDragEnd(){this._draggedAreaId=void 0,this._dragOverIndex=void 0,this._areaPreviewOrder=void 0}_handleAreaDragOver(e,t){e.preventDefault();const i=this._draggedAreaId;if(i){const e=[...this._areaPreviewOrder||[]],a=e.indexOf(i);if(-1!==a&&a!==t){const[i]=e.splice(a,1);e.splice(t,0,i),this._areaPreviewOrder=e}}e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOverIndex=t}_handleAreaDragLeave(e){const t=e.currentTarget,i=e.relatedTarget;t?.contains(i)||(this._dragOverIndex=void 0)}_handleAreaDrop(e,t){e.preventDefault(),this._draggedAreaId&&this._config&&"custom"===re(this._config.areas_display)&&(this._areaPreviewOrder?.length&&this._fireConfigChanged({...this._config,areas_display:{...this._config.areas_display,order:[...this._areaPreviewOrder]}}),this._handleAreaDragEnd())}_handleAreaCustomCardDragStart(e,t){this._draggedAreaCustomCardId=t,this._dragOverAreaCustomCardTarget=void 0,this._handleEntityDragEnd(),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",`custom-card:${t}`))}_handleAreaCustomCardDragOver(e,t,i){this._draggedAreaCustomCardId&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOverAreaCustomCardTarget={placement:t,index:i})}_handleAreaCustomCardDrop(e,t,i){this._draggedAreaCustomCardId&&(e.preventDefault(),e.stopPropagation(),this._moveAreaEditorCustomCard(this._draggedAreaCustomCardId,t,i),this._handleAreaCustomCardDragEnd())}_moveAreaEditorCustomCard(e,t,i){if(!this._config||!this._area)return;const a=[...this._getAreaEditorCustomCards()],o=a.findIndex(t=>t.id===e);if(o<0)return;const s=a[o];if(!s)return;const r=a.slice(0,o).filter(e=>e.placement===s.placement).length,[n]=a.splice(o,1);if(!n)return;let d=i;n.placement===t&&r<i&&(d=Math.max(0,i-1)),n.placement=t;let c=0,l=a.length;for(let e=0;e<a.length;e+=1)if(a[e]?.placement===t){if(c>=d){l=e;break}c+=1}a.splice(l,0,n),this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],custom_cards:a}}})}_areaGroupOrderIndex(e,t){const i=t.indexOf(e);if(i>=0)return i;if("cover_gates"===e){const e=t.indexOf("cover_shading");if(e>=0)return e}const a=t.indexOf(ce(e));return a>=0?a:void 0}_sortAreaStrategyGroups(e){const t=this._config?.areas_options?.[this._area||""]?.group_order||[];return t.length?e.map((e,t)=>({group:e,fallbackIndex:t})).sort((e,i)=>{const a=this._areaGroupOrderIndex(e.group,t),o=this._areaGroupOrderIndex(i.group,t);return void 0!==a&&void 0!==o?a!==o?a-o:e.fallbackIndex-i.fallbackIndex:void 0!==a?-1:void 0!==o?1:e.fallbackIndex-i.fallbackIndex}).map(({group:e})=>e):[...e]}_saveEntitySectionOrder(e){if(!this._config||!this._area)return;const t=[...e,...se.filter(t=>!e.includes(t))];this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],group_order:t}}}),this._areaGroupOrderDirty=!0}_toggleAreaEntityGroup(e){const t=new Set(this._collapsedAreaEntityGroups);t.has(e)?t.delete(e):t.add(e),this._collapsedAreaEntityGroups=t}_setAreaEntityGroupHidden(e,t,i){if(!this._config||!this._area)return;const a=this._config.areas_options?.[this._area]?.groups_options?.[e],o="cover_gates"===e?this._config.areas_options?.[this._area]?.groups_options?.cover_shading:void 0,s=this._config.areas_options?.[this._area]?.groups_options?.[ce(e)],r=a||o||s,n=new Set((r?.hidden||[]).filter(e=>t.includes(e)));t.forEach(e=>{i?n.add(e):n.delete(e)}),this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],groups_options:{...this._config.areas_options?.[this._area]?.groups_options,[e]:{...r,hidden:[...n]}}}}})}_handleEntitySectionDragStart(e,t,i){e.stopPropagation(),this._handleEntityDragEnd(),this._handleAreaCustomCardDragEnd(),this._draggedEntitySection=t,this._dragOverEntitySection=void 0,this._areaGroupPreviewOrder=[...i],e.dataTransfer?.setData("text/plain",t),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}_handleEntitySectionDragOver(e,t){const i=this._draggedEntitySection;if(!i)return;e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move");const a=[...this._areaGroupPreviewOrder||[]],o=a.indexOf(i),s=a.indexOf(t);if(o>=0&&s>=0&&o!==s){const[e]=a.splice(o,1);e&&a.splice(s,0,e),this._areaGroupPreviewOrder=a}this._dragOverEntitySection=t}_handleEntitySectionDrop(e,t,i){if(!this._draggedEntitySection)return;e.preventDefault(),e.stopPropagation();const a=this._areaGroupPreviewOrder?.length?[...this._areaGroupPreviewOrder]:[...i];this._saveEntitySectionOrder(a),this._handleEntitySectionDragEnd()}_handleAreaEditorDragOver(e,t,i){if(this._draggedAreaCustomCardId){const a=t===Dt?`ungrouped:${i}`:`domain:${t}:${i}`;return void this._handleAreaCustomCardDragOver(e,a,Number.POSITIVE_INFINITY)}this._handleEntityDragOver(e,t,i)}_handleAreaEditorDrop(e,t,i){if(this._draggedAreaCustomCardId){const a=t===Dt?`ungrouped:${i}`:`domain:${t}:${i}`;return void this._handleAreaCustomCardDrop(e,a,Number.POSITIVE_INFINITY)}this._handleEntityDrop(e,t,i)}_handleEntityDragStart(e,t,i){this._handleAreaCustomCardDragEnd(),this._draggedEntityId=t,this._draggedEntityGroup=i,e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleEntityDragEnd(){this._draggedEntityId=void 0,this._draggedEntityGroup=void 0,this._dragOverEntityIndex=void 0}_handleEntityDragOver(e,t,i){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._draggedEntityGroup===t&&(this._dragOverEntityIndex=i)}_handleEntityDragLeave(e){e.target.classList.contains("sortable-item")&&(this._dragOverEntityIndex=void 0)}_handleEntityDrop(e,t,i){if(e.preventDefault(),!this._draggedEntityId||!this._config||!this._area||this._draggedEntityGroup!==t)return;const a=[],o=new Set;if(this._config.entities){const e=new Set;this._config.devices&&this._config.devices.forEach(t=>{t.area_id===this._area&&e.add(t.device_id)}),this._config.entities.forEach(t=>{(t.area_id===this._area||t.device_id&&e.has(t.device_id))&&(a.push({entity_id:t.entity_id}),o.add(t.entity_id))})}const s=this._getAreaGroupedEntitiesWithoutFiltering(a,this.hass),r=t===Dt,n=r?se.flatMap(e=>s[e]||[]):s[t]||[],d=this._config.areas_options?.[this._area]?.groups_options?.[t],c="cover_gates"===t?this._config.areas_options?.[this._area]?.groups_options?.cover_shading:void 0,l=se.includes(t)?ce(t):void 0,p=l?this._config.areas_options?.[this._area]?.groups_options?.[l]:void 0,h=d||c||p,g=r?this._config.areas_options?.[this._area]?.entity_order||[]:h?.order||[],m=[...n].sort((e,t)=>{const i=g.indexOf(e),a=g.indexOf(t);if(-1!==i&&-1!==a)return i-a;if(-1!==i)return-1;if(-1!==a)return 1;const o=this.hass.states[e]?.attributes?.friendly_name||e,s=this.hass.states[t]?.attributes?.friendly_name||t;return o.localeCompare(s)}),_=m.findIndex(e=>e===this._draggedEntityId);if(-1===_||_===i)return this._draggedEntityId=void 0,this._draggedEntityGroup=void 0,void(this._dragOverEntityIndex=void 0);const u=[...m],[v]=u.splice(_,1);if(!v)return;u.splice(i,0,v);const f=u;if(r)return this._saveUngroupedEntityOrder(f),void this._handleEntityDragEnd();const b={...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],groups_options:{...this._config.areas_options?.[this._area]?.groups_options,[t]:{...this._config.areas_options?.[this._area]?.groups_options?.[t],order:f}}}}};this._fireConfigChanged(b),this._draggedEntityId=void 0,this._draggedEntityGroup=void 0,this._dragOverEntityIndex=void 0}_toggleAreaVisibility(e){const t=[...this._config.areas_display?.hidden||[]],i=t.indexOf(e);-1===i?t.push(e):t.splice(i,1);const a={...this._config,areas_display:{...this._config.areas_display,hidden:t}};this._fireConfigChanged(a)}_toggleEntityVisibility(e,t){const i=this._config.areas_options?.[this._area]?.groups_options?.[t],a="cover_gates"===t?this._config.areas_options?.[this._area]?.groups_options?.cover_shading:void 0,o=se.includes(t)?ce(t):void 0,s=o?this._config.areas_options?.[this._area]?.groups_options?.[o]:void 0,r=[...(i||a||s)?.hidden||[]],n=r.indexOf(e);-1===n?r.push(e):r.splice(n,1);const d={...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],groups_options:{...this._config.areas_options?.[this._area]?.groups_options,[t]:{...this._config.areas_options?.[this._area]?.groups_options?.[t],hidden:r}}}}};this._fireConfigChanged(d)}_editArea(e){this._area=e,this._areaGroupOrderDirty=!1,this._collapsedAreaEntityGroups=new Set(se),this._emitSettingsPageContext(),this._resetSettingsScrollPosition()}_addFavoriteEntity(){this._showEntityPicker=!0,this._entitySearchFilter=""}_addWeatherEntity(){this._showWeatherPicker=!0,this._weatherSearchFilter=""}_addAlarmEntity(){this._showAlarmPicker=!0,this._alarmSearchFilter=""}_renderSelectedEntities(){const e=this._config?.favorites||[];return 0===e.length?W`
        <div class="no-favorites">
          <p>${this._t("favorites.empty")}</p>
        </div>
      `:W`
      <div class="selected-entities">
        ${V(e,e=>e,e=>{const t=this.hass?.states[e];return W`
              <div class="selected-entity" data-entity-id="${e}">
                <ha-state-icon
                  .stateObj=${t}
                  class="entity-icon"
                ></ha-state-icon>
                <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
                <button
                  class="remove-button"
                  title=${this._t("common.remove")}
                  @click=${()=>this._removeFavoriteEntity(e)}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              </div>
            `})}
      </div>
    `}_renderWeatherPicker(){const e=this._config?.settings?.weather_entity_id,t=this._weatherSearchFilter.trim().toLocaleLowerCase(xe(this.hass)),i=Object.keys(this.hass?.states||{}).filter(e=>{if(!e.startsWith("weather."))return!1;const t=this.hass?.entities?.[e];return!t?.hidden_by&&!t?.disabled_by}).sort((e,t)=>{const i=this.hass?.states[e]?.attributes?.friendly_name||e,a=this.hass?.states[t]?.attributes?.friendly_name||t;return i.localeCompare(a,xe(this.hass))}).filter(e=>{if(!t)return!0;const i=this.hass?.states[e];return(i?.attributes?.friendly_name||e).toLocaleLowerCase(xe(this.hass)).includes(t)||e.toLocaleLowerCase(xe(this.hass)).includes(t)});return W`
      <div class="entity-picker-modal" role="dialog" aria-modal="true">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t("settings.select_weather_title")}</h4>
            <button class="close-button" type="button" title=${this._t("common.close")} @click=${()=>this._showWeatherPicker=!1}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          <div class="entity-search">
            <input
              class="entity-search-input"
              type="search"
              aria-label=${this._t("settings.search_weather")}
              placeholder=${this._t("settings.search_weather")}
              .value=${this._weatherSearchFilter}
              @input=${e=>this._weatherSearchFilter=e.target.value}
            />
          </div>

          <div class="entity-list">
            ${i.map(t=>{const i=this.hass?.states[t],a=t===e;return W`
                <button
                  class="entity-option ${a?"selected":""}"
                  type="button"
                  @click=${()=>this._selectWeatherEntity(t)}
                >
                  <ha-state-icon .stateObj=${i} class="entity-icon"></ha-state-icon>
                  <span class="entity-option-copy">
                    <span class="entity-name">${i?.attributes?.friendly_name||t}</span>
                    <span class="entity-id">${t}</span>
                  </span>
                  ${a?W`<ha-icon class="entity-selected-icon" icon="mdi:check-circle"></ha-icon>`:R}
                </button>
              `})}
            ${0===i.length?W`
              <div class="entity-picker-hint empty">${this._t("settings.no_entities_found")}</div>
            `:R}
          </div>

          ${e?W`
            <div class="entity-picker-footer">
              <button class="dd-inline-text-button" type="button" @click=${this._clearWeatherEntity}>
                ${this._t("common.clear_selection")}
              </button>
            </div>
          `:R}
        </div>
      </div>
    `}_renderAlarmPicker(){const e=this._config?.settings?.alarm_entity_id,t=this._alarmSearchFilter.trim().toLocaleLowerCase(xe(this.hass)),i=Object.keys(this.hass?.states||{}).filter(e=>{if(!e.startsWith("alarm_control_panel."))return!1;const t=this.hass?.entities?.[e];return!t?.hidden_by&&!t?.disabled_by}).sort((e,t)=>{const i=this.hass?.states[e]?.attributes?.friendly_name||e,a=this.hass?.states[t]?.attributes?.friendly_name||t;return i.localeCompare(a,xe(this.hass))}).filter(e=>{if(!t)return!0;const i=this.hass?.states[e];return(i?.attributes?.friendly_name||e).toLocaleLowerCase(xe(this.hass)).includes(t)||e.toLocaleLowerCase(xe(this.hass)).includes(t)});return W`
      <div class="entity-picker-modal" role="dialog" aria-modal="true">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t("settings.select_alarm_title")}</h4>
            <button class="close-button" type="button" title=${this._t("common.close")} @click=${()=>this._showAlarmPicker=!1}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>

          <div class="entity-search">
            <input
              class="entity-search-input"
              type="search"
              aria-label=${this._t("settings.search_alarm")}
              placeholder=${this._t("settings.search_alarm")}
              .value=${this._alarmSearchFilter}
              @input=${e=>this._alarmSearchFilter=e.target.value}
            />
          </div>

          <div class="entity-list">
            ${i.map(t=>{const i=this.hass?.states[t],a=t===e;return W`
                <button
                  class="entity-option ${a?"selected":""}"
                  type="button"
                  @click=${()=>this._selectAlarmEntity(t)}
                >
                  <ha-state-icon .stateObj=${i} class="entity-icon"></ha-state-icon>
                  <span class="entity-option-copy">
                    <span class="entity-name">${i?.attributes?.friendly_name||t}</span>
                    <span class="entity-id">${t}</span>
                  </span>
                  ${a?W`<ha-icon class="entity-selected-icon" icon="mdi:check-circle"></ha-icon>`:R}
                </button>
              `})}
            ${0===i.length?W`
              <div class="entity-picker-hint empty">${this._t("settings.no_entities_found")}</div>
            `:R}
          </div>

          ${e?W`
            <div class="entity-picker-footer">
              <button class="dd-inline-text-button" type="button" @click=${this._clearAlarmEntity}>
                ${this._t("common.clear_selection")}
              </button>
            </div>
          `:R}
        </div>
      </div>
    `}_renderEntityPicker(){const e=Object.keys(this.hass?.states||{}),t=this._entitySearchFilter.trim().toLocaleLowerCase(xe(this.hass)),i=e.filter(e=>{if(!t)return!0;const i=this.hass?.states[e];return(i?.attributes?.friendly_name||e).toLocaleLowerCase(xe(this.hass)).includes(t)||e.toLocaleLowerCase(xe(this.hass)).includes(t)}).sort((e,t)=>{const i=this.hass?.states[e]?.attributes?.friendly_name||e,a=this.hass?.states[t]?.attributes?.friendly_name||t;return i.localeCompare(a,xe(this.hass))}),a=this._config?.favorites||[],o=i.filter(e=>!a.includes(e)),s=t?o:o.slice(0,50);return W`
      <div class="entity-picker-modal">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t("settings.select_entity_title")}</h4>
            <button
              class="close-button"
              title=${this._t("common.close")}
              @click=${()=>this._showEntityPicker=!1}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div class="entity-search">
            <input
              class="entity-search-input"
              type="search"
              placeholder=${this._t("settings.search")}
              aria-label=${this._t("settings.search")}
              .value=${this._entitySearchFilter}
              @input=${e=>this._entitySearchFilter=e.target.value}
            />
          </div>

          <div class="entity-list">
            ${V(s,e=>e,e=>{const t=this.hass?.states[e];return W`
                  <div class="entity-option" @click=${()=>this._selectEntity(e)}>
                    <ha-state-icon
                      .stateObj=${t}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
                    <span class="entity-id">${e}</span>
                  </div>
                `})}
            ${0===s.length?W`
              <div class="entity-picker-hint empty">${this._t("settings.no_entities_found")}</div>
            `:R}
            ${!t&&o.length>s.length?W`
              <div class="entity-picker-hint">
                ${this._t("settings.entity_picker_limited",{count:s.length,total:o.length})}
              </div>
            `:R}
          </div>
        </div>
      </div>
    `}_selectWeatherEntity(e){const t={...this._config,settings:{...this._config.settings,weather_entity_id:e}};this._fireConfigChanged(t),this._showWeatherPicker=!1}_selectAlarmEntity(e){const t={...this._config,settings:{...this._config.settings,alarm_entity_id:e}};this._fireConfigChanged(t),this._showAlarmPicker=!1}_toggleTimeDisplay(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_time:t}};this._fireConfigChanged(i)}_toggleWeatherDisplay(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_weather:t}};this._fireConfigChanged(i)}_toggleNotificationsDisplay(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_notifications:t}};this._fireConfigChanged(i)}_toggleMasterActionConfirmation(e,t){const i=t.target,a={...this._config,settings:{...this._config.settings,master_action_confirmations:{...this._config.settings?.master_action_confirmations,[e]:Boolean(i.checked)}}};this._fireConfigChanged(a)}_toggleSuggestedFavorites(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_suggested_favorites:t}};this._fireConfigChanged(i)}_toggleHideUnavailableEntities(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,hide_unavailable_entities_on_devices:t}};this._fireConfigChanged(i)}_toggleHideAreaNameInEntityNames(e){const t=e.target,i={...this._config,settings:{...this._config.settings,hide_area_name_in_entity_names:Boolean(t.checked)}};this._fireConfigChanged(i)}_toggleHideUnavailableAreaEntities(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,hide_unavailable_entities:t}};this._fireConfigChanged(i)}_toggleRecentDevicesPanel(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_recent_devices_panel:t}};this._fireConfigChanged(i)}_toggleRestrictNonAdminHaSidebar(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,restrict_non_admin_ha_sidebar:t}};this._fireConfigChanged(i)}_toggleRestrictNonAdminDashboardSettings(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,restrict_non_admin_dashboard_settings:t}};this._fireConfigChanged(i)}_selectEntity(e){const t=[...this._config?.favorites||[]];if(!t.includes(e)){t.push(e);const i={...this._config,favorites:t};this._fireConfigChanged(i)}this._showEntityPicker=!1}_removeFavoriteEntity(e){const t=[...this._config?.favorites||[]],i=t.indexOf(e);if(i>-1){t.splice(i,1);const e={...this._config,favorites:t};this._fireConfigChanged(e)}}_renderPersonsConfiguration(){if(!this.hass?.states)return W`<p>${this._t("settings.no_persons")}</p>`;const e=Object.keys(this.hass.states).filter(e=>e.startsWith("person.")).map(e=>{const t=this.hass.states[e];return{entity_id:e,state:t,friendly_name:t?.attributes?.friendly_name||e,picture:t?.attributes?.entity_picture}}).sort((e,t)=>e.friendly_name.localeCompare(t.friendly_name));if(0===e.length)return W`
        <div class="no-persons">
          <p>${this._t("settings.no_person_entities")}</p>
          <p style="font-size: 12px; color: var(--secondary-text-color);">
            ${this._t("settings.add_person_entities_hint")}
          </p>
        </div>
      `;const t=new Set(this._config?.settings?.hidden_persons||[]);return W`
      <div class="persons-list">
        ${V(e,e=>e.entity_id,e=>{const i=t.has(e.entity_id);return W`
              <div class="person-item ${i?"hidden":""}">
                <span class="person-avatar">
                  ${e.picture?W`<img src=${e.picture} alt="" loading="lazy" />`:W`<ha-icon icon="mdi:account" class="person-icon"></ha-icon>`}
                </span>
                <span class="person-name">${e.friendly_name}</span>
                ${this._renderVisibilityButton(!i,!1,i?this._t("common.show"):this._t("common.hide"),()=>this._togglePersonVisibility(e.entity_id))}
              </div>
            `})}
      </div>
    `}_togglePersonVisibility(e){const t=[...this._config?.settings?.hidden_persons||[]],i=t.indexOf(e);-1===i?t.push(e):t.splice(i,1);const a={...this._config,settings:{...this._config.settings,hidden_persons:t}};this._fireConfigChanged(a)}_openReplacementManager(){this.hass&&this._config&&function(e,t,i,a){let o=document.querySelector("dwains-dashboard-next-replacement-manager-dialog");o||(o=document.createElement("dwains-dashboard-next-replacement-manager-dialog"),document.body.appendChild(o)),o.hass=e,o.showDialog({config:t,onSave:i,initialDomain:a})}(this.hass,this._config,e=>{this._fireConfigChanged(e),this.requestUpdate()})}_replacementCount(){return ge(this._config?.blueprint_replacements)}_fireConfigChanged(e){this._config={...this._config,...e};const t={type:"custom:dwains-dashboard-next",areas_display:e.areas_display||{},floors_display:e.floors_display||{},areas_options:e.areas_options||{},blueprint_replacements:e.blueprint_replacements||{},device_admission:e.device_admission||{},favorites:e.favorites||[],pages:e.pages||[],home_custom_cards:e.home_custom_cards||[],settings:e.settings||{}},i=new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0});this.dispatchEvent(i)}static get styles(){return M`:host{display:block}.editor-container{padding:16px}.dd-native-editor-subpage-back{display:flex;align-items:center;min-height:30px;max-width:1060px;margin:0 auto 6px;padding:0 12px;box-sizing:border-box}.dd-native-back-button{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;padding:0;border:0;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 74%,var(--card-background-color));color:var(--primary-text-color);cursor:pointer;font:inherit;-webkit-tap-highlight-color:transparent}.dd-native-back-button ha-icon{--mdc-icon-size:16px}.settings-overview-hero{display:flex;align-items:center;justify-content:space-between;gap:20px;max-width:720px;margin:0 auto 18px;padding:22px 24px;border:1px solid var(--divider-color);border-radius:12px;background:radial-gradient(circle at top right,color-mix(in srgb,var(--primary-color) 12%,transparent),transparent 42%),var(--card-background-color);box-shadow:0 8px 26px rgba(15,23,42,0.06)}.settings-overview-hero h2{margin:0;color:var(--primary-text-color);font-size:22px;font-weight:700;letter-spacing:0}.settings-overview-hero p{margin:6px 0 0;color:var(--secondary-text-color);font-size:13px;line-height:1.45}.settings-version-chip{width:fit-content;display:inline-flex;align-items:center;gap:6px;margin-top:12px;padding:7px 10px;border-radius:999px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);font-size:12px;font-weight:700;line-height:1}.settings-version-chip ha-icon,.settings-version-chip svg{width:16px;height:16px;fill:currentColor;--mdc-icon-size:16px}.settings-version-chip strong{color:var(--primary-text-color);font-weight:800}.settings-overview-hero>ha-icon,.settings-overview-hero>svg{flex:0 0 auto;width:48px;height:48px;border-radius:999px;display:flex;align-items:center;justify-content:center;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent);fill:currentColor;--mdc-icon-size:26px}.settings-overview-hero>svg{padding:11px;box-sizing:border-box}.settings-nav-section{max-width:1060px;margin:0 auto 12px}.settings-nav-section h3{min-height:30px;margin:0 0 6px;padding:0 12px;display:flex;align-items:center;color:var(--secondary-text-color);font-size:12px;font-weight:700;letter-spacing:0}.settings-nav-list{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.settings-nav-item{width:100%;min-height:76px;display:grid;grid-template-columns:44px minmax(0,1fr) auto 24px;align-items:center;gap:14px;padding:12px 16px;border:0;border-bottom:1px solid var(--divider-color);color:var(--primary-text-color);background:transparent;text-align:left;cursor:pointer;font:inherit}.settings-nav-item:last-child{border-bottom:0}.settings-nav-item:hover{background:color-mix(in srgb,var(--settings-item-color) 5%,transparent)}.settings-nav-icon{width:44px;height:44px;border-radius:999px;display:flex;align-items:center;justify-content:center;color:#fff;background:var(--settings-item-color)}.settings-nav-icon ha-icon,.settings-nav-icon svg{width:24px;height:24px;fill:currentColor;--mdc-icon-size:24px}.settings-nav-copy{min-width:0}.settings-nav-title{color:var(--primary-text-color);font-size:15px;font-weight:700;line-height:1.2}.settings-nav-description{margin-top:3px;color:var(--secondary-text-color);font-size:12px;line-height:1.35}.settings-nav-summary{justify-self:end;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:6px 10px;border-radius:999px;color:var(--secondary-text-color);background:color-mix(in srgb,var(--secondary-text-color) 7%,transparent);font-size:12px;font-weight:700}.settings-nav-chevron{color:var(--secondary-text-color);width:22px;height:22px;fill:currentColor;--mdc-icon-size:22px}.settings-loading-shell{min-height:420px}.settings-overview-hero-skeleton{opacity:0.92}.settings-nav-item-skeleton{pointer-events:none;cursor:default}.skeleton-block,.settings-skeleton-copy span,.settings-skeleton-copy small{position:relative;overflow:hidden;background:color-mix(in srgb,var(--secondary-text-color) 12%,transparent)}.skeleton-block::after,.settings-skeleton-copy span::after,.settings-skeleton-copy small::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--card-background-color) 70%,transparent),transparent);animation:settings-skeleton-shimmer 1.2s ease-in-out infinite}.settings-skeleton-copy{display:flex;flex-direction:column;gap:8px}.settings-skeleton-copy span,.settings-skeleton-copy small{display:block;border-radius:999px}.settings-skeleton-copy span{width:180px;height:14px}.settings-skeleton-copy small{width:260px;max-width:100%;height:10px}@keyframes settings-skeleton-shimmer{to{transform:translateX(100%)}}.settings-detail-toolbar{max-width:940px;margin:0 auto 14px;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:12px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--divider-color) 72%,transparent);border-radius:16px;background:color-mix(in srgb,var(--card-background-color) 96%,var(--primary-color));box-shadow:0 8px 22px rgba(15,23,42,0.05)}.settings-back-button{width:auto;min-width:0;height:36px;padding:0 12px 0 10px;border:0;border-radius:999px;display:inline-flex;align-items:center;gap:6px;justify-content:center;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 9%,transparent);box-shadow:none;cursor:pointer;font-size:13px;font-weight:800;line-height:1}.settings-back-button ha-icon{--mdc-icon-size:18px}.settings-back-button span{white-space:nowrap}.settings-detail-title{min-width:0;display:flex;flex-direction:column}.settings-detail-title span{color:var(--primary-text-color);font-size:18px;font-weight:700;line-height:1.2}.settings-detail-title small{margin-top:2px;color:var(--secondary-text-color);font-size:12px;line-height:1.35}.settings-detail-content{max-width:1060px;margin:0 auto}.empty-settings-card{margin:0;padding:16px;display:grid;gap:5px;border:1px dashed var(--divider-color);border-radius:10px;color:var(--secondary-text-color);background:var(--secondary-background-color);text-align:left}.empty-settings-card strong{color:var(--primary-text-color);font-size:13px}.empty-settings-card span{font-size:12px;line-height:1.4}.dashboard-settings{display:flex;flex-direction:column;gap:14px;padding:0}.dashboard-settings ha-icon-picker{width:100%}@media (max-width:700px){.settings-overview-hero,.settings-nav-section,.settings-detail-content,.settings-detail-toolbar{max-width:none}.settings-overview-hero{align-items:flex-start;padding:18px}.settings-overview-hero>ha-icon,.settings-overview-hero>svg{width:40px;height:40px;--mdc-icon-size:22px}.settings-overview-hero>svg{padding:9px}.settings-nav-item{grid-template-columns:40px minmax(0,1fr) 22px;gap:12px;min-height:72px;padding:12px}.settings-nav-icon{width:40px;height:40px}.settings-nav-summary{grid-column:2 / -1;justify-self:start;max-width:100%;margin-top:-4px}.settings-nav-chevron{grid-column:3;grid-row:1}.settings-detail-toolbar{margin:0 0 12px;padding:10px 12px;border-radius:14px}.settings-detail-title span{font-size:17px}.settings-detail-title small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}.home-layout-section{display:grid;gap:18px;padding:0 16px 16px}.home-section-list,.home-info-card-list{display:grid;gap:8px}.home-section-item,.home-info-card-item{display:grid;grid-template-columns:32px 42px minmax(0,1fr) auto;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);box-shadow:0 4px 12px rgba(15,23,42,0.04);transition:border-color 0.16s ease,box-shadow 0.16s ease,opacity 0.16s ease,transform 0.16s ease}.home-info-card-item{grid-template-columns:42px minmax(0,1fr) auto}.home-section-item.has-detail,.home-info-card-item.has-detail{cursor:pointer}.home-section-item.has-detail:hover,.home-info-card-item.has-detail:hover{border-color:color-mix(in srgb,var(--primary-color) 48%,var(--divider-color));background:color-mix(in srgb,var(--primary-color) 4%,var(--card-background-color))}.home-section-detail-chevron{width:20px;height:20px;flex:0 0 auto;color:var(--secondary-text-color)}.home-section-item>.home-section-detail-chevron{margin-left:-2px}.home-info-card-actions{display:inline-flex;align-items:center;gap:4px}.home-info-card-section{display:grid;gap:10px}.home-information-card-settings,.home-climate-area-settings{padding:0 16px 16px}.home-camera-settings-section{padding:0 16px 16px}.home-custom-card-settings-section{padding:0 16px 16px}.home-custom-card-settings-list{display:grid;gap:8px}.home-custom-card-add{min-height:36px;padding:8px 12px;border:0;border-radius:999px;display:inline-flex;align-items:center;gap:6px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);font:inherit;font-weight:800;cursor:pointer}.home-custom-card-add ha-icon{--mdc-icon-size:18px}.home-custom-card-settings-item .home-section-actions{align-items:center}.home-camera-settings-list{display:grid;gap:8px}.home-camera-settings-empty{padding:18px;border:1px dashed var(--divider-color);border-radius:10px;color:var(--secondary-text-color);background:var(--secondary-background-color);text-align:center}.home-info-card-header{display:flex;justify-content:space-between;align-items:end;gap:16px;padding:0 2px}.home-info-card-header h4{margin:0;font-size:15px;font-weight:800;color:var(--primary-text-color)}.home-info-card-header p{margin:4px 0 0;font-size:13px;line-height:1.35;color:var(--secondary-text-color)}.home-info-card-header span{flex:0 0 auto;font-size:12px;font-weight:800;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);border-radius:999px;padding:6px 10px}.home-section-item.dragging{opacity:0.28;transform:none}.home-section-item.drag-over{background:color-mix(in srgb,var(--primary-color) 4%,transparent)}.home-section-list.dragging .dd-home-section-block{transition:transform 0.14s ease,opacity 0.14s ease}.home-section-item.disabled,.home-info-card-item.disabled{opacity:0.58;background:color-mix(in srgb,var(--card-background-color) 78%,var(--secondary-background-color))}.home-section-handle{display:flex;color:var(--secondary-text-color);cursor:grab}.home-section-handle:active{cursor:grabbing}.home-section-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent)}.home-section-icon ha-icon{--mdc-icon-size:22px}.home-section-item.disabled .home-section-icon,.home-info-card-item.disabled .home-section-icon{color:var(--secondary-text-color);background:var(--secondary-background-color)}.home-section-copy{min-width:0;display:block}.home-section-copy .home-section-title,.home-section-copy .home-section-description{display:block}.home-section-title{font-weight:700;color:var(--primary-text-color)}.home-section-description{margin-top:2px;font-size:12px;line-height:1.35;color:var(--secondary-text-color)}.home-section-item.has-detail{grid-template-columns:32px 42px minmax(0,1fr) 20px auto}.home-section-actions{display:inline-flex;gap:2px}.home-section-toggle{width:40px;height:40px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;color:var(--secondary-text-color);background:transparent;cursor:pointer}.home-section-toggle.enabled{color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent)}.home-section-toggle ha-icon{--mdc-icon-size:20px}.home-layout-reset{justify-self:start;border:0;border-radius:999px;padding:8px 12px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);font:inherit;font-weight:700;cursor:pointer}.home-layout-reset:disabled{color:var(--disabled-text-color,var(--secondary-text-color));background:color-mix(in srgb,var(--primary-text-color) 5%,transparent);cursor:default;opacity:0.55}.area-apply-type-order:not(:disabled){color:var(--primary-color)}.dd-field{display:flex;flex-direction:column;gap:6px}.dd-field label{font-size:0.8rem;color:var(--secondary-text-color)}.dd-input{width:100%;box-sizing:border-box;padding:12px 14px;font-size:1rem;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;outline:none;transition:border-color .2s ease}.dd-input:focus{border-color:var(--primary-color)}.sponsoring-section{background:linear-gradient(135deg,var(--primary-color),var(--accent-color,var(--primary-color)));color:white;border-radius:12px;padding:24px;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,0.15);position:relative;overflow:hidden}.sponsoring-section::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;pointer-events:none}.sponsoring-header{display:flex;align-items:center;gap:12px;margin-bottom:16px;position:relative;z-index:1}.sponsoring-header ha-icon{--mdc-icon-size:28px;color:#ffeb3b;animation:heartbeat 2s infinite}@keyframes heartbeat{0%,50%,100%{transform:scale(1)}25%{transform:scale(1.1)}}.sponsoring-header h3{margin:0;font-size:21px;font-weight:600;text-shadow:0 1px 2px rgba(0,0,0,0.2)}.sponsoring-text{position:relative;z-index:1;margin:0 0 16px 0;line-height:1.6;font-size:13px;opacity:0.95}.sponsoring-text strong{font-weight:700}.sponsor-label{position:relative;z-index:1;font-size:13px;font-weight:600;margin-bottom:10px;opacity:0.95}.sponsor-chips{position:relative;z-index:1;display:flex;flex-wrap:wrap;gap:10px}.sponsor-chip{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;text-decoration:none;font-size:13px;font-weight:600;color:#fff;background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.35);transition:transform 0.15s ease,background-color 0.2s ease,box-shadow 0.2s ease}.sponsor-chip ha-icon{--mdc-icon-size:18px}.sponsor-chip:hover{background:rgba(255,255,255,0.28);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.18)}.sponsor-chip.primary{background:#fff;color:var(--primary-color);border-color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.18)}.sponsor-chip.primary:hover{filter:brightness(0.97)}.sponsor-divider{position:relative;z-index:1;height:1px;background:rgba(255,255,255,0.25);margin:18px 0}@media (max-width:600px){.sponsoring-section{padding:20px;margin-bottom:20px}.sponsoring-header h3{font-size:20px}.sponsor-chips{flex-direction:column}.sponsor-chip{justify-content:center}}.toolbar{display:flex;align-items:center;gap:4px;margin:-16px -16px 16px -16px;padding:8px;background:var(--primary-background-color);border-bottom:1px solid var(--divider-color)}.toolbar ha-icon-button{color:var(--primary-text-color);--mdc-icon-button-size:40px;--mdc-icon-size:24px;flex:0 0 auto}.toolbar h2{margin:0;font-size:20px;font-weight:500;flex:1;padding:0 4px}ha-expansion-panel{margin-bottom:8px;--expansion-panel-summary-padding:0 16px}ha-expansion-panel [slot="header"]{display:flex;align-items:center;gap:16px}.area-entity-section{position:relative;border-radius:8px;transition:opacity 0.16s ease,outline-color 0.16s ease,background-color 0.16s ease}.area-entity-section.dragging{opacity:0.46}.area-entity-section.drag-over{outline:2px solid var(--primary-color);outline-offset:3px;background:color-mix(in srgb,var(--primary-color) 5%,transparent)}.area-entity-section-card{position:relative;overflow:hidden;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color)}.area-entity-section-header{position:relative;width:100%;min-width:0;min-height:58px;display:grid;grid-template-columns:36px 34px minmax(0,1fr) 44px;align-items:center;gap:8px;padding:6px 12px 8px;box-sizing:border-box;cursor:pointer}.area-entity-section-card .sortable-container{padding-top:8px;border-top:1px solid var(--divider-color)}.area-entity-section-icon{color:var(--primary-color);--mdc-icon-size:22px}.area-entity-section-title{min-width:0;overflow:hidden;color:var(--primary-text-color);font-size:14px;font-weight:700;text-overflow:ellipsis;white-space:nowrap}.area-entity-section-handle{width:36px;height:36px;padding:0;display:inline-grid;place-items:center;border:0;border-radius:999px;color:var(--secondary-text-color);background:transparent;cursor:grab;touch-action:none}.area-entity-section-handle:active{cursor:grabbing}.area-entity-section-handle ha-svg-icon{width:20px;height:20px}.area-entity-section-chevron{bottom:0}.description{margin:16px;color:var(--secondary-text-color)}.area-help{display:flex;gap:12px;align-items:flex-start;margin:0 0px 16px 0px;padding:12px;background:var(--secondary-background-color);border:1px solid var(--divider-color);border-radius:8px}.area-help-icon{--mdc-icon-size:24px}.area-help-text p{margin:0 0 6px 0;font-size:13px;color:var(--secondary-text-color)}.area-order-settings{margin:0 16px 16px;padding:16px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.area-order-heading{display:grid;gap:4px;margin-bottom:12px}.area-order-heading strong{font-size:15px}.area-order-heading span,.area-order-mode small,.area-order-hint{color:var(--secondary-text-color);font-size:12px;line-height:1.4}.area-order-modes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.area-order-mode{min-width:0;min-height:72px;display:flex;align-items:flex-start;gap:10px;padding:12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--secondary-background-color);color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer}.area-order-mode:hover{border-color:var(--primary-color)}.area-order-mode.selected{border-color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 9%,var(--card-background-color));box-shadow:inset 3px 0 0 var(--primary-color)}.area-order-mode ha-icon{flex:0 0 auto;color:var(--primary-color)}.area-order-mode span{min-width:0;display:grid;gap:3px}.area-order-mode strong{font-size:13px}.area-order-hint{margin:12px 0 0}.area-entity-layout-settings{margin:0 16px 16px;padding:16px;display:grid;gap:12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.area-entity-layout-copy{display:grid;gap:4px}.area-entity-layout-copy strong{font-size:15px}.area-entity-layout-copy span,.entity-name small{color:var(--secondary-text-color);font-size:12px;line-height:1.4}.area-entity-layout-settings .area-order-modes{grid-template-columns:repeat(2,minmax(0,1fr))}.entity-name small{display:block;font-weight:400}.entity-order-buttons{display:inline-flex;align-items:center;flex:0 0 auto}@media (max-width:700px){.area-order-modes{grid-template-columns:1fr}.area-entity-layout-settings .area-order-modes{grid-template-columns:1fr}.area-order-mode{min-height:0}.entity-order-buttons ha-icon-button{width:36px;height:36px}}.sortable-container{position:relative;display:flex;flex-direction:column;gap:4px;padding:0 16px 16px 16px}.area-custom-cards-settings{margin:0 16px 16px;padding:14px;display:grid;gap:12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.area-custom-card-placement{overflow:hidden;border:1px dashed color-mix(in srgb,var(--primary-color) 35%,var(--divider-color));border-radius:8px;background:color-mix(in srgb,var(--primary-color) 4%,var(--card-background-color))}.area-custom-card-placement.drag-over,.area-custom-card-drop-zone.drag-over{border-color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,var(--card-background-color))}.area-custom-card-placement-title{display:flex;align-items:center;gap:8px;padding:10px 12px;color:var(--primary-text-color);font-size:13px;font-weight:600}.area-custom-card-placement-title ha-icon{--mdc-icon-size:18px;color:var(--primary-color)}.area-custom-card-list{padding:0 8px 8px}.area-custom-card-empty{padding:10px 12px;color:var(--secondary-text-color);font-size:12px}.custom-card-item{border:1px solid color-mix(in srgb,var(--primary-color) 24%,var(--divider-color));background:color-mix(in srgb,var(--primary-color) 6%,var(--card-background-color));cursor:grab}.custom-card-item:active{cursor:grabbing}.custom-card-icon{width:36px;height:36px;margin-right:12px;display:grid;place-items:center;flex:0 0 36px;border-radius:6px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,var(--card-background-color))}.custom-card-icon ha-icon{--mdc-icon-size:20px}.custom-card-badge{flex:0 0 auto;padding:4px 8px;border-radius:999px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);font-size:11px;font-weight:600}.area-custom-card-drop-zone{min-height:38px;margin:4px 0;display:flex;align-items:center;justify-content:center;gap:8px;border:1px dashed var(--divider-color);border-radius:6px;color:var(--secondary-text-color);font-size:12px}.area-custom-card-drop-zone ha-icon{--mdc-icon-size:18px}.sortable-item{position:relative;background:var(--card-background-color);border-radius:4px;box-shadow:var(--card-box-shadow,none);transition:all 0.2s ease;user-select:none;cursor:default}.sortable-container.is-custom-order .sortable-item{cursor:grab}.sortable-container.is-custom-order .sortable-item:active{cursor:grabbing}.handle.disabled{opacity:0.25}.sortable-item.hidden{opacity:0.5}.sortable-item:hover{background:var(--secondary-background-color)}.sortable-item.dragging{opacity:0.4;transform:scale(0.95);transition:none}.sortable-container.dragging .sortable-item{transition:transform 0.2s ease}.sortable-container.dragging .sortable-item:not(.dragging):hover{transform:translateY(2px)}.sortable-item.drag-over{position:relative}.sortable-item.drag-over::before{content:'';position:absolute;top:-2px;left:0;right:0;height:4px;background:var(--primary-color);border-radius:2px;animation:pulse 1s infinite}@keyframes pulse{0%{opacity:1}50%{opacity:0.5}100%{opacity:1}}.area-item,.entity-item{display:flex;align-items:center;width:100%;padding:10px 12px;min-height:52px;box-sizing:border-box}.area-detail-editor .sortable-item{border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.area-detail-editor .entity-item .dd-visibility-button{width:34px;height:34px;margin-left:auto;flex:0 0 auto}.sortable-item:hover{background:var(--secondary-background-color)}.handle{cursor:grab;margin-right:8px;display:flex;align-items:center;padding:8px 4px;color:var(--secondary-text-color);transition:all 0.2s ease}.handle:hover{background:var(--primary-background-color);border-radius:4px;color:var(--primary-color)}.handle:active{cursor:grabbing}.handle ha-svg-icon{--mdc-icon-size:20px}.area-icon,.entity-icon{margin-right:16px}.area-name,.entity-name{flex:1}.area-name.clickable{cursor:pointer;display:flex;align-items:center;gap:4px}.area-name.clickable:hover{color:var(--primary-color)}.area-name .chevron{--mdc-icon-size:20px;opacity:0.6}.area-actions{display:flex;align-items:center;gap:4px}button.link{color:var(--primary-color);text-decoration:none;background:none;border:none;cursor:pointer;font-size:inherit;padding:0}ha-icon-button[disabled]{opacity:0.5;pointer-events:none}ha-icon-button{--mdc-icon-button-size:40px;--mdc-icon-size:20px}.favorites-section,.time-section,.weather-section,.alarm-section,.master-confirmation-section,.entity-display-section,.replacement-section{padding:0 16px 16px 16px}.master-confirmation-section{display:grid;gap:12px}.master-confirmation-note{display:flex;align-items:flex-start;gap:10px;padding:12px;border-radius:8px;color:var(--secondary-text-color);background:color-mix(in srgb,var(--primary-color) 8%,var(--secondary-background-color));font-size:13px;line-height:1.45}.master-confirmation-note ha-icon{flex:0 0 auto;color:var(--primary-color);--mdc-icon-size:20px}.master-confirmation-list{overflow:hidden;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.master-confirmation-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:12px;min-height:62px;padding:10px 12px;cursor:pointer}.master-confirmation-row + .master-confirmation-row{border-top:1px solid var(--divider-color)}.master-confirmation-row:hover{background:color-mix(in srgb,var(--primary-color) 4%,transparent)}.master-confirmation-icon{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:8px;color:var(--master-confirmation-color);background:color-mix(in srgb,var(--master-confirmation-color) 12%,transparent)}.master-confirmation-icon ha-icon{--mdc-icon-size:22px}.master-confirmation-copy{min-width:0;display:grid;gap:3px}.master-confirmation-copy strong{color:var(--primary-text-color);font-size:14px;line-height:1.3}.master-confirmation-copy small{color:var(--secondary-text-color);font-size:12px;line-height:1.4}.master-confirmation-control{display:flex;align-items:center;gap:12px}.master-confirmation-control>span{max-width:130px;color:var(--secondary-text-color);font-size:12px;font-weight:600;text-align:right}@media (max-width:600px){.master-confirmation-section{padding-inline:10px}.master-confirmation-row{grid-template-columns:38px minmax(0,1fr) auto;gap:10px;padding-inline:10px}.master-confirmation-icon{width:38px;height:38px}.master-confirmation-control>span{display:none}}.replacement-summary{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.replacement-count{font-size:14px;font-weight:600;color:var(--primary-text-color)}.replacement-help{margin-top:4px;font-size:12px;color:var(--secondary-text-color);line-height:1.4}.replacement-summary ha-button ha-icon{--mdc-icon-size:18px;margin-right:6px}@media (max-width:600px){.replacement-summary{align-items:stretch;flex-direction:column}}.time-toggle,.weather-toggle,.favorite-suggestions-toggle,.hide-unavailable-toggle{margin-bottom:16px}.time-toggle ha-formfield,.weather-toggle ha-formfield,.favorite-suggestions-toggle ha-formfield,.hide-unavailable-toggle ha-formfield{--mdc-typography-body2-font-size:14px}.toggle-description{margin:8px 0 0 0;font-size:12px;color:var(--secondary-text-color);line-height:1.4;padding-left:16px;border-left:3px solid var(--divider-color)}.device-types-visibility{margin-top:20px;display:grid;gap:12px}.device-admission-section{margin-top:24px;display:grid;gap:12px}.device-types-header{display:flex;align-items:flex-end;justify-content:space-between;gap:16px}.device-types-header h4{margin:0;color:var(--primary-text-color);font-size:15px;font-weight:700}.device-types-header p{margin:4px 0 0;color:var(--secondary-text-color);font-size:12px;line-height:1.35}.device-types-header>span{flex:0 0 auto;padding:6px 10px;border-radius:999px;color:var(--secondary-text-color);background:color-mix(in srgb,var(--secondary-text-color) 7%,transparent);font-size:12px;font-weight:700}.device-types-grid{overflow:hidden;display:grid;grid-template-columns:1fr;gap:0;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.device-type-option{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:10px;min-height:60px;padding:8px 12px;border:0;border-radius:0;background:transparent;transition:opacity 0.16s ease,background 0.16s ease}.device-type-option + .device-type-option{border-top:1px solid var(--divider-color)}.device-type-option.enabled{border-color:var(--divider-color)}.device-type-option.disabled{opacity:0.58;background:color-mix(in srgb,var(--card-background-color) 78%,var(--secondary-background-color))}.device-type-icon{width:42px;height:42px;border-radius:0;display:flex;align-items:center;justify-content:center;color:var(--device-type-color);background:transparent}.device-type-icon ha-icon{--mdc-icon-size:22px}.device-type-copy{min-width:0}.device-type-name{color:var(--primary-text-color);font-size:14px;font-weight:700;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.device-type-count{margin-top:3px;color:var(--secondary-text-color);font-size:12px;line-height:1}.device-admission-global-actions,.device-admission-group-actions,.device-admission-area-actions{display:flex;flex-wrap:wrap;gap:8px}.device-admission-global-actions button,.device-admission-group-actions button,.device-admission-area-actions button{min-height:34px;border:0;border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);font:inherit;font-size:12px;font-weight:800;cursor:pointer}.device-admission-global-actions button[disabled],.device-admission-group-actions button[disabled],.device-admission-area-actions button[disabled]{opacity:0.42;cursor:not-allowed}.device-admission-global-actions ha-icon{--mdc-icon-size:16px}.device-admission-groups{display:grid;gap:8px}.device-admission-groups ha-expansion-panel,.device-admission-area,.device-admission-device{content-visibility:auto}.device-admission-groups ha-expansion-panel{contain-intrinsic-size:auto 86px}.device-admission-panel-header{width:100%;display:grid;grid-template-columns:34px minmax(0,1fr) auto;align-items:center;gap:10px}.device-type-icon.small{width:34px;height:34px;border-radius:9px}.device-type-icon.small ha-icon{--mdc-icon-size:19px}.device-admission-panel-header>span:not(.device-type-icon){min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--primary-text-color);font-weight:800}.device-admission-panel-header small{color:var(--secondary-text-color);font-size:12px;font-weight:700}.device-admission-panel{display:grid;gap:12px;padding:0 16px 16px}.device-admission-group-actions{justify-content:flex-end}.device-admission-area{display:grid;gap:8px;padding:12px;border:1px solid var(--divider-color);border-radius:12px;background:color-mix(in srgb,var(--card-background-color) 82%,var(--secondary-background-color));contain-intrinsic-size:auto 180px}.device-admission-area-header{display:flex;align-items:center;justify-content:space-between;gap:12px}.device-admission-area-header strong{display:block;color:var(--primary-text-color);font-size:14px;line-height:1.2}.device-admission-area-header span{display:block;margin-top:2px;color:var(--secondary-text-color);font-size:12px}.device-admission-device-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px}.device-admission-device{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:10px;padding:10px;border:1px solid color-mix(in srgb,var(--device-type-color) 22%,var(--divider-color));border-radius:10px;background:var(--card-background-color);box-shadow:0 4px 12px rgba(15,23,42,0.04);contain-intrinsic-size:auto 64px}.device-admission-device.hidden{opacity:0.58;background:color-mix(in srgb,var(--card-background-color) 74%,var(--secondary-background-color))}.device-admission-copy{min-width:0}@media (max-width:600px){.device-types-header{align-items:flex-start;flex-direction:column;gap:8px}.device-types-grid{grid-template-columns:1fr}.device-admission-panel{padding:0 10px 12px}.device-admission-area-header{align-items:flex-start;flex-direction:column}.device-admission-device-list{grid-template-columns:1fr}}.entity-picker,.weather-picker,.alarm-picker{width:100%}.weather-picker-header,.alarm-picker-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.weather-picker-header h4,.alarm-picker-header h4{margin:0;font-size:16px;font-weight:500}.no-weather,.no-alarm{text-align:center;padding:24px;color:var(--secondary-text-color)}.selected-weather-entity,.selected-alarm-entity{display:flex;align-items:center;gap:12px;padding:12px;background:var(--card-background-color);border-radius:8px;border:1px solid var(--divider-color)}.selected-weather-entity .entity-icon,.selected-alarm-entity .entity-icon{--mdc-icon-size:24px}.selected-weather-entity .entity-name,.selected-alarm-entity .entity-name{flex:1;font-size:14px}.entity-picker-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.entity-picker-header h4{margin:0;font-size:16px;font-weight:500}.no-favorites{text-align:center;padding:24px;color:var(--secondary-text-color)}.selected-entities{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}.selected-entity{display:flex;align-items:center;gap:12px;padding:12px;background:var(--card-background-color);border-radius:8px;border:1px solid var(--divider-color)}.selected-entity .entity-icon{--mdc-icon-size:24px}.selected-entity .entity-name{flex:1;font-size:14px}.remove-button{background:none;border:none;cursor:pointer;padding:8px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--error-color,#f44336);transition:all 0.2s ease;width:36px;height:36px}.remove-button:hover{background:var(--error-color,#f44336);color:white;transform:scale(1.1)}.close-button{background:none;border:none;cursor:pointer;padding:8px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--secondary-text-color);transition:all 0.2s ease;width:36px;height:36px}.close-button:hover{background:var(--secondary-background-color);color:var(--primary-text-color);transform:scale(1.1)}.entity-picker-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000}.entity-picker-content{background:var(--card-background-color);border-radius:12px;padding:24px;width:90%;max-width:600px;max-height:80vh;overflow-y:auto}.entity-picker-content .entity-picker-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.entity-search{margin-bottom:16px}.entity-search-input{width:100%;min-height:44px;box-sizing:border-box;padding:0 14px;border:1px solid var(--divider-color);border-radius:8px;outline:none;background:var(--card-background-color);color:var(--primary-text-color);font:inherit}.entity-search-input:focus{border-color:var(--primary-color)}.entity-list{display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto}.entity-picker-hint{padding:10px 14px;color:var(--secondary-text-color);font-size:12px;line-height:1.4}.entity-picker-hint.empty{text-align:center}.entity-option{display:flex;align-items:center;gap:12px;padding:12px;background:var(--primary-background-color);border-radius:8px;cursor:pointer;transition:all 0.2s ease}.entity-option:hover{background:var(--secondary-background-color)}.entity-option .entity-icon{--mdc-icon-size:24px}.entity-option .entity-name{flex:1;font-size:14px}.entity-option .entity-id{font-size:12px;color:var(--secondary-text-color);font-family:var(--font-family-code)}.loading{display:flex;align-items:center;justify-content:center;height:100px}.persons-section{padding:0}.persons-list{overflow:hidden;display:flex;flex-direction:column;gap:0;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.person-item{display:flex;align-items:center;gap:12px;min-height:60px;padding:8px 12px;background:transparent;border-radius:0;border:0;transition:background 0.2s ease,opacity 0.2s ease}.person-item + .person-item{border-top:1px solid var(--divider-color)}.person-item.hidden{opacity:0.5;background:var(--disabled-background-color,var(--secondary-background-color))}.person-icon{--mdc-icon-size:32px;flex-shrink:0}.person-name{flex:1;font-size:14px;font-weight:500}.person-state{font-size:12px;padding:4px 8px;border-radius:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.5px}.person-state.home{background:var(--success-color,#4caf50);color:white}.person-state.away{background:var(--warning-color,#ff9800);color:white}.no-persons{text-align:center;padding:32px;color:var(--secondary-text-color)}.dd-flat-settings{width:100%;min-width:0;box-sizing:border-box;scroll-padding-top:96px}.settings-detail-content,.home-section-item,.dd-flat-subitem-row{scroll-margin-top:96px}.dd-flat-settings .settings-nav-section,.dd-flat-settings .settings-detail-content,.dd-settings-version-footer,.dd-subpage-header{max-width:1060px;margin-inline:auto}.dd-settings-overview .settings-nav-section:first-of-type{margin-top:0}.dd-settings-version-footer{margin-top:22px;padding-top:14px;border-top:0;color:var(--secondary-text-color);font-size:11px;text-align:center}.dd-settings-version-footer::before{content:"";display:block;width:28px;height:1px;margin:0 auto 10px;background:var(--divider-color)}.dd-subpage-header{height:42px;min-height:42px;margin-top:0;margin-bottom:12px;display:flex;align-items:center;gap:8px;padding:0;box-sizing:border-box;border:0;border-radius:0;background:transparent}.dd-subpage-back{width:36px;height:36px;flex:0 0 36px;display:inline-grid;place-items:center;border:0;border-radius:999px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 9%,transparent);cursor:pointer}.dd-subpage-back ha-icon{--mdc-icon-size:20px}.dd-subpage-title{min-width:0;overflow:hidden;color:var(--primary-text-color);font-size:17px;font-weight:800;line-height:1.2;text-overflow:ellipsis;white-space:nowrap}.dd-settings-page-description{max-width:760px;margin:0 0 14px;color:var(--secondary-text-color);font-size:12px;line-height:1.45}.dd-settings-section{min-width:0;margin-bottom:10px}.dd-settings-section:not(.page-root){overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.dd-settings-section-header{min-height:60px;display:grid;grid-template-columns:40px minmax(0,1fr);align-items:center;gap:8px;padding:8px 12px;box-sizing:border-box}.dd-settings-section-icon,.dd-setting-row-icon{width:40px;height:40px;display:grid;place-items:center;color:var(--primary-color)}.dd-settings-section-icon ha-icon{--mdc-icon-size:23px}.dd-settings-section-copy,.dd-setting-row-copy{min-width:0;display:grid;gap:3px}.dd-settings-section-copy strong,.dd-setting-row-copy strong{color:var(--primary-text-color);font-size:14px;font-weight:700;line-height:1.25}.dd-settings-section-copy small,.dd-setting-row-copy small{max-width:720px;color:var(--secondary-text-color);font-size:11px;line-height:1.4;font-weight:400}.dd-settings-section:not(.page-root)>.dd-settings-section-content{border-top:1px solid var(--divider-color)}.dd-settings-section.page-root>.dd-settings-section-content{min-width:0}.dd-settings-list{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.dd-settings-section:not(.page-root) .dd-settings-list{border:0;border-radius:0}.dd-settings-list-spaced{margin-bottom:18px}.dd-setting-row{min-height:60px;display:grid;grid-template-columns:40px minmax(0,1fr) auto;align-items:center;gap:8px;padding:8px 12px;box-sizing:border-box;cursor:default}.dd-setting-row + .dd-setting-row{border-top:1px solid var(--divider-color)}.dd-setting-row-icon ha-icon{--mdc-icon-size:22px}.dd-setting-row ha-switch{justify-self:end}.dd-home-layout-panel,.dd-inline-section{min-width:0}.dd-home-page-description,.dd-inline-description{margin:0;color:var(--secondary-text-color);font-size:12px;line-height:1.4;font-weight:400}.dd-home-page-description{margin-bottom:14px}.dd-home-flat-layout{padding-top:0}.dd-home-flat-layout.home-layout-section{padding-inline:0}.dd-home-section-block{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.dd-home-section-block.open{background:color-mix(in srgb,var(--primary-color) 1.5%,var(--card-background-color))}.dd-home-section-block>.home-section-item{position:relative;min-height:54px;grid-template-columns:22px 40px minmax(0,1fr) 44px;gap:6px;padding:5px 12px;border:0;border-radius:0;background:transparent;box-shadow:none}.dd-home-section-block.open>.home-section-item::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--divider-color);pointer-events:none}.dd-home-flat-layout .home-section-icon,.dd-flat-sublist .home-section-icon,.dd-climate-area-settings .home-section-icon{border-radius:0;background:transparent;box-shadow:none}.dd-home-flat-layout .home-section-icon{width:40px;height:40px}.dd-home-flat-layout .home-section-icon ha-icon{--mdc-icon-size:23px}.dd-home-flat-layout .home-section-item.disabled .home-section-icon,.dd-flat-sublist .home-info-card-item.disabled .home-section-icon,.dd-climate-area-settings .home-info-card-item.disabled .home-section-icon{background:transparent}.dd-home-flat-layout .home-section-toggle,.dd-flat-sublist .home-section-toggle{border:1px solid color-mix(in srgb,var(--primary-color) 24%,var(--divider-color));border-radius:999px;background:transparent;box-shadow:none}.dd-home-flat-layout .home-section-toggle.enabled,.dd-flat-sublist .home-section-toggle.enabled{color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 5%,transparent)}.dd-home-section-block .home-section-description{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dd-home-section-block .home-section-actions,.home-info-card-actions{display:grid;grid-template-columns:44px;align-items:center;justify-content:end;justify-items:center;justify-self:end;width:44px;margin:0}.dd-icon-action{display:inline-grid;place-items:center;border:0;color:var(--secondary-text-color);background:transparent;cursor:pointer}.dd-icon-action ha-icon{--mdc-icon-size:19px}.dd-integrated-chevron{position:absolute;left:50%;bottom:0;z-index:1;width:30px;height:15px;display:grid;place-items:center;margin:0;padding:0;transform:translateX(-50%);border:0;color:var(--secondary-text-color);background:transparent;cursor:pointer}.dd-home-section-block.open>.home-section-item .dd-integrated-chevron,.dd-flat-subitem.open>.dd-flat-subitem-row .dd-integrated-chevron{color:var(--primary-color);background:transparent}.dd-integrated-chevron ha-icon{width:14px;height:14px;--mdc-icon-size:14px}.dd-home-inline-detail{margin-left:72px;padding:5px 0 8px 10px;border-left:1px solid color-mix(in srgb,var(--primary-color) 34%,transparent)}.dd-flat-subdetail{margin-left:18px;padding:3px 0 0 10px;border-left:1px solid color-mix(in srgb,var(--primary-color) 34%,transparent)}.dd-home-house-information .dd-inline-section{padding-bottom:0}.dd-flat-sublist,.dd-climate-area-settings .home-info-card-list{display:grid;gap:0;overflow:hidden;border-top:0}.dd-home-house-information .dd-flat-sublist{overflow:visible}.dd-flat-subitem + .dd-flat-subitem,.dd-flat-subitem-row + .dd-flat-subitem-row{border-top:1px solid var(--divider-color)}.dd-flat-subitem.open>.dd-flat-subitem-row{border-bottom:0}.dd-flat-subitem.open>.dd-flat-subitem-row::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--divider-color);pointer-events:none}.dd-flat-subitem-row{position:relative;min-height:50px;display:grid;grid-template-columns:36px minmax(0,1fr) 48px;align-items:center;gap:9px;padding:6px 12px 6px 0;box-sizing:border-box}.dd-flat-subitem-row.has-detail{cursor:pointer}.dd-draggable-subitem{grid-template-columns:22px 40px minmax(0,1fr) 48px;cursor:grab}.dd-flat-subitem-row .home-section-icon{width:36px;height:36px}.dd-inline-actions{display:inline-flex;align-items:center;justify-content:flex-end;gap:2px;white-space:nowrap}.dd-icon-action{width:32px;height:32px;border-radius:999px}.dd-climate-area-settings{padding:0}.dd-climate-area-settings .home-info-card-item{min-height:0;display:grid;grid-template-columns:32px minmax(0,1fr) 48px;align-items:center;gap:10px;margin:0;padding:4px 12px 4px 8px;border:0;border-bottom:1px solid var(--divider-color);border-radius:0;background:transparent;box-shadow:none}.dd-climate-area-settings .home-info-card-item:last-child{border-bottom:0}.dd-climate-area-settings .home-section-icon{width:32px;height:32px}.dd-climate-actions{display:flex;align-items:center;justify-content:center;justify-self:end;width:48px}.dd-climate-actions ha-switch{transform:scale(.9);transform-origin:center}.dd-favorite-suggestions-row ha-switch{transform:scale(.9);transform-origin:right center}.dd-climate-description{padding:6px 8px}.dd-inline-action-row{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin:0;padding:8px 8px}.home-custom-card-add{width:auto;min-height:34px;padding:7px 12px}.dd-empty-state,.no-favorites{margin:8px 0 2px;padding:14px 10px;border:0;border-radius:0;background:transparent;color:var(--secondary-text-color);text-align:center;font-size:12px;line-height:1.45}.dd-favorites-inline{display:grid;gap:16px;padding:0}.dd-favorites-options-card,.dd-favorites-list-card{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.dd-favorites-options-card .dd-setting-row{min-height:64px;margin:0;border:0;border-radius:0}.dd-favorites-options-card .dd-setting-row-icon{color:var(--primary-color)}.dd-favorites-picker{padding:0}.dd-favorites-list-card .dd-inline-action-row{padding:10px 12px;border-bottom:1px solid var(--divider-color)}.dd-favorites-list-head{justify-content:space-between}.dd-favorites-list-head>strong{color:var(--primary-text-color);font-family:var(--ha-font-family-body,inherit);font-size:15px;font-weight:700;line-height:1.25}.dd-favorites-list-card .selected-entities{padding:10px 12px 12px}.dd-favorites-list-card .no-favorites{margin:0;padding:18px 12px}@media (min-width:701px){.dd-flat-settings{padding-top:8px}.dd-flat-settings:not(.dd-settings-overview) .settings-detail-content{width:100%;margin-top:0}}@media (max-width:700px){.dd-flat-settings{padding-inline:10px}.dd-flat-settings .settings-nav-section,.dd-flat-settings .settings-detail-content,.dd-subpage-header,.dd-settings-version-footer{max-width:none}.dd-subpage-header{margin-bottom:10px}}@media (max-width:600px){.dd-settings-page-description{margin-bottom:10px}.dd-settings-section-header,.dd-setting-row{grid-template-columns:36px minmax(0,1fr) auto;padding-inline:8px}.dd-settings-section-icon,.dd-setting-row-icon{width:36px;height:36px}.dd-home-page-description{margin-bottom:10px}.dd-home-flat-layout.home-layout-section{padding-inline:0}.dd-home-flat-layout .home-section-list{width:100%}.dd-home-section-block>.home-section-item,.dd-home-section-block>.home-section-item.has-detail{grid-template-columns:18px 40px minmax(0,1fr) 40px;gap:6px;padding:7px 8px}.dd-home-section-block .home-section-icon{width:40px;height:40px}.dd-home-section-block .home-section-icon ha-icon{--mdc-icon-size:23px}.dd-home-section-block .home-section-actions{grid-template-columns:40px;width:40px;justify-self:end}.home-info-card-actions{grid-template-columns:40px;width:40px;justify-self:end}.dd-integrated-chevron{height:14px}.dd-home-section-block .home-section-title{font-size:14px}.dd-home-section-block .home-section-description{font-size:11px;line-height:1.3}.dd-home-inline-detail{margin-left:52px;padding:4px 0 6px 10px}.dd-flat-subdetail{margin-left:18px;padding:2px 0 0 10px}.dd-flat-subitem-row{grid-template-columns:36px minmax(0,1fr) 40px;gap:8px;padding:6px 8px 6px 0}.dd-draggable-subitem{grid-template-columns:20px 36px minmax(0,1fr) 40px}.dd-flat-subitem-row .home-section-icon{width:36px;height:36px}.dd-flat-subitem-row .home-section-toggle{width:36px;height:36px}.dd-climate-area-settings .home-info-card-item{grid-template-columns:30px minmax(0,1fr) 48px;padding:4px 10px 4px 8px}.dd-climate-area-settings .home-section-icon{width:30px;height:30px}.dd-inline-action-row{padding-right:8px}.dd-settings-version-footer{margin-top:18px;font-size:10px}}.settings-nav-section{margin-bottom:14px}.settings-nav-section h3{min-height:34px;margin:0 0 6px;padding:0 4px;color:var(--secondary-text-color);font-size:13px;font-weight:700}.settings-nav-item{min-height:70px;grid-template-columns:36px minmax(0,1fr) auto 24px;gap:12px;padding:10px 14px}.settings-nav-icon{width:36px;height:36px;border-radius:0;color:var(--settings-item-color);background:transparent}.settings-nav-icon ha-icon,.settings-nav-icon svg,.settings-nav-gradient-icon{width:25px;height:25px;fill:currentColor;--mdc-icon-size:25px}.settings-nav-icon.support-gradient{color:inherit}.settings-nav-gradient-icon{overflow:visible}.dd-header-status-list{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.dd-header-status-list>.dd-setting-row,.dd-header-feature-row{min-height:60px;display:grid;grid-template-columns:40px minmax(0,1fr) auto;align-items:center;gap:8px;padding:8px 12px;box-sizing:border-box}.dd-header-status-list>.dd-setting-row{border:0;border-radius:0}.dd-header-status-list>.dd-setting-row + .dd-setting-row,.dd-header-feature{border-top:1px solid var(--divider-color)}.dd-header-feature-actions{display:inline-flex;align-items:center;justify-content:flex-end;gap:8px;white-space:nowrap}.dd-header-status-settings{display:grid;gap:16px}.dd-status-people-card{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.dd-status-people-card .dd-status-people-heading{min-height:60px}.dd-status-people-card .dd-status-people-list{padding:12px;border-top:1px solid var(--divider-color)}.dd-status-people-card .persons-list{border:0;border-radius:0}.dd-now-playing-settings{margin:0;padding:0 12px 12px;border:1px solid var(--divider-color);border-radius:12px;background:color-mix(in srgb,var(--card-background-color) 97%,var(--primary-background-color))}.dd-now-playing-settings .dd-now-playing-heading{min-height:68px;padding-inline:0}.dd-now-playing-icon{color:var(--primary-color) !important}.dd-now-playing-segments{width:100%;margin:0}.dd-now-playing-segments .area-sort-segment{min-height:48px}.dd-now-playing-segments .area-sort-segment ha-icon{--mdc-icon-size:19px}.dd-inline-text-button,.dd-icon-text-button{min-height:32px;padding:0 8px;border:0;border-radius:8px;color:var(--primary-color);background:transparent;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.dd-inline-text-button:hover,.dd-icon-text-button:hover{background:color-mix(in srgb,var(--primary-color) 7%,transparent)}.dd-settings-inline-link{display:inline;width:auto;margin:0 0 0 4px;padding:0;border:0;background:transparent;color:var(--primary-color);font:inherit;font-size:inherit;font-weight:650;line-height:inherit;vertical-align:baseline;cursor:pointer}.dd-settings-inline-link:hover{text-decoration:underline}.dd-setting-row-with-link{cursor:default}.dd-icon-text-button{width:32px;padding:0;display:inline-grid;place-items:center}.dd-icon-text-button.danger{color:var(--error-color,#f44336);border:1px solid color-mix(in srgb,var(--error-color,#f44336) 28%,var(--divider-color));background:color-mix(in srgb,var(--error-color,#f44336) 6%,var(--card-background-color))}.dd-icon-text-button.danger:hover{background:color-mix(in srgb,var(--error-color,#f44336) 11%,var(--card-background-color))}.dd-icon-text-button ha-icon{--mdc-icon-size:18px}.master-confirmation-section.dd-simple-settings-stack{gap:8px;padding:0}.master-confirmation-note{padding:4px 2px 8px;border-radius:0;color:var(--secondary-text-color);background:transparent;font-size:12px}.master-confirmation-note ha-icon{color:#0f9f8f;--mdc-icon-size:18px}.master-confirmation-list{border-radius:12px}.master-confirmation-row{grid-template-columns:40px minmax(0,1fr) auto;gap:8px;min-height:60px;padding:8px 12px}.master-confirmation-icon{width:40px;height:40px;border-radius:0;color:#0f9f8f;background:transparent}.master-confirmation-control{gap:0}.master-confirmation-control>span{display:none}.entity-display-section{padding:0}.entity-display-section>.dd-settings-list-spaced{margin-bottom:16px}.area-order-settings{width:100%;margin:0 0 16px;padding:14px;box-sizing:border-box;border-radius:12px}.area-order-settings .area-order-list-hint{margin:12px 0 0}.area-order-settings .area-settings-sortable{margin-top:12px}.area-settings-sortable{padding:0;gap:8px}.area-settings-sortable .dd-area-sortable-row{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);box-shadow:none}.area-settings-sortable .dd-area-sortable-row .area-item{min-height:62px;padding:8px 12px;box-sizing:border-box}.area-settings-sortable .sortable-item.dragging{opacity:0.28;transform:none}.area-settings-sortable .sortable-item.drag-over::before{display:none}.area-settings-sortable .sortable-item.drag-over{background:color-mix(in srgb,var(--primary-color) 4%,var(--card-background-color))}.area-settings-sortable .handle{margin-right:0;padding:6px 2px;background:transparent}.area-detail-editor .area-entity-section-header{cursor:grab}.area-detail-editor .area-entity-section-header:active{cursor:grabbing}.area-detail-editor .area-entity-section-handle{cursor:inherit}.area-settings-sortable .area-icon{width:40px;margin-right:6px;color:var(--primary-color);--mdc-icon-size:22px}.device-visibility-section{margin-top:20px;display:grid;gap:10px}.device-admission-groups{display:grid;gap:8px}.device-type-panel{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);content-visibility:auto;contain-intrinsic-size:auto 70px}.device-type-panel.open{background:color-mix(in srgb,var(--primary-color) 1.5%,var(--card-background-color))}.device-type-panel.disabled{opacity:0.58}.device-type-panel-row{position:relative;min-height:62px;display:grid;grid-template-columns:40px minmax(0,1fr) 44px;align-items:center;gap:8px;padding:8px 12px;box-sizing:border-box}.device-type-panel-row.expandable{cursor:pointer}.device-type-panel-row .device-type-icon.small{width:40px;height:40px;border-radius:0;color:var(--primary-color);background:transparent}.device-type-heading{min-width:0;display:flex;align-items:baseline;gap:8px}.device-type-heading strong{min-width:0;overflow:hidden;color:var(--primary-text-color);font-size:14px;font-weight:700;line-height:1.25;text-overflow:ellipsis;white-space:nowrap}.device-type-heading small{flex:0 0 auto;color:var(--secondary-text-color);font-size:12px;font-weight:600}.dd-visibility-button{width:40px;height:40px;display:inline-grid;place-items:center;justify-self:end;padding:0;border:1px solid color-mix(in srgb,var(--primary-color) 24%,var(--divider-color));border-radius:999px;color:var(--primary-color);background:transparent;cursor:pointer}.dd-visibility-button.hidden{color:var(--secondary-text-color);border-color:var(--divider-color)}.dd-visibility-button.partial{border-style:dashed}.dd-visibility-button ha-icon{--mdc-icon-size:20px}.device-type-chevron{left:50%;bottom:-1px}.device-type-panel.open>.device-type-panel-row{border-bottom:1px solid var(--divider-color)}.device-admission-panel{display:grid;gap:0;padding:0}.device-admission-area{display:grid;gap:0;padding:0;border:0;border-radius:0;background:transparent}.device-admission-area + .device-admission-area{border-top:1px solid var(--divider-color)}.device-admission-area-header{min-height:52px;display:grid;grid-template-columns:minmax(0,1fr) 44px;align-items:center;gap:8px;padding:6px 12px 6px 52px;box-sizing:border-box}.device-admission-device-list{display:grid;grid-template-columns:1fr;gap:0;padding:0 12px 8px 52px}.device-admission-device{min-height:52px;display:grid;grid-template-columns:34px minmax(0,1fr) 44px;align-items:center;gap:8px;padding:6px 0;border:0;border-top:1px solid var(--divider-color);border-radius:0;background:transparent;box-shadow:none}.device-admission-device .device-type-icon{width:34px;height:34px;color:var(--primary-color)}.device-admission-device.hidden{opacity:0.52;background:transparent}.device-admission-copy .device-type-count{margin-top:2px}ha-expansion-panel{border-radius:12px;overflow:hidden}@media (max-width:700px){.settings-nav-item{grid-template-columns:32px minmax(0,1fr) auto 20px;gap:8px;padding-inline:10px}.settings-nav-icon{width:32px;height:32px}.settings-nav-icon ha-icon,.settings-nav-icon svg,.settings-nav-gradient-icon{width:22px;height:22px;--mdc-icon-size:22px}.dd-header-status-list>.dd-setting-row,.dd-header-feature-row{grid-template-columns:36px minmax(0,1fr) auto;padding-inline:8px}.dd-header-feature-actions{gap:4px}.device-type-heading{flex-wrap:wrap;gap:2px 8px}.device-type-heading small{width:100%}.device-admission-area-header{padding-left:12px}.device-admission-device-list{padding-left:12px}}.dd-flat-settings{max-width:920px;margin-inline:auto}.dd-flat-settings .settings-nav-section,.dd-flat-settings .settings-detail-content,.dd-flat-settings .dd-settings-version-footer{max-width:none;width:100%}.settings-nav-section h3{min-height:28px;margin:0 0 7px;padding:0 2px;font-size:14px;font-weight:750;color:var(--primary-text-color)}.settings-nav-section + .settings-nav-section{margin-top:18px}.area-sort-segmented{width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));overflow:hidden;border:1px solid var(--divider-color);border-radius:10px;background:var(--secondary-background-color)}.area-sort-segment,.area-detail-editor .area-entity-layout-settings .area-order-mode{min-width:0;min-height:42px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:8px 10px;border:0;border-right:1px solid var(--divider-color);color:var(--primary-text-color);background:transparent;font:inherit;font-size:12px;font-weight:650;cursor:pointer;box-shadow:none}.area-sort-segment:last-child{border-right:0}.area-sort-segment:hover,.area-detail-editor .area-entity-layout-settings .area-order-mode:hover{color:var(--primary-text-color);background:color-mix(in srgb,var(--primary-color) 4%,transparent)}.area-sort-segment.selected,.area-detail-editor .area-entity-layout-settings .area-order-mode.selected{color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 9%,var(--card-background-color))}.area-sort-segment ha-icon,.area-detail-editor .area-entity-layout-settings .area-order-mode ha-icon{color:currentColor;--mdc-icon-size:18px}.area-detail-editor .area-entity-layout-settings .area-order-mode strong{color:inherit;font-size:12px;font-weight:650}.area-order-list-hint{margin:0 2px 8px;color:var(--secondary-text-color);font-size:12px;line-height:1.4}.dd-integrated-chevron ha-icon{width:18px;height:18px;--mdc-icon-size:18px}.dd-integrated-chevron{width:34px;height:18px}.persons-list .person-item{display:grid;grid-template-columns:40px minmax(0,1fr) 44px;gap:8px}.persons-list .dd-visibility-button{justify-self:end}.master-confirmation-control{display:inline-flex;align-items:center;justify-content:flex-end;gap:12px}.master-confirmation-control>span{display:block;min-width:116px;color:var(--secondary-text-color);font-size:12px;font-weight:600;text-align:right}.device-type-panel{--device-type-color:var(--primary-color)}.device-type-panel-row .device-type-icon.small,.device-type-panel .device-admission-device .device-type-icon{color:var(--device-type-color)}.device-type-panel .dd-visibility-button{color:var(--device-type-color);border-color:color-mix(in srgb,var(--device-type-color) 30%,var(--divider-color))}.device-type-panel .dd-visibility-button.hidden{color:var(--secondary-text-color);border-color:var(--divider-color)}.device-admission-device-list{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:0 12px 12px 52px}.device-admission-device{min-width:0;min-height:62px;grid-template-columns:32px minmax(0,1fr) 38px;gap:7px;padding:8px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color)}.device-admission-device + .device-admission-device{border-top:1px solid var(--divider-color)}.device-admission-device.hidden{background:color-mix(in srgb,var(--secondary-background-color) 70%,var(--card-background-color))}.device-admission-device .dd-visibility-button{width:34px;height:34px}.device-admission-copy{min-width:0}.device-admission-copy .device-type-name{display:-webkit-box;overflow:hidden;white-space:normal;text-overflow:clip;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow-wrap:break-word;word-break:normal;font-size:12px;font-weight:650;line-height:1.2}.device-admission-copy .device-type-count{font-size:10px}.dd-replacement-settings{padding:0;display:grid;gap:12px}.dd-replacement-list{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.dd-replacement-row{min-height:62px;display:grid;grid-template-columns:40px minmax(0,1fr) auto;align-items:center;gap:8px;padding:8px 12px}.dd-replacement-row + .dd-replacement-row{border-top:1px solid var(--divider-color)}.dd-replacement-row.disabled{opacity:0.55}.dd-replacement-domain-icon{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,var(--card-background-color));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--primary-color) 10%,transparent)}.dd-replacement-domain-icon ha-icon{--mdc-icon-size:20px}.dd-replacement-copy{min-width:0;display:grid;gap:3px}.dd-replacement-copy strong{font-size:14px}.dd-replacement-copy small{overflow:hidden;color:var(--secondary-text-color);font-size:11px;text-overflow:ellipsis;white-space:nowrap}.dd-replacement-actions{display:inline-flex;align-items:center;gap:10px}.dd-replacement-enabled{display:inline-flex;align-items:center;margin:0}.dd-replacement-empty{padding:18px;border:1px dashed var(--divider-color);border-radius:12px;color:var(--secondary-text-color);font-size:12px;text-align:center}.dd-replacement-footer{display:flex;justify-content:flex-start}.dd-replacement-footer ha-button ha-icon{--mdc-icon-size:18px;margin-right:5px}@media (max-width:700px){.dd-flat-settings{max-width:none}.area-sort-segmented{grid-template-columns:1fr}.area-sort-segment{justify-content:center;text-align:center;border-right:0;border-bottom:1px solid var(--divider-color)}.area-sort-segment:last-child{border-bottom:0}.device-admission-device-list{grid-template-columns:repeat(2,minmax(0,1fr));padding-left:12px}.master-confirmation-control>span{min-width:0;max-width:110px}.dd-replacement-row{grid-template-columns:36px minmax(0,1fr)}.dd-replacement-actions{grid-column:2;justify-self:start}}.dd-flat-settings{width:100%;max-width:none;margin-inline:0;padding:24px 20px 20px;box-sizing:border-box}@media (min-width:701px){.dd-flat-settings{padding-top:24px}.dd-flat-settings:not(.dd-settings-overview) .settings-detail-content{margin-top:0}}.dd-flat-settings .dd-setting-row-icon,.dd-flat-settings .dd-settings-section-icon{color:var(--primary-color)}.dd-flat-settings ha-switch{--switch-checked-color:var(--primary-color);--md-switch-selected-track-color:var(--primary-color);--md-switch-selected-focus-track-color:var(--primary-color);--md-switch-selected-hover-track-color:var(--primary-color);--md-switch-selected-pressed-track-color:var(--primary-color)}.dd-flat-settings .dd-visibility-button:not(.hidden){color:var(--primary-color);border-color:color-mix(in srgb,var(--primary-color) 24%,var(--divider-color))}.dd-flat-settings .area-sort-segment.selected,.dd-flat-settings .area-order-mode.selected{color:var(--primary-color);border-color:color-mix(in srgb,var(--primary-color) 32%,var(--divider-color));background:color-mix(in srgb,var(--primary-color) 7%,var(--card-background-color))}.device-type-panel-row>.device-type-icon.small{color:var(--device-type-color)}.device-type-panel .device-admission-device .device-type-icon{color:var(--secondary-text-color)}.device-type-panel .dd-visibility-button,.device-type-panel .dd-visibility-button.hidden{color:var(--device-type-color);border-color:color-mix(in srgb,var(--device-type-color) 30%,var(--divider-color))}.device-type-panel .dd-visibility-button.hidden{color:var(--secondary-text-color);border-color:var(--divider-color)}.device-type-panel-row .device-type-heading{flex-wrap:nowrap;gap:8px}.device-type-panel-row .device-type-heading small{width:auto}.device-area-heading{display:grid;gap:2px;align-items:center}.device-area-heading small{width:100%}.device-admission-device{min-height:56px;padding:6px 8px}.device-admission-copy .device-type-name{display:-webkit-box;overflow:hidden;white-space:normal;text-overflow:clip;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;line-height:1.2;overflow-wrap:break-word;word-break:normal}.dd-replacement-footer{justify-content:flex-end}@media (max-width:700px){.dd-flat-settings{padding:18px 10px 16px}.device-type-panel-row .device-type-heading{flex-wrap:nowrap}.device-type-panel-row .device-type-heading small{width:auto}.device-area-heading{display:grid}.device-area-heading small{width:100%}}.entity-picker-content{box-sizing:border-box}.entity-option{width:100%;border:1px solid transparent;color:inherit;font:inherit;text-align:left}.entity-option.selected{border-color:color-mix(in srgb,var(--primary-color) 42%,var(--divider-color));background:color-mix(in srgb,var(--primary-color) 8%,var(--card-background-color))}.entity-option-copy{min-width:0;flex:1;display:grid;gap:2px}.entity-option-copy .entity-name,.entity-option-copy .entity-id{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.entity-selected-icon{flex:0 0 auto;color:var(--primary-color);--mdc-icon-size:20px}.entity-picker-footer{display:flex;justify-content:flex-end;margin-top:12px;padding-top:10px;border-top:1px solid var(--divider-color)}.persons-list{overflow:visible;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px;border:0;border-radius:0;background:transparent}.persons-list .person-item{min-width:0;min-height:0;display:grid;grid-template-columns:40px minmax(0,1fr) 34px;align-items:center;gap:8px;padding:8px;box-sizing:border-box;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color)}.persons-list .person-item + .person-item{border-top:1px solid var(--divider-color)}.person-avatar{width:40px;height:40px;display:grid;place-items:center;overflow:hidden;border-radius:999px;background:var(--secondary-background-color)}.person-avatar img{width:100%;height:100%;display:block;object-fit:cover}.person-avatar .person-icon{margin:0;--mdc-icon-size:25px}.persons-list .person-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:650}.persons-list .dd-visibility-button{width:30px;height:30px}.area-sort-segment{align-items:center;line-height:1.2}.area-sort-segment>span,.area-sort-segment ha-icon{align-self:center}.area-settings-sortable .dd-area-sortable-row .area-item{display:grid;grid-template-columns:46px minmax(0,1fr) 48px;align-items:center;gap:6px}.area-settings-sortable.is-custom-order .dd-area-sortable-row .area-item{grid-template-columns:22px 46px minmax(0,1fr) 48px}.area-settings-sortable .handle{width:22px;height:40px;display:grid;place-items:center;margin:0;padding:0}.area-settings-sortable .area-icon{width:46px;height:46px;display:grid;place-items:center;margin:0;--mdc-icon-size:25px}.area-settings-sortable .area-name{min-width:0;margin:0}.area-settings-sortable .area-actions{width:48px;justify-content:flex-end}.device-area-heading{display:flex;align-items:baseline;gap:8px}.device-area-heading{display:inline-flex !important;flex-wrap:nowrap !important;align-items:baseline;gap:8px;min-width:0;white-space:nowrap}.device-area-heading strong{flex:0 1 auto;min-width:0}.device-area-heading small{width:auto !important;flex:0 0 auto;white-space:nowrap}.device-admission-device{min-height:44px;padding:4px 7px;grid-template-columns:30px minmax(0,1fr) 34px;gap:6px}.device-admission-device .device-type-icon{width:30px;height:30px}.device-admission-device .device-type-icon ha-icon{--mdc-icon-size:18px}.device-admission-device .dd-visibility-button{width:32px;height:32px}.device-admission-device-list{grid-template-columns:repeat(4,minmax(0,1fr))}.device-admission-device{min-height:58px;align-items:center;cursor:default}.device-admission-device.interactive{cursor:pointer}.device-admission-device.interactive:hover{background:color-mix(in srgb,var(--primary-color) 4%,var(--card-background-color));border-color:color-mix(in srgb,var(--primary-color) 24%,var(--divider-color))}.device-admission-copy{align-self:center;display:flex;min-width:0;flex-direction:column;justify-content:center}.device-admission-copy .device-type-name{font-size:11.5px;line-height:1.18;overflow-wrap:normal;word-break:normal;hyphens:none}.device-admission-copy .device-type-count{margin-top:2px;font-size:9.5px}@media (max-width:820px){.device-admission-device-list{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:520px){.device-admission-device-list{grid-template-columns:1fr}}.area-detail-editor{padding:16px}.area-detail-editor>.toolbar{min-height:42px;display:flex;align-items:center;gap:6px;margin:0 0 10px;padding:0;background:transparent;border:0}.area-detail-editor>.toolbar ha-icon-button{width:38px;height:38px;--mdc-icon-button-size:38px;--mdc-icon-size:22px}.area-detail-editor>.toolbar h2{margin:0;font-size:17px;font-weight:800}.area-detail-editor .area-help{margin:0 0 12px;padding:10px 12px;border:1px solid var(--divider-color);border-radius:10px;background:color-mix(in srgb,var(--secondary-background-color) 72%,var(--card-background-color))}.area-detail-editor .area-help-icon{color:var(--secondary-text-color)}.area-detail-editor .area-help-text p{margin:0}.area-detail-editor .area-help-text p + p{margin-top:5px}.area-detail-editor .area-entity-layout-settings{margin:0 0 12px;padding:14px;border-radius:12px;overflow:hidden}.area-detail-editor .area-entity-layout-settings>.area-entity-section,.area-detail-editor .area-entity-layout-settings>.area-free-order-section{margin:0}.area-detail-editor .area-entity-layout-settings>.area-entity-section>ha-expansion-panel{margin-bottom:0}.area-entity-layout-hint{margin:0;color:var(--secondary-text-color);font-size:12px;line-height:1.4}.area-detail-editor .area-entity-section{margin:0 0 8px}.area-detail-editor .area-entity-section ha-expansion-panel,.area-detail-editor>ha-expansion-panel{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.area-detail-editor .area-entity-section-header{min-height:52px;display:grid;grid-template-columns:40px minmax(0,1fr) auto;align-items:center;gap:8px}.area-detail-editor .area-entity-section-header>ha-icon{justify-self:center;color:var(--primary-color);--mdc-icon-size:22px}.area-detail-editor .area-entity-section .sortable-container{padding:0 10px 8px}.area-detail-editor .area-entity-section .sortable-item{border-radius:9px}.area-detail-editor .area-entity-section .entity-item{min-height:46px;padding:4px 6px}.area-list-reset{margin-top:10px}.area-layout-actions{margin-top:10px;display:flex;align-items:center;flex-wrap:wrap;gap:8px}.area-layout-actions .home-layout-reset{margin:0}.master-confirmation-note ha-icon,.master-confirmation-icon{color:var(--primary-color)}.area-detail-editor .area-entity-layout-settings{padding:10px 12px 12px;gap:8px}.area-detail-editor .area-entity-layout-settings .area-order-modes{gap:0;overflow:hidden;border:1px solid var(--divider-color);border-radius:10px;background:var(--secondary-background-color)}.area-detail-editor .area-entity-layout-settings .area-order-mode:last-child{border-right:0}.area-detail-editor .area-entity-section-header{min-height:52px;grid-template-columns:28px 32px minmax(0,1fr) 40px;gap:8px;padding:6px 12px 8px}.area-detail-editor .area-entity-section-handle{width:28px;height:36px}.area-detail-editor .area-entity-section-header>ha-icon{justify-self:center;--mdc-icon-size:21px}.area-detail-editor .area-entity-section-title{justify-self:start;text-align:left}.area-detail-editor .area-entity-section .sortable-container{gap:0;padding:0;border-top:1px solid var(--divider-color)}.area-detail-editor .area-entity-section .sortable-item{border:0;border-radius:0;background:transparent}.area-detail-editor .area-entity-section .sortable-item + .sortable-item{border-top:1px solid var(--divider-color)}.area-detail-editor .area-entity-section .entity-item{min-height:48px;padding:5px 10px}.area-detail-editor .area-entity-section .sortable-item:hover{background:color-mix(in srgb,var(--primary-color) 3%,transparent)}.area-entity-layout-heading{min-height:32px;display:flex;align-items:center;justify-content:space-between;gap:12px}.area-entity-layout-heading>strong{font-size:14px}.area-reset-button{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}.area-reset-button ha-icon{--mdc-icon-size:17px}.area-free-order-section{overflow:hidden;margin:0 0 8px;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.area-free-order-header{min-height:52px;display:grid;grid-template-columns:40px minmax(0,1fr);align-items:center;gap:8px;padding:6px 12px;box-sizing:border-box}.area-free-order-header ha-icon{justify-self:center;color:var(--primary-color);--mdc-icon-size:21px}.area-free-order-header strong{font-size:14px}.area-free-order-section .sortable-container{gap:0;padding:0;border-top:1px solid var(--divider-color)}.area-free-order-section .sortable-item{border:0;border-radius:0;background:transparent}.area-free-order-section .sortable-item + .sortable-item{border-top:1px solid var(--divider-color)}.area-free-order-section .entity-item{min-height:48px;padding:5px 10px 5px 18px}.area-detail-editor .area-entity-section-header{grid-template-columns:18px 40px minmax(0,1fr) 40px;gap:6px;padding:7px 8px 9px}.area-detail-editor .area-entity-section-handle{width:18px;height:40px}.area-detail-editor .area-entity-section-header>ha-icon{width:40px;justify-self:center;color:var(--area-group-color,var(--primary-color));--mdc-icon-size:23px}.area-detail-editor .area-entity-section-title{font-size:14px}.area-detail-editor .area-entity-section .entity-item{padding-left:18px;background:color-mix(in srgb,var(--secondary-background-color) 44%,transparent)}.area-detail-editor .area-entity-section .entity-icon{color:var(--secondary-text-color)}.area-detail-editor .area-entity-section .sortable-item:hover .entity-item{background:color-mix(in srgb,var(--secondary-background-color) 72%,transparent)}@media (max-width:700px){.persons-list{grid-template-columns:repeat(2,minmax(0,1fr))}.area-settings-sortable .dd-area-sortable-row .area-item{grid-template-columns:40px minmax(0,1fr) 40px}.area-settings-sortable.is-custom-order .dd-area-sortable-row .area-item{grid-template-columns:18px 40px minmax(0,1fr) 40px}.area-settings-sortable .area-icon{width:40px;height:40px;--mdc-icon-size:23px}.area-settings-sortable .handle{width:18px}.area-settings-sortable .area-actions{width:40px}}@media (max-width:430px){.persons-list{grid-template-columns:1fr}}`}};e([t({type:Boolean})],Pt.prototype,"inlineBackNavigation",void 0),e([t({attribute:!1})],Pt.prototype,"hass",null),e([i()],Pt.prototype,"_config",void 0),e([i()],Pt.prototype,"_area",void 0),e([i()],Pt.prototype,"_loading",void 0),e([i()],Pt.prototype,"_draggedAreaId",void 0),e([i()],Pt.prototype,"_dragOverIndex",void 0),e([i()],Pt.prototype,"_areaPreviewOrder",void 0),e([i()],Pt.prototype,"_expandedDeviceTypes",void 0),e([i()],Pt.prototype,"_draggedHomeSection",void 0),e([i()],Pt.prototype,"_dragOverHomeSectionIndex",void 0),e([i()],Pt.prototype,"_homeSectionPreviewOrder",void 0),e([i()],Pt.prototype,"_draggedHomeCamera",void 0),e([i()],Pt.prototype,"_dragOverHomeCameraIndex",void 0),e([i()],Pt.prototype,"_draggedEntityId",void 0),e([i()],Pt.prototype,"_draggedEntityGroup",void 0),e([i()],Pt.prototype,"_dragOverEntityIndex",void 0),e([i()],Pt.prototype,"_draggedEntitySection",void 0),e([i()],Pt.prototype,"_dragOverEntitySection",void 0),e([i()],Pt.prototype,"_areaGroupPreviewOrder",void 0),e([i()],Pt.prototype,"_collapsedAreaEntityGroups",void 0),e([i()],Pt.prototype,"_areaGroupOrderDirty",void 0),e([i()],Pt.prototype,"_draggedAreaCustomCardId",void 0),e([i()],Pt.prototype,"_dragOverAreaCustomCardTarget",void 0),e([i()],Pt.prototype,"_showEntityPicker",void 0),e([i()],Pt.prototype,"_entitySearchFilter",void 0),e([i()],Pt.prototype,"_showWeatherPicker",void 0),e([i()],Pt.prototype,"_weatherSearchFilter",void 0),e([i()],Pt.prototype,"_showAlarmPicker",void 0),e([i()],Pt.prototype,"_alarmSearchFilter",void 0),e([i()],Pt.prototype,"_showHomeScenePicker",void 0),e([i()],Pt.prototype,"_homeSceneSearch",void 0),e([i()],Pt.prototype,"_settingsPage",void 0),e([i()],Pt.prototype,"_homeSettingsDetail",void 0),e([i()],Pt.prototype,"_dashboardId",void 0),e([i()],Pt.prototype,"_dashboardTitle",void 0),e([i()],Pt.prototype,"_dashboardIcon",void 0),Pt=e([a("dwains-dashboard-next-strategy-editor")],Pt);var Ot=Object.freeze({__proto__:null,get DwainsDashboardStrategyEditor(){return Pt}});export{rt as H,ot as a,Je as b,Ze as c,ct as d,lt as e,pt as f,at as g,gt as h,Xe as i,$t as j,Me as k,Be as l,Ct as m,Ue as n,it as o,et as p,tt as q,_t as r,Et as s,Ot as t};
