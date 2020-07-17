import Empirica from "meteor/empirica:core";
import { taskData } from "./constants";
import "./callbacks.js";
import "./bots.js";

// gameInit is where the structure of a game is defined.
// Just before every game starts, once all the players needed are ready, this
// function is called with the treatment and the list of players.
// You must then add rounds and stages to the game, depending on the treatment
// and the players. You can also get/set initial values on your game, players,
// rounds and stages (with get/set methods), that will be able to use later in
// the game.
Empirica.gameInit((game, treatment, players) => {
  //for the players names (we will call them A, B, C etc)
  const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
  // similar to the color of the avatar .. to do more go to https://jdenticon.com/#icon-D3
  const arrowColors = ["#A5CC66", "#B975D1", "#DC8A92"];

  //shuffle the stimuli
  const taskSequence = _.shuffle(taskData);

  //generate the difficulty levels (i.e., how many good and how many bad performers
  let performance = Array(players.length).fill("bad");
  performance = performance.fill(
    "good",
    0,
    Math.ceil(game.treatment.nGoodPerformers * players.length)
  );
  performance = _.shuffle(performance);
  console.log("treatment: ", game.treatment, " will start with ", performance);

  players.forEach((player, i) => {
    player.set("avatar", `/avatars/jdenticon/${alphabet[i] + i}`);
    player.set("arrowColor", arrowColors[i]);
    player.set("cumulativeScore", 0);
    player.set("bonus", 0);
    player.set("name", alphabet[i]);
    player.set("performance", performance[i]);
  });

  //initial shuffle of the players .. this will effect the order of speaking
  players = _.shuffle(players);

  _.times(game.treatment.nRounds, i => {
    const round = game.addRound();
    round.set("task", taskSequence[i]);

    //first the initial response
    round.addStage({
      name: "response",
      displayName: "Response",
      durationInSeconds: game.treatment.stageDuration+5 //adding 10 seconds for the initial guess
    });

    let shuffledPlayers = null;
    //three blocks per round, each block with k Speaking Stages
    _.times(game.treatment.nBlocks, j => {
      //if there is special order (i.e., fix first speaker or last speaker for each round) otherwise, it will remain random
      if (j === 0) {
        shuffledPlayers = customShuffle(players, game.treatment);
      } else {
        shuffledPlayers = _.shuffle(players);
      }

      shuffledPlayers.forEach(player => {
        round.addStage({
          name: player.get("name") + j,
          displayName:
            players.length > 1
              ? "observe " + player.get("name")
              : "Attempt: " + Math.round(j + 1),
          durationInSeconds: game.treatment.stageDuration,
          observe: player.get("_id")
        });
      });
    });
    //at the end of each round (i.e., discussion) you show the correct answer
    round.addStage({
      name: "outcome",
      displayName: "outcome",
      durationInSeconds: game.treatment.stageDuration+10 //adding 10 seconds in the round outcome
    });
  });
});

// fix the first or last speaker (or keep them random).
//to learn more:
//https://stackoverflow.com/questions/50536044/swapping-all-elements-of-an-array-except-for-first-and-last
function customShuffle(players, treatment) {
  // Find and remove first and last:
  const firstSpeaker = treatment.firstSpeakerFixed ? players[0] : null;
  const lastSpeaker = treatment.lastSpeakerFixed
    ? players[players.length - 1]
    : null;

  const firstIndex = players.indexOf(firstSpeaker);

  if (firstIndex !== -1) {
    players.splice(firstIndex, 1);
  }

  const lastIndex = players.indexOf(lastSpeaker);

  if (lastIndex !== -1) {
    players.splice(lastIndex, 1);
  }

  // Normal shuffle with the remaining elements using ES6:

  for (let i = players.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1));

    [players[i], players[j]] = [players[j], players[i]];
  }

  // Add them back in their new position:
  if (firstIndex !== -1) {
    players.unshift(firstSpeaker);
  }

  if (lastIndex !== -1) {
    players.push(lastSpeaker);
  }

  return players;
}
