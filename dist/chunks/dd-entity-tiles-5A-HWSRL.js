import{E as t,g as e,a as i,_ as o,n as a,t as n,i as s,b as r,A as c}from"./index-Bf06DtVj.js";import{e as l,i as d,t as p}from"./blueprints-YXvSQBN2.js";import{j as h,c as u,o as m,i as b,r as v}from"./entity-names-CdjoFj2U.js";import{a as g,f as x}from"./dwains-bottom-nav-NHSyyDYi.js";import"./dd-card-host-C87xsXhx.js";const y=l(class extends d{constructor(t){if(super(t),t.type!==p.ATTRIBUTE||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(e,[i]){if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in i)i[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(i)}const o=e.element.classList;for(const t of this.st)t in i||(o.remove(t),this.st.delete(t));for(const t in i){const e=!!i[t];e===this.st.has(t)||this.nt?.has(t)||(e?(o.add(t),this.st.add(t)):(o.remove(t),this.st.delete(t)))}return t}});let f=class extends s{constructor(){super(...arguments),this.entityId="",this.displayName="",this.showMap=!0}_renderLocationPreview(t,e,i){return r`
      <div class="person-map" aria-label=${`${i} location`}>
        <dwains-dashboard-next-card-host
          class="person-map-card"
          eager
          refresh-layout
          .mapCenter=${{latitude:t,longitude:e}}
          strip-card-surface
          .hass=${this.hass}
          .config=${{type:"map",entities:[this.entityId],default_zoom:14,hours_to_show:0}}
        ></dwains-dashboard-next-card-host>
      </div>
    `}render(){const t=this.hass?.states?.[this.entityId];if(!t)return c;const e=this.displayName||t.attributes?.friendly_name||this.entityId,i=t.attributes?.entity_picture,o=Number(t.attributes?.latitude),a=Number(t.attributes?.longitude),n=this.showMap&&Number.isFinite(o)&&Number.isFinite(a),s="home"===String(t.state||"").toLowerCase(),l=["unavailable","unknown"].includes(String(t.state||"").toLowerCase()),d=this.hass?.entities?.[this.entityId]?.icon||t.attributes?.icon||u("person");return r`
      <article class="person-tile ${n?"has-location":""} ${s?"is-active":"is-off"} ${l?"is-unavailable":""}">
        <div class="person-main">
          <span class="person-icon ${i?"has-picture":""}">
            ${i?r`<img class="person-avatar" src=${i} alt=${e}>`:r`<ha-icon icon=${d}></ha-icon>`}
          </span>
          <div class="person-copy">
            <div class="person-name" title=${e}>${e}</div>
            <div class="person-state ${s?"active":""}">${g(this.hass,t)}</div>
          </div>
        </div>

        ${n?this._renderLocationPreview(o,a,e):c}
      </article>
    `}};function w(t){return r`
    <dd-next-compact-entity-tile
      variant="compact"
      .name=${t.name}
      .status=${t.status}
      .icon=${t.icon}
      .accent=${t.accent}
      .active=${t.active}
      .unavailable=${t.unavailable}
      @dd-open=${t.onOpen}
    >
      ${t.toggle?r`
        <dd-next-entity-actions
          slot="actions"
          mode="toggle"
          .accent=${t.accent}
          .active=${t.active}
          .unavailable=${t.unavailable}
          .turnOnLabel=${t.turnOnLabel}
          .turnOffLabel=${t.turnOffLabel}
          @dd-action=${t.onToggle}
        ></dd-next-entity-actions>
      `:c}
    </dd-next-compact-entity-tile>
  `}f.styles=i`
    :host {
      display: block;
      min-width: 0;
      width: 100%;
      --person-color: ${e(h("person"))};
    }

    .person-tile {
      width: 100%;
      height: 62px;
      min-width: 0;
      margin: 0;
      padding: 8px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      box-shadow: 0 3px 9px rgba(15, 23, 42, 0.035);
      transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
    }

    .person-tile.has-location {
      height: auto;
      min-height: var(--dd-person-tile-location-height, 248px);
      justify-content: flex-start;
    }

    :host([role="button"]) .person-tile {
      cursor: pointer;
    }

    :host([role="button"]:hover) .person-tile {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--primary-color) 14%, transparent);
      box-shadow: 0 6px 14px rgba(15, 23, 42, 0.055);
    }

    :host(:focus-visible) {
      outline: 2px solid color-mix(in srgb, var(--primary-color) 55%, transparent);
      outline-offset: 2px;
      border-radius: 8px;
    }

    .person-tile.is-unavailable {
      opacity: .62;
    }

    .person-main {
      width: 100%;
      min-width: 0;
      height: 36px;
      flex: 0 0 36px;
      display: grid;
      grid-template-columns: 36px minmax(0, 1fr);
      align-items: center;
      gap: 9px;
    }

    .person-icon {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: var(--person-color);
      background: color-mix(in srgb, var(--person-color) 13%, transparent);
    }

    .person-icon ha-icon {
      --mdc-icon-size: 20px;
    }

    .person-icon.has-picture {
      overflow: hidden;
      padding: 0;
      background: var(--secondary-background-color);
    }

    .person-avatar {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      border-radius: inherit;
    }

    .person-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
    }

    .person-name {
      overflow: hidden;
      color: var(--primary-text-color);
      font-size: 12px;
      font-weight: 850;
      line-height: 1.15;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-state {
      overflow: hidden;
      color: var(--secondary-text-color);
      font-size: 10px;
      font-weight: 650;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .person-state.active {
      color: var(--person-color);
    }

    .person-map {
      position: relative;
      width: 100%;
      height: var(--dd-person-map-height, 186px);
      min-height: 0;
      margin-top: 10px;
      overflow: hidden;
      border-radius: 8px;
      background: var(--secondary-background-color);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      isolation: isolate;
    }

    .person-map-card {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      overflow: hidden;
      border-radius: inherit;
      --dd-replacement-padding: 0px;
      --dd-replacement-border: 0;
      --dd-replacement-radius: 0px;
      --dd-replacement-min-height: 100%;
    }
  `,o([a({attribute:!1})],f.prototype,"hass",void 0),o([a({attribute:!1})],f.prototype,"entityId",void 0),o([a({attribute:!1})],f.prototype,"displayName",void 0),o([a({type:Boolean})],f.prototype,"showMap",void 0),f=o([n("dwains-dashboard-next-person-tile")],f);let $=class extends s{constructor(){super(...arguments),this.entityId="",this.areaName="",this.displayName="",this.popup=!1,this._showMoreInfo=()=>{this.dispatchEvent(new CustomEvent("dd-more-info",{detail:{entityId:this.entityId},bubbles:!0,composed:!0}))},this._personKeydown=t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._showMoreInfo())}}render(){const t=this.hass?.states?.[this.entityId];if(!t||!this.config)return c;const e=this.entityId.split(".")[0]||"unknown";if("person"===e){const e=this.displayName||t.attributes?.friendly_name||this.hass.entities?.[this.entityId]?.name||this.entityId,i=!0===this.config?.settings?.hide_area_name_in_entity_names?m(e,this.areaName):e;return r`
        <dwains-dashboard-next-person-tile
          .hass=${this.hass}
          .entityId=${this.entityId}
          .displayName=${i}
          .showMap=${!this.popup}
          role="button"
          tabindex="0"
          aria-label=${i}
          @click=${this._showMoreInfo}
          @keydown=${this._personKeydown}
        ></dwains-dashboard-next-person-tile>
      `}if(["light","cover","climate"].includes(e)){const i=this.displayName||t.attributes?.friendly_name||this.hass.entities?.[this.entityId]?.name||this.entityId,o=!0===this.config.settings?.hide_area_name_in_entity_names?m(i,this.areaName):i,a=["unknown","unavailable"].includes(String(t.state).toLowerCase()),n=["on","open","opening","heat","cool"].includes(String(t.state).toLowerCase()),s=Number(t.attributes?.supported_features||0),l=t=>s<=0?8!==t:0!==(s&t),d="cover"===e?"cover":"light"===e?"toggle":"none";let p=g(this.hass,t);if("light"===e&&"number"==typeof t.attributes?.brightness&&"on"===t.state&&(p+=" · "+x(Math.round(t.attributes.brightness/255*100),"%")),"cover"===e&&"number"==typeof t.attributes?.current_position&&(p+=" · "+x(t.attributes.current_position,"%")),"climate"===e){const e=this.hass.config?.unit_system?.temperature||"°C",i=t.attributes?.current_temperature,o=t.attributes?.temperature;void 0!==i&&(p=x(i,e),void 0!==o&&(p+=" · "+x(o,e)))}const v=h(e,t.attributes?.device_class),y=this.hass.entities?.[this.entityId]?.icon||t.attributes?.icon||b(e,t.attributes?.device_class)||u(e);return r`
        <dd-next-compact-entity-tile
          variant="compact"
          .name=${o}
          .status=${p}
          .icon=${y}
          .accent=${v}
          .active=${n}
          .unavailable=${a}
          @dd-open=${this._showMoreInfo}
        >
          ${"none"!==d?r`
            <dd-next-entity-actions
              slot="actions"
              .mode=${d}
              .accent=${v}
              .active=${n}
              .unavailable=${a}
              .state=${String(t.state)}
              .canOpen=${l(1)}
              .canClose=${l(2)}
              .canStop=${l(8)}
              @dd-action=${t=>{const i=t.detail.action;if("light"===e)this.hass.callService("light",i,{entity_id:this.entityId});else if("cover"===e){const t="open"===i?"open_cover":"stop"===i?"stop_cover":"close_cover";this.hass.callService("cover",t,{entity_id:this.entityId})}}}
            ></dd-next-entity-actions>
          `:c}
        </dd-next-compact-entity-tile>
      `}const i="cover"===e?`--primary-color: ${h("cover")}; --state-cover-open-color: ${h("cover")}; --state-cover-opening-color: ${h("cover")}; --state-cover-active-color: ${h("cover")};`:"";return r`
      <div class="card ${e}-card">
        <dwains-dashboard-next-card-host
          framed
          ?eager=${this.popup}
          ?refresh-layout=${this.popup}
          style=${i}
          .hass=${this.hass}
          .config=${v({hass:this.hass,config:this.config,entity:this.entityId,surface:"devices_cards"})}
        ></dwains-dashboard-next-card-host>
      </div>
    `}};$.styles=i`:host{display:block;width:100%;min-width:0;position:relative}.card,dwains-dashboard-next-card-host{display:block;width:100%;min-width:0}.climate-card{overflow:visible}.climate-card>dwains-dashboard-next-card-host{width:calc(100% / .7);transform:scale(.7);transform-origin:top left}@media (max-width:768px){.climate-card>dwains-dashboard-next-card-host{width:calc(100% / .7);transform:scale(.7);transform-origin:top left}}`,o([a({attribute:!1})],$.prototype,"hass",void 0),o([a({attribute:!1})],$.prototype,"config",void 0),o([a()],$.prototype,"entityId",void 0),o([a()],$.prototype,"areaName",void 0),o([a()],$.prototype,"displayName",void 0),o([a({type:Boolean})],$.prototype,"popup",void 0),$=o([n("dd-next-device-entity-card")],$);let k=class extends s{constructor(){super(...arguments),this.name="",this.status="",this.icon="mdi:shape-outline",this.picture="",this.accent="var(--primary-color)",this.variant="compact",this.active=!1,this.unavailable=!1,this.editing=!1,this._open=()=>{this.dispatchEvent(new CustomEvent("dd-open",{bubbles:!0,composed:!0}))},this._keydown=t=>{const e=t.target;e?.closest?.("button, select, input, textarea, a")||"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._open())}}render(){return r`
      <article
        class="tile ${this.variant}"
        style=${`--dd-entity-accent: ${this.accent};`}
        role="button"
        tabindex="0"
        aria-label=${this.name}
        @click=${this._open}
        @keydown=${this._keydown}
      >
        <div class="main">
          <slot name="leading"></slot>
          <span class="icon ${this.picture?"has-picture":""}">
            ${this.picture?r`<img src=${this.picture} alt=${this.name}>`:r`<ha-icon icon=${this.icon}></ha-icon>`}
          </span>
          <div class="copy">
            <div class="name" title=${this.name}>${this.name}</div>
            ${this.status?r`<div class="state">${this.status}</div>`:c}
          </div>
          <div class="actions"><slot name="actions"></slot></div>
        </div>
        <div class="footer"><slot></slot></div>
      </article>
    `}};k.styles=i`:host{display:block;min-width:0;width:100%;--dd-entity-accent:var(--primary-color)}.tile{width:100%;min-width:0;margin:0;box-sizing:border-box;color:var(--primary-text-color);font:inherit;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.tile.compact{min-height:62px;padding:8px 10px;display:flex;flex-direction:column;justify-content:center;overflow:hidden;border:1px solid color-mix(in srgb,var(--primary-text-color) 6%,transparent);border-radius:8px;background:var(--card-background-color);box-shadow:0 3px 9px rgba(15,23,42,.035)}.tile.card{min-height:128px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;border:0;border-radius:10px;background:color-mix(in srgb,var(--card-background-color) 98%,#ffffff);box-shadow:0 12px 26px rgba(15,23,42,.06),inset 0 0 0 1px rgba(15,23,42,.035)}:host([active]) .tile{box-shadow:0 8px 18px rgba(15,23,42,.06),inset 0 0 0 1px color-mix(in srgb,var(--dd-entity-accent) 18%,transparent)}:host([unavailable]) .tile{opacity:.62}.tile:active{transform:scale(.985)}.main{width:100%;min-width:0;display:grid;grid-template-columns:36px minmax(0,1fr) auto;align-items:center;gap:9px}:host([editing]) .main{grid-template-columns:auto 36px minmax(0,1fr) auto}::slotted([slot="leading"]){grid-column:1}.icon{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;border-radius:8px;color:var(--dd-entity-accent);background:color-mix(in srgb,var(--dd-entity-accent) 13%,transparent)}.card .icon{border-radius:11px}.icon ha-icon{--mdc-icon-size:20px}.icon.has-picture{overflow:hidden;padding:0;background:var(--secondary-background-color)}.icon img{width:100%;height:100%;display:block;object-fit:cover}.copy{min-width:0;display:flex;flex-direction:column;justify-content:center;gap:2px}.name{overflow:hidden;color:var(--primary-text-color);font-size:12px;font-weight:850;line-height:1.15;text-overflow:ellipsis;white-space:nowrap}.card .name{margin-top:3px;font-size:15px;font-weight:900;white-space:normal;overflow-wrap:anywhere}.state{overflow:hidden;color:var(--secondary-text-color);font-size:10px;font-weight:650;line-height:1.1;text-overflow:ellipsis;white-space:nowrap}:host([active]) .state{color:var(--dd-entity-accent)}.actions{min-width:0;display:inline-flex;align-items:center;justify-content:flex-end;gap:5px}.footer:empty{display:none}.footer{min-width:0;margin-top:8px}@media (max-width:768px){.tile.compact{min-height:58px;padding:7px 9px}.tile.compact .main{grid-template-columns:34px minmax(0,1fr) auto;gap:8px}:host([editing]) .tile.compact .main{grid-template-columns:auto 34px minmax(0,1fr) auto}.tile.compact .icon{width:34px;height:34px}}`,o([a()],k.prototype,"name",void 0),o([a()],k.prototype,"status",void 0),o([a()],k.prototype,"icon",void 0),o([a()],k.prototype,"picture",void 0),o([a()],k.prototype,"accent",void 0),o([a()],k.prototype,"variant",void 0),o([a({type:Boolean,reflect:!0})],k.prototype,"active",void 0),o([a({type:Boolean,reflect:!0})],k.prototype,"unavailable",void 0),o([a({type:Boolean,reflect:!0})],k.prototype,"editing",void 0),k=o([n("dd-next-compact-entity-tile")],k);let _=class extends s{constructor(){super(...arguments),this.mode="none",this.accent="var(--primary-color)",this.active=!1,this.unavailable=!1,this.state="",this.canOpen=!0,this.canStop=!0,this.canClose=!0,this.turnOnLabel="Turn on",this.turnOffLabel="Turn off",this.openLabel="Open",this.stopLabel="Stop",this.closeLabel="Close",this.lockLabel="Lock",this.unlockLabel="Unlock",this.activateLabel="Activate"}_emit(t,e){t.preventDefault(),t.stopPropagation(),this.dispatchEvent(new CustomEvent("dd-action",{detail:{action:e},bubbles:!0,composed:!0}))}render(){if("none"===this.mode)return c;if("toggle"===this.mode){const t=this.active?this.turnOffLabel:this.turnOnLabel;return r`
        <button
          class="action toggle ${this.active?"active":""}"
          type="button"
          style=${`--dd-action-accent: ${this.accent};`}
          title=${t}
          aria-label=${t}
          ?disabled=${this.unavailable}
          @click=${t=>this._emit(t,this.active?"turn_off":"turn_on")}
        ></button>
      `}if("cover"===this.mode){const t=String(this.state||"").toLowerCase(),e="opening"===t||"closing"===t;return r`
        <div class="cover" style=${`--dd-action-accent: ${this.accent};`}>
          ${this.canOpen?r`
            <button class="action round ${"opening"===t?"active":""}" type="button" title=${this.openLabel} aria-label=${this.openLabel}
              ?disabled=${this.unavailable} @click=${t=>this._emit(t,"open")}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </button>`:c}
          ${this.canStop?r`
            <button class="action round ${e?"active":""}" type="button" title=${this.stopLabel} aria-label=${this.stopLabel}
              ?disabled=${this.unavailable} @click=${t=>this._emit(t,"stop")}>
              <ha-icon icon="mdi:stop"></ha-icon>
            </button>`:c}
          ${this.canClose?r`
            <button class="action round ${"closing"===t?"active":""}" type="button" title=${this.closeLabel} aria-label=${this.closeLabel}
              ?disabled=${this.unavailable} @click=${t=>this._emit(t,"close")}>
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </button>`:c}
        </div>
      `}if("lock"===this.mode){const t=this.active?this.lockLabel:this.unlockLabel;return r`
        <button class="action round" type="button" style=${`--dd-action-accent: ${this.accent};`}
          title=${t} aria-label=${t} ?disabled=${this.unavailable}
          @click=${t=>this._emit(t,this.active?"lock":"unlock")}>
          <ha-icon icon=${this.active?"mdi:lock-open-variant-outline":"mdi:lock-outline"}></ha-icon>
        </button>
      `}return r`
      <button class="action round" type="button" style=${`--dd-action-accent: ${this.accent};`}
        title=${this.activateLabel} aria-label=${this.activateLabel}
        @click=${t=>this._emit(t,"activate")}>
        <ha-icon icon="mdi:play"></ha-icon>
      </button>
    `}};_.styles=i`:host{display:inline-flex;align-items:center;--dd-action-accent:var(--primary-color)}button{font:inherit;-webkit-tap-highlight-color:transparent}.action{padding:0;border:0;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;cursor:pointer;transition:background-color .18s ease,color .18s ease,transform .18s ease,opacity .18s ease}.action:active{transform:scale(.94)}.action:disabled{opacity:.36;cursor:not-allowed}.toggle{width:38px;height:22px;justify-content:flex-start;border-radius:999px;background:color-mix(in srgb,var(--secondary-background-color) 80%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,.07),0 4px 10px rgba(15,23,42,.08)}.toggle::before{content:'';width:18px;height:18px;margin-left:2px;border-radius:999px;background:#fff;box-shadow:0 2px 7px rgba(15,23,42,.2);transition:transform .18s ease}.toggle.active{background:var(--dd-action-accent)}.toggle.active::before{transform:translateX(16px)}.round{width:30px;height:30px;border-radius:999px;color:color-mix(in srgb,var(--primary-text-color) 52%,transparent);background:color-mix(in srgb,var(--secondary-background-color) 70%,#ffffff);box-shadow:inset 0 0 0 1px rgba(15,23,42,.05)}.round:hover,.round.active{color:var(--dd-action-accent);background:color-mix(in srgb,var(--dd-action-accent) 10%,var(--card-background-color))}.round ha-icon{--mdc-icon-size:17px}.cover{display:inline-flex;align-items:center;gap:4px}`,o([a()],_.prototype,"mode",void 0),o([a()],_.prototype,"accent",void 0),o([a({type:Boolean})],_.prototype,"active",void 0),o([a({type:Boolean})],_.prototype,"unavailable",void 0),o([a()],_.prototype,"state",void 0),o([a({type:Boolean})],_.prototype,"canOpen",void 0),o([a({type:Boolean})],_.prototype,"canStop",void 0),o([a({type:Boolean})],_.prototype,"canClose",void 0),o([a()],_.prototype,"turnOnLabel",void 0),o([a()],_.prototype,"turnOffLabel",void 0),o([a()],_.prototype,"openLabel",void 0),o([a()],_.prototype,"stopLabel",void 0),o([a()],_.prototype,"closeLabel",void 0),o([a()],_.prototype,"lockLabel",void 0),o([a()],_.prototype,"unlockLabel",void 0),o([a()],_.prototype,"activateLabel",void 0),_=o([n("dd-next-entity-actions")],_);let L=class extends s{constructor(){super(...arguments),this.mode="segmented",this.accent="var(--primary-color)",this.activeCount=0,this.totalCount=0,this.toggleOnLabel="",this.toggleOffLabel="",this.items=[]}_emit(t){this.dispatchEvent(new CustomEvent("dd-action",{detail:{action:t},bubbles:!0,composed:!0}))}render(){const t=this.totalCount>0&&this.activeCount===this.totalCount;if("toggle"===this.mode){const e=t?"turn_off":"turn_on",i=t?this.toggleOffLabel:this.toggleOnLabel;return r`
        <button
          class="toggle"
          type="button"
          style=${`--dd-action-accent: ${this.accent};`}
          title=${i}
          aria-label=${i}
          @click=${t=>{t.stopPropagation(),this._emit(e)}}
        >
          <span>${this.activeCount}/${this.totalCount}</span>
          <span class="track ${t?"is-on":""}"></span>
        </button>
      `}return this.items.length?r`
      <div class="segmented" style=${`--dd-action-accent: ${this.accent};`} role="group">
        ${this.items.map(t=>r`
          <button
            class="segment ${t.active?"active":""}"
            type="button"
            title=${t.label}
            aria-label=${t.label}
            @click=${e=>{e.stopPropagation(),this._emit(t.action)}}
          ><ha-icon icon=${t.icon}></ha-icon></button>
        `)}
      </div>
    `:c}};L.styles=i`:host{display:inline-flex;align-items:center;flex:0 0 auto}button{font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}.toggle{min-height:30px;padding:4px 7px;border:1px solid var(--divider-color);border-radius:999px;display:inline-flex;align-items:center;gap:7px;color:var(--secondary-text-color);background:var(--card-background-color);font-size:12px;font-weight:750}.track{width:31px;height:18px;position:relative;display:inline-block;border-radius:999px;background:color-mix(in srgb,var(--primary-text-color) 20%,transparent)}.track::after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .18s ease}.track.is-on{background:var(--dd-action-accent)}.track.is-on::after{transform:translateX(13px)}.segmented{height:30px;display:inline-flex;align-items:center;overflow:hidden;border:1px solid color-mix(in srgb,var(--divider-color) 72%,transparent);border-radius:999px;background:color-mix(in srgb,var(--card-background-color) 92%,transparent);color:color-mix(in srgb,var(--primary-text-color) 58%,transparent)}.segment{width:34px;height:30px;padding:0;border:0;display:inline-flex;align-items:center;justify-content:center;color:inherit;background:transparent}.segment + .segment{border-left:1px solid color-mix(in srgb,var(--divider-color) 72%,transparent)}.segment:hover,.segment.active{color:var(--dd-action-accent);background:color-mix(in srgb,var(--dd-action-accent) 12%,var(--card-background-color))}.segment ha-icon{--mdc-icon-size:17px}@media (max-width:768px){.toggle{min-height:28px;font-size:11px}}`,o([a()],L.prototype,"mode",void 0),o([a()],L.prototype,"accent",void 0),o([a({type:Number})],L.prototype,"activeCount",void 0),o([a({type:Number})],L.prototype,"totalCount",void 0),o([a()],L.prototype,"toggleOnLabel",void 0),o([a()],L.prototype,"toggleOffLabel",void 0),o([a({attribute:!1})],L.prototype,"items",void 0),L=o([n("dd-next-room-actions")],L);let I=class extends s{constructor(){super(...arguments),this.name="",this.icon="mdi:floor-plan",this.accent="var(--primary-color)",this.compact=!1}render(){return r`
      <section class="group" style=${`--dd-room-accent: ${this.accent};`}>
        <header class="header">
          <div class="title">
            <ha-icon icon=${this.icon}></ha-icon>
            <span>${this.name}</span>
          </div>
          <div class="actions"><slot name="actions"></slot></div>
        </header>
        <div class="content"><slot></slot></div>
      </section>
    `}};I.styles=i`:host{display:block;min-width:0}.group{min-width:0;padding:14px;border:1px solid color-mix(in srgb,var(--primary-text-color) 7%,transparent);border-radius:12px;background:var(--card-background-color);box-shadow:0 5px 14px rgba(15,23,42,.035)}.header{min-height:30px;margin:0 0 12px;display:flex;align-items:center;justify-content:space-between;gap:8px}.title{min-width:0;flex:1 1 auto;display:flex;align-items:center;gap:8px;color:var(--primary-text-color);font-size:16px;font-weight:500;line-height:1.15;text-align:left}.title ha-icon{flex:0 0 auto;color:var(--primary-color);--mdc-icon-size:20px}.title span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.actions{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:flex-end}.content{min-width:0}@media (max-width:768px){.group{padding:10px}.header{margin-bottom:10px}.title{font-size:14px;font-weight:850}}`,o([a()],I.prototype,"name",void 0),o([a()],I.prototype,"icon",void 0),o([a()],I.prototype,"accent",void 0),o([a({type:Boolean,reflect:!0})],I.prototype,"compact",void 0),I=o([n("dd-next-room-group")],I);export{y as e,w as r};
