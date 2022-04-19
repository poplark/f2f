import { Client as _Client, Logger, getDevices as _getDevices, setServers as _setServers } from 'urtc-sdk'
import { log } from '../utils/logger'

class Stream {
  constructor(client, metaData) {
    this.client = client
    this.id = metaData.sid

    this.sid = metaData.sid
    this.uid = metaData.uid
    this.type = metaData.type
    this.mediaType = metaData.mediaType

    this.audio = metaData.audio
    this.audioMuted = metaData.audioMuted
    this.sourceAudioMuted = metaData.sourceAudioMuted

    this.video = metaData.video
    this.videoMuted = metaData.videoMuted
    this.sourceVideoMuted = metaData.sourceVideoMuted

    this.mediaStream = metaData.mediaStream
  }

  get userId() {
    return this.uid
  }
  get isLocal() {
    return this.type !== 'subscribe'
  }

  hasAudio() {
    return this.audio
  }
  hasVideo() {
    return this.video
  }
  getMediaType() {
    return this.mediaType
  }
  update(metaData) {
    this.sid = metaData.sid
    this.uid = metaData.uid
    this.type = metaData.type
    this.mediaType = metaData.mediaType

    this.audio = metaData.audio
    this.audioMuted = metaData.audioMuted
    this.sourceAudioMuted = metaData.sourceAudioMuted

    this.video = metaData.video
    this.videoMuted = metaData.videoMuted
    this.sourceVideoMuted = metaData.sourceVideoMuted

    this.mediaStream = metaData.mediaStream

    // ------ 解决 big video 显示黑屏问题 ---- start
    const bigVideo = document.querySelector('#big-video-display')
    if (bigVideo && bigVideo.dataset['id'] === this.id) {
      bigVideo.srcObject = this.mediaStream
    }
    // ------ 解决 big video 显示黑屏问题 ---- end
  }
  play(container, opts) {
    return new Promise((resolve, reject) => {
      this.client.play({
        streamId: this.sid,
        container: container,
        ...opts,
      }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  resume() {
    return new Promise((resolve, reject) => {
      this.client.resume(this.sid, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  getStats() {
    const audioStatsPromise = new Promise((resolve, reject) => {
      this.client.getAudioStats(this.sid, (stats) => {
        resolve({
          bitrate: stats.br,
          packetLossRate: stats.lostpre,
          volume: stats.vol,
          codec: stats.mime,
        })
      }, reject)
    })
    const videoStatsPromise = new Promise((resolve, reject) => {
      this.client.getVideoStats(this.sid, (stats) => {
        resolve({
          bitrate: stats.br,
          framerate: stats.frt,
          packetLossRate: stats.lostpre,
          width: stats.w,
          height: stats.h,
          codec: stats.mime,
        })
      }, reject)
    })
    const networkStatsPromise = new Promise((resolve, reject) => {
      this.client.getNetworkStats(this.sid, resolve, reject)
    })
    return Promise.all([audioStatsPromise, videoStatsPromise, networkStatsPromise])
      .then((stats) => {
        return {
          audio: stats[0],
          video: stats[1],
          network: stats[2],
        }
      })
      .catch(() => {
        return {
          audio: {
            bitrate: -1,
            packetLossRate: -1,
            volume: -1,
            codec: '',
          },
          video: {
            bitrate: -1,
            framerate: -1,
            packetLossRate: -1,
            width: -1,
            height: -1,
            codec: '',
          },
          network: {
            rtt: -1,
          },
        }
      })
  }
  getAudioLevel() {
    return this.client.getAudioVolume(this.sid)
  }
  muteAudio() {
    const result = this.client.muteAudio(this.sid)
    if (result) {
      this.audioMuted = true
    }
    return result
  }
  unmuteAudio() {
    const result = this.client.unmuteAudio(this.sid)
    if (result) {
      this.audioMuted = false
    }
    return result
  }
  muteVideo() {
    const result = this.client.muteVideo(this.sid)
    if (result) {
      this.videoMuted = true
    }
    return result
  }
  unmuteVideo() {
    const result = this.client.unmuteVideo(this.sid)
    if (result) {
      this.videoMuted = false
    }
    return result
  }
}

export class LocalStream extends Stream {
  constructor(client, metaData) {
    super(client, metaData)
    this.screenAudio = metaData.screenAudio
    this.screen = metaData.screen
    this.microphoneId = metaData.microphoneId
    this.cameraId = metaData.cameraId
    this.file = metaData.file
  }
  hasAudio() {
    return this.audio || this.screenAudio
  }
  hasVideo() {
    return this.video || this.screen
  }
  init() {
    return new Promise((resolve, reject) => {
      this.client.createStream({
        audio: this.audio,
        video: this.video,
        screenAudio: this.screenAudio,
        screen: this.screen,
        microphoneId: this.microphoneId,
        cameraId: this.cameraId,
        file: this.file,
      }, (err, stream) => {
        this.isInitiated = true
        if (err) {
          reject(err)
        } else {
          this.update(stream)
          if (this.getMediaType() === 'camera' && this.profile) {
            this.client.setVideoProfile({
              streamId: this.sid,
              profile: this.profile,
            }, resolve, reject)
          } else {
            resolve()
          }
        }
      })
    })
  }
  setVideoProfile(profile) {
    return new Promise((resolve, reject) => {
      if (this.isInitiated) {
        this.client.setVideoProfile({
          streamId: this.sid,
          profile,
        }, resolve, reject)
      } else {
        this.profile = profile
        resolve()
      }
    })
  }
  setScreenProfile(profile) {
    if (this.getMediaType() === 'screen') {
      this.client.setVideoProfile(profile)
    }
  }
  destroy() {
    // 本地流有效
    return new Promise((resolve, reject) => {
      this.client.destroyStream(this.sid, (err) => {
        if (err) {
          if (err.name === 'StreamNotExistsError') {
            log.warn('stream is not exists')
            resolve()
          } else {
            reject(err)
          }
        } else {
          resolve()
        }
      })
    })
  }
  switchDevice(type, deviceId) {
    return new Promise((resolve, reject) => {
      this.client.switchDevice({
        streamId: this.sid,
        type,
        deviceId,
      }, resolve, reject)
    })
  }
  on(type, listener) {
    if ('screen-sharing-stopped' === type) {
      const _listener = () => {
        this.client.off('screenshare-stopped', _listener)
        listener()
      }
      this.client.on('screenshare-stopped', _listener)
    }
  }
}

export class RemoteStream extends Stream {}

export function isSupportScreenShare() {
  return (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)
}

let localIdx = 1
export function createStream(client, data = {
  audio: true,
  video: true,
  screenAudio: false,
  screen: false,
  microphoneId: '',
  cameraId: '',
}) {
  return new LocalStream(client, {
    uid: '',
    sid: `local-${localIdx++}`,
    type: 'publish',
    mediaType: data.screen ? 'screen' : 'camera',
    audioMuted: false,
    videoMuted: false,
    ...data,
  })
}

class Client {
  constructor(appId, opts) {
    this.appId = appId
    this.type = 'rtc'
    this.role = 'push-and-pull'
    if (opts && opts.codec) {
      this.codec = opts.codec
    } else {
      this.codec = 'vp8'
    }
  }
  init(channel, username, token, opts) {
    this.channel = channel
    this.username = username
    this.token = token
    if (opts) {
      if (opts.type) {
        this.type = opts.type
      }
      if (opts.role) {
        this.role = opts.role
      }
    }
    this.innerClient = new _Client(this.appId, this.token, {
      type: this.type,
      role: this.role,
      codec: this.codec,
    })
  }
  on(type, listener) {
    this.innerClient.on(type, listener)
    return this
  }
  off(type, listener) {
    this.innerClient.off(type, listener)
    return this
  }
  join(channel, username) {
    return new Promise((resolve, reject) => {
      this.innerClient.joinRoom(channel, username, resolve, reject)
    })
  }
  leave() {
    return new Promise((resolve, reject) => {
      this.innerClient.leaveRoom(resolve, reject)
    })
  }
  publish(stream) {
    return new Promise((resolve, reject) => {
      this.innerClient.publishStream(stream.sid, (err, metaStream) => {
        log('publish stream ', err, metaStream)
        if (err) {
          reject(err)
        } else {
          stream.update(metaStream)
          resolve()
        }
      })
    })
  }
  unpublish(stream) {
    return new Promise((resolve, reject) => {
      this.innerClient.unpublishStream(stream.sid, (err, metaStream) => {
        if (err) {
          reject(err)
        } else {
          stream.update(metaStream)
          resolve()
        }
      })
    })
  }
  subscribe(stream) {
    return new Promise((_, reject) => {
      this.innerClient.subscribe(stream.sid, reject)
    })
  }
  unsubscribe(stream) {
    return new Promise((resolve, reject) => {
      this.innerClient.unsubscribe(stream.sid, resolve, reject)
    })
  }
  startRecord(data = {
    storage: {
      bucket: 'urtc-test',
      region: 'cn-bj',
    },
    input: {
      mode: 'automatic'
      // mode: 'manual'
      // streams: [{
      //   userId: this.username,
      //   mediaType: 'camera'
      // }],
    },
    output: {
      mode: 'audio-video',
      width: 1280,
      height: 720,
      layout: {
        // type: 'single',
        type: 'main',
        // mainViewUId: this.username,
        // mainViewType: 'screen',
      },
      waterMark: {
        type: 'time',
        position: 'left-top',
      },
    },
  }) {
    const { bucket, region } = data.storage || { bucket: 'urtc-test', region: 'cn-bj' }
    const { mode: streamAddMode, streams } = data.input || { mode: 'automatic' }
    const { mode: outputMode, width, height, layout, waterMark } = data.output || { mode: 'audio-video', width: 1280, height: 720, layout: { type: 'main' }, waterMark: { type: 'time', position: 'left-top' } }
    return new Promise((resolve, reject) => {
      this.innerClient.startRecord({
        bucket,
        region,
        streamAddMode,
        streams,
        outputMode,
        width,
        height,
        layout,
        waterMark,
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  stopRecord() {
    return new Promise((resolve, reject) => {
      this.innerClient.stopRecord((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
  startRelay(data = {
    relay: {
      pushURL: [`rtmp://rtcpush.ugslb.com/rtclive/default`],
    },
    input: {
      mode: 'automatic'
      // mode: 'manual'
      // streams: [{
      //   userId: this.username,
      //   mediaType: 'camera'
      // }],
    },
    output: {
      mode: 'audio-video',
      width: 1280,
      height: 720,
      layout: {
        // type: 'single',
        type: 'main',
        // mainViewUId: this.username,
        // mainViewType: 'screen',
      },
      waterMark: {
        type: 'time',
        position: 'left-top',
      },
    },
  }) {
    const { pushURL } = data.relay || { pushURL: [`rtmp://rtcpush.ugslb.com/rtclive/default`] }
    const { mode: streamAddMode, streams } = data.input || { mode: 'automatic' }
    const { mode: outputMode, width, height, layout, waterMark } = data.output || { mode: 'audio-video', width: 1280, height: 720, layout: { type: 'main' }, waterMark: { type: 'time', position: 'left-top' } }
    return new Promise((resolve, reject) => {
      this.innerClient.startRelay({
        pushURL,
        streamAddMode,
        streams,
        outputMode,
        width,
        height,
        layout,
        waterMark,
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  stopRelay() {
    return new Promise((resolve, reject) => {
      this.innerClient.stopRelay((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

export function createClient(appId, opts) {
  return new Client(appId, opts)
}

export function setLogLevel(level) {
  Logger.setLogLevel(level)
}
export function setServers(servers) {
  if (servers.signal) {
    _setServers({
      signal: servers.signal,
    })
    return;
  }
  const { gateway, log } = servers;
  _setServers({
    api: gateway,
    log,
  })
}
export function getDevices() {
  return new Promise((resolve, reject) => {
    _getDevices((result) => {
      // resolve(result.filter(item => item.deviceId && 'default' !== item.deviceId && 'communications' !== item.deviceId))
      resolve(result.filter(item => item.deviceId && 'communications' !== item.deviceId))
    }, reject)
  })
}
export function getMicrophones() {
  return new Promise((resolve, reject) => {
    _getDevices((result) => {
      resolve(result.filter((item) => item.kind === 'audioinput'))
    }, reject)
  })
}
export function getCameras() {
  return new Promise((resolve, reject) => {
    _getDevices((result) => {
      resolve(result.filter((item) => item.kind === 'videoinput'))
    }, reject)
  })
}
