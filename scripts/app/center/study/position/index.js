exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        positionList: { url: '../human/position/my', autoLoad: 'after' },
        currentPId: { data: { value: '' } }, // 当前职位id
        studyList: { url: '' }
    },
    callbacks: {
        loadStudy: function(payload) {
            var studyList = this.models.studyList;
            studyList.set({ positionId: payload.currentPId });
            this.get(studyList);
        }
    }
};
