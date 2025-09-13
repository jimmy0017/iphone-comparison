document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country');
    const modelSelect = document.getElementById('model');
    const storageSelect = document.getElementById('storage');
    const currencySelect = document.getElementById('currency');
    const resultDiv = document.getElementById('result');

    let data = [];

    fetch('prices.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            populateFilters();
            updateResult();
        });

    function populateFilters() {
        const countries = [...new Set(data.map(item => item['国家/地区']))];
        const models = [...new Set(data.map(item => item['型号']))];
        const storages = [...new Set(data.map(item => item['空间']))];

        populateSelect(countrySelect, countries);
        populateSelect(modelSelect, models);
        populateSelect(storageSelect, storages);
    }

    function populateSelect(selectElement, options) {
        options.forEach(option => {
            if (option) {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                selectElement.appendChild(optionElement);
            }
        });
    }

    function updateResult() {
        const selectedCountry = countrySelect.value;
        const selectedModel = modelSelect.value;
        const selectedStorage = storageSelect.value;
        const selectedCurrency = currencySelect.value;

        const result = data.find(item => 
            item['国家/地区'] === selectedCountry &&
            item['型号'] === selectedModel &&
            item['空间'] === selectedStorage
        );

        if (result) {
            const localPrice = result['价格（税前）'];
            const localCurrency = result['货币'];
            const convertedPrice = selectedCurrency === 'USD' ? result['价格（美金）'] : result['价格（人民币）'];

            let resultHTML = `<h2>${result['型号']} - ${result['空间']}</h2>`;
            resultHTML += `<p><strong>Local Price:</strong> ${localCurrency} ${localPrice}</p>`;
            resultHTML += `<p><strong>Price (Before Tax):</strong> ${result['价格（税前）']}</p>`;
            resultHTML += `<p><strong>Converted Price:</strong> ${convertedPrice}</p>`;
            resultHTML += '<ul>';
            for (const key in result) {
                if (key !== '型号' && key !== '空间' && key !== '价格（美金）' && key !== '价格（人民币）' && key !== '价格（税前）' && key !== '货币') {
                    resultHTML += `<li><strong>${key}:</strong> ${result[key]}</li>`;
                }
            }
            resultHTML += '</ul>';
            resultDiv.innerHTML = resultHTML;
        } else {
            resultDiv.innerHTML = '<p>No data found for the selected combination.</p>';
        }
    }

    countrySelect.addEventListener('change', updateResult);
    modelSelect.addEventListener('change', updateResult);
    storageSelect.addEventListener('change', updateResult);
    currencySelect.addEventListener('change', updateResult);
});
