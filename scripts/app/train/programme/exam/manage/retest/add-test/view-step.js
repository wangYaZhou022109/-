exports.title = '安排补考';

exports.large = true;

exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    currentStep: function(data) {
        var step = data.state.step;
        return {
            a: step > 0,
            b: step > 1
        };
    }
};
