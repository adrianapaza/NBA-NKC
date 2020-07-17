import React from "react";

import { Centered } from "meteor/empirica:core";

import ExampleBoard from "./ExampleBoard";



var shapes_toggle_list = [1,1,1,1,1,1,1,1,1,1]



function Click_Shape(the_event) {
// //change color alternatively
 if ( shapes_toggle_list[the_event.target.id]==0){
   shapes_toggle_list[the_event.target.id]=1
 }
 else {
   shapes_toggle_list[the_event.target.id]=0
 }
};


export default class InstructionStepOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: 0
    };
  }

  updateArrow = guess => {
    this.setState({ guess: guess });
  };

  render() {
    const { hasPrev, hasNext, onNext, onPrev, game } = this.props;
    console.log(game);

    return (
      <Centered>

        <div className="instructions"
        >
          <h1 className="bp3-heading">Task Description </h1>

          <p>
            In this experiment, you will perform repeated instances of a visual
            perception task. In the task, you will see a set of dots moving in a
            circular zone as illustrated in the example below:
          </p>


          <p style={{visibility: 'hidden'}}>
            </p>
              <svg width="100vw"  height="40vh">
                <svg x="25%">
                  <path opacity={shapes_toggle_list[0]} d="M 230 80
                    A 45 45, 0, 1, 0, 275 125
                    L 275 80 Z" fill="blue" display="inline" />
                </svg>

                <circle  r="33"
                  cx="35%"
                  cy="55%"
                   stroke-width="4" fill="green"
                    opacity={shapes_toggle_list[1]} >
                </circle>



                <rect
                 x="380"
                 y="75"
                 width="70"
                 height="70"
                 opacity={shapes_toggle_list[2]}
                 >
                 </rect>


                 <svg height="14vh" width="200vw"
                 x="40%" y="30%"
                 >
                 <path  d="M150 100 L100 10 L200 10 Z"
                 fill = "purple"
                 opacity={shapes_toggle_list[3]}/>
                 </svg>



                 <svg height="14vh" width="200vw"
                 x="32%" y="50%"
                 >
                 <path  d="M150 10 L50 200 L250 200 Z" fill="red"
                 opacity={shapes_toggle_list[4]}/>
               </svg>



               <svg height="100" width="150"
                 x="33%" y="0%"
                 >
                 <path id = "5" d ="M 60.000 72.000
                     L 92.328 94.496
                     L 80.923 56.798
                     L 112.308 33.004
                     L 72.931 32.202
                     L 60.000 -5.000
                     L 47.069 32.202
                     L 7.692 33.004
                     L 39.077 56.798
                     L 27.672 94.496
                     L 60.000 72.000"
                     opacity={shapes_toggle_list[5]}
                 fill="lime"/>
               </svg>



               <svg height="100" width="150"
                 x="31%" y="55%"
                 >
                   <path  d ="M 60.000 72.000
                     L 74.235 103.126
                     L 71.000 69.053
                     L 98.891 88.891
                     L 79.053 61.000
                     L 113.126 64.235
                     L 82.000 50.000
                     L 113.126 35.765
                     L 79.053 39.000
                     L 98.891 11.109
                     L 71.000 30.947
                     L 74.235 -3.126
                     L 60.000 28.000
                     L 45.765 -3.126
                     L 49.000 30.947
                     L 21.109 11.109
                     L 40.947 39.000
                     L 6.874 35.765
                     L 38.000 50.000
                     L 6.874 64.235
                     L 40.947 61.000
                     L 21.109 88.891
                     L 49.000 69.053
                     L 45.765 103.126
                     L 60.000 72.000"
                     opacity={shapes_toggle_list[6]}
                   fill="red"/>
                 </svg>


                 <svg height="100" width="150"
                   x="36%" y="35%"
                   >
                   <path  d ="M 60.000 72.000
                     L 115.000 50.000
                     L 60.000 28.000
                     L 5.000 50.000
                     L 60.000 72.000
                     Z"
                     opacity={shapes_toggle_list[7]}
                   fill="orange"/>
                 </svg>


                 <svg height="100" width="150"
                   x="48%" y="45%"
                   >
                   <path  d ="M 60.000 60.000
                     L 107.631 77.500
                     L 68.660 45.000
                     L 60.000 -5.000
                     L 51.340 45.000
                     L 12.369 77.500
                     L 60.000 60.000
                     Z"
                     opacity={shapes_toggle_list[8]}
                   fill="brown"/>
                 </svg>


                 <svg height="100" width="150"
                   x="45%" y="0%"
                   >
                   <path d = "M 60.000 95.000
                     L 102.798 63.906
                     L 86.450 13.594
                     L 33.550 13.594
                     L 17.202 63.906
                     L 60.000 95.000
                     Z"
                     opacity={shapes_toggle_list[9]}
                   fill="coral"/>
                 </svg>


            </svg>





              <h2>
                Click shapes below to toggle
              </h2>


      <svg width="100vw"  height="25vh">
                <svg x="-10%" y="-10%"
                onClick={event => Click_Shape(event)}>
                <path id="0" opacity={shapes_toggle_list[0]/2+.3} d="M 230 80
                    A 45 45, 0, 1, 0, 275 125
                    L 275 80 Z" fill="blue" onclick="alert('asdfa')" />
                </svg >

                <circle  id = "1" r="48"
                  cx="27%"
                  cy="55%"
                   stroke-width="4" fill="green"
                    onClick={event => Click_Shape(event)}
                    opacity={shapes_toggle_list[1]/2+.3} >
                </circle>

                <rect id ="2"
                 x="380"
                 y="55"
                 width="90"
                 height="90"
                 onClick={event => Click_Shape(event)}
                 opacity={shapes_toggle_list[2]/2+.3}
                 >
                 </rect>

                 <svg height="14vh" width="200vw"
                 x="40%" y="25%"
                 onClick={event => Click_Shape(event)}>
                 <path id ="3" d="M150 100 L100 10 L200 10 Z"
                 fill = "purple"
                 opacity={shapes_toggle_list[3]/2+.3}/>
               </svg>


                <svg height="14vh" width="200vw"
                x="52%" y="25%"
                onClick={event => Click_Shape(event)}>
                <path id ="4" d="M150 10 L50 200 L250 200 Z" fill="red"
                opacity={shapes_toggle_list[4]/2+.3}/>
              </svg>

      //Star
      </svg>
        <svg width="100vw"  height="35vh">
            <svg height="100" width="150"
              x="6%" y="5%"
              onClick={event => Click_Shape(event)}>
              <path id = "5" d ="M 60.000 72.000
                  L 92.328 94.496
                  L 80.923 56.798
                  L 112.308 33.004
                  L 72.931 32.202
                  L 60.000 -5.000
                  L 47.069 32.202
                  L 7.692 33.004
                  L 39.077 56.798
                  L 27.672 94.496
                  L 60.000 72.000"
                  opacity={shapes_toggle_list[5]/2+.3}
              fill="lime"/>
            </svg>

            //Abstract Star
            <svg width="100vw"  height="35vh">
                <svg height="100" width="150"
                  x="21%" y="5%"
                  onClick={event => Click_Shape(event)}>
                    <path id = "6" d ="M 60.000 72.000
                      L 74.235 103.126
                      L 71.000 69.053
                      L 98.891 88.891
                      L 79.053 61.000
                      L 113.126 64.235
                      L 82.000 50.000
                      L 113.126 35.765
                      L 79.053 39.000
                      L 98.891 11.109
                      L 71.000 30.947
                      L 74.235 -3.126
                      L 60.000 28.000
                      L 45.765 -3.126
                      L 49.000 30.947
                      L 21.109 11.109
                      L 40.947 39.000
                      L 6.874 35.765
                      L 38.000 50.000
                      L 6.874 64.235
                      L 40.947 61.000
                      L 21.109 88.891
                      L 49.000 69.053
                      L 45.765 103.126
                      L 60.000 72.000"
                      opacity={shapes_toggle_list[6]/2+.3}
                    fill="red"/>
                  </svg>
              </svg>


              //Diamond
              <svg width="100vw"  height="35vh">
                    <svg height="100" width="150"
                      x="35%" y="5%"
                      onClick={event => Click_Shape(event)}>
                      <path id = "7" d ="M 60.000 72.000
                        L 115.000 50.000
                        L 60.000 28.000
                        L 5.000 50.000
                        L 60.000 72.000
                        Z"
                        opacity={shapes_toggle_list[7]/2+.3}
                      fill="orange"/>
                    </svg>
              </svg>


              //Tri-Point
              <svg width="100vw"  height="35vh">
                    <svg height="100" width="150"
                      x="48%" y="5%"
                      onClick={event => Click_Shape(event)}>
                      <path id = "8" d ="M 60.000 60.000
                        L 107.631 77.500
                        L 68.660 45.000
                        L 60.000 -5.000
                        L 51.340 45.000
                        L 12.369 77.500
                        L 60.000 60.000
                        Z"
                        opacity={shapes_toggle_list[8]/2+.3}
                      fill="brown"/>
                    </svg>
              </svg>


              //Pentagon
              <svg width="100vw"  height="35vh">
                    <svg height="100" width="150"
                      x="60%" y="4%"
                      onClick={event => Click_Shape(event)}>
                      <path id = "9" d ="M 60.000 95.000
                        L 102.798 63.906
                        L 86.450 13.594
                        L 33.550 13.594
                        L 17.202 63.906
                        L 60.000 95.000
                        Z"
                        opacity={shapes_toggle_list[9]/2+.3}
                      fill="coral"/>
                    </svg>
              </svg>


        </svg>


          <div className="taskExample"
        //  onload="draw_square(200,200)"
          >
            <ExampleBoard
              guess={this.state.guess}
              isOutcome={false}
              stage={null}
              disabled={false}
              socialGuess={null}
              stageName={"response"}
              taskData={{
                answer: 0,
                answerProportion: 0.7,
                dotSpeed: 100,
                nDots: 50
              }}
              actions={{
                updateArrow: this.updateArrow
              }}
            />

          </div>



          <p>
            Some dots are moving in the same direction. It's the{" "}
            <strong>main movement direction</strong>. The other dots are just
            moving randomly.
          </p>

          <p>
            You will have to <strong>click in the circle</strong> to indicate
            the direction of the main movement (try clicking in the above
            example).
          </p>
          <p>
            Note that{" "}
            <strong>
              the number of dots that move in the same direction can vary
            </strong>
            , which can <strong>make it easier or harder</strong> to guess the
            main movement direction.
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

var deg = Math.PI/180
function draw_square() {
  var canvas = document.getElementById('id');
  sdfa
  alert('clicked')
  var ctx = canvas.getContext('myCanvas2');
    alert('kale')
    var x = 10;
    var y = 10;
    ctx.fillStyle='#999900';
    ctx.fillRect(cx,cy,50,50);


}
