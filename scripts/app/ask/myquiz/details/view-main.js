var D = require('drizzlejs');
var _ = require('lodash/collection');
// exports.type = 'dynamic';

exports.bindings = {
    state: false,
    details: true,
    down: false
};
exports.events = {
    'click discuss-answer-*': 'discussanswer',
    'click report-*': 'report',
    'click shareTo-*': 'shareTo'
};

exports.handlers = {
    discussanswer: function(id) {
        var region;
        var el = this.$('reply-' + id);
        if (el.style.display === 'none') {
            el.style.display = 'inline';
            region = new D.Region(this.app, this.module, el, id);
            region.show('ask/myquiz/reply', { id: id });
        } else {
            el.style.display = 'none';
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
        // var subject = this.bindings.page.findById(value[1]);
        var subject = this.bindings.details.id;
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
    'click close': 'close',
    'click boutique': 'boutique',
    'click discuss': 'discuss',
    'click discuss-top-*': 'discusstop',
    'click discuss-boutique-*': 'discussboutique',
    'click discuss-del-*': 'discussdel',
    'click enjoy-*': 'enjoy',
    'click praise-*': 'praise'
};

// actions绑定的方法调用前要干的事情
exports.dataForActions = {
    close: function(payload) {
        return payload;
    },
    boutique: function(payload) {
        var data = payload;
        data.concernType = 2;
        return data;
    },
    discuss: function(payload) {
        var data = payload;
        return data;
    },
    discussdel: function(payload) {
        return payload;
    },
    discusstop: function(payload) {
        return payload;
    },
    discussboutique: function(payload) {
        return payload;
    },
    replyanswer: function(payload) {
        return payload;
    },
    replydel: function(payload) {
        return payload;
    },
    enjoy: function(payload) {
        return payload;
    },
    report: function(payload) {
        return payload;
    },
    praise: function(payload) {
        var data = payload;
        data.objectType = 1;
        return payload;
    }
};

// actions绑定的方法调用后要干的事情
exports.actionCallbacks = {
    close: function() {
        this.app.message.success('问题关闭成功！');
        this.app.viewport.closeModal();
        this.module.dispatch('refreshquestions');
    },
    boutique: function() {
        this.app.message.success('关注成功！');
    },
    discuss: function(payload) {
        this.app.message.success('讨论发表成功！');
        this.module.dispatch('refresh', payload);
    },
    discussdel: function(payload) {
        this.app.message.success('讨论删除成功！');
        this.module.dispatch('refresh', payload);
    },
    discusstop: function(payload) {
        this.app.message.success('置顶成功！');
        this.module.dispatch('refresh', payload);
    },
    discussboutique: function(payload) {
        this.app.message.success('加精成功！');
        this.module.dispatch('refresh', payload);
    },
    enjoy: function(payload) {
        this.app.message.success('分享成功！');
        this.module.dispatch('refresh', payload);
    },
    report: function(payload) {
        this.app.message.success('举报成功！');
        this.module.dispatch('refresh', payload);
    }
};


exports.dataForTemplate = {
    details: function(data) {
        var obj = data,
            date = new Date(data.details.createTime);
        // console.log(data);
        var url = obj.details.member.headPortrait;
        // console.log(url);
        if (typeof url === 'undefined' || url === null || url === '') {
            obj.details.member.headPortrait = 'images/default-userpic.png';
        } else {
            obj.details.member.headPortrait = this.bindings.down.getFullUrl() + '?id=' + url;
        }
        obj.details.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        + '   ' + date.getHours() + ':' + date.getMinutes();
        return obj.details;
    }
};
