var _ = require('lodash/collection');

exports.store = {
    models: {
        entitys: { url: '../human/extention/granted' }
    }
};

exports.afterRender = function() {
    var me = this,
        oldRenderOptions = this.renderOptions,
        extentions = me.app.global.extention[oldRenderOptions.dataType],
        renderOptions;

    _.each(extentions, function(extention) {
        if (!extention.isShow) return;

        renderOptions = {
            key: extention.id,
            objId: oldRenderOptions.objId,
            extention: extention,
            inputName: oldRenderOptions.namePrefix + '_' + extention.configType + '_' + extention.id
        };
        switch (extention.configType) {
        case 1: // 文本式数据
            me.regions.items.show('extention/text', renderOptions);
            break;
        case 2: // 下拉列表式数据
            me.regions.items.show('extention/select', renderOptions);
            break;
        case 3: // 日期型数据
            me.regions.items.show('extention/date', renderOptions);
            break;
        case 4: // 时间型数据
            me.regions.items.show('extention/datetime', renderOptions);
            break;
        case 5: // 选择器数据
            me.regions.items.show('extention/picker', renderOptions);
            break;
        case 6: // 数值型数据
            me.regions.items.show('extention/number', renderOptions);
            break;
        default:
            break;
        }
    });
};
