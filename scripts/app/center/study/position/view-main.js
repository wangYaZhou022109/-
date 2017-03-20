var _ = require('lodash/collection');

exports.bindings = {
    positionList: true,
    currentPId: true
};

exports.afterRender = function() {
    var me = this,
        currentPId = me.bindings.currentPId.value;
    me.module.dispatch('loadStudy', { currentPId: currentPId });
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
    recordList: function(data) {
        var me = this;
        var currentPId = me.bindings.currentPId.value;
        var positionList = data.positionList;
        if (positionList && positionList.length > 0 && !currentPId) {
            me.bindings.currentPId.value = positionList[0].id;
            positionList[0].current = true;
        }
        return positionList;
    },
    position: function(data) {
        var positionList = data.positionList;
        var currentPId = this.bindings.currentPId.value;
        var position = {};
        _.forEach(positionList, function(m) {
            var obj = m;
            if (obj.id === currentPId) {
                position.devPositions = obj.devPositions;
                position.desc = obj.desc;
                position.instructionId = obj.instructionId;
            }
        });
        return position;
    }
};
