var fis = require('fis');
var colors = require('colors');

/**
 * 专门用于兼容maxcms的打包处理
 */
module.exports = function(ret, conf, settings, opt){
    console.log('maxcms-module:');

    var VAR_REG = /<%=(.*)%>/,
    	VAR_REG2 = /\/\*\/\*\.js/gi;

    var pack_opt = fis.config.get('maxcms-module');
    var content='';
    var has_arr = [];
    for(var item in pack_opt){
        content='';

        var _files = pack_opt[item].files;
        for(var i in _files){
            var _filepath = _files[i];
            console.log(_filepath);
            if(VAR_REG2.test(_filepath)){
                var matches = _filepath.match(VAR_REG2);
                var moduleFolder = _filepath.replace(matches[0].substr(1),"");
                var jsFiles = fis.util.find(fis.project.getProjectPath(moduleFolder), /.*\.js/);
                for(var _j = 0;_j < jsFiles.length;_j++){
                	var file = fis.file(jsFiles[_j]);
                	console.log(jsFiles[_j]);
                	if(file && jsFiles[_j].indexOf('app.js') < 0){
                		content += file.getContent();
                	}
                }
                
            }else{
                var file = fis.file(fis.project.getProjectPath(_filepath));
                if(file){
                    content += file.getContent();
                }
            }

            has_arr.push( _filepath.replace(/^\//,'') );
        }

        if(content){
            var file = fis.file(fis.project.getProjectPath(pack_opt[item].release));
            file.setContent(content);
            fis.compile(file);
            ret.pkg[file.subpath] = file;
            console.log("• ".green + file.subpath);

            ret.map.res[ pack_opt[item].release.replace(/^\//,'') ] = {
                'uri': opt.hash ? file.getUrl(opt.hash, opt.domain) : pack_opt[item].release,
                'type':'js',
                'has':has_arr
            };
        }
    }
};
