<template>
  <div>
    <!--ELEM dialog start-->
    <template>
      <v-row justify="center" class="my-4">
        <v-dialog v-model="dialog" persistent max-width="500px">
          <!--toglle button-->
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="teal darken-3" dark v-bind="attrs" v-on="on">
              Add Session
            </v-btn>
          </template>
          <!---->
          <v-card dark>
            <v-card-title>
              <span class="text-h5">Create New Session</span>
            </v-card-title>
            <v-card-text>
              <v-form v-model="formValid">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        label="Title*"
                        v-model="nameForm"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        label="Aditional notes"
                        v-model="descriptionForm"
                        hint="Hint text"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialogList">
                Close
              </v-btn>
              <v-btn
                :disabled="!formValid"
                color="blue darken-1"
                text
                @click="addList(store.storeData.userInfo.userId)"
              >
                Create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!--end-->

    <!--content start-->
    <v-container fill-height fluid class="align-start">
      <v-col cols="12">
        <h1>MY Lists</h1>
        <v-divider class="mb-7"></v-divider>
        <v-row>
          <!--cange to bgLists and bgListId-->
          <v-card
            class="mx-auto mb-4"
            width="300"
            dark
            v-for="list in bgLists"
            :key="list.bgListId"
          >
            <!--<v-img :src="list.bgInfo.bgImage" height="150px"></v-img>-->

            <v-card-title align="center" justify="center">
              heloo {{ list.name }}
              <v-spacer></v-spacer>
              <v-btn
                fab
                x-small
                color="red"
                @click="
                  deleteList(list.bgListId, store.storeData.userInfo.userId)
                "
              >
                <v-icon>mdi mdi-close-thick</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-subtitle align="center" justify="center">
              heloo {{ list.name }}
            </v-card-subtitle>

            <v-divider></v-divider>

            <v-divider></v-divider>
            <v-card-subtitle>Curently joined </v-card-subtitle>
            <v-card-subtitle class="pa-0 ma-1">
              <!--<v-chip
              class="ma-2"
              color="teal darken-4"
              v-for="person in list.joinedPlayers"
              :key="person.guestId"
            >
              <v-avatar left>
                <v-icon>mdi-account-circle</v-icon>
              </v-avatar>
              {{ person.userName }}
            </v-chip>-->
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-card-subtitle align="center" justify="center"
              >Description</v-card-subtitle
            >

            <v-card-subtitle style="max-height: 100px; overflow-y: auto">
              {{ list.description }}
            </v-card-subtitle>
            <v-divider></v-divider>

            <v-divider></v-divider>
            <v-spacer></v-spacer>
            <v-card-actions class="justify-end">
              <v-spacer></v-spacer>
              <v-btn> Delete </v-btn>
              <v-btn fab color="teal" large @click="goToList(list.bgListId)">
                <v-icon large> mdi mdi-playlist-edit </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-col>
    </v-container>
    <!--end-->
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
  deleteDoc,
  onSnapshot,
} from "../../firebase.js";
export default {
  name: "BoardGameLists",

  components: {},
  data() {
    return {
      store,
      bgLists: [],

      //dialog add list form
      dialog: false,
      formValid: true,
      rules: {
        required: (value) => !!value || "Required.",
      },
      nameForm: null,
      descriptionForm: null,
    };
  },
  //mozda se moze rjesiti sa computed
  watch: {
    "store.storeData.userInfo.userId": function () {
      console.log("store mi se promjenio ", store);
      this.getLists(store.storeData.userInfo.userId);
      //ovo ce biti ovko za sada da idemo dalje raditi jer je problem ne mogu u lifecicleu dobiti vrjednosti iz store.js
    },
  },
  methods: {
    //dobijem podatke arr id i za svakog zovem get list i spremam u arr u data
    async getLists(userId) {
      if (userId != "") {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          //console.log("Document bglist data:", docSnap.data());
          this.bgLists = [];
          //foreach na listi
          docSnap.data().bgLists.forEach(async (listId) => {
            this.bgLists.push(await this.getSingleList(listId));
          });
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
          //error funkciju napraviti
          return null;
        }
      } else {
        console.log("sacekaj store se nije refa");
      }
    },
    async getSingleList(listId) {
      const docRef = doc(db, "bgLists", listId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("Document bglist data:", docSnap.data());
        return {
          bgListId: listId,
          name: docSnap.data().name,
          description: docSnap.data().description,
          //bgList: await this.getBoardGames(docSnap.data().arrBoardGames),
        };
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        //error funkciju napraviti
        return null;
      }
    },
    //#add new list ads to lists and -to userlist update? (name, description, arrBoardGameId)
    async addList(userId) {
      const userRef = doc(db, "users", store.storeData.userInfo.userId);
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "bgLists"), {
        createdUserId: store.storeData.userInfo.userId,
        name: this.nameForm,
        description: this.descriptionForm,
        arrBoardGames: [],
      });

      await updateDoc(userRef, {
        bgLists: arrayUnion(docRef.id),
      });

      console.log("Document written with ID: ", docRef.id);

      this.closeDialogList();
    },
    // delete from list colection and remove from users lists idlist idusera
    async deleteList(listId, userId) {
      const userRef = doc(db, "users", userId);
      await deleteDoc(doc(db, "bgLists", listId));

      await updateDoc(userRef, {
        bgLists: arrayRemove(listId),
      });
    },

    goToList(listId) {
      this.$router.push(`/board-game-lists/${listId}`);
    },
    closeDialogList() {
      this.dialog = false;
      this.nameForm = null;
      this.descriptionForm = null;
      this.formValid = true;
    },
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
      console.log("ja snepshotam");
      await this.getLists(store.storeData.userInfo.userId);
    });
  },
  async mounted() {
    //await this.getLists(store.storeData.userInfo.userId);
  },
};
</script>
