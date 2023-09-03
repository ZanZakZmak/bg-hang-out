<template>
  <v-card class="mx-auto mb-4" max-width="500" dark>
    <v-img :src="session.bgInfo.bgImage" height="150px"></v-img>

    <v-card-title> {{ session.title }} </v-card-title>

    <v-card-subtitle align="center" justify="center">
      <v-chip>
        {{ session.bgInfo.bgName }}
      </v-chip>
      <v-btn
        color="teal lighten-3"
        icon
        @click="goToBoardGame(session.bgInfo.bgId)"
      >
        <v-icon>mdi mdi-open-in-new</v-icon>
      </v-btn>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>
          Date: <v-chip>{{ session.date }}</v-chip>
        </v-list-item-title>
        <v-list-item-title>
          Time: <v-chip> {{ session.time }} </v-chip></v-list-item-title
        >
        <v-list-item-title>
          Location: <v-chip> {{ session.location }} </v-chip>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-card-subtitle>Curently joined </v-card-subtitle>
    <v-card-subtitle class="pa-0 ma-1">
      <v-chip
        class="ma-2"
        color="teal darken-4"
        v-for="person in session.joinedPlayers"
        :key="person.guestId"
      >
        <v-avatar left>
          <v-icon>mdi-account-circle</v-icon>
        </v-avatar>
        {{ person.userName }}
      </v-chip>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-subtitle>Aditional notes</v-card-subtitle>
    <v-card color="grey darken-3" class="ma-2">
      <v-card-subtitle style="max-height: 100px; overflow-y: auto">
        {{ session.notes }}
      </v-card-subtitle>
    </v-card>

    <v-divider></v-divider>
    <v-card-subtitle>
      Comunication link :
      <v-chip color="teal"> {{ session.comunicationLink }} </v-chip>
    </v-card-subtitle>

    <v-divider></v-divider>

    <v-divider></v-divider>
    <v-spacer></v-spacer>
    <v-card-actions class="justify-end">
      <v-card-subtitle
        >By: {{ session.createdBy }} at {{ session.timeStamp }}</v-card-subtitle
      >
      <v-spacer></v-spacer>
      <v-btn
        color="teal darken-1"
        v-show="type == 'created'"
        @click="
          deleteSession(
            session.seshId,
            session.joinedPlayers,
            store.storeData.userInfo.userId
          )
        "
      >
        Delete
      </v-btn>
      <v-btn
        v-show="type == 'joined'"
        @click="leaveSession(session.seshId, store.storeData.userInfo.userId)"
      >
        Leave
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import store from "@/store.js";
import {
  doc,
  db,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "../../firebase.js";

export default {
  name: "ManageSessionsCard",
  props: ["session", "type"],

  data() {
    return {
      store,
    };
  },
  methods: {
    async deleteSession(seshId, arrParticipants, userId) {
      try {
        const userRef = doc(db, "users", userId);
        await deleteDoc(doc(db, "sessions", seshId));
        //remove all joined participants

        await arrParticipants.forEach(async (value) => {
          const participantRef = doc(db, "users", value.guestId);
          await updateDoc(participantRef, {
            joinedSessions: arrayRemove(seshId),
          });
        });

        //updetamo created u korisniku

        await updateDoc(userRef, {
          createdSessions: arrayRemove(seshId),
        });
      } catch (error) {
        console.log("deleteSession eror->", error);
      }
    },

    async leaveSession(sessionId, userId) {
      try {
        const seshRef = doc(db, "sessions", sessionId);
        const userRef = doc(db, "users", userId);

        //session list,show
        await updateDoc(seshRef, {
          players: arrayRemove(userId),
          showIfNotFull: true,
        });

        //user
        await updateDoc(userRef, {
          joinedSessions: arrayRemove(sessionId),
        });
      } catch (error) {
        console.log("leaveSession eror->", error);
      }
    },

    goToBoardGame(boardGameId) {
      this.$router.push(`/board-games/${boardGameId}`);
    },
  },
};
</script>
