export const isJSON = (string: string) => {
  try {
    JSON.parse(string)
    return true
  } catch (e) {
    return false
  }
}

export const useJson = () => ({
  isJSON,
})
