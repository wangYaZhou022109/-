var D = require('drizzlejs'),
    $ = require('jquery');

D.ComponentManager.register('checkbox', function(view, el, options) {
    var $el = $(el),
        comp,
        idHead = options.idHead || 'checkbox-head',
        idBody = options.idBody || 'checkbox-body';
    comp = {
        el: $el,
        handler: function(e) {
            var checkboxItem = e.target.children[0] || e.target,
                all = true;
            if (checkboxItem.checked) {
                $(checkboxItem).removeAttr('checked');
            } else {
                $(checkboxItem).attr('checked', 'checked');
            }

            if (checkboxItem.id.indexOf(idHead) > 0) {
                if (checkboxItem.checked) {
                    $(e.currentTarget).find('input[id*=' + idBody + ']').attr('checked', 'checked');
                } else {
                    $(e.currentTarget).find('input[id*=' + idBody + ']').removeAttr('checked');
                }
            } else {
                all = Array.prototype.some.call($(e.currentTarget).find('input[id*=' + idBody + ']'), function(item) {
                    if (item.checked) {
                        return false;
                    }
                    return true;
                });
                if (!all) {
                    $(e.currentTarget).find('input[id*=' + idHead + ']').attr('checked', 'checked');
                } else {
                    $(e.currentTarget).find('input[id*=' + idHead + ']').removeAttr('checked');
                }
            }
        }
    };
    $el.on('click', comp.handler);
    return comp;
}, function(view, comp) {
    comp.el.off('click', '[data-dir]', comp.handler);
    comp.el.off('keypress', 'input', comp.handler);
});
