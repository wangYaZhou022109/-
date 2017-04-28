var maps = require('./app/util/maps');

// exports.type = 'form';

exports.bindings = {
    img: true,
    state: false
};

exports.events = {
    'click add-question-*': 'addQuestion'
};

exports.handlers = {
    addQuestion: function(type) {
        var opt = { type: type },
            view = this.module.items.modal;
        opt.title = maps.get('question-types')[Number(opt.type) - 1].value;
        opt.multiple = Number(opt.type) === 2;
        opt.editMode = 2;
        this.app.viewport.modal(view, opt);
    }
};

exports.components = [{
    id: 'content',
    name: 'rich-text',
    options: {
        model: 'img'
    }
}];
