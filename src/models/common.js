const commonModel = {
  state: {},
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}

export default commonModel
