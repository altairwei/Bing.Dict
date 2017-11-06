function OnBingDictClicked() {
	var pluginPath = objApp.GetPluginPathByScriptFileName("dictGlobal.js");
	objWindow.ShowHtmlDialogEx(true, "必应词典", pluginPath + 'index.html', 440, 500, '', null, null);
}

function InitBingDictButton() {
    var pluginPath = objApp.GetPluginPathByScriptFileName("dictGlobal.js");
    objWindow.AddToolButton("main", "BingDict", "必应词典", pluginPath+"images/bing.ico", "OnBingDictClicked");
}
InitBingDictButton();
