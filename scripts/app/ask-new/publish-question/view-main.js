var $ = require('jquery');
exports.events = {
    'click selectquestion': 'showSelectquestion',
    'change selectquestion': 'hideSelectquestion'
};

exports.handlers = {
    showSelectquestion: function() {
        $(this.$('selectquestion')).parent().css('overflow', 'inherit');
    },
    hideSelectquestion: function() {
        $(this.$('selectquestion')).parent().css('overflow', 'hidden');
        if ($(this.$('selectquestion')).val().trim().length > 0) {
            $(this.$('selectquestion')).next().hide();
        } else {
            $(this.$('selectquestion')).next().show();
        }
    }
};
