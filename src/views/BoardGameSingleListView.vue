<template>
  <div>
    <!--napraviti template kako treba info i onda probat cards novi samo sa slikom i imenom i button za delete -->
    <div>jedna lista {{ RouteID }}</div>
    <div>info {{ listInfo }}</div>
  </div>
</template>

<script>
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
} from "../../firebase.js";
//napravit listu moze se pokušat rješit problem od refresha kao i prije (nema vremena za alternativu)
//liste to --> listu terba napravit da se prosljedi id i tako loada nova stranica ruter pharams?? možda

//complex
//make it a subcollection #add new list ads to sub and -to user? (name, description, arrBoardGameId)
//make a list profile vue pass data via ruter pharams? # remove bg update array (add bg to list here or in board games )

//simple
//make a cuple predetirmened lists (owned, played) and fill them with bgIds no need for a sub collection
//no params two lists are displayed on page #remove bg from list
export default {
  name: "BoardGameSingleList",

  components: {},
  data() {
    return {
      store,
      RouteID: this.$route.params.id,
      listInfo: null,
    };
  },
  methods: {
    async getList() {
      const docRef = doc(db, "bgLists", this.RouteID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document bglist data:", docSnap.data());
        return {
          createdUserId: "ek2aEbcOEsWxUJC7pHX3Pd1kuCO2",
          name: docSnap.data().name,
          description: docSnap.data().description,
          bgList: await this.getBoardGames(docSnap.data().arrBoardGames),
        };
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        //error funkciju napraviti
        return null;
      }
    },
    async getBoardGames(arrBgId) {
      let arrBg = [];
      arrBgId.forEach(async (idBoardGame) => {
        const docRef = doc(db, "boardGames", idBoardGame);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          //console.log("Document player data:", docSnap.data());  edition  playTime categories numberofPlayers
          arrBg.push({
            bgId: docSnap.id,
            bgName: docSnap.data().bgName,
            bgImage: docSnap.data().bgImageUrl,
            bgEdition: docSnap.data().edition,
            bgPlayTime: docSnap.data().playTime,
            bgCategories: docSnap.data().categories,
            bgNumberofPlayers: docSnap.data().numberofPlayers,
          });
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
      });
      return arrBg;
    },
    //!!!# add board game
    //op1?- ovdje otvori se drugi pop up koji ima sve bg poput onih u autocmlete ele iz sessions
    //op2?-isti princip samo naopako na bg vueu
    addBoardGame(BgId, listId) {},
    //!!!# remove bg update array (add bg to list here or in board games )
    removeBoardGame(BgId, listId) {},
  },
  created() {
    //!!!dodati snap shot za aktualni upedate
  },
  async mounted() {
    console.log(this.RouteID);
    this.listInfo = await this.getList();
  },
};
</script>
