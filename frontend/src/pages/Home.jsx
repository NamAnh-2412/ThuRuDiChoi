import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center bg-gradient-to-b from-[#c5e0ff] via-[#fff6ea] to-[#ffd0de] px-4">
      <div className="letter-frame rounded-3xl border-2 border-[#2B3A67] bg-[#FFF9F0] p-6 text-center shadow-[4px_4px_0_#2B3A67]">
        <h1 className="font-display text-3xl font-extrabold">Thư rủ đi chơi</h1>
        <p className="mt-2 text-sm">Mở đường link trên phong thư để trả lời nha.</p>
        <Link to="/admin/login" className="mt-5 inline-block font-extrabold underline">
          Trang quản trị
        </Link>
      </div>
    </main>
  )
}
