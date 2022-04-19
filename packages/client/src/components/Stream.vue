<template>
  <div class="stream">
    <StreamStats v-if="debugMode" :stream="stream"></StreamStats>
    <div :id="stream && stream.id" class="player-container" @click="$emit('choose-stream', stream)"></div>
    <div v-if="stream" class="info-bar">
      <div class="info">
        {{stream.userId}}<span v-if="stream.getMediaType() === 'screen'">(<i class="el-icon-monitor" title="屏幕共享流"/>)</span>
      </div>
      <div class="opt">
        <el-button v-if="stream && !stream.isLocal && stream.small" type="text" icon="el-icon-copy-document" title="切换大小流" :disabled="isSwitching" @click="onSwitchSubscribe"></el-button>
        <el-button v-if="stream && !stream.isLocal" type="text" icon="el-icon-refresh" title="取消并重新订阅" :disabled="isRefreshing" @click="onResubscribe"></el-button>
        <StreamSettings v-if="stream && stream.isLocal && stream.getMediaType() === 'camera'" :stream="stream"></StreamSettings>
      </div>
    </div>
    <div v-if="stream && stream.isLocal" class="state-bar">
      <div v-if="stream.hasAudio()" class="state micphone" @click="muteAudio">
        <i v-show="stream.audioMuted" title="开麦" class="el-icon-turn-off-microphone clickable"></i>
        <i v-show="!stream.audioMuted" title="关麦" class="el-icon-microphone clickable"></i>
      </div>
      <div v-if="stream.hasVideo()" class="state camera" @click="muteVideo">
        <i v-show="stream.videoMuted" title="打开开摄像头" class="iconfont icon-shexiangtou_guanbi clickable"></i>
        <i v-show="!stream.videoMuted" title="关闭摄像头" class="iconfont icon-shexiangtou clickable"></i>
      </div>
    </div>
    <div v-if="stream && !stream.isLocal" class="state-bar">
      <div v-if="stream.hasAudio()" class="state micphone" @click="muteAudio">
        <i v-show="stream.audioMuted" title="打开声音" class="iconfont icon-shengyinjingyin clickable"></i>
        <i v-show="!stream.audioMuted" title="关闭声音" class="iconfont icon-shengyinkai clickable"></i>
      </div>
      <div v-if="stream.hasVideo()" class="state camera" @click="muteVideo">
        <i v-show="stream.videoMuted" title="打开画面" class="iconfont icon-live_fill clickable"></i>
        <i v-show="!stream.videoMuted" title="关闭画面" class="iconfont icon-live clickable"></i>
      </div>
      <div v-if="stream.hasAudio()" class="state micphone">
        <i v-show="stream.sourceAudioMuted" title="远端已关麦" class="el-icon-turn-off-microphone unclickable"></i>
        <i v-show="!stream.sourceAudioMuted" title="远端已开麦" class="el-icon-microphone unclickable"></i>
      </div>
      <div v-if="stream.hasVideo()" class="state camera">
        <i v-show="stream.sourceVideoMuted" title="远端已关闭摄像头" class="iconfont icon-shexiangtou_guanbi unclickable"></i>
        <i v-show="!stream.sourceVideoMuted" title="远端已打开摄像头" class="iconfont icon-shexiangtou unclickable"></i>
      </div>
    </div>
  </div>
</template>

<script>
import StreamStats from './StreamStats.vue'
import StreamSettings from './StreamSettings.vue'
import { store } from '../store'
import { getRTCInstance } from '../rtc'
import { log } from '../utils/logger'

export default {
  components: {
    StreamStats,
    StreamSettings,
  },
  data() {
    return {
      rtc: getRTCInstance(),
      isSwitching: false,
      isRefreshing: false,
      debugMode: store.state.advanceSettings.debugMode
    }
  },
  props: ['stream'],
  methods: {
    muteAudio() {
      if (this.stream.audioMuted) {
        this.stream.unmuteAudio()
      } else {
        this.stream.muteAudio()
      }
    },
    muteVideo() {
      if (this.stream.videoMuted) {
        this.stream.unmuteVideo()
      } else {
        this.stream.muteVideo()
      }
      this.$emit('reload-chosen-stream', this.stream)
    },
    onSwitchSubscribe: async function() {
      this.isSwitching = true
      this.$emit('before-reload-chosen-stream', this.stream)
      await this.rtc.switchSubscribe(this.stream)
      this.$emit('reload-chosen-stream', this.stream)
      this.isSwitching = false
    },
    onResubscribe: async function() {
      this.isRefreshing = true
      this.$emit('before-reload-chosen-stream', this.stream)
      try {
        await this.rtc.unsubscribe(this.stream)
      } catch (err) {
        log.warn('unsubscribe ', err)
      }
      try {
        await this.rtc.subscribe(this.stream)
      } catch (err) {
        log.warn('subscribe ', err)
      }
      this.$emit('reload-chosen-stream', this.stream)
      this.isRefreshing = false
    },
  }
}
</script>

<style scoped>
.stream {
  position: relative;
  min-height: 160px;
  background-color: #000;
  border-radius: 4px;
  overflow: hidden;
}

.stream .player-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.stream .clickable {
  cursor: pointer;
}
.stream .unclickable {
  color: #ccc;
  cursor: not-allowed;
}

.stream .info-bar {
  position: absolute;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
}
.stream .info-bar .info {
  display: inline-block;
  line-height: 20px;
  margin: 0 4px;
}

.stream .info-bar .opt {
  float: right;
}

.stream .info-bar .opt .el-button--text {
  margin: 0 4px;
  padding: 0;
  color: #fff;
}

.stream .state-bar {
  position: absolute;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
  text-align: right;
}

.stream .state-bar .state {
  display: inline-block;
  line-height: 20px;
  margin: 0 4px;
}
</style>
