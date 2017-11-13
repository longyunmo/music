<template>
  <div class="player" v-show="playerShow">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated zoomOut">
      <div class="lyric" :style="{backgroundImage: 'url('+getBg+')'}" v-show="lyricShow">
        <div class="layer">
          <div class="wrapper">
            <div class="inner">
              <div class="title">
                <h2 class="songname">{{getSongname}}</h2>
                <p class="singername">{{getSingername}}</p>
              </div>
              <div class="content" ref="content" v-loading="lyricLoading"
                   element-loading-background="transparent"
                   element-loading-text="歌词加载中">
                <div class="content-inner" :style="{marginTop: currentIndex>7?-30*(currentIndex-7)+'px':0}">
                  <p class="text" v-for="(item,index) in renderLyric" :class="{active:
                  currentIndex===index?true:false}" v-show="index!==0">{{item.lyric}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="progress">
          <div class="inner" @mousedown="togglePosition($event)" ref="inner">
            <div class="bg" :style="{width: ratio*100 + '%'}">
              <div class="bar" :style="{left: 'calc('+ratio*100+'% - 12px)'}">
                <div class="bar-real"></div>
              </div>
            </div>
            <span class="timeStart">{{curTime | secToHms}}</span>
            <span class="timeEnd">{{getDuration | secToHms}}</span>
          </div>
        </div>
        <div class="close iconfont" @click="close">&#xe62f;</div>
      </div>
    </transition>
    <div class="mini-player">
      <p class="play-order">
        <canvas id="canvas-bottom" width="58" height="58"></canvas>
        <canvas id="canvas" width="58" height="58" ref="canvas"></canvas>
        <img :src="getImg" alt="" ref="img" :style="{transform: 'rotate('+angle+'deg)'}" @click="toggleLyric">
      </p>
      <p class="controls">
        <span class="iconfont con" style="font-size:22px" @click="prev">&#xe61e;</span>
        <span class="iconfont con" style="font-size:36px" v-show="!playSta" @click="play">&#xe627;</span>
        <span class="iconfont con" style="font-size:36px" v-show="playSta" @click="pause">&#xe62a;</span>
        <span class="iconfont con" style="font-size:24px" @click="later">&#xe604;</span>
      </p>
      <p class="order" @click="changeOrder">
        <span class="iconfont" style="font-size:22px" v-if="order === 0">&#xe639;</span>
        <span class="iconfont" style="font-size:22px" v-else-if="order === 1">&#xe605;</span>
        <span class="iconfont" style="font-size:22px" v-else>&#xe603;</span>
      </p>
    </div>
    <audio :src="getUrl" ref="player" @ended="next" @timeupdate="update" @canplaythrough="getSeconds"
           @pause="pause"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios';

  export default {
    data() {
      return {
        url: undefined,
        // 播放列表中的第几首
        num: 0,
        playSta: false,
        angle: 0,
        timer: 0,
        lyricShow: false,
        curTime: 0,
        timeArr: [],
        ratio: 0,
        // 搜索的歌曲没有seconds信息
        seconds: 0,
        // 播放顺序 0顺序 1随机 2单曲
        order: 0
      };
    },
    mounted() {
      this.$store.commit('setPlayer', this.$refs.player);
    },
    filters: {
      secToHms(sec) {
        // 秒转化成时分秒函数
        var hours = ~~(parseInt(sec) / 3600);
        var minutes = Math.floor((sec - hours * 3600) / 60);
        var seconds = sec % 60;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        if (hours === '00') {
          return minutes + ':' + seconds;
        } else {
          return hours + ':' + minutes + ':' + seconds;
        }
      }
    },
    computed: {
      // 歌词加载状态
      lyricLoading() {
        return this.$store.state.lyricLoading;
      },
      getDuration() {
        // 搜索的歌曲没有duration字段
        return this.$store.state.songInfo.seconds || this.seconds;
      },
      getUrl() {
        this.url = this.$store.state.songInfo.url || this.$store.state.songInfo.m4a;
        this.num = this.$store.state.songInfo.num;
        // 搜索的歌曲的url字段变成了m4a
        return this.$store.state.songInfo.url || this.$store.state.songInfo.m4a;
      },
      getImg() {
        return this.$store.state.songInfo.albumpic_small || 'http://longjun.oss-cn-beijing.aliyuncs.com/img/girl.jpg?x-oss-process=style/longjun';
      },
      getBg() {
        return this.$store.state.songInfo.albumpic_big || 'http://longjun.oss-cn-beijing.aliyuncs.com/img/girl.jpg?x-oss-process=style/longjun';
      },
      getSongname() {
        return this.$store.state.songInfo.songname;
      },
      getSingername() {
        return this.$store.state.songInfo.singername;
      },
      playerShow() {
        return this.$store.state.playerShow;
      },
      renderLyric() {
        this.timeArr = [];
        // 歌词拆分
        var lyric = this.$store.state.lyric || '';
        var demo = lyric.split('&#10;');
        var arr = [];
        for (let i = 0; i < demo.length; i++) {
          let time = demo[i].split('[');
          for (let j = 0; j < time.length; j++) {
            let lyr = time[j].split(']');
            let finalLyric = lyr[1];
            let finalTime = lyr[0];
            if (finalTime) {
              let min = finalTime.split(';')[0].slice(0, 2);
              let sec = finalTime.split(';')[1].slice(0, 2);
              var secs = min * 60 + sec * 1;
            }
            if (finalLyric) {
              finalLyric = finalLyric.replace(/&#[0-9]*;/g, ' ');
              arr.push({
                lyric: finalLyric,
                time: secs
              });
              this.timeArr.push(secs);
            }
          }
        }
        return arr;
      },
      // 计算当前在第几条歌词位置
      currentIndex() {
        for (let i = 0, Len = this.timeArr.length; i < Len; i++) {
          let time1 = this.timeArr[i];
          let time2 = this.timeArr[i + 1];
          if (this.curTime >= time1 && this.curTime < time2) {
            return i;
          } else if (this.curTime >= this.timeArr[Len - 1]) {
            return Len - 1;
          }
        }
      }
    },
    watch: {
      // 当前歌曲信息url一变化 就播放歌曲
      url(n) {
        // 清空歌词
        this.$store.commit('setLyric', '');
        this.playSta = true;
        this.lyricShow = true;
        this.$refs.player.play();
      },
      playSta(n) {
        // 监控播放状态 播放则旋转
        if (n === true) {
          this.timer = setInterval(() => {
            this.angle++;
            this.angle %= 360;
          }, 22);
        } else {
          clearInterval(this.timer);
        }
      }
    },
    methods: {
      play() {
        this.$refs.player.play();
        this.playSta = true;
      },
      pause() {
        this.$refs.player.pause();
        this.playSta = false;
      },
      // 点击上一首
      prev() {
        let list = this.$store.state.playList;
        this.num--;
        this.num = this.num < 0 ? list.length - 1 : this.num;
        this.$store.commit('setSongInfo', list[this.num]);
        // 拿歌词
        this.getLyric(this.$store.state.songInfo.songid);
      },
      // 点击下一首
      later() {
        var list = this.$store.state.playList;
        this.num++;
        this.num = this.num > list.length - 1 ? 0 : this.num;
        this.$store.commit('setSongInfo', list[this.num]);
        // 拿歌词
        this.getLyric(this.$store.state.songInfo.songid);
      },
      // 播放顺序设置
      next() {
        this.$refs.player.pause();
        var list = this.$store.state.playList;
        var len = list.length;
        if (this.order === 0) {
          this.num++;
          this.num = this.num > list.length - 1 ? list.length - 1 : this.num;
        } else if (this.order === 1) {
          this.num = parseInt(Math.random() * len);
        } else {
        }
        this.$store.commit('setSongInfo', list[this.num]);
        // 拿歌词
        this.getLyric(this.$store.state.songInfo.songid);
        this.$nextTick(() => {
          this.$refs.player.play();
          this.playSta = true;
        });
      },
      toggleLyric() {
        this.lyricShow = !this.lyricShow;
      },
      getLyric(musicid) {
        this.$store.commit('setLyricLoading', true);
        axios({
          url: `http://route.showapi.com/213-2?showapi_appid=45835&showapi_sign=94a95b5d1e3b48b3a071a6d83cee0f54&musicid=${musicid}`,
          type: 'get'
        }).then((res) => {
          this.$store.commit('setLyricLoading', false);
          let lyric = res.data.showapi_res_body.lyric;
          this.$store.commit('setLyric', lyric);
          // 服务方异常。读取超时!
          if (res.showapi_res_code === -3) {
            this.$notify.error({
              title: '错误',
              message: res.showapi_res_error
            });
          }
        });
      },
      // audio timeupdate回调函数
      update() {
        if (this.$refs.player.currentTime) {
          this.curTime = Number.parseInt(this.$refs.player.currentTime);
          this.ratio = this.$refs.player.currentTime / this.$refs.player.duration;
          // canvas绘制播放进度
          var can = this.$refs.canvas;
          var ctx = can.getContext('2d');
          var w = can.width;
          var h = can.height;
          ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = '#999';
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, w / 2, Math.PI * 2 * this.ratio, false);
          ctx.fill();
          ctx.closePath();
        } else {
          this.curTime = 0;
        }
      },
      // 点击进度条 更改播放时间
      togglePosition(e) {
        this.$refs.player.currentTime = e.offsetX / this.$refs.inner.clientWidth * this.$refs.player.duration;
      },
      close() {
        this.lyricShow = false;
      },
      getSeconds() {
        this.seconds = ~~(this.$refs.player.duration);
      },
      // 点击切换播放模式
      changeOrder() {
        // 播放顺序 0顺序 1随机 2单曲
        this.order++;
        this.order %= 3;
        // 提示
        var order = '';
        switch (this.order) {
          case 0: order = '顺序播放'; break;
          case 1: order = '随机播放'; break;
          case 2: order = '单曲循环'; break;
          default: break;
        }

        this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          message: `当前播放模式是: <strong style="color: #369;font-weight: 600;"> ${order}</strong>`,
          type: 'success'
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .player
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    .lyric
      position: absolute
      top: 0
      left: 0
      z-index: 60
      width: 100%
      height: 100%
      background-color: #369
      background-position: center top
      background-size: cover
      backdrop-filter: blur(10px)
      .close
        position: absolute
        top: 0
        left: 0
        padding: 10px 20px 20px
        color: #f3f3f3
        font-size: 28px
      .progress
        box-sizing: border-box
        position: absolute
        left: 0
        bottom: 80px
        z-index: 50
        width: 100%
        height: 6px
        margin: 10px 0
        .inner
          position: relative
          width: 60%
          height: 100%
          margin: auto
          background: rgba(200, 200, 250, .8)
          .timeStart
            position: absolute
            left: -56px
            top: -4px
            color: #f3f3f3
          .timeEnd
            position: absolute
            right: -56px
            top: -4px
            color: #f3f3f3
          .bg
            width: 0
            height: 100%
            background: #369
            .bar
              position: absolute
              top: -5px
              left: 0
              z-index: 50
              width: 16px
              height: 16px
              border-radius: 50%
              background: rgba(255,255,255,.9)
              box-shadow: 0 0 20px #fff
              .bar-real
                width: 12px
                height: 12px
                margin: 2px
                border-radius: 50%
                background: #369
      .layer
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(0,0,0,.5)
        .wrapper
          overflow: hidden
          box-sizing: border-box
          position: absolute
          bottom: 60px
          left: 0
          top: 0
          width: 100%
          margin: 20px 0
          .inner
            box-sizing: border-box
            position: absolute
            left: 0
            top: 0
            bottom: 0
            width: 100%
            padding: 0 20px
            transition: all .6s
            .title
              text-align: center
              color: #fff
              .songname
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap
                width: 80%
                margin: 0 auto 8px
                font-size: 20px !important
                font-weight: 600
                color: #fff
              .singername
                font-size: 14px
                color: #f3f3f3
            .content
              box-sizing: border-box
              overflow: hidden
              position: absolute
              top: 40px
              left: 0
              bottom: 30px
              width: 100%
              margin: 20px 0 0
              .content-inner
                position: relative
                padding: 0 20px
                transition: all .6s
                .text
                  overflow: hidden
                  text-overflow: ellipsis
                  white-space: nowrap
                  height: 30px
                  line-height: 30px
                  text-align: center
                  color: #ededed
                  transition: all .6s
                  &.active
                    color: gold
                    font-size: 18px
                    font-weight: 600
    .mini-player
      display: flex
      position: fixed
      bottom: 0
      left: 0
      z-index: 70
      width: 100%
      height: 60px
      line-height: 60px
      background: #369
      color: #fff
      .play-order
        position: relative
        flex: 0 0 80px
        width: 80px
        margin: 3px 10px
        #canvas-bottom
          position: absolute
          top: -3px
          left: -3px
          margin-top: 1px
          background: gold
          border-radius: 50%
        #canvas
          position: absolute
          top: -3px
          left: -3px
          margin-top: 1px
          transform: rotate(-90deg)
        img
          box-sizing: border-box
          width: 52px
          height: 52px
          margin-top: 1px
          border: 1px solid #369
          border-radius: 50%
      .controls
        display: flex
        flex: 1
        font-size: 0
        .con
          flex: 1
          display: inline-block
          text-align: center
      .order
        flex: 0 0 80px
        width: 80px
        text-align: center
        span
          display: inline-block
</style>
