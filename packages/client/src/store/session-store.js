import { version } from 'urtc-sdk'
export function saveStore(data = {channel: '', username: ''}) {
  sessionStorage.setItem(`my-rtc-store-${version}`, JSON.stringify(data))
}

export function loadStore() {
  const data = sessionStorage.getItem(`my-rtc-store-${version}`)
  try {
    const p = JSON.parse(data) || {channel: '', username: ''}
    return p
  } catch (err) {
    alert('数据读取失败，请重新输入频道号及用户名')
  }
}
