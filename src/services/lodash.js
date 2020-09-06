import _ from 'lodash'

_.mixin({
  /**
   * @see https://gist.github.com/colingourlay/82506396503c05e2bb94
   * @param {Dictionary<unknown>} object
   * @param {Function} [comparator]
   * @returns {Dictionary<unknown>}
   */
  sortKeysBy (object, comparator) {
    let keys = _.sortBy(_.keys(object), key => comparator
      ? comparator(object[key], key)
      : key)

    return _.zipObject(keys, _.map(keys, key => object[key]))
  },
})
