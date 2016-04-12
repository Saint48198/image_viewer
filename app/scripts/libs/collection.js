(function (window) {
  "use strict";
  function define() {
    var req;

    var Collection = function (options) {
      this.initialize.apply(this, arguments);
    };

    Collection.prototype.initialize = function (options) {
      for (var key in options) {
        this[key] = options[key];
      }

      if (typeof (this.onIntitialize) !== 'undefined') {
        this.onIntitialize.call(this);
      }
    };

    Collection.prototype.items = [],

    Collection.prototype.fetch = function (data) {
      if(XMLHttpRequest) {
        req = new XMLHttpRequest();

        if('withCredentials' in req) {
          if (!req) {
            // 'Giving up :( Cannot create an XMLHTTP instance'
            return false;
          }

          if (this.error) {
            req.onerror = this.error;
          }


          req.onreadystatechange = this.handleServiceRequest.bind(this);
          req.open("GET", this.url, true);
          req.send(data);
        }
      } else if (XDomainRequest) {
        req = new XDomainRequest();
        req.open("GET", this.url, true);

        if (this.error) {
          req.onerror = this.error;
        }


        req.onload = this.handleServiceRequest.bind(this);
        req.send(data);
      }

    };

    Collection.prototype.handleServiceRequest = function () {
      // call is done
      if (req.readyState === XMLHttpRequest.DONE) {
        // call is successful
        if (req.status === 200) {
          this.parse(JSON.parse(req.responseText));

        } else {
          if (this.error) {
            this.error.call(this);
          } else {
            alert('There was a problem with the request.');
          }
        }
      }
    };

    Collection.prototype.parse = function(resp) {
      console.log(resp);
      if (resp.photos) {
        resp.photos.photo.forEach(function (node, index) {
          this.items.push({ id: index, title: node.title, image: "https://farm2.staticflickr.com/" + node.server + "/" + node.id + "_" + node.secret + ".jpg" });
        }.bind(this));
      }

      if (this.success) {
        this.success.call(this, this.items);
      }
    };


    return Collection;
  };

  if (typeof (Collection) === 'undefined') {
    window.Collection = define();
  }

})(window);
