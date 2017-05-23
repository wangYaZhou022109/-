
exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        positionList: { url: '../human/position/my' },
        currentPId: { data: { value: '' } }, // 当前职位id
        currentPosition: { url: '../human/position' },
        studyList: { url: '../course-study/study-push/push-objects' },
        download: { url: '../human/file/preview' },
    },
    callbacks: {
        init: function() {
            var me = this,
                positionList = me.models.positionList,
                studyList = me.models.studyList,
                currentPosition = me.models.currentPosition;
            return me.get(positionList).then(function() {
                var list = positionList.data;
                if (list.length) {
                    currentPosition.set(list[0]);
                    return me.get(currentPosition).then(function() {
                        if (currentPosition.data && currentPosition.data.studyConfig) {
                            studyList.set({ id: currentPosition.data.studyConfig.studyPushId });
                            return me.get(studyList);
                        }
                        return true;
                    });
                }
                return true;
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
