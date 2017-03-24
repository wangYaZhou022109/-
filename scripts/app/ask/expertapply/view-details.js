
exports.bindings = {
    innerExpert: true,
    topicname: true,
    state: true
};

exports.actions = {
    'click add-topic-*': 'addTopic',
    'click del-topic-*': 'delTopic'
};
// exports.dataForActions = {
// };

// exports.actionCallbacks = {
// };

exports.components = [function() {
    var data = {},
        innerExpert = this.bindings.innerExpert.data;
    if (innerExpert.member) data.value = innerExpert.member.headPortrait;
    return {
        id: 'headFile',
        name: 'picker',
        options: {
            picker: 'upload',
            inputName: 'headPortrait',
            data: data
        }
    };
}];

