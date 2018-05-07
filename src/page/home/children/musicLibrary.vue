<template>
  <section
    v-if="pageKey === 'musicLibrary'"
    class="musicLibrary"
    :style="{height: musicLibraryHeight + 'px'}">
    <slide-banner :bannerData="bannerData"></slide-banner>
    <nav class="musicNav">
      <router-link
        v-for="(item, index) in musicNav"
        :key="index"
        :to="item.route"
        event="touch"
        tag="div"
        class="musicNavItem">
        <div class="musicNavItemLogo">{{item.logo}}</div>
        <h3 class="musicNavItemTitle">{{item.title}}</h3>
      </router-link>
    </nav>
    <section
      v-for="(musicModule, moduleIndex) in musicModuleData"
      :key="moduleIndex"
      :class="musicModule.className"
      class="musicModule">
      <header class="moduleHeader">
        <h3 class="moduleTitle">{{musicModule.title}}</h3>
        <span
          v-if="musicModule.data.length >= 6"
          class="arrows">&gt;</span>
      </header>
      <ul class="ulMusicModuleDetail">
        <li
          v-for="(item, itemIndex) in musicModule.data"
          :key="itemIndex"
          class="liMusicModuleDetail">
          <img v-if="item.picUrl || item.song.album.picUrl" :src="item.picUrl || item.song.album.picUrl" class="moduleItemImg">
          <section class="moduleItemText">
            <span
              v-if="item.videoId"
              class="sourceType">{{item | sourceType}}</span>
            <span class="moduleItemName">{{item.name}}</span>
            <p v-if="item.song" class="singer">{{item.song.artists | joinArtists}}-{{item.song.album.name}}</p>
            <div v-if="item.song" class="play"></div>
          </section>
          <span
            v-if="item.playCount"
            class="playCount">{{item.playCount | countSwitch}}</span>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
import {personalizedAlbum, privateContent, personalizedSong, personalizedDj, personalizedMV} from '../../api/getData'
import {mapMutations, mapState} from 'vuex'

export default {
  
}
</script>

