require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _componentsGallery = require('./components/Gallery');

var _componentsGallery2 = _interopRequireDefault(_componentsGallery);

function makeUnsplashSrc(id) {
	return 'https://images.unsplash.com/photo-' + id + '?dpr=2&auto=format&w=1024&h=1024';
}
function makeUnsplashSrcSet(id, size) {
	return 'https://images.unsplash.com/photo-' + id + '?dpr=2&auto=format&w=' + size + ' ' + size + 'w';
}
function makeUnsplashThumbnail(id) {
	var orientation = arguments.length <= 1 || arguments[1] === undefined ? 'landscape' : arguments[1];

	var dimensions = orientation === 'square' ? 'w=300&h=300' : 'w=240&h=159';

	return 'https://images.unsplash.com/photo-' + id + '?dpr=2&auto=format&crop=faces&fit=crop&' + dimensions;
}

// Unsplash images from the "Spirit Animals" collection
// https://unsplash.com/collections/158825/spirit-animals

var DEFAULT_IMAGES = [{ id: '1470619549108-b85c56fe5be8', caption: 'Photo by Alan Emery', orientation: 'square', useForDemo: true }, // https://unsplash.com/photos/SYzUF6XcWBY (Flamingo)
{ id: '1471079502516-250c19af6928', caption: 'Photo by Jeremy Bishop', orientation: 'landscape', useForDemo: true }, // https://unsplash.com/photos/GIpGxe2_cT4 (Turtle)
{ id: '1454023492550-5696f8ff10e1', caption: 'Photo by Jessica Weiller', orientation: 'landscape', useForDemo: true }, // https://unsplash.com/photos/LmVSKeDy6EA (Tiger)
{ id: '1470854989922-5be2f7456d78', caption: 'Photo by Piotr Łaskawski', orientation: 'landscape', useForDemo: true }, // https://unsplash.com/photos/GXMr7BadXQo (Hedgehog)
{ id: '1470317596697-cbdeda56f999', caption: 'Photo by Michel Bosma', orientation: 'landscape', useForDemo: true }];
// https://unsplash.com/photos/XgF9e93Tkt0 (Ladybug)
var THEMED_IMAGES = [{ id: '1471101173712-b9884175254e', caption: 'Photo by Pedro Lastra', orientation: 'square', useForDemo: true }, // https://unsplash.com/photos/5oRzZU5uwSM (Dragonfly)
{ id: '1471127432458-65206be149c9', caption: 'Photo by Ernesto Velázquez', orientation: 'landscape', useForDemo: true }, // https://unsplash.com/photos/Kpgt4pl03O0 (Deer)
{ id: '1470777639313-60af88918203', caption: 'Photo by Cris Saur', orientation: 'landscape', useForDemo: true }, // https://unsplash.com/photos/GNUcUx-iObg (Koala)
{ id: '1453550486481-aa4175b013ea', caption: 'Photo by Benjamin Pley', orientation: 'landscape', useForDemo: true }, // https://unsplash.com/photos/WiSeaZ4E6ZI (Elephant)
{ id: '1415904663467-dfdc16cae794', caption: 'Photo by Levi Saunders', orientation: 'landscape', useForDemo: true }];
// https://unsplash.com/photos/NUMlxTPsznM (Coyote)
var THUMBNAIL_IMAGES = [{ id: '1454991727061-be514eae86f7', caption: 'Photo by Thomas Kelley', orientation: 'square', useForDemo: true }, // https://unsplash.com/photos/t20pc32VbrU (Hump Back Whale)
{ id: '1455717974081-0436a066bb96', caption: 'Photo by Teddy Kelley', orientation: 'landscape', useForDemo: true }, // https://unsplash.com/photos/cmKPOUgdmWc (Deer)
{ id: '1460899960812-f6ee1ecaf117', caption: 'Photo by Jay Ruzesky', orientation: 'landscape', useForDemo: true }, // https://unsplash.com/photos/h13Y8vyIXNU (Walrus)
{ id: '1456926631375-92c8ce872def', caption: 'Photo by Gwen Weustink', orientation: 'landscape', useForDemo: true }, // https://unsplash.com/photos/I3C1sSXj1i8 (Leopard)
{ id: '1452274381522-521513015433', caption: 'Photo by Adam Willoughby-Knox', orientation: 'landscape', useForDemo: true }, // https://unsplash.com/photos/_snqARKTgoc (Mother and Cubs)
{ id: '1471145653077-54c6f0aae511', caption: 'Photo by Boris Smokrovic', orientation: 'landscape' }, // https://unsplash.com/photos/n0feC_PWFdk (Dragonfly)
{ id: '1471005197911-88e9d4a7834d', caption: 'Photo by Gaetano Cessati', orientation: 'landscape' }, // https://unsplash.com/photos/YOX8ZMTo7hk (Baby Crocodile)
{ id: '1470583190240-bd6bbde8a569', caption: 'Photo by Alan Emery', orientation: 'landscape' }, // https://unsplash.com/photos/emTCWiq2txk (Beetle)
{ id: '1470688090067-6d429c0b2600', caption: 'Photo by Ján Jakub Naništa', orientation: 'landscape' }, // https://unsplash.com/photos/xqjO-lx39B4 (Scottish Highland Cow)
{ id: '1470742292565-de43c4b02b57', caption: 'Photo by Eric Knoll', orientation: 'landscape' }];

// https://unsplash.com/photos/DmOCkOnx-MQ (Cheetah)
// https://unsplash.com/photos/NUMlxTPsznM coyote?
var theme = {
	// container
	container: { background: 'rgba(255, 255, 255, 0.9)' },

	// arrows
	arrow: {
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		fill: '#222',
		opacity: 0.6,
		transition: 'opacity 200ms',

		':hover': {
			opacity: 1
		}
	},
	arrow__size__medium: {
		borderRadius: 40,
		height: 40,
		marginTop: -20,

		'@media (min-width: 768px)': {
			height: 70,
			padding: 15
		}
	},
	arrow__direction__left: { marginLeft: 10 },
	arrow__direction__right: { marginRight: 10 },

	// header
	close: {
		fill: '#D40000',
		opacity: 0.6,
		transition: 'all 200ms',

		':hover': {
			opacity: 1
		}
	},

	// footer
	footer: {
		color: 'black'
	},
	footerCount: {
		color: 'rgba(0, 0, 0, 0.6)'
	},

	// thumbnails
	thumbnail: {},
	thumbnail__active: {
		boxShadow: '0 0 0 2px #00D8FF'
	}
};

