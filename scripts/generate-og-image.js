/**
 * Generate Open Graph PNG image from SVG
 * This script requires 'sharp' package
 * 
 * Install: npm install sharp
 * Run: node scripts/generate-og-image.js
 */

const fs = require('fs');
const path = require('path');

// SVG Template for Social Card
const svgTemplate = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#0F172A"/>
  
  <!-- Top accent line -->
  <rect x="0" y="0" width="1200" height="8" fill="#F59E0B"/>
  
  <!-- Bottom accent line -->
  <rect x="0" y="622" width="1200" height="8" fill="#F59E0B"/>
  
  <!-- Large EDX Letters - Centered -->
  <g transform="translate(300, 180)">
    <!-- E Letter -->
    <path d="M0 0 H120 M0 0 V240 M0 120 H110 M0 240 H120" 
          stroke="#F59E0B" 
          stroke-width="24" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          fill="none"/>
    
    <!-- D Letter -->
    <path d="M160 0 H240 C300 0 340 60 340 120 C340 180 300 240 240 240 H160 V0 Z" 
          stroke="#F59E0B" 
          stroke-width="24" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          fill="none"/>
    
    <!-- X Letter -->
    <path d="M390 0 L510 240 M510 0 L390 240" 
          stroke="#F59E0B" 
          stroke-width="24" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>
  </g>
  
  <!-- Title -->
  <text x="600" y="500" 
        font-family="Arial, sans-serif" 
        font-size="48" 
        font-weight="bold" 
        fill="#F8FAFC" 
        text-anchor="middle">
    EDX CRM - Web Developer Project Manager
  </text>
  
  <!-- Subtitle in Persian -->
  <text x="600" y="560" 
        font-family="Arial, sans-serif" 
        font-size="28" 
        fill="#94A3B8" 
        text-anchor="middle"
        direction="rtl">
    مدیریت پروژه‌های وب با هوش مصنوعی
  </text>
  
  <!-- Decorative elements -->
  <circle cx="150" cy="315" r="8" fill="#F59E0B" opacity="0.8"/>
  <circle cx="1050" cy="315" r="8" fill="#F59E0B" opacity="0.8"/>
</svg>
`.trim();

// Try to use Sharp if available
async function generatePNG() {
  try {
    const sharp = require('sharp');
    
    const buffer = Buffer.from(svgTemplate);
    
    await sharp(buffer)
      .png()
      .toFile(path.join(__dirname, '../public/og-image.png'));
    
    console.log('✅ PNG image generated successfully: public/og-image.png');
    console.log('📝 Update index.html og:image to: /og-image.png');
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('⚠️  Sharp not installed. Installing instructions:');
      console.log('   npm install sharp');
      console.log('');
      console.log('📄 Alternative: Use online converter:');
      console.log('   1. Copy SVG content from public/assets/social-card.svg');
      console.log('   2. Go to: https://svgtopng.com/');
      console.log('   3. Convert to PNG (1200x630)');
      console.log('   4. Save as: public/og-image.png');
      
      // Save SVG anyway for manual conversion
      fs.writeFileSync(
        path.join(__dirname, '../public/og-image-template.svg'),
        svgTemplate
      );
      console.log('✅ SVG template saved: public/og-image-template.svg');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

generatePNG();
