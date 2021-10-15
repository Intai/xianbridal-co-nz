import { once } from 'ramda'

const loadTagManager = once(() => {
  const script = document.createElement('script')
  script.defer = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-9WZGHKT91D'
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  gtag('js', new Date())
  gtag('config', 'AW-980617762')
  gtag('config', 'G-M60CFNHRLK')
})

export const trackConversion = () => {
  loadTagManager()
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': [
        'AW-980617762/M7TPCPmT4PoCEKKUzNMD',
        'G-M60CFNHRLK',
      ],
    })
  }
}
