(function (window) {
  "use strict";
  
  window.templateStore = {
    
  };
  
  var app = {
    initialize: function () {
      var page = new window.View({
        el: document.getElementById("page"),
        template: "/templates/page-template.html"
      });

      console.log(page);
    }
  };
  app.initialize();
})(this);
