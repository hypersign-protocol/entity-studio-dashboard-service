<style scoped>
.home {
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

.sm-tiles {
  float: left;
  padding: 5px;
  border: 1px solid #8080807d;
  margin: 1%;
  border-radius: 5px;
  background: #f5dda71c;
  color: #888b8f;
}

.sm-tiles:hover {
  float: left;
  padding: 5px;
  border: 1px solid #8080807d;
  margin: 1%;
  border-radius: 5px;
  background: #f5dda7a3;
  ;
  font-style: bold;
  color: #888b8f;
}

.word-wrap {
  word-wrap: anywhere;
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
            <b-button v-b-toggle.collapse-1 variant="link">Create Schema</b-button>
          </div>
          <b-collapse id="collapse-1" class="mt-2">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group form-inline">
                    <label style="margin-right: 8%">Schema Name:</label>
                    <input type="text" v-model="credentialName" size="30" placeholder="Enter schema name"
                      class="form-control" />
                  </div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 12%">Description:</label>
                    <textarea v-model="credentialDescription" rows="5" cols="29" placeholder="Enter description"
                      class="form-control"></textarea>
                  </div>
                  <div class="form-group form-inline">
                    <label style="margin-right: 3%">Additional Properties</label>
                    <input size="100px" v-model="additionalProperties" type="checkbox" />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-md-6">
                    <div class="form-group form-inline">
                      <label style="margin-right: 5%">Name</label>
                      <input type="text" class="form-control" size="30" v-model="attributeName"
                        placeholder="Enter attribute name" />
                    </div>
                    <div class="form-group form-inline">
                      <label style="margin-right: 5%">Type</label>
                      <input type="text" class="form-control" size="30" v-model="attributeTypes"
                        placeholder="Enter attribute Type (eg. String)" />
                    </div>
                    <div class="form-group form-inline">
                      <label style="margin-right: 5%">Format</label>
                      <input type="text" class="form-control" size="30" v-model="attributeFormat"
                        placeholder="Enter attribute Format (eg email)" />
                    </div>
                    <div class="form-group form-inline">
                      <label style="margin-right: 5%">Required</label>
                      <input type="checkbox" class="form-control" size="200px" v-model="attributeRequired" />
                    </div>

                    <a class="btn btn-primary" style="margin-left: 5%; border-radius:30px; color:white"
                      v-on:click="addBlankAttrBox()">Add +</a>
                  </div>
                  <div class="form-group" style="min-height:150px;max-height:150px;overflow: auto">
                    <div v-for="attr in attributes" :key="attr.type">
                      <div class="sm-tiles">
                        {{ attr.name }}
                        <span>x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <hr />
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
              <th>Schema Id</th>
              <th>Name</th>
              <th>Model Version</th>
              <th>Description</th>
              <th>Properties</th>
              <th>Created At</th>
              <th>Transaction Hash</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in schemaList" :key="row._id">
              <td>
                <a :href="`${$config.nodeServer.BASE_URL_REST}${$config.nodeServer.SCHEMA_GET_REST}${row.schemaId}:`"
                  target="_blank">{{ row.schemaId ? shorten(row.schemaId) : "-" }}</a>
              </td>

              <td>{{ row.schemaDetails ? row.schemaDetails.name : "-" }}</td>
              <td>{{ row.schemaDetails ? row.schemaDetails.modelVersion : "-" }}</td>
              <td class="word-wrap">{{ row.schemaDetails ? row.schemaDetails.schema.description : "-" }}</td>
              <td class="word-wrap">{{ row.schemaDetails ? Object.keys(row.schemaDetails.schema.properties).toString() :
                  "-"
              }}</td>

              <td>{{ row.schemaDetails ? row.schemaDetails.authored : "-" }}</td>

              <td style="word-wrap: break-word;min-width: 200px;max-width: 200px;">
                <a target="_blank"
                  :href="`${$config.explorer.BASE_URL}explorer/txdetails?hash=0x${row.transactionHash}`"
                  v-if="row.transactionHash">{{ shorten('0x' + row.transactionHash) }}</a>
                <span v-else>-</span>
              </td>
              <td>{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
        <!-- <button  @click="fetchSchemasPrev()" class="btn btn-outline-warning btn-sm">Prev</button> 
        <button class="btn btn-outline-warning btn-sm"  @click="fetchSchemasNext()"  > Next </button> -->
      </div>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
import QrcodeVue from "qrcode.vue";
import Info from '@/components/Info.vue';
import UtilsMixin from '../mixins/utils';
import Loading from "vue-loading-overlay";
export default {
  name: "IssueCredential",
  components: { QrcodeVue, Info, Loading },
  computed: {
    schemaList() {
      return this.$store.state.schemaList;
    },
    selectedOrg() {
      return this.$store.getters.getSelectedOrg;
    }
  },
  data() {
    return {
      description: "Credential Schema defines what information will go inside a verifiable credential. For example: Directorate General of Civil Aviation (DGCA) can define a schema (or format) for flights tickets, being issued by all airline companies in India.",
      active: 0,
      host: location.hostname,
      user: {},
      page: 1,
      prevRoute: null,
      attributeName: "",
      attributeTypes: "",
      attributeFormat: "",
      attributeRequired: false,
      attributes: [],
      issueCredAttributes: [],
      additionalProperties: false,
      showSchema: true,
      radioSelected: "create",
      credentialName: "",
      isCredentialIssued: false,
      signedVerifiableCredential: "",
      authToken: localStorage.getItem("authToken"),
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
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },

    addBlankAttrBox() {
      console.log(this.attributeName, this.attributeTypes);
      if (this.attributeName !== "" && this.attributeTypes !== "") {
        let obj = {
          name: this.attributeName,
          type: this.attributeTypes,
          format: this.attributeFormat,
          isRequired: this.attributeRequired

        }
        console.log(obj);
        this.attributes.push(obj)
        this.attributeName = "";
        this.attributeTypes = "";
        this.attributeFormat = "";
        this.attributeRequired = false;
      } else {
        this.notifyErr("Name or Type Cannot be blank")
      }
    },
    ssePopulateSchema(id, store) {
      const sse = new EventSource(`${this.$config.studioServer.SCHEMA_SSE}${id}`);
    
      
      sse.onmessage = function (e) {
        const data = JSON.parse(e.data)
         console.log(data);
        if (data.status === "Registered" || data.status === "Failed") {
          sse.close();
          store.dispatch("insertAschema", data)
        }
      }
      sse.onopen = function (e) {
        console.log("Connection to server opened.",e);
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
      }
    },

    createSchema() {
      try {
        this.isLoading = true
        if (this.credentialName == "")
          throw new Error("SchemaName can not be blank");
        if (this.attributes.length == 0)
          throw new Error("Atleast one attribute is required");

        const url = `${this.$config.studioServer.BASE_URL}${this.$config.studioServer.SAVE_SCHEMA_EP}`;
        const schemaData = {
          name: this.credentialName,
          author: this.user.id,
          fields: this.attributes,
          description: this.credentialDescription,
          additionalProperties: this.additionalProperties,
          orgDid: this.$store.state.selectedOrgDid
        };
        this.QrData.data = schemaData
        let headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.authToken}`
        };
        fetch(url, {
          method: "POST",
          body: JSON.stringify({ QR_DATA: this.QrData }),
          headers,
        })
          .then((res) => res.json())
          .then((j) => {
            const { QR_DATA } = j
            if (j.status === 200) {
              this.notifySuccess("Schema creation initiated. Please approve the transaction from your wallet");
              // TODO: Why this is hardcoded?
              this.credentialName = 'Schema';

              // Store the information in store.
              this.$store.dispatch('insertAschema', j.schema);

              // Open the wallet for trasanctional approval.
              const URL = `${this.$config.webWalletAddress}/deeplink?url=${JSON.stringify(QR_DATA)}`
              this.openWallet(URL)
              this.ssePopulateSchema(j.schema._id, this.$store)
            } else {
              throw new Error(`${j.error}`);
            }
          });
      } catch (e) {
        console.error(e)
        this.notifyErr(`Error: ${e.message}`);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mixins: [UtilsMixin],
};
</script>


