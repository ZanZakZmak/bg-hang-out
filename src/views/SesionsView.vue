<template>
  <div>
    <!--ELEM dialog start-->
    <template>
      <v-row justify="center" class="my-2">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <!--toglle button-->
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="my-4"
              color="teal darken-3"
              dark
              v-bind="attrs"
              v-on="on"
            >
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
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        label="Title*"
                        v-model="titleForm"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        v-model="menu1"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="dateForm"
                            label="Picker without buttons*"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dateForm"
                          @input="menu1 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-menu
                        ref="menu"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="timeForm"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="timeForm"
                            label="Picker in menu*"
                            prepend-icon="mdi-clock-time-four-outline"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </template>
                        <v-time-picker
                          v-if="menu2"
                          v-model="timeForm"
                          format="24hr"
                          full-width
                          @click:minute="$refs.menu.save(timeForm)"
                        ></v-time-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label=" Number of players you want*"
                        v-model="numOfPlayersForm"
                        hint="etc. 1..."
                        type="number"
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Comunication link*"
                        v-model="ComunicationLinkForm"
                        hint=" skipe link, discord link..."
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        label="Aditional notes"
                        v-model="notesform"
                        hint="Hint text"
                      ></v-textarea>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        v-model="bgIdForm"
                        :items="dialogBgOptions"
                        label="Board game*"
                        :rules="[rules.required]"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        label="Location*"
                        v-model="locationForm"
                        hint=" Rijeka, Pula link..."
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialogSession()">
                Close
              </v-btn>
              <v-btn
                :disabled="!formValid"
                color="blue darken-1"
                text
                @click="addNewSession()"
              >
                Create
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
        <v-col cols="12" sm="9" md="9" xs="12">
          <!--ELEM session card-->
          <v-row>
            <v-card
              class="mx-auto mb-4"
              width="400"
              dark
              v-for="session in sessionsFilterd"
              :key="session.seshId"
              v-show="session.show"
            >
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
                    Time:
                    <v-chip> {{ session.time }} </v-chip></v-list-item-title
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
              <v-chip
                v-for="item in session.bgInfo.bgCategories"
                :key="item"
                class="ma-1"
              >
                {{ item }}
              </v-chip>

              <v-divider></v-divider>
              <v-spacer></v-spacer>
              <v-card-actions class="justify-end">
                <v-card-subtitle
                  >By {{ session.createdBy }}
                  {{ formatTimestamp(session.timeStamp) }}</v-card-subtitle
                >
                <v-spacer></v-spacer>
                <v-btn
                  color="teal darken-1"
                  @click="
                    joinSession(
                      session.seshId,
                      store.storeData.userInfo.userId,
                      session.createdByID,
                      session.wantedPlayers,
                      session.joinedPlayers
                    )
                  "
                  >Join</v-btn
                >
              </v-card-actions>
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
              -->
            </v-card>
          </v-row>
        </v-col>

        <v-col cols="12" sm="3" md="3" xs="12" align="center" justify="center">
          <!--ELEM Filter card za sessions-->
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

            <!--kategorije su interesantne napravit sa jednom ili više odabira-->
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
              <v-btn color="red darken-1" @click="clearFilters()"
                >clear filter</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn color="teal darken-1" @click="filterSessions()"
                >filter</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!--end-->
    <!--snacbar warning-->
    <template>
      <div class="text-center ma-2">
        <v-snackbar v-model="snackbar" timeout="3000" color="red">
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn
              color="black"
              text
              v-bind="attrs"
              @click="
                snackbar = false;
                text = '';
              "
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </template>
  </div>
</template>

<script>
// !!! popraviti svugdje di piše session u session promjeniti form za add  drugi put ne radi
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
  query,
  orderBy,
} from "../../firebase.js";

