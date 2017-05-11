var options = require('./app/exam/exam/base-paper/view-head'),
    strings = require('./app/util/strings'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    actions = D.assign({}, obj.actions),
    bindings = D.assign({}, obj.bindings),
    dataForActions = D.assign({}, obj.dataForActions);

obj.bindings = bindings;
D.assign(obj.bindings, {
    mark: false
});

obj.actions = actions;
D.assign(obj.actions, {
    'click submit': 'submitPaper'
});

obj.dataForActions = dataForActions;
D.assign(obj.dataForActions, {
    submitPaper: function() {
        var me = this,
            state = this.bindings.state.data,
            mark = this.bindings.mark.data;
        return this.Promise.create(function(resolve) {
            var message = [];
            if (state.noAnswerCount > 0) {
                message.push(strings.getWithParams(
                    'exam.submit-paper-confirm.no-finish',
                    state.noAnswerCount
                ));
            }
            if (mark.waitingChecks.length > 0) {
                message.push(strings.getWithParams(
                    'exam.submit-paper-confirm.has-waiting-check',
                    mark.waitingChecks.length
                ));
            }

            message = message.length > 0
                ? '您有' + message.join(',') + ', 确定交卷吗?'
                    : strings.get('exam.submit-paper-confirm');

            me.app.message.confirm(message, function() {
                resolve({ submitType: 'Hand' });
            }, function() {
                return false;
            });
        }).then(function() {
            me.app.message.success(strings.get('exam.answer-paper.submit-success'));
        });
    }
});

module.exports = obj;
