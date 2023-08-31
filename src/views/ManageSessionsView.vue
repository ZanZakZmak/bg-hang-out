<template>
  <!--content start-->
  <v-container fill-height fluid>
    <v-row>
      <v-col cols="12">
        <h1>Created Sessions</h1>
        <v-divider class="mb-7"></v-divider>
        <v-row>
          <manage-session-card
            v-for="card in sessionCreated"
            :key="card.seshId"
            :session="card"
            type="created"
          />
        </v-row>
        <h1>Joined Sessions</h1>
        <v-divider class="mb-7"></v-divider>

        <v-row>
          <manage-session-card
            v-for="card in sessionJoined"
            :key="card.seshId"
            :session="card"
            type="joined"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <!--end-->
</template>

<script>
//dvije stvari trebaju bit sessioni koji je kreirao user i oni koje je joinao
//created #end-session (kreator,igraći,title,date & time,bg-ime-slika-link?,location,contact-link,aditional-notes)
//joined #leave (kreator,igraći,title,date & time,bg-ime-slika-link?,location,contact-link,aditional-notes, broj igraća željeni)
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
  deleteDoc,
} from "../../firebase.js";
import ManageSessionCard from "@/components/ManageSessionCard.vue";

export default {
  name: "ManageSessions",

  components: {
    ManageSessionCard,
  },
  data() {
    return {
      store,
      sessionCreated: [],
      sessionJoined: [],
      isCreatedSession: true,
      userid: null,
    };
  },

  watch: {
    "store.storeData.userInfo.userId": function () {
      console.log("store mi se promjenio ", store);
      this.getSessions(store.storeData.userInfo.userId);
      //ovo ce biti ovko za sada da idemo dalje raditi jer je problem ne mogu u lifecicleu dobiti vrjednosti iz store.js
    },
  },
  methods: {
    //get joined and created sessions
    async getSessions(userId) {
      if (userId != "") {
        console.log("da vidim mi ovdje", userId);
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.sessionJoined = [];
          let arraySesh = [...docSnap.data().joinedSessions];
          arraySesh.forEach(async (value) => {
            //console.log("da probamo vidjet ", await this.getSession(value));
            this.sessionJoined.push(await this.getSession(value));
          });
        }

        if (docSnap.exists()) {
          this.sessionCreated = [];
          let arraySesh = [...docSnap.data().createdSessions];
          arraySesh.forEach(async (value) => {
            this.sessionCreated.push(await this.getSession(value));
          });
        }
      } else {
        console.log("sacekaj store se nije refa");
      }
    },
    async getSession(seshId) {
      const docRef = doc(db, "sessions", seshId);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      return {
        seshId: seshId,
        title: docSnap.data().title,
        notes: docSnap.data().notes,
        comunicationLink: docSnap.data().ComunicationLink,
        seshId: docSnap.id,
        bgInfo: await this.getBoardGame(docSnap.data().bgID),
        wantedPlayers: docSnap.data().wantedPlayers,
        time: docSnap.data().Time,
        date: docSnap.data().Date,
        location: docSnap.data().location,
        createdBy: docSnap.data().createdBy,
        createdByID: docSnap.data().createdByID,
        timeStamp: docSnap.data().timeStamp,
        joinedPlayers: await this.getPlayers(docSnap.data().players),
        show: docSnap.data().showIfNotFull,
      };
    },
    //dohvat info o bg u sesiji
    async getBoardGame(boardID) {
      const docRef = doc(db, "boardGames", boardID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("Document bg data:", docSnap.data());
        return {
          bgName: docSnap.data().bgName,
          bgImage: docSnap.data().bgImageUrl,
          bgPlayTime: docSnap.data().playTime,
          bgCategories: [...docSnap.data().categories],
        };
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        //error funkciju napraviti
        return null;
      }
    },
    //dohvat info o igraćima u sesiji
    async getPlayers(arrPlayers) {
      const returnArrPlayers = [];
      arrPlayers.forEach(async (idPlayer) => {
        const docRef = doc(db, "users", idPlayer);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          //console.log("Document player data:", docSnap.data());
          returnArrPlayers.push({
            guestId: docSnap.id,
            userName: docSnap.data().userName,
          });
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      });
      return returnArrPlayers;
    },
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
  beforeCreate() {
    console.log("da vidimo sad ", this.isCreatedSession != undefined);
  },
  created() {
    onSnapshot(collection(db, "users"), async (collection) => {
      /*
      collection.forEach((snap) => {
        console.log("Current data: ", snap.data());
      });
      console.log("Current data testiranje ");
      //this.sessionsFilterd = this.sessions;
      */
      //console.log("da vidimo kako ovo stoji", store.storeData.userInfo.userId);

      await this.getSessions(store.storeData.userInfo.userId);
    });
  },
  async mounted() {
    //this.getSessions(store.storeData.userInfo.userId);
  },
};
</script>
