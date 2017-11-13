<template>
  <div class="search">
    <div class="input-group">
      <span class="iconfont icon">&#xe654;</span>
      <input class="search-form" type="text" placeholder="搜索歌曲, 歌手" v-model.trim="query" ref="query">
      <span class="iconfont close" v-show="query !== ''" @click.stop="clearQuery">&#xe636;</span>
    </div>
    <transition enter-active-class="animated fadeIn">
      <component :is="componentId" :loading="loading" :myData="data" :mySearch="songList" @bubble="change"></component>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  // 搜索页面
  import Vue from 'vue';
  import axios from 'axios';
  import hotSearch from '@/components/hotSearch/hotSearch';
  import searchContent from '@/components/searchContent/searchContent';
  import Base64 from '../../common/js/base64.js';

  export default {
    data() {
      return {
        query: '',
        // 热门搜索的数据
        data: ['追光者', '天生一对', '凉凉', '我们不一样', '我爱的人', '弱点', '祝你幸福', '走着走着就散了', '最远的你是我最近的爱'],
        // 搜索结果数据
        songList: [],
        // 动态组件
        componentId: 'hotSearch',
        loading: false,
        base64: new Base64()
      };
    },
    created() {
      // 拿出保存的查询字段
      if (sessionStorage.getItem('query')) {
        // base64解密
        this.query = this.base64.decode(sessionStorage.getItem('query'));
      }
    },
    mounted() {
      this.$store.commit('setQueryBox', this.$refs.query);
    },
    methods: {
      // 子组件像父级传递的事件
      change(item) {
        this.query = item;
      },
      clearQuery() {
        this.query = '';
        this.songList = [];
      }
    },
    watch: {
      query(n, o) {
        // 保存搜索的字符串 base64加密
        sessionStorage.setItem('query', this.base64.encode(n));
        if (n !== '') {
          this.componentId = 'searchContent';
          this.loading = true;
          // keyword为空接口会报错
          axios({
            url: `http://route.showapi.com/213-1?showapi_appid=45835&showapi_sign=94a95b5d1e3b48b3a071a6d83cee0f54&keyword=${this.query}`,
            type: 'get'
          }).then((res) => {
            this.loading = false;
            this.songList = res.data.showapi_res_body.pagebean.contentlist;
            // 在歌曲列表上插入num标记
            this.songList.forEach((item, index) => {
              Vue.set(item, 'num', index);
            });
            // 设置播放列表
            this.$store.commit('setPlayList', this.songList);
          });
        } else {
          this.componentId = 'hotSearch';
        }
      }
    },
    components: {
      hotSearch, searchContent
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .search
    position: fixed
    top: 82px
    bottom: 0
    width: 100%
    z-index: 50
    background: #fff
    .input-group
      position: relative
      overflow: hidden
      display: flex
      width: 80%
      height: 40px
      line-height: 40px
      margin: 20px auto
      font-size: 0
      border-radius: 5px
      border: 1px solid #369
      .icon
        flex: 0 0 30px
        display: inline-block
        width: 30px
        font-size: 28px
        margin-left: 4px
        color: #369
      .close
        position: absolute
        right: 2px
        top: -1px
        padding: 1px 12px
        color: #369
      .search-form
        flex: 1
        height: 100%
        padding-left: 6px
        border: none
        outline: none
        color: #666
        font-size: 16px
</style>
