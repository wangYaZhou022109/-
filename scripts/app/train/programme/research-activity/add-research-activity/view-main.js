exports.type = 'dynamic';

exports.bindings = {
    state: true,
    research: true,
    researchForm: true
};

exports.getEntity = function() {
    return {
        research: this.bindings.research.data || {},
        id: this.bindings.researchForm.data.id
    };
};

exports.dataForEntityModule = function(data) {
    return data;
};

exports.getEntityModuleName = function(step) {
    return 'train/programme/research-activity/add-research-activity/steps/step-' + step;
};

exports.afterRender = function() {
    this.module.trigger('module.main.view.rendered');
};
