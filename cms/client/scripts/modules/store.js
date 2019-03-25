'use strict';

const MESSAGE_TIMEOUT = 4000;

const _store = {
    messages: [],
    isLoading: true,
};

export default {
    set(key, value) {
        _store[key] = value;
        this.update();
    },
    get(key) {
        return _store[key];
    },
    get messages() {
        return _store['messages'];
    },
    addMessage(message) {
        _store.messages.push(message);
        this.update();
        setTimeout(() => {
            _store.messages.shift();
            this.update();
        }, MESSAGE_TIMEOUT);
    },
    update() {},
};
