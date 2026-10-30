import Button from '../common/Button'

export default function DateTicket({
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
      <p className="mb-4 text-center font-display text-2xl font-extrabold">Chốt kèo nha!</p>
      <div
        ref={ticketRef}
        className="relative overflow-hidden rounded-3xl border-2 border-[var(--c-ink)] bg-[var(--c-paper)] px-5 py-5 shadow-[4px_4px_0_var(--c-ink)]"
      >
        <span className="absolute -left-3 top-24 h-6 w-6 rounded-full border-2 border-[var(--c-ink)] bg-[var(--c-bg-to)]" />
        <span className="absolute -right-3 top-24 h-6 w-6 rounded-full border-2 border-[var(--c-ink)] bg-[var(--c-bg-to)]" />
        <p className="font-display text-lg font-extrabold">Vé hẹn hò đặc biệt</p>
        <p className="text-sm">Dành cho: {receiver || 'bạn'}</p>
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
        <Bars code={code} />
        <p className="text-center text-[0.7rem] font-bold tracking-[0.2em]">{code}</p>
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
        <Button tone="white" onClick={onSave}>
          Lưu vé về máy
        </Button>
      </div>
    </div>
  )
}

function Bars({ code }) {
  const widths = Array.from(code || 'DATE').flatMap((char) => {
    const value = char.charCodeAt(0)
    return [1 + (value % 3), 1 + (value % 2)]
  })
  return (
    <div className="mt-4 flex h-10 items-end justify-center gap-[2px]">
      {widths.map((width, index) => (
        <span key={index} className="bg-[var(--c-ink)]" style={{ width, height: 18 + (width % 3) * 8 }} />
      ))}
    </div>
  )
}
