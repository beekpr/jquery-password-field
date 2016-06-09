/*
 * Password Visibility Toggle & Strength indicator JQuery Plugin
 *
 * Visibility Toggle: Adds password visibility toggle to a password
 * field, by creating a another (text) input field. And switches
 * between the password and the text input fields.
 *
 * Strength Indicator: Adds a bar under the password field indicating
 * the strength of the provided password. Also adds a password
 * validity check list (>8 chars, upper and lowercase chars, >1 digit)
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
     * Visibility toggle can be turned on by providing <tt>visibilityToggle</tt> value in the options.
     * <tt>toggle</tt> can be either a <i>Boolean</i> or an toggle options <i>Object</i>.
     *
     * Eg:
     * <code><pre>
     * {
     *   visibilityToggle: true
     * }
     * </pre></code>
     *
     * Eg:
     * <code><pre>
     * {
     *   visibilityToggle: {
     *     enableTooltip: true
     *   }
     * }
     * </pre></code>
     *
     * <b>Strength indicator</b>
     *
     * Strenght indicator can be added to the password field by using <tt>strengthIndicator</tt> value in the options.
     *
     *
     *
     * @param options
     */
    $.fn.passwordField = function(options) {

        if (options && options.strengthIndicator) {
            $(this).strengthIndicator(typeof options.strengthIndicator == 'object' ? options.strengthIndicator : {});
        }
        if (options && options.visibilityToggle) {
            $(this).visibilityToggle(typeof options.visibilityToggle == 'object' ? options.visibilityToggle : {});
        }
    };

    /**
     * Adds a visibility toggle to the password field.
     *
     * Options:
     * - labelClasses - String - space separated list of css classes
     *                  attached to the toggle (label).
     *                  Default: fa (font-awesome)
     * - showLabelClasses - String - space separated list of css classes
     *                      attached to the toggle (label) when password is hidden.
     *                      Default: fa-eye (font-awesome eye icon)
     * - hideLabelClasses - String - space separated list of css classes
     *                      attached to the toggle (label) when password is displayed.
     *                      Default: fa-eye-slash (font-awesome slashed eye icon)
     * - enableTooltip - Boolean - Enables tooltip message on toggle (label)
     *                   Default: if <tt>tooltip</tt> option is provided, it is <tt>true</tt>
     *                   otherwise <tt>false</tt>
     * - tooltip - String - Tooltip message displayed on toggle (label) when mouse is over.
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

    /**
     * Adds a strength indicator under the password field.
     * The indicator has two parts:
     * - a strength indicator base on <a href="https://github.com/dropbox/zxcvbn">zxcvbn</a> library.
     * - a validator based on password rules: > 8 chars, upper and lowercase chars, at lease on digit
     *
     * In the options the displayed texts can be controlled.
     *
     * Example:
     * <code><pre>
     * {
     *   strength_text: {
     *     weak: 'Weak',
     *     okay: 'Okay',
     *     medium: 'Medium',
     *     good: 'Good',
     *     strong: 'Strong',
     *     na: ''
     *   },
     *   validity: {
     *     header: 'Your password must have',
     *     pwd_length: '8 or more characters',
     *     pwd_upper_and_lower: 'Upper & lowercase letters',
     *     pwd_digits: 'At least one number'
     *   }
     * }
     * </pre></code>
     */
    $.fn.strengthIndicator = function(options) {

        var settings = $.extend(true, {
            strength: {
                invalid: 'Invalid',
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
                        <li class="invalid"></li> \
                        <li class="good"></li> \
                        <li class="strong"></li> \
                    </ul> \
                    <div class="password-strength-text"><span><span></span>&nbsp;<i class="help fa fa-question-circle" aria-hidden="true"></i></span></div> \
                </div> \
                <div class="password-validity-header">' + settings.validity['header'] + '</div> \
                <ul class="password-validity"> \
                    <li class="length">' + settings.validity['pwd_length'] + '</li> \
                    <li class="upper-and-lower">' + settings.validity['pwd_upper_and_lower'] + '</li> \
                    <li class="digits">' + settings.validity['pwd_digits'] + '</li> \
                </ul></div>');

            $fragment.insertAfter($this);

            $fragment.find('.password-strength-text').click(function() {
                $fragment.find('.password-validity').toggleClass('show-on-mobile');
            });

            $this.on('input', function(event) {

                var password = $this.val();

                var hasDigit = /\d/.test(password);
                var hasLower = /[a-z]/.test(password);
                var hasUpper = /[A-Z]/.test(password);

                $fragment.find('.password-validity .digits').toggleClass('valid', hasDigit);
                $fragment.find('.password-validity .upper-and-lower').toggleClass('valid', hasLower && hasUpper);
                $fragment.find('.password-validity .length').toggleClass('valid', password.length >= 8);

                var valid = hasDigit && hasLower && hasUpper && password.length >= 8;

                var result = zxcvbn(password);

                var strength = 'na';
                if (password) {
                    switch (result.score) {
                        case 4:
                        case 3:
                            strength = 'strong';
                            break;
                        default:
                            strength = 'good';
                    }

                    if (!valid) {
                        strength = 'invalid';
                    }
                }

                $fragment.find('.password-strength').attr('data-strength', strength);
                $fragment.find('.password-strength-text span span').text(settings.strength[strength]);
            });
        });
    };
}));