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
import moment from "moment";
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
      //del!!!
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
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            this.sessionJoined = [];
            let arraySesh = [...docSnap.data().joinedSessions];
            arraySesh.forEach(async (value) => {
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
        } catch (error) {
          console.log("getSessions eror->", error);
        }
      } else {
        console.log("sacekaj store se nije refa");
      }
    },
    async getSession(seshId) {
      try {
        const docRef = doc(db, "sessions", seshId);
        const docSnap = await getDoc(docRef);
        return {
          seshId: seshId,
          title: docSnap.data().title,
          notes: docSnap.data().notes,
          comunicationLink: docSnap.data().ComunicationLink,
          //seshId: docSnap.id,
          bgInfo: await this.getBoardGame(docSnap.data().bgID),
          wantedPlayers: docSnap.data().wantedPlayers,
          time: docSnap.data().Time,
          date: docSnap.data().Date,
          location: docSnap.data().location,
          createdBy: docSnap.data().createdBy,
          createdByID: docSnap.data().createdByID,
          timeStamp: moment(docSnap.data().timeStamp).fromNow(), //.fromNow() moment(timestamp)
          joinedPlayers: await this.getPlayers(docSnap.data().players),
          show: docSnap.data().showIfNotFull,
        };
      } catch (error) {
        console.log("getSession eror->", error);
      }
    },
    //dohvat info o bg u sesiji
    async getBoardGame(boardID) {
      try {
        const docRef = doc(db, "boardGames", boardID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return {
            bgId: docSnap.id,
            bgName: docSnap.data().bgName,
            bgImage: docSnap.data().bgImageUrl,
            bgPlayTime: docSnap.data().playTime,
            bgCategories: [...docSnap.data().categories],
          };
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");

          return null;
        }
      } catch (error) {
        console.log("getBoardGame->", error);
      }
    },
    //dohvat info o igraćima u sesiji
    async getPlayers(arrPlayers) {
      try {
        const returnArrPlayers = [];
        arrPlayers.forEach(async (idPlayer) => {
          const docRef = doc(db, "users", idPlayer);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
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
      } catch (error) {
        console.log("getPlayers->", error);
      }
    },
  },
  beforeCreate() {
    console.log("da vidimo sad ", this.isCreatedSession != undefined);
  },
  created() {
    onSnapshot(collection(db, "users"), async (collection) => {
      await this.getSessions(store.storeData.userInfo.userId);
    });
  },
  async mounted() {},
};
</script>
