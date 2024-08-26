
import './App.css';
import React, { useState } from 'react';
import ParticlesBg from 'particles-bg'
import Navigtion from './components/Navigtion/Navigtion';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import AgePredictions from './components/AgePredictions/AgePredictions';

function App () {

  const [isSignedIn, setIsSignedIn] = useState("signin");

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn("signin");
    } else if (route === 'home') {
      setIsSignedIn("home");
    } else if (route === 'register') {
      setIsSignedIn("register");
    }
    else if  (route === 'signin') {
      setIsSignedIn("signin");
    }
  };

  // todo: Clarifai down below : ->>
  const returnClarifaiRequestOption = (imageUrl, modelId = 'face-detection') =>{ //* my change func that make an order and gets imageUrl
    console.log(imageUrl)
    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = '902245b41f1044c28891cf32ef45fdb2'; //* my change
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'k456q92mn98y';       //* my change
    const APP_ID = 'imgRec'; //* my change
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    // const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';    no need to use
    const IMAGE_URL = imageUrl;
 ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

   const requestOptions = { //* thats what we will return (the request)
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};

return requestOptions; //* the return (the request)
  }
  // todo : Clarifai until here 

  // * just to chake : const onInputChange = (event) => {console.log(event.target.value)}
  // * just to chake : const onButtonSubmit = () => {console.log('click')}

  // * two state variables, input to track the URL entered by the user ,
  // * and imageUrl to hold the URL when the button is clicked.
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  //*onInputChange: Updates the input state as the user types in the URL.
  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  // todo: Clarifai data below : ->>
  // Initialize the state to store the bounding box coordinates for the detected face
const [box, setBox] = useState({});

// Function to calculate the face location on the image based on the Clarifai API response
const calculateFaceLocation = (data) => {
  // Extract the bounding box information from the first detected face region
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

  // Get the DOM element representing the input image to retrieve its dimensions
  const image = document.getElementById('inputimage');
  const width = Number(image.width);   // Convert the image width to a numeric value
  const height = Number(image.height); // Convert the image height to a numeric value

  // Calculate the pixel coordinates of the bounding box based on the image dimensions
  return {
    leftCol: clarifaiFace.left_col * width,          // Left edge of the box
    topRow: clarifaiFace.top_row * height,           // Top edge of the box
    rightCol: width - (clarifaiFace.right_col * width),  // Right edge of the box
    bottomRow: height - (clarifaiFace.bottom_row * height), // Bottom edge of the box
  };
};

// Function to update the state with the calculated face bounding box and log the coordinates
const displayFaceBox = (box) => {
  setBox(box);  // Update the state with the new box coordinates
  console.log(box); // Log the box coordinates to verify they are correct
};
 // todo:  ->> end here 

 const [agePredictions, setAgePredictions] = useState([]);

  //* onButtonSubmit: Sets the imageUrl state with the current input value,
  //* triggering the FaceRecognition component to display the image.
  // ? and also uses the api doc of clarifi with the help of !section 290! in ZTM to read a doc like a pro !
  const onButtonSubmit = () => {
    setImageUrl(input); // Set the imageUrl to the input value when the button is pressed
  
    // Fetching face detection data
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifaiRequestOption(input))
      .then((response) => response.json())
      .then((result) => {
        console.log(result.outputs[0].data.regions); // Output result for debugging
        
        if (result) {
          const faceBox = calculateFaceLocation(result);
          displayFaceBox(faceBox);
        }
  
        // This is the data from face detection to debug:
        const regions = result.outputs[0].data.regions;
        if (regions && regions.length > 0) {  // Check if regions exist and have at least one element
          regions.forEach((region) => {
            // Accessing and rounding the bounding box values
            const boundingBox = region.region_info.bounding_box;
            const topRow = boundingBox.top_row.toFixed(3);
            const leftCol = boundingBox.left_col.toFixed(3);
            const bottomRow = boundingBox.bottom_row.toFixed(3);
            const rightCol = boundingBox.right_col.toFixed(3);
  
            if (region.data.concepts) {  // Check if concepts exist
              region.data.concepts.forEach((concept) => {
                // Accessing and rounding the concept value *BINARY_POSITIVE*
                const name = concept.name;
                const value = concept.value.toFixed(4);
  
                console.log(
                  `${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`
                );
              });
            }
          });
        } else {
          console.log("No face regions detected."); // Log if no regions were detected
        }
         
        // Fetching age detection data using the same image URL
        // Fetching age detection data using the same image URL
      return fetch("https://api.clarifai.com/v2/models/age-demographics-recognition/outputs", returnClarifaiRequestOption(input, 'age-demographics-recognition'));
    })
    .then(response => response.json())
    .then(result => {
      console.log("Full Age Detection Result:", result); // Log the entire response for debugging

  const ageConcepts = result.outputs[0].data.concepts;
  // Get the top 3 age predictions
  const top3Concepts = ageConcepts.slice(0, 3);
  console.log("Top 3 Age Predictions:", top3Concepts);

  // Set the top 3 age predictions in the state for rendering
  setAgePredictions(top3Concepts);
    })
    .catch((error) => console.log("Error:", error));

  console.log('click');
  };

  return (
    <div className="App">
      <ParticlesBg color="#DCDCDC" num={55} type="cobweb" bg={true} />

      {/* Navigation bar that shows 'Sign In' or 'Sign Out' based on the isSignedIn state */}
      <Navigtion isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
  
      {/* Conditional rendering: 
          If the user is signed in (isSignedIn is true), show the homepage components. 
          Otherwise, show the SignIn form. */}
      {isSignedIn==="home" ? (
        <div>
          <Logo />
          <Rank />
          {/* ImageLinkForm component where the user can input an image URL and submit it */}
          <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />

          <div className="centerContent">
             {/* FaceRecognition component that shows the image with detected face bounding box */}
          <FaceRecognition imageUrl={imageUrl} box={box} />
          
          <AgePredictions agePredictions={agePredictions} />
          
          </div>
        </div>
      ) : (
        isSignedIn==="signin"
        /* SignIn component that shows the sign-in form if the user is not signed in */
       ? <SignIn onRouteChange={onRouteChange} />
       :<Register onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
