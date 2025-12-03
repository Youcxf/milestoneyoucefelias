import { motion } from "framer-motion";
export default function Banner() {
  const letters = "Connect".split("");
  const letters2 = "Better.".split("");

  return (
    <div className="flex-1 relative h-full overflow-hidden flex flex-col justify-center items-center">
      
      

      
      

      {/* animation premier texte */}
      <h1 className="flex text-[15rem] h-[60%] font-bold text-white text-shadow-black relative">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: -70, opacity: 0, filter: "blur(20px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: i * 0.2,
              type: "spring",
              stiffness: 10,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </h1>

      <h1 className="flex text-[15rem] h-[20%] font-bold text-white text-shadow-black relative -mt-45">
        {letters2.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ y: -70, opacity: 0, filter: "blur(20px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: (i + letters.length) * 0.2,
              type: "spring",
              stiffness: 10,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </h1>

      

      <div
       className="h-full text-amber-50 w-full flex justify-start px-100 ">
        <motion.div 
        initial={{ y: -200, opacity: 0, filter: "blur(20px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay:  0.2,
              type: "spring",
              stiffness: 25,
            }}
        className="w-100 text-lg h-fit rounded-4xl backdrop-blur-md p-4"
        >
          <span className="font-bold">EduConnect</span> allows you to easily connect with teachers from various departments with
          ease instead of using slower methods such as <span className="font-bold italic">MIO</span>
        </motion.div>
      </div>
    </div>
  );
}