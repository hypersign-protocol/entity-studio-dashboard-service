<style scoped>
.home{
    margin-left: auto;
    margin-right: auto;
    width: 1500px;
}
.card-header {
  background: aliceblue;
  padding: 0px;
}

.card {
  border-radius: 10px;
}
</style>
<template>
  <div class="home">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <Info :message="description" />
        <div class="card">
          <div class="card-header">
            <b-button v-b-toggle.collapse-1 variant="link">Issue Credential</b-button>
          </div>
          <b-collapse id="collapse-1" class="mt-2">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <form style="max-height:300px; overflow:auto; padding: 5px">
                    <div class="form-group">
                      <input type="text" class="form-control" placeholder="Issued To (did:hs:...)"
                        v-model="holderDid" />
                    </div>
                    <div class="form-group">
                      <b-form-select v-model="selected" :options="selectOptions"
                        @change="OnSchemaSelectDropDownChange($event)" size="md" class="mt-3">
                      </b-form-select>

                    </div>
                    <div class="form-group" v-for="attr in issueCredAttributes" :key="attr.name">
                      <label>{{ attr.name }}</label>
                      <input type="text" v-model="attr.value" class="form-control"
                        placeholder="Enter attribute value" />
                    </div>
                  </form>
                  <hr />
                  <button class="btn btn-outline-primary btn-sm" @click="issueCredential()">Issue</button>
                </div>
                <div class="col-md-6" style="padding: 30px" v-if="isCredentialIssued">
                  <div class="form-group" style="text-align:center">
                    <qrcode-vue :value="signedVerifiableCredential" :size="200" level="H"></qrcode-vue>
                    <label class="title">Scan the QR code using Hypersign Wallet!</label>
                  </div>
                  <div class="form-group" style="text-align:center">
                    <p></p>
                    <h5>OR</h5>
                    <button class="btn btn-link" @click="downloadCredentials()">Download Credential</button>
                  </div>
                </div>
              </div>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
    <div class="row" style="margin-top: 2%;">
      <div class="col-md-12">
        <table class="table table-bordered" style="background:#FFFF">
          <thead class="thead-light">
            <tr>
              <th>VC Id</th>
              <th>Schema Id</th>
              <th>Holder DID</th>
              <th>Issuance Date</th>
              <th>Expiration Date</th>
              <!-- <th>Credential Hash</th> -->
              <th>Status</th>
              <th>Status Reason</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in vcList" :key="row.vc_id">
              <td>
                <a :href="`${row.vc_id}:`" target="_blank>" v-if="row.vc_id">{{ shorten(row.vc_id) }}</a>
                <span>-</span>
              </td>
              <td>
                <a :href="`${$config.nodeServer.BASE_URL_REST}${$config.nodeServer.SCHEMA_GET_REST}${row.schemaId}:`" target="_blank">{{ shorten(row.schemaId) }}</a>
              </td>
              <td>{{ row.subjectDid }}</td>
              <td>{{ row.credStatus ? row.credStatus.issuanceDate: "-"}}</td>
              <td>{{ row.credStatus ? row.credStatus.expirationDate : "-"}}</td>
              <!-- <td>{{ row.credStatus ?  row.credStatus.credentialHash : "-"}}</td>  -->
              <td> {{ row.credStatus ? row.credStatus.claim.currentStatus : "Initiated"}}</td>
              <td>{{ row.credStatus ? row.credStatus.claim.statusReason  : "-"}}</td>
              <td> 
                <button type="button" class="btn btn-primary" @click="generateCred(`${row._id}`)" v-if="row.credStatus">Send</button>
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </table>
        <hf-pop-up Header="Accept Credential URL"> 
            <Info message="Copy and send this URL to the credential owner so that they can accept in their wallet" />
            <p style="max-width: 500px; word-wrap: break-word;">{{ credUrl}}</p>
        </hf-pop-up>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import Info from '@/components/Info.vue'
