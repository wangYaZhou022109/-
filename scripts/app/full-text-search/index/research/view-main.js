exports.bindings = {
    researchs: true,
    state: false,
    down: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'researchs' }
}];

exports.events = {
    'click research-*': 'showResearchIndex'
};

exports.handlers = {
    showResearchIndex: function(id) {
        window.open('#/exam/research-activity/index/' + id);
    }
};
