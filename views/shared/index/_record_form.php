<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Record edit form template.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<script id="record-form" type="text/templates">

  <form class="form-stacked">

    <!-- Close button. -->
    <button type="button" class="close" data-dismiss="modal"
      aria-hidden="true">&times;</button>

    <p class="lead"></p>

    <ul class="nav nav-pills">
      <li><a href="#record-form-text" data-toggle="tab">Text</a></li>
      <li><a href="#record-form-spatial" data-toggle="tab">Spatial</a></li>
      <li><a href="#record-form-style" data-toggle="tab">Style</a></li>
    </ul>

    <div class="tab-content">

      <div class="tab-pane text" id="record-form-text">
        <?php echo $this->partial('index/_text_tab.php'); ?>
      </div>

      <div class="tab-pane spatial" id="record-form-spatial">
        <?php echo $this->partial('index/_spatial_tab.php'); ?>
      </div>

      <div class="tab-pane style" id="record-form-style">
        <?php echo $this->partial('index/_style_tab.php'); ?>
      </div>

    </div>

    <?php echo $this->partial('index/_form_menu.php'); ?>

  </form>

</script>
