const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const calculateButton = document.getElementById('calculateButton');
const resultParagraph = document.getElementById('result');

calculateButton.addEventListener('click', () => {
    const startDateValue = startDateInput.value;
    const endDateValue = endDateInput.value;

    if (!startDateValue || !endDateValue) {
        resultParagraph.textContent = 'Please select both start and end dates.';
        return;
    }

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    if (endDate < startDate) {
        resultParagraph.textContent = 'End date must be after start date.';
        return;
    }

    const timeDifference = endDate - startDate; // Difference in milliseconds
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert to days

    resultParagraph.textContent = `The difference is ${dayDifference} days.`;
});