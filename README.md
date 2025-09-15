# iPhone Price Comparison

This project is a simple webpage that compares the prices of iPhones in different countries. The prices are taken from the official Apple website and are updated regularly. The exchange rates are also updated regularly.

## How to Contribute

Contributions are welcome! Please follow these steps to contribute:

1.  **Fork the repository.**
2.  **Create a new branch.**
3.  **Make your changes.**
    *   **To add or update iPhone prices:**
        *   Edit the `prices.json` file.
        *   The file is an array of JSON objects, where each object represents an iPhone model in a specific country.
        *   Please ensure that the data you add is accurate and from the official Apple website.
    *   **To update exchange rates:**
        *   Edit the `rates.json` file.
        *   The file is a JSON object where the keys are the currency codes and the values are the exchange rates to USD.
        *   Please use a reliable source for the exchange rates.
4.  **Create a pull request.**

## File Structure

*   `index.html`: The main HTML file.
*   `style.css`: The CSS file for styling the webpage.
*   `script.js`: The JavaScript file for the webpage's functionality.
*   `prices.json`: The JSON file containing the iPhone prices.
*   `rates.json`: The JSON file containing the exchange rates.

## Running the Project

To run the project locally, you can use a simple HTTP server. For example, if you have Python installed, you can run the following command in the project directory:

```bash
python -m http.server
```

Then, open your web browser and go to `http://localhost:8000`.
