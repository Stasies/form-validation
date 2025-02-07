import { validateForm } from "../src/index.js"; // Import your library

describe("FormValidator", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    console.warn.mockRestore();
  });

  test("should throw error when a valid form is not provided", () => {
    expect(() => validateForm("not-a-form", {})).toThrow(TypeError);
  });

  test("should accept valid options", () => {
    const form = document.createElement("form");
    const validator = new validateForm(form, {
      colors: { error: "red", success: "green" },
      validate: "submit",
    });

    expect(validator.colors.error).toBe("red");
    expect(validator.colors.success).toBe("green");
  });

  test("should switch to default values when invalid options are provided", () => {
    const form = document.createElement("form");
    const validator = validateForm(form, {
      colors: "invalidColor",
      validate: "invalidValidation",
      rules: ["invalidRule"],
    });

    expect(validator.colors).toHaveProperty("error");
    expect(validator.validateOn).toMatch("submit");
    expect(validator.rules).toMatchObject({});
  });
});
