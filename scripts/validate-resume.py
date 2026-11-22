"""Verify that the generated PDFs match their visible HTML documents."""

import json
import re
import sys
import unicodedata
from pathlib import Path

from pypdf import PdfReader


def normalize(text):
    return re.sub(r"[\s\u00ad\u2022]+", "", unicodedata.normalize("NFKC", text))


def verify_page(page, expected):
    if abs(float(page.mediabox.width) - 595.28) >= 1 or abs(float(page.mediabox.height) - 841.89) >= 1:
        raise ValueError("The paper size is not A4.")
    if normalize(page.extract_text()) != normalize(expected["text"]):
        raise ValueError("The selectable PDF text differs from the HTML or its reading order.")

    destinations = set()
    for annotation in page.get("/Annots", []):
        action = annotation.get_object().get("/A", {})
        if "/URI" in action:
            destinations.add(action["/URI"])
    if destinations != set(expected["links"]):
        raise ValueError("The PDF links differ from the HTML.")

    for font_ref in page["/Resources"]["/Font"].values():
        font = font_ref.get_object()
        if font.get("/DescendantFonts"):
            font = font["/DescendantFonts"][0].get_object()
        descriptor = font["/FontDescriptor"].get_object()
        if "SourceSans3" not in descriptor["/FontName"]:
            raise ValueError("An unexpected font was used.")
        if not any(file in descriptor for file in ("/FontFile", "/FontFile2", "/FontFile3")):
            raise ValueError("A PDF font was not embedded.")


def main(manifest):
    for variant in json.loads(manifest.read_text(encoding="utf-8")):
        pdf = PdfReader(manifest.parent / variant["file"])
        if len(pdf.pages) != 2 or pdf.root_object.get("/Lang") != variant["lang"]:
            raise ValueError(f'{variant["file"]}: expected two pages in {variant["lang"]}.')
        if "/StructTreeRoot" not in pdf.root_object:
            raise ValueError(f'{variant["file"]}: the PDF is not tagged.')
        for number, (page, expected) in enumerate(zip(pdf.pages, variant["pages"], strict=True), 1):
            try:
                verify_page(page, expected)
            except ValueError as error:
                raise ValueError(f'{variant["file"]}, page {number}: {error}') from None
        print(f'{variant["file"]}: 2 A4 pages, selectable text, embedded font and links verified.')


if __name__ == "__main__":
    try:
        main(Path(sys.argv[1]))
    except ValueError as error:
        sys.exit(str(error))
