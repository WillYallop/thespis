<template>
    <div id="talent">
        <!-- Start of Mobile Toggle -->
        <div class="talentPageContainer" v-bind:class="{ hide: showRows }">
            <div class="showRowsContainer">
                <div class="showRowsWrapper">
                    <img src="../assets/images/helpfulSign.png">
                    <h4>Cards are not available on this screen size.</h4>
                    <p>Click the button bellow to change the layout from cards to rows.</p>
                    <button v-on:click="toggleView"><font-awesome-icon class="fas" icon="th-list" /></button>
                </div>
            </div>
            <swiper class="siperContainer" :options="swiperOption">
                <!-- slides -->
                <swiper-slide v-bind:key="card.id" v-for="card in cards" class="cardContainer" :style="{ backgroundImage: `url(${card.profilePicture})` }"> 
                    <div class="cardWrapper" v-on:click="goToProfile(card.id)">
                        <div v-if="card.priceType" class="priceIndicator">
                            <p :class="{ 'free' : card.priceType == 'free'}">{{card.priceType}}</p>
                        </div>
                        
                        <div class="cardTextarea">
                            <h4>{{card.firstname}} {{card.lastname}}</h4>
                            <div class="talentPageTalentTagWrapper">
                                <InputTag class="talentTags" v-model="card.talent" :limit='3' :read-only="true"></InputTag>
                            </div>
                            <p>{{card.bio}}</p>
                        </div>
                    </div>
                </swiper-slide>

                <!-- If there is no data show this card -->
                <swiper-slide class="noDataSlide" v-if="noData">
                    <img src="../assets/images/noresults.png" alt="">
                    <h4>awww</h4>
                    <p>we couldn't find any more results</p>
                </swiper-slide>

            </swiper>
        </div>
 

        <!-- Start of Desktop Toggle -->
        <div v-bind:class="{ hide: !showRows }" class="rowTalentContainer" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50"  infinite-scroll-immediate-check="false">
            <div class="rowFilterContainer">
                <h4>Filter options</h4>
                <!-- Talent V-Model -->
                <select v-model="filterTalent" class="filterSelectInput">
                    <option :value="null" selected>Talent</option>
                    <option>Actor</option>
                    <option>Dancer</option>
                    <option>Singer</option>
                    <option>Voice Actor</option>
                    <option>Camera Operator</option>
                    <option>Editor</option>
                    <option>Director</option>
                </select>
                <!-- City V-Model -->
                <select v-model="filterCity" class="filterSelectInput">
                    <option :value="null" selected>City</option>
                    <option>Norwich</option> 
                    <option>Birmingham</option> 
                    <option>Glasgow</option> 
                    <option>Liverpool</option> 
                    <option>Bristol</option> 
                    <option>Manchester</option> 
                    <option>Sheffield</option> 
                    <option>Leeds</option> 
                    <option>Edinburgh</option> 
                    <option>Leicester</option> 
                </select>
   
                <!-- Filter Button -->
                <button v-on:click="searchFilter" class="filterBtn">search</button>
            </div>
            <!-- Rows cards -->
            <div class="rowContainer"> 
                <div class="rowSimplebarContainer" >
                    <div class="rowWrapper">
                        <div>
                            <!-- User row -->
                            <div class="userRow cursor" v-bind:key="card.id" v-for="card in cards" v-on:click="goToProfile(card.id)"> 
                                <img class="rowUserPP" :src="card.profilePicture" >
                                <div class="rowTextarea">
                                    <h4>{{card.firstname}} {{card.lastname}}</h4>
                                    <div class="talentRowTalentTagWrapper">
                                        <InputTag class="talentTags" v-model="card.talent" :limit='3' :read-only="true"></InputTag>
                                    </div>
                                    <p>{{card.bio}}</p>
                                </div>
                                <div v-if="card.priceType" class="priceIndicatorRow" :class="{ 'freeBg' : card.priceType == 'free'}">£</div>
                            </div>
                            
                            <div class="userRow" v-if="noData">
                                <p>no more results</p>
                            </div>
                        </div>
                        <button v-if="!noData" v-on:click="loadMore" class="mobileLoadMoreResults">Load more</button>
                    </div>
                </div>
            </div>
        </div>
      

        <!-- Mobile Filter - visible on both view types -->
        <div class="footerContainer">
            <div class="filterContainer">
                <div class="closeFilterBtnWrapper">
                    <button v-on:click="openFilter" class="closeFIlterBtn"><font-awesome-icon class="fas" icon="chevron-down" /></button>
                </div>
                <h4>Filter options</h4>
                <!-- Talent V-Model -->
                <select v-model="filterTalent" class="filterSelectInput">
                    <option :value="null" selected>Talent</option>
                    <option>Actor</option>
                    <option>Dancer</option>
                    <option>Singer</option>
                    <option>Voice Actor</option>
                    <option>Camera Operator</option>
                    <option>Editor</option>
                    <option>Director</option>
                </select>
                <!-- City V-Model -->
                <select v-model="filterCity" class="filterSelectInput">
                    <option :value="null" selected>City</option>
                    <option>Norwich</option> 
                    <option>Birmingham</option> 
                    <option>Glasgow</option> 
                    <option>Liverpool</option> 
                    <option>Bristol</option> 
                    <option>Manchester</option> 
                    <option>Sheffield</option> 
                    <option>Leeds</option> 
                    <option>Edinburgh</option> 
                    <option>Leicester</option> 
                </select>
   
                <!-- Filter Button -->
                <button v-on:click="searchFilter" class="filterBtn">search</button>
            </div>

            <div class="filterFooterContainer">
                <button><font-awesome-icon class="fas" icon="inbox" /></button>
                <button v-on:click="openFilter"><font-awesome-icon class="fas" icon="search" /></button>
                <button v-on:click="toggleView"><font-awesome-icon class="fas" icon="th-list" /></button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import InputTag from 'vue-input-tag'
