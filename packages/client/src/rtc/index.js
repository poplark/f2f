import { generateToken, version } from 'urtc-sdk'
import { createClient, createStream, isSupportScreenShare, RemoteStream, getDevices, getMicrophones, getCameras, setLogLevel, setServers } from './polyfill'
// import { plugin as MixAPIPlugin } from '@urtc/plugin-mix'
import { store } from '../store'
import { smallProfileMappings } from './profiles'
import { log } from '../utils/logger'
import { isMobile } from '../utils/browser'
import VConsole from 'vconsole'

export async function updateMicrophones(vm) {
  try {
    const devices = await getMicrophones()
    const microphones = devices.filter(item => item.deviceId && 'communications' !== item.deviceId)
    store.commit('updateMicrophones', microphones)
    return microphones
  } catch (err) {
    vm.$notify.warning({
      title: `获取麦克风信息失败`,
      message: `${err}`
    })
  }
}

export async function updateCameras(vm) {
  try {
    const cameras = await getCameras()
    store.commit('updateCameras', cameras)
    return cameras
  } catch (err) {
    vm.$notify.warning({
      title: `获取摄像头信息失败`,
      message: `${err}`
    })
  }
}

export async function updateDevices(vm) {
  try {
    const devices = await getDevices()
    const microphones = devices.filter(item => 'audioinput' === item.kind && item.deviceId && 'communications' !== item.deviceId)
    store.commit('updateMicrophones', microphones)
    const cameras = devices.filter(item => 'videoinput' === item.kind && item.deviceId)
    store.commit('updateCameras', cameras)
    return [microphones, cameras]
  } catch (err) {
    vm.$notify.warning({
      title: `获取设备信息失败`,
      message: `${err}`
    })
  }
}

let instance = undefined

// Client.use(MixAPIPlugin)

class RTC {
  init() {
    if (store.state.advanceSettings.debugMode) {
      setLogLevel('debug')
      if (isMobile) new VConsole()
    } else {
      setLogLevel('warn')
    }

    if (store.state.advanceSettings.mediaServer) {
      setServers({
        signal: store.state.advanceSettings.mediaServer
      })
    } else {
      if (!store.state.advanceSettings.prodEnv) {
        setServers({
          gateway: 'https://pre.urtc.com.cn',
          log: 'https://logpre.urtc.com.cn'
        })
      } else {
        setServers({
          gateway: 'https://urtc.com.cn',
          log: 'https://log.urtc.com.cn'
        })
      }
    }

    this.client = createClient(store.state.advanceSettings.appId, {
      codec: store.state.advanceSettings.videoCodec
    })
    // this.client
    //   .$mixer
    //   .on('record-notify', (evt) => {
    //     log(`录制事件 [${evt.data.code}]: ${evt.data.message}`)
    //   })
    if (store.state.advanceSettings.debugMode) {
      window.p = this.client
    }
  }

  localStream = undefined
  localScreenStream = undefined
  remoteStreams = []
  isSupportScreenShare = isSupportScreenShare()

  isJoined = false
  needResume = false
  playBlockedStreams = []

  vm = undefined

  async join(channel, username) {
    if (this.isJoined) return
    if (store.state.advanceSettings.enableSmallStream && 'function' === typeof this.client.enableSmallStream) {
      const profile = smallProfileMappings[store.state.advanceSettings.smallVideoProfile]
      await this.client.enableSmallStream(profile)
    }
    const token = generateToken(store.state.advanceSettings.appId, store.state.advanceSettings.appKey, channel, username)
    this.client.init(channel, username, token, {
      type: store.state.advanceSettings.roomType,
      role: store.state.advanceSettings.roleType,
    })
    this.bindEvents()
    try {
      await this.client.join(channel, username, token, {
        type: store.state.advanceSettings.roomType,
        role: store.state.advanceSettings.roleType,
      })
      log('加入房间成功')
      this.watchUplinkDelay()
      this.isJoined = true
    } catch (err) {
      log('加入房间失败', err)
      throw err
    }
  }
  async leave() {
    if (!this.isJoined) return
    try {
      await this.client.leave()
      log('离开房间成功')
      this.unbindEvents()
      this.reset()
    } catch (err) {
      log('离开房间失败', err)
    }
  }

