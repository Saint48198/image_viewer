(function (window) {
  "use strict";
  function define () {
    var View = function (options) {
      this.initialize.apply(this, arguments);
    };

    View.getTemplate = function () {

    };

    View.prototype.initialize = function (options) {
      for(var key in options) {
        this[key] = options[key];
      }
    };

    View.prototype.render = function(action) {
      if (window.templateStore) {

      }
    }

    return View;
  };


  if (typeof (View) === 'undefined') {
    window.View = define();
  }

})(window);
