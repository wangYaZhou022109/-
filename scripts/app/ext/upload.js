var D, jQuery;
D = require('drizzlejs');
jQuery = require('jquery');

D.ComponentManager.register('uploader', function(view, el, options) {
    var instance,
        model = view.bindings[options.model],
        url = model.getFullUrl(),
        opt = D.assign({}, {
            url: url,
            runtimes: 'html5,flash,silverlight,html4',
            chunk_size: '1024mb',
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
                FileFiltered: function(uploader, file) {
                    if (file.name.length > 100) {
                        uploader.removeFile(file);
                        view.app.message.error('文件名称不能超过100个字符长度');
                    }
                },
                FileUploaded: function(loader, file, result) {
                    var arr;
                    if (model && result.status === 200) {
                        arr = JSON.parse(result.response);
                        if (options.signle_file) {
                            model.set({ imgs: arr }, true);
                        } else {
                            model.set({ imgId: arr[0].id, imgs: arr }, true);
                        }
                    }
                }
            }
        }, options);
    jQuery(el).pluploadQueue(opt); // this is return document Object
    instance = jQuery(el).pluploadQueue(); // this is return pluploadQueue Object

    instance.bind('Error', function(it, error) {
        /*eslint-disable */
        if (error.code === plupload.HTTP_ERROR) {
            ajax.handleError(window.app, error.status, error.response && JSON.parse(error.response));
        }
        if (error.code === plupload.FILE_SIZE_ERROR) {
            window.app.message.error('文件太大');
            return false;
        }
        if (error.code === plupload.FILE_EXTENSION_ERROR) {
            window.app.message.error('无效的文件扩展名');
            return false;
        }
        /*eslint-disable */
        return true;
    }, instance, 9);
    if (options.signle_file !== false) {
        instance.bind('QueueChanged', function(u) {
            if (u.files.length > 1) {
                view.app.message.error('只能上传单个文件');
                u.removeFile(u.files[1]);
            }
        });
    }
}, function(view, comp) {
    comp;
});
