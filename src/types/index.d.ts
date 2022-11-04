export {}

declare global {
  interface Window {
    electronAPI: {
      searchAvinode: () => void,
      searchFlightListPro: () => void
    }
  }
}
