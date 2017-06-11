var helpers = require('./app/util/helpers'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    $ = require('jquery'),
    _ = require('lodash/collection');

exports.bindings = {
    classInfo: true,
    down: false,
    state: true,
    classroomList: true,
    trainTypes: true,
    classTypes: true
};

exports.events = {
    'click uploadFile': 'uploadFile',
    'click needGroupPhoto-*': 'changePhotoType',
    'click needVideo-*': 'changeNeedVideo',
    'click needMakeCourse-*': 'changeMakeCourse',
    'click uploadBanner': 'uploadBanner',
};

exports.handlers = {
    uploadFile: function() {
        var view = this.module.items.upload,
            state = this.bindings.state.data;
        state.type = 'cover';
        this.app.viewport.modal(view);
    },
    changePhotoType: function(data) {
        var d = data,
            state = this.bindings.state.data;
        if (d === '1') {
            state.needGroupPhotoCheck = true;
        } else {
            state.needGroupPhotoCheck = false;
        }
    },
    changeNeedVideo: function(data) {
        var d = data;
        if (d === '0') {
            $(this.$('videoRequirement')).val('');
            $(this.$('videoRequirement')).attr('readonly', 'readonly');
        } else {
            $(this.$('videoRequirement')).attr('readonly', false);
        }
    },
    changeMakeCourse: function(data) {
        var d = data,
            state = this.bindings.state.data;
        if (d === '1') {
            state.needMakeCourseCheck = true;
        } else {
            state.needMakeCourseCheck = false;
        }
    },
    uploadBanner: function() {
        var view = this.module.items.upload,
            state = this.bindings.state.data,
            classInfo = this.bindings.classInfo.data;
        if (!classInfo.classDetail) {
            classInfo.classDetail = {};
        }
        if (!classInfo.classRoom) {
            classInfo.classRoom = {};
        }
        classInfo.classDetail.haveProvinceLeader = Number($(this.$$('[name="haveProvinceLeader"]:checked')).val());
        classInfo.classDetail.haveMinister = Number($(this.$$('[name="haveMinister"]:checked')).val());
        classInfo.classDetail.needGroupPhoto = Number($(this.$$('[name="needGroupPhoto"]:checked')).val());
        classInfo.classDetail.photoTime = this.$('photoTime').value;
        classInfo.classDetail.needMakeCourse = Number($(this.$$('[name="needMakeCourse"]:checked')).val());
        classInfo.classDetail.courseVideoRequirement = this.$('courseVideoRequirement').value;
        classInfo.classDetail.tableType = Number(this.$('tableType').value);
        classInfo.classDetail.otherRequirement = this.$('otherRequirement').value;
        classInfo.romm = this.$('restRoom').value;
        classInfo.diningRoom = this.$('diningRoom').value;
        classInfo.classRoom.classRoom = this.$('classRoom').value;
        state.type = 'banner';
        this.app.viewport.modal(view);
    }
};

exports.actions = {
    'click submit': 'submit',
    'click save': 'save'
};

exports.dataForTemplate = {
    classInfo: function(data) {
        var classInfo = data.classInfo,
            arriveDate,
            returnDate,
            address,
            romm,
            diningRoom,
            classRoom;
        arriveDate = new Date(classInfo.arriveDate);
        returnDate = new Date(classInfo.returnDate);
        arriveDate.setDate(arriveDate.getDate() + 1);
        returnDate.setDate(returnDate.getDate() - 1);
        classInfo.startDate = helpers.date(arriveDate);
        classInfo.endDate = helpers.date(returnDate);
        // address = helpers.map('project-address', classInfo.address);
        address = classInfo.address;
        classInfo.addressText = address !== '' ? address : '暂未分配';
        romm = classInfo.classRoomName;
        classInfo.rommText = romm !== '' ? romm : '暂未分配';
        diningRoom = classInfo.diningRoom !== null ? classInfo.diningRoom : '暂未分配';
        classInfo.diningRoomText = diningRoom;
        classRoom = classInfo.classRoomName !== null ? classInfo.classRoomName : '暂未分配';
        classInfo.classRoomName = classRoom;
        return classInfo;
    },
    checked: function() {
        var classInfo = this.bindings.classInfo.data;
        return {
            provinceLeaderCheck: classInfo.classDetail.haveProvinceLeader === 1,
            haveMinisterCheck: classInfo.classDetail.haveMinister === 1,
            needGroupPhotoCheck: classInfo.classDetail.needGroupPhoto === 1,
            needVideoCheck: classInfo.classDetail.needVideo === 1,
            needMakeCourseCheck: classInfo.classDetail.needMakeCourse === 1,
            needNetCheck: classInfo.classDetail.needNet === 1
        };
    },
    state: function() {
        var classInfo = this.bindings.classInfo.data,
            url,
            bannerUrl,
            state = this.bindings.state.data;
        if (state.attachmentId) {
            url = this.bindings.down.getFullUrl() + '?id=' + state.attachmentId;
        } else {
            state.attachmentId = classInfo.classDetail.coverId;
            url = this.bindings.down.getFullUrl() + '?id=' + classInfo.classDetail.coverId;
        }
        if (state.bannerId) {
            bannerUrl = this.bindings.down.getFullUrl() + '?id=' + state.bannerId;
        } else if (classInfo.classDetail && classInfo.classDetail.bannerId) {
            state.bannerId = classInfo.classDetail.bannerId;
            bannerUrl = this.bindings.down.getFullUrl() + '?id=' + classInfo.classDetail.bannerId;
        }
        state.downUrl = url;
        state.bannerUrl = bannerUrl;
        state.needGroupPhotoCheck = classInfo.classDetail.needGroupPhoto === 1;
        state.needMakeCourseCheck = classInfo.classDetail.needMakeCourse === 1;
        return state;
    },
    classroomList: function(data) {
        _.map(data.classroomList || [], function(classroom) {
            var item = classroom;
            if (data.classInfo && data.classInfo.classRoom && item.id === data.classInfo.classRoom) {
                item.selected = true;
            }
        });
        return data.classroomList;
    },
    isManageAndSponsor: function() {
        var state = this.bindings.state.data;
        if (state.role === 1 || state.role === 2) {
            return true;
        }
        return false;
    },
    isAssist: function() {
        var state = this.bindings.state.data;
        if (state.role !== 4) {
            return true;
        }
        return false;
    },
    isClassAndManage: function() {
        var state = this.bindings.state.data;
        if (state.role === 1 || state.role === 3) {
            return true;
        }
        return false;
    },
    isSubmit: function() {
        var state = this.bindings.state.data,
            classInfo = this.bindings.classInfo.data;
        if ((state.role === 2 || state.role === 1) && classInfo.confirm === 1) {
            return false;
        }
        return true;
    },
    isService: function() {
        var state = this.bindings.state.data;
        if (state.role === 3) {
            return true;
        }
        return false;
    },
    trainTypes: function(data) {
        var tableTypes = data.trainTypes,
            classTableType = data.classInfo.classDetail.tableType;
        _.map(tableTypes, function(t) {
            var a = t;
            if (classTableType === a.id) {
                a.selected = true;
            } else {
                a.selected = false;
            }
            return a;
        });
        return tableTypes;
    },
    classTypes: function(data) {
        var classTypes = data.classTypes,
            classInfoType = data.classInfo.classInfoType;
        _.map(classTypes, function(t) {
            var c = t;
            if (classInfoType === c.id) {
                c.selected = true;
            } else {
                c.selected = false;
            }
            return c;
        });
        return classTypes;
    }
};

exports.dataForActions = {
    submit: function(payload) {
        return this.validate() ? payload : false;
    },
    save: function(payload) {
        return this.validate() ? payload : false;
    }
};

exports.actionCallbacks = {

};

exports.components = [{
    id: 'photoTime',
    name: 'flatpickr',
    options: {
        enableTime: true
    }
}];

exports.mixin = {
    validate: function() {
        var needGroupPhoto = $(this.$$('[name="needGroupPhoto"]:checked')),
            photoTime = $(this.$('photoTime')),
            needMakeCourse = $(this.$$('[name="needMakeCourse"]:checked')),
            courseVideoRequirement = $(this.$('courseVideoRequirement')),
            otherRequirement = $(this.$('otherRequirement')),
            restRoom = $(this.$('restRoom')),
            diningRoom = $(this.$('diningRoom')),
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g');

        markers.text.valid(photoTime);
        markers.text.valid(courseVideoRequirement);
        markers.text.valid(otherRequirement);
        markers.text.valid(restRoom);
        markers.text.valid(diningRoom);

        if (needGroupPhoto.val() === '1' && photoTime.val() === '') {
            markers.text.invalid(photoTime, validators.required.message);
            flag = false;
        }
        if (needMakeCourse.val() === '1' && courseVideoRequirement.val() === '') {
            markers.text.invalid(courseVideoRequirement, validators.required.message);
            flag = false;
        }
        if (!validators.required.fn(otherRequirement.val())) {
            markers.text.invalid(otherRequirement, validators.required.message);
            flag = false;
        }
        if (courseVideoRequirement.val() !== '' && !validators.maxLength.fn(courseVideoRequirement.val(), 1000)) {
            markers.text.invalid(courseVideoRequirement, validators.maxLength.message.replace(reg, 1000));
            flag = false;
        }
        if (!validators.maxLength.fn(otherRequirement.val(), 1000)) {
            markers.text.invalid(otherRequirement, validators.maxLength.message.replace(reg, 1000));
            flag = false;
        }
        if (this.bindings.state.data.role === 1 || this.bindings.state.data.role === 3) {
            if (!validators.maxLength.fn(restRoom.val(), 200)) {
                markers.text.invalid(restRoom, validators.maxLength.message.replace(reg, 200));
                flag = false;
            }
            if (!validators.maxLength.fn(diningRoom.val(), 200)) {
                markers.text.invalid(diningRoom, validators.maxLength.message.replace(reg, 200));
                flag = false;
            }
        }
        return flag;
    }
};
