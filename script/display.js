
// 浏览器对象
var objApp = window.external;
var objDatabase = objApp.Database;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var pluginPath = objApp.GetPluginPathByScriptFileName("dictGlobal.js");
var searchBar = document.getElementById("searchBar");

// 事件函数绑定
searchBar.onchange = submitQuery;
searchBar.onfocus = function(){this.select();}
//document.body.onmouseover = function(){searchBar.focus()}
//document.body.onmouseout = function(){searchBar.blur()}
document.body.onclick = function(){searchBar.focus();}

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
	sidebar.parentNode.removeChild(sidebar);
	//var header = objframeDocument.getElementById("b_header");
	//header.parentNode.removeChild(header);
	// 去除原本body点击事件
	objframeDocument.body.onclick = function(){searchBar.focus()}
	// 删除脚本
	objframeDocument.head.removeChild(objframeDocument.scripts[0]);
	//
	iframe.contentWindow.addEventListener("unload",function(){window.frames['bing-dict'].style.display = "none"})
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

