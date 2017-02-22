var markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    _ = require('lodash/collection'),
    $ = require('jquery');

var title = { add: '添加课程', update: '编辑课程' };

exports.large = true;

exports.title = function() {
    return title[this.bindings.state.data.type];
};

exports.bindings = {
    state: true,
    offlineCourse: true,
    classroomList: true
};

exports.dataForTemplate = {
    checked: function(data) {
        var offlineCourse = data.offlineCourse;
        return {
            type1: offlineCourse.type === 1,
            type2: offlineCourse.type === 2,
            type3: offlineCourse.type === 3,
            type4: offlineCourse.type === 4
        };
    },
    classroomList: function(data) {
        _.map(data.classroomList || [], function(classroom) {
            var item = classroom;
            if (data.offlineCourse && data.offlineCourse.classroomId && item.id === data.offlineCourse.classroomId) {
                item.selected = true;
            }
        });
        return data.classroomList;
    }
};

exports.actions = {
    'click submitOffline': 'submitOffline'
};

exports.dataForActions = {
    submitOffline: function(payload) {
        return this.validate() ? payload : false;
    }
};

exports.actionCallbacks = {
    submitOffline: function() {
        this.app.viewport.closeModal();
    }
};

exports.mixin = {
    validate: function() {
        var type = $(this.$('type')),
            name = $(this.$('name')),
            courseDate = $(this.$('courseDate')),
            startTime = $(this.$('startTime')),
            endTime = $(this.$('endTime')),
            classRoomId = $(this.$('classRoomId')),
            teacherName = $(this.$('teacherName')),
            teacherOrganization = $(this.$('teacherOrganization')),
            teacherTitle = $(this.$('teacherTitle')),
            teacherPhone = $(this.$('teacherPhone')),
            st,
            et,
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g');

        markers.selectize.valid(type);
        markers.text.valid(name);
        markers.text.valid(courseDate);
        markers.text.valid(startTime);
        markers.text.valid(endTime);
        markers.selectize.valid(classRoomId);
        markers.text.valid(teacherName);
        markers.text.valid(teacherOrganization);
        markers.text.valid(teacherTitle);
        markers.text.valid(teacherPhone);

        if (!validators.required.fn(type.val())) {
            markers.selectize.invalid(type, validators.required.message);
            flag = false;
        }
        if (!validators.required.fn(name.val())) {
            markers.text.invalid(name, validators.required.message);
            flag = false;
        }
        if (!validators.maxLength.fn(name.val(), 30)) {
            markers.text.invalid(name, validators.maxLength.message.replace(reg, 30));
            flag = false;
        }
        if (!validators.required.fn(courseDate.val())) {
            markers.text.invalid(courseDate, validators.required.message);
            flag = false;
        }
        if (!validators.required.fn(startTime.val())) {
            markers.text.invalid(startTime, validators.required.message);
            flag = false;
        }
        if (!validators.required.fn(endTime.val())) {
            markers.text.invalid(endTime, validators.required.message);
            flag = false;
        }
        st = new Date(courseDate.val() + ' ' + startTime.val()).getTime();
        et = new Date(courseDate.val() + ' ' + endTime.val()).getTime();
        if (et <= st) {
            markers.text.invalid(endTime, '结束时间必须大于开始时间');
            flag = false;
        }
        if (!validators.required.fn(classRoomId.val())) {
            markers.selectize.invalid(classRoomId, validators.required.message);
            flag = false;
        }
        if (teacherName.val() !== '' && !validators.maxLength.fn(teacherName.val(), 30)) {
            markers.text.invalid(teacherName, validators.maxLength.message.replace(reg, 30));
            flag = false;
        }
        if (teacherOrganization.val() !== '' && !validators.maxLength.fn(teacherOrganization.val(), 30)) {
            markers.text.invalid(teacherOrganization, validators.maxLength.message.replace(reg, 30));
            flag = false;
        }
        if (teacherTitle.val() !== '' && !validators.maxLength.fn(teacherTitle.val(), 30)) {
            markers.text.invalid(teacherTitle, validators.maxLength.message.replace(reg, 30));
            flag = false;
        }
        if (teacherPhone.val() !== '' && !validators.phone.fn(teacherPhone.val())) {
            markers.text.invalid(teacherPhone, validators.phone.message);
            flag = false;
        }
        return flag;
    }
};
