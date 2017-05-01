// exports.type = 'form';

exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    showScore: function() {
        return !this.module.renderOptions.hideScore;
    }
};
