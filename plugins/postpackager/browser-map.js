var fis = require('fis');

/**
 * 生成浏览器插件用的map
 */
module.exports = function(ret, conf, settings, opt){
    console.log('browser-map.');
    ret.map['browser-map'] = fis.config.get('browser.map');
};
