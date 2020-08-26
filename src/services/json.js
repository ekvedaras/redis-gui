export const isJSON = string => {
  try {
    JSON.parse(string)
    return true
  } catch (e) {
    return false
  }
}
