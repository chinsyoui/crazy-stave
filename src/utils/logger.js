
//export default logger = {
module.exports = {
    wxrtlm: wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null,
    dev: (process.env.NODE_ENV === 'development'),

    assert(condition, ...args) {
        if (!condition)
            this.error("assertion failed:", ...args); 
    },
    error(...args) {
        console.error(...args);
        if (this.wxrtlm && !this.dev)
            this.wxrtlm.error(...args);
    },
    warn(...args) {
        console.warn(...args);
        if (this.wxrtlm && !this.dev)
            this.wxrtlm.warn(...args);
    },
    info(...args) {
        console.info(...args);
        if (this.wxrtlm && !this.dev)
            this.wxrtlm.info(...args);
    },
    debug(...args) {
        console.debug(...args);
        if (this.wxrtlm && !this.dev)
            this.wxrtlm.debug(...args);
    }
}
