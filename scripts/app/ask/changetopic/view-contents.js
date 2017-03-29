
exports.bindings = {
    topicname: true,
    topicType: true
};

exports.events = {
    'click apply-topic': 'showApplyTopic'
};

exports.handlers = {
    showApplyTopic: function() {
        var model = this.module.items['ask/topicsquare/apply-topic'];
        this.app.viewport.modal(model);
    }
};

exports.actions = {
    'click checkOne-*': 'checkOne',
    'click checkAll*': 'checkAll',
    'click search': 'searchLike',
    'click add-topic-*': 'addTopic'
};
