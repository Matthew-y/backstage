import { createStore } from 'vuex'

export default createStore({
  modules: {
    productType: {
      state: {
        typeList: []
      },
      getters: {
        typeList: (state) => state.typeList,
      },
      mutations: {
        mutateTypeList: (state, val) => {
          state.typeList = val;
        }
      },
      actions: {
        async setTypeList({ state, commit }, valueIn){
          console.log(valueIn, 'hello');
          commit('mutateTypeList', valueIn);
        }
      }
    }
  }
})
