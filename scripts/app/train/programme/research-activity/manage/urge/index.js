var strings = require('./app/util/strings'),
    _ = require('lodash/collection');

exports.items = {
    main: 'main'
};

exports.title = function() {
    return strings.get('exam.research.manage.urge-title');
};

exports.store = {
    models: {
        research: {},
        researchRecords: {},
        urge: { url: '../exam/research-activity/get-urge-template' },
        send: { url: '../exam/research-activity/send-urge-message' }
    },
    callbacks: {
        init: function(payload) {
            this.models.urge.clear();
            this.models.research.set(payload.data.research);
            this.models.researchRecords.set(payload.data.researchRecords);
            return this.get(this.models.urge);
        },
        send: function() {
            var me = this;
            this.models.send.set({
                memberIds: JSON.stringify(_.map(this.models.researchRecords.data, function(r) {
                    return r.member.id;
                }))
            });
            return this.post(this.models.send).then(function() {
                me.app.message.success(strings.get('send-success'));
                me.app.viewport.closePopup();
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', this.renderOptions);
};

exports.buttons = [{
    text: strings.get('send'),
    fn: function() {
        var me = this;
        this.app.message.confirm(strings.get('send-warn'), function() {
            return me.dispatch('send');
        });
        return false;
    }
}];
