var options = require('./app/train/programme/select-research-activity/index'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    items = D.assign({}, obj.items);


obj.items = items;
D.assign(obj.items, {
    'train/programme/evaluate-questionary/select-evaluate-questionary/add-research-refrence': { isModule: true }
});

D.assign(obj, {
    title: function() {
        return '添加评估';
    },
    SELECT_MODULE: 'train/programme/evaluate-questionary/select-evaluate-questionary/add-research-refrence',
    RESEARCH_TYPE: 3
});

module.exports = obj;
