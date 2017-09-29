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

  /**
   * Sets a list of allowed verbs
   * @param  {[type]} verbs [description]
   * @return {[type]}       [description]
   */
  set allowedVerbs(verbs) {

    // if string convert to array
    if (typeof verbs === 'string') {
      verbs = [verbs];
    }

    this._allowedVerbs = verbs;
  }

  /**
   * Retuns the list of allowed
   * verbs.
   * @return {[type]} [description]
   */
  get allowedVerbs() {
    return this._allowedVerbs;
  }


  /**
   * Methods to be implemented by subclasses
   */

  get title() {
    throw new Error('Should be implemented by subclass');
  }

  get schemas() {
    throw new Error('Should be implemented by subclass');
  }

  get paths() {
    throw new Error('Should be implemented by subclass');
  }

  get operations() {
    throw new Error('Should be implemented by subclass');
  }

  get operationsBySummary() {
    throw new Error('Should be implemented by subclass');
  }

  get operationsByPath() {
    throw new Error('Should be implemented by subclass');
  }

  get securities() {
    throw new Error('Should be implemented by subclass');
  }

  get pathsGraph() {
    throw new Error('Should be implemented by subclass');
  }

  get tags() {
    throw new Error('Should be implemented by subclass');
  }

  getDefinition() {
    throw new Error('Should be implemented by subclass');
  }

  getOperation() {
    throw new Error('Should be implemented by subclass');
  }

  filterOperations() {
    throw new Error('Should be implemented by subclass');
  }

  path() {
    throw new Error('Should be implemented by subclass');
  }

  getOperationResponseDescription() {
    throw new Error('Should be implemented by subclass');
  }

  getResponseSchemaDefinition() {
    throw new Error('Should be implemented by subclass');
  }

}
