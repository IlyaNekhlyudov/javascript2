Vue.component('order', {
    data(){
        return {
            cartAPI: this.$root.$refs.cart,
        }
    },
    template: `
        <div class="shopcart">
            <div class="shopcart-title">
                <h4 class="shopcart-title-h4" style="width: 40%;">Product Details</h4>
                <h4 class="shopcart-title-h4">unite Price</h4>
                <h4 class="shopcart-title-h4">Quantity</h4>
                <h4 class="shopcart-title-h4">shipping</h4>
                <h4 class="shopcart-title-h4">Subtotal</h4>
                <h4 class="shopcart-title-h4">ACTION</h4>
            </div>
            <span v-if="cartAPI.cartItems.length === 0" class="no-items">No items in the basket.</span>
            <order-item
                v-for="item of cartAPI.cartItems"
                :key="item.id"
                :orderItem="item"
            ></order-item>
        </div>
    `
});

Vue.component('order-item', {
    props: [
        'orderItem',
        "quantity"
    ],
    data(){
        return {
            cartAPI: this.$root.$refs.cart,
        }
    },
    methods: {
        change(item) {
            if (item.quantity > 1 || item.quantity < 100) {
                let find = this.cartAPI.cartItems.find(el => el.id === item.id);
                this.$root.putJson(`/api/cart/order/${find.id}`, {quantity: item.quantity});
                this.calcTotal;
            } else {
                this.$parent.$refs.notice.setNotice(`Such a change in the quantity of goods is impossible.`, 'error');
            }
        },
        remove(item) {
            item.quantity = 1;
            this.cartAPI.remove(item);
        },
    },
    computed: {
        calcTotal: function() {
            this.cartAPI.totalCost = 0;
            this.cartAPI.cartItems.forEach(element => {
                this.cartAPI.totalCost += element.price * element.quantity;
            });
            return this.cartAPI.totalCost;
        },
    },
    template: `
    <div class="shopcart-block">
        <div class="shopcart-block-info" style="width: 39%;">
            <a href="single_page.html">
                <img alt="" class="shopcart-block-info-img" :src="orderItem.img"">
            </a>
            <div class="shopcart-block-info-text">
                <a href="single_page.html" class="shopcart-block-info-text-a"><h4 class="shopcart-block-info-text-h4">{{ orderItem.name }}</h4>
                    <span class="shopcart-block-info-text-span">
                        Color: <span class="shopcart-block-info-text-span-inside">Red</span>
                        <br>
                        Size: <span class="shopcart-block-info-text-span-inside">Xll</span>
                    </span>
                </a>
            </div>
        </div>
        <p class="shopcart-block-simply" style="margin-left: 15px;">{{ orderItem.price }}$</p>
        <label>
            <input 
                type="number"
                class="shopcart-block-quantity"
                v-model="orderItem.quantity"
                @change="change(orderItem)"
                min="1"
                max="100"
            >
        </label>
        <p class="shopcart-block-simply" style="margin-right: 5px;">FREE</p>
        <p class="shopcart-block-simply" style="margin-right: 16px;">{{ orderItem.price * orderItem.quantity }}$</p>
        <a class="remove-item" @click="remove(orderItem)"><i class="fas fa-times shopcart-cross"></i></a>
    </div>
    `
});

Vue.component('order-checkout', {
    data(){
        return {
            cartAPI: this.$root.$refs.cart,
            order: {
                date: '',
                country: 'Russia',
                fullName: '',
                phone: '',
                email: '',
                address: '',
                postcode: '',
                items: [],
            },
        }
    },
    methods: {
        validate(type, data) {
            if(type === 'email') {
                let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(data);
            } else if(type === 'fullname') {
                let re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g;
                return re.test(data)
            } else if(type === 'phone') {
                let re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
                return re.test(data);
            } else {
                this.$root.$refs.notice.setNotice(`Invalid type - ${type}.`, 'error');
            }
        },
        checkout() {
            if(this.$root.$refs.cart.cartItems.length === 0) {
                return this.$root.$refs.notice.setNotice(`The basket is empty, there is nothing to pay.`, 'error');
            }
            if(!this.validate('fullname', this.order.fullName)) {
                return this.$root.$refs.notice.setNotice(`Full name in the wrong format.`, 'error');
            }
            if(!this.validate('phone', this.order.phone)) {
                return this.$root.$refs.notice.setNotice(`Phone in the wrong format.`, 'error');
            }
            if(!this.validate('email', this.order.email)) {
                return this.$root.$refs.notice.setNotice(`Email in the wrong format.`, 'error');
            }
            this.cartAPI.cartItems.forEach(el => {
                this.order.items.push(el);
            });
            this.order.date = new Date();
            this.$parent.postJson('/api/order', this.order)
                .then(data => {
                    if (data.result === 1) {
                        this.$root.clearCart();
                        this.order.items.length = 0;
                        this.order.date = '';
                        this.order.country = 'Russia';
                        this.order.fullName = '';
                        this.order.phone = '';
                        this.order.email = '';
                        this.order.address = '';
                        this.order.postcode = '';
                        this.$parent.$refs.notice.setNotice(`The order is successfully placed.`, 'success');
                    }
                });
        }
    },
    template: `
    <div class="shopcart-order">
        <div class="shopcart-order-address">
            <h4 class="shopcart-order-address-h4">Shipping Adress</h4>
            <form action='#' @submit.prevent="checkout()">
                <select name="shopcart-order-address-select" id="shopcart-order-address-select" v-model="order.country">
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="USA">USA</option>
                    <option value="Russia">Russia</option>
                </select> <br>
                <input type="text" class="shopcart-order-address-input" placeholder="Full name" v-model="order.fullName" required> <br>
                <input type="tel" class="shopcart-order-address-input" placeholder="Phone" v-model="order.phone" required> <br>
                <input type="email" class="shopcart-order-address-input" placeholder="Email" v-model="order.email" required> <br>
                <input type="text" class="shopcart-order-address-input" placeholder="Address" v-model="order.address" required> <br>
                <input type="text" class="shopcart-order-address-input" placeholder="Postcode / Zip" v-model="order.postcode" required> <br>
                <input type="submit" class="shopcart-order-submit" value="Checkout">
            </form>
        </div>
        <div class="shopcart-order-coupon">
            <h4 class="shopcart-order-address-h4">coupon  discount</h4>
            <p class="shopcart-order-coupon-p">Enter your coupon code if you have one</p>
            <form action="#">
                <input type="text" class="shopcart-order-address-input" placeholder="State" required> <br>
                <input type="submit" class="shopcart-order-submit" value="Apply coupon">
            </form>
        </div>
        <div class="shopcart-order-total">
            <span class="shopcart-order-total-small">Sub total <span style="margin-left:15px;">{{ cartAPI.totalCost }}$</span> </span>
            <span class="shopcart-order-total-big">Grand total <span style="margin-left:15px; color: #f16d7f;">{{ cartAPI.totalCost }}$</span> </span>
            <hr class="shopcart-order-total-hr">
            <a href="checkout.html" class="shopcart-order-total-a">proceed to checkout</a>
        </div>
    </div>
    `
});