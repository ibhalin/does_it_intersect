class CustomFeaturesClass {

    constructor(features) {
        this.features = features
        this.asArrayOfGeoJson = this._featuresToArrayOfGeoJson;
        this.asArrayOfString = this._featuresToArrayOfString;
    }

    static _writer = new ol.format.GeoJSON();

    _featuresToArrayOfGeoJson() {
        return this.features.map((x) => CustomFeaturesClass._writer.writeGeometryObject(x.getGeometry()));
    }

    _featuresToArrayOfString() {
        return this.features.map((x) => CustomFeaturesClass._writer.writeGeometry(x.getGeometry()));
    }
}

export {CustomFeaturesClass}