var $ = require('jquery');

exports.events = {
    'click classmanage-*': 'toggleClassmanage',
    'click reply-*': 'showComment'
};

exports.handlers = {
    toggleClassmanage: function(id) {
        $(this.$('classmanage-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('classmanage-content-' + id)).show().siblings().hide();
    },
    showComment: function(id) {
        $(this.$('comment-reply-' + id)).toggleClass('show');
    }
};
