export default {
  getRootComponent (vueComponent) {
    const root = null
    if (vueComponent && vueComponent._isVue) {
      if (vueComponent.isRootComponent) {
        return vueComponent
      } else if (vueComponent.$parent) {
        return this.getRootComponent(vueComponent.$parent)
      } else { return root }
    } else { return root }
  }
}