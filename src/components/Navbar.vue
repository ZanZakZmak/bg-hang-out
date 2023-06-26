<template>
  <v-app-bar app dark>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    <img width="50" height="50" src="@/assets/logo.png" alt="khmmm" />
    <v-spacer></v-spacer>

    <v-text-field
      v-model="store.searchTerm"
      solo
      hide-details
      dense
      label="ovdje sam"
      prepend-inner-icon="mdi-magnify"
    ></v-text-field>

    <v-spacer></v-spacer>
    <!--lo out has to triger a function-->
    <v-btn v-show="store.isAuthenticated" @click="logOut()">
      <v-icon left>mdi-logout-variant</v-icon> <span>Logout</span></v-btn
    >

    <v-navigation-drawer app v-model="drawer" absolute temporary>
      <v-list>
        <!--avatar and text-->
        <v-list-item to="/edit-profile">
          <v-list-item-avatar>
            <v-img src="@/assets/logo.png"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>John Leider</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!--routes-->
        <v-list-item
          v-for="option in options"
          :key="option.name"
          :to="option.path"
        >
          <v-list-item-icon>
            <v-icon>{{ option.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ option.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script>
import { auth, onAuthStateChanged, getAuth, signOut } from "../../firebase.js";
import store from "@/store.js";
export default {
  name: "Navbar",
  props: [""],

  data() {
    console.log("heloo u konzlu :");
    return {
      store,
      drawer: false,
      options: [
        {
          name: "sesions",
          icon: "mdi-view-dashboard",
          path: "/sesions",
        },
        { name: "manage sesion", icon: "mdi-view-dashboard-edit", path: "/" },
        {
          name: "board games",
          icon: "mdi-view-dashboard-edit",
          path: "/board-games",
        },
        {
          name: "board game lists",
          icon: "mdi-view-dashboard-edit",
          path: "/board-game-list",
        },
        {
          name: "edit profile",
          icon: "mdi-view-dashboard-edit",
          path: "/edit-profile",
        },
        //temporary
        {
          name: "register",
          icon: "mdi-view-dashboard-edit",
          path: "/register",
        },
        { name: "login", icon: "mdi-view-dashboard-edit", path: "/login" },
        {},
      ],
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
};
</script>
