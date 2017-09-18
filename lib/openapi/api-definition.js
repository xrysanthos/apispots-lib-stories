"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * OpenAPI definition
 *
 * @author Chris Spiliotopoulos
 */

var ApiDefinition = function () {

  /**
   * Creates a new ApiDefinition instance
   * using the OpenAPI definition.
   * @param  {[type]} openapi [description]
   * @return {[type]}         [description]
   */
  function ApiDefinition(_ref) {
    var specUrl = _ref.specUrl,
        spec = _ref.spec;

    _classCallCheck(this, ApiDefinition);

    this._specUrl = specUrl;
    this._spec = spec;
  }

  /**
   * Sets the spec URL.
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */


  _createClass(ApiDefinition, [{
    key: "specUrl",
    set: function set(url) {
      this._specUrl = url;
    }

    /**
     * Returns the spec URL.
     * @return {[type]} [description]
     */
    ,
    get: function get() {
      return this._specUrl;
    }

    /**
     * Returns the Open API client instance.
     * @return {[type]} [description]
     */

  }, {
    key: "client",
    get: function get() {
      return this.openapi;
    }

    /**
     * Returns the API spec
     * @return {[type]} [description]
     */

  }, {
    key: "spec",
    get: function get() {
      return this._spec;
    }
  }]);

  return ApiDefinition;
}();

exports.default = ApiDefinition;