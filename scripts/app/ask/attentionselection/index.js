// var $ = require('jquery');
exports.items = {
    list: 'list'
};

exports.store = {
    models: {
        state: {},
        trends: { url: '../ask-bar/trends/attentionselection' },
        down: { url: '../human/file/download' },
        concern: { url: '../ask-bar/trends/concern' }
    },
    callbacks: {
        init: function(payload) {
            var trends = this.models.trends;
            trends.set({ id: 1222 });
            this.models.state = payload.me;
            return this.get(trends);
        },
        end: function(payload) {
            var concern = this.models.concern,
                me = this;
            concern.set(payload);
            return this.post(concern).then(function() {
                var state = me.models.state;
                me.app.message.success('操作成功！');
                state.data = {};
                state.data.menu = 'relatedtome';
                state.data.relatedtome = true;
                state.changed();
            });
        }
    }
};

exports.afterRender = function() {
    // $('.recommend-topic')[0].style.display = 'none';
    return this.dispatch('init', this.renderOptions);
};
