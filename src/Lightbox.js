import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from 'aphrodite';
import ScrollLock from 'react-scrolllock';
import * as ReactSpinners from 'react-spinners';

import defaultTheme from './theme';
import Arrow from './components/Arrow';
import Container from './components/Container';
import Footer from './components/Footer';
import Header from './components/Header';
import PaginatedThumbnails from './components/PaginatedThumbnails';
import Portal from './components/Portal';

import bindFunctions from './utils/bindFunctions';
import canUseDom from './utils/canUseDom';
import deepMerge from './utils/deepMerge';

class Lightbox extends Component {
	constructor (props) {
		super(props);

		this.theme = deepMerge(defaultTheme, props.theme);
		this.state = { imageLoaded: false, rotate: 0, isZoomed: false };

		bindFunctions.call(this, [
			'gotoNext',
			'gotoPrev',
			'rotate',
			'zoom',
			'closeBackdrop',
			'handleKeyboardInput',
			'handleImageLoaded',
		]);
	}
	getChildContext () {
		return {
			theme: this.theme,
		};
	}
	componentDidMount () {
		if (this.props.isOpen && this.props.enableKeyboardInput) {
			window.addEventListener('keydown', this.handleKeyboardInput);
		}

        if (this.props.zoom) {
            document.addEventListener('mousemove', (event) => {
                let posY = event.clientY;
                if (this.state.isZoomed) {
                    if (posY <= window.innerHeight / 2) {
                    	this.setState({ margin: `${window.innerHeight - posY}px 0 0 0` });
                    } else {
                    	this.setState({ margin: `-${posY / 1.3}px 0 0 0` });
                    }
                }
            });
        }

	}
	componentWillReceiveProps (nextProps) {
		if (!canUseDom) return;

		// preload images
		if (nextProps.preloadNextImage) {
			const currentIndex = this.props.currentImage;
			const nextIndex = nextProps.currentImage + 1;
			const prevIndex = nextProps.currentImage - 1;
			let preloadIndex;

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

		// preload current image
		if (this.props.currentImage !== nextProps.currentImage || !this.props.isOpen && nextProps.isOpen) {
			const img = this.preloadImage(nextProps.currentImage, this.handleImageLoaded);
			this.setState({ imageLoaded: img.complete });
		}

		// add/remove event listeners
		if (!this.props.isOpen && nextProps.isOpen && nextProps.enableKeyboardInput) {
			window.addEventListener('keydown', this.handleKeyboardInput);
		}
		if (!nextProps.isOpen && nextProps.enableKeyboardInput) {
			window.removeEventListener('keydown', this.handleKeyboardInput);
		}
	}
	componentWillUnmount () {
		if (this.props.enableKeyboardInput) {
			window.removeEventListener('keydown', this.handleKeyboardInput);
		}
	}

	// ==============================
	// METHODS
	// ==============================

    get classes () {
        const { zoom, onClickImage } = this.props;
        const { isZoomed, margin, rotate } = this.state;

        defaultStyles.image = {
            ...defaultStyles.image,
            cursor: zoom ? !isZoomed ? 'zoom-in' : 'zoom-out' : onClickImage ? 'pointer' : 'auto',
            maxHeight: !isZoomed ? '630px' : '120vh',
            maxWidth: !isZoomed ? '574px' : '120vh',
            transform: !isZoomed ? `scale(1) rotate(${rotate}deg)` : `scale(1.4) rotate(${rotate}deg)`,
            margin: margin,
        };

        return StyleSheet.create(deepMerge(defaultStyles, this.theme));
    }
	preloadImage (idx, onload) {
		const image = this.props.images[idx];
		if (!image) return;

		const img = new Image();

		// TODO: add error handling for missing images
		img.onerror = onload;
		img.onload = onload;
		img.src = image.src;
		img.srcSet = image.srcSet || image.srcset;

		if (image.srcset) {
			img.srcset = image.srcset.join();
		}

		if (img.srcSet) img.setAttribute('srcset', img.srcSet);

		return img;
	}
	gotoNext (event) {
		const { currentImage, images } = this.props;
		const { imageLoaded } = this.state;

		if (!imageLoaded || currentImage === (images.length - 1)) return;

		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		this.props.onClickNext();
		this.setState({ rotate: 0 });

		this.props.onClickNext();
	}
	gotoPrev (event) {
		const { currentImage } = this.props;
		const { imageLoaded } = this.state;

		if (!imageLoaded || currentImage === 0) return;

		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		this.props.onClickPrev();
		this.setState({ rotate: 0 });
	}
	closeBackdrop (event) {
    // make sure event only happens if they click the backdrop
    // and if the caption is widening the figure element let that respond too
		if (event.target.id === 'lightboxBackdrop' || event.target.tagName === 'FIGURE') {
			this.props.onClose();
		}
	}
	handleKeyboardInput (event) {
		if (event.keyCode === 37) { // left
			this.gotoPrev(event);
			return true;
		} else if (event.keyCode === 39) { // right
			this.gotoNext(event);
			return true;
		} else if (event.keyCode === 27) { // esc
			this.props.onClose();
			return true;
		}
		return false;

	}
	rotate (event) {
		event.preventDefault();
		event.stopPropagation();

		if (this.state.rotate === 360) {
			this.setState({ rotate: 90 });
		} else {
			this.setState({ rotate: this.state.rotate + 90 });
		}
	}
	zoom (event) {
		event.preventDefault();
		event.stopPropagation();

		if (this.state.isZoomed) {
			this.setState({
				isZoomed: false,
				margin: 0,
			});
		} else {
			this.setState({
				isZoomed: true,
				margin: 0,
			});
		}
	}
	eventPreventDefault (event) {
		event.preventDefault();
		event.stopPropagation();
	}

	handleImageLoaded () {
		this.setState({ imageLoaded: true });
	}

	// ==============================
	// RENDERERS
	// ==============================

	renderArrowPrev () {
		if (this.props.currentImage === 0) return null;

		return (
			<Arrow
				direction="left"
				icon="arrowLeft"
				onClick={this.gotoPrev}
				title={this.props.leftArrowTitle}
				type="button"
			/>
		);
	}
	renderArrowNext () {
		if (this.props.currentImage === (this.props.images.length - 1)) return null;

		return (
			<Arrow
				direction="right"
				icon="arrowRight"
				onClick={this.gotoNext}
				title={this.props.rightArrowTitle}
				type="button"
			/>
		);
	}
	renderDialog () {
		const {
			backdropClosesModal,
			isOpen,
			showThumbnails,
			width,
		} = this.props;

		const { imageLoaded } = this.state;

		if (!isOpen) return <span key="closed" />;

		let offsetThumbnails = 0;
		if (showThumbnails) {
			offsetThumbnails = this.theme.thumbnail.size + this.theme.container.gutter.vertical;
		}

		return (
			<Container
				key="open"
				onClick={backdropClosesModal && this.closeBackdrop}
				onTouchEnd={backdropClosesModal && this.closeBackdrop}
			>
                <div>
                    <div className={css(this.classes.content)} style={{ marginBottom: offsetThumbnails, maxWidth: width }}>
                        {imageLoaded && this.renderHeader()}
                        {this.renderImages()}
                        {this.renderSpinner()}
                        {imageLoaded && this.renderFooter()}
                    </div>
                    {imageLoaded && this.renderThumbnails()}
                    {imageLoaded && this.renderArrowPrev()}
                    {imageLoaded && this.renderArrowNext()}
                    <ScrollLock />
                </div>
			</Container>
		);
	}
	renderImages () {
		const {
			currentImage,
			images,
			onClickImage,
			showThumbnails,
		} = this.props;

		const { imageLoaded } = this.state;

		if (!images || !images.length) return null;

		const image = images[currentImage];
		image.srcSet = image.srcSet || image.srcset;

		let srcSet;
		let sizes;

		if (image.srcSet) {
			srcSet = image.srcSet.join();
			sizes = '100vw';
		}

		const thumbnailsSize = showThumbnails ? this.theme.thumbnail.size : 0;
		const heightOffset = `${this.theme.header.height + this.theme.footer.height + thumbnailsSize
			+ (this.theme.container.gutter.vertical)}px`;

		return (
			<figure className={css(this.classes.figure)}>
				{/*
					Re-implement when react warning "unknown props"
					https://fb.me/react-unknown-prop is resolved
					<Swipeable onSwipedLeft={this.gotoNext} onSwipedRight={this.gotoPrev} />
				*/}
				<div className={css(this.classes.imageWrapper)}>
					{
						this.props.customMedia ?
							this.props.customMedia
						: <img
                            className={css(this.classes.image, imageLoaded && this.classes.imageLoaded)}
							onClick={onClickImage ? onClickImage : this.props.zoom ? this.zoom : null}
							alt={image.alt}
							src={image.src}
							srcSet={srcSet}
						/>

					}
					{
						this.props.content ?
							<figcaption
								className={css(this.classes.figcaption)}
								style={{
									display: !this.state.isZoomed ? 'inline-block' : 'none',
								}}
								onClick={this.eventPreventDefault}
							>
								{this.props.children}
							</figcaption>
						: null
					}
				</div>
			</figure>
		);
	}
	renderThumbnails () {
		const { images, currentImage, onClickThumbnail, showThumbnails, thumbnailOffset } = this.props;

		if (!showThumbnails) return;

		return (
			<PaginatedThumbnails
				currentImage={currentImage}
				images={images}
				offset={thumbnailOffset}
				onClickThumbnail={onClickThumbnail}
			/>
		);
	}
	renderHeader () {
		const {
			closeButtonTitle,
			customControls,
			onClose,
			showCloseButton,
            showRotateButton,
            rotateButtonTitle
		} = this.props;

		return (
			<Header
				customControls={customControls}
				onClose={onClose}
				showCloseButton={showCloseButton}
				closeButtonTitle={closeButtonTitle}
                onRotate={this.rotate}
                rotateButtonTitle={rotateButtonTitle}
                showRotateButton={showRotateButton}
			/>
		);
	}
	renderFooter () {
		const {
			currentImage,
			images,
			imageCountSeparator,
			showImageCount,
		} = this.props;

		if (!images || !images.length) return null;

		return (
			<Footer
				caption={images[currentImage].caption}
				countCurrent={currentImage + 1}
				countSeparator={imageCountSeparator}
				countTotal={images.length}
				showCount={showImageCount}
			/>
		);
	}
	renderSpinner () {
		const {
			spinner,
			spinnerColor,
			spinnerSize,
		} = this.props;

		const { imageLoaded } = this.state;
		const Spinner = spinner;

		return (
			<div className={css(this.classes.spinner, !imageLoaded && this.classes.spinnerActive)}>
				<Spinner
					color={spinnerColor}
					size={spinnerSize}
				/>
			</div>
		);
	}
	render () {
		return (
			<Portal>
				{this.renderDialog()}
			</Portal>
		);
	}
}

const DefaultSpinner = (props) => (
	<ReactSpinners.BounceLoader {...props} />
);

Lightbox.propTypes = {
	backdropClosesModal: PropTypes.bool,
	closeButtonTitle: PropTypes.string,
	currentImage: PropTypes.number,
	customControls: PropTypes.arrayOf(PropTypes.node),
	enableKeyboardInput: PropTypes.bool,
	imageCountSeparator: PropTypes.string,
	images: PropTypes.arrayOf(
		PropTypes.shape({
			src: PropTypes.string.isRequired,
			srcSet: PropTypes.array,
			caption: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
			thumbnail: PropTypes.string,
		})
	).isRequired,
	isOpen: PropTypes.bool,
	leftArrowTitle: PropTypes.string,
	onClickImage: PropTypes.func,
	onClickNext: PropTypes.func,
	onClickPrev: PropTypes.func,
	onClose: PropTypes.func.isRequired,
	preloadNextImage: PropTypes.bool,
	rightArrowTitle: PropTypes.string,
	showCloseButton: PropTypes.bool,
	showImageCount: PropTypes.bool,
	showThumbnails: PropTypes.bool,
	spinner: PropTypes.func,
	spinnerColor: PropTypes.string,
	spinnerSize: PropTypes.number,
	theme: PropTypes.object,
	thumbnailOffset: PropTypes.number,
	width: PropTypes.number,
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
	spinner: DefaultSpinner,
	spinnerColor: 'white',
	spinnerSize: 100,
	theme: {},
	thumbnailOffset: 2,
	width: 1024,
	zoom: false,
	content: false,
};
Lightbox.childContextTypes = {
	theme: PropTypes.object.isRequired,
};

const defaultStyles = {
	content: {
		position: 'relative',
	},
	figure: {
		margin: 0, // remove browser default
	},
	imageWrapper: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: '#000',
	},
	image: {
		display: 'block', // removes browser default gutter
		height: 'auto',
		marginLeft: 'auto', // maintain center on very short screens OR very narrow image
		marginRight: 'auto', // maintain center on very short screens OR very narrow image

		// disable user select
		WebkitTouchCallout: 'none',
		userSelect: 'none',

		// opacity animation on image load
		opacity: 0,
		transition: 'opacity 0.3s',
	},
	imageLoaded: {
		opacity: 1,
	},
	figcaption: {
		background: '#fff',
		width: '450px',
		verticalAlign: 'top',
		height: '630px',
		overflow: 'auto',
	},
	spinner: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',

		// opacity animation to make spinner appear with delay
		opacity: 0,
		transition: 'opacity 0.3s',
	},
	spinnerActive: {
		opacity: 1,
	},
};

export default Lightbox;
