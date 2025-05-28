import requests

url = "https://cdn.plot.ly/plotly-latest.min.js"
r = requests.get(url)

with open("static/plotly-latest.min.js", "wb") as f:
    f.write(r.content)

print("Plotly downloaded to static/plotly-latest.min.js")


