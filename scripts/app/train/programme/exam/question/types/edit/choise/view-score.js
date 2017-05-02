// exports.type = 'form';

exports.bindings = {
    bottom: true
};

exports.dataForTemplate = {
    showScore: function() {
        return !this.module.renderOptions.hideScore;
    }
};
