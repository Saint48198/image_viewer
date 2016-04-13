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
          pageView.updateLightBoxImage("update", parseInt(id));

          document.getElementById("modal-image").addEventListener("click", pageView.handleLightBoxClickEvents);

        },

        handleLightBoxClickEvents: function (e) {
          var target = e.target;
          if (target.id === "modal-image" || target.id === "btn-close") {
            pageView.removeLightBox();
            return false;
          } else if (target.id === "btn-next") {
            pageView.updateLightBoxImage("next", parseInt(target.getAttribute("data-id")));
          } else if(target.id === "btn-previous") {
            pageView.updateLightBoxImage("previous", parseInt(target.getAttribute("data-id")));
          }
        },

        removeLightBox: function () {
          if (document.getElementById("modal-image")) {
            document.getElementById("modal-image").removeEventListener("click", pageView.handleLightBoxClickEvents, false);
            pageView.removeElement("modal-image");
          }
        },

        updateLightBoxImage: function(type, currentId) {
          var total = pageView.imagesCollection.items.length - 1; // ids are zero based
          var image;
          var id;

          if (type === "next" && typeof (currentId) !== 'undefined') {
            id = currentId + 1;
            // end of the line of images, next is the first image
            if (currentId === total) {
              id = 0;
            }

          } else if (type === "previous" && typeof (currentId) !== 'undefined') {
            id = currentId - 1;
            // at the beginning, go to the last image
            if (currentId === 0) {
              id = total;
            }
          } else {
            id = currentId;
          }

          if (typeof (id) !== 'undefined') {
            var image = pageView.imagesCollection.get(id);
            if (image) {
              pageView.replaceWithTemplate("template-lightboxContent", document.getElementById("container-content"), { data: image });
            }
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
