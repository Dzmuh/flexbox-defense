import Board from 'tower-defense/objects/board';
import createUnitCodeLine from 'tower-defense/utils/create-unit-code-line';
import Ember from 'ember';
import Mob from 'tower-defense/objects/mob';
import PathCoords from 'tower-defense/objects/path-coords';
import TowerGroup from 'tower-defense/objects/tower-group';
import Tower from 'tower-defense/objects/tower';
import Wave from 'tower-defense/objects/wave';

function addBoardToWave(wave) {
  const board = Board.create();
  board.set('imageUrl', '/images/path-7.png');

  const pathObjects = [
    PathCoords.create({ x: 15, y: -3 }),
    PathCoords.create({ x: 15, y: 103 })
  ];

  pathObjects.forEach((pathObject) => {
    board.get('pathData').addObject(pathObject);
  });

  wave.set('board', board);
}

function addMobsToWave(wave) {
  const mobs = [];

  const mobQuantity = 10;
  for (var i = 0; i < mobQuantity; i++) {
    const newMob = Mob.create({
      id: generateIdForRecord(),
      frequency: 900,
      health: 300,
      maxHealth: 300,
      points: 10,
      quantity: mobQuantity,
      speed: 10, // seconds to cross one axis of the board
      type: 'standard'
    });

    mobs.push(newMob);
  }
  wave.set('mobs', Ember.A(mobs));
}

function addTowerGroupsToWave(wave) {
  let groupNum = 1;

  function getNewTowerGroup(numRows, posY) {
    return TowerGroup.create({
      id: generateIdForRecord(),
      groupNum,
      numRows,
      posY,
      selector: 'tower-group-' + groupNum++,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  // getNewTowerGroup = function(numRows, posY)
  const towerGroup1 = getNewTowerGroup(5, 15);
  const towerGroup2 = getNewTowerGroup(5, 65);

  // addTowersToTowerGroup = function(towerGroup, specsForTowers)
  addTowersToTowerGroup(towerGroup1, [
    { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }
  ]);
  addTowersToTowerGroup(towerGroup2, [
    { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }
  ]);
  determineFlexDirectionEligibility(towerGroup1);
  determineFlexDirectionEligibility(towerGroup2);

  wave.set('towerGroups', Ember.A([towerGroup1, towerGroup2]));
}

function addTowersToTowerGroup(towerGroup, specsForTowers) {
  function getNewTower(towerNum, type) {
    return Tower.create({
      id: generateIdForRecord(),
      attackPower: 20,
      attackRange: 20,
      selector: `tower-${towerGroup.get('groupNum')}-${towerNum}`,
      type,
      styles: Ember.A([createUnitCodeLine()])
    });
  }

  let newTowers = [];
  for (var i = 1; i < specsForTowers.length + 1; i++) {
    newTowers.addObject(getNewTower(i, specsForTowers.objectAt(i - 1).type));
  }

  towerGroup.set('towers', newTowers);
}

function determineFlexDirectionEligibility(towerGroup) {
  const numTowers = towerGroup.get('towers.length');
  const numRows = towerGroup.get('numRows');

  if (numRows >= numTowers) {
    towerGroup.set('flexDirectionAllowed', true);
  }
}

function generateIdForRecord() {
  function generate4DigitString() {
    const baseInt = Math.floor((1 + Math.random()) * 0x10000);
    return baseInt.toString(16).substring(1);
  }

  return generate4DigitString() + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() + '-' +
         generate4DigitString() + '-' + generate4DigitString() +
         generate4DigitString() + generate4DigitString();
}

export default function createWave7() {
  const wave = Wave.create({
    towerStylesHidden: true,
    instructions: {
      main: `This time you have more towers, but less horizontal room to work
             with.

The \`flex-direction\` property is your answer. \`flex-direction\` defines the
directional layout of the main and cross axes in the flex container.

For example, although the main axis lays out horizontally and the cross
axis lays out vertically by default, \`flex-direction\` can *rotate* the axes
such that the main axis lays out vertically and the cross axis lays out
horizontally. Here's what this looks like:

<img src="images/flexbox-column.png" class="instructions__diagram" alt="flexbox diagram">

Accordingly, \`flex-direction\` accepts the following values:

* \`row\`: lay out the main axis from left to right
* \`row-reverse\`: lay out the main axis from right to left
* \`column\`: lay out the main axis from top to bottom
* \`column-reverse\`: lay out the main axis from bottom to top`,
      tldr: `Use <nobr class="text__code">flex-direction ▾</nobr> to move your
             towers into position.`
    },
    minimumScore: 80
  });

  addBoardToWave(wave);
  addMobsToWave(wave);
  addTowerGroupsToWave(wave);

  return wave;
}
