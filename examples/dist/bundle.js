require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _inlineStylePrefixerStatic = require('inline-style-prefixer/static');

var _inlineStylePrefixerStatic2 = _interopRequireDefault(_inlineStylePrefixerStatic);

var _util = require('./util');

/**
 * Generate CSS for a selector and some styles.
 *
 * This function handles the media queries, pseudo selectors, and descendant
 * styles that can be used in aphrodite styles.
 *
 * @param {string} selector: A base CSS selector for the styles to be generated
 *     with.
 * @param {Object} styleTypes: A list of properties of the return type of
 *     StyleSheet.create, e.g. [styles.red, styles.blue].
 * @param stringHandlers: See `generateCSSRuleset`
 * @param useImportant: See `generateCSSRuleset`
 *
 * To actually generate the CSS special-construct-less styles are passed to
 * `generateCSSRuleset`.
 *
 * For instance, a call to
 *
 *     generateCSSInner(".foo", {
 *       color: "red",
 *       "@media screen": {
 *         height: 20,
 *         ":hover": {
 *           backgroundColor: "black"
 *         }
 *       },
 *       ":active": {
 *         fontWeight: "bold",
 *         ">>bar": {
 *           _names: { "foo_bar": true },
 *           height: 10,
 *         }
 *       }
 *     });
 *
 * will make 5 calls to `generateCSSRuleset`:
 *
 *     generateCSSRuleset(".foo", { color: "red" }, ...)
 *     generateCSSRuleset(".foo:active", { fontWeight: "bold" }, ...)
 *     generateCSSRuleset(".foo:active .foo_bar", { height: 10 }, ...)
 *     // These 2 will be wrapped in @media screen {}
 *     generateCSSRuleset(".foo", { height: 20 }, ...)
 *     generateCSSRuleset(".foo:hover", { backgroundColor: "black" }, ...)
 */
var generateCSS = function generateCSS(selector, styleTypes, stringHandlers, useImportant) {
    var merged = styleTypes.reduce(_util.recursiveMerge);

    var declarations = {};
    var mediaQueries = {};
    var pseudoStyles = {};

    Object.keys(merged).forEach(function (key) {
        if (key[0] === ':') {
            pseudoStyles[key] = merged[key];
        } else if (key[0] === '@') {
            mediaQueries[key] = merged[key];
        } else {
            declarations[key] = merged[key];
        }
    });

    return generateCSSRuleset(selector, declarations, stringHandlers, useImportant) + Object.keys(pseudoStyles).map(function (pseudoSelector) {
        return generateCSSRuleset(selector + pseudoSelector, pseudoStyles[pseudoSelector], stringHandlers, useImportant);
    }).join("") + Object.keys(mediaQueries).map(function (mediaQuery) {
        var ruleset = generateCSS(selector, [mediaQueries[mediaQuery]], stringHandlers, useImportant);
        return mediaQuery + '{' + ruleset + '}';
    }).join("");
};

exports.generateCSS = generateCSS;
/**
 * Helper method of generateCSSRuleset to facilitate custom handling of certain
 * CSS properties. Used for e.g. font families.
 *
 * See generateCSSRuleset for usage and documentation of paramater types.
 */
var runStringHandlers = function runStringHandlers(declarations, stringHandlers) {
    var result = {};

    Object.keys(declarations).forEach(function (key) {
        // If a handler exists for this particular key, let it interpret
        // that value first before continuing
        if (stringHandlers && stringHandlers.hasOwnProperty(key)) {
            result[key] = stringHandlers[key](declarations[key]);
        } else {
            result[key] = declarations[key];
        }
    });

    return result;
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
var generateCSSRuleset = function generateCSSRuleset(selector, declarations, stringHandlers, useImportant) {
    var handledDeclarations = runStringHandlers(declarations, stringHandlers);

    var prefixedDeclarations = (0, _inlineStylePrefixerStatic2['default'])(handledDeclarations);

    var prefixedRules = (0, _util.flatten)((0, _util.objectToPairs)(prefixedDeclarations).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var key = _ref2[0];
        var value = _ref2[1];

        if (Array.isArray(value)) {
            var _ret = (function () {
                // inline-style-prefix-all returns an array when there should be
                // multiple rules, we will flatten to single rules

                var prefixedValues = [];
                var unprefixedValues = [];

                value.forEach(function (v) {
                    if (v.indexOf('-') === 0) {
                        prefixedValues.push(v);
                    } else {
                        unprefixedValues.push(v);
                    }
                });

                prefixedValues.sort();
                unprefixedValues.sort();

                return {
                    v: prefixedValues.concat(unprefixedValues).map(function (v) {
                        return [key, v];
                    })
                };
            })();

            if (typeof _ret === 'object') return _ret.v;
        }
        return [[key, value]];
    }));

    var rules = prefixedRules.map(function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var key = _ref32[0];
        var value = _ref32[1];

        var stringValue = (0, _util.stringifyValue)(key, value);
        var ret = (0, _util.kebabifyStyleName)(key) + ':' + stringValue + ';';
        return useImportant === false ? ret : (0, _util.importantify)(ret);
    }).join("");

    if (rules) {
        return selector + '{' + rules + '}';
    } else {
        return "";
    }
};
exports.generateCSSRuleset = generateCSSRuleset;
},{"./util":5,"inline-style-prefixer/static":29}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _util = require('./util');

var _inject = require('./inject');

var StyleSheet = {
    create: function create(sheetDefinition) {
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
        var renderedClassNames = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        (0, _inject.addRenderedClassNames)(renderedClassNames);
    }
};

/**
 * Utilities for using Aphrodite server-side.
 */
var StyleSheetServer = {
    renderStatic: function renderStatic(renderFunc) {
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

var css = function css() {
    for (var _len = arguments.length, styleDefinitions = Array(_len), _key = 0; _key < _len; _key++) {
        styleDefinitions[_key] = arguments[_key];
    }

    var useImportant = true; // Append !important to all style definitions
    return (0, _inject.injectAndGetClassName)(useImportant, styleDefinitions);
};

exports['default'] = {
    StyleSheet: StyleSheet,
    StyleSheetServer: StyleSheetServer,
    StyleSheetTestUtils: StyleSheetTestUtils,
    css: css
};
module.exports = exports['default'];
},{"./inject":3,"./util":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _asap = require('asap');

var _asap2 = _interopRequireDefault(_asap);

var _generate = require('./generate');

var _util = require('./util');

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
var injectStyleTag = function injectStyleTag(cssContents) {
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
            injectStyleOnce(val.fontFamily, "@font-face", [val], false);
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
    animationName: function animationName(val) {
        if (typeof val !== "object") {
            return val;
        }

        // Generate a unique name based on the hash of the object. We can't
        // just use the hash because the name can't start with a number.
        // TODO(emily): this probably makes debugging hard, allow a custom
        // name?
        var name = 'keyframe_' + (0, _util.hashObject)(val);

        // Since keyframes need 3 layers of nesting, we use `generateCSS` to
        // build the inner layers and wrap it in `@keyframes` ourselves.
        var finalVal = '@keyframes ' + name + '{';
        Object.keys(val).forEach(function (key) {
            finalVal += (0, _generate.generateCSS)(key, [val[key]], stringHandlers, false);
        });
        finalVal += '}';

        injectGeneratedCSSOnce(name, finalVal);

        return name;
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
    if (!alreadyInjected[key]) {
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
    }
};

var injectStyleOnce = function injectStyleOnce(key, selector, definitions, useImportant) {
    if (!alreadyInjected[key]) {
        var generated = (0, _generate.generateCSS)(selector, definitions, stringHandlers, useImportant);

        injectGeneratedCSSOnce(key, generated);
    }
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
var addRenderedClassNames = function addRenderedClassNames(classNames) {
    classNames.forEach(function (className) {
        alreadyInjected[className] = true;
    });
};

exports.addRenderedClassNames = addRenderedClassNames;
/**
 * Inject styles associated with the passed style definition objects, and return
 * an associated CSS class name.
 *
 * @param {boolean} useImportant If true, will append !important to generated
 *     CSS output. e.g. {color: red} -> "color: red !important".
 * @param {Object[]} styleDefinitions style definition objects as returned as
 *     properties of the return value of StyleSheet.create().
 */
var injectAndGetClassName = function injectAndGetClassName(useImportant, styleDefinitions) {
    // Filter out falsy values from the input, to allow for
    // `css(a, test && c)`
    var validDefinitions = styleDefinitions.filter(function (def) {
        return def;
    });

    // Break if there aren't any valid styles.
    if (validDefinitions.length === 0) {
        return "";
    }

    var className = validDefinitions.map(function (s) {
        return s._name;
    }).join("-o_O-");
    injectStyleOnce(className, '.' + className, validDefinitions.map(function (d) {
        return d._definition;
    }), useImportant);

    return className;
};
exports.injectAndGetClassName = injectAndGetClassName;
},{"./generate":1,"./util":5,"asap":7}],4:[function(require,module,exports){
// Module with the same interface as the core aphrodite module,
// except that styles injected do not automatically have !important
// appended to them.
//
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _inject = require('./inject');

var _indexJs = require('./index.js');

var css = function css() {
    for (var _len = arguments.length, styleDefinitions = Array(_len), _key = 0; _key < _len; _key++) {
        styleDefinitions[_key] = arguments[_key];
    }

    var useImportant = false; // Don't append !important to style definitions
    return (0, _inject.injectAndGetClassName)(useImportant, styleDefinitions);
};

exports.StyleSheet = _indexJs.StyleSheet;
exports.StyleSheetServer = _indexJs.StyleSheetServer;
exports.StyleSheetTestUtils = _indexJs.StyleSheetTestUtils;
exports.css = css;
},{"./index.js":2,"./inject":3}],5:[function(require,module,exports){
// {K1: V1, K2: V2, ...} -> [[K1, V1], [K2, V2]]
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var objectToPairs = function objectToPairs(obj) {
    return Object.keys(obj).map(function (key) {
        return [key, obj[key]];
    });
};

exports.objectToPairs = objectToPairs;
// [[K1, V1], [K2, V2]] -> {K1: V1, K2: V2, ...}
var pairsToObject = function pairsToObject(pairs) {
    var result = {};
    pairs.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var key = _ref2[0];
        var val = _ref2[1];

        result[key] = val;
    });
    return result;
};

var mapObj = function mapObj(obj, fn) {
    return pairsToObject(objectToPairs(obj).map(fn));
};

exports.mapObj = mapObj;
// Flattens an array one level
// [[A], [B, C, [D]]] -> [A, B, C, [D]]
var flatten = function flatten(list) {
    return list.reduce(function (memo, x) {
        return memo.concat(x);
    }, []);
};

exports.flatten = flatten;
var UPPERCASE_RE = /([A-Z])/g;
var MS_RE = /^ms-/;

var kebabify = function kebabify(string) {
    return string.replace(UPPERCASE_RE, '-$1').toLowerCase();
};
var kebabifyStyleName = function kebabifyStyleName(string) {
    return kebabify(string).replace(MS_RE, '-ms-');
};

exports.kebabifyStyleName = kebabifyStyleName;
var recursiveMerge = function recursiveMerge(a, b) {
    // TODO(jlfwong): Handle malformed input where a and b are not the same
    // type.

    if (typeof a !== 'object') {
        return b;
    }

    var ret = _extends({}, a);

    Object.keys(b).forEach(function (key) {
        if (ret.hasOwnProperty(key)) {
            ret[key] = recursiveMerge(a[key], b[key]);
        } else {
            ret[key] = b[key];
        }
    });

    return ret;
};

exports.recursiveMerge = recursiveMerge;
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

var stringifyValue = function stringifyValue(key, prop) {
    if (typeof prop === "number") {
        if (isUnitlessNumber[key]) {
            return "" + prop;
        } else {
            return prop + "px";
        }
    } else {
        return prop;
    }
};

exports.stringifyValue = stringifyValue;
/**
 * JS Implementation of MurmurHash2
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} str ASCII only
 * @return {string} Base 36 encoded hash result
 */
function murmurhash2_32_gc(str) {
    var l = str.length;
    var h = l;
    var i = 0;
    var k = undefined;

    while (l >= 4) {
        k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;

        k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
        k ^= k >>> 24;
        k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);

        h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;

        l -= 4;
        ++i;
    }

    switch (l) {
        case 3:
            h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            h ^= str.charCodeAt(i) & 0xff;
            h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    }

    h ^= h >>> 13;
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h ^= h >>> 15;

    return (h >>> 0).toString(36);
}

// Hash a javascript object using JSON.stringify. This is very fast, about 3
// microseconds on my computer for a sample object:
// http://jsperf.com/test-hashfnv32a-hash/5
//
// Note that this uses JSON.stringify to stringify the objects so in order for
// this to produce consistent hashes browsers need to have a consistent
// ordering of objects. Ben Alpert says that Facebook depends on this, so we
// can probably depend on this too.
var hashObject = function hashObject(object) {
    return murmurhash2_32_gc(JSON.stringify(object));
};

exports.hashObject = hashObject;
var IMPORTANT_RE = /^([^:]+:.*?)( !important)?;$/;

// Given a single style rule string like "a: b;", adds !important to generate
// "a: b !important;".
var importantify = function importantify(string) {
    return string.replace(IMPORTANT_RE, function (_, base, important) {
        return base + " !important;";
    });
};
exports.importantify = importantify;
},{}],6:[function(require,module,exports){
module.exports = require('./lib/no-important.js');

},{"./lib/no-important.js":4}],7:[function(require,module,exports){
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

},{"./raw":8}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],10:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))

},{"_process":30}],11:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  (function () {
    var printWarning = function printWarning(format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    warning = function warning(condition, format) {
      if (format === undefined) {
        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
      }

      if (format.indexOf('Failed Composite propType: ') === 0) {
        return; // Ignore CompositeComponent proptype check.
      }

      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  })();
}

module.exports = warning;
}).call(this,require('_process'))

},{"./emptyFunction":9,"_process":30}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = calc;

var _joinPrefixedValue = require('../../utils/joinPrefixedValue');

var _joinPrefixedValue2 = _interopRequireDefault(_joinPrefixedValue);

var _isPrefixedValue = require('../../utils/isPrefixedValue');

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function calc(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('calc(') > -1) {
    return (0, _joinPrefixedValue2.default)(property, value, function (prefix, value) {
      return value.replace(/calc\(/g, prefix + 'calc(');
    });
  }
}
module.exports = exports['default'];
},{"../../utils/isPrefixedValue":26,"../../utils/joinPrefixedValue":27}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cursor;

var _joinPrefixedValue = require('../../utils/joinPrefixedValue');

var _joinPrefixedValue2 = _interopRequireDefault(_joinPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var values = {
  'zoom-in': true,
  'zoom-out': true,
  grab: true,
  grabbing: true
};

function cursor(property, value) {
  if (property === 'cursor' && values[value]) {
    return (0, _joinPrefixedValue2.default)(property, value);
  }
}
module.exports = exports['default'];
},{"../../utils/joinPrefixedValue":27}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flex;
var values = { flex: true, 'inline-flex': true };

function flex(property, value) {
  if (property === 'display' && values[value]) {
    return {
      display: ['-webkit-box', '-moz-box', '-ms-' + value + 'box', '-webkit-' + value, value]
    };
  }
}
module.exports = exports['default'];
},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flexboxIE;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

function flexboxIE(property, value) {
  if (alternativeProps[property]) {
    return _defineProperty({}, alternativeProps[property], alternativeValues[value] || value);
  }
}
module.exports = exports['default'];
},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flexboxOld;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

function flexboxOld(property, value) {
  if (property === 'flexDirection' && typeof value === 'string') {
    return {
      WebkitBoxOrient: value.indexOf('column') > -1 ? 'vertical' : 'horizontal',
      WebkitBoxDirection: value.indexOf('reverse') > -1 ? 'reverse' : 'normal'
    };
  }
  if (alternativeProps[property]) {
    return _defineProperty({}, alternativeProps[property], alternativeValues[value] || value);
  }
}
module.exports = exports['default'];
},{}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = gradient;

var _joinPrefixedValue = require('../../utils/joinPrefixedValue');

var _joinPrefixedValue2 = _interopRequireDefault(_joinPrefixedValue);

var _isPrefixedValue = require('../../utils/isPrefixedValue');

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var values = /linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/;

function gradient(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.match(values) !== null) {
    return (0, _joinPrefixedValue2.default)(property, value);
  }
}
module.exports = exports['default'];
},{"../../utils/isPrefixedValue":26,"../../utils/joinPrefixedValue":27}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = position;
function position(property, value) {
  if (property === 'position' && value === 'sticky') {
    return { position: ['-webkit-sticky', 'sticky'] };
  }
}
module.exports = exports['default'];
},{}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sizing;

var _joinPrefixedValue = require('../../utils/joinPrefixedValue');

var _joinPrefixedValue2 = _interopRequireDefault(_joinPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  if (properties[property] && values[value]) {
    return (0, _joinPrefixedValue2.default)(property, value);
  }
}
module.exports = exports['default'];
},{"../../utils/joinPrefixedValue":27}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transition;

var _hyphenateStyleName = require('hyphenate-style-name');

var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);

var _capitalizeString = require('../../utils/capitalizeString');

var _capitalizeString2 = _interopRequireDefault(_capitalizeString);

var _isPrefixedValue = require('../../utils/isPrefixedValue');

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

var _prefixProps = require('../prefixProps');

var _prefixProps2 = _interopRequireDefault(_prefixProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var properties = {
  transition: true,
  transitionProperty: true,
  WebkitTransition: true,
  WebkitTransitionProperty: true
};

function transition(property, value) {
  // also check for already prefixed transitions
  if (typeof value === 'string' && properties[property]) {
    var _ref2;

    var outputValue = prefixValue(value);
    var webkitOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (value) {
      return value.match(/-moz-|-ms-/) === null;
    }).join(',');

    // if the property is already prefixed
    if (property.indexOf('Webkit') > -1) {
      return _defineProperty({}, property, webkitOutput);
    }

    return _ref2 = {}, _defineProperty(_ref2, 'Webkit' + (0, _capitalizeString2.default)(property), webkitOutput), _defineProperty(_ref2, property, outputValue), _ref2;
  }
}

function prefixValue(value) {
  if ((0, _isPrefixedValue2.default)(value)) {
    return value;
  }

  // only split multi values, not cubic beziers
  var multipleValues = value.split(/,(?![^()]*(?:\([^()]*\))?\))/g);

  // iterate each single value and check for transitioned properties
  // that need to be prefixed as well
  multipleValues.forEach(function (val, index) {
    multipleValues[index] = Object.keys(_prefixProps2.default).reduce(function (out, prefix) {
      var dashCasePrefix = '-' + prefix.toLowerCase() + '-';

      Object.keys(_prefixProps2.default[prefix]).forEach(function (prop) {
        var dashCaseProperty = (0, _hyphenateStyleName2.default)(prop);

        if (val.indexOf(dashCaseProperty) > -1 && dashCaseProperty !== 'order') {
          // join all prefixes and create a new value
          out = val.replace(dashCaseProperty, dashCasePrefix + dashCaseProperty) + ',' + out;
        }
      });
      return out;
    }, val);
  });

  return multipleValues.join(',');
}
module.exports = exports['default'];
},{"../../utils/capitalizeString":24,"../../utils/isPrefixedValue":26,"../prefixProps":23,"hyphenate-style-name":12}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prefixAll;

var _prefixProps = require('./prefixProps');

var _prefixProps2 = _interopRequireDefault(_prefixProps);

var _capitalizeString = require('../utils/capitalizeString');

var _capitalizeString2 = _interopRequireDefault(_capitalizeString);

var _sortPrefixedStyle = require('../utils/sortPrefixedStyle');

var _sortPrefixedStyle2 = _interopRequireDefault(_sortPrefixedStyle);

var _position = require('./plugins/position');

var _position2 = _interopRequireDefault(_position);

var _calc = require('./plugins/calc');

var _calc2 = _interopRequireDefault(_calc);

var _cursor = require('./plugins/cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var _flex = require('./plugins/flex');

var _flex2 = _interopRequireDefault(_flex);

var _sizing = require('./plugins/sizing');

var _sizing2 = _interopRequireDefault(_sizing);

var _gradient = require('./plugins/gradient');

var _gradient2 = _interopRequireDefault(_gradient);

var _transition = require('./plugins/transition');

var _transition2 = _interopRequireDefault(_transition);

var _flexboxIE = require('./plugins/flexboxIE');

var _flexboxIE2 = _interopRequireDefault(_flexboxIE);

var _flexboxOld = require('./plugins/flexboxOld');

var _flexboxOld2 = _interopRequireDefault(_flexboxOld);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// special flexbox specifications


var plugins = [_position2.default, _calc2.default, _cursor2.default, _sizing2.default, _gradient2.default, _transition2.default, _flexboxIE2.default, _flexboxOld2.default, _flex2.default];

/**
 * Returns a prefixed version of the style object using all vendor prefixes
 * @param {Object} styles - Style object that gets prefixed properties added
 * @returns {Object} - Style object with prefixed properties and values
 */
function prefixAll(styles) {
  Object.keys(styles).forEach(function (property) {
    var value = styles[property];
    if (value instanceof Object && !Array.isArray(value)) {
      // recurse through nested style objects
      styles[property] = prefixAll(value);
    } else {
      Object.keys(_prefixProps2.default).forEach(function (prefix) {
        var properties = _prefixProps2.default[prefix];
        // add prefixes if needed
        if (properties[property]) {
          styles[prefix + (0, _capitalizeString2.default)(property)] = value;
        }
      });
    }
  });

  Object.keys(styles).forEach(function (property) {
    [].concat(styles[property]).forEach(function (value, index) {
      // resolve every special plugins
      plugins.forEach(function (plugin) {
        return assignStyles(styles, plugin(property, value));
      });
    });
  });

  return (0, _sortPrefixedStyle2.default)(styles);
}

function assignStyles(base) {
  var extend = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  Object.keys(extend).forEach(function (property) {
    var baseValue = base[property];
    if (Array.isArray(baseValue)) {
      [].concat(extend[property]).forEach(function (value) {
        var valueIndex = baseValue.indexOf(value);
        if (valueIndex > -1) {
          base[property].splice(valueIndex, 1);
        }
        base[property].push(value);
      });
    } else {
      base[property] = extend[property];
    }
  });
}
module.exports = exports['default'];
},{"../utils/capitalizeString":24,"../utils/sortPrefixedStyle":28,"./plugins/calc":13,"./plugins/cursor":14,"./plugins/flex":15,"./plugins/flexboxIE":16,"./plugins/flexboxOld":17,"./plugins/gradient":18,"./plugins/position":19,"./plugins/sizing":20,"./plugins/transition":21,"./prefixProps":23}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = { "Webkit": { "transform": true, "transformOrigin": true, "transformOriginX": true, "transformOriginY": true, "backfaceVisibility": true, "perspective": true, "perspectiveOrigin": true, "transformStyle": true, "transformOriginZ": true, "animation": true, "animationDelay": true, "animationDirection": true, "animationFillMode": true, "animationDuration": true, "animationIterationCount": true, "animationName": true, "animationPlayState": true, "animationTimingFunction": true, "appearance": true, "userSelect": true, "fontKerning": true, "textEmphasisPosition": true, "textEmphasis": true, "textEmphasisStyle": true, "textEmphasisColor": true, "boxDecorationBreak": true, "clipPath": true, "maskImage": true, "maskMode": true, "maskRepeat": true, "maskPosition": true, "maskClip": true, "maskOrigin": true, "maskSize": true, "maskComposite": true, "mask": true, "maskBorderSource": true, "maskBorderMode": true, "maskBorderSlice": true, "maskBorderWidth": true, "maskBorderOutset": true, "maskBorderRepeat": true, "maskBorder": true, "maskType": true, "textDecorationStyle": true, "textDecorationSkip": true, "textDecorationLine": true, "textDecorationColor": true, "filter": true, "fontFeatureSettings": true, "breakAfter": true, "breakBefore": true, "breakInside": true, "columnCount": true, "columnFill": true, "columnGap": true, "columnRule": true, "columnRuleColor": true, "columnRuleStyle": true, "columnRuleWidth": true, "columns": true, "columnSpan": true, "columnWidth": true, "flex": true, "flexBasis": true, "flexDirection": true, "flexGrow": true, "flexFlow": true, "flexShrink": true, "flexWrap": true, "alignContent": true, "alignItems": true, "alignSelf": true, "justifyContent": true, "order": true, "transition": true, "transitionDelay": true, "transitionDuration": true, "transitionProperty": true, "transitionTimingFunction": true, "backdropFilter": true, "scrollSnapType": true, "scrollSnapPointsX": true, "scrollSnapPointsY": true, "scrollSnapDestination": true, "scrollSnapCoordinate": true, "shapeImageThreshold": true, "shapeImageMargin": true, "shapeImageOutside": true, "hyphens": true, "flowInto": true, "flowFrom": true, "regionFragment": true, "textSizeAdjust": true }, "Moz": { "appearance": true, "userSelect": true, "boxSizing": true, "textAlignLast": true, "textDecorationStyle": true, "textDecorationSkip": true, "textDecorationLine": true, "textDecorationColor": true, "tabSize": true, "hyphens": true, "fontFeatureSettings": true, "breakAfter": true, "breakBefore": true, "breakInside": true, "columnCount": true, "columnFill": true, "columnGap": true, "columnRule": true, "columnRuleColor": true, "columnRuleStyle": true, "columnRuleWidth": true, "columns": true, "columnSpan": true, "columnWidth": true }, "ms": { "flex": true, "flexBasis": false, "flexDirection": true, "flexGrow": false, "flexFlow": true, "flexShrink": false, "flexWrap": true, "alignContent": false, "alignItems": false, "alignSelf": false, "justifyContent": false, "order": false, "transform": true, "transformOrigin": true, "transformOriginX": true, "transformOriginY": true, "userSelect": true, "wrapFlow": true, "wrapThrough": true, "wrapMargin": true, "scrollSnapType": true, "scrollSnapPointsX": true, "scrollSnapPointsY": true, "scrollSnapDestination": true, "scrollSnapCoordinate": true, "touchAction": true, "hyphens": true, "flowInto": true, "flowFrom": true, "breakBefore": true, "breakAfter": true, "breakInside": true, "regionFragment": true, "gridTemplateColumns": true, "gridTemplateRows": true, "gridTemplateAreas": true, "gridTemplate": true, "gridAutoColumns": true, "gridAutoRows": true, "gridAutoFlow": true, "grid": true, "gridRowStart": true, "gridColumnStart": true, "gridRowEnd": true, "gridRow": true, "gridColumn": true, "gridColumnEnd": true, "gridColumnGap": true, "gridRowGap": true, "gridArea": true, "gridGap": true, "textSizeAdjust": true } };
module.exports = exports["default"];
},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// helper to capitalize strings

exports.default = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

module.exports = exports["default"];
},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (property) {
  return property.match(/^(Webkit|Moz|O|ms)/) !== null;
};

module.exports = exports["default"];
},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (value) {
  if (Array.isArray(value)) value = value.join(',');

  return value.match(/-webkit-|-moz-|-ms-/) !== null;
};

module.exports = exports['default'];
},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// returns a style object with a single concated prefixed value string

exports.default = function (property, value) {
  var replacer = arguments.length <= 2 || arguments[2] === undefined ? function (prefix, value) {
    return prefix + value;
  } : arguments[2];
  return _defineProperty({}, property, ['-webkit-', '-moz-', ''].map(function (prefix) {
    return replacer(prefix, value);
  }));
};

module.exports = exports['default'];
},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sortPrefixedStyle;

var _isPrefixedProperty = require('./isPrefixedProperty');

var _isPrefixedProperty2 = _interopRequireDefault(_isPrefixedProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sortPrefixedStyle(style) {
  return Object.keys(style).sort(function (left, right) {
    if ((0, _isPrefixedProperty2.default)(left) && !(0, _isPrefixedProperty2.default)(right)) {
      return -1;
    } else if (!(0, _isPrefixedProperty2.default)(left) && (0, _isPrefixedProperty2.default)(right)) {
      return 1;
    }
    return 0;
  }).reduce(function (sortedStyle, prop) {
    sortedStyle[prop] = style[prop];
    return sortedStyle;
  }, {});
}
module.exports = exports['default'];
},{"./isPrefixedProperty":25}],29:[function(require,module,exports){
module.exports = require('./lib/static/prefixAll')

},{"./lib/static/prefixAll":22}],30:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],31:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

if (process.env.NODE_ENV !== 'production') {
  var invariant = require('fbjs/lib/invariant');
  var warning = require('fbjs/lib/warning');
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

}).call(this,require('_process'))

},{"./lib/ReactPropTypesSecret":35,"_process":30,"fbjs/lib/invariant":10,"fbjs/lib/warning":11}],32:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":35,"fbjs/lib/emptyFunction":9,"fbjs/lib/invariant":10}],33:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
var checkPropTypes = require('./checkPropTypes');

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplid to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

}).call(this,require('_process'))

},{"./checkPropTypes":31,"./lib/ReactPropTypesSecret":35,"_process":30,"fbjs/lib/emptyFunction":9,"fbjs/lib/invariant":10,"fbjs/lib/warning":11}],34:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

}).call(this,require('_process'))

},{"./factoryWithThrowingShims":32,"./factoryWithTypeCheckers":33,"_process":30}],35:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],36:[function(require,module,exports){
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

},{"../theme":50,"../utils":54,"./Icon":40,"aphrodite/no-important":6,"prop-types":34,"react":undefined}],37:[function(require,module,exports){
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

},{"../theme":50,"../utils":54,"aphrodite/no-important":6,"prop-types":34,"react":undefined}],38:[function(require,module,exports){
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

},{"../theme":50,"../utils":54,"aphrodite/no-important":6,"prop-types":34,"react":undefined}],39:[function(require,module,exports){
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

},{"../theme":50,"../utils":54,"./Icon":40,"aphrodite/no-important":6,"prop-types":34,"react":undefined}],40:[function(require,module,exports){
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

},{"../icons":48,"prop-types":34,"react":undefined}],41:[function(require,module,exports){
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

},{"../theme":50,"./Arrow":36,"./Thumbnail":44,"aphrodite/no-important":6,"prop-types":34,"react":undefined}],42:[function(require,module,exports){
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

},{"prop-types":34,"react":undefined}],43:[function(require,module,exports){
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

},{"./PassContext":42,"prop-types":34,"react":undefined,"react-addons-css-transition-group":undefined,"react-dom":undefined}],44:[function(require,module,exports){
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

},{"../theme":50,"../utils":54,"aphrodite/no-important":6,"prop-types":34,"react":undefined}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (fill) {
	return "<svg fill=\"" + fill + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" xml:space=\"preserve\">\n\t\t<path d=\"M213.7,256L213.7,256L213.7,256L380.9,81.9c4.2-4.3,4.1-11.4-0.2-15.8l-29.9-30.6c-4.3-4.4-11.3-4.5-15.5-0.2L131.1,247.9 c-2.2,2.2-3.2,5.2-3,8.1c-0.1,3,0.9,5.9,3,8.1l204.2,212.7c4.2,4.3,11.2,4.2,15.5-0.2l29.9-30.6c4.3-4.4,4.4-11.5,0.2-15.8 L213.7,256z\"/>\n\t</svg>";
};

module.exports = exports["default"];

},{}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (fill) {
	return "<svg fill=\"" + fill + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" xml:space=\"preserve\">\n\t\t<path d=\"M298.3,256L298.3,256L298.3,256L131.1,81.9c-4.2-4.3-4.1-11.4,0.2-15.8l29.9-30.6c4.3-4.4,11.3-4.5,15.5-0.2l204.2,212.7 c2.2,2.2,3.2,5.2,3,8.1c0.1,3-0.9,5.9-3,8.1L176.7,476.8c-4.2,4.3-11.2,4.2-15.5-0.2L131.3,446c-4.3-4.4-4.4-11.5-0.2-15.8 L298.3,256z\"/>\n\t</svg>";
};

module.exports = exports["default"];

},{}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (fill) {
	return "<svg fill=\"" + fill + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n\t\t<path d=\"M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4 L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1 c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1 c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z\"/>\n\t</svg>";
};

