var fis = module.exports = require('fis');
var coffee = require('coffee-script');

fis.require.prefixes = [ 'foxy', 'fis' ];
fis.cli.name = 'foxy';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

fis.config.set('project.fileType.text', 'map');

fis.config.set('modules.postpackager', function(ret, conf, settings, opt){
    var pack = fis.config.get('coffee.pack', {});
    var options = fis.config.get('coffee.settings', {});
    var content = '';
    if(pack.files && pack.files.length){
        pack.files.forEach(function(path){
            var file = ret.src['/' + path.replace(/^\//, '')];
            if(file){
                content += file.getContent() + '\n';
                if(opt.pack) {
                    file.release = false;
                    delete ret.src[file.subpath];
                }
            } else {
                fis.log.warning('missing file [' + path + ']');
            }
        });
    }
    
    //临时文件
    var a = fis.project.getTempPath('tmodjs/a.js');
    //console.log(a);
    
    //create pack file
    var file = fis.file(fis.project.getProjectPath(pack.release || '/pkg/main.js'));
    options.filename = file.subpath;
    content = coffee.compile(content, options);
    if(options.sourceMap) {
        var sourceMap = content.sourceMap;
        if(!opt.optimize && !opt.pack){
            var sourceMapFile = fis.file(file.realpathNoExt + '.map');
            sourceMapFile.setContent(sourceMap);
            ret.pkg[sourceMapFile.subpath] = sourceMapFile;
            content.js += '//@ sourceMappingURL=' + sourceMapFile.getUrl(opt.hash, opt.domain);
        }
        content = content.js;
    }
    file.setContent(content);
    fis.compile(file);

//    ret.pkg[file.subpath] = file;

    ret.map = fis.config.get('browser.map');
});