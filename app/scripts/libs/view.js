(function (window) {
  "use strict";
  function define() {
    var httpRequest;

    var convertToDom = function (htmlString) {
      var wrapper = document.createElement("div");
      wrapper.innerHTML = htmlString;

      return wrapper.childNodes;
    };

    // ref - http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
    var templateEngine = function(html, options) {
      var re = /<%(.+?)%>/g;
      var reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g;
      var code = 'with(obj) { var r=[];\n';
      var cursor = 0;
      var result;
      var match;
      var add = function(line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
          (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
      };

      while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
      }

      add(html.substr(cursor, html.length - cursor));

      code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');

      try {
        result = new Function('obj', code).apply(options, [options]);
      } catch(err) {
        console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
      }

      return result;
    };

    var View = function (options) {
      this.initialize.apply(this, arguments);
    };

    View.prototype.initialize = function (options) {
      for (var key in options) {
        this[key] = options[key];
      }

      if (typeof (this.onIntitialize) !== 'undefined') {
        this.onIntitialize.call(this);
      }
    };

    View.prototype.render = function () {
      // get template html string via ajax call if it
      if (!window.templateStore[this.template]) {
        this.getTemplate(this.template);
        return false;
      }

      if (typeof (this.onRender) !== 'undefined') {
        this.onRender.call(this);
      }
    };

    View.prototype.getTemplate = function (templateString) {

      if (typeof(templateString) === 'undefined') {
        return false;
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

    View.prototype.handleTemplateRequest = function () {
      // call is done
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        // call is successful
        if (httpRequest.status === 200) {
          this.appendTemplateToPage(httpRequest.responseText);
          window.templateStore[this.template];
          this.render();
        } else {
          alert('There was a problem with the request.');
        }
      }
    };

    View.prototype.appendTemplateToPage = function (htmlString) {
      var html = convertToDom(htmlString);
      // update the template store with the new template
      window.templateStore[this.template] = html;

      // append the html template to the end of the body
      for(var i = 0; i < html.length; i++) {
        document.getElementsByTagName("body")[0].appendChild(html[i]);
      }

    };

    View.prototype.replaceWithTemplate = function(templateId, containerElement, context) {
      var template = document.getElementById(templateId);
      var html;

      if (template) {
        html = templateEngine(template.innerHTML, context);
        containerElement.innerHTML = html;
      }
    };

    View.prototype.appendUsingTemplate = function (templateId, containerElement, context) {
      var template = document.getElementById(templateId);
      var html;

      if (template) {
        html = convertToDom(templateEngine(template.innerHTML, context).trim());
        containerElement.appendChild(html[0]);
      }
    };
    return View;
  };


  if (typeof (View) === 'undefined') {
    window.View = define();
  }

})(window);
