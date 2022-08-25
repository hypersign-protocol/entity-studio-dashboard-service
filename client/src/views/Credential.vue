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

.card-header {
  background: aliceblue;
  padding: 0px;
}

.card {
  border-radius: 10px;
}
</style>
<template>
  <div class="home marginLeft marginRight">
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
                      <input type="text" v-model="attr.value" class="form-control" placeholder="Enter attribute value"  />
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
              <th>id</th>
              <th>schemaId</th>
             
              <th>subjectDid</th>
              <th>expirationDate</th>
              <th>Issue</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in vcList" :key="row">
              <th scope="row">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" :id="row.id" />
                  <label class="custom-control-label" :for="row.id"><a :href="`${row.vc_id}:`"  >{{ row.vc.id }}</a></label>
                </div>
              </th>
              <td>{{ row.schemaId }}</td>
             
              <td>{{ row.subjectDid }}</td>
              <td>{{ row.vc.expirationDate}}</td>
              <td><a href="#">ISSUE</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import conf from '../config';
const { hypersignSDK } = conf;
import QrcodeVue from "qrcode.vue";
import Info from '@/components/Info.vue'
export default {
  name: "IssueCredential",
  components: { QrcodeVue, Info },
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
      selectOptions: [{ value: null, text: "Please select a schema" }],
      schemaMap: {},
      vcList: [],
      schemaList: [],
      fullPage: true,
      isLoading: false,
      holderDid: "",
      schema_page: 1,
       QrData: { 
      "QRType": "ISSUE_CREDENTIAL",
       "serviceEndpoint": "", 
       "schemaId": "", 
       "appDid": "", 
       "appName": "Hypersign Studio", 
       "challenge": "", 
       "provider": "" ,
        "data" :""
       }
    };
  },
  created() {
    const usrStr = localStorage.getItem("user");
    this.user = JSON.parse(usrStr);
    //console.log(this.user)
    this.getList('SCHEMA')
    this.getList('CREDENTIAL')
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
     openWallet(url) {
      if (url != "") {
        this.walletWindow = window.open(
          `${url}`,
          "popUpWindow",
          `height=800,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes`
        );
      }
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
        if (schemaList && schemaList.length > 0) {
          schemaList.forEach(async s => {
            if (s.did != this.user.id) return
            console.log(s);
            if(s.status==="Registered"){
           let schemaGetURL=`${this.$config.nodeServer.BASE_URL_REST}${this.$config.nodeServer.SCHEMA_GET_REST}${s.schemaId}:`
           console.log(schemaGetURL);
           const res= await  fetch(schemaGetURL)
           const data=await res.json()
          //  console.log(data.schema[0].schema.properties);
            this.schemaMap[s.schemaId] = JSON.parse(data.schema[0].schema.properties)
            if(data.schema[0].schema.required.length>0){
              data.schema[0].schema.required.forEach(e=>{
                this.schemaMap[s.schemaId][e].required=true
              })
            }
           
            this.selectOptions.push({
              value: s.schemaId,
              text: `${s.schemaId} | ${s.status}`
            })
          }
          });
        }
      } else {
        this.vcList = j.credList;
      }
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
    onSchemaOptionChange(event) {
      //console.log(event);
      this.attributes = [];
      this.issueCredAttributes = [];
      this.selected = null;
      this.credentialName = "";
    },
    OnSchemaSelectDropDownChange(event) {
      console.log(event);
      if (event) {
        this.issueCredAttributes = [];
        const id = this.issueCredAttributes.length;
        console.log( this.schemaMap[event]);
       for (const e in this.schemaMap[event]) {
          this.issueCredAttributes.push({
            id: id + event,
            type: e.type,
            name: e,
            required:e.required ===true?true:false,
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

    getCredentials(attributesMap) {
      console.log(this.schemaMap[this.selected]);
      const schemaUrl = `${this.$config.nodeServer.BASE_URL_REST}${this.$config.nodeServer.SCHEMA_GET_REST}/${this.selected}:`;
      return hypersignSDK.credential.generateCredential(schemaUrl, {
        subjectDid: this.holderDid,
        issuerDid: this.user.publicKey,
        expirationDate: new Date().toISOString(),
        attributesMap,
      }).then((signedCred) => {
        return signedCred;
      });
    },

    signCredentials(credential) {
      return hypersignSDK.credential.signCredential(credential, this.user.publicKey, this.user.privateKey).then(
        (signedCredential) => {
          return signedCredential;
        }
      );
    },
    async issueCredential() {
      try {
        this.isLoading = true
        if (this.holderDid == "") throw new Error("Please enter the holder did")
        if (this.selected == null) throw new Error("Please select a schema")

        // generateAttributeMap
        const attributeMap = await this.generateAttributeMap();
         
        // const verifiableCredential = await this.getCredentials(attributeMap);
        // signCredentials
        
        const fields=Object.assign({},attributeMap)
        const schemaId=this.selected
        const issuerDid=this.user.id
        const subjectDid=this.holderDid
        



        // const signedVerifiableCredential = await this.signCredentials(
        //   verifiableCredential
        // );


  //       this.signedVerifiableCredential = signedVerifiableCredential;
  // console.log(signedVerifiableCredential);
        const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.CRED_ISSUE_EP}`;
        console.log(url);
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
        this.QrData.data=creadData
        fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify({QR_DATA:this.QrData }),
        }).then((res)=>res.json())
        .then(json=>{
          console.log(json);
          const {QR_DATA}=json
            const URL=`${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`
           console.log(URL);
           this.openWallet(URL)
        })

        //   .then((res) => res.json())
        //   .then((j) => {
        //     if (j.status != 200) throw new Error(`Error: ${j.error}`);
        //     if (j.status === 200) {
        //       this.isCredentialIssued = true;
        //       this.onSchemaOptionChange(null);
        //       this.vcList.push({
        //         ...j.message
        //       })
        //       this.isLoading = false
        //       this.notifySuccess("Credential successfully issued")
        //     }
        //   })
        //   .catch((e) => {
        //     this.isLoading = false
        //     this.notifyErr(`Error: ${e.message}`)
        //   });
      } catch (e) {
        this.isLoading = false
        this.notifyErr(`Error: ${e.message}`)
      }
    },
  },
};
</script>


