var _ = require('lodash/collection');

var parseType = function(data) {
    var ext = data.toLocaleLowerCase();
    var types = {
            xls: 4,
            xlsx: 4,
            doc: 2,
            docx: 2,
            mp4: 0,
            mp3: 1,
            pdf: 3,
            ppt: 5,
            pptx: 5,
            txt: 7,
            epub: 6
        },
        defaule = 8;
    if (types[ext] === 0) {
        return 0;
    }
    return types[ext] || defaule;
};

exports.bindings = {
    knowledge: true,
    state: true
};

exports.events = {
    'click choice': 'choice',
    'onKeyUp integral': 'filterIntegral'
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

exports.components = [function() {
    var topics = [];
    var knowledge = this.bindings.knowledge.data;
    if (knowledge.businessTopics) {
        _.map(knowledge.businessTopics, function(opt) {
            var topic = opt;
            topics.push({ value: topic.topicId, text: topic.topicName });
        });
    }
    return {
        id: 'select-topic',
        name: 'picker',
        options: {
            picker: 'topics',
            inputName: 'topicIds',
            limit: 5,
            tags: topics
        }
    };
}, function() {
    var btnName = this.app.global.setting['exam.exam.cover-id'];
    var knowledge = this.bindings.knowledge.data;
    var data = {
        id: 'headFile',
        name: 'picker',
        options: {
            picker: 'image-cropper',
            inputName: 'cover',
            width: 180,
            height: 120,
            defaultImg: 'images/default-cover/default_spceial.jpg',
            avatarSize: '250,160',
            data: { btnName: btnName, btnClass: 'block', defaultCss: 'exam-pic' }
        }
    };
    data.options.data.value = knowledge.cover;
    return data;
}, function() {
    var knowledgeCategory = this.bindings.knowledge.data.knowledgeCategory;
    var categoryId = '';
    var categoryName = '';
    if (knowledgeCategory) {
        categoryId = knowledgeCategory.id;
        categoryName = knowledgeCategory.name;
    }
    return {
        id: 'categoryId',
        name: 'picker',
        options: {
            picker: 'course-category',
            inputName: 'categoryId',
            required: true,
            searchType: 'knowledge',
            data: { id: categoryId, name: categoryName }
        }
    };
}];
