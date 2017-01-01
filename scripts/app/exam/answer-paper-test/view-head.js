exports.bindings = {
    state: true,
    exam: false
};

exports.actions = {
    'click submit': 'submit'
};

exports.dataForActions = {
    submit: function() {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定要提交试卷？';
            me.app.message.confirm(message, function() {
                resolve({ submitType: 'Hand' });
            }, function() {
                resolve(false);
            });
        });
    }
};
