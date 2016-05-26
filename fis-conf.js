var fs = require('fs');
//配置路径
var local = {
    defaults: {
        deployTo: './build'
    }
}

//deploy 使用
var debug = false;

//dev
(function(fis, name, local) {
    var domain = './'
    publicConfig(fis, name, local, domain);
    // var me = fis.media(name);

})(fis, 'dev', local);



function publicConfig(fis, name, local, domain) {
    var me = fis.media(name);

    fis.set('project.ignore', [
        'output/**',
        'node_nodules/**',
        '.git/**',
        '.svn/**',
        '.gitignore',
        'tool/**',
        'demo/**',
        '.idea/**',
        'README.md',
        'fis-conf.js'
    ]);
    //不发布的文件和文件夹
    me.match('{build/**,package.json}', {
        release: false
    });

    //modules.prepackager 标准化预处理器插件，可以根据 文件后缀 对文件进行预处理。

    //modules.postprocessor 在fis对js、css和类html文件进行语言能力扩展之后调用的插件配置，可以根据 文件后缀 对文件进行后处理。该阶段的插件可以获取文件对象的完整requires信息。


    //modules.prepackager 打包预处理插件。


    //modules.packager 打包处理插件。 fis内置了打包插件 fis-packager-map，生成 map.json 文件
    me.match('::package', {
        //packager: fis.plugin('map'),
        spriter: fis.plugin('csssprites', {
            layout: 'matrix',
            margin: '20'
        })
    });


    //追加文本文件后缀列表。fis系统在编译时会对文本文件和图片类二进制文件做不同的处理
    fis.set('project.fileType.text', 'handlebars,hbs');
    //handlebars
    me.match('{**.handlebars,**.hbs}', {
        parser: 'handlebars',
        rExt: 'js'
    })
    //sass
    fis.match('{**.sass,**.scss}', {
        parser: fis.plugin('node-sass'), // invoke `fis-parser-sass`,
        rExt: '.css'
    });

    me.match('**.{js,css,scss,png,jpg}', {
        domain: domain
    });

    //pack

    var simplePack = {}
    //构建合并的css列表
    //构建合并的css列表
    var cssList = scanFolder('css/pkg').files;
    var base = ["css/normalize.css","css/config.scss", "css/base.scss"]
    simplePack['css/style.css'] = base.concat(cssList);



    fis.config.merge({
        pack : simplePack
    });

    var to;
    if(debug) {
        to = local.defaults.deployTo + '/' + name
    } else {
        to = local[name] ? local[name].deployTo : local.defaults.deployTo
    }
    //deploy
    me.match('*', {
        deploy: fis.plugin('local-deliver', {
            to: to
        })
    })
}

function scanFolder(path) {
    var fileList = [],
        folderList = [],
        walk = function(path, fileList, folderList){
            var files = fs.readdirSync(path);

            files.forEach(function(item) {
                var tmpPath = path + '/' + item,
                    stats = fs.statSync(tmpPath);

                if (stats.isDirectory()) {
                    walk(tmpPath, fileList, folderList);

                    folderList.push(tmpPath);
                } else {
                    fileList.push('/' + tmpPath);
                }
            });
        };

    walk(path, fileList, folderList);

    //console.log('扫描' + path +'成功');

    return {
        'files': fileList,
        'folders': folderList
    }
}
