import React from 'react';

const renderSVG = svg => (
  <div> {svg} </div>
);

const hoverStyle = { fill: '#02AAF3', 'fill-opacity': 0.9, stroke: '#000' };
const style = { fill: '#FFF', 'fill-opacity': 0.05, stroke: '#000' };

function bundleStyleBodyParts(bodyParts, id, applyStyle) {
  if (id.includes('bicep')) {
    bodyParts['left_bicep'].attr(applyStyle);
    bodyParts['right_bicep'].attr(applyStyle);
  }
  if (id.includes('shoulder')) {
    bodyParts['left_shoulder'].attr(applyStyle);
    bodyParts['right_shoulder'].attr(applyStyle);
  }
  if (id.includes('calf')) {
    bodyParts['left_calf'].attr(applyStyle);
    bodyParts['right_calf'].attr(applyStyle);
  }
  if (id.includes('tricep')) {
    bodyParts['left_tricep'].attr(applyStyle);
    bodyParts['right_tricep'].attr(applyStyle);
  }
}

function isBundle(id) {
  return (id.includes('arm') || id.includes('leg'));
}

// Send id/body part clicked to database?
function onClick(bodyParts, id) {
  let partClicked = id;
  if (id.includes('bicep')) partClicked = 'biceps';
  if (id.includes('shoulder')) partClicked = 'shoulders';
  if (id.includes('calf')) partClicked = 'calves';
  if (id.includes('tricep')) partClicked = 'triceps';

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
  const s = Snap('6in', '6in');
  Snap.load('/muscles_female_TEST.svg', (loadedFragment) => {
    bodyParts['left_bicep'] = loadedFragment.select('#left_bicep');
    bodyParts['right_bicep'] = loadedFragment.select('#right_bicep');
    bodyParts['left_shoulder'] = loadedFragment.select('#left_shoulder');
    bodyParts['right_shoulder'] = loadedFragment.select('#right_shoulder');
    bodyParts['abs'] = loadedFragment.select('#abs');
    bodyParts['legs'] = loadedFragment.select('#legs');
    bodyParts['neck'] = loadedFragment.select('#neck');

    // Back view
    bodyParts['upper_back'] = loadedFragment.select('#upper_back');
    bodyParts['lower_back'] = loadedFragment.select('#lower_back');
    bodyParts['left_tricep'] = loadedFragment.select('#left_tricep');
    bodyParts['right_tricep'] = loadedFragment.select('#right_tricep');
    bodyParts['glutes'] = loadedFragment.select('#glutes');
    bodyParts['left_calf'] = loadedFragment.select('#left_calf');
    bodyParts['right_calf'] = loadedFragment.select('#right_calf');

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
