var _ = require('lodash/collection'),
    maps = require('./app/util/maps');
exports.bindings = {
    works: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'works' }
}];

exports.dataForTemplate = {
    works: function(data) {
        var works = data.works;
        _.map(works || [], function(work) {
            var opt = work,
                course = opt.courseInfo || {};
            opt.source = course.businessType === 0 ? '来自在线课程' : '来自学习专题';
            if (opt.finishStatus === 5) {
                opt.status = '待审核';
                opt.timeStr = '提交时间：';
            } else {
                opt.status = maps.get(opt.auditPass);
                opt.timeStr = '评卷时间：';
            }
            return opt;
        });
        return data.works;
    },
    checked: function() {
        var params = this.bindings.works.params;
        return params.finishStatus;
    }
};

exports.events = {
    'click waitAudit': 'selectWaitAudit',
    'click audit-*': 'auditTask'
};

exports.handlers = {
    selectWaitAudit: function(element, events) {
        var finishStatus = events.checked ? 5 : null;
        this.module.dispatch('refreshList', { finishStatus: finishStatus });
    },
    auditTask: function(id) {
        window.open('#/study/task/audit/' + id);
    }
};
