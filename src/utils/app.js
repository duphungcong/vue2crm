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
  },
  getZoneByTab(selectedTab) {
    const zoneByTab = (tab) => ({
      'tab-1': '100-200-800',
      'tab-2': '300-400',
      'tab-3': '500-600-700',
      'tab-4': 'AVI',
      'tab-5': 'STRUCTURE',
      'tab-6': 'CABIN',
      'tab-7': 'CLEANING',
      'tab-8': 'N/A',
      'tab-9': 'REMOVED'
    })[tab]
    return zoneByTab(selectedTab)
  }
}