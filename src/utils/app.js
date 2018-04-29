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
  },
  getNumberOfShifts(check) {
    let start = new Date(check.startDate)
    let finish = new Date(check.finishDate)
    let diff = new Date(finish - start)
    return diff.getUTCDate()
  }
}