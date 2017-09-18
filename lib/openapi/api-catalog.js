'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/**
 * OpenAPI catalog.
 *
 * @author Chris Spiliotopoulos
 */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiCatalog = function () {
  function ApiCatalog() {
    _classCallCheck(this, ApiCatalog);
  }

  _createClass(ApiCatalog, [{
    key: 'apis',


    /**
     * Sets the internall collection
     * of APIs.
     * @param  {[type]}  apis [description]
     * @return {Boolean}      [description]
     */
    set: function set(apis) {
      this._apis = apis;
      this._apis = _lodash2.default.sortBy(apis, 'title');
    }

    /**
     * Returns the list of APIs
     * @return {Boolean} [description]
     */
    ,
    get: function get() {
      return this._apis;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    },
    set: function set(value) {
      this._name = value;
    }
  }, {
    key: 'description',
    get: function get() {
      return this._description;
    },
    set: function set(value) {
      this._description = value;
    }
  }, {
    key: 'image',
    get: function get() {
      return this._image;
    },
    set: function set(value) {
      this._image = value;
    }
  }, {
    key: 'created',
    get: function get() {
      return this._created;
    },
    set: function set(value) {
      this._created = value;
    }
  }, {
    key: 'modified',
    get: function get() {
      return this._modified;
    },
    set: function set(value) {
      this._modified = value;
    }
  }, {
    key: 'tags',
    get: function get() {
      return this._tags;
    },
    set: function set(value) {
      this._tags = value;
    }
  }, {
    key: 'include',
    get: function get() {
      return this._include;
    },
    set: function set(value) {
      this._include = value;
    }
  }, {
    key: 'maintainers',
    get: function get() {
      return this._maintainers;
    },
    set: function set(value) {
      this._maintainers = value;
    }
  }, {
    key: 'url',
    get: function get() {
      return this._url;
    },
    set: function set(value) {
      this._url = value;
    }

    /**
     * Returns the length of the catalog.
     * @return {[type]} [description]
     */

  }, {
    key: 'length',
    get: function get() {
      if (_lodash2.default.isEmpty(this._apis)) {
        return 0;
      }

      return this._apis.length;
    }

    /**
     * Returns a collection
     * of API categories.
     * @return {[type]} [description]
     */

  }, {
    key: 'categories',
    get: function get() {
      if (_lodash2.default.isEmpty(this._apis)) {
        return [];
      }

      // get an array of categories
      var categories = _lodash2.default.map(this._apis, function (o) {
        return o.categories;
      });
      categories = _lodash2.default.flattenDeep(categories);
      categories = _lodash2.default.compact(categories);
      categories = _lodash2.default.uniq(categories);
      categories = _lodash2.default.sortBy(categories);

      return categories;
    }
  }]);

  return ApiCatalog;
}();

exports.default = ApiCatalog;