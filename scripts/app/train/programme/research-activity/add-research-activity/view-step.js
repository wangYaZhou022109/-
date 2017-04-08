exports.title = '新建试卷';

exports.large = true;

exports.bindings = {
    state: true,
    research: true
};

exports.dataForTemplate = {
    currentStep: function(data) {
        var step = data.state.step;
        return {
            a: step > 0,
            b: step > 1,
            c: step > 2
        };
    }
};

exports.beforeRender = function() {
};
