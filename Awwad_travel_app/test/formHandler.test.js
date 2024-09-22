// Mock the DOM elements used in the function
document.body.innerHTML = `
  <input id="input_city" />
  <input id="input_date" />
  <div id="exp_city"></div>
  <div id="date_error"></div>
`;

// Mocking remdays function
const remdays = jest.fn();

// Accessing DOM elements
const input_city = document.getElementById("input_city");
const input_date = document.getElementById("input_date");
const exp_city = document.getElementById("exp_city");
const date_error = document.getElementById("date_error");

// The function to test
const validate_inputs = () => {
  exp_city.style.display = "none";
  date_error.style.display = "none";
  if (input_city.value == 0) {
    exp_city.innerHTML = `Enter the city`;
    exp_city.style.display = "block";
    return;
  }
  if (input_date.value == 0) {
    date_error.innerHTML = `Enter the date`;
    date_error.style.display = "block";
    return;
  }
  if (remdays(input_date.value) < 0) {
    date_error.innerHTML = `enter coming date`;
    date_error.style.display = "block";
    return;
  }
  exp_city.style.display = "none";
  date_error.style.display = "none";

  return true;
};

describe('validate_inputs', () => {
  beforeEach(() => {
    // Reset DOM elements and mocks before each test
    input_city.value = '';
    input_date.value = '';
    exp_city.style.display = 'none';
    date_error.style.display = 'none';
    remdays.mockClear();
  });

  test('should display city error when input_city is empty', () => {
    input_city.value = '';
    validate_inputs();

    expect(exp_city.style.display).toBe('block');
    expect(exp_city.innerHTML).toBe('Enter the city');
    expect(date_error.style.display).toBe('none');
  });

  test('should display date error when input_date is empty', () => {
    input_city.value = 'New York';
    input_date.value = '';
    validate_inputs();

    expect(date_error.style.display).toBe('block');
    expect(date_error.innerHTML).toBe('Enter the date');
    expect(exp_city.style.display).toBe('none');
  });

  test('should display future date error when remdays returns a negative value', () => {
    input_city.value = 'New York';
    input_date.value = '2023-09-01';
    remdays.mockReturnValue(-1); // Mock remdays to return a negative value

    validate_inputs();

    expect(date_error.style.display).toBe('block');
    expect(date_error.innerHTML).toBe('enter coming date');
    expect(exp_city.style.display).toBe('none');
  });

  test('should pass validation when all inputs are correct', () => {
    input_city.value = 'New York';
    input_date.value = '2024-10-01';
    remdays.mockReturnValue(10); // Mock remdays to return a positive value

    const result = validate_inputs();

    expect(result).toBe(true);
    expect(exp_city.style.display).toBe('none');
    expect(date_error.style.display).toBe('none');
  });
});
