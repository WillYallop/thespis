<template>
  <div id="portfolio">
    <!-- Cover photo/ profile photo & info container -->
    <div class="profileMainDataContaienr">
      <button v-on:click="shareProfile" class="sharePortfolioBtn mobileShareBtn"><font-awesome-icon class="fas" icon="share-alt" /></button>
      <input style="position: absolute; left: -9999px;" id="pageUrlInput" v-model="pageCopyUrl">
      <div class="profilePhotoWrapper">
        <div v-if="price" class="mobilePriceIndicator" :class="{ 'free' : priceType == 'free'}"><p v-if="priceType == 'paid'">£{{price}}</p><p v-if="priceType == 'free'">free</p> </div>
        <img class="usersProfilePhoto" :src="users_profile_picture">
        <div class="usersInfoWrapper">
          <p class="titleP">{{users_first_name}} {{users_last_name}}</p>
            <div v-if="users_talent" class="portfolioTitleTags">
              <InputTag class="talentTags" v-model="users_talent" :limit='3' :read-only="true"></InputTag>
            </div>
        </div>
      </div>
      <img class="usersCoverPhoto" :src="users_cover_image">
      <!-- Page navbar -->
      <div class="portfolioNavAbsolute">
        <div class="portfolioNavAbsoluteInner">
        <div class="dyanamicContentNavContainer">
          <div class="dyanamicContentNavWrapper">
            <ul>
              <li id="portfolioTimeline" class="dynamicNavCol oneNav" @click="loadTimeline">
                <font-awesome-icon class="fas" icon="stream" /><p>TIMELINE</p>
              </li>
              <li id="portfolioAbout" class="dynamicNavCol twoNav" @click="loadWork">
                <font-awesome-icon class="fas" icon="briefcase" /><p>WORK</P>
              </li>
              <li id="portfolioAbout" class="dynamicNavCol threeNav" @click="loadAbout">
                <font-awesome-icon class="fas" icon="address-card" /><p>ABOUT</P>
              </li>
              <li id="portfolioPhotos" class="dynamicNavCol fourNav" @click="loadPhotos">
                <font-awesome-icon class="fas" icon="image" /><p>GALLERY</P>
              </li>
              <hr :style="slideActive"/>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- Portfolio Content -->
    <div class="portfolioPageWrapper">
      <!-- Intro Col -->
      <div class="portfolioIntroContainer">

        <div class="portfolioIntroWrapper">
          <button v-on:click="shareProfile" class="desktopSharePortBtn"><font-awesome-icon class="fas" icon="share-alt" /></button>
          <p class="usersNameP">{{users_first_name}} {{users_last_name}}</p>
          <p v-if="userCity && !showAddress" class="usersAddressP">{{userCity}}</p>
          <p v-if="showAddress" class="usersAddressP">{{userAddress}}</p>
          <div v-if="users_talent" class="talentTagWrapper">
            <InputTag class="talentTags" v-model="users_talent" :limit='3' :read-only="true"></InputTag>
          </div>
          <p v-if="userBio" class="bioP">{{userBio}}</p>
          <!-- user acount info -->
          <div class="portfolioAccountInfoWrapper">
            <ul>
              <li v-if="userCity && !showAddress"><font-awesome-icon class="fas" icon="map-pin" /><p>{{userCity}}</p></li>
              <li v-if="showAddress"><font-awesome-icon class="fas" icon="map-pin" /><p>{{userAddress}}</p></li>
              <li><font-awesome-icon class="fas" icon="calendar-alt" /><p>Joined on {{userJoined}}</p></li>
              <li v-if="userDob"><font-awesome-icon class="fas" icon="birthday-cake" /><p>Born on {{userDob}}</p></li>
            </ul>
          </div>
        </div>

      </div>
      <!-- Dynamic Content Col -->
      <div class="portfolioDynamicContentContainer">
        <div class="portfolioDynamicContentWrapper">
          <component :key="componentKey"
            :is="currentComponent" 
            :userAddress="userAddress" 
            :showAddress="showAddress" 
            :userCity="userCity"
            :userDob="userDob" 
            :userJoined="userJoined"
            :userProfilePicture="users_profile_picture"
            :userFirstName="users_first_name"
            :userLastName="users_last_name"
            :showSocial="showSocial"
            :facebookUrl="facebookUrl"
            :instagramUrl="instagramUrl"
            :twitterUrl="twitterUrl"
            :youtubeUrl="youtubeUrl"
            :websiteUrl="websiteUrl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import InputTag from 'vue-input-tag'

