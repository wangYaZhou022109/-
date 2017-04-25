var _ = require('lodash/collection');

exports.bindings = {
    positionList: true,
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
            } else {
                obj.current = false;
            }
        });
        me.bindings.positionList.changed();
    }
};

exports.dataForTemplate = {
    position: function(data) {
        var positionList = data.positionList;
        var currentPId = this.bindings.currentPId.value;
        var position = {};
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
            if (obj.id === currentPId) {
                position.devPositions = obj.devPositions;
                position.desc = obj.desc;
                position.instructionId = obj.instructionId;
            }
        });
        return position;
    },
    studyList: function(data) {
        var studyList = data.studyList;
        _.map(studyList, function(m) {
            var obj = m;
            var opeText = { 1: '我要学习', 2: '继续学习', 3: '查看详情' };
            obj.opeTxt = opeText[obj.taskStatus];
            obj.btnUrl = '#/study/course/detail/' + obj.pushObject.businessId;
            if (obj.businessType === '2') {
                obj.btnUrl = '#/study/subject/detail/' + obj.pushObject.businessId;
            }
            return obj;
        });
        return studyList;
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
