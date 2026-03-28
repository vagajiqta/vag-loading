AddEventHandler('loadingScreen:loaded', function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        eventName = 'playerName',
        name = GetPlayerName(PlayerId())
    })
end)
