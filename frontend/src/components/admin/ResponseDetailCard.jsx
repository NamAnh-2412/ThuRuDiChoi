export default function ResponseDetailCard({ invitation, response }) {
  if (!invitation) {
    return <p className="text-sm text-[#64748B]">Chọn một thư trong bảng để xem chi tiết.</p>
  }
  if (!response) {
    return (
      <div>
        <h3 className="font-display text-xl font-extrabold">Chi tiết của {invitation.receiver}</h3>
        <p className="mt-2 text-sm">Chưa mở thư.</p>
        <p className="mt-1 break-all text-sm font-bold">{`${window.location.origin}/invite/${invitation.code}`}</p>
      </div>
    )
  }
  return (
    <div>
      <h3 className="font-display text-xl font-extrabold">Chi tiết của {invitation.receiver}</h3>
      <ul className="mt-3 space-y-1 text-sm">
        {response.answers.map((answer) => (
          <li key={answer.stepCode}>
            <span className="font-extrabold">{answer.stepName}: </span>
            {answer.choiceLabel}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm">
        <span className="font-extrabold">Lời nhắn: </span>
        {response.note || 'Không có'}
      </p>
      <p className="mt-1 text-sm">
        <span className="font-extrabold">Số lần bấm Không: </span>
        {response.refuseCount}
      </p>
      <p className="mt-1 text-sm">{response.submitted ? 'Đã gửi kết quả' : 'Mới bấm Không, chưa chốt kèo'}</p>
      <p className="mt-1 text-sm">
        <span className="font-extrabold">Kiểu thư: </span>
        {response.mode === 'SPECIAL' ? 'Đặc biệt' : 'Thường'}
      </p>
    </div>
  )
}
