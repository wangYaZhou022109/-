var maps = require('./app/util/maps'),
    $ = require('jquery'),
    markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators');

exports.bindings = {
    questions: false
};

// exports.type = 'form';

exports.actions = {
    'click searchQuestion': 'searchQuestion'
};

exports.dataForActions = {
    searchQuestion: function(payload) {
        return this.validate() ? payload : false;
    }
};

exports.components = [function() {
    var obj = {
        id: 'owner',
        name: 'picker',
        options: {
            module: 'exam/question-depot',
            picker: 'owner',
            required: true,
            data: {
                value: this.app.global.currentUser.organization.id,
                text: this.app.global.currentUser.organization.name
            }
        }
    };
    return obj;
}, function() {
    return {
        id: 'question-depot',
        name: 'picker',
        options: {
            picker: 'question-depot',
            required: false,
            inputName: 'questionDepotId',
            params: {
                operatorType: this.app.global.EDIT
            },
            data: {}
        }
    };
}];

exports.dataForTemplate = {
    types: function() {
        return maps.get('question-types');
    },
    difficultys: function() {
        return maps.get('question-difficultys');
    }
};

exports.mixin = {
    validate: function() {
        var organizationId = $(this.$('organizationId')),
            depot = $(this.$('questionDepotId')),
            flag = true;

        markers.text.valid(organizationId);
        markers.text.valid(depot);

        if (organizationId.val() === '') {
            markers.text.invalid(organizationId, validators.required.message);
            flag = false;
        }

        if (depot.val() === '') {
            markers.text.invalid(depot, validators.required.message);
            flag = false;
        }
        return flag;
    }
};
