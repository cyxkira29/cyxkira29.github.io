const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const button = document.getElementById('newQuoteBtn');
const copyBtn = document.getElementById('copyQuoteBtn');
const copyConfirm = document.getElementById('copyConfirm');
const shareFacebook = document.getElementById('shareFacebook');
const shareTwitter = document.getElementById('shareTwitter');

async function fetchQuote() {
    quoteElement.textContent = 'Loading quote...';
    authorElement.textContent = '';

    try {
        const response = await fetch('https://dummyjson.com/quotes');
        if (!response.ok) throw new Error('Failed to fetch quotes');

        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.quotes.length);
        const randomQuote = data.quotes[randomIndex];

        quoteElement.textContent = `"${randomQuote.quote}"`;
        authorElement.textContent = `- ${randomQuote.author}`;

    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteElement.textContent = 'Failed to load quote. Please try again.';
        authorElement.textContent = '';
    }
}

function copyQuote() {
    const quoteText = quoteElement.textContent;
    const authorText = authorElement.textContent;
    const fullQuote = `${quoteText} ${authorText}`;

    navigator.clipboard.writeText(fullQuote).then(() => {
        copyConfirm.style.display = 'block';
        setTimeout(() => {
            copyConfirm.style.display = 'none';
        }, 2000);
    }).catch(err => console.error('Failed to copy quote:', err));
}

button.addEventListener('click', fetchQuote);
copyBtn.addEventListener('click', copyQuote);
fetchQuote();
