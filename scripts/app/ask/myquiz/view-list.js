var D = require('drizzlejs');
exports.type = 'dynamic';
exports.bindings = {
    question: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'question' }
}];

exports.events = {
    'click detial-*': 'detial'
};

exports.handlers = {
    detial: function() {
        var region;
        var el = this.$('left');
        region = new D.Region(this.app, this.module, el);
        region.show('ask/myquiz/quiz-detial');
    }
};

exports.actions = {
    'click remove-*': 'remove'
};

exports.dataForActions = {
    remove: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '确定要删除该数据?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    }
};
