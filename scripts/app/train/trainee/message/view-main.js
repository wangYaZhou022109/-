var _ = require('lodash/collection');

exports.bindings = {
    traineeGroups: true,
    classstaffs: true
};

exports.dataForTemplate = {
    traineeGroups: function(data) {
        var traineeGroups = data.traineeGroups;
        traineeGroups = _.filter(traineeGroups, function(tg) {
            if (tg.traineeList && tg.traineeList.length > 0) {
                return true;
            }
            return false;
        });
        return traineeGroups;
    }
};
