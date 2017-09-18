'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/**
 * Graph utilities
 *
 * @author Chris Spiliotopoulos
 */


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GraphUtils = function () {
  function GraphUtils() {
    _classCallCheck(this, GraphUtils);
  }

  _createClass(GraphUtils, null, [{
    key: 'findNode',


    /**
     * Finds a node in a tree
     * @param  {[type]} node [description]
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    value: function findNode(node, path) {

      if (node.path === path) {
        return node;
      } else if (node.children != null) {

        var result = null;
        for (var i = 0; result == null && i < node.children.length; i += 1) {
          result = GraphUtils.findNode(node.children[i], path);
        }
        return result;
      }
      return null;
    }

    /**
     * Traverses a tree depth-first.
     * @param  {[type]} node [description]
     * @param  {[type]} func [description]
     * @return {[type]}      [description]
     */

  }, {
    key: 'traverseDF',
    value: function traverseDF(node, func) {
      if (func) {
        func(node);
      }

      _lodash2.default.each(node.children, function (child) {
        GraphUtils.traverseDF(child, func);
      });
    }

    /**
     * Traverses a tree breadth-first.
     * @param  {[type]} node [description]
     * @param  {[type]} func [description]
     * @return {[type]}      [description]
     */

  }, {
    key: 'traverseBF',
    value: function traverseBF(node, func) {
      var q = [node];
      while (q.length > 0) {
        node = q.shift();
        if (func) {
          func(node);
        }

        _lodash2.default.each(node.children, function (child) {
          q.push(child);
        });
      }
    }
  }]);

  return GraphUtils;
}();

exports.default = GraphUtils;