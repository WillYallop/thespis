<template>
  <div id="signin">
    <!-- Particle Area -->
    <div class="particleContainer">
      <div id="particles-js"></div>
    </div>
    <!-- Page Area -->
    <div class="signInContainer">
    <div class="signInWrapper">

        <div class="signInContentArea">
            <div class="signInContentAreaPadding">
                <div class="signinProfileImage">
                    <img src="../assets/images/profilePicturePlaceholder.png" alt="signinImage">
                </div>
                <h1>Sign in</h1>
                <p>Find talent, advertise positions for your film projects and share your portfolio of work!</p>
                <div class="inputHolder">
                    <input placeholder="Email Address" type="email" id="signinEmail" class="inputText" required v-model="email">
                </div>
                <div class="inputHolder">
                    <input placeholder="Password" type="password" id="signinPassword" class="inputText" required v-model="password">
                </div>
                <div class="btnArea">
                    <button class="signupButton" v-on:click="signin">Sign in</button>
                    <div class="moreOptionsLinkWrapper">
                        <img v-on:click="googleSignin" class="moreOptionsLink" src="../assets/images/googleIcon.png">
                        <img v-on:click="facebookSignin" class="moreOptionsLink" src="../assets/images/facebookIcon.png">
                    </div>
                </div>
            </div>
            <div class="signInFooterArea">
                <p>Create an account <router-link to="/signup">here</router-link></p>
            </div>
        </div>

        <div class="signInImageArea">

        </div>
        
    </div>
    </div>

    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'particles.js'

