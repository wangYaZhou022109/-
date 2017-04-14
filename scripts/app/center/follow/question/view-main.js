var _ = require('lodash/collection'),
    $ = require('jquery'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    list: true,
    img: false
};

exports.events = {
    'click discuss*': 'discuss',
    'click myquiz-details-*': 'showDetails',
    'click report-*': 'report',
};

exports.handlers = {
    discuss: function(payload) {
        $(this.$('comment-reply-' + payload)).toggleClass('show');
    },
    showDetails: function(payload) {
        this.app.show('content', 'ask/myquiz/details', { id: payload });
    },
    report: function(payload) {
        var id = payload,
            data = { };
        if (id.indexOf('_') !== -1) {
            data = id.split('_');
            this.app.viewport.modal(this.module.items['ask/report'], {
                id: data[0],
                objectType: '1',
                beUserId: data[1] });
        }
    }
};

exports.actions = {
    'click unfollow*': 'unfollow',
    'click publish-*': 'publish'
};

exports.dataForActions = {
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
    }
};

exports.actionCallbacks = {
    unfollow: function() {
        this.app.message.success('取消成功！');
        this.module.dispatch('init');
    },
    publish: function() {
        this.app.message.success('发布成功！');
        this.module.dispatch('init');
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'list' }
}, function() { // 分享组件
    var data = {},
        question = this.bindings.list.data[0];
    if (question) {
        data.id = question.id;
        data.type = '3';
        data.pics = 'images/default-cover/default_course.jpg';
        data.title = question.name;
    }
    return {
        id: 'share',
        name: 'picker',
        options: {
            picker: 'share',
            data: data
        }
    };
}];

exports.dataForTemplate = {
    list: function(data) {
        var list = data.list,
            downUrl = this.bindings.img.getFullUrl();
        _.map(list, function(opt) {
            var obj = opt;
            obj.member.headPortrait = !obj.member.headPortrait ? 'images/default-userpic.png' : downUrl + obj.member.headPortrait; // eslint-disable-line max-len
            obj.typeName = obj.type === '1' ? '·提问·' : '·分享·';
            obj.prefixText = helpers.dateMinute(obj.createTime);
            obj.discussTxt = '评论(' + obj.discussNum + ')';
            obj.contentImg = 'images/1.png';
        });
        return list;
    }
};
