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
.sm-tiles{
  float: left;
padding: 5px;
border: 1px solid #8080807d;
margin: 1%;
border-radius: 5px;
background: #f5dda71c;
color: #888b8f;
}
.sm-tiles:hover{
    float: left;
padding: 5px;
border: 1px solid #8080807d;
margin: 1%;
border-radius: 5px;
background: #f5dda7a3;;
font-style: bold ;
color: #888b8f;
}


.card{
  border-radius: 10px;
}

</style>
<template>
  <div class="home marginLeft marginRight">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage"></loading>

    <div class="row">
      <div class="col-md-12" style="text-align: left">
        <Info :message="description"/>
        <div class="card">
          <div class="card-header">
            <b-button v-b-toggle.collapse-1 variant="link">Create Schema</b-button>
          </div>
          <b-collapse id="collapse-1" class="mt-2">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group form-inline">
                    <label style="margin-right: 8%">Schema Name:</label>
                    <input
                      type="text"
                      v-model="credentialName"
                      size="30"
                      placeholder="Enter schema name"
                      class="form-control"
                    />
                  </div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 12%">Description:</label>
                    <textarea
                      v-model="credentialDescription"
                      rows="5"
                      cols="29"
                      placeholder="Enter description"
                      class="form-control"
                    ></textarea>
                  </div>
                   <div class="form-group form-inline">
                    <label style="margin-right: 3%">Additional Properties</label>
                    <input
                    size="100px"
                      v-model="additionalProperties"
                     type="checkbox"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-md-6">
                  <div class="form-group form-inline">
                    <label style="margin-right: 5%">Name</label>
                    <input
                      type="text"
                      class="form-control"
                      size="30"
                      v-model="attributeName"
                      placeholder="Enter attribute name"
                    />
                    </div>
                    <div class="form-group form-inline">
                    <label style="margin-right: 5%">Type</label>
                    <input
                      type="text"
                      class="form-control"
                      size="30"
                      v-model="attributeTypes"
                      placeholder="Enter attribute Type (eg. String)"
                    />
                    </div>
                    <div class="form-group form-inline">
                    <label style="margin-right: 5%">Format</label>
                    <input
                      type="text"
                      class="form-control"
                      size="30"
                      v-model="attributeFormat"
                      placeholder="Enter attribute Format (eg email)"
                    />
                    </div>
                     <div class="form-group form-inline">
                    <label style="margin-right: 5%">Required</label>
                    <input
                      type="checkbox"
                      class="form-control"
                      size="200px"
                      v-model="attributeRequired"
                    
                    />
                  </div>
                  
                    <a
                      class="btn btn-primary"
                      style="margin-left: 5%; border-radius:30px; color:white"
                      v-on:click="addBlankAttrBox()"
                    >Add +</a>
                  </div>
                  <div class="form-group" style="min-height:150px;max-height:150px;overflow: auto">
                    <div v-for="attr in attributes" :key="attr.type">
                      <div class="sm-tiles">
                        {{attr.name}}
                        <span>x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <hr/>
                  <button class="btn btn-outline-primary btn-sm" @click="createSchema()">Create</button>
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
              <th>Schema Name</th>
              <th>attributes</th>
              <th>status</th>
              <th>author</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in schemaList" :key="row">
              <th>
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" class="custom-control-input" :id="row._id" />
                  <label class="custom-control-label" :for="row.id"><a :href="`${$config.nodeServer.BASE_URL}${$config.nodeServer.SCHEMA_GET_EP}/`+row.id" target="_blank">{{row.id}}</a></label>
                </div>
              </th>
              <td>{{}}</td>
              <!-- <td>{{row.attributes}}</td> -->
              <td
                style="word-wrap: break-word;min-width: 200px;max-width: 200px;"
              >{{row.schemaData.fields}}</td>
              <td>{{row.status}}</td>
              <td>{{row.schemaData.author}}</td>
            </tr>
          </tbody>
        </table>
        <button  @click="fetchSchemasPrev()" class="btn btn-outline-warning btn-sm">Prev</button> 
        <button class="btn btn-outline-warning btn-sm"  @click="fetchSchemasNext()"  > Next </button>
        <!-- </div> -->
        <!-- </div> -->
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import QrcodeVue from "qrcode.vue";
import Info from '@/components/Info.vue'
export default {
  name: "IssueCredential",
  components: { QrcodeVue, Info },
  data() {
    return {
      description: "Credential Schema defines what information will go inside a verifiable credential. For example: Directorate General of Civil Aviation (DGCA) can define a schema (or format) for flights tickets, being issued by all airline companies in India.",
      active: 0,
      host: location.hostname,
      user: {},
      page:1,
      prevRoute: null,
      attributeName: "",
      attributeTypes:"",
      attributeFormat:"",
      attributeRequired:false,
      attributes: [],
      issueCredAttributes: [],
      additionalProperties:false,
      showSchema: true,
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
      schemaList: [],
      credentialDescription: "",
      fullPage: true,
      isLoading: false,
      
      QrData: { 
      "QRType": "ISSUE_SCHEMA",
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
    // this.fetchSchemasPrev();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  methods: {
    notifySuccess(msg){
        this.$notify({
          group: 'foo',
          title: 'Information',
          type: 'success',
          text: msg
        });
    },
    notifyErr(msg){
      this.$notify({
          group: 'foo',
          title: 'Error',
          type: 'error',
          text: msg
        });
    },
    fetchSchemasPrev() {
     this.page-=1;
     if(this.page<1){
this.page=1;
     }
      const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SCHEMA_LIST_EP}?page=${this.page}&limit=10`;
       let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`
      };
      fetch(url,{
        headers,
       
      })
        .then((res) => res.json())
        .then((j) => {
          console.log(j);
          if (j.status != 200) throw new Error(j.error);
          this.schemaList = j.schemaList;
          if (this.schemaList && this.schemaList.length > 0) {
            this.schemaList = this.schemaList.filter(
              (x) => x.schemaData.author === this.user.id
            );
          }
        })
        .catch((e) => this.notifyErr(`Error: ${e.message}`));
    },
    
    fetchSchemasNext() {
     this.page+=1;
      const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SCHEMA_LIST_EP}?page=${this.page}&limit=10`;
       let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`
      };
      fetch(url,{
        headers,
       
      })
        .then((res) => res.json())
        .then((j) => {
          if (j.status != 200) throw new Error(j.error);
          this.schemaList = j.schemaList;
          if (this.schemaList && this.schemaList.length > 0) {
            this.schemaList = this.schemaList.filter(
              (x) => x.schemaData.author === this.user.id
            );
          }
        })
        .catch((e) => this.notifyErr(`Error: ${e.message}`));
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
      console.log(this.attributeName , this.attributeTypes);
      if (this.attributeName !==""  && this.attributeTypes!=="" ) {
        let obj = {
          name: this.attributeName,
          type: this.attributeTypes,
          format: this.attributeFormat,
          isRequired: this.attributeRequired

        }
        console.log(obj);
        this.attributes.push(obj)
        this.attributeName ="";
        this.attributeTypes="";
        this.attributeFormat="";
        this.attributeRequired=false;
      }else{
        this.notifyErr("Name or Type Cannot be blank")
      }
    },
    // onSchemaOptionChange(event) {
    //   this.attributes = [];
    //   this.issueCredAttributes = [];
    //   this.selected = null;
    //   this.credentialName = "";
    // },
    // OnSchemaSelectDropDownChange(event) {
    //   if (event) {
    //     this.issueCredAttributes = [];
    //     this.schemaMap[event].forEach((e) => {
    //       this.issueCredAttributes.push({
    //         type: "text",
    //         name: e,
    //         value: "",
    //       });
    //     });
    //   } else {
    //     this.issueCredAttributes = [];
    //   }
    // },
    // forceFileDownload(data, fileName) {
    //   const url = window.URL.createObjectURL(new Blob([data]));
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute("download", fileName);
    //   document.body.appendChild(link);
    //   link.click();
    // },
    // downloadCredentials() {
    //   this.forceFileDownload(
    //     JSON.stringify(this.signedVerifiableCredential),
    //     "vc.json"
    //   );
    // },
     openWallet(url) {
      if (url != "") {
        this.walletWindow = window.open(
          `${url}`,
          "popUpWindow",
          `height=800,width=400,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes`
        );
      }
    },
    createSchema() {        
      this.isLoading = true
      if (this.credentialName == "")
        return this.notifyErr("Error: SchemaName can not be blank");
      if (this.attributes.length == 0)
        return this.notifyErr("Error: Atleast one attribute is required");
      const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SAVE_SCHEMA_EP}`;
      const schemaData = {
        name: this.credentialName,
        author: this.user.id,
        fields: this.attributes,
        description: this.credentialDescription,
        additionalProperties: this.additionalProperties,
      };
      this.QrData.data=schemaData
      const URLString=JSON.stringify(this.QrData)
            // const urlEncoded= encodeURI(URLString)
      const URL=`${this.$config.webWalletAddress}/deeplink?url=${URLString}`
      console.log(URL);
      let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.authToken}`
      };
    //  this.openWallet(URL)
      fetch(url, {
        method: "POST",
        body: JSON.stringify( { QR_DATA:this.QrData}),
        headers,
      })
        .then((res) => res.json())
        .then((j) => {
         const {QR_DATA}=j
          if (j.status === 200) {
            this.notifySuccess("Credential successfull created");
            this.credentialName = 'Schema'

            this.schemaList.push({
             ...(j.schema)
            });
            console.log(QR_DATA);
                  const URL=`${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`

            this.openWallet(URL)
            console.log(URL);
            this.isLoading = false
          } else {
            this.isLoading = false
            this.notifyErr(`Error: ${j.error}`);
          }
        });
    },
  },
};
</script>


