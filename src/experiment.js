import { validateForm } from "./index.js";
let formComponent = document.querySelectorAll("#newForm")[0];
let options = {
  colors: "sasa",
  validate: "fsfhange", //submit, input, change
  rules: ["invalidRules"],
};
let form = validateForm(formComponent, options);
