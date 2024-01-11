let data;

let months;

let zeroRadius = 125;
let oneRadius = 200;

let currentRow = 1;
let currentMonth = 0;

let previousAnomaly = 0;

let startYear = 1880;
let endYear = 2023; 

let startYearInput;
let endYearInput;

function preload() {
  data = loadTable("temperatures_data.csv", "csv", "header");
}

function setup() {
  createCanvas(600, 600);
  months = ["Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];
  // let row = data.getRow(0);
  let startYearInput = document.getElementById("startYear");
  let endYearInput = document.getElementById("endYear");
  currentRow = findRowIndex(startYear);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  textAlign(CENTER, CENTER);
  textSize(16);
  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, zeroRadius * 2);
  fill(255);
  noStroke();
  text("0°", zeroRadius + 10, 0);

  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, oneRadius * 2);
  fill(255);
  noStroke();
  text("1°", oneRadius + 10, 0);

  stroke(255);
  strokeWeight(2);
  noFill();
  circle(0, 0, 500);

  for (let i = 0; i < months.length; i++) {
    noStroke();
    fill(255);
    textSize(24);
    let angle = map(i, 0, months.length, 0, TWO_PI);
    push();
    let x = 264 * cos(angle);
    let y = 264 * sin(angle);
    translate(x, y);
    rotate(angle + PI / 2);
    text(months[i], 0, 0);
    pop();
  }

  let year = data.getRow(currentRow).get("Year");
  textSize(32);
  text(year, 0, 0);

  noFill();
  stroke(255);
  let firstValue = true;
  for (let j = 0; j < currentRow; j++) {
    let row = data.getRow(j);

    let totalMonths = months.length;
    if (j == currentRow - 1) {
      totalMonths = currentMonth;
    }

    for (let i = 0; i < totalMonths; i++) {
      let anomaly = row.get(months[i]);

      
        anomaly = parseFloat(anomaly);
        let angle = map(i, 0, months.length, 0, TWO_PI) - PI / 3;
        let pr = map(previousAnomaly, 0, 1, zeroRadius, oneRadius);
        let r = map(anomaly, 0, 1, zeroRadius, oneRadius);

        let x1 = r * cos(angle);
        let y1 = r * sin(angle);
        let x2 = pr * cos(angle - PI / 6);
        let y2 = pr * sin(angle - PI / 6);

        if (!firstValue) {
          let avg = (anomaly + previousAnomaly) * 0.5;
          let cold = color(0, 0, 255);
          let warm = color(255, 0, 0);
          let zero = color(255);
          let lineColor = zero;
          if (avg < 0) {
            lineColor = lerpColor(zero, cold, abs(avg));
          } else {
            lineColor = lerpColor(zero, warm, abs(avg));
          }

          stroke(lineColor);

          if (j >= startYear - 1880){
            line(x1, y1, x2, y2);
          }
          // line(x1, y1, x2, y2);
        }
        firstValue = false;
        previousAnomaly = anomaly;
      
    }
  }

  if (currentRow >= findRowIndex(startYear) && currentRow < findRowIndex(endYear)) {
    currentMonth = currentMonth + 1;
    if (currentMonth == months.length) {
      currentMonth = 0;
      currentRow = currentRow + 1;
    }
  } else {
    if (currentRow < findRowIndex(startYear)) {
      currentRow = findRowIndex(startYear);
    } else {
      noLoop();  // Stop the loop when reaching the endYear
    }
  }
}

function updateYears() {
  // Get values from input fields
  let newStartYear = parseInt(document.getElementById("startYear").value);
  let newEndYear = parseInt(document.getElementById("endYear").value);

  // Validate input and update years
  if (newStartYear < 1880 || newStartYear > 2023 || newEndYear < 1880 || newEndYear > 2023){
    alert("Invalid input. Please enter valid years.");
  }
  if (!isNaN(newStartYear) && !isNaN(newEndYear) && newStartYear <= newEndYear) {
      startYear = newStartYear;
      endYear = newEndYear;

      // Reset animation
      currentRow = findRowIndex(startYear);
      loop();  // Start or resume the animation
  } else {
      alert("Invalid input. Please enter valid years.");
  }
}

function findRowIndex(year) {
  for (let i = 0; i < data.getRowCount(); i++) {
    let rowYear = int(data.getRow(i).get("Year"));
    if (rowYear >= year) {
      return i;
    }
  }
  return data.getRowCount() - 1;  // Default to the last row if year is not found
}