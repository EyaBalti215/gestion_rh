<#
Usage: exécuter PowerShell en Administrateur
- Pour seulement appliquer la configuration DNS et redémarrer Docker:
    .\fix-docker-dns.ps1
- Pour appliquer + relancer la stack Docker automatiquement (peut supprimer volumes):
    .\fix-docker-dns.ps1 -RunCompose
#>

param(
  [switch]$RunCompose
)

$daemonPath = 'C:\ProgramData\Docker\config\daemon.json'
$backupPath = "$daemonPath.bak_$(Get-Date -Format o).bak"

Write-Host "[1/5] Vérification privilèges..." -ForegroundColor Cyan
if (-not ([bool](net session 2>$null))) {
  Write-Warning "Ce script doit être exécuté en tant qu'administrateur. Relancez PowerShell en mode Administrateur.";
  exit 1
}

Write-Host "[2/5] Sauvegarde éventuelle et écriture de $daemonPath" -ForegroundColor Cyan
if (Test-Path $daemonPath) {
  Copy-Item -Path $daemonPath -Destination $backupPath -Force
  Write-Host "  Sauvegarde créée: $backupPath"
} else {
  New-Item -ItemType Directory -Path (Split-Path $daemonPath) -Force | Out-Null
}

$daemonJson = @'
{
  "dns": ["8.8.8.8", "1.1.1.1"]
}
'@

$daemonJson | Out-File -FilePath $daemonPath -Encoding UTF8 -Force
Write-Host "  Fichier $daemonPath écrit." -ForegroundColor Green

Write-Host "[3/5] Redémarrage du service Docker..." -ForegroundColor Cyan
Try {
  Restart-Service -Name com.docker.service -Force -ErrorAction Stop
  Write-Host "  Service 'com.docker.service' redémarré." -ForegroundColor Green
} Catch {
  Try {
    Restart-Service -Name 'Docker Desktop Service' -Force -ErrorAction Stop
    Write-Host "  Service 'Docker Desktop Service' redémarré." -ForegroundColor Green
  } Catch {
    Write-Warning "Impossible de redémarrer automatiquement le service Docker. Relancez Docker Desktop manuellement.";
  }
}

Write-Host "[4/5] Vérifications DNS (résolution auth.docker.io)..." -ForegroundColor Cyan
Try {
  Resolve-DnsName auth.docker.io -ErrorAction Stop | Select-Object -First 5 | Format-Table
  Test-NetConnection -ComputerName auth.docker.io -Port 443 | Format-List
} Catch {
  Write-Warning "La résolution DNS ou la connexion a échoué. Vérifiez votre connexion réseau / proxy.";
}

Write-Host "[5/5] Commandes recommandées à exécuter ensuite:" -ForegroundColor Cyan
Write-Host "  docker compose down -v" -ForegroundColor Yellow
Write-Host "  docker compose up --build --force-recreate" -ForegroundColor Yellow

if ($RunCompose) {
  Write-Host "\nOption -RunCompose fournie : arrêt et rebuild de la stack Docker (exécution)..." -ForegroundColor Cyan
  Write-Host "Attention : cette commande supprimera les volumes Docker (option -v) et ré-initialisera la DB. Continuer dans 5s..." -ForegroundColor Yellow
  Start-Sleep -Seconds 5
  docker compose down -v
  docker compose up --build --force-recreate
}

Write-Host "Terminé. Si le problème persiste, copiez ici les sorties des étapes de logs." -ForegroundColor Green
