exports.title = '我的消息';

exports.items = {
    main: 'main'
};

exports.store = {
    models: {
        menus: { data: [
            { id: '0', name: '通知', url: 'notice', current: true },
            { id: '1', name: '待办', url: 'wait' },
            { id: '2', name: '@我的', url: 'atme' }
        ] },
        msgCount: { url: '../system/msg-count' }, // 消息数
        state: {
            data: {
                menu: 'notice', // 初始菜单
            }
        }
    },
    callbacks: {
        init: function() {
            if (this.app.global.currentUser.id) {
                this.models.msgCount.clear();
                this.get(this.models.msgCount);
            }
        }
    }
};

exports.afterRender = function() {
    this.dispatch('init');
};
