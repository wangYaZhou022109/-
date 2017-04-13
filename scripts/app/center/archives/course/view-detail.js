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
            var section = value,
                progress = section.progress || {};
            section.showRate = true;
            if (section.sectionType === 9 ||
              section.sectionType === 10 ||
              section.sectionType === 12 ||
              section.sectionType === 13) {
                section.showRate = false;
            }
            if (!progress.id) {
                progress = { finishStatus: 0, studyTotalTime: 0 };
                section.progress = progress;
            }
        });
        return sectionList;
    },
    courseName: function() {
        var courseName = this.bindings.courseName.value;
        return courseName;
    }
};
