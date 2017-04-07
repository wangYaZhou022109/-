var $ = require('jquery');

exports.events = {
    'click evaluate-*': 'toggleEvaluate',
    'click watchexam': 'showWatchexam',
    'click taskdetail-*': 'showTaskdetail',
    'click learndetail-*': 'showLearndetail',
    'click watchbring-*': 'showWatchbring',
    'click watchsurvey': 'showWatchsurvey'
};

exports.handlers = {
    toggleEvaluate: function(id) {
        $(this.$('evaluate-' + id)).addClass('active').siblings().removeClass('active');
        $(this.$('evaluate-content-' + id)).show().siblings().hide();
    },
    showWatchexam: function() {
        var model = this.module.items['center/managements/watchexam'];
        this.app.viewport.modal(model);
    },
    showTaskdetail: function() {
        var model = this.module.items['center/managements/taskdetail'];
        this.app.viewport.modal(model);
    },
    showLearndetail: function() {
        var model = this.module.items['center/managements/learndetail'];
        this.app.viewport.modal(model);
    },
    showWatchbring: function() {
        var model = this.module.items['center/managements/watchbring'];
        this.app.viewport.modal(model);
    },
    showWatchsurvey: function() {
        var model = this.module.items['center/managements/watchsurvey'];
        this.app.viewport.modal(model);
    }
};
