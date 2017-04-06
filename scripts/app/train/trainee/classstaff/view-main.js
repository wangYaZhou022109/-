var _ = require('lodash/collection');
var $ = require('jquery');

exports.bindings = {
    classstaffs: true,
    state: false
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'classstaffs' }
}];

exports.events = {
    'click staff-sort*': 'showSortInput',
    'change staff-input-sort*': 'updateSort',
    'click label-callName*': 'showCallNameInput',
    'change input-callName*': 'updateCallName',
    'click addClassstaff': 'addClassstaff',
    'click addAllClassstaff': 'showMembers'
};

exports.actions = {
    'click staff-delete*': 'delete'
};

exports.handlers = {
    showSortInput: function(id) {
        $(this.$('staff-input-sort' + id)).css('display', 'block');
        $(this.$('staff-sort' + id)).css('display', 'none');
        $(this.$('staff-delete' + id)).css('display', 'none');
        $(this.$('staff-shuxian' + id)).css('display', 'none');
    },
    updateSort: function(id) {
        var me = this;
        var data = {};
        var val = $(this.$('staff-input-sort' + id)).val().trim();
        var state = this.bindings.state.data;
        if (isNaN(val) || val === '') {
            this.app.message.alert('请输入整数!');
        } else {
            data.id = id;
            data.sort = val;
            me.module.dispatch('updateSort', data).then(function() {
                me.module.dispatch('init', state);
            });
        }
        $(me.$('staff-input-sort' + id)).css('display', 'none');
        $(me.$('staff-sort' + id)).css('display', 'inline');
        $(me.$('staff-delete' + id)).css('display', 'inline');
        $(me.$('staff-shuxian' + id)).css('display', 'inline');
    },
    showCallNameInput: function(id) {
        $(this.$('input-callName' + id)).css('display', 'block');
        $(this.$('label-callName' + id)).css('display', 'none');
    },
    updateCallName: function(id) {
        var me = this;
        var val = $(this.$('input-callName' + id)).val().trim();
        var state = this.bindings.state.data;
        if (val === '') {
            me.app.message.alert('请输入班务人员称呼!');
        } else {
            me.module.dispatch('changeCallName', { id: id, callName: val }).then(function() {
                me.module.dispatch('init', state);
            });
        }
    },
    addClassstaff: function() {
        var memberName = $(this.$('add-classstaff-input')).val().trim();
        var state = this.bindings.state.data;
        var params = {};
        var me = this;
        if (memberName === '') {
            me.app.message.alert('请输入人员编号!');
        } else {
            params.classId = state.classId;
            params.memberName = memberName;
            me.module.dispatch('addClassstaff', params).then(function(result) {
                if (result[0] === -1) {
                    me.app.message.error('人员编号不存在!');
                } else {
                    me.app.message.success('添加成功!');
                    me.module.dispatch('init', state);
                }
            });
        }
    },
    showMembers: function() {
        var me = this;
        var view = me.module.items['train/trainee/select-member'];
        me.module.dispatch('getMemberIds').then(function(ret) {
            me.app.viewport.modal(view, {
                memberIds: ret[0],
                callback: function(data) {
                    var state = me.bindings.state.data;
                    var params = {};
                    me.app.viewport.closeModal();
                    if (data) {
                        params.classId = state.classId;
                        params.memberIds = data;
                        me.module.dispatch('addAllClassstaff', params).then(function(result) {
                            if (result[0] !== -1) {
                                me.app.message.success('添加成功!');
                                me.module.dispatch('init', state);
                            } else {
                                me.app.message.error('添加失败!');
                            }
                        });
                    }
                }
            });
        });
    }
};

exports.dataForActions = {
    delete: function(data) {
        var me = this;
        var params = { id: data.id, delete: 1 };
        return this.Promise.create(function(resolve) {
            var message = '是否确定删除?';
            me.app.message.confirm(message, function() {
                resolve(params);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    delete: function(data) {
        var state = this.bindings.state.data;
        if (data[0]) {
            this.app.message.success('删除成功!');
        } else {
            this.app.message.error('删除失败!');
        }
        this.module.dispatch('init', state);
    }
};

exports.dataForTemplate = {
    classstaffs: function(data) {
        var classstaffs = data.classstaffs,
            pageNum = this.bindings.classstaffs.getPageInfo().page;
        _.map(classstaffs || [], function(classstaff, i) {
            var e = classstaff;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return classstaffs;
    }
};
