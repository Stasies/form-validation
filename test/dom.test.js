import { validateForm } from "../src/index.js"; // Import your library
import { expect, jest } from "@jest/globals";

describe("FormValidator", () => {
  let form, input, validator;
  beforeEach(() => {
    // Create a form dynamically
    document.body.innerHTML = `
      <form id="testForm">
        <input type="email" name="email" required />
        <button type="submit">Submit</button>
      </form>
    `;
    jest.spyOn(console, "warn").mockImplementation(() => {}); // Suppress errors

    form = document.querySelector("#testForm");
    input = document.querySelector("input");

    validateForm(form, {
      colors: { error: "red", success: "green" },
      validate: "submit",
      errorMessages: {
        valueMissing: "Email is required.",
        typeMismatch: "Invalid email format.",
      },
    });
  });

  test("should show an error when the input is empty and submitted", () => {
    form.dispatchEvent(new Event("submit"));

    expect(input.classList.contains("input-invalid")).toBeTruthy();
    const errorMessage = form.querySelector(".error-message");
    expect(errorMessage).not.toBeNull();
    expect(errorMessage.textContent).toBe("Email is required.");
  });

  test("should remove error onInput", () => {
    input.dispatchEvent(new Event("input"));

    expect(input.classList.contains("input-invalid")).toBeFalsy();
    const errorMessage = form.querySelector(".error-message");
    expect(errorMessage).not.toBe();
  });
});
