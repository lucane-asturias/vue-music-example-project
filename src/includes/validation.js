import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure } from 'vee-validate';
import { required, min, min_value, max, max_value, email, confirmed, alpha_spaces, not_one_of as excluded } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
import en from '@vee-validate/i18n/dist/locale/en.json';
import pt_BR from '@vee-validate/i18n/dist/locale/pt_BR.json';
import ja from '@vee-validate/i18n/dist/locale/ja.json';
import zh from '@vee-validate/i18n/dist/locale/zh_CN.json';

export default {
  // plug-ins are objects with a method called install
  // Vue wil call the install method when we register it
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    // name of the rule + function that will perform the validation; 
    // this rules will be available to every validation form
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
      generateMessage: localize({
        en,
        pt_BR,
        ja,
        zh,
      }),
      // validation triggers to change default behaviour: default values
      validateOnBlur: true,
      validateOnChange: true,  
      validateOnInput: false,
      validateOnModelUpdate: true, // validate when value changes internally through the v-model directive
    })
  },
}