import urllib.request

try:
    with urllib.request.urlopen("http://localhost:3000/") as response:
        content = response.read().decode("utf-8")
        print("HTTP Status Code:", response.status)
        print("HTML Length:", len(content))
        print("Contains root div:", '<div id="root">' in content)
except Exception as e:
    print("Error fetching http://localhost:3000/:", e)
