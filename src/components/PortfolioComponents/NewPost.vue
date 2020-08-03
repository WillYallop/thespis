<template>
    <div id="newPost">

        <div v-on:keyup.enter="newPostBtn" class="newPostContainer">
            <div class="mainNewPostBody">
                <div class="textareaWrapper" >
                    <textarea @click="enlargeNewPostBox" @keydown.enter.prevent v-on:keyup="countdown" v-model="postData[0]" class="newPostTextarea" v-bind:class="{ enlargeTextarea: showPostBtns}" placeholder="New post" maxlength="140"></textarea>
                    <p v-if="showPostBtns" class='textareaCountdownP'>{{remainingCount}}</p>
                </div>
            </div>
            
            <div v-if="showPostBtns" class="newPostBtnWrapper">
                <button v-on:click="newPostBtn" class="postNewPostBtn">post</button>
                <button @click="pickPostImageBtn" class="uploadImageBtn"><font-awesome-icon class="fas" icon="image" />upload</button>
                <input type="file" style="display: none;" ref="newPostImageInput" accept="image/*" @change="onNewPostImgPressed" >
                
                <img v-if="showImgBox" class="newPostImg" :src="postData[1]" >
                <div v-if="showImgBox" class="newPostImgOverlay"><font-awesome-icon v-on:click="deleteImg" class="fas" icon="times" /></div>
                <div v-if="showImgLoader" class="imageUploadingContainer"><img src="../../assets/images/misc/loader.gif"></div>
            </div>
            <p v-if="errorMessage" class="errorMessage">{{errorMessage}}</p>
        </div>

        <!-- New uploaded posts -->
        <div class="postRow" v-bind:key="newPostData.id" v-for="newPostData in newPostDatas">
            <div class="postHeader">
                <img class="profilePicture" :src="usersProfilePicture">
                <div class="userDataWrapper">
                    <p class="nameP">{{usersFirstName}} {{usersLastName}}</p>
                    <p class="dataP">{{newPostData.date}}</p>
                </div>
        
                <button v-on:click="deletePost(newPostData.id)" class="deletePost"><font-awesome-icon class="fas" icon="times" /></button>
            </div>
            <div class="postBody">
                <p v-if="newPostData.text">{{newPostData.text}}</p>
                <lightBox v-if="newPostData.image" :thumbnail="newPostData.image" />
            </div>
        </div>
 
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import lightBox from '@/components/PortfolioComponents/Lightbox.vue'

import NProgress from 'nprogress'
import '../../../node_modules/nprogress/nprogress.css'
import imageCompression from 'browser-image-compression';

export default {
    name: 'newPost',
    data () {
        return {
            maxCount: 140,
            remainingCount: 140,
            usersId: null,
            showImgBox: false,
            errorMessage: false,
            canSend: false,
            currentDate: null,
            currentTime: null,
            postData: [],
            showPostBtns: false,
            showImgLoader: false,

            newPostDatas: [],
            displayNewPosts: false,
            usersFirstName: null,
            usersLastName: null,
            usersProfilePicture: null,
            postId: null,
        }
    },
    components: {
        lightBox
    },
    created () {
        if (firebase.auth().currentUser) {
            this.usersId = firebase.auth().currentUser.uid
        }
        const db = firebase.firestore()
        db.collection('users').where('users_id', '==', this.usersId).get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                this.usersFirstName = doc.data().first_name
                this.usersLastName = doc.data().last_name
                this.usersProfilePicture = doc.data().profile_picture
            })
        })
        
    },
    methods: {
        countdown: function() {
            this.remainingCount = this.maxCount - this.postData[0].length;
        },
        pickPostImageBtn() {
            this.$refs.newPostImageInput.click();
        },
        onNewPostImgPressed() {
            NProgress.start()
            this.showImgLoader = true
            var imageFile = event.target.files[0];
            const fileName = imageFile.name
            const ext = fileName.slice(fileName.lastIndexOf('.'))

            var options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }
            imageCompression(imageFile, options).then( (compressedFile) => { 

                function uuidv4() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
                this.uniqueId = uuidv4()
                
                //Set the location to store in firebase storage
                var storageRef = firebase.storage().ref('post/' + this.usersId + '.' + this.uniqueId + ext)
                let uploadTask = storageRef.put(compressedFile)

                uploadTask.on('state_changed', (snapshot) => {
                    this.snapshot = snapshot
                }, (error) => {
                    // Handle unsuccessful uploads
                    this.errorMsg = error
                }, () => {
                    // Handle successful uploads on complete
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        this.postData[1] = downloadURL

                    }).then (() => {
                        this.showImgLoader = false
                        this.showImgBox = true
                        NProgress.done()
                    });
                    })

                })
                .catch(function (error) {
                console.log(error.message);
                });
        },
        deleteImg() {
            this.postData[1] = null
            this.showImgBox = false
        },
        newPostBtn() {
            //Gets current Date
            var currentDateWithFormat = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            this.currentDate = currentDateWithFormat
            //Gets current Time
            var currentDate = new Date();
            var time = currentDate.getHours() + ":" + currentDate.getMinutes();
            this.currentTime = time 


            //If both are not set - upload
            if (this.postData[0] === undefined) {
                if (this.postData[1] === undefined) {
                    this.errorMessage = "Woops! You've got to write a post first!"
                    this.canSend = false
                }
            }
            //If the message is empty and the image is not - upload
            if (this.postData[0] === undefined) {
                if (this.postData[1] !== undefined) {
                    this.postData[0] = null
                    this.postType = 'image'
                    this.canSend = true
                }
            }
            //If both are set - upload
            if (this.postData[0] !== undefined) {
                if (this.postData[1] !== undefined) {
                    this.postType = 'image'
                    this.canSend = true
                }
            }
            //If the message is set and the image is empty - upload
            if (this.postData[0] !== undefined) {
                if (this.postData[1] === undefined) {
                    this.postData[1] = null
                    this.postType = 'text'
                    this.canSend = true
                }
            }

            //If can send is true then upload
            if (this.canSend === true) {
                NProgress.start()
                const db = firebase.firestore()
                db.collection('posts').add({
                    users_id: this.usersId,
                    text: this.postData[0],
                    image: this.postData[1],
                    date: this.currentDate,
                    time: this.currentTime,
                    type: this.postType

                }).then((docRef) => {
                    NProgress.done()

                    //Gets the document id     
                    this.postId = docRef.id

                    const data = {
                        'id': this.postId,
                        'text': this.postData[0], 
                        'image': this.postData[1], 
                        'date': this.currentDate
                    }
                    this.newPostDatas.unshift(data)
                    this.displayNewPosts = true

                    //reset the new post inputs
                    this.postData[0] = undefined
                    this.postData[1] = undefined
                    this.postType = null
                    this.showImgBox = false
                    this.canSend === false
                    this.showPostBtns  = false
                    this.remainingCount = 140
                })
            }

        },
        deletePost(id) {
            const db = firebase.firestore()
            db.collection("posts").doc(id).delete().then(() => {
                this.$router.go({ path: this.$router.path })
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        },
        enlargeNewPostBox() {
            this.showPostBtns = true
        }
    }
}
</script>

