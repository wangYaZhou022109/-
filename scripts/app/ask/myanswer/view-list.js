var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    myreply: true,
    page: true,
    down: false
};

exports.events = {
    'click myquiz-details-*': 'showDetails',
    'click shareTo-*': 'shareTo'
};

exports.handlers = {
    showDetails: function(payload) {
        var data = { },
            id = payload;
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.show('content', 'ask/myquiz/details', { id: data[1] });
        }
    },
    shareTo: function(data) {
        var value = data.split('_');
        var subject = this.bindings.page.findById(value[1]);
        var templateContent = '',
            templateCode = value[0],
            webUrl = window.location.protocol + '//' + window.location.host, // 域名加端口
            id = subject.id, // 分享对象id
            type = subject.shareType, // 分享类型
            pics = subject.thumbnail || 'images/default-cover/default_spceial.jpg', // 图片，多图传数组 ['','']
            title = subject.title, // 分享内容的标题
            typeName = '',
            fullUrl = '',
            pic = '';// 图片地址
        if (subject) {
            if (type === '1') {
                typeName = '【问题】';
            } else if (type === '2') {
                typeName = '【文章】';
            } else if (type === '3') {
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
            templateContent = subject.content;
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
        }
    }
};

exports.actions = {
    'click remove-*': 'remove',
};

exports.dataForActions = {
    remove: function(payload) {
        var data = payload;
        data.auditType = '3';
        return data;
    }
};

exports.actionCallbacks = {
    remove: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    }
};

exports.dataForTemplate = {
    // myreply: function(data) {
    //     var trends = data.myreply;
    //     _.forEach(trends, function(value) {
    //         var obj = value,
    //             date = new Date(obj.createTime);
    //         obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    //         + '   ' + date.getHours() + ':' + date.getMinutes();
    //     });
    //     return trends;
    // },
    page: function(data) {
        var trends = data.myreply;
        var page = this.bindings.page.data;
        var me = this;
        var flag = true;
        _.forEach(trends, function(value) {
            var obj = value,
                date = new Date(obj.questionDiscuss.createTime),
                replyNum = obj.questionDiscuss.replyNum;
            var url = obj.member.headPortrait;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.member.headPortrait = 'images/default-userpic.png';
            } else {
                obj.member.headPortrait = this.bindings.down.getFullUrl() + '?id=' + url;
            }
            if (replyNum === null) {
                obj.questionDiscuss.replyNum = 0;
            }
            obj.questionDiscuss.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
            _.forEach(me.bindings.page.data, function(v) {
                if (v.id === obj.questionDiscuss.id) {
                    flag = false;
                }
            });
            if (flag) {
                page.push(obj);
            }
        });
        return page;
    }
};

exports.beforeClose = function() {
    $(window).unbind('scroll');
};
