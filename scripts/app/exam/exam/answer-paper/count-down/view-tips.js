exports.bindings = {
    state: true
};

exports.title = '温馨提示';

exports.dataForTemplate = {
    state: function() {
        return {
            tips: this.renderOptions.tips
        };
    }
};
