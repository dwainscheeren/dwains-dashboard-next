import{_ as e,n as t,t as o}from"./state-DfsJqMnn.js";import{a as r,i,A as s,b as n}from"./lit-element-Bpv9xYb0.js";import{d as a}from"./index-BI_iDSCA.js";const c=new WeakMap;let l=class extends i{constructor(){super(),this.heading="",this.message="",this.confirmLabel="",this.cancelLabel="",this.destructive=!1,this._returnFocus=null,this._handleKeydown=e=>{if("Escape"===e.key)return e.preventDefault(),e.stopPropagation(),void this.close(!1);if("Tab"!==e.key)return;const t=Array.from(this.renderRoot.querySelectorAll("button"));if(!t.length)return;const o=t[0],r=t[t.length-1],i=this.renderRoot.activeElement,s=!!i&&t.includes(i);!e.shiftKey||s&&i!==o?e.shiftKey||s&&i!==r||(e.preventDefault(),o.focus()):(e.preventDefault(),r.focus())},this.addEventListener("keydown",this._handleKeydown)}open(){return this._returnFocus=function(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e:null}(),new Promise(e=>{this._resolve=e,this.updateComplete.then(()=>{const e=this.destructive?".button.cancel":".button.confirm";this.renderRoot.querySelector(e)?.focus()})})}close(e){const t=this._resolve,o=this._returnFocus;this._resolve=void 0,this._returnFocus=null,this.remove(),o?.isConnected&&o.focus({preventScroll:!0}),t?.(e)}disconnectedCallback(){if(super.disconnectedCallback(),this._resolve){const e=this._resolve;this._resolve=void 0,this._returnFocus=null,e(!1)}}render(){return n`
      <div class="backdrop" @click=${()=>this.close(!1)}>
        <div
          class="dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="title"
          aria-describedby=${this.message?"message":s}
          @click=${e=>e.stopPropagation()}
        >
          <h2 id="title" class="title">${this.heading}</h2>
          ${this.message?n`<p id="message" class="message">${this.message}</p>`:s}
          <div class="actions">
            <button type="button" class="button cancel" @click=${()=>this.close(!1)}>
              ${this.cancelLabel}
            </button>
            <button
              type="button"
              class="button confirm ${this.destructive?"destructive":""}"
              @click=${()=>this.close(!0)}
            >
              ${this.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    `}};function d(e,t){c.get(e)?.close(!1);const o=document.createElement("dwains-dashboard-next-confirm-dialog");o.heading=t.title,o.message=t.message||"",o.confirmLabel=t.confirmLabel||t.title,o.cancelLabel=a(t.hass,"common.cancel"),o.destructive=!0===t.destructive;const r=t.container||e.shadowRoot||e,i=o.open();return r.insertBefore(o,r.firstChild),c.set(e,o),i.finally(()=>{c.get(e)===o&&c.delete(e)})}function u(e){c.get(e)?.close(!1)}l.styles=r`:host{display:contents}.backdrop{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(0,0,0,0.48);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);animation:dd-confirm-fade 0.16s ease-out}.dialog{box-sizing:border-box;width:min(420px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;padding:20px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color,#fff);color:var(--primary-text-color);box-shadow:0 24px 64px rgba(0,0,0,0.28);text-align:left;animation:dd-confirm-scale 0.18s cubic-bezier(0.22,1,0.36,1)}.title{margin:0 0 8px;font-size:18px;font-weight:700;line-height:1.25}.message{margin:0 0 20px;color:var(--secondary-text-color);font-size:14px;line-height:1.5;white-space:pre-line}.title + .actions{margin-top:20px}.actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:flex-end}.button{min-height:40px;padding:9px 16px;border:none;border-radius:8px;font:inherit;font-size:14px;font-weight:650;cursor:pointer;transition:transform 0.16s ease,box-shadow 0.16s ease}.button.cancel{background:var(--secondary-background-color);color:var(--primary-text-color)}.button.confirm{background:var(--primary-color);color:var(--text-primary-color,#fff)}.button.confirm.destructive{background:var(--error-color,#db4437);color:#fff}.button:hover{transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,0.1)}.button:focus-visible{outline:2px solid var(--primary-color);outline-offset:2px}@media (pointer:coarse){.button{min-height:44px}}@keyframes dd-confirm-fade{from{opacity:0}to{opacity:1}}@keyframes dd-confirm-scale{from{transform:scale(0.96)}to{transform:scale(1)}}@media (prefers-reduced-motion:reduce){.backdrop,.dialog{animation:none}.button{transition:none}.button:hover{transform:none}}`,e([t({attribute:!1})],l.prototype,"heading",void 0),e([t({attribute:!1})],l.prototype,"message",void 0),e([t({attribute:!1})],l.prototype,"confirmLabel",void 0),e([t({attribute:!1})],l.prototype,"cancelLabel",void 0),e([t({attribute:!1})],l.prototype,"destructive",void 0),l=e([o("dwains-dashboard-next-confirm-dialog")],l);export{u as c,d as s};
