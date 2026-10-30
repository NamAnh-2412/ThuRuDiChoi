import { useEffect, useRef, useState } from 'react'
import { api, errorMessage, uploadImage } from '../../api/client'
import AdminNavbar from '../../components/admin/AdminNavbar'
import ChoiceItemRow from '../../components/admin/ChoiceItemRow'
import ImagePicker from '../../components/admin/ImagePicker'
import Button from '../../components/common/Button'

export default function ManageChoices() {
  const [steps, setSteps] = useState([])
  const [stepId, setStepId] = useState(null)
  const [choices, setChoices] = useState([])
  const [label, setLabel] = useState('')
  const [scope, setScope] = useState('BOTH')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [errorText, setErrorText] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    api.get('/admin/steps').then(({ data }) => {
      setSteps(data)
      setStepId(data[0]?.id ?? null)
    }).catch((error) => setErrorText(errorMessage(error, 'Không tải được các bước')))
  }, [])

  useEffect(() => {
    if (!stepId) return
    api.get(`/admin/steps/${stepId}/choices`)
      .then(({ data }) => setChoices(data))
      .catch((error) => setErrorText(errorMessage(error, 'Không tải được lựa chọn')))
  }, [stepId])

  useEffect(() => {
    if (!file) {
      setPreview('')
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function clearFile() {
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function addChoice(event) {
    event.preventDefault()
    setErrorText('')
    try {
      const imageUrl = file ? await uploadImage(file) : null
      const { data } = await api.post('/admin/choices', { stepId, label, imageUrl, scope })
      setChoices((current) => [...current, data])
      setLabel('')
      setScope('BOTH')
      clearFile()
    } catch (error) {
      setErrorText(errorMessage(error, 'Chưa thêm được'))
    }
  }

  async function saveChoice(id, body) {
    const { data } = await api.put(`/admin/choices/${id}`, body)
    setChoices((current) => current.map((choice) => (choice.id === id ? data : choice)))
  }

  async function toggleChoice(id) {
    const { data } = await api.patch(`/admin/choices/${id}/toggle`)
    setChoices((current) => current.map((choice) => (choice.id === id ? data : choice)))
  }

  async function deleteChoice(id) {
    try {
      await api.delete(`/admin/choices/${id}`)
      setChoices((current) => current.filter((choice) => choice.id !== id))
    } catch (error) {
      setErrorText(errorMessage(error, 'Chưa xóa được'))
    }
  }

  return (
    <div className="min-h-dvh bg-[#f3f7fb]">
      <AdminNavbar />
      <main className="admin-page py-6">
        <h1 className="font-display text-3xl font-extrabold">Quản lý lựa chọn theo bước</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setStepId(step.id)}
              className={`rounded-full border-2 border-[#2B3A67] px-4 py-2 text-sm font-extrabold ${
                step.id === stepId ? 'bg-[#8EC5FC] shadow-[3px_3px_0_#2B3A67]' : 'bg-white'
              }`}
            >
              {index + 1}. {step.name}
            </button>
          ))}
        </div>
        <form onSubmit={addChoice} className="mt-5 grid gap-2 rounded-3xl border-2 border-[#2B3A67] bg-white p-4 lg:grid-cols-[minmax(0,1fr)_11rem_minmax(0,1fr)_auto]">
          <input className="field" placeholder="Tên lựa chọn" value={label} onChange={(event) => setLabel(event.target.value)} required />
          <select className="field" value={scope} onChange={(event) => setScope(event.target.value)}>
            <option value="BOTH">Cả hai</option>
            <option value="STANDARD">Thư thường</option>
            <option value="SPECIAL">Thư đặc biệt</option>
          </select>
          <ImagePicker inputRef={fileRef} file={file} preview={preview} onFile={setFile} />
          <Button type="submit">Thêm</Button>
        </form>
        {errorText && <p className="mt-3 text-sm font-bold">{errorText}</p>}
        <div className="mt-4 flex flex-col gap-3">
          {choices.map((choice) => (
            <ChoiceItemRow
              key={choice.id}
              choice={choice}
              onSave={saveChoice}
              onToggle={toggleChoice}
              onDelete={deleteChoice}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
