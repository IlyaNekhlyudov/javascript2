Vue.component('cart', {
    data(){
      return {
          img: '',
          cartUrl: '/getBasket.json',
          cartItems: [],
          totalCost: 0,
      }
    },
    methods: {
        addProduct(product){
            let find = this.cartItems.find(el => el.id === product.id);
            if(find){
                this.$parent.putJson(`/api/cart/${find.id}`, {quantity: 1});
                find.quantity++;
                this.totalCost += product.price;
                this.$parent.$refs.notice.setNotice(`${product.name} successfully changed.`, 'success');
            } else {
                let prod = Object.assign({quantity: 1}, product);
                this.totalCost += product.price;
                this.$parent.postJson('/api/cart', prod)
                  .then(data => {
                      if (data.result === 1) {
                          this.cartItems.push(prod);
                          this.$parent.$refs.notice.setNotice(`${product.name} successfully added to cart.`, 'success');
                      }
                  });
            }
        },
        remove(item) {
            if (item.quantity > 1) {
                this.$parent.putJson(`/api/cart/${item.id}`, {quantity: -1})
                    .then(data => {
                        if (data.result === 1) {
                            item.quantity--;
                            this.totalCost -= item.price;
                            this.$parent.$refs.notice.setNotice(`${item.name} successfully changed.`, 'success');
                        }
                    });
            } else {
                this.$parent.deleteJson(`/api/cart/${item.id}`)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1);
                            this.totalCost -= item.price;
                            this.$parent.$refs.notice.setNotice(`${item.name} successfully delete.`, 'success');
                        }
                    });
            }
        },
    },
    mounted(){
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                this.totalCost = data.amount;
                for(let el of data.contents){
                    this.cartItems.push(el);
                }
            });
    },
    template: `
        <div class="cart-block">
            <a><img class="cart" src="img/cart.svg" alt="cart"></a>
            <div class="browse-drop drop-correct-height" v-if="this.cartItems.length > 0">
                <cart-item
                v-for="item of cartItems"
                :key="item.id"
                :cartItem="item"
                @remove="remove"
                ></cart-item>
                <h4 class="cart-drop-total">TOTAL <span id='drop-coast'>{{ this.totalCost }}$</span></h4>
                <div class="cart-drop-button">
                    <a href="checkout.html" class="cart-drop-checkout">Checkout</a>
                    <a href="shopping_cart.html" class="cart-drop-gocart">Go to cart</a>
                </div>
            </div>
            <div class="browse-drop drop-correct-height" v-else>
                <p class="no-cart-items">No items in the basket.</p>
            </div>
        </div>
    `
});

Vue.component('cart-item', {
    props: ['cartItem'],
    template: `
        <div class="cart-drop">
            <a href="single_page.html"><img :src="cartItem.img" alt="" class="cart-drop-img"></a>
            <div class="cart-drop-info">
                <a href="single_page.html" class="cart-drop-link">
                    <h4 class="cart-drop-h4">{{ cartItem.name }}</h4>
                    <div class="cart-drop-rate">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half"></i>
                    </div>
                    <p class="cart-drop-p">{{ cartItem.quantity }} x $ {{ cartItem.price }}</p>
                </a>
            </div>
            <a class="cart-remove" @click="$emit('remove', cartItem)"><i class="fas fa-times"></i></a>
        </div>
    `
});
