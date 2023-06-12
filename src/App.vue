<template>
  <v-app>
    <v-app-bar app color="teal darken-4" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>
      <!--
      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>-->
      <v-spacer></v-spacer>

      <v-btn to="/sesions"> Sesions </v-btn>

      <v-spacer></v-spacer>

      <v-btn to="/register"> Register </v-btn>

      <v-spacer></v-spacer>

      <v-btn to="/login"> Log-In </v-btn>

      <v-spacer></v-spacer>

      <v-btn @click="logOut"> LogOut </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { auth, onAuthStateChanged, getAuth, signOut } from "../firebase.js";
export default {
  name: "App",

  data() {
    return {
      isAuthenticated: false,
    };
  },
  methods: {
    logOut() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          console.log("signed out");
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          console.log("desio se error", error.code);
        });
    },
  },
  beforeCreate() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Authenticated");
        this.isAuthenticated = true;
      } else {
        console.log("Not Authenticated");
        this.isAuthenticated = false;
      }
    });
  },
};
</script>
