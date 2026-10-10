export default function Footer() {
  return (
    <footer className="border-t bg-white py-8 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} The Colour World. All rights reserved.</p>
      </div>
    </footer>
  );
}