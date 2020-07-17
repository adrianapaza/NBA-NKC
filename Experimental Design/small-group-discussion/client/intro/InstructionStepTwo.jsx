import React from "react";

import { Centered } from "meteor/empirica:core";

import ExampleBoard from "./ExampleBoard";

export default class InstructionStepTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: null,
      isOutcome: false,
      stage: null,
      disabled: false,
      socialGuess: null,
      stageName: "response",
      score: 0,
      message: "Click inside the circle to make your guess",
      correctAnswer: Math.random() * (5 - -5.0789) + -5.0789
    };
  }

  updateArrow = guess => {
    this.setState({
      guess: guess,
      message: "Drag the arrow to change your guess"
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    let score = 0;
    if (this.state.guess) {
      let e = Math.abs(this.state.correctAnswer - this.state.guess);
      if (e > Math.PI) {
        e = Math.abs(e - 2 * Math.PI);
      }
      score = Math.round(Math.exp(-5 * e * e) * 10);
    } else {
      //if they gave no answer, deduct a point from them
      score = -10;
    }

    this.setState({
      isOutcome: true,
      disabled: true,
      stageName: "outcome",
      score: score,
      message: "Correct answer is the black arrow"
    });
  };

  handleReset = event => {
    event.preventDefault();
    this.setState({
      guess: null,
      isOutcome: false,
      stage: null,
      disabled: false,
      socialGuess: null,
      stageName: "response",
      score: 0,
      message: "Click inside the circle to make your guess",
      correctAnswer: Math.random() * (5 - -5.0789) + -5.0789
    });
  };

  render() {
    const { hasPrev, hasNext, onNext, onPrev, game } = this.props;

    return (
      <Centered>
        <div className="instructions small-text">
          <h1>Performance and Bonuses</h1>
          <p>
            At the end of the experiment, your score will be converted into a
            monetary bonus.{" "}
          </p>
          <p>
            <strong>
              Note that <em>every decision</em> you make will count towards the
              final score.
            </strong>{" "}
            The number of points you score depends on the accuracy of your
            estimation. You can score up to <strong>10 points</strong> per
            round, but{" "}
            <strong>
              your score will be 0 point if your error is higher than 45°
            </strong>{" "}
            and you will be{" "}
            <strong>
              <em>
                deducted 10 points for every round if you do not give any answer{" "}
              </em>{" "}
            </strong>{" "}
            (i.e., leaving the circle empty, with no arrow). However, if you are
            happy with your answer from the previous round, you do not need to
            change it (i.e., you don't need to move the arrow). You will NOT be
            deducted any points as long as you have an arrow in the circle. Try
            this new example and see how many points you will score.
          </p>

          <div className="task">
            <ExampleBoard
              guess={this.state.guess}
              isOutcome={this.state.isOutcome}
              stage={null}
              disabled={this.state.disabled}
              socialGuess={this.state.socialGuess}
              stageName={this.state.stageName}
              taskData={{
                answer: this.state.correctAnswer,
                answerProportion: 0.7,
                dotSpeed: 100,
                nDots: 50
              }}
              actions={{
                updateArrow: this.updateArrow
              }}
            />

            {!this.state.isOutcome ? (
              <div className="task-response">
                <form onSubmit={this.handleSubmit}>
                  <div style={{ marginTop: "2rem" }}>
                    <h5 className="bp3-heading">{this.state.message}</h5>
                  </div>
                  <div className="bp3-form-group">
                    <button
                      type="submit"
                      className="bp3-button bp3-icon-tick bp3-large"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            <div>
              {" "}
              <p>
                {this.state.isOutcome
                  ? "Your score is " +
                    this.state.score +
                    " points. Do you want to "
                  : null}
                {this.state.isOutcome ? (
                  <button
                    type="button"
                    style={{
                      display: "inline-block",
                      margin: 0
                    }}
                    className="bp3-button bp3-intent-primary bp3-minimal bp3-icon-refresh"
                    onClick={this.handleReset}
                  >
                    try again
                  </button>
                ) : null}
              </p>
            </div>
          </div>
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