(0, _reactDom.render)(_react2['default'].createElement(
	'div',
	null,
	_react2['default'].createElement(
		'div',
		{ style: { marginBottom: 40 } },
		_react2['default'].createElement(
			'p',
			null,
			'Photos courtesy of ',
			_react2['default'].createElement(
				'a',
				{ href: 'https://unsplash.com/', target: '_blank' },
				'Unsplash'
			),
			'. Use your keyboard to navigate ',
			_react2['default'].createElement(
				'kbd',
				null,
				'left'
			),
			' ',
			_react2['default'].createElement(
				'kbd',
				null,
				'right'
			),
			' ',
			_react2['default'].createElement(
				'kbd',
				null,
				'esc'
			),
			' — Also, try resizing your browser window.'
		)
	),
	_react2['default'].createElement(
		'h3',
		null,
		'Default Options'
	),
	_react2['default'].createElement(_componentsGallery2['default'], { images: DEFAULT_IMAGES.map(function (_ref) {
			var caption = _ref.caption;
			var id = _ref.id;
			var orientation = _ref.orientation;
			var useForDemo = _ref.useForDemo;
			return {
				src: makeUnsplashSrc(id),
				thumbnail: makeUnsplashThumbnail(id, orientation),
				srcset: [makeUnsplashSrcSet(id, 1024), makeUnsplashSrcSet(id, 800), makeUnsplashSrcSet(id, 500), makeUnsplashSrcSet(id, 320)],
				caption: caption,
				orientation: orientation,
				useForDemo: useForDemo
			};
		}) }),
	_react2['default'].createElement(
		'h3',
		null,
		'With Thumbnails'
	),
	_react2['default'].createElement(_componentsGallery2['default'], { images: THUMBNAIL_IMAGES.map(function (_ref2) {
			var caption = _ref2.caption;
			var id = _ref2.id;
			var orientation = _ref2.orientation;
			var useForDemo = _ref2.useForDemo;
			return {
				src: makeUnsplashSrc(id),
				thumbnail: makeUnsplashThumbnail(id, orientation),
				srcset: [makeUnsplashSrcSet(id, 1024), makeUnsplashSrcSet(id, 800), makeUnsplashSrcSet(id, 500), makeUnsplashSrcSet(id, 320)],
				caption: caption,
				orientation: orientation,
				useForDemo: useForDemo
			};
		}), showThumbnails: true }),
	_react2['default'].createElement(
		'h3',
		null,
		'Themed Lightbox'
	),
	_react2['default'].createElement(_componentsGallery2['default'], { images: THEMED_IMAGES.map(function (_ref3) {
			var caption = _ref3.caption;
			var id = _ref3.id;
			var orientation = _ref3.orientation;
			var useForDemo = _ref3.useForDemo;
			return {
				src: makeUnsplashSrc(id),
				thumbnail: makeUnsplashThumbnail(id, orientation),
				srcset: [makeUnsplashSrcSet(id, 1024), makeUnsplashSrcSet(id, 800), makeUnsplashSrcSet(id, 500), makeUnsplashSrcSet(id, 320)],
				caption: caption,
				orientation: orientation,
				useForDemo: useForDemo
			};
		}), theme: theme, showThumbnails: true })
), document.getElementById('example'));

},{"./components/Gallery":2,"react":undefined,"react-dom":undefined}],2:[function(require,module,exports){
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

var _aphroditeNoImportant = require('aphrodite/no-important');

var _reactImages = require('react-images');

var _reactImages2 = _interopRequireDefault(_reactImages);

var Gallery = (function (_Component) {
	_inherits(Gallery, _Component);

	function Gallery() {
		_classCallCheck(this, Gallery);

		_get(Object.getPrototypeOf(Gallery.prototype), 'constructor', this).call(this);

		this.state = {
			lightboxIsOpen: false,
			currentImage: 0
		};

		this.closeLightbox = this.closeLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
		this.gotoImage = this.gotoImage.bind(this);
		this.handleClickImage = this.handleClickImage.bind(this);
		this.openLightbox = this.openLightbox.bind(this);
	}

	_createClass(Gallery, [{
		key: 'openLightbox',
		value: function openLightbox(index, event) {
			event.preventDefault();
			this.setState({
				currentImage: index,
				lightboxIsOpen: true
			});
		}
	}, {
		key: 'closeLightbox',
		value: function closeLightbox() {
			this.setState({
				currentImage: 0,
				lightboxIsOpen: false
			});
		}
	}, {
		key: 'gotoPrevious',
		value: function gotoPrevious() {
			this.setState({
				currentImage: this.state.currentImage - 1
			});
		}
	}, {
		key: 'gotoNext',
		value: function gotoNext() {
			this.setState({
				currentImage: this.state.currentImage + 1
			});
		}
	}, {
		key: 'gotoImage',
		value: function gotoImage(index) {
			this.setState({
				currentImage: index
			});
		}
	}, {
		key: 'handleClickImage',
		value: function handleClickImage() {
			if (this.state.currentImage === this.props.images.length - 1) return;

			this.gotoNext();
		}
	}, {
		key: 'renderGallery',
		value: function renderGallery() {
			var _this = this;

			var images = this.props.images;

			if (!images) return;

			var gallery = images.filter(function (i) {
				return i.useForDemo;
			}).map(function (obj, i) {
				return _react2['default'].createElement(
					'a',
					{
						href: obj.src,
						className: (0, _aphroditeNoImportant.css)(classes.thumbnail, classes[obj.orientation]),
						key: i,
						onClick: function (e) {
							return _this.openLightbox(i, e);
						}
					},
					_react2['default'].createElement('img', { src: obj.thumbnail, className: (0, _aphroditeNoImportant.css)(classes.source) })
				);
			});

			return _react2['default'].createElement(
				'div',
				{ className: (0, _aphroditeNoImportant.css)(classes.gallery) },
				gallery
			);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2['default'].createElement(
				'div',
				{ className: 'section' },
				this.props.heading && _react2['default'].createElement(
					'h2',
					null,
					this.props.heading
				),
				this.props.subheading && _react2['default'].createElement(
					'p',
					null,
					this.props.subheading
				),
				this.renderGallery(),
				_react2['default'].createElement(
					_reactImages2['default'],
					{
						currentImage: this.state.currentImage,
						images: this.props.images,
						isOpen: this.state.lightboxIsOpen,
						onClickNext: this.gotoNext,
						onClickPrev: this.gotoPrevious,
						onClickThumbnail: this.gotoImage,
						onClose: this.closeLightbox,
						showThumbnails: this.props.showThumbnails,
						theme: this.props.theme,
						backdropClosesModal: true,
						zoom: 1,
						content: 1
					},
					_react2['default'].createElement(
						'p',
						null,
						'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime ipsum dolores ut incidunt perspiciatis dignissimos culpa consequatur ducimus quia, asperiores aliquam earum error nulla ipsam a similique, aut et rerum?'
					)
				)
			);
		}
	}]);

	return Gallery;
})(_react.Component);

;

Gallery.displayName = 'Gallery';
Gallery.propTypes = {
	heading: _react.PropTypes.string,
	images: _react.PropTypes.array,
	showThumbnails: _react.PropTypes.bool,
	subheading: _react.PropTypes.string
};

var gutter = {
	small: 2,
	large: 4
};
var classes = _aphroditeNoImportant.StyleSheet.create({
	gallery: {
		marginRight: -gutter.small,
		overflow: 'hidden',

		'@media (min-width: 500px)': {
			marginRight: -gutter.large
		}
	},

	// anchor
	thumbnail: {
		boxSizing: 'border-box',
		display: 'block',
		float: 'left',
		lineHeight: 0,
		paddingRight: gutter.small,
		paddingBottom: gutter.small,
		overflow: 'hidden',

		'@media (min-width: 500px)': {
			paddingRight: gutter.large,
			paddingBottom: gutter.large
		}
	},

	// orientation
	landscape: {
		width: '30%'
	},
	square: {
		paddingBottom: 0,
		width: '40%',

		'@media (min-width: 500px)': {
			paddingBottom: 0
		}
	},

	// actual <img />
	source: {
		border: 0,
		display: 'block',
		height: 'auto',
		maxWidth: '100%',
		width: 'auto'
	}
});

exports['default'] = Gallery;
module.exports = exports['default'];

},{"aphrodite/no-important":10,"react":undefined,"react-images":undefined}],3:[function(require,module,exports){
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
},{"./inject":5,"./util":9}],4:[function(require,module,exports){
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
},{"../lib/staticPrefixData":8,"./ordered-elements":7,"./util":9,"inline-style-prefixer/static/createPrefixer":16}],5:[function(require,module,exports){
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
},{"./generate":4,"./ordered-elements":7,"./util":9,"asap":11}],6:[function(require,module,exports){

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
},{"./exports":3,"./generate":4}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{"inline-style-prefixer/static/plugins/calc":17,"inline-style-prefixer/static/plugins/crossFade":18,"inline-style-prefixer/static/plugins/cursor":19,"inline-style-prefixer/static/plugins/filter":20,"inline-style-prefixer/static/plugins/flex":21,"inline-style-prefixer/static/plugins/flexboxIE":22,"inline-style-prefixer/static/plugins/flexboxOld":23,"inline-style-prefixer/static/plugins/gradient":24,"inline-style-prefixer/static/plugins/imageSet":25,"inline-style-prefixer/static/plugins/position":26,"inline-style-prefixer/static/plugins/sizing":27,"inline-style-prefixer/static/plugins/transition":28}],9:[function(require,module,exports){
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
},{"string-hash":34}],10:[function(require,module,exports){
module.exports = require('./lib/no-important.js');

},{"./lib/no-important.js":6}],11:[function(require,module,exports){
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

},{"./raw":12}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
},{"hyphenate-style-name":15}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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
},{"../utils/addNewValuesOnly":29,"../utils/isObject":31,"../utils/prefixProperty":32,"../utils/prefixValue":33}],17:[function(require,module,exports){
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
},{"css-in-js-utils/lib/isPrefixedValue":14}],18:[function(require,module,exports){
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
},{"css-in-js-utils/lib/isPrefixedValue":14}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
},{"css-in-js-utils/lib/isPrefixedValue":14}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{"css-in-js-utils/lib/isPrefixedValue":14}],25:[function(require,module,exports){
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
},{"css-in-js-utils/lib/isPrefixedValue":14}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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
},{"../../utils/capitalizeString":30,"css-in-js-utils/lib/hyphenateProperty":13,"css-in-js-utils/lib/isPrefixedValue":14}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = capitalizeString;
function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
module.exports = exports["default"];
},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isObject;
function isObject(value) {
  return value instanceof Object && !Array.isArray(value);
}
module.exports = exports["default"];
},{}],32:[function(require,module,exports){
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
},{"./capitalizeString":30}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbXVjYWhpdC9Eb2N1bWVudHMvd29ya3MvcmVhY3QtaW1hZ2VzLXRlbXAvZXhhbXBsZXMvc3JjL2FwcC5qcyIsIi9Vc2Vycy9tdWNhaGl0L0RvY3VtZW50cy93b3Jrcy9yZWFjdC1pbWFnZXMtdGVtcC9leGFtcGxlcy9zcmMvY29tcG9uZW50cy9HYWxsZXJ5LmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvZXhwb3J0cy5qcyIsIm5vZGVfbW9kdWxlcy9hcGhyb2RpdGUvbGliL2dlbmVyYXRlLmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvaW5qZWN0LmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvbm8taW1wb3J0YW50LmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9saWIvb3JkZXJlZC1lbGVtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9hcGhyb2RpdGUvbGliL3N0YXRpY1ByZWZpeERhdGEuanMiLCJub2RlX21vZHVsZXMvYXBocm9kaXRlL2xpYi91dGlsLmpzIiwibm9kZV9tb2R1bGVzL2FwaHJvZGl0ZS9uby1pbXBvcnRhbnQuanMiLCJub2RlX21vZHVsZXMvYXNhcC9icm93c2VyLWFzYXAuanMiLCJub2RlX21vZHVsZXMvYXNhcC9icm93c2VyLXJhdy5qcyIsIm5vZGVfbW9kdWxlcy9jc3MtaW4tanMtdXRpbHMvbGliL2h5cGhlbmF0ZVByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2Nzcy1pbi1qcy11dGlscy9saWIvaXNQcmVmaXhlZFZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2h5cGhlbmF0ZS1zdHlsZS1uYW1lL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvY3JlYXRlUHJlZml4ZXIuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2NhbGMuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2Nyb3NzRmFkZS5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvY3Vyc29yLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9maWx0ZXIuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2ZsZXguanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2ZsZXhib3hJRS5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZmxleGJveE9sZC5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZ3JhZGllbnQuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2ltYWdlU2V0LmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9wb3NpdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvc2l6aW5nLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy90cmFuc2l0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci91dGlscy9hZGROZXdWYWx1ZXNPbmx5LmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci91dGlscy9jYXBpdGFsaXplU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2lubGluZS1zdHlsZS1wcmVmaXhlci91dGlscy9pc09iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9pbmxpbmUtc3R5bGUtcHJlZml4ZXIvdXRpbHMvcHJlZml4UHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvaW5saW5lLXN0eWxlLXByZWZpeGVyL3V0aWxzL3ByZWZpeFZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL3N0cmluZy1oYXNoL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztxQkNBa0IsT0FBTzs7Ozt3QkFDRixXQUFXOztpQ0FDZCxzQkFBc0I7Ozs7QUFFMUMsU0FBUyxlQUFlLENBQUUsRUFBRSxFQUFFO0FBQzdCLCtDQUE0QyxFQUFFLHNDQUFtQztDQUNqRjtBQUNELFNBQVMsa0JBQWtCLENBQUUsRUFBRSxFQUFFLElBQUksRUFBRTtBQUN0QywrQ0FBNEMsRUFBRSw2QkFBd0IsSUFBSSxTQUFJLElBQUksT0FBSTtDQUN0RjtBQUNELFNBQVMscUJBQXFCLENBQUUsRUFBRSxFQUE2QjtLQUEzQixXQUFXLHlEQUFHLFdBQVc7O0FBQzVELEtBQU0sVUFBVSxHQUFHLFdBQVcsS0FBSyxRQUFRLEdBQ3hDLGFBQWEsR0FDYixhQUFhLENBQUM7O0FBRWpCLCtDQUE0QyxFQUFFLCtDQUEwQyxVQUFVLENBQUc7Q0FDckc7Ozs7O0FBS0QsSUFBTSxjQUFjLEdBQUcsQ0FDdEIsRUFBRSxFQUFFLEVBQUUsNEJBQTRCLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTtBQUM3RyxFQUFFLEVBQUUsRUFBRSw0QkFBNEIsRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFO0FBQ25ILEVBQUUsRUFBRSxFQUFFLDRCQUE0QixFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7QUFDckgsRUFBRSxFQUFFLEVBQUUsNEJBQTRCLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFF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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUtBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBHYWxsZXJ5IGZyb20gJy4vY29tcG9uZW50cy9HYWxsZXJ5JztcblxuZnVuY3Rpb24gbWFrZVVuc3BsYXNoU3JjIChpZCkge1xuXHRyZXR1cm4gYGh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0ke2lkfT9kcHI9MiZhdXRvPWZvcm1hdCZ3PTEwMjQmaD0xMDI0YDtcbn1cbmZ1bmN0aW9uIG1ha2VVbnNwbGFzaFNyY1NldCAoaWQsIHNpemUpIHtcblx0cmV0dXJuIGBodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tJHtpZH0/ZHByPTImYXV0bz1mb3JtYXQmdz0ke3NpemV9ICR7c2l6ZX13YDtcbn1cbmZ1bmN0aW9uIG1ha2VVbnNwbGFzaFRodW1ibmFpbCAoaWQsIG9yaWVudGF0aW9uID0gJ2xhbmRzY2FwZScpIHtcblx0Y29uc3QgZGltZW5zaW9ucyA9IG9yaWVudGF0aW9uID09PSAnc3F1YXJlJ1xuXHRcdD8gJ3c9MzAwJmg9MzAwJ1xuXHRcdDogJ3c9MjQwJmg9MTU5JztcblxuXHRyZXR1cm4gYGh0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0ke2lkfT9kcHI9MiZhdXRvPWZvcm1hdCZjcm9wPWZhY2VzJmZpdD1jcm9wJiR7ZGltZW5zaW9uc31gO1xufVxuXG4vLyBVbnNwbGFzaCBpbWFnZXMgZnJvbSB0aGUgXCJTcGlyaXQgQW5pbWFsc1wiIGNvbGxlY3Rpb25cbi8vIGh0dHBzOi8vdW5zcGxhc2guY29tL2NvbGxlY3Rpb25zLzE1ODgyNS9zcGlyaXQtYW5pbWFsc1xuXG5jb25zdCBERUZBVUxUX0lNQUdFUyA9IFtcblx0eyBpZDogJzE0NzA2MTk1NDkxMDgtYjg1YzU2ZmU1YmU4JywgY2FwdGlvbjogJ1Bob3RvIGJ5IEFsYW4gRW1lcnknLCBvcmllbnRhdGlvbjogJ3NxdWFyZScsIHVzZUZvckRlbW86IHRydWUgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL1NZelVGNlhjV0JZIChGbGFtaW5nbylcblx0eyBpZDogJzE0NzEwNzk1MDI1MTYtMjUwYzE5YWY2OTI4JywgY2FwdGlvbjogJ1Bob3RvIGJ5IEplcmVteSBCaXNob3AnLCBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZScsIHVzZUZvckRlbW86IHRydWUgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL0dJcEd4ZTJfY1Q0IChUdXJ0bGUpXG5cdHsgaWQ6ICcxNDU0MDIzNDkyNTUwLTU2OTZmOGZmMTBlMScsIGNhcHRpb246ICdQaG90byBieSBKZXNzaWNhIFdlaWxsZXInLCBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZScsIHVzZUZvckRlbW86IHRydWUgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL0xtVlNLZUR5NkVBIChUaWdlcilcblx0eyBpZDogJzE0NzA4NTQ5ODk5MjItNWJlMmY3NDU2ZDc4JywgY2FwdGlvbjogJ1Bob3RvIGJ5IFBpb3RyIMWBYXNrYXdza2knLCBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZScsIHVzZUZvckRlbW86IHRydWUgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL0dYTXI3QmFkWFFvIChIZWRnZWhvZylcblx0eyBpZDogJzE0NzAzMTc1OTY2OTctY2JkZWRhNTZmOTk5JywgY2FwdGlvbjogJ1Bob3RvIGJ5IE1pY2hlbCBCb3NtYScsIG9yaWVudGF0aW9uOiAnbGFuZHNjYXBlJywgdXNlRm9yRGVtbzogdHJ1ZSB9LCAvLyBodHRwczovL3Vuc3BsYXNoLmNvbS9waG90b3MvWGdGOWU5M1RrdDAgKExhZHlidWcpXG5dO1xuY29uc3QgVEhFTUVEX0lNQUdFUyA9IFtcblx0eyBpZDogJzE0NzExMDExNzM3MTItYjk4ODQxNzUyNTRlJywgY2FwdGlvbjogJ1Bob3RvIGJ5IFBlZHJvIExhc3RyYScsIG9yaWVudGF0aW9uOiAnc3F1YXJlJywgdXNlRm9yRGVtbzogdHJ1ZSB9LCAvLyBodHRwczovL3Vuc3BsYXNoLmNvbS9waG90b3MvNW9SelpVNXV3U00gKERyYWdvbmZseSlcblx0eyBpZDogJzE0NzExMjc0MzI0NTgtNjUyMDZiZTE0OWM5JywgY2FwdGlvbjogJ1Bob3RvIGJ5IEVybmVzdG8gVmVsw6F6cXVleicsIG9yaWVudGF0aW9uOiAnbGFuZHNjYXBlJywgdXNlRm9yRGVtbzogdHJ1ZSB9LCAvLyBodHRwczovL3Vuc3BsYXNoLmNvbS9waG90b3MvS3BndDRwbDAzTzAgKERlZXIpXG5cdHsgaWQ6ICcxNDcwNzc3NjM5MzEzLTYwYWY4ODkxODIwMycsIGNhcHRpb246ICdQaG90byBieSBDcmlzIFNhdXInLCBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZScsIHVzZUZvckRlbW86IHRydWUgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL0dOVWNVeC1pT2JnIChLb2FsYSlcblx0eyBpZDogJzE0NTM1NTA0ODY0ODEtYWE0MTc1YjAxM2VhJywgY2FwdGlvbjogJ1Bob3RvIGJ5IEJlbmphbWluIFBsZXknLCBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZScsIHVzZUZvckRlbW86IHRydWUgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL1dpU2VhWjRFNlpJIChFbGVwaGFudClcblx0eyBpZDogJzE0MTU5MDQ2NjM0NjctZGZkYzE2Y2FlNzk0JywgY2FwdGlvbjogJ1Bob3RvIGJ5IExldmkgU2F1bmRlcnMnLCBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZScsIHVzZUZvckRlbW86IHRydWUgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL05VTWx4VFBzem5NIChDb3lvdGUpXG5dO1xuY29uc3QgVEhVTUJOQUlMX0lNQUdFUyA9IFtcblx0eyBpZDogJzE0NTQ5OTE3MjcwNjEtYmU1MTRlYWU4NmY3JywgY2FwdGlvbjogJ1Bob3RvIGJ5IFRob21hcyBLZWxsZXknLCBvcmllbnRhdGlvbjogJ3NxdWFyZScsIHVzZUZvckRlbW86IHRydWUgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL3QyMHBjMzJWYnJVIChIdW1wIEJhY2sgV2hhbGUpXG5cdHsgaWQ6ICcxNDU1NzE3OTc0MDgxLTA0MzZhMDY2YmI5NicsIGNhcHRpb246ICdQaG90byBieSBUZWRkeSBLZWxsZXknLCBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZScsIHVzZUZvckRlbW86IHRydWUgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL2NtS1BPVWdkbVdjIChEZWVyKVxuXHR7IGlkOiAnMTQ2MDg5OTk2MDgxMi1mNmVlMWVjYWYxMTcnLCBjYXB0aW9uOiAnUGhvdG8gYnkgSmF5IFJ1emVza3knLCBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZScsIHVzZUZvckRlbW86IHRydWUgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL2gxM1k4dnlJWE5VIChXYWxydXMpXG5cdHsgaWQ6ICcxNDU2OTI2NjMxMzc1LTkyYzhjZTg3MmRlZicsIGNhcHRpb246ICdQaG90byBieSBHd2VuIFdldXN0aW5rJywgb3JpZW50YXRpb246ICdsYW5kc2NhcGUnLCB1c2VGb3JEZW1vOiB0cnVlIH0sIC8vIGh0dHBzOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9JM0Mxc1NYajFpOCAoTGVvcGFyZClcblx0eyBpZDogJzE0NTIyNzQzODE1MjItNTIxNTEzMDE1NDMzJywgY2FwdGlvbjogJ1Bob3RvIGJ5IEFkYW0gV2lsbG91Z2hieS1Lbm94Jywgb3JpZW50YXRpb246ICdsYW5kc2NhcGUnLCB1c2VGb3JEZW1vOiB0cnVlIH0sIC8vIGh0dHBzOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9fc25xQVJLVGdvYyAoTW90aGVyIGFuZCBDdWJzKVxuXHR7IGlkOiAnMTQ3MTE0NTY1MzA3Ny01NGM2ZjBhYWU1MTEnLCBjYXB0aW9uOiAnUGhvdG8gYnkgQm9yaXMgU21va3JvdmljJywgb3JpZW50YXRpb246ICdsYW5kc2NhcGUnIH0sIC8vIGh0dHBzOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9uMGZlQ19QV0ZkayAoRHJhZ29uZmx5KVxuXHR7IGlkOiAnMTQ3MTAwNTE5NzkxMS04OGU5ZDRhNzgzNGQnLCBjYXB0aW9uOiAnUGhvdG8gYnkgR2FldGFubyBDZXNzYXRpJywgb3JpZW50YXRpb246ICdsYW5kc2NhcGUnIH0sIC8vIGh0dHBzOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9ZT1g4Wk1UbzdoayAoQmFieSBDcm9jb2RpbGUpXG5cdHsgaWQ6ICcxNDcwNTgzMTkwMjQwLWJkNmJiZGU4YTU2OScsIGNhcHRpb246ICdQaG90byBieSBBbGFuIEVtZXJ5Jywgb3JpZW50YXRpb246ICdsYW5kc2NhcGUnIH0sIC8vIGh0dHBzOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9lbVRDV2lxMnR4ayAoQmVldGxlKVxuXHR7IGlkOiAnMTQ3MDY4ODA5MDA2Ny02ZDQyOWMwYjI2MDAnLCBjYXB0aW9uOiAnUGhvdG8gYnkgSsOhbiBKYWt1YiBOYW5pxaF0YScsIG9yaWVudGF0aW9uOiAnbGFuZHNjYXBlJyB9LCAvLyBodHRwczovL3Vuc3BsYXNoLmNvbS9waG90b3MveHFqTy1seDM5QjQgKFNjb3R0aXNoIEhpZ2hsYW5kIENvdylcblx0eyBpZDogJzE0NzA3NDIyOTI1NjUtZGU0M2M0YjAyYjU3JywgY2FwdGlvbjogJ1Bob3RvIGJ5IEVyaWMgS25vbGwnLCBvcmllbnRhdGlvbjogJ2xhbmRzY2FwZScgfSwgLy8gaHR0cHM6Ly91bnNwbGFzaC5jb20vcGhvdG9zL0RtT0NrT254LU1RIChDaGVldGFoKVxuXHQvLyBodHRwczovL3Vuc3BsYXNoLmNvbS9waG90b3MvTlVNbHhUUHN6bk0gY295b3RlP1xuXTtcblxuY29uc3QgdGhlbWUgPSB7XG5cdC8vIGNvbnRhaW5lclxuXHRjb250YWluZXI6IHsgYmFja2dyb3VuZDogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC45KScgfSxcblxuXHQvLyBhcnJvd3Ncblx0YXJyb3c6IHtcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOCknLFxuXHRcdGZpbGw6ICcjMjIyJyxcblx0XHRvcGFjaXR5OiAwLjYsXG5cdFx0dHJhbnNpdGlvbjogJ29wYWNpdHkgMjAwbXMnLFxuXG5cdFx0Jzpob3Zlcic6IHtcblx0XHRcdG9wYWNpdHk6IDEsXG5cdFx0fSxcblx0fSxcblx0YXJyb3dfX3NpemVfX21lZGl1bToge1xuXHRcdGJvcmRlclJhZGl1czogNDAsXG5cdFx0aGVpZ2h0OiA0MCxcblx0XHRtYXJnaW5Ub3A6IC0yMCxcblxuXHRcdCdAbWVkaWEgKG1pbi13aWR0aDogNzY4cHgpJzoge1xuXHRcdFx0aGVpZ2h0OiA3MCxcblx0XHRcdHBhZGRpbmc6IDE1LFxuXHRcdH0sXG5cdH0sXG5cdGFycm93X19kaXJlY3Rpb25fX2xlZnQ6IHsgbWFyZ2luTGVmdDogMTAgfSxcblx0YXJyb3dfX2RpcmVjdGlvbl9fcmlnaHQ6IHsgbWFyZ2luUmlnaHQ6IDEwIH0sXG5cblx0Ly8gaGVhZGVyXG5cdGNsb3NlOiB7XG5cdFx0ZmlsbDogJyNENDAwMDAnLFxuXHRcdG9wYWNpdHk6IDAuNixcblx0XHR0cmFuc2l0aW9uOiAnYWxsIDIwMG1zJyxcblxuXHRcdCc6aG92ZXInOiB7XG5cdFx0XHRvcGFjaXR5OiAxLFxuXHRcdH0sXG5cdH0sXG5cblx0Ly8gZm9vdGVyXG5cdGZvb3Rlcjoge1xuXHRcdGNvbG9yOiAnYmxhY2snLFxuXHR9LFxuXHRmb290ZXJDb3VudDoge1xuXHRcdGNvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjYpJyxcblx0fSxcblxuXHQvLyB0aHVtYm5haWxzXG5cdHRodW1ibmFpbDoge1xuXHR9LFxuXHR0aHVtYm5haWxfX2FjdGl2ZToge1xuXHRcdGJveFNoYWRvdzogJzAgMCAwIDJweCAjMDBEOEZGJyxcblx0fSxcbn07XG5cbnJlbmRlcihcblx0PGRpdj5cblx0XHQ8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogNDAgfX0+XG5cdFx0XHQ8cD5QaG90b3MgY291cnRlc3kgb2YgPGEgaHJlZj1cImh0dHBzOi8vdW5zcGxhc2guY29tL1wiIHRhcmdldD1cIl9ibGFua1wiPlVuc3BsYXNoPC9hPi4gVXNlIHlvdXIga2V5Ym9hcmQgdG8gbmF2aWdhdGUgPGtiZD5sZWZ0PC9rYmQ+IDxrYmQ+cmlnaHQ8L2tiZD4gPGtiZD5lc2M8L2tiZD4gJm1kYXNoOyBBbHNvLCB0cnkgcmVzaXppbmcgeW91ciBicm93c2VyIHdpbmRvdy48L3A+XG5cdFx0PC9kaXY+XG5cdFx0PGgzPkRlZmF1bHQgT3B0aW9uczwvaDM+XG5cdFx0PEdhbGxlcnkgaW1hZ2VzPXtERUZBVUxUX0lNQUdFUy5tYXAoKHsgY2FwdGlvbiwgaWQsIG9yaWVudGF0aW9uLCB1c2VGb3JEZW1vIH0pID0+ICh7XG5cdFx0XHRzcmM6IG1ha2VVbnNwbGFzaFNyYyhpZCksXG5cdFx0XHR0aHVtYm5haWw6IG1ha2VVbnNwbGFzaFRodW1ibmFpbChpZCwgb3JpZW50YXRpb24pLFxuXHRcdFx0c3Jjc2V0OiBbXG5cdFx0XHRcdG1ha2VVbnNwbGFzaFNyY1NldChpZCwgMTAyNCksXG5cdFx0XHRcdG1ha2VVbnNwbGFzaFNyY1NldChpZCwgODAwKSxcblx0XHRcdFx0bWFrZVVuc3BsYXNoU3JjU2V0KGlkLCA1MDApLFxuXHRcdFx0XHRtYWtlVW5zcGxhc2hTcmNTZXQoaWQsIDMyMCksXG5cdFx0XHRdLFxuXHRcdFx0Y2FwdGlvbixcblx0XHRcdG9yaWVudGF0aW9uLFxuXHRcdFx0dXNlRm9yRGVtbyxcblx0XHR9KSl9IC8+XG5cblx0XHQ8aDM+V2l0aCBUaHVtYm5haWxzPC9oMz5cblx0XHQ8R2FsbGVyeSBpbWFnZXM9e1RIVU1CTkFJTF9JTUFHRVMubWFwKCh7IGNhcHRpb24sIGlkLCBvcmllbnRhdGlvbiwgdXNlRm9yRGVtbyB9KSA9PiAoe1xuXHRcdFx0c3JjOiBtYWtlVW5zcGxhc2hTcmMoaWQpLFxuXHRcdFx0dGh1bWJuYWlsOiBtYWtlVW5zcGxhc2hUaHVtYm5haWwoaWQsIG9yaWVudGF0aW9uKSxcblx0XHRcdHNyY3NldDogW1xuXHRcdFx0XHRtYWtlVW5zcGxhc2hTcmNTZXQoaWQsIDEwMjQpLFxuXHRcdFx0XHRtYWtlVW5zcGxhc2hTcmNTZXQoaWQsIDgwMCksXG5cdFx0XHRcdG1ha2VVbnNwbGFzaFNyY1NldChpZCwgNTAwKSxcblx0XHRcdFx0bWFrZVVuc3BsYXNoU3JjU2V0KGlkLCAzMjApLFxuXHRcdFx0XSxcblx0XHRcdGNhcHRpb24sXG5cdFx0XHRvcmllbnRhdGlvbixcblx0XHRcdHVzZUZvckRlbW8sXG5cdFx0fSkpfSBzaG93VGh1bWJuYWlscyAvPlxuXG5cdFx0PGgzPlRoZW1lZCBMaWdodGJveDwvaDM+XG5cdFx0PEdhbGxlcnkgaW1hZ2VzPXtUSEVNRURfSU1BR0VTLm1hcCgoeyBjYXB0aW9uLCBpZCwgb3JpZW50YXRpb24sIHVzZUZvckRlbW8gfSkgPT4gKHtcblx0XHRcdHNyYzogbWFrZVVuc3BsYXNoU3JjKGlkKSxcblx0XHRcdHRodW1ibmFpbDogbWFrZVVuc3BsYXNoVGh1bWJuYWlsKGlkLCBvcmllbnRhdGlvbiksXG5cdFx0XHRzcmNzZXQ6IFtcblx0XHRcdFx0bWFrZVVuc3BsYXNoU3JjU2V0KGlkLCAxMDI0KSxcblx0XHRcdFx0bWFrZVVuc3BsYXNoU3JjU2V0KGlkLCA4MDApLFxuXHRcdFx0XHRtYWtlVW5zcGxhc2hTcmNTZXQoaWQsIDUwMCksXG5cdFx0XHRcdG1ha2VVbnNwbGFzaFNyY1NldChpZCwgMzIwKSxcblx0XHRcdF0sXG5cdFx0XHRjYXB0aW9uLFxuXHRcdFx0b3JpZW50YXRpb24sXG5cdFx0XHR1c2VGb3JEZW1vLFxuXHRcdH0pKX0gdGhlbWU9e3RoZW1lfSBzaG93VGh1bWJuYWlscyAvPlxuXHQ8L2Rpdj4sXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdleGFtcGxlJylcbik7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjc3MsIFN0eWxlU2hlZXQgfSBmcm9tICdhcGhyb2RpdGUvbm8taW1wb3J0YW50JztcbmltcG9ydCBMaWdodGJveCBmcm9tICdyZWFjdC1pbWFnZXMnO1xuXG5jbGFzcyBHYWxsZXJ5IGV4dGVuZHMgQ29tcG9uZW50IHtcblx0Y29uc3RydWN0b3IgKCkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLnN0YXRlID0ge1xuXHRcdFx0bGlnaHRib3hJc09wZW46IGZhbHNlLFxuXHRcdFx0Y3VycmVudEltYWdlOiAwLFxuXHRcdH07XG5cblx0XHR0aGlzLmNsb3NlTGlnaHRib3ggPSB0aGlzLmNsb3NlTGlnaHRib3guYmluZCh0aGlzKTtcblx0XHR0aGlzLmdvdG9OZXh0ID0gdGhpcy5nb3RvTmV4dC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMuZ290b1ByZXZpb3VzID0gdGhpcy5nb3RvUHJldmlvdXMuYmluZCh0aGlzKTtcblx0XHR0aGlzLmdvdG9JbWFnZSA9IHRoaXMuZ290b0ltYWdlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVDbGlja0ltYWdlID0gdGhpcy5oYW5kbGVDbGlja0ltYWdlLmJpbmQodGhpcyk7XG5cdFx0dGhpcy5vcGVuTGlnaHRib3ggPSB0aGlzLm9wZW5MaWdodGJveC5iaW5kKHRoaXMpO1xuXHR9XG5cdG9wZW5MaWdodGJveCAoaW5kZXgsIGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGN1cnJlbnRJbWFnZTogaW5kZXgsXG5cdFx0XHRsaWdodGJveElzT3BlbjogdHJ1ZSxcblx0XHR9KTtcblx0fVxuXHRjbG9zZUxpZ2h0Ym94ICgpIHtcblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdGN1cnJlbnRJbWFnZTogMCxcblx0XHRcdGxpZ2h0Ym94SXNPcGVuOiBmYWxzZSxcblx0XHR9KTtcblx0fVxuXHRnb3RvUHJldmlvdXMgKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Y3VycmVudEltYWdlOiB0aGlzLnN0YXRlLmN1cnJlbnRJbWFnZSAtIDEsXG5cdFx0fSk7XG5cdH1cblx0Z290b05leHQgKCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Y3VycmVudEltYWdlOiB0aGlzLnN0YXRlLmN1cnJlbnRJbWFnZSArIDEsXG5cdFx0fSk7XG5cdH1cblx0Z290b0ltYWdlIChpbmRleCkge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0Y3VycmVudEltYWdlOiBpbmRleCxcblx0XHR9KTtcblx0fVxuXHRoYW5kbGVDbGlja0ltYWdlICgpIHtcblx0XHRpZiAodGhpcy5zdGF0ZS5jdXJyZW50SW1hZ2UgPT09IHRoaXMucHJvcHMuaW1hZ2VzLmxlbmd0aCAtIDEpIHJldHVybjtcblxuXHRcdHRoaXMuZ290b05leHQoKTtcblx0fVxuXHRyZW5kZXJHYWxsZXJ5ICgpIHtcblx0XHRjb25zdCB7IGltYWdlcyB9ID0gdGhpcy5wcm9wcztcblxuXHRcdGlmICghaW1hZ2VzKSByZXR1cm47XG5cblx0XHRjb25zdCBnYWxsZXJ5ID0gaW1hZ2VzLmZpbHRlcihpID0+IGkudXNlRm9yRGVtbykubWFwKChvYmosIGkpID0+IHtcblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdDxhXG5cdFx0XHRcdFx0aHJlZj17b2JqLnNyY31cblx0XHRcdFx0XHRjbGFzc05hbWU9e2NzcyhjbGFzc2VzLnRodW1ibmFpbCwgY2xhc3Nlc1tvYmoub3JpZW50YXRpb25dKX1cblx0XHRcdFx0XHRrZXk9e2l9XG5cdFx0XHRcdFx0b25DbGljaz17KGUpID0+IHRoaXMub3BlbkxpZ2h0Ym94KGksIGUpfVxuXHRcdFx0XHQ+XG5cdFx0XHRcdFx0PGltZyBzcmM9e29iai50aHVtYm5haWx9IGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuc291cmNlKX0gLz5cblx0XHRcdFx0PC9hPlxuXHRcdFx0KTtcblx0XHR9KTtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y3NzKGNsYXNzZXMuZ2FsbGVyeSl9PlxuXHRcdFx0XHR7Z2FsbGVyeX1cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH1cblx0cmVuZGVyICgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJzZWN0aW9uXCI+XG5cdFx0XHRcdHt0aGlzLnByb3BzLmhlYWRpbmcgJiYgPGgyPnt0aGlzLnByb3BzLmhlYWRpbmd9PC9oMj59XG5cdFx0XHRcdHt0aGlzLnByb3BzLnN1YmhlYWRpbmcgJiYgPHA+e3RoaXMucHJvcHMuc3ViaGVhZGluZ308L3A+fVxuXHRcdFx0XHR7dGhpcy5yZW5kZXJHYWxsZXJ5KCl9XG5cdFx0XHRcdDxMaWdodGJveFxuXHRcdFx0XHRcdGN1cnJlbnRJbWFnZT17dGhpcy5zdGF0ZS5jdXJyZW50SW1hZ2V9XG5cdFx0XHRcdFx0aW1hZ2VzPXt0aGlzLnByb3BzLmltYWdlc31cblx0XHRcdFx0XHRpc09wZW49e3RoaXMuc3RhdGUubGlnaHRib3hJc09wZW59XG5cdFx0XHRcdFx0b25DbGlja05leHQ9e3RoaXMuZ290b05leHR9XG5cdFx0XHRcdFx0b25DbGlja1ByZXY9e3RoaXMuZ290b1ByZXZpb3VzfVxuXHRcdFx0XHRcdG9uQ2xpY2tUaHVtYm5haWw9e3RoaXMuZ290b0ltYWdlfVxuXHRcdFx0XHRcdG9uQ2xvc2U9e3RoaXMuY2xvc2VMaWdodGJveH1cblx0XHRcdFx0XHRzaG93VGh1bWJuYWlscz17dGhpcy5wcm9wcy5zaG93VGh1bWJuYWlsc31cblx0XHRcdFx0XHR0aGVtZT17dGhpcy5wcm9wcy50aGVtZX1cblx0XHRcdFx0XHRiYWNrZHJvcENsb3Nlc01vZGFsPXt0cnVlfVxuXHRcdFx0XHRcdHpvb209ezF9XG5cdFx0XHRcdFx0Y29udGVudD17MX1cblx0XHRcdFx0PlxuXHRcdFx0XHQ8cD5Mb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzaWNpbmcgZWxpdC4gTWF4aW1lIGlwc3VtIGRvbG9yZXMgdXQgaW5jaWR1bnQgcGVyc3BpY2lhdGlzIGRpZ25pc3NpbW9zIGN1bHBhIGNvbnNlcXVhdHVyIGR1Y2ltdXMgcXVpYSwgYXNwZXJpb3JlcyBhbGlxdWFtIGVhcnVtIGVycm9yIG51bGxhIGlwc2FtIGEgc2ltaWxpcXVlLCBhdXQgZXQgcmVydW0/PC9wPlxuXHRcdFx0XHQ8L0xpZ2h0Ym94PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fVxufTtcblxuR2FsbGVyeS5kaXNwbGF5TmFtZSA9ICdHYWxsZXJ5JztcbkdhbGxlcnkucHJvcFR5cGVzID0ge1xuXHRoZWFkaW5nOiBQcm9wVHlwZXMuc3RyaW5nLFxuXHRpbWFnZXM6IFByb3BUeXBlcy5hcnJheSxcblx0c2hvd1RodW1ibmFpbHM6IFByb3BUeXBlcy5ib29sLFxuXHRzdWJoZWFkaW5nOiBQcm9wVHlwZXMuc3RyaW5nLFxufTtcblxuY29uc3QgZ3V0dGVyID0ge1xuXHRzbWFsbDogMixcblx0bGFyZ2U6IDQsXG59O1xuY29uc3QgY2xhc3NlcyA9IFN0eWxlU2hlZXQuY3JlYXRlKHtcblx0Z2FsbGVyeToge1xuXHRcdG1hcmdpblJpZ2h0OiAtZ3V0dGVyLnNtYWxsLFxuXHRcdG92ZXJmbG93OiAnaGlkZGVuJyxcblxuXHRcdCdAbWVkaWEgKG1pbi13aWR0aDogNTAwcHgpJzoge1xuXHRcdFx0bWFyZ2luUmlnaHQ6IC1ndXR0ZXIubGFyZ2UsXG5cdFx0fSxcblx0fSxcblxuXHQvLyBhbmNob3Jcblx0dGh1bWJuYWlsOiB7XG5cdFx0Ym94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG5cdFx0ZGlzcGxheTogJ2Jsb2NrJyxcblx0XHRmbG9hdDogJ2xlZnQnLFxuXHRcdGxpbmVIZWlnaHQ6IDAsXG5cdFx0cGFkZGluZ1JpZ2h0OiBndXR0ZXIuc21hbGwsXG5cdFx0cGFkZGluZ0JvdHRvbTogZ3V0dGVyLnNtYWxsLFxuXHRcdG92ZXJmbG93OiAnaGlkZGVuJyxcblxuXHRcdCdAbWVkaWEgKG1pbi13aWR0aDogNTAwcHgpJzoge1xuXHRcdFx0cGFkZGluZ1JpZ2h0OiBndXR0ZXIubGFyZ2UsXG5cdFx0XHRwYWRkaW5nQm90dG9tOiBndXR0ZXIubGFyZ2UsXG5cdFx0fSxcblx0fSxcblxuXHQvLyBvcmllbnRhdGlvblxuXHRsYW5kc2NhcGU6IHtcblx0XHR3aWR0aDogJzMwJScsXG5cdH0sXG5cdHNxdWFyZToge1xuXHRcdHBhZGRpbmdCb3R0b206IDAsXG5cdFx0d2lkdGg6ICc0MCUnLFxuXG5cdFx0J0BtZWRpYSAobWluLXdpZHRoOiA1MDBweCknOiB7XG5cdFx0XHRwYWRkaW5nQm90dG9tOiAwLFxuXHRcdH0sXG5cdH0sXG5cblx0Ly8gYWN0dWFsIDxpbWcgLz5cblx0c291cmNlOiB7XG5cdFx0Ym9yZGVyOiAwLFxuXHRcdGRpc3BsYXk6ICdibG9jaycsXG5cdFx0aGVpZ2h0OiAnYXV0bycsXG5cdFx0bWF4V2lkdGg6ICcxMDAlJyxcblx0XHR3aWR0aDogJ2F1dG8nLFxuXHR9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEdhbGxlcnk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfc2xpY2VkVG9BcnJheSA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7IHZhciBfYXJyID0gW107IHZhciBfbiA9IHRydWU7IHZhciBfZCA9IGZhbHNlOyB2YXIgX2UgPSB1bmRlZmluZWQ7IHRyeSB7IGZvciAodmFyIF9pID0gYXJyW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3M7ICEoX24gPSAoX3MgPSBfaS5uZXh0KCkpLmRvbmUpOyBfbiA9IHRydWUpIHsgX2Fyci5wdXNoKF9zLnZhbHVlKTsgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrOyB9IH0gY2F0Y2ggKGVycikgeyBfZCA9IHRydWU7IF9lID0gZXJyOyB9IGZpbmFsbHkgeyB0cnkgeyBpZiAoIV9uICYmIF9pWydyZXR1cm4nXSkgX2lbJ3JldHVybiddKCk7IH0gZmluYWxseSB7IGlmIChfZCkgdGhyb3cgX2U7IH0gfSByZXR1cm4gX2FycjsgfSByZXR1cm4gZnVuY3Rpb24gKGFyciwgaSkgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IHJldHVybiBhcnI7IH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSB7IHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7IH0gZWxzZSB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UnKTsgfSB9OyB9KSgpO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIF9pbmplY3QgPSByZXF1aXJlKCcuL2luamVjdCcpO1xuXG4vKiA6OlxuaW1wb3J0IHR5cGUgeyBTZWxlY3RvckhhbmRsZXIgfSBmcm9tICcuL2dlbmVyYXRlLmpzJztcbmV4cG9ydCB0eXBlIFNoZWV0RGVmaW5pdGlvbiA9IHsgW2lkOnN0cmluZ106IGFueSB9O1xuZXhwb3J0IHR5cGUgU2hlZXREZWZpbml0aW9ucyA9IFNoZWV0RGVmaW5pdGlvbiB8IFNoZWV0RGVmaW5pdGlvbltdO1xudHlwZSBSZW5kZXJGdW5jdGlvbiA9ICgpID0+IHN0cmluZztcbnR5cGUgRXh0ZW5zaW9uID0ge1xuICAgIHNlbGVjdG9ySGFuZGxlcjogU2VsZWN0b3JIYW5kbGVyXG59O1xuZXhwb3J0IHR5cGUgTWF5YmVTaGVldERlZmluaXRpb24gPSBTaGVldERlZmluaXRpb24gfCBmYWxzZSB8IG51bGwgfCB2b2lkXG4qL1xuXG52YXIgU3R5bGVTaGVldCA9IHtcbiAgICBjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZShzaGVldERlZmluaXRpb24gLyogOiBTaGVldERlZmluaXRpb24gKi8pIHtcbiAgICAgICAgcmV0dXJuICgwLCBfdXRpbC5tYXBPYmopKHNoZWV0RGVmaW5pdGlvbiwgZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgICAgIHZhciBfcmVmMiA9IF9zbGljZWRUb0FycmF5KF9yZWYsIDIpO1xuXG4gICAgICAgICAgICB2YXIga2V5ID0gX3JlZjJbMF07XG4gICAgICAgICAgICB2YXIgdmFsID0gX3JlZjJbMV07XG5cbiAgICAgICAgICAgIHJldHVybiBba2V5LCB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyhlbWlseSk6IE1ha2UgYSAncHJvZHVjdGlvbicgbW9kZSB3aGljaCBkb2Vzbid0IHByZXBlbmRcbiAgICAgICAgICAgICAgICAvLyB0aGUgY2xhc3MgbmFtZSBoZXJlLCB0byBtYWtlIHRoZSBnZW5lcmF0ZWQgQ1NTIHNtYWxsZXIuXG4gICAgICAgICAgICAgICAgX25hbWU6IGtleSArICdfJyArICgwLCBfdXRpbC5oYXNoT2JqZWN0KSh2YWwpLFxuICAgICAgICAgICAgICAgIF9kZWZpbml0aW9uOiB2YWxcbiAgICAgICAgICAgIH1dO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgcmVoeWRyYXRlOiBmdW5jdGlvbiByZWh5ZHJhdGUoKSB7XG4gICAgICAgIHZhciByZW5kZXJlZENsYXNzTmFtZXMgLyogOiBzdHJpbmdbXSAqLyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzBdO1xuXG4gICAgICAgICgwLCBfaW5qZWN0LmFkZFJlbmRlcmVkQ2xhc3NOYW1lcykocmVuZGVyZWRDbGFzc05hbWVzKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFV0aWxpdGllcyBmb3IgdXNpbmcgQXBocm9kaXRlIHNlcnZlci1zaWRlLlxuICovXG52YXIgU3R5bGVTaGVldFNlcnZlciA9IHtcbiAgICByZW5kZXJTdGF0aWM6IGZ1bmN0aW9uIHJlbmRlclN0YXRpYyhyZW5kZXJGdW5jIC8qIDogUmVuZGVyRnVuY3Rpb24gKi8pIHtcbiAgICAgICAgKDAsIF9pbmplY3QucmVzZXQpKCk7XG4gICAgICAgICgwLCBfaW5qZWN0LnN0YXJ0QnVmZmVyaW5nKSgpO1xuICAgICAgICB2YXIgaHRtbCA9IHJlbmRlckZ1bmMoKTtcbiAgICAgICAgdmFyIGNzc0NvbnRlbnQgPSAoMCwgX2luamVjdC5mbHVzaFRvU3RyaW5nKSgpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBodG1sOiBodG1sLFxuICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDogY3NzQ29udGVudCxcbiAgICAgICAgICAgICAgICByZW5kZXJlZENsYXNzTmFtZXM6ICgwLCBfaW5qZWN0LmdldFJlbmRlcmVkQ2xhc3NOYW1lcykoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn07XG5cbi8qKlxuICogVXRpbGl0aWVzIGZvciB1c2luZyBBcGhyb2RpdGUgaW4gdGVzdHMuXG4gKlxuICogTm90IG1lYW50IHRvIGJlIHVzZWQgaW4gcHJvZHVjdGlvbi5cbiAqL1xudmFyIFN0eWxlU2hlZXRUZXN0VXRpbHMgPSB7XG4gICAgLyoqXG4gICAgICogUHJldmVudCBzdHlsZXMgZnJvbSBiZWluZyBpbmplY3RlZCBpbnRvIHRoZSBET00uXG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHVzZWZ1bCBpbiBzaXR1YXRpb25zIHdoZXJlIHlvdSdkIGxpa2UgdG8gdGVzdCByZW5kZXJpbmcgVUlcbiAgICAgKiBjb21wb25lbnRzIHdoaWNoIHVzZSBBcGhyb2RpdGUgd2l0aG91dCBhbnkgb2YgdGhlIHNpZGUtZWZmZWN0cyBvZlxuICAgICAqIEFwaHJvZGl0ZSBoYXBwZW5pbmcuIFBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHRlc3RpbmcgdGhlIG91dHB1dCBvZlxuICAgICAqIGNvbXBvbmVudHMgd2hlbiB5b3UgaGF2ZSBubyBET00sIGUuZy4gdGVzdGluZyBpbiBOb2RlIHdpdGhvdXQgYSBmYWtlIERPTS5cbiAgICAgKlxuICAgICAqIFNob3VsZCBiZSBwYWlyZWQgd2l0aCBhIHN1YnNlcXVlbnQgY2FsbCB0b1xuICAgICAqIGNsZWFyQnVmZmVyQW5kUmVzdW1lU3R5bGVJbmplY3Rpb24uXG4gICAgICovXG4gICAgc3VwcHJlc3NTdHlsZUluamVjdGlvbjogZnVuY3Rpb24gc3VwcHJlc3NTdHlsZUluamVjdGlvbigpIHtcbiAgICAgICAgKDAsIF9pbmplY3QucmVzZXQpKCk7XG4gICAgICAgICgwLCBfaW5qZWN0LnN0YXJ0QnVmZmVyaW5nKSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBPcHBvc2l0ZSBtZXRob2Qgb2YgcHJldmVudFN0eWxlSW5qZWN0LlxuICAgICAqL1xuICAgIGNsZWFyQnVmZmVyQW5kUmVzdW1lU3R5bGVJbmplY3Rpb246IGZ1bmN0aW9uIGNsZWFyQnVmZmVyQW5kUmVzdW1lU3R5bGVJbmplY3Rpb24oKSB7XG4gICAgICAgICgwLCBfaW5qZWN0LnJlc2V0KSgpO1xuICAgIH1cbn07XG5cbi8qKlxuICogR2VuZXJhdGUgdGhlIEFwaHJvZGl0ZSBBUEkgZXhwb3J0cywgd2l0aCBnaXZlbiBgc2VsZWN0b3JIYW5kbGVyc2AgYW5kXG4gKiBgdXNlSW1wb3J0YW50YCBzdGF0ZS5cbiAqL1xudmFyIG1ha2VFeHBvcnRzID0gZnVuY3Rpb24gbWFrZUV4cG9ydHModXNlSW1wb3J0YW50LCAvKiA6IGJvb2xlYW4gKi9cbnNlbGVjdG9ySGFuZGxlcnMgLyogOiBTZWxlY3RvckhhbmRsZXJbXSAqL1xuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgU3R5bGVTaGVldDogX2V4dGVuZHMoe30sIFN0eWxlU2hlZXQsIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZXR1cm5zIGEgdmVyc2lvbiBvZiB0aGUgZXhwb3J0cyBvZiBBcGhyb2RpdGUgKGkuZS4gYW4gb2JqZWN0XG4gICAgICAgICAgICAgKiB3aXRoIGBjc3NgIGFuZCBgU3R5bGVTaGVldGAgcHJvcGVydGllcykgd2hpY2ggaGF2ZSBzb21lXG4gICAgICAgICAgICAgKiBleHRlbnNpb25zIGluY2x1ZGVkLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IGV4dGVuc2lvbnM6IEFuIGFycmF5IG9mIGV4dGVuc2lvbnMgdG9cbiAgICAgICAgICAgICAqICAgICBhZGQgdG8gdGhpcyBpbnN0YW5jZSBvZiBBcGhyb2RpdGUuIEVhY2ggb2JqZWN0IHNob3VsZCBoYXZlIGFcbiAgICAgICAgICAgICAqICAgICBzaW5nbGUgcHJvcGVydHkgb24gaXQsIGRlZmluaW5nIHdoaWNoIGtpbmQgb2YgZXh0ZW5zaW9uIHRvXG4gICAgICAgICAgICAgKiAgICAgYWRkLlxuICAgICAgICAgICAgICogQHBhcmFtIHtTZWxlY3RvckhhbmRsZXJ9IFtleHRlbnNpb25zW10uc2VsZWN0b3JIYW5kbGVyXTogQVxuICAgICAgICAgICAgICogICAgIHNlbGVjdG9yIGhhbmRsZXIgZXh0ZW5zaW9uLiBTZWUgYGRlZmF1bHRTZWxlY3RvckhhbmRsZXJzYCBpblxuICAgICAgICAgICAgICogICAgIGdlbmVyYXRlLmpzLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBleHBvcnRzIG9mIHRoZSBuZXdcbiAgICAgICAgICAgICAqICAgICBpbnN0YW5jZSBvZiBBcGhyb2RpdGUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGV4dGVuZDogZnVuY3Rpb24gZXh0ZW5kKGV4dGVuc2lvbnMgLyogOiBFeHRlbnNpb25bXSAqLykge1xuICAgICAgICAgICAgICAgIHZhciBleHRlbnNpb25TZWxlY3RvckhhbmRsZXJzID0gZXh0ZW5zaW9uc1xuICAgICAgICAgICAgICAgIC8vIFB1bGwgb3V0IGV4dGVuc2lvbnMgd2l0aCBhIHNlbGVjdG9ySGFuZGxlciBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGV4dGVuc2lvbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0ZW5zaW9uLnNlbGVjdG9ySGFuZGxlcjtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBudWxscyAoaS5lLiBleHRlbnNpb25zIHdpdGhvdXQgYSBzZWxlY3RvckhhbmRsZXJcbiAgICAgICAgICAgICAgICAvLyBwcm9wZXJ0eSkuXG4gICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBtYWtlRXhwb3J0cyh1c2VJbXBvcnRhbnQsIHNlbGVjdG9ySGFuZGxlcnMuY29uY2F0KGV4dGVuc2lvblNlbGVjdG9ySGFuZGxlcnMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksXG5cbiAgICAgICAgU3R5bGVTaGVldFNlcnZlcjogU3R5bGVTaGVldFNlcnZlcixcbiAgICAgICAgU3R5bGVTaGVldFRlc3RVdGlsczogU3R5bGVTaGVldFRlc3RVdGlscyxcblxuICAgICAgICBjc3M6IGZ1bmN0aW9uIGNzcygpIC8qIDogTWF5YmVTaGVldERlZmluaXRpb25bXSAqL3tcbiAgICAgICAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBzdHlsZURlZmluaXRpb25zID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgICAgICAgICAgc3R5bGVEZWZpbml0aW9uc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICgwLCBfaW5qZWN0LmluamVjdEFuZEdldENsYXNzTmFtZSkodXNlSW1wb3J0YW50LCBzdHlsZURlZmluaXRpb25zLCBzZWxlY3RvckhhbmRsZXJzKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VFeHBvcnRzOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2lubGluZVN0eWxlUHJlZml4ZXJTdGF0aWNDcmVhdGVQcmVmaXhlciA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvY3JlYXRlUHJlZml4ZXInKTtcblxudmFyIF9pbmxpbmVTdHlsZVByZWZpeGVyU3RhdGljQ3JlYXRlUHJlZml4ZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5saW5lU3R5bGVQcmVmaXhlclN0YXRpY0NyZWF0ZVByZWZpeGVyKTtcblxudmFyIF9saWJTdGF0aWNQcmVmaXhEYXRhID0gcmVxdWlyZSgnLi4vbGliL3N0YXRpY1ByZWZpeERhdGEnKTtcblxudmFyIF9saWJTdGF0aWNQcmVmaXhEYXRhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xpYlN0YXRpY1ByZWZpeERhdGEpO1xuXG52YXIgX29yZGVyZWRFbGVtZW50cyA9IHJlcXVpcmUoJy4vb3JkZXJlZC1lbGVtZW50cycpO1xuXG52YXIgX29yZGVyZWRFbGVtZW50czIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9vcmRlcmVkRWxlbWVudHMpO1xuXG52YXIgX3V0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIHByZWZpeEFsbCA9ICgwLCBfaW5saW5lU3R5bGVQcmVmaXhlclN0YXRpY0NyZWF0ZVByZWZpeGVyMlsnZGVmYXVsdCddKShfbGliU3RhdGljUHJlZml4RGF0YTJbJ2RlZmF1bHQnXSk7XG5cbi8qIDo6XG5pbXBvcnQgdHlwZSB7IFNoZWV0RGVmaW5pdGlvbiB9IGZyb20gJy4vaW5kZXguanMnO1xudHlwZSBTdHJpbmdIYW5kbGVycyA9IHsgW2lkOnN0cmluZ106IEZ1bmN0aW9uIH07XG50eXBlIFNlbGVjdG9yQ2FsbGJhY2sgPSAoc2VsZWN0b3I6IHN0cmluZykgPT4gYW55O1xuZXhwb3J0IHR5cGUgU2VsZWN0b3JIYW5kbGVyID0gKFxuICAgIHNlbGVjdG9yOiBzdHJpbmcsXG4gICAgYmFzZVNlbGVjdG9yOiBzdHJpbmcsXG4gICAgY2FsbGJhY2s6IFNlbGVjdG9yQ2FsbGJhY2tcbikgPT4gc3RyaW5nIHwgbnVsbDtcbiovXG5cbi8qKlxuICogYHNlbGVjdG9ySGFuZGxlcnNgIGFyZSBmdW5jdGlvbnMgd2hpY2ggaGFuZGxlIHNwZWNpYWwgc2VsZWN0b3JzIHdoaWNoIGFjdFxuICogZGlmZmVyZW50bHkgdGhhbiBub3JtYWwgc3R5bGUgZGVmaW5pdGlvbnMuIFRoZXNlIGZ1bmN0aW9ucyBsb29rIGF0IHRoZVxuICogY3VycmVudCBzZWxlY3RvciBhbmQgY2FuIGdlbmVyYXRlIENTUyBmb3IgdGhlIHN0eWxlcyBpbiB0aGVpciBzdWJ0cmVlIGJ5XG4gKiBjYWxsaW5nIHRoZSBjYWxsYmFjayB3aXRoIGEgbmV3IHNlbGVjdG9yLlxuICpcbiAqIEZvciBleGFtcGxlLCB3aGVuIGdlbmVyYXRpbmcgc3R5bGVzIHdpdGggYSBiYXNlIHNlbGVjdG9yIG9mICcuZm9vJyBhbmQgdGhlXG4gKiBmb2xsb3dpbmcgc3R5bGVzIG9iamVjdDpcbiAqXG4gKiAgIHtcbiAqICAgICAnOm50aC1jaGlsZCgybiknOiB7XG4gKiAgICAgICAnOmhvdmVyJzoge1xuICogICAgICAgICBjb2xvcjogJ3JlZCdcbiAqICAgICAgIH1cbiAqICAgICB9XG4gKiAgIH1cbiAqXG4gKiB3aGVuIHdlIHJlYWNoIHRoZSAnOmhvdmVyJyBzdHlsZSwgd2Ugd291bGQgY2FsbCBvdXIgc2VsZWN0b3IgaGFuZGxlcnMgbGlrZVxuICpcbiAqICAgaGFuZGxlcignOmhvdmVyJywgJy5mb286bnRoLWNoaWxkKDJuKScsIGNhbGxiYWNrKVxuICpcbiAqIFNpbmNlIG91ciBgcHNldWRvU2VsZWN0b3JzYCBoYW5kbGVzICc6aG92ZXInIHN0eWxlcywgdGhhdCBoYW5kbGVyIHdvdWxkIGNhbGxcbiAqIHRoZSBjYWxsYmFjayBsaWtlXG4gKlxuICogICBjYWxsYmFjaygnLmZvbzpudGgtY2hpbGQoMm4pOmhvdmVyJylcbiAqXG4gKiB0byBnZW5lcmF0ZSBpdHMgc3VidHJlZSBgeyBjb2xvcjogJ3JlZCcgfWAgc3R5bGVzIHdpdGggYVxuICogJy5mb286bnRoLWNoaWxkKDJuKTpob3Zlcicgc2VsZWN0b3IuIFRoZSBjYWxsYmFjayB3b3VsZCByZXR1cm4gQ1NTIGxpa2VcbiAqXG4gKiAgICcuZm9vOm50aC1jaGlsZCgybik6aG92ZXJ7Y29sb3I6cmVkICFpbXBvcnRhbnQ7fSdcbiAqXG4gKiBhbmQgdGhlIGhhbmRsZXIgd291bGQgdGhlbiByZXR1cm4gdGhhdCByZXN1bHRpbmcgQ1NTLlxuICpcbiAqIGBkZWZhdWx0U2VsZWN0b3JIYW5kbGVyc2AgaXMgdGhlIGxpc3Qgb2YgZGVmYXVsdCBoYW5kbGVycyB1c2VkIGluIGEgY2FsbCB0b1xuICogYGdlbmVyYXRlQ1NTYC5cbiAqXG4gKiBAbmFtZSBTZWxlY3RvckhhbmRsZXJcbiAqIEBmdW5jdGlvblxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yOiBUaGUgY3VycmVudGx5IGluc3BlY3RlZCBzZWxlY3Rvci4gJzpob3ZlcicgaW4gdGhlXG4gKiAgICAgZXhhbXBsZSBhYm92ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBiYXNlU2VsZWN0b3I6IFRoZSBzZWxlY3RvciBvZiB0aGUgcGFyZW50IHN0eWxlcy5cbiAqICAgICAnLmZvbzpudGgtY2hpbGQoMm4pJyBpbiB0aGUgZXhhbXBsZSBhYm92ZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGdlbmVyYXRlU3VidHJlZVN0eWxlczogQSBmdW5jdGlvbiB3aGljaCBjYW4gYmUgY2FsbGVkIHRvXG4gKiAgICAgZ2VuZXJhdGUgQ1NTIGZvciB0aGUgc3VidHJlZSBvZiBzdHlsZXMgY29ycmVzcG9uZGluZyB0byB0aGUgc2VsZWN0b3IuXG4gKiAgICAgQWNjZXB0cyBhIG5ldyBiYXNlU2VsZWN0b3IgdG8gdXNlIGZvciBnZW5lcmF0aW5nIHRob3NlIHN0eWxlcy5cbiAqIEByZXR1cm5zIHs/c3RyaW5nfSBUaGUgZ2VuZXJhdGVkIENTUyBmb3IgdGhpcyBzZWxlY3Rvciwgb3IgbnVsbCBpZiB3ZSBkb24ndFxuICogICAgIGhhbmRsZSB0aGlzIHNlbGVjdG9yLlxuICovXG52YXIgZGVmYXVsdFNlbGVjdG9ySGFuZGxlcnMgPSBbXG4vLyBIYW5kbGUgcHNldWRvLXNlbGVjdG9ycywgbGlrZSA6aG92ZXIgYW5kIDpudGgtY2hpbGQoM24pXG5mdW5jdGlvbiBwc2V1ZG9TZWxlY3RvcnMoc2VsZWN0b3IsIC8qIDogc3RyaW5nICovXG5iYXNlU2VsZWN0b3IsIC8qIDogc3RyaW5nICovXG5nZW5lcmF0ZVN1YnRyZWVTdHlsZXMgLyogOiBGdW5jdGlvbiAqL1xuKSAvKiAqL3tcbiAgICBpZiAoc2VsZWN0b3JbMF0gIT09IFwiOlwiKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZ2VuZXJhdGVTdWJ0cmVlU3R5bGVzKGJhc2VTZWxlY3RvciArIHNlbGVjdG9yKTtcbn0sXG5cbi8vIEhhbmRsZSBtZWRpYSBxdWVyaWVzIChvciBmb250LWZhY2VzKVxuZnVuY3Rpb24gbWVkaWFRdWVyaWVzKHNlbGVjdG9yLCAvKiA6IHN0cmluZyAqL1xuYmFzZVNlbGVjdG9yLCAvKiA6IHN0cmluZyAqL1xuZ2VuZXJhdGVTdWJ0cmVlU3R5bGVzIC8qIDogRnVuY3Rpb24gKi9cbikgLyogKi97XG4gICAgaWYgKHNlbGVjdG9yWzBdICE9PSBcIkBcIikge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8gR2VuZXJhdGUgdGhlIHN0eWxlcyBub3JtYWxseSwgYW5kIHRoZW4gd3JhcCB0aGVtIGluIHRoZSBtZWRpYSBxdWVyeS5cbiAgICB2YXIgZ2VuZXJhdGVkID0gZ2VuZXJhdGVTdWJ0cmVlU3R5bGVzKGJhc2VTZWxlY3Rvcik7XG4gICAgcmV0dXJuIHNlbGVjdG9yICsgJ3snICsgZ2VuZXJhdGVkICsgJ30nO1xufV07XG5cbmV4cG9ydHMuZGVmYXVsdFNlbGVjdG9ySGFuZGxlcnMgPSBkZWZhdWx0U2VsZWN0b3JIYW5kbGVycztcbi8qKlxuICogR2VuZXJhdGUgQ1NTIGZvciBhIHNlbGVjdG9yIGFuZCBzb21lIHN0eWxlcy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGhhbmRsZXMgdGhlIG1lZGlhIHF1ZXJpZXMgYW5kIHBzZXVkbyBzZWxlY3RvcnMgdGhhdCBjYW4gYmUgdXNlZFxuICogaW4gYXBocm9kaXRlIHN0eWxlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3I6IEEgYmFzZSBDU1Mgc2VsZWN0b3IgZm9yIHRoZSBzdHlsZXMgdG8gYmUgZ2VuZXJhdGVkXG4gKiAgICAgd2l0aC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZVR5cGVzOiBBIGxpc3Qgb2YgcHJvcGVydGllcyBvZiB0aGUgcmV0dXJuIHR5cGUgb2ZcbiAqICAgICBTdHlsZVNoZWV0LmNyZWF0ZSwgZS5nLiBbc3R5bGVzLnJlZCwgc3R5bGVzLmJsdWVdLlxuICogQHBhcmFtIHtBcnJheS48U2VsZWN0b3JIYW5kbGVyPn0gc2VsZWN0b3JIYW5kbGVyczogQSBsaXN0IG9mIHNlbGVjdG9yXG4gKiAgICAgaGFuZGxlcnMgdG8gdXNlIGZvciBoYW5kbGluZyBzcGVjaWFsIHNlbGVjdG9ycy4gU2VlXG4gKiAgICAgYGRlZmF1bHRTZWxlY3RvckhhbmRsZXJzYC5cbiAqIEBwYXJhbSBzdHJpbmdIYW5kbGVyczogU2VlIGBnZW5lcmF0ZUNTU1J1bGVzZXRgXG4gKiBAcGFyYW0gdXNlSW1wb3J0YW50OiBTZWUgYGdlbmVyYXRlQ1NTUnVsZXNldGBcbiAqXG4gKiBUbyBhY3R1YWxseSBnZW5lcmF0ZSB0aGUgQ1NTIHNwZWNpYWwtY29uc3RydWN0LWxlc3Mgc3R5bGVzIGFyZSBwYXNzZWQgdG9cbiAqIGBnZW5lcmF0ZUNTU1J1bGVzZXRgLlxuICpcbiAqIEZvciBpbnN0YW5jZSwgYSBjYWxsIHRvXG4gKlxuICogICAgIGdlbmVyYXRlQ1NTKFwiLmZvb1wiLCBbe1xuICogICAgICAgY29sb3I6IFwicmVkXCIsXG4gKiAgICAgICBcIkBtZWRpYSBzY3JlZW5cIjoge1xuICogICAgICAgICBoZWlnaHQ6IDIwLFxuICogICAgICAgICBcIjpob3ZlclwiOiB7XG4gKiAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCJcbiAqICAgICAgICAgfVxuICogICAgICAgfSxcbiAqICAgICAgIFwiOmFjdGl2ZVwiOiB7XG4gKiAgICAgICAgIGZvbnRXZWlnaHQ6IFwiYm9sZFwiXG4gKiAgICAgICB9XG4gKiAgICAgfV0sIGRlZmF1bHRTZWxlY3RvckhhbmRsZXJzKTtcbiAqXG4gKiB3aXRoIHRoZSBkZWZhdWx0IGBzZWxlY3RvckhhbmRsZXJzYCB3aWxsIG1ha2UgNSBjYWxscyB0b1xuICogYGdlbmVyYXRlQ1NTUnVsZXNldGA6XG4gKlxuICogICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5mb29cIiwgeyBjb2xvcjogXCJyZWRcIiB9LCAuLi4pXG4gKiAgICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmZvbzphY3RpdmVcIiwgeyBmb250V2VpZ2h0OiBcImJvbGRcIiB9LCAuLi4pXG4gKiAgICAgLy8gVGhlc2UgMiB3aWxsIGJlIHdyYXBwZWQgaW4gQG1lZGlhIHNjcmVlbiB7fVxuICogICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5mb29cIiwgeyBoZWlnaHQ6IDIwIH0sIC4uLilcbiAqICAgICBnZW5lcmF0ZUNTU1J1bGVzZXQoXCIuZm9vOmhvdmVyXCIsIHsgYmFja2dyb3VuZENvbG9yOiBcImJsYWNrXCIgfSwgLi4uKVxuICovXG52YXIgZ2VuZXJhdGVDU1MgPSBmdW5jdGlvbiBnZW5lcmF0ZUNTUyhzZWxlY3RvciwgLyogOiBzdHJpbmcgKi9cbnN0eWxlVHlwZXMsIC8qIDogU2hlZXREZWZpbml0aW9uW10gKi9cbnNlbGVjdG9ySGFuZGxlcnMsIC8qIDogU2VsZWN0b3JIYW5kbGVyW10gKi9cbnN0cmluZ0hhbmRsZXJzLCAvKiA6IFN0cmluZ0hhbmRsZXJzICovXG51c2VJbXBvcnRhbnQgLyogOiBib29sZWFuICovXG4pIC8qIDogc3RyaW5nICove1xuICAgIHZhciBtZXJnZWQgPSBuZXcgX29yZGVyZWRFbGVtZW50czJbJ2RlZmF1bHQnXSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZVR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1lcmdlZC5hZGRTdHlsZVR5cGUoc3R5bGVUeXBlc1tpXSk7XG4gICAgfVxuXG4gICAgdmFyIHBsYWluRGVjbGFyYXRpb25zID0gbmV3IF9vcmRlcmVkRWxlbWVudHMyWydkZWZhdWx0J10oKTtcbiAgICB2YXIgZ2VuZXJhdGVkU3R5bGVzID0gXCJcIjtcblxuICAgIC8vIFRPRE8oZW1pbHkpOiBiZW5jaG1hcmsgdGhpcyB0byBzZWUgaWYgYSBwbGFpbiBmb3IgbG9vcCB3b3VsZCBiZSBmYXN0ZXIuXG4gICAgbWVyZ2VkLmZvckVhY2goZnVuY3Rpb24gKHZhbCwga2V5KSB7XG4gICAgICAgIC8vIEZvciBlYWNoIGtleSwgc2VlIGlmIG9uZSBvZiB0aGUgc2VsZWN0b3IgaGFuZGxlcnMgd2lsbCBoYW5kbGUgdGhlc2VcbiAgICAgICAgLy8gc3R5bGVzLlxuICAgICAgICB2YXIgZm91bmRIYW5kbGVyID0gc2VsZWN0b3JIYW5kbGVycy5zb21lKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaGFuZGxlcihrZXksIHNlbGVjdG9yLCBmdW5jdGlvbiAobmV3U2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVDU1MobmV3U2VsZWN0b3IsIFt2YWxdLCBzZWxlY3RvckhhbmRsZXJzLCBzdHJpbmdIYW5kbGVycywgdXNlSW1wb3J0YW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGhhbmRsZXIgcmV0dXJuZWQgc29tZXRoaW5nLCBhZGQgaXQgdG8gdGhlIGdlbmVyYXRlZFxuICAgICAgICAgICAgICAgIC8vIENTUyBhbmQgc3RvcCBsb29raW5nIGZvciBhbm90aGVyIGhhbmRsZXIuXG4gICAgICAgICAgICAgICAgZ2VuZXJhdGVkU3R5bGVzICs9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIElmIG5vbmUgb2YgdGhlIGhhbmRsZXJzIGhhbmRsZWQgaXQsIGFkZCBpdCB0byB0aGUgbGlzdCBvZiBwbGFpblxuICAgICAgICAvLyBzdHlsZSBkZWNsYXJhdGlvbnMuXG4gICAgICAgIGlmICghZm91bmRIYW5kbGVyKSB7XG4gICAgICAgICAgICBwbGFpbkRlY2xhcmF0aW9ucy5zZXQoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdGVDU1NSdWxlc2V0KHNlbGVjdG9yLCBwbGFpbkRlY2xhcmF0aW9ucywgc3RyaW5nSGFuZGxlcnMsIHVzZUltcG9ydGFudCwgc2VsZWN0b3JIYW5kbGVycykgKyBnZW5lcmF0ZWRTdHlsZXM7XG59O1xuXG5leHBvcnRzLmdlbmVyYXRlQ1NTID0gZ2VuZXJhdGVDU1M7XG4vKipcbiAqIEhlbHBlciBtZXRob2Qgb2YgZ2VuZXJhdGVDU1NSdWxlc2V0IHRvIGZhY2lsaXRhdGUgY3VzdG9tIGhhbmRsaW5nIG9mIGNlcnRhaW5cbiAqIENTUyBwcm9wZXJ0aWVzLiBVc2VkIGZvciBlLmcuIGZvbnQgZmFtaWxpZXMuXG4gKlxuICogU2VlIGdlbmVyYXRlQ1NTUnVsZXNldCBmb3IgdXNhZ2UgYW5kIGRvY3VtZW50YXRpb24gb2YgcGFyYW1hdGVyIHR5cGVzLlxuICovXG52YXIgcnVuU3RyaW5nSGFuZGxlcnMgPSBmdW5jdGlvbiBydW5TdHJpbmdIYW5kbGVycyhkZWNsYXJhdGlvbnMsIC8qIDogT3JkZXJlZEVsZW1lbnRzICovXG5zdHJpbmdIYW5kbGVycywgLyogOiBTdHJpbmdIYW5kbGVycyAqL1xuc2VsZWN0b3JIYW5kbGVycyAvKiA6IFNlbGVjdG9ySGFuZGxlcltdICovXG4pIC8qIDogT3JkZXJlZEVsZW1lbnRzICove1xuICAgIGlmICghc3RyaW5nSGFuZGxlcnMpIHtcbiAgICAgICAgcmV0dXJuIGRlY2xhcmF0aW9ucztcbiAgICB9XG5cbiAgICB2YXIgc3RyaW5nSGFuZGxlcktleXMgPSBPYmplY3Qua2V5cyhzdHJpbmdIYW5kbGVycyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmdIYW5kbGVyS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0gc3RyaW5nSGFuZGxlcktleXNbaV07XG4gICAgICAgIGlmIChkZWNsYXJhdGlvbnMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIC8vIEEgZGVjbGFyYXRpb24gZXhpc3RzIGZvciB0aGlzIHBhcnRpY3VsYXIgc3RyaW5nIGhhbmRsZXIsIHNvIHdlXG4gICAgICAgICAgICAvLyBuZWVkIHRvIGxldCB0aGUgc3RyaW5nIGhhbmRsZXIgaW50ZXJwcmV0IHRoZSBkZWNsYXJhdGlvbiBmaXJzdFxuICAgICAgICAgICAgLy8gYmVmb3JlIHByb2NlZWRpbmcuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gVE9ETyhlbWlseSk6IFBhc3MgaW4gYSBjYWxsYmFjayB3aGljaCBnZW5lcmF0ZXMgQ1NTLCBzaW1pbGFyIHRvXG4gICAgICAgICAgICAvLyBob3cgb3VyIHNlbGVjdG9yIGhhbmRsZXJzIHdvcmssIGluc3RlYWQgb2YgcGFzc2luZyBpblxuICAgICAgICAgICAgLy8gYHNlbGVjdG9ySGFuZGxlcnNgIGFuZCBoYXZlIHRoZW0gbWFrZSBjYWxscyB0byBgZ2VuZXJhdGVDU1NgXG4gICAgICAgICAgICAvLyB0aGVtc2VsdmVzLiBSaWdodCBub3csIHRoaXMgaXMgaW1wcmFjdGljYWwgYmVjYXVzZSBvdXIgc3RyaW5nXG4gICAgICAgICAgICAvLyBoYW5kbGVycyBhcmUgdmVyeSBzcGVjaWFsaXplZCBhbmQgZG8gY29tcGxleCB0aGluZ3MuXG4gICAgICAgICAgICBkZWNsYXJhdGlvbnMuc2V0KGtleSwgc3RyaW5nSGFuZGxlcnNba2V5XShkZWNsYXJhdGlvbnMuZ2V0KGtleSksIHNlbGVjdG9ySGFuZGxlcnMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWNsYXJhdGlvbnM7XG59O1xuXG52YXIgdHJhbnNmb3JtUnVsZSA9IGZ1bmN0aW9uIHRyYW5zZm9ybVJ1bGUoa2V5LCAvKiA6IHN0cmluZyAqL1xudmFsdWUsIC8qIDogc3RyaW5nICovXG50cmFuc2Zvcm1WYWx1ZSAvKiA6IGZ1bmN0aW9uICovXG4pIHtcbiAgICByZXR1cm4gKC8qIDogc3RyaW5nICovKDAsIF91dGlsLmtlYmFiaWZ5U3R5bGVOYW1lKShrZXkpICsgJzonICsgdHJhbnNmb3JtVmFsdWUoa2V5LCB2YWx1ZSkgKyAnOydcbiAgICApO1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZSBhIENTUyBydWxlc2V0IHdpdGggdGhlIHNlbGVjdG9yIGFuZCBjb250YWluaW5nIHRoZSBkZWNsYXJhdGlvbnMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgdGhlIGdpdmVuIGRlY2xhcmF0aW9ucyBkb24ndCBjb250YWluIGFueSBzcGVjaWFsXG4gKiBjaGlsZHJlbiAoc3VjaCBhcyBtZWRpYSBxdWVyaWVzLCBwc2V1ZG8tc2VsZWN0b3JzLCBvciBkZXNjZW5kYW50IHN0eWxlcykuXG4gKlxuICogTm90ZSB0aGF0IHRoaXMgbWV0aG9kIGRvZXMgbm90IGRlYWwgd2l0aCBuZXN0aW5nIHVzZWQgZm9yIGUuZy5cbiAqIHBzdWVkby1zZWxlY3RvcnMgb3IgbWVkaWEgcXVlcmllcy4gVGhhdCByZXNwb25zaWJpbGl0eSBpcyBsZWZ0IHRvICB0aGVcbiAqIGBnZW5lcmF0ZUNTU2AgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yOiB0aGUgc2VsZWN0b3IgYXNzb2NpYXRlZCB3aXRoIHRoZSBydWxlc2V0XG4gKiBAcGFyYW0ge09iamVjdH0gZGVjbGFyYXRpb25zOiBhIG1hcCBmcm9tIGNhbWVsQ2FzZWQgQ1NTIHByb3BlcnR5IG5hbWUgdG8gQ1NTXG4gKiAgICAgcHJvcGVydHkgdmFsdWUuXG4gKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCBmdW5jdGlvbj59IHN0cmluZ0hhbmRsZXJzOiBhIG1hcCBmcm9tIGNhbWVsQ2FzZWQgQ1NTXG4gKiAgICAgcHJvcGVydHkgbmFtZSB0byBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgbWFwIHRoZSBnaXZlbiB2YWx1ZSB0byB0aGUgdmFsdWVcbiAqICAgICB0aGF0IGlzIG91dHB1dC5cbiAqIEBwYXJhbSB7Ym9vbH0gdXNlSW1wb3J0YW50OiBBIGJvb2xlYW4gc2F5aW5nIHdoZXRoZXIgdG8gYXBwZW5kIFwiIWltcG9ydGFudFwiXG4gKiAgICAgdG8gZWFjaCBvZiB0aGUgQ1NTIGRlY2xhcmF0aW9ucy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IEEgc3RyaW5nIG9mIHJhdyBDU1MuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmJsYWhcIiwgeyBjb2xvcjogXCJyZWRcIiB9KVxuICogICAgLT4gXCIuYmxhaHtjb2xvcjogcmVkICFpbXBvcnRhbnQ7fVwiXG4gKiAgICBnZW5lcmF0ZUNTU1J1bGVzZXQoXCIuYmxhaFwiLCB7IGNvbG9yOiBcInJlZFwiIH0sIHt9LCBmYWxzZSlcbiAqICAgIC0+IFwiLmJsYWh7Y29sb3I6IHJlZH1cIlxuICogICAgZ2VuZXJhdGVDU1NSdWxlc2V0KFwiLmJsYWhcIiwgeyBjb2xvcjogXCJyZWRcIiB9LCB7Y29sb3I6IGMgPT4gYy50b1VwcGVyQ2FzZX0pXG4gKiAgICAtPiBcIi5ibGFoe2NvbG9yOiBSRUR9XCJcbiAqICAgIGdlbmVyYXRlQ1NTUnVsZXNldChcIi5ibGFoOmhvdmVyXCIsIHsgY29sb3I6IFwicmVkXCIgfSlcbiAqICAgIC0+IFwiLmJsYWg6aG92ZXJ7Y29sb3I6IHJlZH1cIlxuICovXG52YXIgZ2VuZXJhdGVDU1NSdWxlc2V0ID0gZnVuY3Rpb24gZ2VuZXJhdGVDU1NSdWxlc2V0KHNlbGVjdG9yLCAvKiA6IHN0cmluZyAqL1xuZGVjbGFyYXRpb25zLCAvKiA6IE9yZGVyZWRFbGVtZW50cyAqL1xuc3RyaW5nSGFuZGxlcnMsIC8qIDogU3RyaW5nSGFuZGxlcnMgKi9cbnVzZUltcG9ydGFudCwgLyogOiBib29sZWFuICovXG5zZWxlY3RvckhhbmRsZXJzIC8qIDogU2VsZWN0b3JIYW5kbGVyW10gKi9cbikgLyogOiBzdHJpbmcgKi97XG4gICAgLy8gTXV0YXRlcyBkZWNsYXJhdGlvbnNcbiAgICBydW5TdHJpbmdIYW5kbGVycyhkZWNsYXJhdGlvbnMsIHN0cmluZ0hhbmRsZXJzLCBzZWxlY3RvckhhbmRsZXJzKTtcblxuICAgIHZhciBvcmlnaW5hbEVsZW1lbnRzID0gX2V4dGVuZHMoe30sIGRlY2xhcmF0aW9ucy5lbGVtZW50cyk7XG5cbiAgICAvLyBOT1RFKGVtaWx5KTogVGhpcyBtdXRhdGVzIGhhbmRsZWREZWNsYXJhdGlvbnMuZWxlbWVudHMuXG4gICAgdmFyIHByZWZpeGVkRWxlbWVudHMgPSBwcmVmaXhBbGwoZGVjbGFyYXRpb25zLmVsZW1lbnRzKTtcblxuICAgIHZhciBlbGVtZW50TmFtZXMgPSBPYmplY3Qua2V5cyhwcmVmaXhlZEVsZW1lbnRzKTtcbiAgICBpZiAoZWxlbWVudE5hbWVzLmxlbmd0aCAhPT0gZGVjbGFyYXRpb25zLmtleU9yZGVyLmxlbmd0aCkge1xuICAgICAgICAvLyBUaGVyZSBhcmUgc29tZSBwcmVmaXhlZCB2YWx1ZXMsIHNvIHdlIG5lZWQgdG8gZmlndXJlIG91dCBob3cgdG8gc29ydFxuICAgICAgICAvLyB0aGVtLlxuICAgICAgICAvL1xuICAgICAgICAvLyBMb29wIHRocm91Z2ggcHJlZml4ZWRFbGVtZW50cywgbG9va2luZyBmb3IgYW55dGhpbmcgdGhhdCBpcyBub3QgaW5cbiAgICAgICAgLy8gc29ydE9yZGVyLCB3aGljaCBtZWFucyBpdCB3YXMgYWRkZWQgYnkgcHJlZml4QWxsLiBUaGlzIG1lYW5zIHRoYXQgd2VcbiAgICAgICAgLy8gbmVlZCB0byBmaWd1cmUgb3V0IHdoZXJlIGl0IHNob3VsZCBhcHBlYXIgaW4gdGhlIHNvcnRPcmRlci5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICghb3JpZ2luYWxFbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShlbGVtZW50TmFtZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBlbGVtZW50IGlzIG5vdCBpbiB0aGUgc29ydE9yZGVyLCB3aGljaCBtZWFucyBpdCBpcyBhIHByZWZpeGVkXG4gICAgICAgICAgICAgICAgLy8gdmFsdWUgdGhhdCB3YXMgYWRkZWQgYnkgcHJlZml4QWxsLiBMZXQncyB0cnkgdG8gZmlndXJlIG91dCB3aGVyZSBpdFxuICAgICAgICAgICAgICAgIC8vIGdvZXMuXG4gICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsU3R5bGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnROYW1lc1tpXVswXSA9PT0gJ1cnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBXZWJraXQtcHJlZml4ZWQgc3R5bGUsIGxpa2UgXCJXZWJraXRUcmFuc2l0aW9uXCIuIExldCdzXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgaXRzIG9yaWdpbmFsIHN0eWxlJ3Mgc29ydCBvcmRlci5cbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxTdHlsZSA9IGVsZW1lbnROYW1lc1tpXVs2XS50b0xvd2VyQ2FzZSgpICsgZWxlbWVudE5hbWVzW2ldLnNsaWNlKDcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudE5hbWVzW2ldWzFdID09PSAnbycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIE1vei1wcmVmaXhlZCBzdHlsZSwgbGlrZSBcIk1velRyYW5zaXRpb25cIi4gV2UgY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHNlY29uZCBjaGFyYWN0ZXIgdG8gYXZvaWQgY29sbGlkaW5nIHdpdGggTXMtcHJlZml4ZWRcbiAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGVzLiBMZXQncyBmaW5kIGl0cyBvcmlnaW5hbCBzdHlsZSdzIHNvcnQgb3JkZXIuXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU3R5bGUgPSBlbGVtZW50TmFtZXNbaV1bM10udG9Mb3dlckNhc2UoKSArIGVsZW1lbnROYW1lc1tpXS5zbGljZSg0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoZWxlbWVudE5hbWVzW2ldWzFdID09PSAncycpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIE1zLXByZWZpeGVkIHN0eWxlLCBsaWtlIFwiTXNUcmFuc2l0aW9uXCIuXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU3R5bGUgPSBlbGVtZW50TmFtZXNbaV1bMl0udG9Mb3dlckNhc2UoKSArIGVsZW1lbnROYW1lc1tpXS5zbGljZSgzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxTdHlsZSAmJiBvcmlnaW5hbEVsZW1lbnRzLmhhc093blByb3BlcnR5KG9yaWdpbmFsU3R5bGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbEluZGV4ID0gZGVjbGFyYXRpb25zLmtleU9yZGVyLmluZGV4T2Yob3JpZ2luYWxTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9ucy5rZXlPcmRlci5zcGxpY2Uob3JpZ2luYWxJbmRleCwgMCwgZWxlbWVudE5hbWVzW2ldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBkb24ndCBrbm93IHdoYXQgdGhlIG9yaWdpbmFsIHN0eWxlIHdhcywgc28gc29ydCBpdCB0b1xuICAgICAgICAgICAgICAgICAgICAvLyB0b3AuIFRoaXMgY2FuIGhhcHBlbiBmb3Igc3R5bGVzIHRoYXQgYXJlIGFkZGVkIHRoYXQgZG9uJ3RcbiAgICAgICAgICAgICAgICAgICAgLy8gaGF2ZSB0aGUgc2FtZSBiYXNlIG5hbWUgYXMgdGhlIG9yaWdpbmFsIHN0eWxlLlxuICAgICAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbnMua2V5T3JkZXIudW5zaGlmdChlbGVtZW50TmFtZXNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciB0cmFuc2Zvcm1WYWx1ZSA9IHVzZUltcG9ydGFudCA9PT0gZmFsc2UgPyBfdXRpbC5zdHJpbmdpZnlWYWx1ZSA6IF91dGlsLnN0cmluZ2lmeUFuZEltcG9ydGFudGlmeVZhbHVlO1xuXG4gICAgdmFyIHJ1bGVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZWNsYXJhdGlvbnMua2V5T3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IGRlY2xhcmF0aW9ucy5rZXlPcmRlcltpXTtcbiAgICAgICAgdmFyIHZhbHVlID0gcHJlZml4ZWRFbGVtZW50c1trZXldO1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIGlubGluZS1zdHlsZS1wcmVmaXhlciByZXR1cm5zIGFuIGFycmF5IHdoZW4gdGhlcmUgc2hvdWxkIGJlXG4gICAgICAgICAgICAvLyBtdWx0aXBsZSBydWxlcyBmb3IgdGhlIHNhbWUga2V5LiBIZXJlIHdlIGZsYXR0ZW4gdG8gbXVsdGlwbGVcbiAgICAgICAgICAgIC8vIHBhaXJzIHdpdGggdGhlIHNhbWUga2V5LlxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHJ1bGVzLnB1c2godHJhbnNmb3JtUnVsZShrZXksIHZhbHVlW2pdLCB0cmFuc2Zvcm1WYWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcnVsZXMucHVzaCh0cmFuc2Zvcm1SdWxlKGtleSwgdmFsdWUsIHRyYW5zZm9ybVZhbHVlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocnVsZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3RvciArICd7JyArIHJ1bGVzLmpvaW4oXCJcIikgKyAnfSc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxufTtcbmV4cG9ydHMuZ2VuZXJhdGVDU1NSdWxlc2V0ID0gZ2VuZXJhdGVDU1NSdWxlc2V0OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX2FzYXAgPSByZXF1aXJlKCdhc2FwJyk7XG5cbnZhciBfYXNhcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hc2FwKTtcblxudmFyIF9vcmRlcmVkRWxlbWVudHMgPSByZXF1aXJlKCcuL29yZGVyZWQtZWxlbWVudHMnKTtcblxudmFyIF9vcmRlcmVkRWxlbWVudHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfb3JkZXJlZEVsZW1lbnRzKTtcblxudmFyIF9nZW5lcmF0ZSA9IHJlcXVpcmUoJy4vZ2VuZXJhdGUnKTtcblxudmFyIF91dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8qIDo6XG5pbXBvcnQgdHlwZSB7IFNoZWV0RGVmaW5pdGlvbiwgU2hlZXREZWZpbml0aW9ucyB9IGZyb20gJy4vaW5kZXguanMnO1xuaW1wb3J0IHR5cGUgeyBNYXliZVNoZWV0RGVmaW5pdGlvbiB9IGZyb20gJy4vZXhwb3J0cy5qcyc7XG5pbXBvcnQgdHlwZSB7IFNlbGVjdG9ySGFuZGxlciB9IGZyb20gJy4vZ2VuZXJhdGUuanMnO1xudHlwZSBQcm9jZXNzZWRTdHlsZURlZmluaXRpb25zID0ge1xuICBjbGFzc05hbWVCaXRzOiBBcnJheTxzdHJpbmc+LFxuICBkZWZpbml0aW9uQml0czogQXJyYXk8T2JqZWN0Pixcbn07XG4qL1xuXG4vLyBUaGUgY3VycmVudCA8c3R5bGU+IHRhZyB3ZSBhcmUgaW5zZXJ0aW5nIGludG8sIG9yIG51bGwgaWYgd2UgaGF2ZW4ndFxuLy8gaW5zZXJ0ZWQgYW55dGhpbmcgeWV0LiBXZSBjb3VsZCBmaW5kIHRoaXMgZWFjaCB0aW1lIHVzaW5nXG4vLyBgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInN0eWxlW2RhdGEtYXBocm9kaXRlXCJdKWAsIGJ1dCBob2xkaW5nIG9udG8gaXQgaXNcbi8vIGZhc3Rlci5cbnZhciBzdHlsZVRhZyA9IG51bGw7XG5cbi8vIEluamVjdCBhIHN0cmluZyBvZiBzdHlsZXMgaW50byBhIDxzdHlsZT4gdGFnIGluIHRoZSBoZWFkIG9mIHRoZSBkb2N1bWVudC4gVGhpc1xuLy8gd2lsbCBhdXRvbWF0aWNhbGx5IGNyZWF0ZSBhIHN0eWxlIHRhZyBhbmQgdGhlbiBjb250aW51ZSB0byB1c2UgaXQgZm9yXG4vLyBtdWx0aXBsZSBpbmplY3Rpb25zLiBJdCB3aWxsIGFsc28gdXNlIGEgc3R5bGUgdGFnIHdpdGggdGhlIGBkYXRhLWFwaHJvZGl0ZWBcbi8vIHRhZyBvbiBpdCBpZiB0aGF0IGV4aXN0cyBpbiB0aGUgRE9NLiBUaGlzIGNvdWxkIGJlIHVzZWQgZm9yIGUuZy4gcmV1c2luZyB0aGVcbi8vIHNhbWUgc3R5bGUgdGFnIHRoYXQgc2VydmVyLXNpZGUgcmVuZGVyaW5nIGluc2VydHMuXG52YXIgaW5qZWN0U3R5bGVUYWcgPSBmdW5jdGlvbiBpbmplY3RTdHlsZVRhZyhjc3NDb250ZW50cyAvKiA6IHN0cmluZyAqLykge1xuICAgIGlmIChzdHlsZVRhZyA9PSBudWxsKSB7XG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGEgc3R5bGUgdGFnIHdpdGggdGhlIGBkYXRhLWFwaHJvZGl0ZWAgYXR0cmlidXRlIGZpcnN0LlxuICAgICAgICBzdHlsZVRhZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzdHlsZVtkYXRhLWFwaHJvZGl0ZV1cIik7XG5cbiAgICAgICAgLy8gSWYgdGhhdCBkb2Vzbid0IHdvcmssIGdlbmVyYXRlIGEgbmV3IHN0eWxlIHRhZy5cbiAgICAgICAgaWYgKHN0eWxlVGFnID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIFRha2VuIGZyb21cbiAgICAgICAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTI0Njk2L2hvdy10by1jcmVhdGUtYS1zdHlsZS10YWctd2l0aC1qYXZhc2NyaXB0XG4gICAgICAgICAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAgICAgICAgIHN0eWxlVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICAgICAgICAgICAgc3R5bGVUYWcudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgICAgICAgICBzdHlsZVRhZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWFwaHJvZGl0ZVwiLCBcIlwiKTtcbiAgICAgICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVUYWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlVGFnLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgLy8gJEZsb3dGaXhNZTogbGVnYWN5IEludGVybmV0IEV4cGxvcmVyIGNvbXBhdGliaWxpdHlcbiAgICAgICAgc3R5bGVUYWcuc3R5bGVTaGVldC5jc3NUZXh0ICs9IGNzc0NvbnRlbnRzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHN0eWxlVGFnLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc0NvbnRlbnRzKSk7XG4gICAgfVxufTtcblxuLy8gQ3VzdG9tIGhhbmRsZXJzIGZvciBzdHJpbmdpZnlpbmcgQ1NTIHZhbHVlcyB0aGF0IGhhdmUgc2lkZSBlZmZlY3RzXG4vLyAoc3VjaCBhcyBmb250RmFtaWx5LCB3aGljaCBjYW4gY2F1c2UgQGZvbnQtZmFjZSBydWxlcyB0byBiZSBpbmplY3RlZClcbnZhciBzdHJpbmdIYW5kbGVycyA9IHtcbiAgICAvLyBXaXRoIGZvbnRGYW1pbHkgd2UgbG9vayBmb3Igb2JqZWN0cyB0aGF0IGFyZSBwYXNzZWQgaW4gYW5kIGludGVycHJldFxuICAgIC8vIHRoZW0gYXMgQGZvbnQtZmFjZSBydWxlcyB0aGF0IHdlIG5lZWQgdG8gaW5qZWN0LiBUaGUgdmFsdWUgb2YgZm9udEZhbWlseVxuICAgIC8vIGNhbiBlaXRoZXIgYmUgYSBzdHJpbmcgKGFzIG5vcm1hbCksIGFuIG9iamVjdCAoYSBzaW5nbGUgZm9udCBmYWNlKSwgb3JcbiAgICAvLyBhbiBhcnJheSBvZiBvYmplY3RzIGFuZCBzdHJpbmdzLlxuICAgIGZvbnRGYW1pbHk6IGZ1bmN0aW9uIGZvbnRGYW1pbHkodmFsKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWwubWFwKGZvbnRGYW1pbHkpLmpvaW4oXCIsXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGluamVjdFN0eWxlT25jZSh2YWwuc3JjLCBcIkBmb250LWZhY2VcIiwgW3ZhbF0sIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiAnXCInICsgdmFsLmZvbnRGYW1pbHkgKyAnXCInO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBXaXRoIGFuaW1hdGlvbk5hbWUgd2UgbG9vayBmb3IgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMga2V5ZnJhbWVzIGFuZFxuICAgIC8vIGluamVjdCB0aGVtIGFzIGFuIGBAa2V5ZnJhbWVzYCBibG9jaywgcmV0dXJuaW5nIGEgdW5pcXVlbHkgZ2VuZXJhdGVkXG4gICAgLy8gbmFtZS4gVGhlIGtleWZyYW1lcyBvYmplY3Qgc2hvdWxkIGxvb2sgbGlrZVxuICAgIC8vICBhbmltYXRpb25OYW1lOiB7XG4gICAgLy8gICAgZnJvbToge1xuICAgIC8vICAgICAgbGVmdDogMCxcbiAgICAvLyAgICAgIHRvcDogMCxcbiAgICAvLyAgICB9LFxuICAgIC8vICAgICc1MCUnOiB7XG4gICAgLy8gICAgICBsZWZ0OiAxNSxcbiAgICAvLyAgICAgIHRvcDogNSxcbiAgICAvLyAgICB9LFxuICAgIC8vICAgIHRvOiB7XG4gICAgLy8gICAgICBsZWZ0OiAyMCxcbiAgICAvLyAgICAgIHRvcDogMjAsXG4gICAgLy8gICAgfVxuICAgIC8vICB9XG4gICAgLy8gVE9ETyhlbWlseSk6IGBzdHJpbmdIYW5kbGVyc2AgZG9lc24ndCBsZXQgdXMgcmVuYW1lIHRoZSBrZXksIHNvIEkgaGF2ZVxuICAgIC8vIHRvIHVzZSBgYW5pbWF0aW9uTmFtZWAgaGVyZS4gSW1wcm92ZSB0aGF0IHNvIHdlIGNhbiBjYWxsIHRoaXNcbiAgICAvLyBgYW5pbWF0aW9uYCBpbnN0ZWFkIG9mIGBhbmltYXRpb25OYW1lYC5cbiAgICBhbmltYXRpb25OYW1lOiBmdW5jdGlvbiBhbmltYXRpb25OYW1lKHZhbCwgc2VsZWN0b3JIYW5kbGVycykge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhbmltYXRpb25OYW1lKHYsIHNlbGVjdG9ySGFuZGxlcnMpO1xuICAgICAgICAgICAgfSkuam9pbihcIixcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgbmFtZSBiYXNlZCBvbiB0aGUgaGFzaCBvZiB0aGUgb2JqZWN0LiBXZSBjYW4ndFxuICAgICAgICAgICAgLy8ganVzdCB1c2UgdGhlIGhhc2ggYmVjYXVzZSB0aGUgbmFtZSBjYW4ndCBzdGFydCB3aXRoIGEgbnVtYmVyLlxuICAgICAgICAgICAgLy8gVE9ETyhlbWlseSk6IHRoaXMgcHJvYmFibHkgbWFrZXMgZGVidWdnaW5nIGhhcmQsIGFsbG93IGEgY3VzdG9tXG4gICAgICAgICAgICAvLyBuYW1lP1xuICAgICAgICAgICAgdmFyIF9uYW1lID0gJ2tleWZyYW1lXycgKyAoMCwgX3V0aWwuaGFzaE9iamVjdCkodmFsKTtcblxuICAgICAgICAgICAgLy8gU2luY2Uga2V5ZnJhbWVzIG5lZWQgMyBsYXllcnMgb2YgbmVzdGluZywgd2UgdXNlIGBnZW5lcmF0ZUNTU2AgdG9cbiAgICAgICAgICAgIC8vIGJ1aWxkIHRoZSBpbm5lciBsYXllcnMgYW5kIHdyYXAgaXQgaW4gYEBrZXlmcmFtZXNgIG91cnNlbHZlcy5cbiAgICAgICAgICAgIHZhciBmaW5hbFZhbCA9ICdAa2V5ZnJhbWVzICcgKyBfbmFtZSArICd7JztcblxuICAgICAgICAgICAgLy8gVE9ETyBzZWUgaWYgd2UgY2FuIGZpbmQgYSB3YXkgd2hlcmUgY2hlY2tpbmcgZm9yIE9yZGVyZWRFbGVtZW50c1xuICAgICAgICAgICAgLy8gaGVyZSBpcyBub3QgbmVjZXNzYXJ5LiBBbHRlcm5hdGl2ZWx5LCBwZXJoYXBzIHdlIHNob3VsZCBoYXZlIGFcbiAgICAgICAgICAgIC8vIHV0aWxpdHkgbWV0aG9kIHRoYXQgY2FuIGl0ZXJhdGUgb3ZlciBlaXRoZXIgYSBwbGFpbiBvYmplY3QsIGFuXG4gICAgICAgICAgICAvLyBpbnN0YW5jZSBvZiBPcmRlcmVkRWxlbWVudHMsIG9yIGEgTWFwLCBhbmQgdGhlbiB1c2UgdGhhdCBoZXJlIGFuZFxuICAgICAgICAgICAgLy8gZWxzZXdoZXJlLlxuICAgICAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIF9vcmRlcmVkRWxlbWVudHMyWydkZWZhdWx0J10pIHtcbiAgICAgICAgICAgICAgICB2YWwuZm9yRWFjaChmdW5jdGlvbiAodmFsVmFsLCB2YWxLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmluYWxWYWwgKz0gKDAsIF9nZW5lcmF0ZS5nZW5lcmF0ZUNTUykodmFsS2V5LCBbdmFsVmFsXSwgc2VsZWN0b3JIYW5kbGVycywgc3RyaW5nSGFuZGxlcnMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXModmFsKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmluYWxWYWwgKz0gKDAsIF9nZW5lcmF0ZS5nZW5lcmF0ZUNTUykoa2V5LCBbdmFsW2tleV1dLCBzZWxlY3RvckhhbmRsZXJzLCBzdHJpbmdIYW5kbGVycywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxWYWwgKz0gJ30nO1xuXG4gICAgICAgICAgICBpbmplY3RHZW5lcmF0ZWRDU1NPbmNlKF9uYW1lLCBmaW5hbFZhbCk7XG5cbiAgICAgICAgICAgIHJldHVybiBfbmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBUaGlzIGlzIGEgbWFwIGZyb20gQXBocm9kaXRlJ3MgZ2VuZXJhdGVkIGNsYXNzIG5hbWVzIHRvIGB0cnVlYCAoYWN0aW5nIGFzIGFcbi8vIHNldCBvZiBjbGFzcyBuYW1lcylcbnZhciBhbHJlYWR5SW5qZWN0ZWQgPSB7fTtcblxuLy8gVGhpcyBpcyB0aGUgYnVmZmVyIG9mIHN0eWxlcyB3aGljaCBoYXZlIG5vdCB5ZXQgYmVlbiBmbHVzaGVkLlxudmFyIGluamVjdGlvbkJ1ZmZlciA9IFwiXCI7XG5cbi8vIEEgZmxhZyB0byB0ZWxsIGlmIHdlIGFyZSBhbHJlYWR5IGJ1ZmZlcmluZyBzdHlsZXMuIFRoaXMgY291bGQgaGFwcGVuIGVpdGhlclxuLy8gYmVjYXVzZSB3ZSBzY2hlZHVsZWQgYSBmbHVzaCBjYWxsIGFscmVhZHksIHNvIG5ld2x5IGFkZGVkIHN0eWxlcyB3aWxsXG4vLyBhbHJlYWR5IGJlIGZsdXNoZWQsIG9yIGJlY2F1c2Ugd2UgYXJlIHN0YXRpY2FsbHkgYnVmZmVyaW5nIG9uIHRoZSBzZXJ2ZXIuXG52YXIgaXNCdWZmZXJpbmcgPSBmYWxzZTtcblxudmFyIGluamVjdEdlbmVyYXRlZENTU09uY2UgPSBmdW5jdGlvbiBpbmplY3RHZW5lcmF0ZWRDU1NPbmNlKGtleSwgZ2VuZXJhdGVkQ1NTKSB7XG4gICAgaWYgKGFscmVhZHlJbmplY3RlZFtrZXldKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWlzQnVmZmVyaW5nKSB7XG4gICAgICAgIC8vIFdlIHNob3VsZCBuZXZlciBiZSBhdXRvbWF0aWNhbGx5IGJ1ZmZlcmluZyBvbiB0aGUgc2VydmVyIChvciBhbnlcbiAgICAgICAgLy8gcGxhY2Ugd2l0aG91dCBhIGRvY3VtZW50KSwgc28gZ3VhcmQgYWdhaW5zdCB0aGF0LlxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYXV0b21hdGljYWxseSBidWZmZXIgd2l0aG91dCBhIGRvY3VtZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UncmUgbm90IGFscmVhZHkgYnVmZmVyaW5nLCBzY2hlZHVsZSBhIGNhbGwgdG8gZmx1c2ggdGhlXG4gICAgICAgIC8vIGN1cnJlbnQgc3R5bGVzLlxuICAgICAgICBpc0J1ZmZlcmluZyA9IHRydWU7XG4gICAgICAgICgwLCBfYXNhcDJbJ2RlZmF1bHQnXSkoZmx1c2hUb1N0eWxlVGFnKTtcbiAgICB9XG5cbiAgICBpbmplY3Rpb25CdWZmZXIgKz0gZ2VuZXJhdGVkQ1NTO1xuICAgIGFscmVhZHlJbmplY3RlZFtrZXldID0gdHJ1ZTtcbn07XG5cbnZhciBpbmplY3RTdHlsZU9uY2UgPSBmdW5jdGlvbiBpbmplY3RTdHlsZU9uY2Uoa2V5LCAvKiA6IHN0cmluZyAqL1xuc2VsZWN0b3IsIC8qIDogc3RyaW5nICovXG5kZWZpbml0aW9ucywgLyogOiBTaGVldERlZmluaXRpb25bXSAqL1xudXNlSW1wb3J0YW50IC8qIDogYm9vbGVhbiAqL1xuKSB7XG4gICAgdmFyIHNlbGVjdG9ySGFuZGxlcnMgLyogOiBTZWxlY3RvckhhbmRsZXJbXSAqLyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gNCB8fCBhcmd1bWVudHNbNF0gPT09IHVuZGVmaW5lZCA/IFtdIDogYXJndW1lbnRzWzRdO1xuXG4gICAgaWYgKGFscmVhZHlJbmplY3RlZFtrZXldKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZ2VuZXJhdGVkID0gKDAsIF9nZW5lcmF0ZS5nZW5lcmF0ZUNTUykoc2VsZWN0b3IsIGRlZmluaXRpb25zLCBzZWxlY3RvckhhbmRsZXJzLCBzdHJpbmdIYW5kbGVycywgdXNlSW1wb3J0YW50KTtcblxuICAgIGluamVjdEdlbmVyYXRlZENTU09uY2Uoa2V5LCBnZW5lcmF0ZWQpO1xufTtcblxuZXhwb3J0cy5pbmplY3RTdHlsZU9uY2UgPSBpbmplY3RTdHlsZU9uY2U7XG52YXIgcmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcbiAgICBpbmplY3Rpb25CdWZmZXIgPSBcIlwiO1xuICAgIGFscmVhZHlJbmplY3RlZCA9IHt9O1xuICAgIGlzQnVmZmVyaW5nID0gZmFsc2U7XG4gICAgc3R5bGVUYWcgPSBudWxsO1xufTtcblxuZXhwb3J0cy5yZXNldCA9IHJlc2V0O1xudmFyIHN0YXJ0QnVmZmVyaW5nID0gZnVuY3Rpb24gc3RhcnRCdWZmZXJpbmcoKSB7XG4gICAgaWYgKGlzQnVmZmVyaW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBidWZmZXIgd2hpbGUgYWxyZWFkeSBidWZmZXJpbmdcIik7XG4gICAgfVxuICAgIGlzQnVmZmVyaW5nID0gdHJ1ZTtcbn07XG5cbmV4cG9ydHMuc3RhcnRCdWZmZXJpbmcgPSBzdGFydEJ1ZmZlcmluZztcbnZhciBmbHVzaFRvU3RyaW5nID0gZnVuY3Rpb24gZmx1c2hUb1N0cmluZygpIHtcbiAgICBpc0J1ZmZlcmluZyA9IGZhbHNlO1xuICAgIHZhciByZXQgPSBpbmplY3Rpb25CdWZmZXI7XG4gICAgaW5qZWN0aW9uQnVmZmVyID0gXCJcIjtcbiAgICByZXR1cm4gcmV0O1xufTtcblxuZXhwb3J0cy5mbHVzaFRvU3RyaW5nID0gZmx1c2hUb1N0cmluZztcbnZhciBmbHVzaFRvU3R5bGVUYWcgPSBmdW5jdGlvbiBmbHVzaFRvU3R5bGVUYWcoKSB7XG4gICAgdmFyIGNzc0NvbnRlbnQgPSBmbHVzaFRvU3RyaW5nKCk7XG4gICAgaWYgKGNzc0NvbnRlbnQubGVuZ3RoID4gMCkge1xuICAgICAgICBpbmplY3RTdHlsZVRhZyhjc3NDb250ZW50KTtcbiAgICB9XG59O1xuXG5leHBvcnRzLmZsdXNoVG9TdHlsZVRhZyA9IGZsdXNoVG9TdHlsZVRhZztcbnZhciBnZXRSZW5kZXJlZENsYXNzTmFtZXMgPSBmdW5jdGlvbiBnZXRSZW5kZXJlZENsYXNzTmFtZXMoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGFscmVhZHlJbmplY3RlZCk7XG59O1xuXG5leHBvcnRzLmdldFJlbmRlcmVkQ2xhc3NOYW1lcyA9IGdldFJlbmRlcmVkQ2xhc3NOYW1lcztcbnZhciBhZGRSZW5kZXJlZENsYXNzTmFtZXMgPSBmdW5jdGlvbiBhZGRSZW5kZXJlZENsYXNzTmFtZXMoY2xhc3NOYW1lcyAvKiA6IHN0cmluZ1tdICovKSB7XG4gICAgY2xhc3NOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgICAgYWxyZWFkeUluamVjdGVkW2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgIH0pO1xufTtcblxuZXhwb3J0cy5hZGRSZW5kZXJlZENsYXNzTmFtZXMgPSBhZGRSZW5kZXJlZENsYXNzTmFtZXM7XG52YXIgcHJvY2Vzc1N0eWxlRGVmaW5pdGlvbnMgPSBmdW5jdGlvbiBwcm9jZXNzU3R5bGVEZWZpbml0aW9ucyhzdHlsZURlZmluaXRpb25zLCAvKiA6IGFueVtdICovXG5yZXN1bHQgLyogOiBQcm9jZXNzZWRTdHlsZURlZmluaXRpb25zICovXG4pIC8qIDogdm9pZCAqL3tcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlRGVmaW5pdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgLy8gRmlsdGVyIG91dCBmYWxzeSB2YWx1ZXMgZnJvbSB0aGUgaW5wdXQsIHRvIGFsbG93IGZvclxuICAgICAgICAvLyBgY3NzKGEsIHRlc3QgJiYgYylgXG4gICAgICAgIGlmIChzdHlsZURlZmluaXRpb25zW2ldKSB7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzdHlsZURlZmluaXRpb25zW2ldKSkge1xuICAgICAgICAgICAgICAgIC8vIFdlJ3ZlIGVuY291bnRlcmVkIGFuIGFycmF5LCBzbyBsZXQncyByZWN1cnNlXG4gICAgICAgICAgICAgICAgcHJvY2Vzc1N0eWxlRGVmaW5pdGlvbnMoc3R5bGVEZWZpbml0aW9uc1tpXSwgcmVzdWx0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmNsYXNzTmFtZUJpdHMucHVzaChzdHlsZURlZmluaXRpb25zW2ldLl9uYW1lKTtcbiAgICAgICAgICAgICAgICByZXN1bHQuZGVmaW5pdGlvbkJpdHMucHVzaChzdHlsZURlZmluaXRpb25zW2ldLl9kZWZpbml0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogSW5qZWN0IHN0eWxlcyBhc3NvY2lhdGVkIHdpdGggdGhlIHBhc3NlZCBzdHlsZSBkZWZpbml0aW9uIG9iamVjdHMsIGFuZCByZXR1cm5cbiAqIGFuIGFzc29jaWF0ZWQgQ1NTIGNsYXNzIG5hbWUuXG4gKlxuICogQHBhcmFtIHtib29sZWFufSB1c2VJbXBvcnRhbnQgSWYgdHJ1ZSwgd2lsbCBhcHBlbmQgIWltcG9ydGFudCB0byBnZW5lcmF0ZWRcbiAqICAgICBDU1Mgb3V0cHV0LiBlLmcuIHtjb2xvcjogcmVkfSAtPiBcImNvbG9yOiByZWQgIWltcG9ydGFudFwiLlxuICogQHBhcmFtIHsoT2JqZWN0fE9iamVjdFtdKVtdfSBzdHlsZURlZmluaXRpb25zIHN0eWxlIGRlZmluaXRpb24gb2JqZWN0cywgb3JcbiAqICAgICBhcmJpdHJhcmlseSBuZXN0ZWQgYXJyYXlzIG9mIHRoZW0sIGFzIHJldHVybmVkIGFzIHByb3BlcnRpZXMgb2YgdGhlXG4gKiAgICAgcmV0dXJuIHZhbHVlIG9mIFN0eWxlU2hlZXQuY3JlYXRlKCkuXG4gKi9cbnZhciBpbmplY3RBbmRHZXRDbGFzc05hbWUgPSBmdW5jdGlvbiBpbmplY3RBbmRHZXRDbGFzc05hbWUodXNlSW1wb3J0YW50LCAvKiA6IGJvb2xlYW4gKi9cbnN0eWxlRGVmaW5pdGlvbnMsIC8qIDogTWF5YmVTaGVldERlZmluaXRpb25bXSAqL1xuc2VsZWN0b3JIYW5kbGVycyAvKiA6IFNlbGVjdG9ySGFuZGxlcltdICovXG4pIC8qIDogc3RyaW5nICove1xuICAgIHZhciBwcm9jZXNzZWRTdHlsZURlZmluaXRpb25zIC8qIDogUHJvY2Vzc2VkU3R5bGVEZWZpbml0aW9ucyAqLyA9IHtcbiAgICAgICAgY2xhc3NOYW1lQml0czogW10sXG4gICAgICAgIGRlZmluaXRpb25CaXRzOiBbXVxuICAgIH07XG4gICAgLy8gTXV0YXRlcyBwcm9jZXNzZWRTdHlsZURlZmluaXRpb25zXG4gICAgcHJvY2Vzc1N0eWxlRGVmaW5pdGlvbnMoc3R5bGVEZWZpbml0aW9ucywgcHJvY2Vzc2VkU3R5bGVEZWZpbml0aW9ucyk7XG5cbiAgICAvLyBCcmVhayBpZiB0aGVyZSBhcmVuJ3QgYW55IHZhbGlkIHN0eWxlcy5cbiAgICBpZiAocHJvY2Vzc2VkU3R5bGVEZWZpbml0aW9ucy5jbGFzc05hbWVCaXRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgdmFyIGNsYXNzTmFtZSA9IHByb2Nlc3NlZFN0eWxlRGVmaW5pdGlvbnMuY2xhc3NOYW1lQml0cy5qb2luKFwiLW9fTy1cIik7XG5cbiAgICBpbmplY3RTdHlsZU9uY2UoY2xhc3NOYW1lLCAnLicgKyBjbGFzc05hbWUsIHByb2Nlc3NlZFN0eWxlRGVmaW5pdGlvbnMuZGVmaW5pdGlvbkJpdHMsIHVzZUltcG9ydGFudCwgc2VsZWN0b3JIYW5kbGVycyk7XG5cbiAgICByZXR1cm4gY2xhc3NOYW1lO1xufTtcbmV4cG9ydHMuaW5qZWN0QW5kR2V0Q2xhc3NOYW1lID0gaW5qZWN0QW5kR2V0Q2xhc3NOYW1lOyIsIlxuLy8gTW9kdWxlIHdpdGggdGhlIHNhbWUgaW50ZXJmYWNlIGFzIHRoZSBjb3JlIGFwaHJvZGl0ZSBtb2R1bGUsXG4vLyBleGNlcHQgdGhhdCBzdHlsZXMgaW5qZWN0ZWQgZG8gbm90IGF1dG9tYXRpY2FsbHkgaGF2ZSAhaW1wb3J0YW50XG4vLyBhcHBlbmRlZCB0byB0aGVtLlxuJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyAnZGVmYXVsdCc6IG9iaiB9OyB9XG5cbnZhciBfZ2VuZXJhdGUgPSByZXF1aXJlKCcuL2dlbmVyYXRlJyk7XG5cbnZhciBfZXhwb3J0czIgPSByZXF1aXJlKCcuL2V4cG9ydHMnKTtcblxudmFyIF9leHBvcnRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4cG9ydHMyKTtcblxudmFyIHVzZUltcG9ydGFudCA9IGZhbHNlOyAvLyBEb24ndCBhZGQgIWltcG9ydGFudCB0byBzdHlsZSBkZWZpbml0aW9uc1xuZXhwb3J0c1snZGVmYXVsdCddID0gKDAsIF9leHBvcnRzM1snZGVmYXVsdCddKSh1c2VJbXBvcnRhbnQsIF9nZW5lcmF0ZS5kZWZhdWx0U2VsZWN0b3JIYW5kbGVycyk7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxuXG52YXIgTUFQX0VYSVNUUyA9IHR5cGVvZiBNYXAgIT09ICd1bmRlZmluZWQnO1xuXG52YXIgT3JkZXJlZEVsZW1lbnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvKiA6OlxuICAgIGVsZW1lbnRzOiB7W3N0cmluZ106IGFueX07XG4gICAga2V5T3JkZXI6IHN0cmluZ1tdO1xuICAgICovXG5cbiAgICBmdW5jdGlvbiBPcmRlcmVkRWxlbWVudHMoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBPcmRlcmVkRWxlbWVudHMpO1xuXG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSB7fTtcbiAgICAgICAgdGhpcy5rZXlPcmRlciA9IFtdO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhPcmRlcmVkRWxlbWVudHMsIFt7XG4gICAgICAgIGtleTogJ2ZvckVhY2gnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFjayAvKiA6IChzdHJpbmcsIGFueSkgPT4gdm9pZCAqLykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtleU9yZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gKHZhbHVlLCBrZXkpIHRvIG1hdGNoIE1hcCdzIEFQSVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHRoaXMuZWxlbWVudHNbdGhpcy5rZXlPcmRlcltpXV0sIHRoaXMua2V5T3JkZXJbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdzZXQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0KGtleSwgLyogOiBzdHJpbmcgKi92YWx1ZSAvKiA6IGFueSAqLykge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmVsZW1lbnRzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleU9yZGVyLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnRzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChNQVBfRVhJU1RTICYmIHZhbHVlIGluc3RhbmNlb2YgTWFwIHx8IHZhbHVlIGluc3RhbmNlb2YgT3JkZXJlZEVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9yZXQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIGZvdW5kIGEgbmVzdGVkIE1hcCwgc28gd2UgbmVlZCB0byByZWN1cnNlIHNvIHRoYXQgYWxsXG4gICAgICAgICAgICAgICAgICAgIC8vIG9mIHRoZSBuZXN0ZWQgb2JqZWN0cyBhbmQgTWFwcyBhcmUgbWVyZ2VkIHByb3Blcmx5LlxuICAgICAgICAgICAgICAgICAgICB2YXIgbmVzdGVkID0gX3RoaXMuZWxlbWVudHMuaGFzT3duUHJvcGVydHkoa2V5KSA/IF90aGlzLmVsZW1lbnRzW2tleV0gOiBuZXcgT3JkZXJlZEVsZW1lbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5lc3RlZC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbGVtZW50c1trZXldID0gbmVzdGVkO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSkoKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgX3JldCA9PT0gJ29iamVjdCcpIHJldHVybiBfcmV0LnY7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgZm91bmQgYSBuZXN0ZWQgb2JqZWN0LCBzbyB3ZSBuZWVkIHRvIHJlY3Vyc2Ugc28gdGhhdCBhbGxcbiAgICAgICAgICAgICAgICAvLyBvZiB0aGUgbmVzdGVkIG9iamVjdHMgYW5kIE1hcHMgYXJlIG1lcmdlZCBwcm9wZXJseS5cbiAgICAgICAgICAgICAgICB2YXIgbmVzdGVkID0gdGhpcy5lbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpID8gdGhpcy5lbGVtZW50c1trZXldIDogbmV3IE9yZGVyZWRFbGVtZW50cygpO1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBuZXN0ZWQuc2V0KGtleXNbaV0sIHZhbHVlW2tleXNbaV1dKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50c1trZXldID0gbmVzdGVkO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5lbGVtZW50c1trZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXQoa2V5IC8qIDogc3RyaW5nICovKSAvKiA6IGFueSAqL3tcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRzW2tleV07XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYXMoa2V5IC8qIDogc3RyaW5nICovKSAvKiA6IGJvb2xlYW4gKi97XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdhZGRTdHlsZVR5cGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkU3R5bGVUeXBlKHN0eWxlVHlwZSAvKiA6IGFueSAqLykgLyogOiB2b2lkICove1xuICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGlmIChNQVBfRVhJU1RTICYmIHN0eWxlVHlwZSBpbnN0YW5jZW9mIE1hcCB8fCBzdHlsZVR5cGUgaW5zdGFuY2VvZiBPcmRlcmVkRWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICBzdHlsZVR5cGUuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczIuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHN0eWxlVHlwZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0KGtleXNbaV0sIHN0eWxlVHlwZVtrZXlzW2ldXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIE9yZGVyZWRFbGVtZW50cztcbn0pKCk7XG5cbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IE9yZGVyZWRFbGVtZW50cztcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsInZhciBjYWxjID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2NhbGMnKVxudmFyIGNyb3NzRmFkZSA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9jcm9zc0ZhZGUnKVxudmFyIGN1cnNvciA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9jdXJzb3InKVxudmFyIGZpbHRlciA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9maWx0ZXInKVxudmFyIGZsZXggPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvZmxleCcpXG52YXIgZmxleGJveElFID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL2ZsZXhib3hJRScpXG52YXIgZmxleGJveE9sZCA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9mbGV4Ym94T2xkJylcbnZhciBncmFkaWVudCA9IHJlcXVpcmUoJ2lubGluZS1zdHlsZS1wcmVmaXhlci9zdGF0aWMvcGx1Z2lucy9ncmFkaWVudCcpXG52YXIgaW1hZ2VTZXQgPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvaW1hZ2VTZXQnKVxudmFyIHBvc2l0aW9uID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL3Bvc2l0aW9uJylcbnZhciBzaXppbmcgPSByZXF1aXJlKCdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljL3BsdWdpbnMvc2l6aW5nJylcbnZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYy9wbHVnaW5zL3RyYW5zaXRpb24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9ICB7XG4gIHBsdWdpbnM6IFtjYWxjLGNyb3NzRmFkZSxjdXJzb3IsZmlsdGVyLGZsZXgsZmxleGJveElFLGZsZXhib3hPbGQsZ3JhZGllbnQsaW1hZ2VTZXQscG9zaXRpb24sc2l6aW5nLHRyYW5zaXRpb25dLFxuICBwcmVmaXhNYXA6IHtcInRyYW5zZm9ybVwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJ0cmFuc2Zvcm1PcmlnaW5cIjpbXCJXZWJraXRcIixcIm1zXCJdLFwidHJhbnNmb3JtT3JpZ2luWFwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJ0cmFuc2Zvcm1PcmlnaW5ZXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcImJhY2tmYWNlVmlzaWJpbGl0eVwiOltcIldlYmtpdFwiXSxcInBlcnNwZWN0aXZlXCI6W1wiV2Via2l0XCJdLFwicGVyc3BlY3RpdmVPcmlnaW5cIjpbXCJXZWJraXRcIl0sXCJ0cmFuc2Zvcm1TdHlsZVwiOltcIldlYmtpdFwiXSxcInRyYW5zZm9ybU9yaWdpblpcIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25cIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25EZWxheVwiOltcIldlYmtpdFwiXSxcImFuaW1hdGlvbkRpcmVjdGlvblwiOltcIldlYmtpdFwiXSxcImFuaW1hdGlvbkZpbGxNb2RlXCI6W1wiV2Via2l0XCJdLFwiYW5pbWF0aW9uRHVyYXRpb25cIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25JdGVyYXRpb25Db3VudFwiOltcIldlYmtpdFwiXSxcImFuaW1hdGlvbk5hbWVcIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25QbGF5U3RhdGVcIjpbXCJXZWJraXRcIl0sXCJhbmltYXRpb25UaW1pbmdGdW5jdGlvblwiOltcIldlYmtpdFwiXSxcImFwcGVhcmFuY2VcIjpbXCJXZWJraXRcIixcIk1velwiXSxcInVzZXJTZWxlY3RcIjpbXCJXZWJraXRcIixcIk1velwiLFwibXNcIl0sXCJmb250S2VybmluZ1wiOltcIldlYmtpdFwiXSxcInRleHRFbXBoYXNpc1Bvc2l0aW9uXCI6W1wiV2Via2l0XCJdLFwidGV4dEVtcGhhc2lzXCI6W1wiV2Via2l0XCJdLFwidGV4dEVtcGhhc2lzU3R5bGVcIjpbXCJXZWJraXRcIl0sXCJ0ZXh0RW1waGFzaXNDb2xvclwiOltcIldlYmtpdFwiXSxcImJveERlY29yYXRpb25CcmVha1wiOltcIldlYmtpdFwiXSxcImNsaXBQYXRoXCI6W1wiV2Via2l0XCJdLFwibWFza0ltYWdlXCI6W1wiV2Via2l0XCJdLFwibWFza01vZGVcIjpbXCJXZWJraXRcIl0sXCJtYXNrUmVwZWF0XCI6W1wiV2Via2l0XCJdLFwibWFza1Bvc2l0aW9uXCI6W1wiV2Via2l0XCJdLFwibWFza0NsaXBcIjpbXCJXZWJraXRcIl0sXCJtYXNrT3JpZ2luXCI6W1wiV2Via2l0XCJdLFwibWFza1NpemVcIjpbXCJXZWJraXRcIl0sXCJtYXNrQ29tcG9zaXRlXCI6W1wiV2Via2l0XCJdLFwibWFza1wiOltcIldlYmtpdFwiXSxcIm1hc2tCb3JkZXJTb3VyY2VcIjpbXCJXZWJraXRcIl0sXCJtYXNrQm9yZGVyTW9kZVwiOltcIldlYmtpdFwiXSxcIm1hc2tCb3JkZXJTbGljZVwiOltcIldlYmtpdFwiXSxcIm1hc2tCb3JkZXJXaWR0aFwiOltcIldlYmtpdFwiXSxcIm1hc2tCb3JkZXJPdXRzZXRcIjpbXCJXZWJraXRcIl0sXCJtYXNrQm9yZGVyUmVwZWF0XCI6W1wiV2Via2l0XCJdLFwibWFza0JvcmRlclwiOltcIldlYmtpdFwiXSxcIm1hc2tUeXBlXCI6W1wiV2Via2l0XCJdLFwidGV4dERlY29yYXRpb25TdHlsZVwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwidGV4dERlY29yYXRpb25Ta2lwXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJ0ZXh0RGVjb3JhdGlvbkxpbmVcIjpbXCJXZWJraXRcIixcIk1velwiXSxcInRleHREZWNvcmF0aW9uQ29sb3JcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImZpbHRlclwiOltcIldlYmtpdFwiXSxcImZvbnRGZWF0dXJlU2V0dGluZ3NcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImJyZWFrQWZ0ZXJcIjpbXCJXZWJraXRcIixcIk1velwiLFwibXNcIl0sXCJicmVha0JlZm9yZVwiOltcIldlYmtpdFwiLFwiTW96XCIsXCJtc1wiXSxcImJyZWFrSW5zaWRlXCI6W1wiV2Via2l0XCIsXCJNb3pcIixcIm1zXCJdLFwiY29sdW1uQ291bnRcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtbkZpbGxcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtbkdhcFwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uUnVsZVwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uUnVsZUNvbG9yXCI6W1wiV2Via2l0XCIsXCJNb3pcIl0sXCJjb2x1bW5SdWxlU3R5bGVcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImNvbHVtblJ1bGVXaWR0aFwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uc1wiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uU3BhblwiOltcIldlYmtpdFwiLFwiTW96XCJdLFwiY29sdW1uV2lkdGhcIjpbXCJXZWJraXRcIixcIk1velwiXSxcImZsZXhcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwiZmxleEJhc2lzXCI6W1wiV2Via2l0XCJdLFwiZmxleERpcmVjdGlvblwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJmbGV4R3Jvd1wiOltcIldlYmtpdFwiXSxcImZsZXhGbG93XCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcImZsZXhTaHJpbmtcIjpbXCJXZWJraXRcIl0sXCJmbGV4V3JhcFwiOltcIldlYmtpdFwiLFwibXNcIl0sXCJhbGlnbkNvbnRlbnRcIjpbXCJXZWJraXRcIl0sXCJhbGlnbkl0ZW1zXCI6W1wiV2Via2l0XCJdLFwiYWxpZ25TZWxmXCI6W1wiV2Via2l0XCJdLFwianVzdGlmeUNvbnRlbnRcIjpbXCJXZWJraXRcIl0sXCJvcmRlclwiOltcIldlYmtpdFwiXSxcInRyYW5zaXRpb25EZWxheVwiOltcIldlYmtpdFwiXSxcInRyYW5zaXRpb25EdXJhdGlvblwiOltcIldlYmtpdFwiXSxcInRyYW5zaXRpb25Qcm9wZXJ0eVwiOltcIldlYmtpdFwiXSxcInRyYW5zaXRpb25UaW1pbmdGdW5jdGlvblwiOltcIldlYmtpdFwiXSxcImJhY2tkcm9wRmlsdGVyXCI6W1wiV2Via2l0XCJdLFwic2Nyb2xsU25hcFR5cGVcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwic2Nyb2xsU25hcFBvaW50c1hcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwic2Nyb2xsU25hcFBvaW50c1lcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwic2Nyb2xsU25hcERlc3RpbmF0aW9uXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcInNjcm9sbFNuYXBDb29yZGluYXRlXCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcInNoYXBlSW1hZ2VUaHJlc2hvbGRcIjpbXCJXZWJraXRcIl0sXCJzaGFwZUltYWdlTWFyZ2luXCI6W1wiV2Via2l0XCJdLFwic2hhcGVJbWFnZU91dHNpZGVcIjpbXCJXZWJraXRcIl0sXCJoeXBoZW5zXCI6W1wiV2Via2l0XCIsXCJNb3pcIixcIm1zXCJdLFwiZmxvd0ludG9cIjpbXCJXZWJraXRcIixcIm1zXCJdLFwiZmxvd0Zyb21cIjpbXCJXZWJraXRcIixcIm1zXCJdLFwicmVnaW9uRnJhZ21lbnRcIjpbXCJXZWJraXRcIixcIm1zXCJdLFwiYm94U2l6aW5nXCI6W1wiTW96XCJdLFwidGV4dEFsaWduTGFzdFwiOltcIk1velwiXSxcInRhYlNpemVcIjpbXCJNb3pcIl0sXCJ3cmFwRmxvd1wiOltcIm1zXCJdLFwid3JhcFRocm91Z2hcIjpbXCJtc1wiXSxcIndyYXBNYXJnaW5cIjpbXCJtc1wiXSxcInRvdWNoQWN0aW9uXCI6W1wibXNcIl0sXCJncmlkVGVtcGxhdGVDb2x1bW5zXCI6W1wibXNcIl0sXCJncmlkVGVtcGxhdGVSb3dzXCI6W1wibXNcIl0sXCJncmlkVGVtcGxhdGVBcmVhc1wiOltcIm1zXCJdLFwiZ3JpZFRlbXBsYXRlXCI6W1wibXNcIl0sXCJncmlkQXV0b0NvbHVtbnNcIjpbXCJtc1wiXSxcImdyaWRBdXRvUm93c1wiOltcIm1zXCJdLFwiZ3JpZEF1dG9GbG93XCI6W1wibXNcIl0sXCJncmlkXCI6W1wibXNcIl0sXCJncmlkUm93U3RhcnRcIjpbXCJtc1wiXSxcImdyaWRDb2x1bW5TdGFydFwiOltcIm1zXCJdLFwiZ3JpZFJvd0VuZFwiOltcIm1zXCJdLFwiZ3JpZFJvd1wiOltcIm1zXCJdLFwiZ3JpZENvbHVtblwiOltcIm1zXCJdLFwiZ3JpZENvbHVtbkVuZFwiOltcIm1zXCJdLFwiZ3JpZENvbHVtbkdhcFwiOltcIm1zXCJdLFwiZ3JpZFJvd0dhcFwiOltcIm1zXCJdLFwiZ3JpZEFyZWFcIjpbXCJtc1wiXSxcImdyaWRHYXBcIjpbXCJtc1wiXSxcInRleHRTaXplQWRqdXN0XCI6W1wiV2Via2l0XCIsXCJtc1wiXSxcImJvcmRlckltYWdlXCI6W1wiV2Via2l0XCJdLFwiYm9yZGVySW1hZ2VPdXRzZXRcIjpbXCJXZWJraXRcIl0sXCJib3JkZXJJbWFnZVJlcGVhdFwiOltcIldlYmtpdFwiXSxcImJvcmRlckltYWdlU2xpY2VcIjpbXCJXZWJraXRcIl0sXCJib3JkZXJJbWFnZVNvdXJjZVwiOltcIldlYmtpdFwiXSxcImJvcmRlckltYWdlV2lkdGhcIjpbXCJXZWJraXRcIl19XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3NsaWNlZFRvQXJyYXkgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkgeyB2YXIgX2FyciA9IFtdOyB2YXIgX24gPSB0cnVlOyB2YXIgX2QgPSBmYWxzZTsgdmFyIF9lID0gdW5kZWZpbmVkOyB0cnkgeyBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7IF9hcnIucHVzaChfcy52YWx1ZSk7IGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhazsgfSB9IGNhdGNoIChlcnIpIHsgX2QgPSB0cnVlOyBfZSA9IGVycjsgfSBmaW5hbGx5IHsgdHJ5IHsgaWYgKCFfbiAmJiBfaVsncmV0dXJuJ10pIF9pWydyZXR1cm4nXSgpOyB9IGZpbmFsbHkgeyBpZiAoX2QpIHRocm93IF9lOyB9IH0gcmV0dXJuIF9hcnI7IH0gcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyByZXR1cm4gYXJyOyB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkgeyByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpOyB9IGVsc2UgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlJyk7IH0gfTsgfSkoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxuXG52YXIgX3N0cmluZ0hhc2ggPSByZXF1aXJlKCdzdHJpbmctaGFzaCcpO1xuXG52YXIgX3N0cmluZ0hhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5nSGFzaCk7XG5cbi8qIDo6XG50eXBlIFBhaXIgPSBbIHN0cmluZywgYW55IF07XG50eXBlIFBhaXJzID0gUGFpcltdO1xudHlwZSBQYWlyc01hcHBlciA9IChwYWlyOiBQYWlyKSA9PiBQYWlyO1xudHlwZSBPYmplY3RNYXAgPSB7IFtpZDpzdHJpbmddOiBhbnkgfTtcbiovXG5cbnZhciBtYXBPYmogPSBmdW5jdGlvbiBtYXBPYmoob2JqLCAvKiA6IE9iamVjdE1hcCAqL1xuZm4gLyogOiBQYWlyc01hcHBlciAqL1xuKSAvKiA6IE9iamVjdE1hcCAqL3tcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgdmFyIG1hcHBlZE9iaiA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB2YXIgX2ZuID0gZm4oW2tleXNbaV0sIG9ialtrZXlzW2ldXV0pO1xuXG4gICAgICAgIHZhciBfZm4yID0gX3NsaWNlZFRvQXJyYXkoX2ZuLCAyKTtcblxuICAgICAgICB2YXIgbmV3S2V5ID0gX2ZuMlswXTtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gX2ZuMlsxXTtcblxuICAgICAgICBtYXBwZWRPYmpbbmV3S2V5XSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkT2JqO1xufTtcblxuZXhwb3J0cy5tYXBPYmogPSBtYXBPYmo7XG52YXIgVVBQRVJDQVNFX1JFID0gLyhbQS1aXSkvZztcbnZhciBVUFBFUkNBU0VfUkVfVE9fS0VCQUIgPSBmdW5jdGlvbiBVUFBFUkNBU0VfUkVfVE9fS0VCQUIobWF0Y2ggLyogOiBzdHJpbmcgKi8pIHtcbiAgICByZXR1cm4gKC8qIDogc3RyaW5nICovJy0nICsgbWF0Y2gudG9Mb3dlckNhc2UoKVxuICAgICk7XG59O1xuXG52YXIga2ViYWJpZnlTdHlsZU5hbWUgPSBmdW5jdGlvbiBrZWJhYmlmeVN0eWxlTmFtZShzdHJpbmcgLyogOiBzdHJpbmcgKi8pIC8qIDogc3RyaW5nICove1xuICAgIHZhciByZXN1bHQgPSBzdHJpbmcucmVwbGFjZShVUFBFUkNBU0VfUkUsIFVQUEVSQ0FTRV9SRV9UT19LRUJBQik7XG4gICAgaWYgKHJlc3VsdFswXSA9PT0gJ20nICYmIHJlc3VsdFsxXSA9PT0gJ3MnICYmIHJlc3VsdFsyXSA9PT0gJy0nKSB7XG4gICAgICAgIHJldHVybiAnLScgKyByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnRzLmtlYmFiaWZ5U3R5bGVOYW1lID0ga2ViYWJpZnlTdHlsZU5hbWU7XG4vKipcbiAqIENTUyBwcm9wZXJ0aWVzIHdoaWNoIGFjY2VwdCBudW1iZXJzIGJ1dCBhcmUgbm90IGluIHVuaXRzIG9mIFwicHhcIi5cbiAqIFRha2VuIGZyb20gUmVhY3QncyBDU1NQcm9wZXJ0eS5qc1xuICovXG52YXIgaXNVbml0bGVzc051bWJlciA9IHtcbiAgICBhbmltYXRpb25JdGVyYXRpb25Db3VudDogdHJ1ZSxcbiAgICBib3JkZXJJbWFnZU91dHNldDogdHJ1ZSxcbiAgICBib3JkZXJJbWFnZVNsaWNlOiB0cnVlLFxuICAgIGJvcmRlckltYWdlV2lkdGg6IHRydWUsXG4gICAgYm94RmxleDogdHJ1ZSxcbiAgICBib3hGbGV4R3JvdXA6IHRydWUsXG4gICAgYm94T3JkaW5hbEdyb3VwOiB0cnVlLFxuICAgIGNvbHVtbkNvdW50OiB0cnVlLFxuICAgIGZsZXg6IHRydWUsXG4gICAgZmxleEdyb3c6IHRydWUsXG4gICAgZmxleFBvc2l0aXZlOiB0cnVlLFxuICAgIGZsZXhTaHJpbms6IHRydWUsXG4gICAgZmxleE5lZ2F0aXZlOiB0cnVlLFxuICAgIGZsZXhPcmRlcjogdHJ1ZSxcbiAgICBncmlkUm93OiB0cnVlLFxuICAgIGdyaWRDb2x1bW46IHRydWUsXG4gICAgZm9udFdlaWdodDogdHJ1ZSxcbiAgICBsaW5lQ2xhbXA6IHRydWUsXG4gICAgbGluZUhlaWdodDogdHJ1ZSxcbiAgICBvcGFjaXR5OiB0cnVlLFxuICAgIG9yZGVyOiB0cnVlLFxuICAgIG9ycGhhbnM6IHRydWUsXG4gICAgdGFiU2l6ZTogdHJ1ZSxcbiAgICB3aWRvd3M6IHRydWUsXG4gICAgekluZGV4OiB0cnVlLFxuICAgIHpvb206IHRydWUsXG5cbiAgICAvLyBTVkctcmVsYXRlZCBwcm9wZXJ0aWVzXG4gICAgZmlsbE9wYWNpdHk6IHRydWUsXG4gICAgZmxvb2RPcGFjaXR5OiB0cnVlLFxuICAgIHN0b3BPcGFjaXR5OiB0cnVlLFxuICAgIHN0cm9rZURhc2hhcnJheTogdHJ1ZSxcbiAgICBzdHJva2VEYXNob2Zmc2V0OiB0cnVlLFxuICAgIHN0cm9rZU1pdGVybGltaXQ6IHRydWUsXG4gICAgc3Ryb2tlT3BhY2l0eTogdHJ1ZSxcbiAgICBzdHJva2VXaWR0aDogdHJ1ZVxufTtcblxuLyoqXG4gKiBUYWtlbiBmcm9tIFJlYWN0J3MgQ1NTUHJvcGVydHkuanNcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJlZml4IHZlbmRvci1zcGVjaWZpYyBwcmVmaXgsIGVnOiBXZWJraXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgc3R5bGUgbmFtZSwgZWc6IHRyYW5zaXRpb25EdXJhdGlvblxuICogQHJldHVybiB7c3RyaW5nfSBzdHlsZSBuYW1lIHByZWZpeGVkIHdpdGggYHByZWZpeGAsIHByb3Blcmx5IGNhbWVsQ2FzZWQsIGVnOlxuICogV2Via2l0VHJhbnNpdGlvbkR1cmF0aW9uXG4gKi9cbmZ1bmN0aW9uIHByZWZpeEtleShwcmVmaXgsIGtleSkge1xuICAgIHJldHVybiBwcmVmaXggKyBrZXkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBrZXkuc3Vic3RyaW5nKDEpO1xufVxuXG4vKipcbiAqIFN1cHBvcnQgc3R5bGUgbmFtZXMgdGhhdCBtYXkgY29tZSBwYXNzZWQgaW4gcHJlZml4ZWQgYnkgYWRkaW5nIHBlcm11dGF0aW9uc1xuICogb2YgdmVuZG9yIHByZWZpeGVzLlxuICogVGFrZW4gZnJvbSBSZWFjdCdzIENTU1Byb3BlcnR5LmpzXG4gKi9cbnZhciBwcmVmaXhlcyA9IFsnV2Via2l0JywgJ21zJywgJ01veicsICdPJ107XG5cbi8vIFVzaW5nIE9iamVjdC5rZXlzIGhlcmUsIG9yIGVsc2UgdGhlIHZhbmlsbGEgZm9yLWluIGxvb3AgbWFrZXMgSUU4IGdvIGludG8gYW5cbi8vIGluZmluaXRlIGxvb3AsIGJlY2F1c2UgaXQgaXRlcmF0ZXMgb3ZlciB0aGUgbmV3bHkgYWRkZWQgcHJvcHMgdG9vLlxuLy8gVGFrZW4gZnJvbSBSZWFjdCdzIENTU1Byb3BlcnR5LmpzXG5PYmplY3Qua2V5cyhpc1VuaXRsZXNzTnVtYmVyKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wKSB7XG4gICAgcHJlZml4ZXMuZm9yRWFjaChmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICAgIGlzVW5pdGxlc3NOdW1iZXJbcHJlZml4S2V5KHByZWZpeCwgcHJvcCldID0gaXNVbml0bGVzc051bWJlcltwcm9wXTtcbiAgICB9KTtcbn0pO1xuXG52YXIgc3RyaW5naWZ5VmFsdWUgPSBmdW5jdGlvbiBzdHJpbmdpZnlWYWx1ZShrZXksIC8qIDogc3RyaW5nICovXG5wcm9wIC8qIDogYW55ICovXG4pIC8qIDogc3RyaW5nICove1xuICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBpZiAoaXNVbml0bGVzc051bWJlcltrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIiArIHByb3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcCArIFwicHhcIjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnJyArIHByb3A7XG4gICAgfVxufTtcblxuZXhwb3J0cy5zdHJpbmdpZnlWYWx1ZSA9IHN0cmluZ2lmeVZhbHVlO1xudmFyIHN0cmluZ2lmeUFuZEltcG9ydGFudGlmeVZhbHVlID0gZnVuY3Rpb24gc3RyaW5naWZ5QW5kSW1wb3J0YW50aWZ5VmFsdWUoa2V5LCAvKiA6IHN0cmluZyAqL1xucHJvcCAvKiA6IGFueSAqL1xuKSB7XG4gICAgcmV0dXJuICgvKiA6IHN0cmluZyAqL2ltcG9ydGFudGlmeShzdHJpbmdpZnlWYWx1ZShrZXksIHByb3ApKVxuICAgICk7XG59O1xuXG5leHBvcnRzLnN0cmluZ2lmeUFuZEltcG9ydGFudGlmeVZhbHVlID0gc3RyaW5naWZ5QW5kSW1wb3J0YW50aWZ5VmFsdWU7XG4vLyBIYXNoIGEgamF2YXNjcmlwdCBvYmplY3QgdXNpbmcgSlNPTi5zdHJpbmdpZnkuIFRoaXMgaXMgdmVyeSBmYXN0LCBhYm91dCAzXG4vLyBtaWNyb3NlY29uZHMgb24gbXkgY29tcHV0ZXIgZm9yIGEgc2FtcGxlIG9iamVjdDpcbi8vIGh0dHA6Ly9qc3BlcmYuY29tL3Rlc3QtaGFzaGZudjMyYS1oYXNoLzVcbi8vXG4vLyBOb3RlIHRoYXQgdGhpcyB1c2VzIEpTT04uc3RyaW5naWZ5IHRvIHN0cmluZ2lmeSB0aGUgb2JqZWN0cyBzbyBpbiBvcmRlciBmb3Jcbi8vIHRoaXMgdG8gcHJvZHVjZSBjb25zaXN0ZW50IGhhc2hlcyBicm93c2VycyBuZWVkIHRvIGhhdmUgYSBjb25zaXN0ZW50XG4vLyBvcmRlcmluZyBvZiBvYmplY3RzLiBCZW4gQWxwZXJ0IHNheXMgdGhhdCBGYWNlYm9vayBkZXBlbmRzIG9uIHRoaXMsIHNvIHdlXG4vLyBjYW4gcHJvYmFibHkgZGVwZW5kIG9uIHRoaXMgdG9vLlxudmFyIGhhc2hPYmplY3QgPSBmdW5jdGlvbiBoYXNoT2JqZWN0KG9iamVjdCAvKiA6IE9iamVjdE1hcCAqLykge1xuICAgIHJldHVybiAoLyogOiBzdHJpbmcgKi8oMCwgX3N0cmluZ0hhc2gyWydkZWZhdWx0J10pKEpTT04uc3RyaW5naWZ5KG9iamVjdCkpLnRvU3RyaW5nKDM2KVxuICAgICk7XG59O1xuXG5leHBvcnRzLmhhc2hPYmplY3QgPSBoYXNoT2JqZWN0O1xuLy8gR2l2ZW4gYSBzaW5nbGUgc3R5bGUgdmFsdWUgc3RyaW5nIGxpa2UgdGhlIFwiYlwiIGZyb20gXCJhOiBiO1wiLCBhZGRzICFpbXBvcnRhbnRcbi8vIHRvIGdlbmVyYXRlIFwiYiAhaW1wb3J0YW50XCIuXG52YXIgaW1wb3J0YW50aWZ5ID0gZnVuY3Rpb24gaW1wb3J0YW50aWZ5KHN0cmluZyAvKiA6IHN0cmluZyAqLykge1xuICAgIHJldHVybiAoLyogOiBzdHJpbmcgKi9cbiAgICAgICAgLy8gQnJhY2tldCBzdHJpbmcgY2hhcmFjdGVyIGFjY2VzcyBpcyB2ZXJ5IGZhc3QsIGFuZCBpbiB0aGUgZGVmYXVsdCBjYXNlIHdlXG4gICAgICAgIC8vIG5vcm1hbGx5IGRvbid0IGV4cGVjdCB0aGVyZSB0byBiZSBcIiFpbXBvcnRhbnRcIiBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmdcbiAgICAgICAgLy8gc28gd2UgY2FuIHVzZSB0aGlzIHNpbXBsZSBjaGVjayB0byB0YWtlIGFuIG9wdGltaXplZCBwYXRoLiBJZiB0aGVyZVxuICAgICAgICAvLyBoYXBwZW5zIHRvIGJlIGEgXCIhXCIgaW4gdGhpcyBwb3NpdGlvbiwgd2UgZm9sbG93IHVwIHdpdGggYSBtb3JlIHRob3JvdWdoXG4gICAgICAgIC8vIGNoZWNrLlxuICAgICAgICBzdHJpbmdbc3RyaW5nLmxlbmd0aCAtIDEwXSA9PT0gJyEnICYmIHN0cmluZy5zbGljZSgtMTEpID09PSAnICFpbXBvcnRhbnQnID8gc3RyaW5nIDogc3RyaW5nICsgJyAhaW1wb3J0YW50J1xuICAgICk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvbm8taW1wb3J0YW50LmpzJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gcmF3QXNhcCBwcm92aWRlcyBldmVyeXRoaW5nIHdlIG5lZWQgZXhjZXB0IGV4Y2VwdGlvbiBtYW5hZ2VtZW50LlxudmFyIHJhd0FzYXAgPSByZXF1aXJlKFwiLi9yYXdcIik7XG4vLyBSYXdUYXNrcyBhcmUgcmVjeWNsZWQgdG8gcmVkdWNlIEdDIGNodXJuLlxudmFyIGZyZWVUYXNrcyA9IFtdO1xuLy8gV2UgcXVldWUgZXJyb3JzIHRvIGVuc3VyZSB0aGV5IGFyZSB0aHJvd24gaW4gcmlnaHQgb3JkZXIgKEZJRk8pLlxuLy8gQXJyYXktYXMtcXVldWUgaXMgZ29vZCBlbm91Z2ggaGVyZSwgc2luY2Ugd2UgYXJlIGp1c3QgZGVhbGluZyB3aXRoIGV4Y2VwdGlvbnMuXG52YXIgcGVuZGluZ0Vycm9ycyA9IFtdO1xudmFyIHJlcXVlc3RFcnJvclRocm93ID0gcmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIodGhyb3dGaXJzdEVycm9yKTtcblxuZnVuY3Rpb24gdGhyb3dGaXJzdEVycm9yKCkge1xuICAgIGlmIChwZW5kaW5nRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBwZW5kaW5nRXJyb3JzLnNoaWZ0KCk7XG4gICAgfVxufVxuXG4vKipcbiAqIENhbGxzIGEgdGFzayBhcyBzb29uIGFzIHBvc3NpYmxlIGFmdGVyIHJldHVybmluZywgaW4gaXRzIG93biBldmVudCwgd2l0aCBwcmlvcml0eVxuICogb3ZlciBvdGhlciBldmVudHMgbGlrZSBhbmltYXRpb24sIHJlZmxvdywgYW5kIHJlcGFpbnQuIEFuIGVycm9yIHRocm93biBmcm9tIGFuXG4gKiBldmVudCB3aWxsIG5vdCBpbnRlcnJ1cHQsIG5vciBldmVuIHN1YnN0YW50aWFsbHkgc2xvdyBkb3duIHRoZSBwcm9jZXNzaW5nIG9mXG4gKiBvdGhlciBldmVudHMsIGJ1dCB3aWxsIGJlIHJhdGhlciBwb3N0cG9uZWQgdG8gYSBsb3dlciBwcmlvcml0eSBldmVudC5cbiAqIEBwYXJhbSB7e2NhbGx9fSB0YXNrIEEgY2FsbGFibGUgb2JqZWN0LCB0eXBpY2FsbHkgYSBmdW5jdGlvbiB0aGF0IHRha2VzIG5vXG4gKiBhcmd1bWVudHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gYXNhcDtcbmZ1bmN0aW9uIGFzYXAodGFzaykge1xuICAgIHZhciByYXdUYXNrO1xuICAgIGlmIChmcmVlVGFza3MubGVuZ3RoKSB7XG4gICAgICAgIHJhd1Rhc2sgPSBmcmVlVGFza3MucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmF3VGFzayA9IG5ldyBSYXdUYXNrKCk7XG4gICAgfVxuICAgIHJhd1Rhc2sudGFzayA9IHRhc2s7XG4gICAgcmF3QXNhcChyYXdUYXNrKTtcbn1cblxuLy8gV2Ugd3JhcCB0YXNrcyB3aXRoIHJlY3ljbGFibGUgdGFzayBvYmplY3RzLiAgQSB0YXNrIG9iamVjdCBpbXBsZW1lbnRzXG4vLyBgY2FsbGAsIGp1c3QgbGlrZSBhIGZ1bmN0aW9uLlxuZnVuY3Rpb24gUmF3VGFzaygpIHtcbiAgICB0aGlzLnRhc2sgPSBudWxsO1xufVxuXG4vLyBUaGUgc29sZSBwdXJwb3NlIG9mIHdyYXBwaW5nIHRoZSB0YXNrIGlzIHRvIGNhdGNoIHRoZSBleGNlcHRpb24gYW5kIHJlY3ljbGVcbi8vIHRoZSB0YXNrIG9iamVjdCBhZnRlciBpdHMgc2luZ2xlIHVzZS5cblJhd1Rhc2sucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgdGhpcy50YXNrLmNhbGwoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoYXNhcC5vbmVycm9yKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGhvb2sgZXhpc3RzIHB1cmVseSBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cbiAgICAgICAgICAgIC8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdFxuICAgICAgICAgICAgLy8gZGVwZW5kcyBvbiBpdHMgZXhpc3RlbmNlLlxuICAgICAgICAgICAgYXNhcC5vbmVycm9yKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEluIGEgd2ViIGJyb3dzZXIsIGV4Y2VwdGlvbnMgYXJlIG5vdCBmYXRhbC4gSG93ZXZlciwgdG8gYXZvaWRcbiAgICAgICAgICAgIC8vIHNsb3dpbmcgZG93biB0aGUgcXVldWUgb2YgcGVuZGluZyB0YXNrcywgd2UgcmV0aHJvdyB0aGUgZXJyb3IgaW4gYVxuICAgICAgICAgICAgLy8gbG93ZXIgcHJpb3JpdHkgdHVybi5cbiAgICAgICAgICAgIHBlbmRpbmdFcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgICByZXF1ZXN0RXJyb3JUaHJvdygpO1xuICAgICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy50YXNrID0gbnVsbDtcbiAgICAgICAgZnJlZVRhc2tzW2ZyZWVUYXNrcy5sZW5ndGhdID0gdGhpcztcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFVzZSB0aGUgZmFzdGVzdCBtZWFucyBwb3NzaWJsZSB0byBleGVjdXRlIGEgdGFzayBpbiBpdHMgb3duIHR1cm4sIHdpdGhcbi8vIHByaW9yaXR5IG92ZXIgb3RoZXIgZXZlbnRzIGluY2x1ZGluZyBJTywgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZWRyYXdcbi8vIGV2ZW50cyBpbiBicm93c2Vycy5cbi8vXG4vLyBBbiBleGNlcHRpb24gdGhyb3duIGJ5IGEgdGFzayB3aWxsIHBlcm1hbmVudGx5IGludGVycnVwdCB0aGUgcHJvY2Vzc2luZyBvZlxuLy8gc3Vic2VxdWVudCB0YXNrcy4gVGhlIGhpZ2hlciBsZXZlbCBgYXNhcGAgZnVuY3Rpb24gZW5zdXJlcyB0aGF0IGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duIGJ5IGEgdGFzaywgdGhhdCB0aGUgdGFzayBxdWV1ZSB3aWxsIGNvbnRpbnVlIGZsdXNoaW5nIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLCBidXQgaWYgeW91IHVzZSBgcmF3QXNhcGAgZGlyZWN0bHksIHlvdSBhcmUgcmVzcG9uc2libGUgdG9cbi8vIGVpdGhlciBlbnN1cmUgdGhhdCBubyBleGNlcHRpb25zIGFyZSB0aHJvd24gZnJvbSB5b3VyIHRhc2ssIG9yIHRvIG1hbnVhbGx5XG4vLyBjYWxsIGByYXdBc2FwLnJlcXVlc3RGbHVzaGAgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cbm1vZHVsZS5leHBvcnRzID0gcmF3QXNhcDtcbmZ1bmN0aW9uIHJhd0FzYXAodGFzaykge1xuICAgIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHJlcXVlc3RGbHVzaCgpO1xuICAgICAgICBmbHVzaGluZyA9IHRydWU7XG4gICAgfVxuICAgIC8vIEVxdWl2YWxlbnQgdG8gcHVzaCwgYnV0IGF2b2lkcyBhIGZ1bmN0aW9uIGNhbGwuXG4gICAgcXVldWVbcXVldWUubGVuZ3RoXSA9IHRhc2s7XG59XG5cbnZhciBxdWV1ZSA9IFtdO1xuLy8gT25jZSBhIGZsdXNoIGhhcyBiZWVuIHJlcXVlc3RlZCwgbm8gZnVydGhlciBjYWxscyB0byBgcmVxdWVzdEZsdXNoYCBhcmVcbi8vIG5lY2Vzc2FyeSB1bnRpbCB0aGUgbmV4dCBgZmx1c2hgIGNvbXBsZXRlcy5cbnZhciBmbHVzaGluZyA9IGZhbHNlO1xuLy8gYHJlcXVlc3RGbHVzaGAgaXMgYW4gaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgbWV0aG9kIHRoYXQgYXR0ZW1wdHMgdG8ga2lja1xuLy8gb2ZmIGEgYGZsdXNoYCBldmVudCBhcyBxdWlja2x5IGFzIHBvc3NpYmxlLiBgZmx1c2hgIHdpbGwgYXR0ZW1wdCB0byBleGhhdXN0XG4vLyB0aGUgZXZlbnQgcXVldWUgYmVmb3JlIHlpZWxkaW5nIHRvIHRoZSBicm93c2VyJ3Mgb3duIGV2ZW50IGxvb3AuXG52YXIgcmVxdWVzdEZsdXNoO1xuLy8gVGhlIHBvc2l0aW9uIG9mIHRoZSBuZXh0IHRhc2sgdG8gZXhlY3V0ZSBpbiB0aGUgdGFzayBxdWV1ZS4gVGhpcyBpc1xuLy8gcHJlc2VydmVkIGJldHdlZW4gY2FsbHMgdG8gYGZsdXNoYCBzbyB0aGF0IGl0IGNhbiBiZSByZXN1bWVkIGlmXG4vLyBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbnZhciBpbmRleCA9IDA7XG4vLyBJZiBhIHRhc2sgc2NoZWR1bGVzIGFkZGl0aW9uYWwgdGFza3MgcmVjdXJzaXZlbHksIHRoZSB0YXNrIHF1ZXVlIGNhbiBncm93XG4vLyB1bmJvdW5kZWQuIFRvIHByZXZlbnQgbWVtb3J5IGV4aGF1c3Rpb24sIHRoZSB0YXNrIHF1ZXVlIHdpbGwgcGVyaW9kaWNhbGx5XG4vLyB0cnVuY2F0ZSBhbHJlYWR5LWNvbXBsZXRlZCB0YXNrcy5cbnZhciBjYXBhY2l0eSA9IDEwMjQ7XG5cbi8vIFRoZSBmbHVzaCBmdW5jdGlvbiBwcm9jZXNzZXMgYWxsIHRhc2tzIHRoYXQgaGF2ZSBiZWVuIHNjaGVkdWxlZCB3aXRoXG4vLyBgcmF3QXNhcGAgdW5sZXNzIGFuZCB1bnRpbCBvbmUgb2YgdGhvc2UgdGFza3MgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbi8vIElmIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLCBgZmx1c2hgIGVuc3VyZXMgdGhhdCBpdHMgc3RhdGUgd2lsbCByZW1haW5cbi8vIGNvbnNpc3RlbnQgYW5kIHdpbGwgcmVzdW1lIHdoZXJlIGl0IGxlZnQgb2ZmIHdoZW4gY2FsbGVkIGFnYWluLlxuLy8gSG93ZXZlciwgYGZsdXNoYCBkb2VzIG5vdCBtYWtlIGFueSBhcnJhbmdlbWVudHMgdG8gYmUgY2FsbGVkIGFnYWluIGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duLlxuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgd2hpbGUgKGluZGV4IDwgcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgLy8gQWR2YW5jZSB0aGUgaW5kZXggYmVmb3JlIGNhbGxpbmcgdGhlIHRhc2suIFRoaXMgZW5zdXJlcyB0aGF0IHdlIHdpbGxcbiAgICAgICAgLy8gYmVnaW4gZmx1c2hpbmcgb24gdGhlIG5leHQgdGFzayB0aGUgdGFzayB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICAgIGluZGV4ID0gaW5kZXggKyAxO1xuICAgICAgICBxdWV1ZVtjdXJyZW50SW5kZXhdLmNhbGwoKTtcbiAgICAgICAgLy8gUHJldmVudCBsZWFraW5nIG1lbW9yeSBmb3IgbG9uZyBjaGFpbnMgb2YgcmVjdXJzaXZlIGNhbGxzIHRvIGBhc2FwYC5cbiAgICAgICAgLy8gSWYgd2UgY2FsbCBgYXNhcGAgd2l0aGluIHRhc2tzIHNjaGVkdWxlZCBieSBgYXNhcGAsIHRoZSBxdWV1ZSB3aWxsXG4gICAgICAgIC8vIGdyb3csIGJ1dCB0byBhdm9pZCBhbiBPKG4pIHdhbGsgZm9yIGV2ZXJ5IHRhc2sgd2UgZXhlY3V0ZSwgd2UgZG9uJ3RcbiAgICAgICAgLy8gc2hpZnQgdGFza3Mgb2ZmIHRoZSBxdWV1ZSBhZnRlciB0aGV5IGhhdmUgYmVlbiBleGVjdXRlZC5cbiAgICAgICAgLy8gSW5zdGVhZCwgd2UgcGVyaW9kaWNhbGx5IHNoaWZ0IDEwMjQgdGFza3Mgb2ZmIHRoZSBxdWV1ZS5cbiAgICAgICAgaWYgKGluZGV4ID4gY2FwYWNpdHkpIHtcbiAgICAgICAgICAgIC8vIE1hbnVhbGx5IHNoaWZ0IGFsbCB2YWx1ZXMgc3RhcnRpbmcgYXQgdGhlIGluZGV4IGJhY2sgdG8gdGhlXG4gICAgICAgICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlLlxuICAgICAgICAgICAgZm9yICh2YXIgc2NhbiA9IDAsIG5ld0xlbmd0aCA9IHF1ZXVlLmxlbmd0aCAtIGluZGV4OyBzY2FuIDwgbmV3TGVuZ3RoOyBzY2FuKyspIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVtzY2FuXSA9IHF1ZXVlW3NjYW4gKyBpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5sZW5ndGggLT0gaW5kZXg7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICBpbmRleCA9IDA7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgaXMgaW1wbGVtZW50ZWQgdXNpbmcgYSBzdHJhdGVneSBiYXNlZCBvbiBkYXRhIGNvbGxlY3RlZCBmcm9tXG4vLyBldmVyeSBhdmFpbGFibGUgU2F1Y2VMYWJzIFNlbGVuaXVtIHdlYiBkcml2ZXIgd29ya2VyIGF0IHRpbWUgb2Ygd3JpdGluZy5cbi8vIGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzFtRy01VVlHdXA1cXhHZEVNV2toUDZCV0N6MDUzTlViMkUxUW9VVFUxNnVBL2VkaXQjZ2lkPTc4MzcyNDU5M1xuXG4vLyBTYWZhcmkgNiBhbmQgNi4xIGZvciBkZXNrdG9wLCBpUGFkLCBhbmQgaVBob25lIGFyZSB0aGUgb25seSBicm93c2VycyB0aGF0XG4vLyBoYXZlIFdlYktpdE11dGF0aW9uT2JzZXJ2ZXIgYnV0IG5vdCB1bi1wcmVmaXhlZCBNdXRhdGlvbk9ic2VydmVyLlxuLy8gTXVzdCB1c2UgYGdsb2JhbGAgb3IgYHNlbGZgIGluc3RlYWQgb2YgYHdpbmRvd2AgdG8gd29yayBpbiBib3RoIGZyYW1lcyBhbmQgd2ViXG4vLyB3b3JrZXJzLiBgZ2xvYmFsYCBpcyBhIHByb3Zpc2lvbiBvZiBCcm93c2VyaWZ5LCBNciwgTXJzLCBvciBNb3AuXG5cbi8qIGdsb2JhbHMgc2VsZiAqL1xudmFyIHNjb3BlID0gdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHNlbGY7XG52YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBzY29wZS5NdXRhdGlvbk9ic2VydmVyIHx8IHNjb3BlLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cbi8vIE11dGF0aW9uT2JzZXJ2ZXJzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGhhdmUgaGlnaCBwcmlvcml0eSBhbmQgd29ya1xuLy8gcmVsaWFibHkgZXZlcnl3aGVyZSB0aGV5IGFyZSBpbXBsZW1lbnRlZC5cbi8vIFRoZXkgYXJlIGltcGxlbWVudGVkIGluIGFsbCBtb2Rlcm4gYnJvd3NlcnMuXG4vL1xuLy8gLSBBbmRyb2lkIDQtNC4zXG4vLyAtIENocm9tZSAyNi0zNFxuLy8gLSBGaXJlZm94IDE0LTI5XG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDExXG4vLyAtIGlQYWQgU2FmYXJpIDYtNy4xXG4vLyAtIGlQaG9uZSBTYWZhcmkgNy03LjFcbi8vIC0gU2FmYXJpIDYtN1xuaWYgKHR5cGVvZiBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmVxdWVzdEZsdXNoID0gbWFrZVJlcXVlc3RDYWxsRnJvbU11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuXG4vLyBNZXNzYWdlQ2hhbm5lbHMgYXJlIGRlc2lyYWJsZSBiZWNhdXNlIHRoZXkgZ2l2ZSBkaXJlY3QgYWNjZXNzIHRvIHRoZSBIVE1MXG4vLyB0YXNrIHF1ZXVlLCBhcmUgaW1wbGVtZW50ZWQgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAsIFNhZmFyaSA1LjAtMSwgYW5kIE9wZXJhXG4vLyAxMS0xMiwgYW5kIGluIHdlYiB3b3JrZXJzIGluIG1hbnkgZW5naW5lcy5cbi8vIEFsdGhvdWdoIG1lc3NhZ2UgY2hhbm5lbHMgeWllbGQgdG8gYW55IHF1ZXVlZCByZW5kZXJpbmcgYW5kIElPIHRhc2tzLCB0aGV5XG4vLyB3b3VsZCBiZSBiZXR0ZXIgdGhhbiBpbXBvc2luZyB0aGUgNG1zIGRlbGF5IG9mIHRpbWVycy5cbi8vIEhvd2V2ZXIsIHRoZXkgZG8gbm90IHdvcmsgcmVsaWFibHkgaW4gSW50ZXJuZXQgRXhwbG9yZXIgb3IgU2FmYXJpLlxuXG4vLyBJbnRlcm5ldCBFeHBsb3JlciAxMCBpcyB0aGUgb25seSBicm93c2VyIHRoYXQgaGFzIHNldEltbWVkaWF0ZSBidXQgZG9lc1xuLy8gbm90IGhhdmUgTXV0YXRpb25PYnNlcnZlcnMuXG4vLyBBbHRob3VnaCBzZXRJbW1lZGlhdGUgeWllbGRzIHRvIHRoZSBicm93c2VyJ3MgcmVuZGVyZXIsIGl0IHdvdWxkIGJlXG4vLyBwcmVmZXJyYWJsZSB0byBmYWxsaW5nIGJhY2sgdG8gc2V0VGltZW91dCBzaW5jZSBpdCBkb2VzIG5vdCBoYXZlXG4vLyB0aGUgbWluaW11bSA0bXMgcGVuYWx0eS5cbi8vIFVuZm9ydHVuYXRlbHkgdGhlcmUgYXBwZWFycyB0byBiZSBhIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMCBNb2JpbGUgKGFuZFxuLy8gRGVza3RvcCB0byBhIGxlc3NlciBleHRlbnQpIHRoYXQgcmVuZGVycyBib3RoIHNldEltbWVkaWF0ZSBhbmRcbi8vIE1lc3NhZ2VDaGFubmVsIHVzZWxlc3MgZm9yIHRoZSBwdXJwb3NlcyBvZiBBU0FQLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL2lzc3Vlcy8zOTZcblxuLy8gVGltZXJzIGFyZSBpbXBsZW1lbnRlZCB1bml2ZXJzYWxseS5cbi8vIFdlIGZhbGwgYmFjayB0byB0aW1lcnMgaW4gd29ya2VycyBpbiBtb3N0IGVuZ2luZXMsIGFuZCBpbiBmb3JlZ3JvdW5kXG4vLyBjb250ZXh0cyBpbiB0aGUgZm9sbG93aW5nIGJyb3dzZXJzLlxuLy8gSG93ZXZlciwgbm90ZSB0aGF0IGV2ZW4gdGhpcyBzaW1wbGUgY2FzZSByZXF1aXJlcyBudWFuY2VzIHRvIG9wZXJhdGUgaW4gYVxuLy8gYnJvYWQgc3BlY3RydW0gb2YgYnJvd3NlcnMuXG4vL1xuLy8gLSBGaXJlZm94IDMtMTNcbi8vIC0gSW50ZXJuZXQgRXhwbG9yZXIgNi05XG4vLyAtIGlQYWQgU2FmYXJpIDQuM1xuLy8gLSBMeW54IDIuOC43XG59IGVsc2Uge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcihmbHVzaCk7XG59XG5cbi8vIGByZXF1ZXN0Rmx1c2hgIHJlcXVlc3RzIHRoYXQgdGhlIGhpZ2ggcHJpb3JpdHkgZXZlbnQgcXVldWUgYmUgZmx1c2hlZCBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZS5cbi8vIFRoaXMgaXMgdXNlZnVsIHRvIHByZXZlbnQgYW4gZXJyb3IgdGhyb3duIGluIGEgdGFzayBmcm9tIHN0YWxsaW5nIHRoZSBldmVudFxuLy8gcXVldWUgaWYgdGhlIGV4Y2VwdGlvbiBoYW5kbGVkIGJ5IE5vZGUuanPigJlzXG4vLyBgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIpYCBvciBieSBhIGRvbWFpbi5cbnJhd0FzYXAucmVxdWVzdEZsdXNoID0gcmVxdWVzdEZsdXNoO1xuXG4vLyBUbyByZXF1ZXN0IGEgaGlnaCBwcmlvcml0eSBldmVudCwgd2UgaW5kdWNlIGEgbXV0YXRpb24gb2JzZXJ2ZXIgYnkgdG9nZ2xpbmdcbi8vIHRoZSB0ZXh0IG9mIGEgdGV4dCBub2RlIGJldHdlZW4gXCIxXCIgYW5kIFwiLTFcIi5cbmZ1bmN0aW9uIG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKSB7XG4gICAgdmFyIHRvZ2dsZSA9IDE7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIHRvZ2dsZSA9IC10b2dnbGU7XG4gICAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZTtcbiAgICB9O1xufVxuXG4vLyBUaGUgbWVzc2FnZSBjaGFubmVsIHRlY2huaXF1ZSB3YXMgZGlzY292ZXJlZCBieSBNYWx0ZSBVYmwgYW5kIHdhcyB0aGVcbi8vIG9yaWdpbmFsIGZvdW5kYXRpb24gZm9yIHRoaXMgbGlicmFyeS5cbi8vIGh0dHA6Ly93d3cubm9uYmxvY2tpbmcuaW8vMjAxMS8wNi93aW5kb3duZXh0dGljay5odG1sXG5cbi8vIFNhZmFyaSA2LjAuNSAoYXQgbGVhc3QpIGludGVybWl0dGVudGx5IGZhaWxzIHRvIGNyZWF0ZSBtZXNzYWdlIHBvcnRzIG9uIGFcbi8vIHBhZ2UncyBmaXJzdCBsb2FkLiBUaGFua2Z1bGx5LCB0aGlzIHZlcnNpb24gb2YgU2FmYXJpIHN1cHBvcnRzXG4vLyBNdXRhdGlvbk9ic2VydmVycywgc28gd2UgZG9uJ3QgbmVlZCB0byBmYWxsIGJhY2sgaW4gdGhhdCBjYXNlLlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTWVzc2FnZUNoYW5uZWwoY2FsbGJhY2spIHtcbi8vICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuLy8gICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gY2FsbGJhY2s7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIEZvciByZWFzb25zIGV4cGxhaW5lZCBhYm92ZSwgd2UgYXJlIGFsc28gdW5hYmxlIHRvIHVzZSBgc2V0SW1tZWRpYXRlYFxuLy8gdW5kZXIgYW55IGNpcmN1bXN0YW5jZXMuXG4vLyBFdmVuIGlmIHdlIHdlcmUsIHRoZXJlIGlzIGFub3RoZXIgYnVnIGluIEludGVybmV0IEV4cGxvcmVyIDEwLlxuLy8gSXQgaXMgbm90IHN1ZmZpY2llbnQgdG8gYXNzaWduIGBzZXRJbW1lZGlhdGVgIHRvIGByZXF1ZXN0Rmx1c2hgIGJlY2F1c2Vcbi8vIGBzZXRJbW1lZGlhdGVgIG11c3QgYmUgY2FsbGVkICpieSBuYW1lKiBhbmQgdGhlcmVmb3JlIG11c3QgYmUgd3JhcHBlZCBpbiBhXG4vLyBjbG9zdXJlLlxuLy8gTmV2ZXIgZm9yZ2V0LlxuXG4vLyBmdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tU2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuLy8gICAgICAgICBzZXRJbW1lZGlhdGUoY2FsbGJhY2spO1xuLy8gICAgIH07XG4vLyB9XG5cbi8vIFNhZmFyaSA2LjAgaGFzIGEgcHJvYmxlbSB3aGVyZSB0aW1lcnMgd2lsbCBnZXQgbG9zdCB3aGlsZSB0aGUgdXNlciBpc1xuLy8gc2Nyb2xsaW5nLiBUaGlzIHByb2JsZW0gZG9lcyBub3QgaW1wYWN0IEFTQVAgYmVjYXVzZSBTYWZhcmkgNi4wIHN1cHBvcnRzXG4vLyBtdXRhdGlvbiBvYnNlcnZlcnMsIHNvIHRoYXQgaW1wbGVtZW50YXRpb24gaXMgdXNlZCBpbnN0ZWFkLlxuLy8gSG93ZXZlciwgaWYgd2UgZXZlciBlbGVjdCB0byB1c2UgdGltZXJzIGluIFNhZmFyaSwgdGhlIHByZXZhbGVudCB3b3JrLWFyb3VuZFxuLy8gaXMgdG8gYWRkIGEgc2Nyb2xsIGV2ZW50IGxpc3RlbmVyIHRoYXQgY2FsbHMgZm9yIGEgZmx1c2guXG5cbi8vIGBzZXRUaW1lb3V0YCBkb2VzIG5vdCBjYWxsIHRoZSBwYXNzZWQgY2FsbGJhY2sgaWYgdGhlIGRlbGF5IGlzIGxlc3MgdGhhblxuLy8gYXBwcm94aW1hdGVseSA3IGluIHdlYiB3b3JrZXJzIGluIEZpcmVmb3ggOCB0aHJvdWdoIDE4LCBhbmQgc29tZXRpbWVzIG5vdFxuLy8gZXZlbiB0aGVuLlxuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWVzdENhbGwoKSB7XG4gICAgICAgIC8vIFdlIGRpc3BhdGNoIGEgdGltZW91dCB3aXRoIGEgc3BlY2lmaWVkIGRlbGF5IG9mIDAgZm9yIGVuZ2luZXMgdGhhdFxuICAgICAgICAvLyBjYW4gcmVsaWFibHkgYWNjb21tb2RhdGUgdGhhdCByZXF1ZXN0LiBUaGlzIHdpbGwgdXN1YWxseSBiZSBzbmFwcGVkXG4gICAgICAgIC8vIHRvIGEgNCBtaWxpc2Vjb25kIGRlbGF5LCBidXQgb25jZSB3ZSdyZSBmbHVzaGluZywgdGhlcmUncyBubyBkZWxheVxuICAgICAgICAvLyBiZXR3ZWVuIGV2ZW50cy5cbiAgICAgICAgdmFyIHRpbWVvdXRIYW5kbGUgPSBzZXRUaW1lb3V0KGhhbmRsZVRpbWVyLCAwKTtcbiAgICAgICAgLy8gSG93ZXZlciwgc2luY2UgdGhpcyB0aW1lciBnZXRzIGZyZXF1ZW50bHkgZHJvcHBlZCBpbiBGaXJlZm94XG4gICAgICAgIC8vIHdvcmtlcnMsIHdlIGVubGlzdCBhbiBpbnRlcnZhbCBoYW5kbGUgdGhhdCB3aWxsIHRyeSB0byBmaXJlXG4gICAgICAgIC8vIGFuIGV2ZW50IDIwIHRpbWVzIHBlciBzZWNvbmQgdW50aWwgaXQgc3VjY2VlZHMuXG4gICAgICAgIHZhciBpbnRlcnZhbEhhbmRsZSA9IHNldEludGVydmFsKGhhbmRsZVRpbWVyLCA1MCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlVGltZXIoKSB7XG4gICAgICAgICAgICAvLyBXaGljaGV2ZXIgdGltZXIgc3VjY2VlZHMgd2lsbCBjYW5jZWwgYm90aCB0aW1lcnMgYW5kXG4gICAgICAgICAgICAvLyBleGVjdXRlIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SGFuZGxlKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxIYW5kbGUpO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbi8vIFRoaXMgaXMgZm9yIGBhc2FwLmpzYCBvbmx5LlxuLy8gSXRzIG5hbWUgd2lsbCBiZSBwZXJpb2RpY2FsbHkgcmFuZG9taXplZCB0byBicmVhayBhbnkgY29kZSB0aGF0IGRlcGVuZHMgb25cbi8vIGl0cyBleGlzdGVuY2UuXG5yYXdBc2FwLm1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lciA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21UaW1lcjtcblxuLy8gQVNBUCB3YXMgb3JpZ2luYWxseSBhIG5leHRUaWNrIHNoaW0gaW5jbHVkZWQgaW4gUS4gVGhpcyB3YXMgZmFjdG9yZWQgb3V0XG4vLyBpbnRvIHRoaXMgQVNBUCBwYWNrYWdlLiBJdCB3YXMgbGF0ZXIgYWRhcHRlZCB0byBSU1ZQIHdoaWNoIG1hZGUgZnVydGhlclxuLy8gYW1lbmRtZW50cy4gVGhlc2UgZGVjaXNpb25zLCBwYXJ0aWN1bGFybHkgdG8gbWFyZ2luYWxpemUgTWVzc2FnZUNoYW5uZWwgYW5kXG4vLyB0byBjYXB0dXJlIHRoZSBNdXRhdGlvbk9ic2VydmVyIGltcGxlbWVudGF0aW9uIGluIGEgY2xvc3VyZSwgd2VyZSBpbnRlZ3JhdGVkXG4vLyBiYWNrIGludG8gQVNBUCBwcm9wZXIuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGlsZGVpby9yc3ZwLmpzL2Jsb2IvY2RkZjcyMzI1NDZhOWNmODU4NTI0Yjc1Y2RlNmY5ZWRmNzI2MjBhNy9saWIvcnN2cC9hc2FwLmpzXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBoeXBoZW5hdGVQcm9wZXJ0eTtcblxudmFyIF9oeXBoZW5hdGVTdHlsZU5hbWUgPSByZXF1aXJlKCdoeXBoZW5hdGUtc3R5bGUtbmFtZScpO1xuXG52YXIgX2h5cGhlbmF0ZVN0eWxlTmFtZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9oeXBoZW5hdGVTdHlsZU5hbWUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBoeXBoZW5hdGVQcm9wZXJ0eShwcm9wZXJ0eSkge1xuICByZXR1cm4gKDAsIF9oeXBoZW5hdGVTdHlsZU5hbWUyLmRlZmF1bHQpKHByb3BlcnR5KTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGlzUHJlZml4ZWRWYWx1ZTtcblxudmFyIHJlZ2V4ID0gLy13ZWJraXQtfC1tb3otfC1tcy0vO1xuXG5mdW5jdGlvbiBpc1ByZWZpeGVkVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgcmVnZXgudGVzdCh2YWx1ZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1cHBlcmNhc2VQYXR0ZXJuID0gL1tBLVpdL2c7XG52YXIgbXNQYXR0ZXJuID0gL15tcy0vO1xudmFyIGNhY2hlID0ge307XG5cbmZ1bmN0aW9uIGh5cGhlbmF0ZVN0eWxlTmFtZShzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nIGluIGNhY2hlXG4gICAgPyBjYWNoZVtzdHJpbmddXG4gICAgOiBjYWNoZVtzdHJpbmddID0gc3RyaW5nXG4gICAgICAucmVwbGFjZSh1cHBlcmNhc2VQYXR0ZXJuLCAnLSQmJylcbiAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAucmVwbGFjZShtc1BhdHRlcm4sICctbXMtJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHlwaGVuYXRlU3R5bGVOYW1lO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gY3JlYXRlUHJlZml4ZXI7XG5cbnZhciBfcHJlZml4UHJvcGVydHkgPSByZXF1aXJlKCcuLi91dGlscy9wcmVmaXhQcm9wZXJ0eScpO1xuXG52YXIgX3ByZWZpeFByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ByZWZpeFByb3BlcnR5KTtcblxudmFyIF9wcmVmaXhWYWx1ZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3ByZWZpeFZhbHVlJyk7XG5cbnZhciBfcHJlZml4VmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJlZml4VmFsdWUpO1xuXG52YXIgX2FkZE5ld1ZhbHVlc09ubHkgPSByZXF1aXJlKCcuLi91dGlscy9hZGROZXdWYWx1ZXNPbmx5Jyk7XG5cbnZhciBfYWRkTmV3VmFsdWVzT25seTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hZGROZXdWYWx1ZXNPbmx5KTtcblxudmFyIF9pc09iamVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL2lzT2JqZWN0Jyk7XG5cbnZhciBfaXNPYmplY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNPYmplY3QpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBjcmVhdGVQcmVmaXhlcihfcmVmKSB7XG4gIHZhciBwcmVmaXhNYXAgPSBfcmVmLnByZWZpeE1hcCxcbiAgICAgIHBsdWdpbnMgPSBfcmVmLnBsdWdpbnM7XG5cbiAgZnVuY3Rpb24gcHJlZml4QWxsKHN0eWxlKSB7XG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gc3R5bGUpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHN0eWxlW3Byb3BlcnR5XTtcblxuICAgICAgLy8gaGFuZGxlIG5lc3RlZCBvYmplY3RzXG4gICAgICBpZiAoKDAsIF9pc09iamVjdDIuZGVmYXVsdCkodmFsdWUpKSB7XG4gICAgICAgIHN0eWxlW3Byb3BlcnR5XSA9IHByZWZpeEFsbCh2YWx1ZSk7XG4gICAgICAgIC8vIGhhbmRsZSBhcnJheSB2YWx1ZXNcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFyIGNvbWJpbmVkVmFsdWUgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICB2YXIgcHJvY2Vzc2VkVmFsdWUgPSAoMCwgX3ByZWZpeFZhbHVlMi5kZWZhdWx0KShwbHVnaW5zLCBwcm9wZXJ0eSwgdmFsdWVbaV0sIHN0eWxlLCBwcmVmaXhNYXApO1xuICAgICAgICAgICgwLCBfYWRkTmV3VmFsdWVzT25seTIuZGVmYXVsdCkoY29tYmluZWRWYWx1ZSwgcHJvY2Vzc2VkVmFsdWUgfHwgdmFsdWVbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb25seSBtb2RpZnkgdGhlIHZhbHVlIGlmIGl0IHdhcyB0b3VjaGVkXG4gICAgICAgIC8vIGJ5IGFueSBwbHVnaW4gdG8gcHJldmVudCB1bm5lY2Vzc2FyeSBtdXRhdGlvbnNcbiAgICAgICAgaWYgKGNvbWJpbmVkVmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHN0eWxlW3Byb3BlcnR5XSA9IGNvbWJpbmVkVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBfcHJvY2Vzc2VkVmFsdWUgPSAoMCwgX3ByZWZpeFZhbHVlMi5kZWZhdWx0KShwbHVnaW5zLCBwcm9wZXJ0eSwgdmFsdWUsIHN0eWxlLCBwcmVmaXhNYXApO1xuXG4gICAgICAgIC8vIG9ubHkgbW9kaWZ5IHRoZSB2YWx1ZSBpZiBpdCB3YXMgdG91Y2hlZFxuICAgICAgICAvLyBieSBhbnkgcGx1Z2luIHRvIHByZXZlbnQgdW5uZWNlc3NhcnkgbXV0YXRpb25zXG4gICAgICAgIGlmIChfcHJvY2Vzc2VkVmFsdWUpIHtcbiAgICAgICAgICBzdHlsZVtwcm9wZXJ0eV0gPSBfcHJvY2Vzc2VkVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICAoMCwgX3ByZWZpeFByb3BlcnR5Mi5kZWZhdWx0KShwcmVmaXhNYXAsIHByb3BlcnR5LCBzdHlsZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlO1xuICB9XG5cbiAgcmV0dXJuIHByZWZpeEFsbDtcbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNhbGM7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQcmVmaXhlZFZhbHVlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHByZWZpeGVzID0gWyctd2Via2l0LScsICctbW96LScsICcnXTtcbmZ1bmN0aW9uIGNhbGMocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICEoMCwgX2lzUHJlZml4ZWRWYWx1ZTIuZGVmYXVsdCkodmFsdWUpICYmIHZhbHVlLmluZGV4T2YoJ2NhbGMoJykgPiAtMSkge1xuICAgIHJldHVybiBwcmVmaXhlcy5tYXAoZnVuY3Rpb24gKHByZWZpeCkge1xuICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoL2NhbGNcXCgvZywgcHJlZml4ICsgJ2NhbGMoJyk7XG4gICAgfSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGNyb3NzRmFkZTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUgPSByZXF1aXJlKCdjc3MtaW4tanMtdXRpbHMvbGliL2lzUHJlZml4ZWRWYWx1ZScpO1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc1ByZWZpeGVkVmFsdWUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vLyBodHRwOi8vY2FuaXVzZS5jb20vI3NlYXJjaD1jcm9zcy1mYWRlXG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJyddO1xuZnVuY3Rpb24gY3Jvc3NGYWRlKHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAhKDAsIF9pc1ByZWZpeGVkVmFsdWUyLmRlZmF1bHQpKHZhbHVlKSAmJiB2YWx1ZS5pbmRleE9mKCdjcm9zcy1mYWRlKCcpID4gLTEpIHtcbiAgICByZXR1cm4gcHJlZml4ZXMubWFwKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9jcm9zcy1mYWRlXFwoL2csIHByZWZpeCArICdjcm9zcy1mYWRlKCcpO1xuICAgIH0pO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjdXJzb3I7XG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJy1tb3otJywgJyddO1xuXG52YXIgdmFsdWVzID0ge1xuICAnem9vbS1pbic6IHRydWUsXG4gICd6b29tLW91dCc6IHRydWUsXG4gIGdyYWI6IHRydWUsXG4gIGdyYWJiaW5nOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBjdXJzb3IocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChwcm9wZXJ0eSA9PT0gJ2N1cnNvcicgJiYgdmFsdWVzLmhhc093blByb3BlcnR5KHZhbHVlKSkge1xuICAgIHJldHVybiBwcmVmaXhlcy5tYXAoZnVuY3Rpb24gKHByZWZpeCkge1xuICAgICAgcmV0dXJuIHByZWZpeCArIHZhbHVlO1xuICAgIH0pO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBmaWx0ZXI7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQcmVmaXhlZFZhbHVlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLy8gaHR0cDovL2Nhbml1c2UuY29tLyNmZWF0PWNzcy1maWx0ZXItZnVuY3Rpb25cbnZhciBwcmVmaXhlcyA9IFsnLXdlYmtpdC0nLCAnJ107XG5mdW5jdGlvbiBmaWx0ZXIocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICEoMCwgX2lzUHJlZml4ZWRWYWx1ZTIuZGVmYXVsdCkodmFsdWUpICYmIHZhbHVlLmluZGV4T2YoJ2ZpbHRlcignKSA+IC0xKSB7XG4gICAgcmV0dXJuIHByZWZpeGVzLm1hcChmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvZmlsdGVyXFwoL2csIHByZWZpeCArICdmaWx0ZXIoJyk7XG4gICAgfSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGZsZXg7XG52YXIgdmFsdWVzID0ge1xuICBmbGV4OiB0cnVlLFxuICAnaW5saW5lLWZsZXgnOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBmbGV4KHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAocHJvcGVydHkgPT09ICdkaXNwbGF5JyAmJiB2YWx1ZXMuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG4gICAgcmV0dXJuIFsnLXdlYmtpdC1ib3gnLCAnLW1vei1ib3gnLCAnLW1zLScgKyB2YWx1ZSArICdib3gnLCAnLXdlYmtpdC0nICsgdmFsdWUsIHZhbHVlXTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZmxleGJveElFO1xudmFyIGFsdGVybmF0aXZlVmFsdWVzID0ge1xuICAnc3BhY2UtYXJvdW5kJzogJ2Rpc3RyaWJ1dGUnLFxuICAnc3BhY2UtYmV0d2Vlbic6ICdqdXN0aWZ5JyxcbiAgJ2ZsZXgtc3RhcnQnOiAnc3RhcnQnLFxuICAnZmxleC1lbmQnOiAnZW5kJ1xufTtcbnZhciBhbHRlcm5hdGl2ZVByb3BzID0ge1xuICBhbGlnbkNvbnRlbnQ6ICdtc0ZsZXhMaW5lUGFjaycsXG4gIGFsaWduU2VsZjogJ21zRmxleEl0ZW1BbGlnbicsXG4gIGFsaWduSXRlbXM6ICdtc0ZsZXhBbGlnbicsXG4gIGp1c3RpZnlDb250ZW50OiAnbXNGbGV4UGFjaycsXG4gIG9yZGVyOiAnbXNGbGV4T3JkZXInLFxuICBmbGV4R3JvdzogJ21zRmxleFBvc2l0aXZlJyxcbiAgZmxleFNocmluazogJ21zRmxleE5lZ2F0aXZlJyxcbiAgZmxleEJhc2lzOiAnbXNQcmVmZXJyZWRTaXplJ1xufTtcblxuZnVuY3Rpb24gZmxleGJveElFKHByb3BlcnR5LCB2YWx1ZSwgc3R5bGUpIHtcbiAgaWYgKGFsdGVybmF0aXZlUHJvcHMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgc3R5bGVbYWx0ZXJuYXRpdmVQcm9wc1twcm9wZXJ0eV1dID0gYWx0ZXJuYXRpdmVWYWx1ZXNbdmFsdWVdIHx8IHZhbHVlO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBmbGV4Ym94T2xkO1xudmFyIGFsdGVybmF0aXZlVmFsdWVzID0ge1xuICAnc3BhY2UtYXJvdW5kJzogJ2p1c3RpZnknLFxuICAnc3BhY2UtYmV0d2Vlbic6ICdqdXN0aWZ5JyxcbiAgJ2ZsZXgtc3RhcnQnOiAnc3RhcnQnLFxuICAnZmxleC1lbmQnOiAnZW5kJyxcbiAgJ3dyYXAtcmV2ZXJzZSc6ICdtdWx0aXBsZScsXG4gIHdyYXA6ICdtdWx0aXBsZSdcbn07XG5cbnZhciBhbHRlcm5hdGl2ZVByb3BzID0ge1xuICBhbGlnbkl0ZW1zOiAnV2Via2l0Qm94QWxpZ24nLFxuICBqdXN0aWZ5Q29udGVudDogJ1dlYmtpdEJveFBhY2snLFxuICBmbGV4V3JhcDogJ1dlYmtpdEJveExpbmVzJ1xufTtcblxuZnVuY3Rpb24gZmxleGJveE9sZChwcm9wZXJ0eSwgdmFsdWUsIHN0eWxlKSB7XG4gIGlmIChwcm9wZXJ0eSA9PT0gJ2ZsZXhEaXJlY3Rpb24nICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodmFsdWUuaW5kZXhPZignY29sdW1uJykgPiAtMSkge1xuICAgICAgc3R5bGUuV2Via2l0Qm94T3JpZW50ID0gJ3ZlcnRpY2FsJztcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuV2Via2l0Qm94T3JpZW50ID0gJ2hvcml6b250YWwnO1xuICAgIH1cbiAgICBpZiAodmFsdWUuaW5kZXhPZigncmV2ZXJzZScpID4gLTEpIHtcbiAgICAgIHN0eWxlLldlYmtpdEJveERpcmVjdGlvbiA9ICdyZXZlcnNlJztcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuV2Via2l0Qm94RGlyZWN0aW9uID0gJ25vcm1hbCc7XG4gICAgfVxuICB9XG4gIGlmIChhbHRlcm5hdGl2ZVByb3BzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgIHN0eWxlW2FsdGVybmF0aXZlUHJvcHNbcHJvcGVydHldXSA9IGFsdGVybmF0aXZlVmFsdWVzW3ZhbHVlXSB8fCB2YWx1ZTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gZ3JhZGllbnQ7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQcmVmaXhlZFZhbHVlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHByZWZpeGVzID0gWyctd2Via2l0LScsICctbW96LScsICcnXTtcblxudmFyIHZhbHVlcyA9IC9saW5lYXItZ3JhZGllbnR8cmFkaWFsLWdyYWRpZW50fHJlcGVhdGluZy1saW5lYXItZ3JhZGllbnR8cmVwZWF0aW5nLXJhZGlhbC1ncmFkaWVudC87XG5cbmZ1bmN0aW9uIGdyYWRpZW50KHByb3BlcnR5LCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAhKDAsIF9pc1ByZWZpeGVkVmFsdWUyLmRlZmF1bHQpKHZhbHVlKSAmJiB2YWx1ZXMudGVzdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gcHJlZml4ZXMubWFwKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgIHJldHVybiBwcmVmaXggKyB2YWx1ZTtcbiAgICB9KTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gaW1hZ2VTZXQ7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlID0gcmVxdWlyZSgnY3NzLWluLWpzLXV0aWxzL2xpYi9pc1ByZWZpeGVkVmFsdWUnKTtcblxudmFyIF9pc1ByZWZpeGVkVmFsdWUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNQcmVmaXhlZFZhbHVlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLy8gaHR0cDovL2Nhbml1c2UuY29tLyNmZWF0PWNzcy1pbWFnZS1zZXRcbnZhciBwcmVmaXhlcyA9IFsnLXdlYmtpdC0nLCAnJ107XG5mdW5jdGlvbiBpbWFnZVNldChwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgISgwLCBfaXNQcmVmaXhlZFZhbHVlMi5kZWZhdWx0KSh2YWx1ZSkgJiYgdmFsdWUuaW5kZXhPZignaW1hZ2Utc2V0KCcpID4gLTEpIHtcbiAgICByZXR1cm4gcHJlZml4ZXMubWFwKGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9pbWFnZS1zZXRcXCgvZywgcHJlZml4ICsgJ2ltYWdlLXNldCgnKTtcbiAgICB9KTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzWydkZWZhdWx0J107IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gcG9zaXRpb247XG5mdW5jdGlvbiBwb3NpdGlvbihwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgaWYgKHByb3BlcnR5ID09PSAncG9zaXRpb24nICYmIHZhbHVlID09PSAnc3RpY2t5Jykge1xuICAgIHJldHVybiBbJy13ZWJraXQtc3RpY2t5JywgJ3N0aWNreSddO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBzaXppbmc7XG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJy1tb3otJywgJyddO1xuXG52YXIgcHJvcGVydGllcyA9IHtcbiAgbWF4SGVpZ2h0OiB0cnVlLFxuICBtYXhXaWR0aDogdHJ1ZSxcbiAgd2lkdGg6IHRydWUsXG4gIGhlaWdodDogdHJ1ZSxcbiAgY29sdW1uV2lkdGg6IHRydWUsXG4gIG1pbldpZHRoOiB0cnVlLFxuICBtaW5IZWlnaHQ6IHRydWVcbn07XG52YXIgdmFsdWVzID0ge1xuICAnbWluLWNvbnRlbnQnOiB0cnVlLFxuICAnbWF4LWNvbnRlbnQnOiB0cnVlLFxuICAnZmlsbC1hdmFpbGFibGUnOiB0cnVlLFxuICAnZml0LWNvbnRlbnQnOiB0cnVlLFxuICAnY29udGFpbi1mbG9hdHMnOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBzaXppbmcocHJvcGVydHksIHZhbHVlKSB7XG4gIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSAmJiB2YWx1ZXMuaGFzT3duUHJvcGVydHkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHByZWZpeGVzLm1hcChmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICByZXR1cm4gcHJlZml4ICsgdmFsdWU7XG4gICAgfSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1snZGVmYXVsdCddOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHRyYW5zaXRpb247XG5cbnZhciBfaHlwaGVuYXRlUHJvcGVydHkgPSByZXF1aXJlKCdjc3MtaW4tanMtdXRpbHMvbGliL2h5cGhlbmF0ZVByb3BlcnR5Jyk7XG5cbnZhciBfaHlwaGVuYXRlUHJvcGVydHkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaHlwaGVuYXRlUHJvcGVydHkpO1xuXG52YXIgX2lzUHJlZml4ZWRWYWx1ZSA9IHJlcXVpcmUoJ2Nzcy1pbi1qcy11dGlscy9saWIvaXNQcmVmaXhlZFZhbHVlJyk7XG5cbnZhciBfaXNQcmVmaXhlZFZhbHVlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzUHJlZml4ZWRWYWx1ZSk7XG5cbnZhciBfY2FwaXRhbGl6ZVN0cmluZyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2NhcGl0YWxpemVTdHJpbmcnKTtcblxudmFyIF9jYXBpdGFsaXplU3RyaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NhcGl0YWxpemVTdHJpbmcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgcHJvcGVydGllcyA9IHtcbiAgdHJhbnNpdGlvbjogdHJ1ZSxcbiAgdHJhbnNpdGlvblByb3BlcnR5OiB0cnVlLFxuICBXZWJraXRUcmFuc2l0aW9uOiB0cnVlLFxuICBXZWJraXRUcmFuc2l0aW9uUHJvcGVydHk6IHRydWUsXG4gIE1velRyYW5zaXRpb246IHRydWUsXG4gIE1velRyYW5zaXRpb25Qcm9wZXJ0eTogdHJ1ZVxufTtcblxuXG52YXIgcHJlZml4TWFwcGluZyA9IHtcbiAgV2Via2l0OiAnLXdlYmtpdC0nLFxuICBNb3o6ICctbW96LScsXG4gIG1zOiAnLW1zLSdcbn07XG5cbmZ1bmN0aW9uIHByZWZpeFZhbHVlKHZhbHVlLCBwcm9wZXJ0eVByZWZpeE1hcCkge1xuICBpZiAoKDAsIF9pc1ByZWZpeGVkVmFsdWUyLmRlZmF1bHQpKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIG9ubHkgc3BsaXQgbXVsdGkgdmFsdWVzLCBub3QgY3ViaWMgYmV6aWVyc1xuICB2YXIgbXVsdGlwbGVWYWx1ZXMgPSB2YWx1ZS5zcGxpdCgvLCg/IVteKCldKig/OlxcKFteKCldKlxcKSk/XFwpKS9nKTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gbXVsdGlwbGVWYWx1ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgc2luZ2xlVmFsdWUgPSBtdWx0aXBsZVZhbHVlc1tpXTtcbiAgICB2YXIgdmFsdWVzID0gW3NpbmdsZVZhbHVlXTtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm9wZXJ0eVByZWZpeE1hcCkge1xuICAgICAgdmFyIGRhc2hDYXNlUHJvcGVydHkgPSAoMCwgX2h5cGhlbmF0ZVByb3BlcnR5Mi5kZWZhdWx0KShwcm9wZXJ0eSk7XG5cbiAgICAgIGlmIChzaW5nbGVWYWx1ZS5pbmRleE9mKGRhc2hDYXNlUHJvcGVydHkpID4gLTEgJiYgZGFzaENhc2VQcm9wZXJ0eSAhPT0gJ29yZGVyJykge1xuICAgICAgICB2YXIgcHJlZml4ZXMgPSBwcm9wZXJ0eVByZWZpeE1hcFtwcm9wZXJ0eV07XG4gICAgICAgIGZvciAodmFyIGogPSAwLCBwTGVuID0gcHJlZml4ZXMubGVuZ3RoOyBqIDwgcExlbjsgKytqKSB7XG4gICAgICAgICAgLy8gam9pbiBhbGwgcHJlZml4ZXMgYW5kIGNyZWF0ZSBhIG5ldyB2YWx1ZVxuICAgICAgICAgIHZhbHVlcy51bnNoaWZ0KHNpbmdsZVZhbHVlLnJlcGxhY2UoZGFzaENhc2VQcm9wZXJ0eSwgcHJlZml4TWFwcGluZ1twcmVmaXhlc1tqXV0gKyBkYXNoQ2FzZVByb3BlcnR5KSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBtdWx0aXBsZVZhbHVlc1tpXSA9IHZhbHVlcy5qb2luKCcsJyk7XG4gIH1cblxuICByZXR1cm4gbXVsdGlwbGVWYWx1ZXMuam9pbignLCcpO1xufVxuXG5mdW5jdGlvbiB0cmFuc2l0aW9uKHByb3BlcnR5LCB2YWx1ZSwgc3R5bGUsIHByb3BlcnR5UHJlZml4TWFwKSB7XG4gIC8vIGFsc28gY2hlY2sgZm9yIGFscmVhZHkgcHJlZml4ZWQgdHJhbnNpdGlvbnNcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgcHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICB2YXIgb3V0cHV0VmFsdWUgPSBwcmVmaXhWYWx1ZSh2YWx1ZSwgcHJvcGVydHlQcmVmaXhNYXApO1xuICAgIC8vIGlmIHRoZSBwcm9wZXJ0eSBpcyBhbHJlYWR5IHByZWZpeGVkXG4gICAgdmFyIHdlYmtpdE91dHB1dCA9IG91dHB1dFZhbHVlLnNwbGl0KC8sKD8hW14oKV0qKD86XFwoW14oKV0qXFwpKT9cXCkpL2cpLmZpbHRlcihmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gIS8tbW96LXwtbXMtLy50ZXN0KHZhbCk7XG4gICAgfSkuam9pbignLCcpO1xuXG4gICAgaWYgKHByb3BlcnR5LmluZGV4T2YoJ1dlYmtpdCcpID4gLTEpIHtcbiAgICAgIHJldHVybiB3ZWJraXRPdXRwdXQ7XG4gICAgfVxuXG4gICAgdmFyIG1vek91dHB1dCA9IG91dHB1dFZhbHVlLnNwbGl0KC8sKD8hW14oKV0qKD86XFwoW14oKV0qXFwpKT9cXCkpL2cpLmZpbHRlcihmdW5jdGlvbiAodmFsKSB7XG4gICAgICByZXR1cm4gIS8td2Via2l0LXwtbXMtLy50ZXN0KHZhbCk7XG4gICAgfSkuam9pbignLCcpO1xuXG4gICAgaWYgKHByb3BlcnR5LmluZGV4T2YoJ01veicpID4gLTEpIHtcbiAgICAgIHJldHVybiBtb3pPdXRwdXQ7XG4gICAgfVxuXG4gICAgc3R5bGVbJ1dlYmtpdCcgKyAoMCwgX2NhcGl0YWxpemVTdHJpbmcyLmRlZmF1bHQpKHByb3BlcnR5KV0gPSB3ZWJraXRPdXRwdXQ7XG4gICAgc3R5bGVbJ01veicgKyAoMCwgX2NhcGl0YWxpemVTdHJpbmcyLmRlZmF1bHQpKHByb3BlcnR5KV0gPSBtb3pPdXRwdXQ7XG4gICAgcmV0dXJuIG91dHB1dFZhbHVlO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGFkZE5ld1ZhbHVlc09ubHk7XG5mdW5jdGlvbiBhZGRJZk5ldyhsaXN0LCB2YWx1ZSkge1xuICBpZiAobGlzdC5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcbiAgICBsaXN0LnB1c2godmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGFkZE5ld1ZhbHVlc09ubHkobGlzdCwgdmFsdWVzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlcykpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmFsdWVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBhZGRJZk5ldyhsaXN0LCB2YWx1ZXNbaV0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhZGRJZk5ldyhsaXN0LCB2YWx1ZXMpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gY2FwaXRhbGl6ZVN0cmluZztcbmZ1bmN0aW9uIGNhcGl0YWxpemVTdHJpbmcoc3RyKSB7XG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gaXNPYmplY3Q7XG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBwcmVmaXhQcm9wZXJ0eTtcblxudmFyIF9jYXBpdGFsaXplU3RyaW5nID0gcmVxdWlyZSgnLi9jYXBpdGFsaXplU3RyaW5nJyk7XG5cbnZhciBfY2FwaXRhbGl6ZVN0cmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYXBpdGFsaXplU3RyaW5nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gcHJlZml4UHJvcGVydHkocHJlZml4UHJvcGVydGllcywgcHJvcGVydHksIHN0eWxlKSB7XG4gIGlmIChwcmVmaXhQcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgIHZhciByZXF1aXJlZFByZWZpeGVzID0gcHJlZml4UHJvcGVydGllc1twcm9wZXJ0eV07XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcXVpcmVkUHJlZml4ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIHN0eWxlW3JlcXVpcmVkUHJlZml4ZXNbaV0gKyAoMCwgX2NhcGl0YWxpemVTdHJpbmcyLmRlZmF1bHQpKHByb3BlcnR5KV0gPSBzdHlsZVtwcm9wZXJ0eV07XG4gICAgfVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IHByZWZpeFZhbHVlO1xuZnVuY3Rpb24gcHJlZml4VmFsdWUocGx1Z2lucywgcHJvcGVydHksIHZhbHVlLCBzdHlsZSwgbWV0YURhdGEpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBsdWdpbnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICB2YXIgcHJvY2Vzc2VkVmFsdWUgPSBwbHVnaW5zW2ldKHByb3BlcnR5LCB2YWx1ZSwgc3R5bGUsIG1ldGFEYXRhKTtcblxuICAgIC8vIHdlIGNhbiBzdG9wIHByb2Nlc3NpbmcgaWYgYSB2YWx1ZSBpcyByZXR1cm5lZFxuICAgIC8vIGFzIGFsbCBwbHVnaW4gY3JpdGVyaWEgYXJlIHVuaXF1ZVxuICAgIGlmIChwcm9jZXNzZWRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHByb2Nlc3NlZFZhbHVlO1xuICAgIH1cbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gaGFzaChzdHIpIHtcbiAgdmFyIGhhc2ggPSA1MzgxLFxuICAgICAgaSAgICA9IHN0ci5sZW5ndGg7XG5cbiAgd2hpbGUoaSkge1xuICAgIGhhc2ggPSAoaGFzaCAqIDMzKSBeIHN0ci5jaGFyQ29kZUF0KC0taSk7XG4gIH1cblxuICAvKiBKYXZhU2NyaXB0IGRvZXMgYml0d2lzZSBvcGVyYXRpb25zIChsaWtlIFhPUiwgYWJvdmUpIG9uIDMyLWJpdCBzaWduZWRcbiAgICogaW50ZWdlcnMuIFNpbmNlIHdlIHdhbnQgdGhlIHJlc3VsdHMgdG8gYmUgYWx3YXlzIHBvc2l0aXZlLCBjb252ZXJ0IHRoZVxuICAgKiBzaWduZWQgaW50IHRvIGFuIHVuc2lnbmVkIGJ5IGRvaW5nIGFuIHVuc2lnbmVkIGJpdHNoaWZ0LiAqL1xuICByZXR1cm4gaGFzaCA+Pj4gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoO1xuIl19
