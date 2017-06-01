var options = require('./app/exam/exam/base-paper/view-head'),
    strings = require('./app/util/strings'),
    $ = require('jquery'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    events = D.assign({}, obj.events),
    bindings = D.assign({}, obj.bindings),
    handlers = D.assign({}, obj.handlers);

obj.bindings = bindings;
D.assign(obj.bindings, {
    mark: false,
    head: true,
    state: 'changeAnswerCount'
});

obj.events = events;
D.assign(obj.events, {
    'click submit': 'submitPaper'
});

obj.handlers = handlers;
D.assign(obj.handlers, {
    submitPaper: function() {
        var me = this,
            state = this.bindings.state.data,
            mark = this.bindings.mark.data;

        return this.Promise.create(function() {
            var message = [];

            //  多少题未答
            if (state.noAnswerCount > 0) {
                message.push(strings.getWithParams(
                    'exam.submit-paper-confirm.no-finish',
                    state.noAnswerCount
                ));
            }

            //  多少题标记待检查
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
                return me.module.dispatch('submitPaper', { submitType: 'Hand' }).then(function() {
                    //  提交成功后弹出提示框
                    return me.module.dispatch('showTips', {
                        tips: state.paper.isSubjective === 1
                            ? strings.get('exam.answer-paper.submit-success-mark')
                                : strings.get('exam.answer-paper.submit-success')
                    }).then(function() {
                        me.app.viewport.modal(me.module.items['exam-notes']);
                    });
                });
            }, function() {
                return true;
            });
        });
    }
});

D.assign(obj, {
    changeAnswerCount: function() {
        var state = this.bindings.state.data;
        $(this.$('answered-count')).html(state.answeredCount);
        $(this.$('no-answer-count')).html(state.noAnswerCount);
    }
});

module.exports = obj;
