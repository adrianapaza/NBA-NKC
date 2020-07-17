import React from "react";

import { Centered } from "meteor/empirica:core";


export default class InstructionStepThree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: null
    };
  }

  updateArrow = guess => {
    this.setState({ guess: guess });
  };

  render() {
    const { hasPrev, hasNext, onNext, onPrev, game } = this.props;
    return (
      <Centered>
        <div className="instructions">
          <h1 className='bp3-heading'> You will be part of a team</h1>
          <p>
            In this experiment, you will{" "}
            <strong>
              play together with {game.treatment.playerCount - 1} other participants
            </strong>
            . They are other MTurk workers who are undertaking the same
            experiment simultaneously. In total, you will{" "}
            <strong>play {game.treatment.nRounds} games with them.</strong>
          </p>

          <p>
            In each game, you will see the moving dots and have to enter your
            estimate within {game.treatment.stageDuration} seconds. Then,{" "}
            <strong>
              {game.treatment.nBlocks * game.treatment.playerCount} revision rounds{" "}
            </strong>
            will follow.
          </p>
          <p>
            In each revision round,{" "}
            <strong>
              <em>the answer of one other player will be shown to you</em>
            </strong>
            . You will have {game.treatment.stageDuration} seconds again to update
            your answer if you wish to do so. In some revision rounds, it is
            your answer that will be shown to the other players.
          </p>
          <p>
            At the end of the {game.treatment.nBlocks * game.treatment.playerCount}{" "}
            revisions rounds, we will show you the correct answer and the{" "}
            <strong>
              accumulated total number of points scored in each revision rounds
            </strong>
            .
          </p>
          <p>
            Finally, a new game will start with the same players. In total, you
            will play <strong>{game.treatment.nRounds} games</strong> with the same
            partners before the experiment ends
          </p>

          <button
            type="button"
            className="bp3-button bp3-intent-nope bp3-icon-double-chevron-left"
            onClick={onPrev}
            disabled={!hasPrev}
          >
            Previous
          </button>
          <button
            type="button"
            className="bp3-button bp3-intent-primary"
            onClick={onNext}
            disabled={!hasNext}
          >
            Next
            <span className="bp3-icon-standard bp3-icon-double-chevron-right bp3-align-right" />
          </button>
        </div>
      </Centered>
    );
  }
}