import UtilsMixin from '../mixins/utils';
import HfPopUp from "../components/element/hfPopup.vue";
import Loading from "vue-loading-overlay";
export default {
  name: "IssueCredential",
  components: { Info, HfPopUp, Loading },
  computed: {
    vcList(){
      return this.$store.state.vcList;
    },
    selectOptions(){
      return this.$store.getters.listOfAllSchemaOptions;
    }
  },
  data() {
    return {
      authToken: localStorage.getItem('authToken'),
      description: "An issuer can issue a credential to a subject (or holder) which can be verfied by the verifier independently, without having him to connect with the issuer. They are a part of our daily lives; driver's licenses are used to assert that we are capable of operating a motor vehicle, university degrees can be used to assert our level of education, and government-issued passports enable us to travel between countries.  For example: an airline company can issue a flight ticket (\"verfiable credential\") using schema (issued by DGCA) to the passenger.",
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
      vcCredStatusMap: {}, 
      schemaList: [],
      fullPage: true,
      isLoading: false,
      holderDid: "",
      schema_page: 1,
      credUrl:"",
      QrData: {
        "QRType": "ISSUE_CREDENTIAL",
        "serviceEndpoint": "",
        "schemaId": "",
        "appDid": "",
        "appName": "Hypersign Studio",
        "challenge": "",
        "provider": "",
        "data": ""
      }
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    async  generateCred(id) {

      const body = {
        id
      }
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      }
      const URL = this.$config.studioServer.BASE_URL + this.$config.studioServer.ACCPCT_CRED_EP
      
      const res = await fetch(URL, options)
      const resp =await res.json()
      this.credUrl = resp.url;
      this.$root.$emit('modal-show')
      this.notifySuccess("Cred Url Generated Successfully")
    },
    openWallet(url) {
      if (url != "") {
        this.walletWindow = window.open(
          `${url}`,
          "popUpWindow",
          `height=800,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes`
        );
      }
    },
    OnSchemaSelectDropDownChange(event) {
      if (event) {
        this.issueCredAttributes = [];
        const id = this.issueCredAttributes.length;
        const selectedSchema = this.$store.getters.findSchemaBySchemaID(event);
        const schemaMap =  selectedSchema.schemaDetails.schema.properties;
        for (const e in schemaMap) {
          this.issueCredAttributes.push({
            id: id + event,
            type: e.type,
            name: e,
            required: e.required === true ? true : false,
            value: "",
          });
        }
      } else {
        this.issueCredAttributes = [];
      }
    },
    forceFileDownload(data, fileName) {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    downloadCredentials() {
      this.forceFileDownload(
        JSON.stringify(this.signedVerifiableCredential),
        "vc.json"
      );
    },
    generateAttributeMap() {
      let attributesMap = [];
      if (this.issueCredAttributes.length > 0) {
        this.issueCredAttributes.forEach((e) => {
          attributesMap[e.name] = e.value;
        });
      }
      console.log(attributesMap);
      return attributesMap;
    },
    async issueCredential() {
      try {
        this.isLoading = true
        if (this.holderDid == "") throw new Error("Please enter the holder did")
        if (this.selected == null) throw new Error("Please select a schema")

        // generateAttributeMap
        const attributeMap = await this.generateAttributeMap();

        const fields = Object.assign({}, attributeMap)
        const schemaId = this.selected
        const issuerDid = this.user.id
        const subjectDid = this.holderDid

        const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_ISSUE_EP}`;

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.authToken}`
        };
        const creadData = {
          fields,
          schemaId,
          issuerDid,
          subjectDid
        };
        this.QrData.data = creadData
        fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({ QR_DATA: this.QrData }),
        }).then((res) => res.json())
          .then(json => {
            const { QR_DATA } = json
            const URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`
            this.openWallet(URL)
          })
      } catch (e) {
        this.isLoading = false
        this.notifyErr(`Error: ${e.message}`)
      } finally {
        this.isLoading = false;
      }
    },
  },
  mixins: [UtilsMixin],

};
</script>


