echo "Copying source files"

Copy-Item . C:\gph -Exclude *.ps1,*.md,*.cmd -Recurse -Force

echo "Registering GPH in PATH of Machine"

$gph = "C:\gph"
$Path = (Get-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment' -Name PATH).path -Split ';'

if($Path -NotContains $gph) {
    $value = $Path + $gph -Join ';'
    Set-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment' -Name PATH -Value $value
    echo "GPH registered in PATH of Machine"
} else {
    echo "GPH already registered in PATH of Machine"
}

echo "Registering GPH in PATH of User"

$Path = (Get-ItemProperty -Path 'Registry::HKEY_CURRENT_USER\Environment' -Name PATH).path -Split ';'

if($Path -NotContains $gph) {
    $value = $Path + $gph -Join ';'
    Set-ItemProperty -Path 'Registry::HKEY_CURRENT_USER\Environment' -Name PATH -Value $value
    echo "GPH registered in PATH of User"
} else {
    echo "GPH already registered in PATH of User"
}