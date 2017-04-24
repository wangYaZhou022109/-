var options = require('./app/train/programme/select-research-activity/view-search'),
    D = require('drizzlejs'),
    obj = D.assign({}, options);

module.exports = obj;

D.assign(obj, {
    components: [{
        id: 'create-time',
        name: 'flatpickr',
        options: {
            mode: 'range',
            enableTime: true
        }
    }]
});

module.exports = obj;