  getUplinkDelayTimer = 0
  watchUplinkDelay() {
    this.unwatchUplinkDelay()
    this.getUplinkDelayTimer = window.setInterval(async () => {
      let stats = { network: { rtt: -1 } }
      if (this.localStream) {
        stats = await this.localStream.getStats()
      } else if (this.localScreenStream) {
        stats = await this.localScreenStream.getStats()
      }
      if (stats.network) {
        store.commit('updateUplinkDelay', stats.network.rtt)
      }
    }, 1000)
  }
  unwatchUplinkDelay() {
    if (this.getUplinkDelayTimer) {
      window.clearInterval(this.getUplinkDelayTimer)
    }
    this.getUplinkDelayTimer = 0
  }

  async initLocalPicStream(picture) {
    let stream = createStream(this.client.innerClient, {
      audio: true,
      video: !store.state.advanceSettings.audioMode,
      screen: false,
      file: picture.raw,
    })
    try {
      await stream.init()
    } catch (err) {
      log('初始化本地图片流失败', err)
    }
    this.localStream = stream
    return stream
  }

  async initLocalStream() {
    let microphoneId = store.state.advanceSettings.microphoneId || (store.state.microphones[0] && store.state.microphones[0].deviceId)
    let cameraId = store.state.advanceSettings.cameraId || (store.state.cameras[0] && store.state.cameras[0].deviceId)
    if (!microphoneId || !cameraId) {
      const [microphones,  cameras] = await updateDevices(this.vm)
      microphoneId = microphones[0] && microphones[0].deviceId
      cameraId = cameras[0] && cameras[0].deviceId
    }

    let stream = createStream(this.client.innerClient, {
      audio: true,
      video: !store.state.advanceSettings.audioMode,
      screen: false,
      microphoneId,
      cameraId,
    })
    if (!store.state.advanceSettings.audioMode) {
      await stream.setVideoProfile(store.state.advanceSettings.videoProfile)
    }
    try {
      await stream.init()
    } catch (err) {
      log('初始化本地流失败', err)
      if (err.name === 'OverconstrainedError' && (store.state.advanceSettings.microphoneId || store.state.advanceSettings.cameraId)) {
        this.vm && this.vm.$notify.info({
          title: '初始化本地流',
          message: `指定的设备无法初始化本地流，已切换设备初始化本地流`
        })
        const [microphones, cameras] = await updateDevices(this.vm)
        microphoneId = microphones[0] && microphones[0].deviceId || ''
        cameraId = cameras[0] && cameras[0].deviceId || ''
        store.commit('updateAdvanceSettings', { microphoneId, cameraId })
        stream = createStream(this.client.innerClient, {
          audio: true,
          video: true,
          screen: false,
          microphoneId,
          cameraId,
        })
        await stream.setVideoProfile(store.state.advanceSettings.videoProfile)
        await stream.init()
      } else {
        throw err
      }
    }
    this.localStream = stream
    return stream
  }
  async publish() {
    if (!this.localStream) {
      if (store.state.picture) {
        await this.initLocalPicStream(store.state.picture)
      } else {
        await this.initLocalStream()
      }
    }
    try {
      await this.client.publish(this.localStream)
    } catch (err) {
      log('发布失败', err)
      throw err
    }
  }
  async unpublish() {
    if (this.localStream) {
      await this.client.unpublish(this.localStream)
      this.localStream.destroy()
      this.localStream = undefined
    }
  }
  async initLocalScreenStream() {
    const stream = createStream(this.client.innerClient, {audio: !!store.state.advanceSettings.shareMic, video: false, screenAudio: true, screen: true})
    stream.setScreenProfile(store.state.advanceSettings.screenProfile)
    stream.on('screen-sharing-stopped', () => {
      this.unpublishScreen()
        .catch((err) => {
          this.vm && this.vm.$notify.error({
            title: '取消屏幕共享流失败',
            message: `${err}`
          })
        })
    })
    try {
      await stream.init()
    } catch (err) {
      log('初始化屏幕共享流失败', err)
      throw err
    }
    this.localScreenStream = stream
    return stream
  }
  async publishScreen() {
    if (!this.localScreenStream) {
      await this.initLocalScreenStream()
    }
    try {
      await this.client.publish(this.localScreenStream)
    } catch (err) {
      log('发布屏幕共享失败', err)
      throw err
    }
  }
  async unpublishScreen() {
    if (this.localScreenStream) {
      await this.client.unpublish(this.localScreenStream)
      this.localScreenStream.destroy()
      this.localScreenStream = undefined
    }
  }

