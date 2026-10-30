export default function ImagePicker({ inputRef, file, preview, onFile, emptyLabel = 'Ảnh trong máy, không bắt buộc' }) {
  return (
    <label className="field flex cursor-pointer items-center gap-3">
      {preview ? (
        <img src={preview} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
      ) : null}
      <span className="shrink-0 rounded-full border-2 border-[#2B3A67] bg-[#FFB6C9] px-3 py-1 text-sm font-extrabold">
        Chọn ảnh
      </span>
      <span className="truncate text-sm text-[#64748B]">{file ? file.name : emptyLabel}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(event) => onFile(event.target.files?.[0] || null)}
      />
    </label>
  )
}
