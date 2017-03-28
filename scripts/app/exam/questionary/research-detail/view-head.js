var strings = require('./app/util/strings');

exports.bindings = {
    researchRecord: true
};

exports.events = {
    'click submit': 'submit'
};

exports.handlers = {
    submit: function() {
        var me = this;
        this.app.message.confirm(strings.get('exam.research.research-detail.confirm-submit'), function() {
            return me.module.dispatch('saveResearchDetail');
        }, function() {
            return false;
        });
    }
};
