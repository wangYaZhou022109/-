var D = require('drizzlejs');

require('kindeditor/kindeditor-all');
require('kindeditor/lang/zh-CN');

D.ComponentManager.register('rich-text', function(view, el, options) {
    var opt = options || {},
        model = view.bindings[opt.model],
        url = model.getFullUrl(),
        editor, themePath, pluginPath;
    if (!el) return null;
    if (el.getAttribute('x-marker') && view.options.type === 'form') {
        opt.onBlur = function() {
            view.validate(el);
        };
        opt.onChange = function() {
            view.validate(el);
        };
    }

    themePath = '/* @echo KINDEDITOR_THEME */';
    pluginPath = '/* @echo KINDEDITOR_PLUGIN */';

    // @ifndef KINDEDITOR_THEME
    themePath = 'node_modules/kindeditor/themes/';
    pluginPath = 'node_modules/kindeditor/plugins/';
    // @endif

    opt = D.assign({
        themesPath: themePath,
        pluginsPath: pluginPath,
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
    }, opt);
    editor = window.KindEditor.create(el, opt);
    editor.getValue = editor.html;
    editor.validate = function() {
        return true;
    };
    return editor;
}, function(view, comp) {
    comp;
});
