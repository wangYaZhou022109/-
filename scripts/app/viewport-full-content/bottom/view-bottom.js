exports.bindings = {
    bottom: true,
    announcements: 'showAnnouncements'
};

function toDateString (value) {
    var d, year, month, date;
    d = new Date(value);
    year = d.getFullYear() + '';
    month = (d.getMonth() + 1) + '';
    date = d.getDate() + '';
    month = month.length === 1 ? '0' + month : month;
    date = date.length === 1 ? '0' + date : date;
    return [year, month, date].join('-');
}

function toTimeString (value, unit) {
    var d, hour, min, sec;
    d = new Date(value);
    hour = d.getHours() + '';
    min = d.getMinutes() + '';
    sec = d.getSeconds() + '';
    hour = hour.length === 1 ? '0' + hour : hour;
    min = min.length === 1 ? '0' + min : min;
    sec = sec.length === 1 ? '0' + sec : sec;
    if (unit === 'minute') {
        return [hour, min].join(':');
    }
    return [hour, min, sec].join(':');
}

exports.showAnnouncements = function() {
    var announcements = this.bindings.announcements.data.items || [],
        dateTime, publishTime;
    if (announcements.length > 0) {
        publishTime = announcements[0].publishTime;
        dateTime = toDateString(publishTime) + ' ' + toTimeString(publishTime);
        this.app.message.success(announcements[0].title + '        ' + dateTime, 7000);
    }
};

