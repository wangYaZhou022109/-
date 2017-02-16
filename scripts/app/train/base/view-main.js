var helpers = require('./app/util/helpers'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    $ = require('jquery');

exports.bindings = {
    classInfo: true,
    down: false,
    state: true
};

exports.events = {
    'click uploadFile': 'uploadFile',
    'click needGroupPhoto-*': 'changePhotoType',
    'click needVideo-*': 'changeNeedVideo',
    'click needMakeCourse-*': 'changeMakeCourse',
    'click uploadBanner': 'uploadBanner'
};

exports.handlers = {
    uploadFile: function() {
        var view = this.module.items.upload,
            state = this.bindings.state.data;
        state.type = 'cover';
        this.app.viewport.modal(view);
    },
    changePhotoType: function(data) {
        var d = data;
        if (d === '0') {
            $(this.$('photoTime')).val('');
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
        var d = data;
        if (d === '0') {
            $(this.$('courseVideoRequirement')).val('');
            $(this.$('courseVideoRequirement')).attr('readonly', 'readonly');
        } else {
            $(this.$('courseVideoRequirement')).attr('readonly', false);
        }
    },
    uploadBanner: function() {
        var view = this.module.items.upload,
            state = this.bindings.state.data;
        state.type = 'banner';
        this.app.viewport.modal(view);
    }
};

exports.actions = {
    'click submit': 'submit'
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
        address = helpers.map('project-address', classInfo.address);
        classInfo.addressText = address !== '' ? address : '暂未分配';
        romm = helpers.map('class-classroom', classInfo.romm);
        classInfo.rommText = romm !== '' ? romm : '暂未分配';
        diningRoom = classInfo.diningRoom !== null ? classInfo.diningRoom : '暂未分配';
        classInfo.diningRoomText = diningRoom;
        classRoom = classInfo.classRoomName !== null ? classInfo.classRoomName : '暂未分配';
        classInfo.classRoomName = classRoom;
        return classInfo;
    },
    checked: function(data) {
        var classInfo = data.classInfo;
        return {
            tableType1: classInfo.classDetail.tableType === 1,
            tableType2: classInfo.classDetail.tableType === 2,
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
        } else {
            state.bannerId = classInfo.classDetail.bannerId;
            bannerUrl = this.bindings.down.getFullUrl() + '?id=' + classInfo.classDetail.bannerId;
        }
        state.downUrl = url;
        state.bannerUrl = bannerUrl;
        return state;
    }
};

exports.dataForActions = {
    submit: function(payload) {
        return this.validate() ? payload : false;
    }
};

exports.actionCallbacks = {

};

exports.components = [{
    id: 'tableType',
    name: 'selectize'
}, {
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
            needVideo = $(this.$$('[name="needVideo"]:checked')),
            videoRequirement = $(this.$('videoRequirement')),
            needMakeCourse = $(this.$$('[name="needMakeCourse"]:checked')),
            courseVideoRequirement = $(this.$('courseVideoRequirement')),
            otherRequirement = $(this.$('otherRequirement')),
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g');

        markers.text.valid(photoTime);
        markers.text.valid(videoRequirement);
        markers.text.valid(courseVideoRequirement);
        markers.text.valid(otherRequirement);

        if (needGroupPhoto.val() === '1' && photoTime.val() === '') {
            markers.text.invalid(photoTime, validators.required.message);
            flag = false;
        }
        if (needVideo.val() === '1' && videoRequirement.val() === '') {
            markers.text.invalid(videoRequirement, validators.required.message);
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
        if (videoRequirement.val() !== '' && !validators.maxLength.fn(videoRequirement.val(), 1000)) {
            markers.text.invalid(videoRequirement, validators.maxLength.message.replace(reg, 1000));
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
        return flag;
    }
};
