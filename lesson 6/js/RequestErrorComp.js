Vue.component('error', {
    data () {
        return {
            error: [],
        }
    },
    methods: {
        addError(info) {
            this.error.push(info);
            console.log(`Ошибка запроса: ${info}`);
        }
    },
    template: `
        <div v-if='error.length > 0' class='error'>Возникла ошибка. Проверьте консоль.</div>
    `
});