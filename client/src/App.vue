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

.subtitle {
  padding-left: 10px;
  color: gray;
  font-size: larger;
  margin-top: auto;
}
</style>
<template>
  <div id="app">
    <div class="row nav-style">
      <div class="col-md-4">
        <!-- <h5 class="leftAlign">{{$config.app.name}}</h5>  -->
        <div class="form-group form-inline">
          <img class="logo-style"
            src="https://thumb.tildacdn.com/tild3065-3765-4865-b331-393637653931/-/resize/150x/-/format/webp/hypersign_Yellow.png">
          <h4 class="subtitle"> <span style="opacity:0.4">|</span> {{ $config.app.name }} ({{ $config.app.version }})</h4>
        </div>
      </div>
      <div class="col-md-2" v-if="isShow" style="padding-top:12px">
        <OrgDropDown></OrgDropDown>
      </div>
      <div class="col-md-6 rightAlign" style="padding-top:12px"
        v-if="!(authRoutes.includes($router.history.current.name))">
        <button type="button" @click="goToNextPage(m.name)" class="btn btn-light btn-sm" v-for="m in getMenu()"
          :key="m.name" v-if="m.isShow">{{ m.name }}</button>
      </div>
    </div>
    <router-view />
    <notifications group="foo" />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
</style>


<script>
import UtilsMixin from './mixins/utils';
import OrgDropDown from './components/element/OrgDropDown.vue'
export default {
  components: { OrgDropDown },
  computed: {
    isShow() {
  
      return this.$store.getters.isAnyOrgSelected;

    },
    selectedOrg() {
      return this.$store.getters.getSelectedOrg;
    }
  },
  data() {
    return {
      authToken: localStorage.getItem('authToken'),
      schema_page: 1,
      authRoutes: ['register', 'PKIIdLogin'],
      menu: [

      ]
    }
  },

  async mounted() {
    console.log('Initiating mounted with schema and credentials');
    if (this.authToken) {
      
      await this.fetchAllOrgs()
      console.log('Fetched all orgs');

    }
  },
  methods: {
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
        {
          name: "Schema",
          path: "/studio/schema",
          isShow: this.isShow,
        },
        {
          name: "Credentials",
          path: "/studio/credential",
          isShow: this.isShow,
        },
        {
          name: "Presentation",
          path: "/studio/presentation",
          isShow: this.isShow,
        },
        {
          name: "Logout",
          path: "/login",
          isShow: true,
        },
      ]
      console.log(this.isShow)
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

          console.log(data);
          this.$store.commit('selectAnOrg', data[0]._id)
          this.$store.dispatch('fetchAllOrgDataOnOrgSelect', data[0]._id)
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
    async getList(type) {
      let url = "";
      let options = {}
      if (type === "SCHEMA") {
        url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SCHEMA_LIST_EP}/${this.selectedOrg._id}/?page=${this.schema_page}&limit=10`

        options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.authToken}`
          }
        }
      } else {
        url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_LIST_EP}/${this.selectedOrg._id}`;
        options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.authToken}`
          }
        }
      }

      const resp = await fetch(url, options);
      const j = await resp.json();
      if (j && j.status == 500) {
        return this.notifyErr(`Error:  ${j.error}`);
      }
      if (type === "SCHEMA") {
        console.log(j);
        const schemaList = j.schemaList
        schemaList.forEach(schema => {
          this.$store.dispatch('insertAschema', schema)
        })
      } else {
        j.credList.forEach(credential => {
          this.$store.dispatch('insertAcredential', credential)
        })
      }
    },

    logout() {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem("credentials")
      localStorage.removeItem("userData")
    },
    goToNextPage(route) {
      const r = this.getMenu().find(x => x.name === route)
      if (r.name === "Logout") this.logout()
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