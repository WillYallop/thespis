<template>
    <div id="timeline">
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50"  infinite-scroll-immediate-check="false" >
            
            <!-- Error message for users if you have no content -->
            <div v-if="!yourProfile && showEmptyMessage" class="noContentContainer">
                <p class="loadMoreError">This user currently has no posts!</p> 
            </div>
            <!-- Error message for you if you have no content --> 
            <div v-if="yourProfile && showEmptyMessage" class="noContentContainer">
                <p class="loadMoreError">You currently have nothing on your timeline!</p> 
            </div>

            <newPost v-if="yourProfile"/>

            <div class="pageLoading" v-if="pageLoading">
                <img class="pageLoadingGif" src="../../assets/images/loader.gif" alt="">
                <p>content loading</p>
            </div>
          
            <div class="postRow" v-bind:key="post.id" v-for="post in posts">
                <div class="postHeader">
                    <img class="profilePicture" :src="userProfilePicture">
                    <div class="userDataWrapper">
                        <p class="nameP">{{userFirstName}} {{userLastName}}</p>
                        <p class="dataP">{{post.date}}</p>
                    </div>
            
                    <button v-if="yourProfile" v-on:click="deletePost(post.id)" class="deletePost"><font-awesome-icon class="fas" icon="times" /></button>
                </div>
                <div class="postBody">
                    <p v-if="post.text">{{post.text}}</p>
                    <lightBox v-if="post.image" :thumbnail="post.image" />
                </div>
            </div>

            <div v-if="loadMoreError" class="postRow">
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

import newPost from '@/components/PortfolioComponents/NewPost'
import lightBox from '@/components/PortfolioComponents/Lightbox.vue'

export default {
    name: 'timeline',
    components: {
        newPost,
        lightBox
    },
    props: {
        userProfilePicture: {type: String},
        userFirstName: {type: String},
        userLastName: {type: String},
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
        db.collection('posts').where('users_id', '==', this.$route.params.users_id).orderBy('date', "desc").orderBy('time', "desc").limit(10).get().then((querySnapshot) => {

            //Sets the last visable product so it knows where to call more from
            var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
            //console.log("last", lastVisible);
            this.lastVisibleData = lastVisible

            if (querySnapshot.empty === false) {
                //There is data
                querySnapshot.forEach(doc => {
                    const data = {
                        'id':doc.id,
                        'text': doc.data().text,
                        'image': doc.data().image,
                        'date': doc.data().date 
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
            db.collection("posts").doc(id).delete().then(() => {
                this.$router.go({ path: this.$router.path })
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        },
        loadMore() {  
            if(this.lastVisibleData !== undefined) {
                const db = firebase.firestore()
                db.collection('posts').where('users_id', '==', this.page_id).orderBy('date', "desc").orderBy('time', "desc").startAfter(this.lastVisibleData).limit(10).get().then(querySnapshot => {

                //Sets the last visable product so it knows where to call more from
                var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                //console.log("last", lastVisible);
                this.lastVisibleData = lastVisible

                    querySnapshot.forEach(doc => {
                        const data = {
                            'id':doc.id,
                            'text': doc.data().text,
                            'image': doc.data().image,
                            'date': doc.data().date 
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
.loadMoreError {
    margin: 0;
    padding: 10px;
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