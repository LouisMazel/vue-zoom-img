<template>
  <div id="home">
    <div class="header">
      <img class="main-logo" alt="Vue logo" src="./assets/logo.svg" />
    </div>
    <h1 style="text-align: center">
      Zoom Img Directive
    </h1>
    <div class="content">
      <h2 style="text-align: center">
        Click an images
      </h2>
      <div class="content__wrapper">
        <img v-zoom-img="image" v-for="(image, i) in images" :key="i" :src="image" alt="" />
      </div>
      <div class="content__wrapper">
        <img
          v-zoom-img="`https://louismazel.github.io/maz-ui/_nuxt/img/jellynote.56a5989.jpg`"
          src="https://louismazel.github.io/maz-ui/_nuxt/img/jellynote.56a5989.jpg"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ZoomImg from './../../index'

const IMAGE_COUNT = 4

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default Vue.extend({
  name: 'Home',
  directives: {
    ZoomImg
  },
  data() {
    return {
      images: Array.from(Array(IMAGE_COUNT).keys()).map(
        () => `https://www.fillmurray.com/${getRandomInt(150, 350)}/${getRandomInt(150, 350)}`
      )
    }
  }
})
</script>

<style lang="scss">
#home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #212121;

  .header {
    display: flex;
    place-content: center;
    padding: 20px 10px;
    margin-bottom: 40px;

    .main-logo {
      max-height: 80px;
    }
  }

  .content {
    &__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 20px;

      > img {
        margin-bottom: 5px;
        margin-right: 5px;
        max-width: 90%;
      }
    }
  }
}
</style>
