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
