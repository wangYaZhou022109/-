var $ = require('jquery');

exports.bindings = {
    projectInfo: true,
    state: false
};

exports.events = {
    'click menu-*': 'changeMenu'
};

exports.handlers = {
    changeMenu: function(menu) {
        var state = this.bindings.state,
            id = this.bindings.state.data.id,
            projectInfo = this.bindings.projectInfo.data;
        if (projectInfo.status === 3 || menu === 'book') {
            state.data = {};
            state.data.menu = menu || 'book';
            state.data[menu] = true;
            state.data.id = id;
            if (projectInfo.classInfo) {
                state.data.classId = projectInfo.classInfo.id;
            }
            state.changed();
            $(this.$('menu-' + menu)).addClass('active').prevAll('li').addClass('active');
            $(this.$('menu-' + menu)).nextAll('li').removeClass('active');
        } else {
            this.app.message.alert('当前计划为未通过状态');
        }
    }
};

exports.dataForTemplate = {
    projectInfo: function(data) {
        var projectInfo = data.projectInfo,
            arriveDate,
            returnDate,
            now,
            classStatus = 1;
        if (projectInfo.classInfo) {
            arriveDate = projectInfo.classInfo.arriveDate;
            returnDate = projectInfo.classInfo.returnDate;
            now = new Date().getTime();
            if (arriveDate && returnDate && now >= arriveDate && now <= returnDate) {
                classStatus = 2;
            }
            if (returnDate && now > returnDate) {
                classStatus = 3;
            }
            projectInfo.showDetailButton = true;
        }
        projectInfo.classStatus = classStatus;
        return projectInfo;
    },
    classUrl: function() {
        var projectInfo = this.bindings.projectInfo.data,
            url = window.location.protocol + '//' + window.location.host + '/';
        if (projectInfo.classInfo) {
            url += '#/train/detail/' + projectInfo.classInfo.id;
        }
        return url;
    }
};
