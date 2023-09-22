import {ShapelyPredicatesHandling, TurfPredicatesHandling} from "/handling.js"
import {CustomFeaturesClass} from "./features.js";

class TypeSelect extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="input-group">
          <div>
              <select class="form-select" id="type">
                  <option value="Point">Point</option>
                  <option value="LineString">LineString</option>
                  <option value="Polygon">Polygon</option>
                  <option value="None">None</option>
              </select>
          </div>
          <div>
            <input class="form-control" type="button" value="❌" id="clear">
          </div>
        </div>
        `;
    this.typeSelect = document.getElementById('type');
  }
}
window.customElements.define('app-type-select', TypeSelect)

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
      source: new ol.source.XYZ({
        url:
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}@2x.png',
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
      controls: []
    });
    
    const typeSelectElement = this.querySelector('app-type-select');
    const typeSelect = typeSelectElement.typeSelect;

    let draw;
    let snap;
    
    const addInteractions = () => {
      const value = typeSelect.value;
      if (value !== 'None') {
        draw = new ol.interaction.Draw({
          source: this.source,
          type: typeSelect.value,
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
    
    typeSelect.onchange = () => {
      this.map.removeInteraction(draw);
      addInteractions();
    };

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

    document.getElementById('clear').addEventListener('click', () => {
      MapCanevas.uidCounter = 0;
      this.source.clear();
    });

    addInteractions();
  }
}

window.customElements.define('app-map-canevas', MapCanevas)

class Results extends HTMLElement {
  
  static updateResults = (features) => {
      if (features.features.length > 1) {
  
        const resultsObject = {};
  
        resultsObject.turf = TurfPredicatesHandling.getResultData(features.asArrayOfGeoJson());
        resultsObject.turf.pushToDOM();
  
        ShapelyPredicatesHandling.fetchResultData(features.asArrayOfString())
          .then( (resultData) => {
            resultsObject.shapely = resultData;
            resultsObject.shapely.pushToDOM();
          }
        );
      }
  }  
  
  connectedCallback() {
    
    this.innerHTML = `
      <div id="result-table">

        <div id="table-header-row" class="row">
          <div class="cell header index empty-cell"></div>
          <div class="cell header predicate-isContain"><code>Contains</code></div>
          <div class="cell header predicate-isCross"><code>Crosses</code></div>
          <div class="cell header predicate-isEqual"><code>Equals</code></div>
          <div class="cell header predicate-isIntersect"><code>Intersects</code></div>
          <div class="cell header predicate-isOverlap"><code>Overlaps</code></div>
          <div class="cell header predicate-isTouch"><code>Touches</code></div>
          <div class="cell header predicate-isWithin"><code>Is Within</code></div>
        </div>

        <div id="service-${TurfPredicatesHandling.service}" class="row">
          <div class="cell index service-${TurfPredicatesHandling.service}">${TurfPredicatesHandling.service}</div>
          <div class="cell predicate-isContain service-${TurfPredicatesHandling.service}"></span></div>
          <div class="cell predicate-isCross service-${TurfPredicatesHandling.service}"><span class='when-collapsed'><code>Crosses</code></span></div>
          <div class="cell predicate-isEqual service-${TurfPredicatesHandling.service}"><span class='when-collapsed'><code>Equals</code></span></div>
          <div class="cell predicate-isIntersect service-${TurfPredicatesHandling.service}"><span class='when-collapsed'><code>Intersects</code></span></div>
          <div class="cell predicate-isOverlap service-${TurfPredicatesHandling.service}"><span class='when-collapsed'><code>Overlaps</code></span></div>
          <div class="cell predicate-isTouch service-${TurfPredicatesHandling.service}"><span class='when-collapsed'><code>Touches</code></span></div>
          <div class="cell predicate-isWithin service-${TurfPredicatesHandling.service}"><span class='when-collapsed'><code>is Within</code></span></div>
        </div>

        <div id="service-${ShapelyPredicatesHandling.service}" class="row">
          <div class="cell index service-${ShapelyPredicatesHandling.service}">${ShapelyPredicatesHandling.service}</div>
          <div class="cell predicate-isContain service-${ShapelyPredicatesHandling.service}"><span class='when-collapsed'><code>Contains</code></span></div>
          <div class="cell predicate-isCross service-${ShapelyPredicatesHandling.service}"><span class='when-collapsed'><code>Crosses</code></span></div>
          <div class="cell predicate-isEqual service-${ShapelyPredicatesHandling.service}"><span class='when-collapsed'><code>Equals</code></span></div>
          <div class="cell predicate-isIntersect service-${ShapelyPredicatesHandling.service}"><span class='when-collapsed'><code>Intersects</code></span></div>
          <div class="cell predicate-isOverlap service-${ShapelyPredicatesHandling.service}"><span class='when-collapsed'><code>Overlaps</code></span></div>
          <div class="cell predicate-isTouch service-${ShapelyPredicatesHandling.service}"><span class='when-collapsed'><code>Touches</code></span></div>
          <div class="cell predicate-isWithin service-${ShapelyPredicatesHandling.service}"><span class='when-collapsed'><code>is Within</code></span></div>
        </div>

      </div>
    `;
  }
}
window.customElements.define('app-results', Results)

document.addEventListener('features-added', (event) => {
  const features = new CustomFeaturesClass(event.detail.features);
  Results.updateResults(features);
});