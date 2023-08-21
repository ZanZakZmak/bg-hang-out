<template>
  <v-container fill-height fluid class="background teal lighten-1">
    <v-row align="center" justify="center">
      <v-col align="center" justify="center" cols="8"
        ><v-img
          lazy-src="https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2020_25/3390425/board-games-kr-2x1-tease-200616.jpg"
          max-height="auto"
          max-width="auto"
          src="https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2020_25/3390425/board-games-kr-2x1-tease-200616.jpg"
        ></v-img
      ></v-col>
      <v-col v-show="!isAuthenticated" align="center" justify="center" cols="4">
        <v-card class="blue-grey darken-3">
          <v-card-title>Prijavite se </v-card-title>
          <v-card-text>Pridružite se i vi te zaigrajte igre </v-card-text>
          <v-card-actions>
            <v-container>
              <v-row
                ><v-col><v-btn to="/register">Register</v-btn></v-col>
              </v-row>
              <v-row
                ><v-col><v-btn to="/login">LogIn</v-btn></v-col>
              </v-row>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth, onAuthStateChanged } from "../../firebase.js";
export default {
  name: "LandingPage",

  components: {},
  data() {
    return { isAuthenticated: false };
  },
  beforeCreate() {
    // unesecary remove later
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