  async switchSubscribe(stream) {
    try {
      await this.client.switchSubscribe(stream)
    } catch (err) {
      log(`切换${stream.userId}大小流失败 `, err)
      this.vm && this.vm.$notify.warning({
        title: `切换${stream.userId}大小流失败`,
        message: `${err}`
      })
    }
  }

  async subscribe(stream) {
    const opts = stream.small ? { small: true } : undefined
    try {
      await this.client.subscribe(stream, opts)
    } catch (err) {
      log(`${stream.userId} 订阅失败 ${err}`)
      this.vm && this.vm.$notify.warning({
        title: `订阅${stream.userId}失败`,
        message: `${err}`
      })
    }
  }
  async unsubscribe(stream) {
    try {
      await this.client.unsubscribe(stream)
    } catch (err) {
      log(`${stream.userId} 取消订阅失败 ${err}`)
      this.vm && this.vm.$notify.warning({
        title: `取消订阅${stream.userId}失败`,
        message: `${err}`
      })
    }
  }

  handleUserJoin = (evt) => {
    log('用户加入 ', evt)
  }
  handleUserLeave = (evt) => {
    log('用户离开 ', evt)
  }
  handleStreamPublished = (evt) => {
    log('流已发布 ', evt)
  }
  handleStreamAdded = (evt) => {
    log('流已加入 ', evt)
    const stream = new RemoteStream(this.client.innerClient, evt)
    this.remoteStreams.push(stream)
    // 自动订阅 - 有小流时，自动订阅小流，没有小流时订阅大流
    this.subscribe(stream)
  }
  handleStreamUpdated = (evt) => {
    log('流已变更 ', evt.data.userId, evt.data.small)
    const stream = evt.data
    this.vm && this.vm.onBeforeReloadChosenStream && this.vm.onBeforeReloadChosenStream(stream)
    this.client
      .switchSubscribe(stream)
      .then(() => {
        this.vm && this.vm.onReloadChosenStream && this.vm.onReloadChosenStream(stream)
      })
      .catch((err) => {
        log(`${stream.userId} 切换失败 ${err}`, err.code, err.name, err.message)
        this.vm && this.vm.$notify.warning({
          title: `自动切换大小流${stream.userId}失败`,
          message: `${err}`
        })
      })
  }
  handleStreamSubscribed = (evt) => {
    log('流已订阅 ', evt)
    const stream = this.remoteStreams.find((item) => item.sid === evt.sid)
    if (!stream) return
    stream.update(evt)
    stream.play(stream.id, { controls: 'hide' }).catch((err) => {
      log(`${stream.userId} 播放失败 ${err}`)
      // 解决 elementUI 重复调用 message 时，多个 message 重叠的问题
      setTimeout(() => {
        this.vm && this.vm.$message.warning(`自动播放${stream.userId}的流失败，播放错误：${err.message}`)
      }, 0)
      this.playBlockedStreams = this.playBlockedStreams.concat(stream)
      this.needResume = true
    })
  }
  handleStreamRemoved = (evt) => {
    log('流已移除 ', evt)
    const stream = this.remoteStreams.find((item) => item.sid === evt.sid)
    this.remoteStreams = this.remoteStreams.filter((item) => item !== stream)
  }
  handleAudioMuted = (evt) => {
    log('流的音频已 mute ', evt)
    const stream = this.remoteStreams.find((item) => item.sid === evt.sid)
    stream && stream.update(evt)
  }
  handleAudioUnmuted = (evt) => {
    log('流的音频已 unmute ', evt)
    const stream = this.remoteStreams.find((item) => item.sid === evt.sid)
    stream && stream.update(evt)
  }
  handleVideoMuted = (evt) => {
    log('流的视频已 mute ', evt)
    const stream = this.remoteStreams.find((item) => item.sid === evt.sid)
    stream && stream.update(evt)
  }
  handleVideoUnmuted = (evt) => {
    log('流的视频已 unmute ', evt)
    const stream = this.remoteStreams.find((item) => item.sid === evt.sid)
    stream && stream.update(evt)
  }
  handleKickoff = (evt) => {
    log('当前账号已在异地登录 ', evt)
    this.vm && this.vm.$notify.error({
      title: '警告',
      message: `当前账号已在异地登录`
    })
    this.reset()
  }
  handleNetworkQuality = (evt) => {
    console.log(`上行 / 下行网络质量：${evt.uplink} / ${evt.downlink}`)
    store.commit('updateUplinkQuality', evt.uplink)
    store.commit('updateDownlinkQuality', evt.downlink)
  }
  handleConnectionStateChanged = (evt) => {
    log(`连接状态：${evt.previous} => ${evt.current}`)
  }
  handleStreamReconnecting = (evt) => {
    const stream = evt.data
    log(`流 ${stream.userId} (${stream.getMediaType()}) 正在重连`)
    // 解决 elementUI 重复调用 message 时，多个 message 重叠的问题
    setTimeout(() => {
      this.vm && this.vm.$message.warning(`流 ${stream.userId} (${stream.getMediaType()}) 正在重连`)
    }, 0)
  }
  handleStreamReconnected = (evt) => {
    const {previous, current} = evt
    const stream = previous.type === 'subscribe'
      ? this.remoteStreams.find((item) => item.sid === previous.sid)
      : this.localStream && this.localStream.sid === previous.sid
        ? this.localStream
        : this.localScreenStream
    if (!stream) return
    stream.update(current)
    stream.play(stream.id, { controls: 'hide' }).catch((err) => {
      log(`${stream.userId} 播放失败 ${err}`)
      // 解决 elementUI 重复调用 message 时，多个 message 重叠的问题
      setTimeout(() => {
        this.vm && this.vm.$message.warning(`自动播放${stream.userId}的流失败，播放错误：${err.message}`)
      }, 0)
      this.playBlockedStreams = this.playBlockedStreams.concat(stream)
      this.needResume = true
    })
    log(`流 ${stream.userId} (${stream.getMediaType()}) 已经重连`)
    setTimeout(() => {
      this.vm && this.vm.$message.success(`流 ${stream.userId} (${stream.getMediaType()}) 已经重连`)
      this.vm && this.vm.onReloadChosenStream && this.vm.onReloadChosenStream(stream)
    }, 0)
  }
  handleDeviceChanged = (evt) => {
    log('设备变化 ', evt.data.type, evt.data.status, evt.data.device)
    const type = 'microphone' === evt.data.type ? '麦克风' : 'camera' === evt.data.type ? '摄像头' : '扬声器/耳机'
    const action = 'add' === evt.data.status ? '插入' : '拔出'
    // 解决 elementUI 重复调用 message 时，多个 message 重叠的问题
    setTimeout(() => {
      this.vm && this.vm.$message(`${type}[${evt.data.device.label}]已${action}`)
    }, 0)
  }
  handlePlayerStatusChanged = (evt) => {
    log('播放器状态变化 ', evt.type, evt.status, evt.stream)
    if (evt.status === 'paused') {
      setTimeout(() => {
        this.vm && this.vm.$message.warning(`${evt.stream.uid}的流的${evt.type}暂停了播放`)
        if (evt.type === 'audio') {
          setTimeout(() => {
            const stream = new RemoteStream(this.client.innerClient, evt.stream)
            stream.resume().catch((err) => {
              this.vm && this.vm.$message.warning(`自动恢复播放${evt.stream.uid}的流的${evt.type}失败`, err)
              this.playBlockedStreams = this.playBlockedStreams.concat(stream)
              this.needResume = true
            })
          }, 1000)
        }
      }, 0)
    }
  }
  handleAudioTrackEnded = (evt) => {
    log.warn(`音频被终止: [${evt.uid}] ${evt.mediaType}`)
    setTimeout(() => {
      this.vm && this.vm.$message.warning(`${evt.uid} (${evt.mediaType})的音频被终止，可能无法恢复，建议重新上麦`)
    }, 0)
  }
  handleError = (evt) => {
    log.warn(`出现错误: [${evt.code}] ${evt.message}`)
    setTimeout(() => {
      if (evt.code === '3024') {
        this.vm && this.vm.$message.error(`当前网络无法使用音视频通话服务，可检测网络设置或网络防火墙，或直接尝试切换至其他网络使用`)
      } else {
        this.vm && this.vm.$message.error(`出现错误 [${evt.code}] (${evt.message})`)
      }
    }, 0)
  }

