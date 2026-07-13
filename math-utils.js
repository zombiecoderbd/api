"use strict";

/**
 * math-utils.js — v1.0.0
 * Mathematical utility functions for Mission Barisal API.
 *
 * This module provides basic arithmetic operations with comprehensive
 * documentation, type validation, and error handling. Each function
 * follows the JSDoc standard for API documentation generation.
 *
 * ─── API ─────────────────────────────────────────────────────
 *   add(a, b)         — Add two numbers and return their sum
 *   subtract(a, b)    — Subtract b from a and return result
 *   multiply(a, b)    — Multiply two numbers and return product
 *   divide(a, b)      — Divide a by b and return quotient
 * ─────────────────────────────────────────────────────────────
 *
 * @module math-utils
 * @version 1.0.0
 * @author Documentation King - Halim (Mission Barisal)
 * @license MIT
 *
 * @example
 * const { add, subtract } = require('./math-utils');
 * console.log(add(5, 3)); // Output: 8
 * console.log(subtract(10, 4)); // Output: 6
 */

// ─── Input Validation Helpers ────────────────────────────────

/**
 * Validate that input is a finite number.
 *
 * @param {*} value - Value to validate
 * @param {string} paramName - Parameter name for error messages
 * @throws {TypeError} If value is not a finite number
 * @returns {number} The validated number
 */
function validateNumber(value, paramName) {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    throw new TypeError(
      `Invalid ${paramName}: Expected a finite number, got ${typeof value === 'number' ? 'NaN/Infinity' : typeof value}`
    );
  }
  return value;
}

// ─── Public API ──────────────────────────────────────────────

/**
 * Add two numbers and return their sum.
 *
 * This function performs arithmetic addition of two finite numbers.
 * It includes comprehensive input validation and follows the
 * JavaScript specification for number addition.
 *
 * @param {number} a - First addend (must be a finite number)
 * @param {number} b - Second addend (must be a finite number)
 * @returns {number} The sum of a and b
 * @throws {TypeError} If either parameter is not a finite number
 *
 * @example
 * // Basic usage
 * add(2, 3); // Returns: 5
 *
 * @example
 * // With negative numbers
 * add(-5, 10); // Returns: 5
 *
 * @example
 * // With decimal numbers
 * add(0.1, 0.2); // Returns: 0.30000000000000004 (floating-point precision)
 *
 * @example
 * // Error handling
 * try {
 *   add('2', 3); // Throws TypeError
 * } catch (error) {
 *   console.error(error.message); // "Invalid a: Expected a finite number, got string"
 * }
 */
function add(a, b) {
  // Validate inputs before operation
  validateNumber(a, 'a');
  validateNumber(b, 'b');

  // Perform addition
  const result = a + b;

  // Safety check: ensure result is finite (overflow protection)
  if (!isFinite(result)) {
    throw new Error(
      `Arithmetic overflow: ${a} + ${b} resulted in ${result}`
    );
  }

  return result;
}

/**
 * Subtract b from a and return the result.
 *
 * @param {number} a - Minuend (must be a finite number)
 * @param {number} b - Subtrahend (must be a finite number)
 * @returns {number} The difference (a - b)
 * @throws {TypeError} If either parameter is not a finite number
 */
function subtract(a, b) {
  validateNumber(a, 'a');
  validateNumber(b, 'b');

  const result = a - b;

  if (!isFinite(result)) {
    throw new Error(
      `Arithmetic overflow: ${a} - ${b} resulted in ${result}`
    );
  }

  return result;
}

/**
 * Multiply two numbers and return the product.
 *
 * @param {number} a - Multiplicand (must be a finite number)
 * @param {number} b - Multiplier (must be a finite number)
 * @returns {number} The product of a and b
 * @throws {TypeError} If either parameter is not a finite number
 */
function multiply(a, b) {
  validateNumber(a, 'a');
  validateNumber(b, 'b');

  const result = a * b;

  if (!isFinite(result)) {
    throw new Error(
      `Arithmetic overflow: ${a} * ${b} resulted in ${result}`
    );
  }

  return result;
}

/**
 * Divide a by b and return the quotient.
 *
 * @param {number} a - Dividend (must be a finite number)
 * @param {number} b - Divisor (must be a finite number, cannot be zero)
 * @returns {number} The quotient (a / b)
 * @throws {TypeError} If either parameter is not a finite number
 * @throws {Error} If divisor is zero (division by zero)
 */
function divide(a, b) {
  validateNumber(a, 'a');
  validateNumber(b, 'b');

  if (b === 0) {
    throw new Error('Division by zero: divisor cannot be 0');
  }

  const result = a / b;

  if (!isFinite(result)) {
    throw new Error(
      `Arithmetic overflow: ${a} / ${b} resulted in ${result}`
    );
  }

  return result;
}

// ─── Module Exports ──────────────────────────────────────────

module.exports = {
  add,
  subtract,
  multiply,
  divide,
};

// ─── Usage Example (when run directly) ──────���───────────────

if (require.main === module) {
  console.log('=== Math Utils Demo ===');
  console.log('add(5, 3) =', add(5, 3));
  console.log('subtract(10, 4) =', subtract(10, 4));
  console.log('multiply(6, 7) =', multiply(6, 7));
  console.log('divide(15, 3) =', divide(15, 3));

  // Example with error handling
  try {
    console.log(add('invalid', 5));
  } catch (error) {
    console.log('Expected error:', error.message);
  }
}