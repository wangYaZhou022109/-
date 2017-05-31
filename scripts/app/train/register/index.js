var D = require('drizzlejs');

exports.items = {
    title: 'title',
    step: 'step',
    main: 'main'
};

exports.store = {
    models: {
        state: { data: { step: 'phone' } }
    },
    callbacks: {
        toStep: function(payload) {
            var step = payload.nextStep,
                state = this.models.state,
                course = this.models.course,
                data = D.assign({}, course.data, payload.data);
            course.set(data);
            if (state.data.type === 'add') course.save();
            state.data.step = step;
            state.changed();
        },
        refesh: function(data) {
            this.models.state.data = data;
            this.models.state.changed();
        }
    }
};
