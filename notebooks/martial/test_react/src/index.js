import React from "react";
import ReactDOM from "react-dom";
import * as tf from '@tensorflow/tfjs';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import "./styles.css";
tf.setBackend('webgl');

const threshold = 0.8;

async function load_model() {
    // It's possible to load the model locally or from a repo
    // You can choose whatever IP and PORT you want in the "http://127.0.0.1:8080/model.json" just set it before in your https server
    const model = await tf.loadGraphModel("https://raw.githubusercontent.com/mchouvel/counting_cards/master/counting_cards/model/card_detector/model.json");
    //const model = await loadGraphModel("https://raw.githubusercontent.com/mchouvel/counting_cards/master/counting_cards/model/card_detector/model.json");
    return model;
  }

let classesDir = {
    1: {
      name: "10C",
      id: 1,
    },
    2: {
      name: "10D",
      id: 2,
    },
    3: {
      name: "10H",
      id: 3,
    },
    4: {
      name: "10S",
      id: 4,
    },
    5: {
      name: "2C",
      id: 5,
    },
    6: {
      name: "2D",
      id: 6,
    },
    7: {
      name: "2H",
      id: 7,
    },
    8: {
      name: "2S",
      id: 8,
    },
    9: {
      name: "3C",
      id: 9,
    },
    10: {
      name: "3D",
      id: 10,
    },
    11: {
      name: "3H",
      id: 11,
    },
    12: {
      name: "3S",
      id: 12,
    },
    13: {
      name: "4C",
      id: 13,
    },
    14: {
      name: "4D",
      id: 14,
    },
    15: {
      name: "4H",
      id: 15,
    },
    16: {
      name: "4S",
      id: 16,
    },
    17: {
      name: "5C",
      id: 17,
    },
    18: {
      name: "5D",
      id: 18,
    },
    19: {
      name: "5H",
      id: 19,
    },
    20: {
      name: "5S",
      id: 20,
    },
    21: {
      name: "6C",
      id: 21,
    },
    22: {
      name: "6D",
      id: 22,
    },
    23: {
      name: "6H",
      id: 23,
    },
    24: {
      name: "6S",
      id: 24,
    },
    25: {
      name: "7C",
      id: 25,
    },
    26: {
      name: "7D",
      id: 26,
    },
    27: {
      name: "7H",
      id: 27,
    },
    28: {
      name: "7S",
      id: 28,
    },
    29: {
      name: "8C",
      id: 29,
    },
    30: {
      name: "8D",
      id: 30,
    },
    31: {
      name: "8H",
      id: 31,
    },
    32: {
      name: "8S",
      id: 32,
    },
    33: {
      name: "9C",
      id: 33,
    },
    34: {
      name: "9D",
      id: 34,
    },
    35: {
      name: "9H",
      id: 35,
    },
    36: {
      name: "9S",
      id: 36,
    },
    37: {
      name: "AC",
      id: 37,
    },
    38: {
      name: "AD",
      id: 38,
    },
    39: {
      name: "AH",
      id: 39,
    },
    40: {
      name: "AS",
      id: 40,
    },
    41: {
      name: "JC",
      id: 41,
    },
    42: {
      name: "JD",
      id: 42,
    },
    43: {
      name: "JH",
      id: 43,
    },
    44: {
      name: "JS",
      id: 44,
    },
    45: {
      name: "KC",
      id: 45,
    },
    46: {
      name: "KD",
      id: 46,
    },
    47: {
      name: "KH",
      id: 47,
    },
    48: {
      name: "KS",
      id: 48,
    },
    49: {
      name: "QC",
      id: 49,
    },

    50: {
      name: "QD",
      id: 50,
    },

    51: {
      name: "QH",
      id: 51,
    },
    52: {
      name: "QS",
      id: 52,
    },
}

class App extends React.Component {
  videoRef = React.createRef();
  canvasRef = React.createRef();


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
          bbox: bbox
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
    const boxes = predictions[5].arraySync();
    const scores = predictions[3].arraySync();
    const classes = predictions[1].dataSync();
    const detections = this.buildDetectedObjects(scores, threshold,
                                    boxes, classes, classesDir);

    detections.forEach(item => {
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
      console.log(item["label"]+" "+(100*item["score"]).toFixed(2))
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(item["label"] + " " + (100*item["score"]).toFixed(2) + "%", x, y);
    });
  };

  render() {
    return (
      <div>
        <video
          style={{height: '500', width: "600px"}}
          className="size"
          autoPlay
          playsInline
          muted
          ref={this.videoRef}
          width="600"
          height="500"
          id="frame"
        />
        <canvas
          style={{height: '500', width: "600px"}}
          className="size"
          ref={this.canvasRef}
          width="600"
          height="500"
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
