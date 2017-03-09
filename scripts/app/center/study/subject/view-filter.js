var D = require('drizzlejs'),
    options = require('./app/center/study/course/view-filter');
D.assign(options.events, {
    'click registerTimeOrder': 'registerTimeOrder'
});
D.assign(options.handlers, {
    registerTimeOrder: function() {
        var registerTimeOrder = this.bindings.search.data.registerTimeOrder,
            params = {
                registerTimeOrder: registerTimeOrder === 'desc' ? 'asc' : 'desc'
            };
        this.module.dispatch('search', params);
    }
});
module.exports = options;
