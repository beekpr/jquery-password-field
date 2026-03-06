/**
 * Tests for jquery.password_field.js
 *
 * TDD: tests written against the public plugin API via DOM assertions.
 * zxcvbn is mocked so we control strength scores independently.
 */

const mockZxcvbn = jest.fn().mockReturnValue({ score: 3 });
jest.mock('zxcvbn', () => mockZxcvbn);

const $ = require('../jquery.password_field.js')();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setupInput() {
  document.body.innerHTML = '<input type="password" id="pwd">';
  return $('#pwd');
}

function triggerKeyup($input, val) {
  $input.val(val);
  $input.trigger('keyup');
}

function strength($input) {
  return $input.next().find('.password-strength').attr('data-strength');
}

function validityClass($input, selector) {
  return $input.next().find('.password-validity ' + selector).attr('class');
}

// ---------------------------------------------------------------------------
// strengthIndicator — validity checks
// ---------------------------------------------------------------------------

describe('strengthIndicator — validity', () => {
  let $input;

  beforeEach(() => {
    $input = setupInput();
    $input.strengthIndicator();
  });

  test('empty password: all validity items have "empty" class', () => {
    triggerKeyup($input, '');
    const $items = $input.next().find('.password-validity li');
    $items.each(function () {
      expect($(this).hasClass('empty')).toBe(true);
    });
  });

  test('password too short: length item is invalid', () => {
    triggerKeyup($input, 'Abc1!');
    expect($input.next().find('.password-validity .length').hasClass('invalid')).toBe(true);
  });

  test('password long enough: length item is valid', () => {
    triggerKeyup($input, 'Abcdefg1');
    expect($input.next().find('.password-validity .length').hasClass('valid')).toBe(true);
  });

  test('no uppercase: upper-and-lower item is invalid', () => {
    triggerKeyup($input, 'abcdefg1');
    expect($input.next().find('.password-validity .upper-and-lower').hasClass('invalid')).toBe(true);
  });

  test('no lowercase: upper-and-lower item is invalid', () => {
    triggerKeyup($input, 'ABCDEFG1');
    expect($input.next().find('.password-validity .upper-and-lower').hasClass('invalid')).toBe(true);
  });

  test('has upper and lower: upper-and-lower item is valid', () => {
    triggerKeyup($input, 'Abcdefg1');
    expect($input.next().find('.password-validity .upper-and-lower').hasClass('valid')).toBe(true);
  });

  test('no digit: digits item is invalid', () => {
    triggerKeyup($input, 'Abcdefgh');
    expect($input.next().find('.password-validity .digits').hasClass('invalid')).toBe(true);
  });

  test('has digit: digits item is valid', () => {
    triggerKeyup($input, 'Abcdefg1');
    expect($input.next().find('.password-validity .digits').hasClass('valid')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// strengthIndicator — strength levels
// ---------------------------------------------------------------------------

describe('strengthIndicator — strength levels', () => {
  let $input;

  beforeEach(() => {
    $input = setupInput();
    $input.strengthIndicator();
  });

  test('empty password → strength is "na"', () => {
    triggerKeyup($input, '');
    expect(strength($input)).toBe('na');
  });

  test('invalid password (fails rules) → strength is "invalid"', () => {
    triggerKeyup($input, 'short');
    expect(strength($input)).toBe('invalid');
  });

  test('valid password + zxcvbn score >= 3 → strength is "strong"', () => {
    mockZxcvbn.mockReturnValueOnce({ score: 3 });
    triggerKeyup($input, 'ValidPass1');
    expect(strength($input)).toBe('strong');
  });

  test('valid password + zxcvbn score < 3 → strength is "acceptable"', () => {
    mockZxcvbn.mockReturnValueOnce({ score: 2 });
    triggerKeyup($input, 'ValidPass1');
    expect(strength($input)).toBe('acceptable');
  });

  test('strength text is rendered from settings.strength', () => {
    $input = setupInput();
    $input.strengthIndicator({ strength: { na: 'N/A', invalid: 'Bad', acceptable: 'OK', strong: 'Great' } });

    triggerKeyup($input, '');
    expect($input.next().find('.password-strength-text').text()).toBe('N/A');

    triggerKeyup($input, 'short');
    expect($input.next().find('.password-strength-text').text()).toBe('Bad');
  });
});

// ---------------------------------------------------------------------------
// strengthIndicator — minLength option
// ---------------------------------------------------------------------------

describe('strengthIndicator — minLength option', () => {
  test('custom minLength=10: 9-char password fails length', () => {
    const $input = setupInput();
    $input.strengthIndicator({ minLength: 10 });
    triggerKeyup($input, 'Abcdefgh1'); // 9 chars
    expect($input.next().find('.password-validity .length').hasClass('invalid')).toBe(true);
  });

  test('custom minLength=10: 10-char password passes length', () => {
    const $input = setupInput();
    $input.strengthIndicator({ minLength: 10 });
    triggerKeyup($input, 'Abcdefgh12'); // 10 chars
    expect($input.next().find('.password-validity .length').hasClass('valid')).toBe(true);
  });

  test('sets minlength attribute on input', () => {
    const $input = setupInput();
    $input.strengthIndicator({ minLength: 12 });
    expect($input.attr('minlength')).toBe('12');
  });
});

// ---------------------------------------------------------------------------
// strengthIndicator — mustHaveSpecialChar option
// ---------------------------------------------------------------------------

describe('strengthIndicator — mustHaveSpecialChar', () => {
  test('disabled by default: no special-char list item', () => {
    const $input = setupInput();
    $input.strengthIndicator();
    expect($input.next().find('.password-validity .special-char').length).toBe(0);
  });

  test('enabled: special-char list item is present', () => {
    const $input = setupInput();
    $input.strengthIndicator({ mustHaveSpecialChar: true });
    expect($input.next().find('.password-validity .special-char').length).toBe(1);
  });

  test('enabled + no special char: special-char item is invalid', () => {
    const $input = setupInput();
    $input.strengthIndicator({ mustHaveSpecialChar: true });
    triggerKeyup($input, 'Abcdefg1'); // no special char
    expect($input.next().find('.password-validity .special-char').hasClass('invalid')).toBe(true);
  });

  test('enabled + has special char: special-char item is valid', () => {
    const $input = setupInput();
    $input.strengthIndicator({ mustHaveSpecialChar: true });
    triggerKeyup($input, 'Abcdefg1!');
    expect($input.next().find('.password-validity .special-char').hasClass('valid')).toBe(true);
  });

  test('enabled + no special char: password treated as invalid even if other rules pass', () => {
    const $input = setupInput();
    $input.strengthIndicator({ mustHaveSpecialChar: true });
    triggerKeyup($input, 'Abcdefg1'); // passes all other rules
    expect(strength($input)).toBe('invalid');
  });

  test('special chars recognized: ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ ` { | } ~', () => {
    const specialChars = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    for (const ch of specialChars) {
      const $input = setupInput();
      $input.strengthIndicator({ mustHaveSpecialChar: true });
      triggerKeyup($input, 'Abcdefg1' + ch);
      expect($input.next().find('.password-validity .special-char').hasClass('valid')).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// visibilityToggle
// ---------------------------------------------------------------------------

describe('visibilityToggle', () => {
  let $input;

  beforeEach(() => {
    $input = setupInput();
    $input.visibilityToggle();
  });

  test('inserts a wrapper span after the input', () => {
    expect($input.next('.visiblity-toggle-wrapper').length).toBe(1);
  });

  test('wrapper contains a checkbox', () => {
    expect($input.next().find('input[type="checkbox"]').length).toBe(1);
  });

  test('wrapper contains a label', () => {
    expect($input.next().find('label').length).toBe(1);
  });

  test('input type is "password" initially', () => {
    expect($input.attr('type')).toBe('password');
  });

  test('clicking checkbox changes input type to "text"', () => {
    const $checkbox = $input.next().find('input[type="checkbox"]');
    $checkbox[0].click(); // native click: toggles checkbox state then fires event
    expect($input.attr('type')).toBe('text');
  });

  test('clicking checkbox again restores input type to "password"', () => {
    const $checkbox = $input.next().find('input[type="checkbox"]');
    $checkbox[0].click(); // check
    $checkbox[0].click(); // uncheck
    expect($input.attr('type')).toBe('password');
  });

  test('label gets showLabelClasses initially', () => {
    const $label = $input.next().find('label');
    expect($label.hasClass('fa-eye')).toBe(true);
  });

  test('label swaps classes on toggle', () => {
    const $checkbox = $input.next().find('input[type="checkbox"]');
    const $label = $input.next().find('label');
    $checkbox[0].click();
    expect($label.hasClass('fa-eye-slash')).toBe(true);
    expect($label.hasClass('fa-eye')).toBe(false);
  });

  test('enableTooltip adds title to label', () => {
    $input = setupInput();
    $input.visibilityToggle({ enableTooltip: true, tooltip: 'Show/hide' });
    expect($input.next().find('label').attr('title')).toBe('Show/hide');
  });

  test('tooltip not added when enableTooltip is false', () => {
    expect($input.next().find('label').attr('title')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// passwordField (combined entry point)
// ---------------------------------------------------------------------------

describe('passwordField', () => {
  test('strengthIndicator: true initializes strength indicator', () => {
    const $input = setupInput();
    $input.passwordField({ strengthIndicator: true });
    expect($input.next().find('.password-strength').length).toBe(1);
  });

  test('visibilityToggle: true initializes visibility toggle', () => {
    const $input = setupInput();
    $input.passwordField({ visibilityToggle: true });
    expect($input.next('.visiblity-toggle-wrapper').length).toBe(1);
  });

  test('both options together initialize both features', () => {
    const $input = setupInput();
    $input.passwordField({ strengthIndicator: true, visibilityToggle: true });
    // strengthIndicator inserts first, then visibilityToggle inserts between input and it
    expect($('body').find('.password-strength').length).toBe(1);
    expect($('body').find('.visiblity-toggle-wrapper').length).toBe(1);
  });
});
