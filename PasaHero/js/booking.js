
// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNav');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Payment method selection
function selectPayment(method) {
    // Update active state
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Update hidden field
    document.getElementById('paymentMethod').value = method;
    
    // Show/hide fields and reset validation
    document.getElementById('creditCardFields').style.display = 'none';
    document.getElementById('paypalFields').style.display = 'none';
    document.getElementById('gcashFields').style.display = 'none';
    
    // Remove required attributes from all payment method fields
    const creditCardInputs = document.querySelectorAll('#creditCardFields input, #creditCardFields select');
    const gcashInputs = document.querySelectorAll('#gcashFields input');
    
    creditCardInputs.forEach(input => input.removeAttribute('required'));
    gcashInputs.forEach(input => input.removeAttribute('required'));
    
    if (method === 'credit') {
        document.getElementById('creditCardFields').style.display = 'block';
        // Add required attribute to credit card fields
        creditCardInputs.forEach(input => input.setAttribute('required', 'required'));
    } else if (method === 'paypal') {
        document.getElementById('paypalFields').style.display = 'block';
    } else if (method === 'gcash') {
        document.getElementById('gcashFields').style.display = 'block';
        // Add required attribute to GCash fields
        gcashInputs.forEach(input => input.setAttribute('required', 'required'));
    }
}

// Update booking summary
function updateSummary() {
    const destination = document.getElementById('destination').value || '-';
    const package = document.getElementById('package').value || '-';
    const checkIn = document.getElementById('checkIn').value || '-';
    const checkOut = document.getElementById('checkOut').value || '-';
    const adults = document.getElementById('adults').value || '0';
    const children = document.getElementById('children').value || '0';
    
    // Calculate duration
    let duration = '-';
    if (checkIn && checkOut) {
        const date1 = new Date(checkIn);
        const date2 = new Date(checkOut);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        duration = `${diffDays} days`;
    }
    
    // Calculate total
    let total = 0;
    if (package === 'basic') {
        total = 3000 * parseInt(adults) + 1500 * parseInt(children);
    } else if (package === 'standard') {
        total = 4500 * parseInt(adults) + 2250 * parseInt(children);
    } else if (package === 'premium') {
        total = 6000 * parseInt(adults) + 3000 * parseInt(children);
    }
    
    // Update summary
    document.getElementById('summaryPackage').textContent = package.charAt(0).toUpperCase() + package.slice(1);
    document.getElementById('summaryDuration').textContent = duration;
    document.getElementById('summaryTravelers').textContent = `${adults} adult(s), ${children} child(ren)`;
    document.getElementById('summaryTotal').textContent = `₱${total.toLocaleString()}.00`;
}

// Add event listeners for summary updates
document.getElementById('destination').addEventListener('change', updateSummary);
document.getElementById('package').addEventListener('change', updateSummary);
document.getElementById('checkIn').addEventListener('change', updateSummary);
document.getElementById('checkOut').addEventListener('change', updateSummary);
document.getElementById('adults').addEventListener('change', updateSummary);
document.getElementById('children').addEventListener('change', updateSummary);

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Reset previous validation
        form.classList.remove('was-validated');
        
        // Custom validation for payment methods
        const paymentMethod = document.getElementById('paymentMethod').value;
        let paymentValid = true;
        
        if (paymentMethod === 'credit') {
            const creditInputs = document.querySelectorAll('#creditCardFields input, #creditCardFields select');
            creditInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    paymentValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });
        } else if (paymentMethod === 'gcash') {
            const gcashInput = document.getElementById('gcashNumber');
            if (!gcashInput.value.trim()) {
                gcashInput.classList.add('is-invalid');
                paymentValid = false;
            } else {
                gcashInput.classList.remove('is-invalid');
            }
        }
        
        // Check form validity
        if (form.checkValidity() && paymentValid) {
            // Generate random booking reference
            const bookingRef = Math.floor(1000 + Math.random() * 9000);
            document.getElementById('bookingRef').textContent = bookingRef;
            
            // Hide form and show success message
            form.style.display = 'none';
            document.getElementById('bookingSuccess').style.display = 'block';
            
            // In a real application, you would submit the form data to a server here
            // For demonstration, we're just showing the success message
        } else {
            form.classList.add('was-validated');
        }
    }, false);

    // Dynamically add/remove validation on payment method change
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Reset validation classes
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.classList.remove('is-invalid');
            });
        });
    });
});

// Initialize summary
updateSummary();

// Initialize first payment method
selectPayment('credit');
