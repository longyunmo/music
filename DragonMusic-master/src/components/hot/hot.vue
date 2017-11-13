<template>
  <div class="hot" ref="wrapper">
    <div class="content types">
      <router-link :to="{path: '/topList/'+item.topId, query: {data: item}}" class="type" v-for="(item,index) in
      topType"
                   key="index">
        <div class="img">
          <img :src="item.imgUrl" alt="">
        </div>
        <ul class="desc">
          <li v-for="(v,k) in item.top3">{{k + 1}}.{{v.songname}} -- {{v.singername}}</li>
        </ul>
      </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 热门榜单
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import axios from 'axios';
  import { Loading } from 'element-ui';

  export default {
    data() {
      return {
        // 该api无榜单图片, 引自网络
        topType: [
          {
            title: '欧美',
            topId: 3,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_3_300_203810208.jpg'
          },
          {
            title: '流行榜',
            topId: 4,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_4_300_204108506.jpg'
          },
          {
            title: '内地',
            topId: 5,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_5_300_203862041.jpg'
          },
          {
            title: '港台',
            topId: 6,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_6_300_203827066.jpg'
          },
          {
            title: '韩国',
            topId: 16,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_16_300_203846270.jpg'
          },
          {
            title: '日本',
            topId: 17,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_17_300_203820499.jpg'
          },
          {
            title: '热歌',
            topId: 26,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_26_300_203617292.jpg'
          },
          {
            title: '新歌',
            topId: 27,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_27_300_204108506.jpg'
          },
          {
            title: '网络歌曲',
            topId: 28,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_28_300_109501554.jpg'
          },
          {
            title: '音乐人',
            topId: 32,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_52_300_203600432.jpg'
          },
          {
            title: 'K歌金曲',
            topId: 36,
            imgUrl: 'http://y.gtimg.cn/music/common/upload/iphone_order_channel/toplist_36_300_200732018.jpg'
          }
        ]
      };
    },
    created() {
      // 一进来拿到每个榜单 前三首歌曲信息
      if (!sessionStorage.getItem('top3')) {
        // 调用loading服务
        var loading = Loading.service({
          lock: true,
          text: 'loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.topType.forEach((item, index) => {
          axios({
            url: 'http://route.showapi.com/213-4?showapi_appid=45835&showapi_sign=94a95b5d1e3b48b3a071a6d83cee0f54&topid=' +
            item.topId,
            type: 'get'
          }).then((res) => {
            if (index >= this.topType.length - 1) {
              loading.close();
            }
            var arr = [];
            for (let i = 0; i < 3; i++) {
              arr.push(res.data.showapi_res_body.pagebean.songlist[i]);
            }
            // 第一次存储数据
            Vue.set(item, 'top3', arr);
            sessionStorage.setItem('top3', JSON.stringify(this.topType));
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
        });
      } else {
        this.topType = JSON.parse(sessionStorage.getItem('top3'));
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
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .hot
    overflow: hidden
    position: absolute
    top: 80px
    bottom: 60px
    z-index: 50
    width: 100%
    background: #fff
    .types
      box-sizing: border-box
      width: 100%
      padding: 20px
      .type
        display: flex
        width: 100%
        height: 100px
        margin-bottom: 20px
        box-shadow: 0 0 8px #369
        .img
          flex: 0 0 100px
          width: 100px
          img
            width: 100px
            height: auto
        .desc
          overflow: hidden
          flex: 1
          padding: 10px
          li
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            line-height: 26px
            font-size: 14px
</style>
