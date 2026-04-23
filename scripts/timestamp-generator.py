import json
import os

import whisper

LANGUAGE_MAP = {
    "latin": "la",
    "pt-br": "pt",
    "es": "es",
    "fr": "fr",
    "it": "it",
    "en": "en",
}

model = whisper.load_model("base")

for root, dirs, files in os.walk("public/audios"):
    for filename in files:
        if not filename.endswith(".mp3"):
            continue

        audio_path = os.path.join(root, filename)

        parts = root.split(os.sep)  # e.g. ['public', 'audios', 'latin', 'male']
        lang_key = parts[2]
        voice = parts[3]
        language = LANGUAGE_MAP.get(lang_key)
        if language is None:
            print(f"Unknown language key '{lang_key}', skipping: {audio_path}")
            continue

        slug = filename.replace(".mp3", ".json")
        out_dir = os.path.join("public", "timestamps", lang_key, voice)
        out_path = os.path.join(out_dir, slug)

        if os.path.exists(out_path):
            print(f"Skipping (exists): {out_path}")
            continue

        text_path = os.path.join(
            "public", "texts", lang_key, filename.replace(".mp3", ".txt")
        )
        if not os.path.exists(text_path):
            print(f"No text file found, skipping: {text_path}")
            continue

        with open(text_path, "r", encoding="utf-8") as f:
            text = f.read().strip()

        print(f"Transcribing: {audio_path} -> {out_path}")
        result = model.transcribe(
            audio_path, language=language, initial_prompt=text, word_timestamps=True
        )

        words = []
        segments: list[dict] = result["segments"]  # type: ignore[assignment]
        for segment in segments:
            for word in segment.get("words", []):
                words.append(
                    {
                        "word": word["word"],
                        "start": round(word["start"], 3),
                        "end": round(word["end"], 3),
                    }
                )

        os.makedirs(out_dir, exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(words, f, indent=2, ensure_ascii=False)

        print(f"  Saved {len(words)} words.")

print("All done!")
