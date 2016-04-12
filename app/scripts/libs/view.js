(function (window) {
  "use strict";
  function define() {
    var httpRequest;

    var View = function (options) {
      this.initialize.apply(this, arguments);
    };

    View.prototype.getTemplate = function (templateString) {

      if (typeof(templateString) === 'undefined') {
        return false;
      }

      // get template html string from template store if possible in order to reduce number of ajax calls
      if (typeof(window.templateStore) !== 'undefined') {
        if (window.templateStore[templateString]) {
          return window.templateStore[templateString];
        }
      }

      httpRequest = new XMLHttpRequest();

      if (!httpRequest) {
        // 'Giving up :( Cannot create an XMLHTTP instance'
        return false;
      }

      httpRequest.onreadystatechange = this.handleTemplateRequest.bind(this);
      httpRequest.open("GET", templateString);
      httpRequest.send();
    };

    View.prototype.initialize = function (options) {
      for (var key in options) {
        this[key] = options[key];
      }
    };

    View.prototype.render = function (action) {
      this.getTemplate(this.template);
    };

    View.prototype.handleTemplateRequest = function () {
      // call is done
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        // call is successful
        if (httpRequest.status === 200) {
          this.appendTemplateToPage(httpRequest.responseText);
          this.replaceWithTemplate(this.templateId, this.el, {});
        } else {
          alert('There was a problem with the request.');
        }
      }
    };

    View.prototype.appendTemplateToPage = function (htmlString) {
      var html = View.convertToDom(htmlString);

      // update the template store with the new template
      window.templateStore[this.template] = html;

      // append the html template to the end of the body
      document.getElementsByTagName("body")[0].appendChild(html);
    };

    View.prototype.replaceWithTemplate = function(templateId, containerElement) {
      var template = document.getElementById(templateId).innerHTML;

      if (templateId) {
        containerElement.innerHTML = template;
      }
    };

    View.convertToDom = function (htmlString) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = htmlString;

      return wrapper.firstChild;
    };

    return View;
  };


  if (typeof (View) === 'undefined') {
    window.View = define();
  }

})(window);
