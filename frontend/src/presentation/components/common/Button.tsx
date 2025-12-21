export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  return <button className={`h-11 flex items-center justify-center rounded-lg transition-colors font-bold px-4 text-white text-sm ${className}`} {...rest} />
}

export const DefaultButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  return <Button className={`bg-[#282e39] text-white hover:bg-[#394457] ${className}`} {...rest} />
}

export const PrimaryButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  return <Button className={`bg-primary text-white hover:bg-blue-600 ${className}`} {...rest} />
}

export const SecondaryButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  return <Button className={`border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 ${className}`} {...rest} />
}
