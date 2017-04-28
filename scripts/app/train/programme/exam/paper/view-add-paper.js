exports.title = '新增试卷';


exports.events = {
    'click select-question': 'selectQuestion',
    'click temporary-question': 'temporaryQuestion',
    'click random-question': 'randomQuestion'
};

exports.buttons = [{
    text: '预览'
}, {
    text: '保存'
}];

exports.handlers = {
    selectQuestion: function() {
        this.app.viewport.modal(this.module.items['train/programme/question/select-question']);
    },

    temporaryQuestion: function() {
        this.app.viewport.modal(this.module.items['train/programme/question/add-question']);
    },

    randomQuestion: function() {
        this.app.viewport.modal(this.module.items['random-question']);
    }
};

exports.components = [{
    id: 'owner',
    name: 'picker',
    options: {
        module: 'human/member',
        picker: 'owner',
        required: true
    }
}];
