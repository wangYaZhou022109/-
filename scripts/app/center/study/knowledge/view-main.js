var _ = require('lodash/collection'),
    helpers = require('./app/util/helpers');
exports.bindings = {
    list: true,
    img: false
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'list' }
}];

exports.dataForTemplate = {
    list: function(data) {
        var list = data.list,
            downUrl = this.bindings.img.getFullUrl(),
            defultImg = '';
        _.map(list, function(opt) {
            var obj = opt;
            if (obj.type === '0') {
                defultImg = 'images/default-cover/default_mp4.jpg';
            } else if (obj.type === '1') {
                defultImg = 'images/default-cover/default_mp3.jpg';
            } else if (obj.type === '2') {
                defultImg = 'images/default-cover/default_doc.jpg';
            } else if (obj.type === '3') {
                defultImg = 'images/default-cover/default_pdf.jpg';
            } else if (obj.type === '4') {
                defultImg = 'images/default-cover/default_xls.jpg';
            } else if (obj.type === '5') {
                defultImg = 'images/default-cover/default_ppt.jpg';
            } else if (obj.type === '6') {
                defultImg = 'images/default-cover/default_epub.jpg';
            } else {
                defultImg = 'images/default-cover/default_txt.jpg';
            }
            obj.imgUrl = obj.cover ? (downUrl + '?id=' + obj.cover) : defultImg;
            obj.prefixText = '上传时间：' + helpers.dateMinute(obj.uploadTime);

            obj.downloadMemberCount = obj.downloadMemberCount == null ? 0 : obj.downloadMemberCount;
            obj.browseCount = obj.browseCount == null ? 0 : obj.browseCount;
            obj.downAndViewText = '下载：' + obj.downloadMemberCount + ' ｜ 浏览：' + obj.browseCount;
            obj.btnUrl = '#/course-study/knowledge/detail/' + obj.id;
            return obj;
        });
        return list;
    }
};
