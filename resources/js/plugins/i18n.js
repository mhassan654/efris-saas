// export default i18n
import store from '../store'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
    allowComposition: true,
    messages: {}
})

/**
 * @param {String} locale
 */

export async function loadMessages(locale) {
  if (Object.keys(i18n.global.getLocaleMessage('en')).length === 0) {
    const messages = await import(`../lang/${'en'}`)
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
