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
            url: "https://www.reddit.com/r/aww.json",
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
