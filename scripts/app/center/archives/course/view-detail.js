var _ = require('lodash/collection');

exports.bindings = {
    sectionList: true
};

exports.title = '学习详情';

exports.dataForTemplate = {
    sectionList: function(data) {
        var sectionList = data.sectionList;
        _.forEach(sectionList, function(value) {
            var section = value;
            section.showRate = true;
            if (section.sectionType === 9 || section.sectionType === 10) {
                section.showRate = false;
            }
        });
        return sectionList;
    },
    courseName: function(data) {
        var courseName = '',
            sectionList = data.sectionList;
        if (sectionList.length > 0) {
            courseName = sectionList[0].courseName;
        }
        return courseName;
    }
};
