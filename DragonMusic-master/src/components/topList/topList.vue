<template>
  <transition leave-active-class="animated zoomOut">
    <div class="topList">
      <div class="title"><span class="iconfont back" @click="back">&#xe625;</span>{{$route.query.data.title}}</div>
      <div class="wrapper" ref="wrapper" v-loading="loading">
        <div class="content">
          <div class="header">
            <img :src="topImgUrl" alt="">
          </div>
          <div class="song-list">
            <div class="single" v-for="(item,index) in songList" @click="getInfo(item)">
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
  </transition>
</template>

<script type="text/ecmascript-6">
  // 热门榜单
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import axios from 'axios';

    export default {
      data() {
        return {
          topImgUrl: 'http://i.gtimg.cn/music/photo/mid_album_300/I/O/002Nf4ht3NmYIO.jpg',
          songList: [],
          loading: false
        };
      },
      created() {
        // 开启loading
        this.loading = true;
        axios({
          url: `http://route.showapi.com/213-4?showapi_appid=45835&showapi_sign=94a95b5d1e3b48b3a071a6d83cee0f54&topid=${this.$route.query.data.topId}`,
          type: 'get'
        }).then((res) => {
          // 关闭loading
          this.loading = false;
          // 拿到海报
          this.topImgUrl = res.data.showapi_res_body.pagebean.songlist[0].albumpic_big;
          // 拿到歌曲列表
          this.songList = res.data.showapi_res_body.pagebean.songlist;
          // 在歌曲列表上插入num标记
          this.songList.forEach((item, index) => {
            Vue.set(item, 'num', index);
          });
          // 设置播放列表
          this.$store.commit('setPlayList', this.songList);
          // 设置better-scroll
          this.$nextTick(() => {
            if (!this.scrollTopList) {
              this.scrollTopList = new BScroll(this.$refs.wrapper, {
                click: true
              });
            } else {
              this.scrollTopList.refresh();
            }
          });
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
            // 服务方异常。读取超时!
            if (res.showapi_res_code === -3) {
              this.$notify.error({
                title: '错误',
                message: res.showapi_res_error
              });
            }
          });
        },
        back() {
          this.$router.go(-1);
        }
      }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .topList
    position: fixed
    top: 0
    bottom: 60px
    z-index: 50
    width: 100%
    background: #fff
    .title
      position: absolute
      top: 0
      left: 0
      z-index: 60
      width: 100%
      height: 60px
      line-height: 60px
      color: #fff
      font-size: 26px
      text-align: center
      background: #369
      .back
        position: absolute
        left: 6px
        top: 0
        padding: 0 20px
        font-size: 20px
        font-weight: 600
    .wrapper
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      z-index: 38
      .header
        position: relative
        width: 100%
        height: 0
        padding-top: 100%
        z-index: auto
        img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .song-list
        position: relative
        z-index: 40
        min-height: 1000px
        margin-top: -160px
        padding: 20px
        background: #fff
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
            &.cursong
              position: relative
              border-color: #369
              &:after
                position: absolute
                right: 0
                top: 0
                padding: 4px 10px
                content: '播放中'
                border-radius: 8px
                box-shadow: 0 0 10px #369
                background: #369
                color: #fff
                font-size: 12px
                transform: scale(0.9)
            .songname
              margin-bottom: 10px
              color: #000
            .singername
              color: #666
</style>
