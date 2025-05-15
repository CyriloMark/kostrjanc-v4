import requests
import json

with open("hsb.json") as f:
    data = json.load(f)["app"]

translation = {"app": {}}

for i, key in enumerate(data.keys()):
    r = requests.post("https://sotra.app/?uri=/ws/translate/&_version=2.0.57", json={
        "direction": "hsb_dsb",
        "text": data[key],
        "translationtype": "lsf",
        "warnings": False
    })
    translation["app"][key] = r.json()["output_text"].replace("¶", "").replace("\n", "").replace("┊", " ").strip()
    print(f"{i+1}/{len(data.keys())}")

with open("dsb.json", "w") as f:
    f.write(json.dumps(translation, ensure_ascii=False))