<template>
  <div>
      {{title}}
  </div>
</template>
<script>
import { login } from '@/api/public';
import { checkResponse } from '@/utils/utils';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      title:'欢迎登陆！'
    };
  },
};
</script>