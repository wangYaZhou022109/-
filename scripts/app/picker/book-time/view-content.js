
exports.title = '预定时间';

exports.bindings = {
    state: true,
    projects: true
};

exports.dataForTemplate = {
    state: function() {
        var data = this.bindings.state.data;
        return data;
    }
};

exports.events = {

};

exports.handlers = {

};
