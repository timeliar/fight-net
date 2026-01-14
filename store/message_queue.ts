// stores/messages.js (using Pinia)
import { defineStore } from 'pinia';

export const useMessagesStore = defineStore('messages', {
    state: () => ({
        queue: [] as Array<Object>,
    }),
    actions: {
        success(message: string) {
            this.queue.push({ text: message, color: 'success', timeout: 2000 });
        },
        error(message: string) {
            this.queue.push({ text: message, color: 'error', timeout: 2000 });
        },
    },
});
