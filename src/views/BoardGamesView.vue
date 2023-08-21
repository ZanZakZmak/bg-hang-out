<template>
  <v-container fill-height fluid>
    <!--dialog start-->
    <template>
      <v-row justify="center" class="my-2">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <!--toglle button-->
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="teal darken-3" dark v-bind="attrs" v-on="on">
              Add Board Game
            </v-btn>
          </template>
          <!---->
          <v-card dark>
            <v-card-title>
              <span class="text-h5">Add a New Board Game</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="bgNameForm"
                      label="Board game name*"
                      required
                    ></v-text-field>
                    <!--
                                bgImageUrl:
                                bgName:
                                categories:
                                edition: 
                                numberofPlayers: 
                                playTime:-->
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editionForm"
                      label="Board game edition"
                      hint="example of helper text only on focus"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="bgImageUrlForm"
                      label="paste an img url here*"
                      hint="example of persistent helper text"
                      persistent-hint
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="minNumberofPlayersForm"
                      label=" minimal number of players*"
                      hint="etc. 1..."
                      type="number"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="maxNumberofPlayersForm"
                      label="maximum number of players*"
                      hint="etc. ...8"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="playTimeForm"
                      label="duration of gameplay"
                      type="number"
                      required
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
                      label="Interests"
                      multiple
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialogBG()">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="addBoardGame()">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!--end-->
    <!--content start-->
    <v-container fill-height fluid>
      <v-row>
        <v-col cols="9" align="center" justify="center">
          <v-row>
            <v-card
              class="mx-auto mb-4"
              max-width="270"
              dark
              v-for="Bgame in filterdBoardGames"
              :key="Bgame.bgId"
            >
              <v-img :src="Bgame.bgImageUrl" height="150px"></v-img>

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
                  <v-divider inset></v-divider>
                  <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-chip v-for="item in Bgame.categories" :key="item" class="ma-1">
                {{ item }}
              </v-chip>
              <v-divider></v-divider>
              <!--
              <v-card-actions>
                <v-btn color="orange lighten-2" text> Explore </v-btn>

                <v-spacer></v-spacer>

                <v-btn icon @click="Bgame.show = !Bgame.show">
                  <v-icon>{{
                    Bgame.show ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon>
                </v-btn>
              </v-card-actions>
                -->
              <v-expand-transition>
                <div v-show="Bgame.show">
                  <v-divider></v-divider>

                  <v-card-text>
                    I'm a thing. But, like most politicians, he promised more
                    than he could deliver. You won't have time for sleeping,
                    soldier, not with all the bed making you'll be doing. Then
                    we'll go with that data file! Hey, you add a one and two
                    zeros to that or we walk! You're going to do his laundry?
                    I've got to find a way to escape.
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-row>
        </v-col>
        <v-col cols="3" align="center" justify="center">
          <v-card dark height="auto" width="250" class="pa-3">
            <!--korak jedan primitivni interface za filtere-->
            <v-card-title>Filers</v-card-title>
            <v-divider></v-divider>
            <!--za ovo ce trebat promjeniti format iz stringa u arr sa dva clana numericka-->
            <v-card-subtitle>Number of players</v-card-subtitle>
            <!--vrjeme je broj naj lakše vidjet dali upisuje ili ima opcije ponuđene-->
            <v-text-field
              v-model="filterPlayersMin"
              label="Min number of players"
              type="number"
            />
            <v-text-field
              v-model="filterPlayersMax"
              label="Max number of players"
              type="number"
            />
            <v-divider></v-divider>
            <v-card-subtitle>Duration of gameplay</v-card-subtitle>

            <!--kategorije su interesantne napravit sa jednom ili više odabira-->
            <v-select
              v-model="filterTime"
              :items="[30, 60, 120, 180, 240]"
              label="under ect. min"
            ></v-select>
            <v-divider></v-divider>

            <v-card-subtitle>Categories</v-card-subtitle>
            <v-select
              v-model="filterCategories"
              :items="[
                'area control',
                'wargame',
                'asimetric strategy',
                'worker placment',
                'co-op game',
              ]"
              chips
              label="Select categories"
              multiple
              solo
            ></v-select>
            <v-card-actions>
              <v-btn @click="filterBoardGames()">filter</v-btn>
              <v-btn @click="clearFilters()">clear filter</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!--end-->
  </v-container>
</template>

<script>
import store from "@/store";
import { collection, getDocs, addDoc, db } from "../../firebase.js";

export default {
  name: "BoardGames",

  components: {},
  data() {
    return {
      store,
      //maknut ako ne koristimo explore btn
      show: false,
      //za toggle dialoga
      dialog: false,
      // varijable forme za dodvananje novog bg
      bgImageUrlForm: null,
      bgNameForm: null,
      categoriesForm: null,
      editionForm: null,
      minNumberofPlayersForm: null,
      maxNumberofPlayersForm: null,
      playTimeForm: null,
      //filteri
      filterTime: null,
      filterPlayersMin: null,
      filterPlayersMax: null,
      filterCategories: null,
      //proksi data
      boardGames: [
        {
          bgId: 1,
          bgImageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbm7WgTB627ts3forXSbbJQnUB91qky4pQ7g&usqp=CAU",
          bgName: "root",
          categories: ["area control", "wargame", "asimetric strategy"],
          edition: " 3nd",
          numberofPlayers: [2, 4],
          playTime: "120",
          show: false,
        },
        {
          bgId: 2,
          bgImageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbm7WgTB627ts3forXSbbJQnUB91qky4pQ7g&usqp=CAU",
          bgName: "tokaido",
          categories: ["worker placment"],
          edition: " 4nd",
          numberofPlayers: [2, 5],
          playTime: "30",
          show: false,
        },
      ],
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
          show: false,
        });
      });
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    },
    async addBoardGame() {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "boardGames"), {
        bgImageUrl: this.bgImageUrlForm,
        bgName: this.bgNameForm,
        categories: [...this.categoriesForm],
        edition: this.editionForm,
        numberofPlayers: [
          this.minNumberofPlayersForm,
          this.maxNumberofPlayersForm,
        ],
        playTime: this.playTimeForm,
      });
      console.log("Document written with ID: ", docRef.id);
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
    filterBoardGames() {
      this.searchBoardGame();
      //kada je filter postoji
      if (
        this.filterTime != null ||
        !(this.filterCategories == null || this.filterCategories.length == 0) ||
        (this.filterPlayersMin != null && this.filterPlayersMin != "") ||
        (this.filterPlayersMax != null && this.filterPlayersMax != "")
      ) {
        this.filterdBoardGames = this.filterdBoardGames.filter((element) => {
          var returnVal = true;
          // test case za vrijeme
          if (this.filterTime != null) {
            if (element.playTime > this.filterTime) {
              returnVal = false;
            }
          }
          // test case za playere

          if (this.filterPlayersMin != null || this.filterPlayersMax != null) {
            var isNumOfPlayermin = true;
            var isNumOfPlayermax = true;

            //min has to be
            if (
              element.numberofPlayers[0] < this.filterPlayersMin &&
              this.filterPlayersMin != null &&
              this.filterPlayersMin != ""
            ) {
              isNumOfPlayermin = false;
            }
            //max has to be
            if (
              element.numberofPlayers[1] > this.filterPlayersMax &&
              this.filterPlayersMax != null &&
              this.filterPlayersMax != ""
            ) {
              isNumOfPlayermax = false;
            }
            if (!(isNumOfPlayermin && isNumOfPlayermax)) {
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
      this.bgImageUrlForm = null;
      this.bgNameForm = null;
      this.categoriesForm = null;
      this.editionForm = null;
      this.minNumberofPlayersForm = null;
      this.maxNumberofPlayersForm = null;
      this.playTimeForm = null;
    },
    clearFilters() {
      this.filterTime = null;
      this.filterPlayersMin = null;
      this.filterPlayersMax = null;
      this.filterCategories = null;
      this.searchBoardGame();
    },
  },
  mounted() {
    this.getBoardgames().then(() => {
      // zamjenit samo sa direktnim unosom unutra mozda dodati automatski kao u sessions
      this.searchBoardGame();
    });
  },
};
</script>
