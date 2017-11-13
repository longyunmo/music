import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/index/index';
import hot from '@/components/hot/hot';
import topList from '@/components/topList/topList';
import search from '@/components/search/search';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  routes: [
    // 不匹配的url都跳到/index
    {path: '*', redirect: '/index'},
    {path: '/index', component: index},
    {path: '/hot', component: hot},
    // 热门榜单路由传参
    {path: '/topList/:id', component: topList},
    {path: '/search', component: search}
  ]
});
