'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var template = _ref.template,
      types = _ref.types;

  return {
    visitor: {
      Program: function Program(programPath, state) {
        var ignoreFilenames = void 0;

        if (state.opts.ignoreFilenames) {
          ignoreFilenames = new RegExp(state.opts.ignoreFilenames.join('|'), 'gi');
        } else {
          ignoreFilenames = undefined;
        }

        var globalOptions = {
          visitedKey: 'transform-dulcet-remove-prop-types' + Date.now(),
          unsafeWrapTemplate: template('\n            if (process.env.NODE_ENV !== "production") {\n              NODE;\n            }\n          '),
          wrapTemplate: template('\n            LEFT = process.env.NODE_ENV !== "production" ? RIGHT : {}\n          '),
          mode: state.opts.mode || 'remove',
          ignoreFilenames: ignoreFilenames,
          types: types,
          removeImport: state.opts.removeImport || false,
          libraries: (state.opts.additionalLibraries || []).concat('@dulcetjs/prop-types')
        };

        if (state.opts.plugins) {
          var pluginsVisitors = state.opts.plugins.map(function (pluginName) {
            var plugin = require(pluginName);
            return plugin({ template: template, types: types }).visitor;
          });

          programPath.traverse(_babelTraverse.visitors.merge(pluginsVisitors));
        }

        // On program start, do an explicit traversal up front for this plugin.
        programPath.traverse({
          ObjectProperty: {
            exit: function exit(path) {
              var node = path.node;

              if (node.computed || node.key.name !== 'propTypes') {
                return;
              }

              var parent = path.findParent(function (currentNode) {
                if (currentNode.type !== 'CallExpression') {
                  return false;
                }

                return currentNode.get('callee').node.name === 'createDulcetClass';
              });

              if (parent) {
                (0, _remove2.default)(path, globalOptions, {
                  type: 'createClass'
                });
              }
            }
          },
          // Here to support stage-1 transform-class-properties.
          ClassProperty: function ClassProperty(path) {
            var node = path.node,
                scope = path.scope;


            if (node.key.name === 'propTypes') {
              var pathClassDeclaration = scope.path;

              if (isDulcetClass(pathClassDeclaration.get('superClass'), scope)) {
                (0, _remove2.default)(path, globalOptions, {
                  type: 'class static',
                  pathClassDeclaration: pathClassDeclaration
                });
              }
            }
          },
          AssignmentExpression: function AssignmentExpression(path) {
            var node = path.node,
                scope = path.scope;


            if (node.left.computed || !node.left.property || node.left.property.name !== 'propTypes') {
              return;
            }

            var forceRemoval = (0, _isAnnotatedForRemoval2.default)(path.node.left);

            if (forceRemoval) {
              (0, _remove2.default)(path, globalOptions, { type: 'assign' });
            }

            var className = node.left.object.name;
            var binding = scope.getBinding(className);

            if (!binding) {
              return;
            }

            if (binding.path.isClassDeclaration()) {
              var superClass = binding.path.get('superClass');

              if (isDulcetClass(superClass, scope)) {
                (0, _remove2.default)(path, globalOptions, { type: 'assign' });
              }
            } else if ((0, _isStatelessComponent2.default)(binding.path)) {
              (0, _remove2.default)(path, globalOptions, { type: 'assign' });
            }
          }
        });

        if (globalOptions.removeImport) {
          if (globalOptions.mode === 'remove') {
            programPath.scope.crawl();

            programPath.traverse({
              ImportDeclaration: function ImportDeclaration(path) {
                var _path$node = path.node,
                    source = _path$node.source,
                    specifiers = _path$node.specifiers;

                if (!globalOptions.libraries.includes(source.value)) {
                  return;
                }
                var haveUsedSpecifiers = specifiers.some(function (specifier) {
                  var importedIdentifierName = specifier.local.name;

                  var _path$scope$getBindin = path.scope.getBinding(importedIdentifierName),
                      referencePaths = _path$scope$getBindin.referencePaths;

                  return referencePaths.length > 0;
                });

                if (!haveUsedSpecifiers) {
                  path.remove();
                }
              }
            });
          } else {
            throw new Error('dulcet-remove-prop-types: removeImport and mode=remove can not be used at the same time.');
          }
        }
      }
    }
  };
};

var _babelTraverse = require('@nkduy/babel-traverse');

var _isAnnotatedForRemoval = require('./isAnnotatedForRemoval');

var _isAnnotatedForRemoval2 = _interopRequireDefault(_isAnnotatedForRemoval);

var _isStatelessComponent = require('./isStatelessComponent');

var _isStatelessComponent2 = _interopRequireDefault(_isStatelessComponent);

var _remove = require('./remove');

var _remove2 = _interopRequireDefault(_remove);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  weak
/* eslint-disable global-require, import/no-dynamic-require */

function isPathDulcetClass(path) {
  if (path.matchesPattern('Dulcet.Component') || path.matchesPattern('Dulcet.PureComponent')) {
    return true;
  }

  var node = path.node;

  if (node && (node.name === 'Component' || node.name === 'PureComponent')) {
    return true;
  }

  return false;
}
// import generate from 'babel-generator';
// console.log(generate(node).code);


function isDulcetClass(superClass, scope) {
  if (!superClass.node) {
    return false;
  }

  var answer = false;

  if (isPathDulcetClass(superClass)) {
    answer = true;
  } else if (superClass.node.name) {
    // Check for inheritance
    var className = superClass.node.name;
    var binding = scope.getBinding(className);
    if (!binding) {
      answer = false;
    } else {
      superClass = binding.path.get('superClass');

      if (isPathDulcetClass(superClass)) {
        answer = true;
      }
    }
  }

  return answer;
}
