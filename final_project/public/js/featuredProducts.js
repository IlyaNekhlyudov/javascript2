Vue.component('featuredProducts', {
    data() {
        return {
            items: [],
        }
    },
    mounted() {
        this.$parent.getJson('/api/products')
            .then(data => {
                let i = 0;
                for(let el of data) {
                    if (i < 8) {
                        this.items.push(el);
                        i++;
                    } else {
                        break;
                    }
                }
            });
    },
    template: `
    <div class="featured padding-site">
        <h3 class="featured-h3">Featured Items</h3>
        <p class="featured-p">Shop for items based on what we featured in this week</p>
        <div class="featured-items">
            <featuredProduct ref="refref" v-for="item of this.items" :key="item.id" :product="item"></featuredProduct>
        </div>
        <a href="./product.html" class="featured-browse">Browse All Product <img src="img/arrow-right.png" alt="" style="margin-left: 9px; margin-top: 5px;"></a>
    </div>    
    `
});

Vue.component('featuredProduct', {
    props: ['product'],
    data() {
      return {
          //cartAPI: this.$root.$refs.cart,
      };
    },
    template: `
    <div class="featured-block">
        <div class="featured-product" v-bind:style="{ backgroundImage: 'url(' + product.img + ')' }"">
            <a class="featured-cart" @click="$root.$refs.cart.addProduct(product)"><img src="img/cart-white.svg" alt="" style="margin-right: 5px;">Add to Cart</a>
        </div>
        <a href='single_page.html' class="featured-name">
            {{product.name}}
            <span class="featured-coast">$ {{product.price}}</span>
        </a>
    </div>
    `
});