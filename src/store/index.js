import { createStore } from 'vuex'

export default createStore({
  modules: {
    product: {
      state: {
        productInfo: {}
      },
      getters: {
        product: (state) => state.productInfo,
      },
      mutations: {
        mutateProductInfo: (state, val) => {
          state.productInfo = val;
        }
      },
      actions: {
        async setProductInfo({ state, commit }, valueIn){
          console.log(valueIn, 'hello');
          commit('mutateProductInfo', valueIn);
        }
      }
    }
  }
})
