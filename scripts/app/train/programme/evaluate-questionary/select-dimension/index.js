

exports.title = '选择维度';

exports.items = {
    content: 'content',
    toolbox: 'toolbox',
};

exports.store = {
    models: {
        wei: { url: '../train/configuration-value/wei', type: 'pageable', root: 'items' },
        state: { data: [] },
        search: {
            data: {},
            mixin: { }
        }
    },
    callbacks: {
        refreshList: function(options) {
            var model = this.models.wei;
            model.params = options;
            this.get(model);
        }
    }
};

exports.buttons = [{
    text: '确认',
    fn: function() {
        var ids = this.store.models.state.data;
        this.renderOptions.callback(ids);
        this.store.models.state.data = [];
    }
}];

exports.mixin = {
    nodeChanged: function() {
        var model = this.store.models.search;
        model.changed();
        this.dispatch('refreshList');
    }
};

exports.beforeRender = function() {
    return this.dispatch('refreshList', {});
};
