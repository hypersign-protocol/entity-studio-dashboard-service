<template>
  <div class="home">
    <div class="form-group" style="display:flex">
      <h4 class="mt-4" style="text-align: left;">Organizations</h4>
      <button @click="openSlider()" style="text-align: right;" class="btn btn-primary ml-auto mt-4">+ Organization</button>
      
    </div>
    <StudioSideBar title="Add Organization">
      <div class="container">
        <div class="form-group" v-if="orgStore.orgDid">
          <label for="orgName"><strong>Org DID:</strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="orgStore.orgDid" aria-describedby="orgNameHelp"
            disabled>
          <small id="orgNameHelp" class="form-text text-muted">
            <a :href="`${$config.nodeServer.BASE_URL_REST}${$config.nodeServer.DID_RESOLVE_EP}${orgStore.orgDid}:`"
              target="_blank">Resolve DID</a>
          </small>
        </div>
        <div class="form-group" v-else>
          <label for="orgName"><strong>Org ID:</strong></label>
          <input type="text" class="form-control" id="orgDid" v-model="orgStore._id" aria-describedby="orgNameHelp"
            disabled>
        </div>

        <div class="form-group">
          <label for="orgName"><strong>Organization Name:</strong></label>
          <input type="text" class="form-control" id="orgName" v-model="orgStore.name" aria-describedby="orgNameHelp"
            placeholder="Enter your org name">
          <small id="orgNameHelp" class="form-text text-muted">Some help text</small>
        </div>
        <div class="form-group">
          <label for="domain"><strong>Domain:</strong></label>
          <input type="text" class="form-control" id="domain" v-model="orgStore.domain" aria-describedby="domainHelp"
            placeholder="Enter your domain name">
        </div>
        <div class="form-group">
          <label for="logo"><strong>Logo URL:</strong></label>
          <input type="text" class="form-control" id="logo" v-model="orgStore.logo" aria-describedby="logoHelp"
            placeholder="Enter logo URL">
        </div>
        <div class="form-group">
          <label for="region"><strong>Region:</strong></label>
          <input type="text" class="form-control" id="region" v-model="orgStore.region" aria-describedby="regionHelp"
            placeholder="Select your region">
        </div>
        <!-- <div class="form-group">
                      <label for="region"><strong>Network:</strong></label>
                      <input type="text" class="form-control" id="region" v-model="orgStore.network" aria-describedby="regionHelp" placeholder="Select your region">
                  </div> -->
        <div class="form-group" v-if="edit">
          <button class="btn btn-primary" @click="createAnOrg()"> Edit</button>

        </div>
        <div class="form-group" v-else>
          <button class="btn btn-primary" @click="createAnOrg()"> Save</button>
        </div>
      </div>
    </StudioSideBar>
    <div class="row" v-if="orgList.length > 0">
      <div class="col-lg-4" v-for="eachOrg in orgList" :key="eachOrg._id">

        <b-card :title="eachOrg.name" tag="article" style="max-width: 30rem; margin-top: 10px; max-height:25rem"
          class="mb-2 eventCard" img-top>
          <ul style="list-style-type: none;padding-left: 0px;min-height: 80px;">
            <li>
              <span class="card-title">{{ eachOrg.orgDid }}</span>
            </li>
            <li>
              <span class="card-title">{{ eachOrg.network }}</span>

            </li>
            <li>
              <span class="card-title">{{ eachOrg.domain }}</span>
            </li>
          </ul>
          <footer>
            <div class="form-group row" style="margin-bottom: 0rem;">
              <div class="col-sm-10">
              <ul style="list-style-type: none;padding-left: 0px;">
              <li v-if="eachOrg.status === 'Failed'">
              <span class="card-title" >
                <img :src="images.redcross" height="25" width="25" /> Failed
              </span>
            </li>
            <li v-else-if="eachOrg.status === 'Registered'">
              <span class="card-title" >
                <img :src="images.greentick" height="21" width="21"/> Registered
              </span>
            </li>
            <li v-else>
              <span class="card-title" >
                <img :src="images.loader"  height="25" width="25"/> Processing ..... 
              </span>
            </li>
            </ul>
            </div>
                <div class="pt-1 pl-2">            
                <i class="fas fa-pencil-alt"
                @click="editOrg(eachOrg._id)" title="Click to edit this event" style="cursor: pointer"
                ></i>
                <span class="ml-3"></span>
                <i class="fas fa-sync" aria-hidden="true"
                @click="switchOrg(eachOrg._id)" title="Click to switch to org" style="cursor: pointer"
                ></i>
                </div>
            </div> 
          </footer>
        </b-card>
      </div>
    </div>
    <div class="form-group" v-else>
      <h2>Create your first organization!</h2>
    </div>
  </div>
