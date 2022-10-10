<style scoped>
.home{
    margin-left: auto;
    margin-right: auto;
    width: 1500px;
}
.floatLeft {
  float: left;
}
.card {
  border-radius: 10px;
}
.card-header {
  background: aliceblue;
  padding: 0px;
}
.goschema{
  color: #339af0;
}
.goschema:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>
<template>
  <div class="home">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <Info :message="description" />
        
          <div class="form-group" style="display:flex">
           <h3 v-if="templateList.length > 0" class="mt-4" style="text-align: left;">Schema</h3>
            <h3 v-else class="mt-4" style="text-align: left;">Create your first presentation template!</h3>            
            <hf-buttons 
              name="+ Presentation Template"
              style="text-align: right;"
              class="btn btn-primary ml-auto mt-4"
              @executeAction="openSlider()"
            ></hf-buttons>
          </div>
          <StudioSideBar title="Create Presentation Template">

              <div class="form-group row container">
                <div class="col-md-12">
                  <form>
                    <div class="form-group">
                      <label class="floatLeft"><strong> Domain :</strong></label>
                      <input class="form-control" type="url" v-model="presentationTemplate.domain" />


                    </div>
                    <div class="form-group">
                      <label class="floatLeft"><strong>Name (optional) :</strong></label>
                      <input class="form-control" type="text" v-model="presentationTemplate.name" />


                    </div>
                    <div class="form-group">
                      <label class="floatLeft"><strong> IssuerDid :</strong></label>
                      <input class="form-control" type="text" v-model="presentationTemplate.issuerDid" />


                    </div>
                    <!-- <div class="form-group">
                      <label class="floatLeft"><strong>Schema Id :<strong></label>
                      <input class="form-control" type="text" v-model="presentationTemplate.schemaId" />


                    </div> -->
                    <div class="form-group">
                      <label for="forselectschema"><strong>Select Schema</strong></label>
                      <b-form-select v-model="selected" :options="selectOptions"
                        @change="OnSchemaSelectDropDownChange($event)" size="md" class="mt-3">
                      </b-form-select>
                      <span class="goschema" v-if="selectOptions.length === 1" @click="goToSchema()">Create Schema</span>              
                    </div>              
                    <div class="form-group">
                      <label class="floatLeft"><strong>Reason :</strong></label>
                      <input class="form-control" type="text" v-model="presentationTemplate.reason" />


                    </div>
                    <div class="form-group">
                      <label class="floatLeft"><strong>Callback URI</strong></label>
                      <input class="form-control" type="url" v-model="presentationTemplate.callbackUrl" />


                    </div>
                    <div class="form-group">
                      <label class="floatLeft "><strong>Required :</strong></label>
                      <input type="checkbox" v-model="presentationTemplate.required" />
                    </div>

                  </form>
                  <hr />
                  <hf-buttons 
                    name="Generate"            
                    class="btn btn-primary"
                    @executeAction="generatePresentation()"
                  ></hf-buttons>
                </div>
              </div>
            </StudioSideBar>
          
      </div>
    </div>
    <div class="row" style="margin-top: 2%;" v-if="templateList.length >0">
      <div class="col-md-12">
        <table class="table table-bordered" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th>Template Id </th>
              <th>Domain</th>
              <th>Name</th>
              <th>Issuer DID</th>
              <th>Schema Id</th>
              <th>Reason</th>
              <th>CallbackUrl</th>
              <!-- <th>author</th> -->
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in templateList" :key="row">
              <td>{{row._id}}</td>
              <td>{{row.domain}}</td>
              <td>{{row.name}}</td>
              <td>{{row.issuerDid.toString()}}</td>
              <td>{{ shorten(row.schemaId)}}</td>
              <td>{{row.reason}}</td>
              <td>{{row.callbackUrl}}</td>
            </tr>
          </tbody>
        </table>

        <!-- </div> -->
        <!-- </div> -->
      </div>
      <!-- </div> -->
    </div>

  </div>
</template>

