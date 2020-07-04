import Vue from 'vue'

const globalComponents = {
}

for (const name in globalComponents) {
  Vue.component(name, globalComponents[name])
}
