export function getDateRange(range = "MONTH") {
    const now = new Date();
  
    // Normalize time
    now.setHours(23, 59, 59, 999);
  
    let start;
    let end = now;
  
    switch (range) {
      case "TODAY": {
        start = new Date();
        start.setHours(0, 0, 0, 0);
        break;
      }
  
      case "MONTH": {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        break;
      }
  
      case "YEAR": {
        start = new Date(now.getFullYear(), 0, 1);
        start.setHours(0, 0, 0, 0);
        break;
      }
  
      default: {
        // 🔒 SAFETY NET (IMPORTANT)
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        break;
      }
    }
  
    return { start, end };
  }
  