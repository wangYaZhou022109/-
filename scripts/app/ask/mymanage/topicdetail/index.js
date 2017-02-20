exports.items = {
    topicdetail: 'topicdetail'
};

exports.store = {
    models: {
        params: { data: { isOverdue: '1' } }
    },
    callbacks: {}
};

exports.afterRender = function() {
    console.log(this.renderOptions);
    this.dispatch('init', this.renderOptions);
    this.dispatch('reviewed');
};
