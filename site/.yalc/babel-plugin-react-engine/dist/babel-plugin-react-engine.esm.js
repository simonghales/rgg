import { declare } from '@babel/helper-plugin-utils';
import { jsxIdentifier, stringLiteral, objectExpression, jsxAttribute, jsxExpressionContainer, numericLiteral, nullLiteral, objectProperty, identifier } from '@babel/types';
import jsx from '@babel/plugin-syntax-jsx';

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
var index = /*#__PURE__*/declare(function (api) {
  api.assertVersion(7);

  function makeTrace(fileNameIdentifier, lineNumber, column0Based) {
    var fileLineLiteral = lineNumber != null ? numericLiteral(lineNumber) : nullLiteral();
    var fileColumnLiteral = column0Based != null ? numericLiteral(column0Based + 1) : nullLiteral();
    var fileNameProperty = objectProperty(identifier("fileName"), fileNameIdentifier);
    var lineNumberProperty = objectProperty(identifier("lineNumber"), fileLineLiteral);
    var columnNumberProperty = objectProperty(identifier("columnNumber"), fileColumnLiteral);
    return objectExpression([fileNameProperty, lineNumberProperty, columnNumberProperty]);
  }

  var visitor = {
    JSXOpeningElement: function JSXOpeningElement(path, state) {
      var id = jsxIdentifier(TRACE_ID);
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
            init: stringLiteral(fileName)
          });
        }

        state.fileNameIdentifier = fileNameIdentifier;
      }

      var trace = makeTrace(state.fileNameIdentifier, location.start.line, location.start.column);
      attributes.push(jsxAttribute(id, jsxExpressionContainer(trace)));
    }
  };
  return {
    name: "babel-plugin-react-engine",
    inherits: jsx,
    visitor: visitor
  };
});

export default index;
//# sourceMappingURL=babel-plugin-react-engine.esm.js.map
