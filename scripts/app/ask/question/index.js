var _ = require('lodash/collection');
exports.items = {
   // details: 'details'
};

exports.store = {
    models: {
        state: {},
        speech: {
            url: '../system/speech-set',
            mixin: {
                getData: function(id) {
                    var speechset;
                    _.forEach(this.data, function(d) {
                        if (d.id === id) {
                            speechset = d;
                        }
                    });
                    return speechset;
                }
            }
        },
        question: { url: '../ask-bar/question/insert-question' }
    },
    callbacks: {
        init: function() {
            var speech = this.models.speech;
            return this.get(speech);
        },
        release: function(payload) {
            var me = this,
                data = payload,
                speechset = this.models.speech.getData('1');
            data.speechset = speechset.status;
            this.models.question.set(data);
            // console.log(this.models.question);
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
    return this.dispatch('init');
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
