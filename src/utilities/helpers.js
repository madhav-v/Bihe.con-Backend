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
    if (!height || typeof height !== "string") {
      return null; 
    }

    const match = height.match(/\d+/);
    if (!match) {
      return null; 
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
