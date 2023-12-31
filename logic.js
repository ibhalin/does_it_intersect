import {PythonPredicatesHandling, TurfPredicatesHandling, serviceCollection} from "./handling.js"
import {CustomFeaturesClass} from "./features.js";

class StyleControler {

  static colors = {
    0: [244, 185, 66],
    1: [0, 157, 220]
  }

  static getColor(feature) {
    return StyleControler.colors[feature.getId() % 2]
  }

  static getColorById(id) {
    return StyleControler.colors[id]
  }

  static drawStyleFunction = ()  => {
    let color;
    if (MapCanevas.uidCounter == 0) {
      color = StyleControler.getColorById(0);
    } else {
      const id = MapCanevas.uidCounter % 2
      color = StyleControler.getColorById(id)
    }
    return StyleControler.generateStyle(color)
  }

  static styleFunction = (feature) => {
    const color = StyleControler.getColor(feature);
    return StyleControler.generateStyle(color)
  }

  static generateStyle = (color) => {

    const colorOpaque = [...color, 1];
    const colorTransparent = [...color, 0.5]

    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: colorTransparent,
      }),
      stroke: new ol.style.Stroke({
        color: colorOpaque,
        width: 2,
      }),
      image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
          color: colorTransparent,
        }),
        stroke: new ol.style.Stroke({
          color: colorOpaque,
          width: 1,
        }),
      }),
    })
  }
}

class MapCanevas extends HTMLElement {

  static uidCounter = 0;

  connectedCallback() {
    this.innerHTML = `
    <div id="map"></div>
    <app-type-select></app-type-select>
    `;
    
    this.raster = new ol.layer.Tile({
      source: new ol.source.OSM({
        attributions: [
            ol.source.OSM.ATTRIBUTION
        ]          
    }),
    });
    
    this.source = new ol.source.Vector({ wrapX: false });
    
    this.vector = new ol.layer.Vector({
      source: this.source,
      style: StyleControler.styleFunction
    });
    
    this.map = new ol.Map({
      target: 'map',
      layers: [this.raster, this.vector],
      view: new ol.View({
        center: [0, 0],
        zoom: 2
      }),
      controls: [
        new ol.control.Attribution()
    ]
    });
    
    document.addEventListener('ClickableFeatureIcon-clicked', (event) => {
      if (event.detail.value !== 'clear') {
        this.map.removeInteraction(draw);
        addInteractions(event.detail.value);
      } else {
          MapCanevas.uidCounter = 0;
          this.source.clear();
      }
    });

    let draw;
    let snap;
    
    const addInteractions = (value) => {
      if (value !== 'None') {
        draw = new ol.interaction.Draw({
          source: this.source,
          type: value,
          maxPoints: 20,
          style: StyleControler.drawStyleFunction
        });
        this.map.addInteraction(draw);
        
        snap = new ol.interaction.Snap({
          edge: true,
          vertex: true,
          source: this.source
        });
        this.map.addInteraction(snap);
      }
    }

    const removeLastFeature = () => {
      const features = this.source.getFeatures();
      if (features.length > 2) {
        this.source.removeFeature(features[0]);
      }
    }

    const generateUid = (feature) => {
      feature.setId(MapCanevas.uidCounter);
      MapCanevas.uidCounter = ++MapCanevas.uidCounter;
    }

    this.source.on('addfeature', (event) => {
      removeLastFeature();
      generateUid(event.feature);
      const features = this.source.getFeatures()
      document.dispatchEvent(new CustomEvent('features-added', {
        detail: {
          features: features
        }
      }));
    })

    addInteractions('None');
  }
}

window.customElements.define('app-map-canevas', MapCanevas)

class Results extends HTMLElement {
  
  static updateResults = (features) => {
      if (features.features.length > 1) {
  
        const resultsObject = {};

        // Turf
  
        resultsObject.turf = TurfPredicatesHandling.getResultData(features.asArrayOfGeoJson());
        resultsObject.turf.pushToDOM();

        // Shapely

        const shapelyService = serviceCollection.shapely

        const shapelyPredicateHandling = new PythonPredicatesHandling(shapelyService.name, shapelyService.url)
  
        shapelyPredicateHandling.fetchResultData(features.asArrayOfString())
          .then( (resultData) => {
            resultsObject.shapely = resultData;
            resultsObject.shapely.pushToDOM();
          }
        );

        // Postgis

        const postgisService = serviceCollection.postgis

        const postgisPredicateHandling = new PythonPredicatesHandling(postgisService.name, postgisService.url)
  
        postgisPredicateHandling.fetchResultData(features.asArrayOfString())
          .then( (resultData) => {
            resultsObject.postgis = resultData;
            resultsObject.postgis.pushToDOM();
          }
        );
      }
  }  

  connectedCallback() {
  }
  
}
window.customElements.define('app-results', Results)

document.addEventListener('features-added', (event) => {
  const features = new CustomFeaturesClass(event.detail.features);
  Results.updateResults(features);
});