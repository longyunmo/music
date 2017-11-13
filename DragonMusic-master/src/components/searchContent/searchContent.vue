<template>
  <div class="search-content">
    <div class="wrapper" ref="wrapper" v-loading="loading">
      <div class="content" @touchstart="blur">
        <ul class="wrap">
          <li class="item" v-for="(item,index) in mySearch" :class="{bg: index%2==0?true:false}" @click="getInfo(item)">
            <p class="inner">
              <span class="iconfont icon">&#xe606;</span>
              {{item.songname | filter}} --
              {{item.singername | filter}}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios';
  import BScroll from 'better-scroll';

  export default {
    props: {
      mySearch: {
        type: Array
      },
      loading: {
        type: Boolean
      }
    },
    filters: {
      filter(data) {
        return data.replace(/&#[0-9]*;/g, '');
      }
    },
    watch: {
      // 数据更新就设置better-scroll
      mySearch(n) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.wrapper, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    },
    methods: {
      blur() {
        this.$store.state.queryBox.blur();
      },
      getInfo(item) {
        // 显示mini播放器
        this.$store.commit('setPlayerShow', true);
        // 设置当前歌曲信息
        this.$store.commit('setSongInfo', item);
        // 拿歌词
        this.getLyric(this.$store.state.songInfo.songid);
      },
      getLyric(musicid) {
        this.$store.commit('setLyricLoading', true);
        axios({
          url: `http://route.showapi.com/213-2?showapi_appid=45835&showapi_sign=94a95b5d1e3b48b3a071a6d83cee0f54&musicid=${musicid}`,
          type: 'get'
        }).then((res) => {
          this.$store.commit('setLyricLoading', false);
          this.$store.commit('setLyric', res.data.showapi_res_body.lyric);
          // 服务方异常。读取超时!
          if (res.showapi_res_code === -3) {
            this.$notify.error({
              title: '错误',
              message: res.showapi_res_error
            });
          }
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .search-content
    position: relative
    width: 100%
    margin: 0 auto
    .wrapper
      overflow: hidden
      position: fixed
      top: 144px
      bottom: 60px
      z-index: 50
      width: 100%
      .content
        .wrap
          .item
            box-sizing: border-box
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            height: 32px
            line-height: 32px
            border-radius: 5px
            .inner
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              width: 80%
              margin: auto
          .bg
            background: #f8f8f8
            .icon
              font-size: 16px
              color: #369
</style>
