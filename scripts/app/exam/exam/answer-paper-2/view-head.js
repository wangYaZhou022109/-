var strings = require('./app/util/strings');

exports.bindings = {
    state: true
};

exports.actions = {
    'click submit': 'submitPaper'
};

exports.dataForActions = {
    submitPaper: function() {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = strings.get('exam.submit-paper-confirm');
            me.app.message.confirm(message, function() {
                resolve({ submitType: 'Hand' });
            }, function() {
                resolve(false);
            });
        });
    }
};
