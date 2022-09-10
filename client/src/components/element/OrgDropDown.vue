<template>
    <div class="dropdown">
        <select class="custom-select"  style="width:150px;" @change="switchOrg($event)">
            <option :selected="true" :value="selectedOrg._id">{{selectedOrg.name}}</option>
            <option :value="eachOrg._id" v-for="eachOrg in orgList">{{eachOrg.name}}</option>
        </select>
    </div>
</template>

<script>
export default {
    computed: {
        orgList(){
            return this.$store.state.orgList
        },
        selectedOrg(){
            return this.$store.getters.getSelectedOrg;
        }
    },
    methods: {
        switchOrg(event){
                this.$store.commit('selectAnOrg', event.target.value)
               
                 this.$store.dispatch('fetchAllOrgDataOnOrgSelect', event.target.value)
        },
    }
}
</script>