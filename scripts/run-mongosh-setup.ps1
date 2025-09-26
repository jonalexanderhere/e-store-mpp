# Locate mongosh.exe and run the setup script
$ErrorActionPreference = 'Stop'

$defaultPaths = @(
  'C:\Program Files',
  'C:\Program Files (x86)',
  "C:\Users\$env:USERNAME"
)

$mongoshPath = $null
foreach ($p in $defaultPaths) {
  try {
    $found = Get-ChildItem -Path $p -Recurse -Filter 'mongosh.exe' -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($found) { $mongoshPath = $found; break }
  } catch {}
}

if (-not $mongoshPath) {
  # Try common default
  $common = 'C:\Program Files\MongoDB\mongosh\current\bin\mongosh.exe'
  if (Test-Path $common) { $mongoshPath = $common }
}

if (-not $mongoshPath) {
  Write-Error 'mongosh.exe not found. Please reopen PowerShell or add mongosh to PATH.'
  exit 1
}

Write-Host ("Using mongosh at: " + $mongoshPath)

$uri = "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:5scP865PtNLctb4k@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority"

& "$mongoshPath" "$uri" --apiVersion 1 --file "mongodb-connect.js"

