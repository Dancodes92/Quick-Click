export {}

declare global {
  interface Window {
    electronAPI: {
      selectAvinodeJets(): void,
      searchAvinode: () => void,
      selectFlightListPro: () => void,
      searchFlightListPro: (username: string, password: string) => void
    }
  }
}
