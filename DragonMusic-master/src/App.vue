<template>
  <div id="app">
    <div class="header">
      <h1>Dragon Music</h1>
    </div>
    <div class="nav-bar border-1px">
      <div class="nav-list"><router-link to="/index">推荐</router-link></div>
      <div class="nav-list"><router-link to="/hot">榜单</router-link></div>
      <div class="nav-list"><router-link to="/search">搜索</router-link></div>
    </div>
    <router-view></router-view>
    <player></player>
  </div>
</template>

<script>
  import player from './components/player/player';

  export default {
    components: {
      player
    },
    mounted() {
      // 欢迎语
      this.$notify({
        title: 'Welcome',
        iconClass: 'el-icon-bell',
        message: '<strong style="color: #369">欢迎体验 <span style="font-weight: 600;">神龙音乐</span></strong>',
        dangerouslyUseHTMLString: true,
        offset: 60,
        duration: 3000
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import 'common/stylus/mixin.styl';

  #app
    height: 100%
    background: #fff
    .header
      position: relative
      z-index: 30
      margin-bottom: 4px
      h1
        height: 30px
        padding-top: 2px
        line-height: 30px
        text-align: center
        font-size: 18px
    .nav-bar
      position: relative
      z-index: 30
      display: flex
      height: 26px
      margin-bottom: 10px
      padding-bottom: 10px
      line-height: 26px
      text-align: center
      border-1px(#ccc)
      .nav-list
        flex: 1
        .active
          position: relative
          padding: 7px 10px
          color: #369
          font-weight: 600
          border-bottom: 2px solid #369
</style>
