<template>
  <v-container fill-height fluid class="background">
    <v-row align="center" justify="center">
      <v-col align="center" justify="center" cols="12">
        <v-card class="card-border" width="600px" outlined>
          <v-card-title align="left">REGISTER</v-card-title>
          <v-card-subtitle align="left">
            Register to enjoy the app
          </v-card-subtitle>
          <v-card-text>
            <!--v-model="valid"-->
            <v-form v-model="valid">
              <v-text-field
                v-model="userName"
                dense
                label="UserName"
                clearble
                type="text"
                outlined
                :rules="[rules.required]"
              ></v-text-field>
              <!--:rules="[rules.required, rules.email]"-->

              <v-text-field
                required
                v-model="email"
                dense
                label="email"
                clearble
                type="text"
                outlined
                :rules="[rules.required, rules.email]"
              ></v-text-field>
              <v-text-field
                v-model="password"
                dense
                label="password"
                clearble
                :append-icon="showIcon ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="showIcon ? 'text' : 'password'"
                outlined
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="card-actions">
            <v-btn
              class="btn-right-margin"
              @click="clearDataFromRegisterForm"
              color="red darken-3"
              outlined
            >
              CLEAR
            </v-btn>
            <!--:disabled="isButtonDisabled"-->
            <v-btn
              :disabled="isButtonDisabled"
              outlined
              @click="registerAddUser"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-btn @click="saveUserInfoToDatabase('345')"></v-btn>
    </v-row>
  </v-container>
</template>

<script>
import {
  auth,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  db,
} from "../../firebase.js";
export default {
  name: "Register",

  components: {},
  data() {
    return {
      isButtonDisabled: true,
      valid: true,
      email: null,
      password: null,
      userName: null,
      showIcon: true,
      //regEX exspresions for rules
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v?.length >= 6 || "Min 6 characters",
        email: (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid",
      },
      //user info
    };
  },
  methods: {
    clearDataFromRegisterForm() {
      this.valid = true;
      this.email = null;
      this.password = null;
      this.userName = null;
    },
    async registerAddUser() {
      const email = this.email;
      const password = this.password;
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("uspjesno autentificiran ", user.uid);
          // add user info to colection make the id
          this.saveUserInfoToDatabase(user.uid);
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error, errorCode, errorMessage);
          // ..
        });
    },
    // dodati user info koji je potreban
    async saveUserInfoToDatabase(idUser) {
      await setDoc(doc(db, "users", idUser), {
        email: this.email,
        password: this.password,
        userName: this.userName,
        bgLists: [],
        createdSessions: [],
        joinedSessions: [],
      });
    },
  },
  mounted() {
    console.log("na register sam ");
  },
  // mora watch jer inaće ne radi poziv kako treba
  watch: {
    valid: function (isValid) {
      this.isButtonDisabled = !isValid;
    },
  },
  /*computed: {
    setButton: function () {
      this.isButtonDisabled = !this.valid;
    },
  },*/
};
</script>
<style>
.card-border {
  padding: 2%;
}

.card-text-border {
  padding: 2.5%;
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.btn-right-margin {
  margin-right: 2%;
}
</style>