export default {
  name: "Sesions",

  components: {},
  data() {
    return {
      store,
      dialog: false,

      sessions: [],
      sessionsFilterd: [],
      dialogBgOptions: [],
      //form
      //u false
      formValid: true,
      isFormButtonDisabled: true,
      rules: {
        required: (value) => !!value || "Required.",
      },

      menu1: false,
      menu2: false,
      titleForm: null,
      dateForm: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      timeForm: null,
      notesform: null,
      bgIdForm: null,
      numOfPlayersForm: null,
      ComunicationLinkForm: null,
      locationForm: null,
      //filters
      filterPlayersNum: null,
      filterTime: null,
      filterCategories: null,
      // snackbar data
      snackbar: false,
      text: "",
    };
  },
  watch: {
    "store.searchTerm": function () {
      this.searchSession();

      //pozvati filter
      this.filterSessions();
    },
  },
  methods: {
    async getSessions() {
      try {
        const q = query(
          collection(db, "sessions"),
          orderBy("timeStamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        this.sessions = [];
        querySnapshot.forEach(async (doc) => {
          this.sessions.push({
            seshId: doc.id,
            title: doc.data().title,
            notes: doc.data().notes,
            bgInfo: await this.getBoardGame(doc.data().bgID),
            wantedPlayers: doc.data().wantedPlayers,
            time: doc.data().Time,
            date: doc.data().Date,
            location: doc.data().location,
            createdBy: doc.data().createdBy,
            createdByID: doc.data().createdByID,
            timeStamp: doc.data().timeStamp,
            joinedPlayers: await this.getPlayers(doc.data().players),
            show: doc.data().showIfNotFull,
          });
        });
      } catch (error) {
        console.log("getSessions eror->", error);
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
            numberofPlayers: docSnap.data().numberofPlayers,
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
      } catch (error) {
        console.log("getPlayers eror->", error);
      }
    },
    //kreiranje nove sesije dialog i polja uz selectore
    async getAllBoardGames() {
      try {
        const querySnapshot = await getDocs(collection(db, "boardGames"));
        querySnapshot.forEach((doc) => {
          this.dialogBgOptions.push({
            text: doc.data().bgName,
            value: doc.id,
          });
        });
      } catch (error) {
        console.log("dohvat kategorija za dialog eror->", error);
      }
    },
    formatTimestamp(timestamp) {
      //.fromNow()
      return moment(timestamp).fromNow();
    },
    async addNewSession() {
      try {
        const userRef = doc(db, "users", store.storeData.userInfo.userId);
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "sessions"), {
          createdBy: store.storeData.userInfo.userName,
          createdByID: store.storeData.userInfo.userId,
          showIfNotFull: true,
          location: this.locationForm,
          title: this.titleForm,
          Date: this.dateForm,
          Time: this.timeForm,
          timeStamp: Date.now(),
          notes: this.notesform,
          bgID: this.bgIdForm,
          wantedPlayers: this.numOfPlayersForm,
          ComunicationLink: this.ComunicationLinkForm,
          players: [],
        });

        await updateDoc(userRef, {
          createdSessions: arrayUnion(docRef.id),
        });

        console.log("Document written with ID: ", docRef.id);
        this.closeDialogSession();
      } catch (error) {
        console.log("getPlayers eror->", error);
      }
    },
    closeDialogSession() {
      this.dialog = false;
      this.clearSessionForm();
    },

    clearSessionForm() {
      this.titleForm = null;
      this.dateForm = new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10);
      this.timeForm = null;
      this.notesform = null;
      this.bgIdForm = null;
      this.numOfPlayersForm = null;
      this.ComunicationLinkForm = null;
      this.locationForm = null;
    },
    //dodavanjje igraća u sesiju
    async joinSession(sessionId, userID, createdBy, maxPlay, joined) {
      if (
        joined.find((participant) => {
          return participant.guestId == userID;
        }) == undefined &&
        userID != createdBy
      ) {
        try {
          const docRef = doc(db, "sessions", sessionId);
          const userRef = doc(db, "users", userID);
          // jos treba dodat funkciju u user liste na useru .
          var temp = true;
          if (maxPlay <= joined.length + 1) {
            temp = false;
          }

          await updateDoc(docRef, {
            players: arrayUnion(userID),
            showIfNotFull: temp,
          });
          await updateDoc(userRef, {
            joinedSessions: arrayUnion(sessionId),
          });
        } catch (error) {
          console.log("joinSession eror->", error);
        }
      } else {
        this.text = "You are already in this session";
        this.snackbar = true;
      }
    },

    //filtriranje kartica
    filterSessions() {
      this.searchSession();
      //kada je filter postoji
      if (
        this.filterTime != null ||
        !(this.filterCategories == null || this.filterCategories.length == 0) ||
        (this.filterPlayersNum != null && this.filterPlayersNum != "")
      ) {
        this.sessionsFilterd = this.sessionsFilterd.filter((element) => {
          var returnVal = true;
          //filter za date
          // test case za vrijeme
          if (this.filterTime != null) {
            if (element.bgInfo.bgPlayTime > this.filterTime) {
              returnVal = false;
            }
          }

          //novi test case za playere
          if (this.filterPlayersNum != null && this.filterPlayersNum != "") {
            if (
              element.bgInfo.numberofPlayers[0] <= this.filterPlayersNum &&
              element.bgInfo.numberofPlayers[1] >= this.filterPlayersNum
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
              isThisCategory = element.bgInfo.bgCategories.includes(x);
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
    //ciscenje filtera
    clearFilters() {
      this.filterTime = null;
      this.filterPlayersNum = null;
      this.filterCategories = null;
      this.searchSession();
    },

    //searchanje kartica
    searchSession() {
      this.sessionsFilterd = this.sessions.filter((element) => {
        return (
          !(
            element.bgInfo.bgName
              .toLowerCase()
              .search(store.searchTerm.toLowerCase()) === -1
          ) ||
          !(
            element.title
              .toLowerCase()
              .search(store.searchTerm.toLowerCase()) === -1
          ) ||
          !(
            element.createdBy
              .toLowerCase()
              .search(store.searchTerm.toLowerCase()) === -1
          ) ||
          !(
            element.location
              .toLowerCase()
              .search(store.searchTerm.toLowerCase()) === -1
          )
        );
      });
    },

    goToBoardGame(boardGameId) {
      this.$router.push(`/board-games/${boardGameId}`);
    },
  },
  created() {
    onSnapshot(collection(db, "sessions"), (collection) => {
      this.getSessions().then(() => {
        this.sessionsFilterd = this.sessions;
      });
    });
  },
  async mounted() {
    this.getAllBoardGames();
  },
};
</script>
