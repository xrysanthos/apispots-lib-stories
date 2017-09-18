'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _eachSeries = require('async/eachSeries');

var _eachSeries2 = _interopRequireDefault(_eachSeries);

var _waterfall = require('async/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _map = require('async/map');

var _map2 = _interopRequireDefault(_map);

var _swaggerClient = require('swagger-client');

var _swaggerClient2 = _interopRequireDefault(_swaggerClient);

var _apiDefinitionLoader = require('../openapi/api-definition-loader');

var _apiDefinitionLoader2 = _interopRequireDefault(_apiDefinitionLoader);

var _authenticationManager = require('../openapi/authentication-manager');

var _authenticationManager2 = _interopRequireDefault(_authenticationManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {

  /**
   * Plays a story.
   * @param  {[type]} story [description]
   * @return {[type]}       [description]
   */
  var _play = function _play(story) {

    return new Promise(function (resolve, reject) {
      try {

        // if story is empty throw an error
        if (_lodash2.default.isEmpty(story)) {
          throw new Error('Invalid story instance');
        }

        if (_lodash2.default.isEmpty(story.spec)) {
          throw new Error('Invalid Open API spec');
        }

        // pipeline tasks
        (0, _waterfall2.default)([function (cb) {

          // load the Open API definition
          // used by the story
          _apiDefinitionLoader2.default.load({
            url: story.spec
          }).then(function (api) {
            cb(null, api);
          });
        }, function (api, cb) {

          // map the story part to the API definition
          _lodash2.default.each(story.parts, function (part) {
            try {
              _validatePart(part, api);
            } catch (e) {
              // mark the part as invalid
              part.valid = false;
            }
          });

          cb(null, api);
        }, function (api, cb) {

          // keep only the valid story parts
          var valid = _lodash2.default.filter(story.parts, {
            valid: true
          });

          // go through all valid parts
          (0, _eachSeries2.default)(valid, function (part, done) {
            try {

              // play each part in turn
              _playPart(part, api).then(function (res) {

                // update the story with
                // the output
                var output = {
                  ok: res.ok,
                  status: res.status,
                  statusText: res.statusText,
                  headers: res.headers,
                  data: _lodash2.default.isEmpty(res.obj) ? undefined : res.obj,
                  text: _lodash2.default.isEmpty(res.text) ? undefined : res.text
                };

                // set the part's output section
                part.output = output;

                // part played
                done();
              }).catch(function (e) {

                var output = {
                  ok: false,
                  status: e.status,
                  statusText: e.message
                };

                // set the part's output section
                part.output = output;
                done();
              }).finally(function () {
                var opId = part.operationId;
                var output = part.output;

                if (output.ok && _lodash2.default.isEmpty(output.data) && !_lodash2.default.isEmpty(output.text)) {
                  output.data = output.text;
                }

                // resolve the status code to
                // a response description mappring
                // from the spec
                var statusText = api.getOperationResponseDescription(opId, output.status);

                if (!_lodash2.default.isEmpty(statusText)) {
                  output.statusText = statusText;
                }

                // check if the response has a
                // schema defined
                // const schema = api.getResponseSchemaDefinition(opId, output.status);
              });
            } catch (e) {
              console.error(e);
            }
          }, function (err) {

            // all parts have been played
            cb(err);
          });
        }], function (e) {

          if (e) {
            reject(e);
          } else {
            resolve();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  /**
   * Given an API definition and a story
   * part, it locates the operation by Id
   * and validates it according to the
   * spec and input data set.
   * @param  {[type]} story [description]
   * @param  {[type]} api   [description]
   * @return {[type]}       [description]
   */
  var _validatePart = function _validatePart(part, api) {

    // get the operation definition by Id
    var operation = api.getOperation(part.operationId);

    if (_lodash2.default.isEmpty(operation)) {
      throw new Error('Undefined operation ' + part.operationId);
    }

    // mark part as valid
    part.valid = true;
  };

  /**
   * Plays a story part.
   * @param  {[type]} part [description]
   * @return {[type]}      [description]
   */
  var _playPart = function _playPart(part, api) {

    return new Promise(function (resolve, reject) {

      var opId = part.operationId;
      var operation = api.getOperation(opId);
      var specUrl = api.specUrl;
      var securities = {};
      var params = {
        operationId: opId,
        parameters: part.input.parameters
      };

      // set the default request content type
      if (_lodash2.default.isEmpty(operation.consumes)) {
        // if no 'consumes' section is defined,
        // use 'application/json' as the default
        params.requestContentType = 'application/json';
      } else if (operation.consumes.length === 1) {
        params.requestContentType = operation.consumes[0];
      }

      // set the default request content type
      if (_lodash2.default.isEmpty(operation.produces)) {
        // if no 'produces' section is defined,
        // use 'application/json' as the default
        params.responseContentType = 'application/json';
      } else if (operation.produces.length === 1) {
        params.responseContentType = operation.produces[0];
      }

      // check the selected visualization
      // and enforce a response content type
      if (!_lodash2.default.isEmpty(part.visualization)) {

        if (part.visualization.type === 'json') {
          params.responseContentType = 'application/json';
        } else if (part.visualization.type === 'xml') {
          params.responseContentType = 'application/xml';
        } else if (part.visualization.type === 'csv') {
          params.responseContentType = 'application/csv';
        }
      }

      (0, _waterfall2.default)([function (cb) {

        /*
         * securities
         */
        if (!_lodash2.default.isEmpty(operation.security)) {

          // check if credentials are provided
          (0, _map2.default)(operation.security, function (entry, done) {

            var name = _lodash2.default.keys(entry)[0];

            _authenticationManager2.default.getCredentials(specUrl, name).then(function (credentials) {

              if (!_lodash2.default.isEmpty(credentials)) {

                // add the credentials to the settings
                if (credentials.type === 'basic') {

                  securities[name] = {
                    username: credentials.username,
                    password: credentials.password
                  };
                }
              }

              done();
            });
          }, function (e) {

            if (e) {
              console.error(e);
            }

            // all securities inspected
            cb();
          });
        } else {
          cb();
        }
      }], function () {

        (0, _swaggerClient2.default)({
          spec: api.spec
        }).then(function (client) {

          // set authorizations
          client.authorizations = securities;

          // execute the API operation
          // using the client interface
          client.execute(params).then(function (res) {
            resolve(res);
          }).catch(function (e) {
            reject(e);
          });
        });
      });
    });
  };

  return {

    /*
     * Public
     */
    play: _play
  };
}(); /**
      * Story player service.
      *
      * @author Chris Spiliotopoulos
      */