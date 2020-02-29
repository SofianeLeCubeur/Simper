<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
const customTitlebar = require('custom-electron-titlebar');

  export default {
    name: 'diamaths',
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
</style>
