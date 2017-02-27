exports.bindings = {
    projects: true
};

exports.components = [{
    id: 'pager',
    name: 'background-pager',
    options: { model: 'projects' }
}];

exports.events = {
    'click project-manage*': 'close'
};

exports.handlers = {
    close: function() {
        this.app.viewport.closeModal();
    }
};

