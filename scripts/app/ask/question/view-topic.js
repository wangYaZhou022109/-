exports.bindings = {
    topicname: true,
    state: true
};

// exports.actions = {
//     'click add-topic-*': 'addTopic',
//     'click del-topic-*': 'delTopic'
// };
exports.components = [{
    id: 'select-topic',
    name: 'picker',
    options: {
        picker: 'topics',
        inputName: 'topicIds',
        limit: 4
    }
}];
