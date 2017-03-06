var D = require('drizzlejs');
var $ = require('jquery');
var _ = require('lodash/collection');
exports.type = 'dynamic';
exports.bindings = {
    trends: true
};

exports.events = {
    'click details-*': 'details',
    'click step-*': 'step'
};

exports.handlers = {
    step: function(id) {
        if (id === 'one') {
            this.$$('.step-one')[0].hidden = true;
            this.$$('.step-two')[0].hidden = false;
        } else if (id === 'two') {
            this.$$('.step-one')[0].hidden = false;
            this.$$('.step-two')[0].hidden = true;
        }
    },
    details: function(id, e, target) {
        var region,
            data;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, data[1]);
        if (id.indexOf(',') !== -1) {
            data = id.split(',');
            region.show('ask/myquiz/details', { id: data[1] });
        }
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
        this.$$('input[name="topics"]:checked').forEach(function(x) {
            var element = x || {};
            var value = element.value;
            topics.push(value);
        });
        this.$$('input[name="expert"]:checked').forEach(function(x) {
            var element = x || {};
            var value = element.value;
            expert.push(value);
        });
        data.id = 1;
        data.topics = topics.join(',');
        data.expert = expert.join(',');
        return data;
    }
};

exports.actionCallbacks = {
    end: function() {
        this.app.message.success('操作成功！');
        this.module.dispatch('init');
    }
};

exports.dataForTemplate = {
    trends: function(data) {
        var trends = data.trends;
        _.forEach(trends, function(value) {
            var obj = value,
                date = new Date(obj.createTime);
            obj.createTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + '   ' + date.getHours() + ':' + date.getMinutes();
        });
        return trends;
    }
};
