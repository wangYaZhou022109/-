exports.items = {
    main: 'main',
    edit: '',
    preview: '',
    'train/service/sign/sign-detail': { isModule: true },
    'train/service/sign/sign-leave': { isModule: true }
};

exports.store = {
    models: {
        signs: {
            url: '../train/sign/signs',
            type: 'pageable',
            root: 'items'
        },
        sign: {
            url: '../train/sign'
        },
        batchDelete: {
            url: '../train/sign/batch-delete'
        },
        classDetail: {
            url: '../train/class-detail/find'
        },
        editClassDetail: {
            url: '../train/class-detail/sign'
        },
        autoHalf: {
            url: '../train/sign/auto-half'
        },
        autoFull: {
            url: '../train/sign/auto-full'
        },
        download: {
            url: '../train/sign/down-qr'
        },
        state: { data: {} }
    },
    callbacks: {
        init: function(payload) {
            var state = this.models.state,
                classDetail = this.models.classDetail;
            state.data.classId = payload.classId;
            state.changed();
            classDetail.clear();
            classDetail.params = { id: state.data.classId };
            return this.get(classDetail);
        },
        editType: function(payload) {
            var state = this.models.state,
                editClassDetail = this.models.editClassDetail;
            editClassDetail.clear();
            editClassDetail.set({ classId: state.data.classId, attendanceType: payload });
            return this.put(editClassDetail);
        },
        autoHalf: function() {
            var state = this.models.state,
                autoHalf = this.models.autoHalf;
            autoHalf.set({ classId: state.data.classId });
            return this.save(autoHalf);
        },
        autoFull: function() {
            var state = this.models.state,
                autoFull = this.models.autoFull;
            autoFull.set({ classId: state.data.classId });
            return this.save(autoFull);
        },
        signs: function(payload) {
            var signs = this.models.signs;
            signs.params = payload;
            return this.get(signs);
        },
        preview: function(payload) {
            var sign = this.models.sign;
            sign.set(payload);
            return this.get(sign);
        },
        batchDelete: function(payload) {
            var batchDelete = this.models.batchDelete,
                signs = this.models.signs,
                me = this;
            batchDelete.set(payload);
            me.put(batchDelete).then(function() {
                me.app.message.success('删除成功');
                me.get(signs);
            });
        },
        search: function(payload) {
            var signs = this.models.signs;
            signs.params = payload;
            return this.get(signs);
        },
        editSign: function(payload) {
            var sign = this.models.sign;
            sign.set(payload);
            return this.get(sign);
        },
        del: function(payload) {
            var sign = this.models.sign,
                signs = this.models.signs,
                me = this;
            sign.set(payload);
            this.del(sign).then(function() {
                me.app.message.success('删除成功');
                me.get(signs);
            });
        },
        save: function(payload) {
            var sign = this.models.sign,
                signs = this.models.signs,
                startTime = payload.startTime,
                endTime = payload.endTime,
                lateTime = payload.lateTime,
                me = this;
            if (startTime >= endTime) {
                this.app.message.alert('结束时间必须大于开始时间');
            } else if (lateTime) {
            // } else if (lateTime !== null && lateTime !== '') {
                if (startTime >= lateTime) {
                    this.app.message.alert('迟到时间必须大于开始时间');
                    return false;
                } else if (lateTime >= endTime) {
                    this.app.message.alert('结束时间必须大于迟到时间');
                    return false;
                }
            }
            sign.set(payload);
            return this.save(sign).then(function() {
                me.app.message.success('保存成功');
                me.app.viewport.closeModal();
                me.get(signs);
            });
        },
    }
};

exports.beforeRender = function() {
    var state = this.store.models.state,
        me = this;
    return this.dispatch('init', { classId: this.renderOptions.state.classId }).then(function(data) {
        if (data[0].attendanceType == null || data[0].attendanceType === '' || data[0].attendanceType === 0) {
            me.dispatch('editType', 1);
            me.renderOptions.state.type = 1;
            me.dispatch('autoHalf').then(function(result) {
                if (result[0] > 0) {
                    me.dispatch('signs', { type: 1, classId: me.renderOptions.state.classId });
                }
            });
        } else if (data[0].attendanceType === 1) {
            me.dispatch('signs', { type: 1, classId: me.renderOptions.state.classId });
            state.data.type = 1;
        } else if (data[0].attendanceType === 2) {
            me.dispatch('signs', { type: 2, classId: me.renderOptions.state.classId });
            state.data.type = 2;
        } else if (data[0].attendanceType === 3) {
            me.dispatch('signs', { type: 3, classId: me.renderOptions.state.classId });
            state.data.type = 3;
        }
    });
};
