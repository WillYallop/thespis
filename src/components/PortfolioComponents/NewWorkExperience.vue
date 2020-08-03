<template>
    <div id="work-experience">

        <div @click="enlargeNewPostBox" v-on:keyup.enter="saveNewWork"  class="newWorkContainer">
            <h4>Add Work Experience</h4>
            <input v-model="workTitle" class="newWorkInput topInput" type="text" placeholder="Title" v-bind:class="{ addMargin: showContent}">
            <input v-model="workCompany" v-if="showContent" class="newWorkInput" type="text" placeholder="Company / Person">
            <div v-if="showContent" class="inputWrapper">
                <input v-model="workRole" class="newWorkInput" type="text" placeholder="Role">
                <input v-model="workDate" class="newWorkInput" type="date" placeholder="Date">
            </div>
            <input v-model="workLink" v-if="showContent" class="newWorkInput" type="text" placeholder="Link to work (optional)">
            <div v-if="showContent" class="textareaWrapper">
                <textarea v-model="workDescription" class="newWorkInput" placeholder="Description" @keydown.enter.prevent v-on:keyup="countdown" maxlength="300"></textarea>
                <p>{{remainingCount}}</p>
            </div>
            <p v-if="errorMessage" class="errorMessage">{{errorMessage}}</p>
            <button v-if="showContent" v-on:click="saveNewWork" class="saveNewWorkBtn">post</button>
        </div>

        <!-- New uploaded posts -->
        <div class="postRow" v-bind:key="newWorkData.id" v-for="newWorkData in newWorkDatas">
            <div class="postHeader">
                <h4>{{newWorkData.title}}</h4>
                <button v-on:click="deletePost(newWorkData.id)" class="deletePost"><font-awesome-icon class="fas" icon="times" /></button>
            </div>
            <div class="iconInfoContainer">
                <div class="iconTextWrapper">
                    <font-awesome-icon class="fas" icon="briefcase" />
                    <p>{{newWorkData.company}}</p>
                </div>
                <div class="iconTextWrapper">
                    <font-awesome-icon class="fas" icon="user-alt" />
                    <p>{{newWorkData.role}}</p>
                </div>
                <div class="iconTextWrapper">
                    <font-awesome-icon class="fas" icon="calendar-alt" />
                    <p>On {{newWorkData.date}}</p>
                </div>
            </div>
            <p class="workDescirptionP">{{newWorkData.description}}</p>
            <a v-if="newWorkData.link" :href="newWorkData.link" target="_blank"><button class="followLink">check out</button></a>
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

