var parseType = function(ext) {
    var types = {
            xls: 4,
            xlsx: 4,
            doc: 2,
            docx: 2,
            mp4: 1,
            mp3: 2,
            pdf: 3,
            ppt: 5,
            pptx: 5,
            txt: 7,
        },
        defaule = 8;
    return types[ext] || defaule;
};

exports.events = {
    'click choice': 'choice'
};

exports.handlers = {
    choice: function() {
        var me = this,
            view = this.module.items.upload;
        this.app.viewport.modal(view, { callback: function(data) {
            var ext = data.filename.substring(data.filename.lastIndexOf('.') + 1).toLowerCase();
            var name = data.filename.substring(0, data.filename.lastIndexOf('.'));
            me.$('resourceId').value = data.id;
            me.$('fileType').value = ext;
            me.$('type').value = parseType(ext);
            me.$('fileName').value = data.filename;
            me.$('name').value = name;
        } });
    }
};

exports.components = [{
    id: 'select-topic',
    name: 'picker',
    options: {
        picker: 'topics',
        inputName: 'topicIds',
        limit: 4
    }
}, {
    id: 'headFile',
    name: 'picker',
    options: {
        picker: 'upload',
        inputName: 'cover',
        data: {
            btnName: '上传知识封面',
            btnClass: 'block',
            defaultCss: 'block, side-width',
            width: 300,
            height: 200
        }
    }
}, {
    id: 'categoryId',
    name: 'picker',
    options: {
        picker: 'course-category',
        inputName: 'categoryId',
        required: true,
        searchType: 'knowledge',
        data: { id: '64ce1f1b-9596-4d46-9e17-cf236e7f195e', name: '知识目录test' }
    }
}];
