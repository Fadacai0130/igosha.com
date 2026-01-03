// Animation on scroll - IntersectionObserver setup
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Investment Calculator Functionality
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Calculate on button click
    calculateBtn.addEventListener('click', calculateInvestment);
    
    // Calculate on Enter key in input fields
    const inputs = document.querySelectorAll('.calculator-form input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateInvestment();
            }
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initial calculation on page load
    calculateInvestment();
    
    // Set up scroll animations for cards
    const cards = document.querySelectorAll('.benefit-card, .strategy-card, .step');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

function calculateInvestment() {
    // Get input values
    const initialInvestment = parseFloat(document.getElementById('initial-investment').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
    const years = parseFloat(document.getElementById('years').value) || 0;
    const annualRate = parseFloat(document.getElementById('rate').value) || 0;
    
    // Convert annual rate to monthly rate
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    // Calculate future value using compound interest formula
    // FV = P(1 + r)^n + PMT * [((1 + r)^n - 1) / r]
    let futureValue = initialInvestment * Math.pow(1 + monthlyRate, months);
    
    if (monthlyRate > 0) {
        futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else {
        // If rate is 0, just add up contributions
        futureValue = initialInvestment + (monthlyContribution * months);
    }
    
    // Calculate total contributions
    const totalContributions = initialInvestment + (monthlyContribution * months);
    
    // Calculate interest earned
    const totalInterest = futureValue - totalContributions;
    
    // Update results
    document.getElementById('total-contributions').textContent = formatCurrency(totalContributions);
    document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
    document.getElementById('final-balance').textContent = formatCurrency(futureValue);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}