export default {
    name: 'work-experience',
    props: {

    },
    data () {
        return {
            maxCount: 300,
            remainingCount: 300,
            showContent: false,
            canSave: false,
            usersId: null,
            currentDate: null,
            currentTime: null,
            errorMessage: null,
            //V-Model Data
            workDescription: '',
            workTitle: '', 
            workCompany: '', 
            workRole: '', 
            workDate: '', 
            workLink: '',
            //New Posts
            newWorkDatas: [],
            displayNewWorks: false

        }
    },
    created () {
        if (firebase.auth().currentUser) {
            this.usersId = firebase.auth().currentUser.uid
        }
      
    },
    methods: {
        countdown: function() {
            this.remainingCount = this.maxCount - this.workDescription.length;
        },
        enlargeNewPostBox() {
            this.showContent = true
        },
        saveNewWork() {
            //Gets current Date
            var currentDateWithFormat = new Date().toJSON().slice(0,10).replace(/-/g,'/');
            this.currentDate = currentDateWithFormat
            //Gets current Time
            var currentDate = new Date();
            var time = currentDate.getHours() + ":" + currentDate.getMinutes();
            this.currentTime = time 

            //Check if can post
            if (this.workTitle && this.workCompany && this.workRole && this.workDate && this.workDescription) {
                this.canSave = true;
            } else {
                this.errorMessage = 'Make sure to fill in all the boxes!'
                this.canSave = false
            }
            
            //Posts
            if(this.canSave === true) {
                NProgress.start()
                const db = firebase.firestore()
                db.collection('work_experience').add({
                    users_id: this.usersId,
                    description: this.workDescription,
                    title: this.workTitle,
                    company: this.workCompany,
                    role: this.workRole,
                    date: this.workDate,
                    link: this.workLink,
                    date_posted: this.currentDate,
                    time_posted: this.currentTime,

                }).then((docRef) => {
                    NProgress.done()
                    //Gets the document id     
                    this.postId = docRef.id

                    const data = {
                        'id': this.postId,
                        'description': this.workDescription,  
                        'title': this.workTitle, 
                        'company': this.workCompany,
                        'role': this.workRole,
                        'date': this.workDate,
                        'link': this.workLink,
                    }
                    this.newWorkDatas.unshift(data) 
                    this.displayNewWorks = true

                    //reset the new post inputs
                    this.workDescription = null
                    this.workTitle = null
                    this.workCompany = null
                    this.workRole = null
                    this.workDate = null
                    this.workLink = null
                    this.errorMessage = null
                    this.showContent = false
                    this.remainingCount = 300
                })

            }
             
        },
        deletePost(id) {
            const db = firebase.firestore()
            db.collection("work_experience").doc(id).delete().then(() => {
                this.$router.go({ path: this.$router.path })
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        }
    }
}
</script>

<style scoped>
input:focus {border: 1px solid #2E85E8;}
textarea:focus {border: 1px solid #2E85E8;}

.newWorkContainer {
    width: 100%;
    height: auto;
    padding: 10px;
    box-sizing: border-box;
    background-color: #FFF;
    border-radius: 10px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 10px;
}
.newWorkContainer h4 {
    font-size: 16px;
    font-weight: bold;
    margin: 0;
    padding: 0 0 10px;
}
/* Input */
.newWorkInput {
    width: 100%;
    height: 35px;
    background-color: transparent;
    border: 1px solid #EDEDED;
    padding: 0 10px;
    box-sizing: border-box;
    border-radius: 5px;
    margin-bottom: 10px;
    font-family: Arial, Helvetica, sans-serif;
}
.inputWrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.inputWrapper .newWorkInput {
    width: 49% !important;
}
.topInput {
    margin-bottom: 0 ;
}
.addMargin {
    margin-bottom: 10px !important;
}
/* Textarea */
.textareaWrapper {
    position: relative;
}
.textareaWrapper textarea {
    min-height: 100px;
    max-height: 150px;
    resize: none;
    padding: 10px;
    margin-bottom: 0;
}
.textareaWrapper p {
    position: absolute;
    bottom: 5px;
    right: 5px;
    margin: 0;
    padding: 0;
    color: #5F5F5F;
}
.errorMessage {
    margin: 0;
    padding: 5px 0 5px;
}
/* Save Btn */
.saveNewWorkBtn {
    margin: 5px 0 0 0;
    padding: 7px 30px;
    border: none;
    background-color: #4ED964;
    border-radius: 20px;
    color: #FFF;
    cursor: pointer;
    transition: 0.3s;
    font-size: 14px;
}
.saveNewWorkBtn:hover {
    background-color: #49C25C;
}

/* Post Row */
.postRow {
    padding: 10px;
}
.loadMoreRow {
    padding: 0 !important;
}
.postHeader {
    position: relative;
}
.postHeader h4 {
    margin: 0;
    padding: 0 35px 0 0;
}
.iconInfoContainer {
    padding: 8px 0;
}
.iconTextWrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 2px 0;
}
.iconTextWrapper .fas {
    font-size: 14px;
    color: #2E85E8;
    width: 14px;
}
.iconTextWrapper p {
    color: #707070;
    font-size: 14px;
    margin: 0;
    padding: 0 0 0 10px;
}
.workDescirptionP {
    margin: 0;
    padding: 0;
}
.followLink {
    margin: 10px 0 0 0;
    padding: 7px 30px;
    border: none;
    background-color: #2E85E8;
    border-radius: 20px;
    color: #FFF;
    cursor: pointer;
    transition: 0.3s;
    font-size: 14px;
}
.deletePost {
    position: absolute;
    right: 0;
    top: 0;
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

</style>