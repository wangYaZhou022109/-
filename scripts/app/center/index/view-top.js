exports.bindings = {
    member: true
};

exports.events = {
    'click edit-info': 'showEditInfo'
};

exports.handlers = {
    showEditInfo: function() {
        var model = this.module.items['center/edit'];
        this.app.viewport.modal(model);
    }
};

exports.dataForTemplate = {
    photo: function() {
        var memberDetail = this.bindings.member.memberDetail;
        if (memberDetail && memberDetail.headPortrait) {
            return '/api/v1/human/file/download?id=' + memberDetail.headPortrait;
        }
        return 'images/default-userpic.png';
    }
};
