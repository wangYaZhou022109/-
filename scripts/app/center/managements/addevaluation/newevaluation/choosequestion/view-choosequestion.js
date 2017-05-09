var $ = require('jquery');
var setanswer;
var that;
exports.events = {
    'click highedit-*': 'showHightedit',
    'click delete-*': 'deleteItem',
    'click setanswer-*': 'setAnswer'
};

exports.handlers = {
    showHightedit: function() {
        var model = this.module.items['center/managements/addevaluation/newevaluation/choosequestion/highedit'];
        this.app.viewport.modal(model);
    },
    deleteItem: function(id) {
        $(this.$('deletecot-' + id)).hide();
    },
    setAnswer: function(id) {
        if ($(this.$('answercot-' + id)).val().length > 0) {
            $(this.$('setanswer-' + id)).text('√设为答案').css('background', '#f1a77b');
            setanswer = $(this.$('deletecot-' + id)).siblings().children().eq(1);
            that = setanswer.children().eq(0);
            that.text('设为答案').css('background', '#537fd5');
        }
    }
};

