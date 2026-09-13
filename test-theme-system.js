// Quick Theme System Test
// Run in browser console: node test-theme-system.js
// Or paste in browser DevTools console

console.log('🎨 Starting Theme System Test...\n');

// Test 1: Check if CSS variables are defined
console.log('📋 Test 1: CSS Variables');
const root = document.documentElement;
const computedStyle = getComputedStyle(root);

const requiredVars = [
  '--background',
  '--foreground',
  '--surface',
  '--surface-secondary',
  '--border',
  '--primary',
  '--primary-foreground',
  '--muted',
  '--muted-foreground',
];

let test1Pass = true;
requiredVars.forEach(varName => {
  const value = computedStyle.getPropertyValue(varName).trim();
  if (value) {
    console.log(`  ✅ ${varName}: ${value}`);
  } else {
    console.log(`  ❌ ${varName}: NOT DEFINED`);
    test1Pass = false;
  }
});

console.log(test1Pass ? '\n✅ Test 1: PASS\n' : '\n❌ Test 1: FAIL\n');

// Test 2: Check HTML classes
console.log('📋 Test 2: HTML Classes');
const htmlClasses = root.classList;
const hasThemeClass = htmlClasses.contains('light') || htmlClasses.contains('dark');
console.log(`  HTML classes: ${Array.from(htmlClasses).join(', ')}`);
console.log(`  Has theme class: ${hasThemeClass ? '✅ YES' : '❌ NO'}`);

const test2Pass = hasThemeClass;
console.log(test2Pass ? '\n✅ Test 2: PASS\n' : '\n❌ Test 2: FAIL\n');

// Test 3: Check data-theme attribute
console.log('📋 Test 3: Theme Attributes');
const dataTheme = root.getAttribute('data-theme');
const dataColorTheme = root.getAttribute('data-color-theme');
console.log(`  data-theme: ${dataTheme || '❌ NOT SET'}`);
console.log(`  data-color-theme: ${dataColorTheme || '❌ NOT SET'}`);

const test3Pass = !!dataTheme && !!dataColorTheme;
console.log(test3Pass ? '\n✅ Test 3: PASS\n' : '\n❌ Test 3: FAIL\n');

// Test 4: Theme switching simulation
console.log('📋 Test 4: Theme Switching Simulation');
const originalBg = computedStyle.getPropertyValue('--background');
console.log(`  Original background: ${originalBg}`);

// Simulate light mode
root.classList.remove('dark');
root.classList.add('light');
setTimeout(() => {
  const newBg = getComputedStyle(root).getPropertyValue('--background');
  console.log(`  After switching to light: ${newBg}`);
  const test4Pass = originalBg !== newBg;
  console.log(test4Pass ? '  ✅ Background changed' : '  ❌ Background DID NOT change');
  
  // Restore original state
  root.classList.remove('light');
  root.classList.add('dark');
  
  console.log(test4Pass ? '\n✅ Test 4: PASS\n' : '\n❌ Test 4: FAIL\n');
  
  // Final summary
  const allPass = test1Pass && test2Pass && test3Pass && test4Pass;
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(allPass ? '✅ ALL TESTS PASSED!' : '❌ SOME TESTS FAILED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (allPass) {
    console.log('\n🎉 Theme system is working correctly!');
    console.log('👉 Now test manually by going to Profile → Settings → Theme');
  } else {
    console.log('\n⚠️  Some issues detected. Check the failed tests above.');
  }
}, 500);
