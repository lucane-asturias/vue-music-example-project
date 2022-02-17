import NProgress from 'nprogress';

export default (router) => {
  // called before the route begins to load the component
  router.beforeEach((to, from, next) => {
    NProgress.start();
    next(); // let the router begin loading the component
  });

  router.afterEach(NProgress.done);
}