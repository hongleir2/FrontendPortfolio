import React from 'react';
import { motion } from 'framer-motion';
import { BallCanvas } from './canvas';
import { SectionWrapper } from '../hoc';
import { styles } from '../styles';
import { technologies } from '../constants';
import { textVariant } from '../utils/motion';

const Tech = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          I specialize in following
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Tech Stack</h2>
      </motion.div>
      <div className="flex flex-row flex-wrap justify-center gap-10 mt-4">
        {technologies.map((technology) => (
          <div className="w-28 h-28" key={technology.name}>
            <BallCanvas icon={technology.icon} />
            <p className="text-center text-white font-bold text-lg mt-2">
              {technology.name}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, 'tech');
