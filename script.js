/**
 * Minimalist BMI Calculator Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    const state = {
        unit: 'metric', // 'metric' | 'imperial'
        heightCm: 175,
        heightFt: 5,
        heightIn: 9,
        weightKg: 70,
        weightLbs: 154,
        age: 28,
        gender: 'male'
    };

    // DOM Elements
    const elements = {
        unitToggle: document.getElementById('unitToggle'),
        unitBtns: document.querySelectorAll('.unit-btn'),
        metricFields: document.querySelectorAll('.metric-field'),
        imperialFields: document.querySelectorAll('.imperial-field'),

        heightCmInput: document.getElementById('heightCmInput'),
        heightCmSlider: document.getElementById('heightCmSlider'),
        heightFtInput: document.getElementById('heightFtInput'),
        heightInInput: document.getElementById('heightInInput'),

        weightKgInput: document.getElementById('weightKgInput'),
        weightKgSlider: document.getElementById('weightKgSlider'),
        weightLbsInput: document.getElementById('weightLbsInput'),
        weightLbsSlider: document.getElementById('weightLbsSlider'),

        ageInput: document.getElementById('ageInput'),
        genderSelect: document.getElementById('genderSelect'),

        bmiValue: document.getElementById('bmiValue'),
        categoryBadge: document.getElementById('categoryBadge'),
        scalePointer: document.getElementById('scalePointer'),
        idealWeight: document.getElementById('idealWeight'),
        statusSummary: document.getElementById('statusSummary')
    };

    /* --------------------------------------------------------------------------
       Unit Switcher
       -------------------------------------------------------------------------- */
    elements.unitToggle.addEventListener('click', (e) => {
        const btn = e.target.closest('.unit-btn');
        if (!btn) return;

        const newUnit = btn.dataset.unit;
        if (newUnit === state.unit) return;

        state.unit = newUnit;

        elements.unitBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (state.unit === 'metric') {
            elements.metricFields.forEach(f => f.classList.remove('hidden'));
            elements.imperialFields.forEach(f => f.classList.add('hidden'));

            // Sync from Imperial to Metric
            const totalInches = (state.heightFt * 12) + state.heightIn;
            state.heightCm = Math.round(totalInches * 2.54);
            state.weightKg = Math.round((state.weightLbs / 2.20462) * 10) / 10;

            elements.heightCmInput.value = state.heightCm;
            elements.heightCmSlider.value = state.heightCm;
            elements.weightKgInput.value = state.weightKg;
            elements.weightKgSlider.value = state.weightKg;
        } else {
            elements.metricFields.forEach(f => f.classList.add('hidden'));
            elements.imperialFields.forEach(f => f.classList.remove('hidden'));

            // Sync from Metric to Imperial
            const totalInches = state.heightCm / 2.54;
            state.heightFt = Math.floor(totalInches / 12);
            state.heightIn = Math.round(totalInches % 12);
            if (state.heightIn === 12) {
                state.heightFt += 1;
                state.heightIn = 0;
            }
            state.weightLbs = Math.round(state.weightKg * 2.20462);

            elements.heightFtInput.value = state.heightFt;
            elements.heightInInput.value = state.heightIn;
            elements.weightLbsInput.value = state.weightLbs;
            elements.weightLbsSlider.value = state.weightLbs;
        }

        calculate();
    });

    /* --------------------------------------------------------------------------
       Inputs Event Synchronization
       -------------------------------------------------------------------------- */
    // Height Cm
    function updateHeightCm(val) {
        val = Math.max(90, Math.min(230, parseInt(val) || 175));
        state.heightCm = val;
        elements.heightCmInput.value = val;
        elements.heightCmSlider.value = val;
        calculate();
    }
    elements.heightCmInput.addEventListener('input', (e) => updateHeightCm(e.target.value));
    elements.heightCmSlider.addEventListener('input', (e) => updateHeightCm(e.target.value));

    // Height Feet & Inches
    function updateImperialHeight() {
        state.heightFt = Math.max(2, Math.min(8, parseInt(elements.heightFtInput.value) || 5));
        state.heightIn = Math.max(0, Math.min(11, parseInt(elements.heightInInput.value) || 0));
        calculate();
    }
    elements.heightFtInput.addEventListener('input', updateImperialHeight);
    elements.heightInInput.addEventListener('input', updateImperialHeight);

    // Weight Kg
    function updateWeightKg(val) {
        val = Math.max(20, Math.min(250, parseFloat(val) || 70));
        state.weightKg = val;
        elements.weightKgInput.value = val;
        elements.weightKgSlider.value = val;
        calculate();
    }
    elements.weightKgInput.addEventListener('input', (e) => updateWeightKg(e.target.value));
    elements.weightKgSlider.addEventListener('input', (e) => updateWeightKg(e.target.value));

    // Weight Lbs
    function updateWeightLbs(val) {
        val = Math.max(45, Math.min(550, parseFloat(val) || 154));
        state.weightLbs = val;
        elements.weightLbsInput.value = val;
        elements.weightLbsSlider.value = val;
        calculate();
    }
    elements.weightLbsInput.addEventListener('input', (e) => updateWeightLbs(e.target.value));
    elements.weightLbsSlider.addEventListener('input', (e) => updateWeightLbs(e.target.value));

    // Age & Gender
    elements.ageInput.addEventListener('input', (e) => {
        state.age = Math.max(2, Math.min(120, parseInt(e.target.value) || 28));
        calculate();
    });

    elements.genderSelect.addEventListener('change', (e) => {
        state.gender = e.target.value;
        calculate();
    });

    /* --------------------------------------------------------------------------
       Calculation Logic
       -------------------------------------------------------------------------- */
    function calculate() {
        let heightM = 0;
        let weightKg = 0;

        if (state.unit === 'metric') {
            heightM = state.heightCm / 100;
            weightKg = state.weightKg;
        } else {
            const totalInches = (state.heightFt * 12) + state.heightIn;
            heightM = (totalInches * 2.54) / 100;
            weightKg = state.weightLbs / 2.20462;
        }

        if (heightM <= 0) return;

        const bmi = weightKg / (heightM * heightM);
        const formattedBmi = bmi.toFixed(1);

        elements.bmiValue.textContent = formattedBmi;

        // Category Classification
        let category = 'Normal Weight';
        let statusClass = 'status-normal';
        let summaryText = 'Your weight is within the recommended healthy range for your height.';

        if (bmi < 18.5) {
            category = 'Underweight';
            statusClass = 'status-underweight';
            summaryText = 'Your weight is below the standard healthy range. Ensure balanced nutrition.';
        } else if (bmi >= 18.5 && bmi < 25.0) {
            category = 'Normal Weight';
            statusClass = 'status-normal';
            summaryText = 'Your weight is within the recommended healthy range for your height.';
        } else if (bmi >= 25.0 && bmi < 30.0) {
            category = 'Overweight';
            statusClass = 'status-overweight';
            summaryText = 'Your weight is above the healthy range. Regular activity and balanced diet can help.';
        } else {
            category = 'Obese';
            statusClass = 'status-obese';
            summaryText = 'Your BMI is 30 or above. Consider consulting a health professional for personalized guidance.';
        }

        elements.categoryBadge.textContent = category;
        elements.categoryBadge.className = `status-badge ${statusClass}`;
        elements.statusSummary.textContent = summaryText;

        // Scale Pointer Calculation (Range: 14 to 36)
        const minScale = 14;
        const maxScale = 36;
        const clampedBmi = Math.max(minScale, Math.min(maxScale, bmi));
        const percentage = ((clampedBmi - minScale) / (maxScale - minScale)) * 100;
        elements.scalePointer.style.left = `${percentage}%`;

        // Ideal Weight Range Calculation
        const minHealthyKg = 18.5 * (heightM * heightM);
        const maxHealthyKg = 24.9 * (heightM * heightM);

        if (state.unit === 'metric') {
            elements.idealWeight.textContent = `${minHealthyKg.toFixed(1)} – ${maxHealthyKg.toFixed(1)} kg`;
        } else {
            const minLbs = Math.round(minHealthyKg * 2.20462);
            const maxLbs = Math.round(maxHealthyKg * 2.20462);
            elements.idealWeight.textContent = `${minLbs} – ${maxLbs} lbs`;
        }
    }

    // Initial Trigger
    calculate();
});
