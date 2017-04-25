var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true,
    state: true,
    down: false
};

exports.events = {
    'click details-*': 'details',
    'click button-*': 'togglePage',
    'click icon-*': 'expertToggleIcon',
    'click topic-icon-*': 'topicsToggleIcon'
};

exports.handlers = {
    details: function(id, e, target) {
        var region,
            data;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, data[1]);
        if (id.indexOf(',') !== -1) {
            data = id.split(',');
            region.show('ask/myquiz/details', { id: data[1] });
        }
    },
    togglePage: function(id) {
        var div1;
        var div2;
        div1 = $(this.$('page1'));
        div2 = $(this.$('page2'));
        if (id === '1') {
            div2.show().siblings().hide();
        }
        if (id === '2') {
            div1.show().siblings().hide();
        }
    },
    expertToggleIcon: function(id) {
        var that;
        var item = this.$('expert-item' + id);
        if (item.value === '') {
            this.$('expert-item' + id).value = id;
        } else if (item.value !== '') {
            this.$('expert-item' + id).value = '';
        }
        that = $(this.$('icon-' + id));
        that.toggleClass('icon-opacity0');
    },
    topicsToggleIcon: function(id) {
        var that;
        var item = this.$('topics-item' + id);
        if (item.value === '') {
            this.$('topics-item' + id).value = id;
        } else if (item.value !== '') {
            this.$('topics-item' + id).value = '';
        }
        that = $(this.$('topic-icon-' + id));
        that.toggleClass('icon-opacity0');
    }
};

exports.actions = {
    'click end': 'end'
};
exports.dataForActions = {
    end: function(payload) {
        var data = payload;
        var topics = [],
            expert = [];
        this.$$('input[name="topics"]').forEach(function(x) {
            var element = x || {};
            var value = element.value;
            topics.push(value);
        });
        this.$$('input[name="expert"]').forEach(function(x) {
            var element = x || {};
            var value = element.value;
            expert.push(value);
        });
        data.id = 1;
        if (topics.length > 0) {
            data.topics = topics.join(',');
        } else {
            data.topics = 'null';
        }
        if (expert.length > 0) {
            data.expert = expert.join(',');
        } else {
            data.expert = 'null';
        }
        return data;
    }
};

exports.actionCallbacks = {
};

exports.dataForTemplate = {
    trends: function(data) {
        var trends = data.trends;
        var me = this;
        _.forEach(trends, function(value) {
            var obj = value,
                url = { };
            if (typeof obj.member !== 'undefined') {
                url = obj.member.headPortrait;
                obj.member.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
            }
        });
        return trends;
    }
};
