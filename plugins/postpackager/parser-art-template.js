var fis = require('fis');
var tmodjs = require('tmodjs');

module.exports = function(ret, conf, settings, opt){
    console.log('parser-art-template:');

    var options = fis.config.get('art-template', {});
    var target = '/'+ options.target.replace(/^\//, '').replace(/\/$/, '') +'/';
    var has_arr = [];
    if(opt.optimize && !options.minify) {     //优化时，生成minify文件
        options.minify = opt.optimize;
    }

    var temp_art_output = fis.project.getTempPath() +'/art';     //输出到临时目录
    var final_output = '/'+ options.output.replace(/^\//, '').replace(/\/$/, '') +'/';      //预编译得到的模板文件的最终输出目录

    options.output = temp_art_output;
    new tmodjs(options.target, options).compile();      //编译模块。v1.0.0以后，可以有多个实例。
    options.output = final_output;

    //编译完后，删除模板文件
    fis.util.map(ret.src,function(subpath, file, index){
        if( subpath.indexOf(target) == 0 ){
            if(!/\.json$/.test(subpath)){
                has_arr.push(subpath);
            }

            file.release = false;
            delete ret.src[file.subpath];
        }
    });

    var _tmp_file = fis.file(temp_art_output +'/'+ options.runtime);
    var _file = fis.file(fis.project.getProjectPath(options.output + options.runtime));
    _file.setContent(_tmp_file.getContent());
    ret.pkg[_file.subpath] = _file;

    ret.map.pkg[options.runtime] = {
        'uri':_file.subpath,
        'type':'js',
        'has':has_arr,
        'deps': ['art-template']
    };
};
