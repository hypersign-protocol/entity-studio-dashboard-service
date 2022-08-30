import  Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        schemaList:[],
        vcList: []
    },
    getters: {
        totalSchemas(state){
            return state.schemaList.length;
        },
        totalCredentials(state){
            return state.vcList.length;
        }
    },
    mutations: {
        insertAschema(state, payload){
            console.log('Inside insertAschema...')
            if(!state.schemaList.find(x => x._id === payload._id)){
                console.log('pushing schema...')
                state.schemaList.push(payload);
            }else{
                
                console.log('already exists scheme id =' + payload._id);
                console.log('updating schema...')
                this.updateAschema(state,payload)
            }
        },
        updateAschema(state, payload){
            if(state.schemaList.find(x => x._id === payload._id)){
                const index = state.schemaList.findIndex(x => x._id === payload._id);
                state.schemaList[index] = payload;
            }
        },
        insertAcredential(state, payload){
            console.log('Inside insertAcredential...')
            if(!state.vcList.find(x => x._id === payload._id)){
                console.log('pushing credential...')
                state.vcList.push(payload);
            }else{
                console.log('already exists credential id =' + payload._id);
            }
        },
        updateAcredentiial(state, payload){
            if(state.vcList.find(x => x.id === payload.id)){
                const index = state.vcList.findIndex(x => x._id === payload._id);
                state.vcList[index] = payload;
            }
        }
    },
    actions: {

    }
})