<template>
  <div>
    <v-container fill-height fluid class="align-start">
      <v-col cols="12">
        <h1>
          <v-icon color="black" large>mdi mdi-dice-5-outline</v-icon>
          {{ boardGameInfo.bgName }}
        </h1>
        <v-divider class="mb-2"></v-divider>

        <v-row>
          <v-col cols="12" sm="3">
            <v-card height="250px" width="250px">
              <v-img :src="boardGameInfo.bgImageUrl"></v-img>
            </v-card>
          </v-col>
          <v-col cols="12" sm="9">
            <h2>Edition: {{ boardGameInfo.edition }}</h2>
            <v-spacer></v-spacer>

            <h2>
              Number of Players:

              {{ boardGameInfo.numberofPlayersMin }} to
              {{ boardGameInfo.numberofPlayersMax }} players
            </h2>

            <v-spacer></v-spacer>
            <h2>Avrage Play Time: {{ boardGameInfo.playTime }} Min</h2>
          </v-col>
        </v-row>
        <v-divider class="mb-7"></v-divider>

        <h2>Descrition:</h2>
        <v-card color="teal">
          <h3 style="max-height: 150px; overflow-y: auto">
            {{ boardGameInfo.desctiption }}
          </h3>
        </v-card>
        <v-divider class="mb-7"></v-divider>

        <v-row>
          <v-chip
            class="pa-5 mx-auto mb-4"
            color="teal darken-4"
            dark
            v-for="category in boardGameInfo.categories"
            :key="category"
            ><v-icon>mdi mdi-dice-multiple-outline</v-icon>
            <h1>{{ category }}</h1></v-chip
          >
        </v-row>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import store from "@/store";
import { doc, getDoc, db } from "../../firebase.js";

export default {
  name: "BoardGameSingle",
  components: {},
  data() {
    return {
      store,
      RouteID: this.$route.params.id,
      boardGameInfo: {},
    };
  },
  methods: {
    async getBoardGame() {
      try {
        const docRef = doc(db, "boardGames", this.RouteID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document bglist data:", docSnap.data());
          return {
            boardGameId: this.RouteID,
            bgImageUrl: docSnap.data().bgImageUrl,
            bgName: docSnap.data().bgName,
            categories: [...docSnap.data().categories],
            edition: docSnap.data().edition,
            numberofPlayersMin: docSnap.data().numberofPlayers[0],
            numberofPlayersMax: docSnap.data().numberofPlayers[1],
            playTime: docSnap.data().playTime,
            desctiption: docSnap.data().desctiption,
          };
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
          return null;
        }
      } catch (error) {
        console.log(" eror ->", error);
        //return null;
      }
    },
  },

  async mounted() {
    this.boardGameInfo = await this.getBoardGame();
  },
};
</script>
