<style scoped>
.logo {
  /* width: 144px; */
  padding-top: 1.5%;
  padding-left: 25px;
}

.selectedButton {
  border-bottom: 1px solid #8080809e;
  font-weight: bold;
}
.row .nav-style {
  position:absolute;
  z-index: 0;
}
.nav-style {
  background: #FFFFFF;
  margin-bottom: 1%;
  padding: 5px;
  padding-left: 1.5%;
  text-align: left;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 2px 2px 0px,
    rgba(0, 0, 0, 0.02) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.01) 0px 1px 5px 0px;
}

.rightAlign {
  text-align: end;
}

.card-radius {
  border-radius: 10px;
}


.logo-style {
  width: 144px;
  /* height: 40px; */
  margin-top: 9px;
  margin-left: 5px;
}

#app {
  padding: 0;
  margin: 0;
  width: 100%;
  min-height: 100vh;
  background: #F6F6F687;
}
.position {
  display: inline-flex;
  left: 1000px;
}
.subtitle {
  padding-left: 10px;
  color: gray;
  font-size: larger;
  margin-top: auto;
}
.container-collapsed {
  padding-left: 150px;
}
/* .v-sidebar-menu{
  min-width: 200px;
} */
.v-sidebar-menu.vsm_white-theme {
  background-color: white !important;
  color: grey !important;
}
.v-sidebar-menu.vsm_white-theme .vsm--link {
  color: #fff !important;
}
.action{
  z-index: 12;
}
</style>
<template>
  <div id="app">
    <div class="row nav-style">
        <div class="form-group form-inline">
          <img class="logo-style"
            src="https://thumb.tildacdn.com/tild3065-3765-4865-b331-393637653931/-/resize/150x/-/format/webp/hypersign_Yellow.png">
          <h4 class="subtitle"> <span style="opacity:0.4">|</span> {{ $config.app.name }} ({{ $config.app.version }})</h4>
        <div class="col-md-5 position" style="padding-top:12px;"
        v-if="navStatus">
        <button type="button" @click="goToNextPage(m.name)" class="btn btn-light btn-sm" v-for="m in getMenu()"
          :key="m.name" v-if="m.isShow">{{ m.name }}</button>
     </div>
     <div v-if="showSideNavbar === true" class="col-md-2 form-inline   rightAlign" style="padding-top:12px">

      <div class="action">
      <div class="profile" @click="menuToggle()">
        <i class="fas fa-user"></i>
      </div>
      <div class="menu">
        <h3>Your Profile<br />
        <span>{{user.name}}</span><br>
        <span>Network</span>
        </h3>
       <b-button class="btnforLogout" @click="logoutAll()">Logout</b-button>
      </div>
    </div>
     </div>
      </div>
      </div>
   <div :class="[
      isSidebarCollapsed 
          ? 'container-collapsed-not'
          : 'container-collapsed',
    ]">
      <sidebar-menu class="sidebar-wrapper" v-if="showSideNavbar" @toggle-collapse="onToggleCollapse" :collapsed="isSidebarCollapsed" :theme="'white-theme'" width="220px"
      :menu="getSideMenu()">
      </sidebar-menu>
      <router-view />
   </div>
    <notifications group="foo" />
  </div>
</template>

<style>
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */


  color: #212529;
text-align: left;
background-color: #fff;
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 1.42857142857143;
text-decoration-skip-ink: auto;
}
.action {
  position: fixed;
  /* top: 20px; */
  right: 30px;
  padding-right:200px;
}
.btnforLogout {
  margin-right:60px ;
  margin-bottom:20px ;
  margin-top: -10px;
}
.action .profile {
  position: relative;
  width: 90px;
  height: 90px;
  /* overflow: hidden; */
  cursor: pointer;
}

.action .profile img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.action .menu {
  
  position: absolute;
  top: 120px;
  right: 60px;
  left: 5px;
  /* padding: 10px; */
  background: whitesmoke;
  width: 200px;
  box-sizing: 0 5px 25px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: 0.3s;
  visibility: hidden;
  opacity: 0;
}

.action .menu.active {
  top: 80px;
  visibility: visible;
  opacity: 1;
}

.action .menu h3 {
  width: 100%;
  text-align: center;
  font-size: 18px;
  padding: 20px 0;
  font-weight: 500;
  color: #555;
}

