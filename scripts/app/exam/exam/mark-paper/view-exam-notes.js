var options = require('./app/exam/exam/base-paper/view-exam-notes'),
    D = require('drizzlejs'),
    obj = D.assign({}, options),
    dataForTemplate = D.assign({}, obj.dataForTemplate);

obj.dataForTemplate = dataForTemplate;
D.assign(obj.dataForTemplate, {
    errors: function(data) {
        return '您有' + data.state.errors.length + '题还没有评分，请评分完整才可以进行提交';
    }
});

D.assign(obj, {
    title: '温馨提示'
});

module.exports = obj;
