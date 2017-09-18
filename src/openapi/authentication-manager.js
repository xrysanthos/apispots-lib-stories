/**
 * Authentication management service.
 *
 * @author Chris Spiliotopoulos
 */
import _ from 'lodash';


export default (function() {

  /*
   * Private
   */

  /**
   * Returns a stored set of credentials.
   * @param  {[type]} specUrl [description]
   * @param  {[type]} name    [description]
   * @return {[type]}         [description]
   */
  const _getCredentials = function(specUrl, name) {

    return new Promise((resolve) => {

      resolve();
    });
  };


  return {

    /*
     * Public
     */
    getCredentials: _getCredentials

  };

}());
