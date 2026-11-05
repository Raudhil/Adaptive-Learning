"""Fit pyBKT on FIRST observations from TRAIN participants only.

Reference: https://github.com/CAHLR/pyBKT
Install pyBKT and pandas in a separate research environment, not the Next.js app.
"""
import argparse
import hashlib
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--test-fraction", type=float, default=0.2)
    args = parser.parse_args()
    if not 0 < args.test_fraction < 0.5:
        raise SystemExit("test-fraction harus >0 dan <0.5")
    try:
        import pandas as pd
        from pyBKT.models import Model
    except ImportError:
        raise SystemExit("Instal pyBKT dan pandas pada environment riset terpisah terlebih dahulu.")
    frame = pd.read_csv(args.csv_path, encoding="utf-8-sig")
    frame = frame[frame["is_first"].astype(str).str.lower().eq("true")].copy()
    frame = frame.dropna(subset=["kc_id", "observed_correct"])
    frame["correct"] = frame["observed_correct"].astype(str).str.lower().eq("true").astype(int)
    participants = sorted(frame["participant"].unique(), key=lambda p: hashlib.sha256(("seed42:"+p).encode()).hexdigest())
    if len(participants) < 10:
        raise SystemExit("Minimal 10 peserta untuk pembagian awal; kecukupan sampel tetap perlu validasi peneliti.")
    test_ids = set(participants[:max(1, round(len(participants)*args.test_fraction))])
    train = frame[~frame["participant"].isin(test_ids)].sort_values(["participant", "created_at"]).copy()
    train["order_id"] = range(len(train))
    defaults = {"user_id": "participant", "skill_name": "kc_id", "correct": "correct", "order_id": "order_id"}
    model = Model(seed=42, num_fits=5)
    model.fit(data=train, defaults=defaults)
    params = {}
    rejected = []
    for kc, values in model.coef_.items():
        candidate = {"initial": float(values["prior"]), "learn": float(values["learns"][0]),
                     "guess": float(values["guesses"][0]), "slip": float(values["slips"][0])}
        if all(0.001 <= v <= 0.999 for v in candidate.values()) and candidate["guess"]+candidate["slip"] < 1:
            params[kc] = candidate
        else:
            rejected.append({"kc": kc, "values": candidate, "reason": "Di luar batas validasi aplikasi; tinjau, jangan clamp otomatis."})
    result = {"bktByKc": params, "rejected": rejected, "train_participants": len(participants)-len(test_ids),
              "test_participant_ids": sorted(test_ids), "split_seed": 42,
              "note": "Tinjau parameter bersama ahli sebelum menyalin bktByKc ke versi model baru. Jangan melaporkan evaluasi in-sample sebagai held-out."}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print("Draft parameter dibuat. Train:", result["train_participants"], "Test:", len(test_ids), "KC ditolak:", len(rejected))


if __name__ == "__main__":
    main()
