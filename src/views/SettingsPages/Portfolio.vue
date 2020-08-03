<template>
    <div id="portfolioSettings">
        <div class="portfolioSettingsContainer">
            <!-- Go Live Setting -->
            <div class="settingsRowContainer">
                <div class="settingsRowWrapper">
                    <h4 class="rowTitle">Go Live</h4>
                    <p class="rowP">Making your portfolio live means you will appear in users search results when browsing the talent page.</p>
                    <div class="goLiveToggleBtnWrapper">
                        <button v-on:click="goLive" id="settingsGoLiveBtn" class="toggleLiveBtn" v-bind:class="{ liveIndicatorSettings: isLive }"><span id="btnLiveIndicator" class="btnIndicator" v-bind:class="{ liveIndicatorSettings: isLive }"></span></button>
                        <p class="rowP">{{ goLiveStatus }}</p>
                    </div>
                </div>
            </div>

            <!-- Profile Picture Setting -->
            <div class="settingsRowContainer">
                <div class="settingsRowWrapper">
                    <h4 class="rowTitle">Profile Photo</h4>
                    <div class="flexProfileWrapper">
                        <div class="profilePictureImageWrapper">
                            <div class="profilePicturePreviewWrapper">
                                <img class="profilePicturePreview" :src="imageUrl" >
                            </div>
                            <div class="profilePictureOverlayContainer">
                                <div @click="pickProfile" class="profilePictureOverlay">
                                    <font-awesome-icon class="fas" icon="arrow-circle-up" />
                                </div>
                            </div>
                        </div>
                        <div class="profilePictureTextBtnContainer">
                            <div class="profilePictureTextBtnWrapper">
                                <div class="profilePictureBtnContainer profilePictureBtnContainerPaddingEdit">
                                    <input type="file" style="display: none;" ref="profilePictureInput" accept="image/*" @change="onProfilePicked" >
                                    <button @click="pickProfile" class="settingsUploadBtn">upload</button>
                                </div>
                                <p class="profilePicP">make sure your profile picture is either a PNG, JPG, JPEG and no larger than 3MB.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cover Picture Setting -->
            <div class="settingsRowContainer">
                <div class="settingsRowWrapper">
                    <h4 class="rowTitle">Cover Image</h4>
                    <div class="coverImagePreview">
                        <img class="coverImagePreviewImage" :src="coverImageUrl">
                        <div @click="pickCover" class="coverImagePreviewOverlay">
                            <font-awesome-icon class="fas" icon="arrow-circle-up" />
                        </div>
                    </div>
                    <div class="profilePictureBtnContainer">
                        <input type="file" style="display: none;" ref="coverImageInput" accept="image/*" @change="onCoverPicked" >
                        <button @click="pickCover" class="settingsUploadBtn">upload</button>
                    </div>
                    <p class="rowP">make sure your cover image is either a PNG, JPG, JPEG and no larger than 3MB.</p>
                </div>
            </div>

            <!-- Bio Setting -->
            <div class="settingsRowContainer">
                <div class="settingsRowWrapper">
                    <h4 class="rowTitle">Bio</h4>
                    <textarea v-model="bioText" placeholder="Bio.."></textarea>
                </div>
            </div>

            <!-- Address Setting -->
            <div class="settingsRowContainer addressRowContainer">
                <div class="settingsRowWrapperOuter">
                    <div class="settingsRowWrapper">
                        <h4 class="rowTitle">Address</h4>
                        <input v-model="vm.place.formatted_address" v-gmaps-searchbox=vm class="addressField" placeholder="Address..">
                    </div>
                </div>
                <div class="addressSettingsSeperator"></div>
                <div class="settingsRowWrapperOuter">
                    <div class="settingsRowWrapper">
                        <div class="settingRowInside">  
                            <p class="addressP">Select if you would like your address to be visible on your portfolio for other users to see.</p>
                            <div class="goLiveToggleBtnWrapper">
                                <button v-on:click="showAddressBtn" id="settingsGoLiveBtn" class="toggleLiveBtn" v-bind:class="{ liveIndicatorSettings: showAddress }"><span id="btnLiveIndicator" class="btnIndicator" v-bind:class="{ liveIndicatorSettings: showAddress }"></span></button>
                                <p class="rowP">{{ showAddressStatus }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Talent Setting -->
            <div class="settingsRowContainer">
                <div class="settingsRowWrapper">
                    <h4 class="rowTitle">Talent</h4>
                    <p class="talentP">Add up to 3 Talents that you want to advertise!</p>
                    <InputTag placeholder="Add Talent" v-model="talentTags" :limit='3' :allow-duplicates="false"	 class="talentField"></InputTag>
                </div>
            </div>
        
            <div class="settingsRowContainer">
                <div class="settingsRowWrapper">
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
import 'firebase/storage';
import NProgress from 'nprogress'
import '../../../node_modules/nprogress/nprogress.css'
import InputTag from 'vue-input-tag'
import imageCompression from 'browser-image-compression';
import placeHolderProfilePic from '../../assets/images/profilePicturePlaceholder.png'
import placeHolderCoverPic from '../../assets/images/coverImagePlaceholder.png'

export default {
    name: 'portfolioSettings',
    components: {
       InputTag
    },
    data() {
        return {
            isLive: false,
            goLiveStatus: '',
            showAddress: false,
            showAddressStatus: '',
            imageUrl: null,
            placeholderProfileImg: placeHolderProfilePic,
            coverImageUrl: null,
            placeholderCoverImg: placeHolderCoverPic,
            bioText: '',
            usersId: null,
            talentTags: [],
            tempCity: null,
            city: null,
            
            vm: {
                place: {
                    formatted_address: '',
                    address_components: '',
                }
            },


        }
    },
    beforeRouteEnter(to, from, next) {
        var userId = firebase.auth().currentUser.uid
        const db = firebase.firestore()
        db.collection('users').where('users_id', '==', userId).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            next(vm => {
                // Is Live
                if (!doc.data().profile_live) { 
                    vm.isLive = false
                } else {vm.isLive = doc.data().profile_live}
                // Cover Image
                if (!doc.data().cover_image) { 
                    vm.coverImageUrl = vm.placeholderCoverImg
                } else {vm.coverImageUrl = doc.data().cover_image}
                // Profile Picture
                if (!doc.data().profile_picture) { 
                    vm.imageUrl = vm.placeholderProfileImg
                } else {vm.imageUrl = doc.data().profile_picture}
                // Bio
                if (!doc.data().bio) { 
                    vm.bioText = null
                } else {vm.bioText = doc.data().bio}
                // Formatted Address
                if (!doc.data().address) { 
                    vm.vm.place.formatted_address = null
                } else {vm.vm.place.formatted_address = doc.data().address}
                // City
                if (!doc.data().city) { 
                    vm.tempCity = null
                } else {vm.tempCity = doc.data().city}
                // Show Address
                if (!doc.data().show_address) { 
                    vm.showAddress = false
                } else {vm.showAddress = doc.data().show_address}
                // Talent Tags
                if (!doc.data().talent) { 
                    vm.talentTags = []
                } else {vm.talentTags = doc.data().talent}

            })
        })
        })
    },
    watch: {
        '$route': 'fetchData'
    },
    created () {
        if (firebase.auth().currentUser) {
            this.usersId = firebase.auth().currentUser.uid
        }
    },
    methods: {
        //Fetches user data for settings page before route enter
        fetchData() { 
            const db = firebase.firestore()
            db.collection('users').where('users_id', '==', this.usersId).get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    // Is Live
                    if (!doc.data().profile_live) { 
                        this.isLive = false
                    } else {this.isLive = doc.data().profile_live}
                    // Cover Image
                    if (!doc.data().cover_image) { 
                        this.coverImageUrl = this.placeholderCoverImg
                    } else {this.coverImageUrl = doc.data().cover_image}
                    // Profile Picture
                    if (!doc.data().profile_picture) { 
                        this.imageUrl = this.placeholderProfileImg
                    } else {this.imageUrl = doc.data().profile_picture}
                    // Bio
                    if (!doc.data().bio) { 
                        this.bioText = null
                    } else {this.bioText = doc.data().bio}
                    // Formatted Address
                    if (!doc.data().address) { 
                        this.vm.place.formatted_address = null
                    } else {this.vm.place.formatted_address = doc.data().address}
                    // City
                    if (!doc.data().city) { 
                        this.tempCity = null
                    } else {this.tempCity = doc.data().city}
                    // Show Address
                    if (!doc.data().show_address) { 
                        this.showAddress = false
                    } else {this.showAddress = doc.data().show_address}
                    // Talent Tags
                    if (!doc.data().talent) { 
                        this.talentTags = []
                    } else {this.talentTags = doc.data().talent}

                })

            })
        },
        //Go live 
        goLive() {
            if (this.isLive === false || this.isLive === undefined ) {
                this.isLive = true
                this.goLiveStatus = 'Profile Visible'
            } else if (this.isLive === true) {
                this.isLive = false
                this.goLiveStatus = 'Profile Hidden'
            }
        },
        //Profile Picture upload methods 
        pickProfile() {
            this.$refs.profilePictureInput.click();
        },
        onProfilePicked() {
            NProgress.start()
            var imageFile = event.target.files[0];
            const fileName = imageFile.name
            const ext = fileName.slice(fileName.lastIndexOf('.'))

            var options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }
            imageCompression(imageFile, options)
                .then( (compressedFile) => { 

                //upload file to firebase
                //Sets the unique Id for the name
                function uuidv4() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
                this.uniqueId = uuidv4()
                
                //Set the location to store in firebase storage
                var storageRef = firebase.storage().ref('profile_pictures/' + this.usersId + '.' + this.uniqueId + ext)
                //Sets variable to store data
                let uploadTask = storageRef.put(compressedFile)
                //Stores data, handles errors and returns and updates users database with the profile picture url
                uploadTask.on('state_changed', (snapshot) => {

                    this.snapshot = snapshot

                }, (error) => {
                    // Handle unsuccessful uploads
                    this.errorMsg = error
                }, () => {
                    // Handle successful uploads on complete
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        this.imageUrl = downloadURL

                    }).then (() => {
                        NProgress.done()
                    });
                    })

                })
                .catch(function (error) {
                console.log(error.message);
                });
        },
        //Cover photo upload methods
        pickCover() {
            this.$refs.coverImageInput.click();
        },
        onCoverPicked() {
            NProgress.start()
            var imageFile = event.target.files[0];
            const fileName = imageFile.name
            const ext = fileName.slice(fileName.lastIndexOf('.'))

            var options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }
            imageCompression(imageFile, options).then( (compressedFile) => { 
                //upload file to firebase
                //Sets the unique Id for the name
                function uuidv4() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
                this.uniqueId = uuidv4()
                
                //Set the location to store in firebase storage
                var storageRef = firebase.storage().ref('cover_images/' + this.usersId + '.' + this.uniqueId + ext)
                //Sets variable to store data
                let uploadTask = storageRef.put(compressedFile)
                //Stores data, handles errors and returns and updates users database with the profile picture url
                uploadTask.on('state_changed', (snapshot) => {

                    this.snapshot = snapshot

                }, (error) => {
                    // Handle unsuccessful uploads
                    this.errorMsg = error
                }, () => {
                    // Handle successful uploads on complete
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        this.coverImageUrl = downloadURL

                    }).then (() => {
                        NProgress.done() 
                    });
                    })
            })
            .catch(function (error) {
                console.log(error.message);
            });
        },
        //Change show address btn
        showAddressBtn() {
            if (this.showAddress === false || this.showAddress === undefined) {
                this.showAddress = true
                this.showAddressStatus = 'Address Visible'
            } else if (this.showAddress === true) {
                this.showAddress = false
                this.showAddressStatus = 'Address Hidden'
            }
        },
        //Save settings
        saveSettings() {
            NProgress.start()
            const db = firebase.firestore()

            //For City
            //If the user doesnt change their address - upload whatever the current value of city is
            if(this.vm.place.address_components === undefined || this.vm.place.address_components.length == 0){
                this.city = this.tempCity
            } else {
                // If the user has changed their address - upload their new city value
                this.city = this.vm.place.address_components[2].short_name
            }

            return db.collection('users').doc(this.usersId).update({
                profile_live: this.isLive,
                profile_picture: this.imageUrl,
                cover_image: this.coverImageUrl,
                bio: this.bioText,
                address: this.vm.place.formatted_address,
                show_address: this.showAddress,
                talent: this.talentTags,
                city: this.city
            }).then (() => {
                    NProgress.done()
                    this.$router.go({ path: this.$router.path })
                });
        },
    }
}
</script>


