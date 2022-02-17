<template>
  <!-- Header -->
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link class="text-white font-bold uppercase text-2xl mr-4" 
        :to="{ name: 'home' }" exact-active-class="no-active">
        {{ $t('header.music') }}
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal">
              {{ $t('header.login_register') }}
            </a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">
                {{ $t('header.manage') }}
              </router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent='signout'>
                {{ $t('header.logout') }}
              </a>
            </li>
          </template>
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">
              {{ $t('header.about') }}
            </router-link>
          </li>
        </ul>
        <ul class="flex flex-row mt-1 ml-auto">
          <select class="appearance-none ml-auto w-full bg-gray-200 border border-gray-200 
            text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white
            focus:border-gray-500" @click.prevent="changeLocale">
            <option value="en">English</option>
            <option value="pt">Portuguese</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
        </select>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
  import { mapMutations, mapState/*, mapActions*/ } from 'vuex';
  import { setLocale } from '@vee-validate/i18n';

  export default {
    name: "Header",
    computed: {
      // state property to keep track if the user is logged in
      ...mapState({
        userLoggedIn: (state) => state.auth.userLoggedIn,
      }),
    },
    methods: {
      ...mapMutations(['toggleAuthModal']),
      // toggleAuthModal() {
      //   this.$store.commit('toggleAuthModal');
      //   console.log(this.$store.state.authModalShow)
      // },

      signout() {
        this.$store.dispatch('signout');
        if (this.$route.meta.requiresAuth) {
          // redirect by pushing the next path when user signs out on manage page
          this.$router.push({ name: 'home' })
        }
      },
      // ...mapActions(['signout'])
      changeLocale(event) {
        if (event.target.value === 'pt') {
          this.$i18n.locale = 'pt';
          setLocale('pt_BR');
        } else if (event.target.value === 'ja') {
          this.$i18n.locale = 'ja';
          setLocale('ja');
        } else if (event.target.value === 'zh') {
          this.$i18n.locale = 'zh';
          setLocale('zh');
        } else {
          this.$i18n.locale = 'en';
          setLocale('en');
        }

        // this.$i18n.locale = this.$i18n.locale === 'ja' ? 'en' : 'ja';
      },
    }
  }
</script>