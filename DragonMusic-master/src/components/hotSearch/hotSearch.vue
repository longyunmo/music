<template>
  <div class="hot-search">
    <h4 class="title"><span class="icon"></span> 热门搜索</h4>
    <ul class="text">
      <li class="item" v-for="(item,key) in myData" key="index" @click="choose(item)">{{item}}</li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
    // 搜索页的热门搜索词条
    export default {
      props: {
        myData: {
          type: Array,
          required: true
        }
      },
      methods: {
        // 向父组件发送数据
        choose(item) {
          this.$emit('bubble', item);
        }
      }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .hot-search
    margin: 20px
    .title
      font-size: 16px
      color: #7e8c8d
      margin: 20px 0
      .icon
        font-size: 16px
    .text
      display: flex
      flex-wrap: wrap
      .item
        margin-right: 10px
        margin-bottom: 10px
        padding: 6px 10px
        font-size: 14px
        color: #eee
        border-radius: 10px
        box-shadow: 0 0 1px #369
        background: rgba(51,102,153,.8)
</style>
