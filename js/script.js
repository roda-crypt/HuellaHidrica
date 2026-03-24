// DOM Elements
const form = document.getElementById('waterForm');
const steps = document.querySelectorAll('.step');
const stepIndicators = document.querySelectorAll('.step-indicator');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('resultados');
const calculatorSection = document.getElementById('calculadora');
const downloadBtn = document.getElementById('downloadBtn');
const restartBtn = document.getElementById('restartBtn');
const shareBtn = document.getElementById('shareBtn');

// Current step tracking
let currentStep = 0;
let waterChart = null;
let userName = "";

// Range Inputs con actualización en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    
    rangeInputs.forEach(input => {
        const valueDisplay = document.getElementById(input.id + 'Value');
        const rangeContainer = input.closest('.range-container');
        
        // Crear barra de llenado si no existe
        let fillBar = rangeContainer.querySelector('.range-fill');
        
        // Función para actualizar el rango
        function updateRange() {
            const value = parseInt(input.value);
            const min = parseInt(input.min);
            const max = parseInt(input.max);
            const percentage = ((value - min) / (max - min)) * 100;
            
            // Actualizar el valor con animación
            if (valueDisplay) {
                // Añadir clase para animación
                valueDisplay.classList.add('changing');
                
                // Actualizar el valor
                valueDisplay.textContent = value;
                
                // Quitar clase después de la animación
                setTimeout(() => {
                    valueDisplay.classList.remove('changing');
                }, 300);
            }
            
            // Actualizar la barra de llenado
            fillBar.style.width = percentage + '%';
            
            // Cambiar color basado en el valor
            if (percentage < 33) {
                fillBar.style.background = 'linear-gradient(90deg, #4caf50, #66bb6a)';
            } else if (percentage < 66) {
                fillBar.style.background = 'linear-gradient(90deg, #ff9800, #ffa726)';
            } else {
                fillBar.style.background = 'linear-gradient(90deg, #f44336, #ef5350)';
            }
        }
        
        // Event listeners
        input.addEventListener('input', updateRange);
        input.addEventListener('change', updateRange);
        
        // Inicializar
        updateRange();
    });
});

// Update step indicators
function updateStepIndicators() {
    stepIndicators.forEach((indicator, index) => {
        indicator.classList.remove('active', 'completed');
        if (index === currentStep) {
            indicator.classList.add('active');
        } else if (index < currentStep) {
            indicator.classList.add('completed');
        }
    });
}

// Update steps function
function updateSteps() {
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === currentStep) {
            step.classList.add('active');
        }
    });

    // Update progress bar
    const progressPercentage = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = progressPercentage + "%";

    // Update step indicators
    updateStepIndicators();

    // Update buttons
    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-flex';
    
    if (currentStep === steps.length - 1) {
        nextBtn.innerHTML = 'Finalizar <i class="fas fa-check"></i>';
        nextBtn.classList.add('btn-success');
    } else {
        nextBtn.innerHTML = 'Siguiente <i class="fas fa-arrow-right"></i>';
        nextBtn.classList.remove('btn-success');
    }
}

// Next button
nextBtn.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateSteps();
        //window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        calculateBtn.click();
    }
});

