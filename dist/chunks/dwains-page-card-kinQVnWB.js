import{_ as a,r as t,t as e}from"./state-DfsJqMnn.js";import{i,A as s,b as o,a as n}from"./lit-element-Bpv9xYb0.js";import{d as r,r as d}from"./index-BI_iDSCA.js";import{u as c}from"./dashboard-config-store-C7OHDEFk.js";import{f as h}from"./fire-event-DQiSssdY.js";import{e as p}from"./dwains-bottom-nav-BxqGZtuq.js";import{s as l}from"./confirm-dialog-B8IuJkhl.js";import"./dd-card-host-zbmwRU5c.js";import"./screensaver-media-h3Pumy9x.js";const g=()=>import("./dwains-blueprint-dialog-8qiXK3l-.js"),m=(a,t)=>{h(a,"show-dialog",{dialogTag:"dwains-dashboard-next-blueprint-dialog",dialogImport:g,dialogParams:t})};let _=class extends i{constructor(){super(...arguments),this._add=!1,this._t=(a,t)=>r(this._hass,a,t),this._addBlueprint=()=>{this._canManageDashboard()&&m(this,{onSave:async a=>{await this._mutatePages(t=>[...t.filter(t=>t.id!==a.id),a])&&this._go(a.id)}})},this._editPage=()=>{if(!this._canManageDashboard())return;if(!this._page)return;const a=this._page;m(this,{page:a,onSave:async t=>{await this._mutatePages(a=>a.map(a=>a.id===t.id?t:a))&&(t.id===a.id?window.location.reload():this._go(t.id))}})},this._deletePage=async()=>{if(!this._canManageDashboard())return;if(!this._page)return;const a=this._page;if(!await l(this,{hass:this._hass,title:this._t("layout.delete_page_confirm",{name:a.name}),message:this._t("layout.delete_page_message"),confirmLabel:this._t("common.delete"),destructive:!0}))return;await this._mutatePages(t=>t.filter(t=>t.id!==a.id))&&this._go("home")}}set hass(a){this._hass=a,p(a,this._settings);const t=this.renderRoot?.querySelector("dwains-dashboard-next-card-host");t&&(t.hass=a)}get hass(){return this._hass}setConfig(a){this._add=!!a?.add,this._page=a?.page,this._settings=a?.settings||{},this._hass&&p(this._hass,this._settings)}getCardSize(){return 10}_canManageDashboard(){return!d(this._hass,this._settings)}_dashSegment(){const a=window.location.pathname.split("/")[1];return a&&"lovelace"!==a?a:void 0}_go(a){const t=this._dashSegment();window.location.href=`/${t||"lovelace"}/${a}`}async _mutatePages(a){if(!this._canManageDashboard())return!1;try{return null!==await c(this._hass,this._dashSegment(),(t,e)=>{if(!t)return console.warn("⚠️ Geen strategy in lovelace config — opslaan overgeslagen",e),null;const i=a([...t.pages||[]]);return{...t,pages:i}})}catch(a){return console.error("❌ Opslaan pagina mislukt:",a),h(this,"hass-notification",{message:this._t("layout.save_page_failed",{error:String(a)})}),!1}}render(){return this._add?this._renderAdd():this._page?this._renderPage():s}_renderAdd(){return this._canManageDashboard()?o`
      <div class="add-wrap">
        <ha-card>
          <div class="add-inner">
            <ha-icon icon="mdi:puzzle-plus-outline"></ha-icon>
            <div class="add-title">${this._t("page.add_title")}</div>
            <div class="add-desc">${this._t("page.add_desc")}</div>
            <ha-button appearance="accent" @click=${this._addBlueprint}>
              ${this._t("sidebar.add_blueprint")}
            </ha-button>
          </div>
        </ha-card>
      </div>
    `:s}_renderPage(){const a=this._page;return o`
      <div class="page-wrap">
        <div class="page-toolbar">
          <div class="page-title">
            <ha-icon icon=${a.icon||"mdi:puzzle"}></ha-icon>
            <span>${a.name}</span>
          </div>
          <div class="page-actions">
            ${this._canManageDashboard()?o`
              <button
                type="button"
                title=${this._t("common.edit")}
                aria-label=${this._t("common.edit")}
                @click=${this._editPage}
              >
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>
              <button
                class="danger"
                type="button"
                title=${this._t("common.delete")}
                aria-label=${this._t("common.delete")}
                @click=${this._deletePage}
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            `:s}
          </div>
        </div>
        <dwains-dashboard-next-card-host .hass=${this._hass} .config=${a.card}></dwains-dashboard-next-card-host>
      </div>
    `}};_.styles=n`:host{display:block}.page-wrap{max-width:1100px;margin:0 auto;padding:8px 12px 24px;padding-bottom:var(--dd-next-bottom-nav-space,24px)}.page-toolbar{display:flex;align-items:center;gap:8px;margin-bottom:12px}.page-title{display:flex;align-items:center;gap:8px;font-size:20px;font-weight:600}.page-title ha-icon{--mdc-icon-size:24px;color:var(--primary-color)}.page-actions{margin-left:auto;display:flex;gap:6px}.page-actions button{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;border:none;cursor:pointer;background:var(--secondary-background-color);color:var(--primary-text-color);transition:background-color 0.2s ease,color 0.2s ease}.page-actions button:hover{background:rgba(var(--rgb-primary-color,3,169,244),0.14)}.page-actions button.danger:hover{background:rgba(var(--rgb-error-color,244,67,54),0.16);color:var(--error-color,#f44336)}.page-actions ha-icon{--mdc-icon-size:20px}.page-actions button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}@media (pointer:coarse){.page-actions button{width:44px;height:44px}}dwains-dashboard-next-card-host{display:block}.add-wrap{max-width:520px;margin:40px auto;padding:0 16px}.add-inner{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:32px 24px}.add-inner ha-icon{--mdc-icon-size:48px;color:var(--primary-color)}.add-title{font-size:20px;font-weight:600}.add-desc{font-size:14px;color:var(--secondary-text-color);margin-bottom:8px}@media (max-width:768px){.page-wrap{padding-bottom:calc(80px + env(safe-area-inset-bottom,0px))}}`,a([t()],_.prototype,"_page",void 0),a([t()],_.prototype,"_add",void 0),_=a([e("dwains-dashboard-next-page-card")],_);export{_ as DwainsPageCard};
