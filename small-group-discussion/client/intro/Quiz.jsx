import React from "react";

import { Centered, AlertToaster } from "meteor/empirica:core";

import { Radio, RadioGroup } from "@blueprintjs/core";

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nParticipants: "",
      scoreOption: "",
      idle: "",
      largeError: ""
    };
  }

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value.trim().toLowerCase() });
  };

  handleRadioChange = event => {
    const el = event.currentTarget;
    this.setState({ scoreOption: el.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { game } = this.props;

    if (game.treatment.playerCount === 1){
      this.setState({nParticipants:1})
    }

    //it should be this.state.nParticipants !== "3" but we don't have "treatment" in QUIZ
    if (
      this.state.nParticipants.toString() !== game.treatment.playerCount.toString() ||
      this.state.scoreOption !== "all" ||
      this.state.idle !== "-10" ||
      this.state.largeError !== "0"
    ) {
      AlertToaster.show({
        message:
          "Sorry, you have one or more mistakes. Please ensure that you answer the questions correctly, or go back to the insturctions"
      });
    } else {
      this.props.onNext();
    }
  };

  render() {
    const { hasPrev, onPrev, game } = this.props;
    const { nParticipants, scoreOption, idle, largeError } = this.state;
    return (
      <Centered>
        <div className="quiz">
          <h1 className="bp3-heading"> Quiz </h1>
          <form onSubmit={this.handleSubmit}>
            {game.treatment.playerCount > 1 ? (
              <div className="bp3-form-group">
                <label className="bp3-label" htmlFor="number-of-participants">
                  How many participants will play at the same time, including
                  yourself?
                </label>
                <div className="bp3-form-content">
                  <input
                    id="nParticipants"
                    className="bp3-input"
                    type="number"
                    min="0"
                    max="150"
                    step="1"
                    dir="auto"
                    name="nParticipants"
                    value={nParticipants}
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
            ) : null}

            <div className="bp3-form-group">
              <div className="bp3-form-content">
                <RadioGroup
                  label="Select the true statement about the score:"
                  onChange={this.handleRadioChange}
                  selectedValue={scoreOption}
                  required
                >
                  <Radio
                    label="I will score points only based on my latest answer"
                    value="last"
                  />
                  <Radio
                    label="I will accumulate the points across every single answer I give"
                    value="all"
                  />
                </RadioGroup>
              </div>
            </div>

            <div className="bp3-form-group">
              <label className="bp3-label" htmlFor="number-of-participants">
                If your estimation error is large (e.g., more than 45 degrees)
                in one of the rounds, your score will be incremented by:
              </label>
              <div className="bp3-form-content">
                <input
                  id="largeError"
                  className="bp3-input"
                  type="number"
                  min="-10"
                  max="10"
                  step="1"
                  dir="auto"
                  name="largeError"
                  value={largeError}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>

            <div className="bp3-form-group">
              <label className="bp3-label" htmlFor="number-of-participants">
                If you do not input any answer (e.g., you go idle and leave the
                circle empty) your score for that round would be? (for deducted
                points, use negative numbers)
              </label>
              <div className="bp3-form-content">
                <input
                  id="idle"
                  className="bp3-input"
                  type="number"
                  min="-10"
                  max="10"
                  step="1"
                  dir="auto"
                  name="idle"
                  value={idle}
                  onChange={this.handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="button"
              className="bp3-button bp3-intent-nope bp3-icon-double-chevron-left"
              onClick={onPrev}
              disabled={!hasPrev}
            >
              Back to instructions
            </button>
            <button type="submit" className="bp3-button bp3-intent-primary">
              Submit
              <span className="bp3-icon-standard bp3-icon-key-enter bp3-align-right" />
            </button>
          </form>
        </div>
      </Centered>
    );
  }
}
