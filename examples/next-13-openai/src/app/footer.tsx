import Image from 'next/image';
import gh from '../../public/github-mark-white.svg';
import hopfield from '../../public/hopfield-w-text.png';

export function Footer() {
  return (
    <footer className="flex absolute justify-between items-center bottom-0 right-0 left-0 w-full text-center pb-4 px-6">
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-36 h-14"
        href="https://hopfield.ai"
      >
        <Image src={hopfield} alt="logo" fill />
      </a>

      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/propology/hopfield"
        className="relative w-8 h-8"
      >
        <Image src={gh} alt="github logo" fill />
      </a>
    </footer>
  );
}
