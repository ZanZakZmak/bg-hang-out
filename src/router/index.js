import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "@/store.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "home-view",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about-view",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/register",
    name: "register-view",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/RegisterView.vue"),
    meta: {
      noUser: true,
    },
  },
  {
    path: "/login",
    name: "login-view",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LogInView.vue"),
    meta: {
      noUser: true,
    },
  },
  {
    path: "/sesions",
    name: "sesions-view",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SesionsView.vue"),

    meta: {
      needsUser: true,
    },
  },
  {
    path: "/manage-sessions",
    name: "manage-sessions-view",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ManageSessionsView.vue"),
    meta: {
      needsUser: true,
    },
  },
  {
    path: "/",
    name: "landingpage-view",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LandingPageView.vue"),
    meta: {
      needsUser: false,
      noUser: false,
    },
  },
  {
    path: "/board-games",
    name: "board-games-view",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/BoardGamesView.vue"),
    meta: {
      needsUser: true,
    },
  },
  {
    path: "/board-game-lists",
    name: "board-game-lists-view",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/BoardGameListsView.vue"),
    meta: {
      needsUser: true,
    },
  },
  {
    path: "/board-game-lists/:id",
    name: "board-game-single-list-view",

    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/BoardGameSingleListView.vue"
      ),
    meta: {
      needsUser: true,
    },
  },
  {
    path: "/edit-profile",
    name: "edit-profile-view",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/EditProfileView.vue"),
    meta: {
      needsUser: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
// jos zajebava na landingu ali ostalo radi
router.beforeEach((to, from, next) => {
  const isUserAuthenticated = store.isAuthenticated;
  if (isUserAuthenticated == false && to.meta.needsUser) {
    console.log("nije ulogiran test ", store.storeData.test);
    next("/");
  } else if (isUserAuthenticated == true && to.meta.noUser) {
    console.log("ulogiran je");
    next("/");
  } else {
    next();
  }
});

export default router;
