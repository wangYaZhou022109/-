
exports.type = 'form';

exports.bindings = {
    img: true,
    state: false
};

exports.components = [{
    id: 'content',
    name: 'rich-text',
    options: {
        model: 'img'
    }
}];

exports.mixin = {
    getResult: function() {
        var data = {},
            state = this.bindings.state.data;
        data.questionAttrs = [{ value: '', name: '', type: 5 }];
        data.content = this.components.content.html();
        data.type = state.type;
        data.id = state.id;
        return data;
    }
};

