var D = require('drizzlejs');

exports.type = 'dynamic';

exports.bindings = {
    retest: true,
    exam: true
};

exports.getEntity = function() {
    return D.assign(this.bindings.retest.data, {
        ownedOrganizationId: this.bindings.exam.data.ownerOrganization.id
    });
};

exports.getEntityModuleName = function() {
    return 'exam/exam/exam-edit/steps/step-2';
};

exports.dataForEntityModule = function(data) {
    return { exam: data };
};
