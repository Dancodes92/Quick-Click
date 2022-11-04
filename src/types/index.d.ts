export {}

declare global {
  interface Window {
    electronAPI: {
      selectAvinodeJets(): void,
      searchAvinode: () => void,
      searchFlightListPro: () => void
    }
  }
}
