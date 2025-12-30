export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  return (
    <button
      className={`cursor-pointer h-11 flex items-center justify-center rounded-lg transition-colors font-bold px-4 text-foreground text-sm ${className}`}
      {...rest}
    />
  );
};

export const DefaultButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  return (
    <Button
      className={`bg-surface border border-border hover:bg-surface-hover ${className}`}
      {...rest}
    />
  );
};

export const PrimaryButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  return <Button className={`bg-primary text-white hover:bg-blue-600 ${className}`} {...rest} />;
};

export const SecondaryButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  return (
    <Button
      className={`border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 ${className}`}
      {...rest}
    />
  );
};
