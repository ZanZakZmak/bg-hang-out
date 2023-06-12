<template>
  <hello-world />
</template>

<script>
//desno dio slobodan za filtere u centru postovi preko komponente v for
import HelloWorld from "../components/HelloWorld";

export default {
  name: "Sesions",

  components: {
    HelloWorld,
  },
  data() {
    return {};
  },
};
</script>
