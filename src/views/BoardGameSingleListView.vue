<template>
  <div>
    <v-container fill-height fluid class="align-start">
      <v-col cols="12">
        <h1>
          <v-icon color="black" large>mdi mdi-playlist-edit</v-icon
          >{{ listInfo.name }}
        </h1>
        <v-divider class="mb-2"></v-divider>
        <h2>Descrition:</h2>
        <v-card color="teal">
          <h3 style="max-height: 150px; overflow-y: auto">
            {{ listInfo.description }}
          </h3>
        </v-card>
        <v-divider class="mb-7"></v-divider>
        <v-row>
          <v-card
            class="mx-auto mb-4"
            width="300"
            height="300"
            dark
            v-for="boardgame in listInfo.bgList"
            :key="boardgame.bgId"
          >
            <v-card-title align="center" justify="center">
              <v-btn
                color="teal lighten-3"
                icon
                @click="goToBoardGame(boardgame.bgId)"
              >
                <v-icon>mdi mdi-open-in-new</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                fab
                x-small
                color="red"
                @click="removeBoardGame(boardgame.bgId, RouteID)"
              >
                <v-icon>mdi mdi-close-thick</v-icon>
              </v-btn>
            </v-card-title>
            <v-img :src="boardgame.bgImage" height="180px"></v-img>
            <v-card-subtitle align="center" justify="center">
              <h2>{{ boardgame.bgName }}</h2>
            </v-card-subtitle>

            <v-divider></v-divider>
          </v-card>
        </v-row>
      </v-col>

      <!--ELEM dialog start-->
      <template>
        <v-row justify="center" class="my-2">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <!--toglle button-->
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="teal darken-3"
                dark
                v-bind="attrs"
                v-on="on"
                elevation="2"
                fab
                fixed
                bottom
                right
              >
                <v-icon x-large>mdi mdi-playlist-plus</v-icon>
              </v-btn>
            </template>
            <!---->
            <v-card dark>
              <v-card-title>
                <span class="text-h5">Add Board Game</span>
              </v-card-title>
              <v-card-text>
                <v-form v-model="formValid">
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-autocomplete
                          v-model="bgIdForm"
                          :items="dialogBgOptions"
                          label="Board game"
                          :rules="[rules.required]"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
                <small>izaberite Board Game koji želite dodati</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="closeDialogSingleList"
                >
                  Close
                </v-btn>
                <v-btn
                  :disabled="!formValid"
                  color="blue darken-1"
                  text
                  @click="addBoardGame(bgIdForm, RouteID)"
                >
                  Add
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
      <!--end-->
    </v-container>
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

export default {
  name: "BoardGameSingleList",
  components: {},
  data() {
    return {
      store,
      RouteID: this.$route.params.id,
      listInfo: {},
      //dialog
      dialog: false,
      dialogBgOptions: [],
      formValid: true,
      rules: {
        required: (value) => !!value || "Required.",
      },

      bgIdForm: null,
    };
  },
  methods: {
    async getList() {
      try {
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
      } catch (error) {
        console.log("getList error-> ", error);
      }
    },
    async getBoardGames(arrBgId) {
      try {
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
      } catch (error) {
        console.log("getBoardGames error-> ", error);
      }
    },

    async addBoardGame(BgId, listId) {
      try {
        const userRef = doc(db, "bgLists", listId);
        await updateDoc(userRef, {
          arrBoardGames: arrayUnion(BgId),
        });
      } catch (error) {
        console.log("addBoardGame error-> ", error);
      }
      this.closeDialogSingleList();
    },
    //!!!# remove bg update
    async removeBoardGame(BgId, listId) {
      try {
        const userRef = doc(db, "bgLists", listId);
        await updateDoc(userRef, {
          arrBoardGames: arrayRemove(BgId),
        });
      } catch (error) {
        console.log("removeBoardGame error-> ", error);
      }
    },
    async getAllBoardGames() {
      try {
        const querySnapshot = await getDocs(collection(db, "boardGames"));
        querySnapshot.forEach((doc) => {
          this.dialogBgOptions.push({
            text: doc.data().bgName,
            value: doc.id,
          });
        });
        /*querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });*/
      } catch (error) {
        console.log("u dohvatu Board Game error-> ", error);
      }
    },
    closeDialogSingleList() {
      this.dialog = false;
      this.bgIdForm = null;
    },
    goToBoardGame(boardGameId) {
      this.$router.push(`/board-games/${boardGameId}`);
    },
  },
  created() {
    onSnapshot(collection(db, "bgLists"), async (collection) => {
      console.log("ja snepshotam");
      this.listInfo = await this.getList();
    });
  },
  async mounted() {
    await this.getAllBoardGames();
  },
};
</script>
