// exports.title = '我要提问';
// exports.type = 'form';

exports.bindings = {
};

exports.components = [function() {
    return {
        id: 'topics',
        name: 'picker',
        options: {
            module: 'ask/article',
            picker: 'topics',
            componentId: 'tags',
            required: true, // 不允许为空
            limit: 3,       // 关联话题数
            inputName: 'topicIds'
        }
    };
}];

// exports.buttons = [{
//     text: '保存',
//     action: 'save'
// }];

// exports.dataForActions = {
// };

// exports.actionCallbacks = {
// };


// exports.dataForTemplate = {
// };


exports.actions = {
   // 'click release': 'release'
};

exports.dataForActions = {
    // release: function(payload) {
    //     return payload;
    // }
};

exports.actionCallbacks = {
    // release: function() {
    //     this.app.message.success('操作成功！');
    //     setTimeout(function() {
    //         window.location.reload();
    //     }, 1000);
    // }
};
