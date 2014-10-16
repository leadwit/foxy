var fis = require('fis');
var colors = require('colors');

/**
 * 专门用于兼容maxcms的打包处理
 */
module.exports = function(ret, conf, settings, opt){
    console.log('开始转义JS与CSS:');
    var options = fis.config.get('jsonToStr', {});

     fis.util.map(ret.src,function(subpath, file){
         if(/load\.js$/.test(subpath)){ //PAGE.JS处理
             //console.log(fis.project.getProjectPath())
             var jsHash = fis.file.wrap(fis.project.getProjectPath()+"/js/page.js").getHash();
             var cssHash= fis.file.wrap(fis.project.getProjectPath()+"/css/style.less").getHash();
             console.log("page.js的HASH为"+jsHash+";style.less的HASH为"+cssHash)
             var loadStr=file._content

             loadStr=loadStr.replace("$$jsHash$$",jsHash);
             loadStr=loadStr.replace("$$cssHash$$",cssHash);

             console.log(options)

             var _file = fis.file(fis.project.getProjectPath(options.output+"js/load.js"));
             //console.log(fis.file(fis.project.getProjectPath(options.output+"js/load.js")))
             _file.setContent(loadStr);
             ret.pkg[_file.subpath] = _file;
             ret.map.res[ _file.subpath.replace(/^\//,'') ] = {
                 'uri': opt.hash ? _file.getUrl(opt.hash, opt.domain) : _file.subpath,
                 'type':'js',
                 'has':'',
                 'deps': []
             };
           console.log("成功替换子资源版本")
         }

            if(/page\.js$/.test(subpath)){ //PAGE.JS处理
                
                
                //将JS文件进行字符串处理
                //提取原始文件
        var jsStr=file._content.replace(/\r\n/g,"")
            jsStr=jsStr.replace(/\n/g,"")
            jsStr=jsStr.replace(/\\/g,"\\\\")
            jsStr=jsStr.replace(/"/g,"\\\"")
          //替换中文为UNICDE

        jsStr=jsStr.replace(/[\u4E00-\u9FA5]+/g, function(word){
            return    escape(word).replace(/%/g,"\\\\")
        });

            jsStr="var jsFile={\"str\":\""+jsStr+"\"}"

          // 将得到的字符串作为JS文件，保存到文件夹
         var _file = fis.file(fis.project.getProjectPath(options.output+"js/pageJson.js"));
         //console.log(fis.file(fis.project.getProjectPath(options.output+"js/pageJson.js")))
         _file.setContent(jsStr);
                console.log("成功将JS转义");
            ret.pkg[_file.subpath] = _file;
           ret.map.res[ _file.subpath.replace(/^\//,'') ] = {
        'uri': opt.hash ? _file.getUrl(opt.hash, opt.domain) : _file.subpath,
        'type':'js',
        'has':'',
        'deps': []
    };
       

        }
    

        if(/style\.less$/.test(subpath)){ //PAGE.JS处理
                
               
                //将JS文件进行字符串处理
                //提取原始文件
        var cssStr=file._content.replace(/\r\n/g,"")
            cssStr=cssStr.replace(/\n/g,"")
            cssStr=cssStr.replace(/\\/g,"\\\\")
            cssStr=cssStr.replace(/"/g,"\\\"")
          

            cssStr="var cssFile={\"str\":\""+cssStr+"\"}"
            console.log("成功将css转义");
          // 将得到的字符串作为JS文件，保存到文件夹
          var _file = fis.file(fis.project.getProjectPath(options.output+"css/styleJson.css"));
         console.log(fis.file(fis.project.getProjectPath(options.output+"css/styleJson.css")))
         _file.setContent(cssStr);
            ret.pkg[_file.subpath] = _file;
           ret.map.res[ _file.subpath.replace(/^\//,'') ] = {
        'uri': opt.hash ? _file.getUrl(opt.hash, opt.domain) : _file.subpath,
        'type':'js',
        'has':'',
        'deps': []


        }
        }
    });



   
};
