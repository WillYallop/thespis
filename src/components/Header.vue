<template>
  <div class="headerContainer">
    <router-link to="/" class="logoLink"><img src="@/assets/branding/headerLogo.png" alt=""></router-link>

    <div class="headerRightSideContent">
      <button class="notificationBtn">
        <font-awesome-icon class="fas" icon="bell"/>
      </button>

      <button v-on:click="navToggle" id="toggleNavButton" class="hamburger hamburger--spin-r" type="button" aria-label="Open navigation">
        <span class="hamburger-box">
            <span class="hamburger-inner"></span>
        </span>
      </button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'siteHeader',
  methods: {
    navToggle: function() {
        //Toggle navigation
        [].map.call(document.querySelectorAll('.siteNav'), function(el) {
            el.classList.toggle('showNavbar');
        });
        //Toggle page
        [].map.call(document.querySelectorAll('.pageContentContainer'), function(el) {
            el.classList.toggle('animatePage');
        });
        //Toggle Hamburger
        [].map.call(document.querySelectorAll('.hamburger'), function(el) {
            el.classList.toggle('is-active');
        });
    }
  }
}
</script>

<style scoped>
.headerContainer {
  width: 100%;
  height: 50px;
  background-color: #303841;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.10);
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 2000;
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logoLink {
  height: 40px;
}
.headerContainer img {
  height: 40px;
}

.headerRightSideContent {
  height: 100%;
  display: flex;
}

.notificationBtn {
  background: transparent;
  border: none;
  padding: 0;
}
.notificationBtn .fas {
  color: #FFF;
  font-size: 24px;
}

/*Hamburger*/
.hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
    background-color: #FFF;
}
.hamburger.is-active .hamburger-inner, .hamburger.is-active .hamburger-inner::before, .hamburger.is-active .hamburger-inner::after {
    background-color: #FFF;
}
.hamburger {
    padding: 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background-color: #303841;
    height: 100%;
}
.hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
    width: 35px;
    height: 3.5px;
}
.hamburger-box {
    width: 35px;
}
.hamburger-inner::before {
    top: -8px;
}
.hamburger-inner::after {
    bottom: -8px;
}


@media only screen and (min-width: 1024.1px) {
  .hamburger {display: none;}
}
@media only screen and (max-width: 1024px) { 
  .headerContainer {padding: 0 10px;}
  .notificationBtn {margin-right: 20px;}
}
</style>
