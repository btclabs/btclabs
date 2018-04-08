export const addResult = result => ({
  type: 'ADD_RESULT',
  result
})

export const startAutoBet = noOfRolls => ({
  type: 'START_AUTO_BET',
  noOfRolls
})

export const stopAutoBet = () => ({
  type: 'STOP_AUTO_BET',
})

export const startManualBet = () => ({
  type: 'START_MANUAL_BET',
})
