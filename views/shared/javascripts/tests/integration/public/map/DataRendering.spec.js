
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Tests for map data manifestation.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Map Data Rendering', function() {

  var mapLayers, layer1, layer2, layer3;

  // Start Neatline.
  beforeEach(function() {

    _t.loadNeatline();

    // Get layers.
    mapLayers = _t.getVectorLayers();
    layer1 = mapLayers[0];
    layer2 = mapLayers[1];
    layer3 = mapLayers[2];

  });

  it('should render features for map-active models', function() {

    // --------------------------------------------------------------------
    // When the exhibit started, the map should query and render records.
    // --------------------------------------------------------------------

    // Check geometry.
    expect(mapLayers.length).toEqual(3);
    expect(layer1.features[0].geometry.x).toEqual(1);
    expect(layer1.features[0].geometry.y).toEqual(2);
    expect(layer2.features[0].geometry.x).toEqual(3);
    expect(layer2.features[0].geometry.y).toEqual(4);
    expect(layer3.features[0].geometry.x).toEqual(5);
    expect(layer3.features[0].geometry.y).toEqual(6);

  });

  it('should update data when the map is moved', function() {

    // --------------------------------------------------------------------
    // When a new set of records is ingested (for example, in response to
    // a pan or zoom event on the map) and the data for an unfrozen record
    // has been changed, the new data should be rendered.
    // --------------------------------------------------------------------

    // Get the layer for the second record.
    var record2Layer = _t.getVectorLayerByTitle('title2');

    // At start, 1 point at POINT(3 4).
    expect(record2Layer.features.length).toEqual(1);
    expect(record2Layer.features[0].geometry.x).toEqual(3);
    expect(record2Layer.features[0].geometry.y).toEqual(4);

    // Move the map.
    _t.triggerMapMove();

    // Capture outoing request.
    var request = _t.getLastRequest();
    var params = $.parseJSON(request.requestBody);

    // Check method and route.
    expect(request.method).toEqual('GET');
    expect(request.url).toContain(__exhibit.api.records);
    _t.respondLast200(_t.json.records.changed);

    // Get the new layer for the second record.
    record2Layer = _t.getVectorLayerByTitle('title2');

    // Geometry should be changed.
    expect(record2Layer.features.length).toEqual(1);
    expect(record2Layer.features[0].geometry.x).toEqual(7);
    expect(record2Layer.features[0].geometry.y).toEqual(8);

  });

  it('should remove data for unfrozen record', function() {

    // --------------------------------------------------------------------
    // When a new set of records is ingested (for example, in response to
    // a pan or zoom event on the map) and record that is currently on the
    // map is absent from the new records collection, the layer1 for the
    // record should be removed.
    // --------------------------------------------------------------------

    // At start, title2 layer1 exists.
    expect(_t.getVectorLayerByTitle('title2')).toBeDefined();

    // Trigger a map move, inject data without title2.
    _t.refreshMap(_t.json.records.removed);

    // title2 layer1 no longer exists.
    expect(_t.getVectorLayerByTitle('title2')).toBeUndefined();

  });

  it('should not change data for frozen record', function() {

    // --------------------------------------------------------------------
    // When a record is set to frozen (for example, when the edit form for
    // the record is open in the editor), the layer1 for the record should
    // not be rebuilt when new data is requested and ingested on the map
    // in response to a pan or zoom event. This is to prevent new, unsaved
    // changes to the geometry from being overwritten by the old data.
    // --------------------------------------------------------------------

    // Get title2 layer1, add new point.
    var record2Layer = _t.getVectorLayerByTitle('title2');
    var point = new OpenLayers.Geometry.Point(9,10);
    var feature = new OpenLayers.Feature.Vector(point);
    record2Layer.addFeatures([feature]);

    // Set title2 frozen.
    _t.vw.map.freeze(record2Layer.nId);

    // Trigger a map move.
    _t.refreshMap(_t.json.records.changed);

    // Get the new layer1 for title2
    record2Layer = _t.getVectorLayerByTitle('title2');

    // Geometry should be unchanged.
    expect(record2Layer.features[0].geometry.x).toEqual(3);
    expect(record2Layer.features[0].geometry.y).toEqual(4);
    expect(record2Layer.features[1].geometry.x).toEqual(9);
    expect(record2Layer.features[1].geometry.y).toEqual(10);

  });

  it('should not remove data for frozen record', function() {

    // --------------------------------------------------------------------
    // When a record is set to frozen (for example, when the edit form for
    // the record is open in the editor), the layer1 for the record should
    // not be removed if a new data set is ingested in which the record is
    // absent. This is to prevent new, unsaved changes to the geometry
    // from being lost when the map is moved.
    // --------------------------------------------------------------------

    // At start, title2 layer1 exists.
    var record2Layer = _t.getVectorLayerByTitle('title2');
    expect(record2Layer).toBeDefined();

    // Set title2 frozen.
    _t.vw.map.freeze(record2Layer.nId);

    // Trigger a map move, inject data without title2.
    _t.refreshMap(_t.removedRecord2Json);

    // title2 layer1 still exists.
    expect(_t.getVectorLayerByTitle('title2')).toBeDefined();

  });

  it('should render styles', function() {

    // --------------------------------------------------------------------
    // The map should construct layers for vectors with properly formed
    // style maps that manifest the values in the record models.
    // --------------------------------------------------------------------

    /*
     * Default:
     */

    // Fill color.
    expect(layer1.styleMap.styles.default.defaultStyle.fillColor).
      toEqual('1');
    expect(layer2.styleMap.styles.default.defaultStyle.fillColor).
      toEqual('2');

    // Stroke color.
    expect(layer1.styleMap.styles.default.defaultStyle.strokeColor).
      toEqual('4');
    expect(layer2.styleMap.styles.default.defaultStyle.strokeColor).
      toEqual('5');

    // Fill opacity
    expect(layer1.styleMap.styles.default.defaultStyle.fillOpacity).
      toEqual(0.10);
    expect(layer2.styleMap.styles.default.defaultStyle.fillOpacity).
      toEqual(0.11);

    // Stroke opacity
    expect(layer1.styleMap.styles.default.defaultStyle.strokeOpacity).
      toEqual(0.16);
    expect(layer2.styleMap.styles.default.defaultStyle.strokeOpacity).
      toEqual(0.17);

    // Graphic opacity
    expect(layer1.styleMap.styles.default.defaultStyle.graphicOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.default.defaultStyle.graphicOpacity).
      toEqual(0.20);

    // Stroke width.
    expect(layer1.styleMap.styles.default.defaultStyle.strokeWidth).
      toEqual(22);
    expect(layer2.styleMap.styles.default.defaultStyle.strokeWidth).
      toEqual(23);

    // Point radius.
    expect(layer1.styleMap.styles.default.defaultStyle.pointRadius).
      toEqual(25);
    expect(layer2.styleMap.styles.default.defaultStyle.pointRadius).
      toEqual(26);

    /*
     * Select:
     */

    // Fill color.
    expect(layer1.styleMap.styles.select.defaultStyle.fillColor).
      toEqual('7');
    expect(layer2.styleMap.styles.select.defaultStyle.fillColor).
      toEqual('8');

    // Stroke color.
    expect(layer1.styleMap.styles.select.defaultStyle.strokeColor).
      toEqual('4');
    expect(layer2.styleMap.styles.select.defaultStyle.strokeColor).
      toEqual('5');

    // Fill opacity
    expect(layer1.styleMap.styles.select.defaultStyle.fillOpacity).
      toEqual(0.13);
    expect(layer2.styleMap.styles.select.defaultStyle.fillOpacity).
      toEqual(0.14);

    // Stroke opacity
    expect(layer1.styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.16);
    expect(layer2.styleMap.styles.select.defaultStyle.strokeOpacity).
      toEqual(0.17);

    // Graphic opacity
    expect(layer1.styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.select.defaultStyle.graphicOpacity).
      toEqual(0.20);

    // Stroke width.
    expect(layer1.styleMap.styles.select.defaultStyle.strokeWidth).
      toEqual(22);
    expect(layer2.styleMap.styles.select.defaultStyle.strokeWidth).
      toEqual(23);

    // Point radius.
    expect(layer1.styleMap.styles.select.defaultStyle.pointRadius).
      toEqual(25);
    expect(layer2.styleMap.styles.select.defaultStyle.pointRadius).
      toEqual(26);

    /*
     * Temporary:
     */

    // Fill color.
    expect(layer1.styleMap.styles.temporary.defaultStyle.fillColor).
      toEqual('7');
    expect(layer2.styleMap.styles.temporary.defaultStyle.fillColor).
      toEqual('8');

    // Stroke color.
    expect(layer1.styleMap.styles.temporary.defaultStyle.strokeColor).
      toEqual('4');
    expect(layer2.styleMap.styles.temporary.defaultStyle.strokeColor).
      toEqual('5');

    // Fill opacity
    expect(layer1.styleMap.styles.temporary.defaultStyle.fillOpacity).
      toEqual(0.13);
    expect(layer2.styleMap.styles.temporary.defaultStyle.fillOpacity).
      toEqual(0.14);

    // Stroke opacity
    expect(layer1.styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.16);
    expect(layer2.styleMap.styles.temporary.defaultStyle.strokeOpacity).
      toEqual(0.17);

    // Graphic opacity
    expect(layer1.styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.19);
    expect(layer2.styleMap.styles.temporary.defaultStyle.graphicOpacity).
      toEqual(0.20);

    // Stroke width.
    expect(layer1.styleMap.styles.temporary.defaultStyle.strokeWidth).
      toEqual(22);
    expect(layer2.styleMap.styles.temporary.defaultStyle.strokeWidth).
      toEqual(23);

    // Point radius.
    expect(layer1.styleMap.styles.temporary.defaultStyle.pointRadius).
      toEqual(25);
    expect(layer2.styleMap.styles.temporary.defaultStyle.pointRadius).
      toEqual(26);

  });

});