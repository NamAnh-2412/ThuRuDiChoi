import { motion } from 'framer-motion'
import Button from '../common/Button'
import SeasonStamp from '../common/SeasonStamp'
import { useSeason } from '../../theme/SeasonProvider'
import { seasonOf } from '../../theme/seasons'

export default function Envelope({ receiver, opening, onOpen, onOpened }) {
  const season = seasonOf(useSeason())
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center py-4">
      {/* Tiêu đề dễ thương phía trên */}
      <motion.div
        className="mb-5 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--c-ink)] bg-white px-4 py-1 text-xs font-bold text-[var(--c-ink)] shadow-[2px_2px_0_var(--c-ink)]">
          <span>✨</span>
          <span>Bưu phẩm đặc biệt</span>
          <span>✨</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-[var(--c-ink)] sm:text-3xl">
          Có một phong thư gửi đến bạn! 💌
        </h1>
      </motion.div>

      {/* Vùng chứa phong thư & hiệu ứng lơ lửng */}
      <div className="relative w-full">
        {/* Các sticker / icon bay lơ lửng xung quanh */}
        <motion.span
          className="pointer-events-none absolute -left-6 -top-5 text-2xl select-none"
          animate={{ y: [0, -6, 0], rotate: [-8, 8, -8] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✨
        </motion.span>
        <motion.span
          className="pointer-events-none absolute -right-5 -top-4 text-2xl select-none"
          animate={{ y: [0, -8, 0], rotate: [5, -10, 5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        >
          💖
        </motion.span>
        <motion.span
          className="pointer-events-none absolute -bottom-3 -left-5 text-xl select-none"
          animate={{ y: [0, 5, 0], rotate: [10, -5, 10] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          🌸
        </motion.span>

        {/* Khối phong bì chính */}
        <motion.div
          className="relative aspect-[350/235] w-full"
          animate={opening ? { y: 20 } : { y: [0, -7, 0] }}
          transition={
            opening
              ? { duration: 0.3 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ perspective: 1100 }}
        >
          {/* 1. LỚP ĐÁY PHONG THƯ (Back Wall) */}
          <div className="absolute inset-0 rounded-3xl border-2 border-[var(--c-ink)] bg-[#F7EFE2] shadow-[5px_5px_0_var(--c-ink)]">
            {/* Lớp lót hoa văn bên trong (Envelope Liner) khi mở ra */}
            <div className="absolute inset-2 overflow-hidden rounded-2xl bg-[#FFE4EC]/40 opacity-70">
              <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <defs>
                  <pattern id="heart-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                      d="M10 13.5 C9 12.5, 6 10, 6 8 C6 6.8 6.9 6 8 6 C8.7 6 9.4 6.4 10 7 C10.6 6.4 11.3 6 12 6 C13.1 6 14 6.8 14 8 C14 10, 11 12.5, 10 13.5 Z"
                      fill="#FFB6C9"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#heart-pattern)" />
              </svg>
            </div>
          </div>

          {/* 2. RUỘT LÁ THƯ HÉ LỘ & TRƯỢT LÊN (Sliding Letter Sheet) */}
          <motion.div
            className="absolute inset-x-4 top-2 z-10 flex flex-col items-center rounded-2xl border-2 border-[var(--c-ink)] bg-[#FFFFFF] p-3 shadow-sm"
            initial={{ y: 0 }}
            animate={opening ? { y: -95, scale: 1.02 } : { y: 0 }}
            transition={{ duration: 0.85, ease: [0.34, 1.3, 0.64, 1] }}
          >
            <div className="flex w-full items-center justify-between border-b border-dashed border-[var(--c-ink)]/30 pb-1.5 text-[0.7rem] font-bold text-[#64748B]">
              <span>💌 SPECIAL INVITATION</span>
              <span>2026</span>
            </div>
            <div className="mt-2 text-center font-display text-sm font-bold text-[var(--c-ink)]">
              Gửi một người rất đặc biệt... ✨
            </div>
            <div className="mt-1 flex w-full flex-col gap-1 px-2">
              <div className="h-1.5 w-full rounded-full bg-[#E2E8F0]" />
              <div className="h-1.5 w-3/4 rounded-full bg-[#E2E8F0]" />
            </div>
          </motion.div>

          {/* 3. THÂN PHONG THƯ TRƯỚC (Front Pocket & Scrapbook Accents) */}
          <div className="absolute inset-0 z-20 overflow-hidden rounded-3xl border-2 border-[var(--c-ink)] bg-[var(--c-paper)]">
            {/* Dải ruy băng hồng pastel chạy ngang thân thư */}
            <div className="absolute top-1/2 left-0 z-0 h-9 w-full -translate-y-1/2 border-y-2 border-dashed border-[var(--c-ink)]/30 bg-[#FFDDE6]/70" />

            {/* CON TEM BƯU ĐIỆN RĂNG CƯA (Postage Stamp) Ở GÓC PHẢI */}
            <SeasonStamp season={season.key} className="absolute top-3 right-3 z-10" />

            {/* DẤU MỘC BƯU CHÍNH ĐÓNG ĐÈ LÊN TEM (Postmark) */}
            <div className="pointer-events-none absolute top-1 right-12 z-20 flex h-14 w-14 -rotate-12 items-center justify-center rounded-full border-2 border-dashed border-[var(--c-ink)]/40 text-center select-none">
              <div className="text-[0.5rem] font-black uppercase tracking-tighter text-[var(--c-ink)]/60">
                {season.postmark || (
                  <>
                    ★ LOVE ★
                    <br />
                    POST
                  </>
                )}
              </div>
            </div>

            {/* NHÃN DÁN NGƯỜI NHẬN DẠNG SCRAPBOOK VỚI WASHI TAPE */}
            <div className="absolute bottom-4 left-1/2 z-10 w-[84%] -translate-x-1/2">
              {/* Băng dính Washi Tape dán góc trái trên */}
              <div className="absolute -top-2 left-3 z-20 h-3.5 w-10 -rotate-6 border border-[var(--c-ink)]/40 bg-[var(--c-tape)]/90 shadow-xs" />
              {/* Băng dính Washi Tape dán góc phải trên */}
              <div className="absolute -top-2 right-3 z-20 h-3.5 w-10 rotate-6 border border-[var(--c-ink)]/40 bg-[var(--c-bg)]/90 shadow-xs" />

              {/* Tấm thẻ nhãn tên */}
              <div className="rounded-xl border-2 border-[var(--c-ink)] bg-white px-3 py-2 text-center shadow-[2px_2px_0_var(--c-ink)]">
                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-[#64748B]">
                  Gửi đến
                </p>
                <p className="font-display text-lg font-black text-[var(--c-ink)] sm:text-xl line-clamp-1">
                  {receiver || 'Người đặc biệt của tớ'}
                </p>
                <p className="text-[0.7rem] font-medium text-[var(--c-ink)]/75">
                  {season.tagline || 'Từ: Một người bí mật 🤫'}
                </p>
              </div>
            </div>
          </div>

          {/* 4. NẮP PHONG THƯ LẬT 3D (Top Triangular Flap) */}
          <motion.div
            className="absolute inset-x-0 top-0 z-30 origin-top"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateX: opening ? -180 : 0 }}
            transition={{ duration: 0.9, ease: [0.45, 0.05, 0.55, 0.95] }}
            onAnimationComplete={() => {
              if (opening) onOpened()
            }}
          >
            {/* Dùng SVG để giữ trọn vẹn viền 2 bên tam giác nắp thư */}
            <svg
              className="w-full drop-shadow-[0_2px_0_rgba(43,58,103,0.3)]"
              viewBox="0 0 350 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Mặt ngoài nắp thư màu xanh pastel dịu */}
              <path
                d="M 2 2 L 348 2 L 175 118 Z"
                fill={season.flap}
                stroke="var(--c-ink)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Đường chỉ may viền đứt nét trang trí */}
              <path
                d="M 16 7 L 334 7 L 175 110 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.8"
              />
            </svg>
          </motion.div>

          {/* 5. CON DẤU SÁP 3D (3D Wax Seal with Organic Melts & Heart) */}
          <motion.div
            className="absolute top-[47%] left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
            animate={
              opening
                ? { scale: 0, opacity: 0, rotate: 20 }
                : { scale: [1, 1.07, 1] }
            }
            transition={
              opening
                ? { duration: 0.3 }
                : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            }
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={!opening ? onOpen : undefined}
            title="Chạm vào đây để mở thư"
          >
            {/* Gợi ý tương tác: Badge nhỏ "Mở thư" */}
            {!opening && (
              <motion.div
                className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--c-ink)] bg-[var(--c-paper)] px-2 py-0.5 text-[0.65rem] font-black text-[var(--c-ink)] shadow-[1px_1px_0_var(--c-ink)]"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                Chạm để mở ✨
              </motion.div>
            )}

            {/* Hình khối con dấu sáp với viền sáp tràn tự nhiên (Wax puddle) */}
            <div className="relative flex h-14 w-14 items-center justify-center">
              {/* Lớp sáp tràn hữu cơ viền ngoài */}
              <svg
                viewBox="0 0 60 60"
                className="absolute inset-0 h-full w-full drop-shadow-[2px_3px_0_var(--c-ink)]"
              >
                <path
                  d="M30 4 
                     C39 3, 46 8, 50 15 
                     C55 21, 57 28, 56 36 
                     C54 44, 48 51, 40 54 
                     C32 57, 24 56, 17 52 
                     C10 47, 4 41, 4 32 
                     C3 24, 8 16, 14 10 
                     C20 4, 25 4, 30 4 Z"
                  fill={season.sealColor}
                  stroke="var(--c-ink)"
                  strokeWidth="2"
                />
                {/* Vòng tròn lõi dập chìm */}
                <circle
                  cx="30"
                  cy="30"
                  r="19"
                  fill={season.sealInner}
                  stroke="var(--c-ink)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="16"
                  fill="none"
                  stroke="#FF4D6D"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </svg>

              {/* Trái tim nổi bật ở tâm con dấu */}
              <span className="relative z-10 text-xl font-black text-[#FFF0F3] drop-shadow-[1px_1px_0_var(--c-ink)]">
                {season.sealEmoji}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Nút bấm hành động bên dưới */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <Button
          onClick={onOpen}
          disabled={opening}
          tone="pink"
          className="group px-7 py-3.5 text-base tracking-wide transition-transform hover:scale-105"
        >
          <span className="transition-transform group-hover:scale-125">💌</span>
          <span>{opening ? 'ĐANG MỞ THƯ...' : 'MỞ THƯ RA NÈ'}</span>
          <span className="transition-transform group-hover:rotate-12">✨</span>
        </Button>
        <p className="text-xs font-semibold text-[#64748B]">
          (Hoặc chạm trực tiếp vào con dấu sáp nha)
        </p>
      </div>
    </div>
  )
}
