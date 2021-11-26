import logger from '@/utils/logger.js'

// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

// import Vue from 'vue'

// export function registerGlobalVueCompoments(dir) {
// 	// TODO dir param not work, so we hard coded here
// 	// https://webpack.js.org/guides/dependency-management/#require-context
// 	const requireComponent = require.context(	
// 		"../views/", 	// look for files in this directory, can use relative directory such as "."
// 		false,	// no subdirectories
// 		/\.vue/ // all .vue files
// 	);

// 	// For each matching file name...
// 	requireComponent.keys().forEach((fileName) => {
// 	  const componentConfig = requireComponent(fileName)
// 	  // Get the PascalCase version of the component name
// 	  const componentName = fileName
// 		// 去掉开头的./和文件后缀名
// 		.replace(/^\.\//, '').replace(/\.\w+$/, '')
// 		// SW 把文件名中的-去掉，并且把各个单词首字符大写
// 		.split('-').map((kebab) => kebab.charAt(0).toUpperCase() + kebab.slice(1)).join('')

// 	  // Globally register the component
// 	  Vue.component(componentName, componentConfig.default || componentConfig)
// 	});
// };

export function isMiniApp() { return (wx); };

// export function isIOS() {
// 	logger.assert(navigator && navigator.userAgent);

// 	if (navigator && navigator.userAgent) {
// 		var u = navigator.userAgent;
// 		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
// 		return isiOS;
// 	} else {
// 		var v = uni.getSystemInfoSync().platform.toLowerCase();
// 		return v && v.includes("ios");
// 	}
// };

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export function requestFullScreen(element) {
	logger.assert(document.documentElement);
	logger.log("requestFullScreen");
	
	let method = null;
	
	if ('requestFullscreen' in document.documentElement)
		method = 'requestFullscreen';
	else if ('mozRequestFullScreen'in document.documentElement)
		method = 'mozRequestFullScreen';
	else if ('msRequestFullscreen'in document.documentElement)
		method = 'msRequestFullscreen';
	else if ('webkitRequestFullscreen'in document.documentElement)
		method = 'webkitRequestFullscreen';

	if (!method) {
		logger.log("device doesn't support requestFullScreen");
		return;
	}
	document.documentElement[method]();
};

export function exitFullScreen() {
	logger.assert(document.documentElement);
	let method = null;
	
	if ('exitFullscreen' in document.documentElement)
		method = 'exitFullscreen';
	else if ('mozCancelFullScreen'in document.documentElement)
		method = 'mozCancelFullScreen';
	else if ('msExitFullscreen'in document.documentElement)
		method = 'msExitFullscreen';
	else if ('webkitExitFullscreen'in document.documentElement)
		method = 'webkitExitFullscreen';

	if (!method)
		return;
	document.documentElement[method]();
};

export function changeScreenOrientationToLandscapeByApi() {
	logger.assert(screen);
	logger.log("changeScreenOrientationToLandscapeByApi");

	let method = null;
	
	if ('orientation' in screen)
		method = 'orientation';
	else if ('mozOrientation'in screen)
		method = 'mozOrientation';
	else if ('msOrientation'in screen)
		method = 'msOrientation';
	else if ('webkitOrientation'in screen)
		method = 'webkitOrientation';

	if (!method) {
		logger.log("device doesn't support screen.*orientation");
		return;
	}

	// 判断当前 设备是 竖屏还是 横屏
	let isPortraid = matchMedia('(orientation: portrait) and (max-device-width: 768px)').matches;

	// 如果是竖屏就强制变成横屏
	if (isPortraid) {
		screen[method].lock('landscape').then(function() {
			setTimeout(() => {
				screen[method].unlock();
				exitFullScreen();
			}, 2000);
		});
	}
};

// htmlElement = document.getElementById("xxx"); 
// htmlElement = this.$el;
export function changeScreenOrientationToLandscapeByCss(htmlElement) {
	logger.assert(window && window.orientation);
	logger.assert(htmlElement);

	logger.log("changeScreenOrientationToLandscapeByCss");

	let width = document.documentElement.clientWidth;
	let height = document.documentElement.clientHeight;

	logger.log(width, height);

	let orientation = "";
	let style = "";

	// orientation = 'portrait';
	if (window.orientation == 0 || window.orientation == 180) {
		style += "width:" + height + "px;"; // 注意旋转后的宽高切换
		style += "height:" + width + "px;";
		style += "-webkit-transform: rotate(90deg); transform: rotate(90deg);";
		// 注意旋转中点的处理
		style += "-webkit-transform-origin: " + width / 2 + "px " + width / 2 + "px;";
		style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
	//	orientation = 'landscape';
	} else if (window.orientation == 90 || window.orientation == -90) {
		style += "width:100%";
		style += "height:100%;";
		style += "-webkit-transform: rotate(0); transform: rotate(0);";
		style += "-webkit-transform-origin: 0 0;";
		style += "transform-origin: 0 0;";
	}

	htmlElement.style.cssText = style;
};

export function changeScreenOrientationToLandscape(_vue_this) {
	logger.assert(_vue_this);	
	_vue_this.$nextTick(function() {
		if (isIOS())
			changeScreenOrientationToLandscapeByCss(_vue_this.$el);
		else
			changeScreenOrientationToLandscapeByApi();
	});	
};
