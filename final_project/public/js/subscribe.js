Vue.component('subscribe', {
    data() {
        return {
            email: '',
            emailInfo: {
                date: '',
                email: '',
            },
            emailList: [],
        }
    },
    methods: {
        addEmail() {
            if(!this.validateEmail(this.email)) {
                this.$parent.$refs.notice.setNotice(`The email field should be completed as follows: email@site.com.`, 'error');
            }
            else {
                if(this.emailList.length === 0) {
                    this.emailInfo.date = new Date();
                        this.emailInfo.email = this.email;
                        this.$parent.postJsonText('/api/email', this.emailInfo)
                        .then(data => {
                            if (data.result === 1) {
                                this.emailList.push(this.emailInfo);
                                this.$parent.$refs.notice.setNotice(`${this.email} successfully subscribed to news.`, 'success');
                            }
                        });
                }
                let find = this.emailList.find(el => el.email === this.email);
                if(find === undefined) {
                    this.emailInfo.date = new Date();
                    this.emailInfo.email = this.email;
                    this.$parent.postJsonText('/api/email', this.emailInfo)
                    .then(data => {
                        if (data.result === 1) {
                            this.emailList.push(this.emailInfo);
                            console.log(this.emailList);
                            this.$parent.$refs.notice.setNotice(`${this.email} successfully subscribed to news.`, 'success');
                        }
                    });
                }
                else {
                    this.$parent.$refs.notice.setNotice(`${this.email} already subscribed to news.`, 'error');
                }
            }
        },
        validateEmail(email) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    },
    mounted() {
        this.$parent.getJson(`/api/email`)
            .then(data => {
                for(let el of data.list){
                    this.emailList.push(el);
                }
            });
    },
    template: `
        <div class="review-right-block">
            <h3 class="review-h3"><span class="review-subscribe">Subscribe</span> <br>
                FOR OUR NEWLETTER AND PROMOTION</h3>
            <div class="email">
                <input type="email" id='email' v-model="email" @keyup.enter="addEmail()" placeholder='Enter Your Email' required>
                <a type="submit" @click="addEmail()" id="subscribe">Subscribe</a>
            </div>
        </div>
    `
});