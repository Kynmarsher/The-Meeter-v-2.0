// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui","@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/color-mode",],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  colorMode: {
  },
  app
    : {
    pageTransition
      : {
        name
          : 'page', mode
        : 'out-in'
    }
  },
})