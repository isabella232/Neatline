# Neatline from 10,000 Meters

## At a Glance

  - Neatline is built as a set of plugins for Omeka.
  - [Omeka][omeka] is a web publishing framework - similar to [Wordpress][wordpress] or [Drupal][drupal], but designed for scholars and archivists.
  - Omeka can be installed either on a public web server or a local sandbox environment on your own computer.
  - Neatline can be used out-of-the-box with modern geography base layers like [OpenStreetMap][osm] or the [Google][google] API layers.
  - If you want to add custom base layers or overlays, you'll need to host them using a piece of software called [Geoserver][geoserver].

## Omeka

Neatline is built as a suite of modular plugins for [Omeka][omeka], a digital collection-management and web-publishing framework developed by the [Roy Rosenzweig Center for History and New Media][chnm] at George Mason University. In many ways, Omeka is similar to a lot like other popular content management systems like [Wordpress][wordpress] or [Drupal][drupal], but it's designed specifically around the needs of scholars and archivists - Omeka makes it possible to create, curate, and publish a collection of "items" (the rough equivalent of a Wordpress "post" or a Drupal "node"), each of which is a fully-qualified Dublin Core metadata record. Once you've created some items using the Omeka administrative interface, the collection is automatically published as a public-facing website, which can be tailored to the needs of specific projects with custom themes and plugins.

Omeka is a web application written with PHP and MySQL that runs on the "[LAMP stack][lamp]" (Linux, Apache, MySQL, and PHP), a ubiquitous set of technologies supported by almost any commercial or institutional hosting provider. Alternatively, if you just want to experiment with Neatline in an offline setting, your can also install Omeka on a sandbox server environment running on your own computer using software packages like [MAMP][mamp], [WampServer][wamp], or [XAMPP][xampp], with the option of migrating the site to a public-facing web host at any point in the future.

## Neatline

Building on the excellent foundation provided by Omeka, Neatline is a plugin (just like plugins for Wordpress or modules for Drupal) that grafts new functionality onto the core Omeka feature set. Neatline adds an interactive map-making environment that makes it possible to create Neatline _exhibits_, each of which is populated with its own collection of _records_, which can optionally be synchronized with Dublin Core records in the underlying Omeka collection.

Think of exhibits as the canvas for a project, records as the paint strokes. Exhibit settings control the default base layer and focus location of the map, specify the combination of user-interface widgets that are enabled in the interactive environment, and supply a piece of long-format prose to introduce or narrate the project. Meanwhile, the actual content inside the exhibits is represented as a collection of records, each of which corresponds to some kind of visual or textual entity - vector annotations on the map, events on the timeline, overlayed historical maps, textual annotations in the exhibit narrative, or ordered waypoints.

## Geoserver

Out of the box, Neatline can be used to build exhibits on top of a collection of modern-geography base layers - the [OpenStreetMap][osm] tile set, the [Google Maps][google] API, and a [collection of stylized layers][stamen-maps] created by a design firm in San Francisco called [Stamen Design][stamen].

If you want to use Neatline with georectified historical maps or custom base layers, though, you'll need to publish the layers to the web using a separate piece of software called [Geoserver][geoserver], an open-source geospatial server that does the computationally-intensive work of piping the georeferenced image tiles into the Neatline exhibits. We'll discuss the process of setting up Geoserver hosting in more detail in the "Preparing to Install" guide.


[omeka]: http://omeka.org/
[wordpress]: http://wordpress.org/
[drupal]: https://drupal.org/
[mamp]: http://www.mamp.info/en/index.html
[wamp]: http://www.wampserver.com/en/
[xampp]: http://www.apachefriends.org/en/xampp.html
[chnm]: http://chnm.gmu.edu/
[geoserver]: http://geoserver.org/
[osm]: http://www.openstreetmap.org/
[google]: https://developers.google.com/maps/
[stamen-maps]: http://maps.stamen.com/
[stamen]: http://stamen.com/
[lamp]: http://en.wikipedia.org/wiki/LAMP_(software_bundle)