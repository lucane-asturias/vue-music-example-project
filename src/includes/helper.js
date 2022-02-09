export default {
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.round((time - minutes * 60) || 0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  },
};

/* 
 Seek example: 0:04
    4.210723 / 60 = 0.07017871666666667 (0) → minutes
    4.210723 - 0 * 60 = 4.210723 (4) → seconds
 
 Duration example: 2:49
    169.3 / 60 = 2.8216666666666668 (2) → minutes
    169.3 - 2 * 60 = 49.30000000000001 (49) → seconds
*/