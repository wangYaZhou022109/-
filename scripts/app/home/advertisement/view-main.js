var helpers = require('./app/util/helpers');
exports.bindings = {
    advertisement: true
};
exports.dataForTemplate = {
    advertisement: function(data) {
        var advertisement = data.advertisement || {};
        advertisement.createTime = helpers.dateMinute(advertisement.createTime);
        return advertisement;
    }
};
