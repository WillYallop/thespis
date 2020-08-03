<template>
  <div id="signup">
    <!-- Particle Area -->
    <div class="particleContainer">
      <div id="particles-js"></div>
    </div>
    <!-- Page Area -->


      <div class="signUpContainer">
        <div class="signUpWrapper darkmodeBackgroundColour">
          <div class="signUpContentAreaPadding">
            <h1>Sign in</h1>
            <p>Find talent, advertise positions for your film projects and share your portfolio of work!</p>
            <div class="inputHolder">
              <input type="text" id="signupFName" class="inputText" required v-model="fname" placeholder="First Name">
            </div>
            <div class="inputHolder">
              <input type="text" id="signupLName" class="inputText" required v-model="lname" placeholder="Last Name">
            </div>
            <div class="inputHolder">
              <input type="email" id="signupEmail" class="inputText" required v-model="email" placeholder="Email">
            </div>
            <div class="inputHolder">
              <input type="password" id="signupPassword" class="inputText" required v-model="password" placeholder="Password">
            </div>
            <div class="showPasswordChekboxWrapper">
              <label class="myCheckbox">
                <input type="checkbox" class="showPasswordCheckbox" ref="showPasswordCheckbox" name="showPasswordCheckbox" v-on:click="showPassword">
                <span></span>
              </label>
              <p v-on:click="showPasswordText">Show Password</p>
            </div>
            <div class="inputHolder">
              <select v-model="gender">
                <option disabled value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="btnArea">
              <button class="signupButton" v-on:click="signup">Sign up</button>
            </div>
          </div>
          <div class="signInFooterArea">
            <p>By signing up you agree to our <router-link to="/terms-service">Terms & Service</router-link> and <router-link to="/privacy-policy">Privacy Policy</router-link></p>
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
  name: 'signup',
  data: function() {
    return {
      fname: '',
      lname: '',
      email: '',
      password: '',
      gender: '',
      currentDate: null
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
    signup: function(e) {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(cred => {
        const db = firebase.firestore()
        return db.collection('users').doc(cred.user.uid).set({
          users_id: cred.user.uid,
          first_name: this.fname,
          last_name: this.lname,
          gender: this.gender,
          joined: this.currentDate
        });
        
      },
      err => {
        alert(err.message);
      }).then (() => {
        this.$router.go({ path: this.$router.path })
      });

       e.preventDefault();
    },
    initParticles() {
      window.particlesJS("particles-js", {
        "particles": {
          "number": {
            "value": 300,
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
    showPasswordText: function() {
      this.$refs.showPasswordCheckbox.click();
    },
    showPassword: function() {
      var x = document.getElementById("signupPassword");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
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
    left: 240px;
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
  .signUpContainer {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 40px 20px 40px;
    box-sizing: border-box;
  }
  .signUpWrapper {
    width: 100%;
    max-width: 760px;
    border-radius: 10px;
    background-color: #FFF;
    position: relative;
    
  }
  .signUpContentAreaPadding {
    padding: 20px;
    box-sizing: border-box;
  }
  .signUpWrapper h1 {
    color: #353535;
    margin: 0;
    font-size: 24px;
  }
  .darkmode--activated .signUpWrapper h1 {
    color: #FFF;
  }
  .signUpWrapper p {
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

  .inputHolder select {
    width: 100%;
    border: none;
    height: 40px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 2px solid #999999;
    box-sizing: border-box;
    background-color: #F5F5F5;
    padding: 0 10px;
}
  .inputHolder select:focus {
    outline: none;
    border-bottom: 2px solid #2E85E8;
  }
  .inputHolder select:valid {
    border-bottom: 2px solid #2E85E8;
  }

  /* input checkbox */
  .showPasswordChekboxWrapper {
    width: 100%;
    padding: 10px 0 ;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .showPasswordChekboxWrapper p {
    margin: 0;
    padding: 4px 0 0 10px;
    cursor: pointer;
    user-select: none;
  }
  .myCheckbox {
    height: 20px;
    width: 20px;
    position: relative;
    cursor: pointer;
  
  }
  .myCheckbox input {
    position: relative;
    z-index: -9999;
  }
  .myCheckbox span {
    height: 20px;
    width: 20px;
    position: absolute;
    top: 0;
    display: block;
    background-color: #FAFAFA;
    border: 1px solid #C5C5C5;
    border-radius: 50%;
  }
  .darkmode--activated .myCheckbox span {
    background-color: #161616;
    border: 1px solid #343434;
  }
  .myCheckbox input:checked + span {
    background-image: url(../assets/images/misc/materialIconTick2.png);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;

  }
  .showPasswordText {
    margin-left: 10px;
  }
  .showPasswordText p {
    font-size: 14px;
  }

  /* Auto Fill input styles */
  @keyframes autofillNightMode {
    to {
        color: #FFF;
        background: #161616;
        }
  }
  @keyframes autofill {
    to {
      color: #222222;
      background: #f4f4f4;
    }
  }
  .darkmode--activated input:-webkit-autofill {
      animation-name: autofillNightMode;
      animation-fill-mode: both;
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
  /* Footer Area */
  .signInFooterArea {
    background-color: #F7F7F7;
    padding: 20px;
    box-sizing: border-box;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
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
  @media only screen and (max-width: 1024px) {
    .particleContainer {left: 0;}
    .signUpContainer {padding: 40px 10px 40px;}
  }
  @media only screen and (max-width: 500px) { 
    .signUpContentAreaPadding {text-align: center}
    .signInFooterArea p {text-align: center}
    .btnArea {justify-content: center}
  }
  
</style>
