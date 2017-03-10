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
            url: '../train/busValue',
            data: []
        },
        optionModel: {
            url: '../train/busValue'
        },
        state: { data: { classId: 3 } },
        delOptionList: { data: [] },
    },
    callbacks: {
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
        init: function(payload) {
            var buss = this.models.buss;
            buss.params = payload;
            return this.get(buss);
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
                me = this;
            optionModel.clear();
            D.assign(bus.data, {
                optionList: JSON.stringify(optionList.data),
                delOptionList: JSON.stringify(delOptionList.data),
            });
            console.log(bus.data);
            return me.save(bus);
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
            this.models.optionList.changed();
        },
        remove: function(payload) {
            this.models.bus.set(payload);
            return this.del(this.models.bus);
        }
    }
};

exports.beforeRender = function() {
    var classId = this.store.models.state.data;
    this.dispatch('init', classId);
};
