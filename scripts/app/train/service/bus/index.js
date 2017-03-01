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
            url: '../train/busValue'
        },
        optionModel: {
            url: '../train/busValue'
        },
        state: { data: { classId: 3 } },
    },
    callbacks: {
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
                newOption = [],
                index;
            index = state.data.index || optionList.length;
            index++;
            newOption.id = index + '';
            // newOption.classId = state.data.classId;
            newOption.name = index + data;
            newOption.address = index + data;
            newOption.date = index + data;
            newOption.explain = index + data;
            optionList.push(newOption);
            this.models.optionList.changed();
            state.data.index = index;
            state.changed();
        },
        saveOption: function() {
            var optionList = this.models.optionList,
                delOptionList = this.models.delOptionList,
                optionModel = this.models.optionModel,
                me = this;
            optionModel.clear();
            D.assign(me.models.OptionModel.data, {
                newOptionList: JSON.stringify(optionList.data),
                delOptionList: JSON.stringify(delOptionList.data),
            });
            return me.save(me.models.optionModel);
        },
    }
};

exports.beforeRender = function() {
    var classId = this.store.models.state.data;
    this.dispatch('init', classId);
};
