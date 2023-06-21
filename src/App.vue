<template>
  <v-app>
    <Navbar></Navbar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { auth, onAuthStateChanged, getAuth, signOut } from "../firebase.js";
import store from "@/store.js";
import Navbar from "@/components/Navbar.vue";
export default {
  name: "App",
  components: { Navbar },
  data() {
    return {
      store,
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
        store.isAuthenticated = true;
      } else {
        console.log("Not Authenticated");
        store.isAuthenticated = false;
      }
    });
  },
};
</script>
