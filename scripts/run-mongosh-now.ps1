$ErrorActionPreference = 'Stop'

$exeCandidates = @(
  'C:\Program Files\MongoDB\mongosh\current\bin\mongosh.exe',
  'C:\Program Files\MongoDB Shell\bin\mongosh.exe'
)

$exe = $null
foreach ($c in $exeCandidates) {
  if (Test-Path $c) { $exe = $c; break }
}

if (-not $exe) {
  Write-Error 'mongosh.exe not found. Please reopen PowerShell or add mongosh to PATH.'
  exit 1
}

$uri = 'mongodb+srv://Vercel-Admin-atlas-lightBlue-book:5scP865PtNLctb4k@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority'
$args = @($uri,'--apiVersion','1','--file','mongodb-connect.js')

Write-Host ("Using mongosh at: " + $exe)
Start-Process -FilePath $exe -ArgumentList $args -Wait -NoNewWindow
