Config = {}

-- Anzeigedauer der Notification in Millisekunden
Config.DefaultDuration = 8000

-- Zonen: Spieler erhält beim Betreten eine Notification
-- coords = Mittelpunkt der Zone (vector3)
-- radius = Radius in Metern
Config.Zones = {
    {
        id = "innenstadt",
        title = "Innenstadt",
        subtitle = "Bitte passen Sie Ihre Geschwindigkeit an.",
        coords = vector3(215.0, -810.0, 30.7),
        radius = 120.0,
        duration = 8000,
    },
    {
        id = "schulzone",
        title = "Schulzone",
        subtitle = "Maximal 30 km/h – Vorsicht, Kinder!",
        coords = vector3(-1370.0, -500.0, 33.0),
        radius = 80.0,
        duration = 8000,
    },
}
