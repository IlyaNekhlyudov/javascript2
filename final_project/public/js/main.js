const app = new Vue({
    el: '#app',
    data: {
        quantityItems: '9',
        sortOption: 'none',
        searchText: '',
        routSearch: 'product.html'
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    this.$refs.notice.setNotice(error, 'error');
                });
        },
        postJson(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
              .catch(error => {
                  this.$refs.notice.setNotice(error, 'error');
              });
        },
        postJsonText(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
              .catch(error => {
                  this.$refs.notice.setNotice(error, 'error');
              });
        },
        putJson(url, data) {
            return fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
              .catch(error => {
                  this.$refs.notice.setNotice(error, 'error');
              });
        },
        deleteJson(url, data) { // Homework
            return fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
              .catch(error => {
                  this.$refs.notice.setNotice(error, 'error');
              });
        },

        //------------------------------------------
        changeItems () {
            this.$refs.products.generateProducts(+this.quantityItems, undefined, this.sortOption);
        },
        filterItems() {
            if(this.searchText !== '') {
                this.$refs.products.generateProducts(-2);
            }
            else {
                this.$refs.products.generateProducts(+this.quantityItems, undefined, this.sortOption);
            }
        },
        changeRout() {
            return this.routSearch = "product.html?search=" + this.searchText;
        },
        clearCart() {
            if (this.$refs.cart.cartItems.length > 0) {
                this.deleteJson(`/api/cart/del/all`)
                    .then(data => {
                        if (data.result === 1) {
                            for (let item of this.$refs.cart.cartItems) {
                                this.$refs.cart.cartItems.splice(0);
                            }
                            this.$refs.cart.totalCost = 0;
                            this.$refs.notice.setNotice(`All items successfully deleted.`, 'success');
                        }
                });
            }
            else {
                this.$refs.notice.setNotice(`No items in the basket.`, 'error');
            }
        }
    },
    mounted() {
    }
});