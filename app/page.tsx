import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='w-full p-6 flex items-center justify-center flex-col gap-6'>
      <h1 className='text-8xl font-bold text-center'>Your <span className='inline-block bg-gradient-to-tr from-neutral-100 via-blue-300 to-blue-500 bg-clip-text'><h1 className='text-transparent '>Personal</h1></span><br /> Ai Advisor</h1>
      <h3 className='text-neutral-400 text-lg'>From quick facts to deep explanations — your AI is always ready to help.</h3>
      <div className='flex items-center gap-6 pt-4'>
        <Link href={'/login'} ><button className='px-8 py-3 text-xl font-bold  cursor-pointer border rounded-2xl border-blue-600 text-blue-600 bg-blue-100'>Login</button></Link>
        <Link href={'/chat'} ><button className='px-8 py-3 text-xl bg-blue-600 cursor-pointer font-semibold rounded-2xl shadow-2xl shadow-blue-300/50 border border-blue-100'>Start Chat</button></Link>
      </div>
      <div className='mt-8  w-full flex items-center justify-center'>
       <div className='w-[50%]  rounded-2xl border-blue-200/40 border-4 overflow-hidden'>
         <Image src={'/front.png'} height={500} width={500} alt='app image' className='w-full h-full '/>
       </div>
      </div>
    </div>
  )
}

export default page