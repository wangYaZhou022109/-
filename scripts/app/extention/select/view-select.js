var D = require('drizzlejs'),
    _ = require('lodash/collection');

exports.bindings = {
    entity: true
};

exports.dataForTemplate = {
    entity: function() {
        return this.bindings.entity.data[0];
    },
    config: function() {
        var me = this,
            extention = this.module.renderOptions.extention;
        D.assign(extention, { notShow: !extention.isShow });
        _.map(extention.extentionOptions, function(extentionOption) {
            if (me.bindings.entity.data[0]) {
                D.assign(extentionOption,
                    { selected: extentionOption.key === me.bindings.entity.data[0].extentionOptionId });
            }
        });
        return this.module.renderOptions.extention;
    },
    inputName: function() {
        return this.module.renderOptions.inputName;
    }
};

exports.components = [{
    id: 'select',
    name: 'selectize'
}];
