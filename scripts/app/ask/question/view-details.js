// exports.title = '我要提问';
// exports.type = 'form';
exports.bindings = {
};

// exports.components = [function() { // 选择话题
//     return {
//         id: 'topics',
//         name: 'picker',
//         options: {
//             module: 'ask/question',
//             picker: 'test'
//         }
//     };
// }];

// exports.components = [{
//     id: 'topics',
//     name: 'picker',
//     options: {
//         module: 'ask/question',
//         picker: 'topics',
//         componentId: 'tags',
//         required: true, // 不允许为空
//         limit: 3,       // 关联话题数
//         inputName: 'topicIds'
//     }
// }];

// exports.buttons = [{
//     text: '保存',
//     action: 'save'
// },
// {
//     text: '确定',
//     action: 'doSearch'
// }];


exports.actions = {
    'click release': 'release'
};

exports.dataForActions = {
    release: function(payload) {
        return payload;
    }
};

exports.actionCallbacks = {
    release: function() {
        this.app.message.success('操作成功！');
    }
};


exports.dataForTemplate = {
};