import Timeline from '@/components/PortfolioComponents/Timeline'
import Gallery from '@/components/PortfolioComponents/Gallery'
import Work from '@/components/PortfolioComponents/Work'
import About from '@/components/PortfolioComponents/About'

export default {
  name: 'portfolio',
  components: {
    Timeline,
    Gallery,
    Work,
    About,
    InputTag

  },
  data () {
    return {
      currentComponent: null, // name of page component
      slideActive: 'margin-left: 0;', //Nav slider position
      page_id: null, //Portfolio ID
      yourProfile: null, //IF you ID matches the portfolio id
      componentKey: 0,
      pageCopyUrl: null,

      //User Data
      users_portfolio_id: null,
      users_first_name: null,
      users_last_name: null,
      users_talent: [],
      users_profile_picture: null,
      users_cover_image: null, 
      userAddress: null, 
      showAddress: null, 
      userCity: null,
      userDob: null, 
      userBio: null,
      showSocial: false,
      facebookUrl: null,
      instagramUrl: null,
      twitterUrl: null,
      youtubeUrl: null,
      websiteUrl: null,
      userJoined: null,
      priceType: null,  
      price: null,
    }
  },
  created() {
    //Sets profile edit btn
    if (firebase.auth().currentUser) {
      this.users_portfolio_id = firebase.auth().currentUser.uid
    }
    this.page_id = this.$route.params.users_id

    if (this.page_id == this.users_portfolio_id) {
      this.yourProfile = true
    }
   
    if (this.$route.params.page_content == 'timeline') {
      this.currentComponent = 'Timeline'
      this.slideActive = 'margin-left: 0;'
    } 
    if (this.$route.params.page_content == 'work') {
      this.currentComponent = 'Work'
      this.slideActive = 'margin-left: 25%;'
    } 
    if (this.$route.params.page_content == 'about') {
      this.currentComponent = 'About'
      this.slideActive = 'margin-left: 50%;'
    } 
    if (this.$route.params.page_content == 'gallery') {
      this.currentComponent = 'Gallery'
      this.slideActive = 'margin-left: 75%;'
    } 

    this.pageCopyUrl = document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : document.location.href
  },
  beforeRouteEnter(to, from, next) {
    const db = firebase.firestore()

    db.collection('users').where('users_id', '==', to.params.users_id).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        next(vm => {
          vm.users_id = doc.data().users_id
          vm.users_first_name = doc.data().first_name
          vm.users_last_name = doc.data().last_name
          vm.users_talent = doc.data().talent
          vm.users_profile_picture = doc.data().profile_picture
          vm.userAddress = doc.data().address
          vm.showAddress = doc.data().show_address
          vm.userDob = doc.data().dob
          vm.userBio = doc.data().bio
          vm.userCity = doc.data().city
          vm.priceType = doc.data().price_type
          vm.price = doc.data().price
          // Sets the cover image depending on if it exists
          if (!doc.data().cover_image) { 
            vm.users_cover_image = require('../assets/images/portfolioBg.jpeg')
          } else {vm.users_cover_image = doc.data().cover_image}
            // Is Live
          if (!doc.data().show_socials) { 
              vm.showSocial = false
          } else {vm.showSocial = doc.data().show_socials}
          // Facebook
          if (!doc.data().facebook_url) { 
              vm.facebookUrl = null
          } else {vm.facebookUrl = doc.data().facebook_url}
          // Instagram
          if (!doc.data().instagram_url) { 
              vm.instagramUrl = null
          } else {vm.instagramUrl = doc.data().instagram_url}
          // Twitter
          if (!doc.data().twitter_url) { 
              vm.twitterUrl = null
          } else {vm.twitterUrl = doc.data().twitter_url}
          // Youtube
          if (!doc.data().youtube_url) { 
              vm.youtubeUrl = null
          } else {vm.youtubeUrl = doc.data().youtube_url}
          // Website
          if (!doc.data().website_url) { 
              vm.websiteUrl = null
          } else {vm.websiteUrl = doc.data().website_url}
          // Data joined
          if (!doc.data().joined) { 
              vm.userJoined = null
          } else {vm.userJoined = doc.data().joined}

        })
      })
    })
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      const db = firebase.firestore()
      db.collection('users').where('users_id', '==', this.$route.params.users_id).get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          this.users_id = doc.data.users_id
          this.users_first_name = doc.data().first_name
          this.users_last_name = doc.data().last_name
          this.users_talent = doc.data().talent
          this.users_profile_picture = doc.data().profile_picture
          this.userAddress = doc.data().address 
          this.showAddress = doc.data().show_address
          this.userDob = doc.data().dob
          this.userBio = doc.data().bio
          this.userCity = doc.data().city
          this.priceType = doc.data().price_type 
          this.price = doc.data().price
          // Sets the cover image depending on if it exists
          if (!doc.data().cover_image) { 
            this.users_cover_image = require('../assets/images/portfolioBg.jpeg')
          } else {this.users_cover_image = doc.data().cover_image}
          // Is Live
          if (!doc.data().show_socials) { 
              this.showSocial = false
          } else {this.showSocial = doc.data().show_socials}
          // Facebook
          if (!doc.data().facebook_url) { 
              this.facebookUrl = null
          } else {this.facebookUrl = doc.data().facebook_url}
          // Instagram
          if (!doc.data().instagram_url) { 
              this.instagramUrl = null
          } else {this.instagramUrl = doc.data().instagram_url}
          // Twitter
          if (!doc.data().twitter_url) { 
              this.twitterUrl = null
          } else {this.twitterUrl = doc.data().twitter_url}
          // Youtube
          if (!doc.data().youtube_url) { 
              this.youtubeUrl = null
          } else {this.youtubeUrl = doc.data().youtube_url}
          // Website
          if (!doc.data().website_url) { 
              this.websiteUrl = null
          } else {this.websiteUrl = doc.data().website_url}
          // Data joined
          if (!doc.data().joined) { 
              this.userJoined = null
          } else {this.userJoined = doc.data().joined}

        })
      })

      //Force refreshes the component when browsing between portfolio pages.
      this.forceRerender()

    },
    forceRerender() {
      this.componentKey += 1;  
      //Get page url
      this.pageCopyUrl = document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : document.location.href
    },
    loadTimeline() {
      this.currentComponent = 'Timeline'
      this.slideActive = 'margin-left: 0;'
      
      if (this.$route.params.page_content != 'timeline') {
        this.$router.replace({ path: `/portfolio/timeline/` + this.page_id })
      }
    },
    loadWork() {
      this.currentComponent = 'Work'
      this.slideActive = 'margin-left: 25%;'
      if (this.$route.params.page_content != 'work') {
        this.$router.replace({ path: `/portfolio/work/` + this.page_id })
      }
    }, 
    loadAbout() {
      this.currentComponent = 'About'
      this.slideActive = 'margin-left: 50%;'
      if (this.$route.params.page_content != 'about') {
        this.$router.replace({ path: `/portfolio/about/` + this.page_id })
      }
    }, 
    loadPhotos() {
      this.currentComponent = 'Gallery'
      this.slideActive = 'margin-left: 75%;'
      if (this.$route.params.page_content != 'gallery') {
        this.$router.replace({ path: `/portfolio/gallery/` + this.page_id })
      }
    },
    shareProfile() {
      const url = document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : document.location.href;
      if (navigator.share) {
        navigator.share({
          title: this.users_first_name + this.users_last_name + "'s Portfolio",
          url: url
        }).then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
      } else {
        // fallback
        var copyText = document.getElementById("pageUrlInput")
        copyText.select()
        copyText.setSelectionRange(0, 99999)
        document.execCommand("copy")

      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .profileMainDataContaienr {
    height: 350px;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
  }
  .profilePhotoWrapper {
    position: relative;
    z-index: 20;
    width: 100%;
    max-width: 1450px;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .usersProfilePhoto {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 50%;
    background-color: #BEBBBB;
    z-index: 20;
    position: relative;
  }
  .usersInfoWrapper {
    padding: 20px 50px 15px 40px;
    background-color: rgba(0, 0, 0, 0.6);
    margin-left: -30px;
    border-radius: 0px 50px 50px 0px;
    z-index: 10;
    position: relative;
  }
  .titleP {
    font-weight: bold;
    font-size: 20px;
    padding: 0;
    margin: 0;
    color: #FFF;
  }
  .subP {
    font-weight: normal;
    font-size: 16px;
  }
  .usersCoverPhoto {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    height: 350px;
    width: 100%;
    object-fit: cover;
    background-color: #D1D1D1;
  }
  .priceIndicator {
    max-width: 60px;
    padding: 5px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    border-radius: 20px;
    background-color: #EE372E;
    border: none;
    display: flex;
    margin-top: 10px;
  }
  .priceIndicator p {
    margin: 0;
    padding: 0;
  }
  .free {
    background-color: #4ED964;
  }
  .mobilePriceIndicator {
    position: absolute;
    top: 10px;
    right: 20px;
    padding: 0 20px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    border-radius: 20px;
    background-color: #EE372E;
    border: none;
    display: flex;
    z-index: 600;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1); 
  }
  .mobilePriceIndicator p {
    margin: 0;
    padding: 0;
    font-size: 18px;
  }
  .free {
    background-color: #4ED964;
  }

  /* Page navbar */
  .portfolioNavAbsolute {
    width: 100%;
    height: 50px;


    display: flex;
    justify-content: center;
    z-index: 80;
    position: absolute;
    bottom: -25px;
    left: 0;
  }
  .portfolioNavAbsoluteInner {
    width: 100%;
    height: 50px;
    max-width: 1450px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .dyanamicContentNavContainer {
    padding-left: 5px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
  }
  .dyanamicContentNavWrapper { 
    width: 70%;
    height: 100%;
    background-color: #FFF;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
  }
  .dyanamicContentNavWrapper ul {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }
  .dynamicNavCol {
    width: 25%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .dynamicNavCol p {
    margin: 0;
    padding: 0;
  }
  .dynamicNavCol .fas {
    padding-right: 10px;
    font-size: 16px;
  }
  .oneNav:hover ~ hr {
     margin-left: 0 !important;
  }
  .twoNav:hover ~ hr {
     margin-left: 25% !important;
  }
  .threeNav:hover ~ hr {
    margin-left: 50% !important;
  }
  .fourNav:hover ~ hr {
    margin-left: 75% !important;
  }

  hr {
    position: absolute;
    bottom: 0;
    height: 4px;
    width: 25%;
    margin: 0;
    background: #2E85E8;
    border: none;
    transition: .3s ease-in-out;
    pointer-events: none;
  }

  /* Portfolio Page Content */
  .portfolioPageWrapper {
    width: 100%;
    max-width: 1450px;
    margin-left: auto;
    margin-right: auto;
    padding: 10px 20px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
  }

  .portfolioIntroContainer {
    width: 30%;
    padding-right: 5px;
    box-sizing: border-box
  }
  .portfolioIntroWrapper {
    width: 100%;
    background-color: #FFF;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
  }
  .sharePortfolioBtn {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: #FFF;
    position: absolute;
    border: none;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0;
    z-index: 600;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1); 
    transition: 0.3s;
  }
  .sharePortfolioBtn .fas {
    color: #2C2C2C;
    font-size: 12px;
  }
  .sharePortfolioBtn:hover {
    background-color: #F5F5F5;
  }
  .desktopSharePortBtn {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    background-color: #2E85E8;
    position: absolute;
    border: none;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0;
    z-index: 600;
    transition: 0.3s;
  }
  .desktopSharePortBtn:hover {
    background-color: #2A74C8;
  }
  .desktopSharePortBtn .fas {
    color: #FFF;
    font-size: 12px;
  }
  
  .usersNameP { 
    margin: 0;
    padding: 0 0 15px;
    font-size: 18px;
    font-weight: bold;
  }
  .talentTagWrapper {
    padding: 5px 0 10px;
    background-color: transparent;
  }
  .portfolioTitleTags {
    padding: 5px 0 0;
  }
  .talentTags {
    height: auto;
    border: none;
  }
  .bioP {
    margin: 0;
    padding: 0;
    font-size: 16px;
  }

  .usersAddressP {
    margin: 0;
    padding: 5px 0 0px;
    font-size: 14px;

  }
  .portfolioIntoBtns {
    padding: 7px 20px;
    width: 80%;
    border: none;
    border-radius: 20px;
    background-color: #2E85E8;
    color: #FFF;
    font-size: 16px;
    margin-bottom: 10px;
    transition: 0.3s;
    cursor: pointer;
    margin-left: 10%;
    margin-right: auto;

  }
  .portfolioIntoBtns:hover {
    background-color: #2A74C8;
  }
  /* Account info */
  .portfolioAccountInfoWrapper {
    width: 100%;
    padding: 10px 0 7px;
    box-sizing: border-box;
    position: relative;
  }
  .portfolioAccountInfoWrapper ul {
    margin: 0;
    padding: 0;
  }
  .portfolioAccountInfoWrapper ul li {
    list-style-type: none;
    color: #252525;
    font-size: 16px;
    padding: 2px 0;
    display: flex;
    align-items: center;
  }
  .portfolioAccountInfoWrapper ul li p {
    margin: 0;
    padding: 0;
  }
  .portfolioAccountInfoWrapper ul li .fas {
    font-size: 14px;
    color: #2E85E8;
    margin-right: 10px;
    width: 20px;
  }
  /* Social */
  .portfolioSocialWrapper {
    width: 100%;
    background-color: #FFF;
    border-radius: 10px;
    padding: 5px 10px;
    box-sizing: border-box;
    position: relative;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
    margin-top: 10px;
  }
  .portfolioSocialWrapper ul {
    margin: 0;
    padding: 0;
  }
  .portfolioSocialWrapper ul li {
    list-style-type: none;
  }
  .lastSocialLi {
    border-bottom: none !important;
  }
  .portfolioSocialWrapper ul li a {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 5px 0;
    box-sizing: border-box;
    text-decoration: none;
    color: #1B1B1B;
  }
  .darkmode--activated .portfolioSocialWrapper ul li a {
    color: #FFF;
  }
  .portfolioSocialWrapper ul li a img {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }


  .portfolioDynamicContentContainer {
    width: 70%;
    padding-left: 5px;
    padding-top: 25px;
    box-sizing: border-box;
  }
  .portfolioDynamicContentWrapper {
    width: 100%;
  }
  


  /* Page Media Queries */
  @media only screen and (max-width: 850px) {
    .portfolioPageWrapper {padding: 10px;}
    /*Portfolio Banner*/
    .profilePhotoWrapper {justify-content: center;}
    .usersProfilePhoto {margin-bottom: 30px;}
    .usersInfoWrapper {display: none;}
    .profileMainDataContaienr {height: 300px;}
    .usersCoverPhoto {height: 300px;}
    /*Portfolio Content*/
    .portfolioIntroContainer {width: 100%; padding: 20px 0 0;}
    .portfolioIntroWrapper {border-top-left-radius: 0; border-top-right-radius: 0;}
    .portfolioDynamicContentContainer {width: 100%; padding: 10px 0 0;}
    .portfolioNavAbsolute {height: 60px; bottom: -30px}
    .portfolioNavAbsoluteInner {padding: 0 10px; height: 60px;}
    .dyanamicContentNavContainer {padding: 0;}
    .dyanamicContentNavWrapper {width: 100%; border-bottom-left-radius: 0; border-bottom-right-radius: 0; box-shadow: none}
    .dynamicNavCol {display: flex; flex-direction: column; font-size: 14px;}
    .dynamicNavCol .fas {padding: 0 0 5px; font-size: 14px;}
    /* Portfolio User Info Area */
    .usersNameP {text-align: center; font-size: 20px;}
    .usersTalentP {text-align: center} 
    .usersAddressP {text-align: center}

    .talentTags {display: flex;justify-content: center;}
    .bioP {text-align: center; padding: 0 10px;}
    .portfolioAccountInfoWrapper {display: none;}
    .hideMobile {display: none;}

    .sharePortfolioBtn {
      left: 10px;
      right: auto;
    }
    .usersNameP {padding: 0;}
    .desktopSharePortBtn {display: none;}
    .mobilePriceIndicator {right: 10px; height: 40px; }
    .mobilePriceIndicator p {font-size: 16px;}
  }

  @media only screen and (min-width: 850.1px) {
    .usersAddressP {display: none;}

    .talentTagWrapper {display: none;}
    .mobileShareBtn {display: none;}
  }
  @media only screen and (max-width: 400px) { 
    .dynamicNavCol {font-size: 12px;}
    .dynamicNavCol .fas {font-size: 12px;}
  }

</style>