<style scoped>
.newPostContainer {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    background-color: #FFF;
    border-radius: 10px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 10px;
}
.mainNewPostBody {
    padding: 10px 10px 6px;
    
}

.uploadImageBtn {
    margin: 0;
    padding: 5px 30px;
    border: 2px solid #ECECEC;
    background-color: #F5F5F5;
    border-radius: 20px;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    font-size: 14px;
}
.uploadImageBtn:hover {
    background-color: #E5E5E5;
    border: 2px solid #DDDDDD;
}
.uploadImageBtn .fas {
    font-size: 16px;
    padding-right: 5px;
    color: #646464;
}
.newPostTextarea {
    resize: none;
    width: 100%;
    height: 50px;
    padding: 10px;
    border: 1px solid #EDEDED;
    border-radius: 5px;
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    transition: height 0.3s;
}
.enlargeTextarea {
    height: 100px;
}
.newPostTextarea:focus {
    outline: none;
    border: 1px solid #2E85E8;
}
.textareaWrapper {
    position: relative;
}
.newPostImg {
    position: absolute;
    bottom: 10px;
    right: 10px;
    border-radius: 3px;
    height: 32px;
    width: 32px;
    background-color: #515151;
    object-fit: cover;
} 
.newPostImgOverlay {
    position: absolute;
    bottom: 10px;
    right: 10px;
    border-radius: 3px;
    height: 32px;
    width: 32px;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: 0.3s;
}
.newPostImgOverlay:hover {
    opacity: 1;
}
.newPostImgOverlay .fas {
    color: #F63131;
    font-size: 14px;
    cursor: pointer;
}
.imageUploadingContainer {
    position: absolute;
    bottom: 10px;
    right: 10px;
    border-radius: 3px;
    height: 32px;
    width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.imageUploadingContainer img {
    height: 30px;
    width: 30px;
}
.textareaCountdownP {
    position: absolute;
    bottom: 5px;
    right: 5px;
    margin: 0;
    padding: 3px 0 0;
    color: #5F5F5F;
}
.newPostBtnWrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px 10px;
    box-sizing: border-box;
    position: relative;
    
}
.postNewPostBtn {
    margin: 0 10px 0 0;
    padding: 5px 30px;
    border: none;
    background-color: #4ED964;
    border-radius: 20px;
    color: #FFF;
    cursor: pointer;
    transition: 0.3s;
    font-size: 14px;
}
.postNewPostBtn:hover {
    background-color: #49C25C;
}
.errorMessage {
    margin: 0;
    padding: 0 10px 10px;
}

/* Post Styling */
.postRow {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    background-color: #FFF;
    border-radius: 10px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 10px;
}
.postHeader {
    padding: 10px;
    display: flex;
    align-items: center;
    position: relative;
} 
.deletePost {
    position: absolute;
    right: 10px;
    top: 10px;
    background: #F5F5F5;
    border-radius: 50%;
    border: none;
    padding: 0;
    width: 25px;
    height: 25px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;
}
.deletePost .fas {
    color: #878787;
    font-size: 10px;
    transition: 0.3s;
}
.deletePost:hover {
    background: #EEEEEE;
}
.deletePost:hover .fas {
    color: #FB3C3C;
}
.profilePicture {
    height: 40px;
    width: 40px;
    border-radius: 50%;
}
.userDataWrapper {
    padding: 0 10px;
}
.nameP {
    margin: 0;
    padding: 0 0 2px;
    font-size: 16px;
}
.dataP {
    margin: 0;
    padding: 0;
    font-size: 14px;
    color: #8F8F8F;
}
.postBody {
    padding: 0 10px 10px;
}
.postBody p {
    margin: 0;
    padding: 0;
}
.postBody img {
    margin-top: 10px;
    width: 100%;
    max-height: 250px;
    object-fit: cover;
    border-radius: 10px;
}


@media only screen and (max-width: 850px) { 
    .newPostBgOverlay {left: 0; z-index: 4100;}
    .newPostCloseBtn {margin-top: 20px; margin-bottom: 20px;}
    .newPostCloseBtnContainer {padding-right: 0;}
}
</style>