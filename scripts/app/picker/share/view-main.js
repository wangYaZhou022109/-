var _ = require('lodash/collection');

exports.bindings = {
    shareTemplate: false,
    share: ''
};

exports.events = {
    'click shareTo-*': 'shareTo',
    'click askshare': 'showAskshare'
};

exports.handlers = {
    shareTo: function(data) {
        var me = this,
            shareTemplate = this.bindings.shareTemplate.data,
            templateContent = '',
            templateCode = data,
            options = me.bindings.share.data.data,
            webUrl = window.location.protocol + '//' + window.location.host, // 域名加端口
            id = options.id, // 分享对象id
            type = options.type, // 分享类型
            pics = options.pics, // 图片，多图传数组 ['','']
            title = options.title, // 分享内容的标题
            typeName = '',
            fullUrl = '',
            pic = '';// 图片地址
        // 1:课程分享2:学习路径3:知识分享4:班级分享5:调研分享6:微课大赛分享7:考试分享8:专题分享9:直播分享10问吧问题11问吧讨论',
        if (type === '1') {
            typeName = '【课程】';
        } else if (type === '2') {
            typeName = '【学习路径】';
        } else if (type === '3') {
            typeName = '【知识】';
        } else if (type === '4') {
            typeName = '【班级】';
        } else if (type === '5') {
            typeName = '【调研】';
        } else if (type === '6') {
            typeName = '【微课大赛】';
        } else if (type === '7') {
            typeName = '【考试】';
        } else if (type === '8') {
            typeName = '【专题】';
        } else if (type === '9') {
            typeName = '【直播】';
        } else if (type === '10') {
            typeName = '【问题】';
        } else if (type === '11') {
            typeName = '【讨论】';
        }
        if (pics) {
            if (pics instanceof Array && pics.length > 0) {
                _.forEach(pics, function(p) {
                    if (p.indexOf('default_') > 0) {
                        pic += webUrl + '/' + p;
                    } else {
                        pic += webUrl + '/api/v1/human/file/download?id=' + p;
                    }
                    pic += '|';
                });
                if (pics.length > 0) {
                    pic = pic.substring(0, pic.length - 1);
                }
            } else if (pics.indexOf('default_') > 0) {
                pic += webUrl + '/' + pics;
            } else {
                pic += webUrl + '/api/v1/human/file/download?id=' + pics;
            }
        }
        _.forEach(shareTemplate, function(obj) {
            var template = obj;
            if (template.code === templateCode) {
                templateContent = template.content;
            }
        });
        if (templateCode === 'qzone') { // QQ空间分享
            fullUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
            fullUrl += 'title=' + typeName + ' ' + title;
            fullUrl += '&desc=' + templateContent;
            fullUrl += '&url=' + encodeURIComponent(webUrl + '/#/share/' + id + '/' + type);
            if (pic) {
                fullUrl += '&pics=' + pic;
            }
            window.open(fullUrl, '_blank');
        } else if (templateCode === 'weibo') { // 新浪微博分享
            fullUrl = 'http://v.t.sina.com.cn/share/share.php?';
            fullUrl += 'title=' + templateContent + ' ' + typeName + ' ' + title;
            fullUrl += '&url=' + encodeURIComponent(webUrl + '/#/share/' + id + '/' + type);
            if (pic) {
                fullUrl += '&pic=' + pic;
            }
            fullUrl += '&appkey=3697029777';
            window.open(fullUrl, '_blank');
        } else if (templateCode === 'bar') { // 分享到问吧
            // me.app.viewport.modal(me.module.items.bar, {
            //    shareObjId: id,
            //    shareType: type
            // });
        }
    },
    showAskshare: function() {
        var view = this.module.items['picker/share/askshare'];
        var options = this.bindings.share.data.data;
        var id = options.id; // 分享对象id
        var type = options.type; // 分享类型
        this.app.viewport.modal(view, { shareObjectId: id, shareType: type });
    }
};
