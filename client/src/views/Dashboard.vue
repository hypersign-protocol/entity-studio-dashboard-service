<style scoped>
.home{
    margin-left: auto;
    margin-right: auto;
    width: 1500px;
  }
.addmargin {
  margin-top: 10px;
  margin-bottom: 10px;
}

.vue-logo-back {
  background-color: black;
}

.logo {
  width: 144px;
}

.fullbody {
  width: 100%;
}
.floatLeft{
  float: left;
}

.floatRight{
  float: right;
}

.noBullet{
  list-style-type:none;
}

.title {
  color: grey;
  font-size: 18px;
}

</style>
<template>
   <div class="home marginRight marginLeft">
     <h3 class="leftAlign">Welcome, {{user.name}} !</h3>
     <div class="row">
      <div class="col-md-6">
        <Profile/>
      </div>
      <div class="col-md-6">
        <Dashboard/>
      </div>
     </div>    
   </div>
</template>


<script>
import Dashboard from '@/components/Dashboard.vue'
import Profile from '@/components/Profile.vue'
import UtilsMixin from '../mixins/utils';

export default {
  name: "PanelPage",
  async mounted() {
    this.getList('SCHEMA')
    this.getList('CREDENTIAL')
  },
  components: { 
    Dashboard,
    Profile
  },
  data() {
    return {
      page: 1,
      appList: [],
      user: {},
      appName: "",
      authToken: localStorage.getItem('authToken')
    };
  },
  created() {
    const usrStr = localStorage.getItem('user')
    this.user = JSON.parse(usrStr);
  },
  methods: {
    vcStatus(vcId){
      return fetch(vcId+':')
      .then(resp => {
        return resp.json()
      }).then(data => {
        return data
      }).catch(e => {
        Promise.reject(e.message)
      })
    },
    async getList(type) {
      let url = "";
      let options = {}
      if (type === "SCHEMA") {
        url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SCHEMA_LIST_EP}?page=${this.schema_page}&limit=10`

        options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.authToken}`
          }
        }
      } else {
        url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_LIST_EP}`;
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
          this.$store.commit('insertAschema', schema)
        })
      } else {
        const newUpdatedList = await Promise.all (j.credList.map(async (eachVc) => {
          const x = await this.vcStatus(eachVc.vc_id)
          Object.assign(eachVc, { ...x})
          return eachVc
        }))
        newUpdatedList.forEach(credential => {
          this.$store.commit('insertAcredential', credential)
        })
      }
    },
    gotosubpage: id => {
      this.$router.push(`${id}`);
    },
    logout(){
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem("credentials")
      localStorage.removeItem("userData")
      
      if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl)
                }else{
        this.$router.push('/login')
                }
    },
  },
  mixins: [UtilsMixin],
};
</script>
