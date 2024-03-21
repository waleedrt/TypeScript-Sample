import img01 from '../../assets/dimensions/0/1.png';
import img02 from '../../assets/dimensions/0/2.png';
import img03 from '../../assets/dimensions/0/3.png';
import img04 from '../../assets/dimensions/0/4.png';
import img11 from '../../assets/dimensions/1/1.png';
import img12 from '../../assets/dimensions/1/2.png';
import img13 from '../../assets/dimensions/1/3.png';
import img14 from '../../assets/dimensions/1/4.png';
import img21 from '../../assets/dimensions/2/1.png';
import img22 from '../../assets/dimensions/2/2.png';
import img23 from '../../assets/dimensions/2/3.png';
import img24 from '../../assets/dimensions/2/4.png';
import img31 from '../../assets/dimensions/3/1.png';
import img32 from '../../assets/dimensions/3/2.png';
import img33 from '../../assets/dimensions/3/3.png';
import img34 from '../../assets/dimensions/3/4.png';
import img41 from '../../assets/dimensions/4/1.png';
import img42 from '../../assets/dimensions/4/2.png';
import img43 from '../../assets/dimensions/4/3.png';
import img44 from '../../assets/dimensions/4/4.png';

export const HAPPINESS = 'happiness';
export const RESILIENCE = 'resilience';
export const AUTHENTICITY = 'authenticity';
export const THRIVING = 'thriving';

export const dimensionMap = {
  [HAPPINESS]: 1,
  [RESILIENCE]: 2,
  [AUTHENTICITY]: 3,
  [THRIVING]: 4
};

export const dimensionImageBuckets = [20, 40, 60, 80, 100];
export const dimensionImages = {
  20: {
    1: img01,
    2: img02,
    3: img03,
    4: img04
  },
  40: {
    1: img11,
    2: img12,
    3: img13,
    4: img14
  },
  60: {
    1: img21,
    2: img22,
    3: img23,
    4: img24
  },
  80: {
    1: img31,
    2: img32,
    3: img33,
    4: img34
  },
  100: {
    1: img41,
    2: img42,
    3: img43,
    4: img44
  }
};
