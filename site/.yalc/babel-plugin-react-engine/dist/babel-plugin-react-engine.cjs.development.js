'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var helperPluginUtils = require('@babel/helper-plugin-utils');
var t = require('@babel/types');
var jsx = _interopDefault(require('@babel/plugin-syntax-jsx'));

/**
 * This adds {fileName, lineNumber, columnNumber} annotations to JSX tags.
 *
 * NOTE: lineNumber and columnNumber are both 1-based.
 *
 * == JSX Literals ==
 *
 * <sometag />
 *
 * becomes:
 *
 * var __jsxFileName = 'this/file.js';
 * <sometag __source={{fileName: __jsxFileName, lineNumber: 10, columnNumber: 1}}/>
 */
var TRACE_ID = "__customSource";
var FILE_NAME_VAR = "_customJsxFileName";
var VALID_COMPONENT_NAMES = ['Editable'];
var index = /*#__PURE__*/helperPluginUtils.declare(function (api) {
  api.assertVersion(7);

  function makeTrace(fileNameIdentifier, lineNumber, column0Based) {
    var fileLineLiteral = lineNumber != null ? t.numericLiteral(lineNumber) : t.nullLiteral();
    var fileColumnLiteral = column0Based != null ? t.numericLiteral(column0Based + 1) : t.nullLiteral();
    var fileNameProperty = t.objectProperty(t.identifier("fileName"), fileNameIdentifier);
    var lineNumberProperty = t.objectProperty(t.identifier("lineNumber"), fileLineLiteral);
    var columnNumberProperty = t.objectProperty(t.identifier("columnNumber"), fileColumnLiteral);
    return t.objectExpression([fileNameProperty, lineNumberProperty, columnNumberProperty]);
  }

  var visitor = {
    JSXOpeningElement: function JSXOpeningElement(path, state) {
      var id = t.jsxIdentifier(TRACE_ID);
      var location = path.container.openingElement.loc;

      if (!location) {
        // the element was generated and doesn't have location information
        return;
      }

      if (!VALID_COMPONENT_NAMES.includes(path.node.name.name)) {
        return;
      }

      var attributes = path.container.openingElement.attributes;

      for (var i = 0; i < attributes.length; i++) {
        var name = attributes[i].name;

        if ((name == null ? void 0 : name.name) === TRACE_ID) {
          // The __source attribute already exists
          return;
        }
      }

      if (!state.fileNameIdentifier) {
        var fileName = state.filename || "";
        var fileNameIdentifier = path.scope.generateUidIdentifier(FILE_NAME_VAR);
        var scope = path.hub.getScope();

        if (scope) {
          scope.push({
            id: fileNameIdentifier,
            init: t.stringLiteral(fileName)
          });
        }

        state.fileNameIdentifier = fileNameIdentifier;
      }

      var trace = makeTrace(state.fileNameIdentifier, location.start.line, location.start.column);
      attributes.push(t.jsxAttribute(id, t.jsxExpressionContainer(trace)));
    }
  };
  return {
    name: "babel-plugin-react-engine",
    inherits: jsx,
    visitor: visitor
  };
});

exports.default = index;
//# sourceMappingURL=babel-plugin-react-engine.cjs.development.js.map
