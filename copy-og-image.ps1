# PowerShell script to copy OG image from Downloads to public folder

Write-Host "🔍 در حال جستجوی فایل og-image.png در Downloads..." -ForegroundColor Yellow

$downloadsPath = "$env:USERPROFILE\Downloads"
$possibleNames = @("og-image.png", "edx-crm-social-card.png", "og-image-hd.png")

$foundFile = $null

foreach ($name in $possibleNames) {
    $filePath = Join-Path $downloadsPath $name
    if (Test-Path $filePath) {
        $foundFile = $filePath
        Write-Host "✅ فایل پیدا شد: $name" -ForegroundColor Green
        break
    }
}

if ($foundFile) {
    $destination = "public\og-image.png"
    Copy-Item $foundFile $destination -Force
    Write-Host "✅ فایل با موفقیت کپی شد به: $destination" -ForegroundColor Green
    
    # Show file info
    $fileInfo = Get-Item $destination
    Write-Host "📊 اطلاعات فایل:" -ForegroundColor Cyan
    Write-Host "   - اندازه: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor White
    Write-Host "   - مسیر: $($fileInfo.FullName)" -ForegroundColor White
    
    Write-Host "`n✅ حالا می‌توانید git add کنید:" -ForegroundColor Green
    Write-Host "   git add public/og-image.png" -ForegroundColor Yellow
    
} else {
    Write-Host "❌ فایل در Downloads پیدا نشد!" -ForegroundColor Red
    Write-Host "`n📝 لطفاً این مراحل را دنبال کنید:" -ForegroundColor Yellow
    Write-Host "1. فایل public\create-og-image.html را در مرورگر باز کنید" -ForegroundColor White
    Write-Host "2. روی دکمه 'دانلود PNG' کلیک کنید" -ForegroundColor White
    Write-Host "3. سپس این اسکریپت را دوباره اجرا کنید" -ForegroundColor White
}