// Previous button
prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateSteps();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Step indicator clicks
stepIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        if (index < currentStep || index === currentStep + 1) {
            currentStep = index;
            updateSteps();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// Calculate water footprint
calculateBtn.addEventListener('click', function() {

    userName = document.getElementById('userNameInput').value.trim();
    if (userName === '') {
        alert('Por favor ingresa tu nombre');
        this.disabled = false;
        this.innerHTML = '<i class="fas fa-calculator"></i> Calcular mi Huella Hídrica';
        return;
    }


    // Show loading state
    this.innerHTML = '<span class="loading"></span> Calculando...';
    this.disabled = true;
    
    setTimeout(() => {
        // Get form values
        const meat = parseInt(document.getElementById('meat').value);
        const dairy = parseInt(document.getElementById('dairy').value);
        const vegetables = parseInt(document.getElementById('vegetables').value);
        const fruits = parseInt(document.getElementById('fruits').value);
        
        const showers = parseInt(document.getElementById('showers').value);
        const toilet = parseInt(document.getElementById('toilet').value);
        const laundry = parseInt(document.getElementById('laundry').value);
        const dishwasher = parseInt(document.getElementById('dishwasher').value);
        
        const car = parseInt(document.getElementById('car').value);
        const publicTransport = parseInt(document.getElementById('publicTransport').value);
        const flights = parseInt(document.getElementById('flights').value);
        
        const clothing = parseInt(document.getElementById('clothing').value);
        const electronics = parseInt(document.getElementById('electronics').value);
        const paper = parseInt(document.getElementById('paper').value);
        
        // Calculate water usage (simplified calculations)
        const foodWater = (meat * 2400 + dairy * 1000 + vegetables * 300 + fruits * 300) / 7;
        const homeWater = (showers * 12 + toilet * 10 + laundry * 100 + dishwasher * 20) / 7;
        const transportWater = (car * 2.5 + publicTransport * 0.5 + flights * 15000 / 365);
        const consumptionWater = (clothing * 2700 + electronics * 15000 / 365 + paper * 10);
        
        const totalWater = Math.round(foodWater + homeWater + transportWater + consumptionWater);
        
        // Update results
        document.getElementById('totalWaterAmount').textContent = totalWater.toLocaleString();
        document.getElementById('foodWater').textContent = Math.round(foodWater).toLocaleString() + ' L/día';
        document.getElementById('homeWater').textContent = Math.round(homeWater).toLocaleString() + ' L/día';
        document.getElementById('transportWater').textContent = Math.round(transportWater).toLocaleString() + ' L/día';
        document.getElementById('consumptionWater').textContent = Math.round(consumptionWater).toLocaleString() + ' L/día';
        
        // Update comparison text
        const averageWater = 3800;
        const comparison = document.getElementById('waterComparison');
        if (totalWater < averageWater * 0.8) {
            comparison.textContent = `¡Excelente! Tu consumo es ${Math.round((1 - totalWater/averageWater) * 100)}% menor que el promedio mundial.`;
            comparison.style.color = '#4caf50';
        } else if (totalWater < averageWater * 1.2) {
            comparison.textContent = `Tu consumo está cerca del promedio mundial de ${averageWater.toLocaleString()} litros/día.`;
            comparison.style.color = '#ff9800';
        } else {
            comparison.textContent = `Tu consumo es ${Math.round((totalWater/averageWater - 1) * 100)}% mayor que el promedio mundial.`;
            comparison.style.color = '#f44336';
        }
        
        // Create or update chart
        createChart(Math.round(foodWater), Math.round(homeWater), Math.round(transportWater), Math.round(consumptionWater));
        
        // Show results section
        calculatorSection.style.display = 'none';
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Reset button
        this.innerHTML = '<i class="fas fa-calculator"></i> Calcular mi Huella Hídrica';
        this.disabled = false;
    }, 1500);
});

// Create chart
function createChart(food, home, transport, consumption) {
    const ctx = document.getElementById('waterChart').getContext('2d');
    
    if (waterChart) {
        waterChart.destroy();
    }
    
    waterChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Alimentación', 'Hogar', 'Transporte', 'Consumo'],
            datasets: [{
                data: [food, home, transport, consumption],
                backgroundColor: [
                    'rgba(255, 107, 107, 0.8)',
                    'rgba(78, 205, 196, 0.8)',
                    'rgba(247, 183, 49, 0.8)',
                    'rgba(95, 39, 205, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 107, 107, 1)',
                    'rgba(78, 205, 196, 1)',
                    'rgba(247, 183, 49, 1)',
                    'rgba(95, 39, 205, 1)'
                ],
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14,
                            family: "'Poppins', sans-serif"
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        size: 14,
                        weight: '600',
                        family: "'Poppins', sans-serif"
                    },
                    bodyFont: {
                        size: 13,
                        family: "'Poppins', sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = Math.round(context.raw);
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            label += `${value} L/día (${percentage}%)`;
                            return label;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Generate PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    
    const totalWater = document.getElementById('totalWaterAmount').textContent;
    const foodWater = document.getElementById('foodWater').textContent;
    const homeWater = document.getElementById('homeWater').textContent;
    const transportWater = document.getElementById('transportWater').textContent;
    const consumptionWater = document.getElementById('consumptionWater').textContent;
    
    doc.setTextColor(66, 66, 66);
    doc.setFontSize(12);
    doc.text(`Nombre: ${userName}`, 30, 58);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 30, 65);

    // HEADER WITH GRADIENT EFFECT
    doc.setFillColor(2, 136, 209);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add subtle gradient lines
    for(let i = 0; i < 5; i++) {
        doc.setFillColor(3, 169, 244);
        doc.setGState(new doc.GState({opacity: 0.1 - (i * 0.02)}));
        doc.rect(0, 40 - (i * 2), 210, 2, 'F');
    }
    doc.setGState(new doc.GState({opacity: 1}));
    
    // Logo and Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Calculadora de Huella Hídrica', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Reporte de Huella Hídrica', 105, 30, { align: 'center' });
    
    // USER INFO SECTION
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 50, 170, 30, 'F');
    
    doc.setTextColor(66, 66, 66);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Nombre: ${userName}`, 30, 58);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 30, 65);
    
    // MAIN RESULT WITH DESIGN
    doc.setFillColor(2, 136, 209);
    doc.roundedRect(20, 90, 170, 60, 10, 10, 'F');
    
    // Add water drop icon (simulated with circles)
    doc.setFillColor(255, 255, 255);
    doc.circle(50, 120, 15, 'F');
    doc.setFillColor(2, 136, 209);
    doc.circle(50, 125, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont(undefined, 'bold');
    doc.text(`${totalWater} L`, 105, 115, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text('litros por día', 105, 130, { align: 'center' });
    
    // COMPARISON SECTION
    doc.setTextColor(66, 66, 66);
    doc.setFontSize(11);
    doc.setFont(undefined, 'italic');
    const comparisonText = document.getElementById('waterComparison').textContent;
    const lines = doc.splitTextToSize(comparisonText, 160);
    doc.text(lines, 105, 165, { align: 'center' });
    
    // DETAILED BREAKDOWN SECTION
    doc.setFillColor(0, 188, 212);
    doc.rect(20, 180, 170, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Desglose por Categoría', 105, 187, { align: 'center' });
    
    // Category boxes with colors
    const categories = [
        { name: 'Alimentación', value: foodWater, color: [255, 107, 107] },
        { name: 'Hogar', value: homeWater, color: [78, 205, 196] },
        { name: 'Transporte', value: transportWater, color: [247, 183, 49] },
        { name: 'Consumo', value: consumptionWater, color: [95, 39, 205] }
    ];
    
    let yPos = 205;
    categories.forEach((cat, index) => {
        // Background box
        doc.setFillColor(...cat.color);
        doc.setGState(new doc.GState({opacity: 0.1}));
        doc.rect(30, yPos - 5, 150, 20, 'F');
        doc.setGState(new doc.GState({opacity: 1}));
        
        // Category name
        doc.setTextColor(66, 66, 66);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(cat.name, 40, yPos + 5);
        
        // Value
        doc.setTextColor(...cat.color);
        doc.setFont(undefined, 'bold');
        doc.text(cat.value, 160, yPos + 5, { align: 'right' });
        
        yPos += 25;
    });
    
    // TIPS SECTION
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, yPos, 170, 40, 10, 10, 'F');
    
    doc.setFillColor(3, 169, 244);
    doc.circle(35, yPos + 10, 5, 'F');
    
    doc.setTextColor(66, 66, 66);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Consejo Principal:', 50, yPos + 10);
    
    doc.setFont(undefined, 'normal');
    doc.setFont(undefined, 'italic');
    const tip = 'Reduce el tiempo de ducha y aumenta el consumo de vegetales locales para disminuir tu huella hídrica.';
    const tipLines = doc.splitTextToSize(tip, 140);
    doc.text(tipLines, 35, yPos + 20);
    
    // FOOTER
    doc.setFillColor(2, 136, 209);
    doc.rect(0, 280, 210, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('© 2026 Calculadora de Huella Hídrica - Protegiendo el agua, protegiendo el futuro', 105, 290, { align: 'center' });
    
    // Save the PDF
    doc.save(`huella_hidrica_${Date.now()}.pdf`);
}

// Download PDF Button
downloadBtn.addEventListener('click', function() {
    // Show loading state
    this.innerHTML = '<span class="loading"></span> Generando PDF...';
    this.disabled = true;
    
    setTimeout(() => {
        generatePDF();
        
        // Reset button state
        this.innerHTML = '<i class="fas fa-file-pdf"></i> Descargar PDF';
        this.disabled = false;
    }, 1500);
});

// Restart Button
restartBtn.addEventListener('click', function() {
    // Reset form
    form.reset();
    currentStep = 0;
    updateSteps();
    
    // Hide results, show calculator
    resultsSection.style.display = 'none';
    calculatorSection.style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset all range displays
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
        const valueDisplay = document.getElementById(input.id + 'Value');
        if (valueDisplay) {
            valueDisplay.textContent = input.value;
        }
    });
});

// Share Button
shareBtn.addEventListener('click', function() {
    const totalWater = document.getElementById('totalWaterAmount').textContent;
    const shareText = `¡Mi huella hídrica diaria es de ${totalWater} litros! Calcula la tuya en Calculadora de Huella Hídrica y ayuda a salvar el agua.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi Huella Hídrica - Calculadora de Huella Hídrica',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText + ' ' + window.location.href).then(() => {
            // Show success message
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
            this.classList.add('btn-success');
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('btn-success');
            }, 2000);
        });
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.querySelector('.nav');

mobileMenuBtn.addEventListener('click', function() {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    nav.style.position = 'absolute';
    nav.style.top = '100%';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = 'white';
    nav.style.flexDirection = 'column';
    nav.style.padding = '1rem';
    nav.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            nav.style.display = 'none';
        }
    });
});

// Smooth scroll for navigation links
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

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Show success message
        const originalButton = this.querySelector('button');
        const originalHTML = originalButton.innerHTML;
        originalButton.innerHTML = '<i class="fas fa-check"></i>';
        originalButton.disabled = true;
        
        setTimeout(() => {
            originalButton.innerHTML = originalHTML;
            originalButton.disabled = false;
            this.querySelector('input[type="email"]').value = '';
        }, 2000);
        
        console.log('Newsletter subscription:', email);
    });
}

// Initialize
updateSteps();

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
});

const userNameInput = document.getElementById('userNameInput');
const badge = document.getElementById('userBadge');
const badgeName = document.getElementById('badgeUserName');

userNameInput.addEventListener('input', function() {
    const name = this.value.trim();
    
    if (name !== '') {
        badge.style.display = 'flex';
        badgeName.textContent = name;
    } else {
        badge.style.display = 'none';
    }
});