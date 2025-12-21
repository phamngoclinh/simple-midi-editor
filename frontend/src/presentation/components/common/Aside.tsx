import React from 'react';

interface AsideProps {
  title: string;
  subTitle?: string;
  children: React.ReactElement,
  actions: React.ReactElement[]
}

const Aside = ({ title, subTitle, actions, children }: AsideProps) => {
  return (
    <aside className='flex-none w-80 bg-[#111318] border-l border-[#282e39] flex flex-col z-10'>
      <div className='p-4 border-b border-[#282e39]'>
        <h3 className='text-white text-lg font-bold'>{title}</h3>
        <p className='text-[#9da6b9]'>{subTitle}</p>
      </div>

      <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-6'>
        {children}
      </div>

      <div className='p-4 border-t border-[#282e39] bg-[#111318] flex gap-3'>
        {actions?.map((action, index) => <React.Fragment key={index}>{action}</React.Fragment>)}
      </div>
    </aside>
  )
}

export default Aside;