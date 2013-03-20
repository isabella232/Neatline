<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Exhibit widget tabs.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php $tabs = _nl_getExhibitTabs(_nl_exhibit());
  if (count($tabs) > 0): ?>

  <li class="dropdown plugins">

    <!-- Dropdown. -->
    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
      Plugins <b class="caret"></b>
    </a>

    <ul class="dropdown-menu">
      <?php foreach ($tabs as $label => $slug): ?>

        <!-- Tabs. -->
        <li class="tab">
          <a
            data-slug="<?php echo $slug; ?>"
            href="#<?php echo $slug; ?>"
          ><?php echo $label; ?></a>
        </li>

      <?php endforeach; ?>
    </ul>

  </li>

<?php endif; ?>