<script>
import fetch from "node-fetch";
import UtilsMixin from '../mixins/utils';
import StudioSideBar from "../components/element/StudioSideBar.vue";
import HfButtons from "../components/element/HfButtons.vue"
import conf from '../config';
const { hypersignSDK } = conf;
import QrcodeVue from "qrcode.vue";
import Info from '@/components/Info.vue'
export default {
  name: "Presentation",
  components: { QrcodeVue, Info , StudioSideBar, HfButtons},
  computed:{
    templateList(){
      return this.$store.state.templateList;
    },
    selectedOrg(){
      return this.$store.getters.getSelectedOrg;
    },
    selectOptions(){
      return this.$store.getters.listOfAllSchemaOptions;
    },
  },
  data() {
    return {
      description: "The subject (or holder) generates verifiable presentation from one or more verifiable \
      credentials, issued by one or more issuers, that is shared with a specific verifier. \
      A verifiable presentation is a tamper-evident presentation encoded in such a way that \
      authorship of the data can be trusted after a process of cryptographic verification. \
      Certain types of verifiable presentations might contain data that is synthesized from, \
      but do not contain, the original verifiable credentials for example, in order to proof the \
      subject that he/she is an adult, she/he does not have to tell his/her actual age \
      (i.e. Zero knowledge proof). The airline passenger might not have to show the complete ticket\
      to the secruity personal to pass the security check. The passenger will have ability to show \
      just one document (the verifiable presentation) derived from his passport and air ticket to\
      show at the security check.",
      presentationTemplate: {
        queryType: 'QueryByExample',
        domain: "",
        name: '',
        issuerDid:'',
        schemaId: '',
        reason: '',
        required: true,
        callbackUrl: '',
      },
      selected:null,
      active: 0,
      host: location.hostname,
      user: {},
      prevRoute: null,
      attributeName: "",
      attributes: [],
      issueCredAttributes: [],
      radioSelected: "create",
      credentialName: "",
      isCredentialIssued: false,
      signedVerifiableCredential: "",
      credentials: JSON.parse(localStorage.getItem("credentials")),
      subjectDid: "did:hs:AmitKumar",
      radioOptions: [
        { text: "Create new schema", value: "create" },
        { text: "Select existing schema", value: "existing" },
      ],
      selected: null,
      attributeValues: {},
      authToken: localStorage.getItem("authToken"),
   
      schemaMap: {},
      vcList: [],
      schemaList: [],
      fullPage: true,
      isLoading: false,
      holderDid: "did:hs:8b915133-cb8b-4151-9a63-1b91f702297f",
      signedVerifiablePresentation: {},
      presentationDetails: {
        credentialType: {}
      },
      isClaims: false
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    this.$store.commit('updateSideNavStatus',true)
    // this.fetchTemplates()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    goToSchema() {
      this.$router.push('schema')
    },
    OnSchemaSelectDropDownChange(event) {
      if (event) {     
        this.presentationTemplate.schemaId=this.selected
      } else {
        this.schemaId = '';
      }
    },
    clearAll() {
      this.presentationTemplate.issuerDid = ''
      this.presentationTemplate.domain = ''
      this.presentationTemplate.name = ''
      this.presentationTemplate.required = true
      this.presentationTemplate.callbackUrl = ''
      this.presentationTemplate.reason = ''
      this.selected = null
    },
    openSlider() {
      this.clearAll()
      this.presentationTemplate.issuerDid = JSON.parse(localStorage.getItem("user")).id
      this.presentationTemplate.domain = this.selectedOrg.domain;
      this.$root.$emit("bv::toggle::collapse", "sidebar-right");
    },
    showClaims() {
      if (this.isClaims) this.isClaims = false;
      else this.isClaims = true;
    },
    notifySuccess(msg) {
      this.$notify({
        group: 'foo',
        title: 'Information',
        type: 'success',
        text: msg
      });
    },
    notifyErr(msg) {
      this.$notify({
        group: 'foo',
        title: 'Error',
        type: 'error',
        text: msg
      });
    },
    fetchData(url, option) {
      fetch(url)
        .then((res) => res.json())
        .then((j) => {
          if (j.status != 200) throw new Error(j.error);
          return j.message;
        })
        .catch((e) => this.notifyErr(`Error: ${e.message}`));
    },
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    addBlankAttrBox() {
      if (this.attributeName != " ") {
        this.attributes.push(this.attributeName);
        this.attributeName = " ";
      }
    },
    downloadCredentials() {
      this.forceFileDownload(
        JSON.stringify(this.signedVerifiablePresentation),
        "vp.json"
      );
    },
    onfileLoadSuccess(evt) {
      // console.log('Inside callbacl')
      const fileJSON = JSON.parse(evt.target.result);
      if (!fileJSON) this.notifyErr("Incorrect file");
      const typeArr = fileJSON["type"]
      if (typeArr.find(x => x == 'VerifiableCredential')) {
        // console.log('Inside callbacl: vc')
        localStorage.removeItem('credential')
        localStorage.setItem("credential", JSON.stringify(fileJSON));
      } else if (typeArr.find(x => x == 'VerifiablePresentation')) {
        // console.log('Inside callbacl: vp')
        localStorage.removeItem('presentation')
        localStorage.setItem("presentation", JSON.stringify(fileJSON));
      } else {
        this.notifyErr("Invalid file")
      }
    },
    readFile(file, cb) {
      // console.log('Inside reaffileDs')
      const reader = new FileReader();
      reader.onload = cb
      reader.readAsText(file);
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.readFile(file, this.onfileLoadSuccess)
    },
    async generatePresentation() {
      this.isLoading = true
      try {
        
        const issuerDid = this.presentationTemplate.issuerDid.split(',')
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.authToken}`
        }
        const body = {
          issuerDid,
          queryType: this.presentationTemplate.queryType,
          domain: this.presentationTemplate.domain,
          name: this.presentationTemplate.name,
          schemaId: this.presentationTemplate.schemaId,
          reason: this.presentationTemplate.reason,
          required: this.presentationTemplate.required,
          callbackUrl: this.presentationTemplate.callbackUrl,
          orgDid:this.$store.state.selectedOrgDid
        }
        const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.PRESENTATION_TEMPLATE_EP}`
        fetch(url, {
          body: JSON.stringify(body),
          method: "POST",
          headers: headers,
        }).then((res) => res.json()).then(json => {
          this.$store.commit('insertApresentationTemplate', json.data.presentationTemplateObj)
          this.notifySuccess('Template Successfully created')
          this.openSlider();
        })
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },
    viewPresentation() {
      this.isLoading = true
      try {
        const vp = JSON.parse(localStorage.getItem("presentation"));
        if (!vp) throw new Error('Please select verifiable presentation file')
        // console.log(vp)
        const vc = vp.verifiableCredential[0]
        this.presentationDetails = {}
        this.presentationDetails.credentialType = {
          name: vc.type[1],
          url: vc['@context'][1]['hsscheme']
        }
        this.presentationDetails.issuerDid = vc.issuer
        this.presentationDetails.holderDid = vc.credentialSubject.id
        this.presentationDetails.issuanceDate = vc.issuanceDate
        this.presentationDetails.expirationDate = vc.expirationDate
        this.presentationDetails.claim = vc.credentialSubject
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },
    clear() {
      this.presentationDetails = "",
        localStorage.removeItem('presentation')
      localStorage.removeItem('credential')
      this.$refs.vpFile.value = null;
      this.$refs.vcFile.value = null;
      this.signedVerifiablePresentation = {}
      this.isCredentialIssued = false
    },
    async verifyPresentation() {
      this.isLoading = true
      try {
        const vp = JSON.parse(localStorage.getItem("presentation"));
        if (!vp) throw new Error('Please select verifiable presentation file')
        const vc = vp.verifiableCredential[0]
        const isVerified = await hypersignSDK.credential.verifyPresentation(
          {
            presentation: vp,
            challenge: "test_challenge",
            issuerDid: vc.issuer,
            holderDid: vc.credentialSubject.id
          });
        // console.log(isVerified)
        if (isVerified.verified) {
          this.notifySuccess("Presentation verified")
        } else {
          this.notifyErr("Presentation can not verified")
        }
        this.isLoading = false
        this.clear()
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message)
      }
    },
  },
    mixins: [UtilsMixin],
};
</script>