  bindEvents() {
    this.client
      .on('user-added', this.handleUserJoin)
      .on('user-removed', this.handleUserLeave)
      .on('stream-published', this.handleStreamPublished)
      .on('stream-added', this.handleStreamAdded)
      .on('stream-subscribed', this.handleStreamSubscribed)
      .on('stream-removed', this.handleStreamRemoved)
      // .on('stream-updated', this.handleStreamUpdated)
      .on('mute-audio', this.handleAudioMuted)
      .on('unmute-audio', this.handleAudioUnmuted)
      .on('mute-video', this.handleVideoMuted)
      .on('unmute-video', this.handleVideoUnmuted)
      .on('kick-off', this.handleKickoff)
      // .on('connection-state-changed', this.handleConnectionStateChanged)
      .on('connection-state-change', this.handleConnectionStateChanged)
      // .on('stream-reconnecting', this.handleStreamReconnecting)
      .on('stream-reconnected', this.handleStreamReconnected)
      .on('network-quality', this.handleNetworkQuality)
      // .on('device-changed', this.handleDeviceChanged)
      .on('player-status-change', this.handlePlayerStatusChanged)
      .on('audio-track-ended', this.handleAudioTrackEnded)
      .on('error-notify', this.handleError)
  }
  unbindEvents() {
    this.client
      .off('user-added', this.handleUserJoin)
      .off('user-removed', this.handleUserLeave)
      .off('stream-published', this.handleStreamPublished)
      .off('stream-added', this.handleStreamAdded)
      .off('stream-subscribed', this.handleStreamSubscribed)
      .off('stream-removed', this.handleStreamRemoved)
      // .off('stream-updated', this.handleStreamUpdated)
      .off('mute-audio', this.handleAudioMuted)
      .off('unmute-audio', this.handleAudioUnmuted)
      .off('mute-video', this.handleVideoMuted)
      .off('unmute-video', this.handleVideoUnmuted)
      .off('kick-off', this.handleKickoff)
      // .off('connection-state-changed', this.handleConnectionStateChanged)
      .off('connection-state-change', this.handleConnectionStateChanged)
      // .off('stream-reconnecting', this.handleStreamReconnecting)
      .off('stream-reconnected', this.handleStreamReconnected)
      .off('network-quality', this.handleNetworkQuality)
      // .off('device-changed', this.handleDeviceChanged)
      .off('player-status-change', this.handlePlayerStatusChanged)
      .off('audio-track-ended', this.handleAudioTrackEnded)
      .off('error-notify', this.handleError)
  }

