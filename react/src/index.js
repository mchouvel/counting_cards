import React from "react";
import ReactDOM from "react-dom";
import * as tf from '@tensorflow/tfjs';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import "./styles.css";
tf.setBackend('webgl');

const threshold = 0.80;

async function load_model() {
    // It's possible to load the model locally or from a repo
    // You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json" just set it before in your https server
    const model = await loadGraphModel("https://raw.githubusercontent.com/mchouvel/counting_cards/master/counting_cards/model/card_detector/model.json");
    //const model = await loadGraphModel("http://127.0.0.1:8080/model.json");
    return model;
  }

let classesDir = {
    1: {
      name: "10C",
      value: -1,
    },
    2: {
      name: "10D",
      value: -1,
    },
    3: {
      name: "10H",
      value: -1,
    },
    4: {
      name: "10S",
      value: -1,
    },
    5: {
      name: "2C",
      value: 1,
    },
    6: {
      name: "2D",
      value: 1,
    },
    7: {
      name: "2H",
      value: 1,
    },
    8: {
      name: "2S",
      value: 1,
    },
    9: {
      name: "3C",
      value: 1,
    },
    10: {
      name: "3D",
      value: 1,
    },
    11: {
      name: "3H",
      value: 1,
    },
    12: {
      name: "3S",
      value: 1,
    },
    13: {
      name: "4C",
      value: 1,
    },
    14: {
      name: "4D",
      value: 1,
    },
    15: {
      name: "4H",
      value: 1,
    },
    16: {
      name: "4S",
      value: 1,
    },
    17: {
      name: "5C",
      value: 1,
    },
    18: {
      name: "5D",
      value: 1,
    },
    19: {
      name: "5H",
      value: 1,
    },
    20: {
      name: "5S",
      value: 1,
    },
    21: {
      name: "6C",
      value: 1,
    },
    22: {
      name: "6D",
      value: 1,
    },
    23: {
      name: "6H",
      value: 1,
    },
    24: {
      name: "6S",
      value: 1,
    },
    25: {
      name: "7C",
      value: 0,
    },
    26: {
      name: "7D",
      value: 0,
    },
    27: {
      name: "7H",
      value: 0,
    },
    28: {
      name: "7S",
      value: 0,
    },
    29: {
      name: "8C",
      value: 0,
    },
    30: {
      name: "8D",
      value: 0,
    },
    31: {
      name: "8H",
      value: 0,
    },
    32: {
      name: "8S",
      value: 0,
    },
    33: {
      name: "9C",
      value: 0,
    },
    34: {
      name: "9D",
      value: 0,
    },
    35: {
      name: "9H",
      value: 0,
    },
    36: {
      name: "9S",
      value: 0,
    },
    37: {
      name: "AC",
      value: -1,
    },
    38: {
      name: "AD",
      value: -1,
    },
    39: {
      name: "AH",
      value: -1,
    },
    40: {
      name: "AS",
      value: -1,
    },
    41: {
      name: "JC",
      value: -1,
    },
    42: {
      name: "JD",
      value: -1,
    },
    43: {
      name: "JH",
      value: -1,
    },
    44: {
      name: "JS",
      value: -1,
    },
    45: {
      name: "KC",
      value: -1,
    },
    46: {
      name: "KD",
      value: -1,
    },
    47: {
      name: "KH",
      value: -1,
    },
    48: {
      name: "KS",
      value: -1,
    },
    49: {
      name: "QC",
      value: -1,
    },

    50: {
      name: "QD",
      value: -1,
    },

    51: {
      name: "QH",
      value: -1,
    },
    52: {
      name: "QS",
      value: -1,
    },
}

class App extends React.Component {
  videoRef = React.createRef();
  canvasRef = React.createRef();

  constructor(props){
    super(props);
    this.state = { PlayedCards : [], Count : 0};
    this.resetCards = () => {
      this.setState({ 
        PlayedCards: [],
        Count: 0
      })
    };
    this.resetHand = () => {
      this.setState({ 
        PlayedCards: [],
      })
    };
  }

