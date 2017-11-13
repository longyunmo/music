import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    playerShow: false,
    // 当前播放歌曲信息
    songInfo: {},
    // 当前播放列表
    playList: [],
    // 歌词
    lyric: '',
    // h5页面需要获取audio标签
    player: null,
    queryBox: null,
    lyricLoading: false
  },
  mutations: {
    setPlayerShow(state, sta) {
      state.playerShow = sta;
    },
    setSongInfo(state, songInfo) {
       state.songInfo = songInfo;
    },
    setPlayList(state, playList) {
      state.playList = playList;
    },
    setLyric(state, lyric) {
      state.lyric = lyric;
    },
    setPlayer(state, player) {
      state.player = player;
    },
    setQueryBox(state, box) {
      state.queryBox = box;
    },
    setLyricLoading(state, loading) {
      state.lyricLoading = loading;
    }
  }
});
