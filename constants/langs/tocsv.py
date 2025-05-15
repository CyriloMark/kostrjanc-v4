import json

with open("dsb.json") as f:
    dsb = json.loads(f.read())["app"]

with open("hsb.json") as f:
    hsb = json.loads(f.read())["app"]

csv_lines = ["key,dsb,hsb"]

for key in dsb.keys():
    csv_lines.append(
        f'{key},"{dsb[key]}","{hsb[key]}"'
    )

with open("text.csv", "w") as f:
    f.write("\n".join(csv_lines))