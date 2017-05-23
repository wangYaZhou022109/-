var _ = require('lodash/collection');
exports.title = '班车餐饮信息统计';
exports.items = {
    bus: 'bus'
};
exports.store = {
    models: {
        bus: {
            url: '../train/bus/member-by-bus'
        },
        detailInsert: {
            url: '../train/bus-detail'
        },
        detaildelete: {
            url: '../train/bus-detail'
        },
    },
    callbacks: {
        init: function(payload) {
            var bus = this.models.bus,
                classId = payload.classId,
                busId = payload.busId;
            bus.set({ id: classId });
            bus.params = { busId: busId };
            return this.get(bus).then(function(data) {
                _.map(data[0] || [], function(cinfo, i) {
                    var e = cinfo;
                    e.flag = true;
                    if (i === 0) {
                        e.show = true;
                    } else {
                        e.show = false;
                    }
                    if (cinfo.busDetails.length == null) {
                        e.flag = false;
                    }
                    return e;
                });
                bus.changed();
                return data;
            });
        },
        sectionDisplay: function(id) {
            var bus = this.models.bus;
            _.map(bus.data || [], function(buss) {
                var busObj = buss;
                if (busObj.id === id) {
                    busObj.show = !busObj.show;
                }
                return busObj;
            });
            bus.changed();
        },
        detailInsert: function(params) {
            var detail = this.models.detailInsert;
            detail.set({ id: params });
            return this.post(detail);
        },
        detaildelete: function(params) {
            var detail = this.models.detaildelete;
            detail.set({ id: params });
            return this.del(detail);
        },
    }
};
exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};
