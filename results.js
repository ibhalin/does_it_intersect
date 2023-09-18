class Service {
    constructor(name) {
        this.name = name
    }
}

const serviceCollection = {
    turf : new Service('turf'),
    shapely : new Service('shapely')
}

class ResultTable {
    constructor(){
        this.resultTableServices = []
    }

    addService(resultTableService) {
        if (resultTableService in this.services) {
            throw new Error('Service already added')
        }
        this.services.push(resultTableService)
    }
}

class ResultTableCell {

    constructor() {
        this.defaultElement = document.createElement("div");
        this.defaultClass = 'cell'
        this.defaultElement.className = this.defaultClass;
        this.predicateResult;
        this.extraDivClass;
        this.textNode;
    }

    updatePredicateResult(predicateResult) {
        this.predicateResult = predicateResult;
        this.extraDivClass = predicateResult.content;
        this.textNode = document.createTextNode(`<p>${predicateResult.content}</p>`);
        this.defaultElement.appendChild(this.textNode);
    }

    addClass(className) {
        this.defaultElement.classList.add(className);
    }

    removeClass(className) {
        this.defaultElement.classList.remove(className);
    }

}

class ResultTableService extends HTMLElement {

    constructor(service){
        this.service = service

    }

    connectedCallback() {
        
    }
}

