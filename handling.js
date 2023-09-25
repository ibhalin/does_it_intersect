import { Predicate, predicateCollection, PredicateResultCollection, PredicateBool, PredicateError, PredicateNotSupported } from "./predicates.js";

const serviceCollection = {
    truf: 'turf',
    shapely: 'shapely',
}

class TurfPredicatesHandling {
    
    static service = 'turf'
    
    static toPredicateResult(predicate, f, featuresAsArrayOfGeoJson) {
        try {
            const result = f(featuresAsArrayOfGeoJson[0], featuresAsArrayOfGeoJson[1]);
            return new PredicateBool(predicate, this.service, result);
        } catch (error) {
            return new PredicateError(predicate, this.service, String(error));
        }
    };

    static getResultData(featuresAsArrayOfGeoJson) {

        return new PredicateResultCollection({
            isContain: TurfPredicatesHandling.toPredicateResult(predicateCollection.contains, turf.booleanContains, featuresAsArrayOfGeoJson),
            isCross: TurfPredicatesHandling.toPredicateResult(predicateCollection.crosses, turf.booleanCrosses, featuresAsArrayOfGeoJson),
            isEqual: TurfPredicatesHandling.toPredicateResult(predicateCollection.equals, turf.booleanEqual, featuresAsArrayOfGeoJson),
            isIntersect: TurfPredicatesHandling.toPredicateResult(predicateCollection.intersects, turf.booleanIntersects, featuresAsArrayOfGeoJson),
            isOverlap: TurfPredicatesHandling.toPredicateResult(predicateCollection.overlaps, turf.booleanOverlap, featuresAsArrayOfGeoJson),
            isTouch: new PredicateNotSupported(predicateCollection.touches, this.service),
            isWithin: TurfPredicatesHandling.toPredicateResult(predicateCollection.within, turf.booleanWithin, featuresAsArrayOfGeoJson),
        })
    }
}

class ShapelyPredicatesHandling {

    static service = 'shapely'

    static url = 'http://127.0.0.1:5000/shapely/get_predicates/'

    static async fetchPredicates(featuresAsArrayOfGeoJson) {
        try {
            const response = await fetch(`${this.url}${encodeURIComponent(featuresAsArrayOfGeoJson.toString())}`);
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error occurred during API request', error);
            return Promise.reject(error);
        }
    }

    static toPredicateResultCollection(data){
        
        var predicateResultCollection = {
            isContain: undefined,
            isCross: undefined,
            isEqual: undefined,
            isIntersect: undefined,
            isOverlap: undefined,
            isTouch: undefined,
            isWithin: undefined,
        };

        for (var key in data) {
            const predicate = new Predicate(key)
            switch (data[key]) {
                case "true":
                  predicateResultCollection[key] = new PredicateBool(predicate, this.service, true);
                  break;
                case "false":
                  predicateResultCollection[key] = new PredicateBool(predicate, this.service, false);
                  break;
                default:
                  predicateResultCollection[key] = new PredicateError(predicate, this.service, data[key]);
                  break;
              }
        }

        return predicateResultCollection

    }

    static async fetchResultData(featuresAsArrayOfGeoJson) {

        var predicateResultCollection = await this.fetchPredicates(featuresAsArrayOfGeoJson).then((data) => this.toPredicateResultCollection(data));

        return new PredicateResultCollection(predicateResultCollection)
    }
}

export {ShapelyPredicatesHandling, TurfPredicatesHandling, serviceCollection}