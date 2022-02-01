<template>
  <div class="text-white text-center font-bold p-5 mb-4" v-if="login_show_alert" :class="login_alert_color">
    {{ login_alert_msg }}        
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field type="email" name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email" />
       <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field type="password" name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password" />
        <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button type="submit" :disabled="login_in_submission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
        hover:bg-purple-700">
      Submit
    </button>
  </vee-form>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
        loginSchema: {
            email: 'required|email',
            password: 'required|min:3|max:32',
        },
        login_in_submission: false, // keep track if login form is in submisson (prevent excessive request)
        login_show_alert: false, // toggle visiblity of alert box
        login_alert_color: 'bg-blue-500', // indicate the form submission is in progress
        login_alert_msg: 'Please wait! We are logging you in.' // message of alert box
    }
  },
  methods: {
    async login(values) {
        this.login_show_alert = true; // active alert visibility
        this.login_in_submission = true; // disable form button
        this.login_alert_color = 'bg-blue-500';
        this.login_alert_msg = 'Please wait! We are logging you in.';

        try {
          await this.$store.dispatch('login', values);
        } catch (error) {
          this.login_in_submission = false; // disable form button
          this.login_alert_color = 'bg-red-500';
          this.login_alert_msg = 'Invalid login details.';
          return;
        }

        this.login_alert_color = 'bg-green-500';
        this.login_alert_msg = 'Success! You are now logged in.';
        
        window.location.reload();
    }
  }
}
</script>
