import './settings'
import(/* webpackChunkName: "app" */ './components/app-lazy')

// register service worker for offline cache.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker').then()
  })
}

// setTimeout(() => {
//   const script = document.createElement('script')
//   script.defer = true
//   script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9WZGHKT91D'
//   document.head.appendChild(script)
//
//   window.dataLayer = window.dataLayer || []
//   function gtag() { window.dataLayer.push(arguments) }
//   gtag('js', new Date())
//   gtag('config', 'G-M60CFNHRLK')
//   gtag('config', 'AW-980617762')
// }, 1000)
