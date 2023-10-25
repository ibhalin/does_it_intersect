import { serviceCollection } from "./handling.js";
import { predicateCollection } from "./predicates.js";

class BadgePart extends HTMLElement {
    constructor(position, content) {
        super();
        this.position = position;
        this.content = content;
        this.className = `badge-part badge-position-${this.position}`;
        this.svgElement;
        this.fillColor = '#ffffff';
    }

    _getDefaultContent() {
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '20'); //todo change this to 100%
        
        const svgRectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        svgRectElement.setAttribute('width', '100%');
        svgRectElement.setAttribute('height', '100%');

        const svgTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        svgTextElement.setAttribute('fill', this.fillColor);
        svgTextElement.setAttribute('text-anchor', 'middle');
        svgTextElement.setAttribute('dominant-baseline', 'middle');
        svgTextElement.setAttribute('x', '50%');
        svgTextElement.setAttribute('y', '50%');

        svgTextElement.appendChild(document.createTextNode(this.content));

        svgElement.appendChild(svgRectElement);
        svgElement.appendChild(svgTextElement);

        return svgElement;
    }

    updateContent(content) {
        this.content = content;
        for (var i in this.svgElement.childNodes) {
            const childNode = this.svgElement.childNodes[i]
            if (childNode.tagName === 'text') {
                childNode.innerHTML = content
            }
        };
    }

    connectedCallback() {
        this.svgElement = this._getDefaultContent();
        this.appendChild(this.svgElement);
    }
}
window.customElements.define('app-badge-part', BadgePart)

class Badge extends HTMLElement {
    constructor(service, predicate){
        super();
        this.service = service;
        this.predicate = predicate;
        this.className = `badge predicate-${this.predicate.name} service-${this.service}`;
        this.tooltip;
        this.badgeLeft = new BadgePart('left', this.predicate.prettyName);
        this.badgeRight = new BadgePart('right', '...');
    }

    updateContent(content) {
        this.badgeRight.updateContent(content);
    }

    connectedCallback() {
        this.appendChild(this.badgeLeft);
        this.appendChild(this.badgeRight);
    }
}
window.customElements.define('app-badge', Badge)

class BadgePanel extends HTMLElement {
    constructor(service){
        super();
        this.service = service;
        this.className = `bagde-panel service-${this.service}`;
        this.badgeCollection;
        this.badgePanelItems;
    }

    _addServiceName() {
        const serviceName = document.createElement('code');
        serviceName.innerHTML = this.service;
        this.appendChild(serviceName);
    }

    _populateBadgeCollection() {
        const badgeCollection = [];
        for (var i in predicateCollection) {
            const badge = new Badge(this.service, predicateCollection[i]);
            badgeCollection.push(badge);
        }
        return badgeCollection;
    }

    _addChildren() {
        for (var i of this.badgeCollection) {
            if (i != undefined) {
                this.badgePanelItems.appendChild(i)
            }
        }
    }

    connectedCallback() {

        this._addServiceName();

        this.badgePanelItems = document.createElement('div')
        this.badgePanelItems.className = 'badge-panel-items-container'
        this.appendChild(this.badgePanelItems)

        this.badgeCollection = this._populateBadgeCollection();
        this._addChildren();
    }
}
window.customElements.define('app-badge-panel', BadgePanel)

class BadgeTable extends HTMLElement {
    constructor() {
        super();
        this.badgePanelCollection;
        this.id = "badge-table";
    }

    _populateBadgePanelCollection() {
        const badgePanelCollection = [];
        for (var i in serviceCollection) {
            const row = new BadgePanel(serviceCollection[i].name);
            badgePanelCollection.push(row);
        }
        return badgePanelCollection
    }

    _addChildren() {
        for (var i of this.badgePanelCollection) {
            if (i != undefined) {
                this.appendChild(i)
            }
        }
    }

    connectedCallback() {
        this.badgePanelCollection = this._populateBadgePanelCollection();
        this._addChildren();
    }
}
window.customElements.define('app-badge-table', BadgeTable)