var D, jQuery;
D = require('drizzlejs');
jQuery = require('jquery');

D.ComponentManager.register('uploader', function(view, el, options) {
    var model = view.bindings[options.model],
        url = model.getFullUrl(),
        opt = D.assign({}, {
            url: url,
            runtimes: 'html5,flash',
            chunk_size: '1mb',
            rename: true,
            dragdrop: false,
            filters: {
                max_file_size: '10mb',
                mime_types: [
                    { title: 'Image files', extensions: 'jpg,jpeg,png,bmp,gif,ico,tif' },
                    { title: 'Zip files', extensions: 'zip' }
                ]
            },
            resize: {
                width: 200,
                height: 200,
                quality: 90,
                crop: true // crop to exact dimensions
            },
            flash_swf_url: 'scripts/vendors/upload/Moxie.swf',
            init: {
                FileUploaded: function(loader, file, result) {
                    var arr;
                    if (model && result.status === 200) {
                        arr = JSON.parse(result.response);
                        model.set({ imgId: arr[0].id }, true);
                    }
                }
            }
        }, options);
    jQuery(el).pluploadQueue(opt); // this is return document Object
    return jQuery(el).pluploadQueue(); // this is return pluploadQueue Object
}, function(view, comp) {
    comp;
});
