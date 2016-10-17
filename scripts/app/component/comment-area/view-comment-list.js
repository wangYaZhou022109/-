exports.bindings = {
    comments: true,
    businessModel: false
};
exports.dataForTemplate = {
    comments: function(data) {
        return data.comments.items;
    }
};
exports.actions = {
    'click add-reply-*': 'addReply'
};
exports.dataForActions = {
    addReply: function(data) {
        return data;
    }
};
