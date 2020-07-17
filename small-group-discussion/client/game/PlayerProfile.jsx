import React from "react";

import Timer from "./Timer";

export default class PlayerProfile extends React.Component {
  renderProfile() {
    const { player } = this.props;
    return (
      <div className="profile-score">
        <h3 className="bp3-heading">Your Profile</h3>
        <br />
        <h4 className="bp3-heading" style={{ color: player.get("arrowColor") }}>
          <span>{player.get("name")}</span>
        </h4>{" "}
        <img src={player.get("avatar")} className="profile-avatar" />
      </div>
    );
  }

  renderScore() {
    const { player } = this.props;
    return (
      <div className="profile-score">
        <h4 className="bp3-heading">Total score</h4>
        <span>{player.get("cumulativeScore") || 0}</span>
      </div>
    );
  }

  render() {
    const { stage } = this.props;

    return (
      <aside className="bp3-card player-profile">
        {this.renderProfile()}
        {this.renderScore()}
        <Timer stage={stage} />
      </aside>
    );
  }
}
