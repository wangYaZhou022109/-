var _ = require('lodash/collection'),
    maps = require('./app/util/maps');
exports.bindings = {
    state: true
};

exports.components = [{
    id: 'scaleSelect',
    name: 'selectize'
}];

exports.dataForTemplate = {
    pdfScale: function(data) {
        var state = data.state,
            pdfScale = maps.get('pdf-scale');
        _.map(pdfScale, function(opt) {
            var scale = opt;
            scale.key = Number(scale.key) / 100;
            if (scale.key === state.scale) {
                scale.selected = true;
            }
            return scale;
        });
        return pdfScale;
    }
};


exports.events = {
    'click turnToPage-*': 'turnToPage',
    'change currentPageNum': 'currentPageNum',
    'change scaleSelect': 'scaleSelect',
    'click zoom-*': 'zoomInOut'
};

exports.handlers = {
    turnToPage: function(flag) {
        var pdf = this.module.items.viewer.components.viewPdf,
            state = this.bindings.state.data || {},
            page = 1,
            me = this;
        if (flag === 'next' && Number(state.pageNum) < Number(state.pageCount)) {
            page = Number(state.pageNum) + 1;
        } else if (flag === 'prev' && Number(state.pageNum) > 1) {
            page = Number(state.pageNum) - 1;
        }
        state.pageNum = page;
        me.$('currentPageNum').value = page;
        pdf.reset(state);
    },
    currentPageNum: function(payload, el) {
        var pdf = this.module.items.viewer.components.viewPdf,
            state = this.bindings.state.data || {},
            page = 1,
            me = this;
        if (Number(el.value) < Number(state.pageCount) && Number(el.value) > 1) {
            page = Number(el.value);
        } else if (Number(el.value) > Number(state.pageCount)) {
            page = Number(state.pageCount);
        } else if (Number(el.value) < 1) {
            page = 1;
        }
        state.pageNum = page;
        me.$('currentPageNum').value = page;
        pdf.reset(state);
    },
    scaleSelect: function(events, el) {
        var pdf = this.module.items.viewer.components.viewPdf,
            state = this.bindings.state.data;
        state.scale = el.value;
        pdf.reset(state);
    },
    zoomInOut: function(data) {
        var pdf = this.module.items.viewer.components.viewPdf,
            payload = {
                type: data,
                currentScale: this.components.scaleSelect.items[0],
                scaleMap: maps.get('pdf-scale')
            };
        this.module.dispatch('zoomInOut', payload).then(function(state) {
            pdf.reset(state);
        });
    }
};