import infiniteScroll from 'vue-infinite-scroll'

export default {
    name: 'talent',
    components: {
        swiper,
        swiperSlide,
        InputTag
    },
    data() {
        return {
            usersId: null,

            //Swiper Options
            swiperOption: {
                effect: 'coverflow',
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                coverflowEffect: {
                    rotate: 45,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows : false
                }

            },
   
            lastVisibleData: [],
            cards: [],
            noData: false,
            showRows: null,

            //Filter V-Models
            filterCity: null,
            filterTalent: null,

        }
    },
    directives: { 
        infiniteScroll
    },
    created() {
        //Set rows/cards depending on screen size
        if(window.innerWidth > 550) {
            this.showRows = true
        } else {
            this.showRows = false
        }
        //Get users id
        if (firebase.auth().currentUser) {
            this.usersId = firebase.auth().currentUser.uid
        }
        
        //Gets Card Data 
        const db = firebase.firestore()
        db.collection('users').where('profile_live', '==', true).limit(10).get().then((querySnapshot) => { 

            //Sets the last visable product so it knows where to call more from
            var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
            //console.log("last", lastVisible);
            this.lastVisibleData = lastVisible

            querySnapshot.forEach(doc => {
        
                const data = {
                    'id': doc.data().users_id,
                    'firstname': doc.data().first_name,
                    'lastname': doc.data().last_name,
                    'profilePicture': doc.data().profile_picture,
                    'talent': doc.data().talent,
                    'bio': doc.data().bio,
                    'priceType': doc.data().price_type,
                }
                this.cards.push(data)

            })
        })


    },
    mounted() {

        //Loads more users cards once scrolled to the end
        var mySwiper = document.querySelector('.siperContainer').swiper
        mySwiper.on('reachEnd', () => {
            this.loadMore()
        })


    },
    methods: {
        goToProfile(id) {
            this.$router.push({ path: `/portfolio/timeline/${id}` })
        },
        openFilter() { 
            [].map.call(document.querySelectorAll('.filterContainer'), function(el) {
                el.classList.toggle('showFilter');
            });  
        },
        toggleView() {
            if(this.showRows === true) {
                this.showRows = false
            
            } else {
                this.showRows = true
            }
        },
        searchFilter() {
            const db = firebase.firestore()

            //If the Talent v-model has been set then add a where const
            if(this.filterTalent) {
                this.whereTalent = this.filterTalent
                this.whereTalentOperator = 'array-contains'
            } else {
                this.whereTalent = ['Dancer', 'Actor', 'Singer', 'Voice Actor', 'Director', 'Camera Operator', 'VueJs']
                this.whereTalentOperator = 'array-contains-any'
            }
            //If the city v-model has been set then add a where const
            if(this.filterCity) {
                this.whereCity = this.filterCity
                this.whereCityOperator = '=='
            } else {
                this.whereCity = ''
                this.whereCityOperator = '>'
            }

            //If nothin is set on filter load normally
            //Else load with the correct where statements
            if(this.filterTalent === null && this.filterCity === null) {
                //Resets current arrays
                this.cards = []
                this.lastVisibleData = []
              
                db.collection('users').where('profile_live', '==', true).limit(10).get().then((querySnapshot) => { 

                    //Sets the last visable product so it knows where to call more from
                    var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                    //console.log("last", lastVisible);
                    this.lastVisibleData = lastVisible

                    querySnapshot.forEach(doc => {
                
                        const data = {
                            'id': doc.data().users_id,
                            'firstname': doc.data().first_name,
                            'lastname': doc.data().last_name,
                            'profilePicture': doc.data().profile_picture,
                            'talent': doc.data().talent,
                            'bio': doc.data().bio,
                            'priceType': doc.data().price_type,
                        }
                        this.cards.push(data)

                    })
                })
            } else {
                //Resets current arrays
                this.cards = []
                this.lastVisibleData = []
            
                //Update
                db.collection('users').where('profile_live', '==', true).where('talent', this.whereTalentOperator, this.whereTalent).where('city', this.whereCityOperator, this.whereCity).limit(10).get().then((querySnapshot) => { 
                    
                    //Sets the last visable product so it knows where to call more from
                    var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                    //console.log("last", lastVisible);
                    this.lastVisibleData = lastVisible

                    if (querySnapshot.empty === false) {
                        querySnapshot.forEach(doc => {
                            //There is data
                            const data = {
                                'id': doc.data().users_id,
                                'firstname': doc.data().first_name,
                                'lastname': doc.data().last_name,
                                'profilePicture': doc.data().profile_picture,
                                'talent': doc.data().talent,
                                'bio': doc.data().bio,
                                'priceType': doc.data().price_type,
                            }
                            this.cards.push(data)
                        })
                        this.noData = false
                    } else {
                        //There is no data
                        this.noData = true
                    }

                    if(this.cards.length < 2) {
                        this.noData = true
                    }
                })
            }

            //Close the filter container
            this.openFilter()

        
        },
        loadMore() {
            //If the Talent v-model has been set then add a where const
            if(this.filterTalent) {
                this.whereTalent = this.filterTalent
                this.whereTalentOperator = 'array-contains'
            } else {
                this.whereTalent = ['Dancer', 'Actor', 'Singer', 'Voice Actor', 'Director', 'Camera Operator', 'VueJs']
                this.whereTalentOperator = 'array-contains-any'
            }
            //If the city v-model has been set then add a where const
            if(this.filterCity) {
                this.whereCity = this.filterCity
                this.whereCityOperator = '=='
            } else {
                this.whereCity = ''
                this.whereCityOperator = '>'
            }


            const db = firebase.firestore()
            //If the filter hasnt been set load this
            if(this.filterTalent === null && this.filterCity === null) {
                if (this.cards.length > 9) {
                    if(this.lastVisibleData !== undefined) {
                        //Update
                        db.collection('users').where('profile_live', '==', true).startAfter(this.lastVisibleData).limit(10).get().then((querySnapshot) => { 
                            
                            //Sets the last visable product so it knows where to call more from
                            var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                            //console.log("last", lastVisible);
                            this.lastVisibleData = lastVisible

                            if (querySnapshot.empty === false) {
                                querySnapshot.forEach(doc => {
                                    //There is data
                                    const data = {
                                        'id': doc.data().users_id,
                                        'firstname': doc.data().first_name,
                                        'lastname': doc.data().last_name,
                                        'profilePicture': doc.data().profile_picture,
                                        'talent': doc.data().talent,
                                        'bio': doc.data().bio,
                                        'priceType': doc.data().price_type,
                                    }
                                    this.cards.push(data)
                                })
                                this.noData = false
                            } else {
                                //There is no data
                                this.noData = true
                            }

                            if(this.lastVisibleData === undefined) {
                                this.noData = true
                            }
                        })
                    }
                } else  {
                    this.noData = true
                }

            } else {
                //If there are more than 9 cards, it means likely more can be loaded
                if (this.cards.length > 9) {
                    if(this.lastVisibleData !== undefined) {
                    
                        db.collection('users').where('profile_live', '==', true).where('talent', this.whereTalentOperator, this.whereTalent).where('city', this.whereCityOperator, this.whereCity).startAfter(this.lastVisibleData).limit(10).get().then((querySnapshot) => { 
                        
                            //Sets the last visable product so it knows where to call more from
                            var lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
                            //console.log("last", lastVisible);
                            this.lastVisibleData = lastVisible

                            if (querySnapshot.empty === false) {
                                querySnapshot.forEach(doc => {
                                    //There is data
                                    const data = {
                                        'id': doc.data().users_id,
                                        'firstname': doc.data().first_name,
                                        'lastname': doc.data().last_name,
                                        'profilePicture': doc.data().profile_picture,
                                        'talent': doc.data().talent,
                                        'bio': doc.data().bio,
                                        'priceType': doc.data().price_type,
                                    }
                                    this.cards.push(data)
                                })
                                this.noData = false
                            } else {
                                //There is no data
                                this.noData = true
                            }

                            if(this.lastVisibleData === undefined) {
                                this.noData = true
                            }
                        })
                    }
                } else  {
                    this.noData = true
                }

            }





        },


    }
}
</script>

