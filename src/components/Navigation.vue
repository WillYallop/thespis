<template>
 <div class="navigationContainer siteNav">
    <div class="navigationWrapper" data-simplebar>
        <div class="navigationTopHalf">
            <div class="userIdentityWrapper">
                <img :src="imageUrl" alt="">
            </div>
                <nav class="siteNavigation">
                    <ul>
                        <li v-if="!isLoggedIn" v-on:click="navToggle">
                            <router-link to="/">
                                <div>
                                    <button class="desktopNavBtn"><font-awesome-icon class="fas" icon="home" /></button>
                                    Home
                                </div>
                                <button class="mobileNavBtn"><font-awesome-icon class="fas" icon="chevron-right" /></button>
                            </router-link>
                        </li>
                        <li v-if="isLoggedIn" v-on:click="navToggle">
                            <router-link v-bind:to="{ name: 'Portfolio', params: { page_content: 'timeline', users_id: currentUsersId }}">
                                <div>
                                    <button class="desktopNavBtn"><font-awesome-icon class="fas" icon="user" /></button>
                                    Portfolio
                                </div>
                                <button class="mobileNavBtn"><font-awesome-icon class="fas" icon="chevron-right" /></button>
                            </router-link>
                        </li>
                        <li v-on:click="navToggle">
                            <router-link to="/talent">
                                <div>
                                    <button class="desktopNavBtn"><font-awesome-icon class="fas" icon="star" /></button>
                                    Talent
                                </div>
                                <button class="mobileNavBtn"><font-awesome-icon class="fas" icon="chevron-right" /></button>
                            </router-link>
                        </li>
                        <li v-on:click="navToggle">
                            <router-link to="/jobs">
                                <div>
                                    <button class="desktopNavBtn"><font-awesome-icon class="fas" icon="briefcase" /></button>
                                    Jobs
                                </div>
                                <button class="mobileNavBtn"><font-awesome-icon class="fas" icon="chevron-right" /></button>
                            </router-link>
                        </li>
                        <li v-if="isLoggedIn" v-on:click="showSettings">
                            <div class="settingsLi">
                                <div>
                                    <button class="desktopNavBtn"><font-awesome-icon class="fas" icon="cog" /></button>
                                    Settings
                                </div>
                            </div>
                        </li>
                        <li v-if="isLoggedIn" v-on:click="navToggle" class="settingsDropdown">
                            <div class="settingsDropdownWrapper">
                                <router-link to="/portfolio-settings" class="settingsDropdownLink">
                                    <div>
                                        <button class="desktopNavBtn"><font-awesome-icon class="fas" icon="user-cog" /></button>
                                        Portfolio Settings
                                    </div>
                                    <button class="mobileNavBtn"><font-awesome-icon class="fas" icon="chevron-right" /></button>
                                </router-link>
                                <router-link to="/social-settings" class="settingsDropdownLink">
                                    <div>
                                        <button class="desktopNavBtn"><font-awesome-icon class="fas" icon="hashtag" /></button>
                                        Social Settings
                                    </div>
                                    <button class="mobileNavBtn"><font-awesome-icon class="fas" icon="chevron-right" /></button>
                                </router-link>
                                <router-link to="/account-settings" class="settingsDropdownLink">
                                    <div>
                                        <button class="desktopNavBtn"><font-awesome-icon class="fas" icon="cogs" /></button>
                                        Account Settings
                                    </div>
                                    <button class="mobileNavBtn"><font-awesome-icon class="fas" icon="chevron-right" /></button>
                                </router-link>
                            </div>
                        </li>
                    </ul>
                </nav>
        </div>
        <div class="navigationBottomHalf">
            <router-link to="/signin"><button v-if="!isLoggedIn" v-on:click="navToggle" class="actionBtn">Sign in</button></router-link>
            <router-link to="/signup"><button v-if="!isLoggedIn" v-on:click="navToggle" class="actionBtn">Sign up</button></router-link>
            <button v-if="isLoggedIn" v-on:click="signout" class="actionBtn">Sign out</button>
        </div>
    </div>
 </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default {
    name: 'navigation',
    data: function() {
    return {
            isLoggedIn: false,
            imageUrl: null,
            currentUsersId: null
        }
    },
    created() {
        //Authenticate user and sets nav links
        if(firebase.auth().currentUser) {
            this.isLoggedIn = true
            this.currentUsersId = firebase.auth().currentUser.uid
        }

        if (firebase.auth().currentUser !== null) {
        //gets users data
        const db = firebase.firestore()
        const usersId = this.currentUsersId

        let profilePicture = db.collection('users').doc(usersId)
        profilePicture.get()
            .then(doc => {
                //Runs the same fetch of data through both so each call (profile picture, or cover image) can display different results
                if (profilePicture.exists) {
                    if (!doc.data().profile_picture) {
                        this.imageUrl = require('../assets/images/profilePicturePlaceholder.png')
                    } else {
                        this.imageUrl = doc.data().profile_picture
                    }
                } else {
                    if (!doc.data().profile_picture) {
                        this.imageUrl = require('../assets/images/profilePicturePlaceholder.png')
                    } else {
                        this.imageUrl = doc.data().profile_picture
                    }
                }
            })
            .catch(err => {
            console.log('Error getting document', err);
            })
        } else {
        this.imageUrl = require('../assets/images/profilePicturePlaceholder.png')
        }

    },
    methods: {
    navToggle: function() {
        //Toggle navigation
        [].map.call(document.querySelectorAll('.siteNav'), function(el) {
            el.classList.toggle('showNavbar');
        });
        //Toggle page
        [].map.call(document.querySelectorAll('.movePage'), function(el) {
            el.classList.toggle('animatePage');
        });
        //Toggle Hamburger
        [].map.call(document.querySelectorAll('.hamburger'), function(el) {
            el.classList.toggle('is-active');
        });
    },
    signout: function(e) {
        firebase.auth().signOut().then(() => {
            this.$router.go({ path: this.$router.path })
        })

       e.preventDefault();
    },
    showSettings: function() {
        [].map.call(document.querySelectorAll('.settingsDropdownWrapper'), function(el) {
            el.classList.toggle('showSettings');
        });  
        [].map.call(document.querySelectorAll('.settingsLi'), function(el) {
            el.classList.toggle('activeSetting');
        });  
        [].map.call(document.querySelectorAll('.navigationBottomHalf'), function(el) {
            el.classList.toggle('marginAdjust');
        });  
        
    } 

  }

}
</script>

