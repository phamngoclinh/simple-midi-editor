import React from 'react';

interface AsideProps {
  title: string;
  subTitle?: string;
  children: React.ReactElement;
  actions: React.ReactElement[];
}

const Aside = ({ title, subTitle, actions, children }: AsideProps) => {
  return (
    <aside className="w-[450px] h-full flex flex-col bg-background border-l border-border shadow-2xl z-30">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground mb-1">{title}</h2>
        {subTitle && <p className="text-muted-foreground text-sm">{subTitle}</p>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">{children}</div>

      <div className="p-4 border-t border-border bg-background flex gap-3">
        {actions?.map((action, index) => (
          <React.Fragment key={index}>{action}</React.Fragment>
        ))}
      </div>
    </aside>
  );
};

export default Aside;
