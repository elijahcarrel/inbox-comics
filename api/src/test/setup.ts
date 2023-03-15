const nodeCrypto = require('crypto');

Object.defineProperty(globalThis, 'crypto', {
    value: {
        getRandomValues: (arr: Array<any>) => nodeCrypto.randomBytes(arr.length)
    }
});
