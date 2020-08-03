<template>
    <div id="gallery">
        <div class="galleryContainer" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50"  infinite-scroll-immediate-check="false">
            
            <div v-if="showEmptyMessage" class="noContentWrapper">
                <!-- Error message for users if you have no content -->
                <div v-if="yourProfile && showEmptyMessage" class="noContentContainer">
                    <p class="loadMoreError">You have no images in your gallery, make a post on your timeline for images to appear here!</p> 
                </div>
                <!-- Error message for users if you have no content -->
                <div v-if="!yourProfile && showEmptyMessage" class="noContentContainer">
                    <p class="loadMoreError">This user currently has no images in their gallery!</p> 
                </div>
            </div>

            <div class="pageLoading" v-if="pageLoading">
                <img class="pageLoadingGif" src="../../assets/images/loader.gif" alt="">
                <p>content loading</p>
            </div>

            <div class="galleryImgWrapper">
                <div v-bind:key="post.id" v-for="post in posts" class="imgOuter">
                    <lightBox :thumbnail="post.image" />
                    <div class="imgHoverOverlay"></div>
                </div>
            </div>

            <div v-if="loadMoreError" class="postRow">
                <p class="loadMoreError">There are no more images!</p> 
            </div>

        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import infiniteScroll from 'vue-infinite-scroll'

import lightBox from '@/components/PortfolioComponents/LightboxGallery.vue'

export default {
    name: 'gallery',
      components: {
          lightBox
    }, 
    props: {
        userAddress: {type: String},
        showAddress: {type: Boolean},
        userDob: {type: String},
        userBio: {type: String},
        userProfilePicture: {type: String},
        userFirstName: {type: String},
        userLastName: {type: String},
    },
    directives: { 
        infiniteScroll
    },
    data () {
        return {
            posts: [],
            page_id: null,
            users_portfolio_id: null, //Id of the current user
            yourProfile: null,
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

        if (firebase.auth().currentUser) {
            this.users_portfolio_id = firebase.auth().currentUser.uid
        }
        this.page_id = this.$route.params.users_id

        if (this.page_id == this.users_portfolio_id) {
            this.yourProfile = true
        }

        //Get post data
        const db = firebase.firestore()
        db.collection('posts').where('users_id', '==', this.$route.params.users_id).where('type', '==', 'image').orderBy('date', "desc").orderBy('time', "desc").limit(10).get().then((querySnapshot) => {

            //Sets the last visable product so it knows where to call more from
            var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
            //console.log("last", lastVisible);
            this.lastVisibleData = lastVisible
            

            if (querySnapshot.empty === false) {
                //There is data
                querySnapshot.forEach(doc => {
                    const data = {
                        'image': doc.data().image,
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
        loadMore() {  
            if(this.lastVisibleData !== undefined) {
                const db = firebase.firestore()
                db.collection('posts').where('users_id', '==', this.page_id).where('type', '==', 'image').orderBy('date', "desc").orderBy('time', "desc").startAfter(this.lastVisibleData).limit(10).get().then(querySnapshot => {

                    //Sets the last visable product so it knows where to call more from
                    var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                    //console.log("last", lastVisible);
                    this.lastVisibleData = lastVisible

                    querySnapshot.forEach(doc => {
                        const data = {
                            'image': doc.data().image,
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

<style>
    .galleryContainer {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        margin-top: -5px;
        margin-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
    }
    .galleryImgWrapper {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
    }
    .postRow {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        background-color: #FFF;
        border-radius: 10px;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
        margin-bottom: 10px;
    }
    .noContentMessage {
        margin-top: 5px;
    }
    .loadMoreError {
        margin: 0;
        padding: 10px;
    }
    .imgOuter {
        width: 33.33%;
        padding: 5px;
        box-sizing: border-box;
        position: relative;
    }
    .imgInner {
        width: 100%;
        background-size: cover;
        background-position: center;
        border-radius: 5px;
        cursor: pointer;
    }
    .imgInner:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }
    .imgHoverOverlay {
        position: absolute;
        top: 5px;
        left: 5px;
        bottom: 5px;
        right: 5px;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        opacity: 0;
        transition: 0.3s;
        cursor: pointer;
        pointer-events: none;
    }
    .imgOuter:hover .imgHoverOverlay{
        opacity: 1;
    }


    @media only screen and (max-width: 500px) {
        .imgOuter {width: 50%;}
    }
.noContentWrapper {
    margin-top: 5px;
    width: 100%;
}
.noContentContainer {
    width: 100%;
    border-radius: 0px 10px 10px 0px;
    background: #303841;
    border-left: 5px solid #2E85E8;
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