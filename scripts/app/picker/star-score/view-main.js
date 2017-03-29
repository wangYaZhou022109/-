var $ = require('jquery');
var currentScore = 0;
exports.bindings = {
    state: true,
    userScore: true
};

exports.events = {
    'click star-*': 'star',
    'click submit-score': 'save'
};

exports.handlers = {
    star: function(star, e, target) {
        currentScore = star;
        $(target).parent().addClass('active');
        $(target).siblings().removeClass('active');
        $(target).addClass('active');
    },
    save: function() {
        if (currentScore === 0) return false;
        return this.module.renderOptions.callback(currentScore);
    }
};
exports.dataForTemplate = {
    percentage: function(data) {
        if (data.state.avgScore) {
            return Number(data.state.avgScore) * 10;
        }
        return 0;
    }
};
