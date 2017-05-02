var maps = require('./app/util/maps');

exports.components = [{
    id: 'status',
    name: 'selectize'
}];

exports.dataForTemplate = {
    status: function() {
        return maps.get('exam-status');
    }
};

exports.actions = {
    'click search': 'refreshList'
};

exports.dataForActions = {
    refreshList: function() {
        return { status: this.$('status').value };
    }
};
