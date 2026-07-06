local activeZoneId = nil

local function showNotification(title, subtitle, duration)
    SendNUIMessage({
        action = "showZoneNotification",
        title = title,
        subtitle = subtitle,
        duration = duration or Config.DefaultDuration,
    })
end

local function hideNotification()
    SendNUIMessage({
        action = "hideZoneNotification",
    })
end

exports("ShowZoneNotification", showNotification)
exports("HideZoneNotification", hideNotification)

RegisterNetEvent("ortsschild:show", function(title, subtitle, duration)
    showNotification(title, subtitle, duration)
end)

RegisterNetEvent("ortsschild:hide", function()
    hideNotification()
end)

RegisterCommand("zonenotify", function()
    showNotification("Innenstadt", "Bitte passen Sie Ihre Geschwindigkeit an.")
end, false)

CreateThread(function()
    while true do
        local sleep = 1000
        local ped = PlayerPedId()

        if ped ~= 0 then
            local coords = GetEntityCoords(ped)
            local insideZoneId = nil

            for _, zone in ipairs(Config.Zones) do
                local distance = #(coords - zone.coords)

                if distance <= zone.radius then
                    insideZoneId = zone.id

                    if activeZoneId ~= zone.id then
                        activeZoneId = zone.id
                        showNotification(zone.title, zone.subtitle, zone.duration)
                    end

                    sleep = 500
                    break
                end
            end

            if not insideZoneId and activeZoneId then
                activeZoneId = nil
            end
        end

        Wait(sleep)
    end
end)
