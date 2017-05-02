var D = require('drizzlejs');

exports.items = {
    main: 'main'
};


exports.store = {
    models: {
        organizations: {
            url: '../system/grant/granted-organization'
        },
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var organizations = this.models.organizations,
                me = this;

            if (payload.data) {
                D.assign(organizations.params, payload.data);
            }

            if (payload.callback) {
                this.models.state.callback = payload.callback;
            }

            D.assign(organizations.params, { uri: 'course-study/course-info' });
            return this.get(organizations).then(function() {
                var name = me.app.global.currentUser.rootOrganization.name;
                me.models.state.data.organizationName = name;
                me.models.state.changed();
            });
        },
        changeOrganization: function(payload) {
            var state = this.models.state;
            state.data.organizationName = payload.name;
            state.changed();
            return this.models.state.callback({ organizationId: payload.organizationId });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
