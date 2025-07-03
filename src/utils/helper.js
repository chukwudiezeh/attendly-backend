/**
 * Generates a unique random string of digits
 * @param {number} length - The length of digits to generate
 * @returns {string} The generated random digits
 */
const generateRandomDigits = (length = 6) => {
    if (length < 1) throw new Error('Length must be at least 1');

    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
  
    return random.toString();
};

module.exports = {
    generateRandomDigits
};