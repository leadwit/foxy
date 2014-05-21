var fis = require('fis');
//var colors = require('./colors');


var tpl = '/*此文件是fox-fis自动生成的，用于被chrome插件调用处理页面。*/' +
    'var map = <%=map.json%>; var HOST="http://localhost:"+map.host;'+
'for(var item in map.styles){'+
'    var style = document.createElement("link");'+
'    style.id = "UC_STYLE";'+
'    style.rel = "stylesheet";'+
'    style.href = HOST + map.styles[item];'+
'    document.head.appendChild(style);'+
'}'+
'for(var item in map.scripts){'+
'    var script = document.createElement("script");'+
'    script.src = HOST + map.scripts[item];'+
'    document.head.appendChild(script);'+
'}' +
'setTimeout(function(){' +
    'for(var item in map.delayScripts){'+
'     var script = document.createElement("script");'+
'        script.src = HOST + map.delayScripts[item];'+
'        document.head.appendChild(script);'+
'   }' +
'},1000);';


module.exports = function(ret, conf, settings, opt){
    console.log('create-chrometools.');

    var chromefile = tpl.replace("<%=map.json%>", JSON.stringify(ret.map['browser-map']))
//    console.log(chromefile);

    var _file = fis.file(fis.project.getProjectPath('chrome.js'));
    _file.setContent(chromefile);
    ret.pkg[_file.subpath] = _file;
};
