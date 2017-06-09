var D = require('drizzlejs'),
    swfobject = require('./vendors/image-cropper/swfobject'),
    uploadCallback;


//  注意，这里把回调和Model作为window的变量是由不得的做法
uploadCallback = function(obj) {
    if (obj.type === 'avatarSuccess') {
        window.imageCropperModel.set(obj.data, true);
    }
    if (obj.type === 'avatarError') {
        window.imageCropperModel.set({
            code: 201,
            msg: '上传失败',
        }, true);
    }
    if (obj.type === 'cancel') {
        window.imageCropperModel.set({
            code: 202,
            msg: '取消',
        }, true);
    }
    return true;
};

window.uploadCallback = uploadCallback;

D.ComponentManager.register('image-cropper', function(view, el, options) {
    var model = options.model ? view.bindings[options.model] : null,
        url = model ? model.getFullUrl() : '',
        //  定义组件初始化参数
        flashvars = {
            js_handler: options.callback || 'uploadCallback',
            swfID: 'avatarEdit',
            picSize: options.picSize || '5242880',
            sourceAvatar: options.sourceAvatar || 'images/default-cover/default_news.jpg',
            avatarLabel: '  ',
            // sourceLabel: options.sourceLabel || '保存你的原图吧',
            // sourcePicAPI: 'http://asv5.sinaapp.com/widget/upload.php',
            avatarAPI: url,
            avatarSize: options.avatarSize || '150,150',
            avatarSizeLabel: options.avatarSizeLabel || '上传封面'
        },
        //  定义组件的相关属性
        params = {
            menu: 'false',
            scale: 'noScale',
            allowFullscreen: 'true',
            allowScriptAccess: 'always',
            bgcolor: '',
            wmode: 'transparent' //  can cause issues with FP settings & webcam
        },
        //  定义组件嵌入到页面后的id
        attributes = {
            id: view.id + options.attributeId
        },
        create = function(api) {
            var f = false,
                cropperPath;

            cropperPath = '/* @echo IMAGE_CROPPER */';

            // @ifndef IMAGE_CROPPER
            cropperPath = 'scripts/vendors/image-cropper/';
            // @endif

            //  嵌入组件到相应的html位置，并设置以上定义的相关属性
            swfobject.embedSWF(
                cropperPath + 'avatarUpload.swf',
                view.id + options.id || 'img',
                '100%', '100%', '10.0.0',
                cropperPath + 'expressInstall.swf',
                api, params, attributes
            );
            if (f) uploadCallback();
        },
        opt = {};

    window.imageCropperModel = model;
    create(flashvars);

    return D.assign(opt, options);
}, function(view, comp) {
    comp;
});
