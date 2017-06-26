var options = require('./app/exam/exam/base-paper/view-head'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    events = D.assign({}, obj.events),
    handlers = D.assign({}, obj.handlers);

obj.events = events;
D.assign(obj.events, {
    'click close': 'clickClose'
});

obj.handlers = handlers;
D.assign(obj.handlers, {
    clickClose: function() {
        window.close();
    }
});

module.exports = obj;
