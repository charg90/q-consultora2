import React from 'react'

const NavBar = () => {
  return (
    <div
      className='h-20 flex items-center p-12 bg-opacity-30 fixed w-full  '
      style={{
        position: 'fixed',
        boxShadow: '0px 0px 15px #00000029',
        backdropFilter: 'blur(50px)',
        backgroundColor: 'rgba(17,0,158,0.8)',
        color: '#fff',
        zIndex: 49,
        display: 'flex',
        paddingBlock: 2
      }}
    >
      <div>
        <div>Logo</div>
      </div>
      <div className='w-full flex justify-end gap-6'>
        <p>Link1</p>
        <p>Link2</p>
        <p>Link3</p>
      </div>
    </div>
  )
}

export default NavBar
