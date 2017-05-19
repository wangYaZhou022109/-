var _ = require('lodash/collection');

exports.title = '分组管理';

exports.items = {
    content: 'content',
    toolbox: 'toolbox',
    list: 'list'
};

exports.large = true;

exports.store = {
    models: {
        state: { data: {} },
        fmTrainees: { url: '../train/trainee/group-trainees' },
        waitTrainees: {
            url: '../train/trainee/wait-group-trainees',
            type: 'pageable',
            root: 'items'
        },
        saveGroupManage: { url: '../train/trainee/save-group-manage' },
        updateTraineeGroup: { url: '../train/trainee/update-group' }
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
            data.groupId = payload.groupId;
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
        },
        save: function(payload) {
            var saveGroupManage = this.models.saveGroupManage;
            saveGroupManage.clear();
            saveGroupManage.params = payload;
            return this.get(saveGroupManage);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions.state);
    this.dispatch('wait', this.renderOptions.state);
};

exports.buttons = [{
    text: '保存',
    fn: function() {
        var me = this,
            fmTrainees = me.store.models.fmTrainees.data,
            state = me.store.models.state.data,
            ids = [];
        _.forEach(fmTrainees, function(fm) {
            ids.push(fm.id);
        });
        me.dispatch('save', {
            classId: state.classId,
            groupId: state.groupId,
            ids: ids.join(',')
        }).then(function(data) {
            if (data) {
                me.app.message.success('保存成功!');
                me.renderOptions.callback(data[0]);
            }
        });
    }
}];
