
// 浏览器对象
var objApp;
var objWindow
var objCommon;
var pluginPath;

// UI 对象
var $searchBar, $backBtn, $forwardBtn, $injectBtn;

// Initialize WizNote APIs
new QWebChannel(qt.webChannelTransport, function (channel) {
	var objectNames = ["WizExplorerApp", "JSPluginSpec", "JSPluginModuleSpec"];
	for (var i = 0; i < objectNames.length; i++) {
		var key = objectNames[i];
		window[key] = channel.objects[key];
	}
	console.log("web channel opened");
	//
	initForWebEngine();

});

async function initForWebEngine() {
	if (!window.WizExplorerApp) return;
	objApp = window.WizExplorerApp;
	pluginData = window.JSPluginSpec;
	pluginPath = pluginData.path;
	objWindow = objApp.Window;
	objCommon = objApp.CommonUI;
	window.onresize = function(){
		changeFrameHeight();  
	} 

	$(document).ready(function(){
		// UI准备
		$searchBar = $('#searchBar');
		$backBtn = $('#backBtn');
		$forwardBtn = $('#forward');
		$injectBtn = $('#inject')

		// 事件函数绑定
		$('#searchBar').on('change', submitQuery).on('focus', function(){this.select();});
		$(window).on('click', function(){$searchBar.focus();});
		$('#back').on('click', function(){window.history.back()})
		$('#forward').on('click', function(){window.history.forward()})

		// 初始化
		$searchBar.focus();

		create_iframe("http://cn.bing.com/dict/");

		QUnit.test( "hello test", function( assert ) {
			assert.ok( 1 == "1", "Passed!" );
		});
	})
}

// 查询单词
function submitQuery(){
	if (!this.value) {return false}
	var iframe = window.frames['bing-dict'];
	var str = encodeURI("http://cn.bing.com/dict/search?q=" + this.value + "&mkt=zh-CN");
	if (!iframe) {
		create_iframe(str);
	} else {
		iframe.src = str;
	}
}

// 创建iframe元素
function create_iframe(src){
	var objframe = document.createElement("iframe"); 
	objframe.id = "bing-dict";
	objframe.setAttribute("frameborder", "0");
	objframe.setAttribute("width", "100%");
	objframe.style.display = "none";
	objframe.src = src;
	// 加载iframe
	document.body.appendChild(objframe);
	
	// 加载
	//$(objframe.contentWindow).load(function(){
	//	insertStyle(objframe);
	//})
	check_ifameReady(objframe);
	return objframe;
}

// 检测iframe加载情况并绑定事件函数
function check_ifameReady(iframe){
	if (iframe.addEventListener){
		iframe.addEventListener("load", function(){
			insertStyle(iframe);
			console.log('addEventListener')
		});
	} else {
		iframe.onload = function(){
			insertStyle(iframe);
			console.log('onload')
		};
	}
}

// 裁剪查询页面
async function insertStyle(iframe){
	// 创建样式，隐藏非必要元素
	var styleElem = document.createElement("style");
	var objframeDocument = iframe.contentWindow.document;
	const styleText = await objCommon.LoadTextFromFile(pluginPath + "css/iframe.css");
	styleElem.innerText = styleText;
	objframeDocument.head.appendChild(styleElem);
	// 去除多余元素
	var sidebar = objframeDocument.getElementsByClassName("sidebar")[0];
	if (sidebar) {sidebar.parentNode.removeChild(sidebar);}
	var adsblock = objframeDocument.getElementsByClassName("adsblock")[0];
	if (adsblock) {adsblock.parentNode.removeChild(adsblock);}
	var dict_banner = objframeDocument.getElementsByClassName("dict_banner")[0];
	if (dict_banner) {dict_banner.parentNode.removeChild(dict_banner);}
	// 去除原本body点击事件
	iframe.contentWindow.addEventListener("click", function(){});
	objframeDocument.body.onclick = function(){};
	iframe.contentWindow.addEventListener("dblclick", function(){$searchBar.focus();});
	// 删除脚本
	objframeDocument.head.removeChild(objframeDocument.scripts[0]);
	//
	iframe.contentWindow.addEventListener("unload", function(){window.frames['bing-dict'].style.display = "none"})
	// 显示页面
	iframe.style.display = "block";
	changeFrameHeight();
}

function changeFrameHeight(){
	var ifm = window.frames['bing-dict'];
	if (ifm) {
		ifm.style.height = document.documentElement.clientHeight + "px";
	}
	
}