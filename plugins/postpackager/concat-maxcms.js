var fis = require('fis');
//var colors = require('./colors');

/**
 * 专门用于兼容maxcms的打包处理
 */
module.exports = function(ret, conf, settings, opt){
    console.log('concat-maxcms:');

    var VAR_REG = /<%=(.*)%>/;

    var content='';
    var pack_opt = fis.config.get('maxcms-pack');
    for(var item in pack_opt){
        content='';

        for(var i in pack_opt[item]){
            var _filepath = pack_opt[item][i];
            if(VAR_REG.test(_filepath)){
                _filepath = _filepath.match(VAR_REG)[1];
                _filepath = fis.config.get(_filepath);

                var file = ret.pkg[_filepath];
            }else{
                var file = fis.file(fis.project.getProjectPath(_filepath));
            }
            if(file){
                content += file.getContent();
            }
        }

        if(content){
            var file = fis.file(fis.project.getProjectPath(item));
            file.setContent(content);
            fis.compile(file);

            ret.pkg[file.subpath] = file;

//            console.log(colors.green("• ") + file.subpath);
            console.log("• " + file.subpath);
        }
    }
};
