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
    };
    return types[ext] || 8;
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
            me.$('resourceId').value = data.id;
            me.$('fileType').value = ext;
            me.$('type').value = parseType(ext);
            me.$('filename').value = data.filename;
        } });
    }
};

exports.components = [{
    id: 'topicIds',
    name: 'picker',
    options: {
        picker: 'topics',
        inputName: 'topicIds',
        limit: 4,
        tags: []
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
            defaultCss: 'exam-pic',
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
        searchType: 'knowledge'
    }
}];
