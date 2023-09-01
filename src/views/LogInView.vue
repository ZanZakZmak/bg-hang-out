<template>
  <v-container fill-height fluid class="background">
    <v-row align="center" justify="center">
      <v-col align="center" justify="center" cols="12">
        <v-card class="card-border" width="600px" outlined dark>
          <v-card-title align="left">LOGIN</v-card-title>
          <v-card-subtitle align="left"> Deer user, plz login </v-card-subtitle>
          <v-card-text class="card-text-border">
            <v-form v-model="valid">
              <v-text-field
                v-model="email"
                dense
                label="Email"
                clearble
                type="text"
                :rules="[rules.required, rules.email]"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="password"
                dense
                label="Password"
                clearble
                :append-icon="showIcon ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="showIcon ? 'text' : 'password'"
                outlined
              ></v-text-field>
            </v-form>
            <!--<v-btn
							@click="openDialog"
							class="link-left"
							text
							x-small
							color="blue">
							Forgot password?
						</v-btn>-->
          </v-card-text>
          <v-card-actions class="card-actions">
            <v-btn @click="logIn" :disabled="isButtonDisabled" outlined>
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
        <!--<v-dialog
					width="300px"
					outlined
					persistent
					v-model="passwordIssuesDialog">
					<v-card class="card-border">
						<v-card-title>E-mail</v-card-title>
						<v-card-subtitle>
							Please enter you e-mail
						</v-card-subtitle>
						<v-card-text>
							<v-text-field
								v-model="emailForPassword"
								dense
								label="Email"
								clearble
								type="text"
								:rules="[rules.required, rules.email]"
								outlined></v-text-field>
						</v-card-text>
						<v-card-actions class="card-actions">
							<v-btn
								class="btn-right-margin"
								color="red darken-3"
								outlined
								text
								small
								@click="closeDialog">
								CLOSE
							</v-btn>
							<v-btn
								outlined
								text
								@click="resetPassword(emailForPassword)">
								SEND
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { signInWithEmailAndPassword, auth } from "../../firebase.js";
export default {
  name: "LogIn",

  components: {},
  data() {
    return {
      valid: true,
      email: null,
      password: null,
      isButtonDisabled: true,
      showIcon: true,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v?.length >= 6 || "Min 6 characters",
        email: (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid",
      },
    };
  },
  mounted() {
    console.log("na loginu sam");
  },
  // mora watch jer inaće ne radi poziv kako treba
  watch: {
    valid: function (isValid) {
      this.isButtonDisabled = !isValid;
    },
  },
  /*computed: {
    setButton: function () {
      console.log("nepozivam se");
      this.isButtonDisabled = !this.valid;
    },
  },*/
  methods: {
    logIn() {
      const email = this.email;
      const password = this.password;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
          //this.$router.push({ path: "/" });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error, errorCode, errorMessage);
        });
    },
  },
};
</script>
