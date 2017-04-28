var maps = require('./app/util/maps'),
    _ = require('lodash/collection'),
    D = require('drizzlejs'),
    OPTION_ALL = '999';

exports.bindings = {
    search: false
};

exports.components = [{
    id: 'type',
    name: 'selectize'
}, {
    id: 'difficulty',
    name: 'selectize'
}, {
    id: 'status',
    name: 'selectize'
}, {
    id: 'create-time',
    name: 'flatpickr',
    options: {
        mode: 'range',
        enableTime: true
    }
}, function() {
    var remote = {
            id: this.app.global.currentUser.rootOrganization.id,
            text: this.app.global.currentUser.rootOrganization.name
        },
        data;

    data = {
        id: 'organization',
        name: 'picker',
        options: {
            module: 'train/programme/question-depot',
            picker: 'owner',
            required: true,
            params: { operatorType: this.app.global.EDIT },
            inputName: 'organizationId',
            data: remote
        }
    };
    return data;
}];

exports.dataForTemplate = {
    type: function(data) {
        var result = maps.get('question-types');
        result.unshift({ key: OPTION_ALL, value: '全部' });
        return _.map(result, function(r) {
            return D.assign(r, {
                checked: data.search.type === r.value
            });
        });
    },
    difficultys: function(data) {
        var result = maps.get('question-difficultys');
        result.unshift({ key: OPTION_ALL, value: '全部' });
        return _.map(result, function(r) {
            return D.assign(r, {
                checked: data.search.difficultys === r.value
            });
        });
    },
    status: function(data) {
        var result = maps.get('publish-status');
        result.unshift({ key: OPTION_ALL, value: '全部' });
        return _.map(result, function(r) {
            return D.assign(r, {
                checked: data.search.status === r.value
            });
        });
    }
};
