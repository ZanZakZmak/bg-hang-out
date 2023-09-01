<template>
  <div>
    <v-divider class="my-2"></v-divider>

    <!--content start-->
    <v-container fill-height fluid>
      <v-row>
        <v-col cols="3">
          <!--width="auto" full width za uredit kartice na kraju-->
          <!--ELEM session card-->
          <v-row>
            <v-card class="mx-auto mb-4" max-width="400" dark>
              <v-card-title> fdsdfsdf </v-card-title>

              <v-card-subtitle align="center" justify="center">
                Board Game sdfdsfsd
              </v-card-subtitle>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Date: sdfdsf</v-list-item-title>
                  <v-list-item-title>Time:dsfsdfd</v-list-item-title>
                  <v-list-item-title>Location: sfdsdf</v-list-item-title>
                  <v-divider inset></v-divider>
                  <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-card-subtitle>Curently joined </v-card-subtitle>
              <v-card-subtitle class="pa-0 ma-1">
                <v-chip class="ma-2" color="teal darken-4">
                  <v-avatar left>
                    <v-icon>mdi-account-circle</v-icon>
                  </v-avatar>
                  sdfsdfds
                </v-chip>
              </v-card-subtitle>
              <v-divider></v-divider>
              <v-card-subtitle>Aditional notes</v-card-subtitle>

              <v-card-subtitle style="max-height: 100px; overflow-y: auto">
                sdfdsdfsd
              </v-card-subtitle>
              <v-container>
                <v-row> <v-col>helooo</v-col> </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-chip class="ma-1"> sdfsdfsd </v-chip>

              <v-divider></v-divider>
              <v-spacer></v-spacer>
              <v-card-actions class="justify-end">
                <v-card-subtitle>created by: dsfsdf at dsfsdf</v-card-subtitle>
                <v-spacer></v-spacer>
                <v-btn
                  @click="
                    joinSession(
                      session.seshId,
                      store.storeData.userInfo.userId,
                      session.createdByID,
                      session.wantedPlayers,
                      session.joinedPlayers
                    )
                  "
                  >Join</v-btn
                >
              </v-card-actions>
              <!--
              <v-card-actions>
                <v-btn color="orange lighten-2" text> Explore </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon @click="Bgame.show = !Bgame.show">
                  <v-icon>{{
                    Bgame.show ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>
                
              <v-expand-transition>
                <div v-show="Bgame.show">
                  <v-divider></v-divider>

                  <v-card-text>
                    I'm a thing. But, like most politicians, he promised more
                    than he could deliver. You won't have time for sleeping,
                    soldier, not with all the bed making you'll be doing. Then
                    we'll go with that data file! Hey, you add a one and two
                    zeros to that or we walk! You're going to do his laundry?
                    I've got to find a way to escape.
                  </v-card-text>
                </div>
              </v-expand-transition>
              -->
            </v-card>
          </v-row>
        </v-col>

        <v-col cols="7" align="center" justify="center">
          <!--ELEM Filter card za sessions-->
          <v-card dark height="auto" min-width="300" class="pa-3">
            <v-card-title>Edit profile</v-card-title>
            <v-divider></v-divider>

            <v-card-subtitle>Change Username</v-card-subtitle>
            <v-row class="my-3">
              <v-col cols="9">
                <v-form v-model="formValidName">
                  <v-text-field
                    v-model="newUsername"
                    label="write new username"
                    type="text"
                    dense
                    clearable
                    outlined
                    class="mx-3"
                    :rules="[rules.required]"
                  />
                </v-form>
              </v-col>

              <v-col cols="1">
                <v-btn
                  class="mx-3"
                  @click="changeUsername()"
                  :disabled="!formValidName"
                  >apply</v-btn
                >
              </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-card-subtitle>Change Email</v-card-subtitle>
            <v-row class="my-3">
              <v-form v-model="formValidEmail">
                <v-text-field
                  v-model="newEmail"
                  label="write new email"
                  type="text"
                  dense
                  clearable
                  outlined
                  class="mx-3"
                  :rules="[rules.required, rules.email]"
                />
              </v-form>
              <v-btn
                class="mx-3"
                :disabled="!formValidEmail"
                @click="changeEmail()"
                >apply</v-btn
              >
            </v-row>

            <v-divider></v-divider>

            <v-card-subtitle>Change Password</v-card-subtitle>
            <v-row class="my-3">
              <v-form v-model="formValidPassword">
                <v-text-field
                  v-model="newPassword"
                  label="write new password"
                  type="text"
                  dense
                  clearable
                  outlined
                  class="mx-3"
                  :rules="[rules.required, rules.min]"
                />

                <v-text-field
                  v-model="newPasswordRepeat"
                  label="repeat new password"
                  type="text"
                  dense
                  clearable
                  outlined
                  class="mx-3"
                  :rules="[rules.required, rules.min]"
                />
              </v-form>
              <v-btn
                class="mx-3"
                @click="changePassword()"
                :disabled="!formValidPassword || !isPasswordSame"
                >apply</v-btn
              >
            </v-row>

            <v-card-actions> </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!--end-->
    <!--snacbar warning-->
    <template>
      <div class="text-center ma-2">
        <v-snackbar v-model="snackbar" timeout="3000" color="red">
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn
              color="black"
              text
              v-bind="attrs"
              @click="
                snackbar = false;
                text = '';
              "
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </template>
  </div>
</template>

<script>
//staviti mogucnost #promjene lozinke pogledat dostupne alate u firebae , # promjena maila , promjena username
//{? #ocjena #liste prijatelja i zahtjeva, #zasebni search za korisnike #profil za korisnika #dodavanje avatara nece se izraditi}
//za ostalo probati napraviti blob storage za slike sa vue croppa
// single bg profile i funkciju koja vodi na njega te dodati u sve
// pogledati malo funkcionalnosti sa ogranićavanjem duplikati pravila strukturirati malo try catch na backend upitima , izbrisati nepotrebne stvari doraditi vizualno još, urediti podatke na backendu
import store from "@/store";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  db,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  getAuth,
  updateEmail,
  updatePassword,
} from "../../firebase.js";

export default {
  name: "EditProfile",

  components: {},
  data() {
    return {
      store,
      snackbar: false,
      text: "",
      // form data
      newUsername: null,
      newEmail: null,
      newPassword: null,
      newPasswordRepeat: null,
      //form validity
      formValidName: false,
      formValidEmail: false,
      formValidPassword: false,

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
  computed: {
    isPasswordSame: function () {
      return this.newPassword == this.newPasswordRepeat;
    },
  },
  methods: {
    async changeUsername() {
      try {
        const userRef = doc(db, "users", store.storeData.userInfo.userId);
        await updateDoc(userRef, {
          userName: this.newUsername,
        });
      } catch (error) {
        console.log("changeUsername error-> ", error);
      }
      //this.closeDialogSingleList();
    },
    //treba dodat da ponovo autentificira za ovo
    async changePassword() {
      const auth = getAuth();

      const user = auth.currentUser;

      updatePassword(user, this.newPassword)
        .then(() => {
          // Update successful.
          console.log("Password updated!");
        })
        .catch((error) => {
          // An error ocurred
          this.text = "Try logout and login again to use this feature";
          this.snackbar = true;
          console.log("Password not updated! error->", error);
        });
    },
    //treba dodat da ponovo autentificira za ovo
    async changeEmail() {
      const auth = getAuth();
      const user = auth.currentUser;
      await updateEmail(user, this.newEmail)
        .then(async () => {
          // Email updated!

          console.log("Email updated!");
          try {
            const userRef = doc(db, "users", store.storeData.userInfo.userId);
            await updateDoc(userRef, {
              email: this.newEmail,
            });
          } catch (error) {
            this.text = "Try logout and login again to use this feature";
            this.snackbar = true;
            console.log(" error-> ", error);
          }
          this.newEmail = null;
        })
        .catch((error) => {
          // An error occurred

          console.log("Erorr email not updated!", error);
        });
    },
  },
  beforeCreate() {},
};
</script>
