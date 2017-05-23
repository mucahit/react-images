require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _util = require('./util');

var _inject = require('./inject');

/* ::
import type { SelectorHandler } from './generate.js';
export type SheetDefinition = { [id:string]: any };
export type SheetDefinitions = SheetDefinition | SheetDefinition[];
type RenderFunction = () => string;
type Extension = {
    selectorHandler: SelectorHandler
};
export type MaybeSheetDefinition = SheetDefinition | false | null | void
*/

var StyleSheet = {
    create: function create(sheetDefinition /* : SheetDefinition */) {
        return (0, _util.mapObj)(sheetDefinition, function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var val = _ref2[1];

            return [key, {
                // TODO(emily): Make a 'production' mode which doesn't prepend
                // the class name here, to make the generated CSS smaller.
                _name: key + '_' + (0, _util.hashObject)(val),
                _definition: val
            }];
        });
    },

    rehydrate: function rehydrate() {
        var renderedClassNames /* : string[] */ = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        (0, _inject.addRenderedClassNames)(renderedClassNames);
    }
};

/**
 * Utilities for using Aphrodite server-side.
 */
var StyleSheetServer = {
    renderStatic: function renderStatic(renderFunc /* : RenderFunction */) {
        (0, _inject.reset)();
        (0, _inject.startBuffering)();
        var html = renderFunc();
        var cssContent = (0, _inject.flushToString)();

        return {
            html: html,
            css: {
                content: cssContent,
                renderedClassNames: (0, _inject.getRenderedClassNames)()
            }
        };
    }
};

/**
 * Utilities for using Aphrodite in tests.
 *
 * Not meant to be used in production.
 */
var StyleSheetTestUtils = {
    /**
     * Prevent styles from being injected into the DOM.
     *
     * This is useful in situations where you'd like to test rendering UI
     * components which use Aphrodite without any of the side-effects of
     * Aphrodite happening. Particularly useful for testing the output of
     * components when you have no DOM, e.g. testing in Node without a fake DOM.
     *
     * Should be paired with a subsequent call to
     * clearBufferAndResumeStyleInjection.
     */
    suppressStyleInjection: function suppressStyleInjection() {
        (0, _inject.reset)();
        (0, _inject.startBuffering)();
    },

    /**
     * Opposite method of preventStyleInject.
     */
    clearBufferAndResumeStyleInjection: function clearBufferAndResumeStyleInjection() {
        (0, _inject.reset)();
    }
};

/**
 * Generate the Aphrodite API exports, with given `selectorHandlers` and
 * `useImportant` state.
 */
var makeExports = function makeExports(useImportant, /* : boolean */
selectorHandlers /* : SelectorHandler[] */
) {
    return {
        StyleSheet: _extends({}, StyleSheet, {

            /**
             * Returns a version of the exports of Aphrodite (i.e. an object
             * with `css` and `StyleSheet` properties) which have some
             * extensions included.
             *
             * @param {Array.<Object>} extensions: An array of extensions to
             *     add to this instance of Aphrodite. Each object should have a
             *     single property on it, defining which kind of extension to
             *     add.
             * @param {SelectorHandler} [extensions[].selectorHandler]: A
             *     selector handler extension. See `defaultSelectorHandlers` in
             *     generate.js.
             *
             * @returns {Object} An object containing the exports of the new
             *     instance of Aphrodite.
             */
            extend: function extend(extensions /* : Extension[] */) {
                var extensionSelectorHandlers = extensions
                // Pull out extensions with a selectorHandler property
                .map(function (extension) {
                    return extension.selectorHandler;
                })
                // Remove nulls (i.e. extensions without a selectorHandler
                // property).
                .filter(function (handler) {
                    return handler;
                });

                return makeExports(useImportant, selectorHandlers.concat(extensionSelectorHandlers));
            }
        }),

        StyleSheetServer: StyleSheetServer,
        StyleSheetTestUtils: StyleSheetTestUtils,

        css: function css() /* : MaybeSheetDefinition[] */{
            for (var _len = arguments.length, styleDefinitions = Array(_len), _key = 0; _key < _len; _key++) {
                styleDefinitions[_key] = arguments[_key];
            }

            return (0, _inject.injectAndGetClassName)(useImportant, styleDefinitions, selectorHandlers);
        }
    };
};

module.exports = makeExports;
},{"./inject":3,"./util":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _inlineStylePrefixerStaticCreatePrefixer = require('inline-style-prefixer/static/createPrefixer');

var _inlineStylePrefixerStaticCreatePrefixer2 = _interopRequireDefault(_inlineStylePrefixerStaticCreatePrefixer);

var _libStaticPrefixData = require('../lib/staticPrefixData');

var _libStaticPrefixData2 = _interopRequireDefault(_libStaticPrefixData);

var _orderedElements = require('./ordered-elements');

var _orderedElements2 = _interopRequireDefault(_orderedElements);

var _util = require('./util');

var prefixAll = (0, _inlineStylePrefixerStaticCreatePrefixer2['default'])(_libStaticPrefixData2['default']);

/* ::
import type { SheetDefinition } from './index.js';
type StringHandlers = { [id:string]: Function };
type SelectorCallback = (selector: string) => any;
export type SelectorHandler = (
    selector: string,
    baseSelector: string,
    callback: SelectorCallback
) => string | null;
*/

/**
 * `selectorHandlers` are functions which handle special selectors which act
 * differently than normal style definitions. These functions look at the
 * current selector and can generate CSS for the styles in their subtree by
 * calling the callback with a new selector.
 *
 * For example, when generating styles with a base selector of '.foo' and the
 * following styles object:
 *
 *   {
 *     ':nth-child(2n)': {
 *       ':hover': {
 *         color: 'red'
 *       }
 *     }
 *   }
 *
 * when we reach the ':hover' style, we would call our selector handlers like
 *
 *   handler(':hover', '.foo:nth-child(2n)', callback)
 *
 * Since our `pseudoSelectors` handles ':hover' styles, that handler would call
 * the callback like
 *
 *   callback('.foo:nth-child(2n):hover')
 *
 * to generate its subtree `{ color: 'red' }` styles with a
 * '.foo:nth-child(2n):hover' selector. The callback would return CSS like
 *
 *   '.foo:nth-child(2n):hover{color:red !important;}'
 *
 * and the handler would then return that resulting CSS.
 *
 * `defaultSelectorHandlers` is the list of default handlers used in a call to
 * `generateCSS`.
 *
 * @name SelectorHandler
 * @function
 * @param {string} selector: The currently inspected selector. ':hover' in the
 *     example above.
 * @param {string} baseSelector: The selector of the parent styles.
 *     '.foo:nth-child(2n)' in the example above.
 * @param {function} generateSubtreeStyles: A function which can be called to
 *     generate CSS for the subtree of styles corresponding to the selector.
 *     Accepts a new baseSelector to use for generating those styles.
 * @returns {?string} The generated CSS for this selector, or null if we don't
 *     handle this selector.
 */
var defaultSelectorHandlers = [
// Handle pseudo-selectors, like :hover and :nth-child(3n)
function pseudoSelectors(selector, /* : string */
baseSelector, /* : string */
generateSubtreeStyles /* : Function */
) /* */{
    if (selector[0] !== ":") {
        return null;
    }
    return generateSubtreeStyles(baseSelector + selector);
},

// Handle media queries (or font-faces)
function mediaQueries(selector, /* : string */
baseSelector, /* : string */
generateSubtreeStyles /* : Function */
) /* */{
    if (selector[0] !== "@") {
        return null;
    }
    // Generate the styles normally, and then wrap them in the media query.
    var generated = generateSubtreeStyles(baseSelector);
    return selector + '{' + generated + '}';
}];

exports.defaultSelectorHandlers = defaultSelectorHandlers;
/**
 * Generate CSS for a selector and some styles.
 *
 * This function handles the media queries and pseudo selectors that can be used
 * in aphrodite styles.
 *
 * @param {string} selector: A base CSS selector for the styles to be generated
 *     with.
 * @param {Object} styleTypes: A list of properties of the return type of
 *     StyleSheet.create, e.g. [styles.red, styles.blue].
 * @param {Array.<SelectorHandler>} selectorHandlers: A list of selector
 *     handlers to use for handling special selectors. See
 *     `defaultSelectorHandlers`.
 * @param stringHandlers: See `generateCSSRuleset`
 * @param useImportant: See `generateCSSRuleset`
 *
 * To actually generate the CSS special-construct-less styles are passed to
 * `generateCSSRuleset`.
 *
 * For instance, a call to
 *
 *     generateCSS(".foo", [{
 *       color: "red",
 *       "@media screen": {
 *         height: 20,
 *         ":hover": {
 *           backgroundColor: "black"
 *         }
 *       },
 *       ":active": {
 *         fontWeight: "bold"
 *       }
 *     }], defaultSelectorHandlers);
 *
 * with the default `selectorHandlers` will make 5 calls to
 * `generateCSSRuleset`:
 *
 *     generateCSSRuleset(".foo", { color: "red" }, ...)
 *     generateCSSRuleset(".foo:active", { fontWeight: "bold" }, ...)
 *     // These 2 will be wrapped in @media screen {}
 *     generateCSSRuleset(".foo", { height: 20 }, ...)
 *     generateCSSRuleset(".foo:hover", { backgroundColor: "black" }, ...)
 */
var generateCSS = function generateCSS(selector, /* : string */
styleTypes, /* : SheetDefinition[] */
selectorHandlers, /* : SelectorHandler[] */
stringHandlers, /* : StringHandlers */
useImportant /* : boolean */
) /* : string */{
    var merged = new _orderedElements2['default']();

    for (var i = 0; i < styleTypes.length; i++) {
        merged.addStyleType(styleTypes[i]);
    }

    var plainDeclarations = new _orderedElements2['default']();
    var generatedStyles = "";

    // TODO(emily): benchmark this to see if a plain for loop would be faster.
    merged.forEach(function (val, key) {
        // For each key, see if one of the selector handlers will handle these
        // styles.
        var foundHandler = selectorHandlers.some(function (handler) {
            var result = handler(key, selector, function (newSelector) {
                return generateCSS(newSelector, [val], selectorHandlers, stringHandlers, useImportant);
            });
            if (result != null) {
                // If the handler returned something, add it to the generated
                // CSS and stop looking for another handler.
                generatedStyles += result;
                return true;
            }
        });
        // If none of the handlers handled it, add it to the list of plain
        // style declarations.
        if (!foundHandler) {
            plainDeclarations.set(key, val);
        }
    });

    return generateCSSRuleset(selector, plainDeclarations, stringHandlers, useImportant, selectorHandlers) + generatedStyles;
};

exports.generateCSS = generateCSS;
/**
 * Helper method of generateCSSRuleset to facilitate custom handling of certain
 * CSS properties. Used for e.g. font families.
 *
 * See generateCSSRuleset for usage and documentation of paramater types.
 */
var runStringHandlers = function runStringHandlers(declarations, /* : OrderedElements */
stringHandlers, /* : StringHandlers */
selectorHandlers /* : SelectorHandler[] */
) /* : OrderedElements */{
    if (!stringHandlers) {
        return declarations;
    }

    var stringHandlerKeys = Object.keys(stringHandlers);
    for (var i = 0; i < stringHandlerKeys.length; i++) {
        var key = stringHandlerKeys[i];
        if (declarations.has(key)) {
            // A declaration exists for this particular string handler, so we
            // need to let the string handler interpret the declaration first
            // before proceeding.
            //
            // TODO(emily): Pass in a callback which generates CSS, similar to
            // how our selector handlers work, instead of passing in
            // `selectorHandlers` and have them make calls to `generateCSS`
            // themselves. Right now, this is impractical because our string
            // handlers are very specialized and do complex things.
            declarations.set(key, stringHandlers[key](declarations.get(key), selectorHandlers));
        }
    }

    return declarations;
};

var transformRule = function transformRule(key, /* : string */
value, /* : string */
transformValue /* : function */
) {
    return (/* : string */(0, _util.kebabifyStyleName)(key) + ':' + transformValue(key, value) + ';'
    );
};

/**
 * Generate a CSS ruleset with the selector and containing the declarations.
 *
 * This function assumes that the given declarations don't contain any special
 * children (such as media queries, pseudo-selectors, or descendant styles).
 *
 * Note that this method does not deal with nesting used for e.g.
 * psuedo-selectors or media queries. That responsibility is left to  the
 * `generateCSS` function.
 *
 * @param {string} selector: the selector associated with the ruleset
 * @param {Object} declarations: a map from camelCased CSS property name to CSS
 *     property value.
 * @param {Object.<string, function>} stringHandlers: a map from camelCased CSS
 *     property name to a function which will map the given value to the value
 *     that is output.
 * @param {bool} useImportant: A boolean saying whether to append "!important"
 *     to each of the CSS declarations.
 * @returns {string} A string of raw CSS.
 *
 * Examples:
 *
 *    generateCSSRuleset(".blah", { color: "red" })
 *    -> ".blah{color: red !important;}"
 *    generateCSSRuleset(".blah", { color: "red" }, {}, false)
 *    -> ".blah{color: red}"
 *    generateCSSRuleset(".blah", { color: "red" }, {color: c => c.toUpperCase})
 *    -> ".blah{color: RED}"
 *    generateCSSRuleset(".blah:hover", { color: "red" })
 *    -> ".blah:hover{color: red}"
 */
var generateCSSRuleset = function generateCSSRuleset(selector, /* : string */
declarations, /* : OrderedElements */
stringHandlers, /* : StringHandlers */
useImportant, /* : boolean */
selectorHandlers /* : SelectorHandler[] */
) /* : string */{
    // Mutates declarations
    runStringHandlers(declarations, stringHandlers, selectorHandlers);

    var originalElements = _extends({}, declarations.elements);

    // NOTE(emily): This mutates handledDeclarations.elements.
    var prefixedElements = prefixAll(declarations.elements);

    var elementNames = Object.keys(prefixedElements);
    if (elementNames.length !== declarations.keyOrder.length) {
        // There are some prefixed values, so we need to figure out how to sort
        // them.
        //
        // Loop through prefixedElements, looking for anything that is not in
        // sortOrder, which means it was added by prefixAll. This means that we
        // need to figure out where it should appear in the sortOrder.
        for (var i = 0; i < elementNames.length; i++) {
            if (!originalElements.hasOwnProperty(elementNames[i])) {
                // This element is not in the sortOrder, which means it is a prefixed
                // value that was added by prefixAll. Let's try to figure out where it
                // goes.
                var originalStyle = undefined;
                if (elementNames[i][0] === 'W') {
                    // This is a Webkit-prefixed style, like "WebkitTransition". Let's
                    // find its original style's sort order.
                    originalStyle = elementNames[i][6].toLowerCase() + elementNames[i].slice(7);
                } else if (elementNames[i][1] === 'o') {
                    // This is a Moz-prefixed style, like "MozTransition". We check
                    // the second character to avoid colliding with Ms-prefixed
                    // styles. Let's find its original style's sort order.
                    originalStyle = elementNames[i][3].toLowerCase() + elementNames[i].slice(4);
                } else {
                    // if (elementNames[i][1] === 's') {
                    // This is a Ms-prefixed style, like "MsTransition".
                    originalStyle = elementNames[i][2].toLowerCase() + elementNames[i].slice(3);
                }

                if (originalStyle && originalElements.hasOwnProperty(originalStyle)) {
                    var originalIndex = declarations.keyOrder.indexOf(originalStyle);
                    declarations.keyOrder.splice(originalIndex, 0, elementNames[i]);
                } else {
                    // We don't know what the original style was, so sort it to
                    // top. This can happen for styles that are added that don't
                    // have the same base name as the original style.
                    declarations.keyOrder.unshift(elementNames[i]);
                }
            }
        }
    }

    var transformValue = useImportant === false ? _util.stringifyValue : _util.stringifyAndImportantifyValue;

    var rules = [];
    for (var i = 0; i < declarations.keyOrder.length; i++) {
        var key = declarations.keyOrder[i];
        var value = prefixedElements[key];
        if (Array.isArray(value)) {
            // inline-style-prefixer returns an array when there should be
            // multiple rules for the same key. Here we flatten to multiple
            // pairs with the same key.
            for (var j = 0; j < value.length; j++) {
                rules.push(transformRule(key, value[j], transformValue));
            }
        } else {
            rules.push(transformRule(key, value, transformValue));
        }
    }

    if (rules.length) {
        return selector + '{' + rules.join("") + '}';
    } else {
        return "";
    }
};
exports.generateCSSRuleset = generateCSSRuleset;
},{"../lib/staticPrefixData":6,"./ordered-elements":5,"./util":7,"inline-style-prefixer/static/createPrefixer":14}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _asap = require('asap');

var _asap2 = _interopRequireDefault(_asap);

var _orderedElements = require('./ordered-elements');

var _orderedElements2 = _interopRequireDefault(_orderedElements);

var _generate = require('./generate');

var _util = require('./util');

/* ::
import type { SheetDefinition, SheetDefinitions } from './index.js';
import type { MaybeSheetDefinition } from './exports.js';
import type { SelectorHandler } from './generate.js';
type ProcessedStyleDefinitions = {
  classNameBits: Array<string>,
  definitionBits: Array<Object>,
};
*/

// The current <style> tag we are inserting into, or null if we haven't
// inserted anything yet. We could find this each time using
// `document.querySelector("style[data-aphrodite"])`, but holding onto it is
// faster.
var styleTag = null;

// Inject a string of styles into a <style> tag in the head of the document. This
// will automatically create a style tag and then continue to use it for
// multiple injections. It will also use a style tag with the `data-aphrodite`
// tag on it if that exists in the DOM. This could be used for e.g. reusing the
// same style tag that server-side rendering inserts.
var injectStyleTag = function injectStyleTag(cssContents /* : string */) {
    if (styleTag == null) {
        // Try to find a style tag with the `data-aphrodite` attribute first.
        styleTag = document.querySelector("style[data-aphrodite]");

        // If that doesn't work, generate a new style tag.
        if (styleTag == null) {
            // Taken from
            // http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
            var head = document.head || document.getElementsByTagName('head')[0];
            styleTag = document.createElement('style');

            styleTag.type = 'text/css';
            styleTag.setAttribute("data-aphrodite", "");
            head.appendChild(styleTag);
        }
    }

    if (styleTag.styleSheet) {
        // $FlowFixMe: legacy Internet Explorer compatibility
        styleTag.styleSheet.cssText += cssContents;
    } else {
        styleTag.appendChild(document.createTextNode(cssContents));
    }
};

// Custom handlers for stringifying CSS values that have side effects
// (such as fontFamily, which can cause @font-face rules to be injected)
var stringHandlers = {
    // With fontFamily we look for objects that are passed in and interpret
    // them as @font-face rules that we need to inject. The value of fontFamily
    // can either be a string (as normal), an object (a single font face), or
    // an array of objects and strings.
    fontFamily: function fontFamily(val) {
        if (Array.isArray(val)) {
            return val.map(fontFamily).join(",");
        } else if (typeof val === "object") {
            injectStyleOnce(val.src, "@font-face", [val], false);
            return '"' + val.fontFamily + '"';
        } else {
            return val;
        }
    },

    // With animationName we look for an object that contains keyframes and
    // inject them as an `@keyframes` block, returning a uniquely generated
    // name. The keyframes object should look like
    //  animationName: {
    //    from: {
    //      left: 0,
    //      top: 0,
    //    },
    //    '50%': {
    //      left: 15,
    //      top: 5,
    //    },
    //    to: {
    //      left: 20,
    //      top: 20,
    //    }
    //  }
    // TODO(emily): `stringHandlers` doesn't let us rename the key, so I have
    // to use `animationName` here. Improve that so we can call this
    // `animation` instead of `animationName`.
    animationName: function animationName(val, selectorHandlers) {
        if (Array.isArray(val)) {
            return val.map(function (v) {
                return animationName(v, selectorHandlers);
            }).join(",");
        } else if (typeof val === "object") {
            // Generate a unique name based on the hash of the object. We can't
            // just use the hash because the name can't start with a number.
            // TODO(emily): this probably makes debugging hard, allow a custom
            // name?
            var _name = 'keyframe_' + (0, _util.hashObject)(val);

            // Since keyframes need 3 layers of nesting, we use `generateCSS` to
            // build the inner layers and wrap it in `@keyframes` ourselves.
            var finalVal = '@keyframes ' + _name + '{';

            // TODO see if we can find a way where checking for OrderedElements
            // here is not necessary. Alternatively, perhaps we should have a
            // utility method that can iterate over either a plain object, an
            // instance of OrderedElements, or a Map, and then use that here and
            // elsewhere.
            if (val instanceof _orderedElements2['default']) {
                val.forEach(function (valVal, valKey) {
                    finalVal += (0, _generate.generateCSS)(valKey, [valVal], selectorHandlers, stringHandlers, false);
                });
            } else {
                Object.keys(val).forEach(function (key) {
                    finalVal += (0, _generate.generateCSS)(key, [val[key]], selectorHandlers, stringHandlers, false);
                });
            }
            finalVal += '}';

            injectGeneratedCSSOnce(_name, finalVal);

            return _name;
        } else {
            return val;
        }
    }
};

// This is a map from Aphrodite's generated class names to `true` (acting as a
// set of class names)
var alreadyInjected = {};

// This is the buffer of styles which have not yet been flushed.
var injectionBuffer = "";

// A flag to tell if we are already buffering styles. This could happen either
// because we scheduled a flush call already, so newly added styles will
// already be flushed, or because we are statically buffering on the server.
var isBuffering = false;

var injectGeneratedCSSOnce = function injectGeneratedCSSOnce(key, generatedCSS) {
    if (alreadyInjected[key]) {
        return;
    }

    if (!isBuffering) {
        // We should never be automatically buffering on the server (or any
        // place without a document), so guard against that.
        if (typeof document === "undefined") {
            throw new Error("Cannot automatically buffer without a document");
        }

        // If we're not already buffering, schedule a call to flush the
        // current styles.
        isBuffering = true;
        (0, _asap2['default'])(flushToStyleTag);
    }

    injectionBuffer += generatedCSS;
    alreadyInjected[key] = true;
};

var injectStyleOnce = function injectStyleOnce(key, /* : string */
selector, /* : string */
definitions, /* : SheetDefinition[] */
useImportant /* : boolean */
) {
    var selectorHandlers /* : SelectorHandler[] */ = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

    if (alreadyInjected[key]) {
        return;
    }

    var generated = (0, _generate.generateCSS)(selector, definitions, selectorHandlers, stringHandlers, useImportant);

    injectGeneratedCSSOnce(key, generated);
};

exports.injectStyleOnce = injectStyleOnce;
var reset = function reset() {
    injectionBuffer = "";
    alreadyInjected = {};
    isBuffering = false;
    styleTag = null;
};

exports.reset = reset;
var startBuffering = function startBuffering() {
    if (isBuffering) {
        throw new Error("Cannot buffer while already buffering");
    }
    isBuffering = true;
};

exports.startBuffering = startBuffering;
var flushToString = function flushToString() {
    isBuffering = false;
    var ret = injectionBuffer;
    injectionBuffer = "";
    return ret;
};

exports.flushToString = flushToString;
var flushToStyleTag = function flushToStyleTag() {
    var cssContent = flushToString();
    if (cssContent.length > 0) {
        injectStyleTag(cssContent);
    }
};

exports.flushToStyleTag = flushToStyleTag;
var getRenderedClassNames = function getRenderedClassNames() {
    return Object.keys(alreadyInjected);
};

exports.getRenderedClassNames = getRenderedClassNames;
var addRenderedClassNames = function addRenderedClassNames(classNames /* : string[] */) {
    classNames.forEach(function (className) {
        alreadyInjected[className] = true;
    });
};

exports.addRenderedClassNames = addRenderedClassNames;
var processStyleDefinitions = function processStyleDefinitions(styleDefinitions, /* : any[] */
result /* : ProcessedStyleDefinitions */
) /* : void */{
    for (var i = 0; i < styleDefinitions.length; i += 1) {
        // Filter out falsy values from the input, to allow for
        // `css(a, test && c)`
        if (styleDefinitions[i]) {
            if (Array.isArray(styleDefinitions[i])) {
                // We've encountered an array, so let's recurse
                processStyleDefinitions(styleDefinitions[i], result);
            } else {
                result.classNameBits.push(styleDefinitions[i]._name);
                result.definitionBits.push(styleDefinitions[i]._definition);
            }
        }
    }
};

/**
 * Inject styles associated with the passed style definition objects, and return
 * an associated CSS class name.
 *
 * @param {boolean} useImportant If true, will append !important to generated
 *     CSS output. e.g. {color: red} -> "color: red !important".
 * @param {(Object|Object[])[]} styleDefinitions style definition objects, or
 *     arbitrarily nested arrays of them, as returned as properties of the
 *     return value of StyleSheet.create().
 */
var injectAndGetClassName = function injectAndGetClassName(useImportant, /* : boolean */
styleDefinitions, /* : MaybeSheetDefinition[] */
selectorHandlers /* : SelectorHandler[] */
) /* : string */{
    var processedStyleDefinitions /* : ProcessedStyleDefinitions */ = {
        classNameBits: [],
        definitionBits: []
    };
    // Mutates processedStyleDefinitions
    processStyleDefinitions(styleDefinitions, processedStyleDefinitions);

    // Break if there aren't any valid styles.
    if (processedStyleDefinitions.classNameBits.length === 0) {
        return "";
    }
    var className = processedStyleDefinitions.classNameBits.join("-o_O-");

    injectStyleOnce(className, '.' + className, processedStyleDefinitions.definitionBits, useImportant, selectorHandlers);

    return className;
};
exports.injectAndGetClassName = injectAndGetClassName;
},{"./generate":2,"./ordered-elements":5,"./util":7,"asap":9}],4:[function(require,module,exports){

// Module with the same interface as the core aphrodite module,
// except that styles injected do not automatically have !important
// appended to them.
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _generate = require('./generate');

var _exports2 = require('./exports');

var _exports3 = _interopRequireDefault(_exports2);

var useImportant = false; // Don't add !important to style definitions
exports['default'] = (0, _exports3['default'])(useImportant, _generate.defaultSelectorHandlers);
module.exports = exports['default'];
},{"./exports":1,"./generate":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MAP_EXISTS = typeof Map !== 'undefined';

var OrderedElements = (function () {
    /* ::
    elements: {[string]: any};
    keyOrder: string[];
    */

    function OrderedElements() {
        _classCallCheck(this, OrderedElements);

        this.elements = {};
        this.keyOrder = [];
    }

    _createClass(OrderedElements, [{
        key: 'forEach',
        value: function forEach(callback /* : (string, any) => void */) {
            for (var i = 0; i < this.keyOrder.length; i++) {
                // (value, key) to match Map's API
                callback(this.elements[this.keyOrder[i]], this.keyOrder[i]);
            }
        }
    }, {
        key: 'set',
        value: function set(key, /* : string */value /* : any */) {
            var _this = this;

            if (!this.elements.hasOwnProperty(key)) {
                this.keyOrder.push(key);
            }

            if (value == null) {
                this.elements[key] = value;
                return;
            }

            if (MAP_EXISTS && value instanceof Map || value instanceof OrderedElements) {
                var _ret = (function () {
                    // We have found a nested Map, so we need to recurse so that all
                    // of the nested objects and Maps are merged properly.
                    var nested = _this.elements.hasOwnProperty(key) ? _this.elements[key] : new OrderedElements();
                    value.forEach(function (value, key) {
                        nested.set(key, value);
                    });
                    _this.elements[key] = nested;
                    return {
                        v: undefined
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }

            if (!Array.isArray(value) && typeof value === 'object') {
                // We have found a nested object, so we need to recurse so that all
                // of the nested objects and Maps are merged properly.
                var nested = this.elements.hasOwnProperty(key) ? this.elements[key] : new OrderedElements();
                var keys = Object.keys(value);
                for (var i = 0; i < keys.length; i += 1) {
                    nested.set(keys[i], value[keys[i]]);
                }
                this.elements[key] = nested;
                return;
            }

            this.elements[key] = value;
        }
    }, {
        key: 'get',
        value: function get(key /* : string */) /* : any */{
            return this.elements[key];
        }
    }, {
        key: 'has',
        value: function has(key /* : string */) /* : boolean */{
            return this.elements.hasOwnProperty(key);
        }
    }, {
        key: 'addStyleType',
        value: function addStyleType(styleType /* : any */) /* : void */{
            var _this2 = this;

            if (MAP_EXISTS && styleType instanceof Map || styleType instanceof OrderedElements) {
                styleType.forEach(function (value, key) {
                    _this2.set(key, value);
                });
            } else {
                var keys = Object.keys(styleType);
                for (var i = 0; i < keys.length; i++) {
                    this.set(keys[i], styleType[keys[i]]);
                }
            }
        }
    }]);

    return OrderedElements;
})();

exports['default'] = OrderedElements;
module.exports = exports['default'];
},{}],6:[function(require,module,exports){
var calc = require('inline-style-prefixer/static/plugins/calc')
var crossFade = require('inline-style-prefixer/static/plugins/crossFade')
var cursor = require('inline-style-prefixer/static/plugins/cursor')
var filter = require('inline-style-prefixer/static/plugins/filter')
var flex = require('inline-style-prefixer/static/plugins/flex')
var flexboxIE = require('inline-style-prefixer/static/plugins/flexboxIE')
var flexboxOld = require('inline-style-prefixer/static/plugins/flexboxOld')
var gradient = require('inline-style-prefixer/static/plugins/gradient')
var imageSet = require('inline-style-prefixer/static/plugins/imageSet')
var position = require('inline-style-prefixer/static/plugins/position')
var sizing = require('inline-style-prefixer/static/plugins/sizing')
var transition = require('inline-style-prefixer/static/plugins/transition')

module.exports =  {
  plugins: [calc,crossFade,cursor,filter,flex,flexboxIE,flexboxOld,gradient,imageSet,position,sizing,transition],
  prefixMap: {"transform":["Webkit","ms"],"transformOrigin":["Webkit","ms"],"transformOriginX":["Webkit","ms"],"transformOriginY":["Webkit","ms"],"backfaceVisibility":["Webkit"],"perspective":["Webkit"],"perspectiveOrigin":["Webkit"],"transformStyle":["Webkit"],"transformOriginZ":["Webkit"],"animation":["Webkit"],"animationDelay":["Webkit"],"animationDirection":["Webkit"],"animationFillMode":["Webkit"],"animationDuration":["Webkit"],"animationIterationCount":["Webkit"],"animationName":["Webkit"],"animationPlayState":["Webkit"],"animationTimingFunction":["Webkit"],"appearance":["Webkit","Moz"],"userSelect":["Webkit","Moz","ms"],"fontKerning":["Webkit"],"textEmphasisPosition":["Webkit"],"textEmphasis":["Webkit"],"textEmphasisStyle":["Webkit"],"textEmphasisColor":["Webkit"],"boxDecorationBreak":["Webkit"],"clipPath":["Webkit"],"maskImage":["Webkit"],"maskMode":["Webkit"],"maskRepeat":["Webkit"],"maskPosition":["Webkit"],"maskClip":["Webkit"],"maskOrigin":["Webkit"],"maskSize":["Webkit"],"maskComposite":["Webkit"],"mask":["Webkit"],"maskBorderSource":["Webkit"],"maskBorderMode":["Webkit"],"maskBorderSlice":["Webkit"],"maskBorderWidth":["Webkit"],"maskBorderOutset":["Webkit"],"maskBorderRepeat":["Webkit"],"maskBorder":["Webkit"],"maskType":["Webkit"],"textDecorationStyle":["Webkit","Moz"],"textDecorationSkip":["Webkit","Moz"],"textDecorationLine":["Webkit","Moz"],"textDecorationColor":["Webkit","Moz"],"filter":["Webkit"],"fontFeatureSettings":["Webkit","Moz"],"breakAfter":["Webkit","Moz","ms"],"breakBefore":["Webkit","Moz","ms"],"breakInside":["Webkit","Moz","ms"],"columnCount":["Webkit","Moz"],"columnFill":["Webkit","Moz"],"columnGap":["Webkit","Moz"],"columnRule":["Webkit","Moz"],"columnRuleColor":["Webkit","Moz"],"columnRuleStyle":["Webkit","Moz"],"columnRuleWidth":["Webkit","Moz"],"columns":["Webkit","Moz"],"columnSpan":["Webkit","Moz"],"columnWidth":["Webkit","Moz"],"flex":["Webkit","ms"],"flexBasis":["Webkit"],"flexDirection":["Webkit","ms"],"flexGrow":["Webkit"],"flexFlow":["Webkit","ms"],"flexShrink":["Webkit"],"flexWrap":["Webkit","ms"],"alignContent":["Webkit"],"alignItems":["Webkit"],"alignSelf":["Webkit"],"justifyContent":["Webkit"],"order":["Webkit"],"transitionDelay":["Webkit"],"transitionDuration":["Webkit"],"transitionProperty":["Webkit"],"transitionTimingFunction":["Webkit"],"backdropFilter":["Webkit"],"scrollSnapType":["Webkit","ms"],"scrollSnapPointsX":["Webkit","ms"],"scrollSnapPointsY":["Webkit","ms"],"scrollSnapDestination":["Webkit","ms"],"scrollSnapCoordinate":["Webkit","ms"],"shapeImageThreshold":["Webkit"],"shapeImageMargin":["Webkit"],"shapeImageOutside":["Webkit"],"hyphens":["Webkit","Moz","ms"],"flowInto":["Webkit","ms"],"flowFrom":["Webkit","ms"],"regionFragment":["Webkit","ms"],"boxSizing":["Moz"],"textAlignLast":["Moz"],"tabSize":["Moz"],"wrapFlow":["ms"],"wrapThrough":["ms"],"wrapMargin":["ms"],"touchAction":["ms"],"gridTemplateColumns":["ms"],"gridTemplateRows":["ms"],"gridTemplateAreas":["ms"],"gridTemplate":["ms"],"gridAutoColumns":["ms"],"gridAutoRows":["ms"],"gridAutoFlow":["ms"],"grid":["ms"],"gridRowStart":["ms"],"gridColumnStart":["ms"],"gridRowEnd":["ms"],"gridRow":["ms"],"gridColumn":["ms"],"gridColumnEnd":["ms"],"gridColumnGap":["ms"],"gridRowGap":["ms"],"gridArea":["ms"],"gridGap":["ms"],"textSizeAdjust":["Webkit","ms"],"borderImage":["Webkit"],"borderImageOutset":["Webkit"],"borderImageRepeat":["Webkit"],"borderImageSlice":["Webkit"],"borderImageSource":["Webkit"],"borderImageWidth":["Webkit"]}
}
},{"inline-style-prefixer/static/plugins/calc":15,"inline-style-prefixer/static/plugins/crossFade":16,"inline-style-prefixer/static/plugins/cursor":17,"inline-style-prefixer/static/plugins/filter":18,"inline-style-prefixer/static/plugins/flex":19,"inline-style-prefixer/static/plugins/flexboxIE":20,"inline-style-prefixer/static/plugins/flexboxOld":21,"inline-style-prefixer/static/plugins/gradient":22,"inline-style-prefixer/static/plugins/imageSet":23,"inline-style-prefixer/static/plugins/position":24,"inline-style-prefixer/static/plugins/sizing":25,"inline-style-prefixer/static/plugins/transition":26}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stringHash = require('string-hash');

var _stringHash2 = _interopRequireDefault(_stringHash);

/* ::
type Pair = [ string, any ];
type Pairs = Pair[];
type PairsMapper = (pair: Pair) => Pair;
type ObjectMap = { [id:string]: any };
*/

var mapObj = function mapObj(obj, /* : ObjectMap */
fn /* : PairsMapper */
) /* : ObjectMap */{
    var keys = Object.keys(obj);
    var mappedObj = {};
    for (var i = 0; i < keys.length; i += 1) {
        var _fn = fn([keys[i], obj[keys[i]]]);

        var _fn2 = _slicedToArray(_fn, 2);

        var newKey = _fn2[0];
        var newValue = _fn2[1];

        mappedObj[newKey] = newValue;
    }
    return mappedObj;
};

exports.mapObj = mapObj;
var UPPERCASE_RE = /([A-Z])/g;
var UPPERCASE_RE_TO_KEBAB = function UPPERCASE_RE_TO_KEBAB(match /* : string */) {
    return (/* : string */'-' + match.toLowerCase()
    );
};

var kebabifyStyleName = function kebabifyStyleName(string /* : string */) /* : string */{
    var result = string.replace(UPPERCASE_RE, UPPERCASE_RE_TO_KEBAB);
    if (result[0] === 'm' && result[1] === 's' && result[2] === '-') {
        return '-' + result;
    }
    return result;
};

exports.kebabifyStyleName = kebabifyStyleName;
/**
 * CSS properties which accept numbers but are not in units of "px".
 * Taken from React's CSSProperty.js
 */
var isUnitlessNumber = {
    animationIterationCount: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridRow: true,
    gridColumn: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,

    // SVG-related properties
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
};

/**
 * Taken from React's CSSProperty.js
 *
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
    return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 * Taken from React's CSSProperty.js
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
// Taken from React's CSSProperty.js
Object.keys(isUnitlessNumber).forEach(function (prop) {
    prefixes.forEach(function (prefix) {
        isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
    });
});

var stringifyValue = function stringifyValue(key, /* : string */
prop /* : any */
) /* : string */{
    if (typeof prop === "number") {
        if (isUnitlessNumber[key]) {
            return "" + prop;
        } else {
            return prop + "px";
        }
    } else {
        return '' + prop;
    }
};

exports.stringifyValue = stringifyValue;
var stringifyAndImportantifyValue = function stringifyAndImportantifyValue(key, /* : string */
prop /* : any */
) {
    return (/* : string */importantify(stringifyValue(key, prop))
    );
};

exports.stringifyAndImportantifyValue = stringifyAndImportantifyValue;
// Hash a javascript object using JSON.stringify. This is very fast, about 3
// microseconds on my computer for a sample object:
// http://jsperf.com/test-hashfnv32a-hash/5
//
// Note that this uses JSON.stringify to stringify the objects so in order for
// this to produce consistent hashes browsers need to have a consistent
// ordering of objects. Ben Alpert says that Facebook depends on this, so we
// can probably depend on this too.
var hashObject = function hashObject(object /* : ObjectMap */) {
    return (/* : string */(0, _stringHash2['default'])(JSON.stringify(object)).toString(36)
    );
};

exports.hashObject = hashObject;
// Given a single style value string like the "b" from "a: b;", adds !important
// to generate "b !important".
var importantify = function importantify(string /* : string */) {
    return (/* : string */
        // Bracket string character access is very fast, and in the default case we
        // normally don't expect there to be "!important" at the end of the string
        // so we can use this simple check to take an optimized path. If there
        // happens to be a "!" in this position, we follow up with a more thorough
        // check.
        string[string.length - 10] === '!' && string.slice(-11) === ' !important' ? string : string + ' !important'
    );
};
},{"string-hash":32}],8:[function(require,module,exports){
module.exports = require('./lib/no-important.js');

},{"./lib/no-important.js":4}],9:[function(require,module,exports){
"use strict";

// rawAsap provides everything we need except exception management.
var rawAsap = require("./raw");
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

},{"./raw":10}],10:[function(require,module,exports){
(function (global){
"use strict";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hyphenateProperty;

var _hyphenateStyleName = require('hyphenate-style-name');

var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hyphenateProperty(property) {
  return (0, _hyphenateStyleName2.default)(property);
}
module.exports = exports['default'];
},{"hyphenate-style-name":13}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPrefixedValue;

var regex = /-webkit-|-moz-|-ms-/;

function isPrefixedValue(value) {
  return typeof value === 'string' && regex.test(value);
}
module.exports = exports['default'];
},{}],13:[function(require,module,exports){
'use strict';

var uppercasePattern = /[A-Z]/g;
var msPattern = /^ms-/;
var cache = {};

function hyphenateStyleName(string) {
    return string in cache
    ? cache[string]
    : cache[string] = string
      .replace(uppercasePattern, '-$&')
      .toLowerCase()
      .replace(msPattern, '-ms-');
}

module.exports = hyphenateStyleName;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createPrefixer;

var _prefixProperty = require('../utils/prefixProperty');

var _prefixProperty2 = _interopRequireDefault(_prefixProperty);

var _prefixValue = require('../utils/prefixValue');

var _prefixValue2 = _interopRequireDefault(_prefixValue);

var _addNewValuesOnly = require('../utils/addNewValuesOnly');

var _addNewValuesOnly2 = _interopRequireDefault(_addNewValuesOnly);

var _isObject = require('../utils/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createPrefixer(_ref) {
  var prefixMap = _ref.prefixMap,
      plugins = _ref.plugins;

  function prefixAll(style) {
    for (var property in style) {
      var value = style[property];

      // handle nested objects
      if ((0, _isObject2.default)(value)) {
        style[property] = prefixAll(value);
        // handle array values
      } else if (Array.isArray(value)) {
        var combinedValue = [];

        for (var i = 0, len = value.length; i < len; ++i) {
          var processedValue = (0, _prefixValue2.default)(plugins, property, value[i], style, prefixMap);
          (0, _addNewValuesOnly2.default)(combinedValue, processedValue || value[i]);
        }

        // only modify the value if it was touched
        // by any plugin to prevent unnecessary mutations
        if (combinedValue.length > 0) {
          style[property] = combinedValue;
        }
      } else {
        var _processedValue = (0, _prefixValue2.default)(plugins, property, value, style, prefixMap);

        // only modify the value if it was touched
        // by any plugin to prevent unnecessary mutations
        if (_processedValue) {
          style[property] = _processedValue;
        }

        (0, _prefixProperty2.default)(prefixMap, property, style);
      }
    }

    return style;
  }

  return prefixAll;
}
module.exports = exports['default'];
},{"../utils/addNewValuesOnly":27,"../utils/isObject":29,"../utils/prefixProperty":30,"../utils/prefixValue":31}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = calc;

var _isPrefixedValue = require('css-in-js-utils/lib/isPrefixedValue');

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixes = ['-webkit-', '-moz-', ''];
function calc(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('calc(') > -1) {
    return prefixes.map(function (prefix) {
      return value.replace(/calc\(/g, prefix + 'calc(');
    });
  }
}
module.exports = exports['default'];
},{"css-in-js-utils/lib/isPrefixedValue":12}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = crossFade;

var _isPrefixedValue = require('css-in-js-utils/lib/isPrefixedValue');

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://caniuse.com/#search=cross-fade
var prefixes = ['-webkit-', ''];
function crossFade(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('cross-fade(') > -1) {
    return prefixes.map(function (prefix) {
      return value.replace(/cross-fade\(/g, prefix + 'cross-fade(');
    });
  }
}
module.exports = exports['default'];
},{"css-in-js-utils/lib/isPrefixedValue":12}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cursor;
var prefixes = ['-webkit-', '-moz-', ''];

var values = {
  'zoom-in': true,
  'zoom-out': true,
  grab: true,
  grabbing: true
};

function cursor(property, value) {
  if (property === 'cursor' && values.hasOwnProperty(value)) {
    return prefixes.map(function (prefix) {
      return prefix + value;
    });
  }
}
module.exports = exports['default'];
},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filter;

var _isPrefixedValue = require('css-in-js-utils/lib/isPrefixedValue');

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://caniuse.com/#feat=css-filter-function
var prefixes = ['-webkit-', ''];
function filter(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('filter(') > -1) {
    return prefixes.map(function (prefix) {
      return value.replace(/filter\(/g, prefix + 'filter(');
    });
  }
}
module.exports = exports['default'];
},{"css-in-js-utils/lib/isPrefixedValue":12}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flex;
var values = {
  flex: true,
  'inline-flex': true
};

function flex(property, value) {
  if (property === 'display' && values.hasOwnProperty(value)) {
    return ['-webkit-box', '-moz-box', '-ms-' + value + 'box', '-webkit-' + value, value];
  }
}
module.exports = exports['default'];
},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flexboxIE;
var alternativeValues = {
  'space-around': 'distribute',
  'space-between': 'justify',
  'flex-start': 'start',
  'flex-end': 'end'
};
var alternativeProps = {
  alignContent: 'msFlexLinePack',
  alignSelf: 'msFlexItemAlign',
  alignItems: 'msFlexAlign',
  justifyContent: 'msFlexPack',
  order: 'msFlexOrder',
  flexGrow: 'msFlexPositive',
  flexShrink: 'msFlexNegative',
  flexBasis: 'msPreferredSize'
};

function flexboxIE(property, value, style) {
  if (alternativeProps.hasOwnProperty(property)) {
    style[alternativeProps[property]] = alternativeValues[value] || value;
  }
}
module.exports = exports['default'];
},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flexboxOld;
var alternativeValues = {
  'space-around': 'justify',
  'space-between': 'justify',
  'flex-start': 'start',
  'flex-end': 'end',
  'wrap-reverse': 'multiple',
  wrap: 'multiple'
};

var alternativeProps = {
  alignItems: 'WebkitBoxAlign',
  justifyContent: 'WebkitBoxPack',
  flexWrap: 'WebkitBoxLines'
};

function flexboxOld(property, value, style) {
  if (property === 'flexDirection' && typeof value === 'string') {
    if (value.indexOf('column') > -1) {
      style.WebkitBoxOrient = 'vertical';
    } else {
      style.WebkitBoxOrient = 'horizontal';
    }
    if (value.indexOf('reverse') > -1) {
      style.WebkitBoxDirection = 'reverse';
    } else {
      style.WebkitBoxDirection = 'normal';
    }
  }
  if (alternativeProps.hasOwnProperty(property)) {
    style[alternativeProps[property]] = alternativeValues[value] || value;
  }
}
module.exports = exports['default'];
},{}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = gradient;

var _isPrefixedValue = require('css-in-js-utils/lib/isPrefixedValue');

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixes = ['-webkit-', '-moz-', ''];

var values = /linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/;

function gradient(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && values.test(value)) {
    return prefixes.map(function (prefix) {
      return prefix + value;
    });
  }
}
module.exports = exports['default'];
},{"css-in-js-utils/lib/isPrefixedValue":12}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = imageSet;

var _isPrefixedValue = require('css-in-js-utils/lib/isPrefixedValue');

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://caniuse.com/#feat=css-image-set
var prefixes = ['-webkit-', ''];
function imageSet(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('image-set(') > -1) {
    return prefixes.map(function (prefix) {
      return value.replace(/image-set\(/g, prefix + 'image-set(');
    });
  }
}
module.exports = exports['default'];
},{"css-in-js-utils/lib/isPrefixedValue":12}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = position;
function position(property, value) {
  if (property === 'position' && value === 'sticky') {
    return ['-webkit-sticky', 'sticky'];
  }
}
module.exports = exports['default'];
},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sizing;
var prefixes = ['-webkit-', '-moz-', ''];

var properties = {
  maxHeight: true,
  maxWidth: true,
  width: true,
  height: true,
  columnWidth: true,
  minWidth: true,
  minHeight: true
};
var values = {
  'min-content': true,
  'max-content': true,
  'fill-available': true,
  'fit-content': true,
  'contain-floats': true
};

function sizing(property, value) {
  if (properties.hasOwnProperty(property) && values.hasOwnProperty(value)) {
    return prefixes.map(function (prefix) {
      return prefix + value;
    });
  }
}
module.exports = exports['default'];
},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transition;

var _hyphenateProperty = require('css-in-js-utils/lib/hyphenateProperty');

var _hyphenateProperty2 = _interopRequireDefault(_hyphenateProperty);

var _isPrefixedValue = require('css-in-js-utils/lib/isPrefixedValue');

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

var _capitalizeString = require('../../utils/capitalizeString');

var _capitalizeString2 = _interopRequireDefault(_capitalizeString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var properties = {
  transition: true,
  transitionProperty: true,
  WebkitTransition: true,
  WebkitTransitionProperty: true,
  MozTransition: true,
  MozTransitionProperty: true
};


var prefixMapping = {
  Webkit: '-webkit-',
  Moz: '-moz-',
  ms: '-ms-'
};

function prefixValue(value, propertyPrefixMap) {
  if ((0, _isPrefixedValue2.default)(value)) {
    return value;
  }

  // only split multi values, not cubic beziers
  var multipleValues = value.split(/,(?![^()]*(?:\([^()]*\))?\))/g);

  for (var i = 0, len = multipleValues.length; i < len; ++i) {
    var singleValue = multipleValues[i];
    var values = [singleValue];
    for (var property in propertyPrefixMap) {
      var dashCaseProperty = (0, _hyphenateProperty2.default)(property);

      if (singleValue.indexOf(dashCaseProperty) > -1 && dashCaseProperty !== 'order') {
        var prefixes = propertyPrefixMap[property];
        for (var j = 0, pLen = prefixes.length; j < pLen; ++j) {
          // join all prefixes and create a new value
          values.unshift(singleValue.replace(dashCaseProperty, prefixMapping[prefixes[j]] + dashCaseProperty));
        }
      }
    }

    multipleValues[i] = values.join(',');
  }

  return multipleValues.join(',');
}

function transition(property, value, style, propertyPrefixMap) {
  // also check for already prefixed transitions
  if (typeof value === 'string' && properties.hasOwnProperty(property)) {
    var outputValue = prefixValue(value, propertyPrefixMap);
    // if the property is already prefixed
    var webkitOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (val) {
      return !/-moz-|-ms-/.test(val);
    }).join(',');

    if (property.indexOf('Webkit') > -1) {
      return webkitOutput;
    }

    var mozOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (val) {
      return !/-webkit-|-ms-/.test(val);
    }).join(',');

    if (property.indexOf('Moz') > -1) {
      return mozOutput;
    }

    style['Webkit' + (0, _capitalizeString2.default)(property)] = webkitOutput;
    style['Moz' + (0, _capitalizeString2.default)(property)] = mozOutput;
    return outputValue;
  }
}
module.exports = exports['default'];
},{"../../utils/capitalizeString":28,"css-in-js-utils/lib/hyphenateProperty":11,"css-in-js-utils/lib/isPrefixedValue":12}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addNewValuesOnly;
function addIfNew(list, value) {
  if (list.indexOf(value) === -1) {
    list.push(value);
  }
}

function addNewValuesOnly(list, values) {
  if (Array.isArray(values)) {
    for (var i = 0, len = values.length; i < len; ++i) {
      addIfNew(list, values[i]);
    }
  } else {
    addIfNew(list, values);
  }
}
module.exports = exports["default"];
},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = capitalizeString;
function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
module.exports = exports["default"];
},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isObject;
function isObject(value) {
  return value instanceof Object && !Array.isArray(value);
}
module.exports = exports["default"];
},{}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prefixProperty;

var _capitalizeString = require('./capitalizeString');

var _capitalizeString2 = _interopRequireDefault(_capitalizeString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prefixProperty(prefixProperties, property, style) {
  if (prefixProperties.hasOwnProperty(property)) {
    var requiredPrefixes = prefixProperties[property];
    for (var i = 0, len = requiredPrefixes.length; i < len; ++i) {
      style[requiredPrefixes[i] + (0, _capitalizeString2.default)(property)] = style[property];
    }
  }
}
module.exports = exports['default'];
},{"./capitalizeString":28}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prefixValue;
function prefixValue(plugins, property, value, style, metaData) {
  for (var i = 0, len = plugins.length; i < len; ++i) {
    var processedValue = plugins[i](property, value, style, metaData);

    // we can stop processing if a value is returned
    // as all plugin criteria are unique
    if (processedValue) {
      return processedValue;
    }
  }
}
module.exports = exports["default"];
},{}],32:[function(require,module,exports){
"use strict";

function hash(str) {
  var hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

module.exports = hash;

},{}],33:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphroditeNoImportant = require('aphrodite/no-important');

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

var _utils = require('../utils');

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function Arrow(_ref, _ref2) {
	var direction = _ref.direction;
	var icon = _ref.icon;
	var onClick = _ref.onClick;
	var size = _ref.size;

	var props = _objectWithoutProperties(_ref, ['direction', 'icon', 'onClick', 'size']);

	var theme = _ref2.theme;

	var classes = _aphroditeNoImportant.StyleSheet.create((0, _utils.deepMerge)(defaultStyles, theme));

	return _react2['default'].createElement(
		'button',
		_extends({
			type: 'button',
			className: (0, _aphroditeNoImportant.css)(classes.arrow, classes['arrow__direction__' + direction], size && classes['arrow__size__' + size]),
			onClick: onClick,
			onTouchEnd: onClick
		}, props),
		_react2['default'].createElement(_Icon2['default'], { fill: !!theme.arrow && theme.arrow.fill || _theme2['default'].arrow.fill, type: icon })
	);
};

Arrow.propTypes = {
	direction: _propTypes2['default'].oneOf(['left', 'right']),
	icon: _propTypes2['default'].string,
	onClick: _propTypes2['default'].func.isRequired,
	size: _propTypes2['default'].oneOf(['medium', 'small']).isRequired
};
Arrow.defaultProps = {
	size: 'medium'
};
Arrow.contextTypes = {
	theme: _propTypes2['default'].object.isRequired
};

var defaultStyles = {
	arrow: {
		background: 'none',
		border: 'none',
		borderRadius: 4,
		cursor: 'pointer',
		outline: 'none',
		padding: 10, // increase hit area
		position: 'absolute',
		top: '50%',

		// disable user select
		WebkitTouchCallout: 'none',
		userSelect: 'none'
	},

	// sizees
	arrow__size__medium: {
		height: _theme2['default'].arrow.height,
		marginTop: _theme2['default'].arrow.height / -2,
		width: 40,

		'@media (min-width: 768px)': {
			width: 70
		}
	},
	arrow__size__small: {
		height: _theme2['default'].thumbnail.size,
		marginTop: _theme2['default'].thumbnail.size / -2,
		width: 30,

		'@media (min-width: 500px)': {
			width: 40
		}
	},

	// direction
	arrow__direction__right: {
		right: _theme2['default'].container.gutter.horizontal
	},
	arrow__direction__left: {
		left: _theme2['default'].container.gutter.horizontal
	}
};

module.exports = Arrow;

},{"../theme":47,"../utils":51,"./Icon":37,"aphrodite/no-important":8,"prop-types":undefined,"react":undefined}],34:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphroditeNoImportant = require('aphrodite/no-important');

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

var _utils = require('../utils');

function Container(_ref, _ref2) {
	var props = _objectWithoutProperties(_ref, []);

	var theme = _ref2.theme;

	var classes = _aphroditeNoImportant.StyleSheet.create((0, _utils.deepMerge)(defaultStyles, theme));

	return _react2['default'].createElement('div', _extends({
		className: (0, _aphroditeNoImportant.css)(classes.container)
	}, props));
};

Container.contextTypes = {
	theme: _propTypes2['default'].object.isRequired
};

var defaultStyles = {
	container: {
		alignItems: 'center',
		backgroundColor: _theme2['default'].container.background,
		boxSizing: 'border-box',
		display: 'flex',
		height: '100%',
		justifyContent: 'center',
		left: 0,
		paddingBottom: _theme2['default'].container.gutter.vertical,
		paddingLeft: _theme2['default'].container.gutter.horizontal,
		paddingRight: _theme2['default'].container.gutter.horizontal,
		paddingTop: _theme2['default'].container.gutter.vertical,
		position: 'fixed',
		top: 0,
		width: '100%',
		zIndex: _theme2['default'].container.zIndex
	}
};

module.exports = Container;

},{"../theme":47,"../utils":51,"aphrodite/no-important":8,"prop-types":undefined,"react":undefined}],35:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphroditeNoImportant = require('aphrodite/no-important');

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

var _utils = require('../utils');

function Footer(_ref, _ref2) {
	var caption = _ref.caption;
	var countCurrent = _ref.countCurrent;
	var countSeparator = _ref.countSeparator;
	var countTotal = _ref.countTotal;
	var showCount = _ref.showCount;

	var props = _objectWithoutProperties(_ref, ['caption', 'countCurrent', 'countSeparator', 'countTotal', 'showCount']);

	var theme = _ref2.theme;

	if (!caption && !showCount) return null;

	var classes = _aphroditeNoImportant.StyleSheet.create((0, _utils.deepMerge)(defaultStyles, theme));

	var imageCount = showCount ? _react2['default'].createElement(
		'div',
		{ className: (0, _aphroditeNoImportant.css)(classes.footerCount) },
		countCurrent,
		countSeparator,
		countTotal
	) : _react2['default'].createElement('span', null);

	return _react2['default'].createElement(
		'div',
		_extends({ className: (0, _aphroditeNoImportant.css)(classes.footer) }, props),
		caption ? _react2['default'].createElement(
			'figcaption',
			{ className: (0, _aphroditeNoImportant.css)(classes.footerCaption) },
			caption
		) : _react2['default'].createElement('span', null),
		imageCount
	);
};

Footer.propTypes = {
	caption: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].element]),
	countCurrent: _propTypes2['default'].number,
	countSeparator: _propTypes2['default'].string,
	countTotal: _propTypes2['default'].number,
	showCount: _propTypes2['default'].bool
};
Footer.contextTypes = {
	theme: _propTypes2['default'].object.isRequired
};

var defaultStyles = {
	footer: {
		boxSizing: 'border-box',
		color: _theme2['default'].footer.color,
		cursor: 'auto',
		display: 'flex',
		justifyContent: 'space-between',
		left: 0,
		lineHeight: 1.3,
		paddingBottom: _theme2['default'].footer.gutter.vertical,
		paddingLeft: _theme2['default'].footer.gutter.horizontal,
		paddingRight: _theme2['default'].footer.gutter.horizontal,
		paddingTop: _theme2['default'].footer.gutter.vertical
	},
	footerCount: {
		color: _theme2['default'].footer.count.color,
		fontSize: _theme2['default'].footer.count.fontSize,
		paddingLeft: '1em' },
	// add a small gutter for the caption
	footerCaption: {
		flex: '1 1 0'
	}
};

module.exports = Footer;

},{"../theme":47,"../utils":51,"aphrodite/no-important":8,"prop-types":undefined,"react":undefined}],36:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphroditeNoImportant = require('aphrodite/no-important');

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

var _utils = require('../utils');

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function Header(_ref, _ref2) {
	var customControls = _ref.customControls;
	var onClose = _ref.onClose;
	var onRotate = _ref.onRotate;
	var showCloseButton = _ref.showCloseButton;
	var showRotateButton = _ref.showRotateButton;
	var closeButtonTitle = _ref.closeButtonTitle;
	var rotateButtonTitle = _ref.rotateButtonTitle;

	var props = _objectWithoutProperties(_ref, ['customControls', 'onClose', 'onRotate', 'showCloseButton', 'showRotateButton', 'closeButtonTitle', 'rotateButtonTitle']);

	var theme = _ref2.theme;

	var classes = _aphroditeNoImportant.StyleSheet.create((0, _utils.deepMerge)(defaultStyles, theme));

	return _react2['default'].createElement(
		'div',
		_extends({ className: (0, _aphroditeNoImportant.css)(classes.header) }, props),
		!!showRotateButton && _react2['default'].createElement(
			'button',
			{
				title: rotateButtonTitle,
				className: (0, _aphroditeNoImportant.css)(classes.rotate),
				onClick: onRotate
			},
			_react2['default'].createElement(_Icon2['default'], { fill: !!theme.rotate && theme.rotate.fill || _theme2['default'].rotate.fill, type: 'rotate' })
		),
		customControls ? customControls : _react2['default'].createElement('span', null),
		!!showCloseButton && _react2['default'].createElement(
			'button',
			{
				title: closeButtonTitle,
				className: (0, _aphroditeNoImportant.css)(classes.close),
				onClick: onClose
			},
			_react2['default'].createElement(_Icon2['default'], { fill: !!theme.close && theme.close.fill || _theme2['default'].close.fill, type: 'close' })
		)
	);
};

Header.propTypes = {
	customControls: _propTypes2['default'].array,
	onClose: _propTypes2['default'].func.isRequired,
	showCloseButton: _propTypes2['default'].bool
};
Header.contextTypes = {
	theme: _propTypes2['default'].object.isRequired
};

var defaultStyles = {
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		height: _theme2['default'].header.height
	},
	close: {
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		outline: 'none',
		position: 'relative',
		top: 0,
		verticalAlign: 'bottom',

		// increase hit area
		height: _theme2['default'].close.height + 20,
		marginRight: -10,
		padding: 10,
		width: _theme2['default'].close.width + 20
	},
	rotate: {
		background: 'none',
		border: 'none',
		cursor: 'pointer',
		outline: 'none',
		position: 'relative',
		top: 0,
		verticalAlign: 'bottom',

		// increase hit area
		height: _theme2['default'].close.height + 20,
		marginLeft: -10,
		padding: 10,
		width: _theme2['default'].close.width + 20
	}
};

module.exports = Header;

},{"../theme":47,"../utils":51,"./Icon":37,"aphrodite/no-important":8,"prop-types":undefined,"react":undefined}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _icons = require('../icons');

var _icons2 = _interopRequireDefault(_icons);

var Icon = function Icon(_ref) {
	var fill = _ref.fill;
	var type = _ref.type;

	var props = _objectWithoutProperties(_ref, ['fill', 'type']);

	var icon = _icons2['default'][type];

	return _react2['default'].createElement('span', _extends({
		dangerouslySetInnerHTML: { __html: icon(fill) }
	}, props));
};

Icon.propTypes = {
	fill: _propTypes2['default'].string,
	type: _propTypes2['default'].oneOf(Object.keys(_icons2['default']))
};
Icon.defaultProps = {
	fill: 'white'
};

exports['default'] = Icon;
module.exports = exports['default'];

},{"../icons":45,"prop-types":undefined,"react":undefined}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphroditeNoImportant = require('aphrodite/no-important');

var _Thumbnail = require('./Thumbnail');

var _Thumbnail2 = _interopRequireDefault(_Thumbnail);

var _Arrow = require('./Arrow');

var _Arrow2 = _interopRequireDefault(_Arrow);

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

var classes = _aphroditeNoImportant.StyleSheet.create({
	paginatedThumbnails: {
		bottom: _theme2['default'].container.gutter.vertical,
		height: _theme2['default'].thumbnail.size,
		padding: '0 50px',
		position: 'absolute',
		textAlign: 'center',
		whiteSpace: 'nowrap'
	}
});

var arrowStyles = {
	height: _theme2['default'].thumbnail.size + _theme2['default'].thumbnail.gutter * 2,
	width: 40
};

var PaginatedThumbnails = (function (_Component) {
	_inherits(PaginatedThumbnails, _Component);

	function PaginatedThumbnails(props) {
		_classCallCheck(this, PaginatedThumbnails);

		_get(Object.getPrototypeOf(PaginatedThumbnails.prototype), 'constructor', this).call(this, props);

		this.state = {
			hasCustomPage: false
		};

		this.gotoPrev = this.gotoPrev.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
	}

	_createClass(PaginatedThumbnails, [{
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			// Component should be controlled, flush state when currentImage changes
			if (nextProps.currentImage !== this.props.currentImage) {
				this.setState({
					hasCustomPage: false
				});
			}
		}

		// ==============================
		// METHODS
		// ==============================

	}, {
		key: 'getFirst',
		value: function getFirst() {
			var _props = this.props;
			var currentImage = _props.currentImage;
			var offset = _props.offset;

			if (this.state.hasCustomPage) {
				return this.clampFirst(this.state.first);
			}
			return this.clampFirst(currentImage - offset);
		}
	}, {
		key: 'setFirst',
		value: function setFirst(event, newFirst) {
			var first = this.state.first;

			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}

			if (first === newFirst) return;

			this.setState({
				hasCustomPage: true,
				first: newFirst
			});
		}
	}, {
		key: 'gotoPrev',
		value: function gotoPrev(event) {
			this.setFirst(event, this.getFirst() - this.props.offset);
		}
	}, {
		key: 'gotoNext',
		value: function gotoNext(event) {
			this.setFirst(event, this.getFirst() + this.props.offset);
		}
	}, {
		key: 'clampFirst',
		value: function clampFirst(value) {
			var _props2 = this.props;
			var images = _props2.images;
			var offset = _props2.offset;

			var totalCount = 2 * offset + 1; // show $offset extra thumbnails on each side

			if (value < 0) {
				return 0;
			} else if (value + totalCount > images.length) {
				// Too far
				return images.length - totalCount;
			} else {
				return value;
			}
		}

		// ==============================
		// RENDERERS
		// ==============================

	}, {
		key: 'renderArrowPrev',
		value: function renderArrowPrev() {
			if (this.getFirst() <= 0) return null;

			return _react2['default'].createElement(_Arrow2['default'], {
				direction: 'left',
				size: 'small',
				icon: 'arrowLeft',
				onClick: this.gotoPrev,
				style: arrowStyles,
				title: 'Previous (Left arrow key)',
				type: 'button'
			});
		}
	}, {
		key: 'renderArrowNext',
		value: function renderArrowNext() {
			var _props3 = this.props;
			var offset = _props3.offset;
			var images = _props3.images;

			var totalCount = 2 * offset + 1;
			if (this.getFirst() + totalCount >= images.length) return null;

			return _react2['default'].createElement(_Arrow2['default'], {
				direction: 'right',
				size: 'small',
				icon: 'arrowRight',
				onClick: this.gotoNext,
				style: arrowStyles,
				title: 'Previous (Right arrow key)',
				type: 'button'
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _props4 = this.props;
			var images = _props4.images;
			var currentImage = _props4.currentImage;
			var onClickThumbnail = _props4.onClickThumbnail;
			var offset = _props4.offset;

			var totalCount = 2 * offset + 1; // show $offset extra thumbnails on each side
			var thumbnails = [];
			var baseOffset = 0;
			if (images.length <= totalCount) {
				thumbnails = images;
			} else {
				// Try to center current image in list
				baseOffset = this.getFirst();
				thumbnails = images.slice(baseOffset, baseOffset + totalCount);
			}

			return _react2['default'].createElement(
				'div',
				{ className: (0, _aphroditeNoImportant.css)(classes.paginatedThumbnails) },
				this.renderArrowPrev(),
				thumbnails.map(function (img, idx) {
					return _react2['default'].createElement(_Thumbnail2['default'], _extends({ key: baseOffset + idx
					}, img, {
						index: baseOffset + idx,
						onClick: onClickThumbnail,
						active: baseOffset + idx === currentImage }));
				}),
				this.renderArrowNext()
			);
		}
	}]);

	return PaginatedThumbnails;
})(_react.Component);

exports['default'] = PaginatedThumbnails;

PaginatedThumbnails.propTypes = {
	currentImage: _propTypes2['default'].number,
	images: _propTypes2['default'].array,
	offset: _propTypes2['default'].number,
	onClickThumbnail: _propTypes2['default'].func.isRequired
};
module.exports = exports['default'];

},{"../theme":47,"./Arrow":33,"./Thumbnail":41,"aphrodite/no-important":8,"prop-types":undefined,"react":undefined}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

// Pass the Lightbox context through to the Portal's descendents
// StackOverflow discussion http://goo.gl/oclrJ9

var PassContext = (function (_Component) {
	_inherits(PassContext, _Component);

	function PassContext() {
		_classCallCheck(this, PassContext);

		_get(Object.getPrototypeOf(PassContext.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(PassContext, [{
		key: 'getChildContext',
		value: function getChildContext() {
			return this.props.context;
		}
	}, {
		key: 'render',
		value: function render() {
			return _react.Children.only(this.props.children);
		}
	}]);

	return PassContext;
})(_react.Component);

;

PassContext.propTypes = {
	context: _propTypes2['default'].object.isRequired
};
PassContext.childContextTypes = {
	theme: _propTypes2['default'].object
};

exports['default'] = PassContext;
module.exports = exports['default'];

},{"prop-types":undefined,"react":undefined}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAddonsCssTransitionGroup = require('react-addons-css-transition-group');

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

var _reactDom = require('react-dom');

var _PassContext = require('./PassContext');

var _PassContext2 = _interopRequireDefault(_PassContext);

var Portal = (function (_Component) {
	_inherits(Portal, _Component);

	function Portal() {
		_classCallCheck(this, Portal);

		_get(Object.getPrototypeOf(Portal.prototype), 'constructor', this).call(this);
		this.portalElement = null;
	}

	_createClass(Portal, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var p = document.createElement('div');
			document.body.appendChild(p);
			this.portalElement = p;
			this.componentDidUpdate();
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			// Animate fade on mount/unmount
			var duration = 200;
			var styles = '\n\t\t\t\t.fade-enter { opacity: 0.01; }\n\t\t\t\t.fade-enter.fade-enter-active { opacity: 1; transition: opacity ' + duration + 'ms; }\n\t\t\t\t.fade-leave { opacity: 1; }\n\t\t\t\t.fade-leave.fade-leave-active { opacity: 0.01; transition: opacity ' + duration + 'ms; }\n\t\t';

			(0, _reactDom.render)(_react2['default'].createElement(
				_PassContext2['default'],
				{ context: this.context },
				_react2['default'].createElement(
					'div',
					null,
					_react2['default'].createElement(
						'style',
						null,
						styles
					),
					_react2['default'].createElement(_reactAddonsCssTransitionGroup2['default'], _extends({
						component: 'div',
						transitionName: 'fade',
						transitionEnterTimeout: duration,
						transitionLeaveTimeout: duration
					}, this.props))
				)
			), this.portalElement);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			document.body.removeChild(this.portalElement);
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return Portal;
})(_react.Component);

exports['default'] = Portal;

Portal.contextTypes = {
	theme: _propTypes2['default'].object.isRequired
};
module.exports = exports['default'];

},{"./PassContext":39,"prop-types":undefined,"react":undefined,"react-addons-css-transition-group":undefined,"react-dom":undefined}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphroditeNoImportant = require('aphrodite/no-important');

var _theme = require('../theme');

var _theme2 = _interopRequireDefault(_theme);

var _utils = require('../utils');

function Thumbnail(_ref, _ref2) {
	var index = _ref.index;
	var src = _ref.src;
	var thumbnail = _ref.thumbnail;
	var active = _ref.active;
	var onClick = _ref.onClick;
	var theme = _ref2.theme;

	var url = thumbnail ? thumbnail : src;
	var classes = _aphroditeNoImportant.StyleSheet.create((0, _utils.deepMerge)(defaultStyles, theme));

	return _react2['default'].createElement('div', {
		className: (0, _aphroditeNoImportant.css)(classes.thumbnail, active && classes.thumbnail__active),
		onClick: function (e) {
			e.preventDefault();
			e.stopPropagation();
			onClick(index);
		},
		style: { backgroundImage: 'url("' + url + '")' }
	});
}

Thumbnail.propTypes = {
	active: _propTypes2['default'].bool,
	index: _propTypes2['default'].number,
	onClick: _propTypes2['default'].func.isRequired,
	src: _propTypes2['default'].string,
	thumbnail: _propTypes2['default'].string
};

Thumbnail.contextTypes = {
	theme: _propTypes2['default'].object.isRequired
};

var defaultStyles = {
	thumbnail: {
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		borderRadius: 2,
		boxShadow: 'inset 0 0 0 1px hsla(0,0%,100%,.2)',
		cursor: 'pointer',
		display: 'inline-block',
		height: _theme2['default'].thumbnail.size,
		margin: _theme2['default'].thumbnail.gutter,
		overflow: 'hidden',
		width: _theme2['default'].thumbnail.size
	},
	thumbnail__active: {
		boxShadow: 'inset 0 0 0 2px ' + _theme2['default'].thumbnail.activeBorderColor
	}
};

exports['default'] = Thumbnail;
module.exports = exports['default'];

},{"../theme":47,"../utils":51,"aphrodite/no-important":8,"prop-types":undefined,"react":undefined}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (fill) {
	return "<svg fill=\"" + fill + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" xml:space=\"preserve\">\n\t\t<path d=\"M213.7,256L213.7,256L213.7,256L380.9,81.9c4.2-4.3,4.1-11.4-0.2-15.8l-29.9-30.6c-4.3-4.4-11.3-4.5-15.5-0.2L131.1,247.9 c-2.2,2.2-3.2,5.2-3,8.1c-0.1,3,0.9,5.9,3,8.1l204.2,212.7c4.2,4.3,11.2,4.2,15.5-0.2l29.9-30.6c4.3-4.4,4.4-11.5,0.2-15.8 L213.7,256z\"/>\n\t</svg>";
};

module.exports = exports["default"];

},{}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (fill) {
	return "<svg fill=\"" + fill + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" xml:space=\"preserve\">\n\t\t<path d=\"M298.3,256L298.3,256L298.3,256L131.1,81.9c-4.2-4.3-4.1-11.4,0.2-15.8l29.9-30.6c4.3-4.4,11.3-4.5,15.5-0.2l204.2,212.7 c2.2,2.2,3.2,5.2,3,8.1c0.1,3-0.9,5.9-3,8.1L176.7,476.8c-4.2,4.3-11.2,4.2-15.5-0.2L131.3,446c-4.3-4.4-4.4-11.5-0.2-15.8 L298.3,256z\"/>\n\t</svg>";
};

module.exports = exports["default"];

},{}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (fill) {
	return "<svg fill=\"" + fill + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n\t\t<path d=\"M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4 L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1 c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1 c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z\"/>\n\t</svg>";
};

module.exports = exports["default"];

},{}],45:[function(require,module,exports){
'use strict';

module.exports = {
	arrowLeft: require('./arrowLeft'),
	arrowRight: require('./arrowRight'),
	close: require('./close'),
	rotate: require('./rotate')
};

},{"./arrowLeft":42,"./arrowRight":43,"./close":44,"./rotate":46}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (fill) {
	return "<svg fill=\"" + fill + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 385 385\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n\t\t<path d=\"M385,32.0833333 L385,144.375 C385,148.719618 383.412543,152.479384 380.23763,155.654297 C377.062717,158.82921 373.302951,160.416667 368.958333,160.416667 L256.666667,160.416667 C249.648438,160.416667 244.718967,157.074653 241.878255,150.390625 C239.037543,143.873698 240.207248,138.108724 245.38737,133.095703 L279.977214,98.5058594 C255.246311,75.6130642 226.08724,64.1666667 192.5,64.1666667 C175.121528,64.1666667 158.536784,67.5504557 142.745768,74.3180339 C126.954753,81.085612 113.294271,90.234375 101.764323,101.764323 C90.234375,113.294271 81.085612,126.954753 74.3180339,142.745768 C67.5504557,158.536784 64.1666667,175.121528 64.1666667,192.5 C64.1666667,209.878472 67.5504557,226.463216 74.3180339,242.254232 C81.085612,258.045247 90.234375,271.705729 101.764323,283.235677 C113.294271,294.765625 126.954753,303.914388 142.745768,310.681966 C158.536784,317.449544 175.121528,320.833333 192.5,320.833333 C212.384983,320.833333 231.183811,316.488715 248.896484,307.799479 C266.609158,299.110243 281.56467,286.828342 293.763021,270.953776 C294.932726,269.282769 296.854384,268.280165 299.527995,267.945964 C301.867405,267.945964 303.956163,268.697917 305.794271,270.201823 L340.133464,304.791667 C341.63737,306.128472 342.431098,307.841254 342.514648,309.930013 C342.598199,312.018772 341.971571,313.898655 340.634766,315.569661 C322.42079,337.626953 300.363498,354.712999 274.462891,366.827799 C248.562283,378.9426 221.241319,385 192.5,385 C166.432292,385 141.534288,379.903429 117.80599,369.710286 C94.077691,359.517144 73.6078559,345.814887 56.3964844,328.603516 C39.1851128,311.392144 25.4828559,290.922309 15.2897135,267.19401 C5.09657118,243.465712 0,218.567708 0,192.5 C0,166.432292 5.09657118,141.534288 15.2897135,117.80599 C25.4828559,94.077691 39.1851128,73.6078559 56.3964844,56.3964844 C73.6078559,39.1851128 94.077691,25.4828559 117.80599,15.2897135 C141.534288,5.09657118 166.432292,0 192.5,0 C217.063802,0 240.833876,4.63704427 263.810221,13.9111328 C286.786567,23.1852214 307.214627,36.2608507 325.094401,53.1380208 L357.679036,20.8040365 C362.524957,15.6239149 368.373481,14.4542101 375.224609,17.2949219 C381.741536,20.1356337 385,25.0651042 385,32.0833333 Z\" id=\"Shape\" fill=\"" + fill + "\"></path>\n\t</svg>";
};

module.exports = exports["default"];

},{}],47:[function(require,module,exports){
// ==============================
// THEME
// ==============================

'use strict';

var theme = {};

// container
theme.container = {
	background: 'rgba(0, 0, 0, 0.8)',
	gutter: {
		horizontal: 10,
		vertical: 10
	},
	zIndex: 2001
};

// header
theme.header = {
	height: 40
};
theme.close = {
	fill: 'white',
	height: 20,
	width: 20
};
theme.rotate = {
	fill: 'white',
	height: 20,
	width: 20
};

// footer
theme.footer = {
	color: 'white',
	count: {
		color: 'rgba(255, 255, 255, 0.75)',
		fontSize: '0.85em'
	},
	height: 40,
	gutter: {
		horizontal: 0,
		vertical: 5
	}
};

// thumbnails
theme.thumbnail = {
	activeBorderColor: 'white',
	size: 50,
	gutter: 2
};

// arrow
theme.arrow = {
	background: 'black',
	fill: 'white',
	height: 120
};

module.exports = theme;

},{}],48:[function(require,module,exports){
/**
	Bind multiple component methods:

	* @param {this} context
	* @param {Array} functions

	constructor() {
		...
		bindFunctions.call(this, ['handleClick', 'handleOther']);
	}
*/

"use strict";

module.exports = function bindFunctions(functions) {
	var _this = this;

	functions.forEach(function (f) {
		return _this[f] = _this[f].bind(_this);
	});
};

},{}],49:[function(require,module,exports){
// Return true if window + document

'use strict';

module.exports = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

},{}],50:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function deepMerge(target) {
	var source = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	var extended = _extends({}, target);

	Object.keys(source).forEach(function (key) {
		if (typeof source[key] !== 'object' || !source[key]) {
			extended[key] = source[key];
		} else {
			if (!target[key]) {
				extended[key] = source[key];
			} else {
				extended[key] = deepMerge(target[key], source[key]);
			}
		}
	});

	return extended;
}

module.exports = deepMerge;

},{}],51:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bindFunctions = require('./bindFunctions');

var _bindFunctions2 = _interopRequireDefault(_bindFunctions);

var _canUseDom = require('./canUseDom');

var _canUseDom2 = _interopRequireDefault(_canUseDom);

var _deepMerge = require('./deepMerge');

var _deepMerge2 = _interopRequireDefault(_deepMerge);

module.exports = {
	bindFunctions: _bindFunctions2['default'],
	canUseDom: _canUseDom2['default'],
	deepMerge: _deepMerge2['default']
};

},{"./bindFunctions":48,"./canUseDom":49,"./deepMerge":50}],"react-images":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphroditeNoImportant = require('aphrodite/no-important');

var _theme = require('./theme');

var _theme2 = _interopRequireDefault(_theme);

var _componentsArrow = require('./components/Arrow');

var _componentsArrow2 = _interopRequireDefault(_componentsArrow);

var _componentsContainer = require('./components/Container');

var _componentsContainer2 = _interopRequireDefault(_componentsContainer);

var _componentsFooter = require('./components/Footer');

var _componentsFooter2 = _interopRequireDefault(_componentsFooter);

var _componentsHeader = require('./components/Header');

var _componentsHeader2 = _interopRequireDefault(_componentsHeader);

var _componentsPaginatedThumbnails = require('./components/PaginatedThumbnails');

var _componentsPaginatedThumbnails2 = _interopRequireDefault(_componentsPaginatedThumbnails);

var _componentsPortal = require('./components/Portal');

var _componentsPortal2 = _interopRequireDefault(_componentsPortal);

var _utils = require('./utils');

var Lightbox = (function (_Component) {
	_inherits(Lightbox, _Component);

	function Lightbox() {
		_classCallCheck(this, Lightbox);

		_get(Object.getPrototypeOf(Lightbox.prototype), 'constructor', this).call(this);
		this.state = { rotate: 0, isZoomed: false };

		_utils.bindFunctions.call(this, ['gotoNext', 'gotoPrev', 'rotate', 'zoom', 'handleKeyboardInput']);
	}

	_createClass(Lightbox, [{
		key: 'getChildContext',
		value: function getChildContext() {
			return {
				theme: this.props.theme
			};
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var self = this;

			if (this.props.isOpen && this.props.enableKeyboardInput) {
				window.addEventListener('keydown', this.handleKeyboardInput);
			}

			if (this.props.zoom) {
				document.addEventListener('mousemove', function (event) {
					var posY = event.clientY;
					if (self.state.isZoomed) {
						if (posY <= window.innerHeight / 2) {
							self.setState({ margin: window.innerHeight - posY + 'px 0px 0px 0px' });
						} else {
							self.setState({ margin: '-' + posY / 1.3 + 'px 0px 0px 0px' });
						}
					}
				});
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (!_utils.canUseDom) return;

			// preload images
			if (nextProps.preloadNextImage) {
				var currentIndex = this.props.currentImage;
				var nextIndex = nextProps.currentImage + 1;
				var prevIndex = nextProps.currentImage - 1;
				var preloadIndex = undefined;

				if (currentIndex && nextProps.currentImage > currentIndex) {
					preloadIndex = nextIndex;
				} else if (currentIndex && nextProps.currentImage < currentIndex) {
					preloadIndex = prevIndex;
				}

				// if we know the user's direction just get one image
				// otherwise, to be safe, we need to grab one in each direction
				if (preloadIndex) {
					this.preloadImage(preloadIndex);
				} else {
					this.preloadImage(prevIndex);
					this.preloadImage(nextIndex);
				}
			}

			// add/remove event listeners
			if (!this.props.isOpen && nextProps.isOpen && nextProps.enableKeyboardInput) {
				window.addEventListener('keydown', this.handleKeyboardInput);
			}
			if (!nextProps.isOpen && nextProps.enableKeyboardInput) {
				window.removeEventListener('keydown', this.handleKeyboardInput);
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.props.enableKeyboardInput) {
				window.removeEventListener('keydown', this.handleKeyboardInput);
			}
		}

		// ==============================
		// METHODS
		// ==============================

	}, {
		key: 'preloadImage',
		value: function preloadImage(idx) {
			var image = this.props.images[idx];

			if (!image) return;

			var img = new Image();

			img.src = image.src;

			if (image.srcset) {
				img.srcset = image.srcset.join();
			}
		}
	}, {
		key: 'gotoNext',
		value: function gotoNext(event) {
			if (this.props.currentImage === this.props.images.length - 1) return;
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
			this.props.onClickNext();
			this.setState({ rotate: 0 });
		}
	}, {
		key: 'gotoPrev',
		value: function gotoPrev(event) {
			if (this.props.currentImage === 0) return;
			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}
			this.props.onClickPrev();
			this.setState({ rotate: 0 });
		}
	}, {
		key: 'handleKeyboardInput',
		value: function handleKeyboardInput(event) {
			if (event.keyCode === 37) {
				// left
				this.gotoPrev(event);
				return true;
			} else if (event.keyCode === 39) {
				// right
				this.gotoNext(event);
				return true;
			} else if (event.keyCode === 27) {
				// esc
				this.props.onClose();
				return true;
			}
			return false;
		}
	}, {
		key: 'rotate',
		value: function rotate(event) {

			event.preventDefault();
			event.stopPropagation();
			if (this.state.rotate === 360) {
				this.setState({ rotate: 90 });
			} else {
				this.setState({ rotate: this.state.rotate + 90 });
			}
		}
	}, {
		key: 'zoom',
		value: function zoom(event) {

			event.preventDefault();
			event.stopPropagation();
			if (this.state.isZoomed) {
				this.setState({
					isZoomed: false,
					margin: 0
				});
			} else {
				this.setState({
					isZoomed: true,
					margin: 0
				});
			}
		}
	}, {
		key: 'eventPreventDefault',
		value: function eventPreventDefault(event) {

			event.preventDefault();
			event.stopPropagation();
		}

		// ==============================
		// RENDERERS
		// ==============================

	}, {
		key: 'renderArrowPrev',
		value: function renderArrowPrev() {
			if (this.props.currentImage === 0) return null;

			return _react2['default'].createElement(_componentsArrow2['default'], {
				direction: 'left',
				icon: 'arrowLeft',
				onClick: this.gotoPrev,
				title: this.props.leftArrowTitle,
				type: 'button'
			});
		}
	}, {
		key: 'renderArrowNext',
		value: function renderArrowNext() {
			if (this.props.currentImage === this.props.images.length - 1) return null;

			return _react2['default'].createElement(_componentsArrow2['default'], {
				direction: 'right',
				icon: 'arrowRight',
				onClick: this.gotoNext,
				title: this.props.rightArrowTitle,
				type: 'button'
			});
		}
	}, {
		key: 'renderDialog',
		value: function renderDialog() {
			var _props = this.props;
			var backdropClosesModal = _props.backdropClosesModal;
			var customControls = _props.customControls;
			var isOpen = _props.isOpen;
			var onClose = _props.onClose;
			var showCloseButton = _props.showCloseButton;
			var showRotateButton = _props.showRotateButton;
			var showThumbnails = _props.showThumbnails;
			var rotateButtonTitle = _props.rotateButtonTitle;
			var width = _props.width;

			if (!isOpen) return _react2['default'].createElement('span', { key: 'closed' });

			var offsetThumbnails = 0;
			if (showThumbnails) {
				offsetThumbnails = _theme2['default'].thumbnail.size + _theme2['default'].container.gutter.vertical;
			}

			return _react2['default'].createElement(
				_componentsContainer2['default'],
				{
					key: 'open',
					onClick: !!backdropClosesModal && onClose,
					onTouchEnd: !!backdropClosesModal && onClose
				},
				_react2['default'].createElement(
					'div',
					{ className: (0, _aphroditeNoImportant.css)(classes.content), style: { marginBottom: offsetThumbnails, maxWidth: width } },
					_react2['default'].createElement(_componentsHeader2['default'], {
						customControls: customControls,
						onClose: onClose,
						onRotate: this.rotate,
						showCloseButton: showCloseButton,
						closeButtonTitle: this.props.closeButtonTitle,
						rotateButtonTitle: rotateButtonTitle,
						showRotateButton: showRotateButton
					}),
					this.renderImages()
				),
				this.renderThumbnails(),
				this.renderArrowPrev(),
				this.renderArrowNext()
			);
		}
	}, {
		key: 'renderImages',
		value: function renderImages() {
			var _props2 = this.props;
			var currentImage = _props2.currentImage;
			var images = _props2.images;
			var imageCountSeparator = _props2.imageCountSeparator;
			var onClickImage = _props2.onClickImage;
			var showImageCount = _props2.showImageCount;
			var showThumbnails = _props2.showThumbnails;

			if (!images || !images.length) return null;

			var image = images[currentImage];

			var srcset = undefined;
			var sizes = undefined;

			if (image.srcset) {
				srcset = image.srcset.join();
				sizes = '100vw';
			}

			var thumbnailsSize = showThumbnails ? _theme2['default'].thumbnail.size : 0;
			var heightOffset = _theme2['default'].header.height + _theme2['default'].footer.height + thumbnailsSize + _theme2['default'].container.gutter.vertical + 'px';

			return _react2['default'].createElement(
				'figure',
				{ className: (0, _aphroditeNoImportant.css)(classes.figure) },
				_react2['default'].createElement(
					'div',
					{ className: (0, _aphroditeNoImportant.css)(classes.imageWrapper) },
					_react2['default'].createElement('img', {
						className: (0, _aphroditeNoImportant.css)(classes.image),
						onClick: onClickImage ? onClickImage : this.props.zoom ? this.zoom : null,
						alt: image.alt,
						src: image.src,
						srcSet: srcset,
						style: {
							cursor: this.props.zoom ? !this.state.isZoomed ? 'zoom-in' : 'zoom-out' : onClickImage ? 'pointer' : 'auto',
							maxHeight: !this.state.isZoomed ? '630px' : '120vh',
							maxWidth: !this.state.isZoomed ? '574px' : '120vh',
							transform: !this.state.isZoomed ? 'scale(1) rotate(' + this.state.rotate + 'deg)' : 'scale(1.4) rotate(' + this.state.rotate + 'deg)',
							margin: this.state.margin,
							transition: 'all .1s',
							display: 'inline-block'
						}
					}),
					this.props.content ? _react2['default'].createElement(
						'figcaption',
						{
							className: (0, _aphroditeNoImportant.css)(classes.figcaption),
							style: {
								display: !this.state.isZoomed ? 'inline-block' : 'none'
							},
							onClick: this.eventPreventDefault
						},
						this.props.children
					) : ''
				),
				_react2['default'].createElement(_componentsFooter2['default'], {
					caption: images[currentImage].caption,
					countCurrent: currentImage + 1,
					countSeparator: imageCountSeparator,
					countTotal: images.length,
					showCount: showImageCount
				})
			);
		}
	}, {
		key: 'renderThumbnails',
		value: function renderThumbnails() {
			var _props3 = this.props;
			var images = _props3.images;
			var currentImage = _props3.currentImage;
			var onClickThumbnail = _props3.onClickThumbnail;
			var showThumbnails = _props3.showThumbnails;
			var thumbnailOffset = _props3.thumbnailOffset;

			if (!showThumbnails) return;

			return _react2['default'].createElement(_componentsPaginatedThumbnails2['default'], {
				currentImage: currentImage,
				images: images,
				offset: thumbnailOffset,
				onClickThumbnail: onClickThumbnail
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2['default'].createElement(
				_componentsPortal2['default'],
				null,
				this.renderDialog()
			);
		}
	}]);

	return Lightbox;
})(_react.Component);

Lightbox.propTypes = {
	backdropClosesModal: _propTypes2['default'].bool,
	closeButtonTitle: _propTypes2['default'].string,
	currentImage: _propTypes2['default'].number,
	customControls: _propTypes2['default'].arrayOf(_propTypes2['default'].node),
	enableKeyboardInput: _propTypes2['default'].bool,
	imageCountSeparator: _propTypes2['default'].string,
	images: _propTypes2['default'].arrayOf(_propTypes2['default'].shape({
		src: _propTypes2['default'].string.isRequired,
		srcset: _propTypes2['default'].array,
		caption: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].element]),
		thumbnail: _propTypes2['default'].string
	})).isRequired,
	isOpen: _propTypes2['default'].bool,
	leftArrowTitle: _propTypes2['default'].string,
	onClickImage: _propTypes2['default'].func,
	onClickNext: _propTypes2['default'].func,
	onClickPrev: _propTypes2['default'].func,
	onClose: _propTypes2['default'].func.isRequired,
	preloadNextImage: _propTypes2['default'].bool,
	rightArrowTitle: _propTypes2['default'].string,
	showCloseButton: _propTypes2['default'].bool,
	showImageCount: _propTypes2['default'].bool,
	showThumbnails: _propTypes2['default'].bool,
	theme: _propTypes2['default'].object,
	thumbnailOffset: _propTypes2['default'].number,
	width: _propTypes2['default'].number
};
Lightbox.defaultProps = {
	closeButtonTitle: 'Close (Esc)',
	rotateButtonTitle: 'Rotate',
	currentImage: 0,
	enableKeyboardInput: true,
	imageCountSeparator: ' of ',
	leftArrowTitle: 'Previous (Left arrow key)',
	onClickShowNextImage: true,
	preloadNextImage: true,
	rightArrowTitle: 'Next (Right arrow key)',
	showCloseButton: true,
	showImageCount: true,
	showRotateButton: true,
	theme: {},
	thumbnailOffset: 2,
	width: 1024,
	zoom: false,
	content: false
};
Lightbox.childContextTypes = {
	theme: _propTypes2['default'].object.isRequired
};

var classes = _aphroditeNoImportant.StyleSheet.create({
	content: {
		position: 'relative'
	},
	figure: {
		margin: 0 },
	// remove browser default
	imageWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: '#000'
	},
	image: {
		display: 'block', // removes browser default gutter
		height: 'auto',
		margin: '0 auto', // maintain center on very short screens OR very narrow image
		maxWidth: '100%',

		// disable user select
		WebkitTouchCallout: 'none',
		userSelect: 'none'
	},
	figcaption: {
		background: '#fff',
		width: '450px',
		verticalAlign: 'top',
		height: '630px',
		overflow: 'auto'
	}
});

exports['default'] = Lightbox;
module.exports = exports['default'];
/*
Re-implement when react warning "unknown props"
https://fb.me/react-unknown-prop is resolved
<Swipeable onSwipedLeft={this.gotoNext} onSwipedRight={this.gotoPrev} />
*/

},{"./components/Arrow":33,"./components/Container":34,"./components/Footer":35,"./components/Header":36,"./components/PaginatedThumbnails":38,"./components/Portal":40,"./theme":47,"./utils":51,"aphrodite/no-important":8,"prop-types":undefined,"react":undefined}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL2xpYi9leHBvcnRzLmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvZ2VuZXJhdGUuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL2xpYi9pbmplY3QuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL2xpYi9uby1pbXBvcnRhbnQuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL2xpYi9vcmRlcmVkLWVsZW1lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvc3RhdGljUHJlZml4RGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9hcGhyb2RpdGUvbGliL3V0aWwuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL25vLWltcG9ydGFudC5qcyIsIm5vZGVfbW9kdWxlcy9hc2FwL2Jyb3dzZXItYXNhcC5qcyIsIm5vZGVfbW9kdWxlcy9hc2FwL2Jyb3dzZXItcmF3LmpzIiwibm9kZV9tb2R1bGVzL2Nzcy1pbi1qcy11dGlscy9saWIvaHlwaGVuYXRlUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUuanMiLCJub2RlX21vZHVsZXMvaHlwaGVuYXRlLXN0eWxlLW5hbWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9jcmVhdGVQcmVmaXhlci5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvY2FsYy5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvY3Jvc3NGYWRlLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9jdXJzb3IuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2ZpbHRlci5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZmxleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZmxleGJveElFLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9mbGV4Ym94T2xkLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9ncmFkaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvaW1hZ2VTZXQuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL3Bvc2l0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9zaXppbmcuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL3RyYW5zaXRpb24uanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3V0aWxzL2FkZE5ld1ZhbHVlc09ubHkuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3V0aWxzL2NhcGl0YWxpemVTdHJpbmcuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3V0aWxzL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci91dGlscy9wcmVmaXhQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvdXRpbHMvcHJlZml4VmFsdWUuanMiLCJub2RlX21vZHVsZXMvc3RyaW5nLWhhc2gvaW5kZXguanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2NvbXBvbmVudHMvQXJyb3cuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2NvbXBvbmVudHMvQ29udGFpbmVyLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9jb21wb25lbnRzL0Zvb3Rlci5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvY29tcG9uZW50cy9IZWFkZXIuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2NvbXBvbmVudHMvSWNvbi5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvY29tcG9uZW50cy9QYWdpbmF0ZWRUaHVtYm5haWxzLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9jb21wb25lbnRzL1Bhc3NDb250ZXh0LmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9jb21wb25lbnRzL1BvcnRhbC5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvY29tcG9uZW50cy9UaHVtYm5haWwuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2ljb25zL2Fycm93TGVmdC5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvaWNvbnMvYXJyb3dSaWdodC5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvaWNvbnMvY2xvc2UuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2ljb25zL2luZGV4LmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9pY29ucy9yb3RhdGUuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL3RoZW1lLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy91dGlscy9iaW5kRnVuY3Rpb25zLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy91dGlscy9jYW5Vc2VEb20uanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL3V0aWxzL2RlZXBNZXJnZS5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvdXRpbHMvaW5kZXguanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL0xpZ2h0Ym94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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VCxnQkFBZSxFQUFFLENBQUM7QUFDbEIsTUFBSyxFQUFFLElBQUk7QUFDWCxLQUFJLEVBQUUsS0FBSztBQUNYLFFBQU8sRUFBRSxLQUFLO0NBQ2QsQ0FBQztBQUNGLFFBQVEsQ0FBQyxpQkFBaUIsR0FBRztBQUM1QixNQUFLLEVBQUUsdUJBQVUsTUFBTSxDQUFDLFVBQVU7Q0FDbEMsQ0FBQzs7QUFFRixJQUFNLE9BQU8sR0FBRyxpQ0FBVyxNQUFNLENBQUM7QUFDakMsUUFBTyxFQUFFO0FBQ1IsVUFBUSxFQUFFLFVBQVU7RUFDcEI7QUFDRCxPQUFNLEVBQUU7QUFDUCxRQUFNLEVBQUUsQ0FBQyxFQUNUOztBQUNELGFBQVksRUFBRTtBQUNiLFNBQU8sRUFBRSxNQUFNO0FBQ2YsWUFBVSxFQUFFLFFBQVE7QUFDcEIsZ0JBQWMsRUFBRSxRQUFRO0FBQ3hCLFlBQVUsRUFBRSxNQUFNO0VBQ2xCO0FBQ0QsTUFBSyxFQUFFO0FBQ04sU0FBTyxFQUFFLE9BQU87QUFDaEIsUUFBTSxFQUFFLE1BQU07QUFDZCxRQUFNLEVBQUUsUUFBUTtBQUNoQixVQUFRLEVBQUUsTUFBTTs7O0FBR2hCLG9CQUFrQixFQUFFLE1BQU07QUFDMUIsWUFBVSxFQUFFLE1BQU07RUFDbEI7QUFDRCxXQUFVLEVBQUU7QUFDWCxZQUFVLEVBQUUsTUFBTTtBQUNsQixPQUFLLEVBQUUsT0FBTztBQUNkLGVBQWEsRUFBRSxLQUFLO0FBQ3BCLFFBQU0sRUFBRSxPQUFPO0FBQ2YsVUFBUSxFQUFFLE1BQU07RUFDaEI7Q0FDRCxDQUFDLENBQUM7O3FCQUVZLFFBQVEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3NsaWNlZFRvQXJyYXkgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVsncmV0dXJuJ10pIF9pWydyZXR1cm4nXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlJyk7IH0gfTsgfSkoKTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbnZhciBfaW5qZWN0ID0gcmVxdWlyZSgnLi9pbmplY3QnKTtcblxuLyogOjpcbmltcG9ydCB0eXBlIHsgU2VsZWN0b3JIYW5kbGVyIH0gZnJvbSAnLi9nZW5lcmF0ZS5qcyc7XG5leHBvcnQgdHlwZSBTaGVldERlZmluaXRpb24gPSB7IFtpZDpzdHJpbmddOiBhbnkgfTtcbmV4cG9ydCB0eXBlIFNoZWV0RGVmaW5pdGlvbnMgPSBTaGVldERlZmluaXRpb24gfCBTaGVldERlZmluaXRpb25bXTtcbnR5cGUgUmVuZGVyRnVuY3Rpb24gPSAoKSA9PiBzdHJpbmc7XG50eXBlIEV4dGVuc2lvbiA9IHtcbiAgICBzZWxlY3RvckhhbmRsZXI6IFNlbGVjdG9ySGFuZGxlclxufTtcbmV4cG9ydCB0eXBlIE1heWJlU2hlZXREZWZpbml0aW9uID0gU2hlZXREZWZpbml0aW9uIHwgZmFsc2UgfCBudWxsIHwgdm9pZFxuKi9cblxudmFyIFN0eWxlU2hlZXQgPSB7XG4gICAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUoc2hlZXREZWZpbml0aW9uIC8qIDogU2hlZXREZWZpbml0aW9uICovKSB7XG4gICAgICAgIHJldHVybiAoMCwgX3V0aWwubWFwT2JqKShzaGVldERlZmluaXRpb24sIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgICAgICB2YXIgX3JlZjIgPSBfc2xpY2VkVG9BcnJheShfcmVmLCAyKTtcblxuICAgICAgICAgICAgdmFyIGtleSA9IF9yZWYyWzBdO1xuICAgICAgICAgICAgdmFyIHZhbCA9IF9yZWYyWzFdO1xuXG4gICAgICAgICAgICByZXR1cm4gW2tleSwge1xuICAgICAgICAgICAgICAgIC8vIFRPRE8oZW1pbHkpOiBNYWtlIGEgJ3Byb2R1Y3Rpb24nIG1vZGUgd2hpY2ggZG9lc24ndCBwcmVwZW5kXG4gICAgICAgICAgICAgICAgLy8gdGhlIGNsYXNzIG5hbWUgaGVyZSwgdG8gbWFrZSB0aGUgZ2VuZXJhdGVkIENTUyBzbWFsbGVyLlxuICAgICAgICAgICAgICAgIF9uYW1lOiBrZXkgKyAnXycgKyAoMCwgX3V0aWwuaGFzaE9iamVjdCkodmFsKSxcbiAgICAgICAgICAgICAgICBfZGVmaW5pdGlvbjogdmFsXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlaHlkcmF0ZTogZnVuY3Rpb24gcmVoeWRyYXRlKCkge1xuICAgICAgICB2YXIgcmVuZGVyZWRDbGFzc05hbWVzIC8qIDogc3RyaW5nW10gKi8gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1swXTtcblxuICAgICAgICAoMCwgX2luamVjdC5hZGRSZW5kZXJlZENsYXNzTmFtZXMpKHJlbmRlcmVkQ2xhc3NOYW1lcyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBVdGlsaXRpZXMgZm9yIHVzaW5nIEFwaHJvZGl0ZSBzZXJ2ZXItc2lkZS5cbiAqL1xudmFyIFN0eWxlU2hlZXRTZXJ2ZXIgPSB7XG4gICAgcmVuZGVyU3RhdGljOiBmdW5jdGlvbiByZW5kZXJTdGF0aWMocmVuZGVyRnVuYyAvKiA6IFJlbmRlckZ1bmN0aW9uICovKSB7XG4gICAgICAgICgwLCBfaW5qZWN0LnJlc2V0KSgpO1xuICAgICAgICAoMCwgX2luamVjdC5zdGFydEJ1ZmZlcmluZykoKTtcbiAgICAgICAgdmFyIGh0bWwgPSByZW5kZXJGdW5jKCk7XG4gICAgICAgIHZhciBjc3NDb250ZW50ID0gKDAsIF9pbmplY3QuZmx1c2hUb1N0cmluZykoKTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaHRtbDogaHRtbCxcbiAgICAgICAgICAgIGNzczoge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGNzc0NvbnRlbnQsXG4gICAgICAgICAgICAgICAgcmVuZGVyZWRDbGFzc05hbWVzOiAoMCwgX2luamVjdC5nZXRSZW5kZXJlZENsYXNzTmFtZXMpKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFV0aWxpdGllcyBmb3IgdXNpbmcgQXBocm9kaXRlIGluIHRlc3RzLlxuICpcbiAqIE5vdCBtZWFudCB0byBiZSB1c2VkIGluIHByb2R1Y3Rpb24uXG4gKi9cbnZhciBTdHlsZVNoZWV0VGVzdFV0aWxzID0ge1xuICAgIC8qKlxuICAgICAqIFByZXZlbnQgc3R5bGVzIGZyb20gYmVpbmcgaW5qZWN0ZWQgaW50byB0aGUgRE9NLlxuICAgICAqXG4gICAgICogVGhpcyBpcyB1c2VmdWwgaW4gc2l0dWF0aW9ucyB3aGVyZSB5b3UnZCBsaWtlIHRvIHRlc3QgcmVuZGVyaW5nIFVJXG4gICAgICogY29tcG9uZW50cyB3aGljaCB1c2UgQXBocm9kaXRlIHdpdGhvdXQgYW55IG9mIHRoZSBzaWRlLWVmZmVjdHMgb2ZcbiAgICAgKiBBcGhyb2RpdGUgaGFwcGVuaW5nLiBQYXJ0aWN1bGFybHkgdXNlZnVsIGZvciB0ZXN0aW5nIHRoZSBvdXRwdXQgb2ZcbiAgICAgKiBjb21wb25lbnRzIHdoZW4geW91IGhhdmUgbm8gRE9NLCBlLmcuIHRlc3RpbmcgaW4gTm9kZSB3aXRob3V0IGEgZmFrZSBET00uXG4gICAgICpcbiAgICAgKiBTaG91bGQgYmUgcGFpcmVkIHdpdGggYSBzdWJzZXF1ZW50IGNhbGwgdG9cbiAgICAgKiBjbGVhckJ1ZmZlckFuZFJlc3VtZVN0eWxlSW5qZWN0aW9uLlxuICAgICAqL1xuICAgIHN1cHByZXNzU3R5bGVJbmplY3Rpb246IGZ1bmN0aW9uIHN1cHByZXNzU3R5bGVJbmplY3Rpb24oKSB7XG4gICAgICAgICgwLCBfaW5qZWN0LnJlc2V0KSgpO1xuICAgICAgICAoMCwgX2luamVjdC5zdGFydEJ1ZmZlcmluZykoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogT3Bwb3NpdGUgbWV0aG9kIG9mIHByZXZlbnRTdHlsZUluamVjdC5cbiAgICAgKi9cbiAgICBjbGVhckJ1ZmZlckFuZFJlc3VtZVN0eWxlSW5qZWN0aW9uOiBmdW5jdGlvbiBjbGVhckJ1ZmZlckFuZFJlc3VtZVN0eWxlSW5qZWN0aW9uKCkge1xuICAgICAgICAoMCwgX2luamVjdC5yZXNldCkoKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlIHRoZSBBcGhyb2RpdGUgQVBJIGV4cG9ydHMsIHdpdGggZ2l2ZW4gYHNlbGVjdG9ySGFuZGxlcnNgIGFuZFxuICogYHVzZUltcG9ydGFudGAgc3RhdGUuXG4gKi9cbnZhciBtYWtlRXhwb3J0cyA9IGZ1bmN0aW9uIG1ha2VFeHBvcnRzKHVzZUltcG9ydGFudCwgLyogOiBib29sZWFuICovXG5zZWxlY3RvckhhbmRsZXJzIC8qIDogU2VsZWN0b3JIYW5kbGVyW10gKi9cbikge1xuICAgIHJldHVybiB7XG4gICAgICAgIFN0eWxlU2hlZXQ6IF9leHRlbmRzKHt9LCBTdHlsZVNoZWV0LCB7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmV0dXJucyBhIHZlcnNpb24gb2YgdGhlIGV4cG9ydHMgb2YgQXBocm9kaXRlIChpLmUuIGFuIG9iamVjdFxuICAgICAgICAgICAgICogd2l0aCBgY3NzYCBhbmQgYFN0eWxlU2hlZXRgIHByb3BlcnRpZXMpIHdoaWNoIGhhdmUgc29tZVxuICAgICAgICAgICAgICogZXh0ZW5zaW9ucyBpbmNsdWRlZC5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBleHRlbnNpb25zOiBBbiBhcnJheSBvZiBleHRlbnNpb25zIHRvXG4gICAgICAgICAgICAgKiAgICAgYWRkIHRvIHRoaXMgaW5zdGFuY2Ugb2YgQXBocm9kaXRlLiBFYWNoIG9iamVjdCBzaG91bGQgaGF2ZSBhXG4gICAgICAgICAgICAgKiAgICAgc2luZ2xlIHByb3BlcnR5IG9uIGl0LCBkZWZpbmluZyB3aGljaCBraW5kIG9mIGV4dGVuc2lvbiB0b1xuICAgICAgICAgICAgICogICAgIGFkZC5cbiAgICAgICAgICAgICAqIEBwYXJhbSB7U2VsZWN0b3JIYW5kbGVyfSBbZXh0ZW5zaW9uc1tdLnNlbGVjdG9ySGFuZGxlcl06IEFcbiAgICAgICAgICAgICAqICAgICBzZWxlY3RvciBoYW5kbGVyIGV4dGVuc2lvbi4gU2VlIGBkZWZhdWx0U2VsZWN0b3JIYW5kbGVyc2AgaW5cbiAgICAgICAgICAgICAqICAgICBnZW5lcmF0ZS5qcy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgZXhwb3J0cyBvZiB0aGUgbmV3XG4gICAgICAgICAgICAgKiAgICAgaW5zdGFuY2Ugb2YgQXBocm9kaXRlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBleHRlbmQ6IGZ1bmN0aW9uIGV4dGVuZChleHRlbnNpb25zIC8qIDogRXh0ZW5zaW9uW10gKi8pIHtcbiAgICAgICAgICAgICAgICB2YXIgZXh0ZW5zaW9uU2VsZWN0b3JIYW5kbGVycyA9IGV4dGVuc2lvbnNcbiAgICAgICAgICAgICAgICAvLyBQdWxsIG91dCBleHRlbnNpb25zIHdpdGggYSBzZWxlY3RvckhhbmRsZXIgcHJvcGVydHlcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChleHRlbnNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4dGVuc2lvbi5zZWxlY3RvckhhbmRsZXI7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgbnVsbHMgKGkuZS4gZXh0ZW5zaW9ucyB3aXRob3V0IGEgc2VsZWN0b3JIYW5kbGVyXG4gICAgICAgICAgICAgICAgLy8gcHJvcGVydHkpLlxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbWFrZUV4cG9ydHModXNlSW1wb3J0YW50LCBzZWxlY3RvckhhbmRsZXJzLmNvbmNhdChleHRlbnNpb25TZWxlY3RvckhhbmRsZXJzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuXG4gICAgICAgIFN0eWxlU2hlZXRTZXJ2ZXI6IFN0eWxlU2hlZXRTZXJ2ZXIsXG4gICAgICAgIFN0eWxlU2hlZXRUZXN0VXRpbHM6IFN0eWxlU2hlZXRUZXN0VXRpbHMsXG5cbiAgICAgICAgY3NzOiBmdW5jdGlvbiBjc3MoKSAvKiA6IE1heWJlU2hlZXREZWZpbml0aW9uW10gKi97XG4gICAgICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgc3R5bGVEZWZpbml0aW9ucyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICAgICAgICAgIHN0eWxlRGVmaW5pdGlvbnNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAoMCwgX2luamVjdC5pbmplY3RBbmRHZXRDbGFzc05hbWUpKHVzZUltcG9ydGFudCwgc3R5bGVEZWZpbml0aW9ucywgc2VsZWN0b3JIYW5kbGVycyk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWtlRXhwb3J0czsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9pbmxpbmVTdHlsZVByZWZpeGVyU3RhdGljQ3JlYXRlUHJlZml4ZXIgPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL2NyZWF0ZVByZWZpeGVyJyk7XG5cbnZhciBfaW5saW5lU3R5bGVQcmVmaXhlclN0YXRpY0NyZWF0ZVByZWZpeGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lubGluZVN0eWxlUHJlZml4ZXJTdGF0aWNDcmVhdGVQcmVmaXhlcik7XG5cbnZhciBfbGliU3RhdGljUHJlZml4RGF0YSA9IHJlcXVpcmUoJy4uL2xpYi9zdGF0aWNQcmVmaXhEYXRhJyk7XG5cbnZhciBfbGliU3RhdGljUHJlZml4RGF0YTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9saWJTdGF0aWNQcmVmaXhEYXRhKTtcblxudmFyIF9vcmRlcmVkRWxlbWVudHMgPSByZXF1aXJlKCcuL29yZGVyZWQtZWxlbWVudHMnKTtcblxudmFyIF9vcmRlcmVkRWxlbWVudHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3JkZXJlZEVsZW1lbnRzKTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbnZhciBwcmVmaXhBbGwgPSAoMCwgX2lubGluZVN0eWxlUHJlZml4ZXJTdGF0aWNDcmVhdGVQcmVmaXhlcjJbJ2RlZmF1bHQnXSkoX2xpYlN0YXRpY1ByZWZpeERhdGEyWydkZWZhdWx0J10pO1xuXG4vKiA6OlxuaW1wb3J0IHR5cGUgeyBTaGVldERlZmluaXRpb24gfSBmcm9tICcuL2luZGV4LmpzJztcbnR5cGUgU3RyaW5nSGFuZGxlcnMgPSB7IFtpZDpzdHJpbmddOiBGdW5jdGlvbiB9O1xudHlwZSBTZWxlY3RvckNhbGxiYWNrID0gKHNlbGVjdG9yOiBzdHJpbmcpID0+IGFueTtcbmV4cG9ydCB0eXBlIFNlbGVjdG9ySGFuZGxlciA9IChcbiAgICBzZWxlY3Rvcjogc3RyaW5nLFxuICAgIGJhc2VTZWxlY3Rvcjogc3RyaW5nLFxuICAgIGNhbGxiYWNrOiBTZWxlY3RvckNhbGxiYWNrXG4pID0+IHN0cmluZyB8IG51bGw7XG4qL1xuXG4vKipcbiAqIGBzZWxlY3RvckhhbmRsZXJzYCBhcmUgZnVuY3Rpb25zIHdoaWNoIGhhbmRsZSBzcGVjaWFsIHNlbGVjdG9ycyB3aGljaCBhY3RcbiAqIGRpZmZlcmVudGx5IHRoYW4gbm9ybWFsIHN0eWxlIGRlZmluaXRpb25zLiBUaGVzZSBmdW5jdGlvbnMgbG9vayBhdCB0aGVcbiAqIGN1cnJlbnQgc2VsZWN0b3IgYW5kIGNhbiBnZW5lcmF0ZSBDU1MgZm9yIHRoZSBzdHlsZXMgaW4gdGhlaXIgc3VidHJlZSBieVxuICogY2FsbGluZyB0aGUgY2FsbGJhY2sgd2l0aCBhIG5ldyBzZWxlY3Rvci5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgd2hlbiBnZW5lcmF0aW5nIHN0eWxlcyB3aXRoIGEgYmFzZSBzZWxlY3RvciBvZiAnLmZvbycgYW5kIHRoZVxuICogZm9sbG93aW5nIHN0eWxlcyBvYmplY3Q6XG4gKlxuICogICB7XG4gKiAgICAgJzpudGgtY2hpbGQoMm4pJzoge1xuICogICAgICAgJzpob3Zlcic6IHtcbiAqICAgICAgICAgY29sb3I6ICdyZWQnXG4gKiAgICAgICB9XG4gKiAgICAgfVxuICogICB9XG4gKlxuICogd2hlbiB3ZSByZWFjaCB0aGUgJzpob3Zlcicgc3R5bGUsIHdlIHdvdWxkIGNhbGwgb3VyIHNlbGVjdG9yIGhhbmRsZXJzIGxpa2VcbiAqXG4gKiAgIGhhbmRsZXIoJzpob3ZlcicsICcuZm9vOm50aC1jaGlsZCgybiknLCBjYWxsYmFjaylcbiAqXG4gKiBTaW5jZSBvdXIgYHBzZXVkb1NlbGVjdG9yc2AgaGFuZGxlcyAnOmhvdmVyJyBzdHlsZXMsIHRoYXQgaGFuZGxlciB3b3VsZCBjYWxsXG4gKiB0aGUgY2FsbGJhY2sgbGlrZVxuICpcbiAqICAgY2FsbGJhY2soJy5mb286bnRoLWNoaWxkKDJuKTpob3ZlcicpXG4gKlxuICogdG8gZ2VuZXJhdGUgaXRzIHN1YnRyZWUgYHsgY29sb3I6ICdyZWQnIH1gIHN0eWxlcyB3aXRoIGFcbiAqICcuZm9vOm50aC1jaGlsZCgybik6aG92ZXInIHNlbGVjdG9yLiBUaGUgY2FsbGJhY2sgd291bGQgcmV0dXJuIENTUyBsaWtlXG4gKlxuICogICAnLmZvbzpudGgtY2hpbGQoMm4pOmhvdmVye2NvbG9yOnJlZCAhaW1wb3J0YW50O30nXG4gKlxuICogYW5kIHRoZSBoYW5kbGVyIHdvdWxkIHRoZW4gcmV0dXJuIHRoYXQgcmVzdWx0aW5nIENTUy5cbiAqXG4gKiBgZGVmYXVsdFNlbGVjdG9ySGFuZGxlcnNgIGlzIHRoZSBsaXN0IG9mIGRlZmF1bHQgaGFuZGxlcnMgdXNlZCBpbiBhIGNhbGwgdG9cbiAqIGBnZW5lcmF0ZUNTU2AuXG4gKlxuICogQG5hbWUgU2VsZWN0b3JIYW5kbGVyXG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvcjogVGhlIGN1cnJlbnRseSBpbnNwZWN0ZWQgc2VsZWN0b3IuICc6aG92ZXInIGluIHRoZVxuICogICAgIGV4YW1wbGUgYWJvdmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gYmFzZVNlbGVjdG9yOiBUaGUgc2VsZWN0b3Igb2YgdGhlIHBhcmVudCBzdHlsZXMuXG4gKiAgICAgJy5mb286bnRoLWNoaWxkKDJuKScgaW4gdGhlIGV4YW1wbGUgYWJvdmUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBnZW5lcmF0ZVN1YnRyZWVTdHlsZXM6IEEgZnVuY3Rpb24gd2hpY2ggY2FuIGJlIGNhbGxlZCB0b1xuICogICAgIGdlbmVyYXRlIENTUyBmb3IgdGhlIHN1YnRyZWUgb2Ygc3R5bGVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHNlbGVjdG9yLlxuICogICAgIEFjY2VwdHMgYSBuZXcgYmFzZVNlbGVjdG9yIHRvIHVzZSBmb3IgZ2VuZXJhdGluZyB0aG9zZSBzdHlsZXMuXG4gKiBAcmV0dXJucyB7P3N0cmluZ30gVGhlIGdlbmVyYXRlZCBDU1MgZm9yIHRoaXMgc2VsZWN0b3IsIG9yIG51bGwgaWYgd2UgZG9uJ3RcbiAqICAgICBoYW5kbGUgdGhpcyBzZWxlY3Rvci5cbiAqL1xudmFyIGRlZmF1bHRTZWxlY3RvckhhbmRsZXJzID0gW1xuLy8gSGFuZGxlIHBzZXVkby1zZWxlY3RvcnMsIGxpa2UgOmhvdmVyIGFuZCA6bnRoLWNoaWxkKDNuKVxuZnVuY3Rpb24gcHNldWRvU2VsZWN0b3JzKHNlbGVjdG9yLCAvKiA6IHN0cmluZyAqL1xuYmFzZVNlbGVjdG9yLCAvKiA6IHN0cmluZyAqL1xuZ2VuZXJhdGVTdWJ0cmVlU3R5bGVzIC8qIDogRnVuY3Rpb24gKi9cbikgLyogKi97XG4gICAgaWYgKHNlbGVjdG9yWzBdICE9PSBcIjpcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGdlbmVyYXRlU3VidHJlZVN0eWxlcyhiYXNlU2VsZWN0b3IgKyBzZWxlY3Rvcik7XG59LFxuXG4vLyBIYW5kbGUgbWVkaWEgcXVlcmllcyAob3IgZm9udC1mYWNlcylcbmZ1bmN0aW9uIG1lZGlhUXVlcmllcyhzZWxlY3RvciwgLyogOiBzdHJpbmcgKi9cbmJhc2VTZWxlY3RvciwgLyogOiBzdHJpbmcgKi9cbmdlbmVyYXRlU3VidHJlZVN0eWxlcyAvKiA6IEZ1bmN0aW9uICovXG4pIC8qICove1xuICAgIGlmIChzZWxlY3RvclswXSAhPT0gXCJAXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIEdlbmVyYXRlIHRoZSBzdHlsZXMgbm9ybWFsbHksIGFuZCB0aGVuIHdyYXAgdGhlbSBpbiB0aGUgbWVkaWEgcXVlcnkuXG4gICAgdmFyIGdlbmVyYXRlZCA9IGdlbmVyYXRlU3VidHJlZVN0eWxlcyhiYXNlU2VsZWN0b3IpO1xuICAgIHJldHVybiBzZWxlY3RvciArICd7JyArIGdlbmVyYXRlZCArICd9Jztcbn1dO1xuXG5leHBvcnRzLmRlZmF1bHRTZWxlY3RvckhhbmRsZXJzID0gZGVmYXVsdFNlbGVjdG9ySGFuZGxlcnM7XG4vKipcbiAqIEdlbmVyYXRlIENTUyBmb3IgYSBzZWxlY3RvciBhbmQgc29tZSBzdHlsZXMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBoYW5kbGVzIHRoZSBtZWRpYSBxdWVyaWVzIGFuZCBwc2V1ZG8gc2VsZWN0b3JzIHRoYXQgY2FuIGJlIHVzZWRcbiAqIGluIGFwaHJvZGl0ZSBzdHlsZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yOiBBIGJhc2UgQ1NTIHNlbGVjdG9yIGZvciB0aGUgc3R5bGVzIHRvIGJlIGdlbmVyYXRlZFxuICogICAgIHdpdGguXG4gKiBAcGFyYW0ge09iamVjdH0gc3R5bGVUeXBlczogQSBsaXN0IG9mIHByb3BlcnRpZXMgb2YgdGhlIHJldHVybiB0eXBlIG9mXG4gKiAgICAgU3R5bGVTaGVldC5jcmVhdGUsIGUuZy4gW3N0eWxlcy5yZWQsIHN0eWxlcy5ibHVlXS5cbiAqIEBwYXJhbSB7QXJyYXkuPFNlbGVjdG9ySGFuZGxlcj59IHNlbGVjdG9ySGFuZGxlcnM6IEEgbGlzdCBvZiBzZWxlY3RvclxuICogICAgIGhhbmRsZXJzIHRvIHVzZSBmb3IgaGFuZGxpbmcgc3BlY2lhbCBzZWxlY3RvcnMuIFNlZVxuICogICAgIGBkZWZhdWx0U2VsZWN0b3JIYW5kbGVyc2AuXG4gKiBAcGFyYW0gc3RyaW5nSGFuZGxlcnM6IFNlZSBgZ2VuZXJhdGVDU1NSdWxlc2V0YFxuICogQHBhcmFtIHVzZUltcG9ydGFudDogU2VlIGBnZW5lcmF0ZUNTU1J1bGVzZXRgXG4gKlxuICogVG8gYWN0dWFsbHkgZ2VuZXJhdGUgdGhlIENTUyBzcGVjaWFsLWNvbnN0cnVjdC1sZXNzIHN0eWxlcyBhcmUgcGFzc2VkIHRvXG4gKiBgZ2VuZXJhdGVDU1NSdWxlc2V0YC5cbiAqXG4gKiBGb3IgaW5zdGFuY2UsIGEgY2FsbCB0b1xuICpcbiAqICAgICBnZW5lcmF0ZUNTUyhcIi5mb29cIiwgW3tcbiAqICAgICAgIGNvbG9yOiBcInJlZFwiLFxuICogICAgICAgXCJAbWVkaWEgc2NyZWVuXCI6IHtcbiAqICAgICAgICAgaGVpZ2h0OiAyMCxcbiAqICAgICAgICAgXCI6aG92ZXJcIjoge1xuICogICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogXCJibGFja1wiXG4gKiAgICAgICAgIH1cbiAqICAgICAgIH0sXG4gKiAgICAgICBcIjphY3RpdmVcIjoge1xuICogICAgICAgICBmb250V2VpZ2h0OiBcImJvbGRcIlxuICogICAgICAgfVxuICogICAgIH1dLCBkZWZhdWx0U2VsZWN0b3JIYW5kbGVycyk7XG4gKlxuICogd2l0aCB0aGUgZGVmYXVsdCBgc2VsZWN0b3JIYW5kbGVyc2Agd2lsbCBtYWtlIDUgY2FsbHMgdG9cbiAqIGBnZW5lcmF0ZUNTU1J1bGVzZXRgOlxuICpcbiAqICAgICBnZW5lcmF0ZUNTU1J1bGVzZXQoXCIuZm9vXCIsIHsgY29sb3I6IFwicmVkXCIgfSwgLi4uKVxuICogICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5mb286YWN0aXZlXCIsIHsgZm9udFdlaWdodDogXCJib2xkXCIgfSwgLi4uKVxuICogICAgIC8vIFRoZXNlIDIgd2lsbCBiZSB3cmFwcGVkIGluIEBtZWRpYSBzY3JlZW4ge31cbiAqICAgICBnZW5lcmF0ZUNTU1J1bGVzZXQoXCIuZm9vXCIsIHsgaGVpZ2h0OiAyMCB9LCAuLi4pXG4gKiAgICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmZvbzpob3ZlclwiLCB7IGJhY2tncm91bmRDb2xvcjogXCJibGFja1wiIH0sIC4uLilcbiAqL1xudmFyIGdlbmVyYXRlQ1NTID0gZnVuY3Rpb24gZ2VuZXJhdGVDU1Moc2VsZWN0b3IsIC8qIDogc3RyaW5nICovXG5zdHlsZVR5cGVzLCAvKiA6IFNoZWV0RGVmaW5pdGlvbltdICovXG5zZWxlY3RvckhhbmRsZXJzLCAvKiA6IFNlbGVjdG9ySGFuZGxlcltdICovXG5zdHJpbmdIYW5kbGVycywgLyogOiBTdHJpbmdIYW5kbGVycyAqL1xudXNlSW1wb3J0YW50IC8qIDogYm9vbGVhbiAqL1xuKSAvKiA6IHN0cmluZyAqL3tcbiAgICB2YXIgbWVyZ2VkID0gbmV3IF9vcmRlcmVkRWxlbWVudHMyWydkZWZhdWx0J10oKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVUeXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBtZXJnZWQuYWRkU3R5bGVUeXBlKHN0eWxlVHlwZXNbaV0pO1xuICAgIH1cblxuICAgIHZhciBwbGFpbkRlY2xhcmF0aW9ucyA9IG5ldyBfb3JkZXJlZEVsZW1lbnRzMlsnZGVmYXVsdCddKCk7XG4gICAgdmFyIGdlbmVyYXRlZFN0eWxlcyA9IFwiXCI7XG5cbiAgICAvLyBUT0RPKGVtaWx5KTogYmVuY2htYXJrIHRoaXMgdG8gc2VlIGlmIGEgcGxhaW4gZm9yIGxvb3Agd291bGQgYmUgZmFzdGVyLlxuICAgIG1lcmdlZC5mb3JFYWNoKGZ1bmN0aW9uICh2YWwsIGtleSkge1xuICAgICAgICAvLyBGb3IgZWFjaCBrZXksIHNlZSBpZiBvbmUgb2YgdGhlIHNlbGVjdG9yIGhhbmRsZXJzIHdpbGwgaGFuZGxlIHRoZXNlXG4gICAgICAgIC8vIHN0eWxlcy5cbiAgICAgICAgdmFyIGZvdW5kSGFuZGxlciA9IHNlbGVjdG9ySGFuZGxlcnMuc29tZShmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGhhbmRsZXIoa2V5LCBzZWxlY3RvciwgZnVuY3Rpb24gKG5ld1NlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYXRlQ1NTKG5ld1NlbGVjdG9yLCBbdmFsXSwgc2VsZWN0b3JIYW5kbGVycywgc3RyaW5nSGFuZGxlcnMsIHVzZUltcG9ydGFudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBoYW5kbGVyIHJldHVybmVkIHNvbWV0aGluZywgYWRkIGl0IHRvIHRoZSBnZW5lcmF0ZWRcbiAgICAgICAgICAgICAgICAvLyBDU1MgYW5kIHN0b3AgbG9va2luZyBmb3IgYW5vdGhlciBoYW5kbGVyLlxuICAgICAgICAgICAgICAgIGdlbmVyYXRlZFN0eWxlcyArPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBJZiBub25lIG9mIHRoZSBoYW5kbGVycyBoYW5kbGVkIGl0LCBhZGQgaXQgdG8gdGhlIGxpc3Qgb2YgcGxhaW5cbiAgICAgICAgLy8gc3R5bGUgZGVjbGFyYXRpb25zLlxuICAgICAgICBpZiAoIWZvdW5kSGFuZGxlcikge1xuICAgICAgICAgICAgcGxhaW5EZWNsYXJhdGlvbnMuc2V0KGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRlQ1NTUnVsZXNldChzZWxlY3RvciwgcGxhaW5EZWNsYXJhdGlvbnMsIHN0cmluZ0hhbmRsZXJzLCB1c2VJbXBvcnRhbnQsIHNlbGVjdG9ySGFuZGxlcnMpICsgZ2VuZXJhdGVkU3R5bGVzO1xufTtcblxuZXhwb3J0cy5nZW5lcmF0ZUNTUyA9IGdlbmVyYXRlQ1NTO1xuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIG9mIGdlbmVyYXRlQ1NTUnVsZXNldCB0byBmYWNpbGl0YXRlIGN1c3RvbSBoYW5kbGluZyBvZiBjZXJ0YWluXG4gKiBDU1MgcHJvcGVydGllcy4gVXNlZCBmb3IgZS5nLiBmb250IGZhbWlsaWVzLlxuICpcbiAqIFNlZSBnZW5lcmF0ZUNTU1J1bGVzZXQgZm9yIHVzYWdlIGFuZCBkb2N1bWVudGF0aW9uIG9mIHBhcmFtYXRlciB0eXBlcy5cbiAqL1xudmFyIHJ1blN0cmluZ0hhbmRsZXJzID0gZnVuY3Rpb24gcnVuU3RyaW5nSGFuZGxlcnMoZGVjbGFyYXRpb25zLCAvKiA6IE9yZGVyZWRFbGVtZW50cyAqL1xuc3RyaW5nSGFuZGxlcnMsIC8qIDogU3RyaW5nSGFuZGxlcnMgKi9cbnNlbGVjdG9ySGFuZGxlcnMgLyogOiBTZWxlY3RvckhhbmRsZXJbXSAqL1xuKSAvKiA6IE9yZGVyZWRFbGVtZW50cyAqL3tcbiAgICBpZiAoIXN0cmluZ0hhbmRsZXJzKSB7XG4gICAgICAgIHJldHVybiBkZWNsYXJhdGlvbnM7XG4gICAgfVxuXG4gICAgdmFyIHN0cmluZ0hhbmRsZXJLZXlzID0gT2JqZWN0LmtleXMoc3RyaW5nSGFuZGxlcnMpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nSGFuZGxlcktleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IHN0cmluZ0hhbmRsZXJLZXlzW2ldO1xuICAgICAgICBpZiAoZGVjbGFyYXRpb25zLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICAvLyBBIGRlY2xhcmF0aW9uIGV4aXN0cyBmb3IgdGhpcyBwYXJ0aWN1bGFyIHN0cmluZyBoYW5kbGVyLCBzbyB3ZVxuICAgICAgICAgICAgLy8gbmVlZCB0byBsZXQgdGhlIHN0cmluZyBoYW5kbGVyIGludGVycHJldCB0aGUgZGVjbGFyYXRpb24gZmlyc3RcbiAgICAgICAgICAgIC8vIGJlZm9yZSBwcm9jZWVkaW5nLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIFRPRE8oZW1pbHkpOiBQYXNzIGluIGEgY2FsbGJhY2sgd2hpY2ggZ2VuZXJhdGVzIENTUywgc2ltaWxhciB0b1xuICAgICAgICAgICAgLy8gaG93IG91ciBzZWxlY3RvciBoYW5kbGVycyB3b3JrLCBpbnN0ZWFkIG9mIHBhc3NpbmcgaW5cbiAgICAgICAgICAgIC8vIGBzZWxlY3RvckhhbmRsZXJzYCBhbmQgaGF2ZSB0aGVtIG1ha2UgY2FsbHMgdG8gYGdlbmVyYXRlQ1NTYFxuICAgICAgICAgICAgLy8gdGhlbXNlbHZlcy4gUmlnaHQgbm93LCB0aGlzIGlzIGltcHJhY3RpY2FsIGJlY2F1c2Ugb3VyIHN0cmluZ1xuICAgICAgICAgICAgLy8gaGFuZGxlcnMgYXJlIHZlcnkgc3BlY2lhbGl6ZWQgYW5kIGRvIGNvbXBsZXggdGhpbmdzLlxuICAgICAgICAgICAgZGVjbGFyYXRpb25zLnNldChrZXksIHN0cmluZ0hhbmRsZXJzW2tleV0oZGVjbGFyYXRpb25zLmdldChrZXkpLCBzZWxlY3RvckhhbmRsZXJzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVjbGFyYXRpb25zO1xufTtcblxudmFyIHRyYW5zZm9ybVJ1bGUgPSBmdW5jdGlvbiB0cmFuc2Zvcm1SdWxlKGtleSwgLyogOiBzdHJpbmcgKi9cbnZhbHVlLCAvKiA6IHN0cmluZyAqL1xudHJhbnNmb3JtVmFsdWUgLyogOiBmdW5jdGlvbiAqL1xuKSB7XG4gICAgcmV0dXJuICgvKiA6IHN0cmluZyAqLygwLCBfdXRpbC5rZWJhYmlmeVN0eWxlTmFtZSkoa2V5KSArICc6JyArIHRyYW5zZm9ybVZhbHVlKGtleSwgdmFsdWUpICsgJzsnXG4gICAgKTtcbn07XG5cbi8qKlxuICogR2VuZXJhdGUgYSBDU1MgcnVsZXNldCB3aXRoIHRoZSBzZWxlY3RvciBhbmQgY29udGFpbmluZyB0aGUgZGVjbGFyYXRpb25zLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gYXNzdW1lcyB0aGF0IHRoZSBnaXZlbiBkZWNsYXJhdGlvbnMgZG9uJ3QgY29udGFpbiBhbnkgc3BlY2lhbFxuICogY2hpbGRyZW4gKHN1Y2ggYXMgbWVkaWEgcXVlcmllcywgcHNldWRvLXNlbGVjdG9ycywgb3IgZGVzY2VuZGFudCBzdHlsZXMpLlxuICpcbiAqIE5vdGUgdGhhdCB0aGlzIG1ldGhvZCBkb2VzIG5vdCBkZWFsIHdpdGggbmVzdGluZyB1c2VkIGZvciBlLmcuXG4gKiBwc3VlZG8tc2VsZWN0b3JzIG9yIG1lZGlhIHF1ZXJpZXMuIFRoYXQgcmVzcG9uc2liaWxpdHkgaXMgbGVmdCB0byAgdGhlXG4gKiBgZ2VuZXJhdGVDU1NgIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvcjogdGhlIHNlbGVjdG9yIGFzc29jaWF0ZWQgd2l0aCB0aGUgcnVsZXNldFxuICogQHBhcmFtIHtPYmplY3R9IGRlY2xhcmF0aW9uczogYSBtYXAgZnJvbSBjYW1lbENhc2VkIENTUyBwcm9wZXJ0eSBuYW1lIHRvIENTU1xuICogICAgIHByb3BlcnR5IHZhbHVlLlxuICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywgZnVuY3Rpb24+fSBzdHJpbmdIYW5kbGVyczogYSBtYXAgZnJvbSBjYW1lbENhc2VkIENTU1xuICogICAgIHByb3BlcnR5IG5hbWUgdG8gYSBmdW5jdGlvbiB3aGljaCB3aWxsIG1hcCB0aGUgZ2l2ZW4gdmFsdWUgdG8gdGhlIHZhbHVlXG4gKiAgICAgdGhhdCBpcyBvdXRwdXQuXG4gKiBAcGFyYW0ge2Jvb2x9IHVzZUltcG9ydGFudDogQSBib29sZWFuIHNheWluZyB3aGV0aGVyIHRvIGFwcGVuZCBcIiFpbXBvcnRhbnRcIlxuICogICAgIHRvIGVhY2ggb2YgdGhlIENTUyBkZWNsYXJhdGlvbnMuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBBIHN0cmluZyBvZiByYXcgQ1NTLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5ibGFoXCIsIHsgY29sb3I6IFwicmVkXCIgfSlcbiAqICAgIC0+IFwiLmJsYWh7Y29sb3I6IHJlZCAhaW1wb3J0YW50O31cIlxuICogICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmJsYWhcIiwgeyBjb2xvcjogXCJyZWRcIiB9LCB7fSwgZmFsc2UpXG4gKiAgICAtPiBcIi5ibGFoe2NvbG9yOiByZWR9XCJcbiAqICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5ibGFoXCIsIHsgY29sb3I6IFwicmVkXCIgfSwge2NvbG9yOiBjID0+IGMudG9VcHBlckNhc2V9KVxuICogICAgLT4gXCIuYmxhaHtjb2xvcjogUkVEfVwiXG4gKiAgICBnZW5lcmF0ZUNTU1J1bGVzZXQoXCIuYmxhaDpob3ZlclwiLCB7IGNvbG9yOiBcInJlZFwiIH0pXG4gKiAgICAtPiBcIi5ibGFoOmhvdmVye2NvbG9yOiByZWR9XCJcbiAqL1xudmFyIGdlbmVyYXRlQ1NTUnVsZXNldCA9IGZ1bmN0aW9uIGdlbmVyYXRlQ1NTUnVsZXNldChzZWxlY3RvciwgLyogOiBzdHJpbmcgKi9cbmRlY2xhcmF0aW9ucywgLyogOiBPcmRlcmVkRWxlbWVudHMgKi9cbnN0cmluZ0hhbmRsZXJzLCAvKiA6IFN0cmluZ0hhbmRsZXJzICovXG51c2VJbXBvcnRhbnQsIC8qIDogYm9vbGVhbiAqL1xuc2VsZWN0b3JIYW5kbGVycyAvKiA6IFNlbGVjdG9ySGFuZGxlcltdICovXG4pIC8qIDogc3RyaW5nICove1xuICAgIC8vIE11dGF0ZXMgZGVjbGFyYXRpb25zXG4gICAgcnVuU3RyaW5nSGFuZGxlcnMoZGVjbGFyYXRpb25zLCBzdHJpbmdIYW5kbGVycywgc2VsZWN0b3JIYW5kbGVycyk7XG5cbiAgICB2YXIgb3JpZ2luYWxFbGVtZW50cyA9IF9leHRlbmRzKHt9LCBkZWNsYXJhdGlvbnMuZWxlbWVudHMpO1xuXG4gICAgLy8gTk9URShlbWlseSk6IFRoaXMgbXV0YXRlcyBoYW5kbGVkRGVjbGFyYXRpb25zLmVsZW1lbnRzLlxuICAgIHZhciBwcmVmaXhlZEVsZW1lbnRzID0gcHJlZml4QWxsKGRlY2xhcmF0aW9ucy5lbGVtZW50cyk7XG5cbiAgICB2YXIgZWxlbWVudE5hbWVzID0gT2JqZWN0LmtleXMocHJlZml4ZWRFbGVtZW50cyk7XG4gICAgaWYgKGVsZW1lbnROYW1lcy5sZW5ndGggIT09IGRlY2xhcmF0aW9ucy5rZXlPcmRlci5sZW5ndGgpIHtcbiAgICAgICAgLy8gVGhlcmUgYXJlIHNvbWUgcHJlZml4ZWQgdmFsdWVzLCBzbyB3ZSBuZWVkIHRvIGZpZ3VyZSBvdXQgaG93IHRvIHNvcnRcbiAgICAgICAgLy8gdGhlbS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHByZWZpeGVkRWxlbWVudHMsIGxvb2tpbmcgZm9yIGFueXRoaW5nIHRoYXQgaXMgbm90IGluXG4gICAgICAgIC8vIHNvcnRPcmRlciwgd2hpY2ggbWVhbnMgaXQgd2FzIGFkZGVkIGJ5IHByZWZpeEFsbC4gVGhpcyBtZWFucyB0aGF0IHdlXG4gICAgICAgIC8vIG5lZWQgdG8gZmlndXJlIG91dCB3aGVyZSBpdCBzaG91bGQgYXBwZWFyIGluIHRoZSBzb3J0T3JkZXIuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIW9yaWdpbmFsRWxlbWVudHMuaGFzT3duUHJvcGVydHkoZWxlbWVudE5hbWVzW2ldKSkge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgZWxlbWVudCBpcyBub3QgaW4gdGhlIHNvcnRPcmRlciwgd2hpY2ggbWVhbnMgaXQgaXMgYSBwcmVmaXhlZFxuICAgICAgICAgICAgICAgIC8vIHZhbHVlIHRoYXQgd2FzIGFkZGVkIGJ5IHByZWZpeEFsbC4gTGV0J3MgdHJ5IHRvIGZpZ3VyZSBvdXQgd2hlcmUgaXRcbiAgICAgICAgICAgICAgICAvLyBnb2VzLlxuICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbFN0eWxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50TmFtZXNbaV1bMF0gPT09ICdXJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgV2Via2l0LXByZWZpeGVkIHN0eWxlLCBsaWtlIFwiV2Via2l0VHJhbnNpdGlvblwiLiBMZXQnc1xuICAgICAgICAgICAgICAgICAgICAvLyBmaW5kIGl0cyBvcmlnaW5hbCBzdHlsZSdzIHNvcnQgb3JkZXIuXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU3R5bGUgPSBlbGVtZW50TmFtZXNbaV1bNl0udG9Mb3dlckNhc2UoKSArIGVsZW1lbnROYW1lc1tpXS5zbGljZSg3KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnROYW1lc1tpXVsxXSA9PT0gJ28nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBNb3otcHJlZml4ZWQgc3R5bGUsIGxpa2UgXCJNb3pUcmFuc2l0aW9uXCIuIFdlIGNoZWNrXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBzZWNvbmQgY2hhcmFjdGVyIHRvIGF2b2lkIGNvbGxpZGluZyB3aXRoIE1zLXByZWZpeGVkXG4gICAgICAgICAgICAgICAgICAgIC8vIHN0eWxlcy4gTGV0J3MgZmluZCBpdHMgb3JpZ2luYWwgc3R5bGUncyBzb3J0IG9yZGVyLlxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFN0eWxlID0gZWxlbWVudE5hbWVzW2ldWzNdLnRvTG93ZXJDYXNlKCkgKyBlbGVtZW50TmFtZXNbaV0uc2xpY2UoNCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGVsZW1lbnROYW1lc1tpXVsxXSA9PT0gJ3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBNcy1wcmVmaXhlZCBzdHlsZSwgbGlrZSBcIk1zVHJhbnNpdGlvblwiLlxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFN0eWxlID0gZWxlbWVudE5hbWVzW2ldWzJdLnRvTG93ZXJDYXNlKCkgKyBlbGVtZW50TmFtZXNbaV0uc2xpY2UoMyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9yaWdpbmFsU3R5bGUgJiYgb3JpZ2luYWxFbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShvcmlnaW5hbFN0eWxlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxJbmRleCA9IGRlY2xhcmF0aW9ucy5rZXlPcmRlci5pbmRleE9mKG9yaWdpbmFsU3R5bGUpO1xuICAgICAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMua2V5T3JkZXIuc3BsaWNlKG9yaWdpbmFsSW5kZXgsIDAsIGVsZW1lbnROYW1lc1tpXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3Qga25vdyB3aGF0IHRoZSBvcmlnaW5hbCBzdHlsZSB3YXMsIHNvIHNvcnQgaXQgdG9cbiAgICAgICAgICAgICAgICAgICAgLy8gdG9wLiBUaGlzIGNhbiBoYXBwZW4gZm9yIHN0eWxlcyB0aGF0IGFyZSBhZGRlZCB0aGF0IGRvbid0XG4gICAgICAgICAgICAgICAgICAgIC8vIGhhdmUgdGhlIHNhbWUgYmFzZSBuYW1lIGFzIHRoZSBvcmlnaW5hbCBzdHlsZS5cbiAgICAgICAgICAgICAgICAgICAgZGVjbGFyYXRpb25zLmtleU9yZGVyLnVuc2hpZnQoZWxlbWVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdHJhbnNmb3JtVmFsdWUgPSB1c2VJbXBvcnRhbnQgPT09IGZhbHNlID8gX3V0aWwuc3RyaW5naWZ5VmFsdWUgOiBfdXRpbC5zdHJpbmdpZnlBbmRJbXBvcnRhbnRpZnlWYWx1ZTtcblxuICAgIHZhciBydWxlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVjbGFyYXRpb25zLmtleU9yZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBkZWNsYXJhdGlvbnMua2V5T3JkZXJbaV07XG4gICAgICAgIHZhciB2YWx1ZSA9IHByZWZpeGVkRWxlbWVudHNba2V5XTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBpbmxpbmUtc3R5bGUtcHJlZml4ZXIgcmV0dXJucyBhbiBhcnJheSB3aGVuIHRoZXJlIHNob3VsZCBiZVxuICAgICAgICAgICAgLy8gbXVsdGlwbGUgcnVsZXMgZm9yIHRoZSBzYW1lIGtleS4gSGVyZSB3ZSBmbGF0dGVuIHRvIG11bHRpcGxlXG4gICAgICAgICAgICAvLyBwYWlycyB3aXRoIHRoZSBzYW1lIGtleS5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsdWUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBydWxlcy5wdXNoKHRyYW5zZm9ybVJ1bGUoa2V5LCB2YWx1ZVtqXSwgdHJhbnNmb3JtVmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJ1bGVzLnB1c2godHJhbnNmb3JtUnVsZShrZXksIHZhbHVlLCB0cmFuc2Zvcm1WYWx1ZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJ1bGVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IgKyAneycgKyBydWxlcy5qb2luKFwiXCIpICsgJ30nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbn07XG5leHBvcnRzLmdlbmVyYXRlQ1NTUnVsZXNldCA9IGdlbmVyYXRlQ1NTUnVsZXNldDsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9hc2FwID0gcmVxdWlyZSgnYXNhcCcpO1xuXG52YXIgX2FzYXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXNhcCk7XG5cbnZhciBfb3JkZXJlZEVsZW1lbnRzID0gcmVxdWlyZSgnLi9vcmRlcmVkLWVsZW1lbnRzJyk7XG5cbnZhciBfb3JkZXJlZEVsZW1lbnRzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX29yZGVyZWRFbGVtZW50cyk7XG5cbnZhciBfZ2VuZXJhdGUgPSByZXF1aXJlKCcuL2dlbmVyYXRlJyk7XG5cbnZhciBfdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG4vKiA6OlxuaW1wb3J0IHR5cGUgeyBTaGVldERlZmluaXRpb24sIFNoZWV0RGVmaW5pdGlvbnMgfSBmcm9tICcuL2luZGV4LmpzJztcbmltcG9ydCB0eXBlIHsgTWF5YmVTaGVldERlZmluaXRpb24gfSBmcm9tICcuL2V4cG9ydHMuanMnO1xuaW1wb3J0IHR5cGUgeyBTZWxlY3RvckhhbmRsZXIgfSBmcm9tICcuL2dlbmVyYXRlLmpzJztcbnR5cGUgUHJvY2Vzc2VkU3R5bGVEZWZpbml0aW9ucyA9IHtcbiAgY2xhc3NOYW1lQml0czogQXJyYXk8c3RyaW5nPixcbiAgZGVmaW5pdGlvbkJpdHM6IEFycmF5PE9iamVjdD4sXG59O1xuKi9cblxuLy8gVGhlIGN1cnJlbnQgPHN0eWxlPiB0YWcgd2UgYXJlIGluc2VydGluZyBpbnRvLCBvciBudWxsIGlmIHdlIGhhdmVuJ3Rcbi8vIGluc2VydGVkIGFueXRoaW5nIHlldC4gV2UgY291bGQgZmluZCB0aGlzIGVhY2ggdGltZSB1c2luZ1xuLy8gYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzdHlsZVtkYXRhLWFwaHJvZGl0ZVwiXSlgLCBidXQgaG9sZGluZyBvbnRvIGl0IGlzXG4vLyBmYXN0ZXIuXG52YXIgc3R5bGVUYWcgPSBudWxsO1xuXG4vLyBJbmplY3QgYSBzdHJpbmcgb2Ygc3R5bGVzIGludG8gYSA8c3R5bGU+IHRhZyBpbiB0aGUgaGVhZCBvZiB0aGUgZG9jdW1lbnQuIFRoaXNcbi8vIHdpbGwgYXV0b21hdGljYWxseSBjcmVhdGUgYSBzdHlsZSB0YWcgYW5kIHRoZW4gY29udGludWUgdG8gdXNlIGl0IGZvclxuLy8gbXVsdGlwbGUgaW5qZWN0aW9ucy4gSXQgd2lsbCBhbHNvIHVzZSBhIHN0eWxlIHRhZyB3aXRoIHRoZSBgZGF0YS1hcGhyb2RpdGVgXG4vLyB0YWcgb24gaXQgaWYgdGhhdCBleGlzdHMgaW4gdGhlIERPTS4gVGhpcyBjb3VsZCBiZSB1c2VkIGZvciBlLmcuIHJldXNpbmcgdGhlXG4vLyBzYW1lIHN0eWxlIHRhZyB0aGF0IHNlcnZlci1zaWRlIHJlbmRlcmluZyBpbnNlcnRzLlxudmFyIGluamVjdFN0eWxlVGFnID0gZnVuY3Rpb24gaW5qZWN0U3R5bGVUYWcoY3NzQ29udGVudHMgLyogOiBzdHJpbmcgKi8pIHtcbiAgICBpZiAoc3R5bGVUYWcgPT0gbnVsbCkge1xuICAgICAgICAvLyBUcnkgdG8gZmluZCBhIHN0eWxlIHRhZyB3aXRoIHRoZSBgZGF0YS1hcGhyb2RpdGVgIGF0dHJpYnV0ZSBmaXJzdC5cbiAgICAgICAgc3R5bGVUYWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic3R5bGVbZGF0YS1hcGhyb2RpdGVdXCIpO1xuXG4gICAgICAgIC8vIElmIHRoYXQgZG9lc24ndCB3b3JrLCBnZW5lcmF0ZSBhIG5ldyBzdHlsZSB0YWcuXG4gICAgICAgIGlmIChzdHlsZVRhZyA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBUYWtlbiBmcm9tXG4gICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUyNDY5Ni9ob3ctdG8tY3JlYXRlLWEtc3R5bGUtdGFnLXdpdGgtamF2YXNjcmlwdFxuICAgICAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgICAgICAgICBzdHlsZVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG5cbiAgICAgICAgICAgIHN0eWxlVGFnLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgICAgICAgICAgc3R5bGVUYWcuc2V0QXR0cmlidXRlKFwiZGF0YS1hcGhyb2RpdGVcIiwgXCJcIik7XG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlVGFnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdHlsZVRhZy5zdHlsZVNoZWV0KSB7XG4gICAgICAgIC8vICRGbG93Rml4TWU6IGxlZ2FjeSBJbnRlcm5ldCBFeHBsb3JlciBjb21wYXRpYmlsaXR5XG4gICAgICAgIHN0eWxlVGFnLnN0eWxlU2hlZXQuY3NzVGV4dCArPSBjc3NDb250ZW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgICBzdHlsZVRhZy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3NDb250ZW50cykpO1xuICAgIH1cbn07XG5cbi8vIEN1c3RvbSBoYW5kbGVycyBmb3Igc3RyaW5naWZ5aW5nIENTUyB2YWx1ZXMgdGhhdCBoYXZlIHNpZGUgZWZmZWN0c1xuLy8gKHN1Y2ggYXMgZm9udEZhbWlseSwgd2hpY2ggY2FuIGNhdXNlIEBmb250LWZhY2UgcnVsZXMgdG8gYmUgaW5qZWN0ZWQpXG52YXIgc3RyaW5nSGFuZGxlcnMgPSB7XG4gICAgLy8gV2l0aCBmb250RmFtaWx5IHdlIGxvb2sgZm9yIG9iamVjdHMgdGhhdCBhcmUgcGFzc2VkIGluIGFuZCBpbnRlcnByZXRcbiAgICAvLyB0aGVtIGFzIEBmb250LWZhY2UgcnVsZXMgdGhhdCB3ZSBuZWVkIHRvIGluamVjdC4gVGhlIHZhbHVlIG9mIGZvbnRGYW1pbHlcbiAgICAvLyBjYW4gZWl0aGVyIGJlIGEgc3RyaW5nIChhcyBub3JtYWwpLCBhbiBvYmplY3QgKGEgc2luZ2xlIGZvbnQgZmFjZSksIG9yXG4gICAgLy8gYW4gYXJyYXkgb2Ygb2JqZWN0cyBhbmQgc3RyaW5ncy5cbiAgICBmb250RmFtaWx5OiBmdW5jdGlvbiBmb250RmFtaWx5KHZhbCkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsLm1hcChmb250RmFtaWx5KS5qb2luKFwiLFwiKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBpbmplY3RTdHlsZU9uY2UodmFsLnNyYywgXCJAZm9udC1mYWNlXCIsIFt2YWxdLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm4gJ1wiJyArIHZhbC5mb250RmFtaWx5ICsgJ1wiJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gV2l0aCBhbmltYXRpb25OYW1lIHdlIGxvb2sgZm9yIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGtleWZyYW1lcyBhbmRcbiAgICAvLyBpbmplY3QgdGhlbSBhcyBhbiBgQGtleWZyYW1lc2AgYmxvY2ssIHJldHVybmluZyBhIHVuaXF1ZWx5IGdlbmVyYXRlZFxuICAgIC8vIG5hbWUuIFRoZSBrZXlmcmFtZXMgb2JqZWN0IHNob3VsZCBsb29rIGxpa2VcbiAgICAvLyAgYW5pbWF0aW9uTmFtZToge1xuICAgIC8vICAgIGZyb206IHtcbiAgICAvLyAgICAgIGxlZnQ6IDAsXG4gICAgLy8gICAgICB0b3A6IDAsXG4gICAgLy8gICAgfSxcbiAgICAvLyAgICAnNTAlJzoge1xuICAgIC8vICAgICAgbGVmdDogMTUsXG4gICAgLy8gICAgICB0b3A6IDUsXG4gICAgLy8gICAgfSxcbiAgICAvLyAgICB0bzoge1xuICAgIC8vICAgICAgbGVmdDogMjAsXG4gICAgLy8gICAgICB0b3A6IDIwLFxuICAgIC8vICAgIH1cbiAgICAvLyAgfVxuICAgIC8vIFRPRE8oZW1pbHkpOiBgc3RyaW5nSGFuZGxlcnNgIGRvZXNuJ3QgbGV0IHVzIHJlbmFtZSB0aGUga2V5LCBzbyBJIGhhdmVcbiAgICAvLyB0byB1c2UgYGFuaW1hdGlvbk5hbWVgIGhlcmUuIEltcHJvdmUgdGhhdCBzbyB3ZSBjYW4gY2FsbCB0aGlzXG4gICAgLy8gYGFuaW1hdGlvbmAgaW5zdGVhZCBvZiBgYW5pbWF0aW9uTmFtZWAuXG4gICAgYW5pbWF0aW9uTmFtZTogZnVuY3Rpb24gYW5pbWF0aW9uTmFtZSh2YWwsIHNlbGVjdG9ySGFuZGxlcnMpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbC5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5pbWF0aW9uTmFtZSh2LCBzZWxlY3RvckhhbmRsZXJzKTtcbiAgICAgICAgICAgIH0pLmpvaW4oXCIsXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIC8vIEdlbmVyYXRlIGEgdW5pcXVlIG5hbWUgYmFzZWQgb24gdGhlIGhhc2ggb2YgdGhlIG9iamVjdC4gV2UgY2FuJ3RcbiAgICAgICAgICAgIC8vIGp1c3QgdXNlIHRoZSBoYXNoIGJlY2F1c2UgdGhlIG5hbWUgY2FuJ3Qgc3RhcnQgd2l0aCBhIG51bWJlci5cbiAgICAgICAgICAgIC8vIFRPRE8oZW1pbHkpOiB0aGlzIHByb2JhYmx5IG1ha2VzIGRlYnVnZ2luZyBoYXJkLCBhbGxvdyBhIGN1c3RvbVxuICAgICAgICAgICAgLy8gbmFtZT9cbiAgICAgICAgICAgIHZhciBfbmFtZSA9ICdrZXlmcmFtZV8nICsgKDAsIF91dGlsLmhhc2hPYmplY3QpKHZhbCk7XG5cbiAgICAgICAgICAgIC8vIFNpbmNlIGtleWZyYW1lcyBuZWVkIDMgbGF5ZXJzIG9mIG5lc3RpbmcsIHdlIHVzZSBgZ2VuZXJhdGVDU1NgIHRvXG4gICAgICAgICAgICAvLyBidWlsZCB0aGUgaW5uZXIgbGF5ZXJzIGFuZCB3cmFwIGl0IGluIGBAa2V5ZnJhbWVzYCBvdXJzZWx2ZXMuXG4gICAgICAgICAgICB2YXIgZmluYWxWYWwgPSAnQGtleWZyYW1lcyAnICsgX25hbWUgKyAneyc7XG5cbiAgICAgICAgICAgIC8vIFRPRE8gc2VlIGlmIHdlIGNhbiBmaW5kIGEgd2F5IHdoZXJlIGNoZWNraW5nIGZvciBPcmRlcmVkRWxlbWVudHNcbiAgICAgICAgICAgIC8vIGhlcmUgaXMgbm90IG5lY2Vzc2FyeS4gQWx0ZXJuYXRpdmVseSwgcGVyaGFwcyB3ZSBzaG91bGQgaGF2ZSBhXG4gICAgICAgICAgICAvLyB1dGlsaXR5IG1ldGhvZCB0aGF0IGNhbiBpdGVyYXRlIG92ZXIgZWl0aGVyIGEgcGxhaW4gb2JqZWN0LCBhblxuICAgICAgICAgICAgLy8gaW5zdGFuY2Ugb2YgT3JkZXJlZEVsZW1lbnRzLCBvciBhIE1hcCwgYW5kIHRoZW4gdXNlIHRoYXQgaGVyZSBhbmRcbiAgICAgICAgICAgIC8vIGVsc2V3aGVyZS5cbiAgICAgICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBfb3JkZXJlZEVsZW1lbnRzMlsnZGVmYXVsdCddKSB7XG4gICAgICAgICAgICAgICAgdmFsLmZvckVhY2goZnVuY3Rpb24gKHZhbFZhbCwgdmFsS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsVmFsICs9ICgwLCBfZ2VuZXJhdGUuZ2VuZXJhdGVDU1MpKHZhbEtleSwgW3ZhbFZhbF0sIHNlbGVjdG9ySGFuZGxlcnMsIHN0cmluZ0hhbmRsZXJzLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHZhbCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsVmFsICs9ICgwLCBfZ2VuZXJhdGUuZ2VuZXJhdGVDU1MpKGtleSwgW3ZhbFtrZXldXSwgc2VsZWN0b3JIYW5kbGVycywgc3RyaW5nSGFuZGxlcnMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsVmFsICs9ICd9JztcblxuICAgICAgICAgICAgaW5qZWN0R2VuZXJhdGVkQ1NTT25jZShfbmFtZSwgZmluYWxWYWwpO1xuXG4gICAgICAgICAgICByZXR1cm4gX25hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gVGhpcyBpcyBhIG1hcCBmcm9tIEFwaHJvZGl0ZSdzIGdlbmVyYXRlZCBjbGFzcyBuYW1lcyB0byBgdHJ1ZWAgKGFjdGluZyBhcyBhXG4vLyBzZXQgb2YgY2xhc3MgbmFtZXMpXG52YXIgYWxyZWFkeUluamVjdGVkID0ge307XG5cbi8vIFRoaXMgaXMgdGhlIGJ1ZmZlciBvZiBzdHlsZXMgd2hpY2ggaGF2ZSBub3QgeWV0IGJlZW4gZmx1c2hlZC5cbnZhciBpbmplY3Rpb25CdWZmZXIgPSBcIlwiO1xuXG4vLyBBIGZsYWcgdG8gdGVsbCBpZiB3ZSBhcmUgYWxyZWFkeSBidWZmZXJpbmcgc3R5bGVzLiBUaGlzIGNvdWxkIGhhcHBlbiBlaXRoZXJcbi8vIGJlY2F1c2Ugd2Ugc2NoZWR1bGVkIGEgZmx1c2ggY2FsbCBhbHJlYWR5LCBzbyBuZXdseSBhZGRlZCBzdHlsZXMgd2lsbFxuLy8gYWxyZWFkeSBiZSBmbHVzaGVkLCBvciBiZWNhdXNlIHdlIGFyZSBzdGF0aWNhbGx5IGJ1ZmZlcmluZyBvbiB0aGUgc2VydmVyLlxudmFyIGlzQnVmZmVyaW5nID0gZmFsc2U7XG5cbnZhciBpbmplY3RHZW5lcmF0ZWRDU1NPbmNlID0gZnVuY3Rpb24gaW5qZWN0R2VuZXJhdGVkQ1NTT25jZShrZXksIGdlbmVyYXRlZENTUykge1xuICAgIGlmIChhbHJlYWR5SW5qZWN0ZWRba2V5XSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFpc0J1ZmZlcmluZykge1xuICAgICAgICAvLyBXZSBzaG91bGQgbmV2ZXIgYmUgYXV0b21hdGljYWxseSBidWZmZXJpbmcgb24gdGhlIHNlcnZlciAob3IgYW55XG4gICAgICAgIC8vIHBsYWNlIHdpdGhvdXQgYSBkb2N1bWVudCksIHNvIGd1YXJkIGFnYWluc3QgdGhhdC5cbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGF1dG9tYXRpY2FsbHkgYnVmZmVyIHdpdGhvdXQgYSBkb2N1bWVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlJ3JlIG5vdCBhbHJlYWR5IGJ1ZmZlcmluZywgc2NoZWR1bGUgYSBjYWxsIHRvIGZsdXNoIHRoZVxuICAgICAgICAvLyBjdXJyZW50IHN0eWxlcy5cbiAgICAgICAgaXNCdWZmZXJpbmcgPSB0cnVlO1xuICAgICAgICAoMCwgX2FzYXAyWydkZWZhdWx0J10pKGZsdXNoVG9TdHlsZVRhZyk7XG4gICAgfVxuXG4gICAgaW5qZWN0aW9uQnVmZmVyICs9IGdlbmVyYXRlZENTUztcbiAgICBhbHJlYWR5SW5qZWN0ZWRba2V5XSA9IHRydWU7XG59O1xuXG52YXIgaW5qZWN0U3R5bGVPbmNlID0gZnVuY3Rpb24gaW5qZWN0U3R5bGVPbmNlKGtleSwgLyogOiBzdHJpbmcgKi9cbnNlbGVjdG9yLCAvKiA6IHN0cmluZyAqL1xuZGVmaW5pdGlvbnMsIC8qIDogU2hlZXREZWZpbml0aW9uW10gKi9cbnVzZUltcG9ydGFudCAvKiA6IGJvb2xlYW4gKi9cbikge1xuICAgIHZhciBzZWxlY3RvckhhbmRsZXJzIC8qIDogU2VsZWN0b3JIYW5kbGVyW10gKi8gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDQgfHwgYXJndW1lbnRzWzRdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1s0XTtcblxuICAgIGlmIChhbHJlYWR5SW5qZWN0ZWRba2V5XSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGdlbmVyYXRlZCA9ICgwLCBfZ2VuZXJhdGUuZ2VuZXJhdGVDU1MpKHNlbGVjdG9yLCBkZWZpbml0aW9ucywgc2VsZWN0b3JIYW5kbGVycywgc3RyaW5nSGFuZGxlcnMsIHVzZUltcG9ydGFudCk7XG5cbiAgICBpbmplY3RHZW5lcmF0ZWRDU1NPbmNlKGtleSwgZ2VuZXJhdGVkKTtcbn07XG5cbmV4cG9ydHMuaW5qZWN0U3R5bGVPbmNlID0gaW5qZWN0U3R5bGVPbmNlO1xudmFyIHJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgaW5qZWN0aW9uQnVmZmVyID0gXCJcIjtcbiAgICBhbHJlYWR5SW5qZWN0ZWQgPSB7fTtcbiAgICBpc0J1ZmZlcmluZyA9IGZhbHNlO1xuICAgIHN0eWxlVGFnID0gbnVsbDtcbn07XG5cbmV4cG9ydHMucmVzZXQgPSByZXNldDtcbnZhciBzdGFydEJ1ZmZlcmluZyA9IGZ1bmN0aW9uIHN0YXJ0QnVmZmVyaW5nKCkge1xuICAgIGlmIChpc0J1ZmZlcmluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYnVmZmVyIHdoaWxlIGFscmVhZHkgYnVmZmVyaW5nXCIpO1xuICAgIH1cbiAgICBpc0J1ZmZlcmluZyA9IHRydWU7XG59O1xuXG5leHBvcnRzLnN0YXJ0QnVmZmVyaW5nID0gc3RhcnRCdWZmZXJpbmc7XG52YXIgZmx1c2hUb1N0cmluZyA9IGZ1bmN0aW9uIGZsdXNoVG9TdHJpbmcoKSB7XG4gICAgaXNCdWZmZXJpbmcgPSBmYWxzZTtcbiAgICB2YXIgcmV0ID0gaW5qZWN0aW9uQnVmZmVyO1xuICAgIGluamVjdGlvbkJ1ZmZlciA9IFwiXCI7XG4gICAgcmV0dXJuIHJldDtcbn07XG5cbmV4cG9ydHMuZmx1c2hUb1N0cmluZyA9IGZsdXNoVG9TdHJpbmc7XG52YXIgZmx1c2hUb1N0eWxlVGFnID0gZnVuY3Rpb24gZmx1c2hUb1N0eWxlVGFnKCkge1xuICAgIHZhciBjc3NDb250ZW50ID0gZmx1c2hUb1N0cmluZygpO1xuICAgIGlmIChjc3NDb250ZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5qZWN0U3R5bGVUYWcoY3NzQ29udGVudCk7XG4gICAgfVxufTtcblxuZXhwb3J0cy5mbHVzaFRvU3R5bGVUYWcgPSBmbHVzaFRvU3R5bGVUYWc7XG52YXIgZ2V0UmVuZGVyZWRDbGFzc05hbWVzID0gZnVuY3Rpb24gZ2V0UmVuZGVyZWRDbGFzc05hbWVzKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhhbHJlYWR5SW5qZWN0ZWQpO1xufTtcblxuZXhwb3J0cy5nZXRSZW5kZXJlZENsYXNzTmFtZXMgPSBnZXRSZW5kZXJlZENsYXNzTmFtZXM7XG52YXIgYWRkUmVuZGVyZWRDbGFzc05hbWVzID0gZnVuY3Rpb24gYWRkUmVuZGVyZWRDbGFzc05hbWVzKGNsYXNzTmFtZXMgLyogOiBzdHJpbmdbXSAqLykge1xuICAgIGNsYXNzTmFtZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGFscmVhZHlJbmplY3RlZFtjbGFzc05hbWVdID0gdHJ1ZTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydHMuYWRkUmVuZGVyZWRDbGFzc05hbWVzID0gYWRkUmVuZGVyZWRDbGFzc05hbWVzO1xudmFyIHByb2Nlc3NTdHlsZURlZmluaXRpb25zID0gZnVuY3Rpb24gcHJvY2Vzc1N0eWxlRGVmaW5pdGlvbnMoc3R5bGVEZWZpbml0aW9ucywgLyogOiBhbnlbXSAqL1xucmVzdWx0IC8qIDogUHJvY2Vzc2VkU3R5bGVEZWZpbml0aW9ucyAqL1xuKSAvKiA6IHZvaWQgKi97XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZURlZmluaXRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIC8vIEZpbHRlciBvdXQgZmFsc3kgdmFsdWVzIGZyb20gdGhlIGlucHV0LCB0byBhbGxvdyBmb3JcbiAgICAgICAgLy8gYGNzcyhhLCB0ZXN0ICYmIGMpYFxuICAgICAgICBpZiAoc3R5bGVEZWZpbml0aW9uc1tpXSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc3R5bGVEZWZpbml0aW9uc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSd2ZSBlbmNvdW50ZXJlZCBhbiBhcnJheSwgc28gbGV0J3MgcmVjdXJzZVxuICAgICAgICAgICAgICAgIHByb2Nlc3NTdHlsZURlZmluaXRpb25zKHN0eWxlRGVmaW5pdGlvbnNbaV0sIHJlc3VsdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5jbGFzc05hbWVCaXRzLnB1c2goc3R5bGVEZWZpbml0aW9uc1tpXS5fbmFtZSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmRlZmluaXRpb25CaXRzLnB1c2goc3R5bGVEZWZpbml0aW9uc1tpXS5fZGVmaW5pdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIEluamVjdCBzdHlsZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBwYXNzZWQgc3R5bGUgZGVmaW5pdGlvbiBvYmplY3RzLCBhbmQgcmV0dXJuXG4gKiBhbiBhc3NvY2lhdGVkIENTUyBjbGFzcyBuYW1lLlxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdXNlSW1wb3J0YW50IElmIHRydWUsIHdpbGwgYXBwZW5kICFpbXBvcnRhbnQgdG8gZ2VuZXJhdGVkXG4gKiAgICAgQ1NTIG91dHB1dC4gZS5nLiB7Y29sb3I6IHJlZH0gLT4gXCJjb2xvcjogcmVkICFpbXBvcnRhbnRcIi5cbiAqIEBwYXJhbSB7KE9iamVjdHxPYmplY3RbXSlbXX0gc3R5bGVEZWZpbml0aW9ucyBzdHlsZSBkZWZpbml0aW9uIG9iamVjdHMsIG9yXG4gKiAgICAgYXJiaXRyYXJpbHkgbmVzdGVkIGFycmF5cyBvZiB0aGVtLCBhcyByZXR1cm5lZCBhcyBwcm9wZXJ0aWVzIG9mIHRoZVxuICogICAgIHJldHVybiB2YWx1ZSBvZiBTdHlsZVNoZWV0LmNyZWF0ZSgpLlxuICovXG52YXIgaW5qZWN0QW5kR2V0Q2xhc3NOYW1lID0gZnVuY3Rpb24gaW5qZWN0QW5kR2V0Q2xhc3NOYW1lKHVzZUltcG9ydGFudCwgLyogOiBib29sZWFuICovXG5zdHlsZURlZmluaXRpb25zLCAvKiA6IE1heWJlU2hlZXREZWZpbml0aW9uW10gKi9cbnNlbGVjdG9ySGFuZGxlcnMgLyogOiBTZWxlY3RvckhhbmRsZXJbXSAqL1xuKSAvKiA6IHN0cmluZyAqL3tcbiAgICB2YXIgcHJvY2Vzc2VkU3R5bGVEZWZpbml0aW9ucyAvKiA6IFByb2Nlc3NlZFN0eWxlRGVmaW5pdGlvbnMgKi8gPSB7XG4gICAgICAgIGNsYXNzTmFtZUJpdHM6IFtdLFxuICAgICAgICBkZWZpbml0aW9uQml0czogW11cbiAgICB9O1xuICAgIC8vIE11dGF0ZXMgcHJvY2Vzc2VkU3R5bGVEZWZpbml0aW9uc1xuICAgIHByb2Nlc3NTdHlsZURlZmluaXRpb25zKHN0eWxlRGVmaW5pdGlvbnMsIHByb2Nlc3NlZFN0eWxlRGVmaW5pdGlvbnMpO1xuXG4gICAgLy8gQnJlYWsgaWYgdGhlcmUgYXJlbid0IGFueSB2YWxpZCBzdHlsZXMuXG4gICAgaWYgKHByb2Nlc3NlZFN0eWxlRGVmaW5pdGlvbnMuY2xhc3NOYW1lQml0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHZhciBjbGFzc05hbWUgPSBwcm9jZXNzZWRTdHlsZURlZmluaXRpb25zLmNsYXNzTmFtZUJpdHMuam9pbihcIi1vX08tXCIpO1xuXG4gICAgaW5qZWN0U3R5bGVPbmNlKGNsYXNzTmFtZSwgJy4nICsgY2xhc3NOYW1lLCBwcm9jZXNzZWRTdHlsZURlZmluaXRpb25zLmRlZmluaXRpb25CaXRzLCB1c2VJbXBvcnRhbnQsIHNlbGVjdG9ySGFuZGxlcnMpO1xuXG4gICAgcmV0dXJuIGNsYXNzTmFtZTtcbn07XG5leHBvcnRzLmluamVjdEFuZEdldENsYXNzTmFtZSA9IGluamVjdEFuZEdldENsYXNzTmFtZTsiLCJcbi8vIE1vZHVsZSB3aXRoIHRoZSBzYW1lIGludGVyZmFjZSBhcyB0aGUgY29yZSBhcGhyb2RpdGUgbW9kdWxlLFxuLy8gZXhjZXB0IHRoYXQgc3R5bGVzIGluamVjdGVkIGRvIG5vdCBhdXRvbWF0aWNhbGx5IGhhdmUgIWltcG9ydGFudFxuLy8gYXBwZW5kZWQgdG8gdGhlbS5cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2dlbmVyYXRlID0gcmVxdWlyZSgnLi9nZW5lcmF0ZScpO1xuXG52YXIgX2V4cG9ydHMyID0gcmVxdWlyZSgnLi9leHBvcnRzJyk7XG5cbnZhciBfZXhwb3J0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHBvcnRzMik7XG5cbnZhciB1c2VJbXBvcnRhbnQgPSBmYWxzZTsgLy8gRG9uJ3QgYWRkICFpbXBvcnRhbnQgdG8gc3R5bGUgZGVmaW5pdGlvbnNcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9ICgwLCBfZXhwb3J0czNbJ2RlZmF1bHQnXSkodXNlSW1wb3J0YW50LCBfZ2VuZXJhdGUuZGVmYXVsdFNlbGVjdG9ySGFuZGxlcnMpO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpOyB9IH1cblxudmFyIE1BUF9FWElTVFMgPSB0eXBlb2YgTWFwICE9PSAndW5kZWZpbmVkJztcblxudmFyIE9yZGVyZWRFbGVtZW50cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgLyogOjpcbiAgICBlbGVtZW50czoge1tzdHJpbmddOiBhbnl9O1xuICAgIGtleU9yZGVyOiBzdHJpbmdbXTtcbiAgICAqL1xuXG4gICAgZnVuY3Rpb24gT3JkZXJlZEVsZW1lbnRzKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgT3JkZXJlZEVsZW1lbnRzKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnRzID0ge307XG4gICAgICAgIHRoaXMua2V5T3JkZXIgPSBbXTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoT3JkZXJlZEVsZW1lbnRzLCBbe1xuICAgICAgICBrZXk6ICdmb3JFYWNoJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2sgLyogOiAoc3RyaW5nLCBhbnkpID0+IHZvaWQgKi8pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rZXlPcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vICh2YWx1ZSwga2V5KSB0byBtYXRjaCBNYXAncyBBUElcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh0aGlzLmVsZW1lbnRzW3RoaXMua2V5T3JkZXJbaV1dLCB0aGlzLmtleU9yZGVyW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnc2V0JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldChrZXksIC8qIDogc3RyaW5nICovdmFsdWUgLyogOiBhbnkgKi8pIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5lbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXlPcmRlci5wdXNoKGtleSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50c1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTUFQX0VYSVNUUyAmJiB2YWx1ZSBpbnN0YW5jZW9mIE1hcCB8fCB2YWx1ZSBpbnN0YW5jZW9mIE9yZGVyZWRFbGVtZW50cykge1xuICAgICAgICAgICAgICAgIHZhciBfcmV0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBmb3VuZCBhIG5lc3RlZCBNYXAsIHNvIHdlIG5lZWQgdG8gcmVjdXJzZSBzbyB0aGF0IGFsbFxuICAgICAgICAgICAgICAgICAgICAvLyBvZiB0aGUgbmVzdGVkIG9iamVjdHMgYW5kIE1hcHMgYXJlIG1lcmdlZCBwcm9wZXJseS5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5lc3RlZCA9IF90aGlzLmVsZW1lbnRzLmhhc093blByb3BlcnR5KGtleSkgPyBfdGhpcy5lbGVtZW50c1trZXldIDogbmV3IE9yZGVyZWRFbGVtZW50cygpO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXN0ZWQuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZWxlbWVudHNba2V5XSA9IG5lc3RlZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHY6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIF9yZXQgPT09ICdvYmplY3QnKSByZXR1cm4gX3JldC52O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIGZvdW5kIGEgbmVzdGVkIG9iamVjdCwgc28gd2UgbmVlZCB0byByZWN1cnNlIHNvIHRoYXQgYWxsXG4gICAgICAgICAgICAgICAgLy8gb2YgdGhlIG5lc3RlZCBvYmplY3RzIGFuZCBNYXBzIGFyZSBtZXJnZWQgcHJvcGVybHkuXG4gICAgICAgICAgICAgICAgdmFyIG5lc3RlZCA9IHRoaXMuZWxlbWVudHMuaGFzT3duUHJvcGVydHkoa2V5KSA/IHRoaXMuZWxlbWVudHNba2V5XSA6IG5ldyBPcmRlcmVkRWxlbWVudHMoKTtcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbmVzdGVkLnNldChrZXlzW2ldLCB2YWx1ZVtrZXlzW2ldXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudHNba2V5XSA9IG5lc3RlZDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHNba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdnZXQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KGtleSAvKiA6IHN0cmluZyAqLykgLyogOiBhbnkgKi97XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50c1trZXldO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdoYXMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGFzKGtleSAvKiA6IHN0cmluZyAqLykgLyogOiBib29sZWFuICove1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudHMuaGFzT3duUHJvcGVydHkoa2V5KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnYWRkU3R5bGVUeXBlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZFN0eWxlVHlwZShzdHlsZVR5cGUgLyogOiBhbnkgKi8pIC8qIDogdm9pZCAqL3tcbiAgICAgICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgICAgICBpZiAoTUFQX0VYSVNUUyAmJiBzdHlsZVR5cGUgaW5zdGFuY2VvZiBNYXAgfHwgc3R5bGVUeXBlIGluc3RhbmNlb2YgT3JkZXJlZEVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgc3R5bGVUeXBlLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMyLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhzdHlsZVR5cGUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldChrZXlzW2ldLCBzdHlsZVR5cGVba2V5c1tpXV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBPcmRlcmVkRWxlbWVudHM7XG59KSgpO1xuXG5leHBvcnRzWydkZWZhdWx0J10gPSBPcmRlcmVkRWxlbWVudHM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJ2YXIgY2FsYyA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9jYWxjJylcbnZhciBjcm9zc0ZhZGUgPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvY3Jvc3NGYWRlJylcbnZhciBjdXJzb3IgPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvY3Vyc29yJylcbnZhciBmaWx0ZXIgPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZmlsdGVyJylcbnZhciBmbGV4ID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2ZsZXgnKVxudmFyIGZsZXhib3hJRSA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9mbGV4Ym94SUUnKVxudmFyIGZsZXhib3hPbGQgPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZmxleGJveE9sZCcpXG52YXIgZ3JhZGllbnQgPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZ3JhZGllbnQnKVxudmFyIGltYWdlU2V0ID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2ltYWdlU2V0JylcbnZhciBwb3NpdGlvbiA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9wb3NpdGlvbicpXG52YXIgc2l6aW5nID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL3NpemluZycpXG52YXIgdHJhbnNpdGlvbiA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy90cmFuc2l0aW9uJylcblxubW9kdWxlLmV4cG9ydHMgPSAge1xuICBwbHVnaW5zOiBbY2FsYyxjcm9zc0ZhZGUsY3Vyc29yLGZpbHRlcixmbGV4LGZsZXhib3hJRSxmbGV4Ym94T2xkLGdyYWRpZW50LGltYWdlU2V0LHBvc2l0aW9uLHNpemluZyx0cmFuc2l0aW9uXSxcbiAgcHJlZml4TWFwOiB7XCJ0cmFuc2Zvcm1cIjpbXCJXZWJraXRcIixcIm1zXCJdLFwidHJhbnNmb3JtT3JpZ2luXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcInRyYW5zZm9ybU9yaWdpblhcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwidHJhbnNmb3JtT3JpZ2luWVwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJiYWNrZmFjZVZpc2liaWxpdHlcIjpbXCJXZWJraXRcIl0sXCJwZXJzcGVjdGl2ZVwiOltcIldlYmtpdFwiXSxcInBlcnNwZWN0aXZlT3JpZ2luXCI6W1wiV2Via2l0XCJdLFwidHJhbnNmb3JtU3R5bGVcIjpbXCJXZWJraXRcIl0sXCJ0cmFuc2Zvcm1PcmlnaW5aXCI6W1wiV2Via2l0XCJdLFwiYW5pbWF0aW9uXCI6W1wiV2Via2l0XCJdLFwiYW5pbWF0aW9uRGVsYXlcIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25EaXJlY3Rpb25cIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25GaWxsTW9kZVwiOltcIldlYmtpdFwiXSxcImFuaW1hdGlvbkR1cmF0aW9uXCI6W1wiV2Via2l0XCJdLFwiYW5pbWF0aW9uSXRlcmF0aW9uQ291bnRcIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25OYW1lXCI6W1wiV2Via2l0XCJdLFwiYW5pbWF0aW9uUGxheVN0YXRlXCI6W1wiV2Via2l0XCJdLFwiYW5pbWF0aW9uVGltaW5nRnVuY3Rpb25cIjpbXCJXZWJraXRcIl0sXCJhcHBlYXJhbmNlXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJ1c2VyU2VsZWN0XCI6W1wiV2Via2l0XCIsXCJNb3pcIixcIm1zXCJdLFwiZm9udEtlcm5pbmdcIjpbXCJXZWJraXRcIl0sXCJ0ZXh0RW1waGFzaXNQb3NpdGlvblwiOltcIldlYmtpdFwiXSxcInRleHRFbXBoYXNpc1wiOltcIldlYmtpdFwiXSxcInRleHRFbXBoYXNpc1N0eWxlXCI6W1wiV2Via2l0XCJdLFwidGV4dEVtcGhhc2lzQ29sb3JcIjpbXCJXZWJraXRcIl0sXCJib3hEZWNvcmF0aW9uQnJlYWtcIjpbXCJXZWJraXRcIl0sXCJjbGlwUGF0aFwiOltcIldlYmtpdFwiXSxcIm1hc2tJbWFnZVwiOltcIldlYmtpdFwiXSxcIm1hc2tNb2RlXCI6W1wiV2Via2l0XCJdLFwibWFza1JlcGVhdFwiOltcIldlYmtpdFwiXSxcIm1hc2tQb3NpdGlvblwiOltcIldlYmtpdFwiXSxcIm1hc2tDbGlwXCI6W1wiV2Via2l0XCJdLFwibWFza09yaWdpblwiOltcIldlYmtpdFwiXSxcIm1hc2tTaXplXCI6W1wiV2Via2l0XCJdLFwibWFza0NvbXBvc2l0ZVwiOltcIldlYmtpdFwiXSxcIm1hc2tcIjpbXCJXZWJraXRcIl0sXCJtYXNrQm9yZGVyU291cmNlXCI6W1wiV2Via2l0XCJdLFwibWFza0JvcmRlck1vZGVcIjpbXCJXZWJraXRcIl0sXCJtYXNrQm9yZGVyU2xpY2VcIjpbXCJXZWJraXRcIl0sXCJtYXNrQm9yZGVyV2lkdGhcIjpbXCJXZWJraXRcIl0sXCJtYXNrQm9yZGVyT3V0c2V0XCI6W1wiV2Via2l0XCJdLFwibWFza0JvcmRlclJlcGVhdFwiOltcIldlYmtpdFwiXSxcIm1hc2tCb3JkZXJcIjpbXCJXZWJraXRcIl0sXCJtYXNrVHlwZVwiOltcIldlYmtpdFwiXSxcInRleHREZWNvcmF0aW9uU3R5bGVcIjpbXCJXZWJraXRcIixcIk1velwiXSxcInRleHREZWNvcmF0aW9uU2tpcFwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwidGV4dERlY29yYXRpb25MaW5lXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJ0ZXh0RGVjb3JhdGlvbkNvbG9yXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJmaWx0ZXJcIjpbXCJXZWJraXRcIl0sXCJmb250RmVhdHVyZVNldHRpbmdzXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJicmVha0FmdGVyXCI6W1wiV2Via2l0XCIsXCJNb3pcIixcIm1zXCJdLFwiYnJlYWtCZWZvcmVcIjpbXCJXZWJraXRcIixcIk1velwiLFwibXNcIl0sXCJicmVha0luc2lkZVwiOltcIldlYmtpdFwiLFwiTW96XCIsXCJtc1wiXSxcImNvbHVtbkNvdW50XCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJjb2x1bW5GaWxsXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJjb2x1bW5HYXBcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtblJ1bGVcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtblJ1bGVDb2xvclwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uUnVsZVN0eWxlXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJjb2x1bW5SdWxlV2lkdGhcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtbnNcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtblNwYW5cIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtbldpZHRoXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJmbGV4XCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcImZsZXhCYXNpc1wiOltcIldlYmtpdFwiXSxcImZsZXhEaXJlY3Rpb25cIjpbXCJXZWJraXRcIixcIm1zXCJdLFwiZmxleEdyb3dcIjpbXCJXZWJraXRcIl0sXCJmbGV4Rmxvd1wiOltcIldlYmtpdFwiLFwibXNcIl0sXCJmbGV4U2hyaW5rXCI6W1wiV2Via2l0XCJdLFwiZmxleFdyYXBcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwiYWxpZ25Db250ZW50XCI6W1wiV2Via2l0XCJdLFwiYWxpZ25JdGVtc1wiOltcIldlYmtpdFwiXSxcImFsaWduU2VsZlwiOltcIldlYmtpdFwiXSxcImp1c3RpZnlDb250ZW50XCI6W1wiV2Via2l0XCJdLFwib3JkZXJcIjpbXCJXZWJraXRcIl0sXCJ0cmFuc2l0aW9uRGVsYXlcIjpbXCJXZWJraXRcIl0sXCJ0cmFuc2l0aW9uRHVyYXRpb25cIjpbXCJXZWJraXRcIl0sXCJ0cmFuc2l0aW9uUHJvcGVydHlcIjpbXCJXZWJraXRcIl0sXCJ0cmFuc2l0aW9uVGltaW5nRnVuY3Rpb25cIjpbXCJXZWJraXRcIl0sXCJiYWNrZHJvcEZpbHRlclwiOltcIldlYmtpdFwiXSxcInNjcm9sbFNuYXBUeXBlXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcInNjcm9sbFNuYXBQb2ludHNYXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcInNjcm9sbFNuYXBQb2ludHNZXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcInNjcm9sbFNuYXBEZXN0aW5hdGlvblwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJzY3JvbGxTbmFwQ29vcmRpbmF0ZVwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJzaGFwZUltYWdlVGhyZXNob2xkXCI6W1wiV2Via2l0XCJdLFwic2hhcGVJbWFnZU1hcmdpblwiOltcIldlYmtpdFwiXSxcInNoYXBlSW1hZ2VPdXRzaWRlXCI6W1wiV2Via2l0XCJdLFwiaHlwaGVuc1wiOltcIldlYmtpdFwiLFwiTW96XCIsXCJtc1wiXSxcImZsb3dJbnRvXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcImZsb3dGcm9tXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcInJlZ2lvbkZyYWdtZW50XCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcImJveFNpemluZ1wiOltcIk1velwiXSxcInRleHRBbGlnbkxhc3RcIjpbXCJNb3pcIl0sXCJ0YWJTaXplXCI6W1wiTW96XCJdLFwid3JhcEZsb3dcIjpbXCJtc1wiXSxcIndyYXBUaHJvdWdoXCI6W1wibXNcIl0sXCJ3cmFwTWFyZ2luXCI6W1wibXNcIl0sXCJ0b3VjaEFjdGlvblwiOltcIm1zXCJdLFwiZ3JpZFRlbXBsYXRlQ29sdW1uc1wiOltcIm1zXCJdLFwiZ3JpZFRlbXBsYXRlUm93c1wiOltcIm1zXCJdLFwiZ3JpZFRlbXBsYXRlQXJlYXNcIjpbXCJtc1wiXSxcImdyaWRUZW1wbGF0ZVwiOltcIm1zXCJdLFwiZ3JpZEF1dG9Db2x1bW5zXCI6W1wibXNcIl0sXCJncmlkQXV0b1Jvd3NcIjpbXCJtc1wiXSxcImdyaWRBdXRvRmxvd1wiOltcIm1zXCJdLFwiZ3JpZFwiOltcIm1zXCJdLFwiZ3JpZFJvd1N0YXJ0XCI6W1wibXNcIl0sXCJncmlkQ29sdW1uU3RhcnRcIjpbXCJtc1wiXSxcImdyaWRSb3dFbmRcIjpbXCJtc1wiXSxcImdyaWRSb3dcIjpbXCJtc1wiXSxcImdyaWRDb2x1bW5cIjpbXCJtc1wiXSxcImdyaWRDb2x1bW5FbmRcIjpbXCJtc1wiXSxcImdyaWRDb2x1bW5HYXBcIjpbXCJtc1wiXSxcImdyaWRSb3dHYXBcIjpbXCJtc1wiXSxcImdyaWRBcmVhXCI6W1wibXNcIl0sXCJncmlkR2FwXCI6W1wibXNcIl0sXCJ0ZXh0U2l6ZUFkanVzdFwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJib3JkZXJJbWFnZVwiOltcIldlYmtpdFwiXSxcImJvcmRlckltYWdlT3V0c2V0XCI6W1wiV2Via2l0XCJdLFwiYm9yZGVySW1hZ2VSZXBlYXRcIjpbXCJXZWJraXRcIl0sXCJib3JkZXJJbWFnZVNsaWNlXCI6W1wiV2Via2l0XCJdLFwiYm9yZGVySW1hZ2VTb3VyY2VcIjpbXCJXZWJraXRcIl0sXCJib3JkZXJJbWFnZVdpZHRoXCI6W1wiV2Via2l0XCJdfVxufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9zbGljZWRUb0FycmF5ID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gc2xpY2VJdGVyYXRvcihhcnIsIGkpIHsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfZSA9IHVuZGVmaW5lZDsgdHJ5IHsgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbJ3JldHVybiddKSBfaVsncmV0dXJuJ10oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9IHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgcmV0dXJuIGFycjsgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpIHsgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTsgfSBlbHNlIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZScpOyB9IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9zdHJpbmdIYXNoID0gcmVxdWlyZSgnc3RyaW5nLWhhc2gnKTtcblxudmFyIF9zdHJpbmdIYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmluZ0hhc2gpO1xuXG4vKiA6OlxudHlwZSBQYWlyID0gWyBzdHJpbmcsIGFueSBdO1xudHlwZSBQYWlycyA9IFBhaXJbXTtcbnR5cGUgUGFpcnNNYXBwZXIgPSAocGFpcjogUGFpcikgPT4gUGFpcjtcbnR5cGUgT2JqZWN0TWFwID0geyBbaWQ6c3RyaW5nXTogYW55IH07XG4qL1xuXG52YXIgbWFwT2JqID0gZnVuY3Rpb24gbWFwT2JqKG9iaiwgLyogOiBPYmplY3RNYXAgKi9cbmZuIC8qIDogUGFpcnNNYXBwZXIgKi9cbikgLyogOiBPYmplY3RNYXAgKi97XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgIHZhciBtYXBwZWRPYmogPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdmFyIF9mbiA9IGZuKFtrZXlzW2ldLCBvYmpba2V5c1tpXV1dKTtcblxuICAgICAgICB2YXIgX2ZuMiA9IF9zbGljZWRUb0FycmF5KF9mbiwgMik7XG5cbiAgICAgICAgdmFyIG5ld0tleSA9IF9mbjJbMF07XG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IF9mbjJbMV07XG5cbiAgICAgICAgbWFwcGVkT2JqW25ld0tleV0gPSBuZXdWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE9iajtcbn07XG5cbmV4cG9ydHMubWFwT2JqID0gbWFwT2JqO1xudmFyIFVQUEVSQ0FTRV9SRSA9IC8oW0EtWl0pL2c7XG52YXIgVVBQRVJDQVNFX1JFX1RPX0tFQkFCID0gZnVuY3Rpb24gVVBQRVJDQVNFX1JFX1RPX0tFQkFCKG1hdGNoIC8qIDogc3RyaW5nICovKSB7XG4gICAgcmV0dXJuICgvKiA6IHN0cmluZyAqLyctJyArIG1hdGNoLnRvTG93ZXJDYXNlKClcbiAgICApO1xufTtcblxudmFyIGtlYmFiaWZ5U3R5bGVOYW1lID0gZnVuY3Rpb24ga2ViYWJpZnlTdHlsZU5hbWUoc3RyaW5nIC8qIDogc3RyaW5nICovKSAvKiA6IHN0cmluZyAqL3tcbiAgICB2YXIgcmVzdWx0ID0gc3RyaW5nLnJlcGxhY2UoVVBQRVJDQVNFX1JFLCBVUFBFUkNBU0VfUkVfVE9fS0VCQUIpO1xuICAgIGlmIChyZXN1bHRbMF0gPT09ICdtJyAmJiByZXN1bHRbMV0gPT09ICdzJyAmJiByZXN1bHRbMl0gPT09ICctJykge1xuICAgICAgICByZXR1cm4gJy0nICsgcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0cy5rZWJhYmlmeVN0eWxlTmFtZSA9IGtlYmFiaWZ5U3R5bGVOYW1lO1xuLyoqXG4gKiBDU1MgcHJvcGVydGllcyB3aGljaCBhY2NlcHQgbnVtYmVycyBidXQgYXJlIG5vdCBpbiB1bml0cyBvZiBcInB4XCIuXG4gKiBUYWtlbiBmcm9tIFJlYWN0J3MgQ1NTUHJvcGVydHkuanNcbiAqL1xudmFyIGlzVW5pdGxlc3NOdW1iZXIgPSB7XG4gICAgYW5pbWF0aW9uSXRlcmF0aW9uQ291bnQ6IHRydWUsXG4gICAgYm9yZGVySW1hZ2VPdXRzZXQ6IHRydWUsXG4gICAgYm9yZGVySW1hZ2VTbGljZTogdHJ1ZSxcbiAgICBib3JkZXJJbWFnZVdpZHRoOiB0cnVlLFxuICAgIGJveEZsZXg6IHRydWUsXG4gICAgYm94RmxleEdyb3VwOiB0cnVlLFxuICAgIGJveE9yZGluYWxHcm91cDogdHJ1ZSxcbiAgICBjb2x1bW5Db3VudDogdHJ1ZSxcbiAgICBmbGV4OiB0cnVlLFxuICAgIGZsZXhHcm93OiB0cnVlLFxuICAgIGZsZXhQb3NpdGl2ZTogdHJ1ZSxcbiAgICBmbGV4U2hyaW5rOiB0cnVlLFxuICAgIGZsZXhOZWdhdGl2ZTogdHJ1ZSxcbiAgICBmbGV4T3JkZXI6IHRydWUsXG4gICAgZ3JpZFJvdzogdHJ1ZSxcbiAgICBncmlkQ29sdW1uOiB0cnVlLFxuICAgIGZvbnRXZWlnaHQ6IHRydWUsXG4gICAgbGluZUNsYW1wOiB0cnVlLFxuICAgIGxpbmVIZWlnaHQ6IHRydWUsXG4gICAgb3BhY2l0eTogdHJ1ZSxcbiAgICBvcmRlcjogdHJ1ZSxcbiAgICBvcnBoYW5zOiB0cnVlLFxuICAgIHRhYlNpemU6IHRydWUsXG4gICAgd2lkb3dzOiB0cnVlLFxuICAgIHpJbmRleDogdHJ1ZSxcbiAgICB6b29tOiB0cnVlLFxuXG4gICAgLy8gU1ZHLXJlbGF0ZWQgcHJvcGVydGllc1xuICAgIGZpbGxPcGFjaXR5OiB0cnVlLFxuICAgIGZsb29kT3BhY2l0eTogdHJ1ZSxcbiAgICBzdG9wT3BhY2l0eTogdHJ1ZSxcbiAgICBzdHJva2VEYXNoYXJyYXk6IHRydWUsXG4gICAgc3Ryb2tlRGFzaG9mZnNldDogdHJ1ZSxcbiAgICBzdHJva2VNaXRlcmxpbWl0OiB0cnVlLFxuICAgIHN0cm9rZU9wYWNpdHk6IHRydWUsXG4gICAgc3Ryb2tlV2lkdGg6IHRydWVcbn07XG5cbi8qKlxuICogVGFrZW4gZnJvbSBSZWFjdCdzIENTU1Byb3BlcnR5LmpzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHByZWZpeCB2ZW5kb3Itc3BlY2lmaWMgcHJlZml4LCBlZzogV2Via2l0XG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IHN0eWxlIG5hbWUsIGVnOiB0cmFuc2l0aW9uRHVyYXRpb25cbiAqIEByZXR1cm4ge3N0cmluZ30gc3R5bGUgbmFtZSBwcmVmaXhlZCB3aXRoIGBwcmVmaXhgLCBwcm9wZXJseSBjYW1lbENhc2VkLCBlZzpcbiAqIFdlYmtpdFRyYW5zaXRpb25EdXJhdGlvblxuICovXG5mdW5jdGlvbiBwcmVmaXhLZXkocHJlZml4LCBrZXkpIHtcbiAgICByZXR1cm4gcHJlZml4ICsga2V5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsga2V5LnN1YnN0cmluZygxKTtcbn1cblxuLyoqXG4gKiBTdXBwb3J0IHN0eWxlIG5hbWVzIHRoYXQgbWF5IGNvbWUgcGFzc2VkIGluIHByZWZpeGVkIGJ5IGFkZGluZyBwZXJtdXRhdGlvbnNcbiAqIG9mIHZlbmRvciBwcmVmaXhlcy5cbiAqIFRha2VuIGZyb20gUmVhY3QncyBDU1NQcm9wZXJ0eS5qc1xuICovXG52YXIgcHJlZml4ZXMgPSBbJ1dlYmtpdCcsICdtcycsICdNb3onLCAnTyddO1xuXG4vLyBVc2luZyBPYmplY3Qua2V5cyBoZXJlLCBvciBlbHNlIHRoZSB2YW5pbGxhIGZvci1pbiBsb29wIG1ha2VzIElFOCBnbyBpbnRvIGFuXG4vLyBpbmZpbml0ZSBsb29wLCBiZWNhdXNlIGl0IGl0ZXJhdGVzIG92ZXIgdGhlIG5ld2x5IGFkZGVkIHByb3BzIHRvby5cbi8vIFRha2VuIGZyb20gUmVhY3QncyBDU1NQcm9wZXJ0eS5qc1xuT2JqZWN0LmtleXMoaXNVbml0bGVzc051bWJlcikuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgIHByZWZpeGVzLmZvckVhY2goZnVuY3Rpb24gKHByZWZpeCkge1xuICAgICAgICBpc1VuaXRsZXNzTnVtYmVyW3ByZWZpeEtleShwcmVmaXgsIHByb3ApXSA9IGlzVW5pdGxlc3NOdW1iZXJbcHJvcF07XG4gICAgfSk7XG59KTtcblxudmFyIHN0cmluZ2lmeVZhbHVlID0gZnVuY3Rpb24gc3RyaW5naWZ5VmFsdWUoa2V5LCAvKiA6IHN0cmluZyAqL1xucHJvcCAvKiA6IGFueSAqL1xuKSAvKiA6IHN0cmluZyAqL3tcbiAgICBpZiAodHlwZW9mIHByb3AgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgaWYgKGlzVW5pdGxlc3NOdW1iZXJba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCIgKyBwcm9wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHByb3AgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJycgKyBwcm9wO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuc3RyaW5naWZ5VmFsdWUgPSBzdHJpbmdpZnlWYWx1ZTtcbnZhciBzdHJpbmdpZnlBbmRJbXBvcnRhbnRpZnlWYWx1ZSA9IGZ1bmN0aW9uIHN0cmluZ2lmeUFuZEltcG9ydGFudGlmeVZhbHVlKGtleSwgLyogOiBzdHJpbmcgKi9cbnByb3AgLyogOiBhbnkgKi9cbikge1xuICAgIHJldHVybiAoLyogOiBzdHJpbmcgKi9pbXBvcnRhbnRpZnkoc3RyaW5naWZ5VmFsdWUoa2V5LCBwcm9wKSlcbiAgICApO1xufTtcblxuZXhwb3J0cy5zdHJpbmdpZnlBbmRJbXBvcnRhbnRpZnlWYWx1ZSA9IHN0cmluZ2lmeUFuZEltcG9ydGFudGlmeVZhbHVlO1xuLy8gSGFzaCBhIGphdmFzY3JpcHQgb2JqZWN0IHVzaW5nIEpTT04uc3RyaW5naWZ5LiBUaGlzIGlzIHZlcnkgZmFzdCwgYWJvdXQgM1xuLy8gbWljcm9zZWNvbmRzIG9uIG15IGNvbXB1dGVyIGZvciBhIHNhbXBsZSBvYmplY3Q6XG4vLyBodHRwOi8vanNwZXJmLmNvbS90ZXN0LWhhc2hmbnYzMmEtaGFzaC81XG4vL1xuLy8gTm90ZSB0aGF0IHRoaXMgdXNlcyBKU09OLnN0cmluZ2lmeSB0byBzdHJpbmdpZnkgdGhlIG9iamVjdHMgc28gaW4gb3JkZXIgZm9yXG4vLyB0aGlzIHRvIHByb2R1Y2UgY29uc2lzdGVudCBoYXNoZXMgYnJvd3NlcnMgbmVlZCB0byBoYXZlIGEgY29uc2lzdGVudFxuLy8gb3JkZXJpbmcgb2Ygb2JqZWN0cy4gQmVuIEFscGVydCBzYXlzIHRoYXQgRmFjZWJvb2sgZGVwZW5kcyBvbiB0aGlzLCBzbyB3ZVxuLy8gY2FuIHByb2JhYmx5IGRlcGVuZCBvbiB0aGlzIHRvby5cbnZhciBoYXNoT2JqZWN0ID0gZnVuY3Rpb24gaGFzaE9iamVjdChvYmplY3QgLyogOiBPYmplY3RNYXAgKi8pIHtcbiAgICByZXR1cm4gKC8qIDogc3RyaW5nICovKDAsIF9zdHJpbmdIYXNoMlsnZGVmYXVsdCddKShKU09OLnN0cmluZ2lmeShvYmplY3QpKS50b1N0cmluZygzNilcbiAgICApO1xufTtcblxuZXhwb3J0cy5oYXNoT2JqZWN0ID0gaGFzaE9iamVjdDtcbi8vIEdpdmVuIGEgc2luZ2xlIHN0eWxlIHZhbHVlIHN0cmluZyBsaWtlIHRoZSBcImJcIiBmcm9tIFwiYTogYjtcIiwgYWRkcyAhaW1wb3J0YW50XG4vLyB0byBnZW5lcmF0ZSBcImIgIWltcG9ydGFudFwiLlxudmFyIGltcG9ydGFudGlmeSA9IGZ1bmN0aW9uIGltcG9ydGFudGlmeShzdHJpbmcgLyogOiBzdHJpbmcgKi8pIHtcbiAgICByZXR1cm4gKC8qIDogc3RyaW5nICovXG4gICAgICAgIC8vIEJyYWNrZXQgc3RyaW5nIGNoYXJhY3RlciBhY2Nlc3MgaXMgdmVyeSBmYXN0LCBhbmQgaW4gdGhlIGRlZmF1bHQgY2FzZSB3ZVxuICAgICAgICAvLyBub3JtYWxseSBkb24ndCBleHBlY3QgdGhlcmUgdG8gYmUgXCIhaW1wb3J0YW50XCIgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nXG4gICAgICAgIC8vIHNvIHdlIGNhbiB1c2UgdGhpcyBzaW1wbGUgY2hlY2sgdG8gdGFrZSBhbiBvcHRpbWl6ZWQgcGF0aC4gSWYgdGhlcmVcbiAgICAgICAgLy8gaGFwcGVucyB0byBiZSBhIFwiIVwiIGluIHRoaXMgcG9zaXRpb24sIHdlIGZvbGxvdyB1cCB3aXRoIGEgbW9yZSB0aG9yb3VnaFxuICAgICAgICAvLyBjaGVjay5cbiAgICAgICAgc3RyaW5nW3N0cmluZy5sZW5ndGggLSAxMF0gPT09ICchJyAmJiBzdHJpbmcuc2xpY2UoLTExKSA9PT0gJyAhaW1wb3J0YW50JyA/IHN0cmluZyA6IHN0cmluZyArICcgIWltcG9ydGFudCdcbiAgICApO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL25vLWltcG9ydGFudC5qcycpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHJhd0FzYXAgcHJvdmlkZXMgZXZlcnl0aGluZyB3ZSBuZWVkIGV4Y2VwdCBleGNlcHRpb24gbWFuYWdlbWVudC5cbnZhciByYXdBc2FwID0gcmVxdWlyZShcIi4vcmF3XCIpO1xuLy8gUmF3VGFza3MgYXJlIHJlY3ljbGVkIHRvIHJlZHVjZSBHQyBjaHVybi5cbnZhciBmcmVlVGFza3MgPSBbXTtcbi8vIFdlIHF1ZXVlIGVycm9ycyB0byBlbnN1cmUgdGhleSBhcmUgdGhyb3duIGluIHJpZ2h0IG9yZGVyIChGSUZPKS5cbi8vIEFycmF5LWFzLXF1ZXVlIGlzIGdvb2QgZW5vdWdoIGhlcmUsIHNpbmNlIHdlIGFyZSBqdXN0IGRlYWxpbmcgd2l0aCBleGNlcHRpb25zLlxudmFyIHBlbmRpbmdFcnJvcnMgPSBbXTtcbnZhciByZXF1ZXN0RXJyb3JUaHJvdyA9IHJhd0FzYXAubWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKHRocm93Rmlyc3RFcnJvcik7XG5cbmZ1bmN0aW9uIHRocm93Rmlyc3RFcnJvcigpIHtcbiAgICBpZiAocGVuZGluZ0Vycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgcGVuZGluZ0Vycm9ycy5zaGlmdCgpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDYWxscyBhIHRhc2sgYXMgc29vbiBhcyBwb3NzaWJsZSBhZnRlciByZXR1cm5pbmcsIGluIGl0cyBvd24gZXZlbnQsIHdpdGggcHJpb3JpdHlcbiAqIG92ZXIgb3RoZXIgZXZlbnRzIGxpa2UgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZXBhaW50LiBBbiBlcnJvciB0aHJvd24gZnJvbSBhblxuICogZXZlbnQgd2lsbCBub3QgaW50ZXJydXB0LCBub3IgZXZlbiBzdWJzdGFudGlhbGx5IHNsb3cgZG93biB0aGUgcHJvY2Vzc2luZyBvZlxuICogb3RoZXIgZXZlbnRzLCBidXQgd2lsbCBiZSByYXRoZXIgcG9zdHBvbmVkIHRvIGEgbG93ZXIgcHJpb3JpdHkgZXZlbnQuXG4gKiBAcGFyYW0ge3tjYWxsfX0gdGFzayBBIGNhbGxhYmxlIG9iamVjdCwgdHlwaWNhbGx5IGEgZnVuY3Rpb24gdGhhdCB0YWtlcyBub1xuICogYXJndW1lbnRzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGFzYXA7XG5mdW5jdGlvbiBhc2FwKHRhc2spIHtcbiAgICB2YXIgcmF3VGFzaztcbiAgICBpZiAoZnJlZVRhc2tzLmxlbmd0aCkge1xuICAgICAgICByYXdUYXNrID0gZnJlZVRhc2tzLnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJhd1Rhc2sgPSBuZXcgUmF3VGFzaygpO1xuICAgIH1cbiAgICByYXdUYXNrLnRhc2sgPSB0YXNrO1xuICAgIHJhd0FzYXAocmF3VGFzayk7XG59XG5cbi8vIFdlIHdyYXAgdGFza3Mgd2l0aCByZWN5Y2xhYmxlIHRhc2sgb2JqZWN0cy4gIEEgdGFzayBvYmplY3QgaW1wbGVtZW50c1xuLy8gYGNhbGxgLCBqdXN0IGxpa2UgYSBmdW5jdGlvbi5cbmZ1bmN0aW9uIFJhd1Rhc2soKSB7XG4gICAgdGhpcy50YXNrID0gbnVsbDtcbn1cblxuLy8gVGhlIHNvbGUgcHVycG9zZSBvZiB3cmFwcGluZyB0aGUgdGFzayBpcyB0byBjYXRjaCB0aGUgZXhjZXB0aW9uIGFuZCByZWN5Y2xlXG4vLyB0aGUgdGFzayBvYmplY3QgYWZ0ZXIgaXRzIHNpbmdsZSB1c2UuXG5SYXdUYXNrLnByb3RvdHlwZS5jYWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIHRoaXMudGFzay5jYWxsKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGFzYXAub25lcnJvcikge1xuICAgICAgICAgICAgLy8gVGhpcyBob29rIGV4aXN0cyBwdXJlbHkgZm9yIHRlc3RpbmcgcHVycG9zZXMuXG4gICAgICAgICAgICAvLyBJdHMgbmFtZSB3aWxsIGJlIHBlcmlvZGljYWxseSByYW5kb21pemVkIHRvIGJyZWFrIGFueSBjb2RlIHRoYXRcbiAgICAgICAgICAgIC8vIGRlcGVuZHMgb24gaXRzIGV4aXN0ZW5jZS5cbiAgICAgICAgICAgIGFzYXAub25lcnJvcihlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJbiBhIHdlYiBicm93c2VyLCBleGNlcHRpb25zIGFyZSBub3QgZmF0YWwuIEhvd2V2ZXIsIHRvIGF2b2lkXG4gICAgICAgICAgICAvLyBzbG93aW5nIGRvd24gdGhlIHF1ZXVlIG9mIHBlbmRpbmcgdGFza3MsIHdlIHJldGhyb3cgdGhlIGVycm9yIGluIGFcbiAgICAgICAgICAgIC8vIGxvd2VyIHByaW9yaXR5IHR1cm4uXG4gICAgICAgICAgICBwZW5kaW5nRXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgcmVxdWVzdEVycm9yVGhyb3coKTtcbiAgICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRoaXMudGFzayA9IG51bGw7XG4gICAgICAgIGZyZWVUYXNrc1tmcmVlVGFza3MubGVuZ3RoXSA9IHRoaXM7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyBVc2UgdGhlIGZhc3Rlc3QgbWVhbnMgcG9zc2libGUgdG8gZXhlY3V0ZSBhIHRhc2sgaW4gaXRzIG93biB0dXJuLCB3aXRoXG4vLyBwcmlvcml0eSBvdmVyIG90aGVyIGV2ZW50cyBpbmNsdWRpbmcgSU8sIGFuaW1hdGlvbiwgcmVmbG93LCBhbmQgcmVkcmF3XG4vLyBldmVudHMgaW4gYnJvd3NlcnMuXG4vL1xuLy8gQW4gZXhjZXB0aW9uIHRocm93biBieSBhIHRhc2sgd2lsbCBwZXJtYW5lbnRseSBpbnRlcnJ1cHQgdGhlIHByb2Nlc3Npbmcgb2Zcbi8vIHN1YnNlcXVlbnQgdGFza3MuIFRoZSBoaWdoZXIgbGV2ZWwgYGFzYXBgIGZ1bmN0aW9uIGVuc3VyZXMgdGhhdCBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93biBieSBhIHRhc2ssIHRoYXQgdGhlIHRhc2sgcXVldWUgd2lsbCBjb250aW51ZSBmbHVzaGluZyBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZSwgYnV0IGlmIHlvdSB1c2UgYHJhd0FzYXBgIGRpcmVjdGx5LCB5b3UgYXJlIHJlc3BvbnNpYmxlIHRvXG4vLyBlaXRoZXIgZW5zdXJlIHRoYXQgbm8gZXhjZXB0aW9ucyBhcmUgdGhyb3duIGZyb20geW91ciB0YXNrLCBvciB0byBtYW51YWxseVxuLy8gY2FsbCBgcmF3QXNhcC5yZXF1ZXN0Rmx1c2hgIGlmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5tb2R1bGUuZXhwb3J0cyA9IHJhd0FzYXA7XG5mdW5jdGlvbiByYXdBc2FwKHRhc2spIHtcbiAgICBpZiAoIXF1ZXVlLmxlbmd0aCkge1xuICAgICAgICByZXF1ZXN0Rmx1c2goKTtcbiAgICAgICAgZmx1c2hpbmcgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBFcXVpdmFsZW50IHRvIHB1c2gsIGJ1dCBhdm9pZHMgYSBmdW5jdGlvbiBjYWxsLlxuICAgIHF1ZXVlW3F1ZXVlLmxlbmd0aF0gPSB0YXNrO1xufVxuXG52YXIgcXVldWUgPSBbXTtcbi8vIE9uY2UgYSBmbHVzaCBoYXMgYmVlbiByZXF1ZXN0ZWQsIG5vIGZ1cnRoZXIgY2FsbHMgdG8gYHJlcXVlc3RGbHVzaGAgYXJlXG4vLyBuZWNlc3NhcnkgdW50aWwgdGhlIG5leHQgYGZsdXNoYCBjb21wbGV0ZXMuXG52YXIgZmx1c2hpbmcgPSBmYWxzZTtcbi8vIGByZXF1ZXN0Rmx1c2hgIGlzIGFuIGltcGxlbWVudGF0aW9uLXNwZWNpZmljIG1ldGhvZCB0aGF0IGF0dGVtcHRzIHRvIGtpY2tcbi8vIG9mZiBhIGBmbHVzaGAgZXZlbnQgYXMgcXVpY2tseSBhcyBwb3NzaWJsZS4gYGZsdXNoYCB3aWxsIGF0dGVtcHQgdG8gZXhoYXVzdFxuLy8gdGhlIGV2ZW50IHF1ZXVlIGJlZm9yZSB5aWVsZGluZyB0byB0aGUgYnJvd3NlcidzIG93biBldmVudCBsb29wLlxudmFyIHJlcXVlc3RGbHVzaDtcbi8vIFRoZSBwb3NpdGlvbiBvZiB0aGUgbmV4dCB0YXNrIHRvIGV4ZWN1dGUgaW4gdGhlIHRhc2sgcXVldWUuIFRoaXMgaXNcbi8vIHByZXNlcnZlZCBiZXR3ZWVuIGNhbGxzIHRvIGBmbHVzaGAgc28gdGhhdCBpdCBjYW4gYmUgcmVzdW1lZCBpZlxuLy8gYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24uXG52YXIgaW5kZXggPSAwO1xuLy8gSWYgYSB0YXNrIHNjaGVkdWxlcyBhZGRpdGlvbmFsIHRhc2tzIHJlY3Vyc2l2ZWx5LCB0aGUgdGFzayBxdWV1ZSBjYW4gZ3Jvd1xuLy8gdW5ib3VuZGVkLiBUbyBwcmV2ZW50IG1lbW9yeSBleGhhdXN0aW9uLCB0aGUgdGFzayBxdWV1ZSB3aWxsIHBlcmlvZGljYWxseVxuLy8gdHJ1bmNhdGUgYWxyZWFkeS1jb21wbGV0ZWQgdGFza3MuXG52YXIgY2FwYWNpdHkgPSAxMDI0O1xuXG4vLyBUaGUgZmx1c2ggZnVuY3Rpb24gcHJvY2Vzc2VzIGFsbCB0YXNrcyB0aGF0IGhhdmUgYmVlbiBzY2hlZHVsZWQgd2l0aFxuLy8gYHJhd0FzYXBgIHVubGVzcyBhbmQgdW50aWwgb25lIG9mIHRob3NlIHRhc2tzIHRocm93cyBhbiBleGNlcHRpb24uXG4vLyBJZiBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgYGZsdXNoYCBlbnN1cmVzIHRoYXQgaXRzIHN0YXRlIHdpbGwgcmVtYWluXG4vLyBjb25zaXN0ZW50IGFuZCB3aWxsIHJlc3VtZSB3aGVyZSBpdCBsZWZ0IG9mZiB3aGVuIGNhbGxlZCBhZ2Fpbi5cbi8vIEhvd2V2ZXIsIGBmbHVzaGAgZG9lcyBub3QgbWFrZSBhbnkgYXJyYW5nZW1lbnRzIHRvIGJlIGNhbGxlZCBhZ2FpbiBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93bi5cbmZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHdoaWxlIChpbmRleCA8IHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgIC8vIEFkdmFuY2UgdGhlIGluZGV4IGJlZm9yZSBjYWxsaW5nIHRoZSB0YXNrLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSB3aWxsXG4gICAgICAgIC8vIGJlZ2luIGZsdXNoaW5nIG9uIHRoZSBuZXh0IHRhc2sgdGhlIHRhc2sgdGhyb3dzIGFuIGVycm9yLlxuICAgICAgICBpbmRleCA9IGluZGV4ICsgMTtcbiAgICAgICAgcXVldWVbY3VycmVudEluZGV4XS5jYWxsKCk7XG4gICAgICAgIC8vIFByZXZlbnQgbGVha2luZyBtZW1vcnkgZm9yIGxvbmcgY2hhaW5zIG9mIHJlY3Vyc2l2ZSBjYWxscyB0byBgYXNhcGAuXG4gICAgICAgIC8vIElmIHdlIGNhbGwgYGFzYXBgIHdpdGhpbiB0YXNrcyBzY2hlZHVsZWQgYnkgYGFzYXBgLCB0aGUgcXVldWUgd2lsbFxuICAgICAgICAvLyBncm93LCBidXQgdG8gYXZvaWQgYW4gTyhuKSB3YWxrIGZvciBldmVyeSB0YXNrIHdlIGV4ZWN1dGUsIHdlIGRvbid0XG4gICAgICAgIC8vIHNoaWZ0IHRhc2tzIG9mZiB0aGUgcXVldWUgYWZ0ZXIgdGhleSBoYXZlIGJlZW4gZXhlY3V0ZWQuXG4gICAgICAgIC8vIEluc3RlYWQsIHdlIHBlcmlvZGljYWxseSBzaGlmdCAxMDI0IHRhc2tzIG9mZiB0aGUgcXVldWUuXG4gICAgICAgIGlmIChpbmRleCA+IGNhcGFjaXR5KSB7XG4gICAgICAgICAgICAvLyBNYW51YWxseSBzaGlmdCBhbGwgdmFsdWVzIHN0YXJ0aW5nIGF0IHRoZSBpbmRleCBiYWNrIHRvIHRoZVxuICAgICAgICAgICAgLy8gYmVnaW5uaW5nIG9mIHRoZSBxdWV1ZS5cbiAgICAgICAgICAgIGZvciAodmFyIHNjYW4gPSAwLCBuZXdMZW5ndGggPSBxdWV1ZS5sZW5ndGggLSBpbmRleDsgc2NhbiA8IG5ld0xlbmd0aDsgc2NhbisrKSB7XG4gICAgICAgICAgICAgICAgcXVldWVbc2Nhbl0gPSBxdWV1ZVtzY2FuICsgaW5kZXhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcXVldWUubGVuZ3RoIC09IGluZGV4O1xuICAgICAgICAgICAgaW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgaW5kZXggPSAwO1xuICAgIGZsdXNoaW5nID0gZmFsc2U7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIGlzIGltcGxlbWVudGVkIHVzaW5nIGEgc3RyYXRlZ3kgYmFzZWQgb24gZGF0YSBjb2xsZWN0ZWQgZnJvbVxuLy8gZXZlcnkgYXZhaWxhYmxlIFNhdWNlTGFicyBTZWxlbml1bSB3ZWIgZHJpdmVyIHdvcmtlciBhdCB0aW1lIG9mIHdyaXRpbmcuXG4vLyBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xbUctNVVZR3VwNXF4R2RFTVdraFA2QldDejA1M05VYjJFMVFvVVRVMTZ1QS9lZGl0I2dpZD03ODM3MjQ1OTNcblxuLy8gU2FmYXJpIDYgYW5kIDYuMSBmb3IgZGVza3RvcCwgaVBhZCwgYW5kIGlQaG9uZSBhcmUgdGhlIG9ubHkgYnJvd3NlcnMgdGhhdFxuLy8gaGF2ZSBXZWJLaXRNdXRhdGlvbk9ic2VydmVyIGJ1dCBub3QgdW4tcHJlZml4ZWQgTXV0YXRpb25PYnNlcnZlci5cbi8vIE11c3QgdXNlIGBnbG9iYWxgIG9yIGBzZWxmYCBpbnN0ZWFkIG9mIGB3aW5kb3dgIHRvIHdvcmsgaW4gYm90aCBmcmFtZXMgYW5kIHdlYlxuLy8gd29ya2Vycy4gYGdsb2JhbGAgaXMgYSBwcm92aXNpb24gb2YgQnJvd3NlcmlmeSwgTXIsIE1ycywgb3IgTW9wLlxuXG4vKiBnbG9iYWxzIHNlbGYgKi9cbnZhciBzY29wZSA9IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiBzZWxmO1xudmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gc2NvcGUuTXV0YXRpb25PYnNlcnZlciB8fCBzY29wZS5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG4vLyBNdXRhdGlvbk9ic2VydmVycyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBoYXZlIGhpZ2ggcHJpb3JpdHkgYW5kIHdvcmtcbi8vIHJlbGlhYmx5IGV2ZXJ5d2hlcmUgdGhleSBhcmUgaW1wbGVtZW50ZWQuXG4vLyBUaGV5IGFyZSBpbXBsZW1lbnRlZCBpbiBhbGwgbW9kZXJuIGJyb3dzZXJzLlxuLy9cbi8vIC0gQW5kcm9pZCA0LTQuM1xuLy8gLSBDaHJvbWUgMjYtMzRcbi8vIC0gRmlyZWZveCAxNC0yOVxuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciAxMVxuLy8gLSBpUGFkIFNhZmFyaSA2LTcuMVxuLy8gLSBpUGhvbmUgU2FmYXJpIDctNy4xXG4vLyAtIFNhZmFyaSA2LTdcbmlmICh0eXBlb2YgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcblxuLy8gTWVzc2FnZUNoYW5uZWxzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGdpdmUgZGlyZWN0IGFjY2VzcyB0byB0aGUgSFRNTFxuLy8gdGFzayBxdWV1ZSwgYXJlIGltcGxlbWVudGVkIGluIEludGVybmV0IEV4cGxvcmVyIDEwLCBTYWZhcmkgNS4wLTEsIGFuZCBPcGVyYVxuLy8gMTEtMTIsIGFuZCBpbiB3ZWIgd29ya2VycyBpbiBtYW55IGVuZ2luZXMuXG4vLyBBbHRob3VnaCBtZXNzYWdlIGNoYW5uZWxzIHlpZWxkIHRvIGFueSBxdWV1ZWQgcmVuZGVyaW5nIGFuZCBJTyB0YXNrcywgdGhleVxuLy8gd291bGQgYmUgYmV0dGVyIHRoYW4gaW1wb3NpbmcgdGhlIDRtcyBkZWxheSBvZiB0aW1lcnMuXG4vLyBIb3dldmVyLCB0aGV5IGRvIG5vdCB3b3JrIHJlbGlhYmx5IGluIEludGVybmV0IEV4cGxvcmVyIG9yIFNhZmFyaS5cblxuLy8gSW50ZXJuZXQgRXhwbG9yZXIgMTAgaXMgdGhlIG9ubHkgYnJvd3NlciB0aGF0IGhhcyBzZXRJbW1lZGlhdGUgYnV0IGRvZXNcbi8vIG5vdCBoYXZlIE11dGF0aW9uT2JzZXJ2ZXJzLlxuLy8gQWx0aG91Z2ggc2V0SW1tZWRpYXRlIHlpZWxkcyB0byB0aGUgYnJvd3NlcidzIHJlbmRlcmVyLCBpdCB3b3VsZCBiZVxuLy8gcHJlZmVycmFibGUgdG8gZmFsbGluZyBiYWNrIHRvIHNldFRpbWVvdXQgc2luY2UgaXQgZG9lcyBub3QgaGF2ZVxuLy8gdGhlIG1pbmltdW0gNG1zIHBlbmFsdHkuXG4vLyBVbmZvcnR1bmF0ZWx5IHRoZXJlIGFwcGVhcnMgdG8gYmUgYSBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAgTW9iaWxlIChhbmRcbi8vIERlc2t0b3AgdG8gYSBsZXNzZXIgZXh0ZW50KSB0aGF0IHJlbmRlcnMgYm90aCBzZXRJbW1lZGlhdGUgYW5kXG4vLyBNZXNzYWdlQ2hhbm5lbCB1c2VsZXNzIGZvciB0aGUgcHVycG9zZXMgb2YgQVNBUC5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS9pc3N1ZXMvMzk2XG5cbi8vIFRpbWVycyBhcmUgaW1wbGVtZW50ZWQgdW5pdmVyc2FsbHkuXG4vLyBXZSBmYWxsIGJhY2sgdG8gdGltZXJzIGluIHdvcmtlcnMgaW4gbW9zdCBlbmdpbmVzLCBhbmQgaW4gZm9yZWdyb3VuZFxuLy8gY29udGV4dHMgaW4gdGhlIGZvbGxvd2luZyBicm93c2Vycy5cbi8vIEhvd2V2ZXIsIG5vdGUgdGhhdCBldmVuIHRoaXMgc2ltcGxlIGNhc2UgcmVxdWlyZXMgbnVhbmNlcyB0byBvcGVyYXRlIGluIGFcbi8vIGJyb2FkIHNwZWN0cnVtIG9mIGJyb3dzZXJzLlxuLy9cbi8vIC0gRmlyZWZveCAzLTEzXG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDYtOVxuLy8gLSBpUGFkIFNhZmFyaSA0LjNcbi8vIC0gTHlueCAyLjguN1xufSBlbHNlIHtcbiAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoZmx1c2gpO1xufVxuXG4vLyBgcmVxdWVzdEZsdXNoYCByZXF1ZXN0cyB0aGF0IHRoZSBoaWdoIHByaW9yaXR5IGV2ZW50IHF1ZXVlIGJlIGZsdXNoZWQgYXNcbi8vIHNvb24gYXMgcG9zc2libGUuXG4vLyBUaGlzIGlzIHVzZWZ1bCB0byBwcmV2ZW50IGFuIGVycm9yIHRocm93biBpbiBhIHRhc2sgZnJvbSBzdGFsbGluZyB0aGUgZXZlbnRcbi8vIHF1ZXVlIGlmIHRoZSBleGNlcHRpb24gaGFuZGxlZCBieSBOb2RlLmpz4oCZc1xuLy8gYHByb2Nlc3Mub24oXCJ1bmNhdWdodEV4Y2VwdGlvblwiKWAgb3IgYnkgYSBkb21haW4uXG5yYXdBc2FwLnJlcXVlc3RGbHVzaCA9IHJlcXVlc3RGbHVzaDtcblxuLy8gVG8gcmVxdWVzdCBhIGhpZ2ggcHJpb3JpdHkgZXZlbnQsIHdlIGluZHVjZSBhIG11dGF0aW9uIG9ic2VydmVyIGJ5IHRvZ2dsaW5nXG4vLyB0aGUgdGV4dCBvZiBhIHRleHQgbm9kZSBiZXR3ZWVuIFwiMVwiIGFuZCBcIi0xXCIuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjaykge1xuICAgIHZhciB0b2dnbGUgPSAxO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuICAgICAgICB0b2dnbGUgPSAtdG9nZ2xlO1xuICAgICAgICBub2RlLmRhdGEgPSB0b2dnbGU7XG4gICAgfTtcbn1cblxuLy8gVGhlIG1lc3NhZ2UgY2hhbm5lbCB0ZWNobmlxdWUgd2FzIGRpc2NvdmVyZWQgYnkgTWFsdGUgVWJsIGFuZCB3YXMgdGhlXG4vLyBvcmlnaW5hbCBmb3VuZGF0aW9uIGZvciB0aGlzIGxpYnJhcnkuXG4vLyBodHRwOi8vd3d3Lm5vbmJsb2NraW5nLmlvLzIwMTEvMDYvd2luZG93bmV4dHRpY2suaHRtbFxuXG4vLyBTYWZhcmkgNi4wLjUgKGF0IGxlYXN0KSBpbnRlcm1pdHRlbnRseSBmYWlscyB0byBjcmVhdGUgbWVzc2FnZSBwb3J0cyBvbiBhXG4vLyBwYWdlJ3MgZmlyc3QgbG9hZC4gVGhhbmtmdWxseSwgdGhpcyB2ZXJzaW9uIG9mIFNhZmFyaSBzdXBwb3J0c1xuLy8gTXV0YXRpb25PYnNlcnZlcnMsIHNvIHdlIGRvbid0IG5lZWQgdG8gZmFsbCBiYWNrIGluIHRoYXQgY2FzZS5cblxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU1lc3NhZ2VDaGFubmVsKGNhbGxiYWNrKSB7XG4vLyAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbi8vICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGNhbGxiYWNrO1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBGb3IgcmVhc29ucyBleHBsYWluZWQgYWJvdmUsIHdlIGFyZSBhbHNvIHVuYWJsZSB0byB1c2UgYHNldEltbWVkaWF0ZWBcbi8vIHVuZGVyIGFueSBjaXJjdW1zdGFuY2VzLlxuLy8gRXZlbiBpZiB3ZSB3ZXJlLCB0aGVyZSBpcyBhbm90aGVyIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMC5cbi8vIEl0IGlzIG5vdCBzdWZmaWNpZW50IHRvIGFzc2lnbiBgc2V0SW1tZWRpYXRlYCB0byBgcmVxdWVzdEZsdXNoYCBiZWNhdXNlXG4vLyBgc2V0SW1tZWRpYXRlYCBtdXN0IGJlIGNhbGxlZCAqYnkgbmFtZSogYW5kIHRoZXJlZm9yZSBtdXN0IGJlIHdyYXBwZWQgaW4gYVxuLy8gY2xvc3VyZS5cbi8vIE5ldmVyIGZvcmdldC5cblxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgc2V0SW1tZWRpYXRlKGNhbGxiYWNrKTtcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBTYWZhcmkgNi4wIGhhcyBhIHByb2JsZW0gd2hlcmUgdGltZXJzIHdpbGwgZ2V0IGxvc3Qgd2hpbGUgdGhlIHVzZXIgaXNcbi8vIHNjcm9sbGluZy4gVGhpcyBwcm9ibGVtIGRvZXMgbm90IGltcGFjdCBBU0FQIGJlY2F1c2UgU2FmYXJpIDYuMCBzdXBwb3J0c1xuLy8gbXV0YXRpb24gb2JzZXJ2ZXJzLCBzbyB0aGF0IGltcGxlbWVudGF0aW9uIGlzIHVzZWQgaW5zdGVhZC5cbi8vIEhvd2V2ZXIsIGlmIHdlIGV2ZXIgZWxlY3QgdG8gdXNlIHRpbWVycyBpbiBTYWZhcmksIHRoZSBwcmV2YWxlbnQgd29yay1hcm91bmRcbi8vIGlzIHRvIGFkZCBhIHNjcm9sbCBldmVudCBsaXN0ZW5lciB0aGF0IGNhbGxzIGZvciBhIGZsdXNoLlxuXG4vLyBgc2V0VGltZW91dGAgZG9lcyBub3QgY2FsbCB0aGUgcGFzc2VkIGNhbGxiYWNrIGlmIHRoZSBkZWxheSBpcyBsZXNzIHRoYW5cbi8vIGFwcHJveGltYXRlbHkgNyBpbiB3ZWIgd29ya2VycyBpbiBGaXJlZm94IDggdGhyb3VnaCAxOCwgYW5kIHNvbWV0aW1lcyBub3Rcbi8vIGV2ZW4gdGhlbi5cblxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuICAgICAgICAvLyBXZSBkaXNwYXRjaCBhIHRpbWVvdXQgd2l0aCBhIHNwZWNpZmllZCBkZWxheSBvZiAwIGZvciBlbmdpbmVzIHRoYXRcbiAgICAgICAgLy8gY2FuIHJlbGlhYmx5IGFjY29tbW9kYXRlIHRoYXQgcmVxdWVzdC4gVGhpcyB3aWxsIHVzdWFsbHkgYmUgc25hcHBlZFxuICAgICAgICAvLyB0byBhIDQgbWlsaXNlY29uZCBkZWxheSwgYnV0IG9uY2Ugd2UncmUgZmx1c2hpbmcsIHRoZXJlJ3Mgbm8gZGVsYXlcbiAgICAgICAgLy8gYmV0d2VlbiBldmVudHMuXG4gICAgICAgIHZhciB0aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChoYW5kbGVUaW1lciwgMCk7XG4gICAgICAgIC8vIEhvd2V2ZXIsIHNpbmNlIHRoaXMgdGltZXIgZ2V0cyBmcmVxdWVudGx5IGRyb3BwZWQgaW4gRmlyZWZveFxuICAgICAgICAvLyB3b3JrZXJzLCB3ZSBlbmxpc3QgYW4gaW50ZXJ2YWwgaGFuZGxlIHRoYXQgd2lsbCB0cnkgdG8gZmlyZVxuICAgICAgICAvLyBhbiBldmVudCAyMCB0aW1lcyBwZXIgc2Vjb25kIHVudGlsIGl0IHN1Y2NlZWRzLlxuICAgICAgICB2YXIgaW50ZXJ2YWxIYW5kbGUgPSBzZXRJbnRlcnZhbChoYW5kbGVUaW1lciwgNTApO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRpbWVyKCkge1xuICAgICAgICAgICAgLy8gV2hpY2hldmVyIHRpbWVyIHN1Y2NlZWRzIHdpbGwgY2FuY2VsIGJvdGggdGltZXJzIGFuZFxuICAgICAgICAgICAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2suXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEhhbmRsZSk7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSGFuZGxlKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBUaGlzIGlzIGZvciBgYXNhcC5qc2Agb25seS5cbi8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdCBkZXBlbmRzIG9uXG4vLyBpdHMgZXhpc3RlbmNlLlxucmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIgPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXI7XG5cbi8vIEFTQVAgd2FzIG9yaWdpbmFsbHkgYSBuZXh0VGljayBzaGltIGluY2x1ZGVkIGluIFEuIFRoaXMgd2FzIGZhY3RvcmVkIG91dFxuLy8gaW50byB0aGlzIEFTQVAgcGFja2FnZS4gSXQgd2FzIGxhdGVyIGFkYXB0ZWQgdG8gUlNWUCB3aGljaCBtYWRlIGZ1cnRoZXJcbi8vIGFtZW5kbWVudHMuIFRoZXNlIGRlY2lzaW9ucywgcGFydGljdWxhcmx5IHRvIG1hcmdpbmFsaXplIE1lc3NhZ2VDaGFubmVsIGFuZFxuLy8gdG8gY2FwdHVyZSB0aGUgTXV0YXRpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbiBpbiBhIGNsb3N1cmUsIHdlcmUgaW50ZWdyYXRlZFxuLy8gYmFjayBpbnRvIEFTQVAgcHJvcGVyLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RpbGRlaW8vcnN2cC5qcy9ibG9iL2NkZGY3MjMyNTQ2YTljZjg1ODUyNGI3NWNkZTZmOWVkZjcyNjIwYTcvbGliL3JzdnAvYXNhcC5qc1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gaHlwaGVuYXRlUHJvcGVydHk7XG5cbnZhciBfaHlwaGVuYXRlU3R5bGVOYW1lID0gcmVxdWlyZSgnaHlwaGVuYXRlLXN0eWxlLW5hbWUnKTtcblxudmFyIF9oeXBoZW5hdGVTdHlsZU5hbWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaHlwaGVuYXRlU3R5bGVOYW1lKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gaHlwaGVuYXRlUHJvcGVydHkocHJvcGVydHkpIHtcbiAgcmV0dXJuICgwLCBfaHlwaGVuYXRlU3R5bGVOYW1lMi5kZWZhdWx0KShwcm9wZXJ0eSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBpc1ByZWZpeGVkVmFsdWU7XG5cbnZhciByZWdleCA9IC8td2Via2l0LXwtbW96LXwtbXMtLztcblxuZnVuY3Rpb24gaXNQcmVmaXhlZFZhbHVlKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHJlZ2V4LnRlc3QodmFsdWUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXBwZXJjYXNlUGF0dGVybiA9IC9bQS1aXS9nO1xudmFyIG1zUGF0dGVybiA9IC9ebXMtLztcbnZhciBjYWNoZSA9IHt9O1xuXG5mdW5jdGlvbiBoeXBoZW5hdGVTdHlsZU5hbWUoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZyBpbiBjYWNoZVxuICAgID8gY2FjaGVbc3RyaW5nXVxuICAgIDogY2FjaGVbc3RyaW5nXSA9IHN0cmluZ1xuICAgICAgLnJlcGxhY2UodXBwZXJjYXNlUGF0dGVybiwgJy0kJicpXG4gICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgLnJlcGxhY2UobXNQYXR0ZXJuLCAnLW1zLScpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGh5cGhlbmF0ZVN0eWxlTmFtZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNyZWF0ZVByZWZpeGVyO1xuXG52YXIgX3ByZWZpeFByb3BlcnR5ID0gcmVxdWlyZSgnLi4vdXRpbHMvcHJlZml4UHJvcGVydHknKTtcblxudmFyIF9wcmVmaXhQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcmVmaXhQcm9wZXJ0eSk7XG5cbnZhciBfcHJlZml4VmFsdWUgPSByZXF1aXJlKCcuLi91dGlscy9wcmVmaXhWYWx1ZScpO1xuXG52YXIgX3ByZWZpeFZhbHVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ByZWZpeFZhbHVlKTtcblxudmFyIF9hZGROZXdWYWx1ZXNPbmx5ID0gcmVxdWlyZSgnLi4vdXRpbHMvYWRkTmV3VmFsdWVzT25seScpO1xuXG52YXIgX2FkZE5ld1ZhbHVlc09ubHkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYWRkTmV3VmFsdWVzT25seSk7XG5cbnZhciBfaXNPYmplY3QgPSByZXF1aXJlKCcuLi91dGlscy9pc09iamVjdCcpO1xuXG52YXIgX2lzT2JqZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzT2JqZWN0KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gY3JlYXRlUHJlZml4ZXIoX3JlZikge1xuICB2YXIgcHJlZml4TWFwID0gX3JlZi5wcmVmaXhNYXAsXG4gICAgICBwbHVnaW5zID0gX3JlZi5wbHVnaW5zO1xuXG4gIGZ1bmN0aW9uIHByZWZpeEFsbChzdHlsZSkge1xuICAgIGZvciAodmFyIHByb3BlcnR5IGluIHN0eWxlKSB7XG4gICAgICB2YXIgdmFsdWUgPSBzdHlsZVtwcm9wZXJ0eV07XG5cbiAgICAgIC8vIGhhbmRsZSBuZXN0ZWQgb2JqZWN0c1xuICAgICAgaWYgKCgwLCBfaXNPYmplY3QyLmRlZmF1bHQpKHZhbHVlKSkge1xuICAgICAgICBzdHlsZVtwcm9wZXJ0eV0gPSBwcmVmaXhBbGwodmFsdWUpO1xuICAgICAgICAvLyBoYW5kbGUgYXJyYXkgdmFsdWVzXG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHZhciBjb21iaW5lZFZhbHVlID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgdmFyIHByb2Nlc3NlZFZhbHVlID0gKDAsIF9wcmVmaXhWYWx1ZTIuZGVmYXVsdCkocGx1Z2lucywgcHJvcGVydHksIHZhbHVlW2ldLCBzdHlsZSwgcHJlZml4TWFwKTtcbiAgICAgICAgICAoMCwgX2FkZE5ld1ZhbHVlc09ubHkyLmRlZmF1bHQpKGNvbWJpbmVkVmFsdWUsIHByb2Nlc3NlZFZhbHVlIHx8IHZhbHVlW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9ubHkgbW9kaWZ5IHRoZSB2YWx1ZSBpZiBpdCB3YXMgdG91Y2hlZFxuICAgICAgICAvLyBieSBhbnkgcGx1Z2luIHRvIHByZXZlbnQgdW5uZWNlc3NhcnkgbXV0YXRpb25zXG4gICAgICAgIGlmIChjb21iaW5lZFZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBzdHlsZVtwcm9wZXJ0eV0gPSBjb21iaW5lZFZhbHVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgX3Byb2Nlc3NlZFZhbHVlID0gKDAsIF9wcmVmaXhWYWx1ZTIuZGVmYXVsdCkocGx1Z2lucywgcHJvcGVydHksIHZhbHVlLCBzdHlsZSwgcHJlZml4TWFwKTtcblxuICAgICAgICAvLyBvbmx5IG1vZGlmeSB0aGUgdmFsdWUgaWYgaXQgd2FzIHRvdWNoZWRcbiAgICAgICAgLy8gYnkgYW55IHBsdWdpbiB0byBwcmV2ZW50IHVubmVjZXNzYXJ5IG11dGF0aW9uc1xuICAgICAgICBpZiAoX3Byb2Nlc3NlZFZhbHVlKSB7XG4gICAgICAgICAgc3R5bGVbcHJvcGVydHldID0gX3Byb2Nlc3NlZFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgKDAsIF9wcmVmaXhQcm9wZXJ0eTIuZGVmYXVsdCkocHJlZml4TWFwLCBwcm9wZXJ0eSwgc3R5bGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdHlsZTtcbiAgfVxuXG4gIHJldHVybiBwcmVmaXhBbGw7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjYWxjO1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZSA9IHJlcXVpcmUoJ2Nzcy1pbi1qcy11dGlscy9saWIvaXNQcmVmaXhlZFZhbHVlJyk7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUHJlZml4ZWRWYWx1ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBwcmVmaXhlcyA9IFsnLXdlYmtpdC0nLCAnLW1vei0nLCAnJ107XG5mdW5jdGlvbiBjYWxjKHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAhKDAsIF9pc1ByZWZpeGVkVmFsdWUyLmRlZmF1bHQpKHZhbHVlKSAmJiB2YWx1ZS5pbmRleE9mKCdjYWxjKCcpID4gLTEpIHtcbiAgICByZXR1cm4gcHJlZml4ZXMubWFwKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9jYWxjXFwoL2csIHByZWZpeCArICdjYWxjKCcpO1xuICAgIH0pO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjcm9zc0ZhZGU7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQcmVmaXhlZFZhbHVlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLy8gaHR0cDovL2Nhbml1c2UuY29tLyNzZWFyY2g9Y3Jvc3MtZmFkZVxudmFyIHByZWZpeGVzID0gWyctd2Via2l0LScsICcnXTtcbmZ1bmN0aW9uIGNyb3NzRmFkZShwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgISgwLCBfaXNQcmVmaXhlZFZhbHVlMi5kZWZhdWx0KSh2YWx1ZSkgJiYgdmFsdWUuaW5kZXhPZignY3Jvc3MtZmFkZSgnKSA+IC0xKSB7XG4gICAgcmV0dXJuIHByZWZpeGVzLm1hcChmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvY3Jvc3MtZmFkZVxcKC9nLCBwcmVmaXggKyAnY3Jvc3MtZmFkZSgnKTtcbiAgICB9KTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gY3Vyc29yO1xudmFyIHByZWZpeGVzID0gWyctd2Via2l0LScsICctbW96LScsICcnXTtcblxudmFyIHZhbHVlcyA9IHtcbiAgJ3pvb20taW4nOiB0cnVlLFxuICAnem9vbS1vdXQnOiB0cnVlLFxuICBncmFiOiB0cnVlLFxuICBncmFiYmluZzogdHJ1ZVxufTtcblxuZnVuY3Rpb24gY3Vyc29yKHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAocHJvcGVydHkgPT09ICdjdXJzb3InICYmIHZhbHVlcy5oYXNPd25Qcm9wZXJ0eSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gcHJlZml4ZXMubWFwKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgIHJldHVybiBwcmVmaXggKyB2YWx1ZTtcbiAgICB9KTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZmlsdGVyO1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZSA9IHJlcXVpcmUoJ2Nzcy1pbi1qcy11dGlscy9saWIvaXNQcmVmaXhlZFZhbHVlJyk7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUHJlZml4ZWRWYWx1ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8vIGh0dHA6Ly9jYW5pdXNlLmNvbS8jZmVhdD1jc3MtZmlsdGVyLWZ1bmN0aW9uXG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJyddO1xuZnVuY3Rpb24gZmlsdGVyKHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAhKDAsIF9pc1ByZWZpeGVkVmFsdWUyLmRlZmF1bHQpKHZhbHVlKSAmJiB2YWx1ZS5pbmRleE9mKCdmaWx0ZXIoJykgPiAtMSkge1xuICAgIHJldHVybiBwcmVmaXhlcy5tYXAoZnVuY3Rpb24gKHByZWZpeCkge1xuICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoL2ZpbHRlclxcKC9nLCBwcmVmaXggKyAnZmlsdGVyKCcpO1xuICAgIH0pO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBmbGV4O1xudmFyIHZhbHVlcyA9IHtcbiAgZmxleDogdHJ1ZSxcbiAgJ2lubGluZS1mbGV4JzogdHJ1ZVxufTtcblxuZnVuY3Rpb24gZmxleChwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKHByb3BlcnR5ID09PSAnZGlzcGxheScgJiYgdmFsdWVzLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuICAgIHJldHVybiBbJy13ZWJraXQtYm94JywgJy1tb3otYm94JywgJy1tcy0nICsgdmFsdWUgKyAnYm94JywgJy13ZWJraXQtJyArIHZhbHVlLCB2YWx1ZV07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZsZXhib3hJRTtcbnZhciBhbHRlcm5hdGl2ZVZhbHVlcyA9IHtcbiAgJ3NwYWNlLWFyb3VuZCc6ICdkaXN0cmlidXRlJyxcbiAgJ3NwYWNlLWJldHdlZW4nOiAnanVzdGlmeScsXG4gICdmbGV4LXN0YXJ0JzogJ3N0YXJ0JyxcbiAgJ2ZsZXgtZW5kJzogJ2VuZCdcbn07XG52YXIgYWx0ZXJuYXRpdmVQcm9wcyA9IHtcbiAgYWxpZ25Db250ZW50OiAnbXNGbGV4TGluZVBhY2snLFxuICBhbGlnblNlbGY6ICdtc0ZsZXhJdGVtQWxpZ24nLFxuICBhbGlnbkl0ZW1zOiAnbXNGbGV4QWxpZ24nLFxuICBqdXN0aWZ5Q29udGVudDogJ21zRmxleFBhY2snLFxuICBvcmRlcjogJ21zRmxleE9yZGVyJyxcbiAgZmxleEdyb3c6ICdtc0ZsZXhQb3NpdGl2ZScsXG4gIGZsZXhTaHJpbms6ICdtc0ZsZXhOZWdhdGl2ZScsXG4gIGZsZXhCYXNpczogJ21zUHJlZmVycmVkU2l6ZSdcbn07XG5cbmZ1bmN0aW9uIGZsZXhib3hJRShwcm9wZXJ0eSwgdmFsdWUsIHN0eWxlKSB7XG4gIGlmIChhbHRlcm5hdGl2ZVByb3BzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgIHN0eWxlW2FsdGVybmF0aXZlUHJvcHNbcHJvcGVydHldXSA9IGFsdGVybmF0aXZlVmFsdWVzW3ZhbHVlXSB8fCB2YWx1ZTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZmxleGJveE9sZDtcbnZhciBhbHRlcm5hdGl2ZVZhbHVlcyA9IHtcbiAgJ3NwYWNlLWFyb3VuZCc6ICdqdXN0aWZ5JyxcbiAgJ3NwYWNlLWJldHdlZW4nOiAnanVzdGlmeScsXG4gICdmbGV4LXN0YXJ0JzogJ3N0YXJ0JyxcbiAgJ2ZsZXgtZW5kJzogJ2VuZCcsXG4gICd3cmFwLXJldmVyc2UnOiAnbXVsdGlwbGUnLFxuICB3cmFwOiAnbXVsdGlwbGUnXG59O1xuXG52YXIgYWx0ZXJuYXRpdmVQcm9wcyA9IHtcbiAgYWxpZ25JdGVtczogJ1dlYmtpdEJveEFsaWduJyxcbiAganVzdGlmeUNvbnRlbnQ6ICdXZWJraXRCb3hQYWNrJyxcbiAgZmxleFdyYXA6ICdXZWJraXRCb3hMaW5lcydcbn07XG5cbmZ1bmN0aW9uIGZsZXhib3hPbGQocHJvcGVydHksIHZhbHVlLCBzdHlsZSkge1xuICBpZiAocHJvcGVydHkgPT09ICdmbGV4RGlyZWN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHZhbHVlLmluZGV4T2YoJ2NvbHVtbicpID4gLTEpIHtcbiAgICAgIHN0eWxlLldlYmtpdEJveE9yaWVudCA9ICd2ZXJ0aWNhbCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLldlYmtpdEJveE9yaWVudCA9ICdob3Jpem9udGFsJztcbiAgICB9XG4gICAgaWYgKHZhbHVlLmluZGV4T2YoJ3JldmVyc2UnKSA+IC0xKSB7XG4gICAgICBzdHlsZS5XZWJraXRCb3hEaXJlY3Rpb24gPSAncmV2ZXJzZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLldlYmtpdEJveERpcmVjdGlvbiA9ICdub3JtYWwnO1xuICAgIH1cbiAgfVxuICBpZiAoYWx0ZXJuYXRpdmVQcm9wcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICBzdHlsZVthbHRlcm5hdGl2ZVByb3BzW3Byb3BlcnR5XV0gPSBhbHRlcm5hdGl2ZVZhbHVlc1t2YWx1ZV0gfHwgdmFsdWU7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGdyYWRpZW50O1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZSA9IHJlcXVpcmUoJ2Nzcy1pbi1qcy11dGlscy9saWIvaXNQcmVmaXhlZFZhbHVlJyk7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUHJlZml4ZWRWYWx1ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBwcmVmaXhlcyA9IFsnLXdlYmtpdC0nLCAnLW1vei0nLCAnJ107XG5cbnZhciB2YWx1ZXMgPSAvbGluZWFyLWdyYWRpZW50fHJhZGlhbC1ncmFkaWVudHxyZXBlYXRpbmctbGluZWFyLWdyYWRpZW50fHJlcGVhdGluZy1yYWRpYWwtZ3JhZGllbnQvO1xuXG5mdW5jdGlvbiBncmFkaWVudChwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgISgwLCBfaXNQcmVmaXhlZFZhbHVlMi5kZWZhdWx0KSh2YWx1ZSkgJiYgdmFsdWVzLnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIHByZWZpeGVzLm1hcChmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICByZXR1cm4gcHJlZml4ICsgdmFsdWU7XG4gICAgfSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGltYWdlU2V0O1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZSA9IHJlcXVpcmUoJ2Nzcy1pbi1qcy11dGlscy9saWIvaXNQcmVmaXhlZFZhbHVlJyk7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUHJlZml4ZWRWYWx1ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8vIGh0dHA6Ly9jYW5pdXNlLmNvbS8jZmVhdD1jc3MtaW1hZ2Utc2V0XG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJyddO1xuZnVuY3Rpb24gaW1hZ2VTZXQocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICEoMCwgX2lzUHJlZml4ZWRWYWx1ZTIuZGVmYXVsdCkodmFsdWUpICYmIHZhbHVlLmluZGV4T2YoJ2ltYWdlLXNldCgnKSA+IC0xKSB7XG4gICAgcmV0dXJuIHByZWZpeGVzLm1hcChmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvaW1hZ2Utc2V0XFwoL2csIHByZWZpeCArICdpbWFnZS1zZXQoJyk7XG4gICAgfSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHBvc2l0aW9uO1xuZnVuY3Rpb24gcG9zaXRpb24ocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChwcm9wZXJ0eSA9PT0gJ3Bvc2l0aW9uJyAmJiB2YWx1ZSA9PT0gJ3N0aWNreScpIHtcbiAgICByZXR1cm4gWyctd2Via2l0LXN0aWNreScsICdzdGlja3knXTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gc2l6aW5nO1xudmFyIHByZWZpeGVzID0gWyctd2Via2l0LScsICctbW96LScsICcnXTtcblxudmFyIHByb3BlcnRpZXMgPSB7XG4gIG1heEhlaWdodDogdHJ1ZSxcbiAgbWF4V2lkdGg6IHRydWUsXG4gIHdpZHRoOiB0cnVlLFxuICBoZWlnaHQ6IHRydWUsXG4gIGNvbHVtbldpZHRoOiB0cnVlLFxuICBtaW5XaWR0aDogdHJ1ZSxcbiAgbWluSGVpZ2h0OiB0cnVlXG59O1xudmFyIHZhbHVlcyA9IHtcbiAgJ21pbi1jb250ZW50JzogdHJ1ZSxcbiAgJ21heC1jb250ZW50JzogdHJ1ZSxcbiAgJ2ZpbGwtYXZhaWxhYmxlJzogdHJ1ZSxcbiAgJ2ZpdC1jb250ZW50JzogdHJ1ZSxcbiAgJ2NvbnRhaW4tZmxvYXRzJzogdHJ1ZVxufTtcblxuZnVuY3Rpb24gc2l6aW5nKHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgJiYgdmFsdWVzLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuICAgIHJldHVybiBwcmVmaXhlcy5tYXAoZnVuY3Rpb24gKHByZWZpeCkge1xuICAgICAgcmV0dXJuIHByZWZpeCArIHZhbHVlO1xuICAgIH0pO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSB0cmFuc2l0aW9uO1xuXG52YXIgX2h5cGhlbmF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnY3NzLWluLWpzLXV0aWxzL2xpYi9oeXBoZW5hdGVQcm9wZXJ0eScpO1xuXG52YXIgX2h5cGhlbmF0ZVByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2h5cGhlbmF0ZVByb3BlcnR5KTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUgPSByZXF1aXJlKCdjc3MtaW4tanMtdXRpbHMvbGliL2lzUHJlZml4ZWRWYWx1ZScpO1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1ByZWZpeGVkVmFsdWUpO1xuXG52YXIgX2NhcGl0YWxpemVTdHJpbmcgPSByZXF1aXJlKCcuLi8uLi91dGlscy9jYXBpdGFsaXplU3RyaW5nJyk7XG5cbnZhciBfY2FwaXRhbGl6ZVN0cmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYXBpdGFsaXplU3RyaW5nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHByb3BlcnRpZXMgPSB7XG4gIHRyYW5zaXRpb246IHRydWUsXG4gIHRyYW5zaXRpb25Qcm9wZXJ0eTogdHJ1ZSxcbiAgV2Via2l0VHJhbnNpdGlvbjogdHJ1ZSxcbiAgV2Via2l0VHJhbnNpdGlvblByb3BlcnR5OiB0cnVlLFxuICBNb3pUcmFuc2l0aW9uOiB0cnVlLFxuICBNb3pUcmFuc2l0aW9uUHJvcGVydHk6IHRydWVcbn07XG5cblxudmFyIHByZWZpeE1hcHBpbmcgPSB7XG4gIFdlYmtpdDogJy13ZWJraXQtJyxcbiAgTW96OiAnLW1vei0nLFxuICBtczogJy1tcy0nXG59O1xuXG5mdW5jdGlvbiBwcmVmaXhWYWx1ZSh2YWx1ZSwgcHJvcGVydHlQcmVmaXhNYXApIHtcbiAgaWYgKCgwLCBfaXNQcmVmaXhlZFZhbHVlMi5kZWZhdWx0KSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvLyBvbmx5IHNwbGl0IG11bHRpIHZhbHVlcywgbm90IGN1YmljIGJlemllcnNcbiAgdmFyIG11bHRpcGxlVmFsdWVzID0gdmFsdWUuc3BsaXQoLywoPyFbXigpXSooPzpcXChbXigpXSpcXCkpP1xcKSkvZyk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG11bHRpcGxlVmFsdWVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHNpbmdsZVZhbHVlID0gbXVsdGlwbGVWYWx1ZXNbaV07XG4gICAgdmFyIHZhbHVlcyA9IFtzaW5nbGVWYWx1ZV07XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcHJvcGVydHlQcmVmaXhNYXApIHtcbiAgICAgIHZhciBkYXNoQ2FzZVByb3BlcnR5ID0gKDAsIF9oeXBoZW5hdGVQcm9wZXJ0eTIuZGVmYXVsdCkocHJvcGVydHkpO1xuXG4gICAgICBpZiAoc2luZ2xlVmFsdWUuaW5kZXhPZihkYXNoQ2FzZVByb3BlcnR5KSA+IC0xICYmIGRhc2hDYXNlUHJvcGVydHkgIT09ICdvcmRlcicpIHtcbiAgICAgICAgdmFyIHByZWZpeGVzID0gcHJvcGVydHlQcmVmaXhNYXBbcHJvcGVydHldO1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgcExlbiA9IHByZWZpeGVzLmxlbmd0aDsgaiA8IHBMZW47ICsraikge1xuICAgICAgICAgIC8vIGpvaW4gYWxsIHByZWZpeGVzIGFuZCBjcmVhdGUgYSBuZXcgdmFsdWVcbiAgICAgICAgICB2YWx1ZXMudW5zaGlmdChzaW5nbGVWYWx1ZS5yZXBsYWNlKGRhc2hDYXNlUHJvcGVydHksIHByZWZpeE1hcHBpbmdbcHJlZml4ZXNbal1dICsgZGFzaENhc2VQcm9wZXJ0eSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbXVsdGlwbGVWYWx1ZXNbaV0gPSB2YWx1ZXMuam9pbignLCcpO1xuICB9XG5cbiAgcmV0dXJuIG11bHRpcGxlVmFsdWVzLmpvaW4oJywnKTtcbn1cblxuZnVuY3Rpb24gdHJhbnNpdGlvbihwcm9wZXJ0eSwgdmFsdWUsIHN0eWxlLCBwcm9wZXJ0eVByZWZpeE1hcCkge1xuICAvLyBhbHNvIGNoZWNrIGZvciBhbHJlYWR5IHByZWZpeGVkIHRyYW5zaXRpb25zXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgdmFyIG91dHB1dFZhbHVlID0gcHJlZml4VmFsdWUodmFsdWUsIHByb3BlcnR5UHJlZml4TWFwKTtcbiAgICAvLyBpZiB0aGUgcHJvcGVydHkgaXMgYWxyZWFkeSBwcmVmaXhlZFxuICAgIHZhciB3ZWJraXRPdXRwdXQgPSBvdXRwdXRWYWx1ZS5zcGxpdCgvLCg/IVteKCldKig/OlxcKFteKCldKlxcKSk/XFwpKS9nKS5maWx0ZXIoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuICEvLW1vei18LW1zLS8udGVzdCh2YWwpO1xuICAgIH0pLmpvaW4oJywnKTtcblxuICAgIGlmIChwcm9wZXJ0eS5pbmRleE9mKCdXZWJraXQnKSA+IC0xKSB7XG4gICAgICByZXR1cm4gd2Via2l0T3V0cHV0O1xuICAgIH1cblxuICAgIHZhciBtb3pPdXRwdXQgPSBvdXRwdXRWYWx1ZS5zcGxpdCgvLCg/IVteKCldKig/OlxcKFteKCldKlxcKSk/XFwpKS9nKS5maWx0ZXIoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgcmV0dXJuICEvLXdlYmtpdC18LW1zLS8udGVzdCh2YWwpO1xuICAgIH0pLmpvaW4oJywnKTtcblxuICAgIGlmIChwcm9wZXJ0eS5pbmRleE9mKCdNb3onKSA+IC0xKSB7XG4gICAgICByZXR1cm4gbW96T3V0cHV0O1xuICAgIH1cblxuICAgIHN0eWxlWydXZWJraXQnICsgKDAsIF9jYXBpdGFsaXplU3RyaW5nMi5kZWZhdWx0KShwcm9wZXJ0eSldID0gd2Via2l0T3V0cHV0O1xuICAgIHN0eWxlWydNb3onICsgKDAsIF9jYXBpdGFsaXplU3RyaW5nMi5kZWZhdWx0KShwcm9wZXJ0eSldID0gbW96T3V0cHV0O1xuICAgIHJldHVybiBvdXRwdXRWYWx1ZTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBhZGROZXdWYWx1ZXNPbmx5O1xuZnVuY3Rpb24gYWRkSWZOZXcobGlzdCwgdmFsdWUpIHtcbiAgaWYgKGxpc3QuaW5kZXhPZih2YWx1ZSkgPT09IC0xKSB7XG4gICAgbGlzdC5wdXNoKHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGROZXdWYWx1ZXNPbmx5KGxpc3QsIHZhbHVlcykge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZXMpKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgYWRkSWZOZXcobGlzdCwgdmFsdWVzW2ldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYWRkSWZOZXcobGlzdCwgdmFsdWVzKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNhcGl0YWxpemVTdHJpbmc7XG5mdW5jdGlvbiBjYXBpdGFsaXplU3RyaW5nKHN0cikge1xuICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGlzT2JqZWN0O1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KHZhbHVlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gcHJlZml4UHJvcGVydHk7XG5cbnZhciBfY2FwaXRhbGl6ZVN0cmluZyA9IHJlcXVpcmUoJy4vY2FwaXRhbGl6ZVN0cmluZycpO1xuXG52YXIgX2NhcGl0YWxpemVTdHJpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2FwaXRhbGl6ZVN0cmluZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHByZWZpeFByb3BlcnR5KHByZWZpeFByb3BlcnRpZXMsIHByb3BlcnR5LCBzdHlsZSkge1xuICBpZiAocHJlZml4UHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICB2YXIgcmVxdWlyZWRQcmVmaXhlcyA9IHByZWZpeFByb3BlcnRpZXNbcHJvcGVydHldO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXF1aXJlZFByZWZpeGVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBzdHlsZVtyZXF1aXJlZFByZWZpeGVzW2ldICsgKDAsIF9jYXBpdGFsaXplU3RyaW5nMi5kZWZhdWx0KShwcm9wZXJ0eSldID0gc3R5bGVbcHJvcGVydHldO1xuICAgIH1cbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBwcmVmaXhWYWx1ZTtcbmZ1bmN0aW9uIHByZWZpeFZhbHVlKHBsdWdpbnMsIHByb3BlcnR5LCB2YWx1ZSwgc3R5bGUsIG1ldGFEYXRhKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwbHVnaW5zLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgdmFyIHByb2Nlc3NlZFZhbHVlID0gcGx1Z2luc1tpXShwcm9wZXJ0eSwgdmFsdWUsIHN0eWxlLCBtZXRhRGF0YSk7XG5cbiAgICAvLyB3ZSBjYW4gc3RvcCBwcm9jZXNzaW5nIGlmIGEgdmFsdWUgaXMgcmV0dXJuZWRcbiAgICAvLyBhcyBhbGwgcGx1Z2luIGNyaXRlcmlhIGFyZSB1bmlxdWVcbiAgICBpZiAocHJvY2Vzc2VkVmFsdWUpIHtcbiAgICAgIHJldHVybiBwcm9jZXNzZWRWYWx1ZTtcbiAgICB9XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGhhc2goc3RyKSB7XG4gIHZhciBoYXNoID0gNTM4MSxcbiAgICAgIGkgICAgPSBzdHIubGVuZ3RoO1xuXG4gIHdoaWxlKGkpIHtcbiAgICBoYXNoID0gKGhhc2ggKiAzMykgXiBzdHIuY2hhckNvZGVBdCgtLWkpO1xuICB9XG5cbiAgLyogSmF2YVNjcmlwdCBkb2VzIGJpdHdpc2Ugb3BlcmF0aW9ucyAobGlrZSBYT1IsIGFib3ZlKSBvbiAzMi1iaXQgc2lnbmVkXG4gICAqIGludGVnZXJzLiBTaW5jZSB3ZSB3YW50IHRoZSByZXN1bHRzIHRvIGJlIGFsd2F5cyBwb3NpdGl2ZSwgY29udmVydCB0aGVcbiAgICogc2lnbmVkIGludCB0byBhbiB1bnNpZ25lZCBieSBkb2luZyBhbiB1bnNpZ25lZCBiaXRzaGlmdC4gKi9cbiAgcmV0dXJuIGhhc2ggPj4+IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgY3NzLCBTdHlsZVNoZWV0IH0gZnJvbSAnYXBocm9kaXRlL25vLWltcG9ydGFudCc7XG5cbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi90aGVtZSc7XG5pbXBvcnQgeyBkZWVwTWVyZ2UgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgSWNvbiBmcm9tICcuL0ljb24nO1xuXG5mdW5jdGlvbiBBcnJvdyAoe1xuXHRkaXJlY3Rpb24sXG5cdGljb24sXG5cdG9uQ2xpY2ssXG5cdHNpemUsXG5cdC4uLnByb3BzLFxufSxcbntcblx0dGhlbWUsXG59KSB7XG5cdGNvbnN0IGNsYXNzZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZShkZWVwTWVyZ2UoZGVmYXVsdFN0eWxlcywgdGhlbWUpKTtcblxuXHRyZXR1cm4gKFxuXHRcdDxidXR0b25cblx0XHRcdHR5cGU9XCJidXR0b25cIlxuXHRcdFx0Y2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5hcnJvdywgY2xhc3Nlc1snYXJyb3dfX2RpcmVjdGlvbl9fJyArIGRpcmVjdGlvbl0sIHNpemUgJiYgY2xhc3Nlc1snYXJyb3dfX3NpemVfXycgKyBzaXplXSl9XG5cdFx0XHRvbkNsaWNrPXtvbkNsaWNrfVxuXHRcdFx0b25Ub3VjaEVuZD17b25DbGlja31cblx0XHRcdHsuLi5wcm9wc31cblx0XHQ+XG5cdFx0XHQ8SWNvbiBmaWxsPXshIXRoZW1lLmFycm93ICYmIHRoZW1lLmFycm93LmZpbGwgfHwgZGVmYXVsdHMuYXJyb3cuZmlsbH0gdHlwZT17aWNvbn0gLz5cblx0XHQ8L2J1dHRvbj5cblx0KTtcbn07XG5cbkFycm93LnByb3BUeXBlcyA9IHtcblx0ZGlyZWN0aW9uOiBQcm9wVHlwZXMub25lT2YoWydsZWZ0JywgJ3JpZ2h0J10pLFxuXHRpY29uOiBQcm9wVHlwZXMuc3RyaW5nLFxuXHRvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRzaXplOiBQcm9wVHlwZXMub25lT2YoWydtZWRpdW0nLCAnc21hbGwnXSkuaXNSZXF1aXJlZCxcbn07XG5BcnJvdy5kZWZhdWx0UHJvcHMgPSB7XG5cdHNpemU6ICdtZWRpdW0nLFxufTtcbkFycm93LmNvbnRleHRUeXBlcyA9IHtcblx0dGhlbWU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG5cbmNvbnN0IGRlZmF1bHRTdHlsZXMgPSB7XG5cdGFycm93OiB7XG5cdFx0YmFja2dyb3VuZDogJ25vbmUnLFxuXHRcdGJvcmRlcjogJ25vbmUnLFxuXHRcdGJvcmRlclJhZGl1czogNCxcblx0XHRjdXJzb3I6ICdwb2ludGVyJyxcblx0XHRvdXRsaW5lOiAnbm9uZScsXG5cdFx0cGFkZGluZzogMTAsIC8vIGluY3JlYXNlIGhpdCBhcmVhXG5cdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0dG9wOiAnNTAlJyxcblxuXHRcdC8vIGRpc2FibGUgdXNlciBzZWxlY3Rcblx0XHRXZWJraXRUb3VjaENhbGxvdXQ6ICdub25lJyxcblx0XHR1c2VyU2VsZWN0OiAnbm9uZScsXG5cdH0sXG5cblx0Ly8gc2l6ZWVzXG5cdGFycm93X19zaXplX19tZWRpdW06IHtcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLmFycm93LmhlaWdodCxcblx0XHRtYXJnaW5Ub3A6IGRlZmF1bHRzLmFycm93LmhlaWdodCAvIC0yLFxuXHRcdHdpZHRoOiA0MCxcblxuXHRcdCdAbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpJzoge1xuXHRcdFx0d2lkdGg6IDcwLFxuXHRcdH0sXG5cdH0sXG5cdGFycm93X19zaXplX19zbWFsbDoge1xuXHRcdGhlaWdodDogZGVmYXVsdHMudGh1bWJuYWlsLnNpemUsXG5cdFx0bWFyZ2luVG9wOiBkZWZhdWx0cy50aHVtYm5haWwuc2l6ZSAvIC0yLFxuXHRcdHdpZHRoOiAzMCxcblxuXHRcdCdAbWVkaWEgKG1pbi13aWR0aDogNTAwcHgpJzoge1xuXHRcdFx0d2lkdGg6IDQwLFxuXHRcdH0sXG5cdH0sXG5cblx0Ly8gZGlyZWN0aW9uXG5cdGFycm93X19kaXJlY3Rpb25fX3JpZ2h0OiB7XG5cdFx0cmlnaHQ6IGRlZmF1bHRzLmNvbnRhaW5lci5ndXR0ZXIuaG9yaXpvbnRhbCxcblx0fSxcblx0YXJyb3dfX2RpcmVjdGlvbl9fbGVmdDoge1xuXHRcdGxlZnQ6IGRlZmF1bHRzLmNvbnRhaW5lci5ndXR0ZXIuaG9yaXpvbnRhbCxcblx0fSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyb3c7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IGNzcywgU3R5bGVTaGVldCB9IGZyb20gJ2FwaHJvZGl0ZS9uby1pbXBvcnRhbnQnO1xuXG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi4vdGhlbWUnO1xuaW1wb3J0IHsgZGVlcE1lcmdlIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5mdW5jdGlvbiBDb250YWluZXIgKHsgLi4ucHJvcHMgfSwgeyB0aGVtZSB9KSB7XG5cdGNvbnN0IGNsYXNzZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZShkZWVwTWVyZ2UoZGVmYXVsdFN0eWxlcywgdGhlbWUpKTtcblxuXHRyZXR1cm4gKFxuXHRcdDxkaXZcblx0XHRcdGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuY29udGFpbmVyKX1cblx0XHRcdHsuLi5wcm9wc31cblx0XHQvPlxuXHQpO1xufTtcblxuQ29udGFpbmVyLmNvbnRleHRUeXBlcyA9IHtcblx0dGhlbWU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG5cbmNvbnN0IGRlZmF1bHRTdHlsZXMgPSB7XG5cdGNvbnRhaW5lcjoge1xuXHRcdGFsaWduSXRlbXM6ICdjZW50ZXInLFxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuY29udGFpbmVyLmJhY2tncm91bmQsXG5cdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG5cdFx0ZGlzcGxheTogJ2ZsZXgnLFxuXHRcdGhlaWdodDogJzEwMCUnLFxuXHRcdGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcblx0XHRsZWZ0OiAwLFxuXHRcdHBhZGRpbmdCb3R0b206IGRlZmF1bHRzLmNvbnRhaW5lci5ndXR0ZXIudmVydGljYWwsXG5cdFx0cGFkZGluZ0xlZnQ6IGRlZmF1bHRzLmNvbnRhaW5lci5ndXR0ZXIuaG9yaXpvbnRhbCxcblx0XHRwYWRkaW5nUmlnaHQ6IGRlZmF1bHRzLmNvbnRhaW5lci5ndXR0ZXIuaG9yaXpvbnRhbCxcblx0XHRwYWRkaW5nVG9wOiBkZWZhdWx0cy5jb250YWluZXIuZ3V0dGVyLnZlcnRpY2FsLFxuXHRcdHBvc2l0aW9uOiAnZml4ZWQnLFxuXHRcdHRvcDogMCxcblx0XHR3aWR0aDogJzEwMCUnLFxuXHRcdHpJbmRleDogZGVmYXVsdHMuY29udGFpbmVyLnpJbmRleCxcblx0fSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGFpbmVyO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBjc3MsIFN0eWxlU2hlZXQgfSBmcm9tICdhcGhyb2RpdGUvbm8taW1wb3J0YW50JztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi90aGVtZSc7XG5pbXBvcnQgeyBkZWVwTWVyZ2UgfSBmcm9tICcuLi91dGlscyc7XG5cbmZ1bmN0aW9uIEZvb3RlciAoe1xuXHRjYXB0aW9uLFxuXHRjb3VudEN1cnJlbnQsXG5cdGNvdW50U2VwYXJhdG9yLFxuXHRjb3VudFRvdGFsLFxuXHRzaG93Q291bnQsXG5cdC4uLnByb3BzLFxufSwge1xuXHR0aGVtZSxcbn0pIHtcblx0aWYgKCFjYXB0aW9uICYmICFzaG93Q291bnQpIHJldHVybiBudWxsO1xuXG5cdGNvbnN0IGNsYXNzZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZShkZWVwTWVyZ2UoZGVmYXVsdFN0eWxlcywgdGhlbWUpKTtcblxuXHRjb25zdCBpbWFnZUNvdW50ID0gc2hvd0NvdW50ID8gKFxuXHRcdDxkaXYgY2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5mb290ZXJDb3VudCl9PlxuXHRcdFx0e2NvdW50Q3VycmVudH1cblx0XHRcdHtjb3VudFNlcGFyYXRvcn1cblx0XHRcdHtjb3VudFRvdGFsfVxuXHRcdDwvZGl2Pilcblx0XHQ6IDxzcGFuIC8+O1xuXG5cdHJldHVybiAoXG5cdFx0PGRpdiBjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmZvb3Rlcil9IHsuLi5wcm9wc30+XG5cdFx0XHR7Y2FwdGlvbiA/IChcblx0XHRcdFx0PGZpZ2NhcHRpb24gY2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5mb290ZXJDYXB0aW9uKX0+XG5cdFx0XHRcdFx0e2NhcHRpb259XG5cdFx0XHRcdDwvZmlnY2FwdGlvbj5cblx0XHRcdCkgOiA8c3BhbiAvPn1cblx0XHRcdHtpbWFnZUNvdW50fVxuXHRcdDwvZGl2PlxuXHQpO1xufTtcblxuRm9vdGVyLnByb3BUeXBlcyA9IHtcblx0Y2FwdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmVsZW1lbnRdKSxcblx0Y291bnRDdXJyZW50OiBQcm9wVHlwZXMubnVtYmVyLFxuXHRjb3VudFNlcGFyYXRvcjogUHJvcFR5cGVzLnN0cmluZyxcblx0Y291bnRUb3RhbDogUHJvcFR5cGVzLm51bWJlcixcblx0c2hvd0NvdW50OiBQcm9wVHlwZXMuYm9vbCxcbn07XG5Gb290ZXIuY29udGV4dFR5cGVzID0ge1xuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuY29uc3QgZGVmYXVsdFN0eWxlcyA9IHtcblx0Zm9vdGVyOiB7XG5cdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG5cdFx0Y29sb3I6IGRlZmF1bHRzLmZvb3Rlci5jb2xvcixcblx0XHRjdXJzb3I6ICdhdXRvJyxcblx0XHRkaXNwbGF5OiAnZmxleCcsXG5cdFx0anVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcblx0XHRsZWZ0OiAwLFxuXHRcdGxpbmVIZWlnaHQ6IDEuMyxcblx0XHRwYWRkaW5nQm90dG9tOiBkZWZhdWx0cy5mb290ZXIuZ3V0dGVyLnZlcnRpY2FsLFxuXHRcdHBhZGRpbmdMZWZ0OiBkZWZhdWx0cy5mb290ZXIuZ3V0dGVyLmhvcml6b250YWwsXG5cdFx0cGFkZGluZ1JpZ2h0OiBkZWZhdWx0cy5mb290ZXIuZ3V0dGVyLmhvcml6b250YWwsXG5cdFx0cGFkZGluZ1RvcDogZGVmYXVsdHMuZm9vdGVyLmd1dHRlci52ZXJ0aWNhbCxcblx0fSxcblx0Zm9vdGVyQ291bnQ6IHtcblx0XHRjb2xvcjogZGVmYXVsdHMuZm9vdGVyLmNvdW50LmNvbG9yLFxuXHRcdGZvbnRTaXplOiBkZWZhdWx0cy5mb290ZXIuY291bnQuZm9udFNpemUsXG5cdFx0cGFkZGluZ0xlZnQ6ICcxZW0nLCAvLyBhZGQgYSBzbWFsbCBndXR0ZXIgZm9yIHRoZSBjYXB0aW9uXG5cdH0sXG5cdGZvb3RlckNhcHRpb246IHtcblx0XHRmbGV4OiAnMSAxIDAnLFxuXHR9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb290ZXI7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IGNzcywgU3R5bGVTaGVldCB9IGZyb20gJ2FwaHJvZGl0ZS9uby1pbXBvcnRhbnQnO1xuXG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi4vdGhlbWUnO1xuaW1wb3J0IHsgZGVlcE1lcmdlIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEljb24gZnJvbSAnLi9JY29uJztcblxuZnVuY3Rpb24gSGVhZGVyICh7XG5cdGN1c3RvbUNvbnRyb2xzLFxuXHRvbkNsb3NlLFxuXHRvblJvdGF0ZSxcblx0c2hvd0Nsb3NlQnV0dG9uLFxuXHRzaG93Um90YXRlQnV0dG9uLFxuXHRjbG9zZUJ1dHRvblRpdGxlLFxuXHRyb3RhdGVCdXR0b25UaXRsZSxcblx0Li4ucHJvcHMsXG59LCB7XG5cdHRoZW1lLFxufSkge1xuXHRjb25zdCBjbGFzc2VzID0gU3R5bGVTaGVldC5jcmVhdGUoZGVlcE1lcmdlKGRlZmF1bHRTdHlsZXMsIHRoZW1lKSk7XG5cblx0cmV0dXJuIChcblx0XHQ8ZGl2IGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuaGVhZGVyKX0gey4uLnByb3BzfT5cblx0XHRcdHshIXNob3dSb3RhdGVCdXR0b24gJiYgKFxuXHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0dGl0bGU9e3JvdGF0ZUJ1dHRvblRpdGxlfVxuXHRcdFx0XHRcdGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMucm90YXRlKX1cblx0XHRcdFx0XHRvbkNsaWNrPXtvblJvdGF0ZX1cblx0XHRcdFx0PlxuXHRcdFx0XHRcdDxJY29uIGZpbGw9eyEhdGhlbWUucm90YXRlICYmIHRoZW1lLnJvdGF0ZS5maWxsIHx8IGRlZmF1bHRzLnJvdGF0ZS5maWxsfSB0eXBlPVwicm90YXRlXCIgLz5cblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHQpfVxuXHRcdFx0e2N1c3RvbUNvbnRyb2xzID8gY3VzdG9tQ29udHJvbHMgOiA8c3BhbiAvPn1cblx0XHRcdHshIXNob3dDbG9zZUJ1dHRvbiAmJiAoXG5cdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHR0aXRsZT17Y2xvc2VCdXR0b25UaXRsZX1cblx0XHRcdFx0XHRjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmNsb3NlKX1cblx0XHRcdFx0XHRvbkNsaWNrPXtvbkNsb3NlfVxuXHRcdFx0XHQ+XG5cdFx0XHRcdFx0PEljb24gZmlsbD17ISF0aGVtZS5jbG9zZSAmJiB0aGVtZS5jbG9zZS5maWxsIHx8IGRlZmF1bHRzLmNsb3NlLmZpbGx9IHR5cGU9XCJjbG9zZVwiIC8+XG5cdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0KX1cblx0XHQ8L2Rpdj5cblx0KTtcbn07XG5cbkhlYWRlci5wcm9wVHlwZXMgPSB7XG5cdGN1c3RvbUNvbnRyb2xzOiBQcm9wVHlwZXMuYXJyYXksXG5cdG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdHNob3dDbG9zZUJ1dHRvbjogUHJvcFR5cGVzLmJvb2wsXG59O1xuSGVhZGVyLmNvbnRleHRUeXBlcyA9IHtcblx0dGhlbWU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG5cbmNvbnN0IGRlZmF1bHRTdHlsZXMgPSB7XG5cdGhlYWRlcjoge1xuXHRcdGRpc3BsYXk6ICdmbGV4Jyxcblx0XHRqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuXHRcdGhlaWdodDogZGVmYXVsdHMuaGVhZGVyLmhlaWdodCxcblx0fSxcblx0Y2xvc2U6IHtcblx0XHRiYWNrZ3JvdW5kOiAnbm9uZScsXG5cdFx0Ym9yZGVyOiAnbm9uZScsXG5cdFx0Y3Vyc29yOiAncG9pbnRlcicsXG5cdFx0b3V0bGluZTogJ25vbmUnLFxuXHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuXHRcdHRvcDogMCxcblx0XHR2ZXJ0aWNhbEFsaWduOiAnYm90dG9tJyxcblxuXHRcdC8vIGluY3JlYXNlIGhpdCBhcmVhXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy5jbG9zZS5oZWlnaHQgKyAyMCxcblx0XHRtYXJnaW5SaWdodDogLTEwLFxuXHRcdHBhZGRpbmc6IDEwLFxuXHRcdHdpZHRoOiBkZWZhdWx0cy5jbG9zZS53aWR0aCArIDIwLFxuXHR9LFxuXHRyb3RhdGU6IHtcblx0XHRiYWNrZ3JvdW5kOiAnbm9uZScsXG5cdFx0Ym9yZGVyOiAnbm9uZScsXG5cdFx0Y3Vyc29yOiAncG9pbnRlcicsXG5cdFx0b3V0bGluZTogJ25vbmUnLFxuXHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuXHRcdHRvcDogMCxcblx0XHR2ZXJ0aWNhbEFsaWduOiAnYm90dG9tJyxcblxuXHRcdC8vIGluY3JlYXNlIGhpdCBhcmVhXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy5jbG9zZS5oZWlnaHQgKyAyMCxcblx0XHRtYXJnaW5MZWZ0OiAtMTAsXG5cdFx0cGFkZGluZzogMTAsXG5cdFx0d2lkdGg6IGRlZmF1bHRzLmNsb3NlLndpZHRoICsgMjAsXG5cdH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlYWRlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGljb25zIGZyb20gJy4uL2ljb25zJztcblxuY29uc3QgSWNvbiA9ICh7IGZpbGwsIHR5cGUsIC4uLnByb3BzIH0pID0+IHtcblx0Y29uc3QgaWNvbiA9IGljb25zW3R5cGVdO1xuXG5cdHJldHVybiAoXG5cdFx0PHNwYW5cblx0XHRcdGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogaWNvbihmaWxsKSB9fVxuXHRcdFx0ey4uLnByb3BzfVxuXHRcdC8+XG5cdCk7XG59O1xuXG5JY29uLnByb3BUeXBlcyA9IHtcblx0ZmlsbDogUHJvcFR5cGVzLnN0cmluZyxcblx0dHlwZTogUHJvcFR5cGVzLm9uZU9mKE9iamVjdC5rZXlzKGljb25zKSksXG59O1xuSWNvbi5kZWZhdWx0UHJvcHMgPSB7XG5cdGZpbGw6ICd3aGl0ZScsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBJY29uO1xuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBjc3MsIFN0eWxlU2hlZXQgfSBmcm9tICdhcGhyb2RpdGUvbm8taW1wb3J0YW50JztcblxuaW1wb3J0IFRodW1ibmFpbCBmcm9tICcuL1RodW1ibmFpbCc7XG5pbXBvcnQgQXJyb3cgZnJvbSAnLi9BcnJvdyc7XG5pbXBvcnQgdGhlbWUgZnJvbSAnLi4vdGhlbWUnO1xuXG5jb25zdCBjbGFzc2VzID0gU3R5bGVTaGVldC5jcmVhdGUoe1xuXHRwYWdpbmF0ZWRUaHVtYm5haWxzOiB7XG5cdFx0Ym90dG9tOiB0aGVtZS5jb250YWluZXIuZ3V0dGVyLnZlcnRpY2FsLFxuXHRcdGhlaWdodDogdGhlbWUudGh1bWJuYWlsLnNpemUsXG5cdFx0cGFkZGluZzogJzAgNTBweCcsXG5cdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0dGV4dEFsaWduOiAnY2VudGVyJyxcblx0XHR3aGl0ZVNwYWNlOiAnbm93cmFwJyxcblx0fSxcbn0pO1xuXG5jb25zdCBhcnJvd1N0eWxlcyA9IHtcblx0aGVpZ2h0OiB0aGVtZS50aHVtYm5haWwuc2l6ZSArICh0aGVtZS50aHVtYm5haWwuZ3V0dGVyICogMiksXG5cdHdpZHRoOiA0MCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhZ2luYXRlZFRodW1ibmFpbHMgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvciAocHJvcHMpIHtcblx0XHRzdXBlcihwcm9wcyk7XG5cblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0aGFzQ3VzdG9tUGFnZTogZmFsc2UsXG5cdFx0fTtcblxuXHRcdHRoaXMuZ290b1ByZXYgPSB0aGlzLmdvdG9QcmV2LmJpbmQodGhpcyk7XG5cdFx0dGhpcy5nb3RvTmV4dCA9IHRoaXMuZ290b05leHQuYmluZCh0aGlzKTtcblx0fVxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcblx0XHQvLyBDb21wb25lbnQgc2hvdWxkIGJlIGNvbnRyb2xsZWQsIGZsdXNoIHN0YXRlIHdoZW4gY3VycmVudEltYWdlIGNoYW5nZXNcblx0XHRpZiAobmV4dFByb3BzLmN1cnJlbnRJbWFnZSAhPT0gdGhpcy5wcm9wcy5jdXJyZW50SW1hZ2UpIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRoYXNDdXN0b21QYWdlOiBmYWxzZSxcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBNRVRIT0RTXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdGdldEZpcnN0ICgpIHtcblx0XHRjb25zdCB7IGN1cnJlbnRJbWFnZSwgb2Zmc2V0IH0gPSB0aGlzLnByb3BzO1xuXHRcdGlmICh0aGlzLnN0YXRlLmhhc0N1c3RvbVBhZ2UpIHtcblx0XHRcdHJldHVybiB0aGlzLmNsYW1wRmlyc3QodGhpcy5zdGF0ZS5maXJzdCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmNsYW1wRmlyc3QoY3VycmVudEltYWdlIC0gb2Zmc2V0KTtcblx0fVxuXHRzZXRGaXJzdCAoZXZlbnQsIG5ld0ZpcnN0KSB7XG5cdFx0Y29uc3QgeyBmaXJzdCB9ID0gdGhpcy5zdGF0ZTtcblxuXHRcdGlmIChldmVudCkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdH1cblxuXHRcdGlmIChmaXJzdCA9PT0gbmV3Rmlyc3QpIHJldHVybjtcblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0aGFzQ3VzdG9tUGFnZTogdHJ1ZSxcblx0XHRcdGZpcnN0OiBuZXdGaXJzdCxcblx0XHR9KTtcblx0fVxuXHRnb3RvUHJldiAoZXZlbnQpIHtcblx0XHR0aGlzLnNldEZpcnN0KGV2ZW50LCB0aGlzLmdldEZpcnN0KCkgLSB0aGlzLnByb3BzLm9mZnNldCk7XG5cdH1cblx0Z290b05leHQgKGV2ZW50KSB7XG5cdFx0dGhpcy5zZXRGaXJzdChldmVudCwgdGhpcy5nZXRGaXJzdCgpICsgdGhpcy5wcm9wcy5vZmZzZXQpO1xuXHR9XG5cdGNsYW1wRmlyc3QgKHZhbHVlKSB7XG5cdFx0Y29uc3QgeyBpbWFnZXMsIG9mZnNldCB9ID0gdGhpcy5wcm9wcztcblxuXHRcdGNvbnN0IHRvdGFsQ291bnQgPSAyICogb2Zmc2V0ICsgMTsgLy8gc2hvdyAkb2Zmc2V0IGV4dHJhIHRodW1ibmFpbHMgb24gZWFjaCBzaWRlXG5cblx0XHRpZiAodmFsdWUgPCAwKSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9IGVsc2UgaWYgKHZhbHVlICsgdG90YWxDb3VudCA+IGltYWdlcy5sZW5ndGgpIHsgLy8gVG9vIGZhclxuXHRcdFx0cmV0dXJuIGltYWdlcy5sZW5ndGggLSB0b3RhbENvdW50O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fVxuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIFJFTkRFUkVSU1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRyZW5kZXJBcnJvd1ByZXYgKCkge1xuXHRcdGlmICh0aGlzLmdldEZpcnN0KCkgPD0gMCkgcmV0dXJuIG51bGw7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PEFycm93XG5cdFx0XHRcdGRpcmVjdGlvbj1cImxlZnRcIlxuXHRcdFx0XHRzaXplPVwic21hbGxcIlxuXHRcdFx0XHRpY29uPVwiYXJyb3dMZWZ0XCJcblx0XHRcdFx0b25DbGljaz17dGhpcy5nb3RvUHJldn1cblx0XHRcdFx0c3R5bGU9e2Fycm93U3R5bGVzfVxuXHRcdFx0XHR0aXRsZT1cIlByZXZpb3VzIChMZWZ0IGFycm93IGtleSlcIlxuXHRcdFx0XHR0eXBlPVwiYnV0dG9uXCJcblx0XHRcdC8+XG5cdFx0KTtcblx0fVxuXHRyZW5kZXJBcnJvd05leHQgKCkge1xuXHRcdGNvbnN0IHsgb2Zmc2V0LCBpbWFnZXMgfSA9IHRoaXMucHJvcHM7XG5cdFx0Y29uc3QgdG90YWxDb3VudCA9IDIgKiBvZmZzZXQgKyAxO1xuXHRcdGlmICh0aGlzLmdldEZpcnN0KCkgKyB0b3RhbENvdW50ID49IGltYWdlcy5sZW5ndGgpIHJldHVybiBudWxsO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxBcnJvd1xuXHRcdFx0XHRkaXJlY3Rpb249XCJyaWdodFwiXG5cdFx0XHRcdHNpemU9XCJzbWFsbFwiXG5cdFx0XHRcdGljb249XCJhcnJvd1JpZ2h0XCJcblx0XHRcdFx0b25DbGljaz17dGhpcy5nb3RvTmV4dH1cblx0XHRcdFx0c3R5bGU9e2Fycm93U3R5bGVzfVxuXHRcdFx0XHR0aXRsZT1cIlByZXZpb3VzIChSaWdodCBhcnJvdyBrZXkpXCJcblx0XHRcdFx0dHlwZT1cImJ1dHRvblwiXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cblx0cmVuZGVyICgpIHtcblx0XHRjb25zdCB7IGltYWdlcywgY3VycmVudEltYWdlLCBvbkNsaWNrVGh1bWJuYWlsLCBvZmZzZXQgfSA9IHRoaXMucHJvcHM7XG5cblx0XHRjb25zdCB0b3RhbENvdW50ID0gMiAqIG9mZnNldCArIDE7IC8vIHNob3cgJG9mZnNldCBleHRyYSB0aHVtYm5haWxzIG9uIGVhY2ggc2lkZVxuXHRcdGxldCB0aHVtYm5haWxzID0gW107XG5cdFx0bGV0IGJhc2VPZmZzZXQgPSAwO1xuXHRcdGlmIChpbWFnZXMubGVuZ3RoIDw9IHRvdGFsQ291bnQpIHtcblx0XHRcdHRodW1ibmFpbHMgPSBpbWFnZXM7XG5cdFx0fSBlbHNlIHsgLy8gVHJ5IHRvIGNlbnRlciBjdXJyZW50IGltYWdlIGluIGxpc3Rcblx0XHRcdGJhc2VPZmZzZXQgPSB0aGlzLmdldEZpcnN0KCk7XG5cdFx0XHR0aHVtYm5haWxzID0gaW1hZ2VzLnNsaWNlKGJhc2VPZmZzZXQsIGJhc2VPZmZzZXQgKyB0b3RhbENvdW50KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9e2NzcyhjbGFzc2VzLnBhZ2luYXRlZFRodW1ibmFpbHMpfT5cblx0XHRcdFx0e3RoaXMucmVuZGVyQXJyb3dQcmV2KCl9XG5cdFx0XHRcdHt0aHVtYm5haWxzLm1hcCgoaW1nLCBpZHgpID0+IChcblx0XHRcdFx0XHQ8VGh1bWJuYWlsIGtleT17YmFzZU9mZnNldCArIGlkeH1cblx0XHRcdFx0XHRcdHsuLi5pbWd9XG5cdFx0XHRcdFx0XHRpbmRleD17YmFzZU9mZnNldCArIGlkeH1cblx0XHRcdFx0XHRcdG9uQ2xpY2s9e29uQ2xpY2tUaHVtYm5haWx9XG5cdFx0XHRcdFx0XHRhY3RpdmU9e2Jhc2VPZmZzZXQgKyBpZHggPT09IGN1cnJlbnRJbWFnZX0gLz5cblx0XHRcdFx0KSl9XG5cdFx0XHRcdHt0aGlzLnJlbmRlckFycm93TmV4dCgpfVxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufVxuXG5QYWdpbmF0ZWRUaHVtYm5haWxzLnByb3BUeXBlcyA9IHtcblx0Y3VycmVudEltYWdlOiBQcm9wVHlwZXMubnVtYmVyLFxuXHRpbWFnZXM6IFByb3BUeXBlcy5hcnJheSxcblx0b2Zmc2V0OiBQcm9wVHlwZXMubnVtYmVyLFxuXHRvbkNsaWNrVGh1bWJuYWlsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxufTtcbiIsImltcG9ydCB7IENoaWxkcmVuLCBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG4vLyBQYXNzIHRoZSBMaWdodGJveCBjb250ZXh0IHRocm91Z2ggdG8gdGhlIFBvcnRhbCdzIGRlc2NlbmRlbnRzXG4vLyBTdGFja092ZXJmbG93IGRpc2N1c3Npb24gaHR0cDovL2dvby5nbC9vY2xySjlcblxuY2xhc3MgUGFzc0NvbnRleHQgZXh0ZW5kcyBDb21wb25lbnQge1xuXHRnZXRDaGlsZENvbnRleHQgKCkge1xuXHRcdHJldHVybiB0aGlzLnByb3BzLmNvbnRleHQ7XG5cdH1cblx0cmVuZGVyICgpIHtcblx0XHRyZXR1cm4gQ2hpbGRyZW4ub25seSh0aGlzLnByb3BzLmNoaWxkcmVuKTtcblx0fVxufTtcblxuUGFzc0NvbnRleHQucHJvcFR5cGVzID0ge1xuXHRjb250ZXh0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuUGFzc0NvbnRleHQuY2hpbGRDb250ZXh0VHlwZXMgPSB7XG5cdHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgUGFzc0NvbnRleHQ7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBUcmFuc2l0aW9uIGZyb20gJ3JlYWN0LWFkZG9ucy1jc3MtdHJhbnNpdGlvbi1ncm91cCc7XG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFBhc3NDb250ZXh0IGZyb20gJy4vUGFzc0NvbnRleHQnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvcnRhbCBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yICgpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMucG9ydGFsRWxlbWVudCA9IG51bGw7XG5cdH1cblx0Y29tcG9uZW50RGlkTW91bnQgKCkge1xuXHRcdGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHApO1xuXHRcdHRoaXMucG9ydGFsRWxlbWVudCA9IHA7XG5cdFx0dGhpcy5jb21wb25lbnREaWRVcGRhdGUoKTtcblx0fVxuXHRjb21wb25lbnREaWRVcGRhdGUgKCkge1xuXHRcdC8vIEFuaW1hdGUgZmFkZSBvbiBtb3VudC91bm1vdW50XG5cdFx0Y29uc3QgZHVyYXRpb24gPSAyMDA7XG5cdFx0Y29uc3Qgc3R5bGVzID0gYFxuXHRcdFx0XHQuZmFkZS1lbnRlciB7IG9wYWNpdHk6IDAuMDE7IH1cblx0XHRcdFx0LmZhZGUtZW50ZXIuZmFkZS1lbnRlci1hY3RpdmUgeyBvcGFjaXR5OiAxOyB0cmFuc2l0aW9uOiBvcGFjaXR5ICR7ZHVyYXRpb259bXM7IH1cblx0XHRcdFx0LmZhZGUtbGVhdmUgeyBvcGFjaXR5OiAxOyB9XG5cdFx0XHRcdC5mYWRlLWxlYXZlLmZhZGUtbGVhdmUtYWN0aXZlIHsgb3BhY2l0eTogMC4wMTsgdHJhbnNpdGlvbjogb3BhY2l0eSAke2R1cmF0aW9ufW1zOyB9XG5cdFx0YDtcblxuXHRcdHJlbmRlcihcblx0XHRcdDxQYXNzQ29udGV4dCBjb250ZXh0PXt0aGlzLmNvbnRleHR9PlxuXHRcdFx0XHQ8ZGl2PlxuXHRcdFx0XHRcdDxzdHlsZT57c3R5bGVzfTwvc3R5bGU+XG5cdFx0XHRcdFx0PFRyYW5zaXRpb25cblx0XHRcdFx0XHRcdGNvbXBvbmVudD1cImRpdlwiXG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uTmFtZT1cImZhZGVcIlxuXHRcdFx0XHRcdFx0dHJhbnNpdGlvbkVudGVyVGltZW91dD17ZHVyYXRpb259XG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXtkdXJhdGlvbn1cblx0XHRcdFx0XHRcdHsuLi50aGlzLnByb3BzfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9QYXNzQ29udGV4dD4sXG5cdFx0XHR0aGlzLnBvcnRhbEVsZW1lbnRcblx0XHQpO1xuXHR9XG5cdGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcblx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMucG9ydGFsRWxlbWVudCk7XG5cdH1cblx0cmVuZGVyICgpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5Qb3J0YWwuY29udGV4dFR5cGVzID0ge1xuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgY3NzLCBTdHlsZVNoZWV0IH0gZnJvbSAnYXBocm9kaXRlL25vLWltcG9ydGFudCc7XG5cbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi90aGVtZSc7XG5pbXBvcnQgeyBkZWVwTWVyZ2UgfSBmcm9tICcuLi91dGlscyc7XG5cbmZ1bmN0aW9uIFRodW1ibmFpbCAoeyBpbmRleCwgc3JjLCB0aHVtYm5haWwsIGFjdGl2ZSwgb25DbGljayB9LCB7IHRoZW1lIH0pIHtcblx0Y29uc3QgdXJsID0gdGh1bWJuYWlsID8gdGh1bWJuYWlsIDogc3JjO1xuXHRjb25zdCBjbGFzc2VzID0gU3R5bGVTaGVldC5jcmVhdGUoZGVlcE1lcmdlKGRlZmF1bHRTdHlsZXMsIHRoZW1lKSk7XG5cblx0cmV0dXJuIChcblx0XHQ8ZGl2XG5cdFx0XHRjbGFzc05hbWU9e2NzcyhjbGFzc2VzLnRodW1ibmFpbCwgYWN0aXZlICYmIGNsYXNzZXMudGh1bWJuYWlsX19hY3RpdmUpfVxuXHRcdFx0b25DbGljaz17KGUpID0+IHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRvbkNsaWNrKGluZGV4KTtcblx0XHRcdH19XG5cdFx0XHRzdHlsZT17eyBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoXCInICsgdXJsICsgJ1wiKScgfX1cblx0XHQvPlxuXHQpO1xufVxuXG5UaHVtYm5haWwucHJvcFR5cGVzID0ge1xuXHRhY3RpdmU6IFByb3BUeXBlcy5ib29sLFxuXHRpbmRleDogUHJvcFR5cGVzLm51bWJlcixcblx0b25DbGljazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblx0c3JjOiBQcm9wVHlwZXMuc3RyaW5nLFxuXHR0aHVtYm5haWw6IFByb3BUeXBlcy5zdHJpbmcsXG59O1xuXG5UaHVtYm5haWwuY29udGV4dFR5cGVzID0ge1xuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuY29uc3QgZGVmYXVsdFN0eWxlcyA9IHtcblx0dGh1bWJuYWlsOiB7XG5cdFx0YmFja2dyb3VuZFBvc2l0aW9uOiAnY2VudGVyJyxcblx0XHRiYWNrZ3JvdW5kU2l6ZTogJ2NvdmVyJyxcblx0XHRib3JkZXJSYWRpdXM6IDIsXG5cdFx0Ym94U2hhZG93OiAnaW5zZXQgMCAwIDAgMXB4IGhzbGEoMCwwJSwxMDAlLC4yKScsXG5cdFx0Y3Vyc29yOiAncG9pbnRlcicsXG5cdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50aHVtYm5haWwuc2l6ZSxcblx0XHRtYXJnaW46IGRlZmF1bHRzLnRodW1ibmFpbC5ndXR0ZXIsXG5cdFx0b3ZlcmZsb3c6ICdoaWRkZW4nLFxuXHRcdHdpZHRoOiBkZWZhdWx0cy50aHVtYm5haWwuc2l6ZSxcblx0fSxcblx0dGh1bWJuYWlsX19hY3RpdmU6IHtcblx0XHRib3hTaGFkb3c6IGBpbnNldCAwIDAgMCAycHggJHtkZWZhdWx0cy50aHVtYm5haWwuYWN0aXZlQm9yZGVyQ29sb3J9YCxcblx0fSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRodW1ibmFpbDtcbiIsImV4cG9ydCBkZWZhdWx0IChmaWxsKSA9PiAoXG5cdGA8c3ZnIGZpbGw9XCIke2ZpbGx9XCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuXHRcdDxwYXRoIGQ9XCJNMjEzLjcsMjU2TDIxMy43LDI1NkwyMTMuNywyNTZMMzgwLjksODEuOWM0LjItNC4zLDQuMS0xMS40LTAuMi0xNS44bC0yOS45LTMwLjZjLTQuMy00LjQtMTEuMy00LjUtMTUuNS0wLjJMMTMxLjEsMjQ3LjkgYy0yLjIsMi4yLTMuMiw1LjItMyw4LjFjLTAuMSwzLDAuOSw1LjksMyw4LjFsMjA0LjIsMjEyLjdjNC4yLDQuMywxMS4yLDQuMiwxNS41LTAuMmwyOS45LTMwLjZjNC4zLTQuNCw0LjQtMTEuNSwwLjItMTUuOCBMMjEzLjcsMjU2elwiLz5cblx0PC9zdmc+YFxuKTtcbiIsImV4cG9ydCBkZWZhdWx0IChmaWxsKSA9PiAoXG5cdGA8c3ZnIGZpbGw9XCIke2ZpbGx9XCIgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDUxMiA1MTJcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuXHRcdDxwYXRoIGQ9XCJNMjk4LjMsMjU2TDI5OC4zLDI1NkwyOTguMywyNTZMMTMxLjEsODEuOWMtNC4yLTQuMy00LjEtMTEuNCwwLjItMTUuOGwyOS45LTMwLjZjNC4zLTQuNCwxMS4zLTQuNSwxNS41LTAuMmwyMDQuMiwyMTIuNyBjMi4yLDIuMiwzLjIsNS4yLDMsOC4xYzAuMSwzLTAuOSw1LjktMyw4LjFMMTc2LjcsNDc2LjhjLTQuMiw0LjMtMTEuMiw0LjItMTUuNS0wLjJMMTMxLjMsNDQ2Yy00LjMtNC40LTQuNC0xMS41LTAuMi0xNS44IEwyOTguMywyNTZ6XCIvPlxuXHQ8L3N2Zz5gXG4pO1xuIiwiZXhwb3J0IGRlZmF1bHQgKGZpbGwpID0+IChcblx0YDxzdmcgZmlsbD1cIiR7ZmlsbH1cIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyO1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG5cdFx0PHBhdGggZD1cIk00NDMuNiwzODcuMUwzMTIuNCwyNTUuNGwxMzEuNS0xMzBjNS40LTUuNCw1LjQtMTQuMiwwLTE5LjZsLTM3LjQtMzcuNmMtMi42LTIuNi02LjEtNC05LjgtNGMtMy43LDAtNy4yLDEuNS05LjgsNCBMMjU2LDE5Ny44TDEyNC45LDY4LjNjLTIuNi0yLjYtNi4xLTQtOS44LTRjLTMuNywwLTcuMiwxLjUtOS44LDRMNjgsMTA1LjljLTUuNCw1LjQtNS40LDE0LjIsMCwxOS42bDEzMS41LDEzMEw2OC40LDM4Ny4xIGMtMi42LDIuNi00LjEsNi4xLTQuMSw5LjhjMCwzLjcsMS40LDcuMiw0LjEsOS44bDM3LjQsMzcuNmMyLjcsMi43LDYuMiw0LjEsOS44LDQuMWMzLjUsMCw3LjEtMS4zLDkuOC00LjFMMjU2LDMxMy4xbDEzMC43LDEzMS4xIGMyLjcsMi43LDYuMiw0LjEsOS44LDQuMWMzLjUsMCw3LjEtMS4zLDkuOC00LjFsMzcuNC0zNy42YzIuNi0yLjYsNC4xLTYuMSw0LjEtOS44QzQ0Ny43LDM5My4yLDQ0Ni4yLDM4OS43LDQ0My42LDM4Ny4xelwiLz5cblx0PC9zdmc+YFxuKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRhcnJvd0xlZnQ6IHJlcXVpcmUoJy4vYXJyb3dMZWZ0JyksXG5cdGFycm93UmlnaHQ6IHJlcXVpcmUoJy4vYXJyb3dSaWdodCcpLFxuXHRjbG9zZTogcmVxdWlyZSgnLi9jbG9zZScpLFxuXHRyb3RhdGU6IHJlcXVpcmUoJy4vcm90YXRlJyksXG59O1xuIiwiZXhwb3J0IGRlZmF1bHQgKGZpbGwpID0+IChcblx0YDxzdmcgZmlsbD1cIiR7ZmlsbH1cIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMzg1IDM4NVwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyO1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG5cdFx0PHBhdGggZD1cIk0zODUsMzIuMDgzMzMzMyBMMzg1LDE0NC4zNzUgQzM4NSwxNDguNzE5NjE4IDM4My40MTI1NDMsMTUyLjQ3OTM4NCAzODAuMjM3NjMsMTU1LjY1NDI5NyBDMzc3LjA2MjcxNywxNTguODI5MjEgMzczLjMwMjk1MSwxNjAuNDE2NjY3IDM2OC45NTgzMzMsMTYwLjQxNjY2NyBMMjU2LjY2NjY2NywxNjAuNDE2NjY3IEMyNDkuNjQ4NDM4LDE2MC40MTY2NjcgMjQ0LjcxODk2NywxNTcuMDc0NjUzIDI0MS44NzgyNTUsMTUwLjM5MDYyNSBDMjM5LjAzNzU0MywxNDMuODczNjk4IDI0MC4yMDcyNDgsMTM4LjEwODcyNCAyNDUuMzg3MzcsMTMzLjA5NTcwMyBMMjc5Ljk3NzIxNCw5OC41MDU4NTk0IEMyNTUuMjQ2MzExLDc1LjYxMzA2NDIgMjI2LjA4NzI0LDY0LjE2NjY2NjcgMTkyLjUsNjQuMTY2NjY2NyBDMTc1LjEyMTUyOCw2NC4xNjY2NjY3IDE1OC41MzY3ODQsNjcuNTUwNDU1NyAxNDIuNzQ1NzY4LDc0LjMxODAzMzkgQzEyNi45NTQ3NTMsODEuMDg1NjEyIDExMy4yOTQyNzEsOTAuMjM0Mzc1IDEwMS43NjQzMjMsMTAxLjc2NDMyMyBDOTAuMjM0Mzc1LDExMy4yOTQyNzEgODEuMDg1NjEyLDEyNi45NTQ3NTMgNzQuMzE4MDMzOSwxNDIuNzQ1NzY4IEM2Ny41NTA0NTU3LDE1OC41MzY3ODQgNjQuMTY2NjY2NywxNzUuMTIxNTI4IDY0LjE2NjY2NjcsMTkyLjUgQzY0LjE2NjY2NjcsMjA5Ljg3ODQ3MiA2Ny41NTA0NTU3LDIyNi40NjMyMTYgNzQuMzE4MDMzOSwyNDIuMjU0MjMyIEM4MS4wODU2MTIsMjU4LjA0NTI0NyA5MC4yMzQzNzUsMjcxLjcwNTcyOSAxMDEuNzY0MzIzLDI4My4yMzU2NzcgQzExMy4yOTQyNzEsMjk0Ljc2NTYyNSAxMjYuOTU0NzUzLDMwMy45MTQzODggMTQyLjc0NTc2OCwzMTAuNjgxOTY2IEMxNTguNTM2Nzg0LDMxNy40NDk1NDQgMTc1LjEyMTUyOCwzMjAuODMzMzMzIDE5Mi41LDMyMC44MzMzMzMgQzIxMi4zODQ5ODMsMzIwLjgzMzMzMyAyMzEuMTgzODExLDMxNi40ODg3MTUgMjQ4Ljg5NjQ4NCwzMDcuNzk5NDc5IEMyNjYuNjA5MTU4LDI5OS4xMTAyNDMgMjgxLjU2NDY3LDI4Ni44MjgzNDIgMjkzLjc2MzAyMSwyNzAuOTUzNzc2IEMyOTQuOTMyNzI2LDI2OS4yODI3NjkgMjk2Ljg1NDM4NCwyNjguMjgwMTY1IDI5OS41Mjc5OTUsMjY3Ljk0NTk2NCBDMzAxLjg2NzQwNSwyNjcuOTQ1OTY0IDMwMy45NTYxNjMsMjY4LjY5NzkxNyAzMDUuNzk0MjcxLDI3MC4yMDE4MjMgTDM0MC4xMzM0NjQsMzA0Ljc5MTY2NyBDMzQxLjYzNzM3LDMwNi4xMjg0NzIgMzQyLjQzMTA5OCwzMDcuODQxMjU0IDM0Mi41MTQ2NDgsMzA5LjkzMDAxMyBDMzQyLjU5ODE5OSwzMTIuMDE4NzcyIDM0MS45NzE1NzEsMzEzLjg5ODY1NSAzNDAuNjM0NzY2LDMxNS41Njk2NjEgQzMyMi40MjA3OSwzMzcuNjI2OTUzIDMwMC4zNjM0OTgsMzU0LjcxMjk5OSAyNzQuNDYyODkxLDM2Ni44Mjc3OTkgQzI0OC41NjIyODMsMzc4Ljk0MjYgMjIxLjI0MTMxOSwzODUgMTkyLjUsMzg1IEMxNjYuNDMyMjkyLDM4NSAxNDEuNTM0Mjg4LDM3OS45MDM0MjkgMTE3LjgwNTk5LDM2OS43MTAyODYgQzk0LjA3NzY5MSwzNTkuNTE3MTQ0IDczLjYwNzg1NTksMzQ1LjgxNDg4NyA1Ni4zOTY0ODQ0LDMyOC42MDM1MTYgQzM5LjE4NTExMjgsMzExLjM5MjE0NCAyNS40ODI4NTU5LDI5MC45MjIzMDkgMTUuMjg5NzEzNSwyNjcuMTk0MDEgQzUuMDk2NTcxMTgsMjQzLjQ2NTcxMiAwLDIxOC41Njc3MDggMCwxOTIuNSBDMCwxNjYuNDMyMjkyIDUuMDk2NTcxMTgsMTQxLjUzNDI4OCAxNS4yODk3MTM1LDExNy44MDU5OSBDMjUuNDgyODU1OSw5NC4wNzc2OTEgMzkuMTg1MTEyOCw3My42MDc4NTU5IDU2LjM5NjQ4NDQsNTYuMzk2NDg0NCBDNzMuNjA3ODU1OSwzOS4xODUxMTI4IDk0LjA3NzY5MSwyNS40ODI4NTU5IDExNy44MDU5OSwxNS4yODk3MTM1IEMxNDEuNTM0Mjg4LDUuMDk2NTcxMTggMTY2LjQzMjI5MiwwIDE5Mi41LDAgQzIxNy4wNjM4MDIsMCAyNDAuODMzODc2LDQuNjM3MDQ0MjcgMjYzLjgxMDIyMSwxMy45MTExMzI4IEMyODYuNzg2NTY3LDIzLjE4NTIyMTQgMzA3LjIxNDYyNywzNi4yNjA4NTA3IDMyNS4wOTQ0MDEsNTMuMTM4MDIwOCBMMzU3LjY3OTAzNiwyMC44MDQwMzY1IEMzNjIuNTI0OTU3LDE1LjYyMzkxNDkgMzY4LjM3MzQ4MSwxNC40NTQyMTAxIDM3NS4yMjQ2MDksMTcuMjk0OTIxOSBDMzgxLjc0MTUzNiwyMC4xMzU2MzM3IDM4NSwyNS4wNjUxMDQyIDM4NSwzMi4wODMzMzMzIFpcIiBpZD1cIlNoYXBlXCIgZmlsbD1cIiR7ZmlsbH1cIj48L3BhdGg+XG5cdDwvc3ZnPmBcbik7XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRIRU1FXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgdGhlbWUgPSB7fTtcblxuLy8gY29udGFpbmVyXG50aGVtZS5jb250YWluZXIgPSB7XG5cdGJhY2tncm91bmQ6ICdyZ2JhKDAsIDAsIDAsIDAuOCknLFxuXHRndXR0ZXI6IHtcblx0XHRob3Jpem9udGFsOiAxMCxcblx0XHR2ZXJ0aWNhbDogMTAsXG5cdH0sXG5cdHpJbmRleDogMjAwMSxcbn07XG5cbi8vIGhlYWRlclxudGhlbWUuaGVhZGVyID0ge1xuXHRoZWlnaHQ6IDQwLFxufTtcbnRoZW1lLmNsb3NlID0ge1xuXHRmaWxsOiAnd2hpdGUnLFxuXHRoZWlnaHQ6IDIwLFxuXHR3aWR0aDogMjAsXG59O1xudGhlbWUucm90YXRlID0ge1xuXHRmaWxsOiAnd2hpdGUnLFxuXHRoZWlnaHQ6IDIwLFxuXHR3aWR0aDogMjAsXG59O1xuXG4vLyBmb290ZXJcbnRoZW1lLmZvb3RlciA9IHtcblx0Y29sb3I6ICd3aGl0ZScsXG5cdGNvdW50OiB7XG5cdFx0Y29sb3I6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNzUpJyxcblx0XHRmb250U2l6ZTogJzAuODVlbScsXG5cdH0sXG5cdGhlaWdodDogNDAsXG5cdGd1dHRlcjoge1xuXHRcdGhvcml6b250YWw6IDAsXG5cdFx0dmVydGljYWw6IDUsXG5cdH0sXG59O1xuXG4vLyB0aHVtYm5haWxzXG50aGVtZS50aHVtYm5haWwgPSB7XG5cdGFjdGl2ZUJvcmRlckNvbG9yOiAnd2hpdGUnLFxuXHRzaXplOiA1MCxcblx0Z3V0dGVyOiAyLFxufTtcblxuLy8gYXJyb3dcbnRoZW1lLmFycm93ID0ge1xuXHRiYWNrZ3JvdW5kOiAnYmxhY2snLFxuXHRmaWxsOiAnd2hpdGUnLFxuXHRoZWlnaHQ6IDEyMCxcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSB0aGVtZTtcbiIsIi8qKlxuXHRCaW5kIG11bHRpcGxlIGNvbXBvbmVudCBtZXRob2RzOlxuXG5cdCogQHBhcmFtIHt0aGlzfSBjb250ZXh0XG5cdCogQHBhcmFtIHtBcnJheX0gZnVuY3Rpb25zXG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0Li4uXG5cdFx0YmluZEZ1bmN0aW9ucy5jYWxsKHRoaXMsIFsnaGFuZGxlQ2xpY2snLCAnaGFuZGxlT3RoZXInXSk7XG5cdH1cbiovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZEZ1bmN0aW9ucyAoZnVuY3Rpb25zKSB7XG5cdGZ1bmN0aW9ucy5mb3JFYWNoKGYgPT4gKHRoaXNbZl0gPSB0aGlzW2ZdLmJpbmQodGhpcykpKTtcbn07XG4iLCIvLyBSZXR1cm4gdHJ1ZSBpZiB3aW5kb3cgKyBkb2N1bWVudFxuXG5tb2R1bGUuZXhwb3J0cyA9ICEhKFxuXHR0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuXHQmJiB3aW5kb3cuZG9jdW1lbnRcblx0JiYgd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnRcbik7XG4iLCJmdW5jdGlvbiBkZWVwTWVyZ2UgKHRhcmdldCwgc291cmNlID0ge30pIHtcblx0Y29uc3QgZXh0ZW5kZWQgPSBPYmplY3QuYXNzaWduKHt9LCB0YXJnZXQpO1xuXG5cdE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0aWYgKHR5cGVvZiBzb3VyY2Vba2V5XSAhPT0gJ29iamVjdCcgfHwgIXNvdXJjZVtrZXldKSB7XG5cdFx0XHRleHRlbmRlZFtrZXldID0gc291cmNlW2tleV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICghdGFyZ2V0W2tleV0pIHtcblx0XHRcdFx0ZXh0ZW5kZWRba2V5XSA9IHNvdXJjZVtrZXldO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZXh0ZW5kZWRba2V5XSA9IGRlZXBNZXJnZSh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0cmV0dXJuIGV4dGVuZGVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZXBNZXJnZTtcbiIsImltcG9ydCBiaW5kRnVuY3Rpb25zIGZyb20gJy4vYmluZEZ1bmN0aW9ucyc7XG5pbXBvcnQgY2FuVXNlRG9tIGZyb20gJy4vY2FuVXNlRG9tJztcbmltcG9ydCBkZWVwTWVyZ2UgZnJvbSAnLi9kZWVwTWVyZ2UnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YmluZEZ1bmN0aW9ucyxcblx0Y2FuVXNlRG9tLFxuXHRkZWVwTWVyZ2UsXG59O1xuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBjc3MsIFN0eWxlU2hlZXQgfSBmcm9tICdhcGhyb2RpdGUvbm8taW1wb3J0YW50JztcblxuaW1wb3J0IHRoZW1lIGZyb20gJy4vdGhlbWUnO1xuaW1wb3J0IEFycm93IGZyb20gJy4vY29tcG9uZW50cy9BcnJvdyc7XG5pbXBvcnQgQ29udGFpbmVyIGZyb20gJy4vY29tcG9uZW50cy9Db250YWluZXInO1xuaW1wb3J0IEZvb3RlciBmcm9tICcuL2NvbXBvbmVudHMvRm9vdGVyJztcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9jb21wb25lbnRzL0hlYWRlcic7XG5pbXBvcnQgUGFnaW5hdGVkVGh1bWJuYWlscyBmcm9tICcuL2NvbXBvbmVudHMvUGFnaW5hdGVkVGh1bWJuYWlscyc7XG5pbXBvcnQgUG9ydGFsIGZyb20gJy4vY29tcG9uZW50cy9Qb3J0YWwnO1xuXG5pbXBvcnQgeyBiaW5kRnVuY3Rpb25zLCBjYW5Vc2VEb20gfSBmcm9tICcuL3V0aWxzJztcblxuY2xhc3MgTGlnaHRib3ggZXh0ZW5kcyBDb21wb25lbnQge1xuXHRjb25zdHJ1Y3RvciAoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnN0YXRlID0geyByb3RhdGU6IDAsIGlzWm9vbWVkOiBmYWxzZSB9O1xuXG5cdFx0YmluZEZ1bmN0aW9ucy5jYWxsKHRoaXMsIFtcblx0XHRcdCdnb3RvTmV4dCcsXG5cdFx0XHQnZ290b1ByZXYnLFxuXHRcdFx0J3JvdGF0ZScsXG5cdFx0XHQnem9vbScsXG5cdFx0XHQnaGFuZGxlS2V5Ym9hcmRJbnB1dCcsXG5cdFx0XSk7XG5cdH1cblx0Z2V0Q2hpbGRDb250ZXh0ICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGhlbWU6IHRoaXMucHJvcHMudGhlbWUsXG5cdFx0fTtcblx0fVxuXHRjb21wb25lbnREaWRNb3VudCAoKSB7XG5cdFx0bGV0IHNlbGYgPSB0aGlzO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMuaXNPcGVuICYmIHRoaXMucHJvcHMuZW5hYmxlS2V5Ym9hcmRJbnB1dCkge1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWJvYXJkSW5wdXQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BzLnpvb20pIHtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRsZXQgcG9zWSA9IGV2ZW50LmNsaWVudFk7XG5cdFx0XHRcdGlmIChzZWxmLnN0YXRlLmlzWm9vbWVkKSB7XG5cdFx0XHRcdFx0aWYgKHBvc1kgPD0gd2luZG93LmlubmVySGVpZ2h0IC8gMikge1xuXHRcdFx0XHRcdFx0c2VsZi5zZXRTdGF0ZSh7IG1hcmdpbjogYCR7d2luZG93LmlubmVySGVpZ2h0IC0gcG9zWX1weCAwcHggMHB4IDBweGAgfSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNlbGYuc2V0U3RhdGUoeyBtYXJnaW46IGAtJHtwb3NZIC8gMS4zfXB4IDBweCAwcHggMHB4YCB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHR9XG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuXHRcdGlmICghY2FuVXNlRG9tKSByZXR1cm47XG5cblx0XHQvLyBwcmVsb2FkIGltYWdlc1xuXHRcdGlmIChuZXh0UHJvcHMucHJlbG9hZE5leHRJbWFnZSkge1xuXHRcdFx0Y29uc3QgY3VycmVudEluZGV4ID0gdGhpcy5wcm9wcy5jdXJyZW50SW1hZ2U7XG5cdFx0XHRjb25zdCBuZXh0SW5kZXggPSBuZXh0UHJvcHMuY3VycmVudEltYWdlICsgMTtcblx0XHRcdGNvbnN0IHByZXZJbmRleCA9IG5leHRQcm9wcy5jdXJyZW50SW1hZ2UgLSAxO1xuXHRcdFx0bGV0IHByZWxvYWRJbmRleDtcblxuXHRcdFx0aWYgKGN1cnJlbnRJbmRleCAmJiBuZXh0UHJvcHMuY3VycmVudEltYWdlID4gY3VycmVudEluZGV4KSB7XG5cdFx0XHRcdHByZWxvYWRJbmRleCA9IG5leHRJbmRleDtcblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudEluZGV4ICYmIG5leHRQcm9wcy5jdXJyZW50SW1hZ2UgPCBjdXJyZW50SW5kZXgpIHtcblx0XHRcdFx0cHJlbG9hZEluZGV4ID0gcHJldkluZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBpZiB3ZSBrbm93IHRoZSB1c2VyJ3MgZGlyZWN0aW9uIGp1c3QgZ2V0IG9uZSBpbWFnZVxuXHRcdFx0Ly8gb3RoZXJ3aXNlLCB0byBiZSBzYWZlLCB3ZSBuZWVkIHRvIGdyYWIgb25lIGluIGVhY2ggZGlyZWN0aW9uXG5cdFx0XHRpZiAocHJlbG9hZEluZGV4KSB7XG5cdFx0XHRcdHRoaXMucHJlbG9hZEltYWdlKHByZWxvYWRJbmRleCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnByZWxvYWRJbWFnZShwcmV2SW5kZXgpO1xuXHRcdFx0XHR0aGlzLnByZWxvYWRJbWFnZShuZXh0SW5kZXgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGFkZC9yZW1vdmUgZXZlbnQgbGlzdGVuZXJzXG5cdFx0aWYgKCF0aGlzLnByb3BzLmlzT3BlbiAmJiBuZXh0UHJvcHMuaXNPcGVuICYmIG5leHRQcm9wcy5lbmFibGVLZXlib2FyZElucHV0KSB7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5Ym9hcmRJbnB1dCk7XG5cdFx0fVxuXHRcdGlmICghbmV4dFByb3BzLmlzT3BlbiAmJiBuZXh0UHJvcHMuZW5hYmxlS2V5Ym9hcmRJbnB1dCkge1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWJvYXJkSW5wdXQpO1xuXHRcdH1cblx0fVxuXHRjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuZW5hYmxlS2V5Ym9hcmRJbnB1dCkge1xuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWJvYXJkSW5wdXQpO1xuXHRcdH1cblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBNRVRIT0RTXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHByZWxvYWRJbWFnZSAoaWR4KSB7XG5cdFx0Y29uc3QgaW1hZ2UgPSB0aGlzLnByb3BzLmltYWdlc1tpZHhdO1xuXG5cdFx0aWYgKCFpbWFnZSkgcmV0dXJuO1xuXG5cdFx0Y29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG5cblx0XHRpbWcuc3JjID0gaW1hZ2Uuc3JjO1xuXG5cdFx0aWYgKGltYWdlLnNyY3NldCkge1xuXHRcdFx0aW1nLnNyY3NldCA9IGltYWdlLnNyY3NldC5qb2luKCk7XG5cdFx0fVxuXG5cdH1cblx0Z290b05leHQgKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuY3VycmVudEltYWdlID09PSAodGhpcy5wcm9wcy5pbWFnZXMubGVuZ3RoIC0gMSkpIHJldHVybjtcblx0XHRpZiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cdFx0dGhpcy5wcm9wcy5vbkNsaWNrTmV4dCgpO1xuXHRcdHRoaXMuc2V0U3RhdGUoeyByb3RhdGU6IDAgfSk7XG5cblx0fVxuXHRnb3RvUHJldiAoZXZlbnQpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5jdXJyZW50SW1hZ2UgPT09IDApIHJldHVybjtcblx0XHRpZiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHR9XG5cdFx0dGhpcy5wcm9wcy5vbkNsaWNrUHJldigpO1xuXHRcdHRoaXMuc2V0U3RhdGUoeyByb3RhdGU6IDAgfSk7XG5cblx0fVxuXHRoYW5kbGVLZXlib2FyZElucHV0IChldmVudCkge1xuXHRcdGlmIChldmVudC5rZXlDb2RlID09PSAzNykgeyAvLyBsZWZ0XG5cdFx0XHR0aGlzLmdvdG9QcmV2KGV2ZW50KTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkpIHsgLy8gcmlnaHRcblx0XHRcdHRoaXMuZ290b05leHQoZXZlbnQpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSAyNykgeyAvLyBlc2Ncblx0XHRcdHRoaXMucHJvcHMub25DbG9zZSgpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblxuXHR9XG5cdHJvdGF0ZSAoZXZlbnQpIHtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0aWYgKHRoaXMuc3RhdGUucm90YXRlID09PSAzNjApIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoeyByb3RhdGU6IDkwIH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgcm90YXRlOiB0aGlzLnN0YXRlLnJvdGF0ZSArIDkwIH0pO1xuXHRcdH1cblxuXHR9XG5cdHpvb20gKGV2ZW50KSB7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGlmICh0aGlzLnN0YXRlLmlzWm9vbWVkKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdFx0aXNab29tZWQ6IGZhbHNlLFxuXHRcdFx0XHRtYXJnaW46IDAsXG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzWm9vbWVkOiB0cnVlLFxuXHRcdFx0XHRtYXJnaW46IDAsXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fVxuXHRldmVudFByZXZlbnREZWZhdWx0IChldmVudCkge1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIFJFTkRFUkVSU1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRyZW5kZXJBcnJvd1ByZXYgKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmN1cnJlbnRJbWFnZSA9PT0gMCkgcmV0dXJuIG51bGw7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PEFycm93XG5cdFx0XHRcdGRpcmVjdGlvbj1cImxlZnRcIlxuXHRcdFx0XHRpY29uPVwiYXJyb3dMZWZ0XCJcblx0XHRcdFx0b25DbGljaz17dGhpcy5nb3RvUHJldn1cblx0XHRcdFx0dGl0bGU9e3RoaXMucHJvcHMubGVmdEFycm93VGl0bGV9XG5cdFx0XHRcdHR5cGU9XCJidXR0b25cIlxuXHRcdFx0Lz5cblx0XHQpO1xuXHR9XG5cdHJlbmRlckFycm93TmV4dCAoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuY3VycmVudEltYWdlID09PSAodGhpcy5wcm9wcy5pbWFnZXMubGVuZ3RoIC0gMSkpIHJldHVybiBudWxsO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxBcnJvd1xuXHRcdFx0XHRkaXJlY3Rpb249XCJyaWdodFwiXG5cdFx0XHRcdGljb249XCJhcnJvd1JpZ2h0XCJcblx0XHRcdFx0b25DbGljaz17dGhpcy5nb3RvTmV4dH1cblx0XHRcdFx0dGl0bGU9e3RoaXMucHJvcHMucmlnaHRBcnJvd1RpdGxlfVxuXHRcdFx0XHR0eXBlPVwiYnV0dG9uXCJcblx0XHRcdC8+XG5cdFx0KTtcblx0fVxuXHRyZW5kZXJEaWFsb2cgKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGJhY2tkcm9wQ2xvc2VzTW9kYWwsXG5cdFx0XHRjdXN0b21Db250cm9scyxcblx0XHRcdGlzT3Blbixcblx0XHRcdG9uQ2xvc2UsXG5cdFx0XHRzaG93Q2xvc2VCdXR0b24sXG5cdFx0XHRzaG93Um90YXRlQnV0dG9uLFxuXHRcdFx0c2hvd1RodW1ibmFpbHMsXG5cdFx0XHRyb3RhdGVCdXR0b25UaXRsZSxcblx0XHRcdHdpZHRoLFxuXHRcdH0gPSB0aGlzLnByb3BzO1xuXG5cdFx0aWYgKCFpc09wZW4pIHJldHVybiA8c3BhbiBrZXk9XCJjbG9zZWRcIiAvPjtcblxuXHRcdGxldCBvZmZzZXRUaHVtYm5haWxzID0gMDtcblx0XHRpZiAoc2hvd1RodW1ibmFpbHMpIHtcblx0XHRcdG9mZnNldFRodW1ibmFpbHMgPSB0aGVtZS50aHVtYm5haWwuc2l6ZSArIHRoZW1lLmNvbnRhaW5lci5ndXR0ZXIudmVydGljYWw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxDb250YWluZXJcblx0XHRcdFx0a2V5PVwib3BlblwiXG5cdFx0XHRcdG9uQ2xpY2s9eyEhYmFja2Ryb3BDbG9zZXNNb2RhbCAmJiBvbkNsb3NlfVxuXHRcdFx0XHRvblRvdWNoRW5kPXshIWJhY2tkcm9wQ2xvc2VzTW9kYWwgJiYgb25DbG9zZX1cblx0XHRcdD5cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmNvbnRlbnQpfSBzdHlsZT17eyBtYXJnaW5Cb3R0b206IG9mZnNldFRodW1ibmFpbHMsIG1heFdpZHRoOiB3aWR0aCB9fT5cblx0XHRcdFx0XHQ8SGVhZGVyXG5cdFx0XHRcdFx0XHRjdXN0b21Db250cm9scz17Y3VzdG9tQ29udHJvbHN9XG5cdFx0XHRcdFx0XHRvbkNsb3NlPXtvbkNsb3NlfVxuXHRcdFx0XHRcdFx0b25Sb3RhdGU9e3RoaXMucm90YXRlfVxuXHRcdFx0XHRcdFx0c2hvd0Nsb3NlQnV0dG9uPXtzaG93Q2xvc2VCdXR0b259XG5cdFx0XHRcdFx0XHRjbG9zZUJ1dHRvblRpdGxlPXt0aGlzLnByb3BzLmNsb3NlQnV0dG9uVGl0bGV9XG5cdFx0XHRcdFx0XHRyb3RhdGVCdXR0b25UaXRsZT17cm90YXRlQnV0dG9uVGl0bGV9XG5cdFx0XHRcdFx0XHRzaG93Um90YXRlQnV0dG9uPXtzaG93Um90YXRlQnV0dG9ufVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0e3RoaXMucmVuZGVySW1hZ2VzKCl9XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHR7dGhpcy5yZW5kZXJUaHVtYm5haWxzKCl9XG5cdFx0XHRcdHt0aGlzLnJlbmRlckFycm93UHJldigpfVxuXHRcdFx0XHR7dGhpcy5yZW5kZXJBcnJvd05leHQoKX1cblx0XHRcdDwvQ29udGFpbmVyPlxuXHRcdCk7XG5cdH1cblx0cmVuZGVySW1hZ2VzICgpIHtcblx0XHRjb25zdCB7XG5cdFx0XHRjdXJyZW50SW1hZ2UsXG5cdFx0XHRpbWFnZXMsXG5cdFx0XHRpbWFnZUNvdW50U2VwYXJhdG9yLFxuXHRcdFx0b25DbGlja0ltYWdlLFxuXHRcdFx0c2hvd0ltYWdlQ291bnQsXG5cdFx0XHRzaG93VGh1bWJuYWlscyxcblx0XHR9ID0gdGhpcy5wcm9wcztcblxuXHRcdGlmICghaW1hZ2VzIHx8ICFpbWFnZXMubGVuZ3RoKSByZXR1cm4gbnVsbDtcblxuXHRcdGNvbnN0IGltYWdlID0gaW1hZ2VzW2N1cnJlbnRJbWFnZV07XG5cblx0XHRsZXQgc3Jjc2V0O1xuXHRcdGxldCBzaXplcztcblxuXHRcdGlmIChpbWFnZS5zcmNzZXQpIHtcblx0XHRcdHNyY3NldCA9IGltYWdlLnNyY3NldC5qb2luKCk7XG5cdFx0XHRzaXplcyA9ICcxMDB2dyc7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdGh1bWJuYWlsc1NpemUgPSBzaG93VGh1bWJuYWlscyA/IHRoZW1lLnRodW1ibmFpbC5zaXplIDogMDtcblx0XHRjb25zdCBoZWlnaHRPZmZzZXQgPSBgJHt0aGVtZS5oZWFkZXIuaGVpZ2h0ICsgdGhlbWUuZm9vdGVyLmhlaWdodCArIHRodW1ibmFpbHNTaXplICsgKHRoZW1lLmNvbnRhaW5lci5ndXR0ZXIudmVydGljYWwpfXB4YDtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZmlndXJlIGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuZmlndXJlKX0+XG5cdFx0XHRcdHsvKlxuXHRcdFx0XHRcdFJlLWltcGxlbWVudCB3aGVuIHJlYWN0IHdhcm5pbmcgXCJ1bmtub3duIHByb3BzXCJcblx0XHRcdFx0XHRodHRwczovL2ZiLm1lL3JlYWN0LXVua25vd24tcHJvcCBpcyByZXNvbHZlZFxuXHRcdFx0XHRcdDxTd2lwZWFibGUgb25Td2lwZWRMZWZ0PXt0aGlzLmdvdG9OZXh0fSBvblN3aXBlZFJpZ2h0PXt0aGlzLmdvdG9QcmV2fSAvPlxuXHRcdFx0XHQqL31cblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmltYWdlV3JhcHBlcil9PlxuXHRcdFx0XHRcdDxpbWdcblx0XHRcdFx0XHRcdGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuaW1hZ2UpfVxuXHRcdFx0XHRcdFx0b25DbGljaz17b25DbGlja0ltYWdlID8gb25DbGlja0ltYWdlIDogdGhpcy5wcm9wcy56b29tID8gdGhpcy56b29tIDogbnVsbH1cblx0XHRcdFx0XHRcdGFsdD17aW1hZ2UuYWx0fVxuXHRcdFx0XHRcdFx0c3JjPXtpbWFnZS5zcmN9XG5cdFx0XHRcdFx0XHRzcmNTZXQ9e3NyY3NldH1cblx0XHRcdFx0XHRcdHN0eWxlPXt7XG5cdFx0XHRcdFx0XHRcdGN1cnNvcjogdGhpcy5wcm9wcy56b29tID8gIXRoaXMuc3RhdGUuaXNab29tZWQgPyAnem9vbS1pbicgOiAnem9vbS1vdXQnIDogb25DbGlja0ltYWdlID8gJ3BvaW50ZXInIDogJ2F1dG8nLFxuXHRcdFx0XHRcdFx0XHRtYXhIZWlnaHQ6ICF0aGlzLnN0YXRlLmlzWm9vbWVkID8gJzYzMHB4JyA6ICcxMjB2aCcsXG5cdFx0XHRcdFx0XHRcdG1heFdpZHRoOiAhdGhpcy5zdGF0ZS5pc1pvb21lZCA/ICc1NzRweCcgOiAnMTIwdmgnLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2Zvcm06ICF0aGlzLnN0YXRlLmlzWm9vbWVkID8gYHNjYWxlKDEpIHJvdGF0ZSgke3RoaXMuc3RhdGUucm90YXRlfWRlZylgIDogYHNjYWxlKDEuNCkgcm90YXRlKCR7dGhpcy5zdGF0ZS5yb3RhdGV9ZGVnKWAsXG5cdFx0XHRcdFx0XHRcdG1hcmdpbjogdGhpcy5zdGF0ZS5tYXJnaW4sXG5cdFx0XHRcdFx0XHRcdHRyYW5zaXRpb246ICdhbGwgLjFzJyxcblx0XHRcdFx0XHRcdFx0ZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG5cdFx0XHRcdFx0XHR9fVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGhpcy5wcm9wcy5jb250ZW50ID8gXG5cdFx0XHRcdFx0XHRcdDxmaWdjYXB0aW9uXG5cdFx0XHRcdFx0XHRcdFx0Y2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5maWdjYXB0aW9uKX1cblx0XHRcdFx0XHRcdFx0XHRzdHlsZT17e1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGlzcGxheTogIXRoaXMuc3RhdGUuaXNab29tZWQgPyAnaW5saW5lLWJsb2NrJyA6ICdub25lJyxcblx0XHRcdFx0XHRcdFx0XHR9fVxuXHRcdFx0XHRcdFx0XHRcdG9uQ2xpY2s9e3RoaXMuZXZlbnRQcmV2ZW50RGVmYXVsdH1cblx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdHt0aGlzLnByb3BzLmNoaWxkcmVufVxuXHRcdFx0XHRcdFx0XHQ8L2ZpZ2NhcHRpb24+XG5cdFx0XHRcdFx0XHQ6ICcnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0PEZvb3RlclxuXHRcdFx0XHRcdGNhcHRpb249e2ltYWdlc1tjdXJyZW50SW1hZ2VdLmNhcHRpb259XG5cdFx0XHRcdFx0Y291bnRDdXJyZW50PXtjdXJyZW50SW1hZ2UgKyAxfVxuXHRcdFx0XHRcdGNvdW50U2VwYXJhdG9yPXtpbWFnZUNvdW50U2VwYXJhdG9yfVxuXHRcdFx0XHRcdGNvdW50VG90YWw9e2ltYWdlcy5sZW5ndGh9XG5cdFx0XHRcdFx0c2hvd0NvdW50PXtzaG93SW1hZ2VDb3VudH1cblx0XHRcdFx0Lz5cblx0XHRcdDwvZmlndXJlPlxuXHRcdCk7XG5cdH1cblx0cmVuZGVyVGh1bWJuYWlscyAoKSB7XG5cdFx0Y29uc3QgeyBpbWFnZXMsIGN1cnJlbnRJbWFnZSwgb25DbGlja1RodW1ibmFpbCwgc2hvd1RodW1ibmFpbHMsIHRodW1ibmFpbE9mZnNldCB9ID0gdGhpcy5wcm9wcztcblxuXHRcdGlmICghc2hvd1RodW1ibmFpbHMpIHJldHVybjtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8UGFnaW5hdGVkVGh1bWJuYWlsc1xuXHRcdFx0XHRjdXJyZW50SW1hZ2U9e2N1cnJlbnRJbWFnZX1cblx0XHRcdFx0aW1hZ2VzPXtpbWFnZXN9XG5cdFx0XHRcdG9mZnNldD17dGh1bWJuYWlsT2Zmc2V0fVxuXHRcdFx0XHRvbkNsaWNrVGh1bWJuYWlsPXtvbkNsaWNrVGh1bWJuYWlsfVxuXHRcdFx0Lz5cblx0XHQpO1xuXHR9XG5cdHJlbmRlciAoKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdDxQb3J0YWw+XG5cdFx0XHRcdHt0aGlzLnJlbmRlckRpYWxvZygpfVxuXHRcdFx0PC9Qb3J0YWw+XG5cdFx0KTtcblx0fVxufVxuXG5MaWdodGJveC5wcm9wVHlwZXMgPSB7XG5cdGJhY2tkcm9wQ2xvc2VzTW9kYWw6IFByb3BUeXBlcy5ib29sLFxuXHRjbG9zZUJ1dHRvblRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuXHRjdXJyZW50SW1hZ2U6IFByb3BUeXBlcy5udW1iZXIsXG5cdGN1c3RvbUNvbnRyb2xzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubm9kZSksXG5cdGVuYWJsZUtleWJvYXJkSW5wdXQ6IFByb3BUeXBlcy5ib29sLFxuXHRpbWFnZUNvdW50U2VwYXJhdG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuXHRpbWFnZXM6IFByb3BUeXBlcy5hcnJheU9mKFxuXHRcdFByb3BUeXBlcy5zaGFwZSh7XG5cdFx0XHRzcmM6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblx0XHRcdHNyY3NldDogUHJvcFR5cGVzLmFycmF5LFxuXHRcdFx0Y2FwdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbUHJvcFR5cGVzLnN0cmluZywgUHJvcFR5cGVzLmVsZW1lbnRdKSxcblx0XHRcdHRodW1ibmFpbDogUHJvcFR5cGVzLnN0cmluZyxcblx0XHR9KVxuXHQpLmlzUmVxdWlyZWQsXG5cdGlzT3BlbjogUHJvcFR5cGVzLmJvb2wsXG5cdGxlZnRBcnJvd1RpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLFxuXHRvbkNsaWNrSW1hZ2U6IFByb3BUeXBlcy5mdW5jLFxuXHRvbkNsaWNrTmV4dDogUHJvcFR5cGVzLmZ1bmMsXG5cdG9uQ2xpY2tQcmV2OiBQcm9wVHlwZXMuZnVuYyxcblx0b25DbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblx0cHJlbG9hZE5leHRJbWFnZTogUHJvcFR5cGVzLmJvb2wsXG5cdHJpZ2h0QXJyb3dUaXRsZTogUHJvcFR5cGVzLnN0cmluZyxcblx0c2hvd0Nsb3NlQnV0dG9uOiBQcm9wVHlwZXMuYm9vbCxcblx0c2hvd0ltYWdlQ291bnQ6IFByb3BUeXBlcy5ib29sLFxuXHRzaG93VGh1bWJuYWlsczogUHJvcFR5cGVzLmJvb2wsXG5cdHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LFxuXHR0aHVtYm5haWxPZmZzZXQ6IFByb3BUeXBlcy5udW1iZXIsXG5cdHdpZHRoOiBQcm9wVHlwZXMubnVtYmVyLFxufTtcbkxpZ2h0Ym94LmRlZmF1bHRQcm9wcyA9IHtcblx0Y2xvc2VCdXR0b25UaXRsZTogJ0Nsb3NlIChFc2MpJyxcblx0cm90YXRlQnV0dG9uVGl0bGU6ICdSb3RhdGUnLFxuXHRjdXJyZW50SW1hZ2U6IDAsXG5cdGVuYWJsZUtleWJvYXJkSW5wdXQ6IHRydWUsXG5cdGltYWdlQ291bnRTZXBhcmF0b3I6ICcgb2YgJyxcblx0bGVmdEFycm93VGl0bGU6ICdQcmV2aW91cyAoTGVmdCBhcnJvdyBrZXkpJyxcblx0b25DbGlja1Nob3dOZXh0SW1hZ2U6IHRydWUsXG5cdHByZWxvYWROZXh0SW1hZ2U6IHRydWUsXG5cdHJpZ2h0QXJyb3dUaXRsZTogJ05leHQgKFJpZ2h0IGFycm93IGtleSknLFxuXHRzaG93Q2xvc2VCdXR0b246IHRydWUsXG5cdHNob3dJbWFnZUNvdW50OiB0cnVlLFxuXHRzaG93Um90YXRlQnV0dG9uOiB0cnVlLFxuXHR0aGVtZToge30sXG5cdHRodW1ibmFpbE9mZnNldDogMixcblx0d2lkdGg6IDEwMjQsXG5cdHpvb206IGZhbHNlLFxuXHRjb250ZW50OiBmYWxzZSxcbn07XG5MaWdodGJveC5jaGlsZENvbnRleHRUeXBlcyA9IHtcblx0dGhlbWU6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG5cbmNvbnN0IGNsYXNzZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZSh7XG5cdGNvbnRlbnQ6IHtcblx0XHRwb3NpdGlvbjogJ3JlbGF0aXZlJyxcblx0fSxcblx0ZmlndXJlOiB7XG5cdFx0bWFyZ2luOiAwLCAvLyByZW1vdmUgYnJvd3NlciBkZWZhdWx0XG5cdH0sXG5cdGltYWdlV3JhcHBlcjoge1xuXHRcdGRpc3BsYXk6ICdmbGV4Jyxcblx0XHRhbGlnbkl0ZW1zOiAnY2VudGVyJyxcblx0XHRqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG5cdFx0YmFja2dyb3VuZDogJyMwMDAnLFxuXHR9LFxuXHRpbWFnZToge1xuXHRcdGRpc3BsYXk6ICdibG9jaycsIC8vIHJlbW92ZXMgYnJvd3NlciBkZWZhdWx0IGd1dHRlclxuXHRcdGhlaWdodDogJ2F1dG8nLFxuXHRcdG1hcmdpbjogJzAgYXV0bycsIC8vIG1haW50YWluIGNlbnRlciBvbiB2ZXJ5IHNob3J0IHNjcmVlbnMgT1IgdmVyeSBuYXJyb3cgaW1hZ2Vcblx0XHRtYXhXaWR0aDogJzEwMCUnLFxuXG5cdFx0Ly8gZGlzYWJsZSB1c2VyIHNlbGVjdFxuXHRcdFdlYmtpdFRvdWNoQ2FsbG91dDogJ25vbmUnLFxuXHRcdHVzZXJTZWxlY3Q6ICdub25lJyxcblx0fSxcblx0ZmlnY2FwdGlvbjoge1xuXHRcdGJhY2tncm91bmQ6ICcjZmZmJyxcblx0XHR3aWR0aDogJzQ1MHB4Jyxcblx0XHR2ZXJ0aWNhbEFsaWduOiAndG9wJyxcblx0XHRoZWlnaHQ6ICc2MzBweCcsXG5cdFx0b3ZlcmZsb3c6ICdhdXRvJyxcblx0fSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBMaWdodGJveDtcbiJdfQ==
