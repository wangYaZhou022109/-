exports.components = function() {
    return [{
        id: 'uploader',
        name: 'uploader',
        options: {
            runtimes: 'html5,flash',
            url: this.module.store.models.upload.getFullUrl(),
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
            flash_swf_url: 'scripts/vendors/upload/Moxie.swf'
        }
    }];
};
