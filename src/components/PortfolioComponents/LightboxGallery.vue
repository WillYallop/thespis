<template>
    <div id="lightbox">

        <div @click.prevent="show" class="imgInner" :style="{ backgroundImage: `url(${thumbnail})` }">

        </div>

        <div class="lightBoxContainer" v-if="visible" @click="hide">
          <div class="imgDisplayContainer">
              <div class="imgDisplayWrapper">
                  <img :src="thumbnail">
              </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'lightbox',
    props: {
        thumbnail: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            visible: false,
        };
    },
    methods: {
        show() {
            this.visible = true;
        },
        hide() {
            this.visible = false;
        },
    },

};
</script>

<style scoped>



.lightBoxContainer{
    position: fixed;
    z-index: 6000;
    top: 50px;
    left: 250px;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    cursor: pointer;
}
.imgDisplayContainer {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.imgDisplayWrapper {
    width: 80%;
    height: 80%;
    max-width: 80%;
    max-height: 80%;
}
.imgDisplayWrapper img{
    width: 100%;
    height: 100%;
    object-fit: contain;
}
@media only screen and (max-width: 1024px) {
    .lightBoxContainer{
        top: 0;
        left: 0;
    }
    .imgDisplayWrapper {
        width: 90%;
        max-width: 90%;
    }
}
</style>