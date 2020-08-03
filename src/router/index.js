import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import firebase from 'firebase/app';
import 'firebase/auth';

import '../../node_modules/nprogress/nprogress.css'

Vue.use(Router)

function lazyLoad(view){
  return() => import(`../views/${view}.vue`)
}

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior () {
    // very bad, maybe better use a Navigation Guard?
    document.getElementById('app').scrollIntoView();
    return null;
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: lazyLoad('Home')
    },
    {
      path: '/portfolio/:page_content/:users_id',
      name: 'Portfolio',
      component: lazyLoad('Portfolio'),
    },
    {
        path: '/manage-gallery',
        name: 'ManageGallery',
        component: lazyLoad('PortfolioPages/ManageGallery'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/manage-videos',
        name: 'ManageVideos',
        component: lazyLoad('PortfolioPages/ManageVideos'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/followers',
        name: 'Followers',
        component: lazyLoad('PortfolioPages/Followers'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/talent',
        name: 'Talent',
        component: lazyLoad('Talent')
    },
    {
        path: '/jobs',
        name: 'Jobs',
        component: lazyLoad('Jobs')
    },
    {
        path: '/privacy-policy',
        name: 'PrivacyPolicy',
        component: lazyLoad('LegalPages/PrivacyPolicy')
    },
    {
        path: '/terms-service',
        name: 'TermsService',
        component: lazyLoad('LegalPages/TermsService')
    },
    {
        path: '/portfolio-settings',
        name: 'PortfolioSettings',
        component: lazyLoad('SettingsPages/Portfolio'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/account-settings',
        name: 'AccountSettings',
        component: lazyLoad('SettingsPages/Account'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/social-settings',
        name: 'SocialSettings',
        component: lazyLoad('SettingsPages/Social'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/signin',
        name: 'Signin',
        component: lazyLoad('SignIn'),
        meta: {
            requiresGuest: true
        }
    },
    {
        path: '/signup',
        name: 'Signup',
        component: lazyLoad('SignUp'),
        meta: {
            requiresGuest: true
        }
    },
  ]
})

//Router loading bar
router.beforeResolve((to, from, next) => {
    // If this isn't an initial page load.
    if (to.name) {
        // Start the route progress bar.
        NProgress.configure({ showSpinner: false });
        NProgress.start()
        
    }
    next()
  })
  
  router.afterEach(() => {
    // Complete the animation of the route progress bar.
    NProgress.done()
  })

// Nav guards
router.beforeEach((to, from, next) => {
  //Check for required auth guard
  if(to.matched.some(record => record.meta.requiresAuth)) {
      //Check if not logged in
      if(!firebase.auth().currentUser) {
          //Go to login page
          next({
              path: '/signin',
              query: {
                  redirect: to.fullPath
              }
          })
      } else {
          // Proceed to route
          next();
      }
  } else if(to.matched.some(record => record.meta.requiresGuest)) {
      //Check if is logged in
      if(firebase.auth().currentUser) {
          //Go to login page
          next({
              path: '/talent',
              query: {
                  redirect: to.fullPath
              }
          })
      } else {
          // Proceed to route
          next();
      }
  } else {
      // Proceed to route
      next();
  }
})

export default router