try {
    const models = require('./models');
    console.log('Models loaded successfully:', Object.keys(models));
} catch (e) {
    console.error('Error loading models:', e);
}
