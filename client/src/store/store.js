import Vue from 'vue';
import Vuex from 'vuex';
import config from '../config'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        schemaList: [],
        vcList: [],
        templateList: [],
        orgList: [
        ],
        selectedOrgDid: "",
        showSideNavbar:false,
        showNabar:false
    },
    getters: {
        isAnyOrgSelected(state) {
            return state.selectedOrgDid != "" ? true : false
        },
        totalSchemas(state) {
            return state.schemaList.length;
        },
        totalCredentials(state) {
            return state.vcList.length;
        },
        totalTemplateCount(state) {
            return state.templateList.length;
        },
        totalOrgList(state) {
            return state.orgList.length;
        },
        findSchemaBySchemaID: (state) => (schemaId) => {
            return state.schemaList.find(x => x.schemaId === schemaId);
        },
        findOrgByOrgID: (state) => (orgDid) => {
            return state.orgList.find(x => x._id === orgDid);
        },
        getSelectedOrg: (state) => {
            return state.orgList.find(x => x._id === state.selectedOrgDid)
        },
        listOfAllSchemaOptions(state) {
            let schemaIdnames = state.schemaList.map(x => {
                if (x.schemaId && x.schemaId !== undefined && x.status === 'Registered') {
                    return {
                        text: x.schemaDetails.name,
                        value: x.schemaId
                    }
                } else {
                    return null
                }
            })
            // filtering empty object
            schemaIdnames = schemaIdnames.filter(x => x)
            schemaIdnames.unshift({ value: null, text: "Please select a schema" })
            return schemaIdnames;
        }
    },
    mutations: {
        resetStore(state){
            state.orgList=[]
            state.schemaList=[]
            state.vcList=[]
            state.templateList=[]
            state.selectedOrgDid=""
            state.showSideNavbar=false
            state.showNabar=false
        },
        selectAnOrg(state, orgDid) {
            state.selectedOrgDid = orgDid;
            state.showSideNavbar = true

        },
        insertAschema(state, payload) {
            if (!state.schemaList.find(x => x._id === payload._id)) {
                state.schemaList.push(payload);
            } else {
                console.log('already exists scheme id =' + payload._id);
                this.commit('updateAschema', payload);
              //  state.updateAschema(state, payload) 

                
            }
        },
        insertAnOrg(state, payload) {
            if (!state.orgList.find(x => x._id === payload._id)) {
                state.orgList.push(payload);
            } else {
                console.log('already exists scheme id =' + payload._id);
                this.commit('updateAnOrg', payload);
            }
        },
        updateAschema(state, payload) {
            let index = state.schemaList.findIndex(x => x._id === payload._id);
           Object.assign(state.schemaList[index], {...payload});
           // state.schemaList[index] = payload;
        },
        updateAnOrg(state, payload) {
            const orgToUpdateIndex = state.orgList.findIndex(x => x._id === payload._id);
            Object.assign(state.orgList[orgToUpdateIndex], {...payload});
        },
        insertApresentationTemplate(state, payload) {
            if (!state.templateList.find(x => x._id === payload._id)) {
                state.templateList.push(payload);
            }
        },
        insertAcredential(state, payload) {
            if (!state.vcList.find(x => x._id === payload._id)) {
                state.vcList.push(payload);
            } else {
                console.log('already exists credential id =' + payload._id);
                this.commit('updateAcredential', payload);
            }
        },
        updateAcredential(state, payload) {
            let index = state.vcList.findIndex(x => x._id === payload._id);
            Object.assign(state.vcList[index], {...payload});
        },
        updateNavbarStatus(state,payload) {
            state.showNabar = payload
        },
        updateSidebarStatus(state,payload) {
            state.showSideNavbar = payload
        }

        //     fetchAllOrgDataOnOrgSelect(state, payload) {
        //         console.log(state , payload);
        // }
    },
    actions: {
        insertAschema({ commit }, payload) {
            const { schemaId } = payload;
            if (schemaId) {
                               
                const url = `${config.nodeServer.BASE_URL_REST}${config.nodeServer.SCHEMA_GET_REST}${schemaId}:`
                fetch(url).then(response => response.json()).then(json => {
                    const shcemaDetial = json.schema[0];
                    if (shcemaDetial.schema.properties) {
                        let propertiesStr = shcemaDetial.schema.properties;
                        const props = JSON.parse(propertiesStr)
                        shcemaDetial.schema.properties = props;
                    }
                    payload['schemaDetails'] = shcemaDetial;
                    commit('insertAschema', payload);
                }).catch(e => console.log)
            } else {
                commit('insertAschema', payload);
            }
        },
        insertAcredential({ commit }, payload) {
            const { vc_id } = payload;
            if (vc_id) {
                fetch(vc_id + ':').then(response => response.json()).then(json => {
                    Object.assign(payload, { ...json });
                    commit('insertAcredential', payload);
                }).catch(e => console.log)
            } else {
                commit('insertAcredential', payload);
            }
        },

        fetchAllOrgDataOnOrgSelect({ commit }, payload) {
            this.authToken = localStorage.getItem('authToken');
            // fetch all templete   
            {
                let url = `${config.studioServer.BASE_URL}api/v1/presentation/template/org/${this.getters.getSelectedOrg._id}/`
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`

                }
                fetch(url, {
                    headers
                }).then(response => response.json()).then(json => {
                    
                    if (json.length!==0) {
                        this.state.templateList=[]
                        json.forEach(template => {
                            this.commit('insertApresentationTemplate', template)
                        })
                    }else{
                        this.state.templateList=[]
                    }
                })
            }
            // fetch all schemas
            {
                const url = `${config.studioServer.BASE_URL}${config.studioServer.SCHEMA_LIST_EP}/${this.getters.getSelectedOrg._id}/?page=1&limit=10`

                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.authToken}`
                    }
                }


                fetch(url, {
                    headers: options.headers
                }).then(response => response.json()).then(json => {       

                    if (json && json.schemaList.length!==0) {
                        this.state.schemaList = []
                        json.schemaList.forEach(schema => {

                            this.dispatch('insertAschema', schema)
                        })
                    } else {
                       

                        this.state.schemaList = []
                    }
                })


            }

            //fetct all credentials
            {
                const url = `${config.studioServer.BASE_URL}${config.studioServer.CRED_LIST_EP}/${this.getters.getSelectedOrg._id}`;
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.authToken}`
                    }
                }
                fetch(url, {
                    headers: options.headers
                }).then(response => response.json()).then(json => {
                    if (json && json.credList.length!==0) {
                        this.state.vcList = []
                        json.credList.forEach(credential => {
                            this.dispatch('insertAcredential', credential)
                        })
                    }else{
                        this.state.vcList = []
                    }
                    
                })


            }




            //   async getList(type) {
            //     let url = "";
            //     let options = {}
            //     if (type === "SCHEMA") {
            //       url = `${config.studioServer.BASE_URL}${config.studioServer.SCHEMA_LIST_EP}/${this.selectedOrg._id}/?page=${this.schema_page}&limit=10`

            //       options = {
            //         method: "GET",
            //         headers: {
            //           "Content-Type": "application/json",
            //           "Authorization": `Bearer ${this.authToken}`
            //         }
            //       }
            //     } else {
            //       url = `${config.studioServer.BASE_URL}${config.studioServer.CRED_LIST_EP}/${this.selectedOrg._id}`;
            //       options = {
            //         method: "GET",
            //         headers: {
            //           "Content-Type": "application/json",
            //           "Authorization": `Bearer ${this.authToken}`
            //         }
            //       }
            //     }

            //     const resp = await fetch(url, options);
            //     const j = await resp.json();
            //     if (j && j.status == 500) {
            //       return this.notifyErr(`Error:  ${j.error}`);
            //     }
            //     if (type === "SCHEMA") {
            //       console.log(j);
            //       const schemaList = j.schemaList
            //       schemaList.forEach(schema => {
            //         this.$store.dispatch('insertAschema', schema)
            //       })
            //     } else {
            //       j.credList.forEach(credential => {
            //         this.$store.dispatch('insertAcredential', credential)
            //       })
            //     }
            //   },

        }


    }
})