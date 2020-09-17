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
            </div> -->
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
export default {
  name: "Register",
  components: {},
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
    };
  },
  created() {},
  methods: {
    gotosubpage: (id) => {
      this.$router.push(`${id}`);
    },
    signup() {
      try {
        const userData = {
          id: "",
          fname: this.fullName,
          lname: this.fullName,
          phoneNumber: this.phno,
          username: this.username,
          password: sha256hashStr(this.password),
          email: this.email,
          publicKey: this.publicKey,
          privateKey: this.publicKey,
        };
        const url = `http://${this.host}:5000/api/auth/register`;
        fetch(url, {
          body: JSON.stringify(userData),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((j) => {
            if (j && j.status == 500) {
              return alert(`Error:  ${j.error}`);
            }
            this.$router.push("login");
          });
      } catch (e) {
        alert(e);
      }
    },
  },
};
</script>


