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
            content = this.bindings.content,
            bridge = this.bindings.bridge.data,
            now = new Date(),
            tmpDate,
            gb,
            arr = [],
            url = window.location.protocol + '//' + window.location.host + '/';
        if (bridge.init === 1) {
            this.bindings.content.clear();
            tmpDate = new Date(helpers.date(now) + ' 00:00:00');
            _.map(courseList.data || [], function(data) {
                var d = data;
                d.courseUrl = url + '#/study/course/detail/' + d.onlineCourseId;
                if (d.courseDate >= tmpDate.getTime() && arr.length < 8) {
                    arr.push(d);
                }
            });
            if (arr.length > 0) {
                bridge.start = arr[0];
                bridge.end = arr[arr.length - 1];
                bridge.list = arr;
            }
            gb = _.groupBy(arr, 'courseDate');
            _.forEach(gb, function(value, key) {
                var date = helpers.date(Number(key));
                var con = {};
                con.date = date;
                con.courses = value;
                content.data.push(con);
            });
            if (content.data.length > 0) {
                bridge.init = 0;
            }
        }
        return content.data;
    },
    courseUrl: function() {
        var url = window.location.protocol + '//' + window.location.host + '/';
        url += '#/study/course/detail/';
        return url;
    },
    isShowTheme: function() {
        var weeks = this.bindings.offlineThemeList;
        if (weeks.data.length > 1) {
            return true;
        }
        return false;
    },
    offlineThemeList: function() {
        var offlineThemeList = this.bindings.offlineThemeList.data,
            bridge = this.bindings.bridge.data;
        _.map(offlineThemeList, function(theme, i) {
            var t = theme;
            t.checked = bridge.themeIndex === i;
        });
        return offlineThemeList;
    },
    isShowPrevious: function() {
        var offlineCourseList = this.bindings.offlineCourseList.data,
            bridge = this.bindings.bridge.data,
            index = -1;
        if (bridge.init === 0) {
            index = offlineCourseList.findIndex(function(o) {
                return o.id === bridge.start.id;
            });
        }
        return index > 0;
    },
    isShowMore: function() {
        var offlineCourseList = this.bindings.offlineCourseList.data,
            bridge = this.bindings.bridge.data,
            index = -1;
        if (bridge.init === 0) {
            index = offlineCourseList.findIndex(function(o) {
                return o.id === bridge.end.id;
            });
        }
        return index !== offlineCourseList.length - 1;
    }
};

exports.events = {
    'click courseware-view-*': 'showCourseware',
    'change theme-list': 'changeTheme',
    'click previous': 'showPrevious',
    'click next': 'showMore'
};

exports.handlers = {
    showCourseware: function(id) {
        var view = this.module.items['train/class-detail/courseware'];
        this.app.viewport.modal(view, { id: id });
    },
    changeTheme: function() {
        var v = this.$('theme-list').value,
            offlineThemeList = this.bindings.offlineThemeList.data,
            courseList = this.bindings.offlineCourseList,
            content = this.bindings.content,
            bridge = this.bindings.bridge.data,
            index,
            target,
            tmpDate,
            arr = [],
            gb;
        index = offlineThemeList.findIndex(function(t) {
            return t.id === v;
        });
        bridge.themeIndex = index;
        target = offlineThemeList[index];
        this.bindings.content.clear();
        tmpDate = new Date(target.startDate + ' 00:00:00');
        _.map(courseList.data || [], function(data) {
            var d = data;
            if (d.courseDate >= tmpDate.getTime() && arr.length < 8) {
                arr.push(d);
            }
        });
        if (arr.length > 0) {
            bridge.start = arr[0];
            bridge.end = arr[arr.length - 1];
            bridge.list = arr;
        }
        gb = _.groupBy(arr, 'courseDate');
        _.forEach(gb, function(value, key) {
            var date = helpers.date(Number(key));
            var con = {};
            con.date = date;
            con.courses = value;
            content.data.push(con);
        });
        this.bindings.content.changed();
    },
    showPrevious: function() {
        var bridge = this.bindings.bridge.data,
            offlineCourseList = this.bindings.offlineCourseList.data,
            content = this.bindings.content,
            index,
            tmparray,
            arr = [],
            gb;
        index = offlineCourseList.findIndex(function(o) {
            return o.id === bridge.start.id;
        });
        tmparray = offlineCourseList.slice(0, index);
        tmparray.reverse();
        _.map(tmparray || [], function(data, i) {
            var d = data;
            if (i < 8) {
                arr.push(d);
                bridge.start = d;
            }
        });
        arr.reverse();
        bridge.list = arr.concat(bridge.list);
        this.bindings.content.clear();
        gb = _.groupBy(bridge.list, 'courseDate');
        _.forEach(gb, function(value, key) {
            var date = helpers.date(Number(key));
            var con = {};
            con.date = date;
            con.courses = value;
            content.data.push(con);
        });
        this.bindings.content.changed();
    },
    showMore: function() {
        var bridge = this.bindings.bridge.data,
            offlineCourseList = this.bindings.offlineCourseList.data,
            content = this.bindings.content,
            index,
            tmparray,
            arr = [],
            gb;
        index = offlineCourseList.findIndex(function(o) {
            return o.id === bridge.end.id;
        });
        tmparray = offlineCourseList.slice(index + 1);
        _.map(tmparray || [], function(data, i) {
            var d = data;
            if (i < 8) {
                arr.push(d);
                bridge.end = d;
            }
        });
        bridge.list = bridge.list.concat(arr);
        this.bindings.content.clear();
        gb = _.groupBy(bridge.list, 'courseDate');
        _.forEach(gb, function(value, key) {
            var date = helpers.date(Number(key));
            var con = {};
            con.date = date;
            con.courses = value;
            content.data.push(con);
        });
        this.bindings.content.changed();
    }
};
