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

                  // show lightbox for hash id to allow bookmarking of large images
                  if (window.location.hash) {
                    pageView.displayLightBlock(parseInt(window.location.hash.substr(1)));
                  }
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
            pageView.displayLightBlock(parseInt(target.getAttribute("data-id")));
          }
        },

        displayLightBlock: function (id) {
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
          // remove the element attached to the lightbox and then the element from the dom
          // removing elements has poor performance. Refactor could do something smarter like use list of elements to store and just scroll through them
          // update the url to not have a hash
          if (document.getElementById("modal-image")) {
            document.getElementById("modal-image").removeEventListener("click", pageView.handleLightBoxClickEvents, false);
            pageView.removeElement("modal-image");
            pageView.removeHash();
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
            image.total = total + 1;
            image.number = id + 1;

            if (image) {
              pageView.replaceWithTemplate("template-lightboxContent", document.getElementById("container-content"), { data: image });
            }
          }


        },

        removeElement: function(id) {
          return (pageView.tmpElem = document.getElementById(id)).parentNode.removeChild(pageView.tmpElem);
        },

        removeHash: function  () {
          history.pushState("", document.title, window.location.pathname + window.location.search);
        }
      });

      pageView.render();
    }
  };
  app.initialize();
})(this);