<style scoped>
.hide {
    display: none !important;
}

.talentPageContainer {
    position: absolute;
    top: 50px;
    right: 0;
    left: 250px;
    bottom: 50px;
    padding: 10px;
    box-sizing: border-box;
}
/* Swiper */
.siperContainer {
    width: 100%;
    height: 100%; 
}
/* Card Styling */
.cardContainer {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
.cardWrapper {
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.priceIndicator {
    width: 100%;
    display: flex;
    justify-content: flex-end;
} 
.priceIndicator p {
    margin: 0;
    padding: 5px 20px;
    border-radius: 20px;
    font-size: 14px;
    color: #FFF;
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #EE372E;
}
.free {
    background-color: #4ED964 !important;
}

.cardTextarea h4 {
    color: #FFF;
    margin: 0;
    padding: 0 0 5px;
    font-size: 20px;
}
.cardTextarea p {
    color: #FFF;
    margin: 0;
    padding: 15px 0 0;
    font-size: 16px;
}
.showRowsContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.showRowsWrapper {
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.showRowsWrapper img{
    max-width: 300px;
}
.showRowsWrapper h4 {
    font-size: 24px;
    font-weight: bold;
    color: #303841;
    font-weight: bold;
    margin: 0;
    padding: 40px 0 5px;
    text-align: center;
}
.showRowsWrapper p {
    font-size: 16px;
    color: #303841;
    margin: 0;
    padding: 0 0 20px;
    text-align: center;
}
.showRowsWrapper button {
    background-color: #2E85E8;
    padding: 7px 40px;
    border-radius: 20px;
    border: none;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.10);
    cursor: pointer;
    transition: 0.3s;
}
.showRowsWrapper button:hover {
    background-color: #2A74C8;
}
.showRowsWrapper button .fas {
    color: #FFF;
}

/* Footer Filter */
.footerContainer {
    position: absolute;
    z-index: 110;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    pointer-events: none;
}
.filterFooterContainer {
    height: 50px;
    width: 100%;
    background-color: #FFF;
    position: absolute;
    z-index: 110;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 10px 10px 0px 0px;
    box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.10);
    padding: 0 60px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    pointer-events: all;
}
.filterFooterContainer button {
    background: transparent;
    border: none;
    padding: 10px;
    cursor: pointer;
}
.filterFooterContainer button .fas {
    color: #303841;
    font-size: 18px;
}
.filterFooterContainer button:hover .fas {
    color: #2E85E8;
}

/* Filter */
.filterContainer {
    background-color: #FFF;
    position: absolute;
    bottom: -250px;
    left: 10px;
    right: 10px;
    z-index: 100;
    border-radius: 10px 10px 0px 0px;
    transition: bottom 0.3s;
    padding: 20px 10px;
    box-sizing: border-box;
    pointer-events: all;
    box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.05);
}
.showFilter {
    bottom: 50px;
}
.filterContainer h4 {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    padding: 0 0 10px;
}
.closeFilterBtnWrapper {
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
}
.closeFIlterBtn {
    pointer-events: all;
    height: 40px;
    width: 40px;
    border: none;
    border-radius: 50%;
    background-color: #FFF;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;
    cursor: pointer;
}
.closeFIlterBtn .fas {
    color: #303841;
    font-size: 14px;
}
.closeFIlterBtn:hover .fas {
    color: #2E85E8;
}
.filterSelectInput {
    width: 100%;
    height: 35px;
    padding: 0 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
    border-radius: 5px;
    background-color: #F7F7F7;
    border: 1px solid #F7F7F7;
}
.filterSelectInput:last-child {
    margin-bottom: 0;
}
.filterSelectInput:focus {
    border: 1px solid #2E85E8;
    outline: none;
}
.filterBtn {
    background-color: #2E85E8;
    padding: 7px 40px;
    border: none;
    border-radius: 20px;
    color: #FFF;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s;
}
.filterBtn:hover {
    background-color: #2A74C8;
}
.noDataSlide {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.noDataSlide img{
    width: 60%;
    max-width: 300px;
}
.noDataSlide h4 {
    font-size: 30px;
    font-weight: bold;
    margin: 0;
    padding: 40px 0 10px;
    color: #303841;
}
.noDataSlide p {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    padding: 0;
    color: #303841;
}

.loadMoreSlide {
    border-radius: 10px;
    background-size: cover;
    background-repeat: none;
    background-position: center;
}
.loadMoreSlide .cardWrapper {
    background-color: rgba(0, 0, 0, 0.8)
}

/* Desktop Content */
.rowTalentContainer {
    position: absolute;
    top: 50px;
    left: 250px;
    right: 0;

    display: flex;
    padding: 10px;
    box-sizing: border-box;
}
.rowContainer {
    width: 100%;
    padding-left: 10px;
}
.rowSimplebarContainer {
    height: 100%;
}
.rowWrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
/* Row */
.userRow {
    width: 100%;
    background-color: #FFF;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
}
.cursor {
    cursor: pointer;
}
.userRow:last-child {
    margin-bottom: 0;
}
.userRow p {
    margin: 0;
}
.rowUserPP {
    width: 86px;
    height: 86px;
    min-height: 86px;
    min-width: 86px;
    object-fit: cover;
    border-radius: 50%;
}
.rowTextarea {
    padding-left: 10px;

}
.rowTextarea h4 {
    margin: 0;
    padding: 0;
}
.rowTextarea p {
    margin: 0;
    padding: 0;
    font-size: 16px;
    line-height: 16px;
    max-height: 32px;
    overflow: hidden;
}
.priceIndicatorRow {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #EE372E;
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}
.freeBg {
    background-color: #4ED964;
}

.mobileLoadMoreResults {
    padding: 10px 40px;
    width: 100%;
    border: none;
    background-color: #2E85E8;
    border-radius: 20px;
    margin: 10px 0 20px;
    color: #FFF;
    cursor: pointer;
    transition: 0.3s;
}
.mobileLoadMoreResults:hover {
    background-color: #2A74C8;
}
/* Row filter desktop */
.rowFilterContainer {
    position: sticky;
    top: 60px;
    max-height: 170px;
    width: 350px;
    background-color: #FFF;;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
}
.rowFilterContainer h4 {
    margin: 0;
    padding: 0 0 10px;
}


@media only screen and (min-width: 1024.1px) {
    .footerContainer {display: none}
    .noDataSlide {display: none}
    .siperContainer {display: none}
    .mobileLoadMoreResults {display: none}
}
@media only screen and (max-width: 1024px) {
    .talentPageContainer {left: 0;}
    .showRowsContainer {display: none}

    /* Desktop rows */
    .rowTalentContainer {top: 40px; left: 0; bottom: 40px;}
    .rowContainer {padding-left: 0;}
    .rowFilterContainer {display: none;}
    .rowSimplebarContainer {overflow-y: scroll;}
    
   
    .userRow:last-child {margin-bottom: 10px;}
    .rowWrapper {padding: 10px 0 0; box-sizing: border-box;}
}


</style>
