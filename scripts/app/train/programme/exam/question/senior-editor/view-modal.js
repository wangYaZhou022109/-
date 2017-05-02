exports.title = '高级编辑';

exports.buttons = [{
    text: '确定',
    fn: function() {
        var id = this.module.renderOptions.data.id;
        this.module.renderOptions.callback(id, this.components['rich-text'].html());
    }
}];

exports.bindings = {
    img: true,
    state: true
};

exports.components = [{
    id: 'rich-text',
    name: 'rich-text',
    options: {
        model: 'img',
        height: '400px'
    }
}];

exports.afterRender = function() {
    var renderOptions = this.module.renderOptions,
        value = renderOptions.data.value || renderOptions.getValue();
    this.components['rich-text'].html(value);
};