<style scoped>
.navigationContainer {
    position: fixed;
    left: 0;
    top: 50px;
    bottom: 0;
    width: 250px;
    background-color: #303841;
    transition: right 0.3s;
    box-shadow: 3px 0px 6px rgba(0, 0, 0, 0.05);
    z-index: 1900;
}
.navigationWrapper {
    height: 100%;
}
.navigationTopHalf {
    width: 100%;
    align-self: flex-start;
}
.userIdentityWrapper {
    width: 100%;
    height: 150px;
    background: #242A31;
    display: flex;
    justify-content: center;
    align-items: center;
}
.userIdentityWrapper img {
    height: 110px;
    width: 110px;
    border-radius: 50%;
    object-fit: cover;
}

.navigationBottomHalf {
    padding: 10px 20px 20px;
    width: 100%;
    box-sizing: border-box;
    align-self: flex-end;
    transition: margin 0.3s;
}
.marginAdjust {
    margin-top: 115.86px;
}
.navigationBottomHalf button:last-child {
    margin-top: 10px;
}
.navigationBottomHalf button {
    width: 100%;
}

/* Nav Link Styling */
.siteNavigation ul {
    margin: 0;
    padding: 0;
}
.siteNavigation ul li {
    margin: 0;
    padding: 0;
    list-style-type: none;
    width: 100%;
}
.settingsLi {
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    text-decoration: none;
    color: #FFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: none;
    background-color: #303841;
    cursor: pointer;
    z-index: 20;
    position: relative;
    user-select: none;
    transition: 0.3s;
}
.settingsLi:hover{
    background-color: #3A4750;
}
.activeSetting {
    background-color: #3A4750;
    border-bottom: none;
}
.siteNavigation ul li a {
    display: block;
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    text-decoration: none;
    color: #FFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #2F363E;
    background-color: #303841;
    z-index: 20;
    position: relative;
    transition: 0.3s;
}
.siteNavigation ul li a:hover{
    background-color: #3A4750;
}
.settingsDropdownLink {
    background-color: #3A4750;
}
.desktopNavBtn {
    background: transparent;
    padding: 0;
    border: none;
    padding-right: 10px;
    width: 25px;
}
.desktopNavBtn .fas {
    color: #2E85E8;
    font-size: 16px;
}
.mobileNavBtn {
    background: transparent;
    padding: 0;
    border: none;
}
.mobileNavBtn .fas {
    color: #D5D5D5;
    font-size: 16px;
}

.settingsDropdown {
    position: relative;
}
.settingsDropdownWrapper {
    position: absolute;
    top: -115.86px;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: #425059;
    transition: top 0.3s;
}
.settingsDropdownWrapper a {
    cursor: pointer;
    background-color: #425059 !important;
    border-bottom: none !important;
    transition: 0.3s;
}
.settingsDropdownWrapper a:hover {
    background-color: #3A4750 !important;
}
.showSettings {
    top: 0;
}

@media only screen and (max-width: 1024px) {
    .navigationContainer {
        right: -250px;
        left: auto;
    }
    /* Toggle Nav */
    .showNavbar {
        right: 0;
        box-shadow: -3px 0px 6px rgba(0, 0, 0, 0.05);
    }
}
</style>
