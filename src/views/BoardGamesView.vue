<template>
  <div>
    <!--dialog start-->
    <template>
      <v-row justify="center" class="my-2">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <!--toglle button-->
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ma-3"
              color="teal darken-3"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Add Board Game
            </v-btn>
          </template>
          <!---->
          <v-card dark>
            <v-card-title>
              <span class="text-h5">Add a New Board Game</span>
            </v-card-title>
            <v-card-text>
              <v-form v-model="formValid">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="bgNameForm"
                        label="Board game name*"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div>add image</div>
                      <croppa v-model="myCroppa"></croppa>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editionForm"
                        label="Board game edition*"
                        hint="example of helper text only on focus"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="minNumberofPlayersForm"
                        label=" minimal number of players*"
                        hint="etc. 1..."
                        type="number"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="maxNumberofPlayersForm"
                        label="maximum number of players*"
                        hint="etc. ...8"
                        type="number"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="playTimeForm"
                        label="duration of gameplay*"
                        type="number"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        v-model="categoriesForm"
                        :items="[
                          'co-op',
                          'team vs team',
                          'party',
                          'eurogame',
                          'wargame',
                          'abstract',
                          'deduction',
                          'campaign',
                          'deck builder',
                          'engine builder',
                          'dice rolling',
                          'card draft',
                          'worker placment',
                          'dexterity',
                          'resource management',
                          'dungeon crawler',
                          'area control',
                          'hidden role',
                        ]"
                        label="categories*"
                        multiple
                        :rules="[rules.required, rules.requiredArr]"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        label="Description"
                        v-model="desctiptionForm"
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
              <v-btn color="blue darken-1" text @click="closeDialogBG()">
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="addBoardGame()"
                :disabled="!formValid"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!--end-->
    <v-divider class="my-2"></v-divider>
    <!--content start-->
    <v-container fill-height fluid>
      <v-row>
        <v-col cols="12" sm="9" md="9" xs="12" align="center" justify="center">
          <v-row>
            <v-card
              class="mx-auto mb-4"
              max-width="270"
              dark
              v-for="Bgame in filterdBoardGames"
              :key="Bgame.bgId"
            >
              <v-img :src="Bgame.bgImageUrl" height="200px"></v-img>

              <v-card-title> {{ Bgame.bgName }} </v-card-title>

              <v-card-subtitle> Edition {{ Bgame.edition }} </v-card-subtitle>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >Number of players :{{
                      Bgame.numberofPlayers[0] + "-" + Bgame.numberofPlayers[1]
                    }}</v-list-item-title
                  >
                  <v-list-item-title
                    >Play time :{{ Bgame.playTime }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-chip v-for="item in Bgame.categories" :key="item" class="ma-1">
                {{ item }}
              </v-chip>
              <v-divider></v-divider>

              <v-card-actions class="justify-end">
                <v-btn
                  color="teal lighten-3"
                  icon
                  @click="goToBoardGame(Bgame.bgId)"
                >
                  <v-icon>mdi mdi-open-in-new</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="12" sm="3" md="3" xs="12" align="center" justify="center">
          <v-card dark height="auto" width="250" class="pa-3">
            <!--korak jedan primitivni interface za filtere-->
            <v-card-title>Filers</v-card-title>
            <v-divider></v-divider>

            <v-card-subtitle>Number of players</v-card-subtitle>

            <v-text-field
              v-model="filterPlayersNum"
              label="number of players"
              type="number"
            />
            <v-divider></v-divider>
            <v-card-subtitle>Duration of gameplay</v-card-subtitle>

            <v-select
              v-model="filterTime"
              :items="[30, 60, 120, 180, 240, 300, 600]"
              label="under selected min"
            ></v-select>
            <v-divider></v-divider>

            <v-card-subtitle>Categories</v-card-subtitle>
            <v-select
              v-model="filterCategories"
              :items="[
                'co-op',
                'team vs team',
                'party',
                'eurogame',
                'wargame',
                'abstract',
                'deduction',
                'campaign',
                'deck builder',
                'engine builder',
                'dice rolling',
                'card draft',
                'worker placment',
                'dexterity',
                'resource management',
                'dungeon crawler',
                'area control',
                'hidden role',
              ]"
              chips
              label="Select categories"
              multiple
              solo
            ></v-select>
            <v-card-actions>
              <v-btn color="red darken-1" @click="clearFilters()">
                clear
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="teal darken-1" @click="filterBoardGames()">
                filter
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
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
  db,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  storage,
  onSnapshot,
} from "../../firebase.js";

