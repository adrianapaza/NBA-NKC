import React from "react";

export default class SocialExposure extends React.Component {
  renderObserve() {
    const { game, stage, player } = this.props;
    //TODO: this should be fixed as stage.observe that was defined in init .. the whole
    //init needs to be consistent with the rest of the API with get() and set()
    //instead of stage.name.charAt(0) === p.get("name")
    const otherPlayer = game.players.find(
      p => stage.name.charAt(0) === p.get("name")
    );
    //if the current player is the one to be observed
    if (otherPlayer._id === player._id) {
      return (
        <div className="social-exposure">
          <p>
            <strong>You observe</strong>
          </p>
          <div className="alter bp3-card bp3-elevation-2" key={otherPlayer._id}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h5 className="range bp3-heading">YOU are observed</h5>
            </div>
            <div className="range" />
          </div>
        </div>
      );
    } else {
      //you are observing
      return (
        <div className="social-exposure">
          <p>
            <strong>You observe:</strong>
          </p>
          {!_.isEmpty(otherPlayer) ? (
            <div
              className="alter bp3-card bp3-elevation-2"
              key={otherPlayer._id}
            >
              <img src={otherPlayer.get("avatar")} className="profile-avatar" />
              <h4
                className="bp3-heading"
                style={{ color: otherPlayer.get("arrowColor") }}
              >
                {otherPlayer.get("name")}
              </h4>{" "}
            </div>
          ) : (
            ""
          )}
        </div>
      );
    }
  }

  render() {
    return this.renderObserve();
  }
}
