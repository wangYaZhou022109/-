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
            role = this.bindings.state.data.role,
            projectInfo = this.bindings.projectInfo.data,
            me = this;
        // if (projectInfo.status === 3 || menu === 'book') {
        //     state.data = {};
        //     state.data.menu = menu || 'book';
        //     state.data[menu] = true;
        //     state.data.id = id;
        //     state.data.role = role;
        //     if (projectInfo.classInfo) {
        //         state.data.classId = projectInfo.classInfo.id;
        //     }
        //     state.data.organizationId = projectInfo.organization.id;
        //     state.changed();
        //     $(this.$('menu-' + menu)).addClass('active').prevAll('li').addClass('active');
        //     $(this.$('menu-' + menu)).nextAll('li').removeClass('active');
        // } else {
        //     this.app.message.alert('当前计划为未通过状态');
        // }
        if (menu === 'book') {
            state.data = {};
            state.data.menu = menu || 'book';
            state.data[menu] = true;
            state.data.id = id;
            state.data.role = role;
            if (projectInfo.classInfo) {
                state.data.classId = projectInfo.classInfo.id;
            }
            state.data.organizationId = projectInfo.organization.id;
            state.changed();
            $(this.$('menu-' + menu)).addClass('active').prevAll('li').addClass('active');
            $(this.$('menu-' + menu)).nextAll('li').removeClass('active');
        } else if (projectInfo.status === 3) {
            if (menu === 'base') {
                state.data = {};
                state.data.menu = menu || 'base';
                state.data[menu] = true;
                state.data.id = id;
                state.data.role = role;
                if (projectInfo.classInfo) {
                    state.data.classId = projectInfo.classInfo.id;
                }
                state.data.organizationId = projectInfo.organization.id;
                state.changed();
                $(this.$('menu-' + menu)).addClass('active').prevAll('li').addClass('active');
                $(this.$('menu-' + menu)).nextAll('li').removeClass('active');
            } else {
                this.module.dispatch('changeMenu').then(function(data) {
                    var classInfo = data[0];
                    if (classInfo.confirm === 1) {
                        state.data = {};
                        state.data.menu = menu || 'base';
                        state.data[menu] = true;
                        state.data.id = id;
                        state.data.role = role;
                        if (projectInfo.classInfo) {
                            state.data.classId = projectInfo.classInfo.id;
                        }
                        state.data.organizationId = projectInfo.organization.id;
                        state.changed();
                        $(me.$('menu-' + menu)).addClass('active').prevAll('li').addClass('active');
                        $(me.$('menu-' + menu)).nextAll('li').removeClass('active');
                    } else {
                        me.app.message.alert('班级基本信息未提交');
                    }
                });
            }
        } else {
            this.app.message.alert('当前计划为未通过状态');
        }
    }
};

exports.dataForTemplate = {
    projectInfo: function(data) {
        var projectInfo = data.projectInfo || { classInfo: { id: null } },
            classInfo = projectInfo.classInfo || { id: null },
            arriveDate,
            returnDate,
            now,
            classStatus = 1;
        if (classInfo.id !== null) {
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
            url += '#/train/class-detail/' + projectInfo.classInfo.id;
        }
        return url;
    }
};
