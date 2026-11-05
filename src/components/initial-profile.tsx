"use client";
import { levelNames,methodNames,dataKindNames } from "@/lib/labels";
export function InitialProfile({profile}:{profile:any}){
 if(!profile)return null;
 return <section className="card initial-profile"><div><p className="eyebrow">PROFIL AWAL DARI ASESMEN</p><h2>{levelNames[profile.knn_label]}</h2><p>{methodNames[profile.method]??profile.method} · model {profile.model_version}</p></div><p className="muted">Profil global ini menentukan titik awal pembelajaran. Persen konsep yang belum dilatih masih merupakan perkiraan awal. Perkembangan berikutnya dilihat dari penguasaan tiap konsep, bukan kenaikan label global otomatis.{profile.method==="score-fallback"?" Data referensi belum cukup; sistem menggunakan aturan skor sementara.":` Referensi model: ${dataKindNames[profile.dataset?.kind??"unverified"]}.`}</p></section>;
}
