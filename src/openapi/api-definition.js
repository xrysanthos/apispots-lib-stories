/**
 * OpenAPI definition
 *
 * @author Chris Spiliotopoulos
 */

export default class ApiDefinition {

  /**
   * Creates a new ApiDefinition instance
   * using the OpenAPI definition.
   * @param  {[type]} openapi [description]
   * @return {[type]}         [description]
   */
  constructor({
    specUrl,
    spec
  }) {

    this._specUrl = specUrl;
    this._spec = spec;
  }


  /**
   * Sets the spec URL.
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  set specUrl(url) {
    this._specUrl = url;
  }

  /**
   * Returns the spec URL.
   * @return {[type]} [description]
   */
  get specUrl() {
    return this._specUrl;
  }

  /**
   * Returns the Open API client instance.
   * @return {[type]} [description]
   */
  get client() {
    return this.openapi;
  }

  /**
   * Returns the API spec
   * @return {[type]} [description]
   */
  get spec() {
    return this._spec;
  }


}
