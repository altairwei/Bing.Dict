
// 浏览器对象
var objApp = window.external;
var objDatabase = objApp.Database;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var pluginPath = objApp.GetPluginPathByScriptFileName("dictGlobal.js");
var searchBar = document.getElementById("searchBar");
var backBtn = document.getElementById("back");
var forwardBtn = document.getElementById("forward");

// 事件函数绑定
window.addEventListener("load", initUI);
searchBar.onchange = submitQuery;
searchBar.onfocus = function(){this.select();}
//document.onclick = function(){searchBar.focus();}
//
window.addEventListener("load", function(){searchBar.focus();});
window.addEventListener("click", function(){searchBar.focus();});
//
backBtn.onclick = function(){window.history.back()}
forwardBtn.onclick = function(){window.history.forward()}

// 初始化界面
function initUI(){
	create_iframe("http://cn.bing.com/dict/")
}

// 查询单词
function submitQuery(){
	if (!this.value) {return false}
	var iframe = window.frames['bing-dict'];
	var str = "http://cn.bing.com/dict/search?q=" + this.value + "&mkt=zh-CN";
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
	// 检查加载状态
	check_ifameReady(objframe);
	return objframe;
}

// 检测iframe加载情况并绑定事件函数
function check_ifameReady(iframe){
	if (iframe.addEventListener){
		iframe.addEventListener("load", function(){
		insertStyle(iframe);
		});
	} else {
		iframe.onload = function(){
		insertStyle(iframe);
		};
	}
}

// 裁剪查询页面
function insertStyle(iframe){
	// 创建样式，隐藏非必要元素
	var styleElem = document.createElement("style");
	var objframeDocument = iframe.contentWindow.document;
	var styleText = objCommon.LoadTextFromFile(pluginPath + "css/iframe.css");
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
	iframe.contentWindow.addEventListener("click", function(){/*searchBar.focus();*/});
	objframeDocument.body.onclick = function(){/*searchBar.focus()*/};
	iframe.contentWindow.addEventListener("dblclick", function(){searchBar.focus();});
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

window.onresize = function(){
	changeFrameHeight();  
} 

