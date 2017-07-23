import React from 'react';

const renderSVG = svg => (
  <div> {svg} </div>
);

const hoverStyle = { fill: '#0083BB' };
const style = { fill: '#F4F4F4' };

export default SvgExample = () => {
  let bodyParts = {};
  const s = Snap('24in', '24in');
  Snap.load('/mr_yoga.svg', (loadedFragment) => {
    bodyParts['left_arm'] = loadedFragment.select('#left_arm');
    bodyParts['right_arm'] = loadedFragment.select('#right_arm');
    bodyParts['torso'] = loadedFragment.select('#torso_');
    bodyParts['head'] = loadedFragment.select('#head_');
    bodyParts['left_leg'] = loadedFragment.select('#left_leg');
    bodyParts['right_leg'] = loadedFragment.select('#right_leg');

    // Define a "hover" function for each fragment
    // fragment.hover(onhover, nohover)
    // Must define left + right leg/arm in order to change fill atm
    Object.keys(bodyParts).forEach((x) => {
      bodyParts[x].hover(() => {
        bodyParts[x].attr(hoverStyle);
      }, () => {
        bodyParts[x].attr(style);
      });
    });

    // Define an onClick handler for each fragment
    // TODO: Group legs/arms together
    Object.keys(bodyParts).forEach((x) => {
      bodyParts[x].click(() => {
        console.log('id clicked: ' + x);
      });
    });

    // Append individual fragments to container
    Object.keys(bodyParts).forEach((x) => {
      s.append(bodyParts[x]);
    });
  });


  return renderSVG(s);
};
