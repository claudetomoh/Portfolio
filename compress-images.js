const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');

// Images to compress (files over 200KB)
const imagesToCompress = [
    { input: 'rise-for-impact-screenshot.png', output: 'rise-for-impact-screenshot.webp', maxSize: 150 },
    { input: 'agrilink-screenshot.png', output: 'agrilink-screenshot.webp', maxSize: 150 },
    { input: 'smart-tutor.png', output: 'smart-tutor-screenshot.webp', maxSize: 150 },
    { input: 'customer-support.png', output: 'ai-chatbot-screenshot.webp', maxSize: 150 }
];

async function compressImage(inputFile, outputFile, targetSizeKB) {
    const inputPath = path.join(imagesDir, inputFile);
    const outputPath = path.join(imagesDir, outputFile);

    if (!fs.existsSync(inputPath)) {
        console.log(`❌ File not found: ${inputFile}`);
        return null;
    }

    const inputStats = fs.statSync(inputPath);
    const inputSizeKB = (inputStats.size / 1024).toFixed(2);

    console.log(`\n📸 Processing: ${inputFile} (${inputSizeKB} KB)`);

    // Try different quality levels to hit target size
    let quality = 85;
    let outputSizeKB = 0;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        await sharp(inputPath)
            .webp({ quality, effort: 6 })
            .toFile(outputPath);

        const outputStats = fs.statSync(outputPath);
        outputSizeKB = (outputStats.size / 1024).toFixed(2);

        if (outputSizeKB <= targetSizeKB || quality <= 60) {
            break;
        }

        // Adjust quality based on how far we are from target
        const ratio = targetSizeKB / outputSizeKB;
        quality = Math.max(60, Math.floor(quality * ratio * 0.95));
        attempts++;
    }

    const reduction = ((1 - outputSizeKB / inputSizeKB) * 100).toFixed(1);
    console.log(`✅ Compressed: ${outputFile} (${outputSizeKB} KB, ${reduction}% reduction, quality: ${quality})`);

    return {
        input: inputFile,
        output: outputFile,
        inputSizeKB: parseFloat(inputSizeKB),
        outputSizeKB: parseFloat(outputSizeKB),
        reduction: parseFloat(reduction),
        quality
    };
}

async function main() {
    console.log('🚀 Starting image compression...\n');
    console.log('Target: < 150 KB per image, Quality > 80%\n');

    const results = [];

    for (const img of imagesToCompress) {
        const result = await compressImage(img.input, img.output, img.maxSize);
        if (result) {
            results.push(result);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPRESSION SUMMARY');
    console.log('='.repeat(80) + '\n');

    results.forEach(r => {
        console.log(`${r.input} → ${r.output}`);
        console.log(`  Before: ${r.inputSizeKB} KB`);
        console.log(`  After:  ${r.outputSizeKB} KB`);
        console.log(`  Saved:  ${r.reduction}% (Quality: ${r.quality})`);
        console.log('');
    });

    const totalBefore = results.reduce((sum, r) => sum + r.inputSizeKB, 0);
    const totalAfter = results.reduce((sum, r) => sum + r.outputSizeKB, 0);
    const totalReduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);

    console.log(`Total size before: ${totalBefore.toFixed(2)} KB`);
    console.log(`Total size after:  ${totalAfter.toFixed(2)} KB`);
    console.log(`Total reduction:   ${totalReduction}%`);
    console.log('\n✨ Compression complete!\n');
}

main().catch(console.error);