<template>
  <div class="hello">
    {{msg}}
    <a class="eee">123</a>
    <div class="blue">456</div>
    <!-- <svg-icon icon-class="all22" />
    <ul v-for="item in datasouse" :key="item.id">
      <li>{{ item.name }}</li>
    </ul>
    <button @click="change">changeinner</button> -->
  </div>
</template>

<script>
import { home } from '@/api/public';
export default {
  name: "HelloWorld",
  data() {
    return {
      datasouse2: []
    };
  },
  props: {
    msg: String,
    // datasouse: Array
  },
  watch: {
    // datasouse(newval, oldval){
    //   console.log(newval)
    //   return this.datasouse2 = newval
    // }
  },
  beforeCreate() {
    // home().then(res => {
    //   console.log("我是log");
    //   console.log(res);
    // })
  },
  methods: {
    change() {
      this.datasouse2.push({ id: 3, name: 555 });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}

</style>
