exports.type = 'form';

exports.bindings = {
    state: true
};

exports.events = {
    'click select': 'showPicker'
};

exports.handlers = {
    showPicker: function() {
        var state = this.bindings.state.data;
        this.app.viewport.modal(this.module.items.modal, { title: state.title || '选择目录' });
    }
};
