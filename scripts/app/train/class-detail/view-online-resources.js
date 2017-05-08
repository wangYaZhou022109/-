var _ = require('lodash/collection');

exports.bindings = {
    onlineCourseList: true
};

exports.dataForTemplate = {
    onlineCourseList: function() {
        var onlineCourseList = this.bindings.onlineCourseList.data,
            url = window.location.protocol + '//' + window.location.host + '/';
        _.map(onlineCourseList || [], function(data) {
            var d = data;
            if (d.isRequired === 1) {
                d.required = true;
            }
            d.courseUrl = url + '#/study/course/detail/' + d.resourceId;
        });
        return onlineCourseList;
    }
};

exports.events = {
    'click online-attach-*': 'showAttach',
    'click course-view-*': 'showOnlineCourse'
};

exports.handlers = {
    showAttach: function(id) {
        var view = this.module.items['train/class-detail/online-attach'];
        this.app.viewport.modal(view, { id: id });
    },
    showOnlineCourse: function(id) {
        var url = window.location.protocol + '//' + window.location.host + '/';
        url += '#/study/course/detail/' + id;
        window.open(url, '_blank');
    }
};
