'use client'

import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'

export default function GetFromURL() {
  const [data, setData] = useState([])
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const textAreaRef = useRef()

  const handleGetResult = async () => {
    setData([])
    setErrors([])
    const urlList = textAreaRef.current.value.split(/\r?\n|\r|\n/g)

    setLoading(true)
    const resultArray = await Promise.allSettled(
      urlList
        .filter((item) => item.length !== 0)
        .map((url) =>
          fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
            .then((response) => {
              if (response.ok) return response.json()
              throw new Error('Network response was not ok.')
            })
            .then((data) => ({ isValid: true, data: data.contents }))
            .catch((err) => ({ isValid: false, data: url }))
        )
    )
    setLoading(false)

    setErrors(resultArray.filter((result) => !result.value.isValid).map((result) => result.value.data))
    setData(
      resultArray
        .filter((result) => result.value.isValid)
        .map((result) => {
          const doc = new DOMParser().parseFromString(result.value.data, 'text/xml')
          const title = result.value.data.match(/<title[^>]*>([^<]+)<\/title>/)[1]
          const description = doc.querySelector('meta[name="description"]').getAttribute('content')
          return { title, description }
        })
    )

    console.log(resultArray)
  }

  return (
    <div>
      <div className='flex flex-col items-center gap-4 pt-4'>
        <p>Hi mini Sài Gòn : )</p>
        <textarea ref={textAreaRef} rows='7' className='text-black w-10/12 sm:w-3/4 ' />
        <button
          disabled={loading}
          onClick={handleGetResult}
          className='bg-white text-black py-2 px-4 rounded-md disabled:bg-slate-500'
        >
          <div className={cn(loading && 'invisible', 'relative')}>
            Lấy title và description
            <div className={cn('absolute top-0 left-1/2 -translate-x-1/2', loading ? 'visible' : 'invisible')}>
              đợi chút...
            </div>
          </div>
        </button>
      </div>
      {errors.length !== 0 && (
        <div className='border border-orange-600 mt-4'>
          Có lỗi, không lấy được data từ những url sau:
          {errors.map((err, idx) => (
            <div key={idx}>{err}</div>
          ))}
        </div>
      )}

      {data.length !== 0 && (
        <div className='border border-sky-600 mt-4'>
          Lấy được data:
          {data.map(({ title, description }, idx) => (
            <div key={idx}>{`${title},      ${description}`}</div>
          ))}
        </div>
      )}
    </div>
  )
}
