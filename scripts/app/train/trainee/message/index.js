exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        traineeGroups: { url: '../train/trainee-group/trainees' },
        classstaffs: { url: '../train/classstaff/classstaffs' },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var traineeGroups = this.models.traineeGroups;
            var state = this.models.state.data;
            state.classId = payload.classId;
            traineeGroups.clear();
            traineeGroups.params = payload;
            return this.get(traineeGroups);
        },
        csinit: function(payload) {
            var classstaffs = this.models.classstaffs;
            var state = this.models.state.data;
            state.classId = payload.classId;
            classstaffs.clear();
            classstaffs.params = payload;
            return this.get(classstaffs);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', { classId: this.renderOptions.state.classId });
    this.dispatch('csinit', { classId: this.renderOptions.state.classId });
};
