# Letters

## Tone and structure
- One page, the posting's language, calm and factual ("chill"): no superlatives, no "passionate", no "I am the perfect fit".
- Structure: hook in the posting's own words → proof 1 (most relevant recent role, two or three real figures) → proof 2 → advisory or sector paragraph only if the posting asks for it → close (location or commute, languages, earliest start).
- Titles exactly as on the CV. What was co-led stays co-led; reporting *to* a board is not sitting on it; a business case is not realised savings. Only figures from the CV or `_candidate_profile.md`.
- Never mention anything listed under "Never mention" in `rules.md`. No reasons for leaving.
- German postings: "Anschreiben", Sie-Form unless the posting uses du; salary and start date only when the posting asks for them in the letter.

## Rendering
`_Playbook/scripts/make_letters.py letters.json <output folder>` renders each letter to PDF (layout in the setup skill's `references/tools.md`).
```json
{"candidate": {"name": "Full Name", "tagline": "Target title line", "contact_line": "City • phone • e-mail • LinkedIn", "accent": "#12233f"},
 "letters": {"AcmeGmbH": {"lang": "de", "recipient_html": "Acme GmbH<br>Personalabteilung<br>Musterstraße 1<br>10115 Berlin",
   "place_date": "Berlin, 13. November 2026", "subject": "Bewerbung als Head of Strategy",
   "salutation": "Sehr geehrte Damen und Herren,", "paragraphs": ["…", "…"], "signoff": "Mit freundlichen Grüßen"}}}
```

## QA before upload
- `pdfinfo` → Pages: 1 (the script warns otherwise; shorten, never shrink the font).
- `pdffonts` → no Type 3 fonts.
- Read the letter once against the CV: every sentence traceable; company name and role spelled as in the posting.
- File name: `Lastname_Cover_Letter_<Company>.pdf` / `Lastname_Anschreiben_<Company>.pdf`; pack: `Lastname_Bewerbung_<Company>.pdf`.
- Size caps: Workday 5 MB, LinkedIn 2 MB; `build_pack.py OUT.pdf --max-mb 5 letter.pdf cv.pdf refs.pdf` compresses heavy scans.
