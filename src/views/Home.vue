<template>
  <div id="home">
    <div class="bannerContainer">
      <div class="bannerTextWrapper">
        <h1>THESPIS</h1>
        <h3>helping creatives find talent and work</h3>
        <div class="buttonWrapper">
          <button class="bannerBtn">Sign up</button>
        </div>
      </div>
      <div class="bannerImageWrapper">
        <img class="bannerPhoneImg" src="../assets/images/iphoneHeader.png" alt="">
      </div>
    </div>
    <div class="bannerSpacer"></div>
    <div class="infoBoxContainer">
      <div class="colOuter">
        <div class="colInner">
          <div class="boxIcon"></div>
          <h4>CREATE A PORTFOLIO</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt gravida dolor sit amet sagittis. Proin sed ex sodales dui dictum dignissim.</p>
        </div>
      </div>
      <div class="colOuter">
        <div class="colInner">
          <div class="boxIcon"></div>
          <h4>CREATE A PORTFOLIO</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt gravida dolor sit amet sagittis. Proin sed ex sodales dui dictum dignissim.</p>
        </div>
      </div>
      <div class="colOuter">
        <div class="colInner">
          <div class="boxIcon"></div>
          <h4>CREATE A PORTFOLIO</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt gravida dolor sit amet sagittis. Proin sed ex sodales dui dictum dignissim.</p>
        </div>
      </div>
      <div class="colOuter">
        <div class="colInner">
          <div class="boxIcon"></div>
          <h4>CREATE A PORTFOLIO</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt gravida dolor sit amet sagittis. Proin sed ex sodales dui dictum dignissim.</p>
        </div>
      </div>
    </div>

    <div class="homeSectionContainer1">
      <div class="homeSectionWrapper1">
        <div class="section1TextArea">
          <div class="section1TextAreaRow">
            <div class="titleSubRow">
              <div class="textAreaIcon"></div>
              <h4>CREATE A PORTFOLIO</h4>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt gravida dolor sit amet sagittis. Proin sed ex sodales dui dictum dignissim. Ut laoreet, sapien id vehicula egestas, mi nibh efficitur elit, eget maximus orci tortor et purus. Sed imperdiet sollicitudin nulla.</p>
          </div>
          <div class="section1TextAreaRow reserveText">
            <div class="titleSubRow marginMobile">
              <div class="textAreaIcon hideMobile"></div>
              <h4>GET HIRED</h4>
              <div class="textAreaIcon reserveIcon"></div>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt gravida dolor sit amet sagittis. Proin sed ex sodales dui dictum dignissim. Ut laoreet, sapien id vehicula egestas, mi nibh efficitur elit, eget maximus orci tortor et purus. Sed imperdiet sollicitudin nulla.</p>
          </div>
          <div class="mobileImgContainer">
            <img class="mobilePhoneImg" src="../assets/images/iphone2Home.png" alt="">
          </div> 
          <div class="section1TextAreaRow">
            <div class="titleSubRow">
              <div class="textAreaIcon"></div>
              <h4>GET HIRED</h4>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt gravida dolor sit amet sagittis. Proin sed ex sodales dui dictum dignissim. Ut laoreet, sapien id vehicula egestas, mi nibh efficitur elit, eget maximus orci tortor et purus. Sed imperdiet sollicitudin nulla.</p>
          </div>
          <div class="section1TextAreaRow reserveText">
            <div class="titleSubRow marginMobile">
              <div class="textAreaIcon hideMobile"></div>
              <h4>GET HIRED</h4>
              <div class="textAreaIcon reserveIcon"></div>
            </div>
            <p class="lastInCol">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt gravida dolor sit amet sagittis. Proin sed ex sodales dui dictum dignissim. Ut laoreet, sapien id vehicula egestas, mi nibh efficitur elit, eget maximus orci tortor et purus. Sed imperdiet sollicitudin nulla.</p>
          </div>
        </div>
        <div class="section1ImageArea">
          <img src="../assets/images/iphone2Home.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {

  }
}
</script>

<style scoped>
#home {
  background-color: #FAFAFA;
}
/* Banner Style */
.bannerContainer {
  width: 100%;
  padding-bottom: 150px;
  box-sizing: border-box;
  position: relative;
  background: linear-gradient(#eef3f8 0%, #dcecfb 100%);
}
.bannerSpacer {
  height: 150px;
  width: 100%;
}
.bannerTextWrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  box-sizing: border-box;
}
.bannerTextWrapper h1 {
  margin: 0;
  padding: 0 0 5px;
  color: #171717;
  letter-spacing: 0.14em;
  font-size: 50px;
  text-align: center;
}
.bannerTextWrapper h3 {
  margin: 0;
  padding: 0 0 30px;
  color: #4A4A4A;
  font-weight: normal;
  font-size: 25px;
  text-align: center;
}
.buttonWrapper {
  width: 100%;
  min-height: 32.62px;
  position: relative;
  display: flex;
  justify-content: center;
}
.bannerBtn {
  width: 180px;
  padding: 7px 20px;
  font-size: 16px;
  background-color: #119AE1;
  border: none;
  border-radius: 20px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  position: absolute;
  top: 0;
  transition: 0.2s;
  color: #FFF;
}
.bannerBtn:hover {
  padding: 14px 20px;
  top: -7px;
  border-radius: 30px;
}