.action .menu h3 span {
  font-size: 14px;
  color: black;
  font-weight: 300;
}

.action .menu a:hover {
  color: #ff5d94;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.centeralign {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.leftAlign {
  text-align: left;
}

.rightAlign {
  text-align: right;
}

.marginLeft {
  margin-left: 13%
}

.marginRight {
  margin-right: 12%
}
#view.collapsed {
  padding-left: 50px;
}
#view {
  padding-left: 350px;
}
.sidebar-wrapper {
  margin-top: 5%;
  padding-top: 10%;
  padding-bottom: 0%;
  width: 20%;
  height: 80%;
  box-shadow: 0 0 15px 0 rgba(34,41,47,.05);
}
.v-sidebar-menu.vsm_white-theme .vsm--mobile-bg{
  background: #ffc107;
}
.v-sidebar-menu.vsm_white-theme {
  background-color: white !important;
  color: grey !important;
}
.v-sidebar-menu.vsm_white-theme .vsm--link{
  color: grey !important;
}
.v-sidebar-menu .vsm-arrow:after {
    font-family: FontAwesome;
}
.v-sidebar-menu .collapse-btn:after {
    content: "\f07e";
    font-family: FontAwesome;
}
</style>


<script>
import UtilsMixin from './mixins/utils';
import OrgDropDown from './components/element/OrgDropDown.vue'
import EventBus from './eventbus'
export default {
  components: { OrgDropDown },
  computed: {
    navStatus() {
   if(this.showNavbar === true && this.showSideNavbar!=true){
      return true
     } else {
      return false
     }
    },
    isShow() {
  
      return this.$store.getters.isAnyOrgSelected;

    },
    selectedOrg() {
      return this.$store.getters.getSelectedOrg;
    },
    showSideNavbar() {
      return this.$store.state.showSideNavbar
    },
    showNavbar() {
      return this.$store.state.showNabar
    }
  },
  data() {
    return {
      collapsed:true,
      isSidebarCollapsed:true,
      authToken: localStorage.getItem('authToken'),
      schema_page: 1,
      authRoutes: ['register', 'PKIIdLogin'],
      user:null
    }
  },

   mounted() {
    const usrStr = localStorage.getItem('user')
    this.user = JSON.parse(usrStr);
   if(localStorage.getItem('selectedOrg')){
    const selectedOrgId = localStorage.getItem('selectedOrg')
    this.$store.commit('selectAnOrg', selectedOrgId)
    this.getList(selectedOrgId)
    this.getCredList(selectedOrgId)
   }
   EventBus.$on("initializeStore",this.initializeStore)
   this.initializeStore()
  },
  methods: {
    logoutAll() {
      this.$router.push('/login')
      this.logout()
    },
    menuToggle() {
      const toggleMenu = document.querySelector(".menu");
        toggleMenu.classList.toggle("active");
    },
    onToggleCollapse(collapsed) {
      if (collapsed) {
        this.isSidebarCollapsed = true;
      } else {
        this.isSidebarCollapsed = false;
      }
    },
     initializeStore() {
      this.authToken = localStorage.getItem('authToken'); 
      if (this.authToken) {
       this.$store.commit('updateNavbarStatus',true)
       this.fetchAllOrgs()
    }else{
      console.log("else");
     }
    },
    getSideMenu() {
      const menu = [
        {
          header:true,
          title:`${this.selectedOrg.name}`
        },
        {
          href: "/studio/dashboard",
          title: "Dashboard",
          icon: "fas fa-home-alt",
        },
        {
          href: "/studio/org",
          title: "Org",
          icon: "fa fa-university",
        },
        {
          href: "/studio/schema",
          title: "Schema",
          icon: "fas fa-credit-card",
        },
        {
          href: "/studio/credential",
          title: "Credentials",
          icon: "fas fa-calendar-alt",
        },
        {
          href: "/studio/presentation",
          title: "Presentations",
          icon: "fas fa-calendar-alt",
        },
      ]
      return menu
    },
    getMenu() {
      const menu = [
        {
          name: "Dashboard",
          path: "/studio/dashboard",
          isShow: true,
        },
        {
          name: "Organization",
          path: "/studio/org",
          isShow: true,
        },
        // {
        //   name: "Schema",
        //   path: "/studio/schema",
        //   isShow: this.isShow,
        // },
        // {
        //   name: "Credentials",
        //   path: "/studio/credential",
        //   isShow: this.isShow,
        // },
        // {
        //   name: "Presentation",
        //   path: "/studio/presentation",
        //   isShow: this.isShow,
        // },
        {
          name: "Logout",
          path: "/login",
          isShow: true,
        },
      ]
      return menu;

    },
    vcStatus(vcId) {
      return fetch(vcId + ':')
        .then(resp => {
          return resp.json()
        }).then(data => {
          return data
        }).catch(e => {
          Promise.reject(e.message)
        })
    },
    fetchAllOrgs() {
      // TODO: Get list of orgs 
      const url = `${this.$config.studioServer.BASE_URL}api/v1/org/all`
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`

      }
      fetch(url, {
        headers
      }).then(response => response.json()).then(json => {
        const data = json.org
        // TODO: iterate through them
        if (data) {
          data.forEach(org => {
            // Store them in the store.
            this.$store.commit('insertAnOrg', org)
          })
        }
        if (data && data.length > 0) {
          // this.$store.commit('selectAnOrg', data[0]._id)    //no need to do this
          // this.$store.dispatch('fetchAllOrgDataOnOrgSelect', data[0]._id)
        }


      })
    },

    fetchTemplates() {
      const url = `${this.$config.studioServer.BASE_URL}api/v1/presentation/template/${this.selectedOrg._id}/`
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`

      }
      fetch(url, {
        headers
      }).then(response => response.json()).then(json => {
        json.forEach(template => {
          this.$store.commit('insertApresentationTemplate', template)
        })
      })
    },

    async getList(selectedOrgDid) {
      let url = "";
      let options = {}
        url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SCHEMA_LIST_EP}/${selectedOrgDid}/?page=${this.schema_page}&limit=10`

        options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.authToken}`
          }
        }
      const resp = await fetch(url, options);
      const j = await resp.json();
        if (j && j.status == 500) {
        return this.notifyErr(`Error:  ${j.error}`);
      }
      const schemaList = j.schemaList
        schemaList.forEach(schema => {
          this.$store.dispatch('insertAschema', schema)
        })
    },

    async getCredList(selectedOrgDid) {
      let url = "";
      let options = {}
        url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_LIST_EP}/${selectedOrgDid}`;

        options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.authToken}`
          }
        }
      const resp = await fetch(url, options);
      const j = await resp.json();
        if (j && j.status == 500) {
        return this.notifyErr(`Error:  ${j.error}`);
      }
      const credList = j.credList
      credList.forEach(credential => {
          this.$store.dispatch('insertAcredential', credential)
        })
    },
    // async getList(type) {
    //   let url = "";
    //   let options = {}
    //   if (type === "SCHEMA") {
    //     url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SCHEMA_LIST_EP}/${this.selectedOrg._id}/?page=${this.schema_page}&limit=10`

    //     options = {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${this.authToken}`
    //       }
    //     }
    //   } else {
    //     url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_LIST_EP}/${this.selectedOrg._id}`;
    //     options = {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${this.authToken}`
    //       }
    //     }
    //   }

    //   const resp = await fetch(url, options);
    //   const j = await resp.json();
    //   console.log(j)
    //   if (j && j.status == 500) {
    //     return this.notifyErr(`Error:  ${j.error}`);
    //   }
    //   if (type === "SCHEMA") {
    //     console.log(j);
    //     const schemaList = j.schemaList
    //     schemaList.forEach(schema => {
    //       this.$store.dispatch('insertAschema', schema)
    //     })
    //   } else {
    //     j.credList.forEach(credential => {
    //       this.$store.dispatch('insertAcredential', credential)
    //     })
    //   }
    // },

    logout() {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem("credentials")
      localStorage.removeItem("userData")
      this.isSidebarCollapsed=true,
      this.collapsed= true
     
      this.$store.commit('resetStore')
    },
    goToNextPage(route) {
      const r = this.getMenu().find(x => x.name === route)
      if (r.name === "Logout") {
        this.$store.commit('updateNavbarStatus',false)
        this.$store.commit('updateSidebarStatus',false)
        this.$router.push(r.path)
        this.logout()
      }
      this.$router.push(r.path)
      if (this.$route.params.nextUrl != null) {
        this.$router.push(this.$route.params.nextUrl)
      } else {
        this.$router.push(r.path)
      }
    }
  },
  mixins: [UtilsMixin]
}
</script>