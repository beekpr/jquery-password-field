/*
 * Password Visibility Toggle JQuery Plugin
 *
 * Adds password visibility toggle to a password field,
 * by creating a another (text) input field. And switches
 * between the password and the text input fields.
 */
(function ($) {

    $.fn.passwordToggle = function () {

        var docFrag = document.createDocumentFragment();
        var random = [Math.floor(Math.random() * 9999)];
        var randomCheckBoxId = 'data-psswrd-id-' + random;

        var passwordElem = this[0];
        passwordElem.classList.add('visiblity-toggle');
        if (passwordElem === undefined) {
            return;
        }
        var textInputElem = passwordElem.cloneNode();
        textInputElem.type = 'text';
        textInputElem.setAttribute('style', 'display:none;');


        var wrapperElement = document.createElement('span');
        wrapperElement.className = 'visiblity-toggle-wrapper';

        var toggleElem = document.createElement('input');
        toggleElem.id = randomCheckBoxId;
        toggleElem.type = 'checkbox';
        toggleElem.setAttribute('data-psswrd-checkbox', '');

        var toggleLableElem = document.createElement('label');
        toggleLableElem.setAttribute('for', randomCheckBoxId);
        toggleLableElem.className = 'fa fa-eye';
        toggleLableElem.setAttribute('aria-hidden', 'true');
        toggleLableElem.setAttribute('data-psswrd-text', '');

        wrapperElement.appendChild(toggleElem);
        wrapperElement.appendChild(toggleLableElem);

        docFrag.appendChild(textInputElem);
        docFrag.appendChild(wrapperElement);

        //Puts the new elements after the password element
        if (passwordElem.nextSibling) {
            passwordElem.parentNode.insertBefore(docFrag, passwordElem.nextSibling);
        } else {
            passwordElem.parentNode.appendChild(docFrag);
        }


        toggleElem.addEventListener('click', function () {
            if (toggleElem.checked) {
                passwordElem.style.display = 'none';
                textInputElem.style.display = 'inherit';
                toggleLableElem.className = 'fa fa-eye-slash';
            } else {
                passwordElem.style.display = 'inherit';
                textInputElem.style.display = 'none';
                toggleLableElem.className = 'fa fa-eye'
            }
        });

        passwordElem.addEventListener('change', function () {
            textInputElem.value = passwordElem.value;
        });

        textInputElem.addEventListener('change', function () {
            passwordElem.value = textInputElem.value;
        });


    }


}(jQuery));