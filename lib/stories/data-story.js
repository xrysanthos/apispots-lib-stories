'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/**
 * Data story model.
 *
 * @author Chris Spiliotopoulos
 */

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataStory = function () {

  /**
   * Constructor
   * @param  {[type]} [definition=null}={}] [description]
   * @return {[type]}                       [description]
   */
  function DataStory() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        definition = _ref.definition;

    _classCallCheck(this, DataStory);

    // parse any provided definition
    if (typeof definition !== 'undefined') {
      if (typeof definition === 'string') {
        this._definition = _jsYaml2.default.safeLoad(definition);
      } else if ((typeof definition === 'undefined' ? 'undefined' : _typeof(definition)) === 'object') {
        this._definition = definition;
      }
    } else {
      // instantiate with empty object
      this._definition = {
        parts: []
      };
    }
  }

  /**
   * Sets the story Id
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */


  _createClass(DataStory, [{
    key: 'toYAML',


    /**
     * Dumps the story in YAML format.
     * @return {[type]} [description]
     */
    value: function toYAML() {
      return _jsYaml2.default.safeDump(this._definition);
    }
  }, {
    key: 'id',
    set: function set(id) {
      this._definition.id = id;
    }

    /**
     * Returns the story Id
     * @return {[type]} [description]
     */
    ,
    get: function get() {
      return this._definition.id;
    }

    /**
     * Returns the story definition.
     * @return {[type]} [description]
     */

  }, {
    key: 'definition',
    get: function get() {
      return this._definition;
    }

    /**
     * Returns the parts of
     * a story definition.
     * @return {[type]} [description]
     */

  }, {
    key: 'parts',
    get: function get() {
      if (!this._definition) {
        throw new Error('Invalid story definition');
      }

      return this._definition.parts;
    }

    /**
     * Returns the Open API
     * spec URL.
     * @return {[type]} [description]
     */

  }, {
    key: 'spec',
    get: function get() {
      if (!this._definition) {
        throw new Error('Invalid story definition');
      }

      return this._definition.spec;
    }

    /**
     * Sets the API spec URL
     * within the story definition.
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    ,
    set: function set(url) {
      if (!this._definition) {
        throw new Error('Invalid story definition');
      }

      this._definition.spec = url;
    }
  }]);

  return DataStory;
}();

exports.default = DataStory;