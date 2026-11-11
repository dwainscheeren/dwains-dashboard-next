import{_ as e,n as s,r as a,t}from"./state-Ch1yw9_s.js";import{P as i}from"./screensaver-media-6u5xCEkn.js";import{i as o,A as n,b as r,r as l,a as h}from"./lit-element-D6iXJla1.js";import{S as d,f as c,c as p,s as m,a as g,d as _}from"./dialog-sheet-styles-BCf7ZNLW.js";import{d as u}from"./master-action-confirmations-prWHnR4i.js";import{a as b}from"./localize-DC9lHZVH.js";import{f as y}from"./confirm-dialog-sj6nDODt.js";import"./dd-house-power-panel-zM4Tq7eO.js";import"./directive-BcM-F-Rh.js";import"./security-DZVTMiKe.js";import"./energy-prefs-DY5I1NyA.js";import"./page-header-styles-Uj8tWCJ4.js";import"./dd-card-host-zbmwRU5c.js";let f=class extends o{constructor(){super(...arguments),this._mobileSheetAnimated=!1,this._sheetDrag=new d(this,{getPanel:()=>c(this.renderRoot?.querySelector("ha-dialog")),onClose:()=>this.closeDialog()}),this._handleViewEnergy=()=>{const e=this._params?.onViewEnergy;e?p(this.localName,()=>this.closeDialog(),e):this.closeDialog()}}_t(e,s){return b(this.hass,e,s)}showDialog(e){this._params=e,this._mobileSheetAnimated=!1}closeDialog(){this._params=void 0,this._mobileSheetAnimated=!1,y(this,"dialog-closed",{dialog:this.localName})}connectedCallback(){super.connectedCallback(),this._sheetDrag.attach()}disconnectedCallback(){super.disconnectedCallback(),this._sheetDrag.detach()}updated(e){super.updated(e),!this._mobileSheetAnimated&&this._params&&m()&&requestAnimationFrame(()=>{g(c(this.renderRoot.querySelector("ha-dialog")))&&(this._mobileSheetAnimated=!0)})}render(){if(!this._params)return n;const e=this._t("home.house_power_usage");return r`
      <ha-dialog
        open
        width="large"
        @closed=${this.closeDialog}
        @cancel=${()=>this.closeDialog()}
        .heading=${e}
        .type=${""}
        flexContent
        hideActions
      >
        <ha-dialog-header slot="header">
          <div class="sheet-handle" aria-hidden="true"></div>
          <ha-icon-button
            slot="navigationIcon"
            .label=${this._t("common.close")}
            .path=${i}
            @click=${()=>this.closeDialog()}
          ></ha-icon-button>
          <span slot="title" class="dialog-title">
            <span class="dialog-title-icon" aria-hidden="true">
              <ha-icon icon="mdi:flash"></ha-icon>
            </span>
            <span class="dialog-title-text">${e}</span>
          </span>
          ${this._params.onViewEnergy?r`
            <button
              slot="actionItems"
              class="dialog-header-link"
              type="button"
              aria-label=${this._t("navigation.view_energy_sensors")}
              @click=${this._handleViewEnergy}
            >
              <span class="label-long">${this._t("navigation.view_energy_sensors")}</span>
              <span class="label-short">${this._t("devices.energy")}</span>
              <ha-icon icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
            </button>
          `:n}
        </ha-dialog-header>

        <div class="content">
          <dwains-dashboard-next-house-power-panel
            .hass=${this.hass}
            .config=${this._params.config}
          ></dwains-dashboard-next-house-power-panel>
        </div>
      </ha-dialog>
    `}};f.styles=[_,h`
    :host {
      --dialog-accent: ${l(u("energy"))};
      --domain-color: ${l(u("energy"))};
    }
  `],e([s({attribute:!1})],f.prototype,"hass",void 0),e([a()],f.prototype,"_params",void 0),f=e([t("dwains-dashboard-next-house-power-dialog")],f);export{f as DwainsHousePowerDialog};
