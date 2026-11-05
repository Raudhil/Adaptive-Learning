"""Evaluate held-out predictions from the pseudonymous interaction CSV (stdlib only).

Use an export made with frozen parameters fitted on OTHER participants. This script
does not fit parameters and cannot establish that the supplied export is held-out.
"""
import argparse
import csv
import json
import math
import random
from pathlib import Path


def auc(labels, predictions):
    positives = sum(labels)
    negatives = len(labels) - positives
    if not positives or not negatives:
        return None
    ordered = sorted(zip(predictions, labels))
    rank_sum = 0.0
    i = 0
    while i < len(ordered):
        j = i + 1
        while j < len(ordered) and ordered[j][0] == ordered[i][0]:
            j += 1
        average_rank = (i + 1 + j) / 2
        rank_sum += average_rank * sum(y for _, y in ordered[i:j])
        i = j
    return (rank_sum - positives * (positives + 1) / 2) / (positives * negatives)


def metrics(rows):
    y = [int(r["observed_correct"].lower() == "true") for r in rows]
    p = [float(r["predicted_correct"]) for r in rows]
    return {"observations": len(rows), "participants": len({r["participant"] for r in rows}),
            "rmse": math.sqrt(sum((a-b)**2 for a,b in zip(y,p)) / len(rows)),
            "auc": auc(y,p)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--bootstrap", type=int, default=500)
    args = parser.parse_args()
    with args.csv_path.open(encoding="utf-8-sig", newline="") as stream:
        rows = [r for r in csv.DictReader(stream) if r.get("is_first", "").lower() == "true"
                and r.get("predicted_correct") and r.get("observed_correct")]
    if not rows:
        raise SystemExit("Tidak ada observasi BKT pertama dalam ekspor.")
    groups = {}
    for row in rows:
        groups.setdefault(row["participant"], []).append(row)
    if len(groups) < 2:
        raise SystemExit("Evaluasi membutuhkan setidaknya dua peserta held-out.")
    # Bootstrap whole participants, never individual interaction rows.
    rng = random.Random(42)
    keys = sorted(groups)
    samples = [metrics([r for key in rng.choices(keys, k=len(keys)) for r in groups[key]])
               for _ in range(max(1, min(args.bootstrap, 5000)))]
    intervals = {}
    for metric in ("auc", "rmse"):
        values = sorted(s[metric] for s in samples if s[metric] is not None)
        intervals[metric] = [values[int((len(values)-1)*q)] for q in (.025, .975)] if values else None
    result = {**metrics(rows), "participant_bootstrap_95pct": intervals,
              "parameter_versions": sorted({r["param_version"] for r in rows}),
              "warning": "Deskriptif saja bila peserta pernah digunakan untuk fitting. Pisahkan peserta train/test sebelum kalibrasi."}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
