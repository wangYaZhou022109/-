var $ = require('jquery');
var _ = require('lodash/collection');
var sensitive = require('./app/util/sensitive');
exports.type = 'dynamic';
exports.bindings = {
    trends: true,
    page: true,
    down: false
};

exports.events = {
    'click myquiz-details-*': 'showDetails',
    'click discuss-*': 'discuss',
    'click trend-report-*': 'report',
    'click myshares-details-*': 'sharesDetails',
    'click shareTo-*': 'shareTo'
};

exports.handlers = {
    sharesDetails: function(payload) {
        var data = { },
            id = payload;
        $(window).unbind('scroll');
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.show('content', 'ask/myshares/details', { id: data[1] });
        }
    },
    showDetails: function(payload) {
        var data = { },
            id = payload;
        $(window).unbind('scroll');
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.show('content', 'ask/myquiz/details', { id: data[1] });
        }
    },
    discuss: function(payload) {
        $(this.$('comment-reply-' + payload)).toggleClass('show');
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
    'click trend-follow-*': 'follow',
    'click trend-unfollow-*': 'unfollow',
    'click publish-*': 'publish',
    'click reply-*': 'reply',
    'click del-question-*': 'delquestion',
    'click del-share-*': 'delshare',
    'click praise-*': 'praise',
    'click unpraise-*': 'unpraise',
    'click del-discuss-*': 'deldiscuss',
    'click close-discuss-*': 'closediscuss',
    'click close-question-*': 'closequestion'
};

exports.dataForActions = {
    closediscuss: function(payload) {
        var data = payload;
        data.closeStatus = 1;
        return data;
    },
    closequestion: function(payload) {
        var data = payload;
        data.closeStatus = 1;
        return data;
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
    delquestion: function(payload) {
        var data = payload;
        var me = this;
        data.auditType = '1';
        return this.Promise.create(function(resolve) {
            var message = '问题删除后将无法恢复，是否确定删除该問題？';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    },
    delshare: function(payload) {
        var data = payload,
            me = this;
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
    deldiscuss: function(payload) {
        var data = payload,
            me = this;
        data.auditType = '3';
        return this.Promise.create(function(resolve) {
            var message = '讨论删除后将无法恢复，是否确定删除该讨论？';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
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
        if (payload.t_content && sensitive.judge(payload.t_content) > 0) {
            this.app.message.error('您好，您发表的内容被系统检测到包含敏感词，请重新编辑，谢谢合作');
            return false;
        }
        return payload;
    },
    reply: function(payload) {
        if (payload.content && sensitive.judge(payload.content) > 0) {
            this.app.message.error('您好，您发表的内容被系统检测到包含敏感词，请重新编辑，谢谢合作');
            return false;
        }
        return payload;
    }
};
exports.actionCallbacks = {
    closediscuss: function() {
        this.app.message.success('关闭成功!');
        // this.module.dispatch('init');
    },
    closequestion: function() {
        this.app.message.success('关闭成功!');
        // this.module.dispatch('init');
    },
    reply: function() {
        this.app.message.success('发表成功，等待管理员审核！');
        this.module.dispatch('page');
    },
    publish: function() {
        this.app.message.success('发表成功，等待管理员审核！');
        this.module.dispatch('page');
    },
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
    delquestion: function() {
        this.app.message.success('删除成功！');
    },
    delshare: function() {
        this.app.message.success('删除成功！');
    },
    deldiscuss: function() {
        this.app.message.success('删除成功！');
    }
};

exports.dataForTemplate = {
    page: function(data) {
        var trends = data.trends;
        var page = this.bindings.page.data;
        var me = this;
        var flag = true;
        _.forEach(trends, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            var url = obj.createUser.headPortrait;
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var h = date.getHours();
            var mi = date.getMinutes();
            if (y <= 9) {
                y = '0' + y;
            }
            if (m <= 9) {
                m = '0' + m;
            }
            if (d <= 9) {
                d = '0' + d;
            }
            if (h <= 9) {
                h = '0' + h;
            }
            if (mi <= 9) {
                mi = '0' + mi;
            }
            obj.createTime = y + '-' + m + '-' + d + '   ' + h + ':' + mi;
            if (typeof url === 'undefined' || url === null || url === '') {
                obj.createUser.headPortrait = 'images/default-userpic.png';
            } else {
                obj.createUser.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
            }
            _.forEach(me.bindings.page.data, function(v) {
                if (v.id === obj.id) {
                    flag = false;
                }
            });
            if (flag) {
                if (obj.trendsType === '3') {
                    obj.show = 0;
                    if (obj.createUserId === obj.me) { // 是否为当前用户
                        if (obj.questionDiscuss.replyNum > 0) {
                            obj.show = 2;
                        } else {
                            obj.show = 1;
                        }
                    }
                } else {
                    obj.show = 0;
                    if (obj.createUserId === obj.me) { // 是否为当前用户
                        if (obj.question.discussNum > 0) {
                            obj.show = 2;
                        } else {
                            obj.show = 1;
                        }
                    }
                    if (obj.question !== null && obj.question.closeStatus) {
                        obj.show = 3;
                    }
                }
                page.push(obj);
            }
        });
        return page;
    }
};

