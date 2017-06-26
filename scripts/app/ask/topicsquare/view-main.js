var D = require('drizzlejs');
var _ = require('lodash/collection');
var $ = require('jquery');
exports.bindings = {
    state: true,
    topicname: true,
    topicType: true
    // down: false
};

exports.events = {
    'click apply-topic': 'showApplyTopic',
    'click open': 'showTopics',
    'click close': 'closeTopics'
    // 'click detail-*': 'showDetails'
    // 'click checkOne-*': 'checkOne',
    // 'click checkAll': 'checkAll'
};

exports.handlers = {
    showApplyTopic: function() {
        var model = this.module.items['ask/topicsquare/apply-topic'];
        this.app.viewport.modal(model);
    },
    toggleMore: function(id, e, target) {
        var region;
        var el = $(target).parents('.activity-category')[0];
        region = new D.Region(this.app, this.module, el, id);
        region.show('ask/topicsquare/topicdetail', { id: id });
    },
    showDetails: function(payload) {
        // var data = { },
        //     id = payload;
        // console.log(payload);
        // if (id.indexOf('_') !== -1) {
        //     data = id.split('_');
            // region = new D.Region(this.app, this.module, el, data[1]);
            // region.show('ask/myquiz/details', { id: data[1] });
        this.app.show('content', 'ask/mymanage/topicdetail', { id: payload });
        // }
    },
    // checkOne: function(id) {
    //     $(this.$('checkOne-' + id)).addClass('active').siblings().removeClass('active');
    // },
    // checkAll: function() {
    //     $(this.$('checkAll')).addClass('active').siblings().removeClass('active');
    // }
    showTopics: function() {
        $(this.$('open')).addClass('hide');
        $(this.$('close')).removeClass('hide');
        $(this.$('topictags')).css('height', 'auto');
    },
    closeTopics: function() {
        $(this.$('close')).addClass('hide');
        $(this.$('open')).removeClass('hide');
        $(this.$('topictags')).css('height', '64px');
    }
};
exports.actions = {
    // 'click follow-*': 'follow',
    // 'click unfollow-*': 'unfollow',
    'click checkOne-*': 'checkOne',
    'click checkAll': 'checkAll'
};
exports.dataForActions = {
    // follow: function(payload) {
    //     var id = payload.id,
    //         data = {};
    //     var obj = id.split('_');
    //     data.id = obj[1];
    //     data.concernType = obj[0];
    //     return data;
    // },
    // unfollow: function(payload) {
    //     var id = payload.id,
    //         data = {};
    //     var obj = id.split('_');
    //     data.id = obj[1];
    //     data.concernType = obj[0];
    //     return data;
    // },
    checkOne: function(payload) {
        this.bindings.state.data.typeId = payload.id;
        // console.log(this.bindings.state);
        $(this.$('checkOne-' + payload.id)).addClass('active').siblings().removeClass('active');
        return payload;
    },
    checkAll: function(payload) {
        this.bindings.state.data.typeId = 'checkAll';
        $(this.$('checkAll')).addClass('active').siblings().removeClass('active');
        return payload;
    }
};
exports.actionCallbacks = {
};
exports.dataForTemplate = {
    topicType: function(data) {
        var topicType = data.topicType,
            d = [],
            me = this;
        _.forEach(topicType, function(value) {
            var obj = value;
            if (obj.id === me.bindings.state.data.typeId) {
                obj.current = true;
            } else {
                obj.current = false;
            }
            d.push(obj);
        });
        return d;
    }
};

exports.afterRender = function() {
    if ($(this.$('topictags')).height() <= 64) {
        $(this.$('open')).addClass('hide');
    } else {
        // console.log($(this.$('topictags')).height());
        $(this.$('topictags')).css('height', '64px');
        // console.log($(this.$('topictags')).height());
        $(this.$('topictags')).addClass('overflow');
        $(this.$('open')).show();
    }
};
