var D = require('drizzlejs');
var _ = require('lodash/collection');
var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    params: false,
    myreply: true,
    page: true,
    down: false,
};

exports.events = {
    'click myreply-details-*': 'showDetails',
    'click discuss-*': 'discuss',
    'click shareTo-*': 'shareTo',
    'click myreply-sharedetails-*': 'showshareDetails'
};

exports.handlers = {
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.comment-list')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/myquiz/details', { id: id });
    },
    showshareDetails: function(payload) {
        var data = { },
            id = payload;
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.show('content', 'ask/myshares/details', { id: data[1] });
        }
    },
    showDetails: function(payload) {
        var data = { },
            id = payload;
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.show('content', 'ask/myquiz/details', { id: data[1] });
        }
    },
    discuss: function(payload) {
        $(this.$('comment-reply-' + payload)).toggleClass('show');
    },
    shareTo: function(data) {
        var value = data.split('_');
        var page = this.bindings.page;
        var subject = page.findById(value[1]);
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
    'click del1-*': 'shut1',
    'click publish-*': 'publish',
    'click praise-*': 'praise',
    'click unpraise-*': 'unpraise',
    'click del2-*': 'shut2',
};

exports.dataForActions = {
    shut1: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '讨论删除后将无法恢复，是否确定删除该讨论？';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
        // var data = payload;
        // return data;
    },
    shut2: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '回复删除后将无法恢复，是否确定删除该回复？';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
        // var data = payload;
        // return data;
    },
    publish: function(payload) {
        return payload;
    },
    praise: function(payload) {
        var data = {};
        var obj = payload.id.split('_');
        data.objectType = obj[0];
        data.id = obj[1];
        return data;
    },
    unpraise: function(payload) {
        var data = {};
        var obj = payload.id.split('_');
        data.objectType = obj[0];
        data.id = obj[1];
        return data;
    },
};

exports.actionCallbacks = {
    shut1: function() {
        this.app.message.success('删除成功！');
    },
    shut2: function() {
        this.app.message.success('删除成功！');
    },
    publish: function() {
        this.app.message.success('操作成功！');
    },
    praise: function() {
        this.app.message.success('点赞成功');
        this.module.dispatch('init');
    },
    unpraise: function() {
        this.app.message.success('取消点赞成功');
        this.module.dispatch('init');
    },
};

exports.dataForTemplate = {
    page: function(data) {
        var page = data.page;
        var me = this;
        // var flag = true;
        _.forEach(page, function(value) {
            var obj = value,
                url = obj.member.headPortrait;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.member.headPortrait = 'images/default-userpic.png';
            } else {
                obj.member.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
            }
        });
        return page;
    },
};
