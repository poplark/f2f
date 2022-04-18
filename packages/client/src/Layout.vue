<template>
  <router-view></router-view>
</template>
<style>
html,
body {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
body > .app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
body > .app > .el-container {
  overflow: hidden;
}
</style>

