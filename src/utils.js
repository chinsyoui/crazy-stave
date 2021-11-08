
export function isIOS() {
	var u = navigator.userAgent;
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	return isiOS;
};

export function requestFullScreen(element) {
	console.log("requestFullScreen");
	
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
		console.log("device doesn't support requestFullScreen");
		return;
	}
	document.documentElement[method]();
};

export function exitFullScreen() {
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

function changeScreenOrientationToLandscapeByApi() {
	console.log("changeScreenOrientationToLandscapeByApi");

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
		console.log("device doesn't support screen.*orientation");
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
	console.log("changeScreenOrientationToLandscapeByCss");

	let width = document.documentElement.clientWidth;
	let height = document.documentElement.clientHeight;

	console.log(width, height);

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
	_vue_this.$nextTick(function() {
		if (isIOS())
			changeScreenOrientationToLandscapeByCss(_vue_this.$el);
		else
			changeScreenOrientationToLandscapeByApi();
	});	
};
