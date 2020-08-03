<template>
    <div id="about">

        <div class="aboutUserRowContainer">
            <h4 v-if="userDob">DOB</h4>
            <p v-if="userDob">{{userDob}}</p>
            <h4 v-if="userJoined">Joined</h4>
            <p v-if="userJoined">{{userJoined}}</p>
            <h4 v-if="userCity && userAddress">Address</h4>
            <p v-if="userCity && !showAddress">{{userCity}}</p>
            <p v-if="showAddress">{{userAddress}}</p>
        </div>

        <!-- user social info -->
        <div v-if="showSocial" class="portfolioSocialWrapper">
          <ul>
            <li v-if="facebookUrl"><a :href="facebookUrl" target="_blank"><img src="../../assets/images/facebookIcon.png"> Facebook</a></li>
            <li v-if="instagramUrl"><a :href="instagramUrl" target="_blank"><img src="../../assets/images/instagramIcon.png"> Instagram</a></li>
            <li v-if="twitterUrl"><a :href="twitterUrl" target="_blank"><img src="../../assets/images/twiiterIcon.jpg"> Twitter</a></li>
            <li v-if="youtubeUrl"><a :href="youtubeUrl" target="_blank"><img src="../../assets/images/youtubeIcon.png"> Youtube</a></li>
            <li v-if="websiteUrl" class="lastSocialLi"><a :href="websiteUrl" target="_blank"><img src="../../assets/images/websiteIcon.png"> Website</a></li>
          </ul>
        </div>

    </div>
</template>

<script>
export default {
    name: 'about',
      components: {

    }, 
    props: {
        userAddress: {type: String},
        showAddress: {type: Boolean},
        userCity: {type: String},
        userDob: {type: String},
        userJoined: {type: String},
        showSocial: {type: Boolean}, 
        facebookUrl: {type: String}, 
        instagramUrl: {type: String}, 
        twitterUrl: {type: String}, 
        youtubeUrl: {type: String}, 
        websiteUrl: {type: String},
    },
    data () {
        return {


        }
    },
    created () {

      
    },
    methods: {


    }
}
</script>

<style scoped>
.aboutUserRowContainer {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    background-color: #FFF;
    border-radius: 10px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 10px;
    padding: 10px;
}
.aboutUserRowContainer h4 {
    margin: 0;
    padding: 0 0 5px;
    font-size: 16px;
    font-weight: bold;
}
.aboutUserRowContainer p {
    margin: 0;
    padding: 0 0 10px;
    font-size: 16px;
}
.aboutUserRowContainer p:last-child {
    padding: 0;
}

.portfolioSocialWrapper {
    width: 100%;
    margin-top: 10px;
    background-color: #FFF;
    border-radius: 10px;
    padding: 0;
    box-sizing: border-box;
    position: relative;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
}
.portfolioSocialWrapper ul {
    margin: 0;
    padding: 0;
}
.portfolioSocialWrapper ul li {
    list-style-type: none;
    border-bottom: 1px solid #E9E9E9;
}

.lastSocialLi {
    border-bottom: none !important;
}
.portfolioSocialWrapper ul li a {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    text-decoration: none;
    color: #1B1B1B;
}
.portfolioSocialWrapper ul li a img {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
}

</style>