(function (window) {
  "use strict";

  window.templateStore = {

  };

  var app = {
    initialize: function () {
      var pageView = new window.View({
        el: document.getElementById("page"),
        template: "/templates/page-template.html",
        onRender: function () {
          pageView.replaceWithTemplate("template-page", pageView.el, { copyYear: new Date().getFullYear() });

          var images = new Collection({
            url: "https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=ab7d8b1ae8f6e5991c44c31f529783f7&gallery_id=72157663204881480&format=json&nojsoncallback=1&api_sig=60ba826eed2ca240e784bff9a4f9bef1",
            success: function (data) {
              var imagesView =  new window.View({
                el: document.getElementsByTagName("main")[0],
                template: "/templates/images-template.html",
                onRender: function () {
                  imagesView.replaceWithTemplate("template-images", imagesView.el, { images: data });
                }
              });
              imagesView.render();
              console.log(data);
            },
            error: function () {

            }
          });

          images.fetch();


        }.bind(this)
      });

      pageView.render();
    }
  };
  app.initialize();
})(this);
