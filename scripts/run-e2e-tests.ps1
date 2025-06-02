# Load environment variables from .env file
function Load-EnvFile {
    param(
        [string]$EnvFilePath = ".env"
    )

    $envVars = @{}

    if (Test-Path $EnvFilePath) {
        Write-Host "Loading environment variables from $EnvFilePath" -ForegroundColor Green

        Get-Content $EnvFilePath | ForEach-Object {
            if ($_ -match "^\s*([^#][^=]*)\s*=\s*(.*)\s*$") {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim()

                # Remove quotes if present
                if ($value -match '^"(.*)"$') {
                    $value = $matches[1]
                } elseif ($value -match "^'(.*)'$") {
                    $value = $matches[1]
                }

                # Store in hashtable for passing to maestro
                $envVars[$name] = $value
                Write-Host "Loaded $name = $value" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host "Warning: .env file not found at $EnvFilePath" -ForegroundColor Yellow
        Write-Host "Please create a .env file with your test credentials:" -ForegroundColor Yellow
        Write-Host "E2E_EMAIL=your-test-email@example.com" -ForegroundColor Yellow
        Write-Host "E2E_PASSWORD=your-test-password" -ForegroundColor Yellow
        exit 1
    }

    return $envVars
}

# Load environment variables
$envVars = Load-EnvFile

# Run Maestro tests
Write-Host "Running Maestro E2E tests..." -ForegroundColor Green

# Get unique test files (avoid duplicates)
$testFiles = Get-ChildItem -Recurse -Filter *.yaml -Path e2e |
    Where-Object { $_.FullName -notmatch "\\commands\\" } |
    Sort-Object FullName -Unique

Write-Host "Found $($testFiles.Count) test file(s)" -ForegroundColor Green

foreach ($testFile in $testFiles) {
    Write-Host "`nRunning test: $($testFile.Name)" -ForegroundColor Cyan
    Write-Host "Path: $($testFile.FullName)" -ForegroundColor Gray

    # Build environment variables array for maestro
    $envArgs = @()
    foreach ($key in $envVars.Keys) {
        $envArgs += "--env"
        $envArgs += "$key=$($envVars[$key])"
    }

    # Run maestro with environment variables using & operator for better argument handling
    $maestroArgs = @("test") + $envArgs + @($testFile.FullName)

    Write-Host "Running: maestro $($maestroArgs -join ' ')" -ForegroundColor Gray

    & maestro $maestroArgs

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Test failed: $($testFile.Name)" -ForegroundColor Red
        exit $LASTEXITCODE
    }

    Write-Host "✓ Test passed: $($testFile.Name)" -ForegroundColor Green
}

Write-Host "`nAll tests completed successfully!" -ForegroundColor Green