  resumePlay = () => {
    let _playBlockedStreams = []
    const playBlockedStreams = this.playBlockedStreams
    let len = playBlockedStreams.length
    playBlockedStreams.forEach((stream) => {
      stream
        .resume()
        .catch((err) => {
          log(`${stream.userId} 重新播放失败 ${err}`)
          _playBlockedStreams = _playBlockedStreams.concat(stream)
        })
        .finally(() => {
          len--
          if (len < 1 && _playBlockedStreams.length > 0) {
            this.vm && this.vm.$message(`手动播放失败的流有 ${_playBlockedStreams.map(item => item.userId)}`)
          }
        })
    })
    this.playBlockedStreams = []
    this.needResume = false
  }

  playLocalStream = (stream) => {
    stream.play(stream.id)
      .then(() => {
        log(`${stream.userId} 播放成功`)
      })
      .catch((err) => {
        log(`${stream.userId} 播放失败 ${err}`)
        // 解决 elementUI 重复调用 message 时，多个 message 重叠的问题
        setTimeout(() => {
          this.vm && this.vm.$message.warning(`自动播放${stream.userId}的流失败，播放错误：${err.message}`)
        }, 0)
        this.playBlockedStreams = this.playBlockedStreams.concat(stream)
        this.needResume = true
      })
  }

  reset() {
    this.isJoined = false
    this.unwatchUplinkDelay()
    if (this.localStream) {
      this.localStream.destroy()
      this.localStream = undefined
    }
    if (this.localScreenStream) {
      this.localScreenStream.destroy()
      this.localScreenStream = undefined
    }
    this.remoteStreams = []
    this.client = undefined
  }
}

export function getRTCInstance(vm) {
  if (!instance) {
    instance = new RTC()
  }
  if (vm) {
    instance.vm = vm
  }
  return instance
}

export {
  version
}
