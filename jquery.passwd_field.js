/*
 * Password Visibility Toggle JQuery Plugin
 *
 * Adds password visibility toggle to a password field,
 * by creating a another (text) input field. And switches
 * between the password and the text input fields.
 */
(function ($) {

    var counter = 0;

    /**
     * Adds a visibility toggle to the password field.
     */
    $.fn.visibilityToggle = function (options) {

        var settings = $.extend({
            labelClasses: 'fa',
            showLabelClasses: 'fa-eye',
            hideLabelClasses: 'fa-eye-slash',
            enableTooltip: options != undefined && options.tooltip != undefined,
            tooltip: 'Click to make password visible'
        }, options);

        this.each(function() {
            var checkBoxId = 'password-toggle-id-' + counter;
            counter++;
            var $this = $(this);
            $this.addClass('visibility-toggle');

            var $textInput = $this.clone();
            $textInput.attr('type', 'text');
            $textInput.attr('autocomplete', 'off');
            $textInput.hide();

            var $toggleWrapper = $('<span class="visiblity-toggle-wrapper">');

            var $toggle = $('<input type="checkbox">');
            $toggle.attr('id', checkBoxId);

            var $toggleLabel = $('<label>');
            $toggleLabel.attr('for', checkBoxId);
            $toggleLabel.addClass(settings.labelClasses);
            $toggleLabel.addClass(settings.showLabelClasses)
            $toggleLabel.attr('aria-hidden', 'true');

            if (settings.enableTooltip) {
                $toggleLabel.attr('title', settings.tooltip);
                if (typeof $toggleLabel.tooltip === 'function') {
                    $toggleLabel.tooltip();
                }
            }

            $toggleWrapper.append($toggle, $toggleLabel);

            var $fragment = $(document.createDocumentFragment());
            $fragment.append($textInput, $toggleWrapper);

            $fragment.insertAfter($this);

            $toggle.click(function () {
                var checked = $(this).is(':checked');
                $this.toggle(!checked);
                $textInput.toggle(checked);
                $toggleLabel.toggleClass(settings.hideLabelClasses, checked);
                $toggleLabel.toggleClass(settings.showLabelClasses, !checked);
            });

            $this.change(function() {
                $textInput.val($this.val());
            });

            $textInput.change(function() {
                $this.val($textInput.val());
            });

        });
    }

}(jQuery));