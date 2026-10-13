const fs = require('fs');
const path = require('path');

// Read main.js and index.html to verify all selectors match exactly
const html = fs.readFileSync(path.resolve('index.html'), 'utf-8');
const js = fs.readFileSync(path.resolve('js/main.js'), 'utf-8');

console.log('--- Verifying DOM IDs and Selectors ---');
const idsToCheck = [
  'selected-weight-display',
  'product-sku-value',
  'product-price-current',
  'product-price-old',
  'product-discount-badge',
  'product-savings-value',
  'product-unit-price',
  'quantity-input',
  'quantity-minus',
  'quantity-plus',
  'btn-add-to-cart',
  'btn-add-to-cart-text',
  'btn-favorite',
  'btn-share',
  'header-cart-badge',
  'header-wishlist-badge',
  'gallery-main',
  'gallery-main-img',
  'gallery-lightbox',
  'lightbox-img',
  'lightbox-close',
  'gallery-zoom-btn',
  'action-toast',
  'toast-title',
  'toast-message',
  'toast-close',
  'mobile-sticky-bar',
  'sticky-price',
  'sticky-meta',
  'sticky-cart-btn'
];

let allFound = true;
idsToCheck.forEach(id => {
  const inHtml = html.includes(`id="${id}"`);
  if (!inHtml) {
    console.error(`MISSING ID in index.html: #${id}`);
    allFound = false;
  } else {
    console.log(`✓ Found id: #${id}`);
  }
});

console.log('--- Checking Packaging Data against requirements ---');
const expectedVariants = [
  { weight: '100', sku: '01306', price: '326,40', oldPrice: '349,20' },
  { weight: '500', sku: '01307', price: '1 432', oldPrice: '1 646' },
  { weight: '1000', sku: '01308', price: '2 064', oldPrice: '2 592' },
  { weight: '5000', sku: '01309', price: '6 320', oldPrice: '8 710' }
];

expectedVariants.forEach(v => {
  const hasSku = js.includes(v.sku);
  const hasPrice = js.includes(v.price);
  const hasOldPrice = js.includes(v.oldPrice);
  if (hasSku && hasPrice && hasOldPrice) {
    console.log(`✓ Variant ${v.weight}g data matches specification (${v.sku}: ${v.oldPrice} -> ${v.price})`);
  } else {
    console.error(`Mismatch for variant ${v.weight}g`);
    allFound = false;
  }
});

if (allFound) {
  console.log('\n>>> ALL TEST VERIFICATIONS PASSED 100%! <<<');
} else {
  process.exit(1);
}
