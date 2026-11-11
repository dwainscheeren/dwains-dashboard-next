import{_ as e,n as t,r as i,t as s}from"./state-Ch1yw9_s.js";import{P as a,K as o,a5 as r,a6 as n,E as d,r as c,a7 as l,a8 as h,C as p,B as g,H as _,I as m,J as u,x as v,a9 as f,aa as y,s as b,ab as x,ac as $,ad as w,ae as k,af as C,ag as S,ah as E,ai as D,aj as H,_ as I,ak as A,$ as P,al as O,am as L,an as z,ao as T,ap as F,aq as j,ar as N,as as M,a1 as V,at as B}from"./screensaver-media-6u5xCEkn.js";import{a as G,i as R,A as W,b as K}from"./lit-element-D6iXJla1.js";import{m as U}from"./memoize-one.esm-BAtLgO95.js";import{_ as q,B as Z,n as X,$ as Y,g as J,b as Q,M as ee,a0 as te,a1 as ie,a2 as se,G as ae,a3 as oe,d as re,h as ne,a4 as de,a5 as ce,E as le,o as he,O as pe,K as ge,f as _e,N as me,a6 as ue,a7 as ve}from"./master-action-confirmations-prWHnR4i.js";import{b as fe,p as ye,d as be,s as xe,f as $e}from"./confirm-dialog-sj6nDODt.js";import{a as we,d as ke,c as Ce,b as Se}from"./localize-DC9lHZVH.js";import{n as Ee,w as De,u as He,D as Ie,H as Ae,v as Pe,r as Oe,f as Le,x as ze,s as Te,y as Fe,j as je,z as Ne,A as Me,B as Ve,C as Be,E as Ge,F as Re,G as We,I as Ke,J as Ue}from"./now-playing-IReG8bU3.js";import{s as qe,g as Ze}from"./security-DZVTMiKe.js";import"./directive-BcM-F-Rh.js";const Xe=[["alarm_control_panel",["alarm-control-panel","alarm card","alarm_control_panel","alarm"]],["media_player",["media-player","media player","mediaplayer"]],["binary_sensor",["binary_sensor","binary sensor","motion sensor","window sensor","door sensor","motion/window/door"]],["cover",["mushroom-cover","slider-button-cover","replace_slider_button_cover","cover card","cover"]],["climate",["mushroom-climate","climate card","climate"]],["switch",["slider-button-switch","replace_slider_button_switch","switch card","switch"]],["light",["mushroom-light","slider-button-light","replace_slider_button_light","light card","light"]],["fan",["mushroom-fan","slider-button-fan","replace_slider_button_fan","fan card","fan"]],["lock",["mushroom-lock","lock card","lock"]],["person",["mushroom-person","person card","person"]],["update",["mushroom-update","update card","update"]],["vacuum",["mushroom-vacuum","vacuum card","vacuum"]],["sensor",["sensor card","sensor"]]],Ye=new Set(["replace_with_input_entity","replace_with_input_entity_id","replace_with_input_name","replace_with_input_domain","replace_with_input_device_class","replace_with_input_area"]);let Je=class extends R{constructor(){super(...arguments),this._open=!1,this._domain="",this._gallery=[],this._galleryLoading=!1,this._galleryError="",this._search="",this._inputs={},this._loadingBlueprint=!1,this._error="",this._applyAssignment=()=>{if(!this._selected||!this._parsed||!this._canApply())return;const e=this._domain,t={id:this._slug(`${this._selected.name}-${e}`),name:this._selected.name,source:this._selected.url||void 0,version:this._parsed.meta.version,blueprint:this._parsed.raw,inputs:this._stripSyntheticInputs(this._inputs),custom_cards:this._parsed.meta.custom_cards||this._selected.custom_cards||[],enabled:this._assignment(e)?.enabled??!0},i=q(this._config.blueprint_replacements,e,t);this._params?.onSave({...this._config,blueprint_replacements:i}),this.closeDialog()}}_t(e,t){return we(this.hass,e,t)}get _editDomain(){return this._params?.initialDomain||void 0}showDialog(e){this._params=e,this._config=e.config,this._domain=e.initialDomain||"",this._search="",this._selected=void 0,this._parsed=void 0,this._inputs={},this._error="",e.initialDomain&&this._selectCurrentAssignment(e.initialDomain),this._open=!0,this._loadGallery()}closeDialog(){this._open=!1,this._params=void 0,this.remove()}render(){if(!this._open||!this._config)return W;const e=this._editDomain?this._t("replacement.edit_title",{domain:Z(this.hass,this._editDomain)}):this._t("replacement.assign");return K`
      <ha-dialog open @closed=${this.closeDialog} .heading=${e} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${a}
            .label=${this._t("common.close")}
            @click=${this.closeDialog}
          ></ha-icon-button>
          <span slot="title">${e}</span>
        </ha-dialog-header>

        <div class="content">
          ${this._renderBuilder()}
        </div>
      </ha-dialog>
    `}_renderBuilder(){const e=this._conflict();return K`
      <section class="builder">
        <p class="hint intro">${this._t("replacement.views_description")}</p>
        <div class="builder-controls">
          <label class="control-block">
            <span>${this._t("replacement.domain")}</span>
            ${this._renderDomainControl()}
          </label>
          <label class="control-block">
            <span>${this._t("replacement.search")}</span>
            <input
              class="search"
              type="search"
              .value=${this._search}
              @input=${e=>this._search=e.target.value}
            />
          </label>
        </div>
        ${this._error?K`<div class="error" role="alert">${this._error}</div>`:W}
        ${e?K`<div class="error" role="alert">${e}</div>`:W}
        ${this._galleryLoading?K`<div class="loading">${this._t("common.loading")}</div>`:W}
        ${this._galleryError?K`<div class="error">${this._galleryError}</div>`:W}

        <div class="gallery">
          ${X(this._filteredGallery(),e=>e.url,e=>K`
              <button
                type="button"
                class="blueprint-choice ${this._selected?.url===e.url?"selected":""}"
                aria-pressed=${this._selected?.url===e.url?"true":"false"}
                @click=${()=>this._selectBlueprint(e)}
              >
                <span class="choice-name">${e.name}</span>
                ${e.description?K`<span class="choice-desc">${e.description}</span>`:W}
                <span class="choice-tags">
                  ${e.version?K`<span>v${e.version}</span>`:W}
                  ${(e.custom_cards||[]).slice(0,3).map(e=>K`<span>${e}</span>`)}
                </span>
              </button>
            `)}
        </div>

        ${this._selected?this._renderSelectedBlueprint():W}
      </section>
    `}_renderDomainControl(){return K`
      <select
        .value=${this._domain}
        ?disabled=${!!this._editDomain}
        @change=${e=>this._setDomain(e.target.value)}
      >
        ${this._domainOptions().map(e=>K`<option value=${e.value} ?selected=${e.value===this._domain}>${e.label}</option>`)}
      </select>
    `}_renderSelectedBlueprint(){const e=this._editableInputKeys();return K`
      <div class="selected-blueprint">
        <div class="selected-header">
          <div>
            <div class="selected-name">${this._selected.name}</div>
            ${this._parsed?.meta.version?K`<div class="selected-version">v${this._parsed.meta.version}</div>`:W}
          </div>
          <ha-button
            appearance="accent"
            ?disabled=${this._loadingBlueprint||!this._canApply()}
            @click=${this._applyAssignment}
          >
            <ha-icon icon="mdi:check"></ha-icon>
            ${this._t("common.apply")}
          </ha-button>
        </div>

        ${this._loadingBlueprint?K`<div class="loading">${this._t("replacement.loading_blueprint")}</div>`:W}
        <div class="hint">
          ${this._domain?this._t("replacement.applies_to",{domain:Z(this.hass,this._domain)}):this._t("replacement.choose_domain")}
        </div>
        ${e.length?K`
              <div class="input-grid">
                ${e.map(e=>this._renderInputField(e))}
              </div>
            `:K`<div class="hint">${this._t("replacement.entity_hint")}</div>`}
      </div>
    `}_renderInputField(e){const t=this._parsed?.meta.input?.[e],i=ke(this.hass),s=t?fe(t,"description",i):void 0;return K`
      <label class="input-field">
        <span>${t&&fe(t,"name",i)||e}</span>
        ${s?K`<small>${s}</small>`:W}
        <input
          type=${"number"===t?.type?"number":"text"}
          .value=${this._inputs[e]??""}
          @input=${t=>this._inputs={...this._inputs,[e]:t.target.value}}
        />
      </label>
    `}async _loadGallery(){if(!this._gallery.length&&!this._galleryLoading){this._galleryLoading=!0,this._galleryError="";try{const e=await fetch("https://raw.githubusercontent.com/dwainscheeren/dwains-dashboard-blueprints/main/blueprints.json",{redirect:"follow"});if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json(),i=Array.isArray(t)?t:t?.blueprints||[];this._gallery=i.filter(e=>e?.url&&e?.name&&"replace-card"===e?.type&&!function(e){const t=`${e?.name||""} ${e?.description||""} ${e?.url||""}`.toLowerCase();return t.includes("popup")}(e)).map(e=>({name:String(e.name),description:e.description?String(e.description):void 0,type:e.type?String(e.type):void 0,version:null!=e.version?String(e.version):void 0,url:String(e.url),custom_cards:Array.isArray(e.custom_cards)?e.custom_cards.map(String):void 0}))}catch(e){this._galleryError=String(e?.message||e)}finally{this._galleryLoading=!1}}}_selectCurrentAssignment(e){const t=this._assignment(e);if(t)try{const e=ye(t.blueprint);this._selected={name:t.name,url:t.source||"",version:t.version,custom_cards:t.custom_cards},this._parsed=e,this._inputs={...be(e.meta),...t.inputs||{}}}catch(e){this._error=this._t("replacement.load_failed",{name:t.name,error:String(e?.message||e)})}}_setDomain(e){this._domain=e,this._error="";const t=this._selected?Qe(this._selected,this._parsed):"";e&&t&&t!==e&&(this._selected=void 0,this._parsed=void 0,this._inputs={})}async _selectBlueprint(e){this._selected=e,this._parsed=void 0,this._inputs={},this._error="",this._loadingBlueprint=!0;try{const t=await fetch(e.url,{redirect:"follow"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const i=await t.text();if(this._selected!==e)return;const s=ye(i),a=Qe(e,s);if(a&&this._domain&&a!==this._domain)return this._error=this._t("replacement.domain_mismatch",{name:e.name,other:Z(this.hass,a),domain:Z(this.hass,this._domain)}),void(this._selected=void 0);a&&!this._domain&&(this._domain=a);const o=this._editDomain?this._assignment(this._editDomain):void 0;this._parsed=s,this._inputs={...be(s.meta),...o?.source&&o.source===e.url?o.inputs:{}}}catch(t){this._error=this._t("replacement.load_failed",{name:e.name,error:String(t?.message||t)})}finally{this._selected!==e&&this._selected||(this._loadingBlueprint=!1)}}_assignment(e){return Y(this._config?.blueprint_replacements).find(t=>t.domain===e)?.assignment}_conflict(){return this._domain&&this._domain!==this._editDomain&&this._assignment(this._domain)?this._t("replacement.already_assigned",{domain:Z(this.hass,this._domain)}):""}_domainOptions(){const e=new Set;this._gallery.forEach(t=>{const i=Qe(t);i&&e.add(i)}),Y(this._config?.blueprint_replacements).forEach(t=>e.add(t.domain)),this._domain&&e.add(this._domain);const t=Array.from(e).map(e=>({value:e,label:Z(this.hass,e)})).sort((e,t)=>e.label.localeCompare(t.label));return[{value:"",label:this._t("replacement.all_domains")},...t]}_canApply(){return!(!this._parsed||!this._selected||!this._domain||this._conflict())}_filteredGallery(){const e=this._search.trim().toLowerCase();return this._gallery.filter(e=>{if(!this._domain)return!0;const t=Qe(e);return!t||t===this._domain}).filter(t=>{if(!e)return!0;return`${t.name} ${t.description||""} ${(t.custom_cards||[]).join(" ")}`.toLowerCase().includes(e)}).sort((e,t)=>e.name.localeCompare(t.name))}_editableInputKeys(){return Object.keys(this._parsed?.meta.input||{}).filter(e=>!Ye.has(e))}_stripSyntheticInputs(e){const t={};return Object.entries(e).forEach(([e,i])=>{Ye.has(e)||""===i||(t[e]=i)}),t}_slug(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)}};function Qe(e,t){const i=[e.name,e.description,e.url,...e.custom_cards||[],t?.meta.name,t?.meta.description,...t?.meta.custom_cards||[],et(t?.card)].filter(Boolean).join(" ").toLowerCase();return Xe.find(([,e])=>e.some(e=>i.includes(e)))?.[0]||""}function et(e){if(!e)return"";if("string"==typeof e?.type)return e.type;try{return JSON.stringify(e)}catch{return""}}Je.styles=G`:host{--mdc-dialog-min-width:min(880px,92vw);--mdc-dialog-max-width:min(960px,96vw)}ha-dialog{--dialog-content-padding:0}.content{padding:0 18px 20px;color:var(--primary-text-color)}.selected-blueprint{border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.selected-name{font-weight:600}.choice-desc,.selected-version,.hint,small{color:var(--secondary-text-color);font-size:12px}.hint.intro{margin:0 0 12px}.choice-tags span{border-radius:999px;padding:2px 8px;background:var(--secondary-background-color);color:var(--secondary-text-color);font-size:12px;white-space:nowrap}.choice-tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.builder-controls{display:grid;grid-template-columns:minmax(180px,260px) minmax(220px,1fr);gap:12px;margin-bottom:12px}.control-block{display:flex;flex-direction:column;gap:6px;min-width:0}label{font-size:12px;font-weight:600;color:var(--secondary-text-color)}select,.search,.input-field input{width:100%;box-sizing:border-box;border:1px solid var(--divider-color);border-radius:8px;padding:10px 11px;background:var(--card-background-color);color:var(--primary-text-color);font-size:14px}select:disabled{opacity:0.7}.loading{margin-bottom:8px;color:var(--secondary-text-color);font-size:13px}.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-height:280px;overflow:auto;padding-right:2px}.blueprint-choice{text-align:left;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);padding:10px;cursor:pointer;display:flex;flex-direction:column;gap:4px}.blueprint-choice:hover,.blueprint-choice.selected{border-color:var(--primary-color);box-shadow:0 0 0 1px var(--primary-color) inset}.choice-name{font-weight:600}.selected-blueprint{margin-top:12px;padding:12px}.selected-header{display:flex;align-items:center;justify-content:space-between;gap:12px}.selected-header ha-icon{--mdc-icon-size:18px;margin-right:5px}.input-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.input-field{display:flex;flex-direction:column;gap:4px}.error{padding:10px 12px;border-radius:8px;background:rgba(var(--rgb-error-color,244,67,54),0.12);color:var(--error-color);margin-bottom:10px}@media (max-width:760px){:host{--mdc-dialog-min-width:96vw}.builder-controls,.gallery,.input-grid{grid-template-columns:1fr}.selected-header{align-items:stretch;flex-direction:column}}`,e([t({attribute:!1})],Je.prototype,"hass",void 0),e([i()],Je.prototype,"_open",void 0),e([i()],Je.prototype,"_params",void 0),e([i()],Je.prototype,"_config",void 0),e([i()],Je.prototype,"_domain",void 0),e([i()],Je.prototype,"_gallery",void 0),e([i()],Je.prototype,"_galleryLoading",void 0),e([i()],Je.prototype,"_galleryError",void 0),e([i()],Je.prototype,"_search",void 0),e([i()],Je.prototype,"_selected",void 0),e([i()],Je.prototype,"_parsed",void 0),e([i()],Je.prototype,"_inputs",void 0),e([i()],Je.prototype,"_loadingBlueprint",void 0),e([i()],Je.prototype,"_error",void 0),Je=e([s("dwains-dashboard-next-replacement-manager-dialog")],Je);const tt=["areas","devices","entities","floors"];function it(e){const t={...e||{}};return tt.forEach(e=>delete t[e]),t}function st(e){return!(e?.hidden?.length||e?.order?.length||e?.sort_mode&&"alphabetical"!==e.sort_mode)}function at(e){const{hidden:t,order:i,sort_mode:s,...a}=e||{};return a}function ot(e){return!("grouped"!==(e?.entity_layout??"grouped")||e?.group_order?.length||e?.entity_order?.length||function(e){return Object.values(e?.groups_options||{}).some(e=>Boolean(e?.hidden?.length||e?.order?.length))}(e)||(e?.custom_cards||[]).some(e=>e.placement.startsWith("ungrouped:")))}function rt(e){const{entity_layout:t,group_order:i,entity_order:s,groups_options:a,...o}=e||{};if(Array.isArray(o.custom_cards)){const e=o.custom_cards,t=e.filter(e=>!e.placement.startsWith("ungrouped:")),i=e.filter(e=>e.placement.startsWith("ungrouped:")).map(e=>({...e,placement:"bottom"}));o.custom_cards=[...t,...i]}return o}function nt(e,t){return!e?.hidden_device_types?.length&&!t?.hidden_entities?.length&&!t?.hidden_devices?.length}function dt(e,t){let i=0;for(const s of e)t.has(s)&&(i+=1);return i}function ct(e,t){return e<=0||t<=0?"visible":t>=e?"hidden":"partial"}function lt(e,t){return ct(e.length,dt(e,t))}function ht(e){return"hidden"!==e}function pt(e,t,i){const s=new Set(t),a=(e||[]).filter((e,t,a)=>"string"==typeof e&&e.length>0&&a.indexOf(e)===t&&(i||!s.has(e)));if(i){const e=new Set(a);t.forEach(t=>{t&&!e.has(t)&&(e.add(t),a.push(t))})}return a}function gt(e,t,i){const s=new Set(t);return pt((e||[]).filter(e=>s.has(e)),t,i)}let _t=class extends R{constructor(){super(...arguments),this.mode="folder",this._trail=[{id:"",title:""}],this._loading=!1,this._failed=!1,this._request=0,this._back=()=>{this._trail.length<=1||(this._trail=this._trail.slice(0,-1),this._load())},this._close=()=>{this.dispatchEvent(new CustomEvent("dd-media-picker-closed",{bubbles:!0,composed:!0}))},this._useFolder=()=>{const{id:e}=this._current();e&&this._pick(e,this._pathName())}}connectedCallback(){super.connectedCallback(),this._load()}_t(e,t){return we(this.hass,e,t)}_current(){return this._trail[this._trail.length-1]}async _load(){if(!this.hass)return;const e=++this._request,{id:t}=this._current();this._loading=!0,this._failed=!1;try{const i=await o(this.hass,t||void 0);if(e!==this._request)return;this._item=i}catch{if(e!==this._request)return;this._item=void 0,this._failed=!0}finally{e===this._request&&(this._loading=!1)}}_open(e){this._trail=[...this._trail,{id:e.media_content_id,title:e.title}],this._load()}_pathName(e){const t=this._trail.slice(1).map(e=>e.title);return e&&t.push(e),t.filter(Boolean).join(" / ")}_pick(e,t){this.dispatchEvent(new CustomEvent("dd-media-picked",{detail:{id:e,name:t},bubbles:!0,composed:!0}))}render(){const e=this._trail.length<=1,t=e?this._t("kiosk.media_title"):this._current().title,i=r(this._item),s=n(this._item),a=!(this._loading||this._failed||i.length||s.length);return K`
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
          ${this._loading?K`<div class="picker-note">${this._t("common.loading")}</div>`:W}
          ${this._failed?K`
            <div class="picker-note">
              <span>${this._t("kiosk.media_error")}</span>
              <button class="text-button" type="button" @click=${()=>{this._load()}}>${this._t("kiosk.media_retry")}</button>
            </div>
          `:W}
          ${a?K`<div class="picker-note">${this._t("kiosk.media_empty")}</div>`:W}
          ${this._loading?W:i.map(t=>K`
            <button class="picker-row" type="button" @click=${()=>this._open(t)}>
              <ha-icon class="row-icon" icon=${e?"mdi:folder-multiple-image":"mdi:folder"}></ha-icon>
              <span class="row-title">${t.title}</span>
              <ha-icon class="row-chevron" icon="mdi:chevron-right"></ha-icon>
            </button>
          `)}
          ${this._loading||"image"!==this.mode?W:s.map(e=>K`
            <button
              class="picker-row"
              type="button"
              @click=${()=>this._pick(e.media_content_id,this._pathName(e.title))}
            >
              ${e.thumbnail?K`<img class="row-thumb" src=${e.thumbnail} alt="" loading="lazy" />`:K`<ha-icon class="row-icon" icon="mdi:image-outline"></ha-icon>`}
              <span class="row-title">${e.title}</span>
            </button>
          `)}
        </div>

        ${"folder"===this.mode?K`
          <div class="picker-foot">
            <span class="picker-count">
              ${e||this._loading||this._failed?this._t("kiosk.media_open_folder"):Ce(this.hass,"kiosk.media_images",s.length)}
            </span>
            <button
              class="primary-button"
              type="button"
              ?disabled=${e||this._loading||this._failed}
              @click=${this._useFolder}
            >${this._t("kiosk.media_use_folder")}</button>
          </div>
        `:W}
      </div>
    `}};_t.styles=G`:host{display:block}button{font:inherit;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.picker{display:flex;flex-direction:column;border:1px solid var(--divider-color);border-radius:14px;background:var(--card-background-color);overflow:hidden}.picker-head{display:flex;align-items:center;gap:6px;padding:8px;border-bottom:1px solid var(--divider-color)}.picker-title{flex:1 1 auto;min-width:0;overflow:hidden;color:var(--primary-text-color);font-size:14px;font-weight:600;text-overflow:ellipsis;white-space:nowrap}.icon-button{width:40px;height:40px;padding:0;flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;background:transparent;color:var(--primary-text-color)}.icon-button:hover:not(:disabled){background:color-mix(in srgb,var(--primary-text-color) 8%,transparent)}.icon-button:disabled{opacity:0.35;cursor:default}.icon-button ha-icon{--mdc-icon-size:20px}.picker-list{display:flex;flex-direction:column;max-height:min(46vh,340px);padding:6px;overflow-y:auto;overscroll-behavior:contain}.picker-row{min-height:48px;padding:6px 10px;display:flex;align-items:center;gap:12px;border:0;border-radius:10px;background:transparent;color:var(--primary-text-color);text-align:left}.picker-row:hover{background:color-mix(in srgb,var(--primary-text-color) 6%,transparent)}.row-icon{--mdc-icon-size:22px;flex:0 0 auto;color:var(--primary-color)}.row-thumb{width:44px;height:32px;flex:0 0 auto;border-radius:6px;object-fit:cover;background:var(--secondary-background-color)}.row-title{flex:1 1 auto;min-width:0;overflow:hidden;font-size:14px;text-overflow:ellipsis;white-space:nowrap}.row-chevron{--mdc-icon-size:20px;flex:0 0 auto;color:var(--secondary-text-color)}.picker-note{padding:14px 10px;display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;color:var(--secondary-text-color);font-size:13px;line-height:1.4}.text-button{padding:0;border:0;background:none;color:var(--primary-color);font-size:13px;font-weight:600}.picker-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 12px;padding:10px 12px;border-top:1px solid var(--divider-color)}.picker-count{color:var(--secondary-text-color);font-size:13px}.primary-button{min-height:40px;padding:0 18px;border:0;border-radius:999px;background:var(--primary-color);color:var(--text-primary-color,#ffffff);font-size:14px;font-weight:600}.primary-button:disabled{opacity:0.45;cursor:default}`,e([t({attribute:!1})],_t.prototype,"hass",void 0),e([t()],_t.prototype,"mode",void 0),e([i()],_t.prototype,"_trail",void 0),e([i()],_t.prototype,"_item",void 0),e([i()],_t.prototype,"_loading",void 0),e([i()],_t.prototype,"_failed",void 0),_t=e([s("dwains-dashboard-next-media-picker")],_t);let mt=class extends R{constructor(){super(...arguments),this._segment=d(window.location.pathname),this._prefs=c(this._segment),this._picker=null,this._linkInvalid=!1,this._handleChanged=()=>{this._prefs=c(this._segment),this._refreshPreview()},this._toggleEnabled=e=>{e.stopPropagation(),this._update({enabled:Boolean(e.target?.checked)})},this._handleLinkChange=e=>{e.stopPropagation();const t=e.target.value.trim(),i=l(t);this._linkInvalid=Boolean(t)&&(!i||h(i)),this._linkInvalid||this._update({screensaverImage:i,screensaverImageName:""})},this._stopInput=e=>{e.stopPropagation()},this._closePicker=()=>{this._picker=null},this._handlePicked=e=>{const{id:t,name:i}=e.detail;"image"===this._picker?(this._linkInvalid=!1,this._update({screensaverImage:t,screensaverImageName:i})):this._update({slideshowFolder:t,slideshowFolderName:i}),this._picker=null},this._clearImage=()=>{this._linkInvalid=!1,this._update({screensaverImage:"",screensaverImageName:""})},this._handleThumbError=()=>{const e=this._preview;"ready"===e?.state&&(this._preview="image"===this._prefs.screensaverMode?{source:e.source,state:"failed"}:{...e,url:void 0})},this._showPreview=()=>{window.dispatchEvent(new CustomEvent(p))}}set hass(e){const t=this._hass;this._hass=e,t&&t.language===e?.language&&t.locale?.language===e?.locale?.language||this.requestUpdate(),!t&&e&&this._refreshPreview()}get hass(){return this._hass}connectedCallback(){super.connectedCallback(),this._segment=d(window.location.pathname),this._prefs=c(this._segment),window.addEventListener(g,this._handleChanged),this._refreshPreview()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(g,this._handleChanged)}_refreshPreview(){const e=this._hass,t=_(this._prefs);if("clock"===t.kind||!e)return void(this._preview=void 0);const i="image"===t.kind?t.image:t.folder;if(this._preview?.source===i)return;this._preview={source:i,state:"loading"};const s=e=>{this._preview?.source===i&&(this._preview={source:i,...e})};"image"!==t.kind?u(t=>o(e,t),t.folder).then(async t=>{const i=t[0],a=i?await m(e,i).catch(()=>{}):void 0;s({state:"ready",count:t.length,url:a})}).catch(()=>s({state:"failed"})):m(e,t.image).then(e=>s({state:"ready",url:e})).catch(()=>s({state:"failed"}))}_t(e,t){return we(this._hass,e,t)}_update(e){this._prefs=v(this._segment,e),this.dispatchEvent(new CustomEvent("dwains-dashboard-next-device-settings-saved",{bubbles:!0,composed:!0}))}_toggle(e){return t=>{t.stopPropagation(),this._update({[e]:Boolean(t.target?.checked)})}}_togglePicker(e){this._picker=this._picker===e?null:e}_slideChoices(){return f.map(e=>({value:e,label:e<60?this._t("kiosk.seconds",{count:e}):this._t("kiosk.minutes",{count:e/60})}))}_minuteChoices(){return y.map(e=>({value:e,label:0===e?this._t("kiosk.off"):this._t("kiosk.minutes",{count:e})}))}_exampleUrl(e){return`${window.location.origin}/${this._segment}/home?${b}=${e?1:0}`}render(){const e=this._prefs,t=e.enabled,i=!t||0===e.screensaverMinutes;return K`
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

        ${"image"===e.screensaverMode?this._renderImageRow(i):W}
        ${"slideshow"===e.screensaverMode?this._renderSlideshowRows(i):W}
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
    `}_renderImageRow(e){const t=this._prefs,i=h(t.screensaverImage);return K`
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
          ${this._linkInvalid?K`<small class="field-error" role="alert">${this._t("kiosk.image_invalid")}</small>`:W}
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
            ${t.screensaverImage?K`
              <button class="action quiet" type="button" ?disabled=${e} @click=${this._clearImage}>
                ${this._t("common.remove")}
              </button>
            `:W}
          </div>
          ${this._renderChosen(i?t.screensaverImageName||this._t("kiosk.mode_image"):t.screensaverImage,this._t("kiosk.image_none"),this._t("kiosk.image_failed"))}
        </div>
      </div>
      ${"image"!==this._picker||e?W:this._renderPicker("image")}
    `}_renderSlideshowRows(e){const t=this._prefs,i=this._preview,s="ready"===i?.state&&t.slideshowFolder?i.count??0:void 0;return K`
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
          ${this._renderChosen(t.slideshowFolderName||t.slideshowFolder,this._t("kiosk.folder_none"),this._t("kiosk.folder_failed"),void 0===s?void 0:0===s?this._t("kiosk.folder_empty"):Ce(this._hass,"kiosk.photos_found",s))}
        </div>
      </div>
      ${"folder"!==this._picker||e?W:this._renderPicker("folder")}

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
    `}_renderPhotoRows(e){const t=this._prefs;return K`
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

      ${this._renderChoices("photo-dim",this._t("kiosk.photo_dim"),this._t("kiosk.photo_dim_description"),$.map(e=>({value:e,label:`${e}%`})),t.photoDimLevel,e=>this._update({photoDimLevel:e}),e)}
    `}_renderChosen(e,t,i,s){if(!e)return K`<div class="chosen is-empty">${t}</div>`;const a=this._preview,o="failed"===a?.state;return K`
      <div class="chosen ${o?"is-failed":""}">
        ${"ready"===a?.state&&a.url?K`<img class="chosen-thumb" src=${a.url} alt="" @error=${this._handleThumbError} />`:K`<span class="chosen-thumb placeholder"><ha-icon icon=${o?"mdi:image-off-outline":"mdi:image-outline"}></ha-icon></span>`}
        <span class="chosen-copy">
          <span class="chosen-name">${e}</span>
          ${o?K`<small role="alert">${i}</small>`:s?K`<small>${s}</small>`:W}
        </span>
      </div>
    `}_renderPicker(e){return K`
      <dwains-dashboard-next-media-picker
        class="picker"
        .hass=${this._hass}
        .mode=${e}
        @dd-media-picked=${this._handlePicked}
        @dd-media-picker-closed=${this._closePicker}
      ></dwains-dashboard-next-media-picker>
    `}_renderChoices(e,t,i,s,a,o,r){const n=`wall-tablet-${e}`;return K`
      <div class="row choice-row ${r?"is-disabled":""}">
        <span class="row-copy">
          <strong id=${n}>${t}</strong>
          <small>${i}</small>
        </span>
        <div class="choices" role="radiogroup" aria-labelledby=${n} aria-disabled=${r?"true":W}>
          ${s.map(e=>{const t=e.value===a;return K`
              <button
                type="button"
                class="choice ${t?"selected":""}"
                role="radio"
                aria-checked=${t?"true":"false"}
                ?disabled=${r}
                @click=${()=>o(e.value)}
              >${e.label}</button>
            `})}
        </div>
      </div>
    `}};mt.styles=G`:host{display:block}.wall-tablet-settings{display:flex;flex-direction:column}.row{display:flex;align-items:center;justify-content:space-between;gap:12px 16px;padding:14px 0;border-bottom:1px solid var(--divider-color)}.choice-row{flex-wrap:wrap}.row-copy{display:flex;flex-direction:column;gap:3px;min-width:min(100%,240px);flex:1 1 240px}.row-copy strong{font-size:14px;font-weight:500;color:var(--primary-text-color)}.row-copy small{font-size:13px;line-height:1.4;color:var(--secondary-text-color)}ha-switch{flex:0 0 auto}.choices{display:flex;flex-wrap:wrap;gap:6px}.choice{min-width:52px;min-height:36px;padding:0 12px;border:1px solid var(--divider-color);border-radius:999px;background:transparent;color:var(--primary-text-color);font:inherit;font-size:13px;font-weight:500;cursor:pointer;touch-action:manipulation}.choice:hover:not(:disabled){border-color:color-mix(in srgb,var(--primary-color) 50%,var(--divider-color))}.choice:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.choice.selected{border-color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 14%,transparent);color:var(--primary-color)}.choice:disabled{cursor:default}.is-disabled .choices,.is-disabled .row-copy,.is-disabled .field{opacity:0.5}.field-row{flex-wrap:wrap;align-items:flex-start}.field{flex:1 1 280px;min-width:min(100%,240px);display:flex;flex-direction:column;gap:8px}.text-input{width:100%;box-sizing:border-box;min-height:44px;padding:10px 14px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit;font-size:14px;outline:none;transition:border-color 0.2s ease}.text-input::placeholder{color:var(--secondary-text-color);opacity:0.8}.text-input:focus{border-color:var(--primary-color)}.text-input.is-invalid{border-color:var(--error-color,#db4437)}.field-error{color:var(--error-color,#db4437);font-size:13px;line-height:1.4}.field-actions{display:flex;flex-wrap:wrap;gap:8px}.action{min-height:40px;padding:0 16px;display:inline-flex;align-items:center;gap:8px;flex:0 0 auto;border:1px solid var(--divider-color);border-radius:999px;background:transparent;color:var(--primary-text-color);font:inherit;font-size:13px;font-weight:500;cursor:pointer;touch-action:manipulation}.action ha-icon{--mdc-icon-size:18px;color:var(--primary-color)}.action:hover:not(:disabled){border-color:color-mix(in srgb,var(--primary-color) 50%,var(--divider-color))}.action:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.action:disabled{cursor:default}.action.quiet{border-color:transparent;color:var(--secondary-text-color)}.chosen{display:flex;align-items:center;gap:12px;min-width:0}.chosen.is-empty{color:var(--secondary-text-color);font-size:13px}.chosen-thumb{width:72px;height:46px;flex:0 0 auto;border-radius:8px;object-fit:cover;background:var(--secondary-background-color,rgba(0,0,0,0.06))}.chosen-thumb.placeholder{display:inline-flex;align-items:center;justify-content:center;color:var(--secondary-text-color)}.chosen-thumb.placeholder ha-icon{--mdc-icon-size:22px}.chosen-copy{display:flex;flex-direction:column;gap:2px;min-width:0}.chosen-name{overflow:hidden;color:var(--primary-text-color);font-size:14px;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.chosen-copy small{color:var(--secondary-text-color);font-size:13px;line-height:1.4}.chosen.is-failed small{color:var(--error-color,#db4437)}.picker{margin:12px 0 4px}.note{display:flex;align-items:flex-start;gap:12px;margin-top:12px;padding:12px 14px;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 7%,transparent);color:var(--primary-text-color)}.note + .note{margin-top:8px}.note ha-icon{--mdc-icon-size:20px;color:var(--primary-color);flex:0 0 auto;margin-top:1px}.note-copy{display:flex;flex-direction:column;gap:4px;min-width:0;font-size:13px;line-height:1.45;color:var(--secondary-text-color)}.note-copy strong{font-size:14px;font-weight:500;color:var(--primary-text-color)}code{display:block;margin-top:4px;padding:6px 8px;border-radius:8px;background:var(--secondary-background-color,rgba(0,0,0,0.05));color:var(--primary-text-color);font-family:var(--ha-font-family-code,ui-monospace,monospace);font-size:12px;overflow-wrap:anywhere;user-select:all;-webkit-user-select:all}`,e([i()],mt.prototype,"_prefs",void 0),e([i()],mt.prototype,"_picker",void 0),e([i()],mt.prototype,"_preview",void 0),e([i()],mt.prototype,"_linkInvalid",void 0),mt=e([s("dwains-dashboard-next-wall-tablet-settings")],mt);let ut="overview",vt=0;const ft="__ungrouped__";function yt(e){ut=e,vt=Date.now()}const bt={"mdi:card-account-details-star-outline":O,"mdi:chevron-right":P,"mdi:floor-plan":A,"mdi:format-list-bulleted-type":I,"mdi:gesture-tap-button":H,"mdi:heart-outline":D,"mdi:home-edit-outline":E,"mdi:puzzle-edit-outline":S,"mdi:shield-account":C,"mdi:star-outline":k,"mdi:view-dashboard-edit":w};let xt=class extends R{constructor(){super(...arguments),this._t=(e,t)=>we(this._hass,e,t),this._tp=(e,t)=>Ce(this._hass,e,t),this._loading=!0,this._showHomeScenePicker=!1,this._homeSceneSearch="",this._expandedDeviceTypes=new Set,this._areaGroupOrderChanged=!1,this._collapsedAreaGroups=new Set,this._showEntityPicker=!1,this._entitySearchFilter="",this._showWeatherPicker=!1,this._weatherSearchFilter="",this._showAlarmPicker=!1,this._alarmSearchFilter="",this._settingsPage=Date.now()-vt<8e3?ut:"overview",this._homeSettingsDetail="overview",this._dashboardTitle="",this._dashboardIcon="",this._backToSettingsOverview=()=>{this._settingsPage="overview",this._favoritesReturnPage=void 0,yt("overview"),this._closeInlinePickers()},this._backFromHomeSettingsDetail=()=>{this._homeSettingsDetail="climate"===this._homeSettingsDetail||"outdoor_climate"===this._homeSettingsDetail?"house_information":"overview",this._closeInlinePickers()},this._resetHomeCameraSettings=()=>{this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_camera_order:[],home_cameras_hidden:[]}})},this._resetHomeSectionsOrder=()=>{if(!this._config)return;const e={...this._config,settings:{...this._config.settings,home_sections_order:Ee(),home_sections_hidden:[]}};this._fireConfigChanged(e)},this._openHomeScenePicker=()=>{this._homeSceneSearch="",this._showHomeScenePicker=!0},this._handleHomeSceneDragEnd=()=>{this._draggedHomeScene=void 0,this._dragOverHomeSceneIndex=void 0,this._cancelDragPreview("home-scenes")},this._handleHomeSceneDragLeave=e=>{const t=e.currentTarget,i=e.relatedTarget;t?.contains(i)||(this._dragOverHomeSceneIndex=void 0)},this._deviceVisibilityHiddenEntities=U((e,t)=>{const i=new Set(t?.hidden_devices||[]),s=new Set((t?.hidden_entities||[]).filter(Boolean));return e.forEach(e=>{e.deviceId&&i.has(e.deviceId)&&s.add(e.entityId)}),s}),this._deviceVisibilityEntries=U((e,t,i)=>{const s=[],a=new Set,o=new Set((t.areas||[]).map(e=>e.area_id)),r=new Set(t.areas_display?.hidden||[]),n=new Map((t.devices||[]).map(e=>[e.device_id,e.area_id])),d=!1!==t.settings?.hide_unavailable_entities_on_devices,c=(c,l,h)=>{if(!c||a.has(c))return;const p=i[c];if(p?.hidden_by||"diagnostic"===p?.entity_category||"config"===p?.entity_category)return;const g=l||(h?n.get(h):void 0)||p?.area_id;if(!g||!o.has(g)||r.has(g))return;if(J(t,g).has(c))return;const _=e[c];if(d&&(!_||Q(_)))return;const m=this._deviceTypeKeyForEntityId(c);m&&(a.add(c),s.push({entityId:c,typeKey:m,areaId:g,deviceId:h||p?.device_id||void 0}))};(t.entities||[]).forEach(e=>c(e.entity_id,e.area_id,e.device_id)),Object.values(e||{}).forEach(e=>{c(e.entity_id,e.attributes?.area_id,i[e.entity_id]?.device_id)});const l=new Set(t.settings?.hidden_persons||[]);return Object.values(e||{}).forEach(e=>{const t=e.entity_id;!t?.startsWith("person.")||a.has(t)||l.has(t)||i[t]?.hidden_by||(a.add(t),s.push({entityId:t,typeKey:"person",areaId:""}))}),s}),this._deviceVisibilityTree=U((e,t,i)=>{const s=new Intl.Collator(i,{numeric:!0,sensitivity:"base"}),a=this._getAllDevicesById(),o=new Set(t.device_admission?.hidden_devices||[]),r=ee(t.areas||[],{...t.areas_display,hidden:[]},i),n=new Map(r.map((e,t)=>[e.area_id,t])),d=new Map(r.map(e=>[e.area_id,e.name])),c=e=>String(this.hass?.states?.[e]?.attributes?.friendly_name||e),l=(e,t)=>s.compare(c(e),c(t)),h=new Map;return e.forEach(e=>{const t=h.get(e.typeKey)||[];t.push(e),h.set(e.typeKey,t)}),[...h.entries()].map(([e,t])=>{const i=new Map;t.forEach(e=>{if(!e.areaId)return;const t=i.get(e.areaId)||[];t.push(e),i.set(e.areaId,t)});const r=[...i.entries()].sort(([e],[t])=>(n.get(e)??Number.MAX_SAFE_INTEGER)-(n.get(t)??Number.MAX_SAFE_INTEGER)).map(([e,t])=>{const i=new Map;t.forEach(e=>{const t=e.deviceId&&a.has(e.deviceId)?e.deviceId:"",s=i.get(t)||[];s.push(e.entityId),i.set(t,s)});const r=[...i.entries()].map(([e,t])=>({deviceId:e||void 0,name:e?a.get(e)?.name||e:"",hidden:Boolean(e)&&o.has(e),entityIds:t.sort(l)})).sort((e,t)=>Number(!e.deviceId)-Number(!t.deviceId)||s.compare(e.name,t.name));return{areaId:e,areaName:d.get(e)||e,entityIds:r.flatMap(e=>e.entityIds),devices:r}});return{key:e,label:this._deviceTypeName(e),icon:this._deviceTypeIcon(e),color:this._deviceTypeColor(e),entityIds:r.length?r.flatMap(e=>e.entityIds):t.map(e=>e.entityId),areas:r}}).sort((e,t)=>s.compare(e.label,t.label))}),this._handleHomeSectionDragEnd=()=>{this._draggedHomeSection=void 0,this._dragOverHomeSectionIndex=void 0,this._cancelDragPreview("home-sections")},this._handleHomeSectionDragLeave=e=>{const t=e.currentTarget,i=e.relatedTarget;t?.contains(i)||(this._dragOverHomeSectionIndex=void 0)},this._handleHomeCameraDragEnd=()=>{this._draggedHomeCamera=void 0,this._dragOverHomeCameraIndex=void 0,this._cancelDragPreview("home-cameras")},this._handleHomeCameraDragLeave=e=>{const t=e.currentTarget,i=e.relatedTarget;t?.contains(i)||(this._dragOverHomeCameraIndex=void 0)},this._resetAreasConfiguration=async()=>{this._config&&!st(this._config.areas_display)&&await this._confirmReset(this._t("settings.reset_area_list_confirm"),this._t("settings.reset_area_list_message"))&&this._config&&this._fireConfigChanged({...this._config,areas_display:at(this._config.areas_display)})},this._resetAreaLayout=async()=>{const e=this._area;this._config&&e&&!ot(this._config.areas_options?.[e])&&await this._confirmReset(this._t("settings.reset_room_layout_confirm"),this._t("settings.reset_room_layout_message"))&&this._config&&this._area===e&&this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[e]:rt(this._config.areas_options?.[e])}})},this._resetDeviceVisibility=async()=>{var e,t;this._config&&!nt(this._config.settings,this._config.device_admission)&&(await this._confirmReset(this._t("settings.reset_devices_visibility_confirm"),this._t("settings.reset_devices_visibility_message"))&&this._config&&this._fireConfigChanged({...this._config,...(e=this._config.settings,t=this._config.device_admission,{settings:{...e,hidden_device_types:[]},device_admission:{...t,hidden_entities:[],hidden_devices:[]}})}))},this._handleAreaCustomCardDragEnd=()=>{this._draggedAreaCustomCardId=void 0,this._dragOverAreaCustomCardTarget=void 0},this._applyAreaGroupOrderToAllAreas=async()=>{const e=this._area;if(!this._config||!e||!this._areaGroupOrderChanged)return;if(!await xe(this,{hass:this.hass,title:this._t("settings.apply_group_order_all_confirm"),message:this._t("settings.apply_group_order_all_description"),confirmLabel:this._t("common.apply")})||!this._config||this._area!==e)return;const t=this._config.areas_options?.[e]?.group_order,i=t?.length?[...t]:[...te],s={...this._config.areas_options};new Set([...(this._config.areas||[]).map(e=>e.area_id),...Object.keys(this.hass?.areas||{})]).forEach(e=>{s[e]={...s[e],group_order:[...i]}}),this._fireConfigChanged({...this._config,areas_options:s}),this._areaGroupOrderChanged=!1,this._showToast(this._t("settings.apply_group_order_all_done"))},this._handleEntitySectionDragEnd=()=>{this._draggedEntitySection=void 0,this._dragOverEntitySection=void 0,this._cancelDragPreview(`area-groups:${this._area}`)},this._toggleAlarmDisplay=e=>{this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,show_alarm:Boolean(e.target.checked)}})},this._toggleHideAreaName=e=>{this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,hide_area_name_in_entity_names:Boolean(e.target.checked)}})},this._toggleHideEnergySensors=e=>{this._config&&this._fireConfigChanged(De(this._config,Boolean(e.target.checked)))},this._toggleAreaShowEnergySensors=e=>{this._config&&this._area&&this._fireConfigChanged(He(this._config,this._area,Boolean(e.target.checked)))},this._toggleAreaFavorites=e=>{this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,show_area_favorites:Boolean(e.target.checked)}})},this._toggleAreaNowPlaying=e=>{this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,show_area_now_playing:Boolean(e.target.checked)}})}}set hass(e){const t=this._hass;this._hass=e,e&&!t&&(this._fetchData(),this._fetchDashboardInfo())}get hass(){return this._hass}_getDashboardUrlPath(){const e=window.location.pathname.split("/")[1];if(e&&"lovelace"!==e)return e}async _fetchDashboardInfo(){if(this._hass)try{const e=this._getDashboardUrlPath();if(!e)return;const t=(await this._hass.callWS({type:"lovelace/dashboards/list"})||[]).find(t=>t.url_path===e);t&&(this._dashboardId=t.id,this._dashboardTitle=t.title||"",this._dashboardIcon=t.icon||"")}catch(e){console.warn("Dashboard-info ophalen mislukt:",e)}}async _saveDashboardInfo(){if(this._hass&&this._dashboardId)try{await this._hass.callWS({type:"lovelace/dashboards/update",dashboard_id:this._dashboardId,title:this._dashboardTitle||"Dashboard",icon:this._dashboardIcon||void 0})}catch(e){console.error("❌ Dashboard bijwerken mislukt:",e),this._showToast(this._t("strategy.save_name_failed",{error:String(e)}))}}_onDashboardTitleChanged(e){this._dashboardTitle=e.target.value}_onDashboardTitleCommit(){this._saveDashboardInfo()}_onDashboardIconChanged(e){this._dashboardIcon=e.detail?.value??e.target?.value??"",this._saveDashboardInfo()}async setConfig(e){this._config={...it(e),type:e?.type||"custom:dwains-dashboard-next",areas_display:e?.areas_display||{},floors_display:e?.floors_display||{},areas_options:e?.areas_options||{},blueprint_replacements:e?.blueprint_replacements||{},device_admission:e?.device_admission||{},favorites:e?.favorites||[],pages:e?.pages||[],home_custom_cards:e?.home_custom_cards||[],settings:e?.settings||{},areas:[],devices:[],entities:[],floors:[]},this.hass?(this._loading=!this._registryData,this._fetchData()):this._loading=!0}connectedCallback(){super.connectedCallback(),this.hass&&this._fetchData()}async _fetchData(){if(this.hass){if(this._registryData)return this._applyRegistryData(this._registryData.areas,this._registryData.devices,this._registryData.entities),void(this._loading=!1);if(this._fetchDataPromise)return this._fetchDataPromise;this._loading=!0,this._fetchDataPromise=this._loadRegistryData();try{await this._fetchDataPromise}finally{this._fetchDataPromise=void 0}}}async _loadRegistryData(){const e=this.hass;if(e)try{const[t,i,s]=await Promise.all([e.callWS({type:"config/area_registry/list"}),e.callWS({type:"config/device_registry/list"}),e.callWS({type:"config/entity_registry/list"})]);this._registryData={areas:t,devices:i,entities:s},this._applyRegistryData(t,i,s),this._loading=!1,this.requestUpdate()}catch(e){console.error("Failed to fetch data:",e),this._loading=!1}}_applyRegistryData(e,t,i){this.hass&&(qe(i),this._config={...this._config||{type:"custom:dwains-dashboard-next"},areas:e.map(e=>({area_id:e.area_id,name:e.name,picture:e.picture,icon:e.icon})),devices:t.map(e=>({device_id:e.id,name:e.name_by_user||e.name,area_id:e.area_id,created_at:e.created_at})),entities:i.map(e=>({entity_id:e.entity_id,area_id:e.area_id,device_id:e.device_id,created_at:e.created_at}))})}render(){return this._config?!this.hass||this._loading?this._renderLoadingShell():this._area?this._renderAreaEditor():this._renderAreasEditor():this._renderLoadingShell()}_renderLoadingShell(){return K`
      <div class="editor-container settings-loading-shell" aria-busy="true">
        <section class="settings-nav-section">
          <h3>${this._t("settings.loading")}</h3>
          <div class="settings-nav-list">
            ${[0,1,2,3].map(()=>K`
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
    `}_renderAreasEditor(){return this.hass&&this._config?"overview"===this._settingsPage?this._renderSettingsOverview():this._renderSettingsDetailPage(this._settingsPage):W}_renderSettingsOverview(){const e=[{key:"general",title:this._t("settings.general")},{key:"layout",title:this._t("settings.dashboard_layout")},{key:"advanced",title:this._t("settings.advanced")},{key:"device",title:this._t("kiosk.group_title")}],t=this._settingsOverviewItems();return K`
      <div class="editor-container">
        ${e.map(e=>{const i=t.filter(t=>t.group===e.key);return i.length?K`
            <section class="settings-nav-section">
              <h3>${e.title}</h3>
              <div class="settings-nav-list">
                ${i.map(e=>this._renderSettingsNavItem(e))}
              </div>
            </section>
          `:W})}
        <p class="settings-version-footer">
          ${this._t("settings.loaded_version")} <strong>v${"1.14.0"}</strong>
        </p>
      </div>
    `}_settingsOverviewItems(){const e=Object.keys(this.hass?.areas||{}).length,t=this._getHomeSectionsOrder().filter(e=>!this._getHiddenHomeSections().has(e)).length,i=Ie.filter(e=>!this._getHiddenHomeInformationCards().has(e)).length,s=this._getDeviceTypeOptions().length,a=this._getHiddenDeviceTypes().size,o=Object.values(this.hass?.states||{}).filter(e=>e.entity_id?.startsWith("person.")).length,r=this._config?.favorites?.length||0,n=this._replacementCount(),l=this._getHiddenDeviceIds().size,h=!1===this._config?.settings?.hide_unavailable_entities_on_devices?this._t("settings.unavailable_shown"):this._t("settings.unavailable_hidden"),p=!1===this._config?.settings?.hide_unavailable_entities?this._t("settings.unavailable_shown"):this._t("settings.unavailable_hidden"),g=ie(this._config?.areas_display),_=se.filter(e=>ae(this._config?.settings,e)).length;return[{page:"dashboard",group:"general",icon:"mdi:view-dashboard-edit",color:"var(--primary-color)",title:this._t("settings.dashboard"),description:this._t("settings.dashboard_description"),summary:[this._dashboardTitle||this._t("settings.current_dashboard")]},{page:"home",group:"general",icon:"mdi:home-edit-outline",color:"#0ea5e9",title:this._t("settings.home_page"),description:this._t("settings.home_page_description"),summary:[this._tp("settings.section_count",t),this._t("settings.house_cards",{visible:i,total:Ie.length}),this._tp("common.favorite",r)]},{page:"favorites",group:"general",icon:"mdi:star-outline",color:"#f59e0b",title:this._t("favorites.title"),description:this._t("settings.favorites_page_description"),summary:[this._tp("common.favorite",r),this._t(!1===this._config?.settings?.show_suggested_favorites?"settings.favorite_suggestions_off":"settings.favorite_suggestions_on")]},{page:"header",group:"general",icon:"mdi:card-account-details-star-outline",color:"#22a06b",title:this._t("settings.header_status"),description:this._t("settings.header_status_description"),summary:[!1===this._config?.settings?.show_notifications?this._t("settings.notifications_hidden"):this._t("settings.notifications_shown"),this._config?.settings?.alarm_entity_id?!1===this._config.settings.show_alarm?this._t("settings.alarm_hidden"):this._t("settings.alarm_selected"):this._t("settings.no_alarm_selected")]},{page:"controls",group:"general",icon:"mdi:gesture-tap-button",color:"#d97706",title:this._t("settings.controls_confirmations"),description:this._t("settings.controls_confirmations_description"),summary:[this._t("toggle"===oe(this._config?.settings)?"settings.tile_tap_summary_toggle":"settings.tile_tap_summary_more_info"),this._t("settings.controls_confirmations_summary",{count:_})]},{page:"people",group:"layout",icon:"mdi:account-group-outline",color:"#8b5cf6",title:this._t("settings.people"),description:this._t("settings.people_description"),summary:[this._tp("common.person",o)]},{page:"areas",group:"layout",icon:"mdi:floor-plan",color:"#14b8a6",title:this._t("settings.areas"),description:this._t("settings.areas_description"),summary:[this._tp("common.area",e),this._t(`settings.area_order_${g}`),p]},{page:"devices",group:"layout",icon:"mdi:format-list-bulleted-type",color:"#0891b2",title:this._t("settings.devices_page"),description:this._t("settings.devices_page_description"),summary:[this._t("settings.types_visible",{visible:s-a,total:s}),this._t("settings.hidden_devices_count",{count:l}),this._tp("settings.hidden_entities_count",this._getDevicesPageHiddenEntityIds().size),h]},{page:"replacements",group:"layout",icon:"mdi:puzzle-edit-outline",color:"#7c3aed",title:this._t("settings.blueprint_replacements"),description:this._t("settings.blueprint_replacements_description"),summary:[this._tp("common.active",n)]},{page:"permissions",group:"advanced",icon:"mdi:shield-account",color:"#ef4444",title:this._t("settings.user_permissions"),description:this._t("settings.user_permissions_description"),summary:[this._config?.settings?.restrict_non_admin_ha_sidebar||this._config?.settings?.restrict_non_admin_dashboard_settings?this._t("settings.restrictions_enabled"):this._t("settings.default_access")]},{page:"support",group:"advanced",icon:"mdi:heart-outline",color:"#f59e0b",title:this._t("settings.support"),description:this._t("settings.support_description"),summary:[this._t("settings.optional")]},{page:"wall_tablet",group:"device",icon:"mdi:tablet-dashboard",color:"#64748b",title:this._t("kiosk.title"),description:this._t("kiosk.description"),summary:[c(d(window.location.pathname)).enabled?this._t("kiosk.summary_on"):this._t("kiosk.summary_off")]}]}_renderSettingsNavItem(e){return K`
      <button
        class="settings-nav-item"
        type="button"
        style=${`--settings-item-color: ${e.color};`}
        @click=${()=>this._openSettingsPage(e.page)}
      >
        <div class="settings-nav-icon">
          ${this._renderSettingsIcon(e.icon)}
        </div>
        <div class="settings-nav-copy">
          <div class="settings-nav-title">${e.title}</div>
          <div class="settings-nav-description">${e.description}</div>
          ${e.summary?.length?K`
                <div class="settings-nav-summary">
                  ${e.summary.filter(Boolean).map(e=>K`<span>${e}</span>`)}
                </div>
              `:W}
        </div>
        ${this._renderSettingsIcon("mdi:chevron-right","settings-nav-chevron")}
      </button>
    `}_renderSettingsIcon(e,t=""){const i=bt[e];return i?K`
      <svg class=${t} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d=${i}></path>
      </svg>
    `:K`<ha-icon class=${t} icon=${e}></ha-icon>`}updated(e){super.updated(e),e.has("_settingsPage")&&this.dispatchEvent(new CustomEvent("dwains-dashboard-next-settings-page-changed",{detail:{page:this._settingsPage},bubbles:!0,composed:!0}))}_openSettingsPage(e){this._settingsPage=e,this._favoritesReturnPage=void 0,yt(e),this._closeInlinePickers()}_openFavoritesFrom(e,t){t?.stopPropagation(),this._openSettingsPage("favorites"),this._favoritesReturnPage=e}_renderManageFavoritesLink(e){return K`
      <button class="link manage-favorites-link" type="button" @click=${t=>this._openFavoritesFrom(e,t)}>
        ${this._t("settings.manage_favorites")}
      </button>
    `}_closeInlinePickers(){this._showEntityPicker=!1,this._showWeatherPicker=!1,this._showAlarmPicker=!1,this._showHomeScenePicker=!1}_homeSettingsDetailHeader(){if("overview"===this._homeSettingsDetail)return;if("climate"===this._homeSettingsDetail)return{title:this._t("home.indoor_climate"),description:this._t("settings.home_climate_areas_description"),backLabel:this._t("home_section.devices.label")};if("outdoor_climate"===this._homeSettingsDetail)return{title:this._t("home.outdoor_climate"),description:this._t("settings.home_outdoor_climate_areas_description"),backLabel:this._t("home_section.devices.label")};const e="house_information"===this._homeSettingsDetail?"devices":this._homeSettingsDetail,t=Ae[e];return{title:this._t(t.labelKey),description:this._t(t.descriptionKey),backLabel:this._t("settings.home_page")}}_renderSettingsDetailPage(e){const t=this._settingsOverviewItems().find(t=>t.page===e);if(!t)return this._renderSettingsOverview();const i="home"===e?this._homeSettingsDetailHeader():void 0,s="favorites"===e?this._favoritesReturnPage:void 0,a=s?this._settingsOverviewItems().find(e=>e.page===s):void 0,o=i?.title||t.title,r=i?.description||t.description,n=i?.backLabel||a?.title||this._t("settings.all_settings"),d=i?this._backFromHomeSettingsDetail:s?()=>this._openSettingsPage(s):this._backToSettingsOverview;return K`
      <div class="editor-container">
        <div class="settings-detail-toolbar">
          <button class="settings-back-button" type="button" @click=${d}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>
            <span>${n}</span>
          </button>
          <div class="settings-detail-title">
            <span>${o}</span>
            <small>${r}</small>
          </div>
        </div>
        <div class="settings-detail-content">
          ${this._renderSettingsPageContent(e)}
        </div>
      </div>
    `}_renderSettingsPageContent(e){switch(e){case"dashboard":return this._renderDashboardSettingsPanel();case"home":return this._renderHomeLayoutSettingsPanel();case"header":return K`
          ${this._renderTimeSettingsPanel()}
          ${this._renderNotificationSettingsPanel()}
          ${this._renderWeatherSettingsPanel()}
          ${this._renderAlarmSettingsPanel()}
        `;case"controls":return K`
          ${this._renderTileTapSettingsPanel()}
          ${this._renderMasterActionConfirmationSettingsPanel()}
        `;case"devices":return this._renderEntityDisplaySettingsPanel();case"people":return this._renderPersonsSettingsPanel();case"areas":return this._renderAreasSettingsPanel();case"favorites":return this._renderFavoritesSettingsPanel();case"replacements":return this._renderReplacementsSettingsPanel();case"permissions":return this._renderPermissionsSettingsPanel();case"support":return this._renderSupportSection();case"wall_tablet":return this._renderSettingsPanel("mdi:tablet-dashboard",this._t("kiosk.title"),this._t("kiosk.panel_description"),K`<dwains-dashboard-next-wall-tablet-settings .hass=${this.hass}></dwains-dashboard-next-wall-tablet-settings>`);default:return W}}_renderSettingsPanel(e,t,i,s){return K`
      <ha-expansion-panel expanded outlined>
        <div slot="header">
          <ha-icon icon=${e}></ha-icon>
          ${t}
        </div>
        <p class="description">${i}</p>
        ${s}
      </ha-expansion-panel>
    `}_renderTileTapSettingsPanel(){const e=oe(this._config?.settings),t=[{mode:"more-info",icon:"mdi:card-text-outline",title:this._t("settings.tile_tap_more_info"),description:this._t("settings.tile_tap_more_info_description")},{mode:"toggle",icon:"mdi:gesture-tap-hold",title:this._t("settings.tile_tap_toggle"),description:this._t("settings.tile_tap_toggle_description")}];return this._renderSettingsPanel("mdi:gesture-tap",this._t("settings.tile_tap_title"),this._t("settings.tile_tap_description"),K`
        <div class="tile-tap-section">
          <div class="area-order-modes tile-tap-modes" role="radiogroup" aria-label=${this._t("settings.tile_tap_title")}>
            ${t.map(({mode:t,icon:i,title:s,description:a})=>K`
              <button
                type="button"
                class="area-order-mode ${e===t?"selected":""}"
                role="radio"
                aria-checked=${e===t?"true":"false"}
                @click=${()=>this._setTileTapAction(t)}
              >
                <ha-icon .icon=${i}></ha-icon>
                <span>
                  <strong>${s}</strong>
                  <small>${a}</small>
                </span>
              </button>
            `)}
          </div>
        </div>
      `)}_setTileTapAction(e){if(!this._config||oe(this._config.settings)===e)return;const t={...this._config.settings};"toggle"===e?t.tile_tap_action="toggle":delete t.tile_tap_action,this._fireConfigChanged({...this._config,settings:t})}_renderMasterActionConfirmationSettingsPanel(){return this._renderSettingsPanel("mdi:gesture-tap-button",this._t("settings.master_confirmations"),this._t("settings.master_confirmations_description"),K`
        <div class="master-confirmation-section">
          <div class="master-confirmation-note">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span>${this._t("settings.master_confirmations_note")}</span>
          </div>
          <div class="master-confirmation-list">
            ${se.map(e=>{const t=ae(this._config?.settings,e);return K`
                <label
                  class="master-confirmation-row"
                  style=${`--master-confirmation-color: ${re(e)};`}
                >
                  <span class="master-confirmation-icon">
                    <ha-icon icon=${ne(e)}></ha-icon>
                  </span>
                  <span class="master-confirmation-copy">
                    <strong>${Z(this.hass,e)}</strong>
                    <small>${this._t(`settings.confirm_${e}_description`)}</small>
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
      `)}_renderSupportSection(){return K`
      <div class="sponsoring-section">
        <div class="sponsoring-header">
          <ha-icon icon="mdi:heart"></ha-icon>
          <h3>${this._t("support.title")}</h3>
        </div>
        <p class="sponsoring-text">${this._t("support.description")}</p>

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
    `}_renderDashboardSettingsPanel(){return this._dashboardId?this._renderSettingsPanel("mdi:view-dashboard",this._t("settings.dashboard"),this._t("strategy.dashboard_desc"),K`
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
      `):this._renderSettingsPanel("mdi:view-dashboard",this._t("settings.dashboard"),this._t("settings.default_dashboard_locked"),K`<div class="empty-settings-card">${this._t("settings.open_instance")}</div>`)}_homeSectionDetail(e){return"devices"===e?"house_information":"cameras"===e?"cameras":"custom_cards"===e?"custom_cards":"scenes"===e?"scenes":void 0}_openHomeSectionDetail(e){const t=this._homeSectionDetail(e);t&&(this._homeSettingsDetail=t,this._closeInlinePickers())}_renderHomeLayoutSettingsPanel(){if("climate"===this._homeSettingsDetail)return this._renderSettingsPanel("mdi:home-thermometer-outline",this._t("home.indoor_climate"),this._t("settings.home_climate_areas_description"),this._renderHomeClimateAreaSettings());if("outdoor_climate"===this._homeSettingsDetail)return this._renderSettingsPanel("mdi:sun-thermometer-outline",this._t("home.outdoor_climate"),this._t("settings.home_outdoor_climate_areas_description"),this._renderHomeOutdoorClimateAreaSettings());if("house_information"===this._homeSettingsDetail)return this._renderSettingsPanel("mdi:home-edit-outline",this._t("settings.house_information_cards"),this._t("settings.house_information_cards_description"),this._renderHomeInformationCardSettings());if("cameras"===this._homeSettingsDetail){const e=Ae.cameras;return this._renderSettingsPanel(e.icon,this._t(e.labelKey),this._t(e.descriptionKey),this._renderHomeCameraSettings())}if("custom_cards"===this._homeSettingsDetail){const e=Ae.custom_cards;return this._renderSettingsPanel(e.icon,this._t(e.labelKey),this._t(e.descriptionKey),this._renderHomeCustomCardsSettings())}if("scenes"===this._homeSettingsDetail){const e=Ae.scenes;return this._renderSettingsPanel(e.icon,this._t(e.labelKey),this._t(e.descriptionKey),this._renderHomeScenesSettings())}return this._renderSettingsPanel("mdi:home-edit-outline",this._t("settings.home_layout"),this._t("settings.home_layout_description"),this._renderHomeSectionOrder())}_renderReplacementsSettingsPanel(){const e=this._replacementEntries();return this._renderSettingsPanel("mdi:puzzle-edit-outline",this._t("settings.blueprint_replacements"),this._t("settings.replace_description"),K`
        <div class="replacement-section">
          <div class="replacement-summary">
            <div>
              <div class="replacement-count">${this._tp("common.active",this._replacementCount())}</div>
              <div class="replacement-help">${this._t("replacement.views_description")}</div>
            </div>
            <ha-button appearance="accent" @click=${()=>this._openReplacementManager()}>
              <ha-icon icon="mdi:plus"></ha-icon>
              ${this._t("replacement.assign")}
            </ha-button>
          </div>
          ${e.length?K`
            <div class="home-info-card-list replacement-list">
              ${X(e,e=>e.domain,({domain:e,assignment:t})=>{const i=!1!==t.enabled,s=Z(this.hass,e);return K`
                    <div class="home-info-card-item ${i?"":"disabled"}">
                      <div class="home-section-icon"><ha-icon .icon=${ne(e)}></ha-icon></div>
                      <div class="home-section-copy">
                        <div class="home-section-title">${s}</div>
                        <div class="home-section-description">
                          ${t.name}${t.version?` (v${t.version})`:""}
                        </div>
                      </div>
                      <div class="home-section-actions">
                        <ha-switch
                          .checked=${i}
                          aria-label=${this._t("replacement.enabled_label",{domain:s})}
                          title=${this._t("replacement.enabled_label",{domain:s})}
                          @change=${t=>this._setReplacementEnabled(e,t.target.checked)}
                        ></ha-switch>
                        <ha-icon-button
                          .label=${this._t("common.edit")}
                          .path=${L}
                          @click=${()=>this._openReplacementManager(e)}
                        ></ha-icon-button>
                        <ha-icon-button
                          .label=${this._t("common.delete")}
                          .path=${z}
                          @click=${()=>this._removeReplacement(e)}
                        ></ha-icon-button>
                      </div>
                    </div>
                  `})}
            </div>
          `:K`<div class="home-camera-settings-empty">${this._t("replacement.empty")}</div>`}
        </div>
      `)}_replacementEntries(){return Y(this._config?.blueprint_replacements).sort((e,t)=>Z(this.hass,e.domain).localeCompare(Z(this.hass,t.domain)))}_setReplacementEnabled(e,t){if(!this._config)return;const i=Y(this._config.blueprint_replacements).find(t=>t.domain===e)?.assignment;i&&this._fireConfigChanged({...this._config,blueprint_replacements:q(this._config.blueprint_replacements,e,{...i,enabled:t})})}async _removeReplacement(e){const t=Z(this.hass,e);await xe(this,{hass:this.hass,title:this._t("replacement.remove_confirm",{domain:t}),message:this._t("replacement.remove_message",{domain:t}),confirmLabel:this._t("common.delete"),destructive:!0})&&this._config&&this._fireConfigChanged({...this._config,blueprint_replacements:q(this._config.blueprint_replacements,e,void 0)})}_renderFavoritesSettingsPanel(){return this._renderSettingsPanel("mdi:star",this._t("favorites.title"),this._t("settings.favorites_page_description"),K`
        <div class="favorites-section">
          <div class="favorite-suggestions-toggle">
            <ha-formfield .label=${this._t("settings.show_suggested_favorites")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_suggested_favorites}
                @change=${this._toggleSuggestedFavorites}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">
              ${this._t("settings.suggested_favorites_description")}
            </p>
          </div>
          <div class="entity-picker">
            <div class="entity-picker-header">
              <h4>${this._t("settings.selected_entities")}</h4>
              <ha-button appearance="outlined" size="s" @click=${this._addFavoriteEntity}>
                <svg slot="start" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                ${this._t("settings.add_entity")}
              </ha-button>
            </div>

            ${this._renderSelectedEntities()}

            ${this._showEntityPicker?this._renderEntityPicker():""}
          </div>
        </div>
      `)}_renderTimeSettingsPanel(){return this._renderSettingsPanel("mdi:clock-outline",this._t("settings.time_date"),this._t("settings.time_date_description"),K`
        <div class="time-section">
          <div class="time-toggle">
            <ha-formfield .label=${this._t("settings.show_time")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_time}
                @change=${this._toggleTimeDisplay}
              ></ha-switch>
            </ha-formfield>
          </div>
        </div>
      `)}_renderNotificationSettingsPanel(){return this._renderSettingsPanel("mdi:bell-outline",this._t("home.notifications"),this._t("settings.notifications_description"),K`
        <div class="notifications-section">
          <div class="notifications-toggle">
            <ha-formfield .label=${this._t("settings.show_notifications")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_notifications}
                @change=${this._toggleNotificationsDisplay}
              ></ha-switch>
            </ha-formfield>
          </div>
        </div>
      `)}_renderWeatherSettingsPanel(){return this._renderSettingsPanel("mdi:weather-cloudy",this._t("domain.weather"),this._t("settings.weather_description"),K`
        <div class="weather-section">
          <div class="weather-toggle">
            <ha-formfield .label=${this._t("settings.show_weather")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_weather}
                @change=${this._toggleWeatherDisplay}
              ></ha-switch>
            </ha-formfield>
          </div>

          ${!1!==this._config?.settings?.show_weather?K`
            <div class="weather-picker">
              <div class="weather-picker-header">
                <h4>${this._t("settings.selected_weather")}</h4>
                <ha-button appearance="outlined" size="s" @click=${this._addWeatherEntity}>
                  <svg slot="start" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                  ${this._t("settings.select_weather")}
                </ha-button>
              </div>

              ${this._renderSelectedWeatherEntity()}

              ${this._showWeatherPicker?this._renderWeatherPicker():""}
            </div>
          `:""}
        </div>
      `)}_renderAlarmSettingsPanel(){return this._renderSettingsPanel("mdi:shield-home-outline",this._t("domain.alarm_control_panel"),this._t("settings.alarm_description"),K`
        <div class="alarm-section">
          <div class="alarm-toggle">
            <ha-formfield .label=${this._t("settings.show_alarm")}>
              <ha-switch
                .checked=${Boolean(this._config?.settings?.alarm_entity_id)&&!1!==this._config?.settings?.show_alarm}
                .disabled=${!this._config?.settings?.alarm_entity_id}
                @change=${this._toggleAlarmDisplay}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.show_alarm_description")}</p>
          </div>
          <div class="alarm-picker">
            <div class="alarm-picker-header">
              <h4>${this._t("settings.selected_alarm")}</h4>
              <ha-button appearance="outlined" size="s" @click=${this._addAlarmEntity}>
                <svg slot="start" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                </svg>
                ${this._t("settings.select_alarm")}
              </ha-button>
            </div>

            ${this._renderSelectedAlarmEntity()}

            ${this._showAlarmPicker?this._renderAlarmPicker():""}
          </div>
        </div>
      `)}_renderEntityDisplaySettingsPanel(){return this._renderSettingsPanel("mdi:eye-off",this._t("settings.devices_page"),this._t("settings.devices_description"),K`
        <div class="entity-display-section">
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.hide_unavailable_devices")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.hide_unavailable_entities_on_devices}
                @change=${this._toggleHideUnavailableEntities}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.hide_unavailable_devices_description")}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.show_new_devices")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_recent_devices_panel}
                @change=${this._toggleRecentDevicesPanel}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.show_new_devices_description")}</p>
          </div>
          ${this._renderDeviceVisibilityTree()}
        </div>
      `)}_renderPermissionsSettingsPanel(){return this._renderSettingsPanel("mdi:shield-account",this._t("settings.user_permissions"),this._t("settings.permissions_description"),K`
        <div class="entity-display-section">
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.restrict_ha_menu")}>
              <ha-switch
                .checked=${!0===this._config?.settings?.restrict_non_admin_ha_sidebar}
                @change=${this._toggleRestrictNonAdminHaSidebar}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.restrict_ha_menu_description")}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.restrict_editing")}>
              <ha-switch
                .checked=${!0===this._config?.settings?.restrict_non_admin_dashboard_settings}
                @change=${this._toggleRestrictNonAdminDashboardSettings}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.restrict_editing_description")}</p>
          </div>
        </div>
      `)}_renderPersonsSettingsPanel(){return this._renderSettingsPanel("mdi:account-multiple",this._t("settings.people"),this._t("settings.people_page_description"),K`
        <div class="persons-section">
          ${this._renderPersonsConfiguration()}
        </div>
      `)}_renderAreasSettingsPanel(){return this._renderSettingsPanel("mdi:floor-plan",this._t("settings.areas"),this._t("settings.areas_page_description"),K`
        <div class="entity-display-section">
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.hide_unavailable_areas")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.hide_unavailable_entities}
                @change=${this._toggleHideUnavailableAreaEntities}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.hide_unavailable_areas_description")}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.hide_area_name")}>
              <ha-switch
                .checked=${de(this._config?.settings)}
                @change=${this._toggleHideAreaName}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.hide_area_name_description")}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.hide_energy_sensors")}>
              <ha-switch
                .checked=${!0===this._config?.settings?.hide_energy_sensors_on_area_pages}
                @change=${this._toggleHideEnergySensors}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.hide_energy_sensors_description")}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("thermostat.setting_label")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_area_thermostat}
                @change=${this._toggleAreaThermostat}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("thermostat.setting_description")}</p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.show_area_favorites")}>
              <ha-switch
                .checked=${!1!==this._config?.settings?.show_area_favorites}
                @change=${this._toggleAreaFavorites}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">
              ${this._t("settings.show_area_favorites_description")}
              ${this._renderManageFavoritesLink("areas")}
            </p>
          </div>
          <div class="hide-unavailable-toggle">
            <ha-formfield .label=${this._t("settings.show_area_now_playing")}>
              <ha-switch
                .checked=${Pe(this._config?.settings)}
                @change=${this._toggleAreaNowPlaying}
              ></ha-switch>
            </ha-formfield>
            <p class="toggle-description">${this._t("settings.show_area_now_playing_description")}</p>
          </div>
          ${this._renderAreasConfiguration()}
        </div>
      `)}_renderAreasConfiguration(){if(!this.hass||!this._config)return W;const e=Object.values(this.hass.areas||{}),t=new Set(this._config.areas_display?.hidden||[]),i=ie(this._config.areas_display),s=ee(e,{...this._config.areas_display,hidden:[]},Se(this.hass)),a=new Map(s.map(e=>[e.area_id,e])),o=this._previewOrder("areas",s.map(e=>e.area_id)).map(e=>a.get(e));return K`
      <section class="area-order-settings" aria-labelledby="area-order-title">
        <div class="area-order-heading">
          <strong id="area-order-title">${this._t("settings.area_order_title")}</strong>
          <span>${this._t("settings.area_order_description")}</span>
        </div>
        <div class="area-order-modes" role="radiogroup" aria-label=${this._t("settings.area_order_title")}>
          ${[{mode:"home_assistant",icon:"mdi:home-assistant"},{mode:"custom",icon:"mdi:drag-vertical"},{mode:"alphabetical",icon:"mdi:sort-alphabetical-ascending"}].map(({mode:e,icon:t})=>K`
            <button
              type="button"
              class="area-order-mode ${i===e?"selected":""}"
              role="radio"
              aria-checked=${i===e?"true":"false"}
              @click=${()=>this._setAreaSortMode(e)}
            >
              <ha-icon .icon=${t}></ha-icon>
              <span>
                <strong>${this._t(`settings.area_order_${e}`)}</strong>
                <small>${this._t(`settings.area_order_${e}_description`)}</small>
              </span>
            </button>
          `)}
        </div>
        ${"custom"===i?K`
          <p class="area-order-hint">${this._t("settings.area_order_drag_hint")}</p>
        `:W}
      </section>

      <div class="sortable-container ${"custom"===i?"is-custom-order":""} ${this._draggedAreaId?"dragging":""}">
        ${X(o,e=>e.area_id,(e,s)=>{const a=t.has(e.area_id),r=this._draggedAreaId===e.area_id,n=this._dragOverIndex===s&&this._draggedAreaId&&this._draggedAreaId!==e.area_id;return K`
              <div
                class="sortable-item ${a?"hidden":""} ${r?"dragging":""} ${n?"drag-over":""}"
                data-area-id="${e.area_id}"
                data-index="${s}"
                .draggable=${"custom"===i}
                @dragstart=${t=>"custom"===i&&this._handleAreaDragStart(t,e.area_id)}
                @dragend=${this._handleAreaDragEnd}
                @dragover=${e=>"custom"===i&&this._handleAreaDragOver(e,s)}
                @dragleave=${this._handleAreaDragLeave}
                @drop=${e=>"custom"===i&&this._handleAreaDrop(e,s)}
              >
                <div class="area-item">
                  <div class="handle ${"custom"!==i?"disabled":""}" aria-hidden="true">
                    <ha-svg-icon .path=${T}></ha-svg-icon>
                  </div>
                  ${e.icon?K`
                    <ha-icon
                      .icon=${e.icon}
                      class="area-icon"
                    ></ha-icon>
                  `:W}
                  <button
                    type="button"
                    class="area-name clickable"
                    aria-label=${`${this._t("common.edit")}: ${e.name}`}
                    @click=${()=>this._editArea(e.area_id)}
                  >
                    <span class="area-name-text">${e.name}</span>
                    <ha-icon icon="mdi:chevron-right" class="chevron" aria-hidden="true"></ha-icon>
                  </button>
                  <div class="area-actions">
                    ${"custom"===i?K`
                      <ha-icon-button
                        .label=${this._t("settings.move_up")}
                        .path=${N}
                        .disabled=${0===s}
                        @click=${()=>this._moveArea(e.area_id,-1)}
                      ></ha-icon-button>
                      <ha-icon-button
                        .label=${this._t("settings.move_down")}
                        .path=${M}
                        .disabled=${s===o.length-1}
                        @click=${()=>this._moveArea(e.area_id,1)}
                      ></ha-icon-button>
                    `:W}
                    <ha-icon-button
                      .label=${this._t(a?"common.show":"common.hide")}
                      .path=${a?F:j}
                      @click=${()=>this._toggleAreaVisibility(e.area_id)}
                    ></ha-icon-button>
                  </div>
                </div>
              </div>
            `})}
      </div>
      <div class="settings-reset-row">
        <button
          class="home-layout-reset"
          type="button"
          ?disabled=${st(this._config.areas_display)}
          @click=${this._resetAreasConfiguration}
        >
          ${this._t("settings.reset_area_list")}
        </button>
      </div>
    `}_getAreaEditorCustomCards(){if(!this._config||!this._area)return[];const e=this._config.areas_options?.[this._area]?.custom_cards;return Array.isArray(e)?e.filter(e=>e?.id&&e?.card&&"object"==typeof e.card):[]}_areaCustomCardTitle(e){const t=e.card,i="string"==typeof t?.entity?t.entity:"",s=i?this.hass?.states?.[i]?.attributes?.friendly_name:void 0,a=String(t?.type||"card").replace(/^custom:/,"").replace(/-/g," ");return String(t?.title||t?.name||s||a)}_areaCustomCardSubtitle(e){return String(e.card?.type||"card").replace(/^custom:/,"")}_areaCustomCardPlacementIndex(e,t){const i=e.findIndex(e=>e.id===t.id);return i<0?0:e.slice(0,i).filter(e=>e.placement===t.placement).length}_domainCustomCardPlacementIndex(e,t){const i=`domain:${t}:`;if(!e.startsWith(i))return;const s=Number(e.slice(i.length));return Number.isFinite(s)&&s>=0?s:void 0}_getAreaEditorDomainCardsForSlot(e,t,i,s){const a=`domain:${t}:${i}`;return e.filter(e=>{if(e.placement===a)return!0;const o=this._domainCustomCardPlacementIndex(e.placement,t);return i===s&&void 0!==o&&o>s||i===s&&e.placement===`after:${t}`})}_areaEditorFreeSlotForCard(e,t,i){const s=/^ungrouped:(\d+)$/.exec(e.placement);if(s)return Math.min(t.length,Number(s[1]));const a=/^domain:([^:]+):(\d+)$/.exec(e.placement),o=/^after:(.+)$/.exec(e.placement),r=a?.[1]||o?.[1];if(!r||!te.includes(r))return;const n=t.map((e,t)=>i.get(e)===r?t:-1).filter(e=>e>=0);if(!n.length)return t.length;if(o)return Math.min(t.length,n[n.length-1]+1);const d=Number(a?.[2]||0);return d<=0?n[0]:d>=n.length?Math.min(t.length,n[n.length-1]+1):n[d]}_getAreaEditorFreeCardsForSlot(e,t,i,s){return e.filter(e=>"top"!==e.placement&&"bottom"!==e.placement&&this._areaEditorFreeSlotForCard(e,i,s)===t)}_renderAreaCustomCardEditorRow(e){const t=this._getAreaEditorCustomCards(),i=this._areaCustomCardPlacementIndex(t,e),s=this._draggedAreaCustomCardId===e.id,a=this._dragOverAreaCustomCardTarget?.placement===e.placement&&this._dragOverAreaCustomCardTarget.index===i;return K`
      <div
        class="sortable-item custom-card-item ${s?"dragging":""} ${a?"drag-over":""}"
        draggable="true"
        @dragstart=${t=>this._handleAreaCustomCardDragStart(t,e.id)}
        @dragend=${this._handleAreaCustomCardDragEnd}
        @dragover=${t=>this._handleAreaCustomCardDragOver(t,e.placement,i)}
        @drop=${t=>this._handleAreaCustomCardDrop(t,e.placement,i)}
      >
        <div class="entity-item">
          <div class="handle"><ha-svg-icon .path=${T}></ha-svg-icon></div>
          <span class="custom-card-icon"><ha-icon icon="mdi:cards-outline"></ha-icon></span>
          <span class="entity-name">
            ${this._areaCustomCardTitle(e)}
            <small>${this._t("layout.custom_cards")} · ${this._areaCustomCardSubtitle(e)}</small>
          </span>
          <span class="custom-card-badge">${this._t("layout.drag_card")}</span>
        </div>
      </div>
    `}_renderAreaCustomCardPlacement(e,t,i){const s=e.filter(e=>e.placement===t);if(!s.length&&!this._draggedAreaCustomCardId)return W;const a=this._dragOverAreaCustomCardTarget?.placement===t&&this._dragOverAreaCustomCardTarget.index===s.length;return K`
      <section
        class="area-custom-card-placement ${a?"drag-over":""}"
        @dragover=${e=>this._handleAreaCustomCardDragOver(e,t,s.length)}
        @drop=${e=>this._handleAreaCustomCardDrop(e,t,s.length)}
      >
        <div class="area-custom-card-placement-title">
          <ha-icon icon=${"top"===t?"mdi:format-vertical-align-top":"mdi:format-vertical-align-bottom"}></ha-icon>
          <span>${i}</span>
        </div>
        <div class="sortable-container area-custom-card-list">
          ${s.map(e=>this._renderAreaCustomCardEditorRow(e))}
          ${s.length?W:K`<span class="area-custom-card-empty">${this._t("layout.drag_card")}</span>`}
        </div>
      </section>
    `}_renderAreaCustomCardDropZone(e){if(!this._draggedAreaCustomCardId)return W;const t=this._dragOverAreaCustomCardTarget?.placement===e;return K`
      <div
        class="area-custom-card-drop-zone ${t?"drag-over":""}"
        @dragover=${t=>this._handleAreaCustomCardDragOver(t,e,Number.POSITIVE_INFINITY)}
        @drop=${t=>this._handleAreaCustomCardDrop(t,e,Number.POSITIVE_INFINITY)}
      >
        <ha-icon icon="mdi:cards-outline"></ha-icon>
        <span>${this._t("layout.drag_card")}</span>
      </div>
    `}_renderAreaEditor(){if(!this.hass||!this._config||!this._area)return W;const e=this.hass.areas[this._area];if(!e)return W;const t=this._areaEditorEntities(this._area),i=this._getAreaGroupedEntitiesWithoutFiltering(t,this.hass),s=this._config.areas_options?.[this._area]||{},a="ungrouped"===s.entity_layout?"ungrouped":"grouped",o=new Map;te.forEach(e=>{(i[e]||[]).forEach(t=>o.set(t,e))});const r=te.flatMap(e=>i[e]||[]),n=s.entity_order||[],d=this._sortEntityIds(r,n),c=this._previewOrder(this._entityDragList(ft),d),l=this._getAreaEditorCustomCards(),h=this._sortAreaStrategyGroups(te.filter(e=>(i[e]||[]).length>0||l.some(t=>t.placement===`after:${e}`||void 0!==this._domainCustomCardPlacementIndex(t.placement,e)))),p=this._previewOrder(`area-groups:${this._area}`,h);return K`
      <div class="editor-container">
        <div class="toolbar">
          <ha-icon-button
            .path=${V}
            .label=${this._t("strategy.back")}
            @click=${()=>{this._area=void 0}}
          ></ha-icon-button>
          <h2>${e.name}</h2>
        </div>

        <div class="area-help">
          <ha-svg-icon .path=${B} class="area-help-icon"></ha-svg-icon>
          <div class="area-help-text">
            <p>
              ${this._t("settings.area_sensor_help_before")}
              <button class="link" @click=${this._editAreaRegistry}>${this._t("settings.edit_room")}</button>${this._t("settings.area_sensor_help_after")}
            </p>
            <p>
              ${this._t("settings.area_power_help")}
            </p>
          </div>
        </div>

        ${l.length||this._draggedAreaCustomCardId?K`
          <section class="area-custom-cards-settings">
            <div class="area-entity-layout-copy">
              <strong>${this._t("layout.custom_cards")}</strong>
              <span>${this._t("settings.area_entity_order_hint")}</span>
            </div>
            ${this._renderAreaCustomCardPlacement(l,"top",this._t("layout.custom_cards_top"))}
          </section>
        `:W}


        ${!0===this._config.settings?.hide_energy_sensors_on_area_pages?K`
          <section class="area-entity-layout-settings area-energy-sensors-settings">
            <ha-formfield .label=${this._t("settings.area_show_energy_sensors")}>
              <ha-switch
                .checked=${!0===s.show_energy_sensors}
                @change=${this._toggleAreaShowEnergySensors}
              ></ha-switch>
            </ha-formfield>
            <span class="area-energy-sensors-description">${this._t("settings.area_show_energy_sensors_description")}</span>
          </section>
        `:W}

        <section class="area-entity-layout-settings">
          <div class="area-entity-layout-copy">
            <strong>${this._t("settings.area_entity_layout_title")}</strong>
            <span>${this._t("settings.area_entity_layout_description")}</span>
          </div>
          <div class="area-order-modes">
            <button
              class="area-order-mode ${"grouped"===a?"selected":""}"
              type="button"
              @click=${()=>this._setAreaEntityLayout("grouped",d,o)}
            >
              <ha-icon icon="mdi:format-list-group"></ha-icon>
              <span>
                <strong>${this._t("settings.area_entity_layout_grouped")}</strong>
                <small>${this._t("settings.area_entity_layout_grouped_description")}</small>
              </span>
            </button>
            <button
              class="area-order-mode ${"ungrouped"===a?"selected":""}"
              type="button"
              @click=${()=>this._setAreaEntityLayout("ungrouped")}
            >
              <ha-icon icon="mdi:sort-variant"></ha-icon>
              <span>
                <strong>${this._t("settings.area_entity_layout_ungrouped")}</strong>
                <small>${this._t("settings.area_entity_layout_ungrouped_description")}</small>
              </span>
            </button>
          </div>
        </section>

        ${"ungrouped"===a?K`
          <ha-expansion-panel expanded outlined>
            <div slot="header">
              <ha-icon icon="mdi:sort-variant"></ha-icon>
              ${this._t("settings.area_entity_order")}
            </div>
            <p class="area-order-hint secondary">${this._t("settings.area_entity_order_hint")}</p>
            <div class="sortable-container dragging-enabled ${this._draggedEntityGroup===ft?"dragging":""}">
              ${this._getAreaEditorFreeCardsForSlot(l,0,c,o).map(e=>this._renderAreaCustomCardEditorRow(e))}
              ${X(c,e=>e,(t,i)=>{const a=this.hass.states[t],r=o.get(t)||"others",n=new Set(s.groups_options?.[r]?.hidden||[]).has(t),h=this._draggedEntityId===t&&this._draggedEntityGroup===ft,p=this._dragOverEntityIndex===i&&this._draggedEntityGroup===ft&&this._draggedEntityId&&this._draggedEntityId!==t;return K`
                    <div
                      class="sortable-item ${n?"hidden":""} ${h?"dragging":""} ${p?"drag-over":""}"
                      draggable="true"
                      @dragstart=${e=>this._handleEntityDragStart(e,t,ft)}
                      @dragend=${this._handleEntityDragEnd}
                      @dragover=${e=>this._handleAreaEditorDragOver(e,ft,i)}
                      @dragleave=${this._handleEntityDragLeave}
                      @drop=${e=>this._handleAreaEditorDrop(e,ft,i)}
                    >
                      <div class="entity-item">
                        <div class="handle"><ha-svg-icon .path=${T}></ha-svg-icon></div>
                        <ha-state-icon .stateObj=${a} class="entity-icon"></ha-state-icon>
                        <span class="entity-name">
                          ${this._areaEditorEntityName(t,e.name)}
                          <small>${this._getGroupTitle(r)}</small>
                        </span>
                        <div class="entity-order-buttons">
                          <ha-icon-button
                            .label=${this._t("settings.move_up")}
                            .path=${N}
                            .disabled=${0===i}
                            @click=${()=>this._moveUngroupedEntity(d,i,-1)}
                          ></ha-icon-button>
                          <ha-icon-button
                            .label=${this._t("settings.move_down")}
                            .path=${M}
                            .disabled=${i===d.length-1}
                            @click=${()=>this._moveUngroupedEntity(d,i,1)}
                          ></ha-icon-button>
                        </div>
                        <ha-icon-button
                          .label=${n?this._t("common.show"):this._t("common.hide")}
                          .path=${n?F:j}
                          @click=${()=>this._toggleEntityVisibility(t,r)}
                        ></ha-icon-button>
                      </div>
                    </div>
                    ${this._getAreaEditorFreeCardsForSlot(l,i+1,c,o).map(e=>this._renderAreaCustomCardEditorRow(e))}
                  `})}
              ${this._renderAreaCustomCardDropZone(`ungrouped:${d.length}`)}
            </div>
          </ha-expansion-panel>
        `:X(p,e=>e,(t,s)=>{const a=i[t]||[],o=this._config.areas_options?.[this._area]?.groups_options?.[t],r=new Set(o?.hidden||[]),n=o?.order||[],d=this._previewOrder(this._entityDragList(t),this._sortEntityIds(a,n)),c=dt(a,r),g=ct(a.length,c);return K`
            <div
              class="area-entity-section ${"hidden"===g?"is-hidden":""} ${this._draggedEntitySection===t?"dragging":""} ${this._dragOverEntitySection===t?"drag-over":""}"
              @dragover=${e=>this._handleEntitySectionDragOver(e,t)}
              @drop=${e=>this._handleEntitySectionDrop(e,t,h)}
            >
              <ha-expansion-panel
                outlined
                .expanded=${!this._collapsedAreaGroups.has(t)}
                @expanded-changed=${e=>this._handleAreaGroupExpandedChanged(e,t)}
              >
                <div slot="header" class="area-entity-section-header">
                  <ha-icon icon=${ce[t]}></ha-icon>
                  <span class="area-entity-section-title">
                    ${this._getGroupTitle(t)}
                    ${"visible"!==g?K`
                      <small>${this._t("settings.visible_count",{visible:a.length-c,total:a.length})}</small>
                    `:W}
                  </span>
                  <span class="area-entity-section-actions">
                    ${a.length?this._renderVisibilityButton(g,ht(g)?this._t("settings.hide_group"):this._t("settings.show_group"),()=>this._setAreaEntityGroupHidden(t,a,ht(g))):W}
                    <ha-icon-button
                      .label=${this._t("settings.move_up")}
                      .path=${N}
                      .disabled=${0===s}
                      @click=${e=>this._moveEntitySection(e,h,s,-1)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t("settings.move_down")}
                      .path=${M}
                      .disabled=${s===p.length-1}
                      @click=${e=>this._moveEntitySection(e,h,s,1)}
                    ></ha-icon-button>
                    <button
                      class="area-entity-section-handle"
                      type="button"
                      draggable="true"
                      title=${this._t("layout.drag_group")}
                      aria-label=${this._t("layout.drag_group")}
                      @click=${e=>e.stopPropagation()}
                      @dragstart=${e=>this._handleEntitySectionDragStart(e,t,h)}
                      @dragend=${this._handleEntitySectionDragEnd}
                    >
                      <ha-svg-icon .path=${T}></ha-svg-icon>
                    </button>
                  </span>
                </div>
                <div class="sortable-container ${this._draggedEntityGroup===t?"dragging":""}">
                ${this._getAreaEditorDomainCardsForSlot(l,t,0,d.length).map(e=>this._renderAreaCustomCardEditorRow(e))}
                ${X(d,e=>e,(i,s)=>{const a=this.hass.states[i],o=r.has(i),n=this._draggedEntityId===i&&this._draggedEntityGroup===t,c=this._dragOverEntityIndex===s&&this._draggedEntityGroup===t&&this._draggedEntityId&&this._draggedEntityId!==i;return K`
                      <div
                        class="sortable-item ${o?"hidden":""} ${n?"dragging":""} ${c?"drag-over":""}"
                        data-entity-id="${i}"
                        data-index="${s}"
                        draggable="true"
                        @dragstart=${e=>this._handleEntityDragStart(e,i,t)}
                        @dragend=${this._handleEntityDragEnd}
                        @dragover=${e=>this._handleAreaEditorDragOver(e,t,s)}
                        @dragleave=${this._handleEntityDragLeave}
                        @drop=${e=>this._handleAreaEditorDrop(e,t,s)}
                      >
                        <div class="entity-item">
                          <div class="handle">
                            <ha-svg-icon .path=${T}></ha-svg-icon>
                          </div>
                          <ha-state-icon
                            .stateObj=${a}
                            class="entity-icon"
                          ></ha-state-icon>
                          <span class="entity-name">
                            ${this._areaEditorEntityName(i,e.name)}
                          </span>
                          <ha-icon-button
                            .label=${o?this._t("common.show"):this._t("common.hide")}
                            .path=${o?F:j}
                            @click=${()=>this._toggleEntityVisibility(i,t)}
                          ></ha-icon-button>
                        </div>
                      </div>
                      ${this._getAreaEditorDomainCardsForSlot(l,t,s+1,d.length).map(e=>this._renderAreaCustomCardEditorRow(e))}
                    `})}
                  ${this._renderAreaCustomCardDropZone(`domain:${t}:${d.length}`)}
                </div>
              </ha-expansion-panel>
            </div>
          `})}
        ${l.length||this._draggedAreaCustomCardId?this._renderAreaCustomCardPlacement(l,"bottom",this._t("layout.custom_cards_bottom")):W}
        <div class="settings-reset-row area-editor-reset-row">
          ${"grouped"===a?K`
            <button
              class="home-layout-reset"
              type="button"
              title=${this._t("settings.apply_group_order_all_description")}
              ?disabled=${!this._areaGroupOrderChanged}
              @click=${this._applyAreaGroupOrderToAllAreas}
            >
              ${this._t("settings.apply_group_order_all")}
            </button>
          `:W}
          <button
            class="home-layout-reset"
            type="button"
            ?disabled=${ot(s)}
            @click=${this._resetAreaLayout}
          >
            ${this._t("settings.reset_room_layout")}
          </button>
        </div>
      </div>
    `}_areaEditorEntityName(e,t){const i=this.hass?.states?.[e]?.attributes?.friendly_name||e;return le(String(i),t,this._config?.settings)}_getHomeSectionsOrder(){return Ee(this._config?.settings?.home_sections_order)}_getHiddenHomeSections(){return new Set(Oe(this._config?.settings))}_getHiddenHomeInformationCards(){return new Set(Le(this._config?.settings?.home_information_cards_hidden))}_getHomeCameraSettings(){if(!this._config||!this.hass)return[];const e=ee(this._config.areas||[],this._config.areas_display,Se(this.hass)),t=new Map(e.map(e=>[e.area_id,e])),i=new Map(e.map((e,t)=>[e.area_id,t])),s=new Map((this._config.devices||[]).map(e=>[e.device_id,e.area_id||""])),a=new Map((this._config.entities||[]).map(e=>[e.entity_id,e])),o=[...new Set([...(this._config.entities||[]).map(e=>e.entity_id),...Object.keys(this.hass.states||{})].filter(e=>e.startsWith("camera.")))].flatMap(e=>{const i=this.hass.states[e],o=Ze(this.hass)[e],r=a.get(e);if(!i||o?.hidden_by||"diagnostic"===o?.entity_category||"config"===o?.entity_category)return[];const n=r?.device_id||o?.device_id||"",d=r?.area_id||o?.area_id||s.get(n)||"",c=t.get(d);return c?[{entityId:e,name:i.attributes?.friendly_name||o?.name||e,areaId:d,areaName:c.name,state:this.hass.formatEntityState(i)}]:[]});o.sort((e,t)=>(i.get(e.areaId)??Number.MAX_SAFE_INTEGER)-(i.get(t.areaId)??Number.MAX_SAFE_INTEGER)||e.name.localeCompare(t.name));const r=this._config.settings?.home_camera_order||[],n=new Map(r.map((e,t)=>[e,t]));return o.sort((e,t)=>{const i=n.get(e.entityId),s=n.get(t.entityId);return void 0!==i||void 0!==s?(i??Number.MAX_SAFE_INTEGER)-(s??Number.MAX_SAFE_INTEGER):0})}_setHomeCameraOrder(e){this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_camera_order:e}})}_moveHomeCamera(e,t){const i=this._getHomeCameraSettings().map(e=>e.entityId),s=i.indexOf(e),a=s+t;s<0||a<0||a>=i.length||([i[s],i[a]]=[i[a],i[s]],this._setHomeCameraOrder(i))}_toggleHomeCamera(e){if(!this._config)return;const t=new Set(this._config.settings?.home_cameras_hidden||[]);t.has(e)?t.delete(e):t.add(e),this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_cameras_hidden:[...t]}})}_setHomeSectionsOrder(e){if(!this._config)return;const t={...this._config,settings:{...this._config.settings,home_sections_order:Ee(e),home_sections_hidden:[...this._getHiddenHomeSections()]}};this._fireConfigChanged(t)}_toggleHomeSectionEnabled(e){if(!this._config)return;const t=new Set(this._getHiddenHomeSections());t.has(e)?t.delete(e):t.add(e);const i={...this._config,settings:{...this._config.settings,home_sections_order:this._getHomeSectionsOrder(),home_sections_hidden:ze([...t])}};this._fireConfigChanged(i)}_moveHomeSection(e,t){const i=this._getHomeSectionsOrder(),s=i.indexOf(e),a=s+t;if(s<0||a<0||a>=i.length)return;const o=[...i];[o[s],o[a]]=[o[a],o[s]],this._setHomeSectionsOrder(o)}_toggleHomeInformationCardEnabled(e){if(!this._config)return;const t=new Set(this._getHiddenHomeInformationCards());t.has(e)?t.delete(e):t.add(e);const i={...this._config,settings:{...this._config.settings,home_information_cards_hidden:Le([...t])}};this._fireConfigChanged(i)}_renderHomeSectionOrder(){const e=this._previewOrder("home-sections",this._getHomeSectionsOrder()),t=this._getHiddenHomeSections();return K`
      <div class="home-layout-section">
        <div class="home-section-list ${this._draggedHomeSection?"dragging":""}">
          ${X(e,e=>e,(i,s)=>{const a=Ae[i],o=!t.has(i),r=this._draggedHomeSection===i,n=this._dragOverHomeSectionIndex===s&&this._draggedHomeSection&&this._draggedHomeSection!==i,d=this._homeSectionDetail(i),c="favorites"===i,l=Boolean(d)||c;return K`
                <div
                  class="home-section-item ${o?"":"disabled"} ${l?"has-detail":""} ${r?"dragging":""} ${n?"drag-over":""}"
                  draggable="true"
                  data-section=${i}
                  data-index=${s}
                  @click=${()=>c?this._openFavoritesFrom("home"):d&&this._openHomeSectionDetail(i)}
                  @dragstart=${e=>this._handleHomeSectionDragStart(e,i)}
                  @dragend=${this._handleHomeSectionDragEnd}
                  @dragover=${e=>this._handleHomeSectionDragOver(e,s)}
                  @dragleave=${this._handleHomeSectionDragLeave}
                  @drop=${e=>this._handleHomeSectionDrop(e,s)}
                >
                  <div class="home-section-handle" @click=${e=>e.stopPropagation()}>
                    <ha-svg-icon .path=${T}></ha-svg-icon>
                  </div>
                  <div class="home-section-icon">
                    <ha-icon icon=${a.icon}></ha-icon>
                  </div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${this._t(a.labelKey)}</div>
                    <div class="home-section-description">
                      ${this._t(a.descriptionKey)}
                      ${c?this._renderManageFavoritesLink("home"):W}
                    </div>
                  </div>
                  ${l?K`<ha-svg-icon class="home-section-detail-chevron" .path=${P}></ha-svg-icon>`:W}
                  <div class="home-section-actions" @click=${e=>e.stopPropagation()}>
                    <button
                      class="home-section-toggle ${o?"enabled":""}"
                      type="button"
                      title=${o?this._t("settings.hide_section"):this._t("settings.show_section")}
                      aria-label=${o?this._t("settings.hide_section"):this._t("settings.show_section")}
                      aria-pressed=${o?"true":"false"}
                      @click=${()=>this._toggleHomeSectionEnabled(i)}
                    >
                      <ha-icon icon=${o?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon>
                    </button>
                    <ha-icon-button
                      .label=${this._t("settings.move_up")}
                      .path=${N}
                      .disabled=${0===s}
                      @click=${()=>this._moveHomeSection(i,-1)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t("settings.move_down")}
                      .path=${M}
                      .disabled=${s===e.length-1}
                      @click=${()=>this._moveHomeSection(i,1)}
                    ></ha-icon-button>
                  </div>
                </div>
              `})}
        </div>
        <button class="home-layout-reset" type="button" @click=${this._resetHomeSectionsOrder}>
          ${this._t("settings.reset_layout")}
        </button>
      </div>
    `}_getHomeCustomCards(){const e=this._config?.home_custom_cards;return Array.isArray(e)?e.filter(e=>Boolean(e?.id)&&Boolean(e?.card)&&"object"==typeof e.card&&"string"==typeof e.card.type):[]}_createHomeCustomCardId(){return`home-card-${Date.now()}-${Math.random().toString(36).slice(2,8)}`}_homeCustomCardTitle(e){const t=e.card,i="string"==typeof t.entity?t.entity:"";return t.title||t.name||this.hass?.states?.[i]?.attributes?.friendly_name||i||t.type.replace(/^custom:/,"")}_homeCustomCardSubtitle(e){return e.card.type.replace(/^custom:/,"")}_updateHomeCustomCards(e){this._config&&this._fireConfigChanged({...this._config,home_custom_cards:e})}_addHomeCustomCard(){Te(this,{areaName:this._t("home_section.custom_cards.label"),onSave:e=>{this._updateHomeCustomCards([...this._getHomeCustomCards(),{id:this._createHomeCustomCardId(),card:e}])}})}_editHomeCustomCard(e){const t=this._getHomeCustomCards(),i=t.find(t=>t.id===e);i&&Te(this,{card:i.card,areaName:this._t("home_section.custom_cards.label"),onSave:i=>{this._updateHomeCustomCards(t.map(t=>t.id===e?{...t,card:i}:t))}})}async _deleteHomeCustomCard(e){await xe(this,{hass:this.hass,title:this._t("layout.delete_card_confirm"),message:this._t("layout.delete_card_message"),confirmLabel:this._t("common.delete"),destructive:!0})&&this._updateHomeCustomCards(this._getHomeCustomCards().filter(t=>t.id!==e))}_moveHomeCustomCard(e,t){const i=this._getHomeCustomCards(),s=i.findIndex(t=>t.id===e),a=s+t;if(s<0||a<0||a>=i.length)return;const o=[...i];[o[s],o[a]]=[o[a],o[s]],this._updateHomeCustomCards(o)}_renderHomeCustomCardsSettings(){const e=this._getHomeCustomCards();return K`
      <div class="home-info-card-section home-custom-card-settings-section">
        <div class="home-info-card-header">
          <div>
            <h4>${this._t("settings.home_custom_cards")}</h4>
            <p>${this._t("settings.home_custom_cards_description")}</p>
          </div>
          <button class="home-custom-card-add" type="button" @click=${this._addHomeCustomCard}>
            <ha-icon icon="mdi:plus"></ha-icon>
            ${this._t("settings.add_home_card")}
          </button>
        </div>
        ${e.length?K`
          <div class="home-custom-card-settings-list">
            ${X(e,e=>e.id,(t,i)=>K`
                <div class="home-info-card-item home-custom-card-settings-item">
                  <div class="home-section-icon"><ha-icon icon="mdi:cards-outline"></ha-icon></div>
                  <div class="home-section-copy">
                    <div class="home-section-title">${this._homeCustomCardTitle(t)}</div>
                    <div class="home-section-description">${this._homeCustomCardSubtitle(t)}</div>
                  </div>
                  <div class="home-section-actions">
                    <ha-icon-button
                      .label=${this._t("settings.move_up")}
                      .path=${N}
                      .disabled=${0===i}
                      @click=${()=>this._moveHomeCustomCard(t.id,-1)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t("settings.move_down")}
                      .path=${M}
                      .disabled=${i===e.length-1}
                      @click=${()=>this._moveHomeCustomCard(t.id,1)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t("common.edit")}
                      .path=${L}
                      @click=${()=>this._editHomeCustomCard(t.id)}
                    ></ha-icon-button>
                    <ha-icon-button
                      .label=${this._t("common.delete")}
                      .path=${z}
                      @click=${()=>this._deleteHomeCustomCard(t.id)}
                    ></ha-icon-button>
                  </div>
                </div>
              `)}
          </div>
        `:K`
          <div class="home-camera-settings-empty">${this._t("settings.no_home_custom_cards")}</div>
        `}
      </div>
    `}_getExcludedHomeClimateAreas(){return new Set(this._config?.settings?.home_climate_excluded_areas||[])}_toggleHomeClimateArea(e,t){if(!this._config)return;const i=this._getExcludedHomeClimateAreas();t?i.delete(e):i.add(e),this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_climate_excluded_areas:[...i]}})}_renderHomeClimateAreaSettings(){if(!this._config||!this.hass)return W;const e=this._getExcludedHomeClimateAreas(),t=this._getHomeOutdoorClimateAreas(),i=new Set(this._config.areas_display?.hidden||[]),s=ee(this._config.areas||[],{...this._config.areas_display,hidden:[]},Se(this.hass)).filter(e=>!i.has(e.area_id));return K`
      <div class="home-info-card-section home-climate-area-settings">
        <div class="home-info-card-header"><div><h4>${this._t("settings.home_climate_areas_title")}</h4><p>${this._t("settings.home_climate_areas_description")}</p></div></div>
        <div class="home-info-card-list">
          ${s.map(i=>{const s=t.has(i.area_id),a=!s&&!e.has(i.area_id);return K`
              <div class="home-info-card-item ${a?"enabled":"disabled"}">
                <div class="home-section-icon"><ha-icon icon=${i.icon||"mdi:floor-plan"}></ha-icon></div>
                <div class="home-section-copy">
                  <div class="home-section-title">${i.name}</div>
                  ${s?K`<div class="home-section-description">${this._t("settings.home_climate_area_outdoor")}</div>`:W}
                </div>
                <ha-switch
                  .checked=${a}
                  ?disabled=${s}
                  @change=${e=>this._toggleHomeClimateArea(i.area_id,e.target.checked)}
                ></ha-switch>
              </div>
            `})}
        </div>
      </div>
    `}_getHomeOutdoorClimateAreas(){return new Set(this._config?.settings?.home_outdoor_climate_areas||[])}_toggleHomeOutdoorClimateArea(e,t){if(!this._config)return;const i=this._getHomeOutdoorClimateAreas();t?i.add(e):i.delete(e),this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_outdoor_climate_areas:[...i]}})}_renderHomeOutdoorClimateAreaSettings(){if(!this._config||!this.hass)return W;const e=this._getHomeOutdoorClimateAreas(),t=ee(this._config.areas||[],{...this._config.areas_display,hidden:[]},Se(this.hass));return K`
      <div class="home-info-card-section home-climate-area-settings">
        <div class="home-info-card-header"><div><h4>${this._t("settings.home_outdoor_climate_areas_title")}</h4><p>${this._t("settings.home_outdoor_climate_areas_description")}</p></div></div>
        <div class="home-info-card-list">
          ${t.map(t=>{const i=e.has(t.area_id);return K`
            <div class="home-info-card-item ${i?"enabled":"disabled"}">
              <div class="home-section-icon"><ha-icon icon=${t.icon||"mdi:floor-plan"}></ha-icon></div>
              <div class="home-section-copy"><div class="home-section-title">${t.name}</div></div>
              <ha-switch .checked=${i} @change=${e=>this._toggleHomeOutdoorClimateArea(t.area_id,e.target.checked)}></ha-switch>
            </div>
          `})}
        </div>
      </div>
    `}_renderHomeInformationCardSettings(){const e=this._getHiddenHomeInformationCards(),t=Ie.filter(t=>!e.has(t)).length;return K`
      <div class="home-info-card-section home-information-card-settings">
        <div class="home-info-card-header">
          <div>
            <h4>${this._t("settings.house_information_cards")}</h4>
            <p>${this._t("settings.house_information_cards_description")}</p>
          </div>
          <span>${this._t("settings.visible_count",{visible:t,total:Ie.length})}</span>
        </div>
        <div class="home-info-card-list">
          ${Ie.map(t=>{const i=Fe[t],s=!e.has(t),a="climate"===t||"outdoor_climate"===t?t:void 0,o=Boolean(a);return K`
              <div
                class="home-info-card-item ${s?"enabled":"disabled"} ${o?"has-detail":""}"
                @click=${()=>{a&&(this._homeSettingsDetail=a)}}
              >
                <div class="home-section-icon"><ha-icon icon=${i.icon}></ha-icon></div>
                <div class="home-section-copy">
                  <div class="home-section-title">${this._t(i.labelKey)}</div>
                  <div class="home-section-description">${this._t(i.descriptionKey)}</div>
                </div>
                <div class="home-info-card-actions" @click=${e=>e.stopPropagation()}>
                  ${o?K`<ha-svg-icon class="home-section-detail-chevron" .path=${P}></ha-svg-icon>`:W}
                  <button
                    class="home-section-toggle ${s?"enabled":""}"
                    type="button"
                    title=${s?this._t("settings.hide_section"):this._t("settings.show_section")}
                    aria-label=${s?this._t("settings.hide_section"):this._t("settings.show_section")}
                    aria-pressed=${s?"true":"false"}
                    @click=${()=>this._toggleHomeInformationCardEnabled(t)}
                  >
                    <ha-icon icon=${s?"mdi:eye-outline":"mdi:eye-off-outline"}></ha-icon>
                  </button>
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_renderHomeCameraSettings(){const e=this._getHomeCameraSettings(),t=new Map(e.map(e=>[e.entityId,e])),i=this._previewOrder("home-cameras",e.map(e=>e.entityId)).map(e=>t.get(e)),s=new Set(this._config?.settings?.home_cameras_hidden||[]),a=i.filter(e=>!s.has(e.entityId)).length;return K`
      <div class="home-info-card-section home-camera-settings-section">
        <div class="home-info-card-header">
          <div>
            <h4>${this._t("settings.home_camera_cards")}</h4>
            <p>${this._t("settings.home_camera_cards_description")}</p>
          </div>
          ${i.length?K`<span>${this._t("settings.visible_count",{visible:a,total:i.length})}</span>`:W}
        </div>
        ${i.length?K`
          <div class="home-camera-settings-list ${this._draggedHomeCamera?"dragging":""}">
            ${X(i,e=>e.entityId,(e,t)=>{const a=!s.has(e.entityId),o=["unavailable","unknown"].includes(String(this.hass?.states[e.entityId]?.state||"").toLowerCase()),r=this._draggedHomeCamera===e.entityId,n=this._dragOverHomeCameraIndex===t&&!1===r&&Boolean(this._draggedHomeCamera);return K`
                  <div
                    class="home-section-item home-camera-settings-item ${a?"":"disabled"} ${r?"dragging":""} ${n?"drag-over":""}"
                    draggable="true"
                    @dragstart=${t=>this._handleHomeCameraDragStart(t,e.entityId)}
                    @dragend=${this._handleHomeCameraDragEnd}
                    @dragover=${e=>this._handleHomeCameraDragOver(e,t)}
                    @dragleave=${this._handleHomeCameraDragLeave}
                    @drop=${e=>this._handleHomeCameraDrop(e,t)}
                  >
                    <div class="home-section-handle"><ha-svg-icon .path=${T}></ha-svg-icon></div>
                    <div class="home-section-icon"><ha-icon icon="mdi:cctv"></ha-icon></div>
                    <div class="home-section-copy">
                      <div class="home-section-title">${e.name}</div>
                      <div class="home-section-description">
                        ${e.areaName} · ${o?this._t("common.unavailable"):e.state}
                      </div>
                    </div>
                    <div class="home-section-actions">
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
                      <ha-icon-button
                        .label=${this._t("settings.move_up")}
                        .path=${N}
                        .disabled=${0===t}
                        @click=${()=>this._moveHomeCamera(e.entityId,-1)}
                      ></ha-icon-button>
                      <ha-icon-button
                        .label=${this._t("settings.move_down")}
                        .path=${M}
                        .disabled=${t===i.length-1}
                        @click=${()=>this._moveHomeCamera(e.entityId,1)}
                      ></ha-icon-button>
                    </div>
                  </div>
                `})}
          </div>
          <button class="home-layout-reset" type="button" @click=${this._resetHomeCameraSettings}>
            ${this._t("settings.reset_camera_cards")}
          </button>
        `:K`<div class="home-camera-settings-empty">${this._t("settings.home_camera_cards_empty")}</div>`}
      </div>
    `}_getHomeScenes(){return je(this._config?.settings?.home_scenes)}_setHomeScenes(e){this._config&&this._fireConfigChanged({...this._config,settings:{...this._config.settings,home_scenes:e}})}_homeSceneAreaName(e){if(!this.hass||!this._config)return;const t=he(this.hass,this._config,e);return t&&((this._config.areas||[]).find(e=>e.area_id===t)?.name||this.hass.areas?.[t]?.name)||void 0}_homeSceneName(e){return this.hass?.states[e]?.attributes?.friendly_name||Ze(this.hass)[e]?.name||e}_homeSceneIcon(e){const t=Ne(e)||"scene";return Ze(this.hass)[e]?.icon||this.hass?.states[e]?.attributes?.icon||ne(t)}_homeSceneTypeLabel(e){return this._t("script"===Ne(e)?"scenes.type_script":"scenes.type_scene")}_addHomeScene(e){this._setHomeScenes(Me(this._getHomeScenes(),e)),this._showHomeScenePicker=!1}_removeHomeScene(e){this._setHomeScenes(Ve(this._getHomeScenes(),e))}_moveHomeScene(e,t){this._setHomeScenes(Be(this._getHomeScenes(),e,t))}_renderHomeScenesSettings(){const e=this._previewOrder("home-scenes",this._getHomeScenes());return K`
      <div class="home-info-card-section home-scene-settings-section">
        <div class="home-info-card-header">
          <div>
            <h4>${this._t("scenes.settings_title")}</h4>
            ${e.length?K`<p>${this._t("scenes.settings_help")}</p>`:W}
          </div>
          <button class="home-custom-card-add" type="button" @click=${this._openHomeScenePicker}>
            <ha-icon icon="mdi:plus"></ha-icon>
            ${this._t("scenes.add")}
          </button>
        </div>
        ${e.length?K`
          <div class="home-camera-settings-list ${this._draggedHomeScene?"dragging":""}">
            ${X(e,e=>e,(t,i)=>{const s=this.hass?.states[t],a=this._homeSceneName(t),o=this._homeSceneAreaName(t),r=Boolean(s&&Q(s)),n=s?[this._homeSceneTypeLabel(t),o,r?this._t("common.unavailable"):""].filter(Boolean).join(" · "):`${this._t("scenes.missing")} · ${t}`,d=this._draggedHomeScene===t,c=this._dragOverHomeSceneIndex===i&&!d&&Boolean(this._draggedHomeScene);return K`
                  <div
                    class="home-section-item home-scene-settings-item ${s&&!r?"":"disabled"} ${d?"dragging":""} ${c?"drag-over":""}"
                    draggable="true"
                    data-entity-id=${t}
                    @dragstart=${e=>this._handleHomeSceneDragStart(e,t)}
                    @dragend=${this._handleHomeSceneDragEnd}
                    @dragover=${e=>this._handleHomeSceneDragOver(e,i)}
                    @dragleave=${this._handleHomeSceneDragLeave}
                    @drop=${e=>this._handleHomeSceneDrop(e,i)}
                  >
                    <div class="home-section-handle"><ha-svg-icon .path=${T}></ha-svg-icon></div>
                    <div class="home-section-icon">
                      <ha-icon icon=${s?this._homeSceneIcon(t):"mdi:help-circle-outline"}></ha-icon>
                    </div>
                    <div class="home-section-copy">
                      <div class="home-section-title">${a}</div>
                      <div class="home-section-description">${n}</div>
                    </div>
                    <div class="home-section-actions">
                      <ha-icon-button
                        .label=${this._t("settings.move_up")}
                        .path=${N}
                        .disabled=${0===i}
                        @click=${()=>this._moveHomeScene(t,-1)}
                      ></ha-icon-button>
                      <ha-icon-button
                        .label=${this._t("settings.move_down")}
                        .path=${M}
                        .disabled=${i===e.length-1}
                        @click=${()=>this._moveHomeScene(t,1)}
                      ></ha-icon-button>
                      <ha-icon-button
                        .label=${this._t("scenes.remove_named",{name:a})}
                        .path=${z}
                        @click=${()=>this._removeHomeScene(t)}
                      ></ha-icon-button>
                    </div>
                  </div>
                `})}
          </div>
        `:K`
          <div class="home-camera-settings-empty">${this._t("scenes.settings_empty")}</div>
        `}
        ${this._showHomeScenePicker?this._renderHomeScenePicker(e):W}
      </div>
    `}_renderHomeScenePicker(e){const t=Ze(this.hass),i=Ge(this.hass?.states||{},t).map(e=>{const t={entityId:e,name:this._homeSceneName(e)},i=this._homeSceneAreaName(e);return i&&(t.areaName=i),t}),s=Re(i,e,this._homeSceneSearch,Se(this.hass));return K`
      <div class="entity-picker-modal" @click=${e=>{e.target===e.currentTarget&&(this._showHomeScenePicker=!1)}}>
        <div class="entity-picker-content" role="dialog" aria-modal="true" aria-label=${this._t("scenes.picker_title")}>
          <div class="entity-picker-header">
            <h4>${this._t("scenes.picker_title")}</h4>
            <button
              class="close-button"
              type="button"
              title=${this._t("common.close")}
              aria-label=${this._t("common.close")}
              @click=${()=>this._showHomeScenePicker=!1}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          </div>

          <div class="entity-search">
            <input
              class="entity-search-input"
              type="search"
              placeholder=${this._t("scenes.search")}
              aria-label=${this._t("scenes.search")}
              .value=${this._homeSceneSearch}
              @input=${e=>this._homeSceneSearch=e.target.value}
            />
          </div>

          <div class="entity-list">
            ${X(s,e=>e.entityId,e=>K`
                <button type="button" class="entity-option home-scene-option" @click=${()=>this._addHomeScene(e.entityId)}>
                  <ha-icon class="entity-icon" icon=${this._homeSceneIcon(e.entityId)}></ha-icon>
                  <span class="entity-name">
                    <span class="home-scene-option-name">${e.name}</span>
                    <span class="home-scene-option-meta">
                      ${[this._homeSceneTypeLabel(e.entityId),e.areaName].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span class="entity-id">${e.entityId}</span>
                </button>
              `)}
            ${0===s.length?K`
              <div class="entity-picker-hint empty">${this._t("scenes.no_results")}</div>
            `:W}
          </div>
        </div>
      </div>
    `}_handleHomeSceneDragStart(e,t){this._draggedHomeScene=t,this._startDragPreview("home-scenes",this._getHomeScenes()),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleHomeSceneDragOver(e,t){this._draggedHomeScene&&(e.preventDefault(),this._dragOverHomeSceneIndex=t,this._moveDragPreview("home-scenes",this._draggedHomeScene,t),e.dataTransfer&&(e.dataTransfer.dropEffect="move"))}_handleHomeSceneDrop(e,t){e.preventDefault();const i=this._draggedHomeScene;if(!i)return;this._moveDragPreview("home-scenes",i,t);const s=this._finishDragPreview("home-scenes",this._getHomeScenes());this._handleHomeSceneDragEnd(),s&&this._setHomeScenes(s)}_renderDeviceVisibilityTree(){const e=this._getDeviceVisibilityTree();if(!e.length)return K`
        <div class="device-visibility-section">
          <div class="device-types-header">
            <div>
              <h4>${this._t("settings.devices_page_types")}</h4>
              <p>${this._t("settings.no_hidden_devices")}</p>
            </div>
          </div>
        </div>
      `;const t=this._getHiddenDeviceTypes(),i=e.filter(e=>!t.has(e.key)).length;return K`
      <div class="device-visibility-section">
        <div class="device-types-header">
          <div>
            <h4>${this._t("settings.devices_page_types")}</h4>
            <p>${this._t("settings.devices_visibility_description")}</p>
          </div>
          <span>${this._t("settings.visible_count",{visible:i,total:e.length})}</span>
        </div>
        <div class="device-visibility-tree">
          ${X(e,e=>e.key,e=>this._renderDeviceVisibilityType(e))}
        </div>
        <div class="settings-reset-row">
          <button
            class="home-layout-reset"
            type="button"
            ?disabled=${nt(this._config?.settings,this._config?.device_admission)}
            @click=${this._resetDeviceVisibility}
          >
            ${this._t("settings.reset_devices_visibility")}
          </button>
        </div>
      </div>
    `}_renderDeviceVisibilityType(e){const t=this._getHiddenDeviceTypes().has(e.key),i=lt(e.entityIds,this._getDevicesPageHiddenEntityIds()),s=t?"hidden":i,a=t?0:e.entityIds.length-dt(e.entityIds,this._getDeviceVisibilityHiddenEntities()),o=e.areas.length>0,r=o&&this._expandedDeviceTypes.has(e.key);return K`
      <section
        class="device-visibility-type is-${s} ${r?"open":""}"
        style=${`--device-type-color: ${e.color};`}
      >
        <div class="device-visibility-type-row">
          <button
            class="device-visibility-type-toggle"
            type="button"
            aria-expanded=${o?r?"true":"false":W}
            ?disabled=${!o}
            @click=${()=>this._toggleExpandedDeviceType(e.key)}
          >
            <span class="device-type-icon small"><ha-icon icon=${e.icon}></ha-icon></span>
            <span class="device-visibility-copy">
              <strong>${e.label}</strong>
              <small>${this._t("settings.visible_count",{visible:a,total:e.entityIds.length})}</small>
            </span>
            ${o?K`
              <ha-icon class="device-visibility-chevron" icon="mdi:chevron-down" aria-hidden="true"></ha-icon>
            `:W}
          </button>
          ${this._renderVisibilityButton(s,ht(s)?this._t("settings.hide_type"):this._t("settings.show_type"),()=>this._toggleDeviceTypeVisibility(e,i))}
        </div>
        ${r?K`
          <div class="device-visibility-areas">
            ${X(e.areas,e=>e.areaId,i=>this._renderDeviceVisibilityArea(e,i,t))}
          </div>
        `:W}
      </section>
    `}_renderDeviceVisibilityArea(e,t,i){const s=dt(t.entityIds,this._getDeviceVisibilityHiddenEntities()),a=lt(t.entityIds,this._getDevicesPageHiddenEntityIds()),o=ht(a);return K`
      <section class="device-visibility-area ${i?"type-hidden":""}">
        <div class="device-visibility-area-header">
          <span class="device-visibility-copy">
            <strong>${t.areaName}</strong>
            <small>${this._t("settings.visible_count",{visible:t.entityIds.length-s,total:t.entityIds.length})}</small>
          </span>
          ${this._renderVisibilityButton(a,o?this._t("settings.hide_area"):this._t("settings.show_area"),()=>this._setDevicesPageEntitiesHidden(t.entityIds,o))}
        </div>
        ${X(t.devices,i=>`${e.key}-${t.areaId}-${i.deviceId||""}`,i=>this._renderDeviceVisibilityDevice(e,t,i))}
      </section>
    `}_renderDeviceVisibilityDevice(e,t,i){const s=i.deviceId;return K`
      <div class="device-visibility-device ${i.hidden?"device-hidden":""}">
        ${s?K`
          <div class="device-visibility-device-row">
            <ha-icon class="device-visibility-device-icon" icon="mdi:devices" aria-hidden="true"></ha-icon>
            <span class="device-visibility-copy">
              <strong>${i.name}</strong>
              <small>${this._t(i.hidden?"settings.device_hidden_everywhere":"settings.device_visible_everywhere")}</small>
            </span>
            <ha-switch
              .checked=${!i.hidden}
              aria-label=${i.name}
              @change=${e=>this._setDeviceHidden(s,!e.target.checked)}
            ></ha-switch>
          </div>
        `:W}
        <div class="device-visibility-entities">
          ${X(i.entityIds,e=>e,s=>this._renderDeviceVisibilityEntity(e,t,s,i.hidden))}
        </div>
      </div>
    `}_renderDeviceVisibilityEntity(e,t,i,s){const a=this._getDevicesPageHiddenEntityIds().has(i),o=a||s?"hidden":"visible",r=this.hass?.states?.[i],n=String(r?.attributes?.friendly_name||i);return K`
      <div class="device-visibility-entity is-${o}">
        ${r?K`<ha-state-icon class="device-visibility-entity-icon" .hass=${this.hass} .stateObj=${r}></ha-state-icon>`:K`<ha-icon class="device-visibility-entity-icon" icon=${e.icon}></ha-icon>`}
        <span class="device-visibility-entity-name" title=${n}>
          ${le(n,t.areaName,this._config?.settings)}
        </span>
        ${s?K`<span class="device-visibility-entity-note">${this._t("settings.hidden_with_device")}</span>`:this._renderVisibilityButton(o,a?this._t("common.show"):this._t("common.hide"),()=>this._setDevicesPageEntitiesHidden([i],!a))}
      </div>
    `}_toggleExpandedDeviceType(e){const t=new Set(this._expandedDeviceTypes);t.has(e)?t.delete(e):t.add(e),this._expandedDeviceTypes=t}_toggleDeviceTypeVisibility(e,t){this._getHiddenDeviceTypes().has(e.key)?this._setDeviceTypeVisible(e.key,!0):"hidden"===t?this._setDevicesPageEntitiesHidden(e.entityIds,!1):this._setDeviceTypeVisible(e.key,!1)}_getDevicesPageHiddenEntityIds(){return pe(this._config)}_getDeviceVisibilityHiddenEntities(){return this._deviceVisibilityHiddenEntities(this._getDeviceVisibilityEntries(),this._config?.device_admission)}_setDevicesPageEntitiesHidden(e,t){this._config&&this._fireConfigChanged({...this._config,device_admission:{...this._config.device_admission,hidden_entities:pt(this._config.device_admission?.hidden_entities,e,t).sort()}})}_getDeviceVisibilityEntries(){return this.hass&&this._config?this._deviceVisibilityEntries(this.hass.states,this._config,Ze(this.hass)):[]}_getDeviceVisibilityTree(){return this.hass&&this._config?this._deviceVisibilityTree(this._getDeviceVisibilityEntries(),this._config,Se(this.hass)):[]}_getAllDevicesById(){const e=new Map;return(this._config?.devices||[]).forEach(t=>{e.set(t.device_id,t)}),Object.values(this.hass?.devices||{}).forEach(t=>{t?.id&&!e.has(t.id)&&e.set(t.id,{device_id:t.id,name:t.name_by_user||t.name||t.id,area_id:t.area_id,created_at:t.created_at})}),e}_getHiddenDeviceIds(){return new Set((this._config?.device_admission?.hidden_devices||[]).filter(e=>"string"==typeof e&&e.length>0))}_setDeviceHidden(e,t){if(!this._config)return;const i=this._getHiddenDeviceIds();t?i.add(e):i.delete(e),this._fireConfigChanged({...this._config,device_admission:{...this._config.device_admission,hidden_devices:[...i].sort()}})}_getDeviceTypeOptions(){return this._getDeviceVisibilityTree().map(e=>({key:e.key,label:e.label,icon:e.icon,color:e.color,count:e.entityIds.length}))}_deviceTypeKeyForEntityId(e){const t=e.split(".")[0];if(t){if("binary_sensor"===t){const t=this.hass?.states?.[e]?.attributes?.device_class;return t?`binary_sensor.${t}`:"binary_sensor"}return t}}_deviceTypeName(e){return e.startsWith("binary_sensor.")?ge(this.hass,e.slice(14)):Z(this.hass,e)}_deviceTypeIcon(e){return"person"===e?"mdi:account-group":e.startsWith("binary_sensor.")?_e("binary_sensor",e.slice(14)):ne(e)}_deviceTypeColor(e){return e.startsWith("binary_sensor.")?re("binary_sensor",e.slice(14)):re(e)}_getHiddenDeviceTypes(){return new Set((this._config?.settings?.hidden_device_types||[]).filter(e=>"string"==typeof e&&e.length>0))}_setDeviceTypeVisible(e,t){if(!this._config)return;const i=this._getHiddenDeviceTypes();t?i.delete(e):i.add(e);const s={...this._config,settings:{...this._config.settings,hidden_device_types:[...i].sort()}};this._fireConfigChanged(s)}_getGroupTitle(e){return{lights:"Lighting",climate:"Climate",media_players:"Media Players",covers:"Covers",security:"Security",motion:"Motion",actions:"Actions",others:"Sensors"}[e]||e}_sortEntityIds(e,t){const i=new Map(t.map((e,t)=>[e,t]));return[...e].sort((e,t)=>{const s=i.get(e),a=i.get(t);if(void 0!==s&&void 0!==a)return s-a;if(void 0!==s)return-1;if(void 0!==a)return 1;const o=this.hass?.states[e]?.attributes?.friendly_name||e,r=this.hass?.states[t]?.attributes?.friendly_name||t;return o.localeCompare(r,Se(this.hass))})}_setAreaEntityLayout(e,t=[],i=new Map){if(!this._config||!this._area)return;const s=this._config.areas_options?.[this._area],a=(s?.custom_cards||[]).map(s=>{if("grouped"!==e||!s.placement.startsWith("ungrouped:"))return s;const a=Math.min(t.length,Math.max(0,Number(s.placement.slice(10))||0));if(a>=t.length)return{...s,placement:"bottom"};const o=t[a],r=o?i.get(o):void 0;if(!r)return{...s,placement:"bottom"};const n=t.slice(0,a).filter(e=>i.get(e)===r).length;return{...s,placement:`domain:${r}:${n}`}});this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...s,entity_layout:e,custom_cards:a}}})}_saveUngroupedEntityOrder(e){this._config&&this._area&&this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],entity_order:e}}})}_moveUngroupedEntity(e,t,i){const s=t+i;if(s<0||s>=e.length)return;const a=[...e],[o]=a.splice(t,1);o&&(a.splice(s,0,o),this._saveUngroupedEntityOrder(a))}_configAreaEntities(e){const t=this._config;return(t?.entities||[]).filter(i=>me(t,i,e)).map(e=>({entity_id:e.entity_id}))}_getAreaGroupedEntitiesWithoutFiltering(e,t){const i={lights:[],climate:[],covers:[],media_players:[],security:[],motion:[],actions:[],others:[]};return e.forEach(e=>{const s=e.entity_id,a=s.split(".")[0],o=t.states[s];if(!o)return;const r=Ze(t)[s];r?.hidden_by||"diagnostic"===r?.entity_category||"config"===r?.entity_category||("light"===a?i.lights.push(s):"climate"===a||"humidifier"===a||"water_heater"===a||"fan"===a?i.climate.push(s):"cover"===a||"binary_sensor"===a&&o?.attributes?.device_class&&["door","garage_door","window"].includes(o.attributes.device_class)?i.covers.push(s):"media_player"===a?i.media_players.push(s):"alarm_control_panel"===a||"lock"===a||"camera"===a?i.security.push(s):"binary_sensor"===a&&o?.attributes?.device_class&&["motion","occupancy","presence"].includes(o.attributes.device_class)?i.motion.push(s):"script"===a||"scene"===a||"automation"===a||"todo"===a?i.actions.push(s):"switch"!==a&&"button"!==a&&"input_boolean"!==a&&"vacuum"!==a&&"lawn_mower"!==a&&"valve"!==a&&"select"!==a&&"number"!==a&&"input_select"!==a&&"input_number"!==a&&"counter"!==a&&"timer"!==a&&"sensor"!==a||i.others.push(s))}),i}_previewOrder(e,t){const i=this._dragPreview;return i?.list===e&&We(i.order,t)?[...i.order]:[...t]}_startDragPreview(e,t){this._dragPreview={list:e,order:[...t]}}_moveDragPreview(e,t,i){const s=this._dragPreview;if(!t||!s||s.list!==e)return;const a=Ke(s.order,t,i);a!==s.order&&(this._dragPreview={list:e,order:a})}_finishDragPreview(e,t){const i=this._dragPreview;if(i?.list===e&&(this._dragPreview=void 0,We(i.order,t)&&!Ue(i.order,t)))return[...i.order]}_cancelDragPreview(e){this._dragPreview?.list===e&&(this._dragPreview=void 0)}_handleHomeSectionDragStart(e,t){this._draggedHomeSection=t,this._startDragPreview("home-sections",this._getHomeSectionsOrder()),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleHomeSectionDragOver(e,t){e.preventDefault(),this._dragOverHomeSectionIndex=t,this._moveDragPreview("home-sections",this._draggedHomeSection,t),e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_handleHomeSectionDrop(e,t){e.preventDefault();const i=this._draggedHomeSection;if(!i)return;this._moveDragPreview("home-sections",i,t);const s=this._finishDragPreview("home-sections",this._getHomeSectionsOrder());s&&this._setHomeSectionsOrder(s),this._handleHomeSectionDragEnd()}_handleHomeCameraDragStart(e,t){this._draggedHomeCamera=t,this._startDragPreview("home-cameras",this._getHomeCameraSettings().map(e=>e.entityId)),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleHomeCameraDragOver(e,t){e.preventDefault(),this._dragOverHomeCameraIndex=t,this._moveDragPreview("home-cameras",this._draggedHomeCamera,t),e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_handleHomeCameraDrop(e,t){e.preventDefault();const i=this._draggedHomeCamera;if(!i)return;this._moveDragPreview("home-cameras",i,t);const s=this._finishDragPreview("home-cameras",this._getHomeCameraSettings().map(e=>e.entityId));s&&this._setHomeCameraOrder(s),this._handleHomeCameraDragEnd()}_confirmReset(e,t){return xe(this,{hass:this.hass,title:e,message:t,confirmLabel:this._t("settings.reset"),destructive:!0})}_setAreaSortMode(e){if(!this._config||!this.hass)return;const t=this._config.areas_display?.order||[],i=Object.values(this.hass.areas||{}).map(e=>e.area_id),s="custom"===e&&0===t.length?i:t;this._fireConfigChanged({...this._config,areas_display:{...this._config.areas_display,sort_mode:e,order:s}})}_sortedAreaIds(){return ee(Object.values(this.hass?.areas||{}),{...this._config?.areas_display,hidden:[]},Se(this.hass)).map(e=>e.area_id)}_handleAreaDragStart(e,t){this._draggedAreaId=t,this._startDragPreview("areas",this._sortedAreaIds()),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleAreaDragEnd(){this._draggedAreaId=void 0,this._dragOverIndex=void 0,this._cancelDragPreview("areas")}_handleAreaDragOver(e,t){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOverIndex=t,this._moveDragPreview("areas",this._draggedAreaId,t)}_handleAreaDragLeave(e){e.target.classList.contains("sortable-item")&&(this._dragOverIndex=void 0)}_handleAreaDrop(e,t){if(e.preventDefault(),!this._draggedAreaId||!this._config||"custom"!==ie(this._config.areas_display))return;this._moveDragPreview("areas",this._draggedAreaId,t);const i=this._finishDragPreview("areas",this._sortedAreaIds());this._handleAreaDragEnd(),i&&this._fireConfigChanged({...this._config,areas_display:{...this._config.areas_display,order:i}})}_moveArea(e,t){if(!this._config||!this.hass||"custom"!==ie(this._config.areas_display))return;const i=ee(Object.values(this.hass.areas||{}),{...this._config.areas_display,hidden:[]},Se(this.hass)),s=i.findIndex(t=>t.area_id===e),a=s+t;if(s<0||a<0||a>=i.length)return;const o=[...i],[r]=o.splice(s,1);r&&(o.splice(a,0,r),this._fireConfigChanged({...this._config,areas_display:{...this._config.areas_display,order:o.map(e=>e.area_id)}}))}_handleAreaCustomCardDragStart(e,t){this._draggedAreaCustomCardId=t,this._dragOverAreaCustomCardTarget=void 0,this._handleEntityDragEnd(),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",`custom-card:${t}`))}_handleAreaCustomCardDragOver(e,t,i){this._draggedAreaCustomCardId&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOverAreaCustomCardTarget={placement:t,index:i})}_handleAreaCustomCardDrop(e,t,i){this._draggedAreaCustomCardId&&(e.preventDefault(),e.stopPropagation(),this._moveAreaEditorCustomCard(this._draggedAreaCustomCardId,t,i),this._handleAreaCustomCardDragEnd())}_moveAreaEditorCustomCard(e,t,i){if(!this._config||!this._area)return;const s=[...this._getAreaEditorCustomCards()],a=s.findIndex(t=>t.id===e);if(a<0)return;const o=s[a];if(!o)return;const r=s.slice(0,a).filter(e=>e.placement===o.placement).length,[n]=s.splice(a,1);if(!n)return;let d=i;n.placement===t&&r<i&&(d=Math.max(0,i-1)),n.placement=t;let c=0,l=s.length;for(let e=0;e<s.length;e+=1)if(s[e]?.placement===t){if(c>=d){l=e;break}c+=1}s.splice(l,0,n),this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],custom_cards:s}}})}_strategyGroupForOrderKey(e){return ue(e)}_sortAreaStrategyGroups(e){const t=this._config?.areas_options?.[this._area||""]?.group_order||[];if(!t.length)return[...e];const i=[];t.forEach(e=>{const t=this._strategyGroupForOrderKey(e);i.includes(t)||i.push(t)});const s=new Map(i.map((e,t)=>[e,t]));return e.map((e,t)=>({group:e,fallbackIndex:t})).sort((e,t)=>{const i=s.get(e.group),a=s.get(t.group);return void 0!==i&&void 0!==a?i-a:void 0!==i?-1:void 0!==a?1:e.fallbackIndex-t.fallbackIndex}).map(({group:e})=>e)}_saveEntitySectionOrder(e){if(!this._config||!this._area)return;const t=[...e,...te.filter(t=>!e.includes(t))],i=this._config.areas_options?.[this._area]?.group_order||[],s=new Map;i.forEach(e=>{const t=this._strategyGroupForOrderKey(e),i=s.get(t)||[];i.includes(e)||i.push(e),s.set(t,i)});const a=t.flatMap(e=>s.get(e)||[e]);this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],group_order:a}}}),this._areaGroupOrderChanged=!0}_handleEntitySectionDragStart(e,t,i){e.stopPropagation(),this._handleEntityDragEnd(),this._handleAreaCustomCardDragEnd(),this._draggedEntitySection=t,this._dragOverEntitySection=void 0,this._startDragPreview(`area-groups:${this._area}`,i),e.dataTransfer?.setData("text/plain",t),e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}_handleEntitySectionDragOver(e,t){const i=this._draggedEntitySection;if(!i)return;e.preventDefault(),e.stopPropagation(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOverEntitySection=t;const s=`area-groups:${this._area}`,a=this._dragPreview?.list===s?this._dragPreview.order.indexOf(t):-1;a>=0&&this._moveDragPreview(s,i,a)}_handleEntitySectionDrop(e,t,i){if(!this._draggedEntitySection)return;e.preventDefault(),e.stopPropagation(),this._handleEntitySectionDragOver(e,t);const s=this._finishDragPreview(`area-groups:${this._area}`,i);s&&this._saveEntitySectionOrder(s),this._handleEntitySectionDragEnd()}_moveEntitySection(e,t,i,s){e.preventDefault(),e.stopPropagation();const a=i+s;if(a<0||a>=t.length)return;const o=[...t],[r]=o.splice(i,1);r&&(o.splice(a,0,r),this._saveEntitySectionOrder(o))}_handleAreaEditorDragOver(e,t,i){if(this._draggedAreaCustomCardId){const s=t===ft?`ungrouped:${i}`:`domain:${t}:${i}`;return void this._handleAreaCustomCardDragOver(e,s,Number.POSITIVE_INFINITY)}this._handleEntityDragOver(e,t,i)}_handleAreaEditorDrop(e,t,i){if(this._draggedAreaCustomCardId){const s=t===ft?`ungrouped:${i}`:`domain:${t}:${i}`;return void this._handleAreaCustomCardDrop(e,s,Number.POSITIVE_INFINITY)}this._handleEntityDrop(e,t,i)}_entityDragList(e){return`entities:${this._area}:${e}`}_areaEditorEntities(e){const t=this._configAreaEntities(e),i=new Set(t.map(e=>e.entity_id)),s=Ze(this.hass);return Object.values(this.hass?.states||{}).forEach(a=>{i.has(a.entity_id)||s[a.entity_id]?.area_id!==e||t.push({entity_id:a.entity_id})}),t}_sortedGroupEntities(e){if(!this._area||!this.hass)return[];const t=this._getAreaGroupedEntitiesWithoutFiltering(this._areaEditorEntities(this._area),this.hass),i=this._config?.areas_options?.[this._area];return e===ft?this._sortEntityIds(te.flatMap(e=>t[e]||[]),i?.entity_order||[]):this._sortEntityIds(t[e]||[],i?.groups_options?.[e]?.order||[])}_handleEntityDragStart(e,t,i){this._handleAreaCustomCardDragEnd(),this._draggedEntityId=t,this._draggedEntityGroup=i,this._startDragPreview(this._entityDragList(i),this._sortedGroupEntities(i)),e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t))}_handleEntityDragEnd(){this._draggedEntityGroup&&this._cancelDragPreview(this._entityDragList(this._draggedEntityGroup)),this._draggedEntityId=void 0,this._draggedEntityGroup=void 0,this._dragOverEntityIndex=void 0}_handleEntityDragOver(e,t,i){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._draggedEntityGroup===t&&(this._dragOverEntityIndex=i,this._moveDragPreview(this._entityDragList(t),this._draggedEntityId,i))}_handleEntityDragLeave(e){e.target.classList.contains("sortable-item")&&(this._dragOverEntityIndex=void 0)}_handleEntityDrop(e,t,i){if(e.preventDefault(),!this._draggedEntityId||!this._config||!this._area||this._draggedEntityGroup!==t)return;const s=this._entityDragList(t);this._moveDragPreview(s,this._draggedEntityId,i);const a=this._finishDragPreview(s,this._sortedGroupEntities(t));if(this._handleEntityDragEnd(),!a)return;if(t===ft)return void this._saveUngroupedEntityOrder(a);const o=this._config.areas_options?.[this._area];this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...o,groups_options:{...o?.groups_options,[t]:{...o?.groups_options?.[t],order:a}}}}})}_toggleAreaVisibility(e){const t=[...this._config.areas_display?.hidden||[]],i=t.indexOf(e);-1===i?t.push(e):t.splice(i,1);const s={...this._config,areas_display:{...this._config.areas_display,hidden:t}};this._fireConfigChanged(s)}_toggleEntityVisibility(e,t){const i=[...this._config.areas_options?.[this._area]?.groups_options?.[t]?.hidden||[]],s=i.indexOf(e);-1===s?i.push(e):i.splice(s,1);const a={...this._config,areas_options:{...this._config.areas_options,[this._area]:{...this._config.areas_options?.[this._area],groups_options:{...this._config.areas_options?.[this._area]?.groups_options,[t]:{...this._config.areas_options?.[this._area]?.groups_options?.[t],hidden:i}}}}};this._fireConfigChanged(a)}_editArea(e){this._area=e,this._collapsedAreaGroups=new Set,this._areaGroupOrderChanged=!1}_handleAreaGroupExpandedChanged(e,t){if(e.target!==e.currentTarget)return;const i=!e.detail?.expanded;if(this._collapsedAreaGroups.has(t)===i)return;const s=new Set(this._collapsedAreaGroups);i?s.add(t):s.delete(t),this._collapsedAreaGroups=s}_setAreaEntityGroupHidden(e,t,i){if(!this._config||!this._area)return;const s=this._config.areas_options?.[this._area],a=s?.groups_options?.[e];this._fireConfigChanged({...this._config,areas_options:{...this._config.areas_options,[this._area]:{...s,groups_options:{...s?.groups_options,[e]:{...a,hidden:gt(a?.hidden,t,i)}}}}})}_visibilityIcon(e){return"hidden"===e?"mdi:eye-off-outline":"partial"===e?"mdi:eye-minus-outline":"mdi:eye-outline"}_renderVisibilityButton(e,t,i){return K`
      <button
        class="visibility-button is-${e}"
        type="button"
        title=${t}
        aria-label=${t}
        aria-pressed=${"hidden"===e?"false":"true"}
        @click=${e=>{e.stopPropagation(),i()}}
        @keydown=${e=>e.stopPropagation()}
      >
        <ha-icon icon=${this._visibilityIcon(e)}></ha-icon>
      </button>
    `}_addFavoriteEntity(){this._showEntityPicker=!0,this._entitySearchFilter=""}_addWeatherEntity(){this._showWeatherPicker=!0,this._weatherSearchFilter=""}_addAlarmEntity(){this._showAlarmPicker=!0,this._alarmSearchFilter=""}_renderSelectedWeatherEntity(){const e=this._config?.settings?.weather_entity_id;if(!e)return K`
        <div class="no-weather">
          <p>${this._t("settings.no_weather_fallback")}</p>
        </div>
      `;const t=this.hass?.states[e];return K`
      <div class="selected-weather-entity" data-entity-id="${e}">
        <ha-state-icon
          .stateObj=${t}
          class="entity-icon"
        ></ha-state-icon>
        <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
        <button
          class="remove-button"
          title=${this._t("common.remove")}
          @click=${()=>this._removeWeatherEntity()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
    `}_renderSelectedAlarmEntity(){const e=this._config?.settings?.alarm_entity_id;if(!e)return K`
        <div class="no-alarm">
          <p>${this._t("settings.no_alarm")}</p>
        </div>
      `;const t=this.hass?.states[e];return K`
      <div class="selected-alarm-entity" data-entity-id="${e}">
        <ha-state-icon
          .stateObj=${t}
          class="entity-icon"
        ></ha-state-icon>
        <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
        <button
          class="remove-button"
          title=${this._t("common.remove")}
          @click=${()=>this._removeAlarmEntity()}
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
    `}_renderSelectedEntities(){const e=this._config?.favorites||[];return 0===e.length?K`
        <div class="no-favorites">
          <p>${this._t("favorites.empty")}</p>
        </div>
      `:K`
      <div class="selected-entities">
        ${X(e,e=>e,e=>{const t=this.hass?.states[e];return K`
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
    `}_renderWeatherPicker(){const e=Object.keys(this.hass?.states||{}).filter(e=>e.startsWith("weather.")&&"unavailable"!==this.hass?.states[e]?.state).filter(e=>{if(!this._weatherSearchFilter)return!0;const t=this.hass?.states[e];return(t?.attributes?.friendly_name||e).toLowerCase().includes(this._weatherSearchFilter.toLowerCase())||e.toLowerCase().includes(this._weatherSearchFilter.toLowerCase())});return K`
      <div class="entity-picker-modal">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t("settings.select_weather_title")}</h4>
            <button
              class="close-button"
              title=${this._t("common.close")}
              @click=${()=>this._showWeatherPicker=!1}
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
              placeholder=${this._t("settings.search_weather")}
              aria-label=${this._t("settings.search_weather")}
              .value=${this._weatherSearchFilter}
              @input=${e=>this._weatherSearchFilter=e.target.value}
            />
          </div>

          <div class="entity-list">
            ${X(e.slice(0,20),e=>e,e=>{const t=this.hass?.states[e];return K`
                  <button type="button" class="entity-option" @click=${()=>this._selectWeatherEntity(e)}>
                    <ha-state-icon
                      .stateObj=${t}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
                    <span class="entity-id">${e}</span>
                  </button>
                `})}
          </div>
        </div>
      </div>
    `}_renderAlarmPicker(){const e=Object.keys(this.hass?.states||{}).filter(e=>e.startsWith("alarm_control_panel.")&&!Ze(this.hass)[e]?.hidden_by).filter(e=>{if(!this._alarmSearchFilter)return!0;const t=this.hass?.states[e];return(t?.attributes?.friendly_name||e).toLowerCase().includes(this._alarmSearchFilter.toLowerCase())||e.toLowerCase().includes(this._alarmSearchFilter.toLowerCase())});return K`
      <div class="entity-picker-modal">
        <div class="entity-picker-content">
          <div class="entity-picker-header">
            <h4>${this._t("settings.select_alarm_title")}</h4>
            <button
              class="close-button"
              title=${this._t("common.close")}
              @click=${()=>this._showAlarmPicker=!1}
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
              placeholder=${this._t("settings.search_alarm")}
              aria-label=${this._t("settings.search_alarm")}
              .value=${this._alarmSearchFilter}
              @input=${e=>this._alarmSearchFilter=e.target.value}
            />
          </div>

          <div class="entity-list">
            ${X(e.slice(0,20),e=>e,e=>{const t=this.hass?.states[e];return K`
                  <button type="button" class="entity-option" @click=${()=>this._selectAlarmEntity(e)}>
                    <ha-state-icon
                      .stateObj=${t}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
                    <span class="entity-id">${e}</span>
                  </button>
                `})}
          </div>
        </div>
      </div>
    `}_renderEntityPicker(){const e=Object.keys(this.hass?.states||{}),t=this._entitySearchFilter.trim().toLocaleLowerCase(Se(this.hass)),i=e.filter(e=>{if(!t)return!0;const i=this.hass?.states[e];return(i?.attributes?.friendly_name||e).toLocaleLowerCase(Se(this.hass)).includes(t)||e.toLocaleLowerCase(Se(this.hass)).includes(t)}).sort((e,t)=>{const i=this.hass?.states[e]?.attributes?.friendly_name||e,s=this.hass?.states[t]?.attributes?.friendly_name||t;return i.localeCompare(s,Se(this.hass))}),s=this._config?.favorites||[],a=i.filter(e=>!s.includes(e)),o=t?a:a.slice(0,50);return K`
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
            ${X(o,e=>e,e=>{const t=this.hass?.states[e];return K`
                  <button type="button" class="entity-option" @click=${()=>this._selectEntity(e)}>
                    <ha-state-icon
                      .stateObj=${t}
                      class="entity-icon"
                    ></ha-state-icon>
                    <span class="entity-name">${t?.attributes?.friendly_name||e}</span>
                    <span class="entity-id">${e}</span>
                  </button>
                `})}
            ${0===o.length?K`
              <div class="entity-picker-hint empty">${this._t("settings.no_entities_found")}</div>
            `:W}
            ${!t&&a.length>o.length?K`
              <div class="entity-picker-hint">
                ${this._t("settings.entity_picker_limited",{count:o.length,total:a.length})}
              </div>
            `:W}
          </div>
        </div>
      </div>
    `}_selectWeatherEntity(e){const t={...this._config,settings:{...this._config.settings,weather_entity_id:e}};this._fireConfigChanged(t),this._showWeatherPicker=!1}_selectAlarmEntity(e){const t=this._config.settings,i={...this._config,settings:{...t,alarm_entity_id:e,show_alarm:!t?.alarm_entity_id||t.show_alarm}};this._fireConfigChanged(i),this._showAlarmPicker=!1}_removeWeatherEntity(){const e={...this._config,settings:{...this._config.settings,weather_entity_id:void 0}};this._fireConfigChanged(e)}_removeAlarmEntity(){const e={...this._config,settings:{...this._config.settings,alarm_entity_id:void 0,show_alarm:!1}};this._fireConfigChanged(e)}_toggleTimeDisplay(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_time:t}};this._fireConfigChanged(i)}_toggleWeatherDisplay(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_weather:t}};this._fireConfigChanged(i)}_toggleNotificationsDisplay(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_notifications:t}};this._fireConfigChanged(i)}_toggleMasterActionConfirmation(e,t){const i=t.target,s={...this._config,settings:{...this._config.settings,master_action_confirmations:{...this._config.settings?.master_action_confirmations,[e]:Boolean(i.checked)}}};this._fireConfigChanged(s)}_toggleSuggestedFavorites(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_suggested_favorites:t}};this._fireConfigChanged(i)}_toggleHideUnavailableEntities(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,hide_unavailable_entities_on_devices:t}};this._fireConfigChanged(i)}_toggleHideUnavailableAreaEntities(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,hide_unavailable_entities:t}};this._fireConfigChanged(i)}_toggleAreaThermostat(e){const t=e.target,i={...this._config,settings:{...this._config.settings,show_area_thermostat:Boolean(t.checked)}};this._fireConfigChanged(i)}_toggleRecentDevicesPanel(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,show_recent_devices_panel:t}};this._fireConfigChanged(i)}_toggleRestrictNonAdminHaSidebar(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,restrict_non_admin_ha_sidebar:t}};this._fireConfigChanged(i)}_toggleRestrictNonAdminDashboardSettings(e){const t=e.target.checked,i={...this._config,settings:{...this._config.settings,restrict_non_admin_dashboard_settings:t}};this._fireConfigChanged(i)}_selectEntity(e){const t=[...this._config?.favorites||[]];if(!t.includes(e)){t.push(e);const i={...this._config,favorites:t};this._fireConfigChanged(i)}this._showEntityPicker=!1}_removeFavoriteEntity(e){const t=[...this._config?.favorites||[]],i=t.indexOf(e);if(i>-1){t.splice(i,1);const e={...this._config,favorites:t};this._fireConfigChanged(e)}}_renderPersonsConfiguration(){if(!this.hass?.states)return K`<p>${this._t("settings.no_persons")}</p>`;const e=Object.keys(this.hass.states).filter(e=>e.startsWith("person.")).map(e=>{const t=this.hass.states[e];return{entity_id:e,state:t,friendly_name:t?.attributes?.friendly_name||e}}).sort((e,t)=>e.friendly_name.localeCompare(t.friendly_name));if(0===e.length)return K`
        <div class="no-persons">
          <p>${this._t("settings.no_person_entities")}</p>
          <p style="font-size: 12px; color: var(--secondary-text-color);">
            ${this._t("settings.add_person_entities_hint")}
          </p>
        </div>
      `;const t=new Set(this._config?.settings?.hidden_persons||[]);return K`
      <div class="persons-list">
        ${X(e,e=>e.entity_id,e=>{const i=t.has(e.entity_id);return K`
              <div class="person-item ${i?"hidden":""}">
                <ha-state-icon
                  .stateObj=${e.state}
                  class="person-icon"
                ></ha-state-icon>
                <span class="person-name">${e.friendly_name}</span>
                <span class="person-state ${"home"===e.state?.state?"home":"away"}">
                  ${"home"===e.state?.state?this._t("person.home"):this._t("person.away")}
                </span>
                <ha-icon-button
                  .label=${i?"Show":"Hide"}
                  .path=${i?F:j}
                  @click=${()=>this._togglePersonVisibility(e.entity_id)}
                ></ha-icon-button>
              </div>
            `})}
      </div>
    `}_togglePersonVisibility(e){const t=[...this._config?.settings?.hidden_persons||[]],i=t.indexOf(e);-1===i?t.push(e):t.splice(i,1);const s={...this._config,settings:{...this._config.settings,hidden_persons:t}};this._fireConfigChanged(s)}_editAreaRegistry(e){e.stopPropagation(),this._showToast(this._t("strategy.edit_area_alert"))}_showToast(e){$e(this,"hass-notification",{message:e})}_openReplacementManager(e){this.hass&&this._config&&function(e,t,i,s){const a=document.querySelector("home-assistant")?.shadowRoot||document.body;let o=a.querySelector("dwains-dashboard-next-replacement-manager-dialog");o||(o=document.createElement("dwains-dashboard-next-replacement-manager-dialog"),a.appendChild(o)),o.hass=e,o.showDialog({config:t,onSave:i,initialDomain:s})}(this.hass,this._config,e=>{this._config&&(this._fireConfigChanged({...this._config,blueprint_replacements:e.blueprint_replacements||{}}),this.requestUpdate())},e)}_replacementCount(){return ve(this._config?.blueprint_replacements)}_fireConfigChanged(e){yt(this._settingsPage),this._config={...this._config,...e};const t=this._config,i={...it(t),type:"custom:dwains-dashboard-next",areas_display:t.areas_display||{},floors_display:t.floors_display||{},areas_options:t.areas_options||{},blueprint_replacements:t.blueprint_replacements||{},device_admission:t.device_admission||{},favorites:t.favorites||[],pages:t.pages||[],home_custom_cards:t.home_custom_cards||[],settings:t.settings||{}},s=new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0});this.dispatchEvent(s)}static get styles(){return G`:host{display:block}.editor-container{padding:16px}.settings-nav-section{max-width:720px;margin:0 auto 16px}.settings-nav-section h3{margin:0 0 8px;padding:0 14px;color:var(--secondary-text-color);font-size:13px;font-weight:700;letter-spacing:0}.settings-nav-list{overflow:hidden;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.settings-nav-item{width:100%;min-height:76px;display:grid;grid-template-columns:44px minmax(0,1fr) 24px;align-items:center;gap:14px;padding:12px 16px;border:0;border-bottom:1px solid var(--divider-color);color:var(--primary-text-color);background:transparent;text-align:left;cursor:pointer;font:inherit}.settings-nav-item:last-child{border-bottom:0}.settings-nav-item:hover{background:color-mix(in srgb,var(--settings-item-color) 5%,transparent)}.settings-nav-icon{width:44px;height:44px;border-radius:999px;display:flex;align-items:center;justify-content:center;color:#fff;background:var(--settings-item-color)}.settings-nav-icon ha-icon,.settings-nav-icon svg{width:24px;height:24px;fill:currentColor;--mdc-icon-size:24px}.settings-nav-copy{min-width:0}.settings-nav-title{color:var(--primary-text-color);font-size:15px;font-weight:700;line-height:1.2}.settings-nav-description{margin-top:3px;color:var(--secondary-text-color);font-size:12px;line-height:1.35}.settings-nav-summary{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.settings-nav-summary span{max-width:100%;padding:4px 9px;border-radius:999px;color:var(--settings-item-color);background:color-mix(in srgb,var(--settings-item-color) 10%,transparent);font-size:12px;font-weight:700;line-height:1.3;overflow-wrap:anywhere}.settings-version-footer{max-width:720px;margin:4px auto 0;padding:0 14px;color:var(--secondary-text-color);font-size:12px;line-height:1.4}.settings-version-footer strong{font-weight:700}.settings-nav-chevron{color:var(--secondary-text-color);width:22px;height:22px;fill:currentColor;--mdc-icon-size:22px}.settings-loading-shell{min-height:420px}.settings-nav-item-skeleton{pointer-events:none;cursor:default}.skeleton-block,.settings-skeleton-copy span,.settings-skeleton-copy small{position:relative;overflow:hidden;background:color-mix(in srgb,var(--secondary-text-color) 12%,transparent)}.skeleton-block::after,.settings-skeleton-copy span::after,.settings-skeleton-copy small::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--card-background-color) 70%,transparent),transparent);animation:settings-skeleton-shimmer 1.2s ease-in-out infinite}.settings-skeleton-copy{display:flex;flex-direction:column;gap:8px}.settings-skeleton-copy span,.settings-skeleton-copy small{display:block;border-radius:999px}.settings-skeleton-copy span{width:180px;height:14px}.settings-skeleton-copy small{width:260px;max-width:100%;height:10px}@keyframes settings-skeleton-shimmer{to{transform:translateX(100%)}}.settings-detail-toolbar{max-width:940px;margin:0 auto 14px;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:12px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--divider-color) 72%,transparent);border-radius:16px;background:color-mix(in srgb,var(--card-background-color) 96%,var(--primary-color));box-shadow:0 8px 22px rgba(15,23,42,0.05)}.settings-back-button{width:auto;min-width:0;height:36px;padding:0 12px 0 10px;border:0;border-radius:999px;display:inline-flex;align-items:center;gap:6px;justify-content:center;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 9%,transparent);box-shadow:none;cursor:pointer;font-size:13px;font-weight:800;line-height:1}.settings-back-button ha-icon{--mdc-icon-size:18px}.settings-back-button span{white-space:nowrap}.settings-detail-title{min-width:0;display:flex;flex-direction:column}.settings-detail-title span{color:var(--primary-text-color);font-size:18px;font-weight:700;line-height:1.2}.settings-detail-title small{margin-top:2px;color:var(--secondary-text-color);font-size:12px;line-height:1.35}.settings-detail-content{max-width:940px;margin:0 auto}.empty-settings-card{margin:0 16px 16px;padding:18px;border:1px dashed var(--divider-color);border-radius:10px;color:var(--secondary-text-color);background:var(--secondary-background-color);text-align:center}.dashboard-settings{display:flex;flex-direction:column;gap:16px;padding:4px 0 8px}.dashboard-settings ha-icon-picker{width:100%}@media (max-width:700px){.settings-nav-section,.settings-version-footer,.settings-detail-content,.settings-detail-toolbar{max-width:none}.settings-nav-item{grid-template-columns:40px minmax(0,1fr) 22px;gap:12px;min-height:72px;padding:12px}.settings-nav-icon{width:40px;height:40px}.settings-nav-summary{margin-top:6px}.settings-detail-toolbar{margin:0 0 12px;padding:10px 12px;border-radius:14px}.settings-detail-title span{font-size:17px}.settings-detail-title small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}.home-layout-section{display:grid;gap:18px;padding:0 16px 16px}.home-section-list,.home-info-card-list{display:grid;gap:8px}.home-section-item,.home-info-card-item{display:grid;grid-template-columns:32px 42px minmax(0,1fr) auto;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);box-shadow:0 4px 12px rgba(15,23,42,0.04);transition:border-color 0.16s ease,box-shadow 0.16s ease,opacity 0.16s ease,transform 0.16s ease}.home-info-card-item{grid-template-columns:42px minmax(0,1fr) auto}.home-section-item.has-detail,.home-info-card-item.has-detail{cursor:pointer}.home-section-item.has-detail:hover,.home-info-card-item.has-detail:hover{border-color:color-mix(in srgb,var(--primary-color) 48%,var(--divider-color));background:color-mix(in srgb,var(--primary-color) 4%,var(--card-background-color))}.home-section-detail-chevron{width:20px;height:20px;flex:0 0 auto;color:var(--secondary-text-color)}.home-section-item>.home-section-detail-chevron{margin-left:-2px}.home-info-card-actions{display:inline-flex;align-items:center;gap:4px}.home-info-card-section{display:grid;gap:10px}.home-information-card-settings,.home-climate-area-settings{padding:0 16px 16px}.home-camera-settings-section{padding:0 16px 16px}.home-custom-card-settings-section{padding:0 16px 16px}.home-custom-card-settings-list{display:grid;gap:8px}.home-custom-card-add{min-height:36px;padding:8px 12px;border:0;border-radius:999px;display:inline-flex;align-items:center;gap:6px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);font:inherit;font-weight:800;cursor:pointer}.home-custom-card-add ha-icon{--mdc-icon-size:18px}.home-custom-card-settings-item .home-section-actions{align-items:center}.home-camera-settings-list{display:grid;gap:8px}.home-scene-settings-section{padding:0 16px 16px}.home-scene-settings-section .home-custom-card-add{flex:0 0 auto;white-space:nowrap}.home-scene-option .entity-name{min-width:0;display:flex;flex-direction:column;gap:2px}.home-scene-option-meta{color:var(--secondary-text-color);font-size:12px}.home-camera-settings-empty{padding:18px;border:1px dashed var(--divider-color);border-radius:10px;color:var(--secondary-text-color);background:var(--secondary-background-color);text-align:center}.home-info-card-header{display:flex;justify-content:space-between;align-items:end;gap:16px;padding:0 2px}.home-info-card-header h4{margin:0;font-size:15px;font-weight:800;color:var(--primary-text-color)}.home-info-card-header p{margin:4px 0 0;font-size:13px;line-height:1.35;color:var(--secondary-text-color)}.home-info-card-header span{flex:0 0 auto;font-size:12px;font-weight:800;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);border-radius:999px;padding:6px 10px}.home-section-item.dragging{opacity:0.5;transform:scale(0.99)}.home-section-item.drag-over{border-color:var(--primary-color);box-shadow:inset 0 0 0 1px var(--primary-color),0 8px 18px rgba(15,23,42,0.08)}.home-section-item.disabled,.home-info-card-item.disabled{opacity:0.58;background:color-mix(in srgb,var(--card-background-color) 78%,var(--secondary-background-color))}.home-section-handle{display:flex;color:var(--secondary-text-color);cursor:grab}.home-section-handle:active{cursor:grabbing}.home-section-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,transparent)}.home-section-icon ha-icon{--mdc-icon-size:22px}.home-section-item.disabled .home-section-icon,.home-info-card-item.disabled .home-section-icon{color:var(--secondary-text-color);background:var(--secondary-background-color)}.home-section-copy{min-width:0;display:block}.home-section-copy .home-section-title,.home-section-copy .home-section-description{display:block}.home-section-title{font-weight:700;color:var(--primary-text-color)}.home-section-description{margin-top:2px;font-size:12px;line-height:1.35;color:var(--secondary-text-color)}.home-section-item.has-detail{grid-template-columns:32px 42px minmax(0,1fr) 20px auto}.home-section-actions{display:inline-flex;gap:2px}.home-section-toggle{width:40px;height:40px;border:0;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;color:var(--secondary-text-color);background:transparent;cursor:pointer}.home-section-toggle.enabled{color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent)}.home-section-toggle ha-icon{--mdc-icon-size:20px}.home-layout-reset{justify-self:start;border:0;border-radius:999px;padding:8px 12px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);font:inherit;font-weight:700;cursor:pointer}.home-layout-reset:disabled{opacity:0.42;cursor:default}.home-layout-reset:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.settings-reset-row{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 0}.area-editor-reset-row{margin:16px}@media (max-width:600px){.home-section-item{grid-template-columns:28px 36px minmax(0,1fr)}.home-section-item.has-detail{grid-template-columns:28px 36px minmax(0,1fr) 20px}.home-info-card-item{grid-template-columns:36px minmax(0,1fr) auto}.home-section-icon{width:36px;height:36px}.home-section-actions{grid-column:2 / -1;justify-self:start}.home-info-card-header{align-items:start;flex-direction:column;gap:8px}.home-camera-settings-section,.home-custom-card-settings-section,.home-scene-settings-section{padding-inline:10px}}.dd-field{display:flex;flex-direction:column;gap:6px}.dd-field label{font-size:0.8rem;color:var(--secondary-text-color)}.dd-input{width:100%;box-sizing:border-box;padding:12px 14px;font-size:1rem;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:8px;outline:none;transition:border-color .2s ease}.dd-input:focus{border-color:var(--primary-color)}.sponsoring-section{background:linear-gradient(135deg,var(--primary-color),var(--accent-color,var(--primary-color)));color:white;border-radius:12px;padding:24px;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,0.15);position:relative;overflow:hidden}.sponsoring-section::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;pointer-events:none}.sponsoring-header{display:flex;align-items:center;gap:12px;margin-bottom:16px;position:relative;z-index:1}.sponsoring-header ha-icon{--mdc-icon-size:28px;color:#ffeb3b;animation:heartbeat 2s infinite}@keyframes heartbeat{0%,50%,100%{transform:scale(1)}25%{transform:scale(1.1)}}.sponsoring-header h3{margin:0;font-size:21px;font-weight:600;text-shadow:0 1px 2px rgba(0,0,0,0.2)}.sponsoring-text{position:relative;z-index:1;margin:0 0 16px 0;line-height:1.6;font-size:13px;opacity:0.95}.sponsoring-text strong{font-weight:700}.sponsor-label{position:relative;z-index:1;font-size:13px;font-weight:600;margin-bottom:10px;opacity:0.95}.sponsor-chips{position:relative;z-index:1;display:flex;flex-wrap:wrap;gap:10px}.sponsor-chip{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;text-decoration:none;font-size:13px;font-weight:600;color:#fff;background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.35);transition:transform 0.15s ease,background-color 0.2s ease,box-shadow 0.2s ease}.sponsor-chip ha-icon{--mdc-icon-size:18px}.sponsor-chip:hover{background:rgba(255,255,255,0.28);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.18)}.sponsor-chip.primary{background:#fff;color:var(--primary-color);border-color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.18)}.sponsor-chip.primary:hover{filter:brightness(0.97)}.sponsor-divider{position:relative;z-index:1;height:1px;background:rgba(255,255,255,0.25);margin:18px 0}@media (max-width:600px){.sponsoring-section{padding:20px;margin-bottom:20px}.sponsoring-header h3{font-size:20px}.sponsor-chips{flex-direction:column}.sponsor-chip{justify-content:center}}.toolbar{display:flex;align-items:center;gap:4px;margin:-16px -16px 16px -16px;padding:8px;background:var(--primary-background-color);border-bottom:1px solid var(--divider-color)}.toolbar ha-icon-button{color:var(--primary-text-color);--mdc-icon-button-size:40px;--mdc-icon-size:24px;flex:0 0 auto}.toolbar h2{margin:0;font-size:20px;font-weight:500;flex:1;padding:0 4px}ha-expansion-panel{margin-bottom:8px;--expansion-panel-summary-padding:0 16px}ha-expansion-panel [slot="header"]{display:flex;align-items:center;gap:16px}.area-entity-section{position:relative;border-radius:8px;transition:opacity 0.16s ease,outline-color 0.16s ease,background-color 0.16s ease}.area-entity-section.dragging{opacity:0.46}.area-entity-section.drag-over{outline:2px solid var(--primary-color);outline-offset:3px;background:color-mix(in srgb,var(--primary-color) 5%,transparent)}.area-entity-section-header{width:100%;min-width:0}.area-entity-section-header>span:not(.area-entity-section-actions){min-width:0;flex:1}.area-entity-section-title small{margin-left:8px;color:var(--secondary-text-color);font-size:12px;font-weight:500}.area-entity-section.is-hidden ha-expansion-panel{opacity:0.62}.visibility-button{width:36px;height:36px;padding:0;display:inline-grid;place-items:center;flex:0 0 auto;border:0;border-radius:999px;color:var(--secondary-text-color);background:transparent;cursor:pointer}.visibility-button:hover{background:color-mix(in srgb,var(--primary-text-color) 7%,transparent);color:var(--primary-text-color)}.visibility-button:focus-visible{outline:2px solid var(--primary-color);outline-offset:1px}.visibility-button.is-partial{color:var(--primary-color)}.visibility-button.is-hidden{color:var(--disabled-text-color,var(--secondary-text-color))}.visibility-button ha-icon{--mdc-icon-size:20px}.area-entity-section-actions{margin-left:auto;display:inline-flex;align-items:center;gap:2px;flex:0 0 auto}.area-entity-section-actions ha-icon-button{width:36px;height:36px}.area-entity-section-handle{width:36px;height:36px;padding:0;display:inline-grid;place-items:center;border:0;border-radius:999px;color:var(--secondary-text-color);background:transparent;cursor:grab;touch-action:none}.area-entity-section-handle:active{cursor:grabbing}.area-entity-section-handle ha-svg-icon{width:20px;height:20px}.description{margin:16px;color:var(--secondary-text-color)}.area-help{display:flex;gap:12px;align-items:flex-start;margin:0 0px 16px 0px;padding:12px;background:var(--secondary-background-color);border:1px solid var(--divider-color);border-radius:8px}.area-help-icon{--mdc-icon-size:24px}.area-help-text p{margin:0 0 6px 0;font-size:13px;color:var(--secondary-text-color)}.area-order-settings{margin:0 16px 16px;padding:16px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.area-order-heading{display:grid;gap:4px;margin-bottom:12px}.area-order-heading strong{font-size:15px}.area-order-heading span,.area-order-mode small,.area-order-hint{color:var(--secondary-text-color);font-size:12px;line-height:1.4}.area-order-modes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.area-order-mode{min-width:0;min-height:72px;display:flex;align-items:flex-start;gap:10px;padding:12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--secondary-background-color);color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer}.area-order-mode:hover{border-color:var(--primary-color)}.area-order-mode.selected{border-color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 9%,var(--card-background-color));box-shadow:inset 3px 0 0 var(--primary-color)}.area-order-mode ha-icon{flex:0 0 auto;color:var(--primary-color)}.area-order-mode span{min-width:0;display:grid;gap:3px}.area-order-mode strong{font-size:13px}.area-order-hint{margin:12px 0 0}.area-entity-layout-settings{margin:0 16px 16px;padding:16px;display:grid;gap:12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.area-entity-layout-copy{display:grid;gap:4px}.area-entity-layout-copy strong{font-size:15px}.area-energy-sensors-settings{gap:4px}.area-entity-layout-copy span,.area-energy-sensors-description,.entity-name small{color:var(--secondary-text-color);font-size:12px;line-height:1.4}.area-entity-layout-settings .area-order-modes,.tile-tap-modes{grid-template-columns:repeat(2,minmax(0,1fr))}.tile-tap-section{padding:0 16px 16px}.entity-name small{display:block;font-weight:400}.entity-order-buttons{display:inline-flex;align-items:center;flex:0 0 auto}@media (max-width:700px){.area-order-modes{grid-template-columns:1fr}.area-entity-layout-settings .area-order-modes,.tile-tap-modes{grid-template-columns:1fr}.area-order-mode{min-height:0}.entity-order-buttons ha-icon-button{width:36px;height:36px}}.sortable-container{position:relative;display:flex;flex-direction:column;gap:4px;padding:0 16px 16px 16px}.area-custom-cards-settings{margin:0 16px 16px;padding:14px;display:grid;gap:12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.area-custom-card-placement{overflow:hidden;border:1px dashed color-mix(in srgb,var(--primary-color) 35%,var(--divider-color));border-radius:8px;background:color-mix(in srgb,var(--primary-color) 4%,var(--card-background-color))}.area-custom-card-placement.drag-over,.area-custom-card-drop-zone.drag-over{border-color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,var(--card-background-color))}.area-custom-card-placement-title{display:flex;align-items:center;gap:8px;padding:10px 12px;color:var(--primary-text-color);font-size:13px;font-weight:600}.area-custom-card-placement-title ha-icon{--mdc-icon-size:18px;color:var(--primary-color)}.area-custom-card-list{padding:0 8px 8px}.area-custom-card-empty{padding:10px 12px;color:var(--secondary-text-color);font-size:12px}.custom-card-item{border:1px solid color-mix(in srgb,var(--primary-color) 24%,var(--divider-color));background:color-mix(in srgb,var(--primary-color) 6%,var(--card-background-color));cursor:grab}.custom-card-item:active{cursor:grabbing}.custom-card-icon{width:36px;height:36px;margin-right:12px;display:grid;place-items:center;flex:0 0 36px;border-radius:6px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 12%,var(--card-background-color))}.custom-card-icon ha-icon{--mdc-icon-size:20px}.custom-card-badge{flex:0 0 auto;padding:4px 8px;border-radius:999px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);font-size:11px;font-weight:600}.area-custom-card-drop-zone{min-height:38px;margin:4px 0;display:flex;align-items:center;justify-content:center;gap:8px;border:1px dashed var(--divider-color);border-radius:6px;color:var(--secondary-text-color);font-size:12px}.area-custom-card-drop-zone ha-icon{--mdc-icon-size:18px}.sortable-item{position:relative;background:var(--card-background-color);border-radius:4px;box-shadow:var(--card-box-shadow,none);transition:all 0.2s ease;user-select:none;cursor:default}.sortable-container.is-custom-order .sortable-item{cursor:grab}.sortable-container.is-custom-order .sortable-item:active{cursor:grabbing}.handle.disabled{opacity:0.25}.sortable-item.hidden{opacity:0.5}.sortable-item:hover{background:var(--secondary-background-color)}.sortable-item.dragging{opacity:0.4;transform:scale(0.95);transition:none}.sortable-container.dragging .sortable-item{transition:transform 0.2s ease}.sortable-container.dragging .sortable-item:not(.dragging):hover{transform:translateY(2px)}.sortable-item.drag-over{position:relative}.sortable-item.drag-over::before{content:'';position:absolute;top:-2px;left:0;right:0;height:4px;background:var(--primary-color);border-radius:2px;animation:pulse 1s infinite}@keyframes pulse{0%{opacity:1}50%{opacity:0.5}100%{opacity:1}}.area-item,.entity-item{display:flex;align-items:center;width:100%;padding:12px 16px;min-height:48px}.sortable-item:hover{background:var(--secondary-background-color)}.handle{cursor:grab;margin-right:8px;display:flex;align-items:center;padding:8px 4px;color:var(--secondary-text-color);transition:all 0.2s ease}.handle:hover{background:var(--primary-background-color);border-radius:4px;color:var(--primary-color)}.handle:active{cursor:grabbing}.handle ha-svg-icon{--mdc-icon-size:20px}.area-icon,.entity-icon{margin-right:16px}.area-name,.entity-name{flex:1}.area-name.clickable{cursor:pointer;display:flex;align-items:center;align-self:stretch;gap:4px;min-width:0;min-height:40px;margin:0;padding:0;border:0;border-radius:6px;background:none;color:inherit;font:inherit;text-align:left}.area-name.clickable:hover{color:var(--primary-color)}.area-name.clickable:focus-visible,.entity-option:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}.area-name-text{min-width:0;overflow:hidden;text-overflow:ellipsis}.area-name .chevron{--mdc-icon-size:20px;opacity:0.6}.area-actions{display:flex;align-items:center;gap:4px}button.link{color:var(--primary-color);text-decoration:none;background:none;border:none;cursor:pointer;font-size:inherit;padding:0}.manage-favorites-link{display:inline;margin-left:4px;font-weight:600;line-height:inherit}.manage-favorites-link:hover,.manage-favorites-link:focus-visible{text-decoration:underline}ha-icon-button[disabled]{opacity:0.5;pointer-events:none}ha-icon-button{--mdc-icon-button-size:40px;--mdc-icon-size:20px}.favorites-section,.time-section,.weather-section,.alarm-section,.master-confirmation-section,.entity-display-section,.replacement-section{padding:0 16px 16px 16px}.master-confirmation-section{display:grid;gap:12px}.master-confirmation-note{display:flex;align-items:flex-start;gap:10px;padding:12px;border-radius:8px;color:var(--secondary-text-color);background:color-mix(in srgb,var(--primary-color) 8%,var(--secondary-background-color));font-size:13px;line-height:1.45}.master-confirmation-note ha-icon{flex:0 0 auto;color:var(--primary-color);--mdc-icon-size:20px}.master-confirmation-list{overflow:hidden;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.master-confirmation-row{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:12px;min-height:62px;padding:10px 12px;cursor:pointer}.master-confirmation-row + .master-confirmation-row{border-top:1px solid var(--divider-color)}.master-confirmation-row:hover{background:color-mix(in srgb,var(--primary-color) 4%,transparent)}.master-confirmation-icon{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:8px;color:var(--master-confirmation-color);background:color-mix(in srgb,var(--master-confirmation-color) 12%,transparent)}.master-confirmation-icon ha-icon{--mdc-icon-size:22px}.master-confirmation-copy{min-width:0;display:grid;gap:3px}.master-confirmation-copy strong{color:var(--primary-text-color);font-size:14px;line-height:1.3}.master-confirmation-copy small{color:var(--secondary-text-color);font-size:12px;line-height:1.4}.master-confirmation-control{display:flex;align-items:center;gap:12px}.master-confirmation-control>span{max-width:130px;color:var(--secondary-text-color);font-size:12px;font-weight:600;text-align:right}@media (max-width:600px){.master-confirmation-section{padding-inline:10px}.master-confirmation-row{grid-template-columns:38px minmax(0,1fr) auto;gap:10px;padding-inline:10px}.master-confirmation-icon{width:38px;height:38px}.master-confirmation-control>span{display:none}}.replacement-summary{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color)}.replacement-count{font-size:14px;font-weight:600;color:var(--primary-text-color)}.replacement-help{margin-top:4px;font-size:12px;color:var(--secondary-text-color);line-height:1.4}.replacement-list{margin-top:12px}.replacement-section .home-camera-settings-empty{margin-top:12px}.replacement-summary ha-button ha-icon{--mdc-icon-size:18px;margin-right:6px}@media (max-width:600px){.replacement-summary{align-items:stretch;flex-direction:column}}.time-toggle,.weather-toggle,.alarm-toggle,.favorite-suggestions-toggle,.hide-unavailable-toggle{margin-bottom:16px}.time-toggle ha-formfield,.weather-toggle ha-formfield,.alarm-toggle ha-formfield,.favorite-suggestions-toggle ha-formfield,.hide-unavailable-toggle ha-formfield{--mdc-typography-body2-font-size:14px}.toggle-description{margin:8px 0 0 0;font-size:12px;color:var(--secondary-text-color);line-height:1.4;padding-left:16px;border-left:3px solid var(--divider-color)}.device-visibility-section{margin-top:20px;display:grid;gap:12px}.device-types-header{display:flex;align-items:flex-end;justify-content:space-between;gap:16px}.device-types-header h4{margin:0;color:var(--primary-text-color);font-size:15px;font-weight:700}.device-types-header p{margin:4px 0 0;color:var(--secondary-text-color);font-size:12px;line-height:1.35}.device-types-header>span{flex:0 0 auto;padding:6px 10px;border-radius:999px;color:var(--primary-color);background:color-mix(in srgb,var(--primary-color) 10%,transparent);font-size:12px;font-weight:800}.device-type-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;color:var(--device-type-color);background:color-mix(in srgb,var(--device-type-color) 13%,transparent)}.device-type-icon ha-icon{--mdc-icon-size:22px}.device-type-icon.small{width:34px;height:34px;border-radius:9px}.device-type-icon.small ha-icon{--mdc-icon-size:19px}.device-visibility-tree{display:grid;gap:8px}.device-visibility-type{border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);content-visibility:auto;contain-intrinsic-size:auto 58px}.device-visibility-type.open{border-color:color-mix(in srgb,var(--device-type-color) 30%,var(--divider-color))}.device-visibility-type-row{display:flex;align-items:center;gap:4px;padding:6px 8px 6px 6px}.device-visibility-type-toggle{flex:1;min-width:0;min-height:44px;display:flex;align-items:center;gap:10px;padding:0 6px;border:0;border-radius:10px;color:inherit;background:transparent;font:inherit;text-align:left;cursor:pointer}.device-visibility-type-toggle:disabled{cursor:default}.device-visibility-type-toggle:focus-visible{outline:2px solid var(--primary-color);outline-offset:1px}.device-visibility-type.is-hidden .device-visibility-type-toggle{opacity:0.58}.device-visibility-copy{flex:1;min-width:0;display:grid;gap:2px}.device-visibility-copy strong{overflow:hidden;color:var(--primary-text-color);font-size:14px;font-weight:700;line-height:1.2;text-overflow:ellipsis;white-space:nowrap}.device-visibility-copy small{color:var(--secondary-text-color);font-size:12px;line-height:1.2}.device-visibility-chevron{flex:0 0 auto;color:var(--secondary-text-color);transition:transform 0.18s ease;--mdc-icon-size:20px}.device-visibility-type.open .device-visibility-chevron{transform:rotate(180deg)}.device-visibility-areas{display:grid;gap:10px;padding:0 12px 12px}.device-visibility-area{display:grid;gap:6px;padding:8px 8px 10px 12px;border-radius:10px;background:color-mix(in srgb,var(--card-background-color) 82%,var(--secondary-background-color))}.device-visibility-area.type-hidden{opacity:0.58}.device-visibility-area-header,.device-visibility-device-row,.device-visibility-entity{display:flex;align-items:center;gap:10px;min-width:0}.device-visibility-device-row{min-height:40px;padding-right:2px}.device-visibility-device-icon{flex:0 0 auto;color:var(--secondary-text-color);--mdc-icon-size:20px}.device-visibility-device.device-hidden .device-visibility-device-row .device-visibility-copy{opacity:0.62}.device-visibility-entities{display:grid;gap:2px}.device-visibility-device-row + .device-visibility-entities{margin-left:15px;padding-left:15px;border-left:2px solid var(--divider-color)}.device-visibility-entity{min-height:36px}.device-visibility-entity.is-hidden .device-visibility-entity-icon,.device-visibility-entity.is-hidden .device-visibility-entity-name{opacity:0.5}.device-visibility-entity-icon{flex:0 0 auto;color:var(--device-type-color);--mdc-icon-size:20px}.device-visibility-entity-name{flex:1;min-width:0;overflow:hidden;color:var(--primary-text-color);font-size:13px;text-overflow:ellipsis;white-space:nowrap}.device-visibility-entity-note{flex:0 0 auto;padding-right:8px;color:var(--secondary-text-color);font-size:12px}@media (max-width:600px){.device-types-header{align-items:flex-start;flex-direction:column;gap:8px}.device-visibility-areas{padding:0 8px 10px}.device-visibility-device-row + .device-visibility-entities{margin-left:8px;padding-left:10px}}@media (prefers-reduced-motion:reduce){.device-visibility-chevron{transition:none}}.entity-picker,.weather-picker,.alarm-picker{width:100%}.weather-picker-header,.alarm-picker-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.weather-picker-header h4,.alarm-picker-header h4{margin:0;font-size:16px;font-weight:500}.no-weather,.no-alarm{text-align:center;padding:24px;color:var(--secondary-text-color)}.selected-weather-entity,.selected-alarm-entity{display:flex;align-items:center;gap:12px;padding:12px;background:var(--card-background-color);border-radius:8px;border:1px solid var(--divider-color)}.selected-weather-entity .entity-icon,.selected-alarm-entity .entity-icon{--mdc-icon-size:24px}.selected-weather-entity .entity-name,.selected-alarm-entity .entity-name{flex:1;font-size:14px}.entity-picker-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.entity-picker-header h4{margin:0;font-size:16px;font-weight:500}.no-favorites{text-align:center;padding:24px;color:var(--secondary-text-color)}.selected-entities{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}.selected-entity{display:flex;align-items:center;gap:12px;padding:12px;background:var(--card-background-color);border-radius:8px;border:1px solid var(--divider-color)}.selected-entity .entity-icon{--mdc-icon-size:24px}.selected-entity .entity-name{flex:1;font-size:14px}.remove-button{background:none;border:none;cursor:pointer;padding:8px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--error-color,#f44336);transition:all 0.2s ease;width:36px;height:36px}.remove-button:hover{background:var(--error-color,#f44336);color:white;transform:scale(1.1)}.close-button{background:none;border:none;cursor:pointer;padding:8px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--secondary-text-color);transition:all 0.2s ease;width:36px;height:36px}.close-button:hover{background:var(--secondary-background-color);color:var(--primary-text-color);transform:scale(1.1)}.entity-picker-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000}.entity-picker-content{background:var(--card-background-color);border-radius:12px;padding:24px;width:90%;max-width:600px;max-height:80vh;overflow-y:auto}.entity-picker-content .entity-picker-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.entity-search{margin-bottom:16px}.entity-search-input{width:100%;min-height:44px;box-sizing:border-box;padding:0 14px;border:1px solid var(--divider-color);border-radius:8px;outline:none;background:var(--card-background-color);color:var(--primary-text-color);font:inherit}.entity-search-input:focus{border-color:var(--primary-color)}.entity-list{display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto}.entity-picker-hint{padding:10px 14px;color:var(--secondary-text-color);font-size:12px;line-height:1.4}.entity-picker-hint.empty{text-align:center}.entity-option{display:flex;align-items:center;gap:12px;width:100%;margin:0;padding:12px;border:0;background:var(--primary-background-color);color:inherit;font:inherit;text-align:left;border-radius:8px;cursor:pointer;transition:all 0.2s ease}.entity-option:hover{background:var(--secondary-background-color)}.entity-option .entity-icon{--mdc-icon-size:24px}.entity-option .entity-name{flex:1;font-size:14px}.entity-option .entity-id{font-size:12px;color:var(--secondary-text-color);font-family:var(--font-family-code)}.loading{display:flex;align-items:center;justify-content:center;height:100px}.persons-section{padding:0 16px 16px 16px}.persons-list{display:flex;flex-direction:column;gap:8px}.person-item{display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--card-background-color);border-radius:8px;border:1px solid var(--divider-color);transition:all 0.2s ease}.person-item:hover{background:var(--secondary-background-color)}.person-item.hidden{opacity:0.5;background:var(--disabled-background-color,var(--secondary-background-color))}.person-icon{--mdc-icon-size:32px;flex-shrink:0}.person-name{flex:1;font-size:14px;font-weight:500}.person-state{font-size:12px;padding:4px 8px;border-radius:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.5px}.person-state.home{background:var(--success-color,#4caf50);color:white}.person-state.away{background:var(--warning-color,#ff9800);color:white}.no-persons{text-align:center;padding:32px;color:var(--secondary-text-color)}@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;transition-delay:0s !important;scroll-behavior:auto !important}.sponsoring-header ha-icon{animation:none}}`}};e([t({attribute:!1})],xt.prototype,"hass",null),e([i()],xt.prototype,"_config",void 0),e([i()],xt.prototype,"_area",void 0),e([i()],xt.prototype,"_loading",void 0),e([i()],xt.prototype,"_draggedAreaId",void 0),e([i()],xt.prototype,"_dragOverIndex",void 0),e([i()],xt.prototype,"_draggedHomeSection",void 0),e([i()],xt.prototype,"_dragOverHomeSectionIndex",void 0),e([i()],xt.prototype,"_draggedHomeCamera",void 0),e([i()],xt.prototype,"_dragOverHomeCameraIndex",void 0),e([i()],xt.prototype,"_draggedHomeScene",void 0),e([i()],xt.prototype,"_dragOverHomeSceneIndex",void 0),e([i()],xt.prototype,"_showHomeScenePicker",void 0),e([i()],xt.prototype,"_homeSceneSearch",void 0),e([i()],xt.prototype,"_draggedEntityId",void 0),e([i()],xt.prototype,"_draggedEntityGroup",void 0),e([i()],xt.prototype,"_dragOverEntityIndex",void 0),e([i()],xt.prototype,"_draggedEntitySection",void 0),e([i()],xt.prototype,"_dragOverEntitySection",void 0),e([i()],xt.prototype,"_draggedAreaCustomCardId",void 0),e([i()],xt.prototype,"_expandedDeviceTypes",void 0),e([i()],xt.prototype,"_areaGroupOrderChanged",void 0),e([i()],xt.prototype,"_dragPreview",void 0),e([i()],xt.prototype,"_collapsedAreaGroups",void 0),e([i()],xt.prototype,"_dragOverAreaCustomCardTarget",void 0),e([i()],xt.prototype,"_showEntityPicker",void 0),e([i()],xt.prototype,"_entitySearchFilter",void 0),e([i()],xt.prototype,"_showWeatherPicker",void 0),e([i()],xt.prototype,"_weatherSearchFilter",void 0),e([i()],xt.prototype,"_showAlarmPicker",void 0),e([i()],xt.prototype,"_alarmSearchFilter",void 0),e([i()],xt.prototype,"_settingsPage",void 0),e([i()],xt.prototype,"_homeSettingsDetail",void 0),e([i()],xt.prototype,"_favoritesReturnPage",void 0),e([i()],xt.prototype,"_dashboardId",void 0),e([i()],xt.prototype,"_dashboardTitle",void 0),e([i()],xt.prototype,"_dashboardIcon",void 0),xt=e([s("dwains-dashboard-next-strategy-editor")],xt);export{xt as DwainsDashboardStrategyEditor};
