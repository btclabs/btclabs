const results = (state = [], action) => {
  switch (action.type) {
    case 'ADD_RESULT':
      state.push(action.result);
      return state;
    default:
      return state;
  }
}
 
export default results;
