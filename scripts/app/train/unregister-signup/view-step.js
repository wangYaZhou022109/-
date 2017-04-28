exports.bindings = {
    state: true
};

exports.dataForTemplate = {
    currentStep: function(data) {
        var step = data.state.step;
        return {
            phone: step === 'phone',
            info: step === 'info'
        };
    }
};
