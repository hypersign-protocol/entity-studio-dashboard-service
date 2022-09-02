<template>
    <div class="home">
        <div class="form-group" style="text-align: right">
            <button @click="openSlider()" class="btn btn-primary">+ Organization</button>
        </div>
        <StudioSideBar title="Add Organization">
            <div class="container">
                <div class="form-group">
                    <label for="orgName"><strong>Org DID:</strong></label>
                    <input type="text" class="form-control" id="orgDid" v-model="orgStore._id" aria-describedby="orgNameHelp" disabled>
                </div>
                <div class="form-group">
                    <label for="orgName"><strong>Organization Name:</strong></label>
                    <input type="text" class="form-control" id="orgName" v-model="orgStore.name" aria-describedby="orgNameHelp" placeholder="Enter your org name">
                    <small id="orgNameHelp" class="form-text text-muted">Some help text</small>
                </div>
                <div class="form-group">
                    <label for="domain"><strong>Domain:</strong></label>
                    <input type="text" class="form-control" id="domain" v-model="orgStore.domain" aria-describedby="domainHelp" placeholder="Enter your domain name">
                </div>
                <div class="form-group">
                    <label for="logo"><strong>Logo URL:</strong></label>
                    <input type="text" class="form-control" id="logo" v-model="orgStore.logo" aria-describedby="logoHelp" placeholder="Enter logo URL">
                </div>
                <div class="form-group">
                    <label for="region"><strong>Region:</strong></label>
                    <input type="text" class="form-control" id="region" v-model="orgStore.region" aria-describedby="regionHelp" placeholder="Select your region">
                </div>
                <!-- <div class="form-group">
                    <label for="region"><strong>Network:</strong></label>
                    <input type="text" class="form-control" id="region" v-model="orgStore.network" aria-describedby="regionHelp" placeholder="Select your region">
                </div> -->
                <div class="form-group">
                    <button class="btn btn-primary" @click="createAnOrg()">Save</button>
                </div>
                
            </div>
            
        </StudioSideBar>
        <div class="row">
            <div class="col-lg-3" v-for="eachOrg in orgList" :key="eachOrg._id">
                <b-card
            :title="eachOrg.name"
            :img-src="eachOrg.logo"
            img-alt="Image"
            img-top
            img-height="150"
            tag="article"
            style="max-width: 20rem; margin-top: 20px"
            class="mb-2 eventCard"
          >
            <ul style="
                list-style-type: none;
                padding-left: 0px;
                font-size: small;
              ">
              <li>
                <span class="card-title">{{ eachOrg.network }}</span>
              </li>
              <li>
                <span class="card-title">{{ eachOrg.region }}</span>
              </li>
            </ul>
            <footer>
              <small style="float: right">
                <span
                  @click="editOrg(eachOrg._id)"
                  title="Click to edit this event"
                  style="cursor: pointer"
                >
                  Edit
                </span> |  
                <span
                  @click="switchOrg(eachOrg._id)"
                  title="Click to edit this event"
                  style="cursor: pointer"
                >
                  Switch
                </span>
              </small>
            </footer>
          </b-card>
            </div>
        </div>
    </div>
  </template>
  <style scoped>
    .home{
    margin-left: auto;
    margin-right: auto;
    width: 1500px;
  }
    .container{
        padding: 20px;
        text-align: left;
    }


.eventCard:hover {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 10px;
  cursor: pointer;
}

</style>

  <script>
import HfPopUp from "../components/element/hfPopup.vue";
import StudioSideBar from "../components/element/StudioSideBar.vue";
import UtilsMixin from '../mixins/utils';

import Loading from "vue-loading-overlay";

    export default {
        computed: {
            orgList(){
                return this.$store.state.orgList;
            }
        },
        data(){
            return {
              edit:false,
                orgStore: {
                    name: "Hypermine Pvt Ltd",
                    domain: "hypermine.in",
                    logo: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.5EZ51foyo3QBV2FHnKq1cwHaEc%26pid%3DApi&f=1",
                    region: "US EAST",
                    network:"Jagrat",
                    orgDid: "",
                    userDid: "",
                },
              authToken: localStorage.getItem("authToken"),      

            }
        },
        components: { HfPopUp, Loading, StudioSideBar },
        methods: {
            switchOrg(orgDid){
                this.$store.commit('selectAnOrg', orgDid)
                this.$store.dispatch('fetchAllOrgDataOnOrgSelect', orgDid)
            },
            openSlider(){
                this.$root.$emit("bv::toggle::collapse", "sidebar-right");
            },
            editOrg(orgDid){
              this.edit=true
                Object.assign(this.orgStore, {...this.$store.getters.findOrgByOrgID(orgDid) })
                this.openSlider();
            },
            createAnOrg(){
              let url
              let method
              if (this.edit){
                method = "PUT"
                 url = `${this.$config.studioServer.BASE_URL}api/v1/org/update`

              }else{
                url = `${this.$config.studioServer.BASE_URL}api/v1/org/create`
                method = "POST"

              }
               
              const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.authToken}`
              }
              this.orgStore.userDid =JSON.parse(localStorage.getItem("user")).id
          
              const body  ={ orgData:this.orgStore}


              fetch(url, {
                method,
                body: JSON.stringify(body),
                headers,
              }) .then((res) => res.json())
                .then((j) => {
                  console.log(j)
                  if (j.status === 200) {
                    this.notifySuccess("Org Created successfull");
                    this.$store.commit('insertAnOrg', j.org);
                    this.$store.commit('selectAnOrg', j.org._id)
                  }
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