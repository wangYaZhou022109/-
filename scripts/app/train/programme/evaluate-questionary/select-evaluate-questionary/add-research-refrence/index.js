var options = require('./app/train/programme/research-activity/add-research-third-party/index'),
    D = require('drizzlejs'),
    obj = D.assign({}, options);

D.assign(obj, {
    RESEARCH_TYPE: 3
});

module.exports = obj;
