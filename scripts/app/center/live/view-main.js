var _ = require('lodash/collection');
exports.bindings = {
    lives: true,
    search: false,
    img: false,
};
exports.events = {
    'click to-live-button-*': 'toLive',
    'click to-detail-button-*': 'toDetail'
};

exports.handlers = {
    toLive: function(id) {
        var url = '#/activity/gensee/detail/' + id;
        window.open(url, '_blank');
    },
    toDetail: function(id) {
        var url = '#/activity/gensee/detail/' + id;
        window.open(url, '_blank');
    }
};

exports.components = [{
    id: 'pager', name: 'pager', options: { model: 'lives' }
}];

exports.dataForTemplate = {
    lives: function(data) {
        var lives = data.lives,
            downUrl = this.bindings.img.getFullUrl(),
            defultImg = 'images/default-cover/default_course.jpg';
        _.map(lives, function(opt) {
            var live = opt,
                toLiveButton = { id: 'to-live-button-' + live.id, text: '进入直播' },
                toDetailButton = { id: 'to-detail-button-' + live.id, text: '查看详情' },
                names;
            live.imgUrl = live.cover ? (downUrl + '?id=' + live.cover) : defultImg;
            live.buttons = [];
            if (live.status === 1 || live.status === 3) {
                live.buttons = [toDetailButton];
            } else if (live.status === 2) {
                live.buttons = [toLiveButton];
            }
            if (live.lecturers) {
                names = [];
                live.lecturers.forEach(function(e) {
                    names.push(e.lecturerName);
                });
                live.names = names.join(',');
            }
            return live;
        });
        return lives;
    }
};
