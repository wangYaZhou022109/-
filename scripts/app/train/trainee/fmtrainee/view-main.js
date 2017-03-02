var _ = require('lodash/collection');
var $ = require('jquery');

exports.bindings = {
    fmtrainees: true,
    state: true
};

exports.events = {
    'click sort*': 'showSortInput',
    'change input-sort*': 'updateSort',
    'click addTrainee': 'addTrainee'
};

exports.actions = {
    'click agree*': 'agree',
    'click refuse*': 'refuse',
    'click delete*': 'delete'
};

exports.handlers = {
    showMembers: function() {
        var me = this,
            model = me.module.items['train/trainee/fmtrainee/select-member'];
        me.app.viewport.modal(model, {
            callback: function() {
            }
        });
    },
    showSortInput: function(id) {
        $(this.$('input-sort' + id)).css('display', 'block');
        $(this.$('sort' + id)).css('display', 'none');
        $(this.$('delete' + id)).css('display', 'none');
    },
    updateSort: function(id) {
        var me = this;
        var data = {};
        var val = $(this.$('input-sort' + id)).val();
        var classId = this.bindings.state.data;
        if (isNaN(val) || val === '') {
            this.app.message.alert('请输入正整数！');
        } else {
            data.id = id;
            data.sort = val;
            me.module.dispatch('updateSort', data).then(function() {
                $(me.$('input-sort' + id)).css('display', 'none');
                $(me.$('sort' + id)).css('display', 'inline');
                $(me.$('delete' + id)).css('display', 'inline');
                me.module.dispatch('init', classId);
            });
        }
    },
    addTrainee: function() {
        var memberId = this.$$('input[name="add-trainee-input"]')[0].value;
        var classId = this.bindings.state.data;
        var data = {};
        var me = this;
        if (memberId === '') {
            this.app.message.alert('请输入正确的人员编号！');
        } else {
            data.memberId = memberId;
            data.type = 0;
            data.classId = this.bindings.state.data.classId;
            me.module.dispatch('addTrainee', data).then(function(result) {
                var code = result[0];
                if (code === 1) {
                    this.app.message.success('添加成功!');
                    me.module.dispatch('init', classId);
                } else if (code === 888) {
                    this.app.message.error('学员已存在!');
                } else if (code === 666) {
                    this.app.message.error('人员编号不存在！');
                } else if (code === 999) {
                    this.app.message.error('配额已满!');
                } else if (code === 777) {
                    this.app.message.error('尚未配额!');
                }
            });
        }
    }
};

exports.dataForActions = {
    delete: function(data) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '是否确定删除?';
            me.app.message.confirm(message, function() {
                resolve(data);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.actionCallbacks = {
    delete: function() {
        var classId = this.bindings.state.data;
        this.app.message.success('删除成功!');
        this.module.dispatch('init', classId);
    }
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'fmtrainees' }
}];

exports.dataForTemplate = {
    fmtrainees: function(data) {
        var fmtrainees = data.fmtrainees,
            pageNum = this.bindings.fmtrainees.getPageInfo().page;
        fmtrainees.isGroup = false;
        _.forEach(fmtrainees, function(f) {
            if (f.traineeGroup.id) {
                fmtrainees.isGroup = true;
            }
        });
        _.map(fmtrainees || [], function(fmtrainee, i) {
            var e = fmtrainee;
            e.i = i + 1 + ((pageNum - 1) * 10);
        });
        return fmtrainees;
    }
};
