import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <h2>404: Trang không tồn tại</h2>
      <Link href="/" className="text-primary hover:underline">
        Return Home
      </Link>
    </div>
  );
}