export default {
  name: "BoardGames",

  components: {},
  data() {
    return {
      store,

      //croppa stvari
      myCroppa: {},
      urlCroppa: null,
      //za toggle dialoga
      dialog: false,
      //form validity
      formValid: false,
      rules: {
        required: (value) => !!value || "Required.",
        requiredArr: (value) => value?.length >= 1 || "Required.",
        //isCroppa: (value)=>{},
      },
      // varijable forme za dodvananje novog bg

      bgNameForm: null,
      categoriesForm: null,
      editionForm: null,
      minNumberofPlayersForm: null,
      maxNumberofPlayersForm: null,
      playTimeForm: null,
      desctiptionForm: null,
      //filteri
      filterTime: null,
      filterPlayersNum: null,

      filterCategories: null,
      //proksi data
      boardGames: [],
      filterdBoardGames: [],
    };
  },
  //staviti debounce bilo prije putem loadlash plugina pogledat kako sad
  watch: {
    "store.searchTerm": function () {
      this.searchBoardGame();
      //pozvati filter
      this.filterBoardGames();
    },
    //"store.searchTerm": function(val) {this.fetchPosts(val)}
  },
  //treba jos probat dodati novi u fb,updetati podatke u fb,dohvatiti jedan doc u fb, i ovu funkciju pogledat kako da bude map
  methods: {
    async getBoardgames() {
      try {
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
      } catch (error) {
        console.log("get board games eror->", error);
      }
    },
    async addBoardGame() {
      // Add a new document with a generated id.
      try {
        const docRef = await addDoc(collection(db, "boardGames"), {
          bgImageUrl: await this.uploadCroppedImage(),
          bgName: this.bgNameForm,
          categories: [...this.categoriesForm],
          edition: this.editionForm,
          numberofPlayers: [
            this.minNumberofPlayersForm,
            this.maxNumberofPlayersForm,
          ],
          playTime: this.playTimeForm,
          desctiption: this.desctiptionForm,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.log("add board games eror->", error);
      }

      this.closeDialogBG();
    },
    searchBoardGame() {
      this.filterdBoardGames = this.boardGames.filter((element) => {
        return !(
          element.bgName
            .toLowerCase()
            .search(store.searchTerm.toLowerCase()) === -1
        );
      });
    },
    //!!!Del
    filterBoardGames() {
      this.searchBoardGame();
      //kada je filter postoji
      //!!!Del
      if (
        this.filterTime != null ||
        !(this.filterCategories == null || this.filterCategories.length == 0) ||
        (this.filterPlayersNum != null && this.filterPlayersNum != "")
      ) {
        this.filterdBoardGames = this.filterdBoardGames.filter((element) => {
          var returnVal = true;
          // test case za vrijeme
          if (this.filterTime != null) {
            if (element.playTime > this.filterTime) {
              returnVal = false;
            }
          }

          //novi test case za playere
          if (this.filterPlayersNum != null && this.filterPlayersNum != "") {
            if (
              element.numberofPlayers[0] <= this.filterPlayersNum &&
              element.numberofPlayers[1] >= this.filterPlayersNum
            ) {
            } else {
              returnVal = false;
            }
          }

          // test case za kategorije
          if (
            !(
              this.filterCategories == null || this.filterCategories.length == 0
            )
          ) {
            var isCategory = false;
            this.filterCategories.forEach((x) => {
              var isThisCategory = false;
              isThisCategory = element.categories.includes(x);
              if (isThisCategory) {
                isCategory = true;
              }
            });
            if (!isCategory) {
              returnVal = false;
            }
          }
          return returnVal;
        });
      }
    },
    closeDialogBG() {
      this.dialog = false;
      this.clearBgForm();
    },
    clearBgForm() {
      this.bgNameForm = null;
      this.categoriesForm = null;
      this.editionForm = null;
      this.minNumberofPlayersForm = null;
      this.maxNumberofPlayersForm = null;
      this.playTimeForm = null;
      this.desctiptionForm = null;
      this.myCroppa.remove();
    },
    clearFilters() {
      this.filterTime = null;

      this.filterCategories = null;
      this.searchBoardGame();
    },
    //croppa
    getImageBlob() {
      return new Promise((resolve, error) => {
        this.myCroppa.generateBlob((blob) => {
          resolve(blob);
        });
      });
    },
    async uploadCroppedImage() {
      try {
        let blobData = await this.getImageBlob();
        let imageName =
          "bgImages/" + store.storeData.userInfo.userName + Date.now() + ".png";
        //const storage = getStorage();
        const imagesRef = ref(storage, imageName);
        await uploadBytes(imagesRef, blobData).then((result) => {
          //console.log("Uploaded a blob or file!", result);
        });
        let imageUrl = await getDownloadURL(ref(storage, imageName));

        return imageUrl;
      } catch (error) {
        console.log("add board games eror->", error);
        return null;
      }
    },
    goToBoardGame(boardGameId) {
      this.$router.push(`/board-games/${boardGameId}`);
    },
  },
  created() {
    onSnapshot(collection(db, "boardGames"), async (collection) => {
      this.boardGames = [];
      await this.getBoardgames();
      this.searchBoardGame();
    });
  },
  mounted() {},
};
</script>
