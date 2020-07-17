import React from "react";

import { Centered } from "meteor/empirica:core";
import {
  Button,
  Classes,
  FormGroup,
  RadioGroup,
  TextArea,
  Intent,
  Radio
} from "@blueprintjs/core";

export default class ExitSurvey extends React.Component {
  static stepName = "ExitSurvey";
  state = { age: "", gender: "", strategy: "", fair: "", feedback: "" };

  handleChange = event => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  exitMessage = (player, game) => {
    return (
      <div>
        <h1> Exit Survey </h1>
        <p style="visibility:hidden">< input id="shape1_check" type="checkbox" value=0>
        <input id="shape2_check" type="checkbox" value=0></p>
        <svg width="100vw" height="100vh">
          <svg x=25%>
          <path id="shape1_view" d="M 230 80
           A 45 45, 0, 1, 0, 275 125
           L 275 80 Z" fill="blue" display=none />
          </svg>

          <svg x=10% y=50%>
          <path id="shape1_selector" opacity=".3" d="M 230 80
            A 45 45, 0, 1, 0, 275 125
            L 275 80 Z" fill="blue" />
          </svg>

          <svg x=35%>
          <path id="shape2_view" fill="purple" stroke="#231F20" stroke-miterlimit="10" display=none d="M40.332,90.466c0,0-39.911,76.119-2.691,87.83
              c37.22,11.71,78.923-46.844,56.054-78.462C70.826,68.216,40.332,90.466,40.332,90.466z"/>
          </svg>

        <svg x=10% y=50%>
        <path id="shape2_selector" fill="purple" stroke="#231F20" opacity=".3" stroke-miterlimit="10"  d="M40.332,90.466c0,0-39.911,76.119-2.691,87.83
            c37.22,11.71,78.923-46.844,56.054-78.462C70.826,68.216,40.332,90.466,40.332,90.466z"/>
        </svg>


          </svg>

        <h3>
          Please submit the following code to receive your bonus:{" "}
          <em>{player._id}</em>.
        </h3>
        <p>
          You final{" "}
          <strong>
            <em>bonus is ${player.get("bonus") || 0}</em>
          </strong>{" "}
          in addition of the{" "}
          <strong>
            <em>${game.treatment.basePay} base reward</em>
          </strong>{" "}
          for completing the HIT.
        </p>
      </div>
    );
  };

  exitForm = () => {
    const { age, gender, strategy, fair, feedback, education } = this.state;

    return (
      <div>
        {" "}
        <p>
          Please answer the following short survey. You do not have to provide
          any information you feel uncomfortable with.
        </p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-line">
            <FormGroup
              inline={true}
              label={"Age"}
              labelFor={"age"}
              className={"form-group"}
            >
              <input
                id="age"
                className={Classes.INPUT}
                type="number"
                min="0"
                max="150"
                step="1"
                dir="auto"
                name="age"
                value={age}
                onChange={this.handleChange}
                // required
              />
            </FormGroup>

            <FormGroup
              inline={true}
              label={"Gender"}
              labelFor={"gender"}
              className={"form-group"}
            >
              <input
                id="gender"
                className={Classes.INPUT}
                type="text"
                dir="auto"
                name="gender"
                value={gender}
                onChange={this.handleChange}
                // required
              />
            </FormGroup>
          </div>

          <div className="form-line">
            <RadioGroup
              inline={true}
              name="education"
              label="Highest Education Qualification?"
              onChange={this.handleChange}
              selectedValue={education}
            >
              <Radio
                selected={education}
                name="education"
                value="high-school"
                label="High School"
                onChange={this.handleChange}
              />
              <Radio
                selected={education}
                name="education"
                value="bachelor"
                label="US Bachelor's Degree"
                onChange={this.handleChange}
              />
              <Radio
                selected={education}
                name="education"
                value="master"
                label="Master's or higher"
                onChange={this.handleChange}
              />
              <Radio
                selected={education}
                name="education"
                value="other"
                label="Other"
                onChange={this.handleChange}
              />
            </RadioGroup>
          </div>

          <div className="form-line thirds">
            <FormGroup
              className={"form-group"}
              inline={false}
              label={"How would you describe your strategy?"}
              labelFor={"strategy"}
              //className={"form-group"}
            >
              <TextArea
                id="strategy"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={strategy}
                fill={true}
                name="strategy"
              />
            </FormGroup>

            <FormGroup
              className={"form-group"}
              inline={false}
              label={"Do you feel the pay was fair?"}
              labelFor={"fair"}
              //className={"form-group"}
            >
              <TextArea
                id="fair"
                name="fair"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={fair}
                fill={true}
              />
            </FormGroup>

            <FormGroup
              className={"form-group"}
              inline={false}
              label={"Feedback, including problems you encountered."}
              labelFor={"fair"}
              //className={"form-group"}
            >
              <TextArea
                id="feedback"
                name="feedback"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={feedback}
                fill={true}
              />
            </FormGroup>
          </div>

          <Button type="submit" intent={"primary"} rightIcon={"key-enter"}>
            Submit
          </Button>
        </form>{" "}
      </div>
    );
  };

  render() {
    const { player, game } = this.props;
    return (
      <Centered>
        <div className="exit-survey">
          {console.log(this.props)}
          {this.exitMessage(player, game)}
          <hr />
          {this.exitForm()}
        </div>
      </Centered>
    );
  }
}
