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

var _reactScrolllock = require('react-scrolllock');

var _reactScrolllock2 = _interopRequireDefault(_reactScrolllock);

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
				this.renderArrowNext(),
				_react2['default'].createElement(_reactScrolllock2['default'], null)
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

},{"./components/Arrow":33,"./components/Container":34,"./components/Footer":35,"./components/Header":36,"./components/PaginatedThumbnails":38,"./components/Portal":40,"./theme":47,"./utils":51,"aphrodite/no-important":8,"prop-types":undefined,"react":undefined,"react-scrolllock":undefined}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL2xpYi9leHBvcnRzLmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvZ2VuZXJhdGUuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL2xpYi9pbmplY3QuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL2xpYi9uby1pbXBvcnRhbnQuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL2xpYi9vcmRlcmVkLWVsZW1lbnRzLmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvc3RhdGljUHJlZml4RGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9hcGhyb2RpdGUvbGliL3V0aWwuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL25vLWltcG9ydGFudC5qcyIsIm5vZGVfbW9kdWxlcy9hc2FwL2Jyb3dzZXItYXNhcC5qcyIsIm5vZGVfbW9kdWxlcy9hc2FwL2Jyb3dzZXItcmF3LmpzIiwibm9kZV9tb2R1bGVzL2Nzcy1pbi1qcy11dGlscy9saWIvaHlwaGVuYXRlUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUuanMiLCJub2RlX21vZHVsZXMvaHlwaGVuYXRlLXN0eWxlLW5hbWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9jcmVhdGVQcmVmaXhlci5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvY2FsYy5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvY3Jvc3NGYWRlLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9jdXJzb3IuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2ZpbHRlci5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZmxleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZmxleGJveElFLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9mbGV4Ym94T2xkLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9ncmFkaWVudC5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvaW1hZ2VTZXQuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL3Bvc2l0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9zaXppbmcuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL3RyYW5zaXRpb24uanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3V0aWxzL2FkZE5ld1ZhbHVlc09ubHkuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3V0aWxzL2NhcGl0YWxpemVTdHJpbmcuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3V0aWxzL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci91dGlscy9wcmVmaXhQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvdXRpbHMvcHJlZml4VmFsdWUuanMiLCJub2RlX21vZHVsZXMvc3RyaW5nLWhhc2gvaW5kZXguanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2NvbXBvbmVudHMvQXJyb3cuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2NvbXBvbmVudHMvQ29udGFpbmVyLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9jb21wb25lbnRzL0Zvb3Rlci5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvY29tcG9uZW50cy9IZWFkZXIuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2NvbXBvbmVudHMvSWNvbi5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvY29tcG9uZW50cy9QYWdpbmF0ZWRUaHVtYm5haWxzLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9jb21wb25lbnRzL1Bhc3NDb250ZXh0LmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9jb21wb25lbnRzL1BvcnRhbC5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvY29tcG9uZW50cy9UaHVtYm5haWwuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2ljb25zL2Fycm93TGVmdC5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvaWNvbnMvYXJyb3dSaWdodC5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvaWNvbnMvY2xvc2UuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2ljb25zL2luZGV4LmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9pY29ucy9yb3RhdGUuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL3RoZW1lLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy91dGlscy9iaW5kRnVuY3Rpb25zLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy91dGlscy9jYW5Vc2VEb20uanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL3V0aWxzL2RlZXBNZXJnZS5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvdXRpbHMvaW5kZXguanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL0xpZ2h0Ym94LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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SUFBSTtBQUN0QixNQUFLLEVBQUUsRUFBRTtBQUNULGdCQUFlLEVBQUUsQ0FBQztBQUNsQixNQUFLLEVBQUUsSUFBSTtBQUNYLEtBQUksRUFBRSxLQUFLO0FBQ1gsUUFBTyxFQUFFLEtBQUs7Q0FDZCxDQUFDO0FBQ0YsUUFBUSxDQUFDLGlCQUFpQixHQUFHO0FBQzVCLE1BQUssRUFBRSx1QkFBVSxNQUFNLENBQUMsVUFBVTtDQUNsQyxDQUFDOztBQUVGLElBQU0sT0FBTyxHQUFHLGlDQUFXLE1BQU0sQ0FBQztBQUNqQyxRQUFPLEVBQUU7QUFDUixVQUFRLEVBQUUsVUFBVTtFQUNwQjtBQUNELE9BQU0sRUFBRTtBQUNQLFFBQU0sRUFBRSxDQUFDLEVBQ1Q7O0FBQ0QsYUFBWSxFQUFFO0FBQ2IsU0FBTyxFQUFFLE1BQU07QUFDZixZQUFVLEVBQUUsUUFBUTtBQUNwQixnQkFBYyxFQUFFLFFBQVE7QUFDeEIsWUFBVSxFQUFFLE1BQU07RUFDbEI7QUFDRCxNQUFLLEVBQUU7QUFDTixTQUFPLEVBQUUsT0FBTztBQUNoQixRQUFNLEVBQUUsTUFBTTtBQUNkLFFBQU0sRUFBRSxRQUFRO0FBQ2hCLFVBQVEsRUFBRSxNQUFNOzs7QUFHaEIsb0JBQWtCLEVBQUUsTUFBTTtBQUMxQixZQUFVLEVBQUUsTUFBTTtFQUNsQjtBQUNELFdBQVUsRUFBRTtBQUNYLFlBQVUsRUFBRSxNQUFNO0FBQ2xCLE9BQUssRUFBRSxPQUFPO0FBQ2QsZUFBYSxFQUFFLEtBQUs7QUFDcEIsUUFBTSxFQUFFLE9BQU87QUFDZixVQUFRLEVBQUUsTUFBTTtFQUNoQjtDQUNELENBQUMsQ0FBQzs7cUJBRVksUUFBUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfc2xpY2VkVG9BcnJheSA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pWydyZXR1cm4nXSkgX2lbJ3JldHVybiddKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfSByZXR1cm4gZnVuY3Rpb24gKGFyciwgaSkgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IHJldHVybiBhcnI7IH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSB7IHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7IH0gZWxzZSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UnKTsgfSB9OyB9KSgpO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIF9pbmplY3QgPSByZXF1aXJlKCcuL2luamVjdCcpO1xuXG4vKiA6OlxuaW1wb3J0IHR5cGUgeyBTZWxlY3RvckhhbmRsZXIgfSBmcm9tICcuL2dlbmVyYXRlLmpzJztcbmV4cG9ydCB0eXBlIFNoZWV0RGVmaW5pdGlvbiA9IHsgW2lkOnN0cmluZ106IGFueSB9O1xuZXhwb3J0IHR5cGUgU2hlZXREZWZpbml0aW9ucyA9IFNoZWV0RGVmaW5pdGlvbiB8IFNoZWV0RGVmaW5pdGlvbltdO1xudHlwZSBSZW5kZXJGdW5jdGlvbiA9ICgpID0+IHN0cmluZztcbnR5cGUgRXh0ZW5zaW9uID0ge1xuICAgIHNlbGVjdG9ySGFuZGxlcjogU2VsZWN0b3JIYW5kbGVyXG59O1xuZXhwb3J0IHR5cGUgTWF5YmVTaGVldERlZmluaXRpb24gPSBTaGVldERlZmluaXRpb24gfCBmYWxzZSB8IG51bGwgfCB2b2lkXG4qL1xuXG52YXIgU3R5bGVTaGVldCA9IHtcbiAgICBjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZShzaGVldERlZmluaXRpb24gLyogOiBTaGVldERlZmluaXRpb24gKi8pIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXRpbC5tYXBPYmopKHNoZWV0RGVmaW5pdGlvbiwgZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgICAgIHZhciBfcmVmMiA9IF9zbGljZWRUb0FycmF5KF9yZWYsIDIpO1xuXG4gICAgICAgICAgICB2YXIga2V5ID0gX3JlZjJbMF07XG4gICAgICAgICAgICB2YXIgdmFsID0gX3JlZjJbMV07XG5cbiAgICAgICAgICAgIHJldHVybiBba2V5LCB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyhlbWlseSk6IE1ha2UgYSAncHJvZHVjdGlvbicgbW9kZSB3aGljaCBkb2Vzbid0IHByZXBlbmRcbiAgICAgICAgICAgICAgICAvLyB0aGUgY2xhc3MgbmFtZSBoZXJlLCB0byBtYWtlIHRoZSBnZW5lcmF0ZWQgQ1NTIHNtYWxsZXIuXG4gICAgICAgICAgICAgICAgX25hbWU6IGtleSArICdfJyArICgwLCBfdXRpbC5oYXNoT2JqZWN0KSh2YWwpLFxuICAgICAgICAgICAgICAgIF9kZWZpbml0aW9uOiB2YWxcbiAgICAgICAgICAgIH1dO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVoeWRyYXRlOiBmdW5jdGlvbiByZWh5ZHJhdGUoKSB7XG4gICAgICAgIHZhciByZW5kZXJlZENsYXNzTmFtZXMgLyogOiBzdHJpbmdbXSAqLyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzBdO1xuXG4gICAgICAgICgwLCBfaW5qZWN0LmFkZFJlbmRlcmVkQ2xhc3NOYW1lcykocmVuZGVyZWRDbGFzc05hbWVzKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFV0aWxpdGllcyBmb3IgdXNpbmcgQXBocm9kaXRlIHNlcnZlci1zaWRlLlxuICovXG52YXIgU3R5bGVTaGVldFNlcnZlciA9IHtcbiAgICByZW5kZXJTdGF0aWM6IGZ1bmN0aW9uIHJlbmRlclN0YXRpYyhyZW5kZXJGdW5jIC8qIDogUmVuZGVyRnVuY3Rpb24gKi8pIHtcbiAgICAgICAgKDAsIF9pbmplY3QucmVzZXQpKCk7XG4gICAgICAgICgwLCBfaW5qZWN0LnN0YXJ0QnVmZmVyaW5nKSgpO1xuICAgICAgICB2YXIgaHRtbCA9IHJlbmRlckZ1bmMoKTtcbiAgICAgICAgdmFyIGNzc0NvbnRlbnQgPSAoMCwgX2luamVjdC5mbHVzaFRvU3RyaW5nKSgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBodG1sOiBodG1sLFxuICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDogY3NzQ29udGVudCxcbiAgICAgICAgICAgICAgICByZW5kZXJlZENsYXNzTmFtZXM6ICgwLCBfaW5qZWN0LmdldFJlbmRlcmVkQ2xhc3NOYW1lcykoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn07XG5cbi8qKlxuICogVXRpbGl0aWVzIGZvciB1c2luZyBBcGhyb2RpdGUgaW4gdGVzdHMuXG4gKlxuICogTm90IG1lYW50IHRvIGJlIHVzZWQgaW4gcHJvZHVjdGlvbi5cbiAqL1xudmFyIFN0eWxlU2hlZXRUZXN0VXRpbHMgPSB7XG4gICAgLyoqXG4gICAgICogUHJldmVudCBzdHlsZXMgZnJvbSBiZWluZyBpbmplY3RlZCBpbnRvIHRoZSBET00uXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHVzZWZ1bCBpbiBzaXR1YXRpb25zIHdoZXJlIHlvdSdkIGxpa2UgdG8gdGVzdCByZW5kZXJpbmcgVUlcbiAgICAgKiBjb21wb25lbnRzIHdoaWNoIHVzZSBBcGhyb2RpdGUgd2l0aG91dCBhbnkgb2YgdGhlIHNpZGUtZWZmZWN0cyBvZlxuICAgICAqIEFwaHJvZGl0ZSBoYXBwZW5pbmcuIFBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHRlc3RpbmcgdGhlIG91dHB1dCBvZlxuICAgICAqIGNvbXBvbmVudHMgd2hlbiB5b3UgaGF2ZSBubyBET00sIGUuZy4gdGVzdGluZyBpbiBOb2RlIHdpdGhvdXQgYSBmYWtlIERPTS5cbiAgICAgKlxuICAgICAqIFNob3VsZCBiZSBwYWlyZWQgd2l0aCBhIHN1YnNlcXVlbnQgY2FsbCB0b1xuICAgICAqIGNsZWFyQnVmZmVyQW5kUmVzdW1lU3R5bGVJbmplY3Rpb24uXG4gICAgICovXG4gICAgc3VwcHJlc3NTdHlsZUluamVjdGlvbjogZnVuY3Rpb24gc3VwcHJlc3NTdHlsZUluamVjdGlvbigpIHtcbiAgICAgICAgKDAsIF9pbmplY3QucmVzZXQpKCk7XG4gICAgICAgICgwLCBfaW5qZWN0LnN0YXJ0QnVmZmVyaW5nKSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBPcHBvc2l0ZSBtZXRob2Qgb2YgcHJldmVudFN0eWxlSW5qZWN0LlxuICAgICAqL1xuICAgIGNsZWFyQnVmZmVyQW5kUmVzdW1lU3R5bGVJbmplY3Rpb246IGZ1bmN0aW9uIGNsZWFyQnVmZmVyQW5kUmVzdW1lU3R5bGVJbmplY3Rpb24oKSB7XG4gICAgICAgICgwLCBfaW5qZWN0LnJlc2V0KSgpO1xuICAgIH1cbn07XG5cbi8qKlxuICogR2VuZXJhdGUgdGhlIEFwaHJvZGl0ZSBBUEkgZXhwb3J0cywgd2l0aCBnaXZlbiBgc2VsZWN0b3JIYW5kbGVyc2AgYW5kXG4gKiBgdXNlSW1wb3J0YW50YCBzdGF0ZS5cbiAqL1xudmFyIG1ha2VFeHBvcnRzID0gZnVuY3Rpb24gbWFrZUV4cG9ydHModXNlSW1wb3J0YW50LCAvKiA6IGJvb2xlYW4gKi9cbnNlbGVjdG9ySGFuZGxlcnMgLyogOiBTZWxlY3RvckhhbmRsZXJbXSAqL1xuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgU3R5bGVTaGVldDogX2V4dGVuZHMoe30sIFN0eWxlU2hlZXQsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZXR1cm5zIGEgdmVyc2lvbiBvZiB0aGUgZXhwb3J0cyBvZiBBcGhyb2RpdGUgKGkuZS4gYW4gb2JqZWN0XG4gICAgICAgICAgICAgKiB3aXRoIGBjc3NgIGFuZCBgU3R5bGVTaGVldGAgcHJvcGVydGllcykgd2hpY2ggaGF2ZSBzb21lXG4gICAgICAgICAgICAgKiBleHRlbnNpb25zIGluY2x1ZGVkLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGV4dGVuc2lvbnM6IEFuIGFycmF5IG9mIGV4dGVuc2lvbnMgdG9cbiAgICAgICAgICAgICAqICAgICBhZGQgdG8gdGhpcyBpbnN0YW5jZSBvZiBBcGhyb2RpdGUuIEVhY2ggb2JqZWN0IHNob3VsZCBoYXZlIGFcbiAgICAgICAgICAgICAqICAgICBzaW5nbGUgcHJvcGVydHkgb24gaXQsIGRlZmluaW5nIHdoaWNoIGtpbmQgb2YgZXh0ZW5zaW9uIHRvXG4gICAgICAgICAgICAgKiAgICAgYWRkLlxuICAgICAgICAgICAgICogQHBhcmFtIHtTZWxlY3RvckhhbmRsZXJ9IFtleHRlbnNpb25zW10uc2VsZWN0b3JIYW5kbGVyXTogQVxuICAgICAgICAgICAgICogICAgIHNlbGVjdG9yIGhhbmRsZXIgZXh0ZW5zaW9uLiBTZWUgYGRlZmF1bHRTZWxlY3RvckhhbmRsZXJzYCBpblxuICAgICAgICAgICAgICogICAgIGdlbmVyYXRlLmpzLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBleHBvcnRzIG9mIHRoZSBuZXdcbiAgICAgICAgICAgICAqICAgICBpbnN0YW5jZSBvZiBBcGhyb2RpdGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGV4dGVuZDogZnVuY3Rpb24gZXh0ZW5kKGV4dGVuc2lvbnMgLyogOiBFeHRlbnNpb25bXSAqLykge1xuICAgICAgICAgICAgICAgIHZhciBleHRlbnNpb25TZWxlY3RvckhhbmRsZXJzID0gZXh0ZW5zaW9uc1xuICAgICAgICAgICAgICAgIC8vIFB1bGwgb3V0IGV4dGVuc2lvbnMgd2l0aCBhIHNlbGVjdG9ySGFuZGxlciBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGV4dGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0ZW5zaW9uLnNlbGVjdG9ySGFuZGxlcjtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBudWxscyAoaS5lLiBleHRlbnNpb25zIHdpdGhvdXQgYSBzZWxlY3RvckhhbmRsZXJcbiAgICAgICAgICAgICAgICAvLyBwcm9wZXJ0eSkuXG4gICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBtYWtlRXhwb3J0cyh1c2VJbXBvcnRhbnQsIHNlbGVjdG9ySGFuZGxlcnMuY29uY2F0KGV4dGVuc2lvblNlbGVjdG9ySGFuZGxlcnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksXG5cbiAgICAgICAgU3R5bGVTaGVldFNlcnZlcjogU3R5bGVTaGVldFNlcnZlcixcbiAgICAgICAgU3R5bGVTaGVldFRlc3RVdGlsczogU3R5bGVTaGVldFRlc3RVdGlscyxcblxuICAgICAgICBjc3M6IGZ1bmN0aW9uIGNzcygpIC8qIDogTWF5YmVTaGVldERlZmluaXRpb25bXSAqL3tcbiAgICAgICAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBzdHlsZURlZmluaXRpb25zID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgICAgICAgICAgc3R5bGVEZWZpbml0aW9uc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICgwLCBfaW5qZWN0LmluamVjdEFuZEdldENsYXNzTmFtZSkodXNlSW1wb3J0YW50LCBzdHlsZURlZmluaXRpb25zLCBzZWxlY3RvckhhbmRsZXJzKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VFeHBvcnRzOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2lubGluZVN0eWxlUHJlZml4ZXJTdGF0aWNDcmVhdGVQcmVmaXhlciA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvY3JlYXRlUHJlZml4ZXInKTtcblxudmFyIF9pbmxpbmVTdHlsZVByZWZpeGVyU3RhdGljQ3JlYXRlUHJlZml4ZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5saW5lU3R5bGVQcmVmaXhlclN0YXRpY0NyZWF0ZVByZWZpeGVyKTtcblxudmFyIF9saWJTdGF0aWNQcmVmaXhEYXRhID0gcmVxdWlyZSgnLi4vbGliL3N0YXRpY1ByZWZpeERhdGEnKTtcblxudmFyIF9saWJTdGF0aWNQcmVmaXhEYXRhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpYlN0YXRpY1ByZWZpeERhdGEpO1xuXG52YXIgX29yZGVyZWRFbGVtZW50cyA9IHJlcXVpcmUoJy4vb3JkZXJlZC1lbGVtZW50cycpO1xuXG52YXIgX29yZGVyZWRFbGVtZW50czIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vcmRlcmVkRWxlbWVudHMpO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIHByZWZpeEFsbCA9ICgwLCBfaW5saW5lU3R5bGVQcmVmaXhlclN0YXRpY0NyZWF0ZVByZWZpeGVyMlsnZGVmYXVsdCddKShfbGliU3RhdGljUHJlZml4RGF0YTJbJ2RlZmF1bHQnXSk7XG5cbi8qIDo6XG5pbXBvcnQgdHlwZSB7IFNoZWV0RGVmaW5pdGlvbiB9IGZyb20gJy4vaW5kZXguanMnO1xudHlwZSBTdHJpbmdIYW5kbGVycyA9IHsgW2lkOnN0cmluZ106IEZ1bmN0aW9uIH07XG50eXBlIFNlbGVjdG9yQ2FsbGJhY2sgPSAoc2VsZWN0b3I6IHN0cmluZykgPT4gYW55O1xuZXhwb3J0IHR5cGUgU2VsZWN0b3JIYW5kbGVyID0gKFxuICAgIHNlbGVjdG9yOiBzdHJpbmcsXG4gICAgYmFzZVNlbGVjdG9yOiBzdHJpbmcsXG4gICAgY2FsbGJhY2s6IFNlbGVjdG9yQ2FsbGJhY2tcbikgPT4gc3RyaW5nIHwgbnVsbDtcbiovXG5cbi8qKlxuICogYHNlbGVjdG9ySGFuZGxlcnNgIGFyZSBmdW5jdGlvbnMgd2hpY2ggaGFuZGxlIHNwZWNpYWwgc2VsZWN0b3JzIHdoaWNoIGFjdFxuICogZGlmZmVyZW50bHkgdGhhbiBub3JtYWwgc3R5bGUgZGVmaW5pdGlvbnMuIFRoZXNlIGZ1bmN0aW9ucyBsb29rIGF0IHRoZVxuICogY3VycmVudCBzZWxlY3RvciBhbmQgY2FuIGdlbmVyYXRlIENTUyBmb3IgdGhlIHN0eWxlcyBpbiB0aGVpciBzdWJ0cmVlIGJ5XG4gKiBjYWxsaW5nIHRoZSBjYWxsYmFjayB3aXRoIGEgbmV3IHNlbGVjdG9yLlxuICpcbiAqIEZvciBleGFtcGxlLCB3aGVuIGdlbmVyYXRpbmcgc3R5bGVzIHdpdGggYSBiYXNlIHNlbGVjdG9yIG9mICcuZm9vJyBhbmQgdGhlXG4gKiBmb2xsb3dpbmcgc3R5bGVzIG9iamVjdDpcbiAqXG4gKiAgIHtcbiAqICAgICAnOm50aC1jaGlsZCgybiknOiB7XG4gKiAgICAgICAnOmhvdmVyJzoge1xuICogICAgICAgICBjb2xvcjogJ3JlZCdcbiAqICAgICAgIH1cbiAqICAgICB9XG4gKiAgIH1cbiAqXG4gKiB3aGVuIHdlIHJlYWNoIHRoZSAnOmhvdmVyJyBzdHlsZSwgd2Ugd291bGQgY2FsbCBvdXIgc2VsZWN0b3IgaGFuZGxlcnMgbGlrZVxuICpcbiAqICAgaGFuZGxlcignOmhvdmVyJywgJy5mb286bnRoLWNoaWxkKDJuKScsIGNhbGxiYWNrKVxuICpcbiAqIFNpbmNlIG91ciBgcHNldWRvU2VsZWN0b3JzYCBoYW5kbGVzICc6aG92ZXInIHN0eWxlcywgdGhhdCBoYW5kbGVyIHdvdWxkIGNhbGxcbiAqIHRoZSBjYWxsYmFjayBsaWtlXG4gKlxuICogICBjYWxsYmFjaygnLmZvbzpudGgtY2hpbGQoMm4pOmhvdmVyJylcbiAqXG4gKiB0byBnZW5lcmF0ZSBpdHMgc3VidHJlZSBgeyBjb2xvcjogJ3JlZCcgfWAgc3R5bGVzIHdpdGggYVxuICogJy5mb286bnRoLWNoaWxkKDJuKTpob3Zlcicgc2VsZWN0b3IuIFRoZSBjYWxsYmFjayB3b3VsZCByZXR1cm4gQ1NTIGxpa2VcbiAqXG4gKiAgICcuZm9vOm50aC1jaGlsZCgybik6aG92ZXJ7Y29sb3I6cmVkICFpbXBvcnRhbnQ7fSdcbiAqXG4gKiBhbmQgdGhlIGhhbmRsZXIgd291bGQgdGhlbiByZXR1cm4gdGhhdCByZXN1bHRpbmcgQ1NTLlxuICpcbiAqIGBkZWZhdWx0U2VsZWN0b3JIYW5kbGVyc2AgaXMgdGhlIGxpc3Qgb2YgZGVmYXVsdCBoYW5kbGVycyB1c2VkIGluIGEgY2FsbCB0b1xuICogYGdlbmVyYXRlQ1NTYC5cbiAqXG4gKiBAbmFtZSBTZWxlY3RvckhhbmRsZXJcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yOiBUaGUgY3VycmVudGx5IGluc3BlY3RlZCBzZWxlY3Rvci4gJzpob3ZlcicgaW4gdGhlXG4gKiAgICAgZXhhbXBsZSBhYm92ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlU2VsZWN0b3I6IFRoZSBzZWxlY3RvciBvZiB0aGUgcGFyZW50IHN0eWxlcy5cbiAqICAgICAnLmZvbzpudGgtY2hpbGQoMm4pJyBpbiB0aGUgZXhhbXBsZSBhYm92ZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGdlbmVyYXRlU3VidHJlZVN0eWxlczogQSBmdW5jdGlvbiB3aGljaCBjYW4gYmUgY2FsbGVkIHRvXG4gKiAgICAgZ2VuZXJhdGUgQ1NTIGZvciB0aGUgc3VidHJlZSBvZiBzdHlsZXMgY29ycmVzcG9uZGluZyB0byB0aGUgc2VsZWN0b3IuXG4gKiAgICAgQWNjZXB0cyBhIG5ldyBiYXNlU2VsZWN0b3IgdG8gdXNlIGZvciBnZW5lcmF0aW5nIHRob3NlIHN0eWxlcy5cbiAqIEByZXR1cm5zIHs/c3RyaW5nfSBUaGUgZ2VuZXJhdGVkIENTUyBmb3IgdGhpcyBzZWxlY3Rvciwgb3IgbnVsbCBpZiB3ZSBkb24ndFxuICogICAgIGhhbmRsZSB0aGlzIHNlbGVjdG9yLlxuICovXG52YXIgZGVmYXVsdFNlbGVjdG9ySGFuZGxlcnMgPSBbXG4vLyBIYW5kbGUgcHNldWRvLXNlbGVjdG9ycywgbGlrZSA6aG92ZXIgYW5kIDpudGgtY2hpbGQoM24pXG5mdW5jdGlvbiBwc2V1ZG9TZWxlY3RvcnMoc2VsZWN0b3IsIC8qIDogc3RyaW5nICovXG5iYXNlU2VsZWN0b3IsIC8qIDogc3RyaW5nICovXG5nZW5lcmF0ZVN1YnRyZWVTdHlsZXMgLyogOiBGdW5jdGlvbiAqL1xuKSAvKiAqL3tcbiAgICBpZiAoc2VsZWN0b3JbMF0gIT09IFwiOlwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZ2VuZXJhdGVTdWJ0cmVlU3R5bGVzKGJhc2VTZWxlY3RvciArIHNlbGVjdG9yKTtcbn0sXG5cbi8vIEhhbmRsZSBtZWRpYSBxdWVyaWVzIChvciBmb250LWZhY2VzKVxuZnVuY3Rpb24gbWVkaWFRdWVyaWVzKHNlbGVjdG9yLCAvKiA6IHN0cmluZyAqL1xuYmFzZVNlbGVjdG9yLCAvKiA6IHN0cmluZyAqL1xuZ2VuZXJhdGVTdWJ0cmVlU3R5bGVzIC8qIDogRnVuY3Rpb24gKi9cbikgLyogKi97XG4gICAgaWYgKHNlbGVjdG9yWzBdICE9PSBcIkBcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8gR2VuZXJhdGUgdGhlIHN0eWxlcyBub3JtYWxseSwgYW5kIHRoZW4gd3JhcCB0aGVtIGluIHRoZSBtZWRpYSBxdWVyeS5cbiAgICB2YXIgZ2VuZXJhdGVkID0gZ2VuZXJhdGVTdWJ0cmVlU3R5bGVzKGJhc2VTZWxlY3Rvcik7XG4gICAgcmV0dXJuIHNlbGVjdG9yICsgJ3snICsgZ2VuZXJhdGVkICsgJ30nO1xufV07XG5cbmV4cG9ydHMuZGVmYXVsdFNlbGVjdG9ySGFuZGxlcnMgPSBkZWZhdWx0U2VsZWN0b3JIYW5kbGVycztcbi8qKlxuICogR2VuZXJhdGUgQ1NTIGZvciBhIHNlbGVjdG9yIGFuZCBzb21lIHN0eWxlcy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGhhbmRsZXMgdGhlIG1lZGlhIHF1ZXJpZXMgYW5kIHBzZXVkbyBzZWxlY3RvcnMgdGhhdCBjYW4gYmUgdXNlZFxuICogaW4gYXBocm9kaXRlIHN0eWxlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3I6IEEgYmFzZSBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzdHlsZXMgdG8gYmUgZ2VuZXJhdGVkXG4gKiAgICAgd2l0aC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVR5cGVzOiBBIGxpc3Qgb2YgcHJvcGVydGllcyBvZiB0aGUgcmV0dXJuIHR5cGUgb2ZcbiAqICAgICBTdHlsZVNoZWV0LmNyZWF0ZSwgZS5nLiBbc3R5bGVzLnJlZCwgc3R5bGVzLmJsdWVdLlxuICogQHBhcmFtIHtBcnJheS48U2VsZWN0b3JIYW5kbGVyPn0gc2VsZWN0b3JIYW5kbGVyczogQSBsaXN0IG9mIHNlbGVjdG9yXG4gKiAgICAgaGFuZGxlcnMgdG8gdXNlIGZvciBoYW5kbGluZyBzcGVjaWFsIHNlbGVjdG9ycy4gU2VlXG4gKiAgICAgYGRlZmF1bHRTZWxlY3RvckhhbmRsZXJzYC5cbiAqIEBwYXJhbSBzdHJpbmdIYW5kbGVyczogU2VlIGBnZW5lcmF0ZUNTU1J1bGVzZXRgXG4gKiBAcGFyYW0gdXNlSW1wb3J0YW50OiBTZWUgYGdlbmVyYXRlQ1NTUnVsZXNldGBcbiAqXG4gKiBUbyBhY3R1YWxseSBnZW5lcmF0ZSB0aGUgQ1NTIHNwZWNpYWwtY29uc3RydWN0LWxlc3Mgc3R5bGVzIGFyZSBwYXNzZWQgdG9cbiAqIGBnZW5lcmF0ZUNTU1J1bGVzZXRgLlxuICpcbiAqIEZvciBpbnN0YW5jZSwgYSBjYWxsIHRvXG4gKlxuICogICAgIGdlbmVyYXRlQ1NTKFwiLmZvb1wiLCBbe1xuICogICAgICAgY29sb3I6IFwicmVkXCIsXG4gKiAgICAgICBcIkBtZWRpYSBzY3JlZW5cIjoge1xuICogICAgICAgICBoZWlnaHQ6IDIwLFxuICogICAgICAgICBcIjpob3ZlclwiOiB7XG4gKiAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCJcbiAqICAgICAgICAgfVxuICogICAgICAgfSxcbiAqICAgICAgIFwiOmFjdGl2ZVwiOiB7XG4gKiAgICAgICAgIGZvbnRXZWlnaHQ6IFwiYm9sZFwiXG4gKiAgICAgICB9XG4gKiAgICAgfV0sIGRlZmF1bHRTZWxlY3RvckhhbmRsZXJzKTtcbiAqXG4gKiB3aXRoIHRoZSBkZWZhdWx0IGBzZWxlY3RvckhhbmRsZXJzYCB3aWxsIG1ha2UgNSBjYWxscyB0b1xuICogYGdlbmVyYXRlQ1NTUnVsZXNldGA6XG4gKlxuICogICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5mb29cIiwgeyBjb2xvcjogXCJyZWRcIiB9LCAuLi4pXG4gKiAgICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmZvbzphY3RpdmVcIiwgeyBmb250V2VpZ2h0OiBcImJvbGRcIiB9LCAuLi4pXG4gKiAgICAgLy8gVGhlc2UgMiB3aWxsIGJlIHdyYXBwZWQgaW4gQG1lZGlhIHNjcmVlbiB7fVxuICogICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5mb29cIiwgeyBoZWlnaHQ6IDIwIH0sIC4uLilcbiAqICAgICBnZW5lcmF0ZUNTU1J1bGVzZXQoXCIuZm9vOmhvdmVyXCIsIHsgYmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCIgfSwgLi4uKVxuICovXG52YXIgZ2VuZXJhdGVDU1MgPSBmdW5jdGlvbiBnZW5lcmF0ZUNTUyhzZWxlY3RvciwgLyogOiBzdHJpbmcgKi9cbnN0eWxlVHlwZXMsIC8qIDogU2hlZXREZWZpbml0aW9uW10gKi9cbnNlbGVjdG9ySGFuZGxlcnMsIC8qIDogU2VsZWN0b3JIYW5kbGVyW10gKi9cbnN0cmluZ0hhbmRsZXJzLCAvKiA6IFN0cmluZ0hhbmRsZXJzICovXG51c2VJbXBvcnRhbnQgLyogOiBib29sZWFuICovXG4pIC8qIDogc3RyaW5nICove1xuICAgIHZhciBtZXJnZWQgPSBuZXcgX29yZGVyZWRFbGVtZW50czJbJ2RlZmF1bHQnXSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZVR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1lcmdlZC5hZGRTdHlsZVR5cGUoc3R5bGVUeXBlc1tpXSk7XG4gICAgfVxuXG4gICAgdmFyIHBsYWluRGVjbGFyYXRpb25zID0gbmV3IF9vcmRlcmVkRWxlbWVudHMyWydkZWZhdWx0J10oKTtcbiAgICB2YXIgZ2VuZXJhdGVkU3R5bGVzID0gXCJcIjtcblxuICAgIC8vIFRPRE8oZW1pbHkpOiBiZW5jaG1hcmsgdGhpcyB0byBzZWUgaWYgYSBwbGFpbiBmb3IgbG9vcCB3b3VsZCBiZSBmYXN0ZXIuXG4gICAgbWVyZ2VkLmZvckVhY2goZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgICAgIC8vIEZvciBlYWNoIGtleSwgc2VlIGlmIG9uZSBvZiB0aGUgc2VsZWN0b3IgaGFuZGxlcnMgd2lsbCBoYW5kbGUgdGhlc2VcbiAgICAgICAgLy8gc3R5bGVzLlxuICAgICAgICB2YXIgZm91bmRIYW5kbGVyID0gc2VsZWN0b3JIYW5kbGVycy5zb21lKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaGFuZGxlcihrZXksIHNlbGVjdG9yLCBmdW5jdGlvbiAobmV3U2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVDU1MobmV3U2VsZWN0b3IsIFt2YWxdLCBzZWxlY3RvckhhbmRsZXJzLCBzdHJpbmdIYW5kbGVycywgdXNlSW1wb3J0YW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGhhbmRsZXIgcmV0dXJuZWQgc29tZXRoaW5nLCBhZGQgaXQgdG8gdGhlIGdlbmVyYXRlZFxuICAgICAgICAgICAgICAgIC8vIENTUyBhbmQgc3RvcCBsb29raW5nIGZvciBhbm90aGVyIGhhbmRsZXIuXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVkU3R5bGVzICs9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIElmIG5vbmUgb2YgdGhlIGhhbmRsZXJzIGhhbmRsZWQgaXQsIGFkZCBpdCB0byB0aGUgbGlzdCBvZiBwbGFpblxuICAgICAgICAvLyBzdHlsZSBkZWNsYXJhdGlvbnMuXG4gICAgICAgIGlmICghZm91bmRIYW5kbGVyKSB7XG4gICAgICAgICAgICBwbGFpbkRlY2xhcmF0aW9ucy5zZXQoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdGVDU1NSdWxlc2V0KHNlbGVjdG9yLCBwbGFpbkRlY2xhcmF0aW9ucywgc3RyaW5nSGFuZGxlcnMsIHVzZUltcG9ydGFudCwgc2VsZWN0b3JIYW5kbGVycykgKyBnZW5lcmF0ZWRTdHlsZXM7XG59O1xuXG5leHBvcnRzLmdlbmVyYXRlQ1NTID0gZ2VuZXJhdGVDU1M7XG4vKipcbiAqIEhlbHBlciBtZXRob2Qgb2YgZ2VuZXJhdGVDU1NSdWxlc2V0IHRvIGZhY2lsaXRhdGUgY3VzdG9tIGhhbmRsaW5nIG9mIGNlcnRhaW5cbiAqIENTUyBwcm9wZXJ0aWVzLiBVc2VkIGZvciBlLmcuIGZvbnQgZmFtaWxpZXMuXG4gKlxuICogU2VlIGdlbmVyYXRlQ1NTUnVsZXNldCBmb3IgdXNhZ2UgYW5kIGRvY3VtZW50YXRpb24gb2YgcGFyYW1hdGVyIHR5cGVzLlxuICovXG52YXIgcnVuU3RyaW5nSGFuZGxlcnMgPSBmdW5jdGlvbiBydW5TdHJpbmdIYW5kbGVycyhkZWNsYXJhdGlvbnMsIC8qIDogT3JkZXJlZEVsZW1lbnRzICovXG5zdHJpbmdIYW5kbGVycywgLyogOiBTdHJpbmdIYW5kbGVycyAqL1xuc2VsZWN0b3JIYW5kbGVycyAvKiA6IFNlbGVjdG9ySGFuZGxlcltdICovXG4pIC8qIDogT3JkZXJlZEVsZW1lbnRzICove1xuICAgIGlmICghc3RyaW5nSGFuZGxlcnMpIHtcbiAgICAgICAgcmV0dXJuIGRlY2xhcmF0aW9ucztcbiAgICB9XG5cbiAgICB2YXIgc3RyaW5nSGFuZGxlcktleXMgPSBPYmplY3Qua2V5cyhzdHJpbmdIYW5kbGVycyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmdIYW5kbGVyS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0gc3RyaW5nSGFuZGxlcktleXNbaV07XG4gICAgICAgIGlmIChkZWNsYXJhdGlvbnMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIC8vIEEgZGVjbGFyYXRpb24gZXhpc3RzIGZvciB0aGlzIHBhcnRpY3VsYXIgc3RyaW5nIGhhbmRsZXIsIHNvIHdlXG4gICAgICAgICAgICAvLyBuZWVkIHRvIGxldCB0aGUgc3RyaW5nIGhhbmRsZXIgaW50ZXJwcmV0IHRoZSBkZWNsYXJhdGlvbiBmaXJzdFxuICAgICAgICAgICAgLy8gYmVmb3JlIHByb2NlZWRpbmcuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gVE9ETyhlbWlseSk6IFBhc3MgaW4gYSBjYWxsYmFjayB3aGljaCBnZW5lcmF0ZXMgQ1NTLCBzaW1pbGFyIHRvXG4gICAgICAgICAgICAvLyBob3cgb3VyIHNlbGVjdG9yIGhhbmRsZXJzIHdvcmssIGluc3RlYWQgb2YgcGFzc2luZyBpblxuICAgICAgICAgICAgLy8gYHNlbGVjdG9ySGFuZGxlcnNgIGFuZCBoYXZlIHRoZW0gbWFrZSBjYWxscyB0byBgZ2VuZXJhdGVDU1NgXG4gICAgICAgICAgICAvLyB0aGVtc2VsdmVzLiBSaWdodCBub3csIHRoaXMgaXMgaW1wcmFjdGljYWwgYmVjYXVzZSBvdXIgc3RyaW5nXG4gICAgICAgICAgICAvLyBoYW5kbGVycyBhcmUgdmVyeSBzcGVjaWFsaXplZCBhbmQgZG8gY29tcGxleCB0aGluZ3MuXG4gICAgICAgICAgICBkZWNsYXJhdGlvbnMuc2V0KGtleSwgc3RyaW5nSGFuZGxlcnNba2V5XShkZWNsYXJhdGlvbnMuZ2V0KGtleSksIHNlbGVjdG9ySGFuZGxlcnMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWNsYXJhdGlvbnM7XG59O1xuXG52YXIgdHJhbnNmb3JtUnVsZSA9IGZ1bmN0aW9uIHRyYW5zZm9ybVJ1bGUoa2V5LCAvKiA6IHN0cmluZyAqL1xudmFsdWUsIC8qIDogc3RyaW5nICovXG50cmFuc2Zvcm1WYWx1ZSAvKiA6IGZ1bmN0aW9uICovXG4pIHtcbiAgICByZXR1cm4gKC8qIDogc3RyaW5nICovKDAsIF91dGlsLmtlYmFiaWZ5U3R5bGVOYW1lKShrZXkpICsgJzonICsgdHJhbnNmb3JtVmFsdWUoa2V5LCB2YWx1ZSkgKyAnOydcbiAgICApO1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZSBhIENTUyBydWxlc2V0IHdpdGggdGhlIHNlbGVjdG9yIGFuZCBjb250YWluaW5nIHRoZSBkZWNsYXJhdGlvbnMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIGdpdmVuIGRlY2xhcmF0aW9ucyBkb24ndCBjb250YWluIGFueSBzcGVjaWFsXG4gKiBjaGlsZHJlbiAoc3VjaCBhcyBtZWRpYSBxdWVyaWVzLCBwc2V1ZG8tc2VsZWN0b3JzLCBvciBkZXNjZW5kYW50IHN0eWxlcykuXG4gKlxuICogTm90ZSB0aGF0IHRoaXMgbWV0aG9kIGRvZXMgbm90IGRlYWwgd2l0aCBuZXN0aW5nIHVzZWQgZm9yIGUuZy5cbiAqIHBzdWVkby1zZWxlY3RvcnMgb3IgbWVkaWEgcXVlcmllcy4gVGhhdCByZXNwb25zaWJpbGl0eSBpcyBsZWZ0IHRvICB0aGVcbiAqIGBnZW5lcmF0ZUNTU2AgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yOiB0aGUgc2VsZWN0b3IgYXNzb2NpYXRlZCB3aXRoIHRoZSBydWxlc2V0XG4gKiBAcGFyYW0ge09iamVjdH0gZGVjbGFyYXRpb25zOiBhIG1hcCBmcm9tIGNhbWVsQ2FzZWQgQ1NTIHByb3BlcnR5IG5hbWUgdG8gQ1NTXG4gKiAgICAgcHJvcGVydHkgdmFsdWUuXG4gKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCBmdW5jdGlvbj59IHN0cmluZ0hhbmRsZXJzOiBhIG1hcCBmcm9tIGNhbWVsQ2FzZWQgQ1NTXG4gKiAgICAgcHJvcGVydHkgbmFtZSB0byBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgbWFwIHRoZSBnaXZlbiB2YWx1ZSB0byB0aGUgdmFsdWVcbiAqICAgICB0aGF0IGlzIG91dHB1dC5cbiAqIEBwYXJhbSB7Ym9vbH0gdXNlSW1wb3J0YW50OiBBIGJvb2xlYW4gc2F5aW5nIHdoZXRoZXIgdG8gYXBwZW5kIFwiIWltcG9ydGFudFwiXG4gKiAgICAgdG8gZWFjaCBvZiB0aGUgQ1NTIGRlY2xhcmF0aW9ucy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IEEgc3RyaW5nIG9mIHJhdyBDU1MuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmJsYWhcIiwgeyBjb2xvcjogXCJyZWRcIiB9KVxuICogICAgLT4gXCIuYmxhaHtjb2xvcjogcmVkICFpbXBvcnRhbnQ7fVwiXG4gKiAgICBnZW5lcmF0ZUNTU1J1bGVzZXQoXCIuYmxhaFwiLCB7IGNvbG9yOiBcInJlZFwiIH0sIHt9LCBmYWxzZSlcbiAqICAgIC0+IFwiLmJsYWh7Y29sb3I6IHJlZH1cIlxuICogICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmJsYWhcIiwgeyBjb2xvcjogXCJyZWRcIiB9LCB7Y29sb3I6IGMgPT4gYy50b1VwcGVyQ2FzZX0pXG4gKiAgICAtPiBcIi5ibGFoe2NvbG9yOiBSRUR9XCJcbiAqICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5ibGFoOmhvdmVyXCIsIHsgY29sb3I6IFwicmVkXCIgfSlcbiAqICAgIC0+IFwiLmJsYWg6aG92ZXJ7Y29sb3I6IHJlZH1cIlxuICovXG52YXIgZ2VuZXJhdGVDU1NSdWxlc2V0ID0gZnVuY3Rpb24gZ2VuZXJhdGVDU1NSdWxlc2V0KHNlbGVjdG9yLCAvKiA6IHN0cmluZyAqL1xuZGVjbGFyYXRpb25zLCAvKiA6IE9yZGVyZWRFbGVtZW50cyAqL1xuc3RyaW5nSGFuZGxlcnMsIC8qIDogU3RyaW5nSGFuZGxlcnMgKi9cbnVzZUltcG9ydGFudCwgLyogOiBib29sZWFuICovXG5zZWxlY3RvckhhbmRsZXJzIC8qIDogU2VsZWN0b3JIYW5kbGVyW10gKi9cbikgLyogOiBzdHJpbmcgKi97XG4gICAgLy8gTXV0YXRlcyBkZWNsYXJhdGlvbnNcbiAgICBydW5TdHJpbmdIYW5kbGVycyhkZWNsYXJhdGlvbnMsIHN0cmluZ0hhbmRsZXJzLCBzZWxlY3RvckhhbmRsZXJzKTtcblxuICAgIHZhciBvcmlnaW5hbEVsZW1lbnRzID0gX2V4dGVuZHMoe30sIGRlY2xhcmF0aW9ucy5lbGVtZW50cyk7XG5cbiAgICAvLyBOT1RFKGVtaWx5KTogVGhpcyBtdXRhdGVzIGhhbmRsZWREZWNsYXJhdGlvbnMuZWxlbWVudHMuXG4gICAgdmFyIHByZWZpeGVkRWxlbWVudHMgPSBwcmVmaXhBbGwoZGVjbGFyYXRpb25zLmVsZW1lbnRzKTtcblxuICAgIHZhciBlbGVtZW50TmFtZXMgPSBPYmplY3Qua2V5cyhwcmVmaXhlZEVsZW1lbnRzKTtcbiAgICBpZiAoZWxlbWVudE5hbWVzLmxlbmd0aCAhPT0gZGVjbGFyYXRpb25zLmtleU9yZGVyLmxlbmd0aCkge1xuICAgICAgICAvLyBUaGVyZSBhcmUgc29tZSBwcmVmaXhlZCB2YWx1ZXMsIHNvIHdlIG5lZWQgdG8gZmlndXJlIG91dCBob3cgdG8gc29ydFxuICAgICAgICAvLyB0aGVtLlxuICAgICAgICAvL1xuICAgICAgICAvLyBMb29wIHRocm91Z2ggcHJlZml4ZWRFbGVtZW50cywgbG9va2luZyBmb3IgYW55dGhpbmcgdGhhdCBpcyBub3QgaW5cbiAgICAgICAgLy8gc29ydE9yZGVyLCB3aGljaCBtZWFucyBpdCB3YXMgYWRkZWQgYnkgcHJlZml4QWxsLiBUaGlzIG1lYW5zIHRoYXQgd2VcbiAgICAgICAgLy8gbmVlZCB0byBmaWd1cmUgb3V0IHdoZXJlIGl0IHNob3VsZCBhcHBlYXIgaW4gdGhlIHNvcnRPcmRlci5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghb3JpZ2luYWxFbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShlbGVtZW50TmFtZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBlbGVtZW50IGlzIG5vdCBpbiB0aGUgc29ydE9yZGVyLCB3aGljaCBtZWFucyBpdCBpcyBhIHByZWZpeGVkXG4gICAgICAgICAgICAgICAgLy8gdmFsdWUgdGhhdCB3YXMgYWRkZWQgYnkgcHJlZml4QWxsLiBMZXQncyB0cnkgdG8gZmlndXJlIG91dCB3aGVyZSBpdFxuICAgICAgICAgICAgICAgIC8vIGdvZXMuXG4gICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsU3R5bGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnROYW1lc1tpXVswXSA9PT0gJ1cnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBXZWJraXQtcHJlZml4ZWQgc3R5bGUsIGxpa2UgXCJXZWJraXRUcmFuc2l0aW9uXCIuIExldCdzXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgaXRzIG9yaWdpbmFsIHN0eWxlJ3Mgc29ydCBvcmRlci5cbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxTdHlsZSA9IGVsZW1lbnROYW1lc1tpXVs2XS50b0xvd2VyQ2FzZSgpICsgZWxlbWVudE5hbWVzW2ldLnNsaWNlKDcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudE5hbWVzW2ldWzFdID09PSAnbycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIE1vei1wcmVmaXhlZCBzdHlsZSwgbGlrZSBcIk1velRyYW5zaXRpb25cIi4gV2UgY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHNlY29uZCBjaGFyYWN0ZXIgdG8gYXZvaWQgY29sbGlkaW5nIHdpdGggTXMtcHJlZml4ZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGVzLiBMZXQncyBmaW5kIGl0cyBvcmlnaW5hbCBzdHlsZSdzIHNvcnQgb3JkZXIuXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU3R5bGUgPSBlbGVtZW50TmFtZXNbaV1bM10udG9Mb3dlckNhc2UoKSArIGVsZW1lbnROYW1lc1tpXS5zbGljZSg0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZWxlbWVudE5hbWVzW2ldWzFdID09PSAncycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIE1zLXByZWZpeGVkIHN0eWxlLCBsaWtlIFwiTXNUcmFuc2l0aW9uXCIuXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU3R5bGUgPSBlbGVtZW50TmFtZXNbaV1bMl0udG9Mb3dlckNhc2UoKSArIGVsZW1lbnROYW1lc1tpXS5zbGljZSgzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxTdHlsZSAmJiBvcmlnaW5hbEVsZW1lbnRzLmhhc093blByb3BlcnR5KG9yaWdpbmFsU3R5bGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbEluZGV4ID0gZGVjbGFyYXRpb25zLmtleU9yZGVyLmluZGV4T2Yob3JpZ2luYWxTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9ucy5rZXlPcmRlci5zcGxpY2Uob3JpZ2luYWxJbmRleCwgMCwgZWxlbWVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCBrbm93IHdoYXQgdGhlIG9yaWdpbmFsIHN0eWxlIHdhcywgc28gc29ydCBpdCB0b1xuICAgICAgICAgICAgICAgICAgICAvLyB0b3AuIFRoaXMgY2FuIGhhcHBlbiBmb3Igc3R5bGVzIHRoYXQgYXJlIGFkZGVkIHRoYXQgZG9uJ3RcbiAgICAgICAgICAgICAgICAgICAgLy8gaGF2ZSB0aGUgc2FtZSBiYXNlIG5hbWUgYXMgdGhlIG9yaWdpbmFsIHN0eWxlLlxuICAgICAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMua2V5T3JkZXIudW5zaGlmdChlbGVtZW50TmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciB0cmFuc2Zvcm1WYWx1ZSA9IHVzZUltcG9ydGFudCA9PT0gZmFsc2UgPyBfdXRpbC5zdHJpbmdpZnlWYWx1ZSA6IF91dGlsLnN0cmluZ2lmeUFuZEltcG9ydGFudGlmeVZhbHVlO1xuXG4gICAgdmFyIHJ1bGVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZWNsYXJhdGlvbnMua2V5T3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IGRlY2xhcmF0aW9ucy5rZXlPcmRlcltpXTtcbiAgICAgICAgdmFyIHZhbHVlID0gcHJlZml4ZWRFbGVtZW50c1trZXldO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIGlubGluZS1zdHlsZS1wcmVmaXhlciByZXR1cm5zIGFuIGFycmF5IHdoZW4gdGhlcmUgc2hvdWxkIGJlXG4gICAgICAgICAgICAvLyBtdWx0aXBsZSBydWxlcyBmb3IgdGhlIHNhbWUga2V5LiBIZXJlIHdlIGZsYXR0ZW4gdG8gbXVsdGlwbGVcbiAgICAgICAgICAgIC8vIHBhaXJzIHdpdGggdGhlIHNhbWUga2V5LlxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHJ1bGVzLnB1c2godHJhbnNmb3JtUnVsZShrZXksIHZhbHVlW2pdLCB0cmFuc2Zvcm1WYWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcnVsZXMucHVzaCh0cmFuc2Zvcm1SdWxlKGtleSwgdmFsdWUsIHRyYW5zZm9ybVZhbHVlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocnVsZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3RvciArICd7JyArIHJ1bGVzLmpvaW4oXCJcIikgKyAnfSc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxufTtcbmV4cG9ydHMuZ2VuZXJhdGVDU1NSdWxlc2V0ID0gZ2VuZXJhdGVDU1NSdWxlc2V0OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2FzYXAgPSByZXF1aXJlKCdhc2FwJyk7XG5cbnZhciBfYXNhcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hc2FwKTtcblxudmFyIF9vcmRlcmVkRWxlbWVudHMgPSByZXF1aXJlKCcuL29yZGVyZWQtZWxlbWVudHMnKTtcblxudmFyIF9vcmRlcmVkRWxlbWVudHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3JkZXJlZEVsZW1lbnRzKTtcblxudmFyIF9nZW5lcmF0ZSA9IHJlcXVpcmUoJy4vZ2VuZXJhdGUnKTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8qIDo6XG5pbXBvcnQgdHlwZSB7IFNoZWV0RGVmaW5pdGlvbiwgU2hlZXREZWZpbml0aW9ucyB9IGZyb20gJy4vaW5kZXguanMnO1xuaW1wb3J0IHR5cGUgeyBNYXliZVNoZWV0RGVmaW5pdGlvbiB9IGZyb20gJy4vZXhwb3J0cy5qcyc7XG5pbXBvcnQgdHlwZSB7IFNlbGVjdG9ySGFuZGxlciB9IGZyb20gJy4vZ2VuZXJhdGUuanMnO1xudHlwZSBQcm9jZXNzZWRTdHlsZURlZmluaXRpb25zID0ge1xuICBjbGFzc05hbWVCaXRzOiBBcnJheTxzdHJpbmc+LFxuICBkZWZpbml0aW9uQml0czogQXJyYXk8T2JqZWN0Pixcbn07XG4qL1xuXG4vLyBUaGUgY3VycmVudCA8c3R5bGU+IHRhZyB3ZSBhcmUgaW5zZXJ0aW5nIGludG8sIG9yIG51bGwgaWYgd2UgaGF2ZW4ndFxuLy8gaW5zZXJ0ZWQgYW55dGhpbmcgeWV0LiBXZSBjb3VsZCBmaW5kIHRoaXMgZWFjaCB0aW1lIHVzaW5nXG4vLyBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInN0eWxlW2RhdGEtYXBocm9kaXRlXCJdKWAsIGJ1dCBob2xkaW5nIG9udG8gaXQgaXNcbi8vIGZhc3Rlci5cbnZhciBzdHlsZVRhZyA9IG51bGw7XG5cbi8vIEluamVjdCBhIHN0cmluZyBvZiBzdHlsZXMgaW50byBhIDxzdHlsZT4gdGFnIGluIHRoZSBoZWFkIG9mIHRoZSBkb2N1bWVudC4gVGhpc1xuLy8gd2lsbCBhdXRvbWF0aWNhbGx5IGNyZWF0ZSBhIHN0eWxlIHRhZyBhbmQgdGhlbiBjb250aW51ZSB0byB1c2UgaXQgZm9yXG4vLyBtdWx0aXBsZSBpbmplY3Rpb25zLiBJdCB3aWxsIGFsc28gdXNlIGEgc3R5bGUgdGFnIHdpdGggdGhlIGBkYXRhLWFwaHJvZGl0ZWBcbi8vIHRhZyBvbiBpdCBpZiB0aGF0IGV4aXN0cyBpbiB0aGUgRE9NLiBUaGlzIGNvdWxkIGJlIHVzZWQgZm9yIGUuZy4gcmV1c2luZyB0aGVcbi8vIHNhbWUgc3R5bGUgdGFnIHRoYXQgc2VydmVyLXNpZGUgcmVuZGVyaW5nIGluc2VydHMuXG52YXIgaW5qZWN0U3R5bGVUYWcgPSBmdW5jdGlvbiBpbmplY3RTdHlsZVRhZyhjc3NDb250ZW50cyAvKiA6IHN0cmluZyAqLykge1xuICAgIGlmIChzdHlsZVRhZyA9PSBudWxsKSB7XG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGEgc3R5bGUgdGFnIHdpdGggdGhlIGBkYXRhLWFwaHJvZGl0ZWAgYXR0cmlidXRlIGZpcnN0LlxuICAgICAgICBzdHlsZVRhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzdHlsZVtkYXRhLWFwaHJvZGl0ZV1cIik7XG5cbiAgICAgICAgLy8gSWYgdGhhdCBkb2Vzbid0IHdvcmssIGdlbmVyYXRlIGEgbmV3IHN0eWxlIHRhZy5cbiAgICAgICAgaWYgKHN0eWxlVGFnID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIFRha2VuIGZyb21cbiAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTI0Njk2L2hvdy10by1jcmVhdGUtYS1zdHlsZS10YWctd2l0aC1qYXZhc2NyaXB0XG4gICAgICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgICAgIHN0eWxlVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICAgICAgICAgICAgc3R5bGVUYWcudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgICAgICBzdHlsZVRhZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFwaHJvZGl0ZVwiLCBcIlwiKTtcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVUYWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlVGFnLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgLy8gJEZsb3dGaXhNZTogbGVnYWN5IEludGVybmV0IEV4cGxvcmVyIGNvbXBhdGliaWxpdHlcbiAgICAgICAgc3R5bGVUYWcuc3R5bGVTaGVldC5jc3NUZXh0ICs9IGNzc0NvbnRlbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHN0eWxlVGFnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc0NvbnRlbnRzKSk7XG4gICAgfVxufTtcblxuLy8gQ3VzdG9tIGhhbmRsZXJzIGZvciBzdHJpbmdpZnlpbmcgQ1NTIHZhbHVlcyB0aGF0IGhhdmUgc2lkZSBlZmZlY3RzXG4vLyAoc3VjaCBhcyBmb250RmFtaWx5LCB3aGljaCBjYW4gY2F1c2UgQGZvbnQtZmFjZSBydWxlcyB0byBiZSBpbmplY3RlZClcbnZhciBzdHJpbmdIYW5kbGVycyA9IHtcbiAgICAvLyBXaXRoIGZvbnRGYW1pbHkgd2UgbG9vayBmb3Igb2JqZWN0cyB0aGF0IGFyZSBwYXNzZWQgaW4gYW5kIGludGVycHJldFxuICAgIC8vIHRoZW0gYXMgQGZvbnQtZmFjZSBydWxlcyB0aGF0IHdlIG5lZWQgdG8gaW5qZWN0LiBUaGUgdmFsdWUgb2YgZm9udEZhbWlseVxuICAgIC8vIGNhbiBlaXRoZXIgYmUgYSBzdHJpbmcgKGFzIG5vcm1hbCksIGFuIG9iamVjdCAoYSBzaW5nbGUgZm9udCBmYWNlKSwgb3JcbiAgICAvLyBhbiBhcnJheSBvZiBvYmplY3RzIGFuZCBzdHJpbmdzLlxuICAgIGZvbnRGYW1pbHk6IGZ1bmN0aW9uIGZvbnRGYW1pbHkodmFsKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWwubWFwKGZvbnRGYW1pbHkpLmpvaW4oXCIsXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGluamVjdFN0eWxlT25jZSh2YWwuc3JjLCBcIkBmb250LWZhY2VcIiwgW3ZhbF0sIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiAnXCInICsgdmFsLmZvbnRGYW1pbHkgKyAnXCInO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBXaXRoIGFuaW1hdGlvbk5hbWUgd2UgbG9vayBmb3IgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMga2V5ZnJhbWVzIGFuZFxuICAgIC8vIGluamVjdCB0aGVtIGFzIGFuIGBAa2V5ZnJhbWVzYCBibG9jaywgcmV0dXJuaW5nIGEgdW5pcXVlbHkgZ2VuZXJhdGVkXG4gICAgLy8gbmFtZS4gVGhlIGtleWZyYW1lcyBvYmplY3Qgc2hvdWxkIGxvb2sgbGlrZVxuICAgIC8vICBhbmltYXRpb25OYW1lOiB7XG4gICAgLy8gICAgZnJvbToge1xuICAgIC8vICAgICAgbGVmdDogMCxcbiAgICAvLyAgICAgIHRvcDogMCxcbiAgICAvLyAgICB9LFxuICAgIC8vICAgICc1MCUnOiB7XG4gICAgLy8gICAgICBsZWZ0OiAxNSxcbiAgICAvLyAgICAgIHRvcDogNSxcbiAgICAvLyAgICB9LFxuICAgIC8vICAgIHRvOiB7XG4gICAgLy8gICAgICBsZWZ0OiAyMCxcbiAgICAvLyAgICAgIHRvcDogMjAsXG4gICAgLy8gICAgfVxuICAgIC8vICB9XG4gICAgLy8gVE9ETyhlbWlseSk6IGBzdHJpbmdIYW5kbGVyc2AgZG9lc24ndCBsZXQgdXMgcmVuYW1lIHRoZSBrZXksIHNvIEkgaGF2ZVxuICAgIC8vIHRvIHVzZSBgYW5pbWF0aW9uTmFtZWAgaGVyZS4gSW1wcm92ZSB0aGF0IHNvIHdlIGNhbiBjYWxsIHRoaXNcbiAgICAvLyBgYW5pbWF0aW9uYCBpbnN0ZWFkIG9mIGBhbmltYXRpb25OYW1lYC5cbiAgICBhbmltYXRpb25OYW1lOiBmdW5jdGlvbiBhbmltYXRpb25OYW1lKHZhbCwgc2VsZWN0b3JIYW5kbGVycykge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25OYW1lKHYsIHNlbGVjdG9ySGFuZGxlcnMpO1xuICAgICAgICAgICAgfSkuam9pbihcIixcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgbmFtZSBiYXNlZCBvbiB0aGUgaGFzaCBvZiB0aGUgb2JqZWN0LiBXZSBjYW4ndFxuICAgICAgICAgICAgLy8ganVzdCB1c2UgdGhlIGhhc2ggYmVjYXVzZSB0aGUgbmFtZSBjYW4ndCBzdGFydCB3aXRoIGEgbnVtYmVyLlxuICAgICAgICAgICAgLy8gVE9ETyhlbWlseSk6IHRoaXMgcHJvYmFibHkgbWFrZXMgZGVidWdnaW5nIGhhcmQsIGFsbG93IGEgY3VzdG9tXG4gICAgICAgICAgICAvLyBuYW1lP1xuICAgICAgICAgICAgdmFyIF9uYW1lID0gJ2tleWZyYW1lXycgKyAoMCwgX3V0aWwuaGFzaE9iamVjdCkodmFsKTtcblxuICAgICAgICAgICAgLy8gU2luY2Uga2V5ZnJhbWVzIG5lZWQgMyBsYXllcnMgb2YgbmVzdGluZywgd2UgdXNlIGBnZW5lcmF0ZUNTU2AgdG9cbiAgICAgICAgICAgIC8vIGJ1aWxkIHRoZSBpbm5lciBsYXllcnMgYW5kIHdyYXAgaXQgaW4gYEBrZXlmcmFtZXNgIG91cnNlbHZlcy5cbiAgICAgICAgICAgIHZhciBmaW5hbFZhbCA9ICdAa2V5ZnJhbWVzICcgKyBfbmFtZSArICd7JztcblxuICAgICAgICAgICAgLy8gVE9ETyBzZWUgaWYgd2UgY2FuIGZpbmQgYSB3YXkgd2hlcmUgY2hlY2tpbmcgZm9yIE9yZGVyZWRFbGVtZW50c1xuICAgICAgICAgICAgLy8gaGVyZSBpcyBub3QgbmVjZXNzYXJ5LiBBbHRlcm5hdGl2ZWx5LCBwZXJoYXBzIHdlIHNob3VsZCBoYXZlIGFcbiAgICAgICAgICAgIC8vIHV0aWxpdHkgbWV0aG9kIHRoYXQgY2FuIGl0ZXJhdGUgb3ZlciBlaXRoZXIgYSBwbGFpbiBvYmplY3QsIGFuXG4gICAgICAgICAgICAvLyBpbnN0YW5jZSBvZiBPcmRlcmVkRWxlbWVudHMsIG9yIGEgTWFwLCBhbmQgdGhlbiB1c2UgdGhhdCBoZXJlIGFuZFxuICAgICAgICAgICAgLy8gZWxzZXdoZXJlLlxuICAgICAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIF9vcmRlcmVkRWxlbWVudHMyWydkZWZhdWx0J10pIHtcbiAgICAgICAgICAgICAgICB2YWwuZm9yRWFjaChmdW5jdGlvbiAodmFsVmFsLCB2YWxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmluYWxWYWwgKz0gKDAsIF9nZW5lcmF0ZS5nZW5lcmF0ZUNTUykodmFsS2V5LCBbdmFsVmFsXSwgc2VsZWN0b3JIYW5kbGVycywgc3RyaW5nSGFuZGxlcnMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXModmFsKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmluYWxWYWwgKz0gKDAsIF9nZW5lcmF0ZS5nZW5lcmF0ZUNTUykoa2V5LCBbdmFsW2tleV1dLCBzZWxlY3RvckhhbmRsZXJzLCBzdHJpbmdIYW5kbGVycywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxWYWwgKz0gJ30nO1xuXG4gICAgICAgICAgICBpbmplY3RHZW5lcmF0ZWRDU1NPbmNlKF9uYW1lLCBmaW5hbFZhbCk7XG5cbiAgICAgICAgICAgIHJldHVybiBfbmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBUaGlzIGlzIGEgbWFwIGZyb20gQXBocm9kaXRlJ3MgZ2VuZXJhdGVkIGNsYXNzIG5hbWVzIHRvIGB0cnVlYCAoYWN0aW5nIGFzIGFcbi8vIHNldCBvZiBjbGFzcyBuYW1lcylcbnZhciBhbHJlYWR5SW5qZWN0ZWQgPSB7fTtcblxuLy8gVGhpcyBpcyB0aGUgYnVmZmVyIG9mIHN0eWxlcyB3aGljaCBoYXZlIG5vdCB5ZXQgYmVlbiBmbHVzaGVkLlxudmFyIGluamVjdGlvbkJ1ZmZlciA9IFwiXCI7XG5cbi8vIEEgZmxhZyB0byB0ZWxsIGlmIHdlIGFyZSBhbHJlYWR5IGJ1ZmZlcmluZyBzdHlsZXMuIFRoaXMgY291bGQgaGFwcGVuIGVpdGhlclxuLy8gYmVjYXVzZSB3ZSBzY2hlZHVsZWQgYSBmbHVzaCBjYWxsIGFscmVhZHksIHNvIG5ld2x5IGFkZGVkIHN0eWxlcyB3aWxsXG4vLyBhbHJlYWR5IGJlIGZsdXNoZWQsIG9yIGJlY2F1c2Ugd2UgYXJlIHN0YXRpY2FsbHkgYnVmZmVyaW5nIG9uIHRoZSBzZXJ2ZXIuXG52YXIgaXNCdWZmZXJpbmcgPSBmYWxzZTtcblxudmFyIGluamVjdEdlbmVyYXRlZENTU09uY2UgPSBmdW5jdGlvbiBpbmplY3RHZW5lcmF0ZWRDU1NPbmNlKGtleSwgZ2VuZXJhdGVkQ1NTKSB7XG4gICAgaWYgKGFscmVhZHlJbmplY3RlZFtrZXldKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWlzQnVmZmVyaW5nKSB7XG4gICAgICAgIC8vIFdlIHNob3VsZCBuZXZlciBiZSBhdXRvbWF0aWNhbGx5IGJ1ZmZlcmluZyBvbiB0aGUgc2VydmVyIChvciBhbnlcbiAgICAgICAgLy8gcGxhY2Ugd2l0aG91dCBhIGRvY3VtZW50KSwgc28gZ3VhcmQgYWdhaW5zdCB0aGF0LlxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYXV0b21hdGljYWxseSBidWZmZXIgd2l0aG91dCBhIGRvY3VtZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UncmUgbm90IGFscmVhZHkgYnVmZmVyaW5nLCBzY2hlZHVsZSBhIGNhbGwgdG8gZmx1c2ggdGhlXG4gICAgICAgIC8vIGN1cnJlbnQgc3R5bGVzLlxuICAgICAgICBpc0J1ZmZlcmluZyA9IHRydWU7XG4gICAgICAgICgwLCBfYXNhcDJbJ2RlZmF1bHQnXSkoZmx1c2hUb1N0eWxlVGFnKTtcbiAgICB9XG5cbiAgICBpbmplY3Rpb25CdWZmZXIgKz0gZ2VuZXJhdGVkQ1NTO1xuICAgIGFscmVhZHlJbmplY3RlZFtrZXldID0gdHJ1ZTtcbn07XG5cbnZhciBpbmplY3RTdHlsZU9uY2UgPSBmdW5jdGlvbiBpbmplY3RTdHlsZU9uY2Uoa2V5LCAvKiA6IHN0cmluZyAqL1xuc2VsZWN0b3IsIC8qIDogc3RyaW5nICovXG5kZWZpbml0aW9ucywgLyogOiBTaGVldERlZmluaXRpb25bXSAqL1xudXNlSW1wb3J0YW50IC8qIDogYm9vbGVhbiAqL1xuKSB7XG4gICAgdmFyIHNlbGVjdG9ySGFuZGxlcnMgLyogOiBTZWxlY3RvckhhbmRsZXJbXSAqLyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gNCB8fCBhcmd1bWVudHNbNF0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzRdO1xuXG4gICAgaWYgKGFscmVhZHlJbmplY3RlZFtrZXldKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZ2VuZXJhdGVkID0gKDAsIF9nZW5lcmF0ZS5nZW5lcmF0ZUNTUykoc2VsZWN0b3IsIGRlZmluaXRpb25zLCBzZWxlY3RvckhhbmRsZXJzLCBzdHJpbmdIYW5kbGVycywgdXNlSW1wb3J0YW50KTtcblxuICAgIGluamVjdEdlbmVyYXRlZENTU09uY2Uoa2V5LCBnZW5lcmF0ZWQpO1xufTtcblxuZXhwb3J0cy5pbmplY3RTdHlsZU9uY2UgPSBpbmplY3RTdHlsZU9uY2U7XG52YXIgcmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcbiAgICBpbmplY3Rpb25CdWZmZXIgPSBcIlwiO1xuICAgIGFscmVhZHlJbmplY3RlZCA9IHt9O1xuICAgIGlzQnVmZmVyaW5nID0gZmFsc2U7XG4gICAgc3R5bGVUYWcgPSBudWxsO1xufTtcblxuZXhwb3J0cy5yZXNldCA9IHJlc2V0O1xudmFyIHN0YXJ0QnVmZmVyaW5nID0gZnVuY3Rpb24gc3RhcnRCdWZmZXJpbmcoKSB7XG4gICAgaWYgKGlzQnVmZmVyaW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBidWZmZXIgd2hpbGUgYWxyZWFkeSBidWZmZXJpbmdcIik7XG4gICAgfVxuICAgIGlzQnVmZmVyaW5nID0gdHJ1ZTtcbn07XG5cbmV4cG9ydHMuc3RhcnRCdWZmZXJpbmcgPSBzdGFydEJ1ZmZlcmluZztcbnZhciBmbHVzaFRvU3RyaW5nID0gZnVuY3Rpb24gZmx1c2hUb1N0cmluZygpIHtcbiAgICBpc0J1ZmZlcmluZyA9IGZhbHNlO1xuICAgIHZhciByZXQgPSBpbmplY3Rpb25CdWZmZXI7XG4gICAgaW5qZWN0aW9uQnVmZmVyID0gXCJcIjtcbiAgICByZXR1cm4gcmV0O1xufTtcblxuZXhwb3J0cy5mbHVzaFRvU3RyaW5nID0gZmx1c2hUb1N0cmluZztcbnZhciBmbHVzaFRvU3R5bGVUYWcgPSBmdW5jdGlvbiBmbHVzaFRvU3R5bGVUYWcoKSB7XG4gICAgdmFyIGNzc0NvbnRlbnQgPSBmbHVzaFRvU3RyaW5nKCk7XG4gICAgaWYgKGNzc0NvbnRlbnQubGVuZ3RoID4gMCkge1xuICAgICAgICBpbmplY3RTdHlsZVRhZyhjc3NDb250ZW50KTtcbiAgICB9XG59O1xuXG5leHBvcnRzLmZsdXNoVG9TdHlsZVRhZyA9IGZsdXNoVG9TdHlsZVRhZztcbnZhciBnZXRSZW5kZXJlZENsYXNzTmFtZXMgPSBmdW5jdGlvbiBnZXRSZW5kZXJlZENsYXNzTmFtZXMoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGFscmVhZHlJbmplY3RlZCk7XG59O1xuXG5leHBvcnRzLmdldFJlbmRlcmVkQ2xhc3NOYW1lcyA9IGdldFJlbmRlcmVkQ2xhc3NOYW1lcztcbnZhciBhZGRSZW5kZXJlZENsYXNzTmFtZXMgPSBmdW5jdGlvbiBhZGRSZW5kZXJlZENsYXNzTmFtZXMoY2xhc3NOYW1lcyAvKiA6IHN0cmluZ1tdICovKSB7XG4gICAgY2xhc3NOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgYWxyZWFkeUluamVjdGVkW2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgIH0pO1xufTtcblxuZXhwb3J0cy5hZGRSZW5kZXJlZENsYXNzTmFtZXMgPSBhZGRSZW5kZXJlZENsYXNzTmFtZXM7XG52YXIgcHJvY2Vzc1N0eWxlRGVmaW5pdGlvbnMgPSBmdW5jdGlvbiBwcm9jZXNzU3R5bGVEZWZpbml0aW9ucyhzdHlsZURlZmluaXRpb25zLCAvKiA6IGFueVtdICovXG5yZXN1bHQgLyogOiBQcm9jZXNzZWRTdHlsZURlZmluaXRpb25zICovXG4pIC8qIDogdm9pZCAqL3tcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlRGVmaW5pdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgLy8gRmlsdGVyIG91dCBmYWxzeSB2YWx1ZXMgZnJvbSB0aGUgaW5wdXQsIHRvIGFsbG93IGZvclxuICAgICAgICAvLyBgY3NzKGEsIHRlc3QgJiYgYylgXG4gICAgICAgIGlmIChzdHlsZURlZmluaXRpb25zW2ldKSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzdHlsZURlZmluaXRpb25zW2ldKSkge1xuICAgICAgICAgICAgICAgIC8vIFdlJ3ZlIGVuY291bnRlcmVkIGFuIGFycmF5LCBzbyBsZXQncyByZWN1cnNlXG4gICAgICAgICAgICAgICAgcHJvY2Vzc1N0eWxlRGVmaW5pdGlvbnMoc3R5bGVEZWZpbml0aW9uc1tpXSwgcmVzdWx0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmNsYXNzTmFtZUJpdHMucHVzaChzdHlsZURlZmluaXRpb25zW2ldLl9uYW1lKTtcbiAgICAgICAgICAgICAgICByZXN1bHQuZGVmaW5pdGlvbkJpdHMucHVzaChzdHlsZURlZmluaXRpb25zW2ldLl9kZWZpbml0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogSW5qZWN0IHN0eWxlcyBhc3NvY2lhdGVkIHdpdGggdGhlIHBhc3NlZCBzdHlsZSBkZWZpbml0aW9uIG9iamVjdHMsIGFuZCByZXR1cm5cbiAqIGFuIGFzc29jaWF0ZWQgQ1NTIGNsYXNzIG5hbWUuXG4gKlxuICogQHBhcmFtIHtib29sZWFufSB1c2VJbXBvcnRhbnQgSWYgdHJ1ZSwgd2lsbCBhcHBlbmQgIWltcG9ydGFudCB0byBnZW5lcmF0ZWRcbiAqICAgICBDU1Mgb3V0cHV0LiBlLmcuIHtjb2xvcjogcmVkfSAtPiBcImNvbG9yOiByZWQgIWltcG9ydGFudFwiLlxuICogQHBhcmFtIHsoT2JqZWN0fE9iamVjdFtdKVtdfSBzdHlsZURlZmluaXRpb25zIHN0eWxlIGRlZmluaXRpb24gb2JqZWN0cywgb3JcbiAqICAgICBhcmJpdHJhcmlseSBuZXN0ZWQgYXJyYXlzIG9mIHRoZW0sIGFzIHJldHVybmVkIGFzIHByb3BlcnRpZXMgb2YgdGhlXG4gKiAgICAgcmV0dXJuIHZhbHVlIG9mIFN0eWxlU2hlZXQuY3JlYXRlKCkuXG4gKi9cbnZhciBpbmplY3RBbmRHZXRDbGFzc05hbWUgPSBmdW5jdGlvbiBpbmplY3RBbmRHZXRDbGFzc05hbWUodXNlSW1wb3J0YW50LCAvKiA6IGJvb2xlYW4gKi9cbnN0eWxlRGVmaW5pdGlvbnMsIC8qIDogTWF5YmVTaGVldERlZmluaXRpb25bXSAqL1xuc2VsZWN0b3JIYW5kbGVycyAvKiA6IFNlbGVjdG9ySGFuZGxlcltdICovXG4pIC8qIDogc3RyaW5nICove1xuICAgIHZhciBwcm9jZXNzZWRTdHlsZURlZmluaXRpb25zIC8qIDogUHJvY2Vzc2VkU3R5bGVEZWZpbml0aW9ucyAqLyA9IHtcbiAgICAgICAgY2xhc3NOYW1lQml0czogW10sXG4gICAgICAgIGRlZmluaXRpb25CaXRzOiBbXVxuICAgIH07XG4gICAgLy8gTXV0YXRlcyBwcm9jZXNzZWRTdHlsZURlZmluaXRpb25zXG4gICAgcHJvY2Vzc1N0eWxlRGVmaW5pdGlvbnMoc3R5bGVEZWZpbml0aW9ucywgcHJvY2Vzc2VkU3R5bGVEZWZpbml0aW9ucyk7XG5cbiAgICAvLyBCcmVhayBpZiB0aGVyZSBhcmVuJ3QgYW55IHZhbGlkIHN0eWxlcy5cbiAgICBpZiAocHJvY2Vzc2VkU3R5bGVEZWZpbml0aW9ucy5jbGFzc05hbWVCaXRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgdmFyIGNsYXNzTmFtZSA9IHByb2Nlc3NlZFN0eWxlRGVmaW5pdGlvbnMuY2xhc3NOYW1lQml0cy5qb2luKFwiLW9fTy1cIik7XG5cbiAgICBpbmplY3RTdHlsZU9uY2UoY2xhc3NOYW1lLCAnLicgKyBjbGFzc05hbWUsIHByb2Nlc3NlZFN0eWxlRGVmaW5pdGlvbnMuZGVmaW5pdGlvbkJpdHMsIHVzZUltcG9ydGFudCwgc2VsZWN0b3JIYW5kbGVycyk7XG5cbiAgICByZXR1cm4gY2xhc3NOYW1lO1xufTtcbmV4cG9ydHMuaW5qZWN0QW5kR2V0Q2xhc3NOYW1lID0gaW5qZWN0QW5kR2V0Q2xhc3NOYW1lOyIsIlxuLy8gTW9kdWxlIHdpdGggdGhlIHNhbWUgaW50ZXJmYWNlIGFzIHRoZSBjb3JlIGFwaHJvZGl0ZSBtb2R1bGUsXG4vLyBleGNlcHQgdGhhdCBzdHlsZXMgaW5qZWN0ZWQgZG8gbm90IGF1dG9tYXRpY2FsbHkgaGF2ZSAhaW1wb3J0YW50XG4vLyBhcHBlbmRlZCB0byB0aGVtLlxuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfZ2VuZXJhdGUgPSByZXF1aXJlKCcuL2dlbmVyYXRlJyk7XG5cbnZhciBfZXhwb3J0czIgPSByZXF1aXJlKCcuL2V4cG9ydHMnKTtcblxudmFyIF9leHBvcnRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4cG9ydHMyKTtcblxudmFyIHVzZUltcG9ydGFudCA9IGZhbHNlOyAvLyBEb24ndCBhZGQgIWltcG9ydGFudCB0byBzdHlsZSBkZWZpbml0aW9uc1xuZXhwb3J0c1snZGVmYXVsdCddID0gKDAsIF9leHBvcnRzM1snZGVmYXVsdCddKSh1c2VJbXBvcnRhbnQsIF9nZW5lcmF0ZS5kZWZhdWx0U2VsZWN0b3JIYW5kbGVycyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG52YXIgTUFQX0VYSVNUUyA9IHR5cGVvZiBNYXAgIT09ICd1bmRlZmluZWQnO1xuXG52YXIgT3JkZXJlZEVsZW1lbnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKiA6OlxuICAgIGVsZW1lbnRzOiB7W3N0cmluZ106IGFueX07XG4gICAga2V5T3JkZXI6IHN0cmluZ1tdO1xuICAgICovXG5cbiAgICBmdW5jdGlvbiBPcmRlcmVkRWxlbWVudHMoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBPcmRlcmVkRWxlbWVudHMpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSB7fTtcbiAgICAgICAgdGhpcy5rZXlPcmRlciA9IFtdO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhPcmRlcmVkRWxlbWVudHMsIFt7XG4gICAgICAgIGtleTogJ2ZvckVhY2gnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFjayAvKiA6IChzdHJpbmcsIGFueSkgPT4gdm9pZCAqLykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtleU9yZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gKHZhbHVlLCBrZXkpIHRvIG1hdGNoIE1hcCdzIEFQSVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuZWxlbWVudHNbdGhpcy5rZXlPcmRlcltpXV0sIHRoaXMua2V5T3JkZXJbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdzZXQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0KGtleSwgLyogOiBzdHJpbmcgKi92YWx1ZSAvKiA6IGFueSAqLykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnRzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleU9yZGVyLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChNQVBfRVhJU1RTICYmIHZhbHVlIGluc3RhbmNlb2YgTWFwIHx8IHZhbHVlIGluc3RhbmNlb2YgT3JkZXJlZEVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9yZXQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIGZvdW5kIGEgbmVzdGVkIE1hcCwgc28gd2UgbmVlZCB0byByZWN1cnNlIHNvIHRoYXQgYWxsXG4gICAgICAgICAgICAgICAgICAgIC8vIG9mIHRoZSBuZXN0ZWQgb2JqZWN0cyBhbmQgTWFwcyBhcmUgbWVyZ2VkIHByb3Blcmx5LlxuICAgICAgICAgICAgICAgICAgICB2YXIgbmVzdGVkID0gX3RoaXMuZWxlbWVudHMuaGFzT3duUHJvcGVydHkoa2V5KSA/IF90aGlzLmVsZW1lbnRzW2tleV0gOiBuZXcgT3JkZXJlZEVsZW1lbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5lc3RlZC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbGVtZW50c1trZXldID0gbmVzdGVkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSkoKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgX3JldCA9PT0gJ29iamVjdCcpIHJldHVybiBfcmV0LnY7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgZm91bmQgYSBuZXN0ZWQgb2JqZWN0LCBzbyB3ZSBuZWVkIHRvIHJlY3Vyc2Ugc28gdGhhdCBhbGxcbiAgICAgICAgICAgICAgICAvLyBvZiB0aGUgbmVzdGVkIG9iamVjdHMgYW5kIE1hcHMgYXJlIG1lcmdlZCBwcm9wZXJseS5cbiAgICAgICAgICAgICAgICB2YXIgbmVzdGVkID0gdGhpcy5lbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpID8gdGhpcy5lbGVtZW50c1trZXldIDogbmV3IE9yZGVyZWRFbGVtZW50cygpO1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBuZXN0ZWQuc2V0KGtleXNbaV0sIHZhbHVlW2tleXNbaV1dKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50c1trZXldID0gbmVzdGVkO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50c1trZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQoa2V5IC8qIDogc3RyaW5nICovKSAvKiA6IGFueSAqL3tcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRzW2tleV07XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYXMoa2V5IC8qIDogc3RyaW5nICovKSAvKiA6IGJvb2xlYW4gKi97XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdhZGRTdHlsZVR5cGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkU3R5bGVUeXBlKHN0eWxlVHlwZSAvKiA6IGFueSAqLykgLyogOiB2b2lkICove1xuICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChNQVBfRVhJU1RTICYmIHN0eWxlVHlwZSBpbnN0YW5jZW9mIE1hcCB8fCBzdHlsZVR5cGUgaW5zdGFuY2VvZiBPcmRlcmVkRWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBzdHlsZVR5cGUuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHN0eWxlVHlwZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KGtleXNbaV0sIHN0eWxlVHlwZVtrZXlzW2ldXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIE9yZGVyZWRFbGVtZW50cztcbn0pKCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IE9yZGVyZWRFbGVtZW50cztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsInZhciBjYWxjID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2NhbGMnKVxudmFyIGNyb3NzRmFkZSA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9jcm9zc0ZhZGUnKVxudmFyIGN1cnNvciA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9jdXJzb3InKVxudmFyIGZpbHRlciA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9maWx0ZXInKVxudmFyIGZsZXggPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZmxleCcpXG52YXIgZmxleGJveElFID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2ZsZXhib3hJRScpXG52YXIgZmxleGJveE9sZCA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9mbGV4Ym94T2xkJylcbnZhciBncmFkaWVudCA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9ncmFkaWVudCcpXG52YXIgaW1hZ2VTZXQgPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvaW1hZ2VTZXQnKVxudmFyIHBvc2l0aW9uID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL3Bvc2l0aW9uJylcbnZhciBzaXppbmcgPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvc2l6aW5nJylcbnZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL3RyYW5zaXRpb24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9ICB7XG4gIHBsdWdpbnM6IFtjYWxjLGNyb3NzRmFkZSxjdXJzb3IsZmlsdGVyLGZsZXgsZmxleGJveElFLGZsZXhib3hPbGQsZ3JhZGllbnQsaW1hZ2VTZXQscG9zaXRpb24sc2l6aW5nLHRyYW5zaXRpb25dLFxuICBwcmVmaXhNYXA6IHtcInRyYW5zZm9ybVwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJ0cmFuc2Zvcm1PcmlnaW5cIjpbXCJXZWJraXRcIixcIm1zXCJdLFwidHJhbnNmb3JtT3JpZ2luWFwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJ0cmFuc2Zvcm1PcmlnaW5ZXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcImJhY2tmYWNlVmlzaWJpbGl0eVwiOltcIldlYmtpdFwiXSxcInBlcnNwZWN0aXZlXCI6W1wiV2Via2l0XCJdLFwicGVyc3BlY3RpdmVPcmlnaW5cIjpbXCJXZWJraXRcIl0sXCJ0cmFuc2Zvcm1TdHlsZVwiOltcIldlYmtpdFwiXSxcInRyYW5zZm9ybU9yaWdpblpcIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25cIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25EZWxheVwiOltcIldlYmtpdFwiXSxcImFuaW1hdGlvbkRpcmVjdGlvblwiOltcIldlYmtpdFwiXSxcImFuaW1hdGlvbkZpbGxNb2RlXCI6W1wiV2Via2l0XCJdLFwiYW5pbWF0aW9uRHVyYXRpb25cIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25JdGVyYXRpb25Db3VudFwiOltcIldlYmtpdFwiXSxcImFuaW1hdGlvbk5hbWVcIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25QbGF5U3RhdGVcIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25UaW1pbmdGdW5jdGlvblwiOltcIldlYmtpdFwiXSxcImFwcGVhcmFuY2VcIjpbXCJXZWJraXRcIixcIk1velwiXSxcInVzZXJTZWxlY3RcIjpbXCJXZWJraXRcIixcIk1velwiLFwibXNcIl0sXCJmb250S2VybmluZ1wiOltcIldlYmtpdFwiXSxcInRleHRFbXBoYXNpc1Bvc2l0aW9uXCI6W1wiV2Via2l0XCJdLFwidGV4dEVtcGhhc2lzXCI6W1wiV2Via2l0XCJdLFwidGV4dEVtcGhhc2lzU3R5bGVcIjpbXCJXZWJraXRcIl0sXCJ0ZXh0RW1waGFzaXNDb2xvclwiOltcIldlYmtpdFwiXSxcImJveERlY29yYXRpb25CcmVha1wiOltcIldlYmtpdFwiXSxcImNsaXBQYXRoXCI6W1wiV2Via2l0XCJdLFwibWFza0ltYWdlXCI6W1wiV2Via2l0XCJdLFwibWFza01vZGVcIjpbXCJXZWJraXRcIl0sXCJtYXNrUmVwZWF0XCI6W1wiV2Via2l0XCJdLFwibWFza1Bvc2l0aW9uXCI6W1wiV2Via2l0XCJdLFwibWFza0NsaXBcIjpbXCJXZWJraXRcIl0sXCJtYXNrT3JpZ2luXCI6W1wiV2Via2l0XCJdLFwibWFza1NpemVcIjpbXCJXZWJraXRcIl0sXCJtYXNrQ29tcG9zaXRlXCI6W1wiV2Via2l0XCJdLFwibWFza1wiOltcIldlYmtpdFwiXSxcIm1hc2tCb3JkZXJTb3VyY2VcIjpbXCJXZWJraXRcIl0sXCJtYXNrQm9yZGVyTW9kZVwiOltcIldlYmtpdFwiXSxcIm1hc2tCb3JkZXJTbGljZVwiOltcIldlYmtpdFwiXSxcIm1hc2tCb3JkZXJXaWR0aFwiOltcIldlYmtpdFwiXSxcIm1hc2tCb3JkZXJPdXRzZXRcIjpbXCJXZWJraXRcIl0sXCJtYXNrQm9yZGVyUmVwZWF0XCI6W1wiV2Via2l0XCJdLFwibWFza0JvcmRlclwiOltcIldlYmtpdFwiXSxcIm1hc2tUeXBlXCI6W1wiV2Via2l0XCJdLFwidGV4dERlY29yYXRpb25TdHlsZVwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwidGV4dERlY29yYXRpb25Ta2lwXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJ0ZXh0RGVjb3JhdGlvbkxpbmVcIjpbXCJXZWJraXRcIixcIk1velwiXSxcInRleHREZWNvcmF0aW9uQ29sb3JcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImZpbHRlclwiOltcIldlYmtpdFwiXSxcImZvbnRGZWF0dXJlU2V0dGluZ3NcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImJyZWFrQWZ0ZXJcIjpbXCJXZWJraXRcIixcIk1velwiLFwibXNcIl0sXCJicmVha0JlZm9yZVwiOltcIldlYmtpdFwiLFwiTW96XCIsXCJtc1wiXSxcImJyZWFrSW5zaWRlXCI6W1wiV2Via2l0XCIsXCJNb3pcIixcIm1zXCJdLFwiY29sdW1uQ291bnRcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtbkZpbGxcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtbkdhcFwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uUnVsZVwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uUnVsZUNvbG9yXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJjb2x1bW5SdWxlU3R5bGVcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtblJ1bGVXaWR0aFwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uc1wiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uU3BhblwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uV2lkdGhcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImZsZXhcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwiZmxleEJhc2lzXCI6W1wiV2Via2l0XCJdLFwiZmxleERpcmVjdGlvblwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJmbGV4R3Jvd1wiOltcIldlYmtpdFwiXSxcImZsZXhGbG93XCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcImZsZXhTaHJpbmtcIjpbXCJXZWJraXRcIl0sXCJmbGV4V3JhcFwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJhbGlnbkNvbnRlbnRcIjpbXCJXZWJraXRcIl0sXCJhbGlnbkl0ZW1zXCI6W1wiV2Via2l0XCJdLFwiYWxpZ25TZWxmXCI6W1wiV2Via2l0XCJdLFwianVzdGlmeUNvbnRlbnRcIjpbXCJXZWJraXRcIl0sXCJvcmRlclwiOltcIldlYmtpdFwiXSxcInRyYW5zaXRpb25EZWxheVwiOltcIldlYmtpdFwiXSxcInRyYW5zaXRpb25EdXJhdGlvblwiOltcIldlYmtpdFwiXSxcInRyYW5zaXRpb25Qcm9wZXJ0eVwiOltcIldlYmtpdFwiXSxcInRyYW5zaXRpb25UaW1pbmdGdW5jdGlvblwiOltcIldlYmtpdFwiXSxcImJhY2tkcm9wRmlsdGVyXCI6W1wiV2Via2l0XCJdLFwic2Nyb2xsU25hcFR5cGVcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwic2Nyb2xsU25hcFBvaW50c1hcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwic2Nyb2xsU25hcFBvaW50c1lcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwic2Nyb2xsU25hcERlc3RpbmF0aW9uXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcInNjcm9sbFNuYXBDb29yZGluYXRlXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcInNoYXBlSW1hZ2VUaHJlc2hvbGRcIjpbXCJXZWJraXRcIl0sXCJzaGFwZUltYWdlTWFyZ2luXCI6W1wiV2Via2l0XCJdLFwic2hhcGVJbWFnZU91dHNpZGVcIjpbXCJXZWJraXRcIl0sXCJoeXBoZW5zXCI6W1wiV2Via2l0XCIsXCJNb3pcIixcIm1zXCJdLFwiZmxvd0ludG9cIjpbXCJXZWJraXRcIixcIm1zXCJdLFwiZmxvd0Zyb21cIjpbXCJXZWJraXRcIixcIm1zXCJdLFwicmVnaW9uRnJhZ21lbnRcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwiYm94U2l6aW5nXCI6W1wiTW96XCJdLFwidGV4dEFsaWduTGFzdFwiOltcIk1velwiXSxcInRhYlNpemVcIjpbXCJNb3pcIl0sXCJ3cmFwRmxvd1wiOltcIm1zXCJdLFwid3JhcFRocm91Z2hcIjpbXCJtc1wiXSxcIndyYXBNYXJnaW5cIjpbXCJtc1wiXSxcInRvdWNoQWN0aW9uXCI6W1wibXNcIl0sXCJncmlkVGVtcGxhdGVDb2x1bW5zXCI6W1wibXNcIl0sXCJncmlkVGVtcGxhdGVSb3dzXCI6W1wibXNcIl0sXCJncmlkVGVtcGxhdGVBcmVhc1wiOltcIm1zXCJdLFwiZ3JpZFRlbXBsYXRlXCI6W1wibXNcIl0sXCJncmlkQXV0b0NvbHVtbnNcIjpbXCJtc1wiXSxcImdyaWRBdXRvUm93c1wiOltcIm1zXCJdLFwiZ3JpZEF1dG9GbG93XCI6W1wibXNcIl0sXCJncmlkXCI6W1wibXNcIl0sXCJncmlkUm93U3RhcnRcIjpbXCJtc1wiXSxcImdyaWRDb2x1bW5TdGFydFwiOltcIm1zXCJdLFwiZ3JpZFJvd0VuZFwiOltcIm1zXCJdLFwiZ3JpZFJvd1wiOltcIm1zXCJdLFwiZ3JpZENvbHVtblwiOltcIm1zXCJdLFwiZ3JpZENvbHVtbkVuZFwiOltcIm1zXCJdLFwiZ3JpZENvbHVtbkdhcFwiOltcIm1zXCJdLFwiZ3JpZFJvd0dhcFwiOltcIm1zXCJdLFwiZ3JpZEFyZWFcIjpbXCJtc1wiXSxcImdyaWRHYXBcIjpbXCJtc1wiXSxcInRleHRTaXplQWRqdXN0XCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcImJvcmRlckltYWdlXCI6W1wiV2Via2l0XCJdLFwiYm9yZGVySW1hZ2VPdXRzZXRcIjpbXCJXZWJraXRcIl0sXCJib3JkZXJJbWFnZVJlcGVhdFwiOltcIldlYmtpdFwiXSxcImJvcmRlckltYWdlU2xpY2VcIjpbXCJXZWJraXRcIl0sXCJib3JkZXJJbWFnZVNvdXJjZVwiOltcIldlYmtpdFwiXSxcImJvcmRlckltYWdlV2lkdGhcIjpbXCJXZWJraXRcIl19XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3NsaWNlZFRvQXJyYXkgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVsncmV0dXJuJ10pIF9pWydyZXR1cm4nXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlJyk7IH0gfTsgfSkoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3N0cmluZ0hhc2ggPSByZXF1aXJlKCdzdHJpbmctaGFzaCcpO1xuXG52YXIgX3N0cmluZ0hhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5nSGFzaCk7XG5cbi8qIDo6XG50eXBlIFBhaXIgPSBbIHN0cmluZywgYW55IF07XG50eXBlIFBhaXJzID0gUGFpcltdO1xudHlwZSBQYWlyc01hcHBlciA9IChwYWlyOiBQYWlyKSA9PiBQYWlyO1xudHlwZSBPYmplY3RNYXAgPSB7IFtpZDpzdHJpbmddOiBhbnkgfTtcbiovXG5cbnZhciBtYXBPYmogPSBmdW5jdGlvbiBtYXBPYmoob2JqLCAvKiA6IE9iamVjdE1hcCAqL1xuZm4gLyogOiBQYWlyc01hcHBlciAqL1xuKSAvKiA6IE9iamVjdE1hcCAqL3tcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgdmFyIG1hcHBlZE9iaiA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB2YXIgX2ZuID0gZm4oW2tleXNbaV0sIG9ialtrZXlzW2ldXV0pO1xuXG4gICAgICAgIHZhciBfZm4yID0gX3NsaWNlZFRvQXJyYXkoX2ZuLCAyKTtcblxuICAgICAgICB2YXIgbmV3S2V5ID0gX2ZuMlswXTtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gX2ZuMlsxXTtcblxuICAgICAgICBtYXBwZWRPYmpbbmV3S2V5XSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkT2JqO1xufTtcblxuZXhwb3J0cy5tYXBPYmogPSBtYXBPYmo7XG52YXIgVVBQRVJDQVNFX1JFID0gLyhbQS1aXSkvZztcbnZhciBVUFBFUkNBU0VfUkVfVE9fS0VCQUIgPSBmdW5jdGlvbiBVUFBFUkNBU0VfUkVfVE9fS0VCQUIobWF0Y2ggLyogOiBzdHJpbmcgKi8pIHtcbiAgICByZXR1cm4gKC8qIDogc3RyaW5nICovJy0nICsgbWF0Y2gudG9Mb3dlckNhc2UoKVxuICAgICk7XG59O1xuXG52YXIga2ViYWJpZnlTdHlsZU5hbWUgPSBmdW5jdGlvbiBrZWJhYmlmeVN0eWxlTmFtZShzdHJpbmcgLyogOiBzdHJpbmcgKi8pIC8qIDogc3RyaW5nICove1xuICAgIHZhciByZXN1bHQgPSBzdHJpbmcucmVwbGFjZShVUFBFUkNBU0VfUkUsIFVQUEVSQ0FTRV9SRV9UT19LRUJBQik7XG4gICAgaWYgKHJlc3VsdFswXSA9PT0gJ20nICYmIHJlc3VsdFsxXSA9PT0gJ3MnICYmIHJlc3VsdFsyXSA9PT0gJy0nKSB7XG4gICAgICAgIHJldHVybiAnLScgKyByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnRzLmtlYmFiaWZ5U3R5bGVOYW1lID0ga2ViYWJpZnlTdHlsZU5hbWU7XG4vKipcbiAqIENTUyBwcm9wZXJ0aWVzIHdoaWNoIGFjY2VwdCBudW1iZXJzIGJ1dCBhcmUgbm90IGluIHVuaXRzIG9mIFwicHhcIi5cbiAqIFRha2VuIGZyb20gUmVhY3QncyBDU1NQcm9wZXJ0eS5qc1xuICovXG52YXIgaXNVbml0bGVzc051bWJlciA9IHtcbiAgICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogdHJ1ZSxcbiAgICBib3JkZXJJbWFnZU91dHNldDogdHJ1ZSxcbiAgICBib3JkZXJJbWFnZVNsaWNlOiB0cnVlLFxuICAgIGJvcmRlckltYWdlV2lkdGg6IHRydWUsXG4gICAgYm94RmxleDogdHJ1ZSxcbiAgICBib3hGbGV4R3JvdXA6IHRydWUsXG4gICAgYm94T3JkaW5hbEdyb3VwOiB0cnVlLFxuICAgIGNvbHVtbkNvdW50OiB0cnVlLFxuICAgIGZsZXg6IHRydWUsXG4gICAgZmxleEdyb3c6IHRydWUsXG4gICAgZmxleFBvc2l0aXZlOiB0cnVlLFxuICAgIGZsZXhTaHJpbms6IHRydWUsXG4gICAgZmxleE5lZ2F0aXZlOiB0cnVlLFxuICAgIGZsZXhPcmRlcjogdHJ1ZSxcbiAgICBncmlkUm93OiB0cnVlLFxuICAgIGdyaWRDb2x1bW46IHRydWUsXG4gICAgZm9udFdlaWdodDogdHJ1ZSxcbiAgICBsaW5lQ2xhbXA6IHRydWUsXG4gICAgbGluZUhlaWdodDogdHJ1ZSxcbiAgICBvcGFjaXR5OiB0cnVlLFxuICAgIG9yZGVyOiB0cnVlLFxuICAgIG9ycGhhbnM6IHRydWUsXG4gICAgdGFiU2l6ZTogdHJ1ZSxcbiAgICB3aWRvd3M6IHRydWUsXG4gICAgekluZGV4OiB0cnVlLFxuICAgIHpvb206IHRydWUsXG5cbiAgICAvLyBTVkctcmVsYXRlZCBwcm9wZXJ0aWVzXG4gICAgZmlsbE9wYWNpdHk6IHRydWUsXG4gICAgZmxvb2RPcGFjaXR5OiB0cnVlLFxuICAgIHN0b3BPcGFjaXR5OiB0cnVlLFxuICAgIHN0cm9rZURhc2hhcnJheTogdHJ1ZSxcbiAgICBzdHJva2VEYXNob2Zmc2V0OiB0cnVlLFxuICAgIHN0cm9rZU1pdGVybGltaXQ6IHRydWUsXG4gICAgc3Ryb2tlT3BhY2l0eTogdHJ1ZSxcbiAgICBzdHJva2VXaWR0aDogdHJ1ZVxufTtcblxuLyoqXG4gKiBUYWtlbiBmcm9tIFJlYWN0J3MgQ1NTUHJvcGVydHkuanNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4IHZlbmRvci1zcGVjaWZpYyBwcmVmaXgsIGVnOiBXZWJraXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgc3R5bGUgbmFtZSwgZWc6IHRyYW5zaXRpb25EdXJhdGlvblxuICogQHJldHVybiB7c3RyaW5nfSBzdHlsZSBuYW1lIHByZWZpeGVkIHdpdGggYHByZWZpeGAsIHByb3Blcmx5IGNhbWVsQ2FzZWQsIGVnOlxuICogV2Via2l0VHJhbnNpdGlvbkR1cmF0aW9uXG4gKi9cbmZ1bmN0aW9uIHByZWZpeEtleShwcmVmaXgsIGtleSkge1xuICAgIHJldHVybiBwcmVmaXggKyBrZXkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXkuc3Vic3RyaW5nKDEpO1xufVxuXG4vKipcbiAqIFN1cHBvcnQgc3R5bGUgbmFtZXMgdGhhdCBtYXkgY29tZSBwYXNzZWQgaW4gcHJlZml4ZWQgYnkgYWRkaW5nIHBlcm11dGF0aW9uc1xuICogb2YgdmVuZG9yIHByZWZpeGVzLlxuICogVGFrZW4gZnJvbSBSZWFjdCdzIENTU1Byb3BlcnR5LmpzXG4gKi9cbnZhciBwcmVmaXhlcyA9IFsnV2Via2l0JywgJ21zJywgJ01veicsICdPJ107XG5cbi8vIFVzaW5nIE9iamVjdC5rZXlzIGhlcmUsIG9yIGVsc2UgdGhlIHZhbmlsbGEgZm9yLWluIGxvb3AgbWFrZXMgSUU4IGdvIGludG8gYW5cbi8vIGluZmluaXRlIGxvb3AsIGJlY2F1c2UgaXQgaXRlcmF0ZXMgb3ZlciB0aGUgbmV3bHkgYWRkZWQgcHJvcHMgdG9vLlxuLy8gVGFrZW4gZnJvbSBSZWFjdCdzIENTU1Byb3BlcnR5LmpzXG5PYmplY3Qua2V5cyhpc1VuaXRsZXNzTnVtYmVyKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgcHJlZml4ZXMuZm9yRWFjaChmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICAgIGlzVW5pdGxlc3NOdW1iZXJbcHJlZml4S2V5KHByZWZpeCwgcHJvcCldID0gaXNVbml0bGVzc051bWJlcltwcm9wXTtcbiAgICB9KTtcbn0pO1xuXG52YXIgc3RyaW5naWZ5VmFsdWUgPSBmdW5jdGlvbiBzdHJpbmdpZnlWYWx1ZShrZXksIC8qIDogc3RyaW5nICovXG5wcm9wIC8qIDogYW55ICovXG4pIC8qIDogc3RyaW5nICove1xuICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBpZiAoaXNVbml0bGVzc051bWJlcltrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIiArIHByb3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcCArIFwicHhcIjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnJyArIHByb3A7XG4gICAgfVxufTtcblxuZXhwb3J0cy5zdHJpbmdpZnlWYWx1ZSA9IHN0cmluZ2lmeVZhbHVlO1xudmFyIHN0cmluZ2lmeUFuZEltcG9ydGFudGlmeVZhbHVlID0gZnVuY3Rpb24gc3RyaW5naWZ5QW5kSW1wb3J0YW50aWZ5VmFsdWUoa2V5LCAvKiA6IHN0cmluZyAqL1xucHJvcCAvKiA6IGFueSAqL1xuKSB7XG4gICAgcmV0dXJuICgvKiA6IHN0cmluZyAqL2ltcG9ydGFudGlmeShzdHJpbmdpZnlWYWx1ZShrZXksIHByb3ApKVxuICAgICk7XG59O1xuXG5leHBvcnRzLnN0cmluZ2lmeUFuZEltcG9ydGFudGlmeVZhbHVlID0gc3RyaW5naWZ5QW5kSW1wb3J0YW50aWZ5VmFsdWU7XG4vLyBIYXNoIGEgamF2YXNjcmlwdCBvYmplY3QgdXNpbmcgSlNPTi5zdHJpbmdpZnkuIFRoaXMgaXMgdmVyeSBmYXN0LCBhYm91dCAzXG4vLyBtaWNyb3NlY29uZHMgb24gbXkgY29tcHV0ZXIgZm9yIGEgc2FtcGxlIG9iamVjdDpcbi8vIGh0dHA6Ly9qc3BlcmYuY29tL3Rlc3QtaGFzaGZudjMyYS1oYXNoLzVcbi8vXG4vLyBOb3RlIHRoYXQgdGhpcyB1c2VzIEpTT04uc3RyaW5naWZ5IHRvIHN0cmluZ2lmeSB0aGUgb2JqZWN0cyBzbyBpbiBvcmRlciBmb3Jcbi8vIHRoaXMgdG8gcHJvZHVjZSBjb25zaXN0ZW50IGhhc2hlcyBicm93c2VycyBuZWVkIHRvIGhhdmUgYSBjb25zaXN0ZW50XG4vLyBvcmRlcmluZyBvZiBvYmplY3RzLiBCZW4gQWxwZXJ0IHNheXMgdGhhdCBGYWNlYm9vayBkZXBlbmRzIG9uIHRoaXMsIHNvIHdlXG4vLyBjYW4gcHJvYmFibHkgZGVwZW5kIG9uIHRoaXMgdG9vLlxudmFyIGhhc2hPYmplY3QgPSBmdW5jdGlvbiBoYXNoT2JqZWN0KG9iamVjdCAvKiA6IE9iamVjdE1hcCAqLykge1xuICAgIHJldHVybiAoLyogOiBzdHJpbmcgKi8oMCwgX3N0cmluZ0hhc2gyWydkZWZhdWx0J10pKEpTT04uc3RyaW5naWZ5KG9iamVjdCkpLnRvU3RyaW5nKDM2KVxuICAgICk7XG59O1xuXG5leHBvcnRzLmhhc2hPYmplY3QgPSBoYXNoT2JqZWN0O1xuLy8gR2l2ZW4gYSBzaW5nbGUgc3R5bGUgdmFsdWUgc3RyaW5nIGxpa2UgdGhlIFwiYlwiIGZyb20gXCJhOiBiO1wiLCBhZGRzICFpbXBvcnRhbnRcbi8vIHRvIGdlbmVyYXRlIFwiYiAhaW1wb3J0YW50XCIuXG52YXIgaW1wb3J0YW50aWZ5ID0gZnVuY3Rpb24gaW1wb3J0YW50aWZ5KHN0cmluZyAvKiA6IHN0cmluZyAqLykge1xuICAgIHJldHVybiAoLyogOiBzdHJpbmcgKi9cbiAgICAgICAgLy8gQnJhY2tldCBzdHJpbmcgY2hhcmFjdGVyIGFjY2VzcyBpcyB2ZXJ5IGZhc3QsIGFuZCBpbiB0aGUgZGVmYXVsdCBjYXNlIHdlXG4gICAgICAgIC8vIG5vcm1hbGx5IGRvbid0IGV4cGVjdCB0aGVyZSB0byBiZSBcIiFpbXBvcnRhbnRcIiBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmdcbiAgICAgICAgLy8gc28gd2UgY2FuIHVzZSB0aGlzIHNpbXBsZSBjaGVjayB0byB0YWtlIGFuIG9wdGltaXplZCBwYXRoLiBJZiB0aGVyZVxuICAgICAgICAvLyBoYXBwZW5zIHRvIGJlIGEgXCIhXCIgaW4gdGhpcyBwb3NpdGlvbiwgd2UgZm9sbG93IHVwIHdpdGggYSBtb3JlIHRob3JvdWdoXG4gICAgICAgIC8vIGNoZWNrLlxuICAgICAgICBzdHJpbmdbc3RyaW5nLmxlbmd0aCAtIDEwXSA9PT0gJyEnICYmIHN0cmluZy5zbGljZSgtMTEpID09PSAnICFpbXBvcnRhbnQnID8gc3RyaW5nIDogc3RyaW5nICsgJyAhaW1wb3J0YW50J1xuICAgICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvbm8taW1wb3J0YW50LmpzJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gcmF3QXNhcCBwcm92aWRlcyBldmVyeXRoaW5nIHdlIG5lZWQgZXhjZXB0IGV4Y2VwdGlvbiBtYW5hZ2VtZW50LlxudmFyIHJhd0FzYXAgPSByZXF1aXJlKFwiLi9yYXdcIik7XG4vLyBSYXdUYXNrcyBhcmUgcmVjeWNsZWQgdG8gcmVkdWNlIEdDIGNodXJuLlxudmFyIGZyZWVUYXNrcyA9IFtdO1xuLy8gV2UgcXVldWUgZXJyb3JzIHRvIGVuc3VyZSB0aGV5IGFyZSB0aHJvd24gaW4gcmlnaHQgb3JkZXIgKEZJRk8pLlxuLy8gQXJyYXktYXMtcXVldWUgaXMgZ29vZCBlbm91Z2ggaGVyZSwgc2luY2Ugd2UgYXJlIGp1c3QgZGVhbGluZyB3aXRoIGV4Y2VwdGlvbnMuXG52YXIgcGVuZGluZ0Vycm9ycyA9IFtdO1xudmFyIHJlcXVlc3RFcnJvclRocm93ID0gcmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIodGhyb3dGaXJzdEVycm9yKTtcblxuZnVuY3Rpb24gdGhyb3dGaXJzdEVycm9yKCkge1xuICAgIGlmIChwZW5kaW5nRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBwZW5kaW5nRXJyb3JzLnNoaWZ0KCk7XG4gICAgfVxufVxuXG4vKipcbiAqIENhbGxzIGEgdGFzayBhcyBzb29uIGFzIHBvc3NpYmxlIGFmdGVyIHJldHVybmluZywgaW4gaXRzIG93biBldmVudCwgd2l0aCBwcmlvcml0eVxuICogb3ZlciBvdGhlciBldmVudHMgbGlrZSBhbmltYXRpb24sIHJlZmxvdywgYW5kIHJlcGFpbnQuIEFuIGVycm9yIHRocm93biBmcm9tIGFuXG4gKiBldmVudCB3aWxsIG5vdCBpbnRlcnJ1cHQsIG5vciBldmVuIHN1YnN0YW50aWFsbHkgc2xvdyBkb3duIHRoZSBwcm9jZXNzaW5nIG9mXG4gKiBvdGhlciBldmVudHMsIGJ1dCB3aWxsIGJlIHJhdGhlciBwb3N0cG9uZWQgdG8gYSBsb3dlciBwcmlvcml0eSBldmVudC5cbiAqIEBwYXJhbSB7e2NhbGx9fSB0YXNrIEEgY2FsbGFibGUgb2JqZWN0LCB0eXBpY2FsbHkgYSBmdW5jdGlvbiB0aGF0IHRha2VzIG5vXG4gKiBhcmd1bWVudHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gYXNhcDtcbmZ1bmN0aW9uIGFzYXAodGFzaykge1xuICAgIHZhciByYXdUYXNrO1xuICAgIGlmIChmcmVlVGFza3MubGVuZ3RoKSB7XG4gICAgICAgIHJhd1Rhc2sgPSBmcmVlVGFza3MucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmF3VGFzayA9IG5ldyBSYXdUYXNrKCk7XG4gICAgfVxuICAgIHJhd1Rhc2sudGFzayA9IHRhc2s7XG4gICAgcmF3QXNhcChyYXdUYXNrKTtcbn1cblxuLy8gV2Ugd3JhcCB0YXNrcyB3aXRoIHJlY3ljbGFibGUgdGFzayBvYmplY3RzLiAgQSB0YXNrIG9iamVjdCBpbXBsZW1lbnRzXG4vLyBgY2FsbGAsIGp1c3QgbGlrZSBhIGZ1bmN0aW9uLlxuZnVuY3Rpb24gUmF3VGFzaygpIHtcbiAgICB0aGlzLnRhc2sgPSBudWxsO1xufVxuXG4vLyBUaGUgc29sZSBwdXJwb3NlIG9mIHdyYXBwaW5nIHRoZSB0YXNrIGlzIHRvIGNhdGNoIHRoZSBleGNlcHRpb24gYW5kIHJlY3ljbGVcbi8vIHRoZSB0YXNrIG9iamVjdCBhZnRlciBpdHMgc2luZ2xlIHVzZS5cblJhd1Rhc2sucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgdGhpcy50YXNrLmNhbGwoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoYXNhcC5vbmVycm9yKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGhvb2sgZXhpc3RzIHB1cmVseSBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cbiAgICAgICAgICAgIC8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdFxuICAgICAgICAgICAgLy8gZGVwZW5kcyBvbiBpdHMgZXhpc3RlbmNlLlxuICAgICAgICAgICAgYXNhcC5vbmVycm9yKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEluIGEgd2ViIGJyb3dzZXIsIGV4Y2VwdGlvbnMgYXJlIG5vdCBmYXRhbC4gSG93ZXZlciwgdG8gYXZvaWRcbiAgICAgICAgICAgIC8vIHNsb3dpbmcgZG93biB0aGUgcXVldWUgb2YgcGVuZGluZyB0YXNrcywgd2UgcmV0aHJvdyB0aGUgZXJyb3IgaW4gYVxuICAgICAgICAgICAgLy8gbG93ZXIgcHJpb3JpdHkgdHVybi5cbiAgICAgICAgICAgIHBlbmRpbmdFcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgICByZXF1ZXN0RXJyb3JUaHJvdygpO1xuICAgICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy50YXNrID0gbnVsbDtcbiAgICAgICAgZnJlZVRhc2tzW2ZyZWVUYXNrcy5sZW5ndGhdID0gdGhpcztcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFVzZSB0aGUgZmFzdGVzdCBtZWFucyBwb3NzaWJsZSB0byBleGVjdXRlIGEgdGFzayBpbiBpdHMgb3duIHR1cm4sIHdpdGhcbi8vIHByaW9yaXR5IG92ZXIgb3RoZXIgZXZlbnRzIGluY2x1ZGluZyBJTywgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZWRyYXdcbi8vIGV2ZW50cyBpbiBicm93c2Vycy5cbi8vXG4vLyBBbiBleGNlcHRpb24gdGhyb3duIGJ5IGEgdGFzayB3aWxsIHBlcm1hbmVudGx5IGludGVycnVwdCB0aGUgcHJvY2Vzc2luZyBvZlxuLy8gc3Vic2VxdWVudCB0YXNrcy4gVGhlIGhpZ2hlciBsZXZlbCBgYXNhcGAgZnVuY3Rpb24gZW5zdXJlcyB0aGF0IGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duIGJ5IGEgdGFzaywgdGhhdCB0aGUgdGFzayBxdWV1ZSB3aWxsIGNvbnRpbnVlIGZsdXNoaW5nIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLCBidXQgaWYgeW91IHVzZSBgcmF3QXNhcGAgZGlyZWN0bHksIHlvdSBhcmUgcmVzcG9uc2libGUgdG9cbi8vIGVpdGhlciBlbnN1cmUgdGhhdCBubyBleGNlcHRpb25zIGFyZSB0aHJvd24gZnJvbSB5b3VyIHRhc2ssIG9yIHRvIG1hbnVhbGx5XG4vLyBjYWxsIGByYXdBc2FwLnJlcXVlc3RGbHVzaGAgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cbm1vZHVsZS5leHBvcnRzID0gcmF3QXNhcDtcbmZ1bmN0aW9uIHJhd0FzYXAodGFzaykge1xuICAgIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHJlcXVlc3RGbHVzaCgpO1xuICAgICAgICBmbHVzaGluZyA9IHRydWU7XG4gICAgfVxuICAgIC8vIEVxdWl2YWxlbnQgdG8gcHVzaCwgYnV0IGF2b2lkcyBhIGZ1bmN0aW9uIGNhbGwuXG4gICAgcXVldWVbcXVldWUubGVuZ3RoXSA9IHRhc2s7XG59XG5cbnZhciBxdWV1ZSA9IFtdO1xuLy8gT25jZSBhIGZsdXNoIGhhcyBiZWVuIHJlcXVlc3RlZCwgbm8gZnVydGhlciBjYWxscyB0byBgcmVxdWVzdEZsdXNoYCBhcmVcbi8vIG5lY2Vzc2FyeSB1bnRpbCB0aGUgbmV4dCBgZmx1c2hgIGNvbXBsZXRlcy5cbnZhciBmbHVzaGluZyA9IGZhbHNlO1xuLy8gYHJlcXVlc3RGbHVzaGAgaXMgYW4gaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgbWV0aG9kIHRoYXQgYXR0ZW1wdHMgdG8ga2lja1xuLy8gb2ZmIGEgYGZsdXNoYCBldmVudCBhcyBxdWlja2x5IGFzIHBvc3NpYmxlLiBgZmx1c2hgIHdpbGwgYXR0ZW1wdCB0byBleGhhdXN0XG4vLyB0aGUgZXZlbnQgcXVldWUgYmVmb3JlIHlpZWxkaW5nIHRvIHRoZSBicm93c2VyJ3Mgb3duIGV2ZW50IGxvb3AuXG52YXIgcmVxdWVzdEZsdXNoO1xuLy8gVGhlIHBvc2l0aW9uIG9mIHRoZSBuZXh0IHRhc2sgdG8gZXhlY3V0ZSBpbiB0aGUgdGFzayBxdWV1ZS4gVGhpcyBpc1xuLy8gcHJlc2VydmVkIGJldHdlZW4gY2FsbHMgdG8gYGZsdXNoYCBzbyB0aGF0IGl0IGNhbiBiZSByZXN1bWVkIGlmXG4vLyBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbnZhciBpbmRleCA9IDA7XG4vLyBJZiBhIHRhc2sgc2NoZWR1bGVzIGFkZGl0aW9uYWwgdGFza3MgcmVjdXJzaXZlbHksIHRoZSB0YXNrIHF1ZXVlIGNhbiBncm93XG4vLyB1bmJvdW5kZWQuIFRvIHByZXZlbnQgbWVtb3J5IGV4aGF1c3Rpb24sIHRoZSB0YXNrIHF1ZXVlIHdpbGwgcGVyaW9kaWNhbGx5XG4vLyB0cnVuY2F0ZSBhbHJlYWR5LWNvbXBsZXRlZCB0YXNrcy5cbnZhciBjYXBhY2l0eSA9IDEwMjQ7XG5cbi8vIFRoZSBmbHVzaCBmdW5jdGlvbiBwcm9jZXNzZXMgYWxsIHRhc2tzIHRoYXQgaGF2ZSBiZWVuIHNjaGVkdWxlZCB3aXRoXG4vLyBgcmF3QXNhcGAgdW5sZXNzIGFuZCB1bnRpbCBvbmUgb2YgdGhvc2UgdGFza3MgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbi8vIElmIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLCBgZmx1c2hgIGVuc3VyZXMgdGhhdCBpdHMgc3RhdGUgd2lsbCByZW1haW5cbi8vIGNvbnNpc3RlbnQgYW5kIHdpbGwgcmVzdW1lIHdoZXJlIGl0IGxlZnQgb2ZmIHdoZW4gY2FsbGVkIGFnYWluLlxuLy8gSG93ZXZlciwgYGZsdXNoYCBkb2VzIG5vdCBtYWtlIGFueSBhcnJhbmdlbWVudHMgdG8gYmUgY2FsbGVkIGFnYWluIGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duLlxuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgd2hpbGUgKGluZGV4IDwgcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgLy8gQWR2YW5jZSB0aGUgaW5kZXggYmVmb3JlIGNhbGxpbmcgdGhlIHRhc2suIFRoaXMgZW5zdXJlcyB0aGF0IHdlIHdpbGxcbiAgICAgICAgLy8gYmVnaW4gZmx1c2hpbmcgb24gdGhlIG5leHQgdGFzayB0aGUgdGFzayB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICAgIGluZGV4ID0gaW5kZXggKyAxO1xuICAgICAgICBxdWV1ZVtjdXJyZW50SW5kZXhdLmNhbGwoKTtcbiAgICAgICAgLy8gUHJldmVudCBsZWFraW5nIG1lbW9yeSBmb3IgbG9uZyBjaGFpbnMgb2YgcmVjdXJzaXZlIGNhbGxzIHRvIGBhc2FwYC5cbiAgICAgICAgLy8gSWYgd2UgY2FsbCBgYXNhcGAgd2l0aGluIHRhc2tzIHNjaGVkdWxlZCBieSBgYXNhcGAsIHRoZSBxdWV1ZSB3aWxsXG4gICAgICAgIC8vIGdyb3csIGJ1dCB0byBhdm9pZCBhbiBPKG4pIHdhbGsgZm9yIGV2ZXJ5IHRhc2sgd2UgZXhlY3V0ZSwgd2UgZG9uJ3RcbiAgICAgICAgLy8gc2hpZnQgdGFza3Mgb2ZmIHRoZSBxdWV1ZSBhZnRlciB0aGV5IGhhdmUgYmVlbiBleGVjdXRlZC5cbiAgICAgICAgLy8gSW5zdGVhZCwgd2UgcGVyaW9kaWNhbGx5IHNoaWZ0IDEwMjQgdGFza3Mgb2ZmIHRoZSBxdWV1ZS5cbiAgICAgICAgaWYgKGluZGV4ID4gY2FwYWNpdHkpIHtcbiAgICAgICAgICAgIC8vIE1hbnVhbGx5IHNoaWZ0IGFsbCB2YWx1ZXMgc3RhcnRpbmcgYXQgdGhlIGluZGV4IGJhY2sgdG8gdGhlXG4gICAgICAgICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlLlxuICAgICAgICAgICAgZm9yICh2YXIgc2NhbiA9IDAsIG5ld0xlbmd0aCA9IHF1ZXVlLmxlbmd0aCAtIGluZGV4OyBzY2FuIDwgbmV3TGVuZ3RoOyBzY2FuKyspIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVtzY2FuXSA9IHF1ZXVlW3NjYW4gKyBpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5sZW5ndGggLT0gaW5kZXg7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICBpbmRleCA9IDA7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgaXMgaW1wbGVtZW50ZWQgdXNpbmcgYSBzdHJhdGVneSBiYXNlZCBvbiBkYXRhIGNvbGxlY3RlZCBmcm9tXG4vLyBldmVyeSBhdmFpbGFibGUgU2F1Y2VMYWJzIFNlbGVuaXVtIHdlYiBkcml2ZXIgd29ya2VyIGF0IHRpbWUgb2Ygd3JpdGluZy5cbi8vIGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzFtRy01VVlHdXA1cXhHZEVNV2toUDZCV0N6MDUzTlViMkUxUW9VVFUxNnVBL2VkaXQjZ2lkPTc4MzcyNDU5M1xuXG4vLyBTYWZhcmkgNiBhbmQgNi4xIGZvciBkZXNrdG9wLCBpUGFkLCBhbmQgaVBob25lIGFyZSB0aGUgb25seSBicm93c2VycyB0aGF0XG4vLyBoYXZlIFdlYktpdE11dGF0aW9uT2JzZXJ2ZXIgYnV0IG5vdCB1bi1wcmVmaXhlZCBNdXRhdGlvbk9ic2VydmVyLlxuLy8gTXVzdCB1c2UgYGdsb2JhbGAgb3IgYHNlbGZgIGluc3RlYWQgb2YgYHdpbmRvd2AgdG8gd29yayBpbiBib3RoIGZyYW1lcyBhbmQgd2ViXG4vLyB3b3JrZXJzLiBgZ2xvYmFsYCBpcyBhIHByb3Zpc2lvbiBvZiBCcm93c2VyaWZ5LCBNciwgTXJzLCBvciBNb3AuXG5cbi8qIGdsb2JhbHMgc2VsZiAqL1xudmFyIHNjb3BlID0gdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHNlbGY7XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBzY29wZS5NdXRhdGlvbk9ic2VydmVyIHx8IHNjb3BlLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cbi8vIE11dGF0aW9uT2JzZXJ2ZXJzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGhhdmUgaGlnaCBwcmlvcml0eSBhbmQgd29ya1xuLy8gcmVsaWFibHkgZXZlcnl3aGVyZSB0aGV5IGFyZSBpbXBsZW1lbnRlZC5cbi8vIFRoZXkgYXJlIGltcGxlbWVudGVkIGluIGFsbCBtb2Rlcm4gYnJvd3NlcnMuXG4vL1xuLy8gLSBBbmRyb2lkIDQtNC4zXG4vLyAtIENocm9tZSAyNi0zNFxuLy8gLSBGaXJlZm94IDE0LTI5XG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDExXG4vLyAtIGlQYWQgU2FmYXJpIDYtNy4xXG4vLyAtIGlQaG9uZSBTYWZhcmkgNy03LjFcbi8vIC0gU2FmYXJpIDYtN1xuaWYgKHR5cGVvZiBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuXG4vLyBNZXNzYWdlQ2hhbm5lbHMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgZ2l2ZSBkaXJlY3QgYWNjZXNzIHRvIHRoZSBIVE1MXG4vLyB0YXNrIHF1ZXVlLCBhcmUgaW1wbGVtZW50ZWQgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAsIFNhZmFyaSA1LjAtMSwgYW5kIE9wZXJhXG4vLyAxMS0xMiwgYW5kIGluIHdlYiB3b3JrZXJzIGluIG1hbnkgZW5naW5lcy5cbi8vIEFsdGhvdWdoIG1lc3NhZ2UgY2hhbm5lbHMgeWllbGQgdG8gYW55IHF1ZXVlZCByZW5kZXJpbmcgYW5kIElPIHRhc2tzLCB0aGV5XG4vLyB3b3VsZCBiZSBiZXR0ZXIgdGhhbiBpbXBvc2luZyB0aGUgNG1zIGRlbGF5IG9mIHRpbWVycy5cbi8vIEhvd2V2ZXIsIHRoZXkgZG8gbm90IHdvcmsgcmVsaWFibHkgaW4gSW50ZXJuZXQgRXhwbG9yZXIgb3IgU2FmYXJpLlxuXG4vLyBJbnRlcm5ldCBFeHBsb3JlciAxMCBpcyB0aGUgb25seSBicm93c2VyIHRoYXQgaGFzIHNldEltbWVkaWF0ZSBidXQgZG9lc1xuLy8gbm90IGhhdmUgTXV0YXRpb25PYnNlcnZlcnMuXG4vLyBBbHRob3VnaCBzZXRJbW1lZGlhdGUgeWllbGRzIHRvIHRoZSBicm93c2VyJ3MgcmVuZGVyZXIsIGl0IHdvdWxkIGJlXG4vLyBwcmVmZXJyYWJsZSB0byBmYWxsaW5nIGJhY2sgdG8gc2V0VGltZW91dCBzaW5jZSBpdCBkb2VzIG5vdCBoYXZlXG4vLyB0aGUgbWluaW11bSA0bXMgcGVuYWx0eS5cbi8vIFVuZm9ydHVuYXRlbHkgdGhlcmUgYXBwZWFycyB0byBiZSBhIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCBNb2JpbGUgKGFuZFxuLy8gRGVza3RvcCB0byBhIGxlc3NlciBleHRlbnQpIHRoYXQgcmVuZGVycyBib3RoIHNldEltbWVkaWF0ZSBhbmRcbi8vIE1lc3NhZ2VDaGFubmVsIHVzZWxlc3MgZm9yIHRoZSBwdXJwb3NlcyBvZiBBU0FQLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL2lzc3Vlcy8zOTZcblxuLy8gVGltZXJzIGFyZSBpbXBsZW1lbnRlZCB1bml2ZXJzYWxseS5cbi8vIFdlIGZhbGwgYmFjayB0byB0aW1lcnMgaW4gd29ya2VycyBpbiBtb3N0IGVuZ2luZXMsIGFuZCBpbiBmb3JlZ3JvdW5kXG4vLyBjb250ZXh0cyBpbiB0aGUgZm9sbG93aW5nIGJyb3dzZXJzLlxuLy8gSG93ZXZlciwgbm90ZSB0aGF0IGV2ZW4gdGhpcyBzaW1wbGUgY2FzZSByZXF1aXJlcyBudWFuY2VzIHRvIG9wZXJhdGUgaW4gYVxuLy8gYnJvYWQgc3BlY3RydW0gb2YgYnJvd3NlcnMuXG4vL1xuLy8gLSBGaXJlZm94IDMtMTNcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi05XG4vLyAtIGlQYWQgU2FmYXJpIDQuM1xuLy8gLSBMeW54IDIuOC43XG59IGVsc2Uge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihmbHVzaCk7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIHJlcXVlc3RzIHRoYXQgdGhlIGhpZ2ggcHJpb3JpdHkgZXZlbnQgcXVldWUgYmUgZmx1c2hlZCBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZS5cbi8vIFRoaXMgaXMgdXNlZnVsIHRvIHByZXZlbnQgYW4gZXJyb3IgdGhyb3duIGluIGEgdGFzayBmcm9tIHN0YWxsaW5nIHRoZSBldmVudFxuLy8gcXVldWUgaWYgdGhlIGV4Y2VwdGlvbiBoYW5kbGVkIGJ5IE5vZGUuanPigJlzXG4vLyBgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIpYCBvciBieSBhIGRvbWFpbi5cbnJhd0FzYXAucmVxdWVzdEZsdXNoID0gcmVxdWVzdEZsdXNoO1xuXG4vLyBUbyByZXF1ZXN0IGEgaGlnaCBwcmlvcml0eSBldmVudCwgd2UgaW5kdWNlIGEgbXV0YXRpb24gb2JzZXJ2ZXIgYnkgdG9nZ2xpbmdcbi8vIHRoZSB0ZXh0IG9mIGEgdGV4dCBub2RlIGJldHdlZW4gXCIxXCIgYW5kIFwiLTFcIi5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRvZ2dsZSA9IDE7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIHRvZ2dsZSA9IC10b2dnbGU7XG4gICAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZTtcbiAgICB9O1xufVxuXG4vLyBUaGUgbWVzc2FnZSBjaGFubmVsIHRlY2huaXF1ZSB3YXMgZGlzY292ZXJlZCBieSBNYWx0ZSBVYmwgYW5kIHdhcyB0aGVcbi8vIG9yaWdpbmFsIGZvdW5kYXRpb24gZm9yIHRoaXMgbGlicmFyeS5cbi8vIGh0dHA6Ly93d3cubm9uYmxvY2tpbmcuaW8vMjAxMS8wNi93aW5kb3duZXh0dGljay5odG1sXG5cbi8vIFNhZmFyaSA2LjAuNSAoYXQgbGVhc3QpIGludGVybWl0dGVudGx5IGZhaWxzIHRvIGNyZWF0ZSBtZXNzYWdlIHBvcnRzIG9uIGFcbi8vIHBhZ2UncyBmaXJzdCBsb2FkLiBUaGFua2Z1bGx5LCB0aGlzIHZlcnNpb24gb2YgU2FmYXJpIHN1cHBvcnRzXG4vLyBNdXRhdGlvbk9ic2VydmVycywgc28gd2UgZG9uJ3QgbmVlZCB0byBmYWxsIGJhY2sgaW4gdGhhdCBjYXNlLlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTWVzc2FnZUNoYW5uZWwoY2FsbGJhY2spIHtcbi8vICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuLy8gICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gY2FsbGJhY2s7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIEZvciByZWFzb25zIGV4cGxhaW5lZCBhYm92ZSwgd2UgYXJlIGFsc28gdW5hYmxlIHRvIHVzZSBgc2V0SW1tZWRpYXRlYFxuLy8gdW5kZXIgYW55IGNpcmN1bXN0YW5jZXMuXG4vLyBFdmVuIGlmIHdlIHdlcmUsIHRoZXJlIGlzIGFub3RoZXIgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwLlxuLy8gSXQgaXMgbm90IHN1ZmZpY2llbnQgdG8gYXNzaWduIGBzZXRJbW1lZGlhdGVgIHRvIGByZXF1ZXN0Rmx1c2hgIGJlY2F1c2Vcbi8vIGBzZXRJbW1lZGlhdGVgIG11c3QgYmUgY2FsbGVkICpieSBuYW1lKiBhbmQgdGhlcmVmb3JlIG11c3QgYmUgd3JhcHBlZCBpbiBhXG4vLyBjbG9zdXJlLlxuLy8gTmV2ZXIgZm9yZ2V0LlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tU2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBzZXRJbW1lZGlhdGUoY2FsbGJhY2spO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIFNhZmFyaSA2LjAgaGFzIGEgcHJvYmxlbSB3aGVyZSB0aW1lcnMgd2lsbCBnZXQgbG9zdCB3aGlsZSB0aGUgdXNlciBpc1xuLy8gc2Nyb2xsaW5nLiBUaGlzIHByb2JsZW0gZG9lcyBub3QgaW1wYWN0IEFTQVAgYmVjYXVzZSBTYWZhcmkgNi4wIHN1cHBvcnRzXG4vLyBtdXRhdGlvbiBvYnNlcnZlcnMsIHNvIHRoYXQgaW1wbGVtZW50YXRpb24gaXMgdXNlZCBpbnN0ZWFkLlxuLy8gSG93ZXZlciwgaWYgd2UgZXZlciBlbGVjdCB0byB1c2UgdGltZXJzIGluIFNhZmFyaSwgdGhlIHByZXZhbGVudCB3b3JrLWFyb3VuZFxuLy8gaXMgdG8gYWRkIGEgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIHRoYXQgY2FsbHMgZm9yIGEgZmx1c2guXG5cbi8vIGBzZXRUaW1lb3V0YCBkb2VzIG5vdCBjYWxsIHRoZSBwYXNzZWQgY2FsbGJhY2sgaWYgdGhlIGRlbGF5IGlzIGxlc3MgdGhhblxuLy8gYXBwcm94aW1hdGVseSA3IGluIHdlYiB3b3JrZXJzIGluIEZpcmVmb3ggOCB0aHJvdWdoIDE4LCBhbmQgc29tZXRpbWVzIG5vdFxuLy8gZXZlbiB0aGVuLlxuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIC8vIFdlIGRpc3BhdGNoIGEgdGltZW91dCB3aXRoIGEgc3BlY2lmaWVkIGRlbGF5IG9mIDAgZm9yIGVuZ2luZXMgdGhhdFxuICAgICAgICAvLyBjYW4gcmVsaWFibHkgYWNjb21tb2RhdGUgdGhhdCByZXF1ZXN0LiBUaGlzIHdpbGwgdXN1YWxseSBiZSBzbmFwcGVkXG4gICAgICAgIC8vIHRvIGEgNCBtaWxpc2Vjb25kIGRlbGF5LCBidXQgb25jZSB3ZSdyZSBmbHVzaGluZywgdGhlcmUncyBubyBkZWxheVxuICAgICAgICAvLyBiZXR3ZWVuIGV2ZW50cy5cbiAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGhhbmRsZVRpbWVyLCAwKTtcbiAgICAgICAgLy8gSG93ZXZlciwgc2luY2UgdGhpcyB0aW1lciBnZXRzIGZyZXF1ZW50bHkgZHJvcHBlZCBpbiBGaXJlZm94XG4gICAgICAgIC8vIHdvcmtlcnMsIHdlIGVubGlzdCBhbiBpbnRlcnZhbCBoYW5kbGUgdGhhdCB3aWxsIHRyeSB0byBmaXJlXG4gICAgICAgIC8vIGFuIGV2ZW50IDIwIHRpbWVzIHBlciBzZWNvbmQgdW50aWwgaXQgc3VjY2VlZHMuXG4gICAgICAgIHZhciBpbnRlcnZhbEhhbmRsZSA9IHNldEludGVydmFsKGhhbmRsZVRpbWVyLCA1MCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGltZXIoKSB7XG4gICAgICAgICAgICAvLyBXaGljaGV2ZXIgdGltZXIgc3VjY2VlZHMgd2lsbCBjYW5jZWwgYm90aCB0aW1lcnMgYW5kXG4gICAgICAgICAgICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SGFuZGxlKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxIYW5kbGUpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIFRoaXMgaXMgZm9yIGBhc2FwLmpzYCBvbmx5LlxuLy8gSXRzIG5hbWUgd2lsbCBiZSBwZXJpb2RpY2FsbHkgcmFuZG9taXplZCB0byBicmVhayBhbnkgY29kZSB0aGF0IGRlcGVuZHMgb25cbi8vIGl0cyBleGlzdGVuY2UuXG5yYXdBc2FwLm1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lciA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcjtcblxuLy8gQVNBUCB3YXMgb3JpZ2luYWxseSBhIG5leHRUaWNrIHNoaW0gaW5jbHVkZWQgaW4gUS4gVGhpcyB3YXMgZmFjdG9yZWQgb3V0XG4vLyBpbnRvIHRoaXMgQVNBUCBwYWNrYWdlLiBJdCB3YXMgbGF0ZXIgYWRhcHRlZCB0byBSU1ZQIHdoaWNoIG1hZGUgZnVydGhlclxuLy8gYW1lbmRtZW50cy4gVGhlc2UgZGVjaXNpb25zLCBwYXJ0aWN1bGFybHkgdG8gbWFyZ2luYWxpemUgTWVzc2FnZUNoYW5uZWwgYW5kXG4vLyB0byBjYXB0dXJlIHRoZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIGluIGEgY2xvc3VyZSwgd2VyZSBpbnRlZ3JhdGVkXG4vLyBiYWNrIGludG8gQVNBUCBwcm9wZXIuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGlsZGVpby9yc3ZwLmpzL2Jsb2IvY2RkZjcyMzI1NDZhOWNmODU4NTI0Yjc1Y2RlNmY5ZWRmNzI2MjBhNy9saWIvcnN2cC9hc2FwLmpzXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBoeXBoZW5hdGVQcm9wZXJ0eTtcblxudmFyIF9oeXBoZW5hdGVTdHlsZU5hbWUgPSByZXF1aXJlKCdoeXBoZW5hdGUtc3R5bGUtbmFtZScpO1xuXG52YXIgX2h5cGhlbmF0ZVN0eWxlTmFtZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oeXBoZW5hdGVTdHlsZU5hbWUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBoeXBoZW5hdGVQcm9wZXJ0eShwcm9wZXJ0eSkge1xuICByZXR1cm4gKDAsIF9oeXBoZW5hdGVTdHlsZU5hbWUyLmRlZmF1bHQpKHByb3BlcnR5KTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGlzUHJlZml4ZWRWYWx1ZTtcblxudmFyIHJlZ2V4ID0gLy13ZWJraXQtfC1tb3otfC1tcy0vO1xuXG5mdW5jdGlvbiBpc1ByZWZpeGVkVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgcmVnZXgudGVzdCh2YWx1ZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1cHBlcmNhc2VQYXR0ZXJuID0gL1tBLVpdL2c7XG52YXIgbXNQYXR0ZXJuID0gL15tcy0vO1xudmFyIGNhY2hlID0ge307XG5cbmZ1bmN0aW9uIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nIGluIGNhY2hlXG4gICAgPyBjYWNoZVtzdHJpbmddXG4gICAgOiBjYWNoZVtzdHJpbmddID0gc3RyaW5nXG4gICAgICAucmVwbGFjZSh1cHBlcmNhc2VQYXR0ZXJuLCAnLSQmJylcbiAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAucmVwbGFjZShtc1BhdHRlcm4sICctbXMtJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwaGVuYXRlU3R5bGVOYW1lO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlUHJlZml4ZXI7XG5cbnZhciBfcHJlZml4UHJvcGVydHkgPSByZXF1aXJlKCcuLi91dGlscy9wcmVmaXhQcm9wZXJ0eScpO1xuXG52YXIgX3ByZWZpeFByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ByZWZpeFByb3BlcnR5KTtcblxudmFyIF9wcmVmaXhWYWx1ZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3ByZWZpeFZhbHVlJyk7XG5cbnZhciBfcHJlZml4VmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJlZml4VmFsdWUpO1xuXG52YXIgX2FkZE5ld1ZhbHVlc09ubHkgPSByZXF1aXJlKCcuLi91dGlscy9hZGROZXdWYWx1ZXNPbmx5Jyk7XG5cbnZhciBfYWRkTmV3VmFsdWVzT25seTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hZGROZXdWYWx1ZXNPbmx5KTtcblxudmFyIF9pc09iamVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzT2JqZWN0Jyk7XG5cbnZhciBfaXNPYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNPYmplY3QpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBjcmVhdGVQcmVmaXhlcihfcmVmKSB7XG4gIHZhciBwcmVmaXhNYXAgPSBfcmVmLnByZWZpeE1hcCxcbiAgICAgIHBsdWdpbnMgPSBfcmVmLnBsdWdpbnM7XG5cbiAgZnVuY3Rpb24gcHJlZml4QWxsKHN0eWxlKSB7XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc3R5bGUpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHN0eWxlW3Byb3BlcnR5XTtcblxuICAgICAgLy8gaGFuZGxlIG5lc3RlZCBvYmplY3RzXG4gICAgICBpZiAoKDAsIF9pc09iamVjdDIuZGVmYXVsdCkodmFsdWUpKSB7XG4gICAgICAgIHN0eWxlW3Byb3BlcnR5XSA9IHByZWZpeEFsbCh2YWx1ZSk7XG4gICAgICAgIC8vIGhhbmRsZSBhcnJheSB2YWx1ZXNcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFyIGNvbWJpbmVkVmFsdWUgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICB2YXIgcHJvY2Vzc2VkVmFsdWUgPSAoMCwgX3ByZWZpeFZhbHVlMi5kZWZhdWx0KShwbHVnaW5zLCBwcm9wZXJ0eSwgdmFsdWVbaV0sIHN0eWxlLCBwcmVmaXhNYXApO1xuICAgICAgICAgICgwLCBfYWRkTmV3VmFsdWVzT25seTIuZGVmYXVsdCkoY29tYmluZWRWYWx1ZSwgcHJvY2Vzc2VkVmFsdWUgfHwgdmFsdWVbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb25seSBtb2RpZnkgdGhlIHZhbHVlIGlmIGl0IHdhcyB0b3VjaGVkXG4gICAgICAgIC8vIGJ5IGFueSBwbHVnaW4gdG8gcHJldmVudCB1bm5lY2Vzc2FyeSBtdXRhdGlvbnNcbiAgICAgICAgaWYgKGNvbWJpbmVkVmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHN0eWxlW3Byb3BlcnR5XSA9IGNvbWJpbmVkVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBfcHJvY2Vzc2VkVmFsdWUgPSAoMCwgX3ByZWZpeFZhbHVlMi5kZWZhdWx0KShwbHVnaW5zLCBwcm9wZXJ0eSwgdmFsdWUsIHN0eWxlLCBwcmVmaXhNYXApO1xuXG4gICAgICAgIC8vIG9ubHkgbW9kaWZ5IHRoZSB2YWx1ZSBpZiBpdCB3YXMgdG91Y2hlZFxuICAgICAgICAvLyBieSBhbnkgcGx1Z2luIHRvIHByZXZlbnQgdW5uZWNlc3NhcnkgbXV0YXRpb25zXG4gICAgICAgIGlmIChfcHJvY2Vzc2VkVmFsdWUpIHtcbiAgICAgICAgICBzdHlsZVtwcm9wZXJ0eV0gPSBfcHJvY2Vzc2VkVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICAoMCwgX3ByZWZpeFByb3BlcnR5Mi5kZWZhdWx0KShwcmVmaXhNYXAsIHByb3BlcnR5LCBzdHlsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlO1xuICB9XG5cbiAgcmV0dXJuIHByZWZpeEFsbDtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNhbGM7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQcmVmaXhlZFZhbHVlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHByZWZpeGVzID0gWyctd2Via2l0LScsICctbW96LScsICcnXTtcbmZ1bmN0aW9uIGNhbGMocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICEoMCwgX2lzUHJlZml4ZWRWYWx1ZTIuZGVmYXVsdCkodmFsdWUpICYmIHZhbHVlLmluZGV4T2YoJ2NhbGMoJykgPiAtMSkge1xuICAgIHJldHVybiBwcmVmaXhlcy5tYXAoZnVuY3Rpb24gKHByZWZpeCkge1xuICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoL2NhbGNcXCgvZywgcHJlZml4ICsgJ2NhbGMoJyk7XG4gICAgfSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNyb3NzRmFkZTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUgPSByZXF1aXJlKCdjc3MtaW4tanMtdXRpbHMvbGliL2lzUHJlZml4ZWRWYWx1ZScpO1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1ByZWZpeGVkVmFsdWUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vLyBodHRwOi8vY2FuaXVzZS5jb20vI3NlYXJjaD1jcm9zcy1mYWRlXG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJyddO1xuZnVuY3Rpb24gY3Jvc3NGYWRlKHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAhKDAsIF9pc1ByZWZpeGVkVmFsdWUyLmRlZmF1bHQpKHZhbHVlKSAmJiB2YWx1ZS5pbmRleE9mKCdjcm9zcy1mYWRlKCcpID4gLTEpIHtcbiAgICByZXR1cm4gcHJlZml4ZXMubWFwKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9jcm9zcy1mYWRlXFwoL2csIHByZWZpeCArICdjcm9zcy1mYWRlKCcpO1xuICAgIH0pO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjdXJzb3I7XG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJy1tb3otJywgJyddO1xuXG52YXIgdmFsdWVzID0ge1xuICAnem9vbS1pbic6IHRydWUsXG4gICd6b29tLW91dCc6IHRydWUsXG4gIGdyYWI6IHRydWUsXG4gIGdyYWJiaW5nOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBjdXJzb3IocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChwcm9wZXJ0eSA9PT0gJ2N1cnNvcicgJiYgdmFsdWVzLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuICAgIHJldHVybiBwcmVmaXhlcy5tYXAoZnVuY3Rpb24gKHByZWZpeCkge1xuICAgICAgcmV0dXJuIHByZWZpeCArIHZhbHVlO1xuICAgIH0pO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBmaWx0ZXI7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQcmVmaXhlZFZhbHVlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLy8gaHR0cDovL2Nhbml1c2UuY29tLyNmZWF0PWNzcy1maWx0ZXItZnVuY3Rpb25cbnZhciBwcmVmaXhlcyA9IFsnLXdlYmtpdC0nLCAnJ107XG5mdW5jdGlvbiBmaWx0ZXIocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICEoMCwgX2lzUHJlZml4ZWRWYWx1ZTIuZGVmYXVsdCkodmFsdWUpICYmIHZhbHVlLmluZGV4T2YoJ2ZpbHRlcignKSA+IC0xKSB7XG4gICAgcmV0dXJuIHByZWZpeGVzLm1hcChmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvZmlsdGVyXFwoL2csIHByZWZpeCArICdmaWx0ZXIoJyk7XG4gICAgfSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZsZXg7XG52YXIgdmFsdWVzID0ge1xuICBmbGV4OiB0cnVlLFxuICAnaW5saW5lLWZsZXgnOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBmbGV4KHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAocHJvcGVydHkgPT09ICdkaXNwbGF5JyAmJiB2YWx1ZXMuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG4gICAgcmV0dXJuIFsnLXdlYmtpdC1ib3gnLCAnLW1vei1ib3gnLCAnLW1zLScgKyB2YWx1ZSArICdib3gnLCAnLXdlYmtpdC0nICsgdmFsdWUsIHZhbHVlXTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZmxleGJveElFO1xudmFyIGFsdGVybmF0aXZlVmFsdWVzID0ge1xuICAnc3BhY2UtYXJvdW5kJzogJ2Rpc3RyaWJ1dGUnLFxuICAnc3BhY2UtYmV0d2Vlbic6ICdqdXN0aWZ5JyxcbiAgJ2ZsZXgtc3RhcnQnOiAnc3RhcnQnLFxuICAnZmxleC1lbmQnOiAnZW5kJ1xufTtcbnZhciBhbHRlcm5hdGl2ZVByb3BzID0ge1xuICBhbGlnbkNvbnRlbnQ6ICdtc0ZsZXhMaW5lUGFjaycsXG4gIGFsaWduU2VsZjogJ21zRmxleEl0ZW1BbGlnbicsXG4gIGFsaWduSXRlbXM6ICdtc0ZsZXhBbGlnbicsXG4gIGp1c3RpZnlDb250ZW50OiAnbXNGbGV4UGFjaycsXG4gIG9yZGVyOiAnbXNGbGV4T3JkZXInLFxuICBmbGV4R3JvdzogJ21zRmxleFBvc2l0aXZlJyxcbiAgZmxleFNocmluazogJ21zRmxleE5lZ2F0aXZlJyxcbiAgZmxleEJhc2lzOiAnbXNQcmVmZXJyZWRTaXplJ1xufTtcblxuZnVuY3Rpb24gZmxleGJveElFKHByb3BlcnR5LCB2YWx1ZSwgc3R5bGUpIHtcbiAgaWYgKGFsdGVybmF0aXZlUHJvcHMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgc3R5bGVbYWx0ZXJuYXRpdmVQcm9wc1twcm9wZXJ0eV1dID0gYWx0ZXJuYXRpdmVWYWx1ZXNbdmFsdWVdIHx8IHZhbHVlO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBmbGV4Ym94T2xkO1xudmFyIGFsdGVybmF0aXZlVmFsdWVzID0ge1xuICAnc3BhY2UtYXJvdW5kJzogJ2p1c3RpZnknLFxuICAnc3BhY2UtYmV0d2Vlbic6ICdqdXN0aWZ5JyxcbiAgJ2ZsZXgtc3RhcnQnOiAnc3RhcnQnLFxuICAnZmxleC1lbmQnOiAnZW5kJyxcbiAgJ3dyYXAtcmV2ZXJzZSc6ICdtdWx0aXBsZScsXG4gIHdyYXA6ICdtdWx0aXBsZSdcbn07XG5cbnZhciBhbHRlcm5hdGl2ZVByb3BzID0ge1xuICBhbGlnbkl0ZW1zOiAnV2Via2l0Qm94QWxpZ24nLFxuICBqdXN0aWZ5Q29udGVudDogJ1dlYmtpdEJveFBhY2snLFxuICBmbGV4V3JhcDogJ1dlYmtpdEJveExpbmVzJ1xufTtcblxuZnVuY3Rpb24gZmxleGJveE9sZChwcm9wZXJ0eSwgdmFsdWUsIHN0eWxlKSB7XG4gIGlmIChwcm9wZXJ0eSA9PT0gJ2ZsZXhEaXJlY3Rpb24nICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodmFsdWUuaW5kZXhPZignY29sdW1uJykgPiAtMSkge1xuICAgICAgc3R5bGUuV2Via2l0Qm94T3JpZW50ID0gJ3ZlcnRpY2FsJztcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuV2Via2l0Qm94T3JpZW50ID0gJ2hvcml6b250YWwnO1xuICAgIH1cbiAgICBpZiAodmFsdWUuaW5kZXhPZigncmV2ZXJzZScpID4gLTEpIHtcbiAgICAgIHN0eWxlLldlYmtpdEJveERpcmVjdGlvbiA9ICdyZXZlcnNlJztcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuV2Via2l0Qm94RGlyZWN0aW9uID0gJ25vcm1hbCc7XG4gICAgfVxuICB9XG4gIGlmIChhbHRlcm5hdGl2ZVByb3BzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgIHN0eWxlW2FsdGVybmF0aXZlUHJvcHNbcHJvcGVydHldXSA9IGFsdGVybmF0aXZlVmFsdWVzW3ZhbHVlXSB8fCB2YWx1ZTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZ3JhZGllbnQ7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQcmVmaXhlZFZhbHVlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHByZWZpeGVzID0gWyctd2Via2l0LScsICctbW96LScsICcnXTtcblxudmFyIHZhbHVlcyA9IC9saW5lYXItZ3JhZGllbnR8cmFkaWFsLWdyYWRpZW50fHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnR8cmVwZWF0aW5nLXJhZGlhbC1ncmFkaWVudC87XG5cbmZ1bmN0aW9uIGdyYWRpZW50KHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAhKDAsIF9pc1ByZWZpeGVkVmFsdWUyLmRlZmF1bHQpKHZhbHVlKSAmJiB2YWx1ZXMudGVzdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gcHJlZml4ZXMubWFwKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgIHJldHVybiBwcmVmaXggKyB2YWx1ZTtcbiAgICB9KTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gaW1hZ2VTZXQ7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQcmVmaXhlZFZhbHVlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLy8gaHR0cDovL2Nhbml1c2UuY29tLyNmZWF0PWNzcy1pbWFnZS1zZXRcbnZhciBwcmVmaXhlcyA9IFsnLXdlYmtpdC0nLCAnJ107XG5mdW5jdGlvbiBpbWFnZVNldChwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgISgwLCBfaXNQcmVmaXhlZFZhbHVlMi5kZWZhdWx0KSh2YWx1ZSkgJiYgdmFsdWUuaW5kZXhPZignaW1hZ2Utc2V0KCcpID4gLTEpIHtcbiAgICByZXR1cm4gcHJlZml4ZXMubWFwKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9pbWFnZS1zZXRcXCgvZywgcHJlZml4ICsgJ2ltYWdlLXNldCgnKTtcbiAgICB9KTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gcG9zaXRpb247XG5mdW5jdGlvbiBwb3NpdGlvbihwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKHByb3BlcnR5ID09PSAncG9zaXRpb24nICYmIHZhbHVlID09PSAnc3RpY2t5Jykge1xuICAgIHJldHVybiBbJy13ZWJraXQtc3RpY2t5JywgJ3N0aWNreSddO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBzaXppbmc7XG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJy1tb3otJywgJyddO1xuXG52YXIgcHJvcGVydGllcyA9IHtcbiAgbWF4SGVpZ2h0OiB0cnVlLFxuICBtYXhXaWR0aDogdHJ1ZSxcbiAgd2lkdGg6IHRydWUsXG4gIGhlaWdodDogdHJ1ZSxcbiAgY29sdW1uV2lkdGg6IHRydWUsXG4gIG1pbldpZHRoOiB0cnVlLFxuICBtaW5IZWlnaHQ6IHRydWVcbn07XG52YXIgdmFsdWVzID0ge1xuICAnbWluLWNvbnRlbnQnOiB0cnVlLFxuICAnbWF4LWNvbnRlbnQnOiB0cnVlLFxuICAnZmlsbC1hdmFpbGFibGUnOiB0cnVlLFxuICAnZml0LWNvbnRlbnQnOiB0cnVlLFxuICAnY29udGFpbi1mbG9hdHMnOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBzaXppbmcocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiB2YWx1ZXMuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHByZWZpeGVzLm1hcChmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICByZXR1cm4gcHJlZml4ICsgdmFsdWU7XG4gICAgfSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRyYW5zaXRpb247XG5cbnZhciBfaHlwaGVuYXRlUHJvcGVydHkgPSByZXF1aXJlKCdjc3MtaW4tanMtdXRpbHMvbGliL2h5cGhlbmF0ZVByb3BlcnR5Jyk7XG5cbnZhciBfaHlwaGVuYXRlUHJvcGVydHkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaHlwaGVuYXRlUHJvcGVydHkpO1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZSA9IHJlcXVpcmUoJ2Nzcy1pbi1qcy11dGlscy9saWIvaXNQcmVmaXhlZFZhbHVlJyk7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUHJlZml4ZWRWYWx1ZSk7XG5cbnZhciBfY2FwaXRhbGl6ZVN0cmluZyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2NhcGl0YWxpemVTdHJpbmcnKTtcblxudmFyIF9jYXBpdGFsaXplU3RyaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NhcGl0YWxpemVTdHJpbmcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgcHJvcGVydGllcyA9IHtcbiAgdHJhbnNpdGlvbjogdHJ1ZSxcbiAgdHJhbnNpdGlvblByb3BlcnR5OiB0cnVlLFxuICBXZWJraXRUcmFuc2l0aW9uOiB0cnVlLFxuICBXZWJraXRUcmFuc2l0aW9uUHJvcGVydHk6IHRydWUsXG4gIE1velRyYW5zaXRpb246IHRydWUsXG4gIE1velRyYW5zaXRpb25Qcm9wZXJ0eTogdHJ1ZVxufTtcblxuXG52YXIgcHJlZml4TWFwcGluZyA9IHtcbiAgV2Via2l0OiAnLXdlYmtpdC0nLFxuICBNb3o6ICctbW96LScsXG4gIG1zOiAnLW1zLSdcbn07XG5cbmZ1bmN0aW9uIHByZWZpeFZhbHVlKHZhbHVlLCBwcm9wZXJ0eVByZWZpeE1hcCkge1xuICBpZiAoKDAsIF9pc1ByZWZpeGVkVmFsdWUyLmRlZmF1bHQpKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIG9ubHkgc3BsaXQgbXVsdGkgdmFsdWVzLCBub3QgY3ViaWMgYmV6aWVyc1xuICB2YXIgbXVsdGlwbGVWYWx1ZXMgPSB2YWx1ZS5zcGxpdCgvLCg/IVteKCldKig/OlxcKFteKCldKlxcKSk/XFwpKS9nKTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gbXVsdGlwbGVWYWx1ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgc2luZ2xlVmFsdWUgPSBtdWx0aXBsZVZhbHVlc1tpXTtcbiAgICB2YXIgdmFsdWVzID0gW3NpbmdsZVZhbHVlXTtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm9wZXJ0eVByZWZpeE1hcCkge1xuICAgICAgdmFyIGRhc2hDYXNlUHJvcGVydHkgPSAoMCwgX2h5cGhlbmF0ZVByb3BlcnR5Mi5kZWZhdWx0KShwcm9wZXJ0eSk7XG5cbiAgICAgIGlmIChzaW5nbGVWYWx1ZS5pbmRleE9mKGRhc2hDYXNlUHJvcGVydHkpID4gLTEgJiYgZGFzaENhc2VQcm9wZXJ0eSAhPT0gJ29yZGVyJykge1xuICAgICAgICB2YXIgcHJlZml4ZXMgPSBwcm9wZXJ0eVByZWZpeE1hcFtwcm9wZXJ0eV07XG4gICAgICAgIGZvciAodmFyIGogPSAwLCBwTGVuID0gcHJlZml4ZXMubGVuZ3RoOyBqIDwgcExlbjsgKytqKSB7XG4gICAgICAgICAgLy8gam9pbiBhbGwgcHJlZml4ZXMgYW5kIGNyZWF0ZSBhIG5ldyB2YWx1ZVxuICAgICAgICAgIHZhbHVlcy51bnNoaWZ0KHNpbmdsZVZhbHVlLnJlcGxhY2UoZGFzaENhc2VQcm9wZXJ0eSwgcHJlZml4TWFwcGluZ1twcmVmaXhlc1tqXV0gKyBkYXNoQ2FzZVByb3BlcnR5KSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBtdWx0aXBsZVZhbHVlc1tpXSA9IHZhbHVlcy5qb2luKCcsJyk7XG4gIH1cblxuICByZXR1cm4gbXVsdGlwbGVWYWx1ZXMuam9pbignLCcpO1xufVxuXG5mdW5jdGlvbiB0cmFuc2l0aW9uKHByb3BlcnR5LCB2YWx1ZSwgc3R5bGUsIHByb3BlcnR5UHJlZml4TWFwKSB7XG4gIC8vIGFsc28gY2hlY2sgZm9yIGFscmVhZHkgcHJlZml4ZWQgdHJhbnNpdGlvbnNcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgcHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICB2YXIgb3V0cHV0VmFsdWUgPSBwcmVmaXhWYWx1ZSh2YWx1ZSwgcHJvcGVydHlQcmVmaXhNYXApO1xuICAgIC8vIGlmIHRoZSBwcm9wZXJ0eSBpcyBhbHJlYWR5IHByZWZpeGVkXG4gICAgdmFyIHdlYmtpdE91dHB1dCA9IG91dHB1dFZhbHVlLnNwbGl0KC8sKD8hW14oKV0qKD86XFwoW14oKV0qXFwpKT9cXCkpL2cpLmZpbHRlcihmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gIS8tbW96LXwtbXMtLy50ZXN0KHZhbCk7XG4gICAgfSkuam9pbignLCcpO1xuXG4gICAgaWYgKHByb3BlcnR5LmluZGV4T2YoJ1dlYmtpdCcpID4gLTEpIHtcbiAgICAgIHJldHVybiB3ZWJraXRPdXRwdXQ7XG4gICAgfVxuXG4gICAgdmFyIG1vek91dHB1dCA9IG91dHB1dFZhbHVlLnNwbGl0KC8sKD8hW14oKV0qKD86XFwoW14oKV0qXFwpKT9cXCkpL2cpLmZpbHRlcihmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gIS8td2Via2l0LXwtbXMtLy50ZXN0KHZhbCk7XG4gICAgfSkuam9pbignLCcpO1xuXG4gICAgaWYgKHByb3BlcnR5LmluZGV4T2YoJ01veicpID4gLTEpIHtcbiAgICAgIHJldHVybiBtb3pPdXRwdXQ7XG4gICAgfVxuXG4gICAgc3R5bGVbJ1dlYmtpdCcgKyAoMCwgX2NhcGl0YWxpemVTdHJpbmcyLmRlZmF1bHQpKHByb3BlcnR5KV0gPSB3ZWJraXRPdXRwdXQ7XG4gICAgc3R5bGVbJ01veicgKyAoMCwgX2NhcGl0YWxpemVTdHJpbmcyLmRlZmF1bHQpKHByb3BlcnR5KV0gPSBtb3pPdXRwdXQ7XG4gICAgcmV0dXJuIG91dHB1dFZhbHVlO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGFkZE5ld1ZhbHVlc09ubHk7XG5mdW5jdGlvbiBhZGRJZk5ldyhsaXN0LCB2YWx1ZSkge1xuICBpZiAobGlzdC5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcbiAgICBsaXN0LnB1c2godmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZE5ld1ZhbHVlc09ubHkobGlzdCwgdmFsdWVzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmFsdWVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBhZGRJZk5ldyhsaXN0LCB2YWx1ZXNbaV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhZGRJZk5ldyhsaXN0LCB2YWx1ZXMpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gY2FwaXRhbGl6ZVN0cmluZztcbmZ1bmN0aW9uIGNhcGl0YWxpemVTdHJpbmcoc3RyKSB7XG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gaXNPYmplY3Q7XG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBwcmVmaXhQcm9wZXJ0eTtcblxudmFyIF9jYXBpdGFsaXplU3RyaW5nID0gcmVxdWlyZSgnLi9jYXBpdGFsaXplU3RyaW5nJyk7XG5cbnZhciBfY2FwaXRhbGl6ZVN0cmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYXBpdGFsaXplU3RyaW5nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gcHJlZml4UHJvcGVydHkocHJlZml4UHJvcGVydGllcywgcHJvcGVydHksIHN0eWxlKSB7XG4gIGlmIChwcmVmaXhQcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgIHZhciByZXF1aXJlZFByZWZpeGVzID0gcHJlZml4UHJvcGVydGllc1twcm9wZXJ0eV07XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcXVpcmVkUHJlZml4ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHN0eWxlW3JlcXVpcmVkUHJlZml4ZXNbaV0gKyAoMCwgX2NhcGl0YWxpemVTdHJpbmcyLmRlZmF1bHQpKHByb3BlcnR5KV0gPSBzdHlsZVtwcm9wZXJ0eV07XG4gICAgfVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHByZWZpeFZhbHVlO1xuZnVuY3Rpb24gcHJlZml4VmFsdWUocGx1Z2lucywgcHJvcGVydHksIHZhbHVlLCBzdHlsZSwgbWV0YURhdGEpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBsdWdpbnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgcHJvY2Vzc2VkVmFsdWUgPSBwbHVnaW5zW2ldKHByb3BlcnR5LCB2YWx1ZSwgc3R5bGUsIG1ldGFEYXRhKTtcblxuICAgIC8vIHdlIGNhbiBzdG9wIHByb2Nlc3NpbmcgaWYgYSB2YWx1ZSBpcyByZXR1cm5lZFxuICAgIC8vIGFzIGFsbCBwbHVnaW4gY3JpdGVyaWEgYXJlIHVuaXF1ZVxuICAgIGlmIChwcm9jZXNzZWRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHByb2Nlc3NlZFZhbHVlO1xuICAgIH1cbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gaGFzaChzdHIpIHtcbiAgdmFyIGhhc2ggPSA1MzgxLFxuICAgICAgaSAgICA9IHN0ci5sZW5ndGg7XG5cbiAgd2hpbGUoaSkge1xuICAgIGhhc2ggPSAoaGFzaCAqIDMzKSBeIHN0ci5jaGFyQ29kZUF0KC0taSk7XG4gIH1cblxuICAvKiBKYXZhU2NyaXB0IGRvZXMgYml0d2lzZSBvcGVyYXRpb25zIChsaWtlIFhPUiwgYWJvdmUpIG9uIDMyLWJpdCBzaWduZWRcbiAgICogaW50ZWdlcnMuIFNpbmNlIHdlIHdhbnQgdGhlIHJlc3VsdHMgdG8gYmUgYWx3YXlzIHBvc2l0aXZlLCBjb252ZXJ0IHRoZVxuICAgKiBzaWduZWQgaW50IHRvIGFuIHVuc2lnbmVkIGJ5IGRvaW5nIGFuIHVuc2lnbmVkIGJpdHNoaWZ0LiAqL1xuICByZXR1cm4gaGFzaCA+Pj4gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBjc3MsIFN0eWxlU2hlZXQgfSBmcm9tICdhcGhyb2RpdGUvbm8taW1wb3J0YW50JztcblxuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4uL3RoZW1lJztcbmltcG9ydCB7IGRlZXBNZXJnZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBJY29uIGZyb20gJy4vSWNvbic7XG5cbmZ1bmN0aW9uIEFycm93ICh7XG5cdGRpcmVjdGlvbixcblx0aWNvbixcblx0b25DbGljayxcblx0c2l6ZSxcblx0Li4ucHJvcHMsXG59LFxue1xuXHR0aGVtZSxcbn0pIHtcblx0Y29uc3QgY2xhc3NlcyA9IFN0eWxlU2hlZXQuY3JlYXRlKGRlZXBNZXJnZShkZWZhdWx0U3R5bGVzLCB0aGVtZSkpO1xuXG5cdHJldHVybiAoXG5cdFx0PGJ1dHRvblxuXHRcdFx0dHlwZT1cImJ1dHRvblwiXG5cdFx0XHRjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmFycm93LCBjbGFzc2VzWydhcnJvd19fZGlyZWN0aW9uX18nICsgZGlyZWN0aW9uXSwgc2l6ZSAmJiBjbGFzc2VzWydhcnJvd19fc2l6ZV9fJyArIHNpemVdKX1cblx0XHRcdG9uQ2xpY2s9e29uQ2xpY2t9XG5cdFx0XHRvblRvdWNoRW5kPXtvbkNsaWNrfVxuXHRcdFx0ey4uLnByb3BzfVxuXHRcdD5cblx0XHRcdDxJY29uIGZpbGw9eyEhdGhlbWUuYXJyb3cgJiYgdGhlbWUuYXJyb3cuZmlsbCB8fCBkZWZhdWx0cy5hcnJvdy5maWxsfSB0eXBlPXtpY29ufSAvPlxuXHRcdDwvYnV0dG9uPlxuXHQpO1xufTtcblxuQXJyb3cucHJvcFR5cGVzID0ge1xuXHRkaXJlY3Rpb246IFByb3BUeXBlcy5vbmVPZihbJ2xlZnQnLCAncmlnaHQnXSksXG5cdGljb246IFByb3BUeXBlcy5zdHJpbmcsXG5cdG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdHNpemU6IFByb3BUeXBlcy5vbmVPZihbJ21lZGl1bScsICdzbWFsbCddKS5pc1JlcXVpcmVkLFxufTtcbkFycm93LmRlZmF1bHRQcm9wcyA9IHtcblx0c2l6ZTogJ21lZGl1bScsXG59O1xuQXJyb3cuY29udGV4dFR5cGVzID0ge1xuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuY29uc3QgZGVmYXVsdFN0eWxlcyA9IHtcblx0YXJyb3c6IHtcblx0XHRiYWNrZ3JvdW5kOiAnbm9uZScsXG5cdFx0Ym9yZGVyOiAnbm9uZScsXG5cdFx0Ym9yZGVyUmFkaXVzOiA0LFxuXHRcdGN1cnNvcjogJ3BvaW50ZXInLFxuXHRcdG91dGxpbmU6ICdub25lJyxcblx0XHRwYWRkaW5nOiAxMCwgLy8gaW5jcmVhc2UgaGl0IGFyZWFcblx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHR0b3A6ICc1MCUnLFxuXG5cdFx0Ly8gZGlzYWJsZSB1c2VyIHNlbGVjdFxuXHRcdFdlYmtpdFRvdWNoQ2FsbG91dDogJ25vbmUnLFxuXHRcdHVzZXJTZWxlY3Q6ICdub25lJyxcblx0fSxcblxuXHQvLyBzaXplZXNcblx0YXJyb3dfX3NpemVfX21lZGl1bToge1xuXHRcdGhlaWdodDogZGVmYXVsdHMuYXJyb3cuaGVpZ2h0LFxuXHRcdG1hcmdpblRvcDogZGVmYXVsdHMuYXJyb3cuaGVpZ2h0IC8gLTIsXG5cdFx0d2lkdGg6IDQwLFxuXG5cdFx0J0BtZWRpYSAobWluLXdpZHRoOiA3NjhweCknOiB7XG5cdFx0XHR3aWR0aDogNzAsXG5cdFx0fSxcblx0fSxcblx0YXJyb3dfX3NpemVfX3NtYWxsOiB7XG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50aHVtYm5haWwuc2l6ZSxcblx0XHRtYXJnaW5Ub3A6IGRlZmF1bHRzLnRodW1ibmFpbC5zaXplIC8gLTIsXG5cdFx0d2lkdGg6IDMwLFxuXG5cdFx0J0BtZWRpYSAobWluLXdpZHRoOiA1MDBweCknOiB7XG5cdFx0XHR3aWR0aDogNDAsXG5cdFx0fSxcblx0fSxcblxuXHQvLyBkaXJlY3Rpb25cblx0YXJyb3dfX2RpcmVjdGlvbl9fcmlnaHQ6IHtcblx0XHRyaWdodDogZGVmYXVsdHMuY29udGFpbmVyLmd1dHRlci5ob3Jpem9udGFsLFxuXHR9LFxuXHRhcnJvd19fZGlyZWN0aW9uX19sZWZ0OiB7XG5cdFx0bGVmdDogZGVmYXVsdHMuY29udGFpbmVyLmd1dHRlci5ob3Jpem9udGFsLFxuXHR9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJvdztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgY3NzLCBTdHlsZVNoZWV0IH0gZnJvbSAnYXBocm9kaXRlL25vLWltcG9ydGFudCc7XG5cbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi90aGVtZSc7XG5pbXBvcnQgeyBkZWVwTWVyZ2UgfSBmcm9tICcuLi91dGlscyc7XG5cbmZ1bmN0aW9uIENvbnRhaW5lciAoeyAuLi5wcm9wcyB9LCB7IHRoZW1lIH0pIHtcblx0Y29uc3QgY2xhc3NlcyA9IFN0eWxlU2hlZXQuY3JlYXRlKGRlZXBNZXJnZShkZWZhdWx0U3R5bGVzLCB0aGVtZSkpO1xuXG5cdHJldHVybiAoXG5cdFx0PGRpdlxuXHRcdFx0Y2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5jb250YWluZXIpfVxuXHRcdFx0ey4uLnByb3BzfVxuXHRcdC8+XG5cdCk7XG59O1xuXG5Db250YWluZXIuY29udGV4dFR5cGVzID0ge1xuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuY29uc3QgZGVmYXVsdFN0eWxlcyA9IHtcblx0Y29udGFpbmVyOiB7XG5cdFx0YWxpZ25JdGVtczogJ2NlbnRlcicsXG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5jb250YWluZXIuYmFja2dyb3VuZCxcblx0XHRib3hTaXppbmc6ICdib3JkZXItYm94Jyxcblx0XHRkaXNwbGF5OiAnZmxleCcsXG5cdFx0aGVpZ2h0OiAnMTAwJScsXG5cdFx0anVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuXHRcdGxlZnQ6IDAsXG5cdFx0cGFkZGluZ0JvdHRvbTogZGVmYXVsdHMuY29udGFpbmVyLmd1dHRlci52ZXJ0aWNhbCxcblx0XHRwYWRkaW5nTGVmdDogZGVmYXVsdHMuY29udGFpbmVyLmd1dHRlci5ob3Jpem9udGFsLFxuXHRcdHBhZGRpbmdSaWdodDogZGVmYXVsdHMuY29udGFpbmVyLmd1dHRlci5ob3Jpem9udGFsLFxuXHRcdHBhZGRpbmdUb3A6IGRlZmF1bHRzLmNvbnRhaW5lci5ndXR0ZXIudmVydGljYWwsXG5cdFx0cG9zaXRpb246ICdmaXhlZCcsXG5cdFx0dG9wOiAwLFxuXHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0ekluZGV4OiBkZWZhdWx0cy5jb250YWluZXIuekluZGV4LFxuXHR9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250YWluZXI7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IGNzcywgU3R5bGVTaGVldCB9IGZyb20gJ2FwaHJvZGl0ZS9uby1pbXBvcnRhbnQnO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4uL3RoZW1lJztcbmltcG9ydCB7IGRlZXBNZXJnZSB9IGZyb20gJy4uL3V0aWxzJztcblxuZnVuY3Rpb24gRm9vdGVyICh7XG5cdGNhcHRpb24sXG5cdGNvdW50Q3VycmVudCxcblx0Y291bnRTZXBhcmF0b3IsXG5cdGNvdW50VG90YWwsXG5cdHNob3dDb3VudCxcblx0Li4ucHJvcHMsXG59LCB7XG5cdHRoZW1lLFxufSkge1xuXHRpZiAoIWNhcHRpb24gJiYgIXNob3dDb3VudCkgcmV0dXJuIG51bGw7XG5cblx0Y29uc3QgY2xhc3NlcyA9IFN0eWxlU2hlZXQuY3JlYXRlKGRlZXBNZXJnZShkZWZhdWx0U3R5bGVzLCB0aGVtZSkpO1xuXG5cdGNvbnN0IGltYWdlQ291bnQgPSBzaG93Q291bnQgPyAoXG5cdFx0PGRpdiBjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmZvb3RlckNvdW50KX0+XG5cdFx0XHR7Y291bnRDdXJyZW50fVxuXHRcdFx0e2NvdW50U2VwYXJhdG9yfVxuXHRcdFx0e2NvdW50VG90YWx9XG5cdFx0PC9kaXY+KVxuXHRcdDogPHNwYW4gLz47XG5cblx0cmV0dXJuIChcblx0XHQ8ZGl2IGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuZm9vdGVyKX0gey4uLnByb3BzfT5cblx0XHRcdHtjYXB0aW9uID8gKFxuXHRcdFx0XHQ8ZmlnY2FwdGlvbiBjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmZvb3RlckNhcHRpb24pfT5cblx0XHRcdFx0XHR7Y2FwdGlvbn1cblx0XHRcdFx0PC9maWdjYXB0aW9uPlxuXHRcdFx0KSA6IDxzcGFuIC8+fVxuXHRcdFx0e2ltYWdlQ291bnR9XG5cdFx0PC9kaXY+XG5cdCk7XG59O1xuXG5Gb290ZXIucHJvcFR5cGVzID0ge1xuXHRjYXB0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZWxlbWVudF0pLFxuXHRjb3VudEN1cnJlbnQ6IFByb3BUeXBlcy5udW1iZXIsXG5cdGNvdW50U2VwYXJhdG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuXHRjb3VudFRvdGFsOiBQcm9wVHlwZXMubnVtYmVyLFxuXHRzaG93Q291bnQ6IFByb3BUeXBlcy5ib29sLFxufTtcbkZvb3Rlci5jb250ZXh0VHlwZXMgPSB7XG5cdHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5jb25zdCBkZWZhdWx0U3R5bGVzID0ge1xuXHRmb290ZXI6IHtcblx0XHRib3hTaXppbmc6ICdib3JkZXItYm94Jyxcblx0XHRjb2xvcjogZGVmYXVsdHMuZm9vdGVyLmNvbG9yLFxuXHRcdGN1cnNvcjogJ2F1dG8nLFxuXHRcdGRpc3BsYXk6ICdmbGV4Jyxcblx0XHRqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuXHRcdGxlZnQ6IDAsXG5cdFx0bGluZUhlaWdodDogMS4zLFxuXHRcdHBhZGRpbmdCb3R0b206IGRlZmF1bHRzLmZvb3Rlci5ndXR0ZXIudmVydGljYWwsXG5cdFx0cGFkZGluZ0xlZnQ6IGRlZmF1bHRzLmZvb3Rlci5ndXR0ZXIuaG9yaXpvbnRhbCxcblx0XHRwYWRkaW5nUmlnaHQ6IGRlZmF1bHRzLmZvb3Rlci5ndXR0ZXIuaG9yaXpvbnRhbCxcblx0XHRwYWRkaW5nVG9wOiBkZWZhdWx0cy5mb290ZXIuZ3V0dGVyLnZlcnRpY2FsLFxuXHR9LFxuXHRmb290ZXJDb3VudDoge1xuXHRcdGNvbG9yOiBkZWZhdWx0cy5mb290ZXIuY291bnQuY29sb3IsXG5cdFx0Zm9udFNpemU6IGRlZmF1bHRzLmZvb3Rlci5jb3VudC5mb250U2l6ZSxcblx0XHRwYWRkaW5nTGVmdDogJzFlbScsIC8vIGFkZCBhIHNtYWxsIGd1dHRlciBmb3IgdGhlIGNhcHRpb25cblx0fSxcblx0Zm9vdGVyQ2FwdGlvbjoge1xuXHRcdGZsZXg6ICcxIDEgMCcsXG5cdH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvb3RlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgY3NzLCBTdHlsZVNoZWV0IH0gZnJvbSAnYXBocm9kaXRlL25vLWltcG9ydGFudCc7XG5cbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi90aGVtZSc7XG5pbXBvcnQgeyBkZWVwTWVyZ2UgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgSWNvbiBmcm9tICcuL0ljb24nO1xuXG5mdW5jdGlvbiBIZWFkZXIgKHtcblx0Y3VzdG9tQ29udHJvbHMsXG5cdG9uQ2xvc2UsXG5cdG9uUm90YXRlLFxuXHRzaG93Q2xvc2VCdXR0b24sXG5cdHNob3dSb3RhdGVCdXR0b24sXG5cdGNsb3NlQnV0dG9uVGl0bGUsXG5cdHJvdGF0ZUJ1dHRvblRpdGxlLFxuXHQuLi5wcm9wcyxcbn0sIHtcblx0dGhlbWUsXG59KSB7XG5cdGNvbnN0IGNsYXNzZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZShkZWVwTWVyZ2UoZGVmYXVsdFN0eWxlcywgdGhlbWUpKTtcblxuXHRyZXR1cm4gKFxuXHRcdDxkaXYgY2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5oZWFkZXIpfSB7Li4ucHJvcHN9PlxuXHRcdFx0eyEhc2hvd1JvdGF0ZUJ1dHRvbiAmJiAoXG5cdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHR0aXRsZT17cm90YXRlQnV0dG9uVGl0bGV9XG5cdFx0XHRcdFx0Y2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5yb3RhdGUpfVxuXHRcdFx0XHRcdG9uQ2xpY2s9e29uUm90YXRlfVxuXHRcdFx0XHQ+XG5cdFx0XHRcdFx0PEljb24gZmlsbD17ISF0aGVtZS5yb3RhdGUgJiYgdGhlbWUucm90YXRlLmZpbGwgfHwgZGVmYXVsdHMucm90YXRlLmZpbGx9IHR5cGU9XCJyb3RhdGVcIiAvPlxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdCl9XG5cdFx0XHR7Y3VzdG9tQ29udHJvbHMgPyBjdXN0b21Db250cm9scyA6IDxzcGFuIC8+fVxuXHRcdFx0eyEhc2hvd0Nsb3NlQnV0dG9uICYmIChcblx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdHRpdGxlPXtjbG9zZUJ1dHRvblRpdGxlfVxuXHRcdFx0XHRcdGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuY2xvc2UpfVxuXHRcdFx0XHRcdG9uQ2xpY2s9e29uQ2xvc2V9XG5cdFx0XHRcdD5cblx0XHRcdFx0XHQ8SWNvbiBmaWxsPXshIXRoZW1lLmNsb3NlICYmIHRoZW1lLmNsb3NlLmZpbGwgfHwgZGVmYXVsdHMuY2xvc2UuZmlsbH0gdHlwZT1cImNsb3NlXCIgLz5cblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHQpfVxuXHRcdDwvZGl2PlxuXHQpO1xufTtcblxuSGVhZGVyLnByb3BUeXBlcyA9IHtcblx0Y3VzdG9tQ29udHJvbHM6IFByb3BUeXBlcy5hcnJheSxcblx0b25DbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblx0c2hvd0Nsb3NlQnV0dG9uOiBQcm9wVHlwZXMuYm9vbCxcbn07XG5IZWFkZXIuY29udGV4dFR5cGVzID0ge1xuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuY29uc3QgZGVmYXVsdFN0eWxlcyA9IHtcblx0aGVhZGVyOiB7XG5cdFx0ZGlzcGxheTogJ2ZsZXgnLFxuXHRcdGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy5oZWFkZXIuaGVpZ2h0LFxuXHR9LFxuXHRjbG9zZToge1xuXHRcdGJhY2tncm91bmQ6ICdub25lJyxcblx0XHRib3JkZXI6ICdub25lJyxcblx0XHRjdXJzb3I6ICdwb2ludGVyJyxcblx0XHRvdXRsaW5lOiAnbm9uZScsXG5cdFx0cG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdFx0dG9wOiAwLFxuXHRcdHZlcnRpY2FsQWxpZ246ICdib3R0b20nLFxuXG5cdFx0Ly8gaW5jcmVhc2UgaGl0IGFyZWFcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLmNsb3NlLmhlaWdodCArIDIwLFxuXHRcdG1hcmdpblJpZ2h0OiAtMTAsXG5cdFx0cGFkZGluZzogMTAsXG5cdFx0d2lkdGg6IGRlZmF1bHRzLmNsb3NlLndpZHRoICsgMjAsXG5cdH0sXG5cdHJvdGF0ZToge1xuXHRcdGJhY2tncm91bmQ6ICdub25lJyxcblx0XHRib3JkZXI6ICdub25lJyxcblx0XHRjdXJzb3I6ICdwb2ludGVyJyxcblx0XHRvdXRsaW5lOiAnbm9uZScsXG5cdFx0cG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdFx0dG9wOiAwLFxuXHRcdHZlcnRpY2FsQWxpZ246ICdib3R0b20nLFxuXG5cdFx0Ly8gaW5jcmVhc2UgaGl0IGFyZWFcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLmNsb3NlLmhlaWdodCArIDIwLFxuXHRcdG1hcmdpbkxlZnQ6IC0xMCxcblx0XHRwYWRkaW5nOiAxMCxcblx0XHR3aWR0aDogZGVmYXVsdHMuY2xvc2Uud2lkdGggKyAyMCxcblx0fSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgaWNvbnMgZnJvbSAnLi4vaWNvbnMnO1xuXG5jb25zdCBJY29uID0gKHsgZmlsbCwgdHlwZSwgLi4ucHJvcHMgfSkgPT4ge1xuXHRjb25zdCBpY29uID0gaWNvbnNbdHlwZV07XG5cblx0cmV0dXJuIChcblx0XHQ8c3BhblxuXHRcdFx0ZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBpY29uKGZpbGwpIH19XG5cdFx0XHR7Li4ucHJvcHN9XG5cdFx0Lz5cblx0KTtcbn07XG5cbkljb24ucHJvcFR5cGVzID0ge1xuXHRmaWxsOiBQcm9wVHlwZXMuc3RyaW5nLFxuXHR0eXBlOiBQcm9wVHlwZXMub25lT2YoT2JqZWN0LmtleXMoaWNvbnMpKSxcbn07XG5JY29uLmRlZmF1bHRQcm9wcyA9IHtcblx0ZmlsbDogJ3doaXRlJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEljb247XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IGNzcywgU3R5bGVTaGVldCB9IGZyb20gJ2FwaHJvZGl0ZS9uby1pbXBvcnRhbnQnO1xuXG5pbXBvcnQgVGh1bWJuYWlsIGZyb20gJy4vVGh1bWJuYWlsJztcbmltcG9ydCBBcnJvdyBmcm9tICcuL0Fycm93JztcbmltcG9ydCB0aGVtZSBmcm9tICcuLi90aGVtZSc7XG5cbmNvbnN0IGNsYXNzZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZSh7XG5cdHBhZ2luYXRlZFRodW1ibmFpbHM6IHtcblx0XHRib3R0b206IHRoZW1lLmNvbnRhaW5lci5ndXR0ZXIudmVydGljYWwsXG5cdFx0aGVpZ2h0OiB0aGVtZS50aHVtYm5haWwuc2l6ZSxcblx0XHRwYWRkaW5nOiAnMCA1MHB4Jyxcblx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHR0ZXh0QWxpZ246ICdjZW50ZXInLFxuXHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuXHR9LFxufSk7XG5cbmNvbnN0IGFycm93U3R5bGVzID0ge1xuXHRoZWlnaHQ6IHRoZW1lLnRodW1ibmFpbC5zaXplICsgKHRoZW1lLnRodW1ibmFpbC5ndXR0ZXIgKiAyKSxcblx0d2lkdGg6IDQwLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnaW5hdGVkVGh1bWJuYWlscyBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yIChwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuc3RhdGUgPSB7XG5cdFx0XHRoYXNDdXN0b21QYWdlOiBmYWxzZSxcblx0XHR9O1xuXG5cdFx0dGhpcy5nb3RvUHJldiA9IHRoaXMuZ290b1ByZXYuYmluZCh0aGlzKTtcblx0XHR0aGlzLmdvdG9OZXh0ID0gdGhpcy5nb3RvTmV4dC5iaW5kKHRoaXMpO1xuXHR9XG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuXHRcdC8vIENvbXBvbmVudCBzaG91bGQgYmUgY29udHJvbGxlZCwgZmx1c2ggc3RhdGUgd2hlbiBjdXJyZW50SW1hZ2UgY2hhbmdlc1xuXHRcdGlmIChuZXh0UHJvcHMuY3VycmVudEltYWdlICE9PSB0aGlzLnByb3BzLmN1cnJlbnRJbWFnZSkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGhhc0N1c3RvbVBhZ2U6IGZhbHNlLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIE1FVEhPRFNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0Z2V0Rmlyc3QgKCkge1xuXHRcdGNvbnN0IHsgY3VycmVudEltYWdlLCBvZmZzZXQgfSA9IHRoaXMucHJvcHM7XG5cdFx0aWYgKHRoaXMuc3RhdGUuaGFzQ3VzdG9tUGFnZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuY2xhbXBGaXJzdCh0aGlzLnN0YXRlLmZpcnN0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuY2xhbXBGaXJzdChjdXJyZW50SW1hZ2UgLSBvZmZzZXQpO1xuXHR9XG5cdHNldEZpcnN0IChldmVudCwgbmV3Rmlyc3QpIHtcblx0XHRjb25zdCB7IGZpcnN0IH0gPSB0aGlzLnN0YXRlO1xuXG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXG5cdFx0aWYgKGZpcnN0ID09PSBuZXdGaXJzdCkgcmV0dXJuO1xuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRoYXNDdXN0b21QYWdlOiB0cnVlLFxuXHRcdFx0Zmlyc3Q6IG5ld0ZpcnN0LFxuXHRcdH0pO1xuXHR9XG5cdGdvdG9QcmV2IChldmVudCkge1xuXHRcdHRoaXMuc2V0Rmlyc3QoZXZlbnQsIHRoaXMuZ2V0Rmlyc3QoKSAtIHRoaXMucHJvcHMub2Zmc2V0KTtcblx0fVxuXHRnb3RvTmV4dCAoZXZlbnQpIHtcblx0XHR0aGlzLnNldEZpcnN0KGV2ZW50LCB0aGlzLmdldEZpcnN0KCkgKyB0aGlzLnByb3BzLm9mZnNldCk7XG5cdH1cblx0Y2xhbXBGaXJzdCAodmFsdWUpIHtcblx0XHRjb25zdCB7IGltYWdlcywgb2Zmc2V0IH0gPSB0aGlzLnByb3BzO1xuXG5cdFx0Y29uc3QgdG90YWxDb3VudCA9IDIgKiBvZmZzZXQgKyAxOyAvLyBzaG93ICRvZmZzZXQgZXh0cmEgdGh1bWJuYWlscyBvbiBlYWNoIHNpZGVcblxuXHRcdGlmICh2YWx1ZSA8IDApIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUgKyB0b3RhbENvdW50ID4gaW1hZ2VzLmxlbmd0aCkgeyAvLyBUb28gZmFyXG5cdFx0XHRyZXR1cm4gaW1hZ2VzLmxlbmd0aCAtIHRvdGFsQ291bnQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gUkVOREVSRVJTXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHJlbmRlckFycm93UHJldiAoKSB7XG5cdFx0aWYgKHRoaXMuZ2V0Rmlyc3QoKSA8PSAwKSByZXR1cm4gbnVsbDtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8QXJyb3dcblx0XHRcdFx0ZGlyZWN0aW9uPVwibGVmdFwiXG5cdFx0XHRcdHNpemU9XCJzbWFsbFwiXG5cdFx0XHRcdGljb249XCJhcnJvd0xlZnRcIlxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLmdvdG9QcmV2fVxuXHRcdFx0XHRzdHlsZT17YXJyb3dTdHlsZXN9XG5cdFx0XHRcdHRpdGxlPVwiUHJldmlvdXMgKExlZnQgYXJyb3cga2V5KVwiXG5cdFx0XHRcdHR5cGU9XCJidXR0b25cIlxuXHRcdFx0Lz5cblx0XHQpO1xuXHR9XG5cdHJlbmRlckFycm93TmV4dCAoKSB7XG5cdFx0Y29uc3QgeyBvZmZzZXQsIGltYWdlcyB9ID0gdGhpcy5wcm9wcztcblx0XHRjb25zdCB0b3RhbENvdW50ID0gMiAqIG9mZnNldCArIDE7XG5cdFx0aWYgKHRoaXMuZ2V0Rmlyc3QoKSArIHRvdGFsQ291bnQgPj0gaW1hZ2VzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PEFycm93XG5cdFx0XHRcdGRpcmVjdGlvbj1cInJpZ2h0XCJcblx0XHRcdFx0c2l6ZT1cInNtYWxsXCJcblx0XHRcdFx0aWNvbj1cImFycm93UmlnaHRcIlxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLmdvdG9OZXh0fVxuXHRcdFx0XHRzdHlsZT17YXJyb3dTdHlsZXN9XG5cdFx0XHRcdHRpdGxlPVwiUHJldmlvdXMgKFJpZ2h0IGFycm93IGtleSlcIlxuXHRcdFx0XHR0eXBlPVwiYnV0dG9uXCJcblx0XHRcdC8+XG5cdFx0KTtcblx0fVxuXHRyZW5kZXIgKCkge1xuXHRcdGNvbnN0IHsgaW1hZ2VzLCBjdXJyZW50SW1hZ2UsIG9uQ2xpY2tUaHVtYm5haWwsIG9mZnNldCB9ID0gdGhpcy5wcm9wcztcblxuXHRcdGNvbnN0IHRvdGFsQ291bnQgPSAyICogb2Zmc2V0ICsgMTsgLy8gc2hvdyAkb2Zmc2V0IGV4dHJhIHRodW1ibmFpbHMgb24gZWFjaCBzaWRlXG5cdFx0bGV0IHRodW1ibmFpbHMgPSBbXTtcblx0XHRsZXQgYmFzZU9mZnNldCA9IDA7XG5cdFx0aWYgKGltYWdlcy5sZW5ndGggPD0gdG90YWxDb3VudCkge1xuXHRcdFx0dGh1bWJuYWlscyA9IGltYWdlcztcblx0XHR9IGVsc2UgeyAvLyBUcnkgdG8gY2VudGVyIGN1cnJlbnQgaW1hZ2UgaW4gbGlzdFxuXHRcdFx0YmFzZU9mZnNldCA9IHRoaXMuZ2V0Rmlyc3QoKTtcblx0XHRcdHRodW1ibmFpbHMgPSBpbWFnZXMuc2xpY2UoYmFzZU9mZnNldCwgYmFzZU9mZnNldCArIHRvdGFsQ291bnQpO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMucGFnaW5hdGVkVGh1bWJuYWlscyl9PlxuXHRcdFx0XHR7dGhpcy5yZW5kZXJBcnJvd1ByZXYoKX1cblx0XHRcdFx0e3RodW1ibmFpbHMubWFwKChpbWcsIGlkeCkgPT4gKFxuXHRcdFx0XHRcdDxUaHVtYm5haWwga2V5PXtiYXNlT2Zmc2V0ICsgaWR4fVxuXHRcdFx0XHRcdFx0ey4uLmltZ31cblx0XHRcdFx0XHRcdGluZGV4PXtiYXNlT2Zmc2V0ICsgaWR4fVxuXHRcdFx0XHRcdFx0b25DbGljaz17b25DbGlja1RodW1ibmFpbH1cblx0XHRcdFx0XHRcdGFjdGl2ZT17YmFzZU9mZnNldCArIGlkeCA9PT0gY3VycmVudEltYWdlfSAvPlxuXHRcdFx0XHQpKX1cblx0XHRcdFx0e3RoaXMucmVuZGVyQXJyb3dOZXh0KCl9XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59XG5cblBhZ2luYXRlZFRodW1ibmFpbHMucHJvcFR5cGVzID0ge1xuXHRjdXJyZW50SW1hZ2U6IFByb3BUeXBlcy5udW1iZXIsXG5cdGltYWdlczogUHJvcFR5cGVzLmFycmF5LFxuXHRvZmZzZXQ6IFByb3BUeXBlcy5udW1iZXIsXG5cdG9uQ2xpY2tUaHVtYm5haWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG59O1xuIiwiaW1wb3J0IHsgQ2hpbGRyZW4sIENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbi8vIFBhc3MgdGhlIExpZ2h0Ym94IGNvbnRleHQgdGhyb3VnaCB0byB0aGUgUG9ydGFsJ3MgZGVzY2VuZGVudHNcbi8vIFN0YWNrT3ZlcmZsb3cgZGlzY3Vzc2lvbiBodHRwOi8vZ29vLmdsL29jbHJKOVxuXG5jbGFzcyBQYXNzQ29udGV4dCBleHRlbmRzIENvbXBvbmVudCB7XG5cdGdldENoaWxkQ29udGV4dCAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucHJvcHMuY29udGV4dDtcblx0fVxuXHRyZW5kZXIgKCkge1xuXHRcdHJldHVybiBDaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXHR9XG59O1xuXG5QYXNzQ29udGV4dC5wcm9wVHlwZXMgPSB7XG5cdGNvbnRleHQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG5QYXNzQ29udGV4dC5jaGlsZENvbnRleHRUeXBlcyA9IHtcblx0dGhlbWU6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBQYXNzQ29udGV4dDtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFRyYW5zaXRpb24gZnJvbSAncmVhY3QtYWRkb25zLWNzcy10cmFuc2l0aW9uLWdyb3VwJztcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUGFzc0NvbnRleHQgZnJvbSAnLi9QYXNzQ29udGV4dCc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ydGFsIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IgKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5wb3J0YWxFbGVtZW50ID0gbnVsbDtcblx0fVxuXHRjb21wb25lbnREaWRNb3VudCAoKSB7XG5cdFx0Y29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocCk7XG5cdFx0dGhpcy5wb3J0YWxFbGVtZW50ID0gcDtcblx0XHR0aGlzLmNvbXBvbmVudERpZFVwZGF0ZSgpO1xuXHR9XG5cdGNvbXBvbmVudERpZFVwZGF0ZSAoKSB7XG5cdFx0Ly8gQW5pbWF0ZSBmYWRlIG9uIG1vdW50L3VubW91bnRcblx0XHRjb25zdCBkdXJhdGlvbiA9IDIwMDtcblx0XHRjb25zdCBzdHlsZXMgPSBgXG5cdFx0XHRcdC5mYWRlLWVudGVyIHsgb3BhY2l0eTogMC4wMTsgfVxuXHRcdFx0XHQuZmFkZS1lbnRlci5mYWRlLWVudGVyLWFjdGl2ZSB7IG9wYWNpdHk6IDE7IHRyYW5zaXRpb246IG9wYWNpdHkgJHtkdXJhdGlvbn1tczsgfVxuXHRcdFx0XHQuZmFkZS1sZWF2ZSB7IG9wYWNpdHk6IDE7IH1cblx0XHRcdFx0LmZhZGUtbGVhdmUuZmFkZS1sZWF2ZS1hY3RpdmUgeyBvcGFjaXR5OiAwLjAxOyB0cmFuc2l0aW9uOiBvcGFjaXR5ICR7ZHVyYXRpb259bXM7IH1cblx0XHRgO1xuXG5cdFx0cmVuZGVyKFxuXHRcdFx0PFBhc3NDb250ZXh0IGNvbnRleHQ9e3RoaXMuY29udGV4dH0+XG5cdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0PHN0eWxlPntzdHlsZXN9PC9zdHlsZT5cblx0XHRcdFx0XHQ8VHJhbnNpdGlvblxuXHRcdFx0XHRcdFx0Y29tcG9uZW50PVwiZGl2XCJcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25OYW1lPVwiZmFkZVwiXG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXtkdXJhdGlvbn1cblx0XHRcdFx0XHRcdHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9e2R1cmF0aW9ufVxuXHRcdFx0XHRcdFx0ey4uLnRoaXMucHJvcHN9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L1Bhc3NDb250ZXh0Pixcblx0XHRcdHRoaXMucG9ydGFsRWxlbWVudFxuXHRcdCk7XG5cdH1cblx0Y29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuXHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5wb3J0YWxFbGVtZW50KTtcblx0fVxuXHRyZW5kZXIgKCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cblBvcnRhbC5jb250ZXh0VHlwZXMgPSB7XG5cdHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBjc3MsIFN0eWxlU2hlZXQgfSBmcm9tICdhcGhyb2RpdGUvbm8taW1wb3J0YW50JztcblxuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4uL3RoZW1lJztcbmltcG9ydCB7IGRlZXBNZXJnZSB9IGZyb20gJy4uL3V0aWxzJztcblxuZnVuY3Rpb24gVGh1bWJuYWlsICh7IGluZGV4LCBzcmMsIHRodW1ibmFpbCwgYWN0aXZlLCBvbkNsaWNrIH0sIHsgdGhlbWUgfSkge1xuXHRjb25zdCB1cmwgPSB0aHVtYm5haWwgPyB0aHVtYm5haWwgOiBzcmM7XG5cdGNvbnN0IGNsYXNzZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZShkZWVwTWVyZ2UoZGVmYXVsdFN0eWxlcywgdGhlbWUpKTtcblxuXHRyZXR1cm4gKFxuXHRcdDxkaXZcblx0XHRcdGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMudGh1bWJuYWlsLCBhY3RpdmUgJiYgY2xhc3Nlcy50aHVtYm5haWxfX2FjdGl2ZSl9XG5cdFx0XHRvbkNsaWNrPXsoZSkgPT4ge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdG9uQ2xpY2soaW5kZXgpO1xuXHRcdFx0fX1cblx0XHRcdHN0eWxlPXt7IGJhY2tncm91bmRJbWFnZTogJ3VybChcIicgKyB1cmwgKyAnXCIpJyB9fVxuXHRcdC8+XG5cdCk7XG59XG5cblRodW1ibmFpbC5wcm9wVHlwZXMgPSB7XG5cdGFjdGl2ZTogUHJvcFR5cGVzLmJvb2wsXG5cdGluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuXHRvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRzcmM6IFByb3BUeXBlcy5zdHJpbmcsXG5cdHRodW1ibmFpbDogUHJvcFR5cGVzLnN0cmluZyxcbn07XG5cblRodW1ibmFpbC5jb250ZXh0VHlwZXMgPSB7XG5cdHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5jb25zdCBkZWZhdWx0U3R5bGVzID0ge1xuXHR0aHVtYm5haWw6IHtcblx0XHRiYWNrZ3JvdW5kUG9zaXRpb246ICdjZW50ZXInLFxuXHRcdGJhY2tncm91bmRTaXplOiAnY292ZXInLFxuXHRcdGJvcmRlclJhZGl1czogMixcblx0XHRib3hTaGFkb3c6ICdpbnNldCAwIDAgMCAxcHggaHNsYSgwLDAlLDEwMCUsLjIpJyxcblx0XHRjdXJzb3I6ICdwb2ludGVyJyxcblx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRodW1ibmFpbC5zaXplLFxuXHRcdG1hcmdpbjogZGVmYXVsdHMudGh1bWJuYWlsLmd1dHRlcixcblx0XHRvdmVyZmxvdzogJ2hpZGRlbicsXG5cdFx0d2lkdGg6IGRlZmF1bHRzLnRodW1ibmFpbC5zaXplLFxuXHR9LFxuXHR0aHVtYm5haWxfX2FjdGl2ZToge1xuXHRcdGJveFNoYWRvdzogYGluc2V0IDAgMCAwIDJweCAke2RlZmF1bHRzLnRodW1ibmFpbC5hY3RpdmVCb3JkZXJDb2xvcn1gLFxuXHR9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgVGh1bWJuYWlsO1xuIiwiZXhwb3J0IGRlZmF1bHQgKGZpbGwpID0+IChcblx0YDxzdmcgZmlsbD1cIiR7ZmlsbH1cIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG5cdFx0PHBhdGggZD1cIk0yMTMuNywyNTZMMjEzLjcsMjU2TDIxMy43LDI1NkwzODAuOSw4MS45YzQuMi00LjMsNC4xLTExLjQtMC4yLTE1LjhsLTI5LjktMzAuNmMtNC4zLTQuNC0xMS4zLTQuNS0xNS41LTAuMkwxMzEuMSwyNDcuOSBjLTIuMiwyLjItMy4yLDUuMi0zLDguMWMtMC4xLDMsMC45LDUuOSwzLDguMWwyMDQuMiwyMTIuN2M0LjIsNC4zLDExLjIsNC4yLDE1LjUtMC4ybDI5LjktMzAuNmM0LjMtNC40LDQuNC0xMS41LDAuMi0xNS44IEwyMTMuNywyNTZ6XCIvPlxuXHQ8L3N2Zz5gXG4pO1xuIiwiZXhwb3J0IGRlZmF1bHQgKGZpbGwpID0+IChcblx0YDxzdmcgZmlsbD1cIiR7ZmlsbH1cIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG5cdFx0PHBhdGggZD1cIk0yOTguMywyNTZMMjk4LjMsMjU2TDI5OC4zLDI1NkwxMzEuMSw4MS45Yy00LjItNC4zLTQuMS0xMS40LDAuMi0xNS44bDI5LjktMzAuNmM0LjMtNC40LDExLjMtNC41LDE1LjUtMC4ybDIwNC4yLDIxMi43IGMyLjIsMi4yLDMuMiw1LjIsMyw4LjFjMC4xLDMtMC45LDUuOS0zLDguMUwxNzYuNyw0NzYuOGMtNC4yLDQuMy0xMS4yLDQuMi0xNS41LTAuMkwxMzEuMyw0NDZjLTQuMy00LjQtNC40LTExLjUtMC4yLTE1LjggTDI5OC4zLDI1NnpcIi8+XG5cdDwvc3ZnPmBcbik7XG4iLCJleHBvcnQgZGVmYXVsdCAoZmlsbCkgPT4gKFxuXHRgPHN2ZyBmaWxsPVwiJHtmaWxsfVwiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cblx0XHQ8cGF0aCBkPVwiTTQ0My42LDM4Ny4xTDMxMi40LDI1NS40bDEzMS41LTEzMGM1LjQtNS40LDUuNC0xNC4yLDAtMTkuNmwtMzcuNC0zNy42Yy0yLjYtMi42LTYuMS00LTkuOC00Yy0zLjcsMC03LjIsMS41LTkuOCw0IEwyNTYsMTk3LjhMMTI0LjksNjguM2MtMi42LTIuNi02LjEtNC05LjgtNGMtMy43LDAtNy4yLDEuNS05LjgsNEw2OCwxMDUuOWMtNS40LDUuNC01LjQsMTQuMiwwLDE5LjZsMTMxLjUsMTMwTDY4LjQsMzg3LjEgYy0yLjYsMi42LTQuMSw2LjEtNC4xLDkuOGMwLDMuNywxLjQsNy4yLDQuMSw5LjhsMzcuNCwzNy42YzIuNywyLjcsNi4yLDQuMSw5LjgsNC4xYzMuNSwwLDcuMS0xLjMsOS44LTQuMUwyNTYsMzEzLjFsMTMwLjcsMTMxLjEgYzIuNywyLjcsNi4yLDQuMSw5LjgsNC4xYzMuNSwwLDcuMS0xLjMsOS44LTQuMWwzNy40LTM3LjZjMi42LTIuNiw0LjEtNi4xLDQuMS05LjhDNDQ3LjcsMzkzLjIsNDQ2LjIsMzg5LjcsNDQzLjYsMzg3LjF6XCIvPlxuXHQ8L3N2Zz5gXG4pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGFycm93TGVmdDogcmVxdWlyZSgnLi9hcnJvd0xlZnQnKSxcblx0YXJyb3dSaWdodDogcmVxdWlyZSgnLi9hcnJvd1JpZ2h0JyksXG5cdGNsb3NlOiByZXF1aXJlKCcuL2Nsb3NlJyksXG5cdHJvdGF0ZTogcmVxdWlyZSgnLi9yb3RhdGUnKSxcbn07XG4iLCJleHBvcnQgZGVmYXVsdCAoZmlsbCkgPT4gKFxuXHRgPHN2ZyBmaWxsPVwiJHtmaWxsfVwiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAzODUgMzg1XCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cblx0XHQ8cGF0aCBkPVwiTTM4NSwzMi4wODMzMzMzIEwzODUsMTQ0LjM3NSBDMzg1LDE0OC43MTk2MTggMzgzLjQxMjU0MywxNTIuNDc5Mzg0IDM4MC4yMzc2MywxNTUuNjU0Mjk3IEMzNzcuMDYyNzE3LDE1OC44MjkyMSAzNzMuMzAyOTUxLDE2MC40MTY2NjcgMzY4Ljk1ODMzMywxNjAuNDE2NjY3IEwyNTYuNjY2NjY3LDE2MC40MTY2NjcgQzI0OS42NDg0MzgsMTYwLjQxNjY2NyAyNDQuNzE4OTY3LDE1Ny4wNzQ2NTMgMjQxLjg3ODI1NSwxNTAuMzkwNjI1IEMyMzkuMDM3NTQzLDE0My44NzM2OTggMjQwLjIwNzI0OCwxMzguMTA4NzI0IDI0NS4zODczNywxMzMuMDk1NzAzIEwyNzkuOTc3MjE0LDk4LjUwNTg1OTQgQzI1NS4yNDYzMTEsNzUuNjEzMDY0MiAyMjYuMDg3MjQsNjQuMTY2NjY2NyAxOTIuNSw2NC4xNjY2NjY3IEMxNzUuMTIxNTI4LDY0LjE2NjY2NjcgMTU4LjUzNjc4NCw2Ny41NTA0NTU3IDE0Mi43NDU3NjgsNzQuMzE4MDMzOSBDMTI2Ljk1NDc1Myw4MS4wODU2MTIgMTEzLjI5NDI3MSw5MC4yMzQzNzUgMTAxLjc2NDMyMywxMDEuNzY0MzIzIEM5MC4yMzQzNzUsMTEzLjI5NDI3MSA4MS4wODU2MTIsMTI2Ljk1NDc1MyA3NC4zMTgwMzM5LDE0Mi43NDU3NjggQzY3LjU1MDQ1NTcsMTU4LjUzNjc4NCA2NC4xNjY2NjY3LDE3NS4xMjE1MjggNjQuMTY2NjY2NywxOTIuNSBDNjQuMTY2NjY2NywyMDkuODc4NDcyIDY3LjU1MDQ1NTcsMjI2LjQ2MzIxNiA3NC4zMTgwMzM5LDI0Mi4yNTQyMzIgQzgxLjA4NTYxMiwyNTguMDQ1MjQ3IDkwLjIzNDM3NSwyNzEuNzA1NzI5IDEwMS43NjQzMjMsMjgzLjIzNTY3NyBDMTEzLjI5NDI3MSwyOTQuNzY1NjI1IDEyNi45NTQ3NTMsMzAzLjkxNDM4OCAxNDIuNzQ1NzY4LDMxMC42ODE5NjYgQzE1OC41MzY3ODQsMzE3LjQ0OTU0NCAxNzUuMTIxNTI4LDMyMC44MzMzMzMgMTkyLjUsMzIwLjgzMzMzMyBDMjEyLjM4NDk4MywzMjAuODMzMzMzIDIzMS4xODM4MTEsMzE2LjQ4ODcxNSAyNDguODk2NDg0LDMwNy43OTk0NzkgQzI2Ni42MDkxNTgsMjk5LjExMDI0MyAyODEuNTY0NjcsMjg2LjgyODM0MiAyOTMuNzYzMDIxLDI3MC45NTM3NzYgQzI5NC45MzI3MjYsMjY5LjI4Mjc2OSAyOTYuODU0Mzg0LDI2OC4yODAxNjUgMjk5LjUyNzk5NSwyNjcuOTQ1OTY0IEMzMDEuODY3NDA1LDI2Ny45NDU5NjQgMzAzLjk1NjE2MywyNjguNjk3OTE3IDMwNS43OTQyNzEsMjcwLjIwMTgyMyBMMzQwLjEzMzQ2NCwzMDQuNzkxNjY3IEMzNDEuNjM3MzcsMzA2LjEyODQ3MiAzNDIuNDMxMDk4LDMwNy44NDEyNTQgMzQyLjUxNDY0OCwzMDkuOTMwMDEzIEMzNDIuNTk4MTk5LDMxMi4wMTg3NzIgMzQxLjk3MTU3MSwzMTMuODk4NjU1IDM0MC42MzQ3NjYsMzE1LjU2OTY2MSBDMzIyLjQyMDc5LDMzNy42MjY5NTMgMzAwLjM2MzQ5OCwzNTQuNzEyOTk5IDI3NC40NjI4OTEsMzY2LjgyNzc5OSBDMjQ4LjU2MjI4MywzNzguOTQyNiAyMjEuMjQxMzE5LDM4NSAxOTIuNSwzODUgQzE2Ni40MzIyOTIsMzg1IDE0MS41MzQyODgsMzc5LjkwMzQyOSAxMTcuODA1OTksMzY5LjcxMDI4NiBDOTQuMDc3NjkxLDM1OS41MTcxNDQgNzMuNjA3ODU1OSwzNDUuODE0ODg3IDU2LjM5NjQ4NDQsMzI4LjYwMzUxNiBDMzkuMTg1MTEyOCwzMTEuMzkyMTQ0IDI1LjQ4Mjg1NTksMjkwLjkyMjMwOSAxNS4yODk3MTM1LDI2Ny4xOTQwMSBDNS4wOTY1NzExOCwyNDMuNDY1NzEyIDAsMjE4LjU2NzcwOCAwLDE5Mi41IEMwLDE2Ni40MzIyOTIgNS4wOTY1NzExOCwxNDEuNTM0Mjg4IDE1LjI4OTcxMzUsMTE3LjgwNTk5IEMyNS40ODI4NTU5LDk0LjA3NzY5MSAzOS4xODUxMTI4LDczLjYwNzg1NTkgNTYuMzk2NDg0NCw1Ni4zOTY0ODQ0IEM3My42MDc4NTU5LDM5LjE4NTExMjggOTQuMDc3NjkxLDI1LjQ4Mjg1NTkgMTE3LjgwNTk5LDE1LjI4OTcxMzUgQzE0MS41MzQyODgsNS4wOTY1NzExOCAxNjYuNDMyMjkyLDAgMTkyLjUsMCBDMjE3LjA2MzgwMiwwIDI0MC44MzM4NzYsNC42MzcwNDQyNyAyNjMuODEwMjIxLDEzLjkxMTEzMjggQzI4Ni43ODY1NjcsMjMuMTg1MjIxNCAzMDcuMjE0NjI3LDM2LjI2MDg1MDcgMzI1LjA5NDQwMSw1My4xMzgwMjA4IEwzNTcuNjc5MDM2LDIwLjgwNDAzNjUgQzM2Mi41MjQ5NTcsMTUuNjIzOTE0OSAzNjguMzczNDgxLDE0LjQ1NDIxMDEgMzc1LjIyNDYwOSwxNy4yOTQ5MjE5IEMzODEuNzQxNTM2LDIwLjEzNTYzMzcgMzg1LDI1LjA2NTEwNDIgMzg1LDMyLjA4MzMzMzMgWlwiIGlkPVwiU2hhcGVcIiBmaWxsPVwiJHtmaWxsfVwiPjwvcGF0aD5cblx0PC9zdmc+YFxuKTtcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVEhFTUVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCB0aGVtZSA9IHt9O1xuXG4vLyBjb250YWluZXJcbnRoZW1lLmNvbnRhaW5lciA9IHtcblx0YmFja2dyb3VuZDogJ3JnYmEoMCwgMCwgMCwgMC44KScsXG5cdGd1dHRlcjoge1xuXHRcdGhvcml6b250YWw6IDEwLFxuXHRcdHZlcnRpY2FsOiAxMCxcblx0fSxcblx0ekluZGV4OiAyMDAxLFxufTtcblxuLy8gaGVhZGVyXG50aGVtZS5oZWFkZXIgPSB7XG5cdGhlaWdodDogNDAsXG59O1xudGhlbWUuY2xvc2UgPSB7XG5cdGZpbGw6ICd3aGl0ZScsXG5cdGhlaWdodDogMjAsXG5cdHdpZHRoOiAyMCxcbn07XG50aGVtZS5yb3RhdGUgPSB7XG5cdGZpbGw6ICd3aGl0ZScsXG5cdGhlaWdodDogMjAsXG5cdHdpZHRoOiAyMCxcbn07XG5cbi8vIGZvb3RlclxudGhlbWUuZm9vdGVyID0ge1xuXHRjb2xvcjogJ3doaXRlJyxcblx0Y291bnQ6IHtcblx0XHRjb2xvcjogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC43NSknLFxuXHRcdGZvbnRTaXplOiAnMC44NWVtJyxcblx0fSxcblx0aGVpZ2h0OiA0MCxcblx0Z3V0dGVyOiB7XG5cdFx0aG9yaXpvbnRhbDogMCxcblx0XHR2ZXJ0aWNhbDogNSxcblx0fSxcbn07XG5cbi8vIHRodW1ibmFpbHNcbnRoZW1lLnRodW1ibmFpbCA9IHtcblx0YWN0aXZlQm9yZGVyQ29sb3I6ICd3aGl0ZScsXG5cdHNpemU6IDUwLFxuXHRndXR0ZXI6IDIsXG59O1xuXG4vLyBhcnJvd1xudGhlbWUuYXJyb3cgPSB7XG5cdGJhY2tncm91bmQ6ICdibGFjaycsXG5cdGZpbGw6ICd3aGl0ZScsXG5cdGhlaWdodDogMTIwLFxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHRoZW1lO1xuIiwiLyoqXG5cdEJpbmQgbXVsdGlwbGUgY29tcG9uZW50IG1ldGhvZHM6XG5cblx0KiBAcGFyYW0ge3RoaXN9IGNvbnRleHRcblx0KiBAcGFyYW0ge0FycmF5fSBmdW5jdGlvbnNcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHQuLi5cblx0XHRiaW5kRnVuY3Rpb25zLmNhbGwodGhpcywgWydoYW5kbGVDbGljaycsICdoYW5kbGVPdGhlciddKTtcblx0fVxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kRnVuY3Rpb25zIChmdW5jdGlvbnMpIHtcblx0ZnVuY3Rpb25zLmZvckVhY2goZiA9PiAodGhpc1tmXSA9IHRoaXNbZl0uYmluZCh0aGlzKSkpO1xufTtcbiIsIi8vIFJldHVybiB0cnVlIGlmIHdpbmRvdyArIGRvY3VtZW50XG5cbm1vZHVsZS5leHBvcnRzID0gISEoXG5cdHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG5cdCYmIHdpbmRvdy5kb2N1bWVudFxuXHQmJiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudFxuKTtcbiIsImZ1bmN0aW9uIGRlZXBNZXJnZSAodGFyZ2V0LCBzb3VyY2UgPSB7fSkge1xuXHRjb25zdCBleHRlbmRlZCA9IE9iamVjdC5hc3NpZ24oe30sIHRhcmdldCk7XG5cblx0T2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRpZiAodHlwZW9mIHNvdXJjZVtrZXldICE9PSAnb2JqZWN0JyB8fCAhc291cmNlW2tleV0pIHtcblx0XHRcdGV4dGVuZGVkW2tleV0gPSBzb3VyY2Vba2V5XTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCF0YXJnZXRba2V5XSkge1xuXHRcdFx0XHRleHRlbmRlZFtrZXldID0gc291cmNlW2tleV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRleHRlbmRlZFtrZXldID0gZGVlcE1lcmdlKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gZXh0ZW5kZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVlcE1lcmdlO1xuIiwiaW1wb3J0IGJpbmRGdW5jdGlvbnMgZnJvbSAnLi9iaW5kRnVuY3Rpb25zJztcbmltcG9ydCBjYW5Vc2VEb20gZnJvbSAnLi9jYW5Vc2VEb20nO1xuaW1wb3J0IGRlZXBNZXJnZSBmcm9tICcuL2RlZXBNZXJnZSc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRiaW5kRnVuY3Rpb25zLFxuXHRjYW5Vc2VEb20sXG5cdGRlZXBNZXJnZSxcbn07XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IGNzcywgU3R5bGVTaGVldCB9IGZyb20gJ2FwaHJvZGl0ZS9uby1pbXBvcnRhbnQnO1xuaW1wb3J0IFNjcm9sbExvY2sgZnJvbSAncmVhY3Qtc2Nyb2xsbG9jayc7XG5cbmltcG9ydCB0aGVtZSBmcm9tICcuL3RoZW1lJztcbmltcG9ydCBBcnJvdyBmcm9tICcuL2NvbXBvbmVudHMvQXJyb3cnO1xuaW1wb3J0IENvbnRhaW5lciBmcm9tICcuL2NvbXBvbmVudHMvQ29udGFpbmVyJztcbmltcG9ydCBGb290ZXIgZnJvbSAnLi9jb21wb25lbnRzL0Zvb3Rlcic7XG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vY29tcG9uZW50cy9IZWFkZXInO1xuaW1wb3J0IFBhZ2luYXRlZFRodW1ibmFpbHMgZnJvbSAnLi9jb21wb25lbnRzL1BhZ2luYXRlZFRodW1ibmFpbHMnO1xuaW1wb3J0IFBvcnRhbCBmcm9tICcuL2NvbXBvbmVudHMvUG9ydGFsJztcblxuaW1wb3J0IHsgYmluZEZ1bmN0aW9ucywgY2FuVXNlRG9tIH0gZnJvbSAnLi91dGlscyc7XG5cbmNsYXNzIExpZ2h0Ym94IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IgKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zdGF0ZSA9IHsgcm90YXRlOiAwLCBpc1pvb21lZDogZmFsc2UgfTtcblxuXHRcdGJpbmRGdW5jdGlvbnMuY2FsbCh0aGlzLCBbXG5cdFx0XHQnZ290b05leHQnLFxuXHRcdFx0J2dvdG9QcmV2Jyxcblx0XHRcdCdyb3RhdGUnLFxuXHRcdFx0J3pvb20nLFxuXHRcdFx0J2hhbmRsZUtleWJvYXJkSW5wdXQnLFxuXHRcdF0pO1xuXHR9XG5cdGdldENoaWxkQ29udGV4dCAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRoZW1lOiB0aGlzLnByb3BzLnRoZW1lLFxuXHRcdH07XG5cdH1cblx0Y29tcG9uZW50RGlkTW91bnQgKCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblxuXHRcdGlmICh0aGlzLnByb3BzLmlzT3BlbiAmJiB0aGlzLnByb3BzLmVuYWJsZUtleWJvYXJkSW5wdXQpIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlib2FyZElucHV0KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcm9wcy56b29tKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0bGV0IHBvc1kgPSBldmVudC5jbGllbnRZO1xuXHRcdFx0XHRpZiAoc2VsZi5zdGF0ZS5pc1pvb21lZCkge1xuXHRcdFx0XHRcdGlmIChwb3NZIDw9IHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIHtcblx0XHRcdFx0XHRcdHNlbGYuc2V0U3RhdGUoeyBtYXJnaW46IGAke3dpbmRvdy5pbm5lckhlaWdodCAtIHBvc1l9cHggMHB4IDBweCAwcHhgIH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZWxmLnNldFN0YXRlKHsgbWFyZ2luOiBgLSR7cG9zWSAvIDEuM31weCAwcHggMHB4IDBweGAgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fVxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcblx0XHRpZiAoIWNhblVzZURvbSkgcmV0dXJuO1xuXG5cdFx0Ly8gcHJlbG9hZCBpbWFnZXNcblx0XHRpZiAobmV4dFByb3BzLnByZWxvYWROZXh0SW1hZ2UpIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMucHJvcHMuY3VycmVudEltYWdlO1xuXHRcdFx0Y29uc3QgbmV4dEluZGV4ID0gbmV4dFByb3BzLmN1cnJlbnRJbWFnZSArIDE7XG5cdFx0XHRjb25zdCBwcmV2SW5kZXggPSBuZXh0UHJvcHMuY3VycmVudEltYWdlIC0gMTtcblx0XHRcdGxldCBwcmVsb2FkSW5kZXg7XG5cblx0XHRcdGlmIChjdXJyZW50SW5kZXggJiYgbmV4dFByb3BzLmN1cnJlbnRJbWFnZSA+IGN1cnJlbnRJbmRleCkge1xuXHRcdFx0XHRwcmVsb2FkSW5kZXggPSBuZXh0SW5kZXg7XG5cdFx0XHR9IGVsc2UgaWYgKGN1cnJlbnRJbmRleCAmJiBuZXh0UHJvcHMuY3VycmVudEltYWdlIDwgY3VycmVudEluZGV4KSB7XG5cdFx0XHRcdHByZWxvYWRJbmRleCA9IHByZXZJbmRleDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gaWYgd2Uga25vdyB0aGUgdXNlcidzIGRpcmVjdGlvbiBqdXN0IGdldCBvbmUgaW1hZ2Vcblx0XHRcdC8vIG90aGVyd2lzZSwgdG8gYmUgc2FmZSwgd2UgbmVlZCB0byBncmFiIG9uZSBpbiBlYWNoIGRpcmVjdGlvblxuXHRcdFx0aWYgKHByZWxvYWRJbmRleCkge1xuXHRcdFx0XHR0aGlzLnByZWxvYWRJbWFnZShwcmVsb2FkSW5kZXgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wcmVsb2FkSW1hZ2UocHJldkluZGV4KTtcblx0XHRcdFx0dGhpcy5wcmVsb2FkSW1hZ2UobmV4dEluZGV4KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBhZGQvcmVtb3ZlIGV2ZW50IGxpc3RlbmVyc1xuXHRcdGlmICghdGhpcy5wcm9wcy5pc09wZW4gJiYgbmV4dFByb3BzLmlzT3BlbiAmJiBuZXh0UHJvcHMuZW5hYmxlS2V5Ym9hcmRJbnB1dCkge1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWJvYXJkSW5wdXQpO1xuXHRcdH1cblx0XHRpZiAoIW5leHRQcm9wcy5pc09wZW4gJiYgbmV4dFByb3BzLmVuYWJsZUtleWJvYXJkSW5wdXQpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlib2FyZElucHV0KTtcblx0XHR9XG5cdH1cblx0Y29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmVuYWJsZUtleWJvYXJkSW5wdXQpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlib2FyZElucHV0KTtcblx0XHR9XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gTUVUSE9EU1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwcmVsb2FkSW1hZ2UgKGlkeCkge1xuXHRcdGNvbnN0IGltYWdlID0gdGhpcy5wcm9wcy5pbWFnZXNbaWR4XTtcblxuXHRcdGlmICghaW1hZ2UpIHJldHVybjtcblxuXHRcdGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuXG5cdFx0aW1nLnNyYyA9IGltYWdlLnNyYztcblxuXHRcdGlmIChpbWFnZS5zcmNzZXQpIHtcblx0XHRcdGltZy5zcmNzZXQgPSBpbWFnZS5zcmNzZXQuam9pbigpO1xuXHRcdH1cblxuXHR9XG5cdGdvdG9OZXh0IChldmVudCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmN1cnJlbnRJbWFnZSA9PT0gKHRoaXMucHJvcHMuaW1hZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm47XG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXHRcdHRoaXMucHJvcHMub25DbGlja05leHQoKTtcblx0XHR0aGlzLnNldFN0YXRlKHsgcm90YXRlOiAwIH0pO1xuXG5cdH1cblx0Z290b1ByZXYgKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuY3VycmVudEltYWdlID09PSAwKSByZXR1cm47XG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXHRcdHRoaXMucHJvcHMub25DbGlja1ByZXYoKTtcblx0XHR0aGlzLnNldFN0YXRlKHsgcm90YXRlOiAwIH0pO1xuXG5cdH1cblx0aGFuZGxlS2V5Ym9hcmRJbnB1dCAoZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpIHsgLy8gbGVmdFxuXHRcdFx0dGhpcy5nb3RvUHJldihldmVudCk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5KSB7IC8vIHJpZ2h0XG5cdFx0XHR0aGlzLmdvdG9OZXh0KGV2ZW50KTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHsgLy8gZXNjXG5cdFx0XHR0aGlzLnByb3BzLm9uQ2xvc2UoKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0fVxuXHRyb3RhdGUgKGV2ZW50KSB7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGlmICh0aGlzLnN0YXRlLnJvdGF0ZSA9PT0gMzYwKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgcm90YXRlOiA5MCB9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHJvdGF0ZTogdGhpcy5zdGF0ZS5yb3RhdGUgKyA5MCB9KTtcblx0XHR9XG5cblx0fVxuXHR6b29tIChldmVudCkge1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRpZiAodGhpcy5zdGF0ZS5pc1pvb21lZCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzWm9vbWVkOiBmYWxzZSxcblx0XHRcdFx0bWFyZ2luOiAwLFxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc1pvb21lZDogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiAwLFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH1cblx0ZXZlbnRQcmV2ZW50RGVmYXVsdCAoZXZlbnQpIHtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBSRU5ERVJFUlNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cmVuZGVyQXJyb3dQcmV2ICgpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5jdXJyZW50SW1hZ2UgPT09IDApIHJldHVybiBudWxsO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxBcnJvd1xuXHRcdFx0XHRkaXJlY3Rpb249XCJsZWZ0XCJcblx0XHRcdFx0aWNvbj1cImFycm93TGVmdFwiXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMuZ290b1ByZXZ9XG5cdFx0XHRcdHRpdGxlPXt0aGlzLnByb3BzLmxlZnRBcnJvd1RpdGxlfVxuXHRcdFx0XHR0eXBlPVwiYnV0dG9uXCJcblx0XHRcdC8+XG5cdFx0KTtcblx0fVxuXHRyZW5kZXJBcnJvd05leHQgKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmN1cnJlbnRJbWFnZSA9PT0gKHRoaXMucHJvcHMuaW1hZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm4gbnVsbDtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8QXJyb3dcblx0XHRcdFx0ZGlyZWN0aW9uPVwicmlnaHRcIlxuXHRcdFx0XHRpY29uPVwiYXJyb3dSaWdodFwiXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMuZ290b05leHR9XG5cdFx0XHRcdHRpdGxlPXt0aGlzLnByb3BzLnJpZ2h0QXJyb3dUaXRsZX1cblx0XHRcdFx0dHlwZT1cImJ1dHRvblwiXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cblx0cmVuZGVyRGlhbG9nICgpIHtcblx0XHRjb25zdCB7XG5cdFx0XHRiYWNrZHJvcENsb3Nlc01vZGFsLFxuXHRcdFx0Y3VzdG9tQ29udHJvbHMsXG5cdFx0XHRpc09wZW4sXG5cdFx0XHRvbkNsb3NlLFxuXHRcdFx0c2hvd0Nsb3NlQnV0dG9uLFxuXHRcdFx0c2hvd1JvdGF0ZUJ1dHRvbixcblx0XHRcdHNob3dUaHVtYm5haWxzLFxuXHRcdFx0cm90YXRlQnV0dG9uVGl0bGUsXG5cdFx0XHR3aWR0aCxcblx0XHR9ID0gdGhpcy5wcm9wcztcblxuXHRcdGlmICghaXNPcGVuKSByZXR1cm4gPHNwYW4ga2V5PVwiY2xvc2VkXCIgLz47XG5cblx0XHRsZXQgb2Zmc2V0VGh1bWJuYWlscyA9IDA7XG5cdFx0aWYgKHNob3dUaHVtYm5haWxzKSB7XG5cdFx0XHRvZmZzZXRUaHVtYm5haWxzID0gdGhlbWUudGh1bWJuYWlsLnNpemUgKyB0aGVtZS5jb250YWluZXIuZ3V0dGVyLnZlcnRpY2FsO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8Q29udGFpbmVyXG5cdFx0XHRcdGtleT1cIm9wZW5cIlxuXHRcdFx0XHRvbkNsaWNrPXshIWJhY2tkcm9wQ2xvc2VzTW9kYWwgJiYgb25DbG9zZX1cblx0XHRcdFx0b25Ub3VjaEVuZD17ISFiYWNrZHJvcENsb3Nlc01vZGFsICYmIG9uQ2xvc2V9XG5cdFx0XHQ+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5jb250ZW50KX0gc3R5bGU9e3sgbWFyZ2luQm90dG9tOiBvZmZzZXRUaHVtYm5haWxzLCBtYXhXaWR0aDogd2lkdGggfX0+XG5cdFx0XHRcdFx0PEhlYWRlclxuXHRcdFx0XHRcdFx0Y3VzdG9tQ29udHJvbHM9e2N1c3RvbUNvbnRyb2xzfVxuXHRcdFx0XHRcdFx0b25DbG9zZT17b25DbG9zZX1cblx0XHRcdFx0XHRcdG9uUm90YXRlPXt0aGlzLnJvdGF0ZX1cblx0XHRcdFx0XHRcdHNob3dDbG9zZUJ1dHRvbj17c2hvd0Nsb3NlQnV0dG9ufVxuXHRcdFx0XHRcdFx0Y2xvc2VCdXR0b25UaXRsZT17dGhpcy5wcm9wcy5jbG9zZUJ1dHRvblRpdGxlfVxuXHRcdFx0XHRcdFx0cm90YXRlQnV0dG9uVGl0bGU9e3JvdGF0ZUJ1dHRvblRpdGxlfVxuXHRcdFx0XHRcdFx0c2hvd1JvdGF0ZUJ1dHRvbj17c2hvd1JvdGF0ZUJ1dHRvbn1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdHt0aGlzLnJlbmRlckltYWdlcygpfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0e3RoaXMucmVuZGVyVGh1bWJuYWlscygpfVxuXHRcdFx0XHR7dGhpcy5yZW5kZXJBcnJvd1ByZXYoKX1cblx0XHRcdFx0e3RoaXMucmVuZGVyQXJyb3dOZXh0KCl9XG5cdFx0XHRcdDxTY3JvbGxMb2NrIC8+XG5cdFx0XHQ8L0NvbnRhaW5lcj5cblx0XHQpO1xuXHR9XG5cdHJlbmRlckltYWdlcyAoKSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0Y3VycmVudEltYWdlLFxuXHRcdFx0aW1hZ2VzLFxuXHRcdFx0aW1hZ2VDb3VudFNlcGFyYXRvcixcblx0XHRcdG9uQ2xpY2tJbWFnZSxcblx0XHRcdHNob3dJbWFnZUNvdW50LFxuXHRcdFx0c2hvd1RodW1ibmFpbHMsXG5cdFx0fSA9IHRoaXMucHJvcHM7XG5cblx0XHRpZiAoIWltYWdlcyB8fCAhaW1hZ2VzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cblx0XHRjb25zdCBpbWFnZSA9IGltYWdlc1tjdXJyZW50SW1hZ2VdO1xuXG5cdFx0bGV0IHNyY3NldDtcblx0XHRsZXQgc2l6ZXM7XG5cblx0XHRpZiAoaW1hZ2Uuc3Jjc2V0KSB7XG5cdFx0XHRzcmNzZXQgPSBpbWFnZS5zcmNzZXQuam9pbigpO1xuXHRcdFx0c2l6ZXMgPSAnMTAwdncnO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRodW1ibmFpbHNTaXplID0gc2hvd1RodW1ibmFpbHMgPyB0aGVtZS50aHVtYm5haWwuc2l6ZSA6IDA7XG5cdFx0Y29uc3QgaGVpZ2h0T2Zmc2V0ID0gYCR7dGhlbWUuaGVhZGVyLmhlaWdodCArIHRoZW1lLmZvb3Rlci5oZWlnaHQgKyB0aHVtYm5haWxzU2l6ZSArICh0aGVtZS5jb250YWluZXIuZ3V0dGVyLnZlcnRpY2FsKX1weGA7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGZpZ3VyZSBjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmZpZ3VyZSl9PlxuXHRcdFx0XHR7Lypcblx0XHRcdFx0XHRSZS1pbXBsZW1lbnQgd2hlbiByZWFjdCB3YXJuaW5nIFwidW5rbm93biBwcm9wc1wiXG5cdFx0XHRcdFx0aHR0cHM6Ly9mYi5tZS9yZWFjdC11bmtub3duLXByb3AgaXMgcmVzb2x2ZWRcblx0XHRcdFx0XHQ8U3dpcGVhYmxlIG9uU3dpcGVkTGVmdD17dGhpcy5nb3RvTmV4dH0gb25Td2lwZWRSaWdodD17dGhpcy5nb3RvUHJldn0gLz5cblx0XHRcdFx0Ki99XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5pbWFnZVdyYXBwZXIpfT5cblx0XHRcdFx0XHQ8aW1nXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmltYWdlKX1cblx0XHRcdFx0XHRcdG9uQ2xpY2s9e29uQ2xpY2tJbWFnZSA/IG9uQ2xpY2tJbWFnZSA6IHRoaXMucHJvcHMuem9vbSA/IHRoaXMuem9vbSA6IG51bGx9XG5cdFx0XHRcdFx0XHRhbHQ9e2ltYWdlLmFsdH1cblx0XHRcdFx0XHRcdHNyYz17aW1hZ2Uuc3JjfVxuXHRcdFx0XHRcdFx0c3JjU2V0PXtzcmNzZXR9XG5cdFx0XHRcdFx0XHRzdHlsZT17e1xuXHRcdFx0XHRcdFx0XHRjdXJzb3I6IHRoaXMucHJvcHMuem9vbSA/ICF0aGlzLnN0YXRlLmlzWm9vbWVkID8gJ3pvb20taW4nIDogJ3pvb20tb3V0JyA6IG9uQ2xpY2tJbWFnZSA/ICdwb2ludGVyJyA6ICdhdXRvJyxcblx0XHRcdFx0XHRcdFx0bWF4SGVpZ2h0OiAhdGhpcy5zdGF0ZS5pc1pvb21lZCA/ICc2MzBweCcgOiAnMTIwdmgnLFxuXHRcdFx0XHRcdFx0XHRtYXhXaWR0aDogIXRoaXMuc3RhdGUuaXNab29tZWQgPyAnNTc0cHgnIDogJzEyMHZoJyxcblx0XHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAhdGhpcy5zdGF0ZS5pc1pvb21lZCA/IGBzY2FsZSgxKSByb3RhdGUoJHt0aGlzLnN0YXRlLnJvdGF0ZX1kZWcpYCA6IGBzY2FsZSgxLjQpIHJvdGF0ZSgke3RoaXMuc3RhdGUucm90YXRlfWRlZylgLFxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IHRoaXMuc3RhdGUubWFyZ2luLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2l0aW9uOiAnYWxsIC4xcycsXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRcdFx0XHRcdFx0fX1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRoaXMucHJvcHMuY29udGVudCA/IFxuXHRcdFx0XHRcdFx0XHQ8ZmlnY2FwdGlvblxuXHRcdFx0XHRcdFx0XHRcdGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuZmlnY2FwdGlvbil9XG5cdFx0XHRcdFx0XHRcdFx0c3R5bGU9e3tcblx0XHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6ICF0aGlzLnN0YXRlLmlzWm9vbWVkID8gJ2lubGluZS1ibG9jaycgOiAnbm9uZScsXG5cdFx0XHRcdFx0XHRcdFx0fX1cblx0XHRcdFx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLmV2ZW50UHJldmVudERlZmF1bHR9XG5cdFx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdFx0XHR7dGhpcy5wcm9wcy5jaGlsZHJlbn1cblx0XHRcdFx0XHRcdFx0PC9maWdjYXB0aW9uPlxuXHRcdFx0XHRcdFx0OiAnJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxGb290ZXJcblx0XHRcdFx0XHRjYXB0aW9uPXtpbWFnZXNbY3VycmVudEltYWdlXS5jYXB0aW9ufVxuXHRcdFx0XHRcdGNvdW50Q3VycmVudD17Y3VycmVudEltYWdlICsgMX1cblx0XHRcdFx0XHRjb3VudFNlcGFyYXRvcj17aW1hZ2VDb3VudFNlcGFyYXRvcn1cblx0XHRcdFx0XHRjb3VudFRvdGFsPXtpbWFnZXMubGVuZ3RofVxuXHRcdFx0XHRcdHNob3dDb3VudD17c2hvd0ltYWdlQ291bnR9XG5cdFx0XHRcdC8+XG5cdFx0XHQ8L2ZpZ3VyZT5cblx0XHQpO1xuXHR9XG5cdHJlbmRlclRodW1ibmFpbHMgKCkge1xuXHRcdGNvbnN0IHsgaW1hZ2VzLCBjdXJyZW50SW1hZ2UsIG9uQ2xpY2tUaHVtYm5haWwsIHNob3dUaHVtYm5haWxzLCB0aHVtYm5haWxPZmZzZXQgfSA9IHRoaXMucHJvcHM7XG5cblx0XHRpZiAoIXNob3dUaHVtYm5haWxzKSByZXR1cm47XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PFBhZ2luYXRlZFRodW1ibmFpbHNcblx0XHRcdFx0Y3VycmVudEltYWdlPXtjdXJyZW50SW1hZ2V9XG5cdFx0XHRcdGltYWdlcz17aW1hZ2VzfVxuXHRcdFx0XHRvZmZzZXQ9e3RodW1ibmFpbE9mZnNldH1cblx0XHRcdFx0b25DbGlja1RodW1ibmFpbD17b25DbGlja1RodW1ibmFpbH1cblx0XHRcdC8+XG5cdFx0KTtcblx0fVxuXHRyZW5kZXIgKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8UG9ydGFsPlxuXHRcdFx0XHR7dGhpcy5yZW5kZXJEaWFsb2coKX1cblx0XHRcdDwvUG9ydGFsPlxuXHRcdCk7XG5cdH1cbn1cblxuTGlnaHRib3gucHJvcFR5cGVzID0ge1xuXHRiYWNrZHJvcENsb3Nlc01vZGFsOiBQcm9wVHlwZXMuYm9vbCxcblx0Y2xvc2VCdXR0b25UaXRsZTogUHJvcFR5cGVzLnN0cmluZyxcblx0Y3VycmVudEltYWdlOiBQcm9wVHlwZXMubnVtYmVyLFxuXHRjdXN0b21Db250cm9sczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm5vZGUpLFxuXHRlbmFibGVLZXlib2FyZElucHV0OiBQcm9wVHlwZXMuYm9vbCxcblx0aW1hZ2VDb3VudFNlcGFyYXRvcjogUHJvcFR5cGVzLnN0cmluZyxcblx0aW1hZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihcblx0XHRQcm9wVHlwZXMuc2hhcGUoe1xuXHRcdFx0c3JjOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cdFx0XHRzcmNzZXQ6IFByb3BUeXBlcy5hcnJheSxcblx0XHRcdGNhcHRpb246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5lbGVtZW50XSksXG5cdFx0XHR0aHVtYm5haWw6IFByb3BUeXBlcy5zdHJpbmcsXG5cdFx0fSlcblx0KS5pc1JlcXVpcmVkLFxuXHRpc09wZW46IFByb3BUeXBlcy5ib29sLFxuXHRsZWZ0QXJyb3dUaXRsZTogUHJvcFR5cGVzLnN0cmluZyxcblx0b25DbGlja0ltYWdlOiBQcm9wVHlwZXMuZnVuYyxcblx0b25DbGlja05leHQ6IFByb3BUeXBlcy5mdW5jLFxuXHRvbkNsaWNrUHJldjogUHJvcFR5cGVzLmZ1bmMsXG5cdG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdHByZWxvYWROZXh0SW1hZ2U6IFByb3BUeXBlcy5ib29sLFxuXHRyaWdodEFycm93VGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXG5cdHNob3dDbG9zZUJ1dHRvbjogUHJvcFR5cGVzLmJvb2wsXG5cdHNob3dJbWFnZUNvdW50OiBQcm9wVHlwZXMuYm9vbCxcblx0c2hvd1RodW1ibmFpbHM6IFByb3BUeXBlcy5ib29sLFxuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdCxcblx0dGh1bWJuYWlsT2Zmc2V0OiBQcm9wVHlwZXMubnVtYmVyLFxuXHR3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbn07XG5MaWdodGJveC5kZWZhdWx0UHJvcHMgPSB7XG5cdGNsb3NlQnV0dG9uVGl0bGU6ICdDbG9zZSAoRXNjKScsXG5cdHJvdGF0ZUJ1dHRvblRpdGxlOiAnUm90YXRlJyxcblx0Y3VycmVudEltYWdlOiAwLFxuXHRlbmFibGVLZXlib2FyZElucHV0OiB0cnVlLFxuXHRpbWFnZUNvdW50U2VwYXJhdG9yOiAnIG9mICcsXG5cdGxlZnRBcnJvd1RpdGxlOiAnUHJldmlvdXMgKExlZnQgYXJyb3cga2V5KScsXG5cdG9uQ2xpY2tTaG93TmV4dEltYWdlOiB0cnVlLFxuXHRwcmVsb2FkTmV4dEltYWdlOiB0cnVlLFxuXHRyaWdodEFycm93VGl0bGU6ICdOZXh0IChSaWdodCBhcnJvdyBrZXkpJyxcblx0c2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxuXHRzaG93SW1hZ2VDb3VudDogdHJ1ZSxcblx0c2hvd1JvdGF0ZUJ1dHRvbjogdHJ1ZSxcblx0dGhlbWU6IHt9LFxuXHR0aHVtYm5haWxPZmZzZXQ6IDIsXG5cdHdpZHRoOiAxMDI0LFxuXHR6b29tOiBmYWxzZSxcblx0Y29udGVudDogZmFsc2UsXG59O1xuTGlnaHRib3guY2hpbGRDb250ZXh0VHlwZXMgPSB7XG5cdHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5jb25zdCBjbGFzc2VzID0gU3R5bGVTaGVldC5jcmVhdGUoe1xuXHRjb250ZW50OiB7XG5cdFx0cG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdH0sXG5cdGZpZ3VyZToge1xuXHRcdG1hcmdpbjogMCwgLy8gcmVtb3ZlIGJyb3dzZXIgZGVmYXVsdFxuXHR9LFxuXHRpbWFnZVdyYXBwZXI6IHtcblx0XHRkaXNwbGF5OiAnZmxleCcsXG5cdFx0YWxpZ25JdGVtczogJ2NlbnRlcicsXG5cdFx0anVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuXHRcdGJhY2tncm91bmQ6ICcjMDAwJyxcblx0fSxcblx0aW1hZ2U6IHtcblx0XHRkaXNwbGF5OiAnYmxvY2snLCAvLyByZW1vdmVzIGJyb3dzZXIgZGVmYXVsdCBndXR0ZXJcblx0XHRoZWlnaHQ6ICdhdXRvJyxcblx0XHRtYXJnaW46ICcwIGF1dG8nLCAvLyBtYWludGFpbiBjZW50ZXIgb24gdmVyeSBzaG9ydCBzY3JlZW5zIE9SIHZlcnkgbmFycm93IGltYWdlXG5cdFx0bWF4V2lkdGg6ICcxMDAlJyxcblxuXHRcdC8vIGRpc2FibGUgdXNlciBzZWxlY3Rcblx0XHRXZWJraXRUb3VjaENhbGxvdXQ6ICdub25lJyxcblx0XHR1c2VyU2VsZWN0OiAnbm9uZScsXG5cdH0sXG5cdGZpZ2NhcHRpb246IHtcblx0XHRiYWNrZ3JvdW5kOiAnI2ZmZicsXG5cdFx0d2lkdGg6ICc0NTBweCcsXG5cdFx0dmVydGljYWxBbGlnbjogJ3RvcCcsXG5cdFx0aGVpZ2h0OiAnNjMwcHgnLFxuXHRcdG92ZXJmbG93OiAnYXV0bycsXG5cdH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTGlnaHRib3g7XG4iXX0=
