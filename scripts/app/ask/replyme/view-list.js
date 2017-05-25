var D = require('drizzlejs');
var _ = require('lodash/collection');
var $ = require('jquery');
exports.type = 'dynamic';
exports.bindings = {
    params: false,
    page: true,
    replyme: true,
    down: false,
};

exports.events = {
    'click myreply-details-*': 'showDetails',
    'click myreply-sharedetails-': 'showShareDetails',
    'click report-*': 'report',
    'click shareTo-*': 'shareTo',
    'click discuss-*': 'discuss',
};

exports.handlers = {
    discuss: function(payload) {
        $(this.$('comment-reply-' + payload)).toggleClass('show');
    },
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/replyme/mydetail', { id: id });
    },
    showDetails: function(payload) {
        var data = { },
            id = payload;
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.show('content', 'ask/myquiz/details', { id: data[1] });
        }
    },
    showShareDetails: function(payload) {
        var data = { },
            id = payload;
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.show('content', 'ask/myshares/details', { id: data[1] });
        }
    },
    report: function(payload) {
        var id = payload,
            data = { };
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.viewport.modal(this.module.items['ask/report'], {
                id: data[1],
                objectType: data[0],
                beUserId: data[2] });
        }
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
    'click del2-*': 'shut2',
    'click concern-*': 'concern',
    'click enjoy-*': 'enjoy',
    'click publish-*': 'publish',
    'click praise-*': 'praise',
    'click unpraise-*': 'unpraise',
};

exports.dataForActions = {
    // shut1: function(data) {
    //     var me = this;
    //     return this.Promise.create(function(resolve) {
    //         var message = '确定要删除该数据?';
    //         me.app.message.confirm(message, function() {
    //             resolve(data);
    //         }, function() {
    //             resolve(false);
    //         });
    //     });
    // },
    // shut2: function(data) {
    //     var me = this;
    //     return this.Promise.create(function(resolve) {
    //         var message = '确定要删除该数据?';
    //         me.app.message.confirm(message, function() {
    //             resolve(data);
    //         }, function() {
    //             resolve(false);
    //         });
    //     });
    // },
    shut1: function(payload) {
        var data = payload;
        return data;
    },
    shut2: function(payload) {
        var data = payload;
        return data;
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
        // this.module.dispatch('init');
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
