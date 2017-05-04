var _ = require('lodash/collection');

exports.bindings = {
    courseStudyProgresss: true,
    state: true
};

exports.events = {
    'click edit*': 'edit'
};

exports.handlers = {
    edit: function(data, e, target) {
        var me = this;
        var cId = target.getAttribute('cId');
        var view1 = me.module.items['train/statistics/study-details/particulars'];
        var options = {};
        options.memberId = data;
        options.courseId = cId;
        this.app.viewport.modal(view1, { payload: options });
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
