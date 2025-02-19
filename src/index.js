const OptionsValidator = {
  get(target, prop) {
    if (prop === "colors") {
      if (
        target.colors &&
        (typeof target.colors !== "object" || target.colors === null)
      ) {
        console.warn(
          "Invalid colors object. Defaulting to { error: 'maroon', success: '#5cb85c' }."
        );
        return { error: "maroon", success: "#5cb85c" };
      }
    }

    if (prop === "validate") {
      const validEvents = ["submit", "input", "change", "blur"];
      if (target.validate && !validEvents.includes(target.validate)) {
        console.warn(
          `Invalid validation event '${
            target.validate
          }'. Awailable options: ${validEvents.join(
            ", "
          )}. Defaulting to 'submit'.`
        );
        return "submit";
      }
    }

    if (prop === "rules") {
      if (target.rules && typeof target.rules !== "object") {
        console.warn("Rules should be an object. Ignoring invalid rules.");
        return {};
      }
      for (const [field, ruleArray] of Object.entries(target.rules || {})) {
        if (
          !Array.isArray(ruleArray) ||
          !ruleArray.every((rule) => typeof rule === "function")
        ) {
          console.warn(`Invalid rules for '${field}'. Ignoring.`);
          target.rules[field] = [];
        }
      }
    }

    return target[prop];
  },
};

class FormValidator {
  validationStates = [
    "valueMissing", // true if the input is required but has no value
    "typeMismatch", // true if the input value does not match the expected type (e.g., email, url)
    "patternMismatch", // true if the input value does not match the `pattern` attribute
    "tooLong", // true if the input value exceeds the `maxLength` attribute
    "tooShort", // true if the input value is shorter than the `minLength` attribute
    "rangeUnderflow", // true if the input value is less than the `min` attribute
    "rangeOverflow", // true if the input value is greater than the `max` attribute
    "stepMismatch", // true if the input value does not fit the `step` attribute
    "badInput", // true if the input value is not a valid value (e.g., a number in a text field)
    "customError", // true if a custom error message is set using `setCustomValidity()`
  ];
  constructor(form, options) {
    this.form = form;
    this.isValid = true;
    this.inputs = form.querySelectorAll("input, textarea, select") || [];
    this.options = new Proxy(options, OptionsValidator);
    this.colors = {
      error: this.options?.colors?.error || "maroon",
      success: this.options?.colors?.success || "#5cb85c",
    };
    this.validateOn = this.options?.validate || "submit";
    this.errorMessages = this.options?.errorMessages;
    this.rules = this.options?.rules || {};

    this.init();
  }
  init() {
    this.setupEventListeners();
    this.setStyles();
    this.form.setAttribute("novalidate", true);
  }
  setStyles() {
    if (document.querySelector("#form-validator-styles")) return;
    const style = document.createElement("style");
    style.id = "form-validator-styles";
    style.textContent = `
      .validation-wrapper{
        position: relative;
        display: inherit;
      }
      .input-invalid {
        outline: none;
        border-color: ${this.colors.error};
        color: ${this.colors.error};
      }
      .input-valid {
        outline: none;
        border-color: ${this.colors.success};
        color: ${this.colors.success};
      }
      .error-message {
        color: ${this.colors.error};
        display: block;
        bottom: 4px;
      }
    `;
    document.head.appendChild(style);
  }
  setupEventListeners() {
    this.form.addEventListener("submit", this.validateForm.bind(this));
    this.form.querySelectorAll("input").forEach((input) => {
      if (this.validateOn == "submit") {
        input.addEventListener("input", () => this.clearError(input));
      } else {
        input.addEventListener(this.validateOn, () =>
          this.validateInput(input)
        );
      }
    });
  }
  validateForm(event) {
    event.preventDefault();
    this.isValid = true;

    this.inputs.forEach((input) => {
      if (!this.validateInput(input)) {
        this.isValid = false;
      }
    });
    if (this.isValid) {
      this.form.submit();
    }
  }
  validateInput(input) {
    let wrapper = input.closest(".validation-wrapper");

    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.classList.add("validation-wrapper");
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    }

    let errorMessage = "";

    this.validationStates.forEach((state) => {
      if (input.validity[state]) {
        errorMessage = this.errorMessages?.[state] || input.validationMessage;
      }
    });

    if (!errorMessage && this.rules[input.name]) {
      this.rules[input.name].forEach((rule) => {
        const error = rule(input.value);
        if (error) errorMessage = error;
      });
    }
    if (errorMessage) {
      this.showError(input, errorMessage);
      return false;
    } else {
      input.classList.add("input-valid");
      this.clearError(input);
      return true;
    }
  }
  showError(input, message) {
    input.classList.add("input-invalid");
    input.classList.remove("input-valid");

    let errorSpan = input.parentNode.querySelector(".error-message");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.classList.add("error-message");
      input.parentNode.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
    input.setAttribute(
      "aria-describedby",
      errorSpan.id || "error-" + input.name
    );
  }
  clearError(input) {
    input.classList.remove("input-invalid");

    const errorSpan = input.parentNode.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.remove();
    }
  }
}

const validateFormComponent = function (form) {
  if (!(form instanceof HTMLFormElement)) {
    throw new TypeError(
      "FormValidator expects a valid <form> element as the first argument."
    );
  }
  let inputs = form.querySelectorAll("input, textarea, select");
  if (!inputs.length) {
    console.warn("No inputs for validation");
  }
};

const validateForm = (form, options = {}) => {
  validateFormComponent(form);
  return new FormValidator(form, options);
};

export { validateForm };
