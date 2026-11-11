import{_ as t,n as e,r as i,t as a}from"./state-Ch1yw9_s.js";import{a1 as r,P as s,ar as o,as as l,an as n}from"./screensaver-media-6u5xCEkn.js";import{A as d,E as c,i as p,b as h,a as u}from"./lit-element-D6iXJla1.js";import{e as _,i as g,t as m}from"./directive-BcM-F-Rh.js";import{p as y,d as b,f as v,b as x,a as $,v as f,r as w}from"./confirm-dialog-sj6nDODt.js";import{a as k,d as z}from"./localize-DC9lHZVH.js";class S extends g{constructor(t){if(super(t),this.it=d,t.type!==m.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===d||null==t)return this._t=void 0,this.it=t;if(t===c)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}S.directiveName="unsafeHTML",S.resultType=1;const E=_(S);let R=class extends p{constructor(){super(...arguments),this._t=(t,e)=>k(this.hass,t,e),this._mode="paste",this._galleryLoading=!1,this._galleryError="",this._gallerySearch="",this._yamlText="",this._url="",this._loadingUrl=!1,this._error="",this._values={},this._pageName="",this._pageIcon="mdi:puzzle",this._source="",this._editYaml=!1,this._checking=!1,this._updateMsg="",this._showGallery=()=>{this._mode="gallery",this._loadGallery()},this._backToSource=()=>{this._parsed=void 0,this._error=""}}get _lang(){return z(this.hass)}showDialog(t){if(this._params=t,this._error="",this._loadingUrl=!1,this._editYaml=!1,this._checking=!1,this._updateMsg="",this._update=void 0,t.page){this._source=t.page.source||"";try{const e=y(t.page.blueprint);this._parsed=e,this._values={...b(e.meta),...t.page.inputs||{}},this._pageName=t.page.name,this._pageIcon=t.page.icon||"mdi:puzzle",this._yamlText=t.page.blueprint,this._queueUpdateCheck()}catch(t){this._error=String(t?.message||t),this._parsed=void 0}}else this._mode="gallery",this._gallerySearch="",this._yamlText="",this._url="",this._source="",this._parsed=void 0,this._values={},this._pageName="",this._pageIcon="mdi:puzzle",this._loadGallery()}closeDialog(){this._params=void 0,this._parsed=void 0,this._yamlText="",this._url="",this._error="",this._values={},v(this,"dialog-closed",{dialog:"dwains-dashboard-next-blueprint-dialog"})}_parseFromText(){this._error="";try{const t=y(this._yamlText);this._applyParsed(t)}catch(t){this._error=String(t?.message||t)}}_applyParsed(t){this._parsed=t,this._values={...b(t.meta),...this._suggestedValues(t)},this._pageName=x(t.meta,"name",this._lang)||this._t("blueprint.new_page"),this._pageIcon=t.meta.icon||"mdi:puzzle"}_suggestedValues(t){const e={},i=this.hass?.states||{};for(const[a,r]of Object.entries(t.meta.input||{})){if("entity-picker"!==r.type||!r.suggest_entity)continue;const t=r.suggest_entity.includes(".")||!r.entity_domain?r.suggest_entity:`${r.entity_domain}.${r.suggest_entity}`;r.entity_domain&&!t.startsWith(`${r.entity_domain}.`)||i[t]&&(e[a]=t)}return e}_mergeValues(t){const e=b(t.meta),i=Object.keys(t.meta.input||{});for(const t of i)void 0!==this._values[t]&&""!==this._values[t]&&(e[t]=this._values[t]);return e}_toggleYamlEdit(){this._error="",this._editYaml=!this._editYaml}_applyYamlEdit(){this._error="";try{const t=y(this._yamlText);this._values=this._mergeValues(t),this._parsed=t,this._editYaml=!1,this._queueUpdateCheck()}catch(t){this._error=String(t?.message||t)}}_queueUpdateCheck(){this._parsed&&this._checkUpdate({silentIfCurrent:!0})}async _checkUpdate(t={}){this._error="",this._updateMsg="",this._update=void 0,this._checking=!0;try{const e=this._source||await this._resolveSourceFromGallery();if(!e)return void(t.silentIfCurrent||(this._updateMsg=this._t("blueprint.source_missing")));const i=this._toRawUrl(e),a=await fetch(i,{redirect:"follow"});if(!a.ok)throw new Error(this._t("blueprint.fetch_failed",{status:a.status}));const r=await a.text();if(e!==this._source)return;const s=y(r),o=s.meta.version||"",l=this._parsed?.meta.version||"";o&&(!l||this._compareVersions(o,l)>0)?(this._update=s,this._updateMsg=this._t("blueprint.update_available",{new:o,current:l||"?"})):t.silentIfCurrent||(this._updateMsg=this._t("blueprint.up_to_date",{version:l||o||"?"}))}catch(t){this._error=this._t("blueprint.load_failed",{error:String(t?.message||t)})}finally{this._checking=!1}}async _resolveSourceFromGallery(){if(!this._parsed)return"";await this._loadGallery();const t=this._matchGalleryItem();return t?(this._source=t.url,t.url):""}_matchGalleryItem(){if(!this._parsed||!this._gallery)return;const t=this._normalizeBlueprintName(this._parsed.meta.name),e=(this._parsed.meta.type||"page").toLowerCase(),i=this._gallery.filter(e=>this._normalizeBlueprintName(e.name)===t);return i.find(t=>(t.type||"page").toLowerCase()===e)||i[0]}_normalizeBlueprintName(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,"")}_compareVersions(t,e){const i=this._versionParts(t),a=this._versionParts(e),r=Math.max(i.length,a.length);for(let t=0;t<r;t++){const e=i[t]??0,r=a[t]??0;if("number"==typeof e&&"number"==typeof r){if(e!==r)return e>r?1:-1;continue}const s=String(e),o=String(r);if(s!==o)return s>o?1:-1}return 0}_versionParts(t){return t.trim().split(/[^0-9A-Za-z]+/).filter(Boolean).map(t=>/^\d+$/.test(t)?Number(t):t.toLowerCase())}_applyUpdate(){this._update&&(this._values=this._mergeValues(this._update),this._parsed=this._update,this._yamlText=this._update.raw,this._update=void 0,this._updateMsg="")}_toRawUrl(t){let e=t.trim();return e.includes("github.com")&&(e.includes("/blob/")?e=e.replace("github.com","raw.githubusercontent.com").replace("/blob/","/"):e.includes("/tree/")&&(e=e.replace("github.com","raw.githubusercontent.com").replace("/tree/","/"),/\.ya?ml$/i.test(e)||(e=e.replace(/\/$/,"")+"/page.yaml"))),e}async _loadFromUrl(){this._error="";const t=this._toRawUrl(this._url);if(t){this._loadingUrl=!0;try{const e=await fetch(t,{redirect:"follow"});if(!e.ok)throw new Error(this._t("blueprint.fetch_failed",{status:e.status}));const i=await e.text();this._yamlText=i,this._source=this._url;const a=y(i);this._applyParsed(a)}catch(t){this._error=this._t("blueprint.load_failed",{error:String(t?.message||t)})}finally{this._loadingUrl=!1}}else this._error=this._t("blueprint.invalid_url")}async _loadGallery(){if(!this._gallery&&!this._galleryLoading){this._galleryLoading=!0,this._galleryError="";try{const t=await fetch("https://raw.githubusercontent.com/dwainscheeren/dwains-dashboard-blueprints/main/blueprints.json",{redirect:"follow"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const e=await t.json(),i=Array.isArray(e)?e:e?.blueprints||[];this._gallery=i.filter(t=>t&&t.url&&t.name&&"page"===String(t.type||"page").toLowerCase()).map(t=>({name:String(t.name),description:t.description?String(t.description):void 0,type:t.type?String(t.type):void 0,author:t.author?String(t.author):void 0,version:null!=t.version?String(t.version):void 0,url:String(t.url),image:t.image?String(t.image):void 0,custom_cards:Array.isArray(t.custom_cards)?t.custom_cards.map(String):void 0}))}catch(t){this._galleryError=this._t("blueprint.gallery_failed",{error:String(t?.message||t)})}finally{this._galleryLoading=!1}}}_filteredGallery(){const t=this._gallerySearch.trim().toLowerCase(),e=this._gallery||[];return t?e.filter(e=>[e.name,e.description,e.author,...e.custom_cards||[]].filter(Boolean).join(" ").toLowerCase().includes(t)):e}_pickGalleryItem(t){this._url=t.url,this._loadFromUrl()}_renderGallery(){const t=this._filteredGallery(),e=this._t("blueprint.gallery_search");return h`
      <p class="hint">${this._t("blueprint.gallery_hint")}</p>
      <label class="gallery-search">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input
          type="search"
          aria-label=${e}
          placeholder=${e}
          .value=${this._gallerySearch}
          @input=${t=>this._gallerySearch=t.target.value}
        />
      </label>
      ${this._galleryError?h`<div class="error">${this._galleryError}</div>`:d}
      ${this._galleryLoading?h`<div class="hint">${this._t("blueprint.loading")}</div>`:d}
      ${this._gallery&&0===t.length&&!this._galleryError?h`<div class="hint">${this._t("blueprint.gallery_empty")}</div>`:d}
      <div class="gallery">
        ${t.map(t=>h`
            <button class="gallery-item" @click=${()=>this._pickGalleryItem(t)}>
              ${t.image?h`<img class="gallery-img" src=${t.image} alt="" loading="lazy" />`:h`<div class="gallery-img placeholder">
                    <ha-icon icon="mdi:puzzle"></ha-icon>
                  </div>`}
              <div class="gallery-info">
                <div class="gallery-name">${t.name}</div>
                ${t.description?h`<div class="gallery-desc">${t.description}</div>`:d}
                <div class="gallery-tags">
                  ${t.version?h`<span class="chip">v${t.version}</span>`:d}
                  ${t.type?h`<span class="chip">${t.type}</span>`:d}
                  ${t.author?h`<span class="chip">${t.author}</span>`:d}
                </div>
              </div>
            </button>
          `)}
      </div>
    `}_setValue(t,e){this._values={...this._values,[t]:e}}_missingCustomCards(){if(!this._parsed)return[];const t=new Set([...this._parsed.meta.custom_cards||[],...$(this._parsed.card)]);t.delete("dwains-flexbox-card");const e=[];return t.forEach(t=>{const i=t.startsWith("custom:")?t.slice(7):t;customElements.get(i)||e.push(i)}),e}_slug(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40)||"pagina"}_inputLabel(t,e){return e&&x(e,"name",this._lang)||t}_showError(t){this._error=t,this.updateComplete.then(()=>this.renderRoot.querySelector(".content > .error")?.scrollIntoView({block:"nearest"}))}_save(){if(!this._parsed||!this._params)return;const t=f(this._parsed.meta,this._values);if(t){const e=this._inputLabel(t.key,this._parsed.meta.input?.[t.key]);return void this._showError("select_entity_first"===t.code?this._t("blueprint.select_entity_first",{name:e}):this._t("blueprint.complete_entry_required",{name:e}))}let e;try{e=w(this._parsed.card,this._parsed.meta,this._values)}catch(t){return void(this._error=this._t("blueprint.fill_failed",{error:String(t?.message||t)}))}const i={id:this._params.page?.id||`${this._slug(this._pageName)}-${Date.now().toString(36)}`,name:this._pageName.trim()||this._parsed.meta.name||this._t("blueprint.page_fallback"),icon:this._pageIcon||"mdi:puzzle",blueprint:this._parsed.raw,source:this._source||void 0,inputs:{...this._values},card:e};this._params.onSave(i),this.closeDialog()}render(){if(!this._params)return d;const t=!!this._params.page,e=this._parsed?t?this._t("blueprint.title_edit"):this._t("blueprint.title_setup"):this._t("blueprint.title_add"),i=!!this._parsed&&!t;return h`
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
          ${this._error?h`<div class="error" role="alert">${this._error}</div>`:d}
          ${this._parsed?this._renderForm():this._renderSource()}
        </div>
      </ha-dialog>
    `}_renderSource(){return h`
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

      ${"gallery"===this._mode?this._renderGallery():"paste"===this._mode?h`
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
          `:h`
            <p class="hint">${E(this._t("blueprint.url_hint_html"))}</p>
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
    `}_renderForm(){const t=this._parsed.meta,e=t.input||{},i=Object.keys(e),a=this._missingCustomCards(),r=x(t,"description",this._lang);return h`
      <div class="meta">
        <div class="meta-title">${x(t,"name",this._lang)}</div>
        ${r?h`<div class="meta-desc">${r}</div>`:d}
        <div class="meta-tags">
          ${t.version?h`<span class="chip">v${t.version}</span>`:d}
          ${t.author?h`<span class="chip">${t.author}</span>`:d}
          ${(t.custom_cards||[]).map(t=>h`<span class="chip card">${t}</span>`)}
        </div>
      </div>

      ${a.length?h`
            <div class="warn">
              <ha-icon icon="mdi:alert"></ha-icon>
              <div>
                ${this._t("blueprint.missing_cards",{cards:a.join(", ")})}
              </div>
            </div>
          `:d}

      ${this._params?.page||this._source?this._renderEditTools():d}
      ${this._renderUpdateBanner()}

      ${this._editYaml?this._renderYamlEditor():this._renderFields(i,e)}
    `}_renderEditTools(){return h`
      <div class="edit-tools">
        ${this._params?.page?h`
              <ha-button appearance="plain" size="s" @click=${this._toggleYamlEdit}>
                <ha-icon icon="mdi:code-braces"></ha-icon>
                ${this._editYaml?this._t("blueprint.settings"):this._t("blueprint.edit_yaml")}
              </ha-button>
            `:d}
        ${this._parsed?h`
              <ha-button
                appearance="plain"
                size="s"
                ?disabled=${this._checking}
                @click=${()=>this._checkUpdate()}
              >
                <ha-icon icon="mdi:cloud-download-outline"></ha-icon>
                ${this._checking?this._t("blueprint.checking"):this._t("blueprint.check_update")}
              </ha-button>
            `:d}
      </div>
    `}_renderUpdateBanner(){return h`
      ${this._updateMsg?h`
            <div class="update-banner">
              <span>${this._updateMsg}</span>
              ${this._update?h`<ha-button appearance="accent" size="s" @click=${this._applyUpdate}
                    >${this._t("blueprint.update")}</ha-button
                  >`:d}
            </div>
          `:d}
    `}_renderYamlEditor(){return h`
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
    `}_renderFields(t,e){return h`
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

      ${t.length?h`<div class="section-label">${this._t("blueprint.settings")}</div>`:h`<p class="hint">${this._t("blueprint.no_fields")}</p>`}
      ${t.map(t=>this._renderField(t,e[t]))}

      <div class="actions">
        <ha-button appearance="plain" @click=${this._backToSource}>${this._t("common.back")}</ha-button>
        <ha-button appearance="accent" @click=${this._save}>
          ${this._params?.page?this._t("common.save"):this._t("common.add")}
        </ha-button>
      </div>
    `}_renderField(t,e){const i=this._values[t],a=this._inputLabel(t,e),r=x(e,"description",this._lang);let s;switch(e.type||"text-field"){case"entity-list":s=this._renderEntityList(t,e,a);break;case"entity-picker":s=h`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${i||""}
            .includeDomains=${e.entity_domain?[e.entity_domain]:void 0}
            allow-custom-entity
            @value-changed=${e=>this._setValue(t,e.detail.value)}
          ></ha-entity-picker>
        `;break;case"icon-picker":s=h`
          <ha-icon-picker
            .hass=${this.hass}
            .value=${i||""}
            @value-changed=${e=>this._setValue(t,e.detail.value)}
          ></ha-icon-picker>
        `;break;case"area-picker":s=h`
          <ha-area-picker
            .hass=${this.hass}
            .value=${i||""}
            @value-changed=${e=>this._setValue(t,e.detail.value)}
          ></ha-area-picker>
        `;break;case"boolean":s=h`
          <ha-switch
            .checked=${!!i}
            @change=${e=>this._setValue(t,e.target.checked)}
          ></ha-switch>
        `;break;case"number":s=h`
          <input
            class="dd-input"
            type="number"
            .value=${i??""}
            @input=${e=>this._setValue(t,e.target.value)}
          />
        `;break;default:s=h`
          <input
            class="dd-input"
            .value=${i??""}
            @input=${e=>this._setValue(t,e.target.value)}
          />
        `}return h`
      <div class="field">
        <label>${a}</label>
        ${r?h`<div class="field-desc">${r}</div>`:d}
        ${s}
      </div>
    `}_listRows(t){const e=this._values[t];return Array.isArray(e)?e:[]}_updateRow(t,e,i,a){const r=this._listRows(t).map(t=>({...t})),s=r[e];s&&(s[i]=a,"entity"===i&&a&&!String(s.name||"").trim()&&(s.name=this.hass?.states?.[a]?.attributes?.friendly_name||(a.split(".")[1]||a).replace(/_/g," ")),this._setValue(t,r))}_addRow(t){this._setValue(t,[...this._listRows(t),{name:"",entity:"",icon:""}]),this._focusAfterRender(`[data-list="${CSS.escape(t)}"] .entity-row:last-of-type .entity-row-name`)}_removeRow(t,e){this._setValue(t,this._listRows(t).filter((t,i)=>i!==e)),this._focusAfterRender(`[data-list="${CSS.escape(t)}"] .entity-list-add`)}_moveRow(t,e,i){const a=[...this._listRows(t)],r=e+i;r<0||r>=a.length||([a[e],a[r]]=[a[r],a[e]],this._setValue(t,a))}_focusAfterRender(t){this.updateComplete.then(()=>this.renderRoot.querySelector(t)?.focus())}_renderEntityList(t,e,i){const a=this._listRows(t),r=this._t("settings.optional"),s=!!this._parsed?.raw.includes("$item.image$"),c=x(e,"add_label",this._lang)||this._t("blueprint.add_entry");return h`
      <div class="entity-list" role="group" aria-label=${i} data-list=${t}>
        ${a.length?d:h`<div class="entity-list-empty">${this._t("blueprint.no_entries")}</div>`}
        ${a.map((i,c)=>h`
            <div
              class="entity-row"
              role="group"
              aria-label=${this._t("blueprint.entry_label",{number:c+1})}
            >
              <div class="entity-row-header">
                <input
                  class="dd-input entity-row-name"
                  aria-label=${this._t("blueprint.entry_name")}
                  placeholder=${this._t("blueprint.entry_name")}
                  .value=${String(i.name??"")}
                  @input=${e=>this._updateRow(t,c,"name",e.target.value)}
                />
                <ha-icon-button
                  .label=${this._t("settings.move_up")}
                  .path=${o}
                  .disabled=${0===c}
                  @click=${()=>this._moveRow(t,c,-1)}
                ></ha-icon-button>
                <ha-icon-button
                  .label=${this._t("settings.move_down")}
                  .path=${l}
                  .disabled=${c===a.length-1}
                  @click=${()=>this._moveRow(t,c,1)}
                ></ha-icon-button>
                <ha-icon-button
                  .label=${this._t("blueprint.remove_entry")}
                  .path=${n}
                  @click=${()=>this._removeRow(t,c)}
                ></ha-icon-button>
              </div>
              <ha-entity-picker
                .hass=${this.hass}
                .label=${this._t("blueprint.entry_entity")}
                .value=${String(i.entity??"")}
                .includeDomains=${e.entity_domain?[e.entity_domain]:void 0}
                allow-custom-entity
                @value-changed=${e=>this._updateRow(t,c,"entity",e.detail.value||"")}
              ></ha-entity-picker>
              <ha-icon-picker
                .hass=${this.hass}
                .label=${`${this._t("blueprint.entry_icon")} (${r})`}
                .value=${String(i.icon??"")}
                .placeholder=${e.default_icon||""}
                @value-changed=${e=>this._updateRow(t,c,"icon",e.detail.value||"")}
              ></ha-icon-picker>
              ${s?h`
                    <label class="entity-row-image">
                      <span>${this._t("blueprint.entry_image")} (${r})</span>
                      <input
                        class="dd-input"
                        type="text"
                        inputmode="url"
                        placeholder="/local/image.png"
                        .value=${String(i.image??"")}
                        @input=${e=>this._updateRow(t,c,"image",e.target.value)}
                      />
                    </label>
                  `:d}
            </div>
          `)}
        <ha-button class="entity-list-add" appearance="outlined" @click=${()=>this._addRow(t)}>
          <ha-icon icon="mdi:plus"></ha-icon>
          ${c}
        </ha-button>
      </div>
    `}static get styles(){return u`:host{--mdc-dialog-min-width:90vw;--mdc-dialog-max-width:720px}ha-dialog{--dialog-content-padding:0}.content{padding:8px 24px 20px}.error{background:rgba(var(--rgb-error-color,244,67,54),0.12);color:var(--error-color,#f44336);border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:14px;white-space:pre-wrap}.warn{display:flex;gap:8px;align-items:flex-start;background:rgba(var(--rgb-warning-color,255,152,0),0.12);color:var(--warning-color,#ff9800);border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:13px}.warn ha-icon{flex:0 0 auto}.tabs{display:flex;gap:8px;margin-bottom:12px}.tab{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;font-size:14px}.tab.active{border-color:var(--primary-color);background:rgba(var(--rgb-primary-color,3,169,244),0.1);color:var(--primary-color)}.tab ha-icon{--mdc-icon-size:18px}.hint{font-size:13px;color:var(--secondary-text-color);margin:4px 0 10px}.dd-yaml{width:100%;min-height:240px;box-sizing:border-box;resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.5;padding:12px;border-radius:10px;border:1px solid var(--divider-color);background:var(--code-editor-background-color,var(--card-background-color));color:var(--primary-text-color)}.dd-input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);font-size:14px}.dd-input:focus,.dd-yaml:focus{outline:none;border-color:var(--primary-color)}.meta{border:1px solid var(--divider-color);border-radius:12px;padding:12px 14px;margin-bottom:14px}.meta-title{font-size:17px;font-weight:600}.meta-desc{font-size:13px;color:var(--secondary-text-color);margin-top:4px}.meta-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.chip{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--secondary-background-color);color:var(--secondary-text-color)}.chip.card{background:rgba(var(--rgb-primary-color,3,169,244),0.12);color:var(--primary-color)}.section-label{font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:var(--secondary-text-color);margin:14px 0 8px}.field{margin-bottom:14px}.entity-list{display:grid;gap:10px}.entity-list-empty{padding:12px;border:1px dashed var(--divider-color);border-radius:10px;color:var(--secondary-text-color);font-size:13px}.entity-row{display:grid;gap:10px;padding:12px;border:1px solid var(--divider-color);border-radius:10px}.entity-row-header{display:flex;align-items:center;gap:4px}.entity-row-name{flex:1;min-width:0;font-weight:600;margin-right:4px}.entity-row-image{display:grid;gap:4px;font-size:13px;color:var(--secondary-text-color)}.entity-list-add{justify-self:start}.entity-list-add ha-icon{--mdc-icon-size:18px;margin-right:4px}.field label{display:block;font-size:14px;font-weight:500;margin-bottom:4px}.field-desc{font-size:12px;color:var(--secondary-text-color);margin-bottom:6px}ha-entity-picker,ha-icon-picker,ha-area-picker{display:block;width:100%}.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.edit-tools{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 12px}.edit-tools ha-icon{--mdc-icon-size:18px;margin-right:4px}.update-banner{display:flex;align-items:center;justify-content:space-between;gap:8px;background:rgba(var(--rgb-primary-color,3,169,244),0.12);color:var(--primary-text-color);border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:13px}.gallery-search{display:flex;align-items:center;gap:10px;margin:0 0 12px;padding:0 12px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color)}.gallery-search:focus-within{border-color:var(--primary-color)}.gallery-search ha-icon{--mdc-icon-size:20px;flex:0 0 auto;color:var(--secondary-text-color)}.gallery-search input{flex:1;min-width:0;height:42px;padding:0;border:0;outline:0;background:transparent;color:var(--primary-text-color);font:inherit;font-size:14px}.gallery{display:grid;grid-template-columns:1fr;gap:10px}@media (min-width:560px){.gallery{grid-template-columns:1fr 1fr}}.gallery-item{display:flex;flex-direction:column;text-align:left;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;overflow:hidden;padding:0;transition:border-color 0.15s ease,box-shadow 0.15s ease}.gallery-item:hover{border-color:var(--primary-color);box-shadow:0 4px 14px rgba(0,0,0,0.1)}.gallery-img{width:100%;height:110px;object-fit:cover;background:var(--secondary-background-color)}.gallery-img.placeholder{display:flex;align-items:center;justify-content:center}.gallery-img.placeholder ha-icon{--mdc-icon-size:40px;color:var(--secondary-text-color)}.gallery-info{padding:10px 12px}.gallery-name{font-size:15px;font-weight:600}.gallery-desc{font-size:12px;color:var(--secondary-text-color);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.gallery-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}code{background:var(--secondary-background-color);padding:1px 5px;border-radius:4px;font-size:12px}`}};t([e({attribute:!1})],R.prototype,"hass",void 0),t([i()],R.prototype,"_params",void 0),t([i()],R.prototype,"_mode",void 0),t([i()],R.prototype,"_gallery",void 0),t([i()],R.prototype,"_galleryLoading",void 0),t([i()],R.prototype,"_galleryError",void 0),t([i()],R.prototype,"_gallerySearch",void 0),t([i()],R.prototype,"_yamlText",void 0),t([i()],R.prototype,"_url",void 0),t([i()],R.prototype,"_loadingUrl",void 0),t([i()],R.prototype,"_error",void 0),t([i()],R.prototype,"_parsed",void 0),t([i()],R.prototype,"_values",void 0),t([i()],R.prototype,"_pageName",void 0),t([i()],R.prototype,"_pageIcon",void 0),t([i()],R.prototype,"_source",void 0),t([i()],R.prototype,"_editYaml",void 0),t([i()],R.prototype,"_checking",void 0),t([i()],R.prototype,"_updateMsg",void 0),t([i()],R.prototype,"_update",void 0),R=t([a("dwains-dashboard-next-blueprint-dialog")],R);export{R as DwainsBlueprintDialog};
