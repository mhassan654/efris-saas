// export default i18n
import { createApp } from 'vue'
import store from '../store'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  messages: {}
})

/**
 * @param {String} locale
 */

export async function loadMessages(locale) {
  if (Object.keys(i18n.global.getLocaleMessage(locale)).length === 0) {
    const messages = await import(`../lang/${locale}`)
    i18n.global.setLocaleMessage(locale, messages.default)
  }

  if (i18n.global.locale.value !== locale) {
    i18n.global.locale.value = locale
  }
}


(async function () {
  await loadMessages(store.getters['lang/locale'])
})();

export default i18n
