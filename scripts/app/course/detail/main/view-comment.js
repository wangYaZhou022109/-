var $ = require('jquery');

exports.events = {
    'click reply-*': 'showReply'
};

exports.handlers = {
    showReply: function(id) {
        $(this.$('reply-content-' + id)).addClass('show');
    }
};
