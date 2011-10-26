<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Editor controller.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>

<?php

class Neatline_EditorController extends Omeka_Controller_Action
{

    /**
     * Get table objects.
     *
     * @return void
     */
    public function init()
    {

        // Get tables.
        $this->_neatlinesTable = $this->getTable('NeatlineNeatline');
        $this->_mapsTable = $this->getTable('NeatlineMapsMap');
        $this->_timelinesTable = $this->getTable('NeatlineTimeTimeline');
        $this->_itemsTable = $this->getTable('Item');
        $this->_statusesTable = $this->getTable('NeatlineRecordStatus');

    }

    /**
     * Redirect index route to browse.
     *
     * @return void
     */
    public function indexAction()
    {

        // Push the neatline into the view.
        $id = $this->_request->getParam('id');
        $neatline = $this->_neatlinesTable->find($id);
        $this->view->neatline = $neatline;

        // Get the map and timeline records.
        $map = $neatline->getMap();
        $timeline = $neatline->getTimeline();

        // Push the map and timeline records into the view.
        if ($map) {
            $this->view->map = new GeoserverMap_Map($neatline->getMap());
        }

        if ($timeline) {
            $this->view->timeline = $neatline->getTimeline();
        }

        $collections = $this->getTable('Collection')->findAll();
        $tags = $this->getTable('Tag')->findAll();
        $types = $this->getTable('ItemType')->findAll();

        $this->view->collections = $collections;
        $this->view->tags = $tags;
        $this->view->types = $types;

    }

    /**
     * ~ AJAX ~
     * Fetch items for the browser.
     *
     * @return void
     */
    public function itemsAction()
    {

        // Set the layout.
        $this->_helper->viewRenderer('items-ajax');

        // Get parameters from the ajax request.
        $searchString = $this->_request->getParam('search');
        $tags = $this->_request->getParam('tags');
        $types = $this->_request->getParam('types');
        $collections = $this->_request->getParam('collections');
        $all = json_decode($this->_request->getParam('all'));
        $neatlineId = $this->_request->getParam('neatline_id');

        // Push in the Neatline exhibit record.
        $this->view->neatline = $this->_neatlinesTable->find($neatlineId);

        // Get items.
        $this->view->items = neatline_getItemsForBrowser(
            $searchString,
            $tags,
            $types,
            $collections,
            $all
        );

    }

    /**
     * ~ AJAX ~
     * Fetch items for the browser.
     *
     * @return void
     */
    public function saveAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $itemId = $_post['item_id'];
        $neatlineId = $_post['neatline_id'];
        $title = $_post['title'];
        $description = $_post['description'];
        $startDate = $_post['start_date'];
        $startTime = $_post['start_time'];
        $endDate = $_post['end_date'];
        $endTime = $_post['end_time'];
        $geoCoverage = json_encode($_post['geocoverage']);
        $spaceStatus = $_post['space_status'];
        $timeStatus = $_post['time_status'];

        echo $spaceStatus;
        echo $timeStatus;

        // Fetch the Neatline exhibit record and item record.
        $neatline = $this->_neatlinesTable->find($neatlineId);
        $item = $this->_itemsTable->find($itemId);

        // Save the record data.
        $neatline->saveData(
            $item,
            $title,
            $description,
            $startDate,
            $startTime,
            $endDate,
            $endTime,
            $geoCoverage
        );

        // Save the status data.
        $this->_statusesTable->saveStatus(
            $item,
            $neatline,
            'space',
            $spaceStatus
        );

        $this->_statusesTable->saveStatus(
            $item,
            $neatline,
            'time',
            $timeStatus
        );

    }

    /**
     * ~ AJAX ~
     * Save changes made to record statuses.
     *
     * @return void
     */
    public function statusAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $itemId = $_post['item_id'];
        $neatlineId = $_post['neatline_id'];
        $spaceOrTime = $_post['space_or_time'];
        $value = $_post['value'];

        // Fetch the Neatline exhibit record and item record.
        $neatline = $this->_neatlinesTable->find($neatlineId);
        $item = $this->_itemsTable->find($itemId);

        // Save the data.
        $this->_statusesTable->saveStatus(
            $item,
            $neatline,
            $spaceOrTime,
            $value
        );

    }

}
