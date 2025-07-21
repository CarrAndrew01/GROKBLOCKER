document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOMContentLoaded fired'); // Debug: Confirm DOM event

    const checkbox = document.getElementById('OnOffSwitch');
    if (checkbox) {
        // console.log('Checkbox found'); // Debug: Confirm element exists
        checkbox.addEventListener('change', function(event) {
            const isChecked = event.target.checked;
            // console.log(`Switch toggled to: ${isChecked ? 'ON' : 'OFF'}`); // Debug: Confirm toggle
            onSwitchToggle(isChecked);
        });
    } else {
        console.error('Checkbox with ID "OnOffSwitch" not found');
    }
});

function onSwitchToggle(isChecked) {
    

 
}