exports.type = 'dynamic';
exports.bindings = {
    reviewed: true,
};
exports.actions = {
    'click display': 'display'
};
exports.dataForActions = {
    display: function() {
        var data = {};
        data.auditStatus = 0;
        return data;
    }
};
exports.actionCallbacks = {

};
