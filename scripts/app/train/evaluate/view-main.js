var markers = require('./app/ext/views/form/markers'),
    validators = require('./app/ext/views/form/validators'),
    _ = require('lodash/collection'),
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
        return this.validate() ? data : false;
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
            if (Evaluate) {
                Evaluate.method = $(this.$('method')).val();
                Evaluate.result = $(this.$('result')).val();
            }
            this.app.viewport.modal(view);
        }
    }
};

exports.actionCallbacks = {
    submit: function() {
        var classId = this.bindings.state.data.classId;
        this.app.message.success('保存成功！');
        this.module.dispatch('init', { id: { classId: classId } });
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

exports.mixin = {
    validate: function() {
        var result = $(this.$('result')),
            method = $(this.$('method')),
            flag = true,
            reg = new RegExp('\\{' + 0 + '\\}', 'g');

        markers.text.valid(result);
        markers.text.valid(method);

        if (method.val() === '') {
            markers.text.invalid(method, validators.required.message);
            flag = false;
        }
        if (result.val() === '') {
            markers.text.invalid(result, validators.required.message);
            flag = false;
        }
        if (method.val() !== '' && !validators.maxLength.fn(method.val(), 100)) {
            markers.text.invalid(method, validators.maxLength.message.replace(reg, 100));
            flag = false;
        }
        if (result.val() !== '' && !validators.maxLength.fn(result.val(), 2000)) {
            markers.text.invalid(result, validators.maxLength.message.replace(reg, 2000));
            flag = false;
        }
        return flag;
    }
};
