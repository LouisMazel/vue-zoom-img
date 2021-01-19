# vue-zoom-img

[![license](https://img.shields.io/github/license/LouisMazel/vue-zoom-img.svg?style=flat-square)](https://github.com/LouisMazel/vue-zoom-img/blob/master/LICENSE)
[![vue 2](https://img.shields.io/badge/vue-2-42b983.svg?style=flat-square)](https://vuejs.org)
[![npm](https://img.shields.io/npm/v/vue-zoom-img.svg?style=flat-square)](https://www.npmjs.com/package/vue-zoom-img)
[![npm](https://img.shields.io/npm/dt/vue-zoom-img.svg?style=flat-square)](https://www.npmjs.com/package/vue-zoom-img)
[![Codacy grade](https://img.shields.io/codacy/grade/3d15a7c11bfe47c69a2aed93cc67cc29.svg?style=flat-square)](https://www.codacy.com/app/LouisMazel/vue-zoom-img)

[![npm](https://nodei.co/npm/vue-zoom-img.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/vue-zoom-img)

> [Vue Zoom Img](https://louismazel.github.io/vue-zoom-img/) is a [VueJS](https://vuejs.org) & [NuxtJS](https://nuxtjs.org/) drective to display a preview of a picture

## Demo

[Demo](https://louismazel.github.io/vue-zoom-img/)

```shell
npm install vue-zoom-img

# Or yarn add vue-zoom-img
```

### How to use it

```html

<template>
  <div>
    <img
      src="<PATH_OF_YOUR_PICTURE>"
      v-zoom-img="<PATH_OF_YOUR_PICTURE>"
    />
    <img
      src="<PATH_OF_YOUR_PICTURE>"
      v-zoom-img="{
        src: <PATH_OF_YOUR_PICTURE>,
        alt: '<ALT_STRING_VALUE>',
        disabled: <TRUE_OR_FALSE>,
        blur: <TRUE_OR_FALSE>,
        scale: <TRUE_OR_FALSE>
      }"
    />
  </div>
</template>

<script>
  import VueZoomImg from 'vue-zoom-img'

  export default {
    directives: {
      'zoom-img': VueZoomImg
    }
  }
</script>
```

## LICENSE

[MIT](LICENSE)