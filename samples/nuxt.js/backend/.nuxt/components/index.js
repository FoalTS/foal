export { default as Logo } from '../../../frontend/components/Logo.vue'

export const LazyLogo = import('../../../frontend/components/Logo.vue' /* webpackChunkName: "components/Logo'}" */).then(c => c.default || c)
