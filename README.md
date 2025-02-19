# js-validator

js-validator is a lightweight JavaScript library for client-side form validation. It supports real-time input validation, custom validation rules, and configurable error messages.

## Features

- Validates inputs based on HTML5 constraints (e.g., required, minLength, maxLength, pattern, etc.)
- Supports custom validation rules per input field
- Configurable validation events (submit, input, change, blur)
- Customizable error messages
- Automatic styling for valid and invalid inputs
- Non-intrusive, works with existing forms

## Installation

```sh
npm install @stasies/js-validator
```

Import the libary to your project:

```js
import { validateForm } from "@stasies/js-validator";
```

## Usage

### Basic Example

```html
<form id="myForm">
  <input type="text" name="username" required minlength="3" />
  <input type="email" name="email" required />
  <button type="submit">Submit</button>
</form>

<script>
  const form = document.querySelector("#myForm");
  validateForm(form);
</script>
```

## Configuration Options

You can pass an options object to `validateForm` to customize validation behavior.

```js
const options = {
  validate: "submit", // When to validate: "submit", "input", "change", or "blur"
  colors: {
    error: "red",
    success: "green",
  },
  errorMessages: {
    valueMissing: "This field is required",
    typeMismatch: "Invalid format",
    tooShort: "Input is too short",
  },
  rules: {
    username: [
      (value) => value.length < 3 && "Username must be at least 3 characters",
    ],
    email: [(value) => !value.includes("@") && "Invalid email format"],
  },
};

const form = document.querySelector("#myForm");
validateForm(form, options);
```

## Custom Validation Rules

You can define custom validation rules for specific inputs:

```js
const options = {
  rules: {
    password: [
      (value) => value.length < 6 && "Password must be at least 6 characters",
      (value) =>
        !/[A-Z]/.test(value) && "Password must contain an uppercase letter",
    ],
  },
};
```

## Styling

js-validator automatically applies styles to invalid and valid inputs:

- `.input-invalid` → Applied to invalid inputs (border color changes to `colors.error`).
- `.input-valid` → Applied to valid inputs (border color changes to `colors.success`).
- `.error-message` → Displays error messages below inputs.

You can override styles in your CSS:

```css
.input-invalid {
  border-color: red;
  color: red;
}
.input-valid {
  border-color: green;
  color: green;
}
.error-message {
  color: red;
  font-size: 12px;
}
```

## Events

The library listens to validation events based on the `validate` option:

- **submit** → Validates when the form is submitted.
- **input** → Validates as the user types.
- **change** → Validates when input loses focus.
- **blur** → Validates when the input field loses focus.

## License

MIT License © 2025 Stasies
