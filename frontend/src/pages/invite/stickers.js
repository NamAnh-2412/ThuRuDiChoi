export const STICKERS = [
  { kind: 'cat', title: 'Đi mà đi mà', line: 'Một lần thui, mình hứa vui lắm.' },
  { kind: 'bear', title: 'Sao nỡ lòng nào', line: 'Từ chối tui chứ... ở nhà buồn lắm.' },
  { kind: 'dog', title: 'Hứa sẽ ngoan', line: 'Bao ăn ngon luôn á!' },
  { kind: 'meme', title: 'Không cho bấm nữa đâu nha', line: 'Nút này chạy trốn rồi đó.' },
]

export function stickerForCount(count) {
  return STICKERS[Math.min(Math.max(count, 1), STICKERS.length) - 1]
}
