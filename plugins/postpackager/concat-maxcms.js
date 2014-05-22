var fis = require('fis');
var colors = require('colors');

/**
 * 专门用于兼容maxcms的打包处理
 */
module.exports = function(ret, conf, settings, opt){
    console.log('concat-maxcms:');

    var VAR_REG = /<%=(.*)%>/;

    var pack_opt = fis.config.get('maxcms-pack');
    var content='';
    var has_arr = [];
    for(var item in pack_opt){
        content='';

        var _files = pack_opt[item].files;
        for(var i in _files){
            var _filepath = _files[i];

            if(VAR_REG.test(_filepath)){
                _filepath = _filepath.match(VAR_REG)[1];
                _filepath = fis.config.get(_filepath);

                var file = ret.pkg[_filepath];
                if(file){
                    content += file.getContent();
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

//            ret.map.pkg[item] = {
//                'uri': pack_opt[item].release,
//                'type':'js',
//                'has':has_arr
//            };
            ret.map.res[ pack_opt[item].release.replace(/^\//,'') ] = {
                'uri': opt.hash ? file.getUrl(opt.hash, opt.domain) : pack_opt[item].release,
                'type':'js',
                'has':has_arr
            };
        }
    }
};
