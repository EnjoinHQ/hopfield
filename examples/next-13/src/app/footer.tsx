import Image from 'next/image';
import gh from '../../public/github-mark-white.svg';
import hopfield from '../../public/hopfield-w-text.png';

export function Footer() {
  return (
    <footer className="flex justify-between items-center w-full text-center pb-2 px-4">
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
        href="https://github.com/EnjoinHQ/hopfield/tree/main/examples/next-13"
        className="relative w-8 h-8"
      >
        <Image src={gh} alt="github logo" fill />
      </a>
    </footer>
  );
}