</template>
  <style scoped>
  .home {
    margin-left: auto;
    margin-right: auto;
    width: 1500px;
  }
  
  .container {
    padding: 20px;
    text-align: left;
  }
  
  .eventCard {
    border-left: 10px solid var(--ds-background-accent-red-subtler, #ADE8FF8F);
  }
  
  .eventCard:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 10px;
    cursor: pointer;
  }
  
  .card {}
  
  .card-body {
    -ms-flex: 1 1 auto;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1.25rem;
  
  }
  </style>

  <script>
import HfPopUp from "../components/element/hfPopup.vue";
import StudioSideBar from "../components/element/StudioSideBar.vue";
import UtilsMixin from '../mixins/utils';
import 'vue-loading-overlay/dist/vue-loading.css';
import Loading from "vue-loading-overlay";

export default {
  computed: {
    orgList() {
      return this.$store.state.orgList;
    },

  },
  data() {
    return {
      edit: false,
      orgStore: {
        name: "Hypermine Pvt Ltd",
        domain: "hypermine.in",
        logo: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.5EZ51foyo3QBV2FHnKq1cwHaEc%26pid%3DApi&f=1",
        region: "US EAST",
        network: "Jagrat",
        orgDid: "",
        userDid: "",
        status: "",
      },
      authToken: localStorage.getItem("authToken"),
      isLoading: true,
      isProcessFinished: true,
      images: {
        greentick: require("../assets/green-tick.png"),
        redcross: require("../assets/red-cross.png"),
        loader: require("../assets/small-loader.gif"),
      }
    }
  },
  components: { HfPopUp, Loading, StudioSideBar },
  methods: {
    ssePopulateOrg(id, store) {
      const sse = new EventSource(`${this.$config.studioServer.ORG_SSE}${id}`);
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.status === "Registered" || data.status === "Failed") {

          sse.close();
          store.commit("insertAnOrg", data)
        }
        // store.commit("updateCredStatus", data);
      };

      sse.onopen = function (e) {
        console.log("Connection to server opened.", e);
      };

      sse.onerror = function (e) {
        console.log(e)
        sse.close();
      }
      return

    },
    openWallet(url) {
      if (url != "") {


        this.walletWindow = window.open(
          `${url}`,
          "popUpWindow",
          `height=800,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes`
        );
        this.isProcessFinished = false;


      }
    },
    switchOrg(orgDid) {
      localStorage.setItem('selectedOrg',orgDid)
      this.$store.commit('updateSideNavStatus',true)
      this.$store.commit('selectAnOrg', orgDid)
      this.$router.push('/studio/credential')
      this.$store.dispatch('fetchAllOrgDataOnOrgSelect', orgDid)
      
    },
    openSlider() {
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    editOrg(orgDid) {
      this.edit = true
      Object.assign(this.orgStore, { ...this.$store.getters.findOrgByOrgID(orgDid) })
      this.openSlider();
    },
    createAnOrg() {

      let url
      let method
      if (this.edit) {
        method = "PUT"
        url = `${this.$config.studioServer.BASE_URL}api/v1/org`

      } else {
        url = `${this.$config.studioServer.BASE_URL}api/v1/org`
        method = "POST"

      }

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`
      }
      this.orgStore.userDid = JSON.parse(localStorage.getItem("user")).id

      const body = { orgData: this.orgStore }

      this.isLoading = true;
      fetch(url, {
        method,
        body: JSON.stringify(body),
        headers,
      }).then((res) => res.json())
        .then((j) => {
  
          const { org } = j.data
          if (!this.edit) {
            let QR_DATA = j.data.QrData
            let URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`

            this.openWallet(URL)
          }
          if (j.status === 200) {

            this.$store.commit('insertAnOrg', j.data.org);
            this.$store.commit('selectAnOrg', j.data.org._id)
            this.isProcessFinished = true;
            this.openSlider();

            this.notifySuccess("Org Created successfull");
            if (this.edit) {
              this.$store.commit('updateAnOrg', j.data.org)
              this.notifySuccess("Org Edited successfull");
            }

          }
          if (!this.edit) {
            console.log(org)
            this.ssePopulateOrg(org._id, this.$store)

          }


        }).catch((e) => {
          console.log(e);
          this.notifyError("Something went wrong");
        }).finally(() => {
          this.isLoading = false;
        })

      // TODO: Implement API to create an organization

      // TODO: Make a POST request to ORG API
      // Once the ORG is created just store the org in store
      //this.$store.commit('insertAnOrg', payload);
      // Close the sideba
    }
  },
  mixins: [UtilsMixin]
}
</script>