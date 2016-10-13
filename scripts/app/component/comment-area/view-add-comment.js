exports.bindings = {
    comment: false
};

exports.actions = {
    'click add-comment': 'addComment'
};

exports.dataForActions = {
    addComment: function(data) {
        return this.validate() ? data : false;
    }
};
