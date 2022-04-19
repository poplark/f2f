import { createStore } from 'vuex'
import { loadStore, saveStore } from './session-store';
import { appId, appKey } from './config'
import { parse } from 'query-string'

const defaultAdvanceSettings = {
  roomType: 'conference', // conference live
  roleType: 'speaker', // "audience" | "speaker"
  microphoneId: '',
  cameraId: '',
  videoProfile: '640*360',
  smallVideoProfile: '160*90',
  screenProfile: '1920*1080_3',
  videoCodec: 'vp8',
  appId: appId,
  appKey: appKey,
  mediaServer: '',
  enableSmallStream: false,
  audioMode: false,
  debugMode: false,
  prodEnv: true,
  shareMic: false,
}

const persistent = loadStore() || {}

const parsedSearch = parse(location.search)

export const store = createStore({
  state: {
    uplinkQuality: -1,
    uplinkDelay: -1,
    downlinkQuality: -1,
    microphones: [],
    cameras: [],
    // settings: {
    //   channel: parsedSearch.channel || persistent.channel || '',
    //   username: parsedSearch.username || persistent.username || '',
    // },
    advanceSettings: {
      roomType: parsedSearch.roomType || persistent.roomType || defaultAdvanceSettings.roomType,
      roleType: parsedSearch.roleType || persistent.roleType || defaultAdvanceSettings.roleType,
      microphoneId: persistent.microphoneId || defaultAdvanceSettings.microphoneId,
      cameraId: persistent.cameraId || defaultAdvanceSettings.cameraId,
      videoProfile: persistent.videoProfile || defaultAdvanceSettings.videoProfile,
      smallVideoProfile: persistent.smallVideoProfile || defaultAdvanceSettings.smallVideoProfile,
      screenProfile: persistent.screenProfile || defaultAdvanceSettings.screenProfile,
      videoCodec: persistent.videoCodec || defaultAdvanceSettings.videoCodec,
      appId: parsedSearch.appId || persistent.appId || defaultAdvanceSettings.appId,
      appKey: parsedSearch.appKey || persistent.appKey || defaultAdvanceSettings.appKey,
      mediaServer: parsedSearch.mediaServer || persistent.mediaServer || defaultAdvanceSettings.mediaServer,
      enableSmallStream: persistent.enableSmallStream || defaultAdvanceSettings.enableSmallStream,
      audioMode: persistent.audioMode || defaultAdvanceSettings.audioMode,
      debugMode: persistent.debugMode || defaultAdvanceSettings.debugMode,
      prodEnv: persistent.prodEnv || defaultAdvanceSettings.prodEnv,
      shareMic: persistent.shareMic || defaultAdvanceSettings.shareMic,
    },
    picture: null,
  },
  mutations: {
    updateUplinkQuality(state, payload) {
      state.uplinkQuality = payload
    },
    updateUplinkDelay(state, payload) {
      state.uplinkDelay = payload
    },
    updateDownlinkQuality(state, payload) {
      state.downlinkQuality = payload
    },
    updateMicrophones(state, payload) {
      state.microphones = payload
    },
    updateCameras(state, payload) {
      state.cameras = payload
    },
    // updateSettings(state, payload) {
    //   state.settings = { ...state.settings, ...payload }
    //   saveStore({ ...state.settings, ...state.advanceSettings })
    // },
    updateAdvanceSettings(state, payload) {
      state.advanceSettings = { ...state.advanceSettings, ...payload }
      saveStore({ ...state.settings, ...state.advanceSettings })
    },
    resetAdvanceSettings(state) {
      state.advanceSettings = { ...defaultAdvanceSettings }
      saveStore({ ...state.settings, ...state.advanceSettings })
    },
    updatePicture(state, payload) {
      state.picture = payload
    },
  }
})
