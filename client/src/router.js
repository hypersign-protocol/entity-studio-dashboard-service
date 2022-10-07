import Vue from 'vue'
import Router from 'vue-router'
import PKIIdLogin from './views/PKIIdLogin.vue'
import Register from './views/Register.vue'
import config from './config'
import Credential from './views/Credential.vue'
import Presentation from './views/Presentation.vue'
import Dashboard from './views/Dashboard.vue'
import fetch from 'node-fetch'
import Schema from './views/Schema.vue'
import Org from './views/Org.vue'
import store from './store/store'
Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/studio',
      requiresAuth:true,
    },
    {
      path: '/login',
      redirect: '/studio/login'
    },
    {
      path: '/studio',
      redirect: '/studio/dashboard',
      requiresAuth:true
    },
    {
      path: '/studio/login',
      name: 'PKIIdLogin',
      component: PKIIdLogin
    },
    {
      path: '/studio/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      } 
    },
    {
      path: '/studio/org',
      name: 'Org',
      component: Org,
      meta: {
        requiresAuth: true
      } 
    },
    {
      path: '/studio/register',
      name: 'register',
      component: Register
    },
    // {
    //   path: '/studio/profile',
    //   name: 'profile',
    //   component: Profile,
    //   meta: {
    //     requiresAuth: true
    //   } 
    // },
    {
      path: '/studio/schema',
      name: 'schema',
      component: Schema,
      meta: {
        requiresAuth: true
           } 
    },
    // {
    //   path: '/studio/apps/:appId',
    //   name: 'appdetails',
    //   component: AppDetails,
    //   meta: {
    //     requiresAuth: true
    //   } 
    // },
    {
      path: '/studio/credential',
      name: 'credential',
      component: Credential,
      meta: {
        requiresAuth: true
      } 
    },
    {
      path: '/studio/presentation',
      name: 'presentation',
      component: Presentation,
      meta: {
        requiresAuth: true
      } 
    },
    // {
    //   path: '/studio/apps/:appId/issue',
    //   name: 'issueCredential',
    //   component: IssueCredential,
    //   meta: {
    //     requiresAuth: true
    //   } 
    // }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    const authToken = localStorage.getItem('authToken')
    if(authToken){
      const url = `${config.studioServer.BASE_URL}api/v2/protected`
      fetch(url,{
        headers: {
          Authorization: `Bearer ${authToken}`,
      },
      method: "POST",
      }).then(res => res.json())
      .then(json => {
        if(json.status == 403){
          next({
            path: '/studio/login',
            params: { nextUrl:  to.fullPath}
          })  
        }else{
          localStorage.setItem("user", JSON.stringify(json.message));
          store.commit('addUserDetailsToProfile',json.message)
          next()
        }
      })
      .catch((e)=> {
        console.log(e);
        next({
          path: '/studio/login',
          params: { nextUrl:  to.fullPath}
        })
      })
    }else{
      next({
        path: '/studio/login',
        params: { nextUrl:  to.fullPath}
      })
    }
  }else{
    next()
  }
})
export default router
