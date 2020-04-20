<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
const customTitlebar = require('custom-electron-titlebar');

  export default {
    name: 'Simper',
    mounted(){/*
      new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#333333')
      });*/
    }
  }
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Open Sans', sans-serif;
}

html {
  background-color: #272727;
}

h1, h2, h3, h4, h5 {
  font-weight: normal;
}

input.input {
  padding: 5px 10px;
  border: 1px solid #272727;
  background: #333333;
  color: #e6e6e6;
  font-size: 16px;
  outline: none;

  &:hover {
    border-color: #131313;
  }

  &:focus {
    border-color: #131313;
    box-shadow: inset 0 0 8px 0 rgba(0, 0, 0, 0.2);
  }
}

/* Regex Colorizer no bg theme */

.regex       {font-family: Monospace;}
.regex b     {color: #0707ee;} /* metasequence */
.regex i     {color: #1db000;} /* char class */
.regex i b   {color: #007a09;} /* char class: metasequence */
.regex i u   {color: #007a09;} /* char class: range-hyphen */
.regex b.g1  {color: #ec9b00;} /* group: depth 1 */
.regex b.g2  {color: #9d6400;} /* group: depth 2 */
.regex b.g3  {color: #c24699;} /* group: depth 3 */
.regex b.g4  {color: #00909d;} /* group: depth 4 */
.regex b.g5  {color: #81009d;} /* group: depth 5 */
.regex b.err {color: #d50000;} /* error */
.regex b, .regex i, .regex u {font-weight: normal; font-style: normal; text-decoration: none;}
</style>
