var options = require('./app/train/programme/research-activity/add-research-activity/steps/step-2/view-main'),
    D = require('drizzlejs'),
    obj = D.assign({}, options);

D.assign(obj, {
    HIDE_SCORE: false,
    OPTION_SCORE_MODE: 1
});

module.exports = obj;
