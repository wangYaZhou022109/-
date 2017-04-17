var _ = require('lodash/collection');
exports.bindings = {
    list: true,
    topicType: true,
    img: false
};

exports.events = {
};

exports.handlers = {
};

exports.actions = {
};

exports.dataForActions = {
};

exports.actionCallbacks = {
};

exports.dataForTemplate = {
    list: function(data) {
        var list = data.list;
        _.map(list, function(opt) {
            var obj = opt;
            if (obj.description && obj.description.length > 24) {
                obj.description = obj.description.substring(0, 22) + '...';
            }
        });
        return list;
    }
};
