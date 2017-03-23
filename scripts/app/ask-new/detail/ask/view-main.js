var $ = require('jquery');
exports.events = {
    'click reply-*': 'showComment'
};

exports.handlers = {
    showComment: function(id) {
        $(this.$('comment-reply-' + id)).toggleClass('show');
    }
};
exports.components = [{
    id: 'comment-area',
    name: 'picker',
    options: {
        picker: 'comment-area',
        componentId: 'comment-area'
    }
}];
