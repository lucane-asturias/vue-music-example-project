import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure } from 'vee-validate';
import { required, min, min_value, max, max_value, email, confirmed, alpha_spaces, not_one_of as excluded } from '@vee-validate/rules';

export default {
    // plug-ins are objects with a method called install
    // Vue wil call the install method when we register it
    install(app) {
        app.component('VeeForm', VeeForm);
        app.component('VeeField', VeeField);
        app.component('ErrorMessage', ErrorMessage);

        // name of the rule + function that will perform the validation; this rules will be available to every validation form
        // don't need to define function bc we are importing the rquired function from the rules package
        defineRule('required', required);
        defineRule('min', min); 
        defineRule('min_value', min_value); // must be a numeric value representing the smallest value allowed
        defineRule('max', max);
        defineRule('max_value', max_value);
        defineRule('email', email); // must have the same value as the confirmation field.
        defineRule('passwords_mismatch', confirmed);
        defineRule('alpha_spaces', alpha_spaces);
        defineRule('excluded', excluded);
        // copy of the same rule for override error message
        defineRule('country_excluded', excluded);
        defineRule('tos', required); // rule for generic message

        configure({
            // will be called whenever a global validator function returns false
            generateMessage: (ctx) => {
                const messages = {
                    required: `The field ${ctx.field} is required.`,
                    min: `The field ${ctx.field} is too short.`,
                    max: `The field ${ctx.field} is too long.`,
                    min_value: `The field ${ctx.field} is too low.`,
                    max_value: `The field ${ctx.field} is too high.`,
                    email: `The field ${ctx.field} must be a valid email.`,
                    passwords_mismatch: "The passwords don't match.",
                    alpha_spaces: `The field ${ctx.field} may only contain alphabetical characters and spaces.`,
                    excluded: `You are not allowed to use this value for this field ${ctx.field}.`,
                    country_excluded: "Due to restrictions, we do not accept users from this location.",
                    tos: "You must accept the Terms of Service",
                };
                // rule.name refers to the name of the rule that was broken
                const message = messages[ctx.rule.name] 
                    ? messages[ctx.rule.name] 
                    : `The field ${ctx.field} is invalid.`;

                return message;
            },
            // validation triggers to change default behaviour: default values
            validateOnBlur: true,
            validateOnChange: true,  
            validateOnInput: false,
            validateOnModelUpdate: true, // validate when value changes internally through the v-model directive
        })
    },
}