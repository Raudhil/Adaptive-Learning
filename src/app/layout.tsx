import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Live Code Adaptif",description:"Pembelajaran pemrograman web dengan latihan dan jalur belajar adaptif."};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="id"><body><a className="skip" href="#main">Lewati ke konten</a>{children}</body></html>;}
