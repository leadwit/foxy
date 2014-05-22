var fis = require('fis');

var tpl = '/*此文件是fox-fis自动生成的，用于被chrome插件调用处理页面。*/' +
    'var map = <%=map.json%>; var HOST="http://localhost:"+ map["browser-map"].host;'+
'for(var item in map["browser-map"].styles){'+
'    var style = document.createElement("link");'+
'    style.id = "UC_STYLE";'+
'    style.rel = "stylesheet";'+
'    style.href = HOST + map.res[map["browser-map"].styles[item].replace(/^\\//,"")].uri;'+
'    document.head.appendChild(style);'+
'}'+
'for(var item in map["browser-map"].scripts){'+
'    var script = document.createElement("script");'+
'    script.src = HOST + map.res[map["browser-map"].scripts[item].replace(/^\\//,"")].uri;'+
'    document.head.appendChild(script);'+
'}' +
'setTimeout(function(){' +
    'for(var item in map["browser-map"].delayScripts){'+
'     var script = document.createElement("script");'+
'        script.src = HOST + map.res[map["browser-map"].delayScripts[item].replace(/^\\//,"")].uri;'+
'        document.head.appendChild(script);'+
'   }' +
'},1000);';


module.exports = function(ret, conf, settings, opt){
    console.log('create-chrometools.');

    var chromefile = tpl.replace("<%=map.json%>", JSON.stringify(ret.map));

    var _file = fis.file(fis.project.getProjectPath('chrome.js'));
    _file.setContent(chromefile);
    ret.pkg[_file.subpath] = _file;
};
