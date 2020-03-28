Vue.component('products', {
    data() {
        return {
            items: [],
            filtered: [],
            pages: {
                quantity: 0,
                current: 1,
                itemsNum: 0,
            },
        }
    },
    methods: {
        generateProducts(number, page = 1, sort = 'none') {
            this.itemsNum = number;
            this.items.length = 0;
            this.filtered.length = 0;
            let i = 0;

            this.$parent.getJson('/api/products')
            .then(data => {

                // высчитываем количество страниц
                if(number !== -1) {
                    this.pages.quantity = Math.ceil(data.length / number);
                }
                else {
                    this.pages.quantity = 0;
                }
                this.items = data;

                // сортировка товаров по типу (цена, имя, рейтинг, популярность)
                this.sortItems(sort);

                // поиск товаров
                if(number === -2) {
                    let regexp = new RegExp(this.$parent.searchText, 'i');
                    this.filtered = this.items.filter(el => regexp.test(el.name));
                    this.pages.quantity = 0;
                } else {
                    for (let el of this.items) {

                        // проверяем, нажата ли кнопка View All
                        if(number === -1) {
                            this.filtered.push(el);
                            continue;
                        } else if(i === number*page) {
                            break;
                        }

                        // проверяем, первая ли страница и с какого товара начать генерацию
                        if (page > 1) {
                            let calculateItems = 0;
                            calculateItems = number * page - number;
    
                            if(i < calculateItems) {
                                i++;
                                continue;
                            } else {
                                this.filtered.push(el);
                            }
                        } else {
                            this.filtered.push(el);
                        }
                        i++;
                    }
                }
            });
        },
        sortItems(type) {
            switch(type) {
                case 'name': {
                    this.items.sort((a, b) => {
                        if(a.name > b.name) {
                            return 1;
                        }
                        else if(a.name < b.name) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    });
                    break;
                }
                case 'rating': {
                    this.items.sort((a, b) => {
                        if(a.rating > b.rating) {
                            return -1;
                        }
                        else if(a.rating < b.rating) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    });
                    break;
                }
                case 'popularity': {
                    this.items.sort((a, b) => {
                        if(a.popularity > b.popularity) {
                            return -1;
                        }
                        else if(a.popularity < b.popularity) {
                            return 1;
                        }
                        else {
                            return 0;
                        }
                    });
                    break;
                }
                case 'price': {
                    this.items.sort((a, b) => {
                        if(a.price > b.price) {
                            return 1;
                        }
                        else if(a.price < b.price) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    });
                    break;
                }
                default: {
                    break;
                }
            };
        },
    },
    mounted() {
        if(window.location.search === '') {
            this.generateProducts(9);
        } else {
            if(window.location.search.indexOf("search=")) {
                this.$parent.searchText = window.location.search.slice(8)
                this.generateProducts(-2);
            }
        }
    },
    template: `
    <div class="products">
        <product v-for="item of this.filtered" :key="item.id" :item="item"></product>
        <span v-if="this.filtered.length === 0" class="no-items">No items in the basket.</span>
        <div class="products-footer">
            <paginate
                :pageCount = "this.pages.quantity"
                :quantityNum = "this.pages.itemsNum">
            </paginate>
            <button class="view-button" @click="generateProducts(-1)">View All</button>
        </div>
    </div>
    `
});

Vue.component('product', {
    props: ['item'],
    template: `
    <div class="featured-block product-nomargin">
        <div class="featured-product product-sizes" v-bind:style="{ backgroundImage: 'url(' + item.img + ')' }"">
            <a class="featured-cart" @click="$root.$refs.cart.addProduct(item)">
                <img src="img/cart-white.svg" alt="" style="margin-right: 5px;">
                Add to Cart
            </a>
            <div class="products-elements">
                <a class="products-elements-click"><img src="img/product/share.svg" alt=""></a>
                <a class="products-elements-click"><img src="img/product/like.svg" alt=""></a>
            </div>
        </div>
        <a href='single_page.html' class="featured-name">
            {{item.name}}
            <span class="featured-coast">$ {{item.price}}</span>
        </a>
    </div>
    `
});

