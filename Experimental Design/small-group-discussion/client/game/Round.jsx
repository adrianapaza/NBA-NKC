import React from "react";

import PlayerProfile from "./PlayerProfile";
import SocialExposure from "./socialExposure.jsx";
import Task from "./Task";
import Outcome from "./Outcome";

const roundSound = new Audio("sounds/round-sound.mp3");
const gameSound = new Audio("sounds/bell.mp3");

export default class Round extends React.Component {
  componentDidMount() {
    const { player } = this.props;
    if (player.get("justStarted")) {
      //play the bell sound only once when the game starts
      gameSound.play();
      player.set("justStarted", false);
    } else {
      roundSound.play();
    }
  }

  render() {
    const { round, stage, player, game } = this.props;

    return (
      <div className="round">
        <div className="content">
          <PlayerProfile player={player} stage={stage} game={game} />
          <Task round={round} stage={stage} player={player} game={game} />
          {/*only show the social exposure when it is not the initial response*/}
          {stage.name === "response" ||
          stage.name === "outcome" ||
          game.treatment.playerCount === 1 ? null : (
            <SocialExposure stage={stage} player={player} game={game} />
          )}

          {stage.name === "outcome" ? (
            <Outcome stage={stage} player={player} game={game} />
          ) : null}
        </div>
      </div>
    );
  }
}
