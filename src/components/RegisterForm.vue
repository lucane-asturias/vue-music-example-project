<template>
  <div class="text-white text-center font-bold p-5 mb-4" v-if="reg_show_alert" :class="reg_alert_color">
    {{ reg_alert_msg }}              
  </div>
  <vee-form :validation-schema="registerSchema" 
    @submit="register" :initial-values="userData">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field type="text" name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name" />
        <!-- will generate span tag if there is error -->
        <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field type="email" name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
        <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field type="number" name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded" />
        <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password" v-bind="field" />
        <div class="text-red-600" v-for="error in errors" :key="error">
            {{ error }}
        </div>   
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field type="password" name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password" />
        <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field as="select" name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
        <option value="USA">USA</option>
        <option value="Portugues">Português</option>
        <option value="Espanol">Espanol</option>
        <option value="日本語">日本語</option>
        <option value="中文">中文</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field type="checkbox" name="tos" value="1" :validateOnInput="true"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage class="text-red-600 block" name="tos" />
    </div>
    <button type="submit" :disabled="reg_in_submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
        hover:bg-purple-700">
      Submit
    </button>
  </vee-form>
</template>

<script>
  export default {
    name: 'RegisterForm',
    data() {
      return {
          registerSchema: {
              name: 'required|min:3|max:100|alpha_spaces',
              email: 'required|min:3|max:100|email',
              age: 'required|min_value:18|max_value:100',
              password: 'required|min:3|max:100',
              confirm_password: 'passwords_mismatch:@password',
              country: 'required|country_excluded:Antarctica', //excluded: list of values the input must not match
              tos: 'tos'
          },
          userData: {
              country: 'USA',
          },
          reg_in_submission: false, // keep track if registration form is in submisson
          reg_show_alert: false, // toggle visiblity of alert box
          reg_alert_color: 'bg-blue-500', // indicate the form submission is in progress
          reg_alert_msg: 'Please wait! Your account is being created.' // message of alert box
      };
    },
    methods: {
      async register(values) {
          this.reg_show_alert = true; // active alert visibility
          this.reg_in_submission = true; // disable form button
          this.reg_alert_color = 'bg-blue-500';
          this.reg_alert_msg = 'Please wait! Your account is being created.';

          try {
            // name of the dispatch action + payload data
            await this.$store.dispatch('register', values);
          } catch(error) {
            this.reg_in_submission = false;
            this.reg_alert_color = 'bg-red-500';
            this.reg_alert_msg = 'An unexpected error ocurred. Please try again later.';
            return; // this return will stop the function from executing further
          }

          this.reg_alert_color = 'bg-green-500';
          this.reg_alert_msg = 'Success! Your account has been created.';
          
          window.location.reload();
      }
    }
  }
</script>
