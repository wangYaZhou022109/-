var D = require('drizzlejs');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        positionList: { url: '../human/position/my' },
        currentPId: { data: { value: '' } }, // 当前职位id
        studyList: { url: '../course-study/study-push/position-push' },
        download: { url: '../human/file/preview' }
    },
    callbacks: {
        init: function() {
            var positionList = this.models.positionList;
            var studyList = this.models.studyList;
            var me = this;
            return me.get(positionList).then(function(data) {
                var list = data[0];
                if (list && list.length > 0) {
                    D.assign(studyList.params, {
                        positionId: list[0].id,
                        jobId: list[0].jobId
                    });
                    me.get(studyList);
                }
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init');
};
