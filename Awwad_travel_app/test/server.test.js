const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const fetchCityLocation = jest.fn(); // Mocking the fetchCityLocation function

// Updated route with error handling for missing city and server errors
app.post("/fetchCityLocation", async (req, res) => {
  try {
    const the_city = req.body.city;
    if (!the_city) {
      return res.status(400).send({ error: "City is required" });
    }
    const city_location = await fetchCityLocation(the_city, "ready_username");
    return res.send(city_location);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

describe('POST /fetchCityLocation', () => {
  beforeEach(() => {
    fetchCityLocation.mockClear(); // Clear mock before each test
  });

  test('should return city location when valid city is passed', async () => {
    const mockLocation = { lat: 40.7128, lon: -74.0060 }; // Mock NYC location
    fetchCityLocation.mockResolvedValue(mockLocation); // Mock resolved value

    const response = await request(app)
      .post('/fetchCityLocation')
      .send({ city: 'New York' });

    expect(fetchCityLocation).toHaveBeenCalledWith('New York', 'ready_username');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockLocation);
  });

  test('should return an error if city is not provided', async () => {
    const response = await request(app)
      .post('/fetchCityLocation')
      .send({}); // Empty body

    expect(response.statusCode).toBe(400); // Expect 400 Bad Request for missing city
    expect(response.body).toEqual({ error: "City is required" });
    expect(fetchCityLocation).not.toHaveBeenCalled();
  });

  test('should handle errors from fetchCityLocation', async () => {
    // Simulate fetchCityLocation throwing an error
    fetchCityLocation.mockRejectedValueOnce(new Error('Failed to fetch location'));

    const response = await request(app)
      .post('/fetchCityLocation')
      .send({ city: 'InvalidCity' });

    expect(response.statusCode).toBe(500); // Expect 500 Internal Server Error
    expect(response.body).toEqual({ error: 'Failed to fetch location' });
  });
});
