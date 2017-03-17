
exports.items = {
   // details: 'details'
};

exports.store = {
    models: {
        state: {},
        question: { url: '../ask-bar/question/insert-question' }
    },
    callbacks: {
        release: function(payload) {
            var me = this;
            this.models.question.set(payload);
            // console.log(payload);
            return this.post(this.models.question).then(function() {
                me.app.message.success('操作成功');
                // me.app.show('content', 'ask/content');
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            });
        }
    }
};

exports.afterRender = function() {
};

exports.title = '我要提问';

exports.buttons = [{
    text: '发布',
    fn: function() {
        var data = {
            id: 1,
            title: this.$('title').value,
            topic: this.$('topic').value,
            content: this.$('content').value
        };
        return this.dispatch('release', data);
    }
}];
