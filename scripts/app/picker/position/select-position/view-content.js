var _ = require('lodash/collection');

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'positions' }
}];

exports.title = '选择岗位';

exports.bindings = {
    positions: true
};

exports.events = {
    'click selectPosition*': 'checkPosition'
};

exports.handlers = {
    checkPosition: function(value) {
        var position = _.find(this.bindings.positions.data,
            function(o) {
                return o.id === value;
            });
        this.module.renderOptions.callback(position);
    }
};

exports.searchChange = function() {
    this.module.dispatch('refreshList', this.bindings.search.getQueryParams());
};
