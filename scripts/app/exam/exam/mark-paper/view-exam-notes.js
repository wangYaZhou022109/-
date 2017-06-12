var options = require('./app/exam/exam/base-paper/view-exam-notes'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    dataForTemplate = D.assign({}, obj.dataForTemplate);

obj.dataForTemplate = dataForTemplate;
D.assign(obj.dataForTemplate, {
    errors: function(data) {
        return data.state.errors;
    }
});

D.assign(obj, {
    title: '温馨提示'
});

module.exports = obj;
