var _ = require('lodash/collection'),
    maps = require('./app/util/maps');
exports.bindings = {
    works: true
};

exports.dataForTemplate = {
    works: function(data) {
        var works = data.works.items;
        _.map(works || [], function(work) {
            var opt = work,
                course = opt.courseInfo || {};
            opt.source = course.businessType === 0 ? '来自在线课程' : '来自学习专题';
            if (opt.finishStatus === 5) {
                opt.status = '待审核';
                opt.timeStr = '提交时间：';
            } else {
                opt.status = maps.getValue('audit-pass', opt.auditPass);
                opt.timeStr = '评卷时间：';
            }
            if (opt.score) opt.score = Number(opt.score) / 10;
            return opt;
        });
        return works;
    },
    checked: function() {
        var params = this.bindings.works.params;
        return params.finishStatus;
    },
    showMore: function() {
        // var recordCount = this.bindings.works.data.recordCount,
        //     pageSize = this.bindings.works.params.pageSize;
        // if ((!recordCount || recordCount === 0) && pageSize > recordCount) {
        //     return 2;
        // }
        var length = this.bindings.works.data.items.length;
        if (length < 10) {
            return 2;
        }
        return 1;
    }
};

exports.events = {
    'click waitAudit': 'selectWaitAudit',
    'click audit-*': 'auditTask'
};

exports.actions = {
    'click showMore': 'showMore'
};

exports.handlers = {
    selectWaitAudit: function(element, events) {
        var finishStatus = events.checked ? 5 : null;
        this.module.dispatch('refreshList', { finishStatus: finishStatus });
    },
    auditTask: function(id) {
        window.open('#/study/task/audit/' + id);
        this.app.viewport.closeModal();
    }
};
