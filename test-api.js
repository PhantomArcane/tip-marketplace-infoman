const fs = require('fs');
fetch('http://localhost:8787/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'Test',
        description: 'Test description',
        price: '100',
        category: 'Books',
        image: '',
        condition: 'Good',
        sellerId: 'u_123',
        sellerName: 'Test Seller'
    })
}).then(r => r.json()).then(console.log).catch(console.error);
