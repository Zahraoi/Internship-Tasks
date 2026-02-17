
        // Set max date for birthdate input to today
        document.getElementById('birthdate').max = new Date().toISOString().split('T')[0];


        
        // 1...... Age to Days Converter
        function convertAgeToDays() {
            const birthdate = document.getElementById('birthdate').value;
            if (!birthdate) {
                document.getElementById('ageResult').innerHTML = ' Please select a birthdate bhai';
                return;
            }

            const birthDate = new Date(birthdate);
            const today = new Date();
            const diffTime = Math.abs(today - birthDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const years = Math.floor(diffDays / 365.25);

            document.getElementById('ageResult').innerHTML = 
                ` You are <strong> ${years} </strong> years old` +
                ` and that's <strong> ${diffDays} </strong> days!`;
        }



        // 2............. Hours to Seconds Converter
        function convertHoursToSeconds() {
            const hours = parseFloat(document.getElementById('hours').value);
            if (isNaN(hours)) {
                document.getElementById('hoursResult').innerHTML = ' Pleaseee enter a valid number';
                return;
            }

            const seconds = hours * 3600;
            document.getElementById('hoursResult').innerHTML = 
                ` <strong>${hours}</strong> hour(s) = <strong>${seconds}</strong> seconds`;
        }

        // 3......... Toggle Next Number Scenarios
        function toggleNextNumScenario() {
            const scenario = document.getElementById('nextNumScenario').value;
            if (scenario === 'array') {
                document.getElementById('arrayScenario').style.display = 'block';
                document.getElementById('singleScenario').style.display = 'none';
            } else {
                document.getElementById('arrayScenario').style.display = 'none';
                document.getElementById('singleScenario').style.display = 'block';
            }
            document.getElementById('nextNumResult').innerHTML = 'Result will appear hereee...';
        }

        // 3a................ Find Next Number in Array
        function findNextInArray() {
            const arrayInput = document.getElementById('arrayInput').value;
            const targetNum = parseFloat(document.getElementById('targetNum').value);

            if (!arrayInput || isNaN(targetNum)) {
                document.getElementById('nextNumResult').innerHTML = ' Pleaseee enter both array and target number';
                return;
            }

            const array = arrayInput.split(',').map(item => parseFloat(item.trim())).filter(num => !isNaN(num));
            
            if (array.length === 0) {
                document.getElementById('nextNumResult').innerHTML = 'Pleaseee enter a valid array';
                return;
            }

            const index = array.indexOf(targetNum);
            
            if (index === -1) {
                document.getElementById('nextNumResult').innerHTML = 
                    ` Number <strong>${targetNum}</strong> not found in array`;
            } else if (index === array.length - 1) {
                document.getElementById('nextNumResult').innerHTML = 
                    ` <strong>${targetNum}</strong> is the last element. No next number available.`;
            } else {
                document.getElementById('nextNumResult').innerHTML = 
                    ` Next number after <strong>${targetNum}</strong> is <strong>${array[index + 1]}</strong>`;
            }
        }



        // 3b................ Find Next Number (Single Value)
        function findNextNumber() {
            const input = document.getElementById('singleNum').value;
            
            if (!input) {
                document.getElementById('nextNumResult').innerHTML = ' Pleaseee enter a number';
                return;
            }

            const num = parseFloat(input);
            
            if (isNaN(num)) {
                document.getElementById('nextNumResult').innerHTML = ' Pleaseee enter a valid number';
                return;
            }

            // Check if it's an integer or float
            if (Number.isInteger(num)) {
                const nextNum = num + 1;
                document.getElementById('nextNumResult').innerHTML = 
                    ` <strong>${num}</strong> is an integer<br>` +
                    ` Next number: <strong>${nextNum}</strong>`;
            } else {
                // For float, we'll add the smallest increment
                const nextNum = num + 0.1;
                document.getElementById('nextNumResult').innerHTML = 
                    `<strong>${num}</strong> is a float<br>` +
                    ` Next number: <strong>${nextNum.toFixed(1)}</strong>`;
            }
        }

        // 4........... Name Capitalizer
        function capitalizeName() {
            const name = document.getElementById('nameInput').value;
            
            if (!name) {
                document.getElementById('nameResult').innerHTML = ' Pleaseee enter a name';
                return;
            }

            // Check if name contains uppercase letters
            if (name !== name.toLowerCase()) {
                document.getElementById('nameResult').innerHTML = 
                    ' Pleaseee enter the name in lowercase only!';
                return;
            }

            // Capitalize first letter of each word
            const capitalizedName = name
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            document.getElementById('nameResult').innerHTML = 
                ` Capitalized Name: <strong>${capitalizedName}</strong>`;
        }



        // 5.............. BMI Calculator
        function calculateBMI() {
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);

            if (isNaN(weight) || isNaN(height)) {
                document.getElementById('bmiResult').innerHTML = ' Pleaseee enter valid weight and height';
                return;
            }

            if (weight <= 0 || height <= 0) {
                document.getElementById('bmiResult').innerHTML = ' Pleaseee weight and height must be positive numbers';
                return;
            }

            const bmi = weight / (height * height);
            let category = '';
            
            if (bmi < 18.5) {
                category = 'Underweight';
            } else if (bmi >= 18.5 && bmi < 25) {
                category = 'Normal weight';
            } else if (bmi >= 25 && bmi < 30) {
                category = 'Overweight';
            } else {
                category = 'Obese (you got this!)';
            }

            document.getElementById('bmiResult').innerHTML = 
                ` Your BMI: <strong>${bmi.toFixed(2)}</strong><br>` +
                ` Category: <strong>${category}</strong>`;
        }



        // 6................. Generate Random Array and Pick First & Last
        function generateAndPickElements() {
            const size = parseInt(document.getElementById('arraySize').value);
            
            if (isNaN(size) || size < 2) {
                document.getElementById('arrayResult').innerHTML = ' Pleaseee enter a valid array size (minimum 2)';
                return;
            }

            // Generate random array
            const randomArray = [];
            for (let i = 0; i < size; i++) {
                randomArray.push(Math.floor(Math.random() * 100) + 1);
            }

            // Display array
            document.getElementById('generatedArray').innerHTML = 
                `Generated Array: [${randomArray.join(', ')}]`;

            // Pick first and last elements
            const firstElement = randomArray[0];
            const lastElement = randomArray[randomArray.length - 1];

            document.getElementById('arrayResult').innerHTML = 
                ` First Element: <strong>${firstElement}</strong><br>` +
                ` Last Element: <strong>${lastElement}</strong>`;
        }



        // 7.............. Three Textbox Addition with Event Handling
        function calculateSum() {
            const num1 = parseFloat(document.getElementById('num1').value);
            const num2 = parseFloat(document.getElementById('num2').value);
            const sumField = document.getElementById('sum');

            // If first box has value but second doesn't, show NaN
            if (!isNaN(num1) && isNaN(num2)) {
                sumField.value = 'sabarr';
            } 
            // If both have values, show sum
            else if (!isNaN(num1) && !isNaN(num2)) {
                sumField.value = num1 + num2;
            }
            // If first box is empty
            else {
                sumField.value = '';
            }
        }
