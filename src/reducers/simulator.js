const simulator = (state = {results: [], noOfRollsRemaining: 0}, action) => {
  switch (action.type) {
    case 'ADD_RESULT':
      return {
        ...state,
        results: [
          ...state.results,
          action.result
        ],
        noOfRollsRemaining: (state.noOfRollsRemaining - 1),
      };
    case 'START_AUTO_BET':
      return {
        ...state,
        noOfRollsRemaining: action.noOfRolls,
      };
    case 'STOP_AUTO_BET':
      return {
        ...state,
        noOfRollsRemaining: 0,
      };
    case 'START_MANUAL_BET':
      return {
        ...state,
        noOfRollsRemaining: 0,
      };
    default:
      return state;
  }
}
 
export default simulator;
