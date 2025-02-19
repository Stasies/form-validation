export function validateForm(form: any, options?: {}): FormValidator;
declare class FormValidator {
    constructor(form: any, options: any);
    validationStates: string[];
    form: any;
    isValid: boolean;
    inputs: any;
    options: any;
    colors: {
        error: any;
        success: any;
    };
    validateOn: any;
    errorMessages: any;
    rules: any;
    init(): void;
    setStyles(): void;
    setupEventListeners(): void;
    validateForm(event: any): void;
    validateInput(input: any): boolean;
    showError(input: any, message: any): void;
    clearError(input: any): void;
}
export {};
