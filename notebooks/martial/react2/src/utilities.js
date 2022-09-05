// Define our labelmap
const labelMap = {
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

// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx)=>{
    for(let i=0; i<=boxes.length; i++){
        if(boxes[i] && classes[i] && scores[i]>threshold){
            // Extract variables
            const [y,x,height,width] = boxes[i]
            const text = classes[i]
            console.log(boxes[i])
            // Set styling
            ctx.strokeStyle = labelMap[text]
            ctx.lineWidth = 5
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'         
            
            // DRAW!!
            ctx.beginPath()
            ctx.fillText(labelMap[text]["name"] + ' - ' + Math.round(scores[i]*100)/100, x*imgWidth, y*imgHeight-10)
            ctx.rect(x*imgWidth, y*imgHeight, (width-x)*imgWidth, (height-y)*imgHeight);
            ctx.stroke()
        }
    }
}