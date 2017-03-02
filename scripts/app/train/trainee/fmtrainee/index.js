exports.items = {
    main: 'main',
    search: 'search',
    'train/trainee/fmtrainee/select-member': { isModule: true }
};

exports.store = {
    models: {
        fmtrainees: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
        addTrainee: { url: '../train/trainee/addTrainee' },
        traineeSort: { url: '../train/trainee/updateSort' },
        fmtrainee: { url: '../train/trainee' },
        projectInfo: {},
        state: { data: { classId: 3, auditStatus: 1 } }
    },
    callbacks: {
        init: function(payload) {
            var fmtrainees = this.models.fmtrainees;
            fmtrainees.params = payload;
            return this.get(fmtrainees);
        },
        search: function(payload) {
            var fmtrainees = this.models.fmtrainees;
            fmtrainees.params = payload;
            return this.get(fmtrainees);
        },
        updateSort: function(payload) {
            var traineeSort = this.models.traineeSort;
            traineeSort.clear();
            traineeSort.params = payload;
            return this.get(traineeSort);
        },
        delete: function(payload) {
            var fmtrainee = this.models.fmtrainee;
            fmtrainee.clear();
            fmtrainee.set(payload);
            return this.del(fmtrainee);
        },
        addTrainee: function(payload) {
            var addTrainee = this.models.addTrainee;
            addTrainee.clear();
            addTrainee.set(payload);
            return this.save(addTrainee);
        }
    }
};

exports.beforeRender = function() {
    var classId = this.store.models.state.data;
    return this.dispatch('init', classId);
};
