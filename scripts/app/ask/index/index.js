var D = require('drizzlejs');
exports.items = {
    filter: 'filter',
    list: 'list'
};

exports.store = {
    models: {
        askbar: { url: '../exam/activity' },
        content: { url: '../ask/content' },
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {
        init: function(payload) {
            var isOverdue = payload.isOverdue,
                data = this.models.params.data;
            if (isOverdue !== '1' && isOverdue !== '2' && isOverdue !== '3') {
                this.models.askbar.params = this.models.params.data;
            } else {
                data = this.models.params.data;
                D.assign(data, payload);
                this.models.params.changed();
                this.models.askbar.params = data;
            }
            // console.log(this.models.activitys.params);
            // this.get(this.models.content);
        },
        search: function(payload) {
            var data = this.models.params.data;
            D.assign(data, payload);
            this.models.params.changed();
            this.models.askbar.params = data;
            // this.get(this.models.activitys);
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init', this.renderOptions);
};
