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
  },
  compareNumericArray(arr1, arr2) {
    let duplicateArr = arr1.concat(arr2)
    let uniqueArr = [...(new Set(duplicateArr))]
    if (uniqueArr.length !== arr1.length) { // arr1 = [1,2,3], arr2 = [2,4] => false
      return false
    } else if (arr1.length > arr2.length) { // arr1 = [1,2,3], arr2 = [2,3] => false
      return false
    }
    return true // arr1 = [1,2,3], arr2 = [2,3,1] => true
  }
}