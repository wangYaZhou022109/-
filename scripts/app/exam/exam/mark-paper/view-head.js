var strings = require('./app/util/strings');

exports.bindings = {
    state: true
};

exports.actions = {
    'click submit': 'submitGrade'
};

exports.dataForActions = {
    submitGrade: function() {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = strings.get('exam.submit-mark-paper-confirm');
            me.app.message.confirm(message, function() {
                resolve();
            }, function() {
                resolve(false);
            });
        });
    }
};
