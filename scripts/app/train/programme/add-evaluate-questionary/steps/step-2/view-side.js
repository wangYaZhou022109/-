var options = require('./app/train/programme/research-activity/add-research-activity/steps/step-2/view-side'),
    D = require('drizzlejs'),
    obj = D.assign({}, options);

D.assign(obj, {
    HIDE_SCORE: false,
    SOURCE_TYPE: 4
});

module.exports = obj;
