var D = require('drizzlejs');

exports.bindings = {
    entity: true
};

exports.dataForTemplate = {
    entity: function() {
        return this.bindings.entity.data[0];
    },
    config: function() {
        D.assign(this.module.renderOptions.extention, { notShow: !this.module.renderOptions.extention.isShow });
        return this.module.renderOptions.extention;
    },
    rule: function() {
        var rules = ['number'],
            extention = this.module.renderOptions.extention;
        if (extention.isRequired) {
            rules.push('required');
        }
        // TODO 还要判断是否是正数，是否是小数等其他情况
        return rules.join(',');
    },
    inputName: function() {
        return this.module.renderOptions.inputName;
    }
};
