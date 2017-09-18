'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/**
 * OpenAPI catalog entry class.
 *
 * @author Chris Spiliotopoulos
 */


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiCatalogEntry = function () {
  function ApiCatalogEntry() {
    _classCallCheck(this, ApiCatalogEntry);
  }

  _createClass(ApiCatalogEntry, [{
    key: 'getProperty',


    /**
     * Searches the properties
     * collection for the given property
     * name and if found, returns its value.
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    value: function getProperty(value) {
      if (_lodash2.default.isEmpty(this._properties)) {
        return null;
      }

      // try to find the property by name
      var filtered = _lodash2.default.filter(this._properties, function (o) {
        if (o.type.toLowerCase() === value.toLowerCase()) {
          return true;
        }
        return false;
      });

      if (_lodash2.default.isEmpty(filtered) || filtered.length === 0) {
        return null;
      }

      // return the first element only
      var prop = filtered[0];

      // return the value
      return prop.url;
    }
  }, {
    key: 'id',
    get: function get() {
      return this._id;
    },
    set: function set(value) {
      this._id = value;
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
    key: 'humanURL',
    get: function get() {
      return this._humanURL;
    },
    set: function set(value) {
      this._humanURL = value;
    }
  }, {
    key: 'baseURL',
    get: function get() {
      return this._baseURL;
    },
    set: function set(value) {
      this._baseURL = value;
    }
  }, {
    key: 'categories',
    get: function get() {
      return this._categories;
    },
    set: function set(value) {
      this._categories = value;
    }
  }, {
    key: 'properties',
    get: function get() {
      return this._properties;
    },
    set: function set(value) {
      this._properties = value;
    }
  }, {
    key: 'contacts',
    get: function get() {
      return this._contacts;
    },
    set: function set(value) {
      this._contacts = value;
    }
  }, {
    key: 'version',
    get: function get() {
      return this._version;
    },
    set: function set(value) {
      this._version = value;
    }
  }, {
    key: 'spec',
    get: function get() {

      // first check if the member is
      // explicitly set
      if (!_lodash2.default.isEmpty(this._spec)) {
        return this._spec;
      }

      // if not, check if some specific property is set
      if (!_lodash2.default.isEmpty(this.getProperty('x-openapi-spec'))) {
        return this.getProperty('x-openapi-spec');
      }

      // no spec found
      return null;
    },
    set: function set(value) {
      this._spec = value;
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
    key: 'provider',
    get: function get() {
      return this._provider;
    },
    set: function set(value) {
      this._provider = value;
    }
  }]);

  return ApiCatalogEntry;
}();

exports.default = ApiCatalogEntry;