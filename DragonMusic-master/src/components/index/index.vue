<template>
  <div class="index" ref="wrapper"
       v-loading="loading"
       element-loading-text="音乐加载中">
    <div class="content">
      <div class="swiper-container" ref="swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide"><a href="#"><img src="http://y.gtimg.cn/music/photo_new/T003R720x288M000004fipyb2jxNz0.jpg" alt=""></a></div>
          <div class="swiper-slide"><a href="#"><img src="http://y.gtimg.cn/music/photo_new/T003R720x288M000002eCw5B2onE2E.jpg" alt=""></a></div>
          <div class="swiper-slide"><a href="#"><img src="http://y.gtimg.cn/music/photo_new/T003R720x288M000003kE6Rn0Z9GPG.jpg" alt=""></a></div>
          <div class="swiper-slide"><a href="#"><img src="http://y.gtimg.cn/music/photo_new/T003R720x288M000003T3yy63qtVH3.jpg" alt=""></a></div>
          <div class="swiper-slide"><a href="#"><img src="http://y.gtimg.cn/music/photo_new/T003R720x288M0000009nd8G3oWW7j.jpg" alt=""></a></div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <div class="suggest">
        <div class="suggest-header border-1px">
          <div class="text"> <span class="iconfont icon">&#xe633;</span> 热门歌曲 <span class="iconfont icon">&#xe633;</span></div>
        </div>
        <div class="song-list">
          <div class="single first" v-for="(item,index) in songList" @click="getInfo(item)">
            <div class="img">
              <img :src="item.albumpic_small">
            </div>
            <div class="desc">
              <p class="songname">{{item.songname}}</p>
              <p class="singername">{{item.singername}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.min.css';
  import '../../common/stylus/mixin.styl';
  import axios from 'axios';

  export default {
    data() {
      return {
        loading: false,
        songList: []
      };
    },
    created() {
      // 没有就是 null
      if (!sessionStorage.getItem('indexCache')) {
        this.loading = true;
        axios({
          url: 'http://route.showapi.com/213-4?showapi_appid=45835&showapi_sign=94a95b5d1e3b48b3a071a6d83cee0f54&topid=26',
          type: 'get'
        }).then((res) => {
          this.loading = false;
          // 拿到歌曲列表
          this.songList = res.data.showapi_res_body.pagebean.songlist;
          // 在歌曲列表上插入num标记
          this.songList.forEach((item, index) => {
            Vue.set(item, 'num', index);
          });
          // 第一次存储数据
          sessionStorage.setItem('indexCache', JSON.stringify(this.songList));
          // 设置播放列表
          this.$store.commit('setPlayList', this.songList);
          // 设置better-scroll
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.wrapper, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        });
      } else {
        // 从session拿数据
        this.songList = JSON.parse(sessionStorage.getItem('indexCache'));
        // 设置播放列表
        this.$store.commit('setPlayList', this.songList);
        // 设置better-scroll
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
    mounted() {
      this.swiper = new Swiper(this.$refs.swiper, {
        loop: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: 2500,
        autoplayDisableOnInteraction: false
      });
    },
    methods: {
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
          if (res.showapi_res_code === -3) {
            // 服务方异常。读取超时!
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
  @import '../../common/stylus/mixin.styl'

  .index
    overflow hidden
    position: absolute
    top: 72px
    bottom: 0
    z-index: 50
    width: 100%
    background: #fff
    .content
      margin-bottom: 0
      .swiper-container
        .swiper-wrapper
          .swiper-slide
            a
              img
                width: 100%
                height: auto
      .suggest
        .suggest-header
          display: flex
          height: 40px
          border-1px(#ccc)
          .text
            flex: 1
            text-align: center
            line-height: 40px
            font-weight: 500
            .icon
              color: #366
        .song-list
          padding: 20px 20px 70px
          .single
            display: flex
            margin-bottom: 10px
            box-shadow: 0 0 2px #ccc
            &:last-child
              margin-bottom: 0
            .img
              flex: 0 0 90px
              width: 90px
              height: 90px
              margin-right: 16px
            .desc
              box-sizing: border-box
              flex: 1
              padding-top: 10px
              border-bottom: 1px dashed transparent
              .songname
                margin-bottom: 10px
                color: #000
              .singername
                color: #666
</style>
