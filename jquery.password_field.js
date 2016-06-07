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
            tooltip: 'Toggle password visibility'
        }, options);

        this.each(function() {
            var checkBoxId = 'password-toggle-id-' + counter;
            counter++;
            var $this = $(this);
            $this.addClass('visibility-toggle');
            $this.attr('autocomplete', 'off');

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
            $fragment.append($toggleWrapper);

            $fragment.insertAfter($this);

            $toggle.click(function () {
                var checked = $(this).is(':checked');
                var focus = $(this).is(':focus');
                $this.attr('type', checked ? 'text' : 'password');
                $this.focus();
                $toggleLabel.toggleClass(settings.hideLabelClasses, checked);
                $toggleLabel.toggleClass(settings.showLabelClasses, !checked);
            });

        });

    }

    $.fn.strengthIndicator = function(options) {

        var settings = $.extend({
            strength: {
                week: 'Week',
                soso: 'So-so',
                okay: 'Okay',
                good: 'Good',
                strong: 'Strong',
                na: ''
            },
            validity: {
                header: 'Your password must have',
                pwd_length: '8 or more characters',
                pwd_upper_and_lower: 'Upper & lowercase letters',
                pwd_digits: 'At least one number'
            }
        }, options);

        this.each(function () {
            var $this = $(this);

            var $fragment = $('<div><div class="password-strength"> \
                    <ul class="password-strength-indicator"> \
                        <li class="strong good okay so-so week"></li> \
                        <li class="strong good okay so-so"></li> \
                        <li class="strong good okay"></li> \
                        <li class="strong good"></li> \
                        <li class="strong"></li> \
                    </ul> \
                    <div class="password-strength-text"><span></span></div> \
                </div> \
                <div class="password-validity-header">' + settings.validity['header'] + '</div> \
                <ul class="password-validity"> \
                    <li class="length">' + settings.validity['pwd_length'] + '</li> \
                    <li class="upper-and-lower">' + settings.validity['pwd_upper_and_lower'] + '</li> \
                    <li class="digits">' + settings.validity['pwd_digits'] + '</li> \
                </ul></div>');

            $fragment.insertAfter($this);


            $this.on('input', function(event) {


                var password = $this.val();

                var hasDigit = /\d/.test(password);
                var hasLower = /[a-z]/.test(password);
                var hasUpper = /[A-Z]/.test(password);

                $fragment.find('.password-validity .digits').toggleClass('valid', hasDigit);
                $fragment.find('.password-validity .upper-and-lower').toggleClass('valid', hasLower && hasUpper);
                $fragment.find('.password-validity .length').toggleClass('valid', password.length >= 8);

                var result = zxcvbn(password);

                console.log(result.score);

                var strength = null;
                if (password) {
                    switch (result.score) {
                        case 4:
                            strength = 'strong';
                            break;
                        case 3:
                            strength = 'good';
                            break;
                        case 2:
                            strength = 'okay';
                            break;
                        case 1:
                            strength = 'soso';
                            break;
                        default:
                            strength = 'week';
                    }
                } else {
                    strength = 'na';
                }

                $fragment.find('.password-strength').attr('data-strength', strength);
                $fragment.find('.password-strength-text').html(settings.strength[strength]);
            });
        })
    }
}(jQuery));