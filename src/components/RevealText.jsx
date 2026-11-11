import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, MQ } from '../lib/motion';

/**
 * Apple's "highlight as you read" paragraph: each word brightens from dim to
 * full as it scrolls through the viewport (scrubbed). Accepts an array of
 * segments — strings, or { text, em: true } for emphasised (accent) runs.
 * Under reduced motion it renders fully lit.
 */
export default function RevealText({ segments, as: Tag = 'p', className = '' }) {
  const ref = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const words = ref.current.querySelectorAll('[data-w]');
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 82%',
            end: 'bottom 45%',
            scrub: 0.6,
          },
        }
      );
    });
    return () => mm.revert();
  }, { scope: ref });

  const words = [];
  segments.forEach((seg, si) => {
    const text = typeof seg === 'string' ? seg : seg.text;
    const em = typeof seg === 'object' && seg.em;
    text.split(/(\s+)/).forEach((w, wi) => {
      if (!w) return;
      if (/^\s+$/.test(w)) { words.push(w); return; }
      words.push(
        <span key={`${si}-${wi}`} data-w className={em ? 'text-accent' : undefined}>
          {w}
        </span>
      );
    });
  });

  return <Tag ref={ref} className={className}>{words}</Tag>;
}
