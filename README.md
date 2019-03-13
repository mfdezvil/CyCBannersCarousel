## cyc-carousel-webpart

This is a banners carousel webpart for SharePoint Online. 
Given a list and fields (title field, image url field, link field...), the webpart reads data list and show images in a cards/banners carousel, configurable through webpart's properties.

Este es un carrusel de banners para SharePoint Online.
Dada una lista y unos campos (título, url de la imagen, enlace...), el webpart lee el contenido de la lista y muestra las imágenes en un carrusel de banners o tarjetas, configurable a través de las propiedades del webpart.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
