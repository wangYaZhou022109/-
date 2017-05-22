exports.bindings = {
    search: true
};

exports.components = [{
    id: 'create-time',
    name: 'flatpickr',
    options: {
        mode: 'range',
        enableTime: true
    }
}];

exports.events = {
    'click search': 'search',
    'click btnMember': 'openMember'
};

exports.handlers = {
    search: function() {
        var param = {
            name: this.$('name').value,
            publishMember: this.$('publishMemberName').value,
            createTime: this.$('create-time').value
        };
        this.module.dispatch('search', param);
    },
    openMember: function() {
        var me = this,
            model = me.module.items['train/trainee/select-member-radio'];
        me.app.viewport.modal(model, {
            memberIds: [],
            callback: function(data) {
                me.$('publishMemberId').value = data.id;
                me.$('publishMemberName').value = data.fullName;
            }
        });
    }
};
