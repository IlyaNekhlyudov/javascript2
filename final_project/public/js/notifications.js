Vue.component('notices', {
    data() {
        return {
            notices: [],
            noticeObj: {
                note: '',
                type: '',
                item: '',
                textBold: '',
                text: '',
                noticeType: ''
            },
        }
    },
    methods: {
        setNotice(notice, type) {
            this.noticeObj.note = notice;
            if(type === 'error') {
                setTimeout(() => {
                    this.notices.splice(0, 1);
                }, 5000);
            } else {
                setTimeout(() => {
                    this.notices.splice(0, 1);
                }, 15000);
            }
            if (type === 'error') {
                this.noticeObj.type = "error animated headShake";
                this.noticeObj.item = "error-item";
                this.noticeObj.textBold = "error-item-text-bold";
                this.noticeObj.text = "error-item-text";
                this.noticeObj.noticeType = "Error";
            } else if (type === 'success') {
                this.noticeObj.type = "success animated headShake";
                this.noticeObj.item = "success-item";
                this.noticeObj.textBold = "success-item-text-bold";
                this.noticeObj.text = "success-item-text";
                this.noticeObj.noticeType = "Success";
            }
            this.notices.push({...this.noticeObj});
        },
    },
    template: `
        <div class='notice-block'>
            <notice
                v-for="(notice, i) in this.notices" 
                :key="i"
                :notice="notice"
            >
            </notice>
        </div>
    `
});

Vue.component('notice', {
    props: ['notice'],
    data() {
        return {
            isVisible: true,
        }
    },
    template: `
    <transition name="notice">
        <div :class="notice.type" v-if="isVisible">
            <div :class="notice.item">
                <div class="notice-info">
                    <p :class="notice.textBold">{{notice.noticeType}}</p>
                    <span class="notice-item-btn" @click="isVisible = false">X</span>
                </div>
                <div :class="notice.text">{{notice.note}}</div>
            </div>
        </div>
    </transition>
    `
});