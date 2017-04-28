var maps = require('./app/util/maps'),
    _ = require('lodash/collection');

exports.type = 'form';

exports.bindings = {
    searchParam: true,
    currentOrg: true
};

exports.actions = {
    'click searchPapers': 'refreshList'
};

exports.events = {
    'click selectPapers': 'selectPapers'
};

exports.handlers = {
    selectPapers: function() {
        var mod = this.module.items['paper-list'],
            paperArr = mod.$$('[name = selectBox]:checked'),
            arr = _.map(paperArr, function(obj) {
                return obj.value;
            });
        this.module.module.dispatch('', arr);
        this.app.viewport.closePopup();
    }
};


exports.components = [{
    id: 'is-subjective',
    name: 'selectize'
}, {
    id: 'start-time',
    name: 'pickadate'
}, {
    id: 'end-time',
    name: 'pickadate'
}, function() {
    return {
        id: 'owner',
        name: 'picker',
        options: {
            module: 'exam/paper',
            picker: 'owner',
            required: false,
            data: {}
        }
    };
}];

exports.dataForTemplate = {
    isSubjectives: function(data) {
        var isSubjectives = maps.get('yes-or-no');
        if (data.searchParam.isSubjective) {
            _.map(isSubjectives, function(t) {
                var obj = t;
                if (Number(obj.key) === data.searchParam.isSubjective) {
                    obj.selected = true;
                }
            });
        }
        return isSubjectives;
    }
};

exports.dataForActions = {
    refreshList: function(payload) {
        return this.validate() ? payload : false;
    }
};

exports.afterRender = function() {
    this.module.dispatch('refreshList', this.bindings.searchParam.getQueryParams());
};
