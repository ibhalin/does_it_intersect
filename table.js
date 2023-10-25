import { predicateCollection } from "./predicates.js";
import { serviceCollection } from "./handling.js";

class MyTooltip extends HTMLElement {
    constructor() {
        super();
        this.className = "tooltip";
        this.content;
        this.hoverText;
    }

}
window.customElements.define('app-my-tooltip', MyTooltip)

class Cell extends HTMLElement {
    constructor(service, predicate) {
        super();
        this.service = service;
        this.predicate = predicate;
        this.className = `cell predicate-${this.predicate.name} service-${this.service}`;
        this.tooltip;
    }
}
window.customElements.define('app-cell', Cell)

class CellHeader extends HTMLElement {
    constructor(predicate) {
        super();
        this.predicate = predicate
        this.className = `cell header predicate-${this.predicate.name}`
    }

    connectedCallback() {
        this.innerHTML = `<code>${this.predicate.prettyName}</code>`
    }
}
window.customElements.define('app-cell-header', CellHeader)

class CellEmpty extends HTMLElement {
    constructor() {
        super();
        this.className = "cell header index empty-cell"
    }
}
window.customElements.define('app-cell-empty', CellEmpty)

class CellIndex extends HTMLElement {
    constructor(service) {
        super();
        this.service = service;
        this.className = `cell index service-${this.service}`;
    }

    connectedCallback() {
        this.innerHTML = this.service;
    }
}
window.customElements.define('app-cell-index', CellIndex)

class HeaderRow extends HTMLElement {
    constructor() {
        super();
        this.className = "row"
        this.cellCollection;
        this.cellIndex;
    }    

    _populateCellCollection() {
        const cellCollection = [this.cellIndex]
        for (var i in predicateCollection) {
            const cellHeader = new CellHeader(predicateCollection[i])
            cellCollection.push(cellHeader);
        }
        return cellCollection
    }

    _addChildren() {
        for (var i of this.cellCollection) {
            if (i != undefined) {
                this.appendChild(i)
            }
        }
    }

    connectedCallback() {

        this.cellIndex = new CellEmpty();
        this.cellCollection = this._populateCellCollection(this.nbCell);
        this._addChildren();

    }
}
window.customElements.define('app-header-row', HeaderRow)

class Row extends HTMLElement {
    constructor(service) {
        super();
        this.service = service;
        this.className = "row";
        this.cellCollection;
        this.cellIndex;
    }  
    
    _populateCellCollection() {
        const cellCollection = [this.cellIndex];
        for (var i in predicateCollection) {
            const cell = new Cell(this.service, predicateCollection[i]);
            cellCollection.push(cell);
        }
        return cellCollection;
    }
    
    _addChildren() {
        for (var i of this.cellCollection) {
            if (i != undefined) {
                this.appendChild(i)
            }
        }
    }

    connectedCallback() {
        this.cellIndex = new CellIndex(this.service);
        this.cellCollection = this._populateCellCollection();
        this._addChildren();
    }
}
window.customElements.define('app-row', Row)

class Table extends HTMLElement {
    constructor() {
        super();
        this.headerRow;
        this.rowCollection;
        this.id = "result-table";
    }

    _populateRowCollection() {
        const rowCollection = [this.headerRow];
        for (var i in serviceCollection) {
            const row = new Row(serviceCollection[i].name);
            rowCollection.push(row);
        }
        return rowCollection
    }

    _addHeaderRow() {
        const headerRow = new HeaderRow()
        return headerRow
    }

    _addChildren() {
        for (var i of this.rowCollection) {
            if (i != undefined) {
                this.appendChild(i)
            }
        }
    }

    connectedCallback() {
        this.headerRow = this._addHeaderRow();
        this.rowCollection = this._populateRowCollection();
        this._addChildren()
    }

}
window.customElements.define('app-table', Table)



