var D = require('drizzlejs'),
    options = require('./app/center/study/course/view-filter');
D.assign(options.events, {
    'click studyTimeOrder': 'studyTimeOrder'
});
D.assign(options.handlers, {
    studyTimeOrder: function() {
        var studyTimeOrder = this.bindings.search.data.studyTimeOrder,
            params = {
                studyTimeOrder: studyTimeOrder === 'desc' ? 'asc' : 'desc'
            };
        this.module.dispatch('search', params);
    }
});
module.exports = options;
