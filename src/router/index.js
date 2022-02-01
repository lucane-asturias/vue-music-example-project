import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Manage from '@/views/Manage.vue';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    // // route level code-splitting
    // // this generates a separate chunk (about.[hash].js) for this route
    // // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/manage',
    // alias: '/manage', // additional path
    name: 'manage',
    component: Manage,
    meta: {
      // weather a route requires authentication
      requiresAuth: true,
    }
  },
  {
    path: '/manage',
    redirect: { name: 'manage' },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

// Navigation guard to check every request before responding
router.beforeEach((to, from, next) => {
  // check if the current route (not) requires authentication by using some function
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return; // end the function
  }

  if (store.state.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
})

export default router;
