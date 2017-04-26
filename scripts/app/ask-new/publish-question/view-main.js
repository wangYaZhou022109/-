var $ = require('jquery');
exports.events = {
    'click selectquestion': 'showSelectquestion',
    'change selectquestion': 'hideSelectquestion'
};

exports.handlers = {
    showSelectquestion: function() {
        $(this.$('selectquestion')).parent().css('overflow', 'inherit');
        $(this.$('selectquestion')).next().hide();
    },
    hideSelectquestion: function() {
        $(this.$('selectquestion')).parent().css('overflow', 'hidden');
    }
};
