import Button from '../common/Button'
import SeasonStamp from '../common/SeasonStamp'

const CORNERS = ['spring', 'summer', 'autumn', 'winter']

export default function FourSeasonTicket({
  receiver,
  code,
  rows,
  note,
  onNote,
  onSubmit,
  onSave,
  sending,
  sent,
  readOnly,
  ticketRef,
}) {
  return (
    <div>
      <p className="mb-4 text-center font-display text-2xl font-extrabold">Kèo đi chơi xuyên suốt 4 mùa</p>
      <div
        ref={ticketRef}
        className="relative overflow-hidden rounded-3xl border-2 border-[var(--c-ink)] bg-[var(--c-paper)] px-5 py-5 shadow-[4px_4px_0_var(--c-ink)]"
      >
        <div className="season-stamps mb-3">
          {CORNERS.map((season) => (
            <SeasonStamp key={season} season={season} className="rotate-0" />
          ))}
        </div>
        <p className="text-center font-display text-lg font-extrabold text-[#C85A32]">
          Kèo đi chơi xuyên suốt 4 Mùa Xuân Hạ Thu Đông
        </p>
        <p className="mt-1 text-center text-sm">Dành cho: {receiver || 'bạn'}</p>
        <div className="my-3 border-t-2 border-dashed border-[var(--c-ink)]/40" />
        <ul className="space-y-2 text-sm">
          {rows.map((row) => (
            <li key={row.stepName} className="flex justify-between gap-3">
              <span className="font-extrabold">{row.stepName}</span>
              <span className="text-right">{row.label}</span>
            </li>
          ))}
        </ul>
        <div className="my-3 border-t-2 border-dashed border-[var(--c-ink)]/40" />
        <p className="text-sm font-extrabold">Lời nhắn của bạn</p>
        {readOnly || sent ? (
          <p className="mt-1 min-h-10 text-sm">{note || 'Không để lại lời nhắn'}</p>
        ) : (
          <textarea
            className="field mt-2 min-h-20 resize-none"
            maxLength={500}
            placeholder="Nhắn một câu ngọt ngào..."
            value={note}
            onChange={(event) => onNote(event.target.value)}
          />
        )}
        <p className="mt-4 text-center text-[0.7rem] font-bold tracking-[0.2em]">{code}</p>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {!readOnly && !sent && (
          <Button onClick={onSubmit} disabled={sending}>
            {sending ? 'Đang gửi...' : 'Gửi kết quả cho admin'}
          </Button>
        )}
        {(sent || readOnly) && (
          <p className="text-center text-sm font-bold">Đã gửi thành công! Hãy chuẩn bị lên đồ nhé!</p>
        )}
        {onSave && (
          <Button tone="white" onClick={onSave}>
            Lưu vé về máy
          </Button>
        )}
      </div>
    </div>
  )
}
