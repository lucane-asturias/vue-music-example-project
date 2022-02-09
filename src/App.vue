<template>
  <!-- Header -->
  <app-header />
  <!-- This component will be replaced with the correct component associated with the path. The view router
  will automatically know which component to load based on route records created in the router -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <!-- will render whatever component is provided by the router view -->
      <component :is="Component"></component>
    </transition>
  </router-view>

  <app-player />

  <auth-modal />

</template>

<script>
  import AppHeader from '@/components/Header';
  import AuthModal from '@/components/Auth';
  import AppPlayer from '@/components/Player.vue';

  export default {
    name: "App",
    components: {
      AppHeader,
      AuthModal,
      AppPlayer,
    },
    // life-cycle method for when the component is created
    created() {
      this.$store.dispatch('init_login')
    },
  }
</script>

<style>
  /*  gets added when the element is entering the page */
  .fade-enter-from {
    opacity: 0;
  }
  /* gets added for the entirety of the animation. */
  .fade-enter-active {
    transition: all 0.2s linear;
  }
  /* gets added when leaving the document */
  .fade-leave-to {
    transition: all 0.2s linear;
    opacity: 0;
  }

</style>