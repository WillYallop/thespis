<template>
    <div id="work">
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50"  infinite-scroll-immediate-check="false" >

            <!-- Error message for users if you have no content -->
            <div v-if="!yourProfile && showEmptyMessage" class="noContentContainer">
                <p class="loadMoreError">This user currently has no work experience!</p> 
            </div>
            <!-- Error message for you if you have no content --> 
            <div v-if="yourProfile && showEmptyMessage" class="noContentContainer">
                <p class="loadMoreError">You currently have no work experience, add some to show users what you've done!</p> 
            </div>

            <NewWorkExperience v-if="yourProfile"/>

            <div class="pageLoading" v-if="pageLoading">
                <img class="pageLoadingGif" src="../../assets/images/loader.gif" alt="">
                <p>content loading</p>
            </div>

            <div class="postRow" v-bind:key="post.id" v-for="post in posts">
                <div class="postHeader">
                    <h4>{{post.title}}</h4>
                    <button v-on:click="deletePost(post.id)" class="deletePost"><font-awesome-icon class="fas" icon="times" /></button>
                </div>
                <div class="iconInfoContainer">
                    <div class="iconTextWrapper">
                        <font-awesome-icon class="fas" icon="briefcase" />
                        <p>{{post.company}}</p>
                    </div>
                    <div class="iconTextWrapper">
                        <font-awesome-icon class="fas" icon="user-alt" />
                        <p>{{post.role}}</p>
                    </div>
                    <div class="iconTextWrapper">
                        <font-awesome-icon class="fas" icon="calendar-alt" />
                        <p>On {{post.date}}</p>
                    </div>
                </div>
                <p class="workDescirptionP">{{post.description}}</p>
                <a v-if="post.link" :href="post.link" target="_blank"><button class="followLink">check out</button></a>
            </div>

            <div v-if="loadMoreError" class="postRow loadMoreRow">
                <p class="loadMoreError">There are no more posts!</p> 
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import infiniteScroll from 'vue-infinite-scroll'

import NewWorkExperience from '@/components/PortfolioComponents/NewWorkExperience'

export default {
    name: 'work',
    components: {
        NewWorkExperience
    },
    props: {

    },
    directives: { 
        infiniteScroll
    },
    data () {
        return {
            users_portfolio_id: null, //Id of the current user
            page_id: null, //Id of the url
            yourProfile: null,
            posts: [],
            showEmptyMessage: false,
            pageLoading: false,

            lastVisibleData: [],
            loadMoreError: false,
            busy: true
        }
    },
    mounted () {
        this.loadMoreTimer()
    },
    created () {
        this.pageLoading = true

        // get page and user Id
        if (firebase.auth().currentUser) {
            this.users_portfolio_id = firebase.auth().currentUser.uid
        }
        this.page_id = this.$route.params.users_id

        if (this.page_id == this.users_portfolio_id) {
            this.yourProfile = true
        }
        
        //Get post data
        const db = firebase.firestore()
        db.collection('work_experience').where('users_id', '==', this.$route.params.users_id).orderBy('date_posted', "desc").orderBy('time_posted', "desc").limit(10).get().then((querySnapshot) => {

            //Sets the last visable product so it knows where to call more from
            var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
            //console.log("last", lastVisible);
            this.lastVisibleData = lastVisible

            if (querySnapshot.empty === false) {
                //There is data
                querySnapshot.forEach(doc => {
                    const data = {
                        'id':doc.id,
                        'description': doc.data().description,
                        'title': doc.data().title,
                        'company': doc.data().company,
                        'role': doc.data().role,
                        'date': doc.data().date,
                        'link': doc.data().link,
                    }
                    this.pageLoading = false
                    this.posts.push(data)
                })
            } else {
                //There is no data
                this.pageLoading = false
                this.showEmptyMessage = true
            }
        })
        
    },
    methods: {
        deletePost(id) {
            const db = firebase.firestore()
            db.collection("work_experience").doc(id).delete().then(() => {
                this.$router.go({ path: this.$router.path })
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        },
        loadMore() {  
            if(this.lastVisibleData !== undefined) {
                const db = firebase.firestore()
                db.collection('work_experience').where('users_id', '==', this.page_id).orderBy('date_posted', "desc").orderBy('time_posted', "desc").startAfter(this.lastVisibleData).limit(10).get().then(querySnapshot => {

                //Sets the last visable product so it knows where to call more from
                var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                //console.log("last", lastVisible);
                this.lastVisibleData = lastVisible

                    querySnapshot.forEach(doc => {
                        const data = {
                            'id':doc.id,
                            'description': doc.data().description,
                            'title': doc.data().title,
                            'company': doc.data().company,
                            'role': doc.data().role,
                            'date': doc.data().date,
                            'link': doc.data().link,
                        }
                        this.posts.push(data)
                    })

                    //Sets the button text to stop further presses & stops the loadmore function from reexecuting
                    if(this.lastVisibleData === undefined) {
                        this.loadMoreError = true
                        this.busy = true
                    }
                    
                })
            } else {
                this.loadMoreError = true
            }
        },
        //Because infiteload would activate when changing between component loading - this adds a delay before it can load more to give the page time
        loadMoreTimer() {
            setTimeout(() => { 
                this.busy = false
            }, 500);
        },

    }
}
</script>
<style scoped>
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

.noContentContainer {
    width: 100%;
    border-radius: 0px 10px 10px 0px;
    background: #303841;
    border-left: 5px solid #2E85E8;
    margin-bottom: 10px;
}
.noContentContainer p {
    color: #FFF;
    margin: 0;
    padding: 10px;
}

.pageLoading {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
}
.pageLoading p {
    color: #444644;
    font-size: 14px;
    margin: 0;
    padding: 5px 0 0;
}
.pageLoadingGif {
    width: 18px;
}
</style>