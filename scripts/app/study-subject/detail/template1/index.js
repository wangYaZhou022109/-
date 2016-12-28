var _ = require('lodash/collection'),
    initLayout;

exports.items = {
    content: 'content'
};
exports.store = {
    models: {
        subject: {},
        layout: {},
        regions: {
            mixin: {
                findByCode: function(code) {
                    return _.find(this.data, {
                        code: code
                    });
                },
                findByModuleCode: function(code) {
                    return _.find(this.data, function(region) {
                        return region.regionModule.code === code;
                    });
                }
            }
        },
        state: {}
    },
    callbacks: {
        init: function(options) {
            var layout = this.models.layout,
                subject = options.subject,
                styles = options.styles;
            this.models.subject.set(subject);
            this.models.regions.set(styles.regions);
            this.models.state.set(options.state);
            layout.set(initLayout(this.models.regions));
            layout.changed();
        }
    }
};


exports.beforeRender = function() {
    this.dispatch('init', this.renderOptions);
};

// 初始化模板布局
initLayout = function(regions) {
    if (regions.data && regions.data.length >= 9) {
        return {
            top: {
                region1: regions.findByCode('region1')
            },
            left: {
                region2: regions.findByCode('region2'),
                region3: regions.findByCode('region3'),
                region4: regions.findByCode('region4'),
                region5: regions.findByCode('region5')
            },
            right: {
                region6: regions.findByCode('region6'),
                region7: regions.findByCode('region7'),
                region8: regions.findByCode('region8'),
                region9: regions.findByCode('region9'),
                region10: regions.findByCode('region10')
            }
        };
    }
    return {};
};
