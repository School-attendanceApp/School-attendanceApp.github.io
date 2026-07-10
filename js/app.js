import { initUI } from './ui.js';
import { setupRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    initUI();
    setupRouter();
});