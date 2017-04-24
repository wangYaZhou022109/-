var _ = require('lodash/collection');

exports.type = 'dynamic';

exports.bindings = {
    state: true,
    search: 'searchChanged'
};

exports.getEntity = function() {
    return {
        organizationId: this.bindings.state.data.organizationId
    };
};

exports.getEntityModuleName = function() {
    return 'train/programme/exam/question';
};

exports.dataForEntityModule = function(data) {
    return {
        data: data
    };
};

exports.searchChanged = function() {
    var search = this.bindings.search.data;
    _.forEach(search, function(v, k) {
        if (search[k] === '999') search[k] = null;
    });
    return this.module.dispatch('refreshList');
};
