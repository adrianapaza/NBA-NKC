import React from "react";

export default class TaskResponse extends React.Component {
  handleSubmit = event => {
    event.preventDefault();
    this.props.player.stage.submit();
  };

  renderSubmitted() {
    return (
      <div className="task-response">
        <div className="bp3-callout bp3-icon-automatic-updates">
          <h5 className='bp3-heading'>Waiting on other players...</h5>
          Please wait until all players are ready
        </div>
      </div>
    );
  }

  render() {
    const { stage, player } = this.props;
    let message = "";
    if (stage.name === "outcome") {
      message = "Black arrow is the correct answer";
    } else {
      if (!player.round.get("guess")) {
        message = "Click inside the circle to make your guess";
      } else {
        message = "Drag the arrow to change your guess!";
      }
    }

    // if the player already submitted, don't show submit button
    if (player.stage.submitted) {
      return this.renderSubmitted();
    }

    return (
      <div className="task-response">
        <form onSubmit={this.handleSubmit}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h5 className="bp3-heading">{message}</h5>
          </div>
          <div className="bp3-form-group">
            <button
              type="submit"
              className="bp3-button bp3-icon-tick bp3-large"
            >
              {stage.name === "outcome" ? "Next" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
