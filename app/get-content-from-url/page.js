'use client'

import { useEffect, useRef, useState } from 'react'

export default function GetFromURL() {
  const [data, setData] = useState([])
  const [errors, setErrors] = useState([])
  const textAreaRef = useRef()

  useEffect(() => {
    // fetch(
    //   `https://api.allorigins.win/get?url=${encodeURIComponent(
    //     'https://limosa.vn/sua-may-loc-nuoc-barrier-bi-ri-nuoc/'
    //   )}`
    // )
    //   .then((response) => {
    //     if (response.ok) return response.json()
    //     throw new Error('Network response was not ok.')
    //   })
    //   .then((data) => {
    //     console.log(data.contents)
    //     const doc = new DOMParser().parseFromString(data.contents, 'text/xml')
    //     const title = data.contents.match(/<title[^>]*>([^<]+)<\/title>/)[1]
    //     const description = doc.querySelector('meta[name="description"]').getAttribute('content')
    //     console.log({ title, description })
    //     setData((curData) => [...curData, { title, description }])
    //   })
  }, [])

  const handleGetTitleAndDescriptionFrom = (url) => {
    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
      .then((response) => {
        if (response.ok) return response.json()
        throw new Error('Network response was not ok.')
      })
      .then((data) => {
        console.log(data.contents)
        const doc = new DOMParser().parseFromString(data.contents, 'text/xml')
        const title = data.contents.match(/<title[^>]*>([^<]+)<\/title>/)[1]
        const description = doc.querySelector('meta[name="description"]').getAttribute('content')
        console.log({ title, description })
        setData((curData) => [...curData, { title, description }])
      })
      .catch((err) => {
        setErrors((curUrl) => [...curUrl, url])
      })
  }

  const handleGetResult = () => {
    setData([])
    setErrors([])
    const urlList = textAreaRef.current.value.split(/\r?\n|\r|\n/g)
    console.log(urlList)
    urlList
      .filter((item) => item.length !== 0)
      .forEach((url) => {
        handleGetTitleAndDescriptionFrom(url)
      })
  }

  return (
    <div>
      <div className='flex flex-col items-center gap-4 pt-4'>
        <p>Hi mini Sài Gòn : )</p>
        <textarea ref={textAreaRef} rows='7' className='text-black w-1/2' />
        <button onClick={handleGetResult} className='bg-white text-black py-2 px-4 rounded-md'>
          Lấy title và description
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
