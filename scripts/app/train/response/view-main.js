exports.bindings = {
    classinfos: true
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'classinfos' }
}];

exports.dataForTemplate = {
    classinfos: function(data) {
        return data.classinfos;
    }
};

exports.events = {
    'click trainees*': 'showTrainees',
    'click organizations*': 'showOrganizations',
    'click pagers*': 'showPapers'
};

exports.handlers = {
    showTrainees: function(id) {
        var model = this.module.items['train/response/trainees'];
        this.app.viewport.modal(model, { classId: id });
    },
    showOrganizations: function(id) {
        var model = this.module.items['train/response/organizations'];
        this.app.viewport.modal(model, { classId: id });
    },
    showPapers: function(id) {
        var model = this.module.items['train/response/papers'];
        this.app.viewport.modal(model, { classId: id });
    },
};
