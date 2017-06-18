exports.binding = {
    state: true
};

exports.title = '温馨提示';

exports.afterClose = function() {
    this.app.navigate('home');
};

exports.dataForTemplate = {
    state: function() {
        return {
            tips: this.renderOptions.tips
        };
    }
};
