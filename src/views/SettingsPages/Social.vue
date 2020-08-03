<template>
    <div id="social">
        <div class="socialSettingsContainer">

            <!-- Show Social Media Links Setting -->
            <div class="socialRow">
                <div class="socialRowWrapper">
                    <h4 class="rowTitle">Social Media Links</h4>
                    <p class="rowP">Choose whether you would like to display you social media links on you profile.</p>
                    <div class="goLiveToggleBtnWrapper">
                        <button v-on:click="showSocials" id="settingsGoLiveBtn" class="toggleLiveBtn" v-bind:class="{ liveIndicatorSettings: showSocial }"><span id="btnLiveIndicator" class="btnIndicator" v-bind:class="{ liveIndicatorSettings: showSocial }"></span></button>
                        <p class="rowP">{{ showSocialStatus }}</p>
                    </div>
                </div>
            </div>

            <!-- Facebook Setting -->
            <div class="socialRow">
                <div class="socialRowWrapper">
                    <h4 class="rowTitle">Facebook</h4>
                    <input v-model="facebookUrl" class="socialInput" type="text" placeholder="URL">
                </div>
            </div>

            <!-- Instagram Setting -->
            <div class="socialRow">
                <div class="socialRowWrapper">
                    <h4 class="rowTitle">Instagram</h4>
                    <input v-model="instagramUrl" class="socialInput" type="text" placeholder="URL">
                </div>
            </div>

            <!-- Twitter Setting -->
            <div class="socialRow">
                <div class="socialRowWrapper">
                    <h4 class="rowTitle">Twitter</h4>
                    <input v-model="twitterUrl" class="socialInput" type="text" placeholder="URL">
                </div>
            </div>

            <!-- Youtube Setting -->
            <div class="socialRow">
                <div class="socialRowWrapper">
                    <h4 class="rowTitle">Youtube</h4>
                    <input v-model="youtubeUrl" class="socialInput" type="text" placeholder="URL">
                </div>
            </div>

            <!-- Website Setting -->
            <div class="socialRow">
                <div class="socialRowWrapper">
                    <h4 class="rowTitle">Website</h4>
                    <input v-model="websiteUrl" class="socialInput" type="text" placeholder="URL">
                </div>
            </div>

            <!-- Save Settings -->
            <div class="socialRow">
                <div class="socialRowWrapper">
                    <button v-on:click="saveSettings" class="settingsSaveBtn">save</button>
                </div>
            </div>
    
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import NProgress from 'nprogress'
import '../../../node_modules/nprogress/nprogress.css'

export default {
    name: 'social',
    data() {
        return {
            usersId: null,
            showSocial: false,
            showSocialStatus: '',

            facebookUrl: null,
            instagramUrl: null,
            twitterUrl: null,
            youtubeUrl: null,
            websiteUrl: null,

        };
    },
    created () {
        if (firebase.auth().currentUser) {
            this.usersId = firebase.auth().currentUser.uid
        }
    },
    beforeRouteEnter(to, from, next) {
        var userId = firebase.auth().currentUser.uid
        const db = firebase.firestore()
        db.collection('users').where('users_id', '==', userId).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                next(vm => {
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
                })
            })
        })
    },
    watch: {
        '$route': 'fetchData'
    },
    mounted() {

    },
    methods: {
        //Fetches user data for settings page before route enter
        fetchData() { 
            const db = firebase.firestore()
            db.collection('users').where('users_id', '==', this.usersId).get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
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
                })

            })
        },
        showSocials() {
            if (this.showSocial === false || this.showSocial === undefined ) {
                this.showSocial = true
                this.showSocialStatus = 'Socials Visible'
            } else if (this.showSocial === true) {
                this.showSocial = false
                this.showSocialStatus = 'Socials Hidden'
            }
        },
        saveSettings() {
            NProgress.start()
            const db = firebase.firestore()
            return db.collection('users').doc(this.usersId).update({
                show_socials: this.showSocial,
                facebook_url: this.facebookUrl,
                instagram_url: this.instagramUrl,
                twitter_url: this.twitterUrl,
                youtube_url: this.youtubeUrl,
                website_url: this.websiteUrl

            }).then (() => {
                    NProgress.done()
                    this.$router.go({ path: this.$router.path })
                });
        }
    }
}
</script>

<style scoped>
.socialSettingsContainer {
    width: 100%;
    padding: 20px 20px 10px;
    box-sizing: border-box;
}
.socialRow {
    padding: 20px;
    box-sizing: border-box;
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
}
.socialRowWrapper {
    width: 100%;
    max-width: 800px;
}
.rowTitle {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    padding:  0 0 10px;
}
.rowP {
    margin: 0;
    padding: 0;
}
/* Toggle Button */
.goLiveToggleBtnWrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 10px;
}
.goLiveToggleBtnWrapper p {
    margin-left: 10px;
    color: #4F4F4F;
}
.toggleLiveBtn {
    height: 20px;
    border: none;
    border-radius: 10px;
    width: 50px;
    background-color: #EE372E;
    position: relative;
    cursor: pointer;
    transition: 0.3s;
}
.btnIndicator {
    height: 14px;
    width: 14px;
    background-color: #FFF;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    right: 33px;
    filter: drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.05));
    transition: 0.3s;
}
#settingsGoLiveBtn.liveIndicatorSettings {
    background-color: #4ED964;
}
.toggleLiveBtn:hover .btnIndicator {
    background-color: #ECECEC;
}
#btnLiveIndicator.liveIndicatorSettings {
    right: 4px;
}


.socialInput {
    width: 100%;
    height: 35px;
    padding: 0 10px;
    box-sizing: border-box;
    background-color: #F7F7F7;
    border: 1px solid #F7F7F7;
    border-radius: 5px;
    font-size: 16px;
}

.settingsSaveBtn {
    margin: 0;
    padding: 5px 40px;
    border: 2px solid transparent;
    background-color: #4ED964;
    border-radius: 20px;
    color: #FFF;
    cursor: pointer;
    transition: 0.3s;
    font-size: 16px;
}
.settingsSaveBtn:hover {
    background-color: #49C25C;
}

@media only screen and (max-width: 1024px) {
    .socialSettingsContainer {padding: 10px;}
    .settingsSaveBtn {width: 100%; }
}
</style>
