var $ = require('jquery');
exports.events = {
    'click weektopic': 'showWeektopic',
    'click addclass': 'showAddclass',
    'click topic': 'showTopic',
    'click addtopicclass': 'showAddtopicclass',
    'click addwork': 'showAddwork',
    'click addevaluation-*': 'showAddevaluation',
    'click addexam': 'showAddexam',
    'click minimize-*': 'showMinimize'
};

exports.handlers = {
    showWeektopic: function() {
        var model = this.module.items['center/managements/weektopic'];
        this.app.viewport.modal(model);
    },
    showAddclass: function() {
        var model = this.module.items['center/managements/addclass'];
        this.app.viewport.modal(model);
    },
    showTopic: function() {
        var model = this.module.items['center/managements/topic'];
        this.app.viewport.modal(model);
    },
    showAddtopicclass: function() {
        var model = this.module.items['center/managements/addtopicclass'];
        this.app.viewport.modal(model);
    },
    showAddwork: function() {
        var model = this.module.items['center/managements/addwork'];
        this.app.viewport.modal(model);
    },
    showAddevaluation: function() {
        var model = this.module.items['center/managements/addevaluation'];
        this.app.viewport.modal(model);
    },
    showAddexam: function() {
        var model = this.module.items['center/managements/addexam'];
        this.app.viewport.modal(model);
    },
    showMinimize: function(id) {
        $(this.$('minitable-' + id)).toggle();
        if ($(this.$('minimize-' + id)).text() === '-') {
            $(this.$('minimize-' + id)).text('+').prev().text('最大化');
        } else {
            $(this.$('minimize-' + id)).text('-').prev().text('最小化');
        }
    }
};
