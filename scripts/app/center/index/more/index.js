
exports.items = {
    main: 'main'
};

exports.title = '公告';

exports.store = {
    models: {
        announcements: { url: '../system/operation/announcement/person-list-all' } // 公告
    },
    callbacks: {
        init: function() {
            var announcements = this.models.announcements;
            announcements.clear();
            this.get(announcements);
        }
    }
};

exports.beforeRender = function() {
    this.dispatch('init');
};

exports.afterRender = function() {
    this.renderOptions.callback();
};
