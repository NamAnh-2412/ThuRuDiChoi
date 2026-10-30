import { useEffect, useState } from 'react'
import { errorMessage, uploadImage } from '../../api/client'
import Button from '../common/Button'
import ImagePicker from './ImagePicker'

export default function ChoiceItemRow({ choice, onSave, onToggle, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(choice.label)
  const [scope, setScope] = useState(choice.scope || 'BOTH')
  const [imageUrl, setImageUrl] = useState(choice.imageUrl || '')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(choice.imageUrl || '')
  const [confirming, setConfirming] = useState(false)
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    if (!file) {
      setPreview(imageUrl)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file, imageUrl])

  async function save() {
    setErrorText('')
    try {
      const nextUrl = file ? await uploadImage(file) : imageUrl
      await onSave(choice.id, { label, imageUrl: nextUrl, scope })
      setImageUrl(nextUrl || '')
      setFile(null)
      setEditing(false)
    } catch (error) {
      setErrorText(errorMessage(error, 'Chưa lưu được'))
    }
  }

  return (
    <div className={`grid gap-3 rounded-2xl border-2 border-[#2B3A67] bg-white p-3 md:grid-cols-[72px_1fr_auto] ${choice.active ? '' : 'opacity-60'}`}>
      <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-[#FFF9F0] text-2xl">
        {choice.imageUrl ? <img src={choice.imageUrl} alt="" className="h-full w-full object-cover" /> : '✦'}
      </div>
      <div>
        {editing ? (
          <div className="flex flex-col gap-2">
            <input className="field" value={label} onChange={(event) => setLabel(event.target.value)} />
            <select className="field" value={scope} onChange={(event) => setScope(event.target.value)}>
              <option value="BOTH">Cả hai</option>
              <option value="STANDARD">Thư thường</option>
              <option value="SPECIAL">Thư đặc biệt</option>
            </select>
            <ImagePicker file={file} preview={preview} onFile={setFile} emptyLabel="Giữ ảnh hiện tại, hoặc chọn ảnh mới" />
            {errorText && <p className="text-sm font-bold">{errorText}</p>}
          </div>
        ) : (
          <>
            <p className="font-extrabold">{choice.label}</p>
            <p className="text-sm text-[#64748B]">
              {choice.active ? 'Đang bật' : 'Tạm tắt'} · {scopeLabel(choice.scope)}
            </p>
          </>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {editing ? (
          <>
            <Button onClick={save}>Lưu</Button>
            <Button tone="white" onClick={() => setEditing(false)}>
              Hủy
            </Button>
          </>
        ) : confirming ? (
          <>
            <Button tone="peach" onClick={() => onDelete(choice.id)}>
              Xóa hẳn
            </Button>
            <Button tone="white" onClick={() => setConfirming(false)}>
              Không
            </Button>
          </>
        ) : (
          <>
            <Button tone={choice.active ? 'mint' : 'white'} onClick={() => onToggle(choice.id)}>
              {choice.active ? 'Đang bật' : 'Đang tắt'}
            </Button>
            <Button tone="white" onClick={() => setEditing(true)}>
              Sửa
            </Button>
            <Button tone="white" onClick={() => setConfirming(true)}>
              Xóa
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function scopeLabel(scope) {
  if (scope === 'STANDARD') return 'Thư thường'
  if (scope === 'SPECIAL') return 'Thư đặc biệt'
  return 'Cả hai'
}
