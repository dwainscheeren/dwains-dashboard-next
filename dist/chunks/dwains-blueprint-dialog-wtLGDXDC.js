import{_ as t,n as e,r as i,t as a}from"./state-DfsJqMnn.js";import{X as r,J as s}from"./wall-tablet-sVhHpZ_H.js";import{A as o,E as l,i as n,b as p,a as d}from"./lit-element-Bpv9xYb0.js";import{e as c,i as h,t as u,p as _,d as g,c as m,r as v}from"./blueprints-Dh4Un1Bn.js";import{f as b}from"./fire-event-DQiSssdY.js";import{d as y}from"./index-DVHykqNs.js";class x extends h{constructor(t){if(super(t),this.it=o,t.type!==u.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===o||null==t)return this._t=void 0,this.it=t;if(t===l)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}x.directiveName="unsafeHTML",x.resultType=1;const f=c(x);let $=class extends n{constructor(){super(...arguments),this._t=(t,e)=>y(this.hass,t,e),this._mode="paste",this._galleryLoading=!1,this._galleryError="",this._yamlText="",this._url="",this._loadingUrl=!1,this._error="",this._values={},this._pageName="",this._pageIcon="mdi:puzzle",this._source="",this._editYaml=!1,this._checking=!1,this._updateMsg="",this._showGallery=()=>{this._mode="gallery",this._loadGallery()},this._backToSource=()=>{this._parsed=void 0,this._error=""}}showDialog(t){if(this._params=t,this._error="",this._loadingUrl=!1,this._editYaml=!1,this._checking=!1,this._updateMsg="",this._update=void 0,t.page){this._source=t.page.source||"";try{const e=_(t.page.blueprint);this._parsed=e,this._values={...g(e.meta),...t.page.inputs||{}},this._pageName=t.page.name,this._pageIcon=t.page.icon||"mdi:puzzle",this._yamlText=t.page.blueprint,this._queueUpdateCheck()}catch(t){this._error=String(t?.message||t),this._parsed=void 0}}else this._mode="gallery",this._yamlText="",this._url="",this._source="",this._parsed=void 0,this._values={},this._pageName="",this._pageIcon="mdi:puzzle",this._loadGallery()}closeDialog(){this._params=void 0,this._parsed=void 0,this._yamlText="",this._url="",this._error="",this._values={},b(this,"dialog-closed",{dialog:"dwains-dashboard-next-blueprint-dialog"})}_parseFromText(){this._error="";try{const t=_(this._yamlText);this._applyParsed(t)}catch(t){this._error=String(t?.message||t)}}_applyParsed(t){this._parsed=t,this._values=g(t.meta),this._pageName=t.meta.name||this._t("blueprint.new_page"),this._pageIcon="mdi:puzzle"}_mergeValues(t){const e=g(t.meta),i=Object.keys(t.meta.input||{});for(const t of i)void 0!==this._values[t]&&""!==this._values[t]&&(e[t]=this._values[t]);return e}_toggleYamlEdit(){this._error="",this._editYaml=!this._editYaml}_applyYamlEdit(){this._error="";try{const t=_(this._yamlText);this._values=this._mergeValues(t),this._parsed=t,this._editYaml=!1,this._queueUpdateCheck()}catch(t){this._error=String(t?.message||t)}}_queueUpdateCheck(){this._parsed&&this._checkUpdate({silentIfCurrent:!0})}async _checkUpdate(t={}){this._error="",this._updateMsg="",this._update=void 0,this._checking=!0;try{const e=this._source||await this._resolveSourceFromGallery();if(!e)return void(t.silentIfCurrent||(this._updateMsg=this._t("blueprint.source_missing")));const i=this._toRawUrl(e),a=await fetch(i,{redirect:"follow"});if(!a.ok)throw new Error(this._t("blueprint.fetch_failed",{status:a.status}));const r=await a.text();if(e!==this._source)return;const s=_(r),o=s.meta.version||"",l=this._parsed?.meta.version||"";o&&(!l||this._compareVersions(o,l)>0)?(this._update=s,this._updateMsg=this._t("blueprint.update_available",{new:o,current:l||"?"})):t.silentIfCurrent||(this._updateMsg=this._t("blueprint.up_to_date",{version:l||o||"?"}))}catch(t){this._error=this._t("blueprint.load_failed",{error:String(t?.message||t)})}finally{this._checking=!1}}async _resolveSourceFromGallery(){if(!this._parsed)return"";await this._loadGallery();const t=this._matchGalleryItem();return t?(this._source=t.url,t.url):""}_matchGalleryItem(){if(!this._parsed||!this._gallery)return;const t=this._normalizeBlueprintName(this._parsed.meta.name),e=(this._parsed.meta.type||"page").toLowerCase(),i=this._gallery.filter(e=>this._normalizeBlueprintName(e.name)===t);return i.find(t=>(t.type||"page").toLowerCase()===e)||i[0]}_normalizeBlueprintName(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,"")}_compareVersions(t,e){const i=this._versionParts(t),a=this._versionParts(e),r=Math.max(i.length,a.length);for(let t=0;t<r;t++){const e=i[t]??0,r=a[t]??0;if("number"==typeof e&&"number"==typeof r){if(e!==r)return e>r?1:-1;continue}const s=String(e),o=String(r);if(s!==o)return s>o?1:-1}return 0}_versionParts(t){return t.trim().split(/[^0-9A-Za-z]+/).filter(Boolean).map(t=>/^\d+$/.test(t)?Number(t):t.toLowerCase())}_applyUpdate(){this._update&&(this._values=this._mergeValues(this._update),this._parsed=this._update,this._yamlText=this._update.raw,this._update=void 0,this._updateMsg="")}_toRawUrl(t){let e=t.trim();return e.includes("github.com")&&(e.includes("/blob/")?e=e.replace("github.com","raw.githubusercontent.com").replace("/blob/","/"):e.includes("/tree/")&&(e=e.replace("github.com","raw.githubusercontent.com").replace("/tree/","/"),/\.ya?ml$/i.test(e)||(e=e.replace(/\/$/,"")+"/page.yaml"))),e}async _loadFromUrl(){this._error="";const t=this._toRawUrl(this._url);if(t){this._loadingUrl=!0;try{const e=await fetch(t,{redirect:"follow"});if(!e.ok)throw new Error(this._t("blueprint.fetch_failed",{status:e.status}));const i=await e.text();this._yamlText=i,this._source=this._url;const a=_(i);this._applyParsed(a)}catch(t){this._error=this._t("blueprint.load_failed",{error:String(t?.message||t)})}finally{this._loadingUrl=!1}}else this._error=this._t("blueprint.invalid_url")}async _loadGallery(){if(!this._gallery&&!this._galleryLoading){this._galleryLoading=!0,this._galleryError="";try{const t=await fetch("https://raw.githubusercontent.com/dwainscheeren/dwains-dashboard-blueprints/main/blueprints.json",{redirect:"follow"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const e=await t.json(),i=Array.isArray(e)?e:e?.blueprints||[];this._gallery=i.filter(t=>t&&t.url&&t.name).map(t=>({name:String(t.name),description:t.description?String(t.description):void 0,type:t.type?String(t.type):void 0,author:t.author?String(t.author):void 0,version:null!=t.version?String(t.version):void 0,url:String(t.url),image:t.image?String(t.image):void 0,custom_cards:Array.isArray(t.custom_cards)?t.custom_cards.map(String):void 0}))}catch(t){this._galleryError=this._t("blueprint.gallery_failed",{error:String(t?.message||t)})}finally{this._galleryLoading=!1}}}_pickGalleryItem(t){this._url=t.url,this._loadFromUrl()}_renderGallery(){return p`
      <p class="hint">${this._t("blueprint.gallery_hint")}</p>
      ${this._galleryError?p`<div class="error">${this._galleryError}</div>`:o}
      ${this._galleryLoading?p`<div class="hint">${this._t("blueprint.loading")}</div>`:o}
      ${this._gallery&&0===this._gallery.length&&!this._galleryError?p`<div class="hint">${this._t("blueprint.gallery_empty")}</div>`:o}
      <div class="gallery">
        ${(this._gallery||[]).map(t=>p`
            <button class="gallery-item" @click=${()=>this._pickGalleryItem(t)}>
              ${t.image?p`<img class="gallery-img" src=${t.image} alt="" loading="lazy" />`:p`<div class="gallery-img placeholder">
                    <ha-icon icon="mdi:puzzle"></ha-icon>
                  </div>`}
              <div class="gallery-info">
                <div class="gallery-name">${t.name}</div>
                ${t.description?p`<div class="gallery-desc">${t.description}</div>`:o}
                <div class="gallery-tags">
                  ${t.version?p`<span class="chip">v${t.version}</span>`:o}
                  ${t.type?p`<span class="chip">${t.type}</span>`:o}
                  ${t.author?p`<span class="chip">${t.author}</span>`:o}
                </div>
              </div>
            </button>
          `)}
      </div>
    `}_setValue(t,e){this._values={...this._values,[t]:e}}_missingCustomCards(){if(!this._parsed)return[];const t=new Set([...this._parsed.meta.custom_cards||[],...m(this._parsed.card)]);t.delete("dwains-flexbox-card");const e=[];return t.forEach(t=>{const i=t.startsWith("custom:")?t.slice(7):t;customElements.get(i)||e.push(i)}),e}_slug(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40)||"pagina"}_save(){if(!this._parsed||!this._params)return;let t;try{t=v(this._parsed.card,this._parsed.meta,this._values)}catch(t){return void(this._error=this._t("blueprint.fill_failed",{error:String(t?.message||t)}))}const e={id:this._params.page?.id||`${this._slug(this._pageName)}-${Date.now().toString(36)}`,name:this._pageName.trim()||this._parsed.meta.name||this._t("blueprint.page_fallback"),icon:this._pageIcon||"mdi:puzzle",blueprint:this._parsed.raw,source:this._source||void 0,inputs:{...this._values},card:t};this._params.onSave(e),this.closeDialog()}render(){if(!this._params)return o;const t=!!this._params.page,e=this._parsed?t?this._t("blueprint.title_edit"):this._t("blueprint.title_setup"):this._t("blueprint.title_add"),i=!!this._parsed&&!t;return p`
      <ha-dialog open @closed=${this.closeDialog} .heading=${e} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${i?r:s}
            .label=${this._t("common.close")}
            @click=${i?this._backToSource:this.closeDialog}
          ></ha-icon-button>
          <span slot="title">${e}</span>
        </ha-dialog-header>

        <div class="content">
          ${this._error?p`<div class="error">${this._error}</div>`:o}
          ${this._parsed?this._renderForm():this._renderSource()}
        </div>
      </ha-dialog>
    `}_renderSource(){return p`
      <div class="tabs">
        <button
          class="tab ${"gallery"===this._mode?"active":""}"
          @click=${this._showGallery}
        >
          <ha-icon icon="mdi:view-grid-outline"></ha-icon> ${this._t("blueprint.tab_gallery")}
        </button>
        <button
          class="tab ${"url"===this._mode?"active":""}"
          @click=${()=>this._mode="url"}
        >
          <ha-icon icon="mdi:link-variant"></ha-icon> ${this._t("blueprint.tab_url")}
        </button>
        <button
          class="tab ${"paste"===this._mode?"active":""}"
          @click=${()=>this._mode="paste"}
        >
          <ha-icon icon="mdi:content-paste"></ha-icon> ${this._t("blueprint.tab_paste")}
        </button>
      </div>

      ${"gallery"===this._mode?this._renderGallery():"paste"===this._mode?p`
            <p class="hint">${this._t("blueprint.paste_hint")}</p>
            <textarea
              class="dd-yaml"
              spellcheck="false"
              placeholder="blueprint:&#10;  name: ...&#10;  type: page&#10;  input:&#10;    ...&#10;card:&#10;  type: ..."
              .value=${this._yamlText}
              @input=${t=>this._yamlText=t.target.value}
            ></textarea>
            <div class="actions">
              <ha-button
                appearance="accent"
                ?disabled=${!this._yamlText.trim()}
                @click=${this._parseFromText}
                >${this._t("common.next")}</ha-button
              >
            </div>
          `:p`
            <p class="hint">${f(this._t("blueprint.url_hint_html"))}</p>
            <input
              class="dd-input"
              type="url"
              placeholder="https://github.com/.../page-blueprints/Birthdays"
              .value=${this._url}
              @input=${t=>this._url=t.target.value}
            />
            <div class="actions">
              <ha-button
                appearance="accent"
                ?disabled=${!this._url.trim()||this._loadingUrl}
                @click=${this._loadFromUrl}
              >
                ${this._loadingUrl?this._t("blueprint.loading"):this._t("blueprint.fetch")}
              </ha-button>
            </div>
          `}
    `}_renderForm(){const t=this._parsed.meta,e=t.input||{},i=Object.keys(e),a=this._missingCustomCards();return p`
      <div class="meta">
        <div class="meta-title">${t.name}</div>
        ${t.description?p`<div class="meta-desc">${t.description}</div>`:o}
        <div class="meta-tags">
          ${t.version?p`<span class="chip">v${t.version}</span>`:o}
          ${t.author?p`<span class="chip">${t.author}</span>`:o}
          ${(t.custom_cards||[]).map(t=>p`<span class="chip card">${t}</span>`)}
        </div>
      </div>

      ${a.length?p`
            <div class="warn">
              <ha-icon icon="mdi:alert"></ha-icon>
              <div>
                ${this._t("blueprint.missing_cards",{cards:a.join(", ")})}
              </div>
            </div>
          `:o}

      ${this._params?.page||this._source?this._renderEditTools():o}
      ${this._renderUpdateBanner()}

      ${this._editYaml?this._renderYamlEditor():this._renderFields(i,e)}
    `}_renderEditTools(){return p`
      <div class="edit-tools">
        ${this._params?.page?p`
              <ha-button appearance="plain" size="s" @click=${this._toggleYamlEdit}>
                <ha-icon icon="mdi:code-braces"></ha-icon>
                ${this._editYaml?this._t("blueprint.settings"):this._t("blueprint.edit_yaml")}
              </ha-button>
            `:o}
        ${this._parsed?p`
              <ha-button
                appearance="plain"
                size="s"
                ?disabled=${this._checking}
                @click=${()=>this._checkUpdate()}
              >
                <ha-icon icon="mdi:cloud-download-outline"></ha-icon>
                ${this._checking?this._t("blueprint.checking"):this._t("blueprint.check_update")}
              </ha-button>
            `:o}
      </div>
    `}_renderUpdateBanner(){return p`
      ${this._updateMsg?p`
            <div class="update-banner">
              <span>${this._updateMsg}</span>
              ${this._update?p`<ha-button appearance="accent" size="s" @click=${this._applyUpdate}
                    >${this._t("blueprint.update")}</ha-button
                  >`:o}
            </div>
          `:o}
    `}_renderYamlEditor(){return p`
      <textarea
        class="dd-yaml"
        spellcheck="false"
        .value=${this._yamlText}
        @input=${t=>this._yamlText=t.target.value}
      ></textarea>
      <div class="actions">
        <ha-button appearance="plain" @click=${this._toggleYamlEdit}>${this._t("common.back")}</ha-button>
        <ha-button appearance="accent" @click=${this._applyYamlEdit}>${this._t("blueprint.apply")}</ha-button>
      </div>
    `}_renderFields(t,e){return p`
      <div class="field">
        <label>${this._t("blueprint.page_name")}</label>
        <input
          class="dd-input"
          .value=${this._pageName}
          @input=${t=>this._pageName=t.target.value}
        />
      </div>
      <div class="field">
        <label>${this._t("blueprint.sidebar_icon")}</label>
        <ha-icon-picker
          .hass=${this.hass}
          .value=${this._pageIcon}
          @value-changed=${t=>this._pageIcon=t.detail.value}
        ></ha-icon-picker>
      </div>

      ${t.length?p`<div class="section-label">${this._t("blueprint.settings")}</div>`:p`<p class="hint">${this._t("blueprint.no_fields")}</p>`}
      ${t.map(t=>this._renderField(t,e[t]))}

      <div class="actions">
        <ha-button appearance="plain" @click=${this._backToSource}>${this._t("common.back")}</ha-button>
        <ha-button appearance="accent" @click=${this._save}>
          ${this._params?.page?this._t("common.save"):this._t("common.add")}
        </ha-button>
      </div>
    `}_renderField(t,e){const i=this._values[t],a=e.name||t;let r;switch(e.type||"text-field"){case"entity-picker":r=p`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${i||""}
            allow-custom-entity
            @value-changed=${e=>this._setValue(t,e.detail.value)}
          ></ha-entity-picker>
        `;break;case"icon-picker":r=p`
          <ha-icon-picker
            .hass=${this.hass}
            .value=${i||""}
            @value-changed=${e=>this._setValue(t,e.detail.value)}
          ></ha-icon-picker>
        `;break;case"area-picker":r=p`
          <ha-area-picker
            .hass=${this.hass}
            .value=${i||""}
            @value-changed=${e=>this._setValue(t,e.detail.value)}
          ></ha-area-picker>
        `;break;case"boolean":r=p`
          <ha-switch
            .checked=${!!i}
            @change=${e=>this._setValue(t,e.target.checked)}
          ></ha-switch>
        `;break;case"number":r=p`
          <input
            class="dd-input"
            type="number"
            .value=${i??""}
            @input=${e=>this._setValue(t,e.target.value)}
          />
        `;break;default:r=p`
          <input
            class="dd-input"
            .value=${i??""}
            @input=${e=>this._setValue(t,e.target.value)}
          />
        `}return p`
      <div class="field">
        <label>${a}</label>
        ${e.description?p`<div class="field-desc">${e.description}</div>`:o}
        ${r}
      </div>
    `}static get styles(){return d`:host{--mdc-dialog-min-width:90vw;--mdc-dialog-max-width:720px}ha-dialog{--dialog-content-padding:0}.content{padding:8px 24px 20px}.error{background:rgba(var(--rgb-error-color,244,67,54),0.12);color:var(--error-color,#f44336);border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:14px;white-space:pre-wrap}.warn{display:flex;gap:8px;align-items:flex-start;background:rgba(var(--rgb-warning-color,255,152,0),0.12);color:var(--warning-color,#ff9800);border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:13px}.warn ha-icon{flex:0 0 auto}.tabs{display:flex;gap:8px;margin-bottom:12px}.tab{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;font-size:14px}.tab.active{border-color:var(--primary-color);background:rgba(var(--rgb-primary-color,3,169,244),0.1);color:var(--primary-color)}.tab ha-icon{--mdc-icon-size:18px}.hint{font-size:13px;color:var(--secondary-text-color);margin:4px 0 10px}.dd-yaml{width:100%;min-height:240px;box-sizing:border-box;resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.5;padding:12px;border-radius:10px;border:1px solid var(--divider-color);background:var(--code-editor-background-color,var(--card-background-color));color:var(--primary-text-color)}.dd-input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);font-size:14px}.dd-input:focus,.dd-yaml:focus{outline:none;border-color:var(--primary-color)}.meta{border:1px solid var(--divider-color);border-radius:12px;padding:12px 14px;margin-bottom:14px}.meta-title{font-size:17px;font-weight:600}.meta-desc{font-size:13px;color:var(--secondary-text-color);margin-top:4px}.meta-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.chip{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--secondary-background-color);color:var(--secondary-text-color)}.chip.card{background:rgba(var(--rgb-primary-color,3,169,244),0.12);color:var(--primary-color)}.section-label{font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:var(--secondary-text-color);margin:14px 0 8px}.field{margin-bottom:14px}.field label{display:block;font-size:14px;font-weight:500;margin-bottom:4px}.field-desc{font-size:12px;color:var(--secondary-text-color);margin-bottom:6px}ha-entity-picker,ha-icon-picker,ha-area-picker{display:block;width:100%}.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.edit-tools{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 12px}.edit-tools ha-icon{--mdc-icon-size:18px;margin-right:4px}.update-banner{display:flex;align-items:center;justify-content:space-between;gap:8px;background:rgba(var(--rgb-primary-color,3,169,244),0.12);color:var(--primary-text-color);border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:13px}.gallery{display:grid;grid-template-columns:1fr;gap:10px}@media (min-width:560px){.gallery{grid-template-columns:1fr 1fr}}.gallery-item{display:flex;flex-direction:column;text-align:left;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;overflow:hidden;padding:0;transition:border-color 0.15s ease,box-shadow 0.15s ease}.gallery-item:hover{border-color:var(--primary-color);box-shadow:0 4px 14px rgba(0,0,0,0.1)}.gallery-img{width:100%;height:110px;object-fit:cover;background:var(--secondary-background-color)}.gallery-img.placeholder{display:flex;align-items:center;justify-content:center}.gallery-img.placeholder ha-icon{--mdc-icon-size:40px;color:var(--secondary-text-color)}.gallery-info{padding:10px 12px}.gallery-name{font-size:15px;font-weight:600}.gallery-desc{font-size:12px;color:var(--secondary-text-color);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.gallery-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}code{background:var(--secondary-background-color);padding:1px 5px;border-radius:4px;font-size:12px}`}};t([e({attribute:!1})],$.prototype,"hass",void 0),t([i()],$.prototype,"_params",void 0),t([i()],$.prototype,"_mode",void 0),t([i()],$.prototype,"_gallery",void 0),t([i()],$.prototype,"_galleryLoading",void 0),t([i()],$.prototype,"_galleryError",void 0),t([i()],$.prototype,"_yamlText",void 0),t([i()],$.prototype,"_url",void 0),t([i()],$.prototype,"_loadingUrl",void 0),t([i()],$.prototype,"_error",void 0),t([i()],$.prototype,"_parsed",void 0),t([i()],$.prototype,"_values",void 0),t([i()],$.prototype,"_pageName",void 0),t([i()],$.prototype,"_pageIcon",void 0),t([i()],$.prototype,"_source",void 0),t([i()],$.prototype,"_editYaml",void 0),t([i()],$.prototype,"_checking",void 0),t([i()],$.prototype,"_updateMsg",void 0),t([i()],$.prototype,"_update",void 0),$=t([a("dwains-dashboard-next-blueprint-dialog")],$);export{$ as DwainsBlueprintDialog};
