import json
import os
import sys
from typing import Dict, List

import requests
from requests.auth import HTTPBasicAuth

from dotenv import load_dotenv

load_dotenv()

CLOUD_NAME = os.environ["CLOUDINARY_CLOUD_NAME"]
API_KEY = os.environ["CLOUDINARY_API_KEY"]
API_SECRET = os.environ["CLOUDINARY_API_SECRET"]

# Clave JSON -> nombre exacto de la asset folder en Cloudinary
FOLDERS: Dict[str, str] = {
    "main_artworks": "main-art",
    "creatures": "creatures",
    # "sketches": "sketches",
    "traditional": "traditional",
}

ADMIN_URL = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/resources/by_asset_folder"


def list_folder_assets(asset_folder: str) -> List[dict]:
    results: List[dict] = []
    next_cursor = None

    while True:
        params = {
            "asset_folder": asset_folder,
            "resource_type": "image",
            "max_results": 500,
        }
        if next_cursor:
            params["next_cursor"] = next_cursor

        response = requests.get(
            ADMIN_URL,
            params=params,
            auth=HTTPBasicAuth(API_KEY, API_SECRET),
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()

        results.extend(payload.get("resources", []))
        next_cursor = payload.get("next_cursor")
        if not next_cursor:
            break

    return results


def sort_assets_alphabetically(assets: List[dict]) -> List[dict]:
    return sorted(
        assets,
        key=lambda a: (
            (a.get("display_name") or "").lower(),
            (a.get("public_id") or "").lower(),
        ),
    )


def build_gallery_json() -> Dict[str, List[dict]]:
    gallery: Dict[str, List[dict]] = {}

    for json_key, asset_folder in FOLDERS.items():
        assets = list_folder_assets(asset_folder)
        assets = sort_assets_alphabetically(assets)

        gallery[json_key] = [
            {
                "display_name": asset.get("display_name") or asset.get("public_id"),
                "public_id": asset.get("public_id"),
                "asset_folder": asset.get("asset_folder"),
                "secure_url": asset.get("secure_url"),
                "width": asset.get("width"),
                "height": asset.get("height"),
                "format": asset.get("format"),
            }
            for asset in assets
        ]

    return gallery


def main() -> int:
    try:
        gallery = build_gallery_json()
    except KeyError as exc:
        print(f"Missing environment variable: {exc}", file=sys.stderr)
        return 1
    except requests.HTTPError as exc:
        print(f"Cloudinary API error: {exc}", file=sys.stderr)
        if exc.response is not None:
            print(exc.response.text, file=sys.stderr)
        return 2

    with open("gallery.json", "w", encoding="utf-8") as f:
        json.dump(gallery, f, indent=2, ensure_ascii=False)

    print("gallery.json generated successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())