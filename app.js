document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. Header Scroll Effect
       ========================================================================== */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       2. Mobile Menu & Drawer
       ========================================================================== */
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link, .btn-mobile-booking');

    function toggleMenu() {
        menuToggle.classList.toggle('open');
        mobileDrawer.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    }

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       3. Massage Menu Card Handlers
       ========================================================================== */
    const massageCards = document.querySelectorAll('.massage-card');

    massageCards.forEach(card => {
        const durationBtns = card.querySelectorAll('.duration-btn');
        const priceVal = card.querySelector('.price-val');
        
        durationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active class on duration buttons
                durationBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update price display
                const price = btn.getAttribute('data-price');
                priceVal.textContent = price;
            });
        });

        // Booking button in the card
        const bookBtn = card.querySelector('.btn-massage-book');
        if (bookBtn) {
            bookBtn.addEventListener('click', () => {
                const massageType = card.getAttribute('data-massage');
                const activeDurationBtn = card.querySelector('.duration-btn.active');
                const duration = activeDurationBtn.getAttribute('data-duration');

                // Pre-select in the booking widget
                selectMassageInForm(massageType, duration);

                // Scroll to booking section
                document.querySelector('#reservation').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    });

    /* ==========================================================================
       4. Booking Form Widget Logic
       ========================================================================== */
    // State of booking
    const bookingState = {
        massage: 'chinois',
        duration: 60,
        date: null,
        time: null,
        price: 75
    };

    // DOM Elements
    const stepCards = document.querySelectorAll('.booking-steps .step');
    const stepContents = document.querySelectorAll('.step-content');
    
    // Step 1 selectors
    const selectOptionCards = document.querySelectorAll('.select-option-card');
    const durationToggleBtns = document.querySelectorAll('.duration-toggle-btn');
    
    // Step Navigation buttons
    const btnNextTo2 = document.getElementById('btn-next-to-2');
    const btnBackTo1 = document.getElementById('btn-back-to-1');
    const btnNextTo3 = document.getElementById('btn-next-to-3');
    const btnBackTo2 = document.getElementById('btn-back-to-2');
    const bookingForm = document.getElementById('step-content-3');
    const btnRestart = document.getElementById('btn-restart-booking');

    // Massage Pricing mapping for booking widget
    const pricingMap = {
        chinois: { 60: 75, 90: 105 },
        thailandais: { 60: 80, 90: 110 },
        indien: { 60: 85, 90: 115 },
        japonais: { 60: 75, 90: 105 },
        royal: { 60: 95, 90: 135 }
    };

    const massageNamesMap = {
        chinois: 'Massage Chinois (Tui Na)',
        thailandais: 'Massage Thaïlandais',
        indien: 'Massage Indien (Ayurvédique)',
        japonais: 'Massage Japonais (Shiatsu)',
        royal: 'Massage Royal de l\'Asie'
    };

    function updateStatePrice() {
        bookingState.price = pricingMap[bookingState.massage][bookingState.duration];
    }

    function selectMassageInForm(type, duration) {
        // Update state
        bookingState.massage = type;
        bookingState.duration = parseInt(duration);
        updateStatePrice();

        // Update step 1 UI selection card
        selectOptionCards.forEach(card => {
            if (card.getAttribute('data-value') === type) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Update step 1 UI duration toggle
        durationToggleBtns.forEach(btn => {
            if (parseInt(btn.getAttribute('data-val')) === bookingState.duration) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Step 1 UI Click events
    selectOptionCards.forEach(card => {
        card.addEventListener('click', () => {
            selectOptionCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            bookingState.massage = card.getAttribute('data-value');
            updateStatePrice();
        });
    });

    durationToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            durationToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            bookingState.duration = parseInt(btn.getAttribute('data-val'));
            updateStatePrice();
        });
    });

    // Navigation triggers
    function navigateToStep(stepIndex) {
        // Update Step Trackers
        stepCards.forEach(card => {
            const cardStep = parseInt(card.getAttribute('data-step'));
            card.classList.remove('active', 'completed');
            if (cardStep === stepIndex) {
                card.classList.add('active');
            } else if (cardStep < stepIndex) {
                card.classList.add('completed');
            }
        });

        // Update Content visibility
        stepContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`step-content-${stepIndex}`).classList.add('active');
    }

    btnNextTo2.addEventListener('click', () => {
        // Initialize Calendar Days and Time Slots
        generateCalendarDays();
        bookingState.time = null; // reset time selection
        navigateToStep(2);
    });

    btnBackTo1.addEventListener('click', () => {
        navigateToStep(1);
    });

    btnNextTo3.addEventListener('click', () => {
        if (!bookingState.date) {
            alert('Veuillez sélectionner un jour pour votre rendez-vous.');
            return;
        }
        if (!bookingState.time) {
            alert('Veuillez sélectionner un créneau horaire pour votre rendez-vous.');
            return;
        }
        navigateToStep(3);
    });

    btnBackTo2.addEventListener('click', () => {
        navigateToStep(2);
    });

    // Calendar Generation
    const daysFrench = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
    const monthsFrench = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    function generateCalendarDays() {
        const container = document.getElementById('calendar-days');
        container.innerHTML = '';

        const today = new Date();
        
        // Generate next 7 days
        for (let i = 0; i < 7; i++) {
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + i);

            const dayName = daysFrench[futureDate.getDay()];
            const dayNum = futureDate.getDate();
            const isToday = i === 0;

            const dayCard = document.createElement('div');
            dayCard.classList.add('calendar-day-card');
            
            // Format state date representation
            const dateStr = `${dayName} ${dayNum} ${monthsFrench[futureDate.getMonth()]}`;
            
            if (bookingState.date === dateStr) {
                dayCard.classList.add('active');
            }

            dayCard.innerHTML = `
                <span class="day-name">${isToday ? "Auj." : dayName}</span>
                <span class="day-num">${dayNum}</span>
            `;

            dayCard.addEventListener('click', () => {
                document.querySelectorAll('.calendar-day-card').forEach(c => c.classList.remove('active'));
                dayCard.classList.add('active');
                bookingState.date = dateStr;
                
                // Regenerate time slots for the chosen day
                generateTimeSlots(futureDate);
            });

            container.appendChild(dayCard);

            // Auto-select first day
            if (i === 0 && !bookingState.date) {
                dayCard.classList.add('active');
                bookingState.date = dateStr;
                generateTimeSlots(futureDate);
            }
        }
    }

    // Time Slot Generation (Open 10:30 to 22:00, last session depends on duration)
    function generateTimeSlots(selectedDate) {
        const container = document.getElementById('time-slots');
        container.innerHTML = '';

        // Standard time slots: 10:30 to 21:00
        const slots = [
            '10h30', '11h30', '12h30', '13h30', '14h30', 
            '15h30', '16h30', '17h30', '18h30', '19h30', 
            '20h30', '21h00'
        ];

        // Filter out 21h00 if duration is 90 mins, because salon closes at 22:00
        const filteredSlots = bookingState.duration === 90 
            ? slots.filter(time => time !== '21h00') 
            : slots;

        // If selected day is TODAY, filter out past slots
        const now = new Date();
        const isToday = selectedDate.toDateString() === now.toDateString();
        
        filteredSlots.forEach(slot => {
            const [hours, minutes] = slot.replace('h', ':').split(':').map(Number);
            
            // Check if slot is in the past for today
            if (isToday) {
                const slotTime = new Date(selectedDate);
                slotTime.setHours(hours, minutes, 0, 0);
                if (slotTime <= now) {
                    return; // Skip past slots
                }
            }

            const slotBtn = document.createElement('div');
            slotBtn.classList.add('time-slot');
            slotBtn.textContent = slot;

            if (bookingState.time === slot) {
                slotBtn.classList.add('active');
            }

            slotBtn.addEventListener('click', () => {
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
                slotBtn.classList.add('active');
                bookingState.time = slot;
            });

            container.appendChild(slotBtn);
        });

        if (container.children.length === 0) {
            container.innerHTML = '<p class="text-muted" style="grid-column: span 4; font-size: 13px;">Plus de créneaux disponibles pour aujourd\'hui. Veuillez sélectionner un autre jour.</p>';
        }
    }

    // Form Submission & Success Screen
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Populate Recap Values
        document.getElementById('recap-massage').textContent = massageNamesMap[bookingState.massage];
        document.getElementById('recap-duration').textContent = `${bookingState.duration} minutes`;
        document.getElementById('recap-date').textContent = bookingState.date;
        document.getElementById('recap-time').textContent = bookingState.time.replace('h', ':');
        document.getElementById('recap-price').textContent = `${bookingState.price}€`;

        // Hide steps tracker during success
        document.querySelector('.booking-steps').style.display = 'none';

        // Hide form content and show success content
        document.getElementById('step-content-3').classList.remove('active');
        document.getElementById('step-content-success').classList.add('active');

        // Scroll recap smoothly into view
        document.querySelector('.booking-form-container').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Reset Booking
    btnRestart.addEventListener('click', () => {
        // Reset state
        bookingState.massage = 'chinois';
        bookingState.duration = 60;
        bookingState.date = null;
        bookingState.time = null;
        bookingState.price = 75;

        // Reset form inputs
        bookingForm.reset();

        // Reset steps display
        document.querySelector('.booking-steps').style.display = 'flex';
        
        // Return to step 1
        selectMassageInForm('chinois', 60);
        navigateToStep(1);
    });


    /* ==========================================================================
       5. Leaflet Map Stylization
       ========================================================================== */
    const mapCoordinates = [48.85714, 2.37596]; // 57 rue Sedaine, Paris 11
    
    // Initialize map
    const map = L.map('map', {
        center: mapCoordinates,
        zoom: 15,
        scrollWheelZoom: false, // Prevent zoom scroll when navigating page
        zoomControl: false // Custom controls or positioning
    });

    // Add Zoom Control at bottom right
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Using CartoDB Voyager tiles (very clean, light grey tiles)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Custom Icon for marker (designed to fit our Matcha/Gold Theme)
    const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
            <div class="marker-pin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
            </div>
            <div class="marker-pulse"></div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    // Add marker
    const marker = L.marker(mapCoordinates, { icon: customIcon }).addTo(map);
    
    // Custom popup
    marker.bindPopup(`
        <div class="map-popup-content">
            <h4 style="font-family: 'Cormorant Garamond', serif; font-size:16px; font-weight:600; margin-bottom: 2px; color: #f5f6f4;">Au Bien Être du Massage</h4>
            <p style="font-size:11px; margin-bottom: 6px; color: #9bb1a4;">57 rue Sedaine, 75011 Paris</p>
            <span style="font-size:10px; font-weight:600; color: #dfb271; text-transform: uppercase;">Nouvelle Ouverture</span>
        </div>
    `).openPopup();

    // Re-adjust center on window resize
    window.addEventListener('resize', () => {
        map.panTo(mapCoordinates);
    });
});
