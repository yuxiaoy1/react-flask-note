import { useEffect, useRef, useState } from 'react'
import { useApi } from '../contexts/ApiProvider'

export default function MainPage() {
  let [notes, setNotes] = useState()
  let noteRef = useRef()
  let api = useApi()

  useEffect(() => {
    noteRef.current.focus()
  }, [])

  useEffect(() => {
    ;(async () => {
      let response = await api.get('/notes')
      setNotes(response.ok ? response.body : null)
    })()
  }, [])

  async function onSubmit(event) {
    event.preventDefault()

    let note = noteRef.current.value
    if (!note) return

    let response = await api.post('/notes', { body: note })
    if (response.ok) {
      setNotes([...notes, response.body])
      noteRef.current.value = ''
    } else {
      alert('failed to add note.')
    }
  }

  async function deleteNote(id) {
    let response = await api.delete('/notes/' + id)
    if (response.ok) {
      setNotes(notes.filter(note => note.id !== id))
    } else {
      alert('failed to delete note.')
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type='text' ref={noteRef} placeholder='Anything need to note?' />{' '}
        <button type='submit'>Add note</button>
      </form>
      {notes === undefined ? (
        <div className='spinner'></div>
      ) : (
        <>
          {notes === null ? (
            <p>There's no notes.</p>
          ) : (
            <ul>
              {notes.map(note => (
                <li key={note.id}>
                  {note.body}{' '}
                  <a
                    onClick={() => deleteNote(note.id)}
                    style={{ cursor: 'pointer', color: 'darkred' }}
                  >
                    delete
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
