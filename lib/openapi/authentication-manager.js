'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {

  /*
   * Private
   */

  /**
   * Returns a stored set of credentials.
   * @param  {[type]} specUrl [description]
   * @param  {[type]} name    [description]
   * @return {[type]}         [description]
   */
  var _getCredentials = function _getCredentials(specUrl, name) {

    return new Promise(function (resolve) {

      resolve();
    });
  };

  return {

    /*
     * Public
     */
    getCredentials: _getCredentials

  };
}(); /**
      * Authentication management service.
      *
      * @author Chris Spiliotopoulos
      */