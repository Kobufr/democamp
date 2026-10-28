import type {Metadata} from 'next';
export const metadata:Metadata={title:'こもれびキャンプ',description:'小さな3Dキャンプ旅。'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>}
