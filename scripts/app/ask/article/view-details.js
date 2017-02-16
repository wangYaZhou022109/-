// exports.title = '我要提问';
// exports.type = 'form';

exports.bindings = {
};

// exports.components = [function() {
// }];

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