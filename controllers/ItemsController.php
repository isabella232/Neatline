<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ItemsController extends Neatline_Controller_Rest
{


    /**
     * Set the controller model.
     */
    public function init()
    {
        $this->_helper->db->setDefaultModelName('NeatlineRecord');
        parent::init();
    }


    /**
     * Get the Omeka item content for an individual record.
     * @REST
     */
    public function getAction()
    {

        // Get the record, set the item ID.
        $record = $this->_helper->db->findById();
        $record->item_id = $this->_request->iid;

        // Output the item metadata
        echo nl_getItemMarkup($record);

    }


}
