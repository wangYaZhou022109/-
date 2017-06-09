var PAPER_MODULE = 'train/programme/exam/exam-edit/steps/step-4';

exports.type = 'dynamic';

exports.bindings = {
    exam: true
};

exports.getEntity = function() {
    return this.bindings.exam.data;
};

exports.getEntityModuleName = function() {
    return PAPER_MODULE;
};

exports.dataForEntityModule = function(exam) {
    return {
        hidePaperShowRule: 1,
        exam: exam.id ? exam : { paperShowRule: 1, paperSortRule: 1 },
        url: this.module.renderOptions.url,
        isOtherModuleType: 1
    };
};
