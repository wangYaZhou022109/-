exports.bindings = {
    topicname: true,
    state: true
};

exports.actions = {
    'click add-topic-*': 'addTopic',
    'click del-topic-*': 'delTopic'
};
