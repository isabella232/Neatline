
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Form view.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Form.Views', function(
  Views, Form, Backbone, Marionette, $, _) {


  Views.AbstractForm = Backbone.View.extend({


    options: {
      messages: {
        save: 'The record was saved successfully!',
        remove: 'The record was deleted successfully!'
      }
    },


    getTemplate: function() {
      return _.template($('#edit-form').html());
    },


    /**
     * Render the form template, initialize trackers, get element markup.
     *
     * @return void.
     */
    initialize: function() {

      /**
       * Trackers.
       */

      this.model    = null;   // The model currently bound to the form.
      this.hash     = null;   // The hash of the currently selected tab.
      this.started  = false;  // True if the form has been displayed.
      this.open     = false;  // True if the form is currently open.
      this.data     = {};     // Aggregate data gathered from tabs.

      // Render template.
      this.form = $(this.getTemplate()());

      // Buttons:
      this.closeButton =    this.form.find('button.close');
      this.deleteButton =   this.form.find('a[name="delete"]');
      this.confirmButton =  this.form.find('button[name="delete"]');
      this.saveButton =     this.form.find('a[name="save"]');

      // Delete modal:
      this.deleteModal =    this.form.find('#deleteConfirm');

      // Groups:
      this.lead =           this.form.find('p.lead');
      this.tabs =           this.form.find('ul.nav a');

      // Bind input listeners.
      Neatline.vent.trigger('editor:form:initialize', this.form);
      this.bindEvents();

    },


    /**
     * Bind event listeners to form elements.
     *
     * @return void.
     */
    bindEvents: function() {


      // Tabs.
      // -----
      this.tabs.on('shown', _.bind(function(e) {

        // Check if the "Spatial" tab is active.
        var event = (e.target.hash == '#form-spatial') ?
          'editor:form:spatialSelect' :
          'editor:form:spatialDeselect';

        // Publish "Spatial" (de)selection.
        Neatline.vent.trigger(event);

        // Track the hash.
        this.hash = e.target.hash;

      }, this));


      // Close button.
      // -------------
      this.closeButton.click(_.bind(function(e) {
        e.preventDefault();
        this.close();
      }, this));


      // Save button.
      // ------------
      this.saveButton.click(_.bind(function(e) {
        e.preventDefault();
        this.save();
      }, this));


      // Delete button.
      // --------------
      this.confirmButton.click(_.bind(function(e) {
        e.preventDefault();
        this.remove();
      }, this));


    },


    /**
     * Render the form header, set the starting tab.
     *
     * @return void.
     */
    render: function() {

      // Do first-open routine, set header.
      if (!this.started) this.setStarted();
      this.lead.text(this.model.get('title'));

      // Disable bubble if "Spatial" is active.
      if (this.hash == '#form-spatial') {
        Neatline.vent.trigger('editor:form:spatialSelect');
      }

      return this;

    },


    /**
     * Show the form; block if the form is already open.
     *
     * @param {Object} model: The record model.
     * @param {Boolean} focus: If true, focus the map on the edit layer.
     * @return void.
     */
    show: function(model, focus) {

      // Block if open.
      if (this.open) return;

      // Store model, render.
      this.model = model;
      this.$el.html(this.form);
      this.render();

      // Publish, set trackers.
      Neatline.vent.trigger('editor:form:open', model, focus);
      this.open = true;

    },


    /**
     * Close the form, publish the event, set the global tracker.
     *
     * @return void.
     */
    close: function() {

      // Hide, publish.
      this.form.detach();
      Neatline.vent.trigger('editor:form:close', this.model);

      // Trackers.
      this.model = null;
      this.open = false;

    },


    /**
     * Save the current form values.
     *
     * @return void.
     */
    save: function() {

      // Set button.
      this.setSaving();

      // Gather data from tab views.
      Neatline.vent.trigger('editor:form:getData');

      // Propagate the new data to all collections.
      Neatline.vent.trigger('editor:form:updateRecord',
        this.model.get('id'), this.data);

      // Save the model.
      this.model.save({}, {

        // Update the header.
        success: _.bind(function() {
          this.updateHead();
          this.setSaved();
        }, this)

      });

      // Clear data.
      this.data = {};

    },


    /**
     * Destroy the model, close the form.
     *
     * @return void.
     */
    remove: function() {

      // Issue DELETE.
      this.model.destroy({
        success: _.bind(function() {

          // Notify collections to purge the model.
          Neatline.vent.trigger('editor:form:delete', this.model);

          // Close the modal and form.
          this.deleteModal.modal('hide');
          this.close();

          // Flash notification.
          this.notify(this.options.messages.remove);

        }, this)
      });

    },


    /**
     * Flash a notification.
     *
     * @param {String} text: The notification content.
     * @return void.
     */
    notify: function(text) {
      noty({ text: text, layout: 'topCenter', timeout: 500 });
    },


    /**
     * Activate "Text" as the starting tab selection.
     *
     * @return void.
     */
    setStarted: function() {
      $(this.tabs[0]).tab('show');
      this.started = true;
    },


    /**
     * Render the record title at the top of the form.
     *
     * @return void.
     */
    updateHead: function() {
      this.lead.text(this.model.get('title'));
    },


    /**
     * Return the saved button to its default state, notify.
     *
     * @return void.
     */
    setSaved: function() {
      this.notify(this.options.messages.save);
      this.saveButton.text('Save');
    },


    /**
     * Set the saved button to "Saving.." mode.
     *
     * @return void.
     */
    setSaving: function() {
      this.saveButton.text('Saving');
    }


  });


});
