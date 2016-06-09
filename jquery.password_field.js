/*
 * Password Visibility Toggle JQuery Plugin
 *
 * Adds password visibility toggle to a password field,
 * by creating a another (text) input field. And switches
 * between the password and the text input fields.
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'zxcvbn'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                    zxcvbn = require('zxcvbn');
                }
                else {
                    jQuery = require('jquery')(root);
                    zxcvbn = require('zxcvbn')(root);

                }
            }
            factory(jQuery, zxcvbn);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery, window.zxcvbn);
    }
}(function ($, zxcvbn) {

    var counter = 0;


    /**
     * Adds features to a password field.
     *
     * <b>Visibility toggle</b>
     *
     * Visibility toggle can be turned on by providing <tt>toggle</tt> value in the options.
     * <tt>toggle</tt> can be either a <i>Boolean</i> or an toggle options <i>Object</i>.
     *
     * Eg:
     * <code><pre>
     * {
     *   toggle: true
     * }
     * </pre></code>
     *
     * Eg:
     * <code><pre>
     * {
     *   toggle: {
     *     enableTooltip: true
     *   }
     * }
     * </pre></code>
     *
     * <b>Strength indicator</b>
     *
     * Strenght indicator can be added to the password field by using <tt>strength</tt> value in the options.
     *
     *
     *
     * @param options
     */
    $.fn.passwordField = function(options) {

        if (options && options.strength) {
            $(this).strengthIndicator(typeof options.strength == 'object' ? options.strength : {});
        }
        if (options && options.toggle) {
            $(this).visibilityToggle(typeof options.toggle == 'object' ? options.toggle : {});
        }
    };

    /**
     * Adds a visibility toggle to the password field.
     */
    $.fn.visibilityToggle = function(options) {

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

            var $toggle = $('<input type="checkbox">')
                .attr('id', checkBoxId);

            var $toggleLabel = $('<label>')
                .attr('for', checkBoxId)
                .addClass(settings.labelClasses)
                .addClass(settings.showLabelClasses)
                .attr('aria-hidden', 'true');

            if (settings.enableTooltip) {
                $toggleLabel.attr('title', settings.tooltip);
                if (typeof $toggleLabel.tooltip === 'function') {
                    $toggleLabel.tooltip();
                }
            }

            $toggleWrapper.append($toggle, $toggleLabel);

            $toggleWrapper.insertAfter($this);

            $toggle.click(function () {
                var checked = $(this).is(':checked');
                var focus = $(this).is(':focus');
                $this.attr('type', checked ? 'text' : 'password');
                $this.focus();
                $toggleLabel.toggleClass(settings.hideLabelClasses, checked);
                $toggleLabel.toggleClass(settings.showLabelClasses, !checked);
            });

        });

    };

    $.fn.strengthIndicator = function(options) {

        var settings = $.extend({
            text: {
                weak: 'Weak',
                okay: 'Okay',
                medium: 'Medium',
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
                        <li class="strong good medium okay weak"></li> \
                        <li class="strong good medium okay"></li> \
                        <li class="strong good medium"></li> \
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

                var strength = 'na';
                if (password) {
                    switch (result.score) {
                        case 4:
                            strength = 'strong';
                            break;
                        case 3:
                            strength = 'good';
                            break;
                        case 2:
                            strength = 'medium';
                            break;
                        case 1:
                            strength = 'okay';
                            break;
                        default:
                            strength = 'weak';
                    }
                }

                $fragment.find('.password-strength').attr('data-strength', strength);
                $fragment.find('.password-strength-text').html(settings.text[strength]);
            });
        });
    };
}));