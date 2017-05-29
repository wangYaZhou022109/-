
exports.items = {
    modal: 'modal'
};

exports.store = {
    models: {
        list: { url: '../course-study/course-category' }
    },

    callbacks: {
        init: function(options) {
            var list = this.models.list;
            if (options.currentCatalogId) {
                list.params.notIncludeCatelogId = options.currentCatalogId;
            }
            list.params.organizationId = options.organizationId || '1';
            return this.get(list);
        }
    }
};

exports.beforeRender = function() {
    var options = this.renderOptions;
    this.dispatch('init', options);
};

exports.mixin = {
    validate: function() {
        return this.items.main.validate();
    }
};

exports.buttons = [{
    text: '确定选择',
    fn: function() {
        var selected = this.items.modal.components.tree.getSelectedNode();
        if (!selected.length) {
            this.app.message.error('请选择一个目录');
            return false;
        }
        this.renderOptions.callback(selected[0].data);
        return true;
    }
}];