.bannerImageWrapper {
  height: 300px;
  position: absolute;
  bottom: -150px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.bannerPhoneImg {
  width: 80%;
  object-fit: contain;
}
/* Col Boxes */
.infoBoxContainer {
  width: 100%;
  max-width: 1240px;
  margin-left: auto;
  margin-right: auto;
  padding: 50px 10px 100px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
}
.infoBoxTitleArea {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
}
.infoBoxTitleArea h2 {
  margin: 0;
  padding: 0 0 20px;
}
.infoBoxTitleArea p {
  margin: 0;
  padding: 0 0 50px;
  max-width: 900px;
}
.colOuter {
  width: 50%;
  padding: 10px;
  box-sizing: border-box;
}
.colInner {
  width: 100%;
  border-radius: 10px;
  background: #EEF3F8;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.09);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.boxIcon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #C4E0FB;
  margin-bottom: 20px;
}
.colInner h4 {
  margin: 0;
  padding: 0 0 10px;
}
.colInner p {
  margin: 0;
  padding: 0;
}

/*Section 2*/
.homeSectionContainer1 {
  width: 100%;
  padding: 100px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #EEF3F8;

}
.homeSectionWrapper1 {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap-reverse;
  align-items: center;
}
.section1TextArea {
  width: 60%;
  padding: 0;
  box-sizing: border-box;
}
.titleSubRow {
  display: inline;
  display: flex;
  align-items: center;
}
.textAreaIcon {
  height: 40px;
  width: 40px;
  background-color: #C4E0FB;
  border-radius: 50%;
}

.titleSubRow h4 {
  margin: 0;
  padding: 0;
  padding-left: 10px;
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 0.14em;
}
.section1TextArea p {
  margin: 0;
  padding: 0;
  font-size: 16px;
  padding: 20px 0 30px;
}
.lastInCol {
  padding-bottom: 0 !important;
}
.section1TextAreaRow {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.section1ImageArea {
  width: 40%;
  min-height: 100%;
  display: flex;
  justify-content: flex-end;
}
.section1ImageArea img {
  max-height: 600px;
}
.mobileImgContainer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 50px;
}
.mobilePhoneImg {
  max-height: 600px;
}


/* Start of media queries for banner phone image */
@media only screen and (max-width: 1630px) {
  .bannerImageWrapper {height: 280px;bottom: -140px;}
  .bannerContainer {padding-bottom: 140px;}
  .bannerSpacer {height: 140px;}
}
@media only screen and (max-width: 1400px) {
  .bannerImageWrapper {height: 200px;bottom: -100px;}
  .bannerContainer {padding-bottom: 100px;}
  .bannerSpacer {height: 100px;}
}
@media only screen and (max-width: 1170px) {
  .bannerImageWrapper {height: 150px;bottom: -75px;}
  .bannerContainer {padding-bottom: 75px;}
  .bannerSpacer {height: 75px;}
}
@media only screen and (max-width: 600px) {
  .bannerImageWrapper {height: 100px;bottom: -50px;}
  .bannerContainer {padding-bottom: 50px;}
  .bannerSpacer {height: 50px;}
  .bannerPhoneImg {width: 90%}
  .infoBoxTitleArea {width: 90%}

  .bannerTextWrapper h3 {font-size: 20px;}
  .infoBoxTitleArea p {padding:  0 0 30px;}
}
/* End of media queries for banner phone image */
@media only screen and (min-width: 950.1px) {
  .mobileImgContainer {display: none;}
  .reserveIcon {display: none;}
}
@media only screen and (max-width: 950px) {
  .section1TextArea {width: 100%;}
  .section1ImageArea {display: none;}
  .hideMobile {display: none;}
  .marginMobile h4 {margin-right: 5px; margin-left: 0;}
  .reserveText {align-items: flex-end;text-align: end;}
}


@media only screen and (max-width: 850px) {
  .infoBoxContainer {padding: 50px 0 50px}
  .homeSectionContainer1 {padding: 50px 20px;}
}
@media only screen and (max-width: 500px) {
  .infoBoxContainer {
    justify-content: center;
  }
  .colOuter {width: 90%;}
}
</style>