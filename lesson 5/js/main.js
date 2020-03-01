const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
  el: '#app',
  data: {
    catalogUrl: '/catalogData.json',
    products: [],
    imgCatalog: 'https://placehold.it/200x150',
    filtered: [],
    searchLine: '',
    timeout: 0,
    cartVisible: false,
    cart: [],
    imgCart: 'https://placehold.it/50x100',
  },
  methods: {
    getJson(url){
      return fetch(url)
        .then(result => result.json())
        .catch(error => {
          console.log(error);
        })
    },
    addProduct(product){
      let find = this.cart.find(element => element.id_product === product.id_product);
      if (find) { 
        product.quantity++;
      } else {
        Vue.set(product, 'quantity', 1);
        this.cart.push(product);
      }
    },
    removeProduct(product) {
      if (product.quantity > 1) {
        product.quantity--;
      } else {
        this.cart.splice(this.cart.indexOf(product), 1);
      }
    },
    filterGoods() {
      setTimeout(() => {
        let regexp = new RegExp(this.searchLine, 'i');
        this.filtered = this.products.filter(el => regexp.test(el.product_name));
      }, 500);
    },
  },
  mounted(){
    this.getJson(`${API + this.catalogUrl}`)
      .then(data => {
        for(let el of data){
          this.products.push(el);
          this.filtered.push(el);
        }
      });
  }
});