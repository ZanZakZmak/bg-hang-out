<template>
  <v-container fill-height fluid class="background teal lighten-1">
    <v-row class="background red">
      <v-col cols="9" align="center" justify="center">
        <!--<v-card
          height="100"
          width="500"
          class="mb-4"
          v-for="Bgame in boardGames"
          :key="Bgame.name"
        >
          <p>{{ Bgame.bgName }}</p>
        </v-card>-->

        <v-card
          class="mx-auto mb-4"
          max-width="270"
          v-for="Bgame in boardGames"
          :key="Bgame.name"
        >
          <v-img :src="Bgame.bgImageUrl" height="150px"></v-img>

          <v-card-title> {{ Bgame.bgName }} </v-card-title>

          <v-card-subtitle> 1,000 miles of wonder </v-card-subtitle>

          <v-card-actions>
            <v-btn color="orange lighten-2" text> Explore </v-btn>

            <v-spacer></v-spacer>

            <v-btn icon @click="show = !show">
              <v-icon>{{
                show ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>

              <v-card-text>
                I'm a thing. But, like most politicians, he promised more than
                he could deliver. You won't have time for sleeping, soldier, not
                with all the bed making you'll be doing. Then we'll go with that
                data file! Hey, you add a one and two zeros to that or we walk!
                You're going to do his laundry? I've got to find a way to
                escape.
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
      <v-col cols="3" align="center" justify="center">
        <v-card height="600" width="250">heloo</v-card>
      </v-col>
    </v-row>
    <v-spacer></v-spacer>
    <v-row color="red">
      <v-col>
        <div v-for="Bgame in boardGames" :key="Bgame.name">
          <p>{{ Bgame.name }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store";
import { collection, getDocs, db } from "../../firebase.js";

export default {
  name: "BoardGames",

  components: {},
  data() {
    return {
      store,
      show: false,
      boardGames: [
        {
          bgId: 1,
          bgImageUrl: "doc.data().bgImageUrl",
          bgName: "doc.data().bgName",
          categories: ["...doc.data().categories"],
          edition: " doc.data().edition",
          numberofPlayers: "doc.data().numberofPlayers",
          playTime: "doc.data().playTime",
        },
      ],
    };
  },
  //treba jos probat dodati novi u fb,updetati podatke u fb,dohvatiti jedan doc u fb, i ovu funkciju pogledat kako da bude map
  methods: {
    async getBoardgames() {
      //this.boardGames = [...store.storeData.boardgames];
      //use map to order data
      const querySnapshot = await getDocs(collection(db, "boardGames"));
      querySnapshot.forEach((doc) => {
        this.boardGames.push({
          bgId: doc.id,
          bgImageUrl: doc.data().bgImageUrl,
          bgName: doc.data().bgName,
          categories: [...doc.data().categories],
          edition: doc.data().edition,
          numberofPlayers: doc.data().numberofPlayers,
          playTime: doc.data().playTime,
        });
      });
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    },
  },
  mounted() {
    this.getBoardgames();
  },
};
</script>