<style scoped>
input:focus {outline: none; border: 1px solid #2E85E8 !important;}
textarea:focus {outline: none; border: 1px solid #2E85E8 !important;}

.portfolioSettingsContainer {
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding: 20px 20px 10px;
    box-sizing: border-box;
}
.settingsRowContainer {
    padding: 20px;
    box-sizing: border-box;
    background-color: #FFF;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
}
.settingsRowWrapper {
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

/* Profile Image Settings */
.flexProfileWrapper {
    display: flex;
}
.profilePictureImageWrapper {
    width: 20%;
    height: 170px;
    min-width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}
.profilePicturePreviewWrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.profilePicturePreview {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border-style: none;
    outline:none;
    background-color: #F3F9FF;
    cursor: pointer;
}
.profilePictureOverlayContainer {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.profilePictureOverlay {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    opacity: 0;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.6);
    transition: 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
}
.profilePictureOverlay:hover {
    opacity: 1;
}
.profilePictureOverlay .fas {
    color: #FFF;
    font-size: 20px;
}
.profilePictureTextBtnContainer {
    padding-left: 20px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
.profilePictureTextBtnWrapper {
    display: flex;
    flex-wrap: wrap;
}
.profilePictureBtnContainer {
    padding: 20px 0 10px;
    display: flex;
    flex-wrap: wrap;
}
.profilePictureBtnContainerPaddingEdit {
    padding-top: 0;
}
.settingsUploadBtn {
    margin: 0 10px 0 0;
    padding: 5px 30px;
    border: 2px solid #ECECEC;
    background-color: #F5F5F5;
    border-radius: 20px;
    cursor: pointer;
    transition: 0.3s;
}
.settingsUploadBtn:hover {
    background-color: #E5E5E5;
    border: 2px solid #DDDDDD;
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
.profilePictureTextBtnWrapper p {
    margin: 0;
    padding: 0;
}

/* Cover photo */
.coverImagePreview {
    width: 100%;
    height: 200px;
    background-color: #F3F9FF;
    border-radius: 5px;
    position: relative;
}
.coverImagePreviewOverlay {
    width: 100%;
    height: 200px;
    opacity: 0;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.6);
    transition: 0.3s;
    border-radius: 5px;
    top: 0;
    left: 0;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}
.coverImagePreviewOverlay:hover {
    opacity: 1;
}
.coverImagePreviewOverlay .fas {
    color: #FFF;
    font-size: 20px;
}
.coverImagePreviewImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    border-style: none;
    outline:none;
    background-color: #F3F9FF;
    border: none;
}

/* Bio */
textarea {
    width: 100%;
    height: 200px;
    resize: none;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 5px;
    margin-bottom: 0;
    border: 1px solid #F7F7F7;
    background-color: #F7F7F7;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
}

/* Address */
.addressRowContainer {
    flex-wrap: wrap;
}
.settingsRowWrapperOuter {
    width: 100%;
    display: flex;
    justify-content: center;
}
.addressField {
    width: 100%;
    height: 35px;
    padding: 0 10px;
    box-sizing: border-box;
    background-color: #F7F7F7;
    border: 1px solid #F7F7F7;
    border-radius: 5px;
    font-size: 16px;
}
.addressBtn {
    margin-top: 10px;
}
.addressSettingsSeperator {
    height: 1px;
    width: 100%;
    background-color: #F5F5F5;
    margin: 15px 0;
}
.addressSettingsRow {
    padding: 0 !important;
}
.addressSettingsRow .settingRowInside {
    padding: 20px !important;
}
.addressP {
    padding: 0;
    margin: 0;
}

/* Talent */
.talentP {
    margin: 0 !important;
    padding: 0 0 10px !important;
}
.talentField {
    width: 100%;
    box-sizing: border-box;
    border: none;
    font-size: 16px;
    display: flex;
    align-items: center;
}

/* Btn Area */

@media only screen and (max-width: 1024px) {
    .portfolioSettingsContainer {padding: 10px;}

    /* Profile Picture */
    .flexProfileWrapper {flex-wrap: wrap;}
    .profilePictureImageWrapper {width: 100%;background-color: #F7F7F7;padding: 20px 0; border-radius: 10px;}
    .profilePicturePreviewWrapper {justify-content: center;}
    .profilePictureOverlayContainer {justify-content: center;}
    .profilePictureTextBtnWrapper {padding-top: 20px;}
    .profilePictureTextBtnContainer {padding-left: 0;}
    .profilePicP {width: 100%;}

    /* Btn Area */
    .settingsSaveBtn {width: 100%; }
}
    
</style>