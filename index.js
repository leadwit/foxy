var fis = module.exports = require('fis');
var art = require('./plugins/postpackager/parser-art-template'),
    coffee = require('./plugins/prepackager/parser-coffee'),
    concat = require('./plugins/postpackager/concat-maxcms'),
    browsermap = require('./plugins/postpackager/browser-map'),
    chromefile = require('./plugins/postpackager/create-chrometools');

fis.require.prefixes = [ 'fis-foxy', 'fis' ];
fis.cli.name = 'fis-foxy';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

fis.config.set('project.fileType.text', 'map');
fis.config.set('modules.prepackager', [coffee]);
fis.config.set('modules.postpackager', [art , concat, browsermap, chromefile]);
fis.config.set('livereload.port', '35729');     //修改FIS的livereload默认端口


//更多配置
fis.config.merge({
    roadmap : {
        ext : {
            //less后缀的文件将输出为css后缀
            //并且在parser之后的其他处理流程中被当做css文件处理
            less : 'css',
            //md后缀的文件将输出为html文件
            //并且在parser之后的其他处理流程中被当做html文件处理
            md : 'html'
        }
        ,
        path : [
            //发布一些前端使用的文件
            {
                reg : 'css/**',
                release : '/dist/FE/$&'
            },
            {
                reg : 'js/page.js',
                release : '/dist/FE/$&'
            },

            //发布一些后端使用的文件
            {
                reg : /js\/(ui|ppvideo_detect)\.js/,
                release : '/dist/BE/$1'
            }
            ,
            {
                reg : 'maxcms.js',
                release : '/dist/BE/$&'
            }
//            ,
//            {
//                reg : '/pkg/template.min.js',
//                release : '/dist/BE/template.min.js'
//            }
        ]
    }
    ,
    project : {
        include: /^(\/coffee|\/css|\/js|\/spider|\/art)\//
        ,exclude: /(\.map$|^\/css\/images\/)/
    },
    modules : {
        parser:{
            //less后缀的文件使用fis-parser-less插件编译
            //处理器支持数组，或者逗号分隔的字符串配置
            less : ['less']
        }
        ,
        optimizer : {
            //js后缀文件会经过fis-optimizer-uglify-js插件的压缩优化
            js : 'uglify-js'
        }
    }
    ,
    settings : {
        optimizer: {
            'uglify-js': {
                mangle: {
                    //不要压缩require关键字，否则seajs会识别不了require
//                    except: [ 'require' ]
                }
            }
        }
    }
});

