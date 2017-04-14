var D = require('drizzlejs');

exports.items = {
    main: 'main',
    edit: '',
    'train/service/bus/bus-detail': { isModule: true }
};

exports.store = {
    models: {
        buss: {
            url: '../train/bus/buss',
            type: 'pageable',
            root: 'items'
        },
        bus: {
            url: '../train/bus'
        },
        publish: {
            url: '../train/bus/publish'
        },
        undo: {
            url: '../train/bus/undo'
        },
        optionList: {
            url: '../train/bus-value',
            data: []
        },
        optionModel: {
            url: '../train/bus-value'
        },
        state: { data: {} },
        delOptionList: { data: [] },
    },
    callbacks: {
        init: function(payload) {
            var buss = this.models.buss,
                state = this.models.state;
            buss.clear();
            state.data.classId = payload.classId;
            buss.params = state.data;
            return this.get(buss);
        },
        editBus: function(payload) {
            var bus = this.models.bus;
            var optionList = this.models.optionList;
            bus.params = payload;
            bus.clear();
            this.get(bus).then(function(data) {
                optionList.data = data[0].optionList;
                optionList.changed();
            });
        },
        publish: function(payload) {
            this.models.publish.set(payload);
            return this.put(this.models.publish);
        },
        undo: function(payload) {
            this.models.undo.set(payload);
            return this.put(this.models.undo);
        },
        addOption: function(data) {
            var optionList = this.models.optionList.data,
                state = this.models.state,
                newOption = {},
                index;
            index = state.data.index || optionList.length;
            index++;
            newOption.id = 'new-' + index;
            newOption.name = data;
            optionList.push(newOption);
            this.models.optionList.changed();
            state.data.index = index;
            state.changed();
        },
        delOption: function(id) {
            var optionList = this.models.optionList.data,
                delOptionList = this.models.delOptionList.data,
                index,
                delOption = {};
            index = optionList.findIndex(function(e) {
                return e.id === id;
            });
            optionList.splice(index, 1);
            this.models.optionList.changed();
            delOption.id = id;
            delOptionList.push(delOption);
        },
        saveOption: function() {
            var optionList = this.models.optionList,
                delOptionList = this.models.delOptionList,
                optionModel = this.models.optionModel,
                bus = this.models.bus,
                buss = this.models.buss,
                startTime = bus.data.startTime,
                endTime = bus.data.endTime,
                me = this;
            optionModel.clear();
            D.assign(bus.data, {
                optionList: JSON.stringify(optionList.data),
                delOptionList: JSON.stringify(delOptionList.data),
            });
            if (startTime < endTime) {
                if (optionList.data.length > 6) {
                    this.app.message.alert('一条统计主题最多只能发布六个选项');
                } else if (optionList.data.length < 1) {
                    this.app.message.alert('一条统计主题至少需要一个选项');
                } else {
                    me.save(bus).then(function() {
                        me.app.message.success('保存成功');
                        me.app.viewport.closeModal();
                        me.get(buss);
                    });
                }
            } else {
                this.app.message.alert('结束时间必须大于开始时间');
            }
        },
        updateName: function(data) {
            var optionList = this.models.optionList.data,
                target,
                index;
            index = optionList.findIndex(function(e) {
                return e.id === data.id;
            });
            target = optionList[index];
            target.name = data.name;
            target.explain = data.explain;
            this.models.optionList.changed();
        },
        updateExplain: function(data) {
            var optionList = this.models.optionList.data,
                target,
                index;
            index = optionList.findIndex(function(e) {
                return e.id === data.id;
            });
            target = optionList[index];
            target.explain = data.explain;
            this.models.optionList.changed();
        },
        remove: function(payload) {
            var bus = this.models.bus,
                buss = this.models.buss,
                me = this;
            bus.set(payload);
            this.del(bus).then(function() {
                me.app.message.success('删除成功');
                me.get(buss);
            });
        }
    }
};

exports.beforeRender = function() {
    return this.dispatch('init', { classId: this.renderOptions.state.classId });
};
