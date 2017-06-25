var D = require('drizzlejs'),
    _ = require('lodash/collection');
    // businessMap = {
    //     1: 'courseValidate',
    //     2: 'courseValidate',
    //     3: 'examValidate',
    //     4: 'researchValidate',
    //     5: 'classValidate',
    //     6: 'genseeValidate'
    // };

exports.items = {
    main: 'main',
    search: 'search'
};

exports.store = {
    models: {
        tasks: {
            url: '../human/task',
            type: 'pageable',
            root: 'items'
        },
        search: {},
        courseValidate: {},
        examValidate: { url: '../exam/exam/front/validate-exam' },
        researchValidate: {},
        classValidate: {},
        genseeValidate: {}
    },
    callbacks: {
        init: function(payload) {
            D.assign(this.models.tasks.params, payload);
            return this.get(this.models.tasks, { loading: true });
        },
        search: function(payload) {
            this.models.tasks.clear();
            D.assign(this.models.search.data, payload);
            D.assign(this.models.tasks.params, this.models.search.data);
            this.models.search.changed();
            return this.get(this.models.tasks);
        },
        clickTask: function(payload) {
            var tasks = this.models.tasks.data,
                business = _.find(tasks, ['id', payload.id]);
                // validator = this.models[businessMap[business.businessType]],
                // getValidatorPayload = function(b) {
                //     if (b.businessType === 1) return { courseInfoId: b.businessId };
                //     if (b.businessType === 2) return { subjectId: b.businessId };
                //     if (b.businessType === 3) return { examId: b.businessId };
                //     if (b.businessType === 4) return { researchId: b.businessId };
                //     if (b.businessType === 5) return { classId: b.businessId };
                //     if (b.businessType === 6) return { liveId: b.businessId };
                //     return {};
                // };
            // D.assign(validator.data, getValidatorPayload(business));
            // if (validator.url) {
            //     return this.save(validator, { loading: true }).then(function() {
            //         return business;
            //     });
            // }
            return business;
        }
    }
};

exports.afterRender = function() {
    return this.dispatch('init');
};
