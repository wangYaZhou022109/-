var D = require('drizzlejs');

exports.items = {
    main: 'main',
    search: 'search',
    situation: '',
    import: '',
    group: '',
    groupTrainees: '',
    'train/trainee/select-member': { isModule: true },
    'train/trainee/fmtrainee/group-manage': { isModule: true }
};

exports.store = {
    models: {
        fmtrainees: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
        groupTrainees: {
            url: '../train/trainee/trainees',
            type: 'pageable',
            root: 'items'
        },
        addTrainee: { url: '../train/trainee/add-trainee' },
        memberIds: { url: '../train/trainee/members' },
        addTrainees: { url: '../train/trainee/add-trainees' },
        traineeSort: { url: '../train/trainee/update-sort' },
        fmtrainee: { url: '../train/trainee' },
        situation: { url: '../train/class-quota/situation' },
        download: { url: '../train/trainee/download' },
        dowloadExcel: { url: '../train/trainee/download-excel' },
        uploadExcel: { url: '../train/trainee/import-trainee' },
        group: { url: '../train/trainee-group' },
        groupModel: { url: '../train/trainee-group' },
        updateTraineeGroup: { url: '../train/trainee/update-group' },
        exportGroupTrainee: { url: '../train/trainee/export-group-trainee' },
        delGroups: { data: [] },
        state: { data: { auditStatus: 1 } }
    },
    callbacks: {
        init: function(payload) {
            var fmtrainees = this.models.fmtrainees,
                state = this.models.state.data;
            state.classId = payload.classId;
            fmtrainees.clear();
            fmtrainees.params = state;
            return this.get(fmtrainees);
        },
        search: function(payload) {
            var fmtrainees = this.models.fmtrainees;
            fmtrainees.clear();
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
        },
        addTrainees: function(payload) {
            var addTrainees = this.models.addTrainees;
            addTrainees.clear();
            addTrainees.set(payload);
            return this.save(addTrainees);
        },
        situation: function() {
            var classId = this.models.state.data.classId,
                situation = this.models.situation;
            situation.clear();
            situation.params = { classId: classId };
            return this.get(situation);
        },
        group: function() {
            var classId = this.models.state.data.classId,
                group = this.models.group;
            group.clear();
            group.params = { classId: classId };
            return this.get(group);
        },
        addGroup: function(payload) {
            var groups = this.models.group.data,
                state = this.models.state,
                newGroup = {},
                index;
            index = state.data.index || groups.length;
            index++;
            newGroup.id = 'new-' + index;
            newGroup.classId = state.data.classId;
            newGroup.name = payload.name;
            newGroup.traineeNumber = 0;
            newGroup.sort = index;
            newGroup.deleteFlag = 0;
            groups.push(newGroup);
            this.models.group.changed();
            state.data.index = index;
            state.changed();
        },
        delGroup: function(id) {
            var groups = this.models.group.data,
                delGroups = this.models.delGroups.data,
                delGroup = {},
                index;
            index = groups.findIndex(function(e) {
                return e.id === id;
            });
            groups.splice(index, 1);
            this.models.group.changed();
            delGroup.id = id;
            delGroups.push(delGroup);
        },
        moveUp: function(id) {
            var groups = this.models.group.data,
                target, index, sort;
            index = groups.findIndex(function(e) {
                return e.id === id;
            });
            if (index <= 0) {
                return;
            }
            target = groups[index];
            sort = groups[index - 1].sort;
            groups[index] = groups[index - 1];
            groups[index].sort = target.sort;
            groups[index - 1] = target;
            groups[index - 1].sort = sort;
            this.models.group.changed();
        },
        moveDown: function(id) {
            var groups = this.models.group.data,
                target, index, sort;
            index = groups.findIndex(function(e) {
                return e.id === id;
            });
            if (index >= groups.length - 1) {
                return;
            }
            target = groups[index];
            sort = groups[index + 1].sort;
            groups[index] = groups[index + 1];
            groups[index].sort = target.sort;
            groups[index + 1] = target;
            groups[index + 1].sort = sort;
            this.models.group.changed();
        },
        changeName: function(data) {
            var groups = this.models.group.data,
                target, index;
            index = groups.findIndex(function(e) {
                return e.id === data.id;
            });
            target = groups[index];
            target.name = data.name;
            this.models.group.changed();
        },
        saveGroup: function() {
            var groups = this.models.group,
                state = this.models.state.data,
                delGroups = this.models.delGroups,
                groupModel = this.models.groupModel,
                me = this;
            groupModel.clear();
            D.assign(me.models.groupModel.data, {
                newGroups: JSON.stringify(groups.data),
                delGroups: JSON.stringify(delGroups.data),
                classId: state.classId
            });
            return me.save(me.models.groupModel);
        },
        groupTrainees: function() {
            var groupTrainees = this.models.groupTrainees,
                state = this.models.state.data;
            groupTrainees.clear();
            groupTrainees.params = state;
            return this.get(groupTrainees);
        },
        deleteTraineeGroup: function(payload) {
            var updateTraineeGroup = this.models.updateTraineeGroup;
            updateTraineeGroup.clear();
            updateTraineeGroup.params = { id: payload.id, groupId: '0' };
            return this.get(updateTraineeGroup);
        },
        getMemberIds: function() {
            var memberIds = this.models.memberIds,
                state = this.models.state.data;
            memberIds.clear();
            memberIds.params = { classId: state.classId, type: 0 };
            return this.get(memberIds);
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
