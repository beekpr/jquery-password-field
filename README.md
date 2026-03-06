# jquery-password-field

jQuery plugin that adds password visibility toggle and strength indicator to password fields.

## Used in

- [Monolith](https://github.com/beekpr/beekeeper/blob/c6348c199ea72eff8570125587ec4682c3262507/tickly/beekeeper/frontend_v2/public/bower.json#L8)
- [dashboard-web](https://github.com/beekpr/dashboard-web/blob/1311e45e50ecdd0b99fbccab5ba5c07a418cef20/package.json#L98)
- [app-web](https://github.com/beekpr/app-web/blob/4c6036ef4d27eab2bcc1f9fe729ac39875b31f8b/package.json#L76)


## Features

- **Visibility toggle** - show/hide password via an icon button
- **Strength indicator** - color bar + label powered by [zxcvbn](https://github.com/dropbox/zxcvbn)
- **Validity checklist** - live feedback on password rules (length, case, digits, special chars)

## Usage

```js
$('#password').passwordField({
  visibilityToggle: true,
  strengthIndicator: true
});
```

Or configure each feature separately:

```js
$('#password').visibilityToggle({
  enableTooltip: true,
  tooltip: 'Show/hide password'
});

$('#password').strengthIndicator({
  minLength: 10,
  mustHaveSpecialChar: true,
  strength: {
    invalid: 'Invalid',
    acceptable: 'Acceptable',
    strong: 'Strong',
    na: ''
  },
  validity: {
    header: 'Your password must have',
    passwordLength: '10 or more characters', // defaults to "<minLength> or more characters"
    passwordUpperAndLower: 'Upper & lowercase letters',
    passwordDigits: 'At least one number',
    passwordSpecialChar: 'At least one special character'
  }
});
```

## Options

### `visibilityToggle`

| Option | Type | Default | Description |
|---|---|---|---|
| `labelClasses` | String | `fa` | CSS classes on the toggle label |
| `showLabelClasses` | String | `fa-eye` | Classes when password is hidden |
| `hideLabelClasses` | String | `fa-eye-slash` | Classes when password is shown |
| `enableTooltip` | Boolean | `false` | Show tooltip on toggle |
| `tooltip` | String | `Toggle password visibility` | Tooltip text |

### `strengthIndicator`

| Option | Type | Default | Description |
|---|---|---|---|
| `minLength` | Number | `8` | Minimum password length |
| `mustHaveSpecialChar` | Boolean | `false` | Require a special character |
| `strength` | Object | see above | Labels for each strength level |
| `validity` | Object | see above | Labels for validity checklist items |

## Build

```sh
npm install
npx grunt
```

Outputs `jquery.password_field.min.js` and its source map.


## License

MIT
