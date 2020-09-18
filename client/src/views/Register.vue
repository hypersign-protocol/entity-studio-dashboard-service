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
</style>
<template>
  <div class="home">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    <div class="col-md-4 centeralign">
      <b-card no-body style="padding: 20px">
        <h2>Admin Registration</h2>
        <hr />
        <form action="#" class="form-horizontal form-inline">
          <div class="form-group">
            <label class="control-label col-sm-3">Name:</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" v-model="fullName" />
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-3">Email:</label>
            <div class="col-sm-9">
              <input type="email" class="form-control" v-model="email" />
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-3">DID:</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" v-model="did" placeholder="did:hs:..."/>
            </div>
          </div>
          <!-- <div class="form-group">
              <label class="control-label col-sm-3">Username:</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" v-model="username" />
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-3">Password:</label>
              <div class="col-sm-9">
                <input type="password" class="form-control" v-model="password" />
              </div>
          </div>-->
        </form>
        <hr />
        <form>
          <div class="form-group">
            <div class="col-sm-offset-3 col-sm-9">
              <button
                type="button"
                data-toggle="modal"
                @click="signup()"
                class="btn btn-primary"
              >Signup</button>
              Back to
              <a href="/studio/login">Login</a>
            </div>
          </div>
        </form>
      </b-card>
    </div>
  </div>
</template>

<script>
import fetch from "node-fetch";
const { sha256hashStr } = require("../utils/hash");
import Loading from "vue-loading-overlay";
export default {
  name: "Register",
  components: {},
  components: {
    Loading,
  },
  data() {
    return {
      active: 0,
      fullName: "",
      email: "",
      phno: "",
      publicKey: "",
      username: "",
      password: "",
      host: location.hostname,
      keys: {},
      did: "",
      isLoading:  false,
      fullPage: true
    };
  },
  created() {},
  methods: {
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },

    notifySuccess(msg) {
      this.$notify({
        group: "foo",
        title: "Information",
        type: "success",
        text: msg,
      });
    },
    notifyErr(msg) {
      this.$notify({
        group: "foo",
        title: "Error",
        type: "error",
        text: msg,
      });
    },
    // async registerDid(){
    //   const url = `${this.$config.nodeServer.BASE_URL}${this.$config.nodeServer.DID_CREATE_EP}?name=${name}`;
    //   const resp = await fetch(url);
    //   const json = await resp.json();
    //   // store keys into file
    //   const { keys } = json.message;
    //   this.keys = keys;
    // },
    // forceFileDownload(data, fileName) {
    //   const url = window.URL.createObjectURL(new Blob([data]));
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute("download", fileName);
    //   document.body.appendChild(link);
    //   link.click();
    // },
    async signup() {
      this.isLoading = true
      try {

        if(this.email == "" || this.name == "" || this.did == "") throw new Error("All fields are mandatory")

        console.log('Inside signup')

        // console.log('Before registering did')
        // await this.registerDid();
        // console.log('After registering did')

        // if (!this.keys || this.keys == {})
        //   throw new Error("Could not register did");

        const userData = {
          fname: this.fullName,
          email: this.email,
          publicKey: this.did,
        };
        const url = `http://${this.host}:9000/api/auth/register`;
        const resp = await fetch(url, {
          body: JSON.stringify(userData),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const j = await resp.json();
        console.log(j)
        if (j.status == 500) {
          this.isLoading = false
          throw new Error(j.error);
        }
        this.isLoading = false
        alert("An email has been sent to you. Please click on the link to verify and download HypersignAuth credentials."); 
        this.isLoading = false
        this.$router.push("login");
      } catch (e) {
        this.isLoading = false
        this.notifyErr(e.message);
      }
    },
  },
};
</script>


