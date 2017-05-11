var $ = require('jquery');
exports.bindings = {
    selecttitle: true
};
exports.events = {
    'click selectquestion': 'showSelectquestion',
    // 'change selectquestion': 'hideSelectquestion',
    // 'click selectquestion': 'showSelectquestion',
    // 'focusout selectquestion': 'hideSelectquestion',
    'input selectquestion': 'showMaxlength'
};

exports.handlers = {
    showSelectquestion: function() {
        $(this.$('selectquestion')).parent().css('overflow', 'inherit');
        // console.log(this.$('selectquestion'));
       // $(this.$('selectquestion'))[0].foucs();
    },
    // hideSelectquestion: function() {
    //     $(this.$('selectquestion')).parent().css('overflow', 'hidden');
    // showSelectquestion: function() {
    //     $(this.$('selectquestion')).parent().parent().css('overflow', 'inherit');
    //     // console.log(this.$('selectquestion'));
    //    // $(this.$('selectquestion'))[0].foucs();
    // },
    // hideSelectquestion: function() {
    //     console.log(111);
    //     $(this.$('selectquestion')).parent().parent().css('overflow', 'hidden');
    // },
    showMaxlength: function() {
        if ($(this.$('selectquestion')).val().trim().length > 0) {
            $(this.$('selectquestion')).next().hide();
        } else {
            $(this.$('selectquestion')).next().show();
        }
    }
};

exports.actions = {
    'click selectquestion': 'showSelectquestion',
    'keyup selectquestion': 'selectquestion'
};

exports.dataForActions = {
    // selectquestion: function() {
    //     var title = $(this.$('selectquestion'))[0].value;
    // }
    showSelectquestion: function() {
        var title = $(this.$('selectquestion'))[0].value;
        $(this.$('selectquestion')).parent().parent().css('overflow', 'inherit');
        return title;
    },
    selectquestion: function() {
        var title = $(this.$('selectquestion'))[0].value;
        var obj = this.bindings.selecttitle.getData(title);
        if (obj.length <= 0) {
            $(this.$('selectquestion')).parent().parent().css('overflow', 'hidden');
        } else {
            $(this.$('selectquestion')).parent().parent().css('overflow', 'inherit');
        }
        return title;
    }
};

exports.dataForTemplate = {
    title: function(data) {
        var title = '';
        if (typeof data !== 'undefined'
            && typeof data.selecttitle !== 'undefined'
            && typeof data.selecttitle[0] !== 'undefined') {
            title = data.selecttitle[0].oldTitle;
        }
        return title;
    }
};
