
exports.bindings = {
    targetList: true,
    state: false
};

exports.events = {
    'click move-up-*': 'moveUp',
    'click move-down-*': 'moveDown'
};

exports.handlers = {
    moveUp: function(id) {
        var targetList = this.bindings.targetList.data,
            target,
            index,
            sort;
        index = targetList.findIndex(function(e) {
            return e.id === id;
        });
        if (index <= 0) {
            return;
        }
        target = targetList[index];
        sort = targetList[index - 1].sort;
        targetList[index] = targetList[index - 1];
        targetList[index].sort = target.sort;
        targetList[index - 1] = target;
        targetList[index - 1].sort = sort;
        this.bindings.targetList.changed();
    },
    moveDown: function(id) {
        var targetList = this.bindings.targetList.data,
            target,
            index,
            sort;
        index = targetList.findIndex(function(e) {
            return e.id === id;
        });
        if (index >= targetList.length - 1) {
            return;
        }
        target = targetList[index];
        sort = targetList[index + 1].sort;
        targetList[index] = targetList[index + 1];
        targetList[index].sort = target.sort;
        targetList[index + 1] = target;
        targetList[index + 1].sort = sort;
        this.bindings.targetList.changed();
    }
};

exports.dataForTemplate = {
    targetList: function() {
        var targetList = this.bindings.targetList.data;
        return targetList;
    }
};
