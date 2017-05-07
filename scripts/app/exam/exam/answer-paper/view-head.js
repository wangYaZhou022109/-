var options = require('./app/exam/exam/base-paper/view-head'),
    strings = require('./app/util/strings'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    actions = D.assign({}, obj.actions),
    dataForActions = D.assign({}, obj.dataForActions);

obj.actions = actions;
D.assign(obj.actions, {
    'click submit': 'submitPaper'
});

obj.dataForActions = dataForActions;
D.assign(obj.dataForActions, {
    submitPaper: function() {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message;
            if (!me.bindings.state.isComplete()) {
                message = strings.get('exam.submit-paper-confirm.no-finish');
            } else {
                message = strings.get('exam.submit-paper-confirm');
            }
            me.app.message.confirm(message, function() {
                resolve({ submitType: 'Hand' });
            }, function() {
                resolve(false);
            });
        });
    }
});

module.exports = obj;
