const fs = require('fs');
const path = require('path');

// Test file sizes in MB
const testSizes = [1, 5, 10, 25, 50, 60];

console.log('🧪 Testing Upload Limits - Offline Validation');
console.log('=============================================\n');

// Test 1: Check current server configuration
console.log('1️⃣ Checking Server Configuration:');
console.log('   - Express.js body limit: 50mb (current)');
console.log('   - Need to increase to: 100mb for 50MB files');
console.log('   - Status: ⚠️  Needs update\n');

// Test 2: Check form validation limits
console.log('2️⃣ Checking Form Validation Limits:');
console.log('   - signup-form-old.tsx: 5MB limit');
console.log('   - signup-form-landing.tsx: 5MB limit');
console.log('   - signup-form.tsx: No limit check');
console.log('   - signup-form-backup.tsx: No limit check');
console.log('   - testimonial-form.tsx: UI shows 10MB');
console.log('   - Status: ⚠️  All need updates to 50MB\n');

// Test 3: Check storage configuration
console.log('3️⃣ Checking Storage Configuration:');
console.log('   - Supabase bucket limit: 5MB (5242880 bytes)');
console.log('   - Need to increase to: 50MB (52428800 bytes)');
console.log('   - Status: ⚠️  Needs update\n');

// Test 4: File size validation
console.log('4️⃣ File Size Validation Test:');
testSizes.forEach(size => {
  const bytes = size * 1024 * 1024;
  const currentLimit = 5 * 1024 * 1024; // 5MB
  const newLimit = 50 * 1024 * 1024; // 50MB
  
  const currentStatus = bytes <= currentLimit ? '✅' : '❌';
  const newStatus = bytes <= newLimit ? '✅' : '❌';
  
  console.log(`   ${size}MB file: ${currentStatus} (current) → ${newStatus} (new)`);
});

console.log('\n📋 Summary:');
console.log('   - Server config needs update');
console.log('   - All forms need validation updates');
console.log('   - Storage bucket needs update');
console.log('   - Ready for offline testing after updates\n');

console.log('🚀 Next Steps:');
console.log('   1. Update server configuration');
console.log('   2. Update form validations');
console.log('   3. Update storage limits');
console.log('   4. Test locally with npm run dev');
console.log('   5. Verify all uploads work correctly'); 