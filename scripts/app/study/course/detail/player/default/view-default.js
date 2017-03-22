exports.bindings = {
    state: false
};

exports.dataForTemplate = {
    state: function(data) {
        return {
            loading: !data.state.state.id,
        };
    }
};
