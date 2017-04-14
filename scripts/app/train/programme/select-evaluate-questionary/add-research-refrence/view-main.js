var options = require('./app/train/programme/research-activity/add-research-third-party/view-main'),
    D = require('drizzlejs'),
    obj = D.assign({}, options);

D.assign(obj, {
    ADD_QUESTIONARY: 'train/programme/add-evaluate-questionary/steps/step-2'
});

module.exports = obj;
