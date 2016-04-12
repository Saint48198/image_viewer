(function (window) {
  "use strict";

  window.templateStore = {

  };

  var app = {
    initialize: function () {
      var pageView = new window.View({
        el: document.getElementById("page"),
        template: "/templates/page-template.html",
        templateId: "template-page",
        context: {
          copyYear: new Date().getFullYear()
        }
      });

      pageView.render();
    }
  };
  app.initialize();
})(this);
