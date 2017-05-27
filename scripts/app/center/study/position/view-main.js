var _ = require('lodash/collection');

exports.bindings = {
    positionList: true,
    currentPosition: true,
    currentPId: true,
    studyList: true,
    download: false
};

exports.events = {
    'click switch-*': 'switch',
};

exports.handlers = {
    switch: function(positionId) {
        var me = this,
            positionList = this.bindings.positionList.data;
        me.bindings.currentPId.value = positionId;
        _.forEach(positionList, function(m) {
            var obj = m;
            if (obj.id === positionId) {
                obj.current = true;
                me.bindings.currentPosition.set(obj);
                me.module.get(me.bindings.currentPosition);
                me.bindings.currentPosition.changed();
            } else {
                obj.current = false;
            }
        });
        me.bindings.positionList.changed();
    }
};

exports.dataForTemplate = {
    position: function(data) {
        var me = this,
            positionList = data.positionList,
            currentPId = this.bindings.currentPId.value,
            position = {};
        if (positionList && positionList.length > 0) {
            if (!currentPId) {
                this.bindings.currentPId.value = positionList[0].id;
            }
            if (this.bindings.currentPId.value === positionList[0].id) {
                positionList[0].current = true;
            }
        }
        _.forEach(positionList, function(m) {
            var obj = m;
            if (obj.id === me.bindings.currentPId.value) {
                position.devPositions = obj.devPositions;
                position.desc = obj.desc;
                position.instructionId = obj.instructionId;
            }
        });
        return position;
    },
    pushObjects: function(data) {
        var index = 1;
        return _.map(data.studyList, function(m) {
            var obj = m;
            var opeText = { 0: '我要学习', 1: '继续学习', 2: '查看详情', 3: '我要学习', 4: '查看详情' };
            obj.i = index++;
            obj.opeTxt = obj.courseStudyProgress && opeText[obj.courseStudyProgress.finishStatus];
            obj.btnUrl = '#/study/course/detail/' + obj.businessId;
            if (obj.businessType === '2') {
                obj.btnUrl = '#/study/subject/detail/' + obj.businessId;
            }
            return obj;
        });
    },
    currentPosition: function(data) {
        _.map(data.currentPosition.studyConfigs || [], function(innerObj, i) {
            var obj = innerObj;
            obj.i = i + 1;
        });
        return data.currentPosition;
    }
};

exports.components = [
    function() {
        var positionList = this.bindings.positionList.data,
            url = '';
        if (positionList && positionList.length > 0) {
            url = this.bindings.download.getFullUrl() + '/' + positionList[0].instructionId;
        }
        return {
            id: 'viewPdf',
            name: 'picker',
            options: {
                picker: 'pdf',
                pdfUrl: url
            }
        };
    }
];
