/**
 * Estado da aplicação(state)
 */
inputRangeRed = null;
inputRangeGreen = null;
inputRangeBlue = null;

inputValueRed = null;
inputValueGreen = null;
inputValueBlue = null;

divColor = null;

window.addEventListener('load', () => {
  function setInputRange() {
    inputRangeRed = document.querySelector('#inputRangeRed');
    inputRangeRed.value = 0;
    inputRangeGreen = document.querySelector('#inputRangeGreen');
    inputRangeGreen.value = 0;
    inputRangeBlue = document.querySelector('#inputRangeBlue');
    inputRangeBlue.value = 0;
  }
  function setInputValue() {
    inputValueRed = document.querySelector('#inputValueRed');
    inputValueRed.value = inputRangeRed.value;
    inputValueGreen = document.querySelector('#inputValueGreen');
    inputValueGreen.value = inputRangeGreen.value;
    inputValueBlue = document.querySelector('#inputValueBlue');
    inputValueBlue.value = inputRangeBlue.value;
  }
  setInputRange();
  setInputValue();

  divColor = document.querySelector('#divColor');

  inputRangeRed.addEventListener('input', (event) => {
    inputValueRed.value = event.target.value;
    renderColor(
      inputRangeRed.value,
      inputRangeGreen.value,
      inputRangeBlue.value
    );
  });

  inputRangeGreen.addEventListener('input', (event) => {
    inputValueGreen.value = event.target.value;
    renderColor(
      inputRangeRed.value,
      inputRangeGreen.value,
      inputRangeBlue.value
    );
  });

  inputRangeBlue.addEventListener('input', (event) => {
    inputValueBlue.value = event.target.value;
    renderColor(
      inputRangeRed.value,
      inputRangeGreen.value,
      inputRangeBlue.value
    );
  });

  renderColor(inputRangeRed.value, inputRangeGreen.value, inputRangeBlue.value);
});

function renderColor(red, green, blue) {
  divColor.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
}
