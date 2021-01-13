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
        <h3>
          Scale & Blur Effect
        </h3>
        <div class="content__wrapper__images">
          <img
            v-zoom-img="{ src: image, alt: 'placecage', scale: true, blur: true }"
            v-for="(image, i) in images"
            :key="i"
            :src="image"
            alt="placecage"
          />
        </div>
        <VueCodeHighlight class="content__wrapper__code" language="javascript">
          <pre>
            &lt;img&gt;
              v-zoom-img="{ src: 'https://www.placecage.com/gif/500/500', alt: 'placecage', scale: true, blur: true }"
              src="https://www.placecage.com/gif/500/500"
              alt="placecage"
            /&gt;
          </pre>
        </VueCodeHighlight>
      </div>
      <div class="content__wrapper">
        <h3>
          No Blur Effect
        </h3>
        <div class="content__wrapper__images">
          <img
            v-zoom-img="{ src: image, alt: 'placecage', scale: true, blur: false }"
            v-for="(image, i) in images"
            :key="i"
            :src="image"
            alt="placecage"
          />
        </div>
        <VueCodeHighlight class="content__wrapper__code" language="javascript">
          <pre>
            &lt;img&gt;
              v-zoom-img="{ src: 'https://www.placecage.com/gif/500/500', alt: 'placecage', scale: true, blur: false }"
              src="https://www.placecage.com/gif/500/500"
              alt="placecage"
            /&gt;
          </pre>
        </VueCodeHighlight>
      </div>
      <div class="content__wrapper">
        <h3>
          No Scale & Blur Effect
        </h3>
        <div class="content__wrapper__images">
          <img
            v-zoom-img="{ src: image, alt: 'placecage', scale: false, blur: false }"
            v-for="(image, i) in images"
            :key="i"
            :src="image"
            alt="placecage"
          />
        </div>
        <VueCodeHighlight class="content__wrapper__code" language="javascript">
          <pre>
            &lt;img&gt;
              v-zoom-img="{ src: 'https://www.placecage.com/gif/500/500', alt: 'placecage', scale: false, blur: false }"
              src="https://www.placecage.com/gif/500/500"
              alt="placecage"
            /&gt;
          </pre>
        </VueCodeHighlight>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ZoomImg from './../../index'
import { component as VueCodeHighlight } from 'vue-code-highlight'
import 'vue-code-highlight/themes/duotone-sea.css'
import 'vue-code-highlight/themes/window.css'

const IMAGE_COUNT = 4

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default Vue.extend({
  name: 'Home',
  components: {
    VueCodeHighlight
  },
  directives: {
    ZoomImg
  },
  data() {
    return {
      images: Array.from(Array(IMAGE_COUNT).keys()).map(
        () => `https://www.placecage.com/gif/${getRandomInt(250, 350)}/${getRandomInt(150, 350)}`
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
      flex-direction: column;
      flex-wrap: wrap;
      margin-bottom: 20px;

      &__images {
        display: flex;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        > img {
          margin-bottom: 5px;
          margin-right: 5px;
          max-width: 90%;
        }
      }

      &__code {
        margin-top: 20px;
      }
    }
  }
}
</style>
