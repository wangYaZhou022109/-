var options = require('./app/exam/exam/base-paper/view-head'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    actions = D.assign({}, obj.actions),
    dataForActions = D.assign({}, obj.dataForActions),
    strings = require('./app/util/strings');

obj.actions = actions;
D.assign(obj.actions, {
    'click submit': 'submitGrade'
});

obj.dataForActions = dataForActions;
D.assign(obj.dataForActions, {
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
});

module.exports = obj;
