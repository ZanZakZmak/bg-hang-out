<template>
  <v-app>
    <Navbar></Navbar>
    <v-main class="background teal lighten-1">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import {
  auth,
  onAuthStateChanged,
  getAuth,
  signOut,
  doc,
  getDoc,
  db,
} from "../firebase.js";

import store from "@/store.js";
import Navbar from "@/components/Navbar.vue";
import router from "./router/index.js";
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
    async setStoreUserInfo(userID) {
      const docRef = doc(db, "users", userID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        store.storeData.userInfo.userName = docSnap.data().userName;
        store.storeData.userInfo.userId = docSnap.id;
        store.storeData.userInfo.userEmail = docSnap.data().email;
        console.log("Document data:", docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    },
  },
  beforeCreate() {
    onAuthStateChanged(auth, async (user) => {
      const currentRoute = router.currentRoute;
      if (user) {
        console.log("Authenticated");
        store.isAuthenticated = true;
        //add to store fec from firebase
        await this.setStoreUserInfo(user.uid);
        if (
          !currentRoute.meta.needsUser &&
          currentRoute.name != "landingpage-view"
        ) {
          router.push({ name: "landingpage-view" });
        }
      } else {
        console.log("Not Authenticated");
        store.isAuthenticated = false;
        //remove from store
        store.storeData.userInfo.userName = "";
        store.storeData.userInfo.userId = "";
        if (
          currentRoute.meta.needsUser &&
          currentRoute.name != "landingpage-view"
        ) {
          router.push({ name: "landingpage-view" });
        }
      }
    });
  },
};
</script>
