Set WshShell = WScript.CreateObject("WScript.Shell")
obj = WshShell.Run("runJatabase.bat", 0)
set WshShell = Nothing