Vue.component('paginate', {
    props: {
        value: {
            type: Number
        },
        pageCount: {
            type: Number,
            required: true
        },
        clickHandler: {
            type: Function,
            default: (selected) => {
                app.$refs.products.generateProducts(app.$refs.products.itemsNum, selected, app.sortOption);
             }
        },
        pageRange: {
            type: Number,
            default: 5
        },
        marginPages: {
            type: Number,
            default: 1
        },
        breakViewText: {
            type: String,
            default: '...'
        },
        disabledClass: {
            type: String,
            default: 'disabled'
        },
        firstLastButton: {
            type: Boolean,
            default: false
        },
        firstButtonText: {
            type: String,
            default: 'First'
        },
        hidePrevNext: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            innerValue: 1,
        }
    },    
    methods: {
        handlePageSelected(selected) {
            if (this.selected === selected) return 
                this.innerValue = selected
                this.$emit('input', selected)
                this.clickHandler(selected)
        },
        prevPage() {
            if (this.selected <= 1) return
                this.handlePageSelected(this.selected - 1)
        },
        nextPage() {
            if (this.selected >= this.pageCount) return
                this.handlePageSelected(this.selected + 1)
        },
        firstPageSelected() {
            return this.selected === 1
        },
        lastPageSelected() {
            return (this.selected === this.pageCount) || (this.pageCount === 0)
        },
        selectFirstPage() {
            if (this.selected <= 1) return
                this.handlePageSelected(1)
        },
        selectLastPage() {
            if (this.selected >= this.pageCount) return
                this.handlePageSelected(this.pageCount)
        }
    },
    computed: {
        selected: {
            get: function() {
            return this.value || this.innerValue
            },
            set: function(newValue) {
            this.innerValue = newValue
            }
        },
        pages: function () {
            let items = {}
            if (this.pageCount <= this.pageRange) {
            for (let index = 0; index < this.pageCount; index++) {
                let page = {
                    index: index,
                    content: index + 1,
                    selected: index === (this.selected - 1)
                }
                items[index] = page
            }
            } else {
            const halfPageRange = Math.floor(this.pageRange / 2)
            let setPageItem = index => {
                let page = {
                    index: index,
                    content: index + 1,
                    selected: index === (this.selected - 1)
                }
                items[index] = page
            }
            let setBreakView = index => {
                let breakView = {
                    disabled: true,
                    breakView: true
                }
                items[index] = breakView
            }
            for (let i = 0; i < this.marginPages; i++) {
                setPageItem(i);
            }
            let selectedRangeLow = 0;
            if (this.selected - halfPageRange > 0) {
                selectedRangeLow = this.selected - 1 - halfPageRange;
            }
            let selectedRangeHigh = selectedRangeLow + this.pageRange - 1;
            if (selectedRangeHigh >= this.pageCount) {
                selectedRangeHigh = this.pageCount - 1;
                selectedRangeLow = selectedRangeHigh - this.pageRange + 1;
            }
            for (let i = selectedRangeLow; i <= selectedRangeHigh && i <= this.pageCount - 1; i++) {
                setPageItem(i);
            }
            if (selectedRangeLow > this.marginPages) {
                setBreakView(selectedRangeLow - 1)
            }
            if (selectedRangeHigh + 1 < this.pageCount - this.marginPages) {
                setBreakView(selectedRangeHigh + 1)
            }
            for (let i = this.pageCount - 1; i >= this.pageCount - this.marginPages; i--) {
                setPageItem(i);
            }
            }
            return items
        }
    },
    template: `
        <div class="products-pagination" v-if="pageCount">
            <a v-if="firstLastButton" @click="selectFirstPage()" @keyup.enter="selectFirstPage()" :class="[firstPageSelected() ? disabledClass : '']" v-html="firstButtonText"></a>
            <a v-if="!(firstPageSelected() && hidePrevNext)" @click="prevPage()" @keyup.enter="prevPage()" class="products-pagination-links" :class="[firstPageSelected() ? disabledClass : '']"><i class="fas fa-chevron-left"></i></a>
            <template v-for="page in pages">
                <a v-if="page.breakView" class="products-pagination-links" :class="[page.disabled ? disabledClass : '']">{{ breakViewText }}</a>
                <a v-else @click="handlePageSelected(page.index + 1)" class="products-pagination-links" @keyup.enter="handlePageSelected(page.index + 1)" :class="[page.selected ? 'products-pagination-links-active' : '']">{{ page.content }}</a>
            </template>
            <a v-if="!(lastPageSelected() && hidePrevNext)" @click="nextPage()" @keyup.enter="nextPage()" class="products-pagination-links" :class="[lastPageSelected() ? disabledClass : '']" ><i class="fas fa-chevron-right"></i></a>
        </div>
    `
});