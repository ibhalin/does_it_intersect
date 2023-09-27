const icons = {
    'point' : {
        'value' : 'Point',
        'svg' : `
        <svg xmlns="http://www.w3.org/2000/svg" class="icon-point" width="100%" height="100%" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="2" />
      </svg>
       `,
    },
    'linestring' : {
        'value' : 'LineString',
        'svg' : `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-vector-line" width="100%" height="100%" viewBox="0 0 24 24">
                <path d="M15,3V7.59L7.59,15H3V21H9V16.42L16.42,9H21V3M17,5H19V7H17M5,17H7V19H5" />
            </svg>
        `,
    },
    'polygon': {
        'value' : 'Polygon',
        'svg' : `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-vector-square" width="100%" height="100%" viewBox="0 0 24 24">
                <path d="M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z" />
            </svg>
        `,
    },
    'clear': {
        'value' : 'clear',
        'svg' : `
            <svg width="100%" xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 96 96" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path d="m48,87c-21.54,0-39-17.46-39-39s17.46-39 39-39 39,17.46 39,39-17.46,39-39,39zm0-69c-16.566,0-30,13.434-30,30s13.434,30 30,30c16.569,0 30-13.434 30-30s-13.431-30-30-30zm13.611,40.605l-3.042,3.042c-.558,.558-1.464,.558-2.025,0l-8.61-8.61-8.61,8.61c-.561,.558-1.464,.558-2.025,0l-3.042-3.042c-.558-.558-.558-1.464 0-2.025l8.613-8.607-8.613-8.61c-.558-.561-.558-1.467 0-2.028l3.042-3.039c.561-.561 1.464-.561 2.025,0l8.61,8.61 8.61-8.61c.561-.561 1.467-.561 2.025,0l3.042,3.039c.558,.561 .558,1.467 0,2.028l-8.613,8.61 8.613,8.607c.558,.561 .558,1.47 0,2.025z"/>
            </svg>        
        `
    }
}

class TypeSelect extends HTMLElement {

    constructor(){
        super();
    }
    connectedCallback() {

        this.typeSelect = document.getElementById('type');
    
        for (var i in icons) {
            const newIcon = new ClickableFeatureIcon(icons[i].value, icons[i].svg);
            this.appendChild(newIcon);
        }
    }
  }
window.customElements.define('app-type-select', TypeSelect)

class ClickableFeatureIcon extends HTMLElement {

    constructor(value, svg) {
        super();
        this.value = value;
        this.svg = svg;
    }

    onclick() {
        if (this.value !== 'clear') {
            this.classList.add('selected');
        };
        document.dispatchEvent(this.event);
    }

    connectedCallback() {
        this.event = new CustomEvent('ClickableFeatureIcon-clicked', {"detail":{'value':this.value}})
        this.innerHTML = this.svg;
        this.setAttribute('onclick', `this.onclick();`);

        document.addEventListener('ClickableFeatureIcon-clicked', (event) => {
            if (event.detail.value !== this.value) {
                if(this.classList.contains('selected')) {
                    this.classList.remove('selected')
                }
            }
          });
    }

}
window.customElements.define('app-clickable-feature-icon', ClickableFeatureIcon)