  removeCard(card) {
    var array = [...this.state.PlayedCards];
    var index = array.indexOf(card);

    for (var i in classesDir){
      if (classesDir[i].name === card){
        var value = classesDir[i].value;
      }
    }

    if (index !== -1) {
      array.splice(index, 1);
      this.setState({PlayedCards: array,
                     Count: this.state.Count-value});
    }
  };

  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: { ideal: 600 },
            height: { ideal: 500 } 
          }
        })
        .then(stream => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });

      const modelPromise = load_model();

      Promise.all([modelPromise, webCamPromise])
        .then(values => {
          this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

    detectFrame = (video, model) => {
        tf.engine().startScope();
        model.executeAsync(this.process_input(video)).then(predictions => {
        this.renderPredictions(predictions, video);
        requestAnimationFrame(() => {
          this.detectFrame(video, model);
        });
        tf.engine().endScope();
      });
  };

  process_input(video_frame){
    const tfimg = tf.browser.fromPixels(video_frame).toInt();
    const expandedimg = tfimg.transpose([0,1,2]).expandDims();
    return expandedimg;
  };

  buildDetectedObjects(scores, threshold, boxes, classes, classesDir) {
    const detectionObjects = []
    var video_frame = document.getElementById('frame');

    scores[0].forEach((score, i) => {
      if (score > threshold && score<1) {
        const bbox = [];
        const minY = boxes[0][i][0] * video_frame.offsetHeight;
        const minX = boxes[0][i][1] * video_frame.offsetWidth;
        const maxY = boxes[0][i][2] * video_frame.offsetHeight;
        const maxX = boxes[0][i][3] * video_frame.offsetWidth;
        bbox[0] = minX;
        bbox[1] = minY;
        bbox[2] = maxX - minX;
        bbox[3] = maxY - minY;
        detectionObjects.push({
          class: classes[i],
          label: classesDir[classes[i]].name,
          score: score.toFixed(4),
          bbox: bbox,
          value: classesDir[classes[i]].value,
        })
      }
    })
    return detectionObjects
  }

  renderPredictions = predictions => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    //Getting predictions
    //const boxes = predictions[5].arraySync();
    //const scores = predictions[3].arraySync();
    //const classes = predictions[1].dataSync();
    //console.log(predictions)
    const boxes = predictions[1].arraySync();
    const scores = predictions[6].arraySync();
    const classes = predictions[3].dataSync();
    //console.log(scores)

    const detections = this.buildDetectedObjects(scores, threshold,
                                    boxes, classes, classesDir);

    detections.forEach(item => {
      console.log(item["score"])
      const x = item['bbox'][0];
      const y = item['bbox'][1];
      const width = item['bbox'][2];
      const height = item['bbox'][3];

      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%").width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    detections.forEach(item => {
      const x = item['bbox'][0];
      const y = item['bbox'][1];
      //console.log(item["label"]+" "+(100*item["score"]).toFixed(2))
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(item["label"] + " " + (100*item["score"]).toFixed(2) + "%", x, y);

    if(item['score']>=0.93 && this.state.PlayedCards.includes(item["label"])===false) {
      this.setState({ 
        PlayedCards: this.state.PlayedCards.concat([item["label"]]),
        Count: Number(this.state.Count) + Number(item["value"])
      })
    }
    });

  };

  render() {
    return (
      <div className="all">
        <div className="header">
          <img src="blackjack.png"/>
        </div>
        <div className="columns">
          <div className="col video_part">
            <video
              style={{height: '450px', width: "600px"}}
              className="size"
              autoPlay
              playsInline
              muted
              ref={this.videoRef}
              width="600"
              height="450"
              id="frame"
            />
            <canvas
              style={{height: '450px', width: "600px"}}
              className="size"
              ref={this.canvasRef}
              width="600"
              height="450"
            />
          </div>
          <div className="col infos_part">
            <h2>Count: {this.state.Count}</h2>
            <div className="cards"> 
              {this.state.PlayedCards.map((card) => (
                <img key={card} src={"cards/"+card+".png"} onClick={() => this.removeCard(card)} />
              ))}
            </div>
            <button onClick={this.resetHand} variant='light'>
            New hand
            </button>
            <button onClick={this.resetCards} variant='light'>
            Reset
            </button>
          </div>
        </div>
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
