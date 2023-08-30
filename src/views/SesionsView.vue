<template>
  <v-container fill-height fluid>
    <!--ELEM dialog start-->
    <template>
      <v-row justify="center" class="my-2">
        <v-dialog v-model="dialog" persistent max-width="600px">
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
                    <!--
                    title
                    bg id
                    date
                    time
                    num of players he wants
                    description-- notes?
                    comunication link
                    ---meta
                    user info ID
                    timestamp?
                  -->
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
                            label="Picker without buttons"
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
                            label="Picker in menu"
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
                        label="Board game"
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
                :disabled="isFormButtonDisabled"
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

    <!--content start-->
    <v-container fill-height fluid>
      <v-row>
        <v-col cols="9">
          <!--width="auto" full width za uredit kartice na kraju-->
          <!--ELEM session card-->
          <v-card
            class="mx-auto mb-4"
            max-width="400"
            dark
            v-for="session in sessionsFilterd"
            :key="session.seshId"
            v-show="session.show"
          >
            <v-img :src="session.bgInfo.bgImage" height="150px"></v-img>

            <v-card-title> {{ session.title }} </v-card-title>

            <v-card-subtitle align="center" justify="center">
              Board Game {{ session.bgInfo.bgName }}
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Date: {{ session.date }}</v-list-item-title>
                <v-list-item-title>Time: {{ session.time }}</v-list-item-title>
                <v-list-item-title
                  >Location: {{ session.location }}</v-list-item-title
                >
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
            <v-container>
              <v-row> <v-col>helooo</v-col> </v-row>
            </v-container>
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
                >created by: {{ session.createdBy }} at
                {{ session.timeStamp }}</v-card-subtitle
              >
              <v-spacer></v-spacer>
              <v-btn
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
        </v-col>

        <v-col cols="3" align="center" justify="center">
          <!--ELEM Filter card za sessions-->
          <v-card dark height="auto" width="250" class="pa-3">
            <!--korak jedan primitivni interface za filtere-->
            <v-card-title>Filers</v-card-title>
            <v-divider></v-divider>

            <v-menu
              v-model="menu3"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              left
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="picker"
                  label="Picker without buttons"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="picker"
                @input="menu3 = false"
              ></v-date-picker>
            </v-menu>

            <!--za ovo ce trebat promjeniti format iz stringa u arr sa dva clana numericka-->
            <v-card-subtitle>Number of players</v-card-subtitle>
            <!--vrjeme je broj naj lakše vidjet dali upisuje ili ima opcije ponuđene-->
            <v-text-field label="Min number of players" type="number" />
            <v-text-field label="Max number of players" type="number" />
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
              <v-btn @click="filterSessions()">filter</v-btn>
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
// !!! popraviti svugdje di piše session u session promjeniti form za add  drugi put ne radi
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
  name: "Sesions",

  components: {},
  data() {
    return {
      store,
      dialog: false,
      filterdBoardGames: [1, 2, 3],
      sessions: [
        {
          seshId: "124355",
          title: "Dodite Zaigrat Nesto Strasno",
          bgInfo: {
            bgName: "Arkam Horror",
            bgPlayTime: "50",
            bgImage:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbm7WgTB627ts3forXSbbJQnUB91qky4pQ7g&usqp=CAU",
            bgCategories: ["area control", "wargame", "asimetric strategy"],
          },
          wantedPlayers: 4,
          time: "20:30-23:30",
          date: "03.05.2023",
          location: "Pula",
          createdBy: "meeeee",
          timeStamp: "20:30-23:30 -03.05.2023",
          joinedPlayers: [
            {
              guestId: "1",
              userName: "markic",
            },
            {
              guestId: "2",
              userName: "sebastijankojejakiii",
            },
          ],
        },
        {
          seshId: "124356",
          title: "Dodite Zaigrat Nesto Strasno",
          bgInfo: {
            bgName: "Arkam Horror",
            bgPlayTime: "110",
            bgImage:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbm7WgTB627ts3forXSbbJQnUB91qky4pQ7g&usqp=CAU",
            bgCategories: ["area control", "wargame", "asimetric strategy"],
          },
          wantedPlayers: 4,
          time: "20:30-23:30",
          date: "03.05.2023",
          location: "Pula",
          createdBy: "meeeee",
          timeStamp: "20:30-23:30 -03.05.2023",
        },
      ],
      sessionsFilterd: [],
      dialogBgOptions: [],
      //form
      formValid: true,
      isFormButtonDisabled: true,
      rules: {
        required: (value) => !!value || "Required.",
      },
      //nead to actualy make it a form and have validation
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
      //date
      filterDate: null,
      //duration
      filterTime: null,
      //by categories
      filterCategories: null,
      //vuetify
      menu3: false,
      picker: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
    };
  },
  watch: {
    "store.searchTerm": function () {
      this.searchSession();

      //pozvati filter
      //this.filterBoardGames();
    },
    formValid: function (isValid) {
      this.isFormButtonDisabled = !isValid;
    },
    picker: function () {
      console.log(typeof this.picker);
    },
  },
  methods: {
    //dohvat sesija sa baze
    async getSessions() {
      const querySnapshot = await getDocs(collection(db, "sessions"));
      this.sessions = [];
      querySnapshot.forEach(async (doc) => {
        this.sessions.push({
          seshId: doc.id,
          title: doc.data().title,
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
      /*
      await onSnapshot(collection(db, "sessions"), (snap) => {
        snap.forEach(async (doc) => {
          this.sessions.push({
            seshId: doc.id,
            title: doc.data().title,
            bgInfo: await this.getBoardGame(doc.data().bgID),
            wantedPlayers: doc.data().wantedPlayers,
            time: doc.data().timeDate,
            date: "mene brisemo poslje",
            location: doc.data().location,
            createdBy: doc.data().createdBy,
            createdByID: doc.data().createdByID,
            timeStamp: doc.data().timeStamp,
            joinedPlayers: await this.getPlayers(doc.data().players),
            show: false,
          });
        });
      });
      */
      console.log("ja sam prvi");
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
    //kreiranje nove sesije dialog i polja uz selectore
    async getAllBoardGames() {
      //this.boardGames = [...store.storeData.boardgames];
      //use map to order data
      const querySnapshot = await getDocs(collection(db, "boardGames"));
      querySnapshot.forEach((doc) => {
        this.dialogBgOptions.push({
          text: doc.data().bgName,
          value: doc.id,
        });
      });
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    },
    async addNewSession() {
      const userRef = doc(db, "users", store.storeData.userInfo.userId);
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "sessions"), {
        createdBy: store.storeData.userInfo.userName,
        createdByID: store.storeData.userInfo.userId,
        //pogledat mozda zamjenit
        isDisplay: true,
        //sa ovime show
        showIfNotFull: true,
        location: this.locationForm,
        title: this.titleForm,
        Date: this.dateForm,
        Time: this.timeForm,
        timeStamp: this.timeForm,
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
    },
    closeDialogSession() {
      this.dialog = false;
      this.clearSessionForm();
    },
    //čišćenje forme jednostavno stavljanje vrijednosti na null
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
      this.formValid = true;
      this.isFormButtonDisabled = true;
    },
    //dodavanjje igraća u sesiju
    async joinSession(sessionId, userID, createdBy, maxPlay, joined) {
      if (
        joined.find((participant) => {
          return participant.guestId == userID;
        }) == undefined &&
        userID != createdBy
      ) {
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
      } else {
        //zamjenit sa nekom vrstom alerta
        console.log("već si u ovoj sesiji");
      }
    },

    //filtriranje kartica kopirat iz bg samo parametre odabrat(lokacija ,duljina trajanja u min dodat iz boardgame, kategorije)
    filterSessions() {
      this.searchSession();
      //kada je filter postoji
      if (
        this.filterTime != null ||
        !(this.filterCategories == null || this.filterCategories.length == 0)
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
    //ciscenje filtera filter  na null
    clearFilters() {
      this.filterTime = null;
      this.filterDate = null;
      this.filterCategories = null;
      this.searchSession();
    },
    //potencijalno sort

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
          )
        );
      });
    },
  },
  created() {
    onSnapshot(collection(db, "sessions"), (collection) => {
      /*
      collection.forEach((snap) => {
        console.log("Current data: ", snap.data());
      });
      console.log("Current data testiranje ");
      //this.sessionsFilterd = this.sessions;
      */
      this.getSessions().then(() => {
        //popraviti ovo je samo referenca inace ne zeli radit sa promise
        this.sessionsFilterd = this.sessions;
      });
    });
  },
  async mounted() {
    /*this.getSessions().then(() => {
      //popraviti ovo je samo referenca inace ne zeli radit sa promise
      this.sessionsFilterd = this.sessions;
    });*/
    this.getAllBoardGames();
  },
};
</script>
