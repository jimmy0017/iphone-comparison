document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country');
    const modelSelect = document.getElementById('model');
    const storageSelect = document.getElementById('storage');
    const currencySelect = document.getElementById('currency');
    const resultDiv = document.getElementById('result');

    let data = [];
    let rates = {};
    let countryChoices, modelChoices, storageChoices;
    let dataTable;

    Promise.all([
        fetch('prices.json').then(response => response.json()),
        fetch('rates.json').then(response => response.json())
    ]).then(([jsonData, ratesData]) => {
        data = jsonData;
        rates = ratesData;
        populateFilters();
        initChoices();
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

    function initChoices() {
        const choicesOptions = {
            removeItemButton: true,
        };
        countryChoices = new Choices(countrySelect, choicesOptions);
        modelChoices = new Choices(modelSelect, choicesOptions);
        storageChoices = new Choices(storageSelect, choicesOptions);

        countrySelect.addEventListener('change', updateResult);
        modelSelect.addEventListener('change', updateResult);
        storageSelect.addEventListener('change', updateResult);
    }

    function updateResult() {
        const selectedCountries = countryChoices.getValue(true);
        const selectedModels = modelChoices.getValue(true);
        const selectedStorages = storageChoices.getValue(true);
        const selectedCurrency = currencySelect.value;

        const results = data.filter(item =>
            (selectedCountries.length === 0 || selectedCountries.includes(item['国家/地区'])) &&
            (selectedModels.length === 0 || selectedModels.includes(item['型号'])) &&
            (selectedStorages.length === 0 || selectedStorages.includes(item['空间']))
        );

        if (dataTable) {
            dataTable.destroy();
        }

        if (results.length > 0) {
            const headers = Object.keys(results[0]).filter(header => header !== '价格（美金）' && header !== '价格（人民币）' && header !== '货币');
            const priceIndex = headers.indexOf('价格（税前）');
            const displayHeaders = [...headers];
            if (priceIndex !== -1) {
                displayHeaders.splice(priceIndex + 1, 0, 'Price');
            } else {
                displayHeaders.push('Price');
            }

            let tableHTML = '<table id="pricesTable" class="table table-striped table-bordered">';
            tableHTML += '<thead class="table-dark">';
            tableHTML += '<tr>';
            displayHeaders.forEach(header => {
                tableHTML += `<th>${header}</th>`;
            });
            tableHTML += '</tr></thead>';
            tableHTML += '<tbody>';
            results.forEach((result, index) => {
                tableHTML += '<tr>';
                displayHeaders.forEach(header => {
                    if (header === '价格（税前）') {
                        tableHTML += `<td>${result['货币']} ${result[header]}</td>`;
                    } else if (header === 'Price') {
                        const localPrice = parseFloat(String(result['价格（税前）']).replace(/,/g, ''));
                        const localCurrency = result['货币'];
                        if (rates[localCurrency] && rates[selectedCurrency] && !isNaN(localPrice)) {
                            const priceInUSD = localPrice * rates[localCurrency];
                            const convertedPrice = priceInUSD / rates[selectedCurrency];
                            tableHTML += `<td>${selectedCurrency} ${convertedPrice.toFixed(2)}</td>`;
                        } else {
                            tableHTML += `<td>N/A</td>`;
                        }
                    } else if (header === '基础频段（相较美国）') {
                        const collapseId = `collapse-${index}`;
                        tableHTML += `<td>`;
                        tableHTML += `<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">`;
                        tableHTML += `Show/Hide`;
                        tableHTML += `</button>`;
                        tableHTML += `<div class="collapse" id="${collapseId}">`;
                        tableHTML += result[header];
                        tableHTML += `</div>`;
                        tableHTML += `</td>`;
                    } else {
                        tableHTML += `<td>${result[header]}</td>`;
                    }
                });
                tableHTML += '</tr>';
            });
            tableHTML += '</tbody></table>';
            resultDiv.innerHTML = tableHTML;

            dataTable = new DataTable('#pricesTable', {
                paging: true,
                searching: true,
                ordering: true
            });
        } else {
            resultDiv.innerHTML = '<p>No data found for the selected combination.</p>';
        }
    }

    currencySelect.addEventListener('change', updateResult);
});
