var _ = require('lodash/collection');
// exports.type = 'dynamic';
exports.bindings = {
    expertlist: true,
    topicType: true,
    user: true,
    down: false
};

exports.events = {
    'click activate*': 'activate',
    'click review*': 'review',
    // 'click myself*': 'myself',
    'click apply*': 'apply',
    'click expert-*': 'details'
};

exports.handlers = {
    activate: function() {
        var model = this.module.items['ask/expertactivation'];
        var me = this;
        this.app.viewport.modal(model, { callback: function() {
            me.module.dispatch('user');
        }
        });
    },
    review: function() {
        var model = this.module.items['ask-new/apply-verify'];
        this.app.viewport.modal(model);
    },
    // myself: function() {
    //     this.app.show('content', 'ask/iamexpert');
    // },
    apply: function() {
        var model = this.module.items['ask/applyexpertaptitude'];
        var me = this;
        // this.app.viewport.modal(model, { bindings: this.bindings });
        this.app.viewport.modal(model, { callback: function() {
            me.module.dispatch('user');
        }
        });
    },
    details: function(id) {
        this.app.show('content', 'ask/expertdetails', { id: id });
    }
};

exports.actions = {
    'click check-*': 'check',
    'click follow-expert-*': 'follow',
    'click unfollow-expert-*': 'unfollow'
};

exports.dataForActions = {
    check: function(payload) {
        return payload;
    },
    follow: function(payload) {
        var data = payload;
        data.concernType = '1';
        return data;
    },
    unfollow: function(payload) {
        var data = payload;
        data.concernType = '1';
        return data;
    }
};

exports.actionCallbacks = {
    follow: function() {
        // var concern = data[0];
        // var unf = this.$('unfollow-expert-' + concern.concernId);
        // var f = this.$('follow-expert-' + concern.concernId);
        this.app.message.success('关注成功');
        // f.hidden = true;
        // unf.hidden = false;
        this.module.dispatch('refresh');
    },
    unfollow: function() {
        // var concern = data[0];
        // var unf = this.$('unfollow-expert-' + concern.concernId);
        // var f = this.$('follow-expert-' + concern.concernId);
        this.app.message.success('取消成功');
        // f.hidden = false;
        // unf.hidden = true;
        this.module.dispatch('refresh');
    }
};

exports.dataForTemplate = {
    expert: function(data) {
        var expertlist = data.expertlist;
        var me = this;
        _.forEach(expertlist, function(value) {
            var obj = value,
                url = {};
            if (typeof obj.member !== 'undefined') {
                url = obj.member.headPortrait;
                if (typeof url === 'undefined' || url === null || url === '') {
                    obj.member.headPortrait = 'images/default-userpic.png';
                } else {
                    obj.member.headPortrait = me.bindings.down.getFullUrl() + '?id=' + url;
                }
            }
        });
        return expertlist;
    }
};
