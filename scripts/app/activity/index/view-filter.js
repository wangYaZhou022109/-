exports.bindings = {
    search: true
};

exports.events = {
    'click item-*': 'toggleItem'
};

exports.handlers = {
    toggleItem: function(value) {
        return this.module.dispatch('search', { searchStatus: value === 0 ? null : Number(value) });
    }
};


exports.actionCallbacks = {
    getClassSignupInfo: function(data) {
        var classSignupInfo = data[0];
        var nowTime = (new Date()).getTime();
        var url = '#/train/signup/' + classSignupInfo.classId;
        if (classSignupInfo) {
            if (classSignupInfo.isOpen === 0) {
                this.app.message.error('����ѵ����δ���ű���!');
            } else if (nowTime < classSignupInfo.startTime) {
                this.app.message.error('��ǰ��ѵ�౨����δ��ʼ!');
            } else if (nowTime > classSignupInfo.endTime) {
                this.app.message.error('��ǰ��ѵ�౨���ѽ���!');
            } else {
                window.location.href = url;
            }
        } else {
            this.app.message.error('�����벻����!');
        }
    }
};

exports.dataForTemplate = {
    currentStep: function(data) {
        var search = data.search;
        return {
            all: search.searchStatus === 0,
            running: search.searchStatus === 1,
            notStart: search.searchStatus === 2,
            finish: search.searchStatus === 3,
        };
    }
};
