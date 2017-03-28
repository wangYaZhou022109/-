exports.bindings = {
    announcements: true
};

exports.dataForTemplate = {
    announcements: function() {
        var announcements = this.bindings.announcements.data.items;
        return announcements;
    }
};
