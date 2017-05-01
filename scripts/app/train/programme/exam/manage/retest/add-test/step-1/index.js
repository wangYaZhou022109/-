var _ = require('lodash/collection');

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        retest: {
            data: {},
            mixin: {
                addMember: function(data) {
                    var temp;
                    if (data.flag) {
                        this.data.members.push(data.member);
                    } else {
                        temp = _.reject(this.data.members, ['id', data.member.id]);
                        this.data.members = temp;
                    }
                }
            }
        },
        exam: {},
        state: {}
    },
    callbacks: {
        init: function(payload) {
            var model = this.models.retest;
            model.set(payload.retest);
            if (!model.data.members && model.data.audienceItems) {
                model.data.members = _.map(model.data.audienceItems, function(item) {
                    return {
                        text: item.joinName,
                        value: item.joinId
                    };
                });
            }
            this.models.exam.set(payload.exam);
            this.models.state.set({
                latestExamId: payload.latestExamId
            });
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};

exports.mixin = {
    getValue: function() {
        return {
            members: this.items.main.getEntities()[0].getValue()
        };
    },
    isValidator: function() {
        return this.items.main.validate();
    }
};

