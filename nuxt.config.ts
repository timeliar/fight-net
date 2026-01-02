// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["@/assets/scss/style.scss", "@mdi/font/css/materialdesignicons.min.css"],
  build: {
    transpile: ['vuetify'],
  },
  compatibilityDate: '2025-12-31',
  devtools: { enabled: false },
  runtimeConfig: {
    authDbUri: '',
    charactersDbUri: '',
    soapServerPath: '',
    soapUser: '',
    soapPassword: '',
    realmRateMoney: 1,
    realmRateXpQuest: 1,
    realmRateXpQuestDf: 1,
    realmRateXpExplore: 1,
    realmRateHonor: 1,
    realmRateHealth: 1,
    realmRateMana: 1,
    realmRateRageIncome: 1,
    realmRateRunicPowerIncome: 1,
    realmRateFocus: 1,
    realmRateEnergy: 1,
    realmRateLoyalty: 1,
    realmRateDropItemUncommon: 1,
    realmRateDropItemRare: 1,
    realmRateItemEpic: 1,
    realmRateItemLenendary: 1,
    realmRateDropMoney: 1,
  },
  modules: [
    '@pinia/nuxt',
  ]
})
