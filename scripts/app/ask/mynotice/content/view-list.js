var _ = require('lodash');
var $ = require('jquery');

exports.type = 'dynamic';
exports.bindings = {
    content: true,
    page: true,
    down: false
};

exports.events = {
    // 'click myquiz-details-*': 'showDetails',
    'click discuss-*': 'discuss',
    'click trend-report-*': 'report',
    'click shareTo-*': 'shareTo',
    // 'click myshares-details-*': 'sharesDetails',
};

exports.handlers = {
    // sharesDetails: function(payload) {
    //     var data = { },
    //         id = payload;
    //     $('.dialog-main').unbind('scroll');
    //     this.app.viewport.closeModal();
    //     if (id.indexOf('_') !== -1) {
    //         data = id.split('_');
    //         this.app.show('content', 'ask/myshares/details', { id: data[1] });
    //     }
    // },
    // showDetails: function(payload) {
    //     var data = { },
    //         id = payload;
    //     $('.dialog-main').unbind('scroll');
    //     this.app.viewport.closeModal();
    //     if (id.indexOf('_') !== -1) {
    //         data = id.split('_');
    //         this.app.show('content', 'ask/myquiz/details', { id: data[1] });
    //     }
    // },
    discuss: function(payload) {
        $(this.$('comment-reply-' + payload)).toggleClass('show');
    },
    report: function(payload) {
        var id = payload,
            data = { };
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.viewport.modal(this.module.items['ask/report'], { id: data[1], objectType: data[0] });
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
            }
        }
    }
};
exports.actions = {
    'click trend-follow-*': 'follow',
    'click trend-unfollow-*': 'unfollow',
    'click publish-*': 'publish',
    'click reply-*': 'reply',
    'click praise-*': 'praise',
    'click unpraise-*': 'unpraise',
    'click del-question-*': 'delquestion',
    'click del-share-*': 'delshare',
    'click del-discuss-*': 'deldiscuss'
};

exports.dataForActions = {
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
    delquestion: function(payload) {
        var data = payload;
        data.auditType = '1';
        return data;
    },
    delshare: function(payload) {
        var data = payload;
        data.auditType = '2';
        return data;
    },
    deldiscuss: function(payload) {
        var data = payload;
        data.auditType = '3';
        return data;
    },
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
    publish: function(payload) {
        return payload;
    },
    reply: function(payload) {
        return payload;
    }
};
exports.actionCallbacks = {
    reply: function() {
        this.app.message.success('操作成功！');
        this.module.dispatch('init');
    },
    publish: function() {
        this.app.message.success('操作成功！');
        this.module.dispatch('init');
    },
    follow: function() {
        this.app.message.success('关注成功！');
        this.module.dispatch('init');
    },
    // unfollow: function(data) {
    //     this.app.message.success('取消成功！');
    //     this.module.dispatch('refresh', { data: data[0] });
    // },
    delquestion: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    },
    delshare: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    },
    deldiscuss: function() {
        this.app.message.success('删除成功！');
        this.module.dispatch('init');
    }
};

exports.dataForTemplate = {
    page: function(data) {
        var trends = data.content.trendsList;
        var page = this.bindings.page.data;
        var me = this;
        var flag = true;
        if (_.isEmpty(trends)) {
            page.trendsListFlag = true;
        } else {
            page.trendsListFlag = false;
        }
        _.forEach(trends, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            var url = obj.createUser.headPortrait;
            obj.concernNum = date.concernNum + '';
            obj.createUser.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.createUser.headPortrait = 'images/default-userpic.png';
            } else {
                obj.createUser.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
            }
            obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
            _.forEach(me.bindings.page.data, function(v) {
                if (v.id === obj.id) {
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
    $('.dialog-main').unbind('scroll');
};