module.exports = exports["default"];

},{}],48:[function(require,module,exports){
'use strict';

module.exports = {
	arrowLeft: require('./arrowLeft'),
	arrowRight: require('./arrowRight'),
	close: require('./close'),
	rotate: require('./rotate')
};

},{"./arrowLeft":45,"./arrowRight":46,"./close":47,"./rotate":49}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function (fill) {
	return "<svg fill=\"" + fill + "\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 385 385\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\">\n\t\t<path d=\"M385,32.0833333 L385,144.375 C385,148.719618 383.412543,152.479384 380.23763,155.654297 C377.062717,158.82921 373.302951,160.416667 368.958333,160.416667 L256.666667,160.416667 C249.648438,160.416667 244.718967,157.074653 241.878255,150.390625 C239.037543,143.873698 240.207248,138.108724 245.38737,133.095703 L279.977214,98.5058594 C255.246311,75.6130642 226.08724,64.1666667 192.5,64.1666667 C175.121528,64.1666667 158.536784,67.5504557 142.745768,74.3180339 C126.954753,81.085612 113.294271,90.234375 101.764323,101.764323 C90.234375,113.294271 81.085612,126.954753 74.3180339,142.745768 C67.5504557,158.536784 64.1666667,175.121528 64.1666667,192.5 C64.1666667,209.878472 67.5504557,226.463216 74.3180339,242.254232 C81.085612,258.045247 90.234375,271.705729 101.764323,283.235677 C113.294271,294.765625 126.954753,303.914388 142.745768,310.681966 C158.536784,317.449544 175.121528,320.833333 192.5,320.833333 C212.384983,320.833333 231.183811,316.488715 248.896484,307.799479 C266.609158,299.110243 281.56467,286.828342 293.763021,270.953776 C294.932726,269.282769 296.854384,268.280165 299.527995,267.945964 C301.867405,267.945964 303.956163,268.697917 305.794271,270.201823 L340.133464,304.791667 C341.63737,306.128472 342.431098,307.841254 342.514648,309.930013 C342.598199,312.018772 341.971571,313.898655 340.634766,315.569661 C322.42079,337.626953 300.363498,354.712999 274.462891,366.827799 C248.562283,378.9426 221.241319,385 192.5,385 C166.432292,385 141.534288,379.903429 117.80599,369.710286 C94.077691,359.517144 73.6078559,345.814887 56.3964844,328.603516 C39.1851128,311.392144 25.4828559,290.922309 15.2897135,267.19401 C5.09657118,243.465712 0,218.567708 0,192.5 C0,166.432292 5.09657118,141.534288 15.2897135,117.80599 C25.4828559,94.077691 39.1851128,73.6078559 56.3964844,56.3964844 C73.6078559,39.1851128 94.077691,25.4828559 117.80599,15.2897135 C141.534288,5.09657118 166.432292,0 192.5,0 C217.063802,0 240.833876,4.63704427 263.810221,13.9111328 C286.786567,23.1852214 307.214627,36.2608507 325.094401,53.1380208 L357.679036,20.8040365 C362.524957,15.6239149 368.373481,14.4542101 375.224609,17.2949219 C381.741536,20.1356337 385,25.0651042 385,32.0833333 Z\" id=\"Shape\" fill=\"" + fill + "\"></path>\n\t</svg>";
};

module.exports = exports["default"];

},{}],50:[function(require,module,exports){
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

},{}],51:[function(require,module,exports){
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

},{}],52:[function(require,module,exports){
// Return true if window + document

'use strict';

module.exports = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

},{}],53:[function(require,module,exports){
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

},{}],54:[function(require,module,exports){
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

},{"./bindFunctions":51,"./canUseDom":52,"./deepMerge":53}],"react-images":[function(require,module,exports){
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

},{"./components/Arrow":36,"./components/Container":37,"./components/Footer":38,"./components/Header":39,"./components/PaginatedThumbnails":41,"./components/Portal":43,"./theme":50,"./utils":54,"aphrodite/no-important":6,"prop-types":34,"react":undefined,"react-scrolllock":undefined}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL2xpYi9nZW5lcmF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9hcGhyb2RpdGUvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvaW5qZWN0LmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvbm8taW1wb3J0YW50LmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9hcGhyb2RpdGUvbm8taW1wb3J0YW50LmpzIiwibm9kZV9tb2R1bGVzL2FzYXAvYnJvd3Nlci1hc2FwLmpzIiwibm9kZV9tb2R1bGVzL2FzYXAvYnJvd3Nlci1yYXcuanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvZW1wdHlGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9mYmpzL2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvZmJqcy9saWIvd2FybmluZy5qcyIsIm5vZGVfbW9kdWxlcy9oeXBoZW5hdGUtc3R5bGUtbmFtZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvbGliL3N0YXRpYy9wbHVnaW5zL2NhbGMuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL2xpYi9zdGF0aWMvcGx1Z2lucy9jdXJzb3IuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL2xpYi9zdGF0aWMvcGx1Z2lucy9mbGV4LmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9saWIvc3RhdGljL3BsdWdpbnMvZmxleGJveElFLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9saWIvc3RhdGljL3BsdWdpbnMvZmxleGJveE9sZC5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvbGliL3N0YXRpYy9wbHVnaW5zL2dyYWRpZW50LmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9saWIvc3RhdGljL3BsdWdpbnMvcG9zaXRpb24uanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL2xpYi9zdGF0aWMvcGx1Z2lucy9zaXppbmcuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL2xpYi9zdGF0aWMvcGx1Z2lucy90cmFuc2l0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9saWIvc3RhdGljL3ByZWZpeEFsbC5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvbGliL3N0YXRpYy9wcmVmaXhQcm9wcy5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvbGliL3V0aWxzL2NhcGl0YWxpemVTdHJpbmcuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL2xpYi91dGlscy9pc1ByZWZpeGVkUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL2xpYi91dGlscy9pc1ByZWZpeGVkVmFsdWUuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL2xpYi91dGlscy9qb2luUHJlZml4ZWRWYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvbGliL3V0aWxzL3NvcnRQcmVmaXhlZFN0eWxlLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMuanMiLCJub2RlX21vZHVsZXMvcHJvcC10eXBlcy9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9wLXR5cGVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb3AtdHlwZXMvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9jb21wb25lbnRzL0Fycm93LmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9jb21wb25lbnRzL0NvbnRhaW5lci5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvY29tcG9uZW50cy9Gb290ZXIuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2NvbXBvbmVudHMvSGVhZGVyLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9jb21wb25lbnRzL0ljb24uanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2NvbXBvbmVudHMvUGFnaW5hdGVkVGh1bWJuYWlscy5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvY29tcG9uZW50cy9QYXNzQ29udGV4dC5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvY29tcG9uZW50cy9Qb3J0YWwuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2NvbXBvbmVudHMvVGh1bWJuYWlsLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9pY29ucy9hcnJvd0xlZnQuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2ljb25zL2Fycm93UmlnaHQuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL2ljb25zL2Nsb3NlLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9pY29ucy9pbmRleC5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvaWNvbnMvcm90YXRlLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy90aGVtZS5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvdXRpbHMvYmluZEZ1bmN0aW9ucy5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9zcmMvdXRpbHMvY2FuVXNlRG9tLmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy91dGlscy9kZWVwTWVyZ2UuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvc3JjL3V0aWxzL2luZGV4LmpzIiwiL1VzZXJzL211Y2FoaXQvRG9jdW1lbnRzL3dvcmtzL3JlYWN0LWltYWdlcy10ZW1wL3NyYy9MaWdodGJveC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hPQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQy9OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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RSxVQUFVO0VBQ3BCO0FBQ0QsT0FBTSxFQUFFO0FBQ1AsUUFBTSxFQUFFLENBQUMsRUFDVDs7QUFDRCxhQUFZLEVBQUU7QUFDYixTQUFPLEVBQUUsTUFBTTtBQUNmLFlBQVUsRUFBRSxRQUFRO0FBQ3BCLGdCQUFjLEVBQUUsUUFBUTtBQUN4QixZQUFVLEVBQUUsTUFBTTtFQUNsQjtBQUNELE1BQUssRUFBRTtBQUNOLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLFFBQU0sRUFBRSxNQUFNO0FBQ2QsUUFBTSxFQUFFLFFBQVE7QUFDaEIsVUFBUSxFQUFFLE1BQU07OztBQUdoQixvQkFBa0IsRUFBRSxNQUFNO0FBQzFCLFlBQVUsRUFBRSxNQUFNO0VBQ2xCO0FBQ0QsV0FBVSxFQUFFO0FBQ1gsWUFBVSxFQUFFLE1BQU07QUFDbEIsT0FBSyxFQUFFLE9BQU87QUFDZCxlQUFhLEVBQUUsS0FBSztBQUNwQixRQUFNLEVBQUUsT0FBTztBQUNmLFVBQVEsRUFBRSxNQUFNO0VBQ2hCO0NBQ0QsQ0FBQyxDQUFDOztxQkFFWSxRQUFRIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9zbGljZWRUb0FycmF5ID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gc2xpY2VJdGVyYXRvcihhcnIsIGkpIHsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfZSA9IHVuZGVmaW5lZDsgdHJ5IHsgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbJ3JldHVybiddKSBfaVsncmV0dXJuJ10oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9IHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgcmV0dXJuIGFycjsgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpIHsgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTsgfSBlbHNlIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZScpOyB9IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cblxudmFyIF9pbmxpbmVTdHlsZVByZWZpeGVyU3RhdGljID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYycpO1xuXG52YXIgX2lubGluZVN0eWxlUHJlZml4ZXJTdGF0aWMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5saW5lU3R5bGVQcmVmaXhlclN0YXRpYyk7XG5cbnZhciBfdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG4vKipcbiAqIEdlbmVyYXRlIENTUyBmb3IgYSBzZWxlY3RvciBhbmQgc29tZSBzdHlsZXMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBoYW5kbGVzIHRoZSBtZWRpYSBxdWVyaWVzLCBwc2V1ZG8gc2VsZWN0b3JzLCBhbmQgZGVzY2VuZGFudFxuICogc3R5bGVzIHRoYXQgY2FuIGJlIHVzZWQgaW4gYXBocm9kaXRlIHN0eWxlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3I6IEEgYmFzZSBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzdHlsZXMgdG8gYmUgZ2VuZXJhdGVkXG4gKiAgICAgd2l0aC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVR5cGVzOiBBIGxpc3Qgb2YgcHJvcGVydGllcyBvZiB0aGUgcmV0dXJuIHR5cGUgb2ZcbiAqICAgICBTdHlsZVNoZWV0LmNyZWF0ZSwgZS5nLiBbc3R5bGVzLnJlZCwgc3R5bGVzLmJsdWVdLlxuICogQHBhcmFtIHN0cmluZ0hhbmRsZXJzOiBTZWUgYGdlbmVyYXRlQ1NTUnVsZXNldGBcbiAqIEBwYXJhbSB1c2VJbXBvcnRhbnQ6IFNlZSBgZ2VuZXJhdGVDU1NSdWxlc2V0YFxuICpcbiAqIFRvIGFjdHVhbGx5IGdlbmVyYXRlIHRoZSBDU1Mgc3BlY2lhbC1jb25zdHJ1Y3QtbGVzcyBzdHlsZXMgYXJlIHBhc3NlZCB0b1xuICogYGdlbmVyYXRlQ1NTUnVsZXNldGAuXG4gKlxuICogRm9yIGluc3RhbmNlLCBhIGNhbGwgdG9cbiAqXG4gKiAgICAgZ2VuZXJhdGVDU1NJbm5lcihcIi5mb29cIiwge1xuICogICAgICAgY29sb3I6IFwicmVkXCIsXG4gKiAgICAgICBcIkBtZWRpYSBzY3JlZW5cIjoge1xuICogICAgICAgICBoZWlnaHQ6IDIwLFxuICogICAgICAgICBcIjpob3ZlclwiOiB7XG4gKiAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCJcbiAqICAgICAgICAgfVxuICogICAgICAgfSxcbiAqICAgICAgIFwiOmFjdGl2ZVwiOiB7XG4gKiAgICAgICAgIGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxuICogICAgICAgICBcIj4+YmFyXCI6IHtcbiAqICAgICAgICAgICBfbmFtZXM6IHsgXCJmb29fYmFyXCI6IHRydWUgfSxcbiAqICAgICAgICAgICBoZWlnaHQ6IDEwLFxuICogICAgICAgICB9XG4gKiAgICAgICB9XG4gKiAgICAgfSk7XG4gKlxuICogd2lsbCBtYWtlIDUgY2FsbHMgdG8gYGdlbmVyYXRlQ1NTUnVsZXNldGA6XG4gKlxuICogICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5mb29cIiwgeyBjb2xvcjogXCJyZWRcIiB9LCAuLi4pXG4gKiAgICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmZvbzphY3RpdmVcIiwgeyBmb250V2VpZ2h0OiBcImJvbGRcIiB9LCAuLi4pXG4gKiAgICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmZvbzphY3RpdmUgLmZvb19iYXJcIiwgeyBoZWlnaHQ6IDEwIH0sIC4uLilcbiAqICAgICAvLyBUaGVzZSAyIHdpbGwgYmUgd3JhcHBlZCBpbiBAbWVkaWEgc2NyZWVuIHt9XG4gKiAgICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmZvb1wiLCB7IGhlaWdodDogMjAgfSwgLi4uKVxuICogICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5mb286aG92ZXJcIiwgeyBiYWNrZ3JvdW5kQ29sb3I6IFwiYmxhY2tcIiB9LCAuLi4pXG4gKi9cbnZhciBnZW5lcmF0ZUNTUyA9IGZ1bmN0aW9uIGdlbmVyYXRlQ1NTKHNlbGVjdG9yLCBzdHlsZVR5cGVzLCBzdHJpbmdIYW5kbGVycywgdXNlSW1wb3J0YW50KSB7XG4gICAgdmFyIG1lcmdlZCA9IHN0eWxlVHlwZXMucmVkdWNlKF91dGlsLnJlY3Vyc2l2ZU1lcmdlKTtcblxuICAgIHZhciBkZWNsYXJhdGlvbnMgPSB7fTtcbiAgICB2YXIgbWVkaWFRdWVyaWVzID0ge307XG4gICAgdmFyIHBzZXVkb1N0eWxlcyA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMobWVyZ2VkKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKGtleVswXSA9PT0gJzonKSB7XG4gICAgICAgICAgICBwc2V1ZG9TdHlsZXNba2V5XSA9IG1lcmdlZFtrZXldO1xuICAgICAgICB9IGVsc2UgaWYgKGtleVswXSA9PT0gJ0AnKSB7XG4gICAgICAgICAgICBtZWRpYVF1ZXJpZXNba2V5XSA9IG1lcmdlZFtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVjbGFyYXRpb25zW2tleV0gPSBtZXJnZWRba2V5XTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRlQ1NTUnVsZXNldChzZWxlY3RvciwgZGVjbGFyYXRpb25zLCBzdHJpbmdIYW5kbGVycywgdXNlSW1wb3J0YW50KSArIE9iamVjdC5rZXlzKHBzZXVkb1N0eWxlcykubWFwKGZ1bmN0aW9uIChwc2V1ZG9TZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZ2VuZXJhdGVDU1NSdWxlc2V0KHNlbGVjdG9yICsgcHNldWRvU2VsZWN0b3IsIHBzZXVkb1N0eWxlc1twc2V1ZG9TZWxlY3Rvcl0sIHN0cmluZ0hhbmRsZXJzLCB1c2VJbXBvcnRhbnQpO1xuICAgIH0pLmpvaW4oXCJcIikgKyBPYmplY3Qua2V5cyhtZWRpYVF1ZXJpZXMpLm1hcChmdW5jdGlvbiAobWVkaWFRdWVyeSkge1xuICAgICAgICB2YXIgcnVsZXNldCA9IGdlbmVyYXRlQ1NTKHNlbGVjdG9yLCBbbWVkaWFRdWVyaWVzW21lZGlhUXVlcnldXSwgc3RyaW5nSGFuZGxlcnMsIHVzZUltcG9ydGFudCk7XG4gICAgICAgIHJldHVybiBtZWRpYVF1ZXJ5ICsgJ3snICsgcnVsZXNldCArICd9JztcbiAgICB9KS5qb2luKFwiXCIpO1xufTtcblxuZXhwb3J0cy5nZW5lcmF0ZUNTUyA9IGdlbmVyYXRlQ1NTO1xuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIG9mIGdlbmVyYXRlQ1NTUnVsZXNldCB0byBmYWNpbGl0YXRlIGN1c3RvbSBoYW5kbGluZyBvZiBjZXJ0YWluXG4gKiBDU1MgcHJvcGVydGllcy4gVXNlZCBmb3IgZS5nLiBmb250IGZhbWlsaWVzLlxuICpcbiAqIFNlZSBnZW5lcmF0ZUNTU1J1bGVzZXQgZm9yIHVzYWdlIGFuZCBkb2N1bWVudGF0aW9uIG9mIHBhcmFtYXRlciB0eXBlcy5cbiAqL1xudmFyIHJ1blN0cmluZ0hhbmRsZXJzID0gZnVuY3Rpb24gcnVuU3RyaW5nSGFuZGxlcnMoZGVjbGFyYXRpb25zLCBzdHJpbmdIYW5kbGVycykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgIE9iamVjdC5rZXlzKGRlY2xhcmF0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIC8vIElmIGEgaGFuZGxlciBleGlzdHMgZm9yIHRoaXMgcGFydGljdWxhciBrZXksIGxldCBpdCBpbnRlcnByZXRcbiAgICAgICAgLy8gdGhhdCB2YWx1ZSBmaXJzdCBiZWZvcmUgY29udGludWluZ1xuICAgICAgICBpZiAoc3RyaW5nSGFuZGxlcnMgJiYgc3RyaW5nSGFuZGxlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBzdHJpbmdIYW5kbGVyc1trZXldKGRlY2xhcmF0aW9uc1trZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gZGVjbGFyYXRpb25zW2tleV07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlIGEgQ1NTIHJ1bGVzZXQgd2l0aCB0aGUgc2VsZWN0b3IgYW5kIGNvbnRhaW5pbmcgdGhlIGRlY2xhcmF0aW9ucy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGFzc3VtZXMgdGhhdCB0aGUgZ2l2ZW4gZGVjbGFyYXRpb25zIGRvbid0IGNvbnRhaW4gYW55IHNwZWNpYWxcbiAqIGNoaWxkcmVuIChzdWNoIGFzIG1lZGlhIHF1ZXJpZXMsIHBzZXVkby1zZWxlY3RvcnMsIG9yIGRlc2NlbmRhbnQgc3R5bGVzKS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBtZXRob2QgZG9lcyBub3QgZGVhbCB3aXRoIG5lc3RpbmcgdXNlZCBmb3IgZS5nLlxuICogcHN1ZWRvLXNlbGVjdG9ycyBvciBtZWRpYSBxdWVyaWVzLiBUaGF0IHJlc3BvbnNpYmlsaXR5IGlzIGxlZnQgdG8gIHRoZVxuICogYGdlbmVyYXRlQ1NTYCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3I6IHRoZSBzZWxlY3RvciBhc3NvY2lhdGVkIHdpdGggdGhlIHJ1bGVzZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWNsYXJhdGlvbnM6IGEgbWFwIGZyb20gY2FtZWxDYXNlZCBDU1MgcHJvcGVydHkgbmFtZSB0byBDU1NcbiAqICAgICBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEBwYXJhbSB7T2JqZWN0LjxzdHJpbmcsIGZ1bmN0aW9uPn0gc3RyaW5nSGFuZGxlcnM6IGEgbWFwIGZyb20gY2FtZWxDYXNlZCBDU1NcbiAqICAgICBwcm9wZXJ0eSBuYW1lIHRvIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBtYXAgdGhlIGdpdmVuIHZhbHVlIHRvIHRoZSB2YWx1ZVxuICogICAgIHRoYXQgaXMgb3V0cHV0LlxuICogQHBhcmFtIHtib29sfSB1c2VJbXBvcnRhbnQ6IEEgYm9vbGVhbiBzYXlpbmcgd2hldGhlciB0byBhcHBlbmQgXCIhaW1wb3J0YW50XCJcbiAqICAgICB0byBlYWNoIG9mIHRoZSBDU1MgZGVjbGFyYXRpb25zLlxuICogQHJldHVybnMge3N0cmluZ30gQSBzdHJpbmcgb2YgcmF3IENTUy5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICBnZW5lcmF0ZUNTU1J1bGVzZXQoXCIuYmxhaFwiLCB7IGNvbG9yOiBcInJlZFwiIH0pXG4gKiAgICAtPiBcIi5ibGFoe2NvbG9yOiByZWQgIWltcG9ydGFudDt9XCJcbiAqICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5ibGFoXCIsIHsgY29sb3I6IFwicmVkXCIgfSwge30sIGZhbHNlKVxuICogICAgLT4gXCIuYmxhaHtjb2xvcjogcmVkfVwiXG4gKiAgICBnZW5lcmF0ZUNTU1J1bGVzZXQoXCIuYmxhaFwiLCB7IGNvbG9yOiBcInJlZFwiIH0sIHtjb2xvcjogYyA9PiBjLnRvVXBwZXJDYXNlfSlcbiAqICAgIC0+IFwiLmJsYWh7Y29sb3I6IFJFRH1cIlxuICogICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmJsYWg6aG92ZXJcIiwgeyBjb2xvcjogXCJyZWRcIiB9KVxuICogICAgLT4gXCIuYmxhaDpob3Zlcntjb2xvcjogcmVkfVwiXG4gKi9cbnZhciBnZW5lcmF0ZUNTU1J1bGVzZXQgPSBmdW5jdGlvbiBnZW5lcmF0ZUNTU1J1bGVzZXQoc2VsZWN0b3IsIGRlY2xhcmF0aW9ucywgc3RyaW5nSGFuZGxlcnMsIHVzZUltcG9ydGFudCkge1xuICAgIHZhciBoYW5kbGVkRGVjbGFyYXRpb25zID0gcnVuU3RyaW5nSGFuZGxlcnMoZGVjbGFyYXRpb25zLCBzdHJpbmdIYW5kbGVycyk7XG5cbiAgICB2YXIgcHJlZml4ZWREZWNsYXJhdGlvbnMgPSAoMCwgX2lubGluZVN0eWxlUHJlZml4ZXJTdGF0aWMyWydkZWZhdWx0J10pKGhhbmRsZWREZWNsYXJhdGlvbnMpO1xuXG4gICAgdmFyIHByZWZpeGVkUnVsZXMgPSAoMCwgX3V0aWwuZmxhdHRlbikoKDAsIF91dGlsLm9iamVjdFRvUGFpcnMpKHByZWZpeGVkRGVjbGFyYXRpb25zKS5tYXAoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgdmFyIF9yZWYyID0gX3NsaWNlZFRvQXJyYXkoX3JlZiwgMik7XG5cbiAgICAgICAgdmFyIGtleSA9IF9yZWYyWzBdO1xuICAgICAgICB2YXIgdmFsdWUgPSBfcmVmMlsxXTtcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciBfcmV0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBpbmxpbmUtc3R5bGUtcHJlZml4LWFsbCByZXR1cm5zIGFuIGFycmF5IHdoZW4gdGhlcmUgc2hvdWxkIGJlXG4gICAgICAgICAgICAgICAgLy8gbXVsdGlwbGUgcnVsZXMsIHdlIHdpbGwgZmxhdHRlbiB0byBzaW5nbGUgcnVsZXNcblxuICAgICAgICAgICAgICAgIHZhciBwcmVmaXhlZFZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciB1bnByZWZpeGVkVmFsdWVzID0gW107XG5cbiAgICAgICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2LmluZGV4T2YoJy0nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZml4ZWRWYWx1ZXMucHVzaCh2KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVucHJlZml4ZWRWYWx1ZXMucHVzaCh2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcHJlZml4ZWRWYWx1ZXMuc29ydCgpO1xuICAgICAgICAgICAgICAgIHVucHJlZml4ZWRWYWx1ZXMuc29ydCgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdjogcHJlZml4ZWRWYWx1ZXMuY29uY2F0KHVucHJlZml4ZWRWYWx1ZXMpLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtrZXksIHZdO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIF9yZXQgPT09ICdvYmplY3QnKSByZXR1cm4gX3JldC52O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbW2tleSwgdmFsdWVdXTtcbiAgICB9KSk7XG5cbiAgICB2YXIgcnVsZXMgPSBwcmVmaXhlZFJ1bGVzLm1hcChmdW5jdGlvbiAoX3JlZjMpIHtcbiAgICAgICAgdmFyIF9yZWYzMiA9IF9zbGljZWRUb0FycmF5KF9yZWYzLCAyKTtcblxuICAgICAgICB2YXIga2V5ID0gX3JlZjMyWzBdO1xuICAgICAgICB2YXIgdmFsdWUgPSBfcmVmMzJbMV07XG5cbiAgICAgICAgdmFyIHN0cmluZ1ZhbHVlID0gKDAsIF91dGlsLnN0cmluZ2lmeVZhbHVlKShrZXksIHZhbHVlKTtcbiAgICAgICAgdmFyIHJldCA9ICgwLCBfdXRpbC5rZWJhYmlmeVN0eWxlTmFtZSkoa2V5KSArICc6JyArIHN0cmluZ1ZhbHVlICsgJzsnO1xuICAgICAgICByZXR1cm4gdXNlSW1wb3J0YW50ID09PSBmYWxzZSA/IHJldCA6ICgwLCBfdXRpbC5pbXBvcnRhbnRpZnkpKHJldCk7XG4gICAgfSkuam9pbihcIlwiKTtcblxuICAgIGlmIChydWxlcykge1xuICAgICAgICByZXR1cm4gc2VsZWN0b3IgKyAneycgKyBydWxlcyArICd9JztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG59O1xuZXhwb3J0cy5nZW5lcmF0ZUNTU1J1bGVzZXQgPSBnZW5lcmF0ZUNTU1J1bGVzZXQ7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3NsaWNlZFRvQXJyYXkgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVsncmV0dXJuJ10pIF9pWydyZXR1cm4nXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlJyk7IH0gfTsgfSkoKTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbnZhciBfaW5qZWN0ID0gcmVxdWlyZSgnLi9pbmplY3QnKTtcblxudmFyIFN0eWxlU2hlZXQgPSB7XG4gICAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUoc2hlZXREZWZpbml0aW9uKSB7XG4gICAgICAgIHJldHVybiAoMCwgX3V0aWwubWFwT2JqKShzaGVldERlZmluaXRpb24sIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgICAgICB2YXIgX3JlZjIgPSBfc2xpY2VkVG9BcnJheShfcmVmLCAyKTtcblxuICAgICAgICAgICAgdmFyIGtleSA9IF9yZWYyWzBdO1xuICAgICAgICAgICAgdmFyIHZhbCA9IF9yZWYyWzFdO1xuXG4gICAgICAgICAgICByZXR1cm4gW2tleSwge1xuICAgICAgICAgICAgICAgIC8vIFRPRE8oZW1pbHkpOiBNYWtlIGEgJ3Byb2R1Y3Rpb24nIG1vZGUgd2hpY2ggZG9lc24ndCBwcmVwZW5kXG4gICAgICAgICAgICAgICAgLy8gdGhlIGNsYXNzIG5hbWUgaGVyZSwgdG8gbWFrZSB0aGUgZ2VuZXJhdGVkIENTUyBzbWFsbGVyLlxuICAgICAgICAgICAgICAgIF9uYW1lOiBrZXkgKyAnXycgKyAoMCwgX3V0aWwuaGFzaE9iamVjdCkodmFsKSxcbiAgICAgICAgICAgICAgICBfZGVmaW5pdGlvbjogdmFsXG4gICAgICAgICAgICB9XTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlaHlkcmF0ZTogZnVuY3Rpb24gcmVoeWRyYXRlKCkge1xuICAgICAgICB2YXIgcmVuZGVyZWRDbGFzc05hbWVzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMF07XG5cbiAgICAgICAgKDAsIF9pbmplY3QuYWRkUmVuZGVyZWRDbGFzc05hbWVzKShyZW5kZXJlZENsYXNzTmFtZXMpO1xuICAgIH1cbn07XG5cbi8qKlxuICogVXRpbGl0aWVzIGZvciB1c2luZyBBcGhyb2RpdGUgc2VydmVyLXNpZGUuXG4gKi9cbnZhciBTdHlsZVNoZWV0U2VydmVyID0ge1xuICAgIHJlbmRlclN0YXRpYzogZnVuY3Rpb24gcmVuZGVyU3RhdGljKHJlbmRlckZ1bmMpIHtcbiAgICAgICAgKDAsIF9pbmplY3QucmVzZXQpKCk7XG4gICAgICAgICgwLCBfaW5qZWN0LnN0YXJ0QnVmZmVyaW5nKSgpO1xuICAgICAgICB2YXIgaHRtbCA9IHJlbmRlckZ1bmMoKTtcbiAgICAgICAgdmFyIGNzc0NvbnRlbnQgPSAoMCwgX2luamVjdC5mbHVzaFRvU3RyaW5nKSgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBodG1sOiBodG1sLFxuICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDogY3NzQ29udGVudCxcbiAgICAgICAgICAgICAgICByZW5kZXJlZENsYXNzTmFtZXM6ICgwLCBfaW5qZWN0LmdldFJlbmRlcmVkQ2xhc3NOYW1lcykoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn07XG5cbi8qKlxuICogVXRpbGl0aWVzIGZvciB1c2luZyBBcGhyb2RpdGUgaW4gdGVzdHMuXG4gKlxuICogTm90IG1lYW50IHRvIGJlIHVzZWQgaW4gcHJvZHVjdGlvbi5cbiAqL1xudmFyIFN0eWxlU2hlZXRUZXN0VXRpbHMgPSB7XG4gICAgLyoqXG4gICAgICogUHJldmVudCBzdHlsZXMgZnJvbSBiZWluZyBpbmplY3RlZCBpbnRvIHRoZSBET00uXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHVzZWZ1bCBpbiBzaXR1YXRpb25zIHdoZXJlIHlvdSdkIGxpa2UgdG8gdGVzdCByZW5kZXJpbmcgVUlcbiAgICAgKiBjb21wb25lbnRzIHdoaWNoIHVzZSBBcGhyb2RpdGUgd2l0aG91dCBhbnkgb2YgdGhlIHNpZGUtZWZmZWN0cyBvZlxuICAgICAqIEFwaHJvZGl0ZSBoYXBwZW5pbmcuIFBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHRlc3RpbmcgdGhlIG91dHB1dCBvZlxuICAgICAqIGNvbXBvbmVudHMgd2hlbiB5b3UgaGF2ZSBubyBET00sIGUuZy4gdGVzdGluZyBpbiBOb2RlIHdpdGhvdXQgYSBmYWtlIERPTS5cbiAgICAgKlxuICAgICAqIFNob3VsZCBiZSBwYWlyZWQgd2l0aCBhIHN1YnNlcXVlbnQgY2FsbCB0b1xuICAgICAqIGNsZWFyQnVmZmVyQW5kUmVzdW1lU3R5bGVJbmplY3Rpb24uXG4gICAgICovXG4gICAgc3VwcHJlc3NTdHlsZUluamVjdGlvbjogZnVuY3Rpb24gc3VwcHJlc3NTdHlsZUluamVjdGlvbigpIHtcbiAgICAgICAgKDAsIF9pbmplY3QucmVzZXQpKCk7XG4gICAgICAgICgwLCBfaW5qZWN0LnN0YXJ0QnVmZmVyaW5nKSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBPcHBvc2l0ZSBtZXRob2Qgb2YgcHJldmVudFN0eWxlSW5qZWN0LlxuICAgICAqL1xuICAgIGNsZWFyQnVmZmVyQW5kUmVzdW1lU3R5bGVJbmplY3Rpb246IGZ1bmN0aW9uIGNsZWFyQnVmZmVyQW5kUmVzdW1lU3R5bGVJbmplY3Rpb24oKSB7XG4gICAgICAgICgwLCBfaW5qZWN0LnJlc2V0KSgpO1xuICAgIH1cbn07XG5cbnZhciBjc3MgPSBmdW5jdGlvbiBjc3MoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHN0eWxlRGVmaW5pdGlvbnMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgc3R5bGVEZWZpbml0aW9uc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgdXNlSW1wb3J0YW50ID0gdHJ1ZTsgLy8gQXBwZW5kICFpbXBvcnRhbnQgdG8gYWxsIHN0eWxlIGRlZmluaXRpb25zXG4gICAgcmV0dXJuICgwLCBfaW5qZWN0LmluamVjdEFuZEdldENsYXNzTmFtZSkodXNlSW1wb3J0YW50LCBzdHlsZURlZmluaXRpb25zKTtcbn07XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IHtcbiAgICBTdHlsZVNoZWV0OiBTdHlsZVNoZWV0LFxuICAgIFN0eWxlU2hlZXRTZXJ2ZXI6IFN0eWxlU2hlZXRTZXJ2ZXIsXG4gICAgU3R5bGVTaGVldFRlc3RVdGlsczogU3R5bGVTaGVldFRlc3RVdGlscyxcbiAgICBjc3M6IGNzc1xufTtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2FzYXAgPSByZXF1aXJlKCdhc2FwJyk7XG5cbnZhciBfYXNhcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hc2FwKTtcblxudmFyIF9nZW5lcmF0ZSA9IHJlcXVpcmUoJy4vZ2VuZXJhdGUnKTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8vIFRoZSBjdXJyZW50IDxzdHlsZT4gdGFnIHdlIGFyZSBpbnNlcnRpbmcgaW50bywgb3IgbnVsbCBpZiB3ZSBoYXZlbid0XG4vLyBpbnNlcnRlZCBhbnl0aGluZyB5ZXQuIFdlIGNvdWxkIGZpbmQgdGhpcyBlYWNoIHRpbWUgdXNpbmdcbi8vIGBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic3R5bGVbZGF0YS1hcGhyb2RpdGVcIl0pYCwgYnV0IGhvbGRpbmcgb250byBpdCBpc1xuLy8gZmFzdGVyLlxudmFyIHN0eWxlVGFnID0gbnVsbDtcblxuLy8gSW5qZWN0IGEgc3RyaW5nIG9mIHN0eWxlcyBpbnRvIGEgPHN0eWxlPiB0YWcgaW4gdGhlIGhlYWQgb2YgdGhlIGRvY3VtZW50LiBUaGlzXG4vLyB3aWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlIGEgc3R5bGUgdGFnIGFuZCB0aGVuIGNvbnRpbnVlIHRvIHVzZSBpdCBmb3Jcbi8vIG11bHRpcGxlIGluamVjdGlvbnMuIEl0IHdpbGwgYWxzbyB1c2UgYSBzdHlsZSB0YWcgd2l0aCB0aGUgYGRhdGEtYXBocm9kaXRlYFxuLy8gdGFnIG9uIGl0IGlmIHRoYXQgZXhpc3RzIGluIHRoZSBET00uIFRoaXMgY291bGQgYmUgdXNlZCBmb3IgZS5nLiByZXVzaW5nIHRoZVxuLy8gc2FtZSBzdHlsZSB0YWcgdGhhdCBzZXJ2ZXItc2lkZSByZW5kZXJpbmcgaW5zZXJ0cy5cbnZhciBpbmplY3RTdHlsZVRhZyA9IGZ1bmN0aW9uIGluamVjdFN0eWxlVGFnKGNzc0NvbnRlbnRzKSB7XG4gICAgaWYgKHN0eWxlVGFnID09IG51bGwpIHtcbiAgICAgICAgLy8gVHJ5IHRvIGZpbmQgYSBzdHlsZSB0YWcgd2l0aCB0aGUgYGRhdGEtYXBocm9kaXRlYCBhdHRyaWJ1dGUgZmlyc3QuXG4gICAgICAgIHN0eWxlVGFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInN0eWxlW2RhdGEtYXBocm9kaXRlXVwiKTtcblxuICAgICAgICAvLyBJZiB0aGF0IGRvZXNuJ3Qgd29yaywgZ2VuZXJhdGUgYSBuZXcgc3R5bGUgdGFnLlxuICAgICAgICBpZiAoc3R5bGVUYWcgPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gVGFrZW4gZnJvbVxuICAgICAgICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MjQ2OTYvaG93LXRvLWNyZWF0ZS1hLXN0eWxlLXRhZy13aXRoLWphdmFzY3JpcHRcbiAgICAgICAgICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgICAgICAgICAgc3R5bGVUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgICAgICAgICBzdHlsZVRhZy50eXBlID0gJ3RleHQvY3NzJztcbiAgICAgICAgICAgIHN0eWxlVGFnLnNldEF0dHJpYnV0ZShcImRhdGEtYXBocm9kaXRlXCIsIFwiXCIpO1xuICAgICAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZVRhZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3R5bGVUYWcuc3R5bGVTaGVldCkge1xuICAgICAgICBzdHlsZVRhZy5zdHlsZVNoZWV0LmNzc1RleHQgKz0gY3NzQ29udGVudHM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3R5bGVUYWcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzQ29udGVudHMpKTtcbiAgICB9XG59O1xuXG4vLyBDdXN0b20gaGFuZGxlcnMgZm9yIHN0cmluZ2lmeWluZyBDU1MgdmFsdWVzIHRoYXQgaGF2ZSBzaWRlIGVmZmVjdHNcbi8vIChzdWNoIGFzIGZvbnRGYW1pbHksIHdoaWNoIGNhbiBjYXVzZSBAZm9udC1mYWNlIHJ1bGVzIHRvIGJlIGluamVjdGVkKVxudmFyIHN0cmluZ0hhbmRsZXJzID0ge1xuICAgIC8vIFdpdGggZm9udEZhbWlseSB3ZSBsb29rIGZvciBvYmplY3RzIHRoYXQgYXJlIHBhc3NlZCBpbiBhbmQgaW50ZXJwcmV0XG4gICAgLy8gdGhlbSBhcyBAZm9udC1mYWNlIHJ1bGVzIHRoYXQgd2UgbmVlZCB0byBpbmplY3QuIFRoZSB2YWx1ZSBvZiBmb250RmFtaWx5XG4gICAgLy8gY2FuIGVpdGhlciBiZSBhIHN0cmluZyAoYXMgbm9ybWFsKSwgYW4gb2JqZWN0IChhIHNpbmdsZSBmb250IGZhY2UpLCBvclxuICAgIC8vIGFuIGFycmF5IG9mIG9iamVjdHMgYW5kIHN0cmluZ3MuXG4gICAgZm9udEZhbWlseTogZnVuY3Rpb24gZm9udEZhbWlseSh2YWwpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbC5tYXAoZm9udEZhbWlseSkuam9pbihcIixcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgaW5qZWN0U3R5bGVPbmNlKHZhbC5mb250RmFtaWx5LCBcIkBmb250LWZhY2VcIiwgW3ZhbF0sIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiAnXCInICsgdmFsLmZvbnRGYW1pbHkgKyAnXCInO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBXaXRoIGFuaW1hdGlvbk5hbWUgd2UgbG9vayBmb3IgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMga2V5ZnJhbWVzIGFuZFxuICAgIC8vIGluamVjdCB0aGVtIGFzIGFuIGBAa2V5ZnJhbWVzYCBibG9jaywgcmV0dXJuaW5nIGEgdW5pcXVlbHkgZ2VuZXJhdGVkXG4gICAgLy8gbmFtZS4gVGhlIGtleWZyYW1lcyBvYmplY3Qgc2hvdWxkIGxvb2sgbGlrZVxuICAgIC8vICBhbmltYXRpb25OYW1lOiB7XG4gICAgLy8gICAgZnJvbToge1xuICAgIC8vICAgICAgbGVmdDogMCxcbiAgICAvLyAgICAgIHRvcDogMCxcbiAgICAvLyAgICB9LFxuICAgIC8vICAgICc1MCUnOiB7XG4gICAgLy8gICAgICBsZWZ0OiAxNSxcbiAgICAvLyAgICAgIHRvcDogNSxcbiAgICAvLyAgICB9LFxuICAgIC8vICAgIHRvOiB7XG4gICAgLy8gICAgICBsZWZ0OiAyMCxcbiAgICAvLyAgICAgIHRvcDogMjAsXG4gICAgLy8gICAgfVxuICAgIC8vICB9XG4gICAgLy8gVE9ETyhlbWlseSk6IGBzdHJpbmdIYW5kbGVyc2AgZG9lc24ndCBsZXQgdXMgcmVuYW1lIHRoZSBrZXksIHNvIEkgaGF2ZVxuICAgIC8vIHRvIHVzZSBgYW5pbWF0aW9uTmFtZWAgaGVyZS4gSW1wcm92ZSB0aGF0IHNvIHdlIGNhbiBjYWxsIHRoaXNcbiAgICAvLyBgYW5pbWF0aW9uYCBpbnN0ZWFkIG9mIGBhbmltYXRpb25OYW1lYC5cbiAgICBhbmltYXRpb25OYW1lOiBmdW5jdGlvbiBhbmltYXRpb25OYW1lKHZhbCkge1xuICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdlbmVyYXRlIGEgdW5pcXVlIG5hbWUgYmFzZWQgb24gdGhlIGhhc2ggb2YgdGhlIG9iamVjdC4gV2UgY2FuJ3RcbiAgICAgICAgLy8ganVzdCB1c2UgdGhlIGhhc2ggYmVjYXVzZSB0aGUgbmFtZSBjYW4ndCBzdGFydCB3aXRoIGEgbnVtYmVyLlxuICAgICAgICAvLyBUT0RPKGVtaWx5KTogdGhpcyBwcm9iYWJseSBtYWtlcyBkZWJ1Z2dpbmcgaGFyZCwgYWxsb3cgYSBjdXN0b21cbiAgICAgICAgLy8gbmFtZT9cbiAgICAgICAgdmFyIG5hbWUgPSAna2V5ZnJhbWVfJyArICgwLCBfdXRpbC5oYXNoT2JqZWN0KSh2YWwpO1xuXG4gICAgICAgIC8vIFNpbmNlIGtleWZyYW1lcyBuZWVkIDMgbGF5ZXJzIG9mIG5lc3RpbmcsIHdlIHVzZSBgZ2VuZXJhdGVDU1NgIHRvXG4gICAgICAgIC8vIGJ1aWxkIHRoZSBpbm5lciBsYXllcnMgYW5kIHdyYXAgaXQgaW4gYEBrZXlmcmFtZXNgIG91cnNlbHZlcy5cbiAgICAgICAgdmFyIGZpbmFsVmFsID0gJ0BrZXlmcmFtZXMgJyArIG5hbWUgKyAneyc7XG4gICAgICAgIE9iamVjdC5rZXlzKHZhbCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBmaW5hbFZhbCArPSAoMCwgX2dlbmVyYXRlLmdlbmVyYXRlQ1NTKShrZXksIFt2YWxba2V5XV0sIHN0cmluZ0hhbmRsZXJzLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBmaW5hbFZhbCArPSAnfSc7XG5cbiAgICAgICAgaW5qZWN0R2VuZXJhdGVkQ1NTT25jZShuYW1lLCBmaW5hbFZhbCk7XG5cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxufTtcblxuLy8gVGhpcyBpcyBhIG1hcCBmcm9tIEFwaHJvZGl0ZSdzIGdlbmVyYXRlZCBjbGFzcyBuYW1lcyB0byBgdHJ1ZWAgKGFjdGluZyBhcyBhXG4vLyBzZXQgb2YgY2xhc3MgbmFtZXMpXG52YXIgYWxyZWFkeUluamVjdGVkID0ge307XG5cbi8vIFRoaXMgaXMgdGhlIGJ1ZmZlciBvZiBzdHlsZXMgd2hpY2ggaGF2ZSBub3QgeWV0IGJlZW4gZmx1c2hlZC5cbnZhciBpbmplY3Rpb25CdWZmZXIgPSBcIlwiO1xuXG4vLyBBIGZsYWcgdG8gdGVsbCBpZiB3ZSBhcmUgYWxyZWFkeSBidWZmZXJpbmcgc3R5bGVzLiBUaGlzIGNvdWxkIGhhcHBlbiBlaXRoZXJcbi8vIGJlY2F1c2Ugd2Ugc2NoZWR1bGVkIGEgZmx1c2ggY2FsbCBhbHJlYWR5LCBzbyBuZXdseSBhZGRlZCBzdHlsZXMgd2lsbFxuLy8gYWxyZWFkeSBiZSBmbHVzaGVkLCBvciBiZWNhdXNlIHdlIGFyZSBzdGF0aWNhbGx5IGJ1ZmZlcmluZyBvbiB0aGUgc2VydmVyLlxudmFyIGlzQnVmZmVyaW5nID0gZmFsc2U7XG5cbnZhciBpbmplY3RHZW5lcmF0ZWRDU1NPbmNlID0gZnVuY3Rpb24gaW5qZWN0R2VuZXJhdGVkQ1NTT25jZShrZXksIGdlbmVyYXRlZENTUykge1xuICAgIGlmICghYWxyZWFkeUluamVjdGVkW2tleV0pIHtcbiAgICAgICAgaWYgKCFpc0J1ZmZlcmluZykge1xuICAgICAgICAgICAgLy8gV2Ugc2hvdWxkIG5ldmVyIGJlIGF1dG9tYXRpY2FsbHkgYnVmZmVyaW5nIG9uIHRoZSBzZXJ2ZXIgKG9yIGFueVxuICAgICAgICAgICAgLy8gcGxhY2Ugd2l0aG91dCBhIGRvY3VtZW50KSwgc28gZ3VhcmQgYWdhaW5zdCB0aGF0LlxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBhdXRvbWF0aWNhbGx5IGJ1ZmZlciB3aXRob3V0IGEgZG9jdW1lbnRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHdlJ3JlIG5vdCBhbHJlYWR5IGJ1ZmZlcmluZywgc2NoZWR1bGUgYSBjYWxsIHRvIGZsdXNoIHRoZVxuICAgICAgICAgICAgLy8gY3VycmVudCBzdHlsZXMuXG4gICAgICAgICAgICBpc0J1ZmZlcmluZyA9IHRydWU7XG4gICAgICAgICAgICAoMCwgX2FzYXAyWydkZWZhdWx0J10pKGZsdXNoVG9TdHlsZVRhZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpbmplY3Rpb25CdWZmZXIgKz0gZ2VuZXJhdGVkQ1NTO1xuICAgICAgICBhbHJlYWR5SW5qZWN0ZWRba2V5XSA9IHRydWU7XG4gICAgfVxufTtcblxudmFyIGluamVjdFN0eWxlT25jZSA9IGZ1bmN0aW9uIGluamVjdFN0eWxlT25jZShrZXksIHNlbGVjdG9yLCBkZWZpbml0aW9ucywgdXNlSW1wb3J0YW50KSB7XG4gICAgaWYgKCFhbHJlYWR5SW5qZWN0ZWRba2V5XSkge1xuICAgICAgICB2YXIgZ2VuZXJhdGVkID0gKDAsIF9nZW5lcmF0ZS5nZW5lcmF0ZUNTUykoc2VsZWN0b3IsIGRlZmluaXRpb25zLCBzdHJpbmdIYW5kbGVycywgdXNlSW1wb3J0YW50KTtcblxuICAgICAgICBpbmplY3RHZW5lcmF0ZWRDU1NPbmNlKGtleSwgZ2VuZXJhdGVkKTtcbiAgICB9XG59O1xuXG5leHBvcnRzLmluamVjdFN0eWxlT25jZSA9IGluamVjdFN0eWxlT25jZTtcbnZhciByZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIGluamVjdGlvbkJ1ZmZlciA9IFwiXCI7XG4gICAgYWxyZWFkeUluamVjdGVkID0ge307XG4gICAgaXNCdWZmZXJpbmcgPSBmYWxzZTtcbiAgICBzdHlsZVRhZyA9IG51bGw7XG59O1xuXG5leHBvcnRzLnJlc2V0ID0gcmVzZXQ7XG52YXIgc3RhcnRCdWZmZXJpbmcgPSBmdW5jdGlvbiBzdGFydEJ1ZmZlcmluZygpIHtcbiAgICBpZiAoaXNCdWZmZXJpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGJ1ZmZlciB3aGlsZSBhbHJlYWR5IGJ1ZmZlcmluZ1wiKTtcbiAgICB9XG4gICAgaXNCdWZmZXJpbmcgPSB0cnVlO1xufTtcblxuZXhwb3J0cy5zdGFydEJ1ZmZlcmluZyA9IHN0YXJ0QnVmZmVyaW5nO1xudmFyIGZsdXNoVG9TdHJpbmcgPSBmdW5jdGlvbiBmbHVzaFRvU3RyaW5nKCkge1xuICAgIGlzQnVmZmVyaW5nID0gZmFsc2U7XG4gICAgdmFyIHJldCA9IGluamVjdGlvbkJ1ZmZlcjtcbiAgICBpbmplY3Rpb25CdWZmZXIgPSBcIlwiO1xuICAgIHJldHVybiByZXQ7XG59O1xuXG5leHBvcnRzLmZsdXNoVG9TdHJpbmcgPSBmbHVzaFRvU3RyaW5nO1xudmFyIGZsdXNoVG9TdHlsZVRhZyA9IGZ1bmN0aW9uIGZsdXNoVG9TdHlsZVRhZygpIHtcbiAgICB2YXIgY3NzQ29udGVudCA9IGZsdXNoVG9TdHJpbmcoKTtcbiAgICBpZiAoY3NzQ29udGVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluamVjdFN0eWxlVGFnKGNzc0NvbnRlbnQpO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuZmx1c2hUb1N0eWxlVGFnID0gZmx1c2hUb1N0eWxlVGFnO1xudmFyIGdldFJlbmRlcmVkQ2xhc3NOYW1lcyA9IGZ1bmN0aW9uIGdldFJlbmRlcmVkQ2xhc3NOYW1lcygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoYWxyZWFkeUluamVjdGVkKTtcbn07XG5cbmV4cG9ydHMuZ2V0UmVuZGVyZWRDbGFzc05hbWVzID0gZ2V0UmVuZGVyZWRDbGFzc05hbWVzO1xudmFyIGFkZFJlbmRlcmVkQ2xhc3NOYW1lcyA9IGZ1bmN0aW9uIGFkZFJlbmRlcmVkQ2xhc3NOYW1lcyhjbGFzc05hbWVzKSB7XG4gICAgY2xhc3NOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgYWxyZWFkeUluamVjdGVkW2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgIH0pO1xufTtcblxuZXhwb3J0cy5hZGRSZW5kZXJlZENsYXNzTmFtZXMgPSBhZGRSZW5kZXJlZENsYXNzTmFtZXM7XG4vKipcbiAqIEluamVjdCBzdHlsZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBwYXNzZWQgc3R5bGUgZGVmaW5pdGlvbiBvYmplY3RzLCBhbmQgcmV0dXJuXG4gKiBhbiBhc3NvY2lhdGVkIENTUyBjbGFzcyBuYW1lLlxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdXNlSW1wb3J0YW50IElmIHRydWUsIHdpbGwgYXBwZW5kICFpbXBvcnRhbnQgdG8gZ2VuZXJhdGVkXG4gKiAgICAgQ1NTIG91dHB1dC4gZS5nLiB7Y29sb3I6IHJlZH0gLT4gXCJjb2xvcjogcmVkICFpbXBvcnRhbnRcIi5cbiAqIEBwYXJhbSB7T2JqZWN0W119IHN0eWxlRGVmaW5pdGlvbnMgc3R5bGUgZGVmaW5pdGlvbiBvYmplY3RzIGFzIHJldHVybmVkIGFzXG4gKiAgICAgcHJvcGVydGllcyBvZiB0aGUgcmV0dXJuIHZhbHVlIG9mIFN0eWxlU2hlZXQuY3JlYXRlKCkuXG4gKi9cbnZhciBpbmplY3RBbmRHZXRDbGFzc05hbWUgPSBmdW5jdGlvbiBpbmplY3RBbmRHZXRDbGFzc05hbWUodXNlSW1wb3J0YW50LCBzdHlsZURlZmluaXRpb25zKSB7XG4gICAgLy8gRmlsdGVyIG91dCBmYWxzeSB2YWx1ZXMgZnJvbSB0aGUgaW5wdXQsIHRvIGFsbG93IGZvclxuICAgIC8vIGBjc3MoYSwgdGVzdCAmJiBjKWBcbiAgICB2YXIgdmFsaWREZWZpbml0aW9ucyA9IHN0eWxlRGVmaW5pdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChkZWYpIHtcbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9KTtcblxuICAgIC8vIEJyZWFrIGlmIHRoZXJlIGFyZW4ndCBhbnkgdmFsaWQgc3R5bGVzLlxuICAgIGlmICh2YWxpZERlZmluaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG5cbiAgICB2YXIgY2xhc3NOYW1lID0gdmFsaWREZWZpbml0aW9ucy5tYXAoZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuIHMuX25hbWU7XG4gICAgfSkuam9pbihcIi1vX08tXCIpO1xuICAgIGluamVjdFN0eWxlT25jZShjbGFzc05hbWUsICcuJyArIGNsYXNzTmFtZSwgdmFsaWREZWZpbml0aW9ucy5tYXAoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgcmV0dXJuIGQuX2RlZmluaXRpb247XG4gICAgfSksIHVzZUltcG9ydGFudCk7XG5cbiAgICByZXR1cm4gY2xhc3NOYW1lO1xufTtcbmV4cG9ydHMuaW5qZWN0QW5kR2V0Q2xhc3NOYW1lID0gaW5qZWN0QW5kR2V0Q2xhc3NOYW1lOyIsIi8vIE1vZHVsZSB3aXRoIHRoZSBzYW1lIGludGVyZmFjZSBhcyB0aGUgY29yZSBhcGhyb2RpdGUgbW9kdWxlLFxuLy8gZXhjZXB0IHRoYXQgc3R5bGVzIGluamVjdGVkIGRvIG5vdCBhdXRvbWF0aWNhbGx5IGhhdmUgIWltcG9ydGFudFxuLy8gYXBwZW5kZWQgdG8gdGhlbS5cbi8vXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfaW5qZWN0ID0gcmVxdWlyZSgnLi9pbmplY3QnKTtcblxudmFyIF9pbmRleEpzID0gcmVxdWlyZSgnLi9pbmRleC5qcycpO1xuXG52YXIgY3NzID0gZnVuY3Rpb24gY3NzKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBzdHlsZURlZmluaXRpb25zID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIHN0eWxlRGVmaW5pdGlvbnNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgdmFyIHVzZUltcG9ydGFudCA9IGZhbHNlOyAvLyBEb24ndCBhcHBlbmQgIWltcG9ydGFudCB0byBzdHlsZSBkZWZpbml0aW9uc1xuICAgIHJldHVybiAoMCwgX2luamVjdC5pbmplY3RBbmRHZXRDbGFzc05hbWUpKHVzZUltcG9ydGFudCwgc3R5bGVEZWZpbml0aW9ucyk7XG59O1xuXG5leHBvcnRzLlN0eWxlU2hlZXQgPSBfaW5kZXhKcy5TdHlsZVNoZWV0O1xuZXhwb3J0cy5TdHlsZVNoZWV0U2VydmVyID0gX2luZGV4SnMuU3R5bGVTaGVldFNlcnZlcjtcbmV4cG9ydHMuU3R5bGVTaGVldFRlc3RVdGlscyA9IF9pbmRleEpzLlN0eWxlU2hlZXRUZXN0VXRpbHM7XG5leHBvcnRzLmNzcyA9IGNzczsiLCIvLyB7SzE6IFYxLCBLMjogVjIsIC4uLn0gLT4gW1tLMSwgVjFdLCBbSzIsIFYyXV1cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9zbGljZWRUb0FycmF5ID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gc2xpY2VJdGVyYXRvcihhcnIsIGkpIHsgdmFyIF9hcnIgPSBbXTsgdmFyIF9uID0gdHJ1ZTsgdmFyIF9kID0gZmFsc2U7IHZhciBfZSA9IHVuZGVmaW5lZDsgdHJ5IHsgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkgeyBfYXJyLnB1c2goX3MudmFsdWUpOyBpZiAoaSAmJiBfYXJyLmxlbmd0aCA9PT0gaSkgYnJlYWs7IH0gfSBjYXRjaCAoZXJyKSB7IF9kID0gdHJ1ZTsgX2UgPSBlcnI7IH0gZmluYWxseSB7IHRyeSB7IGlmICghX24gJiYgX2lbJ3JldHVybiddKSBfaVsncmV0dXJuJ10oKTsgfSBmaW5hbGx5IHsgaWYgKF9kKSB0aHJvdyBfZTsgfSB9IHJldHVybiBfYXJyOyB9IHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgcmV0dXJuIGFycjsgfSBlbHNlIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGFycikpIHsgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTsgfSBlbHNlIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZScpOyB9IH07IH0pKCk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBvYmplY3RUb1BhaXJzID0gZnVuY3Rpb24gb2JqZWN0VG9QYWlycyhvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4gW2tleSwgb2JqW2tleV1dO1xuICAgIH0pO1xufTtcblxuZXhwb3J0cy5vYmplY3RUb1BhaXJzID0gb2JqZWN0VG9QYWlycztcbi8vIFtbSzEsIFYxXSwgW0syLCBWMl1dIC0+IHtLMTogVjEsIEsyOiBWMiwgLi4ufVxudmFyIHBhaXJzVG9PYmplY3QgPSBmdW5jdGlvbiBwYWlyc1RvT2JqZWN0KHBhaXJzKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHBhaXJzLmZvckVhY2goZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgdmFyIF9yZWYyID0gX3NsaWNlZFRvQXJyYXkoX3JlZiwgMik7XG5cbiAgICAgICAgdmFyIGtleSA9IF9yZWYyWzBdO1xuICAgICAgICB2YXIgdmFsID0gX3JlZjJbMV07XG5cbiAgICAgICAgcmVzdWx0W2tleV0gPSB2YWw7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbnZhciBtYXBPYmogPSBmdW5jdGlvbiBtYXBPYmoob2JqLCBmbikge1xuICAgIHJldHVybiBwYWlyc1RvT2JqZWN0KG9iamVjdFRvUGFpcnMob2JqKS5tYXAoZm4pKTtcbn07XG5cbmV4cG9ydHMubWFwT2JqID0gbWFwT2JqO1xuLy8gRmxhdHRlbnMgYW4gYXJyYXkgb25lIGxldmVsXG4vLyBbW0FdLCBbQiwgQywgW0RdXV0gLT4gW0EsIEIsIEMsIFtEXV1cbnZhciBmbGF0dGVuID0gZnVuY3Rpb24gZmxhdHRlbihsaXN0KSB7XG4gICAgcmV0dXJuIGxpc3QucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCB4KSB7XG4gICAgICAgIHJldHVybiBtZW1vLmNvbmNhdCh4KTtcbiAgICB9LCBbXSk7XG59O1xuXG5leHBvcnRzLmZsYXR0ZW4gPSBmbGF0dGVuO1xudmFyIFVQUEVSQ0FTRV9SRSA9IC8oW0EtWl0pL2c7XG52YXIgTVNfUkUgPSAvXm1zLS87XG5cbnZhciBrZWJhYmlmeSA9IGZ1bmN0aW9uIGtlYmFiaWZ5KHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShVUFBFUkNBU0VfUkUsICctJDEnKS50b0xvd2VyQ2FzZSgpO1xufTtcbnZhciBrZWJhYmlmeVN0eWxlTmFtZSA9IGZ1bmN0aW9uIGtlYmFiaWZ5U3R5bGVOYW1lKHN0cmluZykge1xuICAgIHJldHVybiBrZWJhYmlmeShzdHJpbmcpLnJlcGxhY2UoTVNfUkUsICctbXMtJyk7XG59O1xuXG5leHBvcnRzLmtlYmFiaWZ5U3R5bGVOYW1lID0ga2ViYWJpZnlTdHlsZU5hbWU7XG52YXIgcmVjdXJzaXZlTWVyZ2UgPSBmdW5jdGlvbiByZWN1cnNpdmVNZXJnZShhLCBiKSB7XG4gICAgLy8gVE9ETyhqbGZ3b25nKTogSGFuZGxlIG1hbGZvcm1lZCBpbnB1dCB3aGVyZSBhIGFuZCBiIGFyZSBub3QgdGhlIHNhbWVcbiAgICAvLyB0eXBlLlxuXG4gICAgaWYgKHR5cGVvZiBhICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gYjtcbiAgICB9XG5cbiAgICB2YXIgcmV0ID0gX2V4dGVuZHMoe30sIGEpO1xuXG4gICAgT2JqZWN0LmtleXMoYikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChyZXQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgcmV0W2tleV0gPSByZWN1cnNpdmVNZXJnZShhW2tleV0sIGJba2V5XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXRba2V5XSA9IGJba2V5XTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbmV4cG9ydHMucmVjdXJzaXZlTWVyZ2UgPSByZWN1cnNpdmVNZXJnZTtcbi8qKlxuICogQ1NTIHByb3BlcnRpZXMgd2hpY2ggYWNjZXB0IG51bWJlcnMgYnV0IGFyZSBub3QgaW4gdW5pdHMgb2YgXCJweFwiLlxuICogVGFrZW4gZnJvbSBSZWFjdCdzIENTU1Byb3BlcnR5LmpzXG4gKi9cbnZhciBpc1VuaXRsZXNzTnVtYmVyID0ge1xuICAgIGFuaW1hdGlvbkl0ZXJhdGlvbkNvdW50OiB0cnVlLFxuICAgIGJvcmRlckltYWdlT3V0c2V0OiB0cnVlLFxuICAgIGJvcmRlckltYWdlU2xpY2U6IHRydWUsXG4gICAgYm9yZGVySW1hZ2VXaWR0aDogdHJ1ZSxcbiAgICBib3hGbGV4OiB0cnVlLFxuICAgIGJveEZsZXhHcm91cDogdHJ1ZSxcbiAgICBib3hPcmRpbmFsR3JvdXA6IHRydWUsXG4gICAgY29sdW1uQ291bnQ6IHRydWUsXG4gICAgZmxleDogdHJ1ZSxcbiAgICBmbGV4R3JvdzogdHJ1ZSxcbiAgICBmbGV4UG9zaXRpdmU6IHRydWUsXG4gICAgZmxleFNocmluazogdHJ1ZSxcbiAgICBmbGV4TmVnYXRpdmU6IHRydWUsXG4gICAgZmxleE9yZGVyOiB0cnVlLFxuICAgIGdyaWRSb3c6IHRydWUsXG4gICAgZ3JpZENvbHVtbjogdHJ1ZSxcbiAgICBmb250V2VpZ2h0OiB0cnVlLFxuICAgIGxpbmVDbGFtcDogdHJ1ZSxcbiAgICBsaW5lSGVpZ2h0OiB0cnVlLFxuICAgIG9wYWNpdHk6IHRydWUsXG4gICAgb3JkZXI6IHRydWUsXG4gICAgb3JwaGFuczogdHJ1ZSxcbiAgICB0YWJTaXplOiB0cnVlLFxuICAgIHdpZG93czogdHJ1ZSxcbiAgICB6SW5kZXg6IHRydWUsXG4gICAgem9vbTogdHJ1ZSxcblxuICAgIC8vIFNWRy1yZWxhdGVkIHByb3BlcnRpZXNcbiAgICBmaWxsT3BhY2l0eTogdHJ1ZSxcbiAgICBmbG9vZE9wYWNpdHk6IHRydWUsXG4gICAgc3RvcE9wYWNpdHk6IHRydWUsXG4gICAgc3Ryb2tlRGFzaGFycmF5OiB0cnVlLFxuICAgIHN0cm9rZURhc2hvZmZzZXQ6IHRydWUsXG4gICAgc3Ryb2tlTWl0ZXJsaW1pdDogdHJ1ZSxcbiAgICBzdHJva2VPcGFjaXR5OiB0cnVlLFxuICAgIHN0cm9rZVdpZHRoOiB0cnVlXG59O1xuXG4vKipcbiAqIFRha2VuIGZyb20gUmVhY3QncyBDU1NQcm9wZXJ0eS5qc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcmVmaXggdmVuZG9yLXNwZWNpZmljIHByZWZpeCwgZWc6IFdlYmtpdFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBzdHlsZSBuYW1lLCBlZzogdHJhbnNpdGlvbkR1cmF0aW9uXG4gKiBAcmV0dXJuIHtzdHJpbmd9IHN0eWxlIG5hbWUgcHJlZml4ZWQgd2l0aCBgcHJlZml4YCwgcHJvcGVybHkgY2FtZWxDYXNlZCwgZWc6XG4gKiBXZWJraXRUcmFuc2l0aW9uRHVyYXRpb25cbiAqL1xuZnVuY3Rpb24gcHJlZml4S2V5KHByZWZpeCwga2V5KSB7XG4gICAgcmV0dXJuIHByZWZpeCArIGtleS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGtleS5zdWJzdHJpbmcoMSk7XG59XG5cbi8qKlxuICogU3VwcG9ydCBzdHlsZSBuYW1lcyB0aGF0IG1heSBjb21lIHBhc3NlZCBpbiBwcmVmaXhlZCBieSBhZGRpbmcgcGVybXV0YXRpb25zXG4gKiBvZiB2ZW5kb3IgcHJlZml4ZXMuXG4gKiBUYWtlbiBmcm9tIFJlYWN0J3MgQ1NTUHJvcGVydHkuanNcbiAqL1xudmFyIHByZWZpeGVzID0gWydXZWJraXQnLCAnbXMnLCAnTW96JywgJ08nXTtcblxuLy8gVXNpbmcgT2JqZWN0LmtleXMgaGVyZSwgb3IgZWxzZSB0aGUgdmFuaWxsYSBmb3ItaW4gbG9vcCBtYWtlcyBJRTggZ28gaW50byBhblxuLy8gaW5maW5pdGUgbG9vcCwgYmVjYXVzZSBpdCBpdGVyYXRlcyBvdmVyIHRoZSBuZXdseSBhZGRlZCBwcm9wcyB0b28uXG4vLyBUYWtlbiBmcm9tIFJlYWN0J3MgQ1NTUHJvcGVydHkuanNcbk9iamVjdC5rZXlzKGlzVW5pdGxlc3NOdW1iZXIpLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICBwcmVmaXhlcy5mb3JFYWNoKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgICAgaXNVbml0bGVzc051bWJlcltwcmVmaXhLZXkocHJlZml4LCBwcm9wKV0gPSBpc1VuaXRsZXNzTnVtYmVyW3Byb3BdO1xuICAgIH0pO1xufSk7XG5cbnZhciBzdHJpbmdpZnlWYWx1ZSA9IGZ1bmN0aW9uIHN0cmluZ2lmeVZhbHVlKGtleSwgcHJvcCkge1xuICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBpZiAoaXNVbml0bGVzc051bWJlcltrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIiArIHByb3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcCArIFwicHhcIjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwcm9wO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuc3RyaW5naWZ5VmFsdWUgPSBzdHJpbmdpZnlWYWx1ZTtcbi8qKlxuICogSlMgSW1wbGVtZW50YXRpb24gb2YgTXVybXVySGFzaDJcbiAqXG4gKiBAYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86Z2FyeS5jb3VydEBnbWFpbC5jb21cIj5HYXJ5IENvdXJ0PC9hPlxuICogQHNlZSBodHRwOi8vZ2l0aHViLmNvbS9nYXJ5Y291cnQvbXVybXVyaGFzaC1qc1xuICogQGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmFhcHBsZWJ5QGdtYWlsLmNvbVwiPkF1c3RpbiBBcHBsZWJ5PC9hPlxuICogQHNlZSBodHRwOi8vc2l0ZXMuZ29vZ2xlLmNvbS9zaXRlL211cm11cmhhc2gvXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0ciBBU0NJSSBvbmx5XG4gKiBAcmV0dXJuIHtzdHJpbmd9IEJhc2UgMzYgZW5jb2RlZCBoYXNoIHJlc3VsdFxuICovXG5mdW5jdGlvbiBtdXJtdXJoYXNoMl8zMl9nYyhzdHIpIHtcbiAgICB2YXIgbCA9IHN0ci5sZW5ndGg7XG4gICAgdmFyIGggPSBsO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgayA9IHVuZGVmaW5lZDtcblxuICAgIHdoaWxlIChsID49IDQpIHtcbiAgICAgICAgayA9IHN0ci5jaGFyQ29kZUF0KGkpICYgMHhmZiB8IChzdHIuY2hhckNvZGVBdCgrK2kpICYgMHhmZikgPDwgOCB8IChzdHIuY2hhckNvZGVBdCgrK2kpICYgMHhmZikgPDwgMTYgfCAoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDI0O1xuXG4gICAgICAgIGsgPSAoayAmIDB4ZmZmZikgKiAweDViZDFlOTk1ICsgKCgoayA+Pj4gMTYpICogMHg1YmQxZTk5NSAmIDB4ZmZmZikgPDwgMTYpO1xuICAgICAgICBrIF49IGsgPj4+IDI0O1xuICAgICAgICBrID0gKGsgJiAweGZmZmYpICogMHg1YmQxZTk5NSArICgoKGsgPj4+IDE2KSAqIDB4NWJkMWU5OTUgJiAweGZmZmYpIDw8IDE2KTtcblxuICAgICAgICBoID0gKGggJiAweGZmZmYpICogMHg1YmQxZTk5NSArICgoKGggPj4+IDE2KSAqIDB4NWJkMWU5OTUgJiAweGZmZmYpIDw8IDE2KSBeIGs7XG5cbiAgICAgICAgbCAtPSA0O1xuICAgICAgICArK2k7XG4gICAgfVxuXG4gICAgc3dpdGNoIChsKSB7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGggXj0gKHN0ci5jaGFyQ29kZUF0KGkgKyAyKSAmIDB4ZmYpIDw8IDE2O1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBoIF49IChzdHIuY2hhckNvZGVBdChpICsgMSkgJiAweGZmKSA8PCA4O1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBoIF49IHN0ci5jaGFyQ29kZUF0KGkpICYgMHhmZjtcbiAgICAgICAgICAgIGggPSAoaCAmIDB4ZmZmZikgKiAweDViZDFlOTk1ICsgKCgoaCA+Pj4gMTYpICogMHg1YmQxZTk5NSAmIDB4ZmZmZikgPDwgMTYpO1xuICAgIH1cblxuICAgIGggXj0gaCA+Pj4gMTM7XG4gICAgaCA9IChoICYgMHhmZmZmKSAqIDB4NWJkMWU5OTUgKyAoKChoID4+PiAxNikgKiAweDViZDFlOTk1ICYgMHhmZmZmKSA8PCAxNik7XG4gICAgaCBePSBoID4+PiAxNTtcblxuICAgIHJldHVybiAoaCA+Pj4gMCkudG9TdHJpbmcoMzYpO1xufVxuXG4vLyBIYXNoIGEgamF2YXNjcmlwdCBvYmplY3QgdXNpbmcgSlNPTi5zdHJpbmdpZnkuIFRoaXMgaXMgdmVyeSBmYXN0LCBhYm91dCAzXG4vLyBtaWNyb3NlY29uZHMgb24gbXkgY29tcHV0ZXIgZm9yIGEgc2FtcGxlIG9iamVjdDpcbi8vIGh0dHA6Ly9qc3BlcmYuY29tL3Rlc3QtaGFzaGZudjMyYS1oYXNoLzVcbi8vXG4vLyBOb3RlIHRoYXQgdGhpcyB1c2VzIEpTT04uc3RyaW5naWZ5IHRvIHN0cmluZ2lmeSB0aGUgb2JqZWN0cyBzbyBpbiBvcmRlciBmb3Jcbi8vIHRoaXMgdG8gcHJvZHVjZSBjb25zaXN0ZW50IGhhc2hlcyBicm93c2VycyBuZWVkIHRvIGhhdmUgYSBjb25zaXN0ZW50XG4vLyBvcmRlcmluZyBvZiBvYmplY3RzLiBCZW4gQWxwZXJ0IHNheXMgdGhhdCBGYWNlYm9vayBkZXBlbmRzIG9uIHRoaXMsIHNvIHdlXG4vLyBjYW4gcHJvYmFibHkgZGVwZW5kIG9uIHRoaXMgdG9vLlxudmFyIGhhc2hPYmplY3QgPSBmdW5jdGlvbiBoYXNoT2JqZWN0KG9iamVjdCkge1xuICAgIHJldHVybiBtdXJtdXJoYXNoMl8zMl9nYyhKU09OLnN0cmluZ2lmeShvYmplY3QpKTtcbn07XG5cbmV4cG9ydHMuaGFzaE9iamVjdCA9IGhhc2hPYmplY3Q7XG52YXIgSU1QT1JUQU5UX1JFID0gL14oW146XSs6Lio/KSggIWltcG9ydGFudCk/OyQvO1xuXG4vLyBHaXZlbiBhIHNpbmdsZSBzdHlsZSBydWxlIHN0cmluZyBsaWtlIFwiYTogYjtcIiwgYWRkcyAhaW1wb3J0YW50IHRvIGdlbmVyYXRlXG4vLyBcImE6IGIgIWltcG9ydGFudDtcIi5cbnZhciBpbXBvcnRhbnRpZnkgPSBmdW5jdGlvbiBpbXBvcnRhbnRpZnkoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKElNUE9SVEFOVF9SRSwgZnVuY3Rpb24gKF8sIGJhc2UsIGltcG9ydGFudCkge1xuICAgICAgICByZXR1cm4gYmFzZSArIFwiICFpbXBvcnRhbnQ7XCI7XG4gICAgfSk7XG59O1xuZXhwb3J0cy5pbXBvcnRhbnRpZnkgPSBpbXBvcnRhbnRpZnk7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9uby1pbXBvcnRhbnQuanMnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyByYXdBc2FwIHByb3ZpZGVzIGV2ZXJ5dGhpbmcgd2UgbmVlZCBleGNlcHQgZXhjZXB0aW9uIG1hbmFnZW1lbnQuXG52YXIgcmF3QXNhcCA9IHJlcXVpcmUoXCIuL3Jhd1wiKTtcbi8vIFJhd1Rhc2tzIGFyZSByZWN5Y2xlZCB0byByZWR1Y2UgR0MgY2h1cm4uXG52YXIgZnJlZVRhc2tzID0gW107XG4vLyBXZSBxdWV1ZSBlcnJvcnMgdG8gZW5zdXJlIHRoZXkgYXJlIHRocm93biBpbiByaWdodCBvcmRlciAoRklGTykuXG4vLyBBcnJheS1hcy1xdWV1ZSBpcyBnb29kIGVub3VnaCBoZXJlLCBzaW5jZSB3ZSBhcmUganVzdCBkZWFsaW5nIHdpdGggZXhjZXB0aW9ucy5cbnZhciBwZW5kaW5nRXJyb3JzID0gW107XG52YXIgcmVxdWVzdEVycm9yVGhyb3cgPSByYXdBc2FwLm1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcih0aHJvd0ZpcnN0RXJyb3IpO1xuXG5mdW5jdGlvbiB0aHJvd0ZpcnN0RXJyb3IoKSB7XG4gICAgaWYgKHBlbmRpbmdFcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IHBlbmRpbmdFcnJvcnMuc2hpZnQoKTtcbiAgICB9XG59XG5cbi8qKlxuICogQ2FsbHMgYSB0YXNrIGFzIHNvb24gYXMgcG9zc2libGUgYWZ0ZXIgcmV0dXJuaW5nLCBpbiBpdHMgb3duIGV2ZW50LCB3aXRoIHByaW9yaXR5XG4gKiBvdmVyIG90aGVyIGV2ZW50cyBsaWtlIGFuaW1hdGlvbiwgcmVmbG93LCBhbmQgcmVwYWludC4gQW4gZXJyb3IgdGhyb3duIGZyb20gYW5cbiAqIGV2ZW50IHdpbGwgbm90IGludGVycnVwdCwgbm9yIGV2ZW4gc3Vic3RhbnRpYWxseSBzbG93IGRvd24gdGhlIHByb2Nlc3Npbmcgb2ZcbiAqIG90aGVyIGV2ZW50cywgYnV0IHdpbGwgYmUgcmF0aGVyIHBvc3Rwb25lZCB0byBhIGxvd2VyIHByaW9yaXR5IGV2ZW50LlxuICogQHBhcmFtIHt7Y2FsbH19IHRhc2sgQSBjYWxsYWJsZSBvYmplY3QsIHR5cGljYWxseSBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgbm9cbiAqIGFyZ3VtZW50cy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBhc2FwO1xuZnVuY3Rpb24gYXNhcCh0YXNrKSB7XG4gICAgdmFyIHJhd1Rhc2s7XG4gICAgaWYgKGZyZWVUYXNrcy5sZW5ndGgpIHtcbiAgICAgICAgcmF3VGFzayA9IGZyZWVUYXNrcy5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByYXdUYXNrID0gbmV3IFJhd1Rhc2soKTtcbiAgICB9XG4gICAgcmF3VGFzay50YXNrID0gdGFzaztcbiAgICByYXdBc2FwKHJhd1Rhc2spO1xufVxuXG4vLyBXZSB3cmFwIHRhc2tzIHdpdGggcmVjeWNsYWJsZSB0YXNrIG9iamVjdHMuICBBIHRhc2sgb2JqZWN0IGltcGxlbWVudHNcbi8vIGBjYWxsYCwganVzdCBsaWtlIGEgZnVuY3Rpb24uXG5mdW5jdGlvbiBSYXdUYXNrKCkge1xuICAgIHRoaXMudGFzayA9IG51bGw7XG59XG5cbi8vIFRoZSBzb2xlIHB1cnBvc2Ugb2Ygd3JhcHBpbmcgdGhlIHRhc2sgaXMgdG8gY2F0Y2ggdGhlIGV4Y2VwdGlvbiBhbmQgcmVjeWNsZVxuLy8gdGhlIHRhc2sgb2JqZWN0IGFmdGVyIGl0cyBzaW5nbGUgdXNlLlxuUmF3VGFzay5wcm90b3R5cGUuY2FsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICB0aGlzLnRhc2suY2FsbCgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmIChhc2FwLm9uZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaG9vayBleGlzdHMgcHVyZWx5IGZvciB0ZXN0aW5nIHB1cnBvc2VzLlxuICAgICAgICAgICAgLy8gSXRzIG5hbWUgd2lsbCBiZSBwZXJpb2RpY2FsbHkgcmFuZG9taXplZCB0byBicmVhayBhbnkgY29kZSB0aGF0XG4gICAgICAgICAgICAvLyBkZXBlbmRzIG9uIGl0cyBleGlzdGVuY2UuXG4gICAgICAgICAgICBhc2FwLm9uZXJyb3IoZXJyb3IpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSW4gYSB3ZWIgYnJvd3NlciwgZXhjZXB0aW9ucyBhcmUgbm90IGZhdGFsLiBIb3dldmVyLCB0byBhdm9pZFxuICAgICAgICAgICAgLy8gc2xvd2luZyBkb3duIHRoZSBxdWV1ZSBvZiBwZW5kaW5nIHRhc2tzLCB3ZSByZXRocm93IHRoZSBlcnJvciBpbiBhXG4gICAgICAgICAgICAvLyBsb3dlciBwcmlvcml0eSB0dXJuLlxuICAgICAgICAgICAgcGVuZGluZ0Vycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICAgIHJlcXVlc3RFcnJvclRocm93KCk7XG4gICAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgICB0aGlzLnRhc2sgPSBudWxsO1xuICAgICAgICBmcmVlVGFza3NbZnJlZVRhc2tzLmxlbmd0aF0gPSB0aGlzO1xuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gVXNlIHRoZSBmYXN0ZXN0IG1lYW5zIHBvc3NpYmxlIHRvIGV4ZWN1dGUgYSB0YXNrIGluIGl0cyBvd24gdHVybiwgd2l0aFxuLy8gcHJpb3JpdHkgb3ZlciBvdGhlciBldmVudHMgaW5jbHVkaW5nIElPLCBhbmltYXRpb24sIHJlZmxvdywgYW5kIHJlZHJhd1xuLy8gZXZlbnRzIGluIGJyb3dzZXJzLlxuLy9cbi8vIEFuIGV4Y2VwdGlvbiB0aHJvd24gYnkgYSB0YXNrIHdpbGwgcGVybWFuZW50bHkgaW50ZXJydXB0IHRoZSBwcm9jZXNzaW5nIG9mXG4vLyBzdWJzZXF1ZW50IHRhc2tzLiBUaGUgaGlnaGVyIGxldmVsIGBhc2FwYCBmdW5jdGlvbiBlbnN1cmVzIHRoYXQgaWYgYW5cbi8vIGV4Y2VwdGlvbiBpcyB0aHJvd24gYnkgYSB0YXNrLCB0aGF0IHRoZSB0YXNrIHF1ZXVlIHdpbGwgY29udGludWUgZmx1c2hpbmcgYXNcbi8vIHNvb24gYXMgcG9zc2libGUsIGJ1dCBpZiB5b3UgdXNlIGByYXdBc2FwYCBkaXJlY3RseSwgeW91IGFyZSByZXNwb25zaWJsZSB0b1xuLy8gZWl0aGVyIGVuc3VyZSB0aGF0IG5vIGV4Y2VwdGlvbnMgYXJlIHRocm93biBmcm9tIHlvdXIgdGFzaywgb3IgdG8gbWFudWFsbHlcbi8vIGNhbGwgYHJhd0FzYXAucmVxdWVzdEZsdXNoYCBpZiBhbiBleGNlcHRpb24gaXMgdGhyb3duLlxubW9kdWxlLmV4cG9ydHMgPSByYXdBc2FwO1xuZnVuY3Rpb24gcmF3QXNhcCh0YXNrKSB7XG4gICAgaWYgKCFxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcmVxdWVzdEZsdXNoKCk7XG4gICAgICAgIGZsdXNoaW5nID0gdHJ1ZTtcbiAgICB9XG4gICAgLy8gRXF1aXZhbGVudCB0byBwdXNoLCBidXQgYXZvaWRzIGEgZnVuY3Rpb24gY2FsbC5cbiAgICBxdWV1ZVtxdWV1ZS5sZW5ndGhdID0gdGFzaztcbn1cblxudmFyIHF1ZXVlID0gW107XG4vLyBPbmNlIGEgZmx1c2ggaGFzIGJlZW4gcmVxdWVzdGVkLCBubyBmdXJ0aGVyIGNhbGxzIHRvIGByZXF1ZXN0Rmx1c2hgIGFyZVxuLy8gbmVjZXNzYXJ5IHVudGlsIHRoZSBuZXh0IGBmbHVzaGAgY29tcGxldGVzLlxudmFyIGZsdXNoaW5nID0gZmFsc2U7XG4vLyBgcmVxdWVzdEZsdXNoYCBpcyBhbiBpbXBsZW1lbnRhdGlvbi1zcGVjaWZpYyBtZXRob2QgdGhhdCBhdHRlbXB0cyB0byBraWNrXG4vLyBvZmYgYSBgZmx1c2hgIGV2ZW50IGFzIHF1aWNrbHkgYXMgcG9zc2libGUuIGBmbHVzaGAgd2lsbCBhdHRlbXB0IHRvIGV4aGF1c3Rcbi8vIHRoZSBldmVudCBxdWV1ZSBiZWZvcmUgeWllbGRpbmcgdG8gdGhlIGJyb3dzZXIncyBvd24gZXZlbnQgbG9vcC5cbnZhciByZXF1ZXN0Rmx1c2g7XG4vLyBUaGUgcG9zaXRpb24gb2YgdGhlIG5leHQgdGFzayB0byBleGVjdXRlIGluIHRoZSB0YXNrIHF1ZXVlLiBUaGlzIGlzXG4vLyBwcmVzZXJ2ZWQgYmV0d2VlbiBjYWxscyB0byBgZmx1c2hgIHNvIHRoYXQgaXQgY2FuIGJlIHJlc3VtZWQgaWZcbi8vIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLlxudmFyIGluZGV4ID0gMDtcbi8vIElmIGEgdGFzayBzY2hlZHVsZXMgYWRkaXRpb25hbCB0YXNrcyByZWN1cnNpdmVseSwgdGhlIHRhc2sgcXVldWUgY2FuIGdyb3dcbi8vIHVuYm91bmRlZC4gVG8gcHJldmVudCBtZW1vcnkgZXhoYXVzdGlvbiwgdGhlIHRhc2sgcXVldWUgd2lsbCBwZXJpb2RpY2FsbHlcbi8vIHRydW5jYXRlIGFscmVhZHktY29tcGxldGVkIHRhc2tzLlxudmFyIGNhcGFjaXR5ID0gMTAyNDtcblxuLy8gVGhlIGZsdXNoIGZ1bmN0aW9uIHByb2Nlc3NlcyBhbGwgdGFza3MgdGhhdCBoYXZlIGJlZW4gc2NoZWR1bGVkIHdpdGhcbi8vIGByYXdBc2FwYCB1bmxlc3MgYW5kIHVudGlsIG9uZSBvZiB0aG9zZSB0YXNrcyB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuLy8gSWYgYSB0YXNrIHRocm93cyBhbiBleGNlcHRpb24sIGBmbHVzaGAgZW5zdXJlcyB0aGF0IGl0cyBzdGF0ZSB3aWxsIHJlbWFpblxuLy8gY29uc2lzdGVudCBhbmQgd2lsbCByZXN1bWUgd2hlcmUgaXQgbGVmdCBvZmYgd2hlbiBjYWxsZWQgYWdhaW4uXG4vLyBIb3dldmVyLCBgZmx1c2hgIGRvZXMgbm90IG1ha2UgYW55IGFycmFuZ2VtZW50cyB0byBiZSBjYWxsZWQgYWdhaW4gaWYgYW5cbi8vIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5mdW5jdGlvbiBmbHVzaCgpIHtcbiAgICB3aGlsZSAoaW5kZXggPCBxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGluZGV4O1xuICAgICAgICAvLyBBZHZhbmNlIHRoZSBpbmRleCBiZWZvcmUgY2FsbGluZyB0aGUgdGFzay4gVGhpcyBlbnN1cmVzIHRoYXQgd2Ugd2lsbFxuICAgICAgICAvLyBiZWdpbiBmbHVzaGluZyBvbiB0aGUgbmV4dCB0YXNrIHRoZSB0YXNrIHRocm93cyBhbiBlcnJvci5cbiAgICAgICAgaW5kZXggPSBpbmRleCArIDE7XG4gICAgICAgIHF1ZXVlW2N1cnJlbnRJbmRleF0uY2FsbCgpO1xuICAgICAgICAvLyBQcmV2ZW50IGxlYWtpbmcgbWVtb3J5IGZvciBsb25nIGNoYWlucyBvZiByZWN1cnNpdmUgY2FsbHMgdG8gYGFzYXBgLlxuICAgICAgICAvLyBJZiB3ZSBjYWxsIGBhc2FwYCB3aXRoaW4gdGFza3Mgc2NoZWR1bGVkIGJ5IGBhc2FwYCwgdGhlIHF1ZXVlIHdpbGxcbiAgICAgICAgLy8gZ3JvdywgYnV0IHRvIGF2b2lkIGFuIE8obikgd2FsayBmb3IgZXZlcnkgdGFzayB3ZSBleGVjdXRlLCB3ZSBkb24ndFxuICAgICAgICAvLyBzaGlmdCB0YXNrcyBvZmYgdGhlIHF1ZXVlIGFmdGVyIHRoZXkgaGF2ZSBiZWVuIGV4ZWN1dGVkLlxuICAgICAgICAvLyBJbnN0ZWFkLCB3ZSBwZXJpb2RpY2FsbHkgc2hpZnQgMTAyNCB0YXNrcyBvZmYgdGhlIHF1ZXVlLlxuICAgICAgICBpZiAoaW5kZXggPiBjYXBhY2l0eSkge1xuICAgICAgICAgICAgLy8gTWFudWFsbHkgc2hpZnQgYWxsIHZhbHVlcyBzdGFydGluZyBhdCB0aGUgaW5kZXggYmFjayB0byB0aGVcbiAgICAgICAgICAgIC8vIGJlZ2lubmluZyBvZiB0aGUgcXVldWUuXG4gICAgICAgICAgICBmb3IgKHZhciBzY2FuID0gMCwgbmV3TGVuZ3RoID0gcXVldWUubGVuZ3RoIC0gaW5kZXg7IHNjYW4gPCBuZXdMZW5ndGg7IHNjYW4rKykge1xuICAgICAgICAgICAgICAgIHF1ZXVlW3NjYW5dID0gcXVldWVbc2NhbiArIGluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHF1ZXVlLmxlbmd0aCAtPSBpbmRleDtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5sZW5ndGggPSAwO1xuICAgIGluZGV4ID0gMDtcbiAgICBmbHVzaGluZyA9IGZhbHNlO1xufVxuXG4vLyBgcmVxdWVzdEZsdXNoYCBpcyBpbXBsZW1lbnRlZCB1c2luZyBhIHN0cmF0ZWd5IGJhc2VkIG9uIGRhdGEgY29sbGVjdGVkIGZyb21cbi8vIGV2ZXJ5IGF2YWlsYWJsZSBTYXVjZUxhYnMgU2VsZW5pdW0gd2ViIGRyaXZlciB3b3JrZXIgYXQgdGltZSBvZiB3cml0aW5nLlxuLy8gaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMW1HLTVVWUd1cDVxeEdkRU1Xa2hQNkJXQ3owNTNOVWIyRTFRb1VUVTE2dUEvZWRpdCNnaWQ9NzgzNzI0NTkzXG5cbi8vIFNhZmFyaSA2IGFuZCA2LjEgZm9yIGRlc2t0b3AsIGlQYWQsIGFuZCBpUGhvbmUgYXJlIHRoZSBvbmx5IGJyb3dzZXJzIHRoYXRcbi8vIGhhdmUgV2ViS2l0TXV0YXRpb25PYnNlcnZlciBidXQgbm90IHVuLXByZWZpeGVkIE11dGF0aW9uT2JzZXJ2ZXIuXG4vLyBNdXN0IHVzZSBgZ2xvYmFsYCBvciBgc2VsZmAgaW5zdGVhZCBvZiBgd2luZG93YCB0byB3b3JrIGluIGJvdGggZnJhbWVzIGFuZCB3ZWJcbi8vIHdvcmtlcnMuIGBnbG9iYWxgIGlzIGEgcHJvdmlzaW9uIG9mIEJyb3dzZXJpZnksIE1yLCBNcnMsIG9yIE1vcC5cblxuLyogZ2xvYmFscyBzZWxmICovXG52YXIgc2NvcGUgPSB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogc2VsZjtcbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IHNjb3BlLk11dGF0aW9uT2JzZXJ2ZXIgfHwgc2NvcGUuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcblxuLy8gTXV0YXRpb25PYnNlcnZlcnMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgaGF2ZSBoaWdoIHByaW9yaXR5IGFuZCB3b3JrXG4vLyByZWxpYWJseSBldmVyeXdoZXJlIHRoZXkgYXJlIGltcGxlbWVudGVkLlxuLy8gVGhleSBhcmUgaW1wbGVtZW50ZWQgaW4gYWxsIG1vZGVybiBicm93c2Vycy5cbi8vXG4vLyAtIEFuZHJvaWQgNC00LjNcbi8vIC0gQ2hyb21lIDI2LTM0XG4vLyAtIEZpcmVmb3ggMTQtMjlcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgMTFcbi8vIC0gaVBhZCBTYWZhcmkgNi03LjFcbi8vIC0gaVBob25lIFNhZmFyaSA3LTcuMVxuLy8gLSBTYWZhcmkgNi03XG5pZiAodHlwZW9mIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG5cbi8vIE1lc3NhZ2VDaGFubmVscyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBnaXZlIGRpcmVjdCBhY2Nlc3MgdG8gdGhlIEhUTUxcbi8vIHRhc2sgcXVldWUsIGFyZSBpbXBsZW1lbnRlZCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCwgU2FmYXJpIDUuMC0xLCBhbmQgT3BlcmFcbi8vIDExLTEyLCBhbmQgaW4gd2ViIHdvcmtlcnMgaW4gbWFueSBlbmdpbmVzLlxuLy8gQWx0aG91Z2ggbWVzc2FnZSBjaGFubmVscyB5aWVsZCB0byBhbnkgcXVldWVkIHJlbmRlcmluZyBhbmQgSU8gdGFza3MsIHRoZXlcbi8vIHdvdWxkIGJlIGJldHRlciB0aGFuIGltcG9zaW5nIHRoZSA0bXMgZGVsYXkgb2YgdGltZXJzLlxuLy8gSG93ZXZlciwgdGhleSBkbyBub3Qgd29yayByZWxpYWJseSBpbiBJbnRlcm5ldCBFeHBsb3JlciBvciBTYWZhcmkuXG5cbi8vIEludGVybmV0IEV4cGxvcmVyIDEwIGlzIHRoZSBvbmx5IGJyb3dzZXIgdGhhdCBoYXMgc2V0SW1tZWRpYXRlIGJ1dCBkb2VzXG4vLyBub3QgaGF2ZSBNdXRhdGlvbk9ic2VydmVycy5cbi8vIEFsdGhvdWdoIHNldEltbWVkaWF0ZSB5aWVsZHMgdG8gdGhlIGJyb3dzZXIncyByZW5kZXJlciwgaXQgd291bGQgYmVcbi8vIHByZWZlcnJhYmxlIHRvIGZhbGxpbmcgYmFjayB0byBzZXRUaW1lb3V0IHNpbmNlIGl0IGRvZXMgbm90IGhhdmVcbi8vIHRoZSBtaW5pbXVtIDRtcyBwZW5hbHR5LlxuLy8gVW5mb3J0dW5hdGVseSB0aGVyZSBhcHBlYXJzIHRvIGJlIGEgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwIE1vYmlsZSAoYW5kXG4vLyBEZXNrdG9wIHRvIGEgbGVzc2VyIGV4dGVudCkgdGhhdCByZW5kZXJzIGJvdGggc2V0SW1tZWRpYXRlIGFuZFxuLy8gTWVzc2FnZUNoYW5uZWwgdXNlbGVzcyBmb3IgdGhlIHB1cnBvc2VzIG9mIEFTQVAuXG4vLyBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tvd2FsL3EvaXNzdWVzLzM5NlxuXG4vLyBUaW1lcnMgYXJlIGltcGxlbWVudGVkIHVuaXZlcnNhbGx5LlxuLy8gV2UgZmFsbCBiYWNrIHRvIHRpbWVycyBpbiB3b3JrZXJzIGluIG1vc3QgZW5naW5lcywgYW5kIGluIGZvcmVncm91bmRcbi8vIGNvbnRleHRzIGluIHRoZSBmb2xsb3dpbmcgYnJvd3NlcnMuXG4vLyBIb3dldmVyLCBub3RlIHRoYXQgZXZlbiB0aGlzIHNpbXBsZSBjYXNlIHJlcXVpcmVzIG51YW5jZXMgdG8gb3BlcmF0ZSBpbiBhXG4vLyBicm9hZCBzcGVjdHJ1bSBvZiBicm93c2Vycy5cbi8vXG4vLyAtIEZpcmVmb3ggMy0xM1xuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciA2LTlcbi8vIC0gaVBhZCBTYWZhcmkgNC4zXG4vLyAtIEx5bnggMi44Ljdcbn0gZWxzZSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGZsdXNoKTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgcmVxdWVzdHMgdGhhdCB0aGUgaGlnaCBwcmlvcml0eSBldmVudCBxdWV1ZSBiZSBmbHVzaGVkIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLlxuLy8gVGhpcyBpcyB1c2VmdWwgdG8gcHJldmVudCBhbiBlcnJvciB0aHJvd24gaW4gYSB0YXNrIGZyb20gc3RhbGxpbmcgdGhlIGV2ZW50XG4vLyBxdWV1ZSBpZiB0aGUgZXhjZXB0aW9uIGhhbmRsZWQgYnkgTm9kZS5qc+KAmXNcbi8vIGBwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIilgIG9yIGJ5IGEgZG9tYWluLlxucmF3QXNhcC5yZXF1ZXN0Rmx1c2ggPSByZXF1ZXN0Rmx1c2g7XG5cbi8vIFRvIHJlcXVlc3QgYSBoaWdoIHByaW9yaXR5IGV2ZW50LCB3ZSBpbmR1Y2UgYSBtdXRhdGlvbiBvYnNlcnZlciBieSB0b2dnbGluZ1xuLy8gdGhlIHRleHQgb2YgYSB0ZXh0IG5vZGUgYmV0d2VlbiBcIjFcIiBhbmQgXCItMVwiLlxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spIHtcbiAgICB2YXIgdG9nZ2xlID0gMTtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAgICAgdG9nZ2xlID0gLXRvZ2dsZTtcbiAgICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlO1xuICAgIH07XG59XG5cbi8vIFRoZSBtZXNzYWdlIGNoYW5uZWwgdGVjaG5pcXVlIHdhcyBkaXNjb3ZlcmVkIGJ5IE1hbHRlIFVibCBhbmQgd2FzIHRoZVxuLy8gb3JpZ2luYWwgZm91bmRhdGlvbiBmb3IgdGhpcyBsaWJyYXJ5LlxuLy8gaHR0cDovL3d3dy5ub25ibG9ja2luZy5pby8yMDExLzA2L3dpbmRvd25leHR0aWNrLmh0bWxcblxuLy8gU2FmYXJpIDYuMC41IChhdCBsZWFzdCkgaW50ZXJtaXR0ZW50bHkgZmFpbHMgdG8gY3JlYXRlIG1lc3NhZ2UgcG9ydHMgb24gYVxuLy8gcGFnZSdzIGZpcnN0IGxvYWQuIFRoYW5rZnVsbHksIHRoaXMgdmVyc2lvbiBvZiBTYWZhcmkgc3VwcG9ydHNcbi8vIE11dGF0aW9uT2JzZXJ2ZXJzLCBzbyB3ZSBkb24ndCBuZWVkIHRvIGZhbGwgYmFjayBpbiB0aGF0IGNhc2UuXG5cbi8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NZXNzYWdlQ2hhbm5lbChjYWxsYmFjaykge1xuLy8gICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4vLyAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBjYWxsYmFjaztcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4vLyAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoMCk7XG4vLyAgICAgfTtcbi8vIH1cblxuLy8gRm9yIHJlYXNvbnMgZXhwbGFpbmVkIGFib3ZlLCB3ZSBhcmUgYWxzbyB1bmFibGUgdG8gdXNlIGBzZXRJbW1lZGlhdGVgXG4vLyB1bmRlciBhbnkgY2lyY3Vtc3RhbmNlcy5cbi8vIEV2ZW4gaWYgd2Ugd2VyZSwgdGhlcmUgaXMgYW5vdGhlciBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAuXG4vLyBJdCBpcyBub3Qgc3VmZmljaWVudCB0byBhc3NpZ24gYHNldEltbWVkaWF0ZWAgdG8gYHJlcXVlc3RGbHVzaGAgYmVjYXVzZVxuLy8gYHNldEltbWVkaWF0ZWAgbXVzdCBiZSBjYWxsZWQgKmJ5IG5hbWUqIGFuZCB0aGVyZWZvcmUgbXVzdCBiZSB3cmFwcGVkIGluIGFcbi8vIGNsb3N1cmUuXG4vLyBOZXZlciBmb3JnZXQuXG5cbi8vIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21TZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbi8vICAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4vLyAgICAgICAgIHNldEltbWVkaWF0ZShjYWxsYmFjayk7XG4vLyAgICAgfTtcbi8vIH1cblxuLy8gU2FmYXJpIDYuMCBoYXMgYSBwcm9ibGVtIHdoZXJlIHRpbWVycyB3aWxsIGdldCBsb3N0IHdoaWxlIHRoZSB1c2VyIGlzXG4vLyBzY3JvbGxpbmcuIFRoaXMgcHJvYmxlbSBkb2VzIG5vdCBpbXBhY3QgQVNBUCBiZWNhdXNlIFNhZmFyaSA2LjAgc3VwcG9ydHNcbi8vIG11dGF0aW9uIG9ic2VydmVycywgc28gdGhhdCBpbXBsZW1lbnRhdGlvbiBpcyB1c2VkIGluc3RlYWQuXG4vLyBIb3dldmVyLCBpZiB3ZSBldmVyIGVsZWN0IHRvIHVzZSB0aW1lcnMgaW4gU2FmYXJpLCB0aGUgcHJldmFsZW50IHdvcmstYXJvdW5kXG4vLyBpcyB0byBhZGQgYSBzY3JvbGwgZXZlbnQgbGlzdGVuZXIgdGhhdCBjYWxscyBmb3IgYSBmbHVzaC5cblxuLy8gYHNldFRpbWVvdXRgIGRvZXMgbm90IGNhbGwgdGhlIHBhc3NlZCBjYWxsYmFjayBpZiB0aGUgZGVsYXkgaXMgbGVzcyB0aGFuXG4vLyBhcHByb3hpbWF0ZWx5IDcgaW4gd2ViIHdvcmtlcnMgaW4gRmlyZWZveCA4IHRocm91Z2ggMTgsIGFuZCBzb21ldGltZXMgbm90XG4vLyBldmVuIHRoZW4uXG5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbiAgICAgICAgLy8gV2UgZGlzcGF0Y2ggYSB0aW1lb3V0IHdpdGggYSBzcGVjaWZpZWQgZGVsYXkgb2YgMCBmb3IgZW5naW5lcyB0aGF0XG4gICAgICAgIC8vIGNhbiByZWxpYWJseSBhY2NvbW1vZGF0ZSB0aGF0IHJlcXVlc3QuIFRoaXMgd2lsbCB1c3VhbGx5IGJlIHNuYXBwZWRcbiAgICAgICAgLy8gdG8gYSA0IG1pbGlzZWNvbmQgZGVsYXksIGJ1dCBvbmNlIHdlJ3JlIGZsdXNoaW5nLCB0aGVyZSdzIG5vIGRlbGF5XG4gICAgICAgIC8vIGJldHdlZW4gZXZlbnRzLlxuICAgICAgICB2YXIgdGltZW91dEhhbmRsZSA9IHNldFRpbWVvdXQoaGFuZGxlVGltZXIsIDApO1xuICAgICAgICAvLyBIb3dldmVyLCBzaW5jZSB0aGlzIHRpbWVyIGdldHMgZnJlcXVlbnRseSBkcm9wcGVkIGluIEZpcmVmb3hcbiAgICAgICAgLy8gd29ya2Vycywgd2UgZW5saXN0IGFuIGludGVydmFsIGhhbmRsZSB0aGF0IHdpbGwgdHJ5IHRvIGZpcmVcbiAgICAgICAgLy8gYW4gZXZlbnQgMjAgdGltZXMgcGVyIHNlY29uZCB1bnRpbCBpdCBzdWNjZWVkcy5cbiAgICAgICAgdmFyIGludGVydmFsSGFuZGxlID0gc2V0SW50ZXJ2YWwoaGFuZGxlVGltZXIsIDUwKTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVUaW1lcigpIHtcbiAgICAgICAgICAgIC8vIFdoaWNoZXZlciB0aW1lciBzdWNjZWVkcyB3aWxsIGNhbmNlbCBib3RoIHRpbWVycyBhbmRcbiAgICAgICAgICAgIC8vIGV4ZWN1dGUgdGhlIGNhbGxiYWNrLlxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRIYW5kbGUpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEhhbmRsZSk7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuLy8gVGhpcyBpcyBmb3IgYGFzYXAuanNgIG9ubHkuXG4vLyBJdHMgbmFtZSB3aWxsIGJlIHBlcmlvZGljYWxseSByYW5kb21pemVkIHRvIGJyZWFrIGFueSBjb2RlIHRoYXQgZGVwZW5kcyBvblxuLy8gaXRzIGV4aXN0ZW5jZS5cbnJhd0FzYXAubWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyID0gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyO1xuXG4vLyBBU0FQIHdhcyBvcmlnaW5hbGx5IGEgbmV4dFRpY2sgc2hpbSBpbmNsdWRlZCBpbiBRLiBUaGlzIHdhcyBmYWN0b3JlZCBvdXRcbi8vIGludG8gdGhpcyBBU0FQIHBhY2thZ2UuIEl0IHdhcyBsYXRlciBhZGFwdGVkIHRvIFJTVlAgd2hpY2ggbWFkZSBmdXJ0aGVyXG4vLyBhbWVuZG1lbnRzLiBUaGVzZSBkZWNpc2lvbnMsIHBhcnRpY3VsYXJseSB0byBtYXJnaW5hbGl6ZSBNZXNzYWdlQ2hhbm5lbCBhbmRcbi8vIHRvIGNhcHR1cmUgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgaW1wbGVtZW50YXRpb24gaW4gYSBjbG9zdXJlLCB3ZXJlIGludGVncmF0ZWRcbi8vIGJhY2sgaW50byBBU0FQIHByb3Blci5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90aWxkZWlvL3JzdnAuanMvYmxvYi9jZGRmNzIzMjU0NmE5Y2Y4NTg1MjRiNzVjZGU2ZjllZGY3MjYyMGE3L2xpYi9yc3ZwL2FzYXAuanNcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogXG4gKi9cblxuZnVuY3Rpb24gbWFrZUVtcHR5RnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGFyZztcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGFjY2VwdHMgYW5kIGRpc2NhcmRzIGlucHV0czsgaXQgaGFzIG5vIHNpZGUgZWZmZWN0cy4gVGhpcyBpc1xuICogcHJpbWFyaWx5IHVzZWZ1bCBpZGlvbWF0aWNhbGx5IGZvciBvdmVycmlkYWJsZSBmdW5jdGlvbiBlbmRwb2ludHMgd2hpY2hcbiAqIGFsd2F5cyBuZWVkIHRvIGJlIGNhbGxhYmxlLCBzaW5jZSBKUyBsYWNrcyBhIG51bGwtY2FsbCBpZGlvbSBhbGEgQ29jb2EuXG4gKi9cbnZhciBlbXB0eUZ1bmN0aW9uID0gZnVuY3Rpb24gZW1wdHlGdW5jdGlvbigpIHt9O1xuXG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zID0gbWFrZUVtcHR5RnVuY3Rpb247XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zRmFsc2UgPSBtYWtlRW1wdHlGdW5jdGlvbihmYWxzZSk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVHJ1ZSA9IG1ha2VFbXB0eUZ1bmN0aW9uKHRydWUpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGwgPSBtYWtlRW1wdHlGdW5jdGlvbihudWxsKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNUaGlzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcztcbn07XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnQgPSBmdW5jdGlvbiAoYXJnKSB7XG4gIHJldHVybiBhcmc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVtcHR5RnVuY3Rpb247IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciB2YWxpZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIHZhbGlkYXRlRm9ybWF0KGZvcm1hdCkge307XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhbGlkYXRlRm9ybWF0ID0gZnVuY3Rpb24gdmFsaWRhdGVGb3JtYXQoZm9ybWF0KSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgdmFsaWRhdGVGb3JtYXQoZm9ybWF0KTtcblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICsgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4KytdO1xuICAgICAgfSkpO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCcuL2VtcHR5RnVuY3Rpb24nKTtcblxuLyoqXG4gKiBTaW1pbGFyIHRvIGludmFyaWFudCBidXQgb25seSBsb2dzIGEgd2FybmluZyBpZiB0aGUgY29uZGl0aW9uIGlzIG5vdCBtZXQuXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIGxvZyBpc3N1ZXMgaW4gZGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRzIGluIGNyaXRpY2FsXG4gKiBwYXRocy4gUmVtb3ZpbmcgdGhlIGxvZ2dpbmcgY29kZSBmb3IgcHJvZHVjdGlvbiBlbnZpcm9ubWVudHMgd2lsbCBrZWVwIHRoZVxuICogc2FtZSBsb2dpYyBhbmQgZm9sbG93IHRoZSBzYW1lIGNvZGUgcGF0aHMuXG4gKi9cblxudmFyIHdhcm5pbmcgPSBlbXB0eUZ1bmN0aW9uO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcmludFdhcm5pbmcgPSBmdW5jdGlvbiBwcmludFdhcm5pbmcoZm9ybWF0KSB7XG4gICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgICB9XG5cbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdXYXJuaW5nOiAnICsgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIC0tLSBXZWxjb21lIHRvIGRlYnVnZ2luZyBSZWFjdCAtLS1cbiAgICAgICAgLy8gVGhpcyBlcnJvciB3YXMgdGhyb3duIGFzIGEgY29udmVuaWVuY2Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGlzIHN0YWNrXG4gICAgICAgIC8vIHRvIGZpbmQgdGhlIGNhbGxzaXRlIHRoYXQgY2F1c2VkIHRoaXMgd2FybmluZyB0byBmaXJlLlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICB9IGNhdGNoICh4KSB7fVxuICAgIH07XG5cbiAgICB3YXJuaW5nID0gZnVuY3Rpb24gd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCkge1xuICAgICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYHdhcm5pbmcoY29uZGl0aW9uLCBmb3JtYXQsIC4uLmFyZ3MpYCByZXF1aXJlcyBhIHdhcm5pbmcgJyArICdtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3JtYXQuaW5kZXhPZignRmFpbGVkIENvbXBvc2l0ZSBwcm9wVHlwZTogJykgPT09IDApIHtcbiAgICAgICAgcmV0dXJuOyAvLyBJZ25vcmUgQ29tcG9zaXRlQ29tcG9uZW50IHByb3B0eXBlIGNoZWNrLlxuICAgICAgfVxuXG4gICAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiA+IDIgPyBfbGVuMiAtIDIgOiAwKSwgX2tleTIgPSAyOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgICAgYXJnc1tfa2V5MiAtIDJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaW50V2FybmluZy5hcHBseSh1bmRlZmluZWQsIFtmb3JtYXRdLmNvbmNhdChhcmdzKSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YXJuaW5nOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHVwcGVyY2FzZVBhdHRlcm4gPSAvW0EtWl0vZztcbnZhciBtc1BhdHRlcm4gPSAvXm1zLS87XG52YXIgY2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gaHlwaGVuYXRlU3R5bGVOYW1lKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcgaW4gY2FjaGVcbiAgICA/IGNhY2hlW3N0cmluZ11cbiAgICA6IGNhY2hlW3N0cmluZ10gPSBzdHJpbmdcbiAgICAgIC5yZXBsYWNlKHVwcGVyY2FzZVBhdHRlcm4sICctJCYnKVxuICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgIC5yZXBsYWNlKG1zUGF0dGVybiwgJy1tcy0nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoeXBoZW5hdGVTdHlsZU5hbWU7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjYWxjO1xuXG52YXIgX2pvaW5QcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvam9pblByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9qb2luUHJlZml4ZWRWYWx1ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9qb2luUHJlZml4ZWRWYWx1ZSk7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvaXNQcmVmaXhlZFZhbHVlJyk7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUHJlZml4ZWRWYWx1ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGNhbGMocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICEoMCwgX2lzUHJlZml4ZWRWYWx1ZTIuZGVmYXVsdCkodmFsdWUpICYmIHZhbHVlLmluZGV4T2YoJ2NhbGMoJykgPiAtMSkge1xuICAgIHJldHVybiAoMCwgX2pvaW5QcmVmaXhlZFZhbHVlMi5kZWZhdWx0KShwcm9wZXJ0eSwgdmFsdWUsIGZ1bmN0aW9uIChwcmVmaXgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvY2FsY1xcKC9nLCBwcmVmaXggKyAnY2FsYygnKTtcbiAgICB9KTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gY3Vyc29yO1xuXG52YXIgX2pvaW5QcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvam9pblByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9qb2luUHJlZml4ZWRWYWx1ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9qb2luUHJlZml4ZWRWYWx1ZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciB2YWx1ZXMgPSB7XG4gICd6b29tLWluJzogdHJ1ZSxcbiAgJ3pvb20tb3V0JzogdHJ1ZSxcbiAgZ3JhYjogdHJ1ZSxcbiAgZ3JhYmJpbmc6IHRydWVcbn07XG5cbmZ1bmN0aW9uIGN1cnNvcihwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKHByb3BlcnR5ID09PSAnY3Vyc29yJyAmJiB2YWx1ZXNbdmFsdWVdKSB7XG4gICAgcmV0dXJuICgwLCBfam9pblByZWZpeGVkVmFsdWUyLmRlZmF1bHQpKHByb3BlcnR5LCB2YWx1ZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZsZXg7XG52YXIgdmFsdWVzID0geyBmbGV4OiB0cnVlLCAnaW5saW5lLWZsZXgnOiB0cnVlIH07XG5cbmZ1bmN0aW9uIGZsZXgocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChwcm9wZXJ0eSA9PT0gJ2Rpc3BsYXknICYmIHZhbHVlc1t2YWx1ZV0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGlzcGxheTogWyctd2Via2l0LWJveCcsICctbW96LWJveCcsICctbXMtJyArIHZhbHVlICsgJ2JveCcsICctd2Via2l0LScgKyB2YWx1ZSwgdmFsdWVdXG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZmxleGJveElFO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgYWx0ZXJuYXRpdmVWYWx1ZXMgPSB7XG4gICdzcGFjZS1hcm91bmQnOiAnZGlzdHJpYnV0ZScsXG4gICdzcGFjZS1iZXR3ZWVuJzogJ2p1c3RpZnknLFxuICAnZmxleC1zdGFydCc6ICdzdGFydCcsXG4gICdmbGV4LWVuZCc6ICdlbmQnXG59O1xudmFyIGFsdGVybmF0aXZlUHJvcHMgPSB7XG4gIGFsaWduQ29udGVudDogJ21zRmxleExpbmVQYWNrJyxcbiAgYWxpZ25TZWxmOiAnbXNGbGV4SXRlbUFsaWduJyxcbiAgYWxpZ25JdGVtczogJ21zRmxleEFsaWduJyxcbiAganVzdGlmeUNvbnRlbnQ6ICdtc0ZsZXhQYWNrJyxcbiAgb3JkZXI6ICdtc0ZsZXhPcmRlcicsXG4gIGZsZXhHcm93OiAnbXNGbGV4UG9zaXRpdmUnLFxuICBmbGV4U2hyaW5rOiAnbXNGbGV4TmVnYXRpdmUnLFxuICBmbGV4QmFzaXM6ICdtc1ByZWZlcnJlZFNpemUnXG59O1xuXG5mdW5jdGlvbiBmbGV4Ym94SUUocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChhbHRlcm5hdGl2ZVByb3BzW3Byb3BlcnR5XSkge1xuICAgIHJldHVybiBfZGVmaW5lUHJvcGVydHkoe30sIGFsdGVybmF0aXZlUHJvcHNbcHJvcGVydHldLCBhbHRlcm5hdGl2ZVZhbHVlc1t2YWx1ZV0gfHwgdmFsdWUpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBmbGV4Ym94T2xkO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgYWx0ZXJuYXRpdmVWYWx1ZXMgPSB7XG4gICdzcGFjZS1hcm91bmQnOiAnanVzdGlmeScsXG4gICdzcGFjZS1iZXR3ZWVuJzogJ2p1c3RpZnknLFxuICAnZmxleC1zdGFydCc6ICdzdGFydCcsXG4gICdmbGV4LWVuZCc6ICdlbmQnLFxuICAnd3JhcC1yZXZlcnNlJzogJ211bHRpcGxlJyxcbiAgd3JhcDogJ211bHRpcGxlJ1xufTtcblxudmFyIGFsdGVybmF0aXZlUHJvcHMgPSB7XG4gIGFsaWduSXRlbXM6ICdXZWJraXRCb3hBbGlnbicsXG4gIGp1c3RpZnlDb250ZW50OiAnV2Via2l0Qm94UGFjaycsXG4gIGZsZXhXcmFwOiAnV2Via2l0Qm94TGluZXMnXG59O1xuXG5mdW5jdGlvbiBmbGV4Ym94T2xkKHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAocHJvcGVydHkgPT09ICdmbGV4RGlyZWN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFdlYmtpdEJveE9yaWVudDogdmFsdWUuaW5kZXhPZignY29sdW1uJykgPiAtMSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCcsXG4gICAgICBXZWJraXRCb3hEaXJlY3Rpb246IHZhbHVlLmluZGV4T2YoJ3JldmVyc2UnKSA+IC0xID8gJ3JldmVyc2UnIDogJ25vcm1hbCdcbiAgICB9O1xuICB9XG4gIGlmIChhbHRlcm5hdGl2ZVByb3BzW3Byb3BlcnR5XSkge1xuICAgIHJldHVybiBfZGVmaW5lUHJvcGVydHkoe30sIGFsdGVybmF0aXZlUHJvcHNbcHJvcGVydHldLCBhbHRlcm5hdGl2ZVZhbHVlc1t2YWx1ZV0gfHwgdmFsdWUpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBncmFkaWVudDtcblxudmFyIF9qb2luUHJlZml4ZWRWYWx1ZSA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2pvaW5QcmVmaXhlZFZhbHVlJyk7XG5cbnZhciBfam9pblByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfam9pblByZWZpeGVkVmFsdWUpO1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZSA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2lzUHJlZml4ZWRWYWx1ZScpO1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1ByZWZpeGVkVmFsdWUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgdmFsdWVzID0gL2xpbmVhci1ncmFkaWVudHxyYWRpYWwtZ3JhZGllbnR8cmVwZWF0aW5nLWxpbmVhci1ncmFkaWVudHxyZXBlYXRpbmctcmFkaWFsLWdyYWRpZW50LztcblxuZnVuY3Rpb24gZ3JhZGllbnQocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICEoMCwgX2lzUHJlZml4ZWRWYWx1ZTIuZGVmYXVsdCkodmFsdWUpICYmIHZhbHVlLm1hdGNoKHZhbHVlcykgIT09IG51bGwpIHtcbiAgICByZXR1cm4gKDAsIF9qb2luUHJlZml4ZWRWYWx1ZTIuZGVmYXVsdCkocHJvcGVydHksIHZhbHVlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gcG9zaXRpb247XG5mdW5jdGlvbiBwb3NpdGlvbihwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKHByb3BlcnR5ID09PSAncG9zaXRpb24nICYmIHZhbHVlID09PSAnc3RpY2t5Jykge1xuICAgIHJldHVybiB7IHBvc2l0aW9uOiBbJy13ZWJraXQtc3RpY2t5JywgJ3N0aWNreSddIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHNpemluZztcblxudmFyIF9qb2luUHJlZml4ZWRWYWx1ZSA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2pvaW5QcmVmaXhlZFZhbHVlJyk7XG5cbnZhciBfam9pblByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfam9pblByZWZpeGVkVmFsdWUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgcHJvcGVydGllcyA9IHtcbiAgbWF4SGVpZ2h0OiB0cnVlLFxuICBtYXhXaWR0aDogdHJ1ZSxcbiAgd2lkdGg6IHRydWUsXG4gIGhlaWdodDogdHJ1ZSxcbiAgY29sdW1uV2lkdGg6IHRydWUsXG4gIG1pbldpZHRoOiB0cnVlLFxuICBtaW5IZWlnaHQ6IHRydWVcbn07XG52YXIgdmFsdWVzID0ge1xuICAnbWluLWNvbnRlbnQnOiB0cnVlLFxuICAnbWF4LWNvbnRlbnQnOiB0cnVlLFxuICAnZmlsbC1hdmFpbGFibGUnOiB0cnVlLFxuICAnZml0LWNvbnRlbnQnOiB0cnVlLFxuICAnY29udGFpbi1mbG9hdHMnOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBzaXppbmcocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChwcm9wZXJ0aWVzW3Byb3BlcnR5XSAmJiB2YWx1ZXNbdmFsdWVdKSB7XG4gICAgcmV0dXJuICgwLCBfam9pblByZWZpeGVkVmFsdWUyLmRlZmF1bHQpKHByb3BlcnR5LCB2YWx1ZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRyYW5zaXRpb247XG5cbnZhciBfaHlwaGVuYXRlU3R5bGVOYW1lID0gcmVxdWlyZSgnaHlwaGVuYXRlLXN0eWxlLW5hbWUnKTtcblxudmFyIF9oeXBoZW5hdGVTdHlsZU5hbWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaHlwaGVuYXRlU3R5bGVOYW1lKTtcblxudmFyIF9jYXBpdGFsaXplU3RyaW5nID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvY2FwaXRhbGl6ZVN0cmluZycpO1xuXG52YXIgX2NhcGl0YWxpemVTdHJpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2FwaXRhbGl6ZVN0cmluZyk7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvaXNQcmVmaXhlZFZhbHVlJyk7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUHJlZml4ZWRWYWx1ZSk7XG5cbnZhciBfcHJlZml4UHJvcHMgPSByZXF1aXJlKCcuLi9wcmVmaXhQcm9wcycpO1xuXG52YXIgX3ByZWZpeFByb3BzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ByZWZpeFByb3BzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIHByb3BlcnRpZXMgPSB7XG4gIHRyYW5zaXRpb246IHRydWUsXG4gIHRyYW5zaXRpb25Qcm9wZXJ0eTogdHJ1ZSxcbiAgV2Via2l0VHJhbnNpdGlvbjogdHJ1ZSxcbiAgV2Via2l0VHJhbnNpdGlvblByb3BlcnR5OiB0cnVlXG59O1xuXG5mdW5jdGlvbiB0cmFuc2l0aW9uKHByb3BlcnR5LCB2YWx1ZSkge1xuICAvLyBhbHNvIGNoZWNrIGZvciBhbHJlYWR5IHByZWZpeGVkIHRyYW5zaXRpb25zXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHByb3BlcnRpZXNbcHJvcGVydHldKSB7XG4gICAgdmFyIF9yZWYyO1xuXG4gICAgdmFyIG91dHB1dFZhbHVlID0gcHJlZml4VmFsdWUodmFsdWUpO1xuICAgIHZhciB3ZWJraXRPdXRwdXQgPSBvdXRwdXRWYWx1ZS5zcGxpdCgvLCg/IVteKCldKig/OlxcKFteKCldKlxcKSk/XFwpKS9nKS5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUubWF0Y2goLy1tb3otfC1tcy0vKSA9PT0gbnVsbDtcbiAgICB9KS5qb2luKCcsJyk7XG5cbiAgICAvLyBpZiB0aGUgcHJvcGVydHkgaXMgYWxyZWFkeSBwcmVmaXhlZFxuICAgIGlmIChwcm9wZXJ0eS5pbmRleE9mKCdXZWJraXQnKSA+IC0xKSB7XG4gICAgICByZXR1cm4gX2RlZmluZVByb3BlcnR5KHt9LCBwcm9wZXJ0eSwgd2Via2l0T3V0cHV0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3JlZjIgPSB7fSwgX2RlZmluZVByb3BlcnR5KF9yZWYyLCAnV2Via2l0JyArICgwLCBfY2FwaXRhbGl6ZVN0cmluZzIuZGVmYXVsdCkocHJvcGVydHkpLCB3ZWJraXRPdXRwdXQpLCBfZGVmaW5lUHJvcGVydHkoX3JlZjIsIHByb3BlcnR5LCBvdXRwdXRWYWx1ZSksIF9yZWYyO1xuICB9XG59XG5cbmZ1bmN0aW9uIHByZWZpeFZhbHVlKHZhbHVlKSB7XG4gIGlmICgoMCwgX2lzUHJlZml4ZWRWYWx1ZTIuZGVmYXVsdCkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLy8gb25seSBzcGxpdCBtdWx0aSB2YWx1ZXMsIG5vdCBjdWJpYyBiZXppZXJzXG4gIHZhciBtdWx0aXBsZVZhbHVlcyA9IHZhbHVlLnNwbGl0KC8sKD8hW14oKV0qKD86XFwoW14oKV0qXFwpKT9cXCkpL2cpO1xuXG4gIC8vIGl0ZXJhdGUgZWFjaCBzaW5nbGUgdmFsdWUgYW5kIGNoZWNrIGZvciB0cmFuc2l0aW9uZWQgcHJvcGVydGllc1xuICAvLyB0aGF0IG5lZWQgdG8gYmUgcHJlZml4ZWQgYXMgd2VsbFxuICBtdWx0aXBsZVZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWwsIGluZGV4KSB7XG4gICAgbXVsdGlwbGVWYWx1ZXNbaW5kZXhdID0gT2JqZWN0LmtleXMoX3ByZWZpeFByb3BzMi5kZWZhdWx0KS5yZWR1Y2UoZnVuY3Rpb24gKG91dCwgcHJlZml4KSB7XG4gICAgICB2YXIgZGFzaENhc2VQcmVmaXggPSAnLScgKyBwcmVmaXgudG9Mb3dlckNhc2UoKSArICctJztcblxuICAgICAgT2JqZWN0LmtleXMoX3ByZWZpeFByb3BzMi5kZWZhdWx0W3ByZWZpeF0pLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgdmFyIGRhc2hDYXNlUHJvcGVydHkgPSAoMCwgX2h5cGhlbmF0ZVN0eWxlTmFtZTIuZGVmYXVsdCkocHJvcCk7XG5cbiAgICAgICAgaWYgKHZhbC5pbmRleE9mKGRhc2hDYXNlUHJvcGVydHkpID4gLTEgJiYgZGFzaENhc2VQcm9wZXJ0eSAhPT0gJ29yZGVyJykge1xuICAgICAgICAgIC8vIGpvaW4gYWxsIHByZWZpeGVzIGFuZCBjcmVhdGUgYSBuZXcgdmFsdWVcbiAgICAgICAgICBvdXQgPSB2YWwucmVwbGFjZShkYXNoQ2FzZVByb3BlcnR5LCBkYXNoQ2FzZVByZWZpeCArIGRhc2hDYXNlUHJvcGVydHkpICsgJywnICsgb3V0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSwgdmFsKTtcbiAgfSk7XG5cbiAgcmV0dXJuIG11bHRpcGxlVmFsdWVzLmpvaW4oJywnKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHByZWZpeEFsbDtcblxudmFyIF9wcmVmaXhQcm9wcyA9IHJlcXVpcmUoJy4vcHJlZml4UHJvcHMnKTtcblxudmFyIF9wcmVmaXhQcm9wczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcmVmaXhQcm9wcyk7XG5cbnZhciBfY2FwaXRhbGl6ZVN0cmluZyA9IHJlcXVpcmUoJy4uL3V0aWxzL2NhcGl0YWxpemVTdHJpbmcnKTtcblxudmFyIF9jYXBpdGFsaXplU3RyaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NhcGl0YWxpemVTdHJpbmcpO1xuXG52YXIgX3NvcnRQcmVmaXhlZFN0eWxlID0gcmVxdWlyZSgnLi4vdXRpbHMvc29ydFByZWZpeGVkU3R5bGUnKTtcblxudmFyIF9zb3J0UHJlZml4ZWRTdHlsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zb3J0UHJlZml4ZWRTdHlsZSk7XG5cbnZhciBfcG9zaXRpb24gPSByZXF1aXJlKCcuL3BsdWdpbnMvcG9zaXRpb24nKTtcblxudmFyIF9wb3NpdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wb3NpdGlvbik7XG5cbnZhciBfY2FsYyA9IHJlcXVpcmUoJy4vcGx1Z2lucy9jYWxjJyk7XG5cbnZhciBfY2FsYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWxjKTtcblxudmFyIF9jdXJzb3IgPSByZXF1aXJlKCcuL3BsdWdpbnMvY3Vyc29yJyk7XG5cbnZhciBfY3Vyc29yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2N1cnNvcik7XG5cbnZhciBfZmxleCA9IHJlcXVpcmUoJy4vcGx1Z2lucy9mbGV4Jyk7XG5cbnZhciBfZmxleDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mbGV4KTtcblxudmFyIF9zaXppbmcgPSByZXF1aXJlKCcuL3BsdWdpbnMvc2l6aW5nJyk7XG5cbnZhciBfc2l6aW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NpemluZyk7XG5cbnZhciBfZ3JhZGllbnQgPSByZXF1aXJlKCcuL3BsdWdpbnMvZ3JhZGllbnQnKTtcblxudmFyIF9ncmFkaWVudDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ncmFkaWVudCk7XG5cbnZhciBfdHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vcGx1Z2lucy90cmFuc2l0aW9uJyk7XG5cbnZhciBfdHJhbnNpdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90cmFuc2l0aW9uKTtcblxudmFyIF9mbGV4Ym94SUUgPSByZXF1aXJlKCcuL3BsdWdpbnMvZmxleGJveElFJyk7XG5cbnZhciBfZmxleGJveElFMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ZsZXhib3hJRSk7XG5cbnZhciBfZmxleGJveE9sZCA9IHJlcXVpcmUoJy4vcGx1Z2lucy9mbGV4Ym94T2xkJyk7XG5cbnZhciBfZmxleGJveE9sZDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mbGV4Ym94T2xkKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLy8gc3BlY2lhbCBmbGV4Ym94IHNwZWNpZmljYXRpb25zXG5cblxudmFyIHBsdWdpbnMgPSBbX3Bvc2l0aW9uMi5kZWZhdWx0LCBfY2FsYzIuZGVmYXVsdCwgX2N1cnNvcjIuZGVmYXVsdCwgX3NpemluZzIuZGVmYXVsdCwgX2dyYWRpZW50Mi5kZWZhdWx0LCBfdHJhbnNpdGlvbjIuZGVmYXVsdCwgX2ZsZXhib3hJRTIuZGVmYXVsdCwgX2ZsZXhib3hPbGQyLmRlZmF1bHQsIF9mbGV4Mi5kZWZhdWx0XTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgcHJlZml4ZWQgdmVyc2lvbiBvZiB0aGUgc3R5bGUgb2JqZWN0IHVzaW5nIGFsbCB2ZW5kb3IgcHJlZml4ZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZXMgLSBTdHlsZSBvYmplY3QgdGhhdCBnZXRzIHByZWZpeGVkIHByb3BlcnRpZXMgYWRkZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IC0gU3R5bGUgb2JqZWN0IHdpdGggcHJlZml4ZWQgcHJvcGVydGllcyBhbmQgdmFsdWVzXG4gKi9cbmZ1bmN0aW9uIHByZWZpeEFsbChzdHlsZXMpIHtcbiAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgIHZhciB2YWx1ZSA9IHN0eWxlc1twcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgLy8gcmVjdXJzZSB0aHJvdWdoIG5lc3RlZCBzdHlsZSBvYmplY3RzXG4gICAgICBzdHlsZXNbcHJvcGVydHldID0gcHJlZml4QWxsKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXMoX3ByZWZpeFByb3BzMi5kZWZhdWx0KS5mb3JFYWNoKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBfcHJlZml4UHJvcHMyLmRlZmF1bHRbcHJlZml4XTtcbiAgICAgICAgLy8gYWRkIHByZWZpeGVzIGlmIG5lZWRlZFxuICAgICAgICBpZiAocHJvcGVydGllc1twcm9wZXJ0eV0pIHtcbiAgICAgICAgICBzdHlsZXNbcHJlZml4ICsgKDAsIF9jYXBpdGFsaXplU3RyaW5nMi5kZWZhdWx0KShwcm9wZXJ0eSldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgT2JqZWN0LmtleXMoc3R5bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgIFtdLmNvbmNhdChzdHlsZXNbcHJvcGVydHldKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIC8vIHJlc29sdmUgZXZlcnkgc3BlY2lhbCBwbHVnaW5zXG4gICAgICBwbHVnaW5zLmZvckVhY2goZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgICByZXR1cm4gYXNzaWduU3R5bGVzKHN0eWxlcywgcGx1Z2luKHByb3BlcnR5LCB2YWx1ZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiAoMCwgX3NvcnRQcmVmaXhlZFN0eWxlMi5kZWZhdWx0KShzdHlsZXMpO1xufVxuXG5mdW5jdGlvbiBhc3NpZ25TdHlsZXMoYmFzZSkge1xuICB2YXIgZXh0ZW5kID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG5cbiAgT2JqZWN0LmtleXMoZXh0ZW5kKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgIHZhciBiYXNlVmFsdWUgPSBiYXNlW3Byb3BlcnR5XTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShiYXNlVmFsdWUpKSB7XG4gICAgICBbXS5jb25jYXQoZXh0ZW5kW3Byb3BlcnR5XSkuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIHZhbHVlSW5kZXggPSBiYXNlVmFsdWUuaW5kZXhPZih2YWx1ZSk7XG4gICAgICAgIGlmICh2YWx1ZUluZGV4ID4gLTEpIHtcbiAgICAgICAgICBiYXNlW3Byb3BlcnR5XS5zcGxpY2UodmFsdWVJbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgYmFzZVtwcm9wZXJ0eV0ucHVzaCh2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYmFzZVtwcm9wZXJ0eV0gPSBleHRlbmRbcHJvcGVydHldO1xuICAgIH1cbiAgfSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHsgXCJXZWJraXRcIjogeyBcInRyYW5zZm9ybVwiOiB0cnVlLCBcInRyYW5zZm9ybU9yaWdpblwiOiB0cnVlLCBcInRyYW5zZm9ybU9yaWdpblhcIjogdHJ1ZSwgXCJ0cmFuc2Zvcm1PcmlnaW5ZXCI6IHRydWUsIFwiYmFja2ZhY2VWaXNpYmlsaXR5XCI6IHRydWUsIFwicGVyc3BlY3RpdmVcIjogdHJ1ZSwgXCJwZXJzcGVjdGl2ZU9yaWdpblwiOiB0cnVlLCBcInRyYW5zZm9ybVN0eWxlXCI6IHRydWUsIFwidHJhbnNmb3JtT3JpZ2luWlwiOiB0cnVlLCBcImFuaW1hdGlvblwiOiB0cnVlLCBcImFuaW1hdGlvbkRlbGF5XCI6IHRydWUsIFwiYW5pbWF0aW9uRGlyZWN0aW9uXCI6IHRydWUsIFwiYW5pbWF0aW9uRmlsbE1vZGVcIjogdHJ1ZSwgXCJhbmltYXRpb25EdXJhdGlvblwiOiB0cnVlLCBcImFuaW1hdGlvbkl0ZXJhdGlvbkNvdW50XCI6IHRydWUsIFwiYW5pbWF0aW9uTmFtZVwiOiB0cnVlLCBcImFuaW1hdGlvblBsYXlTdGF0ZVwiOiB0cnVlLCBcImFuaW1hdGlvblRpbWluZ0Z1bmN0aW9uXCI6IHRydWUsIFwiYXBwZWFyYW5jZVwiOiB0cnVlLCBcInVzZXJTZWxlY3RcIjogdHJ1ZSwgXCJmb250S2VybmluZ1wiOiB0cnVlLCBcInRleHRFbXBoYXNpc1Bvc2l0aW9uXCI6IHRydWUsIFwidGV4dEVtcGhhc2lzXCI6IHRydWUsIFwidGV4dEVtcGhhc2lzU3R5bGVcIjogdHJ1ZSwgXCJ0ZXh0RW1waGFzaXNDb2xvclwiOiB0cnVlLCBcImJveERlY29yYXRpb25CcmVha1wiOiB0cnVlLCBcImNsaXBQYXRoXCI6IHRydWUsIFwibWFza0ltYWdlXCI6IHRydWUsIFwibWFza01vZGVcIjogdHJ1ZSwgXCJtYXNrUmVwZWF0XCI6IHRydWUsIFwibWFza1Bvc2l0aW9uXCI6IHRydWUsIFwibWFza0NsaXBcIjogdHJ1ZSwgXCJtYXNrT3JpZ2luXCI6IHRydWUsIFwibWFza1NpemVcIjogdHJ1ZSwgXCJtYXNrQ29tcG9zaXRlXCI6IHRydWUsIFwibWFza1wiOiB0cnVlLCBcIm1hc2tCb3JkZXJTb3VyY2VcIjogdHJ1ZSwgXCJtYXNrQm9yZGVyTW9kZVwiOiB0cnVlLCBcIm1hc2tCb3JkZXJTbGljZVwiOiB0cnVlLCBcIm1hc2tCb3JkZXJXaWR0aFwiOiB0cnVlLCBcIm1hc2tCb3JkZXJPdXRzZXRcIjogdHJ1ZSwgXCJtYXNrQm9yZGVyUmVwZWF0XCI6IHRydWUsIFwibWFza0JvcmRlclwiOiB0cnVlLCBcIm1hc2tUeXBlXCI6IHRydWUsIFwidGV4dERlY29yYXRpb25TdHlsZVwiOiB0cnVlLCBcInRleHREZWNvcmF0aW9uU2tpcFwiOiB0cnVlLCBcInRleHREZWNvcmF0aW9uTGluZVwiOiB0cnVlLCBcInRleHREZWNvcmF0aW9uQ29sb3JcIjogdHJ1ZSwgXCJmaWx0ZXJcIjogdHJ1ZSwgXCJmb250RmVhdHVyZVNldHRpbmdzXCI6IHRydWUsIFwiYnJlYWtBZnRlclwiOiB0cnVlLCBcImJyZWFrQmVmb3JlXCI6IHRydWUsIFwiYnJlYWtJbnNpZGVcIjogdHJ1ZSwgXCJjb2x1bW5Db3VudFwiOiB0cnVlLCBcImNvbHVtbkZpbGxcIjogdHJ1ZSwgXCJjb2x1bW5HYXBcIjogdHJ1ZSwgXCJjb2x1bW5SdWxlXCI6IHRydWUsIFwiY29sdW1uUnVsZUNvbG9yXCI6IHRydWUsIFwiY29sdW1uUnVsZVN0eWxlXCI6IHRydWUsIFwiY29sdW1uUnVsZVdpZHRoXCI6IHRydWUsIFwiY29sdW1uc1wiOiB0cnVlLCBcImNvbHVtblNwYW5cIjogdHJ1ZSwgXCJjb2x1bW5XaWR0aFwiOiB0cnVlLCBcImZsZXhcIjogdHJ1ZSwgXCJmbGV4QmFzaXNcIjogdHJ1ZSwgXCJmbGV4RGlyZWN0aW9uXCI6IHRydWUsIFwiZmxleEdyb3dcIjogdHJ1ZSwgXCJmbGV4Rmxvd1wiOiB0cnVlLCBcImZsZXhTaHJpbmtcIjogdHJ1ZSwgXCJmbGV4V3JhcFwiOiB0cnVlLCBcImFsaWduQ29udGVudFwiOiB0cnVlLCBcImFsaWduSXRlbXNcIjogdHJ1ZSwgXCJhbGlnblNlbGZcIjogdHJ1ZSwgXCJqdXN0aWZ5Q29udGVudFwiOiB0cnVlLCBcIm9yZGVyXCI6IHRydWUsIFwidHJhbnNpdGlvblwiOiB0cnVlLCBcInRyYW5zaXRpb25EZWxheVwiOiB0cnVlLCBcInRyYW5zaXRpb25EdXJhdGlvblwiOiB0cnVlLCBcInRyYW5zaXRpb25Qcm9wZXJ0eVwiOiB0cnVlLCBcInRyYW5zaXRpb25UaW1pbmdGdW5jdGlvblwiOiB0cnVlLCBcImJhY2tkcm9wRmlsdGVyXCI6IHRydWUsIFwic2Nyb2xsU25hcFR5cGVcIjogdHJ1ZSwgXCJzY3JvbGxTbmFwUG9pbnRzWFwiOiB0cnVlLCBcInNjcm9sbFNuYXBQb2ludHNZXCI6IHRydWUsIFwic2Nyb2xsU25hcERlc3RpbmF0aW9uXCI6IHRydWUsIFwic2Nyb2xsU25hcENvb3JkaW5hdGVcIjogdHJ1ZSwgXCJzaGFwZUltYWdlVGhyZXNob2xkXCI6IHRydWUsIFwic2hhcGVJbWFnZU1hcmdpblwiOiB0cnVlLCBcInNoYXBlSW1hZ2VPdXRzaWRlXCI6IHRydWUsIFwiaHlwaGVuc1wiOiB0cnVlLCBcImZsb3dJbnRvXCI6IHRydWUsIFwiZmxvd0Zyb21cIjogdHJ1ZSwgXCJyZWdpb25GcmFnbWVudFwiOiB0cnVlLCBcInRleHRTaXplQWRqdXN0XCI6IHRydWUgfSwgXCJNb3pcIjogeyBcImFwcGVhcmFuY2VcIjogdHJ1ZSwgXCJ1c2VyU2VsZWN0XCI6IHRydWUsIFwiYm94U2l6aW5nXCI6IHRydWUsIFwidGV4dEFsaWduTGFzdFwiOiB0cnVlLCBcInRleHREZWNvcmF0aW9uU3R5bGVcIjogdHJ1ZSwgXCJ0ZXh0RGVjb3JhdGlvblNraXBcIjogdHJ1ZSwgXCJ0ZXh0RGVjb3JhdGlvbkxpbmVcIjogdHJ1ZSwgXCJ0ZXh0RGVjb3JhdGlvbkNvbG9yXCI6IHRydWUsIFwidGFiU2l6ZVwiOiB0cnVlLCBcImh5cGhlbnNcIjogdHJ1ZSwgXCJmb250RmVhdHVyZVNldHRpbmdzXCI6IHRydWUsIFwiYnJlYWtBZnRlclwiOiB0cnVlLCBcImJyZWFrQmVmb3JlXCI6IHRydWUsIFwiYnJlYWtJbnNpZGVcIjogdHJ1ZSwgXCJjb2x1bW5Db3VudFwiOiB0cnVlLCBcImNvbHVtbkZpbGxcIjogdHJ1ZSwgXCJjb2x1bW5HYXBcIjogdHJ1ZSwgXCJjb2x1bW5SdWxlXCI6IHRydWUsIFwiY29sdW1uUnVsZUNvbG9yXCI6IHRydWUsIFwiY29sdW1uUnVsZVN0eWxlXCI6IHRydWUsIFwiY29sdW1uUnVsZVdpZHRoXCI6IHRydWUsIFwiY29sdW1uc1wiOiB0cnVlLCBcImNvbHVtblNwYW5cIjogdHJ1ZSwgXCJjb2x1bW5XaWR0aFwiOiB0cnVlIH0sIFwibXNcIjogeyBcImZsZXhcIjogdHJ1ZSwgXCJmbGV4QmFzaXNcIjogZmFsc2UsIFwiZmxleERpcmVjdGlvblwiOiB0cnVlLCBcImZsZXhHcm93XCI6IGZhbHNlLCBcImZsZXhGbG93XCI6IHRydWUsIFwiZmxleFNocmlua1wiOiBmYWxzZSwgXCJmbGV4V3JhcFwiOiB0cnVlLCBcImFsaWduQ29udGVudFwiOiBmYWxzZSwgXCJhbGlnbkl0ZW1zXCI6IGZhbHNlLCBcImFsaWduU2VsZlwiOiBmYWxzZSwgXCJqdXN0aWZ5Q29udGVudFwiOiBmYWxzZSwgXCJvcmRlclwiOiBmYWxzZSwgXCJ0cmFuc2Zvcm1cIjogdHJ1ZSwgXCJ0cmFuc2Zvcm1PcmlnaW5cIjogdHJ1ZSwgXCJ0cmFuc2Zvcm1PcmlnaW5YXCI6IHRydWUsIFwidHJhbnNmb3JtT3JpZ2luWVwiOiB0cnVlLCBcInVzZXJTZWxlY3RcIjogdHJ1ZSwgXCJ3cmFwRmxvd1wiOiB0cnVlLCBcIndyYXBUaHJvdWdoXCI6IHRydWUsIFwid3JhcE1hcmdpblwiOiB0cnVlLCBcInNjcm9sbFNuYXBUeXBlXCI6IHRydWUsIFwic2Nyb2xsU25hcFBvaW50c1hcIjogdHJ1ZSwgXCJzY3JvbGxTbmFwUG9pbnRzWVwiOiB0cnVlLCBcInNjcm9sbFNuYXBEZXN0aW5hdGlvblwiOiB0cnVlLCBcInNjcm9sbFNuYXBDb29yZGluYXRlXCI6IHRydWUsIFwidG91Y2hBY3Rpb25cIjogdHJ1ZSwgXCJoeXBoZW5zXCI6IHRydWUsIFwiZmxvd0ludG9cIjogdHJ1ZSwgXCJmbG93RnJvbVwiOiB0cnVlLCBcImJyZWFrQmVmb3JlXCI6IHRydWUsIFwiYnJlYWtBZnRlclwiOiB0cnVlLCBcImJyZWFrSW5zaWRlXCI6IHRydWUsIFwicmVnaW9uRnJhZ21lbnRcIjogdHJ1ZSwgXCJncmlkVGVtcGxhdGVDb2x1bW5zXCI6IHRydWUsIFwiZ3JpZFRlbXBsYXRlUm93c1wiOiB0cnVlLCBcImdyaWRUZW1wbGF0ZUFyZWFzXCI6IHRydWUsIFwiZ3JpZFRlbXBsYXRlXCI6IHRydWUsIFwiZ3JpZEF1dG9Db2x1bW5zXCI6IHRydWUsIFwiZ3JpZEF1dG9Sb3dzXCI6IHRydWUsIFwiZ3JpZEF1dG9GbG93XCI6IHRydWUsIFwiZ3JpZFwiOiB0cnVlLCBcImdyaWRSb3dTdGFydFwiOiB0cnVlLCBcImdyaWRDb2x1bW5TdGFydFwiOiB0cnVlLCBcImdyaWRSb3dFbmRcIjogdHJ1ZSwgXCJncmlkUm93XCI6IHRydWUsIFwiZ3JpZENvbHVtblwiOiB0cnVlLCBcImdyaWRDb2x1bW5FbmRcIjogdHJ1ZSwgXCJncmlkQ29sdW1uR2FwXCI6IHRydWUsIFwiZ3JpZFJvd0dhcFwiOiB0cnVlLCBcImdyaWRBcmVhXCI6IHRydWUsIFwiZ3JpZEdhcFwiOiB0cnVlLCBcInRleHRTaXplQWRqdXN0XCI6IHRydWUgfSB9O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbi8vIGhlbHBlciB0byBjYXBpdGFsaXplIHN0cmluZ3NcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gIHJldHVybiBwcm9wZXJ0eS5tYXRjaCgvXihXZWJraXR8TW96fE98bXMpLykgIT09IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkgdmFsdWUgPSB2YWx1ZS5qb2luKCcsJyk7XG5cbiAgcmV0dXJuIHZhbHVlLm1hdGNoKC8td2Via2l0LXwtbW96LXwtbXMtLykgIT09IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbi8vIHJldHVybnMgYSBzdHlsZSBvYmplY3Qgd2l0aCBhIHNpbmdsZSBjb25jYXRlZCBwcmVmaXhlZCB2YWx1ZSBzdHJpbmdcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHByb3BlcnR5LCB2YWx1ZSkge1xuICB2YXIgcmVwbGFjZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAocHJlZml4LCB2YWx1ZSkge1xuICAgIHJldHVybiBwcmVmaXggKyB2YWx1ZTtcbiAgfSA6IGFyZ3VtZW50c1syXTtcbiAgcmV0dXJuIF9kZWZpbmVQcm9wZXJ0eSh7fSwgcHJvcGVydHksIFsnLXdlYmtpdC0nLCAnLW1vei0nLCAnJ10ubWFwKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICByZXR1cm4gcmVwbGFjZXIocHJlZml4LCB2YWx1ZSk7XG4gIH0pKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHNvcnRQcmVmaXhlZFN0eWxlO1xuXG52YXIgX2lzUHJlZml4ZWRQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vaXNQcmVmaXhlZFByb3BlcnR5Jyk7XG5cbnZhciBfaXNQcmVmaXhlZFByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUHJlZml4ZWRQcm9wZXJ0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIHNvcnRQcmVmaXhlZFN0eWxlKHN0eWxlKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzdHlsZSkuc29ydChmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHtcbiAgICBpZiAoKDAsIF9pc1ByZWZpeGVkUHJvcGVydHkyLmRlZmF1bHQpKGxlZnQpICYmICEoMCwgX2lzUHJlZml4ZWRQcm9wZXJ0eTIuZGVmYXVsdCkocmlnaHQpKSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfSBlbHNlIGlmICghKDAsIF9pc1ByZWZpeGVkUHJvcGVydHkyLmRlZmF1bHQpKGxlZnQpICYmICgwLCBfaXNQcmVmaXhlZFByb3BlcnR5Mi5kZWZhdWx0KShyaWdodCkpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfSkucmVkdWNlKGZ1bmN0aW9uIChzb3J0ZWRTdHlsZSwgcHJvcCkge1xuICAgIHNvcnRlZFN0eWxlW3Byb3BdID0gc3R5bGVbcHJvcF07XG4gICAgcmV0dXJuIHNvcnRlZFN0eWxlO1xuICB9LCB7fSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL3N0YXRpYy9wcmVmaXhBbGwnKVxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuICB2YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcbiAgdmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gcmVxdWlyZSgnLi9saWIvUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcbiAgdmFyIGxvZ2dlZFR5cGVGYWlsdXJlcyA9IHt9O1xufVxuXG4vKipcbiAqIEFzc2VydCB0aGF0IHRoZSB2YWx1ZXMgbWF0Y2ggd2l0aCB0aGUgdHlwZSBzcGVjcy5cbiAqIEVycm9yIG1lc3NhZ2VzIGFyZSBtZW1vcml6ZWQgYW5kIHdpbGwgb25seSBiZSBzaG93biBvbmNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSB0eXBlU3BlY3MgTWFwIG9mIG5hbWUgdG8gYSBSZWFjdFByb3BUeXBlXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIFJ1bnRpbWUgdmFsdWVzIHRoYXQgbmVlZCB0byBiZSB0eXBlLWNoZWNrZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbiBlLmcuIFwicHJvcFwiLCBcImNvbnRleHRcIiwgXCJjaGlsZCBjb250ZXh0XCJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnROYW1lIE5hbWUgb2YgdGhlIGNvbXBvbmVudCBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcGFyYW0gez9GdW5jdGlvbn0gZ2V0U3RhY2sgUmV0dXJucyB0aGUgY29tcG9uZW50IHN0YWNrLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBjb21wb25lbnROYW1lLCBnZXRTdGFjaykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGZvciAodmFyIHR5cGVTcGVjTmFtZSBpbiB0eXBlU3BlY3MpIHtcbiAgICAgIGlmICh0eXBlU3BlY3MuaGFzT3duUHJvcGVydHkodHlwZVNwZWNOYW1lKSkge1xuICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgIC8vIFByb3AgdHlwZSB2YWxpZGF0aW9uIG1heSB0aHJvdy4gSW4gY2FzZSB0aGV5IGRvLCB3ZSBkb24ndCB3YW50IHRvXG4gICAgICAgIC8vIGZhaWwgdGhlIHJlbmRlciBwaGFzZSB3aGVyZSBpdCBkaWRuJ3QgZmFpbCBiZWZvcmUuIFNvIHdlIGxvZyBpdC5cbiAgICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgaW50ZW50aW9uYWxseSBhbiBpbnZhcmlhbnQgdGhhdCBnZXRzIGNhdWdodC4gSXQncyB0aGUgc2FtZVxuICAgICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgICBpbnZhcmlhbnQodHlwZW9mIHR5cGVTcGVjc1t0eXBlU3BlY05hbWVdID09PSAnZnVuY3Rpb24nLCAnJXM6ICVzIHR5cGUgYCVzYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSAnICsgJ1JlYWN0LlByb3BUeXBlcy4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIGxvY2F0aW9uLCB0eXBlU3BlY05hbWUpO1xuICAgICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgZXJyb3IgPSBleDtcbiAgICAgICAgfVxuICAgICAgICB3YXJuaW5nKCFlcnJvciB8fCBlcnJvciBpbnN0YW5jZW9mIEVycm9yLCAnJXM6IHR5cGUgc3BlY2lmaWNhdGlvbiBvZiAlcyBgJXNgIGlzIGludmFsaWQ7IHRoZSB0eXBlIGNoZWNrZXIgJyArICdmdW5jdGlvbiBtdXN0IHJldHVybiBgbnVsbGAgb3IgYW4gYEVycm9yYCBidXQgcmV0dXJuZWQgYSAlcy4gJyArICdZb3UgbWF5IGhhdmUgZm9yZ290dGVuIHRvIHBhc3MgYW4gYXJndW1lbnQgdG8gdGhlIHR5cGUgY2hlY2tlciAnICsgJ2NyZWF0b3IgKGFycmF5T2YsIGluc3RhbmNlT2YsIG9iamVjdE9mLCBvbmVPZiwgb25lT2ZUeXBlLCBhbmQgJyArICdzaGFwZSBhbGwgcmVxdWlyZSBhbiBhcmd1bWVudCkuJywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBsb2NhdGlvbiwgdHlwZVNwZWNOYW1lLCB0eXBlb2YgZXJyb3IpO1xuICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciAmJiAhKGVycm9yLm1lc3NhZ2UgaW4gbG9nZ2VkVHlwZUZhaWx1cmVzKSkge1xuICAgICAgICAgIC8vIE9ubHkgbW9uaXRvciB0aGlzIGZhaWx1cmUgb25jZSBiZWNhdXNlIHRoZXJlIHRlbmRzIHRvIGJlIGEgbG90IG9mIHRoZVxuICAgICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgICAgbG9nZ2VkVHlwZUZhaWx1cmVzW2Vycm9yLm1lc3NhZ2VdID0gdHJ1ZTtcblxuICAgICAgICAgIHZhciBzdGFjayA9IGdldFN0YWNrID8gZ2V0U3RhY2soKSA6ICcnO1xuXG4gICAgICAgICAgd2FybmluZyhmYWxzZSwgJ0ZhaWxlZCAlcyB0eXBlOiAlcyVzJywgbG9jYXRpb24sIGVycm9yLm1lc3NhZ2UsIHN0YWNrICE9IG51bGwgPyBzdGFjayA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrUHJvcFR5cGVzO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5RnVuY3Rpb24nKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIHNoaW0ocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBzZWNyZXQpIHtcbiAgICBpZiAoc2VjcmV0ID09PSBSZWFjdFByb3BUeXBlc1NlY3JldCkge1xuICAgICAgLy8gSXQgaXMgc3RpbGwgc2FmZSB3aGVuIGNhbGxlZCBmcm9tIFJlYWN0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpbnZhcmlhbnQoXG4gICAgICBmYWxzZSxcbiAgICAgICdDYWxsaW5nIFByb3BUeXBlcyB2YWxpZGF0b3JzIGRpcmVjdGx5IGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGBwcm9wLXR5cGVzYCBwYWNrYWdlLiAnICtcbiAgICAgICdVc2UgUHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzKCkgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICk7XG4gIH07XG4gIHNoaW0uaXNSZXF1aXJlZCA9IHNoaW07XG4gIGZ1bmN0aW9uIGdldFNoaW0oKSB7XG4gICAgcmV0dXJuIHNoaW07XG4gIH07XG4gIC8vIEltcG9ydGFudCFcbiAgLy8gS2VlcCB0aGlzIGxpc3QgaW4gc3luYyB3aXRoIHByb2R1Y3Rpb24gdmVyc2lvbiBpbiBgLi9mYWN0b3J5V2l0aFR5cGVDaGVja2Vycy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogc2hpbSxcbiAgICBib29sOiBzaGltLFxuICAgIGZ1bmM6IHNoaW0sXG4gICAgbnVtYmVyOiBzaGltLFxuICAgIG9iamVjdDogc2hpbSxcbiAgICBzdHJpbmc6IHNoaW0sXG4gICAgc3ltYm9sOiBzaGltLFxuXG4gICAgYW55OiBzaGltLFxuICAgIGFycmF5T2Y6IGdldFNoaW0sXG4gICAgZWxlbWVudDogc2hpbSxcbiAgICBpbnN0YW5jZU9mOiBnZXRTaGltLFxuICAgIG5vZGU6IHNoaW0sXG4gICAgb2JqZWN0T2Y6IGdldFNoaW0sXG4gICAgb25lT2Y6IGdldFNoaW0sXG4gICAgb25lT2ZUeXBlOiBnZXRTaGltLFxuICAgIHNoYXBlOiBnZXRTaGltXG4gIH07XG5cbiAgUmVhY3RQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMgPSBlbXB0eUZ1bmN0aW9uO1xuICBSZWFjdFByb3BUeXBlcy5Qcm9wVHlwZXMgPSBSZWFjdFByb3BUeXBlcztcblxuICByZXR1cm4gUmVhY3RQcm9wVHlwZXM7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJ2ZianMvbGliL2VtcHR5RnVuY3Rpb24nKTtcbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSByZXF1aXJlKCcuL2xpYi9SZWFjdFByb3BUeXBlc1NlY3JldCcpO1xudmFyIGNoZWNrUHJvcFR5cGVzID0gcmVxdWlyZSgnLi9jaGVja1Byb3BUeXBlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlzVmFsaWRFbGVtZW50LCB0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gIC8qIGdsb2JhbCBTeW1ib2wgKi9cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7IC8vIEJlZm9yZSBTeW1ib2wgc3BlYy5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICAgKlxuICAgKiBCZSBzdXJlIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgaXRlcmFibGUgYXMgY29udGV4dDpcbiAgICpcbiAgICogICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihteUl0ZXJhYmxlKTtcbiAgICogICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAgICogICAgICAgLi4uXG4gICAqICAgICB9XG4gICAqXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbWF5YmVJdGVyYWJsZVxuICAgKiBAcmV0dXJuIHs/ZnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3Rpb24gb2YgbWV0aG9kcyB0aGF0IGFsbG93IGRlY2xhcmF0aW9uIGFuZCB2YWxpZGF0aW9uIG9mIHByb3BzIHRoYXQgYXJlXG4gICAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gICAqXG4gICAqICAgdmFyIFByb3BzID0gcmVxdWlyZSgnUmVhY3RQcm9wVHlwZXMnKTtcbiAgICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgKiAgICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgIC8vIEFuIG9wdGlvbmFsIHN0cmluZyBwcm9wIG5hbWVkIFwiZGVzY3JpcHRpb25cIi5cbiAgICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAgICpcbiAgICogICAgICAgLy8gQSByZXF1aXJlZCBlbnVtIHByb3AgbmFtZWQgXCJjYXRlZ29yeVwiLlxuICAgKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gICAqXG4gICAqICAgICAgIC8vIEEgcHJvcCBuYW1lZCBcImRpYWxvZ1wiIHRoYXQgcmVxdWlyZXMgYW4gaW5zdGFuY2Ugb2YgRGlhbG9nLlxuICAgKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gICAqICAgICB9LFxuICAgKiAgICAgcmVuZGVyOiBmdW5jdGlvbigpIHsgLi4uIH1cbiAgICogICB9KTtcbiAgICpcbiAgICogQSBtb3JlIGZvcm1hbCBzcGVjaWZpY2F0aW9uIG9mIGhvdyB0aGVzZSBtZXRob2RzIGFyZSB1c2VkOlxuICAgKlxuICAgKiAgIHR5cGUgOj0gYXJyYXl8Ym9vbHxmdW5jfG9iamVjdHxudW1iZXJ8c3RyaW5nfG9uZU9mKFsuLi5dKXxpbnN0YW5jZU9mKC4uLilcbiAgICogICBkZWNsIDo9IFJlYWN0UHJvcFR5cGVzLnt0eXBlfSguaXNSZXF1aXJlZCk/XG4gICAqXG4gICAqIEVhY2ggYW5kIGV2ZXJ5IGRlY2xhcmF0aW9uIHByb2R1Y2VzIGEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUuIFRoaXNcbiAgICogYWxsb3dzIHRoZSBjcmVhdGlvbiBvZiBjdXN0b20gdmFsaWRhdGlvbiBmdW5jdGlvbnMuIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiAgdmFyIE15TGluayA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICogICAgcHJvcFR5cGVzOiB7XG4gICAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICAgKiAgICAgIGhyZWY6IGZ1bmN0aW9uKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSkge1xuICAgKiAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICAgKiAgICAgICAgICAgICEocHJvcFZhbHVlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgKiAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKFxuICAgKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gICAqICAgICAgICAgICAgY29tcG9uZW50TmFtZVxuICAgKiAgICAgICAgICApO1xuICAgKiAgICAgICAgfVxuICAgKiAgICAgIH1cbiAgICogICAgfSxcbiAgICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gICAqICB9KTtcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuXG4gIHZhciBBTk9OWU1PVVMgPSAnPDxhbm9ueW1vdXM+Pic7XG5cbiAgLy8gSW1wb3J0YW50IVxuICAvLyBLZWVwIHRoaXMgbGlzdCBpbiBzeW5jIHdpdGggcHJvZHVjdGlvbiB2ZXJzaW9uIGluIGAuL2ZhY3RvcnlXaXRoVGhyb3dpbmdTaGltcy5qc2AuXG4gIHZhciBSZWFjdFByb3BUeXBlcyA9IHtcbiAgICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gICAgYm9vbDogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Jvb2xlYW4nKSxcbiAgICBmdW5jOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignZnVuY3Rpb24nKSxcbiAgICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgICBvYmplY3Q6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdvYmplY3QnKSxcbiAgICBzdHJpbmc6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzdHJpbmcnKSxcbiAgICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICAgIGFueTogY3JlYXRlQW55VHlwZUNoZWNrZXIoKSxcbiAgICBhcnJheU9mOiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIsXG4gICAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gICAgaW5zdGFuY2VPZjogY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcixcbiAgICBub2RlOiBjcmVhdGVOb2RlQ2hlY2tlcigpLFxuICAgIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICAgIG9uZU9mOiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIsXG4gICAgb25lT2ZUeXBlOiBjcmVhdGVVbmlvblR5cGVDaGVja2VyLFxuICAgIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyXG4gIH07XG5cbiAgLyoqXG4gICAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzXG4gICAqL1xuICAvKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG4gIGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgaWYgKHggPT09IHkpIHtcbiAgICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gICAgfVxuICB9XG4gIC8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4gIC8qKlxuICAgKiBXZSB1c2UgYW4gRXJyb3ItbGlrZSBvYmplY3QgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgYXMgcGVvcGxlIG1heSBjYWxsXG4gICAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIsIHdlIGRvbid0IHVzZSByZWFsXG4gICAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAgICogaXMgcHJvaGliaXRpdmVseSBleHBlbnNpdmUgaWYgdGhleSBhcmUgY3JlYXRlZCB0b28gb2Z0ZW4sIHN1Y2ggYXMgd2hhdFxuICAgKiBoYXBwZW5zIGluIG9uZU9mVHlwZSgpIGZvciBhbnkgdHlwZSBiZWZvcmUgdGhlIG9uZSB0aGF0IG1hdGNoZWQuXG4gICAqL1xuICBmdW5jdGlvbiBQcm9wVHlwZUVycm9yKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMuc3RhY2sgPSAnJztcbiAgfVxuICAvLyBNYWtlIGBpbnN0YW5jZW9mIEVycm9yYCBzdGlsbCB3b3JrIGZvciByZXR1cm5lZCBlcnJvcnMuXG4gIFByb3BUeXBlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhciBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZSA9IHt9O1xuICAgICAgdmFyIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50ID0gMDtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICBjb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG5cbiAgICAgIGlmIChzZWNyZXQgIT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0KSB7XG4gICAgICAgIGlmICh0aHJvd09uRGlyZWN0QWNjZXNzKSB7XG4gICAgICAgICAgLy8gTmV3IGJlaGF2aW9yIG9ubHkgZm9yIHVzZXJzIG9mIGBwcm9wLXR5cGVzYCBwYWNrYWdlXG4gICAgICAgICAgaW52YXJpYW50KFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAnQ2FsbGluZyBQcm9wVHlwZXMgdmFsaWRhdG9ycyBkaXJlY3RseSBpcyBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAnVXNlIGBQcm9wVHlwZXMuY2hlY2tQcm9wVHlwZXMoKWAgdG8gY2FsbCB0aGVtLiAnICtcbiAgICAgICAgICAgICdSZWFkIG1vcmUgYXQgaHR0cDovL2ZiLm1lL3VzZS1jaGVjay1wcm9wLXR5cGVzJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAvLyBPbGQgYmVoYXZpb3IgZm9yIHBlb3BsZSB1c2luZyBSZWFjdC5Qcm9wVHlwZXNcbiAgICAgICAgICB2YXIgY2FjaGVLZXkgPSBjb21wb25lbnROYW1lICsgJzonICsgcHJvcE5hbWU7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIW1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSAmJlxuICAgICAgICAgICAgLy8gQXZvaWQgc3BhbW1pbmcgdGhlIGNvbnNvbGUgYmVjYXVzZSB0aGV5IGFyZSBvZnRlbiBub3QgYWN0aW9uYWJsZSBleGNlcHQgZm9yIGxpYiBhdXRob3JzXG4gICAgICAgICAgICBtYW51YWxQcm9wVHlwZVdhcm5pbmdDb3VudCA8IDNcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHdhcm5pbmcoXG4gICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAnWW91IGFyZSBtYW51YWxseSBjYWxsaW5nIGEgUmVhY3QuUHJvcFR5cGVzIHZhbGlkYXRpb24gJyArXG4gICAgICAgICAgICAgICdmdW5jdGlvbiBmb3IgdGhlIGAlc2AgcHJvcCBvbiBgJXNgLiBUaGlzIGlzIGRlcHJlY2F0ZWQgJyArXG4gICAgICAgICAgICAgICdhbmQgd2lsbCB0aHJvdyBpbiB0aGUgc3RhbmRhbG9uZSBgcHJvcC10eXBlc2AgcGFja2FnZS4gJyArXG4gICAgICAgICAgICAgICdZb3UgbWF5IGJlIHNlZWluZyB0aGlzIHdhcm5pbmcgZHVlIHRvIGEgdGhpcmQtcGFydHkgUHJvcFR5cGVzICcgK1xuICAgICAgICAgICAgICAnbGlicmFyeS4gU2VlIGh0dHBzOi8vZmIubWUvcmVhY3Qtd2FybmluZy1kb250LWNhbGwtcHJvcHR5cGVzICcgKyAnZm9yIGRldGFpbHMuJyxcbiAgICAgICAgICAgICAgcHJvcEZ1bGxOYW1lLFxuICAgICAgICAgICAgICBjb21wb25lbnROYW1lXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldID0gdHJ1ZTtcbiAgICAgICAgICAgIG1hbnVhbFByb3BUeXBlV2FybmluZ0NvdW50Kys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09IG51bGwpIHtcbiAgICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgICBpZiAocHJvcHNbcHJvcE5hbWVdID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1RoZSAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2AgaXMgbWFya2VkIGFzIHJlcXVpcmVkICcgKyAoJ2luIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBidXQgaXRzIHZhbHVlIGlzIGBudWxsYC4nKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignVGhlICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBpcyBtYXJrZWQgYXMgcmVxdWlyZWQgaW4gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGJ1dCBpdHMgdmFsdWUgaXMgYHVuZGVmaW5lZGAuJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGNoYWluZWRDaGVja1R5cGUgPSBjaGVja1R5cGUuYmluZChudWxsLCBmYWxzZSk7XG4gICAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gY2hhaW5lZENoZWNrVHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKGV4cGVjdGVkVHlwZSkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgc2VjcmV0KSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgIC8vIGBwcm9wVmFsdWVgIGJlaW5nIGluc3RhbmNlIG9mLCBzYXksIGRhdGUvcmVnZXhwLCBwYXNzIHRoZSAnb2JqZWN0J1xuICAgICAgICAvLyBjaGVjaywgYnV0IHdlIGNhbiBvZmZlciBhIG1vcmUgcHJlY2lzZSBlcnJvciBtZXNzYWdlIGhlcmUgcmF0aGVyIHRoYW5cbiAgICAgICAgLy8gJ29mIHR5cGUgYG9iamVjdGAnLlxuICAgICAgICB2YXIgcHJlY2lzZVR5cGUgPSBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByZWNpc2VUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdgJyArIGV4cGVjdGVkVHlwZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQW55VHlwZUNoZWNrZXIoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcih0eXBlQ2hlY2tlcikge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ1Byb3BlcnR5IGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgY29tcG9uZW50IGAnICsgY29tcG9uZW50TmFtZSArICdgIGhhcyBpbnZhbGlkIFByb3BUeXBlIG5vdGF0aW9uIGluc2lkZSBhcnJheU9mLicpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIGFycmF5LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwgaSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSArICdbJyArIGkgKyAnXScsIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGlmICghaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIHNpbmdsZSBSZWFjdEVsZW1lbnQuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVJbnN0YW5jZVR5cGVDaGVja2VyKGV4cGVjdGVkQ2xhc3MpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICAgIHZhciBleHBlY3RlZENsYXNzTmFtZSA9IGV4cGVjdGVkQ2xhc3MubmFtZSB8fCBBTk9OWU1PVVM7XG4gICAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgYWN0dWFsQ2xhc3NOYW1lICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdpbnN0YW5jZSBvZiBgJyArIGV4cGVjdGVkQ2xhc3NOYW1lICsgJ2AuJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVFbnVtVHlwZUNoZWNrZXIoZXhwZWN0ZWRWYWx1ZXMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2YsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwZWN0ZWRWYWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGlzKHByb3BWYWx1ZSwgZXhwZWN0ZWRWYWx1ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlc1N0cmluZyA9IEpTT04uc3RyaW5naWZ5KGV4cGVjdGVkVmFsdWVzKTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgb2JqZWN0T2YuJyk7XG4gICAgICB9XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbiArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gb2JqZWN0LicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wVmFsdWUpIHtcbiAgICAgICAgaWYgKHByb3BWYWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVVbmlvblR5cGVDaGVja2VyKGFycmF5T2ZUeXBlQ2hlY2tlcnMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlPZlR5cGVDaGVja2VycykpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgICAgcmV0dXJuIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgaWYgKHR5cGVvZiBjaGVja2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHdhcm5pbmcoXG4gICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZCB0byBvbmVPZlR5cGUuIEV4cGVjdGVkIGFuIGFycmF5IG9mIGNoZWNrIGZ1bmN0aW9ucywgYnV0ICcgK1xuICAgICAgICAgICdyZWNlaXZlZCAlcyBhdCBpbmRleCAlcy4nLFxuICAgICAgICAgIGdldFBvc3RmaXhGb3JUeXBlV2FybmluZyhjaGVja2VyKSxcbiAgICAgICAgICBpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hlY2tlciA9IGFycmF5T2ZUeXBlQ2hlY2tlcnNbaV07XG4gICAgICAgIGlmIChjaGVja2VyKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSwgUmVhY3RQcm9wVHlwZXNTZWNyZXQpID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU5vZGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCFpc05vZGUocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb24gKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSBgJyArIHByb3BUeXBlICsgJ2AgJyArICgnc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGBvYmplY3RgLicpKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGtleSBpbiBzaGFwZVR5cGVzKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gc2hhcGVUeXBlc1trZXldO1xuICAgICAgICBpZiAoIWNoZWNrZXIpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXJyb3IgPSBjaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5LCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc05vZGUocHJvcFZhbHVlKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcFZhbHVlID09PSBudWxsIHx8IGlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbikge1xuICAgICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChwcm9wVmFsdWUpO1xuICAgICAgICAgIHZhciBzdGVwO1xuICAgICAgICAgIGlmIChpdGVyYXRvckZuICE9PSBwcm9wVmFsdWUuZW50cmllcykge1xuICAgICAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpIHtcbiAgICAvLyBOYXRpdmUgU3ltYm9sLlxuICAgIGlmIChwcm9wVHlwZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ10gPT09ICdTeW1ib2wnXG4gICAgaWYgKHByb3BWYWx1ZVsnQEB0b1N0cmluZ1RhZyddID09PSAnU3ltYm9sJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2sgZm9yIG5vbi1zcGVjIGNvbXBsaWFudCBTeW1ib2xzIHdoaWNoIGFyZSBwb2x5ZmlsbGVkLlxuICAgIGlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHByb3BWYWx1ZSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gRXF1aXZhbGVudCBvZiBgdHlwZW9mYCBidXQgd2l0aCBzcGVjaWFsIGhhbmRsaW5nIGZvciBhcnJheSBhbmQgcmVnZXhwLlxuICBmdW5jdGlvbiBnZXRQcm9wVHlwZShwcm9wVmFsdWUpIHtcbiAgICB2YXIgcHJvcFR5cGUgPSB0eXBlb2YgcHJvcFZhbHVlO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAnYXJyYXknO1xuICAgIH1cbiAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAvLyBPbGQgd2Via2l0cyAoYXQgbGVhc3QgdW50aWwgQW5kcm9pZCA0LjApIHJldHVybiAnZnVuY3Rpb24nIHJhdGhlciB0aGFuXG4gICAgICAvLyAnb2JqZWN0JyBmb3IgdHlwZW9mIGEgUmVnRXhwLiBXZSdsbCBub3JtYWxpemUgdGhpcyBoZXJlIHNvIHRoYXQgL2JsYS9cbiAgICAgIC8vIHBhc3NlcyBQcm9wVHlwZXMub2JqZWN0LlxuICAgICAgcmV0dXJuICdvYmplY3QnO1xuICAgIH1cbiAgICBpZiAoaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAnc3ltYm9sJztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgLy8gVGhpcyBoYW5kbGVzIG1vcmUgdHlwZXMgdGhhbiBgZ2V0UHJvcFR5cGVgLiBPbmx5IHVzZWQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICAvLyBTZWUgYGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyYC5cbiAgZnVuY3Rpb24gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9wVmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IHByb3BWYWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuICcnICsgcHJvcFZhbHVlO1xuICAgIH1cbiAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgIGlmIChwcm9wVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHJldHVybiAnZGF0ZSc7XG4gICAgICB9IGVsc2UgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICByZXR1cm4gJ3JlZ2V4cCc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIC8vIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyBwb3N0Zml4ZWQgdG8gYSB3YXJuaW5nIGFib3V0IGFuIGludmFsaWQgdHlwZS5cbiAgLy8gRm9yIGV4YW1wbGUsIFwidW5kZWZpbmVkXCIgb3IgXCJvZiB0eXBlIGFycmF5XCJcbiAgZnVuY3Rpb24gZ2V0UG9zdGZpeEZvclR5cGVXYXJuaW5nKHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSBnZXRQcmVjaXNlVHlwZSh2YWx1ZSk7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdhcnJheSc6XG4gICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICByZXR1cm4gJ2FuICcgKyB0eXBlO1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgIGNhc2UgJ3JlZ2V4cCc6XG4gICAgICAgIHJldHVybiAnYSAnICsgdHlwZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybnMgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0LCBpZiBhbnkuXG4gIGZ1bmN0aW9uIGdldENsYXNzTmFtZShwcm9wVmFsdWUpIHtcbiAgICBpZiAoIXByb3BWYWx1ZS5jb25zdHJ1Y3RvciB8fCAhcHJvcFZhbHVlLmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICAgIHJldHVybiBBTk9OWU1PVVM7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZTtcbiAgfVxuXG4gIFJlYWN0UHJvcFR5cGVzLmNoZWNrUHJvcFR5cGVzID0gY2hlY2tQcm9wVHlwZXM7XG4gIFJlYWN0UHJvcFR5cGVzLlByb3BUeXBlcyA9IFJlYWN0UHJvcFR5cGVzO1xuXG4gIHJldHVybiBSZWFjdFByb3BUeXBlcztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiZcbiAgICBTeW1ib2wuZm9yICYmXG4gICAgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpKSB8fFxuICAgIDB4ZWFjNztcblxuICB2YXIgaXNWYWxpZEVsZW1lbnQgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIG9iamVjdCAhPT0gbnVsbCAmJlxuICAgICAgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEU7XG4gIH07XG5cbiAgLy8gQnkgZXhwbGljaXRseSB1c2luZyBgcHJvcC10eXBlc2AgeW91IGFyZSBvcHRpbmcgaW50byBuZXcgZGV2ZWxvcG1lbnQgYmVoYXZpb3IuXG4gIC8vIGh0dHA6Ly9mYi5tZS9wcm9wLXR5cGVzLWluLXByb2RcbiAgdmFyIHRocm93T25EaXJlY3RBY2Nlc3MgPSB0cnVlO1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZmFjdG9yeVdpdGhUeXBlQ2hlY2tlcnMnKShpc1ZhbGlkRWxlbWVudCwgdGhyb3dPbkRpcmVjdEFjY2Vzcyk7XG59IGVsc2Uge1xuICAvLyBCeSBleHBsaWNpdGx5IHVzaW5nIGBwcm9wLXR5cGVzYCB5b3UgYXJlIG9wdGluZyBpbnRvIG5ldyBwcm9kdWN0aW9uIGJlaGF2aW9yLlxuICAvLyBodHRwOi8vZmIubWUvcHJvcC10eXBlcy1pbi1wcm9kXG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9mYWN0b3J5V2l0aFRocm93aW5nU2hpbXMnKSgpO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RQcm9wVHlwZXNTZWNyZXQgPSAnU0VDUkVUX0RPX05PVF9QQVNTX1RISVNfT1JfWU9VX1dJTExfQkVfRklSRUQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzU2VjcmV0O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBjc3MsIFN0eWxlU2hlZXQgfSBmcm9tICdhcGhyb2RpdGUvbm8taW1wb3J0YW50JztcblxuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4uL3RoZW1lJztcbmltcG9ydCB7IGRlZXBNZXJnZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBJY29uIGZyb20gJy4vSWNvbic7XG5cbmZ1bmN0aW9uIEFycm93ICh7XG5cdGRpcmVjdGlvbixcblx0aWNvbixcblx0b25DbGljayxcblx0c2l6ZSxcblx0Li4ucHJvcHMsXG59LFxue1xuXHR0aGVtZSxcbn0pIHtcblx0Y29uc3QgY2xhc3NlcyA9IFN0eWxlU2hlZXQuY3JlYXRlKGRlZXBNZXJnZShkZWZhdWx0U3R5bGVzLCB0aGVtZSkpO1xuXG5cdHJldHVybiAoXG5cdFx0PGJ1dHRvblxuXHRcdFx0dHlwZT1cImJ1dHRvblwiXG5cdFx0XHRjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmFycm93LCBjbGFzc2VzWydhcnJvd19fZGlyZWN0aW9uX18nICsgZGlyZWN0aW9uXSwgc2l6ZSAmJiBjbGFzc2VzWydhcnJvd19fc2l6ZV9fJyArIHNpemVdKX1cblx0XHRcdG9uQ2xpY2s9e29uQ2xpY2t9XG5cdFx0XHRvblRvdWNoRW5kPXtvbkNsaWNrfVxuXHRcdFx0ey4uLnByb3BzfVxuXHRcdD5cblx0XHRcdDxJY29uIGZpbGw9eyEhdGhlbWUuYXJyb3cgJiYgdGhlbWUuYXJyb3cuZmlsbCB8fCBkZWZhdWx0cy5hcnJvdy5maWxsfSB0eXBlPXtpY29ufSAvPlxuXHRcdDwvYnV0dG9uPlxuXHQpO1xufTtcblxuQXJyb3cucHJvcFR5cGVzID0ge1xuXHRkaXJlY3Rpb246IFByb3BUeXBlcy5vbmVPZihbJ2xlZnQnLCAncmlnaHQnXSksXG5cdGljb246IFByb3BUeXBlcy5zdHJpbmcsXG5cdG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdHNpemU6IFByb3BUeXBlcy5vbmVPZihbJ21lZGl1bScsICdzbWFsbCddKS5pc1JlcXVpcmVkLFxufTtcbkFycm93LmRlZmF1bHRQcm9wcyA9IHtcblx0c2l6ZTogJ21lZGl1bScsXG59O1xuQXJyb3cuY29udGV4dFR5cGVzID0ge1xuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuY29uc3QgZGVmYXVsdFN0eWxlcyA9IHtcblx0YXJyb3c6IHtcblx0XHRiYWNrZ3JvdW5kOiAnbm9uZScsXG5cdFx0Ym9yZGVyOiAnbm9uZScsXG5cdFx0Ym9yZGVyUmFkaXVzOiA0LFxuXHRcdGN1cnNvcjogJ3BvaW50ZXInLFxuXHRcdG91dGxpbmU6ICdub25lJyxcblx0XHRwYWRkaW5nOiAxMCwgLy8gaW5jcmVhc2UgaGl0IGFyZWFcblx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHR0b3A6ICc1MCUnLFxuXG5cdFx0Ly8gZGlzYWJsZSB1c2VyIHNlbGVjdFxuXHRcdFdlYmtpdFRvdWNoQ2FsbG91dDogJ25vbmUnLFxuXHRcdHVzZXJTZWxlY3Q6ICdub25lJyxcblx0fSxcblxuXHQvLyBzaXplZXNcblx0YXJyb3dfX3NpemVfX21lZGl1bToge1xuXHRcdGhlaWdodDogZGVmYXVsdHMuYXJyb3cuaGVpZ2h0LFxuXHRcdG1hcmdpblRvcDogZGVmYXVsdHMuYXJyb3cuaGVpZ2h0IC8gLTIsXG5cdFx0d2lkdGg6IDQwLFxuXG5cdFx0J0BtZWRpYSAobWluLXdpZHRoOiA3NjhweCknOiB7XG5cdFx0XHR3aWR0aDogNzAsXG5cdFx0fSxcblx0fSxcblx0YXJyb3dfX3NpemVfX3NtYWxsOiB7XG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50aHVtYm5haWwuc2l6ZSxcblx0XHRtYXJnaW5Ub3A6IGRlZmF1bHRzLnRodW1ibmFpbC5zaXplIC8gLTIsXG5cdFx0d2lkdGg6IDMwLFxuXG5cdFx0J0BtZWRpYSAobWluLXdpZHRoOiA1MDBweCknOiB7XG5cdFx0XHR3aWR0aDogNDAsXG5cdFx0fSxcblx0fSxcblxuXHQvLyBkaXJlY3Rpb25cblx0YXJyb3dfX2RpcmVjdGlvbl9fcmlnaHQ6IHtcblx0XHRyaWdodDogZGVmYXVsdHMuY29udGFpbmVyLmd1dHRlci5ob3Jpem9udGFsLFxuXHR9LFxuXHRhcnJvd19fZGlyZWN0aW9uX19sZWZ0OiB7XG5cdFx0bGVmdDogZGVmYXVsdHMuY29udGFpbmVyLmd1dHRlci5ob3Jpem9udGFsLFxuXHR9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJvdztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgY3NzLCBTdHlsZVNoZWV0IH0gZnJvbSAnYXBocm9kaXRlL25vLWltcG9ydGFudCc7XG5cbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi90aGVtZSc7XG5pbXBvcnQgeyBkZWVwTWVyZ2UgfSBmcm9tICcuLi91dGlscyc7XG5cbmZ1bmN0aW9uIENvbnRhaW5lciAoeyAuLi5wcm9wcyB9LCB7IHRoZW1lIH0pIHtcblx0Y29uc3QgY2xhc3NlcyA9IFN0eWxlU2hlZXQuY3JlYXRlKGRlZXBNZXJnZShkZWZhdWx0U3R5bGVzLCB0aGVtZSkpO1xuXG5cdHJldHVybiAoXG5cdFx0PGRpdlxuXHRcdFx0Y2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5jb250YWluZXIpfVxuXHRcdFx0ey4uLnByb3BzfVxuXHRcdC8+XG5cdCk7XG59O1xuXG5Db250YWluZXIuY29udGV4dFR5cGVzID0ge1xuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuY29uc3QgZGVmYXVsdFN0eWxlcyA9IHtcblx0Y29udGFpbmVyOiB7XG5cdFx0YWxpZ25JdGVtczogJ2NlbnRlcicsXG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5jb250YWluZXIuYmFja2dyb3VuZCxcblx0XHRib3hTaXppbmc6ICdib3JkZXItYm94Jyxcblx0XHRkaXNwbGF5OiAnZmxleCcsXG5cdFx0aGVpZ2h0OiAnMTAwJScsXG5cdFx0anVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuXHRcdGxlZnQ6IDAsXG5cdFx0cGFkZGluZ0JvdHRvbTogZGVmYXVsdHMuY29udGFpbmVyLmd1dHRlci52ZXJ0aWNhbCxcblx0XHRwYWRkaW5nTGVmdDogZGVmYXVsdHMuY29udGFpbmVyLmd1dHRlci5ob3Jpem9udGFsLFxuXHRcdHBhZGRpbmdSaWdodDogZGVmYXVsdHMuY29udGFpbmVyLmd1dHRlci5ob3Jpem9udGFsLFxuXHRcdHBhZGRpbmdUb3A6IGRlZmF1bHRzLmNvbnRhaW5lci5ndXR0ZXIudmVydGljYWwsXG5cdFx0cG9zaXRpb246ICdmaXhlZCcsXG5cdFx0dG9wOiAwLFxuXHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0ekluZGV4OiBkZWZhdWx0cy5jb250YWluZXIuekluZGV4LFxuXHR9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250YWluZXI7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IGNzcywgU3R5bGVTaGVldCB9IGZyb20gJ2FwaHJvZGl0ZS9uby1pbXBvcnRhbnQnO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4uL3RoZW1lJztcbmltcG9ydCB7IGRlZXBNZXJnZSB9IGZyb20gJy4uL3V0aWxzJztcblxuZnVuY3Rpb24gRm9vdGVyICh7XG5cdGNhcHRpb24sXG5cdGNvdW50Q3VycmVudCxcblx0Y291bnRTZXBhcmF0b3IsXG5cdGNvdW50VG90YWwsXG5cdHNob3dDb3VudCxcblx0Li4ucHJvcHMsXG59LCB7XG5cdHRoZW1lLFxufSkge1xuXHRpZiAoIWNhcHRpb24gJiYgIXNob3dDb3VudCkgcmV0dXJuIG51bGw7XG5cblx0Y29uc3QgY2xhc3NlcyA9IFN0eWxlU2hlZXQuY3JlYXRlKGRlZXBNZXJnZShkZWZhdWx0U3R5bGVzLCB0aGVtZSkpO1xuXG5cdGNvbnN0IGltYWdlQ291bnQgPSBzaG93Q291bnQgPyAoXG5cdFx0PGRpdiBjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmZvb3RlckNvdW50KX0+XG5cdFx0XHR7Y291bnRDdXJyZW50fVxuXHRcdFx0e2NvdW50U2VwYXJhdG9yfVxuXHRcdFx0e2NvdW50VG90YWx9XG5cdFx0PC9kaXY+KVxuXHRcdDogPHNwYW4gLz47XG5cblx0cmV0dXJuIChcblx0XHQ8ZGl2IGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuZm9vdGVyKX0gey4uLnByb3BzfT5cblx0XHRcdHtjYXB0aW9uID8gKFxuXHRcdFx0XHQ8ZmlnY2FwdGlvbiBjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmZvb3RlckNhcHRpb24pfT5cblx0XHRcdFx0XHR7Y2FwdGlvbn1cblx0XHRcdFx0PC9maWdjYXB0aW9uPlxuXHRcdFx0KSA6IDxzcGFuIC8+fVxuXHRcdFx0e2ltYWdlQ291bnR9XG5cdFx0PC9kaXY+XG5cdCk7XG59O1xuXG5Gb290ZXIucHJvcFR5cGVzID0ge1xuXHRjYXB0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMuZWxlbWVudF0pLFxuXHRjb3VudEN1cnJlbnQ6IFByb3BUeXBlcy5udW1iZXIsXG5cdGNvdW50U2VwYXJhdG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuXHRjb3VudFRvdGFsOiBQcm9wVHlwZXMubnVtYmVyLFxuXHRzaG93Q291bnQ6IFByb3BUeXBlcy5ib29sLFxufTtcbkZvb3Rlci5jb250ZXh0VHlwZXMgPSB7XG5cdHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5jb25zdCBkZWZhdWx0U3R5bGVzID0ge1xuXHRmb290ZXI6IHtcblx0XHRib3hTaXppbmc6ICdib3JkZXItYm94Jyxcblx0XHRjb2xvcjogZGVmYXVsdHMuZm9vdGVyLmNvbG9yLFxuXHRcdGN1cnNvcjogJ2F1dG8nLFxuXHRcdGRpc3BsYXk6ICdmbGV4Jyxcblx0XHRqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxuXHRcdGxlZnQ6IDAsXG5cdFx0bGluZUhlaWdodDogMS4zLFxuXHRcdHBhZGRpbmdCb3R0b206IGRlZmF1bHRzLmZvb3Rlci5ndXR0ZXIudmVydGljYWwsXG5cdFx0cGFkZGluZ0xlZnQ6IGRlZmF1bHRzLmZvb3Rlci5ndXR0ZXIuaG9yaXpvbnRhbCxcblx0XHRwYWRkaW5nUmlnaHQ6IGRlZmF1bHRzLmZvb3Rlci5ndXR0ZXIuaG9yaXpvbnRhbCxcblx0XHRwYWRkaW5nVG9wOiBkZWZhdWx0cy5mb290ZXIuZ3V0dGVyLnZlcnRpY2FsLFxuXHR9LFxuXHRmb290ZXJDb3VudDoge1xuXHRcdGNvbG9yOiBkZWZhdWx0cy5mb290ZXIuY291bnQuY29sb3IsXG5cdFx0Zm9udFNpemU6IGRlZmF1bHRzLmZvb3Rlci5jb3VudC5mb250U2l6ZSxcblx0XHRwYWRkaW5nTGVmdDogJzFlbScsIC8vIGFkZCBhIHNtYWxsIGd1dHRlciBmb3IgdGhlIGNhcHRpb25cblx0fSxcblx0Zm9vdGVyQ2FwdGlvbjoge1xuXHRcdGZsZXg6ICcxIDEgMCcsXG5cdH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvb3RlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgY3NzLCBTdHlsZVNoZWV0IH0gZnJvbSAnYXBocm9kaXRlL25vLWltcG9ydGFudCc7XG5cbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuLi90aGVtZSc7XG5pbXBvcnQgeyBkZWVwTWVyZ2UgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgSWNvbiBmcm9tICcuL0ljb24nO1xuXG5mdW5jdGlvbiBIZWFkZXIgKHtcblx0Y3VzdG9tQ29udHJvbHMsXG5cdG9uQ2xvc2UsXG5cdG9uUm90YXRlLFxuXHRzaG93Q2xvc2VCdXR0b24sXG5cdHNob3dSb3RhdGVCdXR0b24sXG5cdGNsb3NlQnV0dG9uVGl0bGUsXG5cdHJvdGF0ZUJ1dHRvblRpdGxlLFxuXHQuLi5wcm9wcyxcbn0sIHtcblx0dGhlbWUsXG59KSB7XG5cdGNvbnN0IGNsYXNzZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZShkZWVwTWVyZ2UoZGVmYXVsdFN0eWxlcywgdGhlbWUpKTtcblxuXHRyZXR1cm4gKFxuXHRcdDxkaXYgY2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5oZWFkZXIpfSB7Li4ucHJvcHN9PlxuXHRcdFx0eyEhc2hvd1JvdGF0ZUJ1dHRvbiAmJiAoXG5cdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHR0aXRsZT17cm90YXRlQnV0dG9uVGl0bGV9XG5cdFx0XHRcdFx0Y2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5yb3RhdGUpfVxuXHRcdFx0XHRcdG9uQ2xpY2s9e29uUm90YXRlfVxuXHRcdFx0XHQ+XG5cdFx0XHRcdFx0PEljb24gZmlsbD17ISF0aGVtZS5yb3RhdGUgJiYgdGhlbWUucm90YXRlLmZpbGwgfHwgZGVmYXVsdHMucm90YXRlLmZpbGx9IHR5cGU9XCJyb3RhdGVcIiAvPlxuXHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdCl9XG5cdFx0XHR7Y3VzdG9tQ29udHJvbHMgPyBjdXN0b21Db250cm9scyA6IDxzcGFuIC8+fVxuXHRcdFx0eyEhc2hvd0Nsb3NlQnV0dG9uICYmIChcblx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdHRpdGxlPXtjbG9zZUJ1dHRvblRpdGxlfVxuXHRcdFx0XHRcdGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuY2xvc2UpfVxuXHRcdFx0XHRcdG9uQ2xpY2s9e29uQ2xvc2V9XG5cdFx0XHRcdD5cblx0XHRcdFx0XHQ8SWNvbiBmaWxsPXshIXRoZW1lLmNsb3NlICYmIHRoZW1lLmNsb3NlLmZpbGwgfHwgZGVmYXVsdHMuY2xvc2UuZmlsbH0gdHlwZT1cImNsb3NlXCIgLz5cblx0XHRcdFx0PC9idXR0b24+XG5cdFx0XHQpfVxuXHRcdDwvZGl2PlxuXHQpO1xufTtcblxuSGVhZGVyLnByb3BUeXBlcyA9IHtcblx0Y3VzdG9tQ29udHJvbHM6IFByb3BUeXBlcy5hcnJheSxcblx0b25DbG9zZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblx0c2hvd0Nsb3NlQnV0dG9uOiBQcm9wVHlwZXMuYm9vbCxcbn07XG5IZWFkZXIuY29udGV4dFR5cGVzID0ge1xuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxufTtcblxuY29uc3QgZGVmYXVsdFN0eWxlcyA9IHtcblx0aGVhZGVyOiB7XG5cdFx0ZGlzcGxheTogJ2ZsZXgnLFxuXHRcdGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy5oZWFkZXIuaGVpZ2h0LFxuXHR9LFxuXHRjbG9zZToge1xuXHRcdGJhY2tncm91bmQ6ICdub25lJyxcblx0XHRib3JkZXI6ICdub25lJyxcblx0XHRjdXJzb3I6ICdwb2ludGVyJyxcblx0XHRvdXRsaW5lOiAnbm9uZScsXG5cdFx0cG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdFx0dG9wOiAwLFxuXHRcdHZlcnRpY2FsQWxpZ246ICdib3R0b20nLFxuXG5cdFx0Ly8gaW5jcmVhc2UgaGl0IGFyZWFcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLmNsb3NlLmhlaWdodCArIDIwLFxuXHRcdG1hcmdpblJpZ2h0OiAtMTAsXG5cdFx0cGFkZGluZzogMTAsXG5cdFx0d2lkdGg6IGRlZmF1bHRzLmNsb3NlLndpZHRoICsgMjAsXG5cdH0sXG5cdHJvdGF0ZToge1xuXHRcdGJhY2tncm91bmQ6ICdub25lJyxcblx0XHRib3JkZXI6ICdub25lJyxcblx0XHRjdXJzb3I6ICdwb2ludGVyJyxcblx0XHRvdXRsaW5lOiAnbm9uZScsXG5cdFx0cG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdFx0dG9wOiAwLFxuXHRcdHZlcnRpY2FsQWxpZ246ICdib3R0b20nLFxuXG5cdFx0Ly8gaW5jcmVhc2UgaGl0IGFyZWFcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLmNsb3NlLmhlaWdodCArIDIwLFxuXHRcdG1hcmdpbkxlZnQ6IC0xMCxcblx0XHRwYWRkaW5nOiAxMCxcblx0XHR3aWR0aDogZGVmYXVsdHMuY2xvc2Uud2lkdGggKyAyMCxcblx0fSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSGVhZGVyO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgaWNvbnMgZnJvbSAnLi4vaWNvbnMnO1xuXG5jb25zdCBJY29uID0gKHsgZmlsbCwgdHlwZSwgLi4ucHJvcHMgfSkgPT4ge1xuXHRjb25zdCBpY29uID0gaWNvbnNbdHlwZV07XG5cblx0cmV0dXJuIChcblx0XHQ8c3BhblxuXHRcdFx0ZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBpY29uKGZpbGwpIH19XG5cdFx0XHR7Li4ucHJvcHN9XG5cdFx0Lz5cblx0KTtcbn07XG5cbkljb24ucHJvcFR5cGVzID0ge1xuXHRmaWxsOiBQcm9wVHlwZXMuc3RyaW5nLFxuXHR0eXBlOiBQcm9wVHlwZXMub25lT2YoT2JqZWN0LmtleXMoaWNvbnMpKSxcbn07XG5JY29uLmRlZmF1bHRQcm9wcyA9IHtcblx0ZmlsbDogJ3doaXRlJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEljb247XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IGNzcywgU3R5bGVTaGVldCB9IGZyb20gJ2FwaHJvZGl0ZS9uby1pbXBvcnRhbnQnO1xuXG5pbXBvcnQgVGh1bWJuYWlsIGZyb20gJy4vVGh1bWJuYWlsJztcbmltcG9ydCBBcnJvdyBmcm9tICcuL0Fycm93JztcbmltcG9ydCB0aGVtZSBmcm9tICcuLi90aGVtZSc7XG5cbmNvbnN0IGNsYXNzZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZSh7XG5cdHBhZ2luYXRlZFRodW1ibmFpbHM6IHtcblx0XHRib3R0b206IHRoZW1lLmNvbnRhaW5lci5ndXR0ZXIudmVydGljYWwsXG5cdFx0aGVpZ2h0OiB0aGVtZS50aHVtYm5haWwuc2l6ZSxcblx0XHRwYWRkaW5nOiAnMCA1MHB4Jyxcblx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHR0ZXh0QWxpZ246ICdjZW50ZXInLFxuXHRcdHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuXHR9LFxufSk7XG5cbmNvbnN0IGFycm93U3R5bGVzID0ge1xuXHRoZWlnaHQ6IHRoZW1lLnRodW1ibmFpbC5zaXplICsgKHRoZW1lLnRodW1ibmFpbC5ndXR0ZXIgKiAyKSxcblx0d2lkdGg6IDQwLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnaW5hdGVkVGh1bWJuYWlscyBleHRlbmRzIENvbXBvbmVudCB7XG5cdGNvbnN0cnVjdG9yIChwcm9wcykge1xuXHRcdHN1cGVyKHByb3BzKTtcblxuXHRcdHRoaXMuc3RhdGUgPSB7XG5cdFx0XHRoYXNDdXN0b21QYWdlOiBmYWxzZSxcblx0XHR9O1xuXG5cdFx0dGhpcy5nb3RvUHJldiA9IHRoaXMuZ290b1ByZXYuYmluZCh0aGlzKTtcblx0XHR0aGlzLmdvdG9OZXh0ID0gdGhpcy5nb3RvTmV4dC5iaW5kKHRoaXMpO1xuXHR9XG5cdGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuXHRcdC8vIENvbXBvbmVudCBzaG91bGQgYmUgY29udHJvbGxlZCwgZmx1c2ggc3RhdGUgd2hlbiBjdXJyZW50SW1hZ2UgY2hhbmdlc1xuXHRcdGlmIChuZXh0UHJvcHMuY3VycmVudEltYWdlICE9PSB0aGlzLnByb3BzLmN1cnJlbnRJbWFnZSkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGhhc0N1c3RvbVBhZ2U6IGZhbHNlLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vIE1FVEhPRFNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0Z2V0Rmlyc3QgKCkge1xuXHRcdGNvbnN0IHsgY3VycmVudEltYWdlLCBvZmZzZXQgfSA9IHRoaXMucHJvcHM7XG5cdFx0aWYgKHRoaXMuc3RhdGUuaGFzQ3VzdG9tUGFnZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuY2xhbXBGaXJzdCh0aGlzLnN0YXRlLmZpcnN0KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuY2xhbXBGaXJzdChjdXJyZW50SW1hZ2UgLSBvZmZzZXQpO1xuXHR9XG5cdHNldEZpcnN0IChldmVudCwgbmV3Rmlyc3QpIHtcblx0XHRjb25zdCB7IGZpcnN0IH0gPSB0aGlzLnN0YXRlO1xuXG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXG5cdFx0aWYgKGZpcnN0ID09PSBuZXdGaXJzdCkgcmV0dXJuO1xuXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRoYXNDdXN0b21QYWdlOiB0cnVlLFxuXHRcdFx0Zmlyc3Q6IG5ld0ZpcnN0LFxuXHRcdH0pO1xuXHR9XG5cdGdvdG9QcmV2IChldmVudCkge1xuXHRcdHRoaXMuc2V0Rmlyc3QoZXZlbnQsIHRoaXMuZ2V0Rmlyc3QoKSAtIHRoaXMucHJvcHMub2Zmc2V0KTtcblx0fVxuXHRnb3RvTmV4dCAoZXZlbnQpIHtcblx0XHR0aGlzLnNldEZpcnN0KGV2ZW50LCB0aGlzLmdldEZpcnN0KCkgKyB0aGlzLnByb3BzLm9mZnNldCk7XG5cdH1cblx0Y2xhbXBGaXJzdCAodmFsdWUpIHtcblx0XHRjb25zdCB7IGltYWdlcywgb2Zmc2V0IH0gPSB0aGlzLnByb3BzO1xuXG5cdFx0Y29uc3QgdG90YWxDb3VudCA9IDIgKiBvZmZzZXQgKyAxOyAvLyBzaG93ICRvZmZzZXQgZXh0cmEgdGh1bWJuYWlscyBvbiBlYWNoIHNpZGVcblxuXHRcdGlmICh2YWx1ZSA8IDApIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUgKyB0b3RhbENvdW50ID4gaW1hZ2VzLmxlbmd0aCkgeyAvLyBUb28gZmFyXG5cdFx0XHRyZXR1cm4gaW1hZ2VzLmxlbmd0aCAtIHRvdGFsQ291bnQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gUkVOREVSRVJTXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdHJlbmRlckFycm93UHJldiAoKSB7XG5cdFx0aWYgKHRoaXMuZ2V0Rmlyc3QoKSA8PSAwKSByZXR1cm4gbnVsbDtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8QXJyb3dcblx0XHRcdFx0ZGlyZWN0aW9uPVwibGVmdFwiXG5cdFx0XHRcdHNpemU9XCJzbWFsbFwiXG5cdFx0XHRcdGljb249XCJhcnJvd0xlZnRcIlxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLmdvdG9QcmV2fVxuXHRcdFx0XHRzdHlsZT17YXJyb3dTdHlsZXN9XG5cdFx0XHRcdHRpdGxlPVwiUHJldmlvdXMgKExlZnQgYXJyb3cga2V5KVwiXG5cdFx0XHRcdHR5cGU9XCJidXR0b25cIlxuXHRcdFx0Lz5cblx0XHQpO1xuXHR9XG5cdHJlbmRlckFycm93TmV4dCAoKSB7XG5cdFx0Y29uc3QgeyBvZmZzZXQsIGltYWdlcyB9ID0gdGhpcy5wcm9wcztcblx0XHRjb25zdCB0b3RhbENvdW50ID0gMiAqIG9mZnNldCArIDE7XG5cdFx0aWYgKHRoaXMuZ2V0Rmlyc3QoKSArIHRvdGFsQ291bnQgPj0gaW1hZ2VzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PEFycm93XG5cdFx0XHRcdGRpcmVjdGlvbj1cInJpZ2h0XCJcblx0XHRcdFx0c2l6ZT1cInNtYWxsXCJcblx0XHRcdFx0aWNvbj1cImFycm93UmlnaHRcIlxuXHRcdFx0XHRvbkNsaWNrPXt0aGlzLmdvdG9OZXh0fVxuXHRcdFx0XHRzdHlsZT17YXJyb3dTdHlsZXN9XG5cdFx0XHRcdHRpdGxlPVwiUHJldmlvdXMgKFJpZ2h0IGFycm93IGtleSlcIlxuXHRcdFx0XHR0eXBlPVwiYnV0dG9uXCJcblx0XHRcdC8+XG5cdFx0KTtcblx0fVxuXHRyZW5kZXIgKCkge1xuXHRcdGNvbnN0IHsgaW1hZ2VzLCBjdXJyZW50SW1hZ2UsIG9uQ2xpY2tUaHVtYm5haWwsIG9mZnNldCB9ID0gdGhpcy5wcm9wcztcblxuXHRcdGNvbnN0IHRvdGFsQ291bnQgPSAyICogb2Zmc2V0ICsgMTsgLy8gc2hvdyAkb2Zmc2V0IGV4dHJhIHRodW1ibmFpbHMgb24gZWFjaCBzaWRlXG5cdFx0bGV0IHRodW1ibmFpbHMgPSBbXTtcblx0XHRsZXQgYmFzZU9mZnNldCA9IDA7XG5cdFx0aWYgKGltYWdlcy5sZW5ndGggPD0gdG90YWxDb3VudCkge1xuXHRcdFx0dGh1bWJuYWlscyA9IGltYWdlcztcblx0XHR9IGVsc2UgeyAvLyBUcnkgdG8gY2VudGVyIGN1cnJlbnQgaW1hZ2UgaW4gbGlzdFxuXHRcdFx0YmFzZU9mZnNldCA9IHRoaXMuZ2V0Rmlyc3QoKTtcblx0XHRcdHRodW1ibmFpbHMgPSBpbWFnZXMuc2xpY2UoYmFzZU9mZnNldCwgYmFzZU9mZnNldCArIHRvdGFsQ291bnQpO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMucGFnaW5hdGVkVGh1bWJuYWlscyl9PlxuXHRcdFx0XHR7dGhpcy5yZW5kZXJBcnJvd1ByZXYoKX1cblx0XHRcdFx0e3RodW1ibmFpbHMubWFwKChpbWcsIGlkeCkgPT4gKFxuXHRcdFx0XHRcdDxUaHVtYm5haWwga2V5PXtiYXNlT2Zmc2V0ICsgaWR4fVxuXHRcdFx0XHRcdFx0ey4uLmltZ31cblx0XHRcdFx0XHRcdGluZGV4PXtiYXNlT2Zmc2V0ICsgaWR4fVxuXHRcdFx0XHRcdFx0b25DbGljaz17b25DbGlja1RodW1ibmFpbH1cblx0XHRcdFx0XHRcdGFjdGl2ZT17YmFzZU9mZnNldCArIGlkeCA9PT0gY3VycmVudEltYWdlfSAvPlxuXHRcdFx0XHQpKX1cblx0XHRcdFx0e3RoaXMucmVuZGVyQXJyb3dOZXh0KCl9XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59XG5cblBhZ2luYXRlZFRodW1ibmFpbHMucHJvcFR5cGVzID0ge1xuXHRjdXJyZW50SW1hZ2U6IFByb3BUeXBlcy5udW1iZXIsXG5cdGltYWdlczogUHJvcFR5cGVzLmFycmF5LFxuXHRvZmZzZXQ6IFByb3BUeXBlcy5udW1iZXIsXG5cdG9uQ2xpY2tUaHVtYm5haWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG59O1xuIiwiaW1wb3J0IHsgQ2hpbGRyZW4sIENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbi8vIFBhc3MgdGhlIExpZ2h0Ym94IGNvbnRleHQgdGhyb3VnaCB0byB0aGUgUG9ydGFsJ3MgZGVzY2VuZGVudHNcbi8vIFN0YWNrT3ZlcmZsb3cgZGlzY3Vzc2lvbiBodHRwOi8vZ29vLmdsL29jbHJKOVxuXG5jbGFzcyBQYXNzQ29udGV4dCBleHRlbmRzIENvbXBvbmVudCB7XG5cdGdldENoaWxkQ29udGV4dCAoKSB7XG5cdFx0cmV0dXJuIHRoaXMucHJvcHMuY29udGV4dDtcblx0fVxuXHRyZW5kZXIgKCkge1xuXHRcdHJldHVybiBDaGlsZHJlbi5vbmx5KHRoaXMucHJvcHMuY2hpbGRyZW4pO1xuXHR9XG59O1xuXG5QYXNzQ29udGV4dC5wcm9wVHlwZXMgPSB7XG5cdGNvbnRleHQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbn07XG5QYXNzQ29udGV4dC5jaGlsZENvbnRleHRUeXBlcyA9IHtcblx0dGhlbWU6IFByb3BUeXBlcy5vYmplY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBQYXNzQ29udGV4dDtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFRyYW5zaXRpb24gZnJvbSAncmVhY3QtYWRkb25zLWNzcy10cmFuc2l0aW9uLWdyb3VwJztcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUGFzc0NvbnRleHQgZnJvbSAnLi9QYXNzQ29udGV4dCc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9ydGFsIGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IgKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5wb3J0YWxFbGVtZW50ID0gbnVsbDtcblx0fVxuXHRjb21wb25lbnREaWRNb3VudCAoKSB7XG5cdFx0Y29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocCk7XG5cdFx0dGhpcy5wb3J0YWxFbGVtZW50ID0gcDtcblx0XHR0aGlzLmNvbXBvbmVudERpZFVwZGF0ZSgpO1xuXHR9XG5cdGNvbXBvbmVudERpZFVwZGF0ZSAoKSB7XG5cdFx0Ly8gQW5pbWF0ZSBmYWRlIG9uIG1vdW50L3VubW91bnRcblx0XHRjb25zdCBkdXJhdGlvbiA9IDIwMDtcblx0XHRjb25zdCBzdHlsZXMgPSBgXG5cdFx0XHRcdC5mYWRlLWVudGVyIHsgb3BhY2l0eTogMC4wMTsgfVxuXHRcdFx0XHQuZmFkZS1lbnRlci5mYWRlLWVudGVyLWFjdGl2ZSB7IG9wYWNpdHk6IDE7IHRyYW5zaXRpb246IG9wYWNpdHkgJHtkdXJhdGlvbn1tczsgfVxuXHRcdFx0XHQuZmFkZS1sZWF2ZSB7IG9wYWNpdHk6IDE7IH1cblx0XHRcdFx0LmZhZGUtbGVhdmUuZmFkZS1sZWF2ZS1hY3RpdmUgeyBvcGFjaXR5OiAwLjAxOyB0cmFuc2l0aW9uOiBvcGFjaXR5ICR7ZHVyYXRpb259bXM7IH1cblx0XHRgO1xuXG5cdFx0cmVuZGVyKFxuXHRcdFx0PFBhc3NDb250ZXh0IGNvbnRleHQ9e3RoaXMuY29udGV4dH0+XG5cdFx0XHRcdDxkaXY+XG5cdFx0XHRcdFx0PHN0eWxlPntzdHlsZXN9PC9zdHlsZT5cblx0XHRcdFx0XHQ8VHJhbnNpdGlvblxuXHRcdFx0XHRcdFx0Y29tcG9uZW50PVwiZGl2XCJcblx0XHRcdFx0XHRcdHRyYW5zaXRpb25OYW1lPVwiZmFkZVwiXG5cdFx0XHRcdFx0XHR0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXtkdXJhdGlvbn1cblx0XHRcdFx0XHRcdHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9e2R1cmF0aW9ufVxuXHRcdFx0XHRcdFx0ey4uLnRoaXMucHJvcHN9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L1Bhc3NDb250ZXh0Pixcblx0XHRcdHRoaXMucG9ydGFsRWxlbWVudFxuXHRcdCk7XG5cdH1cblx0Y29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuXHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5wb3J0YWxFbGVtZW50KTtcblx0fVxuXHRyZW5kZXIgKCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG5cblBvcnRhbC5jb250ZXh0VHlwZXMgPSB7XG5cdHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBjc3MsIFN0eWxlU2hlZXQgfSBmcm9tICdhcGhyb2RpdGUvbm8taW1wb3J0YW50JztcblxuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4uL3RoZW1lJztcbmltcG9ydCB7IGRlZXBNZXJnZSB9IGZyb20gJy4uL3V0aWxzJztcblxuZnVuY3Rpb24gVGh1bWJuYWlsICh7IGluZGV4LCBzcmMsIHRodW1ibmFpbCwgYWN0aXZlLCBvbkNsaWNrIH0sIHsgdGhlbWUgfSkge1xuXHRjb25zdCB1cmwgPSB0aHVtYm5haWwgPyB0aHVtYm5haWwgOiBzcmM7XG5cdGNvbnN0IGNsYXNzZXMgPSBTdHlsZVNoZWV0LmNyZWF0ZShkZWVwTWVyZ2UoZGVmYXVsdFN0eWxlcywgdGhlbWUpKTtcblxuXHRyZXR1cm4gKFxuXHRcdDxkaXZcblx0XHRcdGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMudGh1bWJuYWlsLCBhY3RpdmUgJiYgY2xhc3Nlcy50aHVtYm5haWxfX2FjdGl2ZSl9XG5cdFx0XHRvbkNsaWNrPXsoZSkgPT4ge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdG9uQ2xpY2soaW5kZXgpO1xuXHRcdFx0fX1cblx0XHRcdHN0eWxlPXt7IGJhY2tncm91bmRJbWFnZTogJ3VybChcIicgKyB1cmwgKyAnXCIpJyB9fVxuXHRcdC8+XG5cdCk7XG59XG5cblRodW1ibmFpbC5wcm9wVHlwZXMgPSB7XG5cdGFjdGl2ZTogUHJvcFR5cGVzLmJvb2wsXG5cdGluZGV4OiBQcm9wVHlwZXMubnVtYmVyLFxuXHRvbkNsaWNrOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXHRzcmM6IFByb3BUeXBlcy5zdHJpbmcsXG5cdHRodW1ibmFpbDogUHJvcFR5cGVzLnN0cmluZyxcbn07XG5cblRodW1ibmFpbC5jb250ZXh0VHlwZXMgPSB7XG5cdHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5jb25zdCBkZWZhdWx0U3R5bGVzID0ge1xuXHR0aHVtYm5haWw6IHtcblx0XHRiYWNrZ3JvdW5kUG9zaXRpb246ICdjZW50ZXInLFxuXHRcdGJhY2tncm91bmRTaXplOiAnY292ZXInLFxuXHRcdGJvcmRlclJhZGl1czogMixcblx0XHRib3hTaGFkb3c6ICdpbnNldCAwIDAgMCAxcHggaHNsYSgwLDAlLDEwMCUsLjIpJyxcblx0XHRjdXJzb3I6ICdwb2ludGVyJyxcblx0XHRkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRodW1ibmFpbC5zaXplLFxuXHRcdG1hcmdpbjogZGVmYXVsdHMudGh1bWJuYWlsLmd1dHRlcixcblx0XHRvdmVyZmxvdzogJ2hpZGRlbicsXG5cdFx0d2lkdGg6IGRlZmF1bHRzLnRodW1ibmFpbC5zaXplLFxuXHR9LFxuXHR0aHVtYm5haWxfX2FjdGl2ZToge1xuXHRcdGJveFNoYWRvdzogYGluc2V0IDAgMCAwIDJweCAke2RlZmF1bHRzLnRodW1ibmFpbC5hY3RpdmVCb3JkZXJDb2xvcn1gLFxuXHR9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgVGh1bWJuYWlsO1xuIiwiZXhwb3J0IGRlZmF1bHQgKGZpbGwpID0+IChcblx0YDxzdmcgZmlsbD1cIiR7ZmlsbH1cIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG5cdFx0PHBhdGggZD1cIk0yMTMuNywyNTZMMjEzLjcsMjU2TDIxMy43LDI1NkwzODAuOSw4MS45YzQuMi00LjMsNC4xLTExLjQtMC4yLTE1LjhsLTI5LjktMzAuNmMtNC4zLTQuNC0xMS4zLTQuNS0xNS41LTAuMkwxMzEuMSwyNDcuOSBjLTIuMiwyLjItMy4yLDUuMi0zLDguMWMtMC4xLDMsMC45LDUuOSwzLDguMWwyMDQuMiwyMTIuN2M0LjIsNC4zLDExLjIsNC4yLDE1LjUtMC4ybDI5LjktMzAuNmM0LjMtNC40LDQuNC0xMS41LDAuMi0xNS44IEwyMTMuNywyNTZ6XCIvPlxuXHQ8L3N2Zz5gXG4pO1xuIiwiZXhwb3J0IGRlZmF1bHQgKGZpbGwpID0+IChcblx0YDxzdmcgZmlsbD1cIiR7ZmlsbH1cIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgNTEyIDUxMlwiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG5cdFx0PHBhdGggZD1cIk0yOTguMywyNTZMMjk4LjMsMjU2TDI5OC4zLDI1NkwxMzEuMSw4MS45Yy00LjItNC4zLTQuMS0xMS40LDAuMi0xNS44bDI5LjktMzAuNmM0LjMtNC40LDExLjMtNC41LDE1LjUtMC4ybDIwNC4yLDIxMi43IGMyLjIsMi4yLDMuMiw1LjIsMyw4LjFjMC4xLDMtMC45LDUuOS0zLDguMUwxNzYuNyw0NzYuOGMtNC4yLDQuMy0xMS4yLDQuMi0xNS41LTAuMkwxMzEuMyw0NDZjLTQuMy00LjQtNC40LTExLjUtMC4yLTE1LjggTDI5OC4zLDI1NnpcIi8+XG5cdDwvc3ZnPmBcbik7XG4iLCJleHBvcnQgZGVmYXVsdCAoZmlsbCkgPT4gKFxuXHRgPHN2ZyBmaWxsPVwiJHtmaWxsfVwiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCA1MTIgNTEyXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cblx0XHQ8cGF0aCBkPVwiTTQ0My42LDM4Ny4xTDMxMi40LDI1NS40bDEzMS41LTEzMGM1LjQtNS40LDUuNC0xNC4yLDAtMTkuNmwtMzcuNC0zNy42Yy0yLjYtMi42LTYuMS00LTkuOC00Yy0zLjcsMC03LjIsMS41LTkuOCw0IEwyNTYsMTk3LjhMMTI0LjksNjguM2MtMi42LTIuNi02LjEtNC05LjgtNGMtMy43LDAtNy4yLDEuNS05LjgsNEw2OCwxMDUuOWMtNS40LDUuNC01LjQsMTQuMiwwLDE5LjZsMTMxLjUsMTMwTDY4LjQsMzg3LjEgYy0yLjYsMi42LTQuMSw2LjEtNC4xLDkuOGMwLDMuNywxLjQsNy4yLDQuMSw5LjhsMzcuNCwzNy42YzIuNywyLjcsNi4yLDQuMSw5LjgsNC4xYzMuNSwwLDcuMS0xLjMsOS44LTQuMUwyNTYsMzEzLjFsMTMwLjcsMTMxLjEgYzIuNywyLjcsNi4yLDQuMSw5LjgsNC4xYzMuNSwwLDcuMS0xLjMsOS44LTQuMWwzNy40LTM3LjZjMi42LTIuNiw0LjEtNi4xLDQuMS05LjhDNDQ3LjcsMzkzLjIsNDQ2LjIsMzg5LjcsNDQzLjYsMzg3LjF6XCIvPlxuXHQ8L3N2Zz5gXG4pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGFycm93TGVmdDogcmVxdWlyZSgnLi9hcnJvd0xlZnQnKSxcblx0YXJyb3dSaWdodDogcmVxdWlyZSgnLi9hcnJvd1JpZ2h0JyksXG5cdGNsb3NlOiByZXF1aXJlKCcuL2Nsb3NlJyksXG5cdHJvdGF0ZTogcmVxdWlyZSgnLi9yb3RhdGUnKSxcbn07XG4iLCJleHBvcnQgZGVmYXVsdCAoZmlsbCkgPT4gKFxuXHRgPHN2ZyBmaWxsPVwiJHtmaWxsfVwiIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAzODUgMzg1XCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cblx0XHQ8cGF0aCBkPVwiTTM4NSwzMi4wODMzMzMzIEwzODUsMTQ0LjM3NSBDMzg1LDE0OC43MTk2MTggMzgzLjQxMjU0MywxNTIuNDc5Mzg0IDM4MC4yMzc2MywxNTUuNjU0Mjk3IEMzNzcuMDYyNzE3LDE1OC44MjkyMSAzNzMuMzAyOTUxLDE2MC40MTY2NjcgMzY4Ljk1ODMzMywxNjAuNDE2NjY3IEwyNTYuNjY2NjY3LDE2MC40MTY2NjcgQzI0OS42NDg0MzgsMTYwLjQxNjY2NyAyNDQuNzE4OTY3LDE1Ny4wNzQ2NTMgMjQxLjg3ODI1NSwxNTAuMzkwNjI1IEMyMzkuMDM3NTQzLDE0My44NzM2OTggMjQwLjIwNzI0OCwxMzguMTA4NzI0IDI0NS4zODczNywxMzMuMDk1NzAzIEwyNzkuOTc3MjE0LDk4LjUwNTg1OTQgQzI1NS4yNDYzMTEsNzUuNjEzMDY0MiAyMjYuMDg3MjQsNjQuMTY2NjY2NyAxOTIuNSw2NC4xNjY2NjY3IEMxNzUuMTIxNTI4LDY0LjE2NjY2NjcgMTU4LjUzNjc4NCw2Ny41NTA0NTU3IDE0Mi43NDU3NjgsNzQuMzE4MDMzOSBDMTI2Ljk1NDc1Myw4MS4wODU2MTIgMTEzLjI5NDI3MSw5MC4yMzQzNzUgMTAxLjc2NDMyMywxMDEuNzY0MzIzIEM5MC4yMzQzNzUsMTEzLjI5NDI3MSA4MS4wODU2MTIsMTI2Ljk1NDc1MyA3NC4zMTgwMzM5LDE0Mi43NDU3NjggQzY3LjU1MDQ1NTcsMTU4LjUzNjc4NCA2NC4xNjY2NjY3LDE3NS4xMjE1MjggNjQuMTY2NjY2NywxOTIuNSBDNjQuMTY2NjY2NywyMDkuODc4NDcyIDY3LjU1MDQ1NTcsMjI2LjQ2MzIxNiA3NC4zMTgwMzM5LDI0Mi4yNTQyMzIgQzgxLjA4NTYxMiwyNTguMDQ1MjQ3IDkwLjIzNDM3NSwyNzEuNzA1NzI5IDEwMS43NjQzMjMsMjgzLjIzNTY3NyBDMTEzLjI5NDI3MSwyOTQuNzY1NjI1IDEyNi45NTQ3NTMsMzAzLjkxNDM4OCAxNDIuNzQ1NzY4LDMxMC42ODE5NjYgQzE1OC41MzY3ODQsMzE3LjQ0OTU0NCAxNzUuMTIxNTI4LDMyMC44MzMzMzMgMTkyLjUsMzIwLjgzMzMzMyBDMjEyLjM4NDk4MywzMjAuODMzMzMzIDIzMS4xODM4MTEsMzE2LjQ4ODcxNSAyNDguODk2NDg0LDMwNy43OTk0NzkgQzI2Ni42MDkxNTgsMjk5LjExMDI0MyAyODEuNTY0NjcsMjg2LjgyODM0MiAyOTMuNzYzMDIxLDI3MC45NTM3NzYgQzI5NC45MzI3MjYsMjY5LjI4Mjc2OSAyOTYuODU0Mzg0LDI2OC4yODAxNjUgMjk5LjUyNzk5NSwyNjcuOTQ1OTY0IEMzMDEuODY3NDA1LDI2Ny45NDU5NjQgMzAzLjk1NjE2MywyNjguNjk3OTE3IDMwNS43OTQyNzEsMjcwLjIwMTgyMyBMMzQwLjEzMzQ2NCwzMDQuNzkxNjY3IEMzNDEuNjM3MzcsMzA2LjEyODQ3MiAzNDIuNDMxMDk4LDMwNy44NDEyNTQgMzQyLjUxNDY0OCwzMDkuOTMwMDEzIEMzNDIuNTk4MTk5LDMxMi4wMTg3NzIgMzQxLjk3MTU3MSwzMTMuODk4NjU1IDM0MC42MzQ3NjYsMzE1LjU2OTY2MSBDMzIyLjQyMDc5LDMzNy42MjY5NTMgMzAwLjM2MzQ5OCwzNTQuNzEyOTk5IDI3NC40NjI4OTEsMzY2LjgyNzc5OSBDMjQ4LjU2MjI4MywzNzguOTQyNiAyMjEuMjQxMzE5LDM4NSAxOTIuNSwzODUgQzE2Ni40MzIyOTIsMzg1IDE0MS41MzQyODgsMzc5LjkwMzQyOSAxMTcuODA1OTksMzY5LjcxMDI4NiBDOTQuMDc3NjkxLDM1OS41MTcxNDQgNzMuNjA3ODU1OSwzNDUuODE0ODg3IDU2LjM5NjQ4NDQsMzI4LjYwMzUxNiBDMzkuMTg1MTEyOCwzMTEuMzkyMTQ0IDI1LjQ4Mjg1NTksMjkwLjkyMjMwOSAxNS4yODk3MTM1LDI2Ny4xOTQwMSBDNS4wOTY1NzExOCwyNDMuNDY1NzEyIDAsMjE4LjU2NzcwOCAwLDE5Mi41IEMwLDE2Ni40MzIyOTIgNS4wOTY1NzExOCwxNDEuNTM0Mjg4IDE1LjI4OTcxMzUsMTE3LjgwNTk5IEMyNS40ODI4NTU5LDk0LjA3NzY5MSAzOS4xODUxMTI4LDczLjYwNzg1NTkgNTYuMzk2NDg0NCw1Ni4zOTY0ODQ0IEM3My42MDc4NTU5LDM5LjE4NTExMjggOTQuMDc3NjkxLDI1LjQ4Mjg1NTkgMTE3LjgwNTk5LDE1LjI4OTcxMzUgQzE0MS41MzQyODgsNS4wOTY1NzExOCAxNjYuNDMyMjkyLDAgMTkyLjUsMCBDMjE3LjA2MzgwMiwwIDI0MC44MzM4NzYsNC42MzcwNDQyNyAyNjMuODEwMjIxLDEzLjkxMTEzMjggQzI4Ni43ODY1NjcsMjMuMTg1MjIxNCAzMDcuMjE0NjI3LDM2LjI2MDg1MDcgMzI1LjA5NDQwMSw1My4xMzgwMjA4IEwzNTcuNjc5MDM2LDIwLjgwNDAzNjUgQzM2Mi41MjQ5NTcsMTUuNjIzOTE0OSAzNjguMzczNDgxLDE0LjQ1NDIxMDEgMzc1LjIyNDYwOSwxNy4yOTQ5MjE5IEMzODEuNzQxNTM2LDIwLjEzNTYzMzcgMzg1LDI1LjA2NTEwNDIgMzg1LDMyLjA4MzMzMzMgWlwiIGlkPVwiU2hhcGVcIiBmaWxsPVwiJHtmaWxsfVwiPjwvcGF0aD5cblx0PC9zdmc+YFxuKTtcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVEhFTUVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCB0aGVtZSA9IHt9O1xuXG4vLyBjb250YWluZXJcbnRoZW1lLmNvbnRhaW5lciA9IHtcblx0YmFja2dyb3VuZDogJ3JnYmEoMCwgMCwgMCwgMC44KScsXG5cdGd1dHRlcjoge1xuXHRcdGhvcml6b250YWw6IDEwLFxuXHRcdHZlcnRpY2FsOiAxMCxcblx0fSxcblx0ekluZGV4OiAyMDAxLFxufTtcblxuLy8gaGVhZGVyXG50aGVtZS5oZWFkZXIgPSB7XG5cdGhlaWdodDogNDAsXG59O1xudGhlbWUuY2xvc2UgPSB7XG5cdGZpbGw6ICd3aGl0ZScsXG5cdGhlaWdodDogMjAsXG5cdHdpZHRoOiAyMCxcbn07XG50aGVtZS5yb3RhdGUgPSB7XG5cdGZpbGw6ICd3aGl0ZScsXG5cdGhlaWdodDogMjAsXG5cdHdpZHRoOiAyMCxcbn07XG5cbi8vIGZvb3RlclxudGhlbWUuZm9vdGVyID0ge1xuXHRjb2xvcjogJ3doaXRlJyxcblx0Y291bnQ6IHtcblx0XHRjb2xvcjogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC43NSknLFxuXHRcdGZvbnRTaXplOiAnMC44NWVtJyxcblx0fSxcblx0aGVpZ2h0OiA0MCxcblx0Z3V0dGVyOiB7XG5cdFx0aG9yaXpvbnRhbDogMCxcblx0XHR2ZXJ0aWNhbDogNSxcblx0fSxcbn07XG5cbi8vIHRodW1ibmFpbHNcbnRoZW1lLnRodW1ibmFpbCA9IHtcblx0YWN0aXZlQm9yZGVyQ29sb3I6ICd3aGl0ZScsXG5cdHNpemU6IDUwLFxuXHRndXR0ZXI6IDIsXG59O1xuXG4vLyBhcnJvd1xudGhlbWUuYXJyb3cgPSB7XG5cdGJhY2tncm91bmQ6ICdibGFjaycsXG5cdGZpbGw6ICd3aGl0ZScsXG5cdGhlaWdodDogMTIwLFxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHRoZW1lO1xuIiwiLyoqXG5cdEJpbmQgbXVsdGlwbGUgY29tcG9uZW50IG1ldGhvZHM6XG5cblx0KiBAcGFyYW0ge3RoaXN9IGNvbnRleHRcblx0KiBAcGFyYW0ge0FycmF5fSBmdW5jdGlvbnNcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHQuLi5cblx0XHRiaW5kRnVuY3Rpb25zLmNhbGwodGhpcywgWydoYW5kbGVDbGljaycsICdoYW5kbGVPdGhlciddKTtcblx0fVxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBiaW5kRnVuY3Rpb25zIChmdW5jdGlvbnMpIHtcblx0ZnVuY3Rpb25zLmZvckVhY2goZiA9PiAodGhpc1tmXSA9IHRoaXNbZl0uYmluZCh0aGlzKSkpO1xufTtcbiIsIi8vIFJldHVybiB0cnVlIGlmIHdpbmRvdyArIGRvY3VtZW50XG5cbm1vZHVsZS5leHBvcnRzID0gISEoXG5cdHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG5cdCYmIHdpbmRvdy5kb2N1bWVudFxuXHQmJiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudFxuKTtcbiIsImZ1bmN0aW9uIGRlZXBNZXJnZSAodGFyZ2V0LCBzb3VyY2UgPSB7fSkge1xuXHRjb25zdCBleHRlbmRlZCA9IE9iamVjdC5hc3NpZ24oe30sIHRhcmdldCk7XG5cblx0T2JqZWN0LmtleXMoc291cmNlKS5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRpZiAodHlwZW9mIHNvdXJjZVtrZXldICE9PSAnb2JqZWN0JyB8fCAhc291cmNlW2tleV0pIHtcblx0XHRcdGV4dGVuZGVkW2tleV0gPSBzb3VyY2Vba2V5XTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCF0YXJnZXRba2V5XSkge1xuXHRcdFx0XHRleHRlbmRlZFtrZXldID0gc291cmNlW2tleV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRleHRlbmRlZFtrZXldID0gZGVlcE1lcmdlKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gZXh0ZW5kZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVlcE1lcmdlO1xuIiwiaW1wb3J0IGJpbmRGdW5jdGlvbnMgZnJvbSAnLi9iaW5kRnVuY3Rpb25zJztcbmltcG9ydCBjYW5Vc2VEb20gZnJvbSAnLi9jYW5Vc2VEb20nO1xuaW1wb3J0IGRlZXBNZXJnZSBmcm9tICcuL2RlZXBNZXJnZSc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRiaW5kRnVuY3Rpb25zLFxuXHRjYW5Vc2VEb20sXG5cdGRlZXBNZXJnZSxcbn07XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IGNzcywgU3R5bGVTaGVldCB9IGZyb20gJ2FwaHJvZGl0ZS9uby1pbXBvcnRhbnQnO1xuaW1wb3J0IFNjcm9sbExvY2sgZnJvbSAncmVhY3Qtc2Nyb2xsbG9jayc7XG5cbmltcG9ydCB0aGVtZSBmcm9tICcuL3RoZW1lJztcbmltcG9ydCBBcnJvdyBmcm9tICcuL2NvbXBvbmVudHMvQXJyb3cnO1xuaW1wb3J0IENvbnRhaW5lciBmcm9tICcuL2NvbXBvbmVudHMvQ29udGFpbmVyJztcbmltcG9ydCBGb290ZXIgZnJvbSAnLi9jb21wb25lbnRzL0Zvb3Rlcic7XG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vY29tcG9uZW50cy9IZWFkZXInO1xuaW1wb3J0IFBhZ2luYXRlZFRodW1ibmFpbHMgZnJvbSAnLi9jb21wb25lbnRzL1BhZ2luYXRlZFRodW1ibmFpbHMnO1xuaW1wb3J0IFBvcnRhbCBmcm9tICcuL2NvbXBvbmVudHMvUG9ydGFsJztcblxuaW1wb3J0IHsgYmluZEZ1bmN0aW9ucywgY2FuVXNlRG9tIH0gZnJvbSAnLi91dGlscyc7XG5cbmNsYXNzIExpZ2h0Ym94IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IgKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zdGF0ZSA9IHsgcm90YXRlOiAwLCBpc1pvb21lZDogZmFsc2UgfTtcblxuXHRcdGJpbmRGdW5jdGlvbnMuY2FsbCh0aGlzLCBbXG5cdFx0XHQnZ290b05leHQnLFxuXHRcdFx0J2dvdG9QcmV2Jyxcblx0XHRcdCdyb3RhdGUnLFxuXHRcdFx0J3pvb20nLFxuXHRcdFx0J2hhbmRsZUtleWJvYXJkSW5wdXQnLFxuXHRcdF0pO1xuXHR9XG5cdGdldENoaWxkQ29udGV4dCAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRoZW1lOiB0aGlzLnByb3BzLnRoZW1lLFxuXHRcdH07XG5cdH1cblx0Y29tcG9uZW50RGlkTW91bnQgKCkge1xuXHRcdGxldCBzZWxmID0gdGhpcztcblxuXHRcdGlmICh0aGlzLnByb3BzLmlzT3BlbiAmJiB0aGlzLnByb3BzLmVuYWJsZUtleWJvYXJkSW5wdXQpIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlib2FyZElucHV0KTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcm9wcy56b29tKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdFx0bGV0IHBvc1kgPSBldmVudC5jbGllbnRZO1xuXHRcdFx0XHRpZiAoc2VsZi5zdGF0ZS5pc1pvb21lZCkge1xuXHRcdFx0XHRcdGlmIChwb3NZIDw9IHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIHtcblx0XHRcdFx0XHRcdHNlbGYuc2V0U3RhdGUoeyBtYXJnaW46IGAke3dpbmRvdy5pbm5lckhlaWdodCAtIHBvc1l9cHggMHB4IDBweCAwcHhgIH0pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZWxmLnNldFN0YXRlKHsgbWFyZ2luOiBgLSR7cG9zWSAvIDEuM31weCAwcHggMHB4IDBweGAgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fVxuXHRjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcblx0XHRpZiAoIWNhblVzZURvbSkgcmV0dXJuO1xuXG5cdFx0Ly8gcHJlbG9hZCBpbWFnZXNcblx0XHRpZiAobmV4dFByb3BzLnByZWxvYWROZXh0SW1hZ2UpIHtcblx0XHRcdGNvbnN0IGN1cnJlbnRJbmRleCA9IHRoaXMucHJvcHMuY3VycmVudEltYWdlO1xuXHRcdFx0Y29uc3QgbmV4dEluZGV4ID0gbmV4dFByb3BzLmN1cnJlbnRJbWFnZSArIDE7XG5cdFx0XHRjb25zdCBwcmV2SW5kZXggPSBuZXh0UHJvcHMuY3VycmVudEltYWdlIC0gMTtcblx0XHRcdGxldCBwcmVsb2FkSW5kZXg7XG5cblx0XHRcdGlmIChjdXJyZW50SW5kZXggJiYgbmV4dFByb3BzLmN1cnJlbnRJbWFnZSA+IGN1cnJlbnRJbmRleCkge1xuXHRcdFx0XHRwcmVsb2FkSW5kZXggPSBuZXh0SW5kZXg7XG5cdFx0XHR9IGVsc2UgaWYgKGN1cnJlbnRJbmRleCAmJiBuZXh0UHJvcHMuY3VycmVudEltYWdlIDwgY3VycmVudEluZGV4KSB7XG5cdFx0XHRcdHByZWxvYWRJbmRleCA9IHByZXZJbmRleDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gaWYgd2Uga25vdyB0aGUgdXNlcidzIGRpcmVjdGlvbiBqdXN0IGdldCBvbmUgaW1hZ2Vcblx0XHRcdC8vIG90aGVyd2lzZSwgdG8gYmUgc2FmZSwgd2UgbmVlZCB0byBncmFiIG9uZSBpbiBlYWNoIGRpcmVjdGlvblxuXHRcdFx0aWYgKHByZWxvYWRJbmRleCkge1xuXHRcdFx0XHR0aGlzLnByZWxvYWRJbWFnZShwcmVsb2FkSW5kZXgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wcmVsb2FkSW1hZ2UocHJldkluZGV4KTtcblx0XHRcdFx0dGhpcy5wcmVsb2FkSW1hZ2UobmV4dEluZGV4KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBhZGQvcmVtb3ZlIGV2ZW50IGxpc3RlbmVyc1xuXHRcdGlmICghdGhpcy5wcm9wcy5pc09wZW4gJiYgbmV4dFByb3BzLmlzT3BlbiAmJiBuZXh0UHJvcHMuZW5hYmxlS2V5Ym9hcmRJbnB1dCkge1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWJvYXJkSW5wdXQpO1xuXHRcdH1cblx0XHRpZiAoIW5leHRQcm9wcy5pc09wZW4gJiYgbmV4dFByb3BzLmVuYWJsZUtleWJvYXJkSW5wdXQpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlib2FyZElucHV0KTtcblx0XHR9XG5cdH1cblx0Y29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmVuYWJsZUtleWJvYXJkSW5wdXQpIHtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlib2FyZElucHV0KTtcblx0XHR9XG5cdH1cblxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0Ly8gTUVUSE9EU1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXHRwcmVsb2FkSW1hZ2UgKGlkeCkge1xuXHRcdGNvbnN0IGltYWdlID0gdGhpcy5wcm9wcy5pbWFnZXNbaWR4XTtcblxuXHRcdGlmICghaW1hZ2UpIHJldHVybjtcblxuXHRcdGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuXG5cdFx0aW1nLnNyYyA9IGltYWdlLnNyYztcblxuXHRcdGlmIChpbWFnZS5zcmNzZXQpIHtcblx0XHRcdGltZy5zcmNzZXQgPSBpbWFnZS5zcmNzZXQuam9pbigpO1xuXHRcdH1cblxuXHR9XG5cdGdvdG9OZXh0IChldmVudCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmN1cnJlbnRJbWFnZSA9PT0gKHRoaXMucHJvcHMuaW1hZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm47XG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXHRcdHRoaXMucHJvcHMub25DbGlja05leHQoKTtcblx0XHR0aGlzLnNldFN0YXRlKHsgcm90YXRlOiAwIH0pO1xuXG5cdH1cblx0Z290b1ByZXYgKGV2ZW50KSB7XG5cdFx0aWYgKHRoaXMucHJvcHMuY3VycmVudEltYWdlID09PSAwKSByZXR1cm47XG5cdFx0aWYgKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0fVxuXHRcdHRoaXMucHJvcHMub25DbGlja1ByZXYoKTtcblx0XHR0aGlzLnNldFN0YXRlKHsgcm90YXRlOiAwIH0pO1xuXG5cdH1cblx0aGFuZGxlS2V5Ym9hcmRJbnB1dCAoZXZlbnQpIHtcblx0XHRpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpIHsgLy8gbGVmdFxuXHRcdFx0dGhpcy5nb3RvUHJldihldmVudCk7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5KSB7IC8vIHJpZ2h0XG5cdFx0XHR0aGlzLmdvdG9OZXh0KGV2ZW50KTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHsgLy8gZXNjXG5cdFx0XHR0aGlzLnByb3BzLm9uQ2xvc2UoKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0fVxuXHRyb3RhdGUgKGV2ZW50KSB7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXHRcdGlmICh0aGlzLnN0YXRlLnJvdGF0ZSA9PT0gMzYwKSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHsgcm90YXRlOiA5MCB9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7IHJvdGF0ZTogdGhpcy5zdGF0ZS5yb3RhdGUgKyA5MCB9KTtcblx0XHR9XG5cblx0fVxuXHR6b29tIChldmVudCkge1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRpZiAodGhpcy5zdGF0ZS5pc1pvb21lZCkge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7XG5cdFx0XHRcdGlzWm9vbWVkOiBmYWxzZSxcblx0XHRcdFx0bWFyZ2luOiAwLFxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRpc1pvb21lZDogdHJ1ZSxcblx0XHRcdFx0bWFyZ2luOiAwLFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH1cblx0ZXZlbnRQcmV2ZW50RGVmYXVsdCAoZXZlbnQpIHtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0fVxuXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHQvLyBSRU5ERVJFUlNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblx0cmVuZGVyQXJyb3dQcmV2ICgpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5jdXJyZW50SW1hZ2UgPT09IDApIHJldHVybiBudWxsO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxBcnJvd1xuXHRcdFx0XHRkaXJlY3Rpb249XCJsZWZ0XCJcblx0XHRcdFx0aWNvbj1cImFycm93TGVmdFwiXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMuZ290b1ByZXZ9XG5cdFx0XHRcdHRpdGxlPXt0aGlzLnByb3BzLmxlZnRBcnJvd1RpdGxlfVxuXHRcdFx0XHR0eXBlPVwiYnV0dG9uXCJcblx0XHRcdC8+XG5cdFx0KTtcblx0fVxuXHRyZW5kZXJBcnJvd05leHQgKCkge1xuXHRcdGlmICh0aGlzLnByb3BzLmN1cnJlbnRJbWFnZSA9PT0gKHRoaXMucHJvcHMuaW1hZ2VzLmxlbmd0aCAtIDEpKSByZXR1cm4gbnVsbDtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8QXJyb3dcblx0XHRcdFx0ZGlyZWN0aW9uPVwicmlnaHRcIlxuXHRcdFx0XHRpY29uPVwiYXJyb3dSaWdodFwiXG5cdFx0XHRcdG9uQ2xpY2s9e3RoaXMuZ290b05leHR9XG5cdFx0XHRcdHRpdGxlPXt0aGlzLnByb3BzLnJpZ2h0QXJyb3dUaXRsZX1cblx0XHRcdFx0dHlwZT1cImJ1dHRvblwiXG5cdFx0XHQvPlxuXHRcdCk7XG5cdH1cblx0cmVuZGVyRGlhbG9nICgpIHtcblx0XHRjb25zdCB7XG5cdFx0XHRiYWNrZHJvcENsb3Nlc01vZGFsLFxuXHRcdFx0Y3VzdG9tQ29udHJvbHMsXG5cdFx0XHRpc09wZW4sXG5cdFx0XHRvbkNsb3NlLFxuXHRcdFx0c2hvd0Nsb3NlQnV0dG9uLFxuXHRcdFx0c2hvd1JvdGF0ZUJ1dHRvbixcblx0XHRcdHNob3dUaHVtYm5haWxzLFxuXHRcdFx0cm90YXRlQnV0dG9uVGl0bGUsXG5cdFx0XHR3aWR0aCxcblx0XHR9ID0gdGhpcy5wcm9wcztcblxuXHRcdGlmICghaXNPcGVuKSByZXR1cm4gPHNwYW4ga2V5PVwiY2xvc2VkXCIgLz47XG5cblx0XHRsZXQgb2Zmc2V0VGh1bWJuYWlscyA9IDA7XG5cdFx0aWYgKHNob3dUaHVtYm5haWxzKSB7XG5cdFx0XHRvZmZzZXRUaHVtYm5haWxzID0gdGhlbWUudGh1bWJuYWlsLnNpemUgKyB0aGVtZS5jb250YWluZXIuZ3V0dGVyLnZlcnRpY2FsO1xuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8Q29udGFpbmVyXG5cdFx0XHRcdGtleT1cIm9wZW5cIlxuXHRcdFx0XHRvbkNsaWNrPXshIWJhY2tkcm9wQ2xvc2VzTW9kYWwgJiYgb25DbG9zZX1cblx0XHRcdFx0b25Ub3VjaEVuZD17ISFiYWNrZHJvcENsb3Nlc01vZGFsICYmIG9uQ2xvc2V9XG5cdFx0XHQ+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5jb250ZW50KX0gc3R5bGU9e3sgbWFyZ2luQm90dG9tOiBvZmZzZXRUaHVtYm5haWxzLCBtYXhXaWR0aDogd2lkdGggfX0+XG5cdFx0XHRcdFx0PEhlYWRlclxuXHRcdFx0XHRcdFx0Y3VzdG9tQ29udHJvbHM9e2N1c3RvbUNvbnRyb2xzfVxuXHRcdFx0XHRcdFx0b25DbG9zZT17b25DbG9zZX1cblx0XHRcdFx0XHRcdG9uUm90YXRlPXt0aGlzLnJvdGF0ZX1cblx0XHRcdFx0XHRcdHNob3dDbG9zZUJ1dHRvbj17c2hvd0Nsb3NlQnV0dG9ufVxuXHRcdFx0XHRcdFx0Y2xvc2VCdXR0b25UaXRsZT17dGhpcy5wcm9wcy5jbG9zZUJ1dHRvblRpdGxlfVxuXHRcdFx0XHRcdFx0cm90YXRlQnV0dG9uVGl0bGU9e3JvdGF0ZUJ1dHRvblRpdGxlfVxuXHRcdFx0XHRcdFx0c2hvd1JvdGF0ZUJ1dHRvbj17c2hvd1JvdGF0ZUJ1dHRvbn1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdHt0aGlzLnJlbmRlckltYWdlcygpfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0e3RoaXMucmVuZGVyVGh1bWJuYWlscygpfVxuXHRcdFx0XHR7dGhpcy5yZW5kZXJBcnJvd1ByZXYoKX1cblx0XHRcdFx0e3RoaXMucmVuZGVyQXJyb3dOZXh0KCl9XG5cdFx0XHRcdDxTY3JvbGxMb2NrIC8+XG5cdFx0XHQ8L0NvbnRhaW5lcj5cblx0XHQpO1xuXHR9XG5cdHJlbmRlckltYWdlcyAoKSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0Y3VycmVudEltYWdlLFxuXHRcdFx0aW1hZ2VzLFxuXHRcdFx0aW1hZ2VDb3VudFNlcGFyYXRvcixcblx0XHRcdG9uQ2xpY2tJbWFnZSxcblx0XHRcdHNob3dJbWFnZUNvdW50LFxuXHRcdFx0c2hvd1RodW1ibmFpbHMsXG5cdFx0fSA9IHRoaXMucHJvcHM7XG5cblx0XHRpZiAoIWltYWdlcyB8fCAhaW1hZ2VzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cblx0XHRjb25zdCBpbWFnZSA9IGltYWdlc1tjdXJyZW50SW1hZ2VdO1xuXG5cdFx0bGV0IHNyY3NldDtcblx0XHRsZXQgc2l6ZXM7XG5cblx0XHRpZiAoaW1hZ2Uuc3Jjc2V0KSB7XG5cdFx0XHRzcmNzZXQgPSBpbWFnZS5zcmNzZXQuam9pbigpO1xuXHRcdFx0c2l6ZXMgPSAnMTAwdncnO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRodW1ibmFpbHNTaXplID0gc2hvd1RodW1ibmFpbHMgPyB0aGVtZS50aHVtYm5haWwuc2l6ZSA6IDA7XG5cdFx0Y29uc3QgaGVpZ2h0T2Zmc2V0ID0gYCR7dGhlbWUuaGVhZGVyLmhlaWdodCArIHRoZW1lLmZvb3Rlci5oZWlnaHQgKyB0aHVtYm5haWxzU2l6ZSArICh0aGVtZS5jb250YWluZXIuZ3V0dGVyLnZlcnRpY2FsKX1weGA7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGZpZ3VyZSBjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmZpZ3VyZSl9PlxuXHRcdFx0XHR7Lypcblx0XHRcdFx0XHRSZS1pbXBsZW1lbnQgd2hlbiByZWFjdCB3YXJuaW5nIFwidW5rbm93biBwcm9wc1wiXG5cdFx0XHRcdFx0aHR0cHM6Ly9mYi5tZS9yZWFjdC11bmtub3duLXByb3AgaXMgcmVzb2x2ZWRcblx0XHRcdFx0XHQ8U3dpcGVhYmxlIG9uU3dpcGVkTGVmdD17dGhpcy5nb3RvTmV4dH0gb25Td2lwZWRSaWdodD17dGhpcy5nb3RvUHJldn0gLz5cblx0XHRcdFx0Ki99XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPXtjc3MoY2xhc3Nlcy5pbWFnZVdyYXBwZXIpfT5cblx0XHRcdFx0XHQ8aW1nXG5cdFx0XHRcdFx0XHRjbGFzc05hbWU9e2NzcyhjbGFzc2VzLmltYWdlKX1cblx0XHRcdFx0XHRcdG9uQ2xpY2s9e29uQ2xpY2tJbWFnZSA/IG9uQ2xpY2tJbWFnZSA6IHRoaXMucHJvcHMuem9vbSA/IHRoaXMuem9vbSA6IG51bGx9XG5cdFx0XHRcdFx0XHRhbHQ9e2ltYWdlLmFsdH1cblx0XHRcdFx0XHRcdHNyYz17aW1hZ2Uuc3JjfVxuXHRcdFx0XHRcdFx0c3JjU2V0PXtzcmNzZXR9XG5cdFx0XHRcdFx0XHRzdHlsZT17e1xuXHRcdFx0XHRcdFx0XHRjdXJzb3I6IHRoaXMucHJvcHMuem9vbSA/ICF0aGlzLnN0YXRlLmlzWm9vbWVkID8gJ3pvb20taW4nIDogJ3pvb20tb3V0JyA6IG9uQ2xpY2tJbWFnZSA/ICdwb2ludGVyJyA6ICdhdXRvJyxcblx0XHRcdFx0XHRcdFx0bWF4SGVpZ2h0OiAhdGhpcy5zdGF0ZS5pc1pvb21lZCA/ICc2MzBweCcgOiAnMTIwdmgnLFxuXHRcdFx0XHRcdFx0XHRtYXhXaWR0aDogIXRoaXMuc3RhdGUuaXNab29tZWQgPyAnNTc0cHgnIDogJzEyMHZoJyxcblx0XHRcdFx0XHRcdFx0dHJhbnNmb3JtOiAhdGhpcy5zdGF0ZS5pc1pvb21lZCA/IGBzY2FsZSgxKSByb3RhdGUoJHt0aGlzLnN0YXRlLnJvdGF0ZX1kZWcpYCA6IGBzY2FsZSgxLjQpIHJvdGF0ZSgke3RoaXMuc3RhdGUucm90YXRlfWRlZylgLFxuXHRcdFx0XHRcdFx0XHRtYXJnaW46IHRoaXMuc3RhdGUubWFyZ2luLFxuXHRcdFx0XHRcdFx0XHR0cmFuc2l0aW9uOiAnYWxsIC4xcycsXG5cdFx0XHRcdFx0XHRcdGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuXHRcdFx0XHRcdFx0fX1cblx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRoaXMucHJvcHMuY29udGVudCA/IFxuXHRcdFx0XHRcdFx0XHQ8ZmlnY2FwdGlvblxuXHRcdFx0XHRcdFx0XHRcdGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuZmlnY2FwdGlvbil9XG5cdFx0XHRcdFx0XHRcdFx0c3R5bGU9e3tcblx0XHRcdFx0XHRcdFx0XHRcdGRpc3BsYXk6ICF0aGlzLnN0YXRlLmlzWm9vbWVkID8gJ2lubGluZS1ibG9jaycgOiAnbm9uZScsXG5cdFx0XHRcdFx0XHRcdFx0fX1cblx0XHRcdFx0XHRcdFx0XHRvbkNsaWNrPXt0aGlzLmV2ZW50UHJldmVudERlZmF1bHR9XG5cdFx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdFx0XHR7dGhpcy5wcm9wcy5jaGlsZHJlbn1cblx0XHRcdFx0XHRcdFx0PC9maWdjYXB0aW9uPlxuXHRcdFx0XHRcdFx0OiAnJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdDxGb290ZXJcblx0XHRcdFx0XHRjYXB0aW9uPXtpbWFnZXNbY3VycmVudEltYWdlXS5jYXB0aW9ufVxuXHRcdFx0XHRcdGNvdW50Q3VycmVudD17Y3VycmVudEltYWdlICsgMX1cblx0XHRcdFx0XHRjb3VudFNlcGFyYXRvcj17aW1hZ2VDb3VudFNlcGFyYXRvcn1cblx0XHRcdFx0XHRjb3VudFRvdGFsPXtpbWFnZXMubGVuZ3RofVxuXHRcdFx0XHRcdHNob3dDb3VudD17c2hvd0ltYWdlQ291bnR9XG5cdFx0XHRcdC8+XG5cdFx0XHQ8L2ZpZ3VyZT5cblx0XHQpO1xuXHR9XG5cdHJlbmRlclRodW1ibmFpbHMgKCkge1xuXHRcdGNvbnN0IHsgaW1hZ2VzLCBjdXJyZW50SW1hZ2UsIG9uQ2xpY2tUaHVtYm5haWwsIHNob3dUaHVtYm5haWxzLCB0aHVtYm5haWxPZmZzZXQgfSA9IHRoaXMucHJvcHM7XG5cblx0XHRpZiAoIXNob3dUaHVtYm5haWxzKSByZXR1cm47XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PFBhZ2luYXRlZFRodW1ibmFpbHNcblx0XHRcdFx0Y3VycmVudEltYWdlPXtjdXJyZW50SW1hZ2V9XG5cdFx0XHRcdGltYWdlcz17aW1hZ2VzfVxuXHRcdFx0XHRvZmZzZXQ9e3RodW1ibmFpbE9mZnNldH1cblx0XHRcdFx0b25DbGlja1RodW1ibmFpbD17b25DbGlja1RodW1ibmFpbH1cblx0XHRcdC8+XG5cdFx0KTtcblx0fVxuXHRyZW5kZXIgKCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8UG9ydGFsPlxuXHRcdFx0XHR7dGhpcy5yZW5kZXJEaWFsb2coKX1cblx0XHRcdDwvUG9ydGFsPlxuXHRcdCk7XG5cdH1cbn1cblxuTGlnaHRib3gucHJvcFR5cGVzID0ge1xuXHRiYWNrZHJvcENsb3Nlc01vZGFsOiBQcm9wVHlwZXMuYm9vbCxcblx0Y2xvc2VCdXR0b25UaXRsZTogUHJvcFR5cGVzLnN0cmluZyxcblx0Y3VycmVudEltYWdlOiBQcm9wVHlwZXMubnVtYmVyLFxuXHRjdXN0b21Db250cm9sczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm5vZGUpLFxuXHRlbmFibGVLZXlib2FyZElucHV0OiBQcm9wVHlwZXMuYm9vbCxcblx0aW1hZ2VDb3VudFNlcGFyYXRvcjogUHJvcFR5cGVzLnN0cmluZyxcblx0aW1hZ2VzOiBQcm9wVHlwZXMuYXJyYXlPZihcblx0XHRQcm9wVHlwZXMuc2hhcGUoe1xuXHRcdFx0c3JjOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cdFx0XHRzcmNzZXQ6IFByb3BUeXBlcy5hcnJheSxcblx0XHRcdGNhcHRpb246IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5lbGVtZW50XSksXG5cdFx0XHR0aHVtYm5haWw6IFByb3BUeXBlcy5zdHJpbmcsXG5cdFx0fSlcblx0KS5pc1JlcXVpcmVkLFxuXHRpc09wZW46IFByb3BUeXBlcy5ib29sLFxuXHRsZWZ0QXJyb3dUaXRsZTogUHJvcFR5cGVzLnN0cmluZyxcblx0b25DbGlja0ltYWdlOiBQcm9wVHlwZXMuZnVuYyxcblx0b25DbGlja05leHQ6IFByb3BUeXBlcy5mdW5jLFxuXHRvbkNsaWNrUHJldjogUHJvcFR5cGVzLmZ1bmMsXG5cdG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cdHByZWxvYWROZXh0SW1hZ2U6IFByb3BUeXBlcy5ib29sLFxuXHRyaWdodEFycm93VGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXG5cdHNob3dDbG9zZUJ1dHRvbjogUHJvcFR5cGVzLmJvb2wsXG5cdHNob3dJbWFnZUNvdW50OiBQcm9wVHlwZXMuYm9vbCxcblx0c2hvd1RodW1ibmFpbHM6IFByb3BUeXBlcy5ib29sLFxuXHR0aGVtZTogUHJvcFR5cGVzLm9iamVjdCxcblx0dGh1bWJuYWlsT2Zmc2V0OiBQcm9wVHlwZXMubnVtYmVyLFxuXHR3aWR0aDogUHJvcFR5cGVzLm51bWJlcixcbn07XG5MaWdodGJveC5kZWZhdWx0UHJvcHMgPSB7XG5cdGNsb3NlQnV0dG9uVGl0bGU6ICdDbG9zZSAoRXNjKScsXG5cdHJvdGF0ZUJ1dHRvblRpdGxlOiAnUm90YXRlJyxcblx0Y3VycmVudEltYWdlOiAwLFxuXHRlbmFibGVLZXlib2FyZElucHV0OiB0cnVlLFxuXHRpbWFnZUNvdW50U2VwYXJhdG9yOiAnIG9mICcsXG5cdGxlZnRBcnJvd1RpdGxlOiAnUHJldmlvdXMgKExlZnQgYXJyb3cga2V5KScsXG5cdG9uQ2xpY2tTaG93TmV4dEltYWdlOiB0cnVlLFxuXHRwcmVsb2FkTmV4dEltYWdlOiB0cnVlLFxuXHRyaWdodEFycm93VGl0bGU6ICdOZXh0IChSaWdodCBhcnJvdyBrZXkpJyxcblx0c2hvd0Nsb3NlQnV0dG9uOiB0cnVlLFxuXHRzaG93SW1hZ2VDb3VudDogdHJ1ZSxcblx0c2hvd1JvdGF0ZUJ1dHRvbjogdHJ1ZSxcblx0dGhlbWU6IHt9LFxuXHR0aHVtYm5haWxPZmZzZXQ6IDIsXG5cdHdpZHRoOiAxMDI0LFxuXHR6b29tOiBmYWxzZSxcblx0Y29udGVudDogZmFsc2UsXG59O1xuTGlnaHRib3guY2hpbGRDb250ZXh0VHlwZXMgPSB7XG5cdHRoZW1lOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG59O1xuXG5jb25zdCBjbGFzc2VzID0gU3R5bGVTaGVldC5jcmVhdGUoe1xuXHRjb250ZW50OiB7XG5cdFx0cG9zaXRpb246ICdyZWxhdGl2ZScsXG5cdH0sXG5cdGZpZ3VyZToge1xuXHRcdG1hcmdpbjogMCwgLy8gcmVtb3ZlIGJyb3dzZXIgZGVmYXVsdFxuXHR9LFxuXHRpbWFnZVdyYXBwZXI6IHtcblx0XHRkaXNwbGF5OiAnZmxleCcsXG5cdFx0YWxpZ25JdGVtczogJ2NlbnRlcicsXG5cdFx0anVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuXHRcdGJhY2tncm91bmQ6ICcjMDAwJyxcblx0fSxcblx0aW1hZ2U6IHtcblx0XHRkaXNwbGF5OiAnYmxvY2snLCAvLyByZW1vdmVzIGJyb3dzZXIgZGVmYXVsdCBndXR0ZXJcblx0XHRoZWlnaHQ6ICdhdXRvJyxcblx0XHRtYXJnaW46ICcwIGF1dG8nLCAvLyBtYWludGFpbiBjZW50ZXIgb24gdmVyeSBzaG9ydCBzY3JlZW5zIE9SIHZlcnkgbmFycm93IGltYWdlXG5cdFx0bWF4V2lkdGg6ICcxMDAlJyxcblxuXHRcdC8vIGRpc2FibGUgdXNlciBzZWxlY3Rcblx0XHRXZWJraXRUb3VjaENhbGxvdXQ6ICdub25lJyxcblx0XHR1c2VyU2VsZWN0OiAnbm9uZScsXG5cdH0sXG5cdGZpZ2NhcHRpb246IHtcblx0XHRiYWNrZ3JvdW5kOiAnI2ZmZicsXG5cdFx0d2lkdGg6ICc0NTBweCcsXG5cdFx0dmVydGljYWxBbGlnbjogJ3RvcCcsXG5cdFx0aGVpZ2h0OiAnNjMwcHgnLFxuXHRcdG92ZXJmbG93OiAnYXV0bycsXG5cdH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTGlnaHRib3g7XG4iXX0=
