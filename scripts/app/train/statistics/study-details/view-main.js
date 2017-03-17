var _ = require('lodash/collection');

exports.bindings = {
    courseStudyProgresss: true,
    state: true
};

exports.events = {
    'click edit*': 'edit'
};

exports.handlers = {
    edit: function(data) {
        var me = this;
        var view1 = me.module.items['train/statistics/studyDetails/particulars'];
        this.app.viewport.modal(view1, { memberId: data });
    }
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'courseStudyProgresss' }
}];

exports.dataForTemplate = {
    courseStudyProgresss: function(data) {
        var courseStudyProgresss = data.courseStudyProgresss,
            pageNum = this.bindings.courseStudyProgresss.getPageInfo().page;
        _.map(courseStudyProgresss || [], function(courseStudyProgress, i) {
            var e = courseStudyProgress;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return courseStudyProgresss;
    }
};
