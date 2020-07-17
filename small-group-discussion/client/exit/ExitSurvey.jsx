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

var shape_1_opacity = "1"
const display_shape_name = event => alert(event.target.state.fill);


function handleClick_1(the_event) {
 //alert(the_event.target.id)
 //change color alternatively
 if (shape_1_opacity==".3"){
   shape_1_opacity = "1"
 }
 else {
    shape_1_opacity = ".3"
 }
};


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
      <li>
         <button
           onClick={event => alert(event.target.id)}
         >
           <span role="img" aria-label="grinning face" id="grinning face">😀</span>
         </button>
       </li>

        <h1> Exit Survey </h1>
        <p style={{visibility: 'hidden'}}>
        <input id="shape1_check" type="checkbox" defaultValue={0} />
            <input id="shape2_check" type="checkbox" defaultValue={0} /></p>
          <svg width="100vw"  height="100vh">
            <svg x="25%">
              <path id="shape1_view" opacity={shape_1_opacity} d="M 230 80
     A 45 45, 0, 1, 0, 275 125
     L 275 80 Z" fill="blue" display="inline" />
            </svg>
            //onCl
            <svg x="10%" y="50%"
            onClick={event => handleClick_1(event)}>
      <path id="shape1_selector" opacity="0.8" d="M 230 80
    A 45 45, 0, 1, 0, 275 125
    L 275 80 Z" fill="blue" onclick="alert('asdfa')" />
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
