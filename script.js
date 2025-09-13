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
        const allOption = document.createElement('option');
        allOption.value = 'All';
        allOption.textContent = 'All';
        selectElement.appendChild(allOption);

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

        const results = data.filter(item => 
            (selectedCountry === 'All' || item['国家/地区'] === selectedCountry) &&
            (selectedModel === 'All' || item['型号'] === selectedModel) &&
            (selectedStorage === 'All' || item['空间'] === selectedStorage)
        );

        if (results.length > 0) {
            const headers = Object.keys(results[0]);
            let tableHTML = '<table>';
            tableHTML += '<thead><tr>';
            headers.forEach(header => {
                tableHTML += `<th>${header}</th>`;
            });
            tableHTML += '</tr></thead>';
            tableHTML += '<tbody>';
            results.forEach(result => {
                tableHTML += '<tr>';
                headers.forEach(header => {
                    tableHTML += `<td>${result[header]}</td>`;
                });
                tableHTML += '</tr>';
            });
            tableHTML += '</tbody></table>';
            resultDiv.innerHTML = tableHTML;
        } else {
            resultDiv.innerHTML = '<p>No data found for the selected combination.</p>';
        }
    }

    countrySelect.addEventListener('change', updateResult);
    modelSelect.addEventListener('change', updateResult);
    storageSelect.addEventListener('change', updateResult);
    currencySelect.addEventListener('change', updateResult);
});
