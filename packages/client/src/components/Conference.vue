<template>
<div>
  <div v-if="rtc.localStream" class="local-streams">
    <Stream :stream="rtc.localStream" v-on:choose-stream="onChooseStream"></Stream>
  </div>
  <div class="remote-streams">
    <Stream :stream="stream" :key="stream.id" v-for="stream in rtc.remoteStreams" v-on:choose-stream="onChooseStream" v-on:before-reload-chosen-stream="onBeforeReloadChosenStream" v-on:reload-chosen-stream="onReloadChosenStream"></Stream>
  </div>
</div>
</template>

<script setup>
import { defineProps, defineExpose, nextTick, reactive, ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { getRTCInstance } from '../rtc';
import { ElMessage, ElNotification } from 'element-plus';
import Stream from './Stream.vue';

const props = defineProps({
  room: {
    type: Object,
    default: null,
  }
});

const room = ref(props.room);

const instance = getCurrentInstance();
const rtc = reactive(getRTCInstance({
  '$message': ElMessage,
  '$notify': ElNotification,
}));

window.a = instance;
window.b = rtc;
console.log('7777 ', props.room);
console.log('8888 ', instance);
console.log('9999 ', rtc);

function join(channel, username) {
  rtc.init();
  rtc.join(channel, username)
    .then((res) => {
      console.log('join room success', res);
      rtc.publish()
        .then(() => {
          const localStream = rtc.localStream
          nextTick(() => {
            if (localStream) {
              rtc.playLocalStream(localStream)
            }
          })
        })
        .catch((err) => {
          ElNotification.error({
            title: '发布失败',
            message: `${err}`
          })
        })
    })
    .catch((err) => {
      console.log('join room failed', err);
    });
}

function leave() {
  rtc.leave();
}

onMounted(() => {
  console.log('mounted conference');
});

onUnmounted(() => {
  leave();
});

defineExpose({
  join,
  leave,
});
</script>
