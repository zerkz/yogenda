import React from 'react';

const renderSVG = svg => (
  <div> {svg} </div>
);

const hoverStyle = { fill: '#0083BB' };
const style = { fill: '#F4F4F4' };

function bundleStyleBodyParts(bodyParts, id, applyStyle) {
  if (id.includes('arm')) {
    bodyParts['left_arm'].attr(applyStyle);
    bodyParts['right_arm'].attr(applyStyle);
  }
  if (id.includes('leg')) {
    bodyParts['left_leg'].attr(applyStyle);
    bodyParts['right_leg'].attr(applyStyle);
  }
}

function isBundle(id) {
  return (id.includes('arm') || id.includes('leg'));
}

// Send id/body part clicked to database?
function onClick(bodyParts, id) {
  let partClicked = id;
  if (id.includes('arm')) partClicked = 'arms';
  if (id.includes('leg')) partClicked = 'legs';

  return (() => console.log('Bodypart clicked: ' + partClicked));
}

function onHover(bodyParts, id) {
  return (() => {
    if (isBundle) {
      bundleStyleBodyParts(bodyParts, id, hoverStyle);
    }
    bodyParts[id].attr(hoverStyle);
  });
}

function offHover(bodyParts, id) {
  return (() => {
    if (isBundle) {
      bundleStyleBodyParts(bodyParts, id, style);
    }
    bodyParts[id].attr(style);
  });
}


export default SvgExample = (props) => {
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
    // Must define left + right leg/arm in order to change fill
    Object.keys(bodyParts).forEach((x) => {
      bodyParts[x].hover(onHover(bodyParts, x), offHover(bodyParts, x));
    });

    // Define an onClick handler for each fragment
    Object.keys(bodyParts).forEach((x) => {
      bodyParts[x].click(onClick(bodyParts, x));
    });

    s.append(loadedFragment);
  });

  return renderSVG(s);
};
