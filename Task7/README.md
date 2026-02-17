


#  JavaScript Utility Tasks



##  Project Overview

This project contains **7 beginner-friendly JavaScript tasks** focusing on:

* DOM manipulation
* Event handling
* Functions
* Number operations
* String manipulation
* Arrays

The goal of this project is to practice core JavaScript concepts by building small interactive utilities.

---

#  Features / Tasks

---

##  Age to Days Converter

* User selects their birth date using a **calendar input (`type="date"`)**
* The program calculates the total number of days from birth date until today.
* Uses JavaScript `Date` object and millisecond conversion.

###  Concepts Used:

* Date object
* Time difference calculation
* Math.floor()
* DOM manipulation

---

## Hours to Seconds Converter

* User enters number of hours.
* The program converts hours into seconds.

### Formula Used:

```
1 hour = 3600 seconds
```

###  Concepts Used:

* Arithmetic operations
* Input handling
* DOM output update

---

##  Find the Next Number

###  Scenario 1: Next Number in an Array

* Given an array and a specific number,
* The program returns the next element in the array.

Example:

```
Array: [10, 20, 30, 40]
Input: 20
Output: 30
```

---

###  Scenario 2: Single Value (Integer or Float)

* If user enters an **integer**, return next integer.
* If user enters a **float**, return next decimal value.

Example:

```
5 → 6
5.5 → 5.6
```

###  Concepts Used:

* Arrays
* indexOf()
* Number.isInteger()
* Conditional statements

---

## Capitalize First Letter of Name

* User enters name in lowercase.
* Program converts only the first letter to uppercase.

Example:

```
Input: zahra
Output: Zahra
```

### Concepts Used:

* String methods
* charAt()
* slice()
* toUpperCase()

---

##  BMI Calculator

* User enters:

  * Weight (kg)
  * Height (meters)
* Program calculates BMI.

### Formula Used:

```
BMI = weight / (height × height)
```

###  Concepts Used:

* Mathematical calculation
* toFixed()
* User input validation

---

##  Random Array Generator

* Program generates a random array.
* Displays:

  * First element
  * Last element

Example:

```
Generated Array: [12, 45, 78, 23, 9]
First Element: 12
Last Element: 9
```

###  Concepts Used:

* Math.random()
* Math.floor()
* Array indexing
* Loops

---

##  Three Text-Box Addition (Event Handling)

* User inputs numbers in two text boxes.
* The third text box automatically shows:

  * `sabar` when only first box is filled (like patience)
  * Correct addition when both boxes are filled

###  Concepts Used:

* addEventListener()
* parseFloat()
* isNaN() in my case i used "sabar" like have patience
* Real-time input handling

---

#  Technologies Used

* HTML5
* JavaScript (ES6)
* DOM Manipulation
* Event Handling

---

#  Learning Objectives

This project helps in understanding:

* JavaScript fundamentals
* Functions and conditions
* String and number manipulation
* Arrays and loops
* Event-driven programming
* Real-time DOM updates

---

#  Conclusion

This project demonstrates practical implementation of basic JavaScript concepts using small interactive tools. It strengthens understanding of:

* Functions
* User Input Handling
* DOM Manipulation
* Conditional Logic
* Event Handling

---

##  Developed By: Umam Zahra