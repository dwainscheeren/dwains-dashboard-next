import{_ as e,n as t,r as i,t as a}from"./state-Bpx-nWN3.js";import{m as s,a as r}from"./screensaver-media-clrApohy.js";import{A as n,E as o,i as l,b as c,a as d}from"./lit-element-CR7MDbd3.js";import{e as p,i as h,t as u,p as g,d as _,c as m,r as y}from"./blueprints-YXvSQBN2.js";import{f as v}from"./fire-event-DQiSssdY.js";import{d as b}from"./index-XkTIGw5k.js";class f extends h{constructor(e){if(super(e),this.it=n,e.type!==u.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===n||null==e)return this._t=void 0,this.it=e;if(e===o)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}f.directiveName="unsafeHTML",f.resultType=1;const x=p(f);let $=class extends l{constructor(){super(...arguments),this._t=(e,t)=>b(this.hass,e,t),this._mode="paste",this._galleryLoading=!1,this._galleryError="",this._gallerySearch="",this._yamlText="",this._url="",this._loadingUrl=!1,this._error="",this._values={},this._pageName="",this._pageIcon="mdi:puzzle",this._source="",this._editYaml=!1,this._checking=!1,this._updateMsg="",this._showGallery=()=>{this._mode="gallery",this._loadGallery()},this._backToSource=()=>{this._parsed=void 0,this._error=""}}get _german(){return"de"===(this.hass?.locale?.language||this.hass?.language||"en").toLowerCase().split("-")[0]}_label(e,t){return(this._german?e.name_de:void 0)||e.name||t}_desc(e){return(this._german?e.description_de:void 0)||e.description||""}showDialog(e){if(this._params=e,this._error="",this._loadingUrl=!1,this._editYaml=!1,this._checking=!1,this._updateMsg="",this._update=void 0,e.page){this._source=e.page.source||"";try{const t=g(e.page.blueprint);this._parsed=t,this._values={..._(t.meta),...e.page.inputs||{},__language:this._german?"de":"en"},this._pageName=e.page.name,this._pageIcon=e.page.icon||"mdi:puzzle",this._yamlText=e.page.blueprint,this._queueUpdateCheck()}catch(e){this._error=String(e?.message||e),this._parsed=void 0}}else this._mode="gallery",this._yamlText="",this._url="",this._source="",this._parsed=void 0,this._values={},this._pageName="",this._pageIcon="mdi:puzzle",this._loadGallery()}closeDialog(){this._params=void 0,this._parsed=void 0,this._yamlText="",this._url="",this._error="",this._values={},v(this,"dialog-closed",{dialog:"dwains-dashboard-next-blueprint-dialog"})}_parseFromText(){this._error="";try{const e=g(this._yamlText);this._applyParsed(e)}catch(e){this._error=String(e?.message||e)}}_suggestInputValues(e){const t={},i=this.hass?.states||{};for(const[a,s]of Object.entries(e.meta.input||{})){if("entity-list"===s.type){if("coin"===s.suggest){t[a]=this._coinSuggestions().filter(e=>e.entity&&e.price_entity&&e.amount_entity);continue}const e=this._entitySuggestions(s),r="coin"===s.suggest?e.filter(e=>/^(?:sensor\\.)wallet_value_(?!total)/i.test(e)):e;t[a]=r.slice(0,30).map(e=>{const t=e.replace(/^sensor\.wallet_value_/,""),a="sensor.cryptoinfo_"+t+"_eur",r="sensor.wallet_volume_"+t;return{entity:e,name:i[e]?.attributes?.friendly_name||(e.split(".")[1]||e).replace(/_/g," "),icon:"",..."coin"===s.suggest?{price_entity:i[a]?a:"",amount_entity:i[r]?r:""}:{}}});continue}if("entity-picker"!==s.type)continue;if("adguard_protection"===a||"adguard_filtering"===a){const e="adguard_protection"===a?/protect|schutz|protection/i:/filter/i,s=Object.keys(i).filter(t=>t.startsWith("switch.")&&e.test(t+" "+(i[t]?.attributes?.friendly_name||""))&&/ad.?guard/i.test(t+" "+(i[t]?.attributes?.friendly_name||""))),r="switch.adguard_"+("adguard_protection"===a?"protection":"filtering");i[r]?t[a]=r:1===s.length&&(t[a]=s[0]);continue}const e=s.suggest_entity;if(e&&i[e]){t[a]=e;continue}const r=a.startsWith("switch_")?"switch":a.startsWith("update_")?"update":a.startsWith("binary_sensor_")?"binary_sensor":"sensor",n=a.replace(/^(sensor|switch|update|binary_sensor)_/,""),o=r+"."+n;if(i[o]){t[a]=o;continue}const l=Object.keys(i).filter(e=>e.startsWith(r+".")&&((e.split(".")[1]||"")===n||(e.split(".")[1]||"").endsWith("_"+n)));1===l.length&&(t[a]=l[0])}return t}_applyParsed(e){this._parsed=e,this._values={..._(e.meta),...this._suggestInputValues(e),__language:this._german?"de":"en"},this._pageName=this._german&&e.meta.name_de||e.meta.name||this._t("blueprint.new_page"),this._pageIcon=e.meta.icon||"mdi:puzzle"}_mergeValues(e){const t={..._(e.meta),__language:this._german?"de":"en"},i=Object.keys(e.meta.input||{});for(const e of i)void 0!==this._values[e]&&""!==this._values[e]&&(t[e]=this._values[e]);return t}_toggleYamlEdit(){this._error="",this._editYaml=!this._editYaml}_applyYamlEdit(){this._error="";try{const e=g(this._yamlText);this._values=this._mergeValues(e),this._parsed=e,this._editYaml=!1,this._queueUpdateCheck()}catch(e){this._error=String(e?.message||e)}}_queueUpdateCheck(){this._parsed&&this._checkUpdate({silentIfCurrent:!0})}async _checkUpdate(e={}){this._error="",this._updateMsg="",this._update=void 0,this._checking=!0;try{const t=this._source||await this._resolveSourceFromGallery();if(!t)return void(e.silentIfCurrent||(this._updateMsg=this._t("blueprint.source_missing")));const i=this._toRawUrl(t),a=await fetch(i,{redirect:"follow"});if(!a.ok)throw new Error(this._t("blueprint.fetch_failed",{status:a.status}));const s=await a.text();if(t!==this._source)return;const r=g(s),n=r.meta.version||"",o=this._parsed?.meta.version||"";n&&(!o||this._compareVersions(n,o)>0)?(this._update=r,this._updateMsg=this._t("blueprint.update_available",{new:n,current:o||"?"})):e.silentIfCurrent||(this._updateMsg=this._t("blueprint.up_to_date",{version:o||n||"?"}))}catch(e){this._error=this._t("blueprint.load_failed",{error:String(e?.message||e)})}finally{this._checking=!1}}async _resolveSourceFromGallery(){if(!this._parsed)return"";await this._loadGallery();const e=this._matchGalleryItem();return e?(this._source=e.url,e.url):""}_matchGalleryItem(){if(!this._parsed||!this._gallery)return;const e=this._normalizeBlueprintName(this._parsed.meta.name),t=(this._parsed.meta.type||"page").toLowerCase(),i=this._gallery.filter(t=>this._normalizeBlueprintName(t.name)===e);return i.find(e=>(e.type||"page").toLowerCase()===t)||i[0]}_normalizeBlueprintName(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"")}_compareVersions(e,t){const i=this._versionParts(e),a=this._versionParts(t),s=Math.max(i.length,a.length);for(let e=0;e<s;e++){const t=i[e]??0,s=a[e]??0;if("number"==typeof t&&"number"==typeof s){if(t!==s)return t>s?1:-1;continue}const r=String(t),n=String(s);if(r!==n)return r>n?1:-1}return 0}_versionParts(e){return e.trim().split(/[^0-9A-Za-z]+/).filter(Boolean).map(e=>/^\d+$/.test(e)?Number(e):e.toLowerCase())}_applyUpdate(){this._update&&(this._values=this._mergeValues(this._update),this._parsed=this._update,this._yamlText=this._update.raw,this._update=void 0,this._updateMsg="")}_toRawUrl(e){let t=e.trim();return t.includes("github.com")&&(t.includes("/blob/")?t=t.replace("github.com","raw.githubusercontent.com").replace("/blob/","/"):t.includes("/tree/")&&(t=t.replace("github.com","raw.githubusercontent.com").replace("/tree/","/"),/\.ya?ml$/i.test(t)||(t=t.replace(/\/$/,"")+"/page.yaml"))),t}async _loadFromUrl(){this._error="";const e=this._toRawUrl(this._url);if(e){this._loadingUrl=!0;try{const t=await fetch(e,{redirect:"follow"});if(!t.ok)throw new Error(this._t("blueprint.fetch_failed",{status:t.status}));const i=await t.text();this._yamlText=i,this._source=this._url;const a=g(i);this._applyParsed(a)}catch(e){this._error=this._t("blueprint.load_failed",{error:String(e?.message||e)})}finally{this._loadingUrl=!1}}else this._error=this._t("blueprint.invalid_url")}async _loadGallery(){if(!this._gallery&&!this._galleryLoading){this._galleryLoading=!0,this._galleryError="";try{const e=await fetch("https://raw.githubusercontent.com/dwainscheeren/dwains-dashboard-blueprints/main/blueprints.json",{redirect:"follow"});if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json(),i=Array.isArray(t)?t:t?.blueprints||[];this._gallery=i.filter(e=>e&&e.url&&e.name&&"page"===String(e.type||"page").toLowerCase()).map(e=>({name:String(e.name),description:e.description?String(e.description):void 0,type:e.type?String(e.type):void 0,author:e.author?String(e.author):void 0,version:null!=e.version?String(e.version):void 0,url:String(e.url),image:e.image?String(e.image):void 0,custom_cards:Array.isArray(e.custom_cards)?e.custom_cards.map(String):void 0}))}catch(e){this._galleryError=this._t("blueprint.gallery_failed",{error:String(e?.message||e)})}finally{this._galleryLoading=!1}}}_filteredGallery(){const e=this._gallerySearch.trim().toLowerCase();return e?(this._gallery||[]).filter(t=>[t.name,t.description,t.author,t.type,...t.custom_cards||[]].filter(Boolean).join(" ").toLowerCase().includes(e)):this._gallery||[]}_pickGalleryItem(e){this._url=e.url,this._loadFromUrl()}_renderGallery(){const e=this._filteredGallery(),t=this.hass?.localize?.("ui.common.search")||"Search";return c`
      <div class="gallery-search">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input
          type="search"
          aria-label=${t}
          placeholder=${t}
          .value=${this._gallerySearch}
          @input=${e=>{this._gallerySearch=e.target.value}}
        />
      </div>
      <p class="hint">${this._t("blueprint.gallery_hint")}</p>
      ${this._galleryError?c`<div class="error">${this._galleryError}</div>`:n}
      ${this._galleryLoading?c`<div class="hint">${this._t("blueprint.loading")}</div>`:n}
      ${!this._gallery||0!==e.length||this._galleryError||this._galleryLoading?n:c`<div class="hint">${this._t("blueprint.gallery_empty")}</div>`}
      <div class="gallery">
        ${e.map(e=>c`
            <button class="gallery-item" @click=${()=>this._pickGalleryItem(e)}>
              ${e.image?c`<img class="gallery-img" src=${e.image} alt="" loading="lazy" />`:c`<div class="gallery-img placeholder">
                    <ha-icon icon="mdi:puzzle"></ha-icon>
                  </div>`}
              <div class="gallery-info">
                <div class="gallery-name">${e.name}</div>
                ${e.description?c`<div class="gallery-desc">${e.description}</div>`:n}
                <div class="gallery-tags">
                  ${e.version?c`<span class="chip">v${e.version}</span>`:n}
                  ${e.type?c`<span class="chip">${e.type}</span>`:n}
                  ${e.author?c`<span class="chip">${e.author}</span>`:n}
                </div>
              </div>
            </button>
          `)}
      </div>
    `}_setValue(e,t){this._values={...this._values,[e]:t}}_missingCustomCards(){if(!this._parsed)return[];const e=new Set([...this._parsed.meta.custom_cards||[],...m(this._parsed.card)]);e.delete("dwains-flexbox-card");const t=[];return e.forEach(e=>{const i=e.startsWith("custom:")?e.slice(7):e;customElements.get(i)||t.push(i)}),t}_slug(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40)||"pagina"}_save(){if(!this._parsed||!this._params)return;for(const[e,t]of Object.entries(this._parsed.meta.input||{})){const i=this._values[e];if("entity-picker"===t.type&&void 0===t.default&&!i)return void(this._error=this._german?"Bitte zuerst eine Entität für „"+this._label(t,e)+"“ auswählen.":"Select an entity for “"+this._label(t,e)+"” first.");if("entity-list"!==t.type)continue;const a=Array.isArray(i)?i:[];if(!a.length||a.some(e=>!e.entity))return void(this._error=this._german?"Bitte mindestens einen vollständigen Eintrag hinzufügen.":"Add at least one complete entry.");if("coin"===t.suggest&&new Set(a.map(e=>e.entity)).size!==a.length)return void(this._error=this._german?"Ein Coin-Wertsensor darf nur einmal vorkommen.":"Each coin value sensor can only be used once.");if("coin"===t.suggest&&a.some(e=>!e.price_entity||!e.amount_entity))return void(this._error=this._german?"Für jeden Coin werden ein Wert-, Preis- und Bestandssensor benötigt.":"Each coin needs a value, price and holdings sensor.")}const e={...this._values};if(Array.isArray(e.waste_types)){const t=e=>{const t=this.hass?.states?.[e],i=new Date;i.setHours(0,0,0,0);const a=[t?.state,...Object.keys(t?.attributes||{}),...Object.values(t?.attributes||{})].flatMap(e=>{if("string"!=typeof e||!/^\d{4}-\d{2}-\d{2}$/.test(e))return[];const t=new Date(e+"T12:00:00");return Number.isFinite(t.getTime())&&t.getTime()>=i.getTime()?[t.getTime()]:[]});return a.length?Math.min(...a):Number.POSITIVE_INFINITY};e.waste_types=[...e.waste_types].sort((e,i)=>t(e.entity)-t(i.entity))}if(Array.isArray(e.coins)){const t=e=>{const t=Number(this.hass?.states?.[e.entity]?.state);return Number.isFinite(t)?t:-1/0};e.coins=[...e.coins].sort((e,i)=>t(i)-t(e))}let t;try{t=y(this._parsed.card,this._parsed.meta,e)}catch(e){return void(this._error=this._t("blueprint.fill_failed",{error:String(e?.message||e)}))}const i={id:this._params.page?.id||`${this._slug(this._pageName)}-${Date.now().toString(36)}`,name:this._pageName.trim()||this._parsed.meta.name||this._t("blueprint.page_fallback"),icon:this._pageIcon||"mdi:puzzle",blueprint:this._parsed.raw,source:this._source||void 0,inputs:{...this._values},card:t};this._params.onSave(i),this.closeDialog()}render(){if(!this._params)return n;const e=!!this._params.page,t=this._parsed?e?this._t("blueprint.title_edit"):this._t("blueprint.title_setup"):this._t("blueprint.title_add"),i=!!this._parsed&&!e;return c`
      <ha-dialog open @closed=${this.closeDialog} .heading=${t} hideActions>
        <ha-dialog-header slot="header">
          <ha-icon-button
            slot="navigationIcon"
            .path=${i?s:r}
            .label=${this._t("common.close")}
            @click=${i?this._backToSource:this.closeDialog}
          ></ha-icon-button>
          <span slot="title">${t}</span>
        </ha-dialog-header>

        <div class="content">
          ${this._error?c`<div class="error">${this._error}</div>`:n}
          ${this._parsed?this._renderForm():this._renderSource()}
        </div>
      </ha-dialog>
    `}_renderSource(){return c`
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

      ${"gallery"===this._mode?this._renderGallery():"paste"===this._mode?c`
            <p class="hint">${this._t("blueprint.paste_hint")}</p>
            <textarea
              class="dd-yaml"
              spellcheck="false"
              placeholder="blueprint:&#10;  name: ...&#10;  type: page&#10;  input:&#10;    ...&#10;card:&#10;  type: ..."
              .value=${this._yamlText}
              @input=${e=>this._yamlText=e.target.value}
            ></textarea>
            <div class="actions">
              <ha-button
                appearance="accent"
                ?disabled=${!this._yamlText.trim()}
                @click=${this._parseFromText}
                >${this._t("common.next")}</ha-button
              >
            </div>
          `:c`
            <p class="hint">${x(this._t("blueprint.url_hint_html"))}</p>
            <input
              class="dd-input"
              type="url"
              placeholder="https://github.com/.../page-blueprints/Birthdays"
              .value=${this._url}
              @input=${e=>this._url=e.target.value}
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
    `}_renderForm(){const e=this._parsed.meta,t=e.input||{},i=Object.keys(t),a=this._missingCustomCards();return c`
      <div class="meta">
        <div class="meta-title">${this._german&&e.name_de||e.name}</div>
        ${e.description||e.description_de?c`<div class="meta-desc">${this._german&&e.description_de||e.description}</div>`:n}
        <div class="meta-tags">
          ${e.version?c`<span class="chip">v${e.version}</span>`:n}
          ${e.author?c`<span class="chip">${e.author}</span>`:n}
          ${(e.custom_cards||[]).map(e=>c`<span class="chip card">${e}</span>`)}
        </div>
      </div>

      ${a.length?c`
            <div class="warn">
              <ha-icon icon="mdi:alert"></ha-icon>
              <div>
                ${this._t("blueprint.missing_cards",{cards:a.join(", ")})}
              </div>
            </div>
          `:n}

      ${this._params?.page||this._source?this._renderEditTools():n}
      ${this._renderUpdateBanner()}

      ${this._editYaml?this._renderYamlEditor():this._renderFields(i,t)}
    `}_renderEditTools(){return c`
      <div class="edit-tools">
        ${this._params?.page?c`
              <ha-button appearance="plain" size="s" @click=${this._toggleYamlEdit}>
                <ha-icon icon="mdi:code-braces"></ha-icon>
                ${this._editYaml?this._t("blueprint.settings"):this._t("blueprint.edit_yaml")}
              </ha-button>
            `:n}
        ${this._parsed?c`
              <ha-button
                appearance="plain"
                size="s"
                ?disabled=${this._checking}
                @click=${()=>this._checkUpdate()}
              >
                <ha-icon icon="mdi:cloud-download-outline"></ha-icon>
                ${this._checking?this._t("blueprint.checking"):this._t("blueprint.check_update")}
              </ha-button>
            `:n}
      </div>
    `}_renderUpdateBanner(){return c`
      ${this._updateMsg?c`
            <div class="update-banner">
              <span>${this._updateMsg}</span>
              ${this._update?c`<ha-button appearance="accent" size="s" @click=${this._applyUpdate}
                    >${this._t("blueprint.update")}</ha-button
                  >`:n}
            </div>
          `:n}
    `}_renderYamlEditor(){return c`
      <textarea
        class="dd-yaml"
        spellcheck="false"
        .value=${this._yamlText}
        @input=${e=>this._yamlText=e.target.value}
      ></textarea>
      <div class="actions">
        <ha-button appearance="plain" @click=${this._toggleYamlEdit}>${this._t("common.back")}</ha-button>
        <ha-button appearance="accent" @click=${this._applyYamlEdit}>${this._t("blueprint.apply")}</ha-button>
      </div>
    `}_renderFields(e,t){return c`
      <div class="field">
        <label>${this._t("blueprint.page_name")}</label>
        <input
          class="dd-input"
          .value=${this._pageName}
          @input=${e=>this._pageName=e.target.value}
        />
      </div>
      <div class="field">
        <label>${this._t("blueprint.sidebar_icon")}</label>
        <ha-icon-picker
          .hass=${this.hass}
          .value=${this._pageIcon}
          @value-changed=${e=>this._pageIcon=e.detail.value}
        ></ha-icon-picker>
      </div>

      ${e.length?c`<div class="section-label">${this._t("blueprint.settings")}</div>`:c`<p class="hint">${this._t("blueprint.no_fields")}</p>`}
      ${e.map(e=>this._renderField(e,t[e]))}

      <div class="actions">
        <ha-button appearance="plain" @click=${this._backToSource}>${this._t("common.back")}</ha-button>
        <ha-button appearance="accent" @click=${this._save}>
          ${this._params?.page?this._t("common.save"):this._t("common.add")}
        </ha-button>
      </div>
    `}_renderField(e,t){const i=this._values[e],a=this._label(t,e);let s;switch(t.type||"text-field"){case"entity-list":s=this._renderEntityList(e,t);break;case"entity-picker":s=c`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${i||""}
            allow-custom-entity
            @value-changed=${t=>this._setValue(e,t.detail.value)}
          ></ha-entity-picker>
        `;break;case"icon-picker":s=c`
          <ha-icon-picker
            .hass=${this.hass}
            .value=${i||""}
            @value-changed=${t=>this._setValue(e,t.detail.value)}
          ></ha-icon-picker>
        `;break;case"area-picker":s=c`
          <ha-area-picker
            .hass=${this.hass}
            .value=${i||""}
            @value-changed=${t=>this._setValue(e,t.detail.value)}
          ></ha-area-picker>
        `;break;case"boolean":s=c`
          <ha-switch
            .checked=${!!i}
            @change=${t=>this._setValue(e,t.target.checked)}
          ></ha-switch>
        `;break;case"number":s=c`
          <input
            class="dd-input"
            type="number"
            .value=${i??""}
            @input=${t=>this._setValue(e,t.target.value)}
          />
        `;break;default:s=c`
          <input
            class="dd-input"
            .value=${i??""}
            @input=${t=>this._setValue(e,t.target.value)}
          />
        `}return c`
      <div class="field">
        <label>${a}</label>
        ${this._desc(t)?c`<div class="field-desc">${this._desc(t)}</div>`:n}
        ${s}
      </div>
    `}_coinSuggestions(){const e=this.hass?.states||{},t=Object.keys(e),i=t.filter(e=>/^sensor\.wallet_value_(?!total$)/i.test(e)),a=e=>e.toLowerCase().replace(/[^a-z0-9]/g,"");return i.map(i=>{const s=i.replace(/^sensor\.wallet_value_/,""),r=(n=i,(String(e[n]?.attributes?.friendly_name||"").replace(/^(?:wert|value|wallet|price|kurs|volume|volumen|bestand|holdings)\s*[:-]?\s*/i,"").trim()||n.replace(/^sensor\\.wallet_value_/,"").replace(/_/g," ")).trim()).replace(/_/g," ").replace(/\b\w/g,e=>e.toUpperCase());var n;const o=[s,r].map(a),l=t.filter(e=>e.startsWith("sensor.")&&(/cryptoinfo|(?:^|_)price_|(?:^|_)kurs_/.test(e)||e.includes("price"))&&o.some(t=>t&&a(e).includes(t))),c=t.filter(e=>e.startsWith("sensor.")&&/wallet_volume_|wallet_amount_|holdings_|balance_/.test(e)&&o.some(t=>t&&a(e).includes(t))),d="sensor.cryptoinfo_"+s+"_eur",p="sensor.wallet_volume_"+s;return{name:r,entity:i,price_entity:e[d]?d:1===l.length&&l[0]||"",amount_entity:e[p]?p:1===c.length&&c[0]||"",icon:""}}).sort((e,t)=>e.name.localeCompare(t.name)).filter((e,t,i)=>i.findIndex(t=>t.entity===e.entity)===t)}_entitySuggestions(e){const t="waste"===e.suggest?/waste|garbage|rubbish|trash|refuse|recycl|papier|paper|bio(?:m[uü]ll)?|rest(?:m[uü]ll)?|abfall|gelber.?sack|altglas|muell|mull|collection|pickup|tonne/i:/wallet|crypto|bitcoin|ethereum|cardano|coin|token|asset|portfolio|balance|cryptoinfo|wallet_value/i;return Object.keys(this.hass?.states||{}).filter(i=>i.startsWith((e.entity_domain||"sensor")+".")&&t.test(i+" "+(this.hass.states[i]?.attributes?.friendly_name||"")))}_renderEntityList(e,t){const i=Array.isArray(this._values[e])?this._values[e]:[],a=(t,a,s)=>{const r=i.map(e=>({...e}));r[t][a]=s,"entity"===a&&s&&!r[t].name&&(r[t].name=this.hass.states[s]?.attributes?.friendly_name||s.split(".").pop()?.replace(/_/g," ")||""),this._setValue(e,r)},s="coin"===t.suggest?this._coinSuggestions().filter(e=>!i.some(t=>t.entity===e.entity)):this._entitySuggestions(t).filter(e=>!i.some(t=>t.entity===e));return c`<div class="entity-list">
      ${i.map((s,r)=>c`<div class="entity-list-row">
        <div class="entity-list-header">
          <input class="dd-input entity-name-input" aria-label=${this._german,"Name"} placeholder=${this._german,"Name"} .value=${s.name||""} @input=${e=>a(r,"name",e.target.value)} />
          <ha-button appearance="plain" size="s" @click=${()=>this._setValue(e,i.filter((e,t)=>t!==r))}>${this._german?"Entfernen":"Remove"}</ha-button>
        </div>
        <div class="field"><label>${this._german?"coin"===t.suggest?"Wertsensor":"Entität":"coin"===t.suggest?"Value sensor":"Entity"}</label><div class="field-desc">${"coin"===t.suggest?"e.g. sensor.wallet_value_bitcoin":"e.g. sensor.waste_paper"}</div><ha-entity-picker .hass=${this.hass} .value=${s.entity||""} @value-changed=${e=>a(r,"entity",e.detail.value)}></ha-entity-picker></div>
        ${"coin"===t.suggest?c`<div class="field"><label>${this._german?"Kurssensor":"Price sensor"}</label><div class="field-desc">e.g. sensor.cryptoinfo_bitcoin_eur</div><ha-entity-picker .hass=${this.hass} .value=${s.price_entity||""} @value-changed=${e=>a(r,"price_entity",e.detail.value)}></ha-entity-picker></div><div class="field"><label>${this._german?"Bestandssensor":"Holdings sensor"}</label><div class="field-desc">e.g. sensor.wallet_volume_bitcoin</div><ha-entity-picker .hass=${this.hass} .value=${s.amount_entity||""} @value-changed=${e=>a(r,"amount_entity",e.detail.value)}></ha-entity-picker></div>`:n}
        ${"waste"===t.suggest?c`<div class="field"><label>${this._german?"Bild":"Image"} <span style="font-size:12px;color:var(--secondary-text-color)">(${this._german,"optional"})</span></label><div class="field-desc">e.g. /local/waste/paper.png</div><input class="dd-input" placeholder="/local/waste/paper.png" .value=${s.image||""} @input=${e=>a(r,"image",e.target.value)} />${s.image&&/^(\/local\/|\/media\/|https?:\/\/)/.test(s.image)?c`<img src=${s.image} alt=${s.name||""} style="height:88px;max-width:100%;object-fit:contain;align-self:start;border-radius:8px" @error=${e=>{e.target.style.display="none"}} />`:n}</div>`:n}
        <div class="field"><label>${this._german,"Icon"} <span style="font-size:12px;color:var(--secondary-text-color);font-weight:400">(${this._german,"optional"})</span></label><ha-icon-picker .hass=${this.hass} .value=${s.icon||""} @value-changed=${e=>a(r,"icon",e.detail.value)}></ha-icon-picker></div>
      </div>`)}
      <ha-button appearance="outlined" @click=${()=>this._setValue(e,[...i,{name:"",icon:"",entity:""}])}>${this._german?"waste"===t.suggest?"Müllart hinzufügen":"Coin hinzufügen":"waste"===t.suggest?"Add waste type":"Add coin"}</ha-button>
      ${s.length?c`<div class="field-desc">${this._german?"Vorschläge aus Home Assistant:":"Suggested Home Assistant entities:"}</div>
        <div class="entity-list-suggestions">${s.slice(0,32).map(t=>{const a="string"==typeof t?{entity:t,name:this.hass.states[t]?.attributes?.friendly_name||(t.split(".")[1]||t).replace(/_/g," "),icon:""}:t;return c`<ha-button appearance="plain" size="s" @click=${()=>this._setValue(e,[...i,a])}>${a.name}</ha-button>`})}</div>`:n}
    </div>`}static get styles(){return d`:host{--mdc-dialog-min-width:90vw;--mdc-dialog-max-width:720px}ha-dialog{--dialog-content-padding:0}.content{padding:8px 24px 20px}.error{background:rgba(var(--rgb-error-color,244,67,54),0.12);color:var(--error-color,#f44336);border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:14px;white-space:pre-wrap}.warn{display:flex;gap:8px;align-items:flex-start;background:rgba(var(--rgb-warning-color,255,152,0),0.12);color:var(--warning-color,#ff9800);border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:13px}.warn ha-icon{flex:0 0 auto}.tabs{display:flex;gap:8px;margin-bottom:12px}.tab{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;font-size:14px}.tab.active{border-color:var(--primary-color);background:rgba(var(--rgb-primary-color,3,169,244),0.1);color:var(--primary-color)}.tab ha-icon{--mdc-icon-size:18px}.hint{font-size:13px;color:var(--secondary-text-color);margin:4px 0 10px}.dd-yaml{width:100%;min-height:240px;box-sizing:border-box;resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.5;padding:12px;border-radius:10px;border:1px solid var(--divider-color);background:var(--code-editor-background-color,var(--card-background-color));color:var(--primary-text-color)}.dd-input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);font-size:14px}.dd-input:focus,.dd-yaml:focus{outline:none;border-color:var(--primary-color)}.meta{border:1px solid var(--divider-color);border-radius:12px;padding:12px 14px;margin-bottom:14px}.meta-title{font-size:17px;font-weight:600}.meta-desc{font-size:13px;color:var(--secondary-text-color);margin-top:4px}.meta-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.chip{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--secondary-background-color);color:var(--secondary-text-color)}.chip.card{background:rgba(var(--rgb-primary-color,3,169,244),0.12);color:var(--primary-color)}.section-label{font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:var(--secondary-text-color);margin:14px 0 8px}.entity-list-row{border:1px solid var(--divider-color);border-radius:10px;padding:12px;margin-bottom:10px;display:grid;gap:9px}.entity-list-header{display:flex;align-items:center;gap:12px;justify-content:space-between}.entity-name-input{flex:1;min-width:0;font-weight:600}.entity-list-suggestions{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.entity-list>ha-button{margin-top:5px}.field{margin-bottom:14px}.field label{display:block;font-size:14px;font-weight:500;margin-bottom:4px}.field-desc{font-size:12px;color:var(--secondary-text-color);margin-bottom:6px}ha-entity-picker,ha-icon-picker,ha-area-picker{display:block;width:100%}.actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.edit-tools{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 12px}.edit-tools ha-icon{--mdc-icon-size:18px;margin-right:4px}.update-banner{display:flex;align-items:center;justify-content:space-between;gap:8px;background:rgba(var(--rgb-primary-color,3,169,244),0.12);color:var(--primary-text-color);border-radius:8px;padding:8px 12px;margin-bottom:12px;font-size:13px}.gallery-search{display:flex;align-items:center;gap:10px;margin:0 0 12px;padding:0 12px;min-height:46px;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)}.gallery-search:focus-within{border-color:var(--primary-color);box-shadow:0 0 0 1px color-mix(in srgb,var(--primary-color) 22%,transparent)}.gallery-search ha-icon{--mdc-icon-size:20px;color:var(--secondary-text-color);flex:0 0 auto}.gallery-search input{width:100%;min-width:0;height:44px;padding:0;border:0;outline:0;background:transparent;color:var(--primary-text-color);font:inherit}.gallery-search input::placeholder{color:var(--secondary-text-color)}.gallery{display:grid;grid-template-columns:1fr;gap:10px}@media (min-width:560px){.gallery{grid-template-columns:1fr 1fr}}.gallery-item{display:flex;flex-direction:column;text-align:left;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer;overflow:hidden;padding:0;transition:border-color 0.15s ease,box-shadow 0.15s ease}.gallery-item:hover{border-color:var(--primary-color);box-shadow:0 4px 14px rgba(0,0,0,0.1)}.gallery-img{width:100%;height:110px;object-fit:cover;background:var(--secondary-background-color)}.gallery-img.placeholder{display:flex;align-items:center;justify-content:center}.gallery-img.placeholder ha-icon{--mdc-icon-size:40px;color:var(--secondary-text-color)}.gallery-info{padding:10px 12px}.gallery-name{font-size:15px;font-weight:600}.gallery-desc{font-size:12px;color:var(--secondary-text-color);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.gallery-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}code{background:var(--secondary-background-color);padding:1px 5px;border-radius:4px;font-size:12px}`}};e([t({attribute:!1})],$.prototype,"hass",void 0),e([i()],$.prototype,"_params",void 0),e([i()],$.prototype,"_mode",void 0),e([i()],$.prototype,"_gallery",void 0),e([i()],$.prototype,"_galleryLoading",void 0),e([i()],$.prototype,"_galleryError",void 0),e([i()],$.prototype,"_gallerySearch",void 0),e([i()],$.prototype,"_yamlText",void 0),e([i()],$.prototype,"_url",void 0),e([i()],$.prototype,"_loadingUrl",void 0),e([i()],$.prototype,"_error",void 0),e([i()],$.prototype,"_parsed",void 0),e([i()],$.prototype,"_values",void 0),e([i()],$.prototype,"_pageName",void 0),e([i()],$.prototype,"_pageIcon",void 0),e([i()],$.prototype,"_source",void 0),e([i()],$.prototype,"_editYaml",void 0),e([i()],$.prototype,"_checking",void 0),e([i()],$.prototype,"_updateMsg",void 0),e([i()],$.prototype,"_update",void 0),$=e([a("dwains-dashboard-next-blueprint-dialog")],$);export{$ as DwainsBlueprintDialog};
