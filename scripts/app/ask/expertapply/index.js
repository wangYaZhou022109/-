// exports.items = {
//     details: 'details'
// };

exports.store = {
    models: {
        state: {},
        trends: { url: '../ask-bar/trends' },
        question: { url: '../ask-bar/question/insert-article' }
    },
    callbacks: {
        release: function(payload) {
            var question = this.models.question,
                data = payload;
            data.id = 1;
            question.set(data);
            return this.post(question);
        }
    }
};

exports.afterRender = function() {
};

exports.title = '专家申请';

exports.buttons = [{
    text: '提交申请'
}];

exports.components = [function() {
    return {
        id: 'topics',
        name: 'picker',
        options: {
            module: 'ask-new/expertapply',
            picker: 'topics',
            componentId: 'tags',
            required: true, // 不允许为空
            limit: 3,       // 关联话题数
            inputName: 'topicIds'
        }
    };
}];
