var _ = require('lodash/collection'),
    $ = require('jquery');

exports.bindings = {
    Evaluate: true,
    state: true,
    files: true,
    download: false
};

exports.events = {
    'click chooseFile': 'uploadFile'
};

exports.actions = {
    'click submit': 'submit',
    'click del-attach-*': 'delAttach'
};

exports.dataForActions = {
    submit: function(payload) {
        var data = payload,
            files = this.bindings.files.data;
        if (files.length < 1) {
            this.app.message.alert('请上传附件');
        }
        if (data.id === '') {
            data.id = this.bindings.Evaluate.params.id;
        }
        return data;
    },
    delAttach: function(payload) {
        var me = this;
        return this.Promise.create(function(resolve) {
            var message = '是否确认删除';
            me.app.message.confirm(message, function() {
                resolve(payload);
            }, function() {
                resolve(false);
            });
        });
    }
};

exports.handlers = {
    uploadFile: function() {
        var view = this.module.items.upload,
            files = this.bindings.files.data,
            Evaluate = this.bindings.Evaluate.data;
        if (files.length >= 1) {
            this.app.message.alert('附件只能存在1个，请删除后在上传');
        } else {
            Evaluate.classInfo.id = $(this.$('id')).val();
            Evaluate.method = $(this.$('method')).val();
            Evaluate.result = $(this.$('result')).val();
            this.app.viewport.modal(view);
        }
    }
};

exports.actionCallbacks = {
    submit: function() {
        var id = this.bindings.state.data;
        this.app.message.success('保存成功！');
        this.module.dispatch('init', id);
    }
};

exports.dataForTemplate = {
    files: function(data) {
        var me = this;
        _.map(data.files || [], function(file, i) {
            var item = file;
            item.downUrl = me.bindings.download.getFullUrl() + '?id=' + item.attachId;
            item.i = i + 1;
            return item;
        });
        return data.files;
    }
};
