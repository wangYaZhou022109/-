var _ = require('lodash/collection');
exports.bindings = {
    photo: true,
    download: false,
    state: true
};

exports.events = {
    'click upload': 'uploadPhoto',
    'click remove': 'removePhoto',
    'change name-*': 'update'
};

exports.handlers = {
    uploadPhoto: function() {
        var view = this.module.items.upload;
        this.app.viewport.modal(view);
    },
    removePhoto: function() {
        var me = this,
            ids = _.map(this.$$('input[name="photoChecked"]:checked'), 'value');
        if (ids.length === 0) {
            this.app.message.error('请选择要删除的数据');
        } else {
            this.module.dispatch('remove', ids).then(function() {
                me.app.message.success('删除成功');
                me.module.dispatch('init', { classId: me.bindings.state.data.classId });
            });
        }
    },
    update: function(id, events, element) {
        var name = element.value,
            me = this;
        this.module.dispatch('update', {
            id: id,
            name: name
        }).then(function() {
            me.app.message.success('修改成功');
        });
    }
};

exports.dataForTemplate = {
    photo: function(data) {
        var me = this,
            photo = data.photo;
        _.map(photo, function(photos) {
            var oto = photos;
            oto.imageUrl = me.bindings.download.getFullUrl() + '?id=' + oto.thumbnailId;
            return oto;
        });
        return photo;
    }
};
exports.actionCallbacks = {
    removePhoto: function() {

    }
};
