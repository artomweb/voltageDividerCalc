function convertToInt(s) {
  // console.log(s);
  let indexOfK = s.indexOf("k");
  if (indexOfK !== -1) {
    s = parseFloat(s.replace("k", "."));
    return parseInt(s * 1000);
  }

  let indexOfM = s.indexOf("M");
  if (indexOfM !== -1) {
    s = parseFloat(s.replace("M", "."));
    return parseInt(s * 1000000);
  }

  return parseInt(s);
}

function convertToString(intValue) {
  if (intValue >= 1000) {
    let result = (intValue / 1000).toString();
    if (result.includes(".")) {
      return result.replace(".", "k");
    } else {
      return result + "k";
    }
  } else if (intValue >= 1000000) {
    let result = (intValue / 1000000).toString();
    if (result.includes(".")) {
      return result.replace(".", "M");
    } else {
      return result + "k";
    }
  } else {
    return intValue.toString();
  }
}

function removeDuplicates(array) {
  return array.filter((pair, index) => {
    return index === array.findIndex((item) => item[0] === pair[0] && item[1] === pair[1]);
  });
}

document.getElementById("calcForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  var inputVoltage = parseFloat(document.getElementById("inputVoltage").value);
  var outputVoltage = parseFloat(document.getElementById("outputVoltage").value);
  var minResistance = parseFloat(document.getElementById("minResistance").value) || 0;
  console.log(inputVoltage, outputVoltage, minResistance);
  var values = document
    .getElementById("resistorValues")
    .value.split("\n")
    .filter((line) => line.trim() !== "")
    .map(convertToInt)
    .filter((int) => !isNaN(int));

  // Calculate
  var valToFind = outputVoltage / inputVoltage;

  console.log(valToFind);

  let errors = [];

  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values.length; j++) {
      let thisRatio = values[i] / (values[i] + values[j]);
      let error = thisRatio - valToFind;
      if (values[i] + values[j] > minResistance) {
        errors.push([convertToString(values[j]), convertToString(values[i]), error]);
      }
      // absErrors.push([values[i], values[j], absError]);
    }
  }

  console.log(errors);

  let sortedValues = errors.slice().sort((a, b) => Math.abs(a[2]) - Math.abs(b[2]));

  sortedValues = removeDuplicates(sortedValues);

  for (let i = 0; i < 10; i++) {
    console.log(sortedValues[i]);
  }

  let resultTable = document.querySelector("#resultTable");
  let resultTableBody = document.createElement("tbody");
  let resultTableHead = document.createElement("thead");
  let resultTableHeaderRow = document.createElement("tr");

  resultTable.innerHTML = "";

  let cell1 = document.createElement("th");
  let cell2 = document.createElement("th");
  let cell3 = document.createElement("th");
  cell1.textContent = "R1";
  cell2.textContent = "R2";
  cell3.textContent = "Error";
  resultTableHeaderRow.appendChild(cell1);
  resultTableHeaderRow.appendChild(cell2);
  resultTableHeaderRow.appendChild(cell3);

  resultTableHead.appendChild(resultTableHeaderRow);

  resultTable.appendChild(resultTableHead);

  resultTable.appendChild(resultTableBody);

  // Display only the first 10 values
  for (let i = 0; i < 10; i++) {
    let row = resultTableBody.insertRow();
    for (let j = 0; j < 3; j++) {
      let cell = row.insertCell(j);
      cell.textContent = sortedValues[i][j];
    }
  }

  // Display result
  // var resultDiv = document.getElementById("result");
  // resultDiv.innerHTML = "<p>Value to Find: " + valToFind + "</p>";

  console.log(valToFind);

  // Perform further calculations using resistor values
  console.log("Resistor Values:", values);
});
