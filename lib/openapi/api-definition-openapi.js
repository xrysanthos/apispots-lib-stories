'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _apiDefinition = require('./api-definition');

var _apiDefinition2 = _interopRequireDefault(_apiDefinition);

var _utilsGraph = require('../utils/utils-graph');

var _utilsGraph2 = _interopRequireDefault(_utilsGraph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Legacy Swagger 2 API definition.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Chris Spiliotopoulos
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var OpenApiDefinition = function (_ApiDefinition) {
  _inherits(OpenApiDefinition, _ApiDefinition);

  function OpenApiDefinition() {
    _classCallCheck(this, OpenApiDefinition);

    return _possibleConstructorReturn(this, (OpenApiDefinition.__proto__ || Object.getPrototypeOf(OpenApiDefinition)).apply(this, arguments));
  }

  _createClass(OpenApiDefinition, [{
    key: 'getDefinition',


    /**
     * Returns a definition by Id.
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    value: function getDefinition(id) {

      if (_lodash2.default.isEmpty(this.spec.components) || _lodash2.default.isEmpty(this.spec.components.schemas) || _lodash2.default.isEmpty(this.spec.components.schemas[id])) {
        return null;
      }

      // get the original spec definition
      var definition = _lodash2.default.cloneDeep(this.spec.components.schemas[id]);

      // enrich it
      if (_lodash2.default.isEmpty(definition.properties)) {
        delete definition.properties;
      } else {
        _lodash2.default.each(definition.properties, function (o, key) {

          o.name = key;

          // check if the prop is a ref
          if (typeof o.$$ref !== 'undefined') {
            // enrich the model with the reference Id
            var _id = o.$$ref.replace('#/components/schemas/', '');
            o.type = _id;
          }

          // process array of definitions
          if (o.type === 'array') {
            if (!_lodash2.default.isEmpty(o.items) && !_lodash2.default.isEmpty(o.items.$$ref)) {
              var _id2 = o.items.$$ref.replace('#/components/schemas/', '');
              o.items.type = _id2;
            }
          }

          // check for required properties
          if (_lodash2.default.includes(definition.required, o.name)) {
            o.required = true;
          }
        });
      }

      // return the definition
      return definition;
    }

    /**
     * Returns an API operation
     * by Id.
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */

  }, {
    key: 'getOperation',
    value: function getOperation(id) {
      if (_lodash2.default.isEmpty(id)) {
        return null;
      }

      var operation = null;

      _lodash2.default.each(this.spec.paths, function (entry, path) {
        _lodash2.default.each(entry, function (op, verb) {
          if (op.operationId === id) {
            operation = op;
            operation.path = path;
            operation.verb = verb;
          }
        });
      });

      return operation;
    }

    /**
     * Returns a sorted list of
     * API paths.
     * @return {[type]} [description]
     */

  }, {
    key: 'path',


    /**
     * Returns the definition of
     * the path item with the provided
     * Id.
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    value: function path(id) {
      if (_lodash2.default.isEmpty(this.spec.paths)) {
        throw new Error('No paths have been defined in spec');
      }

      var paths = this.spec.paths;
      var match = _lodash2.default.find(paths, function (o, key) {
        return _lodash2.default.trimEnd(key, '/') === _lodash2.default.trimEnd(id, '/');
      });

      if (_lodash2.default.isEmpty(match)) {
        throw new Error('Undefined path');
      }

      var definition = _lodash2.default.cloneDeep(match);

      // process operations
      _lodash2.default.each(definition, function (o) {

        // process request body payload
        if (_lodash2.default.has(o, 'requestBody')) {}

        // get the request body definition
        // const requestBody = o.requestBody;

        // if ((typeof p.schema !== 'undefined') &&
        //   (typeof p.schema.$$ref !== 'undefined')) {
        //   const schema = p.schema.$$ref.replace('#/components/schemas/', '');
        //   p.schema = schema;
        //   p.hasSchema = true;
        //
        // } else if ((typeof p.schema !== 'undefined') &&
        //   (typeof p.schema.items !== 'undefined') &&
        //   (typeof p.schema.items.$$ref !== 'undefined')) {
        //   const schema = p.schema.items.$$ref.replace('#/components/schemas/', '');
        //   p.type = p.schema.type;
        //   p.schema = schema;
        //   p.hasSchema = true;
        // }


        // process responses
        o.responses = _lodash2.default.map(o.responses, function (o, key) {
          var obj = {
            code: key,
            description: o.description
          };

          if (typeof o.schema !== 'undefined') {
            obj.type = o.schema.type;

            // is this a collection of objects?
            if (typeof o.schema.items !== 'undefined' && typeof o.schema.items.$$ref !== 'undefined') {
              obj.schema = o.schema.items.$$ref.replace('#/definitions/', '');
            } else {
              obj.schema = o.schema.$$ref.replace('#/definitions/', '');
            }
          }

          return obj;
        });
      });

      return definition;
    }

    /**
     * Returns a list of all API
     * operations.
     * @return {[type]} [description]
     */

  }, {
    key: 'title',


    /**
     * Returns the API title.
     * @return {[type]} [description]
     */
    get: function get() {
      return this.spec.info.title;
    }

    /**
     * Returns the list of
     * defined schema definitions.
     * @return {[type]} [description]
     */

  }, {
    key: 'schemas',
    get: function get() {

      if (_lodash2.default.isEmpty(this.spec.components) && _lodash2.default.isEmpty(this.spec.components.schemas)) {
        return null;
      }

      var schemas = _lodash2.default.chain(_lodash2.default.cloneDeep(this.spec.components.schemas)).map(function (o, key) {
        o.name = key;
        return o;
      }).sortBy('name').value();

      return schemas;
    }
  }, {
    key: 'paths',
    get: function get() {
      var paths = _lodash2.default.chain(this.spec.paths).map(function (o, path) {
        var obj = {
          path: path,
          verbs: _lodash2.default.keys(o).sort()
        };

        return obj;
      }).sortBy().value();

      return paths;
    }

    /**
     * Returns the graph of paths
     * grouped at resource level.
     * @return {[type]} [description]
     */

  }, {
    key: 'pathsGraph',
    get: function get() {
      var _this2 = this;

      var tree = {
        name: '',
        path: '/',
        children: []
      };

      // iterate all paths
      _lodash2.default.each(this.spec.paths, function (o, path) {

        // trim last '/' if there
        path = _lodash2.default.trimEnd(path, '/');

        // get the path definition
        var def = _this2.path(path);

        // get the operations
        var verbs = _lodash2.default.keys(def);

        // split the path into parts
        var parts = _lodash2.default.split(path, '/');

        // get the 1st level resource group
        var group = parts[1];

        // iterate through all parts and ensure
        // that nodes exist on the tree
        var pathPointer = void 0;
        _lodash2.default.each(parts, function (o, idx) {
          pathPointer = _lodash2.default.slice(parts, 0, idx + 1).join('/');

          if (pathPointer === '') {
            pathPointer = '/';
          }

          // check if the node already exists
          var node = _utilsGraph2.default.findNode(tree, pathPointer);

          if (!node) {

            // get the parent path
            var parentPath = '';

            if (pathPointer !== '/') {
              parentPath = _lodash2.default.slice(parts, 0, idx).join('/');
              parentPath = parentPath === '' ? '/' : parentPath;
            }

            var parent = _utilsGraph2.default.findNode(tree, parentPath);

            if (parent) {
              // add it as a child node
              var _node = {
                name: parts[idx],
                path: pathPointer,
                operations: verbs,
                part: parts[idx],
                parent: parent.path,
                group: group
              };

              if (_lodash2.default.isEmpty(parent.children)) {
                parent.children = [];
              }
              parent.children.push(_node);
            }
          }
        });
      });

      return tree;
    }
  }, {
    key: 'operations',
    get: function get() {
      if (_lodash2.default.isEmpty(this.spec.paths)) {
        throw new Error('No paths have been defined in spec');
      }

      var paths = this.spec.paths;
      var operations = [];

      _lodash2.default.each(paths, function (entry, path) {
        _lodash2.default.each(entry, function (op, verb) {
          op.path = path;
          op.verb = verb;
          operations.push(op);
        });
      });

      return operations;
    }

    /**
     * Returns a compact list
     * of operations by summary and
     * Id.
     * @return {[type]} [description]
     */

  }, {
    key: 'operationsBySummary',
    get: function get() {

      var ops = this.operations;

      var res = _lodash2.default.chain(ops).map(function (o) {

        // return a compact version of the operation
        var obj = {
          id: o.operationId,
          path: o.path,
          verb: o.verb,
          summary: o.summary,
          description: _lodash2.default.isEmpty(o.description) ? o.summary : o.description
        };
        return obj;
      })
      // sort by summary text
      .sortBy(['summary']).value();

      return res;
    }

    /**
     * Returns a compact list
     * of operations grouped by path.
     * @return {[type]} [description]
     */

  }, {
    key: 'operationsByPath',
    get: function get() {

      var ops = this.operationsBySummary;

      var res = _lodash2.default.chain(ops)
      // group by path
      .sortBy(['path']).groupBy('path').value();

      return res;
    }

    /**
     * Returns the list of security
     * definitions.
     * @return {[type]} [description]
     */

  }, {
    key: 'securities',
    get: function get() {

      var definitions = _lodash2.default.cloneDeep(this.spec.components.securitySchemes);

      // supported types so far
      var supported = ['basic', 'apiKey'];

      // check if type is supported
      _lodash2.default.each(definitions, function (o, key) {

        // the security definition name
        o.name = key;
        o.type = o.type;

        // TODO: To be removed in the future
        // in the case of HTTP type with BASIC scheme,
        // set the type as 'basic' for compatibility
        if (o.type === 'http') {
          o.type = 'basic';
        }

        if (_lodash2.default.includes(supported, o.type)) {
          o.supported = true;
        }

        // if type is 'basic' there are
        // no properties
        if (o.type !== 'basic') {
          o.hasProperties = true;
        }
      });

      return definitions;
    }
  }]);

  return OpenApiDefinition;
}(_apiDefinition2.default);

exports.default = OpenApiDefinition;