
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Map public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Map', function(
  Map, Neatline, Backbone, Marionette, $, _) {


  /**
   * Load map layers.
   *
   * @param {Object} params: Hash with `extent` and `zoom`.
   */
  var load = function(params) {
    Map.__collection.update(params, function(records) {
      Map.__view.ingest(records);
    });
  };
  Neatline.commands.addHandler('MAP:load', load);
  Neatline.vent.on('MAP:move', load);


  /**
   * Reload map data for current focus/zoom.
   */
  var refresh = function() {
    Map.__view.publishPosition();
  };
  Neatline.commands.addHandler('MAP:refresh', refresh);


  /**
   * Focus the map on the data extent for a record, identified by model.
   *
   * @param {Object} model: The record model.
   */
  var focusByModel = function(model) {
    Map.__view.focusByModel(model);
  };
  Neatline.commands.addHandler('MAP:focusByModel', focusByModel);


  /**
   * Focus the map on the data extent for a record, identified by id.
   *
   * @param {Number} id: The record id.
   */
  var focusById = function(id) {
    Map.__collection.getOrFetch(id, function(model) {
      focusByModel(model);
    });
  };
  Neatline.commands.addHandler('MAP:focusById', focusById);


  /**
   * Unselect all features.
   */
  var unselect = function() {
    Map.__view.unselectAll();
  };
  Neatline.commands.addHandler('MAP:unselect', unselect);


  /**
   * Emit the OpenLayers map instance.
   *
   * @return {Object}: The map.
   */
  var getMap = function() {
    return Map.__view.map;
  };
  Neatline.reqres.addHandler('MAP:getMap', getMap);


  /**
   * Emit the current records collection.
   *
   * @return {Object}: The collection.
   */
  var getRecords = function() {
    return Map.__view.records;
  };
  Neatline.reqres.addHandler('MAP:getRecords', getRecords);


  /**
   * Emit the current viewport focus coordinates.
   *
   * @return {Object}: OpenLayers.LonLat.
   */
  var getCenter = function() {
    return Map.__view.map.getCenter();
  };
  Neatline.reqres.addHandler('MAP:getCenter', getCenter);


  /**
   * Emit the current zoom level.
   *
   * @return {Number}: The zoom level.
   */
  var getZoom = function() {
    return Map.__view.map.getZoom();
  };
  Neatline.reqres.addHandler('MAP:getZoom', getZoom);


});
