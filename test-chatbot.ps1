$body = @{
    message = "What should I eat during pregnancy?"
    language = "en"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:8000/chatbot/public" -Method POST -Body $body -ContentType "application/json"
Write-Host $result