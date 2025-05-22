import Image from 'next/image';
import IdeaMashSlot from '../components/IdeaMashSlot';
import CapitalChanceCalculator from '../components/CapitalChanceCalculator';

export default function About() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-2 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">ABOUT US</h1>
      {/* Kapitaljämförelse + kalkylator högst upp */}
      <CapitalChanceCalculator />
      {/* Bakgrundsbild */}
      <Image
        src="/omoss.png"
        alt="Om oss bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="flex flex-col gap-20 w-full max-w-4xl items-center">
        {/* Moln 1 - Moved up */}
        <div className="bg-white/90 rounded-[3rem] shadow-2xl border border-gray-200 px-8 py-8 max-w-2xl w-full text-center backdrop-blur-md mt-12">
          <p className="text-lg text-gray-800 font-medium">
            <span className="text-2xl font-extrabold text-[#01121f] block mb-2">Why does FrejFund exist?</span>
            So that ideas that make your heart race don't get stuck in bureaucratic mud. We're passionate about that restless urge that wakes entrepreneurs in the middle of the night – whether it's their first time daring to call themselves founders or they've already built and crashed a few companies. In every such mind pulses the same primal force: the will to build something the world is still missing. We want to protect and amplify that force, not see it fade away in Excel-anxiety or investor jargon.
          </p>
        </div>
        {/* Moln 2 */}
        <div className="bg-white/80 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 max-w-2xl w-full text-center backdrop-blur-sm mt-[-2rem] ml-auto">
          <p className="text-lg text-gray-800 font-medium">
            <span className="text-xl font-bold text-[#16475b] block mb-2">So how do we do it?</span>
            We meet you where the spark is and let technology do the heavy lifting. Our AI-powered analysis platform scans your business idea like an X-ray, reveals gaps, and shows exactly where the armor needs strengthening before you step on stage. We translate the vision into investor logic, but keep the language of the heart intact. Around the platform, we've built a tribe: mentors, serial founders, and newly hatched innovators who share insights, mistakes, and victories around the same digital campfire. You never walk out of the woods alone – there's always someone beside you holding the map.
          </p>
        </div>
        {/* Moln 3 */}
        <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 max-w-2xl w-full text-center backdrop-blur-sm mt-[-2rem] mr-auto">
          <p className="text-lg text-gray-800 font-medium">
            <span className="text-xl font-bold text-[#16475b] block mb-2">And what do you actually get?</span>
            An interactive review that results in a personal report, an action plan, and a scoring system that investors understand immediately. You get toolboxes filled with templates, contracts, and KPI dashboards that save weeks of guesswork. You get warm introductions to angels, ALMI, and venture capital when your plan is ready, and you get us by your side all the way – from the first brainstorm to the last funding round. In short: we make sure your idea gets the armor, the company, and the speed it deserves, so you can keep doing what entrepreneurs do best – create the future.
          </p>
        </div>
        {/* Team Stories Section */}
        <div className="flex flex-col gap-8 w-full max-w-3xl">
          {/* Jakob's Story */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 backdrop-blur-sm">
            <h2 className="text-2xl font-extrabold text-[#16475b] mb-4">ABOUT JAKOB – from river card to lines of code</h2>
            <p className="text-gray-800 leading-relaxed">
              It started at the poker tables in Macau and Vegas: Jakob read odds faster than his opponents could blink. But after thousands of hands and literally a million calculated combinations, he fell in love with the algorithm behind the game – not the chip stacks.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              Today, he sits in his 'shed' in Mallorca (a garage-meets-server room with AC and flamingo wallpaper), hacking Python late into the night and building AI engines that raise company values faster than an all-in with pocket aces. When he's not coding, he runs a co-working space in Stockholm and juggles family life with a wife and two kids who would rather swim than debug.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              Jakob is our risk calculator and software smith – he replies to pull requests faster than WhatsApp messages, but solves both before the coffee gets cold.
            </p>
          </div>

          {/* Christopher's Story */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 backdrop-blur-sm">
            <h2 className="text-2xl font-extrabold text-[#16475b] mb-4">ABOUT CHRISTOPHER – creams, KPIs & code</h2>
            <p className="text-gray-800 leading-relaxed">
              Christopher started his career in a laboratory full of fragrances and pH sticks. In thirteen years, he managed to found three skincare brands, sell to both salons and lifestyle shoppers – and learn the hard way how cash flow can sting more than a chemical peel.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              Now, he has swapped pipettes for prompt engineering. He loves how AI can massage smarter decisions and smooth out start-up pain for more founders. His passion? Making complicated financial jargon as clear and refreshing as a good serum formula.
            </p>
            <p className="text-gray-800 leading-relaxed mt-4">
              He now lives, like Jakob, in sunny Mallorca with his wife, two kids, and an unhealthy amount of prototype slides in Google Drive. With us, Christopher is the storyteller, marketing strategist, and the one who always asks: 'How does it feel for the user?' – whether it's about skincare or an AI dashboard.
            </p>
          </div>

          {/* Team Conclusion */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 px-8 py-8 backdrop-blur-sm text-center">
            <p className="text-gray-800 leading-relaxed">
              Together, they run FrejFund like a well-oiled poker machine with a silky-smooth finish – where odds, algorithms, and care meet to make entrepreneurship a little easier, a lot more fun, and significantly more investable.
            </p>
          </div>
        </div>

        {/* Slot machine at the bottom */}
        <div className="mt-16 w-full flex justify-center">
          <IdeaMashSlot />
        </div>
      </div>
    </div>
  );
} 