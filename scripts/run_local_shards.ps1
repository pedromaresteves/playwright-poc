# Start both shard processes and keep track of them
$proc1 = Start-Process powershell -ArgumentList '-Command', '$env:shard=1; npx playwright test --shard=1/2' -NoNewWindow -PassThru
$proc2 = Start-Process powershell -ArgumentList '-Command', '$env:shard=2; npx playwright test --shard=2/2' -NoNewWindow -PassThru

# Wait for both processes to finish
Wait-Process -Id $proc1.Id
Wait-Process -Id $proc2.Id

# Create the merged blob-report folder if it doesn't exist
if (!(Test-Path -Path "blob-report")) {
    New-Item -ItemType Directory -Path "blob-report"
}

# Move all report-*.zip files from both shard folders to blob-report
foreach ($file in Get-ChildItem -Path "blob-report-1\report-*.zip") {
    $dest = Join-Path "blob-report" $file.Name
    if (Test-Path $dest) { Remove-Item $dest }
    Move-Item $file.FullName $dest
}
foreach ($file in Get-ChildItem -Path "blob-report-2\report-*.zip") {
    $dest = Join-Path "blob-report" $file.Name
    if (Test-Path $dest) { Remove-Item $dest }
    Move-Item $file.FullName $dest
}

npx playwright merge-reports blob-report --reporter=html