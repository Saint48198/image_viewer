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

          pageView.imagesCollection = new Collection({
            url: "https://api.flickr.com/services/rest/?method=flickr.galleries.getPhotos&api_key=0a50a1937d5ca6f848582b724238ef9b&gallery_id=72157663204881480&format=json&nojsoncallback=1",
            success: function (data) {
              var imagesView =  new window.View({
                el: document.getElementsByTagName("main")[0],
                template: "/templates/images-template.html",
                onRender: function () {
                  imagesView.replaceWithTemplate("template-images", imagesView.el, { images: data });
                }
              });
              imagesView.render();

              document.getElementsByTagName("main")[0].addEventListener("click", pageView.handleImageClick);

            },
            error: function () {
              alert ("error getting data from service");
            }
          });

          pageView.imagesCollection.fetch();


        }.bind(this),

        handleImageClick: function (e) {
          var target = e.target;
          if (target.tagName.toLowerCase() === "img") {
            target = target.parentNode;
          }

          if (target.getAttribute("data-id")) {
            pageView.displayLightBock(parseInt(target.getAttribute("data-id")));
          }
        },

        displayLightBock: function (id) {
          this.removeLightBox();
          
          var image = pageView.imagesCollection.get(id);
          pageView.appendUsingTemplate("template-lightbox", document.getElementsByTagName("body")[0], { data: image });

          document.getElementById("modal-image").addEventListener("click", pageView.handleLightBoxClickEvents);

        },

        handleLightBoxClickEvents: function (e) {
          var target = e.target;
          console.log(target);

          if (target.id === "modal-image" || target.title === "close") {
            pageView.removeLightBox();
            return false;
          }
        },

        removeLightBox: function () {
          if (document.getElementById("modal-image")) {
            document.getElementById("modal-image").removeEventListener("click", pageView.handleLightBoxClickEvents, false);
            pageView.removeElement("modal-image");
          }
        },

        removeElement: function(id) {
          return (pageView.tmpElem = document.getElementById(id)).parentNode.removeChild(pageView.tmpElem);
        }
      });

      pageView.render();
    }
  };
  app.initialize();
})(this);
