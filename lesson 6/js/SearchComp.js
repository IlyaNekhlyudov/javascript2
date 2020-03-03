Vue.component('search', {
    data() {
        return {
            filtered: [],
            userSearch: '',
            // productsAPI: this.$root.$refs.products почему-то не работает
        }
    },
    methods: {
        filter(){
            let regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.$root.$refs.products.products.filter(el => regexp.test(el.product_name));
        }
    },
    template: `
        <form action="#" class="search-form">
            <input type="text" class="search-field" v-model="userSearch" @input="filter()">
            <button class="btn-search" type="submit">
                <i class="fas fa-search"></i>
            </button>
        </form>
    `
});