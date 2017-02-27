exports.bindings = {
    classinfos: true
};

exports.components = [{
    id: 'pager', name: 'background-pager', options: { model: 'classinfos' }
}];

exports.dataForTemplate = {
    classinfos: function(data) {
        return data.classinfos;
    }
};

exports.events = {
    'click trainees*': 'showTrainees'
};

exports.handlers = {
    showTrainees: function(id) {
        var model = this.module.items['train/response/trainees'];
        this.app.viewport.modal(model, { classId: id });
    }
};
