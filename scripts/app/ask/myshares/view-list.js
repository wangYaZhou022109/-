var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    myshares: true,
    page: true,
    down: false
};

exports.events = {
    'click myshares-details-*': 'showDetails',
    'click discuss-*': 'discuss',
    'click shareTo-*': 'shareTo',
    'click myshares-sharedetails-*': 'showShare'
};

exports.handlers = {
    showDetails: function(payload) {
    //    // var region,
    //    //     data = { };
    //    // var el = $(target).parents('.comment-list')[0];
    //     var data = { },
    //         id = payload;
    //     // console.log(payload);
    //     if (id.indexOf('_') !== -1) {
    //         data = id.split('_');
    //         // region = new D.Region(this.app, this.module, el, data[1]);
    //         // region.show('ask/myquiz/details', { id: data[1] });
    //         this.app.show('content', 'ask/myshares/details', { id: data[1] });
    //     }
        this.app.show('content', 'ask/myshares/sharedetails', { id: payload });
    },
    showShare: function(payload) {
       // var region,
       //     data = { };
       // var el = $(target).parents('.comment-list')[0];
        var data = { },
            id = payload;
        // console.log(payload);
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            // region = new D.Region(this.app, this.module, el, data[1]);
            // region.show('ask/myquiz/details', { id: data[1] });
            this.app.show('content', 'ask/myshares/sharedetails', { id: data[1] });
        }
    },
    discuss: function(payload) {
        $(this.$('comment-reply-' + payload)).toggleClass('show');
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
    'click report-*': 'report',
    'click trend-follow-*': 'follow',
    'click trend-unfollow-*': 'unfollow',
    'click del-question-*': 'shut',
    'click publish-*': 'publish',
    'click praise-*': 'praise',
    'click unpraise-*': 'unpraise',
};

exports.dataForActions = {
    follow: function(payload) {
        var id = payload.id,
            data = {};
        var obj = id.split('_');
        data.id = obj[1];
        data.concernType = obj[0];
        return data;
    },
    unfollow: function(payload) {
        var id = payload.id,
            data = {};
        var obj = id.split('_');
        data.id = obj[1];
        data.concernType = obj[0];
        return data;
    },
    shut: function(payload) {
        var data = payload;
        var me = this;
        data.auditType = '2';
        return this.Promise.create(function(resolve) {
            var message = '文章删除后将无法恢复，是否确定删除该文章？';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
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
    follow: function(data) {
        var concern = data[0];
        var unfollow = this.$('trend-unfollow-' + concern.concernType + '_' + concern.concernId);
        var follow = this.$('trend-follow-' + concern.concernType + '_' + concern.concernId);
        var me = this;
        follow.hidden = true;
        unfollow.hidden = false;
        setTimeout(function() {
            me.app.message.success('关注成功！');
            me.module.dispatch('refresh');
        }, 1000);
    },
    unfollow: function(data) {
        var concern = data[0];
        var unfollow = this.$('trend-unfollow-' + concern.concernType + '_' + concern.concernId);
        var follow = this.$('trend-follow-' + concern.concernType + '_' + concern.concernId);
        var me = this;
        follow.hidden = false;
        unfollow.hidden = true;
        setTimeout(function() {
            me.app.message.success('取消成功！');
            me.module.dispatch('refresh');
        }, 1000);
    },
    shut: function(data) {
        var trends = data[0];
        this.app.message.success('删除成功！');
        this.module.dispatch('delrefresh', { id: trends.id, trendsType: 2 });
    },
    publish: function() {
        this.app.message.success('操作成功！');
        this.module.dispatch('page');
    },
    praise: function() {
        this.app.message.success('点赞成功！');
    },
    unpraise: function() {
        this.app.message.success('取消点赞成功！');
    }
};
exports.dataForTemplate = {
    page: function(data) {
        var myshares = data.myshares;
        var page = this.bindings.page.data;
        var me = this;
        _.forEach(myshares, function(value) {
            var obj = value,
                url = obj.member.headPortrait;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.member.headPortrait = 'images/default-userpic.png';
            } else {
                obj.member.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
            }
            page.push(obj);
        });
        return page;
    },
    countNum: function(data) {
        return data.page.length || 0;
    }
};

exports.beforeClose = function() {
    $(window).unbind('scroll');
};

