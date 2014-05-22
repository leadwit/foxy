/**
 * Created by linwenlong on 5/20/14.
 */
var fis = require('fis');
var coffee = require('coffee-script');
var colors = require('colors');

module.exports = function(ret, conf, settings, opt){
    console.log('parser-coffee:');

    var pack = fis.config.get('coffee.pack', {});
    var options = fis.config.get('coffee.settings', {});
    var content = '';
    var has_arr = [];

    if(pack.files && pack.files.length){
        pack.files.forEach(function(path){


            var file = ret.src['/' + path.replace(/^\//, '')];
            if(file){
                console.log("• ".green + file.subpath);

//                has_arr.push( opt.hash ? file.getUrl(opt.hash, opt.domain) : file.subpath);
                has_arr.push( file.subpath.replace(/^\//,'') );

                content += file.getContent() + '\n';
                if(opt.pack) {      //打包时不发布源文件
                    file.release = false;
                    delete ret.src[file.subpath];
                }
            } else {
                fis.log.warning('missing file [' + path + ']');
            }
        });
    }

    //create pack file
    var file = fis.file(fis.project.getProjectPath(pack.release || '/pkg/coffee.js'));
    options.filename = file.subpath;
    content = coffee.compile(content, options);
    if(options.sourceMap) {
        var sourceMap = JSON.stringify(content.sourceMap);
        if(opt.optimize && opt.pack){     //优化 且 打包 时，生成map文件
            var sourceMapFile = fis.file(file.realpathNoExt + '.map');
            sourceMapFile.setContent(sourceMap);
            ret.pkg[sourceMapFile.subpath] = sourceMapFile;
            //content.js += '//@ sourceMappingURL=' + sourceMapFile.getUrl(opt.hash, opt.domain);
        }
        content = content.js;
    }
    file.setContent(content);
    fis.compile(file);

    if(opt.optimize && opt.pack) {     //优化 且 打包 时，写入map链接
        content = file.getContent() + '//@ sourceMappingURL=' + sourceMapFile.getUrl(opt.hash, opt.domain);
        file.setContent(content);
    }
    ret.pkg[file.subpath] = file;

    ret.map.res[ pack.release.replace(/^\//,'') ] = {
        'uri': opt.hash ? file.getUrl(opt.hash, opt.domain) : pack.release,
        'type':'js',
        'has':has_arr
    };
//    ret.map.pkg[pack.release.substring(pack.release.lastIndexOf('/')+1) ] = {
//        'uri': opt.hash ? file.getUrl(opt.hash, opt.domain) : pack.release,
//        'type':'js',
//        'has':has_arr
//    };
};