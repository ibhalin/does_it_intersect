class Predicate {

    constructor(name) {
        this.name = name;
        this.prettyName = this._getPrettyName();
    }

    _getPrettyName() {
        switch (this.name) {
            case 'isContain':
                return 'Contains'
            case 'isCross':
                return 'Crosses'
            case 'isEqual':
                return 'Equals'
            case 'isIntersect':
                return 'Intersect'
            case 'isOverlap':
                return 'Overlaps'
            case 'isTouch':
                return 'Touches'
            case 'isWithin':
                return 'is Within'
            default:
                throw new Error(`unknown predicate : ${this.name}`)
        }
    }

    getDefaultInnerHTML() {
        return `
            <div id="predicate-${this.name}">
                <div class="header"><code>${this.prettyName}</code></div>
            </div>
        `
    }

}

const predicateCollection = {

    contains : new Predicate('isContain'),
    crosses : new Predicate('isCross'),
    equals : new Predicate('isEqual'),
    intersects : new Predicate('isIntersect'),
    overlaps : new Predicate('isOverlap'),
    touches : new Predicate('isTouch'),
    within : new Predicate('isWithin'),

}


class PredicateResult {
    
    constructor(predicate, service) {
        this.predicate = predicate;
        this.service = service;
        this.cellDivClass = `cell predicate-${this.predicate.name} service-${this.service}`;
        this.cellDiv = this._getCellDiv();
        this.badgeDivClass = `badge predicate-${this.predicate.name} service-${this.service}`;
        this.badgeDiv = this._getBadgeDiv();
        this.content;
        this.divClassSuffix;
        this.hovertext;
    }

    _getDiv(divClass) {
        try {
            return document.getElementsByClassName(divClass).item(0);
        } catch (error) {
            throw new Error(`
            Couldn't find cell div with class ${divClass}.
            ${error}
            `)
        }
    }

    _getCellDiv() {
        return this._getDiv(this.cellDivClass)
    }

    _getBadgeDiv() {
        return this._getDiv(this.badgeDivClass)
    }

    _updateCellDiv() {

        this.cellDiv.className = `${this.cellDivClass} ${this.divClassSuffix}`;

        if (this.hovertext) {
            this.cellDiv.innerHTML = `
                <div class="tooltip">${this.content}
                <span class="tooltiptext">${this.hovertext}</span>
                </div>`
        } else {
            this.cellDiv.innerHTML = this.content;
        }
    }
    
}

class PredicateNotSupported extends PredicateResult {

    constructor(predicate, service) {
        super(predicate, service);
        this.content = 'not supported';
        this.divClassSuffix = 'not-supported';
        this.hovertext = false;
    }
    
}

class PredicateBool extends PredicateResult {

    constructor(predicate, service, bool) {
        super(predicate, service);
        this.bool = bool;
        this.divClassSuffix = String(this.bool);
        this.hovertext = false;
        this.content = `${String(this.bool)}`;
    }

}

class PredicateError extends PredicateResult {

    constructor(predicate, service, error) {
        super(predicate, service);
        this.error = error;
        this.divClassSuffix = 'error';
        this.hovertext = String(this.error);
        this.content = 'error';
    }

}

class PredicateResultCollection {

    constructor({ isContain, isCross, isEqual, isIntersect, isOverlap, isTouch, isWithin }) {
        this.isContain = isContain;
        this.isCross = isCross;
        this.isEqual = isEqual;
        this.isIntersect = isIntersect;
        this.isOverlap = isOverlap;
        this.isTouch = isTouch;
        this.isWithin = isWithin;
    }
    
    pushToDOM() {
        for (var predicateResult in this) {
            this[predicateResult]._updateCellDiv()
        }
    }
}
 
export { PredicateResultCollection, PredicateNotSupported, PredicateError, PredicateBool, predicateCollection, Predicate }