var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');

exports.bindings = {
    offlineThemeList: true,
    offlineCourseList: true,
    content: true,
    bridge: true
};

exports.dataForTemplate = {
    content: function() {
        var courseList = this.bindings.offlineCourseList,
            content = this.bindings.content.data,
            bridge = this.bindings.bridge.data,
            now = new Date(),
            tmpDate,
            gb,
            arr = [];
        if (bridge.init === 1) {
            this.bindings.content.clear();
            tmpDate = new Date(helpers.date(now) + ' 00:00:00');
            _.map(courseList.data || [], function(data) {
                var d = data;
                if (d.courseDate >= tmpDate.getTime() && arr.length < 8) {
                    arr.push(d);
                }
            });
            gb = _.groupBy(arr, 'courseDate');
            _.forEach(gb, function(value, key) {
                var date = helpers.date(Number(key));
                var con = {};
                con.date = date;
                con.courses = value;
                content.push(con);
            });
        }
        return content;
    },
    courseUrl: function() {
        var url = window.location.protocol + '//' + window.location.host + '/';
        url += '#/study/course/detail/';
        return url;
    }
};

exports.events = {
    'click courseware-view-*': 'showCourseware'
};

exports.handlers = {
    showCourseware: function(id) {
        var view = this.module.items['train/service/views/courseware'];
        this.app.viewport.modal(view, { id: id });
    }
};
