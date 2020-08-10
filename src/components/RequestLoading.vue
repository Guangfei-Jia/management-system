<template>
  <transition name="fade-loading" :duration="1000" mode="out-in">
    <div class="request-loading-component" v-if="requestLoading">
      <svg-icon icon-class="loading" class="icon-loading" />
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "RequestLoading",
  computed: {
    ...mapState(["requestLoading"])
  }
};
</script>

<style lang="scss">
.fade-loading-enter,
.fade-loading-leave-to {
  opacity: 0;
}
.fade-loading-enter-active {
  transition: opacity 1s;
}
.fade-loading-leave-active {
  transition: opacity 1s;
}
@keyframes iconCircle {
  100% {
    transform: rotate(360deg);
  }
}
.request-loading-component {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(48, 65, 86, 0.2);
  //   background-color: transparent;
  font-size: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 999999;

  .icon-loading {
    animation: iconCircle 1.5s infinite linear;
  }
}
</style>
