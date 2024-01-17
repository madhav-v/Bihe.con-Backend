const helpers = {
  generateRandomString: (len = 100) => {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let length = chars.length;
    let random = "";
    for (let i = 1; i <= len; i++) {
      let posn = Math.floor(Math.random() * length);
      random += chars[posn];
    }
    return random;
  },
  calculateProfileAge: (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    return age;
  },

  calculateProfileHeight: (height) => {
    // Check if the height parameter is null or not a string
    if (!height || typeof height !== "string") {
      return null; // Or return a default value as per your requirement
    }

    // Extract the numerical value from the height string
    const match = height.match(/\d+/);
    if (!match) {
      return null; // Or return a default value as per your requirement
    }

    const heightInCm = parseInt(match[0], 10);
    return heightInCm;
  },

  calculateTotalScore: (weightedScores) => {
    return weightedScores.reduce((sum, score) => sum + score, 0);
  },

  normalize: (value, min, max) => {
    return (value - min) / (max - min);
  },
};

module.exports = helpers;
