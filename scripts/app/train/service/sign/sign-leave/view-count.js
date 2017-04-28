exports.bindings = {
    signOne: true,
    signCount: true,
};

exports.dataForTemplate = {
    signOne: function(data) {
        var signOne = data.signOne;
        return signOne;
    },
    signCount: function(data) {
        var signCount = data.signCount;
        return signCount;
    }
};
