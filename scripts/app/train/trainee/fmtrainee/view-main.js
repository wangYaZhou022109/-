var _ = require('lodash/collection');
var $ = require('jquery');

exports.bindings = {
    fmtrainees: true,
    state: true
};

exports.events = {
    'click addTrainee': 'showMembers',
    'click sort*': 'showSortInput',
    'change input-sort*': 'updateSort'
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
    },
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
