/**
 * Story player service.
 *
 * @author Chris Spiliotopoulos
 */
import _ from 'lodash';
import asyncEachSeries from 'async/eachSeries';
import asyncWaterfall from 'async/waterfall';
import asyncMap from 'async/map';
import Swagger from 'swagger-client';

import ApiDefinitionLoader from '../openapi/api-definition-loader';


export default (function() {

  let _credentialsManager = null;

  /**
   * Sets an instance of a specific
   * credentials manager implementation.
   * @param {[type]} manager [description]
   */
  const _setCredentialsManager = (manager) => {
    _credentialsManager = manager;
  };

  /**
   * Plays a story.
   * @param  {[type]} story [description]
   * @return {[type]}       [description]
   */
  const _play = function(story) {

    return new Promise((resolve, reject) => {
      try {

        // if story is empty throw an error
        if (_.isEmpty(story)) {
          throw new Error('Invalid story instance');
        }

        if (_.isEmpty(story.spec)) {
          throw new Error('Invalid Open API spec');
        }

        // pipeline tasks
        asyncWaterfall([

          (cb) => {

            // load the Open API definition
            // used by the story
            ApiDefinitionLoader.load({
              url: story.spec
            })
              .then(api => {
                cb(null, api);
              });
          },

          (api, cb) => {

            // map the story part to the API definition
            _.each(story.parts, (part) => {
              try {
                _validatePart(part, api);
              } catch (e) {
                // mark the part as invalid
                part.valid = false;
              }
            });

            cb(null, api);
          },

          (api, cb) => {

            // keep only the valid story parts
            const valid = _.filter(story.parts, {
              valid: true
            });

            // go through all valid parts
            asyncEachSeries(valid, (part, done) => {
              try {

                // play each part in turn
                _playPart(part, api)
                  .then((res) => {

                    // update the story with
                    // the output
                    const output = {
                      ok: res.ok,
                      status: res.status,
                      statusText: res.statusText,
                      headers: res.headers,
                      data: (_.isEmpty(res.obj) ? undefined : res.obj),
                      text: (_.isEmpty(res.text) ? undefined : res.text)
                    };

                    // check if response contains a Blob
                    if (res.data instanceof Blob) {
                      output.data = res.data;
                    }

                    // set the part's output section
                    part.output = output;

                    // part played
                    done();
                  })
                  .catch(e => {

                    const output = {
                      ok: false,
                      status: e.status,
                      statusText: e.message
                    };

                    if (typeof e.response !== 'undefined') {
                      output.statusText = `${output.statusText} [${e.response.text}]`;
                    }

                    // set the part's output section
                    part.output = output;
                    done();
                  })
                  .finally(() => {
                    const opId = part.operationId;
                    const output = part.output;

                    if (output.ok && (_.isEmpty(output.data)) && (!_.isEmpty(output.text))) {
                      output.data = output.text;
                    }

                    // resolve the status code to
                    // a response description mappring
                    // from the spec
                    const statusText = api.getOperationResponseDescription(opId, output.status);

                    if (!_.isEmpty(statusText)) {
                      output.statusText = statusText;
                    }

                  });

              } catch (e) {
                console.error(e);
              }
            }, (err) => {

              // all parts have been played
              cb(err);
            });
          }

        ], (e) => {

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
  const _validatePart = function(part, api) {

    // get the operation definition by Id
    const operation = api.getOperation(part.operationId);

    if (_.isEmpty(operation)) {
      throw new Error(`Undefined operation ${part.operationId}`);
    }

    // mark part as valid
    part.valid = true;
  };


  /**
   * Plays a story part.
   * @param  {[type]} part [description]
   * @return {[type]}      [description]
   */
  const _playPart = function(part, api) {

    return new Promise((resolve, reject) => {

      const opId = part.operationId;
      const operation = api.getOperation(opId);
      const specUrl = api.specUrl;
      const securities = {};
      const params = {
        operationId: opId
      };

      // set payload
      if (!_.isEmpty(part.input.parameters)) {
        // if the input has a 'parameters' section,
        // use this as the payload
        params.parameters = part.input.parameters;
      }

      // set the content type of the request
      if (_.isEmpty(part.input.contentType)) {

        // if there is no explicitly set
        // content type, try to use a default
        if (_.isEmpty(operation.consumes)) {
          // if no 'consumes' section is defined,
          // use 'application/json' as the default
          params.requestContentType = 'application/json';
        } else if (operation.consumes.length === 1) {
          params.requestContentType = operation.consumes[0];
        }
      } else {
        // use the one set on the part
        params.requestContentType = part.input.contentType;
      }

      // set the default request content type
      if (_.isEmpty(operation.produces)) {
        // if no 'produces' section is defined,
        // use 'application/json' as the default
        params.responseContentType = 'application/json';
      } else if (operation.produces.length === 1) {
        params.responseContentType = operation.produces[0];
      }

      // check the selected visualization
      // and enforce a response content type
      if (!_.isEmpty(part.visualization)) {

        if (part.visualization.type === 'json') {
          params.responseContentType = 'application/json';
        } else if (part.visualization.type === 'xml') {
          params.responseContentType = 'application/xml';
        } else if (part.visualization.type === 'csv') {
          params.responseContentType = 'application/csv';
        }
      }

      asyncWaterfall([

        (cb) => {

          /*
           * securities
           */
          if (!_.isEmpty(operation.security)) {

            if (_credentialsManager) {
              // check if credentials are provided
              asyncMap(operation.security, (entry, done) => {

                const name = _.keys(entry)[0];

                _credentialsManager.getCredentials(specUrl, name)
                  .then(credentials => {

                    if (!_.isEmpty(credentials)) {

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
              }, (e) => {

                if (e) {
                  console.error(e);
                }

                // all securities inspected
                cb();
              });
            } else {
              cb(new Error('Part requires authentication but no credentials manager found'));
            }

          } else {
            cb();
          }
        }

      ], (err) => {

        if (err) {
          reject(err);
        } else {

          Swagger({
            spec: api.spec
          })
            .then(client => {

              // set authorizations
              client.authorizations = securities;

              // execute the API operation
              // using the client interface
              client.execute(params)
                .then((res) => {
                  resolve(res);
                })
                .catch((e) => {
                  reject(e);
                });
            });
        }
      });
    });
  };

  return {

    /*
     * Public
     */
    play: _play,
    setCredentialsManager: _setCredentialsManager
  };

}());
