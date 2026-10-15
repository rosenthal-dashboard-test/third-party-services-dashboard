"""Check that every file in dataExports/ follows localStorageFormats.md.

Usage: python -I check_exports.py dataExports
Prints the item count per service and every problem found. Exits with 1 if there
are problems.
"""
import json
import pathlib
import re
import sys

COMMON_KEYS = ["service", "type", "id", "title", "date", "url", "text", "downloadedAt", "metadata"]

# Expected file name for each item. Services not listed here use "<id>.json".
SERVICES = {
    "github": lambda item: f"{item['metadata']['repo']}-{item['metadata']['number']}.json",
}

DATE_ONLY = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TIMESTAMP = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$")
DOWNLOADED_AT = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")

# Things that must never end up in a public repo.
SECRET_PATTERNS = [
    re.compile(r"gh[pousr]_[A-Za-z0-9]{20,}"),
    re.compile(r"github_pat_[A-Za-z0-9_]{20,}"),
    re.compile(r"xox[abpr]-[A-Za-z0-9-]{10,}"),
    re.compile(r"sk-[A-Za-z0-9]{20,}"),
    re.compile(r"AIza[0-9A-Za-z_-]{30,}"),
    re.compile(r"Bearer\s+[A-Za-z0-9._-]{20,}"),
]


def check_item(path, item, folder):
    problems = []
    if not isinstance(item, dict):
        return ["not a JSON object"]
    if list(item.keys()) != COMMON_KEYS:
        problems.append(f"keys must be exactly {COMMON_KEYS} in this order, found {list(item.keys())}")
        return problems
    if item["service"] != folder:
        problems.append(f"service is {item['service']!r} but the folder is {folder!r}")
    for key in ["type", "id", "title", "url", "text"]:
        if not isinstance(item[key], str):
            problems.append(f"{key} must be a string")
    for key in ["type", "id", "title", "url"]:
        if isinstance(item[key], str) and not item[key].strip():
            problems.append(f"{key} is empty")
    if not isinstance(item["metadata"], dict):
        problems.append("metadata must be an object")
    if not (isinstance(item["date"], str) and (DATE_ONLY.match(item["date"]) or TIMESTAMP.match(item["date"]))):
        problems.append(f"date {item['date']!r} is not ISO 8601 (YYYY-MM-DD or a full timestamp)")
    if not (isinstance(item["downloadedAt"], str) and DOWNLOADED_AT.match(item["downloadedAt"])):
        problems.append(f"downloadedAt {item['downloadedAt']!r} is not YYYY-MM-DDTHH:MM:SSZ")
    if isinstance(item["metadata"], dict) and isinstance(item["id"], str):
        try:
            expected = SERVICES.get(folder, lambda i: f"{i['id']}.json")(item)
        except (KeyError, TypeError) as e:
            expected = None
            problems.append(f"cannot build the file name, missing metadata {e}")
        if expected and path.name != expected:
            problems.append(f"file name should be {expected}")
    return problems


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    root = pathlib.Path(sys.argv[1])
    if not root.is_dir():
        print(f"{root} is not a folder")
        return 2

    problems = []
    for folder in sorted(p for p in root.iterdir() if p.is_dir()):
        files = sorted(folder.glob("*.json"))
        ids = {}
        for path in files:
            raw = path.read_text(encoding="utf-8")
            for pattern in SECRET_PATTERNS:
                if pattern.search(raw):
                    problems.append(f"{path}: looks like it contains a token or key ({pattern.pattern})")
            try:
                item = json.loads(raw)
            except json.JSONDecodeError as e:
                problems.append(f"{path}: invalid JSON ({e})")
                continue
            problems += [f"{path}: {p}" for p in check_item(path, item, folder.name)]
            item_id = item.get("id") if isinstance(item, dict) else None
            if item_id in ids:
                problems.append(f"{path}: same id as {ids[item_id]}")
            ids[item_id] = path.name
        print(f"{folder.name}: {len(files)} items")

    if problems:
        print(f"\n{len(problems)} problem(s):")
        print("\n".join(problems))
        return 1
    print("\nOK: every file follows localStorageFormats.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
