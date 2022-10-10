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
.subtitle {
  padding-left: 10px;
  color: gray;
  font-size: larger;
  margin-top: auto;
}
.container-collapsed {
  padding-left: 150px;
}
</style>
<template>
  <div id="app">
   <b-navbar toggleable="lg" type="dark" variant="white" class="navStyle" v-if="showIcon">
    <b-navbar-brand href="#" style="display:flex;">
      <img src="https://thumb.tildacdn.com/tild3065-3765-4865-b331-393637653931/-/resize/150x/-/format/webp/hypersign_Yellow.png" alt="">
      <h4 class="subtitle">| {{ $config.app.name }} ({{ $config.app.version }})</h4>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" type="dark" style="background-color:grey;">
    </b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto" style="padding-right:100px; position:static;">

        <b-nav-item-dropdown right v-if="showIcon">
          <template #button-content>
            <b-iconstack font-scale="3">
            <b-icon stacked icon="circle" variant="info"></b-icon>
            <b-icon stacked icon="person" scale="0.6" variant="info"></b-icon>
          </b-iconstack>
          </template>
          <b-dropdown-item disabled href="#">Profile <br><span>{{userDetails.name}}</span>
          <br><span>Jagrat Network</span></b-dropdown-item>
          <b-dropdown-item href="#" @click="logoutAll()">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

   <div :class="[
      isSidebarCollapsed 
          ? 'container-collapsed-not'
          : 'container-collapsed',
    ]">
      <sidebar-menu class="sidebar-wrapper" v-if="showSideNavbar" @toggle-collapse="onToggleCollapse" :collapsed="isSidebarCollapsed" :theme="'white-theme'" width="220px"
      :menu="getSideMenu()"
      >
      <div slot="header" style="background:#363740">
          <div class="mt-3">
            <div>
            <center><img v-if="!isSidebarCollapsed" :src="`${getProfileIcon(selectedOrg.name)}`" alt="avatar" width="130px" style="" /></center>
            <center><img v-if="isSidebarCollapsed" :src="`${getProfileIcon(selectedOrg.name)}`" class="mr-1" alt="center" width="35px"/></center>
            </div>
            <center><p class="mt-3 orgNameCss">{{ selectedOrg.name }}</p></center>
          </div>
        </div>
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
.v-sidebar-menu .vsm--link_level-1 .vsm--icon {
  font-size: 16px;
  width: 40px !important;
}
.dropdown-menu.show {
  text-align: center;
}
.navbar {
  padding: 0px !important;
}
.navStyle {
  background: #FFFFFF;
  margin-bottom: 1%;
  padding: 5px !important;
  padding-left: 1.5%;
  text-align: left;
  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 2px 2px 0px,
    rgba(0, 0, 0, 0.02) 0px 3px 1px -2px,
    rgba(0, 0, 0, 0.01) 0px 1px 5px 0px;
}
.orgNameCss {
  overflow-wrap: break-word;
  color: white;
  font-weight: bold;
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
  min-width: 70px;
  margin-top: 70px;
  box-shadow: 0 0 15px 0 rgba(34,41,47,.05);
}
.v-sidebar-menu.vsm_white-theme .vsm--mobile-bg{
  background: #ffc107;
}
.v-sidebar-menu.vsm_white-theme {
  background-color: white !important;
  color: #000 !important;
}
.v-sidebar-menu.vsm_white-theme .vsm--header {
  color: #000 !important;
}
.v-sidebar-menu.vsm_white-theme .vsm--link{
  color: #000 !important;
}
.v-sidebar-menu.vsm_white-theme .vsm--link_level-1 .vsm--icon {
  background-color: transparent !important;
  color: #000 !important;
}
</style>


<script>
import UtilsMixin from './mixins/utils';
import EventBus from './eventbus'
export default {
  components: {},
  computed: {
    userDetails() {
      return this.$store.getters.userDetails;
    },
    selectedOrg() {
      return this.$store.getters.getSelectedOrg;
    },
    showSideNavbar() {
      return this.$store.state.showSideNavbar
    },
  },
  data() {
    return {
      collapsed:true,
      showIcon:false,
      isSidebarCollapsed:true,
      authToken: localStorage.getItem('authToken'),
      schema_page: 1,
      authRoutes: ['register', 'PKIIdLogin'],
      user: {}
    }
  },

   mounted() {
    console.log(localStorage.getItem('user'))
    if(localStorage.getItem('user')){
    const usrStr = localStorage.getItem('user')
    this.user = JSON.parse(usrStr);
    }
   if(localStorage.getItem('selectedOrg')){
    const selectedOrgId = localStorage.getItem('selectedOrg')
    this.$store.commit('selectAnOrg', selectedOrgId)
    this.getList(selectedOrgId)
    this.getCredList(selectedOrgId)
    this.fetchTemplates(selectedOrgId)
   }
   EventBus.$on("initializeStore",this.initializeStore)
   this.initializeStore()
  },
  methods: {
    getProfileIcon(name) {
      return "https://avatars.dicebear.com/api/identicon/"+name+".svg"
    },
    logoutAll() {
      this.showIcon = false
      this.$router.push('/login')
      this.logout()
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
       this.showIcon = true
       this.fetchAllOrgs()
    }else{
      console.log("else");
     }
    },
    
    getSideMenu() {
      const menu = [
        {
          href: "/studio/dashboard",
          title: "Dashboard",
          icon: "fas fa-tachometer-alt",
        },
        // {
        //   href: "/studio/org",
        //   title: "Organization",
        //   icon: "fa fa-university",
        // },
        {
          href: "/studio/schema",
          title: "Schema",
          icon: "fa fa-table",
        },
        {
          href: "/studio/credential",
          title: "Credentials",
          icon: "fa fa-id-card",
        },
        {
          href: "/studio/presentation",
          title: "Presentation",
          icon: "fa fa-desktop",
        },
      ]
      return menu
    },
    fetchAllOrgs() {
      // TODO: Get list of orgs 
      const url = `${this.$config.studioServer.BASE_URL}api/v1/org`
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`

      }
      fetch(url, {
        headers
      }).then(response => response.json()).then(json => {
        const data = json.data.org
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

    fetchTemplates(selectedOrgDid) {
      const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.PRESENTATION_TEMPLATE_EP}/org/${selectedOrgDid}/`
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`

      }
      fetch(url, {
        headers
      }).then(response => response.json()).then(json => {
        json.data.forEach(template => {
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
      const schemaList = j.data.schemaList
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
      const credList = j.data.credList
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
      localStorage.removeItem('selectedOrg')
      this.$store.commit('resetStore')
    },
  },
  mixins: [UtilsMixin]
}
</script>