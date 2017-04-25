var D = require('drizzlejs');
var opt = require('./app/study/course/detail/player/video/view-video');

module.exports = D.assign({}, opt, {
    dataForTemplate: {
        url: function(data) {
            var path = data.attachment.path;
            return '/' + path + '?type=mp3';
        }
    }
});
