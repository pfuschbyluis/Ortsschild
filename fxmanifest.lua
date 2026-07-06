fx_version "cerulean"
game "gta5"

name "Ortsschild"
description "GTA/FiveM HUD Zonen-Benachrichtigung"
author "Ortsschild"
version "1.0.0"

lua54 "yes"

ui_page "html/index.html"

files {
    "html/index.html",
    "html/css/zone-notification.css",
    "html/js/zone-notification.js",
}

shared_script "config.lua"
client_script "client.lua"
