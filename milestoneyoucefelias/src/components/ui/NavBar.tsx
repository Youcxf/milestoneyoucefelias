import {motion} from "framer-motion";

export default function NavBar() {
  const navBarVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <nav className="relative w-full flex flex-row items-center justify-center py-4">
      <motion.ul
        className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-5 px-8 py-2 rounded-full backdrop-blur-xs bg-white/40 shadow-xl font-medium text-white items-center border border-white/50"
        variants={navBarVariants} 
        initial="hidden"
        animate="visible"
      >
        <motion.li
          className="px-4 py-1 rounded-full cursor-pointer hover:bg-white/20 transition"
          variants={itemVariants}
          transition={{delay: 2}}
        >
          Home
        </motion.li>
        <motion.li
          className="px-4 py-1 rounded-full cursor-pointer hover:bg-white/20 transition"
          variants={itemVariants}
        transition={{delay: 2.5}}

        >
          <a href="#department">Department</a>
        </motion.li>
        <motion.li
          className="px-4 py-1 rounded-full cursor-pointer hover:bg-white/20 transition"
          variants={itemVariants}
        transition={{delay: 3}}

        >
          <a href="#teachers">Teachers</a>
        </motion.li>
      </motion.ul>
    </nav>
  );
}