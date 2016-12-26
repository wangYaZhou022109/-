exports.type = 'form';

exports.bindings = {
    comment: false,
    businessModel: false
};

exports.actions = {
    'click add-comment-*': 'addComment'
};

exports.dataForActions = {
    addComment: function(data) {
        return this.validate() ? data : false;
    }
};
