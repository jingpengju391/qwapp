export default {
    set (key, value) {
        window.localStorage.setItem(key, JSON.stringify(value))
    },
    get (key) {
        let obj = window.localStorage.getItem(key)
        if (obj && obj !== 'undefined' && obj !== null) {
            return JSON.parse(obj)
        }
        return ''
    },
    remove (key) {
        if (key) window.localStorage.removeItem(key)
    }
}
