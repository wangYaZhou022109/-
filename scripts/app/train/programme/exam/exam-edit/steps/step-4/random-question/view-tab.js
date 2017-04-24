exports.type = 'dynamic';
exports.bindings = {
    currentStep: true
};

exports.getEntity = function(id) {
    return id;
};
exports.getEntityModuleName = function(id) {
    return 'train/programme/exam/exam-edit/steps/step-4/random-question/step-' + id;
};
exports.dataForEntityModule = function() {
    var me = this;
    return {
        saveTactic: function(params) {
            return me.module.dispatch('saveTactic', params);
        },
        removeTactic: function(params) {
            return me.module.dispatch('removeTactic', params);
        },
        setTacticSummary: function(params) {
            return me.module.dispatch('setTacticSummary', params);
        },
        getAllTactics: function() {
            return me.module.dispatch('getAllTactics');
        },
        getPaperClassTactics: function(params) {
            return me.module.dispatch('getPaperClassTactics', params);
        }
    };
};

exports.events = {
    'click setting-*': 'setTacticStep'
};
exports.handlers = {
    setTacticStep: function(step) {
        this.module.dispatch('setTacticStep', step);
    }
};

exports.dataForTemplate = {
    step: function() {
        var me = this;
        if (me.bindings.currentStep.data.amount) {
            return 1;
        }
        return 2;
    }
};
exports.afterRender = function() {
    this.module.trigger('module.main.view.rendered');
};
