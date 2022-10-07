<style scoped>
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
.floatLeft {
  float: left;
}

.floatRight {
  float: right;
}

.noBullet {
  list-style-type: none;
}

.title {
  color: grey;
  font-size: 18px;
}
.dot {
  height: 15px;
  width: 15px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
  margin-top: 5px;
  float: right;
}

.tile {
  font-size: xxx-large;
  background: aliceblue;
  border-bottom: 1px solid #8080802b;
}
.fVal {
  font-size: small;
  color: gray;
  word-wrap: break-word;
}
.col-md-12{
  /* justify-items: center; */
display: flex;
}
.col-md-3 {
  width: 400px;
  margin: 10px;
}
.card{
  height: 100%;
  border-radius: 10px;
}

.card-header{
  height: 50%;
}

</style>

<template>  
  <div class="row">
     
        <div class="col-lg-3">
          <div class="card">
            <div class="card-body tile">{{allMetricsData.schemasCount}}</div>
            <div class="card-header">AUTHORED SCHEMAS</div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="card">
            <div class="card-body tile">{{ allMetricsData.credentialsCount }}</div>
            <div class="card-header">ISSUED CREDENTIALS</div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="card">
            <div class="card-body tile">{{ allMetricsData.orgsCount }}</div>
            <div class="card-header">ORGANIZATIONS</div>
          </div>
        </div>
        
        <div class="col-lg-3">
          <div class="card">
            <div class="card-body tile">{{ allMetricsData.templatesCount }}</div>
            <div class="card-header">PRESENTATION TEMPLATES</div>
          </div>
        </div>
      </div>  
</template>


<script>
export default {
  name: "Metrics",
  mounted() {},
  components: {},
  computed:{
    allMetricsData() {
      return this.$store.getters.allMetricsData;
    }

  },
  data() {
    return {
      active: 0,
      userKeys: [],
      appList: [],
      user: {
        id: "",
        publicKey: "",
        email: "",
        phoneNumber: "",
        fname: "",
      },
      authToken: localStorage.getItem("authToken"),
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = { ...JSON.parse(usrStr) };
    this.userKeys = Object.keys(this.user);
  },
  methods: {
    // fetchData(url,options){
    //   return fetch(url, options)
    //         .then((res) => res.json())
    //         .then((j) => {              
    //           return j.message
    //         })
    //         .catch((e) => alert(`Error: ${e.message}`));
    // },
    // pollData(){
    //   let url = `${this.$config.nodeServer.BASE_URL}${this.$config.nodeServer.SCHEMA_LIST_EP}`;
    //   let options = {}
    //   this.fetchData(url).then(data => {
    //     if (data && data.length > 0) {
    //       data = data.filter(
    //         (x) => x.owner === this.user.id
    //       );
    //       this.schemaCount = data.length;
    //     }
    //   })

    //   url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_LIST_EP}`;
    //   options  = {
    //       method: "GET",
    //       headers: {'x-auth-token': this.authToken}
    //     }
    //   this.fetchData(url,options).then(data => {
    //     if (data) {
    //       this.credentialCount = data.count;
    //     }
    //   })
    // },
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
  },
};
</script>
