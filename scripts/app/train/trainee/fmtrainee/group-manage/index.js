exports.title = '分组管理';

exports.items = {
    content: 'content',
    toolbox: 'toolbox',
    list: 'list'
};

exports.store = {
    models: {
        state: { data: {} },
        fmTrainees: { url: '../train/trainee/group-trainees' },
        waitTrainees: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
        updateTraineeGroup: { url: '../train/trainee/update-group' },
        newTrainees: { data: [] }
    },
    callbacks: {
        init: function(payload) {
            var fmTrainees = this.models.fmTrainees,
                state = this.models.state.data;
            state.auditStatus = payload.auditStatus;
            state.groupId = payload.groupId;
            state.classId = payload.classId;
            fmTrainees.clear();
            fmTrainees.params = state;
            return this.get(fmTrainees);
        },
        wait: function(payload) {
            var waitTrainees = this.models.waitTrainees,
                data = {};
            data.classId = payload.classId;
            data.auditStatus = payload.auditStatus;
            data.groupId = 0;
            waitTrainees.clear();
            waitTrainees.params = data;
            return this.get(waitTrainees);
        },
        search: function(payload) {
            var waitTrainees = this.models.waitTrainees;
            waitTrainees.clear();
            waitTrainees.params = payload;
            return this.get(waitTrainees);
        },
        delFm: function(payload) {
            var updateTraineeGroup = this.models.updateTraineeGroup;
            updateTraineeGroup.clear();
            updateTraineeGroup.params = { id: payload.id, groupId: '0' };
            return this.get(updateTraineeGroup);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
    this.dispatch('wait', this.renderOptions);
    this.store.models.newTrainees.clear();
};
