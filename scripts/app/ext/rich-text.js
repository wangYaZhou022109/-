var D = require('drizzlejs');

require('kindeditor/kindeditor-all');
require('kindeditor/lang/zh-CN');

D.ComponentManager.register('rich-text', function(view, el, options) {
    var opt = options || {},
        model = view.bindings[opt.model],
        url = model.getFullUrl();
    D.assign(opt, {
        themesPath: 'node_modules/kindeditor/themes/',
        pluginsPath: 'node_modules/kindeditor/plugins/',
        uploadJson: url,
        filePostName: 'file',
        width: '100%',
        'min-height': 200,
        filterMode: true,
        items: [
            'fontname', 'fontsize', '|',
            'forecolor', 'bold', 'italic', 'underline', 'justifyleft', '|',
            'justifycenter', 'justifyright', 'insertorderedlist', 'insertunorderedlist', '|',
            'image', 'link'
        ]
    });
    return window.KindEditor.create(el, opt);
}, function(view, comp) {
    comp;
});
