import Empirica from "meteor/empirica:core";

// onGameStart is triggered once per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart((game, players) => {
  players.forEach(player => {
    player.set("justStarted", true); // I use this to play the sound on the UI when the game starts
  });
});

// onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.
Empirica.onRoundStart((game, round, players) => {
  console.log("Round ", round.index + 1, "game", game._id, " started");
  //initiate the score for this round
  players.forEach(player => {
    //console.log("initiating scores with 0 to start accumulating");
    player.round.set("score", 0);
  });

  //so I know this is the first stage of the round
  round.set("stageOrder", 1);
});

// onRoundStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.
Empirica.onStageStart((game, round, stage, players) => {
  //so if they don't change their guess in this particular stage, I keep storing it (rather than NaN).
  players.forEach(player => {
    player.stage.set("guess", player.round.get("guess"));
  });
});

// onStageEnd is triggered after each stage.
// It receives the same options as onRoundEnd, and the stage that just ended.
Empirica.onStageEnd((game, round, stage, players) => {
  //this is not ideal, as we should compute it only once before the round outcome
  if (stage.name !== "outcome") {
    computeScore(players, round, game);
    colorScores(players);

    //static social guess
    players.forEach(player => {
      player.round.set("socialGuess", player.round.get("guess"));
      //if this is the first stage, then this is their initial guess
      if (round.get("stageOrder") === 1) {
        player.round.set("initialGuess", player.round.get("guess"));
      }
    });
  }

  //increment the stage order by one
  round.set("stageOrder", round.get("stageOrder") + 1);
});

// onRoundEnd is triggered after each round.
// It receives the same options as onGameEnd, and the round that just ended.
Empirica.onRoundEnd((game, round, players) => {
  //update the cumulative Score for everyone after the round
  players.forEach(player => {
    const currentScore = player.get("cumulativeScore");
    const roundScore = player.round.get("score");
    player.set(
      "cumulativeScore",
      Math.round((currentScore + roundScore) * 100) / 100
    );
  });
});

// onRoundEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd((game, players) => {
  console.log("The game", game._id, "has ended");
  //const nStages = game.treatment.nBlocks * game.players.length + 1;
  const conversionRate = game.treatment.conversionRate;

  players.forEach(player => {
    const bonus =
      player.get("cumulativeScore") > 0
        ? Math.round(player.get("cumulativeScore") * conversionRate * 100) / 100
        : 0;
    player.set("bonus", bonus > 7 ? 7 : bonus); //upper bound the bonus with 7
  });
});

// Helper function for game to compute game score
function computeScore(players, round, game) {
  const correctAnswer = round.get("task").correctAnswer;
  players.forEach(player => {
    const guess = player.round.get("guess");

    //From Mehdi's PNAS experiment ..
    let scoreIncrement = 0;
    if (guess) {
      let e = Math.abs(correctAnswer - guess);
      if (e > Math.PI) {
        e = Math.abs(e - 2 * Math.PI);
      }
      scoreIncrement = Math.round(Math.exp(-5 * e * e) * 10);
    } else {
      //if they gave no answer, deduct a point from them
      scoreIncrement = -10;
    }

    //score increment such that it includes the performance in all stages
    const score = (player.round.get("score") || 0) + scoreIncrement;

    player.stage.set("score", Math.round(score * 100) / 100);
    player.round.set("score", Math.round(score * 100) / 100);
  });
}

// We sort the players based on their score in this round in order to color code
// how we display their scores.
// The highest 1/3 players are green, the lowest 1/3 are red, and the rest are orange.
function colorScores(players) {
  const sortedPlayers = players.sort(compareScores);
  const top3rd = Math.floor(players.length / 3);
  const bottom3rd = Math.floor(players.length - players.length / 3);

  sortedPlayers.forEach((player, i) => {
    if (i < top3rd) {
      player.round.set("scoreColor", "green");
    } else if (i >= bottom3rd) {
      player.round.set("scoreColor", "red");
    } else {
      player.round.set("scoreColor", "orange");
    }
  });
}

// Helper function to sort players objects based on their cumulativeScore .
function compareScores(firstPlayer, secondPlayer) {
  //this is to color them based on the score
  const scoreA = firstPlayer.round.get("score");
  const scoreB = secondPlayer.round.get("score");

  let comparison = 0;
  if (scoreA > scoreB) {
    comparison = -1;
  } else if (scoreA < scoreB) {
    comparison = 1;
  }
  return comparison;
}

// ===========================================================================
// => onSet, onAppend and onChanged ==========================================
// ===========================================================================

// onSet, onAppend and onChanged are called on every single update made by all
// players in each game, so they can rapidly become quite expensive and have
// the potential to slow down the app. Use wisely.
//
// It is very useful to be able to react to each update a user makes. Try
// nontheless to limit the amount of computations and database saves (.set)
// done in these callbacks. You can also try to limit the amount of calls to
// set() and append() you make (avoid calling them on a continuous drag of a
// slider for example) and inside these callbacks use the `key` argument at the
// very beginning of the callback to filter out which keys your need to run
// logic against.
//
// If you are not using these callbacks, comment them out so the system does
// not call them for nothing.

// // onSet is called when the experiment code call the .set() method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onSet((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // // Example filtering
//   // if (key !== "value") {
//   //   return;
//   // }
// });

// // onSet is called when the experiment code call the `.append()` method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onAppend((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
//   //       be an array of the previsous valued (e.g. [0.3, 0.4, 0.65]).
// });

// // onChange is called when the experiment code call the `.set()` or the
// // `.append()` method on games, rounds, stages, players, playerRounds or
// // playerStages.
// Empirica.onChange((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue, // Previous value
//   isAppend // True if the change was an append, false if it was a set
// ) => {
//   // `onChange` is useful to run server-side logic for any user interaction.
//   // Note the extra isAppend boolean that will allow to differenciate sets and
//   // appends.
// });
