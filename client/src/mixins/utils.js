export default {
    methods: {
        shorten(str){
            if(!str){
                return str
            }
            if(str.length <= 8){
                return str
            }
            const f = str.substr(0,8)
            const m = "..."
            const l = str.substr(str.length - 8, 8);
            return f+m+l;
        },
        fetchData(url, option) {
            fetch(url)
              .then((res) => res.json())
              .then((j) => {
                if (j.status != 200) throw new Error(j.error);
                return j.message;
              })
              .catch((e) => this.notifyErr(`Error: ${e.message}`));
        },
        notifySuccess(msg){
            this.$notify({
              group: 'foo',
              title: 'Information',
              type: 'success',
              text: msg
            });
        },
        notifyErr(msg){
          this.$notify({
              group: 'foo',
              title: 'Error',
              type: 'error',
              text: msg
            });
        },
    }
}
