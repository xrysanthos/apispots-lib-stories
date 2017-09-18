'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * OpenAPI definition
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Chris Spiliotopoulos
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _swaggerClient = require('swagger-client');

var _swaggerClient2 = _interopRequireDefault(_swaggerClient);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _waterfall = require('async/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _apiDefinitionSwagger = require('./api-definition-swagger');

var _apiDefinitionSwagger2 = _interopRequireDefault(_apiDefinitionSwagger);

var _apiDefinitionOpenapi = require('./api-definition-openapi');

var _apiDefinitionOpenapi2 = _interopRequireDefault(_apiDefinitionOpenapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiDefinitionLoader = function () {
  function ApiDefinitionLoader() {
    _classCallCheck(this, ApiDefinitionLoader);
  }

  _createClass(ApiDefinitionLoader, null, [{
    key: 'load',


    /**
     * Loads a valid OpenAPI definition
     * from the provided URI and returns
     * the Swagger API instance.
     * @param  {[type]} url  [description]
     * @param  {[type]} spec [description]
     * @return {[type]}      [description]
     */
    value: function load() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          url = _ref.url,
          spec = _ref.spec;

      return new Promise(function (resolve, reject) {

        try {

          // URI cannot be empty
          if (_lodash2.default.isEmpty(url) && _lodash2.default.isEmpty(spec)) {
            throw new Error('Either a URI or a valid Swagger spec should be provided');
          }

          // if spec is provided as a string,
          // convert it to an object
          if (typeof spec === 'string') {
            spec = _jsYaml2.default.load(spec);
          }

          // try to resolve the API definition
          // using either a URI or a spec
          new _swaggerClient2.default({
            url: url,
            spec: spec
          }).then(function (swagger) {

            // get the parsed spec instance
            var spec = swagger.spec;

            if (_lodash2.default.isEmpty(spec)) {
              reject(new Error('Invalid Open API specification'));
            } else {

              var api = null;

              // check the spec type
              if (_lodash2.default.has(spec, 'swagger')) {

                // this is the legacy Swagger 2 spec
                api = new _apiDefinitionSwagger2.default({
                  specUrl: url,
                  spec: spec
                });
              } else if (_lodash2.default.has(spec, 'openapi')) {
                // this is the new OpenAPI 3 spec
                api = new _apiDefinitionOpenapi2.default({
                  specUrl: url,
                  spec: spec
                });
              }

              // return the API instance
              resolve(api);
            }
          }, function (err) {
            reject(new Error(err.message));
          });
        } catch (e) {
          reject(e);
        }
      });
    }
  }]);

  return ApiDefinitionLoader;
}();

exports.default = ApiDefinitionLoader;