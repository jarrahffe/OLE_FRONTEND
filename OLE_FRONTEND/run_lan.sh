lan_ip=ifconfig | grep -E '([0-9]+\.){3}[0-9]+ netmask.*broadcast' | cut -d ' ' -f2
vite --host $lan_ip
