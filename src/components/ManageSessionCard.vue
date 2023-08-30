<template>
  <v-card class="mx-auto mb-4" max-width="500" dark>
    <v-img :src="session.bgInfo.bgImage" height="150px"></v-img>

    <v-card-title> {{ session.title }} </v-card-title>

    <v-card-subtitle align="center" justify="center">
      {{ session.bgInfo.bgName }}
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>Date: {{ session.date }}</v-list-item-title>
        <v-list-item-title>Time: {{ session.time }}</v-list-item-title>
        <v-list-item-title>Location: {{ session.location }}</v-list-item-title>
        <v-divider inset></v-divider>
        <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
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

    <v-card-subtitle style="max-height: 100px; overflow-y: auto">
      {{ session.notes }}
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-subtitle>
      Comunication link :
      <v-chip color="teal"> {{ session.comunicationLink }} </v-chip>
    </v-card-subtitle>

    <v-container>
      <v-row> <v-col>helooo</v-col> </v-row>
    </v-container>
    <v-divider></v-divider>
    <!--<v-chip
              v-for="item in session.bgInfo.bgCategories"
              :key="item"
              class="ma-1"
            >
              {{ item }}
            </v-chip>-->

    <v-divider></v-divider>
    <v-spacer></v-spacer>
    <v-card-actions class="justify-end">
      <v-card-subtitle
        >created by: {{ session.createdBy }} at
        {{ session.timeStamp }}</v-card-subtitle
      >
      <v-spacer></v-spacer>
      <v-btn
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
  //created #end-session (kreator,igraći,title,date & time,bg-ime-slika-link?,location,contact-link,aditional-notes)
  //joined #leave (kreator,igraći,title,date & time,bg-ime-slika-link?,location,contact-link,aditional-notes, broj igraća željeni)

  data() {
    console.log("heloo u konzlu aaaaa :");
    return {
      store,
    };
  },
  methods: {
    //click Delete session (maknuti id sessije sa creator liste, maknuti id seessije sa svih korisnika koji su prikljućeni u sessiju)
    async deleteSession(seshId, arrParticipants, userId) {
      const userRef = doc(db, "users", userId);
      await deleteDoc(doc(db, "sessions", seshId));
      //remove all joined participants
      //for loop sa arrow fun koja ide kroz listu i upedata usere joined sesh
      await arrParticipants.forEach(async (value) => {
        const participantRef = doc(db, "users", value.guestId);
        await updateDoc(participantRef, {
          joinedSessions: arrayRemove(seshId),
        });
      });
      //remove creator
      //updetamo created u korisniku

      await updateDoc(userRef, {
        createdSessions: arrayRemove(seshId),
      });
    },
    //click Leave session (maknut ga iz liste ukljućenih u sesiju, podesiti value za show, maknut iz njegove liste na users session )
    async leaveSession(sessionId, userId) {
      console.log("tastamo ovu funkciju", sessionId, " and ", userId);
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
    },
  },
};
</script>