export default {
  name: 'signin',
  data: function() {
    return {
      email: '',
      password: '',
      currentDate: null,

      blank: null
    };
  },
  created() {
    //Gets current Date
    var currentDateWithFormat = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    this.currentDate = currentDateWithFormat

  },
  mounted() {
    this.initParticles()
  },
  methods: {
    initParticles() {
      window.particlesJS("particles-js", {
        "particles": {
          "number": {
            "value": 250,
            "density": {
              "enable": true,
              "value_area": 1183.74948704189
            }
          },
          "color": {
            "value": "#FFF"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#00e6ff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 3.156665298778373,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "bounce",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 1200,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": false,
              "mode": "repulse"
            },
            "onclick": {
              "enable": false,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 103.8853106170788,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
            })
    },
    signin: function(e) {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(userInfo => {
        this.blank = userInfo
        this.$router.go({ path: this.$router.path })
      },
      err => {
        alert(err.message);
      })
       e.preventDefault();
    },
    googleSignin: function() {
      const provider = new firebase.auth.GoogleAuthProvider()

      firebase.auth().signInWithPopup(provider).then((result) => {

        //check if the user has signed in with google before, if they have dont enter their data, else do
        const db = firebase.firestore()

        var docRef = db.collection('users').doc(result.user.uid)
        docRef.get().then((doc) => {
            if (doc.exists) {
                window.location.reload(true)
            } else {
                // doc.data() will be undefined in this case
                //Full name returns by google and split for db injections
                var full_name = result.user.displayName
                var name = full_name.split(' ')
                var first_name = name[0]
                var last_name = full_name.substring(name[0].length).trim();

                const db = firebase.firestore()
                return db.collection('users').doc(result.user.uid).set({
                  users_id: result.user.uid,
                  first_name: first_name,
                  last_name: last_name,
                  gender: null,
                  profile_picture: result.user.photoURL,
                  joined: this.currentDate
                }).then(() => {
                    window.location.reload(true)
                })

            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        })

        
      },
      err => {
        alert(err.message);
      })
    },
    facebookSignin: function() {
      var provider = new firebase.auth.FacebookAuthProvider();

      firebase.auth().signInWithPopup(provider).then((result) => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //var token = result.credential.accessToken;

        //check if the user has signed in with google before, if they have dont enter their data, else do
        const db = firebase.firestore()

        var docRef = db.collection('users').doc(result.user.uid)
        docRef.get().then(function(doc) {
            if (doc.exists) {
                window.location.reload(true)
            } else {
                // doc.data() will be undefined in this case
                //Full name returns by google and split for db injections
                var full_name = result.user.displayName
                var name = full_name.split(' ')
                var first_name = name[0]
                var last_name = full_name.substring(name[0].length).trim();

                const db = firebase.firestore()
                return db.collection('users').doc(result.user.uid).set({
                  users_id: result.user.uid,
                  first_name: first_name,
                  last_name: last_name,
                  gender: null,
                  profile_picture: result.user.photoURL,
                  joined: this.currentDate
                }).then(() => {
                    window.location.reload(true)
                })

            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        })


      }).catch(function(error) {
        console.log("Error getting document:", error);
        //var errorCode = error.code;
        //var errorMessage = error.message;
        //var email = error.email;
        //var credential = error.credential;
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* Particle Bg Style */
  .particleContainer {
    position: fixed;
    top: 50px;
    bottom: 0;
    right: 0;
    left: 250px;
    background: linear-gradient(135deg, #2E85E8, #2A74C8);
    background-size: 400% 400%;
    -webkit-animation: signupBackground 9s ease infinite;
    -moz-animation: signupBackground 9s ease infinite;
    animation: signupBackground 9s ease infinite
  }
  @-webkit-keyframes signupBackground {
    0% {background-position: 0 50%}
    50% {background-position: 100% 50%}
    100% {background-position: 0 50%}
  }
  @-moz-keyframes signupBackground {
    0% {background-position: 0 50%}
    50% {background-position: 100% 50%}
    100% {background-position: 0 50%}
  }
  @keyframes signupBackground {
    0% {background-position: 0 50%}
    50% {background-position: 100% 50%}
    100% {background-position: 0 50%}
  }
  #particles-js {
    height: 100%!important;
    width: 100%!important;
  }

  /* Page styling */
  .signInContainer {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 40px 20px 40px;
    box-sizing: border-box;
  }
  .signInWrapper {
    width: 100%;
    max-width: 760px;
    border-radius: 10px;
    background-color: #FFF;
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }
  .signInContentArea {
    width: 70%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  .signinProfileImage {
    width: 100%;
    height: 120px;
    position: absolute;
    top: -50px;
    left: 0;
  }
  .signinProfileImage img {
    height: 120px;
    width: 120px;
    border-radius: 50%;
    background-color: red;
  }
  .signInContentAreaPadding {
    padding: 20px;
    box-sizing: border-box;
  }
  .signInContentArea h1 {
    color: #353535;
    margin: 0;
    font-size: 24px;
  }

  .signInContentArea p {
    font-size: 16px;
    margin: 0;
    padding: 10px 0 ;
  }
  /* Input Styling */
  .inputText {
    width: 100%;
    height: 40px;
    border-radius: 5px 5px 0 0;
    background-color: #F5F5F5;
    padding: 0 10px;
    box-sizing: border-box;
    border: none;
    color: #222222;
    border-bottom: 2px solid #999999;
  }
  .inputText:last-child {
    margin-top: 10px;
  }
  .inputText::placeholder {
    color: #222222;
  }
  .inputText:focus {
      border-bottom: 2px solid #2E85E8;
  }
.inputText:valid {
    border-bottom: 2px solid #2E85E8;
}
  
  /* Auto Fill input styles */
  @keyframes autofill {
    to {
      color: #222222;
      background: #f4f4f4;
    }
  }
  input:-webkit-autofill {
    animation-name: autofill;
    animation-fill-mode: both;
  }
  /* Button Style */
  .btnArea {
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
  .signupButton {
    font-size: 16px;
    background: #2E85E8;
    border-radius: 20px;
    border: none;
    padding: 7px 40px;
    color: #fff;
    margin-right: 20px;
    cursor: pointer;
    transition: .3s;
    transition-property: background;
  } 
  .signupButton:hover {
    background: #2A74C8;
  }
  .moreOptionsLink {
    height: 30px;
    width: 30px;
    padding: 5px;
    box-sizing: border-box;
    border-radius: 50%;
    background: #FFF;
    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.1));
    transition: filter 0.3s;
    cursor: pointer;
  }
  .moreOptionsLink:hover {
    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2));
  }
  .moreOptionsLink:first-child {
      margin-right: 10px;
  }

  /* Footer Area */
  .signInFooterArea {
    background-color: #F7F7F7;
    padding: 20px;
    box-sizing: border-box;
    border-bottom-left-radius: 10px;
  }
  .signInFooterArea p {
    padding: 0;
  }
  .signInFooterArea a {
    text-decoration: none;
    color: #2E85E8;
    cursor: pointer;
  }
  .signInFooterArea a:hover {
    text-decoration: underline;
  }

  /* Image Wrapper */
  .signInImageArea {
    width: 30%;
    height: 100%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-image: url('../assets/images/signInBg.jpeg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  @media only screen and (max-width: 1024px) {
    .particleContainer {left: 0;}
    .signInContainer {padding: 40px 10px 10px;}
  }
  @media only screen and (min-width: 500.1px) {
    .signinProfileImage {display: none;}
  }
  @media only screen and (max-width: 500px) {
    .signInContainer {padding-top: 70px;}
    .signInImageArea {display: none;}
    .signInContentArea {width: 100%; border-radius: 10px; text-align: center;padding-top: 70px;}
    .signInFooterArea {border-bottom-right-radius: 10px;}
    .btnArea {justify-content: center; text-align: center;}
    .signupButton {margin-right: 0;}
    .moreOptionsLinkWrapper {width: 100%; display: flex; justify-content: center; padding: 20px 0 0;}
    .moreOptionsLink {margin: 0 5px !important;}
  }
</style>
