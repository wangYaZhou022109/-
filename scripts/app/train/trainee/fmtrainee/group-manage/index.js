exports.title = '选择用户';

exports.items = {
    content: 'content',
    toolbox: 'toolbox',
    list: 'list'
};

exports.store = {
    models: {
        state: { data: { } },
        fmTrainees: { url:'' }
    },
    callbacks: {

    }
};

exports.beforeRender = function() {
    var state = this.store.models.state.data;
    state = this.renderOptions;
    console.log(state);
};
