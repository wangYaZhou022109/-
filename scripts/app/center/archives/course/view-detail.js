var _ = require('lodash/collection');

exports.bindings = {
    sectionList: true,
    courseName: false
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
    courseName: function() {
        var courseName = this.bindings.courseName.value;
        return courseName;
    }
};
