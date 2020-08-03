<template>
  <div id="app">
    <Header/>
    <Navigation/>
    <div class="pageContentContainer movePage">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'home',
  components: {
    Header,
    Navigation
  },    
  methods: {

  }
}
</script>

<style>
#nprogress .bar {
  z-index: 10000 !important;
  background: #2E85E8 !important;
}
html {
  -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
  -webkit-tap-highlight-color: transparent !important;
  height: 100%;
}
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #EEEEEE;
  min-height: 100%;
}

.hideOverflow {overflow: hidden;}
button:focus {outline: none;}
input:focus {outline: none;}
textarea:focus {outline: none;}
::selection {
  background-color: #2E85E8;
  color: white;
}

/* Global Site Styling */
.pageContentContainer {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  padding-left: 250px;
  box-sizing: border-box;
}
.navigationWrapper .simplebar-content {
  height: 100% !important;
  display: flex;
  flex-wrap: wrap;
}
.newPostBgOverlayWrapper .simplebar-content {
  height: 100% !important;
  padding: 0 10px !important;
}

/* Buttons */
.actionBtn {
  padding: 7px 40px;
  border-radius: 20px;
  border: none;
  background-color: #2E85E8;
  color: #FFF;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}
.actionBtn:hover {
  background-color: #2A74C8;
}


/* For talent page */
.portfolioTitleTags .vue-input-tag-wrapper  {
  background-color: transparent;
  border: none;
}
.talentPageTalentTagWrapper .vue-input-tag-wrapper  {
  background-color: transparent;
  border: none;
}
.talentPageTalentTagWrapper .vue-input-tag-wrapper .input-tag {
  background-color: #FFF !important;
  color: #181818 !important;
}
.talentRowTalentTagWrapper .vue-input-tag-wrapper  {
  background-color: transparent;
  border: none;
  cursor: pointer !important;
}
.talentRowTalentTagWrapper .vue-input-tag-wrapper .input-tag{
  font-size: 12px !important;
}
/* For profile/Settings page */
.vue-input-tag-wrapper .input-tag{
  margin: 5px 0 !important;
  padding: 5px 8px !important;
  border: none !important;
  background-color: #2E85E8 !important;
  color: #FFF !important;
  margin-right: 5px !important;
  border-radius: 20px !important;
  font-size: 15px !important;
}
.vue-input-tag-wrapper .input-tag .remove {
  color: #FFF !important;
}
.vue-input-tag-wrapper .new-tag {
  margin: 5px 0 !important;
  padding: 0 10px !important;
  box-sizing: border-box !important;
  height: 35px !important;
  width: 100% !important;
  font-size: 16px !important;;
  color: #404040 !important;
  border-radius: 5px !important;
  background-color: #F7F7F7 !important;
  border: 1px solid #F7F7F7 !important;;
}
.vue-input-tag-wrapper {
  padding: 0 !important;
}
/* Media Queries */
@media only screen and (max-width: 1024px) {
  .pageContentContainer {
    padding-left: 0;

    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    transition: left 0.3s;
  }
  .animatePage {
    left: -250px;
  
  }
}
</style>
